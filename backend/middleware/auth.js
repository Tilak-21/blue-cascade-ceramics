// JWT Authentication Middleware
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required',
      });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'blue-cascade-ceramics',
      audience: 'admin-panel',
    });

    // Check if admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
    });

    if (!admin) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Admin user not found',
      });
    }

    // Add admin info to request
    req.admin = {
      id: admin.id,
      username: admin.username,
    };

    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication failed',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      req.admin = null;
      return next();
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'blue-cascade-ceramics',
        audience: 'admin-panel',
      });

      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId },
      });

      req.admin = admin ? {
        id: admin.id,
        username: admin.username,
      } : null;
      
    } catch (tokenError) {
      // Invalid token, continue without authentication
      req.admin = null;
    }

    next();

  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    req.admin = null;
    next();
  }
};