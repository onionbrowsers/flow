<template>
    <div class="search-form-wrapper">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="流程名称：">
                <el-input placeholder="请输入流程名称" clearable v-model="searchForm[formKey[0]]" width="100px"></el-input>
            </el-form-item>
            <el-form-item label="制度名称：">
                <el-input placeholder="请输入制度名称" clearable v-model="searchForm[formKey[1]]" width="100px"></el-input>
            </el-form-item>
            <el-form-item label="岗位手册：">
                <el-input placeholder="请输入岗位手册" clearable v-model="searchForm[formKey[2]]" width="100px"></el-input>
            </el-form-item>
            <el-form-item label="部门手册：">
                <el-input placeholder="请输入部门手册" clearable v-model="searchForm[formKey[3]]" width="100px"></el-input>
            </el-form-item>
            <el-form-item label="公司手册：">
                <el-input placeholder="请输入公司手册" clearable v-model="searchForm[formKey[4]]" width="100px"></el-input>
            </el-form-item>
            <el-form-item label="所属主责部门：">
                <el-select style="width: 200px" clearable v-model="searchForm[formKey[5]]" placeholder="请选择">
                    <el-option
                      v-for="item in departmentList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    clearable
                    v-model="searchForm[formKey[6]]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onCreate">新建</el-button>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { formKey, initForm } from './constant'
export default {
  props: {
    departmentList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      searchForm: {
        ...initForm
      },
      formKey: [...formKey]
    }
  },
  methods: {
    onSubmit () {
      this.$emit('search', this.searchForm)
    },
    onCreate () {
      this.$router.push({
        name: 'edit-condition-flow'
      })
    },
    onReset () {
      this.searchForm = {
        ...initForm
      }
      this.$emit('search', this.searchForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form-wrapper {
    overflow: hidden;
    .button-list {
        float: right;
    }
}
</style>
