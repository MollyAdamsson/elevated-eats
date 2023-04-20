import React, { useState } from "react";
import axios from "axios";

const ContactCreateForm = () => {
    const [receiverId, setReceiverId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();

        axios.post('/create_private_message/', { receiver_id: receiverId, message})
        .then(response => {
            console.log('Private message created:', response.data.private_message);
            setReceiverId('');
            setMessage('');
            setError('');
        })
        .catch(error => {
            console.error('Faied to create message:', error.response.data);
            setError(error.response.data.error || 'Failed to send private message');
            });
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <h1>Send Private Message</h1>
            {error && <div>{error}</div>}
            <label>
                Message:
                <textare value={message} onChange={(e) => setMessage(e.target.value)}></textare>
                </label>
                <button type="submit">Send message</button>
        </form>
    );
}