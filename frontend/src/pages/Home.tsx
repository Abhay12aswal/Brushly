
import Navbar from '@/components/Navbar'
import PaintingDetail from '@/components/PaintingDetail'
import PaintingGrid from '@/components/PaintingGrid'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Navbar/>
      {/* <PaintingDetail/> */}
      <PaintingGrid/>
    </div>
  )
}

export default Home