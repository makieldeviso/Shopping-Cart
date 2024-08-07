import { createContext, useContext, useEffect, useState, useRef } from "react"
import { NavLink, useLoaderData } from "react-router-dom"

import { amountFormat } from "../utilities/utilities";

import { ShoppingContext } from "./App"
import { NewIcon } from "./Icons";

import { addCheckoutItems, addToCartData, changeCartItemQuantity, getProfileData } from "../utilities/DataFetch";

const deliveryFee = 50;
const freeDeliveryMin = 300;

const CartItems = function ({cartData, handleQuantityChange, handleAddForCheckout, handleRemoveItemFromCart}) {
  
  const products = cartData.map(item => {

    const isOnSale = item.isOnSale === '1';

    return (
      <div 
        key={item.gameID}
        className="cart container"
      >

        <input
          className="cart add-checkbox"
          type = "checkbox" 
          onChange = {handleAddForCheckout} 
          data-productid = {item.gameID}
          title = 'Ready item for checkout'
        />

        <button 
          onClick = {handleRemoveItemFromCart}
          className="cart remove-btn" 
          aria-label="Remove item from your cart"
          data-productid = {item.gameID}
          title = 'Remove item from your cart'
          >{<NewIcon assignClass={'delete'}/>}
        </button>
 
        <img src={item.header} alt={`${item.gameID} preview`} className="cart preview" />
        <p className='cart title'>{item.title}</p>

        <div className={`cart prices ${isOnSale ? 'sale' : ''}`}>
          <p className='disc-price'>{amountFormat(item.salePrice)}</p>
          {isOnSale && <p className='normal-price'>{amountFormat(item.normalPrice)}</p>}
          {isOnSale && <p className='discount'>{`-${Number.parseFloat(item.savings).toPrecision(2)}%`}</p>}
        </div>

        <div className='cart qty-controller'>
          <div className='qty-buttons'>
            <button 
              value = 'decrease' 
              disabled = { item.quantity <= 1 ? true : false }
              onClick = { handleQuantityChange }
              data-productid = {item.gameID}
            >-</button>

            <p>{item.quantity}</p>

            <button 
              value='increase'
              onClick = { handleQuantityChange }
              data-productid = {item.gameID}
            >+</button>
          </div>
        </div>

        <p className="cart item-total">{amountFormat(item.quantity * item.salePrice)}</p>
      </div>
    )
  })

  return (
    <div className='cart-content'>
      {products}
    </div>
  )
}

const CheckOutCounter = function ({profileData, itemsForCheckout, checkoutAmount, handleCheckout}) {
  const mailingRef = useRef({ name: profileData.name, phone: profileData.phone, address: profileData.address});
  const checkoutBtnRef = useRef(null);

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

    const [name,  setName] = useState(mailingRef.current.name);
    const [phone,  setPhone] = useState(mailingRef.current.phone);
    const [address,  setAddress] = useState(mailingRef.current.address);

    useEffect(() => {
      mailingRef.current = {name, phone, address};

      if (name.length === 0 || phone.length === 0 || address.length === 0 || itemsForCheckout.length === 0) {
        checkoutBtnRef.current.disabled = true; 
      } else if (checkoutBtnRef.current.disabled && (name.length > 0 || phone.length > 0 || address.length > 0)) {
        checkoutBtnRef.current.disabled = false;
      }

    }, [name, phone, address])

    return (
      <div className='mailing-container'>
        <p>
          <NewIcon assignClass={'location'}/>
        </p>
        <div className="mailing input-field">
          <label htmlFor="mail-name">Name:</label>
          <input
            required
            placeholder={name.length === 0 ? 'Enter name of mail receiver' : ''}
            className={name.length === 0 ? 'invalid' : ''}
            type="text" id='mail-name'name="mail-name" value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mailing input-field">
          <label htmlFor="mail-phone">Phone:</label>
          <input
            required
            placeholder={phone.length === 0 ? 'Enter number for contact' : ''}
            className={phone.length === 0 ? 'invalid' : ''}
            type="text" id='mail-phone'name="mail-phone" value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mailing input-field">
          <label htmlFor="mail-address">Address:</label>
          <textarea
            required
            placeholder={phone.length === 0 ? 'Enter mailing address' : ''}
            className={address.length === 0 ? 'invalid' : ''}
            id='mail-address'name="mail-address" value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      
      </div>
    )
  }

  const OrderComputation = function () {
    return (
      <div className="order-computation">
        <p><span>Subtotal:</span><span className="cart-amount">{amountFormat(checkoutAmount)}</span></p>
        <p><span>Delivery:</span><span className="cart-amount">{deliveryCheck}</span></p>
        <p className='cart-total'><span>Total:</span><span className="cart-amount">{totalCheck}</span></p>
      </div>
    )
  }

  return (
    <div className='checkout-cont'>
      <Mailing/>
      <OrderComputation/>
      <button 
        ref = {checkoutBtnRef}
        onClick = {(mailing) => handleCheckout(mailingRef.current)} 
        disabled = {itemsForCheckout.length <= 0 ? true : false}
      >
      Checkout
      </button>
    </div>
  )
}


