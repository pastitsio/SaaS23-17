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
    <>
      <Container className='header-container'>
        <h2>Create your own chart with ease</h2>
        <h5 className='header-description'>Below are some demos. Click the demo title to see the interactive preview! </h5> 
      </Container>

      <PreviewCarousel />

      <Container className='d-flex flex-row gap-5 mt-3'>
        <Container>
          <h5>Download presets</h5>
          <Form.Select value={selectedPreset} onChange={handleDownloadChange} aria-label="Default select example" className='mb-2'>
            <option value="0">Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>

          <SubmitWaitButton
            actionName='Download'
            action={() => undefined}
            disableCondition={selectedPreset === "0"}
            color='lightseagreen'
          />
        </Container>
        {/* <Container className='m-3'>
          <h4>Or</h4>
        </Container> */}
        <Container>
          <Form.Group controlId="formFile" className='mb-2'>
            <h5>Upload your JSON file</h5>
            <Form.Control type="file" accept=".json" onChange={handleFileInputChange} />
          </Form.Group>

          <SubmitWaitButton
            actionName='Create'
            action={() => undefined}
            disableCondition={!fileInput}
            color='green'
          />
        </Container>
      </Container>
    </>
  )
}

export default CreateChart