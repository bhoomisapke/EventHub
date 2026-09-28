import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  FolderTree,
  CheckCircle2,
  XCircle,
  CalendarDays,
  AlertCircle,
  RefreshCw,
  X,
  Save,
} from "lucide-react";

import "./Categories.css";

const API_URL =
  "http://127.0.0.1:8000/api/events/categories/";

/* ============================================================
   AUTH TOKEN
============================================================ */

const getToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken")
  );
};

/* ============================================================
   INITIAL FORM
============================================================ */

const INITIAL_FORM = {
  name: "",
  description: "",
  icon: "",
  is_active: true,
};

/* ============================================================
   COMPONENT
============================================================ */

function Categories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ============================================================
     FETCH CATEGORIES
  ============================================================ */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication credentials were not found. Please log in again."
        );
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Unable to load categories."
        );
      }

      setCategories(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      console.error("Categories API error:", err);

      setError(
        err.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ============================================================
     FILTERED CATEGORIES
  ============================================================ */

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        category.name
          ?.toLowerCase()
          .includes(searchText) ||
        category.description
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          category.is_active) ||
        (statusFilter === "inactive" &&
          !category.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  /* ============================================================
     STATISTICS
  ============================================================ */

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.is_active
  ).length;

  const inactiveCategories =
    totalCategories - activeCategories;

  const totalEvents = categories.reduce(
    (total, category) =>
      total + Number(category.event_count || 0),
    0
  );

  /* ============================================================
     OPEN CREATE MODAL
  ============================================================ */

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ ...INITIAL_FORM });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /* ============================================================
     OPEN EDIT MODAL
  ============================================================ */

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      icon: category.icon || "",
      is_active: Boolean(category.is_active),
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  /* ============================================================
     CLOSE MODAL
  ============================================================ */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);
    setForm({ ...INITIAL_FORM });
  };

  /* ============================================================
     FORM CHANGE
  ============================================================ */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ============================================================
     CREATE / UPDATE
  ============================================================ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication credentials were not found. Please log in again."
        );
      }

      const url = editingCategory
        ? `${API_URL}${editingCategory.id}/`
        : API_URL;

      const method = editingCategory
        ? "PATCH"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          icon: form.icon.trim(),
          is_active: form.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let message = "Unable to save category.";

        if (data.detail) {
          message = data.detail;
        } else if (data.name?.[0]) {
          message = data.name[0];
        } else if (data.description?.[0]) {
          message = data.description[0];
        } else if (data.icon?.[0]) {
          message = data.icon[0];
        } else if (data.is_active?.[0]) {
          message = data.is_active[0];
        }

        throw new Error(message);
      }

      setShowModal(false);
      setEditingCategory(null);
      setForm({ ...INITIAL_FORM });

      setSuccess(
        editingCategory
          ? "Category updated successfully."
          : "Category created successfully."
      );

      await fetchCategories();
    } catch (err) {
      console.error("Save category error:", err);

      setError(
        err.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     TOGGLE STATUS
  ============================================================ */

  const toggleStatus = async (category) => {
    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication credentials were not found. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}${category.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            is_active: !category.is_active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Unable to update category status."
        );
      }

      setSuccess(
        category.is_active
          ? "Category deactivated."
          : "Category activated."
      );

      await fetchCategories();
    } catch (err) {
      console.error(
        "Toggle category error:",
        err
      );

      setError(
        err.message ||
          "Unable to update category status."
      );
    }
  };

  /* ============================================================
     DELETE
  ============================================================ */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication credentials were not found. Please log in again."
        );
      }

      const response = await fetch(
        `${API_URL}${deleteTarget.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Unable to delete category.";

        try {
          const data = await response.json();

          message =
            data.detail ||
            data.error ||
            message;
        } catch {
          // DELETE may return an empty response.
        }

        throw new Error(message);
      }

      setDeleteTarget(null);

      setSuccess(
        "Category deleted successfully."
      );

      await fetchCategories();
    } catch (err) {
      console.error(
        "Delete category error:",
        err
      );

      setDeleteTarget(null);

      setError(
        err.message ||
          "Unable to delete category."
      );
    }
  };

  /* ============================================================
     CLEAR MESSAGES
  ============================================================ */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="categories-page">
        <div className="categories-main">
          <div className="categories-state-card">
            <div className="categories-spinner"></div>

            <h3>Loading categories</h3>

            <p>
              Preparing your EventHub
              category management...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <div className="categories-page">
      <div className="categories-main">

        {/* HEADER */}

        <section className="categories-header">
          <div>
            <div className="categories-eyebrow">
              <span></span>
              ADMIN MANAGEMENT
            </div>

            <h1>Categories</h1>

            <p>
              Organize campus events into
              clear and meaningful categories.
            </p>
          </div>

          <button
            type="button"
            className="categories-add-button"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Add Category
          </button>
        </section>

        {/* MESSAGES */}

        {error && (
          <div className="categories-alert error">
            <AlertCircle size={17} />

            <span>{error}</span>

            <button
              type="button"
              onClick={clearMessages}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {success && (
          <div className="categories-alert success">
            <CheckCircle2 size={17} />

            <span>{success}</span>

            <button
              type="button"
              onClick={clearMessages}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* STATISTICS */}

        <section className="categories-stat-grid">

          <div className="category-stat-card">
            <div className="category-stat-icon purple">
              <FolderTree size={19} />
            </div>

            <span>TOTAL CATEGORIES</span>

            <strong>
              {totalCategories}
            </strong>

            <small>
              All categories
            </small>
          </div>

          <div className="category-stat-card">
            <div className="category-stat-icon green">
              <CheckCircle2 size={19} />
            </div>

            <span>ACTIVE</span>

            <strong>
              {activeCategories}
            </strong>

            <small>
              Available for use
            </small>
          </div>

          <div className="category-stat-card">
            <div className="category-stat-icon pink">
              <XCircle size={19} />
            </div>

            <span>INACTIVE</span>

            <strong>
              {inactiveCategories}
            </strong>

            <small>
              Temporarily disabled
            </small>
          </div>

          <div className="category-stat-card">
            <div className="category-stat-icon blue">
              <CalendarDays size={19} />
            </div>

            <span>EVENTS</span>

            <strong>
              {totalEvents}
            </strong>

            <small>
              Across all categories
            </small>
          </div>

        </section>

        {/* MANAGEMENT PANEL */}

        <section className="categories-panel">

          <div className="categories-panel-heading">
            <div>
              <span>
                CATEGORY LIBRARY
              </span>

              <h2>
                Manage Categories
              </h2>
            </div>

            <button
              type="button"
              className="categories-refresh-button"
              onClick={fetchCategories}
              title="Refresh categories"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {/* FILTER BAR */}

          <div className="categories-filter-bar">

            <div className="categories-search">
              <Search size={17} />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search category..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="categories-status-filter"
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

          </div>

          {/* TABLE / EMPTY STATE */}

          {filteredCategories.length === 0 ? (

            <div className="categories-empty">

              <div className="categories-empty-icon">
                <FolderTree size={26} />
              </div>

              <h3>
                No categories found
              </h3>

              <p>
                {categories.length === 0
                  ? "Create your first event category to get started."
                  : "Try changing your search or status filter."
                }
              </p>

              {categories.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="categories-empty-button"
                >
                  <Plus size={16} />
                  Create Category
                </button>
              )}

            </div>

          ) : (

            <div className="categories-table-wrapper">

              <table className="categories-table">

                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>DESCRIPTION</th>
                    <th>EVENTS</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredCategories.map(
                    (category) => (

                      <tr key={category.id}>

                        <td>
                          <div className="category-name-cell">

                            <div className="category-icon-box">
                              {category.icon || "📁"}
                            </div>

                            <div>
                              <strong>
                                {category.name}
                              </strong>

                              <small>
                                ID #{category.id}
                              </small>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="category-description">
                            {category.description ||
                              "No description added."
                            }
                          </span>
                        </td>

                        <td>
                          <div className="category-event-count">
                            <CalendarDays size={15} />

                            {Number(
                              category.event_count || 0
                            )}
                          </div>
                        </td>

                        <td>

                          <button
                            type="button"
                            className={`category-status ${
                              category.is_active
                                ? "active"
                                : "inactive"
                            }`}
                            onClick={() =>
                              toggleStatus(category)
                            }
                            title={
                              category.is_active
                                ? "Deactivate"
                                : "Activate"
                            }
                          >

                            {category.is_active ? (
                              <>
                                <CheckCircle2 size={14} />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle size={14} />
                                Inactive
                              </>
                            )}

                          </button>

                        </td>

                        <td>

                          <div className="category-actions">

                            <button
                              type="button"
                              className="category-action edit"
                              onClick={() =>
                                openEditModal(category)
                              }
                              title="Edit category"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              className="category-action power"
                              onClick={() =>
                                toggleStatus(category)
                              }
                              title={
                                category.is_active
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              <Power size={15} />
                            </button>

                            <button
                              type="button"
                              className="category-action delete"
                              onClick={() =>
                                setDeleteTarget(category)
                              }
                              title="Delete category"
                            >
                              <Trash2 size={15} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (

        <div
          className="category-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="category-modal">

            <div className="category-modal-header">

              <div>

                <span>
                  {editingCategory
                    ? "EDIT CATEGORY"
                    : "NEW CATEGORY"
                  }
                </span>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Create Category"
                  }
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="category-form"
            >

              <div className="category-form-group">

                <label>
                  Category Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Technical"
                  maxLength={100}
                  required
                  autoFocus
                />

              </div>

              <div className="category-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe what type of events belong to this category..."
                  rows={4}
                />

              </div>

              <div className="category-form-row">

                <div className="category-form-group">

                  <label>
                    Icon
                  </label>

                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="💻"
                    maxLength={50}
                  />

                  <small>
                    You can use an emoji for now.
                  </small>

                </div>

                <div className="category-form-group">

                  <label>
                    Status
                  </label>

                  <label className="category-switch">

                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                    />

                    <span></span>

                    <strong>
                      {form.is_active
                        ? "Active"
                        : "Inactive"
                      }
                    </strong>

                  </label>

                </div>

              </div>

              <div className="category-modal-actions">

                <button
                  type="button"
                  className="category-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="category-save-button"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="category-button-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />

                      {editingCategory
                        ? "Save Changes"
                        : "Create Category"
                      }
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      {deleteTarget && (

        <div className="category-modal-overlay">

          <div className="category-delete-modal">

            <div className="category-delete-icon">
              <Trash2 size={23} />
            </div>

            <h2>
              Delete Category?
            </h2>

            <p>
              Are you sure you want to delete
              <strong>
                {" "}
                {deleteTarget.name}
              </strong>
              ?
            </p>

            {Number(
              deleteTarget.event_count || 0
            ) > 0 && (

              <div className="category-delete-warning">

                <AlertCircle size={16} />

                <span>
                  This category is currently
                  used by{" "}
                  <strong>
                    {deleteTarget.event_count}
                  </strong>{" "}
                  event(s). It cannot be
                  deleted until those events
                  are moved to another category.
                </span>

              </div>

            )}

            <div className="category-modal-actions">

              <button
                type="button"
                className="category-cancel-button"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="category-delete-confirm"
                onClick={handleDelete}
                disabled={
                  Number(
                    deleteTarget.event_count || 0
                  ) > 0
                }
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Categories;