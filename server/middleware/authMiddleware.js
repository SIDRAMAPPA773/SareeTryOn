const requireAuth = async (req, res, next) => {
  // Bypassing Firebase authentication completely.
  // Injecting a mock global user with unlimited credits.
  req.user = {
    _id: 'global_user_id',
    firebase_uid: 'global_user',
    email: 'guest@example.com',
    name: 'Guest User',
    avatar_url: '',
    credits: 999999,
    credits_used_total: 0,
    role: 'USER',
    status: 'active',
    is_admin: true // Allow guest to access admin features if needed
  };
  next();
};

module.exports = {
  requireAuth
};
