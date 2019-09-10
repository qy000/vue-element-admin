<template>
  <div class="dashboard-container stock-index">
    <div class="page-handle">
      <el-input v-model="listQuery.keyword" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="请选择" value="">
        <el-option v-for="el in searchList" :key="el.label" :label="el.label" :value="el.value" />
      </el-select>
      <el-button
        icon="el-icon-search"
        type="primary"
        :loading="listLoading"
        :disabled="listLoading"
        @click="handleFilter"
      >搜索</el-button>
      <el-button type="danger" style="margin-left: 20px;" @click="allDel">删除</el-button>
      <el-button type="primary" style="margin: 20px;" @click="addStock">新增</el-button>
      <el-button type="primary" style="margin: 20px;" @click="excelModelExport">下载模板</el-button>
      <el-upload
        ref="upload-demo"
        class="upload-demo"
        accept="xlsx"
        :action="getPushUrl"
        :before-upload="beforeUpload"
        :on-success="upLoadSuccess"
        :on-error="upLoadError"
        :show-file-list="false"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-tooltip class="item" effect="dark" content="只能上传下载的模板" placement="top-start">
          <el-button type="primary">上传模板</el-button>
        </el-tooltip>
      </el-upload>
    </div>
    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      class="stock-index-table"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="股票代码" prop="stockCode" sortable="stockCode" align="center" width="110" />
      <el-table-column label="股票名称" prop="stockName" sortable="stockName" align="center" width="350" />
      <el-table-column label="开始认购时间" prop="startTime" sortable="startTime" align="center" width="150" />
      <el-table-column label="截止认购时间" prop="publishTime" sortable="publishTime" align="center" width="150" />
      <el-table-column label="上市时间" prop="listingTime" sortable="listingTime" align="center" width="150" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="success" @click="lookOver(row, $index)">查看</el-button>
          <el-button type="warning" @click="editHandle(row, $index)">编辑</el-button>
          <!--<el-button type="danger" @click="deleteHandle(row, $index)">删除</el-button>-->
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
    <el-dialog :title="addEdit.title || '股票操作'" :visible.sync="dialogTableVisible" @closed="DialogClose" @open="dialogOpen">
      <el-form ref="stockForm" class="stock-form" :model="stockForm" :rules="rules">
        <el-row v-if="dialogTableVisible" :gutter="20">
          <!--<el-col :span="6"><el-form-item v-if="stockForm.id!==''" prop="id" label="股票ID"><el-input v-model="stockForm.id" :disabled="stockForm.id !== '' || lookConfig" /></el-form-item></el-col>-->
          <el-col :span="6"><el-form-item prop="stockCode" label="股票代码"><el-input v-model.trim="stockForm.stockCode" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="stockName" label="股票名称"><el-input v-model.trim="stockForm.stockName" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="highest" label="最高"><el-input v-model.trim="stockForm.highest" :disabled="lookConfig" @blur="FiltersPoint($event.target.value, 'highest')" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="minimum" label="最低"><el-input v-model.trim="stockForm.minimum" :disabled="lookConfig" @blur="FiltersPoint($event.target.value, 'minimum')" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="businessVolume" label="成交额"><el-input v-model.trim="stockForm.businessVolume" :disabled="lookConfig" @blur="FiltersPoint($event.target.value, 'businessVolume')" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="totalMarketCap" label="总市值"><el-input v-model.trim="stockForm.totalMarketCap" :disabled="lookConfig" @blur="FiltersPoint($event.target.value, 'totalMarketCap')" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="startTime" label="开始认购时间"><el-date-picker v-model.trim="stockForm.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="deadlineTime" label="截止认购时间"><el-date-picker v-model.trim="stockForm.deadlineTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="publishTime" label="公布中签时间"><el-date-picker v-model.trim="stockForm.publishTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="listingTime" label="上市时间"><el-date-picker v-model.trim="stockForm.listingTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="issuePrice" label="招股价"><el-input v-model.trim="stockForm.issuePrice" :disabled="lookConfig" @blur="FiltersPoint($event.target.value, 'issuePrice')" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="premiumRate" label="费率"><el-input v-model.trim="stockForm.premiumRate" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="interestRate" label="利率"><el-input v-model.trim="stockForm.interestRate" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="handShares" label="每手股数"><el-input v-model.trim="stockForm.handShares" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="marketCap" label="市值"><el-input v-model.trim="stockForm.marketCap" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="issueNumber" label="发行数量"><el-input v-model="stockForm.issueNumber" :disabled="lookConfig" /></el-form-item></el-col>
          <el-col :span="6"><el-form-item prop="comment" label="备注"><el-input v-model.trim="stockForm.comment" :disabled="lookConfig" /></el-form-item></el-col>
        </el-row>
        <el-button v-if="!lookConfig" type="primary" @click="submitForm('stockForm')">提交</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
