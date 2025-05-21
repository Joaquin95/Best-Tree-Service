import React, { useState } from 'react';

export default function EstimateForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',  
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thanks, ${formData.name}! Your estimate request has been submitted.`);
    };

    return (
        <section className="form-container">
            <h2>Get a Free Estimate</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:
                <input type="text" name="name" value="{formData.name}" onChange={handleChange} required />
                 </label>
                 <label>Email:
                <input type="email" name="email" value="{formData.email}" onChange={handleChange} required />
                 </label>
                 <label>Phone Number:
                <input type="tel" name="phone" value="{formData.phone}" onChange={handleChange} required />
                    </label>
                    <label>Address:     
                <input type="text" name="address" value="{formData.address}" onChange={handleChange} required />
                    </label>
                <button type="submit">Submit</button>
                <p>We will contact you shortly to discuss your needs.</p>
                <p>Privacy Policy: Your information will be kept confidential.</p>
            </form>
        </section>
    );
};
// This component serves as the estimate form for the application