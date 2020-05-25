<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title" style="color: #20a0ff">智能制造云平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"> 用户名</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter.native="LogIn">      <!-- 此处设置回车事件-->
                        <el-button slot="prepend" icon="el-icon-lx-lock"> 密 码 </el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="LogIn">登 录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="info" @click="Register">注 册</el-button>
                </div>
                <p class="login-tips">版本号：v0.9</p>
            </el-form>
        </div>
    </div>
</template>

<script>//该段等待修改
    import service from '../../utils/request';
    import qs from 'qs';

export default {
        data: function() {
            return {
                param: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                }
            };
        },
        methods: {
            LogIn(){
                let that = this;        //用that来代指this
                service.post(
                    '/user/login',     //此处为服务器的接口
                    qs.stringify(       //将格式转化为json
                        {       //传给服务器的数据
                            username:that.param.username,password:that.param.password
                        }
                    ))
                    .then(function (response) {     //处理服务器响应
                        console.log("login-code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('登录失败，用户名或密码错误');
                            console.log(response);
                        }else{
                            //用户信息拉取完毕
                            console.log(response);
                            //保存相关信息到本地
                            switch (response.data.state) {
                                case 1:
                                    localStorage.setItem('user_state',"普通员工");
                                    break;
                                case 2:
                                    localStorage.setItem('user_state',"生产管理");
                                    break;
                                case 3:
                                    localStorage.setItem('user_state',"工厂老板");
                                    break;
                                default:
                                    localStorage.setItem('user_state',"未加入工厂");
                                    break;
                            }
                            localStorage.setItem('user_username', response.data.username);
                            localStorage.setItem('user_name',response.data.name);
                            if(response.data.headurl === null){
                                localStorage.setItem('head_url', null);
                            }else{
                                localStorage.setItem('head_url', response.data.headurl);
                            }
                            localStorage.setItem('factory_name', response.data.facname[0]);
                            that.$router.push('/index');
                            that.$message.success("你好,"+localStorage.getItem("user_name"));
                        }
                    })
                    .catch(function (error) {
                        if (error.response) {
                            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                            console.log("登录时，服务器请求码不在2xx范围内");
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', "登录时"+error.message);
                        }
                        console.log(error.config);
                    });
            },
            Register(){
                this.$router.push('/register');
            }
        },
    created(){
            if(localStorage.getItem("user_") !== 'null'){
                this.param.username = localStorage.getItem('user_username');
                //若未注销，则自动填充用户名及密码，并清除localStorage
                localStorage.removeItem('user_username');
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_state');
                localStorage.removeItem('head_url');
                localStorage.removeItem('factory_name');
            }

    }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }
    .ms-content {
        padding: 30px 30px;
    }
    .login-btn {
        text-align: center;
    }
    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }
    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
