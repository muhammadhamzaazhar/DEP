import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import { UserContext } from "../../UserContext";
import "./header.styles.css";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error.message);
        setUserInfo(null);
      });
  }, [setUserInfo]);

  const logout = () => {
    console.log("Logging out...");
    fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        setUserInfo(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error.message);
      });
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        .ⓑⓛⓞⓖ
      </Link>
      <nav>
        {username ? (
          <>
            <Link to="/create" className="new-post">
              New Post
            </Link>
            <Link onClick={logout} className="logout">
              Logout ({username})
            </Link>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="login">
              Login
            </Link>
            <Link to="/auth/register" className="register">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
