import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Container } from 'react-bootstrap'

import { ChartsPreview, NavBar, RenderOnAuth } from './components'
import { About, AfterLogin, Home, PageNotAuthorized, PageNotFound } from './pages'

import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'

const App = () => {

  return (
    <BrowserRouter>
      <NavBar />
      <Container id='main-container'>
        <Routes>
          <Route index element={<Home />} />
          
          <Route path='/about' element={
            <RenderOnAuth altComponent={<PageNotAuthorized />}>
              <About />
            </RenderOnAuth>
          } />

          <Route path='/mycharts' element={
            <RenderOnAuth altComponent={<PageNotAuthorized />}>
              <ChartsPreview />
            </RenderOnAuth>
          } />

          <Route path='/afterlogin' element={
            <RenderOnAuth altComponent={<PageNotAuthorized />}>
              <AfterLogin />
            </RenderOnAuth>
          } />

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
