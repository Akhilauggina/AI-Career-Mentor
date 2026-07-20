import { Download, Trash2, Star } from "lucide-react";

const ResumeCard = ({ resume, onDelete }) => {

    return (

        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">

            <div className="flex justify-between items-center">

                <div>

                    <h2 className="text-xl font-semibold">

                        {resume.title}

                    </h2>

                    <p className="text-gray-500 mt-1">

                        ATS Score : {resume.atsScore}
                    </p>

                </div>

                {resume.isActive && (

                    <span className="flex items-center gap-1 text-yellow-500">

                        <Star size={18}/>

                        Active

                    </span>

                )}

            </div>

            <div className="flex gap-3 mt-5">

                <a

                    href={resume.pdfUrl}

                    target="_blank"

                    rel="noreferrer"

                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                >

                    <Download size={18}/>

                    View

                </a>

                <button

                    onClick={() => onDelete(resume._id)}

                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                >

                    <Trash2 size={18}/>

                    Delete

                </button>

            </div>

        </div>

    );

};

export default ResumeCard;