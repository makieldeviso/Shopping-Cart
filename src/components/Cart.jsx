// React
import { useEffect, useState, useRef } from "react";
import { useLoaderData, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import PropTypes from 'prop-types';

// Data fetch
import { addCheckoutItems, changeCartItemQuantity } from "../utilities/DataFetch";

// Scripts
import { amountFormat } from "../utilities/utilities";

// Components
import { NewIcon } from "./Icons";
import { ProductsOrderBatch, AmountOrderBatch, MailingOrderBatch } from "./OrderBatchDisplay";
import { LoadingScreen2 } from "./LoadingScreen";

// Constant
const ORDER_CONST = {
  DELIVERY_FEE: 50,
  FREE_DELIVERY_MIN: 300
}

// // Cart main component
const Cart = function () {
  // Authentication (start)
  const navigate = useNavigate();
  const location = useLocation();
  const {loggedIn, pathRef} = useOutletContext();

  // Navigate to login page if not logged in
  useEffect(() => {
    pathRef.current = location.pathname;
    if (!loggedIn) navigate('/login');
  })
  // Authentication (end)

  const { profileData } = useLoaderData();
  const [profile, setProfile] = useState(profileData);
  const { setCartCount } = useOutletContext();

  const [ checkoutQueue, setCheckoutQueue] = useState({ready: false});

  const confirmCheckoutRef = useRef(null);
  const loadingRef = useRef(null);
  const dialogLoadingRef = useRef(null);
  
  const cartData = profile.cart;
  let toShipData = profile.toShip;

  const [itemsForCheckout, setItemsForCheckout] = useState([]);
  const [checkoutAmount, setCheckoutAmount] = useState(0);

  // Update cart counter whenever profile state is updated
  useEffect(() => {
    setCartCount(profile.cart.length);
  }, [profile]);

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
    
    // Update profile in the storage
    loadingRef.current.classList.remove('hidden');
    const newProfileData = await changeCartItemQuantity(cartData);
    loadingRef.current.classList.add('hidden');

    // If item for removal is currently readied for checkout, update itemsForCheckout
    const itemIsForCheckout = itemsForCheckout.some(item => item.gameID === productId);
    if (itemIsForCheckout) {
      const removeItemCheckoutIndex = itemsForCheckout.findIndex(item => item.gameID === productId);
      const newCheckoutItems = itemsForCheckout.toSpliced(removeItemCheckoutIndex, 1);
      setItemsForCheckout(newCheckoutItems);

    } else {
      setProfile(newProfileData)
    }
  }

  // Pops a dialog for final confirmation of checkout
  const handleCheckoutConfirm = function ( mailingDetails ) {
    // Verify checkout items length, cancel if empty
    if (itemsForCheckout.length === 0) return

    // Calculate eligibility for free delivery
    const delivery = checkoutAmount > ORDER_CONST.FREE_DELIVERY_MIN ? 0 : ORDER_CONST.DELIVERY_FEE;

    const orderDetails = {
      items: itemsForCheckout,
      subAmount: checkoutAmount,
      delivery: delivery,
      totalAmount: checkoutAmount + delivery,
      mailing: mailingDetails
    }
    
    // Update checkout queue
    setCheckoutQueue({...orderDetails, ready: true});

    // Open confirm dialog
    confirmCheckoutRef.current.showModal();
  }

  const handleCloseCheckoutConfirm = function () {
    // Reset checkout queue upon successful checkout
    setCheckoutQueue({ready: false});

    // Close confirm checkout dialog
    confirmCheckoutRef.current.close();
  }

  // Checkout readied items
  const handleCheckout = async function () {
    const {ready, ...orderDetails} = checkoutQueue;
    
    // Update toShipData
    toShipData = [...toShipData, 
      {
        ...orderDetails,
        timeStamp: (new Date()).valueOf(),
      }
    ]

    // Remove checkout items from cartData
    itemsForCheckout.forEach(item => {
      const itemIndex = cartData.findIndex(product => product.gameID === item.gameID);
      cartData.splice(itemIndex, 1);
    })

    // Update profile from storage
    // Note: update cart and toShip properties
    dialogLoadingRef.current.classList.remove('hidden');
    const newProfileData = await addCheckoutItems(cartData, toShipData);
    dialogLoadingRef.current.classList.add('hidden');

    // Empty items for checkout upon successful checkout
    setItemsForCheckout(i => i = []);

    // Update reference profile state
    setProfile(newProfileData);

    // Close modal
    // Note: handleCloseCheckoutConfirm have corresponding logic
    handleCloseCheckoutConfirm();
  }

  // // Cart return
  return (
    <div className='cart-page'>
      <h2>Cart</h2>

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
          handleCheckoutConfirm = {handleCheckoutConfirm}
        />
      </div>

      <ConfirmCheckoutDialog 
        assignRef={confirmCheckoutRef} 
        dialogLoadingRef={dialogLoadingRef}
        orderDetails={checkoutQueue}
        handleCheckout = { handleCheckout } 
        handleCloseCheckoutConfirm = {handleCloseCheckoutConfirm}
      />

      <LoadingScreen2 assignRef={loadingRef}/>

    </div>
  )
}

