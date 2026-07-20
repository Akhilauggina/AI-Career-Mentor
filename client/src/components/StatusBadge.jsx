const StatusBadge = ({ status }) => {

    const colors = {

        Applied: "bg-blue-100 text-blue-700",

        "Interview Scheduled":
            "bg-yellow-100 text-yellow-700",

        Rejected:
            "bg-red-100 text-red-700",

        Offer:
            "bg-green-100 text-green-700",

        Accepted:
            "bg-purple-100 text-purple-700"

    };

    return (

        <span
            className={`px-3 py-1 rounded-full text-sm ${colors[status]}`}
        >

            {status}

        </span>

    );

};

export default StatusBadge;