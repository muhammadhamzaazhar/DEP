import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";

import { logout } from "../../redux/reducers/userSlice";
import Button from "../button/button.component";
import LogoImg from "../../utils/Images/Logo.png";
import "./navbar.styles.css";

const Navbar = ({ openAuth, setOpenAuth, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className="nav">
      <div className="navbar-container">
        <div className="mobile-icon" onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </div>

        <div className="nav-logo">
          <img src={LogoImg} className="logo" alt="Logo" />
        </div>

        <ul className="nav-items">
          <NavLink to="/" className="navlink">
            Home
          </NavLink>
          <NavLink to="/Shop" className="navlink">
            Shop
          </NavLink>
          <NavLink to="/Orders" className="navlink">
            Orders
          </NavLink>
          <NavLink to="/Contact" className="navlink">
            Contact
          </NavLink>
        </ul>

        {isOpen && (
          <ul className={`mobile-menu ${isOpen ? "open" : ""}`}>
            <NavLink
              to="/"
              className="navlink"
              onClick={() => setIsOpen(!isOpen)}
            >
              Home
            </NavLink>
            <NavLink
              to="/Shop"
              className="navlink"
              onClick={() => setIsOpen(!isOpen)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/New_Arrivals"
              className="navlink"
              onClick={() => setIsOpen(!isOpen)}
            >
              New Arrivals
            </NavLink>
            <NavLink
              to="/Orders"
              className="navlink"
              onClick={() => setIsOpen(!isOpen)}
            >
              Orders
            </NavLink>
            <NavLink
              to="/Contact"
              className="navlink"
              onClick={() => setIsOpen(!isOpen)}
            >
              Contact
            </NavLink>
            {currentUser ? (
              <Button text="Logout" small onClick={() => dispatch(logout())} />
            ) : (
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <Button
                  text="Sign Up"
                  outlined
                  small
                  onClick={() => setOpenAuth(!openAuth)}
                />
                <Button
                  text="Sign In"
                  small
                  onClick={() => setOpenAuth(!openAuth)}
                />
              </div>
            )}
          </ul>
        )}

        <div className="mobile-icons">
          <NavLink to="/search" className="navlink">
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </NavLink>

          {currentUser ? (
            <>
              <NavLink to="/favorite" className="navlink">
                <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
              </NavLink>
              <NavLink to="/cart" className="navlink">
                <ShoppingCartOutlined
                  sx={{ color: "inherit", fontSize: "28px" }}
                />
              </NavLink>
              <Avatar
                src={currentUser?.img}
                sx={{
                  color: "inherit",
                  fontSize: "28px",
                }}
              >
                {currentUser?.name[0]}
              </Avatar>
            </>
          ) : (
            <Button
              text="SignIn"
              small
              onClick={() => setOpenAuth(!openAuth)}
            />
          )}
        </div>

        <div className="button-container">
          <NavLink to="/search" className="navlink">
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </NavLink>

          {currentUser ? (
            <>
              <NavLink to="/favorite" className="navlink">
                <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
              </NavLink>
              <NavLink to="/cart" className="navlink">
                <ShoppingCartOutlined
                  sx={{ color: "inherit", fontSize: "28px" }}
                />
              </NavLink>
              <Avatar
                src={currentUser?.img}
                sx={{
                  color: "inherit",
                  fontSize: "28px",
                }}
              >
                {currentUser?.name[0]}
              </Avatar>
              <div className="text-button" onClick={() => dispatch(logout())}>
                Logout
              </div>
            </>
          ) : (
            <Button
              text="SignIn"
              small
              onClick={() => setOpenAuth(!openAuth)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
