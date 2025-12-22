import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './Layout';

// Pages
import Home from './pages/Home';
import Verify from './pages/Verify';
import Instructions from './pages/Instructions';
import Quiz from './pages/Quiz';
import Summary from './pages/Summary';
import Results from './pages/Results';
import DetailedResults from './pages/DetailedResults';
import Admin from './pages/Admin';
import UserLogins from './pages/UserLogins';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />

          <Route path="/verify" element={<Layout currentPageName="Verify"><Verify /></Layout>} />
          <Route path="/instructions" element={<Layout currentPageName="Instructions"><Instructions /></Layout>} />

          <Route path="/quiz" element={<Layout currentPageName="Quiz"><Quiz /></Layout>} />
          <Route path="/quiz/summary" element={<Layout currentPageName="Summary"><Summary /></Layout>} />
          <Route path="/quiz/results" element={<Layout currentPageName="Results"><Results /></Layout>} />
          <Route path="/quiz/results/detailed" element={<Layout currentPageName="DetailedResults"><DetailedResults /></Layout>} />

          <Route path="/admin" element={<Layout currentPageName="Admin"><Admin /></Layout>} />
          <Route path="/admin/logins" element={<Layout currentPageName="UserLogins"><UserLogins /></Layout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
