// Tiles CRUD API Routes - Modern REST Implementation
import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation Schema for Tile Data
const tileSchema = z.object({
  type: z.enum(['GP', 'CERAMICS']),
  size: z.string().min(1).max(50),
  series: z.string().min(1).max(100),
  material: z.string().min(1).max(100),
  surface: z.string().min(1).max(50),
  qty: z.number().int().min(0),
  proposedSP: z.number().min(0),
  category: z.string().min(1).max(100),
  application: z.array(z.string()).min(1),
  peiRating: z.string().min(1).max(20),
  thickness: z.string().min(1).max(20),
  finish: z.string().min(1).max(50),
  image: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).optional(),
  searchTerms: z.string().optional(),
  description: z.string().optional(),
});

const updateTileSchema = tileSchema.partial();

// Helper function to log audit trail
const logAudit = async (action, entityId, adminId, changes = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity: 'TILE',
        entityId,
        adminId,
        changes: changes ? JSON.stringify(changes) : null,
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

// GET /api/tiles - Get all tiles (Public + Admin)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      type,
      category,
      surface,
      application,
      peiRating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = Math.min(parseInt(limit), 100); // Max 100 items per page

    // Build filter conditions
    const where = {
      ...(req.admin ? {} : { isActive: true }), // Show inactive only for admins
    };

    if (search) {
      where.OR = [
        { series: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { size: { contains: search, mode: 'insensitive' } },
        { searchTerms: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) where.type = type;
    if (category) where.category = category;
    if (surface) where.surface = surface;
    if (peiRating) where.peiRating = peiRating;
    if (application) where.application = { contains: application };

    // Get tiles with pagination
    const [tiles, totalCount] = await Promise.all([
      prisma.tile.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
        },
      }),
      prisma.tile.count({ where }),
    ]);

    // Transform application field from JSON string to array
    const transformedTiles = tiles.map(tile => ({
      ...tile,
      application: JSON.parse(tile.application),
      images: tile.images ? JSON.parse(tile.images) : [],
    }));

    res.json({
      success: true,
      data: transformedTiles,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
        hasNext: skip + take < totalCount,
        hasPrev: parseInt(page) > 1,
      },
    });

  } catch (error) {
    console.error('Get tiles error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch tiles',
    });
  }
});

// GET /api/tiles/:id - Get single tile
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const tile = await prisma.tile.findUnique({
      where: { id },
    });

    if (!tile) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Tile not found',
      });
    }

    // Check if tile is inactive and user is not admin
    if (!tile.isActive && !req.admin) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Tile not found',
      });
    }

    // Transform data
    const transformedTile = {
      ...tile,
      application: JSON.parse(tile.application),
      images: tile.images ? JSON.parse(tile.images) : [],
    };

    res.json({
      success: true,
      data: transformedTile,
    });

  } catch (error) {
    console.error('Get tile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch tile',
    });
  }
});

// POST /api/tiles - Create new tile (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const validatedData = tileSchema.parse(req.body);

    // Create tile
    const newTile = await prisma.tile.create({
      data: {
        ...validatedData,
        application: JSON.stringify(validatedData.application),
        images: validatedData.images ? JSON.stringify(validatedData.images) : null,
      },
    });

    // Log audit trail
    await logAudit('CREATE', newTile.id, req.admin.id, validatedData);

    // Transform response
    const transformedTile = {
      ...newTile,
      application: JSON.parse(newTile.application),
      images: newTile.images ? JSON.parse(newTile.images) : [],
    };

    res.status(201).json({
      success: true,
      message: 'Tile created successfully',
      data: transformedTile,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Create tile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create tile',
    });
  }
});

// PUT /api/tiles/:id - Update tile (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateTileSchema.parse(req.body);

    // Check if tile exists
    const existingTile = await prisma.tile.findUnique({
      where: { id },
    });

    if (!existingTile) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Tile not found',
      });
    }

    // Prepare update data
    const updateData = { ...validatedData };
    if (updateData.application) {
      updateData.application = JSON.stringify(updateData.application);
    }
    if (updateData.images) {
      updateData.images = JSON.stringify(updateData.images);
    }

    // Update tile
    const updatedTile = await prisma.tile.update({
      where: { id },
      data: updateData,
    });

    // Log audit trail
    await logAudit('UPDATE', id, req.admin.id, validatedData);

    // Transform response
    const transformedTile = {
      ...updatedTile,
      application: JSON.parse(updatedTile.application),
      images: updatedTile.images ? JSON.parse(updatedTile.images) : [],
    };

    res.json({
      success: true,
      message: 'Tile updated successfully',
      data: transformedTile,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Update tile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update tile',
    });
  }
});

// DELETE /api/tiles/:id - Delete tile (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { hardDelete = false } = req.query;

    // Check if tile exists
    const existingTile = await prisma.tile.findUnique({
      where: { id },
    });

    if (!existingTile) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Tile not found',
      });
    }

    if (hardDelete === 'true') {
      // Hard delete (permanently remove)
      await prisma.tile.delete({
        where: { id },
      });
      
      await logAudit('HARD_DELETE', id, req.admin.id);
      
      res.json({
        success: true,
        message: 'Tile permanently deleted',
      });
    } else {
      // Soft delete (mark as inactive)
      await prisma.tile.update({
        where: { id },
        data: { isActive: false },
      });
      
      await logAudit('SOFT_DELETE', id, req.admin.id);
      
      res.json({
        success: true,
        message: 'Tile deactivated successfully',
      });
    }

  } catch (error) {
    console.error('Delete tile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete tile',
    });
  }
});

// PATCH /api/tiles/:id/restore - Restore soft-deleted tile (Admin only)
router.patch('/:id/restore', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTile = await prisma.tile.update({
      where: { id },
      data: { isActive: true },
    });

    await logAudit('RESTORE', id, req.admin.id);

    // Transform response
    const transformedTile = {
      ...updatedTile,
      application: JSON.parse(updatedTile.application),
      images: updatedTile.images ? JSON.parse(updatedTile.images) : [],
    };

    res.json({
      success: true,
      message: 'Tile restored successfully',
      data: transformedTile,
    });

  } catch (error) {
    console.error('Restore tile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to restore tile',
    });
  }
});

export default router;