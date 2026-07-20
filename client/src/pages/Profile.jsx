import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import Loading from "../components/Loading";

const Profile = () => {

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        degree: "",
        skills: ""
    });
    const [originalProfile, setOriginalProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {

            const res = await getProfile();

            const profileData = {
                name: res?.name || "",
                email: res?.email || "",
                phone: res?.phone || "",
                college: res?.education?.[0]?.college || "",
                degree: res?.education?.[0]?.degree || "",
                skills: Array.isArray(res?.skills) ? res.skills.join(", ") : res?.skills || ""
            };

            setProfile(profileData);
            setOriginalProfile(profileData);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!editing) {
            return;
        }

        try {

            const payload = {
                name: profile.name,
                phone: profile.phone,
                skills: profile.skills
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                education: [
                    {
                        college: profile.college,
                        degree: profile.degree
                    }
                ]
            };

            const updatedUser = await updateProfile(payload);

            alert("Profile Updated Successfully");

            const updatedProfile = {
                name: updatedUser.name || profile.name,
                email: updatedUser.email || profile.email,
                phone: updatedUser.phone || profile.phone,
                college: updatedUser.education?.[0]?.college || profile.college,
                degree: updatedUser.education?.[0]?.degree || profile.degree,
                skills: Array.isArray(updatedUser.skills)
                    ? updatedUser.skills.join(", ")
                    : updatedUser.skills || profile.skills
            };

            setProfile(updatedProfile);
            setOriginalProfile(updatedProfile);
            setEditing(false);

        } catch (error) {

            console.log(error);

            alert("Update Failed");

        }

    };

    const handleCancel = () => {
        if (!originalProfile) return;
        setProfile(originalProfile);
        setEditing(false);
    };

    if (loading) return <Loading />;

    return (

        <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">

            <h1 className="text-3xl font-bold mb-6">
                My Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border p-3 rounded"
                    placeholder="Name"
                />

                <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="w-full border p-3 rounded bg-gray-100"
                />

                <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border p-3 rounded"
                    placeholder="Phone"
                />

                <input
                    type="text"
                    name="college"
                    value={profile.college}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border p-3 rounded"
                    placeholder="College"
                />

                <input
                    type="text"
                    name="degree"
                    value={profile.degree}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border p-3 rounded"
                    placeholder="Degree"
                />

                <textarea
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full border p-3 rounded"
                    rows="4"
                    placeholder="Skills"
                />

                <div className="flex gap-4">

                    {!editing ? (

                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            Edit Profile
                        </button>

                    ) : (
                        <>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-300 text-black px-6 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </>
                    )}

                </div>

            </form>

        </div>

    );

};

export default Profile;