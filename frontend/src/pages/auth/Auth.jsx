import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

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

const UserIcon = () => (
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
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
  </svg>
);

const CollegeIcon = () => (
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
    <path d="M3 9 12 4l9 5-9 5-9-5Z" />
    <path d="M6 11v5c2.2 2 9.8 2 12 0v-5" />
    <path d="M21 9v6" />
  </svg>
);

const BuildingIcon = () => (
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
    <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M16 9h3a1 1 0 0 1 1 1v11" />
    <path d="M8 7h4" />
    <path d="M8 11h4" />
    <path d="M8 15h4" />
    <path d="M8 21v-3h4v3" />
    <path d="M20 21h2" />
  </svg>
);

const PhoneIcon = () => (
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
    <path d="M6.5 3.5 9 3l2 5-2.5 1.5a15 15 0 0 0 6.5 6.5l1.5-2.5 5 2-.5 2.5c-.3 1.5-1.6 2.5-3.1 2.3C10.6 19.4 4.6 13.4 3.7 5.6 3.5 4.1 5 3.8 6.5 3.5Z" />
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
   INITIAL FORM
========================================================= */

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  college: "",
  year: "",
  organization: "",
  phone: "",
};

/* =========================================================
   INPUT FIELD
   IMPORTANT:
   Keep this OUTSIDE Auth().
   This prevents input focus problems.
========================================================= */

