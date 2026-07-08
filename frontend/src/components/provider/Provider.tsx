// src/components/Providers.tsx
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "@/config/config";

const stripePromise = loadStripe(config?.stripePaublishbleKey as string || "");

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId={config.googleClientId as string}
      >
        <Elements stripe={stripePromise}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Elements>
      </GoogleOAuthProvider>
    </Provider>
  );
}
