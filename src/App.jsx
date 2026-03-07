import { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { fetchQuestions, submitGameResult } from './api/gasApi';
import './App.css';

const PASS_THRESHOLD = Number(import.meta.env.VITE_PASS_THRESHOLD) || 3;
const QUESTION_COUNT = Number(import.meta.env.VITE_QUESTION_COUNT) || 5;

function App() {
  const [gameState, setGameState] = useState('idle'); // idle, loading, playing, submitting, result
  const [playerId, setPlayerId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [resultObj, setResultObj] = useState(null);
  const [bossSeeds, setBossSeeds] = useState([]);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [gameSessionId, setGameSessionId] = useState('');
  const hasSubmittedRef = useRef(false);

  // Preload Boss Images
  useEffect(() => {
    const preloadBosses = () => {
      const seeds = [];
      for (let i = 0; i < 10; i++) {
        const seed = `boss_${Math.floor(Math.random() * 999999)}`;
        seeds.push(seed);
        const img = new Image();
        img.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
      }
      setBossSeeds(seeds);
    };
    preloadBosses();
  }, []);

  const handleStart = async (id) => {
    setPlayerId(id);
    setGameSessionId(Date.now() + '_' + Math.random().toString(36).slice(2, 8)); // 每局產生唯一 sessionId
    hasSubmittedRef.current = false;
    setGameState('loading');
    try {
      const data = await fetchQuestions(QUESTION_COUNT);
      setQuestions(data);
      setGameState('playing');
    } catch (err) {
      alert("Failed to fetch questions. Check console or CORS setup.");
      setGameState('idle');
    }
  };

  const handleGameComplete = async (answers) => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    setSubmittedAnswers(answers);
    setGameState('submitting');
    try {
      const res = await submitGameResult(playerId, answers, PASS_THRESHOLD, gameSessionId);
      setResultObj(res);
      setGameState('result');
    } catch (err) {
      alert("Failed to submit score. Check console or CORS setup.");
      hasSubmittedRef.current = false;
      setGameState('idle');
    }
  };

  const handleRetry = () => {
    hasSubmittedRef.current = false; // 重新解鎖，允許下一次提交
    setGameState('idle');
    setResultObj(null);
    setPlayerId('');
  };

  const handleHome = () => {
    hasSubmittedRef.current = false; // 重新解鎖
    setGameState('idle');
    setResultObj(null);
    setPlayerId('');
  };

  return (
    <div className="app-container">
      <h1 className="blink" style={{ marginBottom: '40px' }}>PIXEL QUIZ</h1>

      {gameState === 'idle' && <StartScreen onStart={handleStart} />}

      {gameState === 'loading' && (
        <div className="pixel-panel">
          <p className="blink">LOADING QUESTIONS...</p>
        </div>
      )}

      {gameState === 'playing' && (
        <GameScreen
          playerId={playerId}
          questions={questions}
          onComplete={handleGameComplete}
          bossSeeds={bossSeeds}
        />
      )}

      {gameState === 'submitting' && (
        <div className="pixel-panel">
          <p className="blink">CALCULATING SCORE...</p>
        </div>
      )}

      {gameState === 'result' && resultObj && (
        <ResultScreen
          result={resultObj}
          threshold={PASS_THRESHOLD}
          answers={submittedAnswers}
          questions={questions}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
    </div>
  );
}

export default App;
