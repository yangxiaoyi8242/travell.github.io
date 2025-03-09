// 费用申请数据模型
import mysql from 'mysql2/promise';
import config from '../config.js';

// 创建数据库连接池
const pool = mysql.createPool(config.database);

// 费用申请模型
const ExpenseModel = {
  // 获取所有费用申请
  async getAllExpenses() {
    try {
      const [rows] = await pool.query('SELECT * FROM expense_applications ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('获取费用申请列表失败:', error);
      throw error;
    }
  },

  // 获取单个费用申请详情
  async getExpenseById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM expense_applications WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('获取费用申请详情失败:', error);
      throw error;
    }
  },

  // 创建新的费用申请
  async createExpense(expenseData) {
    try {
      const { applicantName, department, expenseType, amount, purpose, startDate, endDate, remark } = expenseData;
      
      const [result] = await pool.query(
        'INSERT INTO expense_applications (applicant_name, department, expense_type, amount, purpose, start_date, end_date, remark, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [applicantName, department, expenseType, amount, purpose, startDate, endDate, remark, 'pending']
      );
      
      return {
        id: result.insertId,
        ...expenseData,
        status: 'pending'
      };
    } catch (error) {
      console.error('创建费用申请失败:', error);
      throw error;
    }
  },

  // 更新费用申请状态
  async updateExpenseStatus(id, status, comment) {
    try {
      const [result] = await pool.query(
        'UPDATE expense_applications SET status = ?, approval_comment = ?, updated_at = NOW() WHERE id = ?',
        [status, comment, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('更新费用申请状态失败:', error);
      throw error;
    }
  },

  // 获取部门列表
  async getDepartments() {
    try {
      const [rows] = await pool.query('SELECT * FROM departments');
      return rows;
    } catch (error) {
      console.error('获取部门列表失败:', error);
      throw error;
    }
  },

  // 获取费用类型列表
  async getExpenseTypes() {
    try {
      const [rows] = await pool.query('SELECT * FROM expense_types');
      return rows;
    } catch (error) {
      console.error('获取费用类型列表失败:', error);
      throw error;
    }
  }
};

export default ExpenseModel;