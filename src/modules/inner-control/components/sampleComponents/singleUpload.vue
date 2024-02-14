<template>
    <el-dialog
        title="请填写样本信息"
        :visible.sync="uploadVisible"
        class="single-upload-dialog"
        :destroy-on-close="true"
        @close="resetComponent"
    >
        <div class="single-upload-wrapper">
            <el-form
                :model="uploadForm"
                :rules="formRules"
                ref="uploadForm"
                label-width="100px"
            >
                <el-form-item
                    label="样本名称"
                    prop="sample_name"
                >
                    <el-input placeholder="请输入内容" v-model="uploadForm.sample_name"></el-input>
                </el-form-item>
                <el-form-item
                    label="样本编号"
                    prop="sample_number"
                >
                    <el-input placeholder="请输入内容" v-model="uploadForm.sample_number"></el-input>
                </el-form-item>
                <el-form-item
                    label="唯一性标识"
                    prop="unique_id"
                >
                    <el-input placeholder="请输入内容" v-model="uploadForm.unique_id"></el-input>
                </el-form-item>
                <el-form-item
                    label="样本类型"
                    prop="type"
                >
                    <el-select v-model="uploadForm.type" placeholder="请选择样本类型">
                        <el-option v-for="item in sampleTypeList" :key="item.id" :value="item.id" :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>  
                <el-form-item
                    label="发生时间"
                    prop="upload_time"
                >
                    <el-date-picker v-model="uploadForm.upload_time" value-format="yyyy-MM-dd" placeholder="请选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="样本描述"
                    prop="descr"
                >
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="uploadForm.descr"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="选择图片"
                    prop="uploadPic"
                >
                    <el-upload
                        :class="{
                            'upload-list-show': uploadList.length
                        }"
                        action="#"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="uploadList"
                        :on-remove="onRemove"
                        :before-upload="beforeUpload"
                    >
                        <i v-if="!uploadList.length" class="el-icon-plus"></i>
                    </el-upload>
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
import { sampleTypeList } from '../../constant';

export default {
    data () {

        const checkUploadList = (rule, value, callback) => {
            console.log(rule, value, callback);
            if (!this.uploadList.length) {
                callback(new Error('请上传图片'))
            } else {
                callback()
            }
        }
        
        return {
            uploadVisible: false,
            uploadForm: {},
            formRules: {
                sample_name: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                sample_number: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                unique_id: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'blur' }
                ],
                upload_time: [
                    { required: true, message: '请选择时间', trigger: 'blur' }
                ],
                uploadPic: [
                    { validator: checkUploadList, trigger: 'blur' }
                ]
            },
            sampleTypeList,
            uploadList: []
        }
    },
    methods: {
        beforeUpload (file) {
            if (file.size >= 10 * 1024 * 1024) {
                this.$message.warning('超出最大上传限制，请重新上传')
                return false
            }
            console.log(file)
            this.uploadList.push({
                file,
                name: file.name,
                url: URL.createObjectURL(file)
            })
            return true
        },
        handleSubmit () {
            this.$refs.uploadForm.validate(valid => {
                if (!valid) {
                    this.$message.error('请填写完整');
                    return;
                }
                this.uploadVisible = false;
                const form = new FormData();
                form.append('file', this.uploadList[0].file)
                form.append('mode', 1)
                Object.keys(this.uploadForm).forEach(key => {
                    form.append(key, this.uploadForm[key])
                })
                this.$emit('singleUpload', form)
            })
        },
        onRemove (file, fileList) {
            this.uploadList = fileList
        },
        resetComponent () {
            this.uploadList = []
            this.uploadForm = {}
            this.uploadVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-content, .single-upload-wrapper {
    padding: 0 16px;

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

.upload-list-show {
    /deep/ .el-upload {
        display: none;
    }
}
</style>