var r;
function f(n) {
  return new RegExp("^(?:" + n.join("|") + ")$", "i");
}
var p = f([
  "str",
  "lang",
  "langmatches",
  "datatype",
  "bound",
  "sameterm",
  "isiri",
  "isuri",
  "iri",
  "uri",
  "bnode",
  "count",
  "sum",
  "min",
  "max",
  "avg",
  "sample",
  "group_concat",
  "rand",
  "abs",
  "ceil",
  "floor",
  "round",
  "concat",
  "substr",
  "strlen",
  "replace",
  "ucase",
  "lcase",
  "encode_for_uri",
  "contains",
  "strstarts",
  "strends",
  "strbefore",
  "strafter",
  "year",
  "month",
  "day",
  "hours",
  "minutes",
  "seconds",
  "timezone",
  "tz",
  "now",
  "uuid",
  "struuid",
  "md5",
  "sha1",
  "sha256",
  "sha384",
  "sha512",
  "coalesce",
  "if",
  "strlang",
  "strdt",
  "isnumeric",
  "regex",
  "exists",
  "isblank",
  "isliteral",
  "a",
  "bind"
]), d = f([
  "base",
  "prefix",
  "select",
  "distinct",
  "reduced",
  "construct",
  "describe",
  "ask",
  "from",
  "named",
  "where",
  "order",
  "limit",
  "offset",
  "filter",
  "optional",
  "graph",
  "by",
  "asc",
  "desc",
  "as",
  "having",
  "undef",
  "values",
  "group",
  "minus",
  "in",
  "not",
  "service",
  "silent",
  "using",
  "insert",
  "delete",
  "union",
  "true",
  "false",
  "with",
  "data",
  "copy",
  "to",
  "move",
  "add",
  "create",
  "drop",
  "clear",
  "load"
]), F = /[*+\-<>=&|\^\/!\?]/;
function s(n, e) {
  var t = n.next();
  if (r = null, t == "$" || t == "?")
    return t == "?" && n.match(/\s/, !1) ? "operator" : (n.match(/^[A-Za-z0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][A-Za-z0-9_\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*/), "variableName.local");
  if (t == "<" && !n.match(/^[\s\u00a0=]/, !1))
    return n.match(/^[^\s\u00a0>]*>?/), "atom";
  if (t == '"' || t == "'")
    return e.tokenize = x(t), e.tokenize(n, e);
  if (/[{}\(\),\.;\[\]]/.test(t))
    return r = t, "bracket";
  if (t == "#")
    return n.skipToEnd(), "comment";
  if (F.test(t))
    return "operator";
  if (t == ":")
    return a(n), "atom";
  if (t == "@")
    return n.eatWhile(/[a-z\d\-]/i), "meta";
  if (n.eatWhile(/[_\w\d]/), n.eat(":"))
    return a(n), "atom";
  var u = n.current();
  return p.test(u) ? "builtin" : d.test(u) ? "keyword" : "variable";
}
function a(n) {
  n.match(/(\.(?=[\w_\-\\%])|[:\w_-]|\\[-\\_~.!$&'()*+,;=/?#@%]|%[a-f\d][a-f\d])+/i);
}
function x(n) {
  return function(e, t) {
    for (var u = !1, i; (i = e.next()) != null; ) {
      if (i == n && !u) {
        t.tokenize = s;
        break;
      }
      u = !u && i == "\\";
    }
    return "string";
  };
}
function o(n, e, t) {
  n.context = { prev: n.context, indent: n.indent, col: t, type: e };
}
function c(n) {
  n.indent = n.context.indent, n.context = n.context.prev;
}
const h = {
  startState: function() {
    return {
      tokenize: s,
      context: null,
      indent: 0,
      col: 0
    };
  },
  token: function(n, e) {
    if (n.sol() && (e.context && e.context.align == null && (e.context.align = !1), e.indent = n.indentation()), n.eatSpace())
      return null;
    var t = e.tokenize(n, e);
    if (t != "comment" && e.context && e.context.align == null && e.context.type != "pattern" && (e.context.align = !0), r == "(")
      o(e, ")", n.column());
    else if (r == "[")
      o(e, "]", n.column());
    else if (r == "{")
      o(e, "}", n.column());
    else if (/[\]\}\)]/.test(r)) {
      for (; e.context && e.context.type == "pattern"; )
        c(e);
      e.context && r == e.context.type && (c(e), r == "}" && e.context && e.context.type == "pattern" && c(e));
    } else
      r == "." && e.context && e.context.type == "pattern" ? c(e) : /atom|string|variable/.test(t) && e.context && (/[\}\]]/.test(e.context.type) ? o(e, "pattern", n.column()) : e.context.type == "pattern" && !e.context.align && (e.context.align = !0, e.context.col = n.column()));
    return t;
  },
  indent: function(n, e, t) {
    var u = e && e.charAt(0), i = n.context;
    if (/[\]\}]/.test(u))
      for (; i && i.type == "pattern"; )
        i = i.prev;
    var l = i && u == i.type;
    return i ? i.type == "pattern" ? i.col : i.align ? i.col + (l ? 0 : 1) : i.indent + (l ? 0 : t.unit) : 0;
  },
  languageData: {
    commentTokens: { line: "#" }
  }
};
export {
  h as sparql
};
