import StatusBadge from "./StatusBadge";
import { Trash2 } from "lucide-react";

const ApplicationCard = ({
    application,
    onDelete,
    onStatusChange
}) => {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-2xl font-semibold">

                        {application.job?.title}

                    </h2>

                    <p className="text-gray-600">

                        {application.job?.company}

                    </p>

                </div>

                <StatusBadge status={application.status}/>

            </div>

            <div className="mt-4">

                <p>

                    Resume :

                    {" "}

                    {application.resume?.title}

                </p>

                <p>

                    ATS :

                    {application.resume?.atsScore}

                </p>

            </div>

            <div className="flex justify-between mt-6">

                <select

                    value={application.status}

                    onChange={(e) =>
                        onStatusChange(
                            application._id,
                            e.target.value
                        )
                    }

                    className="border rounded-lg px-3 py-2"

                >

                    <option>Applied</option>

                    <option>Interview Scheduled</option>

                    <option>Interview Completed</option>

                    <option>Offer</option>

                    <option>Rejected</option>

                    <option>Accepted</option>

                </select>

                <button

                    onClick={() => onDelete(application._id)}

                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                >

                    <Trash2 size={18}/>

                    Delete

                </button>

            </div>

        </div>

    );

};

export default ApplicationCard;