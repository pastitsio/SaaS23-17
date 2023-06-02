import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BsPlusCircle, BsCart3, BsTable, BsViewStacked } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";

import { useNavigate } from "react-router-dom";

import { BuyCreditsModal } from "../../";
import './userProfileCard.css';

const UserProfileCard = ({ userInfo }) => {
  const navigate = useNavigate();

  // Buy Credits Control
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const handleCloseBuyCredits = () => setShowBuyCredits(false);
  const handleShowBuyCredits = () => setShowBuyCredits(true);

  return (
    <Container className="user-info">
      {!userInfo
        ? <Container><h4>User info service is down at the moment. <br /> Retry later.</h4></Container>
        :
        <>
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
          </Container >
        </>
      }
      <Container className="user-info-footer">
        <Button onClick={() => navigate('/new')} className="user-info-button" id="new-button">
          New <BsPlusCircle />
        </Button>{" "}
        <Button onClick={() => navigate('/mycharts')} className="user-info-button" id="view-button">
          View <BsViewStacked />
        </Button>{" "}
        <Button onClick={handleShowBuyCredits} className="user-info-button" id="buy-button">
          Buy credits < BsCart3 />
        </Button>{" "}

        <BuyCreditsModal show={showBuyCredits} onHide={handleCloseBuyCredits} />
      </Container>
    </Container >
  );
}

export default UserProfileCard