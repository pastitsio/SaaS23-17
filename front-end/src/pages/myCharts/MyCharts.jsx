import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Spinner, Stack, Table } from 'react-bootstrap'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import sampleImg from '../../assets/line_chart_white-bg.png'

import './myCharts.css'

const MyCharts = () => {

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  const [chartsList, setChartsList] = useState([]);
  const [selectedImgId, setSelectedImgId] = useState("");

  const [tableLoading, setTableLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    // const cancelToken = _axios.cancelToken.source();

    // TODO: GET fetch Table data
    setTimeout(() => {

      const data = [
        { 'id': 'a', 'type': 'linear', 'name': 'chart_a', 'createdTimestamp': 1131482603153, 'title': 'Line Chart (a)', 'caption': 'This is a line chart' },
        { 'id': 'b', 'type': 'linear', 'name': 'chart_b', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (b)', 'caption': 'This is a line chart' },
        { 'id': 'c', 'type': 'linear', 'name': 'chart_c', 'createdTimestamp': 1141482603153, 'title': 'Line Chart (c)', 'caption': 'This is a line chart' },
        { 'id': 'd', 'type': 'linear', 'name': 'chart_d', 'createdTimestamp': 1241482603153, 'title': 'Line Chart (d)', 'caption': 'This is a line chart' },
        { 'id': 'e', 'type': 'linear', 'name': 'chart_f', 'createdTimestamp': 1251482603153, 'title': 'Line Chart (e)', 'caption': 'This is a line chart' },
        { 'id': 'f', 'type': 'linear', 'name': 'chart_g', 'createdTimestamp': 1261482603153, 'title': 'Line Chart (f)', 'caption': 'This is a line chart' },
        { 'id': 'g', 'type': 'linear', 'name': 'chart_h', 'createdTimestamp': 1231482503153, 'title': 'Line Chart (g)', 'caption': 'This is a line chart' },
        { 'id': 'h', 'type': 'linear', 'name': 'chart_i', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (h)', 'caption': 'This is a line chart' },
        { 'id': 'i', 'type': 'linear', 'name': 'chart_j', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (i)', 'caption': 'This is a line chart' },
        { 'id': 'j', 'type': 'linear', 'name': 'chart_k', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (j)', 'caption': 'This is a line chart' },
        { 'id': 'k', 'type': 'linear', 'name': 'chart_l', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (k)', 'caption': 'This is a line chart' },
        { 'id': 'l', 'type': 'linear', 'name': 'chart_m', 'createdTimestamp': 1231482603153, 'title': 'Line Chart (l)', 'caption': 'This is a line chart' },
      ]
      setChartsList(data);
      setTableLoading(false);

      return () => {
        // cancelToken.cancel()
      }
    }, 2000)

  }, [])

  const handleRowClick = (id) => {
    setImgLoading(true);
    setImgReady(false);

    setTimeout(() => {
      // TODO: GET fetch img preview
      setSelectedImgId(id);

      setImgLoading(false);
      setImgReady(true);
    }, 2500);
  }

  const handleDownloadImage = (event) => {
    console.log(event.target.name, selectedImgId)
  }

  // TODO: maybe useMemo for image, since it's "expensive"

  console.log('userInfo._id :>> ', userInfo._id);

  return (
    <>
      <Container className="header-container">
        <h2>Your Charts</h2>
      </Container>
      <Container className={tableLoading ? "table-loading" : "wrapper-container"}>
        {tableLoading
          ? <Spinner id='table-spinner' animation='border' variant='light' /> // if is loading: display spinner
          : <>
            <Container className="table-export-container" style={{ flex: '40%' }}>
              <Container className='table-container' style={{ height: '70%' }}>
                <Table className=''>
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
              <Container className='export-container' style={{ height: '30%' }}>
                <Container className='export-buttons'>
                  <Button className={imgReady ? '' : 'disabled'} size='sm' name='html' onClick={(event) => handleDownloadImage(event)}>HTML</Button>
                  <Button className={imgReady ? '' : 'disabled'} size='sm' name='pdf' onClick={(event) => handleDownloadImage(event)}>PDF</Button>
                  <Button className={imgReady ? '' : 'disabled'} size='sm' name='png' onClick={(event) => handleDownloadImage(event)}>PNG</Button>
                  <Button className={imgReady ? '' : 'disabled'} size='sm' name='svg' onClick={(event) => handleDownloadImage(event)}>SVG</Button>
                  <Container className='button-divider' >{" "}</Container>
                  <Button id='interactive-button' className={imgReady ? '' : 'disabled'}>Interactive Preview <BsFillArrowUpRightCircleFill /></Button>
                </Container>
                <u className='export-label' >Export as:</u>
              </Container>
            </Container>
            <Container className="img-preview-container" style={{ flex: '60%' }}>
              {imgLoading
                ? <Spinner animation='border' variant='light' /> // if is loading: display spinner
                : <Card className='preview-card'>
                  {imgReady // else:
                    ? // if image is ready: load card
                    <>
                      <Card.Img variant='top' src={sampleImg} alt='preview' />
                      <Card.Body>
                        <Card.Title >{chartsList.find((e) => e.id === selectedImgId).title}</Card.Title>
                        <Card.Text >{chartsList.find((e) => e.id === selectedImgId).caption}</Card.Text>
                      </Card.Body>
                    </>
                    :
                    <p id='select-prompt'>Select a chart from the table </p>
                  }
                </Card>
              }
            </Container>
          </>
        }
      </Container>
    </>
  )

}

export default MyCharts