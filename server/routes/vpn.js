const express = require('express');
const router = express.Router();
const vpnTunnelService = require('../services/vpnTunnelService');
const { auth } = require('../middleware/auth');

/**
 * Get tunnel info for current user
 */
router.get('/tunnel/info', auth, (req, res) => {
  try {
    const tunnelInfo = vpnTunnelService.getTunnelInfo(req.user._id.toString());
    
    if (!tunnelInfo) {
      return res.status(404).json({ error: 'No active tunnel found' });
    }

    res.json(tunnelInfo);
  } catch (error) {
    console.error('Get tunnel info error:', error);
    res.status(500).json({ error: 'Failed to get tunnel info' });
  }
});

/**
 * Refresh tunnel (change route)
 */
router.post('/tunnel/refresh', auth, (req, res) => {
  try {
    const newTunnel = vpnTunnelService.refreshTunnel(req.user._id.toString());
    
    if (!newTunnel) {
      return res.status(404).json({ error: 'No active tunnel to refresh' });
    }

    res.json({
      message: 'Tunnel refreshed successfully',
      tunnel: {
        tunnelId: newTunnel.tunnelId,
        virtualIP: newTunnel.virtualIP,
        route: newTunnel.route.map(r => ({
          name: r.name,
          location: r.location,
          hopNumber: r.hopNumber
        }))
      }
    });
  } catch (error) {
    console.error('Refresh tunnel error:', error);
    res.status(500).json({ error: 'Failed to refresh tunnel' });
  }
});

/**
 * Check tunnel health
 */
router.get('/tunnel/health', auth, (req, res) => {
  try {
    const health = vpnTunnelService.checkTunnelHealth(req.user._id.toString());
    res.json(health);
  } catch (error) {
    console.error('Check tunnel health error:', error);
    res.status(500).json({ error: 'Failed to check tunnel health' });
  }
});

/**
 * Get all active tunnels (admin only)
 */
router.get('/tunnels/active', auth, (req, res) => {
  try {
    // Check if user is HQ staff
    if (req.user.role !== 'hq_staff') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const activeTunnels = vpnTunnelService.getActiveTunnels();
    res.json({ tunnels: activeTunnels });
  } catch (error) {
    console.error('Get active tunnels error:', error);
    res.status(500).json({ error: 'Failed to get active tunnels' });
  }
});

/**
 * Get tunnel statistics (admin only)
 */
router.get('/tunnels/stats', auth, (req, res) => {
  try {
    // Check if user is HQ staff
    if (req.user.role !== 'hq_staff') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = vpnTunnelService.getTunnelStats();
    res.json(stats);
  } catch (error) {
    console.error('Get tunnel stats error:', error);
    res.status(500).json({ error: 'Failed to get tunnel stats' });
  }
});

/**
 * Get available VPN servers
 */
router.get('/servers', auth, (req, res) => {
  try {
    const servers = vpnTunnelService.tunnelServers;
    res.json({ servers });
  } catch (error) {
    console.error('Get VPN servers error:', error);
    res.status(500).json({ error: 'Failed to get VPN servers' });
  }
});

module.exports = router;
