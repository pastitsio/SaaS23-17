import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Container, Form } from 'react-bootstrap'

import { PreviewCarousel, SubmitWaitButton } from '../../components'

import './newChart.css'
import { FetchService } from '../../services'

const NewChart = () => {

  const [fileInput, setFileInput] = useState(null);
  const handleFileInputChange = (event) => {
    setFileInput(event.target.files[0]);
  };

  const [selectedPreset, setSelectedPreset] = useState('0');
  const handleDownloadChange = (e) => {
    setSelectedPreset(e.target.value);
  };

  const handleDownloadButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await FetchService.downloadJSONPreset(selectedPreset);
        resolve(() => undefined);
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleCreateButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await FetchService.validateFileInput(fileInput);
        const chartId = await FetchService.createChart(fileInput);
        resolve(() => navigate('/created', { state: { chartId: chartId } }));
      } catch (e) {
        reject(e)
      }
    })
  }

  const navigate = useNavigate();

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
            <option value="1">True</option>
            <option value="5">False</option>
          </Form.Select>

          <SubmitWaitButton
            action={handleDownloadButton}
            actionName='Download'
            disabledIf={selectedPreset === "0"}
            color='lightseagreen'
            resetParentState={() => setSelectedPreset("0")}
          />
        </Container>
        <Container className='or-container'>
          <Container className='or-circle'>OR</Container>
        </Container>
        <Container>
          <Form.Group controlId="formFile" className='mb-2'>
            <h5>Upload your JSON file</h5>
            <Form.Control type="file" accept=".json" onChange={handleFileInputChange} />
          </Form.Group>

          <SubmitWaitButton
            action={handleCreateButton}
            actionName='Create'
            disabledIf={!fileInput}
            color='green'
            resetParentState={() => setFileInput(null)}
          />
        </Container>
      </Container>
    </>
  )
}

export default NewChart