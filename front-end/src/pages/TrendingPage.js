import React, { useContext } from 'react'
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from '../hooks/useAuthContext';

function TrendingPage() {
  const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`trendingPage ${ifDarkMode && "darkTheme"}`}>
      TrendingPage
      {user && (
        <div>Hello {user.username}!</div>
      )}
    </div>
  )
}

export default TrendingPage