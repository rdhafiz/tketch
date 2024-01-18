const AuthService = {
    setAuthentication: (access_token, user) => {
        let date = new Date();
        date.setTime(date.getTime() + (2*24*60*60*1000));
        const token = "tketchAccessToken=" + access_token;
        const info = "tketchUserInfo=" + JSON.stringify(user);
        const expires = "; expires=" + date.toUTCString();
        document.cookie = token + expires + "; path=/";
        document.cookie = info + expires + "; path=/";
    },
    setUser: (user) => {
        let date = new Date();
        date.setTime(date.getTime() + (2*24*60*60*1000));
        const info = "tketchUserInfo=" + JSON.stringify(user);
        const expires = "; expires=" + date.toUTCString();
        document.cookie = info + expires + "; path=/";
    },
    getAccessToken: (isBearer = true) => {
        let tketchAccessToken = null;
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.includes('tketchAccessToken')) {
                tketchAccessToken = c.replace('tketchAccessToken=', '');
            }
        }
        if (isBearer) {
            return "Bearer " + tketchAccessToken;
        }
        return tketchAccessToken;
    },
    getUser: () => {
        let user = null;
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.includes('tketchUserInfo')) {
                user = c.replace('tketchUserInfo=', '');
            }
        }
        return JSON.parse(user);
    },
    logout: () => {
        document.cookie = "tketchAccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "tketchUserInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload()
    }
}
export default AuthService;
