import React from 'react'
import {useAuth} from '../AuthContext';

function TrendingPage() {
  const {user, setUser} = useAuth();
  const {auth} = useAuth();

  return (
    <div>
      TrendingPage
      {auth && (
        <div>Hello {user}!</div>
      )}
    </div>
  )
}

export default TrendingPage