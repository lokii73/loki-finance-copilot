import axios from 'axios';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If accessing from a local network IP (e.g. 192.168.x.x), dynamically point to port 8000
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('vercel.app')) {
      return `http://${hostname}:8000`;
    }
  }
  return 'http://localhost:8000';
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('stockgpt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

export const portfolioAPI = {
  getOverview: () => api.get('/portfolio/overview'),
  getHoldings: () => api.get('/portfolio/holdings'),
  getMutualFunds: () => api.get('/portfolio/mutual-funds'),
  getSIPs: () => api.get('/portfolio/sips'),
  getTransactions: () => api.get('/portfolio/transactions'),
  analyze: () => api.get('/portfolio/analyze'),
  getSnapshots: (days = 90) => api.get(`/portfolio/snapshots?days=${days}`),
};

export const stocksAPI = {
  getAll: () => api.get('/stocks/'),
  getDetail: (symbol: string) => api.get(`/stocks/${symbol}`),
};

export const mutualFundsAPI = {
  getAll: () => api.get('/mutual-funds/'),
  getDetail: (schemeCode: string) => api.get(`/mutual-funds/${schemeCode}`),
};

export const marketAPI = {
  getOverview: () => api.get('/market/overview'),
  getIndices: () => api.get('/market/indices'),
  getNews: () => api.get('/market/news'),
};

export const chatAPI = {
  sendMessage: (message: string) =>
    api.post('/chat/message', { message }),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.post('/chat/clear'),
  getSuggestions: () => api.get('/chat/suggestions'),
};

export const projectionsAPI = {
  getWealth: (monthlySip = 1325, currentValue = 2076, annualReturn = 12) =>
    api.get(`/projections/wealth?monthly_sip=${monthlySip}&current_value=${currentValue}&annual_return=${annualReturn}`),
  sipCalculator: (amount: number, returns: number, years: number) =>
    api.get(`/projections/sip-calculator?monthly_amount=${amount}&annual_return=${returns}&years=${years}`),
};

export const recommendationsAPI = {
  getAll: () => api.get('/recommendations/'),
  getActionPlan: () => api.get('/recommendations/action-plan'),
};

export const exitAlertsAPI = {
  getAll: () => api.get('/exit-alerts/'),
  getNews: () => api.get('/exit-alerts/news'),
  getDetail: (symbol: string) => api.get(`/exit-alerts/${symbol}`),
};

export const plannersAPI = {
  calculateGoal: (data: {
    goal_name: string;
    goal_amount: number;
    timeline_years: number;
    current_savings: number;
    monthly_investment: number;
    expected_return: number;
  }) => api.post('/planners/goal', data),
  calculateRetirement: (data: {
    current_age: number;
    retirement_age: number;
    desired_monthly_expense: number;
    inflation_rate: number;
    existing_investments: number;
    pre_return: number;
    post_return: number;
  }) => api.post('/planners/retirement', data),
};

export const portfolioIntelligenceAPI = {
  getIntelligence: () => api.get('/portfolio/intelligence'),
};

export const newsAPI = {
  getAll:       () => api.get('/news/'),
  getImpact:    () => api.get('/news/market-impact'),
  getSummary:   () => api.get('/news/summary'),
};

export const stockSuggestionsAPI = {
  getAll: () => api.get('/stock-suggestions/'),
};
