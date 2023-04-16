import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  let navigate = useNavigate();
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (username, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: username, password })
    })
    const json = await response.json()
    console.log(json)

    if (!json.success) {
      setIsLoading(false)
      setError(json.message)
    }
    if (response.ok) {
      // save the user to local storage
      const { token, username, id } = json;
      const user  = {token, username, id}
      localStorage.setItem('user', JSON.stringify(user))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
      navigate('/')
    }
  }

  return { login, isLoading, error }
}