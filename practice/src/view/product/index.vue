<template>
  <div class="app-container">
    <el-card shadow="never" style="margin-bottom: 10px" :class="{'no-padding-bottom': advanced}">
      <div class="table-page-search-wrapper">
        <!-- 绑定了一个是回车事件, 并且阻止表单的默认提交-->
        <el-form :inline="true" :class="{'no-margin-bottom': !advanced}" size="mini" @keydown.enter.native="doSearch" @submit.native.prevent>
          <el-row :gutter="30">
            <el-col :md="8" :sm="24">
              <el-form-item label="客户名称">
                <!-- 绑定表单内容 -->
                <el-input v-model.trim="queryParam.clientName" placeholder="请输入客户名称" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="项目名称">
                <!-- 绑定表单内容 -->
                <el-input v-model.trim="queryParam.projectName" placeholder="请输入项目名称" />
              </el-form-item>
            </el-col>
            <!-- 通过advance值来控制额外的搜索表单显示与否 -->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="项目状态">
                  <el-select
                    ref="select-projectStatus"
                    v-model="queryParam.projectStatus"
                    style="width: 100%;"
                    placeholder="请选择项目状态"
                    @visible-change="e=>isShowSelectOptions(e,'projectStatus')"
                    @clear="queryParam.projectStatus = undefined"
                  >
                    <el-option v-for="item in projectStatusDict" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="渠道公司">
                  <el-select
                    ref="select-channelCompany"
                    v-model="queryParam.channelCompany"
                    style="width: 100%;"
                    placeholder="请选择渠道公司"
                    @visible-change="e=>isShowSelectOptions(e,'channelCompany')"
                    @clear="queryParam.channelCompany = undefined"
                  >
                    <el-option v-for="item in channelCompanyDict" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="产品公司">
                  <el-select
                    ref="select-productCompany"
                    v-model="queryParam.productCompany"
                    style="width: 100%;"
                    placeholder="请选择产品公司"
                    @visible-change="e=>isShowSelectOptions(e,'productCompany')"
                    @clear="queryParam.productCompany = undefined"
                  >
                    <el-option v-for="item in productCompanyDict" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="queryParam.createdTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    placeholder="请选择创建时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="考核指标">
                  <el-select
                    ref="select-targetType"
                    v-model="queryParam.targetType"
                    style="width: 100%;"
                    placeholder="请选择考核指标"
                    @visible-change="e=>isShowSelectOptions(e,'targetType')"
                    @change="targetTypeQueryParamChange"
                    @clear="queryParam.targetType = undefined"
                  >
                    <el-option key="" label="全部" value="" />
                    <el-option v-for="item in targetTypeDict" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="业务类型">
                  <el-select
                    v-if="queryParam.targetType === '1'"
                    ref="select-bizType"
                    v-model="queryParam.bizType"
                    style="width: 100%;"
                    placeholder="请选择业务类型"
                    @visible-change="e=>isShowSelectOptions(e,'bizType')"
                    @clear="queryParam.bizType = undefined"
                  >
                    <el-option v-for="item in privateCustomerDict" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-select
                    v-else-if="queryParam.targetType === '2'"
                    ref="select-bizType"
                    v-model="queryParam.bizType"
                    style="width: 100%;"
                    placeholder="请选择业务类型"
                    @visible-change="e=>isShowSelectOptions(e,'bizType')"
                    @clear="queryParam.bizType = undefined"
                  >
                    <el-option v-for="item in publicCustomerDict" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-select
                    v-else-if="queryParam.targetType === '3'"
                    ref="select-bizType"
                    v-model="queryParam.bizType"
                    style="width: 100%;"
                    placeholder="请选择业务类型"
                    @visible-change="e=>isShowSelectOptions(e,'bizType')"
                    @clear="queryParam.bizType = undefined"
                  >
                    <el-option v-for="item in coordinationCustomerDict" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-select
                    v-else
                    ref="select-bizType"
                    v-model="queryParam.bizType"
                    style="width: 100%;"
                    placeholder="请选择业务类型"
                    @visible-change="e=>isShowSelectOptions(e,'bizType')"
                    @clear="queryParam.bizType = undefined"
                  >
                    <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :md="8" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden', 'margin-bottom': '0px' } || {} "
              >
                <el-button type="primary" native-type="submit" @click="doSearch">查询</el-button>
                <el-button style="margin-left: 8px" @click="doResetQuery">重置</el-button>
                <!-- 通过点击事件，来选择隐藏或显示额外的表单搜索条件 -->
                <a style="margin-left: 8px" @click="toggleAdvanced">
                  <!-- 三元运算符，advance为true 取收起，false取展开 -->
                  {{ advanced ? '收起' : '展开' }}
                  <!-- 同上的处理，显示不同的按钮，up/down -->
                  <i :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
                </a>
              </span>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

          <!-- 以上为表单部分 -->
            <!-- 以下为table表格部分 -->
            <!-- =====================》 -->
    <el-card shadow="never">

      <div class="table-operator">
        <el-button type="primary" size="mini" style="margin-left: 0" @click="doAdd">新增项目</el-button>
        <el-button size="mini" style="margin-left: 20px" @click="doDownload">申请导出</el-button>
      </div>

      <!-- <div class="tabs-operator">
        <a class="tabs-btn" :class="{'cur': queryParam.projectType === '0'}" @click="handleClick('0')">集团协同项目</a>
        <a class="tabs-btn" :class="{'cur': queryParam.projectType === '1'}" @click="handleClick('1')">子公司协同项目</a>
      </div> -->
      <el-table ref="table" v-loading="loading" class="table" :data="loadData" :header-cell-style="{padding: '15px 0 12px', 'font-size': '14px', color: '#333333', background: '#f5f5f5'}" :cell-style="{'font-size': '14px'}">
        <template slot="empty">
          <el-empty :image-size="100" description="暂无数据" />
        </template>
        <el-table-column prop="clientName" label="客户名称" width="260" align="left" />
        <el-table-column prop="projectName" label="项目名称" width="180" align="left">
          <template slot-scope="scope">
            <a v-if="scope.row.projectName !== '-'" class="link" style="margin-right: 10px" @click="doDetail(scope.row)">{{ scope.row.projectName }}</a>
            <span v-else style="margin-right: 10px">{{ scope.row.name || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="channelCompany" label="渠道公司" width="220" align="left" />
        <el-table-column prop="productCompany" label="产品公司" width="220" align="left" />
        <el-table-column prop="targetTypeName" label="考核指标" width="150" align="center" />
        <el-table-column prop="bizTypeName" label="业务类型" width="150" align="center" />
        <el-table-column prop="projectStatusName" label="项目状态" width="150" align="center" />
        <el-table-column prop="approvalStatusName" label="审批状态" width="150" align="center" />
        <el-table-column prop="createdBy" label="创建人" width="150" align="center" />
        <el-table-column prop="createdTime" label="创建时间" width="120" align="center" :formatter="timeFormatter" />
        <el-table-column prop="" label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="doProjectAdd(scope.row)">更新动态</el-button>
            <el-popconfirm title="确认删除吗？" style="margin-left: 10px" @confirm="doDelete(scope.row)">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page.current"
        :limit.sync="page.size"
        @pagination="getList"
      />

    </el-card>
    <!-- 以下两个弹窗可暂时不管 -->
    <el-dialog
      title="新增项目"
      :visible.sync="dialogVisible"
      :width="type === '0' ? '500px' : '1200px'"
      :before-close="onClose"
    >
      <div v-if="type === '0'" class="project-select-box">
        <div class="project-select project-select-group" @click="typeChange('1')"><h3>集团协同项目</h3></div>
        <div class="project-select project-select-subsidiary" @click="typeChange('2')"><h3>子公司协同项目</h3></div>
      </div>
      <div v-if="type === '1'">
        <group-form project-type="0" @onDialogCancel="onDialogCancel" />
      </div>
      <div v-if="type === '2'">
        <subsidiary-form project-type="1" @onDialogCancel="onDialogCancel" />
      </div>
      <!--      <template v-if="type !== '0'" slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </template>-->
    </el-dialog>

    <el-dialog
      title="新增项目动态"
      :visible.sync="projectDialogVisible"
      width="600px"
      :before-close="onProjectClose"
    >
      <div style="padding: 0 30px 0 20px">
        <el-form ref="projectForm" :rules="projectRules" :model="projectForm" label-width="80px">
          <el-form-item label="日期" prop="progressDate">
            <el-date-picker
              v-model="projectForm.progressDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="projectPickerOptions"
              placeholder="请选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer" class="dialog-footer">
        <el-button @click="onProjectClose">取 消</el-button>
        <el-button type="primary" @click="onProjectConfirm">确 定</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import { cleanForm } from '@/utils'
import Pagination from '@/components/Pagination'
// import { download, urlDownlaod } from '@/utils/download'
// import { ProjectExport } from '@/api/project'

export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      advanced: true,
      queryParam: this.resetQuery(),
      projectStatusDict: [],
      approvalStatusDict: [],
      channelCompanyDict: [],
      productCompanyDict: [],
      targetTypeDict: [],
      privateCustomerDict: [],
      publicCustomerDict: [],
      coordinationCustomerDict: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now()
        }
      },
      page: {
        current: 1,
        size: 10
      },
      total: 0,
      loadData: [],
      loading: false,
      dialogVisible: false,
      type: '0',
      form: {},
      rules: {},
      projectDialogVisible: false,
      projectId: undefined,
      projectForm: {
        progressDate: undefined,
        progressDescription: undefined
      },
      projectRules: {
        progressDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        progressDescription: [
          { required: true, message: '请输入项目动态', trigger: 'change' },
          { max: 1000, message: '限输入500个字符，支持中英文、数字和特殊字符', trigger: 'change' }
        ]
      },
      projectPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created() {
    window.addEventListener('keydown', this.keyDown)
  },
  mounted() {
    // this.initDict()
    // this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    // initDict() {
    //   this.$http('ProjectEnums').then(res => {})
    //   this.$http('ProjectEnumListByKey', { key: 'projectStatuses' }).then(res => {
    //     this.projectStatusDict = res.map(item => {
    //       return { value: item.code, label: item.value }
    //     })
    //   })
    //   this.$http('ProjectEnumListByKey', { key: 'approvalStatuses' }).then(res => {
    //     this.approvalStatusDict = res.map(item => {
    //       return { value: item.code, label: item.value }
    //     })
    //   })
    //   this.$http('ProjectEnumListByKey', { key: 'companies' }).then(res => {
    //     this.channelCompanyDict = res.map(item => {
    //       return { value: item.companyCode, label: item.companyName }
    //     })
    //   })
    //   this.$http('ProjectEnumListByKey', { key: 'productCompanies' }).then(res => {
    //     this.productCompanyDict = res.map(item => {
    //       return { value: item.companyCode, label: item.companyName }
    //     })
    //   })
    //   this.$http('ProjectEnumListByKey', { key: 'targetTypes' }).then(res => {
    //     this.targetTypeDict = res.map(item => {
    //       return { value: item.code, label: item.name }
    //     })
    //   })
    //   this.$http('ProjectEnumListByKey', { key: 'bizTypes' }).then(res => {
    //     this.privateCustomerDict = res[0].bizList.map(item => {
    //       return { value: item.code, label: item.name }
    //     })
    //     this.publicCustomerDict = res[1].bizList.map(item => {
    //       return { value: item.code, label: item.name }
    //     })
    //     this.coordinationCustomerDict = res[2].bizList.map(item => {
    //       return { value: item.code, label: item.name }
    //     })
    //   })
    // },
    getList() {
      console.log('here',cleanForm(this.queryParam))
      // loading
      this.loading = true
      // 用定时器模拟接口请求
      setTimeout(() => {
        this.loading = false
             // 写死一点假数据用于table显示
      this.loadData= [
            {
                "id": "20230728111615405",
                "clientName": "恒大集团有限公司",
                "clientId": "1587703494171688960",
                "isImportantClient": "0",
                "projectName": "zls-集团项目-0728-1",
                "projectStatus": "1",
                "projectStatusName": "进行",
                "approvalStatus": "3",
                "approvalStatusName": "审批通过",
                "channelCompany": "湖南财信金融控股集团有限公司",
                "productCompany": null,
                "createdBy": "许磊",
                "createdTime": "2023-07-28",
                "targetType": null,
                "targetTypeName": null,
                "bizType": null,
                "bizTypeName": null,
                "projectType": "0"
            },
            {
                "id": "2023072518135065900",
                "clientName": "长沙鑫民房地产开发有限公司",
                "clientId": "900000000000001170",
                "isImportantClient": "0",
                "projectName": "test1",
                "projectStatus": "1",
                "projectStatusName": "进行",
                "approvalStatus": "3",
                "approvalStatusName": "审批通过",
                "channelCompany": "湖南财信金融控股集团有限公司",
                "productCompany": "湖南财信金融控股集团有限公司、财信证券股份有限公司",
                "createdBy": null,
                "createdTime": "2023-07-25",
                "targetType": null,
                "targetTypeName": null,
                "bizType": null,
                "bizTypeName": null,
                "projectType": "0"
            },
            {
                "id": "2023072520080852800",
                "clientName": "湖南省财信信托有限责任公司",
                "clientId": "900000000000001162",
                "isImportantClient": "1",
                "projectName": "test2",
                "projectStatus": "2",
                "projectStatusName": "暂缓",
                "approvalStatus": "3",
                "approvalStatusName": "审批通过",
                "channelCompany": "湖南财信金融控股集团有限公司",
                "productCompany": "湖南财信金融控股集团有限公司、湖南省财信信托有限责任公司",
                "createdBy": null,
                "createdTime": "2023-07-25",
                "targetType": null,
                "targetTypeName": null,
                "bizType": null,
                "bizTypeName": null,
                "projectType": "0"
            },
            {
                "id": "2023072520422072201",
                "clientName": "湖南省财信信托有限责任公司",
                "clientId": "900000000000001162",
                "isImportantClient": "1",
                "projectName": "test2222222",
                "projectStatus": "1",
                "projectStatusName": "进行",
                "approvalStatus": "3",
                "approvalStatusName": "审批通过",
                "channelCompany": "湖南财信金融控股集团有限公司",
                "productCompany": "湖南财信金融控股集团有限公司、湖南省财信信托有限责任公司、湖南省财信资产管理有限公司",
                "createdBy": null,
                "createdTime": "2023-07-25",
                "targetType": null,
                "targetTypeName": null,
                "bizType": null,
                "bizTypeName": null,
                "projectType": "0"
            },
            {
                "id": "2023072611183860903",
                "clientName": "张家界天门旅游经济投资有限责任公司",
                "clientId": "1547024740835655680",
                "isImportantClient": "0",
                "projectName": "test集团项目222",
                "projectStatus": "1",
                "projectStatusName": "进行",
                "approvalStatus": "3",
                "approvalStatusName": "审批通过",
                "channelCompany": "湖南财信金融控股集团有限公司",
                "productCompany": "湖南财信金融控股集团有限公司",
                "createdBy": null,
                "createdTime": "2023-07-26",
                "targetType": null,
                "targetTypeName": null,
                "bizType": null,
                "bizTypeName": null,
                "projectType": "0"
            },
            {
                "id": "2023072612470464300",
                "clientName": "张家界市市场监督管理局",
                "clientId": "900000000000001191",
                "isImportantClient": "0",
                "projectName": "金乌纪",
                "projectStatus": "1",
                "projectStatusName": "进行",
                "approvalStatus": "3",
                "approvalStatusName": "审批通过",
                "channelCompany": "湖南财信金融控股集团有限公司",
                "productCompany": "湖南财信金融控股集团有限公司、财信证券股份有限公司",
                "createdBy": null,
                "createdTime": "2023-07-26",
                "targetType": null,
                "targetTypeName": null,
                "bizType": null,
                "bizTypeName": null,
                "projectType": "0"
            },
            {
                "id": "2023072714353098100",
                "clientName": "湖南省财信信托有限责任公司",
                "clientId": "900000000000001162",
                "isImportantClient": "1",
                "projectName": "123444321",
                "projectStatus": "1",
                "projectStatusName": "进行",
                "approvalStatus": "3",
                "approvalStatusName": "审批通过",
                "channelCompany": "湖南财信金融控股集团有限公司",
                "productCompany": null,
                "createdBy": "许磊",
                "createdTime": "2023-07-27",
                "targetType": null,
                "targetTypeName": null,
                "bizType": null,
                "bizTypeName": null,
                "projectType": "0"
            }
        ]
      }, 1000);
 
      // this.$http('ProjectList', { page: this.page, query: cleanForm(this.queryParam) }).then(res => {
      //   this.loadData = res.records
      //   this.total = res.total
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    resetQuery() {
      this.page = {
        current: 1,
        size: 10
      }
      return {
        projectType: '0',
        clientName: undefined,
        projectName: undefined,
        projectStatus: undefined,
        channelCompany: undefined,
        productCompany: undefined,
        createdTime: undefined,
        targetType: undefined,
        bizType: undefined
      }
    },
    doSearch() {
      this.page.current = 1
      this.page.size = 10
      this.getList()
    },
    keyDown(e) {
      if (e.keyCode === 13) {
        this.doSearch()
      }
    },
    doResetQuery() {
      this.queryParam = this.resetQuery()
      this.getList()
    },
    targetTypeQueryParamChange() {
      this.$set(this.queryParam, 'bizType', undefined)
    },
        // 通过advance值来处理显示隐藏
    toggleAdvanced() {
      this.advanced = !this.advanced
    },




    // 以下方法暂时不用看
    handleClick(type) {
      this.queryParam.projectType = type
      this.getList()
    },
    doAdd() {
      this.dialogVisible = true
    },
    doEdit(row) {
      this.dialogVisible = true
      this.form = {}
    },
    doUpdate(row) {

    },
    doDelete(row) {
      this.$http('ProjectDelete', { id: row.id }).then(res => {
        this.$message.success('操作成功')
        this.getList()
      })
    },
    onCancel() {
      this.onClose()
    },
    onDialogCancel() {
      this.dialogVisible = false
      this.getList()
      this.$nextTick(() => {
        this.type = '0'
      })
    },
    onClose() {
      this.dialogVisible = false
      this.form = {}
      this.$nextTick(() => {
        this.type = '0'
      })
      /* this.$nextTick(() => {
        this.$refs.form.resetFields()
      }) */
    },
    onConfirm() {
      console.log('this.form', this.form)

      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form
          }
          this.$http('', params).then(res => {
            this.$message.success('操作成功')
            this.getList()
            this.onCancel()
          }).catch(() => {
            this.onCancel()
          })
        }
      })
    },
    typeChange(type) {
      this.type = type
    },
    doDownload() {
      this.downloadLoading = true
      ProjectExport(cleanForm(this.queryParam)).then(res => {
        download(res)
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    isShowSelectOptions(isShowSelectOptions, key) {
      if (!isShowSelectOptions) this.$refs['select-' + key].blur()
    },
    projectStatusFormatter(row, column, cellValue, index) {
      if (cellValue !== '-') {
        this.projectStatusDict.map(item => {
          if (item.value === cellValue) {
            cellValue = item.label
          }
        })
        return cellValue
      } else {
        return cellValue
      }
    },
    approvalStatusFormatter(row, column, cellValue, index) {
      if (cellValue !== '-') {
        this.approvalStatusDict.map(item => {
          if (item.value === cellValue) {
            cellValue = item.label
          }
        })
        return cellValue
      } else {
        return cellValue
      }
    },
    timeFormatter(row, column, cellValue, index) {
      return cellValue ? moment(cellValue).format('YYYY-MM-DD') : '-'
    },
    doDetail(row) {
      if (row.projectType === '0') {
        this.$router.push({ name: 'GroupDetail', query: { id: row.id }})
      } else if (row.projectType === '1') {
        this.$router.push({ name: 'SubsidiaryDetail', query: { id: row.id }})
      }
    },
    doProjectAdd(row) {
      this.projectDialogVisible = true
      this.projectId = row.id
      this.projectForm = {
        progressDate: undefined,
        progressDescription: undefined
      }
      this.$nextTick(() => {
        this.$refs.projectForm.resetFields()
      })
      this.$set(this.projectForm, 'progressDate', moment().format('YYYY-MM-DD'))
    },
    onProjectClose() {
      this.projectDialogVisible = false
      this.projectForm = {
        progressDate: undefined,
        progressDescription: undefined
      }
      this.$nextTick(() => {
        this.$refs.projectForm.resetFields()
      })
    },
    onProjectConfirm() {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          const params = {
            ...this.projectForm,
            ...{ projectId: this.projectId }
          }
          this.$http('ProjectProgressAdd', params).then(res => {
            this.$message.success('操作成功')
            this.onProjectClose()
          }).catch(() => {
            this.onProjectClose()
          })
        }
      })
    },
    fileChange(e) {
      const arr = []
      e.map(item => {
        const obj = {
          uniqueId: item.uniqueId,
          fileName: item.name,
          fileSize: item.fileSize.toString(),
          fileType: item.fileType.toString()
        }
        arr.push(obj)
      })
      this.$set(this.projectForm, 'attachmentList', arr)
    },
    onPreview(row) {
      const { uniqueId } = row
      if (!uniqueId) {
        this.$message.warning('uniqueId为空')
        return
      }
      this.$http('getPreviewUrl', { uniqueId: uniqueId }).then(res => {
        window.open(res, '_blank')
      })
    },
    onDownload(row) {
      if (!row.uniqueId) {
        return
      }
      const param = {
        uniqueId: row.uniqueId
      }
      this.$http('getDownUrl', param).then(res => {
        urlDownlaod(res)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: #409EFF;
}
.tabs-operator {
  .tabs-btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 7px 15px;
    font-size: 14px;
    border-radius: 2px;
    &.cur {
      border: 1px solid #407FFE;
      color: #407FFE;
    }
  }
}

.project-select-box {
  display: flex;
  justify-content: space-around;
  margin-bottom: 25px;
  .project-select{
    width: 160px;
    height: 60px;
    padding-left: 50px;
    border: 1px solid #407ffe1f;
    border-radius: 6px;
    cursor: pointer;
    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 60px;
    }
    &.project-select-group {
      // background: url("~@/assets/img/icon_project_1.png") no-repeat 2px center;
      transition: background 2s ease-in-out;
    }
    &.project-select-subsidiary {
      // background: url("~@/assets/img/icon_project_2.png") no-repeat 10px center;
      transition: background 2s ease-in-out;
    }
    &:hover {
      border: 1px solid #407ffe;
    }
  }
}
</style>
