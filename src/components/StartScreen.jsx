import { useState } from 'react';

export default function StartScreen({ onStart }) {
    const [playerId, setPlayerId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (playerId.trim()) {
            onStart(playerId.trim());
        }
    };

    return (
        <div className="pixel-panel start-screen">
            <h2 className="blink">INSERT COIN</h2>
            <p>Please enter your player ID to begin</p>

            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder="Player ID"
                    style={{
                        padding: '10px',
                        fontFamily: '"Press Start 2P", cursive',
                        fontSize: '1rem',
                        border: '4px solid white',
                        backgroundColor: '#000',
                        color: '#fff',
                        marginBottom: '20px',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                    required
                />
                <br />
                <button type="submit" disabled={!playerId.trim()}>PRESS START</button>
            </form>
        </div>
    );
}
