/**
 * Optimizes Cloudinary URLs by injecting transformation parameters (q_auto, f_auto)
 * for automatic quality compression and format conversion (like webp).
 * 
 * @param {string} url - The original Cloudinary URL
 * @returns {string} The optimized URL
 */
export const optimizeCloudinaryUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    // Check if the URL is from Cloudinary and doesn't already contain our optimized settings
    if (url.includes('cloudinary.com') && !url.includes('/upload/q_auto,f_auto/')) {
        return url.replace('/upload/', '/upload/q_auto,f_auto/');
    }

    return url;
};
