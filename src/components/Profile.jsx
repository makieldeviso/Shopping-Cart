// React
import { useEffect, useRef, useState } from "react";
import { useLoaderData, Outlet, useParams, useOutletContext, useNavigate, useLocation, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

// Scripts
import { format } from "date-fns";
import { capitalizeString } from "../utilities/utilities";

// Data fetch
import { updateProfileData } from "../utilities/DataFetch";

// Components
import { NewIcon } from "./Icons";
import { ProductsOrderBatch, AmountOrderBatch, MailingOrderBatch } from "./OrderBatchDisplay";

const PurchaseDisplay = function () {
  const { displayid } = useParams();
  const outletContext = useOutletContext();

  let displayComponent = null;

  switch ( displayid ) {
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
    
    return (
      <div key={crypto.randomUUID()} className="batch-container">
        <p className="batch date">Ordered {format(new Date(batch.timeStamp), 'd-MMM-yyyy')}</p>

        <ProductsOrderBatch orderBatch={batch}/>
        
        <div className="batch details">
          <MailingOrderBatch orderBatch={batch}/>
          <AmountOrderBatch orderBatch={batch}/>
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

ToShip.propTypes = {
  profileData: PropTypes.shape({
    toShip: PropTypes.array
  })
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

ToReceive.propTypes = {
  profileData: PropTypes.shape({
    toReceive: PropTypes.array
  })
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

Delivered.propTypes = {
  profileData: PropTypes.shape({
    delivered: PropTypes.array
  })
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

          <button 
            className="close-dialog-btn"
            type='button' 
            title='Close'
            aria-label="Close edit dialog"
            onClick={() => editDialogRef.current.close()}>
            <NewIcon assignClass={'close'}/>
          </button>

          <h3 className='dialog-header'> Update your profile</h3>
          
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
              style = {{resize: 'vertical', 'maxHeight': '200px', 'minHeight': '70px'}}
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

  ProfileInfo.propTypes = {
    assignLabel: PropTypes.string,
    assignState: PropTypes.string,
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

UserProfile.propTypes = {
  profileData: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  })
}

const Profile = function () {
  // Authentication (start)
  const navigate = useNavigate();
  const location = useLocation();
  const {loggedIn, pathRef} = useOutletContext();

  // Navigate to login page if not logged in
  useEffect(() => {
    pathRef.current = location.pathname;
    if (!loggedIn) navigate('/login');
  })
  // Authentication (end)
  
  const { profileData } = useLoaderData();
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

export default Profile
export { PurchaseDisplay }