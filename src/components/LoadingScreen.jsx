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

const LoadingScreen2 = function ({assignRef}) {
  return (
    <div className={`loading-screen hidden alt`} ref={assignRef}>
      <div className="spinner">
        <img src={loading} alt="loading spinner" width='50' height='50'/>
        <p>Loading</p>
      </div>
    </div>
  )
}

export {LoadingScreen, LoadingScreen2}