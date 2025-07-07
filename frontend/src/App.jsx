import React, { useState } from 'react';
import { Download, Youtube, AlertCircle, CheckCircle, Loader2, ExternalLink, Clock, FileVideo, RefreshCw } from 'lucide-react';
import { downloadVideo } from './api';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)/;
    return regex.test(url);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await downloadVideo(url);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to download video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleDownload();
    }
  };

  const handleNewDownload = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const handleTryAgain = () => {
    setError('');
    if (url.trim()) {
      handleDownload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 p-3 rounded-xl">
              <Youtube className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">YouTube Downloader</h1>
              <p className="text-gray-600 mt-1">Download videos in high-quality HEVC format</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Download YouTube Videos</h2>
            <p className="text-gray-600">Enter a YouTube URL to download in 720p HEVC format</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleDownload}
                disabled={loading || !url.trim()}
                className="px-8 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={handleTryAgain}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-green-50 border-b border-green-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">Video Ready for Download</h3>
                </div>
                <button
                  onClick={handleNewDownload}
                  className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Download Another</span>
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Video Info */}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {result.title}
                  </h4>
                  
                  <div className="space-y-3 mb-6">
                    {result.duration && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {result.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FileVideo className="h-4 w-4" />
                      <span>Format: 720p HEVC (.mkv)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={result.downloadUrl}
                      download
                      className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold"
                    >
                      <Download className="h-5 w-5" />
                      <span>Download Video</span>
                    </a>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>View Original</span>
                    </a>
                  </div>
                </div>

                {/* Thumbnail */}
                {result.thumbnail && (
                  <div className="lg:w-80">
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full rounded-xl shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileVideo className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
            <p className="text-gray-600">Downloads in 720p resolution with HEVC compression for optimal quality and file size.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Downloads</h3>
            <p className="text-gray-600">Efficient processing and conversion using industry-standard tools.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
            <p className="text-gray-600">Files are automatically cleaned up after download for your privacy.</p>
          </div>
        </div>

        {/* Sample Video Section */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Test with Sample Video</h3>
          <p className="text-blue-700 mb-4">Try our downloader with this royalty-free test video:</p>
          <button
            onClick={() => setUrl('https://www.youtube.com/watch?v=2OEL4P1Rz04')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-semibold"
          >
            Load Test Video
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>Legal Notice:</strong> This tool is for personal or educational use only.
            </p>
            <p className="text-sm">
              Downloading copyrighted content may violate YouTube's Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;