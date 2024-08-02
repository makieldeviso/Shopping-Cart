import { createContext, useContext, useEffect, useState, useRef } from "react"
import { NavLink } from "react-router-dom"

import { amountFormat } from "../utilities/utilities";

import { ShoppingContext } from "./App"
import { NewIcon } from "./Icons";

const deliveryFee = 50;

const CartItems = function ({handleQuantityChange, handleAddForCheckout, handleRemoveItemFromCart}) {
  const { cartData } = useContext(ShoppingContext);
  
  const products = cartData.current.map(item => {
    return (
      <div 
        key={item.id}
        className="cart-item"
      >
        <div className="cart-action">

          <input
            className="add-checkbox"
            type = "checkbox" 
            onChange = {handleAddForCheckout} 
            data-product = {item.id}
            title = 'Ready item for checkout'
          />
    
          <button 
            onClick = {handleRemoveItemFromCart}
            className="cart-remove" 
            aria-label="Remove item from your cart"
            data-product = {item.id}
            title = 'Remove item from your cart'
          >{<NewIcon assignClass={'delete'}/>}
          </button>
        </div>

       
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

const CheckOutCounter = function ({itemsForCheckout, checkoutAmount, handleCheckout}) {

  

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

  const Mailing = function () {
    return (
      <div className='mailing-details'>

      </div>
    )
  }


  return (
    <div className='checkout-cont'>
      <p><span>Subtotal:</span><span className="cart-amount">{amountFormat(checkoutAmount)}</span></p>
      <p><span>Delivery:</span><span className="cart-amount">{deliveryCheck}</span></p>
      <p className='cart-total'><span>Total:</span><span className="cart-amount">{totalCheck}</span></p>
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

  // Update checkout amount whenever itemsForCheckout is changed
  useEffect(() => {
    const amount = itemsForCheckout.reduce((acc, curr) => {
      return ((acc) + (curr.price * curr.quantity))
    }, 0);

    setCheckoutAmount(amount);
  }, [itemsForCheckout])

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
      
      setItemsForCheckout(i => i = modifiedCheckOutArray);
    }
    
    setDataChange(d => d + 1);
  }

  // Add/ ready item for checkout
  const handleAddForCheckout = function (event) {
    const productId = Number(event.target.dataset.product);
    const checkoutItem = cartData.current.find(item => item.id === productId);
    
    let newItemsForCheckout = [];
    if (event.target.checked) {
      newItemsForCheckout = [...itemsForCheckout, checkoutItem];

    } else {
      const removeItemIndex = itemsForCheckout.findIndex(item => item.id === productId);
      const itemRemovedArray = itemsForCheckout.toSpliced(removeItemIndex, 1);
      newItemsForCheckout = itemRemovedArray;
    }

    setItemsForCheckout(i => i = newItemsForCheckout);
  }

  // Remove item from yoy cart
  const handleRemoveItemFromCart = function (event) {
    const productId = Number(event.target.dataset.product);
    const forRemovalIndex = cartData.current.findIndex(item => item.id === productId);

    // Update cart data
    cartData.current.splice(forRemovalIndex, 1);

    // If item for removal is currently readied for checkout, update itemsForCheckout
    const itemIsForCheckout = itemsForCheckout.some(item => item.id === productId);
    if (itemIsForCheckout) {
      const removeItemCheckoutIndex = itemsForCheckout.findIndex(item => item.id === productId);
      const newCheckoutItems = itemsForCheckout.toSpliced(removeItemCheckoutIndex, 1);
      setItemsForCheckout(newCheckoutItems);
    }
  }

  // Checkout readied items
  const handleCheckout = function () {
    if (itemsForCheckout.length === 0) return

    // Calculate eligibility for free delivery
    const delivery = checkoutAmount > 300 ? 0 : deliveryFee;

    // Update forShipData context -> forShipDataRef
    forShipData.current = [...forShipData.current, 
      {
        items: itemsForCheckout,
        subAmount: checkoutAmount,
        delivery: delivery,
        totalAmount: checkoutAmount + delivery,
        timeStamp: (new Date()).valueOf()
      }
    ]

    // Remove checkout items from cart
    itemsForCheckout.forEach(item => {
      const itemIndex = cartData.current.findIndex(product => product.id === item.id);
      cartData.current.splice(itemIndex, 1)
    })

    // Empty items for checkout upon successful checkout
    setItemsForCheckout(i => i = []);

    console.log(cartData.current);
  }

  return (
    <div className='cart-page'>
     
      <h2>Your Cart</h2>

      <div className="cart-display">
        <CartItems 
          handleQuantityChange = { handleQuantityChange }
          handleAddForCheckout = { handleAddForCheckout }
          handleRemoveItemFromCart = { handleRemoveItemFromCart }
        />
        <CheckOutCounter 
          itemsForCheckout = { itemsForCheckout }
          checkoutAmount = { checkoutAmount }
          handleCheckout = { handleCheckout } 
        />
      </div>
      
    </div>
  )
}

export {Cart}