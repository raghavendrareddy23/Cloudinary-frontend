import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TailSpin} from 'react-loader-spinner';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setPreview(URL.createObjectURL(selectedImage));
  };

  const handleUpload = async () => {
    if (!image) {
      setErrorMessage('Please select an image');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('https://cloudinary-backend-iq8v.onrender.com/api/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      toast.success('Image uploaded successfully');
      // Handle successful upload, e.g., show success message or redirect
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Error uploading image. Please try again later.');
      toast.error('Error uploading image. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  const navigateToImagesPage = () => {
    // Navigate to the page where you can view images
    navigate('/users/:id');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      {preview && (
        <img src={preview} alt="Preview" className="mb-4 max-w-full" />
      )}
      {errorMessage && (
        <p className="text-red-500 mb-4">{errorMessage}</p>
      )}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          uploading && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {uploading ? (
          <div className="flex justify-center items-center">
          <TailSpin color="#FFFFFF" height={20} width={20} />
        </div>
        ) : (
          'Upload Image'
        )}
      </button>
      <button
        onClick={navigateToImagesPage}
        className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        View Images
      </button>
      <ToastContainer />
    </div>
  );
};

export default ImageUpload;
