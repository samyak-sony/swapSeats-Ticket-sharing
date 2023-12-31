import {useState} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

import  '../styles/signup.module.css';
const SignUp=()=>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url:'/api/users/signup',
        method: 'post',
        body:{
            email,password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();

    }

    return (
        <div className={'signup-container'}> 
            <form onSubmit={onSubmit}>
                <h1> Sign up </h1>
                <div className='form-group'>
                    <label> Email Address</label>
                    <input value={email} onChange={e=> setEmail(e.target.value)}
                    className="form-control"/>
                </div>
                <div className='form-group' >
                    <label> Password</label>
                    <input value={password} onChange={e=> setPassword(e.target.value)} type="password" className="form-control"/>
                </div>
                
                <br/>
                {errors} 
                <button className='btn btn-primary'> Sign Up</button>
            </form>
        </div>
    );
};
export default SignUp;
