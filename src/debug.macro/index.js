const { createMacro, MacroError } = require('babel-plugin-macros');
const types = require("@babel/types");
const path = require("path");

const getClassPath = (path) => path.getAncestry().map(v => {
  switch (v.type) {
    case "ClassDeclaration":
      if (!v.node.id) return "Anonymous";
      return v.node.id.name;
      break;
    case "ClassMethod":
      if (!v.node.key) return "Anonymous";
      return v.node.key.name;
      break;
    default:
      return;
  }
}).filter(v => v).reverse().join(".");

const macro = ({ references, state, babel }) =>
  references.default.forEach(({ parentPath: call }) => {
    types.assertCallExpression(call);
    call.node.arguments = [
      `${
      path.basename(call.hub.file.opts.filename)
      }:${call.node.loc.start.line}`,
      `${getClassPath(call)}`
    ].map(s => types.stringLiteral(s)).concat(call.node.arguments);
    call.node.callee = types.memberExpression(..."console.log".split(".").map(s => types.identifier(s)));
  });

module.exports = createMacro(macro);
