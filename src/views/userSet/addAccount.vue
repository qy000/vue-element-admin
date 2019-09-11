<template>
  <div class="dashboard-container userSet user-password">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="账号" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-button type="primary" @click="onSubmit('form')">创建</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [{ required: true, message: '请输入正确的账号' }],
        password: [{ required: true, message: '请输入正确的密码' }]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$store.dispatch('user/userPost', { url: 'user/add', data: this.form })
          .then(res => {
            this.$message.success(res.msg)
            this.form.userName = ''
            this.form.password = ''
            this.$refs[formName].resetFields()
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .user-password{
    .el-form{
      width: 300px;
    }
  }
</style>
