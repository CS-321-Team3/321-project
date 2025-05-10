/**
 * Simple utility to parse ICS file content into event objects
 * In production, you might want to use a library like ical.js
 */
export const parseICS = (icsContent) => {
    const events = [];
    
    // Split by events (each event starts with BEGIN:VEVENT)
    const eventStrings = icsContent.split('BEGIN:VEVENT');
    
    // Skip the first element as it's the file header
    for (let i = 1; i < eventStrings.length; i++) {
      const eventString = eventStrings[i];
      
      // Extract individual properties
      const summary = extractProperty(eventString, 'SUMMARY');
      const description = extractProperty(eventString, 'DESCRIPTION');
      const location = extractProperty(eventString, 'LOCATION');
      const startDate = extractDateProperty(eventString, 'DTSTART');
      const endDate = extractDateProperty(eventString, 'DTEND');
      
      if (summary && startDate) {
        events.push({
          summary,
          description,
          location,
          start: startDate,
          end: endDate,
        });
      }
    }
    
    return events;
  };
  
  // Helper function to extract a property value from an ICS event string
  const extractProperty = (eventString, propertyName) => {
    const regex = new RegExp(`${propertyName}[^:]*:([^\\r\\n]+)`);
    const match = eventString.match(regex);
    return match ? match[1] : null;
  };
  
  // Helper function to parse ICS date strings into JavaScript Date objects
  const extractDateProperty = (eventString, propertyName) => {
    const dateString = extractProperty(eventString, propertyName);
    
    if (!dateString) return null;
    
    // Handle dates in format YYYYMMDDTHHMMSSZ
    if (dateString.includes('T')) {
      const year = parseInt(dateString.substr(0, 4));
      const month = parseInt(dateString.substr(4, 2)) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dateString.substr(6, 2));
      const hour = parseInt(dateString.substr(9, 2));
      const minute = parseInt(dateString.substr(11, 2));
      const second = parseInt(dateString.substr(13, 2));
      
      return new Date(year, month, day, hour, minute, second);
    } 
    // Handle dates in format YYYYMMDD
    else {
      const year = parseInt(dateString.substr(0, 4));
      const month = parseInt(dateString.substr(4, 2)) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dateString.substr(6, 2));
      
      return new Date(year, month, day);
    }
  };