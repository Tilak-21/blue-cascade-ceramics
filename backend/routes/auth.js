// Authentication Routes - Modern JWT Implementation
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Validation Schemas
const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

// Initialize Admin User (Run once)
const initializeAdmin = async () => {
  try {
    const adminExists = await prisma.admin.findUnique({
      where: { username: process.env.ADMIN_USERNAME }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      
      await prisma.admin.create({
        data: {
          username: process.env.ADMIN_USERNAME,
          password: hashedPassword,
        },
      });
      
      console.log('✅ Admin user initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
  }
};

// Initialize admin on startup
initializeAdmin();

// POST /api/auth/login - Admin Login
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(req.body);

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password incorrect',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password incorrect',
      });
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        username: admin.username,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'blue-cascade-ceramics',
        audience: 'admin-panel',
      }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        lastLogin: admin.lastLogin,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Login failed',
    });
  }
});

// POST /api/auth/verify - Verify JWT Token
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid token provided',
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'blue-cascade-ceramics',
      audience: 'admin-panel',
    });

    // Check if admin still exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
    });

    if (!admin) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Admin user not found',
      });
    }

    res.json({
      valid: true,
      admin: {
        id: admin.id,
        username: admin.username,
        lastLogin: admin.lastLogin,
      },
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }

    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Token verification failed',
    });
  }
});

// POST /api/auth/logout - Logout (Client-side token removal)
router.post('/logout', (req, res) => {
  // Since JWT is stateless, logout is handled client-side by removing the token
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;