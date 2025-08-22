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

function App() {
  return (
    <>
      <CrossmintProviders>
        <FarcasterFrameProvider>
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
        </FarcasterFrameProvider>
      </CrossmintProviders>
    </>
  );
}

export default App;
