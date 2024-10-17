import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { MessageContext } from '../context/MessageContext';
import { Outlet } from 'react-router-dom';
import Asidebar from './Asidebar';
import About from './About';
import CreateNewChat from './CreateNewChat';
import io from 'socket.io-client';

const backend = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function User() {
  const { user, setSocketConnected } = useContext(AuthContext);
  const { openedChatId, chats, setChats } = useContext(ChatContext);
  const { setMessageList } = useContext(MessageContext);
  const [socket, setSocket] = useState(null);
  const infoSide = useRef(null);
  const newChatModal = useRef(null);

  useEffect(() => {
    const initSocket = async () => {
      if (!socket && user?.id) { // Check if user.id is present
        const socketInstance = io.connect(backend);
        setSocket(socketInstance);
        socketInstance.emit('setup', user); // Emit only if user.id is present
        setSocketConnected(true);
      }
    };
    initSocket();
    return () => {
      socket?.disconnect();
    };
  }, [user, socket, setSocketConnected]);

  useEffect(() => {
    if (socket) {
      socket.on('received', (message) => {
        if (message.chat._id !== openedChatId) {
          const updateChat = (chats) => {
            const chatToUpdate = chats.find((chat) => chat._id === message.chat._id);
            if (chatToUpdate) {
              chatToUpdate.lastMessage = message;
              setChats([chatToUpdate, ...chats.filter((chat) => chat._id !== message.chat._id)]);
            }
          };
          updateChat(chats);
        } else {
          setMessageList((prevList) => [...prevList, message]);
        }
      });
    }
    return () => {
      socket?.off('received');
    };
  }, [socket, openedChatId, chats, setMessageList]);

  const openModal = (e) => {
    e.preventDefault();
    newChatModal.current.click();
  };

  return (
    <div className="row mx-0 px-1 h-100">
      <div ref={infoSide} className="infoSide shadow-1 h-100">
        <About infoSide={infoSide} socket={socket} />
      </div>
      <div className="col-3">
        <Asidebar openModal={openModal} />
      </div>
      <div className="col">
        <Outlet context={[socket]} />
      </div>
      <button
        type="button"
        ref={newChatModal}
        className="btn d-none"
        data-bs-toggle="modal"
        data-bs-target="#createNewChat"
      >
        Create new chat
      </button>
      <CreateNewChat />
    </div>
  );
}

export default User;