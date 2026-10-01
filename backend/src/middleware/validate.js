const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName] || req.body[paramName] || req.query[paramName];
    if (id && typeof id === 'string' && process.env.DATABASE_ENABLED === 'true') {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ID format for ${paramName}`
        });
      }
    }
    next();
  };
};

module.exports = { validateObjectId };
