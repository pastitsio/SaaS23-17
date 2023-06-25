import React, { useContext } from 'react'
import { Button, Container, Offcanvas } from 'react-bootstrap'

import { BackendService, UserService } from '../../services'

import './newUserOffcanvas.css'
import { SubmitWaitButton } from '../'
import { UserContext } from '../../UserContext'

const NewUserOffcanvas = ({ isNewUser, setIsNewUser }) => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  const handleSaveButton = () => {

    return new Promise(async (resolve, reject) => {
      try {
        await BackendService.saveUserToDB(userInfo.email);
        setUserInfo((prev) => ({ // update context on success
          ...prev,
          newUser: false
        }))
        resolve(() => { setIsNewUser(false) });
      } catch (e) {
        reject(e)
      }
    })
  }


  return (
    <Offcanvas backdrop={true} show={isNewUser} placement='start'>
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
          />
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default NewUserOffcanvas