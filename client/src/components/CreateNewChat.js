import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

function CreateNewChat() {
    const {searchUser} = useContext(AuthContext);
    const {setChatPerson, openedChatId, setOpenedChatId} = useContext(ChatContext);
    const [keyword, setKeyword] = useState('');
    const [userList, setUserList] = useState([]);

    // const setActiveChat = (chat) => {
    //     setOpenedChatId(chat._id);
    //     setChatPerson(chat);
    //     console.log(chat);
    //     console.log(openedChatId);
    // }

    const handleSearch = async (event) => {
        if((event.key === 'Enter' && keyword) || event._reactName === 'onClick') {
            let token = localStorage.getItem('token');
            const result = await searchUser(token, keyword);
            result.success? setUserList(result.users): console.log(result.error);
            
        }
    }

    const changeInput = (e) => {
        setKeyword(e.target.value)
        if(e.target.value === '')
            clearSearch();
    }

    const clearSearch = () => {
        setKeyword('');
        setUserList([])
    }

    return (
     <div className='modal fade' 
      id='createNewChat' 
      data-bs-backdrop="static" 
      tabIndex="-1" 
      aria-hidden="true"
     >
      <div className="modal-dialog modal-dialog-scrollable">
       <div className="modal-content bg-transwhiten px-1">
            <div className="row p-2 mx-0 my-1 rounded-1 modal-header">
                <div className="input-group py-1 px-0 bg-lwhite rounded-1 shadow-1">
                    <button className="btn border-0"
                        type="button"
                        id="button-addon1"
                        onClick={handleSearch}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <input type="text"
                        className="form-control border-0"
                        placeholder="search with email or name"
                        value={keyword}
                        onKeyDown={handleSearch}
                        onChange={changeInput}
                    />
                    <button className='btn text-gray' onClick={clearSearch}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div className="results p-2 my-1 mx-0 rounded-1 modal-body">{
                userList.map(user => (<Person key={user._id} userData={user} />))
            }
            </div>
            <div className="modal-footer">
                <button 
                  className='btn btn-sm btn-outline-secondary px-3 m-auto'
                  data-bs-dismiss="modal"
                >Close</button>
            </div>
       </div>
      </div>
     </div>
    )
}

const Person = ({userData}) => {
    const {openChat, chats, setChats, setChatPerson, openedChatId, setOpenedChatId} = useContext(ChatContext);
    const {setAlert} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSelect = async ()=>{
        const token = localStorage.getItem('token');
        const result = await openChat(token, userData._id);
        if(!result.success) {
            // show alert with server error 
            setAlert({
                isOn: true,
                type: 'danger',
                msg: "Server error occured! Try later"
            })
            return;
        }

        if(result.existChat) {
            navigate(`/user/chat/${result?.existChat?._id}`, {replace : true});
            setChatPerson(result.existChat.members[0]);
            setOpenedChatId(result.existChat._id);
            return;
        }

        navigate(`/user/chat/${result?.chat?._id}`, {replace : true});
        setChats([result.chat, ...chats]);
        setChatPerson(result.chat.members[0]);
        setOpenedChatId(result.chat._id);
        return;
    }

    return (
        <div className='my-2 px-2 rounded-2 text-gray bg-lwhite shadow-1'>
            <div className="row p-2">
                <div className="col-2 rounded-circle pic-container">
                    <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80" alt="dp"
                        className='pic'
                    />
                </div>
                <div className="col-6 d-flex flex-column justify-content-center align-item-center ">
                    <p className=" size-5 fw-semibold text-darkblue my-0">{userData?.name}</p>
                    <p className=" size-7 text-blue my-0">{userData?.email}</p>
                </div>
                <div className="col text-end px-0">
                    <button 
                      className="btn blue-grad px-3 py-2 size-6 text-white shadow-1 border-0" 
                      data-bs-dismiss="modal" 
                      onClick={handleSelect}>
                      Select
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CreateNewChat
