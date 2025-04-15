// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrepPage from './components/PrepPage/prep-page-component';
import MainApp from './components/MainPage/main-page';
import LoginScreen from './components/LoginPage/Auth/login'
import PasswordReset from './components/LoginPage/PasswordReset/password-reset-component';
import AccountCreation from './components/LoginPage/AccountCreation/account-creation-component';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path='/forgot-password' element={<PasswordReset />} />
        <Route path='/create-account' element={<AccountCreation/>} />
        <Route path='/user/:userId' element={<MainApp />} />
        <Route path="/prepare/:jobId" element={<PrepPage />} />
      </Routes>
    </Router>
  );
}

export default App;