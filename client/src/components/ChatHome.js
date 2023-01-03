import React from 'react'

function ChatHome() {
  return (
    <div className='chat-home d-flex flex-column align-items-center justify-content-center shadow-1'>
        <div className="logo mx-auto text-blue">
        <i className="fa-solid fa-dove fa-8x"></i>
        </div>
        <h5 className='text-darkblue m-3'>Chat-Bird</h5>
        <p className="text-gray size-6">Open a chat to see</p>
    </div>
  )
}

export default ChatHome