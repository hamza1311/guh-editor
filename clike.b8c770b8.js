function R(e, t, n, l, s, d) {
  this.indented = e, this.column = t, this.type = n, this.info = l, this.align = s, this.prev = d;
}
function D(e, t, n, l) {
  var s = e.indented;
  return e.context && e.context.type == "statement" && n != "statement" && (s = e.context.indented), e.context = new R(s, t, n, l, null, e.context);
}
function x(e) {
  var t = e.context.type;
  return (t == ")" || t == "]" || t == "}") && (e.indented = e.context.indented), e.context = e.context.prev;
}
function q(e, t, n) {
  if (t.prevToken == "variable" || t.prevToken == "type" || /\S(?:[^- ]>|[*\]])\s*$|\*$/.test(e.string.slice(0, n)) || t.typeAtEndOfLine && e.column() == e.indentation())
    return !0;
}
function V(e) {
  for (; ; ) {
    if (!e || e.type == "top")
      return !0;
    if (e.type == "}" && e.prev.info != "namespace")
      return !1;
    e = e.prev;
  }
}
function h(e) {
  var t = e.statementIndentUnit, n = e.dontAlignCalls, l = e.keywords || {}, s = e.types || {}, d = e.builtin || {}, b = e.blockKeywords || {}, _ = e.defKeywords || {}, w = e.atoms || {}, y = e.hooks || {}, ne = e.multiLineStrings, re = e.indentStatements !== !1, ie = e.indentSwitch !== !1, O = e.namespaceSeparator, oe = e.isPunctuationChar || /[\[\]{}\(\),;\:\.]/, ae = e.numberStart || /[\d\.]/, le = e.number || /^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i, F = e.isOperatorChar || /[+\-*&%=<>!?|\/]/, j = e.isIdentifierChar || /[\w\$_\xa1-\uffff]/, B = e.isReservedIdentifier || !1, p, E;
  function U(i, a) {
    var c = i.next();
    if (y[c]) {
      var o = y[c](i, a);
      if (o !== !1)
        return o;
    }
    if (c == '"' || c == "'")
      return a.tokenize = ce(c), a.tokenize(i, a);
    if (ae.test(c)) {
      if (i.backUp(1), i.match(le))
        return "number";
      i.next();
    }
    if (oe.test(c))
      return p = c, null;
    if (c == "/") {
      if (i.eat("*"))
        return a.tokenize = K, K(i, a);
      if (i.eat("/"))
        return i.skipToEnd(), "comment";
    }
    if (F.test(c)) {
      for (; !i.match(/^\/[\/*]/, !1) && i.eat(F); )
        ;
      return "operator";
    }
    if (i.eatWhile(j), O)
      for (; i.match(O); )
        i.eatWhile(j);
    var u = i.current();
    return k(l, u) ? (k(b, u) && (p = "newstatement"), k(_, u) && (E = !0), "keyword") : k(s, u) ? "type" : k(d, u) || B && B(u) ? (k(b, u) && (p = "newstatement"), "builtin") : k(w, u) ? "atom" : "variable";
  }
  function ce(i) {
    return function(a, c) {
      for (var o = !1, u, v = !1; (u = a.next()) != null; ) {
        if (u == i && !o) {
          v = !0;
          break;
        }
        o = !o && u == "\\";
      }
      return (v || !(o || ne)) && (c.tokenize = null), "string";
    };
  }
  function K(i, a) {
    for (var c = !1, o; o = i.next(); ) {
      if (o == "/" && c) {
        a.tokenize = null;
        break;
      }
      c = o == "*";
    }
    return "comment";
  }
  function A(i, a) {
    e.typeFirstDefinitions && i.eol() && V(a.context) && (a.typeAtEndOfLine = q(i, a, i.pos));
  }
  return {
    startState: function(i) {
      return {
        tokenize: null,
        context: new R(-i, 0, "top", null, !1),
        indented: 0,
        startOfLine: !0,
        prevToken: null
      };
    },
    token: function(i, a) {
      var c = a.context;
      if (i.sol() && (c.align == null && (c.align = !1), a.indented = i.indentation(), a.startOfLine = !0), i.eatSpace())
        return A(i, a), null;
      p = E = null;
      var o = (a.tokenize || U)(i, a);
      if (o == "comment" || o == "meta")
        return o;
      if (c.align == null && (c.align = !0), p == ";" || p == ":" || p == "," && i.match(/^\s*(?:\/\/.*)?$/, !1))
        for (; a.context.type == "statement"; )
          x(a);
      else if (p == "{")
        D(a, i.column(), "}");
      else if (p == "[")
        D(a, i.column(), "]");
      else if (p == "(")
        D(a, i.column(), ")");
      else if (p == "}") {
        for (; c.type == "statement"; )
          c = x(a);
        for (c.type == "}" && (c = x(a)); c.type == "statement"; )
          c = x(a);
      } else
        p == c.type ? x(a) : re && ((c.type == "}" || c.type == "top") && p != ";" || c.type == "statement" && p == "newstatement") && D(a, i.column(), "statement", i.current());
      if (o == "variable" && (a.prevToken == "def" || e.typeFirstDefinitions && q(i, a, i.start) && V(a.context) && i.match(/^\s*\(/, !1)) && (o = "def"), y.token) {
        var u = y.token(i, a, o);
        u !== void 0 && (o = u);
      }
      return o == "def" && e.styleDefs === !1 && (o = "variable"), a.startOfLine = !1, a.prevToken = E ? "def" : o || p, A(i, a), o;
    },
    indent: function(i, a, c) {
      if (i.tokenize != U && i.tokenize != null || i.typeAtEndOfLine)
        return null;
      var o = i.context, u = a && a.charAt(0), v = u == o.type;
      if (o.type == "statement" && u == "}" && (o = o.prev), e.dontIndentStatements)
        for (; o.type == "statement" && e.dontIndentStatements.test(o.info); )
          o = o.prev;
      if (y.indent) {
        var $ = y.indent(i, o, a, c.unit);
        if (typeof $ == "number")
          return $;
      }
      var se = o.prev && o.prev.info == "switch";
      if (e.allmanIndentation && /[{(]/.test(u)) {
        for (; o.type != "top" && o.type != "}"; )
          o = o.prev;
        return o.indented;
      }
      return o.type == "statement" ? o.indented + (u == "{" ? 0 : t || c.unit) : o.align && (!n || o.type != ")") ? o.column + (v ? 0 : 1) : o.type == ")" && !v ? o.indented + (t || c.unit) : o.indented + (v ? 0 : c.unit) + (!v && se && !/^(?:case|default)\b/.test(a) ? c.unit : 0);
    },
    languageData: {
      indentOnInput: ie ? /^\s*(?:case .*?:|default:|\{\}?|\})$/ : /^\s*[{}]$/,
      commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
      autocomplete: Object.keys(l).concat(Object.keys(s)).concat(Object.keys(d)).concat(Object.keys(w)),
      ...e.languageData
    }
  };
}
function r(e) {
  for (var t = {}, n = e.split(" "), l = 0; l < n.length; ++l)
    t[n[l]] = !0;
  return t;
}
function k(e, t) {
  return typeof e == "function" ? e(t) : e.propertyIsEnumerable(t);
}
var T = "auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran", H = "alignas alignof and and_eq audit axiom bitand bitor catch class compl concept constexpr const_cast decltype delete dynamic_cast explicit export final friend import module mutable namespace new noexcept not not_eq operator or or_eq override private protected public reinterpret_cast requires static_assert static_cast template this thread_local throw try typeid typename using virtual xor xor_eq", Q = "bycopy byref in inout oneway out self super atomic nonatomic retain copy readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd @interface @implementation @end @protocol @encode @property @synthesize @dynamic @class @public @package @private @protected @required @optional @try @catch @finally @import @selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available", Z = "FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION  NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT", ue = r("int long char short double float unsigned signed void bool"), fe = r("SEL instancetype id Class Protocol BOOL");
function I(e) {
  return k(ue, e) || /.+_t$/.test(e);
}
function X(e) {
  return I(e) || k(fe, e);
}
var N = "case do else for if switch while struct enum union", z = "struct enum union";
function m(e, t) {
  if (!t.startOfLine)
    return !1;
  for (var n, l = null; n = e.peek(); ) {
    if (n == "\\" && e.match(/^.$/)) {
      l = m;
      break;
    } else if (n == "/" && e.match(/^\/[\/\*]/, !1))
      break;
    e.next();
  }
  return t.tokenize = l, "meta";
}
function C(e, t) {
  return t.prevToken == "type" ? "type" : !1;
}
function M(e) {
  return !e || e.length < 2 || e[0] != "_" ? !1 : e[1] == "_" || e[1] !== e[1].toLowerCase();
}
function f(e) {
  return e.eatWhile(/[\w\.']/), "number";
}
function g(e, t) {
  if (e.backUp(1), e.match(/^(?:R|u8R|uR|UR|LR)/)) {
    var n = e.match(/^"([^\s\\()]{0,16})\(/);
    return n ? (t.cpp11RawStringDelim = n[1], t.tokenize = G, G(e, t)) : !1;
  }
  return e.match(/^(?:u8|u|U|L)/) ? e.match(/^["']/, !1) ? "string" : !1 : (e.next(), !1);
}
function Y(e) {
  var t = /(\w+)::~?(\w+)$/.exec(e);
  return t && t[1] == t[2];
}
function W(e, t) {
  for (var n; (n = e.next()) != null; )
    if (n == '"' && !e.eat('"')) {
      t.tokenize = null;
      break;
    }
  return "string";
}
function G(e, t) {
  var n = t.cpp11RawStringDelim.replace(/[^\w\s]/g, "\\$&"), l = e.match(new RegExp(".*?\\)" + n + '"'));
  return l ? t.tokenize = null : e.skipToEnd(), "string";
}
const ge = h({
  keywords: r(T),
  types: I,
  blockKeywords: r(N),
  defKeywords: r(z),
  typeFirstDefinitions: !0,
  atoms: r("NULL true false"),
  isReservedIdentifier: M,
  hooks: {
    "#": m,
    "*": C
  }
}), me = h({
  keywords: r(T + " " + H),
  types: I,
  blockKeywords: r(N + " class try catch"),
  defKeywords: r(z + " class namespace"),
  typeFirstDefinitions: !0,
  atoms: r("true false NULL nullptr"),
  dontIndentStatements: /^template$/,
  isIdentifierChar: /[\w\$_~\xa1-\uffff]/,
  isReservedIdentifier: M,
  hooks: {
    "#": m,
    "*": C,
    u: g,
    U: g,
    L: g,
    R: g,
    0: f,
    1: f,
    2: f,
    3: f,
    4: f,
    5: f,
    6: f,
    7: f,
    8: f,
    9: f,
    token: function(e, t, n) {
      if (n == "variable" && e.peek() == "(" && (t.prevToken == ";" || t.prevToken == null || t.prevToken == "}") && Y(e.current()))
        return "def";
    }
  },
  namespaceSeparator: "::"
}), be = h({
  keywords: r("abstract assert break case catch class const continue default do else enum extends final finally for goto if implements import instanceof interface native new package private protected public return static strictfp super switch synchronized this throw throws transient try volatile while @interface"),
  types: r("var byte short int long float double boolean char void Boolean Byte Character Double Float Integer Long Number Object Short String StringBuffer StringBuilder Void"),
  blockKeywords: r("catch class do else finally for if switch try while"),
  defKeywords: r("class interface enum @interface"),
  typeFirstDefinitions: !0,
  atoms: r("true false null"),
  number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+\.?\d*|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
  hooks: {
    "@": function(e) {
      return e.match("interface", !1) ? !1 : (e.eatWhile(/[\w\$_]/), "meta");
    },
    '"': function(e, t) {
      return e.match(/""$/) ? (t.tokenize = J, t.tokenize(e, t)) : !1;
    }
  }
}), we = h({
  keywords: r("abstract as async await base break case catch checked class const continue default delegate do else enum event explicit extern finally fixed for foreach goto if implicit in interface internal is lock namespace new operator out override params private protected public readonly ref return sealed sizeof stackalloc static struct switch this throw try typeof unchecked unsafe using virtual void volatile while add alias ascending descending dynamic from get global group into join let orderby partial remove select set value var yield"),
  types: r("Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32 UInt64 bool byte char decimal double short int long object sbyte float string ushort uint ulong"),
  blockKeywords: r("catch class do else finally for foreach if struct switch try while"),
  defKeywords: r("class interface namespace struct var"),
  typeFirstDefinitions: !0,
  atoms: r("true false null"),
  hooks: {
    "@": function(e, t) {
      return e.eat('"') ? (t.tokenize = W, W(e, t)) : (e.eatWhile(/[\w\$_]/), "meta");
    }
  }
});
function J(e, t) {
  for (var n = !1; !e.eol(); ) {
    if (!n && e.match('"""')) {
      t.tokenize = null;
      break;
    }
    n = e.next() == "\\" && !n;
  }
  return "string";
}
function S(e) {
  return function(t, n) {
    for (var l; l = t.next(); )
      if (l == "*" && t.eat("/"))
        if (e == 1) {
          n.tokenize = null;
          break;
        } else
          return n.tokenize = S(e - 1), n.tokenize(t, n);
      else if (l == "/" && t.eat("*"))
        return n.tokenize = S(e + 1), n.tokenize(t, n);
    return "comment";
  };
}
const ve = h({
  keywords: r(
    "abstract case catch class def do else extends final finally for forSome if implicit import lazy match new null object override package private protected return sealed super this throw trait try type val var while with yield _ assert assume require print println printf readLine readBoolean readByte readShort readChar readInt readLong readFloat readDouble"
  ),
  types: r(
    "AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either Enumeration Equiv Error Exception Fractional Function IndexedSeq Int Integral Iterable Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"
  ),
  multiLineStrings: !0,
  blockKeywords: r("catch class enum do else finally for forSome if match switch try while"),
  defKeywords: r("class enum def object package trait type val var"),
  atoms: r("true false null"),
  indentStatements: !1,
  indentSwitch: !1,
  isOperatorChar: /[+\-*&%=<>!?|\/#:@]/,
  hooks: {
    "@": function(e) {
      return e.eatWhile(/[\w\$_]/), "meta";
    },
    '"': function(e, t) {
      return e.match('""') ? (t.tokenize = J, t.tokenize(e, t)) : !1;
    },
    "'": function(e) {
      return e.eatWhile(/[\w\$_\xa1-\uffff]/), "atom";
    },
    "=": function(e, t) {
      var n = t.context;
      return n.type == "}" && n.align && e.eat(">") ? (t.context = new R(n.indented, n.column, n.type, n.info, null, n.prev), "operator") : !1;
    },
    "/": function(e, t) {
      return e.eat("*") ? (t.tokenize = S(1), t.tokenize(e, t)) : !1;
    }
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', '"""'] }
  }
});
function de(e) {
  return function(t, n) {
    for (var l = !1, s, d = !1; !t.eol(); ) {
      if (!e && !l && t.match('"')) {
        d = !0;
        break;
      }
      if (e && t.match('"""')) {
        d = !0;
        break;
      }
      s = t.next(), !l && s == "$" && t.match("{") && t.skipTo("}"), l = !l && s == "\\" && !e;
    }
    return (d || !e) && (n.tokenize = null), "string";
  };
}
const _e = h({
  keywords: r(
    "package as typealias class interface this super val operator var fun for is in This throw return annotation break continue object if else while do try when !in !is as? file import where by get set abstract enum open inner override private public internal protected catch finally out final vararg reified dynamic companion constructor init sealed field property receiver param sparam lateinit data inline noinline tailrec external annotation crossinline const operator infix suspend actual expect setparam"
  ),
  types: r(
    "Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void Annotation Any BooleanArray ByteArray Char CharArray DeprecationLevel DoubleArray Enum FloatArray Function Int IntArray Lazy LazyThreadSafetyMode LongArray Nothing ShortArray Unit"
  ),
  intendSwitch: !1,
  indentStatements: !1,
  multiLineStrings: !0,
  number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
  blockKeywords: r("catch class do else finally for if where try while enum"),
  defKeywords: r("class val var object interface fun"),
  atoms: r("true false null this"),
  hooks: {
    "@": function(e) {
      return e.eatWhile(/[\w\$_]/), "meta";
    },
    "*": function(e, t) {
      return t.prevToken == "." ? "variable" : "operator";
    },
    '"': function(e, t) {
      return t.tokenize = de(e.match('""')), t.tokenize(e, t);
    },
    "/": function(e, t) {
      return e.eat("*") ? (t.tokenize = S(1), t.tokenize(e, t)) : !1;
    },
    indent: function(e, t, n, l) {
      var s = n && n.charAt(0);
      if ((e.prevToken == "}" || e.prevToken == ")") && n == "")
        return e.indented;
      if (e.prevToken == "operator" && n != "}" && e.context.type != "}" || e.prevToken == "variable" && s == "." || (e.prevToken == "}" || e.prevToken == ")") && s == ".")
        return l * 2 + t.indented;
      if (t.align && t.type == "}")
        return t.indented + (e.context.type == (n || "").charAt(0) ? 0 : l);
    }
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', '"""'] }
  }
}), xe = h({
  keywords: r("sampler1D sampler2D sampler3D samplerCube sampler1DShadow sampler2DShadow const attribute uniform varying break continue discard return for while do if else struct in out inout"),
  types: r("float int bool void vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 mat2 mat3 mat4"),
  blockKeywords: r("for while do if else struct"),
  builtin: r("radians degrees sin cos tan asin acos atan pow exp log exp2 sqrt inversesqrt abs sign floor ceil fract mod min max clamp mix step smoothstep length distance dot cross normalize ftransform faceforward reflect refract matrixCompMult lessThan lessThanEqual greaterThan greaterThanEqual equal notEqual any all not texture1D texture1DProj texture1DLod texture1DProjLod texture2D texture2DProj texture2DLod texture2DProjLod texture3D texture3DProj texture3DLod texture3DProjLod textureCube textureCubeLod shadow1D shadow2D shadow1DProj shadow2DProj shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod dFdx dFdy fwidth noise1 noise2 noise3 noise4"),
  atoms: r("true false gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_FogCoord gl_PointCoord gl_Position gl_PointSize gl_ClipVertex gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor gl_TexCoord gl_FogFragCoord gl_FragCoord gl_FrontFacing gl_FragData gl_FragDepth gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse gl_TextureMatrixTranspose gl_ModelViewMatrixInverseTranspose gl_ProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixInverseTranspose gl_TextureMatrixInverseTranspose gl_NormalScale gl_DepthRange gl_ClipPlane gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel gl_FrontLightModelProduct gl_BackLightModelProduct gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ gl_FogParameters gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits gl_MaxDrawBuffers"),
  indentSwitch: !1,
  hooks: { "#": m }
}), Se = h({
  keywords: r(T + " as atomic async call command component components configuration event generic implementation includes interface module new norace nx_struct nx_union post provides signal task uses abstract extends"),
  types: I,
  blockKeywords: r(N),
  atoms: r("null true false"),
  hooks: { "#": m }
}), Te = h({
  keywords: r(T + " " + Q),
  types: X,
  builtin: r(Z),
  blockKeywords: r(N + " @synthesize @try @catch @finally @autoreleasepool @synchronized"),
  defKeywords: r(z + " @interface @implementation @protocol @class"),
  dontIndentStatements: /^@.*$/,
  typeFirstDefinitions: !0,
  atoms: r("YES NO NULL Nil nil true false nullptr"),
  isReservedIdentifier: M,
  hooks: {
    "#": m,
    "*": C
  }
}), Ie = h({
  keywords: r(T + " " + Q + " " + H),
  types: X,
  builtin: r(Z),
  blockKeywords: r(N + " @synthesize @try @catch @finally @autoreleasepool @synchronized class try catch"),
  defKeywords: r(z + " @interface @implementation @protocol @class class namespace"),
  dontIndentStatements: /^@.*$|^template$/,
  typeFirstDefinitions: !0,
  atoms: r("YES NO NULL Nil nil true false nullptr"),
  isReservedIdentifier: M,
  hooks: {
    "#": m,
    "*": C,
    u: g,
    U: g,
    L: g,
    R: g,
    0: f,
    1: f,
    2: f,
    3: f,
    4: f,
    5: f,
    6: f,
    7: f,
    8: f,
    9: f,
    token: function(e, t, n) {
      if (n == "variable" && e.peek() == "(" && (t.prevToken == ";" || t.prevToken == null || t.prevToken == "}") && Y(e.current()))
        return "def";
    }
  },
  namespaceSeparator: "::"
}), Ne = h({
  keywords: r("base break clone continue const default delete enum extends function in class foreach local resume return this throw typeof yield constructor instanceof static"),
  types: I,
  blockKeywords: r("case catch class else for foreach if switch try while"),
  defKeywords: r("function local class"),
  typeFirstDefinitions: !0,
  atoms: r("true false null"),
  hooks: { "#": m }
});
var L = null;
function ee(e) {
  return function(t, n) {
    for (var l = !1, s, d = !1; !t.eol(); ) {
      if (!l && t.match('"') && (e == "single" || t.match('""'))) {
        d = !0;
        break;
      }
      if (!l && t.match("``")) {
        L = ee(e), d = !0;
        break;
      }
      s = t.next(), l = e == "single" && !l && s == "\\";
    }
    return d && (n.tokenize = null), "string";
  };
}
const De = h({
  keywords: r("abstracts alias assembly assert assign break case catch class continue dynamic else exists extends finally for function given if import in interface is let module new nonempty object of out outer package return satisfies super switch then this throw try value void while"),
  types: function(e) {
    var t = e.charAt(0);
    return t === t.toUpperCase() && t !== t.toLowerCase();
  },
  blockKeywords: r("case catch class dynamic else finally for function if interface module new object switch try while"),
  defKeywords: r("class dynamic function interface module object package value"),
  builtin: r("abstract actual aliased annotation by default deprecated doc final formal late license native optional sealed see serializable shared suppressWarnings tagged throws variable"),
  isPunctuationChar: /[\[\]{}\(\),;\:\.`]/,
  isOperatorChar: /[+\-*&%=<>!?|^~:\/]/,
  numberStart: /[\d#$]/,
  number: /^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,
  multiLineStrings: !0,
  typeFirstDefinitions: !0,
  atoms: r("true false null larger smaller equal empty finished"),
  indentSwitch: !1,
  styleDefs: !1,
  hooks: {
    "@": function(e) {
      return e.eatWhile(/[\w\$_]/), "meta";
    },
    '"': function(e, t) {
      return t.tokenize = ee(e.match('""') ? "triple" : "single"), t.tokenize(e, t);
    },
    "`": function(e, t) {
      return !L || !e.match("`") ? !1 : (t.tokenize = L, L = null, t.tokenize(e, t));
    },
    "'": function(e) {
      return e.eatWhile(/[\w\$_\xa1-\uffff]/), "atom";
    },
    token: function(e, t, n) {
      if ((n == "variable" || n == "type") && t.prevToken == ".")
        return "variableName.special";
    }
  },
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', '"""'] }
  }
});
function pe(e) {
  (e.interpolationStack || (e.interpolationStack = [])).push(e.tokenize);
}
function te(e) {
  return (e.interpolationStack || (e.interpolationStack = [])).pop();
}
function he(e) {
  return e.interpolationStack ? e.interpolationStack.length : 0;
}
function P(e, t, n, l) {
  var s = !1;
  if (t.eat(e))
    if (t.eat(e))
      s = !0;
    else
      return "string";
  function d(b, _) {
    for (var w = !1; !b.eol(); ) {
      if (!l && !w && b.peek() == "$")
        return pe(_), _.tokenize = ye, "string";
      var y = b.next();
      if (y == e && !w && (!s || b.match(e + e))) {
        _.tokenize = null;
        break;
      }
      w = !l && !w && y == "\\";
    }
    return "string";
  }
  return n.tokenize = d, d(t, n);
}
function ye(e, t) {
  return e.eat("$"), e.eat("{") ? t.tokenize = null : t.tokenize = ke, null;
}
function ke(e, t) {
  return e.eatWhile(/[\w_]/), t.tokenize = te(t), "variable";
}
const Le = h({
  keywords: r("this super static final const abstract class extends external factory implements mixin get native set typedef with enum throw rethrow assert break case continue default in return new deferred async await covariant try catch finally do else for if switch while import library export part of show hide is as extension on yield late required"),
  blockKeywords: r("try catch finally do else for if switch while"),
  builtin: r("void bool num int double dynamic var String Null Never"),
  atoms: r("true false null"),
  hooks: {
    "@": function(e) {
      return e.eatWhile(/[\w\$_\.]/), "meta";
    },
    "'": function(e, t) {
      return P("'", e, t, !1);
    },
    '"': function(e, t) {
      return P('"', e, t, !1);
    },
    r: function(e, t) {
      var n = e.peek();
      return n == "'" || n == '"' ? P(e.next(), e, t, !0) : !1;
    },
    "}": function(e, t) {
      return he(t) > 0 ? (t.tokenize = te(t), null) : !1;
    },
    "/": function(e, t) {
      return e.eat("*") ? (t.tokenize = S(1), t.tokenize(e, t)) : !1;
    },
    token: function(e, t, n) {
      if (n == "variable") {
        var l = RegExp("^[_$]*[A-Z][a-zA-Z0-9_$]*$", "g");
        if (l.test(e.current()))
          return "type";
      }
    }
  }
});
export {
  ge as c,
  De as ceylon,
  h as clike,
  me as cpp,
  we as csharp,
  Le as dart,
  be as java,
  _e as kotlin,
  Se as nesC,
  Te as objectiveC,
  Ie as objectiveCpp,
  ve as scala,
  xe as shader,
  Ne as squirrel
};