import "./App.css";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./page/Home";
import NewCategory from "./page/NewCategory";
import Firebase from "./provider/firebase";
import Product from "./page/Product";
import NewProduct from "./page/NewProduct";
import Setting from "./page/Setting";

function App() {
  return (
    <Firebase>
      <div className="">
        <Router>
          <nav
            className="navbar navbar-dark
				 bg-success"
          >
            <div className="container">
              <div className="d-flex ">
                <div className="nav-item">
                  <NavLink
                    className="nav-link text-white"
                    aria-current="page"
                    to="/"
                  >
                    Home
                  </NavLink>
                </div>
                <div className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/products"
                  >
                    Products
                  </NavLink>
                </div>
                <div className="nav-item">
                  <NavLink
                    className="nav-link"
                    aria-current="page"
                    to="/setting"
                  >
                    Setting
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-category" element={<NewCategory />} />
            <Route path="/products" element={<Product />} />
            <Route path="/new-product" element={<NewProduct />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </Router>
      </div>
    </Firebase>
  );
}

export default App;
