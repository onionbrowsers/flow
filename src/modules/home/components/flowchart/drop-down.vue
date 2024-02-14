<template>
  <div id="dropdown">
    <div v-show="flag === 'show-list'" class="dropdown__company-list">
      <div class="scrollbar">
        <div
          class="item"
          :class="{ active: item.id === currentDataSpaceIdGetter }"
          v-for="item in dataSpaceComputed"
          :key="item.id"
          @click="handleDataSpaceSelected(item.id)"
        >
          <div class="name">{{ item.type === 2
            ? '个人空间' : (
            Object.prototype.toString.call(item.name) === '[object Null]' ? '' : item.name
            ) }}</div>
          <span v-if="item.type === 1" class="number">企业成员 {{ item.count }}</span>
        </div>
      </div>
      <!--    <div class="item active">-->
      <!--      <div class="name">贝业思软件</div>-->
      <!--      <span class="number">4人</span>-->
      <!--    </div>-->
      <!--    <div class="item">-->
      <!--      <div class="name">个人空间</div>-->
      <!--&lt;!&ndash;      <span>4人</span>&ndash;&gt;-->
      <!--    </div>-->
    </div>
    <div v-show="flag === 'create'" class="dropdown__create-company">
      <div class="create-company__return" @click="switchHandle">
        <i class="el-icon el-icon-back"></i>
      </div>
      <el-form :model="formData" status-icon :rules="rules" ref="dropdownForm" label-width="100px" class="dropdown__form">
        <el-form-item prop="name">
          <label
            slot="label"
          >
            企业名称:
          </label>
          <el-input
            size="mini"
            type="text"
            v-model="formData.name"
            autocomplete="off"
            placeholder="请输入企业/组织名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="size">
          <label
            slot="label"
          >
            企业规模:
          </label>
          <el-select v-model="formData.size" placeholder="请选择企业规模" size="mini">
            <el-option
              v-for="item in selectConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone">
          <label
            slot="label"
          >
            联系电话:
          </label>
          <el-input
            size="mini"
            type="text"
            v-model="formData.phone"
            autocomplete="off"
            placeholder="请输入您或其他人的手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="c_type">
          <el-radio v-model="formData.c_type" :label="1">集团公司</el-radio>
          <el-radio v-model="formData.c_type" :label="2">咨询公司</el-radio>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-box">
      <el-button
        class="creat-btn"
        size="mini"
        type="primary"
        @click="btnConfig[flag].func"
      >{{ btnConfig[flag].label }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dropdown',
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'companyDataSpaceGetter', 'personalDataSpaceGetter']),
    // 组合企业空间, 保证顺序
    dataSpaceComputed () {
      return [...this.companyDataSpaceGetter, this.personalDataSpaceGetter || []]
    }
  },
  data () {
    return {
      // 当前页面表现, 用于什么?
      flag: 'show-list', // show-list: 展示列表, create: 创建企业
      // 按钮配置信息, 根据当前 flag, 切换 label 和功能函数 func
      btnConfig: {
        'show-list': {
          label: '创建企业',
          func: this.createCompany
        },
        'create': {
          label: '确定',
          func: this.confirmCreateCompany
        }
      },
      // 表单数据
      formData: {
        name: '',
        size: 1,
        phone: '',
        c_type: 1
      },
      // 下拉选择框的配置信息
      selectConfig: [
        { label: '1~30人', value: 1 },
        { label: '30~50人', value: 2 },
        { label: '50~100人', value: 3 },
        { label: '100~500人', value: 4 },
        { label: '500人以上', value: 5 }
      ],
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { min: 2, max: 15, message: '企业名称长度在 4 到 15 个字符', trigger: 'blur' }
        ],
        size: [
          { required: true, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: (rule, phone, callback) => {
              const re = /^0?(13|14|15|17|18|19)[0-9]{9}|(852)[0-9]{8}$/
              re.test(phone) ? callback() : callback(new Error('请输入正确的手机号'))
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 选中数据空间 handler
     * @param dataSpaceId 数据空间 id
     */
    handleDataSpaceSelected (dataSpaceId) {
      if (dataSpaceId === this.currentDataSpaceIdGetter) {
        // const currentRoute = this.$route
        // 如果当前在主页, 不做任何行为
        const pathList = this.$route.fullPath.split('/')
        if (pathList[1] === 'home') {
          this.$emit('hide-popover')
          return false
        } else {
          // 如果当前不在主页, 跳转到主页
          this.$router.push({ name: 'home' })
        }
      }
      this.$store.commit('SET_CURRENT_DATA_SPACE_MUTATION', dataSpaceId)
      this.$emit('hide-popover')
      // debugger
      const pathList = this.$route.fullPath.split('/')
      if (pathList[1] !== 'home') {
        this.$router.push({ name: 'home' })
      } else {
        this.$router.push({ name: 'my-folder' })
      }
    },
    /**
     * 创建企业逻辑
     */
    createCompany () {
      this.flag = 'create'
    },
    switchHandle () {
      this.flag = 'show-list'
    },
    /**
     * 确定创建企业, 提交表单
     */
    async confirmCreateCompany () {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        // 1. 验证表单
        await this.$refs.dropdownForm.validate()
        // 2. 添加企业
        const res = await this.$api.addCompany({
          name: this.formData.name,
          c_type: this.formData.c_type,
          size: Number(this.formData.size),
          phone: this.formData.phone
        })
        // 3. 重新获取企业列表
        await this.$store.dispatch('GET_COMPANIES_ACTION', this)
        // 4. 设置当前企业 id
        this.$store.commit('SET_CURRENT_DATA_SPACE_MUTATION', res.msg.company_id)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        // 5. 隐藏 popover
        this.$emit('hide-popover')
        // 6. 跳转到当前企业文件夹主页
        this.$router.push({ name: 'home' })
      } catch (err) {
        if (err === false) {
          console.log(new Error('表单验证不通过'))
          this.$msgMnger.error('请填入必要信息')
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        } else {
          console.log(err)
          // this.$msgMnger.httpError(err)
          this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
  #dropdown{
    /*padding: 0 5px;*/
    background: #ffffff;
    .scrollbar{
      height: auto;
      max-height: 400px;
      overflow-y: auto;
    }
    /*滚动条样式*/
    .scrollbar::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    .scrollbar::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    .scrollbar::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
    .active{
      .name {
        color: #1890FF !important;
      }
      .number{
        color: #1890FF !important;
      }
    }
    .item{
      border-bottom: 1px solid #F0F3F7;
      margin: 0 12px;
      padding: 16px 10px;
      cursor: pointer;
      min-width: 200px;
      max-width: 250px;
      .name{
        color: #252525;
        font-size: 16px;
        line-height: 22px;
      }
      .number{
        color: #92A3B3;
        font-size: 14px;
      }
    }
    .btn-box{
      display: flex;
      justify-content: center;
      padding: 0 10px;
      .creat-btn{
        margin: 23px auto;
        width: 154px;
      }
    }
    .dropdown__create-company {
      margin: 0 12px;
      .create-company__return {
        height: 20px;
        text-align: left;
        .el-icon {
          font-size: 18px;
          &:hover {
            color: $primary-bg-color;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  #dropdown {
    .dropdown__form {
      padding: 0 30px;
      .el-form-item {
        margin-bottom: 22px;
        &:last-child{
          margin-bottom: 0;
        }
      }
      .el-form-item__label {
        line-height: 20px;
        float: unset;
        width: 100% !important;
        text-align: left;
      }
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
</style>
