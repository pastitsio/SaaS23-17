import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Spinner, Table } from 'react-bootstrap'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import sampleImg from '../../assets/sample_img.png'
import axios from 'axios'
import { BackendService, UserService } from '../../services'
import './myCharts.css'

const MyCharts = () => {

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  const [chartsTable, setChartsTable] = useState([]);
  const [selectedChartIdx, setSelectedChartIdx] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);

  const [tableLoading, setTableLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  const [prompt, setPrompt] = useState('Select a chart from the table ');

  useEffect(() => {
    const source = axios.CancelToken.source();

    // TODO: GET fetch Table data, add error case
    const fetchTableData = async () => {
      try {
        const tableData = await BackendService.fetchTableData(userInfo.email);
        setChartsTable(tableData);
        console.log('tableData :>> ', tableData);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.log('Error:', error.message);
        }
        setPrompt(error.message)
      }
      setTableLoading(false);
    }

    if (UserService.isLoggedIn()) {
      fetchTableData();
    }

    return () => {
      source.cancel('Request canceled by MyCharts.jsx cleanup');
    }
  }, [userInfo.email]);


  const handleRowClick = (chartIdx) => {
    setImgLoading(true);
    setImgReady(false);
    setSelectedChartIdx(chartIdx);

    const fetchChartPreview = async () => {
      // eslint-disable-next-line no-unused-vars
      const imgPreview = await BackendService.createChart(chartIdx);

      setSelectedChart(imgPreview);
      setImgLoading(false);
      setImgReady(true);
    }

    if (UserService.isLoggedIn()) {
      fetchChartPreview(selectedChartIdx);
    }
  }

  const handleDownloadImage = (event) => {
    const chartIdx = selectedChartIdx;
    const format = event.target.name;

    return new Promise(async (resolve, reject) => {
      try {
        await BackendService.downloadImgFormat(chartIdx, format);
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
                        onClick={() => handleRowClick(idx)}
                        disabled={!imgLoading}
                        className={selectedChartIdx === idx ? 'table-active' : ''}>
                        <td>{chartTableEntry.chart_type}</td>
                        <td>{chartTableEntry.chart_name}</td>
                        <td>{new Date(chartTableEntry.created_on * 1000).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
              <Container className='export-container' style={{ height: '30%' }}>
                <Container className='export-buttons'>
                  {['html', 'pdf', 'png', 'svg'].map((imgFormat, idx) => (
                    <Button key={idx} className={imgReady ? '' : 'disabled'} size='sm' name={imgFormat} onClick={(event) => handleDownloadImage(event)}>{imgFormat.toUpperCase()}</Button>
                  ))}
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
                      <Card.Img variant='top' src={selectedChart.src} alt='preview' />
                      <Card.Body>
                        <Card.Title >{selectedChart.title}</Card.Title>
                        {/* <Card.Text >{selectedChart.caption}</Card.Text> */}
                      </Card.Body>
                    </>
                    :
                    <p id='select-prompt'>{prompt}</p>
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