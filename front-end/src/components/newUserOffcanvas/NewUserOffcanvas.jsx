import React from 'react'
import { Button, Offcanvas } from 'react-bootstrap'

import { UserService } from '../../services'

import './newUserOffcanvas.css'

const NewUserOffcanvas = ({isNewUser, setIsNewUser}) => {
  return (
    <Offcanvas backdrop={true} show={isNewUser} placement='bottom'>
      <Offcanvas.Header >
        <Offcanvas.Title>New user detected, <span id='welcome-span'>welcome aboard!</span></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body >
        If you continue, <b>your email will be stored in our database</b> to allow you to <u>store your created charts</u> and <u>purchase charts credits</u>.
        <Button variant="secondary" id="cancel-button" onClick={() => UserService.doLogout()}>
          Cancel
        </Button>
        <Button variant="primary" id="continue-button" onClick={() => setIsNewUser(false)}>
          Continue
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default NewUserOffcanvas