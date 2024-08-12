// React
import { useRef, useState } from "react"
import { useLoaderData, Outlet, useParams, useOutletContext, useNavigate, useLocation } from "react-router-dom"

// Scripts
import { format } from "date-fns";
import { amountFormat, capitalizeString } from "../utilities/utilities";

// Data fetch
import { updateProfileData } from "../utilities/DataFetch";

// Components
import { NewIcon } from "./Icons";
import { PageContext } from "./App";

const PurchaseDisplay = function () {
  const { displayid } = useParams();
  const outletContext = useOutletContext();

  let displayComponent = null;

  switch (displayid) {
    case 'to-ship':
      displayComponent = <ToShip profileData={outletContext.profileData}/>
      break;
    
    case 'to-receive':
      displayComponent = <ToReceive profileData={outletContext.profileData}/>
      break;
    
    case 'delivered':
      displayComponent = <Delivered profileData={outletContext.profileData}/>
      break;
  
    default:
      break;
  }

  return (<>{displayComponent}</>)
}

const ToShip = function ({profileData}) {
  const toShipData = profileData.toShip;

  // Reiterate for ship items by batch
  const toShipItems = toShipData.map(batch => {
    // Reiterate the items per batch
    const batchItems = batch.items.map( item => {
      const isOnSale = item.isOnSale === '1';
      return (
        <div key={item.gameID} className="order-list">
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
      <div key={crypto.randomUUID()} className="batch-container">
        <p className="batch date">Ordered {format(new Date(batch.timeStamp), 'd-MMM-yyyy')}</p>
        {batchItems}
        
        <div className="batch details">
          <div className='batch mailing'>

            <NewIcon assignClass={'send'}/>
            <p>{batch.mailing.name} | {batch.mailing.phone}</p>
            <p>{batch.mailing.address}</p>
          </div>

          <div className='batch calculate'>
            <p className="batch sub">
              <span>Sub-total:</span>
              <span className="batch-price">{amountFormat(batch.subAmount)}</span>
            </p>
            <p className="batch delivery">
              <span>Delivery Fee:</span>
              <span className="batch-price">
                {batch.delivery === 0 ? 'Free' :amountFormat(batch.delivery)}
              </span>
            </p>
            <p className="batch total">
              <span>Order Total:</span>
              <span className="batch-price">{amountFormat(batch.totalAmount)}</span>
            </p>
          </div>
        </div>
        
      </div>
    )
  })

  const EmptyToShip = function () {
    return (
      <div className="empty container to-ship">
          <NewIcon assignClass={'box-empty'}/>
          <p className="empty message">Nothing to ship</p>
      </div>
    ) 
  }

  return (
    <div className='to-ship-content'>
      {!toShipData.length && <EmptyToShip/>}
      {toShipItems}
    </div>
  )
}


const ToReceive = function ({profileData}) {
  const toReceiveData = profileData.toReceive;

  // Note: No logic for to receive
  // Adds placeholder content/ empty toReceive
  
  const EmptyToReceive = function () {
    return (
      <div className="empty container to-receive">
          <NewIcon assignClass={'truck-empty'}/>
          <p className="empty message">No incoming delivery</p>
      </div>
    ) 
  }

  return (
    <div className="to-receive-content">
      {!toReceiveData.length && <EmptyToReceive/>}
    </div>
  )
}

const Delivered = function ({profileData}) {
  const deliveredData = profileData.delivered;

  // Note: No logic for delivered
  // Adds placeholder content/ empty delivered
  
  const EmptyDelivered = function () {
    return (
      <div className="empty container delivered">
          <NewIcon assignClass={'empty'}/>
          <p className="empty message">No items delivered yet</p>
      </div>
    ) 
  }

  return (
    <div className="to-receive-content">
      {!deliveredData.length && <EmptyDelivered/>}
    </div>
  )
}

const UserProfile = function ({profileData}) {
  const [name, setName] = useState(profileData.name);
  const [address, setAddress] = useState(profileData.address);
  const [phone, setPhone] = useState(profileData.phone);

  const editDialogRef = useRef(null);

  const EditDialog = function () {
    const [tempName, setTempName] = useState(name);
    const [tempPhone, setTempPhone] = useState(phone);
    const [tempAddress, setTempAddress] = useState(address);
    
    const handleSaveProfileChange = async function (event) {
      const btnAction = event.target.value;

      if (btnAction === 'save') {
        updateProfileData({
          name: tempName,
          address: tempAddress,
          phone: tempPhone,
        })

        // Update profileDataRef with new saved profile
        setName(tempName) ;
        setPhone(tempPhone);
        setAddress(tempAddress);

      } else if (btnAction === 'cancel') {
        setTempName(name);
        setTempPhone(phone);
        setTempAddress(address);
      }
    
      editDialogRef.current.close();
    }

    return (
      <dialog className="edit-profile-dialog" ref={editDialogRef}>
        <div className="dialog-cont">

          <div className='dialog-header'>
            <h3 >Update your profile</h3>
            <button 
              className="close-dialog-btn"
              type='button' 
              title='Close'
              aria-label="Close edit dialog"
              onClick={() => editDialogRef.current.close()}>
              <NewIcon assignClass={'close'}/>
            </button>
          </div>
        
          <div className={`edit-profile name input-cont`}>
            <label htmlFor={`user-name`}>Name</label>
            <input type="text" data-class='name' id={`user-name`} name={`user-name`}
              onChange = {(event) => setTempName(event.target.value)}
              value = {tempName}
              className={tempName.length === 0 ? 'invalid' : ''}
              placeholder="Enter name"
              required
            />
          </div>

          <div className={`edit-profile phone input-cont`}>
            <label htmlFor={`user-phone`}>Phone</label>
            <input type="text" data-class='phone' id={`user-phone`} name={`user-phone`}
              onChange = {(event) => {
                const eventData = event.nativeEvent.data;
                const numberRegex = /[0-9]/;
                const validateInput = numberRegex.test(eventData);
                if (validateInput || eventData === null) {
                  setTempPhone(event.target.value);
                }
              }}
              value = {tempPhone}
              className={tempPhone.length === 0 ? 'invalid' : ''}
              placeholder="Enter phone contact number"
              required
            />
          </div>

          <div className={`edit-profile address input-cont`}>
            <label htmlFor={`user-address`}>Address</label>
            <textarea data-class='address' id={`user-address`} name={`user-address`}
              style = {{resize: 'none'}}
              rows = '2'
              onChange = {(event) => setTempAddress(event.target.value)}
              value = {tempAddress}
              className={tempAddress.length === 0 ? 'invalid' : ''}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="action-btns">
            <button className='cancel-btn' value='cancel' type='button' onClick={handleSaveProfileChange}>Cancel</button>
            <button 
              className='save-btn' value='save' type='button' 
              onClick = { handleSaveProfileChange }
              disabled = {tempName.length === 0 || tempPhone === 0 || tempAddress === 0 ? true : false}
            >Save
            </button>
          </div>
          
        </div>
        
      </dialog>
    )
  }
  
  const ProfileInfo = function ({assignLabel, assignState}) {
    return (
      <div className='profile'>
        <p className='profile-label'>{capitalizeString(assignLabel)}</p>
        <p className='profile-info'>{assignState}</p>
      </div>
    )
  }

  return (
    <div className='user-profile'>
      <div className='user-details-cont'>
        <ProfileInfo assignLabel={'name'} assignState={name}/>
        <ProfileInfo assignLabel={'phone'} assignState={phone}/>
        <ProfileInfo assignLabel={'address'} assignState={address}/>
      </div>
      <button 
        className="edit-profile-btn" 
        aria-label="Edit Profile Information"
        title="Edit Profile Information"
        onClick = {() => editDialogRef.current.showModal()}
      >
        <NewIcon assignClass={'edit'}/>
      </button>
      <EditDialog/>
    </div>
  )
}

const Profile = function () {
  const { profileData } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('to-ship');

  const handleChangePurchaseTab = function (event) {
    const route = event.target.value;
    const path = location.pathname;

    // If user click same button as route, cancel request to navigate
    if (path.includes(route)) {
      return
    }

    setActiveTab(route);
    navigate(route);
  }

  return (
    <div className="profile-page">
      <h2>Profile</h2>

      <div className="profile-display">
        <UserProfile profileData={profileData}/>

        <div className='purchase-tabs'>
          <button value='to-ship' onClick={handleChangePurchaseTab}
            className={activeTab === 'to-ship' ? 'active' : ''}
          >
            <NewIcon assignClass={'send'}/>
            <span>To Ship</span>
          </button>
          <hr />
          <button value='to-receive' onClick={handleChangePurchaseTab}
            className={activeTab === 'to-receive' ? 'active' : ''}
          >
            <NewIcon assignClass={'deliver'}/>
            <span>To Receive</span>
          </button>
          <hr />
          <button value='delivered' onClick={handleChangePurchaseTab}
            className={activeTab === 'delivered' ? 'active' : ''}
          >
            <NewIcon assignClass={'delivered'}/>
            <span>To Ship</span>
          </button>
        </div>

        <div className='purchase-display'>
          <Outlet context={{profileData}}/>
        </div>

      </div>
    </div>
  )
}


export { Profile, PurchaseDisplay}