import axios from "axios";
import { ErrorHandler } from "./ErrorHandler";

export default function AxiosConfig() {
    const token = localStorage.getItem("stucademy-tks");

    const instanceConfig = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            common: {
                Authorization: token ? `Bearer ${token}` : null,
            },
        },
    });

    instanceConfig.interceptors.response.use(
        (response) => handleSuccess(response),
        (error) => {
            ErrorHandler(error);
            return Promise.reject(error); // Ensure errors are propagated
        }
    );

    function handleSuccess(response) {
        return response;
    }

    return instanceConfig;
}
