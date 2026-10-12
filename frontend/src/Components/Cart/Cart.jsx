import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { clearCartItem } from "../../redux/Slices/shoppingSlice";
import ItemCard from "./ItemCard";
import { createOrders, getOrders } from "../../redux/Slices/orderSlice";
import { Grid } from 'react-loader-spinner';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.shopping.products);
  const user = useSelector(state=>state.user.user);

  const [totalAmt, setTotalAmt] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [userInfo, setUserInfo] = useState({
    userId: null,
    firstName: null,
    lastName: null,
    email: null,
    contactNo: null,
    address: null
  })
  const [showForm, setShowForm] = useState(false);
  const [orderProducts, SetOrderProducts]=useState([]);
  const [loader, setLoader] = useState(true);

  const toggleModal = (e) => {
    e.preventDefault();
    setShowForm(!showForm);
  }

  useEffect(() => {
    setUserInfo({
      ...userInfo,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.userId,
      contactNo: user.contactNo
    })
  }, [user.userLoaded]);
  
  useEffect(() => {
    let price = 0;
    products?.map((item) => {
      price += item?.price * item?.quantity;
      return price;
    });
    setTotalAmt(price);
    
    const data = products?.map(item => {
      return ({
        productId: item.productId,
        quantity: item.quantity
      })
    })
    SetOrderProducts(data);
    setLoader(false);
  }, [products]);

  useEffect(() => {
    if (totalAmt <= 200) {
      setShippingCharge(30);
    } else if (totalAmt <= 400) {
      setShippingCharge(25);
    } else if (totalAmt > 401) {
      setShippingCharge(20);
    }
  }, [totalAmt]);

  function handleChange(e){
    e.preventDefault()
    setUserInfo((prev)=>({...prev , [e.target.name]:e.target.value}))
  }

  const handleOnSubmitOrder = async (event) => {
    event.preventDefault();
    setShowForm(!showForm);

    await dispatch(createOrders({
      userId: userInfo.userId,
      address: userInfo.address,
      contactNo: userInfo.contactNo,
      products: orderProducts
    }));

    dispatch(getOrders({userId: user.userId}));
    dispatch(clearCartItem());
    navigate("/orders");
  };

  function validateInput(event) {
    const input = event.target.value;
    event.target.value = input.replace(/\D/g, '');
  }


  return (
    <>
      <div className= {products.length > 3 ? "w-[700px] 2xl:w-[1500px] mx-60 px-4" : "w-[700px] 2xl:w-[1500px] h-screen mx-60 px-4" }>
        <div className="w-full py-10 xl:py-10 flex flex-col gap-3">
          <h1 className="text-5xl text-primeColor font-titleFont font-bold">
            Cart
          </h1>
        </div>
        {products.length > 0 ? (
          <>
            <div className="w-full pb-20  2xl:flex  2xl:flex-row  2xl:gap-36">
              <div className="w-[600px] mt-5 flex flex-col gap-[15px]">
                {
                  products.map((item, index) => (
                    <div key={index}>
                      <ItemCard item={item} />
                    </div>
                  )) 
                }
              </div>
              <div className="w-[350px] 2xl:sticky 2xl:right-[20%] gap-4 flex mt-4">
                <div className="w-full flex flex-col gap-4">
                  <h1 className="text-2xl font-semibold text-center">Cart totals</h1>
                  <div>
                    <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                      Subtotal
                      <span className="font-semibold tracking-wide font-titleFont">
                        ₹{(totalAmt).toLocaleString()}
                      </span>
                    </p>
                    <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                      Shipping Charge
                      <span className="font-semibold tracking-wide font-titleFont">
                        ₹{shippingCharge}
                      </span>
                    </p>
                    <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                      Total
                      <span className="font-bold tracking-wide text-lg font-titleFont">
                        ₹{(totalAmt + shippingCharge).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <a href="#modale">
                      <button onClick={toggleModal} className="w-52 h-10 bg-[#4f49ff] text-white hover:bg-white hover:text-black hover:border-black hover:border-[1px] rounded-md duration-300">
                        Proceed to Checkout
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* ----------------------------  Order Modale */}
            {showForm && (
              <>
                <div className="h-screen w-screen fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-8 backdrop-blur-sm overflow-hidden"></div>
                <div id="modale" className="fixed translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%] items-center justify-center w-auto h-auto z-10 bg-white rounded-md shadow-lg p-4">
                  
                  <div className="py-5 px-6 text-xl flex items-center flex-row justify-between">
                    <h2>Address Details</h2>
                    <div 
                      onClick={toggleModal} 
                      className="cursor-pointer border-2 rounded-full p-[2px] w-[35px] h-[35px] text-center"
                    >
                      X
                    </div>
                  </div>
                  <form
                    onSubmit = {handleOnSubmitOrder}
                    className="w-[450px] h-auto px-5 py-6 flex flex-col justify-center items-center gap-4 "
                  >
                    <input disabled className="w-full cursor-not-allowed px-2 py-1 rounded-md bg-slate-200" name="firstName" id="firstName" value={userInfo.firstName} onChange={handleChange} type="text" placeholder="First Name" />
                    <input disabled className="w-full cursor-not-allowed px-2 py-1 rounded-md bg-slate-200" name="lastName" id="lastName"  value={userInfo.lastName} onChange={handleChange} type="text" placeholder="Last Name" />
                    <input disabled className="w-full cursor-not-allowed px-2 py-1 rounded-md bg-slate-200"  name="email" id="email" value={userInfo.email} onChange={handleChange} type ="email" placeholder="Email" />
                    <input required className="w-full px-2 py-1 rounded-md bg-slate-200" minLength={10} maxLength={10} onInput={validateInput} name="contactNo" id="contactNo" value={userInfo.contactNo} onChange={handleChange} type="tel" placeholder="Contact Number" />
                    <textarea required className="w-full px-2 py-1 rounded-md bg-slate-200" name="address" id="address" value={userInfo.address} onChange={handleChange} placeholder="Address" />
                    <button 
                      className="w-32 h-8 bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black duration-200 rounded-md"
                      type="submit"
                    >
                      Place Order
                    </button>
                  </form>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col mdl:flex-row gap-4 pb-20 h-[417px]">
            <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
              <h1 className="font-titleFont text-xl font-bold uppercase">
                Your Cart feels lonely.
              </h1>
              <p className="text-sm text-center px-10 -mt-2">
                Your Shopping cart lives to serve. Give it purpose - fill it with
                books, electronics, videos, etc. and make it happy.
              </p>
              <NavLink to="/category">
                <button className="cursor-pointer px-8 py-2 font-titleFont font-semibold text-lg duration-300 bg-[#4f49ff] text-white hover:bg-white hover:text-black hover:border-black hover:border-[1px] rounded-md">
                  Continue Shopping
                </button>
              </NavLink>
            </div>
          </div>
        )}
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
};

export default Cart;
