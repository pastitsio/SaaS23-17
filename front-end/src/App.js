import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { About, Home } from './pages'
import { NavBar, RenderOnAuth } from './components'

import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path='/about' element={
          <RenderOnAuth>
            <About />
          </RenderOnAuth>
        } />
      </Routes>
      {/* <Route path='*' element={<PageNotFound />} /> */}
    </BrowserRouter>
  );
}

export default App;
