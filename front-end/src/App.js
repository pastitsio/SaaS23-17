import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages'
import { NavBar } from './components'

import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      {/* <div className="gradient__bg ">
      </div> */}
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path='*' element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
