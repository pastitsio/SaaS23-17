import React from 'react'

import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './navBar.css'

import logo from '../../assets/logo.svg'

const NavBar = () => {
  return (
    <Navbar className='navbar' bg="light">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav className='navbar-sign_buttons'>
          <Button className='navbar-sign_buttons-in'>Sign In</Button>
          <Button className='navbar-sign_buttons-up'>Sign Up</Button>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default NavBar