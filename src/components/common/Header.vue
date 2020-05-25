<template>
    <div>
    <!--顶部导航栏-->
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <!--logo和标题-->
        <div class="logo">智能云</div>
        <!--顶部导航栏右侧-->
        <div class="header-right">
            <!--顶部导航栏用户下拉-->
            <div class="header-user-con">
                <!-- 全屏显示       暂时弃用
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>-->
                <!-- 消息中心 -->
                <!--顶部导航栏提醒控件-->
                <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message_number?`有${message_number}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/notification">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message_number"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="photo_src" alt="用户头偶"/>
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{user_info.username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="viewUserInfo">用户信息</el-dropdown-item>
                        <el-dropdown-item @click.native="viewFactory">切换工厂</el-dropdown-item>
                        <el-dropdown-item @click.native="facChangeVisible = true">新的工厂</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- 结束用户名下拉菜单 -->
            </div>
            <!--结束顶部导航栏用户下拉-->
        </div>
        <!--结束顶部导航栏右侧-->
    </div>
    <!--结束顶部导航栏-->
        <!--用户信息弹窗-->
        <el-dialog title="用户信息" :visible.sync="userVisible" width="30%">
            <el-form ref="form" label-width="70px">
                <div class="user-info-list-center" style="align-items: center">
                    <img :src="photo_src" class="user-avator-img" alt="用户头像" />
                </div>
                <div class="user-info-list-center">
                    姓名：
                    <span>{{user_info.name}}</span>
                </div>
                <div class="user-info-list-center">
                    性别：
                    <span>{{user_info.gender}}</span>
                </div>
                <div class="user-info-list-center">
                    权限：
                    <span>{{user_info.state}}</span>
                </div>
                <div class="user-info-list-center">
                    年龄：
                    <span>{{user_info.age}}</span>
                </div>
                <div class="user-info-list-center">
                    邮箱：
                    <span>{{user_info.mail}}</span>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userInfoChange">修改个人信息</el-button>
                <el-button type="primary" @click="userVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户信息-->
        <el-dialog title="修改用户信息" :visible.sync="userChangeVisible" width="30%">
            <el-form ref="form" model="user_info_change" label-width="70px">
                <div class="user-info-list-center">
                    <el-upload
                            class="avatar-uploader"
                            action="http://212.64.94.186:8080/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="photo_src" :src="photo_src" class="avatar_upload">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="user-info-list-center">
                    头像：
                    <input v-model="user_info_change.headurl" ></input>
                </div>
                <div class="user-info-list-center">
                    姓名：
                    <input v-model="user_info_change.name"></input>
                </div>
                <div class="user-info-list-center">
                    性别：
                    <input v-model="user_info_change.gender"></input>
                </div>
                <div class="user-info-list-center">
                    年龄：
                    <input v-model="user_info_change.age"></input>
                </div>
                <div class="user-info-list-center">
                    邮箱：
                    <input v-model="user_info_change.mail"></input>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userChangeVisible = false">取消</el-button>
                <el-button type="primary" @click="userInfoComfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--工厂切换弹窗-->
        <el-dialog title="工厂切换" :visible.sync="facVisible" width="30%">
            <el-select v-model="fac_now" placeholder="切换工厂" class="handle-select mr10" style="margin-left: 30%;width: 40%">
                <el-option
                        v-for="item in facname"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="facVisible = false">取 消</el-button>
                    <el-button type="primary" @click="ChangeFac">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="加入工厂" :visible.sync="facChangeVisible" width="30%">
            <span>输入工厂名：</span>
            <input v-model="fac_new"></input>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="facChangeVisible = false, facNewVisible = true">创建工厂</el-button>
                    <el-button @click="facChangeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="joinFac">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新建工厂" :visible.sync="facNewVisible" width="30%">
            <span>输入工厂名：</span>
            <input v-model="fac_new"></input>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="facNewVisible = false,facChangeVisible = true">加入工厂</el-button>
                    <el-button @click="facNewVisible = false">取 消</el-button>
                    <el-button type="primary" @click="newFac">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import bus from '../common/bus';
import service from '../../utils/request';
import qs from 'qs';

function FACNAME(name){
    this.value = name;
}

export default {
    inject : ['reload'],
    data: function(){
            return {
                photo_src : localStorage.getItem('head_url') !== 'null' ? "http://212.64.94.186:8080" + localStorage.getItem('head_url')  : require("../../assets/img/img.jpg"),
                form:{
                    //暂未添加，为减少警告
                },
                user_info:{
                    gender : 'null',
                    age : 'null',
                    mail : 'null',
                    state : localStorage.getItem('user_state')?localStorage.getItem('user_state'):'null',
                    name : localStorage.getItem('user_name')?localStorage.getItem('user_name'):'null',
                    username : localStorage.getItem('user_username')?localStorage.getItem('user_username'):'null'
                },
                user_info_change:{
                    name  : 'null',
                    gender : 'null',
                    gender_code  : -1,
                    age : 'null',
                    mail : 'null',
                    headurl : ''
                },
                collapse: false,
                fullscreen: false,
                facname : [],
                fac_now : localStorage.getItem('factory_name'),
                fac_new : '',
                message_number : 0,
                facNewVisible  : false,
                userVisible: false,
                userChangeVisible: false,
                facVisible: false,
                facChangeVisible: false
            };
        },
    computed: {

    },
    methods: {
        //拉取用户信息
        viewUserInfo(){
            let that = this;
            service.get(
                '/user/info',     //此处为服务器的接口
            )
                .then(function (response) {     //处理服务器响应
                    console.log("viewUserInfo-code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('查看用户信息失败，无此表项');
                        console.log("查看用户信息失败");
                        console.log(response);
                    }else{
                        //用户信息拉取完毕
                        console.log(response);
                        that.user_info.gender = !response.data.sex?'男':'女';
                        that.user_info.age = response.data.age;
                        that.user_info.mail = response.data.mail;
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("查看用户信息时，服务器请求码不在2xx范围内");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', "查看用户信息时"+error.message);
                    }
                    console.log(error.config);
                });
            that.userVisible=true;      //显示用户下拉栏
        },
        userInfoChange(){
            this.userVisible = false;
            this.user_info_change.name = this.user_info.name;
            this.user_info_change.gender = this.user_info.gender;
            this.user_info_change.age = this.user_info.age;
            this.user_info_change.mail = this.user_info.mail;
            this.user_info_change.headurl = localStorage.getItem('head_url');
            this.userChangeVisible = true;
        },
        handleAvatarSuccess(res, file){
            this.user_info_change.headurl = res.data;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';       //判断格式是否为JPG格式
            const isLt2M = file.size / 1024 / 1024 < 20;     //判断大小是否超过2MB
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 20MB!');
            }
            return isJPG && isLt2M;
        },
        userInfoComfirm(){
            let that = this;
            this.user_info_change.gender_code = this.user_info_change.gender === '男'?0:1;
            service.post(
                '/user/info/update',     //此处为服务器的接口
                    {       //传给服务器的数据
                        name:that.user_info_change.name,
                        sex:that.user_info_change.gender_code,
                        age:that.user_info_change.age,
                        mail:that.user_info_change.mail,
                        headurl:that.user_info_change.headurl
                    }
            )
                .then(function (response) {     //处理服务器响应
                    console.log("viewFacIndex-code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('用户信息更新失败' + response.data.msg);
                        console.log(response);
                    }else{
                        //用户信息拉取完毕
                        that.$message.success("用户信息更新成功");
                        console.log(response);
                        that.$router.push("/login");
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("查看工厂列表信息时，服务器请求码不在2xx范围内");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', "查看工厂列表信息时"+error.message);
                    }
                    console.log(error.config);
                });
            that.userChangeVisible = false;
        },
        joinFac(){
            let that = this;
            service.post(
                '/user/joinFactory',     //此处为服务器的接口
                'facname=' + that.fac_new
            )
                .then(function (response) {     //处理服务器响应
                    console.log("viewFacIndex-code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('加入工厂失败,' + response.msg);
                        console.log(response);
                    }else{
                        //用户信息拉取完毕
                        that.$message.success("加入工厂成功" + response.msg);
                        console.log(response);
                        that.$router.push("/login")
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("查看工厂列表信息时，服务器请求码不在2xx范围内");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', "新建工厂时"+error.message);
                    }
                    console.log(error.config);
                });
        },
        newFac(){
            let that = this;
            if(!(localStorage.getItem('user_state') === "工厂老板" || localStorage.getItem('user_state') === '未加入工厂')){
                that.$alert('对不起，您没有创建工厂的权限');
                return ;
            }
            service.post(
                '/user/registerFactory',     //此处为服务器的接口
                'facname=' + that.fac_new
            )
                .then(function (response) {     //处理服务器响应
                    console.log("viewFacIndex-code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('创建工厂失败,' + response.msg);
                        console.log(response);
                    }else{
                        //用户信息拉取完毕
                        that.$message.success("创建工厂成功" + response.msg);
                        console.log(response);
                        that.$router.push("/login")
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("查看工厂列表信息时，服务器请求码不在2xx范围内");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', "创建工厂时"+error.message);
                    }
                    console.log(error.config);
                });
            this.facNewVisible = false;
        },
        viewFactory(){
            let that = this;
            if(localStorage.getItem('user_state') === "未加入工厂"){
                //权限判断
                this.$alert('您未加入工厂，是否加入工厂？', '提示',
                    {
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        callback: action => {
                            if(action === 'confirm'){
                                this.facChangeVisible = true;
                            }
                        }
                    }
                );
                return;
            }
            service.get(
                '/factory/index',     //此处为服务器的接口
            )
                .then(function (response) {     //处理服务器响应
                    console.log("viewFacIndex-code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('查看工厂列表失败，无此表项' + response.data.msg);
                        console.log(response);
                    }else{
                        //用户信息拉取完毕
                        console.log(response);
                        for(let i = 0;i < response.data.length;i++){
                            that.$set(that.facname,i,new FACNAME(response.data[i]));
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log("查看工厂列表信息时，服务器请求码不在2xx范围内");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', "查看工厂列表信息时"+error.message);
                    }
                    console.log(error.config);
                });
            this.facVisible = true;     //显示切换工厂列表
        },
        ChangeFac(){
            localStorage.removeItem('factory_name');
            localStorage.setItem('factory_name',this.fac_now);
            this.facVisible = false;
            this.reload();
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command === 'loginout') {
                let that = this;        //用that来代指this
                service.get('/user/signout')
                    .then(function (response) {     //处理服务器响应
                        console.log("logout-code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('注销失败，当前用户未登录' + response.data.msg);
                        }else{
                            //用户信息拉取完毕
                            console.log(response);
                            //保存相关信息到本地
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
                localStorage.removeItem('user_username');
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_state');
                localStorage.removeItem('head_url');
                localStorage.removeItem('factory_name');
                this.$router.push('/login');
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    },
    created() {
        bus.$on("remind_num",(message)=>{
            this.message_number = message;
        });
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.user-avator-img{
    width: 240px;
    height: 240px;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}

.user-info-list-center {
    font-size: 16px;
    color: #999;
    line-height: 25px;
    text-align: center;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 178px;
    text-align: center;
}

.avatar_upload {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
