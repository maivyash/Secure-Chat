import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Activity, MapPin, Clock, Zap } from 'lucide-react';
import vpnClient from '../services/vpnClient';
import './VPNStatus.css';

const VPNStatus = () => {
  const [tunnel, setTunnel] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Get initial tunnel status
    const status = vpnClient.getStatus();
    if (status.tunnel) {
      setTunnel(status.tunnel);
    }

    // Listen for tunnel events
    const handleTunnelConnected = (tunnelData) => {
      setTunnel(tunnelData);
    };

    const handleTunnelRefreshed = (tunnelData) => {
      setTunnel(tunnelData);
      setIsRefreshing(false);
    };

    vpnClient.on('tunnel:connected', handleTunnelConnected);
    vpnClient.on('tunnel:refreshed', handleTunnelRefreshed);

    // Update uptime every second
    const uptimeInterval = setInterval(() => {
      if (tunnel) {
        setUptime(Date.now() - tunnel.connectedAt);
      }
    }, 1000);

    return () => {
      vpnClient.off('tunnel:connected', handleTunnelConnected);
      vpnClient.off('tunnel:refreshed', handleTunnelRefreshed);
      clearInterval(uptimeInterval);
    };
  }, [tunnel]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await vpnClient.refreshTunnel();
  };

  if (!tunnel) {
    return (
      <div className="vpn-status disconnected">
        <Shield size={16} />
        <span>VPN Disconnected</span>
      </div>
    );
  }

  return (
    <div className="vpn-status-container">
      <div 
        className="vpn-status connected"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="vpn-status-indicator">
          <Shield size={16} className="vpn-icon" />
          <span className="vpn-label">VPN Secured</span>
        </div>
        <div className="vpn-status-ip">
          <Zap size={12} />
          <span>{tunnel.virtualIP}</span>
        </div>
      </div>

      {showDetails && (
        <div className="vpn-details">
          <div className="vpn-details-header">
            <h4>VPN Tunnel Details</h4>
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={isRefreshing ? 'spinning' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Route'}
            </button>
          </div>

          <div className="vpn-info-grid">
            <div className="vpn-info-item">
              <div className="vpn-info-label">
                <Shield size={14} />
                Tunnel ID
              </div>
              <div className="vpn-info-value tunnel-id">
                {tunnel.tunnelId.substring(0, 16)}...
              </div>
            </div>

            <div className="vpn-info-item">
              <div className="vpn-info-label">
                <Zap size={14} />
                Virtual IP
              </div>
              <div className="vpn-info-value">
                {tunnel.virtualIP}
              </div>
            </div>

            <div className="vpn-info-item">
              <div className="vpn-info-label">
                <Clock size={14} />
                Uptime
              </div>
              <div className="vpn-info-value">
                {vpnClient.formatUptime(uptime)}
              </div>
            </div>

            <div className="vpn-info-item">
              <div className="vpn-info-label">
                <Activity size={14} />
                Status
              </div>
              <div className="vpn-info-value">
                <span className="status-badge active">Active</span>
              </div>
            </div>
          </div>

          <div className="vpn-route">
            <div className="vpn-route-header">
              <MapPin size={14} />
              <span>Routing Path</span>
            </div>
            <div className="vpn-route-path">
              {tunnel.route.map((hop, index) => (
                <React.Fragment key={hop.hopNumber || index}>
                  <div className="vpn-hop">
                    <div className="vpn-hop-number">{hop.hopNumber || index + 1}</div>
                    <div className="vpn-hop-info">
                      <div className="vpn-hop-name">{hop.name}</div>
                      <div className="vpn-hop-location">{hop.location}</div>
                    </div>
                  </div>
                  {index < tunnel.route.length - 1 && (
                    <div className="vpn-route-arrow">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="vpn-security-info">
            <Shield size={14} />
            <span>Multi-layer AES-256-GCM encryption active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPNStatus;
