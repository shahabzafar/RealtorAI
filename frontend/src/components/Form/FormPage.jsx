import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/Form/FormPage.css';

function FormPage() {
  const { realtorId } = useParams();
  const [clientType, setClientType] = useState('buyer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [amenities, setAmenities] = useState('');
  const [propertyImages, setPropertyImages] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!realtorId) {
        throw new Error('Realtor ID is missing');
      }

      const payload = {
        firstName,
        lastName,
        phone,
        email,
        clientType,
        budget: clientType === 'buyer' ? budget : null,
        location: clientType === 'buyer' ? location : null,
        amenities: clientType === 'buyer' ? amenities : null,
        property_images: clientType === 'seller' ? propertyImages : null,
        notes: clientType === 'seller' ? notes : null
      };

      const response = await fetch(`${backendUrl}/api/form/${realtorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await response.json();
        setSubmitted(true);
        alert('Form submitted successfully!');
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form. Please try again.');
    }
  };

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
      {!realtorId && (
        <p style={{ color: 'red' }}>Warning: No realtor ID found!</p>
      )}
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
              <label>Property Images</label>
              <input type="file" multiple onChange={handleFileChange} />
            </div>

            <div className="form-group">
              <label>Property Description / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
