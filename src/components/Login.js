import React, { useState } from 'react';
import { BackgroundGradient } from './background-gradient';
import { BackgroundBeamsWithCollision } from './background-beams-with-collision';
import { TypewriterEffectSmoothDemo } from './typeWriterText';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'password123') {
            localStorage.setItem('loggedInUser', username); // Save to localStorage
            onLogin(username);
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                overflow: 'hidden',
                background: '#000000',
            }}
        >
            <BackgroundBeamsWithCollision>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '40px' 
                }}>
                    <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white dark:text-white font-sans tracking-tight">
                        Condenser!
                        <br />
                        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                <span className="">
                                    <TypewriterEffectSmoothDemo />
                                </span>
                            </div>
                            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                                <span className="">
                                    <TypewriterEffectSmoothDemo />
                                </span>
                            </div>
                        </div>
                    </h2>

                    <BackgroundGradient
                        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 w-80 max-w-sm"
                        containerClassName="rounded-3xl shadow-lg overflow-hidden"
                        animate={true}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2 style={{ marginBottom: '20px', color: '#333' }}>Login</h2>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    padding: '10px',
                                    marginBottom: '15px',
                                    width: '100%',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                                    fontSize: '16px',
                                    outline: 'none',
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    padding: '10px',
                                    marginBottom: '20px',
                                    width: '100%',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                                    fontSize: '16px',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleLogin}
                                style={{
                                    padding: '10px 20px',
                                    background: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'background 0.3s',
                                    width: '100%',
                                }}
                                onMouseOver={(e) => (e.target.style.background = '#0056b3')}
                                onMouseOut={(e) => (e.target.style.background = '#007bff')}
                            >
                                Login
                            </button>
                        </div>
                    </BackgroundGradient>
                </div>
            </BackgroundBeamsWithCollision>
        </div>
    );
};

export default Login;
