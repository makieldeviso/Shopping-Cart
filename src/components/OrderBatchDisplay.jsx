// React
import PropTypes from 'prop-types';

// Scripts/ Utilities
import { amountFormat } from "../utilities/utilities";

// Components
import { NewIcon } from "./Icons";

const ProductsOrderBatch = function ({orderBatch}) {
  // Order batch -> array of products ordered
  const { items } = orderBatch;

  const OrderItems = items.map(item => {
    const isOnSale = item.isOnSale === '1';
    return (
      <div key={item.gameID} className="order-item">
        <img className='order preview' src={item.header} alt={`${item.gameID} preview`}/>
        <p className="order title">{item.title}</p>

        <div className={`order prices ${isOnSale ? 'sale' : ''}`}>
          {isOnSale && <p className='discount'>{`-${Number.parseFloat(item.savings).toPrecision(2)}%`}</p>}
          {isOnSale && <p className='normal-price'>{amountFormat(item.normalPrice)}</p>}
          <p className='disc-price'>{amountFormat(item.salePrice)}</p>  
        </div>

        <p className="order quantity">x{item.quantity}</p>
        <p className="order total-price">{amountFormat(item.quantity * item.salePrice)}</p>
      </div>
    )
  })

  return (
    <div className="batch order-list">
      {OrderItems}
    </div>
  )
}

ProductsOrderBatch.propTypes = {
  orderBatch: PropTypes.shape({
    items: PropTypes.array,
  })
}

const AmountOrderBatch = function ({orderBatch}) {
  const { subAmount, delivery, totalAmount } = orderBatch;

  return (
    <div className='batch calculate'>
      <p className="batch sub">
        <span>Sub-total:</span>
        <span className="batch-price">{amountFormat(subAmount)}</span>
      </p>
      <p className="batch delivery">
        <span>Delivery Fee:</span>
        <span className="batch-price">
          {delivery === 0 ? 'Free' :amountFormat(delivery)}
        </span>
      </p>
      <p className="batch total">
        <span>Order Total:</span>
        <span className="batch-price">{amountFormat(totalAmount)}</span>
      </p>
    </div>
  )
}

AmountOrderBatch.propTypes = {
  orderBatch: PropTypes.shape({
    subAmount: PropTypes.number,
    delivery: PropTypes.number,
    totalAmount: PropTypes.number
  })
}

const MailingOrderBatch = function ({orderBatch}) {

  const { mailing } = orderBatch;

  return (
    <div className='batch mailing'>
      <NewIcon assignClass={'send'}/>
      <p>{mailing.name} | {mailing.phone}</p>
      <p>{mailing.address}</p>
    </div>
  )
}

MailingOrderBatch.propTypes = {
  orderBatch: PropTypes.shape({
    mailing: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
    })
  })
}


export {ProductsOrderBatch, AmountOrderBatch, MailingOrderBatch}