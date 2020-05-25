<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 产品列表
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
        <!--&gt;批量删除</el-button>-->
        <!--<el-input v-model="query.productname" placeholder="产品名" class="handle-input mr10"></el-input>-->
        <!--<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增产品</el-button>
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
        <!--<el-table-column prop="equipId" label="设备号" width="200" align="center"></el-table-column>-->
        <el-table-column prop="productid" label="编号" width="200" align="center"></el-table-column>
        <el-table-column prop="productname" label="产品名"></el-table-column>
        <el-table-column label="图片(查看大图)" align="center">
          <template slot-scope="scope">
            <el-image
                    class="table-td-thumb"
                    :src="headurl + scope.row.picurl"
                    :preview-src-list="[headurl +scope.row.picurl]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <!--<el-button-->
                    <!--type="text"-->
                    <!--icon="el-icon-upload"-->
                    <!--@click="handleupLoad(scope.$index, scope.row)"-->
            <!--&gt;上传</el-button>-->
            <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
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
    <el-dialog title="增加" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="产品名">
          <el-input v-model="addForm.productname"></el-input>
        </el-form-item>
        <div class="crop-demo">
          <div class="crop-demo-btn">选择图片
            <input class="crop-input" type="file"  @change="uploading($event)" name="image" accept="image/*"/>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form1" label-width="70px">
        <el-form-item label="产品名">
          <el-input v-model="updateForm.productname"></el-input>
        </el-form-item>
        <!--<el-form-item label="产品名">-->

          <!--<input type="file"  name="image0"  @change="upgrading($event)" accept="image/*" />-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUpdate">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="upVisible" width="30%">
      <el-form ref="form" :model="form2" label-width="70px">
        <!--<el-form-item label="产品名">-->
          <!--<el-input v-model="updateForm.productname"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="产品名">-->

        <input type="file"  name="image0"  @change="upgrading($event)" accept="image/*" />
        <!--</el-form-item>-->
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    //import { fetchproduct_Data } from '../../api/index';
    import service from '../../utils/request';
    import serviceJson from '../../utils/request';
    import serviceFormData from '../../utils/request';
    import qs from 'qs';
    export default {
        inject:['reload'],
        name: 'producttable',
        data() {
            return {
                query: {
                    address: '',
                    productname: '',
                    productid:null,
                    pageIndex: 1,
                    pageSize: 10
                },
                file:'',
                file0:'',
                addFile:'',
                upgradeFile:'',
                headurl:'http://212.64.94.186:8080',
                tableData: [],
                multipleSelection: [],
                delList: [],
                addVisible: false,
                editVisible: false,
                upVisible:false,
                pageTotal: 0,
                form:{},
                form1:{},
                form2:{},
                addForm: {},
                updateForm:{},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取后端数据
            getData() {
                // fetchproduct_Data(this.query).then(res => {
                //     console.log(res);
                //     this.tableData = res.list;
                // });
                let that = this;
                //确定登录工厂状态
                service.post('/user/loginFactory',
                    qs.stringify({
                        facname:localStorage.getItem("factory_name")
                    }));
                //获取数据
                service.get(
                    '/product/index'
                ).then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息拉取失败');
                        console.log("产品信息拉取失败");
                    }else{
                        console.log(response);
                        that.tableData = response.data;
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
            uploading(event){

                this.file = event.target.files[0];//获取文件

                let that = this;
                //console.log(that.addFile);
                let formdata = new FormData();

                formdata.append('file',this.file);
                serviceFormData.post('/upload',formdata).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息失败');
                        console.log("产品信息失败");
                    }else{
                        console.log(response);
                        that.addFile =response.data;
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
            upgrading(event){

                this.file0 = event.target.files[0];//获取文件

                let that = this;
                //console.log(that.addFile);
                let formdata = new FormData();

                formdata.append('file',this.file0);
                serviceFormData.post('/upload',formdata).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('图片失败');
                        console.log("图片失败");
                    }else{
                        console.log(response);
                        that.updateForm.picurl =response.data;

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

                serviceJson.post(

                    '/product/update',
                    {
                        picurl:that.updateForm.picurl,
                        productid:that.updateForm.productid,
                        productname:that.updateForm.productname,

                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品图片更新失败');
                        console.log("产品图片更新失败");
                        console.log(that.updateForm.productid);
                        console.log(that.updateForm.productname);
                        console.log(that.updateForm.picurl);

                    }else{
                        console.log(response);

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
                that.upVisible=false;

            },
            addProduct(){
              let that = this;
              serviceJson.post(
                  '/product/add',
                  {
                      productname:that.addForm.productname,
                      picurl:that.addFile
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

            removeProduct(row){
                let that = this;
                console.log(row.productid);
              service.get('product/remove',
                  {params:{productid:row.productid}}
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
            updateProduct(){
                let that = this;
                console.log(that.updateForm.productid);
                serviceJson.post(
                    '/product/update',
                    {
                        productid:that.updateForm.productid,
                        productname:that.updateForm.productname,
                    }
                ).then(function (response) {     //处理服务器响应

                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('产品信息更新失败');
                        console.log("产品信息更新失败");
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
                //this.reload();
            },
            handleAdd(){
                this.addVisible = true;
            },
            handleupLoad(index, row){
                this.updateForm = row;
                this.upVisible = true;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.removeProduct(row);
                        this.$message.success('删除成功');

                        this.getData();
                    })
                    .catch(() => {});
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
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.updateForm = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveAdd() {
                this.addProduct();
                this.addVisible = false;

                this.getData();
            },
            saveUpdate(){
                this.updateProduct();
                this.editVisible = false;


                //this.getData();
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
