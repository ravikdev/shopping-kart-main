import React from 'react'
import { Fragment, useEffect } from 'react';
import Category from './Products/Category';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getToCart, logoutUserShopping } from '../redux/Slices/shoppingSlice';
import { logoutUser } from '../redux/Slices/authSlice';
import { logoutUserDetails } from '../redux/Slices/userSlice';

const Home = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getToCart({userId: user.userId}));
        if(!(user.userLoaded) && !(auth.userLoaded)){
            dispatch(logoutUser());
            dispatch(logoutUserDetails());
            dispatch(logoutUserShopping());
            localStorage.clear();
            navigate('/');
        }
    }, [user.userLoaded]);

    return (
        <Fragment>
            <div>
                <div className='flex justify-between items-center bg-[#4f49ff] px-10 py-16 max-sm:block'>
                    <div className='pl-8 text-white'>
                        <h1 className='text-6xl font-semibold my-8 max-sm:text-3xl max-md:text-4xl '>NEW ARRIVALS</h1>
                        <p className='text-4xl my-8 max-sm:text-2xl max-md:text-2xl'>Explore the latest collection now</p>
                        <button
                            className='bg-white text-black px-4 py-2 rounded-md hover:bg-[#000000] hover:text-white'
                            onClick={()=>{
                                navigate("/category");
                            }}
                        >
                            Shop Now
                        </button>
                    </div>
                    <div className=''>
                        <img src='https://www.freepnglogos.com/uploads/shopping-bag-png/shopping-bag-shopping-bags-transparent-png-svg-vector-8.png' alt='hero' className='object-contain max-sm: h-72 w-72 m-auto' />
                    </div>
                </div>

               <Category />

            </div>
        </Fragment>
    )
}

export default Home;