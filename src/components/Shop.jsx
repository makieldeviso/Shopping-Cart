import { useContext, useState } from "react";
import { NavLink, Outlet, useLoaderData, useOutletContext, useParams, useNavigate } from "react-router-dom";

import { CartContext } from "./App";

// Render the Shop catalog
const ShopCatalog = function () {
  const {products, categories, id} = useOutletContext();
  const [shopItems, setShopItems] = useState(products);
  const navigate = useNavigate();

  // Filter items
  const handleFilterItems = function (event) {
    console.log(event.target.value)
    const filteredProducts = products.filter(item => item.category === event.target.value);
    setShopItems(filteredProducts)
  }

  // Open item page
  const handleOpenItemPage = function (event) {
    const itemId = event.target.id;
    navigate(itemId)
  }

  // Item category filter
  const CategoryFilterBar = function () {
    const CategoryButtons = categories.map(cat => {
      return (
        <button key={crypto.randomUUID()} value={cat} onClick={handleFilterItems}>
          {cat}
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
        <p>{item.price}</p>
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

 // Render a specific item page
 const ItemPage = function () {
  const {products, categories, id} = useOutletContext();
  const cartData = useContext(CartContext);
 
  const itemData = products.find(item => Number(item.id) === Number(id));

  const handleAddCart = function (event) {
    cartData.current = [...cartData.current, {...itemData, quantity: !itemData.quantity ? 1 : itemData.quantity++  }]
    console.log(cartData.current)
  }

  return (
    <div className='item-page'> 
      <img src={itemData.image} alt="" width='100'/>
      <p>{itemData.description}</p>
      <button onClick={handleAddCart}>
        Add to cart
      </button>
    </div>
  )
}

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