const crypto = require('crypto');
const { encryptMessage, decryptMessage } = require('../utils/encryption');

class VPNTunnelService {
  constructor() {
    this.tunnels = new Map(); // userId -> tunnel info
    this.routes = new Map(); // tunnelId -> route info
    this.activeConnections = new Map(); // socketId -> tunnel
    this.tunnelServers = this.initializeTunnelServers();
  }

  /**
   * Initialize VPN tunnel servers (simulated global locations)
   */
  initializeTunnelServers() {
    return [
      { id: 'vpn-us-east', name: 'US East', location: 'Virginia', ip: '10.0.1.1', latency: 20 },
      { id: 'vpn-us-west', name: 'US West', location: 'California', ip: '10.0.2.1', latency: 35 },
      { id: 'vpn-eu-west', name: 'EU West', location: 'Ireland', ip: '10.0.3.1', latency: 80 },
      { id: 'vpn-eu-central', name: 'EU Central', location: 'Frankfurt', ip: '10.0.4.1', latency: 90 },
      { id: 'vpn-asia-east', name: 'Asia East', location: 'Tokyo', ip: '10.0.5.1', latency: 150 },
      { id: 'vpn-asia-south', name: 'Asia South', location: 'Singapore', ip: '10.0.6.1', latency: 180 },
      { id: 'vpn-middle-east', name: 'Middle East', location: 'Dubai', ip: '10.0.7.1', latency: 120 },
      { id: 'vpn-australia', name: 'Australia', location: 'Sydney', ip: '10.0.8.1', latency: 200 }
    ];
  }

  /**
   * Create VPN tunnel for user
   */
  createTunnel(userId, socketId, userLocation = null) {
    const tunnelId = this.generateTunnelId();
    const route = this.selectOptimalRoute(userLocation);
    const encryptionKey = this.generateEncryptionKey();
    
    const tunnel = {
      tunnelId,
      userId,
      socketId,
      route,
      encryptionKey,
      status: 'active',
      createdAt: Date.now(),
      lastActivity: Date.now(),
      bytesTransferred: 0,
      packetsTransferred: 0,
      protocol: 'AES-256-GCM',
      virtualIP: this.assignVirtualIP()
    };

    this.tunnels.set(userId, tunnel);
    this.activeConnections.set(socketId, tunnel);
    this.routes.set(tunnelId, route);

    console.log(`✅ VPN Tunnel created: ${tunnelId} for user ${userId}`);
    console.log(`   Route: ${route.map(r => r.name).join(' → ')}`);

    return tunnel;
  }

  /**
   * Generate unique tunnel ID
   */
  generateTunnelId() {
    return 'tunnel-' + crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generate encryption key for tunnel
   */
  generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Assign virtual IP address
   */
  assignVirtualIP() {
    const octet1 = 172;
    const octet2 = Math.floor(Math.random() * 16) + 16; // 172.16-31.x.x
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 256);
    return `${octet1}.${octet2}.${octet3}.${octet4}`;
  }

  /**
   * Select optimal route through VPN servers
   */
  selectOptimalRoute(userLocation = null) {
    // Select 2-4 random servers for multi-hop routing
    const hopCount = Math.floor(Math.random() * 3) + 2; // 2-4 hops
    const availableServers = [...this.tunnelServers];
    const route = [];

    for (let i = 0; i < hopCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableServers.length);
      const server = availableServers.splice(randomIndex, 1)[0];
      route.push({
        ...server,
        hopNumber: i + 1,
        entryTime: null,
        exitTime: null
      });
    }

