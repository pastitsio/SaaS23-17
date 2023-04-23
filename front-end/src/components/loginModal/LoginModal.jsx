import { React, useState } from "react";

import { Button, Modal } from "react-bootstrap";

import LoginForm from './LoginForm';

import './login.css';

const LoginModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button id="login_button" onClick={handleShow}>
        Sign In / Sign up
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Sign In
            <p className="text-muted" style={{ 'fontSize': '.5em' }}>
              By continuing, you agree to our <u>User Agreement</u> and <u>Privacy Policy</u>.
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm /> {/* Login Here */}
        </Modal.Body>
      </Modal>
    </>
  );

};

export default LoginModal;