'use strict';
var util = require('util');
var path = require('path');
var generator = require('yeoman-generator');
var fs = require('fs');

module.exports = generator.generators.Base.extend({
    constructor: function (args, options, config) {
        generator.generators.Base.apply(this, arguments);
        //组件版本号
        this.version = this.arguments[0];
        if(!this.version){
            console.log('缺少版本参数，demo：yo kpm 1.1.0');
            return false;
        }
       if(!/^\d\.\d\.\d$/.test(this.version)){
            console.log('版本号必须是三位数字，比如：1.6.0');
           return false;
       }
        this.cwd = options.env.cwd;

        //库地址
        this.reposName = getReposName(this);
        //组件名称
        this.comName = getComName(this.reposName);
        this.comConfig = {
            "name": this.reposName,
            "comName":this.comName,
            "version":this.version
        };
        //结束后安装依赖并打印消息
        this.on('end',function(){
            this.installDependencies();
            this.log("组件目录和文件初始化完成！\n");
            this.log("打包组件运行：grunt");
        })
    },
    /**
     * 打印欢迎消息
     */
    hello: function () {
        if(!this.reposName) return false;
        this.log("=====================\n");
        this.log("欢迎使用kissy 组件包管理工具kpm\n");
        this.log("=====================");
    },
    copyFile:function(){
        if(!this.reposName) return false;
        this.copy('_.gitignore','.gitignore');
        this.template('_package.json','package.json');
        this.template('README.md', 'README.md');
        this.template('totoro-config.json', 'totoro-config.json');
        this.template('Gruntfile.js','Gruntfile.js');
    },
    mk:function(){
        if(!this.reposName) return false;
        var fold = ['demo','src','build','guide','test'];
        for(var i=0;i<fold.length;i++){
            this.directory(fold[i],fold[i]);
        }
    }
});

/**
 * 获取库名称
 */

function getReposName(that){
    var root = that.cwd;
    return path.basename(root);
}
/**
 * 获取组件名称
 */
function getComName(reposName){
    var first = reposName.substring(0,1).toUpperCase();
    var comName = first + reposName.substring(1);
    comName = comName.replace(/-(\w)/g,function($1,$2){
        return $2.toUpperCase();
    });
    return comName;
}

