import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Layout from './Layout'
import RequireAuth from './pages/RequireAuth'
import PersistLogin from './components/PersistLogin'
import Shop from './pages/Shop'
import DesignsBrowse from './pages/DesignsBrowse'
import Fabrics from './pages/Fabrics'
import DesignForm from './components/DesignForm'
import FabricForm from './components/FabricForm'
import ProfileComp from './pages/ProfileComp'
import FabricPage from './pages/FabricPage'
import CustomizeDesignPage from './pages/CustomizeDesignPage'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderFailed from './pages/OrderFailed'
import ErrorComponent from './components/ErrorComponent'
import DesignPage from './pages/DesignPage'
import AllUserOrders from './pages/AllUserOrders'

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route element={<PersistLogin/>}>
          <Route path='/' element={<Home/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/error' element={<ErrorComponent/>} />
          <Route path='/checkout'>
            <Route index element={<Checkout/>}/>
            <Route path='confirmed' element={<OrderConfirmation/>} />
            <Route path='failed' element={<OrderFailed/>} />
          </Route>
          <Route path='/wishlist' element={<ProfileComp activeTab='wishlist'/>} />
          <Route path='/orders' element={<ProfileComp activeTab='orders'/>} />
          <Route path='/profile/address' element={<ProfileComp activeTab='addresses'/>} />
          <Route path='/designform' element={<DesignForm/>} />
          <Route path='/designform/:id' element={<DesignForm/>} />
          <Route path='/fabricform' element={<FabricForm/>} />
          <Route path='/fabricform/:id' element={<FabricForm/>} />
          <Route path='/fabric/:id' element={<FabricPage/>} />
          <Route path='/design/:id' element={<DesignPage/>} />
          <Route path='/posts' element={<h4>Posts</h4>} />
          {/* <Route path='/cart' element={<Cart/>} /> */}
          <Route path='/shop'>
            <Route index element={<Shop/>} />
            <Route path='designs' element={<DesignsBrowse/>} />
            <Route path='fabrics' element={<Fabrics/>} />
          </Route>
          <Route path='/view-user-orders' element={<AllUserOrders/>} />
          <Route element={<RequireAuth/>}>
            <Route path='/profile' element={<ProfileComp/>} />
          </Route>
        </Route>
      </Route>
      <Route element={<Layout nav={false}/>}>
        <Route path='/shop/designs/customize/:id' element={<CustomizeDesignPage/>} />
      </Route>
    </Routes>
  )
}

export default App
