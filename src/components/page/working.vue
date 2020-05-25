<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 报工
                </el-breadcrumb-item>
                <el-breadcrumb-item>报工表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="调度号">
                        <el-input v-model="form.sche.scheid"></el-input>
                    </el-form-item>
                    <el-form-item label="起始日期">
                        <el-col :span="11">
                            <el-date-picker
                                    type="date"
                                    placeholder="选择日期"
                                    v-model="form.start"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="结束日期">
                        <el-col :span="11">
                            <el-date-picker
                                    type="date"
                                    placeholder="选择日期"
                                    v-model="form.end"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="生产数量">
                        <el-input v-model="form.num"></el-input>
                    </el-form-item>
                    <el-form-item label="合格数量">
                        <el-input v-model="form.oknum"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="form.finish" >是否完成</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">报工提交</el-button>
                        <el-button @click="clear">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import service from '../../utils/request';
    import bus from '../common/bus';
    export default {
        inject:['reload'],
        data() {
            return {
                form: {
                    sche:{
                      scheid :  null   //调度号
                    },
                    start : null,  //起始时间
                    end : null,    //结束时间
                    num : null,    //生产数量
                    oknum : null,  //合格数量
                    finish : true  //是否完成,0未完成；1完成
                }
            };
        },
        methods: {
            onSubmit() {
                this.form.sche.scheid = parseInt(this.form.sche.scheid);
                this.form.num = parseInt(this.form.num);
                this.form.oknum = parseInt(this.form.oknum);
                this.form.finish = this.form.finish ? 1 : 0;
                this.form.start = new Date(this.form.start).getTime();
                this.form.end = new Date(this.form.end).getTime();
                console.log(this.form);
                let that = this;
                service.post(
                    '/track/report',{
                        sche:that.form.sche,
                        start:that.form.start,
                        end:that.form.end,
                        num:that.form.num,
                        oknum:that.form.oknum,
                        finish:that.form.finish
                    })
                    .then(function (response) {     //处理服务器响应
                        console.log("report-code：" + response.code);       //将code写入log
                        if(response.code === '500'){
                            that.$message.error('报单失败：'+response.msg);
                            console.log('报单失败：'+response.msg);
                        }else{
                            console.log(response);
                            that.$message.success("报单成功");
                            that.reload();
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
            clear(){
                this.reload();
            }
        }
    };
</script>
