import { useContext, useRef, useState } from "react"
import { NavLink } from "react-router-dom"

import { ShoppingContext } from "./App"
import { format } from "date-fns";

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
          <p className="order-unit-price">${item.price}</p>
          <p className="order-quantity">x{item.quantity}</p>
          <p className="order-total-price">${item.quantity * item.price}</p>
        </div>
      )
    })

    return (
      <div key={crypto.randomUUID()} className="order-batch">
        <p className="batch-date">{format(new Date(batch.timeStamp), 'd-MMM-yyyy')}</p>
        {batchItems}
        <p className="batch-total">Order Total: ${batch.totalAmount}</p>
      </div>
    )
  })

  return (
    <div className='to-ship-content'>
      {forShipItems}
    </div>
  )
}

const UserProfile = function () {
  const [name, setName] = useState('John Doe');
  const [address, setAddress] = useState('Maharlika Highway, Tacloban, Philippines');
  const [phone, setPhone] = useState('01234567890');

  const nameInputRef = useRef(null);
  const addressInputRef = useRef(null);

  const handleUserChange = function (event) {
    const targetState = event.target.dataset.class;
    
    let stateSetter;
    if (targetState === 'name') {
      stateSetter = setName;
    } else if (targetState === 'address') {
      stateSetter = setAddress
    }

    stateSetter(event.target.value);
  }

  const handleEnableEdit = function (event) {
    const targetState = event.target.dataset.class;

    let inputElement;
    if (targetState === 'name') {
      inputElement = nameInputRef.current;
    } else if (targetState === 'address') {
      inputElement = addressInputRef.current;
    }

    inputElement.disabled = false;
    inputElement.focus();
  }

  const handleDisableInput = function (event) {
    event.target.disabled = true;
  }

  return (
    <div className='user-profile'>
      <div className="profile-name">
        <label htmlFor="user-name">Name:</label>
        <input
          ref={nameInputRef}
          disabled
          data-class='name'
          type="text"
          id='user-name'
          name='user-name'
          onChange={handleUserChange}
          onBlur={handleDisableInput}
          value={name}/>
          <button data-class='name' onClick={handleEnableEdit}>Edit</button>
      </div>

      <div className="profile-address">
        <label htmlFor="user-name">Address:</label>
        <textarea
          ref={addressInputRef}
          disabled
          data-class='address'
          id='user-address'
          name='user-address'
          onChange={handleUserChange}
          onBlur={handleDisableInput}
          value={address}/>
        <button data-class='address' onClick={handleEnableEdit}>Edit</button>
      </div>
    </div>
  )
}


const Profile = function () {
  const { forShipData } = useContext(ShoppingContext);

  return (
    <div>
      
      <h2>Profile</h2>

      <UserProfile/>

      <ForShip/>





      <NavLink to='/'>Home</NavLink>
      <button type="button" onClick={() => console.log(forShipData.current)}>
        Check profile
      </button>
    </div>
  )
}

export default Profile