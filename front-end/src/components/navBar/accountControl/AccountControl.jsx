import { useState } from "react";
import { Button, Container, Dropdown } from "react-bootstrap";
import { BsCart3, BsPlusCircle, BsViewStacked } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { BuyCreditsModal, RenderOnAnonymous, RenderOnAuth } from '../../';
import { UserService } from "../../../services";
import UserProfileCard from '../userProfileCard/UserProfileCard';

import './accountControl.css';

const AccountControl = () => {

  const handleLoginButton = () => {
    UserService.doLogin();
  }

  const navigate = useNavigate();

  // Buy Credits Control
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const handleCloseBuyCredits = () => setShowBuyCredits(false);
  const handleShowBuyCredits = () => setShowBuyCredits(true);

  return (
    <Container id='account-control-container'>

      <RenderOnAuth altComponent={""}>
        <Container className="account-control-buttons">
          <Button onClick={() => navigate('/new')} className="account-action-button" id="new-button">
            New <BsPlusCircle />
          </Button>{" "}
          <Button
            onClick={() => navigate('/mycharts')}
            className="account-action-button"
            id="view-button">
            View <BsViewStacked />
          </Button>{" "}
          <Button onClick={handleShowBuyCredits} className="account-action-button" id="buy-button">
            Buy credits < BsCart3 />
          </Button>{" "}

          <BuyCreditsModal show={showBuyCredits} onHide={handleCloseBuyCredits} />
        </Container>


        <Dropdown drop="down" align="end">

          <Dropdown.Toggle id='navbar-username'>
            <u>{UserService.getUsername()}</u>
          </Dropdown.Toggle>

          <Dropdown.Menu>

            <Dropdown.Item as='li' id='user-profile-card'>
              <UserProfileCard />
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