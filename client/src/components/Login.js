import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext} from '../context/AuthContext';

function Login() {

    const {login, setLoggedIn, fetchUser} = useContext(AuthContext);
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const {email, password} = credentials;
    const navigate = useNavigate();

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value })
    }

    const submitForm = async (e) => {
        e.preventDefault();
        // POST request using fetch
        setLoading(true)
        let data = await login(email, password);
        setLoading(false)
        if(data.success) {
            setLoggedIn(true);
            localStorage.setItem('token', data.token);
            await fetchUser(data.token);
            navigate('/', {replace: true});
            setCredentials({email:"", password:""})
        }
        else if(data.serverError) {
            console.log(data.error);
            setError(data.error);
        }
        else {
            console.log(data.error);
            setError(data.error);
        }

    }

    return (
        <div className="col-11 col-lg-4 col-md-6 mx-auto my-4 py-4 bg-white shadow-1 rounded-1">
            <form className=" " onSubmit={submitForm}>
                <div className="d-flex flex-column px-5 my-2">
                    <h4 className="m-0 text-darkblue size-2">Login</h4>
                    {error? <p className='size-4 text-danger'>{error}</p>
                    : <p className='text-gray size-6'>
                        Welcome back, enter your details to login
                    </p>}
                </div>
                <div className="px-5">

                    <label className="my-0 text-gray" htmlFor="login-email">Email</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="email" name="email" id="login-email" 
                            required onChange={onChange}
                    />

                    <label className="my-0 text-gray " htmlFor="login-password">Password</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="password" name="password" id="login-password" minLength={6} 
                            required onChange={onChange}
                    />

                </div>
                <div className=" d-flex flex-column justify-content-center my-4 px-5 ">
                    <button type="submit" 
                        disabled={loading}
                        className="shadow-2 btn py-2 w-100 my-2 border-0 size-4 text-white blue-grad">
                            {loading ? <i className="fa fa-spinner fa-spin"></i> : "Login"}

                    </button>
                    <Link className='size-5 text-blue' to = "/signup">Don't have an account? Create one</Link>
                </div>
            </form>
        </div>
    )
}

export default Login