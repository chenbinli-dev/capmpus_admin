<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学生认证信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="tabs">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="audit" class="audit">
          <el-row v-if="newStudentInfo.length !== 0">
            <el-row class="tips" type="flex" justify="center">当前待处理：{{information}}</el-row>
            <el-divider></el-divider>
            <!--信息表格-->
            <el-row>
              <el-table :data="newStudentInfo" border stripe style="width: 100%" max-height="400">
                <el-table-column prop="name" label="姓名" width="150"></el-table-column>
                <el-table-column prop="id_number" label="身份证号" width="180"></el-table-column>
                <el-table-column prop="province" label="学校所在省份" width="150"></el-table-column>
                <el-table-column prop="university_name" label="学校名称" width="150"></el-table-column>
                <el-table-column prop="education_background" label="学历" width="150"></el-table-column>
                <el-table-column prop="student_number" label="学号" width="180"></el-table-column>
                <el-table-column prop="enrollment_year" label="入学年份" sortable width="150"></el-table-column>
                <el-table-column prop="university_name" label="学校名称" width="150"></el-table-column>
                <el-table-column prop="user_id" label="用户ID" sortable width="150"></el-table-column>
                <el-table-column fixed label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="handlePassAndReject(scope.row,1)"
                    >通过</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handlePassAndReject(scope.row,2)"
                    >不通过</el-button>
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
        <!--全部学生信息-->
        <el-tab-pane label="全部信息" name="all">
          <el-row class="info_body" v-if="studentInfo.length !== 0">
            <!--搜索栏-->
            <el-row type="flex" align="middle" class="form-inline">
              <el-form :inline="true" :model="formInline">
                <el-form-item label="学校名称">
                  <el-input v-model="formInline.university" placeholder="请输入学校名称"></el-input>
                </el-form-item>
                <el-form-item label="筛选条件">
                  <el-select v-model="formInline.status" placeholder="选择筛选条件">
                    <el-option label="已通过" value="1"></el-option>
                    <el-option label="未通过" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit(1,15)">查询</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <!--信息表格-->
            <el-row>
              <el-table :data="studentInfo" border stripe style="width: 100%" max-height="400">
                <el-table-column fixed prop="name" label="姓名" width="150"></el-table-column>
                <el-table-column prop="id_number" label="身份证号" width="180"></el-table-column>
                <el-table-column prop="province" label="学校所在省份" width="150"></el-table-column>
                <el-table-column prop="university_name" label="学校名称" width="150"></el-table-column>
                <el-table-column prop="education_background" label="学历" width="150"></el-table-column>
                <el-table-column prop="student_number" label="学号" width="180"></el-table-column>
                <el-table-column prop="enrollment_year" label="入学年份" sortable width="150"></el-table-column>
                <el-table-column prop="university_name" label="学校名称" width="150"></el-table-column>
                <el-table-column prop="audit_status" label="审核状态" width="150"></el-table-column>
                <el-table-column prop="user_id" label="用户ID" sortable width="150"></el-table-column>
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
      activeName: 'audit',
      formInline: {
        university: '',
        status: ''
      },
      newStudentInfo: [],
      studentInfo: [],
      new_total: null,
      total: null
    }
  },
  computed: {
    information() {
      return this.newStudentInfo.length
    }
  },
  methods: {
    //选项卡选择
    handleClick(tab, event) {
      if (tab.label === '全部信息') {
        this.getStudentTotal()
        this.getStudentInfo(1, 15)
      } else {
        this.userInfo = []
        this.getNewStudentTotal()
      }
    },
    //获取全部学生信息条数
    getStudentTotal() {
      adminRequest
        .get('/admin/getStudentTotal', {
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
    getNewStudentTotal() {
      adminRequest
        .get('/admin/getNewStudentTotal', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.new_total = res.data.num
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取待审核的学生信息
    getNewStudentInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getNewStudentInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res)
          if (res.data.length === 0) {
            this.$message({
              message: '暂时没有新的学生认证信息提交',
              type: 'warning'
            })
            return
          } else {
            this.new_total = res.data.length
            this.newStudentInfo = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //审核通过
    handlePassAndReject(row, status) {
      const std = {
        uid: row.user_id,
        status: status
      }
      console.log(std)
      adminRequest
        .post('/admin/handlePassAndReject', std, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res)
          if (res.data.statusCode === 200) {
            this.$message({
              message: '已提交：审核通过',
              type: 'success',
              onClose: () => {
                this.reload()
              }
            })
            return
          } else {
            this.$message({
              message: '已提交：审核不通过',
              type: 'warning',
              onClose: () => {
                this.reload()
              }
            })
            return
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取对应页码学生信息
    getStudentInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getStudentInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              if (item.audit_status === 1) {
                item.audit_status = '审核通过'
              } else {
                item.audit_status = '审核未通过'
              }
              item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
            })
            this.studentInfo = res.data
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
      this.getNewStudentInfo(pageNo, 10)
    },
    //改变所有信息的页码
    changePage(pageNo) {
      this.getStudentInfo(pageNo, 15)
    },
    //提交搜索
    onSubmit(pageNo, pageSize) {
      adminRequest
        .get('/admin/searchStudent', {
          params: {
            university: this.formInline.university,
            status: this.formInline.status,
            pageNo: pageNo,
            pageSize: pageSize
          },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data.length === 0) {
            this.$message({
              message: '没有数据',
              type: 'warning'
            })
            return
          } else {
            this.total = res.data.length
            this.studentInfo = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getNewStudentTotal()
    this.getNewStudentInfo(1, 10)
  }
}
</script>

<style scoped>
.userinfo {
  height: 100%;
  padding: 18px;
}
.tabs {
  background-color: #f2f6fc;
  margin-top: 18px;
  border-radius: 8px;
}
.audit {
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