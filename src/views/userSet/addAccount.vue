<template>
  <div class="dashboard-container userSet user-psd">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="账号" prop="old">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="new">
        <el-input v-model="form.psd"></el-input>
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
        account: '',
        psd: ''
      },
      rules: {
        old: [{ required: true, message: '请输入正确的信息' }],
        new: [{ required: true, message: '请输入正确的信息' }]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$store.dispatch('user/userPost', { url: '', data: { url: '', data: this.form }})
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
