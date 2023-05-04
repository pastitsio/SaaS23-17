import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Container } from 'react-bootstrap'

import { ChartsPreview, NavBar, NewUserOffcanvas, RenderOnAuth } from './components'
import { About, CreateChart, Home, PageNotFound } from './pages'

import { UserService } from './services'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'


const App = () => {
  const [isNewUser, setIsNewUser] = useState(false);

  /**
   * If user is logged in, sets up session user info
   *     
   */
  useEffect(() => {
    let isMounted = true;
    const fetchUserInfo = () => {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      UserService.getUserInfo()
        .then(() => {
          if (isMounted) {
            setIsNewUser(userInfo.new_user);
          }
        })
    }

    if (UserService.isLoggedIn()) {
      var tokenUpdateInterval = setInterval(() => {
        UserService.updateToken(() => {
          console.log('Token updated');
        }).catch((error) => {
          console.error(error);
        });
      }, 1000 * 60); // update token every minute if still logged in

      fetchUserInfo();
    }

    return () => {
      isMounted = false; // Set mounted flag to false when component is unmounted to stop fetching.
      clearInterval(tokenUpdateInterval);
    }
  }, [])

  return (
    <BrowserRouter>
      <NavBar />
      <Container className='main-container'>

        <NewUserOffcanvas isNewUser={isNewUser} setIsNewUser={setIsNewUser} />

        <Routes>
          <Route index element={<Home />} />

          <Route path='/about' element={
            <RenderOnAuth> <About /> </RenderOnAuth>
          } />

          <Route path='/mycharts' element={
            <RenderOnAuth> <ChartsPreview /> </RenderOnAuth>
          } />

          <Route path='/create' element={
            <RenderOnAuth> <CreateChart /> </RenderOnAuth>
          } />


          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
