import axiosInstance from './AxiosInstance'

const getProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile')
        return response.data
    } catch (error) {
        console.error('Error fetching profile:', error)
        throw error
    }
}

const updateProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put('/auth/profile', profileData)
        return response.data
    } catch (error) {
        console.error('Error updating profile:', error)
        throw error
    }
}

export default { getProfile, updateProfile }
