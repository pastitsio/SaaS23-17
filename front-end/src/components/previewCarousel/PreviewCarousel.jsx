import React from 'react'

import { Carousel, Container } from 'react-bootstrap'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import './previewCarousel.css'

import img1 from '../../assets/line_chart.png'
import img2 from '../../assets/multi_axes_line_chart.png'
import img3 from '../../assets/radar.png'


const PreviewCarousel = () => {

  const handleShowPreview = () => {
  }

  const previewImages = [
    { 'src': img1, 'title': 'Line Chart', 'description': 'Nulla vitae elit libero, a pharetra augue mollis interdum.' },
    { 'src': img2, 'title': 'Multi Axes Line Chart', 'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { 'src': img3, 'title': 'Radar chart', 'description': 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.' }
  ]

  return (
    <Container id='carousel-container'>
      <Carousel>
        {previewImages.map((img, index) => (
          <Carousel.Item>
            <Container className='carousel-img'><img src={img.src} alt="Line Chart" /></Container>
            <Carousel.Caption bsPrefix='my-carousel-caption'>
              <h4>{img.title} <BsFillArrowUpRightCircleFill style={{cursor: 'pointer'}} onClick={() => handleShowPreview()} /></h4>
              <p>{img.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel >
    </Container >
  )
}

export default PreviewCarousel