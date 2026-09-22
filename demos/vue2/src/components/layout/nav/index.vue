<template>
  <div class="nav">
    <div class="logo"><img src="../../../assets/logo.png"></div>
    <div class="ul-list">
     <el-menu class="el-menu-demo" mode="horizontal" :router="true">
      <!-- <el-menu-item index="1">处理中心</el-menu-item> -->
      <el-submenu index="2">
        <template slot="title">我的</template>
        <el-menu-item><div @click="dialogVisible=true">修改密码</div></el-menu-item>
        <el-menu-item><div @click.stop="loginOut">退出登录</div></el-menu-item>
      </el-submenu>
    </el-menu>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="400px" append-to-body>
      <el-form label-position="top" label-width="80px" size="small">
        <div class="edit-password">
          <el-form-item label="旧密码">
            <el-input v-model="password" placeholder="请输入旧密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="newPassword" placeholder="请输入新密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="newPasswordTo" placeholder="请确认新密码" type="password"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editPassword()">确定修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import io from '@/js/io.js'

export default {
  name: 'headNav',
  components: { },
  data () {
    return {
      dialogVisible: false,
      password: '',
      newPassword: '',
      newPasswordTo: ''
    }
  },
  methods: {
    loginOut () {
      io({url: '/official/admin/loginOut'}).then(o => {
    		window.location.href = '/login.html'
    	})
    },

    // 校验旧密码
    checkPassword (fn) {
      io({url: '/official/admin/password?password=' + this.password}).then(o => {
    		fn && fn()
    	}).catch(e => {
				this.$message({
          message: e.msg,
          type: 'error'
        })
			})
    },

    // 确认修改密码
    editPassword () {
      if(!this.password.trim()) {
        this.$message({
          message: '请输入旧密码',
          type: 'error'
        })
        return
      } else if (!this.newPassword.trim()) {
        this.$message({
          message: '请输入新密码',
          type: 'error'
        })
        return
      } else if (this.newPassword !== this.newPasswordTo) {
        this.$message({
          message: '新密码与确认密码不一致',
          type: 'error'
        })
        return
      }
      this.checkPassword(() => {
        io({url: '/official/admin/password?password=' + this.password, method: 'post', data: {password: this.newPassword}}).then(o => {
          this.dialogVisible = false
          this.password = ''
          this.newPassword = ''
          this.newPasswordTo = ''
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(e => {
          this.$message({
            message: e.msg,
            type: 'error'
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.nav {
	height: 61px;
	background: #fff;
	border-bottom: solid #E6E6E6 1px;
	position: fixed;
  left: 0;
  right: 0;
  .logo {
    position: absolute;
    top: 15px;
    left: 20px;
  }
  .ul-list {
    float: right;
    margin-right: 20px;
  }
}
.edit-password {
  .el-form-item .el-form-item__label {
    padding: 0;
  }
}

</style>
