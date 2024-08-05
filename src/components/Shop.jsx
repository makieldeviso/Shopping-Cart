// Hooks
import { useContext, useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLoaderData, useOutletContext, useParams, useNavigate } from "react-router-dom";
import { format, formatDate } from "date-fns";

// Scripts
import { amountFormat, capitalizeString } from "../utilities/utilities";
import { NewIcon } from "./Icons";
import { addToCartData, getProfileData } from "../utilities/DataFetch";

const Shop = function () {
  const { id='catalog' } = useParams();
  
  return (
    <div className="shop-page">
      <Outlet context={{id}}/>
    </div>
  )
}

// Render the Shop catalog
const ShopCatalog = function () {
  const { id } = useOutletContext();
  const [productsData] = useLoaderData();
  const [shopItems, setShopItems] = useState(productsData);
  const navigate = useNavigate();

  // Filter items
  // const handleFilterItems = function (event) {
  //   const btnValue = event.target.value;
  //   let filteredProducts = products;
  //   if (btnValue !== 'all') {
  //     filteredProducts = products.filter(item => item.category === event.target.value);
  //   } 
  //   setShopItems(filteredProducts)
  // }

  // Item category filter
  // const CategoryFilterBar = function () {
  //   const CategoryButtons = ['all', ...categories].map(cat => {
  //     return (
  //       <button
  //         className = 'filter-btn'
  //         key={crypto.randomUUID()}
  //         value = {cat}
  //         onClick = {handleFilterItems}>
  //         {capitalizeString(cat)}
  //       </button>
  //     )
  //   })

  //   return (
  //     <div className='filter-sidebar'>
  //       {CategoryButtons}
  //     </div>
  //   )
  // }

  // Open item page
  const handleOpenItemPage = function (event) {
    const itemId = event.target.dataset.gameid;
    navigate(itemId);
  }

  // Display all items in the catalog
  const productDisplay = shopItems.map(item => {

    const isOnSale = item.isOnSale === "1";

    return (
      <div key={item.gameID} className='shop-item' data-gameid={item.gameID} onClick={handleOpenItemPage}>
        <img src={item.header} alt={`item-${item.gameID} preview`} className='item-preview'/>
        <p className='catalog-desc title'>{item.title}</p>

        <div className={`catalog-price ${isOnSale ? 'sale' : ''}`}>
          {isOnSale && <p className='discount'>{`-${Number.parseFloat(item.savings).toPrecision(2)}%`}</p>}
          {isOnSale && <p className='normal-price'>{amountFormat(item.normalPrice)}</p>}
          <p className='disc-price'>{amountFormat(item.salePrice)}</p>
        </div>
      </div>
    )
  })

  return(
    <>
      {/* <CategoryFilterBar/> */}
      <div className={`shop-${id}`}>
        {productDisplay}
      </div>
    </>
  )
}

 // Render a specific item page (start)
const ItemPage = function () {
  const {id} = useOutletContext();
  const [productsData] = useLoaderData();
  const preCartRef = useRef(null);

  const itemData = productsData.find(item => Number(item.gameID) === Number(id));

  // Open add to cart dialog (pre-cart)
  const handlePreAddCart = function () {
    preCartRef.current.showModal();
  }

  // Pre-cart
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

    // Finalize Add to cart
    const handleFinalizeCart = async function () {
      const profileData = await getProfileData();
      console.log(profileData)
      let currentCart = profileData.cart;
      
      // Check if item is already in the cart
      const itemInCart = currentCart.find(item => item.gameID === itemData.gameID);
     
      // Create new cart item with conditional quantity according to itemInCart check
      const newItem = {...itemData, quantity: !itemInCart 
        ? itemQuantity
        : itemInCart.quantity + itemQuantity }

      if (itemInCart) {
        // if item exist in the cart, add quantity
        const itemIndex = currentCart.findIndex(item => item.gameID === itemData.gameID);
        currentCart[itemIndex].quantity = currentCart[itemIndex].quantity + itemQuantity

      } else {
        // if item is newly added add new item to cartData array
        currentCart = [ ...currentCart, newItem ];
      }

      addToCartData( profileData, currentCart );
      handleClose();
    }

    const isOnSale = itemData.isOnSale === '1';

    return (
      <dialog className='pre-cart-dialog' ref={preCartRef}>
        <div className="pre-cart dialog-cont">
    
          <button onClick={handleClose} className="pre-cart close-btn">
            <NewIcon assignClass={'close'}/>
          </button>

          <img src={itemData.header} alt={`${itemData.gameID} preview`} className="pre-cart preview"/>

          <p className="pre-cart title">{itemData.title}</p>

          <div className={`pre-cart price ${isOnSale ? 'sale' : ''}`}>
            <p className='label'>Price</p>

            {isOnSale && <p className='discount'>{`-${Number.parseFloat(itemData.savings).toPrecision(2)}%`}</p>}
            {isOnSale && <p className='normal-price'>{amountFormat(itemData.normalPrice)}</p>}
            <p className='disc-price'>{amountFormat(itemData.salePrice)}</p>
          </div>

          <div className='pre-cart qty-controller'>
            <p>Quantity</p>

            <div className='pre-cart qty-buttons'>
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

          <div className='pre-cart total'>
            <p>Item total</p>
            <p className="compute">{amountFormat(itemQuantity * itemData.salePrice)}</p>
          </div>

          <button
            className = 'pre-cart add-btn'
            disabled = {itemQuantity === 0 ? true : false}
            onClick = { handleFinalizeCart }>
              Confirm
            </button>
        </div>
      </dialog>
    )
  }

  const isOnSale = itemData.isOnSale === '1';
  
  return (
    <div className='item-page'> 
      <h3 className='item-desc title'>{itemData.title}</h3>

      <img src={itemData.header} alt="" className="item-desc preview"/>
      <p className="item-desc about">{itemData.about}</p>

      <p className="item-desc developer">
        <span>Developer: </span>
        <span>{itemData.developer}</span>
      </p>

      <p className="item-desc publisher">
        <span>Publisher: </span>
        <span>{itemData.publisher}</span>
      </p>
     
     <div className="item-desc counter">
      <div className={`item-desc price ${isOnSale ? 'sale' : ''}`}>
        {isOnSale && <p className='discount'>{`-${Number.parseFloat(itemData.savings).toPrecision(2)}%`}</p>}
        {isOnSale && <p className='normal-price'>{amountFormat(itemData.normalPrice)}</p>}
        <p className='disc-price'>{amountFormat(itemData.salePrice)}</p>
      </div>

        <button className="item-desc add-btn" onClick={handlePreAddCart}>
          Add to cart
        </button>
     </div>
      
      <CartDialog/> {/* Modal hidden on render */}

    </div>
  )
}
 // Render a specific item page (end)

export { Shop, ShopCatalog, ItemPage}