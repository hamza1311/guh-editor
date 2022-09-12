function l(n, e) {
  return new RegExp((e ? "" : "^") + "(?:" + n.join("|") + ")" + (e ? "$" : "\\b"));
}
function o(n, e, r) {
  return r.tokenize.push(n), n(e, r);
}
var v = /^(?:[-+/%|&^]|\*\*?|[<>]{2})/, z = /^(?:[=!]~|===|<=>|[<>=!]=?|[|&]{2}|~)/, g = /^(?:\[\][?=]?)/, b = /^(?:\.(?:\.{2})?|->|[?:])/, p = /^[a-z_\u009F-\uFFFF][a-zA-Z0-9_\u009F-\uFFFF]*/, d = /^[A-Z_\u009F-\uFFFF][a-zA-Z0-9_\u009F-\uFFFF]*/, E = l([
  "abstract",
  "alias",
  "as",
  "asm",
  "begin",
  "break",
  "case",
  "class",
  "def",
  "do",
  "else",
  "elsif",
  "end",
  "ensure",
  "enum",
  "extend",
  "for",
  "fun",
  "if",
  "include",
  "instance_sizeof",
  "lib",
  "macro",
  "module",
  "next",
  "of",
  "out",
  "pointerof",
  "private",
  "protected",
  "rescue",
  "return",
  "require",
  "select",
  "sizeof",
  "struct",
  "super",
  "then",
  "type",
  "typeof",
  "uninitialized",
  "union",
  "unless",
  "until",
  "when",
  "while",
  "with",
  "yield",
  "__DIR__",
  "__END_LINE__",
  "__FILE__",
  "__LINE__"
]), S = l(["true", "false", "nil", "self"]), T = [
  "def",
  "fun",
  "macro",
  "class",
  "module",
  "struct",
  "lib",
  "enum",
  "union",
  "do",
  "for"
], A = l(T), s = ["if", "unless", "case", "while", "until", "begin", "then"], O = l(s), x = ["end", "else", "elsif", "rescue", "ensure"], K = l(x), I = ["\\)", "\\}", "\\]"], D = new RegExp("^(?:" + I.join("|") + ")$"), w = {
  def: y,
  fun: y,
  macro: N,
  class: c,
  module: c,
  struct: c,
  lib: c,
  enum: c,
  union: c
}, k = { "[": "]", "{": "}", "(": ")", "<": ">" };
function _(n, e) {
  if (n.eatSpace())
    return null;
  if (e.lastToken != "\\" && n.match("{%", !1))
    return o(f("%", "%"), n, e);
  if (e.lastToken != "\\" && n.match("{{", !1))
    return o(f("{", "}"), n, e);
  if (n.peek() == "#")
    return n.skipToEnd(), "comment";
  var r;
  if (n.match(p))
    return n.eat(/[?!]/), r = n.current(), n.eat(":") ? "atom" : e.lastToken == "." ? "property" : E.test(r) ? (A.test(r) ? !(r == "fun" && e.blocks.indexOf("lib") >= 0) && !(r == "def" && e.lastToken == "abstract") && (e.blocks.push(r), e.currentIndent += 1) : (e.lastStyle == "operator" || !e.lastStyle) && O.test(r) ? (e.blocks.push(r), e.currentIndent += 1) : r == "end" && (e.blocks.pop(), e.currentIndent -= 1), w.hasOwnProperty(r) && e.tokenize.push(w[r]), "keyword") : S.test(r) ? "atom" : "variable";
  if (n.eat("@"))
    return n.peek() == "[" ? o(h("[", "]", "meta"), n, e) : (n.eat("@"), n.match(p) || n.match(d), "propertyName");
  if (n.match(d))
    return "tag";
  if (n.eat(":"))
    return n.eat('"') ? o(F('"', "atom", !1), n, e) : n.match(p) || n.match(d) || n.match(v) || n.match(z) || n.match(g) ? "atom" : (n.eat(":"), "operator");
  if (n.eat('"'))
    return o(F('"', "string", !0), n, e);
  if (n.peek() == "%") {
    var i = "string", u = !0, t;
    if (n.match("%r"))
      i = "string.special", t = n.next();
    else if (n.match("%w"))
      u = !1, t = n.next();
    else if (n.match("%q"))
      u = !1, t = n.next();
    else if (t = n.match(/^%([^\w\s=])/))
      t = t[1];
    else {
      if (n.match(/^%[a-zA-Z_\u009F-\uFFFF][\w\u009F-\uFFFF]*/))
        return "meta";
      if (n.eat("%"))
        return "operator";
    }
    return k.hasOwnProperty(t) && (t = k[t]), o(F(t, i, u), n, e);
  }
  return (r = n.match(/^<<-('?)([A-Z]\w*)\1/)) ? o(Z(r[2], !r[1]), n, e) : n.eat("'") ? (n.match(/^(?:[^']|\\(?:[befnrtv0'"]|[0-7]{3}|u(?:[0-9a-fA-F]{4}|\{[0-9a-fA-F]{1,6}\})))/), n.eat("'"), "atom") : n.eat("0") ? (n.eat("x") ? n.match(/^[0-9a-fA-F_]+/) : n.eat("o") ? n.match(/^[0-7_]+/) : n.eat("b") && n.match(/^[01_]+/), "number") : n.eat(/^\d/) ? (n.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?/), "number") : n.match(v) ? (n.eat("="), "operator") : n.match(z) || n.match(b) ? "operator" : (r = n.match(/[({[]/, !1)) ? (r = r[0], o(h(r, k[r], null), n, e)) : n.eat("\\") ? (n.next(), "meta") : (n.next(), null);
}
function h(n, e, r, i) {
  return function(u, t) {
    if (!i && u.match(n))
      return t.tokenize[t.tokenize.length - 1] = h(n, e, r, !0), t.currentIndent += 1, r;
    var a = _(u, t);
    return u.current() === e && (t.tokenize.pop(), t.currentIndent -= 1, a = r), a;
  };
}
function f(n, e, r) {
  return function(i, u) {
    return !r && i.match("{" + n) ? (u.currentIndent += 1, u.tokenize[u.tokenize.length - 1] = f(n, e, !0), "meta") : i.match(e + "}") ? (u.currentIndent -= 1, u.tokenize.pop(), "meta") : _(i, u);
  };
}
function N(n, e) {
  if (n.eatSpace())
    return null;
  var r;
  if (r = n.match(p)) {
    if (r == "def")
      return "keyword";
    n.eat(/[?!]/);
  }
  return e.tokenize.pop(), "def";
}
function y(n, e) {
  return n.eatSpace() ? null : (n.match(p) ? n.eat(/[!?]/) : n.match(v) || n.match(z) || n.match(g), e.tokenize.pop(), "def");
}
function c(n, e) {
  return n.eatSpace() ? null : (n.match(d), e.tokenize.pop(), "def");
}
function F(n, e, r) {
  return function(i, u) {
    for (var t = !1; i.peek(); )
      if (t)
        i.next(), t = !1;
      else {
        if (i.match("{%", !1))
          return u.tokenize.push(f("%", "%")), e;
        if (i.match("{{", !1))
          return u.tokenize.push(f("{", "}")), e;
        if (r && i.match("#{", !1))
          return u.tokenize.push(h("#{", "}", "meta")), e;
        var a = i.next();
        if (a == n)
          return u.tokenize.pop(), e;
        t = r && a == "\\";
      }
    return e;
  };
}
function Z(n, e) {
  return function(r, i) {
    if (r.sol() && (r.eatSpace(), r.match(n)))
      return i.tokenize.pop(), "string";
    for (var u = !1; r.peek(); )
      if (u)
        r.next(), u = !1;
      else {
        if (r.match("{%", !1))
          return i.tokenize.push(f("%", "%")), "string";
        if (r.match("{{", !1))
          return i.tokenize.push(f("{", "}")), "string";
        if (e && r.match("#{", !1))
          return i.tokenize.push(h("#{", "}", "meta")), "string";
        u = e && r.next() == "\\";
      }
    return "string";
  };
}
const P = {
  startState: function() {
    return {
      tokenize: [_],
      currentIndent: 0,
      lastToken: null,
      lastStyle: null,
      blocks: []
    };
  },
  token: function(n, e) {
    var r = e.tokenize[e.tokenize.length - 1](n, e), i = n.current();
    return r && r != "comment" && (e.lastToken = i, e.lastStyle = r), r;
  },
  indent: function(n, e, r) {
    return e = e.replace(/^\s*(?:\{%)?\s*|\s*(?:%\})?\s*$/g, ""), K.test(e) || D.test(e) ? r.unit * (n.currentIndent - 1) : r.unit * n.currentIndent;
  },
  languageData: {
    indentOnInput: l(I.concat(x), !0),
    commentTokens: { line: "#" }
  }
};
export {
  P as crystal
};
