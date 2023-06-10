import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

const SimplePlotForm = ({ isBarLabel, onFileChange }) => {
  console.log('selectedPreset :>> ', isBarLabel);

  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text id="title">Title</InputGroup.Text>
        <Form.Control
          placeholder="Optional"
          aria-label="title"
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text
          id="x_label">X label</InputGroup.Text>
        <Form.Control
          placeholder={isBarLabel ? "None" : "Optional"}
          aria-label="x_label"
          readOnly={isBarLabel}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="y_label">Y label</InputGroup.Text>
        <Form.Control
          placeholder="Optional"
          aria-label="y_label"
        />
      </InputGroup>

      <Form.Label ><b>CSV here...</b></Form.Label>
      <InputGroup>
        <Form.Control onChange={onFileChange} type="file" accept=".csv" />
      </InputGroup>


      {/* <InputGroup>
        <InputGroup.Text>With textarea</InputGroup.Text>
        <Form.Control as="textarea" aria-label="With textarea" />
      </InputGroup> */}
    </>
  )
}

export default SimplePlotForm