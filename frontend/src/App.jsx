import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import Layout from './Components/Layout';
import { useEffect } from 'react';
import { getToCart } from './redux/Slices/shoppingSlice';
import { generateToken, logoutUser } from './redux/Slices/authSlice';
import { userDetails } from './redux/Slices/userSlice';

function App() {
  const auth = useSelector(state=>state.auth);
  const dispatch = useDispatch();
  const user = useSelector(state=>state.user.user);

  useEffect(()=>{
    if(auth.userLoaded){
      dispatch(getToCart({userId: user?.userId}));
      dispatch(generateToken(auth.refreshToken));
      dispatch(userDetails());
    }

    if(!auth.genToken){
      setInterval( async () => {
        localStorage.clear();
        dispatch(logoutUser());
      }, 1800000);
    }
    
  }, []);
  
  return (
    <div className='min-h-screen font-sans'>
      <Layout/>
    </div>
  )
}

export default App
