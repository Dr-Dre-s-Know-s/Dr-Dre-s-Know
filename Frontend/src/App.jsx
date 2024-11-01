import { useEffect } from "react";
import Login from "./Component/Login/Login";
import Signup from "./Component/Signup/Signup";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Component/Home/UserHome";

function App() {
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      sessionStorage.removeItem("accessToken"); // Clear token when the tab closes
    });
  });
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to = '/login'/>}></Route>
          <Route path="/signup" element={<Signup />} />

          <Route path="/user" element={<Home />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
