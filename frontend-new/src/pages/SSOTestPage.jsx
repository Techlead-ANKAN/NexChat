import React, { useState } from 'react';
import { decodeChatUserData, getChatUserDataFromURL, validateUserData } from '../lib/sso-decoder';
import { getSSOEncryptionKey, getRoleForSSOType } from '../config/sso';
import { useAuthStore } from '../store/useAuthStore';

const SSOTestPage = () => {
  const [encryptedData, setEncryptedData] = useState('');
  const [decodedData, setDecodedData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithSSO, isSSOLoggingIn } = useAuthStore();

  const encryptionKey = getSSOEncryptionKey();

  const handleDecode = async () => {
    if (!encryptedData.trim()) {
      setError('Please enter encrypted data');
      return;
    }

    setIsLoading(true);
    setError('');
    setDecodedData(null);

    try {
      // Test decoding
      const decoded = decodeChatUserData(encryptedData, encryptionKey);
      
      if (!decoded) {
        setError('Failed to decode data. Check the encrypted data format.');
        return;
      }

      // Validate the decoded data
      if (!validateUserData(decoded)) {
        setError('Decoded data validation failed');
        return;
      }

      setDecodedData(decoded);
      setError('');
    } catch (err) {
      setError(`Decoding error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    if (!decodedData) {
      setError('No decoded data available');
      return;
    }

    try {
      const success = await loginWithSSO(decodedData);
      if (success) {
        setError('');
        // Redirect will happen automatically
      }
    } catch (err) {
      setError(`SSO login error: ${err.message}`);
    }
  };

  const handleURLTest = () => {
    try {
      const urlData = getChatUserDataFromURL(encryptionKey);
      if (urlData) {
        setDecodedData(urlData);
        setEncryptedData(''); // Clear manual input
        setError('');
      } else {
        setError('No SSO data found in URL parameters');
      }
    } catch (err) {
      setError(`URL test error: ${err.message}`);
    }
  };

  const clearData = () => {
    setEncryptedData('');
    setDecodedData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wild-950 via-nature-950 to-wild-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-effect rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            SSO Integration Test Page
          </h1>

          {/* Configuration Info */}
          <div className="mb-8 p-4 bg-nature-800/50 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-nature-300">Encryption Key:</span>
                <div className="text-white font-mono text-xs break-all">
                  {encryptionKey.substring(0, 20)}...
                </div>
              </div>
              <div>
                <span className="text-nature-300">SSO Enabled:</span>
                <span className="text-green-400 ml-2">Yes</span>
              </div>
            </div>
          </div>

          {/* Manual Test Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Manual Test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-nature-300 text-sm font-medium mb-2">
                  Encrypted Data (base64)
                </label>
                <textarea
                  value={encryptedData}
                  onChange={(e) => setEncryptedData(e.target.value)}
                  placeholder="Paste encrypted data here..."
                  className="w-full h-32 p-3 bg-nature-800/50 border border-nature-600 rounded-lg text-white placeholder-nature-400 focus:outline-none focus:ring-2 focus:ring-nature-500"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleDecode}
                  disabled={isLoading || !encryptedData.trim()}
                  className="px-6 py-2 bg-nature-600 hover:bg-nature-700 disabled:bg-nature-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isLoading ? 'Decoding...' : 'Decode Data'}
                </button>
                
                <button
                  onClick={handleURLTest}
                  className="px-6 py-2 bg-wild-600 hover:bg-wild-700 text-white rounded-lg transition-colors"
                >
                  Test URL Data
                </button>
                
                <button
                  onClick={clearData}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {decodedData && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Decoded Data</h2>
              <div className="bg-nature-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-nature-300">ID:</span>
                    <span className="text-white ml-2">{decodedData.id}</span>
                  </div>
                  <div>
                    <span className="text-nature-300">Type:</span>
                    <span className="text-white ml-2">{decodedData.type}</span>
                  </div>
                  <div>
                    <span className="text-nature-300">Name:</span>
                    <span className="text-white ml-2">{decodedData.name}</span>
                  </div>
                  <div>
                    <span className="text-nature-300">Email:</span>
                    <span className="text-white ml-2">{decodedData.email}</span>
                  </div>
                  <div>
                    <span className="text-nature-300">Phone:</span>
                    <span className="text-white ml-2">{decodedData.phone}</span>
                  </div>
                  <div>
                    <span className="text-nature-300">Mapped Role:</span>
                    <span className="text-white ml-2">{getRoleForSSOType(decodedData.type)}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-nature-600">
                  <button
                    onClick={handleSSOLogin}
                    disabled={isSSOLoggingIn}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {isSSOLoggingIn ? 'Logging in...' : 'Test SSO Login'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-wild-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">How to Test</h3>
            <ol className="text-sm text-nature-300 space-y-2 list-decimal list-inside">
              <li>Get encrypted data from your Laravel backend</li>
              <li>Paste it in the encrypted data field above</li>
              <li>Click "Decode Data" to test decryption</li>
              <li>Use "Test URL Data" to check URL parameters</li>
              <li>Click "Test SSO Login" to authenticate the user</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOTestPage;
