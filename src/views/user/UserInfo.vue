<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户信息查看</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="info_body">
      <!--搜索栏-->
      <el-row type="flex" align="middle" class="form-inline">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="关键字">
            <el-input v-model="formInline.keyword" placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item label="查询条件">
            <el-select v-model="formInline.region" placeholder="选择查询条件">
              <el-option label="用户名" value="username"></el-option>
              <el-option label="昵称" value="nickname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(1,15)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!--信息表格-->
      <el-row>
        <el-table :data="userInfo" border stripe style="width: 100%" max-height="400">
          <el-table-column prop="username" label="用户名" width="180"></el-table-column>
          <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
          <el-table-column prop="gender" label="性别"></el-table-column>
          <el-table-column prop="telephone" label="电话"></el-table-column>
          <el-table-column prop="brithday" label="生日"></el-table-column>
          <el-table-column prop="right" label="学生认证"></el-table-column>
          <el-table-column prop="createAt" label="注册时间" sortable width="180"></el-table-column>
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
  </div>
</template>

<script>
import moment from 'moment'
import adminRequest from 'network/http'
export default {
  name: 'UserInfo',
  data() {
    return {
      formInline: {
        keyword: '',
        region: ''
      },
      userInfo: [],
      total: null
    }
  },
  methods: {
    //获取全部用户数目
    getUserTotal() {
      adminRequest
        .get('/admin/getUserTotal', {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          this.total = res.data.num
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取对应页码的用户
    getAllUser(pageNo, pageSize) {
      adminRequest
        .get('/admin/getAllUser', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data.length !== 0) {
            this.total = res.data.length
            res.data.forEach(item => {
              if (!item.nickname) {
                item.nickname = '未设置'
              }
              if (!item.gender) {
                item.gender = '未设置'
              } else if (item.gender === 100) {
                item.gender = '男'
              } else if (item.gender === 200) {
                item.gender = '女'
              }
              if (!item.telephone) {
                item.telephone = '未设置'
              }
              if (!item.brithday) {
                item.brithday = '未设置'
              } else {
                item.brithday = moment(item.brithday).format('YYYY-MM-DD')
              }
              if (item.right === 1) {
                item.right = '否'
              } else if (item.right === 2) {
                item.right = '是'
              }

              item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:hh:ss')
            })
            this.userInfo = res.data
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
      this.getAllUser(pageNo, 15)
    },
    //提交搜索
    onSubmit(pageNo, pageSize) {
      if (!this.formInline.region) {
        this.$message({
          message: '请选择查询条件',
          type: 'warning'
        })
        return
      }
      this.userInfo = []
      adminRequest
        .get('/admin/searchUser', {
          params: {
            keyword: this.formInline.keyword,
            region: this.formInline.region,
            pageNo: pageNo,
            pageSize: pageSize
          },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res)
          this.total = res.data.length
          res.data.forEach(item => {
            if (!item.nickname) {
              item.nickname = '未设置'
            }
            if (!item.gender) {
              item.gender = '未设置'
            } else if (item.gender === 100) {
              item.gender = '男'
            } else if (item.gender === 200) {
              item.gender = '女'
            }
            if (!item.telephone) {
              item.telephone = '未设置'
            }
            if (!item.brithday) {
              item.brithday = '未设置'
            } else {
              item.brithday = moment(item.brithday).format('YYYY-MM-DD')
            }
            if (item.right === 1) {
              item.right = '否'
            } else if (item.right === 2) {
              item.right = '是'
            }

            item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:hh:ss')
          })
          this.userInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.getUserTotal()
    this.getAllUser(1, 15)
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