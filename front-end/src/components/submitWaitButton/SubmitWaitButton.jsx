import React, { useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'

const SubmitWaitButton = (props) => {

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setReady(false);

    // !performs POST/GET action when pressed the button.
    props.action()
      .then((onResolveCallback) => {
        onResolveCallback();
        setResult(true);
      })
      .catch((err) => {
        console.log(`ERROR ${props.name} :>>`, err)
        setResult(false);
      })
      .finally(() => {
        setLoading(false);
        setReady(true);
        props.resetParentState(); // reset states on parent component
      })
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