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
    <div className="yebone-premium-screen">
    <Helmet>
        <title>Login | YEBONE</title>
        <meta name="description" content="Login to your YEBONE account to access orders, wishlist, and AI previews." />
        <meta property="og:title" content="Login | YEBONE" />
        <meta property="og:description" content="Sign in to YEBONE — Africa's AI-powered marketplace." />
      </Helmet>

        <Login />
    </div>
  )
}

export default LoginPage;