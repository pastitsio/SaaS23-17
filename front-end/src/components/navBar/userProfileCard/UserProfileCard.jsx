import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BsPlusCircle, BsCart3,  BsTable, BsViewStacked } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";

import { Link } from "react-router-dom";

import { BuyCreditsModal } from "../../";
import './userProfileCard.css';

const UserProfileCard = () => {

  // Buy Credits Control
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const handleCloseBuyCredits = () => setShowBuyCredits(false);
  const handleShowBuyCredits = () => setShowBuyCredits(true);

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  return (
    <Container className="user-info">
      <Container className="user-info-body">
        <Container className="user-info-item">
          <span className="user-info-label">Charts:</span>{" "}
          <span className="user-info-value">{userInfo.number_of_charts} <FaChartArea /></span>
        </Container>
        <Container className="user-info-item">
          <span className="user-info-label">Credits:</span>{" "}
          <span className="user-info-value">{userInfo.credits} <GrMoney /></span>
        </Container>
        <Container className="user-info-item">
          <span className="user-info-label">Last login:</span>{" "}
          <span className="user-info-value">{new Date(userInfo.last_login).toDateString()} <BsTable /></span>
        </Container>
      </Container>

      <Container className="user-info-footer">
        <Button variant="primary" className="user-info-button">
          <Link to='/create'>Create <BsPlusCircle /></Link>
        </Button>{" "}
        <Button variant="danger" className="user-info-button">
          <Link to='/mycharts/'>View <BsViewStacked /></Link>
        </Button>{" "}
        <Button onClick={() => handleShowBuyCredits()} variant="success" className="user-info-button">
          Buy credits < BsCart3/>
        </Button>{" "}

        <BuyCreditsModal show={showBuyCredits} onHide={handleCloseBuyCredits} />
      </Container>
    </Container >
  );
}

export default UserProfileCard