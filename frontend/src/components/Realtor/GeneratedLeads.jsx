import React, { useState, useEffect } from 'react';
import '../../styles/Realtor/GeneratedLeads.css';

const GeneratedLeads = () => {
  const [sellerLeadData, setSellerData] = useState({
    LeadName: "",
    Contact: "",
    Email: "",
    AskingPrice: "",
  });
  const [buyerLeadData, setBuyerData] = useState(null); // Placeholder for buyer leads

  const getDataFromZap = async () => {
    try {
      const response = await fetch("/getSellerData");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();

      setSellerData({
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
    getDataFromZap(); 
    const intervalId = setInterval(getDataFromZap, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const userName = 'Jaydeep';

  return (
    <section className="generated-leads">
      <h1 className="leads-header">Generated Leads</h1>
      <div className="leads-container">
        <div className="leads-section seller-leads">
          <h2>Seller Leads</h2>
          {sellerLeadData.LeadName ? (
            <div className="lead-card">
              <div className="lead-info">
                <p><strong>Full Name:</strong> {sellerLeadData.LeadName}</p>
                <p><strong>Contact Number:</strong> {sellerLeadData.Contact}</p>
                <p><strong>Email:</strong> {sellerLeadData.Email}</p>
                <p><strong>Selling Price:</strong> $ {sellerLeadData.AskingPrice}</p>
              </div>
            </div>
          ) : (
            <p>No seller leads available</p>
          )}
        </div>
        
        <div className="leads-section buyer-leads">
          <h2>Buyer Leads</h2>
          {buyerLeadData ? (
            <div className="lead-card">
              <div className="lead-info">
                <p><strong>Full Name:</strong> {buyerLeadData.LeadName}</p>
                <p><strong>Contact Number:</strong> {buyerLeadData.Contact}</p>
                <p><strong>Email:</strong> {buyerLeadData.Email}</p>
                <p><strong>Budget:</strong> $ {buyerLeadData.Budget}</p>
              </div>
            </div>
          ) : (
            <p>No buyer leads available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeneratedLeads;
