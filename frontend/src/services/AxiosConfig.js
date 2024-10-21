import axios from "axios";
import { ErrorHandler } from "./ErrorHandler";

export default function AxiosConfig() {
    const instanceConfig = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    instanceConfig.interceptors.response.use(
        (response) => handleSuccess(response),
        (error) => {
            ErrorHandler(error);
            return Promise.reject(error);  // Propagate the error
        }
    );

    function handleSuccess(response) {
        return response;  // Return successful response
    }

    return instanceConfig;
}
