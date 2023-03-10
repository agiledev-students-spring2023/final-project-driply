import { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { clearDarkMode } = useContext(DarkModeContext);

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')
    clearDarkMode();

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
  }

  return { logout }
}