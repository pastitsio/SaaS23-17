import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Container } from 'react-bootstrap'

import { NavBar, NewUserOffcanvas, RenderOnAuth } from './components'
import { About, CreatedChart, Home, MyCharts, NewChart, PageNotFound } from './pages'

import { FetchService, UserService } from './services'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import axios from 'axios'


const App = () => {
  const [isNewUser, setIsNewUser] = useState(false);

  /**
   * If user is logged in, sets up session user info
   *     
   */
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchUserInfo = async () => {
      var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (!userInfo) {
        try {
          userInfo = await FetchService.fetchUserInfo(UserService.getId());
          console.log('userInfo :>> ', userInfo);
          setIsNewUser(userInfo.new_user);
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
          } else {
            console.log('Error:', error.message);
          }
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
      <NavBar />
      <Container className='main-container'>

        <NewUserOffcanvas isNewUser={isNewUser} setIsNewUser={setIsNewUser} />

        <Routes>
          <Route index element={
            <Home />}
          />

          <Route path='/about' element={
            <RenderOnAuth> <About /> </RenderOnAuth>
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
    </BrowserRouter>
  );
}

export default App;
