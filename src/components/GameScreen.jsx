import { useState } from 'react';

export default function GameScreen({ playerId, questions, onComplete, bossSeeds }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    if (!questions || questions.length === 0) {
        return <div className="pixel-panel">Loading questions...</div>;
    }

    const currentQ = questions[currentIndex];
    // Ensure we have a valid index for boss seeds
    const bossSeed = bossSeeds && bossSeeds.length > 0
        ? bossSeeds[currentIndex % bossSeeds.length]
        : `${playerId}_${currentIndex}`;

    const bossUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${bossSeed}`;

    const handleSelect = (option) => {
        const newAnswers = { ...answers, [currentQ.id]: option };
        if (currentIndex + 1 < questions.length) {
            setAnswers(newAnswers);
            setCurrentIndex(currentIndex + 1);
        } else {
            // Provide the final answers immediately 
            onComplete(newAnswers);
        }
    };

    return (
        <div className="pixel-panel game-screen" style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
            <div className="status-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.8rem' }}>
                <span>PLAYER: {playerId}</span>
                <span>STAGE: {currentIndex + 1}/{questions.length}</span>
            </div>

            <div className="boss-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                    src={bossUrl}
                    alt="Boss"
                    width="150"
                    height="150"
                    style={{ imageRendering: 'pixelated', border: '4px solid #fff', backgroundColor: '#333' }}
                />
            </div>

            <div className="question-box" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#000', border: '2px solid #fff', textAlign: 'left' }}>
                <h3 style={{ margin: '0', fontSize: '1.2rem', color: 'var(--primary-color)' }}>Question {currentIndex + 1} <span style={{fontSize: '0.8rem', color: '#ccc'}}>({currentQ.id})</span></h3>
                <p style={{ marginTop: '15px', fontSize: '1rem', lineHeight: '1.6' }}>{currentQ.question}</p>
            </div>

            <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {['A', 'B', 'C', 'D'].map((opt) => (
                    currentQ[opt] && (
                        <button key={opt} onClick={() => handleSelect(opt)} style={{ textAlign: 'left', minHeight: '60px' }}>
                            {opt}. {currentQ[opt]}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
}
