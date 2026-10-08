module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.fromEntries(Object.values(err.errors).map((e) => [e.path, e.message]));
    return res.status(400).json({ message: Object.values(errors)[0], errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const msg = `${field} already exists`;
    return res.status(409).json({ message: msg, errors: { [field]: msg } });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' });
  console.error(err);
  res.status(500).json({ message: 'Server error' });
};
