import React, { useEffect, useState } from 'react'

import { Container } from 'react-bootstrap'
import { BsDashLg, BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'

import './previewCarousel.css'

import img1 from '../../assets/bar_label_plot.png'
import img2 from '../../assets/scatter_plot.webp'
import img3 from '../../assets/simple_plot.webp'


const PreviewCarousel = () => {

  const [shownImageIdx, setShownImageIdx] = useState(0);
  const handleShowPreview = (idx) => {
  }

  const imgList = [
    { 'src': img1, 'title': 'Bar Label', 'caption': 'Nulla vitae elit libero, a pharetra augue mollis interdum.' },
    { 'src': img2, 'title': 'Scatter Plot', 'caption': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { 'src': img3, 'title': 'Simple Plot', 'caption': 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setShownImageIdx(prev => (prev + 1) % imgList.length)
    }, 4000)
    return () => {
      clearInterval(interval)
    }
  }, [imgList.length, shownImageIdx])


  return (
    <Container className='carousel-container'>

      <Container className='carousel-top-container'>
        <Container className='carousel-arrow-indicator' onClick={() => setShownImageIdx((shownImageIdx + imgList.length - 1) % imgList.length)}>
          <MdArrowBackIos transform="scale(1.5,2)" />
        </Container>

        <Container className='carousel-img-container'>
          {imgList.map((img, idx) => (
            <Container key={`img-${idx}`}>
              <Container className={`carousel-img ${idx === shownImageIdx ? 'active-img' : 'd-none'}`}>
                <img src={img.src} alt={img.title} />
              </Container>
              <Container className={idx === shownImageIdx ? 'carousel-img-text' : 'd-none'}>
                <span onClick={() => handleShowPreview(shownImageIdx)} id='img-title'>
                  <u>{img.title}</u> <BsFillArrowUpRightCircleFill />
                </span>
                <br />
                <span id='img-caption'>{img.caption}</span>
              </Container>
            </Container>
          ))}
        </Container>

        <Container className='carousel-arrow-indicator' onClick={() => setShownImageIdx((shownImageIdx + 1) % imgList.length)}>
          <MdArrowForwardIos transform="scale(1.8, 2)" />
        </Container>
      </Container>
      <Container className='carousel-indicator-container'>
        {imgList.map((i, idx) => (
          <span
            key={`indicator-${idx}`}
            className={` indicator ${idx === shownImageIdx ? 'active-indicator' : ''}`}
            onClick={() => setShownImageIdx(idx)}>
            <BsDashLg />
          </span>
        ))}
      </Container>
    </Container>
  )
}

export default PreviewCarousel