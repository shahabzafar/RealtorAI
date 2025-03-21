import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Realtor/RealtorProfileHeader.css';

const RealtorProfileHeader = ({ user }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if user exists and has an ID before trying to fetch image
    if (user?.id) {
      fetchProfileImage();
    }
  }, [user]);

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(`/api/realtor/${user.id}/profile-image`, {
        responseType: 'blob'
      });
      const imageUrl = URL.createObjectURL(response.data);
      setProfileImage(imageUrl);
      setImageError(false);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setImageError(true);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      await axios.post('/api/realtor/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Fetch the updated image
      await fetchProfileImage();
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setImageError(true);
    }
  };

  const handleImageLoadError = () => {
    setImageError(true);
  };

  return (
    <section className="realtor-profile-header">
      <div className="profile-info">
        <div className="profile-image" onClick={handleImageClick}>
          {!imageError && profileImage ? (
            <img 
              src={profileImage}
              alt="Profile" 
              className="profile-photo"
              onError={handleImageLoadError}
            />
          ) : (
            <div className="circle-placeholder">
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <div className="image-overlay">
            <span>Update Photo</span>
          </div>
        </div>
        <div className="profile-text">
          <div className="name-container">
            <h2 className="no-decoration">{user ? `${user.firstName} ${user.lastName}` : 'User Name'}</h2>
          </div>
          <span className="badge">Top Realtor</span>
          <div className="orange-dash"></div>
          <p>Welcome to your Realtor Dashboard</p>
        </div>
      </div>
    </section>
  );
};

export default RealtorProfileHeader;
