import React from 'react'
import Header from  './components/Header'
import Footer from  './components/Footer'

//import HomeScreen from  './screens/HomeScreen'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

//So from here, we want to bring in the toast container.
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
/*this py-3 means padding on Y-axis  */
/*Currently we have embedded HomeScreen directly in App.js file. But we don't want that. We want to have links between App Component 
and other screens. For that we will use React Router*/
/*In index.js implemement React Router Dom*/
const App = () => {
  return (
    <>
      <Header/>
      <main className='py-3'>
        <Container>
          {/*<HomeScreen/>*/}
          <Outlet/>
        </Container>
      </main>
      <Footer/>
      <ToastContainer/>
    </>
  )
}

export default App
