import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const { login, setLoggedIn, fetchUser  } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        const data = await login(email, password);
        
        if (data.success) {
            setLoggedIn(true);
            localStorage.setItem('token', data.token);
            await fetchUser (data.token);
            navigate('/', { replace: true });
        } else {
            setError(Array.isArray(data.error) ? data.error[0]?.msg : data.error);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        setLoading(true);
        await handleLogin(formData.get('email'), formData.get('password'));
        setLoading(false);
    };

    const loginWithDemo = async () => {
        setDemoLoading(true);
        const demoEmail = "john@example.com";
        const demoPassword = process.env.REACT_APP_DEMO_PASSWORD || "Demo#1234";
        await handleLogin(demoEmail, demoPassword);
        setDemoLoading(false);
    };

    return (
        <div className="col-11 col-lg-4 col-md-6 mx-auto my-4 py-4 bg-white shadow-1 rounded-1">
            <form onSubmit={submitForm}>
                <div className="d-flex flex-column px-5 my-2">
                    <h4 className="m-0 text-darkblue size-2">Login</h4>
                    {error ? (
                        <p className='size-4 text-danger'>{error}</p>
                    ) : (
                        <p className='text-gray size-6'>Welcome back, enter your details to login</p>
                    )}
                </div>
                <div className="px-5">
                    <label className="my-0 text-gray" htmlFor="login-email">Email</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="email" name="email" id="login-email" required />
                    
                    <label className="my-0 text-gray" htmlFor="login-password">Password</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="password" name="password" id="login-password" minLength={6} required />
                </div>
                <div className="d-flex flex-column justify-content-center my-4 px-5">
                    <button type="submit" 
                        disabled={loading}
                        className="shadow-2 btn py-2 w-100 my-2 border-0 size-4 text-white blue-grad">
                        {loading ? <i className="fa fa-spinner fa-spin"></i> : "Login"}
                    </button>
                    <div className='d-flex gap-2 text-gray my-1 align-items-center justify-content-center'>
                        <span className='border-bottom border-secondary-subtle border-1 w-100'></span>
                        <span className='size-6 text-nowrap'>Or continue with</span>
                        <span className='border-bottom border-secondary-subtle border-1 w-100'></span>
                    </div>
                    <button type='button' onClick={loginWithDemo} className='btn btn-outline-light border border-secondary-subtle text-gray size-4'>
                        {demoLoading ? <i className="fa fa-spinner fa-spin"></i> : "Demo account"}
                    </button>
                    <Link className='size-5 text-blue mt-1' to="/signup">Don't have an account? Create one</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;