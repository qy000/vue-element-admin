<template>
  <div class="dashboard-container userSet user-psd">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="账号" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="旧密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" />
      </el-form-item>
      <el-button type="primary" @click="onSubmit('form')">重置</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      form: {
        password: '',
        newPassword: '',
        userName: ''
      },
      rules: {
        userName: [{ required: true, message: '请输入正确的信息' }],
        password: [{ required: true, message: '请输入正确的信息' }],
        newPassword: [{ required: true, message: '请输入正确的信息' }]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$store.dispatch('user/userPost', { url: 'user/updatePassword', data: this.form })
          .then(res => {
            this.$message.success(res.msg)
            this.form.userName = ''
            this.form.password = ''
            this.$refs[formName].resetFields()
            setTimeout(() => {
              this.$store.dispatch('user/logout')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }, 1500)
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .user-psd{
    .el-form{
      width: 300px;
    }
  }
</style>
