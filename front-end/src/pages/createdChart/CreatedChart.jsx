import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Spinner } from 'react-bootstrap'

import { SubmitWaitButton } from '../../components'
import { BackendService, UserService } from '../../services'

import axios from 'axios'
import { useLocation } from 'react-router-dom'
import './createdChart.css'

const CreatedChart = () => {
  const { state } = useLocation();

  const [imgLoading, setImgLoading] = useState(true);
  const [createdImg, setCreatedImg] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

    // TODO: GET created image preview
    const fetchChartPreview = async () => {
      try {
        const imgPreview = await BackendService.createChartPreview(state.preset);
        setCreatedImg(imgPreview);
        setImgLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.log('Error:', error.message);
        }
      }
    }

    if (UserService.isLoggedIn()) {
      fetchChartPreview();
    }

    return () => {
      source.cancel('Request canceled by MyCharts.jsx cleanup');
    }

  }, [state.preset]);

  return (
    <>
      <Container className='header-container'>
        <h2>Your newly created image is here!</h2>
      </Container>
      <Container className='wrapper-container flex-column'>
        <Container className="img-preview-container" style={{ height: '100%' }}>
          {imgLoading
            ? <Spinner animation='border' variant='light' /> // if is loading: display spinner
            : <Card className='preview-card'>
              <Card.Img variant='top' src={createdImg} alt='preview' />
              {/* <Card.Body>
                <Card.Title >{createdImg.title}</Card.Title>
                <Card.Text >{createdImg.caption}</Card.Text>
              </Card.Body> */}
            </Card>
          }
        </Container>

        <Container className='d-flex px-0 gap-2'>
          <Button id='cancel-button'>Cancel</Button>
          <SubmitWaitButton
            action={() => undefined}
            actionName='Save'
            disabledIf={imgLoading}
            cssId="buy-button"
            reset={() => undefined}
          />
        </Container>
      </Container>
    </>
  )
}

export default CreatedChart