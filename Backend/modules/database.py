from dotenv import load_dotenv
import os
import psycopg2
import hashlib
import json

config_path = os.path.join(os.path.dirname(__file__), "config.json")

class Database:
    def __init__(self):
        with open(config_path, "r") as file:
            self.config = json.load(file)
        
        load_dotenv()

    def hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()

    def get_db_connection(self):
        return psycopg2.connect(
            host=self.config['DatabaseHost'],
            dbname=self.config['DatabaseName'],
            user=self.config['DatabaseUser'],
            password=self.config['DatabasePassword'],
            port=self.config['DatabasePort'],
            sslmode=self.config['DatabaseSSLMode']
        )

    def authenticate(self, key) -> dict:
        api_key = key
        if not api_key or api_key != os.getenv('MASTER_KEY'):
            return {'error': 'Forbidden: Invalid API Key', 'status': 403}
        return {'status': 200}

    def save_user(self, user_id: str, password: str, email: str, city: str, region: str, key) -> dict:
        password_hash = self.hash_password(password)
        auth = self.authenticate(key)
        if auth['status'] != 200:
            return auth

        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        "SELECT 1 FROM users WHERE user_id = %s AND email = %s",
                        (user_id, email)
                    )
                    if cursor.fetchone():
                        return {'error': 'User already exists', 'status': 409}
                    cursor.execute(
                        "INSERT INTO users (email, user_id, password_hash, region, city, created_at) VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)",
                        (email, user_id, password_hash, region, city)
                    )
            return {'status': 200, 'message': 'User created successfully'}
        except Exception as e:
            return {'error': 'Error creating user', 'details': str(e), 'status': 500}

    def login_user(self, user_id: str, password: str, email: str, key) -> dict:
        password_hash = self.hash_password(password)
        auth = self.authenticate(key)
        if auth['status'] != 200:
            return auth

        try:
            result = None
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        "SELECT password_hash, city, region FROM users WHERE user_id = %s AND email = %s",
                        (user_id, email)
                    )
                    result = cursor.fetchone()

            if not result:
                return {'error': 'User not found', 'status': 404}

            stored_hash = result[0]
            if stored_hash == password_hash:
                return {'status': 200, 'message': 'Login successful', 'user': user_id, 'city': result[1], 'region': result[2]}
            else:
                return {'error': 'Invalid credentials', 'status': 401}

        except Exception as e:
            return {'error': 'Error during login', 'details': str(e), 'status': 500}

    def upload_reviews(self, user_id: str, reviews: dict, key) -> dict:
        auth = self.authenticate(key)
        if auth['status'] != 200:
            return auth
        
        try:
            platform = reviews['platform']
            author = reviews['author']
            rating = reviews['rating']
            text = reviews['text']
            title = reviews['title']
            helpfulVotes = reviews['helpfulVotes']
        except KeyError as ke:
            return {'message': f'Missing field: {ke}', 'status': 400}

        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT * FROM reviews WHERE
                        hotel = %s AND
                        platform = %s AND
                        title = %s AND
                        author = %s AND
                        rating = %s AND
                        text = %s AND
                        helpfulVotes = %s
                        """,
                        (user_id, platform, title, author, rating, text, helpfulVotes)
                    )

                    if cursor.fetchone():
                        return {'message': 'entry already exists', 'status': 200}

                    cursor.execute(
                        """
                        INSERT INTO reviews 
                        (hotel, platform, title, author, rating, text, helpfulVotes, creationDate) 
                        VALUES 
                        (%s,%s,%s,%s,%s,%s,%s,CURRENT_TIMESTAMP)
                        """,
                        (user_id, platform, title, author, rating, text, helpfulVotes)
                    )

            return {'message': 'successfully updated data', 'status': 200}
        except Exception as e:
            return {'message': 'error uploading data', 'error': str(e), 'status': 500}
        
    def fetch_reviews(self, hotel_id: str, key) -> dict:
        auth = self.authenticate(key)

        if (auth != 200):
            return auth
        
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT * from reviews WHERE
                        hotel = %s
                        """, (hotel_id)
                    )
                    result = cursor.fetchall()
                    if result:
                        return {'message': 'all entries found', 'reviews': result,'status': 200}
        except Exception as e:
            return {'message': 'Error occured while contacting database', 'error': str(e), 'status':500}