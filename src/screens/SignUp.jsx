import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    alert('Account created successfully! You can now log in.');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Create an account</h1>
        <p>Join us and start your journey today</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">
          Create account
        </button>
      </form>
      
      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </div>
  );
}
