import { keywords as h } from "./css.7a5a3af0.js";
const w = new Set(h.properties), b = new Set(h.colors), T = new Set(h.values), v = new Set(h.fonts);
function L(n) {
  return new RegExp("^" + n.join("|"));
}
let R = ["true", "false", "null", "auto"], g = new RegExp("^" + R.join("|")), E = [
  "\\(",
  "\\)",
  "=",
  ">",
  "<",
  "==",
  ">=",
  "<=",
  "\\+",
  "-",
  "\\!=",
  "/",
  "\\*",
  "%",
  "and",
  "or",
  "not",
  ";",
  "\\{",
  "\\}",
  ":"
], z = L(E), O = /^::?[a-zA-Z_][\w\-]*/, f;
function o(n) {
  return !n.peek() || n.match(/\s+$/, !1);
}
function y(n, e) {
  let r = n.peek();
  return r === ")" ? (n.next(), e.tokenizer = t, "operator") : r === "(" ? (n.next(), n.eatSpace(), "operator") : r === "'" || r === '"' ? (e.tokenizer = x(n.next()), "string") : (e.tokenizer = x(")", !1), "string");
}
function H(n, e) {
  return function(r, i) {
    return r.sol() && r.indentation() <= n ? (i.tokenizer = t, t(r, i)) : (e && r.skipTo("*/") ? (r.next(), r.next(), i.tokenizer = t) : r.skipToEnd(), "comment");
  };
}
function x(n, e) {
  e == null && (e = !0);
  function r(i, k) {
    let l = i.next(), c = i.peek(), p = i.string.charAt(i.pos - 2);
    return l !== "\\" && c === n || l === n && p !== "\\" ? (l !== n && e && i.next(), o(i) && (k.cursorHalf = 0), k.tokenizer = t, "string") : l === "#" && c === "{" ? (k.tokenizer = C(r), i.next(), "operator") : "string";
  }
  return r;
}
function C(n) {
  return function(e, r) {
    return e.peek() === "}" ? (e.next(), r.tokenizer = n, "operator") : t(e, r);
  };
}
function u(n, e) {
  if (n.indentCount == 0) {
    n.indentCount++;
    let i = n.scopes[0].offset + e.indentUnit;
    n.scopes.unshift({ offset: i });
  }
}
function S(n) {
  n.scopes.length != 1 && n.scopes.shift();
}
function t(n, e) {
  let r = n.peek();
  if (n.match("/*"))
    return e.tokenizer = H(n.indentation(), !0), e.tokenizer(n, e);
  if (n.match("//"))
    return e.tokenizer = H(n.indentation(), !1), e.tokenizer(n, e);
  if (n.match("#{"))
    return e.tokenizer = C(t), "operator";
  if (r === '"' || r === "'")
    return n.next(), e.tokenizer = x(r), "string";
  if (e.cursorHalf) {
    if (r === "#" && (n.next(), n.match(/[0-9a-fA-F]{6}|[0-9a-fA-F]{3}/)) || n.match(/^-?[0-9\.]+/))
      return o(n) && (e.cursorHalf = 0), "number";
    if (n.match(/^(px|em|in)\b/))
      return o(n) && (e.cursorHalf = 0), "unit";
    if (n.match(g))
      return o(n) && (e.cursorHalf = 0), "keyword";
    if (n.match(/^url/) && n.peek() === "(")
      return e.tokenizer = y, o(n) && (e.cursorHalf = 0), "atom";
    if (r === "$")
      return n.next(), n.eatWhile(/[\w-]/), o(n) && (e.cursorHalf = 0), "variable-2";
    if (r === "!")
      return n.next(), e.cursorHalf = 0, n.match(/^[\w]+/) ? "keyword" : "operator";
    if (n.match(z))
      return o(n) && (e.cursorHalf = 0), "operator";
    if (n.eatWhile(/[\w-]/))
      return o(n) && (e.cursorHalf = 0), f = n.current().toLowerCase(), T.has(f) ? "atom" : b.has(f) ? "keyword" : w.has(f) ? (e.prevProp = n.current().toLowerCase(), "property") : "tag";
    if (o(n))
      return e.cursorHalf = 0, null;
  } else {
    if (r === "-" && n.match(/^-\w+-/))
      return "meta";
    if (r === ".") {
      if (n.next(), n.match(/^[\w-]+/))
        return u(e, n), "qualifier";
      if (n.peek() === "#")
        return u(e, n), "tag";
    }
    if (r === "#") {
      if (n.next(), n.match(/^[\w-]+/))
        return u(e, n), "builtin";
      if (n.peek() === "#")
        return u(e, n), "tag";
    }
    if (r === "$")
      return n.next(), n.eatWhile(/[\w-]/), "variable-2";
    if (n.match(/^-?[0-9\.]+/))
      return "number";
    if (n.match(/^(px|em|in)\b/))
      return "unit";
    if (n.match(g))
      return "keyword";
    if (n.match(/^url/) && n.peek() === "(")
      return e.tokenizer = y, "atom";
    if (r === "=" && n.match(/^=[\w-]+/))
      return u(e, n), "meta";
    if (r === "+" && n.match(/^\+[\w-]+/))
      return "meta";
    if (r === "@" && n.match("@extend") && (n.match(/\s*[\w]/) || S(e)), n.match(/^@(else if|if|media|else|for|each|while|mixin|function)/))
      return u(e, n), "def";
    if (r === "@")
      return n.next(), n.eatWhile(/[\w-]/), "def";
    if (n.eatWhile(/[\w-]/))
      if (n.match(/ *: *[\w-\+\$#!\("']/, !1)) {
        f = n.current().toLowerCase();
        let i = e.prevProp + "-" + f;
        return w.has(i) ? "property" : w.has(f) ? (e.prevProp = f, "property") : v.has(f) ? "property" : "tag";
      } else
        return n.match(/ *:/, !1) ? (u(e, n), e.cursorHalf = 1, e.prevProp = n.current().toLowerCase(), "property") : (n.match(/ *,/, !1) || u(e, n), "tag");
    if (r === ":")
      return n.match(O) ? "type" : (n.next(), e.cursorHalf = 1, "operator");
  }
  return n.match(z) ? "operator" : (n.next(), null);
}
function P(n, e) {
  n.sol() && (e.indentCount = 0);
  let r = e.tokenizer(n, e), i = n.current();
  if ((i === "@return" || i === "}") && S(e), r !== null) {
    let l = n.pos - i.length + n.indentUnit * e.indentCount, c = [];
    for (let p = 0; p < e.scopes.length; p++) {
      let d = e.scopes[p];
      d.offset <= l && c.push(d);
    }
    e.scopes = c;
  }
  return r;
}
const $ = {
  startState: function() {
    return {
      tokenizer: t,
      scopes: [{ offset: 0, type: "sass" }],
      indentCount: 0,
      cursorHalf: 0,
      definedVars: [],
      definedMixins: []
    };
  },
  token: function(n, e) {
    let r = P(n, e);
    return e.lastToken = { style: r, content: n.current() }, r;
  },
  indent: function(n) {
    return n.scopes[0].offset;
  },
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    autocomplete: h.all
  }
};
export {
  $ as sass
};
