import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import User from './components/User';
import Alert from './components/Alert';
import ChatHome from './components/ChatHome';
import ChatBox from './components/ChatBox';
import Protected from './components/Protected';

function App() {

  return (
    <div className='App py-3'>
      <BrowserRouter >
        <Alert />
        <Routes>
          <Route path='/' element={<Protected><User /></Protected>} >
            <Route path='' element={<ChatHome/>} />
            <Route path='chat/:chatId' element={<ChatBox/>} />
          </Route>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
