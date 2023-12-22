import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51OPmjiA1orUgzE3m8Ub9zQRkB40rhKdmRzx8X3JHYsgGLAKWi0Jmd8ppdlrMzROWPe8bsQhzpmIU2RY5GrtI2r4u00nGuBJhco')


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
);