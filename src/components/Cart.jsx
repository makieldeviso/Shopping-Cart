import { createContext, useContext, useEffect, useState, useRef } from "react"
import { NavLink } from "react-router-dom"

import { amountFormat } from "../utilities/utilities";

import { ShoppingContext } from "./App"

const deliveryFee = 50;

const CartItems = function ({handleQuantityChange, handleAddForCheckout}) {
  const { cartData } = useContext(ShoppingContext);
  
  const products = cartData.current.map(item => {
    return (
      <div 
        key={item.id}
        className="cart-item"
      >
        <input type="checkbox" onChange={handleAddForCheckout} data-product = {item.id}/>
        <img src={item.image} alt={`${item.id} preview`} />
        <p className='cart-title'>{item.title}</p>
        <p className='cart-price'>{amountFormat(item.price)}</p>

        <div className='qty-controller'>
          <div className='qty-buttons'>
            <button 
              value = 'decrease' 
              disabled = { item.quantity <= 1 ? true : false }
              onClick = { handleQuantityChange }
              data-product = {item.id}
            >-</button>

            <p>{item.quantity}</p>

            <button 
              value='increase'
              onClick = { handleQuantityChange }
              data-product = {item.id}
            >+</button>
          </div>
        </div>

        <p className="item-total">{amountFormat(item.quantity * item.price)}</p>
      </div>
    )
  })

  return (
    <div className='cart-content'>
      {products}
    </div>
  )
}

const CheckOutBtn = function ({itemsForCheckout, checkoutAmount, handleCheckout}) {
  
  let deliveryCheck;
  let totalCheck;
  if (checkoutAmount === 0) {
    deliveryCheck = amountFormat(0);
    totalCheck = amountFormat(checkoutAmount);
  } else if (checkoutAmount < 300) {
    deliveryCheck = amountFormat(deliveryFee);
    totalCheck = amountFormat(checkoutAmount + deliveryFee);
  } else if (checkoutAmount >= 300) {
    deliveryCheck = 'Free'
    totalCheck = amountFormat(checkoutAmount);
  }

  return (
    <div className='checkout-cont'>
      <p><span>Subtotal:</span><span>{amountFormat(checkoutAmount)}</span></p>
      <p><span>Delivery:</span><span>{deliveryCheck}</span></p>
      <p className='cart-total'><span>Total:</span><span>{totalCheck}</span></p>
      <button 
        onClick = { handleCheckout } 
        disabled = {itemsForCheckout.length <= 0 ? true : false}
      >
        Checkout
      </button>
    </div>
  )
}


const Cart = function () {

  const { cartData, forShipData } = useContext(ShoppingContext);

  const [itemsForCheckout, setItemsForCheckout] = useState([]);
  const [checkoutAmount, setCheckoutAmount] = useState(0);

  const [dataChange, setDataChange] = useState(0);

  const handleQuantityChange = function (event) {
    const productId = Number(event.target.dataset.product);
    const itemTargetIndex = cartData.current.findIndex(item => item.id === productId);
    const itemIsForCheckout = itemsForCheckout.some(item => item.id === productId);

    if (event.target.value === 'increase') {
      cartData.current[itemTargetIndex].quantity ++ ;

    } else if (event.target.value === 'decrease') {
      cartData.current[itemTargetIndex].quantity -- ;
    }

    if (itemIsForCheckout) {
      const itemIndex = itemsForCheckout.findIndex(item => item.id === productId);
      const modifiedCheckOutArray = itemsForCheckout.toSpliced(itemIndex, 1, cartData.current[itemTargetIndex]);
      
      const amount = modifiedCheckOutArray.reduce((acc, curr) => {
        return ((acc) + (curr.price * curr.quantity))
      }, 0);

      setItemsForCheckout(i => i = modifiedCheckOutArray);
      setCheckoutAmount(a => a = amount);
    }
    
    setDataChange(d => d + 1);
  }

  const handleAddForCheckout = function (event) {
    const productId = Number(event.target.dataset.product)
    const checkoutItem = cartData.current.find(item => item.id === productId);
    
    let newItemsForCheckout = [];
    if (event.target.checked) {
      newItemsForCheckout = [...itemsForCheckout, checkoutItem];

    } else {
      const removeItemIndex = itemsForCheckout.findIndex(item => item.id === productId);
      const itemRemovedArray = itemsForCheckout.toSpliced(removeItemIndex, 1);
      newItemsForCheckout = itemRemovedArray;
    }

    const amount = newItemsForCheckout.reduce((acc, curr) => {
      return ((acc) + (curr.price * curr.quantity))
    }, 0);
    
    // Update item checkout and total amount
    setItemsForCheckout(i => i = newItemsForCheckout);
    setCheckoutAmount(a => a = amount);
  }

  const handleCheckout = function () {
    if (itemsForCheckout.length === 0) return

    forShipData.current = [...forShipData.current, 
      {
        items: itemsForCheckout,
        subAmount: checkoutAmount,
        delivery: checkoutAmount > 300 ? 0 : deliveryFee,
        totalAmount: checkoutAmount + this.delivery,
        timeStamp: (new Date()).valueOf()
      }
  ]

    console.log(forShipData.current)
  }

  return (
    <div className='cart-page'>
      {/* <NavLink to='/'>Home</NavLink> */}
      <h2>Your Cart</h2>

      <div className="cart-display">
        <CartItems 
          handleQuantityChange = { handleQuantityChange }
          handleAddForCheckout = { handleAddForCheckout }
        />
        <CheckOutBtn 
          itemsForCheckout = { itemsForCheckout }
          checkoutAmount = { checkoutAmount }
          handleCheckout = { handleCheckout } 
        />
      </div>
      
    </div>
  )
}

export {Cart}