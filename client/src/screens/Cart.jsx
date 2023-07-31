import React from 'react'
import "./Cart.css"
import { Rating } from '@mui/material';
import { useCart, useCartDispatch } from '../components/ContextReducer';
import Navbar from "../components/Navbar"
import Futer from "../components/Futer"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';


const Cart = () => {
  let navigate = useNavigate();
  let data = useCart();
  let dispatch = useCartDispatch();
  if (data.length === 0) {
    return (
      <div className='top_nav'>
        <Navbar />
        <Link className="nav-link active  my-my-order text-center mt-5" aria-current="page" to="/myorder" >
            <h1><button className='btn btn-danger p-3 fs-1' > My Order</button></h1>
        </Link>  
        <div className='cartdiv text-center mt-5 fs-1'>
          <h1>The Cart is Empty !😞</h1> 
          <h1>Placed Your Order Now Get Extra Discount</h1>
        </div>
      </div>
    )
  }
  const handleChechOut = async () => {
    let time = new Date();
    let newtime = time.getHours() + ":" + time.getMinutes() + ":" + time.getFullYear();
    let userEmail = localStorage.getItem("userEmail");
    console.log(userEmail);
    let response = await fetch("http://localhost:8800/orderData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userEmail,
        order_data: data ,
        order_date: new Date().toDateString(),
        order_time: newtime
      })
    });
    console.log("response response ", response);
    if (response.status === 200) {
      dispatch({ type: "DROP" })
      navigate("/myorder");
      toast.success("Order Placed Successfully 👌", {
        position:"top-center" ,  
       })
      
    }
  }


  let totalPrice = data.reduce((total, food) => total + food.price, 0)
  return (
    <div>
     
      <Navbar />
      <div className='cart_section '>
        <img src="https://jmr-prod-01.s3.amazonaws.com/Butter%20Chicken%20web%20banner.jpg" alt="food img" />
        <div className='cart_section_main main-main'>

          {data.map((food, index) => {

            return (
              <div className='cart_main'>
                {/* <p>{index +1}</p> */}
                <div className='cart_main_left'>
                  <img src={food.img} alt="food image" />
                </div>
                <div className='cart_main_right'>
                  <h1>{food.name}</h1>
                  <h3>
                    <Rating name="half-rating" defaultValue={3.7} precision={2.8} />
                  </h3>
                  <h3 className='mt-4'> Quantity : {food.qunt}</h3>
                  <h4 className='mt-2'>Size : {food.size}</h4>
                  <h4 className='mt-2'>MRP : {food.price} &#8377;</h4>
                  <div className='cart_right_right'>
                    <h3>
                      <i class="fa-solid fa-trash " onClick={() => dispatch({ type: "REMOVE", index: index })}></i>
                      <span className='align' ><button className='btn btn-danger mt-5' onClick={handleChechOut} >Order Now</button></span>
                      
                    </h3>
                  </div>

                </div>
              </div>
            )

          })
          }
          <div className='cart_main_bottom'>
            <h1> Total Price {totalPrice}/-</h1>
            <button className='btn btn-danger mt-5' onClick={handleChechOut}> Place Order
            </button>
          </div>
        </div>
        <Futer />

      </div>
      <ToastContainer/>
    </div>
  )
}

export default Cart
