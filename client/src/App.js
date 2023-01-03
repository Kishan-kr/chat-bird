import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import User from './components/User';
import Alert from './components/Alert';
import Home from './components/Home';
import ChatHome from './components/ChatHome';
import ChatBox from './components/ChatBox';

function App() {

  return (
    <div className='App py-3'>
      <BrowserRouter >
        <Home />
        <Alert />
        <Routes>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/user' element={<User />} >
            <Route path='/user/' element={<ChatHome/>} />
            <Route path='/user/chat' element={<ChatBox/>} />
          </Route>
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
