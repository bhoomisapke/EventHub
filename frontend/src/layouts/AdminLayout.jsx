import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  Menu,
  Search,
  CalendarDays,
  UserRound,
  ClipboardList,
  X,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import "./AdminLayout.css";


// ============================================================
// API
// ============================================================

const ADMIN_ME_API =
  "http://127.0.0.1:8000/api/auth/me/";


// ============================================================
// ADMIN LAYOUT
// ============================================================

function AdminLayout() {
  const navigate = useNavigate();

  // ==========================================================
  // SIDEBAR
  // ==========================================================

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);


  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);


  // ==========================================================
  // SEARCH
  // ==========================================================

  const [searchValue, setSearchValue] =
    useState("");


  // ==========================================================
  // ADMIN AUTHENTICATION
  // ==========================================================

  const [adminChecking, setAdminChecking] =
    useState(true);

  const [adminAuthorized, setAdminAuthorized] =
    useState(false);


  // ==========================================================
  // REFS
  // ==========================================================

  const notificationRef =
    useRef(null);

  const socketRef =
    useRef(null);

  const reconnectTimerRef =
    useRef(null);


  // ==========================================================
  // VERIFY ADMIN SESSION
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const verifyAdminSession = async () => {
      const adminToken =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");

      const adminUserRaw =
        localStorage.getItem("adminUser") ||
        sessionStorage.getItem("adminUser");


      // ------------------------------------------------------
      // No admin session
      // ------------------------------------------------------

      if (!adminToken || !adminUserRaw) {
        if (isMounted) {
          setAdminChecking(false);
        }

        navigate(
          "/admin-login",
          { replace: true }
        );

        return;
      }


      // ------------------------------------------------------
      // Check stored admin user
      // ------------------------------------------------------

      try {
        const adminUser =
          JSON.parse(adminUserRaw);

        if (
          !adminUser ||
          adminUser.role !== "admin"
        ) {
          throw new Error(
            "Stored account is not an admin."
          );
        }


        // ----------------------------------------------------
        // Verify token with Django
        // ----------------------------------------------------

        const response =
          await fetch(
            ADMIN_ME_API,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Token ${adminToken}`,
              },
            }
          );


        if (!response.ok) {
          throw new Error(
            "Admin token is invalid or expired."
          );
        }


        const user =
          await response.json();


        // ----------------------------------------------------
        // Verify returned Django user
        // ----------------------------------------------------

        if (
          !user ||
          user.role !== "admin"
        ) {
          throw new Error(
            "Authenticated user is not an admin."
          );
        }


        // ----------------------------------------------------
        // Admin verified
        // ----------------------------------------------------

        if (isMounted) {
          setAdminAuthorized(true);
          setAdminChecking(false);
        }

      } catch (error) {

        console.error(
          "❌ Admin authentication failed:",
          error
        );


        // ----------------------------------------------------
        // Clear invalid admin session
        // ----------------------------------------------------

        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        sessionStorage.removeItem(
          "adminToken"
        );

        sessionStorage.removeItem(
          "adminUser"
        );


        if (isMounted) {
          setAdminAuthorized(false);
          setAdminChecking(false);
        }


        // ----------------------------------------------------
        // Redirect to admin login
        // ----------------------------------------------------

        navigate(
          "/admin-login",
          { replace: true }
        );
      }
    };


    verifyAdminSession();


    return () => {
      isMounted = false;
    };

  }, [navigate]);


  // ==========================================================
  // SIDEBAR TOGGLE
  // ==========================================================

  const toggleSidebar = () => {
    setSidebarCollapsed(
      (previous) => !previous
    );
  };


  // ==========================================================
  // NOTIFICATION TOGGLE
  // ==========================================================

  const toggleNotifications = () => {
    setNotificationsOpen(
      (previous) => !previous
    );
  };


  // ==========================================================
  // REAL-TIME WEBSOCKET NOTIFICATIONS
  // ==========================================================

  useEffect(() => {

    // --------------------------------------------------------
    // Do not connect until admin is authenticated
    // --------------------------------------------------------

    if (!adminAuthorized) {
      return;
    }


    let isMounted = true;


    // --------------------------------------------------------
    // Connect WebSocket
    // --------------------------------------------------------

    const connectWebSocket = () => {

      if (!isMounted) {
        return;
      }


      // Prevent duplicate connections

      if (
        socketRef.current &&
        (
          socketRef.current.readyState ===
            WebSocket.OPEN ||

          socketRef.current.readyState ===
            WebSocket.CONNECTING
        )
      ) {
        return;
      }


      const socket =
        new WebSocket(
          "ws://127.0.0.1:8000/ws/admin/notifications/"
        );


      socketRef.current = socket;


      // ------------------------------------------------------
      // CONNECTED
      // ------------------------------------------------------

      socket.onopen = () => {

        console.log(
          "✅ Real-time admin notifications connected"
        );
      };


      // ------------------------------------------------------
      // MESSAGE
      // ------------------------------------------------------

      socket.onmessage = (event) => {

        try {

          const data =
            JSON.parse(event.data);


          console.log(
            "📩 WebSocket notification:",
            data
          );


          // Ignore connection confirmation

          if (
            data.type !==
            "notification"
          ) {
            return;
          }


          const incomingNotification =
            data.notification;


          if (!incomingNotification) {
            return;
          }


          const notification = {

            id:
              incomingNotification.id ||
              `${Date.now()}-${Math.random()}`,

            type:
              incomingNotification.type ||
              "general",

            title:
              incomingNotification.title ||
              "Notification",

            message:
              incomingNotification.message ||
              "",

            created_at:
              incomingNotification.created_at ||
              new Date().toISOString(),

            is_read:
              incomingNotification.is_read ||
              false,
          };


          if (!isMounted) {
            return;
          }


          // --------------------------------------------------
          // Add newest notification at top
          // --------------------------------------------------

          setNotifications(
            (previous) => {

              const alreadyExists =
                previous.some(
                  (item) =>
                    String(item.id) ===
                    String(
                      notification.id
                    )
                );


              if (alreadyExists) {
                return previous;
              }


              return [
                notification,
                ...previous,
              ];
            }
          );


          console.log(
            "🔔 New real-time notification:",
            notification.title
          );

        } catch (error) {

          console.error(
            "❌ Invalid WebSocket notification:",
            error
          );
        }
      };


      // ------------------------------------------------------
      // ERROR
      // ------------------------------------------------------

      socket.onerror = (error) => {

        console.error(
          "❌ Notification WebSocket error:",
          error
        );
      };


      // ------------------------------------------------------
      // CLOSED
      // ------------------------------------------------------

      socket.onclose = () => {

        console.log(
          "⚠️ Notification WebSocket disconnected"
        );


        socketRef.current = null;


        // Reconnect automatically

        if (isMounted) {

          reconnectTimerRef.current =
            setTimeout(
              () => {
                connectWebSocket();
              },
              3000
            );
        }
      };
    };


    connectWebSocket();


    // --------------------------------------------------------
    // Cleanup
    // --------------------------------------------------------

    return () => {

      isMounted = false;


      if (
        reconnectTimerRef.current
      ) {

        clearTimeout(
          reconnectTimerRef.current
        );

        reconnectTimerRef.current =
          null;
      }


      if (
        socketRef.current
      ) {

        socketRef.current.close();

        socketRef.current =
          null;
      }
    };

  }, [adminAuthorized]);


  // ==========================================================
  // CLOSE NOTIFICATIONS WHEN CLICKING OUTSIDE
  // ==========================================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            event.target
          )
        ) {
          setNotificationsOpen(
            false
          );
        }
      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // ==========================================================
  // NOTIFICATION ICON
  // ==========================================================

  const getNotificationIcon =
    (type) => {

      if (
        type === "registration"
      ) {
        return (
          <ClipboardList
            size={17}
          />
        );
      }


      if (
        type === "event"
      ) {
        return (
          <CalendarDays
            size={17}
          />
        );
      }


      if (
        type === "user"
      ) {
        return (
          <UserRound
            size={17}
          />
        );
      }


      return (
        <Bell
          size={17}
        />
      );
    };


  // ==========================================================
  // FORMAT NOTIFICATION TIME
  // ==========================================================

  const formatNotificationTime =
    (dateValue) => {

      if (!dateValue) {
        return "Just now";
      }


      const date =
        new Date(dateValue);


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "Just now";
      }


      const now =
        new Date();


      const difference =
        Math.floor(
          (
            now.getTime() -
            date.getTime()
          ) / 1000
        );


      if (difference < 10) {
        return "Just now";
      }


      if (difference < 60) {
        return `${difference} sec ago`;
      }


      const minutes =
        Math.floor(
          difference / 60
        );


      if (minutes < 60) {
        return `${minutes} min ago`;
      }


      const hours =
        Math.floor(
          minutes / 60
        );


      if (hours < 24) {

        return `${hours} hour${
          hours !== 1
            ? "s"
            : ""
        } ago`;
      }


      const days =
        Math.floor(
          hours / 24
        );


      if (days < 7) {

        return `${days} day${
          days !== 1
            ? "s"
            : ""
        } ago`;
      }


      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };


  // ==========================================================
  // ADMIN SESSION CHECKING SCREEN
  // ==========================================================

  if (adminChecking) {

    return (
      <div
        style={{
          minHeight: "100vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          flexDirection: "column",

          gap: "12px",

          background:
            "linear-gradient(135deg, #F7F3EE 0%, #EEEAF4 50%, #FFF8ED 100%)",

          color: "#10152C",

          fontSize: "16px",

          fontWeight: "600",
        }}
      >

        <div
          style={{
            width: "42px",
            height: "42px",

            borderRadius: "50%",

            border:
              "4px solid #E5E1EC",

            borderTopColor:
              "#8B5CF6",

            animation:
              "adminAuthSpin 0.8s linear infinite",
          }}
        />

        <span>
          Verifying admin access...
        </span>

      </div>
    );
  }


  // ==========================================================
  // NOT AUTHORIZED
  // ==========================================================

  if (!adminAuthorized) {
    return null;
  }


  // ==========================================================
  // ADMIN UI
  // ==========================================================

  return (

    <div
      className={`admin-layout ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : "sidebar-expanded"
      }`}
    >

      {/* ====================================================
          ADMIN NAVBAR
      ==================================================== */}

      <header
        className="admin-top-navbar"
      >

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div
          className="admin-navbar-left"
        >

          {/* HAMBURGER */}

          <button
            type="button"
            className="admin-menu-toggle"

            onClick={
              toggleSidebar
            }

            aria-label={
              sidebarCollapsed
                ? "Open sidebar"
                : "Close sidebar"
            }

            title={
              sidebarCollapsed
                ? "Open sidebar"
                : "Close sidebar"
            }
          >

            <Menu
              size={23}
              strokeWidth={2}
            />

          </button>


          {/* EVENTHUB BRAND */}

          <div
            className="admin-navbar-brand"
          >

            <div
              className="admin-brand-symbol"
            >
              <span>
                ✦
              </span>
            </div>


            <div
              className="admin-brand-text"
            >

              <strong>
                Event
                <span>
                  Hub
                </span>
              </strong>


              <small>
                COLLEGE EVENTS
              </small>

            </div>

          </div>

        </div>


        {/* ==================================================
            SEARCH BAR
        ================================================== */}

        <div
          className="admin-search-bar"
        >

          <Search
            size={18}
            strokeWidth={2}
          />


          <input
            type="text"

            value={searchValue}

            onChange={(event) =>
              setSearchValue(
                event.target.value
              )
            }

            placeholder="Search anything..."

            aria-label="Search anything"
          />


          {searchValue && (

            <button
              type="button"

              className="admin-search-clear"

              onClick={() =>
                setSearchValue("")
              }

              aria-label="Clear search"

              title="Clear search"
            >

              <X
                size={15}
              />

            </button>

          )}

        </div>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div
          className="admin-navbar-right"
        >

          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <div
            className="admin-notification-wrapper"
            ref={notificationRef}
          >

            <button
              type="button"

              className={`admin-notification-btn ${
                notificationsOpen
                  ? "notification-active"
                  : ""
              }`}

              onClick={
                toggleNotifications
              }

              aria-label="Notifications"

              title="Notifications"
            >

              <Bell
                size={19}
                strokeWidth={2}
              />


              {/* Notification dot */}

              {notifications.length > 0 && (

                <span
                  className="notification-dot"
                />

              )}

            </button>


            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {notificationsOpen && (

              <div
                className="admin-notification-dropdown"
              >

                {/* HEADER */}

                <div
                  className="admin-notification-header"
                >

                  <div>

                    <span>
                      ADMIN PANEL
                    </span>

                    <h3>
                      Notifications
                    </h3>

                  </div>


                  <button
                    type="button"

                    className="admin-notification-close"

                    onClick={() =>
                      setNotificationsOpen(
                        false
                      )
                    }

                    aria-label="Close notifications"

                    title="Close"
                  >

                    <X
                      size={17}
                    />

                  </button>

                </div>


                {/* NOTIFICATION LIST */}

                <div
                  className="admin-notification-list"
                >

                  {notifications.length > 0 ? (

                    notifications.map(
                      (notification) => (

                        <div
                          className="admin-notification-item"

                          key={
                            notification.id
                          }
                        >

                          {/* ICON */}

                          <div
                            className={`admin-notification-icon ${
                              notification.type
                            }`}
                          >

                            {getNotificationIcon(
                              notification.type
                            )}

                          </div>


                          {/* CONTENT */}

                          <div
                            className="admin-notification-content"
                          >

                            <strong>
                              {
                                notification.title
                              }
                            </strong>


                            <p>
                              {
                                notification.message
                              }
                            </p>


                            <span>
                              {
                                formatNotificationTime(
                                  notification.created_at
                                )
                              }
                            </span>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    /* EMPTY STATE */

                    <div
                      className="admin-no-notifications"
                    >

                      <Bell
                        size={28}
                      />


                      <h4>
                        No notifications
                      </h4>


                      <p>
                        You're all caught up.
                      </p>

                    </div>

                  )}

                </div>


                {/* FOOTER */}

                <div
                  className="admin-notification-footer"
                >

                  <button
                    type="button"

                    onClick={() =>
                      setNotificationsOpen(
                        false
                      )
                    }
                  >
                    Close
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* ====================================================
          ADMIN SIDEBAR
      ==================================================== */}

      <AdminSidebar
        collapsed={
          sidebarCollapsed
        }

        onToggle={
          toggleSidebar
        }
      />


      {/* ====================================================
          ADMIN CONTENT
      ==================================================== */}

      <div
        className="admin-content-wrapper"
      >

        <main
          className="admin-main-content"
        >

          <Outlet />

        </main>

      </div>

    </div>
  );
}


export default AdminLayout;