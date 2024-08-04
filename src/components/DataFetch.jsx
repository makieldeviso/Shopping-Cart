import dataAddOns from "../utilities/products";

const getAllProducts = async function () {
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

const getCategories = async function () {
  try {
    const url = encodeURI('https://fakestoreapi.com/products/categories')
    const itemFetched = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    })

    return await itemFetched.json();

  } catch (err) {
    return ([])
  }  
}

const loadingScreen = function () {
  return (
    <dialog>
      <p>Loading...</p>
    </dialog>
  )
}

const itemsLoader = async function () {
  const products = await getAllProducts();
  return {products}
} 

const profileLoader = async function () {
  let savedProfile = localStorage.getItem('shoppingByMakieldeviso');

  if (!savedProfile) {
    const placeholderProfile = {
      name: 'John Doe',
      address: 'Tacloban, Leyte, Philippines',
      phone: '12346789'
    }

    localStorage.setItem('shoppingByMakieldeviso', JSON.stringify(placeholderProfile))
    savedProfile = localStorage.getItem('shoppingByMakieldeviso');
  }
 
  return JSON.parse(savedProfile);
}


// Adds items to cart
const addToCart = async function () {
  const cartItem = await fetch('https://fakestoreapi.com/carts',{
    method:"POST",
    body:JSON.stringify(
        {
            userId:1,
            date: new Date(),
            products:[{productId:5,quantity:1},{productId:1,quantity:5}]
        }
    )
  })

  console.log(await cartItem.json());
}

// Loads cart
const cartLoader = async function () {

}






export { itemsLoader, profileLoader, addToCart }