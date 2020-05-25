<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 调度列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-date" @click="handleadd">新建工单</el-button>
      </div>
      <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header"
              @selection-change="handleSelectionChange"
      >
        <el-table-column type="Selection" width="55" align="center"></el-table-column>
        <el-table-column prop="scheid" label="工单id" width="100" align="center"></el-table-column>
        <el-table-column prop="planid" label="计划id" width="100" align="center"></el-table-column>
        <el-table-column prop="dealid" label="订单id" width="130" align="center"></el-table-column>
        <el-table-column prop="productname" label="订单名" width="130"></el-table-column>
        <el-table-column label="订单数量" align="center">
          <template slot-scope="scope">{{scope.row.dealnum}}</template>
        </el-table-column>
        <el-table-column label="调度数量" align="center">
          <template slot-scope="scope">{{scope.row.schenum}}</template>
        </el-table-column>
        <el-table-column prop="equipno" label="工作机器id" width="130" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state===1?'success':(scope.row.state===0?'danger':'')">
              {{scope.row.state===1?'加工中':(scope.row.state===0?'未开始':'已完成')}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="start" label="开始时间"></el-table-column>
        <el-table-column prop="end" label="结束时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.$index, scope.row)"
            >启动</el-button>
            <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="red"
                    @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="addVisible" width="60%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="计划id">
          <el-input v-model="addForm.planid"></el-input>
        </el-form-item>
        <el-form-item label="调度数量">
          <el-input v-model="addForm.schenum"></el-input>
        </el-form-item>
        <el-form-item label="机器编号">
          <el-input v-model="addForm.equipno"></el-input>
        </el-form-item>
        <div class="block">
          <span class="demonstration">开始日期</span>
          <el-date-picker
                  v-model="addForm.start"
                  type="date"
                  placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">截止日期</span>
          <el-date-picker
                  v-model="addForm.end"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
    import service from '../../utils/request';
    import serviceJson from '../../utils/request';
    //import qs from 'qs';
    export default {
        name: 'dispatchtable',
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
                pageTotal: 0,
                form: {},
                addForm: {},
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
                    '/sche/index'
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

            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.idx = index;
                        this.form = row;
                        this.scheremove();

            },
            scheremove(){
                let that = this;
                service.get('/sche/remove',
                    {
                        params:{
                            scheid: that.form.scheid
                        }
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
                //window.location.reload();
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.changestate();
                //this.$message.success(localStorage.getItem("tips"));
            },
            changestate(){
                    let that = this;
                    service.get('sche/start',
                        {
                            params:{
                                scheid: that.form.scheid
                            }
                        }
                    ).then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        /*window.location.reload(true);*/
                        if(response.code === '500'){
                            //localStorage.setItem('tips', response.msg);
                            that.$message.error(response.msg);
                            console.log(response.msg);
                        }else{
                            console.log(response);
                            window.location.reload();
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
                //window.location.reload();
            },
            handleadd() {
                this.addVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.dispatchUpdate();
                this.editVisible = false;
            },
            dispatchUpdate(){
                let that = this;
                serviceJson.post(
                    '/sche/add',
                    {
                        plan:{
                            planid:that.addForm.planid,
                        },
                        schenum:that.addForm.schenum,
                        equip:{
                            equipno:that.addForm.equipno,
                        },
                        start:that.addForm.start,
                        end:that.addForm.end

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