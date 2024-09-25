import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom"

import { logInProfile } from "../utilities/DataFetch";

import { NewIcon } from "./Icons";


const LogIn = function () {
  const navigate = useNavigate();
  const {loggedIn, setLoggedIn, pathRef} = useOutletContext();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  
  const [loginStatus, setLoginStatus] = useState('none');
  const loginRef = useRef();
  const passwordRef = useRef();
  const inputRefArr = [loginRef, passwordRef];

  const handleLogIn = async function () {
    const loginResult = await logInProfile({username, password});
    
    if (loginResult) {
      setLoggedIn(true);
      setLoginStatus('success');
      navigate(pathRef.current);

    } else if (!loginResult) {
      setLoginStatus('unsuccessful');
    }
  }

  const handleEnterPress = function (event) {
    if (event.keyCode === 13) {
      event.target.blur();

      const currentInputIndex = Number(event.target.dataset.index);
  
      if (currentInputIndex < inputRefArr.length - 1) {
        inputRefArr[currentInputIndex + 1].current.focus();
      } else {
        handleLogIn();
      }
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
              data-index = {0}
              ref={loginRef}
              onKeyDown={handleEnterPress}
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-cont">
            <label htmlFor="login-password">Password</label>
            <input type="password" id='login-password' name='login-password'
              data-index = {1}
              ref={passwordRef}
              onKeyDown={handleEnterPress}
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

        {loginStatus !== 'none' && 
        <LogInStatus loginStatus={loginStatus} setLoginStatus={setLoginStatus}/>
        }
        
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

const LogInStatus = function ({loginStatus, setLoginStatus}) {
  
  let loginMessage = '';
  switch (loginStatus) {
    case 'none':
      loginMessage = ''
      break;
    
    case 'success':
      loginMessage = 'Logged in.'
      break;
    
    case 'unsuccessful':
      loginMessage = 'Log in unsuccessful. Incorrect username or password.'
      break;
  
    default:
      loginMessage = ''
      break;
  }

  return (
    <div className='login-message'
      onAnimationEnd = {(e) => {
        e.target.style.display = 'none'
        setLoginStatus('none')
        }
      }
    >
      <p>{loginMessage}</p>
    </div>
  )
}

export default LogIn