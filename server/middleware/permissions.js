import Permission from '../models/Permission.js';

export const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'superadmin') {
        return next();
      }

      if (req.user.role === 'customer') {
        return res.status(403).json({
          message: 'Access denied. This action requires administrative privileges.'
        });
      }

      if (req.user.role === 'admin') {
        const userPermissions = await Permission.findOne({ userId: req.user._id });

        if (!userPermissions) {
          return res.status(403).json({
            message: 'Access denied. No permissions assigned to this admin account.'
          });
        }

        if (!userPermissions.permissions[resource] ||
            !userPermissions.permissions[resource][action]) {
          return res.status(403).json({
            message: `Access denied. You don't have permission to ${action} ${resource}.`
          });
        }

        req.userPermissions = userPermissions.permissions;
        return next();
      }

      return res.status(403).json({ message: 'Access denied. Invalid role.' });

    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ message: 'Server error checking permissions' });
    }
  };
};

export const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({
      message: 'Access denied. SuperAdmin privileges required.'
    });
  }
  next();
};

export const adminOrSuperAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      message: 'Access denied. Admin or SuperAdmin privileges required.'
    });
  }
  next();
};

export const getUserPermissions = async (userId) => {
  try {
    const permissions = await Permission.findOne({ userId });
    return permissions ? permissions.permissions : null;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return null;
  }
};
