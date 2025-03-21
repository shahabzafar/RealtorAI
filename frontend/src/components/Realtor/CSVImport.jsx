import React, { useState } from 'react';
import Papa from 'papaparse';
import '../../styles/Realtor/CSVImport.css';

const CSVImport = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [sampleData, setSampleData] = useState([]);

  // The user selects which CSV column corresponds to each required field
  const [mapping, setMapping] = useState({
    firstName: "firstName",
    lastName: "lastName",
    phone: "phone",
    email: "email",
    clientType: "clientType",
    budget: "budget",
    location: "location",
    amenities: "amenities"
  });

  // Set the backend URL from environment variable or default value
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setCsvFile(e.target.files[0]);
      parseCsvHeaders(e.target.files[0]);
    }
  };

  // Parse only the first 10 lines to get headers
  const parseCsvHeaders = (file) => {
    Papa.parse(file, {
      header: true,
      preview: 10, // read up to 10 lines for headers
      complete: (results) => {
        if (results.data && results.data.length) {
          setHeaders(results.meta.fields || []);
          setSampleData(results.data.slice(0, 5)); // show first 5 lines as sample
        }
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
      }
    });
  };

  const handleMappingChange = (field, csvHeader) => {
    setMapping((prev) => ({ ...prev, [field]: csvHeader }));
  };

  const handleUpload = async () => {
    if (!csvFile) {
      alert('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('mapping', JSON.stringify(mapping));

    try {
      const res = await fetch(`${backendUrl}/api/clients/import-csv`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('CSV import failed');
      }

      // Attempt to parse JSON; handle empty body
      const text = await res.text();
      if (!text) {
        alert('CSV import completed (no JSON body). Possibly 0 rows imported?');
        return;
      }

      // parse JSON
      const data = JSON.parse(text);
      alert(`CSV import completed successfully. Imported ${data.count} rows.`);
    } catch (error) {
      console.error(error);
      alert('Error importing CSV');
    }
  };

  return (
    <div className="csv-import-container">
      <div className="csv-upload-section">
        <div className="file-upload-container">
          <label htmlFor="csv-file-input" className="file-upload-label">
            <div className="upload-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 12L17 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span>Choose File</span>
          </label>
          <input 
            id="csv-file-input" 
            type="file" 
            accept=".csv,text/csv" 
            onChange={handleFileChange} 
            className="file-input"
          />
          {csvFile && <div className="selected-file">Selected: {csvFile.name}</div>}
        </div>
      </div>

      {headers.length > 0 && (
        <div className="csv-mapping-container">
          <div className="section-heading">
            <h3>Map CSV Columns</h3>
            <p>Choose which CSV column matches each client field</p>
          </div>
          
          <div className="mapping-grid">
            {Object.keys(mapping).map((field) => (
              <div key={field} className="mapping-field">
                <label>{field}:</label>
                <select 
                  value={mapping[field]} 
                  onChange={(e) => handleMappingChange(field, e.target.value)}
                  className="mapping-select"
                >
                  <option value="">Ignore</option>
                  {headers.map((hdr) => (
                    <option key={hdr} value={hdr}>
                      {hdr}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          <div className="import-button-container">
            <button className="import-button" onClick={handleUpload}>
              Import Clients
            </button>
          </div>

          <div className="sample-data-container">
            <h4>Sample Data Preview</h4>
            <div className="table-container">
              <table className="sample-table">
                <thead>
                  <tr>
                    {headers.map((hdr) => (
                      <th key={hdr}>{hdr}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, idx) => (
                    <tr key={idx}>
                      {headers.map((hdr) => (
                        <td key={`${idx}-${hdr}`}>{row[hdr]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImport;
