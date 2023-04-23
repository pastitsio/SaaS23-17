import React from 'react'
import { Link } from 'react-router-dom'

import { Button, Nav, Navbar } from 'react-bootstrap'

import './navBar.css'

import { LoginModal, RenderOnAnonymous, RenderOnAuth } from '..'
import logo from '../../assets/logo.svg'
import { UserService } from '../../services'

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
          <Link className='navbar_entry' to="/about">About</Link>
        </Nav>
      </Navbar.Collapse>
      <RenderOnAnonymous>
        <LoginModal />
      </RenderOnAnonymous>
      <RenderOnAuth>
        <p>Welcome <u>{UserService.getUsername()}</u> </p>
        <Button id="navbar-logout" onClick={() => UserService.doLogout()}>Logout</Button>
      </RenderOnAuth>
    </Navbar>
  )
}

export default NavBar