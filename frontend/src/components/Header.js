"use client";

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Store
      </Link>
      <nav>
        <ul
          id="navMenu"
          className={`flex flex-col md:flex-row items-center gap-4 ${
            menuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <li>
            <Link href="/search">Search</Link>
          </li>
          <li>
            <Link href="/news">News</Link>
          </li>
          <li>
            <Link href="/cart">Cart</Link>
          </li>
          <li>
            <Link href="/chats">Chats</Link>
          </li>
          <li id="firstList">
            <Link id="account" className="account" href="/account">
              Account
            </Link>
          </li>
          <li id="secondList">
            <Link id="registerLink" className="account" href="/sign-up">
              Sign up
            </Link>
          </li>
          <li id="thirdList">
            <Link id="loginLink" href="/sign-in">
              Sign in
            </Link>
          </li>
          <li>
            <button
              id="themeToggleButton"
              type="button"
              className="btn btn-dark p-2 rounded"
              onClick={toggleTheme}
            >
              <svg
                id="themeIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-sun"
                viewBox="0 0 16 16"
              >
                <path
                  id="iconPath"
                  d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>

      <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
        <div className="w-6 h-0.5 bg-white my-1"></div>
        <div className="w-6 h-0.5 bg-white my-1"></div>
        <div className="w-6 h-0.5 bg-white my-1"></div>
      </div>
    </header>
  );
};

export default Header;
