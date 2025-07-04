const fs = require("fs").promises;
const { exec } = require("child_process");
const path = require("path");

exports.runPlaywrightTest = async (testScript) => {
    console.log("▶ Running Playwright test (real execution)");

    const tempFile = path.join(__dirname, "../tempTest.js");

    try {
        // Save script to temporary file
        await fs.writeFile(tempFile, testScript);

        return new Promise((resolve, reject) => {
            exec(`npx playwright test ${tempFile}`, (error, stdout, stderr) => {
                if (error) {
                    console.error("🔥 Playwright error:", error);
                    return resolve({
                        success: false,
                        output: `❌ Test failed\n\n${stderr || stdout}`,
                    });
                }
                console.log("✅ Playwright test completed");
                resolve({
                    success: true,
                    output: `✅ Test passed\n\n${stdout}`,
                });
            });
        });
    } catch (err) {
        console.error("🔥 File write error:", err);
        return {
            success: false,
            output: "❌ Could not write test file: " + err.message,
        };
    } finally {
        // Clean up the temporary file
        try {
            await fs.unlink(tempFile);
        } catch {
            console.warn("⚠️ Failed to delete temp file");
        }
    }
};
