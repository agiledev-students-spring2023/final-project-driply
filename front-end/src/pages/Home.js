import React from 'react';
import {useAuth} from '../AuthContext';

function Home() {
  const {user, setUser} = useAuth();
  const {auth} = useAuth();

  return (
    <div>
        Home Page
        {auth && (
          <div>Hello {user}!</div>
        )}
    </div>
  )
}

export default Home;