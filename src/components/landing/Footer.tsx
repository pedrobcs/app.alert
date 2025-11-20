export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              USDC Investment
            </h3>
            <p className="text-gray-400 mb-4">
              Professional automated trading on Arbitrum.
              Invest USDC and earn passive returns.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-arbitrum transition-colors">
                Twitter
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-arbitrum transition-colors">
                Discord
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-arbitrum transition-colors">
                Telegram
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-arbitrum transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-arbitrum transition-colors">FAQ</a></li>
              <li><a href="/dashboard" className="hover:text-arbitrum transition-colors">Dashboard</a></li>
              <li><a href="/admin" className="hover:text-arbitrum transition-colors">Admin</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/terms" className="hover:text-arbitrum transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-arbitrum transition-colors">Privacy Policy</a></li>
              <li><a href="/risks" className="hover:text-arbitrum transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 USDC Investment Platform. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="text-arbitrum font-semibold">Arbitrum</span>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-8 p-6 glass rounded-lg text-sm text-gray-400 leading-relaxed">
          <p className="font-semibold text-yellow-400 mb-2">⚠️ Risk Warning</p>
          <p>
            Cryptocurrency trading involves substantial risk of loss. Past performance is not indicative of future results. 
            Funds are sent directly to the operator wallet. This platform does not provide investment advice. 
            Only invest what you can afford to lose. By using this platform, you acknowledge and accept these risks.
          </p>
        </div>
      </div>
    </footer>
  );
}
