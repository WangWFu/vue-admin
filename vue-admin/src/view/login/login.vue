<template>
  <div class="login-container">
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          ref="password"
          placeholder="password"
          v-model="loginForm.password"
          autocomplete="off"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" class="btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

// import { getadmin } from "@/network/admin.js";

export default {
  name: "login",
  components: {
 
  },
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$http.post("login", this.loginForm).then(res => {
        // console.log(res);
        if (res) {
          this.$message({
          message: '登录成功',
          center: true,
          type: "success",
          duration:300
        });
          window.sessionStorage.setItem('token',res.data.data.token)
          setTimeout(()=>{
this.$router.push('/home');
          },1000)
          
        } else {
           this.$message({
          message: '用户名或密码错误',
          center: true,
          type: "error"
        });
         
        }
      });

      // getadmin(this.loginForm).then(res => {
      //   console.log(res);
      //   // if (res.data.data.length) {
      //   //   this.$router.push('/articlelist/index');
      //   //   localStorage.setItem('admin',JSON.stringify(res.data.data[0]))
      //   // } else {
      //   //   Message({
      //   //     message: "用户名或密码错误",
      //   //     type: "error"
      //   //   });
      //   // }
      // });
    }
  }
};
</script>
<style scoped>
.login-container {
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.btn {
  margin-left: 100px;
}
</style>

