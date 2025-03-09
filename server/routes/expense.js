// 费用申请路由
const express = require('express');
const router = express.Router();
const ExpenseModel = require('../models/expense');

// 获取所有费用申请
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await ExpenseModel.getAllExpenses();
    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error('获取费用申请列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取费用申请列表失败',
      error: error.message
    });
  }
});

// 获取单个费用申请详情
router.get('/expenses/:id', async (req, res) => {
  try {
    const expense = await ExpenseModel.getExpenseById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: '未找到该费用申请'
      });
    }
    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('获取费用申请详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取费用申请详情失败',
      error: error.message
    });
  }
});

// 创建新的费用申请
router.post('/expenses', async (req, res) => {
  try {
    const expenseData = req.body;
    const newExpense = await ExpenseModel.createExpense(expenseData);
    res.status(201).json({
      success: true,
      message: '费用申请创建成功',
      data: newExpense
    });
  } catch (error) {
    console.error('创建费用申请失败:', error);
    res.status(500).json({
      success: false,
      message: '创建费用申请失败',
      error: error.message
    });
  }
});

// 更新费用申请状态（审批）
router.put('/expenses/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    
    const updated = await ExpenseModel.updateExpenseStatus(id, status, comment);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: '未找到该费用申请'
      });
    }
    
    res.json({
      success: true,
      message: `费用申请状态已更新为 ${status}`
    });
  } catch (error) {
    console.error('更新费用申请状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新费用申请状态失败',
      error: error.message
    });
  }
});

// 获取部门列表
router.get('/departments', async (req, res) => {
  try {
    const departments = await ExpenseModel.getDepartments();
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('获取部门列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取部门列表失败',
      error: error.message
    });
  }
});

// 获取费用类型列表
router.get('/expense-types', async (req, res) => {
  try {
    const expenseTypes = await ExpenseModel.getExpenseTypes();
    res.json({
      success: true,
      data: expenseTypes
    });
  } catch (error) {
    console.error('获取费用类型列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取费用类型列表失败',
      error: error.message
    });
  }
});

module.exports = router;