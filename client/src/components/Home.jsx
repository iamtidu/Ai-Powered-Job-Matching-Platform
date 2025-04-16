import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserHeader from './UserHeader'
import Recommended from './Recommended'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      <div className='conatiner'>
        <div className='navbar-conatiner'>
          <Navbar />
        </div>
        <div className='false-nav'></div>
        <div className='router-container'>
         
          <UserHeader />
          <HeroSection />
          {/* <CategoryCarousel /> */}
          <LatestJobs />
          <Recommended/>

          {/* <Footer /> */}
        </div>

      </div>
    </div>
  )
}

export default Home