const Cart = function () {
  const [profileData, productsData] = useLoaderData();

  const [profile, setProfile] = useState(profileData);

  const cartData = profile.cart;
  let toShipData = profile.toShip;

  const [itemsForCheckout, setItemsForCheckout] = useState([]);
  const [checkoutAmount, setCheckoutAmount] = useState(0);

  // Update checkout amount whenever itemsForCheckout is changed
  useEffect(() => {
    const amount = itemsForCheckout.reduce((acc, curr) => {
      return ((acc) + (curr.salePrice * curr.quantity))
    }, 0);

    setCheckoutAmount(Number(Number.parseFloat(amount).toFixed(2)));
  }, [itemsForCheckout])

  const handleQuantityChange = async function (event) {
    const productId = event.target.dataset.productid;
    const itemTargetIndex = cartData.findIndex(item => item.gameID === productId);
    const itemIsForCheckout = itemsForCheckout.some(item => item.gameID === productId);

    const action = event.target.value;
    
    if (action === 'increase') {
      cartData[itemTargetIndex].quantity++;
  
    } else if (action === 'decrease') {
      cartData[itemTargetIndex].quantity--;
    }

    if (itemIsForCheckout) {
      const itemIndex = itemsForCheckout.findIndex(item => item.gameID === productId);
      const modifiedCheckOutArray = itemsForCheckout.toSpliced(itemIndex, 1, cartData[itemTargetIndex]);

      // Replace old item with modifiedCheckOutArray, which has the quantity changed
      setItemsForCheckout(i => i = modifiedCheckOutArray);
    }

    // Update profile in the storage
    changeCartItemQuantity(cartData);

    setProfile({...profile, cart: cartData});
  }

  // Add/ ready item for checkout
  const handleAddForCheckout = function (event) {
    const productId = event.target.dataset.productid;
    const checkoutItem = cartData.find(item => item.gameID === productId);
    
    let newItemsForCheckout = [];
    if (event.target.checked) {
      newItemsForCheckout = [...itemsForCheckout, checkoutItem];

    } else {
      const removeItemIndex = itemsForCheckout.findIndex(item => item.gameID === productId);
      const itemRemovedArray = itemsForCheckout.toSpliced(removeItemIndex, 1);
      newItemsForCheckout = itemRemovedArray;
    }

    setItemsForCheckout(i => i = newItemsForCheckout);
  }

  // Remove item from your cart
  const handleRemoveItemFromCart = async function (event) {
    const productId = event.target.dataset.productid;
    const forRemovalIndex = cartData.findIndex(item => item.gameID === productId);

    // Update cart data
    cartData.splice(forRemovalIndex, 1);

    // If item for removal is currently readied for checkout, update itemsForCheckout
    const itemIsForCheckout = itemsForCheckout.some(item => item.gameID === productId);
    if (itemIsForCheckout) {
      const removeItemCheckoutIndex = itemsForCheckout.findIndex(item => item.gameID === productId);
      const newCheckoutItems = itemsForCheckout.toSpliced(removeItemCheckoutIndex, 1);
      setItemsForCheckout(newCheckoutItems);
    }

    // Update profile in the storage
    console.log('loading');
    await changeCartItemQuantity(cartData);
    console.log('done');

  }

  // Checkout readied items
  const handleCheckout = async function (mailing) {
    if (itemsForCheckout.length === 0) return

    if (mailing.name.length === 0 || mailing.phone.length === 0 || mailing.address.length === 0) return

    // Calculate eligibility for free delivery
    const delivery = checkoutAmount > freeDeliveryMin ? 0 : deliveryFee;

    // Update toShipData
    toShipData = [...toShipData, 
      {
        items: itemsForCheckout,
        subAmount: checkoutAmount,
        delivery: delivery,
        totalAmount: checkoutAmount + delivery,
        timeStamp: (new Date()).valueOf(),
        mailing: mailing
      }
    ]

    // Remove checkout items from cartData
    itemsForCheckout.forEach(item => {
      const itemIndex = cartData.findIndex(product => product.gameID === item.gameID);
      cartData.splice(itemIndex, 1);
    })

    // Update profile from storage
    // Note: update cart and forShip properties
    console.log('loading');
    await addCheckoutItems(cartData, toShipData);
    console.log('done');

    // Empty items for checkout upon successful checkout
    setItemsForCheckout(i => i = []);
  }

  return (
    <div className='cart-page'>
     
      <h2>Your Cart</h2>

      <div className="cart-display">
        <CartItems 
          cartData = {cartData}
          handleQuantityChange = { handleQuantityChange }
          handleAddForCheckout = { handleAddForCheckout }
          handleRemoveItemFromCart = { handleRemoveItemFromCart }
        />
        <CheckOutCounter 
          profileData = { profileData }
          itemsForCheckout = { itemsForCheckout }
          checkoutAmount = { checkoutAmount }
          handleCheckout = { handleCheckout } 
        />
      </div>
      
    </div>
  )
}

export {Cart}