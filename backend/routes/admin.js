// Admin Dashboard Routes
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/dashboard - Dashboard Statistics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const [
      totalTiles,
      activeTiles,
      inactiveTiles,
      recentTiles,
      categoryCounts,
      typeCounts,
      recentAuditLogs,
      inventoryStats,
    ] = await Promise.all([
      // Total tiles count
      prisma.tile.count(),
      
      // Active tiles count
      prisma.tile.count({ where: { isActive: true } }),
      
      // Inactive tiles count  
      prisma.tile.count({ where: { isActive: false } }),
      
      // Recent tiles (last 7 days)
      prisma.tile.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Category distribution
      prisma.tile.groupBy({
        by: ['category'],
        _count: { category: true },
        where: { isActive: true },
        orderBy: { _count: { category: 'desc' } },
        take: 10,
      }),
      
      // Type distribution
      prisma.tile.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { isActive: true },
      }),
      
      // Recent audit logs
      prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
      
      // Inventory statistics
      prisma.tile.aggregate({
        _sum: { qty: true, proposedSP: true },
        _avg: { proposedSP: true },
        _min: { proposedSP: true },
        _max: { proposedSP: true },
        where: { isActive: true },
      }),
    ]);

    // Calculate total inventory value
    const tiles = await prisma.tile.findMany({
      where: { isActive: true },
      select: { qty: true, proposedSP: true },
    });
    
    const totalInventoryValue = tiles.reduce((sum, tile) => {
      return sum + (tile.qty * tile.proposedSP);
    }, 0);

    res.json({
      success: true,
      data: {
        overview: {
          totalTiles,
          activeTiles,
          inactiveTiles,
          recentTiles,
          totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
        },
        categories: categoryCounts.map(item => ({
          category: item.category,
          count: item._count.category,
        })),
        types: typeCounts.map(item => ({
          type: item.type,
          count: item._count.type,
        })),
        inventory: {
          totalQuantity: inventoryStats._sum.qty || 0,
          averagePrice: Math.round((inventoryStats._avg.proposedSP || 0) * 100) / 100,
          minPrice: inventoryStats._min.proposedSP || 0,
          maxPrice: inventoryStats._max.proposedSP || 0,
          totalValue: totalInventoryValue,
        },
        recentActivity: recentAuditLogs.map(log => ({
          id: log.id,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
          timestamp: log.timestamp,
          changes: log.changes ? JSON.parse(log.changes) : null,
        })),
      },
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch dashboard data',
    });
  }
});

// GET /api/admin/audit-logs - Get audit logs with pagination
router.get('/audit-logs', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      action,
      entity,
      startDate,
      endDate,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = Math.min(parseInt(limit), 100);

    // Build filter conditions
    const where = {};
    
    if (action) where.action = action;
    if (entity) where.entity = entity;
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [logs, totalCount] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs.map(log => ({
        ...log,
        changes: log.changes ? JSON.parse(log.changes) : null,
      })),
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
    console.error('Audit logs error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch audit logs',
    });
  }
});

// GET /api/admin/analytics - Analytics data
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    let days = 30;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      default: days = 30;
    }
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      tilesCreatedOverTime,
      categoryTrends,
      priceRangeDistribution,
      inventoryTrends,
    ] = await Promise.all([
      // Tiles created over time
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM tiles 
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
      
      // Category trends
      prisma.tile.groupBy({
        by: ['category'],
        _count: { category: true },
        _avg: { proposedSP: true },
        _sum: { qty: true },
        where: {
          isActive: true,
          createdAt: { gte: startDate },
        },
      }),
      
      // Price range distribution
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN proposedSP < 20 THEN 'Under $20'
            WHEN proposedSP < 40 THEN '$20-40'
            WHEN proposedSP < 60 THEN '$40-60'
            WHEN proposedSP < 100 THEN '$60-100'
            ELSE 'Over $100'
          END as priceRange,
          COUNT(*) as count,
          AVG(proposedSP) as avgPrice
        FROM tiles 
        WHERE isActive = 1
        GROUP BY priceRange
        ORDER BY avgPrice ASC
      `,
      
      // Inventory value trends
      prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          SUM(qty * proposedSP) as totalValue,
          SUM(qty) as totalQuantity
        FROM tiles 
        WHERE createdAt >= ${startDate} AND isActive = 1
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
    ]);

    res.json({
      success: true,
      data: {
        period,
        tilesCreatedOverTime,
        categoryTrends: categoryTrends.map(item => ({
          category: item.category,
          count: item._count.category,
          averagePrice: Math.round((item._avg.proposedSP || 0) * 100) / 100,
          totalQuantity: item._sum.qty || 0,
        })),
        priceRangeDistribution,
        inventoryTrends,
      },
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch analytics data',
    });
  }
});

// GET /api/admin/export - Export tiles data
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const { format = 'json', includeInactive = false } = req.query;
    
    const where = includeInactive === 'true' ? {} : { isActive: true };
    
    const tiles = await prisma.tile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Transform data
    const transformedTiles = tiles.map(tile => ({
      ...tile,
      application: JSON.parse(tile.application),
      images: tile.images ? JSON.parse(tile.images) : [],
    }));

    if (format === 'csv') {
      // Simple CSV export
      const headers = [
        'ID', 'Type', 'Series', 'Material', 'Size', 'Surface', 'Category',
        'Quantity', 'Price', 'PEI Rating', 'Thickness', 'Finish', 'Applications',
        'Active', 'Created At', 'Updated At'
      ];
      
      let csvContent = headers.join(',') + '\n';
      
      transformedTiles.forEach(tile => {
        const row = [
          tile.id,
          tile.type,
          `"${tile.series}"`,
          `"${tile.material}"`,
          tile.size,
          tile.surface,
          `"${tile.category}"`,
          tile.qty,
          tile.proposedSP,
          tile.peiRating,
          tile.thickness,
          tile.finish,
          `"${tile.application.join('; ')}"`,
          tile.isActive,
          tile.createdAt.toISOString(),
          tile.updatedAt.toISOString(),
        ];
        csvContent += row.join(',') + '\n';
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="tiles-export-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else {
      // JSON export
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="tiles-export-${new Date().toISOString().split('T')[0]}.json"`);
      res.json({
        exportDate: new Date().toISOString(),
        totalRecords: transformedTiles.length,
        data: transformedTiles,
      });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to export data',
    });
  }
});

export default router;