import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Upload, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
      setCapturedPreview(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'environment' | 'user') => {
    setIsStarting(true);
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('क्यामेरा अनुमति प्राप्त भएन। कृपया आफ्नो ब्राउजरमा क्यामेरा चलाउने अनुमति दिनुहोस्।');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('तपाईंको उपकरणमा क्यामेरा भेटिएन। ग्यालरीबाट तस्विर छनोट गर्नुहोस्।');
      } else {
        setCameraError('क्यामेरा सुरु गर्दा समस्या आयो। कृपया ग्यालरी वा फाइलबाट तस्विर अपलोड गर्नुहोस्।');
      }
    } finally {
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleTakeSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('कृपया तस्विर फाइल (JPEG/PNG) मात्र छनोट गर्नुहोस्।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImage = () => {
    if (capturedPreview) {
      onCapture(capturedPreview);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">प्रश्नको तस्विर खिच्नुहोस् (Scan Question)</h3>
              <p className="text-xs text-slate-400">पाठ्यपुस्तक वा कापीको प्रश्नको फोटो खिच्नुहोस्</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder or Preview Area */}
        <div className="relative flex-1 bg-black min-h-[300px] flex items-center justify-center overflow-hidden">
          {capturedPreview ? (
            /* Show Captured Preview */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedPreview}
                alt="Captured question"
                className="max-h-[60vh] w-auto object-contain rounded-lg"
              />
              <div className="absolute top-3 left-3 bg-emerald-600/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>तस्विर तयार भयो!</span>
              </div>
            </div>
          ) : cameraError ? (
            /* Show Camera Error with Upload Alternative */
            <div className="p-6 text-center space-y-4 max-w-xs">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>ग्यालरीबाट तस्विर छानेर अपलोड गर्नुहोस्</span>
              </button>
            </div>
          ) : (
            /* Live Camera Stream */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover max-h-[60vh]"
              />

              {/* Grid / Framing Overlay */}
              <div className="absolute inset-6 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="bg-slate-900/80 backdrop-blur-xs text-emerald-300 text-xs px-3 py-1.5 rounded-full font-semibold border border-emerald-500/30">
                  प्रश्नलाई यहाँ भित्र मिलाउनुहोस्
                </span>
              </div>

              {isStarting && (
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-emerald-400 gap-2 text-sm font-semibold">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>क्यामेरा सुरु हुँदैछ...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          {capturedPreview ? (
            /* Retake or Use Photo buttons */
            <>
              <button
                type="button"
                onClick={() => setCapturedPreview(null)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>पुन: फोटो खिच्नुहोस्</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmImage}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>यो तस्विर प्रयोग गर्नुहोस्</span>
              </button>
            </>
          ) : (
            /* Live controls: Flip camera, Snap, Upload file */
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title="क्यामेरा फेर्नुहोस् (Flip Camera)"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="ग्यालरीबाट छानेर पठाउनुहोस्"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">ग्यालरी</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleTakeSnap}
                disabled={!!cameraError || isStarting}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
                <span>फोटो खिच्नुहोस्</span>
              </button>
            </>
          )}

          {/* Hidden File Input for uploading existing images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
