const { generateTestWithAI } = require("../services/aiAgentService");
const { runPlaywrightTest } = require("../services/playwrightService");
const TestResult = require("../models/TestResult"); // Import MongoDB model

exports.generateTestSuite = async (req, res) => {
    try {
        const { url } = req.body;
        console.log("🔍 URL received:", url);

        // Generate test script
        const testScript = await generateTestWithAI(url);
        if (!testScript) throw new Error("AI failed to generate test script");

        console.log("✅ Test script generated");

        // Run the test (mocked or real)
        const results = await runPlaywrightTest(testScript);
        console.log("✅ Playwright test executed");

        // Save to DB
        const testResult = new TestResult({
            url,
            script: testScript || "// No script generated", // 👈 Ensure script is not undefined
            output: results.output || "❌ No output",
        });
        await testResult.save();

        res.status(200).json({
            success: true,
            testScript,
            results
        });
    } catch (err) {
        console.error("🔥 ERROR:", err);
        res.status(500).json({
            error: "Test generation failed",
            details: err.message
        });
    }
};

exports.getTestHistory = async (req, res) => {
    try {
        // Get query params for pagination
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = parseInt(req.query.limit) || 10; // Default limit = 10

        const skip = (page - 1) * limit;

        // Fetch total count for frontend
        const total = await TestResult.countDocuments();

        // Fetch paginated results
        const history = await TestResult.find()
            .sort({ createdAt: -1 }) // Most recent first
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            count: history.length,
            data: history
        });
    } catch (err) {
        console.error("🔥 ERROR fetching history:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch test history",
            error: err.message
        });
    }
};