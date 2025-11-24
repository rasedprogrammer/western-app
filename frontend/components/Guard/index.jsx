import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { http } from "../../modules/modules";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader";

const Guard = ({ endpoint, role }) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const [authorised, setAuthorised] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  if (token === undefined) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthorised(false);
        return <Navigate to="/" />;
      }
      try {
        const httpReq = http(token);
        const { data } = await httpReq.get(endpoint);
        console.log("Data", data, role);
        const user = data?.data?.userType;
        sessionStorage.setItem("userInfo", JSON.stringify(data?.data));

        setUserType(user);
        setLoading(false);
        setAuthorised(true);
        console.log("Auth", authorised);
      } catch (error) {
        setUserType(null);
        setLoading(false);
        setAuthorised(false);
      }
    };
    verifyToken();
  }, [endpoint, token]);

  if (loading) {
    return <Loader />;
  }

  if (authorised && role === userType) {
    return <Outlet />;
  } else if (authorised === true && role === userType) {
    console.log(authorised, role);
    return <Outlet />;
  } else if (authorised && role === userType) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default Guard;
