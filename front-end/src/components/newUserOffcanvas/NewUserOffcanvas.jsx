import React from 'react'
import { Button, Container, Offcanvas } from 'react-bootstrap'

import { FetchService, UserService } from '../../services'

import './newUserOffcanvas.css'
import { SubmitWaitButton } from '../'

const NewUserOffcanvas = ({ isNewUser, setIsNewUser }) => {

  const handleSaveButton = () => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    return new Promise(async (resolve, reject) => {
      try {
        await FetchService.saveUserToDB(userInfo._id);
        resolve(()=> undefined);
      } catch (e) {
        reject(e)
      }
    })   
  }


  return (
    <Offcanvas backdrop={true} show={isNewUser} placement='bottom'>
      <Offcanvas.Header >
        <Offcanvas.Title>New user detected, <span id='welcome-span'>welcome aboard!</span></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className='d-flex flex-col justify-content-start'>
        <Container>If you continue, <b>your email will be stored in our database</b> to allow you to <u>store your created charts</u> and <u>purchase charts credits</u>.</Container>

        <Container>
          <Button variant="secondary" id="cancel-button" onClick={UserService.doLogout}>
            Cancel
          </Button>
          <SubmitWaitButton
            action={handleSaveButton}
            actionName='Continue'
            cssId="continue-button"
            resetParentState={() => setIsNewUser(false)}
          />
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default NewUserOffcanvas