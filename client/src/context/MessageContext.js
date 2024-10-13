import React,{ createContext, useState } from "react"; 

export const MessageContext = createContext();
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function MessageMethods(props) {
    const [messageList, setMessageList] = useState([]);
    const url = `${baseUrl}/api/messages/`;

    // Fetch request to add a message in a chat
    const addMessage = async (token, chat, data) => {
        try {
            var response = await fetch(`${url}/add`, {
                method : 'POST',
                headers : {
                    'content-type' : 'application/json',
                    'token' : token
                },
                body : JSON.stringify({data, chat})
            })
            response = await response.json();
            return response;

        } catch(error) {
            return {success : false, error};
        }
    }

    // Fetch request to get all messages of a chat 
    const getAllMessage = async (token, chatId) => {
        if(chatId === '') return;
      
        try {
            var response = await fetch(`${url}/get-all/${chatId}`, {
                method : 'GET',
                headers : {
                    'content-type' : 'application/json',
                    'token' : token
                }
            })
            response = await response.json();
            
            if(response.success)
                setMessageList(response.messages);

        } catch(error) {
            return {success : false, error};
        }
    }

  return (
    <MessageContext.Provider value={{getAllMessage, messageList, setMessageList, addMessage}} >
        {props.children}
    </MessageContext.Provider>
  )
}

export default MessageMethods;