// Cart items component, renders itemized products in the cart
const CartItems = function ({cartData, handleQuantityChange, handleAddForCheckout, handleRemoveItemFromCart}) {

  // // CartItems reiterated components
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

  // // Renders an indicator for an empty cart
  const EmptyCart = function () {
    const navigate = useNavigate();

    return (
      <div className="empty container">
        <NewIcon assignClass={'cart'}/>
        <p className="empty message">Your cart is empty</p>

        <button
          className="empty shop-btn"
          onClick={() => navigate('../shop')}
        >Continue shopping 
        </button>
      </div>
    )
  }

  // // CartItems return
  return (
    <div className='cart-content'>
      {!cartData.length && <EmptyCart/> }
      {products}
    </div>
  )
}

CartItems.propTypes = {
  cartData: PropTypes.array, 
  handleQuantityChange: PropTypes.func,
  handleAddForCheckout: PropTypes.func,
  handleRemoveItemFromCart: PropTypes.func
}

// Check out counter. Handle and show order computation
const CheckOutCounter = function ({profileData, itemsForCheckout, checkoutAmount, handleCheckoutConfirm}) {
  const mailingRef = useRef({ name: profileData.name, phone: profileData.phone, address: profileData.address});
  const checkoutBtnRef = useRef(null);
  const checkoutContRef = useRef(null);

  let deliveryCheck;
  let totalCheck;
  if (checkoutAmount === 0) {
    deliveryCheck = amountFormat(0);
    totalCheck = amountFormat(checkoutAmount);
  } else if (checkoutAmount < 300) {
    deliveryCheck = amountFormat(ORDER_CONST.DELIVERY_FEE);
    totalCheck = amountFormat(checkoutAmount + ORDER_CONST.DELIVERY_FEE);
  } else if (checkoutAmount >= 300) {
    deliveryCheck = 'Free'
    totalCheck = amountFormat(checkoutAmount);
  }

  // // CheckoutCounter component
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
        <NewIcon assignClass={'location'}/>

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

  // // CheckoutCounter component
  const OrderComputation = function () {
    return (
      <div className="order-computation">
        <p><span>Subtotal:</span><span className="cart-amount">{amountFormat(checkoutAmount)}</span></p>
        <p><span>Delivery:</span><span className="cart-amount">{deliveryCheck}</span></p>
        <p className='cart-total'><span>Total:</span><span className="cart-amount">{totalCheck}</span></p>
      </div>
    )
  }

  // // Counter buttons
  const CounterButtons = function () {
    return (
      <div className='checkout-btns-cont'>
        <button 
          className='edit-mailing'
          onClick={() => {checkoutContRef.current.classList.toggle('edit')}}
        >
          <span className="indicator"></span>
          Edit mailing
        </button>

        <button 
          ref = {checkoutBtnRef}
          className="checkout-btn" 
          onClick = {() => handleCheckoutConfirm(mailingRef.current)} 
          disabled = {itemsForCheckout.length <= 0 ? true : false}
        >
        Checkout
      </button>
    </div>
    )
  }

  // // CheckoutCounter return
  return (
    <div className='checkout-cont' ref={checkoutContRef}>
      <Mailing/>
      <OrderComputation/>
      <CounterButtons/>
    </div>
  )
}

CheckOutCounter.propTypes = {
  profileData: PropTypes.shape({
    cart: PropTypes.array,
    name: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  }),
  itemsForCheckout: PropTypes.array,
  checkoutAmount: PropTypes.number,
  handleCheckout: PropTypes.func,
  handleCheckoutConfirm: PropTypes.func
}

// Dialog for final confirmation of checkout
const ConfirmCheckoutDialog = function ({assignRef, dialogLoadingRef, orderDetails, handleCloseCheckoutConfirm, handleCheckout}) {
 
  return (
    <dialog className='confirm-checkout' ref={assignRef}>
      <div className="dialog-cont">
        
        <button className="close-dialog-btn"
          onClick={ handleCloseCheckoutConfirm }
        >
          <NewIcon assignClass={'close'}/>
        </button>

        <h3 className="dialog-header">Your order</h3>

        {orderDetails.ready && 
        <>
          <MailingOrderBatch orderBatch={orderDetails}/>
          <ProductsOrderBatch orderBatch={orderDetails}/>
          <AmountOrderBatch orderBatch={orderDetails}/>
          
          <button className='confirm-btn' onClick={handleCheckout}>
            Confirm
          </button>
        </>
        } 
      </div>

      <LoadingScreen2 assignRef={dialogLoadingRef} />
    </dialog>
  )
}

ConfirmCheckoutDialog.propTypes = {
  assignRef: PropTypes.object,
  dialogLoadingRef: PropTypes.object,
  orderDetails: PropTypes.shape({
    ready: PropTypes.bool
  }),
  handleCloseCheckoutConfirm: PropTypes.func,
  handleCheckout: PropTypes.func
}

export default Cart