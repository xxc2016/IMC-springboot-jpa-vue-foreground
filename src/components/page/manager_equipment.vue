<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button-->
                        <!--type="primary"-->
                        <!--icon="el-icon-delete"-->
                        <!--class="handle-del mr10"-->
                        <!--@click="delAllSelection"-->
                <!--&gt;批量停工</el-button>-->
                <!--<el-select v-model="query.date" placeholder="工厂" class="handle-select mr10">-->
                    <!--<el-option key="1" label="工厂1" value="工厂1"></el-option>-->
                    <!--<el-option key="2" label="工厂2" value="工厂2"></el-option>-->
                <!--</el-select>-->
                <!--<el-select v-model="query.address" placeholder="状态" class="handle-select mr10">-->
                    <!--<el-option key="3" label="运行" value="运行"></el-option>-->
                    <!--<el-option key="4" label="空闲" value="空闲"></el-option>-->
                    <!--<el-option key="5" label="停工" value="停工"></el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="query.name" placeholder="设备名" class="handle-input mr10"></el-input>-->
                <!--<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">增加</el-button>

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
                <el-table-column prop="equipid" label="设备ID"  align="center"></el-table-column>
                <el-table-column prop="equipno" label="设备序号"><template slot-scope="scope">{{scope.row.equipno}}</template></el-table-column>
                <!--<el-table-column label="设备价格">-->
                    <!--<template slot-scope="scope">￥{{scope.row.money}}</template>-->
                <!--</el-table-column>-->
                <!--暂时不要-->
                <!--<el-table-column label="头像(查看大图)" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-image-->
                                <!--class="table-td-thumb"-->
                                <!--:src="scope.row.thumb"-->
                                <!--:preview-src-list="[scope.row.thumb]"-->
                        <!--&gt;</el-image>-->
                    <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.state===1?'success':(scope.row.state===0?'danger':'')"
                        >{{scope.row.state===1?'加工中':(scope.row.state===0?'停工中':(scope.row.state===2?'待机中':'故障'))}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="生产产品"><template slot-scope="scope"><el-select v-model="scope.row.productid" placeholder="请选择产品" @change="showCapacity(scope.$index,scope.row)" class="handle-select mr10">
                    <el-option
                            v-for="item in productlist"
                            :key="item.productid"
                            :label="item.productname"
                            v-model="item.productid"
                    >
                    </el-option>
                </el-select></template></el-table-column>
                <el-table-column label="产能"  align="center"><template slot-scope="scope">{{scope.row.capacity}}</template>
                    </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleStart0(scope.$index, scope.row)"
                                v-show="scope.row.state!==1"
                        >启用</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleStop(scope.$index, scope.row)"
                                v-show="scope.row.state===1"
                        >暂停</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleStop0(scope.$index, scope.row)"
                                v-show="scope.row.state!==0"
                        >停机</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleError0(scope.$index, scope.row)"
                        >故障</el-button>

                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-close"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="增加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="70px">
                <el-form-item label="设备编号">
                    <el-input v-model="addForm.equipno"></el-input>
                </el-form-item>
                <!--<div class="crop-demo">-->
                    <!--<div class="crop-demo-btn">选择图片-->
                        <!--<input class="crop-input" type="file" name="image" accept="image/*"/>-->
                    <!--</div>-->
                <!--</div>-->
                <el-select v-model="query.productid" placeholder="选择产品" class="handle-select mr10" style = "width:90%;text-align: center;">
                    <el-option
                            v-for="item in productlist"
                            :key="item.productid"
                            :label="item.productname"
                            v-model="item.productid">
                    </el-option>
                </el-select>
                <el-form-item label="产能">
                    <el-input v-model="addForm.capacity"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="更新" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="设备编号">
                    <el-input v-model="updateForm.equipno"></el-input>
                </el-form-item>
                <!--<div class="crop-demo">-->
                    <!--<div class="crop-demo-btn">选择图片-->
                        <!--<input class="crop-input" type="file" name="image" accept="image/*"/>-->
                    <!--</div>-->
                <!--</div>-->

                <el-select v-model="query.productid" placeholder="选择产品" class="handle-select mr10" width="90%">
                    <el-option
                            v-for="item in productlist"
                            :key="item.productid"
                            :label="item.productname"
                            v-model="item.productid">
                    </el-option>
                </el-select>
                <el-form-item label="产能">
                    <el-input v-model="updateForm.capacity"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    //import { fetchequip_Data } from '../../api/index';
    import service from '../../utils/request';
    import serviceJson from '../../utils/request';
    import qs from 'qs';
    export default {
        inject:['reload'],
        name: 'equip_table',
        data() {
            return {
                query: {
                    address: '',
                    equipid: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                equipProductid:-1,

                facname:'',
                tableData: [],
                productlist : [],
                multipleSelection: [],
                delList: [],
                capacityList:[],
                addVisible: false,
                editVisible: false,
                pageTotal: 0,
                form: {},
                addForm:{},
                updateForm:{},
                idx: -1,
                id: -1
            };

        },
        created() {
            this.getData();
            //console.log(this.tableData);
        },

        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                // fetchequip_Data(this.query).then(res => {
                //     console.log(res);
                //     this.tableData = res.list;
                //     this.pageTotal = res.pageTotal || 50;
                // });
                let that = this;
                //确定登录工厂状态
                service.post('/user/loginFactory',
                    qs.stringify({
                        facname:localStorage.getItem("factory_name")

                    }));
                //获取数据
                service.get(
                    '/equip/index'
                ).then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('设备信息拉取失败');
                        console.log("设备信息拉取失败");
                    }else{
                        console.log(response);
                        that.tableData = response.data;
                        that.facname = localStorage.getItem("factory_name");
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

                service.get('/product/index').then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
                    }else{
                        console.log(response);
                        that.productlist = response.data;
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
            showCapacity(index,row){

                let that = this;
                let flag = 0;
                //let length = this.equipnoList.length;
                that.form = row;

                service.post('equip/search',
                    qs.stringify({
                        equipno: that.form.equipno
                    })
                ).then(function(response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if (response.code === '500') {
                        that.$message.error('设备信息拉取失败');
                        console.log("设备信息拉取失败");
                    } else {
                        console.log(response);
                        let i = 0;
                        for (i; i < response.data.products.length; i++) {
                            if (that.form.productid === response.data.products[i]) {
                                that.form.capacity = response.data.num[i];

                                flag = 1;
                                break;
                            }
                        }
                        if(flag===0){
                            that.form.capacity=0;
                        }
                        that.$set(that.tableData,index,that.form);
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
                //this.reload();
                //this.$set(this.tableData,index,row);
            },
            handleAdd(){
                this.addVisible = true;
            },
            saveAdd(){
                let that = this;
                console.log(that.query.productid);
                var capacity = {};
                capacity[that.query.productid]=that.addForm.capacity;
                serviceJson.post(
                    '/equip/add',
                    {
                        equip:{
                            equipno:that.addForm.equipno,
                            picurl: null
                        },
                        capacity: capacity

                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
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
                that.addVisible = false;

            },
            equipRemove(){
                let that = this;
              service.get('/equip/remove',
                  {
                      params:{
                        equipid: that.form.equipid
                      }
                  }
              ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
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

                })
            },

            equipStop(){
                let that = this;
                service.get('/equip/wait',
                    {
                        params:{
                            equipid: that.form.equipid
                        }
                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
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
            equipStop0(){
                let that = this;
                service.get('/equip/stop',
                    {
                        params:{
                            equipid: that.form.equipid
                        }
                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
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
            equipStart0(){
                let that = this;
                service.get('/equip/start',
                    {
                        params:{
                            equipid: that.form.equipid
                        }
                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
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
            equipError(){
                let that = this;
                service.get('/equip/error',
                    {
                        params:{
                            equipid: that.form.equipid
                        }
                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
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
            equipUpdate(){
                let that = this;
                console.log(that.query.productid);
                var capacity = {};
                capacity[that.query.productid]=that.updateForm.capacity;
                serviceJson.post(
                    '/equip/update',
                    {
                        equip:{
                            equipid:that.form.equipid,
                            equipno:that.updateForm.equipno,
                            picurl: null
                        },
                        capacity: capacity
                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
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
            // 触发搜索按钮
            // handleSearch() {
            //     this.$set(this.query, 'pageIndex', 1);
            //     this.getData();
            // },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除

                console.log(row.state);
                if(row.state!==1) {
                    this.$confirm('确定要删除设备吗？', '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            this.$message.success('删除成功');
                            this.form = row;
                            this.equipRemove();
                        })
                        .catch(() => {
                        });
                }else{
                    this.$confirm('确定要删除设备吗？', '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            this.$message.success('删除失败');
                            this.form = row;

                        })
                        .catch(() => {
                        });
                }
            },
            handleStart0(index, row) {
                // 二次确认删除
                this.$confirm('确定启用设备吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('已启用');
                        this.form = row;
                        this.equipStart0();
                    })
                    .catch(() => {});



            },
            handleStop(index, row) {
                // 二次确认删除
                this.$confirm('确定要暂停设备吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('暂停成功');
                        this.form = row;
                        this.equipStop();
                    })
                    .catch(() => {});


            },

            handleStop0(index, row) {
                // 二次确认删除
                this.$confirm('确定要停工设备吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('停工成功');
                        this.form = row;
                        this.equipStop0();
                    })
                    .catch(() => {});


            },


            handleError0(index, row) {
                // 二次确认删除
                this.$confirm('确定设备故障吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('已确定故障');
                        this.form = row;
                        this.equipError();
                    })
                    .catch(() => {});

            },


            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // delAllSelection() {
            //     const length = this.multipleSelection.length;
            //     let str = '';
            //     this.delList = this.delList.concat(this.multipleSelection);
            //     for (let i = 0; i < length; i++) {
            //         str += this.multipleSelection[i].name + ' ';
            //     }
            //     this.$message.error(`停工了${str}`);
            //     this.multipleSelection = [];
            // },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;

            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                console.log(this.query.productid);
                this.equipUpdate();




            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
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
