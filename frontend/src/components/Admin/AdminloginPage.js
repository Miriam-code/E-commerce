import React, { useState } from 'react';
import AuthProvider from './AuthProvider';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    AuthProvider.login({ email, password }).catch((error) => {
      if (error.response.data.message) {
        setError(
          "Une erreur s'est produite lors de l'inscription : " +
            error.response.data.message,
        );
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    });
  };

  return (
    <div className="form-container">
      <form className="form">
        <span className="label"> ADMIN LOGIN !</span>
        <input
          className="input"
          type="text"
          placeholder="Email"
          pattern="^(?=[^?=%]*[@]{1}[^?=%]*)[^?=%]{10,50}$"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}"
          minLength="8"
          maxLength="15"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
