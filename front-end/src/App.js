import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages'
import { NavBar } from './components'

function App() {
  return (
    <BrowserRouter>
        <NavBar />
      {/* <div className="gradient__bg ">
      </div> */}
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
