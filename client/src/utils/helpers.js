import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

// Format timestamp for messages
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MMM dd, HH:mm');
  }
};

// Format relative time
export const formatRelativeTime = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

// Get role badge color
export const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'hq_staff':
      return 'badge-red';
    case 'military_personnel':
      return 'badge-green';
    case 'family_member':
      return 'badge-blue';
    default:
      return 'badge-yellow';
  }
};

// Get role display name
export const getRoleDisplayName = (role) => {
  switch (role) {
    case 'hq_staff':
      return 'HQ Staff';
    case 'military_personnel':
      return 'Military';
    case 'family_member':
      return 'Family';
    default:
      return role;
  }
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'online':
      return 'status-online';
    case 'away':
      return 'status-away';
    case 'offline':
      return 'status-offline';
    default:
      return 'status-offline';
  }
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Generate avatar color from name
export const getAvatarColor = (name) => {
  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
