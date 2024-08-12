import loading from '../assets/loading.gif'

const LoadingScreen = function () {
  return (
    <div className={`loading-screen` }>
      <div className="spinner">
        <img src={loading} alt="loading spinner" width='50' height='50'/>
        <p>Loading</p>
      </div>
    </div>
  )
}

export default LoadingScreen