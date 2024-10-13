import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';

function Person(props) {
  const {openedChatId, setOpenedChatId, setChatPerson } = useContext(ChatContext);
  const {member, chatId, lastMessage} = props;
  const [time, setTime] = useState('');
  const navigate = useNavigate();
  
  const formatTime = () => {
    var tm;
    let date = new Date(lastMessage.createdAt)
    var currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    
    if(year === date.getFullYear() && month === date.getMonth() && day === date.getDate()) {
      tm = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    else if(year === date.getFullYear() && month === date.getMonth() && date.getDate()+7 > day) {
      tm = date.toLocaleString('en-US', {
        weekday: 'short',
      })
    }
    else if(year === date.getFullYear()) {
      tm = date.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
      })
    }
    else {
      tm = date.toLocaleString('en-US', {
        year: 'numeric',
      })
    }
    
    setTime(tm);
  }

  const handlePerson = () => {
    navigate(`/user/chat/${chatId}`, {replace : true});
    setChatPerson(member);
    // setOpenedChatId(chatId);
    // more work...
  }

  useEffect(()=>{
    formatTime();
    // eslint-disable-next-line
  },[lastMessage])

  return (
    <div 
      className={`my-2 me-2 px-2 rounded-2 text-gray bg-white shadow-1 person 
      ${chatId === openedChatId? 'border-gray': ''}`} 
      onClick={handlePerson} >
      <div className="row p-2">
        <div className="col-2 rounded-circle pic-container">
          <img src={member?.pic} alt="dp"
            className='pic'
          />
        </div>
        <div className="col d-flex flex-column justify-content-center align-item-center ">
          <p className=" size-5 fw-semibold text-darkblue my-0">{member?.name}</p>
          <p className=" size-7 text-blue my-0">{member?.email /* typing...*/}</p>
        </div>
        <p className="col-3 size-7 text-end px-1">{lastMessage?time:' '}</p>
      </div>
      <div className="row p-1 mb-1">
        <p className="col size-6 m-0 p-0 px-1 last-msg">{lastMessage.data}</p>
        {/* <div className="col-1 px-1">
          <p className="m-0 indication bg-pink text-center size-7 text-white">2</p>
        </div> */}
      </div>
    </div>
  )
}

export default Person