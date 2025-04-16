import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import UserHeader from '../UserHeader'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);
    return (
        <div className='bg-[#F2F2F2] min-h-[100vh]'> 
            <div className='conatiner'>
                <div className='navbar-conatiner'>
                    <Navbar />
                </div>
                <div className='false-nav'></div>
                <div className='router-container'>
                    <UserHeader />
                    <div className='max-w-6xl mx-auto my-10'>
                        <div className='flex items-center justify-between my-5'>
                            <Input
                                className="w-fit"
                                placeholder="Filter by name"
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button onClick={() => navigate("/admin/companies/create")}>New Company</Button>
                        </div>
                        <CompaniesTable />
                    </div>
                </div>
            </div>
          

        </div>
    )
}

export default Companies