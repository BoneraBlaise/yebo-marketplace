import React from 'react'
import ForgotPassword from '../components/Login/ForgotPassword';
import { Helmet } from 'react-helmet';

const ForgotPasswordPage = () => {
  return (
    <div>
      <Helmet>
        <title>Forgot Password | Yebone</title>
        <meta name="description" content="Reset your Yebone account password." />
      </Helmet>
      <ForgotPassword/>
    </div>
  )
}

export default ForgotPasswordPage