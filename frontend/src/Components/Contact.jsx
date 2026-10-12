import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Contact = () => {

  return (
    <div className={"max-w-container h-[95vh] bg-[url('/sean-pollock-PhYq704ffdA-unsplash.jpg')] bg-cover"}>
      <div className="flex backdrop-opacity-9 backdrop-blur bg-teal/50 w-full h-full">
        <div className="w-[800px] h-[400px] m-auto text-white bg-black/50 p-10 rounded-md">
          <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
            <h1 className="text-4xl text-primeColor font-titleFont font-semibold">
              Support Contacts!!
            </h1>
          </div>
          <div className="flex flex-col gap-4 text-[18px]">
            <span><span className="font-bold"> Address:</span> 70, Industrial Area Phase I, Ind, Area, Chandigarh, 160101 </span>
            <span><span className="font-bold"> Email:</span> support@cloudeq.com </span>
            
            <h2 className="text-xl">Reach us we are happy to connect!!!</h2>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
