import { useEffect, useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'

import { SubmitWaitButton } from '../../components'

import { useLocation, useNavigate } from 'react-router-dom'
import { BackendService } from '../../services'
import './createdChart.css'

const CreatedChart = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [img, setImg] = useState('');

  useEffect(() => {
    const disableBackButton = () => {
      // Replace the current URL with a new URL
      const newUrl = `/new`;
      window.history.replaceState(null, null, newUrl);
    };

    const cleanup = () => {
      disableBackButton();
    };
    window.addEventListener('beforeunload', cleanup);

    // Check if the state is null, i.e. the component is directly accessed from browser url
    if (state) { 
      setImg(state.previewImg)
    } else {
      navigate('/new');
    }

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [state, navigate]);



  const handleCancelButton = () => {
    // prevent back button from loading this page again.
    navigate('/');
  }

  const handleSaveButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await BackendService.createChart(state.inputFile, 'save');
        resolve(() => undefined);
      } catch (e) {
        reject(e)
      }
    })
  }


  return (
    <>
      <Container className='header-container'>
        <h2>Your newly created image is here!</h2>
      </Container>
      <Container className='wrapper-container flex-column'>
        <Container className="img-preview-container" style={{ height: '100%' }}>
          <Card className='preview-card' style={{ maxHeight: '600' }}>
            <Card.Img variant='top' src={img} alt='preview' />
            {/* <Card.Body>
            <Card.Title >{createdImg.title}</Card.Title>
            <Card.Text >{createdImg.caption}</Card.Text>
          </Card.Body> */}
            {/* {imgLoading
            ? <Spinner animation='border' variant='light' /> // if is loading: display spinner
          } */}
          </Card>
        </Container>

        <Container className='d-flex px-0 gap-2'>
          <Button onClick={handleCancelButton} id='cancel-button'>Cancel</Button>
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