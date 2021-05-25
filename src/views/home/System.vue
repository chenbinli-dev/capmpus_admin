<template>
  <div id="system" class="system">
    <el-row class="info_body">
      <el-col :span="24">
        <el-calendar v-model="value"></el-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import adminRequest from 'network/http'
export default {
  name: 'System',
  data() {
    return {
      value: new Date(),
      new_total: 0
    }
  },
  methods: {
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
    }
  },
  created() {
    this.getNewStudentTotal()
    this.$notify({
      title: '工作消息',
      message: '当前有' + this.new_total + '条学生信息待处理',
      type: 'warning',
      position: 'bottom-right',
      offset: 100
    })
  }
}
</script>

<style scoped>
.system {
  height: 100%;
  padding: 0 18px;
}
.info_body {
  background-color: #f2f6fc;
  margin-top: 18px;
  padding: 18px;
  border-radius: 8px;
}
.el-calendar-table .el-calendar-day {
  width: 60px;
  height: 60px;
}
</style>