import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import PortalPage from './pages/PortalPage/PortalPage';

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/portal",
    element: <PortalPage />
  },
  {
    path: "/*",
    element: <NotFoundPage />
  }
];


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          {
            routes.map(route => (
              <Route path={route.path} key={route.path} element={route.element} />
            ))
          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
