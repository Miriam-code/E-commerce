import axios from 'axios';
import env from 'react-dotenv';

export const createOrder = async (products, userId) => {
  return await axios({
    method: 'post',
    url: `${env.API_URL}/order/create`,
    data: { userId, products },
  })
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

export const getOrders = async (userId) => {
  return await axios({
    method: 'get',
    url: `http://localhost:3000/order/getmyorders/${userId}`,
  })
    .then((res) => {
      console.log(res.data);
      return res.data.orders;
    })
    .catch((e) => {
      console.log(e);
    });
};
