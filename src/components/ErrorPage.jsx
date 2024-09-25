import { useRouteError, NavLink } from "react-router-dom";

import { NewIcon } from "./Icons";

const ErrorPage = function () {
  const error = useRouteError();

  const notFound = (/Not found/i).test(error.statusText);
  const errorMessage = notFound ? 'Page not found' : 'Failed connection';
  
  return (
    <div className='error-page'>
      <div className="error-cont">
        <h1>Error</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>{errorMessage}</p>
        <NavLink to='/' className={'home-link'}>
          <NewIcon assignClass={'home'}/>
          Return to home
        </NavLink>
      </div>
    </div>
  )
}

export default ErrorPage;