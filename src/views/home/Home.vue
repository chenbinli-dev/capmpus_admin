<template>
  <div id="adminHome" class="adminHome">
    <el-row type="flex" align="middle" justify="space-between" class="header">
      <el-col :span="6" class="icon-title">校园代跑平台后台管理</el-col>
      <el-col :span="3" :push="8">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            系统设置
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="edit">修改密码</el-dropdown-item>
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="4" :push="2" class="admin-name">管理员admin</el-col>
    </el-row>
    <!--侧边菜单-->
    <el-row class="home-body">
      <el-col :span="5" class="menu">
        <el-menu active-text-color="#ffd300" :router="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/home/userInfo">用户信息查看</el-menu-item>
            <el-menu-item index="/admin/home/userBan">用户账号禁用</el-menu-item>
            <el-menu-item index="/admin/home/complain">用户投诉处理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>代跑任务管理</span>
            </template>
            <el-menu-item index="/admin/home/taskInfo">任务信息查看</el-menu-item>
            <el-menu-item index="/admin/home/taskLock">任务锁定</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-coin"></i>
              <span>支付管理</span>
            </template>
            <el-menu-item index="/admin/home/userBalance">余额流水查看</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-circle-check"></i>
              <span>学生认证</span>
            </template>
            <el-menu-item index="/admin/home/student">学生信息审核</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-pie-chart"></i>
              <span>数据可视化</span>
            </template>
            <el-menu-item index="/admin/home/userData">用户数据</el-menu-item>
            <el-menu-item index="/admin/home/taskData">任务数据</el-menu-item>
            <el-menu-item index="/admin/home/balanceData">余额数据</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="19">
        <router-view v-if="isRouterAlive" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AdminHome',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    //控制页面刷新
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    //退出登录
    handleCommand(command) {
      if (command === 'exit') {
        this.$confirm('确认退出后台管理吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            localStorage.clear()
            this.$router.push('/admin/login')
            this.$message({
              type: 'success',
              message: '退出成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出操作'
            })
          })
      } else {
        //修改密码
        this.$router.push('/admin/home/edit')
      }
    }
  }
}
</script>

<style>
.adminHome {
  height: 100%;
}
.header {
  height: 80px;
  padding: 0 20px;
  background-color: #ffd300;
}
.icon-title {
  font-size: 25px;
  color: #fff;
}
.el-dropdown-link {
  font-size: 16px;
  cursor: pointer;
  color: #ffffff;
}
.el-icon-arrow-down {
  font-size: 16px;
}
.admin-name {
  font-size: 16px;
  color: #ffffff;
}
.el-dropdown-menu__item:hover {
  color: #ffd300;
}
.home-body {
  height: 100%;
}
.menu {
  height: 100%;
  background-color: #ffffff;
}
</style>