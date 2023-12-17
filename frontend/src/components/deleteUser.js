import React, { useContext } from 'react';
import { deleteUser } from '../api/auth';
import { UserContext } from '../AuthContext/Usercontext';
import { useNavigate } from 'react-router-dom';
import img from '../img/logo.png'


const Modal = ({ open, onClose, userId }) => {

    const { logoutUser } = useContext(UserContext);

    const navigate = useNavigate()

    if (!open) return null;

    const handleDeleteUser = async () => {


        await deleteUser(userId)  
        .then(() => {
            logoutUser();
            navigate('/login');
        })
        .catch((e) => {
            console.log(e);
        })
    };

    return (
      <div onClick={onClose} className='overlay' >
        <div onClick={(e) => {e.stopPropagation();}} className='modalContainer'>
          <img src={img} alt='/' />
          <div className='modalRight'>

            <p className='closeBtn' onClick={onClose}>
              X
            </p>

            <div className='contenut'>
              <p>Souhaitez vous vraiment supprimer votre compte?</p>
            </div>

            <div className='btnContainer'>

            <button variant="secondary" onClick={onClose}>No</button>
            <button variant="danger" onClick={handleDeleteUser}>Yes ,Save</button>
            
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;