import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

import {
    getDashboard,
    getRecentApplications
} from "../services/dashboardService";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState({

        totalApplications: 0,
        totalJobs: 0,
        totalResumes: 0,
        offers: 0

    });

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const dashboardData =
                await getDashboard();

            const recentApplications =
                await getRecentApplications();

            setDashboard(
                dashboardData?.dashboard ?? {
                    totalApplications: 0,
                    totalJobs: 0,
                    totalResumes: 0,
                    offers: 0
                }
            );

            const recentApps = Array.isArray(recentApplications?.applications)
                ? recentApplications.applications
                : Array.isArray(recentApplications?.data)
                    ? recentApplications.data
                    : [];

            setApplications(recentApps);

        } catch (error) {

            console.error(error);
            setDashboard({
                totalApplications: 0,
                totalJobs: 0,
                totalResumes: 0,
                offers: 0
            });
            setApplications([]);

        } finally {

            setLoading(false);

        }

    };

    if (loading)
        return <Loading />;

    return (

        <div>

            <h1
                className="text-3xl font-bold mb-8"
            >

                Dashboard

            </h1>

            <div
                className="grid grid-cols-4 gap-5"
            >

                <DashboardCard

                    title="Applications"

                    value={
                        dashboard?.totalApplications ?? 0
                    }

                    color="text-blue-600"

                />

                <DashboardCard

                    title="Jobs"

                    value={
                        dashboard?.totalJobs ?? 0
                    }

                    color="text-green-600"

                />

                <DashboardCard

                    title="Resumes"

                    value={
                        dashboard?.totalResumes ?? 0
                    }

                    color="text-purple-600"

                />

                <DashboardCard

                    title="Offers"

                    value={
                        dashboard?.offers ?? 0
                    }

                    color="text-yellow-600"

                />

            </div>

            <div
                className="mt-10"
            >

                <h2
                    className="text-2xl font-semibold mb-5"
                >

                    Recent Applications

                </h2>

                {

                    applications.length === 0 ?

                        (

                            <EmptyState

                                message="No Applications Found"

                            />

                        )

                        :

                        (

                            applications.map((app) => (

                                <div

                                    key={app._id}

                                    className="bg-white rounded-lg shadow p-4 mb-4"

                                >

                                    <h2
                                        className="font-semibold"
                                    >

                                        {

                                            app.job?.title

                                        }

                                    </h2>

                                    <p>

                                        {

                                            app.job?.company

                                        }

                                    </p>

                                    <p>

                                        {

                                            app.status

                                        }

                                    </p>

                                </div>

                            ))

                        )

                }

            </div>

        </div>

    );

};

export default Dashboard;