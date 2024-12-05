import axios from "axios"
import { Navigate } from "react-router-dom"

/*const token = localStorage.getItem("token")

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        common: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    },
})*/

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// Adding a request interceptor to add the token dynamically for each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => handleSuccess(response),
    (error) => handleError(error)
)

function handleSuccess(response) {
    return response
}

function handleError(error) {
    if (error.response && error.response.code === 401) {
        Navigate({ to: "/login", replace: true })
    }
    console.log(error)
}

export default axiosInstance