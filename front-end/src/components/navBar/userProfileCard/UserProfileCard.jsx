import { useContext } from "react";
import { Container } from "react-bootstrap";
import { BsTable } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";


import { UserContext } from "../../../UserContext";
import './userProfileCard.css';

const UserProfileCard = () => {
  const { userInfo } = useContext(UserContext);

  return (
    <Container className="user-info">
      {Object.keys(userInfo).length === 0
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
    </Container >
  );
}

export default UserProfileCard