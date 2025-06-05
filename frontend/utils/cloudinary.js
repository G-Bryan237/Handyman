import axios from 'axios';

// Cloudinary configuration - Replace with your actual values until env setup is complete
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dbyxezboa/upload';
const UPLOAD_PRESET = 'handyman_app';

/**
 * Uploads an image file to Cloudinary
 * @param {string} uri - The local URI of the image
 * @param {string} folder - The folder in Cloudinary to upload to (e.g., 'profiles', 'certifications')
 * @returns {Promise<object>} - The Cloudinary response with image data
 */
export const uploadImage = async (uri, folder = 'profiles') => {
  try {
    console.log(`[Cloudinary] Starting upload from ${uri} to folder ${folder}`);
    
    // Create form data for upload
    const formData = new FormData();
    
    // Get filename from URI
    const filename = uri.split('/').pop();
    
    // Determine file type
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : 'image';
    if (type === 'image/jpg') type = 'image/jpeg';
    
    formData.append('file', {
      uri,
      name: filename,
      type,
    });
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    console.log('[Cloudinary] Uploading to Cloudinary...');
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('[Cloudinary] Upload successful:', response.data.secure_url);
    return response.data;
  } catch (error) {
    console.error('[Cloudinary] Upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Uploads a document file to Cloudinary
 * @param {string} uri - The local URI of the document
 * @param {string} folder - The folder in Cloudinary to upload to (default: 'documents')
 * @returns {Promise<object>} - The Cloudinary response with document data
 */
export const uploadDocument = async (uri, folder = 'certifications') => {
  try {
    console.log(`[Cloudinary] Starting document upload from ${uri}`);
    
    const formData = new FormData();
    
    const filename = uri.split('/').pop();
    
    formData.append('file', {
      uri,
      name: filename,
      type: 'application/pdf',
    });
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('[Cloudinary] Document upload successful:', response.data.secure_url);
    return response.data;
  } catch (error) {
    console.error('[Cloudinary] Document upload error:', error);
    throw new Error('Failed to upload document to Cloudinary');
  }
};

export default {
  uploadImage,
  uploadDocument,
};
