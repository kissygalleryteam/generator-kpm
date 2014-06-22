'use strict';
var util = require('util');
var path = require('path');
var generator = require('yeoman-generator');
var fs = require('fs');

module.exports = generator.generators.Base.extend({
    constructor: function (args, options, config) {
        generator.generators.Base.apply(this, arguments);
        //组件版本号
        this.version = this.arguments[0] || '1.0.0';
        this.cwd = options.env.cwd;

        //库地址
        this.reposName = getReposName(this);
        //组件名称
        this.comName = getComName(this.reposName);
        if (fs.existsSync('config.json')) {
            this.abcJSON = JSON.parse(this.readFileAsString('config.json'));
        } else {
            this.abcJSON = {}
        }
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
        this.log("=====================\n");
        this.log("欢迎使用kissy 组件包管理工具kpm\n");
        this.log("=====================");
    },
    /**
     * 问询
     */
    ask: function () {
        var cb = this.async();

        var author = {
            name: 'kissy-team',
            email: 'kissy-team@gmail.com'
        };

        if (this.abcJSON && this.abcJSON.author) {
            var abcAuthor = this.abcJSON.author;
            author.name = abcAuthor.name || 'kissy-team';
            author.email = abcAuthor.email || 'kissy-team@gmail.com';
        }
        console.log('author请使用花名，email请使用内网邮箱，tag请使用中文（多个英文逗号隔开）');
        var prompts = [{
            name: 'author',
            message: 'author of component:',
            default: author.name
        },{
            name: 'email',
            message: 'email of author:',
            default: author.email
        },{
            name: 'tag',
            message: 'tag of component:'
        },{
            name:'isSupportKissymini',
            message:'Is support Kissymini(y/n)',
            default:'n'
        },{
            name:'isSupportISV',
            message:'Is support ISV(y/n):',
            default:'n'
        }];

        this.prompt(prompts, function (props) {
            this.author = props.author;
            this.email = props.email;
            this.tag = props.tag;
            this.isSupportISV = props.isSupportISV.toLowerCase()==='y'?true:false;
            this.isSupportKissymini = props.isSupportKissymini.toLowerCase()==='y'?true:false;

            if(this.isSupportKissymini){
                var tags ;
                if(this.tag){
                    tags = this.tag.split(',');
                }else{
                    tags = []
                }
                tags.push('kissy-mini');
                this.tag=tags.join(',');
            }
            cb();
        }.bind(this));
    },
    copyFile:function(){
        this.copy('_.gitignore','.gitignore');
        this.template('config.json','config.json');
        this.template('_package.json','package.json');
        this.template('README.md', 'README.md');
        this.template('totoro-config.json', 'totoro-config.json');
        this.template('Gruntfile.js','Gruntfile.js');
    },
    mk:function(){
        this.comConfig = comConfig(this);
        var fold = ['demo','spec','build','plugin','guide','meta','test'];
        for(var i=0;i<fold.length;i++){
            this.directory(fold[i],fold[i]);
        }
    },
    isv: function(){
        if(this.isSupportISV){
            this.directory(path.join('isv','demo'),path.join('isv','demo'));
            this.template(path.join('isv','isv-adapter.js'), path.join('isv','isv-adapter.js'));
        }
    },
    kissmini: function(){
        this.directory(path.join('mini','demo'),path.join('mini','demo'));
        if(this.isSupportKissymini){
            this.template(path.join('mini','mini.js'), path.join('mini','mini.js'));
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
/**
 * 获取组件配置
 * @param that
 * @returns {*}
 */
function comConfig(that){
    var jsonFile = './config.json';
    var sAbcJson = that.readFileAsString(jsonFile);
    return JSON.parse(sAbcJson);
}

