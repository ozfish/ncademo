import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const NotFoundPage = () => {
  
  return <div>
    <Navbar/>
    <div>
      <div>
        <h1>Not found</h1>
      </div>
      <div>
        <Link to="/">Home</Link>
      </div>
    </div>
  </div>

};

export default NotFoundPage;
