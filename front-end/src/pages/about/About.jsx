import React from 'react';
import { Col, Container, Figure, Row } from 'react-bootstrap';

import './about.css';

const About = () => {
  return (
    <Container id='about-container'>
      <Row className="mt-2">
        <Col><h1>About Us</h1></Col>
      </Row>
      <Row className="mt-2">
        <Col><Figure>
            <Figure.Image className="rounded-circle" src="https://avatars.githubusercontent.com/u/93122062?v=4" width='150' alt="Person 2" />
            <Figure.Caption className='text-center'>ntua-el<b>13133</b></Figure.Caption>
          </Figure></Col>
        <Col><Figure>
            <Figure.Image className="rounded-circle" src="https://avatars.githubusercontent.com/u/115161491?v=4" width='150' alt="Person 1" />
            <Figure.Caption className='text-center'>ntua-el<b>18406</b></Figure.Caption>
          </Figure></Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac purus sed velit bibendum lobortis. Donec auctor libero at neque suscipit, quis lobortis nisi malesuada. Sed quis ultrices odio, id tempor dolor. </p>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <p>Check out our <a href="https://github.com/ntua/SaaS23-17" target="_blank" rel="noopener noreferrer">GitHub repository</a> for more information.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default About
