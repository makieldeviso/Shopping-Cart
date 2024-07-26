const getAllProducts = async function () {
  try {
    const url = encodeURI('https://fakestoreapi.com/products')
    const itemFetched = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    })

    return await itemFetched.json();

  } catch (err) {
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
  const categories = await getCategories();
  return {products, categories}
} 

export { itemsLoader }