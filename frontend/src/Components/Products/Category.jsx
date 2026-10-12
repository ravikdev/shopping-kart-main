import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { prod_api } from '../../redux/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Grid } from 'react-loader-spinner';

const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    }
    const auth = useSelector(state => state.auth);
    const [loader, setLoader] = useState(true);
    
    useEffect(() => {
        async function fetchCategories() {
          try {
            const response = await axios.get(`${prod_api}/all-categories`, {
                headers: {
                    authorization: `${auth.accessToken}`,
                },
            });
            setLoader(false);
            setCategories(response.data.data)
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }

        fetchCategories();
      }, []);

    return (
        <>
            <div>
                <div className='py-16'>
                    <div className='text-center'>
                        <h2 className='text-4xl font-semibold py-8 text-[#3215b5]'>Departments</h2>
                        
                    </div>
                    <div className='flex flex-wrap justify-center text-center gap-8'>
                        {
                            categories.length > 0 && categories.map( cat => {
                                return (
                                    <div 
                                        key={cat.id} 
                                        className='p-4 cursor-pointer hover:scale-105 transition duration-500'
                                        onClick={() => handleCategoryClick(cat.id)}
                                    >
                                        <img src={cat.image} alt={cat.name} className='object-contain h-[260px] w-[260px] rounded-lg shadow-lg ' />
                                        <p className='text-2xl font-medium pt-5'>{cat.name}</p>
                                    </div>
                                );
                            })
                        }
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
    )
}

export default Category