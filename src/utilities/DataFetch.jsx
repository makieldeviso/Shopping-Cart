import dataAddOns from "./products";

const localStorageName = 'shoppingByMakieldeviso';

const getProductsData = async function () {
  try {
    const url = encodeURI('https://www.cheapshark.com/api/1.0/deals?storeID=1&title=goat')
    const itemFetched = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    }).then(item => item.json())

    // Filter items to exact with items in the dataAddOns
    // Add more properties to items
    const filteredItems = await itemFetched.filter(item => Object.hasOwn(dataAddOns, item.gameID));
    const modifiedItems = filteredItems.map(item => {
      return (
        {...item, ...dataAddOns[item.gameID]}
      )
    })

    return modifiedItems

  } catch (err) {
    console.log('error')
    return ([])

  }  
}

let controller = null;

// Mock a user profile fetch
const getProfileData = async function () {

  if (controller) {
    controller.abort({message: 'Request overwritten'});
  }

  controller = new AbortController();
  const signal = controller.signal;

  try {
    const url = encodeURI('https://jsonplaceholder.typicode.com/users/1');
    const mockData = await fetch(url, 
      {
        signal,
        method: 'GET',
        mode: 'cors'
      }
    );

    const userData = await mockData.json();

    let savedProfile = localStorage.getItem(localStorageName);

    if (!savedProfile) {
      userData.name = 'Liam Smith';
      userData.address = 'Texas, USA';
      userData.phone = '1234567890';
      userData.username = 'Agent_LSmith';
      userData.cart = [];
      userData.toShip = [];
      userData.toReceive = [];
      userData.delivered = [];

      localStorage.setItem(localStorageName, JSON.stringify(userData));
      savedProfile = localStorage.getItem(localStorageName);
    }
 
    return JSON.parse(savedProfile);

  } catch (error) {
    console.log(error.message)
  }
}

// Update profile
const updateProfileData = async function (updateObj) {
  let savedProfile = await JSON.parse(localStorage.getItem(localStorageName));
  const modifiedData = {...savedProfile, ...updateObj}

  try {
    const url = encodeURI('https://jsonplaceholder.typicode.com/users/1');
    const patch = await fetch(url, 
      {
        method: 'PATCH',
        mode: 'cors',
        body: JSON.stringify(modifiedData),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      }
    );

    const updatedProfile = await patch.json();
    
    // Mock successful patch, save to local storage
    localStorage.setItem(localStorageName, JSON.stringify(updatedProfile));
    
    return JSON.parse(savedProfile);

  } catch (error) {
    console.log(error.message)
  }
}

// Add to Cart script
// Note: Mock a fetch PATCH to modify cart array in the user profile data
const addToCartData = async function (profileData, newCart) {
  
  // destructure profile, modify cart property
  const modifiedProfile = {...profileData, cart: newCart};

  if (controller) {
    controller.abort({message: 'Request overwritten'});
  }

  controller = new AbortController();
  const signal = controller.signal;

  try {
    const url = encodeURI(`https://jsonplaceholder.typicode.com/users/${profileData.id}`)
    const updateCart = await fetch(url, 
      {
        signal,
        method: 'PATCH',
        body: JSON.stringify(modifiedProfile),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      }
    );

    const cartData = await updateCart.json();
    // Mock successful patch, save to local storage
    localStorage.setItem(localStorageName, JSON.stringify(cartData));

  } catch (error) {
    console.log(error.message)
  }
}

// Edit Cart 
const changeCartItemQuantity = async function (cartData) {

  const profileData = await getProfileData();
  
  // Note: addToCartData function updates the profile
  addToCartData(profileData, cartData);
  return profileData;
}

// Checkout Items, Move selected cart items to toShip, then add new details
const addCheckoutItems = async function (cartData, toShipData ) {
  const profileData = await getProfileData();

  const modifiedProfile = {...profileData, cart: cartData, toShip: toShipData}
  
  try {
    const url = encodeURI(`https://jsonplaceholder.typicode.com/users/${profileData.id}`)
    const updateProfile = await fetch(url, 
      {
        method: 'PATCH',
        body: JSON.stringify(modifiedProfile),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      }
    );

    const newProfileData = await updateProfile.json();
    // Mock successful patch, save to local storage
    localStorage.setItem(localStorageName, JSON.stringify(newProfileData));

  } catch (error) {
    console.log(error.message)
  }
}


// Loaders -------------
const shopLoader = async function () {
  const [productsData] = await Promise.all(
    [
      await getProductsData()
    ]
  );
 
  return { productsData } ;
}

const cartLoader = async function () {
  const [profileData, productsData] = await Promise.all(
    [
      await getProfileData(),
      await getProductsData()
    ]
  );
 
  return { profileData, productsData };
}


// Note: this is a placeholder profile fetch
// Fetches data from jsonplaceholder and uses local storage to save data
const profileLoader = async function () {
  const profileData = await getProfileData();
  return { profileData }
}

const pageLoader = async function () {
  const [profileData, productsData] = await Promise.all(
    [
      await getProfileData(), 
      await getProductsData()
    ]
  );
 
  return { profileData, productsData };
}

export { 
  // scripts
  getProfileData,
  updateProfileData,
  addToCartData,
  changeCartItemQuantity,
  addCheckoutItems,

  // loaders
  shopLoader, cartLoader, profileLoader, pageLoader 
}