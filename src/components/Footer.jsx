import { NewIcon } from "./Icons"

const Footer = function () {
  return (
    <footer>
      <div className='footer-content'>
        
        <div className="author-info">
          <NewIcon assignClass={'copyright'}/>
          <p>2024</p>
          <p>Fred Mark Baldeviso</p>
          <a className='github-link' href="https://github.com/makieldeviso" target="_blank">
            <NewIcon assignClass={'github'}/>
            makieldeviso
          </a>
        </div>

        <div className="disclaimer">
          <p>
          This is a personal portfolio project, and does not sell any real products. Most of the data reflected on this website was fetched from
          <a href="https://apidocs.cheapshark.com/" target="_blank">cheapshark API</a> 
          and some photo assets from the steam store 
          <a href="https://store.steampowered.com/">Steam store</a>
          using source url.
          </p>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer