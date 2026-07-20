import { useEffect, useState } from "react";
import {
    getResumes,
    uploadResume,
    deleteResume
} from "../services/resumeService";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

const Resume = () => {

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {

        fetchResumes();

    }, []);

    const fetchResumes = async () => {

        try {

            const res = await getResumes();

            setResumes(res.resumes || []);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleUpload = async (e) => {

        e.preventDefault();

        if (!title || !file) {

            alert("Please enter title and select PDF");

            return;

        }

        try {

            const formData = new FormData();

            formData.append("title", title);
            formData.append("resume", file);

            await uploadResume(formData);

            alert("Resume Uploaded Successfully");

            setTitle("");
            setFile(null);

            fetchResumes();

        } catch (error) {

            console.log(error);

            alert("Upload Failed");

        }

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this resume?"
        );

        if (!confirmDelete) return;

        try {

            await deleteResume(id);

            fetchResumes();

        } catch (error) {

            console.log(error);

        }

    };

    if (loading) return <Loading />;

    return (

        <div className="max-w-5xl mx-auto">

            <h1 className="text-3xl font-bold mb-6">

                Resume Management

            </h1>

            {/* Upload Form */}

            <form
                onSubmit={handleUpload}
                className="bg-white shadow rounded-lg p-6 mb-8"
            >

                <input
                    type="text"
                    placeholder="Resume Title"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    className="w-full border rounded p-3 mb-4"
                />

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }
                    className="mb-4"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Upload Resume
                </button>

            </form>

            {/* Resume List */}

            {

                resumes.length === 0 ?

                    (

                        <EmptyState

                            message="No Resume Uploaded"

                        />

                    )

                    :

                    (

                        resumes.map((resume) => (

                            <div

                                key={resume._id}

                                className="bg-white shadow rounded-lg p-5 mb-5"

                            >

                                <div className="flex justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold">

                                            {resume.title}

                                        </h2>

                                        <p>

                                            ATS Score :

                                            <span className="font-bold">

                                                {" "}
                                                {resume.atsScore}%

                                            </span>

                                        </p>

                                        {

                                            resume.isActive && (

                                                <span className="text-green-600 font-semibold">

                                                    ⭐ Active Resume

                                                </span>

                                            )

                                        }

                                    </div>

                                    <div className="space-x-2">

                                        <a

                                            href={resume.pdfUrl}

                                            target="_blank"

                                            rel="noreferrer"

                                            className="bg-green-600 text-white px-4 py-2 rounded"

                                        >

                                            View

                                        </a>

                                        <button

                                            onClick={() =>
                                                handleDelete(
                                                    resume._id
                                                )
                                            }

                                            className="bg-red-600 text-white px-4 py-2 rounded"

                                        >

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    )

            }

        </div>

    );

};

export default Resume;