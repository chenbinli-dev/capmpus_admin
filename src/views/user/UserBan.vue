<template>
  <div class="userinfo">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账号禁用/解除</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="tabs">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="账户禁用" name="first" style="padding:18px">
          <!--用户禁用表单-->
          <el-row>
            <el-col :span="12">
              <el-input v-model="username" placeholder="请输用户名" clearable>
                <template slot="prepend">用户名</template>
              </el-input>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-button type="primary" @click="searchUser">查找用户</el-button>
            </el-col>
          </el-row>
          <!--搜索结果-->
          <el-row style="margin-top:18px" v-if="user">
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>找到一位用户信息</span>
                </div>
                <div>
                  <div>
                    <el-avatar :src="user.avatar_url"></el-avatar>
                  </div>
                  <el-row type="flex" justify="space-between" style="margin-top:18px">
                    <el-col :span="4">用户名</el-col>
                    <el-col :span="8">{{user.username}}</el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!--提交表单-->
          <el-row style="margin-top:18px">
            <el-col :span="12">
              <el-form label-width="80px" :model="forbiddenForm">
                <el-form-item label="禁用原因">
                  <el-input
                    v-model="forbiddenForm.reason"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入禁用原因"
                    maxlength="150"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="禁用类型">
                  <el-select v-model="forbiddenForm.type" placeholder="请选择禁用类型">
                    <el-option label="暂时禁用" value="0"></el-option>
                    <el-option label="永久禁用" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" @click="submitForm">禁用</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!--解除禁用页-->
        <el-tab-pane label="禁用解除" name="second" style="padding:0 18px">
          <!--信息表格-->
          <el-row style="margin-top:18px" v-if="userInfo.length > 0">
            <el-table :data="userInfo" border stripe style="width: 100%">
              <el-table-column prop="username" label="用户名" width="180"></el-table-column>
              <el-table-column prop="reason" label="禁用原因" width="180"></el-table-column>
              <el-table-column prop="type" label="禁用类型" width="180"></el-table-column>
              <el-table-column prop="createAt" label="禁用时间" sortable></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">解除禁用</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!--分页-->
          <el-row type="flex" justify="center" style="margin-top:18px" v-if="userInfo.length > 0">
            <el-pagination
              background
              :page-size="15"
              layout="prev, pager, next"
              :total="total"
              @current-change="changePage"
            ></el-pagination>
          </el-row>
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:80px"
            v-if="userInfo.length === 0"
          >没有数据</el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import adminRequest from 'network/http'
export default {
  name: 'UserBan',
  inject: ['reload'],
  data() {
    return {
      username: '',
      user: null,
      activeName: 'first',
      forbiddenForm: {
        reason: '',
        type: ''
      },
      userInfo: [],
      total: null
    }
  },
  methods: {
    //选项卡选择
    handleClick(tab, event) {
      if (tab.label === '禁用解除') {
        this.getForbiddenUser(1, 15)
      } else {
        this.userInfo = []
      }
    },
    //查找用户
    searchUser() {
      adminRequest
        .get('/admin/getUserByUsername', {
          params: { username: this.username },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data) {
            this.user = res.data
          } else {
            this.$message({
              message: '没有对应的用户',
              type: 'warning',
              offset: 80
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //提交禁用表单
    submitForm() {
      this.$confirm('禁用原因将无法修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!this.user) {
            this.$message({
              message: '先选择对应用户',
              type: 'warning',
              offset: 80
            })
            return
          } else if (!this.forbiddenForm.reason || !this.forbiddenForm.type) {
            this.$message({
              message: '信息不完整',
              type: 'warning',
              offset: 80
            })
            return
          } else {
            //提交禁用表单
            this.forbiddenForm.uid = this.user.uid
            this.forbiddenForm.username = this.user.username
            adminRequest
              .post('/admin/forbiddenUser', this.forbiddenForm, {
                headers: { Authorization: localStorage.getItem('TOKEN') }
              })
              .then(res => {
                if (res.data.statusCode === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    offset: 80,
                    onClose: () => {
                      this.reload()
                      this.activeName = 'second'
                    }
                  })
                } else {
                  this.$message({
                    message: '操作失败',
                    type: 'danger',
                    offset: 80,
                    onClose: () => {
                      this.reload()
                      this.activeName = 'second'
                    }
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    //获取禁用用户
    getForbiddenUser(pageNo, pageSize) {
      adminRequest
        .get('/admin/getForbiddenUser', {
          params: { pageNo: pageNo, pageSize: pageSize },
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
            this.total = res.data.length
            res.data.forEach(item => {
              if (item.type === 0) {
                item.type = '暂时禁用'
              } else {
                item.type = '永久禁用'
              }
              item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:ss:hh')
            })
            this.userInfo = res.data
          } else {
            this.$message({
              message: '没有数据',
              type: 'warning',
              offset: 80
            })
            return
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //解除禁用
    handleDelete(row) {
      const req = {
        username: row.username
      }
      this.$confirm('确认解除该用户禁用状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          adminRequest
            .post('/admin/releaseUser', req, {
              headers: { Authorization: localStorage.getItem('TOKEN') }
            })
            .then(res => {
              if (res.data.statusCode === 200) {
                this.$message({
                  message: '解除成功',
                  type: 'success',
                  offset: 80,
                  onClose: () => {
                    this.reload()
                  }
                })
              } else {
                this.$message({
                  message: '解除失败',
                  type: 'danger',
                  offset: 80,
                  onClose: () => {
                    this.reload()
                  }
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            message: '已取消操作',
            type: 'info',
            offset: 80,
            onClose: () => {
              this.reload()
            }
          })
        })
    },
    //改变页码
    changePage(pageNo) {
      this.getAllUser(pageNo, 15)
    }
  }
}
</script>

<style>
.userinfo {
  height: 100%;
  padding: 18px;
}
.form-inline {
  margin-top: 36px;
}
.tabs {
  background-color: #f2f6fc;
  margin-top: 18px;
  border-radius: 8px;
}
</style>