<template>
    <div class="baseline-manage-wrapper">
        <div class="search-wrapper">
            <div class="form-wrapper">
                <el-form ref="form" inline :model="form" label-width="80px">
                    <el-form-item label="流程名称" prop="flow_name">
                        <el-input clearable placeholder="请输入名称" v-model="form.flow_name"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="date">
                        <el-date-picker clearable type="daterange" v-model="form.date" value-format="yyyy-MM-dd" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="底稿编号" prop="draft_number">
                        <el-input clearable placeholder="请输入底稿编号" v-model="form.draft_number"></el-input>
                    </el-form-item>
                    <el-form-item label="评价人员" prop="executor_name">
                        <el-input clearable placeholder="请输入评价人姓名" v-model="form.executor_name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="handle-button-wrapper">
                <el-button @click="searchTable" type="primary">查询</el-button>
                <el-button type="primary">新建</el-button>
                <el-button @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="table-wrapper">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="序号" width="100" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="flow_name" label="流程名称" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="draft_number" label="底稿编号" align="center" header-align="center">
                    <template slot-scope="{row}">
                        <el-tooltip
                            effect="dark"
                            :content="(row.draft_number || []).join('、')"
                            placement="top"
                            v-if="row.draft_number.length > 3"
                        >
                            <div>
                                {{ (row.draft_number || []).slice(0, 3).join('、') }}...
                            </div>
                        </el-tooltip>
                        <div v-else>
                            {{ (row.draft_number || []).join('、') }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="executor_name" label="评价人" align="center" header-align="center">
                </el-table-column>
                <el-table-column prop="c_time" label="创建时间" align="center" header-align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" header-align="center">
                    <template slot-scope="{row}">
                        <el-button @click="() => editTable(row)" type="primary">编辑</el-button>
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
import { fileTypeList } from '../constant/index'
import { mapGetters } from 'vuex'
import { ADownload } from '../util/index'

export default {
    data () {
        return {
            form: {
                date: []
            },
            fileTypeList,
            tableData: [],
            pager: {
                total: 1,
                page: 1
            }
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
    created() {
        this.getTable()
    },
    methods: {
        getTable () {
            if (this.currentDataSpaceIdGetter === -1) {
                return;
            }
            this.$api.getBaselineTable({
                companyId: this.currentDataSpaceIdGetter,
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
        editTable (row) {
            this.$router.push({
              name: 'projectMan',
              query: {
                id: row.id
              }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.baseline-manage-wrapper {
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
}
</style>
