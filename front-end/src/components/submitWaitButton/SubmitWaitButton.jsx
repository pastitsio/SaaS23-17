import React, { useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import ActionErrorModal from './actionErrorModal/ActionErrorModal';

const SubmitWaitButton = (props) => {

  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [actionErrorShow, setActionErrorShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    setReady(false);

    // !performs fetch action when the button is pressed.
    try {
      const onResolveCallback = await props.action();
      if (typeof onResolveCallback === 'function') {
        onResolveCallback();
      }
      setResult(true);
    } catch (err) {
      setActionErrorMessage(err.message);
      setActionErrorShow(true);
      setResult(false);
    } finally {
      setLoading(false);
      setReady(true);
      props.resetParentState(); // reset states on parent component
    }
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

      <ActionErrorModal
        show={actionErrorShow}
        onHide={() => setActionErrorShow(false)}
        message={actionErrorMessage}
      />
    </Container>
  )
}

export default SubmitWaitButton