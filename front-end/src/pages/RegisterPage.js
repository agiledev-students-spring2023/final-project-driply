import React, { useRef, useState } from 'react';
import Form from "react-validation/build/form";
import { useNavigate } from 'react-router-dom';
import { useSignup } from "../hooks/useSignup";

function RegisterPage() {
    const navigate = useNavigate();
    const form = useRef();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [unmatchedPass, setUnmatchedPass] = useState(false);

    const { signup, isLoading: signupIsLoading, error } = useSignup();

    const handleRegister = async (e) => {
        e.preventDefault();

        form.current.validateAll();

        if (password !== confirmPassword) {
            setUnmatchedPass(true)
        } else {
            setUnmatchedPass(false)
            await signup(username, password);
        }
    };

    return (
        <div>
            Register
            <Form onSubmit={handleRegister} ref={form}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        name="confirmPassword"
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-outline-success btn-block mt-3 mb-4">Register</button>
                </div>
            </Form>
            {signupIsLoading && <h1>Loading...</h1>}
            {error && <h1 className="error">{error}</h1>}
            {unmatchedPass && <h1 className='error'>Passwords dont match</h1>}
        </div>
    )
}

export default RegisterPage;
