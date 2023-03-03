import React from 'react'
// import {useAuth} from '../context/AuthContext';
import { useAuthContext } from '../hooks/useAuthContext';

function TrendingPage() {
  // const {user, setUser} = useAuth();
  // const {auth} = useAuth();
  const { user } = useAuthContext();

  return (
    <div>
      TrendingPage
      {user && (
        <div>Hello {user}!</div>
      )}
    </div>
  )
}

export default TrendingPage