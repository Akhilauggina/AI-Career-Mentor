const ConfirmModal = ({
    message,
    onConfirm,
    onCancel
}) => {

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

            <div className="bg-white rounded-xl p-8">

                <h2 className="text-xl mb-6">

                    {message}

                </h2>

                <div className="flex gap-4">

                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-5 py-2 rounded"
                    >

                        Yes

                    </button>

                    <button
                        onClick={onCancel}
                        className="bg-gray-300 px-5 py-2 rounded"
                    >

                        No

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ConfirmModal;