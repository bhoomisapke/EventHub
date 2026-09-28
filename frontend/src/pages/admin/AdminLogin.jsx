import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../auth/auth.css";

/* =========================================================
   ICONS
========================================================= */

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.3 3.8" />
        <path d="M6.2 6.8C3.9 8.2 2.5 12 2.5 12s3.5 6 9.5 6c1.4 0 2.7-.3 3.8-.8" />
      </>
    )}
  </svg>
);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="19"
    height="19"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h13" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  type = "text",
  icon,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  children,
}) {
  const hasError = Boolean(error);

  return (
    <div className="auth-field">
      <label htmlFor={name}>
        {label}
        <span>*</span>
      </label>

      <div className="auth-input-wrapper">
        <span className="auth-input-icon">
          {icon}
        </span>

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : undefined
          }
          className={`auth-input ${
            hasError ? "input-error" : ""
          }`}
          autoComplete={
            name === "email"
              ? "username"
              : "current-password"
          }
        />

        {children}
      </div>

      {hasError && (
        <p
          id={`${name}-error`}
          className="auth-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

function AdminLogin() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [touched, setTouched] =
    useState({});

  /* =======================================================
     UPDATE EMAIL
  ======================================================= */

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }

    setStatus("");
    setSuccess(false);
  };

  /* =======================================================
     UPDATE PASSWORD
  ======================================================= */

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }

    setStatus("");
    setSuccess(false);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const newErrors = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email =
        "Admin email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password =
        "Admin password is required.";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =======================================================
     BLUR HANDLERS
  ======================================================= */

  const handleEmailBlur = () => {
    setTouched((prev) => ({
      ...prev,
      email: true,
    }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({
      ...prev,
      password: true,
    }));
  };

  /* =======================================================
     ADMIN LOGIN
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (!validate()) {
      return;
    }

    setLoading(true);
    setStatus("");
    setSuccess(false);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/admin-login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /* =================================================
         LOGIN FAILED
      ================================================= */

      if (!response.ok) {
        setLoading(false);
        setSuccess(false);

        setStatus(
          data.message ||
            data.detail ||
            "Invalid admin credentials."
        );

        return;
      }

      /* =================================================
         EXTRA FRONTEND SAFETY CHECK
      ================================================= */

      if (!data.token) {
        setLoading(false);
        setSuccess(false);

        setStatus(
          "Admin login failed. No authentication token was received."
        );

        return;
      }

      if (
        !data.user ||
        data.user.role !== "admin"
      ) {
        setLoading(false);
        setSuccess(false);

        setStatus(
          "This account is not authorized for the admin portal."
        );

        return;
      }

      /* =================================================
         CLEAR OLD ADMIN SESSION
      ================================================= */

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");

      /* =================================================
         STORE ADMIN SESSION
      ================================================= */

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.user)
      );

      /* =================================================
         SUCCESS
      ================================================= */

      setLoading(false);
      setSuccess(true);

      setStatus(
        "Admin login successful! Opening admin portal..."
      );

      /* =================================================
         REDIRECT
      ================================================= */

      setTimeout(() => {
        navigate("/admin/dashboard", {
          replace: true,
        });
      }, 700);

    } catch (error) {
      console.error(
        "Admin authentication error:",
        error
      );

      setLoading(false);
      setSuccess(false);

      setStatus(
        "Unable to connect to the backend. Make sure Django is running."
      );
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="eventhub-auth">

      {/* =================================================
          BACKGROUND SCENE
      ================================================= */}

      <div className="auth-scene">

        <div className="auth-grid" />

        <div className="scene-glow glow-purple" />
        <div className="scene-glow glow-pink" />
        <div className="scene-glow glow-blue" />

        {/* LAPTOP */}

        <div className="tech-laptop">

          <div className="laptop-screen">

            <div className="code-lines">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

          </div>

          <div className="laptop-base">
            <div className="keyboard" />
          </div>

        </div>

        {/* MEGAPHONE */}

        <div className="tech-megaphone">

          <div className="mega-cone" />
          <div className="mega-handle" />

          <div className="mega-wave wave-one" />
          <div className="mega-wave wave-two" />
          <div className="mega-wave wave-three" />

        </div>

        {/* SERVER */}

        <div className="tech-server">

          <div className="server-unit">
            <span />
            <span />
          </div>

          <div className="server-unit">
            <span />
            <span />
          </div>

          <div className="server-unit">
            <span />
            <span />
          </div>

        </div>

        {/* CALENDAR */}

        <div className="tech-calendar">

          <div className="calendar-top" />

          <div className="calendar-grid">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="calendar-check">
            ✓
          </div>

        </div>

        {/* CODE CUBE */}

        <div className="code-cube">
          <span>{"{ }"}</span>
        </div>

        {/* HOLOGRAPHIC RINGS */}

        <div className="holo-ring ring-one" />
        <div className="holo-ring ring-two" />
        <div className="holo-ring ring-three" />

        {/* FLOATING CUBES */}

        <div className="float-cube cube-one" />
        <div className="float-cube cube-two" />
        <div className="float-cube cube-three" />

        {/* NODES */}

        <div className="scene-node node-one" />
        <div className="scene-node node-two" />
        <div className="scene-node node-three" />
        <div className="scene-node node-four" />
        <div className="scene-node node-five" />

        {/* CIRCUITS */}

        <div className="circuit circuit-one">
          <span />
          <span />
          <span />
        </div>

        <div className="circuit circuit-two">
          <span />
          <span />
          <span />
        </div>

      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="auth-header">

        {/* EVENTHUB LOGO */}

        <button
          type="button"
          className="auth-logo"
          onClick={() => navigate("/")}
          aria-label="Go to EventHub home"
        >

          <span className="logo-icon">
            ✦
          </span>

          <span className="logo-text">

            <strong>
              Event<span>Hub</span>
            </strong>

            <small>
              COLLEGE EVENTS
            </small>

          </span>

        </button>

        {/* BACK HOME */}

        <button
          type="button"
          className="back-home"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

      </header>

      {/* =================================================
          CENTER
      ================================================= */}

      <section className="auth-center">

        <div className="auth-card">

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="auth-heading">

            <div className="auth-eyebrow">

              <span />

              ADMINISTRATOR ACCESS

            </div>

            <h1>
              Welcome{" "}
              <em>back, Admin.</em>
            </h1>

            <p>
              Sign in securely to access the
              EventHub administration portal.
            </p>

          </div>

          {/* =================================================
              ADMIN SECURITY BADGE
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              padding: "9px 11px",
              marginBottom: "18px",
              borderRadius: "10px",
              border:
                "1px solid rgba(139, 92, 246, 0.18)",
              background:
                "rgba(139, 92, 246, 0.06)",
              color:
                "rgba(255, 255, 255, 0.52)",
              fontSize: "8px",
              lineHeight: "1.45",
            }}
          >

            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: "25px",
                height: "25px",
                flexShrink: 0,
                borderRadius: "7px",
                background:
                  "rgba(139, 92, 246, 0.14)",
                color: "#a78bfa",
              }}
            >
              <ShieldIcon />
            </span>

            <span>
              Restricted area. Only authorized
              EventHub administrators can continue.
            </span>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* EMAIL */}

            <InputField
              label="Admin Email Address"
              name="email"
              type="email"
              placeholder="admin@example.com"
              icon={<MailIcon />}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              error={
                errors.email &&
                touched.email
                  ? errors.email
                  : ""
              }
            />

            {/* PASSWORD */}

            <InputField
              label="Admin Password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your admin password"
              icon={<LockIcon />}
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={
                errors.password &&
                touched.password
                  ? errors.password
                  : ""
              }
            >

              <button
                type="button"
                className="password-eye"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                <EyeIcon
                  open={showPassword}
                />

              </button>

            </InputField>

            {/* STATUS */}

            {status && (
              <div
                className={`auth-status ${
                  success ? "success" : ""
                }`}
              >

                <span>
                  {success ? "✓" : "i"}
                </span>

                {status}

              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className={`auth-submit ${
                loading ? "loading" : ""
              } ${
                success
                  ? "submit-success"
                  : ""
              }`}
              disabled={loading || success}
            >

              {loading ? (
                <>
                  <span className="spinner" />
                  Verifying Admin...
                </>
              ) : success ? (
                <>
                  Access Granted
                  <span>✓</span>
                </>
              ) : (
                <>
                  Admin Sign In
                  <ArrowIcon />
                </>
              )}

            </button>

          </form>

          {/* =================================================
              BACK TO NORMAL LOGIN
          ================================================= */}

          <div className="auth-switch-footer">

            <span />

            <p>
              Not an administrator?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/auth")
                }
              >
                Student / Organizer Login
              </button>
            </p>

            <span />

          </div>

          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <div className="security-note">

            <span>
              🔒
            </span>

            Protected EventHub administrator access

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminLogin;