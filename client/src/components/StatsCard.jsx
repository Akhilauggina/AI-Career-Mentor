const StatsCard = ({
    title,
    value,
    icon
}) => {

    return (

        <div className="bg-white shadow rounded-xl p-5 flex justify-between items-center">

            <div>

                <h2 className="text-gray-500">

                    {title}

                </h2>

                <h1 className="text-3xl font-bold mt-2">

                    {value}

                </h1>

            </div>

            <div>

                {icon}

            </div>

        </div>

    );

};

export default StatsCard;