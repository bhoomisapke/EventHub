import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ============================================================
  // CHECK LOGIN
  // ============================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);

        setIsLoggedIn(true);
        setLoggedInUser(user);
      } catch (error) {
        console.error(
          "Unable to read saved user:",
          error
        );

        setIsLoggedIn(false);
        setLoggedInUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setLoggedInUser(null);
    }
  }, []);

  // ============================================================
  // CLOSE MENU
  // ============================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ============================================================
  // PROFILE
  // ============================================================

  const handleProfile = () => {
    if (loggedInUser?.role === "student") {
      navigate("/student/profile");
    } else if (
      loggedInUser?.role === "organizer"
    ) {
      navigate("/organizer/profile");
    } else {
      navigate("/auth");
    }

    closeMenu();
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    try {
      if (token) {
        await fetch(
          "http://127.0.0.1:8000/api/auth/logout/",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      setIsLoggedIn(false);
      setLoggedInUser(null);

      closeMenu();

      navigate("/");
    }
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goHome = () => {
    closeMenu();
    navigate("/");
  };

  const goToSection = (section) => {
    closeMenu();

    if (window.location.pathname === "/") {
      window.location.hash = section;
    } else {
      navigate(`/#${section}`);
    }
  };

  // ============================================================
  // NAVBAR
  // ============================================================

  return (
    <header className="navbar">

      {/* ======================================================
          BRAND
      ====================================================== */}

      <button
        type="button"
        className="brand"
        onClick={goHome}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div className="brand-symbol">
          <span>✦</span>
        </div>

        <div>
          <strong>
            Event<span>Hub</span>
          </strong>

          <small>
            COLLEGE EVENTS
          </small>
        </div>
      </button>


      {/* ======================================================
          MOBILE MENU
      ====================================================== */}

      <button
        className="mobile-menu"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>


      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className={
          menuOpen
            ? "nav-menu open"
            : "nav-menu"
        }
      >

        <button
          type="button"
          onClick={goHome}
          className="nav-link-button"
        >
          Home
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/events")
          }
          className="nav-link-button"
        >
          Events
        </button>

        <button
          type="button"
          onClick={() =>
            goToSection("categories")
          }
          className="nav-link-button"
        >
          Categories
        </button>

        <button
          type="button"
          onClick={() =>
            goToSection("about")
          }
          className="nav-link-button"
        >
          About
        </button>

        <button
          type="button"
          onClick={() =>
            goToSection("feedback")
          }
          className="nav-link-button"
        >
          Feedback
        </button>

      </nav>


      {/* ======================================================
          LOGIN / PROFILE
      ====================================================== */}

      <div className="nav-buttons">

        {isLoggedIn ? (
          <>

            <button
              type="button"
              onClick={handleProfile}
              aria-label="Profile"
              title="Profile"
              className="login-button"
              style={{
                minWidth: 42,
                width: 42,
                height: 42,
                padding: 0,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserRound
                size={19}
                strokeWidth={2}
              />
            </button>


            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="register-button"
              style={{
                minWidth: 42,
                width: 42,
                height: 42,
                padding: 0,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogOut
                size={19}
                strokeWidth={2}
              />
            </button>

          </>
        ) : (
          <>

            <button
              className="login-button"
              onClick={() =>
                navigate("/auth")
              }
            >
              Student Login
            </button>

            <button
              className="register-button"
              onClick={() =>
                navigate("/auth")
              }
            >
              Register
            </button>

          </>
        )}

      </div>

    </header>
  );
}