// React
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'

// Scripts
import { amountFormat } from "../utilities/utilities";

// Components
import { NewIcon } from './Icons';

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

// Create products for display
// Takes list of products (array) as argument
const ProductsDisplay = function ({productsList, rated}) {
  const navigate = useNavigate();

  const productDisplay = productsList.map(item => {
    const isOnSale = item.isOnSale === "1";
    return (
      <div key={item.gameID} className='shop-item' data-gameid={item.gameID} 
        onClick={() => navigate(`/shop/product/${item.gameID}`)}
      >
        <img src={item.header} alt={`item-${item.gameID} preview`} className='item-preview'/>
        <p title={item.title} className='catalog-desc title'>{item.title}</p>
        {rated && <div className='rating'><p>{item.steamRatingPercent}</p></div>}

        <div className={`catalog-price ${isOnSale && 'sale'}`}>
          {isOnSale && <p className='discount'>{`-${Number.parseFloat(item.savings).toPrecision(2)}%`}</p>}
          {isOnSale && <p className='normal-price'>{amountFormat(item.normalPrice)}</p>}
          <p className='disc-price'>{amountFormat(item.salePrice)}</p>
        </div>
      </div>
    )
  })

  return (
    <>{productDisplay}</>
  )
}

ProductsDisplay.propTypes = {
  productsList: PropTypes.array,
  rated: PropTypes.bool
}

const ProductsBanner = function ({assignClass, assignTitle, assignItemsPerPage, assignRoute, productsList}) {
  const [displayedItems,  setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage]= useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(assignItemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    const startIndex = itemsPerPage * (page - 1);
    const endIndex = (itemsPerPage * page);
   
    const itemsForDisplay = productsList.slice(startIndex, endIndex);

    const salePages = Math.ceil(productsList.length / itemsPerPage);

    setMaxPage(salePages);
    setDisplayedItems(itemsForDisplay);

  }, [page, itemsPerPage]);

  // If no items for sale to render, return nothing
  if (displayedItems.length < 1) return;

  return (
    <div className={`home-banner ${assignClass}`}>
      <h4 className={`banner-header ${assignClass}`}>{assignTitle}</h4>

      <button className='more-btn'
        onClick={() => navigate(assignRoute)}
        >BROWSE MORE
      </button>

      <ArrowButton direction={'previous'} maxPage={maxPage} page={page} setPage={setPage}/>

      <div className={`banner-products ${assignClass}-items`}>
        <ProductsDisplay 
          productsList={displayedItems} 
          rated={assignClass === 'best-rated' ? true : false}
        />
      </div>
      
      <ArrowButton direction={'next'} maxPage={maxPage} page={page} setPage={setPage}/>
      <PageNodes maxPage={maxPage} page={page} setPage={setPage}/>
    </div>
  )
}

export { ProductsDisplay, ProductsBanner, ArrowButton, PageNodes };