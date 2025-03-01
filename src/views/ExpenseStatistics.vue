<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 图表DOM引用
const departmentChartRef = ref(null)
const monthlyChartRef = ref(null)
const typeChartRef = ref(null)
const trendChartRef = ref(null)

// 图表实例
let departmentChart = null
let monthlyChart = null
let typeChart = null
let trendChart = null

// 加载状态
const loading = ref(true)

// 初始化部门费用分布图表
const initDepartmentChart = () => {
  const chartDom = departmentChartRef.value
  departmentChart = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '部门费用分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['销售部', '市场部', '研发部', '财务部', '人力资源部', '行政部']
    },
    series: [
      {
        name: '费用分布',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 320000, name: '销售部' },
          { value: 210000, name: '市场部' },
          { value: 450000, name: '研发部' },
          { value: 80000, name: '财务部' },
          { value: 120000, name: '人力资源部' },
          { value: 180000, name: '行政部' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  option && departmentChart.setOption(option)
}

// 初始化月度费用趋势图表
const initMonthlyChart = () => {
  const chartDom = monthlyChartRef.value
  monthlyChart = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '月度费用趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const param = params[0]
        return `${param.name}<br/>${param.seriesName}: ¥${param.value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: function(value) {
            if (value >= 10000) {
              return (value / 10000) + '万'
            } else {
              return value
            }
          }
        }
      }
    ],
    series: [
      {
        name: '费用金额',
        type: 'bar',
        barWidth: '60%',
        data: [120000, 132000, 101000, 134000, 190000, 230000, 210000, 180000, 160000, 145000, 155000, 170000],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ]
  }
  
  option && monthlyChart.setOption(option)
}

// 初始化费用类型分布图表
const initTypeChart = () => {
  const chartDom = typeChartRef.value
  typeChart = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '费用类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['差旅费', '办公用品', '业务招待费', '培训费', '其他费用']
    },
    series: [
      {
        name: '费用类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 580000, name: '差旅费' },
          { value: 320000, name: '办公用品' },
          { value: 420000, name: '业务招待费' },
          { value: 250000, name: '培训费' },
          { value: 180000, name: '其他费用' }
        ]
      }
    ]
  }
  
  option && typeChart.setOption(option)
}

// 初始化预算使用趋势图表
const initTrendChart = () => {
  const chartDom = trendChartRef.value
  trendChart = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '预算使用趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function(params) {
        let result = params[0].name + '<br/>'
        params.forEach(param => {
          result += `${param.seriesName}: ¥${param.value.toLocaleString()}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['预算金额', '实际支出'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: function(value) {
            if (value >= 10000) {
              return (value / 10000) + '万'
            } else {
              return value
            }
          }
        }
      }
    ],
    series: [
      {
        name: '预算金额',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [150000, 150000, 150000, 150000, 150000, 150000, 200000, 200000, 200000, 200000, 200000, 200000]
      },
      {
        name: '实际支出',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [120000, 132000, 101000, 134000, 190000, 230000, 210000, 180000, 160000, 145000, 155000, 170000]
      }
    ]
  }
  
  option && trendChart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  departmentChart && departmentChart.resize()
  monthlyChart && monthlyChart.resize()
  typeChart && typeChart.resize()
  trendChart && trendChart.resize()
}

// 组件挂载后初始化图表
onMounted(() => {
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false
    
    // 初始化图表
    nextTick(() => {
      initDepartmentChart()
      initMonthlyChart()
      initTypeChart()
      initTrendChart()
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize)
    })
  }, 1000)
})
</script>

<template>
  <div class="statistics-container">
    <el-card class="statistics-card">
      <template #header>
        <div class="card-header">
          <h2>费用统计</h2>
        </div>
      </template>
      
      <div v-loading="loading" class="statistics-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="data-summary">
              <el-row :gutter="20">
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                  <el-card shadow="hover" class="summary-card">
                    <div class="summary-item">
                      <div class="summary-icon" style="background-color: #409EFF">
                        <el-icon><Money /></el-icon>
                      </div>
                      <div class="summary-info">
                        <div class="summary-title">年度总支出</div>
                        <div class="summary-value">¥1,750,000</div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                  <el-card shadow="hover" class="summary-card">
                    <div class="summary-item">
                      <div class="summary-icon" style="background-color: #67C23A">
                        <el-icon><Document /></el-icon>
                      </div>
                      <div class="summary-info">
                        <div class="summary-title">报销单数量</div>
                        <div class="summary-value">1,280</div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                  <el-card shadow="hover" class="summary-card">
                    <div class="summary-item">
                      <div class="summary-icon" style="background-color: #E6A23C">
                        <el-icon><TrendCharts /></el-icon>
                      </div>
                      <div class="summary-info">
                        <div class="summary-title">预算使用率</div>
                        <div class="summary-value">68.5%</div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                  <el-card shadow="hover" class="summary-card">
                    <div class="summary-item">
                      <div class="summary-icon" style="background-color: #F56C6C">
                        <el-icon><Warning /></el-icon>
                      </div>
                      <div class="summary-info">
                        <div class="summary-title">超预算部门</div>
                        <div class="summary-value">2</div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" class="chart-row">
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div ref="departmentChartRef" class="chart"></div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div ref="typeChartRef" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" class="chart-row">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-card shadow="hover" class="chart-card">
              <div ref="monthlyChartRef" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.statistics-container {
  padding: 20px;
}

.statistics-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-summary {
  margin-bottom: 30px;
}

.summary-card {
  height: 100%;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.summary-info {
  flex: 1;
}

.summary-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 100%;
}

.chart {
  height: 400px;
}
</style>