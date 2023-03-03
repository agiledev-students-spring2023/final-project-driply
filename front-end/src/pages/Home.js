import React from 'react';
// import {useAuth} from '../context/AuthContext';
import { useAuthContext } from '../hooks/useAuthContext';

function Home() {
  // const {user, setUser} = useAuth();
  // const {auth} = useAuth();
  const { user } = useAuthContext();

  return (
    <div>
        Home Page
        {user && (
          <div>Hello! {user.username}</div>
        )}
    </div>
  )
}

export default Home;