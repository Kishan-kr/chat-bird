import React, { useContext, useEffect, useRef } from 'react'
// import { ChatContext } from '../context/ChatContext';
import { MessageContext } from '../context/MessageContext';
import Message from './Message'

function ChatBody({chatId}) {
  // const { openedChatId } = useContext(ChatContext);
  const { getAllMessage, messageList } = useContext(MessageContext);
  const chatEnd = useRef();
  
  const scrollBottom = () => {
    const chatBody = document.querySelector('.chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  useEffect(() => {
    let token = localStorage.getItem('token');
    getAllMessage(token, chatId);
    // eslint-disable-next-line
  }, [chatId])

  useEffect(()=> {
    scrollBottom();
  }, [messageList])
  
  return (
    <div className='chat-body pe-2'>
      {messageList.map((listItem, index) => {
        return <Message
          key={index}
          messageItem={listItem}
        />
      })}
      <div ref={chatEnd}></div>
    </div>
  )
}

export default ChatBody