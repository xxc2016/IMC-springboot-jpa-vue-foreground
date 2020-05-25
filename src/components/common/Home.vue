<template>
    <div class="wrapper">
        <v-head></v-head>   <!--上部导航框-->
        <v-sidebar></v-sidebar>     <!--左侧索引栏-->
        <div class="content-box" :class="{'content-collapse':collapse}">
            <!--选项框暂时弃用
            <v-tags></v-tags>-->
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view v-if="isRouterAlive"></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
import service from '../../utils/request';
export default {
    provide(){
        return{
            reload:this.reload
        }
    },
    data() {
        return {
            tagsList : [],
            isRouterAlive: true,
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    methods:{
        reload(){
            this.isRouterAlive = false;
            this.$nextTick(function(){
                this.isRouterAlive = true;
            })
        }
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    }
};
</script>
