import { useContext, useRef, useState } from "react"
import { NavLink, useLoaderData } from "react-router-dom"

import { ShoppingContext } from "./App"
import { format } from "date-fns";
import { amountFormat, capitalizeString, updateProfile } from "../utilities/utilities";
import { NewIcon } from "./Icons";

const ForShip = function () {
  const { forShipData } = useContext(ShoppingContext);

  // Reiterate for ship items by batch
  const forShipItems = forShipData.current.map(batch => {

    // Reiterate the items per batch
    const batchItems = batch.items.map( item => {
      return (
        <div key={item.id} className="order-list">
          <img className='order-img' src={item.image} alt={`${item.id} preview`} width={100} />
          <p className="order-title">{item.title}</p>
          <p className="order-unit-price">{amountFormat(item.price)}</p>
          <p className="order-quantity">x{item.quantity}</p>
          <p className="order-total-price">{amountFormat(item.quantity * item.price)}</p>
        </div>
      )
    })

    return (
      <div key={crypto.randomUUID()} className="order-batch">
        <p className="batch-date">Ordered {format(new Date(batch.timeStamp), 'd-MMM-yyyy')}</p>
        {batchItems}
        
        <div className="batch-details">
          <div className='batch-mailing'>
            <p>{batch.mailing.name} | {batch.mailing.phone}</p>
            <p>{batch.mailing.address}</p>
          </div>

          <div className='batch-calculate'>
            <p className="batch-amount sub">
              <span>Sub-total:</span>
              <span className="batch-price">{amountFormat(batch.subAmount)}</span>
            </p>
            <p className="batch-amount delivery">
              <span>Delivery Fee:</span>
              <span className="batch-price">
                {batch.delivery === 0 ? 'Free' :amountFormat(batch.delivery)}
              </span>
            </p>
            <p className="batch-amount total">
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
      {forShipItems}
    </div>
  )
}

const UserProfile = function ({userProfile}) {
  const [name, setName] = useState(userProfile.name);
  const [address, setAddress] = useState(userProfile.address);
  const [phone, setPhone] = useState(userProfile.phone);

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
  const { forShipData } = useContext(ShoppingContext);
  const userProfile = useLoaderData();
  
  return (
    <div className="profile-page">
      
      <h2>Profile</h2>

      <UserProfile userProfile={userProfile}/>

      <div className='purchase-display'>
        <ForShip/>
      </div>
      
      <button type="button" onClick={() => console.log(forShipData.current)}>
        Check profile
      </button>
    </div>
  )
}

export default Profile