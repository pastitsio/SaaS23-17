import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Container, Form } from 'react-bootstrap'

import { PreviewCarousel, SubmitWaitButton } from '../../components'

import './newChart.css'
import { BackendService } from '../../services'

const NewChart = () => {

  const [jsonInput, setJsonInput] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContents = event.target.result;
      const parsedData = JSON.parse(fileContents);
      setJsonInput(parsedData);
    };

    reader.readAsText(file);
  };

  const [selectedPreset, setSelectedPreset] = useState('0');
  const handleDownloadChange = (e) => {
    setSelectedPreset(e.target.value);
  };

  const handleDownloadButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await BackendService.downloadJSONPreset(selectedPreset);
        resolve(() => undefined);
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleCreateButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const previewImg = await BackendService.createChart(jsonInput, fileInput);
        resolve(() => {
          // prevent back button from loading this page again.
          window.history.replaceState(null, document.title, '/new');
          navigate('/created', { state: {previewImg: previewImg}
          });
        });
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
          <h5>Download a preset</h5>
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
            <h5>Upload your JSON preset</h5>
            <Form.Control type="file" accept=".json" onChange={handleFileInputChange} />
          </Form.Group>

          <SubmitWaitButton
            action={handleCreateButton}
            actionName='Create'
            disabledIf={!jsonInput}
            color='green'
            resetParentState={() => {setJsonInput(null); setFileInput(null)}}
          />
        </Container>
      </Container>
    </>
  )
}

export default NewChart