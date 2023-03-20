import React, { useRef, useState } from 'react';
import Form from "react-validation/build/form";
import { useNavigate } from 'react-router-dom';
import { useSignup } from "../hooks/useSignup";

function RegisterPage() {
    const navigate = useNavigate();
    const form = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    const { signup, isLoading: signupIsLoading } = useSignup();

    const handleRegister = async (e) => {
        e.preventDefault();

        form.current.validateAll();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setSuccessful(false);
        } else {
            try {
                await signup(email, password);
                setMessage("Registration successful");
                setSuccessful(true);
                navigate('/');
            } catch (error) {
                const resMessage = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();

                setMessage(resMessage);
                setSuccessful(false);
            }
        }
    };

    return (
        <div>
            Register
            <Form onSubmit={handleRegister} ref={form}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
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
            {message && <h1 className={successful ? "success" : "error"}>{message}</h1>}
        </div>
    )
}

export default RegisterPage;
