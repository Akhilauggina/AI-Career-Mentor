import api from "./api";

export const analyzeResume = async (resumeId) => {

    const res = await api.post("/ai/analyze", {

        resumeId

    });

    return res.data;
};

export const getInterviewQuestions = async (data) => {

    const res = await api.post("/ai/interview", data);

    return res.data;
};

export const careerMentor = async (data) => {

    const res = await api.post("/ai/chat", data);

    return res.data;
};