import axios from "axios"

const AuthProvider = {
    
    login: async ({ email, password }) => {
        await axios({
            method: "POST",
            url: `http://localhost:3000/user/auth`,
            data: {email, password}
        })
        .then( async (res) => {
            localStorage.setItem('token', res.data.token)
            await AuthProvider.checkAuth(res.data.token)
            .then(() => {
                return Promise.resolve();
            })
            .then(() => {
                window.location.replace('/admin/users')
            })
            .catch(() => Promise.reject())
        })
        .catch((e) => {
            console.log(e);
        })
    },

    logout: () => {
        localStorage.removeItem('token');
        return Promise.resolve();
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        await axios({
            method: "GET",
            url: `http://localhost:3000/user/me`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if(res.data.user != null && res.data.user.is_admin === true) return Promise.resolve();
            else return Promise.reject();
        })
        .catch((e) => {
            return Promise.reject();
        })
    },

    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: async () => await Promise.resolve(),
}

export default AuthProvider;