import React, { useState } from 'react';
import AuditForm from './components/AuditForm';
import ResultCard from './components/ResultCard';
import { auditUrl } from './services/api';
import './App.css';

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAudit = async (url) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const data = await auditUrl(url);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🚀 Page Pulse</h1>
        <p>Website SEO & Performance Audit Tool</p>
      </header>

      <main className="main-content">
        <AuditForm onSubmit={handleAudit} loading={loading} />

        {error && <div className="error-banner">{error}</div>}
        {report && <ResultCard report={report} />}
      </main>

      {/* MANDATORY SUBMISSION FOOTER REQUIREMENT */}
      <footer className="footer">
        <p>
          Built for{' '}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Digital Heroes Training Task
          </a>
        </p>
      </footer>
    </div>
  );
}