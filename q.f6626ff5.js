var c, p = x(["abs", "acos", "aj", "aj0", "all", "and", "any", "asc", "asin", "asof", "atan", "attr", "avg", "avgs", "bin", "by", "ceiling", "cols", "cor", "cos", "count", "cov", "cross", "csv", "cut", "delete", "deltas", "desc", "dev", "differ", "distinct", "div", "do", "each", "ej", "enlist", "eval", "except", "exec", "exit", "exp", "fby", "fills", "first", "fkeys", "flip", "floor", "from", "get", "getenv", "group", "gtime", "hclose", "hcount", "hdel", "hopen", "hsym", "iasc", "idesc", "if", "ij", "in", "insert", "inter", "inv", "key", "keys", "last", "like", "list", "lj", "load", "log", "lower", "lsq", "ltime", "ltrim", "mavg", "max", "maxs", "mcount", "md5", "mdev", "med", "meta", "min", "mins", "mmax", "mmin", "mmu", "mod", "msum", "neg", "next", "not", "null", "or", "over", "parse", "peach", "pj", "plist", "prd", "prds", "prev", "prior", "rand", "rank", "ratios", "raze", "read0", "read1", "reciprocal", "reverse", "rload", "rotate", "rsave", "rtrim", "save", "scan", "select", "set", "setenv", "show", "signum", "sin", "sqrt", "ss", "ssr", "string", "sublist", "sum", "sums", "sv", "system", "tables", "tan", "til", "trim", "txf", "type", "uj", "ungroup", "union", "update", "upper", "upsert", "value", "var", "view", "views", "vs", "wavg", "where", "where", "while", "within", "wj", "wj1", "wsum", "xasc", "xbar", "xcol", "xcols", "xdesc", "xexp", "xgroup", "xkey", "xlog", "xprev", "xrank"]), f = /[|/&^!+:\\\-*%$=~#;@><,?_\'\"\[\(\]\)\s{}]/;
function x(n) {
  return new RegExp("^(" + n.join("|") + ")$");
}
function r(n, e) {
  var o = n.sol(), i = n.next();
  if (c = null, o) {
    if (i == "/")
      return (e.tokenize = s)(n, e);
    if (i == "\\")
      return n.eol() || /\s/.test(n.peek()) ? (n.skipToEnd(), /^\\\s*$/.test(n.current()) ? (e.tokenize = k)(n) : e.tokenize = r, "comment") : (e.tokenize = r, "builtin");
  }
  if (/\s/.test(i))
    return n.peek() == "/" ? (n.skipToEnd(), "comment") : "null";
  if (i == '"')
    return (e.tokenize = m)(n, e);
  if (i == "`")
    return n.eatWhile(/[A-Za-z\d_:\/.]/), "macroName";
  if (i == "." && /\d/.test(n.peek()) || /\d/.test(i)) {
    var t = null;
    return n.backUp(1), n.match(/^\d{4}\.\d{2}(m|\.\d{2}([DT](\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?)?)?)/) || n.match(/^\d+D(\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?)/) || n.match(/^\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?/) || n.match(/^\d+[ptuv]{1}/) ? t = "temporal" : (n.match(/^0[NwW]{1}/) || n.match(/^0x[\da-fA-F]*/) || n.match(/^[01]+[b]{1}/) || n.match(/^\d+[chijn]{1}/) || n.match(/-?\d*(\.\d*)?(e[+\-]?\d+)?(e|f)?/)) && (t = "number"), t && (!(i = n.peek()) || f.test(i)) ? t : (n.next(), "error");
  }
  return /[A-Za-z]|\./.test(i) ? (n.eatWhile(/[A-Za-z._\d]/), p.test(n.current()) ? "keyword" : "variable") : /[|/&^!+:\\\-*%$=~#;@><\.,?_\']/.test(i) || /[{}\(\[\]\)]/.test(i) ? null : "error";
}
function s(n, e) {
  return n.skipToEnd(), /\/\s*$/.test(n.current()) ? (e.tokenize = v)(n, e) : e.tokenize = r, "comment";
}
function v(n, e) {
  var o = n.sol() && n.peek() == "\\";
  return n.skipToEnd(), o && /^\\\s*$/.test(n.current()) && (e.tokenize = r), "comment";
}
function k(n) {
  return n.skipToEnd(), "comment";
}
function m(n, e) {
  for (var o = !1, i, t = !1; i = n.next(); ) {
    if (i == '"' && !o) {
      t = !0;
      break;
    }
    o = !o && i == "\\";
  }
  return t && (e.tokenize = r), "string";
}
function l(n, e, o) {
  n.context = { prev: n.context, indent: n.indent, col: o, type: e };
}
function u(n) {
  n.indent = n.context.indent, n.context = n.context.prev;
}
const h = {
  startState: function() {
    return {
      tokenize: r,
      context: null,
      indent: 0,
      col: 0
    };
  },
  token: function(n, e) {
    n.sol() && (e.context && e.context.align == null && (e.context.align = !1), e.indent = n.indentation());
    var o = e.tokenize(n, e);
    if (o != "comment" && e.context && e.context.align == null && e.context.type != "pattern" && (e.context.align = !0), c == "(")
      l(e, ")", n.column());
    else if (c == "[")
      l(e, "]", n.column());
    else if (c == "{")
      l(e, "}", n.column());
    else if (/[\]\}\)]/.test(c)) {
      for (; e.context && e.context.type == "pattern"; )
        u(e);
      e.context && c == e.context.type && u(e);
    } else
      c == "." && e.context && e.context.type == "pattern" ? u(e) : /atom|string|variable/.test(o) && e.context && (/[\}\]]/.test(e.context.type) ? l(e, "pattern", n.column()) : e.context.type == "pattern" && !e.context.align && (e.context.align = !0, e.context.col = n.column()));
    return o;
  },
  indent: function(n, e, o) {
    var i = e && e.charAt(0), t = n.context;
    if (/[\]\}]/.test(i))
      for (; t && t.type == "pattern"; )
        t = t.prev;
    var d = t && i == t.type;
    return t ? t.type == "pattern" ? t.col : t.align ? t.col + (d ? 0 : 1) : t.indent + (d ? 0 : o.unit) : 0;
  }
};
export {
  h as q
};
