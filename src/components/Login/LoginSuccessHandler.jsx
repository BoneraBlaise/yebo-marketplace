import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken } from "../../config/authStorage";
import { loadUser } from "../../redux/actions/user";
import { toast } from 'react-toastify';

const LoginSuccessHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error(error === 'google_auth_failed' 
        ? 'Google authentication failed' 
        : 'Authentication failed');
      navigate('/login');
      return;
    }

    if (token) {
      setAuthToken(token);
      dispatch(loadUser());
      toast.success('Login Successful!');
      
      const redirectUrl = searchParams.get('redirect') || '/profile';
      navigate(redirectUrl);
    } else {
      toast.error('Login failed - No token received');
      navigate('/login');
    }
  }, [dispatch, navigate, searchParams, location]);

  // Show a loading state while processing
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