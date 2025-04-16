import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import UserHeader from './UserHeader';
import Navbar from './shared/Navbar';
import Job from './Job';

import { IoBagOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosTimer } from "react-icons/io";
import { motion } from 'framer-motion';

const JobDescription = () => {
    const { singleJob, allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className='bg-[#F2F2F2]'>
            <div className='conatiner'>
                <div className='navbar-conatiner'>
                    <Navbar />
                </div>
                <div className='false-nav'></div>
                <div className='router-container'>
                    <UserHeader />

                    <div className='w-full bg-[#BBDEFB] h-[200px] border border-[#0D47A1] rounded-lg flex justify-between items-center px-[40px] mt-5'>
                        <div className='flex gap-2'>
                            <div className='flex justify-between items-center rounded-full h-12 w-12'>
                                <img className='h-12 w-12 rounded-full' src={singleJob?.company?.logo} alt="" />
                            </div>
                            <div>
                                <div>
                                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                                </div>
                                <div className='flex gap-8'>
                                    <div className='flex items-center gap-1'>
                                        <IoBagOutline />
                                        {singleJob?.company?.name}
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <IoLocationOutline />
                                        {singleJob?.company?.location}
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <IoIosTimer />
                                        {singleJob?.jobType}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div>
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2563eb] hover:bg-[#5563eb]'}`}>
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    </div>
                    <div className='max-w-7xl mx-auto my-10'>

                        <h1 className='font-bold text-xl mb-3'>Job Desciption</h1>
                        <h1 className='pl-4 text-justify'>{singleJob?.description}</h1>
                        <div className='my-4'>
                            <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                            <h1 className='font-bold my-1'>Skills: <span className='pl-4 font-normal text-gray-800'>{singleJob?.requirements}</span></h1>
                            <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                            <h1 className='font-bold my-1'>Total Job: <span className='pl-4 font-normal text-gray-800'>{singleJob?.position}</span></h1>
                            <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                            <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                            <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                            <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
                            <h1 className='font-bold my-1'>Know More:  <a className='text-blue-600' href={singleJob?.company?.website}>Link</a> </h1>
                        </div>
                    </div>
                </div>

            </div>


            {/* show the Similar Job On the basic on title only */}

            <div className='pl-[20%] pb-5 pr-4'>
                <h1 className=' font-bold text-xl mb-3'>Similar Jobs</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
            // pahle singleJobs fetach hoga tab aagye check kare ge ngi to nhi kare ge 
                        singleJob?.title
                            ? allJobs.some(job => job.title === singleJob.title)
                                ? allJobs.filter(job => job.title === singleJob.title).map((job) => (

            // job jsx file ko call kare ge and as props job send kare ge pura data
                                    <Job key={job._id} job={job} />
                                ))
                                : "Not Found"
                            : "No Job Found"
                    }
                </div>
            </div>
        </div>



    )
}

export default JobDescription