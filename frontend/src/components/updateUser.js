import React, { useContext, useState } from 'react';
import { updateUser } from '../api/auth';
import { UserContext } from '../AuthContext/Usercontext';
import img from '../img/logo.png'

const UpdateUser = ({ open, onClose, userToUpdate}) => {

    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { saveUser } = useContext(UserContext);

    if (!open) return null;

    const handleUpdateUser = async (event) => {

        event.preventDefault();
    
        const data = {
          "prenom": newFirstName,
          "nom": newLastName,
          "email": newEmail,
          "password": NewPassword,
        };

        if (confirmPassword !== NewPassword) {
            alert(`mot de passe n'est pas identique`);
        } else {

            await updateUser(userToUpdate.id, data)
            .then(() => {   
                onClose();
                saveUser();
                setNewFirstName('');
                setNewLastName('');
                setNewEmail('');
                setNewPassword('');
            })
            .catch((e) => {
                console.log(e);
            })
        }
    }

    return (
            <div onClick={onClose} className='overlay' >
            <div onClick={(e) => {e.stopPropagation();}} className='modalContainer'>
              <img src={img} alt='/' />
              <div className='modalRight'>
    
                <p className='closeBtn' onClick={onClose}>
                  X
                </p>
    
                <div className='contenut'>            
                    <span id="register-label">UPDATE USER !</span>
                    <input className='input' type="text" onChange={(e) => setNewFirstName(e.target.value)} placeholder={userToUpdate.prenom} value={newFirstName}/>
                    <input className='input' type="text" onChange={(e) => setNewLastName(e.target.value)} placeholder={userToUpdate.nom} value={newLastName}/>
                    <input className='input' type="text" onChange={(e) =>  setNewEmail(e.target.value)} placeholder={userToUpdate.email} value={newEmail}/>
                    <input className='input' type="text" onChange={(e) => setNewPassword(e.target.value)} placeholder="new mot de passe " value={NewPassword}/>
                    <input className='input' type="text" onChange={(e) => setConfirmPassword(e.target.value)} placeholder=" confirm new mot de passe " value={confirmPassword}/>
                    <div className='btnContainer'>
                    <button variant="danger" onClick={handleUpdateUser}>MODIFIER</button>
                    <button variant="secondary" onClick={onClose}>ANNULER</button>
                    </div>

                </div>
              </div>
            </div>
          </div>
        );
}

export default UpdateUser;