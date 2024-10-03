const getProfile = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        name: 'Mohammad',
        email: 'mohammad@gmail.com',
        bio: 'A short description about myself.',
    };
};

const updateProfile = async (profileData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return profileData;
};


export default { getProfile, updateProfile };