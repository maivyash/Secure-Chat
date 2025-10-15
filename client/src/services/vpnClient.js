import axios from 'axios';

class VPNClient {
  constructor() {
    this.tunnel = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  /**
   * Initialize VPN tunnel connection
   */
  initializeTunnel(tunnelData) {
    this.tunnel = {
      tunnelId: tunnelData.tunnelId,
      virtualIP: tunnelData.virtualIP,
      route: tunnelData.route,
      status: tunnelData.status,
      connectedAt: Date.now()
    };
    this.isConnected = true;
    
    console.log('🔒 VPN Tunnel established:', this.tunnel.tunnelId);
    console.log('📍 Virtual IP:', this.tunnel.virtualIP);
    console.log('🛣️ Route:', this.tunnel.route.map(r => r.name).join(' → '));
    
    this.notifyListeners('tunnel:connected', this.tunnel);
  }

  /**
   * Get current tunnel info
   */
  async getTunnelInfo() {
    try {
      const response = await axios.get('/api/vpn/tunnel/info');
      return response.data;
    } catch (error) {
      console.error('Get tunnel info error:', error);
      return null;
    }
  }

  /**
   * Refresh tunnel (change route)
   */
  async refreshTunnel() {
    try {
      const response = await axios.post('/api/vpn/tunnel/refresh');
      
      if (response.data.tunnel) {
        this.tunnel = {
          ...this.tunnel,
          ...response.data.tunnel,
          connectedAt: Date.now()
        };
        
        console.log('🔄 VPN Tunnel refreshed');
        console.log('🛣️ New Route:', this.tunnel.route.map(r => r.name).join(' → '));
        
        this.notifyListeners('tunnel:refreshed', this.tunnel);
        
        return this.tunnel;
      }
    } catch (error) {
      console.error('Refresh tunnel error:', error);
      return null;
    }
  }

  /**
   * Check tunnel health
   */
  async checkHealth() {
    try {
      const response = await axios.get('/api/vpn/tunnel/health');
      return response.data;
    } catch (error) {
      console.error('Check health error:', error);
      return { healthy: false, reason: 'Connection error' };
    }
  }

  /**
   * Get available VPN servers
   */
  async getServers() {
    try {
      const response = await axios.get('/api/vpn/servers');
      return response.data.servers;
    } catch (error) {
      console.error('Get servers error:', error);
      return [];
    }
  }

  /**
   * Get tunnel statistics
   */
  getTunnelStats() {
    if (!this.tunnel) {
      return null;
    }

    return {
      tunnelId: this.tunnel.tunnelId,
      virtualIP: this.tunnel.virtualIP,
      uptime: Date.now() - this.tunnel.connectedAt,
      route: this.tunnel.route,
      status: this.tunnel.status
    };
  }

  /**
   * Format uptime for display
   */
  formatUptime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Get tunnel status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      tunnel: this.tunnel
    };
  }

  /**
   * Disconnect tunnel
   */
  disconnect() {
    if (this.tunnel) {
      console.log('❌ VPN Tunnel disconnected:', this.tunnel.tunnelId);
      this.notifyListeners('tunnel:disconnected', this.tunnel);
    }
    
    this.tunnel = null;
    this.isConnected = false;
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Notify listeners
   */
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * Get route visualization data
   */
  getRouteVisualization() {
    if (!this.tunnel || !this.tunnel.route) {
      return [];
    }

    return this.tunnel.route.map((hop, index) => ({
      id: hop.id || `hop-${index}`,
      name: hop.name,
      location: hop.location,
      hopNumber: hop.hopNumber || index + 1,
      isActive: true
    }));
  }

  /**
   * Simulate packet routing animation data
   */
  getPacketAnimation() {
    if (!this.tunnel || !this.tunnel.route) {
      return null;
    }

    const totalHops = this.tunnel.route.length;
    const animationDuration = 2000; // 2 seconds
    const hopDuration = animationDuration / totalHops;

    return {
      totalHops,
      hopDuration,
      route: this.tunnel.route.map((hop, index) => ({
        name: hop.name,
        delay: index * hopDuration,
        duration: hopDuration
      }))
    };
  }
}

// Export singleton instance
export default new VPNClient();
