<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账户流水</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="info_body" v-if="balanceInfo.length !== 0">
      <!--搜索栏-->
      <el-row type="flex" align="middle" class="form-inline">
        <el-col :span="12">
          <el-form :inline="true" :model="formInline">
            <el-form-item label="筛选条件">
              <el-select v-model="formInline.region" placeholder="选择筛选条件">
                <el-option label="充值" value="recharge"></el-option>
                <el-option label="提现" value="withdraw"></el-option>
                <el-option label="任务支出" value="pay"></el-option>
                <el-option label="任务收入" value="get"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--信息表格-->
      <el-row>
        <el-table :data="balanceInfo" border stripe style="width: 100%" height="400">
          <el-table-column prop="id" label="流水号" width="150"></el-table-column>
          <el-table-column prop="type" label="类型" width="150"></el-table-column>
          <el-table-column prop="recharge" label="充值方式" width="150"></el-table-column>
          <el-table-column prop="money" label="金额" sortable></el-table-column>
          <el-table-column prop="user_id" label="用户ID" sortable></el-table-column>
          <el-table-column prop="createAt" label="创建时间" sortable></el-table-column>
        </el-table>
      </el-row>
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
  </div>
</template>

<script>
import adminRequest from 'network/http'
export default {
  name: 'UserInfo',
  data() {
    return {
      formInline: {
        region: ''
      },
      balanceInfo: [],
      total: null
    }
  },
  methods: {
    getBalanceInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getBalanceInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
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
              const date = new Date(item.createAt)
              const y = date.getFullYear()
              const mon = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
              const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
              const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
              const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

              item.createAt = y + '-' + mon + '-' + d + ' ' + h + ':' + min
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
      this.getBalanceInfo(pageNo, 15)
    },
    //提交搜索
    onSubmit() {}
  },
  created() {
    this.getBalanceInfo(1, 15)
  }
}
</script>

<style>
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