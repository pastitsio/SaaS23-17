import React, { useState } from 'react'
import { Button, Card, Container, Spinner, Stack, Table } from 'react-bootstrap'
import { BsFillArrowUpRightCircleFill, BsGripVertical } from 'react-icons/bs'

import sampleImg from '../../assets/sample_img.png'

import './chartsPreview.css'

const ChartsPreview = ({ userid }) => {
  // const [chartsList, setChartsList] = useState([]);
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  const chartsList = [
    { 'id': 'a', 'type': 'linear', 'name': 'chart_a', 'createdTimestamp': 1131482603153 },
    { 'id': 'b', 'type': 'linear', 'name': 'chart_b', 'createdTimestamp': 1231482603153 },
    { 'id': 'c', 'type': 'linear', 'name': 'chart_c', 'createdTimestamp': 1141482603153 },
    { 'id': 'd', 'type': 'linear', 'name': 'chart_d', 'createdTimestamp': 1241482603153 },
    { 'id': 'f', 'type': 'linear', 'name': 'chart_f', 'createdTimestamp': 1251482603153 },
    { 'id': 'g', 'type': 'linear', 'name': 'chart_g', 'createdTimestamp': 1261482603153 },
    { 'id': 'h', 'type': 'linear', 'name': 'chart_h', 'createdTimestamp': 1231482503153 },
    { 'id': 'i', 'type': 'linear', 'name': 'chart_i', 'createdTimestamp': 1231482603153 },
    { 'id': 'j', 'type': 'linear', 'name': 'chart_j', 'createdTimestamp': 1231482603153 },
    { 'id': 'k', 'type': 'linear', 'name': 'chart_k', 'createdTimestamp': 1231482603153 },
    { 'id': 'l', 'type': 'linear', 'name': 'chart_l', 'createdTimestamp': 1231482603153 },
    { 'id': 'm', 'type': 'linear', 'name': 'chart_m', 'createdTimestamp': 1231482603153 },
  ]

  function handleRowClick(id) {
    setImgReady(false);
    setSelected(id);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setImgReady(true);
    }, 2500);
  }

  const handleDownloadImage = (event) => {
    console.log(event.target.name, selected)
  }


  console.log('selected id :>> ', selected);

  return (
    <Container id='charts-preview-container'>
      <Stack id='info-container'>
        <Container id='table-container'>
          <Table className='hover rounded rounded-3 overflow-hidden'>
            <thead>
              <tr><th>Type</th><th>Name</th><th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {chartsList.map((item, idx) => (
                <tr key={idx} onClick={() => handleRowClick(item.id)} className={selected === item.id ? 'table-active' : ''}>
                  <td>{item.type}</td>
                  <td>{item.name}</td>
                  <td>{new Date(item.createdTimestamp).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Container id='export-container'>
          <u id='export-label'>Export as:</u>
          <Container id='export-buttons'>
            <Button className={imgReady ? '' : 'disabled'} name='html' onClick={(event) => handleDownloadImage(event)}>HTML</Button>
            <Button className={imgReady ? '' : 'disabled'} name='pdf' onClick={(event) => handleDownloadImage(event)}>PDF</Button>
            <Button className={imgReady ? '' : 'disabled'} name='png' onClick={(event) => handleDownloadImage(event)}>PNG</Button>
            <Button className={imgReady ? '' : 'disabled'} name='svg' onClick={(event) => handleDownloadImage(event)}>SVG</Button>
            <Container id='button-divider'  >{" "}</Container>
          <Button id='interactive-button' className={imgReady ? '' : 'disabled'}>Interactive Preview <BsFillArrowUpRightCircleFill /></Button>
        </Container>
    </Container>
      </Stack >

  <Container id='preview-image-container'>
    {isLoading
      ? <Spinner animation='border' /> // if is loading: display spinner
      : imgReady // else: 
        ? // if image is ready: load card 
        <>
          <Card id='preview-card' className={imgReady ? 'max-height-card' : ''}>
            <Card.Img variant='bottom' src={sampleImg} alt='preview'></Card.Img>
            <Card.Body>
              <Card.Title>Pie chart</Card.Title>
            </Card.Body>
          </Card>
        </>
        :
        <Card id='preview-card'>
          {/* else show select prompt  */}
          <p id='select-prompt'>Select a chart from the table </p>
        </Card>
    }
  </Container>
    </Container >

  );
}

export default ChartsPreview;