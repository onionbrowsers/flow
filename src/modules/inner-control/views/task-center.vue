<template>
    <div class="task-center-wrapper">
        <div class="search-wrapper">
            <div class="form-wrapper">
                <el-form ref="form" inline :model="form" label-width="80px">
                    <el-form-item label="任务名称" prop="task_name">
                        <el-input clearable placeholder="请输入任务名称" v-model="form.task_name"></el-input>
                    </el-form-item>
                    <el-form-item label="分派时间" prop="date">
                        <el-date-picker clearable type="daterange" v-model="form.date" value-format="yyyy-MM-dd" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="task_type">
                        <el-select clearable v-model="form.task_type" placeholder="请选择任务类型">
                            <el-option v-for="item in taskTypeList" :key="item" :value=item>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="方案名称" prop="scheme_name">
                        <el-input clearable placeholder="请输入方案名称" v-model="form.scheme_name"></el-input>
                    </el-form-item>
                    <el-form-item label="执行状态" prop="task_status">
                        <el-select clearable v-model="form.task_status" placeholder="请选择执行状态">
                            <el-option v-for="item in taskStatusList" :key="item.id" :value="item.id" :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="评价人" prop="executor_name">
                        <el-input clearable placeholder="请输入评价人姓名" v-model="form.executor_name"></el-input>
                    </el-form-item>
                    <el-form-item label="分派人" prop="assignor_name">
                        <el-input clearable placeholder="请输入分派人姓名" v-model="form.assignor_name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="handle-button-wrapper">
                <el-button @click="searchTable" type="primary">查询</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="序号" width="100" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="task_name" label="任务名称" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="scheme_name" label="关联方案名称" align="center" header-align="center">
                    <template slot-scope="{row}">
                        <div v-if="row.scheme_name" @click="() => downloadPlan(row)" class="plan-name-wrapper">
                            {{ row.scheme_name }}
                            <i class="el-icon-download"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="task_status" label="状态" align="center" header-align="center">
                    <template slot-scope="{row}">
                        {{ row.task_status ? taskStatusList.find(item => item.id == row.task_status).name : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="exe_org_name" label="评价部门" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="executor_name" label="评价人" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="assignor_name" label="分派人" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="task_type" label="任务类型" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="dispatch_time" label="分派时间" align="center" header-align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-button 
                            v-if="scope.row.task_status == 1"
                            @click="signTable(scope.row)"
                            type="primary"
                        >
                            签收
                        </el-button>
                        <el-button 
                            v-else-if="scope.row.task_status == 2"
                            @click="goExecute(scope.row)"
                            type="primary"
                        >
                            去执行
                        </el-button>
                        <el-button 
                            v-else
                            @click="editTable(scope.row)"
                        >
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
    </div>
</template>

<script>
import { taskStatusList, taskTypeList } from '../constant/index'
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            form: {
                date: []
            },
            taskStatusList,
            taskTypeList,
            tableData: [],
            pager: {
                total: 1,
                page: 1
            }
        }
    },
    created() {
        this.getTable()
    },
    computed: {
        ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter']),
    },
    watch: {
        currentDataSpaceIdGetter() {
            this.getTable()
        }
    },
    methods: {
        getTable() {
            if (this.currentDataSpaceIdGetter === -1) {
                return;
            }
            this.$api.getTaskCenterTable({
                company_id: 2,
                ...this.form,
                ...this.pager,
                start_time: this.form.date && this.form.date.length ? this.form.date[0] : '',
                end_time: this.form.date && this.form.date.length ? this.form.date[1] : '',
            }).then(res => {
                const { code, data } = res
                if (code !== 0) {
                    this.$message.error('获取表格失败')
                    return
                }
                data.items && (this.tableData = data.items)
                data.page && (this.pager = data.page)
            })
        },
        searchTable () {
            this.getTable();
        },
        resetForm () {
            console.log(this.$refs['form'].resetFields)
            this.$refs['form'].resetFields()
            this.getTable();
        },
        handleCurrentChange (currentPage) {
            this.pager.page = currentPage
            this.getTable()
        },
        signTable(row) {
            this.$api.signGetTask({
                task_id: row.id,
                company_id: this.currentDataSpaceIdGetter
            }).then(res => {
                const { code } = res
                if (code !== 0) {
                    this.$message.error('签收失败，请重试')
                    return
                }
                this.getTable()
            })
        },
        goExecute(row) {
            this.$api.executeTask({
                task_id: row.id,
                company_id: this.currentDataSpaceIdGetter
            }).then(res => {
                const { code } = res
                if (code !== 0) {
                    this.$message.error('执行失败，请重试')
                    return
                }
                this.getTable()
            })
        },
        editTable() {
            console.log('编辑')
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
.task-center-wrapper {
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
</style>
