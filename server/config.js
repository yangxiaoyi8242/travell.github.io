// 数据库和服务器配置
const config = {
  // 数据库配置
  database: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'expense_control_system'
  },
  // 服务器配置
  server: {
    port: 3000,
    jwtSecret: 'your-secret-key',
    jwtExpiration: '24h'
  }
};

export default config;