// 根据环境配置API地址
const config = {
    // 开发环境使用本地后端
    development: {
        apiBaseUrl: 'http://localhost:3001'
    },
    // 生产环境使用相对路径（同域名）
    production: {
        apiBaseUrl: ''
    }
};

const env = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[env as keyof typeof config].apiBaseUrl; 