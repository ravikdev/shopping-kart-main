import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/Slices/authSlice';
import { logoutUserShopping } from '../redux/Slices/shoppingSlice';
import { logoutUserDetails, userDetails } from '../redux/Slices/userSlice';
import { clearOrder } from '../redux/Slices/orderSlice';

const Navbar = () => {
  const products = useSelector((state) => state.shopping.products);
  const auth = useSelector(state => state.auth.userLoaded);
  const user = useSelector(state => state.user);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!user.userLoaded){
      console.log("logout", user.userLoaded);
      dispatch(logoutUser());
      dispatch(clearOrder());
      dispatch(logoutUserDetails());
      dispatch(logoutUserShopping());
      navigate("/");
    }
  }, [])
  

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearOrder());
    dispatch(logoutUserDetails());
    dispatch(logoutUserShopping());
  }
  return (
    <>
      <main className='bg-[#4f49ff] text-white w-full p-5'>
        <nav className='h-[26px] flex flex-row justify-between'>
          <section 
            className='bg-white flex justify-center w-[38px] h-[38px] m-[-5px] rounded-full cursor-pointer'
            onClick={()=>{
              navigate('/');
            }}
          >
            <img className="" src='/shopping-cart.svg' width={'30px'}/>
          </section>
          <section>
            <ul className='flex gap-6 list-none'>
                <li className='hover:text-[#f39221] hover:border-b-2'>
                  <NavLink to='/'><span>Home</span></NavLink>
                </li>
                <li className='hover:text-[#f39221] hover:border-b-2'>
                  <NavLink to='/about'><span>About</span></NavLink>
                </li>
                <li className='hover:text-[#f39221] hover:border-b-2'>
                  <NavLink to='/contact'><span>Contact</span></NavLink>
                </li>
                {
                  (auth)? (
                    <>
                      <li className=''>
                        <NavLink to='/cart'>
                          <div className='h-[26px] flex flex-row gap-[4px] items-center'>
                            <p className='hover:text-[#f39221] hover:border-b-2'>Cart</p>
                            <p className='w-[22px] h-[22px] text-center text-[12px] border-2  rounded-full'>{products?.length}</p>
                          </div>
                        </NavLink>
                      </li>
                      <li className=''>
                        <NavLink to='/orders'>
                          <div className='h-[26px] flex flex-row gap-[4px] items-center'>
                            <p className='hover:text-[#f39221] hover:border-b-2'> Orders </p>
                            {/* <p className='w-[20px] h-[20px] text-center text-xs border-2 bg-[#f39221] rounded-full'>{products?.length}</p> */}
                          </div>
                        </NavLink>
                      </li>
                      <li 
                        onClick={() => {
                          dispatch(userDetails());
                        }}
                        className='hover:text-[#f39221] hover:border-b-2'
                      >
                        <NavLink to='/user/profile'> Profile </NavLink>
                      </li>
                      <li className='hover:text-[#f39221] hover:border-b-2'>
                        <NavLink to='/' 
                          onClick={handleLogout}
                        > 
                          Logout 
                        </NavLink>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className='hover:text-[#f39221] hover:border-b-2'>
                        <NavLink to='/'>Login</NavLink>
                      </li>
                      <li className='hover:text-[#f39221] hover:border-b-2'>
                        <NavLink to='/register'>Register</NavLink>
                      </li>
                    </>
                  )
                }
            </ul>
          </section>
        </nav>
      </main>
    </>
  )
  
}

export default Navbar