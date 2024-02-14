<template>
    <div class="sample-manage-wrapper">
        <div class="search-wrapper">
            <div class="form-wrapper">
                <el-form ref="form" inline :model="form" label-width="80px">
                    <el-form-item label="样本名称" prop="sample_name">
                        <el-input clearable placeholder="请输入样本名称" v-model="form.sample_name"></el-input>
                    </el-form-item>
                    <el-form-item label="发生时间" prop="date">
                        <el-date-picker clearable type="daterange" v-model="form.date" value-format="yyyy-MM-dd" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="样本编号" prop="sample_number">
                        <el-input clearable placeholder="请输入样本编号" v-model="form.sample_number"></el-input>
                    </el-form-item>
                    <el-form-item label="样本类型" prop="sample_type">
                        <el-select clearable v-model="form.sample_type" placeholder="请选择样本类型">
                            <el-option v-for="item in sampleTypeList" :key="item.id" :value="item.id" :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="提交人" prop="submit_name">
                        <el-input clearable placeholder="请输入提交人姓名" v-model="form.submit_name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="handle-button-wrapper">
                <el-button @click="searchTable" type="primary">查询</el-button>
                <el-button type="primary" @click="dialogVisible = true">上传</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="序号" width="100" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="name" label="样本名称" align="center" header-align="center">
                    <template slot-scope="{row}">
                        <div @click="() => downloadSample(row)" class="plan-name-wrapper">
                            {{ row.name }}
                            <i class="el-icon-download"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="样本编号" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="unique_id" label="唯一性标识" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="draft_ids" label="关联底稿" align="center" header-align="center">
                    <template slot-scope="{row}">
                        关联底稿自定义
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="样本类型" align="center" header-align="center">
                    <template slot-scope="{row}">
                        {{ row.type ? sampleTypeList.find(item => item.id == row.type).name : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="descr" label="样本描述" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="upload_time" label="发生时间" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="commitor_name" label="提交人" align="center" header-align="center">
                </el-table-column>
                <el-table-column 
                    label="操作"
                    align="center"
                    header-align="center"
                >
                    <template slot-scope="{row}">
                        <div class="table-handle-wrapper">
                            <i @click="() => editSample(row)" class="el-icon-edit"></i>
                            <i @click="() => deleteSample(row)" class="el-icon-delete"></i>
                        </div>
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
            title="请选择上传的文件类型"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <div class="dialog-content">
                <div class="dialog-desc">
                    *压缩包上传图片名称规则：样本名称-唯一性标识-样本编号.图片格式
                </div>
                <el-radio-group v-model="uploadRadio">
                    <el-radio label="1" border>单个文件</el-radio>
                    <el-radio label="2" border>压缩包文件</el-radio>
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
                <el-upload
                    class="upload-content"
                    drag
                    action="#"
                    accept=".rar, .zip"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip">*只能上传rar，zip文件，且不超过50m</div>
                </el-upload>
            </div>
        </el-dialog>
        <single-upload ref="singleUploadRef" @singleUpload="singleUpload" />
        <edit-sample-component @edit="getTable" ref="editSampleRef" :row="currentRow" />
    </div>
</template>

<script>
import { sampleTypeList } from '../constant/index'
import singleUpload from '../components/sampleComponents/singleUpload.vue'
import { ADownload } from '../util/index'
import editSampleComponent from '../components/sampleComponents/editSampleComponent.vue'

export default {
    components: {
        singleUpload,
        editSampleComponent
    },
    data () {
        return {
            uploadRadio: '',
            dialogVisible: false,
            uploadVisible: false,
            form: {
                date: []
            },
            sampleTypeList,
            tableData: [],
            pager: {
                total: 1
            },
            currentRow: {}
        }
    },
    created () {
        this.getTable()
    },
    methods: {
        getTable() {
            this.$api.getSampleTable({
                ...this.form,
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
            if (this.uploadRadio === '2') {
                this.uploadVisible = true
                return;
            }
            console.log(this.$refs.singleUploadRef)
            this.$refs.singleUploadRef.uploadVisible = true
            console.log('single')
        },
        beforeUpload (file) {
            console.log(file)
            if (file.size >= 50 * 1024 * 1024) {
                this.$message.warning('超出最大上传内容，请重新上传')
                return false
            }
            const form = new FormData()
            form.append('file', file)
            form.append('mode', 2)
            this.singleUpload(form);
            return false
        },
        singleUpload(form) {
            const unmount = this.$loading({
                lock: true,
                text: '上传中……',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            })
            this.$api.uploadSample(form).then(res => {
                const { code } = res
                if (code !== 0) {
                    this.$message.error('上传失败')
                    return;
                }
                this.$message.success('上传成功')
                this.getTable()
            }).finally(() => unmount.close())
        },
        downloadSample(row) {
            this.$api.downloadSample({ id: row.id }).then(res => {
                const { code, data } = res
                if (code !== 0) {
                    this.$message.error('下载失败')
                    return
                }
                ADownload({
                    href: data
                })
            })
        },
        editSample(row) {
            this.currentRow = row;
            console.log(this.$refs.editSampleRef)
            this.$refs.editSampleRef.editVisible = true
            console.log(row)
        },
        deleteSample (row) {
            this.$confirm('确定删除吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.$api.deleteSample({ id: row.id }).then(res => {
                    const { code } = res
                    if (code !== 0) {
                        this.$message.error('删除失败')
                        return
                    }
                    this.$message.success('删除成功')
                    this.getTable()
                })  
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.sample-manage-wrapper {
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

        .plan-name-wrapper {
            color: #1890ff;
            cursor: pointer;
        }

        .table-handle-wrapper {
            margin: 0 auto;
            max-width: 140px;
            display: flex;
            justify-content: space-evenly;
            color: #1989fa;
            
            & > i {
                cursor: pointer;
            }
        }
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
