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

// Mock a user profile fetch
const getProfileData = async function () {
  try {
    const url = encodeURI('https://jsonplaceholder.typicode.com/users/1');
    const mockData = await fetch(url, 
      {
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

      localStorage.setItem(localStorageName, JSON.stringify(userData));
      savedProfile = localStorage.getItem(localStorageName);
    }
 
    return JSON.parse(savedProfile);

  } catch (error) {
    console.log(error)
  }
}

// Add to Cart script
// Note: Mock a fetch PATCH to modify cart array in the user profile data
const addToCartData = async function (profileData, newCart) {
  
  // destructure profile, modify cart property
  const modifiedProfile = {...profileData, cart: newCart};

  try {
    const url = encodeURI(`https://jsonplaceholder.typicode.com/users/${profileData.id}`)
    const updateCart = await fetch(url, 
      {
        method: 'PATCH',
        body: JSON.stringify(modifiedProfile),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      }
    );

    const cartData = await updateCart.json();
    // Mock successful patch, save to local storage
    localStorage.setItem(localStorageName, JSON.stringify(cartData));

  } catch (error) {
    console.log(error)
  }
}


// Loaders -------------
const shopLoader = async function () {
  const [productsData] = await Promise.all(
    [
      await getProductsData()
    ]
  );
 
  return [ productsData ];
}


// Note: this is a placeholder profile fetch
// Fetches data from jsonplaceholder and uses local storage to save data
const profileLoader = async function () {
  const profile = await getProfileData();
  return { profile }
}

const pageLoader = async function () {
  const [profileData, productsData] = await Promise.all(
    [
      await getProfileData(), 
      await getProductsData()
    ]
  );
 
  return [ profileData, productsData ];
}

export { 
  // scripts
  addToCartData,
  getProfileData,

  // loaders
  shopLoader, profileLoader, pageLoader 
}