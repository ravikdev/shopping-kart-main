import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import Home from './Home';
import Navbar from './Navbar';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Missing from './Missing';
import Cart from './Cart/Cart';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';
import SelectedProduct from './Products/SelectedProduct';
import SelectedCategory from './Products/SelectedCategory';
import Category from './Products/Category';
import Profile from './Profile';
import Orders from './Orders';

const PrivateRoute = ()=>{
  const auth = useSelector((state)=>state.auth.userLoaded);
  return auth ? <Outlet/> : <Navigate to="/" />;
}

const Layout = () => {
  
  return (
    <div className='flex flex-col g-10'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route exact path='/home' element={<Home/>} />
            <Route path='/category' element={<Category/>}/>
            <Route path='/category/:categoryId' element={<SelectedCategory/>} />
            <Route path='/product/:productId' element={<SelectedProduct/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/cart' element={<Cart/>} />
            <Route path='/user/profile' element={<Profile/>} />
          </Route>

          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/*' element={<Missing/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default Layout