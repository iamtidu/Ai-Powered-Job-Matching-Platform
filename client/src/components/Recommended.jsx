import React from "react";
import { useSelector } from "react-redux";
import Job from "./Job";

const Recommended = () => {
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    // Extract user skills
    const userSkills = user?.profile?.skills || [];

    // Filter jobs based on matching skills
    const recommendedJobs = allJobs?.filter(job =>
        job.requirements?.some(req => userSkills.includes(req))
    );

    return user ? (
        <div className='pb-5 pr-4'>
            <h1 className='text-4xl font-bold mb-5' >Recommended Jobs</h1>
            <div className='grid grid-cols-3 gap-4'>
                {recommendedJobs.length > 0 ? (
                    recommendedJobs.map((job) => (
                        <Job key={job._id} job={job} />
                    ))
                ) : (
                    <p>No Recommended Jobs Found</p>
                )}
            </div>
        </div>
    ) : null;
    
};

export default Recommended;
