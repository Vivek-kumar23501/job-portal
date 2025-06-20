import  { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      try {
        await API.get(`/auth/verify-email?token=${token}&email=${email}`);
      } catch (err) {
        console.error(err.response?.data?.msg || 'Verification failed');
      }
    };
    verify();
  }, [searchParams]);

  return null; // Page stays blank
};

export default VerifyEmail;
