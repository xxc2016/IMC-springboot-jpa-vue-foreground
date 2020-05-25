<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-date" @click="handleadd">新建订单</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="dealid" label="订单ID" width="55" align="center"></el-table-column>
                <el-table-column prop="dealfrom" label="订单来源" width="150" align="center"></el-table-column>
                <el-table-column prop="productname" label="产品名称" width="150" align="center"></el-table-column>
                <el-table-column prop="num" label="数量" width="150" align="center"></el-table-column>
                <el-table-column prop="deadline" label="截止日期"  align="center"></el-table-column>
                <el-table-column prop="finishnum" label="完成数量"  align="center"></el-table-column>
                <el-table-column label="状态"  align="center">
                    <template slot-scope="scope">
                        <el-tag>
                            {{scope.row.state===1?'已接受':(scope.row.state===2?'已拒绝':(scope.row.state===0?'未接单':(scope.row.state===3?'加工中':'已完成')))}}       <!--success为绿色，danger为红色-->
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleEdit(scope.$index, scope.row)"
                        >接单</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-close"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >拒绝订单</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="产品名称">
                    <el-input v-model="addForm.productname"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="addForm.num"></el-input>
                </el-form-item>
                <div class="block">
                    <span class="demonstration">截止日期</span>
                    <el-date-picker
                            v-model="addForm.deadline"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="deleteVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="取消理由">
                    <el-input v-model="deleteform.memo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="savedelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from '../../utils/request';
    import serviceJson from '../../utils/request';
    import qs from 'qs';
    export default {
        name: 'order_table',
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
                deleteVisible:false,
                pageTotal: 0,
                form: {},
                addForm: {},
                deleteform: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                let that = this;

                service.get(
                        '/deal/index'
                ).then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error(response.msg);
                        console.log(response.msg);
                    }else{
                        console.log(response);
                        that.tableData = response.data;
                        for(var i=0;i<that.tableData.length;i++){
                            that.tableData[i]["capacity"]=0;
                        }
                    }
                }).catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("error02");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });
                //window.location.reload(true);
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 删除操作
            handleDelete(index, row) {
                this.deleteform.dealid = row.dealid;
                this.deleteVisible = true;
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`停工了${str}`);
                this.multipleSelection = [];
            },
            // 编辑操作
            handleadd() {
                this.addVisible = true;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.changestate();
            },
            changestate(){
                    let that = this;
                    service.get('deal/accept',
                            {
                                params:{
                                    dealid: that.form.dealid
                                }
                            }
                    ).then(function(response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if (response.code === '500') {
                            that.$message.error(response.msg);
                            console.log(response.msg);
                        } else {
                            console.log(response);
                            window.location.reload();
                        }
                    }).catch(function(error) {
                        if (error.response) {
                            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                            console.log("error02");
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    });
                //window.location.reload();

            },
            savedelete() {
                this.deleteVisible = false;
                this.orderdelete();
            },
            orderdelete(){
                    let that = this;
                    service.post(
                            '/deal/refuse',
                            qs.stringify({
                                dealid: that.deleteform.dealid,
                                memo: that.deleteform.memo
                            })
                    ).then(function(response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if (response.code === '500') {
                            that.$message.error(response.msg);
                            console.log(response.msg);
                        } else {
                            console.log(response);
                            window.location.reload();
                        }
                    }).catch(function(error) {
                        if (error.response) {
                            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                            console.log("error02");
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    });
                //window.location.reload();
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.orderUpdate();
            },
            orderUpdate(){
                let that = this;
                serviceJson.post(
                        '/deal/add',
                        {
                            product:{
                                productname:that.addForm.productname,
                            },
                            num:that.addForm.num,
                            deadline:that.addForm.deadline

                        }
                ).then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error(response.msg);
                        console.log(response.msg);
                    }else{
                        console.log(response);
                        window.location.reload();
                    }
                }).catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("error02");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
