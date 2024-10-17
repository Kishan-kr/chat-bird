import React, { createContext, useState } from "react";

export const ChatContext = createContext();
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function ChatMethods(props) {
    const [chats, setChats] = useState([]);
    const [chatPerson, setChatPerson] = useState({})
    const [openedChatId, setOpenedChatId] = useState('')

    const url = `${baseUrl}/api/chats/`;
    // fetch request to create or open a chat 
    const openChat = async (token, userId) => {
        try {
            var response = await fetch(`${url}/open`, {
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
            var response = await fetch(`${url}/all`, {
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

    const getChatMembers = async (chatId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${url}/members/${chatId}`, {
                method: 'GET',
                headers: { 
                    'content-type' : 'application/json', 
                    'token': token 
                }
            });
            const data = await response.json();
            if (data.success) {
                setChatPerson(data.members[0]);
            }
        } catch (error) {
            console.error(error)
        }
    };

  return (
    <ChatContext.Provider value={{
        chats, setChats, openChat, accessAllChat, chatPerson, setChatPerson, openedChatId, setOpenedChatId, searchChat, getChatMembers
        }} >
        {props.children}
    </ChatContext.Provider>
  )
}

export default ChatMethods;