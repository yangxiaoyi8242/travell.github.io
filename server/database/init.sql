-- 数据库初始化脚本

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS expense_control_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE expense_control_system;

-- 创建部门表
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL COMMENT '部门编码',
  name VARCHAR(100) NOT NULL COMMENT '部门名称',
  manager VARCHAR(50) COMMENT '部门负责人',
  parent_id INT COMMENT '上级部门ID',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='部门信息表';

-- 创建费用类型表
CREATE TABLE IF NOT EXISTS expense_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL COMMENT '费用类型编码',
  name VARCHAR(100) NOT NULL COMMENT '费用类型名称',
  description TEXT COMMENT '描述',
  budget_control BOOLEAN DEFAULT FALSE COMMENT '是否预算控制',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='费用类型表';

-- 创建费用申请表
CREATE TABLE IF NOT EXISTS expense_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_no VARCHAR(50) NOT NULL COMMENT '申请单号',
  applicant_name VARCHAR(50) NOT NULL COMMENT '申请人姓名',
  applicant_id INT COMMENT '申请人ID',
  department VARCHAR(100) NOT NULL COMMENT '所属部门',
  expense_type VARCHAR(100) NOT NULL COMMENT '费用类型',
  amount DECIMAL(10, 2) NOT NULL COMMENT '申请金额',
  purpose VARCHAR(255) NOT NULL COMMENT '费用用途',
  start_date DATE COMMENT '开始日期',
  end_date DATE COMMENT '结束日期',
  remark TEXT COMMENT '备注',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '状态',
  approval_comment TEXT COMMENT '审批意见',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='费用申请表';

-- 创建附件表
CREATE TABLE IF NOT EXISTS attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL COMMENT '关联的费用申请ID',
  file_name VARCHAR(255) NOT NULL COMMENT '文件名',
  file_path VARCHAR(255) NOT NULL COMMENT '文件路径',
  file_type VARCHAR(50) COMMENT '文件类型',
  file_size INT COMMENT '文件大小(KB)',
  upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  FOREIGN KEY (expense_id) REFERENCES expense_applications(id) ON DELETE CASCADE
) COMMENT='附件表';

-- 插入初始部门数据
INSERT INTO departments (code, name, manager, parent_id) VALUES
('SALES', '销售部', '张经理', NULL),
('MARKET', '市场部', '李经理', NULL),
('RD', '研发部', '王经理', NULL),
('FINANCE', '财务部', '赵经理', NULL),
('HR', '人力资源部', '刘经理', NULL),
('ADMIN', '行政部', '陈经理', NULL);

-- 插入初始费用类型数据
INSERT INTO expense_types (code, name, description, budget_control) VALUES
('TRAVEL', '差旅费', '出差交通、住宿等费用', TRUE),
('OFFICE', '办公用品', '日常办公所需物品', FALSE),
('ENTERTAIN', '业务招待费', '招待客户的餐饮、礼品等费用', TRUE),
('TRAINING', '培训费', '员工培训相关费用', TRUE),
('OTHER', '其他费用', '其他未分类费用', FALSE);