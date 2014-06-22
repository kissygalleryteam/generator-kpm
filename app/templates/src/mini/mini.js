/**
 * @fileoverview <%= comConfig.desc %>
 * @author <%= comConfig.author.name %><<%= comConfig.author.email%>>
 * @module <%= comConfig.name %>
 **/
KISSY.add(function (S, Node, Lang) {
    var $ = Node.all,
        EventTarget = S.Event.Target;
    /**
     *
     * @class <%= comConfig.comName %>
     * @constructor
     */
    function <%= comConfig.comName %>(config) {

    }

    S.augment(<%= comConfig.comName %>, EventTarget, /** @lends <%= comConfig.comName %>.prototype*/{

    });

    return <%= comConfig.comName %>;

}, {requires:['node', 'lang']});



