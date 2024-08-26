// React
import { useContext, useState, useRef, useEffect, createContext } from "react";
import { Outlet, useLoaderData, useParams, useNavigate } from "react-router-dom";

// Context
import { PageContext } from "./App";

// Data fetch
import { addToCartData, getProfileData } from "../utilities/DataFetch";

// Scripts
import { amountFormat, capitalizeString } from "../utilities/utilities";

// Components
import { NewIcon, AnimalIcon } from "./Icons";
import { ProductsDisplay } from "./ProductsDisplay";
import { categories } from "../utilities/products";

const ShopContext = createContext({});

const Shop = function () {
  const { id ='catalog' } = useParams();
  const { productsData, categoriesData } = useLoaderData();
  const [filter, setFilter] = useState('all');
  const [shopItems, setShopItems] = useState(productsData);
  const itemsPerPage = 36;

  return (
    <ShopContext.Provider value={{id, productsData, categoriesData, filter, setFilter, shopItems, setShopItems, itemsPerPage}}>
      <div className={`shop-page`}>
        <Outlet/>
      </div>
    </ShopContext.Provider>
  )
}

// Render the Shop catalog
const ShopCatalog = function () {
  const { filter, setFilter, productsData, categoriesData, setShopItems, itemsPerPage } = useContext(ShopContext);
  const {category, catalogPage} = useParams();
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();
 
  useEffect(() => {
    // Update filter state when category param from routing is changed
    !category ? setFilter('all') : setFilter(category);

    // Update page state when catalogPage category param from routing is changed
    const pageNumberRegex = /(?<=page_)\d+/;
    const pageNumber = catalogPage ? Number(catalogPage.match(pageNumberRegex)[0]) : 1;
    setPage(pageNumber);

  },[category, catalogPage])

  useEffect(() => {
    let filteredItems = [];

    if (filter === 'all') {
      filteredItems = productsData;

    } else if (filter === 'On sale' ) {
      filteredItems = productsData.filter(item => item.isOnSale === '1');

    } else if (filter === 'Under $5') {
      filteredItems = productsData.filter(item => Math.ceil(Number(item.salePrice)) < 5);

    } else if (filter === 'Best rated') {
      filteredItems = productsData.filter(item => Number(item.steamRatingPercent) >= 90 )

    } else {
      filteredItems = productsData.filter(item => item.category === filter);
    }

    const catalogPages = Math.ceil(filteredItems.length / itemsPerPage);

    setMaxPage(catalogPages);
    setShopItems(filteredItems);

  }, [filter]);

  useEffect(() => {
    // Scroll to top on change page
    window.scroll({top: 0, behavior:'smooth'});
  }, [page]);

  // Categories filter side bar
  const CategoryFilterBar = function () {
    const handleFilter = function (event) {
      const filterValue = event.target.value;
      
      // Don't run filter if same filter btn is pressed
      if (filterValue === filter) return;

      const pageRoute = filterValue === 'all' ? `page_1`: `${filterValue}/page_1`;
      
      setPage(1);
      setFilter(filterValue);

      // Navigate to route
      navigate(pageRoute);
    }

    const filtersArray = ['On sale', 'Under $5', 'Best rated', ...categories ];

    const FilterButtons = filtersArray.map((category) => {
      const isActive = category === filter && 'active';
      
      return (
        <button 
          className = {`filter-btn ${isActive}`}
          value = {category} key={crypto.randomUUID()}
          aria-label = {`Filter catalog with ${category}`}
          title = {capitalizeString(category)}
          onClick = {handleFilter}
        >
          <AnimalIcon assignClass={category}/>
        </button>
      )
    })

    return (
      <div className="filter-bar">
        <h3 className="filter">Categories</h3>

          <button className="remove-filter-btn" value='all' onClick={handleFilter}
            disabled = {filter === 'all' ? true : false}
          >
            <NewIcon assignClass={'close'}/>
            <span>Filter: {filter}</span>
          </button>

        <div className="buttons-container">
          {FilterButtons}
        </div> 
      </div>
    )
  }

  // Page changer of shop catalog
  const PageChanger = function () {  
    const navigate = useNavigate();

    const handlePageChange = function (pageNumber, pageRoute) {
      let finalRoute = pageRoute;
      if (filter !== 'all') {
        finalRoute = `${filter}/${pageRoute}`
      }
      setPage(pageNumber);
      navigate(finalRoute);
    }
    
    // Logic for changing page through the page nodes
    const handleNodePageChange = async function (event) {
      const pageNumber = Number(event.target.value);
      const pageRoute = `page_${pageNumber}`;
      
      handlePageChange(pageNumber, pageRoute);
    }

    // Logic for changing page through the arrow button
    const handleArrowPageChange = function (e) {
      const direction = e.target.value;
      const nextPage = direction === 'next' ? page + 1 : page - 1;
      
      if (nextPage === 0) return;
      if (nextPage > maxPage) return;
      
      const pageRoute = `page_${nextPage}`;
      handlePageChange(nextPage, pageRoute);
    }

    const PageNodesButtons = function () {
      let pageNodesArr = [];
      for(let i = 1; i <= maxPage; i++) {

        const isActive = i <= page && 'active';
        const isCurrent = i === page && 'current';

        pageNodesArr.push(
          <button key={i}  value={i} onClick={handleNodePageChange}
            className = {`page-node ${isActive} ${isCurrent}`}
            disabled = {page === i ? true : false}
          >
          </button>
        )
      }
      return (
        <div className="page-nodes"> 
          {pageNodesArr} 
        </div>
      )
    }

    const ArrowButton = function ({direction}) {
      let disabled = false
      if (direction === 'previous' && page <= 1) {
        disabled = true;
      } else if (direction === 'next' && page >= maxPage) {
        disabled = true;
      }
      
      return (
        <button value={direction} onClick={handleArrowPageChange} className="page-btn alt"
          disabled = {disabled}
        >
          <NewIcon assignClass={direction}/>
        </button>
      )
    }

    return (
      <div className="page-btns-cont">
        <ArrowButton direction={'previous'}/>
        <PageNodesButtons/>
        <ArrowButton direction={'next'}/>
      </div>
    )
 }

  return(
    <div className="catalog-page">
      <h2 className='shop-header'>Catalog</h2>
      <CategoryFilterBar/>
      <Outlet/>
      <PageChanger/>
    </div>
  )
} 

