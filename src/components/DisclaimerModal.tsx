'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

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
              <h3 className="font-bold text-gray-900 mb-2">Risk Disclosure</h3>
              <p>
                Trading cryptocurrencies and digital assets involves substantial risk of loss.
                The value of your investment may fluctuate significantly, and you may lose some
                or all of your invested capital. Past performance is not indicative of future results.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Non-Custodial Nature</h3>
              <p>
                By using this platform, you understand that you are sending funds directly to
                the operator's wallet address. This platform does not custody your funds.
                Once transferred, funds are under the control of the operator.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">No Guarantees</h3>
              <p>
                We make no guarantees or promises regarding investment returns, profits, or
                performance. The trading bot's performance may vary and is subject to market
                conditions, technical issues, and other factors beyond our control.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Withdrawal Policy</h3>
              <p>
                Withdrawals are processed manually and may take 3-5 business days or longer
                depending on market conditions and liquidity. There is no guarantee that
                withdrawals will be processed within any specific timeframe.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Regulatory Status</h3>
              <p>
                This platform may not be registered with any financial regulatory authority.
                Investments made through this platform may not be protected by investor
                protection schemes or insurance.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">No Financial Advice</h3>
              <p>
                Nothing on this platform constitutes financial, investment, legal, or tax advice.
                You should consult with your own advisors before making any investment decisions.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Geographic Restrictions</h3>
              <p>
                This platform may not be available to residents of certain jurisdictions.
                It is your responsibility to ensure that your use of this platform complies
                with applicable laws in your jurisdiction.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Know Your Customer (KYC) / Anti-Money Laundering (AML)</h3>
              <p>
                The operator may require you to complete KYC verification at any time. Failure
                to provide requested information may result in restrictions on your account,
                including the inability to deposit or withdraw funds.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Smart Contract Risk</h3>
              <p>
                Transactions on blockchain networks are irreversible. Ensure you send funds
                to the correct address on the correct network (Arbitrum). We cannot recover
                funds sent to incorrect addresses or wrong networks.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-gray-900 mb-2">Acceptance</h3>
              <p>
                By checking the box below and clicking "I Accept," you acknowledge that you
                have read, understood, and agree to accept all risks associated with using
                this platform. You confirm that you are investing only funds you can afford
                to lose.
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
                I have read and understood the above disclaimers. I acknowledge the risks
                involved and agree to the terms of use. I am only investing funds that I
                can afford to lose.
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
            I Accept and Understand the Risks
          </button>
        </div>
      </div>
    </div>
  );
}
