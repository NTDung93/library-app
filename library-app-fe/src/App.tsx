import { Outlet } from 'react-router';
import './App.css';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';

export const App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />

      <div className='flex-grow-1'>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default App;