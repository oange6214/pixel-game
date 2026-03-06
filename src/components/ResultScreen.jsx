export default function ResultScreen({ result, threshold, questions, answers, onRetry, onHome }) {
    const isPassed = result.isPassed;

    return (
        <div className="pixel-panel result-screen" style={{ textAlign: 'center', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <h2 className={isPassed ? 'blink' : ''} style={{ color: isPassed ? '#4ade80' : '#f87171', fontSize: '2.5rem', textShadow: '4px 4px 0px #000' }}>
                {isPassed ? 'STAGE CLEAR' : 'GAME OVER'}
            </h2>

            <div style={{ margin: '30px 0', fontSize: '1.2rem', backgroundColor: '#000', padding: '20px', border: '4px solid #fff' }}>
                <p style={{ marginBottom: '15px' }}>SCORE: {result.score} / {result.totalQuestions}</p>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>TARGET: {threshold}</p>
            </div>

            <div style={{ margin: '30px 0', textAlign: 'left', backgroundColor: '#111', padding: '15px', border: '2px solid #555' }}>
                <h3 style={{ borderBottom: '2px solid #555', paddingBottom: '10px', marginBottom: '15px' }}>REVIEW</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {questions.map((q, idx) => {
                        const userAns = answers[q.id];
                        const isCorrect = userAns === q.answer;
                        return (
                            <li key={q.id} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px dashed #444' }}>
                                <div style={{ marginBottom: '8px', color: '#fff' }}>
                                    <span style={{ color: 'var(--primary-color)' }}>Q{idx + 1}.</span> {q.question}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: isCorrect ? '#4ade80' : '#f87171' }}>
                                    <strong>Your Answer:</strong> {userAns} {userAns ? `(${q[userAns]})` : '(No answer)'}
                                    {!isCorrect && q.answer && (
                                        <div style={{ color: '#4ade80', marginTop: '5px' }}>
                                            <strong>Correct:</strong> {q.answer} ({q[q.answer]})
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <button onClick={onRetry}>TRY AGAIN</button>
                <button onClick={onHome} style={{ backgroundColor: '#555', color: '#fff', borderColor: '#ccc' }}>BACK TO TITLE</button>
            </div>
        </div>
    );
}
