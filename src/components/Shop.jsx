// React
import { useContext, useState, useRef, useEffect, createContext } from "react";
import { Outlet, useLoaderData, useParams, useNavigate, useOutletContext } from "react-router-dom";
import PropTypes from 'prop-types';

// Data fetch
import { addToCartData, getProfileData } from "../utilities/DataFetch";

// Scripts
import { amountFormat, capitalizeString } from "../utilities/utilities";

// Components
import { NewIcon, CategoryIcon } from "./Icons";
import { ProductsDisplay, ProductsBanner } from "./ProductsDisplay";
import { LoadingScreen2 } from "./LoadingScreen";

// Context
const ShopContext = createContext({});

const Shop = function () {
  const { productsData, categoriesData } = useLoaderData();
  const [filter, setFilter] = useState('all');
  const [shopItems, setShopItems] = useState(productsData);
  const {setCartCount} = useOutletContext();
  const itemsPerPage = 36;

  const contextValues = { 
    productsData, 
    categoriesData, 
    filter, setFilter, 
    shopItems, setShopItems, 
    itemsPerPage,
    setCartCount 
  }

  return (
    <ShopContext.Provider value={contextValues}>
      <div className={`shop-page`}>
        <Outlet/>
      </div>
    </ShopContext.Provider>
  )
}

