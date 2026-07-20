import api from "./api";

export const getJobs = async () => {

    const res = await api.get("/jobs");

    return res.data;
};

export const createJob = async (data) => {

    const res = await api.post("/jobs", data);

    return res.data;
};

export const updateJob = async (id, data) => {

    const res = await api.put(`/jobs/${id}`, data);

    return res.data;
};

export const deleteJob = async (id) => {

    const res = await api.delete(`/jobs/${id}`);

    return res.data;
};