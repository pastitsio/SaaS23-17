import React, { useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'

const SubmitWaitButton = (props) => {

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setReady(false);

    setTimeout(() => {
      // TODO: GET ...
      // TODO: POST ...
      
      
      setLoading(false);
      setReady(true);
      setResult(Math.random() > 0.5 ? true : false)
      
      // reset styling on parent component
      props.reset()
      
      // this is the action being activated when pressing the button.
      props.action();
    }, 2500)
  }

  return (
    <Container className='d-flex flex-row px-0 align-items-center'>
      <Button
        id={props.cssId}
        disabled={props.disabledIf}
        onClick={handleButtonClick}
        style={{ backgroundColor: props.color, border: 'none' }}
      >
        <b>{props.actionName}</b>
      </Button>
      <Container className='d-flex justify-content-end align-items-center'>
        {loading
          ? <Spinner animation="border" />
          : !ready
            ? " "
            : result
              ? <span style={{ 'color': 'green' }}><b>{props.actionName} Complete!</b></span>
              : <span style={{ 'color': 'red' }}><b>{props.actionName} Failed!</b></span>
        }
      </Container>
    </Container>
  )
}

export default SubmitWaitButton