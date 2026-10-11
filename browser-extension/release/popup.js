"use strict";(()=>{var eg=Object.create;var td=Object.defineProperty;var tg=Object.getOwnPropertyDescriptor;var ng=Object.getOwnPropertyNames;var og=Object.getPrototypeOf,ag=Object.prototype.hasOwnProperty;var st=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var lg=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of ng(t))!ag.call(e,a)&&a!==n&&td(e,a,{get:()=>t[a],enumerable:!(o=tg(t,a))||o.enumerable});return e};var ae=(e,t,n)=>(n=e!=null?eg(og(e)):{},lg(t||!e||!e.__esModule?td(n,"default",{value:e,enumerable:!0}):n,e));var Td=st(E=>{"use strict";var Fc=Symbol.for("react.transitional.element"),dg=Symbol.for("react.portal"),fg=Symbol.for("react.fragment"),sg=Symbol.for("react.strict_mode"),bg=Symbol.for("react.profiler"),pg=Symbol.for("react.consumer"),vg=Symbol.for("react.context"),gg=Symbol.for("react.forward_ref"),mg=Symbol.for("react.suspense"),hg=Symbol.for("react.memo"),gd=Symbol.for("react.lazy"),yg=Symbol.for("react.activity"),xg=Symbol.for("react.view_transition"),sd=Symbol.iterator;function kg(e){return e===null||typeof e!="object"?null:(e=sd&&e[sd]||e["@@iterator"],typeof e=="function"?e:null)}var md={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},hd=Object.assign,yd={};function Pn(e,t,n){this.props=e,this.context=t,this.refs=yd,this.updater=n||md}Pn.prototype.isReactComponent={};Pn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Pn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function xd(){}xd.prototype=Pn.prototype;function Wc(e,t,n){this.props=e,this.context=t,this.refs=yd,this.updater=n||md}var $c=Wc.prototype=new xd;$c.constructor=Wc;hd($c,Pn.prototype);$c.isPureReactComponent=!0;var bd=Array.isArray;function Jc(){}var K={H:null,A:null,T:null,S:null},kd=Object.prototype.hasOwnProperty;function Ic(e,t,n){var o=n.ref;return{$$typeof:Fc,type:e,key:t,ref:o!==void 0?o:null,props:n}}function Sg(e,t){return Ic(e.type,t,e.props)}function Pc(e){return typeof e=="object"&&e!==null&&e.$$typeof===Fc}function wg(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var pd=/\/+/g;function Kc(e,t){return typeof e=="object"&&e!==null&&e.key!=null?wg(""+e.key):t.toString(36)}function Tg(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Jc,Jc):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function In(e,t,n,o,a){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var c=!1;if(e===null)c=!0;else switch(l){case"bigint":case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case Fc:case dg:c=!0;break;case gd:return c=e._init,In(c(e._payload),t,n,o,a)}}if(c)return a=a(e),c=o===""?"."+Kc(e,0):o,bd(a)?(n="",c!=null&&(n=c.replace(pd,"$&/")+"/"),In(a,t,n,"",function(d){return d})):a!=null&&(Pc(a)&&(a=Sg(a,n+(a.key==null||e&&e.key===a.key?"":(""+a.key).replace(pd,"$&/")+"/")+c)),t.push(a)),1;c=0;var i=o===""?".":o+":";if(bd(e))for(var r=0;r<e.length;r++)o=e[r],l=i+Kc(o,r),c+=In(o,t,n,l,a);else if(r=kg(e),typeof r=="function")for(e=r.call(e),r=0;!(o=e.next()).done;)o=o.value,l=i+Kc(o,r++),c+=In(o,t,n,l,a);else if(l==="object"){if(typeof e.then=="function")return In(Tg(e),t,n,o,a);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return c}function al(e,t,n){if(e==null)return e;var o=[],a=0;return In(e,o,"","",function(l){return t.call(n,l,a++)}),o}function zg(e){if(e._status===-1){var t=e._result,n=t();n.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,n.status===void 0&&(n.status="fulfilled",n.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,n.status===void 0&&(n.status="rejected",n.reason=o))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var vd=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function Sd(e){var t=K.T,n={};n.types=t!==null?t.types:null,K.T=n;try{var o=e(),a=K.S;a!==null&&a(n,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(Jc,vd)}catch(l){vd(l)}finally{t!==null&&n.types!==null&&(t.types=n.types),K.T=t}}function wd(e){var t=K.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else Sd(wd.bind(null,e))}var Eg={map:al,forEach:function(e,t,n){al(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return al(e,function(){t++}),t},toArray:function(e){return al(e,function(t){return t})||[]},only:function(e){if(!Pc(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};E.Activity=yg;E.Children=Eg;E.Component=Pn;E.Fragment=fg;E.Profiler=bg;E.PureComponent=Wc;E.StrictMode=sg;E.Suspense=mg;E.ViewTransition=xg;E.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=K;E.__COMPILER_RUNTIME={__proto__:null,c:function(e){return K.H.useMemoCache(e)}};E.addTransitionType=wd;E.cache=function(e){return function(){return e.apply(null,arguments)}};E.cacheSignal=function(){return null};E.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=hd({},e.props),a=e.key;if(t!=null)for(l in t.key!==void 0&&(a=""+t.key),t)!kd.call(t,l)||l==="key"||l==="__self"||l==="__source"||l==="ref"&&t.ref===void 0||(o[l]=t[l]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var c=Array(l),i=0;i<l;i++)c[i]=arguments[i+2];o.children=c}return Ic(e.type,a,o)};E.createContext=function(e){return e={$$typeof:vg,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:pg,_context:e},e};E.createElement=function(e,t,n){var o,a={},l=null;if(t!=null)for(o in t.key!==void 0&&(l=""+t.key),t)kd.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(a[o]=t[o]);var c=arguments.length-2;if(c===1)a.children=n;else if(1<c){for(var i=Array(c),r=0;r<c;r++)i[r]=arguments[r+2];a.children=i}if(e&&e.defaultProps)for(o in c=e.defaultProps,c)a[o]===void 0&&(a[o]=c[o]);return Ic(e,l,a)};E.createRef=function(){return{current:null}};E.forwardRef=function(e){return{$$typeof:gg,render:e}};E.isValidElement=Pc;E.lazy=function(e){return{$$typeof:gd,_payload:{_status:-1,_result:e},_init:zg}};E.memo=function(e,t){return{$$typeof:hg,type:e,compare:t===void 0?null:t}};E.startTransition=Sd;E.unstable_useCacheRefresh=function(){return K.H.useCacheRefresh()};E.use=function(e){return K.H.use(e)};E.useActionState=function(e,t,n){return K.H.useActionState(e,t,n)};E.useCallback=function(e,t){return K.H.useCallback(e,t)};E.useContext=function(e){return K.H.useContext(e)};E.useDebugValue=function(){};E.useDeferredValue=function(e,t){return K.H.useDeferredValue(e,t)};E.useEffect=function(e,t){return K.H.useEffect(e,t)};E.useEffectEvent=function(e){return K.H.useEffectEvent(e)};E.useId=function(){return K.H.useId()};E.useImperativeHandle=function(e,t,n){return K.H.useImperativeHandle(e,t,n)};E.useInsertionEffect=function(e,t){return K.H.useInsertionEffect(e,t)};E.useLayoutEffect=function(e,t){return K.H.useLayoutEffect(e,t)};E.useMemo=function(e,t){return K.H.useMemo(e,t)};E.useOptimistic=function(e,t){return K.H.useOptimistic(e,t)};E.useReducer=function(e,t,n){return K.H.useReducer(e,t,n)};E.useRef=function(e){return K.H.useRef(e)};E.useState=function(e){return K.H.useState(e)};E.useSyncExternalStore=function(e,t,n){return K.H.useSyncExternalStore(e,t,n)};E.useTransition=function(){return K.H.useTransition()};E.version="19.3.0"});var Xt=st((ny,zd)=>{"use strict";zd.exports=Td()});var Ad=st(ll=>{"use strict";var Ng=Symbol.for("react.transitional.element"),Ag=Symbol.for("react.fragment");function Nd(e,t,n){var o=null;if(n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:Ng,type:e,key:o,ref:t!==void 0?t:null,props:n}}ll.Fragment=Ag;ll.jsx=Nd;ll.jsxs=Nd});var Ee=st((ly,_d)=>{"use strict";_d.exports=Ad()});var Gd=st($=>{"use strict";function ci(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,a=e[o];if(0<cl(a,t))e[o]=t,e[n]=a,n=o;else break e}}function bt(e){return e.length===0?null:e[0]}function rl(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,a=e.length,l=a>>>1;o<l;){var c=2*(o+1)-1,i=e[c],r=c+1,d=e[r];if(0>cl(i,n))r<a&&0>cl(d,i)?(e[o]=d,e[r]=n,o=r):(e[o]=i,e[c]=n,o=c);else if(r<a&&0>cl(d,n))e[o]=d,e[r]=n,o=r;else break e}}return t}function cl(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}$.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Md=performance,$.unstable_now=function(){return Md.now()}):(oi=Date,Dd=oi.now(),$.unstable_now=function(){return oi.now()-Dd});var Md,oi,Dd,Nt=[],Kt=[],Cg=1,We=null,we=3,ii=!1,Po=!1,ea=!1,ri=!1,Bd=typeof setTimeout=="function"?setTimeout:null,Hd=typeof clearTimeout=="function"?clearTimeout:null,Rd=typeof setImmediate<"u"?setImmediate:null;function il(e){for(var t=bt(Kt);t!==null;){if(t.callback===null)rl(Kt);else if(t.startTime<=e)rl(Kt),t.sortIndex=t.expirationTime,ci(Nt,t);else break;t=bt(Kt)}}function ui(e){if(ea=!1,il(e),!Po)if(bt(Nt)!==null)Po=!0,no||(no=!0,to());else{var t=bt(Kt);t!==null&&di(ui,t.startTime-e)}}var no=!1,ta=-1,qd=5,Yd=-1;function jd(){return ri?!0:!($.unstable_now()-Yd<qd)}function ai(){if(ri=!1,no){var e=$.unstable_now();Yd=e;var t=!0;try{e:{Po=!1,ea&&(ea=!1,Hd(ta),ta=-1),ii=!0;var n=we;try{t:{for(il(e),We=bt(Nt);We!==null&&!(We.expirationTime>e&&jd());){var o=We.callback;if(typeof o=="function"){We.callback=null,we=We.priorityLevel;var a=o(We.expirationTime<=e);if(e=$.unstable_now(),typeof a=="function"){We.callback=a,il(e),t=!0;break t}We===bt(Nt)&&rl(Nt),il(e)}else rl(Nt);We=bt(Nt)}if(We!==null)t=!0;else{var l=bt(Kt);l!==null&&di(ui,l.startTime-e),t=!1}}break e}finally{We=null,we=n,ii=!1}t=void 0}}finally{t?to():no=!1}}}var to;typeof Rd=="function"?to=function(){Rd(ai)}:typeof MessageChannel<"u"?(li=new MessageChannel,Ud=li.port2,li.port1.onmessage=ai,to=function(){Ud.postMessage(null)}):to=function(){Bd(ai,0)};var li,Ud;function di(e,t){ta=Bd(function(){e($.unstable_now())},t)}$.unstable_IdlePriority=5;$.unstable_ImmediatePriority=1;$.unstable_LowPriority=4;$.unstable_NormalPriority=3;$.unstable_Profiling=null;$.unstable_UserBlockingPriority=2;$.unstable_cancelCallback=function(e){e.callback=null};$.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):qd=0<e?Math.floor(1e3/e):5};$.unstable_getCurrentPriorityLevel=function(){return we};$.unstable_next=function(e){switch(we){case 1:case 2:case 3:var t=3;break;default:t=we}var n=we;we=t;try{return e()}finally{we=n}};$.unstable_requestPaint=function(){ri=!0};$.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=we;we=e;try{return t()}finally{we=n}};$.unstable_scheduleCallback=function(e,t,n){var o=$.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=n+a,e={id:Cg++,callback:t,priorityLevel:e,startTime:n,expirationTime:a,sortIndex:-1},n>o?(e.sortIndex=n,ci(Kt,e),bt(Nt)===null&&e===bt(Kt)&&(ea?(Hd(ta),ta=-1):ea=!0,di(ui,n-o))):(e.sortIndex=a,ci(Nt,e),Po||ii||(Po=!0,no||(no=!0,to()))),e};$.unstable_shouldYield=jd;$.unstable_wrapCallback=function(e){var t=we;return function(){var n=we;we=t;try{return e.apply(this,arguments)}finally{we=n}}}});var Vd=st((sy,Ld)=>{"use strict";Ld.exports=Gd()});var Zd=st(Te=>{"use strict";var Mg=Xt();function Xd(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Jt(){}var Oe={d:{f:Jt,r:function(){throw Error(Xd(522))},D:Jt,C:Jt,L:Jt,m:Jt,X:Jt,S:Jt,M:Jt},p:0,findDOMNode:null},Dg=Symbol.for("react.portal"),Rg=Symbol.for("react.recoverable"),Qd=Symbol.for("react.optimistic_key");function Ug(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Dg,key:o==null?null:o===Qd?Qd:""+o,children:e,containerInfo:t,implementation:n}}var na=Mg.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function ul(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Te.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Oe;Te.browser=function(e){return{$$typeof:Rg,_reason:e}};Te.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(Xd(299));return Ug(e,t,null,n)};Te.flushSync=function(e){var t=na.T,n=Oe.p;try{if(na.T=null,Oe.p=2,e)return e()}finally{na.T=t,Oe.p=n,Oe.d.f()}};Te.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Oe.d.C(e,t))};Te.prefetchDNS=function(e){typeof e=="string"&&Oe.d.D(e)};Te.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,o=ul(n,t.crossOrigin),a=typeof t.integrity=="string"?t.integrity:void 0,l=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Oe.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:o,integrity:a,fetchPriority:l}):n==="script"&&Oe.d.X(e,{crossOrigin:o,integrity:a,fetchPriority:l,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Te.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=ul(t.as,t.crossOrigin);Oe.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}}else t==null&&Oe.d.M(e)};Te.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,o=ul(n,t.crossOrigin);Oe.d.L(e,n,{crossOrigin:o,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Te.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=ul(t.as,t.crossOrigin);Oe.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}else Oe.d.m(e)};Te.requestFormReset=function(e){Oe.d.r(e)};Te.unstable_batchedUpdates=function(e,t){return e(t)};Te.useFormState=function(e,t,n){return na.H.useFormState(e,t,n)};Te.useFormStatus=function(){return na.H.useHostTransitionStatus()};Te.version="19.3.0"});var Fd=st((py,Jd)=>{"use strict";function Kd(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Kd)}catch(e){console.error(e)}}Kd(),Jd.exports=Zd()});var Bv=st(Qc=>{"use strict";var fe=Vd(),Us=Xt(),Bg=Fd();function h(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Bs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Va(e){for(var t=e,n=t;n&&!n.alternate;)t=n,(t.flags&4098)!==0&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function Hs(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function qs(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Wd(e){if(Va(e)!==e)throw Error(h(188))}function Hg(e){var t=e.alternate;if(!t){if(t=Va(e),t===null)throw Error(h(188));return t!==e?null:e}for(var n=e,o=t;;){var a=n.return;if(a===null)break;var l=a.alternate;if(l===null){if(o=a.return,o!==null){n=o;continue}break}if(a.child===l.child){for(l=a.child;l;){if(l===n)return Wd(a),e;if(l===o)return Wd(a),t;l=l.sibling}throw Error(h(188))}if(n.return!==o.return)n=a,o=l;else{for(var c=!1,i=a.child;i;){if(i===n){c=!0,n=a,o=l;break}if(i===o){c=!0,o=a,n=l;break}i=i.sibling}if(!c){for(i=l.child;i;){if(i===n){c=!0,n=l,o=a;break}if(i===o){c=!0,o=l,n=a;break}i=i.sibling}if(!c)throw Error(h(189))}}if(n.alternate!==o)throw Error(h(190))}if(n.tag!==3)throw Error(h(188));return n.stateNode.current===n?e:t}function Ys(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Ys(e),t!==null)return t;e=e.sibling}return null}function He(e,t,n,o,a,l){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,o,a,l)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&He(e.child,t,n,o,a,l))return!0;e=e.sibling}return!1}function Kn(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function $d(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return t}function js(e){var t=[null,null],n=Kn(e);return n===null||Gs(t,e,n.child,{foundSelf:!1}),t}function Gs(e,t,n,o){for(;n!==null;){if(n===t)o.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(o.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&Gs(e,t,n.child,o))return!0;n=n.sibling}return!1}function de(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(h(559))}}var uo=null,Li=null;function qg(e,t,n){return e===n?!0:e===t?(uo=e,!0):!1}function Yg(e,t,n){return e===n?(Li=e,!1):e===t?(Li!==null&&(uo=e),!0):!1}function Id(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function Vi(e,t,n){for(var o=0,a=e;a;a=n(a))o++;a=0;for(var l=t;l;l=n(l))a++;for(;0<o-a;)e=n(e),o--;for(;0<a-o;)t=n(t),a--;for(;o--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var Z=Object.assign,jg=Symbol.for("react.element"),dl=Symbol.for("react.transitional.element"),ua=Symbol.for("react.portal"),fo=Symbol.for("react.fragment"),Ls=Symbol.for("react.strict_mode"),Qi=Symbol.for("react.profiler"),Vs=Symbol.for("react.consumer"),yt=Symbol.for("react.context"),Pr=Symbol.for("react.forward_ref"),Xi=Symbol.for("react.suspense"),Zi=Symbol.for("react.suspense_list"),eu=Symbol.for("react.memo"),It=Symbol.for("react.lazy"),Ki=Symbol.for("react.activity"),Gg=Symbol.for("react.legacy_hidden"),Lg=Symbol.for("react.memo_cache_sentinel"),Ji=Symbol.for("react.view_transition"),Vg=Symbol.for("react.recoverable"),Pd=Symbol.iterator;function oa(e){return e===null||typeof e!="object"?null:(e=Pd&&e[Pd]||e["@@iterator"],typeof e=="function"?e:null)}var Qg=Symbol.for("react.client.reference");function Fi(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Qg?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case fo:return"Fragment";case Qi:return"Profiler";case Ls:return"StrictMode";case Xi:return"Suspense";case Zi:return"SuspenseList";case Ki:return"Activity";case Ji:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case ua:return"Portal";case yt:return e.displayName||"Context";case Vs:return(e._context.displayName||"Context")+".Consumer";case Pr:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case eu:return t=e.displayName||null,t!==null?t:Fi(e.type)||"Memo";case It:t=e._payload,e=e._init;try{return Fi(e(t))}catch{}}return null}var da=Array.isArray,z=Us.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Y=Bg.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Rn={pending:!1,data:null,method:null,action:null},Wi=[],so=-1;function Et(e){return{current:e}}function ye(e){0>so||(e.current=Wi[so],Wi[so]=null,so--)}function W(e,t){so++,Wi[so]=e.current,e.current=t}var wt=Et(null),Oa=Et(null),rn=Et(null),Wl=Et(null);function $l(e,t){switch(W(rn,t),W(Oa,e),W(wt,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?ps(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=ps(t),e=fv(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}ye(wt),W(wt,e)}function Mo(){ye(wt),ye(Oa),ye(rn)}function $i(e){var t=e.memoizedState;t!==null&&(Lo._currentValue=t.memoizedState,W(Wl,e)),t=wt.current;var n=fv(t,e.type);t!==n&&(W(Oa,e),W(wt,n))}function Il(e){Oa.current===e&&(ye(wt),ye(Oa)),Wl.current===e&&(ye(Wl),Lo._currentValue=Rn)}var fi,ef;function Wt(e){if(fi===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);fi=t&&t[1]||"",ef=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+fi+e+ef}var si=!1;function bi(e,t){if(!e||si)return"";si=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var g=function(){throw Error()};if(Object.defineProperty(g.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(g,[])}catch(y){var f=y}Reflect.construct(e,[],g)}else{try{g.call()}catch(y){f=y}g=!1;try{var b=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),g=!0,new e}finally{g&&(b!==void 0?Object.defineProperty(e.prototype,"props",b):delete e.prototype.props)}}}else{try{throw Error()}catch(y){f=y}(g=e())&&typeof g.catch=="function"&&g.catch(function(){})}}catch(y){if(y&&f&&typeof y.stack=="string")return[y.stack,f.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=o.DetermineComponentFrameRoot(),c=l[0],i=l[1];if(c&&i){var r=c.split(`
`),d=i.split(`
`);for(a=o=0;o<r.length&&!r[o].includes("DetermineComponentFrameRoot");)o++;for(;a<d.length&&!d[a].includes("DetermineComponentFrameRoot");)a++;if(o===r.length||a===d.length)for(o=r.length-1,a=d.length-1;1<=o&&0<=a&&r[o]!==d[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==d[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==d[a]){var p=`
`+r[o].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=o&&0<=a);break}}}finally{si=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?Wt(n):""}function Xg(e,t){switch(e.tag){case 26:case 27:case 5:return Wt(e.type);case 16:return Wt("Lazy");case 13:return e.child!==t&&t!==null?Wt("Suspense Fallback"):Wt("Suspense");case 19:return Wt("SuspenseList");case 0:case 15:return bi(e.type,!1);case 11:return bi(e.type.render,!1);case 1:return bi(e.type,!0);case 31:return Wt("Activity");case 30:return Wt("ViewTransition");default:return""}}function tf(e){try{var t="",n=null;do t+=Xg(e,n),n=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var Ii=Object.prototype.hasOwnProperty,tu=fe.unstable_scheduleCallback,pi=fe.unstable_cancelCallback,Zg=fe.unstable_shouldYield,Kg=fe.unstable_requestPaint,Qe=fe.unstable_now,Jg=fe.unstable_getCurrentPriorityLevel,Qs=fe.unstable_ImmediatePriority,Xs=fe.unstable_UserBlockingPriority,Pl=fe.unstable_NormalPriority,Fg=fe.unstable_LowPriority,Zs=fe.unstable_IdlePriority,Wg=fe.log,$g=fe.unstable_setDisableYieldValue,Qa=null,Xe=null;function tn(e){if(typeof Wg=="function"&&$g(e),Xe&&typeof Xe.setStrictMode=="function")try{Xe.setStrictMode(Qa,e)}catch{}}var Ze=Math.clz32?Math.clz32:em,Ig=Math.log,Pg=Math.LN2;function em(e){return e>>>=0,e===0?32:31-(Ig(e)/Pg|0)|0}var fl=256,sl=262144,bl=4194304;function An(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function zc(e,t,n){var o=e.pendingLanes;if(o===0)return 0;var a=0,l=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var i=o&134217727;return i!==0?(o=i&~l,o!==0?a=An(o):(c&=i,c!==0?a=An(c):n||(n=i&~e,n!==0&&(a=An(n))))):(i=o&~l,i!==0?a=An(i):c!==0?a=An(c):n||(n=o&~e,n!==0&&(a=An(n)))),a===0?0:t!==0&&t!==a&&(t&l)===0&&(l=a&-a,n=t&-t,l>=n||l===32&&(n&4194048)!==0)?t:a}function Xa(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Ks(e,t){(t&8)!==0&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var o=31-Ze(n),a=1<<o;t|=e[o],n&=~a}return t}function tm(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Js(){var e=bl;return bl<<=1,(bl&62914560)===0&&(bl=4194304),e}function vi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Za(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function nm(e,t,n,o,a,l){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var i=e.entanglements,r=e.expirationTimes,d=e.hiddenUpdates;for(n=c&~n;0<n;){var p=31-Ze(n),g=1<<p;i[p]=0,r[p]=-1;var f=d[p];if(f!==null)for(d[p]=null,p=0;p<f.length;p++){var b=f[p];b!==null&&(b.lane&=-536870913)}n&=~g}o!==0&&Fs(e,o,0),l!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=l&~(c&~t))}function Fs(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-Ze(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|n&261930}function Ws(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-Ze(n),a=1<<o;a&t|e[o]&t&&(e[o]|=t),n&=~a}}function $s(e,t){var n=t&-t;return n=(n&42)!==0?1:nu(n),(n&(e.suspendedLanes|t))!==0?0:n}function nu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ou(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Is(){var e=Y.p;return e!==0?e:(e=window.event,e===void 0?32:Dv(e.type))}function nf(e,t){var n=Y.p;try{return Y.p=e,t()}finally{Y.p=n}}var Gt=Math.random().toString(36).slice(2),me="__reactFiber$"+Gt,qe="__reactProps$"+Gt,Xo="__reactContainer$"+Gt,of="__reactEvents$"+Gt,om="__reactListeners$"+Gt,am="__reactHandles$"+Gt,af="__reactResources$"+Gt,Ka="__reactMarker$"+Gt,ec="__reactLoad$"+Gt;function Ec(e){delete e[me],delete e[qe],delete e[om],delete e[am]}function Mn(e){var t;if(t=e[me])return t;for(var n=e.parentNode;n;){if(t=n[Xo]||n[me]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Ss(e);e!==null;){if(n=e[me])return n;e=Ss(e)}return t}e=n,n=e.parentNode}return null}function Zo(e){if(e=e[me]||e[Xo]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function fa(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(h(33))}function So(e){var t=e[af];return t||(t=e[af]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function pe(e){e[Ka]=!0}function Ps(e){e[ec]=void 0}var eb=new Set,tb={};function Jn(e,t){Do(e,t),Do(e+"Capture",t)}function Do(e,t){for(tb[e]=t,e=0;e<t.length;e++)eb.add(t[e])}var lm=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),lf={},cf={};function cm(e){return Ii.call(cf,e)?!0:Ii.call(lf,e)?!1:lm.test(e)?cf[e]=!0:(lf[e]=!0,!1)}var U=!1;function rf(){var e=U;return U=!1,e}function Cl(e,t,n){if(cm(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,n)}}function pl(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,n)}}function At(e,t,n,o){if(o===null)e.removeAttribute(n);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,o)}}function je(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function nb(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function im(e,t,n){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var a=o.get,l=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,l.call(this,c)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Pi(e){if(!e._valueTracker){var t=nb(e)?"checked":"value";e._valueTracker=im(e,t,""+e[t])}}function ob(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=nb(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}var rm=/[\n"\\]/g;function tt(e){return e.replace(rm,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function er(e,t,n,o,a,l,c,i){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+je(t)):e.value!==""+je(t)&&(e.value=""+je(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?c==="number"&&e.value==t?gi(e,je(e.value)):gi(e,je(t)):n!=null?gi(e,je(n)):o!=null&&e.removeAttribute("value"),a==null&&l!=null&&(e.defaultChecked=!!l),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"?e.name=""+je(i):e.removeAttribute("name")}function ab(e,t,n,o,a,l,c,i){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),t!=null||n!=null){if(!(l!=="submit"&&l!=="reset"||t!=null)){Pi(e);return}n=n!=null?""+je(n):"",t=t!=null?""+je(t):n,i||t===e.value||(e.value=t),e.defaultValue=t}o=o??a,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=i?e.checked:!!o,e.defaultChecked=!!o,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),Pi(e)}function gi(e,t){e.defaultValue!==""+t&&(e.defaultValue=""+t)}function wo(e,t,n,o){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&o&&(e[n].defaultSelected=!0)}else{for(n=""+je(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function lb(e,t,n){if(t!=null&&(t=""+je(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+je(n):""}function cb(e,t,n,o){if(t==null){if(o!=null){if(n!=null)throw Error(h(92));if(da(o)){if(1<o.length)throw Error(h(93));o=o[0]}n=o}n==null&&(n=""),t=n}n=je(t),e.defaultValue=n,o=e.textContent,o===n&&o!==""&&o!==null&&(e.value=o),Pi(e)}function Ro(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var um=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function uf(e,t,n){var o=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,n):typeof n!="number"||n===0||um.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function ib(e,t,n){if(t!=null&&typeof t!="object")throw Error(h(62));if(e=e.style,n!=null){for(var o in n)!n.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="",U=!0);for(var a in t)o=t[a],t.hasOwnProperty(a)&&n[a]!==o&&(uf(e,a,o),U=!0)}else for(var l in t)t.hasOwnProperty(l)&&uf(e,l,t[l])}function au(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var dm=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),fm=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ml(e){return fm.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function xt(){}var tr=null;function lu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var bo=null,To=null;function df(e){var t=Zo(e);if(t&&(e=t.stateNode)){var n=e[qe]||null;e:switch(e=t.stateNode,t.type){case"input":if(er(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+tt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=o[qe]||null;if(!a)throw Error(h(90));er(o,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)o=n[t],o.form===e.form&&ob(o)}break e;case"textarea":lb(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&wo(e,!!n.multiple,t,!1)}}}var mi=!1;function rb(e,t,n){if(mi)return e(t,n);mi=!0;try{var o=e(t);return o}finally{if(mi=!1,(bo!==null||To!==null)&&(jc(),bo&&(t=bo,e=To,To=bo=null,df(t),e)))for(t=0;t<e.length;t++)df(e[t])}}function Na(e,t){var n=e.stateNode;if(n===null)return null;var o=n[qe]||null;if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(h(231,t,typeof n));return n}var Ut=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),nr=!1;if(Ut)try{oo={},Object.defineProperty(oo,"passive",{get:function(){nr=!0}}),window.addEventListener("test",oo,oo),window.removeEventListener("test",oo,oo)}catch{nr=!1}var oo,nn=null,cu=null,Dl=null;function ub(){if(Dl)return Dl;var e,t=cu,n=t.length,o,a="value"in nn?nn.value:nn.textContent,l=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===a[l-o];o++);return Dl=a.slice(e,1<o?1-o:void 0)}function Rl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function vl(){return!0}function ff(){return!1}function Ce(e){function t(n,o,a,l,c){this._reactName=n,this._targetInst=a,this.type=o,this.nativeEvent=l,this.target=c,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?vl:ff,this.isPropagationStopped=ff,this}return Z(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=vl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=vl)},persist:function(){},isPersistent:vl}),t}var wn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Oc=Ce(wn),Ja=Z({},wn,{view:0,detail:0}),sm=Ce(Ja),hi,yi,aa,Nc=Z({},Ja,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:iu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==aa&&(aa&&e.type==="mousemove"?(hi=e.screenX-aa.screenX,yi=e.screenY-aa.screenY):yi=hi=0,aa=e),hi)},movementY:function(e){return"movementY"in e?e.movementY:yi}}),sf=Ce(Nc),bm=Z({},Nc,{dataTransfer:0}),pm=Ce(bm),vm=Z({},Ja,{relatedTarget:0}),xi=Ce(vm),gm=Z({},wn,{animationName:0,elapsedTime:0,pseudoElement:0}),mm=Ce(gm),hm=Z({},wn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ym=Ce(hm),xm=Z({},wn,{data:0}),bf=Ce(xm),km={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Sm={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},wm={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Tm(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=wm[e])?!!t[e]:!1}function iu(){return Tm}var zm=Z({},Ja,{key:function(e){if(e.key){var t=km[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Rl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Sm[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:iu,charCode:function(e){return e.type==="keypress"?Rl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Rl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Em=Ce(zm),Om=Z({},Nc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),pf=Ce(Om),Nm=Z({},wn,{submitter:0}),Am=Ce(Nm),_m=Z({},Ja,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:iu}),Cm=Ce(_m),Mm=Z({},wn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Dm=Ce(Mm),Rm=Z({},Nc,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Um=Ce(Rm),Bm=Z({},wn,{newState:0,oldState:0,source:0}),Hm=Ce(Bm),qm=[9,13,27,32],ru=Ut&&"CompositionEvent"in window,pa=null;Ut&&"documentMode"in document&&(pa=document.documentMode);var Ym=Ut&&"TextEvent"in window&&!pa,db=Ut&&(!ru||pa&&8<pa&&11>=pa),vf=" ",gf=!1;function fb(e,t){switch(e){case"keyup":return qm.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function sb(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var po=!1;function jm(e,t){switch(e){case"compositionend":return sb(t);case"keypress":return t.which!==32?null:(gf=!0,vf);case"textInput":return e=t.data,e===vf&&gf?null:e;default:return null}}function Gm(e,t){if(po)return e==="compositionend"||!ru&&fb(e,t)?(e=ub(),Dl=cu=nn=null,po=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return db&&t.locale!=="ko"?null:t.data;default:return null}}var Lm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function mf(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Lm[e.type]:t==="textarea"}function bb(e,t,n,o){bo?To?To.push(o):To=[o]:bo=o,t=Sc(t,"onChange"),0<t.length&&(n=new Oc("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var va=null,Aa=null;function Vm(e){rv(e,0)}function Ac(e){var t=fa(e);if(ob(t))return e}function hf(e,t){if(e==="change")return t}var pb=!1;Ut&&(Ut?(ml="oninput"in document,ml||(ki=document.createElement("div"),ki.setAttribute("oninput","return;"),ml=typeof ki.oninput=="function"),gl=ml):gl=!1,pb=gl&&(!document.documentMode||9<document.documentMode));var gl,ml,ki;function yf(){va&&(va.detachEvent("onpropertychange",vb),Aa=va=null)}function vb(e){if(e.propertyName==="value"&&Ac(Aa)){var t=[];bb(t,Aa,e,lu(e)),rb(Vm,t)}}function Qm(e,t,n){e==="focusin"?(yf(),va=t,Aa=n,va.attachEvent("onpropertychange",vb)):e==="focusout"&&yf()}function Xm(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ac(Aa)}function Zm(e,t){if(e==="click")return Ac(t)}function Km(e,t){if(e==="input"||e==="change")return Ac(t)}function Jm(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Je=typeof Object.is=="function"?Object.is:Jm;function _a(e,t){if(Je(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var a=n[o];if(!Ii.call(t,a)||!Je(e[a],t[a]))return!1}return!0}function or(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function xf(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function kf(e,t){var n=xf(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=xf(n)}}function gb(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?gb(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function mb(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=or(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=or(e.document)}return t}function uu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Fm=Ut&&"documentMode"in document&&11>=document.documentMode,vo=null,ar=null,ga=null,lr=!1;function Sf(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;lr||vo==null||vo!==or(o)||(o=vo,"selectionStart"in o&&uu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ga&&_a(ga,o)||(ga=o,o=Sc(ar,"onSelect"),0<o.length&&(t=new Oc("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=vo)))}function On(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var go={animationend:On("Animation","AnimationEnd"),animationiteration:On("Animation","AnimationIteration"),animationstart:On("Animation","AnimationStart"),transitionrun:On("Transition","TransitionRun"),transitionstart:On("Transition","TransitionStart"),transitioncancel:On("Transition","TransitionCancel"),transitionend:On("Transition","TransitionEnd")},Si={},hb={};Ut&&(hb=document.createElement("div").style,"AnimationEvent"in window||(delete go.animationend.animation,delete go.animationiteration.animation,delete go.animationstart.animation),"TransitionEvent"in window||delete go.transitionend.transition);function Fn(e){if(Si[e])return Si[e];if(!go[e])return e;var t=go[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in hb)return Si[e]=t[n];return e}var yb=Fn("animationend"),xb=Fn("animationiteration"),kb=Fn("animationstart"),Wm=Fn("transitionrun"),$m=Fn("transitionstart"),Im=Fn("transitioncancel"),Sb=Fn("transitionend"),wb=new Map,cr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");cr.push("scrollEnd");function ft(e,t){wb.set(e,t),Jn(t,[e])}var Pm=0;function Bt(e,t){if(e.name!=null&&e.name!=="auto")return e.name;if(t.autoName!==null)return t.autoName;e=dt.identifierPrefix;var n=Pm++;return e="_"+e+"t_"+n.toString(32)+"_",t.autoName=e}function wf(e){if(e==null||typeof e=="string")return e;var t=null,n=Co;if(n!==null)for(var o=0;o<n.length;o++){var a=e[n[o]];if(a!=null){if(a==="none")return"none";t=t==null?a:t+(" "+a)}}return t??e.default}function Lt(e,t){return e=wf(e),t=wf(t),t==null?e==="auto"?null:e:t==="auto"?null:t}var tc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Ie=[],mo=0,du=0;function _c(){for(var e=mo,t=du=mo=0;t<e;){var n=Ie[t];Ie[t++]=null;var o=Ie[t];Ie[t++]=null;var a=Ie[t];Ie[t++]=null;var l=Ie[t];if(Ie[t++]=null,o!==null&&a!==null){var c=o.pending;c===null?a.next=a:(a.next=c.next,c.next=a),o.pending=a}l!==0&&Tb(n,a,l)}}function Cc(e,t,n,o){Ie[mo++]=e,Ie[mo++]=t,Ie[mo++]=n,Ie[mo++]=o,du|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function fu(e,t,n,o){return Cc(e,t,n,o),nc(e)}function Wn(e,t){return Cc(e,null,null,t),nc(e)}function Tb(e,t,n){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n);for(var a=!1,l=e.return;l!==null;)l.childLanes|=n,o=l.alternate,o!==null&&(o.childLanes|=n),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(a=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,a&&t!==null&&(a=31-Ze(n),e=l.hiddenUpdates,o=e[a],o===null?e[a]=[t]:o.push(t),t.lane=n|536870912),l):null}function nc(e){if(50<Ea)throw Ea=0,Ql=null,Error(h(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ho={};function eh(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ue(e,t,n,o){return new eh(e,t,n,o)}function su(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Dt(e,t){var n=e.alternate;return n===null?(n=Ue(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function zb(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Ul(e,t,n,o,a,l){var c=0;if(o=e,typeof o=="function")su(o)&&(c=1);else if(typeof o=="string")c=E0(e,n,wt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(o){case Ki:return e=Ue(31,n,t,a),e.elementType=Ki,e.lanes=l,e;case fo:return Un(n.children,a,l,t);case Ls:c=8,a|=24;break;case Qi:return e=Ue(12,n,t,a|2),e.elementType=Qi,e.lanes=l,e;case Xi:return e=Ue(13,n,t,a),e.elementType=Xi,e.lanes=l,e;case Zi:return e=Ue(19,n,t,a),e.elementType=Zi,e.lanes=l,e;case Gg:case Ji:return e=a|32,e=Ue(30,n,t,e),e.elementType=Ji,e.lanes=l,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case yt:c=10;break e;case Vs:c=9;break e;case Pr:c=11;break e;case eu:c=14;break e;case It:c=16,o=null;break e}c=29,n=Error(h(130,e===null?"null":typeof e,"")),o=null}return t=Ue(c,n,t,a),t.elementType=e,t.type=o,t.lanes=l,t}function Un(e,t,n,o){return e=Ue(7,e,o,t),e.lanes=n,e}function wi(e,t,n){return e=Ue(6,e,null,t),e.lanes=n,e}function Eb(e){var t=Ue(18,null,null,0);return t.stateNode=e,t}function Ti(e,t,n){return t=Ue(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Tf=new WeakMap;function nt(e,t){if(typeof e=="object"&&e!==null){var n=Tf.get(e);return n!==void 0?n:(t={value:e,source:t,stack:tf(t)},Tf.set(e,t),t)}return{value:e,source:t,stack:tf(t)}}var yo=[],xo=0,oc=null,Ca=0,Pe=[],et=0,hn=null,kt=1,St="";function Ct(e,t){yo[xo++]=Ca,yo[xo++]=oc,oc=e,Ca=t}function Ob(e,t,n){Pe[et++]=kt,Pe[et++]=St,Pe[et++]=hn,hn=e;var o=kt;e=St;var a=32-Ze(o)-1;o&=~(1<<a),n+=1;var l=32-Ze(t)+a;if(30<l){var c=a-a%5;l=(o&(1<<c)-1).toString(32),o>>=c,a-=c,kt=1<<32-Ze(t)+a|n<<a|o,St=l+e}else kt=1<<l|n<<a|o,St=e}function Mc(e){e.return!==null&&(Ct(e,1),Ob(e,1,0))}function bu(e){for(;e===oc;)oc=yo[--xo],yo[xo]=null,Ca=yo[--xo],yo[xo]=null;for(;e===hn;)hn=Pe[--et],Pe[et]=null,St=Pe[--et],Pe[et]=null,kt=Pe[--et],Pe[et]=null}function Nb(e,t){Pe[et++]=kt,Pe[et++]=St,Pe[et++]=hn,kt=t.id,St=t.overflow,hn=e}var ve=null,F=null,N=!1,un=null,ot=!1,ir=Error(h(519));function yn(e){var t=Error(h(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ma(nt(t,e)),ir}function zf(e){var t=e.stateNode,n=e.type,o=e.memoizedProps;switch(t[me]=e,t[qe]=o,n){case"dialog":A("cancel",t),A("close",t);break;case"iframe":case"object":case"embed":A("load",t);break;case"video":case"audio":for(n=0;n<Ba.length;n++)A(Ba[n],t);break;case"source":A("error",t);break;case"img":case"image":case"link":A("error",t),A("load",t);break;case"details":A("toggle",t);break;case"input":A("invalid",t),ab(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":A("invalid",t);break;case"textarea":A("invalid",t),cb(t,o.value,o.defaultValue,o.children)}n=o.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||o.suppressHydrationWarning===!0||dv(t.textContent,n)?(o.popover!=null&&(A("beforetoggle",t),A("toggle",t)),o.onScroll!=null&&A("scroll",t),o.onScrollEnd!=null&&A("scrollend",t),o.onClick!=null&&(t.onclick=xt),t=!0):t=!1,t||yn(e,!0)}function ac(e){for(ve=e.return;ve;)switch(ve.tag){case 5:case 31:case 13:ot=!1;return;case 27:case 3:ot=!0;return;default:ve=ve.return}}function ao(e){if(e!==ve)return!1;if(!N)return ac(e),N=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Xr(e.type,e.memoizedProps)),n=!n),n&&F&&yn(e),ac(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));F=ks(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));F=ks(e)}else t===27?(t=F,Tn(e.type)?(e=Fr,Fr=null,F=e):F=t):F=ve?at(e.stateNode.nextSibling):null;return!0}function Yn(){F=ve=null,N=!1}function zi(){var e=un;return e!==null&&(De===null?De=e:De.push.apply(De,e),un=null),e}function Ma(e){un===null?un=[e]:un.push(e)}var rr=Et(null),$n=null,Mt=null;function on(e,t,n){W(rr,t._currentValue),t._currentValue=n}function Rt(e){e._currentValue=rr.current,ye(rr)}function Bl(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function ur(e,t,n,o){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var l=a.dependencies;if(l!==null){var c=a.child;l=l.firstContext;e:for(;l!==null;){var i=l;l=a;for(var r=0;r<t.length;r++)if(i.context===t[r]){l.lanes|=n,i=l.alternate,i!==null&&(i.lanes|=n),Bl(l.return,n,e),o||(c=null);break e}l=i.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(h(341));c.lanes|=n,l=c.alternate,l!==null&&(l.lanes|=n),Bl(c,n,e),c=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),Bl(a.return,n,e),c=a.child,c=c!==null?c.sibling:null):c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function jn(e,t,n,o){e=null;for(var a=t,l=!1;a!==null;){if(!l){if((a.flags&524288)!==0)l=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(h(387));if(c=c.memoizedProps,c!==null){var i=a.type;Je(a.pendingProps.value,c.value)||(e!==null?e.push(i):e=[i])}}else if(a===Wl.current){if(c=a.alternate,c===null)throw Error(h(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(Lo):e=[Lo])}a=a.return}return e!==null&&ur(t,e,n,o),t.flags|=262144,e!==null}function lc(e){for(e=e.firstContext;e!==null;){if(!Je(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Gn(e){$n=e,Mt=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function he(e){return Ab($n,e)}function hl(e,t){return $n===null&&Gn(e),Ab(e,t)}function Ab(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Mt===null){if(e===null)throw Error(h(308));Mt=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Mt=Mt.next=t;return n}var th=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},nh=fe.unstable_scheduleCallback,oh=fe.unstable_NormalPriority,ce={$$typeof:yt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function pu(){return{controller:new th,data:new Map,refCount:0}}function Fa(e){e.refCount--,e.refCount===0&&nh(oh,function(){e.controller.abort()})}function Ef(e,t){if((e.pendingLanes&4194048)!==0){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var o=t[e];n.indexOf(o)===-1&&n.push(o)}}}var sa=null;function ah(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var ma=null,dr=0,Ln=0,zo=null;function lh(e,t){if(ma===null){var n=ma=[];dr=0,Ln=Lu(),zo={status:"pending",value:void 0,then:function(o){n.push(o)}}}return dr++,t.then(Of,Of),t}function Of(){if(--dr===0&&(sa=null,ma!==null)){zo!==null&&(zo.status="fulfilled");var e=ma;ma=null,Ln=0,zo=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function ch(e,t){var n=[],o={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(o.status="rejected",o.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),o}var Nf=z.S;z.S=function(e,t){if(Kp=Qe(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&lh(e,t),sa!==null)for(var n=Yo;n!==null;)Ef(n,sa),n=n.next;if(n=e.types,n!==null){for(var o=Yo;o!==null;)Ef(o,n),o=o.next;if(Ln!==0){o=sa,o===null&&(o=sa=[]);for(var a=0;a<n.length;a++){var l=n[a];o.indexOf(l)===-1&&o.push(l)}}}Nf!==null&&Nf(e,t)};var Bn=Et(null);function vu(){var e=Bn.current;return e!==null?e:X.pooledCache}function Hl(e,t){t===null?W(Bn,Bn.current):W(Bn,t.pool)}function _b(){var e=vu();return e===null?null:{parent:ce._currentValue,pool:e}}var Ko=Error(h(460)),gu=Error(h(474)),Dc=Error(h(542)),cc={then:function(){}};function Af(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Cb(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(xt,xt),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Cf(e),e===void 0&&!("reason"in t)?Error(h(600)):e;default:if(typeof t.status=="string")t.then(xt,xt);else{if(e=X,e!==null&&100<e.shellSuspendCounter)throw Error(h(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=o}},function(o){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Cf(e),e}throw Hn=t,Ko}}function _n(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Hn=n,Ko):n}}var Hn=null;function _f(){if(Hn===null)throw Error(h(459));var e=Hn;return Hn=null,e}function Cf(e){if(e===Ko||e===Dc)throw Error(h(483))}var Eo=null,Da=0;function yl(e){var t=Da;return Da+=1,Eo===null&&(Eo=[]),Cb(Eo,e,t)}function Ft(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function xl(e,t){throw t.$$typeof===jg?Error(h(525)):(e=Object.prototype.toString.call(t),Error(h(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Mb(e){function t(s,u){if(e){var v=s.deletions;v===null?(s.deletions=[u],s.flags|=16):v.push(u)}}function n(s,u){if(!e)return null;for(;u!==null;)t(s,u),u=u.sibling;return null}function o(s){for(var u=new Map;s!==null;)s.key===null?u.set(s.index,s):u.set(s.key,s),s=s.sibling;return u}function a(s,u){return s=Dt(s,u),s.index=0,s.sibling=null,s}function l(s,u,v){return s.index=v,e?(v=s.alternate,v!==null?(v=v.index,v<u?(s.flags|=2,u):v):(s.flags|=134217730,u)):(s.flags|=1048576,u)}function c(s){return e&&s.alternate===null&&(s.flags|=134217730),s}function i(s,u,v,m){return u===null||u.tag!==6?(u=wi(v,s.mode,m),u.return=s,u):(u=a(u,v),u.return=s,u)}function r(s,u,v,m){var k=v.type;return k===fo?(s=p(s,u,v.props.children,m,v.key),Ft(s,v),s):u!==null&&(u.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===It&&_n(k)===u.type)?(u=a(u,v.props),Ft(u,v),u.return=s,u):(u=Ul(v.type,v.key,v.props,null,s.mode,m),Ft(u,v),u.return=s,u)}function d(s,u,v,m){return u===null||u.tag!==4||u.stateNode.containerInfo!==v.containerInfo||u.stateNode.implementation!==v.implementation?(u=Ti(v,s.mode,m),u.return=s,u):(u=a(u,v.children||[]),u.return=s,u)}function p(s,u,v,m,k){return u===null||u.tag!==7?(u=Un(v,s.mode,m,k),u.return=s,u):(u=a(u,v),u.return=s,u)}function g(s,u,v){if(typeof u=="string"&&u!==""||typeof u=="number"||typeof u=="bigint")return u=wi(""+u,s.mode,v),u.return=s,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case dl:return v=Ul(u.type,u.key,u.props,null,s.mode,v),Ft(v,u),v.return=s,v;case ua:return u=Ti(u,s.mode,v),u.return=s,u;case It:return u=_n(u),g(s,u,v)}if(da(u)||oa(u))return u=Un(u,s.mode,v,null),u.return=s,u;if(typeof u.then=="function")return g(s,yl(u),v);if(u.$$typeof===yt)return g(s,hl(s,u),v);xl(s,u)}return null}function f(s,u,v,m){var k=u!==null?u.key:null;if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return k!==null?null:i(s,u,""+v,m);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case dl:return v.key===k?r(s,u,v,m):null;case ua:return v.key===k?d(s,u,v,m):null;case It:return v=_n(v),f(s,u,v,m)}if(da(v)||oa(v))return k!==null?null:p(s,u,v,m,null);if(typeof v.then=="function")return f(s,u,yl(v),m);if(v.$$typeof===yt)return f(s,u,hl(s,v),m);xl(s,v)}return null}function b(s,u,v,m,k){if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return s=s.get(v)||null,i(u,s,""+m,k);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case dl:return s=s.get(m.key===null?v:m.key)||null,r(u,s,m,k);case ua:return s=s.get(m.key===null?v:m.key)||null,d(u,s,m,k);case It:return m=_n(m),b(s,u,v,m,k)}if(da(m)||oa(m))return s=s.get(v)||null,p(u,s,m,k,null);if(typeof m.then=="function")return b(s,u,v,yl(m),k);if(m.$$typeof===yt)return b(s,u,v,hl(u,m),k);xl(u,m)}return null}function y(s,u,v,m){for(var k=null,C=null,S=u,T=u=0,oe=null;S!==null&&T<v.length;T++){S.index>T?(oe=S,S=null):oe=S.sibling;var D=f(s,S,v[T],m);if(D===null){S===null&&(S=oe);break}e&&S&&D.alternate===null&&t(s,S),u=l(D,u,T),C===null?k=D:C.sibling=D,C=D,S=oe}if(T===v.length)return n(s,S),N&&Ct(s,T),k;if(S===null){for(;T<v.length;T++)S=g(s,v[T],m),S!==null&&(u=l(S,u,T),C===null?k=S:C.sibling=S,C=S);return N&&Ct(s,T),k}for(S=o(S);T<v.length;T++)oe=b(S,s,T,v[T],m),oe!==null&&(e&&(D=oe.alternate,D!==null&&S.delete(D.key===null?T:D.key)),u=l(oe,u,T),C===null?k=oe:C.sibling=oe,C=oe);return e&&S.forEach(function(Qt){return t(s,Qt)}),N&&Ct(s,T),k}function x(s,u,v,m){if(v==null)throw Error(h(151));for(var k=null,C=null,S=u,T=u=0,oe=null,D=v.next();S!==null&&!D.done;T++,D=v.next()){S.index>T?(oe=S,S=null):oe=S.sibling;var Qt=f(s,S,D.value,m);if(Qt===null){S===null&&(S=oe);break}e&&S&&Qt.alternate===null&&t(s,S),u=l(Qt,u,T),C===null?k=Qt:C.sibling=Qt,C=Qt,S=oe}if(D.done)return n(s,S),N&&Ct(s,T),k;if(S===null){for(;!D.done;T++,D=v.next())D=g(s,D.value,m),D!==null&&(u=l(D,u,T),C===null?k=D:C.sibling=D,C=D);return N&&Ct(s,T),k}for(S=o(S);!D.done;T++,D=v.next())D=b(S,s,T,D.value,m),D!==null&&(e&&(oe=D.alternate,oe!==null&&S.delete(oe.key===null?T:oe.key)),u=l(D,u,T),C===null?k=D:C.sibling=D,C=D);return e&&S.forEach(function(Pv){return t(s,Pv)}),N&&Ct(s,T),k}function w(s,u,v,m){if(typeof v=="object"&&v!==null&&v.type===fo&&v.key===null&&v.props.ref===void 0&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case dl:e:{for(var k=v.key;u!==null;){if(u.key===k){if(k=v.type,k===fo){if(u.tag===7){n(s,u.sibling),m=a(u,v.props.children),Ft(m,v),m.return=s,s=m;break e}}else if(u.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===It&&_n(k)===u.type){n(s,u.sibling),m=a(u,v.props),Ft(m,v),m.return=s,s=m;break e}n(s,u);break}else t(s,u);u=u.sibling}v.type===fo?(m=Un(v.props.children,s.mode,m,v.key),Ft(m,v),m.return=s,s=m):(m=Ul(v.type,v.key,v.props,null,s.mode,m),Ft(m,v),m.return=s,s=m)}return c(s);case ua:e:{for(k=v.key;u!==null;){if(u.key===k)if(u.tag===4&&u.stateNode.containerInfo===v.containerInfo&&u.stateNode.implementation===v.implementation){n(s,u.sibling),m=a(u,v.children||[]),m.return=s,s=m;break e}else{n(s,u);break}else t(s,u);u=u.sibling}m=Ti(v,s.mode,m),m.return=s,s=m}return c(s);case It:return v=_n(v),w(s,u,v,m)}if(da(v))return y(s,u,v,m);if(oa(v)){if(k=oa(v),typeof k!="function")throw Error(h(150));return v=k.call(v),x(s,u,v,m)}if(typeof v.then=="function")return w(s,u,yl(v),m);if(v.$$typeof===yt)return w(s,u,hl(s,v),m);xl(s,v)}return typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint"?(v=""+v,u!==null&&u.tag===6?(n(s,u.sibling),m=a(u,v),m.return=s,s=m):(n(s,u),m=wi(v,s.mode,m),m.return=s,s=m),c(s)):n(s,u)}return function(s,u,v,m){try{Da=0;var k=w(s,u,v,m);return Eo=null,k}catch(S){if(S===Ko||S===Dc)throw S;var C=Ue(29,S,null,s.mode);return C.lanes=m,C.return=s,C}}}var Vn=Mb(!0),Db=Mb(!1),Pt=!1;function mu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function fr(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function dn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function fn(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(q&2)!==0){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,t=nc(e),Tb(e,null,n),t}return Cc(e,o,t,n),nc(e)}function ha(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Ws(e,n)}}function Ei(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var a=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};l===null?a=l=c:l=l.next=c,n=n.next}while(n!==null);l===null?a=l=t:l=l.next=t}else a=l=t;n={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:l,shared:o.shared,callbacks:o.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var sr=!1;function ya(){if(sr){var e=zo;if(e!==null)throw e}}function xa(e,t,n,o){sr=!1;var a=e.updateQueue;Pt=!1;var l=a.firstBaseUpdate,c=a.lastBaseUpdate,i=a.shared.pending;if(i!==null){a.shared.pending=null;var r=i,d=r.next;r.next=null,c===null?l=d:c.next=d,c=r;var p=e.alternate;p!==null&&(p=p.updateQueue,i=p.lastBaseUpdate,i!==c&&(i===null?p.firstBaseUpdate=d:i.next=d,p.lastBaseUpdate=r))}if(l!==null){var g=a.baseState;c=0,p=d=r=null,i=l;do{var f=i.lane&-536870913,b=f!==i.lane;if(b?(M&f)===f:(o&f)===f){f!==0&&f===Ln&&(sr=!0),p!==null&&(p=p.next={lane:0,tag:i.tag,payload:i.payload,callback:null,next:null});e:{var y=e,x=i;f=t;var w=n;switch(x.tag){case 1:if(y=x.payload,typeof y=="function"){g=y.call(w,g,f);break e}g=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=x.payload,f=typeof y=="function"?y.call(w,g,f):y,f==null)break e;g=Z({},g,f);break e;case 2:Pt=!0}}f=i.callback,f!==null&&(e.flags|=64,b&&(e.flags|=8192),b=a.callbacks,b===null?a.callbacks=[f]:b.push(f))}else b={lane:f,tag:i.tag,payload:i.payload,callback:i.callback,next:null},p===null?(d=p=b,r=g):p=p.next=b,c|=f;if(i=i.next,i===null){if(i=a.shared.pending,i===null)break;b=i,i=b.next,b.next=null,a.lastBaseUpdate=b,a.shared.pending=null}}while(!0);p===null&&(r=g),a.baseState=r,a.firstBaseUpdate=d,a.lastBaseUpdate=p,l===null&&(a.shared.lanes=0),Sn|=c,e.lanes=c,e.memoizedState=g}}function Rb(e,t){if(typeof e!="function")throw Error(h(191,e));e.call(t)}function Ub(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Rb(n[e],t)}var xn=Et(null),ic=Et(0);function Mf(e,t){e=jt,W(ic,e),W(xn,t),jt=e|t.baseLanes}function br(){W(ic,jt),W(xn,xn.current)}function hu(){jt=ic.current,ye(xn),ye(ic)}var Se=Et(null),ze=null;function sn(e){var t=e.alternate;W(xe,xe.current&1),W(Se,e),ze===null&&(t===null||xn.current!==null||t.memoizedState!==null)&&(ze=e)}function pr(e){W(xe,xe.current),W(Se,e),ze===null&&(ze=e)}function Bb(e){e.tag===22?(W(xe,xe.current),W(Se,e),ze===null&&(ze=e)):bn()}function bn(){W(xe,xe.current),W(Se,Se.current)}function Ge(e){ye(Se),ze===e&&(ze=null),ye(xe)}var xe=Et(0);function Ra(e,t){W(Se,Se.current),W(xe,t)}function yu(e){ye(xe),ye(Se),ze===e&&(ze=null)}function rc(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Jr(n)||Zu(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!=="independent"){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ht=0,O=null,Q=null,le=null,uc=!1,Oo=!1,Qn=!1,dc=0,Ua=0,No=null,ih=0;function ee(){throw Error(h(321))}function xu(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Je(e[n],t[n]))return!1;return!0}function ku(e,t,n,o,a,l){return Ht=l,O=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,z.H=e===null||e.memoizedState===null?bp:pp,Qn=!1,l=n(o,a),Qn=!1,Oo&&(l=qb(t,n,o,a)),Hb(e),l}function Hb(e){z.H=fc;var t=Q!==null&&Q.next!==null;if(Ht=0,le=Q=O=null,uc=!1,Ua=0,No=null,t)throw Error(h(300));e===null||ie||(e=e.dependencies,e!==null&&lc(e)&&(ie=!0))}function qb(e,t,n,o){O=e;var a=0;do{if(Oo&&(No=null),Ua=0,Oo=!1,25<=a)throw Error(h(301));if(a+=1,le=Q=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}z.H=vh,l=t(n,o)}while(Oo);return l}function rh(){var e=z.H,t=e.useState()[0];return t=typeof t.then=="function"?Wa(t):t,e=e.useState()[0],(Q!==null?Q.memoizedState:null)!==e&&(O.flags|=1024),t}function Su(){var e=dc!==0;return dc=0,e}function wu(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Tu(e){if(uc){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}uc=!1}Ht=0,le=Q=O=null,Oo=!1,Ua=dc=0,No=null}function _e(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return le===null?O.memoizedState=le=e:le=le.next=e,le}function ne(){if(Q===null){var e=O.alternate;e=e!==null?e.memoizedState:null}else e=Q.next;var t=le===null?O.memoizedState:le.next;if(t!==null)le=t,Q=e;else{if(e===null)throw O.alternate===null?Error(h(467)):Error(h(310));Q=e,e={memoizedState:Q.memoizedState,baseState:Q.baseState,baseQueue:Q.baseQueue,queue:Q.queue,next:null},le===null?O.memoizedState=le=e:le=le.next=e}return le}function Rc(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Wa(e){var t=Ua;return Ua+=1,No===null&&(No=[]),e=Cb(No,e,t),t=O,(le===null?t.memoizedState:le.next)===null&&(t=t.alternate,z.H=t===null||t.memoizedState===null?bp:pp),e}function Uc(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Wa(e);if(e.$$typeof===Vg)return;if(e.$$typeof===yt)return he(e)}throw Error(h(438,String(e)))}function zu(e){var t=null,n=O.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var o=O.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Rc(),O.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),o=0;o<e;o++)n[o]=Lg;return t.index++,n}function qt(e,t){return typeof t=="function"?t(e):t}function ql(e){var t=ne();return Eu(t,Q,e)}function Eu(e,t,n){var o=e.queue;if(o===null)throw Error(h(311));o.lastRenderedReducer=n;var a=e.baseQueue,l=o.pending;if(l!==null){if(a!==null){var c=a.next;a.next=l.next,l.next=c}t.baseQueue=a=l,o.pending=null}if(l=e.baseState,a===null)e.memoizedState=l;else{t=a.next;var i=c=null,r=null,d=t,p=!1;do{var g=d.lane&-536870913;if(g!==d.lane?(M&g)===g:(Ht&g)===g){var f=d.revertLane;if(f===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),g===Ln&&(p=!0);else if((Ht&f)===f){d=d.next,f===Ln&&(p=!0);continue}else g={lane:0,revertLane:d.revertLane,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=g,c=l):r=r.next=g,O.lanes|=f,Sn|=f;g=d.action,Qn&&n(l,g),l=d.hasEagerState?d.eagerState:n(l,g)}else f={lane:g,revertLane:d.revertLane,gesture:d.gesture,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=f,c=l):r=r.next=f,O.lanes|=g,Sn|=g;d=d.next}while(d!==null&&d!==t);if(r===null?c=l:r.next=i,!Je(l,e.memoizedState)&&(ie=!0,p&&(n=zo,n!==null)))throw n;e.memoizedState=l,e.baseState=c,e.baseQueue=r,o.lastRenderedState=l}return a===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function Oi(e){var t=ne(),n=t.queue;if(n===null)throw Error(h(311));n.lastRenderedReducer=e;var o=n.dispatch,a=n.pending,l=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do l=e(l,c.action),c=c.next;while(c!==a);Je(l,t.memoizedState)||(ie=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,o]}function Yb(e,t,n){var o=O,a=ne(),l=N;if(l){if(n===void 0)throw Error(h(407));n=n()}else n=t();var c=!Je((Q||a).memoizedState,n);if(c&&(a.memoizedState=n,ie=!0),a=a.queue,Ou(Lb.bind(null,o,a,e),[e]),e=a.getSnapshot!==t||c||le!==null&&(le.memoizedState.tag&1)!==0,Uo(e?9:8,{destroy:void 0},Gb.bind(null,o,a,n,t),null),e){if(o.flags|=2048,X===null)throw Error(h(349));l||(Ht&127)!==0||jb(o,t,n)}return n}function jb(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=O.updateQueue,t===null?(t=Rc(),O.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Gb(e,t,n,o){t.value=n,t.getSnapshot=o,Vb(t)&&Qb(e)}function Lb(e,t,n){return n(function(){Vb(t)&&Qb(e)})}function Vb(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Je(e,n)}catch{return!0}}function Qb(e){var t=Wn(e,2);t!==null&&Be(t,e,2)}function vr(e){var t=_e();if(typeof e=="function"){var n=e;if(e=n(),Qn){tn(!0);try{n()}finally{tn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:qt,lastRenderedState:e},t}function Xb(e,t,n,o){return e.baseState=n,Eu(e,Q,typeof o=="function"?o:qt)}function uh(e,t,n,o,a){if(Hc(e))throw Error(h(485));if(e=t.action,e!==null){var l={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){l.listeners.push(c)}};z.T!==null?n(!0):l.isTransition=!1,o(l),n=t.pending,n===null?(l.next=t.pending=l,Zb(t,l)):(l.next=n.next,t.pending=n.next=l)}}function Zb(e,t){var n=t.action,o=t.payload,a=e.state;if(t.isTransition){var l=z.T,c={};c.types=l!==null?l.types:null,z.T=c;try{var i=n(a,o),r=z.S;r!==null&&r(c,i),Df(e,t,i)}catch(d){gr(e,t,d)}finally{l!==null&&c.types!==null&&(l.types=c.types),z.T=l}}else try{l=n(a,o),Df(e,t,l)}catch(d){gr(e,t,d)}}function Df(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(o){Rf(e,t,o)},function(o){return gr(e,t,o)}):Rf(e,t,n)}function Rf(e,t,n){t.status="fulfilled",t.value=n,Kb(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Zb(e,n)))}function gr(e,t,n){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=n,Kb(t),t=t.next;while(t!==o)}e.action=null}function Kb(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Jb(e,t){return t}function Uf(e,t){if(N){var n=X.formState;if(n!==null){e:{var o=O;if(N){if(F){t:{for(var a=F,l=ot;a.nodeType!==8;){if(!l){a=null;break t}if(a=at(a.nextSibling),a===null){a=null;break t}}l=a.data,a=l==="F!"||l==="F"?a:null}if(a){F=at(a.nextSibling),o=a.data==="F!";break e}}yn(o)}o=!1}o&&(t=n[0])}}return n=_e(),n.memoizedState=n.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Jb,lastRenderedState:t},n.queue=o,n=dp.bind(null,O,o),o.dispatch=n,o=vr(!1),l=Cu.bind(null,O,!1,o.queue),o=_e(),a={state:t,dispatch:null,action:e,pending:null},o.queue=a,n=uh.bind(null,O,a,l,n),a.dispatch=n,o.memoizedState=e,[t,n,!1]}function Bf(e){var t=ne();return Fb(t,Q,e)}function Fb(e,t,n){if(t=Eu(e,t,Jb)[0],e=ql(qt)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=Wa(t)}catch(c){throw c===Ko?Dc:c}else o=t;t=ne();var a=t.queue,l=a.dispatch;return n!==t.memoizedState&&(O.flags|=2048,Uo(9,{destroy:void 0},dh.bind(null,a,n),null)),[o,l,e]}function dh(e,t){e.action=t}function Hf(e){var t=ne(),n=Q;if(n!==null)return Fb(t,n,e);ne(),t=t.memoizedState,n=ne();var o=n.queue.dispatch;return n.memoizedState=e,[t,o,!1]}function Uo(e,t,n,o){return e={tag:e,create:n,deps:o,inst:t,next:null},t=O.updateQueue,t===null&&(t=Rc(),O.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e),e}function Wb(){return ne().memoizedState}function Yl(e,t,n,o){var a=_e();O.flags|=e,a.memoizedState=Uo(1|t,{destroy:void 0},n,o===void 0?null:o)}function Bc(e,t,n,o){var a=ne();o=o===void 0?null:o;var l=a.memoizedState.inst;Q!==null&&o!==null&&xu(o,Q.memoizedState.deps)?a.memoizedState=Uo(t,l,n,o):(O.flags|=e,a.memoizedState=Uo(1|t,l,n,o))}function qf(e,t){Yl(8390656,8,e,t)}function Ou(e,t){Bc(2048,8,e,t)}function fh(e){O.flags|=4;var t=O.updateQueue;if(t===null)t=Rc(),O.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function $b(e){var t=ne().memoizedState;return fh({ref:t,nextImpl:e}),function(){if((q&2)!==0)throw Error(h(440));return t.impl.apply(void 0,arguments)}}function Ib(e,t){return Bc(4,2,e,t)}function Pb(e,t){return Bc(4,4,e,t)}function ep(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function tp(e,t,n){n=n!=null?n.concat([e]):null,Bc(4,4,ep.bind(null,t,e),n)}function Nu(){}function np(e,t){var n=ne();t=t===void 0?null:t;var o=n.memoizedState;return t!==null&&xu(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function op(e,t){var n=ne();t=t===void 0?null:t;var o=n.memoizedState;if(t!==null&&xu(t,o[1]))return o[0];if(o=e(),Qn){tn(!0);try{e()}finally{tn(!1)}}return n.memoizedState=[o,t],o}function Au(e,t,n){return n===void 0||(Ht&1073741824)!==0&&(M&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Fp(),O.lanes|=e,Sn|=e,n)}function ap(e,t,n,o){return Je(n,t)?n:xn.current!==null?(e=Au(e,n,o),Je(e,t)||(ie=!0),e):(Ht&106)===0||(Ht&1073741824)!==0&&(M&261930)===0?(ie=!0,e.memoizedState=n):(e=Fp(),O.lanes|=e,Sn|=e,t)}function lp(e,t,n,o,a){var l=Y.p;Y.p=l!==0&&8>l?l:8;var c=z.T,i={};i.types=c!==null?c.types:null,z.T=i,Cu(e,!1,t,n);try{var r=a(),d=z.S;if(d!==null&&d(i,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var p=ch(r,o);ka(e,t,p,Ke(e))}else ka(e,t,o,Ke(e))}catch(g){ka(e,t,{then:function(){},status:"rejected",reason:g},Ke())}finally{Y.p=l,c!==null&&i.types!==null&&(c.types=i.types),z.T=c}}function sh(){}function mr(e,t,n,o){if(e.tag!==5)throw Error(h(476));var a=cp(e).queue;lp(e,a,t,Rn,n===null?sh:function(){return ip(e),n(o)})}function cp(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Rn,baseState:Rn,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:qt,lastRenderedState:Rn},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:qt,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function ip(e){var t=cp(e);t.next===null&&(t=e.alternate.memoizedState),ka(e,t.next.queue,{},Ke())}function _u(){return he(Lo)}function rp(){return ne().memoizedState}function up(){return ne().memoizedState}function bh(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Ke();e=dn(n);var o=fn(t,e,n);o!==null&&(Be(o,t,n),ha(o,t,n)),t={cache:pu()},e.payload=t;return}t=t.return}}function ph(e,t,n){var o=Ke();n={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Hc(e)?fp(t,n):(n=fu(e,t,n,o),n!==null&&(Be(n,e,o),sp(n,t,o)))}function dp(e,t,n){var o=Ke();ka(e,t,n,o)}function ka(e,t,n,o){var a={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Hc(e))fp(t,a);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var c=t.lastRenderedState,i=l(c,n);if(a.hasEagerState=!0,a.eagerState=i,Je(i,c))return Cc(e,t,a,0),X===null&&_c(),!1}catch{}if(n=fu(e,t,a,o),n!==null)return Be(n,e,o),sp(n,t,o),!0}return!1}function Cu(e,t,n,o){if(o={lane:2,revertLane:Lu(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Hc(e)){if(t)throw Error(h(479))}else t=fu(e,n,o,2),t!==null&&Be(t,e,2)}function Hc(e){var t=e.alternate;return e===O||t!==null&&t===O}function fp(e,t){Oo=uc=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function sp(e,t,n){if((n&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Ws(e,n)}}var fc={readContext:he,use:Uc,useCallback:ee,useContext:ee,useEffect:ee,useImperativeHandle:ee,useLayoutEffect:ee,useInsertionEffect:ee,useMemo:ee,useReducer:ee,useRef:ee,useState:ee,useDebugValue:ee,useDeferredValue:ee,useTransition:ee,useSyncExternalStore:ee,useId:ee,useHostTransitionStatus:ee,useFormState:ee,useActionState:ee,useOptimistic:ee,useMemoCache:ee,useCacheRefresh:ee,useEffectEvent:ee},bp={readContext:he,use:Uc,useCallback:function(e,t){return _e().memoizedState=[e,t===void 0?null:t],e},useContext:he,useEffect:qf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,Yl(4194308,4,ep.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Yl(4194308,4,e,t)},useInsertionEffect:function(e,t){Yl(4,2,e,t)},useMemo:function(e,t){var n=_e();t=t===void 0?null:t;var o=e();if(Qn){tn(!0);try{e()}finally{tn(!1)}}return n.memoizedState=[o,t],o},useReducer:function(e,t,n){var o=_e();if(n!==void 0){var a=n(t);if(Qn){tn(!0);try{n(t)}finally{tn(!1)}}}else a=t;return o.memoizedState=o.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},o.queue=e,e=e.dispatch=ph.bind(null,O,e),[o.memoizedState,e]},useRef:function(e){var t=_e();return e={current:e},t.memoizedState=e},useState:function(e){e=vr(e);var t=e.queue,n=dp.bind(null,O,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Nu,useDeferredValue:function(e,t){var n=_e();return Au(n,e,t)},useTransition:function(){var e=vr(!1);return e=lp.bind(null,O,e.queue,!0,!1),_e().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var o=O,a=_e();if(N){if(n===void 0)throw Error(h(407));n=n()}else{if(n=t(),X===null)throw Error(h(349));(M&127)!==0||jb(o,t,n)}a.memoizedState=n;var l={value:n,getSnapshot:t};return a.queue=l,qf(Lb.bind(null,o,l,e),[e]),o.flags|=2048,Uo(9,{destroy:void 0},Gb.bind(null,o,l,n,t),null),n},useId:function(){var e=_e(),t=X.identifierPrefix;if(N){var n=St,o=kt;n=(o&~(1<<32-Ze(o)-1)).toString(32)+n,t="_"+t+"R_"+n,n=dc++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=ih++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:_u,useFormState:Uf,useActionState:Uf,useOptimistic:function(e){var t=_e();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Cu.bind(null,O,!0,n),n.dispatch=t,[e,t]},useMemoCache:zu,useCacheRefresh:function(){return _e().memoizedState=bh.bind(null,O)},useEffectEvent:function(e){var t=_e(),n={impl:e};return t.memoizedState=n,function(){if((q&2)!==0)throw Error(h(440));return n.impl.apply(void 0,arguments)}}},pp={readContext:he,use:Uc,useCallback:np,useContext:he,useEffect:Ou,useImperativeHandle:tp,useInsertionEffect:Ib,useLayoutEffect:Pb,useMemo:op,useReducer:ql,useRef:Wb,useState:function(){return ql(qt)},useDebugValue:Nu,useDeferredValue:function(e,t){var n=ne();return ap(n,Q.memoizedState,e,t)},useTransition:function(){var e=ql(qt)[0],t=ne().memoizedState;return[typeof e=="boolean"?e:Wa(e),t]},useSyncExternalStore:Yb,useId:rp,useHostTransitionStatus:_u,useFormState:Bf,useActionState:Bf,useOptimistic:function(e,t){var n=ne();return Xb(n,Q,e,t)},useMemoCache:zu,useCacheRefresh:up,useEffectEvent:$b},vh={readContext:he,use:Uc,useCallback:np,useContext:he,useEffect:Ou,useImperativeHandle:tp,useInsertionEffect:Ib,useLayoutEffect:Pb,useMemo:op,useReducer:Oi,useRef:Wb,useState:function(){return Oi(qt)},useDebugValue:Nu,useDeferredValue:function(e,t){var n=ne();return Q===null?Au(n,e,t):ap(n,Q.memoizedState,e,t)},useTransition:function(){var e=Oi(qt)[0],t=ne().memoizedState;return[typeof e=="boolean"?e:Wa(e),t]},useSyncExternalStore:Yb,useId:rp,useHostTransitionStatus:_u,useFormState:Hf,useActionState:Hf,useOptimistic:function(e,t){var n=ne();return Q!==null?Xb(n,Q,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:zu,useCacheRefresh:up,useEffectEvent:$b};function Ni(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:Z({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var hr={enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Ke(),a=dn(o);a.payload=t,n!=null&&(a.callback=n),t=fn(e,a,o),t!==null&&(Be(t,e,o),ha(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Ke(),a=dn(o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=fn(e,a,o),t!==null&&(Be(t,e,o),ha(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ke(),o=dn(n);o.tag=2,t!=null&&(o.callback=t),t=fn(e,o,n),t!==null&&(Be(t,e,n),ha(t,e,n))}};function Yf(e,t,n,o,a,l,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,c):t.prototype&&t.prototype.isPureReactComponent?!_a(n,o)||!_a(a,l):!0}function jf(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&hr.enqueueReplaceState(t,t.state,null)}function Xn(e,t){var n=t;if("ref"in t){n={};for(var o in t)o!=="ref"&&(n[o]=t[o])}if(e=e.defaultProps){n===t&&(n=Z({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function vp(e){tc(e)}function gp(e){console.error(e)}function mp(e){tc(e)}function sc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function Gf(e,t,n){try{var o=e.onCaughtError;o(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function yr(e,t,n){return n=dn(n),n.tag=3,n.payload={element:null},n.callback=function(){sc(e,t)},n}function hp(e){return e=dn(e),e.tag=3,e}function yp(e,t,n,o){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var l=o.value;e.payload=function(){return a(l)},e.callback=function(){Gf(t,n,o)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){Gf(t,n,o),typeof a!="function"&&(pn===null?pn=new Set([this]):pn.add(this));var i=o.stack;this.componentDidCatch(o.value,{componentStack:i!==null?i:""})})}function gh(e,t,n,o,a){if(n.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=n.alternate,t!==null&&jn(t,n,a,!0),n=Se.current,n!==null){switch(n.tag){case 31:case 13:case 19:return ze===null?xc():n.alternate===null&&te===0&&(te=3),n.flags&=-257,n.flags|=65536,n.lanes=a,o===cc?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([o]):t.add(o),Ui(e,o,a)),!1;case 22:return n.flags|=65536,o===cc?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([o]):n.add(o)),Ui(e,o,a)),!1}throw Error(h(435,n.tag))}return Ui(e,o,a),xc(),!1}if(N)return t=Se.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,o!==ir&&(e=Error(h(422),{cause:o}),Ma(nt(e,n)))):(o!==ir&&(t=Error(h(423),{cause:o}),Ma(nt(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,o=nt(o,n),a=yr(e.stateNode,o,a),Ei(e,a),te!==4&&(te=2)),!1;var l=Error(h(520),{cause:o});if(l=nt(l,n),za===null?za=[l]:za.push(l),te!==4&&(te=2),t===null)return!0;o=nt(o,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=yr(n.stateNode,o,e),Ei(n,e),!1;case 1:if(t=n.type,l=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(pn===null||!pn.has(l))))return n.flags|=65536,a&=-a,n.lanes|=a,a=hp(a),yp(a,e,n,o),Ei(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var Mu=Error(h(461)),ie=!1;function ue(e,t,n,o){t.child=e===null?Db(t,null,n,o):Vn(t,e.child,n,o)}function Lf(e,t,n,o,a){n=n.render;var l=t.ref;if("ref"in o){var c={};for(var i in o)i!=="ref"&&(c[i]=o[i])}else c=o;return Gn(t),o=ku(e,t,n,c,l,a),i=Su(),e!==null&&!ie?(wu(e,t,a),Yt(e,t,a)):(N&&i&&Mc(t),t.flags|=1,ue(e,t,o,a),t.child)}function Vf(e,t,n,o,a){if(e===null){var l=n.type;return typeof l=="function"&&!su(l)&&l.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=l,xp(e,t,l,o,a)):(e=Ul(n.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!Ru(e,a)){var c=l.memoizedProps;if(n=n.compare,n=n!==null?n:_a,n(c,o)&&e.ref===t.ref)return Yt(e,t,a)}return t.flags|=1,e=Dt(l,o),e.ref=t.ref,e.return=t,t.child=e}function xp(e,t,n,o,a){if(e!==null){var l=e.memoizedProps;if(_a(l,o)&&e.ref===t.ref)if(ie=!1,t.pendingProps=o=l,Ru(e,a))(e.flags&131072)!==0&&(ie=!0);else return t.lanes=e.lanes,Yt(e,t,a)}return xr(e,t,n,o,a)}function kp(e,t,n,o){var a=o.children,l=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(l=l!==null?l.baseLanes|n:n,e!==null){for(o=t.child=e.child,a=0;o!==null;)a=a|o.lanes|o.childLanes,o=o.sibling;o=a&~l}else o=0,t.child=null;return Qf(e,t,l,n,o)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Hl(t,l!==null?l.cachePool:null),l!==null?Mf(t,l):br(),Bb(t);else return o=t.lanes=536870912,Qf(e,t,l!==null?l.baseLanes|n:n,n,o)}else l!==null?(Hl(t,l.cachePool),Mf(t,l),bn(),t.memoizedState=null):(e!==null&&Hl(t,null),br(),bn());return ue(e,t,a,n),t.child}function Sa(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Qf(e,t,n,o,a){var l=vu();return l=l===null?null:{parent:ce._currentValue,pool:l},t.memoizedState={baseLanes:n,cachePool:l},e!==null&&Hl(t,null),br(),Bb(t),e!==null&&jn(e,t,o,!0),t.childLanes=a,null}function jl(e,t){return t=qc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Xf(e,t,n){return Vn(t,e.child,null,n),e=jl(t,t.pendingProps),e.flags|=2,Ge(t),t.memoizedState=null,e}function mh(e,t,n){var o=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(N){if(o.mode==="hidden")return e=jl(t,o),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Sa(null,e);if(pr(t),(e=F)?(e=kv(e,ot),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:hn!==null?{id:kt,overflow:St}:null,retryLane:536870912,hydrationErrors:null},n=Eb(e),n.return=t,t.child=n,ve=t,F=null)):e=null,e===null)throw yn(t);return t.lanes=536870912,null}return jl(t,o)}var l=e.memoizedState;if(l!==null){var c=l.dehydrated;if(pr(t),a)if(t.flags&256)t.flags&=-257,t=Xf(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(h(558));else if(ie||jn(e,t,n,!1),a=(n&e.childLanes)!==0,ie||a){if(xn.current===null){if(o=X,o!==null&&(c=$s(o,n),c!==0&&c!==l.retryLane))throw l.retryLane=c,Wn(e,c),Be(o,e,c),Mu;xc()}t=Xf(e,t,n)}else e=l.treeContext,F=at(c.nextSibling),ve=t,N=!0,un=null,ot=!1,e!==null&&Nb(t,e),t=jl(t,o),t.flags|=134221824;return t}return e=Dt(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function co(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(h(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function xr(e,t,n,o,a){return Gn(t),n=ku(e,t,n,o,void 0,a),o=Su(),e!==null&&!ie?(wu(e,t,a),Yt(e,t,a)):(N&&o&&Mc(t),t.flags|=1,ue(e,t,n,a),t.child)}function Zf(e,t,n,o,a,l){return Gn(t),t.updateQueue=null,n=qb(t,o,n,a),Hb(e),o=Su(),e!==null&&!ie?(wu(e,t,l),Yt(e,t,l)):(N&&o&&Mc(t),t.flags|=1,ue(e,t,n,l),t.child)}function Kf(e,t,n,o,a){if(Gn(t),t.stateNode===null){var l=ho,c=n.contextType;typeof c=="object"&&c!==null&&(l=he(c)),l=new n(o,l),t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=hr,t.stateNode=l,l._reactInternals=t,l=t.stateNode,l.props=o,l.state=t.memoizedState,l.refs={},mu(t),c=n.contextType,l.context=typeof c=="object"&&c!==null?he(c):ho,l.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(Ni(t,n,c,o),l.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(c=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),c!==l.state&&hr.enqueueReplaceState(l,l.state,null),xa(t,o,l,a),ya(),l.state=t.memoizedState),typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){l=t.stateNode;var i=t.memoizedProps,r=Xn(n,i);l.props=r;var d=l.context,p=n.contextType;c=ho,typeof p=="object"&&p!==null&&(c=he(p));var g=n.getDerivedStateFromProps;p=typeof g=="function"||typeof l.getSnapshotBeforeUpdate=="function",i=t.pendingProps!==i,p||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i||d!==c)&&jf(t,l,o,c),Pt=!1;var f=t.memoizedState;l.state=f,xa(t,o,l,a),ya(),d=t.memoizedState,i||f!==d||Pt?(typeof g=="function"&&(Ni(t,n,g,o),d=t.memoizedState),(r=Pt||Yf(t,n,r,o,f,d,c))?(p||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=d),l.props=o,l.state=d,l.context=c,o=r):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{l=t.stateNode,fr(e,t),c=t.memoizedProps,p=Xn(n,c),l.props=p,g=t.pendingProps,f=l.context,d=n.contextType,r=ho,typeof d=="object"&&d!==null&&(r=he(d)),i=n.getDerivedStateFromProps,(d=typeof i=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(c!==g||f!==r)&&jf(t,l,o,r),Pt=!1,f=t.memoizedState,l.state=f,xa(t,o,l,a),ya();var b=t.memoizedState;c!==g||f!==b||Pt||e!==null&&e.dependencies!==null&&lc(e.dependencies)?(typeof i=="function"&&(Ni(t,n,i,o),b=t.memoizedState),(p=Pt||Yf(t,n,p,o,f,b,r)||e!==null&&e.dependencies!==null&&lc(e.dependencies))?(d||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(o,b,r),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(o,b,r)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=b),l.props=o,l.state=b,l.context=r,o=p):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),o=!1)}return l=o,co(e,t),o=(t.flags&128)!==0,l||o?(l=t.stateNode,n=o&&typeof n.getDerivedStateFromError!="function"?null:l.render(),t.flags|=1,e!==null&&o?(t.child=Vn(t,e.child,null,a),t.child=Vn(t,null,n,a)):ue(e,t,n,a),t.memoizedState=l.state,e=t.child):e=Yt(e,t,a),e}function Jf(e,t,n,o){return Yn(),t.flags|=256,ue(e,t,n,o),t.child}var kr={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Sr(e){return{baseLanes:e,cachePool:_b()}}function wr(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Ve),e}function Sp(e,t,n){var o=t.pendingProps,a=!1,l=(t.flags&128)!==0,c;if((c=l)||(c=e!==null&&e.memoizedState===null?!1:(xe.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(N){if(a?sn(t):bn(),(e=F)?(e=kv(e,ot),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:hn!==null?{id:kt,overflow:St}:null,retryLane:536870912,hydrationErrors:null},n=Eb(e),n.return=t,t.child=n,ve=t,F=null)):e=null,e===null)throw yn(t);return Zu(e)?t.lanes=32:t.lanes=536870912,null}return l=o.children,o=o.fallback,a?(bn(),a=t.mode,l=qc({mode:"hidden",children:l},a),o=Un(o,a,n,null),l.return=t,o.return=t,l.sibling=o,t.child=l,o=t.child,o.memoizedState=Sr(n),o.childLanes=wr(e,c,n),t.memoizedState=kr,Sa(null,o)):(sn(t),Du(t,l))}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(r!==null)return hh(e,t,l,c,o,r,i,n)}return a?(bn(),a=o.fallback,l=t.mode,i=e.child,r=i.sibling,o=Dt(i,{mode:"hidden",children:o.children}),o.subtreeFlags=i.subtreeFlags&1206910976,r!==null?a=Dt(r,a):(a=Un(a,l,n,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,Sa(null,o),o=t.child,a=e.child.memoizedState,a===null?a=Sr(n):(l=a.cachePool,l!==null?(i=ce._currentValue,l=l.parent!==i?{parent:i,pool:i}:l):l=_b(),a={baseLanes:a.baseLanes|n,cachePool:l}),o.memoizedState=a,o.childLanes=wr(e,c,n),t.memoizedState=kr,Sa(e.child,o)):(sn(t),n=e.child,e=n.sibling,n=Dt(n,{mode:"visible",children:o.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function Du(e,t){return t=qc({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function qc(e,t){return e=Ue(22,e,null,t),e.lanes=0,e}function kl(e,t,n){return Vn(t,e.child,null,n),e=Du(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function hh(e,t,n,o,a,l,c,i){if(n)return t.flags&256?(sn(t),t.flags&=-257,kl(e,t,i)):t.memoizedState!==null?(bn(),t.child=e.child,t.flags|=128,null):(bn(),l=a.fallback,c=t.mode,a=qc({mode:"visible",children:a.children},c),l=Un(l,c,i,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,Vn(t,e.child,null,i),a=t.child,a.memoizedState=Sr(i),a.childLanes=wr(e,o,i),t.memoizedState=kr,Sa(null,a));if(sn(t),Zu(l)){if(o=l.nextSibling&&l.nextSibling.dataset,o)var r=o.dgst;return o=r,o!==""&&(a=Error(h(419)),a.stack="",a.digest=o,Ma({value:a,source:null,stack:null})),kl(e,t,i)}if(ie||jn(e,t,i,!1),o=(i&e.childLanes)!==0,ie||o){if(xn.current!==null)return kl(e,t,i);if(o=X,o!==null&&(a=$s(o,i),a!==0&&a!==c.retryLane))throw c.retryLane=a,Wn(e,a),Be(o,e,a),Mu;return Jr(l)||xc(),kl(e,t,i)}return Jr(l)?(t.flags|=192,t.child=e.child,null):(e=c.treeContext,F=at(l.nextSibling),ve=t,N=!0,un=null,ot=!1,e!==null&&Nb(t,e),t=Du(t,a.children),t.flags|=134221824,t)}function Ff(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Bl(e.return,t,n)}function Wf(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&rc(n)===null&&(t=e),e=e.sibling}return t}function Sl(e,t,n,o,a,l){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:a,treeForkCount:l}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=n,c.tailMode=a,c.treeForkCount=l)}function Ai(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function Tr(e,t,n){var o=t.pendingProps,a=o.revealOrder,l=o.tail;o=o.children;var c=xe.current;if(t.flags&128)return Ra(t,c),null;var i=(c&2)!==0;if(i?(c=c&1|2,t.flags|=128):c&=1,Ra(t,c),a==="backwards"&&e!==null?(Ai(e),ue(e,t,o,n),Ai(e)):ue(e,t,o,n),o=N?Ca:0,!i&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ff(e,n,t);else if(e.tag===19)Ff(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"backwards":n=Wf(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null,Ai(t)),Sl(t,!0,a,null,l,o);break;case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&rc(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Sl(t,!0,n,null,l,o);break;case"together":Sl(t,!1,null,null,void 0,o);break;case"independent":t.memoizedState=null;break;default:n=Wf(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Sl(t,!1,a,n,l,o)}return t.child}function $f(e,t,n){var o=t.pendingProps;return on(t,t.type,o.value),ue(e,t,o.children,n),t.child}function Yt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Sn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(jn(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(h(153));if(t.child!==null){for(e=t.child,n=Dt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Dt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ru(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&lc(e)))}function yh(e,t,n){switch(t.tag){case 3:$l(t,t.stateNode.containerInfo),on(t,ce,e.memoizedState.cache),Yn();break;case 27:case 5:$i(t);break;case 4:$l(t,t.stateNode.containerInfo);break;case 10:on(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,pr(t),null;break;case 13:var o=t.memoizedState;if(o!==null){if(o.dehydrated!==null)return sn(t),t.flags|=128,null;o=jn(e,t,n,!1);var a=t.child.childLanes;return o||(n&a)!==0?Sp(e,t,n):(sn(t),e=Yt(e,t,n),e!==null?e.sibling:null)}sn(t);break;case 19:if(t.flags&128)return Tr(e,t,n);if(a=(e.flags&128)!==0,o=(n&t.childLanes)!==0,o||(jn(e,t,n,!1),o=(n&t.childLanes)!==0),a){if(o)return Tr(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),Ra(t,xe.current),o)break;return null;case 22:return t.lanes=0,kp(e,t,n,t.pendingProps);case 24:on(t,ce,e.memoizedState.cache)}return Yt(e,t,n)}function wp(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)ie=!0;else{if(!Ru(e,n)&&(t.flags&128)===0)return ie=!1,yh(e,t,n);ie=(e.flags&131072)!==0}else ie=!1,N&&(t.flags&1048576)!==0&&Ob(t,Ca,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=_n(t.elementType),t.type=e,typeof e=="function")su(e)?(o=Xn(e,o),t.tag=1,t=Kf(null,t,e,o,n)):(t.tag=0,t=xr(null,t,e,o,n));else{if(e!=null){var a=e.$$typeof;if(a===Pr){t.tag=11,t=Lf(null,t,e,o,n);break e}else if(a===eu){t.tag=14,t=Vf(null,t,e,o,n);break e}else if(a===yt){t.tag=10,t.type=e,t=$f(null,t,n);break e}}throw t=Fi(e)||e,Error(h(306,t,""))}}return t;case 0:return xr(e,t,t.type,t.pendingProps,n);case 1:return o=t.type,a=Xn(o,t.pendingProps),Kf(e,t,o,a,n);case 3:e:{if($l(t,t.stateNode.containerInfo),e===null)throw Error(h(387));o=t.pendingProps;var l=t.memoizedState;a=l.element,fr(e,t),xa(t,o,null,n);var c=t.memoizedState;if(o=c.cache,on(t,ce,o),o!==l.cache&&ur(t,[ce],n,!0),ya(),o=c.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){t=Jf(e,t,o,n);break e}else if(o!==a){a=nt(Error(h(424)),t),Ma(a),t=Jf(e,t,o,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,F=at(e.firstChild),ve=t,N=!0,un=null,ot=!0,n=Db(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling;else{if(Yn(),o===a){t=Yt(e,t,n);break e}ue(e,t,o,n)}t=t.child}return t;case 26:return co(e,t),e===null?(n=Ts(t.type,null,t.pendingProps,null))?t.memoizedState=n:N||(t.stateNode=sv(t.type,t.pendingProps,rn.current,t)):t.memoizedState=Ts(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return $i(t),e===null&&N&&(o=t.stateNode=Sv(t.type,t.pendingProps,rn.current),ve=t,ot=!0,a=F,Tn(t.type)?(Fr=a,F=at(o.firstChild)):F=a),ue(e,t,t.pendingProps.children,n),co(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&N&&((a=o=F)&&(o=f0(o,t.type,t.pendingProps,ot),o!==null?(t.stateNode=o,ve=t,F=at(o.firstChild),ot=!1,a=!0):a=!1),a||yn(t)),$i(t),a=t.type,l=t.pendingProps,c=e!==null?e.memoizedProps:null,o=l.children,Xr(a,l)?o=null:c!==null&&Xr(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=ku(e,t,rh,null,null,n),Lo._currentValue=a),co(e,t),ue(e,t,o,n),t.child;case 6:return e===null&&N&&((e=n=F)&&(n=s0(n,t.pendingProps,ot),n!==null?(t.stateNode=n,ve=t,F=null,e=!0):e=!1),e||yn(t)),null;case 13:return Sp(e,t,n);case 4:return $l(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Vn(t,null,o,n):ue(e,t,o,n),t.child;case 11:return Lf(e,t,t.type,t.pendingProps,n);case 7:return o=t.pendingProps,co(e,t),ue(e,t,o,n),t.child;case 8:return ue(e,t,t.pendingProps.children,n),t.child;case 12:return ue(e,t,t.pendingProps.children,n),t.child;case 10:return $f(e,t,n);case 9:return a=t.type._context,o=t.pendingProps.children,Gn(t),a=he(a),o=o(a),t.flags|=1,ue(e,t,o,n),t.child;case 14:return Vf(e,t,t.type,t.pendingProps,n);case 15:return xp(e,t,t.type,t.pendingProps,n);case 19:return Tr(e,t,n);case 31:return mh(e,t,n);case 22:return kp(e,t,n,t.pendingProps);case 24:return Gn(t),o=he(ce),e===null?(a=vu(),a===null&&(a=X,l=pu(),a.pooledCache=l,l.refCount++,l!==null&&(a.pooledCacheLanes|=n),a=l),t.memoizedState={parent:o,cache:a},mu(t),on(t,ce,a)):((e.lanes&n)!==0&&(fr(e,t),xa(t,null,null,n),ya()),a=e.memoizedState,l=t.memoizedState,a.parent!==o?(a={parent:o,cache:o},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),on(t,ce,o)):(o=l.cache,on(t,ce,o),o!==a.cache&&ur(t,[ce],n,!0))),ue(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=t.pendingProps,o.name!=null&&o.name!=="auto"?t.flags|=e===null?18882560:18874368:N&&Mc(t),e!==null&&e.memoizedProps.name!==o.name?t.flags|=4194816:co(e,t),ue(e,t,o.children,n),t.child;case 29:throw t.pendingProps}throw Error(h(156,t.tag))}function _t(e){e.flags|=4}function _i(e,t,n,o,a){var l;if((l=(e.mode&32)!==0)&&(l=n===null?Os(t,o):Os(t,o)&&(o.src!==n.src||o.srcSet!==n.srcSet)),l){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(Ip())e.flags|=8192;else throw Hn=cc,gu}else e.flags&=-16777217}function If(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Ev(t))if(Ip())e.flags|=8192;else throw Hn=cc,gu}function wl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Js():536870912,e.lanes|=t,Bo|=t)}function la(e,t){if(!N)switch(e.tailMode){case"visible":break;case"collapsed":for(var n=e.tail,o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function J(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags&1206910976,o|=a.flags&1206910976,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function xh(e,t,n){var o=t.pendingProps;switch(bu(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return J(t),null;case 1:return J(t),null;case 3:return n=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),Rt(ce),Mo(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(ao(t)?_t(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,zi())),J(t),null;case 26:var a=t.type,l=t.memoizedState;return e===null?(_t(t),l!==null?(J(t),If(t,l)):(J(t),_i(t,a,null,o,n))):l?l!==e.memoizedState?(_t(t),J(t),If(t,l)):(J(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&_t(t),J(t),_i(t,a,e,o,n)),null;case 27:if(Il(t),n=rn.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&_t(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return J(t),t.subtreeFlags&=-33554433,null}e=wt.current,ao(t)?zf(t,e):(e=Sv(a,o,n),t.stateNode=e,_t(t))}return J(t),t.subtreeFlags&=-33554433,null;case 5:if(Il(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&_t(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return J(t),t.subtreeFlags&=-33554433,null}if(l=wt.current,ao(t))zf(t,l);else{var c=qa(rn.current);switch(l){case 1:l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":l=c.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof o.is=="string"?c.createElement("select",{is:o.is}):c.createElement("select"),o.multiple?l.multiple=!0:o.size&&(l.size=o.size);break;default:l=typeof o.is=="string"?c.createElement(a,{is:o.is}):c.createElement(a)}}l[me]=t,l[qe]=o;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)l.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=l;e:switch(ke(l,a,o),a){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&_t(t)}}return J(t),t.subtreeFlags&=-33554433,_i(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&_t(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(h(166));if(e=rn.current,ao(t)){if(e=t.stateNode,n=t.memoizedProps,o=null,a=ve,a!==null)switch(a.tag){case 27:case 5:o=a.memoizedProps}e[me]=t,e=!!(e.nodeValue===n||o!==null&&o.suppressHydrationWarning===!0||dv(e.nodeValue,n)),e||yn(t,!0)}else e=qa(e).createTextNode(o),e[me]=t,t.stateNode=e}return J(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(o=ao(t),n!==null){if(e===null){if(!o)throw Error(h(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(557));e[me]=t}else Yn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;J(t),e=!1}else n=zi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Ge(t),t):(Ge(t),null);if((t.flags&128)!==0)throw Error(h(558))}return J(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=ao(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(h(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(h(317));a[me]=t}else Yn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;J(t),a=!1}else a=zi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Ge(t),t):(Ge(t),null)}return Ge(t),(t.flags&128)!==0?(t.lanes=n,t):(n=o!==null,e=e!==null&&e.memoizedState!==null,n&&(o=t.child,a=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(a=o.alternate.memoizedState.cachePool.pool),l=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(l=o.memoizedState.cachePool.pool),l!==a&&(o.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),wl(t,t.updateQueue),J(t),null);case 4:return Mo(),e===null&&Vu(t.stateNode.containerInfo),t.flags|=67108864,J(t),null;case 10:return Rt(t.type),J(t),null;case 19:if(yu(t),o=t.memoizedState,o===null)return J(t),null;if(a=(t.flags&128)!==0,l=o.rendering,l===null)if(a)la(o,!1);else{if(te!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=rc(e),l!==null){for(t.flags|=128,la(o,!1),e=l.updateQueue,t.updateQueue=e,wl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)zb(n,e),n=n.sibling;return Ra(t,xe.current&1|2),N&&Ct(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&Qe()>hc&&(t.flags|=128,a=!0,la(o,!1),t.lanes=4194304)}else{if(!a)if(e=rc(l),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,wl(t,e),la(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!l.alternate&&!N)return J(t),null}else 2*Qe()-o.renderingStartTime>hc&&n!==536870912&&(t.flags|=128,a=!0,la(o,!1),t.lanes=4194304);o.isBackwards?(l.sibling=t.child,t.child=l):(e=o.last,e!==null?e.sibling=l:t.child=l,o.last=l)}if(o.tail!==null){e=o.tail;e:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break e}n=n.sibling}n=!0}return o.rendering=e,o.tail=e.sibling,o.renderingStartTime=Qe(),e.sibling=null,l=xe.current,l=a?l&1|2:l&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!n||N?Ra(t,l):(n=l,W(Se,t),W(xe,n),ze===null&&(ze=t)),N&&Ct(t,o.treeForkCount),e}return J(t),null;case 22:case 23:return Ge(t),hu(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(n&536870912)!==0&&(t.flags&128)===0&&(J(t),t.subtreeFlags&6&&(t.flags|=8192)):J(t),n=t.updateQueue,n!==null&&wl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==n&&(t.flags|=2048),e!==null&&ye(Bn),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Rt(ce),J(t),null;case 25:return null;case 30:return t.flags|=33554432,J(t),null}throw Error(h(156,t.tag))}function kh(e,t){switch(bu(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Rt(ce),Mo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Il(t),null;case 31:if(t.memoizedState!==null){if(Ge(t),t.alternate===null)throw Error(h(340));Yn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Ge(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(h(340));Yn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return yu(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return Mo(),null;case 10:return Rt(t.type),null;case 22:case 23:return Ge(t),hu(),e!==null&&ye(Bn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Rt(ce),null;case 25:return null;default:return null}}function Tp(e,t){switch(bu(t),t.tag){case 3:Rt(ce),Mo();break;case 26:case 27:case 5:Il(t);break;case 4:Mo();break;case 31:t.memoizedState!==null&&Ge(t);break;case 13:Ge(t);break;case 19:yu(t);break;case 10:Rt(t.type);break;case 22:case 23:Ge(t),hu(),e!==null&&ye(Bn);break;case 24:Rt(ce)}}function $a(e,t){try{var n=t.updateQueue,o=n!==null?n.lastEffect:null;if(o!==null){var a=o.next;n=a;do{if((n.tag&e)===e){o=void 0;var l=n.create,c=n.inst;o=l(),c.destroy=o}n=n.next}while(n!==a)}}catch(i){V(t,t.return,i)}}function kn(e,t,n){try{var o=t.updateQueue,a=o!==null?o.lastEffect:null;if(a!==null){var l=a.next;o=l;do{if((o.tag&e)===e){var c=o.inst,i=c.destroy;if(i!==void 0){c.destroy=void 0,a=t;var r=n,d=i;try{d()}catch(p){V(a,r,p)}}}o=o.next}while(o!==l)}}catch(p){V(t,t.return,p)}}function zp(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Ub(t,n)}catch(o){V(e,e.return,o)}}}function Ep(e,t,n){n.props=Xn(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(o){V(e,t,o)}}function mt(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:var a=e.stateNode,l=Bt(e.memoizedProps,a);(a.ref===null||a.ref.name!==l)&&(a.ref=gv(l)),o=a.ref;break;case 7:if(e.stateNode===null){var c=new Fe(e);He(e.child,!1,u0,c,void 0,void 0),e.stateNode=c}o=e.stateNode;break;default:o=e.stateNode}typeof n=="function"?e.refCleanup=n(o):n.current=o}}catch(i){V(e,t,i)}}function ge(e,t){var n=e.ref,o=e.refCleanup;if(n!==null)if(typeof o=="function")try{o()}catch(a){V(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){V(e,t,a)}else n.current=null}function bc(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)xv(e.stateNode,t[n])}function Pf(e){for(var t=e.return;t!==null&&(Bu(t)&&xv(e.stateNode,t.stateNode),!Uu(t));)t=t.return}function wa(e){for(var t=e.return;t!==null&&(Bu(t)&&d0(e.stateNode,t.stateNode),!Uu(t));)t=t.return}function Uu(e){return e.tag===5||e.tag===3||e.tag===27}function Bu(e){return e&&e.tag===7&&e.stateNode!==null}function zr(e){var t=e.type,n=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&o.focus();break e;case"img":n.src?o.src=n.src:n.srcSet&&(o.srcset=n.srcSet)}}catch(a){V(e,e.return,a)}}function Ci(e,t,n){try{var o=e.stateNode;Xh(o,e.type,n,t),o[qe]=t}catch(a){V(e,e.return,a)}}function Op(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Tn(e.type)||e.tag===4}function Mi(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Op(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Tn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Er(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=xt)),bc(e,o),U=!0;else if(a!==4&&(a===27&&(bc(e,o),o=null,Tn(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Er(e,t,n,o),e=e.sibling;e!==null;)Er(e,t,n,o),e=e.sibling}function pc(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?n.insertBefore(a,t):n.appendChild(a),bc(e,o),U=!0;else if(a!==4&&(a===27&&(bc(e,o),o=null,Tn(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(pc(e,t,n,o),e=e.sibling;e!==null;)pc(e,t,n,o),e=e.sibling}function Np(e){var t=e.stateNode,n=e.memoizedProps;try{for(var o=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);ke(t,o,n),t[me]=e,t[qe]=n}catch(l){V(e,e.return,l)}}var vc=!1,Le=null;function es(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(vc=!0)}var ht=null;function ts(){var e=ht;return ht=null,e}var Re=0;function Jo(e,t,n,o,a){return Re=0,Ap(e.child,t,n,o,a)}function Ap(e,t,n,o,a){for(var l=!1;e!==null;){if(e.tag===5){var c=e.stateNode;if(o!==null){var i=Zr(c);o.push(i),i.view&&(l=!0)}else l||Zr(c).view&&(l=!0);vc=!0,bv(c,Re===0?t:t+"_"+Re,n),Re++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&a||Ap(e.child,t,n,o,a)&&(l=!0));e=e.sibling}return l}function zt(e,t){for(;e!==null;)e.tag===5?pv(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||zt(e.child,t)),e=e.sibling}function Gl(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Gl(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name==="auto")throw Error(h(544));var n=t.name;t=Lt(t.default,t.share),t!=="none"&&(Jo(e,n,t,null,!1)||zt(e.child,!1))}e=e.sibling}}function Or(e,t){if(e.tag===30){var n=e.stateNode,o=e.memoizedProps,a=Bt(o,n),l=Lt(o.default,n.paired?o.share:o.enter);l!=="none"?Jo(e,a,l,null,!1)?(Gl(e),n.paired||t||Ho(e,o.onEnter)):zt(e.child,!1):Gl(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Or(e,t),e=e.sibling;else Gl(e)}function Nr(e){if(Le!==null&&Le.size!==0){var t=Le;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.memoizedProps,o=n.name;if(o!=null&&o!=="auto"){var a=t.get(o);if(a!==void 0){var l=Lt(n.default,n.share);if(l!=="none"&&(Jo(e,o,l,null,!1)?(l=e.stateNode,a.paired=l,l.paired=a,Ho(e,n.onShare)):zt(e.child,!1)),t.delete(o),t.size===0)break}}}Nr(e)}e=e.sibling}}}function Ar(e){if(e.tag===30){var t=e.memoizedProps,n=Bt(t,e.stateNode),o=Le!==null?Le.get(n):void 0,a=Lt(t.default,o!==void 0?t.share:t.exit);a!=="none"&&(Jo(e,n,a,null,!1)?o!==void 0?(a=e.stateNode,o.paired=a,a.paired=o,Le.delete(n),Ho(e,t.onShare)):Ho(e,t.onExit):zt(e.child,!1)),Le!==null&&Nr(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ar(e),e=e.sibling;else Le!==null&&Nr(e)}function _p(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=Bt(t,e.stateNode);t=Lt(t.default,t.update),e.flags&=-5,t!=="none"&&Jo(e,n,t,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&_p(e);e=e.sibling}}function _r(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.stateNode;t.paired!==null&&(t.paired=null,zt(e.child,!1))}_r(e)}e=e.sibling}}function Ll(e){if(e.tag===30)e.stateNode.paired=null,zt(e.child,!1),_r(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ll(e),e=e.sibling;else _r(e)}function Cp(e){for(e=e.child;e!==null;)e.tag===30?zt(e.child,!1):(e.subtreeFlags&33554432)!==0&&Cp(e),e=e.sibling}function Hu(e,t,n,o,a,l,c){for(var i=!1;t!==null;){if(t.tag===5){var r=t.stateNode;if(l!==null&&Re<l.length){var d=l[Re],p=Zr(r);(d.view||p.view)&&(i=!0);var g;if(g=(e.flags&4)===0)if(p.clip)g=!0;else{g=d.rect;var f=p.rect;g=g.y!==f.y||g.x!==f.x||g.height!==f.height||g.width!==f.width}g&&(e.flags|=4),p.abs?p=!d.abs:(d=d.rect,p=p.rect,p=d.height!==p.height||d.width!==p.width),p&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&bv(r,Re===0?n:n+"_"+Re,a),i&&(e.flags&4)!==0||(ht===null&&(ht=[]),ht.push(r,Re===0?o:o+"_"+Re,t.memoizedProps)),Re++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c?e.flags|=t.flags&32:Hu(e,t.child,n,o,a,l,c)&&(i=!0));t=t.sibling}return i}function Mp(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,o=e.stateNode,a=Bt(n,o),l=Lt(n.default,n.update);if(t){o=o.clones;var c=o===null?null:o.map($h)}else c=e.memoizedState,e.memoizedState=null;o=e;var i=e.child;Re=0,a=Hu(o,i,a,a,l,c,!1),(e.flags&4)!==0&&a&&(t||Ho(e,n.onUpdate))}else(e.subtreeFlags&33554432)!==0&&Mp(e,t);e=e.sibling}}var se=!1,j=!1,pt=!1,Di=!1,ns=typeof WeakSet=="function"?WeakSet:Set,be=null,vt=!1,ba=!1,gc=!1,Cr=!1;function Sh(e,t,n){if(e=e.containerInfo,Vr=Vo,e=mb(e),uu(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var a=o.getSelection&&o.getSelection();if(a&&a.rangeCount!==0){o=a.anchorNode;var l=a.anchorOffset,c=a.focusNode;a=a.focusOffset;try{o.nodeType,c.nodeType}catch{o=null;break e}var i=0,r=-1,d=-1,p=0,g=0,f=e,b=null;t:for(;;){for(var y;f!==o||l!==0&&f.nodeType!==3||(r=i+l),f!==c||a!==0&&f.nodeType!==3||(d=i+a),f.nodeType===3&&(i+=f.nodeValue.length),(y=f.firstChild)!==null;)b=f,f=y;for(;;){if(f===e)break t;if(b===o&&++p===l&&(r=i),b===c&&++g===a&&(d=i),(y=f.nextSibling)!==null)break;f=b,b=f.parentNode}f=y}o=r===-1||d===-1?null:{start:r,end:d}}else o=null}o=o||{start:0,end:0}}else o=null;for(Qr={focusedElem:e,selectionRange:o},Vo=!1,n=(n&335544064)===n,be=t,t=n?9270:1024;be!==null;){if(e=be,n&&(o=e.deletions,o!==null))for(l=0;l<o.length;l++)n&&Ar(o[l]);if(e.alternate===null&&(e.flags&2)!==0)n&&es(e),Tl(n);else{if(e.tag===22){if(o=e.alternate,e.memoizedState!==null){o!==null&&o.memoizedState===null&&n&&Ar(o),Tl(n);continue}else if(o!==null&&o.memoizedState!==null){n&&es(e),Tl(n);continue}}o=e.child,(e.subtreeFlags&t)!==0&&o!==null?(o.return=e,be=o):(n&&_p(e),Tl(n))}}Le=null}function Tl(e){for(;be!==null;){var t=be,n=e,o=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if((a&1024)!==0&&o!==null){n=void 0,a=o.memoizedProps,o=o.memoizedState;var l=t.stateNode;try{var c=Xn(t.type,a);n=l.getSnapshotBeforeUpdate(c,o),l.__reactInternalSnapshotBeforeUpdate=n}catch(i){V(t,t.return,i)}}break;case 3:if((a&1024)!==0){if(o=t.stateNode.containerInfo,n=o.nodeType,n===9)Kr(o);else if(n===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":Kr(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&o!==null&&(n=Bt(o.memoizedProps,o.stateNode),a=t.memoizedProps,a=Lt(a.default,a.update),a!=="none"&&Jo(o,n,a,o.memoizedState=[],!0));break;default:if((a&1024)!==0)throw Error(h(163))}if(o=t.sibling,o!==null){o.return=t.return,be=o;break}be=t.return}}function Dp(e,t,n){var o=n.flags;switch(n.tag){case 0:case 11:case 15:gt(e,n),o&4&&$a(5,n);break;case 1:if(gt(e,n),o&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){V(n,n.return,c)}else{var a=Xn(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){V(n,n.return,c)}}o&64&&zp(n),o&512&&mt(n,n.return);break;case 3:if(gt(e,n),o&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Ub(e,t)}catch(c){V(n,n.return,c)}}break;case 27:t===null&&o&4&&Np(n);case 26:case 5:gt(e,n),t===null&&o&4&&zr(n),o&512&&mt(n,n.return);break;case 12:gt(e,n);break;case 31:gt(e,n),o&4&&Hp(e,n);break;case 13:gt(e,n),o&4&&qp(e,n),o&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Rh.bind(null,n),b0(e,n))));break;case 22:if(o=n.memoizedState!==null||se,!o){var l=t!==null&&t.memoizedState!==null||j;t=se,a=j,se=o,(j=l)&&!a?(o=2,(n.subtreeFlags&8772)!==0&&(o|=1),it(e,n,o)):gt(e,n),se=t,j=a}break;case 30:gt(e,n),o&512&&mt(n,n.return);break;case 7:o&512&&mt(n,n.return);default:gt(e,n)}}function Mr(e,t){for(e=e.child;e!==null;)Rp(e,t),e=e.sibling}function Rp(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var o=n.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var a=e.stateNode,l=e.memoizedProps.style,c=l!=null&&l.hasOwnProperty("display")?l.display:null;a.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(r){V(e,e.return,r)}Dr(e,t);break;case 6:try{e.stateNode.nodeValue=t?"":e.memoizedProps,U=!0}catch(r){V(e,e.return,r)}break;case 18:try{var i=e.stateNode;t?hs(i,!0):hs(e.stateNode,!1)}catch(r){V(e,e.return,r)}break;case 22:case 23:e.memoizedState===null&&Mr(e,t);break;default:Mr(e,t)}}function Dr(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var n=e,o=t;switch(n.tag){case 4:Rp(n,o);break e;case 22:n.memoizedState===null&&Dr(n,o);break e;default:Dr(n,o)}}e=e.sibling}}function Up(e){var t=e.alternate;t!==null&&(e.alternate=null,Up(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Ec(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var I=null,Me=!1;function ct(e,t,n){for(n=n.child;n!==null;)Bp(e,t,n),n=n.sibling}function Bp(e,t,n){if(Xe&&typeof Xe.onCommitFiberUnmount=="function")try{Xe.onCommitFiberUnmount(Qa,n)}catch{}switch(n.tag){case 26:j||ge(n,t),ct(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!j&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:j||ge(n,t),wa(n);var o=I,a=Me;Tn(n.type)&&(I=n.stateNode,Me=!1),ct(e,t,n),wv(n.stateNode,n.type,n.memoizedProps),I=o,Me=a;break;case 5:j||ge(n,t),wa(n);case 6:if(n.tag===6&&wa(n),o=I,a=Me,I=null,ct(e,t,n),I=o,Me=a,I!==null)if(Me)try{(I.nodeType===9?I.body:I.nodeName==="HTML"?I.ownerDocument.body:I).removeChild(n.stateNode),U=!0}catch(l){V(n,t,l)}else try{I.removeChild(n.stateNode),U=!0}catch(l){V(n,t,l)}break;case 18:I!==null&&(Me?(e=I,ms(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Qo(e)):ms(I,n.stateNode));break;case 4:o=I,a=Me,I=n.stateNode.containerInfo,Me=!0,ct(e,t,n),I=o,Me=a;break;case 0:case 11:case 14:case 15:kn(2,n,t),j||kn(4,n,t),ct(e,t,n);break;case 1:j||(ge(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"&&Ep(n,t,o)),ct(e,t,n);break;case 21:ct(e,t,n);break;case 22:j=(o=j)||n.memoizedState!==null,ct(e,t,n),j=o;break;case 30:ge(n,t),ct(e,t,n);break;case 7:j||ge(n,t),ct(e,t,n);break;default:ct(e,t,n)}}function Hp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Qo(e)}catch(n){V(t,t.return,n)}}}function qp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Qo(e)}catch(n){V(t,t.return,n)}}function wh(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ns),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ns),t;default:throw Error(h(435,e.tag))}}function zl(e,t){var n=wh(e);t.forEach(function(o){if(!n.has(o)){n.add(o);var a=Uh.bind(null,e,o);o.then(a,a)}})}function Ne(e,t,n){var o=t.deletions;if(o!==null)for(var a=0;a<o.length;a++){var l=o[a],c=e,i=t,r=i;e:for(;r!==null;){switch(r.tag){case 27:if(Tn(r.type)){I=r.stateNode,Me=!1;break e}break;case 5:I=r.stateNode,Me=!1;break e;case 3:case 4:I=r.stateNode.containerInfo,Me=!0;break e}r=r.return}if(I===null)throw Error(h(160));Bp(c,i,l),I=null,Me=!1,c=l.alternate,c!==null&&(c.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Yp(t,e,n),t=t.sibling}var rt=null;function Yp(e,t,n){var o=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(o=e.updateQueue,o=o!==null?o.events:null,o!==null))for(var l=0;l<o.length;l++){var c=o[l];c.ref.impl=c.nextImpl}Ne(t,e,n),Ae(e),a&4&&(kn(3,e,e.return),$a(3,e),kn(5,e,e.return));break;case 1:Ne(t,e,n),Ae(e),a&512&&(j||o===null||ge(o,o.return)),a&64&&se&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(l=rt,Ne(t,e,n),Ae(e),a&512&&(j||o===null||ge(o,o.return)),a&4)if(a=o!==null?o.memoizedState:null,n=e.memoizedState,o===null)if(n===null)if(e.stateNode===null)if(se)e.stateNode=sv(e.type,e.memoizedProps,t.containerInfo,e);else{e:{t=e.type,n=e.memoizedProps,a=l.ownerDocument||l;t:switch(t){case"title":o=a.getElementsByTagName("title")[0],(!o||o[Ka]||o[me]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(t),a.head.insertBefore(o,a.querySelector("head > title"))),ke(o,t,n),o[me]=e,pe(o),t=o;break e;case"link":if(l=Es("link","href",a).get(t+(n.href||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){l.splice(c,1);break t}}o=a.createElement(t),ke(o,t,n),a.head.appendChild(o);break;case"meta":if(l=Es("meta","content",a).get(t+(n.content||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){l.splice(c,1);break t}}o=a.createElement(t),ke(o,t,n),a.head.appendChild(o);break;default:throw Error(h(468,t))}o[me]=e,pe(o),t=o}e.stateNode=t}else se||Wr(l,e.type,e.stateNode);else e.stateNode=zs(l,n,e.memoizedProps);else a!==n?(a===null?(t=o.stateNode,t===null||j||t.parentNode.removeChild(t)):a.count--,n===null?se||Wr(l,e.type,e.stateNode):zs(l,n,e.memoizedProps)):n===null&&e.stateNode!==null&&Ci(e,e.memoizedProps,o.memoizedProps);break;case 27:Ne(t,e,n),Ae(e),a&512&&(j||o===null||ge(o,o.return)),o!==null&&a&4&&Ci(e,e.memoizedProps,o.memoizedProps);break;case 5:if(l=pt,pt=!1,Ne(t,e,n),pt=l,Ae(e),a&512&&(j||o===null||ge(o,o.return)),e.flags&32){t=e.stateNode;try{Ro(t,""),U=!0}catch(p){V(e,e.return,p)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Ci(e,t,o!==null?o.memoizedProps:t)),a&1024&&(Di=!0);break;case 6:if(Ne(t,e,n),Ae(e),a&4){if(e.stateNode===null)throw Error(h(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,U=!0}catch(p){V(e,e.return,p)}}break;case 3:if(U=!1,Zl=null,l=rt,rt=Ya(t.containerInfo),Ne(t,e,n),rt=l,Ae(e),a&4&&o!==null&&o.memoizedState.isDehydrated)try{Qo(t.containerInfo)}catch(p){V(e,e.return,p)}Di&&(Di=!1,jp(e)),U=!1;break;case 4:a=pt,pt=se,o=rf(),l=rt,rt=Ya(e.stateNode.containerInfo),Ne(t,e,n),Ae(e),rt=l,U&&ba&&(gc=!0),U=o,pt=a;break;case 12:Ne(t,e,n),Ae(e);break;case 31:Ne(t,e,n),Ae(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,zl(e,t)));break;case 13:Ne(t,e,n),Ae(e),e.child.flags&8192&&e.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(Yc=Qe()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,zl(e,t)));break;case 22:l=e.memoizedState!==null,c=o!==null&&o.memoizedState!==null;var i=se,r=j,d=pt;se=i||l,pt=d||l,j=r||c,Ne(t,e,n),j=r,pt=d,se=i,Ae(e),a&8192&&(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,!l||o===null||c||se||j||(t=c||j,n=se,o=j,se=l||se,j=t,$t(e,2),se=n,j=o),!l&&pt||Mr(e,l)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,zl(e,n))));break;case 19:Ne(t,e,n),Ae(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,zl(e,t)));break;case 30:a&512&&(j||o===null||ge(o,o.return)),a=rf(),l=ba,c=(n&335544064)===n,i=e.memoizedProps,ba=c&&Lt(i.default,i.update)!=="none",Ne(t,e,n),Ae(e),c&&o!==null&&U&&(e.flags|=4),ba=l,U=a;break;case 21:break;case 7:a&512&&(j||o===null||ge(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=e);default:Ne(t,e,n),Ae(e)}}function Ae(e){var t=e.flags;if(t&2){try{for(var n,o=e.return;o!==null;){if(Op(o)){n=o;break}o=o.return}o=null;for(var a=e.return;a!==null;){if(Bu(a)){var l=a.stateNode;o===null?o=[l]:o.push(l)}if(Uu(a))break;a=a.return}var c=o;if(n==null)throw Error(h(160));switch(n.tag){case 27:var i=n.stateNode,r=Mi(e);pc(e,r,i,c);break;case 5:var d=n.stateNode;n.flags&32&&(Ro(d,""),n.flags&=-33);var p=Mi(e);pc(e,p,d,c);break;case 3:case 4:var g=n.stateNode.containerInfo,f=Mi(e);Er(e,f,g,c);break;default:throw Error(h(161))}}catch(b){V(e,e.return,b)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function jp(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;jp(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,Vo=!0,t.reset(),Vo=!1),e=e.sibling}}function lo(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Gp(t,e),t=t.sibling;else Mp(t,!1)}function Gp(e,t){var n=e.alternate;if(n===null)Or(e,!1);else switch(e.tag){case 3:if(Cr=vt=!1,ts(),lo(t,e),!vt&&!gc){if(e=ht,e!==null)for(var o=0;o<e.length;o+=3){n=e[o];var a=e[o+1];pv(n,e[o+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+a+")"})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Cr=!0}ht=null;break;case 5:lo(t,e);break;case 4:o=vt,vt=!1,lo(t,e),vt&&(gc=!0),vt=o;break;case 22:e.memoizedState===null&&(n.memoizedState!==null?Or(e,!1):lo(t,e));break;case 30:o=vt,a=ts(),vt=!1,lo(t,e),vt&&(e.flags|=4);var l=e.memoizedProps,c=e.stateNode;t=Bt(l,c),c=Bt(n.memoizedProps,c);var i=Lt(l.default,l.update);i==="none"?t=!1:(l=n.memoizedState,n.memoizedState=null,n=e.child,Re=0,t=Hu(e,n,t,c,i,l,!0),Re!==(l===null?0:l.length)&&(e.flags|=32)),(e.flags&4)!==0&&t?(Ho(e,e.memoizedProps.onUpdate),ht=a):a!==null&&(a.push.apply(a,ht),ht=a),vt=(e.flags&32)!==0?!0:o;break;default:lo(t,e)}}function gt(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Dp(e,t.alternate,t),t=t.sibling}function $t(e,t){for(e=e.child;e!==null;){var n=e,o=t;switch(n.tag){case 0:case 11:case 14:case 15:kn(4,n,n.return),$t(n,o);break;case 1:ge(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Ep(n,n.return,a),$t(n,o);break;case 27:(o&2)!==0&&wv(n.stateNode,n.type,n.memoizedProps);case 5:ge(n,n.return),n.tag!==5&&n.tag!==27||wa(n),$t(n,o);break;case 6:wa(n);break;case 26:ge(n,n.return),a=n.stateNode,n.memoizedState!==null||a===null||j||a.parentNode.removeChild(a),$t(n,o);break;case 22:n.memoizedState===null&&$t(n,o);break;case 30:ge(n,n.return),$t(n,o);break;case 7:ge(n,n.return);default:$t(n,o)}e=e.sibling}}function it(e,t,n){for(n=(t.subtreeFlags&8772)!==0?n:n&-2,t=t.child;t!==null;){var o=t.alternate,a=e,l=t,c=l.flags,i=(n&1)!==0;switch(l.tag){case 0:case 11:case 15:it(a,l,n),$a(4,l);break;case 1:if(it(a,l,n),o=l,a=o.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(p){V(o,o.return,p)}if(o=l,a=o.updateQueue,a!==null){var r=o.stateNode;try{var d=a.shared.hiddenCallbacks;if(d!==null)for(a.shared.hiddenCallbacks=null,a=0;a<d.length;a++)Rb(d[a],r)}catch(p){V(o,o.return,p)}}i&&c&64&&zp(l),mt(l,l.return);break;case 27:(n&2)!==0&&Np(l);case 5:l.tag!==5&&l.tag!==27||Pf(l),it(a,l,n),i&&o===null&&c&4&&zr(l),mt(l,l.return);break;case 6:Pf(l);break;case 26:r=l.stateNode,l.memoizedState!==null||r===null||se||Wr(Ya(r.ownerDocument),l.type,r),it(a,l,n),i&&o===null&&c&4&&zr(l),mt(l,l.return);break;case 12:it(a,l,n);break;case 31:it(a,l,n),i&&c&4&&Hp(a,l);break;case 13:it(a,l,n),i&&c&4&&qp(a,l);break;case 22:l.memoizedState===null&&it(a,l,n),mt(l,l.return);break;case 30:it(a,l,n),mt(l,l.return);break;case 7:mt(l,l.return);default:it(a,l,n)}t=t.sibling}}function qu(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Fa(n))}function Yu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Fa(e))}function $e(e,t,n,o){var a=(n&335544064)===n;if(t.subtreeFlags&(a?10262:10256))for(t=t.child;t!==null;)Lp(e,t,n,o),t=t.sibling;else a&&Cp(t)}function Lp(e,t,n,o){var a=(n&335544064)===n;a&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&Ll(t);var l=t.flags;switch(t.tag){case 0:case 11:case 15:$e(e,t,n,o),l&2048&&$a(9,t);break;case 1:$e(e,t,n,o);break;case 3:$e(e,t,n,o),a&&Cr&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),l&2048&&(l=null,t.alternate!==null&&(l=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==l&&(t.refCount++,l!=null&&Fa(l)));break;case 12:if(l&2048){$e(e,t,n,o),l=t.stateNode;try{var c=t.memoizedProps,i=c.id,r=c.onPostCommit;typeof r=="function"&&r(i,t.alternate===null?"mount":"update",l.passiveEffectDuration,-0)}catch(d){V(t,t.return,d)}}else $e(e,t,n,o);break;case 31:$e(e,t,n,o);break;case 13:$e(e,t,n,o);break;case 23:break;case 22:c=t.stateNode,i=t.alternate,t.memoizedState!==null?(a&&i!==null&&i.memoizedState===null&&Ll(i),c._visibility&2?$e(e,t,n,o):Ta(e,t)):(a&&i!==null&&i.memoizedState!==null&&Ll(t),c._visibility&2?$e(e,t,n,o):(c._visibility|=2,io(e,t,n,o,(t.subtreeFlags&10256)!==0||!1))),l&2048&&qu(i,t);break;case 24:$e(e,t,n,o),l&2048&&Yu(t.alternate,t);break;case 30:a&&(l=t.alternate,l!==null&&(zt(l.child,!0),zt(t.child,!0))),$e(e,t,n,o);break;default:$e(e,t,n,o)}}function io(e,t,n,o,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var l=e,c=t,i=n,r=o,d=c.flags;switch(c.tag){case 0:case 11:case 15:io(l,c,i,r,a),$a(8,c);break;case 23:break;case 22:var p=c.stateNode;c.memoizedState!==null?p._visibility&2?io(l,c,i,r,a):Ta(l,c):(p._visibility|=2,io(l,c,i,r,a)),a&&d&2048&&qu(c.alternate,c);break;case 24:io(l,c,i,r,a),a&&d&2048&&Yu(c.alternate,c);break;default:io(l,c,i,r,a)}t=t.sibling}}function Ta(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,o=t,a=o.flags;switch(o.tag){case 22:Ta(n,o),a&2048&&qu(o.alternate,o);break;case 24:Ta(n,o),a&2048&&Yu(o.alternate,o);break;default:Ta(n,o)}t=t.sibling}}var Cn=8192;function Nn(e,t,n){if(e.subtreeFlags&Cn)for(e=e.child;e!==null;)Vp(e,t,n),e=e.sibling}function Vp(e,t,n){switch(e.tag){case 26:Nn(e,t,n),e.flags&Cn&&(e.memoizedState!==null?O0(n,rt,e.memoizedState,e.memoizedProps):(e=e.stateNode,(t&335544128)===t&&Ns(n,e)));break;case 5:Nn(e,t,n),e.flags&Cn&&(e=e.stateNode,(t&335544128)===t&&Ns(n,e));break;case 3:case 4:var o=rt;rt=Ya(e.stateNode.containerInfo),Nn(e,t,n),rt=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=Cn,Cn=16777216,Nn(e,t,n),Cn=o):Nn(e,t,n));break;case 30:if((e.flags&Cn)!==0&&(o=e.memoizedProps.name,o!=null&&o!=="auto")){var a=e.stateNode;a.paired=null,Le===null&&(Le=new Map),Le.set(o,a)}Nn(e,t,n);break;default:Nn(e,t,n)}}function Qp(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function ca(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];be=o,Zp(o,e)}Qp(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Xp(e),e=e.sibling}function Xp(e){switch(e.tag){case 0:case 11:case 15:ca(e),e.flags&2048&&kn(9,e,e.return);break;case 3:ca(e);break;case 12:ca(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Vl(e)):ca(e);break;default:ca(e)}}function Vl(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];be=o,Zp(o,e)}Qp(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:kn(8,t,t.return),Vl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Vl(t));break;default:Vl(t)}e=e.sibling}}function Zp(e,t){for(;be!==null;){var n=be;switch(n.tag){case 0:case 11:case 15:kn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var o=n.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:Fa(n.memoizedState.cache)}if(o=n.child,o!==null)o.return=n,be=o;else e:for(n=e;be!==null;){o=be;var a=o.sibling,l=o.return;if(Up(o),o===n){be=null;break e}if(a!==null){a.return=l,be=a;break e}be=l}}}var Th={getCacheForType:function(e){var t=he(ce),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return he(ce).controller.signal}},zh=typeof WeakMap=="function"?WeakMap:Map,q=0,X=null,_=null,M=0,G=0,Ye=null,an=!1,Fo=!1,ju=!1,jt=0,te=0,Sn=0,qn=0,mc=0,Ve=0,Bo=0,za=null,De=null,Rr=!1,Yc=0,Kp=0,hc=1/0,yc=null,pn=null,P=0,dt=null,Zn=null,Tt=0,Ur=0,Br=null,Jp=null,Ao=null,_o=null,Co=null,Ea=0,Ql=null;function Ke(){return(q&2)!==0&&M!==0?M&-M:z.T!==null?Lu():Is()}function Fp(){if(Ve===0)if((M&536870912)===0||N){var e=sl;sl<<=1,(sl&3932160)===0&&(sl=262144),Ve=e}else Ve=536870912;return e=Se.current,e!==null&&(e.flags|=32),Ve}function Ho(e,t){if(t!=null){var n=e.stateNode,o=n.ref;o===null&&(o=n.ref=gv(Bt(e.memoizedProps,n))),_o===null&&(_o=[]),_o.push(t.bind(null,o))}}function Be(e,t,n){(e===X&&(G===2||G===9)||e.cancelPendingCommit!==null)&&(qo(e,0),ln(e,M,Ve,!1)),Za(e,n),((q&2)===0||e!==X)&&(e===X&&((q&2)===0&&(qn|=n),te===4&&ln(e,M,Ve,!1)),Ot(e))}function Wp(e,t,n){if((q&6)!==0)throw Error(h(327));var o=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Xa(e,t),a=o?Nh(e,t):Ri(e,t,!0),l=o;do{if(a===0){Fo&&!o&&ln(e,t,0,!1);break}else{if(n=e.current.alternate,l&&!Eh(n)){a=Ri(e,t,!1),l=!1;continue}if(a===2){if(l=t,e.errorRecoveryDisabledLanes&l)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var i=e;a=za;var r=i.current.memoizedState.isDehydrated;if(r&&(qo(i,c).flags|=256),c=Ri(i,c,!1),c!==2&&c!==6){if(ju&&!r){i.errorRecoveryDisabledLanes|=l,qn|=l,a=4;break e}l=De,De=a,l!==null&&(De===null?De=l:De.push.apply(De,l))}a=c}if(l=!1,a!==2)continue}}if(a===1){qo(e,0),ln(e,t,0,!0);break}e:{switch(o=e,l=a,l){case 0:case 1:throw Error(h(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:ln(o,t,Ve,!an);break e;case 2:De=null;break;case 3:case 5:break;default:throw Error(h(329))}if((t&62914560)===t&&(a=Yc+300-Qe(),10<a)){if(ln(o,t,Ve,!an),zc(o,0,!0)!==0)break e;Tt=t,o.timeoutHandle=Qu(os.bind(null,o,n,De,yc,Rr,t,Ve,qn,Bo,an,l,"Throttled",-0,0),a);break e}os(o,n,De,yc,Rr,t,Ve,qn,Bo,an,l,null,-0,0)}}break}while(!0);Ot(e)}function os(e,t,n,o,a,l,c,i,r,d,p,g,f,b){e.timeoutHandle=-1;var y=t.subtreeFlags,x=(l&335544064)===l;if(g=null,(x||y&8192||(y&16785408)===16785408)&&(g={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:xt},Le=null,Vp(t,l,g),x&&(y=g,x=e.containerInfo,x=(x.nodeType===9?x:x.ownerDocument).__reactViewTransition,x!=null&&(y.count++,y.waitingForViewTransition=!0,y=ja.bind(y),x.finished.then(y,y))),y=(l&62914560)===l?Yc-Qe():(l&4194048)===l?Kp-Qe():0,y=N0(g,y),y!==null)){Tt=l,e.cancelPendingCommit=y(ls.bind(null,e,t,l,n,o,a,c,i,r,d,p,g,null,f,b)),ln(e,l,c,!d);return}ls(e,t,l,n,o,a,c,i,r,d,p,g)}function Eh(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var o=0;o<n.length;o++){var a=n[o],l=a.getSnapshot;a=a.value;try{if(!Je(l(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function ln(e,t,n,o){t=Ks(e,t),t&=~mc,t&=~qn,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var a=t;0<a;){var l=31-Ze(a),c=1<<l;o[l]=-1,a&=~c}n!==0&&Fs(e,n,t)}function jc(){return(q&6)===0?(Ia(0,!1),!1):!0}function Gu(){if(_!==null){if(G===0)var e=_.return;else e=_,Mt=$n=null,Tu(e),Eo=null,Da=0,e=_;for(;e!==null;)Tp(e.alternate,e),e=e.return;_=null}}function qo(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,Jh(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Tt=0,Gu(),X=e,_=n=Dt(e.current,null),M=t,G=0,Ye=null,an=!1,Fo=Xa(e,t),ju=!1,Bo=Ve=mc=qn=Sn=te=0,De=za=null,Rr=!1,jt=Ks(e,t),_c(),n}function $p(e,t){O=null,z.H=fc,t===Ko||t===Dc?(t=_f(),G=3):t===gu?(t=_f(),G=4):G=t===Mu?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Ye=t,_===null&&(te=1,sc(e,nt(t,e.current)))}function Ip(){var e=Se.current;return e===null?!0:(M&4194048)===M?ze===null:(M&62914560)===M||(M&536870912)!==0?e===ze:!1}function Pp(){var e=z.H;return z.H=fc,e===null?fc:e}function ev(){var e=z.A;return z.A=Th,e}function xc(){te=4,an||(M&4194048)!==M&&Se.current!==null||(Fo=!0),(Sn&134217727)===0&&(qn&134217727)===0||X===null||ln(X,M,Ve,!1)}function Ri(e,t,n){var o=q;q|=2;var a=Pp(),l=ev();(X!==e||M!==t)&&(yc=null,qo(e,t)),t=!1;var c=te;e:do try{if(G!==0&&_!==null){var i=_,r=Ye;switch(G){case 8:Gu(),c=6;break e;case 3:case 2:case 9:case 6:Se.current===null&&(t=!0);var d=G;if(G=0,Ye=null,ko(e,i,r,d),n&&Fo){c=0;break e}break;default:d=G,G=0,Ye=null,ko(e,i,r,d)}}Oh(),c=te;break}catch(p){$p(e,p)}while(!0);return t&&e.shellSuspendCounter++,Mt=$n=null,q=o,z.H=a,z.A=l,_===null&&(X=null,M=0,_c()),c}function Oh(){for(;_!==null;)tv(_)}function Nh(e,t){var n=q;q|=2;var o=Pp(),a=ev();X!==e||M!==t?(yc=null,hc=Qe()+500,qo(e,t)):Fo=Xa(e,t);e:do try{if(G!==0&&_!==null){t=_;var l=Ye;t:switch(G){case 1:G=0,Ye=null,ko(e,t,l,1);break;case 2:case 9:if(Af(l)){G=0,Ye=null,as(t);break}t=function(){G!==2&&G!==9||X!==e||(G=7),Ot(e)},l.then(t,t);break e;case 3:G=7;break e;case 4:G=5;break e;case 7:Af(l)?(G=0,Ye=null,as(t)):(G=0,Ye=null,ko(e,t,l,7));break;case 5:var c=null;switch(_.tag){case 26:c=_.memoizedState;case 5:case 27:var i=_;if(c?Ev(c):i.stateNode.complete){G=0,Ye=null;var r=i.sibling;if(r!==null)_=r;else{var d=i.return;d!==null?(_=d,Gc(d)):_=null}break t}}G=0,Ye=null,ko(e,t,l,5);break;case 6:G=0,Ye=null,ko(e,t,l,6);break;case 8:Gu(),te=6;break e;default:throw Error(h(462))}}Ah();break}catch(p){$p(e,p)}while(!0);return Mt=$n=null,z.H=o,z.A=a,q=n,_!==null?0:(X=null,M=0,_c(),te)}function Ah(){for(;_!==null&&!Zg();)tv(_)}function tv(e){var t=wp(e.alternate,e,jt);e.memoizedProps=e.pendingProps,t===null?Gc(e):_=t}function as(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Zf(n,t,t.pendingProps,t.type,void 0,M);break;case 11:t=Zf(n,t,t.pendingProps,t.type.render,t.ref,M);break;case 5:Tu(t);var o=t;o===ve&&(N?(ac(o),o.tag===5&&o.stateNode!=null&&(F=o.stateNode)):(ac(o),N=!0));default:Tp(n,t),t=_=zb(t,jt),t=wp(n,t,jt)}e.memoizedProps=e.pendingProps,t===null?Gc(e):_=t}function ko(e,t,n,o){Mt=$n=null,Tu(t),Eo=null,Da=0;var a=t.return;try{if(gh(e,a,t,n,M)){te=1,sc(e,nt(n,e.current)),_=null;return}}catch(l){if(a!==null)throw _=a,l;te=1,sc(e,nt(n,e.current)),_=null;return}t.flags&32768?(N||o===1?e=!0:Fo||(M&536870912)!==0?e=!1:(an=e=!0,(o===2||o===9||o===3||o===6)&&(o=Se.current,o!==null&&o.tag===13&&(o.flags|=16384))),nv(t,e)):Gc(t)}function Gc(e){var t=e;do{if((t.flags&32768)!==0){nv(t,an);return}e=t.return;var n=xh(t.alternate,t,jt);if(n!==null){_=n;return}if(t=t.sibling,t!==null){_=t;return}_=t=e}while(t!==null);te===0&&(te=5)}function nv(e,t){do{var n=kh(e.alternate,e);if(n!==null){n.flags&=32767,_=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){_=e;return}_=e=n}while(e!==null);te=6,_=null}function ls(e,t,n,o,a,l,c,i,r,d,p,g){e.cancelPendingCommit=null;do Lc();while(P!==0);if((q&6)!==0)throw Error(h(327));if(t!==null){if(t===e.current)throw Error(h(177));e===X&&(_=X=null,M=0),Zn=t,dt=e,Tt=n,Br=a,Jp=o,_h(e,t,n,c,i,r,g)}}function _h(e,t,n,o,a,l,c){var i=t.lanes|t.childLanes;if(Ur=i,i|=du,nm(e,n,i,o,a,l),_o=null,(n&335544064)===n?(Co=ah(e),o=10262):(Co=null,o=10256),(t.subtreeFlags&o)!==0||(t.flags&o)!==0?(e.callbackNode=null,e.callbackPriority=0,Bh(Pl,function(){return jr(),null})):(e.callbackNode=null,e.callbackPriority=0),vc=!1,o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=z.T,z.T=null,a=Y.p,Y.p=2,l=q,q|=4;try{Sh(e,t,n)}finally{q=l,Y.p=a,z.T=o}}P=1,vc?Ao=e0(c,e.containerInfo,Co,Hr,qr,Mh,Yr,jr,Ch,null,null):(Hr(),qr(),Yr())}function Ch(e){if(P!==0){var t=dt.onRecoverableError;t(e,{componentStack:null})}}function Mh(){P===3&&(P=0,Gp(Zn,dt),P=4)}function Hr(){if(P===1){P=0;var e=dt,t=Zn,n=Tt,o=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||o){o=z.T,z.T=null;var a=Y.p;Y.p=2;var l=q;q|=4;try{ba=gc=!1,Yp(t,e,n),n=Qr;var c=mb(e.containerInfo),i=n.focusedElem,r=n.selectionRange;if(c!==i&&i&&i.ownerDocument&&gb(i.ownerDocument.documentElement,i)){if(r!==null&&uu(i)){var d=r.start,p=r.end;if(p===void 0&&(p=d),"selectionStart"in i)i.selectionStart=d,i.selectionEnd=Math.min(p,i.value.length);else{var g=i.ownerDocument||document,f=g&&g.defaultView||window;if(f.getSelection){var b=f.getSelection(),y=i.textContent.length,x=Math.min(r.start,y),w=r.end===void 0?x:Math.min(r.end,y);!b.extend&&x>w&&(c=w,w=x,x=c);var s=kf(i,x),u=kf(i,w);if(s&&u&&(b.rangeCount!==1||b.anchorNode!==s.node||b.anchorOffset!==s.offset||b.focusNode!==u.node||b.focusOffset!==u.offset)){var v=g.createRange();v.setStart(s.node,s.offset),b.removeAllRanges(),x>w?(b.addRange(v),b.extend(u.node,u.offset)):(v.setEnd(u.node,u.offset),b.addRange(v))}}}}for(g=[],b=i;b=b.parentNode;)b.nodeType===1&&g.push({element:b,left:b.scrollLeft,top:b.scrollTop});for(typeof i.focus=="function"&&i.focus(),i=0;i<g.length;i++){var m=g[i];m.element.scrollLeft=m.left,m.element.scrollTop=m.top}}Vo=!!Vr,Qr=Vr=null}finally{q=l,Y.p=a,z.T=o}}e.current=t,P=2}}function qr(){if(P===2){P=0;var e=dt,t=Zn,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=z.T,z.T=null;var o=Y.p;Y.p=2;var a=q;q|=4;try{Dp(e,t.alternate,t)}finally{q=a,Y.p=o,z.T=n}}P=3}}function Yr(){if(P===4||P===3){P=0;var e=Ao;Ao=null,Kg();var t=dt,n=Zn,o=Tt,a=Jp,l=(o&335544064)===o?10262:10256;if((n.subtreeFlags&l)!==0||(n.flags&l)!==0?P=5:(P=0,Zn=dt=null,ov(t,t.pendingLanes)),l=t.pendingLanes,l===0&&(pn=null),ou(o),n=n.stateNode,Xe&&typeof Xe.onCommitFiberRoot=="function")try{Xe.onCommitFiberRoot(Qa,n,void 0,(n.current.flags&128)===128)}catch{}if(a!==null){n=z.T,l=Y.p,Y.p=2,z.T=null;try{for(var c=t.onRecoverableError,i=0;i<a.length;i++){var r=a[i];c(r.value,{componentStack:r.stack})}}finally{z.T=n,Y.p=l}}if(a=_o,c=Co,Co=null,a!==null&&(_o=null,c===null&&(c=[]),e!==null))for(r=0;r<a.length;r++)n=(0,a[r])(c),n!==void 0&&e.finished.finally(n);(Tt&3)!==0&&Lc(),Ot(t),l=t.pendingLanes,(o&261930)!==0&&(l&42)!==0?t===Ql?Ea++:(Ea=0,Ql=t):(Ea=0,Ql=null),Ia(0,!1)}}function ov(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Fa(t)))}function Lc(){return Ao!==null&&(Ao.skipTransition(),Ao=null),Hr(),qr(),Yr(),jr()}function jr(){if(P!==5)return!1;var e=dt,t=Ur;Ur=0;var n=ou(Tt),o=z.T,a=Y.p;try{Y.p=32>n?32:n,z.T=null,n=Br,Br=null;var l=dt,c=Tt;if(P=0,Zn=dt=null,Tt=0,(q&6)!==0)throw Error(h(331));var i=q;if(q|=4,Xp(l.current),Lp(l,l.current,c,n),q=i,Ia(0,!1),Xe&&typeof Xe.onPostCommitFiberRoot=="function")try{Xe.onPostCommitFiberRoot(Qa,l)}catch{}return!0}finally{Y.p=a,z.T=o,ov(e,t)}}function cs(e,t,n){t=nt(n,t),t=yr(e.stateNode,t,2),e=fn(e,t,2),e!==null&&(Za(e,2),Ot(e))}function V(e,t,n){if(e.tag===3)cs(e,e,n);else for(;t!==null;){if(t.tag===3){cs(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(pn===null||!pn.has(o))){e=nt(n,e),n=hp(2),o=fn(t,n,2),o!==null&&(yp(n,o,t,e),Za(o,2),Ot(o));break}}t=t.return}}function Ui(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new zh;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(n)||(ju=!0,a.add(n),e=Dh.bind(null,e,t,n),t.then(e,e))}function Dh(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,X===e&&(M&n)===n&&((te===4||te===3&&(M&62914560)===M&&300>Qe()-Yc)&&(q&2)===0?qo(e,0):mc|=n,Bo===M&&(Bo=0)),Ot(e)}function av(e,t){t===0&&(t=Js()),e=Wn(e,t),e!==null&&(Za(e,t),Ot(e))}function Rh(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),av(e,n)}function Uh(e,t){var n=0;switch(e.tag){case 31:case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(h(314))}o!==null&&o.delete(t),av(e,n)}function Bh(e,t){return tu(e,t)}var Yo=null,ro=null,Gr=!1,kc=!1,Bi=!1,cn=0;function Ot(e){e!==ro&&e.next===null&&(ro===null?Yo=ro=e:ro=ro.next=e),kc=!0,Gr||(Gr=!0,qh())}function Ia(e,t){if(!Bi&&kc){Bi=!0;do for(var n=!1,o=Yo;o!==null;){if(!t)if(e!==0){var a=o.pendingLanes;if(a===0)var l=0;else{var c=o.suspendedLanes,i=o.pingedLanes;l=(1<<31-Ze(42|e)+1)-1,l&=a&~(c&~i),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(n=!0,is(o,l))}else l=M,l=zc(o,o===X?l:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(l&3)===0||Xa(o,l)||(n=!0,is(o,l));o=o.next}while(n);Bi=!1}}function Hh(){lv()}function lv(){kc=Gr=!1;var e=0;cn!==0&&Kh()&&(e=cn);for(var t=Qe(),n=null,o=Yo;o!==null;){var a=o.next,l=cv(o,t);l===0?(o.next=null,n===null?Yo=a:n.next=a,a===null&&(ro=n)):(n=o,(e!==0||(l&3)!==0)&&(kc=!0)),o=a}P!==0&&P!==5||Ia(e,!1),cn!==0&&(cn=0)}function cv(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var c=31-Ze(l),i=1<<c,r=a[c];r===-1?((i&n)===0||(i&o)!==0)&&(a[c]=tm(i,t)):r<=t&&(e.expiredLanes|=i),l&=~i}if(t=X,n=M,n=zc(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,n===0||e===t&&(G===2||G===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&pi(o),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Xa(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(o!==null&&pi(o),ou(n)){case 2:case 8:n=Xs;break;case 32:n=Pl;break;case 268435456:n=Zs;break;default:n=Pl}return o=iv.bind(null,e),n=tu(n,o),e.callbackPriority=t,e.callbackNode=n,t}return o!==null&&o!==null&&pi(o),e.callbackPriority=2,e.callbackNode=null,2}function iv(e,t){if(P!==0&&P!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Lc()&&e.callbackNode!==n)return null;var o=M;return o=zc(e,e===X?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(Wp(e,o,t),cv(e,Qe()),e.callbackNode!=null&&e.callbackNode===n?iv.bind(null,e):null)}function is(e,t){if(Lc())return null;Wp(e,t,!0)}function qh(){Fh(function(){(q&6)!==0?tu(Qs,Hh):lv()})}function Lu(){if(cn===0){var e=Ln;e===0&&(e=fl,fl<<=1,(fl&261888)===0&&(fl=256)),cn=e}return cn}function rs(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Ml(e)}function Yh(e,t,n,o,a){if(t==="submit"&&n&&n.stateNode===a){var l=rs((a[qe]||null).action),c=o.submitter;c&&(t=(t=c[qe]||null)?rs(t.formAction):c.getAttribute("formAction"),t!==null&&(l=t,c=null));var i=new Oc("action","action",null,o,a);e.push({event:i,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(cn!==0){var r=new FormData(a,c);mr(n,{pending:!0,data:r,method:a.method,action:l},null,r)}}else typeof l=="function"&&(i.preventDefault(),r=new FormData(a,c),mr(n,{pending:!0,data:r,method:a.method,action:l},l,r))},currentTarget:a}]})}}for(El=0;El<cr.length;El++)Ol=cr[El],us=Ol.toLowerCase(),ds=Ol[0].toUpperCase()+Ol.slice(1),ft(us,"on"+ds);var Ol,us,ds,El;ft(yb,"onAnimationEnd");ft(xb,"onAnimationIteration");ft(kb,"onAnimationStart");ft("dblclick","onDoubleClick");ft("focusin","onFocus");ft("focusout","onBlur");ft(Wm,"onTransitionRun");ft($m,"onTransitionStart");ft(Im,"onTransitionCancel");ft(Sb,"onTransitionEnd");Do("onMouseEnter",["mouseout","mouseover"]);Do("onMouseLeave",["mouseout","mouseover"]);Do("onPointerEnter",["pointerout","pointerover"]);Do("onPointerLeave",["pointerout","pointerover"]);Jn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Jn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Jn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Jn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Jn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Jn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ba="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),jh=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ba));function rv(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],a=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var c=o.length-1;0<=c;c--){var i=o[c],r=i.instance,d=i.currentTarget;if(i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(p){tc(p)}a.currentTarget=null,l=r}else for(c=0;c<o.length;c++){if(i=o[c],r=i.instance,d=i.currentTarget,i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(p){tc(p)}a.currentTarget=null,l=r}}}}function A(e,t){var n=t[of];n===void 0&&(n=t[of]=new Set);var o=e+"__bubble";n.has(o)||(uv(t,e,2,!1),n.add(o))}function Hi(e,t,n){var o=0;t&&(o|=4),uv(n,e,o,t)}var Nl="_reactListening"+Math.random().toString(36).slice(2);function Vu(e){if(!e[Nl]){e[Nl]=!0,eb.forEach(function(n){n!=="selectionchange"&&(jh.has(n)||Hi(n,!1,e),Hi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Nl]||(t[Nl]=!0,Hi("selectionchange",!1,t))}}function uv(e,t,n,o){switch(Dv(t)){case 2:var a=M0;break;case 8:a=D0;break;default:a=Wu}n=a.bind(null,t,n,e),a=void 0,!nr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function qi(e,t,n,o,a){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var i=o.stateNode.containerInfo;if(i===a)break;if(c===4)for(c=o.return;c!==null;){var r=c.tag;if((r===3||r===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;i!==null;){if(c=Mn(i),c===null)return;if(r=c.tag,r===5||r===6||r===26||r===27){o=l=c;continue e}i=i.parentNode}}o=o.return}rb(function(){var d=l,p=lu(n),g=[];e:{var f=wb.get(e);if(f!==void 0){var b=Oc,y=e;switch(e){case"keypress":if(Rl(n)===0)break e;case"keydown":case"keyup":b=Em;break;case"focusin":y="focus",b=xi;break;case"focusout":y="blur",b=xi;break;case"beforeblur":case"afterblur":b=xi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":b=sf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":b=pm;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":b=Cm;break;case yb:case xb:case kb:b=mm;break;case Sb:b=Dm;break;case"scroll":case"scrollend":b=sm;break;case"wheel":b=Um;break;case"copy":case"cut":case"paste":b=ym;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":b=pf;break;case"submit":b=Am;break;case"toggle":case"beforetoggle":b=Hm}var x=(t&4)!==0,w=!x&&(e==="scroll"||e==="scrollend"),s=x?f!==null?f+"Capture":null:f;x=[];for(var u=d,v;u!==null;){var m=u;if(v=m.stateNode,m=m.tag,m!==5&&m!==26&&m!==27||v===null||s===null||(m=Na(u,s),m!=null&&x.push(Ha(u,m,v))),w)break;u=u.return}0<x.length&&(f=new b(f,y,null,n,p),g.push({event:f,listeners:x}))}}if((t&7)===0){e:{if(b=e==="mouseover"||e==="pointerover",f=e==="mouseout"||e==="pointerout",b&&n!==tr&&(y=n.relatedTarget||n.fromElement)&&(Mn(y)||y[Xo]))break e;(f||b)&&(y=p.window===p?p:(b=p.ownerDocument)?b.defaultView||b.parentWindow:window,f?(b=n.relatedTarget||n.toElement,f=d,b=b?Mn(b):null,b!==null&&(w=Va(b),x=b.tag,b!==w||x!==5&&x!==27&&x!==6)&&(b=null)):(f=null,b=d),f!==b&&(x=sf,m="onMouseLeave",s="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(x=pf,m="onPointerLeave",s="onPointerEnter",u="pointer"),w=f==null?y:fa(f),v=b==null?y:fa(b),y=new x(m,u+"leave",f,n,p),y.target=w,y.relatedTarget=v,m=null,Mn(p)===d&&(x=new x(s,u+"enter",b,n,p),x.target=v,x.relatedTarget=w,m=x),w=m,x=f&&b?Vi(f,b,Gh):null,f!==null&&fs(g,y,f,x,!1),b!==null&&w!==null&&fs(g,w,b,x,!0)))}e:{if(f=d?fa(d):window,b=f.nodeName&&f.nodeName.toLowerCase(),b==="select"||b==="input"&&f.type==="file")var k=hf;else if(mf(f))if(pb)k=Km;else{k=Xm;var C=Qm}else b=f.nodeName,!b||b.toLowerCase()!=="input"||f.type!=="checkbox"&&f.type!=="radio"?d&&au(d.elementType)&&(k=hf):k=Zm;if(k&&(k=k(e,d))){bb(g,k,n,p);break e}C&&C(e,f,d)}switch(C=d?fa(d):window,e){case"focusin":(mf(C)||C.contentEditable==="true")&&(vo=C,ar=d,ga=null);break;case"focusout":ga=ar=vo=null;break;case"mousedown":lr=!0;break;case"contextmenu":case"mouseup":case"dragend":lr=!1,Sf(g,n,p);break;case"selectionchange":if(Fm)break;case"keydown":case"keyup":Sf(g,n,p)}var S;if(ru)e:{switch(e){case"compositionstart":var T="onCompositionStart";break e;case"compositionend":T="onCompositionEnd";break e;case"compositionupdate":T="onCompositionUpdate";break e}T=void 0}else po?fb(e,n)&&(T="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(T="onCompositionStart");T&&(db&&n.locale!=="ko"&&(po||T!=="onCompositionStart"?T==="onCompositionEnd"&&po&&(S=ub()):(nn=p,cu="value"in nn?nn.value:nn.textContent,po=!0)),C=Sc(d,T),0<C.length&&(T=new bf(T,e,null,n,p),g.push({event:T,listeners:C}),S?T.data=S:(S=sb(n),S!==null&&(T.data=S)))),(S=Ym?jm(e,n):Gm(e,n))&&(T=Sc(d,"onBeforeInput"),0<T.length&&(C=new bf("onBeforeInput","beforeinput",null,n,p),g.push({event:C,listeners:T}),C.data=S)),Yh(g,e,d,n,p)}rv(g,t)})}function Ha(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Sc(e,t){for(var n=t+"Capture",o=[];e!==null;){var a=e,l=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||l===null||(a=Na(e,n),a!=null&&o.unshift(Ha(e,a,l)),a=Na(e,t),a!=null&&o.push(Ha(e,a,l))),e.tag===3)return o;e=e.return}return[]}function Gh(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function fs(e,t,n,o,a){for(var l=t._reactName,c=[];n!==null&&n!==o;){var i=n,r=i.alternate,d=i.stateNode;if(i=i.tag,r!==null&&r===o)break;i!==5&&i!==26&&i!==27||d===null||(r=d,a?(d=Na(n,l),d!=null&&c.unshift(Ha(n,d,r))):a||(d=Na(n,l),d!=null&&c.push(Ha(n,d,r)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var Lh=/\r\n?/g,Vh=/\u0000|\uFFFD/g;function ss(e){return(typeof e=="string"?e:""+e).replace(Lh,`
`).replace(Vh,"")}function dv(e,t){return t=ss(t),ss(e)===t}function L(e,t,n,o,a,l){switch(n){case"children":if(typeof o=="string")t==="body"||t==="textarea"&&o===""||Ro(e,o);else if(typeof o=="number"||typeof o=="bigint")t!=="body"&&Ro(e,""+o);else return;break;case"className":pl(e,"class",o);break;case"tabIndex":pl(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":pl(e,n,o);break;case"style":ib(e,o,l);return;case"data":if(t!=="object"){pl(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Ml(o),e.setAttribute(n,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(n==="formAction"?(t!=="input"&&L(e,t,"name",a.name,a,null),L(e,t,"formEncType",a.formEncType,a,null),L(e,t,"formMethod",a.formMethod,a,null),L(e,t,"formTarget",a.formTarget,a,null)):(L(e,t,"encType",a.encType,a,null),L(e,t,"method",a.method,a,null),L(e,t,"target",a.target,a,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Ml(o),e.setAttribute(n,o);break;case"onClick":o!=null&&(e.onclick=xt);return;case"onScroll":o!=null&&A("scroll",e);return;case"onScrollEnd":o!=null&&A("scrollend",e);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}n=Ml(o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":o===!0?e.setAttribute(n,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(n,o):e.removeAttribute(n);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(n):e.setAttribute(n,o);break;case"popover":A("beforetoggle",e),A("toggle",e),Cl(e,"popover",o);break;case"xlinkActuate":At(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":At(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":At(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":At(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":At(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":At(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":At(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":At(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":At(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":Cl(e,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")n=dm.get(n)||n,Cl(e,n,o);else return}U=!0}function Lr(e,t,n,o,a,l){switch(n){case"style":ib(e,o,l);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"children":if(typeof o=="string")Ro(e,o);else if(typeof o=="number"||typeof o=="bigint")Ro(e,""+o);else return;break;case"onScroll":o!=null&&A("scroll",e);return;case"onScrollEnd":o!=null&&A("scrollend",e);return;case"onClick":o!=null&&(e.onclick=xt);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!tb.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),l=n.slice(2,a?n.length-7:void 0),t=e[qe]||null,t=t!=null?t[n]:null,typeof t=="function"&&e.removeEventListener(l,t,a),typeof o=="function")){typeof t!="function"&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(l,o,a);break e}U=!0,n in e?e[n]=o:o===!0?e.setAttribute(n,""):Cl(e,n,o)}return}U=!0}function ke(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":A("error",e),A("load",e);var o=!1,a=!1,l;for(l in n)if(n.hasOwnProperty(l)){var c=n[l];if(c!=null)switch(l){case"src":o=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:L(e,t,l,c,n,null)}}a&&L(e,t,"srcSet",n.srcSet,n,null),o&&L(e,t,"src",n.src,n,null);return;case"input":A("invalid",e);var i=l=c=a=null,r=null,d=null;for(o in n)if(n.hasOwnProperty(o)){var p=n[o];if(p!=null)switch(o){case"name":a=p;break;case"type":c=p;break;case"checked":r=p;break;case"defaultChecked":d=p;break;case"value":l=p;break;case"defaultValue":i=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(h(137,t));break;default:L(e,t,o,p,n,null)}}ab(e,l,i,r,d,c,a,!1);return;case"select":A("invalid",e),o=c=l=null;for(a in n)if(n.hasOwnProperty(a)&&(i=n[a],i!=null))switch(a){case"value":l=i;break;case"defaultValue":c=i;break;case"multiple":o=i;default:L(e,t,a,i,n,null)}t=l,n=c,e.multiple=!!o,t!=null?wo(e,!!o,t,!1):n!=null&&wo(e,!!o,n,!0);return;case"textarea":A("invalid",e),l=a=o=null;for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"value":o=i;break;case"defaultValue":a=i;break;case"children":l=i;break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(h(91));break;default:L(e,t,c,i,n,null)}cb(e,o,a,l);return;case"option":for(r in n)n.hasOwnProperty(r)&&(o=n[r],o!=null)&&(r==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":L(e,t,r,o,n,null));return;case"dialog":A("beforetoggle",e),A("toggle",e),A("cancel",e),A("close",e);break;case"iframe":case"object":A("load",e);break;case"video":case"audio":for(o=0;o<Ba.length;o++)A(Ba[o],e);break;case"image":A("error",e),A("load",e);break;case"details":A("toggle",e);break;case"embed":case"source":case"link":A("error",e),A("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(d in n)if(n.hasOwnProperty(d)&&(o=n[d],o!=null))switch(d){case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:L(e,t,d,o,n,null)}return;default:if(au(t)){for(p in n)n.hasOwnProperty(p)&&(o=n[p],o!==void 0&&Lr(e,t,p,o,n,void 0));return}}for(i in n)n.hasOwnProperty(i)&&(o=n[i],o!=null&&L(e,t,i,o,n,null))}var Qh={};function Xh(e,t,n,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,l=null,c=null,i=null,r=null,d=null,p=null;for(b in n){var g=n[b];if(n.hasOwnProperty(b)&&g!=null)switch(b){case"checked":break;case"value":break;case"defaultValue":r=g;default:o.hasOwnProperty(b)||L(e,t,b,null,o,g)}}for(var f in o){var b=o[f];if(g=n[f],o.hasOwnProperty(f)&&(b!=null||g!=null))switch(f){case"type":b!==g&&(U=!0),l=b;break;case"name":b!==g&&(U=!0),a=b;break;case"checked":b!==g&&(U=!0),d=b;break;case"defaultChecked":b!==g&&(U=!0),p=b;break;case"value":b!==g&&(U=!0),c=b;break;case"defaultValue":b!==g&&(U=!0),i=b;break;case"children":case"dangerouslySetInnerHTML":if(b!=null)throw Error(h(137,t));break;default:b!==g&&L(e,t,f,b,o,g)}}er(e,c,i,r,d,p,l,a);return;case"select":b=c=i=f=null;for(l in n)if(r=n[l],n.hasOwnProperty(l)&&r!=null)switch(l){case"value":break;case"multiple":b=r;default:o.hasOwnProperty(l)||L(e,t,l,null,o,r)}for(a in o)if(l=o[a],r=n[a],o.hasOwnProperty(a)&&(l!=null||r!=null))switch(a){case"value":l!==r&&(U=!0),f=l;break;case"defaultValue":l!==r&&(U=!0),i=l;break;case"multiple":l!==r&&(U=!0),c=l;default:l!==r&&L(e,t,a,l,o,r)}t=i,n=c,o=b,f!=null?wo(e,!!n,f,!1):!!o!=!!n&&(t!=null?wo(e,!!n,t,!0):wo(e,!!n,n?[]:"",!1));return;case"textarea":b=f=null;for(i in n)if(a=n[i],n.hasOwnProperty(i)&&a!=null&&!o.hasOwnProperty(i))switch(i){case"value":break;case"children":break;default:L(e,t,i,null,o,a)}for(c in o)if(a=o[c],l=n[c],o.hasOwnProperty(c)&&(a!=null||l!=null))switch(c){case"value":a!==l&&(U=!0),f=a;break;case"defaultValue":a!==l&&(U=!0),b=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(h(91));break;default:a!==l&&L(e,t,c,a,o,l)}lb(e,f,b);return;case"option":for(var y in n)f=n[y],n.hasOwnProperty(y)&&f!=null&&!o.hasOwnProperty(y)&&(y==="selected"?e.selected=!1:L(e,t,y,null,o,f));for(r in o)f=o[r],b=n[r],o.hasOwnProperty(r)&&f!==b&&(f!=null||b!=null)&&(r==="selected"?(f!==b&&(U=!0),e.selected=f&&typeof f!="function"&&typeof f!="symbol"):L(e,t,r,f,o,b));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var x in n)f=n[x],n.hasOwnProperty(x)&&f!=null&&!o.hasOwnProperty(x)&&L(e,t,x,null,o,f);for(d in o)if(f=o[d],b=n[d],o.hasOwnProperty(d)&&f!==b&&(f!=null||b!=null))switch(d){case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(h(137,t));break;default:L(e,t,d,f,o,b)}return;default:if(au(t)){for(var w in n)f=n[w],n.hasOwnProperty(w)&&f!==void 0&&!o.hasOwnProperty(w)&&Lr(e,t,w,void 0,o,f);for(p in o)f=o[p],b=n[p],!o.hasOwnProperty(p)||f===b||f===void 0&&b===void 0||Lr(e,t,p,f,o,b);return}}for(var s in n)f=n[s],n.hasOwnProperty(s)&&f!=null&&!o.hasOwnProperty(s)&&L(e,t,s,null,o,f);for(g in o)f=o[g],b=n[g],!o.hasOwnProperty(g)||f===b||f==null&&b==null||L(e,t,g,f,o,b)}function bs(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Zh(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),o=0;o<n.length;o++){var a=n[o],l=a.transferSize,c=a.initiatorType,i=a.duration;if(l&&i&&bs(c)){for(c=0,i=a.responseEnd,o+=1;o<n.length;o++){var r=n[o],d=r.startTime;if(d>i)break;var p=r.transferSize,g=r.initiatorType;p&&bs(g)&&(r=r.responseEnd,c+=p*(r<i?1:(i-d)/(r-d)))}if(--o,t+=8*(l+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Vr=null,Qr=null;function qa(e){return e.nodeType===9?e:e.ownerDocument}function ps(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function fv(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function sv(e,t,n,o){return n=qa(n).createElement(e),n[me]=o,n[qe]=t,ke(n,e,t),pe(n),n}function Xr(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Yi=null;function Kh(){var e=window.event;return e&&e.type==="popstate"?e===Yi?!1:(Yi=e,!0):(Yi=null,!1)}var Qu=typeof setTimeout=="function"?setTimeout:void 0,Jh=typeof clearTimeout=="function"?clearTimeout:void 0,vs=typeof Promise=="function"?Promise:void 0,gs=typeof requestAnimationFrame=="function"?requestAnimationFrame:Qu,Fh=typeof queueMicrotask=="function"?queueMicrotask:typeof vs<"u"?function(e){return vs.resolve(null).then(e).catch(Wh)}:Qu;function Wh(e){setTimeout(function(){throw e})}function Tn(e){return e==="head"}function ms(e,t){var n=t,o=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(o===0){e.removeChild(a),Qo(t);return}o--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")o++;else if(n==="html")Gi(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Gi(n);for(var l=n.firstChild;l;){var c=l.nextSibling,i=l.nodeName;l[Ka]||i==="SCRIPT"||i==="STYLE"||i==="LINK"&&l.rel.toLowerCase()==="stylesheet"||n.removeChild(l),l=c}}else n==="body"&&Gi(e.ownerDocument.body);n=a}while(n);Qo(t)}function hs(e,t){var n=e;e=0;do{var o=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=o}while(n)}function bv(e,t,n){if(t=CSS.escape(t)!==t?"r-"+btoa(t).replace(/=/g,""):t,e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display==="inline"){if(t=e.getClientRects(),t.length===1)var o=1;else for(var a=o=0;a<t.length;a++){var l=t[a];0<l.width&&0<l.height&&o++}o===1&&(e=e.style,e.display=t.length===1?"inline-block":"block",e.marginTop="-"+n.paddingTop,e.marginBottom="-"+n.paddingBottom)}}function pv(e,t){e=e.style,t=t.style;var n=t!=null?t.hasOwnProperty("viewTransitionName")?t.viewTransitionName:t.hasOwnProperty("view-transition-name")?t["view-transition-name"]:null:null;e.viewTransitionName=n==null||typeof n=="boolean"?"":(""+n).trim(),n=t!=null?t.hasOwnProperty("viewTransitionClass")?t.viewTransitionClass:t.hasOwnProperty("view-transition-class")?t["view-transition-class"]:null:null,e.viewTransitionClass=n==null||typeof n=="boolean"?"":(""+n).trim(),e.display==="inline-block"&&(t==null?e.display=e.margin="":(n=t.display,e.display=n==null||typeof n=="boolean"?"":n,n=t.margin,n!=null?e.margin=n:(n=t.hasOwnProperty("marginTop")?t.marginTop:t["margin-top"],e.marginTop=n==null||typeof n=="boolean"?"":n,t=t.hasOwnProperty("marginBottom")?t.marginBottom:t["margin-bottom"],e.marginBottom=t==null||typeof t=="boolean"?"":t)))}function vv(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position==="absolute"||t.position==="fixed",clip:t.clipPath!=="none"||t.overflow!=="visible"||t.filter!=="none"||t.mask!=="none"||t.mask!=="none"||t.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Zr(e){var t=e.getBoundingClientRect(),n=getComputedStyle(e);return vv(t,n,e)}function $h(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return vv(t,n,e)}function Ih(e){return e.documentElement.clientHeight}function Ph(e){this.addEventListener("load",e),this.addEventListener("error",e)}function e0(e,t,n,o,a,l,c,i,r){var d=t.nodeType===9?t:t.ownerDocument;try{var p=d.startViewTransition({update:function(){var f=d.defaultView,b=f.navigation&&f.navigation.transition,y=d.fonts.status;o();var x=[];if(y==="loaded"&&(Ih(d),d.fonts.status==="loading"&&x.push(d.fonts.ready)),y=x.length,e!==null)for(var w=e.suspenseyImages,s=0,u=0;u<w.length;u++){var v=w[u];if(!v.complete){var m=v.getBoundingClientRect();if(0<m.bottom&&0<m.right&&m.top<f.innerHeight&&m.left<f.innerWidth){if(s+=Ov(v),s>Kl){x.length=y;break}v=new Promise(Ph.bind(v)),x.push(v)}}}if(0<x.length)return f=Promise.race([Promise.all(x),new Promise(function(k){return setTimeout(k,500)})]).then(a,a),(b?Promise.allSettled([b.finished,f]):f).then(l,l);if(a(),b)return b.finished.then(l,l);l()},types:n});d.__reactViewTransition=p;var g=[];return p.ready.then(function(){for(var f=d.documentElement.getAnimations({subtree:!0}),b=0;b<f.length;b++){var y=f[b],x=y.effect,w=x.pseudoElement;if(w!=null&&w.startsWith("::view-transition")){g.push(y),y=x.getKeyframes();for(var s=w=void 0,u=!0,v=0;v<y.length;v++){var m=y[v],k=m.width;if(w===void 0)w=k;else if(w!==k){u=!1;break}if(k=m.height,s===void 0)s=k;else if(s!==k){u=!1;break}delete m.width,delete m.height,m.transform==="none"&&delete m.transform}u&&w!==void 0&&s!==void 0&&(x.setKeyframes(y),u=getComputedStyle(x.target,x.pseudoElement),u.width!==w||u.height!==s)&&(u=y[0],u.width=w,u.height=s,u=y[y.length-1],u.width=w,u.height=s,x.setKeyframes(y))}}c()},function(f){d.__reactViewTransition===p&&(d.__reactViewTransition=null);try{typeof f=="object"&&f!==null&&f.name==="InvalidStateError"&&(f.message==="View transition was skipped because document visibility state is hidden."||f.message==="Skipping view transition because document visibility state has become hidden."||f.message==="Skipping view transition because viewport size changed."||f.message==="Transition was aborted because of invalid state")&&(f=null),f!==null&&r(f)}finally{o(),a(),c()}}),p.finished.finally(function(){for(var f=0;f<g.length;f++)g[f].cancel();d.__reactViewTransition===p&&(d.__reactViewTransition=null),i()}),p}catch{return o(),a(),c(),null}}function Dn(e,t){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+t+")"}Dn.prototype.animate=function(e,t){return t=typeof t=="number"?{duration:t}:Z({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)};Dn.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),o=[],a=0;a<n.length;a++){var l=n[a].effect;l!==null&&l.target===e&&l.pseudoElement===t&&o.push(n[a])}return o};Dn.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function gv(e){return{name:e,group:new Dn("group",e),imagePair:new Dn("image-pair",e),old:new Dn("old",e),new:new Dn("new",e)}}function Fe(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Fe.prototype.addEventListener=function(e,t,n){var o=null,a=null;if(!(n!=null&&typeof n!="boolean"&&(o=n.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var l=this._eventListeners;if(mv(l,e,t,n)===-1){var c=this,i=t;n!=null&&typeof n!="boolean"&&n.once===!0&&(i=function(r){c.removeEventListener(e,t,n),typeof t=="function"?t.call(this,r):t.handleEvent(r)}),o!==null&&(a=c.removeEventListener.bind(c,e,t,n),o.addEventListener("abort",a,{once:!0}),a=o.removeEventListener.bind(o,"abort",a)),o=jo(n),l.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:i,cleanup:a}),He(this._fragmentFiber.child,!1,t0,e,i,o)}this._eventListeners=l}};function t0(e,t,n,o){return de(e).addEventListener(t,n,o),!1}Fe.prototype.removeEventListener=function(e,t,n){var o=this._eventListeners;if(o!==null&&(t=mv(o,e,t,n),t!==-1)){var a=o[t];n=a.attachedListener;var l=a.cleanup;a=jo(a.optionsOrUseCapture),He(this._fragmentFiber.child,!1,n0,e,n,a),o.splice(t,1),l!==null&&l()}};function n0(e,t,n,o){return de(e).removeEventListener(t,n,o),!1}function jo(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function ys(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function mv(e,t,n,o){if(e.length===0)return-1;o=ys(o);for(var a=0;a<e.length;a++){var l=e[a];if(l.type===t&&l.listener===n&&ys(l.optionsOrUseCapture)===o)return a}return-1}Fe.prototype.dispatchEvent=function(e){var t=Kn(this._fragmentFiber);if(t===null)return!0;t=de(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var o=t.nodeType===9?t.createComment(""):document.createTextNode("");if(n)for(var a=0;a<n.length;a++){var l=n[a];o.addEventListener(l.type,l.attachedListener,jo(l.optionsOrUseCapture))}if(t.appendChild(o),e=o.dispatchEvent(e),n)for(a=0;a<n.length;a++)l=n[a],o.removeEventListener(l.type,l.attachedListener,jo(l.optionsOrUseCapture));return t.removeChild(o),e}return t.dispatchEvent(e)};Fe.prototype.focus=function(e){He(this._fragmentFiber.child,!0,hv,e,void 0,void 0)};function hv(e,t){return e.tag===6?!1:(e=de(e),p0(e,t))}Fe.prototype.focusLast=function(e){var t=[];He(this._fragmentFiber.child,!0,Xu,t,void 0,void 0);for(var n=t.length-1;0<=n&&!hv(t[n],e);n--);};function Xu(e,t){return t.push(e),!1}Fe.prototype.blur=function(){var e=Kn(this._fragmentFiber);e!==null&&(e=de(e),e=qa(e).activeElement,e!==null&&He(this._fragmentFiber.child,!1,o0,e,void 0,void 0))};function o0(e,t){return e.tag===6?!1:(e=de(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Fe.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),He(this._fragmentFiber.child,!1,a0,e,void 0,void 0)};function a0(e,t){return e.tag===6||(e=de(e),t.observe(e)),!1}Fe.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),He(this._fragmentFiber.child,!1,l0,e,void 0,void 0);for(var n=t=0;n<ut.length;n++){var o=ut[n];o.fragmentInstance===this&&o.observer===e?e.unobserve(o.instance):ut[t++]=o}ut.length=t}};function l0(e,t){return e.tag===6||(e=de(e),t.unobserve(e)),!1}var ut=[],ji=!1;function c0(e,t,n){ut.push({fragmentInstance:e,observer:t,instance:n}),ji||(ji=!0,v0(function(){ji=!1;var o=ut;ut=[];for(var a=0;a<o.length;a++){var l=o[a];l.observer.unobserve(l.instance)}}))}Fe.prototype.getClientRects=function(){var e=[];return He(this._fragmentFiber.child,!1,i0,e,void 0,void 0),e};function i0(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=de(e),t.push.apply(t,e.getClientRects());return!1}Fe.prototype.getRootNode=function(e){var t=Kn(this._fragmentFiber);return t===null?this:de(t).getRootNode(e)};Fe.prototype.compareDocumentPosition=function(e){var t=Kn(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];He(this._fragmentFiber.child,!1,Xu,n,void 0,void 0);var o=de(t);if(n.length===0){if(n=o,$d(this._fragmentFiber)){e:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break e}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var a=o=n.compareDocumentPosition(e);return n===e?a=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=js(t)[1],n===null?a=Node.DOCUMENT_POSITION_PRECEDING:(e=de(n).compareDocumentPosition(e),a=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),a|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=de(n[0]),a=de(n[n.length-1]);var l=$d(this._fragmentFiber)?t.parentElement:o;if(l==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=l.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,l=l.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_CONTAINED_BY;var c=t.compareDocumentPosition(e),i=a.compareDocumentPosition(e),r=c&Node.DOCUMENT_POSITION_CONTAINED_BY||i&Node.DOCUMENT_POSITION_CONTAINED_BY;return i=o&&l&&c&Node.DOCUMENT_POSITION_FOLLOWING&&i&Node.DOCUMENT_POSITION_PRECEDING,t=o&&t===e||l&&a===e||r||i?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&t===e||!l&&a===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:c,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||r0(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function r0(e,t,n,o,a){var l=Mn(a);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!l)e:{for(;l!==null;){if(l.tag===7&&(l===t||l.alternate===t)){n=!0;break e}l=l.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(l===null)return l=a.ownerDocument,a===l||a===l.documentElement||a===l.body;e:{for(l=t,t=Kn(t);l!==null;){if(!(l.tag!==5&&l.tag!==3&&l.tag!==27||l!==t&&l.alternate!==t)){l=!0;break e}l=l.return}l=!1}return l}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!l)&&!(t=l===n)&&(t=Vi(n,l,Id),t===null?t=!1:(He(t,!0,qg,l,n),l=uo,uo=null,t=l!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!l)&&!(t=l===o)&&(t=Vi(o,l,Id),t===null?t=!1:(He(t,!0,Yg,l,o),l=uo,Li=uo=null,t=l!==null)),t):!1}function xs(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Fe.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(h(566));var t=[];He(this._fragmentFiber.child,!1,Xu,t,void 0,void 0);var n=e!==!1;if(t.length===0){var o=js(this._fragmentFiber);if(o=n?o[1]||o[0]||Kn(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){e=de(o),xs(e,n);return}if(o=de(o),o.nodeType!==9){if(o.nodeType===11){n="host"in o?o.host:null,n!==null&&n.scrollIntoView(e);return}o.scrollIntoView(e)}}for(o=n?t.length-1:0;o!==(n?-1:t.length);){var a=t[o];a.tag===6?(a=de(a),xs(a,n)):de(a).scrollIntoView(e),o+=n?-1:1}};function u0(e,t){return e=de(e),yv(e,t),!1}function yv(e,t){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(t)}function xv(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.addEventListener(a.type,a.attachedListener,jo(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){for(var c=0,i=0;i<ut.length;i++){var r=ut[i];(r.fragmentInstance!==t||r.observer!==l||r.instance!==e)&&(ut[c++]=r)}ut.length=c,l.observe(e)}),yv(e,t))}function d0(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.removeEventListener(a.type,a.attachedListener,jo(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){typeof l.rootMargin=="string"?c0(t,l,e):l.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function Kr(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Kr(n),Ec(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function f0(e,t,n,o){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[Ka])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var l=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=at(e.nextSibling),e===null)break}return null}function s0(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=at(e.nextSibling),e===null))return null;return e}function kv(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=at(e.nextSibling),e===null))return null;return e}function Jr(e){return e.data==="$?"||e.data==="$~"}function Zu(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function b0(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var o=function(){t(),n.removeEventListener("DOMContentLoaded",o)};n.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function at(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Fr=null;function ks(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return at(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Ss(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function p0(e,t){function n(){o=!0}if(e.ownerDocument.activeElement===e)return!0;var o=!1;try{e.ownerDocument.addEventListener("focus",n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener("focus",n,!0)}return o}function v0(e){gs(function(){gs(function(t){return e(t)})})}function Sv(e,t,n){switch(t=qa(n),e){case"html":if(e=t.documentElement,!e)throw Error(h(452));return e;case"head":if(e=t.head,!e)throw Error(h(453));return e;case"body":if(e=t.body,!e)throw Error(h(454));return e;default:throw Error(h(451))}}function wv(e,t,n){for(var o in n){var a=n[o];n.hasOwnProperty(o)&&a!=null&&L(e,t,o,null,Qh,a)}n.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===xt&&(e.onclick=null),Ec(e)}function Gi(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Ec(e)}var lt=new Map,ws=new Set;function Ya(e){if(typeof e.getRootNode=="function"){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var Vt=Y.d;Y.d={f:g0,r:m0,D:h0,C:y0,L:x0,m:k0,X:w0,S:S0,M:T0};function g0(){var e=Vt.f(),t=jc();return e||t}function m0(e){var t=Zo(e);t!==null&&t.tag===5&&t.type==="form"?ip(t):Vt.r(e)}var Wo=typeof document>"u"?null:document;function Tv(e,t,n){var o=Wo;if(o&&typeof t=="string"&&t){var a=tt(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),ws.has(a)||(ws.add(a),e={rel:e,crossOrigin:n,href:t},o.querySelector(a)===null&&(t=o.createElement("link"),ke(t,"link",e),pe(t),o.head.appendChild(t)))}}function h0(e){Vt.D(e),Tv("dns-prefetch",e,null)}function y0(e,t){Vt.C(e,t),Tv("preconnect",e,t)}function x0(e,t,n){Vt.L(e,t,n);var o=Wo;if(o&&e&&t){var a='link[rel="preload"][as="'+tt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+tt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+tt(n.imageSizes)+'"]')):a+='[href="'+tt(e)+'"]';var l=a;switch(t){case"style":l=Go(e);break;case"script":l=$o(e)}if(!(lt.has(l)||(e=Z({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),lt.set(l,e),o.querySelector(a)!==null||t==="style"&&o.querySelector(Pa(l))||t==="script"&&o.querySelector(el(l))))){var c=o.createElement("link");ke(c,"link",e),t==="style"&&(c[ec]=!0,c.onload=c.onerror=function(){Ps(c)}),pe(c),o.head.appendChild(c)}}}function k0(e,t){Vt.m(e,t);var n=Wo;if(n&&e){var o=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+tt(o)+'"][href="'+tt(e)+'"]',l=a;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=$o(e)}if(!lt.has(l)&&(e=Z({rel:"modulepreload",href:e},t),lt.set(l,e),n.querySelector(a)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(el(l)))return}o=n.createElement("link"),ke(o,"link",e),pe(o),n.head.appendChild(o)}}}function S0(e,t,n){Vt.S(e,t,n);var o=Wo;if(o&&e){var a=So(o).hoistableStyles,l=Go(e);t=t||"default";var c=a.get(l);if(!c){var i={loading:0,preload:null};if(c=o.querySelector(Pa(l)))i.loading=5;else{e=Z({rel:"stylesheet",href:e,"data-precedence":t},n),(n=lt.get(l))&&Ku(e,n);var r=c=o.createElement("link");pe(r),ke(r,"link",e),r._p=new Promise(function(d,p){r.onload=d,r.onerror=p}),r.addEventListener("load",function(){i.loading|=1}),r.addEventListener("error",function(){i.loading|=2}),i.loading|=4,Xl(c,t,o)}c={type:"stylesheet",instance:c,count:1,state:i},a.set(l,c)}}}function w0(e,t){Vt.X(e,t);var n=Wo;if(n&&e){var o=So(n).hoistableScripts,a=$o(e),l=o.get(a);l||(l=n.querySelector(el(a)),l||(e=Z({src:e,async:!0},t),(t=lt.get(a))&&Ju(e,t),l=n.createElement("script"),pe(l),ke(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function T0(e,t){Vt.M(e,t);var n=Wo;if(n&&e){var o=So(n).hoistableScripts,a=$o(e),l=o.get(a);l||(l=n.querySelector(el(a)),l||(e=Z({src:e,async:!0,type:"module"},t),(t=lt.get(a))&&Ju(e,t),l=n.createElement("script"),pe(l),ke(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function Ts(e,t,n,o){var a=(a=rn.current)?Ya(a):null;if(!a)throw Error(h(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(n=Go(n.href),t=So(a).hoistableStyles,o=t.get(n),o||(o={type:"style",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Go(n.href);var l=So(a).hoistableStyles,c=l.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,c),(l=a.querySelector(Pa(e)))?l._p||(c.instance=l,c.state.loading=5):(l=lt.get(e),l||(l={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},lt.set(e,l)),z0(a,e,l,c.state))),t&&o===null)throw Error(h(528,""));return c}if(t&&o!==null)throw Error(h(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(n=$o(n),t=So(a).hoistableScripts,o=t.get(n),o||(o={type:"script",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(h(444,e))}}function Go(e){return'href="'+tt(e)+'"'}function Pa(e){return'link[rel="stylesheet"]['+e+"]"}function zv(e){return Z({},e,{"data-precedence":e.precedence,precedence:null})}function z0(e,t,n,o){if(t=e.querySelector('link[rel="preload"][as="style"]['+t+"]")){if(t[ec]!==!0){o.loading=1;return}}else t=e.createElement("link"),t[ec]=!0,t.onload=t.onerror=Ps.bind(null,t),ke(t,"link",n),pe(t),e.head.appendChild(t);o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2})}function $o(e){return'[src="'+tt(e)+'"]'}function el(e){return"script[async]"+e}function zs(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+tt(n.href)+'"]');if(o)return t.instance=o,pe(o),o;var a=Z({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),pe(o),ke(o,"style",a),Xl(o,n.precedence,e),t.instance=o;case"stylesheet":a=Go(n.href);var l=e.querySelector(Pa(a));if(l)return t.state.loading|=4,t.instance=l,pe(l),l;o=zv(n),(a=lt.get(a))&&Ku(o,a),l=(e.ownerDocument||e).createElement("link"),pe(l);var c=l;return c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),ke(l,"link",o),t.state.loading|=4,Xl(l,n.precedence,e),t.instance=l;case"script":return l=$o(n.src),(a=e.querySelector(el(l)))?(t.instance=a,pe(a),a):(o=n,(a=lt.get(l))&&(o=Z({},n),Ju(o,a)),e=e.ownerDocument||e,a=e.createElement("script"),pe(a),ke(a,"link",o),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(h(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,Xl(o,n.precedence,e));return t.instance}function Xl(e,t,n){for(var o=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=o.length?o[o.length-1]:null,l=a,c=0;c<o.length;c++){var i=o[c];if(i.dataset.precedence===t)l=i;else if(l!==a)break}l?l.parentNode.insertBefore(e,l.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Ku(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Ju(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Zl=null;function Es(e,t,n){if(Zl===null){var o=new Map,a=Zl=new Map;a.set(n,o)}else a=Zl,o=a.get(n),o||(o=new Map,a.set(n,o));if(o.has(e))return o;for(o.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var l=n[a];if(!(l[Ka]||l[me]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var c=l.getAttribute(t)||"";c=e+c;var i=o.get(c);i?i.push(l):o.set(c,[l])}}return o}function Wr(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function E0(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Os(e,t){return e==="img"&&t.src!=null&&t.src!==""&&t.onLoad==null&&t.loading!=="lazy"}function Ev(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Ov(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function Ns(e,t){typeof t.decode=="function"&&(e.imgCount++,t.complete||(e.imgBytes+=Ov(t),e.suspenseyImages.push(t)),e=A0.bind(e),t.decode().then(e,e))}function O0(e,t,n,o){if(n.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=Go(o.href),l=t.querySelector(Pa(a));if(l){t=l._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=ja.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=l,pe(l);return}l=t.ownerDocument||t,o=zv(o),(a=lt.get(a))&&Ku(o,a),l=l.createElement("link"),pe(l);var c=l;c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),ke(l,"link",o),n.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=ja.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Kl=0;function N0(e,t){return e.stylesheets&&e.count===0&&Jl(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var o=setTimeout(function(){if(e.stylesheets&&Jl(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+t);0<e.imgBytes&&Kl===0&&(Kl=62500*Zh());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Jl(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>Kl?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(a)}}:null}function Nv(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)Jl(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function ja(){this.count--,Nv(this)}function A0(){this.imgCount--,Nv(this)}var wc=null;function Jl(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,wc=new Map,t.forEach(_0,e),wc=null,ja.call(e))}function _0(e,t){if(!(t.state.loading&4)){var n=wc.get(e);if(n)var o=n.get(null);else{n=new Map,wc.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<a.length;l++){var c=a[l];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),o=c)}o&&n.set(null,o)}a=t.instance,c=a.getAttribute("data-precedence"),l=n.get(c)||o,l===o&&n.set(null,a),n.set(c,a),this.count++,o=ja.bind(this),a.addEventListener("load",o),a.addEventListener("error",o),l?l.parentNode.insertBefore(a,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var Lo={$$typeof:yt,Provider:null,Consumer:null,_currentValue:Rn,_currentValue2:Rn,_threadCount:0};function C0(e,t,n,o,a,l,c,i,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=vi(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=vi(0),this.hiddenUpdates=vi(null),this.identifierPrefix=o,this.onUncaughtError=a,this.onCaughtError=l,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.transitionTypes=null,this.incompleteTransitions=new Map}function Av(e,t,n,o,a,l,c,i,r,d,p,g){return e=new C0(e,t,n,c,r,d,p,g,i),t=1,l===!0&&(t|=24),l=Ue(3,null,null,t),e.current=l,l.stateNode=e,t=pu(),t.refCount++,e.pooledCache=t,t.refCount++,l.memoizedState={element:o,isDehydrated:n,cache:t},mu(l),e}function _v(e){return e?(e=ho,e):ho}function Cv(e,t,n,o,a,l){a=_v(a),o.context===null?o.context=a:o.pendingContext=a,o=dn(t),o.payload={element:n},l=l===void 0?null:l,l!==null&&(o.callback=l),n=fn(e,o,t),n!==null&&(Be(n,e,t),ha(n,e,t))}function As(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Fu(e,t){As(e,t),(e=e.alternate)&&As(e,t)}function Mv(e){if(e.tag===13||e.tag===31){var t=Wn(e,67108864);t!==null&&Be(t,e,67108864),Fu(e,67108864)}}function _s(e){if(e.tag===13||e.tag===31){var t=Ke();t=nu(t);var n=Wn(e,t);n!==null&&Be(n,e,t),Fu(e,t)}}var Vo=!0;function M0(e,t,n,o){var a=z.T;z.T=null;var l=Y.p;try{Y.p=2,Wu(e,t,n,o)}finally{Y.p=l,z.T=a}}function D0(e,t,n,o){var a=z.T;z.T=null;var l=Y.p;try{Y.p=8,Wu(e,t,n,o)}finally{Y.p=l,z.T=a}}function Wu(e,t,n,o){if(Vo){var a=$r(o);if(a===null)qi(e,t,o,Tc,n),Cs(e,o);else if(U0(a,e,t,n,o))o.stopPropagation();else if(Cs(e,o),t&4&&-1<R0.indexOf(e)){for(;a!==null;){var l=Zo(a);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var c=An(l.pendingLanes);if(c!==0){var i=l;for(i.pendingLanes|=2,i.entangledLanes|=2;c;){var r=1<<31-Ze(c);i.entanglements[1]|=r,c&=~r}Ot(l),(q&6)===0&&(hc=Qe()+500,Ia(0,!1))}}break;case 31:case 13:i=Wn(l,2),i!==null&&Be(i,l,2),jc(),Fu(l,2)}if(l=$r(o),l===null&&qi(e,t,o,Tc,n),l===a)break;a=l}a!==null&&o.stopPropagation()}else qi(e,t,o,null,n)}}function $r(e){return e=lu(e),$u(e)}var Tc=null;function $u(e){if(Tc=null,e=Mn(e),e!==null){var t=Va(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=Hs(t),e!==null)return e;e=null}else if(n===31){if(e=qs(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Tc=e,null}function Dv(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Jg()){case Qs:return 2;case Xs:return 8;case Pl:case Fg:return 32;case Zs:return 268435456;default:return 32}default:return 32}}var Ir=!1,vn=null,gn=null,mn=null,Ga=new Map,La=new Map,en=[],R0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Cs(e,t){switch(e){case"focusin":case"focusout":vn=null;break;case"dragenter":case"dragleave":gn=null;break;case"mouseover":case"mouseout":mn=null;break;case"pointerover":case"pointerout":Ga.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":La.delete(t.pointerId)}}function ia(e,t,n,o,a,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:l,targetContainers:[a]},t!==null&&(t=Zo(t),t!==null&&Mv(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function U0(e,t,n,o,a){switch(t){case"focusin":return vn=ia(vn,e,t,n,o,a),!0;case"dragenter":return gn=ia(gn,e,t,n,o,a),!0;case"mouseover":return mn=ia(mn,e,t,n,o,a),!0;case"pointerover":var l=a.pointerId;return Ga.set(l,ia(Ga.get(l)||null,e,t,n,o,a)),!0;case"gotpointercapture":return l=a.pointerId,La.set(l,ia(La.get(l)||null,e,t,n,o,a)),!0}return!1}function Rv(e){var t=Mn(e.target);if(t!==null){var n=Va(t);if(n!==null){if(t=n.tag,t===13){if(t=Hs(n),t!==null){e.blockedOn=t,nf(e.priority,function(){_s(n)});return}}else if(t===31){if(t=qs(n),t!==null){e.blockedOn=t,nf(e.priority,function(){_s(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Fl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=$r(e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);tr=o,n.target.dispatchEvent(o),tr=null}else return t=Zo(n),t!==null&&Mv(t),e.blockedOn=n,!1;t.shift()}return!0}function Ms(e,t,n){Fl(e)&&n.delete(t)}function B0(){Ir=!1,vn!==null&&Fl(vn)&&(vn=null),gn!==null&&Fl(gn)&&(gn=null),mn!==null&&Fl(mn)&&(mn=null),Ga.forEach(Ms),La.forEach(Ms)}function Al(e,t){e.blockedOn===t&&(e.blockedOn=null,Ir||(Ir=!0,fe.unstable_scheduleCallback(fe.unstable_NormalPriority,B0)))}var _l=null;function Ds(e){_l!==e&&(_l=e,fe.unstable_scheduleCallback(fe.unstable_NormalPriority,function(){_l===e&&(_l=null);for(var t=0;t<e.length;t+=3){var n=e[t],o=e[t+1],a=e[t+2];if(typeof o!="function"){if($u(o||n)===null)continue;break}var l=Zo(n);l!==null&&(e.splice(t,3),t-=3,mr(l,{pending:!0,data:a,method:n.method,action:o},o,a))}}))}function Qo(e){function t(r){return Al(r,e)}vn!==null&&Al(vn,e),gn!==null&&Al(gn,e),mn!==null&&Al(mn,e),Ga.forEach(t),La.forEach(t);for(var n=0;n<en.length;n++){var o=en[n];o.blockedOn===e&&(o.blockedOn=null)}for(;0<en.length&&(n=en[0],n.blockedOn===null);)Rv(n),n.blockedOn===null&&en.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(o=0;o<n.length;o+=3){var a=n[o],l=n[o+1],c=a[qe]||null;if(typeof l=="function")c||Ds(n);else if(c){var i=null;if(l&&l.hasAttribute("formAction")){if(a=l,c=l[qe]||null)i=c.formAction;else if($u(a)!==null)continue}else i=c.action;typeof i=="function"?n[o+1]=i:(n.splice(o,3),o-=3),Ds(n)}}}function Uv(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),o||setTimeout(n,20)}function n(){if(!o&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Iu(e){this._internalRoot=e}Vc.prototype.render=Iu.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(h(409));var n=t.current,o=Ke();Cv(n,o,e,t,null,null)};Vc.prototype.unmount=Iu.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Cv(e.current,2,null,e,null,null),jc(),t[Xo]=null}};function Vc(e){this._internalRoot=e}Vc.prototype.unstable_scheduleHydration=function(e){if(e){var t=Is();e={blockedOn:null,target:e,priority:t};for(var n=0;n<en.length&&t!==0&&t<en[n].priority;n++);en.splice(n,0,e),n===0&&Rv(e)}};var Rs=Us.version;if(Rs!=="19.3.0")throw Error(h(527,Rs,"19.3.0"));Y.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(h(188)):(e=Object.keys(e).join(","),Error(h(268,e)));return e=Hg(t),e=e!==null?Ys(e):null,e=e===null?null:e.stateNode,e};var H0={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:z,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(ra=__REACT_DEVTOOLS_GLOBAL_HOOK__,!ra.isDisabled&&ra.supportsFiber))try{Qa=ra.inject(H0),Xe=ra}catch{}var ra;Qc.createRoot=function(e,t){if(!Bs(e))throw Error(h(299));var n=!1,o="",a=vp,l=gp,c=mp;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(l=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=Av(e,1,!1,null,null,n,o,null,a,l,c,Uv),e[Xo]=t.current,Vu(e),new Iu(t)};Qc.hydrateRoot=function(e,t,n){if(!Bs(e))throw Error(h(299));var o=!1,a="",l=vp,c=gp,i=mp,r=null;return n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(l=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(i=n.onRecoverableError),n.formState!==void 0&&(r=n.formState)),t=Av(e,1,!0,t,n??null,o,a,r,l,c,i,Uv),t.context=_v(null),n=t.current,o=Ke(),o=nu(o),a=dn(o),a.callback=null,fn(n,a,o),n=o,t.current.lanes=n,Za(t,n),Ot(t),e[Xo]=t.current,Vu(e),new Vc(t)};Qc.version="19.3.0"});var Yv=st((gy,qv)=>{"use strict";function Hv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Hv)}catch(e){console.error(e)}}Hv(),qv.exports=Bv()});var nd=`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

@font-face {
	font-family: "codicon";
	font-display: block;
	src: url("./codicon.ttf?9aab6318a6710999273bab9c78a9fd71") format("truetype");
}

.codicon[class*='codicon-'] {
	font: normal normal normal 16px/1 codicon;
	display: inline-block;
	text-decoration: none;
	text-rendering: auto;
	text-align: center;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
}

/*---------------------
 *  Modifiers
 *-------------------*/

@keyframes codicon-spin {
	100% {
		transform:rotate(360deg);
	}
}

.codicon-sync.codicon-modifier-spin,
.codicon-loading.codicon-modifier-spin,
.codicon-gear.codicon-modifier-spin {
	/* Use steps to throttle FPS to reduce CPU usage */
	animation: codicon-spin 1.5s steps(30) infinite;
}

.codicon-modifier-disabled {
	opacity: 0.5;
}

.codicon-modifier-hidden {
	opacity: 0;
}

/* custom speed & easing for loading icon */
.codicon-loading {
	animation-duration: 1s !important;
	animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67) !important;
}

/*---------------------
 *  Icons
 *-------------------*/

.codicon-add:before { content: "\\ea60" }
.codicon-plus:before { content: "\\ea60" }
.codicon-gist-new:before { content: "\\ea60" }
.codicon-repo-create:before { content: "\\ea60" }
.codicon-lightbulb:before { content: "\\ea61" }
.codicon-light-bulb:before { content: "\\ea61" }
.codicon-repo:before { content: "\\ea62" }
.codicon-repo-delete:before { content: "\\ea62" }
.codicon-gist-fork:before { content: "\\ea63" }
.codicon-repo-forked:before { content: "\\ea63" }
.codicon-git-pull-request:before { content: "\\ea64" }
.codicon-git-pull-request-abandoned:before { content: "\\ea64" }
.codicon-record-keys:before { content: "\\ea65" }
.codicon-keyboard:before { content: "\\ea65" }
.codicon-tag:before { content: "\\ea66" }
.codicon-git-pull-request-label:before { content: "\\ea66" }
.codicon-tag-add:before { content: "\\ea66" }
.codicon-tag-remove:before { content: "\\ea66" }
.codicon-person:before { content: "\\ea67" }
.codicon-person-follow:before { content: "\\ea67" }
.codicon-person-outline:before { content: "\\ea67" }
.codicon-person-filled:before { content: "\\ea67" }
.codicon-source-control:before { content: "\\ea68" }
.codicon-mirror:before { content: "\\ea69" }
.codicon-mirror-public:before { content: "\\ea69" }
.codicon-star:before { content: "\\ea6a" }
.codicon-star-add:before { content: "\\ea6a" }
.codicon-star-delete:before { content: "\\ea6a" }
.codicon-star-empty:before { content: "\\ea6a" }
.codicon-comment:before { content: "\\ea6b" }
.codicon-comment-add:before { content: "\\ea6b" }
.codicon-alert:before { content: "\\ea6c" }
.codicon-warning:before { content: "\\ea6c" }
.codicon-search:before { content: "\\ea6d" }
.codicon-search-save:before { content: "\\ea6d" }
.codicon-log-out:before { content: "\\ea6e" }
.codicon-sign-out:before { content: "\\ea6e" }
.codicon-log-in:before { content: "\\ea6f" }
.codicon-sign-in:before { content: "\\ea6f" }
.codicon-eye:before { content: "\\ea70" }
.codicon-eye-unwatch:before { content: "\\ea70" }
.codicon-eye-watch:before { content: "\\ea70" }
.codicon-circle-filled:before { content: "\\ea71" }
.codicon-primitive-dot:before { content: "\\ea71" }
.codicon-close-dirty:before { content: "\\ea71" }
.codicon-debug-breakpoint:before { content: "\\ea71" }
.codicon-debug-breakpoint-disabled:before { content: "\\ea71" }
.codicon-debug-hint:before { content: "\\ea71" }
.codicon-terminal-decoration-success:before { content: "\\ea71" }
.codicon-primitive-square:before { content: "\\ea72" }
.codicon-edit:before { content: "\\ea73" }
.codicon-pencil:before { content: "\\ea73" }
.codicon-info:before { content: "\\ea74" }
.codicon-issue-opened:before { content: "\\ea74" }
.codicon-gist-private:before { content: "\\ea75" }
.codicon-git-fork-private:before { content: "\\ea75" }
.codicon-lock:before { content: "\\ea75" }
.codicon-mirror-private:before { content: "\\ea75" }
.codicon-close:before { content: "\\ea76" }
.codicon-remove-close:before { content: "\\ea76" }
.codicon-x:before { content: "\\ea76" }
.codicon-repo-sync:before { content: "\\ea77" }
.codicon-sync:before { content: "\\ea77" }
.codicon-clone:before { content: "\\ea78" }
.codicon-desktop-download:before { content: "\\ea78" }
.codicon-beaker:before { content: "\\ea79" }
.codicon-microscope:before { content: "\\ea79" }
.codicon-vm:before { content: "\\ea7a" }
.codicon-device-desktop:before { content: "\\ea7a" }
.codicon-file:before { content: "\\ea7b" }
.codicon-more:before { content: "\\ea7c" }
.codicon-ellipsis:before { content: "\\ea7c" }
.codicon-kebab-horizontal:before { content: "\\ea7c" }
.codicon-mail-reply:before { content: "\\ea7d" }
.codicon-reply:before { content: "\\ea7d" }
.codicon-organization:before { content: "\\ea7e" }
.codicon-organization-filled:before { content: "\\ea7e" }
.codicon-organization-outline:before { content: "\\ea7e" }
.codicon-new-file:before { content: "\\ea7f" }
.codicon-file-add:before { content: "\\ea7f" }
.codicon-new-folder:before { content: "\\ea80" }
.codicon-file-directory-create:before { content: "\\ea80" }
.codicon-trash:before { content: "\\ea81" }
.codicon-trashcan:before { content: "\\ea81" }
.codicon-history:before { content: "\\ea82" }
.codicon-clock:before { content: "\\ea82" }
.codicon-folder:before { content: "\\ea83" }
.codicon-file-directory:before { content: "\\ea83" }
.codicon-symbol-folder:before { content: "\\ea83" }
.codicon-logo-github:before { content: "\\ea84" }
.codicon-mark-github:before { content: "\\ea84" }
.codicon-github:before { content: "\\ea84" }
.codicon-terminal:before { content: "\\ea85" }
.codicon-console:before { content: "\\ea85" }
.codicon-repl:before { content: "\\ea85" }
.codicon-zap:before { content: "\\ea86" }
.codicon-symbol-event:before { content: "\\ea86" }
.codicon-error:before { content: "\\ea87" }
.codicon-stop:before { content: "\\ea87" }
.codicon-variable:before { content: "\\ea88" }
.codicon-symbol-variable:before { content: "\\ea88" }
.codicon-array:before { content: "\\ea8a" }
.codicon-symbol-array:before { content: "\\ea8a" }
.codicon-symbol-module:before { content: "\\ea8b" }
.codicon-symbol-package:before { content: "\\ea8b" }
.codicon-symbol-namespace:before { content: "\\ea8b" }
.codicon-symbol-object:before { content: "\\ea8b" }
.codicon-symbol-method:before { content: "\\ea8c" }
.codicon-symbol-function:before { content: "\\ea8c" }
.codicon-symbol-constructor:before { content: "\\ea8c" }
.codicon-symbol-boolean:before { content: "\\ea8f" }
.codicon-symbol-null:before { content: "\\ea8f" }
.codicon-symbol-numeric:before { content: "\\ea90" }
.codicon-symbol-number:before { content: "\\ea90" }
.codicon-symbol-structure:before { content: "\\ea91" }
.codicon-symbol-struct:before { content: "\\ea91" }
.codicon-symbol-parameter:before { content: "\\ea92" }
.codicon-symbol-type-parameter:before { content: "\\ea92" }
.codicon-symbol-key:before { content: "\\ea93" }
.codicon-symbol-text:before { content: "\\ea93" }
.codicon-symbol-reference:before { content: "\\ea94" }
.codicon-go-to-file:before { content: "\\ea94" }
.codicon-symbol-enum:before { content: "\\ea95" }
.codicon-symbol-value:before { content: "\\ea95" }
.codicon-symbol-ruler:before { content: "\\ea96" }
.codicon-symbol-unit:before { content: "\\ea96" }
.codicon-activate-breakpoints:before { content: "\\ea97" }
.codicon-archive:before { content: "\\ea98" }
.codicon-arrow-both:before { content: "\\ea99" }
.codicon-arrow-down:before { content: "\\ea9a" }
.codicon-arrow-left:before { content: "\\ea9b" }
.codicon-arrow-right:before { content: "\\ea9c" }
.codicon-arrow-small-down:before { content: "\\ea9d" }
.codicon-arrow-small-left:before { content: "\\ea9e" }
.codicon-arrow-small-right:before { content: "\\ea9f" }
.codicon-arrow-small-up:before { content: "\\eaa0" }
.codicon-arrow-up:before { content: "\\eaa1" }
.codicon-bell:before { content: "\\eaa2" }
.codicon-bold:before { content: "\\eaa3" }
.codicon-book:before { content: "\\eaa4" }
.codicon-bookmark:before { content: "\\eaa5" }
.codicon-debug-breakpoint-conditional-unverified:before { content: "\\eaa6" }
.codicon-debug-breakpoint-conditional:before { content: "\\eaa7" }
.codicon-debug-breakpoint-conditional-disabled:before { content: "\\eaa7" }
.codicon-debug-breakpoint-data-unverified:before { content: "\\eaa8" }
.codicon-debug-breakpoint-data:before { content: "\\eaa9" }
.codicon-debug-breakpoint-data-disabled:before { content: "\\eaa9" }
.codicon-debug-breakpoint-log-unverified:before { content: "\\eaaa" }
.codicon-debug-breakpoint-log:before { content: "\\eaab" }
.codicon-debug-breakpoint-log-disabled:before { content: "\\eaab" }
.codicon-briefcase:before { content: "\\eaac" }
.codicon-broadcast:before { content: "\\eaad" }
.codicon-browser:before { content: "\\eaae" }
.codicon-bug:before { content: "\\eaaf" }
.codicon-calendar:before { content: "\\eab0" }
.codicon-case-sensitive:before { content: "\\eab1" }
.codicon-check:before { content: "\\eab2" }
.codicon-checklist:before { content: "\\eab3" }
.codicon-chevron-down:before { content: "\\eab4" }
.codicon-chevron-left:before { content: "\\eab5" }
.codicon-chevron-right:before { content: "\\eab6" }
.codicon-chevron-up:before { content: "\\eab7" }
.codicon-chrome-close:before { content: "\\eab8" }
.codicon-chrome-maximize:before { content: "\\eab9" }
.codicon-chrome-minimize:before { content: "\\eaba" }
.codicon-chrome-restore:before { content: "\\eabb" }
.codicon-circle-outline:before { content: "\\eabc" }
.codicon-circle:before { content: "\\eabc" }
.codicon-debug-breakpoint-unverified:before { content: "\\eabc" }
.codicon-terminal-decoration-incomplete:before { content: "\\eabc" }
.codicon-circle-slash:before { content: "\\eabd" }
.codicon-circuit-board:before { content: "\\eabe" }
.codicon-clear-all:before { content: "\\eabf" }
.codicon-clippy:before { content: "\\eac0" }
.codicon-close-all:before { content: "\\eac1" }
.codicon-cloud-download:before { content: "\\eac2" }
.codicon-cloud-upload:before { content: "\\eac3" }
.codicon-code:before { content: "\\eac4" }
.codicon-collapse-all:before { content: "\\eac5" }
.codicon-color-mode:before { content: "\\eac6" }
.codicon-comment-discussion:before { content: "\\eac7" }
.codicon-credit-card:before { content: "\\eac9" }
.codicon-dash:before { content: "\\eacc" }
.codicon-dashboard:before { content: "\\eacd" }
.codicon-database:before { content: "\\eace" }
.codicon-debug-continue:before { content: "\\eacf" }
.codicon-debug-disconnect:before { content: "\\ead0" }
.codicon-debug-pause:before { content: "\\ead1" }
.codicon-debug-restart:before { content: "\\ead2" }
.codicon-debug-start:before { content: "\\ead3" }
.codicon-debug-step-into:before { content: "\\ead4" }
.codicon-debug-step-out:before { content: "\\ead5" }
.codicon-debug-step-over:before { content: "\\ead6" }
.codicon-debug-stop:before { content: "\\ead7" }
.codicon-debug:before { content: "\\ead8" }
.codicon-device-camera-video:before { content: "\\ead9" }
.codicon-device-camera:before { content: "\\eada" }
.codicon-device-mobile:before { content: "\\eadb" }
.codicon-diff-added:before { content: "\\eadc" }
.codicon-diff-ignored:before { content: "\\eadd" }
.codicon-diff-modified:before { content: "\\eade" }
.codicon-diff-removed:before { content: "\\eadf" }
.codicon-diff-renamed:before { content: "\\eae0" }
.codicon-diff:before { content: "\\eae1" }
.codicon-diff-sidebyside:before { content: "\\eae1" }
.codicon-discard:before { content: "\\eae2" }
.codicon-editor-layout:before { content: "\\eae3" }
.codicon-empty-window:before { content: "\\eae4" }
.codicon-exclude:before { content: "\\eae5" }
.codicon-extensions:before { content: "\\eae6" }
.codicon-eye-closed:before { content: "\\eae7" }
.codicon-file-binary:before { content: "\\eae8" }
.codicon-file-code:before { content: "\\eae9" }
.codicon-file-media:before { content: "\\eaea" }
.codicon-file-pdf:before { content: "\\eaeb" }
.codicon-file-submodule:before { content: "\\eaec" }
.codicon-file-symlink-directory:before { content: "\\eaed" }
.codicon-file-symlink-file:before { content: "\\eaee" }
.codicon-file-zip:before { content: "\\eaef" }
.codicon-files:before { content: "\\eaf0" }
.codicon-filter:before { content: "\\eaf1" }
.codicon-flame:before { content: "\\eaf2" }
.codicon-fold-down:before { content: "\\eaf3" }
.codicon-fold-up:before { content: "\\eaf4" }
.codicon-fold:before { content: "\\eaf5" }
.codicon-folder-active:before { content: "\\eaf6" }
.codicon-folder-opened:before { content: "\\eaf7" }
.codicon-gear:before { content: "\\eaf8" }
.codicon-gift:before { content: "\\eaf9" }
.codicon-gist-secret:before { content: "\\eafa" }
.codicon-gist:before { content: "\\eafb" }
.codicon-git-commit:before { content: "\\eafc" }
.codicon-git-compare:before { content: "\\eafd" }
.codicon-compare-changes:before { content: "\\eafd" }
.codicon-git-merge:before { content: "\\eafe" }
.codicon-github-action:before { content: "\\eaff" }
.codicon-github-alt:before { content: "\\eb00" }
.codicon-globe:before { content: "\\eb01" }
.codicon-grabber:before { content: "\\eb02" }
.codicon-graph:before { content: "\\eb03" }
.codicon-gripper:before { content: "\\eb04" }
.codicon-heart:before { content: "\\eb05" }
.codicon-home:before { content: "\\eb06" }
.codicon-horizontal-rule:before { content: "\\eb07" }
.codicon-hubot:before { content: "\\eb08" }
.codicon-inbox:before { content: "\\eb09" }
.codicon-issue-reopened:before { content: "\\eb0b" }
.codicon-issues:before { content: "\\eb0c" }
.codicon-italic:before { content: "\\eb0d" }
.codicon-jersey:before { content: "\\eb0e" }
.codicon-json:before { content: "\\eb0f" }
.codicon-bracket:before { content: "\\eb0f" }
.codicon-kebab-vertical:before { content: "\\eb10" }
.codicon-key:before { content: "\\eb11" }
.codicon-law:before { content: "\\eb12" }
.codicon-lightbulb-autofix:before { content: "\\eb13" }
.codicon-link-external:before { content: "\\eb14" }
.codicon-link:before { content: "\\eb15" }
.codicon-list-ordered:before { content: "\\eb16" }
.codicon-list-unordered:before { content: "\\eb17" }
.codicon-live-share:before { content: "\\eb18" }
.codicon-loading:before { content: "\\eb19" }
.codicon-location:before { content: "\\eb1a" }
.codicon-mail-read:before { content: "\\eb1b" }
.codicon-mail:before { content: "\\eb1c" }
.codicon-markdown:before { content: "\\eb1d" }
.codicon-megaphone:before { content: "\\eb1e" }
.codicon-mention:before { content: "\\eb1f" }
.codicon-milestone:before { content: "\\eb20" }
.codicon-git-pull-request-milestone:before { content: "\\eb20" }
.codicon-mortar-board:before { content: "\\eb21" }
.codicon-move:before { content: "\\eb22" }
.codicon-multiple-windows:before { content: "\\eb23" }
.codicon-mute:before { content: "\\eb24" }
.codicon-no-newline:before { content: "\\eb25" }
.codicon-note:before { content: "\\eb26" }
.codicon-octoface:before { content: "\\eb27" }
.codicon-open-preview:before { content: "\\eb28" }
.codicon-package:before { content: "\\eb29" }
.codicon-paintcan:before { content: "\\eb2a" }
.codicon-pin:before { content: "\\eb2b" }
.codicon-play:before { content: "\\eb2c" }
.codicon-run:before { content: "\\eb2c" }
.codicon-plug:before { content: "\\eb2d" }
.codicon-preserve-case:before { content: "\\eb2e" }
.codicon-preview:before { content: "\\eb2f" }
.codicon-project:before { content: "\\eb30" }
.codicon-pulse:before { content: "\\eb31" }
.codicon-question:before { content: "\\eb32" }
.codicon-quote:before { content: "\\eb33" }
.codicon-radio-tower:before { content: "\\eb34" }
.codicon-reactions:before { content: "\\eb35" }
.codicon-references:before { content: "\\eb36" }
.codicon-refresh:before { content: "\\eb37" }
.codicon-regex:before { content: "\\eb38" }
.codicon-remote-explorer:before { content: "\\eb39" }
.codicon-remote:before { content: "\\eb3a" }
.codicon-remove:before { content: "\\eb3b" }
.codicon-replace-all:before { content: "\\eb3c" }
.codicon-replace:before { content: "\\eb3d" }
.codicon-repo-clone:before { content: "\\eb3e" }
.codicon-repo-force-push:before { content: "\\eb3f" }
.codicon-repo-pull:before { content: "\\eb40" }
.codicon-repo-push:before { content: "\\eb41" }
.codicon-report:before { content: "\\eb42" }
.codicon-request-changes:before { content: "\\eb43" }
.codicon-rocket:before { content: "\\eb44" }
.codicon-root-folder-opened:before { content: "\\eb45" }
.codicon-root-folder:before { content: "\\eb46" }
.codicon-rss:before { content: "\\eb47" }
.codicon-ruby:before { content: "\\eb48" }
.codicon-save-all:before { content: "\\eb49" }
.codicon-save-as:before { content: "\\eb4a" }
.codicon-save:before { content: "\\eb4b" }
.codicon-screen-full:before { content: "\\eb4c" }
.codicon-screen-normal:before { content: "\\eb4d" }
.codicon-search-stop:before { content: "\\eb4e" }
.codicon-server:before { content: "\\eb50" }
.codicon-settings-gear:before { content: "\\eb51" }
.codicon-settings:before { content: "\\eb52" }
.codicon-shield:before { content: "\\eb53" }
.codicon-smiley:before { content: "\\eb54" }
.codicon-sort-precedence:before { content: "\\eb55" }
.codicon-split-horizontal:before { content: "\\eb56" }
.codicon-split-vertical:before { content: "\\eb57" }
.codicon-squirrel:before { content: "\\eb58" }
.codicon-star-full:before { content: "\\eb59" }
.codicon-star-half:before { content: "\\eb5a" }
.codicon-symbol-class:before { content: "\\eb5b" }
.codicon-symbol-color:before { content: "\\eb5c" }
.codicon-symbol-constant:before { content: "\\eb5d" }
.codicon-symbol-enum-member:before { content: "\\eb5e" }
.codicon-symbol-field:before { content: "\\eb5f" }
.codicon-symbol-file:before { content: "\\eb60" }
.codicon-symbol-interface:before { content: "\\eb61" }
.codicon-symbol-keyword:before { content: "\\eb62" }
.codicon-symbol-misc:before { content: "\\eb63" }
.codicon-symbol-operator:before { content: "\\eb64" }
.codicon-symbol-property:before { content: "\\eb65" }
.codicon-wrench:before { content: "\\eb65" }
.codicon-wrench-subaction:before { content: "\\eb65" }
.codicon-symbol-snippet:before { content: "\\eb66" }
.codicon-tasklist:before { content: "\\eb67" }
.codicon-telescope:before { content: "\\eb68" }
.codicon-text-size:before { content: "\\eb69" }
.codicon-three-bars:before { content: "\\eb6a" }
.codicon-thumbsdown:before { content: "\\eb6b" }
.codicon-thumbsup:before { content: "\\eb6c" }
.codicon-tools:before { content: "\\eb6d" }
.codicon-triangle-down:before { content: "\\eb6e" }
.codicon-triangle-left:before { content: "\\eb6f" }
.codicon-triangle-right:before { content: "\\eb70" }
.codicon-triangle-up:before { content: "\\eb71" }
.codicon-twitter:before { content: "\\eb72" }
.codicon-unfold:before { content: "\\eb73" }
.codicon-unlock:before { content: "\\eb74" }
.codicon-unmute:before { content: "\\eb75" }
.codicon-unverified:before { content: "\\eb76" }
.codicon-verified:before { content: "\\eb77" }
.codicon-versions:before { content: "\\eb78" }
.codicon-vm-active:before { content: "\\eb79" }
.codicon-vm-outline:before { content: "\\eb7a" }
.codicon-vm-running:before { content: "\\eb7b" }
.codicon-watch:before { content: "\\eb7c" }
.codicon-whitespace:before { content: "\\eb7d" }
.codicon-whole-word:before { content: "\\eb7e" }
.codicon-window:before { content: "\\eb7f" }
.codicon-word-wrap:before { content: "\\eb80" }
.codicon-zoom-in:before { content: "\\eb81" }
.codicon-zoom-out:before { content: "\\eb82" }
.codicon-list-filter:before { content: "\\eb83" }
.codicon-list-flat:before { content: "\\eb84" }
.codicon-list-selection:before { content: "\\eb85" }
.codicon-selection:before { content: "\\eb85" }
.codicon-list-tree:before { content: "\\eb86" }
.codicon-debug-breakpoint-function-unverified:before { content: "\\eb87" }
.codicon-debug-breakpoint-function:before { content: "\\eb88" }
.codicon-debug-breakpoint-function-disabled:before { content: "\\eb88" }
.codicon-debug-stackframe-active:before { content: "\\eb89" }
.codicon-circle-small-filled:before { content: "\\eb8a" }
.codicon-debug-stackframe-dot:before { content: "\\eb8a" }
.codicon-terminal-decoration-mark:before { content: "\\eb8a" }
.codicon-debug-stackframe:before { content: "\\eb8b" }
.codicon-debug-stackframe-focused:before { content: "\\eb8b" }
.codicon-debug-breakpoint-unsupported:before { content: "\\eb8c" }
.codicon-symbol-string:before { content: "\\eb8d" }
.codicon-debug-reverse-continue:before { content: "\\eb8e" }
.codicon-debug-step-back:before { content: "\\eb8f" }
.codicon-debug-restart-frame:before { content: "\\eb90" }
.codicon-debug-alt:before { content: "\\eb91" }
.codicon-call-incoming:before { content: "\\eb92" }
.codicon-call-outgoing:before { content: "\\eb93" }
.codicon-menu:before { content: "\\eb94" }
.codicon-expand-all:before { content: "\\eb95" }
.codicon-feedback:before { content: "\\eb96" }
.codicon-git-pull-request-reviewer:before { content: "\\eb96" }
.codicon-group-by-ref-type:before { content: "\\eb97" }
.codicon-ungroup-by-ref-type:before { content: "\\eb98" }
.codicon-account:before { content: "\\eb99" }
.codicon-git-pull-request-assignee:before { content: "\\eb99" }
.codicon-bell-dot:before { content: "\\eb9a" }
.codicon-debug-console:before { content: "\\eb9b" }
.codicon-library:before { content: "\\eb9c" }
.codicon-output:before { content: "\\eb9d" }
.codicon-run-all:before { content: "\\eb9e" }
.codicon-sync-ignored:before { content: "\\eb9f" }
.codicon-pinned:before { content: "\\eba0" }
.codicon-github-inverted:before { content: "\\eba1" }
.codicon-server-process:before { content: "\\eba2" }
.codicon-server-environment:before { content: "\\eba3" }
.codicon-pass:before { content: "\\eba4" }
.codicon-issue-closed:before { content: "\\eba4" }
.codicon-stop-circle:before { content: "\\eba5" }
.codicon-play-circle:before { content: "\\eba6" }
.codicon-record:before { content: "\\eba7" }
.codicon-debug-alt-small:before { content: "\\eba8" }
.codicon-vm-connect:before { content: "\\eba9" }
.codicon-cloud:before { content: "\\ebaa" }
.codicon-merge:before { content: "\\ebab" }
.codicon-export:before { content: "\\ebac" }
.codicon-graph-left:before { content: "\\ebad" }
.codicon-magnet:before { content: "\\ebae" }
.codicon-notebook:before { content: "\\ebaf" }
.codicon-redo:before { content: "\\ebb0" }
.codicon-check-all:before { content: "\\ebb1" }
.codicon-pinned-dirty:before { content: "\\ebb2" }
.codicon-pass-filled:before { content: "\\ebb3" }
.codicon-circle-large-filled:before { content: "\\ebb4" }
.codicon-circle-large:before { content: "\\ebb5" }
.codicon-circle-large-outline:before { content: "\\ebb5" }
.codicon-combine:before { content: "\\ebb6" }
.codicon-gather:before { content: "\\ebb6" }
.codicon-table:before { content: "\\ebb7" }
.codicon-variable-group:before { content: "\\ebb8" }
.codicon-type-hierarchy:before { content: "\\ebb9" }
.codicon-type-hierarchy-sub:before { content: "\\ebba" }
.codicon-type-hierarchy-super:before { content: "\\ebbb" }
.codicon-git-pull-request-create:before { content: "\\ebbc" }
.codicon-run-above:before { content: "\\ebbd" }
.codicon-run-below:before { content: "\\ebbe" }
.codicon-notebook-template:before { content: "\\ebbf" }
.codicon-debug-rerun:before { content: "\\ebc0" }
.codicon-workspace-trusted:before { content: "\\ebc1" }
.codicon-workspace-untrusted:before { content: "\\ebc2" }
.codicon-workspace-unknown:before { content: "\\ebc3" }
.codicon-terminal-cmd:before { content: "\\ebc4" }
.codicon-terminal-debian:before { content: "\\ebc5" }
.codicon-terminal-linux:before { content: "\\ebc6" }
.codicon-terminal-powershell:before { content: "\\ebc7" }
.codicon-terminal-tmux:before { content: "\\ebc8" }
.codicon-terminal-ubuntu:before { content: "\\ebc9" }
.codicon-terminal-bash:before { content: "\\ebca" }
.codicon-arrow-swap:before { content: "\\ebcb" }
.codicon-copy:before { content: "\\ebcc" }
.codicon-person-add:before { content: "\\ebcd" }
.codicon-filter-filled:before { content: "\\ebce" }
.codicon-wand:before { content: "\\ebcf" }
.codicon-debug-line-by-line:before { content: "\\ebd0" }
.codicon-inspect:before { content: "\\ebd1" }
.codicon-layers:before { content: "\\ebd2" }
.codicon-layers-dot:before { content: "\\ebd3" }
.codicon-layers-active:before { content: "\\ebd4" }
.codicon-compass:before { content: "\\ebd5" }
.codicon-compass-dot:before { content: "\\ebd6" }
.codicon-compass-active:before { content: "\\ebd7" }
.codicon-azure:before { content: "\\ebd8" }
.codicon-issue-draft:before { content: "\\ebd9" }
.codicon-git-pull-request-closed:before { content: "\\ebda" }
.codicon-git-pull-request-draft:before { content: "\\ebdb" }
.codicon-debug-all:before { content: "\\ebdc" }
.codicon-debug-coverage:before { content: "\\ebdd" }
.codicon-run-errors:before { content: "\\ebde" }
.codicon-folder-library:before { content: "\\ebdf" }
.codicon-debug-continue-small:before { content: "\\ebe0" }
.codicon-beaker-stop:before { content: "\\ebe1" }
.codicon-graph-line:before { content: "\\ebe2" }
.codicon-graph-scatter:before { content: "\\ebe3" }
.codicon-pie-chart:before { content: "\\ebe4" }
.codicon-bracket-dot:before { content: "\\ebe5" }
.codicon-bracket-error:before { content: "\\ebe6" }
.codicon-lock-small:before { content: "\\ebe7" }
.codicon-azure-devops:before { content: "\\ebe8" }
.codicon-verified-filled:before { content: "\\ebe9" }
.codicon-newline:before { content: "\\ebea" }
.codicon-layout:before { content: "\\ebeb" }
.codicon-layout-activitybar-left:before { content: "\\ebec" }
.codicon-layout-activitybar-right:before { content: "\\ebed" }
.codicon-layout-panel-left:before { content: "\\ebee" }
.codicon-layout-panel-center:before { content: "\\ebef" }
.codicon-layout-panel-justify:before { content: "\\ebf0" }
.codicon-layout-panel-right:before { content: "\\ebf1" }
.codicon-layout-panel:before { content: "\\ebf2" }
.codicon-layout-sidebar-left:before { content: "\\ebf3" }
.codicon-layout-sidebar-right:before { content: "\\ebf4" }
.codicon-layout-statusbar:before { content: "\\ebf5" }
.codicon-layout-menubar:before { content: "\\ebf6" }
.codicon-layout-centered:before { content: "\\ebf7" }
.codicon-target:before { content: "\\ebf8" }
.codicon-indent:before { content: "\\ebf9" }
.codicon-record-small:before { content: "\\ebfa" }
.codicon-error-small:before { content: "\\ebfb" }
.codicon-terminal-decoration-error:before { content: "\\ebfb" }
.codicon-arrow-circle-down:before { content: "\\ebfc" }
.codicon-arrow-circle-left:before { content: "\\ebfd" }
.codicon-arrow-circle-right:before { content: "\\ebfe" }
.codicon-arrow-circle-up:before { content: "\\ebff" }
.codicon-layout-sidebar-right-off:before { content: "\\ec00" }
.codicon-layout-panel-off:before { content: "\\ec01" }
.codicon-layout-sidebar-left-off:before { content: "\\ec02" }
.codicon-blank:before { content: "\\ec03" }
.codicon-heart-filled:before { content: "\\ec04" }
.codicon-map:before { content: "\\ec05" }
.codicon-map-horizontal:before { content: "\\ec05" }
.codicon-fold-horizontal:before { content: "\\ec05" }
.codicon-map-filled:before { content: "\\ec06" }
.codicon-map-horizontal-filled:before { content: "\\ec06" }
.codicon-fold-horizontal-filled:before { content: "\\ec06" }
.codicon-circle-small:before { content: "\\ec07" }
.codicon-bell-slash:before { content: "\\ec08" }
.codicon-bell-slash-dot:before { content: "\\ec09" }
.codicon-comment-unresolved:before { content: "\\ec0a" }
.codicon-git-pull-request-go-to-changes:before { content: "\\ec0b" }
.codicon-git-pull-request-new-changes:before { content: "\\ec0c" }
.codicon-search-fuzzy:before { content: "\\ec0d" }
.codicon-comment-draft:before { content: "\\ec0e" }
.codicon-send:before { content: "\\ec0f" }
.codicon-sparkle:before { content: "\\ec10" }
.codicon-insert:before { content: "\\ec11" }
.codicon-mic:before { content: "\\ec12" }
.codicon-thumbsdown-filled:before { content: "\\ec13" }
.codicon-thumbsup-filled:before { content: "\\ec14" }
.codicon-coffee:before { content: "\\ec15" }
.codicon-snake:before { content: "\\ec16" }
.codicon-game:before { content: "\\ec17" }
.codicon-vr:before { content: "\\ec18" }
.codicon-chip:before { content: "\\ec19" }
.codicon-piano:before { content: "\\ec1a" }
.codicon-music:before { content: "\\ec1b" }
.codicon-mic-filled:before { content: "\\ec1c" }
.codicon-repo-fetch:before { content: "\\ec1d" }
.codicon-copilot:before { content: "\\ec1e" }
.codicon-lightbulb-sparkle:before { content: "\\ec1f" }
.codicon-robot:before { content: "\\ec20" }
.codicon-sparkle-filled:before { content: "\\ec21" }
.codicon-diff-single:before { content: "\\ec22" }
.codicon-diff-multiple:before { content: "\\ec23" }
.codicon-surround-with:before { content: "\\ec24" }
.codicon-share:before { content: "\\ec25" }
.codicon-git-stash:before { content: "\\ec26" }
.codicon-git-stash-apply:before { content: "\\ec27" }
.codicon-git-stash-pop:before { content: "\\ec28" }
.codicon-vscode:before { content: "\\ec29" }
.codicon-vscode-insiders:before { content: "\\ec2a" }
.codicon-code-oss:before { content: "\\ec2b" }
.codicon-run-coverage:before { content: "\\ec2c" }
.codicon-run-all-coverage:before { content: "\\ec2d" }
.codicon-coverage:before { content: "\\ec2e" }
.codicon-github-project:before { content: "\\ec2f" }
.codicon-map-vertical:before { content: "\\ec30" }
.codicon-fold-vertical:before { content: "\\ec30" }
.codicon-map-vertical-filled:before { content: "\\ec31" }
.codicon-fold-vertical-filled:before { content: "\\ec31" }
.codicon-go-to-search:before { content: "\\ec32" }
.codicon-percentage:before { content: "\\ec33" }
.codicon-sort-percentage:before { content: "\\ec33" }
.codicon-attach:before { content: "\\ec34" }
.codicon-go-to-editing-session:before { content: "\\ec35" }
.codicon-edit-session:before { content: "\\ec36" }
.codicon-code-review:before { content: "\\ec37" }
.codicon-copilot-warning:before { content: "\\ec38" }
.codicon-python:before { content: "\\ec39" }
.codicon-copilot-large:before { content: "\\ec3a" }
.codicon-copilot-warning-large:before { content: "\\ec3b" }
.codicon-keyboard-tab:before { content: "\\ec3c" }
.codicon-copilot-blocked:before { content: "\\ec3d" }
.codicon-copilot-not-connected:before { content: "\\ec3e" }
.codicon-flag:before { content: "\\ec3f" }
.codicon-lightbulb-empty:before { content: "\\ec40" }
.codicon-symbol-method-arrow:before { content: "\\ec41" }
.codicon-copilot-unavailable:before { content: "\\ec42" }
.codicon-repo-pinned:before { content: "\\ec43" }
.codicon-keyboard-tab-above:before { content: "\\ec44" }
.codicon-keyboard-tab-below:before { content: "\\ec45" }
.codicon-git-pull-request-done:before { content: "\\ec46" }
.codicon-mcp:before { content: "\\ec47" }
.codicon-extensions-large:before { content: "\\ec48" }
.codicon-layout-panel-dock:before { content: "\\ec49" }
.codicon-layout-sidebar-left-dock:before { content: "\\ec4a" }
.codicon-layout-sidebar-right-dock:before { content: "\\ec4b" }
.codicon-copilot-in-progress:before { content: "\\ec4c" }
.codicon-copilot-error:before { content: "\\ec4d" }
.codicon-copilot-success:before { content: "\\ec4e" }
.codicon-chat-sparkle:before { content: "\\ec4f" }
.codicon-search-sparkle:before { content: "\\ec50" }
.codicon-edit-sparkle:before { content: "\\ec51" }
.codicon-copilot-snooze:before { content: "\\ec52" }
.codicon-send-to-remote-agent:before { content: "\\ec53" }
.codicon-comment-discussion-sparkle:before { content: "\\ec54" }
.codicon-chat-sparkle-warning:before { content: "\\ec55" }
.codicon-chat-sparkle-error:before { content: "\\ec56" }
.codicon-collection:before { content: "\\ec57" }
.codicon-new-collection:before { content: "\\ec58" }
.codicon-thinking:before { content: "\\ec59" }
.codicon-build:before { content: "\\ec5a" }
.codicon-comment-discussion-quote:before { content: "\\ec5b" }
.codicon-cursor:before { content: "\\ec5c" }
.codicon-eraser:before { content: "\\ec5d" }
.codicon-file-text:before { content: "\\ec5e" }
.codicon-quotes:before { content: "\\ec60" }
.codicon-rename:before { content: "\\ec61" }
.codicon-run-with-deps:before { content: "\\ec62" }
.codicon-debug-connected:before { content: "\\ec63" }
.codicon-strikethrough:before { content: "\\ec64" }
.codicon-open-in-product:before { content: "\\ec65" }
.codicon-index-zero:before { content: "\\ec66" }
.codicon-agent:before { content: "\\ec67" }
.codicon-edit-code:before { content: "\\ec68" }
.codicon-repo-selected:before { content: "\\ec69" }
.codicon-skip:before { content: "\\ec6a" }
.codicon-merge-into:before { content: "\\ec6b" }
.codicon-git-branch-changes:before { content: "\\ec6c" }
.codicon-git-branch-staged-changes:before { content: "\\ec6d" }
.codicon-git-branch-conflicts:before { content: "\\ec6e" }
.codicon-git-branch:before { content: "\\ec6f" }
.codicon-git-branch-create:before { content: "\\ec6f" }
.codicon-git-branch-delete:before { content: "\\ec6f" }
.codicon-search-large:before { content: "\\ec70" }
.codicon-terminal-git-bash:before { content: "\\ec71" }
.codicon-window-active:before { content: "\\ec72" }
.codicon-forward:before { content: "\\ec73" }
.codicon-download:before { content: "\\ec74" }
.codicon-clockface:before { content: "\\ec75" }
.codicon-unarchive:before { content: "\\ec76" }
.codicon-session-in-progress:before { content: "\\ec77" }
.codicon-collection-small:before { content: "\\ec78" }
.codicon-vm-small:before { content: "\\ec79" }
.codicon-cloud-small:before { content: "\\ec7a" }
.codicon-add-small:before { content: "\\ec7b" }
.codicon-remove-small:before { content: "\\ec7c" }
.codicon-worktree-small:before { content: "\\ec7d" }
.codicon-worktree:before { content: "\\ec7e" }
.codicon-screen-cut:before { content: "\\ec7f" }
.codicon-ask:before { content: "\\ec80" }
.codicon-openai:before { content: "\\ec81" }
.codicon-claude:before { content: "\\ec82" }
.codicon-open-in-window:before { content: "\\ec83" }
.codicon-new-session:before { content: "\\ec84" }
.codicon-terminal-secure:before { content: "\\ec85" }
.codicon-chat-import:before { content: "\\ec86" }
.codicon-chat-export:before { content: "\\ec87" }
.codicon-share-window:before { content: "\\ec88" }
.codicon-circle-slash-compact:before { content: "\\ec89" }
.codicon-copilot-compact:before { content: "\\ec8a" }
.codicon-folder-opened-compact:before { content: "\\ec8b" }
.codicon-folder-compact:before { content: "\\ec8c" }
.codicon-gear-compact:before { content: "\\ec8d" }
.codicon-git-branch-compact:before { content: "\\ec8e" }
.codicon-library-compact:before { content: "\\ec8f" }
.codicon-record-keys-compact:before { content: "\\ec90" }
.codicon-remote-compact:before { content: "\\ec91" }
.codicon-repo-forked-compact:before { content: "\\ec92" }
.codicon-repo-compact:before { content: "\\ec93" }
.codicon-shield-compact:before { content: "\\ec94" }
.codicon-sparkle-compact:before { content: "\\ec95" }
.codicon-symbol-color-compact:before { content: "\\ec96" }
.codicon-window-compact:before { content: "\\ec97" }
.codicon-error-compact:before { content: "\\ec98" }
.codicon-warning-compact:before { content: "\\ec99" }
.codicon-pass-compact:before { content: "\\ec9a" }
.codicon-important:before { content: "\\ec9b" }
.codicon-important-compact:before { content: "\\ec9c" }
.codicon-rocket-compact:before { content: "\\ec9d" }
.codicon-unpin:before { content: "\\ec9e" }
.codicon-add-compact:before { content: "\\ec9f" }
.codicon-attach-compact:before { content: "\\eca0" }
.codicon-beaker-compact:before { content: "\\eca1" }
.codicon-check-compact:before { content: "\\eca2" }
.codicon-checklist-compact:before { content: "\\eca3" }
.codicon-chevron-down-compact:before { content: "\\eca4" }
.codicon-chevron-left-compact:before { content: "\\eca5" }
.codicon-chevron-right-compact:before { content: "\\eca6" }
.codicon-chevron-up-compact:before { content: "\\eca7" }
.codicon-circle-filled-compact:before { content: "\\eca8" }
.codicon-circle-small-filled-compact:before { content: "\\eca9" }
.codicon-close-compact:before { content: "\\ecaa" }
.codicon-collapse-all-compact:before { content: "\\ecab" }
.codicon-comment-compact:before { content: "\\ecac" }
.codicon-comment-unresolved-compact:before { content: "\\ecad" }
.codicon-debug-connected-compact:before { content: "\\ecae" }
.codicon-debug-disconnect-compact:before { content: "\\ecaf" }
.codicon-edit-compact:before { content: "\\ecb0" }
.codicon-file-media-compact:before { content: "\\ecb1" }
.codicon-git-fetch:before { content: "\\ecb2" }
.codicon-lightbulb-compact:before { content: "\\ecb3" }
.codicon-loading-compact:before { content: "\\ecb4" }
.codicon-pass-filled-compact:before { content: "\\ecb5" }
.codicon-project-compact:before { content: "\\ecb6" }
.codicon-refresh-compact:before { content: "\\ecb7" }
.codicon-search-compact:before { content: "\\ecb8" }
.codicon-session-in-progress-compact:before { content: "\\ecb9" }
.codicon-sync-compact:before { content: "\\ecba" }
.codicon-terminal-compact:before { content: "\\ecbb" }
.codicon-vm-pending:before { content: "\\ecbc" }
.codicon-worktree-compact:before { content: "\\ecbd" }
.codicon-developer-tools:before { content: "\\ecbe" }
.codicon-cloud-compact:before { content: "\\ecbf" }
.codicon-agent-compact:before { content: "\\ecc0" }
.codicon-ask-compact:before { content: "\\ecc1" }
.codicon-settings-compact:before { content: "\\ecc2" }
.codicon-vm-compact:before { content: "\\ecc3" }
.codicon-run-compact:before { content: "\\ecc4" }
.codicon-git-pull-request-comment:before { content: "\\ecc5" }
.codicon-git-pull-request-error:before { content: "\\ecc6" }
.codicon-right-panel-hide:before { content: "\\ecc7" }
.codicon-right-panel-show:before { content: "\\ecc8" }
.codicon-vscode-insiders-outline:before { content: "\\ecc9" }
.codicon-vscode-outline:before { content: "\\ecca" }
.codicon-voice-mode:before { content: "\\eccb" }
.codicon-voice-mode-compact:before { content: "\\eccc" }
.codicon-mic-download:before { content: "\\eccd" }
.codicon-mic-download-compact:before { content: "\\ecce" }
.codicon-voice-mode-download:before { content: "\\eccf" }
.codicon-voice-mode-download-compact:before { content: "\\ecd0" }
.codicon-google-gemini:before { content: "\\ecd1" }
.codicon-kimi:before { content: "\\ecd2" }
.codicon-microsoft:before { content: "\\ecd3" }
.codicon-fish1-happy:before { content: "\\ecd4" }
.codicon-fish1-neutral:before { content: "\\ecd5" }
.codicon-fish1-sad:before { content: "\\ecd6" }
.codicon-fish1-very-sad:before { content: "\\ecd7" }
.codicon-fish2-happy:before { content: "\\ecd8" }
.codicon-fish2-neutral:before { content: "\\ecd9" }
.codicon-fish2-sad:before { content: "\\ecda" }
.codicon-fish2-very-sad:before { content: "\\ecdb" }
.codicon-fish3-happy:before { content: "\\ecdc" }
.codicon-fish3-neutral:before { content: "\\ecdd" }
.codicon-fish3-sad:before { content: "\\ecde" }
.codicon-fish3-very-sad:before { content: "\\ecdf" }
.codicon-fish4-happy:before { content: "\\ece0" }
.codicon-fish4-neutral:before { content: "\\ece1" }
.codicon-fish4-sad:before { content: "\\ece2" }
.codicon-fish4-very-sad:before { content: "\\ece3" }
.codicon-person-voice:before { content: "\\ece4" }
.codicon-person-voice-compact:before { content: "\\ece5" }
.codicon-person-voice-filled:before { content: "\\ece6" }
.codicon-person-voice-filled-compact:before { content: "\\ece7" }
`;var od=`/* VS Code theme variables for hosts outside VS Code (the browser extension's pages): a dark and
   a light set that follow the system theme, matching VS Code's Dark Modern and Light Modern. */

.ink-theme {
  --vscode-font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --vscode-font-size: 13px;
  --vscode-editor-font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  --vscode-foreground: #cccccc;
  --vscode-descriptionForeground: #9d9d9d;
  --vscode-icon-foreground: #cccccc;
  --vscode-editor-background: #1f1f1f;
  --vscode-editorWidget-background: #202020;
  --vscode-widget-border: #313131;
  --vscode-widget-shadow: rgba(0, 0, 0, 0.36);
  --vscode-focusBorder: #0078d4;
  --vscode-button-background: #0078d4;
  --vscode-button-foreground: #ffffff;
  --vscode-button-hoverBackground: #026ec1;
  --vscode-button-border: rgba(255, 255, 255, 0.07);
  --vscode-button-secondaryBackground: #313131;
  --vscode-button-secondaryForeground: #cccccc;
  --vscode-button-secondaryHoverBackground: #3c3c3c;
  --vscode-toolbar-hoverBackground: rgba(90, 93, 94, 0.31);
  --vscode-toolbar-activeBackground: rgba(99, 102, 103, 0.31);
  --vscode-input-background: #313131;
  --vscode-input-foreground: #cccccc;
  --vscode-input-border: #3c3c3c;
  --vscode-input-placeholderForeground: #989898;
  --vscode-dropdown-background: #313131;
  --vscode-dropdown-foreground: #cccccc;
  --vscode-dropdown-border: #3c3c3c;
  --vscode-checkbox-background: #313131;
  --vscode-checkbox-border: #3c3c3c;
  --vscode-menu-background: #1f1f1f;
  --vscode-menu-foreground: #cccccc;
  --vscode-menu-selectionBackground: #0078d4;
  --vscode-menu-selectionForeground: #ffffff;
  --vscode-menu-separatorBackground: #454545;
  --vscode-menu-border: #454545;
  --vscode-notifications-background: #1f1f1f;
  --vscode-notifications-foreground: #cccccc;
  --vscode-notifications-border: #2b2b2b;
  --vscode-textLink-foreground: #4daafc;
  --vscode-errorForeground: #f85149;
  --vscode-testing-iconPassed: #73c991;
  --vscode-editorWarning-foreground: #cca700;
  --vscode-terminal-ansiBlue: #4daafc;
  --vscode-terminal-ansiGreen: #3fb950;
  --vscode-terminal-ansiYellow: #d7ba7d;
  --vscode-terminal-ansiRed: #f85149;
  --vscode-terminal-ansiMagenta: #d670d6;
  --vscode-badge-background: #616161;
  --vscode-badge-foreground: #f8f8f8;
  --vscode-keybindingLabel-background: rgba(128, 128, 128, 0.17);
  --vscode-keybindingLabel-foreground: #cccccc;
  --vscode-keybindingLabel-border: rgba(51, 51, 51, 0.6);
  color-scheme: dark;
}

@media (prefers-color-scheme: light) {
  .ink-theme {
    --vscode-foreground: #3b3b3b;
    --vscode-descriptionForeground: #6f6f6f;
    --vscode-icon-foreground: #3b3b3b;
    --vscode-editor-background: #ffffff;
    --vscode-editorWidget-background: #f8f8f8;
    --vscode-widget-border: #e5e5e5;
    --vscode-widget-shadow: rgba(0, 0, 0, 0.16);
    --vscode-focusBorder: #005fb8;
    --vscode-button-background: #005fb8;
    --vscode-button-hoverBackground: #0258a8;
    --vscode-button-border: rgba(0, 0, 0, 0.1);
    --vscode-button-secondaryBackground: #e5e5e5;
    --vscode-button-secondaryForeground: #3b3b3b;
    --vscode-button-secondaryHoverBackground: #cccccc;
    --vscode-toolbar-hoverBackground: rgba(184, 184, 184, 0.31);
    --vscode-toolbar-activeBackground: rgba(166, 166, 166, 0.31);
    --vscode-input-background: #ffffff;
    --vscode-input-foreground: #3b3b3b;
    --vscode-input-border: #cecece;
    --vscode-input-placeholderForeground: #767676;
    --vscode-dropdown-background: #ffffff;
    --vscode-dropdown-foreground: #3b3b3b;
    --vscode-dropdown-border: #cecece;
    --vscode-checkbox-background: #f8f8f8;
    --vscode-checkbox-border: #cecece;
    --vscode-menu-background: #ffffff;
    --vscode-menu-foreground: #3b3b3b;
    --vscode-menu-selectionBackground: #005fb8;
    --vscode-menu-separatorBackground: #d4d4d4;
    --vscode-menu-border: #cecece;
    --vscode-notifications-background: #ffffff;
    --vscode-notifications-foreground: #3b3b3b;
    --vscode-notifications-border: #e5e5e5;
    --vscode-textLink-foreground: #005fb8;
    --vscode-errorForeground: #b3261e;
    --vscode-testing-iconPassed: #2e7d32;
    --vscode-editorWarning-foreground: #895503;
    --vscode-terminal-ansiBlue: #005fb8;
    --vscode-terminal-ansiGreen: #1a7f37;
    --vscode-terminal-ansiYellow: #895503;
    --vscode-terminal-ansiRed: #c72e0f;
    --vscode-terminal-ansiMagenta: #a626a4;
    --vscode-badge-background: #cccccc;
    --vscode-badge-foreground: #3b3b3b;
    --vscode-keybindingLabel-foreground: #3b3b3b;
    --vscode-keybindingLabel-border: rgba(204, 204, 204, 0.4);
    color-scheme: light;
  }
}
`;var ad=`/* The Inkspect design system: tokens and the shared components (buttons, fields, selects,
   switches, sliders, color picker, menus, toast, drawing toolbar and layer).
   Colors come from VS Code theme variables; hosts outside VS Code define them (theme.css).
   Every surface uses the tokens below, so sizes, radii and elevation stay consistent. */

:root,
:host {
  /* Shape */
  --ink-radius-sm: 4px;
  --ink-radius: 6px;
  --ink-radius-lg: 10px;
  --ink-radius-pill: 999px;
  /* Controls */
  --ink-control-sm: 24px;
  --ink-control: 28px;
  --ink-control-lg: 36px;
  /* Spacing */
  --ink-space-1: 4px;
  --ink-space-2: 8px;
  --ink-space-3: 12px;
  --ink-space-4: 16px;
  --ink-space-5: 24px;
  --ink-space-6: 32px;
  /* Type */
  --ink-font-xs: 11px;
  --ink-font-sm: 12px;
  --ink-font: var(--vscode-font-size, 13px);
  --ink-font-lg: 15px;
  --ink-font-xl: 22px;
  /* Surfaces and lines */
  --ink-surface: var(--vscode-editorWidget-background, var(--vscode-editor-background));
  /* Popups: lifted off the menu background, since many dark themes (Tokyo Night) give menus the
     sidebar's own color, a border the same near-black, and no shadow at all. */
  --ink-surface-raised: color-mix(
    in srgb,
    var(--vscode-foreground, #888) 7%,
    var(--vscode-menu-background, var(--ink-surface))
  );
  --ink-surface-sunken: color-mix(in srgb, var(--vscode-foreground, #888) 4%, transparent);
  --ink-border: var(--vscode-widget-border, rgba(128, 128, 128, 0.35));
  --ink-border-subtle: color-mix(in srgb, var(--vscode-foreground, #888) 10%, transparent);
  --ink-border-strong: color-mix(in srgb, var(--vscode-foreground, #888) 22%, transparent);
  --ink-hover: var(--vscode-toolbar-hoverBackground, rgba(128, 128, 128, 0.18));
  --ink-pressed: var(--vscode-toolbar-activeBackground, rgba(128, 128, 128, 0.26));
  /* Focus rings follow the theme's focus border; accents use the button color, which themes keep
     vivid (the focus border can be very dim). Text on tinted backgrounds uses the link color. */
  --ink-focus: var(--vscode-focusBorder, #0078d4);
  --ink-accent: var(--vscode-button-background, var(--ink-focus));
  --ink-accent-fg: var(--vscode-textLink-foreground, var(--ink-accent));
  --ink-accent-soft: color-mix(in srgb, var(--ink-accent) 20%, transparent);
  /* Secondary text, pulled toward the foreground so it stays readable in low-contrast themes. */
  --ink-muted: color-mix(
    in srgb,
    var(--vscode-descriptionForeground, #9d9d9d) 70%,
    var(--vscode-foreground, #ccc)
  );
  --ink-danger: var(--vscode-errorForeground, #f85149);
  --ink-success: var(--vscode-testing-iconPassed, #73c991);
  --ink-warning: var(--vscode-editorWarning-foreground, #cca700);
  /* The theme's own palette. Every theme defines its terminal ANSI colors, and they are its true
     hues (Tokyo Night's are #7aa2f7, #9ece6a, #e0af68, #f7768e, #bb9af7), unlike button and
     error colors, which some themes keep dim. Pulled slightly toward the foreground so they stay
     readable as text on both light and dark backgrounds. */
  --ink-blue: color-mix(
    in srgb,
    var(--vscode-terminal-ansiBlue, #3b8eea) 88%,
    var(--vscode-foreground, #888)
  );
  --ink-green: color-mix(
    in srgb,
    var(--vscode-terminal-ansiGreen, #23d18b) 88%,
    var(--vscode-foreground, #888)
  );
  --ink-yellow: color-mix(
    in srgb,
    var(--vscode-terminal-ansiYellow, #e5e510) 88%,
    var(--vscode-foreground, #888)
  );
  --ink-red: color-mix(
    in srgb,
    var(--vscode-terminal-ansiRed, #f14c4c) 88%,
    var(--vscode-foreground, #888)
  );
  --ink-magenta: color-mix(
    in srgb,
    var(--vscode-terminal-ansiMagenta, #d670d6) 88%,
    var(--vscode-foreground, #888)
  );
  /* Elevation */
  /* Half the theme's widget shadow, half plain black: some themes make theirs transparent. */
  --ink-shadow-color: color-mix(
    in srgb,
    var(--vscode-widget-shadow, rgba(0, 0, 0, 0.3)) 50%,
    rgba(0, 0, 0, 0.5)
  );
  --ink-shadow-sm: 0 1px 3px var(--ink-shadow-color);
  --ink-shadow: 0 6px 20px var(--ink-shadow-color), 0 1px 4px var(--ink-shadow-color);
  --ink-shadow-lg: 0 12px 32px var(--ink-shadow-color), 0 2px 8px var(--ink-shadow-color);
  /* Motion */
  --ink-ease: cubic-bezier(0.2, 0, 0, 1);
  --ink-fast: 90ms;
  --ink-normal: 160ms;
}

/* Focus ------------------------------------------------------------------------------------ */

.icon-button:focus-visible,
.button:focus-visible,
.link-button:focus-visible,
.menu-item:focus-visible,
.select:focus-visible,
.switch:focus-visible,
.checkbox:focus-visible,
.segment:focus-visible,
.slider-track:focus-visible,
.swatch:focus-visible,
.color-area:focus-visible,
.color-hue:focus-visible,
.chip:focus-visible {
  outline: 1px solid var(--ink-focus);
  outline-offset: 1px;
}

/* Icon buttons ----------------------------------------------------------------------------- */

.icon-button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--ink-control);
  height: var(--ink-control);
  padding: 0;
  border: none;
  border-radius: var(--ink-radius-sm);
  background: transparent;
  color: var(--vscode-icon-foreground, var(--vscode-foreground));
  font: inherit;
  cursor: pointer;
  transition: background-color var(--ink-fast) var(--ink-ease);
}

/* DragHandle: the six-dot grip of a floating panel. */
.drag-handle {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: var(--ink-control);
  padding: 0;
  border: none;
  border-radius: var(--ink-radius-sm);
  background: transparent;
  color: var(--ink-muted);
  font: inherit;
  cursor: grab;
  touch-action: none;
  transition:
    background-color var(--ink-fast) var(--ink-ease),
    color var(--ink-fast) var(--ink-ease);
}

.drag-handle:hover,
.drag-handle.dragging {
  background: var(--ink-hover);
  color: var(--vscode-foreground);
}

.drag-handle.dragging {
  cursor: grabbing;
}

.drag-handle:focus-visible {
  outline: 1px solid var(--ink-focus);
  outline-offset: -1px;
}

.icon-button.small {
  width: var(--ink-control-sm);
  height: var(--ink-control-sm);
}

.icon-button:hover:not(:disabled) {
  background: var(--ink-hover);
}

.icon-button:active:not(:disabled) {
  background: var(--ink-pressed);
}

.icon-button.active {
  background: var(--ink-accent-soft);
  color: var(--vscode-inputOption-activeForeground, var(--vscode-foreground));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ink-accent) 60%, transparent);
}

.icon-button:disabled {
  opacity: 0.4;
  cursor: default;
}

/* Buttons ---------------------------------------------------------------------------------- */

.button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--ink-control);
  padding: 0 12px;
  border: 1px solid var(--vscode-button-border, transparent);
  border-radius: var(--ink-radius-sm);
  font: inherit;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ink-fast) var(--ink-ease),
    border-color var(--ink-fast) var(--ink-ease);
}

.button.small {
  gap: 4px;
  height: var(--ink-control-sm);
  padding: 0 8px;
}

.button .codicon {
  font-size: 14px;
}

/* A label with key caps after it ("Copy C") keeps them apart. */
.button-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.button.primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.button.primary:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.button.secondary {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}

.button.secondary:hover:not(:disabled) {
  background: var(--vscode-button-secondaryHoverBackground);
}

.button.ghost {
  border-color: transparent;
  background: transparent;
  color: inherit;
}

.button.ghost:hover:not(:disabled) {
  background: var(--ink-hover);
}

/* A solid call to action in the theme's own blue (its palette, see --ink-blue), for themes whose
   button color is dim. Dark text on dark themes, where the palette's blue is light. */
.button.accent {
  border-color: transparent;
  background: var(--ink-blue);
  color: var(--vscode-editor-background, #fff);
  font-weight: 600;
}

.button.accent:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ink-blue) 85%, var(--vscode-foreground, #fff));
}

body.vscode-light .button.accent {
  color: #fff;
}

body.vscode-high-contrast .button.accent {
  border-color: var(--vscode-contrastBorder, transparent);
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.button.danger {
  border-color: color-mix(in srgb, var(--ink-danger) 45%, transparent);
  background: transparent;
  color: var(--ink-danger);
}

.button.danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ink-danger) 12%, transparent);
}

.button:disabled {
  opacity: 0.5;
  cursor: default;
}

.link-button {
  padding: 0;
  border: none;
  background: none;
  color: var(--vscode-textLink-foreground);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.link-button:hover:not(:disabled) {
  color: var(--vscode-textLink-activeForeground, var(--vscode-textLink-foreground));
  text-decoration: underline;
}

.link-button:disabled {
  color: inherit;
  cursor: default;
}

.link-button.danger {
  color: var(--ink-danger);
}

/* Text fields ------------------------------------------------------------------------------ */

.text-field {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: var(--ink-control);
  padding: 0 8px;
  border: 1px solid var(--vscode-input-border, var(--ink-border));
  border-radius: var(--ink-radius-sm);
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  transition: border-color var(--ink-fast) var(--ink-ease);
}

.text-field.size-sm {
  height: var(--ink-control-sm);
  padding: 0 6px;
}

.text-field.size-lg {
  height: var(--ink-control-lg);
  padding: 0 12px;
  border-radius: var(--ink-radius);
}

.text-field:hover:not(.disabled) {
  border-color: var(--ink-border-strong);
}

.text-field:focus-within {
  border-color: var(--ink-focus);
  box-shadow: 0 0 0 1px var(--ink-focus);
}

.text-field.invalid {
  border-color: var(--vscode-inputValidation-errorBorder, var(--ink-danger));
}

.text-field.disabled {
  opacity: 0.5;
}

.text-field input {
  flex: 1;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
}

.text-field input::placeholder {
  color: var(--vscode-input-placeholderForeground, var(--ink-muted));
}

/* Several lines (TextArea): the field grows with the text up to about six lines, then scrolls. */
.text-field.multiline {
  align-items: stretch;
  height: auto;
  padding: 5px 8px;
}

.text-field textarea {
  flex: 1;
  width: 100%;
  min-width: 0;
  max-height: calc(6 * 1.4em);
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.4;
  resize: none;
  field-sizing: content;
}

.text-field textarea::placeholder {
  color: var(--vscode-input-placeholderForeground, var(--ink-muted));
}

/* Numbers: no spinner arrows (the fields accept typing and arrow keys). */
.text-field input::-webkit-outer-spin-button,
.text-field input::-webkit-inner-spin-button {
  margin: 0;
  appearance: none;
}

.text-field input[type='number'] {
  appearance: textfield;
  font-variant-numeric: tabular-nums;
}

.text-field input[type='search']::-webkit-search-cancel-button {
  appearance: none;
}

.text-field-icon {
  flex-shrink: 0;
  color: var(--ink-muted);
}

.text-field-clear {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: var(--ink-radius-sm);
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
}

.text-field-clear:hover {
  background: var(--ink-hover);
  color: inherit;
}

/* Form rows -------------------------------------------------------------------------------- */

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--ink-space-3);
}

.field.inline {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--ink-space-3);
}

.field-label {
  color: var(--vscode-foreground);
  font-weight: 600;
}

.field.inline .field-label {
  font-weight: normal;
}

.field-control {
  display: flex;
  align-items: center;
  gap: var(--ink-space-2);
  min-width: 0;
}

.field-control > .text-field,
.field-control > .select {
  flex: 1;
}

.field-hint {
  flex-basis: 100%;
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
}

.field-hint.error {
  color: var(--ink-danger);
}

/* Select ----------------------------------------------------------------------------------- */

.select {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
  height: var(--ink-control);
  padding: 0 6px 0 8px;
  border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border, var(--ink-border)));
  border-radius: var(--ink-radius-sm);
  background: var(--vscode-dropdown-background, var(--vscode-input-background));
  color: var(--vscode-dropdown-foreground, var(--vscode-input-foreground));
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--ink-fast) var(--ink-ease),
    border-color var(--ink-fast) var(--ink-ease);
}

.select.size-sm {
  height: var(--ink-control-sm);
  padding: 0 4px 0 6px;
}

.select:hover:not(:disabled) {
  border-color: var(--ink-border-strong);
}

.select.open {
  border-color: var(--ink-focus);
}

.select.quiet {
  border-color: transparent;
  background: transparent;
}

.select.quiet:hover:not(:disabled),
.select.quiet.open {
  border-color: transparent;
  background: var(--ink-hover);
}

.select:disabled {
  opacity: 0.45;
  cursor: default;
}

.select-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.select-value.placeholder {
  color: var(--ink-muted);
}

.select-chevron {
  flex-shrink: 0;
  font-size: 14px !important;
  opacity: 0.8;
  transition: transform var(--ink-normal) var(--ink-ease);
}

.select.open .select-chevron {
  transform: rotate(180deg);
}

.select-list,
.color-picker,
.menu,
.popover {
  background: var(--ink-surface-raised);
  color: var(--vscode-menu-foreground, var(--vscode-foreground));
  border: 1px solid var(--ink-border-strong);
  border-radius: var(--ink-radius);
  box-shadow: var(--ink-shadow);
}

.select-list {
  position: fixed;
  z-index: 1000;
  max-width: calc(100vw - 8px);
  max-height: min(340px, 60vh);
  padding: 4px;
  overflow-y: auto;
  outline: none;
  font-family: var(--vscode-font-family);
  font-size: var(--ink-font);
  animation: ink-pop-in var(--ink-normal) var(--ink-ease);
}

.select-group {
  padding: 8px 8px 4px;
  color: var(--ink-muted);
  font-size: var(--ink-font-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.select-group:first-child {
  padding-top: 4px;
}

.select-option {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px 0 4px;
  border-radius: var(--ink-radius-sm);
  white-space: nowrap;
  cursor: pointer;
}

.select-option.active {
  background: var(--vscode-menu-selectionBackground, var(--vscode-list-activeSelectionBackground));
  color: var(--vscode-menu-selectionForeground, var(--vscode-list-activeSelectionForeground));
}

.select-option.disabled {
  opacity: 0.45;
  cursor: default;
}

.select-check {
  flex-shrink: 0;
  font-size: 14px !important;
}

.select-option-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* The detail gives way first when the list is narrow. */
.select-option-detail {
  flex-shrink: 1000;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 16px;
  opacity: 0.65;
  font-size: var(--ink-font-sm);
  font-variant-numeric: tabular-nums;
}

/* Switch and checkbox ---------------------------------------------------------------------- */

.switch,
.checkbox {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--ink-space-2);
  padding: 2px 0;
  border: none;
  border-radius: var(--ink-radius-sm);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.switch:disabled,
.checkbox:disabled {
  opacity: 0.45;
  cursor: default;
}

.switch-track {
  position: relative;
  flex-shrink: 0;
  width: 30px;
  height: 16px;
  border: 1px solid var(--ink-border-strong);
  border-radius: var(--ink-radius-pill);
  background: var(--vscode-input-background, var(--ink-surface-sunken));
  transition:
    background-color var(--ink-normal) var(--ink-ease),
    border-color var(--ink-normal) var(--ink-ease);
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ink-muted);
  transition:
    transform var(--ink-normal) var(--ink-ease),
    background-color var(--ink-normal) var(--ink-ease);
}

.switch.on .switch-track {
  border-color: var(--vscode-button-background, var(--ink-accent));
  background: var(--vscode-button-background, var(--ink-accent));
}

.switch.on .switch-thumb {
  background: var(--vscode-button-foreground, #fff);
  transform: translateX(14px);
}

.checkbox-box {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--vscode-checkbox-border, var(--ink-border-strong));
  border-radius: 3px;
  background: var(--vscode-checkbox-background, var(--vscode-input-background));
  transition: background-color var(--ink-fast) var(--ink-ease);
}

.checkbox.on .checkbox-box {
  border-color: var(--vscode-button-background, var(--ink-accent));
  background: var(--vscode-button-background, var(--ink-accent));
  color: var(--vscode-button-foreground, #fff);
}

.checkbox-box .codicon {
  font-size: 14px !important;
}

/* Segmented control ------------------------------------------------------------------------ */

.segmented {
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  height: var(--ink-control);
  padding: 2px;
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius);
  background: var(--ink-surface-sunken);
}

.segmented.size-sm {
  height: var(--ink-control-sm);
  padding: 1px;
  border-radius: var(--ink-radius-sm);
}

.segment {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 5px;
  min-width: 26px;
  padding: 0 10px;
  border: none;
  border-radius: calc(var(--ink-radius) - 2px);
  background: transparent;
  color: var(--ink-muted);
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ink-fast) var(--ink-ease),
    color var(--ink-fast) var(--ink-ease);
}

.segmented.size-sm .segment {
  padding: 0 8px;
  border-radius: 3px;
}

.segment:hover {
  color: var(--vscode-foreground);
}

.segment.checked {
  background: var(--vscode-button-secondaryBackground, var(--ink-hover));
  color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
  box-shadow: var(--ink-shadow-sm);
}

.segment-count {
  min-width: 16px;
  padding: 0 5px;
  border-radius: var(--ink-radius-pill);
  background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground);
  font-size: var(--ink-font-xs);
  line-height: 16px;
  text-align: center;
}

.segment-count.error {
  background: var(--ink-danger);
  color: #fff;
}

/* Slider ----------------------------------------------------------------------------------- */

.slider {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  height: var(--ink-control);
}

.slider.disabled {
  opacity: 0.45;
}

.slider > .codicon {
  color: var(--ink-muted);
}

.slider-track {
  position: relative;
  width: 84px;
  /* Room for the thumb, which hangs half off each end. */
  margin: 0 7px;
  height: 18px;
  cursor: pointer;
  touch-action: none;
  border-radius: var(--ink-radius-sm);
}

.slider-track::before,
.slider-fill {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  border-radius: var(--ink-radius-pill);
  transform: translateY(-50%);
}

.slider-track::before {
  right: 0;
  background: var(--ink-border-strong);
}

.slider-fill {
  background: var(--ink-accent);
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border: 2px solid var(--ink-accent);
  border-radius: 50%;
  background: var(--vscode-editor-background, #fff);
  box-shadow: var(--ink-shadow-sm);
  transform: translate(-50%, -50%);
  transition: transform var(--ink-fast) var(--ink-ease);
}

.slider-track:hover .slider-thumb,
.slider-track:active .slider-thumb {
  transform: translate(-50%, -50%) scale(1.15);
}

.slider-value {
  min-width: 34px;
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
  font-variant-numeric: tabular-nums;
}

/* Swatches and color picker ---------------------------------------------------------------- */

.swatch {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--vscode-foreground, #888) 30%, transparent);
  border-radius: 50%;
  cursor: pointer;
  transition: transform var(--ink-fast) var(--ink-ease);
}

.swatch:hover {
  transform: scale(1.12);
}

.swatch.small {
  width: 16px;
  height: 16px;
}

.swatch.active {
  box-shadow:
    0 0 0 2px var(--ink-surface),
    0 0 0 3.5px var(--ink-accent);
}

.color-picker-trigger {
  background: conic-gradient(
    from 90deg,
    #f43f5e,
    #f59e0b,
    #84cc16,
    #06b6d4,
    #6366f1,
    #d946ef,
    #f43f5e
  );
}

.color-picker {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 224px;
  padding: 10px;
  font-family: var(--vscode-font-family);
  font-size: var(--ink-font);
  animation: ink-pop-in var(--ink-normal) var(--ink-ease);
}

.color-area {
  position: relative;
  height: 140px;
  border-radius: var(--ink-radius-sm);
  background-image:
    linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent) !important;
  cursor: crosshair;
  touch-action: none;
}

.color-hue {
  position: relative;
  height: 12px;
  border-radius: var(--ink-radius-pill);
  background: linear-gradient(
    to right,
    #f00 0%,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    #f00 100%
  );
  cursor: pointer;
  touch-action: none;
}

.color-handle {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.35),
    0 1px 4px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: 1px solid var(--ink-border-strong);
  border-radius: var(--ink-radius-sm);
}

.color-hex {
  flex: 1;
  min-width: 0;
  height: 26px;
  padding: 0 8px;
  border: 1px solid var(--vscode-input-border, var(--ink-border));
  border-radius: var(--ink-radius-sm);
  outline: none;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-family: var(--vscode-editor-font-family, monospace);
  font-size: var(--ink-font-sm);
  text-transform: lowercase;
}

.color-hex:focus {
  border-color: var(--ink-focus);
}

.color-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding-top: 8px;
  border-top: 1px solid var(--ink-border-subtle);
}

/* Chips and badges ------------------------------------------------------------------------- */

.badge {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 7px;
  border-radius: var(--ink-radius-pill);
  background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground);
  font-size: var(--ink-font-xs);
  font-weight: 500;
  white-space: nowrap;
}

.badge.outline {
  border: 1px solid var(--ink-border-strong);
  background: transparent;
  color: var(--ink-muted);
}

.badge.success {
  background: color-mix(in srgb, var(--ink-success) 18%, transparent);
  color: var(--ink-success);
}

.badge.danger {
  background: color-mix(in srgb, var(--ink-danger) 18%, transparent);
  color: var(--ink-danger);
}

/* Key caps (shortcuts) --------------------------------------------------------------------- */

.keycaps {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 3px;
}

.keycap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border: 1px solid var(--vscode-keybindingLabel-border, var(--ink-border-strong));
  border-radius: var(--ink-radius-sm);
  background: var(--vscode-keybindingLabel-background, var(--ink-surface-sunken));
  box-shadow: inset 0 -1px 0 var(--vscode-keybindingLabel-bottomBorder, var(--ink-border-strong));
  color: var(--vscode-keybindingLabel-foreground, var(--vscode-foreground));
  font-family: var(--vscode-font-family);
  font-size: var(--ink-font-xs);
  font-weight: 500;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.keycaps.size-sm .keycap {
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 10.5px;
}

/* Cards ------------------------------------------------------------------------------------ */

.card {
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius-lg);
  background: var(--ink-surface-sunken);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--ink-space-3);
  padding: var(--ink-space-3) var(--ink-space-4);
  border-bottom: 1px solid var(--ink-border-subtle);
}

.card-title {
  margin: 0;
  font-size: var(--ink-font);
  font-weight: 600;
}

.card-body {
  padding: var(--ink-space-4);
}

.card-row {
  display: flex;
  align-items: center;
  gap: var(--ink-space-4);
  padding: var(--ink-space-3) var(--ink-space-4);
}

.card-row + .card-row {
  border-top: 1px solid var(--ink-border-subtle);
}

.card-row-text {
  flex: 1;
  min-width: 0;
}

.card-row-title {
  font-weight: 500;
}

.card-row-description {
  margin-top: 2px;
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
}

/* Menus and popovers ----------------------------------------------------------------------- */

.menu,
.popover {
  position: fixed;
  /* Above the send dialog (900), like select lists and the color picker. */
  z-index: 1000;
  /* Narrow views (a slim sidebar) keep the whole menu on screen. */
  min-width: min(200px, calc(100vw - 8px));
  max-width: min(420px, calc(100vw - 8px));
  padding: 4px;
  animation: ink-pop-in var(--ink-normal) var(--ink-ease);
}

/* Long menus (a big bookmarks folder) stay short and scroll, like Chrome's. Items have a little
   room between them. */
.menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 5px;
  max-height: min(420px, calc(100vh - 8px));
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* The menu's wrapper takes no place where it is rendered (a flex column with a gap, like the send
   dialog, would otherwise grow while the menu is open). */
.menu-root {
  display: contents;
}

/* Submenus open without the pop animation, so they don't jump while the pointer moves. */
.menu .menu {
  animation: none;
}

.menu-item.expanded:not(:focus) {
  background: var(--ink-hover);
}

.menu-image {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.menu-arrow {
  margin-left: 12px;
  margin-right: -2px;
  opacity: 0.8;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 100%;
  height: 28px;
  padding: 0 10px 0 8px;
  border: none;
  border-radius: var(--ink-radius-sm);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover:not(:disabled),
.menu-item:focus {
  background: var(--vscode-menu-selectionBackground, var(--vscode-list-activeSelectionBackground));
  color: var(--vscode-menu-selectionForeground, var(--vscode-list-activeSelectionForeground));
  outline: none;
}

.menu-item:disabled {
  opacity: 0.45;
  cursor: default;
}

.menu-label {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* A title over the items after it (an agent, then what can be done with it). Not focusable. */
.menu-heading {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 26px;
  padding: 0 10px 0 8px;
  cursor: default;
}

.menu-heading-label {
  flex-shrink: 0;
  max-width: 60%;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.menu-heading-detail {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Items under a heading start where its label does, so they read as its actions. */
.menu-item.indented {
  padding-left: 32px;
}

.menu-shortcut {
  margin-left: 16px;
  opacity: 0.7;
  font-size: 0.9em;
}

.menu-separator {
  flex-shrink: 0;
  height: 1px;
  margin: 3px 6px;
  background: var(--vscode-menu-separatorBackground, var(--ink-border));
}

/* Toast ------------------------------------------------------------------------------------ */

.toast {
  position: fixed;
  bottom: 16px;
  left: 50%;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: calc(100% - 32px);
  padding: 8px 14px;
  transform: translateX(-50%);
  background: var(--vscode-notifications-background, var(--ink-surface));
  color: var(--vscode-notifications-foreground, var(--vscode-foreground));
  border: 1px solid var(--vscode-notifications-border, var(--ink-border));
  border-radius: var(--ink-radius);
  box-shadow: var(--ink-shadow-lg);
  animation: toast-in var(--ink-normal) var(--ink-ease);
}

/* A failure: marked as one, longer on screen, and dismissible. */
.toast.error {
  border-color: var(--vscode-inputValidation-errorBorder, var(--ink-danger));
}

.toast.error > .codicon-error {
  flex-shrink: 0;
  color: var(--ink-danger);
}

.toast .toast-dismiss {
  flex-shrink: 0;
  margin: -4px -8px -4px 0;
}

.header-actions,
.button-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/* Drawing ---------------------------------------------------------------------------------- */

.draw-toolbar {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--ink-surface);
  border-top: 1px solid var(--ink-border);
  border-bottom: 1px solid var(--ink-border);
}

.draw-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-right: 6px;
  border-right: 1px solid var(--ink-border-subtle);
}

.draw-group.colors {
  gap: 6px;
  padding: 0 8px 0 4px;
}

.draw-capture {
  margin-left: 2px;
}

.draw-close {
  margin-left: auto;
}

.drawing-layer {
  position: absolute;
  z-index: 3;
}

.drawing-layer canvas {
  position: relative;
  display: block;
  touch-action: none;
}

/* A live redaction (liveRedactions): blurs the page behind it, under the drawing canvas. Drawn
   over page content, so its colors are fixed. */
.drawing-redaction {
  position: absolute;
  pointer-events: none;
  background: rgba(128, 128, 128, 0.2);
  backdrop-filter: blur(12px) saturate(0.5);
}

.drawing-text-input {
  position: absolute;
  min-width: 160px;
  min-height: 1.6em;
  padding: 2px 4px;
  border: 1px dashed var(--ink-accent);
  background: rgba(255, 255, 255, 0.85);
  font-family: system-ui, sans-serif;
  font-weight: 600;
  resize: both;
  outline: none;
}

/* Motion ----------------------------------------------------------------------------------- */

@keyframes ink-fade-in {
  from {
    opacity: 0;
  }
}

@keyframes ink-pop-in {
  from {
    opacity: 0;
    transform: translateY(-3px) scale(0.985);
  }
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .select-list,
  .color-picker,
  .menu,
  .popover,
  .toast {
    animation: none;
  }
}

/* Shortcut list (ShortcutList) ------------------------------------------------------------- */

.shortcuts-warning {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 12px 8px;
  color: var(--ink-warning);
  font-size: var(--ink-font-sm);
}

/* Groups: a pinned header per mode. */
.group-header {
  position: sticky;
  top: var(--shortcut-sticky-top, 0);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 28px;
  padding: 0 12px 0 6px;
  border: none;
  border-top: 1px solid var(--ink-border-subtle);
  background: var(--vscode-sideBar-background, var(--vscode-editor-background));
  color: var(--vscode-sideBarSectionHeader-foreground, var(--vscode-foreground));
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.group-header:hover {
  background: var(--vscode-list-hoverBackground);
}

.group-header:focus-visible {
  outline: 1px solid var(--ink-focus);
  outline-offset: -1px;
}

.group-icon {
  color: var(--ink-accent-fg);
}

.group-title {
  font-size: var(--ink-font-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.group-count {
  margin-left: auto;
  padding: 0 6px;
  border-radius: var(--ink-radius-pill);
  background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground);
  font-size: var(--ink-font-xs);
  line-height: 16px;
}

/* Rows: label, then actions (on hover), then the keys in a right-aligned column. */
.shortcut-item {
  position: relative;
  padding: 0 12px 0 32px;
  border-radius: var(--ink-radius);
  transition: background-color var(--ink-fast) var(--ink-ease);
}

.shortcut-item::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 20px;
  width: 2px;
  border-radius: 1px;
  background: transparent;
}

.shortcut-item.changed::before {
  background: var(--ink-accent);
}

.shortcut-item.conflict::before {
  background: var(--ink-warning);
}

/* Outside VS Code (the browser extension) there is no list hover color: the kit's hover. */
.shortcut-item:hover,
.shortcut-item:focus-within {
  background: var(--vscode-list-hoverBackground, var(--ink-hover));
}

body.vscode-high-contrast .shortcut-item:hover,
body.vscode-high-contrast .shortcut-item:focus-within {
  outline: 1px dashed var(--vscode-contrastActiveBorder);
  outline-offset: -1px;
}

.shortcut-main {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
}

.shortcut-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Where a key works: VS (VS Code Browser) and BR (the browser toolbar), and the browser's own key. */
.shortcut-places {
  display: inline-flex;
  flex-shrink: 0;
  gap: 3px;
}

.shortcut-tag {
  --tag: var(--ink-muted);
  flex-shrink: 0;
  min-width: 22px;
  padding: 0 4px;
  border: 1px solid color-mix(in srgb, var(--tag) 40%, transparent);
  border-radius: var(--ink-radius-sm);
  background: color-mix(in srgb, var(--tag) 10%, transparent);
  color: var(--tag);
  font-size: var(--ink-font-xs);
  font-weight: 600;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.02em;
}

.shortcut-tag.vs {
  --tag: var(--ink-blue);
}

.shortcut-tag.br {
  --tag: var(--ink-green);
}

body.vscode-high-contrast .shortcut-tag {
  border-color: var(--vscode-contrastBorder);
  background: transparent;
  color: var(--vscode-foreground);
}

.shortcut-item.changed .shortcut-label {
  font-weight: 500;
}

.shortcut-actions {
  display: inline-flex;
  flex-shrink: 0;
  justify-content: flex-end;
  gap: 1px;
  /* Room for both buttons (reset, add a key) in every row, so the columns line up. */
  min-width: calc(2 * var(--ink-control-sm) + 1px);
  opacity: 0;
  transition: opacity var(--ink-fast) var(--ink-ease);
}

.shortcut-item:hover .shortcut-actions,
.shortcut-item:focus-within .shortcut-actions {
  opacity: 1;
}

.shortcut-keys-column {
  display: inline-flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  /* A steady width, so the VS/BR tags before it line up from row to row. */
  min-width: min(184px, 40%);
  max-width: 62%;
}

.key-button-wrap {
  position: relative;
  display: inline-flex;
}

.key-button {
  display: inline-flex;
  padding: 2px;
  border: 1px solid transparent;
  border-radius: var(--ink-radius);
  background: transparent;
  cursor: pointer;
}

.key-button:hover {
  border-color: var(--ink-border-strong);
  background: var(--ink-surface-sunken);
}

.key-button:focus-visible {
  outline: 1px solid var(--ink-focus);
}

/* The remove badge sits on the key's corner, so showing it doesn't move anything. */
.key-remove {
  position: absolute;
  top: -5px;
  right: -5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 1px solid var(--ink-border-strong);
  border-radius: 50%;
  background: var(--ink-surface-raised);
  color: var(--ink-muted);
  opacity: 0;
  cursor: pointer;
  transition: opacity var(--ink-fast) var(--ink-ease);
}

.key-remove .codicon {
  font-size: 10px !important;
}

.key-button-wrap:hover .key-remove,
.key-remove:focus-visible {
  opacity: 1;
}

.key-remove:hover {
  border-color: var(--ink-danger);
  background: var(--ink-danger);
  color: #fff;
}

.key-empty {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 22px;
  padding: 0 8px;
  border: 1px dashed var(--ink-border-strong);
  border-radius: var(--ink-radius-sm);
  background: transparent;
  color: var(--ink-muted);
  font: inherit;
  font-size: var(--ink-font-xs);
  cursor: pointer;
}

.key-empty:hover {
  border-color: var(--ink-focus);
  color: var(--vscode-foreground);
}

.key-empty .codicon {
  font-size: 12px !important;
}

.key-recording {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 2px 0 8px;
  border: 1px solid var(--ink-focus);
  border-radius: var(--ink-radius-sm);
  background: var(--ink-accent-soft);
  box-shadow: 0 0 0 1px var(--ink-focus);
  font-size: var(--ink-font-xs);
}

.recording-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  animation: ink-shortcut-pulse 1s ease-in-out infinite;
}

.key-recording-cancel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: var(--ink-radius-sm);
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
}

.key-recording-cancel:hover {
  background: var(--ink-hover);
  color: inherit;
}

.shortcut-conflict {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 6px;
  padding: 0 0 6px;
  color: var(--ink-warning);
  font-size: var(--ink-font-sm);
}

@keyframes ink-shortcut-pulse {
  50% {
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .recording-dot {
    animation: none;
  }
}

body.vscode-high-contrast .key-button:hover {
  border-color: var(--vscode-contrastBorder);
}

/* Several keys for one action: "Ctrl T / Ctrl F4". */
.key-button-wrap + .key-button-wrap::before {
  content: '/';
  align-self: center;
  margin-right: 2px;
  color: var(--ink-muted);
  font-size: var(--ink-font-xs);
}

/* Element picker hint (PickerHint) ------------------------------------------------------------
   Drawn over page content, so it has its own dark look (the theme's colors could vanish on the
   page), in both products. Each product places it. */
/* One row: what a click does, with each modifier, then the keys. */
.picker-hint {
  display: flex;
  align-items: center;
  gap: 14px;
  /* Its own width: centered with left: 50%, it would otherwise wrap at half the page. */
  width: max-content;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--ink-radius-lg);
  background: rgba(24, 24, 27, 0.9);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  color: #fafafa;
  font-family: var(--vscode-font-family, system-ui, sans-serif);
  font-size: 12px;
  line-height: 1;
  pointer-events: none;
  backdrop-filter: blur(6px);
}

.picker-hint-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.picker-hint-label {
  color: rgba(250, 250, 250, 0.82);
}

/* The main action, as a sentence; the others read "[Shift] + click  select several". */
.picker-hint-lead {
  color: #fff;
  font-weight: 600;
}

.picker-hint-click {
  color: #fff;
  font-weight: 500;
}

.picker-hint .keycap {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.14);
  color: #fff;
}

/* Multi-selection bar (SelectionBar) ----------------------------------------------------------
   Over page content like the picker hint, so the same dark look; each product places it. */
.selection-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  width: max-content;
  max-width: calc(100vw - 32px);
  padding: 5px 6px 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--ink-radius-lg);
  background: rgba(24, 24, 27, 0.94);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  color: #fafafa;
  font-family: var(--vscode-font-family, system-ui, sans-serif);
  font-size: 12px;
  pointer-events: auto;
}

.selection-bar-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 6px;
  font-weight: 600;
}

.selection-bar-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: var(--ink-radius-pill);
  background: #0a84ff;
  color: #fff;
  font-size: var(--ink-font-xs);
}

.selection-bar .button.ghost,
.selection-bar .icon-button {
  color: #fafafa;
}

.selection-bar .button.ghost:hover:not(:disabled),
.selection-bar .icon-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

.selection-bar .keycap {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.16);
  box-shadow: none;
  color: #fff;
}

/* Thumbnails with a checkbox each (ThumbPicker): screenshots taken together ------------------- */
.thumb-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: var(--ink-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.thumb-picker-item {
  position: relative;
  border-radius: var(--ink-radius);
}

.thumb-picker-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16 / 10;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius);
  background: var(--vscode-editor-background);
  color: var(--ink-muted);
  cursor: pointer;
  transition:
    opacity var(--ink-fast) var(--ink-ease),
    border-color var(--ink-fast) var(--ink-ease);
}

.thumb-picker-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.thumb-picker-image:hover {
  border-color: var(--ink-border-strong);
}

/* Left out: dimmed, so what is sent stands out. */
.thumb-picker-item:not(.on) .thumb-picker-image {
  opacity: 0.45;
}

.thumb-picker-item.on .thumb-picker-image {
  border-color: var(--ink-accent);
}

.thumb-picker-check {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px;
  border-radius: var(--ink-radius-sm);
  background: color-mix(in srgb, var(--vscode-editor-background) 80%, transparent);
  box-shadow: var(--ink-shadow-sm);
}

body.vscode-high-contrast .thumb-picker-item.on .thumb-picker-image {
  outline: 1px solid var(--vscode-contrastActiveBorder);
}

/* The send dialog after a capture (SendModal) ------------------------------------------- */

.ink-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ink-space-4);
  background: color-mix(in srgb, #000 35%, transparent);
  animation: ink-fade-in var(--ink-normal) var(--ink-ease);
  pointer-events: auto;
}

.ink-modal {
  display: flex;
  flex-direction: column;
  gap: var(--ink-space-3);
  width: min(480px, 100%);
  max-height: calc(100vh - 2 * var(--ink-space-4));
  overflow: auto;
  padding: var(--ink-space-4);
  background: var(--ink-surface);
  color: var(--vscode-editorWidget-foreground, var(--vscode-foreground));
  border: 1px solid var(--vscode-editorWidget-border, var(--ink-border));
  border-radius: var(--ink-radius-lg);
  box-shadow: var(--ink-shadow-lg);
  font-family: var(--vscode-font-family);
  font-size: var(--ink-font);
  text-align: left;
  animation: ink-pop-in var(--ink-normal) var(--ink-ease);
}

.ink-modal:focus {
  outline: none;
}

.ink-modal-head {
  display: flex;
  align-items: flex-start;
  gap: var(--ink-space-3);
}

.ink-modal-detail {
  line-height: 1.35;
}

/* The captures: one row of equal tiles under the heading. */
.ink-modal-thumbs {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: var(--ink-space-2);
}

.ink-modal-thumb {
  position: relative;
  display: block;
  height: 64px;
  overflow: hidden;
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius);
  background: var(--ink-surface-sunken);
}

.ink-modal-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.ink-modal-more {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, #000 55%, transparent);
  color: #fff;
  font-size: var(--ink-font);
  font-weight: 600;
}

.ink-modal-heading {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--ink-space-1);
  min-width: 0;
}

.ink-modal-project {
  flex-wrap: nowrap;
  white-space: nowrap;
}

.ink-modal-title {
  display: flex;
  align-items: center;
  gap: var(--ink-space-2);
  font-size: calc(var(--ink-font) + 1px);
  font-weight: 600;
}

/* One line: a long title (an element's classes) ends in an ellipsis rather than widen the
   dialog; hovering shows it whole. */
.ink-modal-title-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ink-modal-detail {
  overflow-wrap: anywhere;
}

.ink-modal-title .codicon {
  flex-shrink: 0;
  color: var(--ink-success);
}

.ink-modal-project,
.ink-modal-detail {
  display: flex;
  align-items: center;
  gap: var(--ink-space-1);
  font-size: var(--ink-font-sm);
}

.ink-modal-project-name {
  font-weight: 600;
}

.ink-modal-detail,
.ink-modal-project .ink-muted,
.ink-modal-empty,
.ink-modal-label,
.ink-modal-where,
.ink-modal-status {
  color: var(--ink-muted);
}

.ink-modal-label {
  display: flex;
  align-items: center;
  gap: var(--ink-space-2);
  margin-bottom: calc(-1 * var(--ink-space-1));
  font-size: var(--ink-font-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ink-modal-count {
  padding: 0 6px;
  border-radius: var(--ink-radius-pill);
  background: var(--ink-surface-sunken);
  letter-spacing: 0;
}

.ink-modal-targets {
  display: flex;
  flex-direction: column;
  gap: var(--ink-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ink-modal-target {
  display: flex;
  align-items: center;
  gap: var(--ink-space-1);
}

.ink-modal-open-space {
  flex-shrink: 0;
  width: var(--ink-control);
}

.ink-modal-send {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--ink-space-3);
  min-width: 0;
  min-height: 52px;
  padding: var(--ink-space-2) var(--ink-space-3) var(--ink-space-2) var(--ink-space-2);
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius-lg);
  background: var(--ink-surface-sunken);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--ink-fast) var(--ink-ease),
    border-color var(--ink-fast) var(--ink-ease);
}

.ink-modal-send:hover:not(:disabled) {
  border-color: var(--ink-border-strong);
  background: var(--ink-hover);
}

.ink-modal-send:disabled {
  cursor: default;
  opacity: 0.6;
}

.ink-modal-send:focus-visible {
  outline: 1px solid var(--ink-focus);
  outline-offset: -1px;
}

.ink-modal-target.default .ink-modal-send {
  border-color: var(--ink-accent);
  background: var(--ink-accent-soft);
}

.ink-modal-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--ink-radius);
  background: color-mix(in srgb, var(--vscode-foreground) 8%, transparent);
}

.ink-modal-icon .codicon {
  font-size: 17px;
}

.ink-modal-target.default .ink-modal-icon {
  background: var(--ink-accent);
  color: var(--vscode-button-foreground, #fff);
}

.ink-modal-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.ink-modal-agent {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ink-modal-where {
  overflow: hidden;
  font-size: var(--ink-font-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ink-modal-keys {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--ink-space-1);
}

.ink-modal-number {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  border: 1px solid var(--ink-border-strong);
  border-radius: var(--ink-radius-sm);
  color: var(--ink-muted);
  font-size: var(--ink-font-xs);
}

.ink-modal-thread {
  align-self: flex-start;
}

/* agentmux isn't open: its agents stay listed, dimmed (a send opens agentmux first). */
.ink-modal-target.closed:not(.default) .ink-modal-send {
  border-style: dashed;
  background: transparent;
}

.ink-modal-target.closed:not(.default) .ink-modal-icon,
.ink-modal-target.closed:not(.default) .ink-modal-agent {
  opacity: 0.6;
}

.ink-modal-note {
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
}

.ink-modal-empty {
  padding: var(--ink-space-3);
  border: 1px dashed var(--ink-border-strong);
  border-radius: var(--ink-radius-lg);
  text-align: center;
}

.ink-modal-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ink-space-2);
  padding-top: var(--ink-space-3);
  border-top: 1px solid var(--ink-border-subtle);
}

.ink-modal-status {
  flex: 1;
  min-width: 160px;
  font-size: var(--ink-font-sm);
}

.ink-modal-status.tone-error {
  color: var(--ink-danger);
}

.ink-modal-status.tone-ok {
  color: var(--ink-success);
}

body.vscode-high-contrast .ink-modal-target.default .ink-modal-send {
  outline: 1px solid var(--vscode-contrastActiveBorder);
}

@media (forced-colors: active) {
  .ink-modal-target.default .ink-modal-send {
    outline: 2px solid Highlight;
  }
}

/* Saved list (SavedList) ----------------------------------------------------------------------
   A project's captures, in VS Code's Saved view and the browser's side panel. Cards are a lighter
   tint of the sidebar, with no outline: in themes like Tokyo Night the sidebar, editor and
   borders are all the same near-black. */
.saved {
  --card-bg: color-mix(
    in srgb,
    var(--vscode-foreground, #888) 5%,
    var(--vscode-sideBar-background, transparent)
  );
  display: flex;
  flex-direction: column;
  container: saved / inline-size;
}

/* The agent picker and filters, pinned at the top. */
.saved-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--ink-space-2);
  padding: var(--ink-space-2) var(--ink-space-3);
  border-bottom: 1px solid var(--ink-border-subtle);
  background: var(--vscode-sideBar-background, var(--vscode-editor-background));
}

/* Filters fill the width; below 480px only their icons and counts show (names are tooltips). */
.saved-filter {
  display: flex;
  width: 100%;
}

.saved-filter .segment {
  flex: 1 1 auto;
  min-width: 0;
  gap: 4px;
  padding: 0 4px;
}

@container saved (max-width: 260px) {
  .saved-filter .segment-count:not(.error) {
    display: none;
  }
}

@container saved (max-width: 480px) {
  .saved-filter .segment-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}

/* Items. */
.saved-list {
  display: flex;
  flex-direction: column;
  gap: var(--ink-space-2);
  margin: 0;
  padding: var(--ink-space-2) var(--ink-space-3) var(--ink-space-3);
  list-style: none;
}

.saved-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: var(--ink-radius-lg);
  background: var(--card-bg);
  outline: none;
  transition:
    border-color var(--ink-fast) var(--ink-ease),
    background var(--ink-fast) var(--ink-ease);
}

.saved-card:hover {
  background: color-mix(in srgb, var(--vscode-foreground, #888) 4%, var(--card-bg));
}

.saved-card:focus-visible {
  border-color: var(--ink-focus);
}

/* Screenshots, recordings and element captures: a preview across the card's width. The whole
   image shows (a short element strip isn't cropped to nothing); only tall captures, such as full
   pages, are cropped to their top. */
.saved-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  max-height: 150px;
  padding: 6px;
  overflow: hidden;
  border: none;
  border-radius: var(--ink-radius);
  background: var(--vscode-sideBar-background, var(--vscode-editor-background));
  cursor: zoom-in;
  transition: opacity var(--ink-fast) var(--ink-ease);
}

.saved-thumb:hover {
  opacity: 0.88;
}

.saved-thumb:focus-visible {
  outline: 1px solid var(--ink-focus);
  outline-offset: 1px;
}

.saved-thumb img {
  display: block;
  max-width: 100%;
  max-height: 136px;
  border-radius: var(--ink-radius-sm);
  object-fit: contain;
}

.saved-thumb.tall {
  height: 150px;
  padding: 0;
}

.saved-thumb.tall img {
  width: 100%;
  height: 100%;
  max-height: none;
  border-radius: 0;
  object-fit: cover;
  object-position: top center;
}

.saved-card-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.saved-card-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--ink-radius);
  background: color-mix(in srgb, var(--kind-tone) 14%, transparent);
  color: var(--kind-tone);
}

.saved-card {
  --kind-tone: var(--ink-blue);
}

.saved-card.kind-errors,
.saved-card.kind-network {
  --kind-tone: var(--ink-red);
}

.saved-card.kind-report,
.saved-card.kind-measure {
  --kind-tone: var(--ink-green);
}

.saved-card.kind-css,
.saved-card.kind-color {
  --kind-tone: var(--ink-magenta);
}

.saved-card-heading {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.saved-card-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.saved-card-title {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  /* The editor text color: some themes (Tokyo Night) keep the sidebar foreground quite dim. */
  color: var(--vscode-editor-foreground, var(--vscode-foreground));
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* A soft chip in the link color, readable on light, dark and high-contrast backgrounds alike. */
.saved-card-badge {
  flex-shrink: 0;
  padding: 0 7px;
  border-radius: var(--ink-radius-pill);
  background: color-mix(in srgb, var(--ink-blue) 16%, transparent);
  color: var(--ink-blue);
  font-size: var(--ink-font-xs);
  font-weight: 600;
  line-height: 16px;
}

.saved-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0 6px;
  min-width: 0;
  color: var(--ink-muted);
  font-size: var(--ink-font-xs);
}

.saved-card-meta span {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.saved-card-meta span + span::before {
  content: '\xB7';
  margin-right: 6px;
}

.saved-card-preview {
  margin: 0;
  padding: 6px 8px;
  border-radius: var(--ink-radius-sm);
  background: var(--vscode-textCodeBlock-background, var(--ink-surface));
  color: var(--vscode-descriptionForeground, var(--ink-muted));
  font-family: var(--vscode-editor-font-family, monospace);
  font-size: var(--ink-font-xs);
  line-height: 1.45;
}

/* Clamped inside the padding, so no half line shows below it. */
.saved-card-preview span {
  display: -webkit-box;
  overflow: hidden;
  word-break: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.saved-card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

/* Send, and a chevron for another agent, joined into one control. */
.saved-send {
  display: inline-flex;
  flex-shrink: 0;
}

.saved-send .saved-send-more {
  min-width: 0;
  /* A hairline of the card shows between the two halves. */
  margin-left: 1px;
  padding: 0 5px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.saved-send .button:first-child:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.saved-card-tools {
  display: inline-flex;
  gap: 1px;
  margin-left: auto;
  opacity: 0.55;
  transition: opacity var(--ink-fast) var(--ink-ease);
}

.saved-card:hover .saved-card-tools,
.saved-card:focus-within .saved-card-tools {
  opacity: 1;
}

.saved-card-sent {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  color: var(--ink-green);
  font-size: var(--ink-font-xs);
}

.saved-card-sent .codicon {
  flex-shrink: 0;
  font-size: 12px !important;
}

.saved-card-sent span:last-child {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Very narrow: the send button takes the whole row, the tools go below it. */
@container saved (max-width: 210px) {
  .saved-send,
  .saved-send .button:first-child {
    flex: 1;
  }

  .saved-card-tools {
    margin-left: 0;
  }
}

.saved-none {
  margin: var(--ink-space-4) var(--ink-space-3);
  color: var(--ink-muted);
  text-align: center;
}

.saved-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ink-space-2);
  margin-top: auto;
  padding: 6px var(--ink-space-3);
  border-top: 1px solid var(--ink-border-subtle);
  background: var(--vscode-sideBar-background, var(--vscode-editor-background));
}

.saved-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  color: var(--ink-muted);
  font-size: var(--ink-font-xs);
  white-space: nowrap;
}

@container saved (max-width: 320px) {
  .saved-hint {
    display: none;
  }

  .saved-footer {
    justify-content: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .saved-card,
  .saved-card-tools {
    transition: none;
  }
}

body.vscode-high-contrast .saved-card {
  border-color: var(--vscode-contrastBorder);
}

body.vscode-high-contrast .saved-card.latest,
body.vscode-high-contrast .saved-card:focus-visible {
  border-color: var(--vscode-contrastActiveBorder, var(--ink-focus));
}

/* Selecting cards (to send, remove or group several): a checkbox over the card's top-left corner
   (the kind icon or the thumbnail), shown on hover, on focus, and on every card while anything is
   selected. It takes no room, so showing it moves nothing. */
.saved-card {
  position: relative;
}

.saved-card-select {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 1;
  padding: 2px;
  border-radius: var(--ink-radius-sm);
  background: var(--card-bg);
  visibility: hidden;
  opacity: 0;
  transition: opacity var(--ink-fast) var(--ink-ease);
}

.saved-card:hover .saved-card-select,
.saved-card:focus-within .saved-card-select,
.saved.selecting .saved-card-select,
.saved-card.selected .saved-card-select {
  visibility: visible;
  opacity: 1;
}

/* The kind icon gives its place to the checkbox. */
.saved-card:hover .saved-card-icon > .codicon,
.saved-card:focus-within .saved-card-icon > .codicon,
.saved.selecting .saved-card-icon > .codicon,
.saved-card.selected .saved-card-icon > .codicon {
  visibility: hidden;
}

.saved-card.selected {
  border-color: var(--ink-accent);
  background: color-mix(in srgb, var(--ink-accent) 8%, var(--card-bg));
}

body.vscode-high-contrast .saved-card.selected {
  border-color: var(--vscode-contrastActiveBorder);
}

/* A group: screenshots taken (or grouped) together, one thumbnail each. */
.saved-group .saved-card-icon {
  --kind-tone: var(--ink-blue);
}

.saved-card-count {
  flex-shrink: 0;
  min-width: 18px;
  padding: 0 5px;
  border-radius: var(--ink-radius-pill);
  background: color-mix(in srgb, var(--vscode-foreground, #888) 12%, transparent);
  color: var(--vscode-foreground);
  font-size: var(--ink-font-xs);
  font-weight: 600;
  line-height: 16px;
  text-align: center;
}

.saved-group-thumbs {
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
}

/* The footer while cards are selected: what to do with all of them. */
.saved-selection {
  justify-content: flex-start;
  gap: 4px;
}

.saved-selection-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: auto;
  font-weight: 600;
}

.saved-selection-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: var(--ink-radius-pill);
  background: var(--ink-accent);
  color: var(--vscode-button-foreground);
  font-size: var(--ink-font-xs);
}

/* A group of elements (or other text): a checklist, one row each. */
.saved-group-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 4px;
  border-radius: var(--ink-radius);
  background: var(--ink-surface-sunken);
  list-style: none;
}

.saved-group-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 3px 4px 3px 6px;
  border-radius: var(--ink-radius-sm);
}

.saved-group-row:hover {
  background: var(--vscode-list-hoverBackground, var(--ink-hover));
}

.saved-group-row:not(.on) .saved-group-row-text,
.saved-group-row:not(.on) .saved-group-row-icon {
  opacity: 0.5;
}

.saved-group-row-icon {
  flex-shrink: 0;
  color: var(--ink-blue);
}

.saved-group-row-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.saved-group-row-title {
  overflow: hidden;
  color: var(--vscode-editor-foreground, var(--vscode-foreground));
  font-family: var(--vscode-editor-font-family, monospace);
  font-size: var(--ink-font-xs);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.saved-group-row-detail {
  overflow: hidden;
  color: var(--ink-muted);
  font-size: var(--ink-font-xs);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.saved-group-row-open {
  opacity: 0;
}

.saved-group-row:hover .saved-group-row-open,
.saved-group-row:focus-within .saved-group-row-open {
  opacity: 1;
}

/* After a removal: what went, and Undo (for a few seconds). */
.saved-undo-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  color: var(--vscode-foreground);
  font-size: var(--ink-font-xs);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.saved-undo-text .codicon {
  color: var(--ink-muted);
}

/* Send and its chevron, then Open in agentmux. */
.saved-send-group {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
}

/* A thumbnail that opens nothing (the side panel). */
.saved-thumb.still {
  cursor: default;
}

.saved-thumb.still:hover {
  opacity: 1;
}

@container saved (max-width: 210px) {
  .saved-send-group {
    flex: 1;
  }
}
`;var ld={global:"Browser",inspect:"Element picker",draw:"Drawing",screenshot:"Screenshot",devtools:"Console and network",device:"Device",measure:"Measure",eyedropper:"Eyedropper",overlay:"Design overlay",tweak:"CSS tweak",record:"Record",a11y:"Accessibility check",send:"Send dialog"},R=e=>`vscodeBrowser.${e}`,nl=[{id:"tab.new",label:"New tab",scope:"global",keys:["ctrl+t"],command:R("newTab")},{id:"tab.close",label:"Close tab",scope:"global",keys:["ctrl+w","ctrl+f4"],command:R("closeTab")},{id:"tab.reopen",label:"Reopen closed tab",scope:"global",keys:["ctrl+shift+t"],command:R("reopenClosedTab")},{id:"tab.next",label:"Next tab",scope:"global",keys:["ctrl+tab","ctrl+pagedown"],mac:["ctrl+tab","cmd+alt+right"],command:R("nextTab")},{id:"tab.previous",label:"Previous tab",scope:"global",keys:["ctrl+shift+tab","ctrl+pageup"],mac:["ctrl+shift+tab","cmd+alt+left"],command:R("previousTab")},{id:"tab.duplicate",label:"Duplicate tab",scope:"global",keys:[],command:R("duplicateTab")},{id:"tab.private",label:"New private tab",scope:"global",keys:["ctrl+shift+n"],command:R("newPrivateTab")},{id:"window.new",label:"New window",scope:"global",keys:["ctrl+n"],command:R("newWindow")},{id:"nav.address",label:"Focus the address bar",scope:"global",keys:["ctrl+l","alt+d"],mac:["cmd+l","alt+d"],command:R("focusAddressBar")},{id:"nav.back",label:"Back",scope:"global",keys:["alt+left"],mac:["cmd+["],command:R("goBack")},{id:"nav.forward",label:"Forward",scope:"global",keys:["alt+right"],mac:["cmd+]"],command:R("goForward")},{id:"nav.reload",label:"Reload",scope:"global",keys:["ctrl+r","f5"],mac:["cmd+r"],command:R("reload")},{id:"nav.hardReload",label:"Hard reload",scope:"global",keys:["ctrl+shift+r","ctrl+f5"],mac:["cmd+shift+r"],command:R("hardReload")},{id:"nav.stop",label:"Stop loading",scope:"global",keys:[],command:R("stop")},{id:"nav.home",label:"Home page",scope:"global",keys:["alt+home"],mac:["cmd+shift+h"],command:R("goHome")},{id:"page.find",label:"Find in page",scope:"global",keys:["ctrl+f"],command:R("find")},{id:"page.zoomIn",label:"Zoom in",scope:"global",keys:["ctrl+=","ctrl+shift+="],command:R("zoomIn")},{id:"page.zoomOut",label:"Zoom out",scope:"global",keys:["ctrl+-"],command:R("zoomOut")},{id:"page.zoomReset",label:"Reset zoom",scope:"global",keys:["ctrl+0"],command:R("zoomReset")},{id:"page.bookmark",label:"Bookmark this page",scope:"global",keys:["ctrl+d"],command:R("bookmarkPage")},{id:"page.source",label:"View page source",scope:"global",keys:["ctrl+u"],mac:["cmd+alt+u"],command:R("viewSource")},{id:"page.pdf",label:"Save page as PDF",scope:"global",keys:[],command:R("savePdf")},{id:"page.copyUrl",label:"Copy page address",scope:"global",keys:["ctrl+shift+l"],command:R("copyUrl")},{id:"page.external",label:"Open in system browser",scope:"global",keys:[],command:R("openInSystemBrowser")},{id:"page.devtools",label:"Open DevTools",scope:"global",keys:["f12"],command:R("openDevTools")},{id:"page.contextToAgent",label:"Send page context to agent",scope:"global",keys:["ctrl+alt+enter"],command:R("sendPageContextToChat")},{id:"agent.showContext",label:"Show agent context",scope:"global",keys:["ctrl+shift+alt+a"],command:R("showAgentContext"),everywhere:!0},{id:"agent.sendLatest",label:"Send the latest capture to the agent",scope:"global",keys:["ctrl+shift+alt+v"],command:R("sendLatestContext"),everywhere:!0},{id:"open.history",label:"History",scope:"global",keys:["ctrl+h"],mac:["cmd+y"],command:R("showHistory")},{id:"open.downloads",label:"Downloads",scope:"global",keys:["shift+alt+l"],command:R("showDownloads")},{id:"open.bookmarks",label:"Bookmark manager",scope:"global",keys:["ctrl+alt+b"],command:R("showBookmarks")},{id:"open.bookmarksBar",label:"Show or hide the bookmarks bar",scope:"global",keys:["ctrl+shift+b"]},{id:"open.quickActions",label:"Quick actions",scope:"global",keys:["ctrl+shift+k"]},{id:"open.shortcuts",label:"Change keyboard shortcuts",scope:"global",keys:["ctrl+alt+k"],command:R("editShortcuts")},{id:"open.cheatSheet",label:"Keyboard shortcuts of this mode",scope:"global",keys:["ctrl+shift+/"],mac:["cmd+alt+/"]},{id:"mode.inspect",label:"Element picker",scope:"global",keys:["shift+alt+e"]},{id:"mode.draw",label:"Draw on the page",scope:"global",keys:["shift+alt+w"]},{id:"mode.screenshot",label:"Screenshot",scope:"global",keys:["shift+alt+g"]},{id:"mode.devtools",label:"Console and network",scope:"global",keys:["shift+alt+j"]},{id:"mode.device",label:"Device toolbar",scope:"global",keys:["shift+alt+m"]},{id:"mode.measure",label:"Measure",scope:"global",keys:["shift+alt+u"]},{id:"mode.eyedropper",label:"Eyedropper",scope:"global",keys:["shift+alt+y"]},{id:"mode.overlay",label:"Design overlay",scope:"global",keys:["shift+alt+o"]},{id:"mode.tweak",label:"CSS tweak",scope:"global",keys:["shift+alt+v"]},{id:"mode.record",label:"Record the page",scope:"global",keys:["ctrl+alt+r"]},{id:"mode.a11y",label:"Accessibility check",scope:"global",keys:["shift+alt+h"]},{id:"inspect.parent",label:"Select the parent element",scope:"inspect",keys:["up"]},{id:"inspect.child",label:"Select the first child element",scope:"inspect",keys:["down"]},{id:"inspect.copy",label:"Copy the selected elements",scope:"inspect",keys:["enter","c"]},{id:"inspect.screenshot",label:"Screenshot the element",scope:"inspect",keys:["s"]},{id:"inspect.agent",label:"Send the element to the agent",scope:"inspect",keys:["a"]},{id:"inspect.help",label:"Show these shortcuts",scope:"inspect",keys:["shift+/"]},{id:"inspect.exit",label:"Exit",scope:"inspect",keys:["escape"]},{id:"draw.select",label:"Select and move",scope:"draw",keys:["v"]},{id:"draw.pen",label:"Pen",scope:"draw",keys:["p"]},{id:"draw.pencil",label:"Pencil",scope:"draw",keys:["i"]},{id:"draw.marker",label:"Marker",scope:"draw",keys:["m"]},{id:"draw.brush",label:"Brush",scope:"draw",keys:["u"]},{id:"draw.highlighter",label:"Highlighter",scope:"draw",keys:["h"]},{id:"draw.neon",label:"Neon",scope:"draw",keys:["g"]},{id:"draw.line",label:"Line",scope:"draw",keys:["l"]},{id:"draw.arrow",label:"Arrow",scope:"draw",keys:["a"]},{id:"draw.doubleArrow",label:"Double arrow",scope:"draw",keys:["d"]},{id:"draw.rect",label:"Rectangle",scope:"draw",keys:["r"]},{id:"draw.ellipse",label:"Ellipse",scope:"draw",keys:["o"]},{id:"draw.text",label:"Text",scope:"draw",keys:["t"]},{id:"draw.callout",label:"Numbered callout",scope:"draw",keys:["n"]},{id:"draw.blur",label:"Redact (pixelate)",scope:"draw",keys:["b"]},{id:"draw.eraser",label:"Eraser",scope:"draw",keys:["e"]},...[1,2,3,4,5,6,7,8,9].map(e=>({id:`draw.color${e}`,label:`Color ${e}`,scope:"draw",keys:[String(e)]})),{id:"draw.thinner",label:"Thinner stroke",scope:"draw",keys:["["]},{id:"draw.thicker",label:"Thicker stroke",scope:"draw",keys:["]"]},{id:"draw.fill",label:"Fill shapes on or off",scope:"draw",keys:["f"]},{id:"draw.undo",label:"Undo",scope:"draw",keys:["ctrl+z"]},{id:"draw.redo",label:"Redo",scope:"draw",keys:["ctrl+y","ctrl+shift+z"]},{id:"draw.clear",label:"Clear all drawings",scope:"draw",keys:["shift+backspace"]},{id:"draw.visible",label:"Hide or show drawings",scope:"draw",keys:["w"]},{id:"draw.capture",label:"Screenshot the drawing area",scope:"draw",keys:["enter"]},{id:"draw.captureAgent",label:"Screenshot the drawing area and send it to the agent",scope:"draw",keys:["shift+enter"]},{id:"draw.captureMenu",label:"Screenshot menu",scope:"draw",keys:["s"]},{id:"draw.captureGroups",label:"Screenshot each drawing separately",scope:"draw",keys:["alt+g"]},{id:"draw.captureClean",label:"Screenshot the drawing area without drawings",scope:"draw",keys:["alt+c"]},{id:"draw.captureViewport",label:"Screenshot the visible area with drawings",scope:"draw",keys:["alt+v"]},{id:"draw.captureFullPage",label:"Screenshot the full page with drawings",scope:"draw",keys:["alt+f"]},{id:"draw.help",label:"Show these shortcuts",scope:"draw",keys:["shift+/"]},{id:"draw.exit",label:"Stop drawing",scope:"draw",keys:["escape"]},{id:"shot.viewport",label:"Visible area",scope:"screenshot",keys:["v"]},{id:"shot.fullPage",label:"Full page",scope:"screenshot",keys:["f"]},{id:"shot.region",label:"Region",scope:"screenshot",keys:["r"]},{id:"shot.element",label:"Element",scope:"screenshot",keys:["e"]},{id:"shot.drawing",label:"Drawing area",scope:"screenshot",keys:["d"]},{id:"shot.lastToAgent",label:"Send the last screenshot to the agent",scope:"screenshot",keys:["a"],command:R("screenshot.sendToTerminal")},{id:"send.default",label:"Send to the default agent",scope:"send",keys:["enter"]},{id:"send.newThread",label:"New agentmux thread",scope:"send",keys:["n"]},{id:"send.prompt",label:"Write a prompt",scope:"send",keys:["i"]},{id:"send.project",label:"Change project",scope:"send",keys:["p"]},{id:"send.copy",label:"Copy",scope:"send",keys:["c"]},{id:"send.download",label:"Download",scope:"send",keys:["d"]},{id:"send.close",label:"Close (keep it saved)",scope:"send",keys:["escape"]},{id:"dev.console",label:"Console",scope:"devtools",keys:["alt+1"]},{id:"dev.network",label:"Network",scope:"devtools",keys:["alt+2"]},{id:"dev.filter",label:"Filter",scope:"devtools",keys:["alt+f"]},{id:"dev.copyErrors",label:"Copy console errors",scope:"devtools",keys:["alt+e"]},{id:"dev.copyFailed",label:"Copy failed requests",scope:"devtools",keys:["alt+q"]},{id:"dev.copyContext",label:"Copy page context",scope:"devtools",keys:["alt+p"]},{id:"dev.contextAgent",label:"Send page context to the agent",scope:"devtools",keys:["alt+shift+p"]},{id:"dev.clear",label:"Clear",scope:"devtools",keys:["alt+k"]},{id:"dev.close",label:"Close",scope:"devtools",keys:["alt+w"]},{id:"device.previous",label:"Previous device",scope:"device",keys:["alt+["]},{id:"device.next",label:"Next device",scope:"device",keys:["alt+]"]},{id:"device.rotate",label:"Rotate",scope:"device",keys:["alt+r"]},{id:"device.touch",label:"Touch and mobile on or off",scope:"device",keys:["alt+t"]},{id:"device.fit",label:"Fit to window",scope:"device",keys:["alt+0"]},{id:"device.zoomIn",label:"Zoom in",scope:"device",keys:["alt+="]},{id:"device.zoomOut",label:"Zoom out",scope:"device",keys:["alt+-"]},{id:"device.network",label:"Next network speed",scope:"device",keys:["alt+n"]},{id:"device.theme",label:"Next color scheme",scope:"device",keys:["alt+l"]},{id:"device.close",label:"Close the device toolbar",scope:"device",keys:[]},{id:"measure.grid",label:"Rulers and grid on or off",scope:"measure",keys:["g"]},{id:"measure.copy",label:"Copy the measurements",scope:"measure",keys:["c"]},{id:"measure.clear",label:"Clear the pinned element",scope:"measure",keys:["backspace"]},{id:"measure.help",label:"Show these shortcuts",scope:"measure",keys:["shift+/"]},{id:"measure.exit",label:"Exit",scope:"measure",keys:["escape"]},{id:"eyedropper.hex",label:"Copy colors as hex",scope:"eyedropper",keys:["h"]},{id:"eyedropper.rgb",label:"Copy colors as rgb()",scope:"eyedropper",keys:["r"]},{id:"eyedropper.hsl",label:"Copy colors as hsl()",scope:"eyedropper",keys:["l"]},{id:"eyedropper.help",label:"Show these shortcuts",scope:"eyedropper",keys:["shift+/"]},{id:"eyedropper.exit",label:"Exit",scope:"eyedropper",keys:["escape"]},{id:"overlay.open",label:"Open an image",scope:"overlay",keys:["alt+o"]},{id:"overlay.fainter",label:"Less opaque",scope:"overlay",keys:["alt+,"]},{id:"overlay.stronger",label:"More opaque",scope:"overlay",keys:["alt+."]},{id:"overlay.left",label:"Nudge left",scope:"overlay",keys:["alt+left"]},{id:"overlay.right",label:"Nudge right",scope:"overlay",keys:["alt+right"]},{id:"overlay.up",label:"Nudge up",scope:"overlay",keys:["alt+up"]},{id:"overlay.down",label:"Nudge down",scope:"overlay",keys:["alt+down"]},{id:"overlay.difference",label:"Difference blend on or off",scope:"overlay",keys:["alt+x"]},{id:"overlay.hide",label:"Hide or show the overlay",scope:"overlay",keys:["alt+h"]},{id:"overlay.exit",label:"Close the overlay",scope:"overlay",keys:["alt+z"]},{id:"tweak.agent",label:"Send the CSS changes to the agent",scope:"tweak",keys:["ctrl+enter"]},{id:"tweak.copy",label:"Copy the CSS changes",scope:"tweak",keys:["ctrl+shift+c"]},{id:"tweak.undo",label:"Undo the last change",scope:"tweak",keys:["ctrl+z"]},{id:"tweak.exit",label:"Exit and revert",scope:"tweak",keys:["escape"]},{id:"record.stop",label:"Stop and save",scope:"record",keys:["alt+s"]},{id:"record.pause",label:"Pause or resume",scope:"record",keys:["alt+y"]},{id:"record.cancel",label:"Cancel",scope:"record",keys:["alt+backspace"]},{id:"a11y.next",label:"Next issue",scope:"a11y",keys:["n","down"]},{id:"a11y.previous",label:"Previous issue",scope:"a11y",keys:["p","up"]},{id:"a11y.tabOrder",label:"Tab order on or off",scope:"a11y",keys:["t"]},{id:"a11y.copy",label:"Copy the report",scope:"a11y",keys:["c"]},{id:"a11y.agent",label:"Send the report to the agent",scope:"a11y",keys:["a"]},{id:"a11y.help",label:"Show these shortcuts",scope:"a11y",keys:["shift+/"]},{id:"a11y.exit",label:"Exit",scope:"a11y",keys:["escape"]}];function cd(e,t){return t?[...e.mac??e.keys.map(n=>n.replace(/\bctrl\+/,"cmd+"))]:[...e.keys]}function id(e){let t=fd(e.trim());return t.key?[t.ctrl&&"ctrl",t.shift&&"shift",t.alt&&"alt",t.meta&&"cmd",t.key].filter(Boolean).join("+"):""}function ol(e,t){let n={};for(let o of nl){let a=e[o.id],l=(a===void 0?cd(o,t):typeof a=="string"?[a]:[...a]).map(id);n[o.id]=[...new Set(l.filter(Boolean))]}return n}function rd(e){if(!e||typeof e!="object"||Array.isArray(e))return{};let t=new Set(nl.map(o=>o.id)),n={};for(let[o,a]of Object.entries(e))t.has(o)&&(typeof a=="string"||Array.isArray(a)&&a.every(l=>typeof l=="string"))&&(n[o]=a);return n}var ud=new Set(["mode.inspect","mode.draw","mode.screenshot","mode.device","mode.devtools","page.bookmark","open.shortcuts","inspect.parent","inspect.child","inspect.copy","inspect.exit",...["select","pen","pencil","marker","brush","highlighter","neon","line","arrow","doubleArrow","rect","ellipse","text","callout","blur","eraser"].map(e=>`draw.${e}`),...Array.from({length:9},(e,t)=>`draw.color${t+1}`),"draw.thinner","draw.thicker","draw.fill","draw.undo","draw.redo","draw.clear","draw.visible","draw.capture","draw.captureMenu","draw.captureGroups","draw.captureClean","draw.captureViewport","draw.captureFullPage","draw.exit","shot.viewport","shot.fullPage","shot.region","shot.element","shot.drawing","send.default","send.newThread","send.prompt","send.project","send.copy","send.download","send.close"]);function dd(e,t){let n=ug(e,t);return t?[...[...n.matchAll(/[⌃⌥⇧⌘]/g)].map(a=>a[0]),n.replace(/[⌃⌥⇧⌘]/g,"")]:n.split(/\+(?=.)/)}function ug(e,t){let n=fd(e),o={escape:"Esc",enter:t?"\u21A9":"Enter",backspace:t?"\u232B":"Backspace",delete:t?"\u2326":"Delete",up:"\u2191",down:"\u2193",left:"\u2190",right:"\u2192",pageup:"PgUp",pagedown:"PgDn",tab:t?"\u21E5":"Tab",space:"Space","/":n.shift?"?":"/"},a=!(n.key==="/"&&n.shift),l=o[n.key]??(n.key.length===1?n.key.toUpperCase():n.key[0].toUpperCase()+n.key.slice(1));return t?`${n.ctrl?"\u2303":""}${n.alt?"\u2325":""}${n.shift&&a?"\u21E7":""}${n.meta?"\u2318":""}${l}`:[n.ctrl&&"Ctrl",n.alt&&"Alt",n.shift&&a&&"Shift",l].filter(Boolean).join("+")}function fd(e){let t=e.toLowerCase().split("+"),n=t.pop()??"";return{ctrl:t.includes("ctrl"),shift:t.includes("shift"),alt:t.includes("alt"),meta:t.includes("cmd")||t.includes("meta")||t.includes("win"),key:n}}var Od=ae(Xt(),1);var Ed,Og=e=>{let t=e.composedPath()[0];if(e.button!==0){Ed=void 0;return}t instanceof Element&&(Ed={element:t.closest('button, [role="button"], a')??t,at:performance.now()})};typeof window<"u"&&window.addEventListener("pointerdown",Og,!0);function En(...e){return e.filter(Boolean).join(" ")}var eo=ae(Ee(),1);function Zt({variant:e="secondary",size:t="md",icon:n,iconEnd:o,loading:a,className:l,children:c,disabled:i,type:r="button",...d}){let p=a?"loading":n;return(0,eo.jsxs)("button",{type:r,className:En("button",e,t==="sm"&&"small",l),disabled:i||a,"aria-busy":a||void 0,...d,children:[p&&(0,eo.jsx)("span",{className:En("codicon",`codicon-${p}`,a&&"codicon-modifier-spin"),"aria-hidden":"true"}),c!==void 0&&(0,eo.jsx)("span",{className:"button-label",children:c}),o&&(0,eo.jsx)("span",{className:`codicon codicon-${o}`,"aria-hidden":"true"})]})}var ei=ae(Ee(),1);function Cd({icon:e,label:t,onClick:n,onContextMenu:o,disabled:a,active:l,spin:c,className:i}){return(0,ei.jsx)("button",{type:"button",className:["icon-button",l&&"active",i].filter(Boolean).join(" "),title:t,"aria-label":t,"aria-pressed":l,disabled:a,onClick:n,onContextMenu:o,children:(0,ei.jsx)("span",{className:`codicon codicon-${e}${c?" codicon-modifier-spin":""}`,"aria-hidden":"true"})})}var ti=ae(Ee(),1),_g=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function ni({binding:e,size:t="md"}){let n=dd(e,_g);return(0,ti.jsx)("span",{className:`keycaps size-${t}`,"aria-label":n.join("+"),children:n.map((o,a)=>(0,ti.jsx)("kbd",{className:"keycap",children:o},a))})}var zn=ae(Xt()),$v=ae(Yv());var Pu="inkspectShortcuts",ed=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),Gv=nl.filter(e=>ud.has(e.id)),q0={"mode.device":"Responsive view","mode.screenshot":"Screenshot menu","open.shortcuts":"Keyboard shortcuts"},Lv=e=>q0[e.id]??e.label;var jv=["global","inspect","draw","screenshot"],hy=[...jv,...Object.keys(ld).filter(e=>!jv.includes(e))];async function Y0(){let e=(await chrome.storage.sync.get(Pu))[Pu];return{overrides:rd(e?.shortcuts??{}),updated:typeof e?.updated=="number"?e.updated:0}}function Vv(e){let t=()=>{Y0().then(o=>e(ol(o.overrides,ed),o))},n=(o,a)=>{a==="sync"&&o[Pu]&&t()};return chrome.storage.onChanged.addListener(n),t(),()=>chrome.storage.onChanged.removeListener(n)}var Xc=ae(Xt()),re=ae(Ee()),j0=e=>/^VS Code \((.*)\)$/.exec(e??"")?.[1];function G0(e){let[t,n]=(0,Xc.useState)([]);return(0,Xc.useEffect)(()=>{if(!e)return;let o=!0,a=()=>{chrome.runtime.sendMessage({type:"hub",request:{type:"projects.get",req:crypto.randomUUID()}}).then(c=>{!o||c?.type!=="projects"||n([...new Set(c.projects.filter(i=>i.vscode).map(i=>i.name))])}).catch(()=>{})};a();let l=setInterval(a,4e3);return()=>{o=!1,clearInterval(l)}},[e]),e?t:[]}function Qv({status:e,limit:t=1/0,size:n="lg"}){let o=e.state==="connected",a=G0(o),l=e.via==="hub"?"Browser helper":"Linked",c=j0(e.peer),i=[];if(o){for(let g of a)i.push({id:g,name:`VS Code (${g})`,lastUsed:g===c,tag:l});i.some(g=>g.lastUsed)||i.unshift({id:"peer",name:e.peer??"VS Code",lastUsed:!0,tag:l})}let r=i.slice(0,t),d=i.length-r.length,p=r.findIndex(g=>g.lastUsed);return(0,re.jsxs)("div",{className:`link-graph size-${n} state-${e.state}`,"aria-hidden":"true",children:[(0,re.jsx)("span",{className:"graph-node source",children:(0,re.jsx)("span",{className:"codicon codicon-globe"})}),(0,re.jsx)("ul",{className:"graph-targets",children:o?(0,re.jsxs)(re.Fragment,{children:[r.map((g,f)=>(0,re.jsxs)("li",{className:`graph-target${g.lastUsed?" lit":f<p?" on-path":""}`,children:[(0,re.jsx)("span",{className:"graph-node",children:(0,re.jsx)("span",{className:"codicon codicon-vscode"})}),(0,re.jsx)("span",{className:"graph-name",children:g.name}),g.lastUsed&&(0,re.jsx)("span",{className:"graph-tag",children:g.tag})]},g.id)),d>0&&(0,re.jsx)("li",{className:"graph-target more",children:(0,re.jsxs)("span",{className:"graph-name",children:["and ",d," more"]})})]}):(0,re.jsxs)("li",{className:"graph-target pending",children:[(0,re.jsx)("span",{className:"graph-node",children:(0,re.jsx)("span",{className:"codicon codicon-vscode"})}),(0,re.jsx)("span",{className:"graph-name",children:"VS Code"})]})})]})}var Xv=`/* LinkGraph: the browser, and a branch to each VS Code window (a tree connector drawn in CSS).
   The branch to the window used last is lit: that is where sends go. */

.link-graph {
  --line: color-mix(in srgb, var(--vscode-foreground) 20%, transparent);
  --lit: var(--ink-blue);
  --node: 44px;
  --stem: 32px;
  --stroke: 2px;
  --row-pad: 5px;
  display: flex;
  align-items: flex-start;
  min-width: 0;
}

.link-graph.size-sm {
  --node: 30px;
  --stem: 18px;
  --row-pad: 3px;
}

.link-graph.state-unpaired {
  --line: color-mix(in srgb, var(--ink-yellow) 70%, transparent);
}

.link-graph.state-connecting {
  --line: color-mix(in srgb, var(--ink-blue) 55%, transparent);
}

.graph-node {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--node);
  height: var(--node);
  border: 1px solid var(--ink-border-strong);
  border-radius: calc(var(--node) / 3.2);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--vscode-foreground) 7%, var(--vscode-editor-background)),
    var(--vscode-editor-background)
  );
  color: var(--vscode-foreground);
  box-shadow: var(--ink-shadow-sm);
}

.size-lg .graph-node .codicon {
  font-size: 22px !important;
}

.size-sm .graph-node .codicon {
  font-size: 15px !important;
}

/* The source sits level with the first branch; its stem runs straight into it (the border is
   outside the pseudo-element's box, so it starts one pixel further out to meet the bus). */
.graph-node.source {
  position: relative;
  margin-top: var(--row-pad);
  margin-right: var(--stem);
}

.graph-node.source::after {
  content: '';
  position: absolute;
  top: calc(50% - var(--stroke) / 2);
  left: calc(100% + 1px);
  width: var(--stem);
  height: var(--stroke);
  background: var(--line);
}

.link-graph.state-connected .graph-node.source::after {
  background: var(--lit);
}

.link-graph:not(.state-connected) .graph-node.source::after {
  background: repeating-linear-gradient(90deg, var(--line) 0 5px, transparent 5px 9px);
}

.graph-targets {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.graph-target {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: var(--row-pad) 0 var(--row-pad) var(--stem);
}

.size-sm .graph-target {
  gap: 9px;
}

/* The branch into this target, and the bus down to the next (rounded into the bus). */
.graph-target::before {
  content: '';
  position: absolute;
  top: calc(50% - var(--stroke) / 2);
  left: 0;
  width: var(--stem);
  height: var(--stroke);
  border-radius: var(--stroke);
  background: var(--line);
}

.graph-target::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--stroke);
  background: var(--line);
}

.graph-target:first-child::after {
  top: 50%;
}

.graph-target:last-child::after {
  bottom: 50%;
}

.graph-target:only-child::after {
  display: none;
}

.graph-target.pending::before {
  background: repeating-linear-gradient(90deg, var(--line) 0 5px, transparent 5px 9px);
}

/* Where sends go: lit, and so is the bus from the browser down to it. */
.graph-target.lit::before {
  z-index: 1;
  background: var(--lit);
}

.graph-target::before,
.graph-target::after,
.graph-node {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.graph-target.on-path::after {
  background: var(--lit);
}

/* The lit row: the bus is lit down to its branch, and plain below it. */
.graph-target.lit:not(:first-child)::after {
  background: linear-gradient(var(--lit) 0 50%, var(--line) 50% 100%);
}

.graph-target.lit:last-child:not(:first-child)::after {
  background: var(--lit);
}

.graph-target.lit .graph-node {
  border-color: var(--lit);
  background: color-mix(in srgb, var(--lit) 14%, var(--vscode-editor-background));
  color: var(--lit);
}

.graph-target.pending .graph-node {
  color: var(--ink-blue);
}

.graph-name {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.graph-target.lit .graph-name {
  font-weight: 600;
}

.graph-target.more .graph-name {
  color: var(--ink-muted);
}

.graph-target.more::before {
  background: repeating-linear-gradient(90deg, var(--line) 0 2px, transparent 2px 5px);
}

.graph-tag {
  flex-shrink: 0;
  padding: 1px 8px;
  border-radius: var(--ink-radius-pill);
  background: color-mix(in srgb, var(--lit) 16%, transparent);
  color: var(--lit);
  font-size: var(--ink-font-xs);
  font-weight: 600;
}
`;var Zv=`/* PairCard: linking this browser (one click in VS Code; the code is the fallback), on the full
   page, in the popup and in the toolbar. */

.pair-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
}

.pair-lead {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0;
  font-size: var(--ink-font-lg);
}

.pair-lead .codicon {
  margin-top: 3px;
  color: var(--ink-blue);
}

.pair-card kbd {
  padding: 1px 6px;
  border: 1px solid var(--vscode-keybindingLabel-border, var(--ink-border));
  border-radius: var(--ink-radius-sm);
  background: var(--vscode-keybindingLabel-background, var(--ink-surface-sunken));
  font-family: inherit;
  font-size: 0.92em;
  font-weight: 600;
  white-space: nowrap;
}

.pair-card > .muted {
  margin: 0;
}

.pair-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.code-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-sep {
  width: 10px;
  height: 2px;
  margin: 0 2px;
  border-radius: 1px;
  background: var(--ink-border-strong);
}

.code-box {
  width: 46px;
  height: 56px;
  border: 1px solid var(--vscode-input-border, var(--ink-border));
  border-radius: 12px;
  outline: none;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-family: var(--vscode-editor-font-family);
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  caret-color: var(--ink-blue);
  transition:
    border-color var(--ink-fast) var(--ink-ease),
    box-shadow var(--ink-fast) var(--ink-ease);
}

.code-box:hover:not(:disabled) {
  border-color: var(--ink-border-strong);
}

.code-box:focus {
  border-color: var(--ink-focus);
  box-shadow: 0 0 0 1px var(--ink-focus);
}

.code-box:disabled {
  opacity: 0.6;
}

.pair-button {
  height: 56px;
  padding: 0 26px;
  border-radius: 12px;
  font-weight: 600;
}

.pair-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  color: var(--ink-danger);
}

.pair-message .codicon {
  margin-top: 2px;
}

.card-foot {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
}

.card-foot .codicon {
  margin-top: 2px;
}

/* The popup's and the toolbar's smaller card. */
.pair-card.compact {
  gap: 10px;
  padding: 12px;
}

.pair-card.compact .pair-lead {
  font-size: var(--ink-font-sm);
}

.pair-card.compact .code-box {
  width: 30px;
  height: 38px;
  border-radius: 8px;
  font-size: 18px;
}

.pair-card.compact .pair-button {
  height: 38px;
  padding: 0 14px;
  border-radius: 8px;
}

/* Where no page style gives it a surface (the popup, the toolbar). */
.pair-card.compact {
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius-lg);
  background: var(--vscode-editorWidget-background);
}

.pair-card .muted {
  margin: 0;
  color: var(--ink-muted);
}
`;var tl=ae(Xt());var Zc=ae(Xt()),Io=ae(Ee());function Kv({value:e,onChange:t,onComplete:n,length:o=6,disabled:a}){let l=(0,Zc.useRef)([]),c=Array.from({length:o},(d,p)=>e[p]??""),i=d=>l.current[Math.max(0,Math.min(o-1,d))]?.focus(),r=(d,p)=>{let g=p.replace(/\D/g,"");if(!g)return;let f=(e.slice(0,d)+g).slice(0,o);t(f),i(f.length),f.length===o&&n?.(f)};return(0,Io.jsx)("div",{className:"code-input",role:"group","aria-label":"Pairing code",children:c.map((d,p)=>(0,Io.jsxs)(Zc.Fragment,{children:[p===o/2&&(0,Io.jsx)("span",{className:"code-sep","aria-hidden":"true"}),(0,Io.jsx)("input",{ref:g=>{l.current[p]=g},className:"code-box",inputMode:"numeric",autoComplete:"one-time-code","aria-label":`Digit ${p+1}`,maxLength:o,disabled:a,value:d,onFocus:g=>g.currentTarget.select(),onChange:g=>r(Math.min(p,e.length),g.target.value),onPaste:g=>{g.preventDefault(),r(0,g.clipboardData.getData("text"))},onKeyDown:g=>{if(g.key==="Backspace"){g.preventDefault();let f=d?p:p-1;f>=0&&t(e.slice(0,f)),i(f)}else g.key==="ArrowLeft"?(g.preventDefault(),i(p-1)):g.key==="ArrowRight"&&(g.preventDefault(),i(p+1))}})]},p))})}var B=ae(Ee());function Jv({status:e,pair:t,compact:n,startWithCode:o}){let[a,l]=(0,tl.useState)(""),[c,i]=(0,tl.useState)(""),[r,d]=(0,tl.useState)(!1),[p,g]=(0,tl.useState)(!!o);if(e.state==="connected")return null;let f=async(y=a)=>{if(y.length!==6||r)return;d(!0),i("");let x=await t(y).catch(()=>{});if(d(!1),!x){i("The extension did not answer. Reload it and try again.");return}i(x.error??""),x.state==="connected"&&l("")},b=(0,B.jsxs)("p",{className:"card-foot",children:[(0,B.jsx)("span",{className:"codicon codicon-lock","aria-hidden":"true"}),"The link only talks to VS Code on this computer, and only after pairing (or through the browser helper VS Code installs)."]});return e.via==="hub"?(0,B.jsx)("div",{className:En("card","pair-card",n&&"compact"),children:(0,B.jsxs)("p",{className:"pair-lead",children:[(0,B.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,B.jsx)("span",{children:"Linked through the browser helper: no pairing needed. VS Code isn't running, so sends to its terminals and chat wait for it; captures still save into your projects, and agentmux agents still get them."})]})}):e.state!=="unpaired"?(0,B.jsxs)("div",{className:En("card","pair-card",n&&"compact"),children:[(0,B.jsxs)("p",{className:"pair-lead",children:[(0,B.jsx)("span",{className:"codicon codicon-loading codicon-modifier-spin","aria-hidden":"true"}),(0,B.jsxs)("span",{children:["Open VS Code with the VS Code Browser extension. Then click"," ",(0,B.jsx)("b",{children:"Pair Browser Extension"})," in its ",(0,B.jsx)("b",{children:"Browser"})," side panel."]})]}),!n&&b]}):(0,B.jsxs)("form",{className:En("card","pair-card",n&&"compact"),onSubmit:y=>{y.preventDefault(),f()},children:[(0,B.jsxs)("p",{className:"pair-lead",children:[(0,B.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,B.jsxs)("span",{children:["In VS Code, click ",(0,B.jsx)("b",{children:"Pair Browser Extension"})," in the ",(0,B.jsx)("b",{children:"Browser"})," side panel (or"," ",(0,B.jsx)("b",{children:"Pair"})," on its notification). No code needed: this updates by itself."]})]}),p?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsxs)("p",{className:"muted",children:["Run ",(0,B.jsx)("kbd",{children:"Browser: Pair Browser Extension with a Code"})," in VS Code, then type the code it shows."]}),(0,B.jsxs)("div",{className:"pair-row",children:[(0,B.jsx)(Kv,{value:a,onChange:l,disabled:r,onComplete:y=>{f(y)}}),(0,B.jsx)(Zt,{type:"submit",variant:"primary",icon:"link",className:"pair-button",loading:r,disabled:a.length!==6,children:"Pair"})]})]}):(0,B.jsx)(Zt,{size:"sm",variant:"ghost",icon:"key",className:"use-code",onClick:()=>g(!0),children:"Use a code instead"}),c&&(0,B.jsxs)("p",{className:"pair-message",role:"alert",children:[(0,B.jsx)("span",{className:"codicon codicon-error","aria-hidden":"true"}),c]}),!n&&b]})}var Fv=`/* The toolbar button's popup. Components and tokens come from @inkspect/shared/ui; the link
   graph from ../ui/link-graph.css. */

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  background: var(--vscode-editor-background);
  color: var(--vscode-foreground);
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
  line-height: 1.45;
}

.muted {
  color: var(--ink-muted);
}

.popup {
  --tone: var(--ink-muted);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 360px;
  padding: 14px 14px 0;
}

.popup.tone-ok {
  --tone: var(--ink-green);
}

.popup.tone-warn {
  --tone: var(--ink-yellow);
}

.popup.tone-busy {
  --tone: var(--ink-blue);
}

.popup-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.popup-head img {
  width: 24px;
  height: 24px;
  border-radius: 7px;
}

.popup-name {
  flex: 1;
  font-size: var(--ink-font-lg);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.popup-state {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--tone) 35%, transparent);
  border-radius: var(--ink-radius-pill);
  background: color-mix(in srgb, var(--tone) 10%, transparent);
  font-size: var(--ink-font-xs);
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--tone);
}

/* The link, on a dot-grid canvas: the popup's picture. */
.popup-link {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--ink-border-subtle);
  border-radius: 14px;
  background:
    radial-gradient(
        circle at 1px 1px,
        color-mix(in srgb, var(--vscode-foreground) 14%, transparent) 1px,
        transparent 0
      )
      0 0 / 14px 14px,
    var(--vscode-editorWidget-background);
  box-shadow: var(--ink-shadow-sm);
}

.popup-action {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.open-toolbar {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 600;
}

.open-toolbar .button-label {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.open-toolbar .keycap {
  border-color: color-mix(in srgb, var(--vscode-button-foreground) 35%, transparent);
  background: color-mix(in srgb, var(--vscode-button-foreground) 16%, transparent);
  color: var(--vscode-button-foreground);
}

.popup-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
}

.popup-hint {
  flex-wrap: wrap;
}

.popup-hint .button {
  flex-shrink: 0;
  margin-left: auto;
}

.popup-error {
  display: flex;
  gap: 6px;
  margin: 0;
  color: var(--ink-danger);
  font-size: var(--ink-font-sm);
}

/* The main keys, two by two. */
.popup-keys {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.key-tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 11px;
  border: 1px solid var(--ink-border-subtle);
  border-radius: 12px;
  background: var(--vscode-editorWidget-background);
}

.key-tile-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--vscode-foreground);
  font-size: var(--ink-font-sm);
  font-weight: 500;
}

.key-tile-label .codicon {
  color: var(--ink-blue);
  font-size: 14px !important;
}

.popup-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px -14px 0;
  padding: 8px 10px;
  border-top: 1px solid var(--ink-border-subtle);
}
`;var H=ae(Ee()),X0=["mode.inspect","mode.draw","mode.screenshot","mode.device"],Z0={"mode.inspect":"inspect","mode.draw":"edit","mode.screenshot":"device-camera","mode.device":"device-mobile"},K0={connected:{label:"Linked",tone:"ok"},connecting:{label:"Connecting",tone:"busy"},unpaired:{label:"Not paired",tone:"warn"},offline:{label:"VS Code not running",tone:"off"}};function J0(e){e!==void 0&&chrome.sidePanel.open({windowId:e}),window.close()}function Wv(e){chrome.tabs.create({url:chrome.runtime.getURL(`options.html${e?`#${e}`:""}`)}),window.close()}function F0(){let[e,t]=(0,zn.useState)({state:"connecting"}),[n,o]=(0,zn.useState)(()=>ol({},ed)),[a,l]=(0,zn.useState)(),[c,i]=(0,zn.useState)(""),[r,d]=(0,zn.useState)();(0,zn.useEffect)(()=>{let b=()=>{chrome.runtime.sendMessage({type:"status"}).then(w=>w&&t(w))};b();let y=setInterval(b,1500),x=Vv(w=>o(w));return chrome.windows.getCurrent().then(w=>d(w.id)),chrome.commands.getAll().then(w=>l(w.find(s=>s.name==="toggle-toolbar")?.shortcut??"")),()=>{clearInterval(y),x()}},[]);let p=async()=>{let b=await chrome.runtime.sendMessage({type:"toggleToolbar"}).catch(()=>null);b?.ok?window.close():i(b?.error??"The toolbar could not open on this page.")},g=K0[e.state],f=e.state==="connected";return(0,H.jsxs)("main",{className:`popup tone-${g.tone}`,children:[(0,H.jsxs)("header",{className:"popup-head",children:[(0,H.jsx)("img",{src:"icons/32.png",alt:""}),(0,H.jsx)("span",{className:"popup-name",children:"Inkspect"}),(0,H.jsxs)("span",{className:"popup-state",role:"status",children:[(0,H.jsx)("span",{className:"status-dot","aria-hidden":"true"}),g.label]})]}),(0,H.jsxs)("section",{className:"popup-link","aria-label":"VS Code",children:[(0,H.jsx)(Qv,{status:e,size:"sm"}),!f&&(0,H.jsx)(Jv,{compact:!0,status:e,pair:async b=>{let y=await chrome.runtime.sendMessage({type:"pair",code:b}).catch(()=>{});return y&&t(y),y}})]}),(0,H.jsxs)("div",{className:"popup-action",children:[(0,H.jsxs)(Zt,{variant:"primary",icon:"inspect",className:"open-toolbar",onClick:p,children:[(0,H.jsx)("span",{className:"open-label",children:"Open toolbar on this page"}),a&&(0,H.jsx)(ni,{binding:a.toLowerCase(),size:"sm"})]}),a===""&&(0,H.jsxs)("p",{className:"popup-hint",children:[(0,H.jsx)("span",{className:"codicon codicon-keyboard","aria-hidden":"true"}),(0,H.jsx)("span",{children:"No shortcut is set for this."}),(0,H.jsx)(Zt,{size:"sm",variant:"ghost",onClick:()=>{chrome.tabs.create({url:"chrome://extensions/shortcuts"})},children:"Set one"})]}),c&&(0,H.jsxs)("p",{className:"popup-error",role:"alert",children:[(0,H.jsx)("span",{className:"codicon codicon-error","aria-hidden":"true"}),c]})]}),(0,H.jsx)("section",{className:"popup-keys","aria-label":"Main shortcuts",children:X0.map(b=>{let y=Gv.find(w=>w.id===b),x=n[b]?.[0];return y?(0,H.jsxs)("div",{className:"key-tile",children:[(0,H.jsxs)("span",{className:"key-tile-label",children:[(0,H.jsx)("span",{className:`codicon codicon-${Z0[b]}`,"aria-hidden":"true"}),Lv(y)]}),x?(0,H.jsx)(ni,{binding:x,size:"sm"}):(0,H.jsx)("span",{className:"muted",children:"No key"})]},b):null})}),(0,H.jsxs)("footer",{className:"popup-foot",children:[(0,H.jsx)(Zt,{size:"sm",variant:"ghost",icon:"link-external",onClick:()=>Wv(),children:"Open Inkspect"}),e.projects&&(0,H.jsx)(Zt,{size:"sm",variant:"ghost",icon:"layout-sidebar-right",onClick:()=>J0(r),children:"Saved"}),(0,H.jsx)(Cd,{icon:"keyboard",label:"Change shortcuts",onClick:()=>Wv("shortcuts")})]})]})}var Iv=document.createElement("style");Iv.textContent=[nd,od,ad,Xv,Zv,Fv].join(`
`);document.head.append(Iv);document.documentElement.classList.add("ink-theme");(0,$v.createRoot)(document.getElementById("root")).render((0,H.jsx)(F0,{}));})();
