<template>
  <div class="dashboard-container userSet user-psd">
    <el-table :data="list" width="100%">
      <el-table-column
        prop="id"
        label="用户id"
      />
      <el-table-column
        prop="userName"
        label="用户名称"
      />
      <el-table-column
        prop="userRole"
        label="用户权限"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      list: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$store.dispatch('user/userPost', { url: 'user/queryWithoutAdmin', data: this.form })
        .then(res => {
          this.list = res.data
        })
    },
    handleClick(id) {
      // user/delete
      console.log(id)
      if (!id) return false
      this.$store.dispatch('user/userPost', { url: 'user/delete', data: { id: id }})
        .then(res => {
          this.$message.success(res.msg)
          this.getList()
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
