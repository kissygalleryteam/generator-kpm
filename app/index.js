'use strict';
var util = require('util');
var path = require('path');
var generator = require('abc-generator');
var fs = require('fs');

module.exports = Gallery;

function Gallery(args, options, config) {
    generator.UIBase.apply(this, arguments);
    this.version = args[0] || '1.0';
    this.cwd = options.env.cwd;
    //库地址
    this.reposName = getReposName(this);
    //组件名称
    this.comName = getComName(this.reposName);
    if (fs.existsSync('abc.json')) {
        this.abcJSON = JSON.parse(this.readFileAsString('abc.json'));
    } else {
        this.abcJSON = {}
    }

    this.on('end',function(){
        this.installDependencies();
        console.log("组件目录和文件初始化完成！");
        console.log("\n打包组件运行：grunt");
    })
}

util.inherits(Gallery, generator.UIBase);

var prt = Gallery.prototype;

prt.askFor = function(){
    //打印欢迎消息
    console.log(this.abcLogo);
}
prt.askAuthor = function(){
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
    console.log('阿里同学author请使用花名，email请使用内网邮箱，tag请使用中文（多个英文逗号隔开），github账户名用于代码同步');
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
        name: 'githubName',
        message: 'user name of github:'
    },{
        name: 'flexComboPort',
        message: 'FlexCombo Server Port:',
		default:'8081'
	},{
        name: 'reserveServerPort',
        message: 'FlexCombo HTTP ReserveServer Port:',
		default:'8080'
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
        this.githubName = props.githubName;
        this.flexComboPort = props.flexComboPort;
        this.reserveServerPort = props.reserveServerPort;
        this.isSupportISV = props.isSupportISV.toLowerCase()==='y'?true:false;
        this.isSupportKissymini = props.isSupportKissymini.toLowerCase()==='y'?true:false;

        if(this.isSupportKissymini){
          var tags ;
          if(this.tag){
            tags = this.tag.split(',');
          }else{
            tags = []
          }
          tags.push('kissy-mini')
          this.tag=tags.join(',');
        }

        cb();
    }.bind(this));
}
prt.copyFile = function(){

    this.template('Gruntfile.js','Gruntfile.js');
    this.copy('_.gitignore','.gitignore');
    this.template('abc.json','abc.json');
    this.template('_package.json','package.json');
    this.template('README.md', 'README.md');
    this.template('totoro-config.json', 'totoro-config.json');
}

prt.mk = function(){
    var version = this.version;
    this.mkdir(version);
    var fold = ['demo','spec','build','plugin','guide','meta','test'];
    for(var i=0;i<fold.length;i++){
        this.mkdir(path.join(version, fold[i]));
    }
}

prt.createVersion = function(){
    var version = this.version;
    this.comConfig = comConfig(this);
    this.directory('version', version);
}

prt.isv = function(){
    if(this.isSupportISV){
        this.directory(path.join('isv','demo'),path.join(this.version,'demo'));
        this.template(path.join('isv','isv-adapter.js'), path.join(this.version,'isv-adapter.js'));
    }
}

prt.kissmini=function(){

    this.directory(path.join('mini','demo'),path.join(this.version,'demo'));
    if(this.isSupportKissymini){
        this.template(path.join('mini','mini.js'), path.join(this.version,'mini.js'));
    }else{
        this.template(path.join('mini','mini-origin.js'), path.join(this.version,'mini.js'));
    }
}

/**
 * Scan Project
 */
prt._scan = function _scan() {
  // fix windows path
  var versionMatch = path.join('*.*/');
  var versions = this.expand(versionMatch);

  var abc = JSON.parse(this.readFileAsString('abc.json'));
  var version = abc.version;

  versions = versions.

    filter(function(v){
      return /^(\d.\d)/.test(v);
    }).
    map(function(v) {
    v = v.match(/^(\d.\d)/)[1];
    return {
      version: v,
      current: v === version
    }
  });
  console.log(versions);

  return {
    versions: versions
  };

};
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
function comConfig(that){
    var jsonFile = './abc.json';
    var sAbcJson = that.readFileAsString(jsonFile);
    return JSON.parse(sAbcJson);
}

