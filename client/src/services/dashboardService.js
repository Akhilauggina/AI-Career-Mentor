import api from "./api";

export const getDashboard = async () => {

    const res = await api.get("/dashboard");

    return res.data;
};

export const getRecentApplications = async () => {

    const res = await api.get("/dashboard/recent");

    return res.data;
};