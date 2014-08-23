a yeoman generator for kissy-gallery

## install
### 安装yeoman

````sh
npm install yo grunt-cli -g
````

### 安装kissy-gallery目录生成器

````sh
npm install generator-kpm -g
````

### 生成组件目录

比如你的组件目录是offline，进入该目录，然后执行命令：

````sh
yo kpm 1.0.0
````


### 打包组件

在组件目录下执行如下命令：

````sh
grunt
````

### 发布一个新的版本

在组件目录下执行如下命令：

````sh
yo kpm:version 1.1.1
````

### 获取本组件 cdn refer

在组件目录下执行如下命令：

````sh
yo kpm:refer
yo kpm:refer index-min.js
yo kpm:refer 1.0/index-min.js
````
*  默认是当前版本的 index-min.js
*  版本未输入的话，默认为当前版本

##changelog

### 2.0.4
* 使用gulp编译打包
* 模块使用cmd规范写法

### 2.0.1
* 增加bower配置

### 2.0.0
* 重构工具，去掉版本号目录

### 0.1.6
* 添加 isv 支持

### 0.1.3
* version 命令加强，提供自动修改必要文件版本号功能

### 0.1.2
* totoro 单测文件生成

### 0.1.1
* refer 命令
