import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/Slices/authSlice';
import { userDetails } from '../../redux/Slices/userSlice';
import { Grid } from 'react-loader-spinner';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [loader, setLoader] = useState(false);
  const auth = useSelector(state=> state.auth);
  
  useEffect(() => {
    if(auth.userLoaded){
      setLoader(false);
      navigate("/home");
    }else{
      if(!auth?.loginError?.status){
        setLoader(false);
      }
    }
  }, [auth])

  const handleSignIn = async (e) => {
    setLoader(true);
    e.preventDefault();
    await dispatch(loginUser(user));
    await dispatch(userDetails());
  }

  return (
    <>
      <div className="m-36 h-[70vh]">
        <div className="bg-color : bg-[#4f49ff] (green) max-w-4xl m-auto rounded-xl shadow-lg shadow-[#3215b5]/50">
          <div className="flex items-center justify-center content-center text-center  h-[600px] max-w-4xl rounded-xl">
            <div className="flex justify-center items-center bg-white basis-3/4  h-full rounded-l-xl">
              <div className=" bg-white basis-3/4">
                <div className='flex flex-col gap-4'>
                  <h1 className="font-bold text-4xl text-center text-[#3215b5]">
                    Sign in to Shopkart
                  </h1>
                  <form onSubmit={handleSignIn}>
                    <div className="grid gap-x-8 gap-y-4 grid-cols-1 pt-5 ">
                      <div className="flex justify-center items-center gap-x-2">
                        <div>
                          <FaUser />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Email"
                            className="w-72 px-2 py-1 rounded-lg bg-gray-200 border-[0.1px] border-[#9ca3af]"
                            required
                            onChange={(e)=>setUser({...user, email:e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-x-2">
                        <div>
                          <FaLock />
                        </div>
                        <div>
                          <input
                            type="password"
                            placeholder="Password"
                            className="w-72 px-2 py-1 rounded-lg bg-gray-200 border-[0.1px] border-[#9ca3af]"
                            required
                            onChange={(e)=>setUser({...user, password:e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <a href="/">
                      <p class="mt-4">Forgot your password ?</p>
                    </a> */}
                    <button
                      type="submit"
                      className="bg-[#4f49ff] (green) px-14 rounded-full py-2 mt-4 text-white"
                    >
                      {auth.loginStatus === "pending" 
                        ? "Logging..." 
                        : auth.loginStatus === "success" 
                          ? "Logged" 
                          : "Login"
                        }

                    </button>
                  </form>
                  { 
                    auth.loginStatus === "rejected" ? 
                      (<div className='mt-3 text-red-500'>{auth?.loginError?.message}</div>)
                    : auth.loginStatus === "success" ? 
                        (<div className='mt-3 text-green-500'>Submitted successfully</div>) 
                      : null
                  }
                </div>
              </div>
            </div>
            <div>
              <div className="bg-color : bg-[#4f49ff] (green) max-w-screen-md basis-2/4  h-[170px] ">
                <h1 className="font-bold text-4xl m-auto text-center text-white">
                  Hello, CloudEQ !
                </h1>
                <p className="m-auto text-center mt-8 text-white px-10">
                  Enter your personal details and start journey with us
                </p>
                <NavLink to='/register'>
                  <button className="rounded-full  border-solid border-2 border-white  px-10 py-1 text-center text-white mt-8">
                    Register
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        loader && (
          <div className=' backdrop-opacity-9 backdrop-blur bg-white/30 snap-none fixed top-0 left-0 w-screen h-screen'>
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
              <Grid
                visible={true}
                height="50"
                width="50"
                color="#3215b5"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
              />
            </div>
          </div>
        )
      }
    </>
  );
}

export default Login
