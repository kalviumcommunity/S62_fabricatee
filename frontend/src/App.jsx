import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Layout from './Layout'
import RequireAuth from './pages/RequireAuth'
import PersistLogin from './components/PersistLogin'
import Design from './pages/Design'
import DesignsBrowse from './pages/DesignsBrowse'
import Fabrics from './pages/Fabrics'
import DesignForm from './components/DesignForm'
import FabricForm from './components/FabricForm'
import ProfileComp from './pages/ProfileComp'
import FabricPage from './pages/FabricPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route element={<PersistLogin/>}>
          <Route path='/' element={<Home/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/wishlist' element={<ProfileComp activeTab='wishlist'/>} />
          <Route path='/orders' element={<ProfileComp activeTab='orders'/>} />
          <Route path='/designform' element={<DesignForm/>} />
          <Route path='/designform/:id' element={<DesignForm/>} />
          <Route path='/fabricform' element={<FabricForm/>} />
          <Route path='/fabricform/:id' element={<FabricForm/>} />
          <Route path='/fabric/:id' element={<FabricPage/>} />
          <Route path='/posts' element={<h4>Posts</h4>} />
          {/* <Route path='/cart' element={<Cart/>} /> */}
          <Route path='/design'>
            <Route index element={<Design/>} />
            <Route path='designs' element={<DesignsBrowse/>} />
            <Route path='fabrics' element={<Fabrics/>} />
          </Route>
          <Route element={<RequireAuth/>}>
            <Route path='/profile' element={<ProfileComp/>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
