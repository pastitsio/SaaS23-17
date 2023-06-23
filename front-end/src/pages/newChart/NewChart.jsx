import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Col, Container, Form, Nav, Row, Tab } from 'react-bootstrap';
import { BsDot } from 'react-icons/bs';

import { SubmitWaitButton } from '../../components';
import { BackendService } from '../../services';
import PlotForm from './PlotForm';

import './newChart.css';

import img1 from '../../assets/bar_label_plot.png';
import img2 from '../../assets/scatter_plot.webp';
import img3 from '../../assets/simple_plot.webp';


const NewChart = () => {
  const navigate = useNavigate();

  const [inputFile, setInputFile] = useState(null);
  const [selectedPlotType, setSelectedPlotType] = useState(null);
  const [chartData, setChartData] = useState({
    chart_name: '', title: '', x_label: '', y_label: '', bar_width: .6
  });
  const fileRef = useRef(null);

  const resetState = () => {
    setInputFile(null);
    setChartData({
      chart_name: '', title: '', x_label: '', y_label: '', bar_width: .6
    })
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  const handleDownloadButton = () => {
    return new Promise(async (resolve, reject) => {
      try {
        BackendService.downloadPreset(selectedPlotType);
        resolve(() => undefined);
      } catch (e) {
        reject(e)
      }
    })
  }

  const handleFormChange = (e) => {
    setChartData({
      ...chartData,
      [e.target.name]: e.target.value
    });
  };

  const handleSideNavClick = (plotType) => {
    setSelectedPlotType(plotType.name);
    resetState();
  }

  const handleCreateChange = (event) => {
    const file = event.target.files[0];
    setInputFile(file);
  };

  const handleCreateButton = () => {
    console.log(chartData, selectedPlotType)
    console.log(inputFile);

    return new Promise(async (resolve, reject) => {
      try {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        await BackendService.validateCredits(userInfo.email, 10);

        if (!chartData.chart_name) {
          throw new Error('Name cannot be empty!')
        }

        const previewImg = await BackendService.createChart(
          inputFile,
          selectedPlotType,
          chartData,
          'preview');

        resetState();

        resolve(() => {
          navigate('/created', {
            state: {
              previewImg: previewImg,
              inputFile: inputFile,
              selectedPlotType: selectedPlotType,
              chartData: chartData
            },

          });
        });
      } catch (e) {
        reject(e)
      }
    })
  }

  const plotTypes = [
    { name: 'bar_label_plot', img: img1 },
    { name: 'scatter_plot', img: img2 },
    { name: 'simple_plot', img: img3 }
  ];

  const camel2title = (sentence) => {
    return sentence.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <Container >
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
                    <Nav.Item key={idx} onClick={() => handleSideNavClick(plotType)}>
                      <Nav.Link
                        eventKey={idx}>{(selectedPlotType === plotType.name) && <BsDot />} {camel2title(plotType.name)}</Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  {selectedPlotType &&
                    plotTypes.map((plotType, idx) => (
                      <Tab.Pane key={idx} eventKey={idx}>
                        <Card className='d-grid mb-2'>
                          <Card.Text style={{ color: 'black', justifySelf: 'center' }}>
                            {camel2title(plotType.name)}
                          </Card.Text>
                          <Card.Img variant="top" src={plotType.img} style={{ width: '400px', justifySelf: 'center' }} />
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
                  {selectedPlotType &&
                    <>
                      <PlotForm
                        isBarLabel={selectedPlotType === 'bar_label_plot'}
                        onFileChange={handleCreateChange}
                        handleFormChange={handleFormChange}
                        formData={chartData}
                        fileRef={fileRef}
                      />
                      <Container className='create-btn py-2'>
                        <SubmitWaitButton
                          action={handleCreateButton}
                          actionName='Create'
                          disabledIf={!inputFile}
                          color='green'
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