import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrders } from '../redux/Slices/orderSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { Grid } from 'react-loader-spinner';


const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [actOrder, setActOrder] = useState(0);
    const [activeOrderProds, setActiveOrderProds] = useState([]);
    const [loader, setLoader] = useState(true);

    const user = useSelector(state => state.user.user);
    const orders = useSelector(state => state.orders);

    useEffect(()=>{
        dispatch(getOrders({userId: user.userId}));
    }, []);

    useEffect(()=>{
        if (orders.ordersLoaded){
            setActiveOrderProds([orders.orderedProducts[0]]);
            setLoader(false);
        }
    }, [orders])
    
    const activeOrder = (OrderId, index) => {
        const or = orders.orderedProducts.filter((order) => {
            return order.orderId === OrderId
        })
        console.log("🚀 ~ file: Orders.jsx:29 ~ or ~ or:", or)
        setActiveOrderProds(or);
        setActOrder(index);
    }

    return (
        <>
            <div className="flex flex-col items-center ">
                <h1 className='text-3xl font-semibold py-8 text-[#3215b5]'> Ordered Items </h1>
                {
                    orders?.orderedProducts?.length ? (
                        <div className='rounded-md 2xl:p-7 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:w-[1300px] xl:[600px]'>
                        
                        {/* orders history */}
                        <div className='flex flex-col'>
                            <div className='text-[18px] font-bold 2xl:hidden'> Orders History </div>
                            <div className="2xl:w-[350px] w-[900px] flex 2xl:flex-col flex-wrap sm:gap-[10px] bg-white 2xl:shadow-lg sm:shadow-md rounded-lg p-[18px]">
                                <div className='text-[18px] font-bold 2xl:flex sm:hidden'> Orders History </div>
                                
                                { orders?.orderedProducts?.map((order, index)=>{
                                    const orderedAmount =  Number((order.products.reduce((a, p)=>(a+(p.quantity*p.price)), 0)).toFixed(2));
                                    return (
                                        <div 
                                            key={index}
                                            className={ actOrder===index ? 'shadow-inner    cursor-pointer 2xl:w-[290px] sm:w-[270px] mt-[10px] mb-[10px] 2xl:mx-[10px] p-[10px] border-t-2 flex flex-row justify-between' 
                                                                         : 'hover:shadow-lg cursor-pointer 2xl:w-[290px] sm:w-[270px] mt-[10px] mb-[10px]              p-[10px] border-t-2 flex flex-row justify-between'}
                                            onClick={()=>activeOrder(order.orderId, index)}
                                        >
                                            <div className='flex flex-col gap-[2px]'>
                                                <div className={actOrder===index ? "text-[#f39221] text-[16px] font-black" : "text-[16px] font-black"}>
                                                    #{order.orderId}
                                                </div>
                                                <div className=" text-[15px] font-bold">
                                                    INR ₹{(orderedAmount).toLocaleString()}
                                                </div>
                                                <div className=' text-slate-500 text-[14px]'>
                                                    {order.products.length} Items
                                                </div>
                                            </div>
                                            <div className='flex flex-col justify-center items-end'>
                                                <div className='text-green-600 text-[14px]'>
                                                    Delivered
                                                </div>
                                                <div className='text-[14px]'>
                                                    {new Date(order.date).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* orders */}
                            <div className="shadow-lg w-[900px] rounded-lg 2xl:my-[0] sm:my-[40px]">{
                                activeOrderProds?.map((order, index)=>{
                                    const orderedAmount = order?.products.reduce((acc, item)=>(item.price*item.quantity + acc), 0);

                                    return (
                                        <div key={index}>
                                            <div className='flex flex-row gap-1 text-[24px] m-5 items-center'>
                                                <h1 className='font-extrabold'>Order #{order?.orderId} </h1>
                                                <span>({order?.products?.length})</span>
                                            </div>

                                            <div className='flex justify-between text-[18px] mx-5 mt-5 font-bold items-center'>
                                                <div><span className='font-normal'>Address: </span> {order?.address} </div>
                                                <div> {new Date(order?.date).toLocaleString()} </div>
                                            </div>

                                            <div className='flex justify-between text-[18px] ml-5 mb-5 font-bold items-center'>
                                                <div>
                                                    <span className='font-[400]'> Total Amount: </span>
                                                    <span> ₹{(Number(orderedAmount)).toLocaleString()} </span>
                                                </div>
                                            </div>

                                            {order?.products?.map((item, index)=>{
                                                return (
                                                    <div 
                                                        key={index} 
                                                        className='flex flex-row gap-2 justify-between ml-5 mr-5 pt-5 pb-5 border-t-2'
                                                    >
                                                        <div 
                                                            className='flex flex-row gap-5 cursor-pointer'
                                                            onClick={()=>{
                                                                navigate(`/product/${item?.productId}`);
                                                            }}
                                                        >
                                                            <section>
                                                                <img className='h-[150px] object-contain w-[150px]' src={item.image} alt={item.title} />
                                                            </section>

                                                            <section className="w-[300px] flex flex-col justify-between">
                                                                <div>
                                                                    <div className=" text-lg font-extrabold truncate w-[300px]">
                                                                        <span>{item.title}</span>
                                                                    </div>
                                                                    <div className=" w-[250px] h-[70px] overflow-hidden">
                                                                        <span>{item?.description}</span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex flex-row gap-[5px]">
                                                                        <span>{item?.quantity} {item?.quantity<2 ? "Item" : "Items"}</span>
                                                                        <span>&#9679;</span>
                                                                        <span className='font-bold'>
                                                                            ₹{(item?.price*item?.quantity)?.toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </section>
                                                        </div>
                                                        <div>
                                                            <section className="">
                                                                <span className='font-extrabold text-[20px]'>₹{(item?.price)?.toLocaleString()}</span>
                                                            </section>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })
                            }</div>
                        </div>
                    ) : (
                        <div className="flex item-center justify-center mdl:flex-row h-screen">
                            <div className="p-4 py-8 bg-white flex gap-4 flex-col h-[200px] w-[500px] items-center rounded-md shadow-lg">
                                <h1 className="font-titleFont text-xl font-semibold">
                                    No Orders places yet
                                </h1>
                                <NavLink to="/category">
                                    <button className="cursor-pointer shadow-slate-400 shadow-md px-8 py-2 font-titleFont font-semibold text-lg w-52 bg-[#4f49ff] text-white hover:bg-white hover:text-black hover:border-black hover:border-[1px] rounded-md duration-300">
                                        Start Shopping
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                    )
                }
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
    )
}

export default Orders