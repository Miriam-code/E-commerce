const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });

module.exports = {

    parse: (authorization) => {

        return (authorization != null) ? authorization.replace("Bearer ", "") : null;
    },
    getUser: (authorization) => {

        const token = module.exports.parse(authorization);

        if (token != null || token != 'null') {
            try{
                const jwtToken = jwt.verify(token, process.env.SECRET);
                if (jwtToken.id > 0) {
                    const idUser = jwtToken.id
                    return idUser
                } 
            } catch(err) {
                console.log(err);
                return -1
            }
        } else {
            return -1;
        }
    },
    adminUser: (authorization) => {

        const token = module.exports.parse(authorization);
    
        if (!token || token === 'null') {
            return false;
        }
    
        try {
            const jwtToken = jwt.verify(token, process.env.SECRET);
    
            return jwtToken.is_admin || false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}