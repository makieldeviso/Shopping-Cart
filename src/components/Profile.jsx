import { useContext, useRef, useState } from "react"
import { NavLink, useLoaderData } from "react-router-dom"

import { format } from "date-fns";
import { amountFormat, capitalizeString, updateProfile } from "../utilities/utilities";
import { NewIcon } from "./Icons";

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
          {/* <div className='batch-mailing'>
            <p>{batch.mailing.name} | {batch.mailing.phone}</p>
            <p>{batch.mailing.address}</p>
          </div> */}

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

  return (
    <div className='to-ship-content'>
      {toShipItems}
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
    const [tempAddress, setTempAddress] = useState(address);
    const [tempPhone, setTempPhone] = useState(phone);

    const handleSaveProfileChange = function (event) {
      const btnAction = event.target.value;

      if (btnAction === 'save') {
        updateProfile({
          name: tempName,
          address: tempAddress,
          phone: tempPhone,
        })

        // Update main states with the temporary states
        setName(tempName);
        setAddress(tempAddress);
        setPhone(tempPhone);

      } else if (btnAction === 'cancel') {
        setTempName(name);
        setTempAddress(address);
        setTempPhone(phone);
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
        
          <div className={`profile-name input-cont`}>
            <label htmlFor={`user-name`}>Name</label>
            <input type="text" data-class='name' id={`user-name`} name={`user-name`}
              onChange = {(event) => setTempName(event.target.value)}
              value = {tempName}
            />
          </div>

          <div className={`profile-address input-cont`}>
            <label htmlFor={`user-address`}>Address</label>
            <textarea data-class='address' id={`user-address`} name={`user-address`}
              style = {{resize: 'none'}}
              rows = '2'
              onChange = {(event) => setTempAddress(event.target.value)}
              value = {tempAddress}
            />
          </div>

          <div className={`profile-phone input-cont`}>
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
            />
          </div>
          
          <div className="action-btns">
            <button className='cancel-btn' value='cancel' type='button' onClick={handleSaveProfileChange}>Cancel</button>
            <button className='save-btn' value='save' type='button' onClick={handleSaveProfileChange}>Save</button>
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
  
  return (
    <div className="profile-page">
      
      <h2>Profile</h2>

      <div className="profile-display">
        <UserProfile profileData={profileData}/>
        
        <div className='purchase-display'>
        <ToShip profileData={profileData}/>
      </div>

      </div>
      
      <button type="button" onClick={() => console.log(profileData.toShip)}>
        Check profile
      </button>
    </div>
  )
}

export default Profile