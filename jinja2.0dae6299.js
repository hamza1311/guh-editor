var l = [
  "and",
  "as",
  "block",
  "endblock",
  "by",
  "cycle",
  "debug",
  "else",
  "elif",
  "extends",
  "filter",
  "endfilter",
  "firstof",
  "for",
  "endfor",
  "if",
  "endif",
  "ifchanged",
  "endifchanged",
  "ifequal",
  "endifequal",
  "ifnotequal",
  "endifnotequal",
  "in",
  "include",
  "load",
  "not",
  "now",
  "or",
  "parsed",
  "regroup",
  "reversed",
  "spaceless",
  "endspaceless",
  "ssi",
  "templatetag",
  "openblock",
  "closeblock",
  "openvariable",
  "closevariable",
  "openbrace",
  "closebrace",
  "opencomment",
  "closecomment",
  "widthratio",
  "url",
  "with",
  "endwith",
  "get_current_language",
  "trans",
  "endtrans",
  "noop",
  "blocktrans",
  "endblocktrans",
  "get_available_languages",
  "get_current_language_bidi",
  "plural"
], f = /^[+\-*&%=<>!?|~^]/, c = /^[:\[\(\{]/, o = ["true", "false"], r = /^(\d[+\-\*\/])?\d+(\.\d+)?/;
l = new RegExp("((" + l.join(")|(") + "))\\b");
o = new RegExp("((" + o.join(")|(") + "))\\b");
function t(n, e) {
  var i = n.peek();
  if (e.incomment)
    return n.skipTo("#}") ? (n.eatWhile(/\#|}/), e.incomment = !1) : n.skipToEnd(), "comment";
  if (e.intag) {
    if (e.operator) {
      if (e.operator = !1, n.match(o))
        return "atom";
      if (n.match(r))
        return "number";
    }
    if (e.sign) {
      if (e.sign = !1, n.match(o))
        return "atom";
      if (n.match(r))
        return "number";
    }
    if (e.instring)
      return i == e.instring && (e.instring = !1), n.next(), "string";
    if (i == "'" || i == '"')
      return e.instring = i, n.next(), "string";
    if (n.match(e.intag + "}") || n.eat("-") && n.match(e.intag + "}"))
      return e.intag = !1, "tag";
    if (n.match(f))
      return e.operator = !0, "operator";
    if (n.match(c))
      e.sign = !0;
    else if (n.eat(" ") || n.sol()) {
      if (n.match(l))
        return "keyword";
      if (n.match(o))
        return "atom";
      if (n.match(r))
        return "number";
      n.sol() && n.next();
    } else
      n.next();
    return "variable";
  } else if (n.eat("{")) {
    if (n.eat("#"))
      return e.incomment = !0, n.skipTo("#}") ? (n.eatWhile(/\#|}/), e.incomment = !1) : n.skipToEnd(), "comment";
    if (i = n.eat(/\{|%/))
      return e.intag = i, i == "{" && (e.intag = "}"), n.eat("-"), "tag";
  }
  n.next();
}
const u = {
  startState: function() {
    return { tokenize: t };
  },
  token: function(n, e) {
    return e.tokenize(n, e);
  },
  languageData: {
    commentTokens: { block: { open: "{#", close: "#}" } }
  }
};
export {
  u as jinja2
};