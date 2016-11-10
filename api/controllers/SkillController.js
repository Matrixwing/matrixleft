/**
 * SkillController
 *
 * @description :: Server-side logic for managing skills
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAllSkill : function (){
    Skill.getAllSkill('',function(err,allSkill){
        if (err) return res.send(500,'{"msgNo":"9999","msgInfo":"服务出错，请您稍后再试"}');
        if (allSkill=='') return res.send(404,'{"msgNo":"8888","msgInfo":"对不起，没有找到您要信息"}');
        var str = JSON.stringify(allSkill) ;
        allSkill = util.format('{"msgNo":"0000","msgInfo":"查询到了信息","data":%s}',str);
        res.send(allSkill);
    })
  },
};

