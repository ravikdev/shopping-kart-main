import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  getToCart,
  updateCartItem,
} from "../../redux/Slices/shoppingSlice";

const ItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const user = useSelector(state=>state.user.user);
  
  const handleUpdateCartItem = async (item) => {
    try {
      await dispatch(updateCartItem(item));
      await dispatch(getToCart({userId: user.userId}));
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleDeleteCartItem = async (item) => {
    try {
      await dispatch(deleteCartItem(item));
      await dispatch(getToCart({userId: user.userId}));
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };


  return (
    <div className="w-full grid grid-cols-5 border py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-10">
        <ImCross
          onClick={() => {
            handleDeleteCartItem({userId: user.userId, productId: item.productId});
            // dispatch(deleteItem(item._id))
          }}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer ml-4"
        />
        <img className="w-32 object-contain h-32" src={item.image} alt="productImage" />
        <h1 className="font-titleFont font-semibold">{item.name}</h1>
      <div className="col-span-5 mdl:col-span-3 flex flex-col items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-4 mdl:gap-0">
        <div className="flex flex-row gap-8 text-center">
            <div className="flex flex-col gap-2">
              <div>Price</div>
              <div className="text-lg font-semibold"> ₹{(item?.price).toLocaleString()} </div>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <div>Quantity</div>
              <div className="text-lg font-semibold">
                <div className="flex items-center gap-5">
                  <span
                    onClick={() => {
                      handleUpdateCartItem({ userId: user.userId, productId: item.productId, quantity: item.quantity-1 })
                      // dispatch(drecreaseQuantity({ _id: item._id }))
                    }}
                    className="w-5 h-5 rounded text-center bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
                  >
                    -
                  </span>
                  <p>{item.quantity}</p>
                  <span
                    onClick={() => {
                      handleUpdateCartItem({ userId: user.userId, productId: item.productId, quantity: item.quantity+1 })
                      // dispatch(increaseQuantity({ _id: item._id }))
                    }}
                    className="w-5 h-5 rounded text-center bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
                  > 
                    +
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div><p>Sub-Total</p></div>
              <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
                <p>₹{(item.quantity * item.price).toLocaleString()}</p>
              </div>
            </div>
        </div>
      </div>
      
      </div>

    </div>
  );
};

export default ItemCard;
