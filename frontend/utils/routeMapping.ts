/**
 * Maps category labels to their corresponding route paths
 * This handles any discrepancies between the displayed category names
 * and the actual route paths used in the application
 */
export const getCategoryRoutePath = (categoryLabel: string): string => {
  // Convert the category label to lowercase for route matching
  const normalizedLabel = categoryLabel.toLowerCase();
  
  // Map special cases where the route name differs from the category label
  const routeMapping: Record<string, string> = {
    'smart home': 'smart-home',
    'solar services': 'solar-services',
    // Add more mappings as needed if other discrepancies exist
  };
  
  // Return the mapped path if it exists, otherwise use the normalized label
  return routeMapping[normalizedLabel] || normalizedLabel;
};

/**
 * Maps service names to their corresponding route paths
 * For use in the top rated services section
 */
export const getServiceRoutePath = (serviceName: string): string => {
  const normalizedName = serviceName.toLowerCase();
  
  const serviceMapping: Record<string, string> = {
    // Add mappings for top rated services if needed
  };
  
  return serviceMapping[normalizedName] || normalizedName;
};
