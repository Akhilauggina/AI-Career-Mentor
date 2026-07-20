import api from "./api";

export const getProfile = async () => {

    const res = await api.get("/users/profile");

    return res.data.user;
};

export const updateProfile = async (data) => {

    const res = await api.put("/users/profile", data);

    return res.data.user;
};