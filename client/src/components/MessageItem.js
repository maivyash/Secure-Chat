import React, { useState } from 'react';
import { MapPin, Shield, Lock } from 'lucide-react';
import { formatMessageTime, getInitials, getAvatarColor } from '../utils/helpers';
import './MessageItem.css';

const MessageItem = ({ message, isOwn }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`message-item ${isOwn ? 'own' : ''}`}>
      {!isOwn && (
        <div 
          className="message-avatar"
          style={{ background: getAvatarColor(message.sender.fullName) }}
        >
          {getInitials(message.sender.fullName)}
        </div>
      )}
      
      <div className="message-content-wrapper">
        {!isOwn && (
          <div className="message-sender">
            {message.sender.fullName}
            {message.sender.rank && (
              <span className="sender-rank"> • {message.sender.rank}</span>
            )}
          </div>
        )}
        
        <div className="message-bubble">
          <p className="message-text">{message.content}</p>
          
          <div className="message-footer">
            <span className="message-time">{formatMessageTime(message.timestamp)}</span>
            
            <div className="message-security">
              <Lock size={12} title="Encrypted" />
              <Shield size={12} title="VPN Secured" />
              {message.geoLocation && (
                <MapPin 
                  size={12} 
                  className="geo-icon"
                  onClick={() => setShowDetails(!showDetails)}
                  title="View location"
                />
              )}
            </div>
          </div>
        </div>
        
        {showDetails && message.geoLocation && (
          <div className="message-details">
            <div className="detail-item">
              <MapPin size={14} />
              <span>
                {message.geoLocation.city}, {message.geoLocation.country}
              </span>
            </div>
            {message.vpnTunnel && (
              <div className="detail-item">
                <Shield size={14} />
                <span>{message.vpnTunnel.routedThrough}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
