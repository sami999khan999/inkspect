"use strict";(()=>{var lg=Object.create;var cd=Object.defineProperty;var cg=Object.getOwnPropertyDescriptor;var ig=Object.getOwnPropertyNames;var rg=Object.getPrototypeOf,ug=Object.prototype.hasOwnProperty;var vt=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var dg=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of ig(t))!ug.call(e,a)&&a!==n&&cd(e,a,{get:()=>t[a],enumerable:!(o=cg(t,a))||o.enumerable});return e};var ae=(e,t,n)=>(n=e!=null?lg(rg(e)):{},dg(t||!e||!e.__esModule?cd(n,"default",{value:e,enumerable:!0}):n,e));var _d=vt(O=>{"use strict";var Pc=Symbol.for("react.transitional.element"),gg=Symbol.for("react.portal"),mg=Symbol.for("react.fragment"),hg=Symbol.for("react.strict_mode"),yg=Symbol.for("react.profiler"),xg=Symbol.for("react.consumer"),kg=Symbol.for("react.context"),wg=Symbol.for("react.forward_ref"),Sg=Symbol.for("react.suspense"),Tg=Symbol.for("react.memo"),wd=Symbol.for("react.lazy"),Eg=Symbol.for("react.activity"),zg=Symbol.for("react.view_transition"),hd=Symbol.iterator;function Og(e){return e===null||typeof e!="object"?null:(e=hd&&e[hd]||e["@@iterator"],typeof e=="function"?e:null)}var Sd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Td=Object.assign,Ed={};function to(e,t,n){this.props=e,this.context=t,this.refs=Ed,this.updater=n||Sd}to.prototype.isReactComponent={};to.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};to.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function zd(){}zd.prototype=to.prototype;function ei(e,t,n){this.props=e,this.context=t,this.refs=Ed,this.updater=n||Sd}var ti=ei.prototype=new zd;ti.constructor=ei;Td(ti,to.prototype);ti.isPureReactComponent=!0;var yd=Array.isArray;function Ic(){}var J={H:null,A:null,T:null,S:null},Od=Object.prototype.hasOwnProperty;function ni(e,t,n){var o=n.ref;return{$$typeof:Pc,type:e,key:t,ref:o!==void 0?o:null,props:n}}function Ng(e,t){return ni(e.type,t,e.props)}function oi(e){return typeof e=="object"&&e!==null&&e.$$typeof===Pc}function Ag(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var xd=/\/+/g;function $c(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Ag(""+e.key):t.toString(36)}function _g(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Ic,Ic):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function eo(e,t,n,o,a){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var c=!1;if(e===null)c=!0;else switch(l){case"bigint":case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case Pc:case gg:c=!0;break;case wd:return c=e._init,eo(c(e._payload),t,n,o,a)}}if(c)return a=a(e),c=o===""?"."+$c(e,0):o,yd(a)?(n="",c!=null&&(n=c.replace(xd,"$&/")+"/"),eo(a,t,n,"",function(d){return d})):a!=null&&(oi(a)&&(a=Ng(a,n+(a.key==null||e&&e.key===a.key?"":(""+a.key).replace(xd,"$&/")+"/")+c)),t.push(a)),1;c=0;var i=o===""?".":o+":";if(yd(e))for(var r=0;r<e.length;r++)o=e[r],l=i+$c(o,r),c+=eo(o,t,n,l,a);else if(r=Og(e),typeof r=="function")for(e=r.call(e),r=0;!(o=e.next()).done;)o=o.value,l=i+$c(o,r++),c+=eo(o,t,n,l,a);else if(l==="object"){if(typeof e.then=="function")return eo(_g(e),t,n,o,a);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return c}function il(e,t,n){if(e==null)return e;var o=[],a=0;return eo(e,o,"","",function(l){return t.call(n,l,a++)}),o}function Cg(e){if(e._status===-1){var t=e._result,n=t();n.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,n.status===void 0&&(n.status="fulfilled",n.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,n.status===void 0&&(n.status="rejected",n.reason=o))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var kd=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function Nd(e){var t=J.T,n={};n.types=t!==null?t.types:null,J.T=n;try{var o=e(),a=J.S;a!==null&&a(n,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(Ic,kd)}catch(l){kd(l)}finally{t!==null&&n.types!==null&&(t.types=n.types),J.T=t}}function Ad(e){var t=J.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else Nd(Ad.bind(null,e))}var Mg={map:il,forEach:function(e,t,n){il(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return il(e,function(){t++}),t},toArray:function(e){return il(e,function(t){return t})||[]},only:function(e){if(!oi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};O.Activity=Eg;O.Children=Mg;O.Component=to;O.Fragment=mg;O.Profiler=yg;O.PureComponent=ei;O.StrictMode=hg;O.Suspense=Sg;O.ViewTransition=zg;O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=J;O.__COMPILER_RUNTIME={__proto__:null,c:function(e){return J.H.useMemoCache(e)}};O.addTransitionType=Ad;O.cache=function(e){return function(){return e.apply(null,arguments)}};O.cacheSignal=function(){return null};O.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=Td({},e.props),a=e.key;if(t!=null)for(l in t.key!==void 0&&(a=""+t.key),t)!Od.call(t,l)||l==="key"||l==="__self"||l==="__source"||l==="ref"&&t.ref===void 0||(o[l]=t[l]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var c=Array(l),i=0;i<l;i++)c[i]=arguments[i+2];o.children=c}return ni(e.type,a,o)};O.createContext=function(e){return e={$$typeof:kg,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:xg,_context:e},e};O.createElement=function(e,t,n){var o,a={},l=null;if(t!=null)for(o in t.key!==void 0&&(l=""+t.key),t)Od.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(a[o]=t[o]);var c=arguments.length-2;if(c===1)a.children=n;else if(1<c){for(var i=Array(c),r=0;r<c;r++)i[r]=arguments[r+2];a.children=i}if(e&&e.defaultProps)for(o in c=e.defaultProps,c)a[o]===void 0&&(a[o]=c[o]);return ni(e,l,a)};O.createRef=function(){return{current:null}};O.forwardRef=function(e){return{$$typeof:wg,render:e}};O.isValidElement=oi;O.lazy=function(e){return{$$typeof:wd,_payload:{_status:-1,_result:e},_init:Cg}};O.memo=function(e,t){return{$$typeof:Tg,type:e,compare:t===void 0?null:t}};O.startTransition=Nd;O.unstable_useCacheRefresh=function(){return J.H.useCacheRefresh()};O.use=function(e){return J.H.use(e)};O.useActionState=function(e,t,n){return J.H.useActionState(e,t,n)};O.useCallback=function(e,t){return J.H.useCallback(e,t)};O.useContext=function(e){return J.H.useContext(e)};O.useDebugValue=function(){};O.useDeferredValue=function(e,t){return J.H.useDeferredValue(e,t)};O.useEffect=function(e,t){return J.H.useEffect(e,t)};O.useEffectEvent=function(e){return J.H.useEffectEvent(e)};O.useId=function(){return J.H.useId()};O.useImperativeHandle=function(e,t,n){return J.H.useImperativeHandle(e,t,n)};O.useInsertionEffect=function(e,t){return J.H.useInsertionEffect(e,t)};O.useLayoutEffect=function(e,t){return J.H.useLayoutEffect(e,t)};O.useMemo=function(e,t){return J.H.useMemo(e,t)};O.useOptimistic=function(e,t){return J.H.useOptimistic(e,t)};O.useReducer=function(e,t,n){return J.H.useReducer(e,t,n)};O.useRef=function(e){return J.H.useRef(e)};O.useState=function(e){return J.H.useState(e)};O.useSyncExternalStore=function(e,t,n){return J.H.useSyncExternalStore(e,t,n)};O.useTransition=function(){return J.H.useTransition()};O.version="19.3.0"});var Kt=vt((uy,Cd)=>{"use strict";Cd.exports=_d()});var Ud=vt(rl=>{"use strict";var Rg=Symbol.for("react.transitional.element"),Ug=Symbol.for("react.fragment");function Rd(e,t,n){var o=null;if(n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:Rg,type:e,key:o,ref:t!==void 0?t:null,props:n}}rl.Fragment=Ug;rl.jsx=Rd;rl.jsxs=Rd});var Oe=vt((fy,Bd)=>{"use strict";Bd.exports=Ud()});var Kd=vt(I=>{"use strict";function di(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,a=e[o];if(0<ul(a,t))e[o]=t,e[n]=a,n=o;else break e}}function gt(e){return e.length===0?null:e[0]}function sl(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,a=e.length,l=a>>>1;o<l;){var c=2*(o+1)-1,i=e[c],r=c+1,d=e[r];if(0>ul(i,n))r<a&&0>ul(d,i)?(e[o]=d,e[r]=n,o=r):(e[o]=i,e[c]=n,o=c);else if(r<a&&0>ul(d,n))e[o]=d,e[r]=n,o=r;else break e}}return t}function ul(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}I.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(qd=performance,I.unstable_now=function(){return qd.now()}):(ii=Date,Yd=ii.now(),I.unstable_now=function(){return ii.now()-Yd});var qd,ii,Yd,Ct=[],Ft=[],Hg=1,Ie=null,Te=3,si=!1,ta=!1,na=!1,fi=!1,Gd=typeof setTimeout=="function"?setTimeout:null,Vd=typeof clearTimeout=="function"?clearTimeout:null,Ld=typeof setImmediate<"u"?setImmediate:null;function dl(e){for(var t=gt(Ft);t!==null;){if(t.callback===null)sl(Ft);else if(t.startTime<=e)sl(Ft),t.sortIndex=t.expirationTime,di(Ct,t);else break;t=gt(Ft)}}function bi(e){if(na=!1,dl(e),!ta)if(gt(Ct)!==null)ta=!0,ao||(ao=!0,oo());else{var t=gt(Ft);t!==null&&pi(bi,t.startTime-e)}}var ao=!1,oa=-1,Xd=5,Qd=-1;function Zd(){return fi?!0:!(I.unstable_now()-Qd<Xd)}function ri(){if(fi=!1,ao){var e=I.unstable_now();Qd=e;var t=!0;try{e:{ta=!1,na&&(na=!1,Vd(oa),oa=-1),si=!0;var n=Te;try{t:{for(dl(e),Ie=gt(Ct);Ie!==null&&!(Ie.expirationTime>e&&Zd());){var o=Ie.callback;if(typeof o=="function"){Ie.callback=null,Te=Ie.priorityLevel;var a=o(Ie.expirationTime<=e);if(e=I.unstable_now(),typeof a=="function"){Ie.callback=a,dl(e),t=!0;break t}Ie===gt(Ct)&&sl(Ct),dl(e)}else sl(Ct);Ie=gt(Ct)}if(Ie!==null)t=!0;else{var l=gt(Ft);l!==null&&pi(bi,l.startTime-e),t=!1}}break e}finally{Ie=null,Te=n,si=!1}t=void 0}}finally{t?oo():ao=!1}}}var oo;typeof Ld=="function"?oo=function(){Ld(ri)}:typeof MessageChannel<"u"?(ui=new MessageChannel,jd=ui.port2,ui.port1.onmessage=ri,oo=function(){jd.postMessage(null)}):oo=function(){Gd(ri,0)};var ui,jd;function pi(e,t){oa=Gd(function(){e(I.unstable_now())},t)}I.unstable_IdlePriority=5;I.unstable_ImmediatePriority=1;I.unstable_LowPriority=4;I.unstable_NormalPriority=3;I.unstable_Profiling=null;I.unstable_UserBlockingPriority=2;I.unstable_cancelCallback=function(e){e.callback=null};I.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Xd=0<e?Math.floor(1e3/e):5};I.unstable_getCurrentPriorityLevel=function(){return Te};I.unstable_next=function(e){switch(Te){case 1:case 2:case 3:var t=3;break;default:t=Te}var n=Te;Te=t;try{return e()}finally{Te=n}};I.unstable_requestPaint=function(){fi=!0};I.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=Te;Te=e;try{return t()}finally{Te=n}};I.unstable_scheduleCallback=function(e,t,n){var o=I.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=n+a,e={id:Hg++,callback:t,priorityLevel:e,startTime:n,expirationTime:a,sortIndex:-1},n>o?(e.sortIndex=n,di(Ft,e),gt(Ct)===null&&e===gt(Ft)&&(na?(Vd(oa),oa=-1):na=!0,pi(bi,n-o))):(e.sortIndex=a,di(Ct,e),ta||si||(ta=!0,ao||(ao=!0,oo()))),e};I.unstable_shouldYield=Zd;I.unstable_wrapCallback=function(e){var t=Te;return function(){var n=Te;Te=t;try{return e.apply(this,arguments)}finally{Te=n}}}});var Fd=vt((yy,Jd)=>{"use strict";Jd.exports=Kd()});var Id=vt(Ee=>{"use strict";var qg=Kt();function $d(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Wt(){}var Ne={d:{f:Wt,r:function(){throw Error($d(522))},D:Wt,C:Wt,L:Wt,m:Wt,X:Wt,S:Wt,M:Wt},p:0,findDOMNode:null},Yg=Symbol.for("react.portal"),Lg=Symbol.for("react.recoverable"),Wd=Symbol.for("react.optimistic_key");function jg(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Yg,key:o==null?null:o===Wd?Wd:""+o,children:e,containerInfo:t,implementation:n}}var aa=qg.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function fl(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Ee.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Ne;Ee.browser=function(e){return{$$typeof:Lg,_reason:e}};Ee.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error($d(299));return jg(e,t,null,n)};Ee.flushSync=function(e){var t=aa.T,n=Ne.p;try{if(aa.T=null,Ne.p=2,e)return e()}finally{aa.T=t,Ne.p=n,Ne.d.f()}};Ee.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Ne.d.C(e,t))};Ee.prefetchDNS=function(e){typeof e=="string"&&Ne.d.D(e)};Ee.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,o=fl(n,t.crossOrigin),a=typeof t.integrity=="string"?t.integrity:void 0,l=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Ne.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:o,integrity:a,fetchPriority:l}):n==="script"&&Ne.d.X(e,{crossOrigin:o,integrity:a,fetchPriority:l,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Ee.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=fl(t.as,t.crossOrigin);Ne.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}}else t==null&&Ne.d.M(e)};Ee.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,o=fl(n,t.crossOrigin);Ne.d.L(e,n,{crossOrigin:o,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Ee.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=fl(t.as,t.crossOrigin);Ne.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}else Ne.d.m(e)};Ee.requestFormReset=function(e){Ne.d.r(e)};Ee.unstable_batchedUpdates=function(e,t){return e(t)};Ee.useFormState=function(e,t,n){return aa.H.useFormState(e,t,n)};Ee.useFormStatus=function(){return aa.H.useHostTransitionStatus()};Ee.version="19.3.0"});var ts=vt((ky,es)=>{"use strict";function Pd(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Pd)}catch(e){console.error(e)}}Pd(),es.exports=Id()});var Gv=vt(Kc=>{"use strict";var se=Fd(),jf=Kt(),Gg=ts();function h(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Gf(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Qa(e){for(var t=e,n=t;n&&!n.alternate;)t=n,(t.flags&4098)!==0&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function Vf(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Xf(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ns(e){if(Qa(e)!==e)throw Error(h(188))}function Vg(e){var t=e.alternate;if(!t){if(t=Qa(e),t===null)throw Error(h(188));return t!==e?null:e}for(var n=e,o=t;;){var a=n.return;if(a===null)break;var l=a.alternate;if(l===null){if(o=a.return,o!==null){n=o;continue}break}if(a.child===l.child){for(l=a.child;l;){if(l===n)return ns(a),e;if(l===o)return ns(a),t;l=l.sibling}throw Error(h(188))}if(n.return!==o.return)n=a,o=l;else{for(var c=!1,i=a.child;i;){if(i===n){c=!0,n=a,o=l;break}if(i===o){c=!0,o=a,n=l;break}i=i.sibling}if(!c){for(i=l.child;i;){if(i===n){c=!0,n=l,o=a;break}if(i===o){c=!0,o=l,n=a;break}i=i.sibling}if(!c)throw Error(h(189))}}if(n.alternate!==o)throw Error(h(190))}if(n.tag!==3)throw Error(h(188));return n.stateNode.current===n?e:t}function Qf(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Qf(e),t!==null)return t;e=e.sibling}return null}function qe(e,t,n,o,a,l){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,o,a,l)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&qe(e.child,t,n,o,a,l))return!0;e=e.sibling}return!1}function Fn(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function os(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return t}function Zf(e){var t=[null,null],n=Fn(e);return n===null||Kf(t,e,n.child,{foundSelf:!1}),t}function Kf(e,t,n,o){for(;n!==null;){if(n===t)o.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(o.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&Kf(e,t,n.child,o))return!0;n=n.sibling}return!1}function de(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(h(559))}}var fo=null,Zi=null;function Xg(e,t,n){return e===n?!0:e===t?(fo=e,!0):!1}function Qg(e,t,n){return e===n?(Zi=e,!1):e===t?(Zi!==null&&(fo=e),!0):!1}function as(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function Ki(e,t,n){for(var o=0,a=e;a;a=n(a))o++;a=0;for(var l=t;l;l=n(l))a++;for(;0<o-a;)e=n(e),o--;for(;0<a-o;)t=n(t),a--;for(;o--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var K=Object.assign,Zg=Symbol.for("react.element"),bl=Symbol.for("react.transitional.element"),sa=Symbol.for("react.portal"),bo=Symbol.for("react.fragment"),Jf=Symbol.for("react.strict_mode"),Ji=Symbol.for("react.profiler"),Ff=Symbol.for("react.consumer"),wt=Symbol.for("react.context"),ou=Symbol.for("react.forward_ref"),Fi=Symbol.for("react.suspense"),Wi=Symbol.for("react.suspense_list"),au=Symbol.for("react.memo"),en=Symbol.for("react.lazy"),$i=Symbol.for("react.activity"),Kg=Symbol.for("react.legacy_hidden"),Jg=Symbol.for("react.memo_cache_sentinel"),Ii=Symbol.for("react.view_transition"),Fg=Symbol.for("react.recoverable"),ls=Symbol.iterator;function la(e){return e===null||typeof e!="object"?null:(e=ls&&e[ls]||e["@@iterator"],typeof e=="function"?e:null)}var Wg=Symbol.for("react.client.reference");function Pi(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Wg?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case bo:return"Fragment";case Ji:return"Profiler";case Jf:return"StrictMode";case Fi:return"Suspense";case Wi:return"SuspenseList";case $i:return"Activity";case Ii:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case sa:return"Portal";case wt:return e.displayName||"Context";case Ff:return(e._context.displayName||"Context")+".Consumer";case ou:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case au:return t=e.displayName||null,t!==null?t:Pi(e.type)||"Memo";case en:t=e._payload,e=e._init;try{return Pi(e(t))}catch{}}return null}var fa=Array.isArray,z=jf.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Y=Gg.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Bn={pending:!1,data:null,method:null,action:null},er=[],po=-1;function At(e){return{current:e}}function xe(e){0>po||(e.current=er[po],er[po]=null,po--)}function $(e,t){po++,er[po]=e.current,e.current=t}var zt=At(null),Aa=At(null),dn=At(null),Pl=At(null);function ec(e,t){switch($(dn,t),$(Aa,e),$(zt,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?xf(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=xf(t),e=mv(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}xe(zt),$(zt,e)}function Ro(){xe(zt),xe(Aa),xe(dn)}function tr(e){var t=e.memoizedState;t!==null&&(Xo._currentValue=t.memoizedState,$(Pl,e)),t=zt.current;var n=mv(t,e.type);t!==n&&($(Aa,e),$(zt,n))}function tc(e){Aa.current===e&&(xe(zt),xe(Aa)),Pl.current===e&&(xe(Pl),Xo._currentValue=Bn)}var vi,cs;function It(e){if(vi===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);vi=t&&t[1]||"",cs=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+vi+e+cs}var gi=!1;function mi(e,t){if(!e||gi)return"";gi=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var g=function(){throw Error()};if(Object.defineProperty(g.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(g,[])}catch(y){var s=y}Reflect.construct(e,[],g)}else{try{g.call()}catch(y){s=y}g=!1;try{var p=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),g=!0,new e}finally{g&&(p!==void 0?Object.defineProperty(e.prototype,"props",p):delete e.prototype.props)}}}else{try{throw Error()}catch(y){s=y}(g=e())&&typeof g.catch=="function"&&g.catch(function(){})}}catch(y){if(y&&s&&typeof y.stack=="string")return[y.stack,s.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=o.DetermineComponentFrameRoot(),c=l[0],i=l[1];if(c&&i){var r=c.split(`
`),d=i.split(`
`);for(a=o=0;o<r.length&&!r[o].includes("DetermineComponentFrameRoot");)o++;for(;a<d.length&&!d[a].includes("DetermineComponentFrameRoot");)a++;if(o===r.length||a===d.length)for(o=r.length-1,a=d.length-1;1<=o&&0<=a&&r[o]!==d[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==d[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==d[a]){var v=`
`+r[o].replace(" at new "," at ");return e.displayName&&v.includes("<anonymous>")&&(v=v.replace("<anonymous>",e.displayName)),v}while(1<=o&&0<=a);break}}}finally{gi=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?It(n):""}function $g(e,t){switch(e.tag){case 26:case 27:case 5:return It(e.type);case 16:return It("Lazy");case 13:return e.child!==t&&t!==null?It("Suspense Fallback"):It("Suspense");case 19:return It("SuspenseList");case 0:case 15:return mi(e.type,!1);case 11:return mi(e.type.render,!1);case 1:return mi(e.type,!0);case 31:return It("Activity");case 30:return It("ViewTransition");default:return""}}function is(e){try{var t="",n=null;do t+=$g(e,n),n=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var nr=Object.prototype.hasOwnProperty,lu=se.unstable_scheduleCallback,hi=se.unstable_cancelCallback,Ig=se.unstable_shouldYield,Pg=se.unstable_requestPaint,Ze=se.unstable_now,em=se.unstable_getCurrentPriorityLevel,Wf=se.unstable_ImmediatePriority,$f=se.unstable_UserBlockingPriority,nc=se.unstable_NormalPriority,tm=se.unstable_LowPriority,If=se.unstable_IdlePriority,nm=se.log,om=se.unstable_setDisableYieldValue,Za=null,Ke=null;function on(e){if(typeof nm=="function"&&om(e),Ke&&typeof Ke.setStrictMode=="function")try{Ke.setStrictMode(Za,e)}catch{}}var Je=Math.clz32?Math.clz32:cm,am=Math.log,lm=Math.LN2;function cm(e){return e>>>=0,e===0?32:31-(am(e)/lm|0)|0}var pl=256,vl=262144,gl=4194304;function Cn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Nc(e,t,n){var o=e.pendingLanes;if(o===0)return 0;var a=0,l=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var i=o&134217727;return i!==0?(o=i&~l,o!==0?a=Cn(o):(c&=i,c!==0?a=Cn(c):n||(n=i&~e,n!==0&&(a=Cn(n))))):(i=o&~l,i!==0?a=Cn(i):c!==0?a=Cn(c):n||(n=o&~e,n!==0&&(a=Cn(n)))),a===0?0:t!==0&&t!==a&&(t&l)===0&&(l=a&-a,n=t&-t,l>=n||l===32&&(n&4194048)!==0)?t:a}function Ka(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Pf(e,t){(t&8)!==0&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var o=31-Je(n),a=1<<o;t|=e[o],n&=~a}return t}function im(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function eb(){var e=gl;return gl<<=1,(gl&62914560)===0&&(gl=4194304),e}function yi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ja(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function rm(e,t,n,o,a,l){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var i=e.entanglements,r=e.expirationTimes,d=e.hiddenUpdates;for(n=c&~n;0<n;){var v=31-Je(n),g=1<<v;i[v]=0,r[v]=-1;var s=d[v];if(s!==null)for(d[v]=null,v=0;v<s.length;v++){var p=s[v];p!==null&&(p.lane&=-536870913)}n&=~g}o!==0&&tb(e,o,0),l!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=l&~(c&~t))}function tb(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-Je(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|n&261930}function nb(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-Je(n),a=1<<o;a&t|e[o]&t&&(e[o]|=t),n&=~a}}function ob(e,t){var n=t&-t;return n=(n&42)!==0?1:cu(n),(n&(e.suspendedLanes|t))!==0?0:n}function cu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function iu(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function ab(){var e=Y.p;return e!==0?e:(e=window.event,e===void 0?32:Yv(e.type))}function rs(e,t){var n=Y.p;try{return Y.p=e,t()}finally{Y.p=n}}var Xt=Math.random().toString(36).slice(2),he="__reactFiber$"+Xt,Ye="__reactProps$"+Xt,Ko="__reactContainer$"+Xt,us="__reactEvents$"+Xt,um="__reactListeners$"+Xt,dm="__reactHandles$"+Xt,ds="__reactResources$"+Xt,Fa="__reactMarker$"+Xt,oc="__reactLoad$"+Xt;function Ac(e){delete e[he],delete e[Ye],delete e[um],delete e[dm]}function Rn(e){var t;if(t=e[he])return t;for(var n=e.parentNode;n;){if(t=n[Ko]||n[he]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Nf(e);e!==null;){if(n=e[he])return n;e=Nf(e)}return t}e=n,n=e.parentNode}return null}function Jo(e){if(e=e[he]||e[Ko]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function ba(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(h(33))}function To(e){var t=e[ds];return t||(t=e[ds]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function pe(e){e[Fa]=!0}function lb(e){e[oc]=void 0}var cb=new Set,ib={};function Wn(e,t){Uo(e,t),Uo(e+"Capture",t)}function Uo(e,t){for(ib[e]=t,e=0;e<t.length;e++)cb.add(t[e])}var sm=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ss={},fs={};function fm(e){return nr.call(fs,e)?!0:nr.call(ss,e)?!1:sm.test(e)?fs[e]=!0:(ss[e]=!0,!1)}var U=!1;function bs(){var e=U;return U=!1,e}function Rl(e,t,n){if(fm(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,n)}}function ml(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,n)}}function Mt(e,t,n,o){if(o===null)e.removeAttribute(n);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,o)}}function Ge(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function rb(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function bm(e,t,n){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var a=o.get,l=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,l.call(this,c)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function or(e){if(!e._valueTracker){var t=rb(e)?"checked":"value";e._valueTracker=bm(e,t,""+e[t])}}function ub(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=rb(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}var pm=/[\n"\\]/g;function ot(e){return e.replace(pm,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function ar(e,t,n,o,a,l,c,i){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Ge(t)):e.value!==""+Ge(t)&&(e.value=""+Ge(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?c==="number"&&e.value==t?xi(e,Ge(e.value)):xi(e,Ge(t)):n!=null?xi(e,Ge(n)):o!=null&&e.removeAttribute("value"),a==null&&l!=null&&(e.defaultChecked=!!l),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"?e.name=""+Ge(i):e.removeAttribute("name")}function db(e,t,n,o,a,l,c,i){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),t!=null||n!=null){if(!(l!=="submit"&&l!=="reset"||t!=null)){or(e);return}n=n!=null?""+Ge(n):"",t=t!=null?""+Ge(t):n,i||t===e.value||(e.value=t),e.defaultValue=t}o=o??a,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=i?e.checked:!!o,e.defaultChecked=!!o,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),or(e)}function xi(e,t){e.defaultValue!==""+t&&(e.defaultValue=""+t)}function Eo(e,t,n,o){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Ge(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function sb(e,t,n){if(t!=null&&(t=""+Ge(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Ge(n):""}function fb(e,t,n,o){if(t==null){if(o!=null){if(n!=null)throw Error(h(92));if(fa(o)){if(1<o.length)throw Error(h(93));o=o[0]}n=o}n==null&&(n=""),t=n}n=Ge(t),e.defaultValue=n,o=e.textContent,o===n&&o!==""&&o!==null&&(e.value=o),or(e)}function Bo(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var vm=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function ps(e,t,n){var o=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,n):typeof n!="number"||n===0||vm.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function bb(e,t,n){if(t!=null&&typeof t!="object")throw Error(h(62));if(e=e.style,n!=null){for(var o in n)!n.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="",U=!0);for(var a in t)o=t[a],t.hasOwnProperty(a)&&n[a]!==o&&(ps(e,a,o),U=!0)}else for(var l in t)t.hasOwnProperty(l)&&ps(e,l,t[l])}function ru(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var gm=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),mm=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ul(e){return mm.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function St(){}var lr=null;function uu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var vo=null,zo=null;function vs(e){var t=Jo(e);if(t&&(e=t.stateNode)){var n=e[Ye]||null;e:switch(e=t.stateNode,t.type){case"input":if(ar(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+ot(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=o[Ye]||null;if(!a)throw Error(h(90));ar(o,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)o=n[t],o.form===e.form&&ub(o)}break e;case"textarea":sb(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Eo(e,!!n.multiple,t,!1)}}}var ki=!1;function pb(e,t,n){if(ki)return e(t,n);ki=!0;try{var o=e(t);return o}finally{if(ki=!1,(vo!==null||zo!==null)&&(Vc(),vo&&(t=vo,e=zo,zo=vo=null,vs(t),e)))for(t=0;t<e.length;t++)vs(e[t])}}function _a(e,t){var n=e.stateNode;if(n===null)return null;var o=n[Ye]||null;if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(h(231,t,typeof n));return n}var qt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),cr=!1;if(qt)try{lo={},Object.defineProperty(lo,"passive",{get:function(){cr=!0}}),window.addEventListener("test",lo,lo),window.removeEventListener("test",lo,lo)}catch{cr=!1}var lo,an=null,du=null,Bl=null;function vb(){if(Bl)return Bl;var e,t=du,n=t.length,o,a="value"in an?an.value:an.textContent,l=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===a[l-o];o++);return Bl=a.slice(e,1<o?1-o:void 0)}function Hl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function hl(){return!0}function gs(){return!1}function Me(e){function t(n,o,a,l,c){this._reactName=n,this._targetInst=a,this.type=o,this.nativeEvent=l,this.target=c,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?hl:gs,this.isPropagationStopped=gs,this}return K(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=hl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=hl)},persist:function(){},isPersistent:hl}),t}var En={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},_c=Me(En),Wa=K({},En,{view:0,detail:0}),hm=Me(Wa),wi,Si,ca,Cc=K({},Wa,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:su,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ca&&(ca&&e.type==="mousemove"?(wi=e.screenX-ca.screenX,Si=e.screenY-ca.screenY):Si=wi=0,ca=e),wi)},movementY:function(e){return"movementY"in e?e.movementY:Si}}),ms=Me(Cc),ym=K({},Cc,{dataTransfer:0}),xm=Me(ym),km=K({},Wa,{relatedTarget:0}),Ti=Me(km),wm=K({},En,{animationName:0,elapsedTime:0,pseudoElement:0}),Sm=Me(wm),Tm=K({},En,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Em=Me(Tm),zm=K({},En,{data:0}),hs=Me(zm),Om={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nm={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Am={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function _m(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Am[e])?!!t[e]:!1}function su(){return _m}var Cm=K({},Wa,{key:function(e){if(e.key){var t=Om[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Hl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Nm[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:su,charCode:function(e){return e.type==="keypress"?Hl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Hl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Mm=Me(Cm),Dm=K({},Cc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ys=Me(Dm),Rm=K({},En,{submitter:0}),Um=Me(Rm),Bm=K({},Wa,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:su}),Hm=Me(Bm),qm=K({},En,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ym=Me(qm),Lm=K({},Cc,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),jm=Me(Lm),Gm=K({},En,{newState:0,oldState:0,source:0}),Vm=Me(Gm),Xm=[9,13,27,32],fu=qt&&"CompositionEvent"in window,ga=null;qt&&"documentMode"in document&&(ga=document.documentMode);var Qm=qt&&"TextEvent"in window&&!ga,gb=qt&&(!fu||ga&&8<ga&&11>=ga),xs=" ",ks=!1;function mb(e,t){switch(e){case"keyup":return Xm.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function hb(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var go=!1;function Zm(e,t){switch(e){case"compositionend":return hb(t);case"keypress":return t.which!==32?null:(ks=!0,xs);case"textInput":return e=t.data,e===xs&&ks?null:e;default:return null}}function Km(e,t){if(go)return e==="compositionend"||!fu&&mb(e,t)?(e=vb(),Bl=du=an=null,go=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return gb&&t.locale!=="ko"?null:t.data;default:return null}}var Jm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ws(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Jm[e.type]:t==="textarea"}function yb(e,t,n,o){vo?zo?zo.push(o):zo=[o]:vo=o,t=Ec(t,"onChange"),0<t.length&&(n=new _c("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var ma=null,Ca=null;function Fm(e){pv(e,0)}function Mc(e){var t=ba(e);if(ub(t))return e}function Ss(e,t){if(e==="change")return t}var xb=!1;qt&&(qt?(xl="oninput"in document,xl||(Ei=document.createElement("div"),Ei.setAttribute("oninput","return;"),xl=typeof Ei.oninput=="function"),yl=xl):yl=!1,xb=yl&&(!document.documentMode||9<document.documentMode));var yl,xl,Ei;function Ts(){ma&&(ma.detachEvent("onpropertychange",kb),Ca=ma=null)}function kb(e){if(e.propertyName==="value"&&Mc(Ca)){var t=[];yb(t,Ca,e,uu(e)),pb(Fm,t)}}function Wm(e,t,n){e==="focusin"?(Ts(),ma=t,Ca=n,ma.attachEvent("onpropertychange",kb)):e==="focusout"&&Ts()}function $m(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Mc(Ca)}function Im(e,t){if(e==="click")return Mc(t)}function Pm(e,t){if(e==="input"||e==="change")return Mc(t)}function eh(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var We=typeof Object.is=="function"?Object.is:eh;function Ma(e,t){if(We(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var a=n[o];if(!nr.call(t,a)||!We(e[a],t[a]))return!1}return!0}function ir(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Es(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function zs(e,t){var n=Es(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Es(n)}}function wb(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?wb(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Sb(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ir(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ir(e.document)}return t}function bu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var th=qt&&"documentMode"in document&&11>=document.documentMode,mo=null,rr=null,ha=null,ur=!1;function Os(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ur||mo==null||mo!==ir(o)||(o=mo,"selectionStart"in o&&bu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ha&&Ma(ha,o)||(ha=o,o=Ec(rr,"onSelect"),0<o.length&&(t=new _c("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=mo)))}function An(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var ho={animationend:An("Animation","AnimationEnd"),animationiteration:An("Animation","AnimationIteration"),animationstart:An("Animation","AnimationStart"),transitionrun:An("Transition","TransitionRun"),transitionstart:An("Transition","TransitionStart"),transitioncancel:An("Transition","TransitionCancel"),transitionend:An("Transition","TransitionEnd")},zi={},Tb={};qt&&(Tb=document.createElement("div").style,"AnimationEvent"in window||(delete ho.animationend.animation,delete ho.animationiteration.animation,delete ho.animationstart.animation),"TransitionEvent"in window||delete ho.transitionend.transition);function $n(e){if(zi[e])return zi[e];if(!ho[e])return e;var t=ho[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Tb)return zi[e]=t[n];return e}var Eb=$n("animationend"),zb=$n("animationiteration"),Ob=$n("animationstart"),nh=$n("transitionrun"),oh=$n("transitionstart"),ah=$n("transitioncancel"),Nb=$n("transitionend"),Ab=new Map,dr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");dr.push("scrollEnd");function bt(e,t){Ab.set(e,t),Wn(t,[e])}var lh=0;function Yt(e,t){if(e.name!=null&&e.name!=="auto")return e.name;if(t.autoName!==null)return t.autoName;e=ft.identifierPrefix;var n=lh++;return e="_"+e+"t_"+n.toString(32)+"_",t.autoName=e}function Ns(e){if(e==null||typeof e=="string")return e;var t=null,n=Do;if(n!==null)for(var o=0;o<n.length;o++){var a=e[n[o]];if(a!=null){if(a==="none")return"none";t=t==null?a:t+(" "+a)}}return t??e.default}function Qt(e,t){return e=Ns(e),t=Ns(t),t==null?e==="auto"?null:e:t==="auto"?null:t}var ac=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},et=[],yo=0,pu=0;function Dc(){for(var e=yo,t=pu=yo=0;t<e;){var n=et[t];et[t++]=null;var o=et[t];et[t++]=null;var a=et[t];et[t++]=null;var l=et[t];if(et[t++]=null,o!==null&&a!==null){var c=o.pending;c===null?a.next=a:(a.next=c.next,c.next=a),o.pending=a}l!==0&&_b(n,a,l)}}function Rc(e,t,n,o){et[yo++]=e,et[yo++]=t,et[yo++]=n,et[yo++]=o,pu|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function vu(e,t,n,o){return Rc(e,t,n,o),lc(e)}function In(e,t){return Rc(e,null,null,t),lc(e)}function _b(e,t,n){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n);for(var a=!1,l=e.return;l!==null;)l.childLanes|=n,o=l.alternate,o!==null&&(o.childLanes|=n),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(a=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,a&&t!==null&&(a=31-Je(n),e=l.hiddenUpdates,o=e[a],o===null?e[a]=[t]:o.push(t),t.lane=n|536870912),l):null}function lc(e){if(50<Na)throw Na=0,Kl=null,Error(h(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var xo={};function ch(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Be(e,t,n,o){return new ch(e,t,n,o)}function gu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Bt(e,t){var n=e.alternate;return n===null?(n=Be(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Cb(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function ql(e,t,n,o,a,l){var c=0;if(o=e,typeof o=="function")gu(o)&&(c=1);else if(typeof o=="string")c=M0(e,n,zt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(o){case $i:return e=Be(31,n,t,a),e.elementType=$i,e.lanes=l,e;case bo:return Hn(n.children,a,l,t);case Jf:c=8,a|=24;break;case Ji:return e=Be(12,n,t,a|2),e.elementType=Ji,e.lanes=l,e;case Fi:return e=Be(13,n,t,a),e.elementType=Fi,e.lanes=l,e;case Wi:return e=Be(19,n,t,a),e.elementType=Wi,e.lanes=l,e;case Kg:case Ii:return e=a|32,e=Be(30,n,t,e),e.elementType=Ii,e.lanes=l,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case wt:c=10;break e;case Ff:c=9;break e;case ou:c=11;break e;case au:c=14;break e;case en:c=16,o=null;break e}c=29,n=Error(h(130,e===null?"null":typeof e,"")),o=null}return t=Be(c,n,t,a),t.elementType=e,t.type=o,t.lanes=l,t}function Hn(e,t,n,o){return e=Be(7,e,o,t),e.lanes=n,e}function Oi(e,t,n){return e=Be(6,e,null,t),e.lanes=n,e}function Mb(e){var t=Be(18,null,null,0);return t.stateNode=e,t}function Ni(e,t,n){return t=Be(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var As=new WeakMap;function at(e,t){if(typeof e=="object"&&e!==null){var n=As.get(e);return n!==void 0?n:(t={value:e,source:t,stack:is(t)},As.set(e,t),t)}return{value:e,source:t,stack:is(t)}}var ko=[],wo=0,cc=null,Da=0,tt=[],nt=0,xn=null,Tt=1,Et="";function Rt(e,t){ko[wo++]=Da,ko[wo++]=cc,cc=e,Da=t}function Db(e,t,n){tt[nt++]=Tt,tt[nt++]=Et,tt[nt++]=xn,xn=e;var o=Tt;e=Et;var a=32-Je(o)-1;o&=~(1<<a),n+=1;var l=32-Je(t)+a;if(30<l){var c=a-a%5;l=(o&(1<<c)-1).toString(32),o>>=c,a-=c,Tt=1<<32-Je(t)+a|n<<a|o,Et=l+e}else Tt=1<<l|n<<a|o,Et=e}function Uc(e){e.return!==null&&(Rt(e,1),Db(e,1,0))}function mu(e){for(;e===cc;)cc=ko[--wo],ko[wo]=null,Da=ko[--wo],ko[wo]=null;for(;e===xn;)xn=tt[--nt],tt[nt]=null,Et=tt[--nt],tt[nt]=null,Tt=tt[--nt],tt[nt]=null}function Rb(e,t){tt[nt++]=Tt,tt[nt++]=Et,tt[nt++]=xn,Tt=t.id,Et=t.overflow,xn=e}var ve=null,W=null,_=!1,sn=null,lt=!1,sr=Error(h(519));function kn(e){var t=Error(h(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ra(at(t,e)),sr}function _s(e){var t=e.stateNode,n=e.type,o=e.memoizedProps;switch(t[he]=e,t[Ye]=o,n){case"dialog":C("cancel",t),C("close",t);break;case"iframe":case"object":case"embed":C("load",t);break;case"video":case"audio":for(n=0;n<qa.length;n++)C(qa[n],t);break;case"source":C("error",t);break;case"img":case"image":case"link":C("error",t),C("load",t);break;case"details":C("toggle",t);break;case"input":C("invalid",t),db(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":C("invalid",t);break;case"textarea":C("invalid",t),fb(t,o.value,o.defaultValue,o.children)}n=o.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||o.suppressHydrationWarning===!0||gv(t.textContent,n)?(o.popover!=null&&(C("beforetoggle",t),C("toggle",t)),o.onScroll!=null&&C("scroll",t),o.onScrollEnd!=null&&C("scrollend",t),o.onClick!=null&&(t.onclick=St),t=!0):t=!1,t||kn(e,!0)}function ic(e){for(ve=e.return;ve;)switch(ve.tag){case 5:case 31:case 13:lt=!1;return;case 27:case 3:lt=!0;return;default:ve=ve.return}}function co(e){if(e!==ve)return!1;if(!_)return ic(e),_=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Fr(e.type,e.memoizedProps)),n=!n),n&&W&&kn(e),ic(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));W=Of(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));W=Of(e)}else t===27?(t=W,zn(e.type)?(e=Pr,Pr=null,W=e):W=t):W=ve?ct(e.stateNode.nextSibling):null;return!0}function jn(){W=ve=null,_=!1}function Ai(){var e=sn;return e!==null&&(Re===null?Re=e:Re.push.apply(Re,e),sn=null),e}function Ra(e){sn===null?sn=[e]:sn.push(e)}var fr=At(null),Pn=null,Ut=null;function ln(e,t,n){$(fr,t._currentValue),t._currentValue=n}function Ht(e){e._currentValue=fr.current,xe(fr)}function Yl(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function br(e,t,n,o){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var l=a.dependencies;if(l!==null){var c=a.child;l=l.firstContext;e:for(;l!==null;){var i=l;l=a;for(var r=0;r<t.length;r++)if(i.context===t[r]){l.lanes|=n,i=l.alternate,i!==null&&(i.lanes|=n),Yl(l.return,n,e),o||(c=null);break e}l=i.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(h(341));c.lanes|=n,l=c.alternate,l!==null&&(l.lanes|=n),Yl(c,n,e),c=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),Yl(a.return,n,e),c=a.child,c=c!==null?c.sibling:null):c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function Gn(e,t,n,o){e=null;for(var a=t,l=!1;a!==null;){if(!l){if((a.flags&524288)!==0)l=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(h(387));if(c=c.memoizedProps,c!==null){var i=a.type;We(a.pendingProps.value,c.value)||(e!==null?e.push(i):e=[i])}}else if(a===Pl.current){if(c=a.alternate,c===null)throw Error(h(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(Xo):e=[Xo])}a=a.return}return e!==null&&br(t,e,n,o),t.flags|=262144,e!==null}function rc(e){for(e=e.firstContext;e!==null;){if(!We(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Vn(e){Pn=e,Ut=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ye(e){return Ub(Pn,e)}function kl(e,t){return Pn===null&&Vn(e),Ub(e,t)}function Ub(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Ut===null){if(e===null)throw Error(h(308));Ut=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Ut=Ut.next=t;return n}var ih=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},rh=se.unstable_scheduleCallback,uh=se.unstable_NormalPriority,ce={$$typeof:wt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function hu(){return{controller:new ih,data:new Map,refCount:0}}function $a(e){e.refCount--,e.refCount===0&&rh(uh,function(){e.controller.abort()})}function Cs(e,t){if((e.pendingLanes&4194048)!==0){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var o=t[e];n.indexOf(o)===-1&&n.push(o)}}}var pa=null;function dh(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var ya=null,pr=0,Xn=0,Oo=null;function sh(e,t){if(ya===null){var n=ya=[];pr=0,Xn=Zu(),Oo={status:"pending",value:void 0,then:function(o){n.push(o)}}}return pr++,t.then(Ms,Ms),t}function Ms(){if(--pr===0&&(pa=null,ya!==null)){Oo!==null&&(Oo.status="fulfilled");var e=ya;ya=null,Xn=0,Oo=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function fh(e,t){var n=[],o={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(o.status="rejected",o.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),o}var Ds=z.S;z.S=function(e,t){if(Pp=Ze(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&sh(e,t),pa!==null)for(var n=jo;n!==null;)Cs(n,pa),n=n.next;if(n=e.types,n!==null){for(var o=jo;o!==null;)Cs(o,n),o=o.next;if(Xn!==0){o=pa,o===null&&(o=pa=[]);for(var a=0;a<n.length;a++){var l=n[a];o.indexOf(l)===-1&&o.push(l)}}}Ds!==null&&Ds(e,t)};var qn=At(null);function yu(){var e=qn.current;return e!==null?e:Z.pooledCache}function Ll(e,t){t===null?$(qn,qn.current):$(qn,t.pool)}function Bb(){var e=yu();return e===null?null:{parent:ce._currentValue,pool:e}}var Fo=Error(h(460)),xu=Error(h(474)),Bc=Error(h(542)),uc={then:function(){}};function Rs(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Hb(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(St,St),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Bs(e),e===void 0&&!("reason"in t)?Error(h(600)):e;default:if(typeof t.status=="string")t.then(St,St);else{if(e=Z,e!==null&&100<e.shellSuspendCounter)throw Error(h(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=o}},function(o){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Bs(e),e}throw Yn=t,Fo}}function Mn(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Yn=n,Fo):n}}var Yn=null;function Us(){if(Yn===null)throw Error(h(459));var e=Yn;return Yn=null,e}function Bs(e){if(e===Fo||e===Bc)throw Error(h(483))}var No=null,Ua=0;function wl(e){var t=Ua;return Ua+=1,No===null&&(No=[]),Hb(No,e,t)}function $t(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Sl(e,t){throw t.$$typeof===Zg?Error(h(525)):(e=Object.prototype.toString.call(t),Error(h(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function qb(e){function t(b,u){if(e){var f=b.deletions;f===null?(b.deletions=[u],b.flags|=16):f.push(u)}}function n(b,u){if(!e)return null;for(;u!==null;)t(b,u),u=u.sibling;return null}function o(b){for(var u=new Map;b!==null;)b.key===null?u.set(b.index,b):u.set(b.key,b),b=b.sibling;return u}function a(b,u){return b=Bt(b,u),b.index=0,b.sibling=null,b}function l(b,u,f){return b.index=f,e?(f=b.alternate,f!==null?(f=f.index,f<u?(b.flags|=2,u):f):(b.flags|=134217730,u)):(b.flags|=1048576,u)}function c(b){return e&&b.alternate===null&&(b.flags|=134217730),b}function i(b,u,f,m){return u===null||u.tag!==6?(u=Oi(f,b.mode,m),u.return=b,u):(u=a(u,f),u.return=b,u)}function r(b,u,f,m){var x=f.type;return x===bo?(b=v(b,u,f.props.children,m,f.key),$t(b,f),b):u!==null&&(u.elementType===x||typeof x=="object"&&x!==null&&x.$$typeof===en&&Mn(x)===u.type)?(u=a(u,f.props),$t(u,f),u.return=b,u):(u=ql(f.type,f.key,f.props,null,b.mode,m),$t(u,f),u.return=b,u)}function d(b,u,f,m){return u===null||u.tag!==4||u.stateNode.containerInfo!==f.containerInfo||u.stateNode.implementation!==f.implementation?(u=Ni(f,b.mode,m),u.return=b,u):(u=a(u,f.children||[]),u.return=b,u)}function v(b,u,f,m,x){return u===null||u.tag!==7?(u=Hn(f,b.mode,m,x),u.return=b,u):(u=a(u,f),u.return=b,u)}function g(b,u,f){if(typeof u=="string"&&u!==""||typeof u=="number"||typeof u=="bigint")return u=Oi(""+u,b.mode,f),u.return=b,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case bl:return f=ql(u.type,u.key,u.props,null,b.mode,f),$t(f,u),f.return=b,f;case sa:return u=Ni(u,b.mode,f),u.return=b,u;case en:return u=Mn(u),g(b,u,f)}if(fa(u)||la(u))return u=Hn(u,b.mode,f,null),u.return=b,u;if(typeof u.then=="function")return g(b,wl(u),f);if(u.$$typeof===wt)return g(b,kl(b,u),f);Sl(b,u)}return null}function s(b,u,f,m){var x=u!==null?u.key:null;if(typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint")return x!==null?null:i(b,u,""+f,m);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case bl:return f.key===x?r(b,u,f,m):null;case sa:return f.key===x?d(b,u,f,m):null;case en:return f=Mn(f),s(b,u,f,m)}if(fa(f)||la(f))return x!==null?null:v(b,u,f,m,null);if(typeof f.then=="function")return s(b,u,wl(f),m);if(f.$$typeof===wt)return s(b,u,kl(b,f),m);Sl(b,f)}return null}function p(b,u,f,m,x){if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return b=b.get(f)||null,i(u,b,""+m,x);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case bl:return b=b.get(m.key===null?f:m.key)||null,r(u,b,m,x);case sa:return b=b.get(m.key===null?f:m.key)||null,d(u,b,m,x);case en:return m=Mn(m),p(b,u,f,m,x)}if(fa(m)||la(m))return b=b.get(f)||null,v(u,b,m,x,null);if(typeof m.then=="function")return p(b,u,f,wl(m),x);if(m.$$typeof===wt)return p(b,u,f,kl(u,m),x);Sl(u,m)}return null}function y(b,u,f,m){for(var x=null,E=null,w=u,S=u=0,j=null;w!==null&&S<f.length;S++){w.index>S?(j=w,w=null):j=w.sibling;var N=s(b,w,f[S],m);if(N===null){w===null&&(w=j);break}e&&w&&N.alternate===null&&t(b,w),u=l(N,u,S),E===null?x=N:E.sibling=N,E=N,w=j}if(S===f.length)return n(b,w),_&&Rt(b,S),x;if(w===null){for(;S<f.length;S++)w=g(b,f[S],m),w!==null&&(u=l(w,u,S),E===null?x=w:E.sibling=w,E=w);return _&&Rt(b,S),x}for(w=o(w);S<f.length;S++)j=p(w,b,S,f[S],m),j!==null&&(e&&(N=j.alternate,N!==null&&w.delete(N.key===null?S:N.key)),u=l(j,u,S),E===null?x=j:E.sibling=j,E=j);return e&&w.forEach(function(ge){return t(b,ge)}),_&&Rt(b,S),x}function k(b,u,f,m){if(f==null)throw Error(h(151));for(var x=null,E=null,w=u,S=u=0,j=null,N=f.next();w!==null&&!N.done;S++,N=f.next()){w.index>S?(j=w,w=null):j=w.sibling;var ge=s(b,w,N.value,m);if(ge===null){w===null&&(w=j);break}e&&w&&ge.alternate===null&&t(b,w),u=l(ge,u,S),E===null?x=ge:E.sibling=ge,E=ge,w=j}if(N.done)return n(b,w),_&&Rt(b,S),x;if(w===null){for(;!N.done;S++,N=f.next())N=g(b,N.value,m),N!==null&&(u=l(N,u,S),E===null?x=N:E.sibling=N,E=N);return _&&Rt(b,S),x}for(w=o(w);!N.done;S++,N=f.next())N=p(w,b,S,N.value,m),N!==null&&(e&&(j=N.alternate,j!==null&&w.delete(j.key===null?S:j.key)),u=l(N,u,S),E===null?x=N:E.sibling=N,E=N);return e&&w.forEach(function(Le){return t(b,Le)}),_&&Rt(b,S),x}function T(b,u,f,m){if(typeof f=="object"&&f!==null&&f.type===bo&&f.key===null&&f.props.ref===void 0&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case bl:e:{for(var x=f.key;u!==null;){if(u.key===x){if(x=f.type,x===bo){if(u.tag===7){n(b,u.sibling),m=a(u,f.props.children),$t(m,f),m.return=b,b=m;break e}}else if(u.elementType===x||typeof x=="object"&&x!==null&&x.$$typeof===en&&Mn(x)===u.type){n(b,u.sibling),m=a(u,f.props),$t(m,f),m.return=b,b=m;break e}n(b,u);break}else t(b,u);u=u.sibling}f.type===bo?(m=Hn(f.props.children,b.mode,m,f.key),$t(m,f),m.return=b,b=m):(m=ql(f.type,f.key,f.props,null,b.mode,m),$t(m,f),m.return=b,b=m)}return c(b);case sa:e:{for(x=f.key;u!==null;){if(u.key===x)if(u.tag===4&&u.stateNode.containerInfo===f.containerInfo&&u.stateNode.implementation===f.implementation){n(b,u.sibling),m=a(u,f.children||[]),m.return=b,b=m;break e}else{n(b,u);break}else t(b,u);u=u.sibling}m=Ni(f,b.mode,m),m.return=b,b=m}return c(b);case en:return f=Mn(f),T(b,u,f,m)}if(fa(f))return y(b,u,f,m);if(la(f)){if(x=la(f),typeof x!="function")throw Error(h(150));return f=x.call(f),k(b,u,f,m)}if(typeof f.then=="function")return T(b,u,wl(f),m);if(f.$$typeof===wt)return T(b,u,kl(b,f),m);Sl(b,f)}return typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint"?(f=""+f,u!==null&&u.tag===6?(n(b,u.sibling),m=a(u,f),m.return=b,b=m):(n(b,u),m=Oi(f,b.mode,m),m.return=b,b=m),c(b)):n(b,u)}return function(b,u,f,m){try{Ua=0;var x=T(b,u,f,m);return No=null,x}catch(w){if(w===Fo||w===Bc)throw w;var E=Be(29,w,null,b.mode);return E.lanes=m,E.return=b,E}}}var Qn=qb(!0),Yb=qb(!1),tn=!1;function ku(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function vr(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function fn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function bn(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(q&2)!==0){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,t=lc(e),_b(e,null,n),t}return Rc(e,o,t,n),lc(e)}function xa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,nb(e,n)}}function _i(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var a=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};l===null?a=l=c:l=l.next=c,n=n.next}while(n!==null);l===null?a=l=t:l=l.next=t}else a=l=t;n={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:l,shared:o.shared,callbacks:o.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var gr=!1;function ka(){if(gr){var e=Oo;if(e!==null)throw e}}function wa(e,t,n,o){gr=!1;var a=e.updateQueue;tn=!1;var l=a.firstBaseUpdate,c=a.lastBaseUpdate,i=a.shared.pending;if(i!==null){a.shared.pending=null;var r=i,d=r.next;r.next=null,c===null?l=d:c.next=d,c=r;var v=e.alternate;v!==null&&(v=v.updateQueue,i=v.lastBaseUpdate,i!==c&&(i===null?v.firstBaseUpdate=d:i.next=d,v.lastBaseUpdate=r))}if(l!==null){var g=a.baseState;c=0,v=d=r=null,i=l;do{var s=i.lane&-536870913,p=s!==i.lane;if(p?(D&s)===s:(o&s)===s){s!==0&&s===Xn&&(gr=!0),v!==null&&(v=v.next={lane:0,tag:i.tag,payload:i.payload,callback:null,next:null});e:{var y=e,k=i;s=t;var T=n;switch(k.tag){case 1:if(y=k.payload,typeof y=="function"){g=y.call(T,g,s);break e}g=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=k.payload,s=typeof y=="function"?y.call(T,g,s):y,s==null)break e;g=K({},g,s);break e;case 2:tn=!0}}s=i.callback,s!==null&&(e.flags|=64,p&&(e.flags|=8192),p=a.callbacks,p===null?a.callbacks=[s]:p.push(s))}else p={lane:s,tag:i.tag,payload:i.payload,callback:i.callback,next:null},v===null?(d=v=p,r=g):v=v.next=p,c|=s;if(i=i.next,i===null){if(i=a.shared.pending,i===null)break;p=i,i=p.next,p.next=null,a.lastBaseUpdate=p,a.shared.pending=null}}while(!0);v===null&&(r=g),a.baseState=r,a.firstBaseUpdate=d,a.lastBaseUpdate=v,l===null&&(a.shared.lanes=0),Tn|=c,e.lanes=c,e.memoizedState=g}}function Lb(e,t){if(typeof e!="function")throw Error(h(191,e));e.call(t)}function jb(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Lb(n[e],t)}var wn=At(null),dc=At(0);function Hs(e,t){e=Vt,$(dc,e),$(wn,t),Vt=e|t.baseLanes}function mr(){$(dc,Vt),$(wn,wn.current)}function wu(){Vt=dc.current,xe(wn),xe(dc)}var Se=At(null),ze=null;function pn(e){var t=e.alternate;$(ke,ke.current&1),$(Se,e),ze===null&&(t===null||wn.current!==null||t.memoizedState!==null)&&(ze=e)}function hr(e){$(ke,ke.current),$(Se,e),ze===null&&(ze=e)}function Gb(e){e.tag===22?($(ke,ke.current),$(Se,e),ze===null&&(ze=e)):vn()}function vn(){$(ke,ke.current),$(Se,Se.current)}function Ve(e){xe(Se),ze===e&&(ze=null),xe(ke)}var ke=At(0);function Ba(e,t){$(Se,Se.current),$(ke,t)}function Su(e){xe(ke),xe(Se),ze===e&&(ze=null)}function sc(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Ir(n)||Wu(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!=="independent"){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Lt=0,A=null,Q=null,le=null,fc=!1,Ao=!1,Zn=!1,bc=0,Ha=0,_o=null,bh=0;function te(){throw Error(h(321))}function Tu(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!We(e[n],t[n]))return!1;return!0}function Eu(e,t,n,o,a,l){return Lt=l,A=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,z.H=e===null||e.memoizedState===null?yp:xp,Zn=!1,l=n(o,a),Zn=!1,Ao&&(l=Xb(t,n,o,a)),Vb(e),l}function Vb(e){z.H=pc;var t=Q!==null&&Q.next!==null;if(Lt=0,le=Q=A=null,fc=!1,Ha=0,_o=null,t)throw Error(h(300));e===null||ie||(e=e.dependencies,e!==null&&rc(e)&&(ie=!0))}function Xb(e,t,n,o){A=e;var a=0;do{if(Ao&&(_o=null),Ha=0,Ao=!1,25<=a)throw Error(h(301));if(a+=1,le=Q=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}z.H=kh,l=t(n,o)}while(Ao);return l}function ph(){var e=z.H,t=e.useState()[0];return t=typeof t.then=="function"?Ia(t):t,e=e.useState()[0],(Q!==null?Q.memoizedState:null)!==e&&(A.flags|=1024),t}function zu(){var e=bc!==0;return bc=0,e}function Ou(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Nu(e){if(fc){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}fc=!1}Lt=0,le=Q=A=null,Ao=!1,Ha=bc=0,_o=null}function Ce(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return le===null?A.memoizedState=le=e:le=le.next=e,le}function oe(){if(Q===null){var e=A.alternate;e=e!==null?e.memoizedState:null}else e=Q.next;var t=le===null?A.memoizedState:le.next;if(t!==null)le=t,Q=e;else{if(e===null)throw A.alternate===null?Error(h(467)):Error(h(310));Q=e,e={memoizedState:Q.memoizedState,baseState:Q.baseState,baseQueue:Q.baseQueue,queue:Q.queue,next:null},le===null?A.memoizedState=le=e:le=le.next=e}return le}function Hc(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ia(e){var t=Ha;return Ha+=1,_o===null&&(_o=[]),e=Hb(_o,e,t),t=A,(le===null?t.memoizedState:le.next)===null&&(t=t.alternate,z.H=t===null||t.memoizedState===null?yp:xp),e}function qc(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ia(e);if(e.$$typeof===Fg)return;if(e.$$typeof===wt)return ye(e)}throw Error(h(438,String(e)))}function Au(e){var t=null,n=A.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var o=A.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Hc(),A.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),o=0;o<e;o++)n[o]=Jg;return t.index++,n}function jt(e,t){return typeof t=="function"?t(e):t}function jl(e){var t=oe();return _u(t,Q,e)}function _u(e,t,n){var o=e.queue;if(o===null)throw Error(h(311));o.lastRenderedReducer=n;var a=e.baseQueue,l=o.pending;if(l!==null){if(a!==null){var c=a.next;a.next=l.next,l.next=c}t.baseQueue=a=l,o.pending=null}if(l=e.baseState,a===null)e.memoizedState=l;else{t=a.next;var i=c=null,r=null,d=t,v=!1;do{var g=d.lane&-536870913;if(g!==d.lane?(D&g)===g:(Lt&g)===g){var s=d.revertLane;if(s===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),g===Xn&&(v=!0);else if((Lt&s)===s){d=d.next,s===Xn&&(v=!0);continue}else g={lane:0,revertLane:d.revertLane,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=g,c=l):r=r.next=g,A.lanes|=s,Tn|=s;g=d.action,Zn&&n(l,g),l=d.hasEagerState?d.eagerState:n(l,g)}else s={lane:g,revertLane:d.revertLane,gesture:d.gesture,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=s,c=l):r=r.next=s,A.lanes|=g,Tn|=g;d=d.next}while(d!==null&&d!==t);if(r===null?c=l:r.next=i,!We(l,e.memoizedState)&&(ie=!0,v&&(n=Oo,n!==null)))throw n;e.memoizedState=l,e.baseState=c,e.baseQueue=r,o.lastRenderedState=l}return a===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function Ci(e){var t=oe(),n=t.queue;if(n===null)throw Error(h(311));n.lastRenderedReducer=e;var o=n.dispatch,a=n.pending,l=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do l=e(l,c.action),c=c.next;while(c!==a);We(l,t.memoizedState)||(ie=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,o]}function Qb(e,t,n){var o=A,a=oe(),l=_;if(l){if(n===void 0)throw Error(h(407));n=n()}else n=t();var c=!We((Q||a).memoizedState,n);if(c&&(a.memoizedState=n,ie=!0),a=a.queue,Cu(Jb.bind(null,o,a,e),[e]),e=a.getSnapshot!==t||c||le!==null&&(le.memoizedState.tag&1)!==0,Ho(e?9:8,{destroy:void 0},Kb.bind(null,o,a,n,t),null),e){if(o.flags|=2048,Z===null)throw Error(h(349));l||(Lt&127)!==0||Zb(o,t,n)}return n}function Zb(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=A.updateQueue,t===null?(t=Hc(),A.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Kb(e,t,n,o){t.value=n,t.getSnapshot=o,Fb(t)&&Wb(e)}function Jb(e,t,n){return n(function(){Fb(t)&&Wb(e)})}function Fb(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!We(e,n)}catch{return!0}}function Wb(e){var t=In(e,2);t!==null&&He(t,e,2)}function yr(e){var t=Ce();if(typeof e=="function"){var n=e;if(e=n(),Zn){on(!0);try{n()}finally{on(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:jt,lastRenderedState:e},t}function $b(e,t,n,o){return e.baseState=n,_u(e,Q,typeof o=="function"?o:jt)}function vh(e,t,n,o,a){if(Lc(e))throw Error(h(485));if(e=t.action,e!==null){var l={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){l.listeners.push(c)}};z.T!==null?n(!0):l.isTransition=!1,o(l),n=t.pending,n===null?(l.next=t.pending=l,Ib(t,l)):(l.next=n.next,t.pending=n.next=l)}}function Ib(e,t){var n=t.action,o=t.payload,a=e.state;if(t.isTransition){var l=z.T,c={};c.types=l!==null?l.types:null,z.T=c;try{var i=n(a,o),r=z.S;r!==null&&r(c,i),qs(e,t,i)}catch(d){xr(e,t,d)}finally{l!==null&&c.types!==null&&(l.types=c.types),z.T=l}}else try{l=n(a,o),qs(e,t,l)}catch(d){xr(e,t,d)}}function qs(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(o){Ys(e,t,o)},function(o){return xr(e,t,o)}):Ys(e,t,n)}function Ys(e,t,n){t.status="fulfilled",t.value=n,Pb(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Ib(e,n)))}function xr(e,t,n){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=n,Pb(t),t=t.next;while(t!==o)}e.action=null}function Pb(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function ep(e,t){return t}function Ls(e,t){if(_){var n=Z.formState;if(n!==null){e:{var o=A;if(_){if(W){t:{for(var a=W,l=lt;a.nodeType!==8;){if(!l){a=null;break t}if(a=ct(a.nextSibling),a===null){a=null;break t}}l=a.data,a=l==="F!"||l==="F"?a:null}if(a){W=ct(a.nextSibling),o=a.data==="F!";break e}}kn(o)}o=!1}o&&(t=n[0])}}return n=Ce(),n.memoizedState=n.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ep,lastRenderedState:t},n.queue=o,n=gp.bind(null,A,o),o.dispatch=n,o=yr(!1),l=Uu.bind(null,A,!1,o.queue),o=Ce(),a={state:t,dispatch:null,action:e,pending:null},o.queue=a,n=vh.bind(null,A,a,l,n),a.dispatch=n,o.memoizedState=e,[t,n,!1]}function js(e){var t=oe();return tp(t,Q,e)}function tp(e,t,n){if(t=_u(e,t,ep)[0],e=jl(jt)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=Ia(t)}catch(c){throw c===Fo?Bc:c}else o=t;t=oe();var a=t.queue,l=a.dispatch;return n!==t.memoizedState&&(A.flags|=2048,Ho(9,{destroy:void 0},gh.bind(null,a,n),null)),[o,l,e]}function gh(e,t){e.action=t}function Gs(e){var t=oe(),n=Q;if(n!==null)return tp(t,n,e);oe(),t=t.memoizedState,n=oe();var o=n.queue.dispatch;return n.memoizedState=e,[t,o,!1]}function Ho(e,t,n,o){return e={tag:e,create:n,deps:o,inst:t,next:null},t=A.updateQueue,t===null&&(t=Hc(),A.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e),e}function np(){return oe().memoizedState}function Gl(e,t,n,o){var a=Ce();A.flags|=e,a.memoizedState=Ho(1|t,{destroy:void 0},n,o===void 0?null:o)}function Yc(e,t,n,o){var a=oe();o=o===void 0?null:o;var l=a.memoizedState.inst;Q!==null&&o!==null&&Tu(o,Q.memoizedState.deps)?a.memoizedState=Ho(t,l,n,o):(A.flags|=e,a.memoizedState=Ho(1|t,l,n,o))}function Vs(e,t){Gl(8390656,8,e,t)}function Cu(e,t){Yc(2048,8,e,t)}function mh(e){A.flags|=4;var t=A.updateQueue;if(t===null)t=Hc(),A.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function op(e){var t=oe().memoizedState;return mh({ref:t,nextImpl:e}),function(){if((q&2)!==0)throw Error(h(440));return t.impl.apply(void 0,arguments)}}function ap(e,t){return Yc(4,2,e,t)}function lp(e,t){return Yc(4,4,e,t)}function cp(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ip(e,t,n){n=n!=null?n.concat([e]):null,Yc(4,4,cp.bind(null,t,e),n)}function Mu(){}function rp(e,t){var n=oe();t=t===void 0?null:t;var o=n.memoizedState;return t!==null&&Tu(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function up(e,t){var n=oe();t=t===void 0?null:t;var o=n.memoizedState;if(t!==null&&Tu(t,o[1]))return o[0];if(o=e(),Zn){on(!0);try{e()}finally{on(!1)}}return n.memoizedState=[o,t],o}function Du(e,t,n){return n===void 0||(Lt&1073741824)!==0&&(D&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=tv(),A.lanes|=e,Tn|=e,n)}function dp(e,t,n,o){return We(n,t)?n:wn.current!==null?(e=Du(e,n,o),We(e,t)||(ie=!0),e):(Lt&106)===0||(Lt&1073741824)!==0&&(D&261930)===0?(ie=!0,e.memoizedState=n):(e=tv(),A.lanes|=e,Tn|=e,t)}function sp(e,t,n,o,a){var l=Y.p;Y.p=l!==0&&8>l?l:8;var c=z.T,i={};i.types=c!==null?c.types:null,z.T=i,Uu(e,!1,t,n);try{var r=a(),d=z.S;if(d!==null&&d(i,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var v=fh(r,o);Sa(e,t,v,Fe(e))}else Sa(e,t,o,Fe(e))}catch(g){Sa(e,t,{then:function(){},status:"rejected",reason:g},Fe())}finally{Y.p=l,c!==null&&i.types!==null&&(c.types=i.types),z.T=c}}function hh(){}function kr(e,t,n,o){if(e.tag!==5)throw Error(h(476));var a=fp(e).queue;sp(e,a,t,Bn,n===null?hh:function(){return bp(e),n(o)})}function fp(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Bn,baseState:Bn,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:jt,lastRenderedState:Bn},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:jt,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function bp(e){var t=fp(e);t.next===null&&(t=e.alternate.memoizedState),Sa(e,t.next.queue,{},Fe())}function Ru(){return ye(Xo)}function pp(){return oe().memoizedState}function vp(){return oe().memoizedState}function yh(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Fe();e=fn(n);var o=bn(t,e,n);o!==null&&(He(o,t,n),xa(o,t,n)),t={cache:hu()},e.payload=t;return}t=t.return}}function xh(e,t,n){var o=Fe();n={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Lc(e)?mp(t,n):(n=vu(e,t,n,o),n!==null&&(He(n,e,o),hp(n,t,o)))}function gp(e,t,n){var o=Fe();Sa(e,t,n,o)}function Sa(e,t,n,o){var a={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Lc(e))mp(t,a);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var c=t.lastRenderedState,i=l(c,n);if(a.hasEagerState=!0,a.eagerState=i,We(i,c))return Rc(e,t,a,0),Z===null&&Dc(),!1}catch{}if(n=vu(e,t,a,o),n!==null)return He(n,e,o),hp(n,t,o),!0}return!1}function Uu(e,t,n,o){if(o={lane:2,revertLane:Zu(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Lc(e)){if(t)throw Error(h(479))}else t=vu(e,n,o,2),t!==null&&He(t,e,2)}function Lc(e){var t=e.alternate;return e===A||t!==null&&t===A}function mp(e,t){Ao=fc=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function hp(e,t,n){if((n&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,nb(e,n)}}var pc={readContext:ye,use:qc,useCallback:te,useContext:te,useEffect:te,useImperativeHandle:te,useLayoutEffect:te,useInsertionEffect:te,useMemo:te,useReducer:te,useRef:te,useState:te,useDebugValue:te,useDeferredValue:te,useTransition:te,useSyncExternalStore:te,useId:te,useHostTransitionStatus:te,useFormState:te,useActionState:te,useOptimistic:te,useMemoCache:te,useCacheRefresh:te,useEffectEvent:te},yp={readContext:ye,use:qc,useCallback:function(e,t){return Ce().memoizedState=[e,t===void 0?null:t],e},useContext:ye,useEffect:Vs,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,Gl(4194308,4,cp.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Gl(4194308,4,e,t)},useInsertionEffect:function(e,t){Gl(4,2,e,t)},useMemo:function(e,t){var n=Ce();t=t===void 0?null:t;var o=e();if(Zn){on(!0);try{e()}finally{on(!1)}}return n.memoizedState=[o,t],o},useReducer:function(e,t,n){var o=Ce();if(n!==void 0){var a=n(t);if(Zn){on(!0);try{n(t)}finally{on(!1)}}}else a=t;return o.memoizedState=o.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},o.queue=e,e=e.dispatch=xh.bind(null,A,e),[o.memoizedState,e]},useRef:function(e){var t=Ce();return e={current:e},t.memoizedState=e},useState:function(e){e=yr(e);var t=e.queue,n=gp.bind(null,A,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Mu,useDeferredValue:function(e,t){var n=Ce();return Du(n,e,t)},useTransition:function(){var e=yr(!1);return e=sp.bind(null,A,e.queue,!0,!1),Ce().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var o=A,a=Ce();if(_){if(n===void 0)throw Error(h(407));n=n()}else{if(n=t(),Z===null)throw Error(h(349));(D&127)!==0||Zb(o,t,n)}a.memoizedState=n;var l={value:n,getSnapshot:t};return a.queue=l,Vs(Jb.bind(null,o,l,e),[e]),o.flags|=2048,Ho(9,{destroy:void 0},Kb.bind(null,o,l,n,t),null),n},useId:function(){var e=Ce(),t=Z.identifierPrefix;if(_){var n=Et,o=Tt;n=(o&~(1<<32-Je(o)-1)).toString(32)+n,t="_"+t+"R_"+n,n=bc++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=bh++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Ru,useFormState:Ls,useActionState:Ls,useOptimistic:function(e){var t=Ce();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Uu.bind(null,A,!0,n),n.dispatch=t,[e,t]},useMemoCache:Au,useCacheRefresh:function(){return Ce().memoizedState=yh.bind(null,A)},useEffectEvent:function(e){var t=Ce(),n={impl:e};return t.memoizedState=n,function(){if((q&2)!==0)throw Error(h(440));return n.impl.apply(void 0,arguments)}}},xp={readContext:ye,use:qc,useCallback:rp,useContext:ye,useEffect:Cu,useImperativeHandle:ip,useInsertionEffect:ap,useLayoutEffect:lp,useMemo:up,useReducer:jl,useRef:np,useState:function(){return jl(jt)},useDebugValue:Mu,useDeferredValue:function(e,t){var n=oe();return dp(n,Q.memoizedState,e,t)},useTransition:function(){var e=jl(jt)[0],t=oe().memoizedState;return[typeof e=="boolean"?e:Ia(e),t]},useSyncExternalStore:Qb,useId:pp,useHostTransitionStatus:Ru,useFormState:js,useActionState:js,useOptimistic:function(e,t){var n=oe();return $b(n,Q,e,t)},useMemoCache:Au,useCacheRefresh:vp,useEffectEvent:op},kh={readContext:ye,use:qc,useCallback:rp,useContext:ye,useEffect:Cu,useImperativeHandle:ip,useInsertionEffect:ap,useLayoutEffect:lp,useMemo:up,useReducer:Ci,useRef:np,useState:function(){return Ci(jt)},useDebugValue:Mu,useDeferredValue:function(e,t){var n=oe();return Q===null?Du(n,e,t):dp(n,Q.memoizedState,e,t)},useTransition:function(){var e=Ci(jt)[0],t=oe().memoizedState;return[typeof e=="boolean"?e:Ia(e),t]},useSyncExternalStore:Qb,useId:pp,useHostTransitionStatus:Ru,useFormState:Gs,useActionState:Gs,useOptimistic:function(e,t){var n=oe();return Q!==null?$b(n,Q,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Au,useCacheRefresh:vp,useEffectEvent:op};function Mi(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:K({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var wr={enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Fe(),a=fn(o);a.payload=t,n!=null&&(a.callback=n),t=bn(e,a,o),t!==null&&(He(t,e,o),xa(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Fe(),a=fn(o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=bn(e,a,o),t!==null&&(He(t,e,o),xa(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Fe(),o=fn(n);o.tag=2,t!=null&&(o.callback=t),t=bn(e,o,n),t!==null&&(He(t,e,n),xa(t,e,n))}};function Xs(e,t,n,o,a,l,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,c):t.prototype&&t.prototype.isPureReactComponent?!Ma(n,o)||!Ma(a,l):!0}function Qs(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&wr.enqueueReplaceState(t,t.state,null)}function Kn(e,t){var n=t;if("ref"in t){n={};for(var o in t)o!=="ref"&&(n[o]=t[o])}if(e=e.defaultProps){n===t&&(n=K({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function kp(e){ac(e)}function wp(e){console.error(e)}function Sp(e){ac(e)}function vc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function Zs(e,t,n){try{var o=e.onCaughtError;o(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function Sr(e,t,n){return n=fn(n),n.tag=3,n.payload={element:null},n.callback=function(){vc(e,t)},n}function Tp(e){return e=fn(e),e.tag=3,e}function Ep(e,t,n,o){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var l=o.value;e.payload=function(){return a(l)},e.callback=function(){Zs(t,n,o)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){Zs(t,n,o),typeof a!="function"&&(gn===null?gn=new Set([this]):gn.add(this));var i=o.stack;this.componentDidCatch(o.value,{componentStack:i!==null?i:""})})}function wh(e,t,n,o,a){if(n.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=n.alternate,t!==null&&Gn(t,n,a,!0),n=Se.current,n!==null){switch(n.tag){case 31:case 13:case 19:return ze===null?Sc():n.alternate===null&&ne===0&&(ne=3),n.flags&=-257,n.flags|=65536,n.lanes=a,o===uc?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([o]):t.add(o),Yi(e,o,a)),!1;case 22:return n.flags|=65536,o===uc?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([o]):n.add(o)),Yi(e,o,a)),!1}throw Error(h(435,n.tag))}return Yi(e,o,a),Sc(),!1}if(_)return t=Se.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,o!==sr&&(e=Error(h(422),{cause:o}),Ra(at(e,n)))):(o!==sr&&(t=Error(h(423),{cause:o}),Ra(at(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,o=at(o,n),a=Sr(e.stateNode,o,a),_i(e,a),ne!==4&&(ne=2)),!1;var l=Error(h(520),{cause:o});if(l=at(l,n),Oa===null?Oa=[l]:Oa.push(l),ne!==4&&(ne=2),t===null)return!0;o=at(o,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Sr(n.stateNode,o,e),_i(n,e),!1;case 1:if(t=n.type,l=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(gn===null||!gn.has(l))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Tp(a),Ep(a,e,n,o),_i(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var Bu=Error(h(461)),ie=!1;function ue(e,t,n,o){t.child=e===null?Yb(t,null,n,o):Qn(t,e.child,n,o)}function Ks(e,t,n,o,a){n=n.render;var l=t.ref;if("ref"in o){var c={};for(var i in o)i!=="ref"&&(c[i]=o[i])}else c=o;return Vn(t),o=Eu(e,t,n,c,l,a),i=zu(),e!==null&&!ie?(Ou(e,t,a),Gt(e,t,a)):(_&&i&&Uc(t),t.flags|=1,ue(e,t,o,a),t.child)}function Js(e,t,n,o,a){if(e===null){var l=n.type;return typeof l=="function"&&!gu(l)&&l.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=l,zp(e,t,l,o,a)):(e=ql(n.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!qu(e,a)){var c=l.memoizedProps;if(n=n.compare,n=n!==null?n:Ma,n(c,o)&&e.ref===t.ref)return Gt(e,t,a)}return t.flags|=1,e=Bt(l,o),e.ref=t.ref,e.return=t,t.child=e}function zp(e,t,n,o,a){if(e!==null){var l=e.memoizedProps;if(Ma(l,o)&&e.ref===t.ref)if(ie=!1,t.pendingProps=o=l,qu(e,a))(e.flags&131072)!==0&&(ie=!0);else return t.lanes=e.lanes,Gt(e,t,a)}return Tr(e,t,n,o,a)}function Op(e,t,n,o){var a=o.children,l=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(l=l!==null?l.baseLanes|n:n,e!==null){for(o=t.child=e.child,a=0;o!==null;)a=a|o.lanes|o.childLanes,o=o.sibling;o=a&~l}else o=0,t.child=null;return Fs(e,t,l,n,o)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ll(t,l!==null?l.cachePool:null),l!==null?Hs(t,l):mr(),Gb(t);else return o=t.lanes=536870912,Fs(e,t,l!==null?l.baseLanes|n:n,n,o)}else l!==null?(Ll(t,l.cachePool),Hs(t,l),vn(),t.memoizedState=null):(e!==null&&Ll(t,null),mr(),vn());return ue(e,t,a,n),t.child}function Ta(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Fs(e,t,n,o,a){var l=yu();return l=l===null?null:{parent:ce._currentValue,pool:l},t.memoizedState={baseLanes:n,cachePool:l},e!==null&&Ll(t,null),mr(),Gb(t),e!==null&&Gn(e,t,o,!0),t.childLanes=a,null}function Vl(e,t){return t=jc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ws(e,t,n){return Qn(t,e.child,null,n),e=Vl(t,t.pendingProps),e.flags|=2,Ve(t),t.memoizedState=null,e}function Sh(e,t,n){var o=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(_){if(o.mode==="hidden")return e=Vl(t,o),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Ta(null,e);if(hr(t),(e=W)?(e=Ov(e,lt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:xn!==null?{id:Tt,overflow:Et}:null,retryLane:536870912,hydrationErrors:null},n=Mb(e),n.return=t,t.child=n,ve=t,W=null)):e=null,e===null)throw kn(t);return t.lanes=536870912,null}return Vl(t,o)}var l=e.memoizedState;if(l!==null){var c=l.dehydrated;if(hr(t),a)if(t.flags&256)t.flags&=-257,t=Ws(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(h(558));else if(ie||Gn(e,t,n,!1),a=(n&e.childLanes)!==0,ie||a){if(wn.current===null){if(o=Z,o!==null&&(c=ob(o,n),c!==0&&c!==l.retryLane))throw l.retryLane=c,In(e,c),He(o,e,c),Bu;Sc()}t=Ws(e,t,n)}else e=l.treeContext,W=ct(c.nextSibling),ve=t,_=!0,sn=null,lt=!1,e!==null&&Rb(t,e),t=Vl(t,o),t.flags|=134221824;return t}return e=Bt(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function ro(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(h(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Tr(e,t,n,o,a){return Vn(t),n=Eu(e,t,n,o,void 0,a),o=zu(),e!==null&&!ie?(Ou(e,t,a),Gt(e,t,a)):(_&&o&&Uc(t),t.flags|=1,ue(e,t,n,a),t.child)}function $s(e,t,n,o,a,l){return Vn(t),t.updateQueue=null,n=Xb(t,o,n,a),Vb(e),o=zu(),e!==null&&!ie?(Ou(e,t,l),Gt(e,t,l)):(_&&o&&Uc(t),t.flags|=1,ue(e,t,n,l),t.child)}function Is(e,t,n,o,a){if(Vn(t),t.stateNode===null){var l=xo,c=n.contextType;typeof c=="object"&&c!==null&&(l=ye(c)),l=new n(o,l),t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=wr,t.stateNode=l,l._reactInternals=t,l=t.stateNode,l.props=o,l.state=t.memoizedState,l.refs={},ku(t),c=n.contextType,l.context=typeof c=="object"&&c!==null?ye(c):xo,l.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(Mi(t,n,c,o),l.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(c=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),c!==l.state&&wr.enqueueReplaceState(l,l.state,null),wa(t,o,l,a),ka(),l.state=t.memoizedState),typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){l=t.stateNode;var i=t.memoizedProps,r=Kn(n,i);l.props=r;var d=l.context,v=n.contextType;c=xo,typeof v=="object"&&v!==null&&(c=ye(v));var g=n.getDerivedStateFromProps;v=typeof g=="function"||typeof l.getSnapshotBeforeUpdate=="function",i=t.pendingProps!==i,v||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i||d!==c)&&Qs(t,l,o,c),tn=!1;var s=t.memoizedState;l.state=s,wa(t,o,l,a),ka(),d=t.memoizedState,i||s!==d||tn?(typeof g=="function"&&(Mi(t,n,g,o),d=t.memoizedState),(r=tn||Xs(t,n,r,o,s,d,c))?(v||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=d),l.props=o,l.state=d,l.context=c,o=r):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{l=t.stateNode,vr(e,t),c=t.memoizedProps,v=Kn(n,c),l.props=v,g=t.pendingProps,s=l.context,d=n.contextType,r=xo,typeof d=="object"&&d!==null&&(r=ye(d)),i=n.getDerivedStateFromProps,(d=typeof i=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(c!==g||s!==r)&&Qs(t,l,o,r),tn=!1,s=t.memoizedState,l.state=s,wa(t,o,l,a),ka();var p=t.memoizedState;c!==g||s!==p||tn||e!==null&&e.dependencies!==null&&rc(e.dependencies)?(typeof i=="function"&&(Mi(t,n,i,o),p=t.memoizedState),(v=tn||Xs(t,n,v,o,s,p,r)||e!==null&&e.dependencies!==null&&rc(e.dependencies))?(d||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(o,p,r),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(o,p,r)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=p),l.props=o,l.state=p,l.context=r,o=v):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=1024),o=!1)}return l=o,ro(e,t),o=(t.flags&128)!==0,l||o?(l=t.stateNode,n=o&&typeof n.getDerivedStateFromError!="function"?null:l.render(),t.flags|=1,e!==null&&o?(t.child=Qn(t,e.child,null,a),t.child=Qn(t,null,n,a)):ue(e,t,n,a),t.memoizedState=l.state,e=t.child):e=Gt(e,t,a),e}function Ps(e,t,n,o){return jn(),t.flags|=256,ue(e,t,n,o),t.child}var Er={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function zr(e){return{baseLanes:e,cachePool:Bb()}}function Or(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Qe),e}function Np(e,t,n){var o=t.pendingProps,a=!1,l=(t.flags&128)!==0,c;if((c=l)||(c=e!==null&&e.memoizedState===null?!1:(ke.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(_){if(a?pn(t):vn(),(e=W)?(e=Ov(e,lt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:xn!==null?{id:Tt,overflow:Et}:null,retryLane:536870912,hydrationErrors:null},n=Mb(e),n.return=t,t.child=n,ve=t,W=null)):e=null,e===null)throw kn(t);return Wu(e)?t.lanes=32:t.lanes=536870912,null}return l=o.children,o=o.fallback,a?(vn(),a=t.mode,l=jc({mode:"hidden",children:l},a),o=Hn(o,a,n,null),l.return=t,o.return=t,l.sibling=o,t.child=l,o=t.child,o.memoizedState=zr(n),o.childLanes=Or(e,c,n),t.memoizedState=Er,Ta(null,o)):(pn(t),Hu(t,l))}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(r!==null)return Th(e,t,l,c,o,r,i,n)}return a?(vn(),a=o.fallback,l=t.mode,i=e.child,r=i.sibling,o=Bt(i,{mode:"hidden",children:o.children}),o.subtreeFlags=i.subtreeFlags&1206910976,r!==null?a=Bt(r,a):(a=Hn(a,l,n,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,Ta(null,o),o=t.child,a=e.child.memoizedState,a===null?a=zr(n):(l=a.cachePool,l!==null?(i=ce._currentValue,l=l.parent!==i?{parent:i,pool:i}:l):l=Bb(),a={baseLanes:a.baseLanes|n,cachePool:l}),o.memoizedState=a,o.childLanes=Or(e,c,n),t.memoizedState=Er,Ta(e.child,o)):(pn(t),n=e.child,e=n.sibling,n=Bt(n,{mode:"visible",children:o.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function Hu(e,t){return t=jc({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function jc(e,t){return e=Be(22,e,null,t),e.lanes=0,e}function Tl(e,t,n){return Qn(t,e.child,null,n),e=Hu(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Th(e,t,n,o,a,l,c,i){if(n)return t.flags&256?(pn(t),t.flags&=-257,Tl(e,t,i)):t.memoizedState!==null?(vn(),t.child=e.child,t.flags|=128,null):(vn(),l=a.fallback,c=t.mode,a=jc({mode:"visible",children:a.children},c),l=Hn(l,c,i,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,Qn(t,e.child,null,i),a=t.child,a.memoizedState=zr(i),a.childLanes=Or(e,o,i),t.memoizedState=Er,Ta(null,a));if(pn(t),Wu(l)){if(o=l.nextSibling&&l.nextSibling.dataset,o)var r=o.dgst;return o=r,o!==""&&(a=Error(h(419)),a.stack="",a.digest=o,Ra({value:a,source:null,stack:null})),Tl(e,t,i)}if(ie||Gn(e,t,i,!1),o=(i&e.childLanes)!==0,ie||o){if(wn.current!==null)return Tl(e,t,i);if(o=Z,o!==null&&(a=ob(o,i),a!==0&&a!==c.retryLane))throw c.retryLane=a,In(e,a),He(o,e,a),Bu;return Ir(l)||Sc(),Tl(e,t,i)}return Ir(l)?(t.flags|=192,t.child=e.child,null):(e=c.treeContext,W=ct(l.nextSibling),ve=t,_=!0,sn=null,lt=!1,e!==null&&Rb(t,e),t=Hu(t,a.children),t.flags|=134221824,t)}function ef(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Yl(e.return,t,n)}function tf(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&sc(n)===null&&(t=e),e=e.sibling}return t}function El(e,t,n,o,a,l){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:a,treeForkCount:l}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=n,c.tailMode=a,c.treeForkCount=l)}function Di(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function Nr(e,t,n){var o=t.pendingProps,a=o.revealOrder,l=o.tail;o=o.children;var c=ke.current;if(t.flags&128)return Ba(t,c),null;var i=(c&2)!==0;if(i?(c=c&1|2,t.flags|=128):c&=1,Ba(t,c),a==="backwards"&&e!==null?(Di(e),ue(e,t,o,n),Di(e)):ue(e,t,o,n),o=_?Da:0,!i&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ef(e,n,t);else if(e.tag===19)ef(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"backwards":n=tf(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null,Di(t)),El(t,!0,a,null,l,o);break;case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&sc(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}El(t,!0,n,null,l,o);break;case"together":El(t,!1,null,null,void 0,o);break;case"independent":t.memoizedState=null;break;default:n=tf(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),El(t,!1,a,n,l,o)}return t.child}function nf(e,t,n){var o=t.pendingProps;return ln(t,t.type,o.value),ue(e,t,o.children,n),t.child}function Gt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Tn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Gn(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(h(153));if(t.child!==null){for(e=t.child,n=Bt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Bt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function qu(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&rc(e)))}function Eh(e,t,n){switch(t.tag){case 3:ec(t,t.stateNode.containerInfo),ln(t,ce,e.memoizedState.cache),jn();break;case 27:case 5:tr(t);break;case 4:ec(t,t.stateNode.containerInfo);break;case 10:ln(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,hr(t),null;break;case 13:var o=t.memoizedState;if(o!==null){if(o.dehydrated!==null)return pn(t),t.flags|=128,null;o=Gn(e,t,n,!1);var a=t.child.childLanes;return o||(n&a)!==0?Np(e,t,n):(pn(t),e=Gt(e,t,n),e!==null?e.sibling:null)}pn(t);break;case 19:if(t.flags&128)return Nr(e,t,n);if(a=(e.flags&128)!==0,o=(n&t.childLanes)!==0,o||(Gn(e,t,n,!1),o=(n&t.childLanes)!==0),a){if(o)return Nr(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),Ba(t,ke.current),o)break;return null;case 22:return t.lanes=0,Op(e,t,n,t.pendingProps);case 24:ln(t,ce,e.memoizedState.cache)}return Gt(e,t,n)}function Ap(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)ie=!0;else{if(!qu(e,n)&&(t.flags&128)===0)return ie=!1,Eh(e,t,n);ie=(e.flags&131072)!==0}else ie=!1,_&&(t.flags&1048576)!==0&&Db(t,Da,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=Mn(t.elementType),t.type=e,typeof e=="function")gu(e)?(o=Kn(e,o),t.tag=1,t=Is(null,t,e,o,n)):(t.tag=0,t=Tr(null,t,e,o,n));else{if(e!=null){var a=e.$$typeof;if(a===ou){t.tag=11,t=Ks(null,t,e,o,n);break e}else if(a===au){t.tag=14,t=Js(null,t,e,o,n);break e}else if(a===wt){t.tag=10,t.type=e,t=nf(null,t,n);break e}}throw t=Pi(e)||e,Error(h(306,t,""))}}return t;case 0:return Tr(e,t,t.type,t.pendingProps,n);case 1:return o=t.type,a=Kn(o,t.pendingProps),Is(e,t,o,a,n);case 3:e:{if(ec(t,t.stateNode.containerInfo),e===null)throw Error(h(387));o=t.pendingProps;var l=t.memoizedState;a=l.element,vr(e,t),wa(t,o,null,n);var c=t.memoizedState;if(o=c.cache,ln(t,ce,o),o!==l.cache&&br(t,[ce],n,!0),ka(),o=c.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){t=Ps(e,t,o,n);break e}else if(o!==a){a=at(Error(h(424)),t),Ra(a),t=Ps(e,t,o,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,W=ct(e.firstChild),ve=t,_=!0,sn=null,lt=!0,n=Yb(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling;else{if(jn(),o===a){t=Gt(e,t,n);break e}ue(e,t,o,n)}t=t.child}return t;case 26:return ro(e,t),e===null?(n=_f(t.type,null,t.pendingProps,null))?t.memoizedState=n:_||(t.stateNode=hv(t.type,t.pendingProps,dn.current,t)):t.memoizedState=_f(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return tr(t),e===null&&_&&(o=t.stateNode=Nv(t.type,t.pendingProps,dn.current),ve=t,lt=!0,a=W,zn(t.type)?(Pr=a,W=ct(o.firstChild)):W=a),ue(e,t,t.pendingProps.children,n),ro(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&_&&((a=o=W)&&(o=m0(o,t.type,t.pendingProps,lt),o!==null?(t.stateNode=o,ve=t,W=ct(o.firstChild),lt=!1,a=!0):a=!1),a||kn(t)),tr(t),a=t.type,l=t.pendingProps,c=e!==null?e.memoizedProps:null,o=l.children,Fr(a,l)?o=null:c!==null&&Fr(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=Eu(e,t,ph,null,null,n),Xo._currentValue=a),ro(e,t),ue(e,t,o,n),t.child;case 6:return e===null&&_&&((e=n=W)&&(n=h0(n,t.pendingProps,lt),n!==null?(t.stateNode=n,ve=t,W=null,e=!0):e=!1),e||kn(t)),null;case 13:return Np(e,t,n);case 4:return ec(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Qn(t,null,o,n):ue(e,t,o,n),t.child;case 11:return Ks(e,t,t.type,t.pendingProps,n);case 7:return o=t.pendingProps,ro(e,t),ue(e,t,o,n),t.child;case 8:return ue(e,t,t.pendingProps.children,n),t.child;case 12:return ue(e,t,t.pendingProps.children,n),t.child;case 10:return nf(e,t,n);case 9:return a=t.type._context,o=t.pendingProps.children,Vn(t),a=ye(a),o=o(a),t.flags|=1,ue(e,t,o,n),t.child;case 14:return Js(e,t,t.type,t.pendingProps,n);case 15:return zp(e,t,t.type,t.pendingProps,n);case 19:return Nr(e,t,n);case 31:return Sh(e,t,n);case 22:return Op(e,t,n,t.pendingProps);case 24:return Vn(t),o=ye(ce),e===null?(a=yu(),a===null&&(a=Z,l=hu(),a.pooledCache=l,l.refCount++,l!==null&&(a.pooledCacheLanes|=n),a=l),t.memoizedState={parent:o,cache:a},ku(t),ln(t,ce,a)):((e.lanes&n)!==0&&(vr(e,t),wa(t,null,null,n),ka()),a=e.memoizedState,l=t.memoizedState,a.parent!==o?(a={parent:o,cache:o},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),ln(t,ce,o)):(o=l.cache,ln(t,ce,o),o!==a.cache&&br(t,[ce],n,!0))),ue(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=t.pendingProps,o.name!=null&&o.name!=="auto"?t.flags|=e===null?18882560:18874368:_&&Uc(t),e!==null&&e.memoizedProps.name!==o.name?t.flags|=4194816:ro(e,t),ue(e,t,o.children,n),t.child;case 29:throw t.pendingProps}throw Error(h(156,t.tag))}function Dt(e){e.flags|=4}function Ri(e,t,n,o,a){var l;if((l=(e.mode&32)!==0)&&(l=n===null?Df(t,o):Df(t,o)&&(o.src!==n.src||o.srcSet!==n.srcSet)),l){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(av())e.flags|=8192;else throw Yn=uc,xu}else e.flags&=-16777217}function of(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Mv(t))if(av())e.flags|=8192;else throw Yn=uc,xu}function zl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?eb():536870912,e.lanes|=t,qo|=t)}function ia(e,t){if(!_)switch(e.tailMode){case"visible":break;case"collapsed":for(var n=e.tail,o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function F(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags&1206910976,o|=a.flags&1206910976,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function zh(e,t,n){var o=t.pendingProps;switch(mu(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return F(t),null;case 1:return F(t),null;case 3:return n=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),Ht(ce),Ro(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(co(t)?Dt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ai())),F(t),null;case 26:var a=t.type,l=t.memoizedState;return e===null?(Dt(t),l!==null?(F(t),of(t,l)):(F(t),Ri(t,a,null,o,n))):l?l!==e.memoizedState?(Dt(t),F(t),of(t,l)):(F(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&Dt(t),F(t),Ri(t,a,e,o,n)),null;case 27:if(tc(t),n=dn.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Dt(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return F(t),t.subtreeFlags&=-33554433,null}e=zt.current,co(t)?_s(t,e):(e=Nv(a,o,n),t.stateNode=e,Dt(t))}return F(t),t.subtreeFlags&=-33554433,null;case 5:if(tc(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Dt(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return F(t),t.subtreeFlags&=-33554433,null}if(l=zt.current,co(t))_s(t,l);else{var c=La(dn.current);switch(l){case 1:l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":l=c.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof o.is=="string"?c.createElement("select",{is:o.is}):c.createElement("select"),o.multiple?l.multiple=!0:o.size&&(l.size=o.size);break;default:l=typeof o.is=="string"?c.createElement(a,{is:o.is}):c.createElement(a)}}l[he]=t,l[Ye]=o;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)l.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=l;e:switch(we(l,a,o),a){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&Dt(t)}}return F(t),t.subtreeFlags&=-33554433,Ri(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&Dt(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(h(166));if(e=dn.current,co(t)){if(e=t.stateNode,n=t.memoizedProps,o=null,a=ve,a!==null)switch(a.tag){case 27:case 5:o=a.memoizedProps}e[he]=t,e=!!(e.nodeValue===n||o!==null&&o.suppressHydrationWarning===!0||gv(e.nodeValue,n)),e||kn(t,!0)}else e=La(e).createTextNode(o),e[he]=t,t.stateNode=e}return F(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(o=co(t),n!==null){if(e===null){if(!o)throw Error(h(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(557));e[he]=t}else jn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;F(t),e=!1}else n=Ai(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Ve(t),t):(Ve(t),null);if((t.flags&128)!==0)throw Error(h(558))}return F(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=co(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(h(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(h(317));a[he]=t}else jn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;F(t),a=!1}else a=Ai(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Ve(t),t):(Ve(t),null)}return Ve(t),(t.flags&128)!==0?(t.lanes=n,t):(n=o!==null,e=e!==null&&e.memoizedState!==null,n&&(o=t.child,a=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(a=o.alternate.memoizedState.cachePool.pool),l=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(l=o.memoizedState.cachePool.pool),l!==a&&(o.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),zl(t,t.updateQueue),F(t),null);case 4:return Ro(),e===null&&Ku(t.stateNode.containerInfo),t.flags|=67108864,F(t),null;case 10:return Ht(t.type),F(t),null;case 19:if(Su(t),o=t.memoizedState,o===null)return F(t),null;if(a=(t.flags&128)!==0,l=o.rendering,l===null)if(a)ia(o,!1);else{if(ne!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=sc(e),l!==null){for(t.flags|=128,ia(o,!1),e=l.updateQueue,t.updateQueue=e,zl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Cb(n,e),n=n.sibling;return Ba(t,ke.current&1|2),_&&Rt(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&Ze()>kc&&(t.flags|=128,a=!0,ia(o,!1),t.lanes=4194304)}else{if(!a)if(e=sc(l),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,zl(t,e),ia(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!l.alternate&&!_)return F(t),null}else 2*Ze()-o.renderingStartTime>kc&&n!==536870912&&(t.flags|=128,a=!0,ia(o,!1),t.lanes=4194304);o.isBackwards?(l.sibling=t.child,t.child=l):(e=o.last,e!==null?e.sibling=l:t.child=l,o.last=l)}if(o.tail!==null){e=o.tail;e:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break e}n=n.sibling}n=!0}return o.rendering=e,o.tail=e.sibling,o.renderingStartTime=Ze(),e.sibling=null,l=ke.current,l=a?l&1|2:l&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!n||_?Ba(t,l):(n=l,$(Se,t),$(ke,n),ze===null&&(ze=t)),_&&Rt(t,o.treeForkCount),e}return F(t),null;case 22:case 23:return Ve(t),wu(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(n&536870912)!==0&&(t.flags&128)===0&&(F(t),t.subtreeFlags&6&&(t.flags|=8192)):F(t),n=t.updateQueue,n!==null&&zl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==n&&(t.flags|=2048),e!==null&&xe(qn),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Ht(ce),F(t),null;case 25:return null;case 30:return t.flags|=33554432,F(t),null}throw Error(h(156,t.tag))}function Oh(e,t){switch(mu(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ht(ce),Ro(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return tc(t),null;case 31:if(t.memoizedState!==null){if(Ve(t),t.alternate===null)throw Error(h(340));jn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Ve(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(h(340));jn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Su(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return Ro(),null;case 10:return Ht(t.type),null;case 22:case 23:return Ve(t),wu(),e!==null&&xe(qn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Ht(ce),null;case 25:return null;default:return null}}function _p(e,t){switch(mu(t),t.tag){case 3:Ht(ce),Ro();break;case 26:case 27:case 5:tc(t);break;case 4:Ro();break;case 31:t.memoizedState!==null&&Ve(t);break;case 13:Ve(t);break;case 19:Su(t);break;case 10:Ht(t.type);break;case 22:case 23:Ve(t),wu(),e!==null&&xe(qn);break;case 24:Ht(ce)}}function Pa(e,t){try{var n=t.updateQueue,o=n!==null?n.lastEffect:null;if(o!==null){var a=o.next;n=a;do{if((n.tag&e)===e){o=void 0;var l=n.create,c=n.inst;o=l(),c.destroy=o}n=n.next}while(n!==a)}}catch(i){X(t,t.return,i)}}function Sn(e,t,n){try{var o=t.updateQueue,a=o!==null?o.lastEffect:null;if(a!==null){var l=a.next;o=l;do{if((o.tag&e)===e){var c=o.inst,i=c.destroy;if(i!==void 0){c.destroy=void 0,a=t;var r=n,d=i;try{d()}catch(v){X(a,r,v)}}}o=o.next}while(o!==l)}}catch(v){X(t,t.return,v)}}function Cp(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{jb(t,n)}catch(o){X(e,e.return,o)}}}function Mp(e,t,n){n.props=Kn(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(o){X(e,t,o)}}function xt(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:var a=e.stateNode,l=Yt(e.memoizedProps,a);(a.ref===null||a.ref.name!==l)&&(a.ref=wv(l)),o=a.ref;break;case 7:if(e.stateNode===null){var c=new $e(e);qe(e.child,!1,v0,c,void 0,void 0),e.stateNode=c}o=e.stateNode;break;default:o=e.stateNode}typeof n=="function"?e.refCleanup=n(o):n.current=o}}catch(i){X(e,t,i)}}function me(e,t){var n=e.ref,o=e.refCleanup;if(n!==null)if(typeof o=="function")try{o()}catch(a){X(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){X(e,t,a)}else n.current=null}function gc(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)zv(e.stateNode,t[n])}function af(e){for(var t=e.return;t!==null&&(Lu(t)&&zv(e.stateNode,t.stateNode),!Yu(t));)t=t.return}function Ea(e){for(var t=e.return;t!==null&&(Lu(t)&&g0(e.stateNode,t.stateNode),!Yu(t));)t=t.return}function Yu(e){return e.tag===5||e.tag===3||e.tag===27}function Lu(e){return e&&e.tag===7&&e.stateNode!==null}function Ar(e){var t=e.type,n=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&o.focus();break e;case"img":n.src?o.src=n.src:n.srcSet&&(o.srcset=n.srcSet)}}catch(a){X(e,e.return,a)}}function Ui(e,t,n){try{var o=e.stateNode;$h(o,e.type,n,t),o[Ye]=t}catch(a){X(e,e.return,a)}}function Dp(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&zn(e.type)||e.tag===4}function Bi(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Dp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&zn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function _r(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=St)),gc(e,o),U=!0;else if(a!==4&&(a===27&&(gc(e,o),o=null,zn(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(_r(e,t,n,o),e=e.sibling;e!==null;)_r(e,t,n,o),e=e.sibling}function mc(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?n.insertBefore(a,t):n.appendChild(a),gc(e,o),U=!0;else if(a!==4&&(a===27&&(gc(e,o),o=null,zn(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(mc(e,t,n,o),e=e.sibling;e!==null;)mc(e,t,n,o),e=e.sibling}function Rp(e){var t=e.stateNode,n=e.memoizedProps;try{for(var o=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);we(t,o,n),t[he]=e,t[Ye]=n}catch(l){X(e,e.return,l)}}var hc=!1,Xe=null;function lf(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(hc=!0)}var kt=null;function cf(){var e=kt;return kt=null,e}var Ue=0;function Wo(e,t,n,o,a){return Ue=0,Up(e.child,t,n,o,a)}function Up(e,t,n,o,a){for(var l=!1;e!==null;){if(e.tag===5){var c=e.stateNode;if(o!==null){var i=Wr(c);o.push(i),i.view&&(l=!0)}else l||Wr(c).view&&(l=!0);hc=!0,yv(c,Ue===0?t:t+"_"+Ue,n),Ue++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&a||Up(e.child,t,n,o,a)&&(l=!0));e=e.sibling}return l}function Nt(e,t){for(;e!==null;)e.tag===5?xv(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||Nt(e.child,t)),e=e.sibling}function Xl(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Xl(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name==="auto")throw Error(h(544));var n=t.name;t=Qt(t.default,t.share),t!=="none"&&(Wo(e,n,t,null,!1)||Nt(e.child,!1))}e=e.sibling}}function Cr(e,t){if(e.tag===30){var n=e.stateNode,o=e.memoizedProps,a=Yt(o,n),l=Qt(o.default,n.paired?o.share:o.enter);l!=="none"?Wo(e,a,l,null,!1)?(Xl(e),n.paired||t||Yo(e,o.onEnter)):Nt(e.child,!1):Xl(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Cr(e,t),e=e.sibling;else Xl(e)}function Mr(e){if(Xe!==null&&Xe.size!==0){var t=Xe;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.memoizedProps,o=n.name;if(o!=null&&o!=="auto"){var a=t.get(o);if(a!==void 0){var l=Qt(n.default,n.share);if(l!=="none"&&(Wo(e,o,l,null,!1)?(l=e.stateNode,a.paired=l,l.paired=a,Yo(e,n.onShare)):Nt(e.child,!1)),t.delete(o),t.size===0)break}}}Mr(e)}e=e.sibling}}}function Dr(e){if(e.tag===30){var t=e.memoizedProps,n=Yt(t,e.stateNode),o=Xe!==null?Xe.get(n):void 0,a=Qt(t.default,o!==void 0?t.share:t.exit);a!=="none"&&(Wo(e,n,a,null,!1)?o!==void 0?(a=e.stateNode,o.paired=a,a.paired=o,Xe.delete(n),Yo(e,t.onShare)):Yo(e,t.onExit):Nt(e.child,!1)),Xe!==null&&Mr(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Dr(e),e=e.sibling;else Xe!==null&&Mr(e)}function Bp(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=Yt(t,e.stateNode);t=Qt(t.default,t.update),e.flags&=-5,t!=="none"&&Wo(e,n,t,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&Bp(e);e=e.sibling}}function Rr(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.stateNode;t.paired!==null&&(t.paired=null,Nt(e.child,!1))}Rr(e)}e=e.sibling}}function Ql(e){if(e.tag===30)e.stateNode.paired=null,Nt(e.child,!1),Rr(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ql(e),e=e.sibling;else Rr(e)}function Hp(e){for(e=e.child;e!==null;)e.tag===30?Nt(e.child,!1):(e.subtreeFlags&33554432)!==0&&Hp(e),e=e.sibling}function ju(e,t,n,o,a,l,c){for(var i=!1;t!==null;){if(t.tag===5){var r=t.stateNode;if(l!==null&&Ue<l.length){var d=l[Ue],v=Wr(r);(d.view||v.view)&&(i=!0);var g;if(g=(e.flags&4)===0)if(v.clip)g=!0;else{g=d.rect;var s=v.rect;g=g.y!==s.y||g.x!==s.x||g.height!==s.height||g.width!==s.width}g&&(e.flags|=4),v.abs?v=!d.abs:(d=d.rect,v=v.rect,v=d.height!==v.height||d.width!==v.width),v&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&yv(r,Ue===0?n:n+"_"+Ue,a),i&&(e.flags&4)!==0||(kt===null&&(kt=[]),kt.push(r,Ue===0?o:o+"_"+Ue,t.memoizedProps)),Ue++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c?e.flags|=t.flags&32:ju(e,t.child,n,o,a,l,c)&&(i=!0));t=t.sibling}return i}function qp(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,o=e.stateNode,a=Yt(n,o),l=Qt(n.default,n.update);if(t){o=o.clones;var c=o===null?null:o.map(o0)}else c=e.memoizedState,e.memoizedState=null;o=e;var i=e.child;Ue=0,a=ju(o,i,a,a,l,c,!1),(e.flags&4)!==0&&a&&(t||Yo(e,n.onUpdate))}else(e.subtreeFlags&33554432)!==0&&qp(e,t);e=e.sibling}}var fe=!1,L=!1,mt=!1,Hi=!1,rf=typeof WeakSet=="function"?WeakSet:Set,be=null,ht=!1,va=!1,yc=!1,Ur=!1;function Nh(e,t,n){if(e=e.containerInfo,Kr=Qo,e=Sb(e),bu(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var a=o.getSelection&&o.getSelection();if(a&&a.rangeCount!==0){o=a.anchorNode;var l=a.anchorOffset,c=a.focusNode;a=a.focusOffset;try{o.nodeType,c.nodeType}catch{o=null;break e}var i=0,r=-1,d=-1,v=0,g=0,s=e,p=null;t:for(;;){for(var y;s!==o||l!==0&&s.nodeType!==3||(r=i+l),s!==c||a!==0&&s.nodeType!==3||(d=i+a),s.nodeType===3&&(i+=s.nodeValue.length),(y=s.firstChild)!==null;)p=s,s=y;for(;;){if(s===e)break t;if(p===o&&++v===l&&(r=i),p===c&&++g===a&&(d=i),(y=s.nextSibling)!==null)break;s=p,p=s.parentNode}s=y}o=r===-1||d===-1?null:{start:r,end:d}}else o=null}o=o||{start:0,end:0}}else o=null;for(Jr={focusedElem:e,selectionRange:o},Qo=!1,n=(n&335544064)===n,be=t,t=n?9270:1024;be!==null;){if(e=be,n&&(o=e.deletions,o!==null))for(l=0;l<o.length;l++)n&&Dr(o[l]);if(e.alternate===null&&(e.flags&2)!==0)n&&lf(e),Ol(n);else{if(e.tag===22){if(o=e.alternate,e.memoizedState!==null){o!==null&&o.memoizedState===null&&n&&Dr(o),Ol(n);continue}else if(o!==null&&o.memoizedState!==null){n&&lf(e),Ol(n);continue}}o=e.child,(e.subtreeFlags&t)!==0&&o!==null?(o.return=e,be=o):(n&&Bp(e),Ol(n))}}Xe=null}function Ol(e){for(;be!==null;){var t=be,n=e,o=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if((a&1024)!==0&&o!==null){n=void 0,a=o.memoizedProps,o=o.memoizedState;var l=t.stateNode;try{var c=Kn(t.type,a);n=l.getSnapshotBeforeUpdate(c,o),l.__reactInternalSnapshotBeforeUpdate=n}catch(i){X(t,t.return,i)}}break;case 3:if((a&1024)!==0){if(o=t.stateNode.containerInfo,n=o.nodeType,n===9)$r(o);else if(n===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":$r(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&o!==null&&(n=Yt(o.memoizedProps,o.stateNode),a=t.memoizedProps,a=Qt(a.default,a.update),a!=="none"&&Wo(o,n,a,o.memoizedState=[],!0));break;default:if((a&1024)!==0)throw Error(h(163))}if(o=t.sibling,o!==null){o.return=t.return,be=o;break}be=t.return}}function Yp(e,t,n){var o=n.flags;switch(n.tag){case 0:case 11:case 15:yt(e,n),o&4&&Pa(5,n);break;case 1:if(yt(e,n),o&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){X(n,n.return,c)}else{var a=Kn(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){X(n,n.return,c)}}o&64&&Cp(n),o&512&&xt(n,n.return);break;case 3:if(yt(e,n),o&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{jb(e,t)}catch(c){X(n,n.return,c)}}break;case 27:t===null&&o&4&&Rp(n);case 26:case 5:yt(e,n),t===null&&o&4&&Ar(n),o&512&&xt(n,n.return);break;case 12:yt(e,n);break;case 31:yt(e,n),o&4&&Vp(e,n);break;case 13:yt(e,n),o&4&&Xp(e,n),o&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Lh.bind(null,n),y0(e,n))));break;case 22:if(o=n.memoizedState!==null||fe,!o){var l=t!==null&&t.memoizedState!==null||L;t=fe,a=L,fe=o,(L=l)&&!a?(o=2,(n.subtreeFlags&8772)!==0&&(o|=1),ut(e,n,o)):yt(e,n),fe=t,L=a}break;case 30:yt(e,n),o&512&&xt(n,n.return);break;case 7:o&512&&xt(n,n.return);default:yt(e,n)}}function Br(e,t){for(e=e.child;e!==null;)Lp(e,t),e=e.sibling}function Lp(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var o=n.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var a=e.stateNode,l=e.memoizedProps.style,c=l!=null&&l.hasOwnProperty("display")?l.display:null;a.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(r){X(e,e.return,r)}Hr(e,t);break;case 6:try{e.stateNode.nodeValue=t?"":e.memoizedProps,U=!0}catch(r){X(e,e.return,r)}break;case 18:try{var i=e.stateNode;t?Tf(i,!0):Tf(e.stateNode,!1)}catch(r){X(e,e.return,r)}break;case 22:case 23:e.memoizedState===null&&Br(e,t);break;default:Br(e,t)}}function Hr(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var n=e,o=t;switch(n.tag){case 4:Lp(n,o);break e;case 22:n.memoizedState===null&&Hr(n,o);break e;default:Hr(n,o)}}e=e.sibling}}function jp(e){var t=e.alternate;t!==null&&(e.alternate=null,jp(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Ac(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var P=null,De=!1;function rt(e,t,n){for(n=n.child;n!==null;)Gp(e,t,n),n=n.sibling}function Gp(e,t,n){if(Ke&&typeof Ke.onCommitFiberUnmount=="function")try{Ke.onCommitFiberUnmount(Za,n)}catch{}switch(n.tag){case 26:L||me(n,t),rt(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!L&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:L||me(n,t),Ea(n);var o=P,a=De;zn(n.type)&&(P=n.stateNode,De=!1),rt(e,t,n),Av(n.stateNode,n.type,n.memoizedProps),P=o,De=a;break;case 5:L||me(n,t),Ea(n);case 6:if(n.tag===6&&Ea(n),o=P,a=De,P=null,rt(e,t,n),P=o,De=a,P!==null)if(De)try{(P.nodeType===9?P.body:P.nodeName==="HTML"?P.ownerDocument.body:P).removeChild(n.stateNode),U=!0}catch(l){X(n,t,l)}else try{P.removeChild(n.stateNode),U=!0}catch(l){X(n,t,l)}break;case 18:P!==null&&(De?(e=P,Sf(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Zo(e)):Sf(P,n.stateNode));break;case 4:o=P,a=De,P=n.stateNode.containerInfo,De=!0,rt(e,t,n),P=o,De=a;break;case 0:case 11:case 14:case 15:Sn(2,n,t),L||Sn(4,n,t),rt(e,t,n);break;case 1:L||(me(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"&&Mp(n,t,o)),rt(e,t,n);break;case 21:rt(e,t,n);break;case 22:L=(o=L)||n.memoizedState!==null,rt(e,t,n),L=o;break;case 30:me(n,t),rt(e,t,n);break;case 7:L||me(n,t),rt(e,t,n);break;default:rt(e,t,n)}}function Vp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Zo(e)}catch(n){X(t,t.return,n)}}}function Xp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Zo(e)}catch(n){X(t,t.return,n)}}function Ah(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new rf),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new rf),t;default:throw Error(h(435,e.tag))}}function Nl(e,t){var n=Ah(e);t.forEach(function(o){if(!n.has(o)){n.add(o);var a=jh.bind(null,e,o);o.then(a,a)}})}function Ae(e,t,n){var o=t.deletions;if(o!==null)for(var a=0;a<o.length;a++){var l=o[a],c=e,i=t,r=i;e:for(;r!==null;){switch(r.tag){case 27:if(zn(r.type)){P=r.stateNode,De=!1;break e}break;case 5:P=r.stateNode,De=!1;break e;case 3:case 4:P=r.stateNode.containerInfo,De=!0;break e}r=r.return}if(P===null)throw Error(h(160));Gp(c,i,l),P=null,De=!1,c=l.alternate,c!==null&&(c.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Qp(t,e,n),t=t.sibling}var dt=null;function Qp(e,t,n){var o=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(o=e.updateQueue,o=o!==null?o.events:null,o!==null))for(var l=0;l<o.length;l++){var c=o[l];c.ref.impl=c.nextImpl}Ae(t,e,n),_e(e),a&4&&(Sn(3,e,e.return),Pa(3,e),Sn(5,e,e.return));break;case 1:Ae(t,e,n),_e(e),a&512&&(L||o===null||me(o,o.return)),a&64&&fe&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(l=dt,Ae(t,e,n),_e(e),a&512&&(L||o===null||me(o,o.return)),a&4)if(a=o!==null?o.memoizedState:null,n=e.memoizedState,o===null)if(n===null)if(e.stateNode===null)if(fe)e.stateNode=hv(e.type,e.memoizedProps,t.containerInfo,e);else{e:{t=e.type,n=e.memoizedProps,a=l.ownerDocument||l;t:switch(t){case"title":o=a.getElementsByTagName("title")[0],(!o||o[Fa]||o[he]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(t),a.head.insertBefore(o,a.querySelector("head > title"))),we(o,t,n),o[he]=e,pe(o),t=o;break e;case"link":if(l=Mf("link","href",a).get(t+(n.href||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){l.splice(c,1);break t}}o=a.createElement(t),we(o,t,n),a.head.appendChild(o);break;case"meta":if(l=Mf("meta","content",a).get(t+(n.content||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){l.splice(c,1);break t}}o=a.createElement(t),we(o,t,n),a.head.appendChild(o);break;default:throw Error(h(468,t))}o[he]=e,pe(o),t=o}e.stateNode=t}else fe||eu(l,e.type,e.stateNode);else e.stateNode=Cf(l,n,e.memoizedProps);else a!==n?(a===null?(t=o.stateNode,t===null||L||t.parentNode.removeChild(t)):a.count--,n===null?fe||eu(l,e.type,e.stateNode):Cf(l,n,e.memoizedProps)):n===null&&e.stateNode!==null&&Ui(e,e.memoizedProps,o.memoizedProps);break;case 27:Ae(t,e,n),_e(e),a&512&&(L||o===null||me(o,o.return)),o!==null&&a&4&&Ui(e,e.memoizedProps,o.memoizedProps);break;case 5:if(l=mt,mt=!1,Ae(t,e,n),mt=l,_e(e),a&512&&(L||o===null||me(o,o.return)),e.flags&32){t=e.stateNode;try{Bo(t,""),U=!0}catch(v){X(e,e.return,v)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Ui(e,t,o!==null?o.memoizedProps:t)),a&1024&&(Hi=!0);break;case 6:if(Ae(t,e,n),_e(e),a&4){if(e.stateNode===null)throw Error(h(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,U=!0}catch(v){X(e,e.return,v)}}break;case 3:if(U=!1,Fl=null,l=dt,dt=ja(t.containerInfo),Ae(t,e,n),dt=l,_e(e),a&4&&o!==null&&o.memoizedState.isDehydrated)try{Zo(t.containerInfo)}catch(v){X(e,e.return,v)}Hi&&(Hi=!1,Zp(e)),U=!1;break;case 4:a=mt,mt=fe,o=bs(),l=dt,dt=ja(e.stateNode.containerInfo),Ae(t,e,n),_e(e),dt=l,U&&va&&(yc=!0),U=o,mt=a;break;case 12:Ae(t,e,n),_e(e);break;case 31:Ae(t,e,n),_e(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Nl(e,t)));break;case 13:Ae(t,e,n),_e(e),e.child.flags&8192&&e.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(Gc=Ze()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Nl(e,t)));break;case 22:l=e.memoizedState!==null,c=o!==null&&o.memoizedState!==null;var i=fe,r=L,d=mt;fe=i||l,mt=d||l,L=r||c,Ae(t,e,n),L=r,mt=d,fe=i,_e(e),a&8192&&(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,!l||o===null||c||fe||L||(t=c||L,n=fe,o=L,fe=l||fe,L=t,Pt(e,2),fe=n,L=o),!l&&mt||Br(e,l)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Nl(e,n))));break;case 19:Ae(t,e,n),_e(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Nl(e,t)));break;case 30:a&512&&(L||o===null||me(o,o.return)),a=bs(),l=va,c=(n&335544064)===n,i=e.memoizedProps,va=c&&Qt(i.default,i.update)!=="none",Ae(t,e,n),_e(e),c&&o!==null&&U&&(e.flags|=4),va=l,U=a;break;case 21:break;case 7:a&512&&(L||o===null||me(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=e);default:Ae(t,e,n),_e(e)}}function _e(e){var t=e.flags;if(t&2){try{for(var n,o=e.return;o!==null;){if(Dp(o)){n=o;break}o=o.return}o=null;for(var a=e.return;a!==null;){if(Lu(a)){var l=a.stateNode;o===null?o=[l]:o.push(l)}if(Yu(a))break;a=a.return}var c=o;if(n==null)throw Error(h(160));switch(n.tag){case 27:var i=n.stateNode,r=Bi(e);mc(e,r,i,c);break;case 5:var d=n.stateNode;n.flags&32&&(Bo(d,""),n.flags&=-33);var v=Bi(e);mc(e,v,d,c);break;case 3:case 4:var g=n.stateNode.containerInfo,s=Bi(e);_r(e,s,g,c);break;default:throw Error(h(161))}}catch(p){X(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Zp(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Zp(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,Qo=!0,t.reset(),Qo=!1),e=e.sibling}}function io(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Kp(t,e),t=t.sibling;else qp(t,!1)}function Kp(e,t){var n=e.alternate;if(n===null)Cr(e,!1);else switch(e.tag){case 3:if(Ur=ht=!1,cf(),io(t,e),!ht&&!yc){if(e=kt,e!==null)for(var o=0;o<e.length;o+=3){n=e[o];var a=e[o+1];xv(n,e[o+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+a+")"})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Ur=!0}kt=null;break;case 5:io(t,e);break;case 4:o=ht,ht=!1,io(t,e),ht&&(yc=!0),ht=o;break;case 22:e.memoizedState===null&&(n.memoizedState!==null?Cr(e,!1):io(t,e));break;case 30:o=ht,a=cf(),ht=!1,io(t,e),ht&&(e.flags|=4);var l=e.memoizedProps,c=e.stateNode;t=Yt(l,c),c=Yt(n.memoizedProps,c);var i=Qt(l.default,l.update);i==="none"?t=!1:(l=n.memoizedState,n.memoizedState=null,n=e.child,Ue=0,t=ju(e,n,t,c,i,l,!0),Ue!==(l===null?0:l.length)&&(e.flags|=32)),(e.flags&4)!==0&&t?(Yo(e,e.memoizedProps.onUpdate),kt=a):a!==null&&(a.push.apply(a,kt),kt=a),ht=(e.flags&32)!==0?!0:o;break;default:io(t,e)}}function yt(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Yp(e,t.alternate,t),t=t.sibling}function Pt(e,t){for(e=e.child;e!==null;){var n=e,o=t;switch(n.tag){case 0:case 11:case 14:case 15:Sn(4,n,n.return),Pt(n,o);break;case 1:me(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Mp(n,n.return,a),Pt(n,o);break;case 27:(o&2)!==0&&Av(n.stateNode,n.type,n.memoizedProps);case 5:me(n,n.return),n.tag!==5&&n.tag!==27||Ea(n),Pt(n,o);break;case 6:Ea(n);break;case 26:me(n,n.return),a=n.stateNode,n.memoizedState!==null||a===null||L||a.parentNode.removeChild(a),Pt(n,o);break;case 22:n.memoizedState===null&&Pt(n,o);break;case 30:me(n,n.return),Pt(n,o);break;case 7:me(n,n.return);default:Pt(n,o)}e=e.sibling}}function ut(e,t,n){for(n=(t.subtreeFlags&8772)!==0?n:n&-2,t=t.child;t!==null;){var o=t.alternate,a=e,l=t,c=l.flags,i=(n&1)!==0;switch(l.tag){case 0:case 11:case 15:ut(a,l,n),Pa(4,l);break;case 1:if(ut(a,l,n),o=l,a=o.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(v){X(o,o.return,v)}if(o=l,a=o.updateQueue,a!==null){var r=o.stateNode;try{var d=a.shared.hiddenCallbacks;if(d!==null)for(a.shared.hiddenCallbacks=null,a=0;a<d.length;a++)Lb(d[a],r)}catch(v){X(o,o.return,v)}}i&&c&64&&Cp(l),xt(l,l.return);break;case 27:(n&2)!==0&&Rp(l);case 5:l.tag!==5&&l.tag!==27||af(l),ut(a,l,n),i&&o===null&&c&4&&Ar(l),xt(l,l.return);break;case 6:af(l);break;case 26:r=l.stateNode,l.memoizedState!==null||r===null||fe||eu(ja(r.ownerDocument),l.type,r),ut(a,l,n),i&&o===null&&c&4&&Ar(l),xt(l,l.return);break;case 12:ut(a,l,n);break;case 31:ut(a,l,n),i&&c&4&&Vp(a,l);break;case 13:ut(a,l,n),i&&c&4&&Xp(a,l);break;case 22:l.memoizedState===null&&ut(a,l,n),xt(l,l.return);break;case 30:ut(a,l,n),xt(l,l.return);break;case 7:xt(l,l.return);default:ut(a,l,n)}t=t.sibling}}function Gu(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&$a(n))}function Vu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&$a(e))}function Pe(e,t,n,o){var a=(n&335544064)===n;if(t.subtreeFlags&(a?10262:10256))for(t=t.child;t!==null;)Jp(e,t,n,o),t=t.sibling;else a&&Hp(t)}function Jp(e,t,n,o){var a=(n&335544064)===n;a&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&Ql(t);var l=t.flags;switch(t.tag){case 0:case 11:case 15:Pe(e,t,n,o),l&2048&&Pa(9,t);break;case 1:Pe(e,t,n,o);break;case 3:Pe(e,t,n,o),a&&Ur&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),l&2048&&(l=null,t.alternate!==null&&(l=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==l&&(t.refCount++,l!=null&&$a(l)));break;case 12:if(l&2048){Pe(e,t,n,o),l=t.stateNode;try{var c=t.memoizedProps,i=c.id,r=c.onPostCommit;typeof r=="function"&&r(i,t.alternate===null?"mount":"update",l.passiveEffectDuration,-0)}catch(d){X(t,t.return,d)}}else Pe(e,t,n,o);break;case 31:Pe(e,t,n,o);break;case 13:Pe(e,t,n,o);break;case 23:break;case 22:c=t.stateNode,i=t.alternate,t.memoizedState!==null?(a&&i!==null&&i.memoizedState===null&&Ql(i),c._visibility&2?Pe(e,t,n,o):za(e,t)):(a&&i!==null&&i.memoizedState!==null&&Ql(t),c._visibility&2?Pe(e,t,n,o):(c._visibility|=2,uo(e,t,n,o,(t.subtreeFlags&10256)!==0||!1))),l&2048&&Gu(i,t);break;case 24:Pe(e,t,n,o),l&2048&&Vu(t.alternate,t);break;case 30:a&&(l=t.alternate,l!==null&&(Nt(l.child,!0),Nt(t.child,!0))),Pe(e,t,n,o);break;default:Pe(e,t,n,o)}}function uo(e,t,n,o,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var l=e,c=t,i=n,r=o,d=c.flags;switch(c.tag){case 0:case 11:case 15:uo(l,c,i,r,a),Pa(8,c);break;case 23:break;case 22:var v=c.stateNode;c.memoizedState!==null?v._visibility&2?uo(l,c,i,r,a):za(l,c):(v._visibility|=2,uo(l,c,i,r,a)),a&&d&2048&&Gu(c.alternate,c);break;case 24:uo(l,c,i,r,a),a&&d&2048&&Vu(c.alternate,c);break;default:uo(l,c,i,r,a)}t=t.sibling}}function za(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,o=t,a=o.flags;switch(o.tag){case 22:za(n,o),a&2048&&Gu(o.alternate,o);break;case 24:za(n,o),a&2048&&Vu(o.alternate,o);break;default:za(n,o)}t=t.sibling}}var Dn=8192;function _n(e,t,n){if(e.subtreeFlags&Dn)for(e=e.child;e!==null;)Fp(e,t,n),e=e.sibling}function Fp(e,t,n){switch(e.tag){case 26:_n(e,t,n),e.flags&Dn&&(e.memoizedState!==null?D0(n,dt,e.memoizedState,e.memoizedProps):(e=e.stateNode,(t&335544128)===t&&Rf(n,e)));break;case 5:_n(e,t,n),e.flags&Dn&&(e=e.stateNode,(t&335544128)===t&&Rf(n,e));break;case 3:case 4:var o=dt;dt=ja(e.stateNode.containerInfo),_n(e,t,n),dt=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=Dn,Dn=16777216,_n(e,t,n),Dn=o):_n(e,t,n));break;case 30:if((e.flags&Dn)!==0&&(o=e.memoizedProps.name,o!=null&&o!=="auto")){var a=e.stateNode;a.paired=null,Xe===null&&(Xe=new Map),Xe.set(o,a)}_n(e,t,n);break;default:_n(e,t,n)}}function Wp(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function ra(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];be=o,Ip(o,e)}Wp(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)$p(e),e=e.sibling}function $p(e){switch(e.tag){case 0:case 11:case 15:ra(e),e.flags&2048&&Sn(9,e,e.return);break;case 3:ra(e);break;case 12:ra(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Zl(e)):ra(e);break;default:ra(e)}}function Zl(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];be=o,Ip(o,e)}Wp(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Sn(8,t,t.return),Zl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Zl(t));break;default:Zl(t)}e=e.sibling}}function Ip(e,t){for(;be!==null;){var n=be;switch(n.tag){case 0:case 11:case 15:Sn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var o=n.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:$a(n.memoizedState.cache)}if(o=n.child,o!==null)o.return=n,be=o;else e:for(n=e;be!==null;){o=be;var a=o.sibling,l=o.return;if(jp(o),o===n){be=null;break e}if(a!==null){a.return=l,be=a;break e}be=l}}}var _h={getCacheForType:function(e){var t=ye(ce),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return ye(ce).controller.signal}},Ch=typeof WeakMap=="function"?WeakMap:Map,q=0,Z=null,M=null,D=0,G=0,je=null,cn=!1,$o=!1,Xu=!1,Vt=0,ne=0,Tn=0,Ln=0,xc=0,Qe=0,qo=0,Oa=null,Re=null,qr=!1,Gc=0,Pp=0,kc=1/0,wc=null,gn=null,ee=0,ft=null,Jn=null,Ot=0,Yr=0,Lr=null,ev=null,Co=null,Mo=null,Do=null,Na=0,Kl=null;function Fe(){return(q&2)!==0&&D!==0?D&-D:z.T!==null?Zu():ab()}function tv(){if(Qe===0)if((D&536870912)===0||_){var e=vl;vl<<=1,(vl&3932160)===0&&(vl=262144),Qe=e}else Qe=536870912;return e=Se.current,e!==null&&(e.flags|=32),Qe}function Yo(e,t){if(t!=null){var n=e.stateNode,o=n.ref;o===null&&(o=n.ref=wv(Yt(e.memoizedProps,n))),Mo===null&&(Mo=[]),Mo.push(t.bind(null,o))}}function He(e,t,n){(e===Z&&(G===2||G===9)||e.cancelPendingCommit!==null)&&(Lo(e,0),rn(e,D,Qe,!1)),Ja(e,n),((q&2)===0||e!==Z)&&(e===Z&&((q&2)===0&&(Ln|=n),ne===4&&rn(e,D,Qe,!1)),_t(e))}function nv(e,t,n){if((q&6)!==0)throw Error(h(327));var o=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Ka(e,t),a=o?Rh(e,t):qi(e,t,!0),l=o;do{if(a===0){$o&&!o&&rn(e,t,0,!1);break}else{if(n=e.current.alternate,l&&!Mh(n)){a=qi(e,t,!1),l=!1;continue}if(a===2){if(l=t,e.errorRecoveryDisabledLanes&l)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var i=e;a=Oa;var r=i.current.memoizedState.isDehydrated;if(r&&(Lo(i,c).flags|=256),c=qi(i,c,!1),c!==2&&c!==6){if(Xu&&!r){i.errorRecoveryDisabledLanes|=l,Ln|=l,a=4;break e}l=Re,Re=a,l!==null&&(Re===null?Re=l:Re.push.apply(Re,l))}a=c}if(l=!1,a!==2)continue}}if(a===1){Lo(e,0),rn(e,t,0,!0);break}e:{switch(o=e,l=a,l){case 0:case 1:throw Error(h(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:rn(o,t,Qe,!cn);break e;case 2:Re=null;break;case 3:case 5:break;default:throw Error(h(329))}if((t&62914560)===t&&(a=Gc+300-Ze(),10<a)){if(rn(o,t,Qe,!cn),Nc(o,0,!0)!==0)break e;Ot=t,o.timeoutHandle=Ju(uf.bind(null,o,n,Re,wc,qr,t,Qe,Ln,qo,cn,l,"Throttled",-0,0),a);break e}uf(o,n,Re,wc,qr,t,Qe,Ln,qo,cn,l,null,-0,0)}}break}while(!0);_t(e)}function uf(e,t,n,o,a,l,c,i,r,d,v,g,s,p){e.timeoutHandle=-1;var y=t.subtreeFlags,k=(l&335544064)===l;if(g=null,(k||y&8192||(y&16785408)===16785408)&&(g={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:St},Xe=null,Fp(t,l,g),k&&(y=g,k=e.containerInfo,k=(k.nodeType===9?k:k.ownerDocument).__reactViewTransition,k!=null&&(y.count++,y.waitingForViewTransition=!0,y=Ga.bind(y),k.finished.then(y,y))),y=(l&62914560)===l?Gc-Ze():(l&4194048)===l?Pp-Ze():0,y=R0(g,y),y!==null)){Ot=l,e.cancelPendingCommit=y(sf.bind(null,e,t,l,n,o,a,c,i,r,d,v,g,null,s,p)),rn(e,l,c,!d);return}sf(e,t,l,n,o,a,c,i,r,d,v,g)}function Mh(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var o=0;o<n.length;o++){var a=n[o],l=a.getSnapshot;a=a.value;try{if(!We(l(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function rn(e,t,n,o){t=Pf(e,t),t&=~xc,t&=~Ln,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var a=t;0<a;){var l=31-Je(a),c=1<<l;o[l]=-1,a&=~c}n!==0&&tb(e,n,t)}function Vc(){return(q&6)===0?(el(0,!1),!1):!0}function Qu(){if(M!==null){if(G===0)var e=M.return;else e=M,Ut=Pn=null,Nu(e),No=null,Ua=0,e=M;for(;e!==null;)_p(e.alternate,e),e=e.return;M=null}}function Lo(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,e0(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Ot=0,Qu(),Z=e,M=n=Bt(e.current,null),D=t,G=0,je=null,cn=!1,$o=Ka(e,t),Xu=!1,qo=Qe=xc=Ln=Tn=ne=0,Re=Oa=null,qr=!1,Vt=Pf(e,t),Dc(),n}function ov(e,t){A=null,z.H=pc,t===Fo||t===Bc?(t=Us(),G=3):t===xu?(t=Us(),G=4):G=t===Bu?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,je=t,M===null&&(ne=1,vc(e,at(t,e.current)))}function av(){var e=Se.current;return e===null?!0:(D&4194048)===D?ze===null:(D&62914560)===D||(D&536870912)!==0?e===ze:!1}function lv(){var e=z.H;return z.H=pc,e===null?pc:e}function cv(){var e=z.A;return z.A=_h,e}function Sc(){ne=4,cn||(D&4194048)!==D&&Se.current!==null||($o=!0),(Tn&134217727)===0&&(Ln&134217727)===0||Z===null||rn(Z,D,Qe,!1)}function qi(e,t,n){var o=q;q|=2;var a=lv(),l=cv();(Z!==e||D!==t)&&(wc=null,Lo(e,t)),t=!1;var c=ne;e:do try{if(G!==0&&M!==null){var i=M,r=je;switch(G){case 8:Qu(),c=6;break e;case 3:case 2:case 9:case 6:Se.current===null&&(t=!0);var d=G;if(G=0,je=null,So(e,i,r,d),n&&$o){c=0;break e}break;default:d=G,G=0,je=null,So(e,i,r,d)}}Dh(),c=ne;break}catch(v){ov(e,v)}while(!0);return t&&e.shellSuspendCounter++,Ut=Pn=null,q=o,z.H=a,z.A=l,M===null&&(Z=null,D=0,Dc()),c}function Dh(){for(;M!==null;)iv(M)}function Rh(e,t){var n=q;q|=2;var o=lv(),a=cv();Z!==e||D!==t?(wc=null,kc=Ze()+500,Lo(e,t)):$o=Ka(e,t);e:do try{if(G!==0&&M!==null){t=M;var l=je;t:switch(G){case 1:G=0,je=null,So(e,t,l,1);break;case 2:case 9:if(Rs(l)){G=0,je=null,df(t);break}t=function(){G!==2&&G!==9||Z!==e||(G=7),_t(e)},l.then(t,t);break e;case 3:G=7;break e;case 4:G=5;break e;case 7:Rs(l)?(G=0,je=null,df(t)):(G=0,je=null,So(e,t,l,7));break;case 5:var c=null;switch(M.tag){case 26:c=M.memoizedState;case 5:case 27:var i=M;if(c?Mv(c):i.stateNode.complete){G=0,je=null;var r=i.sibling;if(r!==null)M=r;else{var d=i.return;d!==null?(M=d,Xc(d)):M=null}break t}}G=0,je=null,So(e,t,l,5);break;case 6:G=0,je=null,So(e,t,l,6);break;case 8:Qu(),ne=6;break e;default:throw Error(h(462))}}Uh();break}catch(v){ov(e,v)}while(!0);return Ut=Pn=null,z.H=o,z.A=a,q=n,M!==null?0:(Z=null,D=0,Dc(),ne)}function Uh(){for(;M!==null&&!Ig();)iv(M)}function iv(e){var t=Ap(e.alternate,e,Vt);e.memoizedProps=e.pendingProps,t===null?Xc(e):M=t}function df(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=$s(n,t,t.pendingProps,t.type,void 0,D);break;case 11:t=$s(n,t,t.pendingProps,t.type.render,t.ref,D);break;case 5:Nu(t);var o=t;o===ve&&(_?(ic(o),o.tag===5&&o.stateNode!=null&&(W=o.stateNode)):(ic(o),_=!0));default:_p(n,t),t=M=Cb(t,Vt),t=Ap(n,t,Vt)}e.memoizedProps=e.pendingProps,t===null?Xc(e):M=t}function So(e,t,n,o){Ut=Pn=null,Nu(t),No=null,Ua=0;var a=t.return;try{if(wh(e,a,t,n,D)){ne=1,vc(e,at(n,e.current)),M=null;return}}catch(l){if(a!==null)throw M=a,l;ne=1,vc(e,at(n,e.current)),M=null;return}t.flags&32768?(_||o===1?e=!0:$o||(D&536870912)!==0?e=!1:(cn=e=!0,(o===2||o===9||o===3||o===6)&&(o=Se.current,o!==null&&o.tag===13&&(o.flags|=16384))),rv(t,e)):Xc(t)}function Xc(e){var t=e;do{if((t.flags&32768)!==0){rv(t,cn);return}e=t.return;var n=zh(t.alternate,t,Vt);if(n!==null){M=n;return}if(t=t.sibling,t!==null){M=t;return}M=t=e}while(t!==null);ne===0&&(ne=5)}function rv(e,t){do{var n=Oh(e.alternate,e);if(n!==null){n.flags&=32767,M=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){M=e;return}M=e=n}while(e!==null);ne=6,M=null}function sf(e,t,n,o,a,l,c,i,r,d,v,g){e.cancelPendingCommit=null;do Qc();while(ee!==0);if((q&6)!==0)throw Error(h(327));if(t!==null){if(t===e.current)throw Error(h(177));e===Z&&(M=Z=null,D=0),Jn=t,ft=e,Ot=n,Lr=a,ev=o,Bh(e,t,n,c,i,r,g)}}function Bh(e,t,n,o,a,l,c){var i=t.lanes|t.childLanes;if(Yr=i,i|=pu,rm(e,n,i,o,a,l),Mo=null,(n&335544064)===n?(Do=dh(e),o=10262):(Do=null,o=10256),(t.subtreeFlags&o)!==0||(t.flags&o)!==0?(e.callbackNode=null,e.callbackPriority=0,Gh(nc,function(){return Xr(),null})):(e.callbackNode=null,e.callbackPriority=0),hc=!1,o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=z.T,z.T=null,a=Y.p,Y.p=2,l=q,q|=4;try{Nh(e,t,n)}finally{q=l,Y.p=a,z.T=o}}ee=1,hc?Co=c0(c,e.containerInfo,Do,jr,Gr,qh,Vr,Xr,Hh,null,null):(jr(),Gr(),Vr())}function Hh(e){if(ee!==0){var t=ft.onRecoverableError;t(e,{componentStack:null})}}function qh(){ee===3&&(ee=0,Kp(Jn,ft),ee=4)}function jr(){if(ee===1){ee=0;var e=ft,t=Jn,n=Ot,o=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||o){o=z.T,z.T=null;var a=Y.p;Y.p=2;var l=q;q|=4;try{va=yc=!1,Qp(t,e,n),n=Jr;var c=Sb(e.containerInfo),i=n.focusedElem,r=n.selectionRange;if(c!==i&&i&&i.ownerDocument&&wb(i.ownerDocument.documentElement,i)){if(r!==null&&bu(i)){var d=r.start,v=r.end;if(v===void 0&&(v=d),"selectionStart"in i)i.selectionStart=d,i.selectionEnd=Math.min(v,i.value.length);else{var g=i.ownerDocument||document,s=g&&g.defaultView||window;if(s.getSelection){var p=s.getSelection(),y=i.textContent.length,k=Math.min(r.start,y),T=r.end===void 0?k:Math.min(r.end,y);!p.extend&&k>T&&(c=T,T=k,k=c);var b=zs(i,k),u=zs(i,T);if(b&&u&&(p.rangeCount!==1||p.anchorNode!==b.node||p.anchorOffset!==b.offset||p.focusNode!==u.node||p.focusOffset!==u.offset)){var f=g.createRange();f.setStart(b.node,b.offset),p.removeAllRanges(),k>T?(p.addRange(f),p.extend(u.node,u.offset)):(f.setEnd(u.node,u.offset),p.addRange(f))}}}}for(g=[],p=i;p=p.parentNode;)p.nodeType===1&&g.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof i.focus=="function"&&i.focus(),i=0;i<g.length;i++){var m=g[i];m.element.scrollLeft=m.left,m.element.scrollTop=m.top}}Qo=!!Kr,Jr=Kr=null}finally{q=l,Y.p=a,z.T=o}}e.current=t,ee=2}}function Gr(){if(ee===2){ee=0;var e=ft,t=Jn,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=z.T,z.T=null;var o=Y.p;Y.p=2;var a=q;q|=4;try{Yp(e,t.alternate,t)}finally{q=a,Y.p=o,z.T=n}}ee=3}}function Vr(){if(ee===4||ee===3){ee=0;var e=Co;Co=null,Pg();var t=ft,n=Jn,o=Ot,a=ev,l=(o&335544064)===o?10262:10256;if((n.subtreeFlags&l)!==0||(n.flags&l)!==0?ee=5:(ee=0,Jn=ft=null,uv(t,t.pendingLanes)),l=t.pendingLanes,l===0&&(gn=null),iu(o),n=n.stateNode,Ke&&typeof Ke.onCommitFiberRoot=="function")try{Ke.onCommitFiberRoot(Za,n,void 0,(n.current.flags&128)===128)}catch{}if(a!==null){n=z.T,l=Y.p,Y.p=2,z.T=null;try{for(var c=t.onRecoverableError,i=0;i<a.length;i++){var r=a[i];c(r.value,{componentStack:r.stack})}}finally{z.T=n,Y.p=l}}if(a=Mo,c=Do,Do=null,a!==null&&(Mo=null,c===null&&(c=[]),e!==null))for(r=0;r<a.length;r++)n=(0,a[r])(c),n!==void 0&&e.finished.finally(n);(Ot&3)!==0&&Qc(),_t(t),l=t.pendingLanes,(o&261930)!==0&&(l&42)!==0?t===Kl?Na++:(Na=0,Kl=t):(Na=0,Kl=null),el(0,!1)}}function uv(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,$a(t)))}function Qc(){return Co!==null&&(Co.skipTransition(),Co=null),jr(),Gr(),Vr(),Xr()}function Xr(){if(ee!==5)return!1;var e=ft,t=Yr;Yr=0;var n=iu(Ot),o=z.T,a=Y.p;try{Y.p=32>n?32:n,z.T=null,n=Lr,Lr=null;var l=ft,c=Ot;if(ee=0,Jn=ft=null,Ot=0,(q&6)!==0)throw Error(h(331));var i=q;if(q|=4,$p(l.current),Jp(l,l.current,c,n),q=i,el(0,!1),Ke&&typeof Ke.onPostCommitFiberRoot=="function")try{Ke.onPostCommitFiberRoot(Za,l)}catch{}return!0}finally{Y.p=a,z.T=o,uv(e,t)}}function ff(e,t,n){t=at(n,t),t=Sr(e.stateNode,t,2),e=bn(e,t,2),e!==null&&(Ja(e,2),_t(e))}function X(e,t,n){if(e.tag===3)ff(e,e,n);else for(;t!==null;){if(t.tag===3){ff(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(gn===null||!gn.has(o))){e=at(n,e),n=Tp(2),o=bn(t,n,2),o!==null&&(Ep(n,o,t,e),Ja(o,2),_t(o));break}}t=t.return}}function Yi(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new Ch;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(n)||(Xu=!0,a.add(n),e=Yh.bind(null,e,t,n),t.then(e,e))}function Yh(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Z===e&&(D&n)===n&&((ne===4||ne===3&&(D&62914560)===D&&300>Ze()-Gc)&&(q&2)===0?Lo(e,0):xc|=n,qo===D&&(qo=0)),_t(e)}function dv(e,t){t===0&&(t=eb()),e=In(e,t),e!==null&&(Ja(e,t),_t(e))}function Lh(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),dv(e,n)}function jh(e,t){var n=0;switch(e.tag){case 31:case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(h(314))}o!==null&&o.delete(t),dv(e,n)}function Gh(e,t){return lu(e,t)}var jo=null,so=null,Qr=!1,Tc=!1,Li=!1,un=0;function _t(e){e!==so&&e.next===null&&(so===null?jo=so=e:so=so.next=e),Tc=!0,Qr||(Qr=!0,Xh())}function el(e,t){if(!Li&&Tc){Li=!0;do for(var n=!1,o=jo;o!==null;){if(!t)if(e!==0){var a=o.pendingLanes;if(a===0)var l=0;else{var c=o.suspendedLanes,i=o.pingedLanes;l=(1<<31-Je(42|e)+1)-1,l&=a&~(c&~i),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(n=!0,bf(o,l))}else l=D,l=Nc(o,o===Z?l:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(l&3)===0||Ka(o,l)||(n=!0,bf(o,l));o=o.next}while(n);Li=!1}}function Vh(){sv()}function sv(){Tc=Qr=!1;var e=0;un!==0&&Ph()&&(e=un);for(var t=Ze(),n=null,o=jo;o!==null;){var a=o.next,l=fv(o,t);l===0?(o.next=null,n===null?jo=a:n.next=a,a===null&&(so=n)):(n=o,(e!==0||(l&3)!==0)&&(Tc=!0)),o=a}ee!==0&&ee!==5||el(e,!1),un!==0&&(un=0)}function fv(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var c=31-Je(l),i=1<<c,r=a[c];r===-1?((i&n)===0||(i&o)!==0)&&(a[c]=im(i,t)):r<=t&&(e.expiredLanes|=i),l&=~i}if(t=Z,n=D,n=Nc(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,n===0||e===t&&(G===2||G===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&hi(o),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Ka(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(o!==null&&hi(o),iu(n)){case 2:case 8:n=$f;break;case 32:n=nc;break;case 268435456:n=If;break;default:n=nc}return o=bv.bind(null,e),n=lu(n,o),e.callbackPriority=t,e.callbackNode=n,t}return o!==null&&o!==null&&hi(o),e.callbackPriority=2,e.callbackNode=null,2}function bv(e,t){if(ee!==0&&ee!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Qc()&&e.callbackNode!==n)return null;var o=D;return o=Nc(e,e===Z?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(nv(e,o,t),fv(e,Ze()),e.callbackNode!=null&&e.callbackNode===n?bv.bind(null,e):null)}function bf(e,t){if(Qc())return null;nv(e,t,!0)}function Xh(){t0(function(){(q&6)!==0?lu(Wf,Vh):sv()})}function Zu(){if(un===0){var e=Xn;e===0&&(e=pl,pl<<=1,(pl&261888)===0&&(pl=256)),un=e}return un}function pf(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Ul(e)}function Qh(e,t,n,o,a){if(t==="submit"&&n&&n.stateNode===a){var l=pf((a[Ye]||null).action),c=o.submitter;c&&(t=(t=c[Ye]||null)?pf(t.formAction):c.getAttribute("formAction"),t!==null&&(l=t,c=null));var i=new _c("action","action",null,o,a);e.push({event:i,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(un!==0){var r=new FormData(a,c);kr(n,{pending:!0,data:r,method:a.method,action:l},null,r)}}else typeof l=="function"&&(i.preventDefault(),r=new FormData(a,c),kr(n,{pending:!0,data:r,method:a.method,action:l},l,r))},currentTarget:a}]})}}for(Al=0;Al<dr.length;Al++)_l=dr[Al],vf=_l.toLowerCase(),gf=_l[0].toUpperCase()+_l.slice(1),bt(vf,"on"+gf);var _l,vf,gf,Al;bt(Eb,"onAnimationEnd");bt(zb,"onAnimationIteration");bt(Ob,"onAnimationStart");bt("dblclick","onDoubleClick");bt("focusin","onFocus");bt("focusout","onBlur");bt(nh,"onTransitionRun");bt(oh,"onTransitionStart");bt(ah,"onTransitionCancel");bt(Nb,"onTransitionEnd");Uo("onMouseEnter",["mouseout","mouseover"]);Uo("onMouseLeave",["mouseout","mouseover"]);Uo("onPointerEnter",["pointerout","pointerover"]);Uo("onPointerLeave",["pointerout","pointerover"]);Wn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Wn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Wn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Wn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Wn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Wn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var qa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Zh=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(qa));function pv(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],a=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var c=o.length-1;0<=c;c--){var i=o[c],r=i.instance,d=i.currentTarget;if(i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(v){ac(v)}a.currentTarget=null,l=r}else for(c=0;c<o.length;c++){if(i=o[c],r=i.instance,d=i.currentTarget,i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(v){ac(v)}a.currentTarget=null,l=r}}}}function C(e,t){var n=t[us];n===void 0&&(n=t[us]=new Set);var o=e+"__bubble";n.has(o)||(vv(t,e,2,!1),n.add(o))}function ji(e,t,n){var o=0;t&&(o|=4),vv(n,e,o,t)}var Cl="_reactListening"+Math.random().toString(36).slice(2);function Ku(e){if(!e[Cl]){e[Cl]=!0,cb.forEach(function(n){n!=="selectionchange"&&(Zh.has(n)||ji(n,!1,e),ji(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Cl]||(t[Cl]=!0,ji("selectionchange",!1,t))}}function vv(e,t,n,o){switch(Yv(t)){case 2:var a=q0;break;case 8:a=Y0;break;default:a=ed}n=a.bind(null,t,n,e),a=void 0,!cr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function Gi(e,t,n,o,a){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var i=o.stateNode.containerInfo;if(i===a)break;if(c===4)for(c=o.return;c!==null;){var r=c.tag;if((r===3||r===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;i!==null;){if(c=Rn(i),c===null)return;if(r=c.tag,r===5||r===6||r===26||r===27){o=l=c;continue e}i=i.parentNode}}o=o.return}pb(function(){var d=l,v=uu(n),g=[];e:{var s=Ab.get(e);if(s!==void 0){var p=_c,y=e;switch(e){case"keypress":if(Hl(n)===0)break e;case"keydown":case"keyup":p=Mm;break;case"focusin":y="focus",p=Ti;break;case"focusout":y="blur",p=Ti;break;case"beforeblur":case"afterblur":p=Ti;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=ms;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=xm;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Hm;break;case Eb:case zb:case Ob:p=Sm;break;case Nb:p=Ym;break;case"scroll":case"scrollend":p=hm;break;case"wheel":p=jm;break;case"copy":case"cut":case"paste":p=Em;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=ys;break;case"submit":p=Um;break;case"toggle":case"beforetoggle":p=Vm}var k=(t&4)!==0,T=!k&&(e==="scroll"||e==="scrollend"),b=k?s!==null?s+"Capture":null:s;k=[];for(var u=d,f;u!==null;){var m=u;if(f=m.stateNode,m=m.tag,m!==5&&m!==26&&m!==27||f===null||b===null||(m=_a(u,b),m!=null&&k.push(Ya(u,m,f))),T)break;u=u.return}0<k.length&&(s=new p(s,y,null,n,v),g.push({event:s,listeners:k}))}}if((t&7)===0){e:{if(p=e==="mouseover"||e==="pointerover",s=e==="mouseout"||e==="pointerout",p&&n!==lr&&(y=n.relatedTarget||n.fromElement)&&(Rn(y)||y[Ko]))break e;(s||p)&&(y=v.window===v?v:(p=v.ownerDocument)?p.defaultView||p.parentWindow:window,s?(p=n.relatedTarget||n.toElement,s=d,p=p?Rn(p):null,p!==null&&(T=Qa(p),k=p.tag,p!==T||k!==5&&k!==27&&k!==6)&&(p=null)):(s=null,p=d),s!==p&&(k=ms,m="onMouseLeave",b="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(k=ys,m="onPointerLeave",b="onPointerEnter",u="pointer"),T=s==null?y:ba(s),f=p==null?y:ba(p),y=new k(m,u+"leave",s,n,v),y.target=T,y.relatedTarget=f,m=null,Rn(v)===d&&(k=new k(b,u+"enter",p,n,v),k.target=f,k.relatedTarget=T,m=k),T=m,k=s&&p?Ki(s,p,Kh):null,s!==null&&mf(g,y,s,k,!1),p!==null&&T!==null&&mf(g,T,p,k,!0)))}e:{if(s=d?ba(d):window,p=s.nodeName&&s.nodeName.toLowerCase(),p==="select"||p==="input"&&s.type==="file")var x=Ss;else if(ws(s))if(xb)x=Pm;else{x=$m;var E=Wm}else p=s.nodeName,!p||p.toLowerCase()!=="input"||s.type!=="checkbox"&&s.type!=="radio"?d&&ru(d.elementType)&&(x=Ss):x=Im;if(x&&(x=x(e,d))){yb(g,x,n,v);break e}E&&E(e,s,d)}switch(E=d?ba(d):window,e){case"focusin":(ws(E)||E.contentEditable==="true")&&(mo=E,rr=d,ha=null);break;case"focusout":ha=rr=mo=null;break;case"mousedown":ur=!0;break;case"contextmenu":case"mouseup":case"dragend":ur=!1,Os(g,n,v);break;case"selectionchange":if(th)break;case"keydown":case"keyup":Os(g,n,v)}var w;if(fu)e:{switch(e){case"compositionstart":var S="onCompositionStart";break e;case"compositionend":S="onCompositionEnd";break e;case"compositionupdate":S="onCompositionUpdate";break e}S=void 0}else go?mb(e,n)&&(S="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(S="onCompositionStart");S&&(gb&&n.locale!=="ko"&&(go||S!=="onCompositionStart"?S==="onCompositionEnd"&&go&&(w=vb()):(an=v,du="value"in an?an.value:an.textContent,go=!0)),E=Ec(d,S),0<E.length&&(S=new hs(S,e,null,n,v),g.push({event:S,listeners:E}),w?S.data=w:(w=hb(n),w!==null&&(S.data=w)))),(w=Qm?Zm(e,n):Km(e,n))&&(S=Ec(d,"onBeforeInput"),0<S.length&&(E=new hs("onBeforeInput","beforeinput",null,n,v),g.push({event:E,listeners:S}),E.data=w)),Qh(g,e,d,n,v)}pv(g,t)})}function Ya(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ec(e,t){for(var n=t+"Capture",o=[];e!==null;){var a=e,l=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||l===null||(a=_a(e,n),a!=null&&o.unshift(Ya(e,a,l)),a=_a(e,t),a!=null&&o.push(Ya(e,a,l))),e.tag===3)return o;e=e.return}return[]}function Kh(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function mf(e,t,n,o,a){for(var l=t._reactName,c=[];n!==null&&n!==o;){var i=n,r=i.alternate,d=i.stateNode;if(i=i.tag,r!==null&&r===o)break;i!==5&&i!==26&&i!==27||d===null||(r=d,a?(d=_a(n,l),d!=null&&c.unshift(Ya(n,d,r))):a||(d=_a(n,l),d!=null&&c.push(Ya(n,d,r)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var Jh=/\r\n?/g,Fh=/\u0000|\uFFFD/g;function hf(e){return(typeof e=="string"?e:""+e).replace(Jh,`
`).replace(Fh,"")}function gv(e,t){return t=hf(t),hf(e)===t}function V(e,t,n,o,a,l){switch(n){case"children":if(typeof o=="string")t==="body"||t==="textarea"&&o===""||Bo(e,o);else if(typeof o=="number"||typeof o=="bigint")t!=="body"&&Bo(e,""+o);else return;break;case"className":ml(e,"class",o);break;case"tabIndex":ml(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":ml(e,n,o);break;case"style":bb(e,o,l);return;case"data":if(t!=="object"){ml(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Ul(o),e.setAttribute(n,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(n==="formAction"?(t!=="input"&&V(e,t,"name",a.name,a,null),V(e,t,"formEncType",a.formEncType,a,null),V(e,t,"formMethod",a.formMethod,a,null),V(e,t,"formTarget",a.formTarget,a,null)):(V(e,t,"encType",a.encType,a,null),V(e,t,"method",a.method,a,null),V(e,t,"target",a.target,a,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Ul(o),e.setAttribute(n,o);break;case"onClick":o!=null&&(e.onclick=St);return;case"onScroll":o!=null&&C("scroll",e);return;case"onScrollEnd":o!=null&&C("scrollend",e);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}n=Ul(o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":o===!0?e.setAttribute(n,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(n,o):e.removeAttribute(n);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(n):e.setAttribute(n,o);break;case"popover":C("beforetoggle",e),C("toggle",e),Rl(e,"popover",o);break;case"xlinkActuate":Mt(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Mt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Mt(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Mt(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Mt(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Mt(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Mt(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Mt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Mt(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":Rl(e,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")n=gm.get(n)||n,Rl(e,n,o);else return}U=!0}function Zr(e,t,n,o,a,l){switch(n){case"style":bb(e,o,l);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"children":if(typeof o=="string")Bo(e,o);else if(typeof o=="number"||typeof o=="bigint")Bo(e,""+o);else return;break;case"onScroll":o!=null&&C("scroll",e);return;case"onScrollEnd":o!=null&&C("scrollend",e);return;case"onClick":o!=null&&(e.onclick=St);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!ib.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),l=n.slice(2,a?n.length-7:void 0),t=e[Ye]||null,t=t!=null?t[n]:null,typeof t=="function"&&e.removeEventListener(l,t,a),typeof o=="function")){typeof t!="function"&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(l,o,a);break e}U=!0,n in e?e[n]=o:o===!0?e.setAttribute(n,""):Rl(e,n,o)}return}U=!0}function we(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":C("error",e),C("load",e);var o=!1,a=!1,l;for(l in n)if(n.hasOwnProperty(l)){var c=n[l];if(c!=null)switch(l){case"src":o=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:V(e,t,l,c,n,null)}}a&&V(e,t,"srcSet",n.srcSet,n,null),o&&V(e,t,"src",n.src,n,null);return;case"input":C("invalid",e);var i=l=c=a=null,r=null,d=null;for(o in n)if(n.hasOwnProperty(o)){var v=n[o];if(v!=null)switch(o){case"name":a=v;break;case"type":c=v;break;case"checked":r=v;break;case"defaultChecked":d=v;break;case"value":l=v;break;case"defaultValue":i=v;break;case"children":case"dangerouslySetInnerHTML":if(v!=null)throw Error(h(137,t));break;default:V(e,t,o,v,n,null)}}db(e,l,i,r,d,c,a,!1);return;case"select":C("invalid",e),o=c=l=null;for(a in n)if(n.hasOwnProperty(a)&&(i=n[a],i!=null))switch(a){case"value":l=i;break;case"defaultValue":c=i;break;case"multiple":o=i;default:V(e,t,a,i,n,null)}t=l,n=c,e.multiple=!!o,t!=null?Eo(e,!!o,t,!1):n!=null&&Eo(e,!!o,n,!0);return;case"textarea":C("invalid",e),l=a=o=null;for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"value":o=i;break;case"defaultValue":a=i;break;case"children":l=i;break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(h(91));break;default:V(e,t,c,i,n,null)}fb(e,o,a,l);return;case"option":for(r in n)n.hasOwnProperty(r)&&(o=n[r],o!=null)&&(r==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":V(e,t,r,o,n,null));return;case"dialog":C("beforetoggle",e),C("toggle",e),C("cancel",e),C("close",e);break;case"iframe":case"object":C("load",e);break;case"video":case"audio":for(o=0;o<qa.length;o++)C(qa[o],e);break;case"image":C("error",e),C("load",e);break;case"details":C("toggle",e);break;case"embed":case"source":case"link":C("error",e),C("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(d in n)if(n.hasOwnProperty(d)&&(o=n[d],o!=null))switch(d){case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:V(e,t,d,o,n,null)}return;default:if(ru(t)){for(v in n)n.hasOwnProperty(v)&&(o=n[v],o!==void 0&&Zr(e,t,v,o,n,void 0));return}}for(i in n)n.hasOwnProperty(i)&&(o=n[i],o!=null&&V(e,t,i,o,n,null))}var Wh={};function $h(e,t,n,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,l=null,c=null,i=null,r=null,d=null,v=null;for(p in n){var g=n[p];if(n.hasOwnProperty(p)&&g!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":r=g;default:o.hasOwnProperty(p)||V(e,t,p,null,o,g)}}for(var s in o){var p=o[s];if(g=n[s],o.hasOwnProperty(s)&&(p!=null||g!=null))switch(s){case"type":p!==g&&(U=!0),l=p;break;case"name":p!==g&&(U=!0),a=p;break;case"checked":p!==g&&(U=!0),d=p;break;case"defaultChecked":p!==g&&(U=!0),v=p;break;case"value":p!==g&&(U=!0),c=p;break;case"defaultValue":p!==g&&(U=!0),i=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(h(137,t));break;default:p!==g&&V(e,t,s,p,o,g)}}ar(e,c,i,r,d,v,l,a);return;case"select":p=c=i=s=null;for(l in n)if(r=n[l],n.hasOwnProperty(l)&&r!=null)switch(l){case"value":break;case"multiple":p=r;default:o.hasOwnProperty(l)||V(e,t,l,null,o,r)}for(a in o)if(l=o[a],r=n[a],o.hasOwnProperty(a)&&(l!=null||r!=null))switch(a){case"value":l!==r&&(U=!0),s=l;break;case"defaultValue":l!==r&&(U=!0),i=l;break;case"multiple":l!==r&&(U=!0),c=l;default:l!==r&&V(e,t,a,l,o,r)}t=i,n=c,o=p,s!=null?Eo(e,!!n,s,!1):!!o!=!!n&&(t!=null?Eo(e,!!n,t,!0):Eo(e,!!n,n?[]:"",!1));return;case"textarea":p=s=null;for(i in n)if(a=n[i],n.hasOwnProperty(i)&&a!=null&&!o.hasOwnProperty(i))switch(i){case"value":break;case"children":break;default:V(e,t,i,null,o,a)}for(c in o)if(a=o[c],l=n[c],o.hasOwnProperty(c)&&(a!=null||l!=null))switch(c){case"value":a!==l&&(U=!0),s=a;break;case"defaultValue":a!==l&&(U=!0),p=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(h(91));break;default:a!==l&&V(e,t,c,a,o,l)}sb(e,s,p);return;case"option":for(var y in n)s=n[y],n.hasOwnProperty(y)&&s!=null&&!o.hasOwnProperty(y)&&(y==="selected"?e.selected=!1:V(e,t,y,null,o,s));for(r in o)s=o[r],p=n[r],o.hasOwnProperty(r)&&s!==p&&(s!=null||p!=null)&&(r==="selected"?(s!==p&&(U=!0),e.selected=s&&typeof s!="function"&&typeof s!="symbol"):V(e,t,r,s,o,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var k in n)s=n[k],n.hasOwnProperty(k)&&s!=null&&!o.hasOwnProperty(k)&&V(e,t,k,null,o,s);for(d in o)if(s=o[d],p=n[d],o.hasOwnProperty(d)&&s!==p&&(s!=null||p!=null))switch(d){case"children":case"dangerouslySetInnerHTML":if(s!=null)throw Error(h(137,t));break;default:V(e,t,d,s,o,p)}return;default:if(ru(t)){for(var T in n)s=n[T],n.hasOwnProperty(T)&&s!==void 0&&!o.hasOwnProperty(T)&&Zr(e,t,T,void 0,o,s);for(v in o)s=o[v],p=n[v],!o.hasOwnProperty(v)||s===p||s===void 0&&p===void 0||Zr(e,t,v,s,o,p);return}}for(var b in n)s=n[b],n.hasOwnProperty(b)&&s!=null&&!o.hasOwnProperty(b)&&V(e,t,b,null,o,s);for(g in o)s=o[g],p=n[g],!o.hasOwnProperty(g)||s===p||s==null&&p==null||V(e,t,g,s,o,p)}function yf(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Ih(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),o=0;o<n.length;o++){var a=n[o],l=a.transferSize,c=a.initiatorType,i=a.duration;if(l&&i&&yf(c)){for(c=0,i=a.responseEnd,o+=1;o<n.length;o++){var r=n[o],d=r.startTime;if(d>i)break;var v=r.transferSize,g=r.initiatorType;v&&yf(g)&&(r=r.responseEnd,c+=v*(r<i?1:(i-d)/(r-d)))}if(--o,t+=8*(l+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Kr=null,Jr=null;function La(e){return e.nodeType===9?e:e.ownerDocument}function xf(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function mv(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function hv(e,t,n,o){return n=La(n).createElement(e),n[he]=o,n[Ye]=t,we(n,e,t),pe(n),n}function Fr(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Vi=null;function Ph(){var e=window.event;return e&&e.type==="popstate"?e===Vi?!1:(Vi=e,!0):(Vi=null,!1)}var Ju=typeof setTimeout=="function"?setTimeout:void 0,e0=typeof clearTimeout=="function"?clearTimeout:void 0,kf=typeof Promise=="function"?Promise:void 0,wf=typeof requestAnimationFrame=="function"?requestAnimationFrame:Ju,t0=typeof queueMicrotask=="function"?queueMicrotask:typeof kf<"u"?function(e){return kf.resolve(null).then(e).catch(n0)}:Ju;function n0(e){setTimeout(function(){throw e})}function zn(e){return e==="head"}function Sf(e,t){var n=t,o=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(o===0){e.removeChild(a),Zo(t);return}o--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")o++;else if(n==="html")Qi(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Qi(n);for(var l=n.firstChild;l;){var c=l.nextSibling,i=l.nodeName;l[Fa]||i==="SCRIPT"||i==="STYLE"||i==="LINK"&&l.rel.toLowerCase()==="stylesheet"||n.removeChild(l),l=c}}else n==="body"&&Qi(e.ownerDocument.body);n=a}while(n);Zo(t)}function Tf(e,t){var n=e;e=0;do{var o=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=o}while(n)}function yv(e,t,n){if(t=CSS.escape(t)!==t?"r-"+btoa(t).replace(/=/g,""):t,e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display==="inline"){if(t=e.getClientRects(),t.length===1)var o=1;else for(var a=o=0;a<t.length;a++){var l=t[a];0<l.width&&0<l.height&&o++}o===1&&(e=e.style,e.display=t.length===1?"inline-block":"block",e.marginTop="-"+n.paddingTop,e.marginBottom="-"+n.paddingBottom)}}function xv(e,t){e=e.style,t=t.style;var n=t!=null?t.hasOwnProperty("viewTransitionName")?t.viewTransitionName:t.hasOwnProperty("view-transition-name")?t["view-transition-name"]:null:null;e.viewTransitionName=n==null||typeof n=="boolean"?"":(""+n).trim(),n=t!=null?t.hasOwnProperty("viewTransitionClass")?t.viewTransitionClass:t.hasOwnProperty("view-transition-class")?t["view-transition-class"]:null:null,e.viewTransitionClass=n==null||typeof n=="boolean"?"":(""+n).trim(),e.display==="inline-block"&&(t==null?e.display=e.margin="":(n=t.display,e.display=n==null||typeof n=="boolean"?"":n,n=t.margin,n!=null?e.margin=n:(n=t.hasOwnProperty("marginTop")?t.marginTop:t["margin-top"],e.marginTop=n==null||typeof n=="boolean"?"":n,t=t.hasOwnProperty("marginBottom")?t.marginBottom:t["margin-bottom"],e.marginBottom=t==null||typeof t=="boolean"?"":t)))}function kv(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position==="absolute"||t.position==="fixed",clip:t.clipPath!=="none"||t.overflow!=="visible"||t.filter!=="none"||t.mask!=="none"||t.mask!=="none"||t.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Wr(e){var t=e.getBoundingClientRect(),n=getComputedStyle(e);return kv(t,n,e)}function o0(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return kv(t,n,e)}function a0(e){return e.documentElement.clientHeight}function l0(e){this.addEventListener("load",e),this.addEventListener("error",e)}function c0(e,t,n,o,a,l,c,i,r){var d=t.nodeType===9?t:t.ownerDocument;try{var v=d.startViewTransition({update:function(){var s=d.defaultView,p=s.navigation&&s.navigation.transition,y=d.fonts.status;o();var k=[];if(y==="loaded"&&(a0(d),d.fonts.status==="loading"&&k.push(d.fonts.ready)),y=k.length,e!==null)for(var T=e.suspenseyImages,b=0,u=0;u<T.length;u++){var f=T[u];if(!f.complete){var m=f.getBoundingClientRect();if(0<m.bottom&&0<m.right&&m.top<s.innerHeight&&m.left<s.innerWidth){if(b+=Dv(f),b>Wl){k.length=y;break}f=new Promise(l0.bind(f)),k.push(f)}}}if(0<k.length)return s=Promise.race([Promise.all(k),new Promise(function(x){return setTimeout(x,500)})]).then(a,a),(p?Promise.allSettled([p.finished,s]):s).then(l,l);if(a(),p)return p.finished.then(l,l);l()},types:n});d.__reactViewTransition=v;var g=[];return v.ready.then(function(){for(var s=d.documentElement.getAnimations({subtree:!0}),p=0;p<s.length;p++){var y=s[p],k=y.effect,T=k.pseudoElement;if(T!=null&&T.startsWith("::view-transition")){g.push(y),y=k.getKeyframes();for(var b=T=void 0,u=!0,f=0;f<y.length;f++){var m=y[f],x=m.width;if(T===void 0)T=x;else if(T!==x){u=!1;break}if(x=m.height,b===void 0)b=x;else if(b!==x){u=!1;break}delete m.width,delete m.height,m.transform==="none"&&delete m.transform}u&&T!==void 0&&b!==void 0&&(k.setKeyframes(y),u=getComputedStyle(k.target,k.pseudoElement),u.width!==T||u.height!==b)&&(u=y[0],u.width=T,u.height=b,u=y[y.length-1],u.width=T,u.height=b,k.setKeyframes(y))}}c()},function(s){d.__reactViewTransition===v&&(d.__reactViewTransition=null);try{typeof s=="object"&&s!==null&&s.name==="InvalidStateError"&&(s.message==="View transition was skipped because document visibility state is hidden."||s.message==="Skipping view transition because document visibility state has become hidden."||s.message==="Skipping view transition because viewport size changed."||s.message==="Transition was aborted because of invalid state")&&(s=null),s!==null&&r(s)}finally{o(),a(),c()}}),v.finished.finally(function(){for(var s=0;s<g.length;s++)g[s].cancel();d.__reactViewTransition===v&&(d.__reactViewTransition=null),i()}),v}catch{return o(),a(),c(),null}}function Un(e,t){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+t+")"}Un.prototype.animate=function(e,t){return t=typeof t=="number"?{duration:t}:K({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)};Un.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),o=[],a=0;a<n.length;a++){var l=n[a].effect;l!==null&&l.target===e&&l.pseudoElement===t&&o.push(n[a])}return o};Un.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function wv(e){return{name:e,group:new Un("group",e),imagePair:new Un("image-pair",e),old:new Un("old",e),new:new Un("new",e)}}function $e(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}$e.prototype.addEventListener=function(e,t,n){var o=null,a=null;if(!(n!=null&&typeof n!="boolean"&&(o=n.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var l=this._eventListeners;if(Sv(l,e,t,n)===-1){var c=this,i=t;n!=null&&typeof n!="boolean"&&n.once===!0&&(i=function(r){c.removeEventListener(e,t,n),typeof t=="function"?t.call(this,r):t.handleEvent(r)}),o!==null&&(a=c.removeEventListener.bind(c,e,t,n),o.addEventListener("abort",a,{once:!0}),a=o.removeEventListener.bind(o,"abort",a)),o=Go(n),l.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:i,cleanup:a}),qe(this._fragmentFiber.child,!1,i0,e,i,o)}this._eventListeners=l}};function i0(e,t,n,o){return de(e).addEventListener(t,n,o),!1}$e.prototype.removeEventListener=function(e,t,n){var o=this._eventListeners;if(o!==null&&(t=Sv(o,e,t,n),t!==-1)){var a=o[t];n=a.attachedListener;var l=a.cleanup;a=Go(a.optionsOrUseCapture),qe(this._fragmentFiber.child,!1,r0,e,n,a),o.splice(t,1),l!==null&&l()}};function r0(e,t,n,o){return de(e).removeEventListener(t,n,o),!1}function Go(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function Ef(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function Sv(e,t,n,o){if(e.length===0)return-1;o=Ef(o);for(var a=0;a<e.length;a++){var l=e[a];if(l.type===t&&l.listener===n&&Ef(l.optionsOrUseCapture)===o)return a}return-1}$e.prototype.dispatchEvent=function(e){var t=Fn(this._fragmentFiber);if(t===null)return!0;t=de(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var o=t.nodeType===9?t.createComment(""):document.createTextNode("");if(n)for(var a=0;a<n.length;a++){var l=n[a];o.addEventListener(l.type,l.attachedListener,Go(l.optionsOrUseCapture))}if(t.appendChild(o),e=o.dispatchEvent(e),n)for(a=0;a<n.length;a++)l=n[a],o.removeEventListener(l.type,l.attachedListener,Go(l.optionsOrUseCapture));return t.removeChild(o),e}return t.dispatchEvent(e)};$e.prototype.focus=function(e){qe(this._fragmentFiber.child,!0,Tv,e,void 0,void 0)};function Tv(e,t){return e.tag===6?!1:(e=de(e),x0(e,t))}$e.prototype.focusLast=function(e){var t=[];qe(this._fragmentFiber.child,!0,Fu,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Tv(t[n],e);n--);};function Fu(e,t){return t.push(e),!1}$e.prototype.blur=function(){var e=Fn(this._fragmentFiber);e!==null&&(e=de(e),e=La(e).activeElement,e!==null&&qe(this._fragmentFiber.child,!1,u0,e,void 0,void 0))};function u0(e,t){return e.tag===6?!1:(e=de(e),e===t||e.contains(t)?(t.blur(),!0):!1)}$e.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),qe(this._fragmentFiber.child,!1,d0,e,void 0,void 0)};function d0(e,t){return e.tag===6||(e=de(e),t.observe(e)),!1}$e.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),qe(this._fragmentFiber.child,!1,s0,e,void 0,void 0);for(var n=t=0;n<st.length;n++){var o=st[n];o.fragmentInstance===this&&o.observer===e?e.unobserve(o.instance):st[t++]=o}st.length=t}};function s0(e,t){return e.tag===6||(e=de(e),t.unobserve(e)),!1}var st=[],Xi=!1;function f0(e,t,n){st.push({fragmentInstance:e,observer:t,instance:n}),Xi||(Xi=!0,k0(function(){Xi=!1;var o=st;st=[];for(var a=0;a<o.length;a++){var l=o[a];l.observer.unobserve(l.instance)}}))}$e.prototype.getClientRects=function(){var e=[];return qe(this._fragmentFiber.child,!1,b0,e,void 0,void 0),e};function b0(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=de(e),t.push.apply(t,e.getClientRects());return!1}$e.prototype.getRootNode=function(e){var t=Fn(this._fragmentFiber);return t===null?this:de(t).getRootNode(e)};$e.prototype.compareDocumentPosition=function(e){var t=Fn(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];qe(this._fragmentFiber.child,!1,Fu,n,void 0,void 0);var o=de(t);if(n.length===0){if(n=o,os(this._fragmentFiber)){e:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break e}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var a=o=n.compareDocumentPosition(e);return n===e?a=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=Zf(t)[1],n===null?a=Node.DOCUMENT_POSITION_PRECEDING:(e=de(n).compareDocumentPosition(e),a=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),a|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=de(n[0]),a=de(n[n.length-1]);var l=os(this._fragmentFiber)?t.parentElement:o;if(l==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=l.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,l=l.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_CONTAINED_BY;var c=t.compareDocumentPosition(e),i=a.compareDocumentPosition(e),r=c&Node.DOCUMENT_POSITION_CONTAINED_BY||i&Node.DOCUMENT_POSITION_CONTAINED_BY;return i=o&&l&&c&Node.DOCUMENT_POSITION_FOLLOWING&&i&Node.DOCUMENT_POSITION_PRECEDING,t=o&&t===e||l&&a===e||r||i?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&t===e||!l&&a===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:c,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||p0(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function p0(e,t,n,o,a){var l=Rn(a);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!l)e:{for(;l!==null;){if(l.tag===7&&(l===t||l.alternate===t)){n=!0;break e}l=l.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(l===null)return l=a.ownerDocument,a===l||a===l.documentElement||a===l.body;e:{for(l=t,t=Fn(t);l!==null;){if(!(l.tag!==5&&l.tag!==3&&l.tag!==27||l!==t&&l.alternate!==t)){l=!0;break e}l=l.return}l=!1}return l}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!l)&&!(t=l===n)&&(t=Ki(n,l,as),t===null?t=!1:(qe(t,!0,Xg,l,n),l=fo,fo=null,t=l!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!l)&&!(t=l===o)&&(t=Ki(o,l,as),t===null?t=!1:(qe(t,!0,Qg,l,o),l=fo,Zi=fo=null,t=l!==null)),t):!1}function zf(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}$e.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(h(566));var t=[];qe(this._fragmentFiber.child,!1,Fu,t,void 0,void 0);var n=e!==!1;if(t.length===0){var o=Zf(this._fragmentFiber);if(o=n?o[1]||o[0]||Fn(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){e=de(o),zf(e,n);return}if(o=de(o),o.nodeType!==9){if(o.nodeType===11){n="host"in o?o.host:null,n!==null&&n.scrollIntoView(e);return}o.scrollIntoView(e)}}for(o=n?t.length-1:0;o!==(n?-1:t.length);){var a=t[o];a.tag===6?(a=de(a),zf(a,n)):de(a).scrollIntoView(e),o+=n?-1:1}};function v0(e,t){return e=de(e),Ev(e,t),!1}function Ev(e,t){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(t)}function zv(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.addEventListener(a.type,a.attachedListener,Go(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){for(var c=0,i=0;i<st.length;i++){var r=st[i];(r.fragmentInstance!==t||r.observer!==l||r.instance!==e)&&(st[c++]=r)}st.length=c,l.observe(e)}),Ev(e,t))}function g0(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.removeEventListener(a.type,a.attachedListener,Go(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){typeof l.rootMargin=="string"?f0(t,l,e):l.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function $r(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":$r(n),Ac(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function m0(e,t,n,o){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[Fa])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var l=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=ct(e.nextSibling),e===null)break}return null}function h0(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=ct(e.nextSibling),e===null))return null;return e}function Ov(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=ct(e.nextSibling),e===null))return null;return e}function Ir(e){return e.data==="$?"||e.data==="$~"}function Wu(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function y0(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var o=function(){t(),n.removeEventListener("DOMContentLoaded",o)};n.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function ct(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Pr=null;function Of(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return ct(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Nf(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function x0(e,t){function n(){o=!0}if(e.ownerDocument.activeElement===e)return!0;var o=!1;try{e.ownerDocument.addEventListener("focus",n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener("focus",n,!0)}return o}function k0(e){wf(function(){wf(function(t){return e(t)})})}function Nv(e,t,n){switch(t=La(n),e){case"html":if(e=t.documentElement,!e)throw Error(h(452));return e;case"head":if(e=t.head,!e)throw Error(h(453));return e;case"body":if(e=t.body,!e)throw Error(h(454));return e;default:throw Error(h(451))}}function Av(e,t,n){for(var o in n){var a=n[o];n.hasOwnProperty(o)&&a!=null&&V(e,t,o,null,Wh,a)}n.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===St&&(e.onclick=null),Ac(e)}function Qi(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Ac(e)}var it=new Map,Af=new Set;function ja(e){if(typeof e.getRootNode=="function"){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var Zt=Y.d;Y.d={f:w0,r:S0,D:T0,C:E0,L:z0,m:O0,X:A0,S:N0,M:_0};function w0(){var e=Zt.f(),t=Vc();return e||t}function S0(e){var t=Jo(e);t!==null&&t.tag===5&&t.type==="form"?bp(t):Zt.r(e)}var Io=typeof document>"u"?null:document;function _v(e,t,n){var o=Io;if(o&&typeof t=="string"&&t){var a=ot(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),Af.has(a)||(Af.add(a),e={rel:e,crossOrigin:n,href:t},o.querySelector(a)===null&&(t=o.createElement("link"),we(t,"link",e),pe(t),o.head.appendChild(t)))}}function T0(e){Zt.D(e),_v("dns-prefetch",e,null)}function E0(e,t){Zt.C(e,t),_v("preconnect",e,t)}function z0(e,t,n){Zt.L(e,t,n);var o=Io;if(o&&e&&t){var a='link[rel="preload"][as="'+ot(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+ot(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+ot(n.imageSizes)+'"]')):a+='[href="'+ot(e)+'"]';var l=a;switch(t){case"style":l=Vo(e);break;case"script":l=Po(e)}if(!(it.has(l)||(e=K({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),it.set(l,e),o.querySelector(a)!==null||t==="style"&&o.querySelector(tl(l))||t==="script"&&o.querySelector(nl(l))))){var c=o.createElement("link");we(c,"link",e),t==="style"&&(c[oc]=!0,c.onload=c.onerror=function(){lb(c)}),pe(c),o.head.appendChild(c)}}}function O0(e,t){Zt.m(e,t);var n=Io;if(n&&e){var o=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+ot(o)+'"][href="'+ot(e)+'"]',l=a;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=Po(e)}if(!it.has(l)&&(e=K({rel:"modulepreload",href:e},t),it.set(l,e),n.querySelector(a)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(nl(l)))return}o=n.createElement("link"),we(o,"link",e),pe(o),n.head.appendChild(o)}}}function N0(e,t,n){Zt.S(e,t,n);var o=Io;if(o&&e){var a=To(o).hoistableStyles,l=Vo(e);t=t||"default";var c=a.get(l);if(!c){var i={loading:0,preload:null};if(c=o.querySelector(tl(l)))i.loading=5;else{e=K({rel:"stylesheet",href:e,"data-precedence":t},n),(n=it.get(l))&&$u(e,n);var r=c=o.createElement("link");pe(r),we(r,"link",e),r._p=new Promise(function(d,v){r.onload=d,r.onerror=v}),r.addEventListener("load",function(){i.loading|=1}),r.addEventListener("error",function(){i.loading|=2}),i.loading|=4,Jl(c,t,o)}c={type:"stylesheet",instance:c,count:1,state:i},a.set(l,c)}}}function A0(e,t){Zt.X(e,t);var n=Io;if(n&&e){var o=To(n).hoistableScripts,a=Po(e),l=o.get(a);l||(l=n.querySelector(nl(a)),l||(e=K({src:e,async:!0},t),(t=it.get(a))&&Iu(e,t),l=n.createElement("script"),pe(l),we(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function _0(e,t){Zt.M(e,t);var n=Io;if(n&&e){var o=To(n).hoistableScripts,a=Po(e),l=o.get(a);l||(l=n.querySelector(nl(a)),l||(e=K({src:e,async:!0,type:"module"},t),(t=it.get(a))&&Iu(e,t),l=n.createElement("script"),pe(l),we(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function _f(e,t,n,o){var a=(a=dn.current)?ja(a):null;if(!a)throw Error(h(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(n=Vo(n.href),t=To(a).hoistableStyles,o=t.get(n),o||(o={type:"style",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Vo(n.href);var l=To(a).hoistableStyles,c=l.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,c),(l=a.querySelector(tl(e)))?l._p||(c.instance=l,c.state.loading=5):(l=it.get(e),l||(l={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},it.set(e,l)),C0(a,e,l,c.state))),t&&o===null)throw Error(h(528,""));return c}if(t&&o!==null)throw Error(h(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(n=Po(n),t=To(a).hoistableScripts,o=t.get(n),o||(o={type:"script",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(h(444,e))}}function Vo(e){return'href="'+ot(e)+'"'}function tl(e){return'link[rel="stylesheet"]['+e+"]"}function Cv(e){return K({},e,{"data-precedence":e.precedence,precedence:null})}function C0(e,t,n,o){if(t=e.querySelector('link[rel="preload"][as="style"]['+t+"]")){if(t[oc]!==!0){o.loading=1;return}}else t=e.createElement("link"),t[oc]=!0,t.onload=t.onerror=lb.bind(null,t),we(t,"link",n),pe(t),e.head.appendChild(t);o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2})}function Po(e){return'[src="'+ot(e)+'"]'}function nl(e){return"script[async]"+e}function Cf(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+ot(n.href)+'"]');if(o)return t.instance=o,pe(o),o;var a=K({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),pe(o),we(o,"style",a),Jl(o,n.precedence,e),t.instance=o;case"stylesheet":a=Vo(n.href);var l=e.querySelector(tl(a));if(l)return t.state.loading|=4,t.instance=l,pe(l),l;o=Cv(n),(a=it.get(a))&&$u(o,a),l=(e.ownerDocument||e).createElement("link"),pe(l);var c=l;return c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),we(l,"link",o),t.state.loading|=4,Jl(l,n.precedence,e),t.instance=l;case"script":return l=Po(n.src),(a=e.querySelector(nl(l)))?(t.instance=a,pe(a),a):(o=n,(a=it.get(l))&&(o=K({},n),Iu(o,a)),e=e.ownerDocument||e,a=e.createElement("script"),pe(a),we(a,"link",o),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(h(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,Jl(o,n.precedence,e));return t.instance}function Jl(e,t,n){for(var o=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=o.length?o[o.length-1]:null,l=a,c=0;c<o.length;c++){var i=o[c];if(i.dataset.precedence===t)l=i;else if(l!==a)break}l?l.parentNode.insertBefore(e,l.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function $u(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Iu(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Fl=null;function Mf(e,t,n){if(Fl===null){var o=new Map,a=Fl=new Map;a.set(n,o)}else a=Fl,o=a.get(n),o||(o=new Map,a.set(n,o));if(o.has(e))return o;for(o.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var l=n[a];if(!(l[Fa]||l[he]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var c=l.getAttribute(t)||"";c=e+c;var i=o.get(c);i?i.push(l):o.set(c,[l])}}return o}function eu(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function M0(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Df(e,t){return e==="img"&&t.src!=null&&t.src!==""&&t.onLoad==null&&t.loading!=="lazy"}function Mv(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Dv(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function Rf(e,t){typeof t.decode=="function"&&(e.imgCount++,t.complete||(e.imgBytes+=Dv(t),e.suspenseyImages.push(t)),e=U0.bind(e),t.decode().then(e,e))}function D0(e,t,n,o){if(n.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=Vo(o.href),l=t.querySelector(tl(a));if(l){t=l._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Ga.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=l,pe(l);return}l=t.ownerDocument||t,o=Cv(o),(a=it.get(a))&&$u(o,a),l=l.createElement("link"),pe(l);var c=l;c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),we(l,"link",o),n.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Ga.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Wl=0;function R0(e,t){return e.stylesheets&&e.count===0&&$l(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var o=setTimeout(function(){if(e.stylesheets&&$l(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+t);0<e.imgBytes&&Wl===0&&(Wl=62500*Ih());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&$l(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>Wl?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(a)}}:null}function Rv(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)$l(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function Ga(){this.count--,Rv(this)}function U0(){this.imgCount--,Rv(this)}var zc=null;function $l(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,zc=new Map,t.forEach(B0,e),zc=null,Ga.call(e))}function B0(e,t){if(!(t.state.loading&4)){var n=zc.get(e);if(n)var o=n.get(null);else{n=new Map,zc.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<a.length;l++){var c=a[l];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),o=c)}o&&n.set(null,o)}a=t.instance,c=a.getAttribute("data-precedence"),l=n.get(c)||o,l===o&&n.set(null,a),n.set(c,a),this.count++,o=Ga.bind(this),a.addEventListener("load",o),a.addEventListener("error",o),l?l.parentNode.insertBefore(a,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var Xo={$$typeof:wt,Provider:null,Consumer:null,_currentValue:Bn,_currentValue2:Bn,_threadCount:0};function H0(e,t,n,o,a,l,c,i,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=yi(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=yi(0),this.hiddenUpdates=yi(null),this.identifierPrefix=o,this.onUncaughtError=a,this.onCaughtError=l,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.transitionTypes=null,this.incompleteTransitions=new Map}function Uv(e,t,n,o,a,l,c,i,r,d,v,g){return e=new H0(e,t,n,c,r,d,v,g,i),t=1,l===!0&&(t|=24),l=Be(3,null,null,t),e.current=l,l.stateNode=e,t=hu(),t.refCount++,e.pooledCache=t,t.refCount++,l.memoizedState={element:o,isDehydrated:n,cache:t},ku(l),e}function Bv(e){return e?(e=xo,e):xo}function Hv(e,t,n,o,a,l){a=Bv(a),o.context===null?o.context=a:o.pendingContext=a,o=fn(t),o.payload={element:n},l=l===void 0?null:l,l!==null&&(o.callback=l),n=bn(e,o,t),n!==null&&(He(n,e,t),xa(n,e,t))}function Uf(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Pu(e,t){Uf(e,t),(e=e.alternate)&&Uf(e,t)}function qv(e){if(e.tag===13||e.tag===31){var t=In(e,67108864);t!==null&&He(t,e,67108864),Pu(e,67108864)}}function Bf(e){if(e.tag===13||e.tag===31){var t=Fe();t=cu(t);var n=In(e,t);n!==null&&He(n,e,t),Pu(e,t)}}var Qo=!0;function q0(e,t,n,o){var a=z.T;z.T=null;var l=Y.p;try{Y.p=2,ed(e,t,n,o)}finally{Y.p=l,z.T=a}}function Y0(e,t,n,o){var a=z.T;z.T=null;var l=Y.p;try{Y.p=8,ed(e,t,n,o)}finally{Y.p=l,z.T=a}}function ed(e,t,n,o){if(Qo){var a=tu(o);if(a===null)Gi(e,t,o,Oc,n),Hf(e,o);else if(j0(a,e,t,n,o))o.stopPropagation();else if(Hf(e,o),t&4&&-1<L0.indexOf(e)){for(;a!==null;){var l=Jo(a);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var c=Cn(l.pendingLanes);if(c!==0){var i=l;for(i.pendingLanes|=2,i.entangledLanes|=2;c;){var r=1<<31-Je(c);i.entanglements[1]|=r,c&=~r}_t(l),(q&6)===0&&(kc=Ze()+500,el(0,!1))}}break;case 31:case 13:i=In(l,2),i!==null&&He(i,l,2),Vc(),Pu(l,2)}if(l=tu(o),l===null&&Gi(e,t,o,Oc,n),l===a)break;a=l}a!==null&&o.stopPropagation()}else Gi(e,t,o,null,n)}}function tu(e){return e=uu(e),td(e)}var Oc=null;function td(e){if(Oc=null,e=Rn(e),e!==null){var t=Qa(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=Vf(t),e!==null)return e;e=null}else if(n===31){if(e=Xf(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Oc=e,null}function Yv(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(em()){case Wf:return 2;case $f:return 8;case nc:case tm:return 32;case If:return 268435456;default:return 32}default:return 32}}var nu=!1,mn=null,hn=null,yn=null,Va=new Map,Xa=new Map,nn=[],L0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Hf(e,t){switch(e){case"focusin":case"focusout":mn=null;break;case"dragenter":case"dragleave":hn=null;break;case"mouseover":case"mouseout":yn=null;break;case"pointerover":case"pointerout":Va.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Xa.delete(t.pointerId)}}function ua(e,t,n,o,a,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:l,targetContainers:[a]},t!==null&&(t=Jo(t),t!==null&&qv(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function j0(e,t,n,o,a){switch(t){case"focusin":return mn=ua(mn,e,t,n,o,a),!0;case"dragenter":return hn=ua(hn,e,t,n,o,a),!0;case"mouseover":return yn=ua(yn,e,t,n,o,a),!0;case"pointerover":var l=a.pointerId;return Va.set(l,ua(Va.get(l)||null,e,t,n,o,a)),!0;case"gotpointercapture":return l=a.pointerId,Xa.set(l,ua(Xa.get(l)||null,e,t,n,o,a)),!0}return!1}function Lv(e){var t=Rn(e.target);if(t!==null){var n=Qa(t);if(n!==null){if(t=n.tag,t===13){if(t=Vf(n),t!==null){e.blockedOn=t,rs(e.priority,function(){Bf(n)});return}}else if(t===31){if(t=Xf(n),t!==null){e.blockedOn=t,rs(e.priority,function(){Bf(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Il(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=tu(e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);lr=o,n.target.dispatchEvent(o),lr=null}else return t=Jo(n),t!==null&&qv(t),e.blockedOn=n,!1;t.shift()}return!0}function qf(e,t,n){Il(e)&&n.delete(t)}function G0(){nu=!1,mn!==null&&Il(mn)&&(mn=null),hn!==null&&Il(hn)&&(hn=null),yn!==null&&Il(yn)&&(yn=null),Va.forEach(qf),Xa.forEach(qf)}function Ml(e,t){e.blockedOn===t&&(e.blockedOn=null,nu||(nu=!0,se.unstable_scheduleCallback(se.unstable_NormalPriority,G0)))}var Dl=null;function Yf(e){Dl!==e&&(Dl=e,se.unstable_scheduleCallback(se.unstable_NormalPriority,function(){Dl===e&&(Dl=null);for(var t=0;t<e.length;t+=3){var n=e[t],o=e[t+1],a=e[t+2];if(typeof o!="function"){if(td(o||n)===null)continue;break}var l=Jo(n);l!==null&&(e.splice(t,3),t-=3,kr(l,{pending:!0,data:a,method:n.method,action:o},o,a))}}))}function Zo(e){function t(r){return Ml(r,e)}mn!==null&&Ml(mn,e),hn!==null&&Ml(hn,e),yn!==null&&Ml(yn,e),Va.forEach(t),Xa.forEach(t);for(var n=0;n<nn.length;n++){var o=nn[n];o.blockedOn===e&&(o.blockedOn=null)}for(;0<nn.length&&(n=nn[0],n.blockedOn===null);)Lv(n),n.blockedOn===null&&nn.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(o=0;o<n.length;o+=3){var a=n[o],l=n[o+1],c=a[Ye]||null;if(typeof l=="function")c||Yf(n);else if(c){var i=null;if(l&&l.hasAttribute("formAction")){if(a=l,c=l[Ye]||null)i=c.formAction;else if(td(a)!==null)continue}else i=c.action;typeof i=="function"?n[o+1]=i:(n.splice(o,3),o-=3),Yf(n)}}}function jv(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),o||setTimeout(n,20)}function n(){if(!o&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function nd(e){this._internalRoot=e}Zc.prototype.render=nd.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(h(409));var n=t.current,o=Fe();Hv(n,o,e,t,null,null)};Zc.prototype.unmount=nd.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Hv(e.current,2,null,e,null,null),Vc(),t[Ko]=null}};function Zc(e){this._internalRoot=e}Zc.prototype.unstable_scheduleHydration=function(e){if(e){var t=ab();e={blockedOn:null,target:e,priority:t};for(var n=0;n<nn.length&&t!==0&&t<nn[n].priority;n++);nn.splice(n,0,e),n===0&&Lv(e)}};var Lf=jf.version;if(Lf!=="19.3.0")throw Error(h(527,Lf,"19.3.0"));Y.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(h(188)):(e=Object.keys(e).join(","),Error(h(268,e)));return e=Vg(t),e=e!==null?Qf(e):null,e=e===null?null:e.stateNode,e};var V0={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:z,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(da=__REACT_DEVTOOLS_GLOBAL_HOOK__,!da.isDisabled&&da.supportsFiber))try{Za=da.inject(V0),Ke=da}catch{}var da;Kc.createRoot=function(e,t){if(!Gf(e))throw Error(h(299));var n=!1,o="",a=kp,l=wp,c=Sp;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(l=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=Uv(e,1,!1,null,null,n,o,null,a,l,c,jv),e[Ko]=t.current,Ku(e),new nd(t)};Kc.hydrateRoot=function(e,t,n){if(!Gf(e))throw Error(h(299));var o=!1,a="",l=kp,c=wp,i=Sp,r=null;return n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(l=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(i=n.onRecoverableError),n.formState!==void 0&&(r=n.formState)),t=Uv(e,1,!0,t,n??null,o,a,r,l,c,i,jv),t.context=Bv(null),n=t.current,o=Fe(),o=cu(o),a=fn(o),a.callback=null,bn(n,a,o),n=o,t.current.lanes=n,Ja(t,n),_t(t),e[Ko]=t.current,Ku(e),new Zc(t)};Kc.version="19.3.0"});var Qv=vt((Sy,Xv)=>{"use strict";function Vv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Vv)}catch(e){console.error(e)}}Vv(),Xv.exports=Gv()});var id=`/*---------------------------------------------------------------------------------------------
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
`;var rd=`/* VS Code theme variables for hosts outside VS Code (the browser extension's pages): a dark and
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
`;var bg='[data-glass-scroll="off"]',Wc=(e,t,n)=>Math.min(n,Math.max(t,e));function ud(e){let t=e instanceof Document?e:e.ownerDocument,n=t.createElement("div");n.className="ink-scroll-layer",n.setAttribute("aria-hidden","true"),(e instanceof Document?t.body??t.documentElement:e).append(n);let o=new Map,a=new Set,l=0,c=u=>u===t.scrollingElement?{left:0,top:0}:(({left:f,top:m})=>({left:f+u.clientLeft,top:m+u.clientTop}))(u.getBoundingClientRect()),i=(u,f)=>{let{left:m,top:x}=c(u);for(let E of["y","x"]){let w=f.thumbs[E],S=E==="y"?u.clientHeight:u.clientWidth,j=E==="y"?u.scrollHeight:u.scrollWidth,N=E==="y"?u.scrollTop:u.scrollLeft,ge=j-S;if(ge<1||S<=0){w.hidden=!0;continue}let Le=S-6,pt=Wc(S/j*Le,Math.min(32,Le),Le),al=3+Wc(N,0,ge)/ge*(Le-pt);w.hidden=!1,E==="y"?(w.style.left=`${m+u.clientWidth-3}px`,w.style.top=`${x+al}px`,w.style.height=`${pt}px`):(w.style.left=`${m+al}px`,w.style.top=`${x+u.clientHeight-3}px`,w.style.width=`${pt}px`)}},r=u=>{let f=o.get(u);if(f){clearTimeout(f.timer),o.delete(u);for(let m of Object.values(f.thumbs))m.classList.remove("visible"),setTimeout(()=>m.remove(),300)}},d=(u,f)=>{clearTimeout(f.timer),f.timer=setTimeout(()=>{f.held||r(u)},1100)},v=u=>{let f={thumbs:{y:g(u,"y"),x:g(u,"x")},held:!1};for(let m of Object.values(f.thumbs))n.append(m),m.addEventListener("pointerenter",()=>{f.held=!0,clearTimeout(f.timer)}),m.addEventListener("pointerleave",()=>{m.classList.contains("dragging")||(f.held=!1,d(u,f))});return o.set(u,f),f};function g(u,f){let m=t.createElement("div");return m.className=`ink-scroll-thumb ${f}`,m.addEventListener("pointerdown",x=>{if(x.button!==0)return;x.preventDefault(),x.stopPropagation(),m.setPointerCapture(x.pointerId),m.classList.add("dragging");let E=f==="y"?x.clientY:x.clientX,w=f==="y"?u.scrollTop:u.scrollLeft,S=f==="y"?u.clientHeight:u.clientWidth,j=(f==="y"?u.scrollHeight:u.scrollWidth)-S,N=S-6-(f==="y"?m.offsetHeight:m.offsetWidth),ge=pt=>{if(N<=0)return;let al=(f==="y"?pt.clientY:pt.clientX)-E,ld=Wc(w+al/N*j,0,j);f==="y"?u.scrollTop=ld:u.scrollLeft=ld},Le=()=>{m.classList.remove("dragging"),m.removeEventListener("pointermove",ge),m.removeEventListener("pointerup",Le),m.removeEventListener("pointercancel",Le);let pt=o.get(u);pt&&!m.matches(":hover")&&(pt.held=!1,d(u,pt))};m.addEventListener("pointermove",ge),m.addEventListener("pointerup",Le),m.addEventListener("pointercancel",Le)}),m}let s=u=>{if(u.closest(bg))return;let f=o.get(u)??v(u);d(u,f),a.add(u),l||=requestAnimationFrame(()=>{l=0;for(let m of a){let x=o.get(m);if(x){if(!m.isConnected){r(m);continue}i(m,x);for(let E of Object.values(x.thumbs))E.classList.add("visible")}}a.clear()})},p=u=>{let f=u.target;f===t?s(t.scrollingElement):f instanceof HTMLElement&&f!==n&&s(f)},y=({path:u,x:f,y:m})=>{for(let x of u){if(x===e||!(x instanceof HTMLElement))break;if(x.parentNode===n)return;let E=x.scrollHeight-x.clientHeight>=1,w=x.scrollWidth-x.clientWidth>=1;if(!E&&!w)continue;let S=getComputedStyle(x),j=E&&/auto|scroll/.test(S.overflowY),N=w&&/auto|scroll/.test(S.overflowX);if(!j&&!N)continue;let{left:ge,top:Le}=c(x);(j&&f>=ge+x.clientWidth-14||N&&m>=Le+x.clientHeight-14)&&s(x);return}},k,T=0,b=u=>{u.buttons||(k={path:u.composedPath(),x:u.clientX,y:u.clientY},T||=requestAnimationFrame(()=>{T=0,k&&y(k)}))};return e.addEventListener("scroll",p,{capture:!0,passive:!0}),e.addEventListener("pointermove",b,{capture:!0,passive:!0}),()=>{e.removeEventListener("scroll",p,{capture:!0}),e.removeEventListener("pointermove",b,{capture:!0}),cancelAnimationFrame(l),cancelAnimationFrame(T);for(let u of[...o.keys()])r(u);n.remove()}}var dd=`/* The Inkspect design system: tokens and the shared components (buttons, fields, selects,
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

  /* Scrollbars: glass-scroll's "glass" pill, tinted from the theme's text colour. */
  --ink-scroll-thumb: color-mix(in srgb, var(--vscode-foreground, #888) 32%, transparent);
  --ink-scroll-thumb-hover: color-mix(in srgb, var(--vscode-foreground, #888) 55%, transparent);
  --ink-scroll-thumb-active: color-mix(in srgb, var(--vscode-foreground, #888) 70%, transparent);
  --ink-scroll-shadow:
    inset 0 0 0 1px color-mix(in srgb, #fff 12%, transparent),
    0 1px 3px color-mix(in srgb, #000 30%, transparent);
}

/* Scrollbars ---------------------------------------------------------------------------------
   Native scrollbars are hidden, so they take no space; installGlassScroll() (@inkspect/shared/
   glassScroll) draws a glass thumb over a scroller's edge while it scrolls, after the glass-scroll
   package. Scrolling by wheel, keys and touch is untouched. */

html,
:where(*) {
  scrollbar-width: none;
}

html::-webkit-scrollbar,
:where(*)::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.ink-scroll-layer {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  overflow: hidden;
  pointer-events: none;
}

.ink-scroll-thumb {
  position: absolute;
  border-radius: var(--ink-radius-pill);
  background: var(--ink-scroll-thumb);
  box-shadow: var(--ink-scroll-shadow);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  opacity: 0;
  cursor: grab;
  touch-action: none;
  transition:
    opacity 300ms ease,
    width 180ms ease,
    height 180ms ease,
    background-color 180ms ease;
}

/* Anchored at the scroller's edge, so growing on hover widens it inwards. */
.ink-scroll-thumb.y {
  width: 6px;
  translate: -100% 0;
}

.ink-scroll-thumb.x {
  height: 6px;
  translate: 0 -100%;
}

.ink-scroll-thumb.visible {
  opacity: 1;
  pointer-events: auto;
}

.ink-scroll-thumb:hover {
  background: var(--ink-scroll-thumb-hover);
}

.ink-scroll-thumb.y:hover,
.ink-scroll-thumb.y.dragging {
  width: 8px;
}

.ink-scroll-thumb.x:hover,
.ink-scroll-thumb.x.dragging {
  height: 8px;
}

.ink-scroll-thumb.dragging {
  background: var(--ink-scroll-thumb-active);
  cursor: grabbing;
}

@media (prefers-reduced-motion: reduce) {
  .ink-scroll-thumb {
    transition: none;
  }
}

/* Native bars come back where colours are forced; the overlay goes. */
@media (forced-colors: active) {
  :where(*) {
    scrollbar-width: auto;
  }

  :where(*)::-webkit-scrollbar {
    display: block;
    width: auto;
    height: auto;
  }

  .ink-scroll-layer {
    display: none;
  }
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
  gap: 4px;
  padding: 4px 8px;
  background: var(--ink-surface);
  border-top: 1px solid var(--ink-border);
  border-bottom: 1px solid var(--ink-border);
}

.draw-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-right: 4px;
  border-right: 1px solid var(--ink-border-subtle);
}

/* Compact enough that the tools, Screenshot and Stop drawing fit one row of a laptop screen. */
.draw-group.colors {
  gap: 4px;
  padding: 0 6px 0 2px;
}

.draw-toolbar .slider-track {
  width: 56px;
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
  gap: var(--ink-space-4);
  width: min(520px, 100%);
  max-height: calc(100vh - 2 * var(--ink-space-4));
  overflow: auto;
  padding: var(--ink-space-5);
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
  height: 128px;
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

/* One capture is shown whole. */
.ink-modal-thumb:only-child img {
  object-fit: contain;
  object-position: center;
}

/* Room for two lines before it grows. */
.ink-modal-prompt {
  padding: var(--ink-space-2) 10px;
}

.ink-modal-prompt textarea {
  min-height: calc(2 * 1.4em);
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
  gap: var(--ink-space-2);
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
  margin-bottom: calc(-1 * var(--ink-space-2));
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
  gap: var(--ink-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ink-modal-target {
  display: flex;
  align-items: center;
  gap: var(--ink-space-2);
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
  min-height: 60px;
  padding: var(--ink-space-3);
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
  gap: 2px;
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
  padding-top: var(--ink-space-4);
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
`;var sd={global:"Browser",inspect:"Element picker",draw:"Drawing",screenshot:"Screenshot",devtools:"Console and network",device:"Device",measure:"Measure",eyedropper:"Eyedropper",overlay:"Design overlay",tweak:"CSS tweak",record:"Record",a11y:"Accessibility check",send:"Send dialog"},R=e=>`vscodeBrowser.${e}`,ll=[{id:"tab.new",label:"New tab",scope:"global",keys:["ctrl+t"],command:R("newTab")},{id:"tab.close",label:"Close tab",scope:"global",keys:["ctrl+w","ctrl+f4"],command:R("closeTab")},{id:"tab.reopen",label:"Reopen closed tab",scope:"global",keys:["ctrl+shift+t"],command:R("reopenClosedTab")},{id:"tab.next",label:"Next tab",scope:"global",keys:["ctrl+tab","ctrl+pagedown"],mac:["ctrl+tab","cmd+alt+right"],command:R("nextTab")},{id:"tab.previous",label:"Previous tab",scope:"global",keys:["ctrl+shift+tab","ctrl+pageup"],mac:["ctrl+shift+tab","cmd+alt+left"],command:R("previousTab")},{id:"tab.duplicate",label:"Duplicate tab",scope:"global",keys:[],command:R("duplicateTab")},{id:"tab.private",label:"New private tab",scope:"global",keys:["ctrl+shift+n"],command:R("newPrivateTab")},{id:"window.new",label:"New window",scope:"global",keys:["ctrl+n"],command:R("newWindow")},{id:"nav.address",label:"Focus the address bar",scope:"global",keys:["ctrl+l","alt+d"],mac:["cmd+l","alt+d"],command:R("focusAddressBar")},{id:"nav.back",label:"Back",scope:"global",keys:["alt+left"],mac:["cmd+["],command:R("goBack")},{id:"nav.forward",label:"Forward",scope:"global",keys:["alt+right"],mac:["cmd+]"],command:R("goForward")},{id:"nav.reload",label:"Reload",scope:"global",keys:["ctrl+r","f5"],mac:["cmd+r"],command:R("reload")},{id:"nav.hardReload",label:"Hard reload",scope:"global",keys:["ctrl+shift+r","ctrl+f5"],mac:["cmd+shift+r"],command:R("hardReload")},{id:"nav.stop",label:"Stop loading",scope:"global",keys:[],command:R("stop")},{id:"nav.home",label:"Home page",scope:"global",keys:["alt+home"],mac:["cmd+shift+h"],command:R("goHome")},{id:"page.find",label:"Find in page",scope:"global",keys:["ctrl+f"],command:R("find")},{id:"page.zoomIn",label:"Zoom in",scope:"global",keys:["ctrl+=","ctrl+shift+="],command:R("zoomIn")},{id:"page.zoomOut",label:"Zoom out",scope:"global",keys:["ctrl+-"],command:R("zoomOut")},{id:"page.zoomReset",label:"Reset zoom",scope:"global",keys:["ctrl+0"],command:R("zoomReset")},{id:"page.bookmark",label:"Bookmark this page",scope:"global",keys:["ctrl+d"],command:R("bookmarkPage")},{id:"page.source",label:"View page source",scope:"global",keys:["ctrl+u"],mac:["cmd+alt+u"],command:R("viewSource")},{id:"page.pdf",label:"Save page as PDF",scope:"global",keys:[],command:R("savePdf")},{id:"page.copyUrl",label:"Copy page address",scope:"global",keys:["ctrl+shift+l"],command:R("copyUrl")},{id:"page.external",label:"Open in system browser",scope:"global",keys:[],command:R("openInSystemBrowser")},{id:"page.devtools",label:"Open DevTools",scope:"global",keys:["f12"],command:R("openDevTools")},{id:"page.contextToAgent",label:"Send page context to agent",scope:"global",keys:["ctrl+alt+enter"],command:R("sendPageContextToChat")},{id:"agent.showContext",label:"Show agent context",scope:"global",keys:["ctrl+shift+alt+a"],command:R("showAgentContext"),everywhere:!0},{id:"agent.sendLatest",label:"Send the latest capture to the agent",scope:"global",keys:["ctrl+shift+alt+v"],command:R("sendLatestContext"),everywhere:!0},{id:"open.history",label:"History",scope:"global",keys:["ctrl+h"],mac:["cmd+y"],command:R("showHistory")},{id:"open.downloads",label:"Downloads",scope:"global",keys:["shift+alt+l"],command:R("showDownloads")},{id:"open.bookmarks",label:"Bookmark manager",scope:"global",keys:["ctrl+alt+b"],command:R("showBookmarks")},{id:"open.bookmarksBar",label:"Show or hide the bookmarks bar",scope:"global",keys:["ctrl+shift+b"]},{id:"open.quickActions",label:"Quick actions",scope:"global",keys:["ctrl+shift+k"]},{id:"open.shortcuts",label:"Change keyboard shortcuts",scope:"global",keys:["ctrl+alt+k"],command:R("editShortcuts")},{id:"open.cheatSheet",label:"Keyboard shortcuts of this mode",scope:"global",keys:["ctrl+shift+/"],mac:["cmd+alt+/"]},{id:"mode.inspect",label:"Element picker",scope:"global",keys:["shift+alt+e"]},{id:"mode.draw",label:"Draw on the page",scope:"global",keys:["shift+alt+w"]},{id:"mode.screenshot",label:"Screenshot",scope:"global",keys:["shift+alt+g"]},{id:"mode.devtools",label:"Console and network",scope:"global",keys:["shift+alt+j"]},{id:"mode.device",label:"Device toolbar",scope:"global",keys:["shift+alt+m"]},{id:"mode.measure",label:"Measure",scope:"global",keys:["shift+alt+u"]},{id:"mode.eyedropper",label:"Eyedropper",scope:"global",keys:["shift+alt+y"]},{id:"mode.overlay",label:"Design overlay",scope:"global",keys:["shift+alt+o"]},{id:"mode.tweak",label:"CSS tweak",scope:"global",keys:["shift+alt+v"]},{id:"mode.record",label:"Record the page",scope:"global",keys:["ctrl+alt+r"]},{id:"mode.a11y",label:"Accessibility check",scope:"global",keys:["shift+alt+h"]},{id:"inspect.parent",label:"Select the parent element",scope:"inspect",keys:["up"]},{id:"inspect.child",label:"Select the first child element",scope:"inspect",keys:["down"]},{id:"inspect.copy",label:"Copy the selected elements",scope:"inspect",keys:["enter","c"]},{id:"inspect.screenshot",label:"Screenshot the element",scope:"inspect",keys:["s"]},{id:"inspect.agent",label:"Send the element to the agent",scope:"inspect",keys:["a"]},{id:"inspect.help",label:"Show these shortcuts",scope:"inspect",keys:["shift+/"]},{id:"inspect.exit",label:"Exit",scope:"inspect",keys:["escape"]},{id:"draw.select",label:"Select and move",scope:"draw",keys:["v"]},{id:"draw.pen",label:"Pen",scope:"draw",keys:["p"]},{id:"draw.pencil",label:"Pencil",scope:"draw",keys:["i"]},{id:"draw.marker",label:"Marker",scope:"draw",keys:["m"]},{id:"draw.brush",label:"Brush",scope:"draw",keys:["u"]},{id:"draw.highlighter",label:"Highlighter",scope:"draw",keys:["h"]},{id:"draw.neon",label:"Neon",scope:"draw",keys:["g"]},{id:"draw.line",label:"Line",scope:"draw",keys:["l"]},{id:"draw.arrow",label:"Arrow",scope:"draw",keys:["a"]},{id:"draw.doubleArrow",label:"Double arrow",scope:"draw",keys:["d"]},{id:"draw.rect",label:"Rectangle",scope:"draw",keys:["r"]},{id:"draw.ellipse",label:"Ellipse",scope:"draw",keys:["o"]},{id:"draw.text",label:"Text",scope:"draw",keys:["t"]},{id:"draw.callout",label:"Numbered callout",scope:"draw",keys:["n"]},{id:"draw.blur",label:"Redact (pixelate)",scope:"draw",keys:["b"]},{id:"draw.eraser",label:"Eraser",scope:"draw",keys:["e"]},...[1,2,3,4,5,6,7,8,9].map(e=>({id:`draw.color${e}`,label:`Color ${e}`,scope:"draw",keys:[String(e)]})),{id:"draw.thinner",label:"Thinner stroke",scope:"draw",keys:["["]},{id:"draw.thicker",label:"Thicker stroke",scope:"draw",keys:["]"]},{id:"draw.fill",label:"Fill shapes on or off",scope:"draw",keys:["f"]},{id:"draw.undo",label:"Undo",scope:"draw",keys:["ctrl+z"]},{id:"draw.redo",label:"Redo",scope:"draw",keys:["ctrl+y","ctrl+shift+z"]},{id:"draw.clear",label:"Clear all drawings",scope:"draw",keys:["shift+backspace"]},{id:"draw.visible",label:"Hide or show drawings",scope:"draw",keys:["w"]},{id:"draw.capture",label:"Screenshot the drawing area",scope:"draw",keys:["enter"]},{id:"draw.captureAgent",label:"Screenshot the drawing area and send it to the agent",scope:"draw",keys:["shift+enter"]},{id:"draw.captureMenu",label:"Screenshot menu",scope:"draw",keys:["s"]},{id:"draw.captureGroups",label:"Screenshot each drawing separately",scope:"draw",keys:["alt+g"]},{id:"draw.captureClean",label:"Screenshot the drawing area without drawings",scope:"draw",keys:["alt+c"]},{id:"draw.captureViewport",label:"Screenshot the visible area with drawings",scope:"draw",keys:["alt+v"]},{id:"draw.captureFullPage",label:"Screenshot the full page with drawings",scope:"draw",keys:["alt+f"]},{id:"draw.captureRegion",label:"Screenshot an area you drag, with drawings",scope:"draw",keys:["alt+r"]},{id:"draw.help",label:"Show these shortcuts",scope:"draw",keys:["shift+/"]},{id:"draw.exit",label:"Stop drawing",scope:"draw",keys:["escape"]},{id:"shot.viewport",label:"Visible area",scope:"screenshot",keys:["v"]},{id:"shot.fullPage",label:"Full page",scope:"screenshot",keys:["f"]},{id:"shot.region",label:"Region",scope:"screenshot",keys:["r"]},{id:"shot.element",label:"Element",scope:"screenshot",keys:["e"]},{id:"shot.drawing",label:"Drawing area",scope:"screenshot",keys:["d"]},{id:"shot.lastToAgent",label:"Send the last screenshot to the agent",scope:"screenshot",keys:["a"],command:R("screenshot.sendToTerminal")},{id:"send.default",label:"Send to the default agent",scope:"send",keys:["enter"]},{id:"send.newThread",label:"New agentmux thread",scope:"send",keys:["n"]},{id:"send.prompt",label:"Write a prompt",scope:"send",keys:["i"]},{id:"send.project",label:"Change project",scope:"send",keys:["p"]},{id:"send.copy",label:"Copy",scope:"send",keys:["c"]},{id:"send.download",label:"Download",scope:"send",keys:["d"]},{id:"send.close",label:"Close (keep it saved)",scope:"send",keys:["escape"]},{id:"dev.console",label:"Console",scope:"devtools",keys:["alt+1"]},{id:"dev.network",label:"Network",scope:"devtools",keys:["alt+2"]},{id:"dev.filter",label:"Filter",scope:"devtools",keys:["alt+f"]},{id:"dev.copyErrors",label:"Copy console errors",scope:"devtools",keys:["alt+e"]},{id:"dev.copyFailed",label:"Copy failed requests",scope:"devtools",keys:["alt+q"]},{id:"dev.copyContext",label:"Copy page context",scope:"devtools",keys:["alt+p"]},{id:"dev.contextAgent",label:"Send page context to the agent",scope:"devtools",keys:["alt+shift+p"]},{id:"dev.clear",label:"Clear",scope:"devtools",keys:["alt+k"]},{id:"dev.close",label:"Close",scope:"devtools",keys:["alt+w"]},{id:"device.previous",label:"Previous device",scope:"device",keys:["alt+["]},{id:"device.next",label:"Next device",scope:"device",keys:["alt+]"]},{id:"device.rotate",label:"Rotate",scope:"device",keys:["alt+r"]},{id:"device.touch",label:"Touch and mobile on or off",scope:"device",keys:["alt+t"]},{id:"device.fit",label:"Fit to window",scope:"device",keys:["alt+0"]},{id:"device.zoomIn",label:"Zoom in",scope:"device",keys:["alt+="]},{id:"device.zoomOut",label:"Zoom out",scope:"device",keys:["alt+-"]},{id:"device.network",label:"Next network speed",scope:"device",keys:["alt+n"]},{id:"device.theme",label:"Next color scheme",scope:"device",keys:["alt+l"]},{id:"device.close",label:"Close the device toolbar",scope:"device",keys:[]},{id:"measure.grid",label:"Rulers and grid on or off",scope:"measure",keys:["g"]},{id:"measure.copy",label:"Copy the measurements",scope:"measure",keys:["c"]},{id:"measure.clear",label:"Clear the pinned element",scope:"measure",keys:["backspace"]},{id:"measure.help",label:"Show these shortcuts",scope:"measure",keys:["shift+/"]},{id:"measure.exit",label:"Exit",scope:"measure",keys:["escape"]},{id:"eyedropper.hex",label:"Copy colors as hex",scope:"eyedropper",keys:["h"]},{id:"eyedropper.rgb",label:"Copy colors as rgb()",scope:"eyedropper",keys:["r"]},{id:"eyedropper.hsl",label:"Copy colors as hsl()",scope:"eyedropper",keys:["l"]},{id:"eyedropper.help",label:"Show these shortcuts",scope:"eyedropper",keys:["shift+/"]},{id:"eyedropper.exit",label:"Exit",scope:"eyedropper",keys:["escape"]},{id:"overlay.open",label:"Open an image",scope:"overlay",keys:["alt+o"]},{id:"overlay.fainter",label:"Less opaque",scope:"overlay",keys:["alt+,"]},{id:"overlay.stronger",label:"More opaque",scope:"overlay",keys:["alt+."]},{id:"overlay.left",label:"Nudge left",scope:"overlay",keys:["alt+left"]},{id:"overlay.right",label:"Nudge right",scope:"overlay",keys:["alt+right"]},{id:"overlay.up",label:"Nudge up",scope:"overlay",keys:["alt+up"]},{id:"overlay.down",label:"Nudge down",scope:"overlay",keys:["alt+down"]},{id:"overlay.difference",label:"Difference blend on or off",scope:"overlay",keys:["alt+x"]},{id:"overlay.hide",label:"Hide or show the overlay",scope:"overlay",keys:["alt+h"]},{id:"overlay.exit",label:"Close the overlay",scope:"overlay",keys:["alt+z"]},{id:"tweak.agent",label:"Send the CSS changes to the agent",scope:"tweak",keys:["ctrl+enter"]},{id:"tweak.copy",label:"Copy the CSS changes",scope:"tweak",keys:["ctrl+shift+c"]},{id:"tweak.undo",label:"Undo the last change",scope:"tweak",keys:["ctrl+z"]},{id:"tweak.exit",label:"Exit and revert",scope:"tweak",keys:["escape"]},{id:"record.stop",label:"Stop and save",scope:"record",keys:["alt+s"]},{id:"record.pause",label:"Pause or resume",scope:"record",keys:["alt+y"]},{id:"record.cancel",label:"Cancel",scope:"record",keys:["alt+backspace"]},{id:"a11y.next",label:"Next issue",scope:"a11y",keys:["n","down"]},{id:"a11y.previous",label:"Previous issue",scope:"a11y",keys:["p","up"]},{id:"a11y.tabOrder",label:"Tab order on or off",scope:"a11y",keys:["t"]},{id:"a11y.copy",label:"Copy the report",scope:"a11y",keys:["c"]},{id:"a11y.agent",label:"Send the report to the agent",scope:"a11y",keys:["a"]},{id:"a11y.help",label:"Show these shortcuts",scope:"a11y",keys:["shift+/"]},{id:"a11y.exit",label:"Exit",scope:"a11y",keys:["escape"]}];function fd(e,t){return t?[...e.mac??e.keys.map(n=>n.replace(/\bctrl\+/,"cmd+"))]:[...e.keys]}function bd(e){let t=md(e.trim());return t.key?[t.ctrl&&"ctrl",t.shift&&"shift",t.alt&&"alt",t.meta&&"cmd",t.key].filter(Boolean).join("+"):""}function cl(e,t){let n={};for(let o of ll){let a=e[o.id],l=(a===void 0?fd(o,t):typeof a=="string"?[a]:[...a]).map(bd);n[o.id]=[...new Set(l.filter(Boolean))]}return n}function pd(e){if(!e||typeof e!="object"||Array.isArray(e))return{};let t=new Set(ll.map(o=>o.id)),n={};for(let[o,a]of Object.entries(e))t.has(o)&&(typeof a=="string"||Array.isArray(a)&&a.every(l=>typeof l=="string"))&&(n[o]=a);return n}var vd=new Set(["mode.inspect","mode.draw","mode.screenshot","mode.device","mode.devtools","page.bookmark","open.shortcuts","inspect.parent","inspect.child","inspect.copy","inspect.exit",...["select","pen","pencil","marker","brush","highlighter","neon","line","arrow","doubleArrow","rect","ellipse","text","callout","blur","eraser"].map(e=>`draw.${e}`),...Array.from({length:9},(e,t)=>`draw.color${t+1}`),"draw.thinner","draw.thicker","draw.fill","draw.undo","draw.redo","draw.clear","draw.visible","draw.capture","draw.captureMenu","draw.captureGroups","draw.captureClean","draw.captureViewport","draw.captureFullPage","draw.captureRegion","draw.exit","shot.viewport","shot.fullPage","shot.region","shot.element","shot.drawing","send.default","send.newThread","send.prompt","send.project","send.copy","send.download","send.close"]);function gd(e,t){let n=vg(e,t);return t?[...[...n.matchAll(/[⌃⌥⇧⌘]/g)].map(a=>a[0]),n.replace(/[⌃⌥⇧⌘]/g,"")]:n.split(/\+(?=.)/)}function vg(e,t){let n=md(e),o={escape:"Esc",enter:t?"\u21A9":"Enter",backspace:t?"\u232B":"Backspace",delete:t?"\u2326":"Delete",up:"\u2191",down:"\u2193",left:"\u2190",right:"\u2192",pageup:"PgUp",pagedown:"PgDn",tab:t?"\u21E5":"Tab",space:"Space","/":n.shift?"?":"/"},a=!(n.key==="/"&&n.shift),l=o[n.key]??(n.key.length===1?n.key.toUpperCase():n.key[0].toUpperCase()+n.key.slice(1));return t?`${n.ctrl?"\u2303":""}${n.alt?"\u2325":""}${n.shift&&a?"\u21E7":""}${n.meta?"\u2318":""}${l}`:[n.ctrl&&"Ctrl",n.alt&&"Alt",n.shift&&a&&"Shift",l].filter(Boolean).join("+")}function md(e){let t=e.toLowerCase().split("+"),n=t.pop()??"";return{ctrl:t.includes("ctrl"),shift:t.includes("shift"),alt:t.includes("alt"),meta:t.includes("cmd")||t.includes("meta")||t.includes("win"),key:n}}var Dd=ae(Kt(),1);var Md,Dg=e=>{let t=e.composedPath()[0];if(e.button!==0){Md=void 0;return}t instanceof Element&&(Md={element:t.closest('button, [role="button"], a')??t,at:performance.now()})};typeof window<"u"&&window.addEventListener("pointerdown",Dg,!0);function Nn(...e){return e.filter(Boolean).join(" ")}var no=ae(Oe(),1);function Jt({variant:e="secondary",size:t="md",icon:n,iconEnd:o,loading:a,className:l,children:c,disabled:i,type:r="button",...d}){let v=a?"loading":n;return(0,no.jsxs)("button",{type:r,className:Nn("button",e,t==="sm"&&"small",l),disabled:i||a,"aria-busy":a||void 0,...d,children:[v&&(0,no.jsx)("span",{className:Nn("codicon",`codicon-${v}`,a&&"codicon-modifier-spin"),"aria-hidden":"true"}),c!==void 0&&(0,no.jsx)("span",{className:"button-label",children:c}),o&&(0,no.jsx)("span",{className:`codicon codicon-${o}`,"aria-hidden":"true"})]})}var ai=ae(Oe(),1);function Hd({icon:e,label:t,onClick:n,onContextMenu:o,disabled:a,active:l,spin:c,className:i}){return(0,ai.jsx)("button",{type:"button",className:["icon-button",l&&"active",i].filter(Boolean).join(" "),title:t,"aria-label":t,"aria-pressed":l,disabled:a,onClick:n,onContextMenu:o,children:(0,ai.jsx)("span",{className:`codicon codicon-${e}${c?" codicon-modifier-spin":""}`,"aria-hidden":"true"})})}var li=ae(Oe(),1),Bg=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function ci({binding:e,size:t="md"}){let n=gd(e,Bg);return(0,li.jsx)("span",{className:`keycaps size-${t}`,"aria-label":n.join("+"),children:n.map((o,a)=>(0,li.jsx)("kbd",{className:"keycap",children:o},a))})}var On=ae(Kt()),og=ae(Qv());var od="inkspectShortcuts",ad=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),Kv=ll.filter(e=>vd.has(e.id)),X0={"mode.device":"Responsive view","mode.screenshot":"Screenshot menu","open.shortcuts":"Keyboard shortcuts"},Jv=e=>X0[e.id]??e.label;var Zv=["global","inspect","draw","screenshot"],Ey=[...Zv,...Object.keys(sd).filter(e=>!Zv.includes(e))];async function Q0(){let e=(await chrome.storage.sync.get(od))[od];return{overrides:pd(e?.shortcuts??{}),updated:typeof e?.updated=="number"?e.updated:0}}function Fv(e){let t=()=>{Q0().then(o=>e(cl(o.overrides,ad),o))},n=(o,a)=>{a==="sync"&&o[od]&&t()};return chrome.storage.onChanged.addListener(n),t(),()=>chrome.storage.onChanged.removeListener(n)}var Jc=ae(Kt()),re=ae(Oe()),Z0=e=>/^VS Code \((.*)\)$/.exec(e??"")?.[1];function K0(e){let[t,n]=(0,Jc.useState)([]);return(0,Jc.useEffect)(()=>{if(!e)return;let o=!0,a=()=>{chrome.runtime.sendMessage({type:"hub",request:{type:"projects.get",req:crypto.randomUUID()}}).then(c=>{!o||c?.type!=="projects"||n([...new Set(c.projects.filter(i=>i.vscode).map(i=>i.name))])}).catch(()=>{})};a();let l=setInterval(a,4e3);return()=>{o=!1,clearInterval(l)}},[e]),e?t:[]}function Wv({status:e,limit:t=1/0,size:n="lg"}){let o=e.state==="connected",a=K0(o),l=e.via==="hub"?"Browser helper":"Linked",c=Z0(e.peer),i=[];if(o){for(let g of a)i.push({id:g,name:`VS Code (${g})`,lastUsed:g===c,tag:l});i.some(g=>g.lastUsed)||i.unshift({id:"peer",name:e.peer??"VS Code",lastUsed:!0,tag:l})}let r=i.slice(0,t),d=i.length-r.length,v=r.findIndex(g=>g.lastUsed);return(0,re.jsxs)("div",{className:`link-graph size-${n} state-${e.state}`,"aria-hidden":"true",children:[(0,re.jsx)("span",{className:"graph-node source",children:(0,re.jsx)("span",{className:"codicon codicon-globe"})}),(0,re.jsx)("ul",{className:"graph-targets",children:o?(0,re.jsxs)(re.Fragment,{children:[r.map((g,s)=>(0,re.jsxs)("li",{className:`graph-target${g.lastUsed?" lit":s<v?" on-path":""}`,children:[(0,re.jsx)("span",{className:"graph-node",children:(0,re.jsx)("span",{className:"codicon codicon-vscode"})}),(0,re.jsx)("span",{className:"graph-name",children:g.name}),g.lastUsed&&(0,re.jsx)("span",{className:"graph-tag",children:g.tag})]},g.id)),d>0&&(0,re.jsx)("li",{className:"graph-target more",children:(0,re.jsxs)("span",{className:"graph-name",children:["and ",d," more"]})})]}):(0,re.jsxs)("li",{className:"graph-target pending",children:[(0,re.jsx)("span",{className:"graph-node",children:(0,re.jsx)("span",{className:"codicon codicon-vscode"})}),(0,re.jsx)("span",{className:"graph-name",children:"VS Code"})]})})]})}var $v=`/* LinkGraph: the browser, and a branch to each VS Code window (a tree connector drawn in CSS).
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
`;var Iv=`/* PairCard: linking this browser (one click in VS Code; the code is the fallback), on the full
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
`;var ol=ae(Kt());var Fc=ae(Kt()),ea=ae(Oe());function Pv({value:e,onChange:t,onComplete:n,length:o=6,disabled:a}){let l=(0,Fc.useRef)([]),c=Array.from({length:o},(d,v)=>e[v]??""),i=d=>l.current[Math.max(0,Math.min(o-1,d))]?.focus(),r=(d,v)=>{let g=v.replace(/\D/g,"");if(!g)return;let s=(e.slice(0,d)+g).slice(0,o);t(s),i(s.length),s.length===o&&n?.(s)};return(0,ea.jsx)("div",{className:"code-input",role:"group","aria-label":"Pairing code",children:c.map((d,v)=>(0,ea.jsxs)(Fc.Fragment,{children:[v===o/2&&(0,ea.jsx)("span",{className:"code-sep","aria-hidden":"true"}),(0,ea.jsx)("input",{ref:g=>{l.current[v]=g},className:"code-box",inputMode:"numeric",autoComplete:"one-time-code","aria-label":`Digit ${v+1}`,maxLength:o,disabled:a,value:d,onFocus:g=>g.currentTarget.select(),onChange:g=>r(Math.min(v,e.length),g.target.value),onPaste:g=>{g.preventDefault(),r(0,g.clipboardData.getData("text"))},onKeyDown:g=>{if(g.key==="Backspace"){g.preventDefault();let s=d?v:v-1;s>=0&&t(e.slice(0,s)),i(s)}else g.key==="ArrowLeft"?(g.preventDefault(),i(v-1)):g.key==="ArrowRight"&&(g.preventDefault(),i(v+1))}})]},v))})}var B=ae(Oe());function eg({status:e,pair:t,compact:n,startWithCode:o}){let[a,l]=(0,ol.useState)(""),[c,i]=(0,ol.useState)(""),[r,d]=(0,ol.useState)(!1),[v,g]=(0,ol.useState)(!!o);if(e.state==="connected")return null;let s=async(y=a)=>{if(y.length!==6||r)return;d(!0),i("");let k=await t(y).catch(()=>{});if(d(!1),!k){i("The extension did not answer. Reload it and try again.");return}i(k.error??""),k.state==="connected"&&l("")},p=(0,B.jsxs)("p",{className:"card-foot",children:[(0,B.jsx)("span",{className:"codicon codicon-lock","aria-hidden":"true"}),"The link only talks to VS Code on this computer, and only after pairing (or through the browser helper VS Code installs)."]});return e.via==="hub"?(0,B.jsx)("div",{className:Nn("card","pair-card",n&&"compact"),children:(0,B.jsxs)("p",{className:"pair-lead",children:[(0,B.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,B.jsx)("span",{children:"Linked through the browser helper: no pairing needed. VS Code isn't running, so sends to its terminals and chat wait for it; captures still save into your projects, and agentmux agents still get them."})]})}):e.state!=="unpaired"?(0,B.jsxs)("div",{className:Nn("card","pair-card",n&&"compact"),children:[(0,B.jsxs)("p",{className:"pair-lead",children:[(0,B.jsx)("span",{className:"codicon codicon-loading codicon-modifier-spin","aria-hidden":"true"}),(0,B.jsxs)("span",{children:["Open VS Code with the VS Code Browser extension. Then click"," ",(0,B.jsx)("b",{children:"Pair Browser Extension"})," in its ",(0,B.jsx)("b",{children:"Browser"})," side panel."]})]}),!n&&p]}):(0,B.jsxs)("form",{className:Nn("card","pair-card",n&&"compact"),onSubmit:y=>{y.preventDefault(),s()},children:[(0,B.jsxs)("p",{className:"pair-lead",children:[(0,B.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,B.jsxs)("span",{children:["In VS Code, click ",(0,B.jsx)("b",{children:"Pair Browser Extension"})," in the ",(0,B.jsx)("b",{children:"Browser"})," side panel (or"," ",(0,B.jsx)("b",{children:"Pair"})," on its notification). No code needed: this updates by itself."]})]}),v?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsxs)("p",{className:"muted",children:["Run ",(0,B.jsx)("kbd",{children:"Browser: Pair Browser Extension with a Code"})," in VS Code, then type the code it shows."]}),(0,B.jsxs)("div",{className:"pair-row",children:[(0,B.jsx)(Pv,{value:a,onChange:l,disabled:r,onComplete:y=>{s(y)}}),(0,B.jsx)(Jt,{type:"submit",variant:"primary",icon:"link",className:"pair-button",loading:r,disabled:a.length!==6,children:"Pair"})]})]}):(0,B.jsx)(Jt,{size:"sm",variant:"ghost",icon:"key",className:"use-code",onClick:()=>g(!0),children:"Use a code instead"}),c&&(0,B.jsxs)("p",{className:"pair-message",role:"alert",children:[(0,B.jsx)("span",{className:"codicon codicon-error","aria-hidden":"true"}),c]}),!n&&p]})}var tg=`/* The toolbar button's popup. Components and tokens come from @inkspect/shared/ui; the link
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
`;var H=ae(Oe()),$0=["mode.inspect","mode.draw","mode.screenshot","mode.device"],I0={"mode.inspect":"inspect","mode.draw":"edit","mode.screenshot":"device-camera","mode.device":"device-mobile"},P0={connected:{label:"Linked",tone:"ok"},connecting:{label:"Connecting",tone:"busy"},unpaired:{label:"Not paired",tone:"warn"},offline:{label:"VS Code not running",tone:"off"}};function ey(e){e!==void 0&&chrome.sidePanel.open({windowId:e}),window.close()}function ng(e){chrome.tabs.create({url:chrome.runtime.getURL(`options.html${e?`#${e}`:""}`)}),window.close()}function ty(){let[e,t]=(0,On.useState)({state:"connecting"}),[n,o]=(0,On.useState)(()=>cl({},ad)),[a,l]=(0,On.useState)(),[c,i]=(0,On.useState)(""),[r,d]=(0,On.useState)();(0,On.useEffect)(()=>{let p=()=>{chrome.runtime.sendMessage({type:"status"}).then(T=>T&&t(T))};p();let y=setInterval(p,1500),k=Fv(T=>o(T));return chrome.windows.getCurrent().then(T=>d(T.id)),chrome.commands.getAll().then(T=>l(T.find(b=>b.name==="toggle-toolbar")?.shortcut??"")),()=>{clearInterval(y),k()}},[]);let v=async()=>{let p=await chrome.runtime.sendMessage({type:"toggleToolbar"}).catch(()=>null);p?.ok?window.close():i(p?.error??"The toolbar could not open on this page.")},g=P0[e.state],s=e.state==="connected";return(0,H.jsxs)("main",{className:`popup tone-${g.tone}`,children:[(0,H.jsxs)("header",{className:"popup-head",children:[(0,H.jsx)("img",{src:"icons/32.png",alt:""}),(0,H.jsx)("span",{className:"popup-name",children:"Inkspect"}),(0,H.jsxs)("span",{className:"popup-state",role:"status",children:[(0,H.jsx)("span",{className:"status-dot","aria-hidden":"true"}),g.label]})]}),(0,H.jsxs)("section",{className:"popup-link","aria-label":"VS Code",children:[(0,H.jsx)(Wv,{status:e,size:"sm"}),!s&&(0,H.jsx)(eg,{compact:!0,status:e,pair:async p=>{let y=await chrome.runtime.sendMessage({type:"pair",code:p}).catch(()=>{});return y&&t(y),y}})]}),(0,H.jsxs)("div",{className:"popup-action",children:[(0,H.jsxs)(Jt,{variant:"primary",icon:"inspect",className:"open-toolbar",onClick:v,children:[(0,H.jsx)("span",{className:"open-label",children:"Open toolbar on this page"}),a&&(0,H.jsx)(ci,{binding:a.toLowerCase(),size:"sm"})]}),a===""&&(0,H.jsxs)("p",{className:"popup-hint",children:[(0,H.jsx)("span",{className:"codicon codicon-keyboard","aria-hidden":"true"}),(0,H.jsx)("span",{children:"No shortcut is set for this."}),(0,H.jsx)(Jt,{size:"sm",variant:"ghost",onClick:()=>{chrome.tabs.create({url:"chrome://extensions/shortcuts"})},children:"Set one"})]}),c&&(0,H.jsxs)("p",{className:"popup-error",role:"alert",children:[(0,H.jsx)("span",{className:"codicon codicon-error","aria-hidden":"true"}),c]})]}),(0,H.jsx)("section",{className:"popup-keys","aria-label":"Main shortcuts",children:$0.map(p=>{let y=Kv.find(T=>T.id===p),k=n[p]?.[0];return y?(0,H.jsxs)("div",{className:"key-tile",children:[(0,H.jsxs)("span",{className:"key-tile-label",children:[(0,H.jsx)("span",{className:`codicon codicon-${I0[p]}`,"aria-hidden":"true"}),Jv(y)]}),k?(0,H.jsx)(ci,{binding:k,size:"sm"}):(0,H.jsx)("span",{className:"muted",children:"No key"})]},p):null})}),(0,H.jsxs)("footer",{className:"popup-foot",children:[(0,H.jsx)(Jt,{size:"sm",variant:"ghost",icon:"link-external",onClick:()=>ng(),children:"Open Inkspect"}),e.projects&&(0,H.jsx)(Jt,{size:"sm",variant:"ghost",icon:"layout-sidebar-right",onClick:()=>ey(r),children:"Saved"}),(0,H.jsx)(Hd,{icon:"keyboard",label:"Change shortcuts",onClick:()=>ng("shortcuts")})]})]})}var ag=document.createElement("style");ag.textContent=[id,rd,dd,$v,Iv,tg].join(`
`);document.head.append(ag);document.documentElement.classList.add("ink-theme");ud(document);(0,og.createRoot)(document.getElementById("root")).render((0,H.jsx)(ty,{}));})();
