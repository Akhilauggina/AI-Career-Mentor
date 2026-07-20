const EmptyState = ({ message }) => {

    return (

        <div className="bg-white shadow rounded-xl p-10 text-center">

            <h2 className="text-gray-600 text-xl">

                {message}

            </h2>

        </div>

    );

};

export default EmptyState;