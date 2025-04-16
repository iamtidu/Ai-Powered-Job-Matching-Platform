import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-white text-[#001F3F] font-bold'>Al-Powered Job Matching Platform</span>
                <h1 className='text-5xl font-bold'>Search, Apply & <br /> Secure Your <span className='text-[#2563eb]'>Dream Jobs</span></h1>
                <p>A smart job-finding platform connecting seekers with opportunities through AI-matching, <br /> real-time updates, and personalized career growth tools.</p>
            </div>
        </div>
    )
}

export default HeroSection