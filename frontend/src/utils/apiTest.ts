// Simple API test utility
export const testApiConnection = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
        const data = await response.text();
        console.log('API Response:', data);
        return response.ok;
    } catch (error) {
        console.error('API Connection Error:', error);
        return false;
    }
};

// Test the connection immediately
testApiConnection();
