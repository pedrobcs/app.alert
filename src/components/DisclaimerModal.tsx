'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (!accepted) return;
    localStorage.setItem('disclaimer_accepted', 'true');
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
              Important Legal Disclaimer
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
              <h3 className="font-bold text-gray-900 mb-2">Trading & Market Risk</h3>
              <p>
                Crypto futures and perpetual swaps are highly volatile instruments. Leveraged exposure can result
                in rapid and substantial losses. Past performance, backtests, or scenario plans displayed inside
                FuturesPilot do not guarantee future outcomes.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Software Only & Non-Custodial</h3>
              <p>
                FuturesPilot is a workflow and research application. It does not execute trades, move capital, or
                custody assets. All execution decisions remain with you and your trading infrastructure.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Data Sources & Accuracy</h3>
              <p>
                Market data, funding curves, and AI summaries may rely on third-party APIs. We cannot guarantee
                timeliness, completeness, or accuracy. Always cross-check numbers before committing real capital.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Compliance & Eligibility</h3>
              <p>
                You are responsible for ensuring that use of FuturesPilot complies with applicable laws, exchange
                terms, and licensing requirements in your jurisdiction. Certain regions or entities may be restricted.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Confidentiality</h3>
              <p>
                Trade ideas, playbooks, and notes you store inside the platform are your responsibility. Do not upload
                material that infringes on NDAs or third-party confidentiality obligations.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">No Financial Advice</h3>
              <p>
                Outputs from FuturesPilot, including AI-generated summaries, do not constitute investment, legal, or tax
                advice. Consult qualified professionals before executing strategies referenced here.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">AI-Generated Content</h3>
              <p>
                AI copilots may hallucinate or omit context. Validate every recommendation with independent research
                and your risk framework before acting on it.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Acceptance</h3>
              <p>
                By checking the box below and clicking &quot;I Accept,&quot; you acknowledge that you understand FuturesPilot is
                a research tool, accept the risks above, and will not rely on it as the sole basis for trading decisions.
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
                I have read and understood the above statements. I accept that FuturesPilot is research software and I remain
                fully responsible for any trades or capital deployment performed outside this platform.
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
            I Accept the Research Terms
          </button>
        </div>
      </div>
    </div>
  );
}
