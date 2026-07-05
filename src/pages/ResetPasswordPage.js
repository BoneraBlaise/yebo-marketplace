import React from 'react'
import ResetPassword from '../components/Login/ResetPassword';
import { Helmet } from 'react-helmet';

const ResetPasswordPage = () => {
  return (
    <div>
      <Helmet>
        <title>Reset Password | Yebone</title>
        <meta name="description" content="Set a new password for your Yebone account." />
      </Helmet>
      <ResetPassword/>
    </div>
  )
}

export default ResetPasswordPage