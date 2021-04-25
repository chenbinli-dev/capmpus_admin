<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>学生认证信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="info_body" v-if="studentInfo.length !== 0">
      <!--搜索栏-->
      <el-row type="flex" align="middle" class="form-inline">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="学校名称">
            <el-input v-model="formInline.university" placeholder="请输入学校名称"></el-input>
          </el-form-item>
          <el-form-item label="筛选条件">
            <el-select v-model="formInline.status" placeholder="选择筛选条件">
              <el-option label="未通过" value="0"></el-option>
              <el-option label="已通过" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!--信息表格-->
      <el-row>
        <el-table :data="studentInfo" border stripe style="width: 100%" height="400">
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
  </div>
</template>

<script>
import adminRequest from 'network/http'
export default {
  name: 'UserInfo',
  data() {
    return {
      formInline: {
        university: '',
        status: ''
      },
      studentInfo: [],
      total: null
    }
  },
  methods: {
    getStudentInfo(pageNo, pageSize) {
      adminRequest
        .get('/admin/getStudentInfo', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
            this.total = res.data.length
            res.data.forEach(item => {
              const date = new Date(item.createAt)
              const y = date.getFullYear()
              const mon = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
              const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
              const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
              const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

              item.createAt = y + '-' + mon + '-' + d + ' ' + h + ':' + min
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
    //改变页码
    changePage(pageNo) {
      this.getStudentInfo(pageNo, 15)
    },
    //提交搜索
    onSubmit() {}
  },
  created() {
    this.getStudentInfo(1, 15)
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