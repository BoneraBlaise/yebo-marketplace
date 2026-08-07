import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { syncVendorAuthToken } from "../../config/vendorSession";
import { clearSellerSessionSkip, tryResumeSellerSession } from "../../utils/sellerSession";
import { server } from "../../server";
import { toast } from 'react-toastify';

const LoginSuccessHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      toast.error(error === 'google_auth_failed' 
        ? 'Google authentication failed' 
        : decodeURIComponent(error));
      navigate('/login');
      return;
    }

    const completeOAuthLogin = async () => {
      try {
        const { data } = await axios.get(`${server}/user/getuser`, {
          withCredentials: true,
        });

        if (data.token) {
          syncVendorAuthToken(data.token);
        }

        dispatch({
          type: 'LoadUserSuccess',
          payload: data.user,
        });
        clearSellerSessionSkip();
        await dispatch(tryResumeSellerSession());

        const isNewGoogleUser = searchParams.get('newUser') === '1';
        if (isNewGoogleUser) {
          toast.success('Welcome to YEBONE');
          navigate('/');
          return;
        }

        toast.success('Login Successful!');
        const redirectUrl = searchParams.get('redirect') || '/profile';
        navigate(redirectUrl);
      } catch (err) {
        console.error('[LoginSuccess] OAuth session restore failed', err);
        toast.error('Login failed - please try again');
        navigate('/login');
      }
    };

    completeOAuthLogin();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your login...</p>
      </div>
    </div>
  );
};

export default LoginSuccessHandler;
