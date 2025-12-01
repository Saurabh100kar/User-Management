const getServerUrl = () => {
  return import.meta.env.VITE_API_URL;
};

export const fetchGenderAnalytics = async () => {
  const response = await fetch(`${getServerUrl()}/analytics/gender`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchMonthlyUsersAnalytics = async () => {
  const response = await fetch(`${getServerUrl()}/analytics/monthly-users`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchEmailDomainsAnalytics = async () => {
  const response = await fetch(`${getServerUrl()}/analytics/email-domains`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

