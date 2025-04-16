import React from 'react'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        <div className='border p-6 shadow rounded bg-white border-gray-100'>
            <p className='text-sm -mt-3 text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
            <div className='flex items-start gap-4 mb-4'>
                <div className='flex justify-between items-center'>
                    <img className='h-8 w-8' src={job?.company?.logo} alt="" />
                </div>
                <h4 className='font-medium text-xl'>{job?.company?.name}</h4>
            </div>
            <div className='felx items-center gap-3 mt-2 text-xs'>
                <span className='bg-blue-50 border-blue-200 px-4 py-1.5 rounded'>{job?.title}</span>
                <span className='ml-2 bg-red-50 border-red-200 px-4 py-1.5 rounded'>{job?.location}</span>

            </div>
            <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{ __html: job?.description.slice(0, 150) }}>
            </p>

            <div className='mt-4 flex gap-4 text-sm'>
                <button className='bg-blue-600 text-white px-4 py-2 rounded'
                 onClick={() => navigate(`/description/${job?._id}`)}
                >Apply Now</button>
                <button className='text-gray-500 border border-gray-500 rounded px-4 py-2'
                    onClick={() => navigate(`/description/${job?._id}`)}
                >Learn More</button>
            </div>
        </div>
    )
}

export default Job