<template>
  <div id="adminLogin" class="adminLogin">
    <!--登录框-->
    <div class="login-box">
      <div class="login-title">校园代跑平台后台系统</div>
      <div class="login-body">
        <div class="input">
          <el-input
            v-model="username"
            type="text"
            placeholder="请输入管理员账号"
            prefix-icon="el-icon-user-solid"
            clearable
          />
        </div>
        <div class="input">
          <el-input
            v-model="password"
            type="password"
            placeholder="请输入管理员密码"
            prefix-icon="el-icon-lock"
            clearables
          />
        </div>
        <el-button type="info" size="medium" slot="reference" :loading="isLoading" @click="login">登录</el-button>
        <div class="show_time">{{getTime}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import adminRequest from 'network/http'
export default {
  name: 'AdminLogin',
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      warning_text: '1'
    }
  },
  computed: {
    getTime() {
      return moment().format('YYYY-MM-DD HH:hh')
    }
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        this.$message({
          message: '用户名和密码不能为空',
          type: 'warning'
        })
        return
      } else if (this.username.length > 20 || this.password.length > 18) {
        this.$message({
          message: '用户名和密码长度不合法',
          type: 'warning'
        })
        return
      } else {
        //校验通过
        this.isLoading = true
        const admin = {
          username: this.username,
          password: this.password
        }
        adminRequest
          .post('/admin/login', admin)
          .then(res => {
            if (res.data.message === 'ACCOUNT_NOT_MATCH') {
              this.isLoading = false
              //用户名错误
              this.$message({
                message: '用户名不存在',
                type: 'warning'
              })
            } else if (res.data.message === 'PASSWORD_WRONG') {
              this.isLoading = false
              this.$message({
                message: '密码错误',
                type: 'warning'
              })
            } else if (res.data.admin_id && res.data.token) {
              localStorage.setItem('ADMIN_ID', res.data.admin_id)
              localStorage.setItem('TOKEN', res.data.token)
              this.isLoading = false
              this.$message({
                message: '登录成功',
                type: 'success',
                onClose: () => {
                  this.$router.push('/admin/home')
                }
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style>
.adminLogin {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  width: 300px;
  height: 250px;
  border-radius: 5px;
  background-color: #fff;
  padding: 20px;
}
.login-title {
  width: 100%;
  text-align: center;
  color: #303133;
  font-size: 25px;
  margin-bottom: 16px;
}
.input {
  margin-bottom: 16px;
}
.el-button {
  width: 100%;
}
.show_time {
  margin-top: 16px;
  width: 100%;
  text-align: center;
}
</style>