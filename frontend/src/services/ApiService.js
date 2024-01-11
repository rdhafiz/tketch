import axios from 'axios'
import AuthService from "./AuthService";

let headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Authorization': AuthService.getAccessToken() ?? ''
};
const ApiService = {

    POST: function (url, param, callback)  {
        axios.post(url, param, {headers: headers}).then((response) => {
            if (response.status === 200 || response.status === 201) {
                callback(response.data);
            }
        }).catch(err => {
            if (err) {
                callback(err?.response?.status)
                this.ErrorHandler(err?.response?.data)
                if (err.response.status === 401) {
                    AuthService.logout()
                }
            }
        })
    },
    POST_FORMDATA: function (url, param, callback) {
        headers['Content-Type'] = 'multipart/form-data';
        axios.post(url, param, {headers: headers}).then((response) => {
            if (response.status === 200) {
                callback(response.data);
            }
        }).catch(err => {
            if (err) {
                callback(err?.response?.status)
                this.ErrorHandler(err?.response?.data)
                if (err.response.status === 401) {
                    AuthService.logout()
                }
            }
        })
    },
    GET: function (url, callback)  {
        axios.get(url, {headers: headers}).then((response) => {
            if (response.status === 200) {
                callback(response.data);
            }
        }).catch(err => {
            if (err) {
                callback(err?.response?.status)
                this.ErrorHandler(err?.response?.data)
                if (err.response.status === 401) {
                    AuthService.logout()
                }
            }
        })
    },

    DOWNLOAD: function (url, param, callback)  {
        axios.post(url, param, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Authorization': AuthService.getAccessToken()
            },
            responseType: 'blob' }).then((response) => {
            if (response.status === 200) {
                callback(response.data);
            }
        }).catch(err => {
            if (err) {
                callback(err?.response?.status)
                this.ErrorHandler(err?.response?.data)
                if (err.response.status === 401) {
                    AuthService.logout()
                }
            }
        })
    },
    ErrorHandler(errors) {
        for (const property in errors) {
            const inputElement = document.querySelector(`[name="${property}"]`);
            const invalidFeedback = inputElement?.closest('.form-input')?.querySelector('.invalid-feedback');
            if (invalidFeedback) {
                invalidFeedback.textContent = errors[property];
            }
        }
    },
    ClearErrorHandler() {
        const elements= document.querySelectorAll('.invalid-feedback');
        elements.forEach((e) => {
            e.textContent = '';
        });
    }
}
export default ApiService;
