import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState(null); // For popup modal

    const fetchHistory = async (currentPage = 1, searchQuery = "") => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/api/tests/history?page=${currentPage}&limit=5&search=${searchQuery}`
            );
            setHistory(response.data.results);
            setTotalPages(response.data.pages);
            setPage(currentPage);
        } catch (err) {
            console.error("❌ Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(page, search);
    }, [page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchHistory(1, search); // Always start from page 1 for new search
    };

    const handlePrev = () => {
        if (page > 1) fetchHistory(page - 1, search);
    };

    const handleNext = () => {
        if (page < totalPages) fetchHistory(page + 1, search);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">📜 Test History</h1>

                {/* Search bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex mb-4 gap-2 items-center"
                >
                    <input
                        type="text"
                        placeholder="🔍 Search by URL..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Search
                    </button>
                </form>

                {/* History table */}
                {loading ? (
                    <p className="text-gray-500">Loading history...</p>
                ) : history.length === 0 ? (
                    <p className="text-gray-500 text-center">No test history found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 border text-left text-sm font-semibold text-gray-700">
                                        🌐 URL
                                    </th>
                                    <th className="py-3 px-4 border text-left text-sm font-semibold text-gray-700">
                                        📝 Result
                                    </th>
                                    <th className="py-3 px-4 border text-left text-sm font-semibold text-gray-700">
                                        🗓️ Date
                                    </th>
                                    <th className="py-3 px-4 border text-left text-sm font-semibold text-gray-700">
                                        🔎 Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {history.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="border-t hover:bg-blue-50 transition"
                                    >
                                        <td className="py-2 px-4">{item.url}</td>
                                        <td className="py-2 px-4">{item.output}</td>
                                        <td className="py-2 px-4">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={handlePrev}
                                disabled={page === 1}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                ⬅ Previous
                            </button>
                            <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
                            <button
                                onClick={handleNext}
                                disabled={page === totalPages}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next ➡
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Popup Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4 text-blue-600">Test Details</h2>
                        <p className="mb-2">
                            <strong>🌐 URL:</strong> {selectedItem.url}
                        </p>
                        <p className="mb-2">
                            <strong>🗓️ Date:</strong>{" "}
                            {new Date(selectedItem.createdAt).toLocaleString()}
                        </p>
                        <h3 className="text-lg font-semibold mt-4">📝 Script:</h3>
                        <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
              {selectedItem.script}
            </pre>
                        <h3 className="text-lg font-semibold mt-4">📤 Output:</h3>
                        <pre className="bg-black text-white p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
              {selectedItem.output}
            </pre>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
