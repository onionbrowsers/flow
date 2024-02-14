<template>
    <div class="create-plan-wrapper">
        <el-form ref="form" :rules="formRules" inline :model="form" label-width="80px">
            <el-form-item label="方案名称" prop="name">
                <el-input placeholder="请输入方案名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="评价年度" prop="year">
                <el-date-picker v-model="form.year" value-format="yyyy-MM-dd" placeholder="请选择评价年度">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="审批人" prop="approver_id">
                <el-select v-model="form.approver_id" placeholder="请选择审批人">
                    <el-option
                        v-for="item in memberList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.username">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择任务类型">
                    <el-option v-for="item in taskTypeList" :key="item" :value=item>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="table-wrapper">
            <div class="table-title">
                评价组织
                <div style="margin-top: 4px">
                    <el-button @click="buttonClickAdd" size="small" type="primary">
                        添加成员
                    </el-button>
                </div>
            </div>
            <div class="table-content">
                <el-table
                    :data="memberData"
                    @row-contextmenu="onRowContextmenu"
                    border
                    style="width: 100%"
                >
                    <el-table-column
                        prop="folder_name"
                        label="评价部门"
                        align="center"
                        header-align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="job_name"
                        label="岗位"
                        align="center"
                        header-align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        label="成员"
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
                            <div class="table-handle-wrapper">
                                <i @click="() => editMember(row)" class="el-icon-edit"></i>
                                <i @click="() => deleteMember(row)" class="el-icon-delete"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="table-wrapper">
            <div class="table-title">
                评价流程（*请右键编辑如下表格）
                <div style="margin-top: 4px">
                    <el-button @click="buttonClickAdd" size="small" type="primary">
                        添加流程
                    </el-button>
                </div>
            </div>
            <div class="table-content">
                <el-table
                    :data="flowData"
                    @row-contextmenu="onRowContextmenu"
                    border
                    style="width: 100%"
                >
                    <el-table-column
                        prop="flowName"
                        label="流程"
                        align="center"
                        header-align="center"
                    >
                        <template slot-scope="{row}">
                            <el-input v-if="row.rowType === 'part'" v-model="row.flowName"></el-input>
                            <div v-else>
                                {{ row.flowName }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="importantStep"
                        label="重点环节"
                        align="center"
                        header-align="center"
                    >
                        <template slot-scope="{row}">
                            <div>
                                {{ row.flowName }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="judgeDepartment"
                        label="评价部门/评价人员"
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
                            <div class="table-handle-wrapper">
                                <i @click="() => editMember(row)" class="el-icon-edit"></i>
                                <i @click="() => deleteMember(row)" class="el-icon-delete"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="upload-wrapper">
            <div class="upload-title">
                评价方案
            </div>
            <div class="upload-content">
                <el-upload
                    :class="{
                        'doc-uploader': !fileList.length
                    }"
                    action="#"
                    accept=".doc, .docx, .pdf, .excel"
                    :on-remove="onRemove"
                    :limit="1"
                    :before-upload="beforeUpload"
                    :file-list="fileList"
                    :on-exceed="onExceed"
                >
                    <i v-if="!fileList.length" class="el-icon-plus avatar-uploader-icon doc-icon"></i>
                    <div v-if="!fileList.length" slot="tip" class="el-upload__tip">支持格式：doc，docx，pdf，excel，且不能超过50m</div>
                </el-upload>
            </div>
        </div>
        <div class="button-wrapper">
            <el-button @click="savePlan" type="primary">
                保存
            </el-button>
            <el-button @click="submitPlan" type="primary">
                提交方案
            </el-button>
        </div>
        <el-dialog
            title="提交方案"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <span style="margin: 0 16px;">提交后不能修改，请再次确认是否提交</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="() => {
                    this.dialogVisible = false
                    this.$refs.memberForm.resetFields()
                }">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="选择填写组织"
            :visible.sync="memberVisible"
            width="30%"
            @close="cancelAddMember"
        >
            <div class="member-form-wrapper">
                <el-form ref="memberForm" :rules="memberFormRules" :model="memberForm" label-width="80px">
                    <el-form-item label="部门名称" prop="folder_name">
                        <el-input placeholder="请输入部门名称" v-model="memberForm.folder_name"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位名称" prop="job_name">
                        <el-input placeholder="请输入岗位名称" v-model="memberForm.job_name"></el-input>
                    </el-form-item>
                    <el-form-item label="成员名称" prop="user_id">
                        <el-select v-model="memberForm.user_id" placeholder="请选择成员名称">
                            <el-option
                                v-for="item in memberList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.username"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAddMember">取 消</el-button>
                <el-button type="primary" @click="addMemberData">确 定</el-button>
            </span>
        </el-dialog>
        <div @click.stop v-show="showMenu" ref="dropMenu" class="drop-menu-wrapper">
            <div
                class="drop-menu-item"
                v-for="item in dropMenuList"
                :key="item.type"
                @click="clickMenu(item)"
            >
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script>
import { dropMenuList, taskTypeList } from '../constant'
import { mapGetters } from 'vuex'
export default {
    data () {
        return {
            form: {},
            formRules: {
                name: [
                    { required: true, message: '请输入方案名称', trigger: 'blur' }
                ],
                year: [
                    { required: true, message: '请选择评价年度', trigger: 'blur' }
                ],
                approver_id: [
                    { required: true, message: '请选择审批人', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择任务类型', trigger: 'blur' }
                ]
            },
            examineList: [],
            taskTypeList,
            memberData: [
                {
                    folder_name: '1',
                    job_name: '2',
                    user_id: 3,
                    username: '4',
                    uniqKey: Date.now()
                }
            ],
            flowData: [],
            fileList: [],
            dialogVisible: false,
            memberVisible: false,
            memberList: [],
            memberForm: {},
            memberFormRules: {
                user_id: [
                    { required: true, message: '请选择成员', trigger: 'blur' }
                ]
            },
            pageX: 0,
            pageY: 0,
            dropMenuList: [],
            showMenu: false,
            rowIndex: -1,
        }
    },
    computed: {
        ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter']),
    },
    created() {
        this.handleGetMemberList()
    },
    watch: {
        currentDataSpaceIdGetter(val) {
            this.handleGetMemberList()
        }
    },
    mounted() {
        document.addEventListener('click', this.clickDocument)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.clickDocument)
    },
    methods: {
        clickDocument() {
            this.showMenu = false
        },
        handleGetMemberList() {
            if (this.currentDataSpaceIdGetter === -1) {
                return;
            }
            this.$api.getMemberList({
                companyId: this.currentDataSpaceIdGetter
            }).then(res => {
                const { code, data } = res
                if (code !== 0) {
                    this.$message.error('获取审批人列表失败')
                    return
                }
                this.memberList = data
            })
        },
        onExceed () {
            this.$message.warning('超出最大上传数量，请先删除后上传')
        },
        beforeUpload (file) {
            if (file.size >= 50 * 1024 * 1024) {
                this.$message.warning('超出最大上传内容，请重新上传')
                return false
            }
            this.fileList.push({
                name: file.name,
                url: URL.createObjectURL(file)
            })
            console.log(this.fileList)
            return true
        },
        onRemove (file, fileList) {
            this.fileList = fileList
        },
        savePlan() {
            console.log('save')
        },
        submitPlan () {
            this.dialogVisible = true;
        },
        handleSubmit () {
            this.dialogVisible = false
            console.log('submit')
        },
        cancelAddMember() {
            this.$refs.memberForm.resetFields()
            this.memberForm = {}
            this.memberVisible = false
        },
        addMemberData () {
            this.$refs.memberForm.validate(valid => {
                if (!valid) {
                    this.$message.error('请填写完整后确定')
                    return
                }
                this.memberVisible = false
                const member = this.memberList.find(item => item.id === this.memberForm.user_id) || {}
                const result = {
                    ...this.memberForm,
                    ...member,
                    uniqKey: Date.now()
                }
                this.$refs.memberForm.resetFields()
                if (this.addType === 'push') {
                    this.memberData.push(result)
                    return
                }
                this.memberData.splice(this.addType === 'addRowInDown' ? this.rowIndex + 1 : this.rowIndex, this.addType !== 'edit' ? 0 : 1, result)
            })
        },
        onRowContextmenu (row, column, event) {
            event.preventDefault()
            event.stopPropagation()
            this.dropMenuList = dropMenuList.slice(0, 2)
            this.$refs.dropMenu.style.top = `${event.pageY || this.pageY}px`
            let left = event.pageX || this.pageX
            if (event.pageX + 150 >= window.innerWidth) {
                left = event.pageX - 180
            }
            this.$refs.dropMenu.style.left = `${left}px`
            this.showMenu = true
            this.rowIndex = this.memberData.findIndex(item => item.uniqKey === row.uniqKey)
        },
        clickMenu(item) {
            this.showMenu = false
            this.memberVisible = true
            this.addType = item.type
        },
        editMember(row) {
            this.rowIndex = this.memberData.findIndex(item => item.uniqKey === row.uniqKey)
            this.memberVisible = true
            this.memberForm = {...row}
            this.addType = 'edit'
        },
        deleteMember(row) {
            this.$confirm('确定删除吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.memberData = this.memberData.filter(item => item.id !== row.id)
            })
        },
        buttonClickAdd () {
            this.memberVisible = true
            this.memberForm = {}
            this.addType = 'push'
        }
    }
}
</script>

<style lang="scss" scoped>
.create-plan-wrapper {
    width: 100%;
    height: 100%;

    .upload-wrapper, .table-wrapper {
        margin-bottom: 24px;
    }

    .upload-title, .table-title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
    }

    .button-wrapper {
        width: 100%;
        text-align: center;
    }

    .doc-uploader {
        width: 100%;
        height: 100%;

        /deep/ .el-upload {
            width: 100px;
            height: 100px;
            position: relative;
            border: 1px dashed #ccc;
        }

        .doc-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .table-content {
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

    .drop-menu-wrapper {
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        padding: 16px;
        background-color: #fff;
        min-width: 150px;
        border-radius: 4px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

        .drop-menu-item {
            width: 100%;
            font-size: 16px;
            line-height: 30px;
            height: 30px;
            text-align: center;
            cursor: pointer;
            user-select: none;

            &:hover {
                background-color: #1890FF;
                color: #fff;
                border-radius: 2px;
            }
        }

    }
}

.member-form-wrapper {
    padding: 16px;
}
</style>
