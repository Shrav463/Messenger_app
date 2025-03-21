import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        setError(''); // Clear previous errors

        try {
            await signInWithEmailAndPassword(auth, username, password);
            setUsername(''); // Clear username field
            setPassword(''); // Clear password field
            setLoading(false); // Set loading to false
            window.location.reload(); //reload the window
        } catch (err) {
            setError('Oops, incorrect credentials.');
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div className="wrapper">
            <div className="form">
                <h1 className="title">Chat Application</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email" // Use type="email" for better validation
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        placeholder="Password"
                        required
                    />
                    <div align="center">
                        <button type="submit" className="button" disabled={loading}>
                            {loading ? <span>Logging in...</span> : <span>Start chatting</span>}
                        </button>
                    </div>
                </form>
                <h1>{error}</h1>
            </div>
        </div>
    );
};

export default LoginForm;