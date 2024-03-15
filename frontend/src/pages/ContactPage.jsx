import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Footer/Footer1'
import { Link } from 'react-router-dom';
import ContactHero from '../components/Contact/ContactHero';
import Contact from "../components/Contact/Contact.jsx";


function ContactPage() {
  return (
    <div>
      <Header />
      <ContactHero />
      <Contact />
      <Footer />
    </div>
  );
}

export default ContactPage
