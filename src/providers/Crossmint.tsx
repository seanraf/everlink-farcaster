import {
  CrossmintProvider,
  CrossmintAuthProvider,
} from '@crossmint/client-sdk-react-ui';

export default function CrossmintProviders({ children }: { children: React.ReactNode }) {
  return (
    <CrossmintProvider apiKey={import.meta.env.VITE_CROSSMINT_API_KEY ?? ''}>
      <CrossmintAuthProvider
        loginMethods={['farcaster']}
      >
        {children}
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
