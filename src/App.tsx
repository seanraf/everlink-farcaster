import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Success from './Success';
import Failure from './Failure';
import NavBar from './view/NavBar';
import Footer from './view/Footer';
import SuccessCase from './view/SuccessCase';
import { ContextProvider } from './providers/FarcasterContextProvider';
import FarcasterFrameProvider from './providers/FarcasterFrameProvider';
import CrossmintProviders from './providers/Crossmint';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wegmiConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <CrossmintProviders>
        <FarcasterFrameProvider>
          <OnchainKitProvider
            apiKey='Atp1YiODMDlZg8kVALmA51Q450rZedxr'
            chain={base}
            projectId='b56fbc8d-e69b-417e-9118-e33967b22bfa'
          >
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <ContextProvider>
                  <NavBar />
                  <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/success' element={<SuccessCase />} />
                    <Route path='/failure' element={<Failure />} />
                    <Route path='/success/:id' element={<Success />} />
                  </Routes>
                  <Footer />
                </ContextProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </OnchainKitProvider>
        </FarcasterFrameProvider>
      </CrossmintProviders>
    </>
  );
}

export default App;
