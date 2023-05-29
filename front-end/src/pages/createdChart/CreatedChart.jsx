import React from 'react'
import { Button, Card, Container } from 'react-bootstrap'

import { SubmitWaitButton } from '../../components'

import { useLocation } from 'react-router-dom'
import './createdChart.css'

const CreatedChart = () => {
  const { state } = useLocation();

  const handleSaveButton = () => {
    return undefined;
  }

  return (
    <>
      <Container className='header-container'>
        <h2>Your newly created image is here!</h2>
      </Container>
      <Container className='wrapper-container flex-column'>
        <Container className="img-preview-container" style={{ height: '100%' }}>
          <Card.Img variant='top' src={state.previewImg} alt='preview' />
          {/* <Card.Body>
            <Card.Title >{createdImg.title}</Card.Title>
            <Card.Text >{createdImg.caption}</Card.Text>
          </Card.Body> */}
          {/* {imgLoading
            ? <Spinner animation='border' variant='light' /> // if is loading: display spinner
            : <Card className='preview-card'>
             </Card>
          } */}
        </Container>

        <Container className='d-flex px-0 gap-2'>
          <Button id='cancel-button'>Cancel</Button>
          <SubmitWaitButton
            action={handleSaveButton}
            actionName='Save'
            cssId="buy-button"
            reset={() => undefined}
          />
        </Container>
      </Container>
    </>
  )
}

export default CreatedChart