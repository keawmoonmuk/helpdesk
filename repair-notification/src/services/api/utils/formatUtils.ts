
/**
 * Utility functions for formatting and converting data
 */

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Format: DD/MM/YYYY HH:MM
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const mapImportanceToPriority = (importance: string): 'High' | 'Medium' | 'Low' => {
  if (!importance) return 'Medium';
  
  const upperImportance = importance?.toUpperCase() || '';
  
  if (upperImportance === 'HIGH') {
    return 'High';
  } else if (upperImportance === 'LOW') {
    return 'Low';
  }
  
  return 'Medium';
};

export const mapPriorityToImportance = (priority: string): string => {
  if (!priority) return 'MEDIUM';
  
  switch (priority) {
    case 'High':
      return 'HIGH';
    case 'Low':
      return 'LOW';
    default:
      return 'MEDIUM';
  }
};
