import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import { amountFormat } from "../utilities/utilities";

// Create products for display
// Takes list of products (array) as argument
const ProductsDisplay = function ({productsList}) {
  const navigate = useNavigate();

  const productDisplay = productsList.map(item => {
    const isOnSale = item.isOnSale === "1";
    return (
      <div key={item.gameID} className='shop-item' data-gameid={item.gameID} 
        onClick={() => navigate(`/shop/product/${item.gameID}`)}
      >
        <img src={item.header} alt={`item-${item.gameID} preview`} className='item-preview'/>
        <p title={item.title} className='catalog-desc title'>{item.title}</p>

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
  productsList: PropTypes.array
}

export default ProductsDisplay;