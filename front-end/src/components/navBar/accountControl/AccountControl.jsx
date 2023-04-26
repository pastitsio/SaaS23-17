import { React } from "react";
import { Button, Container, Dropdown } from "react-bootstrap";

import { RenderOnAnonymous, RenderOnAuth } from '../../';
import { UserService } from "../../../services";

import './accountControl.css';

const AccountControl = () => {

  return (
    <Container id='login-control-container'>
      <RenderOnAuth altComponent={""}>
        <Dropdown>
          <Dropdown.Toggle id='navbar-username'>
            <u>{UserService.getUsername()}</u>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => UserService.doLogout()}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </RenderOnAuth>

      <RenderOnAnonymous>
        <Button id="navbar-login" onClick={() => UserService.doLogin()}>
          Sign In / Sign up
        </Button>

      </RenderOnAnonymous>
    </Container>
  );

};

export default AccountControl;