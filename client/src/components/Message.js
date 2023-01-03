import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Message = (props) => {
  const {data, sender, createdAt} = props.messageItem;
  const {user} = useContext(AuthContext);
  const [time, setTime] = useState(createdAt);
  
  const formatTime = () => {
    var tm;
    let date = new Date(createdAt)
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
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    else if(year === date.getFullYear()) {
      tm = date.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    else {
      tm = date.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    setTime(tm);
  }
    
  useEffect(()=>{
    formatTime();
  },[])

  return (
    <div 
      className={`message-item text-gray py-0 size-5 ${sender._id===user.id ? "me" : "other"}`}
    >
      <p 
        className={`message p-2 shadow-2 ${sender._id===user.id ? "bg-white shadow-1" : "blue-grad text-white"}`
      }>
        {data}
      </p>
      <p className="time size-7 text-end m-0">{time}</p>
    </div>
  )
}

export default Message  