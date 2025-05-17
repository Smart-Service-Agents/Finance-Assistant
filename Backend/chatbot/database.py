from dotenv import load_dotenv
import os, json, pyodbc, hashlib


class Database:
    def __init__(self):
        self.question = None
        self.answer = None

        self.userid = None

        self.request = None

        load_dotenv()

    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()
    
    def save_user(self, user_id, password):
        self.userid = user_id
        password_hash = self.hash_password(password)

        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            if cursor.fetchone():
                return {'error': 'User already exists', 'status': 409}

            cursor.execute(
                "INSERT INTO users (user_id, password_hash) VALUES (?, ?)",
                (user_id, password_hash)
            )
            conn.commit()
            cursor.close()
            conn.close()
            return {'status': 201, 'message': 'User created successfully'}

        except Exception as e:
            return {'error': 'Error creating user', 'details': str(e), 'status': 500}
        

    def login_user(self, user_id, password):
        password_hash = self.hash_password(password)

        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT password_hash FROM users WHERE user_id = ?", (user_id,))
            result = cursor.fetchone()

            cursor.close()
            conn.close()

            if result is None:
                return {'error': 'User not found', 'status': 404}

            stored_hash = result[0]
            if stored_hash == password_hash:
                return {'status': 200, 'message': 'Login successful'}
            else:
                return {'error': 'Invalid credentials', 'status': 401}

        except Exception as e:
            return {'error': 'Error during login', 'details': str(e), 'status': 500}


    def save_query(self, request, question, answer):
        self.question = question
        self.answer = answer

        self.request = request

        self.upload_query()

    def get_db_connection(self):
        conn = pyodbc.connect(
            f"DRIVER=ODBC Driver 18 for SQL Server;"
            f"SERVER={os.getenv('DB_HOST')};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')};"
            "TrustServerCertificate=yes;"
        )
        return conn
    
    def authenticate(self, request):
        api_key = request.headers.get('Master-Key')
        if not api_key or api_key != os.getenv('MASTER_KEY'):
            return {'error': 'Forbidden: Invalid API Key', 'status': 403}
        else:
            return {'status': 200}


    def upload_query(self):
        auth_response = self.authenticate(self.request)
        if auth_response['status'] != 200:
            return auth_response['error']
        
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()

            query = """
                INSERT INTO questions (
                    user_id, question, answer,
                    created_at, modified_at
                )
                VALUES (?, ?, ?, GETDATE(), GETDATE())
            """

            values = (
                self.userid, self.question, self.answer
            )

            cursor.execute(query, values)
            conn.commit()
            
            cursor.close()
            conn.close()
            return {'status': 200, 'message': 'Query uploaded successfully'}

        except Exception as e:
            return {'error': 'Internal Server Error', 'details': str(e), 'status': 500}