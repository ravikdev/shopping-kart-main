import { FaLocationDot } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { SiGmail } from "react-icons/si";
import { MdOutlineFacebook } from "react-icons/md";

import { IoIosPhonePortrait } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { useNavigate } from "react-router-dom";


export default function Footer(){
    const navigate = useNavigate();
    return(
        <div className="h-64 bg-[#4f49ff] flex align-middle w-full">
            <div className="bg-[#4f49ff] basis-1/3 border-r-[1.5px] ">
                <div className='py-12 px-7 text-white '>
                    <h1 className='text-3xl font-medium'>Shopkart</h1>
                    <div className='flex list-none mt-5 '>
                        <li onClick={()=>{
                                navigate('/');
                            }}
                            className='mr-2 hover:text-[#f39e3a]'
                        >
                        Home </li> |
                       <li onClick={()=>{ navigate('/orders'); }}
                            className='mr-2 ml-2 hover:text-[#f39e3a]'
                        >
                            Orders
                        </li>|
                       <li onClick={()=>{
                            navigate('/contact');
                        }}
                        className='mr-2 ml-2 hover:text-[#f39e3a]'>Contact</li>|
                    </div>
                    <p className='mt-5'>Powered By CloudEQ &copy;</p>
            
                </div>
            </div>
            <div className="bg-[#4f49ff] basis-1/3 border-r-2"> 
                <div className='py-12 px-7   '>
                    <div className='flex'>
                        <div className='p-2 h-9 w-9 text-xl rounded-full bg-white'>
                            <FaLocationDot/>
                        </div>
                        <div className="text-white ml-5">
                            <p>70, Industrial Area Phase I, Ind, Area, Chandigarh, 160101</p>
                        </div>
                    </div>
                    <div className='flex mt-5'>
                        <div className='p-2 h-9 w-9 text-xl rounded-full bg-white'>
                            <IoIosMail/>
                        </div>
                        <div className='ml-5 mt-1'>
                            <p className="text-white">support@cloudeq.com</p>
                        </div>
                    </div>
                   
                    
                </div>
            </div>
            <div className="bg-[#4f49ff] basis-1/3">
                <div className='py-9 px-7 m-auto'>
                    <h1 className='text-2xl font-medium text-white'>About the Company</h1>
                    <p className='mt-5  text-white'>
                        Mission and vision - To positively impact corporations’ customer and employee experience through transformational cloud solutions, while making the world kinder and more eco-friendly.
                    </p>
                    <div className='flex mt-5 text-2xl '>
                        <a href="#"><SiGmail className='p-2 h-9 w-9 text-xl rounded-full bg-white mr-3 hover:bg-[#4f49ff]'/></a>
                        <a href="#"><IoLogoLinkedin className='p-2 h-9 w-9 text-xl rounded-full bg-white mr-3 hover:bg-[#4f49ff]'/></a>
                        <a href="#"><MdOutlineFacebook className='p-2 h-9 w-9 text-xl rounded-full bg-white mr-3 hover:bg-[#4f49ff]'/></a>
                    </div>
                </div>
            </div>
        </div>
    )
}