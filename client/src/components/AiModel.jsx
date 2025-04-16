import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import * as pdfjsLib from 'pdfjs-dist';
import GaugeChart from 'react-gauge-chart';
import Markdown from 'react-markdown'; // for mark down rendering
import remarkGfm from 'remark-gfm'; // Github Flavored Markdown plugin
import rehypeRaw from 'rehype-raw'; // Plugin to allow HTML in Markdown

// Assuming these components exist and handle their own styling (potentially Tailwind)
import Navbar from './shared/Navbar';
import UserHeader from './UserHeader';

// --- Configure PDF.js Worker (Vite specific import) ---
// This imports the worker file as a URL, handled by Vite's build process
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
// ---

// --- Get API Key from Environment Variable (Vite specific) ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// ---

const MODEL_NAME = "gemini-1.5-flash"; // Updated model name

function AiModel() {
    const [jobDescription, setJobDescription] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [atsScore, setAtsScore] = useState(0);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isClientInitialized, setIsClientInitialized] = useState(false);

    const genAI = useRef(null);
    const chatEndRef = useRef(null); // Ref for scrolling chat

    // --- Initialize AI Client ---
    useEffect(() => {
        if (!API_KEY) {
            setError("ERROR: Gemini API Key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file and you've restarted the server.");
            setIsClientInitialized(false);
            return;
        }
        try {
            genAI.current = new GoogleGenerativeAI(API_KEY);
            setError('');
            setIsClientInitialized(true);
            console.log("Gemini AI Initialized");
        } catch (err) {
            console.error("Error initializing Gemini AI:", err);
            setError(`Failed to initialize Gemini AI: ${err.message}. Check API Key.`);
            setIsClientInitialized(false);
        }
    }, []);

    // --- Auto-scroll Chat ---
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);


    // --- File Handling ---
    const handleResumeUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            setError('');
            extractTextFromPdf(file);
        } else {
            setError('Please upload a valid PDF file.');
            setResumeFile(null);
            setResumeText('');
            // Clear all results
            setAtsScore(0);
            setAnalysisResult('');
            setChatHistory([]);
        }
    };

    // --- PDF Text Extraction ---
    const extractTextFromPdf = async (file) => {
        if (!isClientInitialized) {
            setError("Cannot process PDF: AI Client not initialized.");
            return;
        }
        setIsLoading(true);
        // Clear previous results
        setResumeText('');
        setAtsScore(0);
        setAnalysisResult('');
        setChatHistory([]);
        setError('');

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const typedArray = new Uint8Array(event.target.result);
                    const loadingTask = pdfjsLib.getDocument({ data: typedArray });
                    const pdf = await loadingTask.promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n\n'; // Add space between pages
                    }
                    setResumeText(fullText.trim());
                    console.log("Resume Text Extracted");
                } catch (pdfError) {
                    console.error('Error parsing PDF content:', pdfError);
                    setError(`Error parsing PDF: ${pdfError.message}. It might be corrupted or password-protected.`);
                } finally {
                    setIsLoading(false); // Stop loading once done or on error
                }
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                setError('Error reading PDF file.');
                setIsLoading(false);
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error('Error setting up FileReader:', err);
            setError(`File reader error: ${err.message}`);
            setIsLoading(false);
        }
    };

    // --- Gemini API Call Function ---
    const callGeminiAPI = async (prompt, isChat = false) => {
        if (!isClientInitialized || !genAI.current) {
            setError("Gemini AI not initialized."); return null;
        }
        if (!resumeText) {
            setError("Please upload and process a resume first."); return null;
        }
        if (!jobDescription && (prompt.includes("Job Description:") || prompt.includes("job description"))) {
            setError("Please enter the Job Description for this analysis."); return null;
        }

        setIsLoading(true);
        setError('');
        // Keep analysis result during chat generation, clear only for button clicks
        if (!isChat) {
            setAnalysisResult('Generating response...');
        }

        try {
            const model = genAI.current.getGenerativeModel({ model: MODEL_NAME });
            const generationConfig = { /* ... temperature, topK, etc. ... */ };
            const safetySettings = [ /* ... */];

            const result = await model.generateContent(prompt, generationConfig, safetySettings);
            const response = result?.response;

            if (response) {
                return response.text();
            } else {
                const blockReason = response?.promptFeedback?.blockReason;
                throw new Error(`No valid response from API. ${blockReason ? `Reason: ${blockReason}` : 'Unknown reason'}`);
            }
        } catch (err) {
            console.error('Error calling Gemini API:', err);
            const errorMessage = `API Error: ${err.message || 'An unknown error occurred'}.`;
            setError(errorMessage);
            if (isChat) {
                // Add error to chat history if API call fails during chat
                setChatHistory(prev => [...prev, { role: 'model', text: `*Error: ${err.message}*` }]);
            } else {
                // Display error in main analysis area for button clicks
                setAnalysisResult(errorMessage);
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // --- Specific Analysis Functions ---
    const getSummary = async () => {
        setAtsScore(0); // Reset score display
        const prompt = `Provide a concise summary (2-3 sentences) highlighting the key qualifications and experience from the following resume text:\n\nResume Text:\n---\n${resumeText}\n---`;
        const result = await callGeminiAPI(prompt);
        if (result !== null) setAnalysisResult(result);
    };

    const getImprovements = async () => {
        setAtsScore(0);
        const prompt = `Analyze the following resume text and provide 3-5 specific, actionable suggestions for improvement. Format the suggestions clearly, perhaps using bullet points. Focus on areas like skills presentation, quantifying achievements, clarity, and structure. Mention how these improvements could better align with typical job requirements.\n\nResume Text:\n---\n${resumeText}\n---`;
        const result = await callGeminiAPI(prompt);
        if (result !== null) setAnalysisResult(result);
    };

    const getMissingKeywords = async () => {
        setAtsScore(0);
        if (!jobDescription) { setError("Please enter the Job Description first."); return; }
        const prompt = `Compare the following resume text against the job description. Identify and list key skills, technologies, or qualifications mentioned in the job description that are either missing or significantly underrepresented in the resume. Format as a list.\n\nJob Description:\n---\n${jobDescription}\n---\n\nResume Text:\n---\n${resumeText}\n---`;
        const result = await callGeminiAPI(prompt);
        if (result !== null) setAnalysisResult(result);
    };

    const getPercentageMatch = async () => {
        if (!jobDescription) { setError("Please enter the Job Description first."); return; }
        const prompt = `Analyze the alignment between the resume and job description. Consider keywords, skills, experience relevance. Provide an estimated percentage match score (integer 0-100). \n**Output Format:** Start the response *only* with "Score: [percentage]" on the first line, followed by a brief explanation.\n\nJob Description:\n---\n${jobDescription}\n---\n\nResume Text:\n---\n${resumeText}\n---`;
        const result = await callGeminiAPI(prompt);
        if (result !== null) {
            const scoreMatch = result.match(/^Score:\s*(\d+)/);
            if (scoreMatch?.[1]) {
                const score = parseInt(scoreMatch[1], 10);
                setAtsScore(Math.min(100, Math.max(0, score)));
                const explanation = result.substring(scoreMatch[0].length).trim();
                setAnalysisResult(`**ATS Score Explanation:**\n\n${explanation || '(No explanation provided)'}`);
            } else {
                setAnalysisResult(`Could not parse score from response. Raw response:\n\n${result}`);
                setAtsScore(0);
                setError("Failed to parse score from AI response.");
            }
        } else {
            setAtsScore(0);
        }
    };

    // --- Chat Functionality ---
    const handleChatSend = async () => {
        if (!chatInput.trim() || isLoading || !isClientInitialized || !resumeText) return;

        const userMessage = { role: 'user', text: chatInput };
        setChatHistory(prev => [...prev, userMessage]);
        const currentInput = chatInput;
        setChatInput('');

        const chatPrompt = `You are a helpful AI assistant analyzing a resume against a job description.\n\nCurrent Job Description Context:\n---\n${jobDescription || "N/A"}\n---\nFull Resume Text:\n---\n${resumeText}\n---\nPrevious Conversation:\n${chatHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n')}\nUser Query: ${currentInput}\n\nProvide a helpful and relevant response, using Markdown formatting where appropriate (like lists or bold text).`;

        const result = await callGeminiAPI(chatPrompt, true);
        if (result !== null) {
            setChatHistory(prev => [...prev, { role: 'model', text: result }]);
        }
        // Error handling within callGeminiAPI adds error message to chat if needed
    };


    // --- Render Logic ---

    if (!isClientInitialized && error) {
        return (
            // Basic error display if AI client fails to initialize
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-6 bg-white rounded-lg shadow-md max-w-md text-center">
                    <h1 className="text-xl font-semibold text-red-600 mb-4">Initialization Error</h1>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='conatiner'>
                <div className='navbar-conatiner'>
                    <Navbar />
                </div>
                <div className='false-nav'></div>
                <div className='router-container'>
                    <UserHeader />

                    {/* Content container for the analyzer */}
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"> {/* Wider container, responsive padding */}
                        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                            AI Resume Analyzer <span className="text-blue-600">powered by Gemini</span>
                        </h1>

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-5 rounded-lg shadow-xl flex items-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-gray-700 font-medium">Processing... Please Wait...</span>
                                </div>
                            </div>
                        )}

                        {/* Error Message Display */}
                        {error && !isLoading && (
                            <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
                                <span className="font-medium">Error:</span> {error}
                            </div>
                        )}

                        {/* Input Section: Grid Layout */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            {/* Job Description */}
                            <div className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow">
                                <label htmlFor="jd" className="block text-lg font-semibold text-gray-700 mb-1">
                                    Job Description
                                </label>
                                <textarea
                                    id="jd"
                                    rows="8" // Increased rows
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the Job Description here..."
                                    disabled={isLoading}
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Resume Upload */}
                            <div className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow">
                                <label htmlFor="resume" className="block text-lg font-semibold text-gray-700 mb-1">
                                    Upload Resume (PDF)
                                </label>
                                <input
                                    type="file"
                                    id="resume"
                                    accept=".pdf"
                                    onChange={handleResumeUpload}
                                    disabled={isLoading || !isClientInitialized}
                                    className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                {resumeFile && <p className="mt-2 text-sm text-green-600">Uploaded: <span className='font-medium'>{resumeFile.name}</span></p>}
                                {!resumeFile && !isLoading && isClientInitialized && <p className="mt-2 text-sm text-gray-500">Please upload a resume PDF to begin analysis.</p>}
                            </div>
                        </div>

                        {/* Analysis Section (Only shows if resume is processed) */}
                        {resumeText && isClientInitialized && (
                            <div className="space-y-8">
                                {/* Action Buttons */}
                                <div className="bg-white p-5 rounded-lg shadow">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Analyze Resume</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={getSummary} disabled={isLoading || !resumeText} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            Summary
                                        </button>
                                        <button onClick={getImprovements} disabled={isLoading || !resumeText} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            Improvements
                                        </button>
                                        <button onClick={getMissingKeywords} disabled={isLoading || !resumeText || !jobDescription} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            Missing Keywords
                                        </button>
                                        <button onClick={getPercentageMatch} disabled={isLoading || !resumeText || !jobDescription} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            Calculate % Match
                                        </button>
                                    </div>
                                </div>

                                {/* Results Display: Grid Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
                                    {/* Analysis Text Output */}
                                    <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow" >
                                   
                                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Analysis / Explanation</h2>
                                        <div className="max-w-none p-4 border border-gray-200 rounded bg-gray-50 min-h-[150px] max-h-[500px] overflow-y-auto">
                                       
                                            {/* Using Tailwind Prose for Markdown styling */}
                                        
                                            {analysisResult && analysisResult !== 'Generating response...' ? (

                                                <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className='no-tailwind text-justify'>
                                                    {analysisResult}
                                                </Markdown>
                        
                                            ) : analysisResult === 'Generating response...' ? (
                                                <p className="text-gray-500">Generating response...</p>
                                            ) : (
                                                <p className="text-gray-500">Click an analysis button above.</p>
                                            )}

                                
                                        </div>
                                    </div>



                                    {/* ATS Gauge */}
                                    <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow flex flex-col items-center text-center">
                                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Estimated ATS Score</h2>
                                        <div className='w-full max-w-[250px] mx-auto'>
                                            <GaugeChart
                                                id="gauge-chart"
                                                nrOfLevels={20}
                                                percent={atsScore / 100}
                                                textColor="#333"
                                                needleColor="#EF4444" // Tailwind red-500
                                                needleBaseColor="#EF4444"
                                                formatTextValue={value => `${Math.round(value)}%`}
                                                aria-label="Estimated ATS Score Gauge"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">(Based on comparison with Job Description)</p>
                                    </div>
                                </div>

                                {/* Chat Section */}
                                <div className="bg-white p-5 rounded-lg shadow">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Chat with AI about the Resume</h2>
                                    {/* Chat History */}
                                    <div className="h-96 overflow-y-auto border border-gray-200 rounded-md p-4 mb-4 bg-gray-50 flex flex-col space-y-4">
                                        {chatHistory.map((msg, index) => (
                                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`p-3 rounded-lg max-w-[80%] prose prose-sm ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800'}`}>
                                                    {/* Using Tailwind Prose for Markdown in chat */}
                                                    <Markdown className='no-tailwind' remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                                        {msg.text}
                                                    </Markdown>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Dummy div to ensure scroll pushes content up */}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Chat Input Area */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Ask something about the resume..."
                                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleChatSend()}
                                            disabled={isLoading || !resumeText}
                                            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        <button onClick={handleChatSend} disabled={isLoading || !resumeText || !chatInput.trim()} className="px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* <Footer /> */}
                </div>

            </div>
        </div>


    );
}

export default AiModel;