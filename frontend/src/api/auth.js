import axios from 'axios';
import env from 'react-dotenv';

export const registerUser = async (data) => {
  return await axios({
    method: 'post',
    url: `${env.API_URL}/user/register`,
    data: data,
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

export const loginUser = async (data) => {
  return await axios({
    method: 'post',
    url: `${env.API_URL}/user/auth`,
    data: data,
  })
    .then((res) => {
      const token = res.data.token;
      if (token != null) {
        localStorage.setItem('token', token);
        return token;
      }
    })
    .catch((e) => {
      console.log(e.response.data.error);
    });
};

export const getUserInfo = async (token) => {
  return await axios({
    method: 'get',
    url: `${env.API_URL}/user/me`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.data.user;
    })
    .catch((e) => {
      console.log(e.response.data.error);
    });
};

export const deleteUser = async (userId) => {
  await axios({
    method: 'delete',
    url: `${env.API_URL}/user/${userId}`,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const updateUser = async (userId, data) => {
  await axios({
    method: 'put',
    url: `${env.API_URL}/user/${userId}`,
    data: data,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};
