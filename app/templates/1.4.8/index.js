var $ = require('node').all;
var Base = require('base');

var <%= comConfig.comName %> = Base.extend({
    initializer:function(){
        var self = this;
        var $target = self.get('$target');
    }
},{
    ATTRS:{
        $target:{
            value:'',
            getter:function(v){
                return $(v);
            }
        }
    }
});

module.exports = <%= comConfig.comName %>;



