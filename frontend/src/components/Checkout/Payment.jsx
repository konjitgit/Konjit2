
import React, { useState } from 'react';
import './payment.css'
const Payment = () => {
  const [txRef, setTxRef] = useState(generateUniqueTxRef());
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };
  function generateUniqueTxRef() {
    return `negade-tx-${Date.now()}${Math.random().toString(36).substring(7)}`;
  }

  return (
    <div className="app">

    
      <form className="payment-form" method="POST" action="https://api.chapa.co/v1/hosted/pay">
      <h1 className="payment-form__title">Payment Form</h1>

      <input type="hidden" name="public_key" value="CHAPUBK_TEST-VBKHiQBD39y6aQCJsk7pL7iijVcqHjfw" />

        <label htmlFor="amount" className="payment-form__label">Amount</label>
        <input type="text" id="amount" className="payment-form__input" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label htmlFor="currency" className="payment-form__label">Currency</label>
        <select id="currency" className="payment-form__input" name="currency" value={selectedCurrency} onChange={handleCurrencyChange}>
          <option value="">Select Currency</option>
          <option value="ETB">ETB</option>
          <option value="USD">USD</option>
        </select>

        <label htmlFor="txRef" className="payment-form__label">Your UniqueTransaction Reference</label>
      <input type="text" id="txRef" className="payment-form__input" name="tx_ref" value={txRef} readOnly />


        <label htmlFor="email" className="payment-form__label">Email</label>
        <input type="text" id="email" className="payment-form__input" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        

        <label htmlFor="title" className="payment-form__label">Title</label>
        <input type="text" id="title" className="payment-form__input" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label htmlFor="description" className="payment-form__label">Description</label>
        <input type="text" id="description" className="payment-form__input" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <input type="hidden" name="logo" value="https://chapa.link/asset/images/chapa_swirl.svg" />
        <input type="hidden" name="callback_url" value="https://example.com/callbackurl" />
        <input type="hidden" name="return_url" value="https://konjit2-pous.vercel.app/" />
        <input type="hidden" name="meta[title]" value="test" />

        <button type="submit" className="payment-form__button">Pay Now</button>
      </form>
    </div>
  );
}


export default Payment