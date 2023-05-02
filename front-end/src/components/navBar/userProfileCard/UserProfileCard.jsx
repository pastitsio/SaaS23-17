import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BsFillPlusCircleFill, BsTable } from "react-icons/bs";
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

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // TODO: GET fetch User data from DB
    setUserInfo(JSON.parse(sessionStorage.getItem('userInfo')));
  }, [])

  return (
    <Container className="user-info">
      {userInfo
        ? <>
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
                Create chart <BsFillPlusCircleFill />
              </Button>{" "}
              <Button variant="danger" className="user-info-button">
                <Link to={`/mycharts/`} >
                  View charts
                </Link>
              </Button>{" "}
              <Button onClick={() => handleShowBuyCredits()} variant="success" className="user-info-button">
                Buy credits
              </Button>{" "}

              <BuyCreditsModal show={showBuyCredits} onHide={handleCloseBuyCredits} />
            </Container>
          </>
        : <p>Loading user info...</p>}

    </Container >
  );
}

export default UserProfileCard