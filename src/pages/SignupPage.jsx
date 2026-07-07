import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Signup from "../components/Signup/Signup";
import { Helmet } from 'react-helmet';

const SignupPage = () => {
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
        <title>Sign Up | YEBONE</title>
        <meta name="description" content="Create your YEBONE account and start shopping with AI-powered previews." />
      </Helmet>
      <Signup />
    </div>
  )
}

export default SignupPage