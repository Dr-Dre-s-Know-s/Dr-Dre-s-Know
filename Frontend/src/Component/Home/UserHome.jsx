import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function UserHome() {
  const [Data, SetData] = useState({});
  const [isAuthentication, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");
  const location = useLocation();
  const { userId } = location.state || {};

  useEffect(() => {
    axios
      .get("http://localhost:3000/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        response.status === 200 ? setIsAuthenticated(true) : navigate("/login");
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  }

  useEffect(() => {
    const fetchdata = async () => {
      try {
        axios
          .get(`http://localhost:3000/auth/user/${userId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            SetData(res.data);
          });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (token && userId) {
      fetchdata();
    }
  }, []);

  return (
    <>
      <p>Welcome : {Data.username}</p>
      <p>Bio : {Data.bio}</p>
      <p>Email : {Data.email}</p>
      <button
        className="bg-cyan-300 text-cyan-800"
        onClick={logout}
      >
        Logout
      </button>
    </>
  );
}

export default UserHome;
