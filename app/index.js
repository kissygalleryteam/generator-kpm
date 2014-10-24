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
    askAuthor : function(){
        var cb = this.async();
        //代码是否基于kissy5
        var prompts = [{
            name: 'kissy',
            message: '组件基于的kissy版本（5.0.0/1.4.7）:',
            default: '5.0.0'
        }];

        this.prompt(prompts, function (props) {
            if(props.kissy != '5.0.0' && props.kissy != '1.4.7') props.kissy = '1.4.7';
            this.kissy = props.kissy;
            cb();
        }.bind(this));
    },
    copyFile:function(){
        if(!this.reposName) return false;
        var kissyDir = this.kissy+'/';
        this.copy(kissyDir+'_.gitignore','.gitignore');
        this.template(kissyDir+'_package.json','package.json');
        this.template(kissyDir+'bower.json','bower.json');
        this.template(kissyDir+'README.md', 'README.md');
        this.template(kissyDir+'totoro-config.json', 'totoro-config.json');
        this.template(kissyDir+'gulpfile.js','gulpfile.js');
        this.template(kissyDir+'index.js','index.js');
        this.template(kissyDir+'index.less','index.less');
    },
    mk:function(){
        if(!this.reposName) return false;
        var kissyDir = this.kissy+'/';
        var fold = ['demo','build','guide','test','lib'];
        for(var i=0;i<fold.length;i++){
            this.directory(kissyDir+fold[i],fold[i]);
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

