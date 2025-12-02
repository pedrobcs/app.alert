# Warnings Explained

The current build is free of wallet/prisma warnings because those dependencies were removed. If you reintroduce external SDKs, keep these tips in mind:

1. **Optional Peer Dependencies** – Some SDKs (WalletConnect, MetaMask, etc.) expect React Native shims. Add them only if you bring those SDKs back.
2. **ESLint Exhaustive Deps** – The pages now use `useCallback`/`useEffect` patterns that keep the linter quiet. Follow the same approach when adding new hooks.
3. **localStorage Access** – All helper functions guard against `window` so server builds stay warning-free. Do the same when accessing browser-only APIs.

If new warnings pop up, document why they’re acceptable or eliminate them by updating dependencies.
