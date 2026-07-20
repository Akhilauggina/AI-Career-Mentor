import { useEffect, useState } from "react";

import {
    getJobs,
    createJob,
    updateJob,
    deleteJob
} from "../services/jobService";

import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
const [jobs, setJobs] = useState([]);

const [loading, setLoading] = useState(true);

const [search, setSearch] = useState("");

const [editingId, setEditingId] = useState(null);

const [form, setForm] = useState({

    company: "",

    title: "",

    location: "",

    status: "Saved"

});
useEffect(() => {

    fetchJobs();

}, []);

const fetchJobs = async () => {

    try {

        const res = await getJobs();

        setJobs(res.jobs || []);

    }

    catch (err) {

        console.log(err);

    }

    finally {

        setLoading(false);

    }

};
const handleChange = (e) => {

    setForm({

        ...form,

        [e.target.name]: e.target.value

    });

};
const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        if (editingId) {

            await updateJob(editingId, form);

        }

        else {

            await createJob(form);

        }

        fetchJobs();

        setEditingId(null);

        setForm({

            company: "",

            title: "",

            location: "",

            status: "Saved"

        });

    }

    catch (err) {

        console.log(err);

    }

};
const handleDelete = async (id) => {

    if (!window.confirm("Delete Job?")) return;

    await deleteJob(id);

    fetchJobs();

};
const handleEdit = (job) => {

    setEditingId(job._id);

    setForm({

        company: job.company,

        title: job.title,

        location: job.location,

        status: job.status

    });

};

export default function Jobs() {