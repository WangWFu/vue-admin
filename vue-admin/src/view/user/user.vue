<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="24">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="userList" border>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <template v-slot="slotProps">
          <el-switch v-model="slotProps.row.mg_state" @change="userStateChange(slotProps.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template v-slot="slotProps">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(slotProps.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="ShowMessage(slotProps.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button
              type="warning"
              icon="el-icon-setting"
              circle
              @click="showRoleDialog(slotProps.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            ref="username"
            v-model="addForm.username"
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
            v-model="addForm.password"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="email"
            ref="email"
            placeholder="email"
            v-model="addForm.email"
            autocomplete="off"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            type="mobile"
            ref="mobile"
            placeholder="mobile"
            v-model="addForm.mobile"
            autocomplete="off"
            prefix-icon="el-icon-phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form
        :model="editForm"
        status-icon
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            ref="username"
            v-model="editForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            prefix-icon="el-icon-user"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="email"
            ref="email"
            placeholder="email"
            v-model="editForm.email"
            autocomplete="off"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="mobile">
          <el-input
            type="mobile"
            ref="mobile"
            placeholder="mobile"
            v-model="editForm.mobile"
            autocomplete="off"
            prefix-icon="el-icon-phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="RoleDialog" width="50%"
    @close="clearInfo">
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
      </div>
      分配角色：
 <el-select v-model="selRoleID" placeholder="请选择">
    <el-option
      v-for="item in roleslist"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "user",
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
    var validateEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/;
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!regEmail.test(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (!regMobile.test(value)) {
        callback(new Error("电话格式错误"));
      } else {
        callback();
      }
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      value1: true,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { validator: validateUsername, trigger: "blur", required: true }
        ],
        password: [
          { validator: validatePassword, trigger: "blur", required: true }
        ],
        email: [{ validator: validateEmail, trigger: "blur", required: true }],
        mobile: [{ validator: validateMobile, trigger: "blur", required: true }]
      },
      editForm: {},
      RoleDialog: false,
      // 当前分配角色的信息
      userInfo: {},
      roleslist: [],
      selRoleID:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户信息
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户数据失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //查询条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    //查询页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    //  监听状态的改变
    async userStateChange(userinfo) {
      // console.log(userinfo);

      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新状态失败");
      }
      this.$message.success("success");
    },
    // 添加用户弹窗
    addUser() {
      this.addDialogVisible = true;
    },

    //清空关闭添加用户弹出框的数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },

    //提交用户信息
    submitUser() {
      //表单提交预校验
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          console.log("success");
          const { data: res } = await this.$http.post("users", this.addForm);
          if (res.meta.status !== 201) {
            this.$message.error("添加用户失败");
          } else {
            this.$message.success("添加用户成功");
            this.addDialogVisible = false;
            this.getUserList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑用户信息弹框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("查询失败");
      }
      // console.log(res);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 修改用户信息
    editsubmit() {
      //表单提交预校验
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          console.log("success");
          const { data: res } = await this.$http.put(
            "users/" + this.editForm.id,
            { email: this.editForm.email, mobile: this.editForm.mobile }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("更新用户失败");
          } else {
            this.$message.success("更新用户成功");
            this.editDialogVisible = false;
            this.getUserList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    ShowMessage(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配角色
    async showRoleDialog(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleslist = res.data;
      this.RoleDialog = true;
    },
    // 提交
   async submitRole(){
      if(!this.selRoleID){
        return this.$message.error('请选择要分配的角色！')
      
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.selRoleID
      })
      if(res.meta.status !== 200){
        return this.$message.error('分配的角色失败！')
      }
      this.$message.success('分配成功')
      this.RoleDialog = false
      this.getUserList()
    },
    clearInfo(){
      this.selRoleID = '';
      this.userInfo = {}
    }
  }
};
</script>
<style>
</style>