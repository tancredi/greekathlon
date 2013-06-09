this["window"] = this["window"] || {};
this["window"]["templates"] = this["window"]["templates"] || {};

Handlebars.registerPartial("digits", this["window"]["templates"]["digits"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n	<li>\n		";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  if (stack1 = helpers.digits) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.digits; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.digits) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			<span class=\"digit-color digit-color-";
  if (stack1 = helpers.num) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.num; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n				";
  if (stack1 = helpers.num) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.num; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n			</span>\n		";
  return buffer;
  }

  buffer += "\n";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.pairs) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.pairs; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.pairs) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  }));

Handlebars.registerPartial("saved-list", this["window"]["templates"]["saved-list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<li data-role=\"saved-digits\" data-digits=\"";
  if (stack1 = helpers.digits) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.digits; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n			<ul class=\"pairs\">\n				";
  stack1 = self.invokePartial(partials.digits, 'digits', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</ul>\n		</li>\n	";
  return buffer;
  }

  buffer += "<ul class=\"saved-list\">\n	";
  stack1 = helpers.each.call(depth0, depth0.entries, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>";
  return buffer;
  }));

this["window"]["templates"]["views/home"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form class=\"digit-form\">\n\n	<input type=\"tel\" placeholder=\"Your digit here...\" class=\"digit-input\" data-role=\"digit-input\" />\n\n	<div class=\"saved-wrap\" data-role=\"saved-wrap\"></div>\n\n</form>";
  });

this["window"]["templates"]["views/result"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<li>\n			<i class=\"icon-";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n			";
  stack1 = helpers.each.call(depth0, depth0.parts, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</li>\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0.vow, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }
function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"vowel\">";
  if (stack1 = helpers.val) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.val; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"cons digit-color digit-color-";
  if (stack1 = helpers.num) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.num; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.val) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.val; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  }

  buffer += "\n<ul class=\"digits-list\">\n	";
  stack1 = self.invokePartial(partials.digits, 'digits', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n\n<ul class=\"words-list\">\n	";
  stack1 = helpers.each.call(depth0, depth0.pairs, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n\n<a href=\"#\" class=\"back\" data-role=\"back\">Back</a>";
  return buffer;
  });