<template>
    <div class="plan-center-wrapper">
        <div class="search-wrapper">
            <div class="form-wrapper">
                <el-form ref="form" inline :model="form" label-width="80px">
                    <el-form-item label="方案名称" prop="name">
                        <el-input clearable placeholder="请输入方案名称" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="提交时间" prop="date">
                        <el-date-picker
                            type="daterange"
                            v-model="form.date"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="方案状态" prop="status">
                        <el-select clearable v-model="form.status" placeholder="请选择方案状态">
                            <el-option
                                v-for="item in planStatusList"
                                :key="item.id"
                                :value=item.id
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="提交人" prop="author_name">
                        <el-input clearable placeholder="请输入提交人姓名" v-model="form.author_name"></el-input>
                    </el-form-item>
                    <el-form-item label="审批人" prop="approver_name">
                        <el-input clearable placeholder="请输入审批人姓名" v-model="form.approver_name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="handle-button-wrapper">
                <el-button @click="searchTable" type="primary">查询</el-button>
                <el-button type="primary" @click="createPlan">新建</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table
                :data="tableData"
                border
                style="width: 100%"
            >
                <el-table-column
                    prop="id"
                    label="序号"
                    width="100"
                    align="center"
                    header-align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="方案名称"
                    align="center"
                    header-align="center"
                >
                    <template slot-scope="{row}">
                        <div @click="() => downloadPlan(row)" class="plan-name-wrapper">
                            {{ row.name }}
                            <i class="el-icon-download"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    header-align="center"
                >
                    <template slot-scope="{row}">
                        <div>
                            {{ planStatusList.find(item => item.id === row.status).name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="detailed"
                    label="资料清单"
                    align="center"
                    header-align="center"
                >
                    <template slot-scope="{row}">
                        <div v-if="row.detailed" @click="() => downloadDetailed(row)" class="plan-name-wrapper">
                            {{ row.detailed }}
                            <i class="el-icon-download"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="author_name"
                    label="提交人"
                    align="center"
                    header-align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="approver_name"
                    label="审批人"
                    align="center"
                    header-align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="c_time"
                    label="提交时间"
                    align="center"
                    header-align="center"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    header-align="center"
                >
                    <template slot-scope="{row}">
                        <el-button 
                            v-if="row.status == 1"
                            @click="handleExamine(row)"
                            type="primary"
                        >
                            审批
                        </el-button>
                        <el-button 
                            v-if="row.status == 2 || row.status == 6"
                            @click="editTable(row)"
                            type="primary"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-if="row.status == 3"
                            @click="handleDispatch(row)"
                            type="primary"
                        >
                            下发
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pager-wrapper">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="pager.total"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog
            title="请选择审批意见"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <div class="dialog-content">
                <el-radio-group v-model="examineRadio">
                    <el-radio :label="3" border>通过</el-radio>
                    <el-radio :label="2" border>不通过</el-radio>
                </el-radio-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { planStatusList } from '../constant/index'
import { mapGetters } from 'vuex'
import { ADownload } from '../util/index'

export default {
    data () {
        return {
            dialogVisible: false,
            examineRadio: '',
            form: {
                date: []
            },
            planStatusList,
            tableData: [],
            pager: {
                total: 0,
                page: 1
            },
            currentRow: null
        }
    },
    computed: {
        ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter']),
    },
    watch: {
        currentDataSpaceIdGetter(val) {
            if (val === -1) {
                return
            }
            this.getTable()
        }
    },
    methods: {
        getTable() {
            this.$api.getPlanCenterTable({
                companyId: 2,
                ...this.form,
                ...this.pager,
                start_time: this.form.date && this.form.date.length ? this.form.date[0] : '',
                end_time: this.form.date && this.form.date.length ? this.form.date[1] : '',
            }).then(res => {
                const { code, data } = res
                if (code !== 0) {
                    this.$message.error('获取方案中心表格失败')
                    return
                }
                this.tableData = data.items;
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
        createPlan () {
            this.$router.push({ name: 'create-plan' })
        },
        handleCancel() {
            this.dialogVisible = false
            this.currentRow = null
        },
        handleSubmit() {
            if (!this.examineRadio || !this.currentRow) {
                return;
            }
            this.$api.updatePlanCenterStatus({
                schemeId: this.currentRow.id,
                status: this.examineRadio
            }).then(res => {
                const { code } = res
                if (code !== 0) {
                    this.$message.error('审批方案失败，请重试')
                    return
                }
                this.getTable()
                this.dialogVisible = false
            })
        },
        downloadPlan(row) {
            this.$api.downloadPlan({
                schemeId: row.id
            }).then(res => {
                const {code, data} = res
                if (code !== 0) {
                    this.$message.error('下载方案失败，请重试')
                    return
                }
                ADownload({
                    href: data
                })
            })
        },
        downloadDetailed (row) {
            this.$api.downloadDetail({
                schemeId: row.id
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
        handleExamine(row) {
            this.currentRow = row
            this.dialogVisible = true
        },
        handleDispatch(row) {
            this.$api.updatePlanCenterStatus({
                schemeId: row.id,
                status: 4
            }).then(res => {
                const { code } = res
                if (code !== 0) {
                    this.$message.error('审批方案失败，请重试')
                    return
                }
                this.$api.distributionPlan({
                    scheme_id: row.id,
                    company_id: this.currentDataSpaceIdGetter
                }).then(res => {
                    const { code: dispatchCode } = res
                    if (dispatchCode !== 0) {
                        this.$message.error('下发失败，请重试')
                        return
                    }
                    this.getTable()
                })
            })
        },
        editTable(row) {
            console.log(row)
        }
    }
}
</script>

<style lang="scss" scoped>
.plan-center-wrapper {
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
</style>
