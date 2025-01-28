import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Realtor/global.css';
import '../../styles/Settings/SettingsPage.css';

function SettingsPage({ user, setUser }) {
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  // fetch the latest user data in case it changed
  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setEmail(user?.email || '');
    setPhoneNumber(user?.phoneNumber || '');
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/realtor/settings', {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: password.trim() === '' ? undefined : password,
      });
      console.log('Settings updated:', response.data);
      // update front end user
      if (response.data.user) {
        setUser((prev) => ({
          ...prev,
          ...response.data.user
        }));
        alert('Settings saved!');
      }
    } catch (error) {
      console.error('Error updating settings:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to update settings');
    }
  };

  return (
    <div className="settings-page dark-mode">
      <h2>Settings</h2>
      <div className="settings-form">
        <label>First Name</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
        />

        <label>Last Name</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />

        <label>Phone Number</label>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="text"
        />

        {/* If user was created via Google OAuth, the backend won't allow password changes. */}
        <label>Password (Only for local accounts)</label>
        <input
          placeholder="Enter new password (optional)"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <button onClick={handleSave} className="save-button">
          Save
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
