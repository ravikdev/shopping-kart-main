import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const auth = useSelector(state=>state.auth);

  return (
    <div className={"max-w-container h-[95vh] bg-[url('/about-us.jpg')] bg-cover"}>
      <div className="flex backdrop-opacity-9 p-[100px] backdrop-blur bg-black/50 w-full h-full">
        <div className="w-[800px] h-[400px] text-white p-10 rounded-md">
          <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
            <h1 className="text-4xl text-primeColor font-titleFont font-semibold">
              About Us!!
            </h1>
          </div>
          <div className="flex flex-col gap-4 text-[18px]">
            <span className="text-xl">E-comm website where you can buy multiple products and keep them private with your login and passwords!!!</span>
            <button 
              className="bg-[#4f49ff] p-[3px] w-[100px] rounded-md h-[40px] hover:bg-[#f39221] border-[1px] border-white"
              onClick={()=>{
                if (auth.userLoaded){
                  navigate('/');
                }else{
                  navigate('/');
                }
              }}
            >
              { auth.userLoaded ? 'Shop now' : 'Login' }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
