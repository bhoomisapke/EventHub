import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Auth.css";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("");
    setStatusType("");

    if (newPassword.length < 8) {
      setStatus("Password must be at least 8 characters.");
      setStatusType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match.");
      setStatusType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/reset-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            token,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || "Password reset failed.");
        setStatusType("error");
        return;
      }

      setStatus("Password reset successfully!");
      setStatusType("success");

      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error) {
      setStatus("Unable to connect to the server.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eventhub-auth">

      {/* =====================================================
          EXACT AUTH BACKGROUND SCENE
          ===================================================== */}

      <div className="auth-scene">

        <div className="auth-grid"></div>

        <div className="scene-glow glow-purple"></div>
        <div className="scene-glow glow-pink"></div>
        <div className="scene-glow glow-blue"></div>


        {/* 3D LAPTOP */}

        <div className="tech-laptop">
          <div className="laptop-screen">
            <div className="code-lines">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>

          <div className="laptop-base">
            <div className="keyboard"></div>
          </div>
        </div>


        {/* 3D MEGAPHONE */}

        <div className="tech-megaphone">
          <div className="mega-cone"></div>
          <div className="mega-handle"></div>

          <div className="mega-wave wave-one"></div>
          <div className="mega-wave wave-two"></div>
          <div className="mega-wave wave-three"></div>
        </div>


        {/* 3D SERVER */}

        <div className="tech-server">

          <div className="server-unit">
            <span></span>
            <span></span>
          </div>

          <div className="server-unit">
            <span></span>
            <span></span>
          </div>

          <div className="server-unit">
            <span></span>
            <span></span>
          </div>

        </div>


        {/* 3D CALENDAR */}

        <div className="tech-calendar">

          <div className="calendar-top"></div>

          <div className="calendar-grid">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>

          <div className="calendar-check">✓</div>

        </div>


        {/* CODE CUBE */}

        <div className="code-cube">
          <span>&lt;/&gt;</span>
        </div>


        {/* HOLOGRAPHIC RINGS */}

        <div className="holo-ring ring-one"></div>
        <div className="holo-ring ring-two"></div>
        <div className="holo-ring ring-three"></div>


        {/* FLOATING CUBES */}

        <div className="float-cube cube-one"></div>
        <div className="float-cube cube-two"></div>
        <div className="float-cube cube-three"></div>


        {/* GLOWING NODES */}

        <div className="scene-node node-one"></div>
        <div className="scene-node node-two"></div>
        <div className="scene-node node-three"></div>
        <div className="scene-node node-four"></div>
        <div className="scene-node node-five"></div>


        {/* CIRCUIT LINES */}

        <div className="circuit circuit-one">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="circuit circuit-two">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>


      {/* =====================================================
          EXACT AUTH HEADER
          ===================================================== */}

      <header className="auth-header">

        <button
          className="auth-logo"
          onClick={() => navigate("/")}
          type="button"
        >

          <div className="logo-icon">
            E
          </div>

          <div className="logo-text">

            <strong>
              Event<span>Hub</span>
            </strong>

            <small>
              COLLEGE EVENT NETWORK
            </small>

          </div>

        </button>


        <button
          className="back-home"
          onClick={() => navigate("/auth")}
          type="button"
        >
          ← Back to Login
        </button>

      </header>


      {/* =====================================================
          EXACT AUTH CENTER
          ===================================================== */}

      <main className="auth-center">

        <section className="auth-card">

          {/* HEADING */}

          <div className="auth-heading">

            <div className="auth-eyebrow">
              <span></span>
              ACCOUNT SECURITY
            </div>

            <h1>
              Reset <em>Password</em>
            </h1>

            <p>
              Create a new password to securely access your
              EventHub account.
            </p>

          </div>


          {/* FORM */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* NEW PASSWORD */}

            <div className="auth-field">

              <label>
                New Password
                <span>*</span>
              </label>

              <div className="auth-input-wrapper">

                <div className="auth-input-icon">

                  <svg viewBox="0 0 24 24">

                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="10"
                      rx="2"
                    />

                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />

                  </svg>

                </div>


                <input
                  className="auth-input"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  required
                />


                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                >

                  <svg viewBox="0 0 24 24">

                    {showNewPassword ? (
                      <>
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 8 10 8a18.2 18.2 0 0 1-3.2 4.3" />
                        <path d="M6.6 6.6C3.6 8.7 2 12 2 12s3.5 8 10 8c1.3 0 2.5-.3 3.6-.8" />
                      </>
                    )}

                  </svg>

                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="auth-field">

              <label>
                Confirm Password
                <span>*</span>
              </label>

              <div className="auth-input-wrapper">

                <div className="auth-input-icon">

                  <svg viewBox="0 0 24 24">

                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="10"
                      rx="2"
                    />

                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />

                  </svg>

                </div>


                <input
                  className="auth-input"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />


                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >

                  <svg viewBox="0 0 24 24">

                    {showConfirmPassword ? (
                      <>
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 8 10 8a18.2 18.2 0 0 1-3.2 4.3" />
                        <path d="M6.6 6.6C3.6 8.7 2 12 2 12s3.5 8 10 8c1.3 0 2.5-.3 3.6-.8" />
                      </>
                    )}

                  </svg>

                </button>

              </div>

            </div>


            {/* STATUS */}

            {status && (

              <div
                className={
                  statusType === "success"
                    ? "auth-status success"
                    : "auth-status"
                }
              >

                <span>
                  {statusType === "success"
                    ? "✓"
                    : "!"}
                </span>

                {status}

              </div>

            )}


            {/* SUBMIT */}

            <button
              className={
                statusType === "success"
                  ? "auth-submit submit-success"
                  : "auth-submit"
              }
              type="submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password

                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </>
              )}

            </button>

          </form>


          {/* FOOTER */}

          <div className="auth-switch-footer">

            <span></span>

            <p>
              Remember your password?
            </p>

            <button
              type="button"
              onClick={() => navigate("/auth")}
            >
              Login
            </button>

            <span></span>

          </div>


          {/* SECURITY */}

          <div className="security-note">

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="10"
                rx="2"
              />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            Your password is securely protected

          </div>

        </section>

      </main>

    </div>
  );
};

export default ResetPassword;