import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from "../components/Login/Login.jsx";
import { Helmet } from 'react-helmet';
const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [])
  
  return (
    <div>
    <Helmet>
        <title>Login | Guriraline</title>
        <meta name="description" content="Login to your Guriraline account to access your orders and profile." />
        <meta property="og:title" content="Login | Guriraline" />
        <meta property="og:description" content="Login to Guriraline for personalized shopping experience." />
      </Helmet>

        <Login />
    </div>
  )
}

export default LoginPage;