import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { isEmail } from 'validator';
import { useLogin } from '../hooks/useLogin';

const required = (value) => {
    if (!value.trim()) {
      return <div className="text-danger">This field is required</div>;
    }
};

function LoginPage() {
    const navigate = useNavigate();
    const form = useRef();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const { login, error: loginError, isLoading: loginIsLoading } = useLogin();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        form.current.validateAll();
    
        if (form.current.getChildContext()._errors.length === 0) {
          await login(username, password);
        }
      };

    return (
        <div>
      <h1>Login</h1>
      <Form ref={form}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            className="form-control"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            validations={[required]}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            validations={[required]}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-outline-success btn-block mt-3 mb-4" onClick={handleLogin}>
            Login
          </button>
        </div>
      </Form>
      {loginIsLoading && <h1>Loading...</h1>}
      {loginError && <h1 className="error">{loginError}</h1>}
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
    );
}

export default LoginPage;