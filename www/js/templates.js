(function() {
    var template, id, templates = {
        "views/home": function(c,p,i){var _=this;_.b(i=i||"");_.b("<form class=\"digit-form\">");_.b("\n" + i);_.b("\n" + i);_.b("	<input type=\"tel\" class=\"digit-input\" data-role=\"digit-input\" />");_.b("\n" + i);_.b("\n" + i);_.b("	<div class=\"button-wrap\">");_.b("\n" + i);_.b("		<button type=\"submit\">Generate!</button>");_.b("\n" + i);_.b("	</div>");_.b("\n" + i);_.b("\n" + i);_.b("</form>");return _.fl();;},
        "views/result": function(c,p,i){var _=this;_.b(i=i||"");_.b("\n" + i);_.b("\n" + i);_.b("<ul class=\"digits-list\">");_.b("\n" + i);if(_.s(_.f("pairs",c,p,1),c,p,0,40,170,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("		<li>");_.b("\n" + i);if(_.s(_.f("digits",c,p,1),c,p,0,64,148,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("				<span class=\"digit-color digit-color-");_.b(_.v(_.f("num",c,p,0)));_.b("\">");_.b("\n" + i);_.b("					");_.b(_.v(_.f("num",c,p,0)));_.b("\n" + i);_.b("				</span>");_.b("\n");});c.pop();}_.b("		</li>");_.b("\n");});c.pop();}_.b("</ul>");_.b("\n" + i);_.b("\n" + i);_.b("<ul class=\"words-list\">");_.b("\n" + i);if(_.s(_.f("pairs",c,p,1),c,p,0,227,417,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("		<li>");_.b("\n" + i);_.b("			");if(_.s(_.f("parts",c,p,1),c,p,0,250,395,"{{ }}")){_.rs(c,p,function(c,p,_){if(_.s(_.f("vow",c,p,1),c,p,0,260,296,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<span class=\"vowel\">");_.b(_.v(_.f("val",c,p,0)));_.b("</span>");});c.pop();}if(!_.s(_.f("vow",c,p,1),c,p,1,0,0,"")){_.b("<span class=\"cons digit-color digit-color-");_.b(_.v(_.f("num",c,p,0)));_.b("\">");_.b(_.v(_.f("val",c,p,0)));_.b("</span>");};});c.pop();}_.b("\n" + i);_.b("		</li>");_.b("\n");});c.pop();}_.b("</ul>");return _.fl();;}
    };
    if (!window.templates) {
    	window.templates = templates;
    } else {
    	window.templates.concat(templates);
    }
})();