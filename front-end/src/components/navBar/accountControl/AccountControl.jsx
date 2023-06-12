import { React } from "react";
import { Button, Container, Dropdown } from "react-bootstrap";

import UserProfileCard from '../userProfileCard/UserProfileCard';
import { RenderOnAnonymous, RenderOnAuth } from '../../';
import { UserService } from "../../../services";

import './accountControl.css';

const AccountControl = () => {

  const handleLoginButton = () => {
    // TODO: GET keycloak health-check
    UserService.doLogin();
  }

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  return (
    <Container id='account-control-container'>

      <RenderOnAuth altComponent={""}>
        <Dropdown drop="start">

          <Dropdown.Toggle id='navbar-username'>
            <u>{UserService.getUsername()} {userInfo ? "" : " !"}</u>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            
            <Dropdown.Item as='li' id='user-profile-card'>
              <UserProfileCard userInfo={userInfo} />
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item as='li' onClick={UserService.doLogout}>
              <b>Logout</b>
            </Dropdown.Item>

          </Dropdown.Menu>
        </Dropdown>

      </RenderOnAuth>

      <RenderOnAnonymous>
        <Button id="navbar-login" onClick={handleLoginButton}>
          Sign In / Sign up
        </Button>
      </RenderOnAnonymous>

    </Container>
  );

};

export default AccountControl