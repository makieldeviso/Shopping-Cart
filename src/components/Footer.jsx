import { useNavigate } from "react-router-dom"
import { deleteLocalStorage } from "../utilities/DataFetch"

import { NewIcon } from "./Icons"

const AuthorContent = function () {
  return (
    <div className="author-info">
          <NewIcon assignClass={'copyright'}/>
          <p>{(new Date()).getFullYear()}</p>
          <p>Fred Mark Baldeviso</p>
          <a className='github-link' href="https://github.com/makieldeviso" target="_blank">
            <NewIcon assignClass={'github'}/>
            makieldeviso
          </a>
        </div>
  )
}

const DisclaimerContent = function () {
  return (
    <div className="disclaimer">
      <p>
        This is a personal portfolio project, and does not sell any real products. Most of the data reflected on this website was fetched from
        <a href="https://apidocs.cheapshark.com/" target="_blank">cheapshark API</a> 
        and some photo assets from the steam store 
        <a href="https://store.steampowered.com/">Steam store</a>
        using source url.
      </p>
    </div>
  )
}

const DeleteLocalStorage = function () {
  const navigate = useNavigate();

  const handlePageReset = async function () {
    const resetStatus = await deleteLocalStorage();
    if (resetStatus) navigate('/home');
    window.scrollTo({top: 0});
  }

  return (
    <div className='delete-local'>
      <p>This webpage uses your local storage to save some data.</p>
      <p>Click &#8220;Reset Page&#8221; button to restart this page&apos;s display and data in your local storage.</p>
      <button className='reset-btn' onClick={handlePageReset}>Reset Page</button>
    </div>
  )
}

const Footer = function () {
  return (
    <footer>
      <div className='footer-content'>
        
        <AuthorContent/>
        <DisclaimerContent/>
        <DeleteLocalStorage/>
        
      </div>
    </footer>
  )
}

export default Footer