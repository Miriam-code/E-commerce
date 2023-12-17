import React, { useContext, useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../AuthContext/Usercontext';
import Footer from '../components/footer';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  const { saveUser } = useContext(UserContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const token = await loginUser(data);

      if (token) {
        await saveUser();
        navigate('/');
      }
    } catch (error) {
      if (error.response.data.message) {
        setError("Une erreur s'est produite lors de l'inscription : " + error.response.data.message);
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    }
  };

  return (
    <>
    <div className='form-container'>
      <form className="form">
        <span className="label">SE CONNECTER !</span>
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
        <button className="btn" type="submit" onClick={handleLogin}>
          CONNEXION
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
