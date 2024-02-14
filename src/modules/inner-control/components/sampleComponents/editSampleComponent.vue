<template>
    <el-dialog
        title="请填写样本信息"
        :visible.sync="editVisible"
        class="single-upload-dialog"
        :destroy-on-close="true"
    >
        <div class="single-upload-wrapper">
            <el-form
                :model="editForm"
                :rules="formRules"
                ref="editForm"
                label-width="100px"
            >
                <el-form-item
                    label="样本类型"
                    prop="sample_type"
                >
                    <el-select v-model="editForm.sample_type" placeholder="请选择样本类型">
                        <el-option v-for="item in sampleTypeList" :key="item.id" :value="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="样本描述"
                    prop="sample_desc"
                >
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="editForm.sample_desc"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="uploadVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { sampleTypeList } from '../../constant'

export default {
    props: {
        row: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            editVisible: false,
            editForm: {
                sample_id: this.row.id,
                sample_type: this.row.type,
                sample_desc: this.row.descr
            },
            formRules: {
                sample_type: [
                    { required: true, message: '请选择类型', trigger: 'blur' }
                ],
            },
            sampleTypeList
        }
    },
    watch: {
        row(val) {
            if (!val) {
                return
            }
            console.log(val, 'val')
            this.editForm = {
                sample_id: val.id,
                sample_type: val.type,
                sample_desc: val.descr
            }
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.editForm.validate(valid => {
                if (!valid) {
                    this.$message.error('请填写完整');
                    return;
                }
                console.log(this.editForm, 'editForm')
                this.$api.updateSample({
                    ...this.editForm
                }).then(res => {
                    console.log(res)
                    const { code } = res
                    if (code !== 0) {
                        this.$message.error('修改失败');
                        return;
                    }
                    this.$emit('edit')
                    this.editVisible = false;
                    this.editForm = {}
                    this.$message.success('修改成功')
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.single-upload-wrapper {
    padding: 0 16px;
}
</style>