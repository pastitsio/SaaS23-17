import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';

import './login.css';

import google_logo from '../../assets/google.svg';
import { UserService } from '../../services';

const LoginForm = () => {

  return (
    <>
      <Form onSubmit={(event) => {
        event.preventDefault()
        // Use this to get input
        console.log('form_email :>> ', event.target.elements.form_email.value)
        console.log('form_password :>> ', event.target.elements.form_password.value);
        UserService.doLogin();
      }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control name="form_email" type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="form_password" type="password" placeholder="Password" />
        </Form.Group>
        <Button id="login_button" type="submit" >
          Let's Go!
        </Button>
      </Form>
      <br/>
      <Container className="text-center">
        <p>Not a member? Sign up with:</p>
        {/* <a href="#!">Register</a> */}
        <Button onClick={() => UserService.doLogin() } tag='a' color='none' className='m-1' style={{ background: '#ffffff' }}>
          <img src={google_logo} alt='Google' size="sm" />
        </Button>
      </Container>
    </>

  );
}


export default LoginForm;