// Render the Shop catalog
const ShopCatalog = function () {
  const { categoriesData, filter, setFilter, productsData, setShopItems, itemsPerPage } = useContext(ShopContext);
  const {category, catalogPage} = useParams();
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();

  const categoryBarRef = useRef(null);
 
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

    // Set number for pages in respect to constant itemsPerPage
    const catalogPages = Math.ceil(filteredItems.length / itemsPerPage);
    setMaxPage(catalogPages);

    // Render limited shop items per page
    setShopItems(filteredItems);

  }, [filter]);

  useEffect(() => {
    // Scroll to top on change page
    window.scroll({top: 0, behavior:'smooth'});
  }, [page]);

  // Handle Filter script, executable by event listener
  const handleFilter = function (event) {
    const filterValue = event.target.value;
    
    // Don't run filter if same filter btn is pressed
    if (filterValue === filter) return;

    // Note: add :page_1 param to route to roll back to first page when filter is changed
    const pageRoute = filterValue === 'all' ? `page_1`: `${filterValue}/page_1`;
    
    // Set corresponding page and filter states
    setPage(1);
    setFilter(filterValue);

    // Navigate to route
    navigate(pageRoute);
  }

  // Handle category filter bar closing and open in the UI
  const handleFilterBarOpen = function (e) {
    if (e.target.value === 'open') {
      categoryBarRef.current.classList.add('open');

    } else {
      categoryBarRef.current.classList.remove('open');
    }
  }
  
  //  Category filter bar toggler button component
  const CategoryBarToggler = function ({assignAction}) {
    const iconName = assignAction === 'open' ? 'filter' : 'back';

    return (
      <button className={`${assignAction}-filter-btn`}
        value = {assignAction}
        onClick = {handleFilterBarOpen }
      >
        <NewIcon assignClass={iconName}/>
      </button>
    )
  }

  CategoryBarToggler.propTypes = {
    assignAction: PropTypes.string
  }

  // Categories filter side bar
  const CategoryFilterBar = function () {
    // Available filters
    const filtersArray = ['On sale', 'Under $5', 'Best rated', ...categoriesData ];

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
          <CategoryIcon assignClass={category}/>
        </button>
      )
    })

    return (
      <div className="filter-bar" ref={categoryBarRef}>
        <CategoryBarToggler assignAction={'close'}/>
        <h3 className="filter">Categories</h3>
        <div className="buttons-container">
          {FilterButtons}
        </div> 

      </div>
    )
  }

  // Page changer of shop catalog
  const PageChanger = function () {  
    const navigate = useNavigate();

    // Common logic for changing page
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

    const PageNodesButtons = function ({maxPage}) {
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

    PageNodesButtons.propTypes = {
      maxPage: PropTypes.number
    }

    const ArrowButton = function ({direction, maxPage}) {
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

    ArrowButton.propTypes = {
      direction: PropTypes.string,
      maxPage: PropTypes.number
    }

    return (
      <div className="page-btns-cont">
        <ArrowButton direction={'previous'} maxPage={maxPage}/>
        <PageNodesButtons maxPage={maxPage}/>
        <ArrowButton direction={'next'}/>
      </div>
    )
 }

  return(
    <div className="catalog-page">
      <div className='shop-header'>

        <CategoryBarToggler assignAction={'open'}/>

        <h2 className='header'>Catalog</h2>

        
        { filter !== 'all' && 
          <button className='filter-label-btn' value='all' 
            onClick={handleFilter}
            disabled = {filter === 'all' ? true : false}
          >
            <NewIcon assignClass={'close'}/>
            <span>{capitalizeString(filter)}</span>
          </button>
        }
        
      </div>

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
  
  return ( <> <Outlet/> </> )
}

// Renders product details on the item page
const ProductDetails = function () {
  const {productsData} = useContext(ShopContext);
  const { id } = useParams();

  const successRef = useRef(null);
  const preCartRef = useRef(null);
  const itemData = productsData.find(item => Number(item.gameID) === Number(id));
  const isOnSale = itemData.isOnSale === '1';
  
  // Open add to cart dialog (pre-cart)
  const handlePreAddCart = function () {
    preCartRef.current.showModal();
  }

  // Item/ Products details display
  const ItemDisplay = function () {
    return (
      <div className='product-details'> 
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
        
        <p className='success-msg' ref={successRef} 
          onAnimationEnd={() => { successRef.current.classList.remove('shown') }}
        > 
          <NewIcon assignClass={'check'}/>
          Add to cart success
        </p>
      </div>
    )
  } // ProductDisplay (end)

  // Similar products

  const SimilarProducts = function () {
    const {category} = itemData;

    const similarProducts = productsData.filter(item => item.category === category);
    const currentProductIndex = similarProducts.findIndex(item => item.gameID === itemData.gameID);
    similarProducts.splice(currentProductIndex, 1);
    const itemsPerPage = 6;
    const itemsToShow = 18; // 6 * 3 pages

    if (similarProducts.length > itemsToShow) {
      similarProducts.splice(itemsToShow);
    } else {
      const leastDiscount = similarProducts.length % itemsPerPage;
      similarProducts.splice(similarProducts.length - leastDiscount);
    }
    
    return (
      <ProductsBanner
        assignClass={`similar-products`}
        assignTitle={'More like this'}
        assignItemsPerPage={itemsPerPage}
        assignRoute={`/shop/catalog/${category}/page_1`}
        productsList={similarProducts}
      
      />
    )
  } // SimilarProducts end

  // Pre-cart dialog
  const CartDialog = function () {
    const [itemQuantity, setItemQuantity] = useState(0);
    const { setCartCount } = useContext(ShopContext);
    const loadingRef = useRef(null);

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

    // Closed pre-cart dialog
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
      loadingRef.current.classList.remove('hidden'); // Show loading screen while fetching
      const newProfileData = await addToCartData( profileData, currentCart );
      loadingRef.current.classList.add('hidden'); // Remove loading screen when done
     
      // Update cartCount in header
      setCartCount(newProfileData.cart.length);

      // Run add cart success sequence
      const animateSuccess = function () {
        // Add class to dialog to run closing animation
        preCartRef.current.classList.add('added');

        // Run logic when animation ends
        preCartRef.current.addEventListener('animationend', () => {
          successRef.current.classList.add('shown');
          preCartRef.current.classList.remove('added');
          handleClose();
        }, {once: true});
      }
      animateSuccess();
    }

    return (
      <dialog className='pre-cart-dialog' ref={preCartRef}>
        <div className="pre-cart dialog-cont">
    
          <button onClick={handleClose} className="pre-cart close-dialog-btn">
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

        <LoadingScreen2 assignRef={loadingRef}/>  {/* Loading spinner, hidden on render */}
      </dialog>
    )
  } // Cart Dialog (end)

  // ProductsDetails assembled return value
  return (
    <div className="item-page-content">
      <ItemDisplay/>
      <SimilarProducts/>

      <CartDialog/> {/* Modal hidden on render */}
    </div>
    
  )
}
 // Render a specific item page (end)

export default Shop
export { ShopCatalog, ProductsOnPage, ItemPage, ProductDetails}