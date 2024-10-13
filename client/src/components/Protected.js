import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Protected({children}) {
  const url = `${baseUrl}/api/auth`;
  const { loading, setLoading, loggedIn, setLoggedIn, fetchUser } = useContext(AuthContext)
  const navigate  = useNavigate()

  useEffect(() => {
    const checkLoginStatus = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      };
      try {
        const response = await fetch(`${url}/isloggedin`, requestOptions);
        const data = await response.json();
        if (data.success) {
          setLoggedIn(true);
          await fetchUser(token);
        } else {
          setLoggedIn(false);
          navigate('/login', {replace: true})
        }
      } catch (error) {
        console.log(error);
        navigate('/login', {replace: true})
      }
      finally {
        setLoading(false)
      }
    };

    if(!loggedIn)
      checkLoginStatus()
  }, [loggedIn, navigate])

  if(loading) {
    return (
    <div>Loading...</div>
  )}

  return loggedIn ? children : null;
}

export default Protected