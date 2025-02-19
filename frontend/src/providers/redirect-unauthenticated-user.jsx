/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';
import { useNavigate } from 'react-router';

const RedirectUnauthenticatedUser = ({ children }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default RedirectUnauthenticatedUser;