const rulesNumber = (rule, value, callback) => {
  if (value === '' || !(/^\d||\d.+$/.test(value))) {
    callback(new Error('请输入正确的数值'))
  }
  callback()
}
export default {
  name: 'Index',
  components: { Pagination },
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
        keyword: ''
      },
      fileList: [],
      total: 0,
      listSort: null,
      searchList: [
        {
          label: '认购中',
          value: 0
        },
        {
          label: '待上市',
          value: 1
        },
        {
          label: '已上市',
          value: 2
        },
        {
          label: '所有',
          value: 3
        }
      ],
      delArray: false, // 默认为 false
      dialogTableVisible: false,
      stockForm: {
        id: '',
        stockCode: '',
        stockName: '',
        highest: '',
        minimum: '',
        businessVolume: '',
        totalMarketCap: '',
        startTime: '',
        deadlineTime: '',
        publishTime: '',
        listingTime: '',
        issuePrice: '',
        premiumRate: '',
        interestRate: '',
        handShares: '',
        marketCap: '',
        issueNumber: '',
        comment: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      rules: {
        highest: [{ required: true, validator: rulesNumber }],
        minimum: [{ required: true, validator: rulesNumber }],
        businessVolume: [{ required: true, validator: rulesNumber }],
        totalMarketCap: [{ required: true, validator: rulesNumber }],
        handShares: [{ required: true, validator: rulesNumber }],
        marketCap: [{ required: true, validator: rulesNumber }],
        issueNumber: [{ required: true, validator: rulesNumber }],
        premiumRate: [{ required: true, validator: rulesNumber }],
        interestRate: [{ required: true, validator: rulesNumber }],
        issuePrice: [{ required: true, validator: rulesNumber }],
        id: [{ required: true, validator: rulesNumber }],
        stockCode: [{ required: true, message: '请输入正确的信息' }],
        stockName: [{ required: true, message: '请输入正确的信息' }],
        startTime: [{ required: true, message: '请选择时间' }],
        deadlineTime: [{ required: true, message: '请选择时间' }],
        publishTime: [{ required: true, message: '请选择时间' }],
        listingTime: [{ required: true, message: '请选择时间' }]
      },
      addEdit: {
        type: '',
        url: '',
        showID: false,
        title: '股票操作'
      }
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
    getPushUrl() {
      return process.env.VUE_APP_BASE_API + '/stockInfo/excelImport'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // user/queryList
    getList() {
      this.listLoading = true
      this.$store.dispatch('user/queryList', this.listQuery)
        .then(res => {
          this.listLoading = false
          if (Number.parseInt((res.rescode)) === 200) {
            const data = res.data
            this.list = data.dataList
            this.total = data.total
            this.listQuery.pages = data.pages
          }
        })
        .catch(error => {
          this.listLoading = false
          console.log(error)
        })
    },
    // search pageNo = 1
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    // table sort
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
      // const asc = (num1, num2) => {
      //   if (num1[prop] < num2[prop]) { return -1 }
      //   return 0
      // }
      // const desc = (num1, num2) => {
      //   if (num1[prop] > num2[prop]) { return -1 }
      //   return 0
      // }
      // this.list.sort(order === 'descending' ? desc : asc)
      // 接口排序 this.getList()
      this.getList()
    },
    handleSelectionChange(val) {
      this.delArray = false
      this.delArray = val.map(el => el.id)
    },
    // FiltersPoint .0 => 0.1
    FiltersPoint(num, name) {
      this.stockForm[name] = num.toString().indexOf('.') === 0 ? '0' + num : num
    },
    // StockForm submit
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$store.dispatch('user/userPost', { url: this.addEdit.url, data: this.stockForm })
          .then(res => {
            this.selfMessage({ msg: res.msg })
            // resetForm hide get
            this.getList()
            this.dialogTableVisible = false
          })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // element-ui Message
    selfMessage(option) {
      this.$message({
        message: option.msg,
        type: option.type || 'success',
        duration: option.duration || 5 * 1000
      })
    },
    // checkbox
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
    // Dialog
    DialogClose() {
      // form resetFields clear this.stockForm
      Object.keys(this.stockForm).forEach(item => {
        this.stockForm[item] = ''
      })
      //
    },
    dialogOpen() {
      const form = this.$refs['stockForm']
      if (!form) return false
      this.$refs['stockForm'].resetFields()
    },
    handleStock(type, row) {
      this.toggleSelection()
      this.dialogTableVisible = true
    },
    // add edit look
    addStock() {
      console.log('add')
      Object.keys(this.stockForm).forEach(item => {
        console.log(item + ':' + this.stockForm[item])
        this.stockForm[item] = ''
      })
      this.addEdit = {
        type: 'add',
        url: '/stockInfo/add',
        showID: false,
        title: '新增股票'
      }
      this.handleStock()
      return false
    },
    async editHandle(row, index) {
      console.log('editHandle')
      await this.getStockFormData(row.id)
      this.addEdit = {
        type: 'edit',
        url: '/stockInfo/update',
        showID: true,
        title: `编辑${row.stockName}股票`
      }
      this.handleStock('edit', row)
    },
    async lookOver(row, index) {
      console.log('lookOver')
      await this.getStockFormData(row.id)
      this.addEdit = {
        type: 'look',
        url: '',
        showID: false,
        title: `查看${row.stockName}股票`
      }
      this.handleStock('edit', row)
    },
    // get  Detail
    async getQueryDetail(id) {
      if (!id) return false
      const res = await this.$store.dispatch('user/userPost', { url: 'stockInfo/queryDetail', data: { id }})
      return res.data
    },
    async getStockFormData(id) {
      console.log('getStockFormData')
      this.listLoading = true
      const item = await this.getQueryDetail(id)
      if (!item) return false
      // 全部展示 禁用
      Object.keys(item).forEach(key => {
        this.stockForm[key] = item[key]
        console.log(key + ':' + this.stockForm[key])
      })
      this.listLoading = false
    },
    //  del one || del more
    deleteHandle(row, index) {
      this.$store.dispatch('user/Delete', { id: row.id })
        .then(res => {
          console.log(res)
          if (res.rescode === 200) {
            this.selfMessage({ msg: res.msg })
            this.list.splice(index, 1)
          }
        })
    },
    allDel() {
      const { id, url } = this.getDelId
      if (!id || id === 'false') return false
      this.$store.dispatch(url, { id: id, ids: id })
        .then(res => {
          console.log(res)
          if (res.rescode === 200) {
            this.selfMessage({ msg: '删除成功' })
            this.toggleSelection()
            this.getList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // fileList
    handlePreview(file, files) {
      this.fileList = files[0].raw
    },
    handleRemove(file, files) {
      this.fileList = files[0].raw
    },
    handleExceed(file, files) {
      this.fileList = files[0].raw
    },
    beforeRemove(file, files) {},
    beforeUpload(file, files) {
      // this.fileList = files[0].raw
    },
    // excel upload success error excelModelExport
    upLoadSuccess(res) {
      this.fileList = []
      this.selfMessage({ msg: res.msg })
      this.listQuery.pageNo = 1
      this.getList()
    },
    upLoadError(error) {
      this.fileList = []
      let message = JSON.parse(error.message).msg
      if (!message) {
        message = '请稍后重试'
      }
      this.selfMessage({ msg: message, type: 'warning' })
    },
    excelModelExport() {
      var a = document.createElement('a')
      a.setAttribute('href', process.env.VUE_APP_BASE_API + '/stockInfo/excelModelExport')
      a.setAttribute('target', '_blank')
      a.setAttribute('id', 'camnpr')
      document.body.appendChild(a)
      a.click()
    }
  }
}
</script>

<style scoped lang="scss">
  .dashboard {
        &-container {
            margin: 30px;
        }
        &-text {
            font-size: 30px;
            line-height: 46px;
        }
    }
  .stock-index {
    &-table {
      margin: 30px 0;
    }
  }
</style>
<style lang="scss">
  .stock-index {
    .upload-demo{
      display: inline-block;
    }
    .stock-form {
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
      }
    }
  }
</style>
