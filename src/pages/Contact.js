import React from 'react';

export default function Contact() {
    return (
        <section className="bg-white py-10 px-6">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <form className="max-w-md mx-auto">
            <input type="text" placeholder="Name"
            className="w-full border p-2 mb-4" />
            <input type="email" placeholder="Email"
            className="w-full border p-2 mb-4" />
            <textarea placeholder="Your message" className="w-full border p-2 mb-4" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2">Send</button>
            </form>
        </section>
    );
}
// This component serves as the contact page of the application