import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getToCart } from "../../redux/Slices/shoppingSlice";
import axios from 'axios';
import { prod_api } from '../../redux/api';
import { Grid } from 'react-loader-spinner';


const SelectedCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const user = useSelector(state => state.user.user);
  const [loader, setLoader] = useState(true);
  
  const [AddedToCart, setAddedToCart] = useState([false, ""]);
  const [categoryName, setCategoryName] = useState("")

  const [products, setProducts] = useState([]);
  
  const auth = useSelector(state => state.auth);
  const shopping = useSelector(state => state.shopping);

// fetch products from the selected category
  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const response = await axios.get(
          `${prod_api}`,
          {
            headers: {
              authorization: auth.accessToken,
            }
          }
        );
        setLoader(false);
        const filteredProducts = response.data.data?.filter(product => {
          if (product?.category?.id === Number(categoryId)){
            setCategoryName(product?.category.name);
          }
          return product?.category.id === Number(categoryId)
        });

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching category products:', error);
      }
    }
    fetchCategoryProducts();
  }, [categoryId]);

  const itemAdded = () => {
    setAddedToCart([true, shopping.addCartStatus]);
    setTimeout(()=>{
      setAddedToCart([false, ""])
    }, 800)
  }

  const handleAddToCart = async (item) => {
    try {
      await dispatch(addToCart(item));
      await dispatch(getToCart({userId: user.userId}));
    } catch (error) {
      // Handle error if needed
      console.error('Error adding to cart:', error);
    }
  };


  return (
    <Fragment>
      <div className='py-8 pt-16'>
        <div className='text-left mx-10 mb-2'>
          <h1 className='text-3xl font-medium'>
            <span className='text-3xl font-semibold py-8 text-[#3215b5]'>Department: </span>
            {categoryName}
          </h1>
        </div>

        <div className='flex flex-wrap justify-center'>
          { 
            products?.map(product => {
              return (
                <div key={product?.id} className='w-72 m-6 p-5 rounded-lg shadow-lg cursor-pointer'>
                  <div
                   onClick={()=>{
                    navigate(`/product/${product?.id}`);
                  }}
                  >
                    <div>
                      <img src={product?.image} alt={product?.title} className='h-72 w-72 object-contain rounded-lg shadow-lg' />
                    </div>
                    <div className='py-4'>
                      <section>
                        <p className='truncate text-lg font-medium' title={product?.title}>{product?.title}</p>
                      </section>
                      <section>
                        <span className=' font-medium'>Price:</span> 
                        <span className='font-bold'>
                          ₹{(product?.price).toLocaleString()}
                        </span>
                      </section>
                      <section className='flex flex-row gap-1'>
                        <p className='text-md'>Description:</p> 
                        <p className='truncate'  title={product?.description}>{product?.description}</p>
                      </section>
                    </div>
                  </div>

                  <div>
                    <button
                        onClick={() =>{
                          handleAddToCart({ userId: user.userId , productId: product?.id , quantity: 1})
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
                        className='bg-[#4f49ff] text-white px-4 py-2 rounded-md hover:bg-[#f39e3a] hover:text-white'>
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })
          }
        </div>

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
  );
};

export default SelectedCategory;