<template>
    <div class="result-manage-wrapper">
        <div class="search-wrapper">
            <div class="form-wrapper">
                <el-form ref="form" inline :model="form" label-width="80px">
                    <el-form-item label="文件名称" prop="table_name">
                        <el-input clearable placeholder="请输入文件名称" v-model="form.table_name"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="date">
                        <el-date-picker clearable type="daterange" v-model="form.date" value-format="yyyy-MM-dd" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="文件类型" prop="table_type">
                        <el-select clearable v-model="form.table_type" placeholder="请选择任务类型">
                            <el-option v-for="item in fileTypeList" :key="item.id" :value="item.id" :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建人" prop="founder_name">
                        <el-input clearable placeholder="请输入创建人姓名" v-model="form.founder_name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="handle-button-wrapper">
                <el-button @click="searchTable" type="primary">查询</el-button>
                <el-button type="primary" @click="dialogVisible = true">新建</el-button>
                <el-button type="primary" @click="uploadVisible = true">导入</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="序号" width="100" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="name" label="文件名称" align="center" header-align="center">
                    <template slot-scope="{row}">
                        <div @click="() => downloadResult(row)" class="plan-name-wrapper">
                            {{ row.name }}
                            <i class="el-icon-download"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="scheme_name" label="关联方案名称" align="center" header-align="center">
                    <template slot-scope="{row}">
                        <div v-if="row.scheme_name" @click="() => downloadPlan(row)" class="plan-name-wrapper">
                            {{ row.scheme_name }}
                            <i class="el-icon-download"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="文件类型" align="center" header-align="center">
                    <template slot-scope="{row}">
                        {{ row.type_ ? fileTypeList.find(item => item.id == row.type_).name : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="founder_name" label="创建人" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="c_time" label="创建时间" align="center" header-align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.founder_id === userId" @click="() => editTable(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pager-wrapper">
                <el-pagination background layout="prev, pager, next" :total="pager.total"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            title="请选择创建的文件类型"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <div class="dialog-content">
                <el-radio-group v-model="uploadRadio">
                    <el-radio label="1" border>评价汇总表</el-radio>
                    <el-radio label="2" border>缺陷汇总表</el-radio>
                </el-radio-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="请选择上传文件"
            :visible.sync="uploadVisible"
            class="upload-dialog"
            width="30%"
        >
            <div class="upload-wrapper">
                <div class="dialog-content" style="margin-bottom: 12px;">
                    <el-radio-group v-model="uploadRadio">
                        <el-radio label="1" border>评价汇总表</el-radio>
                        <el-radio label="2" border>缺陷汇总表</el-radio>
                    </el-radio-group>
                </div>
                <el-upload
                    class="upload-content"
                    drag
                    action="#"
                    accept=".rar, .zip, .xlsx, .xls"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip">*只能上传rar，zip文件，且不超过50m</div>
                </el-upload>
                <div slot="footer" class="dialog-footer" style="margin-top: 12px;">
                    <el-button @click="handleCancelUpload">取 消</el-button>
                    <el-button type="primary" @click="handleSubmitUpload">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fileTypeList } from '../constant/index'
import { mapGetters } from 'vuex'
import { ADownload } from '../util'

export default {
    data () {
        return {
            dialogVisible: false,
            uploadVisible: false,
            uploadRadio: '',
            uploadFile: null,
            form: {
                date: []
            },
            fileTypeList,
            tableData: [],
            pager: {
                total: 0
            },
            userId: -1,
        }
    },
    computed: {
        ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter', 'userInfo']),
    },
    watch: {
        currentDataSpaceIdGetter(val) {
            console.log(val, 'val')
            if (val === -1) {
                return
            }
            this.getTable()
        },
        userInfo(val) {
            if (!val || !val.id) {
                return;
            }
            this.userId = val.id
        }
    },
    created() {
        this.getTable()
    },
    methods: {
        getTable() {
            if (this.currentDataSpaceIdGetter === -1) {
                return;
            }
            this.$api.getResultTable({
                company_id: 2,
                ...this.form,
                ...this.pager,
                start_time: this.form.date && this.form.date.length ? this.form.date[0] : '',
                end_time: this.form.date && this.form.date.length ? this.form.date[1] : '',
                ...this.pager
            }).then(res => {
                const { code, data } = res
                if (code !== 0) {
                    this.$message.error('获取表格失败')
                    return
                }
                this.tableData = data.items
                this.pager = data.page
            })
        },
        searchTable () {
            this.getTable()
        },
        resetForm () {
            this.$refs['form'].resetFields()
            this.getTable()
        },
        handleCurrentChange (currentPage) {
            this.pager.page = currentPage
            this.getTable()
        },
        handleSubmit () {
            this.dialogVisible = false
            this.$router.push({
              name: 'resultDetail',
              query: {
                id: 1
              }
            })
        },
        editTable (row) {
            this.$router.push({
              name: 'resultDetail',
              query: {
                id: 1
              }
            })
        },
        beforeUpload (file) {
            console.log(file)
            if (file.size >= 50 * 1024 * 1024) {
                this.$message.warning('超出最大上传内容，请重新上传')
                return false
            }
            this.uploadFile = file;
            return false
        },
        handleCancelUpload () {
            this.uploadRadio = ''
            this.uploadFile = null
            this.uploadVisible = false
        },
        handleSubmitUpload() {
            if (!this.uploadRadio) {
                this.$message.error('请选择汇总表')
                return
            }
            if (!this.uploadFile) {
                this.$message.error('请上传文件')
                return
            }
            const form = new FormData()
            form.append('file', file)
            form.append('type', 2)
            const unmount = this.$loading({
                lock: true,
                text: '上传中……',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            })
            this.$api.uploadResult(form).then(res => {
                const { code } = res
                if (code !== 0) {
                    this.$message.error('上传失败')
                    return;
                }
                this.$message.success('上传成功')
                this.getTable()
            }).finally(() => {
                this.handleCancelUpload()
                unmount.close()
            })
        },
        downloadResult(row) {
            this.$api.downloadResult({ id: row.id }).then(res => {
                const { code, data } = res
                if (code !== 0) {
                    this.$message.error('下载汇总表失败，请重试')
                    return
                }
                ADownload({
                    href: data
                })
            })
        },
        downloadPlan(row) {
            this.$api.downloadPlan({
                schemeId: row.scheme_id
            }).then(res => {
                const { code, data } = res
                if (code !== 0) {
                    this.$message.error('下载方案失败，请重试')
                    return
                }
                ADownload({
                    href: data
                })
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.result-manage-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    .search-wrapper {
        display: flex;
    }

    .form-wrapper {
        flex: 1;
        margin-bottom: 8px;
    }

    .table-wrapper {
        padding: 16px;

        .pager-wrapper {
            margin-top: 20px;
            width: 100%;
            text-align: right;
        }
    }

    .plan-name-wrapper {
        color: #1890ff;
        cursor: pointer;
    }
}

.dialog-content {
    padding: 0 16px;
    text-align: center;

    .dialog-desc {
        font-size: 14px;
        color: #aaa;
        margin-bottom: 8px;
    }
}

.dialog-footer {
    text-align: center;
    margin: 0 auto;

    button + button {
        margin-left: 32px;
    }
}

.upload-dialog {

    .upload-wrapper {
        width: 100%;
        text-align: center;
    }
}
</style>
