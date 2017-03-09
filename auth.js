const login_required = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  const url = req.originalUrl;
  res.redirect(`/login?next=${url}`);
};

module.exports = {login_required};
