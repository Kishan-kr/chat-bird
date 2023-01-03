import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext';

function ChatHead(props) {
    const { chatPerson } = useContext(ChatContext);

  return (
    <div className="row header bg-lwhite py-2 px-3">
                <div className="col-2 rounded-circle pic-container shadow-1">
                    <img src={chatPerson.pic} alt=""
                        className='pic'
                    />
                </div>
                <div className="col d-flex flex-column justify-content-center align-item-center ">
                    <p className=" size-5 fw-semibold text-darkblue my-0">{chatPerson.name}</p>
                    <p className=" size-7 text-blue my-0">{chatPerson.email /*last online*/}</p>
                </div>
                
                <div className="col-1 mx-2 rounded-circle bg-white pic-container shadow-1">
                    <button className='btn bg-white text-gray m-0'>
                        <i className='fa-solid fa-ellipsis-vertical'></i>
                    </button>
                </div>
            </div>
  )
}

export default ChatHead