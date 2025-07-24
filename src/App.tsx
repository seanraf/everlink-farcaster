import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Success from './Success'
import Failure from './Failure'
import NavBar from './view/NavBar'
import Footer from './view/Footer'

import { ContextProvider } from './providers/FarcasterContextProvider'
import Providers from './providers/provider'
import FarcasterFrameProvider from './providers/FarcasterFrameProvider'
import CrossmintProviders from './providers/Crossmint'


function App() {
  return (
    <>
       <Providers>
        <CrossmintProviders>

         <FarcasterFrameProvider>
           <ContextProvider>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failure" element={<Failure />} />
              <Route path="/success/:id" element={<Success />} />
            </Routes>
            <Footer />
          </ContextProvider>
         </FarcasterFrameProvider>
        </CrossmintProviders>
      </Providers>

    </>
  )
}

export default App
