<template>
    <div id="inner-control">
        <div class="inner-control-title-wrapper">
            <div class="inner-control-title">
                内控评价系统
            </div>
            <div @click="goHome" class="inner-control-back">
                <i :class="['el-icon-s-home', 'go-home-icon']"></i>
                首页
            </div>
        </div>
        <div class="inner-control-wrapper">
            <div class="inner-control-left">
                <el-menu
                    :router="true"
                    class="inner-control-menu"
                    background-color="#fff"
                    :default-active="activeRoute"
                >
                    <el-menu-item index="/inner-control/plan-center">
                        <span slot="title">方案中心</span>
                    </el-menu-item>
                    <el-menu-item index="/inner-control/task-center">
                        <span slot="title">任务中心</span>
                    </el-menu-item>
                    <el-menu-item index="/inner-control/baseline">
                        <span slot="title">底稿管理</span>
                    </el-menu-item>
                    <el-menu-item index="/inner-control/sample">
                        <span slot="title">样本管理</span>
                    </el-menu-item>
                    <el-menu-item index="/inner-control/result">
                        <span slot="title">结果管理</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="inner-control-right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            activeRoute: '/inner-control/plan-center'
        }
    },
    mounted () {
        this.activeRoute = this.$route.path
        console.log(this)
    },
    methods: {
        goHome () {
            this.$router.push({ path: '/home' })
        }
    },
    computed: {
        ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter']),
    }
}
</script>

<style lang="scss" scoped>
#inner-control {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-align: left;

    .inner-control-title-wrapper {
        padding: 16px;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        background-color: #212121;
        display: flex;

        .inner-control-back {
            margin-left: 16px;
            cursor: pointer;
        }
    }

    .inner-control-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
    }

    .inner-control-left {
        width: 200px;
    }

    .inner-control-right {
        flex: 1;
        overflow: hidden;
        padding: 16px;
    }

    .inner-control-menu {
        height: 100%;
    }

    .inner-control-collapse {
        cursor: pointer;
        user-select: none;
    }
}
</style>
