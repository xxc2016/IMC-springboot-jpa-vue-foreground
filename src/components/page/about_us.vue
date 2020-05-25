<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-global"></i>诚寻合作，We want you！</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <h1>合作声明</h1>
            <p>不与平台进行任何广告合作</p>
            <div class="list">
                <h2>客服</h2>
                <p>QQ：123456789</p>
                <p></p>
                <p></p>
            </div>
            <button @click="test_for_message"> test button 1</button>
            <br />
            <button @click="test_for_two"> test button 2</button>
            <br />
            <button @click="test_for_pic"> test button 3</button>
        </div>
    </section>
</template>

<script>
    import service from '../../utils/request';
    import serviceJson from '../../utils/request';
    import serviceUrl from '../../utils/request';
    import axios from 'axios';
    import qs from 'qs';

    export default {
        name: 'about_us',

        methods:{
            test_for_two(){
                let that = this;        //用that来代指this
                service.post(
                    '/sche/add',     //此处为服务器的接口
                    qs.stringify(       //将格式转化为json
                        {       //传给服务器的数据
                            username:'test',password:'123456'
                        }
                    ))
                    .then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('信息拉取失败');
                            console.log("信息拉取失败");
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
            },
            test_for_pic(){
                let that = this;        //用that来代指this
                service.get(
                    '/picture/72a605bc-1ee5-4728-84b6-770695602efe.png',     //此处为服务器的接口
                    )
                    .then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('信息拉取失败');
                            console.log("信息拉取失败");
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
                serviceJson.post(

                    '/product/update',
                    {
                        picurl:'/picture/72a605bc-1ee5-4728-84b6-770695602efe.png',
                        productid:that.updateForm.productid,
                        productname:that.updateForm.productname,

                    }
                ).then(function (response) {     //处理服务器响应
                    console.log("code：" + response.code);       //将code写入log
                    if(response.code === '500'){
                        that.$message.error('信息拉取失败');
                        console.log("信息拉取失败");
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
            },
            test_for_database(){
                let that = this;        //用that来代指this
                service.post(
                    '/user/joinFactory',     //此处为服务器的接口
                    qs.stringify(       //将格式转化为json
                        {       //传给服务器的数据
                            username:'test',password:'123456'
                        }
                    ))
                    .then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('信息拉取失败');
                            console.log("信息拉取失败");
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
            },
            test_for_removep(){
                let that = this;        //用that来代指this

                    let productid = 10;
                    service.post('/user/loginFactory',
                        qs.stringify({
                            facname:localStorage.getItem("factory_name")
                        }));
                    service.get('product/remove',
                        {
                            params:{productid:9}
                        }
                    )     //此处为服务器的接口

                    .then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('信息拉取失败');
                            console.log("信息拉取失败");
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
            },
            test_for_login_fac(){
                let that = this;        //用that来代指this
                service.post(
                    '/user/loginFactory','facname=胡的工厂2')
                    .then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('信息拉取失败');
                            console.log("信息拉取失败");
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
            },
            test_for_message(){
                let that = this;        //用that来代指this
                service.get(
                    '/deal/index')//
                    .then(function (response) {     //处理服务器响应
                        console.log("code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('信息拉取失败');
                            console.log("信息拉取失败");
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
            }
        }
    };
</script>

<style scoped>
    .list{
        padding: 30px 0;
    }
    .list p{
        margin-bottom: 20px;
    }
    a{
        color: #409eff;
    }
</style>
