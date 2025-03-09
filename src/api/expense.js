// 费用申请API服务
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 费用申请相关API
const ExpenseAPI = {
  // 获取所有费用申请
  getAllExpenses() {
    return api.get('/expenses');
  },

  // 获取单个费用申请详情
  getExpenseById(id) {
    return api.get(`/expenses/${id}`);
  },

  // 创建新的费用申请
  createExpense(expenseData) {
    return api.post('/expenses', expenseData);
  },

  // 更新费用申请状态
  updateExpenseStatus(id, statusData) {
    return api.put(`/expenses/${id}/status`, statusData);
  },

  // 获取部门列表
  getDepartments() {
    return api.get('/departments');
  },

  // 获取费用类型列表
  getExpenseTypes() {
    return api.get('/expense-types');
  },

  // 上传附件
  uploadAttachment(formData) {
    return api.post('/attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default ExpenseAPI;