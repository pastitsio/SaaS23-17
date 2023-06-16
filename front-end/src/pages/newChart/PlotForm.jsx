import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

const PlotForm = ({ isBarLabel, onFileChange, handleFormChange, formData, fileRef }) => {
  return (
    <>
      <InputGroup className="mb-1">
        <InputGroup.Text id="title">Title</InputGroup.Text>
        <Form.Control
          onChange={handleFormChange}
          name="title"
          placeholder="Optional"
          value={formData.title}
          aria-label="title"
        />
      </InputGroup>

      <InputGroup className="mb-1">
        <InputGroup.Text
          id="x_label">X label</InputGroup.Text>
        <Form.Control
          onChange={handleFormChange}
          name="x_label"
          placeholder={isBarLabel ? "X-labels as .csv headers" : "Optional"}
          disabled={isBarLabel}
          value={formData.x_label}
          aria-label="x_label"
          readOnly={isBarLabel}
        />
      </InputGroup>

      <InputGroup className="mb-1">
        <InputGroup.Text id="y_label">Y label</InputGroup.Text>
        <Form.Control
          onChange={handleFormChange}
          name="y_label"
          placeholder="Optional"
          value={formData.y_label}
          aria-label="y_label"
        />
      </InputGroup>

      {isBarLabel && <InputGroup className="mb-1">
        <InputGroup.Text>Bar Width</InputGroup.Text>
        <Form.Control 
        onChange={handleFormChange}
        name="bar_width"
        placeholder="Optional (Default 0.6)"
        value={formData.bar_width}
        aria-label="Amount (to the nearest dollar)" />
      </InputGroup>
      }

      <Form.Label ><b>CSV here...</b></Form.Label>
      <InputGroup>
        <Form.Control ref={fileRef} onChange={onFileChange} type="file" accept=".csv" />
      </InputGroup>


      {/* <InputGroup>
        <InputGroup.Text>With textarea</InputGroup.Text>
        <Form.Control as="textarea" aria-label="With textarea" />
      </InputGroup> */}
    </>
  )
}

export default PlotForm