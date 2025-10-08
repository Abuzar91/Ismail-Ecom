import express from 'express';
import { authenticate, superAdminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Permission from '../models/Permission.js';

const router = express.Router();

router.get('/', authenticate, superAdminOnly, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status
    } = req.query;

    const query = { role: 'admin' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const admins = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const adminsWithPermissions = await Promise.all(
      admins.map(async (admin) => {
        const permissions = await Permission.findOne({ userId: admin._id });
        return {
          ...admin.toJSON(),
          permissions: permissions ? permissions.permissions : null,
          hasPermissions: !!permissions
        };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      admins: adminsWithPermissions,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Server error fetching admins' });
  }
});

router.get('/:id', authenticate, superAdminOnly, async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.params.id,
      role: 'admin'
    }).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const permissions = await Permission.findOne({ userId: admin._id });

    res.json({
      success: true,
      admin: {
        ...admin.toJSON(),
        permissions: permissions ? permissions.permissions : null
      }
    });

  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error fetching admin' });
  }
});

router.post('/', authenticate, superAdminOnly, async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const admin = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin'
    });

    await admin.save();

    if (permissions) {
      const adminPermissions = new Permission({
        userId: admin._id,
        permissions,
        grantedBy: req.user._id
      });
      await adminPermissions.save();
    }

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error creating admin' });
  }
});

router.put('/:id', authenticate, superAdminOnly, async (req, res) => {
  try {
    const { name, email, isActive } = req.body;

    const admin = await User.findOne({
      _id: req.params.id,
      role: 'admin'
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (email && email !== admin.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Admin updated successfully',
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error updating admin' });
  }
});

router.put('/:id/permissions', authenticate, superAdminOnly, async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions) {
      return res.status(400).json({ message: 'Permissions are required' });
    }

    const admin = await User.findOne({
      _id: req.params.id,
      role: 'admin'
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    let adminPermissions = await Permission.findOne({ userId: admin._id });

    if (adminPermissions) {
      adminPermissions.permissions = permissions;
      adminPermissions.grantedBy = req.user._id;
      await adminPermissions.save();
    } else {
      adminPermissions = new Permission({
        userId: admin._id,
        permissions,
        grantedBy: req.user._id
      });
      await adminPermissions.save();
    }

    res.json({
      success: true,
      message: 'Admin permissions updated successfully',
      permissions: adminPermissions.permissions
    });

  } catch (error) {
    console.error('Update admin permissions error:', error);
    res.status(500).json({ message: 'Server error updating permissions' });
  }
});

router.delete('/:id', authenticate, superAdminOnly, async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.params.id,
      role: 'admin'
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await Permission.deleteOne({ userId: admin._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error deleting admin' });
  }
});

router.post('/create-superadmin', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    if (secretKey !== process.env.SUPERADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: 'SuperAdmin already exists' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const superadmin = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'superadmin'
    });

    await superadmin.save();

    res.json({
      success: true,
      message: 'SuperAdmin created successfully',
      user: {
        id: superadmin._id,
        name: superadmin.name,
        email: superadmin.email,
        role: superadmin.role
      }
    });

  } catch (error) {
    console.error('Create superadmin error:', error);
    res.status(500).json({ message: 'Server error creating superadmin' });
  }
});

export default router;
