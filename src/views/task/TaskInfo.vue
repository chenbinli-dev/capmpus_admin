<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>任务信息查看</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="info_body" v-if="taskInfo.length !== 0">
      <!--搜索栏-->
      <el-row type="flex" align="middle" class="form-inline">
        <el-col :span="24">
          <el-form :inline="true" :model="formInline">
            <el-form-item label="任务类型">
              <el-select v-model="formInline.type" placeholder="选择任务类型">
                <el-option label="代取快递" value="代取快递"></el-option>
                <el-option label="代打印" value="代打印"></el-option>
                <el-option label="代购物" value="代购物"></el-option>
                <el-option label="其他代跑" value="其他代跑"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务状态">
              <el-select v-model="formInline.status" placeholder="选择任务状态">
                <el-option label="闲置" value="1"></el-option>
                <el-option label="进行中" value="2"></el-option>
                <el-option label="完成" value="3"></el-option>
                <el-option label="过期" value="4"></el-option>
                <el-option label="超时" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">筛选</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--信息表格-->
      <el-row>
        <el-table :data="taskInfo" border stripe style="width: 100%" height="400">
          <el-table-column fixed prop="task_number" label="任务编号" width="180"></el-table-column>
          <el-table-column prop="type" label="任务类型类型" width="180"></el-table-column>
          <el-table-column prop="title" label="任务标题" width="180"></el-table-column>
          <el-table-column prop="description" label="任务描述" width="180"></el-table-column>
          <el-table-column prop="copies" label="份数" width="180"></el-table-column>
          <el-table-column prop="estimated_amount" label="预估金" width="150"></el-table-column>
          <el-table-column prop="commission" label="任务金" width="150"></el-table-column>
          <el-table-column prop="expiration_time" label="有效时间至" width="180"></el-table-column>
          <el-table-column prop="addressee" label="收件人" width="150"></el-table-column>
          <el-table-column prop="telephone" label="联系方式" width="150"></el-table-column>
          <el-table-column prop="address" label="收件地址" width="200"></el-table-column>
          <el-table-column prop="owner_id" label="发布用户ID" width="150"></el-table-column>
          <el-table-column prop="status" label="任务状态" width="150"></el-table-column>
          <el-table-column prop="createAt" label="发布时间" sortable width="180"></el-table-column>
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
        type: '',
        status: ''
      },
      taskInfo: [],
      total: null
    }
  },
  methods: {
    getRow(index) {
      console.log(index)
    },
    //处理时间
    changeUTC(time) {
      const date = new Date(time)
      const y = date.getFullYear()
      const mon = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

      return y + '-' + mon + '-' + d + ' ' + h + ':' + min
    },
    //获取代跑任务
    getTaskInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getTaskInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
            this.total = res.data.length
            res.data.forEach(item => {
              switch (item.status) {
                case 1:
                  item.status = '闲置'
                  break
                case 2:
                  item.status = '进行中'
                  break
                case 3:
                  item.status = '完成'
                  break
                case 4:
                  item.status = '过期'
                  break
                case 5:
                  item.status = '超时'
                  break
                default:
                  break
              }
              item.expiration_time = this.changeUTC(item.expiration_time)
              item.createAt = this.changeUTC(item.createAt)
            })
            this.taskInfo = res.data
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
      this.getTaskInfo(pageNo, 15)
    },
    //提交搜索
    onSubmit() {}
  },
  created() {
    this.getTaskInfo(1, 15)
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
  margin: 18px 0 18px 0;
}
</style>