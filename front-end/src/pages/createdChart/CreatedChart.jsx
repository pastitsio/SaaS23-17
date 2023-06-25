import { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'

import { useLocation, useNavigate } from 'react-router-dom'
import { BackendService } from '../../services'
import './createdChart.css'
import AreYouSure from './areYouSure/AreYouSure'
import { UserContext } from '../../UserContext'

const CreatedChart = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
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
  }, [state, navigate])

  const handleGoBack = () => {
    navigate('/new');
  }

  const handleConfirmButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await BackendService.creditsUpdate(userInfo.email, state.plot.charge);
        await BackendService.createChart(
          state.inputFile,
          state.plot.name,
          state.chartData,
          'save');
        setUserInfo({
          ...userInfo,
          credits: userInfo.credits - state.plot.charge,
          number_of_charts: userInfo.number_of_charts + 1
        })
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
              <Container className='created-prompt py-3'>
                <h4>This is your preview.</h4>
                <p className='pt-3' >Click the button below to <b>save</b> creation without getting charged.</p>
              </Container>
            </Col>
            <Col sm={9}>
              <Card className='preview-card' >
                <Card.Img variant='top' src={img}
                  alt='preview'
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()} />
                <Card.Body>
                  <Card.Title >{state.chartData.chart_name}</Card.Title>
                </Card.Body>
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
        onConfirm={handleConfirmButton}
        show={showConfirm}
        setShow={setShowConfirm}
        charge={state.plot.charge}
      />
    </>
  )
}

export default CreatedChart