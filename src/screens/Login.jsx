import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');

    if (email === 'ranjan.ar855@gamil.com' && password === 'visahub@3210') {
      console.log('Admin login successful');
      navigate('/dashboard');
    } else if (storedEmail && email === storedEmail && password === storedPassword) {
      console.log('User login successful');
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Welcome back</h1>
        <p>Sign in to your account to continue</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" className="btn-primary">
          Sign in
        </button>
      </form>
      
      <div className="auth-footer">
        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
      </div>
    </div>
  );
}
