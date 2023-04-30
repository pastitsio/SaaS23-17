import { React, useState } from "react";
import { Button, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import { BuyCreditsModal, RenderOnAnonymous, RenderOnAuth } from '../../';
import { UserService } from "../../../services";

import './accountControl.css';

const AccountControl = () => {

  // Buy Credits Control
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const handleClose = () => setShowBuyCredits(false);
  const handleShow = () => setShowBuyCredits(true);

  const handleClickLogin = () => {
    // TODO: keycloak health-check
    UserService.doLogin();
  }

  return (
    <Container id='account-control-container'>

      <RenderOnAuth altComponent={""}>

        <Dropdown>
          <Dropdown.Toggle id='navbar-username'>
            <u>{UserService.getUsername()}</u>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as='li' onClick={handleShow}>
              Buy Credits
            </Dropdown.Item>
            <BuyCreditsModal show={showBuyCredits} onHide={handleClose} />
            <Dropdown.Item as='li' userid={UserService.getId()}>
              <Link to="/mycharts">Created charts</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as='li' onClick={() => UserService.doLogout()}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </RenderOnAuth>

      <RenderOnAnonymous>
        <Button id="navbar-login" onClick={() => handleClickLogin()}>
          Sign In / Sign up
        </Button>
      </RenderOnAnonymous>

    </Container>
  );

};

export default AccountControl;