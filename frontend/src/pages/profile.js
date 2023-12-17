import React, { useContext, useState , useEffect} from 'react'
import { UserContext } from '../AuthContext/Usercontext';
import DeleteUser from '../components/deleteUser';
import UpdateUser from '../components/updateUser'; 
import { getOrders } from '../api/order';
import Footer from '../components/footer';


const Profile = ( )  => {


    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const [orders, setOrders] = useState([]);

    const { user } = useContext(UserContext);
    
    const  userId = user.id


    useEffect(() => {

        getOrders(userId)
        .then((orders) => {setOrders(orders)})
        .catch((e) => {
        console.log(e);
    });

      }, []);

    return (
       
        user != null ?
        <>
        <div className='form-container'>
            <div className="cardprofil" >
                    <span id="register-label">MON PROFILE!</span>
                    <p>Prénom : {user.prenom} </p>
                    <p>Nom : {user.nom} </p>
                    <p>Mail : {user.email} </p>
                    <div className="collection">
                        <button onClick={() => setOpenUpdateModal(true)} className='modalButton'> MODIFIER </button>
                        <button onClick={() => setOpenDeleteModal(true)} className='modalButton'> SUPPRIMER </button>
                    </div>
                    <UpdateUser open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} userToUpdate={user} />
                    <DeleteUser open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} userId={user.id} />
            </div>
            <div className="cardprofil" >
                    <span id="register-label">MES COMMANDES: </span>

                    <div className="orders">
                     {orders.map((order) => (
                     <div key={order.id} className="order">
                        <h2>Commande ID: {order.id}</h2>
                        <p>Statut: {order.status} Date: {order.createdAt.slice(0,10)} total: {order.total} €</p>
                    
                        <ul>{order.OrderItems.map((item) => (
                            <li key={item.productId}> Quantité: {item.quantity}
                            <li>{item.Product.genre} | {item.Product.marque} | {item.Product.name}</li>
                        <ul>
                        </ul>
                        </li>
                        ))}
                        </ul>
                        </div>
                        ))}
                   </div>
            </div>
        </div>
        <Footer/>
        </>

        : null
        
        
    )
}

export default Profile;