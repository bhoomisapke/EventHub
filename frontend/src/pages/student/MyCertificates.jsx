import React, { useEffect, useState } from "react";
import {
  Award, CalendarDays, MapPin, Hash, Download,
  Loader2, AlertCircle, FileCheck2, Eye, X,
} from "lucide-react";
import "./MyCertificates.css";

const API_URL = "http://127.0.0.1:8000";
const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState({});
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState("");
  const [viewerCertificate, setViewerCertificate] = useState(null);
  const [viewerLoading, setViewerLoading] = useState(false);

  useEffect(() => {
    fetchCertificates();
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
      if (viewerUrl) URL.revokeObjectURL(viewerUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      if (!token) throw new Error("Please login to view your certificates.");

      const response = await fetch(`${API_URL}/api/certificates/my/`, {
        headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to load certificates.");

      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setCertificates(list);
      await loadPreviews(list, token);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load your certificates.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreviews = async (list, token) => {
    const urls = {};
    await Promise.all(list.map(async (certificate) => {
      try {
        const response = await fetch(`${API_URL}/api/certificates/${certificate.id}/view/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!response.ok) return;
        const blob = await response.blob();
        urls[certificate.id] = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      } catch (err) {
        console.error(`Preview error for certificate ${certificate.id}`, err);
      }
    }));
    setPreviewUrls(urls);
  };

  const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const fetchPdf = async (certificate, action) => {
    const token = getToken();
    if (!token) throw new Error("Please login to access your certificate.");
    const url = `${API_URL}/api/certificates/${certificate.id}/${action}/`;
    const response = await fetch(url, { headers: { Authorization: `Token ${token}` } });
    if (!response.ok) throw new Error("Certificate PDF request failed.");
    const blob = await response.blob();
    return new Blob([blob], { type: "application/pdf" });
  };

  const handleView = async (certificate) => {
    try {
      setViewerLoading(true);
      if (viewerUrl) URL.revokeObjectURL(viewerUrl);
      const blob = await fetchPdf(certificate, "view");
      setViewerUrl(URL.createObjectURL(blob));
      setViewerCertificate(certificate);
      setViewerOpen(true);
    } catch (err) {
      console.error(err);
      setError("Unable to open the certificate.");
    } finally {
      setViewerLoading(false);
    }
  };

  const handleDownload = async (certificate) => {
    try {
      const blob = await fetchPdf(certificate, "download");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificate.certificate_number || "EventHub-Certificate"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      setError("Unable to download the certificate.");
    }
  };

  const closeViewer = () => {
    setViewerOpen(false);
    if (viewerUrl) URL.revokeObjectURL(viewerUrl);
    setViewerUrl("");
    setViewerCertificate(null);
  };

  return (
    <div className="my-certificates-page">
      <section className="certificates-header">
        <div className="certificates-heading">
          <div className="certificates-title-icon"><Award size={22} /></div>
          <div>
            <p className="certificates-eyebrow">ACHIEVEMENTS</p>
            <h1>My Certificates</h1>
            <p>View and download certificates earned from EventHub events.</p>
          </div>
        </div>
        <div className="certificate-count-box">
          <span>{certificates.length}</span>
          <small>{certificates.length === 1 ? "Certificate" : "Certificates"}</small>
        </div>
      </section>

      {loading && <div className="certificates-state"><Loader2 className="certificates-spinner" size={32} /><h3>Loading certificates...</h3><p>Please wait while we fetch your certificates.</p></div>}

      {!loading && error && <div className="certificates-state error-state"><div className="state-icon"><AlertCircle size={28} /></div><h3>Something went wrong</h3><p>{error}</p><button className="certificate-retry-button" onClick={fetchCertificates}>Try Again</button></div>}

      {!loading && !error && certificates.length === 0 && <div className="certificates-state empty-state"><div className="empty-certificate-icon"><Award size={34} /></div><h3>No certificates yet</h3><p>Your certificates will appear here after certificates are generated for your completed events.</p></div>}

      {!loading && !error && certificates.length > 0 && (
        <section className="certificates-grid">
          {certificates.map((certificate) => (
            <article className="certificate-card" key={certificate.id}>
              <div className="certificate-preview">
                <div className="certificate-preview-border">
                  {previewUrls[certificate.id] ? (
                    <iframe className="certificate-real-preview" src={previewUrls[certificate.id]} title={`Certificate for ${certificate.student_name}`} />
                  ) : (
                    <div className="certificate-preview-loading"><Loader2 size={28} className="certificates-spinner" /><span>Loading certificate preview...</span></div>
                  )}
                </div>
              </div>

              <div className="certificate-info">
                <div className="certificate-info-heading"><div><span className="certificate-status"><FileCheck2 size={13} />{certificate.status || "Issued"}</span><h3>{certificate.event_title}</h3></div></div>
                <div className="certificate-meta">
                  <div className="certificate-meta-item"><CalendarDays size={16} /><div><span>Event Date</span><strong>{formatDate(certificate.event_date)}</strong></div></div>
                  <div className="certificate-meta-item"><MapPin size={16} /><div><span>Venue</span><strong>{certificate.event_venue || "EventHub"}</strong></div></div>
                  <div className="certificate-meta-item"><Hash size={16} /><div><span>Certificate No.</span><strong>{certificate.certificate_number}</strong></div></div>
                </div>

                <div className="certificate-actions">
                  <button className="view-certificate-button" onClick={() => handleView(certificate)}>
                    {viewerLoading && viewerCertificate?.id === certificate.id ? <Loader2 size={17} className="certificates-spinner-small" /> : <Eye size={17} />}
                    <span>View Certificate</span>
                  </button>
                  <button className="download-certificate-button" onClick={() => handleDownload(certificate)}>
                    <Download size={17} /><span>Download Certificate</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {viewerOpen && (
        <div className="certificate-viewer-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeViewer(); }}>
          <div className="certificate-viewer-modal">
            <div className="certificate-viewer-header">
              <div><strong>Certificate Preview</strong><span>{viewerCertificate?.event_title || "EventHub Certificate"}</span></div>
              <button className="certificate-viewer-close" onClick={closeViewer} aria-label="Close certificate"><X size={21} /></button>
            </div>
            <div className="certificate-viewer-body">
              {viewerUrl ? <iframe title="EventHub Certificate" src={viewerUrl} className="certificate-viewer-frame" /> : <div className="certificate-viewer-loading"><Loader2 size={30} className="certificates-spinner" /><span>Opening certificate...</span></div>}
            </div>
            <div className="certificate-viewer-footer">
              <button className="download-certificate-button" onClick={() => viewerCertificate && handleDownload(viewerCertificate)}><Download size={17} />Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
