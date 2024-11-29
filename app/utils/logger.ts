const isDev = process.env.NODE_ENV === 'development';

export const logNetworkRequest = (url: string, method: string, body?: any) => {
  if (isDev) {
    console.log(`🌐 Network Request: ${method} ${url}`);
    if (body) {
      console.log('Request Body:', JSON.stringify(body, null, 2));
    }
  }
};

export const logNetworkResponse = (response: any) => {
  if (isDev) {
    console.log('📥 Network Response:', JSON.stringify(response.data, null, 2));
  }
};

export const logNetworkError = (error: any) => {
  if (isDev) {
    console.error('❌ Network Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
};