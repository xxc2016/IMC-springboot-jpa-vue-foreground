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
                    <el-input type="password" placeholder="密码" v-model="param.password" @keyup.enter.native="Register">      <!-- 此处设置回车事件-->
                        <el-button slot="prepend" icon="el-icon-lx-lock"> 密 码 </el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="Register">注 册</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="info" @click="$router.push('/login')">返 回 登 录 界 面</el-button>
                </div>
                <p class="login-tips">版本号：v0.9</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import service from '../../utils/request';
    import qs from 'qs';

    export default {
        data(){
            return{
                param: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                }
            }
        },
        methods:{
            Register(){
                let that = this;        //用that来代指this
                service.post(
                    '/user/register',     //此处为服务器的接口
                    qs.stringify(       //将格式转化为json
                        {       //传给服务器的数据
                            username:that.param.username,password:that.param.password
                        }
                    ))
                    .then(function (response) {     //处理服务器响应
                        console.log("login-code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('注册失败,用户名已存在');
                            console.log("注册失败,用户名已存在");
                            console.log(response);
                        }else{
                            //用户信息拉取完毕
                            that.$message.success('注册成功');
                            console.log("注册成功");
                            console.log(response);
                            that.$router.push('/login');
                        }
                    })
                    .catch(function (error) {
                        if (error.response) {
                            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                            console.log("登录时，服务器请求码不在2xx范围内");
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', "注册时"+error.message);
                        }
                        console.log(error.config);
                    });
            }
        }
    };
</script>

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