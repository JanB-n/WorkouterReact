import React, {useRef, useState, useEffect, useContext} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { Button, Form } from 'react-bootstrap';
const LOGIN_URL = '/auth/token';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const usernameRef = useRef();
    const errorRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        usernameRef.current.focus()
    }, [])

    useEffect(() => {
        setErrorMessage('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post(LOGIN_URL, JSON.stringify({username: username, password: password}), 
            {
                headers: { 'Content-Type' : 'application/json', 'Authorization': ''},
                //withCredentials: true
            }
            );
            const accessToken = response?.data?.token;
            //const refresh = response?.data?.refresh;
            //const first_name = response?.data?.first_name;
            //const last_name = response?.data?.last_name;
            localStorage.setItem("token", JSON.stringify(accessToken));
            localStorage.setItem("username", JSON.stringify(username));
            // setAuth({username: username, token: accessToken, refresh: refresh});
            setAuth({username: username, token: accessToken});
            setUsername('');
            setPassword('');
            // setTimeout(function(){
            //     navigate(from, {replace: true})
            // }, 10000)
            navigate(from, {replace: true});
        } catch(err){
            if (!err?.response) {
                setErrorMessage('No Server Response');
            }
        //errorRef.current.focus();
        }
        
    }

  return (
        <section className="authentication">
            <Form onSubmit={handleSubmit}>  
                <Form.Group>
                    <Form.Label htmlFor="InputUsername">Username:</Form.Label>
                    <Form.Control type="text" className="form-control" id="exampleInputUsername1" aria-describedby="usernameHelp"  ref={usernameRef} autoComplete='off' onChange={(e) => setUsername(e.target.value)} value={username} required/>
                </Form.Group>
                <Form.Group style={{ 'marginTop': '10px'}}>
                    <Form.Label htmlFor="InputPassword">Password:</Form.Label>
                    <Form.Control type="password" className="form-control" id="exampleInputPassword1"  autoComplete='off' onChange={(e) => setPassword(e.target.value)} value={password} required/>
                </Form.Group>
                <Form.Group style={{ 'marginTop': '10px', 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center'}}>
                    <Button style={{'marginTop': '10px'}} type="submit" className="btn btn-primary">Log in</Button>
                </Form.Group>

                <Form.Group className="text-center" style={{ 'marginTop': '10px'}}>
                    <p>Not a member? <a href="/register">Register</a></p>    
                </Form.Group>
            </Form>

        </section>
  );
}

export default Login;