'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('intent_notice_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (!accepted) return;
    localStorage.setItem('intent_notice_accepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Important Notice
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-900 font-semibold">
              Please read this carefully before using this platform.
            </p>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <section>
              <h3 className="font-bold text-gray-900 mb-2">Not an official government app</h3>
              <p>
                This site is an independent helper page. It is <strong>not</strong> affiliated with, endorsed by,
                or operated by U.S. Customs and Border Protection (CBP) or any government agency.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Personal information</h3>
              <p>
                You will be asked to enter personal details (name, date of birth, citizenship, contact info)
                and upload a selfie. Only submit information that is accurate and that you have the right to provide.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Reward information</h3>
              <p>
                Any mention of a “$1,000 reward” is informational and may depend on eligibility and external program rules.
                This site does not guarantee payment.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Privacy & security</h3>
              <p>
                Do not submit passwords, financial account details, or highly sensitive information beyond what is requested.
                Use a secure network and device when uploading your selfie.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Acceptance</h3>
              <p>
                By checking the box below and clicking “I Understand,” you acknowledge you have read this notice.
              </p>
            </section>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I understand this is not an official CBP application and I consent to providing the requested information on this site.
              </span>
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              accepted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              I Understand
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
