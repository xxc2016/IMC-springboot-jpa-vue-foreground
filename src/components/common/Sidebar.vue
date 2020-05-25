<template>
    <div class="sidebar">
    <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
    >
        <template v-for="item in items">    <!--遍历items里的所有内容-->
            <template v-if="item.subs">     <!--如果有subs这个属性，即有子菜单的情况下-->
                <el-submenu :index="item.index" :key="item.index">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </template>
                    <template v-for="subItem in item.subs">
                        <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                        >
                            <template slot="title">{{ subItem.title }}</template>
                            <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                            >{{ threeItem.title }}</el-menu-item>
                        </el-submenu>
                        <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                        >{{ subItem.title }}</el-menu-item>
                    </template>
                </el-submenu>
            </template>
            <template v-else>       <!--如果没有subs属性，即在没有子列表的情况下-->
                <el-menu-item :index="item.index" :key="item.index">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'index',
                    title: '首页'
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'myfactory',
                    title: '我的工厂',
                    subs: [
                        {
                            index: 'manager_employee',
                            title: '员工管理'
                        },
                        {
                            index: 'manager_equipment',
                            title: '设备管理'
                        },
                        {
                            index: 'manager_product',
                            title: '产品管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: 'manager_produce',
                    title: '生产管理',
                    subs: [
                        {
                            index: 'manager_dispatch',
                            title: '调度管理'
                        },
                        {
                            index: 'manager_order',
                            title: '订单管理'
                        },
                        {
                            index: 'manager_plan',
                            title: '计划管理'
                        },
                        {
                            index: 'manager_track',
                            title: '跟踪管理'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-emoji',
                    index: 'produce_trace',
                    title: '生产追踪',
                    subs:[
                        {
                            index: 'report',
                            title: '报工'
                        }
                    ]
                },
                {
                    icon: 'el-icon-pie-chart',
                    index: 'about_us',
                    title: '关于我们'
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
