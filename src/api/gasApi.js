const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Dummy data fallback
const DUMMY_QUESTIONS = [
    { id: "AI-01", question: "生成式 AI 的主要功能是什麼？", A: "將文字轉為圖片", B: "讓機器具有自我意識", C: "產生新的文字、圖像或音訊", D: "取代人類所有工作" },
    { id: "AI-02", question: "ChatGPT 是由哪家公司開發的？", A: "OpenAI", B: "Google", C: "Microsoft", D: "Meta" },
    { id: "AI-03", question: "GPT 的全稱是什麼？", A: "Generative Pre-trained Transformer", B: "General Purpose Technology", C: "Global Positioning Tracker", D: "Graphic Processing Thread" },
    { id: "AI-04", question: "哪種技術用於將外部知識庫結合到 AI 生成內容中？", A: "RAG (檢索增強生成)", B: "Prompt Engineering", C: "Fine-tuning", D: "SQL Injection" },
    { id: "AI-05", question: "RAG 技術的主要優點之一是什麼？", A: "確保 AI 不會犯錯", B: "降低模型產生幻覺 (Hallucination)", C: "讓模型運算速度變快", D: "減少伺服器耗電量" }
];

export const fetchQuestions = async (count = 5) => {
    if (!GAS_URL) {
        console.warn("No GAS URL provided. Using dummy data.");
        return new Promise(resolve => setTimeout(() => resolve(DUMMY_QUESTIONS.slice(0, count)), 1000));
    }

    try {
        const response = await fetch(`${GAS_URL}?action=getQuestions&count=${count}`);
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (err) {
        console.error("Failed to fetch questions:", err);
        throw err;
    }
};

export const submitGameResult = async (id, answers, threshold = 3) => {
    if (!GAS_URL) {
        console.warn("No GAS URL provided. Simulating score submission.");
        return new Promise(resolve => setTimeout(() => resolve({
            success: true,
            score: 4,
            isPassed: true,
            totalQuestions: 5
        }), 1000));
    }

    try {
        const queryParams = new URLSearchParams({
            action: "submitScore",
            id: id,
            answers: JSON.stringify(answers),
            threshold: threshold
        });
        const response = await fetch(`${GAS_URL}?${queryParams.toString()}`);

        // GAS might respond with redirect, fetch follows it by default if mode is default
        const result = await response.json();
        if (result.success) {
            return result;
        } else {
            throw new Error(result.error);
        }
    } catch (err) {
        console.error("Failed to submit result:", err);
        throw err;
    }
};
