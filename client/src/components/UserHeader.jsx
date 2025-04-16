import React, { useState } from 'react'
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

function UserHeader() {

    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    const { user } = useSelector(store => store.auth);

    const recruiter = user?.role == "recruiter"
    return (
        <div className='flex justify-between items-center'>

            <div className=" flex gap-2 items-center">
                {/* <CgMenuRightAlt className=' text-xl font-bold ' /> */}
                <h1 className='text-xl font-bold'>Welcome</h1>
            </div>
            {
                recruiter ? "" : <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    {/* <Search className='h-5 w-5' /> */}
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full bg-[#F2F2F2]'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#2563eb]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            }


            <div>
                {
                    !user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button className="bg-[#2563eb] hover:bg-[#5563eb]">Signup</Button></Link>
                        </div>
                    ) : (
                        recruiter ? <div className=' flex bg-[#FFFFFF] rounded-md p-1'>
                            <div className='w-12 h-12 bg-black rounded-full'>
                                <img src={user?.profile?.profilePhoto} alt="" className='w-[100%] h-[100%] rounded-full' />
                            </div>
                            <div className='ml-1 flex flex-col justify-center min-w-[80px]'>
                                <h1 className='text-[15px] font-bold'>{user?.fullname}</h1>
                                <p className='text-[12px] font-bold'> Recruiter</p>
                            </div>
                        </div> :
                            <Link to="/profile">
                                <div className=' flex bg-[#FFFFFF] rounded-md p-1'>
                                    <div className='w-12 h-12 bg-black rounded-full'>
                                        <img src={user?.profile?.profilePhoto} alt="" className='w-[100%] h-[100%] rounded-full' />
                                    </div>
                                    <div className='ml-1 flex flex-col justify-center'>
                                        <h1 className='text-[15px] font-bold'>{user?.fullname}</h1>
                                        <p className='text-[12px] font-bold'>Student</p>
                                    </div>
                                </div>
                            </Link>

                    )
                }

            </div>

        </div>
    )
}

export default UserHeader
