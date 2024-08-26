// React
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

// Scripts
import { capitalizeString } from "../utilities/utilities";

//Asset import
import heroImg from '../assets/hero-2.jpg';

// Components
import { AnimalImage, NewIcon } from "./Icons";
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
      <BestRatedBanner/>
      <TextBanner
        assignSlogan={'ENJOY YOUR QUALITY TIME WITH QUALITY GAMES'} 
        assignSubtext={'Respect your gaming time with our catalog of best rated games.'}
      />
      
      <CategoriesBanner/>
      <UnderFiveBanner/>
      <TextBanner
        assignSlogan={"GAMERS NEVER STOP"} 
        assignSubtext={'Buy games without hurting your pockets.'}
      />
      <AboutBanner/>
    </>
    </HomePageContext.Provider>
  )
}

const HeroBanner = function () {
  const navigate = useNavigate();

  return (
      <div className="home-banner hero">
        <div className="hero-text">
          <p className='slogan-text'>
            <span>BUY</span>
            <span>PHYSICAL GAMES</span> 
            <span>ONLINE</span>
          </p>
          <p className='sub-text'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis!</p>
          <button className="shop-btn"
            onClick={() => navigate('/shop/catalog/page_1')}
            >Shop now
          </button>
        </div>
        <img src={heroImg} alt='' className='hero-image'/>
    </div>
  )
}

const SpecialOffers = function () {
  const {productsData} = useContext(HomePageContext);
  const itemsPerPage = 6;

  const onSaleItems = productsData.filter(item => item.isOnSale === '1');
  onSaleItems.sort((a, b) => b.savings - a.savings); // Sort from largest discount

  if (onSaleItems.length > 30) {
    onSaleItems.splice(30);
  } else {
    const leastDiscount = onSaleItems.length % itemsPerPage;
    onSaleItems.splice(onSaleItems.length - leastDiscount);
  }

  return (
    <>
      <ProductsBanner
        assignClass={'offers'}
        assignTitle={'SPECIAL OFFERS'}
        assignItemsPerPage={itemsPerPage}
        assignRoute={'/shop/catalog/On sale/page_1'}
        productsList={onSaleItems}
      />
    </>
  )
}

const BestRatedBanner = function () {
  const {productsData} = useContext(HomePageContext);
  const itemsPerPage = 2;
  const bestRated = productsData.filter(item => Number(item.steamRatingPercent) >= 90 );
  bestRated.sort((a, b) => Number(b.steamRatingPercent) - Number(a.steamRatingPercent) );

  if (bestRated.length > 10) {
    bestRated.splice(10);
  } else {
    const leastDiscount = bestRated.length % itemsPerPage;
    bestRated.splice(bestRated.length - leastDiscount);
  }

  return (
    <>
      <ProductsBanner
        assignClass={'best-rated'}
        assignTitle={'BEST RATED GAMES'}
        assignItemsPerPage={itemsPerPage}
        assignRoute={'/shop/catalog/Best rated/page_1'}
        productsList={bestRated}
      />
    </>
  )
}

const TextBanner = function ({assignSlogan, assignSubtext}) {
  return (
    <div className="home-banner text">
      <p className="slogan-text">{assignSlogan}</p>
      <p className="sub-text">{assignSubtext}</p>
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
        onClick={() => navigate(`/shop/catalog/${category}/page_1`)}
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
      <h4 className="banner-header categories">CATEGORIES</h4>
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
  let underFiveProducts = productsData.filter(item => Math.ceil(Number(item.salePrice)) < 5);

  if (underFiveProducts.length > 15 ) {
    underFiveProducts.splice(15);
  } else {
    const extra = underFiveProducts.length % 3;
    underFiveProducts.splice(underFiveProducts.length - extra);
  }
  
  return (
    <>
      <ProductsBanner
        assignClass={'under-five'}
        assignTitle={'UNDER $5'}
        assignItemsPerPage={3}
        assignRoute={`/shop/catalog/Under $5/page_1`}
        productsList={underFiveProducts}
      />
    </>
  )
}

const AboutBanner = function () {

  const AboutContent = function ({assignIcon, assignHeader, assignText}) {
    return (
      <div className="about-detail">
          <div className="about-icon">
            {assignIcon}
          </div>
          <h5 className="about-header">{assignHeader}</h5>
          <p>{assignText}</p>
        </div>
    )
  }

  return (
    <div className="home-banner about">
      <h4 className="banner-header about">LEVEL UP!</h4>
      <div className='about-content'>

        <AboutContent
          assignIcon={<NewIcon assignClass={'cash'}/>}
          assignHeader={'Best Deals'}
          assignText={'We offer competitive offers on our games catalog. Sales are frequently updated.'}
        />

        <AboutContent
          assignIcon={<NewIcon assignClass={'deliver'}/>}
          assignHeader={'Safe Delivery'}
          assignText={'Physical games means delicate discs. A-TIER games insures that your orders are delivered to your doorsteps with proper handling.'}
        />

        <AboutContent
          assignIcon={<NewIcon assignClass={'stars'}/>}
          assignHeader={'Authentic'}
          assignText={'Physical games sent to customers are authentic, brand new and sealed copies. Fresh from the box!'}
        />
      </div>
    </div>
  )
}


export default HomePage