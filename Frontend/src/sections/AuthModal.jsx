import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '../components/DefaultModal/Modal';
import AuthModalBody from '../components/AuthModal/AuthModalBody';

export default function AuthModal({onClose, isModalOpen}){
  const [isLogin, setIsLogin] = useState(true);
  const [isProcessing, setProcessing] = useState(false);

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    hotel: '',
    email: '',
    password: '',
    city: '',
    country: ''
  });

  const navigate = useNavigate();

  const clearForm = function(){
    setFormData({
      hotel: '',
      email: '',
      password: '',
      city: '',
      country: ''
    });

    setProcessing(false);
  }

  const clearError = function(){
    setError('');
  }

  const switchMode = function(mode) {
    setIsLogin(mode);
    
    clearForm();
    clearError();
  }

  const submitForm = async function(){
    setProcessing(true);

    let authenticated = false;

    try{
      const _body_ = {
        hotel:formData.hotel,
        email:formData.email,
        password:formData.password,
        city:formData.city,
        country:formData.country,
        method:'',
        master:'rey-master-eo'
      }

      _body_.method = isLogin? 'login':'register';

      const uri = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_AUTHENTICATION_PATH

      const response = await fetch(uri,
        {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(_body_),
        }
      )
      const data = await response.json()
      
      if (response.ok){
        if (data.status !== 200){
          setError(data.error);
        }
        else {
          if (isLogin){
            formData.city = data.city;
            formData.country = data.region;
          }

          authenticated = true;
          
          localStorage.removeItem('reviews_cache');
          localStorage.removeItem('reviews_ts');
          
          clearError();
        }
      }

    } catch(e){
      setError('Failed to reach the backend server!\nTry again later.');
    }

    clearForm();
    if (authenticated){
      const maxAge = 7 * 24 * 60 * 60;

      document.cookie = `hotel=${encodeURIComponent(formData.hotel)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
      document.cookie = `email=${encodeURIComponent(formData.email)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
      document.cookie = `city=${encodeURIComponent(formData.city)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
      document.cookie = `country=${encodeURIComponent(formData.country)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
      document.cookie = `authenticated=${encodeURIComponent(true)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;

      console.log('redirecting');
      navigate('/dashboard');
    }
  }

  const onInputChange = function(e){
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const message = (isLogin? 'Welcome Back!\n':'Join our Network!\n');

  return(
    <Modal
      isModalOpen={isModalOpen}
      onClose={onClose}
      ModalHeaderText={message}
      ModalHeaderError={error}
      Body={
        <AuthModalBody 
          formData={formData}
          isLogin={isLogin}
          isProcessing={isProcessing} 
          switchMode={switchMode} 
          handleSubmit={submitForm} 
          handleInputChange={onInputChange}
        />
      }
    />
  );
}