<template>
  <div id="edit" class="edit">
    <!--面包屑-->
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/admin/home/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>管理员密码修改</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--提交表单-->
    <el-row type="flex" justify="center" class="info_body">
      <el-col :span="8">
        <el-form
          :model="passwordForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item label="旧密码" prop="old_password">
            <el-input v-model="passwordForm.old_password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input v-model="passwordForm.new_password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm_password">
            <el-input v-model="passwordForm.confirm_password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item size="medium">
            <el-button :disabled="isDisabled" type="primary" @click="submitForm">确认修改</el-button>
            <el-button type="info" @click="$router.back()">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import adminRequest from 'network/http'
export default {
  name: 'Edit',
  inject: ['reload'],
  data() {
    //校验规则
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length < 5 || value.length > 20) {
        callback(new Error('密码长度不合法'))
      } else {
        callback()
      }
    }
    var checkNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length < 5 || value.length > 20) {
        callback(new Error('密码长度不合法'))
      } else if (value === this.passwordForm.old_password) {
        callback(new Error('请勿与近期使用密码一致'))
      } else {
        callback()
      }
    }
    var checkConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value !== this.passwordForm.new_password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        this.isDisabled = false
        callback()
      }
    }
    return {
      passwordForm: {
        old_password: '',
        new_password: '',
        confirm_password: ''
      },
      isDisabled: true,
      rules: {
        old_password: [{ validator: checkPassword, trigger: 'blur' }],
        new_password: [{ validator: checkNewPassword, trigger: 'blur' }],
        confirm_password: [{ validator: checkConfirm, trigger: 'blur' }]
      }
    }
  },
  methods: {
    //提交表单
    submitForm() {
      console.log(this.passwordForm)
      adminRequest
        .post('/admin/editPassword', this.passwordForm, {
          headers: { Authorization: localStorage.getItem('TOKEN') }
        })
        .then(res => {
          if (res.data.message === 'PASSWORD_WRONG') {
            this.$message({
              type: 'warning',
              message: '密码错误',
              onClose: () => {
                this.reload()
              }
            })
            return
          } else if (res.data.message === 'UPDATE_SUCCESS') {
            this.$message({
              type: 'success',
              message: '更新成功',
              onClose: () => {
                this.$router.push('/admin/home/')
              }
            })
            return
          } else if (res.data.message === 'UPDATE_FAIL') {
            this.$message({
              type: 'info',
              message: '更新失败',
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
    }
  }
}
</script>

<style>
.edit {
  height: 100%;
  padding: 18px;
}
.info_body {
  background-color: #f2f6fc;
  margin-top: 18px;
  padding: 18px;
  border-radius: 8px;
}
</style>