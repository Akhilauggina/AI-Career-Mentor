const DashboardCard = ({ title, value, color }) => {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h3 className="text-gray-500 text-lg">

                {title}

            </h3>

            <h1
                className={`text-4xl font-bold mt-4 ${color}`}
            >

                {value}

            </h1>

        </div>

    );

};

export default DashboardCard;