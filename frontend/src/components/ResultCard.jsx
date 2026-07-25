import React from 'react';

export default function ResultCard({ report }) {
  if (!report) return null;

  return (
    <div className="result-card">
      <h2>Audit Report</h2>
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="label">HTTP Status:</span>
          <span className={`value status-${report.status}`}>{report.status}</span>
        </div>
        
        <div className="metric-item">
          <span className="label">Response Time:</span>
          <span className="value">{report.responseTimeMs} ms</span>
        </div>

        <div className="metric-item">
          <span className="label">Title:</span>
          <span className="value">{report.title}</span>
        </div>

        <div className="metric-item">
          <span className="label">Meta Description:</span>
          <span className="value description">{report.metaDescription}</span>
        </div>

        <div className="metric-item">
          <span className="label">H1 Header Count:</span>
          <span className="value">{report.h1Count}</span>
        </div>

        <div className="metric-item">
          <span className="label">Images Missing ALT:</span>
          <span className={`value ${report.imagesMissingAlt > 0 ? 'warning' : 'ok'}`}>
            {report.imagesMissingAlt}
          </span>
        </div>

        <div className="metric-item">
          <span className="label">Approx Word Count:</span>
          <span className="value">{report.wordCount} words</span>
        </div>
      </div>
    </div>
  );
}