import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Spinner, Table } from 'react-bootstrap'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import axios from 'axios'
import { BackendService, UserService } from '../../services'
import './myCharts.css'

const MyCharts = () => {

  const [chartsTable, setChartsTable] = useState([]);
  const [selectedChartIdx, setSelectedChartIdx] = useState(-1);
  const [selectedChart, setSelectedChart] = useState(null);

  const [tableLoading, setTableLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  const [userInfo, setUserInfo] = useState(null)
  const [prompt, setPrompt] = useState('Select a chart from the table ');


  useEffect(() => {
    const interval = setInterval(() => {
      const storedUserInfo = sessionStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
        clearInterval(interval); // Stop the polling once userInfo is found
      }
    }, 400);

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchTableData = async () => {
      try {
        const tableData = await BackendService.fetchChartTableData(userInfo.email);
        setChartsTable(tableData);
        setPrompt('Select a chart from the table ')
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        }
        setPrompt(error.message)
      }
      setTableLoading(false);
    }

    if (UserService.isLoggedIn()) {
      if (userInfo)
        fetchTableData();
    }

    return () => {
      source.cancel('Request canceled by MyCharts.jsx cleanup');
    }
  }, [userInfo]);


  const handleRowClick = (chartIdx) => {
    if (chartIdx === selectedChartIdx) {
      return;
    }
    
    setSelectedChartIdx(chartIdx);
    setImgLoading(true);
    setImgReady(false);
    
    const fetchChartPreview = async () => {
      try {
        const { chart_url, chart_name } = chartsTable.at(chartIdx);

        const imgPreview = await BackendService.fetchChart(chart_url, 'jpeg');

        setSelectedChart({ src: imgPreview, title: chart_name });
        setImgReady(true);
      } catch (error) {
        setSelectedChartIdx(-1);
        setImgReady(false);
        setPrompt(error.message)
      }
      setImgLoading(false);
    }
    fetchChartPreview();
  }

  const handleDownloadImage = async (event) => {
    const imgFormat = event.target.name;

    try {
      const { chart_url, chart_name } = chartsTable.at(selectedChartIdx);

      const downloadedURL = await BackendService.fetchChart(chart_url, imgFormat);

      const link = document.createElement('a');
      link.href = downloadedURL;
      link.download = `${chart_name}.${imgFormat}`;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      setImgReady(false);
      setPrompt(e.message)
    }
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
                    <tr><th>Type</th><th>Name</th><th>Date Created</th>
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
                    <Button
                      key={idx}
                      className={imgReady ? '' : 'disabled'}
                      size='sm' name={imgFormat}
                      onClick={handleDownloadImage}
                    >{imgFormat.toUpperCase()}</Button>
                  ))}
                  <Container className='button-divider' >{" "}</Container>
                  <Button id='interactive-button' disabled className={imgReady ? '' : 'disabled'}>Interactive Preview <BsFillArrowUpRightCircleFill /></Button>
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