    return route;
  }

  /**
   * Encrypt data through VPN tunnel
   */
  encryptTunnelData(tunnelId, data) {
    const tunnel = Array.from(this.tunnels.values()).find(t => t.tunnelId === tunnelId);
    
    if (!tunnel) {
      throw new Error('Tunnel not found');
    }

    // Multi-layer encryption (one layer per hop)
    let encryptedData = JSON.stringify(data);
    const route = tunnel.route;

    // Encrypt in reverse order (last hop first)
    for (let i = route.length - 1; i >= 0; i--) {
      const hop = route[i];
      const key = crypto.createHash('sha256')
        .update(tunnel.encryptionKey + hop.id)
        .digest();
      
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      
      let encrypted = cipher.update(encryptedData, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag();

      encryptedData = JSON.stringify({
        data: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        hop: hop.id
      });
    }

    // Update tunnel stats
    tunnel.bytesTransferred += Buffer.byteLength(encryptedData);
    tunnel.packetsTransferred++;
    tunnel.lastActivity = Date.now();

    return {
      tunnelId,
      encryptedData,
      route: route.map(r => ({ id: r.id, name: r.name })),
      timestamp: Date.now()
    };
  }

  /**
   * Decrypt data from VPN tunnel
   */
  decryptTunnelData(tunnelId, encryptedPacket) {
    const tunnel = Array.from(this.tunnels.values()).find(t => t.tunnelId === tunnelId);
    
    if (!tunnel) {
      throw new Error('Tunnel not found');
    }

    let decryptedData = encryptedPacket;
    const route = tunnel.route;

    // Decrypt layer by layer (first hop first)
    for (let i = 0; i < route.length; i++) {
      const hop = route[i];
      const layer = JSON.parse(decryptedData);
      
      const key = crypto.createHash('sha256')
        .update(tunnel.encryptionKey + hop.id)
        .digest();
      
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(layer.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(layer.authTag, 'hex'));
      
      let decrypted = decipher.update(layer.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      decryptedData = decrypted;
    }

    // Update tunnel stats
    tunnel.lastActivity = Date.now();

    return JSON.parse(decryptedData);
  }

  /**
   * Route message through VPN tunnel
   */
  async routeMessage(userId, message) {
    const tunnel = this.tunnels.get(userId);
    
    if (!tunnel) {
      throw new Error('No active tunnel for user');
    }

    // Simulate routing through each hop
    const routingInfo = [];
    let currentTime = Date.now();

    for (const hop of tunnel.route) {
      const entryTime = currentTime;
      const processingDelay = Math.random() * 5 + 2; // 2-7ms processing
      const exitTime = entryTime + processingDelay + hop.latency;
      
      routingInfo.push({
        server: hop.name,
        location: hop.location,
        ip: hop.ip,
        entryTime,
        exitTime,
        latency: hop.latency,
        hopNumber: hop.hopNumber
      });

      currentTime = exitTime;
    }

    // Encrypt the message through tunnel
    const encryptedPacket = this.encryptTunnelData(tunnel.tunnelId, message);

    return {
      ...encryptedPacket,
      routingInfo,
      totalLatency: currentTime - Date.now(),
      virtualIP: tunnel.virtualIP
    };
  }

  /**
   * Get tunnel info for user
   */
  getTunnelInfo(userId) {
    const tunnel = this.tunnels.get(userId);
    
    if (!tunnel) {
      return null;
    }

    return {
      tunnelId: tunnel.tunnelId,
      status: tunnel.status,
      virtualIP: tunnel.virtualIP,
      protocol: tunnel.protocol,
      route: tunnel.route.map(r => ({
        name: r.name,
        location: r.location,
        ip: r.ip,
        hopNumber: r.hopNumber
      })),
      stats: {
        bytesTransferred: tunnel.bytesTransferred,
        packetsTransferred: tunnel.packetsTransferred,
        uptime: Date.now() - tunnel.createdAt,
        lastActivity: tunnel.lastActivity
      }
    };
  }

  /**
   * Get tunnel by socket ID
   */
  getTunnelBySocket(socketId) {
    return this.activeConnections.get(socketId);
  }

  /**
   * Close tunnel
   */
  closeTunnel(userId) {
    const tunnel = this.tunnels.get(userId);
    
    if (tunnel) {
      this.tunnels.delete(userId);
      this.activeConnections.delete(tunnel.socketId);
      this.routes.delete(tunnel.tunnelId);
      
      console.log(`❌ VPN Tunnel closed: ${tunnel.tunnelId}`);
      
      return true;
    }
    
    return false;
  }

  /**
   * Refresh tunnel (change route)
   */
  refreshTunnel(userId) {
    const oldTunnel = this.tunnels.get(userId);
    
    if (!oldTunnel) {
      return null;
    }

    // Close old tunnel
    this.closeTunnel(userId);
    
    // Create new tunnel with new route
    return this.createTunnel(userId, oldTunnel.socketId);
  }

  /**
   * Get all active tunnels
   */
  getActiveTunnels() {
    return Array.from(this.tunnels.values()).map(tunnel => ({
      tunnelId: tunnel.tunnelId,
      userId: tunnel.userId,
      status: tunnel.status,
      virtualIP: tunnel.virtualIP,
      uptime: Date.now() - tunnel.createdAt,
      bytesTransferred: tunnel.bytesTransferred
    }));
  }

  /**
   * Get tunnel statistics
   */
  getTunnelStats() {
    const tunnels = Array.from(this.tunnels.values());
    
    return {
      activeTunnels: tunnels.length,
      totalBytesTransferred: tunnels.reduce((sum, t) => sum + t.bytesTransferred, 0),
      totalPacketsTransferred: tunnels.reduce((sum, t) => sum + t.packetsTransferred, 0),
      averageUptime: tunnels.length > 0 
        ? tunnels.reduce((sum, t) => sum + (Date.now() - t.createdAt), 0) / tunnels.length 
        : 0,
      tunnelServers: this.tunnelServers.length
    };
  }

  /**
   * Health check for tunnel
   */
  checkTunnelHealth(userId) {
    const tunnel = this.tunnels.get(userId);
    
    if (!tunnel) {
      return { healthy: false, reason: 'Tunnel not found' };
    }

    const timeSinceActivity = Date.now() - tunnel.lastActivity;
    const maxIdleTime = 5 * 60 * 1000; // 5 minutes

    if (timeSinceActivity > maxIdleTime) {
      return { 
        healthy: false, 
        reason: 'Tunnel idle for too long',
        idleTime: timeSinceActivity 
      };
    }

    return { 
      healthy: true, 
      uptime: Date.now() - tunnel.createdAt,
      lastActivity: timeSinceActivity 
    };
  }

  /**
   * Format bytes for display
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Export singleton instance
module.exports = new VPNTunnelService();
