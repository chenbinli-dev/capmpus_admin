<template>
  <div id="taskData" class="taskData">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户账户流水数据分析</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="info_body" justify="space=between">
      <el-col :span="20">
        <div id="echarts" class="echarts"></div>
      </el-col>
      <el-col :span="4">
        <el-row style="margin-bottom:18px">
          <el-button style="width:100%">平台成交额:{{total}}元</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button type="primary" @click="count" size="medium" style="width:100%">总览</el-button>
        </el-row>
        <el-row style="margin-bottom:18px">
          <el-button type="info" @click="category" size="medium" style="width:100%">近七天各类数据</el-button>
        </el-row>
        <el-row style="margin-bottom:18px" v-if="isShow">
          <el-select v-model="type" placeholder="请选择类型" style="width:100%">
            <el-option label="充值" value="recharge"></el-option>
            <el-option label="提现" value="withdraw"></el-option>
            <el-option label="任务支出" value="expend"></el-option>
            <el-option label="任务收入" value="income"></el-option>
            <el-option label="任务支付返还" value="back"></el-option>
          </el-select>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import adminRequest from 'network/http'
import moment from 'moment'
import { countBalance, countRecent } from '../../utils/data'
export default {
  name: 'taskData',
  data() {
    return {
      balanceInfo: [],
      total: '',
      isShow: false,
      type: '',
      option: {
        title: {
          text: '',
          subtext: '单位:元',
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
      },
      option2: {
        title: {
          text: '',
          subtext: '单位:元',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '',
            data: [],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
    }
  },
  watch: {
    type(value) {
      this.option2.xAxis.data = [
        moment()
          .subtract(7, 'days')
          .format('MM-DD'),
        moment()
          .subtract(6, 'days')
          .format('MM-DD'),
        moment()
          .subtract(5, 'days')
          .format('MM-DD'),
        moment()
          .subtract(4, 'days')
          .format('MM-DD'),
        moment()
          .subtract(3, 'days')
          .format('MM-DD'),
        moment()
          .subtract(2, 'days')
          .format('MM-DD'),
        moment()
          .subtract(1, 'days')
          .format('MM-DD')
      ]
      let myChart2
      switch (value) {
        case 'recharge':
          this.option2.title.text = '近七日用户充值数据'
          this.option2.series[0].name = '充值金额'
          this.option2.series[0].data = countRecent(this.balanceInfo, 1)
          myChart2 = this.$echarts.init(document.getElementById('echarts'))
          this.option2 && myChart2.setOption(this.option2)
          break
        case 'withdraw':
          this.option2.title.text = '近七日用户提现数据'
          this.option2.series[0].name = '提现金额'
          this.option2.series[0].data = countRecent(this.balanceInfo, 2)
          myChart2 = this.$echarts.init(document.getElementById('echarts'))
          this.option2 && myChart2.setOption(this.option2)
          break
        case 'expend':
          this.option2.title.text = '近七日用户任务支出数据'
          this.option2.series[0].name = '任务支出金额'
          this.option2.series[0].data = countRecent(this.balanceInfo, 3)
          myChart2 = this.$echarts.init(document.getElementById('echarts'))
          this.option2 && myChart2.setOption(this.option2)
          break
        case 'income':
          this.option2.title.text = '近七日用户任务收入数据'
          this.option2.series[0].name = '任务收入金额'
          this.option2.series[0].data = countRecent(this.balanceInfo, 4)
          myChart2 = this.$echarts.init(document.getElementById('echarts'))
          this.option2 && myChart2.setOption(this.option2)
          break
        case 'back':
          this.option2.title.text = '近七日用户任务过期/超时返还数据'
          this.option2.series[0].name = '支付返还金额'
          this.option2.series[0].data = countRecent(this.balanceInfo, 5)
          myChart2 = this.$echarts.init(document.getElementById('echarts'))
          this.option2 && myChart2.setOption(this.option2)
          break
        default:
          break
      }
    }
  },
  methods: {
    //获取全部任务信息
    getAllBalanceInfo() {
      adminRequest
        .get('/admin/getAllBalanceInfo', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          this.balanceInfo = res.data
          this.balanceInfo.forEach(item => {
            if (item.type === 4) {
              this.total += parseFloat(item.money)
            }
          })
          this.count()
        })
        .catch(err => {
          console.log(err)
        })
    },
    //总览数据
    count() {
      this.option.title.text = '全部流水数据总览'
      this.option.series[0].data = countBalance(this.balanceInfo)
      let myChart = this.$echarts.init(document.getElementById('echarts'))
      this.option && myChart.setOption(this.option)
    },
    // //展示近七天的各类数据
    category() {
      this.isShow = true
    }
  },
  mounted() {
    this.getAllBalanceInfo()
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