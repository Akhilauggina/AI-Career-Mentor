import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({

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

            const data = await loginUser(form);

            login(data.token, data.user);

            navigate("/dashboard");

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

                    Login

                </h1>

                <input

                    type="email"

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

                <button
                    className="bg-blue-600 text-white w-full py-2 rounded"
                >

                    Login

                </button>

            </form>

        </div>

    );

};

export default Login;