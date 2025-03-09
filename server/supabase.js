import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esnxmoyyercrmtgjauuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbnhtb3l5ZXJjcm10Z2phdXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NTU1NTYsImV4cCI6MjA1NTMzMTU1Nn0.vPmeM2RvpDm5Wk3A4cU-DYvbK2p6MylxlpuXfKN7Huc';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbnhtb3l5ZXJjcm10Z2phdXVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTc1NTU1NiwiZXhwIjoyMDU1MzMxNTU2fQ.x2wXEbXhiRujhl40noQRYG0LxEOBPrAVxwfGJzWOUew';

// 创建Supabase客户端实例
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 创建具有服务角色权限的Supabase客户端实例
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export {
  supabase,
  supabaseAdmin
};