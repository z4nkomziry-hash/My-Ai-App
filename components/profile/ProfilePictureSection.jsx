'use client';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, Eye, Sparkles, X, Check,
  RefreshCw, ImagePlus, Wand2
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProfilePictureSection({ userId, currentAvatar, onAvatarUpdate }) {
  const [activeTab, setActiveTab] = useState('view');
  const [previewImage, setPreviewImage] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const tabs = [
    { id: 'view', icon: <Eye className="w-4 h-4" />, label: 'View' },
    { id: 'upload', icon: <Upload className="w-4 h-4" />, label: 'Upload' },
    { id: 'camera', icon: <Camera className="w-4 h-4" />, label: 'Take Photo' },
    { id: 'ai', icon: <Wand2 className="w-4 h-4" />, label: 'AI Generate' },
  ];

  // ============================================
  // UPLOAD PHOTO
  // ============================================
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewImage) return;

    try {
      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: previewImage }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile picture updated!');
        onAvatarUpdate?.(data.url);
        setPreviewImage(null);
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  // ============================================
  // TAKE PHOTO (Webcam)
  // ============================================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (error) {
      toast.error('Camera access denied. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewImage(imageData);
    stopCamera();
  };

  // ============================================
  // AI GENERATE
  // ============================================
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description for your avatar');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/profile/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json();
      if (data.success) {
        setPreviewImage(data.imageUrl);
        toast.success('AI avatar generated!');
      } else {
        toast.error(data.error || 'Generation failed');
      }
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // ============================================
  // LIGHTBOX
  // ============================================
  const Lightbox = () => (
    <AnimatePresence>
      {showLightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-2xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentAvatar || previewImage || '/icon.png'}
              alt="Profile Picture"
              width={600}
              height={600}
              className="rounded-2xl object-contain max-h-[80vh]"
              unoptimized
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ImagePlus className="w-5 h-5 text-purple-400" />
        Profile Picture
      </h3>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== 'camera') stopCamera();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Current Avatar Preview */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="relative w-20 h-20 rounded-full cursor-pointer group"
          onClick={() => setShowLightbox(true)}
        >
          <Image
            src={previewImage || currentAvatar || '/icon.png'}
            alt="Avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30"
            unoptimized
          />
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Current Photo</p>
          <p className="text-xs text-gray-400">Click to view full size</p>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* View Tab */}
        {activeTab === 'view' && (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <p className="text-gray-400 text-sm">
              Click on your avatar above to view it in full resolution.
            </p>
          </motion.div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
            {previewImage && (
              <div className="mt-4 flex justify-end">
                <button onClick={handleUpload} className="btn-primary text-sm">
                  <Check className="w-4 h-4 mr-2" />
                  Save Photo
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Camera Tab */}
        {activeTab === 'camera' && (
          <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!cameraActive ? (
              <div className="text-center py-6">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <button onClick={startCamera} className="btn-primary text-sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-xl"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={capturePhoto} className="btn-primary text-sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </button>
                  <button onClick={stopCamera} className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </motion.div>
        )}

        {/* AI Generate Tab */}
        {activeTab === 'ai' && (
          <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Describe your avatar
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., A futuristic cyberpunk portrait with neon purple lighting..."
                  className="input-field h-24 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{aiPrompt.length}/500</p>
              </div>
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="btn-primary w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Avatar
                  </>
                )}
              </button>
              {previewImage && (
                <div className="mt-4 flex justify-end">
                  <button onClick={handleUpload} className="btn-primary text-sm">
                    <Check className="w-4 h-4 mr-2" />
                    Use This Avatar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <Lightbox />
    </div>
  );
}
