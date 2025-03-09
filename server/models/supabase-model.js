import { supabase, supabaseAdmin } from '../supabase.js';

const SupabaseModel = {
  // 获取所有费用申请
  async getAllExpenses() {
    try {
      const { data, error } = await supabase
        .from('expense_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取费用申请列表失败:', error);
      throw error;
    }
  },

  // 获取单个费用申请详情
  async getExpenseById(id) {
    try {
      const { data, error } = await supabase
        .from('expense_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取费用申请详情失败:', error);
      throw error;
    }
  },

  // 创建新的费用申请
  async createExpense(expenseData) {
    try {
      const { data, error } = await supabase
        .from('expense_applications')
        .insert([
          {
            applicant_name: expenseData.applicantName,
            department: expenseData.department,
            expense_type: expenseData.expenseType,
            amount: expenseData.amount,
            purpose: expenseData.purpose,
            start_date: expenseData.startDate,
            end_date: expenseData.endDate,
            remark: expenseData.remark,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建费用申请失败:', error);
      throw error;
    }
  },

  // 更新费用申请状态
  async updateExpenseStatus(id, status, comment) {
    try {
      const { data, error } = await supabase
        .from('expense_applications')
        .update({
          status: status,
          approval_comment: comment,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('更新费用申请状态失败:', error);
      throw error;
    }
  },

  // 获取部门列表
  async getDepartments() {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取部门列表失败:', error);
      throw error;
    }
  },

  // 获取费用类型列表
  async getExpenseTypes() {
    try {
      const { data, error } = await supabase
        .from('expense_types')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('获取费用类型列表失败:', error);
      throw error;
    }
  },

  // 上传附件
  async createAttachment(attachmentData) {
    try {
      const { data, error } = await supabase
        .from('attachments')
        .insert([
          {
            expense_id: attachmentData.expenseId,
            file_name: attachmentData.fileName,
            file_path: attachmentData.filePath,
            file_type: attachmentData.fileType,
            file_size: attachmentData.fileSize
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('创建附件记录失败:', error);
      throw error;
    }
  }
};

export default SupabaseModel;