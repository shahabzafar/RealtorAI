import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Form/FormPage.css';

function FormPage() {
  const { realtorId } = useParams();
  const [clientType, setClientType] = useState('buyer'); // or 'seller'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // buyer fields
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [amenities, setAmenities] = useState('');
  // seller fields
  const [propertyImages, setPropertyImages] = useState([]); // array of base64 or URLs
  const [notes, setNotes] = useState('');
  // success message
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName,
        lastName,
        phone,
        email,
        clientType,
        budget: clientType === 'buyer' ? budget : null,
        location: clientType === 'buyer' ? location : null,
        amenities: clientType === 'buyer' ? amenities : null,
        propertyImages: clientType === 'seller' ? propertyImages : null,
        notes: clientType === 'seller' ? notes : null,
      };

      const res = await axios.post(`/api/form/${realtorId}`, payload);
      console.log('Form submitted:', res.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Error submitting form');
    }
  };

  // Example: convert selected images to base64 strings
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    const base64Images = await Promise.all(promises);
    setPropertyImages([...propertyImages, ...base64Images]);
  };

  if (submitted) {
    return (
      <div className="form-page-container dark-mode">
        <h2>Thank you!</h2>
        <p>Your information has been submitted.</p>
      </div>
    );
  }

  return (
    <div className="form-page-container dark-mode">
      <h1>Contact Form</h1>
      <form onSubmit={handleFormSubmit} className="client-form">
        <div className="form-group">
          <label>First Name *</label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
          />
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div className="form-group">
          <label>Are you buying or selling?</label>
          <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        {clientType === 'buyer' && (
          <>
            <div className="form-group">
              <label>Budget</label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                type="number"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
              />
            </div>

            <div className="form-group">
              <label>Amenities</label>
              <textarea
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
              />
            </div>
          </>
        )}

        {clientType === 'seller' && (
          <>
            <div className="form-group">
              <label>Property Images (Max size: X MB each)</label>
              <input type="file" multiple onChange={handleFileChange} />
            </div>

            <div className="form-group">
              <label>Property Description / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. House details, special features, etc."
              />
            </div>
          </>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormPage;
