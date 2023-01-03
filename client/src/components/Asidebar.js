import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import Person from './Person'

function Asidebar(props) {
    const [keyword, setKeyword] = useState('');
    const { chats, accessAllChat, searchChat } = useContext(ChatContext);

    const handleSearch = (event) => {
        if((event.key === 'Enter' && keyword) || event._reactName === 'onClick') {
            let token = localStorage.getItem('token');
            searchChat(token, keyword);
        }
    }

    const clearSearch = () => {
        setKeyword('');
    }

    // to fetch chats again after clearing search 
    useEffect(()=> {
        if(keyword === '') {
            let token = localStorage.getItem('token');
            accessAllChat(token);
        }
        //eslint-disable-next-line
    },[keyword])

    useEffect(() => {
        let token = localStorage.getItem('token');
        accessAllChat(token);
        //eslint-disable-next-line
    }, [])

    return (
        <aside className='p-3'>
            <div className='row px-1 my-2'>
                <div className="row">
                    <h4 className="col text-darkblue size-2 fw-semibold">Chats</h4>
                    <button className="col btn size-6 text-white blue-grad border-0"
                      onClick={props.openModal}>
                        + create New Chat
                    </button>
                </div>
            </div>

            <div className='row px-2 my-3'>
                <div className="row">
                    <div className="input-group mb-3 mx-1 px-0 bg-white rounded-1 shadow-1">
                        <button className="btn border-0" 
                            type="button" 
                            id="button-addon1"
                            onClick={handleSearch}
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <input type="text" 
                            className="form-control border-0" 
                            placeholder="search" 
                            value={keyword}
                            onKeyDown={handleSearch}
                            onChange={(e)=>{setKeyword(e.target.value)}}
                        />
                        <button className='btn text-gray' onClick={clearSearch}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="persons px-0">{
                chats.map((chat) => {
                    if(chat.members[0]?.name) 
                    return (
                        <Person key={chat._id} 
                            member={chat.members[0]} 
                            chatId={chat._id} 
                            lastMessage={chat.lastMessage?chat.lastMessage:""}
                        />
                    )
                })
            }
            </div>
        </aside>
    )
}

export default Asidebar