import { useState } from 'react';
import { Button, Card, Container, Modal, Spinner } from 'react-bootstrap';

import './buyCreditsModal.css';

const BuyCreditsModal = ({ show, onHide }) => {
  const [selectedCredits, setSelectedCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseReady, setPurchaseReady] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(false);

  const handleHide = () => {
    setPurchaseReady(false);
    setIsLoading(false);
    setSelectedCredits(0);
    onHide();
  }

  const handlePurchase = () => {
    setIsLoading(true);
    setPurchaseReady(false);
    
    setTimeout(() => {
      // TODO: POST credits purchase
      setPurchaseResult(Math.random() > 0.5 ? true : false)
      
      setIsLoading(false);
      setPurchaseReady(true);
      setSelectedCredits(0);
    }, 2500)
  }

  const pricingList = [
    { 'quantity': 5, 'value': 5 },
    { 'quantity': 10, 'value': 10 },
    { 'quantity': 20, 'value': 20 },
    { 'quantity': 50, 'value': 50 },
  ];

  console.log('selectedCredits :>> ', selectedCredits);

  return (
    <Modal show={show} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title id='modal-title'>Buy Credits</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="row">
          {pricingList.map((item, idx) => (
            <Container className="col-md-6">
              <Card key={idx} style={{ margin: '5px' }}
                className={`credit-card ${selectedCredits === item.quantity ? 'selected' : ''}`}
                onClick={() => setSelectedCredits(item.quantity)}
              >
                <Card.Body>
                  <Card.Title id='credit-card-title'>{item.quantity} Credits</Card.Title>
                  <Card.Text id='credit-card-text'>{Number(item.value).toFixed(2)} €</Card.Text>
                </Card.Body>
              </Card>
            </Container>
          ))}
        </Container>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex' }}>
        <Container id='modal-buttons'>
          <Button variant="secondary" id="cancel-button" onClick={handleHide}>
            Cancel
          </Button>
          <Button className={selectedCredits === 0 ? 'disabled' : ''} variant="primary" id="purchase-button" onClick={handlePurchase}>
            Purchase
          </Button>
        </Container>
        <Container id="action-result">
          {isLoading
            ? <Spinner animation="border" variant="dark" />
            : !purchaseReady
              ? " "
              : purchaseResult
                ? <span style={{ 'color': 'green' }}>Purchase complete!</span>
                : <span style={{ 'color': 'red' }}>Purchase failed!</span>
          }
        </Container>
      </Modal.Footer>

    </Modal>
  );
}

export default BuyCreditsModal