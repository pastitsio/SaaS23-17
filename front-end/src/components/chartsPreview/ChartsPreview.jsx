import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Spinner, Stack, Table } from 'react-bootstrap'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import sampleImg from '../../assets/line_chart_white-bg.png'

import './chartsPreview.css'

const ChartsPreview = ({ userid }) => {
  const [chartsList, setChartsList] = useState([]);
  const [selectedImgId, setSelectedImgId] = useState("");

  const [tableLoading, setTableLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    // TODO: fetch Table data
    setTimeout(() => {

      const data = [
        { 'id': 'a', 'type': 'linear', 'name': 'chart_a', 'createdTimestamp': 1131482603153, 'title': 'Line Chart (a)', 'description': 'This is a line chart' },
        { 'id': 'b', 'type': 'linear', 'name': 'chart_b', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (b)', 'description': 'This is a line chart' },
        { 'id': 'c', 'type': 'linear', 'name': 'chart_c', 'createdTimestamp': 1141482603153, 'title': 'Line Chart (c)', 'description': 'This is a line chart' },
        { 'id': 'd', 'type': 'linear', 'name': 'chart_d', 'createdTimestamp': 1241482603153, 'title': 'Line Chart (d)', 'description': 'This is a line chart' },
        { 'id': 'e', 'type': 'linear', 'name': 'chart_f', 'createdTimestamp': 1251482603153, 'title': 'Line Chart (e)', 'description': 'This is a line chart' },
        { 'id': 'f', 'type': 'linear', 'name': 'chart_g', 'createdTimestamp': 1261482603153, 'title': 'Line Chart (f)', 'description': 'This is a line chart' },
        { 'id': 'g', 'type': 'linear', 'name': 'chart_h', 'createdTimestamp': 1231482503153, 'title': 'Line Chart (g)', 'description': 'This is a line chart' },
        { 'id': 'h', 'type': 'linear', 'name': 'chart_i', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (h)', 'description': 'This is a line chart' },
        { 'id': 'i', 'type': 'linear', 'name': 'chart_j', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (i)', 'description': 'This is a line chart' },
        { 'id': 'j', 'type': 'linear', 'name': 'chart_k', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (j)', 'description': 'This is a line chart' },
        { 'id': 'k', 'type': 'linear', 'name': 'chart_l', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (k)', 'description': 'This is a line chart' },
        { 'id': 'l', 'type': 'linear', 'name': 'chart_m', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (l)', 'description': 'This is a line chart' },
      ]
      setChartsList(data);
      setTableLoading(false);
    }, 2000)

  }, [])

  const handleRowClick = (id) => {
    setImgLoading(true);
    setImgReady(false);

    setTimeout(() => {
      // TODO: fetch img preview
      setSelectedImgId(id);

      setImgLoading(false);
      setImgReady(true);
    }, 2500);
  }

  const handleDownloadImage = (event) => {
    console.log(event.target.name, selectedImgId)
  }

  // TODO: maybe useMemo for image, since it's "expensive"


  return (
    <Container id='charts-preview-container' className={tableLoading ? 'table-loading': ''}>
      {tableLoading
        ? <Spinner id='table-spinner' animation='border' variant='light' /> // if is loading: display spinner
        : <>
          <Stack id='info-container'>
            <Container id='table-container'>
              <Table className='hover rounded rounded-3 overflow-hidden'>
                <thead>
                  <tr><th>Type</th><th>Name</th><th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {chartsList.map((item, idx) => (
                    <tr key={idx} onClick={() => handleRowClick(item.id)} className={selectedImgId === item.id ? 'table-active' : ''}>
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
            {imgLoading
              ? <Spinner animation='border' variant='light' /> // if is loading: display spinner
              : imgReady // else: 
                ? // if image is ready: load card 
                <>
                  <Card id='preview-card' className={imgReady ? 'max-height-card' : ''}>
                    <Card.Img variant='top' src={sampleImg} alt='preview'></Card.Img>
                    <Card.Body>
                      <Card.Title id='card-title'>{chartsList.find((e) => e.id === selectedImgId).title}</Card.Title>
                      <Card.Text id='card-text'>{chartsList.find((e) => e.id === selectedImgId).description}</Card.Text>
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
        </>
      }
    </Container >

  );
}

export default ChartsPreview;