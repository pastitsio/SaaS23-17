import {useContext} from 'react';
import { Button, Modal } from 'react-bootstrap';

import { UserContext } from '../../../UserContext';
import { SubmitWaitButton } from '../../../components';

const AreYouSure = ({ onConfirm, show, setShow, charge }) => {
  const { userInfo } = useContext(UserContext);
  
  const handleCloseModal = () => {
    setShow(false);
  }

  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Saving the image will charge you <b>{charge}</b> credits!
          <br />
          Your new balance will be <b>{userInfo.credits - charge}</b>.
        </Modal.Body>
        <Modal.Footer className='d-flex flex-column' >
          <Button id="cancel-button" onClick={handleCloseModal} className='align-self-start'>
            Cancel
          </Button>
          <SubmitWaitButton
            action={onConfirm}
            actionName='Confirm'
            cssId="buy-button"
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AreYouSure;
