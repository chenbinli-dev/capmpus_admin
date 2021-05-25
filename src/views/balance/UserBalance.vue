<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账户流水</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--信息主体-->
    <el-row class="info_body">
      <!--搜索栏-->
      <el-row type="flex" align="middle" class="form-inline">
        <el-col :span="12">
          <el-form :inline="true" :model="formInline">
            <el-form-item label="筛选条件">
              <el-select v-model="type" placeholder="选择筛选条件">
                <el-option label="充值" value="1"></el-option>
                <el-option label="提现" value="2"></el-option>
                <el-option label="任务支出" value="3"></el-option>
                <el-option label="任务收入" value="4"></el-option>
                <el-option label="任务超时返还" value="5"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="onSubmit(1,15)">查询</el-button>
            </el-form-item>-->
          </el-form>
        </el-col>
      </el-row>
      <el-row v-if="balanceInfo.length !== 0">
        <!--信息表格-->
        <el-table :data="balanceInfo" border stripe style="width: 100%" max-height="400">
          <!-- <el-table-column prop="$index" label="序号" width="150"></el-table-column> -->
          <el-table-column prop="id" label="流水号" width="150"></el-table-column>
          <el-table-column prop="type" label="类型" width="150"></el-table-column>
          <el-table-column v-if="type === '1'" prop="recharge_type" label="充值方式" width="150"></el-table-column>
          <el-table-column prop="money" label="金额" sortable></el-table-column>
          <el-table-column prop="user_id" label="用户ID" sortable></el-table-column>
          <el-table-column prop="createAt" label="创建时间" sortable></el-table-column>
        </el-table>

        <!--分页-->
        <el-row type="flex" justify="center" style="margin-top:18px">
          <el-pagination
            background
            :page-size="15"
            layout="prev, pager, next"
            :total="total"
            @current-change="changePage"
          ></el-pagination>
        </el-row>
      </el-row>
      <el-row class="info-body" v-else type="flex" justify="center">没有数据</el-row>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import adminRequest from 'network/http'
export default {
  name: 'UserInfo',
  data() {
    return {
      type: '',
      search: false,
      balanceInfo: [],
      total: null
    }
  },
  watch: {
    type() {
      this.onSubmit(1, 15)
    }
  },
  methods: {
    //获取全部流水信息条数
    getBalanceTotal() {
      adminRequest
        .get('/admin/getBalanceTotal', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.total = res.data.num
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取对应页码数据
    getBalanceInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getBalanceInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              switch (item.type) {
                case 1:
                  item.type = '充值'
                  break
                case 2:
                  item.type = '提现'
                  break
                case 3:
                  item.type = '任务支出'
                  break
                case 4:
                  item.type = '任务收入'
                  break
                case 5:
                  item.type = '任务金返还'
                  break
                default:
                  break
              }
              item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
            })
            this.balanceInfo = res.data
          } else {
            this.$message({
              message: '没有数据',
              type: 'warning'
            })
            return
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //改变页码
    changePage(pageNo) {
      if (this.type) {
        this.onSubmit(pageNo, 15)
      } else {
        this.getBalanceInfo(pageNo, 15)
      }
    },
    //提交搜索
    onSubmit(pageNo, pageSize) {
      this.balanceInfo = []
      adminRequest
        .get('/admin/searchBalance', {
          params: { type: this.type, pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.total = res.data.length
          res.data.forEach(item => {
            switch (item.type) {
              case 1:
                item.type = '充值'
                break
              case 2:
                item.type = '提现'
                break
              case 3:
                item.type = '任务支出'
                break
              case 4:
                item.type = '任务收入'
                break
              case 5:
                item.type = '任务金返还'
                break
              default:
                break
            }
            item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
          })
          this.balanceInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getBalanceInfo(1, 15)
    this.getBalanceTotal()
  }
}
</script>

<style scoped>
.userinfo {
  height: 100%;
  padding: 18px;
}
.info_body {
  background-color: #f2f6fc;
  margin-top: 18px;
  padding: 18px;
  border-radius: 8px;
}
.form-inline {
  margin: 36px 0 18px 0;
}
</style>