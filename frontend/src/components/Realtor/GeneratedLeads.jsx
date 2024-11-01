import React, { useState, useEffect } from 'react';
import '../../styles/Realtor/GeneratedLeads.css';

const GeneratedLeads = () => {
  const [LeadData, setData] = useState({
    LeadName: "",
    Contact: "",
    Email: "",
    AskingPrice: "",
  });

  const getDataFromZap = async () => {
    try {
      const response = await fetch("http://localhost:5000/getSellerData");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();

      // Update LeadData with the fetched data
      setData({
        LeadName: data.LeadName || "",
        Contact: data.Contact || "",
        Email: data.LeadEmail || "",
        AskingPrice: data.AskingPrice || "",

      });

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getDataFromZap(); // Fetch data immediately on mount
    const intervalId = setInterval(getDataFromZap, 5000); // Poll every 5 seconds to check if any high priority lead was generated 

    return () => clearInterval(intervalId);
  }, []);

  const userName = 'Jaydeep'; // Dynamic user name placeholder

  return (
    <section className="generated-leads">
      <h1 className="leads-title">Hey {userName}, your potential leads at a glance</h1>

      <div className="leads-container">
        {/* Show Lead Data */}
        <div className="lead-card">
          <div className="lead-info">
            <h2>Seller Lead</h2>
            <div className="lead-info-section">
              <p><strong>Full Name:</strong> {LeadData.LeadName}</p>
              <p><strong>Contact Number:</strong> {LeadData.Contact}</p>
              <p><strong>Email:</strong> {LeadData.Email}</p>
              <p><strong>Price:</strong> $ {LeadData.AskingPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratedLeads;
