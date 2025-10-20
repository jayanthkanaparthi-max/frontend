import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/*
        Add top padding so the sticky header doesn't overlap page content.
        Header height is ~5rem (h-20)-> 80px; using pt-20 ensures safe spacing.
      */}
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
