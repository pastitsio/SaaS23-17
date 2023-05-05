import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Spinner } from 'react-bootstrap'

import { SubmitWaitButton } from '../../components'

import sampleImg from '../../assets/line_chart_white-bg.png'

import './createdChart.css'

const CreatedChart = () => {
  const [imgLoading, setImgLoading] = useState(true);
  const [createdImg, setCreatedImg] = useState(null);

  useEffect(() => {
    // const cancelToken = _axios.cancelToken.source();

    // TODO: GET fetch Table data
    setTimeout(() => {
      setCreatedImg({
        src: sampleImg,
        title: 'Line Chart',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      });
      setImgLoading(false);

      return () => {
        // cancelToken.cancel()
      }
    }, 2000)

  }, [])

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
              <Card.Img variant='top' src={sampleImg} alt='preview' />
              <Card.Body>
                <Card.Title >{createdImg.title}</Card.Title>
                <Card.Text >{createdImg.caption}</Card.Text>
              </Card.Body>
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