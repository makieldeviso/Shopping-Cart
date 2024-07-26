import { useRouteError, NavLink } from "react-router-dom";

const ErrorPage = function () {
  const error = useRouteError();
  console.log(error);

  return (
    <div id='error-page'>
      <h1>Opps!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <NavLink to='/'>Home</NavLink>

    </div>
  )
}

export default ErrorPage;