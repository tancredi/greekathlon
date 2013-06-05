(function() {
    var template, id, templates = {
        "partials/game/orb": function(c,p,i){var _=this;_.b(i=i||"");_.b("<span class=\"orb\" data-role=\"orb\"></span>");return _.fl();;},
        "views/home": function(c,p,i){var _=this;_.b(i=i||"");_.b("<h1>Hello World!</h1>");return _.fl();;}
    };
    if (!window.templates) {
    	window.templates = templates;
    } else {
    	window.templates.concat(templates);
    }
})();