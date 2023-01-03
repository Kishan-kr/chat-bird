
import React, { useState, createContext, useEffect } from "react";
export const AuthContext = createContext();

function AuthState(props) {
    const url = 'http://localhost:3001/api/auth';

    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({id:'', name: '', email: '', pic: ''});
    const [alert, setAlert] = useState({isOn:false, type:'success', msg:'Done'});
    const [socketConnected, setSocketConnected] = useState(false);

    // 1 login method for authentication 
    const login = async (email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        };
        try {
            const response = await fetch(`${url}/login`, requestOptions);
            const data = await response.json();
           
            return data;
        } catch (error) {
            console.log(error);
            let serverError = true
            return {serverError, 'error': 'Server error! Try again later'};
        }
    }
    
    // 2 signup method for authentication 
    const signUp = async (name, email, password, pic) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, pic})
        };
        try {
            const response = await fetch(`${url}/create`, requestOptions);
            const data = await response.json();
            
            return data;
        } catch (error) {
            console.log(error);
            let serverError = true
            return {serverError, 'error': 'Server error! Try again later'};
        }
    }

    // 3 method to fetch user details 
    const fetchUser = async (authToken) => {
        const requestOptions = {
            accept : '/',
            method: 'POST',
            headers: { 'token': authToken }
        };
        try {
            const response = await fetch(`${url}/getuser`, requestOptions);
            const data = await response.json();
            if(data.success) {
                setUser({
                id : data.user._id,
                name : data.user.name, 
                email : data.user.email, 
                pic : data.user.pic
                });
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    // 4 method to search users
    const searchUser = async (token, keyword) => {
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
                return response;
            }
            else {
                console.log(response.error);
            }

        } catch(error) {
            return {success : false, error};
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token')) {
            setLoggedIn(true);
            let token = localStorage.getItem('token');
            fetchUser(token);
        }
    }, [loggedIn])
    
    
  return (
    <AuthContext.Provider 
        value={{
            signUp, login, user, fetchUser, loggedIn, setLoggedIn,alert, setAlert, socketConnected, setSocketConnected, searchUser
        }}
    >
        {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState;