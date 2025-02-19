import { Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import Navbar from './components/navbar';
import Homepage from './pages/homepage';
import AddBookPage from './pages/add-book';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import { useAuthStore } from './store/auth-store';
import RedirectAuthenticatedUser from './providers/redirect-authenticated-user';
import RedirectUnauthenticatedUser from './providers/redirect-unauthenticated-user';
import Footer from './components/footer';
import SearchPage from './pages/search-page';
import BookDetails from './pages/book-details';
import UpdateBookPage from './pages/update-book-page';

function App() {
  const { fetchUser, fetchingUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (fetchingUser) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Toaster />
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/add-book"
          element={
            <RedirectUnauthenticatedUser>
              <AddBookPage />
            </RedirectUnauthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignupPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/book/:id/update" element={<UpdateBookPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
