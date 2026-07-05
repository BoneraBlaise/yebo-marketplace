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
    <div>
      <Helmet>
        <title>Sign Up | Yebone</title>
        <meta name="description" content="Create your Yebone account and start shopping premium products." />
      </Helmet>
      <Signup />
    </div>
  )
}

export default SignupPage