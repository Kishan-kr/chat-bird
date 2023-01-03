import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Alert() {
    const { alert, setAlert } = useContext(AuthContext);
    let alertIcon = alert.type === 'success' ? 'circle-check' : 'triangle-exclamation';

    const dismissAlert = () => {
        setAlert({
            isOn:false,
            type: '',
            msg : ''
        });
    }

    if(alert.isOn) {setTimeout(dismissAlert, 3000);}

    return (
        alert.isOn? 
        <div className="container-fluid d-flex alert-all position-fixed">
            <div className={`shadow alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center my-2 mx-auto`} role="alert">
                <span className='mx-2' title='Edit'>
                    <i className={`fa-solid fa-${alertIcon} fa-2x`}></i>
                </span>
                <div> {alert.msg} </div>
            </div>
        </div>
    : 
    <></>
    )
}

export default Alert