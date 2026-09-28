import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CertificateCustomization = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [participants, setParticipants] = useState([]);

  const [formData, setFormData] = useState({
    institute_name: "",
    department_name: "",
    institute_logo: null,

    head_name: "",
    head_designation: "Head of Department",
    head_signature: null,

    coordinator_name: "",
    coordinator_designation: "Event Coordinator",
    coordinator_signature: null,

    event_title: "",
    event_type: "",
    event_date: "",
    event_time: "",
    event_venue: "",

    sponsor_name: "",
    sponsor_logo: null,
  });

  const [previewData, setPreviewData] = useState({
    instituteLogo: null,
    headSignature: null,
    coordinatorSignature: null,
    sponsorLogo: null,
  });

  // =========================================================
  // GET AUTH TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  // =========================================================
  // LOAD CERTIFICATE INFORMATION
  // =========================================================

  useEffect(() => {
    loadCertificateInformation();
  }, [eventId]);

  const loadCertificateInformation = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("User token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `/api/certificates/events/${eventId}/configuration/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = response.data || {};

      console.log("Certificate configuration:", data);

      setFormData({
        institute_name: data.institute_name || "",
        department_name: data.department_name || "",
        institute_logo: null,

        head_name: data.head_name || "",
        head_designation:
          data.head_designation || "Head of Department",
        head_signature: null,

        coordinator_name: data.coordinator_name || "",
        coordinator_designation:
          data.coordinator_designation || "Event Coordinator",
        coordinator_signature: null,

        event_title: data.event_title || "",
        event_type: data.event_type || "",
        event_date: data.event_date || "",
        event_time: data.event_time || "",
        event_venue: data.event_venue || "",

        sponsor_name: data.sponsor_name || "",
        sponsor_logo: null,
      });

      setPreviewData({
        instituteLogo: data.institute_logo || null,
        headSignature: data.head_signature || null,
        coordinatorSignature:
          data.coordinator_signature || null,
        sponsorLogo: data.sponsor_logo || null,
      });

      let participantList = [];

      if (Array.isArray(data.participants)) {
        participantList = data.participants;
      } else if (
        Array.isArray(data.participants?.results)
      ) {
        participantList = data.participants.results;
      } else if (
        Array.isArray(data.participants?.data)
      ) {
        participantList = data.participants.data;
      }

      setParticipants(participantList);

      console.log(
        "Certificate participants:",
        participantList
      );
    } catch (err) {
      console.error("LOAD ERROR:", err);
      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        getServerError(
          err,
          "Unable to load certificate information."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
    setSuccess("");
    setError("");
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (!files || !files[0]) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: files[0],
    }));

    setSaved(false);
    setSuccess("");
    setError("");
  };

  // =========================================================
  // SAVE CERTIFICATE INFORMATION
  // =========================================================

  const saveInformation = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.institute_name.trim()) {
        setError("Please enter the institute name.");
        setSaving(false);
        return;
      }

      const token = getToken();

      if (!token) {
        setError("User token not found. Please login again.");
        setSaving(false);
        return;
      }

      const data = new FormData();

      const fieldsToSend = [
        "institute_name",
        "department_name",
        "head_name",
        "head_designation",
        "coordinator_name",
        "coordinator_designation",
        "event_title",
        "event_type",
        "event_date",
        "event_venue",
        "sponsor_name",
      ];

      fieldsToSend.forEach((field) => {
        const value = formData[field];

        if (
          value !== null &&
          value !== undefined
        ) {
          data.append(field, value);
        }
      });

      if (formData.institute_logo) {
        data.append(
          "institute_logo",
          formData.institute_logo
        );
      }

      if (formData.head_signature) {
        data.append(
          "head_signature",
          formData.head_signature
        );
      }

      if (formData.coordinator_signature) {
        data.append(
          "coordinator_signature",
          formData.coordinator_signature
        );
      }

      if (formData.sponsor_logo) {
        data.append(
          "sponsor_logo",
          formData.sponsor_logo
        );
      }

      const response = await axios.patch(
        `/api/certificates/events/${eventId}/configuration/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const updated = response.data || {};

      console.log(
        "Certificate saved:",
        updated
      );

      setPreviewData((previous) => ({
        instituteLogo:
          updated.institute_logo ||
          previous.instituteLogo,

        headSignature:
          updated.head_signature ||
          previous.headSignature,

        coordinatorSignature:
          updated.coordinator_signature ||
          previous.coordinatorSignature,

        sponsorLogo:
          updated.sponsor_logo ||
          previous.sponsorLogo,
      }));

      setSaved(true);

      setSuccess(
        "Certificate information saved successfully."
      );

      setTimeout(() => {
        document
          .getElementById("certificate-preview")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 200);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        getServerError(
          err,
          "Unable to save certificate information."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // GENERATE CERTIFICATES
  // =========================================================

  const generateCertificates = async () => {
    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        setError("User token not found. Please login again.");
        setGenerating(false);
        return;
      }

      const response = await axios.post(
        `/api/certificates/events/${eventId}/generate/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log(
        "Generation response:",
        response.data
      );

      setSuccess(
        response.data?.message ||
          "Certificates generated successfully."
      );

      setTimeout(() => {
        navigate("/organizer/dashboard");
      }, 1800);
    } catch (err) {
      console.error(
        "GENERATION ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        getServerError(
          err,
          "Unable to generate certificates."
        )
      );
    } finally {
      setGenerating(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="certificate-page loading-page">
          <div className="loading-box">
            Loading certificate information...
          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // PREVIEW STUDENT
  // =========================================================

  const previewStudent =
    participants.length > 0
      ? participants[0]
      : null;

  const previewStudentName =
    previewStudent?.name ||
    previewStudent?.student_name ||
    "[Student Name]";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      <style>{styles}</style>

      <div className="certificate-page">
        <div className="certificate-container">

          {/* PAGE HEADER */}

          <div className="page-header">

            <button
              className="back-button"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <h1>
              Certificate Information
            </h1>

            <p>
              Complete the certificate information before
              generating certificates for the event.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="message error-message">
              <strong>Error:</strong>
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="message success-message">
              {success}
            </div>
          )}

          {/* =================================================
              INSTITUTE DETAILS
          ================================================= */}

          <section className="form-card">

            <div className="section-heading">

              <div className="section-number">
                1
              </div>

              <div>
                <h2>
                  Institute Details
                </h2>

                <p>
                  Enter the official institute information
                  shown on the certificate.
                </p>
              </div>

            </div>

            <div className="form-grid">

              <InputField
                label="Institute Name"
                name="institute_name"
                value={formData.institute_name}
                onChange={handleChange}
                placeholder="Enter institute / college name"
                required
              />

              <InputField
                label="Department Name"
                name="department_name"
                value={formData.department_name}
                onChange={handleChange}
                placeholder="Enter department name"
              />

              <FileField
                label="Institute Logo"
                name="institute_logo"
                onChange={handleFileChange}
                accept="image/*"
              />

              <InputField
                label="Head / Principal Name"
                name="head_name"
                value={formData.head_name}
                onChange={handleChange}
                placeholder="Enter name"
              />

              <InputField
                label="Head Designation"
                name="head_designation"
                value={formData.head_designation}
                onChange={handleChange}
                placeholder="Head of Department"
              />

              <FileField
                label="Head Signature"
                name="head_signature"
                onChange={handleFileChange}
                accept="image/*"
              />

              <InputField
                label="Coordinator Name"
                name="coordinator_name"
                value={formData.coordinator_name}
                onChange={handleChange}
                placeholder="Enter coordinator name"
              />

              <InputField
                label="Coordinator Designation"
                name="coordinator_designation"
                value={formData.coordinator_designation}
                onChange={handleChange}
                placeholder="Event Coordinator"
              />

              <FileField
                label="Coordinator Signature"
                name="coordinator_signature"
                onChange={handleFileChange}
                accept="image/*"
              />

              <InputField
                label="Sponsor Name"
                name="sponsor_name"
                value={formData.sponsor_name}
                onChange={handleChange}
                placeholder="Optional"
              />

              <FileField
                label="Sponsor Logo"
                name="sponsor_logo"
                onChange={handleFileChange}
                accept="image/*"
              />

            </div>

          </section>

          {/* =================================================
              EVENT DETAILS
          ================================================= */}

          <section className="form-card">

            <div className="section-heading">

              <div className="section-number">
                2
              </div>

              <div>
                <h2>
                  Event Details
                </h2>

                <p>
                  These details are automatically fetched
                  from the selected event.
                </p>
              </div>

            </div>

            <div className="form-grid">

              <InputField
                label="Event Name"
                name="event_title"
                value={formData.event_title}
                onChange={handleChange}
              />

              <InputField
                label="Event Type"
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
              />

              <InputField
                label="Event Date"
                name="event_date"
                type="date"
                value={formData.event_date}
                onChange={handleChange}
              />

              <InputField
                label="Event Time"
                name="event_time"
                value={formData.event_time}
                readOnly
              />

              <InputField
                label="Event Venue"
                name="event_venue"
                value={formData.event_venue}
                onChange={handleChange}
              />

            </div>

            <div className="automatic-note">

              <span>ⓘ</span>

              Event name, type, date, time and venue are
              fetched from the EventHub event. Event time is
              read-only because it belongs to the original
              event.

            </div>

          </section>

          {/* =================================================
              PARTICIPANTS
          ================================================= */}

          <section className="form-card">

            <div className="section-heading">

              <div className="section-number">
                3
              </div>

              <div>
                <h2>
                  Confirmed Participants
                </h2>

                <p>
                  Students are automatically obtained from
                  event registrations.
                </p>
              </div>

            </div>

            <div className="participant-summary">

              <div>

                <span className="summary-number">
                  {participants.length}
                </span>

                <span className="summary-label">
                  Confirmed Participant
                  {participants.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>

            </div>

            {participants.length === 0 ? (

              <div className="empty-participants">

                <div className="empty-icon">
                  !
                </div>

                <div>

                  <strong>
                    No participants found
                  </strong>

                  <p>
                    No confirmed student registration was
                    returned for this event.
                  </p>

                </div>

              </div>

            ) : (

              <div className="table-wrapper">

                <table className="participant-table">

                  <thead>

                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Department</th>
                    </tr>

                  </thead>

                  <tbody>

                    {participants.map(
                      (student, index) => (

                        <tr
                          key={
                            student.id ||
                            student.student_id ||
                            index
                          }
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td className="student-name">
                            {student.name ||
                              student.student_name ||
                              "—"}
                          </td>

                          <td>
                            {student.student_id ||
                              student.enrollment_number ||
                              student.roll_number ||
                              "—"}
                          </td>

                          <td>
                            {student.department ||
                              student.course ||
                              "—"}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          {!saved && (

            <div className="action-area">

              <button
                className="primary-button"
                onClick={saveInformation}
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Certificate Information"}

              </button>

            </div>

          )}

          {/* =================================================
              PREVIEW
          ================================================= */}

          {saved && (

            <section
              id="certificate-preview"
              className="preview-card"
            >

              <div className="section-heading">

                <div className="section-number">
                  4
                </div>

                <div>

                  <h2>
                    Certificate Preview
                  </h2>

                  <p>
                    Review the certificate before generating
                    the final PDF certificates.
                  </p>

                </div>

              </div>

              <div className="preview-info">

                Preview is shown using the first confirmed
                participant. The final certificates will use
                each student's own information.

              </div>

              <div className="preview-wrapper">

                <div
                  className="certificate-preview"
                  style={{
                    backgroundImage:
                      "url('/certificate_template.png')",
                  }}
                >

                  {/* INSTITUTE */}

                  <div className="preview-institute">

                    <h2>
                      {formData.institute_name ||
                        "Institute Name"}
                    </h2>

                    {formData.department_name && (
                      <p>
                        {formData.department_name}
                      </p>
                    )}

                  </div>

                  {/* LOGO */}

                  {previewData.instituteLogo && (
                    <img
                      src={previewData.instituteLogo}
                      alt="Institute Logo"
                      className="preview-logo"
                    />
                  )}

                  {/* HEADING */}

                  <div className="preview-heading">

                    <h1>
                      CERTIFICATE
                    </h1>

                    <p>
                      OF PARTICIPATION
                    </p>

                  </div>

                  {/* STUDENT */}

                  <div className="preview-student">

                    <p>
                      THIS CERTIFICATE IS PROUDLY
                      PRESENTED TO
                    </p>

                    <h2>
                      {previewStudentName}
                    </h2>

                    <p>
                      for actively participating in
                    </p>

                    <h3>
                      {formData.event_title ||
                        "Event Name"}
                    </h3>

                  </div>

                  {/* EVENT */}

                  <div className="preview-event">

                    <p>
                      {formatDate(
                        formData.event_date
                      )}

                      {formData.event_time &&
                        ` • ${formatTime(
                          formData.event_time
                        )}`}
                    </p>

                    <p>
                      {formData.event_venue}
                    </p>

                  </div>

                  {/* SIGNATURES */}

                  <div className="preview-signatures">

                    <div className="signature-box">

                      {previewData.coordinatorSignature && (
                        <img
                          src={
                            previewData.coordinatorSignature
                          }
                          alt="Coordinator Signature"
                        />
                      )}

                      <div className="signature-line" />

                      <strong>
                        {formData.coordinator_name ||
                          "Coordinator"}
                      </strong>

                      <span>
                        {formData.coordinator_designation}
                      </span>

                    </div>

                    <div className="signature-box">

                      {previewData.headSignature && (
                        <img
                          src={
                            previewData.headSignature
                          }
                          alt="Head Signature"
                        />
                      )}

                      <div className="signature-line" />

                      <strong>
                        {formData.head_name ||
                          "Head"}
                      </strong>

                      <span>
                        {formData.head_designation}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* FINAL ACTION */}

              <div className="confirm-area">

                <button
                  className="edit-button"
                  onClick={() => {
                    setSaved(false);
                    setSuccess("");
                  }}
                >
                  ← Edit Information
                </button>

                <button
                  className="generate-button"
                  onClick={generateCertificates}
                  disabled={
                    generating ||
                    participants.length === 0
                  }
                >

                  {generating
                    ? "Generating Certificates..."
                    : "Confirm & Generate Certificates"}

                </button>

              </div>

              {participants.length === 0 && (
                <div className="generation-warning">

                  Certificates cannot be generated because
                  no confirmed participants were found.

                </div>
              )}

            </section>

          )}

        </div>
      </div>
    </>
  );
};

// =========================================================
// SERVER ERROR HELPER
// =========================================================

const getServerError = (
  error,
  fallback
) => {
  const data = error?.response?.data;

  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  const messages = [];

  Object.keys(data).forEach((field) => {
    const value = data[field];

    if (Array.isArray(value)) {
      messages.push(
        `${field}: ${value.join(", ")}`
      );
    } else if (
      typeof value === "string"
    ) {
      messages.push(
        `${field}: ${value}`
      );
    }
  });

  if (messages.length > 0) {
    return messages.join(" | ");
  }

  return fallback;
};

// =========================================================
// DATE FORMAT
// =========================================================

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  try {
    const date = new Date(
      `${value}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  } catch {
    return value;
  }
};

// =========================================================
// TIME FORMAT
// =========================================================

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  try {
    const parts = value.split(":");

    if (parts.length < 2) {
      return value;
    }

    let hours = parseInt(
      parts[0],
      10
    );

    const minutes = parts[1];

    const period =
      hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  } catch {
    return value;
  }
};

// =========================================================
// INPUT COMPONENT
// =========================================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  readOnly = false,
  required = false,
}) => {
  return (
    <div className="form-field">

      <label>

        {label}

        {required && (
          <span className="required">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={
          readOnly
            ? "readonly-input"
            : ""
        }
      />

    </div>
  );
};

// =========================================================
// FILE COMPONENT
// =========================================================

const FileField = ({
  label,
  name,
  onChange,
  accept,
}) => {
  return (
    <div className="form-field">

      <label>
        {label}
      </label>

      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
      />

    </div>
  );
};

// =========================================================
// CSS
// =========================================================

const styles = `

  * {
    box-sizing: border-box;
  }

  .certificate-page {
    min-height: 100vh;
    background: #f4f6f9;
    padding: 32px 20px 60px;
    color: #1f2937;
  }

  .certificate-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }

  .loading-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading-box {
    background: white;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    color: #334155;
  }

  .page-header {
    margin-bottom: 25px;
  }

  .page-header h1 {
    margin: 12px 0 8px;
    font-size: 30px;
    color: #172554;
  }

  .page-header p {
    margin: 0;
    color: #64748b;
    font-size: 15px;
  }

  .back-button {
    border: none;
    background: transparent;
    color: #2563eb;
    cursor: pointer;
    font-size: 15px;
    padding: 0;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  .message {
    display: flex;
    gap: 8px;
    padding: 14px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
  }

  .error-message {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .success-message {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .form-card,
  .preview-card {
    background: white;
    border-radius: 12px;
    padding: 26px;
    margin-bottom: 24px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.07);
  }

  .section-heading {
    display: flex;
    gap: 13px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .section-number {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #172554;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }

  .section-heading h2 {
    margin: 2px 0 6px;
    color: #172554;
    font-size: 21px;
  }

  .section-heading p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
  }

  .form-field label {
    margin-bottom: 7px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  .required {
    color: #dc2626;
    margin-left: 4px;
  }

  .form-field input {
    width: 100%;
    min-height: 42px;
    border: 1px solid #d1d5db;
    border-radius: 7px;
    padding: 9px 12px;
    font-size: 14px;
    background: white;
    color: #1f2937;
    outline: none;
  }

  .form-field input:focus {
    border-color: #2563eb;
    box-shadow:
      0 0 0 2px
      rgba(37,99,235,0.12);
  }

  .form-field input[type="file"] {
    padding: 8px;
  }

  .form-field .readonly-input {
    background: #f1f5f9;
    color: #475569;
    cursor: not-allowed;
  }

  .automatic-note {
    margin-top: 20px;
    padding: 12px 14px;
    background: #eff6ff;
    color: #1e40af;
    border-radius: 7px;
    font-size: 13px;
    line-height: 1.5;
  }

  .automatic-note span {
    margin-right: 7px;
  }

  .participant-summary {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 18px;
    margin-bottom: 16px;
  }

  .summary-number {
    font-size: 24px;
    font-weight: 700;
    color: #172554;
    margin-right: 8px;
  }

  .summary-label {
    color: #64748b;
    font-size: 14px;
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
  }

  .participant-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .participant-table th,
  .participant-table td {
    padding: 12px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  .participant-table th {
    background: #f8fafc;
    color: #334155;
    font-weight: 600;
  }

  .participant-table tbody tr:hover {
    background: #f8fafc;
  }

  .student-name {
    font-weight: 600;
    color: #172554;
  }

  .empty-participants {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px;
    background: #fffbeb;
    color: #92400e;
    border: 1px solid #fde68a;
    border-radius: 8px;
  }

  .empty-participants p {
    margin: 4px 0 0;
    font-size: 13px;
  }

  .empty-icon {
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #f59e0b;
    color: white;
    font-weight: 700;
  }

  .action-area {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 25px;
  }

  .primary-button,
  .generate-button,
  .edit-button {
    border: none;
    border-radius: 7px;
    padding: 12px 22px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .primary-button {
    background: #172554;
    color: white;
  }

  .primary-button:hover {
    background: #1e3a8a;
  }

  .generate-button {
    background: #15803d;
    color: white;
  }

  .generate-button:hover {
    background: #166534;
  }

  .edit-button {
    background: #e2e8f0;
    color: #334155;
  }

  .edit-button:hover {
    background: #cbd5e1;
  }

  .primary-button:disabled,
  .generate-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .preview-info {
    margin-bottom: 20px;
    padding: 12px 14px;
    background: #f8fafc;
    border-left: 4px solid #d4af37;
    color: #475569;
    font-size: 13px;
    line-height: 1.5;
  }

  .preview-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0 25px;
  }

  .certificate-preview {
    position: relative;
    width: 100%;
    max-width: 950px;
    aspect-ratio: 1.414 / 1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    border: 1px solid #d4af37;
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  }

  .preview-institute {
    position: absolute;
    top: 13%;
    left: 15%;
    width: 70%;
    text-align: center;
  }

  .preview-institute h2 {
    margin: 0;
    font-size: clamp(15px, 2.3vw, 27px);
    color: #1e293b;
  }

  .preview-institute p {
    margin: 4px 0 0;
    font-size: clamp(9px, 1.2vw, 15px);
    color: #475569;
  }

  .preview-logo {
    position: absolute;
    top: 5%;
    left: 7%;
    width: 10%;
    height: 12%;
    object-fit: contain;
  }

  .preview-heading {
    position: absolute;
    top: 27%;
    left: 15%;
    width: 70%;
    text-align: center;
  }

  .preview-heading h1 {
    margin: 0;
    font-family: Georgia, serif;
    font-size: clamp(20px, 3.4vw, 42px);
    letter-spacing: 2px;
    color: #1e293b;
  }

  .preview-heading p {
    margin: 5px 0 0;
    font-family: Georgia, serif;
    font-size: clamp(10px, 1.7vw, 21px);
    letter-spacing: 3px;
    color: #475569;
  }

  .preview-student {
    position: absolute;
    top: 45%;
    left: 15%;
    width: 70%;
    text-align: center;
  }

  .preview-student p {
    margin: 4px 0;
    font-size: clamp(8px, 1.15vw, 14px);
    color: #475569;
  }

  .preview-student h2 {
    margin: 8px 0;
    font-family: Georgia, serif;
    font-size: clamp(17px, 2.5vw, 30px);
    color: #111827;
  }

  .preview-student h3 {
    margin: 6px 0;
    font-family: Georgia, serif;
    font-size: clamp(13px, 1.8vw, 22px);
    color: #1e293b;
  }

  .preview-event {
    position: absolute;
    bottom: 23%;
    left: 15%;
    width: 70%;
    text-align: center;
  }

  .preview-event p {
    margin: 3px 0;
    font-size: clamp(8px, 1.1vw, 13px);
    color: #475569;
  }

  .preview-signatures {
    position: absolute;
    bottom: 7%;
    left: 12%;
    width: 76%;
    display: flex;
    justify-content: space-between;
    text-align: center;
  }

  .signature-box {
    width: 150px;
    min-height: 55px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .signature-box img {
    width: 100px;
    height: 38px;
    object-fit: contain;
  }

  .signature-line {
    width: 100%;
    border-top: 1px solid #374151;
    margin-top: 4px;
  }

  .signature-box strong {
    margin-top: 4px;
    font-size: clamp(7px, 1vw, 12px);
  }

  .signature-box span {
    font-size: clamp(6px, 0.9vw, 11px);
  }

  .confirm-area {
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }

  .generation-warning {
    margin-top: 15px;
    padding: 12px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 7px;
    font-size: 13px;
  }

  @media (max-width: 700px) {

    .certificate-page {
      padding: 20px 12px 40px;
    }

    .form-card,
    .preview-card {
      padding: 18px;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .confirm-area {
      flex-direction: column;
      align-items: stretch;
    }

    .generate-button,
    .edit-button {
      width: 100%;
    }

    .action-area {
      justify-content: stretch;
    }

    .primary-button {
      width: 100%;
    }

  }

`;

export default CertificateCustomization;