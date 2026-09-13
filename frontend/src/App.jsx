
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, LogOut } from "lucide-react";
import "./index.css";

import ScrollProgress from "./components/ScrollProgress";
import SmoothScroll from "./components/SmoothScroll";
import PageTransition from "./components/PageTransition";

/* ============================================================
   DASHBOARD DATA
   ============================================================ */

const dashboardData = {
  student: {
    icon: "🎓",
    title: "Student Experience",
    heading: "Discover. Register. Participate.",
    text:
      "Find exciting technical events, register instantly, save your favorites and manage your entire event journey.",
    subtitle: "Discover & Participate",
    features: [
      "Discover Events",
      "My Registrations",
      "Saved Events",
    ],
  },

  organizer: {
    icon: "🚀",
    title: "Organizer Experience",
    heading: "Create. Manage. Connect.",
    text:
      "Create events, manage registrations and connect with students through a powerful organizer workspace.",
    subtitle: "Create & Manage",
    features: [
      "Create Events",
      "Manage Registrations",
      "Event Analytics",
    ],
  },

};

/* ============================================================
   CATEGORIES
   ============================================================ */

const categories = [
  {
    symbol: "</>",
    title: "CODING",
    description:
      "Programming contests and coding challenges.",
  },
  {
    symbol: "AI",
    title: "AI / ML",
    description:
      "Artificial intelligence and machine learning.",
  },
  {
    symbol: "◈",
    title: "ROBOTICS",
    description:
      "Build, experiment and compete with robots.",
  },
  {
    symbol: "⚡",
    title: "HACKATHONS",
    description:
      "Turn innovative ideas into real solutions.",
  },
  {
    symbol: "◉",
    title: "PROJECTS",
    description:
      "Showcase innovative college projects.",
  },
  {
    symbol: "⌁",
    title: "WORKSHOPS",
    description:
      "Learn practical technical skills.",
  },
];

/* ============================================================
   FEATURE DATA
   ============================================================ */

const features = [
  {
    title: "Smart Event Discovery",
    description: "Find relevant events faster.",
  },
  {
    title: "Quick Registration",
    description:
      "Register without complicated processes.",
  },
  {
    title: "Personal Event Space",
    description:
      "Manage registrations and saved events.",
  },
  {
    title: "Event Feedback",
    description:
      "Share your experience with organizers.",
  },
];

/* ============================================================
   APP
   ============================================================ */

const EVENTS_API_URL = "http://127.0.0.1:8000/api/events/";

const getEventImage = (event) => {
  const rawImage = event?.image_url || event?.image || "";

  if (!rawImage) {
    return "";
  }

  if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
    return rawImage;
  }

  return `http://127.0.0.1:8000${
    rawImage.startsWith("/") ? rawImage : `/${rawImage}`
  }`;
};

const parseEventDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const [year, month, day] = String(dateValue)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  // Local date avoids the UTC date-shift problem with YYYY-MM-DD strings.
  return new Date(year, month - 1, day);
};

const formatEventDate = (dateValue) => {
  const date = parseEventDate(dateValue);

  if (!date) {
    return {
      day: "--",
      month: "---",
    };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase(),
  };
};

function App() {
  const navigate = useNavigate();

  const [activeDashboard, setActiveDashboard] =
    useState("student");

  const [menuOpen, setMenuOpen] = useState(false);

  const [rating, setRating] = useState(0);

  const [feedbackSent, setFeedbackSent] =
    useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  /* ==========================================================
     UPCOMING EVENTS FROM DJANGO
     ========================================================== */

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(EVENTS_API_URL);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.message ||
              "Unable to load events."
          );
        }

        const eventList = Array.isArray(data)
          ? data
          : data.results || [];

       const upcomingEvents = eventList
  .filter((event) => {
    const status = String(event?.status || "").toLowerCase();

    return status !== "cancelled" && status !== "inactive";
  })
  .sort((a, b) => {
    const dateA = parseEventDate(a?.date);
    const dateB = parseEventDate(b?.date);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateA - dateB;
  });

