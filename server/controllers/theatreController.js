const Theatre = require('../models/Theatre');

exports.getTheatres = async (req, res) => {
  try { res.json(await Theatre.find({})); } 
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createTheatre = async (req, res) => {
  try { res.status(201).json(await Theatre.create(req.body)); } 
  catch (error) { res.status(500).json({ message: error.message }); }
};