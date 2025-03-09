// 本地模拟数据

// 部门数据
export const departments = [
  { id: 1, name: '总经办', parent_id: null, manager: '张总', created_at: '2023-01-01T00:00:00Z' },
  { id: 2, name: '财务部', parent_id: 1, manager: '王财务', created_at: '2023-01-02T00:00:00Z' },
  { id: 3, name: '人力资源部', parent_id: 1, manager: '李人事', created_at: '2023-01-03T00:00:00Z' },
  { id: 4, name: '技术部', parent_id: 1, manager: '赵技术', created_at: '2023-01-04T00:00:00Z' },
  { id: 5, name: '市场部', parent_id: 1, manager: '钱市场', created_at: '2023-01-05T00:00:00Z' },
  { id: 6, name: '销售部', parent_id: 1, manager: '孙销售', created_at: '2023-01-06T00:00:00Z' },
  { id: 7, name: '客服部', parent_id: 1, manager: '周客服', created_at: '2023-01-07T00:00:00Z' },
  { id: 8, name: '研发组', parent_id: 4, manager: '吴研发', created_at: '2023-01-08T00:00:00Z' },
  { id: 9, name: '测试组', parent_id: 4, manager: '郑测试', created_at: '2023-01-09T00:00:00Z' },
  { id: 10, name: '运维组', parent_id: 4, manager: '冯运维', created_at: '2023-01-10T00:00:00Z' }
];

// 员工数据
export const employees = [
  { id: 1001, name: '张三', department_id: 4, department_name: '技术部', position: '技术总监', email: 'zhangsan@example.com', phone: '13800000001' },
  { id: 1002, name: '李四', department_id: 8, department_name: '研发组', position: '高级工程师', email: 'lisi@example.com', phone: '13800000002' },
  { id: 1003, name: '王五', department_id: 9, department_name: '测试组', position: '测试工程师', email: 'wangwu@example.com', phone: '13800000003' },
  { id: 1004, name: '赵六', department_id: 2, department_name: '财务部', position: '财务经理', email: 'zhaoliu@example.com', phone: '13800000004' },
  { id: 1005, name: '钱七', department_id: 5, department_name: '市场部', position: '市场总监', email: 'qianqi@example.com', phone: '13800000005' },
  { id: 1006, name: '孙八', department_id: 6, department_name: '销售部', position: '销售经理', email: 'sunba@example.com', phone: '13800000006' },
  { id: 1007, name: '周九', department_id: 7, department_name: '客服部', position: '客服主管', email: 'zhoujiu@example.com', phone: '13800000007' },
  { id: 1008, name: '吴十', department_id: 3, department_name: '人力资源部', position: 'HR经理', email: 'wushi@example.com', phone: '13800000008' },
  { id: 1009, name: '郑十一', department_id: 10, department_name: '运维组', position: '运维工程师', email: 'zheng11@example.com', phone: '13800000009' },
  { id: 1010, name: '冯十二', department_id: 1, department_name: '总经办', position: '行政助理', email: 'feng12@example.com', phone: '13800000010' }
];

// 费用类型数据
export const expenseTypes = [
  { id: 1, name: '差旅费', description: '出差相关费用', budget_limit: 5000 },
  { id: 2, name: '办公用品', description: '日常办公用品采购', budget_limit: 2000 },
  { id: 3, name: '招待费', description: '客户招待相关费用', budget_limit: 3000 },
  { id: 4, name: '培训费', description: '员工培训相关费用', budget_limit: 8000 },
  { id: 5, name: '会议费', description: '会议组织相关费用', budget_limit: 4000 },
  { id: 6, name: '交通费', description: '日常交通费用报销', budget_limit: 1000 },
  { id: 7, name: '通讯费', description: '电话、网络等通讯费用', budget_limit: 500 },
  { id: 8, name: '设备采购', description: '设备采购费用', budget_limit: 10000 }
];

// 费用申请数据
export const expenses = [
  {
    id: 1,
    applicant_id: 1002,
    applicant_name: '李四',
    department_id: 8,
    department_name: '研发组',
    expense_type_id: 1,
    expense_type_name: '差旅费',
    amount: 3500,
    purpose: '参加技术交流会',
    start_date: '2023-06-01',
    end_date: '2023-06-03',
    status: 'approved',
    approver_id: 1001,
    approver_name: '张三',
    approval_date: '2023-05-25',
    created_at: '2023-05-20T10:00:00Z',
    attachments: [],
    remark: '包含往返机票和住宿费用'
  },
  {
    id: 2,
    applicant_id: 1003,
    applicant_name: '王五',
    department_id: 9,
    department_name: '测试组',
    expense_type_id: 2,
    expense_type_name: '办公用品',
    amount: 800,
    purpose: '购买测试设备配件',
    start_date: '2023-06-05',
    end_date: '2023-06-05',
    status: 'pending',
    approver_id: null,
    approver_name: null,
    approval_date: null,
    created_at: '2023-06-01T14:30:00Z',
    attachments: [],
    remark: '用于自动化测试环境搭建'
  },
  {
    id: 3,
    applicant_id: 1005,
    applicant_name: '钱七',
    department_id: 5,
    department_name: '市场部',
    expense_type_id: 3,
    expense_type_name: '招待费',
    amount: 2500,
    purpose: '客户洽谈午餐',
    start_date: '2023-06-10',
    end_date: '2023-06-10',
    status: 'rejected',
    approver_id: 1001,
    approver_name: '张总',
    approval_date: '2023-06-08',
    created_at: '2023-06-05T09:15:00Z',
    attachments: [],
    remark: '预算超出标准，请重新申请'
  }
];

// 模拟API响应延迟
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 生成唯一ID
export const generateId = (collection) => {
  const ids = collection.map(item => item.id);
  return Math.max(...ids, 0) + 1;
};