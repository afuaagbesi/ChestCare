import React, { useState } from 'react';
import { Upload, X, User } from 'lucide-react';

const ImageUpload = ({ onImageUpload, currentImageUrl, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        onImageUpload(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    // Show error toast notification
    alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    onImageUpload('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      {imageUrl ? (
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              ) : (
                <Upload className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;