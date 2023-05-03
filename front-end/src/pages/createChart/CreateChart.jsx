import React, { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { PreviewCarousel, SubmitWaitButton } from '../../components'

import './createChart.css'

const CreateChart = () => {

  const [fileInput, setFileInput] = useState(null);
  const handleFileInputChange = (event) => {
    console.log('file name :>>', event.target.files[0])
    setFileInput(event.target.files[0]);
  };

  const [selectedPreset, setSelectedPreset] = useState('0');
  const handleDownloadChange = (e) => {
    console.log('value :>>', typeof e.target.value)
    setSelectedPreset(e.target.value);
  };


  return (
    <Container className='d-flex flex-column my-4 px-0'>
      <Container>
        <h3>Create your own chart with ease</h3>
      </Container>

      <PreviewCarousel />

      <Container className='d-flex flex-row gap-5 mt-5'>
        <Container>
          <h3>Download presets</h3>
          <Form.Select value={selectedPreset} onChange={handleDownloadChange} aria-label="Default select example" className='mb-2'>
            <option value="0">Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>

          <SubmitWaitButton
            actionName='Download'
            actionOnClick={() => undefined}
            disableCondition={selectedPreset === "0"}
            color='lightseagreen'
          />
        </Container>
        {/* <Container className='m-3'>
          <h4>Or</h4>
        </Container> */}
        <Container>
          <Form.Group controlId="formFile" className='mb-2'>
            <h3>Upload your input file</h3>
            <Form.Control type="file" onChange={handleFileInputChange} />
          </Form.Group>

          <SubmitWaitButton
            actionName='Create'
            actionOnClick={() => undefined}
            disableCondition={!fileInput}
            color='green'
          />
        </Container>
      </Container>
    </Container>
  )
}

export default CreateChart