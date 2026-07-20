import api from "./api";

export const getResumes = async () => {

    const res = await api.get("/resume");

    return res.data;
};

export const uploadResume = async (formData) => {

    const res = await api.post(
        "/resume/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};

export const deleteResume = async (id) => {

    const res = await api.delete(`/resume/${id}`);

    return res.data;
};