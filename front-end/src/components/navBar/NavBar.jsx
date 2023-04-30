import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'

import AccountControl from './accountControl/AccountControl';

import './navBar.css'

import logo from '../../assets/logo.svg'


const NavBar = () => {

  return (
    <Container id='navbar-container'>
      <Navbar bg='light'>
        <Link to='/' className='ps-2'><Navbar.Brand>
          <img src={logo} width='30' height='30' className='d-inline-block align-top' alt='logo' />
        </Navbar.Brand></Link>
        <Navbar.Toggle aria-controls='navbarScroll' data-bs-target='#navbarScroll' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <Link className='navbar-page_link px-2' to='/'>Home</Link>
            <Link className='navbar-page_link px-2' to='/'>Pricing</Link>
            <Link className='navbar-page_link px-2' to='/about'>About</Link>
          </Nav>
        </Navbar.Collapse>

        <AccountControl />

      </Navbar>
    </Container>
  )
}

export default NavBar