// Common utility function to filter data based on a search query
export const filterData = (data, searchQuery, filterFields) => {
    if (!searchQuery) {
      return data;
    }
  
    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      for (const field of filterFields) {
        const fieldValue = getValueByPath(item, field)?.toString().toLowerCase();
        if (fieldValue && fieldValue.includes(query)) {
          return true;
        }
      }
      return false;
    });
  };
  
  // Helper function to get nested object values based on the field path
  const getValueByPath = (obj, path) => {
    const keys = path.split(".");
    let value = obj;
  
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        break;
      }
    }
  
    return value;
  };
  