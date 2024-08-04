import dataAddOns from "./products";

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

const itemsLoader = async function () {
  const products = await getProductsData();
  return { products }
} 

// Mock a user fetch
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
    userData.name = 'Liam Smith';
    userData.address = 'Texas, USA';
    userData.phone = '1234567890';
    userData.username = 'Agent_LSmith';
    userData.cart = [];

    let savedProfile = localStorage.getItem('shoppingByMakieldeviso');

    if (!savedProfile) {
      localStorage.setItem('shoppingByMakieldeviso', JSON.stringify(userData));
      savedProfile = localStorage.getItem('shoppingByMakieldeviso');
    }
 
    return JSON.parse(savedProfile);

  } catch (error) {
    console.log(error)
  }
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


export { itemsLoader, profileLoader, pageLoader }