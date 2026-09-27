import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  ClipboardList,
  Ticket,
  UserRound,
  ShieldCheck,
  ArrowRight,
  BarChart3,
  Plus,
  Settings,
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/dashboard/"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load admin dashboard."
        );
      }

      setDashboardData(data);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(
        err.message || "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-main">
          <div className="admin-dashboard-state-card">
            <div className="admin-dashboard-spinner"></div>

            <h3>Loading dashboard</h3>

            <p>
              Preparing your EventHub administration
              overview...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
     ============================================================ */

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-main">
          <div className="admin-dashboard-state-card admin-dashboard-error-card">

            <div className="admin-dashboard-state-icon">
              <AlertCircle size={25} />
            </div>

            <h3>Unable to load dashboard</h3>

            <p>{error}</p>

            <button
              type="button"
              className="admin-dashboard-primary-button"
              onClick={fetchDashboard}
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     SAFE DATA
     ============================================================ */

  const users = dashboardData?.users || {};
  const events = dashboardData?.events || {};
  const registrations =
    dashboardData?.registrations || {};
  const tickets = dashboardData?.tickets || {};

  const registrationGraph =
    dashboardData?.registration_graph || [];

  const eventCategories =
    dashboardData?.event_categories || [];

  /* ============================================================
     HELPERS
     ============================================================ */

  const totalUsers = Number(users.total || 0);
  const totalEvents = Number(events.total || 0);
  const totalRegistrations = Number(
    registrations.total || 0
  );
  const totalTickets = Number(tickets.total || 0);

  const confirmedRegistrations = Number(
    registrations.confirmed || 0
  );

  const publishedEvents = Number(
    events.published || 0
  );

  const upcomingEvents = Number(
    events.upcoming || 0
  );

  const students = Number(users.students || 0);
  const organizers = Number(users.organizers || 0);

  const registrationPercentage =
    totalRegistrations > 0
      ? Math.min(
          100,
          Math.round(
            (confirmedRegistrations /
              totalRegistrations) *
              100
          )
        )
      : 0;

  const maxCategoryCount = Math.max(
    ...eventCategories.map((item) =>
      Number(item.count || 0)
    ),
    1
  );

  const maxGraphCount = Math.max(
    ...registrationGraph.map((item) =>
      Number(item.registrations || 0)
    ),
    1
  );

  return (
    <div className="admin-dashboard-page">

      <div className="admin-dashboard-main">

        {/* ==================================================
            HERO
            ================================================== */}

        <section className="admin-clean-hero">

          <div className="admin-hero-content">

            <div className="admin-hero-label">
              <span></span>
              ADMIN CONTROL CENTER
            </div>

            <h1>
              Manage your{" "}
              <span>EventHub</span>
              <br />
              platform with ease.
            </h1>

            <p>
              Monitor users, events, registrations and
              tickets from one central administration
              dashboard.
            </p>

            <div className="admin-hero-actions">

              <a
                href="/admin/events"
                className="admin-dashboard-primary-button"
              >
                <CalendarDays size={16} />
                Manage Events
                <ArrowRight size={15} />
              </a>

              <a
                href="/admin/users"
                className="admin-dashboard-glass-button"
              >
                <Users size={16} />
                Manage Users
              </a>

            </div>

            <div className="admin-hero-features">

              <div className="admin-feature">

                <div className="admin-feature-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <strong>
                    Centralized Control
                  </strong>

                  <small>
                    Manage the entire platform
                  </small>
                </div>

              </div>

              <div className="admin-feature">

                <div className="admin-feature-icon pink">
                  <Activity size={19} />
                </div>

                <div>
                  <strong>
                    Live Overview
                  </strong>

                  <small>
                    Track platform activity
                  </small>
                </div>

              </div>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="admin-hero-visual">

            <div className="admin-hero-visual-glow"></div>

            <div className="admin-hero-grid-pattern"></div>

            <div className="admin-hero-gradient-square"></div>

            <div className="admin-hero-gradient-circle"></div>


            {/* Main floating dashboard card */}

            <div className="admin-hero-card">

              <div className="admin-card-header">

                <div>
                  <i></i>
                  PLATFORM
                </div>

                <span>
                  ADMIN
                </span>

              </div>

              <div className="admin-card-center">

                <small>
                  TOTAL USERS
                </small>

                <strong>
                  {totalUsers}
                </strong>

                <span>
                  Registered accounts
                </span>

              </div>

              <div className="admin-card-footer">
                <span>
                  Students {students}
                </span>

                <span>
                  Organizers {organizers}
                </span>
              </div>

            </div>


            {/* Floating events card */}

            <div className="admin-floating-card admin-floating-events">

              <div className="admin-floating-round-icon">
                <CalendarDays size={17} />
              </div>

              <div>
                <strong>
                  {totalEvents} Events
                </strong>

                <small>
                  {upcomingEvents} upcoming
                </small>
              </div>

            </div>


            {/* Floating registration card */}

            <div className="admin-floating-card admin-floating-registrations">

              <div className="admin-floating-round-icon pink">
                <ClipboardList size={17} />
              </div>

              <div>
                <strong>
                  {totalRegistrations} Registrations
                </strong>

                <small>
                  {confirmedRegistrations} confirmed
                </small>
              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            STATISTICS
            ================================================== */}

        <section className="admin-clean-statistics">

          <div className="admin-clean-stat-card">

            <div className="admin-stat-icon">
              <Users size={18} />
            </div>

            <span>
              Total Users
            </span>

            <strong>
              {totalUsers}
            </strong>

            <small>
              {students} students · {organizers} organizers
            </small>

          </div>


          <div className="admin-clean-stat-card">

            <div className="admin-stat-icon pink">
              <CalendarDays size={18} />
            </div>

            <span>
              Total Events
            </span>

            <strong>
              {totalEvents}
            </strong>

            <small>
              {publishedEvents} published ·{" "}
              {upcomingEvents} upcoming
            </small>

          </div>


          <div className="admin-clean-stat-card">

            <div className="admin-stat-icon purple">
              <ClipboardList size={18} />
            </div>

            <span>
              Registrations
            </span>

            <strong>
              {totalRegistrations}
            </strong>

            <small>
              {confirmedRegistrations} confirmed
            </small>

          </div>


          <div className="admin-clean-stat-card">

            <div className="admin-stat-icon blue">
              <Ticket size={18} />
            </div>

            <span>
              Total Tickets
            </span>

            <strong>
              {totalTickets}
            </strong>

            <small>
              {tickets.valid || 0} currently valid
            </small>

          </div>

        </section>


        {/* ==================================================
            QUICK ACTIONS + REGISTRATION SUMMARY
            ================================================== */}

        <section className="admin-dashboard-lower-grid">

          {/* QUICK ACTIONS */}

          <div className="admin-dashboard-panel">

            <div className="admin-dashboard-panel-heading">

              <div>
                <span className="admin-dashboard-section-label">
                  ADMIN TOOLS
                </span>

                <h2>
                  Quick Actions
                </h2>
              </div>

              <BarChart3 size={20} />

            </div>


            <div className="admin-quick-actions-grid">

              <a
                href="/admin/users"
                className="admin-quick-action-card"
              >

                <div className="admin-quick-action-icon purple">
                  <Users size={18} />
                </div>

                <div>
                  <strong>
                    Manage Users
                  </strong>

                  <small>
                    View and manage accounts
                  </small>
                </div>

                <ArrowRight size={15} />

              </a>


              <a
                href="/admin/events"
                className="admin-quick-action-card"
              >

                <div className="admin-quick-action-icon pink">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <strong>
                    Manage Events
                  </strong>

                  <small>
                    Review platform events
                  </small>
                </div>

                <ArrowRight size={15} />

              </a>


              <a
                href="/admin/registrations"
                className="admin-quick-action-card"
              >

                <div className="admin-quick-action-icon blue">
                  <ClipboardList size={18} />
                </div>

                <div>
                  <strong>
                    Registrations
                  </strong>

                  <small>
                    Manage participants
                  </small>
                </div>

                <ArrowRight size={15} />

              </a>

            </div>

          </div>


          {/* REGISTRATION SUMMARY */}

          <div className="admin-dashboard-panel">

            <div className="admin-dashboard-panel-heading">

              <div>
                <span className="admin-dashboard-section-label">
                  REGISTRATION STATUS
                </span>

                <h2>
                  Overview
                </h2>
              </div>

              <ClipboardList size={20} />

            </div>


            <div className="admin-registration-overview">

              <div className="admin-registration-overview-top">

                <div>
                  <small>
                    CONFIRMED
                  </small>

                  <strong>
                    {confirmedRegistrations}
                  </strong>
                </div>

                <div className="admin-registration-percentage">
                  {registrationPercentage}%
                </div>

              </div>


              <div className="admin-registration-progress">

                <span
                  style={{
                    width: `${registrationPercentage}%`,
                  }}
                ></span>

              </div>


              <div className="admin-registration-summary-row">

                <span>
                  Total registrations
                </span>

                <strong>
                  {totalRegistrations}
                </strong>

              </div>

              <div className="admin-registration-summary-row">

                <span>
                  Cancelled
                </span>

                <strong>
                  {registrations.cancelled || 0}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            REGISTRATION ACTIVITY
            ================================================== */}

        <section className="admin-dashboard-panel admin-registration-activity-panel">

          <div className="admin-dashboard-panel-heading">

            <div>
              <span className="admin-dashboard-section-label">
                PLATFORM ACTIVITY
              </span>

              <h2>
                Registration Activity
              </h2>
            </div>

            <Activity size={20} />

          </div>


          {registrationGraph.length === 0 ? (

            <div className="admin-dashboard-empty-mini">
              <BarChart3 size={18} />

              <span>
                No registration activity available yet.
              </span>
            </div>

          ) : (

            <div className="admin-registration-chart">

              {registrationGraph.map(
                (item, index) => {

                  const count = Number(
                    item.registrations || 0
                  );

                  const height = Math.max(
                    8,
                    Math.round(
                      (count / maxGraphCount) *
                        100
                    )
                  );

                  return (
                    <div
                      className="admin-chart-column"
                      key={`${item.month}-${index}`}
                    >

                      <div className="admin-chart-value">
                        {count}
                      </div>

                      <div className="admin-chart-bar-wrapper">

                        <div
                          className="admin-chart-bar"
                          style={{
                            height: `${height}%`,
                          }}
                        ></div>

                      </div>

                      <span>
                        {item.month}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            EVENT CATEGORIES
            ================================================== */}

        <section className="admin-dashboard-panel admin-category-panel">

          <div className="admin-dashboard-panel-heading">

            <div>
              <span className="admin-dashboard-section-label">
                EVENT INSIGHTS
              </span>

              <h2>
                Events by Category
              </h2>
            </div>

            <CalendarDays size={20} />

          </div>


          {eventCategories.length === 0 ? (

            <div className="admin-dashboard-empty-mini">
              <CalendarDays size={18} />

              <span>
                No event category data available.
              </span>
            </div>

          ) : (

            <div className="admin-category-list">

              {eventCategories.map(
                (item, index) => {

                  const count = Number(
                    item.count || 0
                  );

                  const percentage = Math.round(
                    (count / maxCategoryCount) *
                      100
                  );

                  return (
                    <div
                      className="admin-category-item"
                      key={`${item.category}-${index}`}
                    >

                      <div className="admin-category-top">

                        <div className="admin-category-name">

                          <span
                            className={`admin-category-dot category-dot-${index % 3}`}
                          ></span>

                          <strong>
                            {item.category ||
                              "Other"}
                          </strong>

                        </div>

                        <span>
                          {count}
                        </span>

                      </div>


                      <div className="admin-category-progress">

                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            ADMIN FOOTER SPACE
            ================================================== */}

        <div className="admin-dashboard-footer-space"></div>

      </div>
    </div>
  );
}

export default AdminDashboard;