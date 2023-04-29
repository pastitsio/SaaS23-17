import React from 'react'
import { UserService } from '../../services'

const About = () => {
  return (
    <div>{JSON.stringify(UserService.getUserProfile())}</div>
  )
}

export default About