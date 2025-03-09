// 本地API服务，替代Supabase数据库调用
import { departments, employees, expenseTypes, expenses, delay, generateId } from './mockData';

// 部门相关API
export const departmentApi = {
  // 获取所有部门
  async getAllDepartments() {
    await delay();
    return [...departments];
  },

  // 获取部门详情
  async getDepartmentById(id) {
    await delay();
    const department = departments.find(dept => dept.id === id);
    if (!department) throw new Error('部门不存在');
    return { ...department };
  },

  // 创建部门
  async createDepartment(departmentData) {
    await delay();
    const newDepartment = {
      id: generateId(departments),
      name: departmentData.name,
      parent_id: departmentData.parent_id,
      manager: departmentData.manager,
      created_at: new Date().toISOString()
    };
    departments.push(newDepartment);
    return { ...newDepartment };
  },

  // 更新部门
  async updateDepartment(id, departmentData) {
    await delay();
    const index = departments.findIndex(dept => dept.id === id);
    if (index === -1) throw new Error('部门不存在');
    
    const updatedDepartment = {
      ...departments[index],
      ...departmentData
    };
    departments[index] = updatedDepartment;
    return { ...updatedDepartment };
  },

  // 删除部门
  async deleteDepartment(id) {
    await delay();
    const index = departments.findIndex(dept => dept.id === id);
    if (index === -1) throw new Error('部门不存在');
    departments.splice(index, 1);
    return { success: true };
  }
};

// 员工相关API
export const employeeApi = {
  // 获取所有员工
  async getAllEmployees() {
    await delay();
    return [...employees];
  },

  // 获取员工详情
  async getEmployeeById(id) {
    await delay();
    const employee = employees.find(emp => emp.id === id);
    if (!employee) throw new Error('员工不存在');
    return { ...employee };
  },

  // 创建员工
  async createEmployee(employeeData) {
    await delay();
    const department = departments.find(dept => dept.id === employeeData.department_id);
    if (!department) throw new Error('部门不存在');
    
    const newEmployee = {
      id: generateId(employees),
      name: employeeData.name,
      department_id: employeeData.department_id,
      department_name: department.name,
      position: employeeData.position,
      email: employeeData.email,
      phone: employeeData.phone
    };
    employees.push(newEmployee);
    return { ...newEmployee };
  },

  // 更新员工
  async updateEmployee(id, employeeData) {
    await delay();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) throw new Error('员工不存在');
    
    let department_name = employees[index].department_name;
    if (employeeData.department_id) {
      const department = departments.find(dept => dept.id === employeeData.department_id);
      if (!department) throw new Error('部门不存在');
      department_name = department.name;
    }
    
    const updatedEmployee = {
      ...employees[index],
      ...employeeData,
      department_name
    };
    employees[index] = updatedEmployee;
    return { ...updatedEmployee };
  },

  // 删除员工
  async deleteEmployee(id) {
    await delay();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) throw new Error('员工不存在');
    employees.splice(index, 1);
    return { success: true };
  }
};

// 费用类型相关API
export const expenseTypeApi = {
  // 获取所有费用类型
  async getAllExpenseTypes() {
    await delay();
    return [...expenseTypes];
  },

  // 获取费用类型详情
  async getExpenseTypeById(id) {
    await delay();
    const expenseType = expenseTypes.find(type => type.id === id);
    if (!expenseType) throw new Error('费用类型不存在');
    return { ...expenseType };
  },

  // 创建费用类型
  async createExpenseType(expenseTypeData) {
    await delay();
    const newExpenseType = {
      id: generateId(expenseTypes),
      name: expenseTypeData.name,
      description: expenseTypeData.description,
      budget_limit: expenseTypeData.budget_limit
    };
    expenseTypes.push(newExpenseType);
    return { ...newExpenseType };
  },

  // 更新费用类型
  async updateExpenseType(id, expenseTypeData) {
    await delay();
    const index = expenseTypes.findIndex(type => type.id === id);
    if (index === -1) throw new Error('费用类型不存在');
    
    const updatedExpenseType = {
      ...expenseTypes[index],
      ...expenseTypeData
    };
    expenseTypes[index] = updatedExpenseType;
    return { ...updatedExpenseType };
  },

  // 删除费用类型
  async deleteExpenseType(id) {
    await delay();
    const index = expenseTypes.findIndex(type => type.id === id);
    if (index === -1) throw new Error('费用类型不存在');
    expenseTypes.splice(index, 1);
    return { success: true };
  }
};

// 费用申请相关API
export const expenseApi = {
  // 获取所有费用申请
  async getAllExpenses() {
    await delay();
    return [...expenses];
  },

  // 获取费用申请详情
  async getExpenseById(id) {
    await delay();
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) throw new Error('费用申请不存在');
    return { ...expense };
  },

  // 创建费用申请
  async createExpense(expenseData) {
    await delay();
    const employee = employees.find(emp => emp.id === expenseData.applicant_id);
    if (!employee) throw new Error('申请人不存在');
    
    const department = departments.find(dept => dept.id === expenseData.department_id);
    if (!department) throw new Error('部门不存在');
    
    const expenseType = expenseTypes.find(type => type.id === expenseData.expense_type_id);
    if (!expenseType) throw new Error('费用类型不存在');
    
    const newExpense = {
      id: generateId(expenses),
      applicant_id: expenseData.applicant_id,
      applicant_name: employee.name,
      department_id: expenseData.department_id,
      department_name: department.name,
      expense_type_id: expenseData.expense_type_id,
      expense_type_name: expenseType.name,
      amount: expenseData.amount,
      purpose: expenseData.purpose,
      start_date: expenseData.start_date,
      end_date: expenseData.end_date,
      status: 'pending',
      approver_id: null,
      approver_name: null,
      approval_date: null,
      created_at: new Date().toISOString(),
      attachments: expenseData.attachments || [],
      remark: expenseData.remark || ''
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  // 更新费用申请状态
  async updateExpenseStatus(id, statusData) {
    await delay();
    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) throw new Error('费用申请不存在');
    
    const approver = employees.find(emp => emp.id === statusData.approver_id);
    if (!approver) throw new Error('审批人不存在');
    
    const updatedExpense = {
      ...expenses[index],
      status: statusData.status,
      approver_id: statusData.approver_id,
      approver_name: approver.name,
      approval_date: new Date().toISOString(),
      remark: statusData.remark || expenses[index].remark
    };
    expenses[index] = updatedExpense;
    return { ...updatedExpense };
  },

  // 更新费用申请
  async updateExpense(id, expenseData) {
    await delay();
    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) throw new Error('费用申请不存在');
    
    // 只允许修改pending状态的申请
    if (expenses[index].status !== 'pending') {
      throw new Error('只能修改待审批的费用申请');
    }
    
    const updatedExpense = {
      ...expenses[index],
      ...expenseData
    };
    expenses[index] = updatedExpense;
    return { ...updatedExpense };
  },

  // 删除费用申请
  async deleteExpense(id) {
    await delay();
    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) throw new Error('费用申请不存在');
    
    // 只允许删除pending状态的申请
    if (expenses[index].status !== 'pending') {
      throw new Error('只能删除待审批的费用申请');
    }
    
    expenses.splice(index, 1);
    return { success: true };
  }
};