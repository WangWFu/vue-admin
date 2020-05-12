<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加管理</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template v-slot="slotProps">
            <el-row
              :class="['bdbottom', i1 ===0 ? 'bdTop' : '']"
              v-for="(item, i1) in slotProps.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeById(slotProps.row,item.id)" closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdTop']"
                  v-for="(item2,i2) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="removeById(slotProps.row,item2.id)"
                      closable
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      @close="removeById(slotProps.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template v-slot="slotProps">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="showRightSetting(slotProps.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="showRightDialog" width="50%">
      <!-- 树形数据展示 -->
      <el-tree
        :data="rightList"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        default-expand-all
        ref="treeref"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      showRightDialog: false,
      rightList: [],
      rightsProps: {
        label: "authName",
        children: "children"
      },
      //默认选中的id
      defKeys: [],
      roleId: ""
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取权限
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取失败");
      }
      this.rolesList = res.data;
      console.log(res);
    },
    // 删除权限
    async removeById(roles, rightsid) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showCancelButton: true
        }
      ).catch(err => err);

      if (confirmresult !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${rightsid}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      // this.getRolesList()
      roles.children = res.data;
    },
    //分配权限弹框
    async showRightSetting(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      // console.log(res);
      this.rightList = res.data;
      this.showRightDialog = true;
      this.defKeys = [];
      this.getrefKeys(role, this.defKeys);
    },
    // 遍历树形数据获取id
    getrefKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getrefKeys(item, arr);
      });
    },
    // 提交分配权限数据
    async submitRights() {
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ];
      console.log(keys);
      const keyStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keyStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.showRightDialog = false;
    }
  }
};
</script>
<style scoped>
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.bdTop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>