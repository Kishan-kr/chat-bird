import React, { useContext, useState } from 'react'
import { MessageContext } from '../context/MessageContext';
import { ChatContext } from '../context/ChatContext';
import InputEmoji from "react-input-emoji";

function ChatFoot(props) {
    const { socket, chatId } = props;
    const [text, setText] = useState('');
    const { addMessage, messageList, setMessageList } = useContext(MessageContext);
    const { accessAllChat } = useContext(ChatContext);
    
    const sendMessage = async () => {
        const token = localStorage.getItem('token');
        const { message } = await addMessage(token, chatId, text);
        socket.emit('new message', message);
        setMessageList([...messageList, message]);
        accessAllChat(token);
        setText('');
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage()
            return
        }
    }

    return (
        <div className='chat-footer py-2 px-3 shadow-1 d-flex'>
            <div className="input-group ">
                {/* <div className="col-1 rounded-circle pic-container my-auto">
                    <button className='btn blue-grad text-lwhite shadow-2'>
                        <i className="fa-solid fa-paperclip"></i>
                    </button>
                </div> */}
                <div className='form-control border-0 m-0 p-0'>
                    <InputEmoji type="text" className="m-0"
                        placeholder="Type a message here"
                        aria-label="message"
                        value={text}
                        onKeyDown={handleKeyDown}
                        onChange={setText} />
                </div>

                {/* <button className="btn rounded-circle mx-2 text-gray pic-container" 
                    type="button"
                >
                    <i className="fa-regular fa-face-smile "></i>
                </button> */}
                <button
                    className="btn blue-grad text-white my-auto rounded-circle pic-container shadow-2"
                    type="button"
                    onClick={sendMessage}
                >
                    <i className="fa-solid fa-location-arrow"></i>
                </button>
            </div>
        </div>
    )
}

export default ChatFoot