import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Spinner, Table } from 'react-bootstrap'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import sampleImg from '../../assets/sample_img.png'
import axios from 'axios'
import { FetchService, UserService } from '../../services'
import './myCharts.css'

const MyCharts = () => {

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  const [chartsTable, setChartsTable] = useState([]);
  const [selectedChartId, setSelectedChartId] = useState("");
  const [selectedChart, setSelectedChart] = useState(null);

  const [tableLoading, setTableLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgReady, setImgReady] = useState(false);


  useEffect(() => {
    const source = axios.CancelToken.source();

    // TODO: GET fetch Table data, add error case
    const fetchTableData = async () => {
      try {
        const tableData = await FetchService.fetchTableData(userInfo._id);
        setChartsTable(tableData);
        setTableLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.log('Error:', error.message);
        }
      }
    }

    if (UserService.isLoggedIn()) {
      fetchTableData();
    }

    return () => {
      source.cancel('Request canceled by MyCharts.jsx cleanup');
    }
  }, [userInfo._id]);


  const handleRowClick = (chartId) => {
    setImgLoading(true);
    setImgReady(false);
    setSelectedChartId(chartId);

    const fetchChartPreview = async () => {
      const imgPreview = await FetchService.createChart(chartId);

      setSelectedChart(sampleImg);
      setImgLoading(false);
      setImgReady(true);
    }

    if (UserService.isLoggedIn()) {
      fetchChartPreview(selectedChartId);
    }
  }

  const handleDownloadImage = (event) => {
    const chartId = selectedChartId;
    const format = event.target.name;

    return new Promise(async (resolve, reject) => {
      try {
        await FetchService.downloadImgFormat(chartId, format);
        resolve(() => undefined);
      } catch (e) {
        reject(e)
      }
    })
  }

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
                    {chartsTable.map((chartTableEntry, idx) => (
                      <tr key={idx}
                        onClick={() => handleRowClick(chartTableEntry.id)}
                        disabled={!imgLoading}
                        className={selectedChartId === chartTableEntry.id ? 'table-active' : ''}>
                        <td>{chartTableEntry.type}</td>
                        <td>{chartTableEntry.name}</td>
                        <td>{new Date(chartTableEntry.createdTimestamp).toDateString()}</td>
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
                      <Card.Img variant='top' src={selectedChart} alt='preview' />
                      <Card.Body>
                        <Card.Title >{selectedChart.title}</Card.Title>
                        <Card.Text >{selectedChart.caption}</Card.Text>
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