import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'

import AccountControl from './accountControl/AccountControl';

import './navBar.css'

import logo from '../../assets/logo.svg'


const NavBar = () => (
  <Container id='navbar-container'>
    <Navbar bg='light'>
      <img id='navbar-brand' src={logo} width='30' height='30' className='' alt='logo' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='me-auto'>
          <Link className='navbar-page_link px-2' to='/'>Home</Link>
          <Link className='navbar-page_link px-2' to='/afterlogin'>After</Link>
          <Link className='navbar-page_link px-2' to='/about'>About</Link>
        </Nav>
      </Navbar.Collapse>

      <AccountControl />

    </Navbar>
  </Container>
)

export default NavBar