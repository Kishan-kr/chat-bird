import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function About(props) {
  const navigate = useNavigate();
    const [open, setOpen ]= useState(false);
    const {user, setLoggedIn} = useContext(AuthContext);

    const toggleOpen = () => {
      props.infoSide.current.classList.toggle('expand');
      setOpen((prevState) => {
        if (prevState === false) {
          return true;
        } else {
          return false;
        }
      });
    }
    // const toggleInfo = () => {
    //     props.infoSide.current.classList.toggle('expand');
    //     setBars((prevState) => {
    //         if (prevState === 'xmark') {
    //           return 'bars';
    //         } else {
    //           return 'xmark';
    //         }
    //       });
    // }

    const logout = () => {
      localStorage.removeItem('token');
      setLoggedIn(false)
      navigate('/login', {replace: true});
    }

  return (
    <div className='d-flex flex-column'>
        <div className="d-flex justify-content-between align-items-center mx-1 shadow-1">
          <button className='logout ms-1 size-6' onClick={logout}>Logout</button>
          {open? 
          <button className='btn bars border-0 my-1 px-2' onClick={toggleOpen}>
              <i className={`fa-solid fa-xmark`}></i>
          </button> :
          <div className="pic-container my-2 border rounded-circle border-success pointer"
            onClick={toggleOpen}>
            <img className='pic' src={user.pic} alt="" />
          </div>
          }
            
        </div>
        <div className="p-2 m-2 shadow- text-gray info">
            <div className="pic-container my-2 border rounded-circle border-success">
                <img className='pic' src={user.pic} alt="" />
            </div>
            <p className="my-3 size-4 fw-semibold text-wrap" title='name'>{user.name}</p>
            <p className="my-2 size-5 text-break" title='email'>{user.email}</p>
        </div>
    </div>
  )
}

export default About