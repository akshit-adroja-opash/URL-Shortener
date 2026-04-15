import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext.jsx';
  import { validateEmail, validatePassword } from '../utils/validation';


  const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const { email, password } = formData;

    const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
      e.preventDefault();

      const errors = {};
      if (!validateEmail(email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!validatePassword(password)) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setLoading(true);

      try {
        await login(email, password);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2> Welcome Back</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
              type="email" id="email" name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                required
                className={validationErrors.email ? 'error' : ''}
              />
              {validationErrors.email && <div className="field-error">{validationErrors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password"> Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                required
                className={validationErrors.password ? 'error' : ''}
              />
              {validationErrors.password && <div className="field-error">{validationErrors.password}</div>}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                ' Sign In'
              )}
            </button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Create one here</Link>
          </p>
        </div>
      </div>
    );
  };



  export default Login;
