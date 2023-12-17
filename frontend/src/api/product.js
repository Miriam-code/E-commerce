import axios from 'axios';

export const getProducts = async () => {

    return await axios({
       method: 'get',
       url: `http://localhost:3000/product/get-all`
    })
    .then((res) => {
        console.log(res.data)
       return res.data.products
    })
    .catch((e) => {
       console.log(e);
    })
}
