import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { useLocation } from 'react-router-dom';




const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message, { className: " text-[20px]" });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message, { className: " text-[20px]" });
        }
    }
    return (

        <div className='flex flex-col pl-[40px] justify-between mx-auto max-w-7xl h-16'>
            <div>
                <img
                    src="https://res.cloudinary.com/dkcsvafos/image/upload/v1744276338/cx0x4zzhtlhwflqqit7g.png"
                    alt="Logo"
                    className="logo"
                />
            </div>
            {/* <div className='flex flex-col items-center gap-12'> */}
            <ul className="menu">
                {
                    user && user.role === 'recruiter' ? (
                        <>
                            <li><Link className={isActive('/admin/companies') ? 'active' : ''} to="/admin/companies">Companies</Link></li>
                            <li><Link className={isActive('/admin/jobs') ? 'active' : ''} to="/admin/jobs">Jobs</Link></li>
                            <div className='flex w-fit items-center gap-2 cursor-pointer mt-8'>
                                <LogOut className=' text-[#ffffff] text-2xl font-bold' />
                                <Button className=' text-[#ffffff] text-2xl font-bold' onClick={logoutHandler} variant="link" >Logout</Button>
                            </div>

                        </>
                    ) : (
                        <>
                            <li><Link className={isActive('/') ? 'active' : ''} to="/">Home</Link></li>
                            {
                                !user ? "" : <><li><Link className={isActive('/profile') ? 'active' : ''} to="/profile">DashBoad</Link></li>
                                    <li><Link className={isActive('/Knowaboutyourself') ? 'active' : ''} to="/Knowaboutyourself">Analyzer</Link></li></>

                            }

                            <li><Link className={isActive('/jobs') ? 'active' : ''} to="/jobs">Jobs</Link></li>

                            <li><Link className={isActive('/browse') ? 'active' : ''} to="/browse">Browse</Link></li>
                            {
                                !user ? "" :
                                    <div className='flex w-fit items-center gap-2 cursor-pointer mt-8'>
                                        <LogOut className=' text-[#ffffff] text-2xl font-bold' />
                                        <Button className=' text-[#ffffff] text-2xl font-bold' onClick={logoutHandler} variant="link" >Logout</Button>
                                    </div>
                            }

                        </>
                    )
                }


            </ul>


        </div>
        // </div>


    )
}

export default Navbar


