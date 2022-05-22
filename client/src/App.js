import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { checkUser } from './redux/features/auth/authSlice';
import UserInfo from './components/UserInfo';
import ProfileTabs from './components/ProfileTabs';
import Navbar from './components/Navbar';
import Footer from './components/common/Footer';
import ActiveMembers from './components/ActiveMembers';
import Resources from './components/Resources';
import Header from './components/Header';

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkUser());
  }, []);

  return (
    <div className="App">
      <Header />
      {loading ? 'Loading...' : (
        <div>
          <Navbar />
          <ProfileTabs />
          <Resources />
        </div>
      )}
      <ActiveMembers />
      <Routes>
        <Route path="/users/:id" element={<UserInfo />} />
      </Routes>
      <Resources />
      <Footer />
    </div>
  );
};

export default App;
