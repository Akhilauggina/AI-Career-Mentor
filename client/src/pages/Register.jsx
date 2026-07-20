import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",
        email: "",
        password: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await registerUser(form);

            navigate("/login");

        } catch (error) {

            alert(error.response.data.message);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center">

            <form
                onSubmit={handleSubmit}
                className="shadow-lg p-8 rounded-xl w-96"
            >

                <h1 className="text-3xl font-bold mb-6">

                    Register

                </h1>

                <input
                    name="name"
                    placeholder="Name"
                    className="border p-2 w-full mb-4"
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-4"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-4"
                    onChange={handleChange}
                />

                <button className="bg-green-600 text-white w-full py-2 rounded">

                    Register

                </button>

            </form>

        </div>

    );

};

export default Register;