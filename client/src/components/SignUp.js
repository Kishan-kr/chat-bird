import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext} from '../context/AuthContext';

function SignUp() {

    const {signUp, setLoggedIn, fetchUser, setAlert} = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({name:"", email:"", password:"", cPassword: ""});
    const [pic, setPic] = useState('');
    const [uploading, setUploading] = useState(false);
    const { name, email, password, cPassword } = user;
    const navigate = useNavigate();

    const onChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value })
    }

    const uploadPic = async (picture) => {
        setUploading(true);
        if(picture === undefined) console.log('pic not available');
        if(picture.type === 'image/png' || picture.type === 'image/jpeg') {
            const data = new FormData();
            data.append("file", picture);
            data.append("upload_preset", "chat-app");
            var res = await fetch("https://api.cloudinary.com/v1_1/kishan-kumar/image/upload", {
                method: "post",
                body: data,
            })
            res = await res.json();
            if(res) {
                const imageUrl = await res.url.toString();
                setPic(imageUrl);
                setUploading(false);
            } else {
                console.log("error while uploading picture");
                setUploading(false);
            }
        }
        else {
            console.log("file type not matched while uploading picture")
            setUploading(false);
            return;
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if(password !== cPassword) {
            setError('Passwords do not match!');
            return;
        }
        // POST request using fetch
        setLoading(true);
        const data = await signUp(name, email, password, pic);
        setLoading(false);

        if(data.success) {
            setLoggedIn(true);
            localStorage.setItem('token', data.token);
            await fetchUser(data.token);
            setAlert({
                isOn : true,
                type : 'success',
                msg : data.msg
            })
            navigate('/', {replace: true});
            setUser({name:"", email:"", password:"", pic:""})
        }
        else if(data.serverError) {
            console.log(data.error);
            setError(data.error)
        }
        else {
            console.log(data.error);
            setError(data.error);
        }
    }

    return (
        <div className="col-11 col-md-6 col-lg-4 mx-auto py-2 bg-white shadow-1 rounded-1">
            <form className="" onSubmit={submitForm}>
                <div className="d-flex flex-column px-5 my-2">
                    <h4 className="m-0 text-darkblue size-2">Sign Up</h4>
                    {error? <p className='size-4 text-danger'>{error}</p>
                    : <p className='text-gray size-6'>
                        Create a new account
                    </p>}
                </div>
                <div className="px-5">
                    <label className="text-gray" htmlFor="name">Name</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="text" name="name" id="name" 
                            required onChange={onChange}
                    />

                    <label className="my-0 text-gray" htmlFor="signup-email">Email</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="email" name="email" id="signup-email" 
                            required onChange={onChange}
                    />

                    <label className="my-0 text-gray " htmlFor="signup-password">Password</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="password" name="password" id="signup-password" minLength={6} 
                            required onChange={onChange}
                    />

                    <label className="my-0 text-gray" htmlFor="confirm-password">Confirm Password</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="password" name="cPassword" id="confirm-password" 
                            minLength={6} required onChange={onChange}
                    />
                
                    <label className="my-0 text-gray" 
                        htmlFor="pic">{uploading? 'Wait while Uploading...' : 'Upload your photo'}</label>
                    <input className="mb-4 form-control border-0 shadow-1 py-2 text-gray" 
                        type="file" name="pic" id="pic" 
                        accept='image/*'
                        onChange={(e)=> uploadPic(e.target.files[0])}
                    />
                </div>
                <div className=" d-flex flex-column justify-content-center my-4 px-5 ">
                    <button type="submit" 
                        className="shadow-2 btn py-2 w-100 my-2 border-0 size-4 text-white blue-grad"
                        disabled={uploading || loading}>
                            {loading ?  <i className="fa fa-spinner fa-spin"></i> : 'Sign Up'}

                    </button>
                    <Link className='size-5 text-blue' to = "/login">Already have an account? Login</Link>
                </div>
            </form>
        </div>
    )
}

export default SignUp