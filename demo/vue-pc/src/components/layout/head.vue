<template>
  <div class="layout-head">
    <a href="/" class="logo">
      <img src="https://www.analysysdata.com/images/logo-white.svg" />
    </a>
    <ul class="head-nav">
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/product" replace id="product">产品列表</router-link></li>
      <li><router-link to="/sdk" replace>SDK功能清单</router-link></li>
    </ul>
  </div>
</template>

<style lang="scss">
.layout-head {
  height: 80px;
  background-image: linear-gradient(90deg,#34b6f6,#6f5af8);
  .logo {
    height: 56px;
    float: left;
    margin-top: 10px;
    margin-left: 20px;
    img {
      height: 100%;
    }
  }
  .head-nav {
    float: right;
    margin-right: 20px;
    li {
      float: left;
      height: 80px;
      line-height: 80px;
      padding: 0 20px;
      text-align: center;
      cursor: pointer;
      font-size: 18px;
      a {
        color: rgb(255 255 255 / 70%);
        display: block;
        height: 100%;
        &:hover {
          color: #fff;
        }
      }
      .router-link-active {
        color: #fff;
      }
    }
  }
}
</style>