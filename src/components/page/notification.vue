<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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
            <el-button type="primary" class="add_buuton" @click="addMsgVisible=true">添加</el-button>
        </div>
        <!--添加提醒-->
        <el-dialog title="添加提醒" :visible.sync="addMsgVisible" width="30%">
            <span>内容：</span>
            <input v-model="msg.content" style="width: 80%"></input>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addMsgVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addMsg">发 布</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from '../../utils/request';


    function REMIND(id,content,type,el_type,date){
        //提醒
        this.id = id;
        this.content = content;
        this.type = type;
        this.el_type = el_type;
        this.date = date;
    }

    export default {
        inject:['reload'],
        data() {
            return {
                message: 'first',
                showHeader: false,
                reminds:[],
                addMsgVisible : false,
                msg:{
                    content:"",
                    type:"",
                    time:""
                }
            }
        },
        methods: {
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
            },
            addMsg(){
                let that = this;
                this.msg.type = 0;
                this.msg.time = (new Date()).valueOf();
                console.log(this.msg.content);
                service.post(
                    '/message/add',{
                        time:that.msg.time,
                        content:that.msg.content,
                        type:that.msg.type
                    })
                    .then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if(response.code == '500'){
                            that.$message.error('发布通知时：' + response.msg);
                            console.log("发布通知时："  + response.msg);
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
                this.addMsgVisible = false;

                this.reload();
            }
        },
        computed: {
        },
        beforeCreate() {
            let that = this;
            service.get(
                '/message/index')
                .then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code == '500'){
                        that.$message.error('获取通知列表时，信息拉取失败' + response.msg);
                        console.log("获取通知列表时，信息拉取失败"  + response.msg);
                    }else{
                        console.log(response);
                        for(let i = 0;i < response.data.length; i++){
                            let content, type, el_type, date, id;
                            id = response.data[i].messageid;
                            content = response.data[i].content;
                            date = new Date(response.data[i].time);
                            switch (response.data[i].type) {
                                case 0:
                                    el_type = '';
                                    type = '通知';
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
                        that.remind_num = response.data.length;
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

<style>
    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
    }
    .add_buuton{
        margin-top: 20px;
    }
</style>

