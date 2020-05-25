<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!--<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
                <el-table-column prop="username" label="员工名"></el-table-column>
                <!--<el-table-column label="权限">-->
                    <!--<template slot-scope="scope">{{scope.row.rank}}</template>-->
                <!--</el-table-column>-->
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag>
                            {{scope.row.state===1?'普通员工':(scope.row.state===2?'生产管理':(scope.row.state===0?'待审核':'Boss'))}}       <!--success为绿色，danger为红色-->
                        </el-tag>
                    </template>
                </el-table-column>


                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleAdd(scope.$index, scope.row)"
                                v-show="scope.row.state===0"
                        >批准通过</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-check"
                                @click="handleEdit(scope.$index, scope.row)"
                        >提升员工</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-circle-close"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除员工</el-button>
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

         <!--编辑弹出框-->
        <!--<el-dialog title="启用" :visible.sync="editVisible" width="30%">-->
            <!--<el-form ref="form" :model="form" label-width="70px">-->
                <!--<el-form-item label="货物描述">-->
                    <!--<el-input v-model="form.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="货物描述">-->
                    <!--<el-input v-model="form.address"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="editVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="saveEdit">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog> -->
    </div>
</template>

<script>
    import { fetchemployee_Data } from '../../api/index';
    import service from '../../utils/request';
    import qs from 'qs';
    export default {
        name: 'employee_table',
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                facname:'',
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,

                pageTotal: 0,
                form: {},
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
                // fetchemployee_Data(this.query).then(res => {
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
                    '/employee/index'
                ).then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('员工信息拉取失败');
                        console.log("员工信息拉取失败");
                    }else{
                        console.log(response);
                        that.tableData = response.data;
                        that.facname = localStorage.getItem("factory_name")
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
            add(){
                let that = this;
                service.get('employee/add',
                    {
                        params:{
                            username: that.form.username
                        }
                    }

                );
                window.location.reload(true);
            },


            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            handleAdd(index, row) {
                // 二次确认批准
                this.$confirm('确定要批准吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.form = row;
                        this.add();

                        //this.tableData.splice(index, 1);
                    })
                    .catch(() => {});

            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要开除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.form = row;
                        this.remove();
                        //this.tableData.splice(index, 1);
                    })
                    .catch(() => {});

            },
            // 多选操作
            promote(){
                if(this.form.state===1){
                    let that = this;

                    service.get('employee/promote',
                        {
                            params:{
                                username: that.form.username
                            }
                        }
                    );
                    window.location.reload(true);
                }else{
                    alert("无法提升");
                }
            },
            remove(){
                if(this.form.state===1||this.form.state===2){
                    let that = this;
                    service.get('employee/remove',
                        {
                            params:{
                                username: that.form.username
                            }
                        }

                    );
                    window.location.reload(true);
                }else{
                    alert("无法开除");
                }
            },

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
                this.promote();
            },
            // 保存编辑
            // saveEdit() {
            //     this.editVisible = false;
            //     this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            //     this.$set(this.tableData, this.idx, this.form);
            // },
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
