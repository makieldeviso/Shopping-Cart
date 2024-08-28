import loading from '../assets/loading.gif';
import PropTypes from 'prop-types';

const LoadingScreen = function () {
  return (
    <div className={`loading-screen`}>
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

LoadingScreen2.propTypes = {
  assignRef: PropTypes.shape({
    current: PropTypes.oneOf([null, PropTypes.element])
  })
}

export { LoadingScreen, LoadingScreen2 }