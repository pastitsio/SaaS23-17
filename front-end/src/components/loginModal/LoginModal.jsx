import { React, useState } from "react";

import { Button, Container, Modal } from "react-bootstrap";

import LoginForm from './LoginForm';

import { RenderOnAnonymous, RenderOnAuth } from "../";
import { UserService } from "../../services";
import './login.css';

const LoginModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <RenderOnAuth>
        <Container id='navbar-username'><u>{UserService.getUsername()}</u></Container>
        <Button id="navbar-logout" onClick={() => UserService.doLogout()}>
          Logout
        </Button>
      </RenderOnAuth>

      <RenderOnAnonymous>
        <Button id="navbar-login" onClick={() => UserService.doLogin()}>
          Sign In / Sign up
        </Button>

        { /* <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> Sign In
              <p className="text-muted">
                By continuing, you agree to our <u>User Agreement</u> and <u>Privacy Policy</u>.
              </p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoginForm />
          </Modal.Body>
        </Modal> */ }

      </RenderOnAnonymous>
    </>
  );

};

export default LoginModal;