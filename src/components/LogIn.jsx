import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom"

import { logInProfile } from "../utilities/DataFetch";

import { NewIcon } from "./Icons";


const LogIn = function () {
  const navigate = useNavigate();
  const {loggedIn, setLoggedIn, pathRef} = useOutletContext();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  
  const handleLogIn = async function () {
    const loginResult = await logInProfile({username, password});
    
    if (loginResult) {
      setLoggedIn(true);
      navigate(pathRef.current)
    }
    
  }

  return (
    <div className="login-page">
      <div className="login-cont">
        <h3 className="login-header header">Log in to your account</h3>
        <div className="login-form">
          <div className="input-cont">
            <label htmlFor="login-username">Username</label>
            <input type="text" id='login-username' name='login-username'
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-cont">
            <label htmlFor="login-password">Password</label>
            <input type="password" id='login-password' name='login-password'
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className='login-btn'
            onClick={handleLogIn}
          >
            Log In
          </button>
        </div>

        <HelpMessage/>
        
      </div>
    </div>
  )
}

const HelpMessage = function () {
  const [helpState, setHelpState] = useState(true);

  const handleOpenHelp = function (event) {
    const buttonValue = event.target.value;
    if (buttonValue === 'close') {
      setHelpState(false);
    } else {
      setHelpState(true);
    }
  }

  const OpenedHelp = function () {
    return (
      <div className='login-help'>
        <button className="login-help-btn close" value={'close'}
          onClick={handleOpenHelp}
        >
          <NewIcon assignClass={'close'}/>
        </button>
        <p>As a frontend showcase project, this website don&apos;t have an authentication algorithm. 
          This feature was added to make use of react router protected routes concept. 
          Use the following credentials to log in:</p>
        <div className="login-cred">
          <p>Username: default</p>
          <p>Password: Password123!</p>
        </div>
    </div>
    )
  }

  const ClosedHelp = function () {
    return (
      <button className="login-help-btn" value={'open'}
        onClick={handleOpenHelp}
      >
        <NewIcon assignClass={'help'}/>
      </button>
    )
  }

  return (
    <>{helpState ? <OpenedHelp/> : <ClosedHelp/>}</>
  )
}




export default LogIn