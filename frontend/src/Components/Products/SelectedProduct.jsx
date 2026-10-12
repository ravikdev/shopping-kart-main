import React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { addToCart, getToCart } from '../../redux/Slices/shoppingSlice';
import axios from 'axios';
import { prod_api } from '../../redux/api';
import { Grid } from 'react-loader-spinner';

const SelectedProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [AddedToCart, setAddedToCart] = useState([false, ""]);
  const [loader, setLoader] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(state=>state.auth);
  const user = useSelector(state=>state.user.user);
  const shopping = useSelector(state=>state.shopping);
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        // const response = await fetch('https://api.escuelajs.co/api/v1/products');
        const response = await axios.get(`${prod_api}`, {          
          headers: {
            authorization: auth.accessToken,
          }
        });
        setLoader(false);
        
        const data = response.data.data;
        const oneProduct = data.filter(product => product.id == productId);
        const related = data.filter(product => product.category.name == oneProduct[0].category.name);
        const shuffledRelated = related.sort(() => Math.random() - 0.5);
        const randomFive = shuffledRelated.slice(0, 4);

        setRelatedProduct(randomFive);
        setProduct(oneProduct);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProduct();
  }, [productId]);
  
  const handleAddToCart = async (item) => {
    try {
      await dispatch(addToCart(item));
      await dispatch(getToCart({userId: user.userId}));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  const itemAdded = () => {
    setAddedToCart([true, shopping.addCartStatus]);
    setTimeout(()=>{
      setAddedToCart([false, ""])
    }, 800)
  }

  return (
    <Fragment>
      <div className='pt-16'>
        <div key={product[0]?.id} className='flex flex-wrap justify-center align-middle pl-10 rounded-lg shadow-xl p-10 m-10'>
          <div className='h-1/4 w-1/4 md:shrink-0'>
            <img src={product[0]?.image} className='object-contain' alt={product[0]?.title} />
          </div>

          <div className='text-left m-10'>
            <div className=''>
              <p className='text-base mb-2'>Category: {product[0]?.category.name}</p>
              <h1 className='text-xl font-medium mb-2.5 max-w-2xl'>Product Name: {product[0]?.title}</h1>
              <p className='text-2xl font-medium mb-3'>
                <span className='text-[20px]'>Price: </span>
                <span className='font-bold'>₹{(product[0]?.price)?.toLocaleString()}</span>
              </p>
              <p className='text-base max-w-2xl mb-6'>Description: {product[0]?.description}</p>
            </div>
            <button 
              onClick={() =>{
                handleAddToCart({ userId: user.userId , productId: product[0]?.id , quantity: 1});
                itemAdded();
                // dispatch(
                //   addToCart({
                //     _id: product[0]?.id,
                //     name: product[0]?.title,
                //     image: product[0]?.image,
                //     price: product[0]?.price,
                //     quantity: 1
                //   })
                // )
              }}
              className='bg-[#4f49ff] text-white px-4 py-2 rounded-md hover:bg-[#f39e3a] hover:text-white'
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className='pt-16'>
          <h1 className='text-3xl font-medium pl-10 text-[#3215b5]'>Related Items </h1>

          <div className='flex flex-wrap justify-center'>
            {
              relatedProduct?.map(product => {
                return (
                  <div key={product?.id} className='w-72 m-6 p-5 rounded-lg shadow-lg cursor-pointer' >
                    <div
                      onClick={()=>{
                        navigate(`/product/${product?.id}`);
                      }}
                    >
                      <div>
                        <img src={product?.image} alt={product?.title} className='h-72 w-72 object-contain rounded-lg shadow-lg' />
                      </div>
                      <div className='py-4'>
                        <p>
                          <span className='text-lg font-medium'>Name:</span> {product?.title}
                        </p>
                        <p>
                          <span className='text-md'>Price:</span>
                          <span className='font-medium'>₹{(String(product?.price)).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <button 
                        className='bg-[#4f49ff] text-white px-4 py-2 rounded-md hover:bg-[#f39e3a] hover:text-white'
                        onClick={() =>{
                          handleAddToCart({ userId: user.userId , productId: product?.id , quantity: 1});
                          itemAdded();
                          // dispatch(
                          //   addToCart({
                          //     _id: product?.id,
                          //     name: product?.title,
                          //     image: product?.image,
                          //     price: (product?.price).toLocaleString(),
                          //     quantity: 1
                          //   })
                          // )
                        }}
                      >
                        Add to cart
                      </button>
                      
                      {
                        AddedToCart[0] && (
                          <>
                            {(AddedToCart[1] === "succeded") && (
                              <div className='p-2 fixed right-[30px] top-[80px] text-stone-50 bg-[#4f49ff] border border-solid rounded'>
                                  Item added successfully!!
                              </div>)}
                            {AddedToCart[1] === "failed" && (
                              <div className='p-2 fixed right-[30px] top-[80px] text-stone-50 bg-[#ff3434] border border-solid rounded'>
                                Something went wrong pls try again!!
                              </div>
                            )}
                          </>
                        )
                      }
                    </div>
                    
                  </div>
                );
              })}
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
    </Fragment>
  )
}

export default SelectedProduct