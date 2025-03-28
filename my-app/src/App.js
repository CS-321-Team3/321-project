// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrepPage from './components/PrepPage/prep-page-component';
import MainApp from './MainApp';
import LoginScreen from './components/LoginPage/login';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path='/user/:userId' element={<MainApp />} />
        <Route path="/prepare/:jobId" element={<PrepPage />} />
      </Routes>
    </Router>
  );
}

export default App;