setEvents(upcomingEvents);
      } catch (error) {
        console.error(
          "Homepage events API error:",
          error
        );
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* ==========================================================
     SCROLL REVEAL + 3D SECTION STORY
     ========================================================== */

  useEffect(() => {
    const revealElements =
      document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

    const sections = document.querySelectorAll(
      ".eventhub > section"
    );

    sections.forEach((section) => {
      section.classList.add("scroll-story");
    });

    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "scroll-story-active"
            );
          } else {
            entry.target.classList.remove(
              "scroll-story-active"
            );
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "-8% 0px -8% 0px",
      }
    );

    sections.forEach((section) => {
      storyObserver.observe(section);
    });

    return () => {
      revealObserver.disconnect();
      storyObserver.disconnect();
    };
  }, []);

  /* ==========================================================
     AUTHENTICATION STATE
     ========================================================== */

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
        console.error("Unable to read saved user:", error);
        setIsLoggedIn(false);
        setLoggedInUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setLoggedInUser(null);
    }
  }, []);

  const handleProfile = () => {
    if (loggedInUser?.role === "student") {
      navigate("/student/profile");
    } else if (loggedInUser?.role === "organizer") {
      navigate("/organizer/profile");
    } else {
      navigate("/auth");
    }
    closeMenu();
  };

  const handleLogout = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/api/auth/logout/", {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
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

  /* ==========================================================
     MOBILE MENU
     ========================================================== */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* ==========================================================
     ACTIVE DASHBOARD
     ========================================================== */

  const dashboard =
    dashboardData[activeDashboard];

  /* ==========================================================
     FEEDBACK
     ========================================================== */

  const submitFeedback = (event) => {
    event.preventDefault();

    if (!rating || !selectedEvent) {
      alert(
        "Please select an event and rating."
      );
      return;
    }

    setFeedbackSent(true);
  };

  const resetFeedback = () => {
    setFeedbackSent(false);
    setRating(0);
    setSelectedEvent("");
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <>
      <SmoothScroll />

      <ScrollProgress />

      <PageTransition>
        <div className="eventhub">

          {/* ==================================================
              NAVBAR
          ================================================== */}

          <header className="navbar">

            <a
              href="#home"
              className="brand"
              onClick={closeMenu}
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
            </a>

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

            <nav
              className={
                menuOpen
                  ? "nav-menu open"
                  : "nav-menu"
              }
            >
              <a
                href="#home"
                onClick={closeMenu}
              >
                Home
              </a>

              <a
                href="#events"
                onClick={closeMenu}
              >
                Events
              </a>

              <a
                href="#categories"
                onClick={closeMenu}
              >
                Categories
              </a>

              <a
                href="#about"
                onClick={closeMenu}
              >
                About
              </a>

              <a
                href="#feedback"
                onClick={closeMenu}
              >
                Feedback
              </a>
            </nav>

            <div className="nav-buttons">

              {isLoggedIn ? (
                <>
                  <button type="button" onClick={handleProfile} aria-label="Profile" title="Profile" className="login-button" style={{ minWidth: 42, width: 42, height: 42, padding: 0, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <UserRound size={19} strokeWidth={2} />
                  </button>

                  <button type="button" onClick={handleLogout} aria-label="Logout" title="Logout" className="register-button" style={{ minWidth: 42, width: 42, height: 42, padding: 0, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <LogOut size={19} strokeWidth={2} />
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

          {/* ==================================================
              HERO
          ================================================== */}

          <section
            id="home"
            className="hero"
          >

            <div className="hero-grid"></div>

            <div className="hero-content reveal">

              <div className="hero-tag">
                <span className="pulse"></span>
                THE FUTURE OF COLLEGE EVENTS
              </div>

              <h1>
                Where Ideas
                <br />
                <span>
                  Become Experience.
                </span>
              </h1>

              <p>
                Discover technical events, connect
                with brilliant minds, compete in
                exciting challenges and make your
                campus experience unforgettable.
              </p>

              <div className="hero-actions">

                <a
                  href="#events"
                  className="blue-button"
                >
                  Explore Events
                  <span>↗</span>
                </a>

                <a
                  href="#about"
                  className="glass-button"
                >
                  Discover EventHub
                </a>

              </div>

              <div className="hero-numbers">

                <div>
                  <strong>150+</strong>
                  <span>Events</span>
                </div>

                <div>
                  <strong>25+</strong>
                  <span>Colleges</span>
                </div>

                <div>
                  <strong>5K+</strong>
                  <span>Students</span>
                </div>

              </div>

            </div>

            {/* =================================================
                HERO CHARACTER
            ================================================= */}

            <div className="hero-3d reveal">

              <div className="tech-orbit orbit-1"></div>
              <div className="tech-orbit orbit-2"></div>
              <div className="tech-orbit orbit-3"></div>

              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>

              <div className="hero-character-stage">

                <div className="character-video-wrapper">

                  <video
                    className="character-3d-video"
                    src="/videos/character-hero-full.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />

                  <div className="character-video-overlay"></div>

                  <div className="character-video-badge">
                    <span></span>
                    EVENTHUB
                  </div>

                </div>

                <div className="character-feature feature-register">

                  <span>📅</span>

                  <div>
                    <strong>
                      Register
                    </strong>

                    <small>
                      Join events instantly
                    </small>
                  </div>

                </div>

                <div className="character-feature feature-events">

                  <span>🚀</span>

                  <div>
                    <strong>
                      Upcoming Events
                    </strong>

                    <small>
                      Discover what's next
                    </small>
                  </div>

                </div>

                <div className="character-feature feature-category">

                  <span>⚡</span>

                  <div>
                    <strong>
                      Categories
                    </strong>

                    <small>
                      Hackathon · AI · Robotics
                    </small>
                  </div>

                </div>

                <div className="character-feature feature-registration">

                  <span>✓</span>

                  <div>
                    <strong>
                      My Registrations
                    </strong>

                    <small>
                      Track your events
                    </small>
                  </div>

                </div>

                <div className="character-orbit orbit-one"></div>
                <div className="character-orbit orbit-two"></div>

                <span className="tech-particle particle-one"></span>
                <span className="tech-particle particle-two"></span>
                <span className="tech-particle particle-three"></span>
                <span className="tech-particle particle-four"></span>

              </div>

              <div className="floating-label label-top">
                LIVE EVENTS
              </div>

              <div className="floating-label label-bottom">
                CONNECT • CREATE • COMPETE
              </div>

            </div>

            <div className="scroll-indicator">
              <span></span>
              SCROLL TO EXPLORE
            </div>

          </section>

          {/* ==================================================
              ABOUT
          ================================================== */}

          <section
            id="about"
            className="about-section section"
          >

            <div className="section-intro reveal">

              <span className="blue-label">
                01 / ABOUT EVENTHUB
              </span>

              <h2>
                One platform.
                <br />
                <span>
                  Every opportunity.
                </span>
              </h2>

              <p>
                EventHub brings your college's
                technical events, competitions,
                workshops and activities together
                in one connected digital experience.
              </p>

            </div>

            <div className="about-cards">

              <div className="about-card large reveal">

                <div className="about-icon">
                  ⌁
                </div>

                <span>
                  DISCOVER
                </span>

                <h3>
                  Find what's
                  <br />
                  happening.
                </h3>

                <p>
                  Explore events from coding and
                  robotics to AI, hackathons and
                  project exhibitions.
                </p>

                <div className="card-decoration">
                  01
                </div>

              </div>

              <div className="about-card reveal">

                <div className="about-icon">
                  ⚡
                </div>

                <span>
                  PARTICIPATE
                </span>

                <h3>
                  Turn interest
                  <br />
                  into action.
                </h3>

                <p>
                  Register for events and keep your
                  participation organized.
                </p>

              </div>

              <div className="about-card reveal">

                <div className="about-icon">
                  ◉
                </div>

                <span>
                  CONNECT
                </span>

                <h3>
                  Meet your
                  <br />
                  community.
                </h3>

                <p>
                  Connect with students, organizers
                  and innovators across campus.
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              DASHBOARDS
          ================================================== */}

          <section className="dashboard-section section">

            <div className="section-intro center reveal">

              <span className="blue-label">
                02 / TWO POWERFUL EXPERIENCES
              </span>

              <h2>
                Built for every
                <br />
                <span>
                  side of campus.
                </span>
              </h2>

            </div>

            <div className="dashboard-tabs reveal">

              {Object.keys(dashboardData).map(
                (type) => (

                  <button
                    key={type}
                    className={
                      activeDashboard === type
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setActiveDashboard(type)
                    }
                  >

                    <span>
                      {dashboardData[type].icon}
                    </span>

                    <div>

                      <strong>
                        {dashboardData[type].title}
                      </strong>

                      <small>
                        {dashboardData[type].subtitle}
                      </small>

                    </div>

                  </button>

                )
              )}

            </div>

            <div className="dashboard-container reveal">

              <div className="dashboard-text">

                <span className="small-blue">
                  {dashboard.title}
                </span>

                <h3>
                  {dashboard.heading}
                </h3>

                <p>
                  {dashboard.text}
                </p>

                <div className="dashboard-feature-list">

                  {dashboard.features.map(
                    (feature, index) => (

                      <div key={feature}>

                        <span>
                          0{index + 1}
                        </span>

                        {feature}

                      </div>

                    )
                  )}

                </div>

                <button
                  className="dashboard-button"
                  onClick={() => {
                    const token =
                      localStorage.getItem("token") ||
                      sessionStorage.getItem("token");

                    const storedUser =
                      localStorage.getItem("user") ||
                      sessionStorage.getItem("user");

                    // Not logged in → open the login/register page first.
                    if (!token || !storedUser) {
                      navigate("/auth");
                      return;
                    }

                    try {
                      const user = JSON.parse(storedUser);

                      if (activeDashboard === "student") {
                        if (user.role === "student") {
                          navigate("/student/dashboard");
                        } else {
                          navigate("/auth?role=student&reason=wrong-role");
                        }
                      } else if (activeDashboard === "organizer") {
                        if (user.role === "organizer") {
                          navigate("/organizer/dashboard");
                        } else {
                          navigate("/auth?role=organizer&reason=wrong-role");
                        }
                      }
                    } catch (error) {
                      console.error("Unable to read logged-in user:", error);
                      navigate("/auth");
                    }
                  }}
                >
                  {activeDashboard === "student"
                    ? "Student Dashboard →"
                    : "Organizer Dashboard →"}
                </button>

              </div>

              <div className="dashboard-ui">

                <div className="ui-top">

                  <strong>
                    EVENTHUB
                  </strong>

                  <div>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>

                </div>

                <div className="ui-content">

                  <div className="ui-title">

                    <small>
                      WELCOME BACK
                    </small>

                    <h4>
                      {activeDashboard} workspace
                    </h4>

                  </div>

                  <div className="ui-stats">

                    <div>
                      <span>UPCOMING</span>
                      <strong>24</strong>
                    </div>

                    <div>
                      <span>REGISTERED</span>
                      <strong>18</strong>
                    </div>

                    <div>
                      <span>SAVED</span>
                      <strong>07</strong>
                    </div>

                  </div>

                  <div className="ui-events">

                    <div>
                      <span></span>
                      <p></p>
                    </div>

                    <div>
                      <span></span>
                      <p></p>
                    </div>

                    <div>
                      <span></span>
                      <p></p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              UPCOMING EVENTS
          ================================================== */}

          <section
            id="events"
            className="events-section section"
          >

            <div className="events-header reveal">

              <div>

                <span className="blue-label">
                  03 / WHAT'S HAPPENING
                </span>

                <h2>
                  Upcoming
                  <br />
                  <span>
                    events.
                  </span>
                </h2>

              </div>

              <div className="events-header-right">

                <p>
                  Discover your next challenge,
                  workshop or opportunity.
                </p>

                <button
                  className="view-all-events-btn"
                  onClick={() =>
                    navigate("/events")
                  }
                  aria-label="View all events"
                >
                  <span>
                    View All Events
                  </span>

                  <span className="view-all-arrow">
                    →
                  </span>
                </button>

              </div>

            </div>

            <div className="events-grid">

              {eventsLoading ? (

                <div className="event-loading">
                  Loading upcoming events...
                </div>

              ) : events.length === 0 ? (

                <div className="event-loading">
                  No upcoming events available.
                </div>

              ) : (

                events.slice(0, 6).map((event, index) => {

                  const formattedDate =
                    formatEventDate(event?.date);

                  return (
                    <article
                      className="event-card reveal show"
                      key={event.id}
                    >

                      <div className="event-image">

                        <img
                          src={
                            getEventImage(event) ||
                            "/default-event.jpg"
                          }
                          alt={event.title || "Event"}
                          loading="lazy"
                        />

                        <div className="image-overlay"></div>

                        <span className="event-category">
                          {event.category || "EVENT"}
                        </span>

                        <span className="event-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="event-date">

                          <strong>
                            {formattedDate.day}
                          </strong>

                          <span>
                            {formattedDate.month}
                          </span>

                        </div>

                      </div>

                      <div className="event-info">

                        <h3>
                          {event.title}
                        </h3>

                        <div className="event-details">

                          <span>
                            ◷ {event.time || "Time TBA"}
                          </span>

                          <span>
                            ⌖ {event.venue || event.location || "Venue TBA"}
                          </span>

                        </div>

                        <button
                          className="event-register"
                          type="button"
                          onClick={() =>
                            navigate(`/event/${event.id}`)
                          }
                        >
                          View Event
                          <span>↗</span>
                        </button>

                      </div>

                    </article>
                  );
                })

              )}

            </div>

          </section>

          {/* ==================================================
              VIDEO EXPERIENCE
          ================================================== */}

          <section className="experience-section section">

            <div className="experience-header reveal">

              <span className="blue-label">
                04 / EXPERIENCE WHAT'S NEXT
              </span>

              <h2>
                The future of
                <br />
                <span>
                  campus events.
                </span>
              </h2>

              <p>
                Get a glimpse of the energy,
                technology and creativity behind
                the next generation of college events.
              </p>

            </div>

            <div className="video-wrapper reveal">

              <div className="video-background">

                <div className="video-grid"></div>

                <div className="video-core">

                  <div className="video-ring ring-1"></div>
                  <div className="video-ring ring-2"></div>
                  <div className="video-ring ring-3"></div>

                  <div className="video-core-text">

                    <small>
                      EVENT
                    </small>

                    <strong>
                      2026
                    </strong>

                    <span>
                      TECH EXPERIENCE
                    </span>

                  </div>

                </div>

                <div className="video-code code-one">
                  &lt;EVENT_HUB /&gt;
                </div>

                <div className="video-code code-two">
                  AI + CODE + ROBOTICS
                </div>

                <div className="video-code code-three">
                  CONNECT();
                </div>

              </div>

              <div className="video-overlay">

                <div>

                  <span>
                    EVENTHUB VISUAL EXPERIENCE
                  </span>

                  <h3>
                    Imagine.
                    <br />
                    Build.
                    <br />
                    Experience.
                  </h3>

                </div>

              </div>

            </div>

            <p className="video-note">
              * The animated visual above is a
              3D-style event showcase. You can replace
              it later with your own MP4 event video.
            </p>

          </section>

          {/* ==================================================
              CATEGORIES
          ================================================== */}

          <section
            id="categories"
            className="categories-section section"
          >

            <div className="section-intro center reveal">

              <span className="blue-label">
                05 / EXPLORE INTERESTS
              </span>

              <h2>
                Find your
                <br />
                <span>
                  next challenge.
                </span>
              </h2>

            </div>

            <div className="category-grid">

              {categories.map((category) => (

                <div
                  className="category-item reveal"
                  key={category.title}
                >

                  <div className="category-symbol">
                    {category.symbol}
                  </div>

                  <h3>
                    {category.title}
                  </h3>

                  <p>
                    {category.description}
                  </p>

                  <span>
                    Explore →
                  </span>

                </div>

              ))}

            </div>

          </section>

          {/* ==================================================
              FEATURES
          ================================================== */}

          <section className="features-section section">

            <div className="feature-visual reveal">

              <div className="feature-orbit"></div>

              <div className="feature-core">

                <small>
                  EVENT
                </small>

                <strong>
                  HUB
                </strong>

                <span>
                  ∞
                </span>

              </div>

              <div className="feature-node node-one">
                Smart Search
              </div>

              <div className="feature-node node-two">
                Easy Registration
              </div>

              <div className="feature-node node-three">
                Saved Events
              </div>

              <div className="feature-node node-four">
                Feedback
              </div>

            </div>

            <div className="feature-content reveal">

              <span className="blue-label">
                06 / POWERFUL FEATURES
              </span>

              <h2>
                Everything you need
                <br />
                <span>
                  in one place.
                </span>
              </h2>

              <p>
                EventHub makes discovering and
                participating in college events simple,
                organized and engaging.
              </p>

              <div className="feature-list">

                {features.map((feature) => (

                  <div key={feature.title}>

                    <span>
                      ✓
                    </span>

                    <div>

                      <strong>
                        {feature.title}
                      </strong>

                      <p>
                        {feature.description}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>

          {/* ==================================================
              WORKFLOW
          ================================================== */}

          <section className="workflow-section section">

            <div className="section-intro center reveal">

              <span className="blue-label">
                07 / HOW EVENTHUB WORKS
              </span>

              <h2>
                Discover.
                <br />
                <span>
                  Experience.
                </span>
              </h2>

            </div>

            <div className="workflow">

              <div className="workflow-step reveal">

                <span>
                  01
                </span>

                <div className="workflow-icon">
                  ⌕
                </div>

                <h3>
                  Discover
                </h3>

                <p>
                  Explore technical events happening
                  around your campus.
                </p>

              </div>

              <div className="workflow-connector"></div>

              <div className="workflow-step reveal">

                <span>
                  02
                </span>

                <div className="workflow-icon">
                  ↗
                </div>

                <h3>
                  Register
                </h3>

                <p>
                  Choose an event and register in a
                  few simple steps.
                </p>

              </div>

              <div className="workflow-connector"></div>

              <div className="workflow-step reveal">

                <span>
                  03
                </span>

                <div className="workflow-icon">
                  ✦
                </div>

                <h3>
                  Participate
                </h3>

                <p>
                  Learn, compete, collaborate and
                  create memories.
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              FEEDBACK
          ================================================== */}

          <section
            id="feedback"
            className="feedback-section section"
          >

            <div className="feedback-wrapper reveal">

              <div className="feedback-left">

                <span className="blue-label">
                  08 / EVENT FEEDBACK
                </span>

                <h2>
                  Your experience
                  <br />
                  <span>
                    matters.
                  </span>
                </h2>

                <p>
                  Tell us what you thought about the
                  event. Your feedback helps organizers
                  create better experiences for everyone.
                </p>

                <div className="feedback-decoration">
                  <span>✦</span>
                  <span>✦</span>
                  <span>✦</span>
                </div>

              </div>

              <div className="feedback-form">

                {!feedbackSent ? (

                  <form onSubmit={submitFeedback}>

                    <label>
                      Select Event
                    </label>

                    <select
                      value={selectedEvent}
                      onChange={(event) =>
                        setSelectedEvent(
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Choose an event
                      </option>

                      {events.map((event) => (

                        <option
                          key={event.id}
                          value={event.title}
                        >
                          {event.title}
                        </option>

                      ))}

                    </select>

                    <label>
                      How was your experience?
                    </label>

                    <div className="stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <button
                            type="button"
                            key={star}
                            className={
                              rating >= star
                                ? "rated"
                                : ""
                            }
                            onClick={() =>
                              setRating(star)
                            }
                            aria-label={
                              `Rate ${star} out of 5`
                            }
                          >
                            ★
                          </button>

                        )
                      )}

                    </div>

                    <label>
                      Your Feedback
                    </label>

                    <textarea
                      placeholder="Tell us what you liked about the event..."
                      rows="5"
                    ></textarea>

                    <div className="feedback-options">

                      <span>
                        What did you like?
                      </span>

                      <label>
                        <input type="checkbox" />
                        Content
                      </label>

                      <label>
                        <input type="checkbox" />
                        Speakers
                      </label>

                      <label>
                        <input type="checkbox" />
                        Organization
                      </label>

                      <label>
                        <input type="checkbox" />
                        Activities
                      </label>

                    </div>

                    <button
                      type="submit"
                      className="submit-feedback"
                    >
                      Submit Feedback →
                    </button>

                  </form>

                ) : (

                  <div className="feedback-success">

                    <div className="success-icon">
                      ✓
                    </div>

                    <h3>
                      Thank you!
                    </h3>

                    <p>
                      Your feedback has been recorded.
                      It helps us make future EventHub
                      experiences even better.
                    </p>

                    <button
                      onClick={resetFeedback}
                    >
                      Give another feedback
                    </button>

                  </div>

                )}

              </div>

            </div>

          </section>

          {/* ==================================================
              FINAL CTA
          ================================================== */}

          <section className="final-cta reveal">

            <div className="cta-grid"></div>

            <div className="cta-content">

              <span>
                YOUR NEXT EXPERIENCE STARTS HERE
              </span>

              <h2>
                Don't just attend.
                <br />
                <strong>
                  Experience it.
                </strong>
              </h2>

              <a
                href="#events"
                className="blue-button"
              >
                Explore Upcoming Events →
              </a>

            </div>

            <div className="cta-orb">

              <div></div>

              <strong>
                EH
              </strong>

            </div>

          </section>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <footer className="footer">

            <div className="footer-top">

              <div className="footer-brand">

                <a
                  href="#home"
                  className="brand"
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

                </a>

                <p>
                  Connecting students, ideas and
                  opportunities through better college
                  events.
                </p>

              </div>

              <div className="footer-column">

                <h4>
                  PLATFORM
                </h4>

                <a href="#events">
                  All Events
                </a>

                <a href="#categories">
                  Categories
                </a>

                <a href="#about">
                  About Us
                </a>

                <a href="#feedback">
                  Feedback
                </a>

              </div>

              <div className="footer-column">

                <h4>
                  STUDENTS
                </h4>

                <a href="#events">
                  Discover Events
                </a>

                <a href="#events">
                  My Registrations
                </a>

                <a href="#events">
                  Saved Events
                </a>

              </div>

              <div className="footer-column">

                <h4>
                  ORGANIZERS
                </h4>

                <a href="#home">
                  Create Event
                </a>

                <a href="#home">
                  Manage Events
                </a>

                <a href="#home">
                  Analytics
                </a>

              </div>

            </div>

            <div className="footer-bottom">

              <span>
                © 2026 EventHub. All rights reserved.
              </span>

              <span>
                CONNECT • CREATE • COMPETE
              </span>

            </div>

          </footer>

        </div>
      </PageTransition>
    </>
  );
}

export default App;

