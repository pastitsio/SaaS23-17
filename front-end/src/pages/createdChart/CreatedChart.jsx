import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'

import { useLocation, useNavigate } from 'react-router-dom'
import { BackendService } from '../../services'
import './createdChart.css'
import AreYouSure from './areYouSure/AreYouSure'

const CreatedChart = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [img, setImg] = useState('');
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const disableBackButton = () => {
      // Prevents back button from loading this page again.
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



  const handleGoBack = () => {
    navigate('/new');
  }

  const handleSaveButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await BackendService.createChart(
          state.inputFile,
          state.selectedPlotType,
          state.chartData,
          'save');

        setSaveSuccessful(true);
        setShowConfirm(false);
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
          <Row>
            <Col md={3}>
              <Container className='created-prompt'>
                <h4>This is your preview.</h4>
                Click the button below to <b>save</b> creation without getting charged.
              </Container>
            </Col>
            <Col sm={9}>
              <Card className='preview-card' >
                <Card.Img variant='top' src={img}
                  alt='preview'
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()} />
              </Card>
            </Col>
          </Row>
        </Container>

        <Container className='d-flex px-0 gap-2'>
          <Button
            onClick={handleGoBack}
            id='cancel-button'>{saveSuccessful ? "Go Back" : "Cancel"}</Button>

          {!saveSuccessful && <Button
            onClick={() => setShowConfirm(true)}
            id="purchase-button">Save</Button>
          }
        </Container>
      </Container>

      <AreYouSure
        onConfirm={handleSaveButton}
        show={showConfirm}
        setShow={setShowConfirm} />
    </>
  )
}

export default CreatedChart