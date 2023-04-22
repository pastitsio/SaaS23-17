import React from 'react'
import { Link } from 'react-router-dom'

import { Nav, Navbar } from 'react-bootstrap'

import './navBar.css'

import logo from '../../assets/logo.svg'
import { LoginModal } from '..'

const NavBar = () => {

  return (
    <Navbar bg="light" id="navbar-container">
      <Link to="/"><Navbar.Brand>
        <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="logo" />
      </Navbar.Brand></Link>
      <Navbar.Toggle aria-controls="navbarScrill" data-bs-target="#navbarScroll" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto navbar_entries">
          <Link className='navbar_entry' to="/">Home</Link>
          <Link className='navbar_entry' to="/">Pricing</Link>
          <Link className='navbar_entry' to="/">About</Link>
        </Nav>
      </Navbar.Collapse>
      <LoginModal />
    </Navbar>
  )
}

export default NavBar