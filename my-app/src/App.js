// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import PrepPage from './components/MainPage/PrepPage/prep-page-component';
import MainApp from './MainApp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/prepare/:jobId" element={<PrepPage />} />
      </Routes>
    </Router>
  );
}

export default App;