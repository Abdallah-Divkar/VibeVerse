import React, { useState } from 'react';
import cloudinaryConfig from '../config/config'; 
import axios from 'axios';
const backendURL = import.meta.env.REACT_APP_BACKEND_URL;

const ProfilePicUpload = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (result) => {
    if (result.event === 'success') {
      const uploadedUrl = result.info.secure_url;
      console.log('Uploaded image URL:', uploadedUrl);

      // Update the state with the uploaded image URL
      setUploadedImage(uploadedUrl);
    }
  };

  const openCloudinaryWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudinaryConfig.cloudName,
        uploadPreset: cloudinaryConfig.uploadPreset,
        multiple: false,
        resourceType: 'image',
      },
      handleImageUpload
    );

    widget.open(); 
  };

  const sendImageUrlToBackend = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backendURL}/api/user/updateProfile`, {
        profilePic: uploadedImage, // Send the uploaded image URL
      });
      console.log('Profile updated successfully:', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={openCloudinaryWidget}>
        {loading ? 'Uploading...' : 'Upload Profile Picture'}
      </button>
      
      {uploadedImage && (
        <div>
          <h3>Uploaded Profile Picture:</h3>
          <img src={uploadedImage} alt="Profile" style={{ width: '200px', height: '200px' }} />
          <button onClick={sendImageUrlToBackend} disabled={loading}>
            {loading ? 'Updating Profile...' : 'Save Profile Picture'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicUpload;
