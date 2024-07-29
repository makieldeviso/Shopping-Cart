import { createContext, useContext, useEffect, useState, useRef } from "react"
import { NavLink } from "react-router-dom"

import { ShoppingContext } from "./App"

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
        <p>{item.title}</p>
        <p>{item.price}</p>

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

      </div>
    )
  })

  return (
    <div>
      {products}
    </div>
  )
}

const CheckOutBtn = function ({itemsForCheckout, checkoutAmount, handleCheckout}) {
  return (
    <div className='checkout-cont'>
      <p>Total: ${checkoutAmount}</p>
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
        totalAmount: checkoutAmount,
        timeStamp: (new Date()).valueOf()
      }
  ]

    console.log(forShipData.current)
  }

  return (
    <div>
      <NavLink to='/'>Home</NavLink>
      <h2>Cart</h2>
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
  )
}

export {Cart}