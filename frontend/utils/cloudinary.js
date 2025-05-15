import axios from 'axios';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Cloudinary configuration - Replace with your actual values until env setup is complete
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dbyxezboa/upload';
const UPLOAD_PRESET = 'handyman_app';

/**
 * Check if the device is connected to the internet
 * @returns {Promise<boolean>} - Whether the device is connected
 */
const checkNetworkConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error('[Cloudinary] Network check error:', error);
    return false;
  }
};

/**
 * Uploads an image file to Cloudinary
 * @param {string} uri - The local URI of the image
 * @param {string} folder - The folder in Cloudinary to upload to (e.g., 'profiles', 'certifications')
 * @returns {Promise<object>} - The Cloudinary response with image data
 */
export const uploadImage = async (uri, folder = 'profiles') => {
  try {
    // First check network connection
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error('No internet connection available. Please check your network settings and try again.');
    }

    console.log(`[Cloudinary] Starting upload from ${uri} to folder ${folder}`);
    
    // For Android: Fix file:// URI issues
    const fixedUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
    
    // Create form data for upload
    const formData = new FormData();
    
    // Get filename from URI
    const filename = fixedUri.split('/').pop();
    
    // Determine file type
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
    if (type === 'image/jpg') type = 'image/jpeg';
    
    formData.append('file', {
      uri: fixedUri,
      name: filename || `image_${Date.now()}.jpg`,
      type,
    });
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    console.log('[Cloudinary] Uploading to Cloudinary with URL:', CLOUDINARY_URL);
    
    // Add timeout to prevent hanging requests
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    if (!response.data || !response.data.secure_url) {
      throw new Error('Invalid response from Cloudinary');
    }
    
    console.log('[Cloudinary] Upload successful:', response.data.secure_url);
    return response.data;
  } catch (error) {
    console.error('[Cloudinary] Upload error details:', error);

    // Improved error reporting based on error type
    if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timed out. Please try again with a smaller file or better connection.');
    }
    
    if (error.response) {
      // Server responded with error
      console.error('[Cloudinary] Server error:', error.response.data);
      throw new Error(`Server rejected the upload: ${error.response.data.error?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('[Cloudinary] No response received');
      throw new Error('No response received from server. Please check your internet connection.');
    } 
    
    // Either a custom error or something else went wrong
    throw error.message ? error : new Error('Failed to upload image to Cloudinary');
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
    // First check network connection
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error('No internet connection available. Please check your network settings and try again.');
    }

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
    
    console.log('[Cloudinary] Uploading document to Cloudinary...');
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    if (!response.data || !response.data.secure_url) {
      throw new Error('Invalid response from Cloudinary');
    }
    
    console.log('[Cloudinary] Document upload successful:', response.data.secure_url);
    return response.data;
  } catch (error) {
    console.error('[Cloudinary] Document upload error details:', error);
    
    // Improved error reporting based on error type
    if (error.code === 'ECONNABORTED') {
      throw new Error('Document upload timed out. Please try again with a smaller file or better connection.');
    }
    
    if (error.response) {
      // Server responded with error
      console.error('[Cloudinary] Server error:', error.response.data);
      throw new Error(`Server rejected the document upload: ${error.response.data.error?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('[Cloudinary] No response received');
      throw new Error('No response received from server. Please check your internet connection.');
    } 
    
    // Either a custom error or something else went wrong
    throw error.message ? error : new Error('Failed to upload document to Cloudinary');
  }
};

export default {
  uploadImage,
  uploadDocument,
};
