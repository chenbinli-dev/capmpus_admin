<template>
  <div id="userData" class="userData">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户数据分析</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="info_body" justify="space=between">
      <el-col :span="20">
        <div id="userFrom" class="userFrom"></div>
      </el-col>
      <el-col :span="4">
        <el-row style="margin-bottom:18px">
          <el-button>平台用户数:{{userInfo.length}}人</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button>已完成认证:{{studentInfo.length}}人</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button type="primary" @click="changeProvince">省份</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button type="success" @click="changeGender">性别</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button type="info" @click="changeEducation">学历</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import adminRequest from 'network/http'
import { countProvinceToEcharts, countBackground, countGender } from '../../utils/data'
export default {
  name: 'UserData',
  data() {
    return {
      userInfo: [],
      studentInfo: [],
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
    //获取全部用户信息
    getAllUserInfo() {
      adminRequest
        .get('/admin/getAllUserInfo', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.userInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取学生认证信息
    getAllStudentInfo() {
      adminRequest
        .get('/admin/getAllStudentInfo', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.studentInfo = res.data
          this.changeProvince()
        })
        .catch(err => {
          console.log(err)
        })
    },
    //展示省份数据
    changeProvince() {
      this.option.title.text = '用户学校所在地数据统计'
      this.option.series[0].data = countProvinceToEcharts(this.studentInfo)
      let myChart = this.$echarts.init(document.getElementById('userFrom'))
      this.option && myChart.setOption(this.option)
    },
    //展示性别数据
    changeGender() {
      this.option.title.text = '用户性别数据统计'
      this.option.series[0].data = countGender(this.userInfo)
      let myChart = this.$echarts.init(document.getElementById('userFrom'))
      this.option && myChart.setOption(this.option)
    },
    //展示学历数据
    changeEducation() {
      this.option.title.text = '用户学历数据统计'
      this.option.series[0].data = countBackground(this.studentInfo)
      let myChart = this.$echarts.init(document.getElementById('userFrom'))
      this.option && myChart.setOption(this.option)
    }
  },
  mounted() {
    this.getAllStudentInfo()
    this.getAllUserInfo()
  }
}
</script>

<style>
.userData {
  height: 100%;
  padding: 18px;
}
.info_body {
  background-color: #f2f6fc;
  margin-top: 18px;
  padding: 18px;
  border-radius: 8px;
}
.userFrom {
  width: 800px;
  height: 400px;
}
</style>