const mongoose = require('mongoose');


const testResultSchema = new mongoose.Schema({
    url: { type: String, required: true },
    script: { type: String, required: true },
    output: { type: String, default: '❌ No output' }, // default value
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);



