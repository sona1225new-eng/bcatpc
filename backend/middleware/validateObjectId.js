const mongoose = require('mongoose');

/**
 * validateObjectId — middleware that validates MongoDB ObjectId path parameters.
 * Usage: router.get('/:id', validateObjectId('id'), controller)
 */
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: '${id}' is not a valid MongoDB ObjectId.`,
    });
  }
  next();
};

module.exports = validateObjectId;
