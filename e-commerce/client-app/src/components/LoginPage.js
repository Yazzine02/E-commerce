import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginpage.css';

const LoginPage = () => {
    const API_URL = "http://localhost:5273/";

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    // Handle user registration
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords aren't identical.");
            return;
        }

        const user = {
            username,
            email,
            role: "customer", // default role
            address,
            firstName,
            lastName,
            password: password, // backend handles hashing of password
        };

        try {
            const response = await fetch(`${API_URL}api/User/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                alert('Registration successful! You can now log in.');
                setIsRegistering(false); // Redirect to login
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again later.');
        }
    };

    // Handle user login
    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = { username, password };

        try {
            const response = await fetch(`${API_URL}api/User/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const result = await response.json();

                // Save the username and role in localStorage
                localStorage.setItem('userId', result.userId);
                localStorage.setItem('username', result.username);
                localStorage.setItem('role', result.role);

                alert('Login successful!');

                // Redirect based on role
                if (result.role === 'admin') {
                    navigate('/admin');
                } else if (result.role === 'customer') {
                    navigate('/cart');
                } else {
                    alert('Unrecognized role. Please contact support.');
                }
            } else {
                const error = await response.text();
                alert(`Login failed: ${error}`);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again later.');
        }
    };


    return (
        <div className="container">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="form">
                {isRegistering && (
                    <>
                        <div className="formGroup">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="formGroup">
                            <label>First Name:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="formGroup">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="formGroup">
                            <label>Address:</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                    </>
                )}
                <div className="formGroup">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div className="formGroup">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                {isRegistering && (
                    <div className="formGroup">
                        <label>Confirm your password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>
                )}
                <button type="submit" className="button">
                    {isRegistering ? 'Register' : 'Login'}
                </button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)} className="toggleButton">
                {isRegistering ? 'Already registered ? Login' : 'First time? Register'}
            </button>
        </div>
    );
};

export default LoginPage;
