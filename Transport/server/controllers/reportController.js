const Report = require('../models/Report');

const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy', 'fullName');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateReport = async (req, res) => {
  try {
    // Mocking report generation
    const report = await Report.create({
      reportType: req.body.reportType,
      generatedBy: req.user._id,
      parameters: req.body.parameters,
      filePath: '/mock-path/report.pdf' // in real life this would be actual path
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getReports, generateReport };
