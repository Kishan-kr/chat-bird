import React, { createContext, useState } from "react";

export const ChatContext = createContext();

function ChatMethods(props) {
    const [chats, setChats] = useState([]);
    const [chatPerson, setChatPerson] = useState({})
    const [openedChatId, setOpenedChatId] = useState('')

    const url = "http://localhost:3001/api/chats/"
    // fetch request to create or open a chat 
    const openChat = async (token, userId) => {
        try {
            var response = await fetch(`${url}/access`, {
                method : 'POST',
                headers : {
                    'content-type' : 'application/json',
                    'token' : token
                },
                body : JSON.stringify({userId})
            })
            response = response.json();
            return response;

        } catch(error) {
            return {success : false, error};
        }
    }

    // fetch request to access all chat 
    const accessAllChat = async (token) => {
        try {
            var response = await fetch(`${url}/access`, {
                method : 'GET',
                headers : {
                    'content-type' : 'application/json',
                    'token' : token
                }
            })
            response = await response.json();
            if(response.success) {
                setChats(response.chats);
            }
            else {
                console.log(response.error);
            }

        } catch(error) {
            return {success : false, error};
        }
    }

    // fetch request to search a chat or user 
    const searchChat = async (token, keyword) => {
        try {
            var response = await fetch(`${url}?search=${keyword}`, {
                method : 'GET',
                headers : {
                    'content-type' : 'application/json',
                    'token' : token
                }
            })
            
            response = await response.json();
            if(response.success) {
                setChats(response.chats)
            }
            else {
                console.log(response.error);
            }

        } catch(error) {
            return {success : false, error};
        }
    }
  return (
    <ChatContext.Provider value={{
        chats, setChats, openChat, accessAllChat, chatPerson, setChatPerson, openedChatId, setOpenedChatId, searchChat
        }} >
        {props.children}
    </ChatContext.Provider>
  )
}

export default ChatMethods;