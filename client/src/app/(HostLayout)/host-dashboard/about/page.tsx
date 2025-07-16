import AboutCardContainer from '@/components/about/aboutContainer/AboutCardContainer'
import AboutHeader from '@/components/about/aboutContainer/AboutHeader'
import AboutTextAndVideoContainer from '@/components/about/aboutTextAndVideo/AboutTextAndVideoContainer'
import React from 'react'

const AboutPageContainer = () => {
  return (
    <div className='Container'>
       <AboutHeader/>
       <AboutCardContainer/>
       <AboutTextAndVideoContainer/>
    </div>
  )
}

export default AboutPageContainer
