import React, { useState } from 'react';
import '../styles/loginpage.css';

const LoginPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Traitement de l'authentification ici
        console.log('Email:', email);
        console.log('Mot de passe:', password);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }
        // Traitement de l'inscription ici
        console.log('Inscription - Prénom:', firstName);
        console.log('Inscription - Nom:', lastName);
        console.log('Inscription - Date de naissance:', dob);
        console.log('Inscription - Email:', email);
        console.log('Inscription - Mot de passe:', password);
    };

    return (
        <div className="container">
            <h2>{isRegistering ? 'Inscription' : 'Connexion'}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="form">
                {isRegistering && (
                    <>
                        <div className="formGroup">
                            <label>Prénom:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="formGroup">
                            <label>Nom:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="formGroup">
                            <label>Date de naissance:</label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                    </>
                )}
                <div className="formGroup">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                    />
                </div>
                <div className="formGroup">
                    <label>Mot de passe:</label>
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
                        <label>Confirmer le mot de passe:</label>
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
                    {isRegistering ? 'S\'inscrire' : 'Se connecter'}
                </button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)} className="toggleButton">
                {isRegistering ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
            </button>
        </div>
    );
};

export default LoginPage;
