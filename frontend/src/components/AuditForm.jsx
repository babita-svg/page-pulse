import React, { useState } from 'react';

export default function AuditForm({ onSubmit, loading }) {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onSubmit(inputUrl.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="audit-form">
      <div className="input-group">
        <input
          type="text"
          placeholder="https://example.com"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Auditing...' : 'Audit Website'}
        </button>
      </div>
    </form>
  );
}