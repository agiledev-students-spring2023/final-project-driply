import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import { useLogin } from "../hooks/useLogin";


function LoginPage() {
    const navigate = useNavigate();
    const form = useRef();
    
    const { login, error: loginError, isLoading: loginIsLoading } = useLogin();
    
    const handleLogin = async (e) => {
        e.preventDefault();

        form.current.validateAll();
        // setAuth(true);
        // setUser("Chewy the Dog");
        await login("Chewy the Dog", "password");
        navigate('/');
    };

    return (
        <div>
            Login Page
            <Form onSubmit={handleLogin} ref={form}>
                <div className="form-group">
                    <button className="btn btn-outline-success btn-block mt-3 mb-4">Login</button>
                </div>
            </Form>
            {loginIsLoading && <h1>Loading...</h1>}
            {loginError && <h1 className="error">{loginError}</h1>}
        </div>
    )
}

export default LoginPage;