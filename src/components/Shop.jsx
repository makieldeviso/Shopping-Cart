// Hooks
import { useContext, useState, useRef } from "react";
import { NavLink, Outlet, useLoaderData, useOutletContext, useParams, useNavigate } from "react-router-dom";

// Components
import { CartContext } from "./App";

// Scripts
import { capitalizeString } from "../utilities/utilities";

// Render the Shop catalog
const ShopCatalog = function () {
  const {products, categories, id} = useOutletContext();
  const [shopItems, setShopItems] = useState(products);
  const navigate = useNavigate();

  // Filter items
  const handleFilterItems = function (event) {
    const btnValue = event.target.value;
    let filteredProducts = products;
    if (btnValue !== 'all') {
      filteredProducts = products.filter(item => item.category === event.target.value);
    } 
    setShopItems(filteredProducts)
  }

  // Open item page
  const handleOpenItemPage = function (event) {
    const itemId = event.target.id;
    navigate(itemId);
  }

  // Item category filter
  const CategoryFilterBar = function () {
    const CategoryButtons = ['all', ...categories].map(cat => {
      return (
        <button
          className = 'filter-btn'
          key={crypto.randomUUID()}
          value = {cat}
          onClick = {handleFilterItems}>
          {capitalizeString(cat)}
        </button>
      )
    })

    return (
      <div className='filter-sidebar'>
        {CategoryButtons}
      </div>
    )
  }

  // Display all items in the catalog
  const productDisplay = shopItems.map(item => {
    return (
      <div key={item.id} className='shop-item' id={item.id} onClick={handleOpenItemPage}>
        <img src={item.image} alt={`item-${item.id} preview`} width='50' className='item-preview'/>
        <p>{item.title}</p>
        <p>{`$${Number.parseFloat(item.price).toFixed(2)}`}</p>
      </div>
    )
  })

  return(
    <>
      <CategoryFilterBar/>
      <div className={`shop-${id}`}>
        {productDisplay}
      </div>
    </>
    
  )
}

 // Render a specific item page (start)
 const ItemPage = function () {
  const {products, categories, id} = useOutletContext();
  const cartData = useContext(CartContext);

  const preCartRef = useRef(null);
 
  const itemData = products.find(item => Number(item.id) === Number(id));

  const handlePreAddCart = function (event) {
    preCartRef.current.showModal();
  }

  const CartDialog = function () {

    const [itemQuantity, setItemQuantity] = useState(0);

    const handleQuantityChange = function (event) {
      if (event.target.value === 'increase') {
        setItemQuantity(i => i + 1);

      } else if (event.target.value === 'decrease') {
        if (itemQuantity <= 0) {
          return
        } else {
          setItemQuantity(i => i - 1);
        }
      }
    }

    const handleClose = function () {
      setItemQuantity(i => i = 0);
      preCartRef.current.close();
    }

    const handleFinalizeCart = function () {
      // Check if item is already in the cart
      const itemInCart = cartData.current.find(item => item.id === itemData.id);
      
      const newItem = {...itemData, quantity: !itemInCart 
        ? itemQuantity
        : itemInCart.quantity + itemQuantity }

      
      if (itemInCart) {
        // if item exist in the cart add quantity
        const itemIndex = cartData.current.findIndex(item => item.id === itemData.id);
        cartData.current[itemIndex].quantity = cartData.current[itemIndex].quantity + itemQuantity

      } else {
        // if item is newly added add new item to cartData array
        cartData.current = [ ...cartData.current, newItem ];
      }
      
      console.log(cartData)
      handleClose();
    }

    return (
      <dialog className='pre-cart-menu' ref={preCartRef}>
        <div className="dialog-cont">
          
          <button onClick={handleClose} className="close-btn">X</button>

          <img src={itemData.image} alt={`${itemData.id} preview`} className="pre-cart-preview"/>

          <div className='item-desc'>
            <p>{`$${Number.parseFloat(itemData.price).toFixed(2)}`}</p>
            <p>{`Stock: ${1500}`}</p>
          </div>
          

          <div className='qty-controller'>
            <p>Quantity</p>

            <div className='qty-buttons'>
              <button 
                value = 'decrease' 
                disabled = { itemQuantity <= 0 ? true : false }
                onClick = { handleQuantityChange }
              >-</button>

              <p>{itemQuantity}</p>

              <button 
                value='increase'
                onClick = { handleQuantityChange }
              >+</button>
            </div>
          </div>

          <button
            className = 'add-btn'
            disabled = {itemQuantity === 0 ? true : false}
            onClick = { handleFinalizeCart }>
              Add to Cart
            </button>
        </div>
      </dialog>
    )
  }

  return (
    <div className='item-page'> 
      <img src={itemData.image} alt="" width='100'/>
      <p>{itemData.description}</p>
      <button onClick={handlePreAddCart}>
        Add to cart
      </button>
      
      <CartDialog/>

    </div>
  )
}
 // Render a specific item page (end)

const Shop = function () {
  const {products, categories} = useLoaderData();
  const { id='catalog' } = useParams();
  
  return (
    <div className="shop-page">
      <Outlet context={{products, categories, id}}/>
      <NavLink to='/'>Home</NavLink>
    </div>
  )
}


export { Shop, ShopCatalog, ItemPage}