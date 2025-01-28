import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RealtorApp from '../Realtor/RealtorApp';
import '../../styles/MainPage/MainPage.css';

function MainPage({ user, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/realtor');
    }
  }, [user, navigate]);

  return <RealtorApp user={user} onLogout={onLogout} />;
}

export default MainPage;
