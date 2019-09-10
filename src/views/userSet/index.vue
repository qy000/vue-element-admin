<template>
  <div class="dashboard-container userSet user-psd">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="旧密码" prop="old">
        <el-input v-model="form.old" />
      </el-form-item>
      <el-form-item label="新密码" prop="new">
        <el-input v-model="form.new" />
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
        old: '',
        new: ''
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
