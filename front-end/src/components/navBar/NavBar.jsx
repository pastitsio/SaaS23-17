import React from 'react'
import { Link } from 'react-router-dom'

import { Container, Nav, Navbar } from 'react-bootstrap'

import './navBar.css'

import { LoginModal, RenderOnAuth } from '..'
import logo from '../../assets/logo.svg'
import { UserService } from '../../services'

const NavBar = () => {

  return (
    // <Container id="navbar-container">
      <Navbar bg="light">
        <Link to="/"><Navbar.Brand>
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="logo" />
        </Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="navbarScroll" data-bs-target="#navbarScroll" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" id="navbar-entries">
            <Link className='navbar_entry' to="/">Home</Link>
            <Link className='navbar_entry' to="/">Pricing</Link>
            <Link className='navbar_entry' to="/about">About</Link>
          </Nav>
        </Navbar.Collapse>

        <RenderOnAuth>
          <Container id='navbar-username'><u>{UserService.getUsername()}</u></Container>
        </RenderOnAuth>

        <LoginModal id='navbar-login'/>

      </Navbar>
    // </Container>
  )
}

export default NavBar