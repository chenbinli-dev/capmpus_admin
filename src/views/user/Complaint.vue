<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>处理用户投诉</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="tabs">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="待处理" name="deal" class="deal">
          <el-row v-if="newComplaintInfo.length !== 0">
            <el-row class="tips" type="flex" justify="center">当前待处理：{{information}}</el-row>
            <el-divider></el-divider>
            <!--信息表格-->
            <el-row>
              <el-table :data="newComplaintInfo" border stripe style="width: 100%" max-height="400">
                <el-table-column fixed prop="task_number" label="任务编号" width="150"></el-table-column>
                <el-table-column prop="content" label="投诉内容" width="180"></el-table-column>
                <el-table-column prop="receiver_id" label="代跑用户" width="150"></el-table-column>
                <el-table-column prop="user_id" label="投诉用户" width="150"></el-table-column>
                <el-table-column prop="have_deal" label="处理状态" width="150"></el-table-column>
                <el-table-column prop="createAt" label="投诉时间" width="180"></el-table-column>
                <el-table-column fixed label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="reply(scope.row)">回复投诉</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <!--分页-->
            <el-row type="flex" justify="center" style="margin-top:18px">
              <el-pagination
                background
                :page-size="10"
                layout="prev, pager, next"
                :total="new_total"
                @current-change="new_changePage"
              ></el-pagination>
            </el-row>
          </el-row>
          <el-row class="info-body" v-else type="flex" justify="center">没有数据</el-row>
        </el-tab-pane>
        <!--全部投诉信息-->
        <el-tab-pane label="全部投诉记录" name="all">
          <el-row class="info_body" v-if="complaintInfo.length !== 0">
            <!--搜索栏-->
            <!-- <el-row type="flex" align="middle" class="form-inline">
              <el-form :inline="true">
                <el-form-item label="投诉用户">
                  <el-input v-model="complaint_user_id" placeholder="请输入投诉用户ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit(1,15)">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>-->
            <!--信息表格-->
            <el-row>
              <el-table :data="complaintInfo" border stripe style="width: 100%" max-height="400">
                <el-table-column fixed prop="task_number" label="任务编号" width="150"></el-table-column>
                <el-table-column prop="content" label="投诉内容" width="180"></el-table-column>
                <el-table-column prop="receiver_id" label="代跑用户" width="150"></el-table-column>
                <el-table-column prop="user_id" label="投诉用户" width="150"></el-table-column>
                <el-table-column prop="have_deal" label="处理状态" width="150"></el-table-column>
                <el-table-column prop="createAt" label="投诉时间" width="180"></el-table-column>
                <el-table-column prop="reply" label="受理回复" width="180"></el-table-column>
                <el-table-column prop="reply_at" label="受理时间" width="180"></el-table-column>
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
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import adminRequest from 'network/http'
import moment from 'moment'
export default {
  name: 'UserInfo',
  inject: ['reload'],
  data() {
    return {
      activeName: 'deal',
      complaint_user_id: '',
      newComplaintInfo: [],
      complaintInfo: [],
      new_total: null,
      total: null
    }
  },
  computed: {
    information() {
      return this.newComplaintInfo.length
    }
  },
  methods: {
    //选项卡选择
    handleClick(tab, event) {
      if (tab.label === '全部投诉记录') {
        this.getComplaintTotal()
        this.getComplaintInfo(1, 15)
      } else {
        this.complaintInfo = []
        this.getNewComplaintTotal()
      }
    },
    //获取全部学生信息条数
    getComplaintTotal() {
      adminRequest
        .get('/admin/getComplaintTotal', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.total = res.data.num
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取全部待审核学生信息条数
    getNewComplaintTotal() {
      adminRequest
        .get('/admin/getNewComplaintTotal', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.new_total = res.data.num
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取待受理的学生投诉信息
    getNewComplaintInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getNewComplaintInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res)
          if (res.data.length === 0) {
            this.$message({
              message: '暂时没有新的投诉信息提交',
              type: 'warning'
            })
            return
          } else {
            this.new_total = res.data.length
            res.data.forEach(item => {
              item.have_deal = '未受理'
              item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
            })
            this.newComplaintInfo = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取对应页码投诉信息
    getComplaintInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getComplaintInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              item.have_deal = '已受理'
              item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
              item.reply_at = moment(item.reply_at).format('YYYY-MM-DD HH:mm:ss')
            })
            this.complaintInfo = res.data
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
    //改变待审核的页面
    new_changePage(pageNo) {
      this.getNewComplaintInfo(pageNo, 10)
    },
    //改变所有信息的页码
    changePage(pageNo) {
      this.getComplaintInfo(pageNo, 15)
    },
    reply(row) {
      console.log(row.id)
      this.$prompt('请输入受理内容', '用户投诉受理', {
        confirmButtonText: '提交受理',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          const reply = {
            complaint_id: row.id,
            reply: value,
            reply_at: moment().format('YYYY-MM-DD HH:mm:ss')
          }
          adminRequest
            .post('/admin/replyComplaint', reply, {
              headers: { Authorization: localStorage.getItem('TOKEN') }
            })
            .then(res => {
              if (res.data.statusCode === 200) {
                this.$message({
                  type: 'success',
                  message: '受理成功'
                })
                this.relaod()
              } else {
                this.$message({
                  type: 'warning',
                  message: '受理失败'
                })
                this.reload()
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消受理操作'
          })
        })
    }
    // //提交搜索
    // onSubmit(pageNo, pageSize) {
    //   adminRequest
    //     .get('/admin/searchStudent', {
    //       params: {
    //         university: this.formInline.university,
    //         status: this.formInline.status,
    //         pageNo: pageNo,
    //         pageSize: pageSize
    //       },
    //       headers: { Authorization: localStorage.getItem('TOKEN') }
    //     })
    //     .then(res => {
    //       if (res.data.length === 0) {
    //         this.$message({
    //           message: '没有数据',
    //           type: 'warning'
    //         })
    //         return
    //       } else {
    //         this.total = res.data.length
    //         this.studentInfo = res.data
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
  },
  created() {
    this.getNewComplaintTotal()
    this.getNewComplaintInfo(1, 10)
  }
}
</script>

<style>
.userinfo {
  height: 100%;
  padding: 18px;
}
.tabs {
  background-color: #f2f6fc;
  margin-top: 18px;
  border-radius: 8px;
}
.deal {
  padding: 0 18px;
}
.info_body {
  background-color: #f2f6fc;
  padding: 0 18px;
  border-radius: 8px;
}
.form-inline {
  margin: 18px 0 18px 0;
}
</style>