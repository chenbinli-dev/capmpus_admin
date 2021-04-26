<template>
  <div id="taskData" class="taskData">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>代跑任务数据分析</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="info_body" justify="space=between">
      <el-col :span="20">
        <div id="echarts" class="echarts"></div>
      </el-col>
      <el-col :span="4">
        <el-row style="margin-bottom:18px">
          <el-button>任务数:{{taskInfo.length}}个</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button>已完成任务:{{finished}}个</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button type="primary" @click="changeTaskType">任务类型</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button type="success" @click="changeTaskStatus">任务状态</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import adminRequest from 'network/http'
import { countType, countStatus } from '../../utils/data'
export default {
  name: 'taskData',
  data() {
    return {
      taskInfo: [],
      finished:0,
      option: {
        title: {
          text: '',
          subtext: '以实际认证数据为准',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [],
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
    }
  },
  methods: {
    //获取全部任务信息
    getAllTaskInfo() {
      adminRequest
        .get('/admin/getAllTaskInfo', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.taskInfo = res.data
          this.taskInfo.forEach(item => {
              if(item.status === 3) {
                  this.finished++
              }
          })
          this.changeTaskType()
        })
        .catch(err => {
          console.log(err)
        })
    },
    //展示省份数据
    changeTaskType() {
      this.option.title.text = '代跑任务类型数据统计'
      this.option.series[0].data = countType(this.taskInfo)
      let myChart = this.$echarts.init(document.getElementById('echarts'))
      this.option && myChart.setOption(this.option)
    },
    //展示性别数据
    changeTaskStatus() {
      this.option.title.text = '代跑任务状态数据统计'
      this.option.series[0].data = countStatus(this.taskInfo)
      let myChart = this.$echarts.init(document.getElementById('echarts'))
      this.option && myChart.setOption(this.option)
    }
  },
  mounted() {
    this.getAllTaskInfo()
  }
}
</script>

<style>
.taskData {
  height: 100%;
  padding: 18px;
}
.info_body {
  background-color: #f2f6fc;
  margin-top: 18px;
  padding: 18px;
  border-radius: 8px;
}
.echarts {
  width: 800px;
  height: 400px;
}
</style>