// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

// Relative time formatting
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(d);
};

// Language detection and direction
export const detectTextDirection = (text: string): 'ltr' | 'rtl' => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text) ? 'rtl' : 'ltr';
};

// Status color mapping
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    uploaded: 'text-blue-600',
    processing: 'text-yellow-600',
    completed: 'text-green-600',
    failed: 'text-red-600',
    cancelled: 'text-gray-600',
    pending: 'text-orange-600',
    clean: 'text-green-600',
    infected: 'text-red-600',
  };
  return colors[status] || 'text-gray-600';
};

// Status background color mapping
export const getStatusBgColor = (status: string): string => {
  const colors: Record<string, string> = {
    uploaded: 'bg-blue-100',
    processing: 'bg-yellow-100',
    completed: 'bg-green-100',
    failed: 'bg-red-100',
    cancelled: 'bg-gray-100',
    pending: 'bg-orange-100',
    clean: 'bg-green-100',
    infected: 'bg-red-100',
  };
  return colors[status] || 'bg-gray-100';
};

// Validate file type
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Validate file size
export const validateFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes;
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Download file from blob
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Format subscription tier display name
export const formatSubscriptionTier = (tier: string): string => {
  const tiers: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    team: 'Team',
    enterprise: 'Enterprise',
  };
  return tiers[tier] || tier;
};

// Check if user can access feature based on subscription
export const canAccessFeature = (
  userTier: string,
  requiredTier: string
): boolean => {
  const tierLevels: Record<string, number> = {
    free: 0,
    pro: 1,
    team: 2,
    enterprise: 3,
  };
  return (tierLevels[userTier] || 0) >= (tierLevels[requiredTier] || 0);
};

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

// Format currency
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};