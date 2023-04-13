import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div>
      <div className="nav lg-nav">
        <div className="nav-header">
          <div className="nav-title">
            <Link to="/">
              <img src="/Logo-text.png" alt="logo" />
            </Link>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/">Products</Link>
          <Link to="/">Pricing</Link>
          <Link to="/">Why Us</Link>
          <Link to="/">Resources</Link>
          <Link to="/">Company</Link>
          <button className="btn green">Try it now</button>
          <button className="btn black">Login</button>
        </div>
      </div>

      <div className="sm-nav">
        <header className="sm-header">
          <Link to="/" className="my-auto">
            <img src="/Logo-text.png" alt="logo" className="logo" />
          </Link>

          <input className="side-menu" type="checkbox" id="side-menu" />
          <label className="hamb" for="side-menu">
            <span className="hamb-line"></span>
          </label>
          <nav className="sm-menu">
            <ul className="menu">
              <li>
                <Link to="/">Products</Link>
              </li>
              <li>
                <Link to="/">Pricing</Link>
              </li>
              <li>
                <Link to="/">Why Us</Link>
              </li>
              <li>
                <Link to="/">Resources</Link>
              </li>
              <li>
                <Link to="/">Company</Link>
              </li>
              <li>
                <button className="btn green">Try it now</button>
              </li>
              <li>
                <button className="btn black">Login</button>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
