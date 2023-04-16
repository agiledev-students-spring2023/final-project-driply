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
    
    const response = await fetch('http://localhost:4000/auth/signup', {
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
      console.log(json)
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
      navigate('/')
    }
  }

  return { signup, isLoading, error }
}