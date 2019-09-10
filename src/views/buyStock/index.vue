<template>
  <div class="dashboard-container buy-stock-index">
    <div class="page-handle">
      <el-input v-model="listQuery.keyword" placeholder="关键词" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-date-picker
        v-model="startEnd"
        type="daterange"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :qy-time="getStartEnd"
      />
      <el-button
        icon="el-icon-search"
        type="primary"
        :loading="listLoading"
        :disabled="listLoading"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        type="primary"
        :loading="listLoading"
        :disabled="listLoading"
        @click="excelExport"
      ><i class="el-icon-upload el-icon--left" /> 导出 </el-button>
    </div>
    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      class="stock-index-table"
      :data="list"
      border
      fit
      style="width: 100%;"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <!-- highlight-current-row  @sort-change="sortChange"-->
      <!--<el-table-column type="selection" width="50" align="center" />-->
      <el-table-column label="认购时间" prop="createTime" align="center" width="100" fixed />
      <el-table-column label="用户姓名" prop="stockName" align="center" />
      <el-table-column label="股票代码" prop="stockCode" align="center" />
      <el-table-column label="股票名称" prop="stockName" align="center" />
      <el-table-column label="申购类别" prop="type" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.type | buyType }}
        </template>
      </el-table-column>
      <el-table-column label="申购数量" prop="count" align="center" />
      <el-table-column label="融资比例" prop="financingRate" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.financingRate | moneyRatio('%') }}
        </template>
      </el-table-column>
      <el-table-column label="申购金额" prop="subscribeAmount" align="center">
        <template slot-scope="scope">
          {{ scope.row.subscribeAmount | moneyRatio('元') }}
        </template>
      </el-table-column>
      <el-table-column label="所需现金" prop="requiredCash" align="center">
        <template slot-scope="scope">
          {{ scope.row.requiredCash | moneyRatio('元') }}
        </template>
      </el-table-column>
      <el-table-column label="申购手续费" prop="serviceCharge" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.serviceCharge | moneyRatio('元') }}
        </template>
      </el-table-column>
      <el-table-column label="利息" prop="interest" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.interest | moneyRatio('元') }}
        </template>
      </el-table-column>
      <el-table-column label="申购总费用" prop="totalCost" align="center" fixed="right">
        <template slot-scope="scope">
          {{ scope.row.totalCost | moneyRatio('元') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="100">
        <template slot-scope="{row, $index}">
          <el-button type="success" @click.native.stop="delStock(row, $index)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogVisible" :title="showInfo.title || '查看'" @close="dialogClose">
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="用户姓名"><span v-text="showInfo.info.userName" /></el-form-item>
        <el-form-item label="申购id"><span v-text="showInfo.info.id" /></el-form-item>
        <el-form-item label="股票名称"><span v-text="showInfo.info.stockName" /></el-form-item>
        <el-form-item label="股票代码"><span v-text="showInfo.info.stockCode" /></el-form-item>
        <el-form-item label="股票id"><span v-text="showInfo.info.stockId" /></el-form-item>
        <el-form-item label="申购类别"><span> {{ showInfo.info.type | buyType }} </span></el-form-item>
        <el-form-item label="申购数量"><span v-text="showInfo.info.count" /></el-form-item>
        <el-form-item label="融资比例"><span> {{ showInfo.info.financingRate | moneyRatio('%') }} </span></el-form-item>
        <el-form-item label="利率"><span v-text="showInfo.info.interestRate" /></el-form-item>
        <el-form-item label="费率"><span v-text="showInfo.info.premiumRate" /></el-form-item>
        <el-form-item label="招股价"><span>{{ showInfo.info.issuePrice | moneyRatio('元') }}</span></el-form-item>
        <el-form-item label="申购金额"><span>{{ showInfo.info.subscribeAmount | moneyRatio('元') }}</span></el-form-item>
        <el-form-item label="所需现金"><span>{{ showInfo.info.requiredCash | moneyRatio('元') }}</span></el-form-item>
        <el-form-item label="申购手续费"><span>{{ showInfo.info.serviceCharge | moneyRatio('元') }}</span></el-form-item>
        <el-form-item label="申购总费用"><span>{{ showInfo.info.totalCost | moneyRatio('元') }}</span></el-form-item>
        <el-form-item label="利息"><span>{{ showInfo.info.interest | moneyRatio('元') }}</span></el-form-item>
        <el-form-item label="认购时间"><span v-text="showInfo.info.createTime" /></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
// import axios from 'axios'
export default {
  name: 'BuyStock',
  components: { Pagination },
  filters: {
    buyType(val) {
      if (val === 1) return '融资认购'
      if (val === 0) return '现金申购'
      return '未知'
    },
    moneyRatio(val, str) {
      if (val <= 0) return val
      return val + str
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        status: 3, // 数据状态 3默认所有
        pageSize: 10, // 一页几条
        pageNo: 1, // 第几页
        pages: 1, // 页数
        orderType: 0, // 默认排序
        orderColumn: 0,
        startTime: '',
        endTime: '',
        keyword: ''
      },
      total: 0,
      dialogVisible: false,
      showInfo: {
        title: '',
        info: {}
      },
      startEnd: ''
    }
  },
  computed: {
    getDelId() {
      return {
        url: this.delArray.length > 1 ? 'user/batchDelete' : 'user/Delete',
        id: this.delArray.toString()
      }
    },
    lookConfig() {
      return this.addEdit.type === 'look'
    },
    getStartEnd() {
      if (this.startEnd) {
        const self = this
        self.listQuery.startTime = this.startEnd[0]
        self.listQuery.endTime = this.startEnd[1]
      }
      return this.startEnd
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      this.$store.dispatch('user/userPost', { url: 'subscription/queryList', data: this.listQuery })
        .then(res => {
          this.listLoading = false
          if (Number.parseInt((res.rescode)) === 200) {
            const data = res.data
            this.list = data.dataList
            this.total = data.total
            this.listQuery.pages = data.pages
          }
        })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    excelExport() {
      if (!this.listQuery.startTime || !this.listQuery.endTime) {
        this.selfMessage({ msg: '请选择开始时间和结束时间', type: 'warning' })
        return false
      }
      var a = document.createElement('a')
      a.setAttribute('href', process.env.VUE_APP_BASE_API + '/subscription/excelExport?' + this.listQuery.startTime + '&' + this.listQuery.endTime)
      a.setAttribute('target', '_blank')
      a.setAttribute('id', 'camnpr')
      document.body.appendChild(a)
      a.click()
      // axios({
      //   url: process.env.VUE_APP_BASE_API + '/subscription/excelExport',
      //   method: 'get',
      //   params: { startTime: this.listQuery.startTime, endTime: this.listQuery.endTime }
      // }).then(res => {
      //   console.log(res)
      //   const blob = new Blob([res.data], { type: 'application/ms-excel' })
      //   const downloadElement = document.createElement('a')
      //   const href = window.URL.createObjectURL(blob) // 创建下载的链接
      //   downloadElement.href = href
      //   // downloadElement.download = `${this.listQuery.startTime} 到 ${this.listQuery.endTime}` + '申购列表.xls' // 下载后文件名
      //   downloadElement.download = '申购列表.xlsx' // 下载后文件名
      //   document.body.appendChild(downloadElement)
      //   downloadElement.click() // 点击下载
      //   document.body.removeChild(downloadElement) // 下载完成移除元素
      //   window.URL.revokeObjectURL(href) // 释放掉blob对象
      // })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$store.dispatch('user/userPost', { url: this.addEdit.url, data: this.stockForm })
          .then(res => {
            if (res.rescode === 200) {
              this.selfMessage({ msg: res.msg })
              // 隐藏 重置 请求
              this.dialogTableVisible = false
              // this.DialogClose()
              this.getList()
            }
          })
      })
    },
    selfMessage(option) {
      this.$message({
        message: option.msg,
        type: option.type || 'success',
        duration: option.duration || 5 * 1000
      })
    },
    toggleSelection(rows) {
      if (!this.$refs.multipleTable) return false
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    DialogClose() {
      this.$refs['stockForm'].resetFields()
      Object.keys(this.stockForm).forEach(item => {
        this.stockForm[item] = ''
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === null) {
        // 全部归零 默认请求
        this.listQuery.orderColumn = this.listQuery.orderType = 0
        return false
      }
      this.listQuery.orderType = order === 'descending' ? 2 : 1 // 排序方式
      let orderColumn = 0
      switch (prop) {
        case 'stockCode':
          orderColumn = 0
          break
        case 'stockName':
          orderColumn = 1
          break
        case 'deadlineTime':
          orderColumn = 2
          break
        case 'listingTime':
          orderColumn = 3
          break
        case 'startTime':
          orderColumn = 4
          break
        default:
          orderColumn = 0
      }
      this.listQuery.orderColumn = orderColumn
      // 自定义排序
      const asc = (num1, num2) => {
        if (num1[prop] < num2[prop]) { return -1 }
        return 0
      }
      const desc = (num1, num2) => {
        if (num1[prop] > num2[prop]) { return -1 }
        return 0
      }
      this.list.sort(order === 'descending' ? desc : asc)
      // 接口排序 this.getList()
    },
    async handleCurrentChange(row) {
      if (!row) return
      const res = await this.getStockInfo(row)
      if (!res) return false
      this.showInfo.title = row.stockName
      this.showInfo.info = res
      this.dialogVisible = true
    },
    async getStockInfo(row) {
      const { id } = row
      if (!id) return false
      const res = await this.$store.dispatch('user/userPost', { url: 'subscription/queryDetail', data: { id: id }})
      if (res.rescode === 200 && res.data) {
        const { deleted } = res.data
        if (deleted !== 0) return false // 不展示
      } else return false
      return res.data
    },
    dialogClose() {
      this.showInfo.info = {}
      this.showInfo.title = ''
    },
    delStock(row) {
      if (!row) return false
      const { id } = row
      this.$store.dispatch('user/userPost', { url: 'subscription/delete', data: { id: id }})
        .then(res => {
          if (res.rescode === 200) {
            this.getList()
          }
          this.selfMessage({ msg: res.msg })
        })
    }
  }
}
</script>
<style lang="scss">
  .buy-stock-index {
  .el-date-editor .el-range-separator {
    width: 10%;
  }
  }
</style>
<style scoped lang="scss">
  .stock-index {
    &-table {
      margin: 30px 0;
    }
  }
  .demo-table-expand {
      font-size: 0;
    }
  .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
  .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
</style>
