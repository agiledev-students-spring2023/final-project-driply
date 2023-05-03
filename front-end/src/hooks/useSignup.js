import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useSignup = () => {
  let navigate = useNavigate();
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (username, password) => {
    setIsLoading(true)
    setError(null)
    
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name:username, password })
    })
    const json = await response.json()
    console.log(json)

    if (!json.success) {
      setIsLoading(false)
      setError(json.message)
    }
    if (response.ok) {
      // save the user to local storage
      const { token, username, id, profilePic } = json;
      const user  = {token, username, id, profilePic};
      localStorage.setItem('user', JSON.stringify(user));

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
      navigate('/')
    }
  }

  return { signup, isLoading, error }
}