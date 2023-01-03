import React, { useContext,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

function Home() {
  const {loggedIn} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(loggedIn) {
      navigate('/user', {replace: true});
    }
    else {
      navigate('/signup', {replace: true});
    }
  
  }, [loggedIn])

  return (
    <>
    </>
  )
}

export default Home