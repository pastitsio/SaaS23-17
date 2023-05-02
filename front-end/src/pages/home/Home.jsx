import React from 'react';

import { Container } from 'react-bootstrap';

import { PreviewCarousel } from '../../components';

import './home.css';

const Home = () => {

    return (
    <>
      <Container id='header-container'>
        <h2>Welcome to MyCharts!</h2>
      </Container>

      <PreviewCarousel />

    </>
  );

}

export default Home