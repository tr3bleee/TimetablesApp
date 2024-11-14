export const logNetworkRequest = (url: string, method: string, body?: any) => {
  console.log(`🌐 Network Request: ${method} ${url}`);
  if (body) {
    console.log('Request Body:', JSON.stringify(body, null, 2));
  }
};

export const logNetworkResponse = (response: any) => {
  console.log('📥 Network Response:', JSON.stringify(response.data, null, 2));
};

export const logNetworkError = (error: any) => {
  console.error('❌ Network Error:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
  });
};