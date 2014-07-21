'use strict';
var util = require('util');
var path = require('path');
var generator = require('yeoman-generator');
var fs = require('fs');
var GitHubApi = require("github");
var github = new GitHubApi({
    version: "3.0.0",
    timeout: 5000
});

github.authenticate({
    type: "oauth",
    token: "fa54fd27365f90a9932285323805a6b59568f474"
});
/**
 * 拉取gallery组件到本地工程
 */
module.exports = generator.generators.Base.extend({
    constructor: function (args, options, config) {
        generator.generators.Base.apply(this, arguments);
        var comName = this.arguments[0];
        if(!comName){
            var version = this.arguments[1];
        }
        this.on('end',function(){

        })
    },
    /**
     * 读取配置文件
     */
    readConfig: function(){
        //配置文件
        var file = './kpm.json';
        fs.exists(file,function(exist){
            if(exist){
                fs.readFile(file, 'utf8', function(err, data) {
                    if (err) {
                        console.log(err);
                    }else{
                        data = JSON.parse(data);
                        console.log(data);
                    }
                })
            }else{
                console.log('项目工程目录不存在kpm.json!');
            }
        });
    }

});

/**
 * 拉取github库
 * @param reposName
 * @param reposUrl
 */
function pull(reposName,callback){
    var reposUrl = 'https://github.com/kissygalleryteam/' + reposName + '.git';
    github.repos.get({
        user: 'kissygalleryteam',
        repo: reposName
    }, function(err) {
        if(err){
            console.log(err);
            return false;
        }
        if (!shell.which('git')) {
            shell.exit(1);
            console.log('亲，你的机子没有安装git %>_<%');
            return false;
        }
        shell.exec('cd gallery && git clone ' + reposUrl, function(code, output) {
            resolve(output);
        });
    });
}
