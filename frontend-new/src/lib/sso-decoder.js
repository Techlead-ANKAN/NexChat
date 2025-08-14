import CryptoJS from 'crypto-js';
import { useState, useEffect } from 'react';

/**
 * Decode encrypted chat user data from Laravel backend
 * @param {string} encryptedData - Base64 encoded encrypted data from URL parameter 'ur'
 * @param {string} encryptionKey - The encryption key from your backend system
 * @returns {Object|null} Decoded user data object or null if decryption fails
 */
export function decodeChatUserData(encryptedData, encryptionKey) {
    try {
        // Decode base64
        const decodedData = atob(encryptedData);
        
        // Extract IV (first 16 bytes) and encrypted data
        const iv = decodedData.slice(0, 16);
        const encrypted = decodedData.slice(16);
        
        // Convert encryption key to WordArray
        const key = CryptoJS.enc.Utf8.parse(encryptionKey);
        const ivWordArray = CryptoJS.lib.WordArray.create(iv);
        
        // Decrypt using AES-256-CBC
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.lib.WordArray.create(encrypted) },
            key,
            {
                iv: ivWordArray,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (!decryptedString) {
            throw new Error('Decryption failed');
        }
        
        // Split the decrypted string by '||'
        const userDataParts = decryptedString.split('||');
        
        if (userDataParts.length !== 5) {
            throw new Error('Invalid user data format');
        }
        
        // Return structured user data
        return {
            id: parseInt(userDataParts[0]),
            type: userDataParts[1],
            name: userDataParts[2],
            email: userDataParts[3],
            phone: userDataParts[4]
        };
        
    } catch (error) {
        console.error('Error decoding chat user data:', error);
        return null;
    }
}


/**
 * Get user data from URL parameters
 * @param {string} encryptionKey - The encryption key
 * @returns {Object|null} Decoded user data or null
 */
export function getChatUserDataFromURL(encryptionKey) {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedData = urlParams.get('ur');
    
    if (!encryptedData) {
        return null;
    }
    
    return decodeChatUserData(encryptedData, encryptionKey);
}

/**
 * React Hook for getting chat user data
 * @param {string} encryptionKey - The encryption key
 * @returns {Object} { userData, loading, error }
 */
export function useChatUserData(encryptionKey) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        try {
            const data = getChatUserDataFromURL(encryptionKey);
            if (data) {
                setUserData(data);
            } else {
                setError('Failed to decode user data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [encryptionKey]);
    
    return { userData, loading, error };
}

/**
 * Validate user data structure
 * @param {Object} userData - The decoded user data
 * @returns {boolean} True if valid, false otherwise
 */
export function validateUserData(userData) {
    if (!userData) return false;
    
    const required = ['id', 'type', 'name', 'email', 'phone'];
    
    for (const field of required) {
        if (!userData[field]) {
            return false;
        }
    }
    
    // Validate user type
    const validTypes = ['Member', 'Mentor', 'Admin'];
    if (!validTypes.includes(userData.type)) {
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return false;
    }
    
    return true;
}

/**
 * Map SSO user type to internal role
 * @param {string} ssoType - SSO user type (Member, Mentor, Admin)
 * @returns {string} Internal role (user, admin)
 */
export function mapSSOTypeToRole(ssoType) {
    switch (ssoType) {
        case 'Admin':
            return 'admin';
        case 'Mentor':
        case 'Member':
        default:
            return 'user';
    }
}
