// React
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";

// Scripts
import { amountFormat, capitalizeString } from "../utilities/utilities";

//Asset import
import heroImg from '../assets/hero-2.jpg';

// Components
import { NewIcon, AnimalIcon, AnimalImage } from "./Icons";
import { PageContext } from "./App";

// Context
const HomePageContext = createContext();

const HomePage = function () {
  const {productsData, categoriesData} = useLoaderData();

  return (
    <HomePageContext.Provider value={{productsData, categoriesData}}>
    <>
      <HeroBanner/>
      <SpecialOffers/>
      <CategoriesBanner/>
    </>
    </HomePageContext.Provider>
  )
}

// Page changer arrows
const ArrowButton = function ({direction, maxPage, page, setPage}) {
  const min = direction === 'previous' && page <= 1 ? true : false;
  const max = direction === 'next' && page >= maxPage ? true : false;

  const handleNextSet = function (e) {
    const action = e.target.value;
    if(min) {
      setPage(maxPage)
    } else if (max) {
      setPage(1)
    } else {
      action === 'previous' ? setPage(page - 1) : setPage(page + 1);
    }
  }

  return (
    <button value={direction} className={`chevron-btn ${direction}-page ${maxPage <= 1 && 'no-page'}`} 
      onClick={handleNextSet}
      disabled = {maxPage <= 1 ? true : false }
    >
      <NewIcon assignClass={direction}/>
    </button>
  )
}

// Page changer indicators/ nodes
const PageNodes = function ({maxPage, page, setPage}) {
  const handlePageChange = function (event) {
    const pageNumber = Number(event.target.value);
    setPage(pageNumber);
  }

  const pageNodesArr = [];
  for(let i = 1; i <= maxPage; i++) {
    const isActive = i <= page && 'active';
    const isCurrent = i === page && 'current';
    pageNodesArr.push(
      <button key={i}  value={i} onClick={handlePageChange}
        className = {`page-node ${isActive} ${isCurrent}`}
        disabled = {page === i ? true : false}
      >
      </button>
    )
  }

  return (
    <div className={`page-nodes ${pageNodesArr.length <= 1 && 'no-page'}`}>
      {pageNodesArr}
    </div>
  )
}

const SpecialOffers = function () {
  const {productsData} = useContext(HomePageContext);
  const [displayedItems,  setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage]= useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const navigate = useNavigate();

  const onSaleItems = productsData.filter(item => item.isOnSale === '1');
  onSaleItems.sort((a, b) => b.savings - a.savings); // Sort from largest discount

  const leastDiscount = onSaleItems.length % itemsPerPage;
  onSaleItems.splice(onSaleItems.length - leastDiscount);

  // useEffect(() => {
  //   const changeItemsNumber = function () {
  //     const screen = window.screen.width
  //     console.log(screen)
  //     if (screen <= 1440 && screen > 1024) {
  //       setItemsPerPage(6);
  //     } else if (screen <= 1024 ) {
  //       setItemsPerPage(4);
  //     }
  //   }

  //   window.addEventListener('resize', changeItemsNumber)

  //   return () => {
  //     window.removeEventListener('resize', changeItemsNumber)
  //   }

  // },[])

  useEffect(() => {
    const startIndex = itemsPerPage * (page - 1);
    const endIndex = (itemsPerPage * page);
   
    const itemsForDisplay = onSaleItems.slice(startIndex, endIndex);

    const salePages = Math.ceil(onSaleItems.length / itemsPerPage);

    setMaxPage(salePages);
    setDisplayedItems(itemsForDisplay);

  }, [page, itemsPerPage]);

  // If no items for sale to render, return nothing
  if (displayedItems.length < 1) return;

  const SaleItems = displayedItems.map(item => {
    return (
      <div key={item.gameID} className="sale-item" 
        onClick={() => navigate(`../shop/product/${item.gameID}`)}
      >
        <img src={item.header} alt="" />
        <div className={`on-sale prices`}>
          <p className='discount'>{`-${Number.parseFloat(item.savings).toPrecision(2)}%`}</p>
          <p className='normal-price'>{amountFormat(item.normalPrice)}</p>
          <p className='disc-price'>{amountFormat(item.salePrice)}</p>  
        </div>
      </div>
    )
  })

  return (
    <div className="home-banner offers">
      <h4 className='banner-header offers'>Special Offers</h4>
      <ArrowButton direction={'previous'} maxPage={maxPage} page={page} setPage={setPage}/>

      <div className='offers-items'>
        {SaleItems}
      </div>
      
      <ArrowButton direction={'next'} maxPage={maxPage} page={page} setPage={setPage}/>
      <PageNodes maxPage={maxPage} page={page} setPage={setPage}/>
    </div>
  )
}

const HeroBanner = function () {
  return (
      <div className="home-banner hero">
        <div className="hero-text">
          <p className='slogan-text'>
            <span>BUY</span>
            <span>PHYSICAL GAMES</span> 
            <span>ONLINE</span>
          </p>
          <p className='sub-text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis!</p>
        </div>
        <img src={heroImg} alt='' className='hero-image'/>
    </div>
  )
}

const CategoriesBanner = function () {
  const {categoriesData} = useContext(HomePageContext);
  const [displayedItems,  setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage]= useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const startIndex = itemsPerPage * (page - 1);
    const endIndex = (itemsPerPage * page);
   
    const itemsForDisplay = categoriesData.slice(startIndex, endIndex);

    const categoryPages = Math.ceil(categoriesData.length / itemsPerPage);

    setMaxPage(categoryPages);
    setDisplayedItems(itemsForDisplay);

  }, [page, itemsPerPage]);

  // If no category to render, return nothing
  if (displayedItems.length < 1) return;

  const categories = displayedItems.map(category => {
    return (
      <div className='category-item' key={category}
        onClick={() => navigate(`../shop/catalog/${category}/page_1`)}
      >
        <div className='content'>
          <AnimalImage assignClass={category}/>
          <p className="category-text">{capitalizeString(category)}</p>
        </div>
      </div>
    )
  })

  return (
    <div className='home-banner categories'>
      <h4 className="banner-header categories">Categories</h4>
      <ArrowButton direction={'previous'} maxPage={maxPage} page={page} setPage={setPage}/>
      <div className="category-items">
        {categories}
      </div>
      <ArrowButton direction={'next'} maxPage={maxPage} page={page} setPage={setPage}/>
      <PageNodes maxPage={maxPage} page={page} setPage={setPage}/>
    </div>
  )
}


export default HomePage