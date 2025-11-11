"use client";

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useEmergencyAlert } from '@/hooks/useEmergencyAlert';
import { formatCoordinates } from '@/lib/geolocation';
import { registerServiceWorker } from '@/lib/pwa';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

// Default emergency contacts (can be configured via environment variables)
const EMERGENCY_CONTACTS = [
  process.env.NEXT_PUBLIC_CONTACT_1 || "+5085140864",
];

export default function EmergencyPage() {
  const { coordinates, error: locationError, loading: locationLoading, accuracy, refreshLocation } = useGeolocation(true);
  const { sendAlert, loading: alertLoading, error: alertError, success: alertSuccess } = useEmergencyAlert();
  const [isClient, setIsClient] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    setIsClient(true);
    // Register service worker for PWA
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (alertSuccess) {
      showNotification("Emergency alert sent successfully! ✓", "success");
    }
  }, [alertSuccess]);

  useEffect(() => {
    if (alertError) {
      showNotification(alertError, "error");
    }
  }, [alertError]);

  const showNotification = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleEmergencyClick = async () => {
    if (!coordinates) {
      showNotification("Unable to get your location. Please try again.", "error");
      await refreshLocation();
      return;
    }

    try {
      await sendAlert(coordinates, EMERGENCY_CONTACTS);
    } catch (err) {
      // Error is already handled by the hook
      console.error("Emergency alert failed:", err);
    }
  };

  const getLocationStatus = () => {
    if (locationLoading) return "Getting location...";
    if (locationError) return locationError.message;
    if (coordinates) return formatCoordinates(coordinates);
    return "Location unavailable";
  };

  const getLocationStatusColor = () => {
    if (locationError) return "text-red-600";
    if (coordinates) return "text-green-600";
    return "text-gray-500";
  };

  const isButtonDisabled = alertLoading || locationLoading || !coordinates;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Alert Notification */}
      {showAlert && (
        <div
          className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 p-4 rounded-lg shadow-lg z-50 ${
            alertType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } animate-slide-in`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{alertMessage}</span>
            <button
              onClick={() => setShowAlert(false)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Safe<span className="text-red-600">Alert</span>
          </h1>
          <p className="text-gray-600">Emergency Alert System</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Location Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Location Status</span>
              {isClient && (
                <button
                  onClick={refreshLocation}
                  disabled={locationLoading}
                  className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                >
                  {locationLoading ? "Updating..." : "Refresh"}
                </button>
              )}
            </div>
            <p className={`text-sm ${getLocationStatusColor()} break-words`}>
              {getLocationStatus()}
            </p>
            {coordinates && accuracy && (
              <p className="text-xs text-gray-500 mt-1">
                Accuracy: ±{Math.round(accuracy)}m
              </p>
            )}
          </div>

          {/* Contact Count */}
          <div className="pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Emergency Contacts</span>
            <p className="text-sm text-gray-600 mt-1">
              {EMERGENCY_CONTACTS.length} contact{EMERGENCY_CONTACTS.length !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>

        {/* Emergency Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleEmergencyClick}
            disabled={isButtonDisabled}
            className={`
              w-64 h-64 rounded-full shadow-2xl
              transition-all duration-300 transform
              ${
                isButtonDisabled
                  ? "bg-gray-300 cursor-not-allowed scale-95"
                  : "bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 animate-pulse-slow"
              }
              flex flex-col items-center justify-center
              focus:outline-none focus:ring-4 focus:ring-red-300
            `}
          >
            <div className="text-white">
              {alertLoading ? (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                  <span className="text-xl font-bold">SENDING...</span>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-2">🚨</div>
                  <span className="text-3xl font-bold tracking-wider">EMERGENCY</span>
                  {locationLoading && (
                    <span className="text-xs mt-2 block">Getting location...</span>
                  )}
                </>
              )}
            </div>
          </button>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-600 mt-6 max-w-xs">
            {isButtonDisabled && !alertLoading
              ? "Waiting for location access..."
              : "Tap to send emergency alert with your current location"}
          </p>
        </div>

        {/* Instructions */}
        {locationError?.code === 1 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Location Access Required:</strong> Please enable location
              permissions in your browser settings to use this app.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500">
        <p>Always keep your location services enabled</p>
        <p className="mt-1">In case of real emergency, call local authorities</p>
        <p className="mt-1 text-xs text-gray-400">Powered by Twilio WhatsApp</p>
      </div>
    </div>
  );
}
