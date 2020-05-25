<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <!--用户信息表-->
                <el-card shadow="hover" class="mgb20" style="height:252px;">    <!--shadow：hover表示鼠标悬停时显示阴影-->
                    <div class="user-info">
                        <img :src="photo_src" class="user-avator" alt="用户头像" />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{user_info.username}}</div>
                            <div>{{user_info.userstate}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        当前工厂：
                        <span>{{factory_now}}</span>
                    </div>
                </el-card>
                <!--生产状况条形图-->
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>设备生产总览</span>
                    </div>
                    停用:   {{equip_state_num.stop_use}}    台
                    <el-progress :percentage=equip_state_rate.stop_use color="#E6A23C"></el-progress>
                    正在生产:   {{equip_state_num.under_work}}  台
                    <el-progress :percentage=equip_state_rate.under_work color="#42b983"></el-progress>
                    等待订单:   {{equip_state_num.wait_for_deal}}   台
                    <el-progress :percentage=equip_state_rate.wait_for_deal></el-progress>
                    故障:   {{equip_state_num.break_down}}    台
                    <el-progress :percentage=equip_state_rate.break_down color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{deal_num}}</div>
                                    <div>订单数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{remind_num}}</div>
                                    <div>提醒</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">230万
                                    </div>
                                    <div>今年已完成订单总金额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>提醒事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="$router.push('/notification')">更多</el-button>
                    </div>
                    <el-table :show-header="false" :data="reminds" style="width:100%;">
                        <el-table-column width="100">
                            <template slot-scope="scope">
                                <el-tag :type=scope.row.el_type>
                                    {{scope.row.type}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div
                                        class="todo-item"
                                >{{scope.row.content}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="360">
                            <template slot-scope="scope">
                                <div
                                        class="todo-item"
                                >{{scope.row.date}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="35">
                            <template slot-scope="scope">
                                <i class="el-icon-delete"  @click="handleClick(scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <!--图表一-->
            <el-col :span="8">
                <el-card shadow="hover">
                    <span>订单状态</span>
                    <schart ref="pie1" class="schart" canvasId="pie1" :options="deal_state_chart"></schart>
                </el-card>
            </el-col>
            <!--图表二-->
            <el-col :span="8">
                <el-card shadow="hover">
                    <span>员工构成</span>
                    <schart ref="pie2" class="schart" canvasId="pie2" :options="deal_state_chart_1"></schart>
                </el-card>
            </el-col>
            <!--图表三-->
            <el-col :span="8">
                <el-card shadow="hover">
                    <span>产品生产份额</span>
                    <schart ref="pie3" class="schart" canvasId="pie3" :options="deal_state_chart_2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import service from '../../utils/request';
    import bus from '../common/bus';
    import qs from 'qs';

    function REMIND(id,content,type,el_type,date){
        //提醒
        this.id = id;
        this.content = content;
        this.type = type;
        this.el_type = el_type;
        this.date = date;
    }

    function DEAL(value,name) {
        //订单图表表项
        this.value = value;
        this.name = name;
    }

    export default {
        inject:['reload'],
        data() {
            return {
                factory_now: localStorage.getItem('factory_name') != 'undefined' ? localStorage.getItem('factory_name'):'未加入工厂',
                remind_num: 0,
                deal_num : 0,
                photo_src : localStorage.getItem('head_url') !== 'null' ? "http://212.64.94.186:8080" + localStorage.getItem('head_url')  : require("../../assets/img/img.jpg"),
                equip_state_num:{
                  under_work: 0,        //工作中的数量
                  wait_for_deal: 0,     //等待订单的数量
                  break_down: 0,        //故障数量
                },
                equip_state_rate:{
                    stop_use: 0,           //停止使用中的数量
                    under_work: 0,        //工作中的数量
                    wait_for_deal: 0,     //等待订单的数量
                    break_down: 0,        //故障数量
                },
                user_info:{
                    username: localStorage.getItem('user_username'),
                    userstate: localStorage.getItem('user_state')
                },
                reminds:[],
                deal_state_chart:{
                    title : '订单状态分布图',
                    type : 'pie',
                    legend: {
                        position: 'left'
                    },
                    labels: ["未接单","已接受","已拒绝","加工中","已完成"],
                    datasets: [
                        {
                            label: 'deal state schart',
                            backgroundColor: '#f87979',
                            data: [0,0,0,0,0]
                        }
                    ]
                },
                deal_state_chart_1:{
                    title : '员工级别分布图',
                    type : 'pie',
                    legend: {
                        position: 'left'
                    },
                    labels: ["公司老板","生产管理","普通员工"],
                    datasets: [
                        {
                            label: 'deal state schart',
                            backgroundColor: '#f87979',
                            data: [0,0,0]
                        }
                    ]
                },
                deal_state_chart_2:{
                    title : '产品生产份额分布图',
                    type : 'pie',
                    legend: {
                        position: 'left'
                    },
                    labels: ["鸡","鸭","猪","牛","鱼"],
                    datasets: [
                        {
                            label: 'deal state schart',
                            backgroundColor: '#f87979',
                            data: [0,0,0,0,0]
                        }
                    ]
                }
            }
        },
        components: {
            Schart
        },
        computed: {

        },
        methods: {
            changeDate() {      //调用时间函数，返回当前时间
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                });
            },
            handleClick(row){
                let that = this;
                let id = row.id.toString();
                console.log(id);
                service.get(
                    '/message/remove?messageid=' + id)
                    .then(function (response) {     //处理服务器响应
                        console.log("delete-message-code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('删除通知时' + response.msg);
                            console.log('删除通知时' + response.msg);
                        }else{
                            console.log(response);
                        }
                    })
                    .catch(function (error) {
                        if (error.response) {
                            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                            console.log("error02");
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    });
                this.reload();
            }
        },
        beforeCreate() {
            if(localStorage.getItem('user_state') === '未加入工厂'){
                this.$alert('当前未加入工厂');
                return;
            }
            let that = this;        //用that来代指this
            service.post(
                '/user/loginFactory','facname=' + localStorage.getItem('factory_name'))
                .then(function (response) {     //处理服务器响应
                    console.log("loginFac-code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('登录工厂时，信息拉取失败' + response.msg);
                        console.log("登录工厂时，信息拉取失败");
                        bus.$emit("remind_num",0);
                    }else{
                        console.log(response);
                        //显示设备状态数据
                        that.equip_state_num.stop_use = response.data.equipstates[0] !== 'undefined' ? response.data.equipstates[0] : 0;
                        that.equip_state_num.under_work = response.data.equipstates[1] !== 'undefined' ? response.data.equipstates[1] : 0;
                        that.equip_state_num.wait_for_deal = response.data.equipstates[2] !== 'undefined' ? response.data.equipstates[2] : 0;
                        that.equip_state_num.break_down = response.data.equipstates[3] !== 'undefined' ? response.data.equipstates[3] : 0;
                        let equip_sum = that.equip_state_num.stop_use + that.equip_state_num.under_work  +  that.equip_state_num.wait_for_deal + that.equip_state_num.break_down;
                        if(equip_sum === 0){
                            equip_sum = 1;
                        }
                        that.equip_state_rate.stop_use = (that.equip_state_num.stop_use / equip_sum  * 100).toFixed(0);
                        that.equip_state_rate.under_work = (that.equip_state_num.under_work / equip_sum  * 100).toFixed(0);
                        that.equip_state_rate.wait_for_deal = (that.equip_state_num.wait_for_deal / equip_sum * 100).toFixed(0);
                        that.equip_state_rate.break_down = (that.equip_state_num.break_down / equip_sum * 100).toFixed(0);
                        //显示总订单数
                        for(let i in response.data.dealstates){
                            that.deal_num += response.data.dealstates[i];
                        }
                        for(let i = 0;i < response.data.messages.length; i++){
                            let content, type, el_type, date, id;
                            id = response.data.messages[i].messageid;
                            content = response.data.messages[i].content;
                            date = new Date(response.data.messages[i].time);
                            switch (response.data.messages[i].type) {
                                case 0:
                                    el_type = '';
                                    type = '系统通知';
                                    break;
                                case 1:
                                    el_type = 'success';
                                    type = '申请信息';
                                    break;
                                case 2:
                                    el_type = 'danger';
                                    type = '警告';
                                    break;
                                default:
                                    el_type = 'danger';
                                    type = '错误类型';
                                    break;
                            }
                            that.$set(that.reminds,i,new REMIND(id,content,type,el_type,date));        //此处为表单更新，必须调用set方法、否则视图不会刷新
                        }
                        //显示提醒数量
                        that.remind_num = response.data.messages.length;
                        bus.$emit("remind_num",that.remind_num);
                        //设置图表一，订单状态图
                        for(let i in response.data.dealstates ){
                            that.$set(that.deal_state_chart.datasets[0].data,i,response.data.dealstates[i]);
                        }
                        //设置图表2
                        let data2 = [1,1,7];
                        for(let i in data2 ){
                            that.$set(that.deal_state_chart_1.datasets[0].data,i,data2[i]);
                        }
                        //设置图标3
                        let data3 = [12,36,53,6,71];
                        for(let i in data3 ){
                            that.$set(that.deal_state_chart_2.datasets[0].data,i,data3[i]);
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("error02");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-num span{
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-list {
        font-size: 20px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .user-info-name{
        font-size: 36px;
        color: darkblue;
    }

    .todo-item {
        font-size: 14px;
    }

    .schart {
        width: 100%;
        height: 300px;
    }
</style>