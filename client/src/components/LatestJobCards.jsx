import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>

            <div className=' flex gap-4'>
                <div className='flex justify-between items-center'>
                    <img className='h-10 w-10' src={job?.company?.logo} alt="" />
                </div>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600' dangerouslySetInnerHTML={{ __html: job?.description.slice(0, 150) }}></p>
            </div>
            <div className='felx items-center gap-3 mt-2 text-xs'>
                <span className='bg-blue-50 border-blue-200 px-4 py-1.5 rounded'>{job?.position}</span>
                <span className='ml-2 bg-red-50 border-red-200 px-4 py-1.5 rounded'>{job?.jobType}</span>
                <span className='ml-2 bg-[#F2D7D5] border-red-200 px-4 py-1.5 rounded'>{job?.salary}</span>

            </div>

        </div>
    )
}

export default LatestJobCards