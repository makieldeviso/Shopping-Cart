// React
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useLoaderData } from "react-router-dom"

// Scripts
import { amountFormat } from "../utilities/utilities"

//Asset import
import heroImg from '../assets/hero-2.jpg'

// Components
import { NewIcon } from "./Icons"
import { PageContext } from "./App"

// Context
const HomePageContext = createContext();

const HomePage = function () {
  const {productsData} = useLoaderData();

  return (
    <HomePageContext.Provider value={{productsData}}>
    <main>
      {/* <p>Front page</p> */}
      <HeroBanner/>
      <SpecialOffers/>
    </main>
    </HomePageContext.Provider>
  )
}

// Page changer arrows
const ArrowButton = function ({direction, maxPage, page, setPage}) {
  const min = direction === 'previous' && page <= 1 ? true : false;
  const max = direction === 'next' && page >= maxPage ? true : false;

  const handleNextSet = function (e) {
    const action = e.target.value;
    if(min || max) return;

    action === 'previous' ? setPage(page - 1) : setPage(page + 1);
  }

  return (
    <button value={direction} className={`chevron-btn ${direction}-page`} 
      onClick={handleNextSet}
      disabled = {min || max ? true : false }
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
    const isActive = i <= page ? 'active' : '';
    const isCurrent = i === page ? 'current' : '';
    pageNodesArr.push(
      <button key={i}  value={i} onClick={handlePageChange}
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

const SpecialOffers = function () {
  const {productsData} = useContext(HomePageContext);
  const [displayedItems,  setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage]= useState(1);
  const itemsPerPage = 3;

  const onSaleItems = productsData.filter(item => item.isOnSale === '1');
  onSaleItems.sort((a, b) => b.savings - a.savings); // Sort from largest discount

  useEffect(() => {
    const startIndex = itemsPerPage * (page - 1);
    const endIndex = (itemsPerPage * page);
   
    const itemsForDisplay = onSaleItems.slice(startIndex, endIndex);

    const salePages = Math.ceil(onSaleItems.length / itemsPerPage);

    setMaxPage(salePages);
    setDisplayedItems(itemsForDisplay);

  }, [page]);

  const SaleItems = displayedItems.map(item => {
    return (
      <div key={item.gameID} className="sale-item" >
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
    <div className="offers-banner">
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
  const {productsData} = useContext(HomePageContext);
  const bannerData = productsData.find(item => item.internalName === 'GOATOFDUTY');

  return (
    <div className="hero-section">
      <div className="hero-banner">
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
    
    </div>
  )
}


export default HomePage