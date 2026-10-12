import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails, userDetails } from "../redux/Slices/userSlice";

export default function Profile() {
  const user = useSelector(state=>state.user.user);
  // const auth = useSelector(state=>state.auth);
  const [enableEdit, setEnableEdit] = useState(true)
  const [userInfo, setUserInfo] = useState({});
  const [alert, setAlert] = useState("");
  
  const [allFormData, setAllFormData] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      await setUserInfo(user);
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
  }, [allFormData])
  

  function handleChange(e){
    e.preventDefault()
    let name = e.target.name
    let value = e.target.value
    setUserInfo((prev)=>({...prev , [name]:value}))
  }
  
  function validateInput(event) {
    const input = event.target.value;
    event.target.value = input.replace(/\D/g, '');
  }

  const handleOnSubmitOrder = async (event) => {
    event.preventDefault();
    if (userInfo.contactNo.length !== 10){
      setAlert("Enter the 10 digit valid mobile number.");
    } else if( userInfo.firstName.length === 0 || userInfo.lastName.length === 0 ) {
      setAlert("Enter the valid name.");
    } else {
      setAlert("");
      await dispatch(updateUserDetails(userInfo));
      await dispatch(userDetails());
      setEnableEdit(!enableEdit);
    }
  };
  
  return (
    <div className="m-14 h-[70vh]">
      <div className="flex h-[550px] max-w-4xl m-auto rounded-2xl shadow-2xl">
        <div className="bg-[#4f49ff] rounded-2xl basis-1/3 pt-8">
          <div className="h-[200px] rounded-full max-w-[200px] m-auto bg-contain bg-no-repeat bg-[url('https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg')]" />
        </div>
        <div className=" bg-white basis-2/3 pt-12 rounded-r-2xl">
          <div className="w-[360px] text-4xl max-w-md m-auto">
            <h1 className="font-bold"> User Profile </h1>
            <form>
              <div className="grid grid-row gap-5 mt-5 ">
                <div className="flex flex-col gap-[6px]">
                  <label className="block text-sm font-bold" for="username" > First Name </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    onChange={handleChange}
                    value={userInfo?.firstName}
                    disabled={enableEdit}
                    required
                    className="shadow p-2 appearance-none border rounded-[4px] w-full text-sm"
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="block text-sm font-bold" for="username" > Last Name </label>
                  <input
                    required
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    onChange={handleChange}
                    value={userInfo?.lastName}
                    disabled={enableEdit}
                    className="shadow appearance-none p-2 border rounded-[4px] w-full text-sm"
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="block text-sm font-bold" for="username" > Phone No </label>
                  <input
                    type="tel"
                    id="contactNo"
                    placeholder="123-45-678"
                    name="contactNo"
                    minLength={10}
                    maxLength={10}
                    onChange={handleChange}
                    value={userInfo?.contactNo}
                    disabled={enableEdit}
                    onInput={validateInput}
                    className="shadow appearance-none p-2 border rounded-[4px] w-full text-sm"
                    pattern="[0-9]{10}" 
                    required
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="block text-sm font-bold" for="email" > Email Address </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={userInfo?.email}
                    className="shadow appearance-none border p-2 rounded-[4px] cursor-not-allowed w-full text-sm"
                    disabled
                  />
                </div>
              </div>
              <div className="text-red-500 text-[17px] item-center">
                {
                  alert==="" ? null : alert
                }
              </div>
              <div className="mt-5 h-[30px] flex justify-end  gap-4">
                <button 
                  className="bg-[#4f49ff] flex items-center justify-center text-white w-[100px] h-[30px] text-[15px] rounded-md p-[5px] active:bg-[#f39221]"
                  onClick={()=>setEnableEdit(!enableEdit)}
                  type="button"
                >
                  Edit 
                </button>
                <button 
                  className={(!enableEdit)?"bg-[#4f49ff] flex items-center justify-center text-white w-[100px] h-[30px] text-[15px] rounded-md p-[5px] active:bg-[#f39221]": "cursor-not-allowed bg-[#4f49ff] flex items-center justify-center text-white w-[100px] h-[30px] text-[15px] rounded-md p-[5px] active:bg-[#f39221]"}
                  onClick={(event)=>handleOnSubmitOrder(event)}
                  type="submit"
                  disabled={enableEdit}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
