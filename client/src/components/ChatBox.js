import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../context/ChatContext';
import { useOutletContext } from "react-router-dom";
import ChatBody from './ChatBody';
import ChatFoot from './ChatFoot';
import ChatHead from './ChatHead';

function ChatBox() {
    const [socket] = useOutletContext();
    const { openedChatId } = useContext(ChatContext);

    // Emitting chat event to join a chat room 
    useEffect(() => {
        socket.emit('chat', openedChatId);
        // eslint-disable-next-line
    }, [])

    return (
        <div className='px-4'>
            <ChatHead />
            <hr className='text-gray mx-0 ' />

            <ChatBody/>

            <ChatFoot socket={socket}/>
        </div>
    )
}

export default ChatBox;