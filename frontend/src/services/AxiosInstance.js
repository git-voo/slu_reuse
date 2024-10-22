import axios from "axios"
import { Navigate } from "react-router-dom"

const token = localStorage.getItem("token")

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        common: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    },
})


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
    throw error
}

export default axiosInstance