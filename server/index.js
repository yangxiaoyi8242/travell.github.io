// 主服务器入口文件
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';
import expenseRoutes from './routes/expense.js';
import SupabaseModel from './models/supabase-model.js';

// 创建Express应用
const app = express();

// 配置中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 配置路由
app.use('/api', expenseRoutes);

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// 启动服务器
const PORT = process.env.PORT || config.server.port;
app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口: ${PORT}`);
});