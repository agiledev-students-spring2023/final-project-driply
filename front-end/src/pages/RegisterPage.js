import React, { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

function RegisterPage() {
  const { ifDarkMode } = useContext(DarkModeContext);
  return (
    <div className={ifDarkMode && "darkTheme"}>
        Login Page
    </div>
  )
}

export default RegisterPage;