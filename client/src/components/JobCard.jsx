import { MapPin, IndianRupee, Pencil, Trash2 } from "lucide-react";

const JobCard = ({ job, onEdit, onDelete }) => {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-2xl font-semibold">

                        {job.title}

                    </h2>

                    <p className="text-gray-600">

                        {job.company}

                    </p>

                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                    {job.status}

                </span>

            </div>

            <div className="mt-4 space-y-2">

                <p className="flex items-center gap-2">

                    <MapPin size={18}/>

                    {job.location}

                </p>

                <p className="flex items-center gap-2">

                    <IndianRupee size={18}/>

                    {job.salary}

                </p>

            </div>

            <div className="flex gap-3 mt-6">

                <button

                    onClick={() => onEdit(job)}

                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                >

                    <Pencil size={18}/>

                    Edit

                </button>

                <button

                    onClick={() => onDelete(job._id)}

                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                >

                    <Trash2 size={18}/>

                    Delete

                </button>

            </div>

        </div>

    );

};

export default JobCard;