function InputField({
  label,
  name,
  type = "text",
  icon,
  placeholder,
  children,
  form,
  errors,
  touched,
  updateField,
  setTouched,
  showPassword,
  showConfirmPassword,
}) {
  let inputType = type;

  if (name === "password") {
    inputType = showPassword ? "text" : "password";
  }

  if (name === "confirmPassword") {
    inputType = showConfirmPassword
      ? "text"
      : "password";
  }

  const hasError = Boolean(
    errors[name] && touched[name]
  );

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
          type={inputType}
          value={form[name]}
          placeholder={placeholder}
          onChange={(e) =>
            updateField(name, e.target.value)
          }
          onBlur={() =>
            setTouched((prev) => ({
              ...prev,
              [name]: true,
            }))
          }
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${name}-error`
              : undefined
          }
          className={`auth-input ${
            hasError ? "input-error" : ""
          }`}
        />

        {children}

      </div>

      {hasError && (
        <p
          id={`${name}-error`}
          className="auth-error"
        >
          {errors[name]}
        </p>
      )}

    </div>
  );
}

/* =========================================================
   AUTH COMPONENT
========================================================= */

function Auth() {

  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [mode, setMode] = useState("login");

  const [role, setRole] =
    useState("student");

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [touched, setTouched] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [status, setStatus] =
    useState("");

  /* =======================================================
     FORGOT PASSWORD STATE
  ======================================================= */

  const [
    showForgotPassword,
    setShowForgotPassword,
  ] = useState(false);

  const [
    forgotEmail,
    setForgotEmail,
  ] = useState("");

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = (field, value) => {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    setStatus("");
    setSuccess(false);
  };

  /* =======================================================
     CHANGE LOGIN / REGISTER MODE
  ======================================================= */

  const changeMode = (newMode) => {

    setMode(newMode);

    setErrors({});
    setTouched({});

    setStatus("");
    setSuccess(false);
    setLoading(false);

    setShowPassword(false);
    setShowConfirmPassword(false);

    setShowForgotPassword(false);
  };

  /* =======================================================
     CHANGE ROLE
  ======================================================= */

  const changeRole = (newRole) => {

    setRole(newRole);

    setErrors((prev) => ({
      ...prev,
      college: "",
      year: "",
      organization: "",
      phone: "",
    }));

    setTouched((prev) => ({
      ...prev,
      college: false,
      year: false,
      organization: false,
      phone: false,
    }));

    setStatus("");
    setSuccess(false);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {

    const newErrors = {};

    /* EMAIL */

    if (!form.email.trim()) {

      newErrors.email =
        "Email address is required.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {

      newErrors.email =
        "Enter a valid email address.";
    }

    /* PASSWORD */

    if (!form.password) {

      newErrors.password =
        "Password is required.";

    } else if (
      form.password.length < 8
    ) {

      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    /* REGISTER */

    if (mode === "register") {

      /* FIRST NAME */

      if (!form.firstName.trim()) {

        newErrors.firstName =
          "First name is required.";
      }

      /* LAST NAME */

      if (!form.lastName.trim()) {

        newErrors.lastName =
          "Last name is required.";
      }

      /* CONFIRM PASSWORD */

      if (!form.confirmPassword) {

        newErrors.confirmPassword =
          "Please confirm your password.";

      } else if (
        form.password !==
        form.confirmPassword
      ) {

        newErrors.confirmPassword =
          "Passwords do not match.";
      }

      /* STUDENT */

      if (role === "student") {

        if (!form.college.trim()) {

          newErrors.college =
            "College name is required.";
        }

        if (!form.year.trim()) {

          newErrors.year =
            "Please select your year.";
        }
      }

      /* ORGANIZER */

      if (role === "organizer") {

        if (!form.organization.trim()) {

          newErrors.organization =
            "Organization is required.";
        }

        if (!form.phone.trim()) {

          newErrors.phone =
            "Phone number is required.";

        } else if (
          !/^[+]?[\d\s()-]{10,15}$/.test(
            form.phone
          )
        ) {

          newErrors.phone =
            "Enter a valid phone number.";
        }
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =======================================================
     FORGOT PASSWORD
  ======================================================= */

  const handleForgotPassword = async (e) => {

    e.preventDefault();

    if (!forgotEmail.trim()) {

      setStatus(
        "Please enter your email address."
      );

      setSuccess(false);

      return;
    }

    setLoading(true);
    setStatus("");
    setSuccess(false);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/forgot-password/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: forgotEmail.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setLoading(false);

        setStatus(
          data.message ||
            "Unable to send password reset link."
        );

        return;
      }

      setLoading(false);
      setSuccess(true);

      setStatus(
        "Password reset link has been sent. Check your email."
      );

    } catch (error) {

      console.error(
        "Forgot password error:",
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
     LOGIN / REGISTER SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    const allTouched = {

      email: true,

      password: true,

      firstName:
        mode === "register",

      lastName:
        mode === "register",

      confirmPassword:
        mode === "register",

      college:
        mode === "register" &&
        role === "student",

      year:
        mode === "register" &&
        role === "student",

      organization:
        mode === "register" &&
        role === "organizer",

      phone:
        mode === "register" &&
        role === "organizer",
    };

    setTouched(allTouched);

    if (!validate()) {
      return;
    }

    setLoading(true);
    setStatus("");
    setSuccess(false);

    try {

      /* =====================================================
         LOGIN
      ===================================================== */

      if (mode === "login") {

        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/login/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email: form.email.trim(),
              password: form.password,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {

          setLoading(false);

          setStatus(
            data.message ||
              "Invalid email or password."
          );

          return;
        }

        /* SAVE TOKEN */

        if (rememberMe) {

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          sessionStorage.removeItem(
            "token"
          );

          sessionStorage.removeItem(
            "user"
          );

        } else {

          sessionStorage.setItem(
            "token",
            data.token
          );

          sessionStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );
        }

        setLoading(false);
        setSuccess(true);

        setStatus(
          "Login successful! Redirecting..."
        );

        setTimeout(() => {

          if (
            data.user.role ===
            "student"
          ) {

            navigate(
              "/student/dashboard"
            );

          } else if (
            data.user.role ===
            "organizer"
          ) {

            navigate(
              "/organizer/dashboard"
            );
          }

        }, 900);

        return;
      }

      /* =====================================================
         REGISTER
      ===================================================== */

      const fullName =
        `${form.firstName} ${form.lastName}`.trim();

      const registerData = {

        name: fullName,

        email: form.email.trim(),

        password: form.password,

        role: role,

        phone:
          role === "organizer"
            ? form.phone.trim()
            : "",

        student_id: "",

        department:
          role === "student"
            ? form.college.trim()
            : "",

        year:
          role === "student"
            ? form.year === "1st Year"
              ? 1
              : form.year === "2nd Year"
              ? 2
              : form.year === "3rd Year"
              ? 3
              : form.year === "4th Year"
              ? 4
              : null
            : null,
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            registerData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setLoading(false);

        let errorMessage =
          "Registration failed.";

        if (data.email) {

          errorMessage =
            data.email[0];

        } else if (data.message) {

          errorMessage =
            data.message;

        } else if (data.role) {

          errorMessage =
            data.role[0];

        } else if (data.password) {

          errorMessage =
            data.password[0];
        }

        setStatus(errorMessage);

        return;
      }

      setLoading(false);
      setSuccess(true);

      setStatus(
        "Account created successfully!"
      );

      setTimeout(() => {

        setSuccess(false);
        setStatus("");

        setMode("login");

        setForm({
          ...initialForm,
          email: form.email,
          password: "",
        });

        setTouched({});
        setErrors({});

      }, 1200);

    } catch (error) {

      console.error(
        "Authentication error:",
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
     COMMON INPUT PROPS
  ======================================================= */

  const inputProps = {

    form,
    errors,
    touched,
    updateField,
    setTouched,
    showPassword,
    showConfirmPassword,

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

        {/* LOGO */}

        <button
          type="button"
          className="auth-logo"
          onClick={() =>
            navigate("/")
          }
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
          onClick={() =>
            navigate("/")
          }
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

              {showForgotPassword
                ? "PASSWORD RECOVERY"
                : mode === "login"
                ? "WELCOME BACK"
                : "JOIN EVENTHUB"}

            </div>

            <h1>

              {showForgotPassword ? (

                <>
                  Reset your{" "}
                  <em>password.</em>
                </>

              ) : mode === "login" ? (

                <>
                  Welcome{" "}
                  <em>back.</em>
                </>

              ) : (

                <>
                  Create your{" "}
                  <em>account.</em>
                </>

              )}

            </h1>

            <p>

              {showForgotPassword

                ? "Enter your registered email and we'll send you a password reset link."

                : mode === "login"

                ? "Sign in and continue discovering amazing college events."

                : "Join students and organizers creating memorable campus experiences."}

            </p>

          </div>

          {/* =================================================
              FORGOT PASSWORD SCREEN
          ================================================= */}

          {showForgotPassword ? (

            <form
              className="auth-form"
              onSubmit={
                handleForgotPassword
              }
              noValidate
            >

              {/* EMAIL */}

              <InputField
                label="Email Address"
                name="forgotEmail"
                type="email"
                placeholder="you@example.com"
                icon={<MailIcon />}
                form={{
                  forgotEmail:
                    forgotEmail,
                }}
                errors={{}}
                touched={{}}
                updateField={(
                  field,
                  value
                ) => {
                  setForgotEmail(value);
                  setStatus("");
                  setSuccess(false);
                }}
                setTouched={() => {}}
                showPassword={false}
                showConfirmPassword={false}
              />

              {/* STATUS */}

              {status && (

                <div
                  className={`auth-status ${
                    success
                      ? "success"
                      : ""
                  }`}
                >

                  <span>
                    {success
                      ? "✓"
                      : "i"}
                  </span>

                  {status}

                </div>

              )}

              {/* SEND BUTTON */}

              <button
                type="submit"
                className={`auth-submit ${
                  loading
                    ? "loading"
                    : ""
                } ${
                  success
                    ? "submit-success"
                    : ""
                }`}
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span className="spinner" />
                    Sending...
                  </>

                ) : success ? (

                  <>
                    Sent
                    <span>✓</span>
                  </>

                ) : (

                  <>
                    Send Reset Link
                    <ArrowIcon />
                  </>

                )}

              </button>

              {/* BACK TO LOGIN */}

              <div
                style={{
                  textAlign: "center",
                  marginTop: "14px",
                }}
              >

                <button
                  type="button"
                  onClick={() => {

                    setShowForgotPassword(
                      false
                    );

                    setForgotEmail("");

                    setStatus("");

                    setSuccess(false);

                    setLoading(false);

                  }}
                  style={{
                    border: "0",
                    background:
                      "transparent",
                    color:
                      "var(--pink-light)",
                    fontSize: "9px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  ← Back to Login
                </button>

              </div>

            </form>

          ) : (

            <>
              {/* =================================================
                  LOGIN / REGISTER TABS
              ================================================= */}

              <div className="auth-tabs">

                <button
                  type="button"
                  className={
                    mode === "login"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeMode("login")
                  }
                >
                  Login
                </button>

                <button
                  type="button"
                  className={
                    mode === "register"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeMode(
                      "register"
                    )
                  }
                >
                  Register
                </button>

                <span
                  className={`tab-slider ${
                    mode === "register"
                      ? "move-right"
                      : ""
                  }`}
                />

              </div>

              {/* =================================================
                  ROLE
              ================================================= */}

              <div className="role-section">

                <p>

                  {mode === "register"
                    ? "I want to continue as"
                    : "Continue as"}

                </p>

                <div className="role-options">

                  {/* STUDENT */}

                  <button
                    type="button"
                    className={
                      role === "student"
                        ? "role-card selected"
                        : "role-card"
                    }
                    onClick={() =>
                      changeRole(
                        "student"
                      )
                    }
                  >

                    <span className="role-icon">

                      <CollegeIcon />

                    </span>

                    <span className="role-content">

                      <strong>
                        Student
                      </strong>

                      <small>
                        Discover & register
                      </small>

                    </span>

                    {role ===
                      "student" && (

                      <b className="role-check">
                        ✓
                      </b>

                    )}

                  </button>

                  {/* ORGANIZER */}

                  <button
                    type="button"
                    className={
                      role === "organizer"
                        ? "role-card selected organizer"
                        : "role-card"
                    }
                    onClick={() =>
                      changeRole(
                        "organizer"
                      )
                    }
                  >

                    <span className="role-icon organizer-icon">

                      <BuildingIcon />

                    </span>

                    <span className="role-content">

                      <strong>
                        Organizer
                      </strong>

                      <small>
                        Create & manage
                      </small>

                    </span>

                    {role ===
                      "organizer" && (

                      <b className="role-check organizer-check">
                        ✓
                      </b>

                    )}

                  </button>

                </div>

              </div>

              {/* =================================================
                  NORMAL FORM
              ================================================= */}

              <form
                className="auth-form"
                onSubmit={
                  handleSubmit
                }
                noValidate
              >

                {/* FIRST + LAST NAME */}

                {mode === "register" && (

                  <div className="two-columns">

                    <InputField
                      {...inputProps}
                      label="First Name"
                      name="firstName"
                      placeholder="John"
                      icon={
                        <UserIcon />
                      }
                    />

                    <InputField
                      {...inputProps}
                      label="Last Name"
                      name="lastName"
                      placeholder="Doe"
                      icon={
                        <UserIcon />
                      }
                    />

                  </div>

                )}

                {/* EMAIL */}

                <InputField
                  {...inputProps}
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  icon={
                    <MailIcon />
                  }
                />

                {/* STUDENT */}

                {mode === "register" &&
                  role === "student" && (

                  <div className="two-columns">

                    {/* COLLEGE */}

                    <InputField
                      {...inputProps}
                      label="College"
                      name="college"
                      placeholder="Your college"
                      icon={
                        <CollegeIcon />
                      }
                    />

                    {/* YEAR */}

                    <div className="auth-field">

                      <label htmlFor="year">

                        Year

                        <span>
                          *
                        </span>

                      </label>

                      <div className="auth-input-wrapper">

                        <span className="auth-input-icon">

                          <CollegeIcon />

                        </span>

                        <select
                          id="year"
                          name="year"
                          value={
                            form.year
                          }
                          onChange={(e) =>
                            updateField(
                              "year",
                              e.target.value
                            )
                          }
                          onBlur={() =>
                            setTouched(
                              (prev) => ({
                                ...prev,
                                year: true,
                              })
                            )
                          }
                          className={`auth-input auth-select ${
                            errors.year &&
                            touched.year
                              ? "input-error"
                              : ""
                          }`}
                        >

                          <option value="">
                            Select your year
                          </option>

                          <option value="1st Year">
                            1st Year
                          </option>

                          <option value="2nd Year">
                            2nd Year
                          </option>

                          <option value="3rd Year">
                            3rd Year
                          </option>

                          <option value="4th Year">
                            4th Year
                          </option>

                          <option value="Final Year">
                            Final Year
                          </option>

                        </select>

                      </div>

                      {errors.year &&
                        touched.year && (

                        <p className="auth-error">
                          {errors.year}
                        </p>

                      )}

                    </div>

                  </div>

                )}

                {/* ORGANIZER */}

                {mode === "register" &&
                  role === "organizer" && (

                  <div className="two-columns">

                    <InputField
                      {...inputProps}
                      label="Organization"
                      name="organization"
                      placeholder="Event club / department"
                      icon={
                        <BuildingIcon />
                      }
                    />

                    <InputField
                      {...inputProps}
                      label="Phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      icon={
                        <PhoneIcon />
                      }
                    />

                  </div>

                )}

                {/* PASSWORD */}

                <InputField
                  {...inputProps}
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  icon={
                    <LockIcon />
                  }
                >

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() =>
                      setShowPassword(
                        (prev) =>
                          !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    <EyeIcon
                      open={
                        showPassword
                      }
                    />

                  </button>

                </InputField>

                {/* CONFIRM PASSWORD */}

                {mode === "register" && (

                  <InputField
                    {...inputProps}
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter password again"
                    icon={
                      <LockIcon />
                    }
                  >

                    <button
                      type="button"
                      className="password-eye"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) =>
                            !prev
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >

                      <EyeIcon
                        open={
                          showConfirmPassword
                        }
                      />

                    </button>

                  </InputField>

                )}

                {/* LOGIN OPTIONS */}

                {mode === "login" && (

                  <div className="auth-options">

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          rememberMe
                        }
                        onChange={(e) =>
                          setRememberMe(
                            e.target.checked
                          )
                        }
                      />

                      <span className="custom-check">
                        ✓
                      </span>

                      Remember me

                    </label>

                    <button
                      type="button"
                      onClick={() => {

                        setForgotEmail(
                          form.email
                        );

                        setStatus("");

                        setSuccess(false);

                        setLoading(false);

                        setShowForgotPassword(
                          true
                        );

                      }}
                    >
                      Forgot password?
                    </button>

                  </div>

                )}

                {/* STATUS */}

                {status && (

                  <div
                    className={`auth-status ${
                      success
                        ? "success"
                        : ""
                    }`}
                  >

                    <span>
                      {success
                        ? "✓"
                        : "i"}
                    </span>

                    {status}

                  </div>

                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  className={`auth-submit ${
                    loading
                      ? "loading"
                      : ""
                  } ${
                    success
                      ? "submit-success"
                      : ""
                  }`}
                  disabled={
                    loading ||
                    success
                  }
                >

                  {loading ? (

                    <>
                      <span className="spinner" />
                      Please wait...
                    </>

                  ) : success ? (

                    <>
                      Success
                      <span>✓</span>
                    </>

                  ) : (

                    <>
                      {mode === "login"
                        ? "Sign In"
                        : "Create Account"}

                      <ArrowIcon />

                    </>

                  )}

                </button>

              </form>

              {/* =================================================
                  BOTTOM SWITCH
              ================================================= */}

              <div className="auth-switch-footer">

                <span />

                <p>

                  {mode === "login"
                    ? "New to EventHub?"
                    : "Already have an account?"}

                  <button
                    type="button"
                    onClick={() =>
                      changeMode(
                        mode === "login"
                          ? "register"
                          : "login"
                      )
                    }
                  >

                    {mode === "login"
                      ? "Create account"
                      : "Sign in"}

                  </button>

                </p>

                <span />

              </div>

            </>
          )}

          {/* =================================================
              SECURITY NOTE
          ================================================= */}

          <div className="security-note">

            <span>
              🔒
            </span>

            Secure access to your EventHub account

          </div>

        </div>

      </section>

    </main>
  );
}

export default Auth;