import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
    const [url, setUrl] = useState("");
    const [testScript, setTestScript] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("testHistory");
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // Save history to localStorage
    const saveToHistory = (entry) => {
        const updated = [entry, ...history.slice(0, 4)];
        setHistory(updated);
        localStorage.setItem("testHistory", JSON.stringify(updated));
    };

    const handleGenerateTest = async () => {
        setLoading(true);
        setTestScript("");
        setOutput("");
        try {
            const res = await axios.post("http://localhost:5000/api/tests/generate", {
                url,
            });
            setTestScript(res.data.testScript);
            setOutput(res.data.results.output);
            const entry = {
                url,
                script: res.data.testScript,
                output: res.data.results.output,
                date: new Date().toLocaleString(),
            };
            saveToHistory(entry);
        } catch (err) {
            setOutput("❌ Error: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const loadFromHistory = (entry) => {
        setUrl(entry.url);
        setTestScript(entry.script);
        setOutput(entry.output);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Heading */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600">🚀 AI SaaS Testing Platform</h1>
                <p className="text-gray-500 mt-2">Enter a website URL to generate and run Playwright tests with AI assistance.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Panel */}
                <div className="flex-1 bg-white shadow-lg rounded-xl p-6">
                    <label className="block mb-2 font-medium text-gray-700">🌐 Enter Website URL:</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="https://example.com"
                    />
                    <button
                        onClick={handleGenerateTest}
                        disabled={loading || !url}
                        className={`w-full mt-4 py-2 px-4 rounded-lg text-white font-semibold ${
                            loading || !url
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "⏳ Generating..." : "Generate Test"}
                    </button>

                    {/* Generated Script */}
                    {testScript && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">📝 Generated Test Script</h2>
                            <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
                {testScript}
              </pre>
                        </div>
                    )}

                    {/* Test Output */}
                    {output && (
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">📤 Test Output</h2>
                            <pre className="bg-black text-white p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
                {output}
              </pre>
                        </div>
                    )}

                    {/* Link to full history */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/history"
                            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
                        >
                            📜 View Full Test History →
                        </Link>
                    </div>
                </div>

                {/* Local History Panel */}
                <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-xl p-4">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">🕑 Recent Test History</h2>
                    {history.length === 0 ? (
                        <p className="text-sm text-gray-500">No history yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {history.map((entry, index) => (
                                <li
                                    key={index}
                                    className="border p-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                                    onClick={() => loadFromHistory(entry)}
                                >
                                    <p className="text-sm font-medium">{entry.url}</p>
                                    <p className="text-xs text-gray-500">{entry.date}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
