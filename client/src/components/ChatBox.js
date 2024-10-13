import React, { useContext, useEffect } from 'react'
// import { ChatContext } from '../context/ChatContext';
import { useOutletContext, useParams } from "react-router-dom";
import ChatBody from './ChatBody';
import ChatFoot from './ChatFoot';
import ChatHead from './ChatHead';
import { ChatContext } from '../context/ChatContext';

function ChatBox() {
    const [socket] = useOutletContext();
    const {chatPerson, setChatPerson, getChatMembers} = useContext(ChatContext)
    const { chatId } = useParams();

    useEffect(() => {
        if(!chatPerson) {
            getChatMembers(chatId)
        }

        return () => {
            setChatPerson(null)
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        socket?.emit('chat', chatId);
        // eslint-disable-next-line
    }, [socket])

    return (
        <div className='px-4'>
            <ChatHead/>
            <hr className='text-gray mx-0 ' />

            <ChatBody chatId={chatId}/>

            <ChatFoot socket={socket}/>
        </div>
    )
}

export default ChatBox;