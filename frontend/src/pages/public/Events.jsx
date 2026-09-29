import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Grid,
  List,
  Sparkles,
  LoaderCircle,
  RefreshCw,
  X,
} from "lucide-react";

import { useSearchParams } from "react-router-dom";

import EventCard from "../../components/EventCard";
import Navbar from "../../components/Navbar";
import "./Events.css";


const API_URL =
  "http://127.0.0.1:8000/api/events/";

const CATEGORIES_API_URL =
  "http://127.0.0.1:8000/api/events/categories/public/";


export default function Events() {

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  /* ==========================================================
     STATE
     ========================================================== */

  const [events, setEvents] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [viewMode, setViewMode] =
    useState("grid");

  const [savedIds, setSavedIds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [error, setError] =
    useState("");

  const [
    categoriesError,
    setCategoriesError,
  ] = useState("");


  /* ==========================================================
     FETCH EVENTS FROM DJANGO
     ========================================================== */

  const fetchEvents = async () => {

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(API_URL);

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data?.detail ||
          data?.message ||
          "Unable to load events."
        );

      }

      const eventList =
        Array.isArray(data)
          ? data
          : data.results || [];

      setEvents(eventList);

    } catch (err) {

      console.error(
        "Events API error:",
        err
      );

      setError(
        err.message ||
        "Unable to connect to EventHub."
      );

    } finally {

      setLoading(false);

    }
  };


  /* ==========================================================
     FETCH ACTIVE CATEGORIES FROM DJANGO
     ========================================================== */

  const fetchCategories = async () => {

    setCategoriesLoading(true);
    setCategoriesError("");

    try {

      const response =
        await fetch(CATEGORIES_API_URL);

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data?.detail ||
          data?.message ||
          "Unable to load categories."
        );

      }

      const categoryList =
        Array.isArray(data)
          ? data
          : data.results || [];

      setCategories(categoryList);

    } catch (err) {

      console.error(
        "Categories API error:",
        err
      );

      setCategoriesError(
        err.message ||
        "Unable to load categories."
      );

      setCategories([]);

    } finally {

      setCategoriesLoading(false);

    }
  };


  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {

    fetchEvents();
    fetchCategories();

  }, []);


  /* ==========================================================
     READ URL FILTERS
     ========================================================== */

  useEffect(() => {

    const search =
      searchParams.get("search") ||
      "";

    const category =
      searchParams.get("category") ||
      "All";


    setSearchTerm(search);


    /*
      Check whether the category exists in the
      database categories loaded from Django.
    */

    if (category === "All") {

      setSelectedCategory("All");
      return;

    }


    const matchedCategory =
      categories.find(
        (item) =>
          item.name?.toLowerCase() ===
          category.toLowerCase()
      );


    if (matchedCategory) {

      setSelectedCategory(
        matchedCategory.name
      );

    } else {

      /*
        Keep the URL category available even if
        categories are still loading.
      */

      if (categoriesLoading) {

        setSelectedCategory(category);

      } else {

        setSelectedCategory("All");

      }

    }

  }, [
    searchParams,
    categories,
    categoriesLoading,
  ]);


  /* ==========================================================
     SAVE EVENT
     ========================================================== */

  const toggleSave = (id) => {

    setSavedIds(
      (previous) => {

        if (
          previous.includes(id)
        ) {

          return previous.filter(
            (item) => item !== id
          );

        }

        return [
          ...previous,
          id,
        ];

      }
    );

  };


  /* ==========================================================
     FILTER EVENTS
     ========================================================== */

  const filteredEvents =
    useMemo(() => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      return events.filter(
        (event) => {

          const title =
            event.title ||
            "";

          const description =
            event.description ||
            "";

          const category =
            event.category ||
            "";


          const matchesSearch =
            title
              .toLowerCase()
              .includes(search) ||

            description
              .toLowerCase()
              .includes(search);


          const matchesCategory =
            selectedCategory === "All" ||
            category
              .toLowerCase()
              .trim() ===
            selectedCategory
              .toLowerCase()
              .trim();


          return (
            matchesSearch &&
            matchesCategory
          );

        }
      );

    }, [
      events,
      searchTerm,
      selectedCategory,
    ]);


  /* ==========================================================
     SEARCH
     ========================================================== */

  const handleSearch = (e) => {

    const value =
      e.target.value;


    setSearchTerm(value);


    const params =
      new URLSearchParams(
        searchParams
      );


    if (value.trim()) {

      params.set(
        "search",
        value
      );

    } else {

      params.delete(
        "search"
      );

    }


    setSearchParams(
      params,
      {
        replace: true,
      }
    );

  };


  /* ==========================================================
     CATEGORY
     ========================================================== */

  const handleCategory = (
    category
  ) => {

    setSelectedCategory(
      category
    );


    const params =
      new URLSearchParams(
        searchParams
      );


    if (
      category !== "All"
    ) {

      params.set(
        "category",
        category
      );

    } else {

      params.delete(
        "category"
      );

    }


    setSearchParams(
      params,
      {
        replace: true,
      }
    );

  };


  /* ==========================================================
     RESET
     ========================================================== */

  const handleReset = () => {

    setSearchTerm("");

    setSelectedCategory(
      "All"
    );

    setSearchParams({});

  };


  /* ==========================================================
     CATEGORY LIST FOR UI
     ========================================================== */

  const categoryButtons = [
    {
      id: "all",
      name: "All",
    },
    ...categories,
  ];


  /* ==========================================================
     UI
     ========================================================== */

  return (
    <>
      <Navbar />

      <main className="eventhub">

        <section className="events-section section">

          <div className="events-page-container">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="events-header">

              <div>

                <span className="blue-label">
                  03 / WHAT'S HAPPENING
                </span>

                <h2>
                  Explore
                  <br />
                  <span>
                    events.
                  </span>
                </h2>

                <p>
                  Discover your next challenge,
                  workshop or opportunity.
                </p>

              </div>


              <div className="events-header-right">

                <p>
                  Showing{" "}

                  <strong>
                    {filteredEvents.length}
                  </strong>{" "}

                  events
                </p>

              </div>

            </div>


            {/* ==================================================
                FILTER BAR
            ================================================== */}

            <section className="events-page-tools">


              {/* SEARCH */}

              <div className="events-page-search">

                <Search
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={
                    handleSearch
                  }
                />

              </div>


              {/* VIEW MODE */}

              <div className="events-view-toggle">

                <button
                  type="button"
                  className={
                    viewMode === "grid"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setViewMode("grid")
                  }
                  aria-label="Grid view"
                >

                  <Grid size={17} />

                </button>


                <button
                  type="button"
                  className={
                    viewMode === "list"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setViewMode("list")
                  }
                  aria-label="List view"
                >

                  <List size={17} />

                </button>

              </div>

            </section>


            {/* ==================================================
                CATEGORIES
            ================================================== */}

            <div className="events-page-categories">

              {categoriesLoading ? (

                <button
                  type="button"
                  className="active"
                  disabled
                >
                  Loading categories...
                </button>

              ) : (

                categoryButtons.map(
                  (category) => (

                    <button
                      type="button"
                      key={
                        category.id ||
                        category.name
                      }
                      className={
                        selectedCategory
                          .toLowerCase() ===
                        category.name.toLowerCase()
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handleCategory(
                          category.name
                        )
                      }
                    >

                      {category.name}

                    </button>

                  )
                )

              )}

            </div>


            {/* ==================================================
                CATEGORY ERROR
            ================================================== */}

            {!categoriesLoading &&
              categoriesError && (

                <div
                  className="active-filters"
                  style={{
                    marginTop: "12px",
                  }}
                >

                  <span>
                    Unable to load categories.
                  </span>

                  <button
                    type="button"
                    onClick={
                      fetchCategories
                    }
                  >
                    <RefreshCw
                      size={13}
                    />
                    Retry
                  </button>

                </div>

              )}


            {/* ==================================================
                ACTIVE FILTERS
            ================================================== */}

            {(searchTerm ||
              selectedCategory !== "All") && (

              <div className="active-filters">

                {searchTerm && (

                  <button
                    type="button"
                    onClick={() => {

                      setSearchTerm("");

                      const params =
                        new URLSearchParams(
                          searchParams
                        );

                      params.delete(
                        "search"
                      );

                      setSearchParams(
                        params,
                        {
                          replace: true,
                        }
                      );

                    }}
                  >

                    Search: {searchTerm}

                    <X size={13} />

                  </button>

                )}


                {selectedCategory !==
                  "All" && (

                  <button
                    type="button"
                    onClick={() =>
                      handleCategory(
                        "All"
                      )
                    }
                  >

                    {selectedCategory}

                    <X size={13} />

                  </button>

                )}


                <button
                  type="button"
                  className="clear-all"
                  onClick={
                    handleReset
                  }
                >

                  Clear all

                </button>

              </div>

            )}


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

              <section className="events-empty">

                <div className="events-empty-icon">

                  <LoaderCircle
                    size={32}
                    className="animate-spin"
                  />

                </div>

                <h2>
                  Loading events...
                </h2>

                <p>
                  Fetching the latest events from EventHub.
                </p>

              </section>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {!loading &&
              error && (

              <section className="events-empty">

                <div className="events-empty-icon">

                  <Sparkles
                    size={32}
                  />

                </div>

                <h2>
                  Unable to load events
                </h2>

                <p>
                  {error}
                </p>

                <button
                  className="reset-btn"
                  type="button"
                  onClick={
                    fetchEvents
                  }
                >

                  <RefreshCw
                    size={15}
                  />

                  Try Again

                </button>

              </section>

            )}


            {/* ==================================================
                EVENT GRID / LIST
            ================================================== */}

            {!loading &&
              !error &&
              filteredEvents.length > 0 && (

              <section
                className={
                  viewMode === "grid"
                    ? "events-grid"
                    : "events-list"
                }
              >

                {filteredEvents.map(
                  (event, index) => (

                    <EventCard
                      key={event.id}
                      event={event}
                      index={index}
                      isSaved={
                        savedIds.includes(
                          event.id
                        )
                      }
                      onToggleSave={
                        toggleSave
                      }
                    />

                  )
                )}

              </section>

            )}


            {/* ==================================================
                EMPTY DATABASE
            ================================================== */}

            {!loading &&
              !error &&
              events.length === 0 && (

              <section className="events-empty">

                <div className="events-empty-icon">

                  <Sparkles
                    size={32}
                  />

                </div>

                <h2>
                  No Events Yet
                </h2>

                <p>
                  No organizer has published an event yet.
                </p>

              </section>

            )}


            {/* ==================================================
                NO SEARCH / CATEGORY RESULTS
            ================================================== */}

            {!loading &&
              !error &&
              events.length > 0 &&
              filteredEvents.length === 0 && (

              <section className="events-empty">

                <div className="events-empty-icon">

                  <Sparkles
                    size={32}
                  />

                </div>

                <h2>
                  No Events Found
                </h2>

                <p>
                  We couldn't find any events matching
                  your current filters.
                </p>

                <button
                  className="reset-btn"
                  type="button"
                  onClick={
                    handleReset
                  }
                >

                  Reset Filters

                </button>

              </section>

            )}

          </div>

        </section>

      </main>
    </>
  );
}