// Products per page on the catalog
const ProductsOnPage = function () {
  const { shopItems, itemsPerPage } = useContext(ShopContext);
  const { catalogPage } = useParams();
  
  const pageNumberRegex = /(?<=page_)\d+/;
  const pageNumber = catalogPage ? Number(catalogPage.match(pageNumberRegex)[0]) : 1;

  const startIndex = itemsPerPage * (pageNumber - 1);
  const endIndex = (itemsPerPage * pageNumber);
  const itemsInPage = shopItems.slice(startIndex, endIndex);

  return (
    <div className={`shop-catalog`}>
      <ProductsDisplay productsList={itemsInPage}/>
    </div>
  )
}
// Shop Catalog (end)

 // Render a specific item page (start)
const ItemPage = function () {
  useEffect(() => {
    // Scroll to top on change page
    window.scroll({top: 0, behavior:'instant'});
  }, [])

  return ( <> <Outlet context/> </> )
}

const ProductDetails = function () {
  const {productsData} = useContext(ShopContext);
  const { id } = useParams();
 
  const preCartRef = useRef(null);
  const itemData = productsData.find(item => Number(item.gameID) === Number(id));

  // Open add to cart dialog (pre-cart)
  const handlePreAddCart = function () {
    preCartRef.current.showModal();
  }

  // Pre-cart
  const CartDialog = function () {
    const [itemQuantity, setItemQuantity] = useState(0);
    const { setCartCount } = useContext(PageContext);

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
      setItemQuantity(0);
      preCartRef.current.close();
    }

    // Finalize Add to cart
    const handleFinalizeCart = async function () {
      const profileData = await getProfileData();
      
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

      // Add item to cart by updating profile
      console.log('loading');
      const newProfileData = await addToCartData( profileData, currentCart );
      console.log('done');

      // Update cartCount in header
      setCartCount(newProfileData.cart.length);

      handleClose();
    }

    const isOnSale = itemData.isOnSale === '1';

    return (
      <dialog className='pre-cart-dialog' ref={preCartRef}>
        <div className="pre-cart dialog-cont">
    
          <button onClick={handleClose} className="pre-cart close-btn">
            <NewIcon assignClass={'close'}/>
          </button>

          <div className="item-details">
            <img src={itemData.header} alt={`${itemData.gameID} preview`} className="pre-cart preview"/>

            <p className="pre-cart title">{itemData.title}</p>

            <div className={`pre-cart price ${isOnSale && 'sale'}`}>
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
      <div className={`item-desc price ${isOnSale && 'sale'}`}>
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

export { Shop, ShopCatalog, ProductsOnPage, ItemPage, ProductDetails}