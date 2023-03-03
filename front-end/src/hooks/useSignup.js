import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (username, password) => {
    setIsLoading(true)
    setError(null)

    // save the user to local storage
    localStorage.setItem('user', JSON.stringify({ user: username }))

    // update the auth context
    dispatch({type: 'LOGIN', payload: { user: username }})

    // update loading state
    setIsLoading(false)

    
    /*
    will be using this code for when backend is created for creating new user accounts
    */
    // const response = await fetch('/api/accounts/signup', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({ email, password })
    // })
    // const json = await response.json()

    // if (!response.ok) {
    //   setIsLoading(false)
    //   setError(json.error)
    // }
    // if (response.ok) {
    //   // save the user to local storage
    //   localStorage.setItem('user', JSON.stringify(json))
    //   localStorage.setItem('sliderValue', JSON.stringify(json.userSliderValue))

    //   // update the auth context
    //   dispatch({type: 'LOGIN', payload: json})

    //   // update loading state
    //   setIsLoading(false)
    // }
  }

  return { signup, isLoading, error }
}