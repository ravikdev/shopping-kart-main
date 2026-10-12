import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from '../../redux/Slices/authSlice';
import { Grid } from 'react-loader-spinner';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const auth = useSelector(state=> state.auth);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if(auth.userLoaded){
      setLoader(false);
      navigate("/");
    }
    if(auth.registerStatus === "success"){
      setLoader(false);
      navigate("/");
    }
  }, [auth.registerStatus, auth])
  
  const handleSubmit = (e) => {
    setLoader(true);
    e.preventDefault();
    dispatch(registerUser(user));
  }

  return (
    <>
      <div className="border-[#3215b5] bg-cover m-36 h-[70vh] rounded-xl">
        <div className="md:bg-color: bg-[#4f49ff] (green) max-w-4xl m-auto rounded-xl shadow-lg shadow-[#3215b5]/50">
          <div className="md:flex items-center justify-center content-center text-center  h-[600px] max-w-4xl">
            <div>
              <div className="md:bg-color : bg-[#4f49ff] (green) max-w-screen-md basis-2/4  h-[170px] max-w-screen border-transparent">
                <h1 className="font-bold text-4xl m-auto text-center text-white">
                  Welcome back
                </h1>
                <p className="m-auto text-center mt-8 text-white px-5">
                  To keep connected with us please login with your personal info
                </p>
                <NavLink to='/'>
                  <button
                    // onClick={ () => clickHandle()}
                    className="rounded-full  border-solid border-2 border-white  px-6 py-1 text-center text-white mt-8"
                  >
                    Login
                  </button>
                </NavLink>
              </div>
            </div>
            <div className=" bg-white basis-3/4  h-full ">
              <div className="flex flex-col gap-2 bg-white basis-3/4  h-[400px] mt-[25%]">
                <div>
                  <h1 className="font-bold text-4xl m-auto text-center text-[#3215b5]">
                    Create Account
                  </h1>
                </div>
                <div>
                  <form onSubmit={handleSubmit}>
                    <div className=" mt-5 grid gap-x-8 gap-y-4 grid-cols-1 ">
                      <div>
                        <input
                          className="text-sm w-72 px-4 py-2 rounded-lg bg-gray-200 border-[#9ca3af]"
                          type="text"
                          placeholder="First Name"
                          required
                          onChange={(e)=>setUser({...user, firstName:e.target.value})}
                        />
                        </div>
                      <div>
                        <input
                          className="text-sm w-72 px-4 py-2 rounded-lg bg-gray-200 border-[#9ca3af]"
                          type="text"
                          placeholder="Last Name"
                          required
                          onChange={(e)=>setUser({...user, lastName:e.target.value})}
                        />
                      </div>
                      <div>
                        <input
                          className="text-sm w-72 px-4 py-2 rounded-lg bg-gray-200 border-[#9ca3af]"
                          type="email"
                          placeholder="Email"
                          required
                          onChange={(e)=>setUser({...user, email:e.target.value})}
                        />
                      </div>
                      <div>
                        <input
                          className="text-sm w-72 px-4 py-2 rounded-lg bg-gray-200 border-[#9ca3af]"
                          type="Password"
                          placeholder="Password"
                          required
                          onChange={(e)=>setUser({...user, password:e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <button className="bg-[#4f49ff] (green) px-14 rounded-full py-2 mt-8 text-white">
                      {auth.registerStatus === "pending" ? "Submitting" : auth.registerStatus === "success" ? "Submitted" : "Register"}
                    </button>
                  </form>

                  { 
                    auth.registerStatus === "rejected" 
                      // ? (<div className='mt-3 text-red-500'>{auth?.registerError?.message}</div>)
                      ? (<div className='mt-3 text-red-500'>{auth?.registerError?.message }</div>)

                      : auth.registerStatus === "success" 
                        ? (<div className='mt-3 text-green-500'>Submitted successfully</div>) 
                        : null
                  }
                </div>
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

export default Register;