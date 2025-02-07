import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVImport = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [sampleData, setSampleData] = useState([]);

  // The user selects which CSV column corresponds to each required field
  const [mapping, setMapping] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    clientType: '',
    budget: '',
    location: '',
    amenities: ''
  });

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setCsvFile(e.target.files[0]);
      parseCsvHeaders(e.target.files[0]);
    }
  };

  // We parse only the first row with Papa for headers
  const parseCsvHeaders = (file) => {
    Papa.parse(file, {
      header: true,
      preview: 10, // get up to 10 lines
      complete: (results) => {
        if (results.data && results.data.length) {
          // Extract headers from results.meta.fields
          setHeaders(results.meta.fields || []);
          // store sample data to show user
          setSampleData(results.data.slice(0, 5)); // first 5 lines
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
      const res = await fetch('/api/clients/import-csv', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('CSV import failed');
      }
      const data = await res.json();
      alert(`CSV import completed successfully. Imported ${data.count} rows.`);
    } catch (error) {
      console.error(error);
      alert('Error importing CSV');
    }
  };

  return (
    <div style={{ background: '#eee', padding: '1rem', borderRadius: '8px' }}>
      <h2>CSV Import</h2>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
      />
      {headers.length > 0 && (
        <>
          <h3>Map CSV Columns</h3>
          <p>Choose which CSV column matches each client field:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {Object.keys(mapping).map((field) => (
              <div key={field} style={{ minWidth: '200px' }}>
                <label>{field}:</label>
                <br />
                <select
                  value={mapping[field]}
                  onChange={(e) => handleMappingChange(field, e.target.value)}
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
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleUpload}>Import CSV</button>
          </div>

          <h4>Sample Data (first 5 rows)</h4>
          <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {headers.map((hdr) => (
                  <th key={hdr} style={{ border: '1px solid #ccc', padding: '4px' }}>
                    {hdr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => (
                <tr key={idx}>
                  {headers.map((hdr) => (
                    <td key={`${idx}-${hdr}`} style={{ border: '1px solid #ccc', padding: '4px' }}>
                      {row[hdr]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CSVImport;
