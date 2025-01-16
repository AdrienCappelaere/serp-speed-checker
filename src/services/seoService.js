export const parseTop10URLs = (apiResponse) => {
    const items = apiResponse?.tasks?.[0]?.result?.[0]?.items || [];
    return items
      .filter((item) => item.type === "organic") // Filter organic results
      .slice(0, 10) // Get the top 10
      .map((item) => item.url); // Extract URLs
};

export const isUserURLInTop10 = (userURL, top10URLs) => top10URLs.includes(userURL);

export const prepareURLsForAnalysis = (userURL, top10URLs) => {
    if (isUserURLInTop10(userURL, top10URLs)) {
      return top10URLs; // User's URL is already in the top 10
    } else {
      return [userURL, ...top10URLs]; // Include user's URL
    }
};
