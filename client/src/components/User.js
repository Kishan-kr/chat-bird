import React, { useContext,useEffect, useRef } from 'react'
import Asidebar from './Asidebar'
import { AuthContext } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import About from './About';
import io from 'socket.io-client';
import { ChatContext } from '../context/ChatContext';
import { MessageContext } from '../context/MessageContext';
import CreateNewChat from './CreateNewChat';

const backend = 'http://localhost:3001';
var socket;
var chatCompare ;

function User() {
  const {loggedIn, user, loading, setSocketConnected} = useContext(AuthContext);
  const { openedChatId, chats, setChats } = useContext(ChatContext);
  const { messageList, setMessageList } = useContext(MessageContext);
  const navigate = useNavigate();
  const infoSide = useRef();
  const newChatModal = useRef();

  const openModal = (e)=>{
    e.preventDefault();
    newChatModal.current.click();
  }

  useEffect(()=> {
    chatCompare = openedChatId;
  },[openedChatId])

  useEffect(() => {
    if(!loading && !loggedIn)  {
      navigate('/login', {replace: true});
    }
    // eslint-disable-next-line
  }, [loggedIn])

  // connecting socket to the backend 
  useEffect(()=> {
    socket = io.connect(backend);
    socket.emit('setup', user);
    socket.on('connected', ()=>{
      setSocketConnected(true);
    })
    // eslint-disable-next-line
  }, [socket])

  useEffect(() => {
    socket.on('received', (message) => {
        if(message.chat._id !== chatCompare) {
          var chatToUpdate, pos;
          const slicePos = ()=>{
            for(let i=0; i<chats.length; i++) {
              if (chats[i]._id === message.chat._id) {
                chatToUpdate = {...chats[i], lastMessage: message,};
                return i;
              }
            }
          }
          pos = slicePos();
          const newChats = [
            chatToUpdate, ...chats.slice(0, pos), ...chats.slice(pos+1)
          ]
          setChats(newChats);
        }
        else {
          setMessageList([...messageList, message]);
        }
    })
    // eslint-disable-next-line
  }, [socket])

  return (
    <div className='row px-1'>
        <div ref={infoSide} className="infoSide shadow-1">
            <About infoSide = {infoSide}/>
        </div>
        <div className="col-3">
            <Asidebar openModal={openModal}/>
        </div>
        <div className="col">
          <Outlet context={[socket]}/>
        </div>
        <button type="button" ref={newChatModal} className="btn d-none" data-bs-toggle="modal" data-bs-target="#createNewChat">
                create new chat
        </button>
        <CreateNewChat/>
    </div>
  )
}

export default User;