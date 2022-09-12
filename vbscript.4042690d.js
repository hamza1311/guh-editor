function p(h) {
  var v = "error";
  function i(e) {
    return new RegExp("^((" + e.join(")|(") + "))\\b", "i");
  }
  var y = new RegExp("^[\\+\\-\\*/&\\\\\\^<>=]"), g = new RegExp("^((<>)|(<=)|(>=))"), m = new RegExp("^[\\.,]"), w = new RegExp("^[\\(\\)]"), k = new RegExp("^[A-Za-z][_A-Za-z0-9]*"), x = ["class", "sub", "select", "while", "if", "function", "property", "with", "for"], C = ["else", "elseif", "case"], I = ["next", "loop", "wend"], S = i(["and", "or", "not", "xor", "is", "mod", "eqv", "imp"]), O = [
    "dim",
    "redim",
    "then",
    "until",
    "randomize",
    "byval",
    "byref",
    "new",
    "property",
    "exit",
    "in",
    "const",
    "private",
    "public",
    "get",
    "set",
    "let",
    "stop",
    "on error resume next",
    "on error goto 0",
    "option explicit",
    "call",
    "me"
  ], D = ["true", "false", "nothing", "empty", "null"], R = [
    "abs",
    "array",
    "asc",
    "atn",
    "cbool",
    "cbyte",
    "ccur",
    "cdate",
    "cdbl",
    "chr",
    "cint",
    "clng",
    "cos",
    "csng",
    "cstr",
    "date",
    "dateadd",
    "datediff",
    "datepart",
    "dateserial",
    "datevalue",
    "day",
    "escape",
    "eval",
    "execute",
    "exp",
    "filter",
    "formatcurrency",
    "formatdatetime",
    "formatnumber",
    "formatpercent",
    "getlocale",
    "getobject",
    "getref",
    "hex",
    "hour",
    "inputbox",
    "instr",
    "instrrev",
    "int",
    "fix",
    "isarray",
    "isdate",
    "isempty",
    "isnull",
    "isnumeric",
    "isobject",
    "join",
    "lbound",
    "lcase",
    "left",
    "len",
    "loadpicture",
    "log",
    "ltrim",
    "rtrim",
    "trim",
    "maths",
    "mid",
    "minute",
    "month",
    "monthname",
    "msgbox",
    "now",
    "oct",
    "replace",
    "rgb",
    "right",
    "rnd",
    "round",
    "scriptengine",
    "scriptenginebuildversion",
    "scriptenginemajorversion",
    "scriptengineminorversion",
    "second",
    "setlocale",
    "sgn",
    "sin",
    "space",
    "split",
    "sqr",
    "strcomp",
    "string",
    "strreverse",
    "tan",
    "time",
    "timer",
    "timeserial",
    "timevalue",
    "typename",
    "ubound",
    "ucase",
    "unescape",
    "vartype",
    "weekday",
    "weekdayname",
    "year"
  ], E = [
    "vbBlack",
    "vbRed",
    "vbGreen",
    "vbYellow",
    "vbBlue",
    "vbMagenta",
    "vbCyan",
    "vbWhite",
    "vbBinaryCompare",
    "vbTextCompare",
    "vbSunday",
    "vbMonday",
    "vbTuesday",
    "vbWednesday",
    "vbThursday",
    "vbFriday",
    "vbSaturday",
    "vbUseSystemDayOfWeek",
    "vbFirstJan1",
    "vbFirstFourDays",
    "vbFirstFullWeek",
    "vbGeneralDate",
    "vbLongDate",
    "vbShortDate",
    "vbLongTime",
    "vbShortTime",
    "vbObjectError",
    "vbOKOnly",
    "vbOKCancel",
    "vbAbortRetryIgnore",
    "vbYesNoCancel",
    "vbYesNo",
    "vbRetryCancel",
    "vbCritical",
    "vbQuestion",
    "vbExclamation",
    "vbInformation",
    "vbDefaultButton1",
    "vbDefaultButton2",
    "vbDefaultButton3",
    "vbDefaultButton4",
    "vbApplicationModal",
    "vbSystemModal",
    "vbOK",
    "vbCancel",
    "vbAbort",
    "vbRetry",
    "vbIgnore",
    "vbYes",
    "vbNo",
    "vbCr",
    "VbCrLf",
    "vbFormFeed",
    "vbLf",
    "vbNewLine",
    "vbNullChar",
    "vbNullString",
    "vbTab",
    "vbVerticalTab",
    "vbUseDefault",
    "vbTrue",
    "vbFalse",
    "vbEmpty",
    "vbNull",
    "vbInteger",
    "vbLong",
    "vbSingle",
    "vbDouble",
    "vbCurrency",
    "vbDate",
    "vbString",
    "vbObject",
    "vbError",
    "vbBoolean",
    "vbVariant",
    "vbDataObject",
    "vbDecimal",
    "vbByte",
    "vbArray"
  ], a = ["WScript", "err", "debug", "RegExp"], L = ["description", "firstindex", "global", "helpcontext", "helpfile", "ignorecase", "length", "number", "pattern", "source", "value", "count"], T = ["clear", "execute", "raise", "replace", "test", "write", "writeline", "close", "open", "state", "eof", "update", "addnew", "end", "createobject", "quit"], j = ["server", "response", "request", "session", "application"], F = [
    "buffer",
    "cachecontrol",
    "charset",
    "contenttype",
    "expires",
    "expiresabsolute",
    "isclientconnected",
    "pics",
    "status",
    "clientcertificate",
    "cookies",
    "form",
    "querystring",
    "servervariables",
    "totalbytes",
    "contents",
    "staticobjects",
    "codepage",
    "lcid",
    "sessionid",
    "timeout",
    "scripttimeout"
  ], B = [
    "addheader",
    "appendtolog",
    "binarywrite",
    "end",
    "flush",
    "redirect",
    "binaryread",
    "remove",
    "removeall",
    "lock",
    "unlock",
    "abandon",
    "getlasterror",
    "htmlencode",
    "mappath",
    "transfer",
    "urlencode"
  ], c = T.concat(L);
  a = a.concat(E), h.isASP && (a = a.concat(j), c = c.concat(B, F));
  var W = i(O), z = i(D), A = i(R), K = i(a), N = i(c), M = '"', P = i(x), b = i(C), d = i(I), s = i(["end"]), q = i(["do"]), V = i(["on error resume next", "exit"]), Y = i(["rem"]);
  function f(e, n) {
    n.currentIndent++;
  }
  function u(e, n) {
    n.currentIndent--;
  }
  function l(e, n) {
    if (e.eatSpace())
      return null;
    var r = e.peek();
    if (r === "'" || e.match(Y))
      return e.skipToEnd(), "comment";
    if (e.match(/^((&H)|(&O))?[0-9\.]/i, !1) && !e.match(/^((&H)|(&O))?[0-9\.]+[a-z_]/i, !1)) {
      var t = !1;
      if ((e.match(/^\d*\.\d+/i) || e.match(/^\d+\.\d*/) || e.match(/^\.\d+/)) && (t = !0), t)
        return e.eat(/J/i), "number";
      var o = !1;
      if (e.match(/^&H[0-9a-f]+/i) || e.match(/^&O[0-7]+/i) ? o = !0 : e.match(/^[1-9]\d*F?/) ? (e.eat(/J/i), o = !0) : e.match(/^0(?![\dx])/i) && (o = !0), o)
        return e.eat(/L/i), "number";
    }
    return e.match(M) ? (n.tokenize = _(e.current()), n.tokenize(e, n)) : e.match(g) || e.match(y) || e.match(S) ? "operator" : e.match(m) ? null : e.match(w) ? "bracket" : e.match(V) ? (n.doInCurrentLine = !0, "keyword") : e.match(q) ? (f(e, n), n.doInCurrentLine = !0, "keyword") : e.match(P) ? (n.doInCurrentLine ? n.doInCurrentLine = !1 : f(e, n), "keyword") : e.match(b) ? "keyword" : e.match(s) ? (u(e, n), u(e, n), "keyword") : e.match(d) ? (n.doInCurrentLine ? n.doInCurrentLine = !1 : u(e, n), "keyword") : e.match(W) ? "keyword" : e.match(z) ? "atom" : e.match(N) ? "variableName.special" : e.match(A) || e.match(K) ? "builtin" : e.match(k) ? "variable" : (e.next(), v);
  }
  function _(e) {
    var n = e.length == 1, r = "string";
    return function(t, o) {
      for (; !t.eol(); ) {
        if (t.eatWhile(/[^'"]/), t.match(e))
          return o.tokenize = l, r;
        t.eat(/['"]/);
      }
      return n && (o.tokenize = l), r;
    };
  }
  function H(e, n) {
    var r = n.tokenize(e, n), t = e.current();
    return t === "." ? (r = n.tokenize(e, n), t = e.current(), r && (r.substr(0, 8) === "variable" || r === "builtin" || r === "keyword") ? ((r === "builtin" || r === "keyword") && (r = "variable"), c.indexOf(t.substr(1)) > -1 && (r = "keyword"), r) : v) : r;
  }
  return {
    startState: function() {
      return {
        tokenize: l,
        lastToken: null,
        currentIndent: 0,
        nextLineIndent: 0,
        doInCurrentLine: !1,
        ignoreKeyword: !1
      };
    },
    token: function(e, n) {
      e.sol() && (n.currentIndent += n.nextLineIndent, n.nextLineIndent = 0, n.doInCurrentLine = 0);
      var r = H(e, n);
      return n.lastToken = { style: r, content: e.current() }, r === null && (r = null), r;
    },
    indent: function(e, n, r) {
      var t = n.replace(/^\s+|\s+$/g, "");
      return t.match(d) || t.match(s) || t.match(b) ? r.unit * (e.currentIndent - 1) : e.currentIndent < 0 ? 0 : e.currentIndent * r.unit;
    }
  };
}
const J = p({}), U = p({ isASP: !0 });
export {
  J as vbScript,
  U as vbScriptASP
};