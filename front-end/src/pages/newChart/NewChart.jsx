import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, Col, Container, Form, Nav, Row, Tab } from 'react-bootstrap'

import { SimplePlotForm } from './forms'

import { SubmitWaitButton } from '../../components'

import { BsDot } from 'react-icons/bs'
import { BackendService } from '../../services'
import './newChart.css'

import img1 from '../../assets/bar_label_demo.png'
import img2 from '../../assets/scatter.webp'
import img3 from '../../assets/simple_plot.webp'


const NewChart = () => {
  const navigate = useNavigate();
  const [inputFile, setInputFile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleDownloadChange = (e) => {
    setSelectedPreset(e.target.value);
  };

  const handleDownloadButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const link = document.createElement('a');
        const filename = `/presets/${selectedPreset}.csv`
        link.href = filename;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        resolve(() => undefined);
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleCreateChange = (event) => {
    const file = event.target.files[0];
    console.log(file);

    setInputFile(file);
  };

  const handleCreateButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const previewImg = await BackendService.createChart(inputFile, 'preview');
        resolve(() => {
          navigate('/created', {
            state: {
              previewImg: previewImg,
              inputFile: inputFile
            },

          });
        });
      } catch (e) {
        reject(e)
      }
    })
  }

  const plotTypes = [
    { name: 'BarLabelPlot', img: img1 },
    { name: 'ScatterPlot', img: img2 },
    { name: 'SimplePlot', img: img3 }
  ];


  return (
    <Container className='overflow-hidden'>
      <Container className='header-container'>
        <h2>Create your own chart with ease</h2>
        <h5 className='header-description'>Below are some demos. Click the demo title to see the interactive preview! </h5>
      </Container>

      <Container className='d-flex flex-column gap-5 mt-3'>
        <Form.Group controlId="formFile" className='px-1 mb-2'>
          <h5>Download/Upload your CSV preset</h5>
          <Tab.Container defaultActiveKey="0">
            <Row className='tabs'>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  {plotTypes.map((plotType, idx) =>
                    <Nav.Item onClick={() => setSelectedPreset(plotType.name)}>
                      <Nav.Link
                        eventKey={idx}>{(selectedPreset === plotType.name) && <BsDot />} {plotType.name}</Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  {selectedPreset &&
                    plotTypes.map((plotType, idx) => (
                      <Tab.Pane eventKey={idx}>
                        <Card className='d-grid mb-2'>
                          <Card.Text style={{ color: 'black', justifySelf: 'center' }}>
                            {plotType.name}
                          </Card.Text>
                          <Card.Img variant="top" src={plotType.img} style={{ width: '350px', justifySelf: 'center' }} />
                          <Card.Body>
                            Click to download the preset and find out how this image was generated!
                            <SubmitWaitButton
                              action={handleDownloadButton}
                              actionName='Download'
                              color='lightseagreen'
                            />
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    ))
                  }
                  {selectedPreset &&
                    <>
                      < SimplePlotForm isBarLabel={selectedPreset === 'BarLabelPlot'} isonFileChange={handleCreateChange} />
                      <Container className='px-0 py-2'>
                        <SubmitWaitButton
                          action={handleCreateButton}
                          actionName='Create'
                          disabledIf={!inputFile}
                          color='green'
                          resetParentState={() => { setInputFile(null) }}
                        />
                      </Container>
                    </>
                  }
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Form.Group>


      </Container>
    </Container>
  )
}

export default NewChart