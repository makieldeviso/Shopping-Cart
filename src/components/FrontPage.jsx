// React
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

// Scripts
import { capitalizeString } from "../utilities/utilities";

//Asset import
import heroImg from '../assets/hero-2.jpg';

// Components
import { AnimalImage } from "./Icons";
import { ProductsBanner, ArrowButton, PageNodes } from "./ProductsDisplay";

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
      <UnderFiveBanner/>
    </>
    </HomePageContext.Provider>
  )
}

const SpecialOffers = function () {
  const {productsData} = useContext(HomePageContext);
  const itemsPerPage = 6;

  const onSaleItems = productsData.filter(item => item.isOnSale === '1');
  onSaleItems.sort((a, b) => b.savings - a.savings); // Sort from largest discount

  const leastDiscount = onSaleItems.length % itemsPerPage;
  onSaleItems.splice(onSaleItems.length - leastDiscount);

  return (
    <>
      <ProductsBanner
        assignClass={'offers'}
        assignTitle={'Special Offers'}
        assignItemsPerPage={itemsPerPage}
        productsList={onSaleItems}
      />
    </>
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

const UnderFiveBanner = function () {
  const {productsData} = useContext(HomePageContext);
  const underFiveProducts = productsData.filter(item => Math.ceil(Number(item.salePrice)) < 5);

  return (
    <>
      <ProductsBanner
        assignClass={'under-five'}
        assignTitle={'Under $5'}
        assignItemsPerPage={3}
        productsList={underFiveProducts}
      />
    </>
  )
}

export default HomePage