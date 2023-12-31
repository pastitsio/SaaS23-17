import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Container } from 'react-bootstrap'

import { NavBar, NewUserOffcanvas, RenderOnAuth } from './components'
import { About, CreatedChart, Home, MyCharts, NewChart, PageNotFound } from './pages'

import { UserContext } from './UserContext'
import { BackendService, UserService } from './services'

import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'


const App = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  /**
   * If user is logged in, sets up session user info
   */
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchUserInfo = async () => {
      try {
        await BackendService.fetchUserInfo(UserService.getTokenParsed().email);
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        setUserInfo(userInfo);
        setIsNewUser(userInfo.newUser);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.log('Error:', error.message);
        }
      }
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
      source.cancel('Request canceled by App.jsx cleanup');
      clearInterval(tokenUpdateInterval);
    }
  }, [])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userInfo, setUserInfo }}>
        <NavBar />
        <Container className='main-container'>
          <NewUserOffcanvas isNewUser={isNewUser} setIsNewUser={setIsNewUser} />

          <Routes>
            <Route index element={
              <Home />
            } />

            <Route path='/about' element={
              <About />
            } />

            <Route path='/mycharts' element={
              <RenderOnAuth> <MyCharts /> </RenderOnAuth>
            } />

            <Route path='/new' element={
              <RenderOnAuth> <NewChart /> </RenderOnAuth>
            } />

            <Route path='/created' element={
              <RenderOnAuth> <CreatedChart /> </RenderOnAuth>
            } />

            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Container>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
