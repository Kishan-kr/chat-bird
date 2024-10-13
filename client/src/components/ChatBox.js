import React, { useContext, useEffect } from 'react'
import { useOutletContext, useParams } from "react-router-dom";
import ChatBody from './ChatBody';
import ChatFoot from './ChatFoot';
import ChatHead from './ChatHead';
import { ChatContext } from '../context/ChatContext';

function ChatBox() {
    const [socket] = useOutletContext();
    const {chatPerson, setOpenedChatId, setChatPerson, getChatMembers} = useContext(ChatContext)
    const { chatId } = useParams();

    useEffect(() => {
        setOpenedChatId(chatId)
        if(!chatPerson) {
            getChatMembers(chatId)
        }

        return () => {
            setChatPerson(null)
        }
        // eslint-disable-next-line
    }, [])    

    useEffect(() => {
        socket?.on('update-status', ({ userId, online, lastOnline }) => {
            if (chatPerson._id === userId) {

                setChatPerson(prev => ({ ...prev, online, lastOnline }));
            }
        });

        socket?.emit('chat', chatId);

        return () => {
            socket?.off('update-status');
        };
        // eslint-disable-next-line
    }, [socket])

    return (
        <div className='px-4'>
            <ChatHead/>
            <hr className='text-gray mx-0 ' />

            <ChatBody chatId={chatId}/>

            <ChatFoot socket={socket} chatId={chatId}/>
        </div>
    )
}

export default ChatBox;