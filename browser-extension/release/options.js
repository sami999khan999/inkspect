"use strict";(()=>{var Lg=Object.create;var wd=Object.defineProperty;var Yg=Object.getOwnPropertyDescriptor;var jg=Object.getOwnPropertyNames;var Vg=Object.getPrototypeOf,Gg=Object.prototype.hasOwnProperty;var vt=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var Qg=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of jg(t))!Gg.call(e,a)&&a!==n&&wd(e,a,{get:()=>t[a],enumerable:!(o=Yg(t,a))||o.enumerable});return e};var U=(e,t,n)=>(n=e!=null?Lg(Vg(e)):{},Qg(t||!e||!e.__esModule?wd(n,"default",{value:e,enumerable:!0}):n,e));var $d=vt(O=>{"use strict";var mi=Symbol.for("react.transitional.element"),$g=Symbol.for("react.portal"),Ig=Symbol.for("react.fragment"),Pg=Symbol.for("react.strict_mode"),em=Symbol.for("react.profiler"),tm=Symbol.for("react.consumer"),nm=Symbol.for("react.context"),om=Symbol.for("react.forward_ref"),am=Symbol.for("react.suspense"),lm=Symbol.for("react.memo"),Gd=Symbol.for("react.lazy"),cm=Symbol.for("react.activity"),im=Symbol.for("react.view_transition"),Ld=Symbol.iterator;function rm(e){return e===null||typeof e!="object"?null:(e=Ld&&e[Ld]||e["@@iterator"],typeof e=="function"?e:null)}var Qd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Xd=Object.assign,Zd={};function io(e,t,n){this.props=e,this.context=t,this.refs=Zd,this.updater=n||Qd}io.prototype.isReactComponent={};io.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};io.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Kd(){}Kd.prototype=io.prototype;function hi(e,t,n){this.props=e,this.context=t,this.refs=Zd,this.updater=n||Qd}var yi=hi.prototype=new Kd;yi.constructor=hi;Xd(yi,io.prototype);yi.isPureReactComponent=!0;var Yd=Array.isArray;function gi(){}var W={H:null,A:null,T:null,S:null},Jd=Object.prototype.hasOwnProperty;function ki(e,t,n){var o=n.ref;return{$$typeof:mi,type:e,key:t,ref:o!==void 0?o:null,props:n}}function um(e,t){return ki(e.type,t,e.props)}function xi(e){return typeof e=="object"&&e!==null&&e.$$typeof===mi}function dm(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var jd=/\/+/g;function vi(e,t){return typeof e=="object"&&e!==null&&e.key!=null?dm(""+e.key):t.toString(36)}function sm(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(gi,gi):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function co(e,t,n,o,a){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var c=!1;if(e===null)c=!0;else switch(l){case"bigint":case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case mi:case $g:c=!0;break;case Gd:return c=e._init,co(c(e._payload),t,n,o,a)}}if(c)return a=a(e),c=o===""?"."+vi(e,0):o,Yd(a)?(n="",c!=null&&(n=c.replace(jd,"$&/")+"/"),co(a,t,n,"",function(u){return u})):a!=null&&(xi(a)&&(a=um(a,n+(a.key==null||e&&e.key===a.key?"":(""+a.key).replace(jd,"$&/")+"/")+c)),t.push(a)),1;c=0;var i=o===""?".":o+":";if(Yd(e))for(var r=0;r<e.length;r++)o=e[r],l=i+vi(o,r),c+=co(o,t,n,l,a);else if(r=rm(e),typeof r=="function")for(e=r.call(e),r=0;!(o=e.next()).done;)o=o.value,l=i+vi(o,r++),c+=co(o,t,n,l,a);else if(l==="object"){if(typeof e.then=="function")return co(sm(e),t,n,o,a);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return c}function kl(e,t,n){if(e==null)return e;var o=[],a=0;return co(e,o,"","",function(l){return t.call(n,l,a++)}),o}function fm(e){if(e._status===-1){var t=e._result,n=t();n.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,n.status===void 0&&(n.status="fulfilled",n.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,n.status===void 0&&(n.status="rejected",n.reason=o))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var Vd=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function Fd(e){var t=W.T,n={};n.types=t!==null?t.types:null,W.T=n;try{var o=e(),a=W.S;a!==null&&a(n,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(gi,Vd)}catch(l){Vd(l)}finally{t!==null&&n.types!==null&&(t.types=n.types),W.T=t}}function Wd(e){var t=W.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else Fd(Wd.bind(null,e))}var bm={map:kl,forEach:function(e,t,n){kl(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return kl(e,function(){t++}),t},toArray:function(e){return kl(e,function(t){return t})||[]},only:function(e){if(!xi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};O.Activity=cm;O.Children=bm;O.Component=io;O.Fragment=Ig;O.Profiler=em;O.PureComponent=hi;O.StrictMode=Pg;O.Suspense=am;O.ViewTransition=im;O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=W;O.__COMPILER_RUNTIME={__proto__:null,c:function(e){return W.H.useMemoCache(e)}};O.addTransitionType=Wd;O.cache=function(e){return function(){return e.apply(null,arguments)}};O.cacheSignal=function(){return null};O.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=Xd({},e.props),a=e.key;if(t!=null)for(l in t.key!==void 0&&(a=""+t.key),t)!Jd.call(t,l)||l==="key"||l==="__self"||l==="__source"||l==="ref"&&t.ref===void 0||(o[l]=t[l]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var c=Array(l),i=0;i<l;i++)c[i]=arguments[i+2];o.children=c}return ki(e.type,a,o)};O.createContext=function(e){return e={$$typeof:nm,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:tm,_context:e},e};O.createElement=function(e,t,n){var o,a={},l=null;if(t!=null)for(o in t.key!==void 0&&(l=""+t.key),t)Jd.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(a[o]=t[o]);var c=arguments.length-2;if(c===1)a.children=n;else if(1<c){for(var i=Array(c),r=0;r<c;r++)i[r]=arguments[r+2];a.children=i}if(e&&e.defaultProps)for(o in c=e.defaultProps,c)a[o]===void 0&&(a[o]=c[o]);return ki(e,l,a)};O.createRef=function(){return{current:null}};O.forwardRef=function(e){return{$$typeof:om,render:e}};O.isValidElement=xi;O.lazy=function(e){return{$$typeof:Gd,_payload:{_status:-1,_result:e},_init:fm}};O.memo=function(e,t){return{$$typeof:lm,type:e,compare:t===void 0?null:t}};O.startTransition=Fd;O.unstable_useCacheRefresh=function(){return W.H.useCacheRefresh()};O.use=function(e){return W.H.use(e)};O.useActionState=function(e,t,n){return W.H.useActionState(e,t,n)};O.useCallback=function(e,t){return W.H.useCallback(e,t)};O.useContext=function(e){return W.H.useContext(e)};O.useDebugValue=function(){};O.useDeferredValue=function(e,t){return W.H.useDeferredValue(e,t)};O.useEffect=function(e,t){return W.H.useEffect(e,t)};O.useEffectEvent=function(e){return W.H.useEffectEvent(e)};O.useId=function(){return W.H.useId()};O.useImperativeHandle=function(e,t,n){return W.H.useImperativeHandle(e,t,n)};O.useInsertionEffect=function(e,t){return W.H.useInsertionEffect(e,t)};O.useLayoutEffect=function(e,t){return W.H.useLayoutEffect(e,t)};O.useMemo=function(e,t){return W.H.useMemo(e,t)};O.useOptimistic=function(e,t){return W.H.useOptimistic(e,t)};O.useReducer=function(e,t,n){return W.H.useReducer(e,t,n)};O.useRef=function(e){return W.H.useRef(e)};O.useState=function(e){return W.H.useState(e)};O.useSyncExternalStore=function(e,t,n){return W.H.useSyncExternalStore(e,t,n)};O.useTransition=function(){return W.H.useTransition()};O.version="19.3.0"});var Ie=vt((Xy,Id)=>{"use strict";Id.exports=$d()});var ns=vt(xl=>{"use strict";var vm=Symbol.for("react.transitional.element"),gm=Symbol.for("react.fragment");function ts(e,t,n){var o=null;if(n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:vm,type:e,key:o,ref:t!==void 0?t:null,props:n}}xl.Fragment=gm;xl.jsx=ts;xl.jsxs=ts});var ee=vt((Jy,os)=>{"use strict";os.exports=ns()});var Ss=vt(te=>{"use strict";function Ci(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,a=e[o];if(0<wl(a,t))e[o]=t,e[n]=a,n=o;else break e}}function gt(e){return e.length===0?null:e[0]}function El(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,a=e.length,l=a>>>1;o<l;){var c=2*(o+1)-1,i=e[c],r=c+1,u=e[r];if(0>wl(i,n))r<a&&0>wl(u,i)?(e[o]=u,e[r]=n,o=r):(e[o]=i,e[c]=n,o=c);else if(r<a&&0>wl(u,n))e[o]=u,e[r]=n,o=r;else break e}}return t}function wl(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}te.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(bs=performance,te.unstable_now=function(){return bs.now()}):(zi=Date,ps=zi.now(),te.unstable_now=function(){return zi.now()-ps});var bs,zi,ps,Dt=[],Pt=[],km=1,Pe=null,Ee=3,Ai=!1,fa=!1,ba=!1,_i=!1,ms=typeof setTimeout=="function"?setTimeout:null,hs=typeof clearTimeout=="function"?clearTimeout:null,vs=typeof setImmediate<"u"?setImmediate:null;function Tl(e){for(var t=gt(Pt);t!==null;){if(t.callback===null)El(Pt);else if(t.startTime<=e)El(Pt),t.sortIndex=t.expirationTime,Ci(Dt,t);else break;t=gt(Pt)}}function Mi(e){if(ba=!1,Tl(e),!fa)if(gt(Dt)!==null)fa=!0,fo||(fo=!0,so());else{var t=gt(Pt);t!==null&&Di(Mi,t.startTime-e)}}var fo=!1,pa=-1,ys=5,ks=-1;function xs(){return _i?!0:!(te.unstable_now()-ks<ys)}function Ni(){if(_i=!1,fo){var e=te.unstable_now();ks=e;var t=!0;try{e:{fa=!1,ba&&(ba=!1,hs(pa),pa=-1),Ai=!0;var n=Ee;try{t:{for(Tl(e),Pe=gt(Dt);Pe!==null&&!(Pe.expirationTime>e&&xs());){var o=Pe.callback;if(typeof o=="function"){Pe.callback=null,Ee=Pe.priorityLevel;var a=o(Pe.expirationTime<=e);if(e=te.unstable_now(),typeof a=="function"){Pe.callback=a,Tl(e),t=!0;break t}Pe===gt(Dt)&&El(Dt),Tl(e)}else El(Dt);Pe=gt(Dt)}if(Pe!==null)t=!0;else{var l=gt(Pt);l!==null&&Di(Mi,l.startTime-e),t=!1}}break e}finally{Pe=null,Ee=n,Ai=!1}t=void 0}}finally{t?so():fo=!1}}}var so;typeof vs=="function"?so=function(){vs(Ni)}:typeof MessageChannel<"u"?(Oi=new MessageChannel,gs=Oi.port2,Oi.port1.onmessage=Ni,so=function(){gs.postMessage(null)}):so=function(){ms(Ni,0)};var Oi,gs;function Di(e,t){pa=ms(function(){e(te.unstable_now())},t)}te.unstable_IdlePriority=5;te.unstable_ImmediatePriority=1;te.unstable_LowPriority=4;te.unstable_NormalPriority=3;te.unstable_Profiling=null;te.unstable_UserBlockingPriority=2;te.unstable_cancelCallback=function(e){e.callback=null};te.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ys=0<e?Math.floor(1e3/e):5};te.unstable_getCurrentPriorityLevel=function(){return Ee};te.unstable_next=function(e){switch(Ee){case 1:case 2:case 3:var t=3;break;default:t=Ee}var n=Ee;Ee=t;try{return e()}finally{Ee=n}};te.unstable_requestPaint=function(){_i=!0};te.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=Ee;Ee=e;try{return t()}finally{Ee=n}};te.unstable_scheduleCallback=function(e,t,n){var o=te.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=n+a,e={id:km++,callback:t,priorityLevel:e,startTime:n,expirationTime:a,sortIndex:-1},n>o?(e.sortIndex=n,Ci(Pt,e),gt(Dt)===null&&e===gt(Pt)&&(ba?(hs(pa),pa=-1):ba=!0,Di(Mi,n-o))):(e.sortIndex=a,Ci(Dt,e),fa||Ai||(fa=!0,fo||(fo=!0,so()))),e};te.unstable_shouldYield=xs;te.unstable_wrapCallback=function(e){var t=Ee;return function(){var n=Ee;Ee=t;try{return e.apply(this,arguments)}finally{Ee=n}}}});var Ts=vt((p1,ws)=>{"use strict";ws.exports=Ss()});var Ns=vt(ze=>{"use strict";var xm=Ie();function zs(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function en(){}var Oe={d:{f:en,r:function(){throw Error(zs(522))},D:en,C:en,L:en,m:en,X:en,S:en,M:en},p:0,findDOMNode:null},Sm=Symbol.for("react.portal"),wm=Symbol.for("react.recoverable"),Es=Symbol.for("react.optimistic_key");function Tm(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Sm,key:o==null?null:o===Es?Es:""+o,children:e,containerInfo:t,implementation:n}}var va=xm.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function zl(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}ze.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Oe;ze.browser=function(e){return{$$typeof:wm,_reason:e}};ze.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(zs(299));return Tm(e,t,null,n)};ze.flushSync=function(e){var t=va.T,n=Oe.p;try{if(va.T=null,Oe.p=2,e)return e()}finally{va.T=t,Oe.p=n,Oe.d.f()}};ze.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Oe.d.C(e,t))};ze.prefetchDNS=function(e){typeof e=="string"&&Oe.d.D(e)};ze.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,o=zl(n,t.crossOrigin),a=typeof t.integrity=="string"?t.integrity:void 0,l=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Oe.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:o,integrity:a,fetchPriority:l}):n==="script"&&Oe.d.X(e,{crossOrigin:o,integrity:a,fetchPriority:l,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};ze.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=zl(t.as,t.crossOrigin);Oe.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}}else t==null&&Oe.d.M(e)};ze.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,o=zl(n,t.crossOrigin);Oe.d.L(e,n,{crossOrigin:o,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};ze.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=zl(t.as,t.crossOrigin);Oe.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}else Oe.d.m(e)};ze.requestFormReset=function(e){Oe.d.r(e)};ze.unstable_batchedUpdates=function(e,t){return e(t)};ze.useFormState=function(e,t,n){return va.H.useFormState(e,t,n)};ze.useFormStatus=function(){return va.H.useHostTransitionStatus()};ze.version="19.3.0"});var As=vt((g1,Cs)=>{"use strict";function Os(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Os)}catch(e){console.error(e)}}Os(),Cs.exports=Ns()});var mg=vt(ii=>{"use strict";var be=Ts(),gb=Ie(),Em=As();function h(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function mb(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function nl(e){for(var t=e,n=t;n&&!n.alternate;)t=n,(t.flags&4098)!==0&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function hb(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function yb(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function _s(e){if(nl(e)!==e)throw Error(h(188))}function zm(e){var t=e.alternate;if(!t){if(t=nl(e),t===null)throw Error(h(188));return t!==e?null:e}for(var n=e,o=t;;){var a=n.return;if(a===null)break;var l=a.alternate;if(l===null){if(o=a.return,o!==null){n=o;continue}break}if(a.child===l.child){for(l=a.child;l;){if(l===n)return _s(a),e;if(l===o)return _s(a),t;l=l.sibling}throw Error(h(188))}if(n.return!==o.return)n=a,o=l;else{for(var c=!1,i=a.child;i;){if(i===n){c=!0,n=a,o=l;break}if(i===o){c=!0,o=a,n=l;break}i=i.sibling}if(!c){for(i=l.child;i;){if(i===n){c=!0,n=l,o=a;break}if(i===o){c=!0,o=l,n=a;break}i=i.sibling}if(!c)throw Error(h(189))}}if(n.alternate!==o)throw Error(h(190))}if(n.tag!==3)throw Error(h(188));return n.stateNode.current===n?e:t}function kb(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=kb(e),t!==null)return t;e=e.sibling}return null}function qe(e,t,n,o,a,l){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,o,a,l)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&qe(e.child,t,n,o,a,l))return!0;e=e.sibling}return!1}function to(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function Ms(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return t}function xb(e){var t=[null,null],n=to(e);return n===null||Sb(t,e,n.child,{foundSelf:!1}),t}function Sb(e,t,n,o){for(;n!==null;){if(n===t)o.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(o.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&Sb(e,t,n.child,o))return!0;n=n.sibling}return!1}function fe(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(h(559))}}var yo=null,sr=null;function Nm(e,t,n){return e===n?!0:e===t?(yo=e,!0):!1}function Om(e,t,n){return e===n?(sr=e,!1):e===t?(sr!==null&&(yo=e),!0):!1}function Ds(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function fr(e,t,n){for(var o=0,a=e;a;a=n(a))o++;a=0;for(var l=t;l;l=n(l))a++;for(;0<o-a;)e=n(e),o--;for(;0<a-o;)t=n(t),a--;for(;o--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var F=Object.assign,Cm=Symbol.for("react.element"),Nl=Symbol.for("react.transitional.element"),Sa=Symbol.for("react.portal"),ko=Symbol.for("react.fragment"),wb=Symbol.for("react.strict_mode"),br=Symbol.for("react.profiler"),Tb=Symbol.for("react.consumer"),St=Symbol.for("react.context"),Su=Symbol.for("react.forward_ref"),pr=Symbol.for("react.suspense"),vr=Symbol.for("react.suspense_list"),wu=Symbol.for("react.memo"),an=Symbol.for("react.lazy"),gr=Symbol.for("react.activity"),Am=Symbol.for("react.legacy_hidden"),_m=Symbol.for("react.memo_cache_sentinel"),mr=Symbol.for("react.view_transition"),Mm=Symbol.for("react.recoverable"),Rs=Symbol.iterator;function ga(e){return e===null||typeof e!="object"?null:(e=Rs&&e[Rs]||e["@@iterator"],typeof e=="function"?e:null)}var Dm=Symbol.for("react.client.reference");function hr(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Dm?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ko:return"Fragment";case br:return"Profiler";case wb:return"StrictMode";case pr:return"Suspense";case vr:return"SuspenseList";case gr:return"Activity";case mr:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case Sa:return"Portal";case St:return e.displayName||"Context";case Tb:return(e._context.displayName||"Context")+".Consumer";case Su:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case wu:return t=e.displayName||null,t!==null?t:hr(e.type)||"Memo";case an:t=e._payload,e=e._init;try{return hr(e(t))}catch{}}return null}var wa=Array.isArray,N=gb.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,j=Em.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Vn={pending:!1,data:null,method:null,action:null},yr=[],xo=-1;function Ct(e){return{current:e}}function xe(e){0>xo||(e.current=yr[xo],yr[xo]=null,xo--)}function P(e,t){xo++,yr[xo]=e.current,e.current=t}var zt=Ct(null),Ya=Ct(null),pn=Ct(null),bc=Ct(null);function pc(e,t){switch(P(pn,t),P(Ya,e),P(zt,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Ff(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Ff(t),e=Zv(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}xe(zt),P(zt,e)}function jo(){xe(zt),xe(Ya),xe(pn)}function kr(e){var t=e.memoizedState;t!==null&&($o._currentValue=t.memoizedState,P(bc,e)),t=zt.current;var n=Zv(t,e.type);t!==n&&(P(Ya,e),P(zt,n))}function vc(e){Ya.current===e&&(xe(zt),xe(Ya)),bc.current===e&&(xe(bc),$o._currentValue=Vn)}var Ri,Bs;function nn(e){if(Ri===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ri=t&&t[1]||"",Bs=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ri+e+Bs}var Bi=!1;function Ui(e,t){if(!e||Bi)return"";Bi=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var g=function(){throw Error()};if(Object.defineProperty(g.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(g,[])}catch(y){var d=y}Reflect.construct(e,[],g)}else{try{g.call()}catch(y){d=y}g=!1;try{var p=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),g=!0,new e}finally{g&&(p!==void 0?Object.defineProperty(e.prototype,"props",p):delete e.prototype.props)}}}else{try{throw Error()}catch(y){d=y}(g=e())&&typeof g.catch=="function"&&g.catch(function(){})}}catch(y){if(y&&d&&typeof y.stack=="string")return[y.stack,d.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=o.DetermineComponentFrameRoot(),c=l[0],i=l[1];if(c&&i){var r=c.split(`
`),u=i.split(`
`);for(a=o=0;o<r.length&&!r[o].includes("DetermineComponentFrameRoot");)o++;for(;a<u.length&&!u[a].includes("DetermineComponentFrameRoot");)a++;if(o===r.length||a===u.length)for(o=r.length-1,a=u.length-1;1<=o&&0<=a&&r[o]!==u[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==u[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==u[a]){var f=`
`+r[o].replace(" at new "," at ");return e.displayName&&f.includes("<anonymous>")&&(f=f.replace("<anonymous>",e.displayName)),f}while(1<=o&&0<=a);break}}}finally{Bi=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?nn(n):""}function Rm(e,t){switch(e.tag){case 26:case 27:case 5:return nn(e.type);case 16:return nn("Lazy");case 13:return e.child!==t&&t!==null?nn("Suspense Fallback"):nn("Suspense");case 19:return nn("SuspenseList");case 0:case 15:return Ui(e.type,!1);case 11:return Ui(e.type.render,!1);case 1:return Ui(e.type,!0);case 31:return nn("Activity");case 30:return nn("ViewTransition");default:return""}}function Us(e){try{var t="",n=null;do t+=Rm(e,n),n=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var xr=Object.prototype.hasOwnProperty,Tu=be.unstable_scheduleCallback,Hi=be.unstable_cancelCallback,Bm=be.unstable_shouldYield,Um=be.unstable_requestPaint,Ze=be.unstable_now,Hm=be.unstable_getCurrentPriorityLevel,Eb=be.unstable_ImmediatePriority,zb=be.unstable_UserBlockingPriority,gc=be.unstable_NormalPriority,qm=be.unstable_LowPriority,Nb=be.unstable_IdlePriority,Lm=be.log,Ym=be.unstable_setDisableYieldValue,ol=null,Ke=null;function rn(e){if(typeof Lm=="function"&&Ym(e),Ke&&typeof Ke.setStrictMode=="function")try{Ke.setStrictMode(ol,e)}catch{}}var Je=Math.clz32?Math.clz32:Gm,jm=Math.log,Vm=Math.LN2;function Gm(e){return e>>>=0,e===0?32:31-(jm(e)/Vm|0)|0}var Ol=256,Cl=262144,Al=4194304;function Hn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Vc(e,t,n){var o=e.pendingLanes;if(o===0)return 0;var a=0,l=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var i=o&134217727;return i!==0?(o=i&~l,o!==0?a=Hn(o):(c&=i,c!==0?a=Hn(c):n||(n=i&~e,n!==0&&(a=Hn(n))))):(i=o&~l,i!==0?a=Hn(i):c!==0?a=Hn(c):n||(n=o&~e,n!==0&&(a=Hn(n)))),a===0?0:t!==0&&t!==a&&(t&l)===0&&(l=a&-a,n=t&-t,l>=n||l===32&&(n&4194048)!==0)?t:a}function al(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Ob(e,t){(t&8)!==0&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var o=31-Je(n),a=1<<o;t|=e[o],n&=~a}return t}function Qm(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Cb(){var e=Al;return Al<<=1,(Al&62914560)===0&&(Al=4194304),e}function qi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ll(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Xm(e,t,n,o,a,l){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var i=e.entanglements,r=e.expirationTimes,u=e.hiddenUpdates;for(n=c&~n;0<n;){var f=31-Je(n),g=1<<f;i[f]=0,r[f]=-1;var d=u[f];if(d!==null)for(u[f]=null,f=0;f<d.length;f++){var p=d[f];p!==null&&(p.lane&=-536870913)}n&=~g}o!==0&&Ab(e,o,0),l!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=l&~(c&~t))}function Ab(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-Je(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|n&261930}function _b(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-Je(n),a=1<<o;a&t|e[o]&t&&(e[o]|=t),n&=~a}}function Mb(e,t){var n=t&-t;return n=(n&42)!==0?1:Eu(n),(n&(e.suspendedLanes|t))!==0?0:n}function Eu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function zu(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Db(){var e=j.p;return e!==0?e:(e=window.event,e===void 0?32:pg(e.type))}function Hs(e,t){var n=j.p;try{return j.p=e,t()}finally{j.p=n}}var Zt=Math.random().toString(36).slice(2),ye="__reactFiber$"+Zt,Le="__reactProps$"+Zt,ea="__reactContainer$"+Zt,qs="__reactEvents$"+Zt,Zm="__reactListeners$"+Zt,Km="__reactHandles$"+Zt,Ls="__reactResources$"+Zt,cl="__reactMarker$"+Zt,mc="__reactLoad$"+Zt;function Gc(e){delete e[ye],delete e[Le],delete e[Zm],delete e[Km]}function Yn(e){var t;if(t=e[ye])return t;for(var n=e.parentNode;n;){if(t=n[ea]||n[ye]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ob(e);e!==null;){if(n=e[ye])return n;e=ob(e)}return t}e=n,n=e.parentNode}return null}function ta(e){if(e=e[ye]||e[ea]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Ta(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(h(33))}function _o(e){var t=e[Ls];return t||(t=e[Ls]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function ge(e){e[cl]=!0}function Rb(e){e[mc]=void 0}var Bb=new Set,Ub={};function no(e,t){Vo(e,t),Vo(e+"Capture",t)}function Vo(e,t){for(Ub[e]=t,e=0;e<t.length;e++)Bb.add(t[e])}var Jm=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Ys={},js={};function Fm(e){return xr.call(js,e)?!0:xr.call(Ys,e)?!1:Jm.test(e)?js[e]=!0:(Ys[e]=!0,!1)}var q=!1;function Vs(){var e=q;return q=!1,e}function Jl(e,t,n){if(Fm(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,n)}}function _l(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,n)}}function Rt(e,t,n,o){if(o===null)e.removeAttribute(n);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,o)}}function Ve(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Hb(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Wm(e,t,n){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var a=o.get,l=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,l.call(this,c)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Sr(e){if(!e._valueTracker){var t=Hb(e)?"checked":"value";e._valueTracker=Wm(e,t,""+e[t])}}function qb(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Hb(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}var $m=/[\n"\\]/g;function at(e){return e.replace($m,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function wr(e,t,n,o,a,l,c,i){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Ve(t)):e.value!==""+Ve(t)&&(e.value=""+Ve(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?c==="number"&&e.value==t?Li(e,Ve(e.value)):Li(e,Ve(t)):n!=null?Li(e,Ve(n)):o!=null&&e.removeAttribute("value"),a==null&&l!=null&&(e.defaultChecked=!!l),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"?e.name=""+Ve(i):e.removeAttribute("name")}function Lb(e,t,n,o,a,l,c,i){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),t!=null||n!=null){if(!(l!=="submit"&&l!=="reset"||t!=null)){Sr(e);return}n=n!=null?""+Ve(n):"",t=t!=null?""+Ve(t):n,i||t===e.value||(e.value=t),e.defaultValue=t}o=o??a,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=i?e.checked:!!o,e.defaultChecked=!!o,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),Sr(e)}function Li(e,t){e.defaultValue!==""+t&&(e.defaultValue=""+t)}function Mo(e,t,n,o){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Ve(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function Yb(e,t,n){if(t!=null&&(t=""+Ve(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Ve(n):""}function jb(e,t,n,o){if(t==null){if(o!=null){if(n!=null)throw Error(h(92));if(wa(o)){if(1<o.length)throw Error(h(93));o=o[0]}n=o}n==null&&(n=""),t=n}n=Ve(t),e.defaultValue=n,o=e.textContent,o===n&&o!==""&&o!==null&&(e.value=o),Sr(e)}function Go(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Im=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Gs(e,t,n){var o=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,n):typeof n!="number"||n===0||Im.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Vb(e,t,n){if(t!=null&&typeof t!="object")throw Error(h(62));if(e=e.style,n!=null){for(var o in n)!n.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="",q=!0);for(var a in t)o=t[a],t.hasOwnProperty(a)&&n[a]!==o&&(Gs(e,a,o),q=!0)}else for(var l in t)t.hasOwnProperty(l)&&Gs(e,l,t[l])}function Nu(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Pm=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),eh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Fl(e){return eh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function wt(){}var Tr=null;function Ou(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var So=null,Do=null;function Qs(e){var t=ta(e);if(t&&(e=t.stateNode)){var n=e[Le]||null;e:switch(e=t.stateNode,t.type){case"input":if(wr(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+at(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=o[Le]||null;if(!a)throw Error(h(90));wr(o,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)o=n[t],o.form===e.form&&qb(o)}break e;case"textarea":Yb(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Mo(e,!!n.multiple,t,!1)}}}var Yi=!1;function Gb(e,t,n){if(Yi)return e(t,n);Yi=!0;try{var o=e(t);return o}finally{if(Yi=!1,(So!==null||Do!==null)&&(oi(),So&&(t=So,e=Do,Do=So=null,Qs(t),e)))for(t=0;t<e.length;t++)Qs(e[t])}}function ja(e,t){var n=e.stateNode;if(n===null)return null;var o=n[Le]||null;if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(h(231,t,typeof n));return n}var Yt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Er=!1;if(Yt)try{bo={},Object.defineProperty(bo,"passive",{get:function(){Er=!0}}),window.addEventListener("test",bo,bo),window.removeEventListener("test",bo,bo)}catch{Er=!1}var bo,un=null,Cu=null,Wl=null;function Qb(){if(Wl)return Wl;var e,t=Cu,n=t.length,o,a="value"in un?un.value:un.textContent,l=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===a[l-o];o++);return Wl=a.slice(e,1<o?1-o:void 0)}function $l(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ml(){return!0}function Xs(){return!1}function Me(e){function t(n,o,a,l,c){this._reactName=n,this._targetInst=a,this.type=o,this.nativeEvent=l,this.target=c,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Ml:Xs,this.isPropagationStopped=Xs,this}return F(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ml)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ml)},persist:function(){},isPersistent:Ml}),t}var Cn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Qc=Me(Cn),il=F({},Cn,{view:0,detail:0}),th=Me(il),ji,Vi,ma,Xc=F({},il,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Au,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ma&&(ma&&e.type==="mousemove"?(ji=e.screenX-ma.screenX,Vi=e.screenY-ma.screenY):Vi=ji=0,ma=e),ji)},movementY:function(e){return"movementY"in e?e.movementY:Vi}}),Zs=Me(Xc),nh=F({},Xc,{dataTransfer:0}),oh=Me(nh),ah=F({},il,{relatedTarget:0}),Gi=Me(ah),lh=F({},Cn,{animationName:0,elapsedTime:0,pseudoElement:0}),ch=Me(lh),ih=F({},Cn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),rh=Me(ih),uh=F({},Cn,{data:0}),Ks=Me(uh),dh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},sh={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},fh={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function bh(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=fh[e])?!!t[e]:!1}function Au(){return bh}var ph=F({},il,{key:function(e){if(e.key){var t=dh[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=$l(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?sh[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Au,charCode:function(e){return e.type==="keypress"?$l(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?$l(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),vh=Me(ph),gh=F({},Xc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Js=Me(gh),mh=F({},Cn,{submitter:0}),hh=Me(mh),yh=F({},il,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Au}),kh=Me(yh),xh=F({},Cn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Sh=Me(xh),wh=F({},Xc,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Th=Me(wh),Eh=F({},Cn,{newState:0,oldState:0,source:0}),zh=Me(Eh),Nh=[9,13,27,32],_u=Yt&&"CompositionEvent"in window,Na=null;Yt&&"documentMode"in document&&(Na=document.documentMode);var Oh=Yt&&"TextEvent"in window&&!Na,Xb=Yt&&(!_u||Na&&8<Na&&11>=Na),Fs=" ",Ws=!1;function Zb(e,t){switch(e){case"keyup":return Nh.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Kb(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var wo=!1;function Ch(e,t){switch(e){case"compositionend":return Kb(t);case"keypress":return t.which!==32?null:(Ws=!0,Fs);case"textInput":return e=t.data,e===Fs&&Ws?null:e;default:return null}}function Ah(e,t){if(wo)return e==="compositionend"||!_u&&Zb(e,t)?(e=Qb(),Wl=Cu=un=null,wo=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Xb&&t.locale!=="ko"?null:t.data;default:return null}}var _h={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function $s(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!_h[e.type]:t==="textarea"}function Jb(e,t,n,o){So?Do?Do.push(o):Do=[o]:So=o,t=Lc(t,"onChange"),0<t.length&&(n=new Qc("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var Oa=null,Va=null;function Mh(e){Gv(e,0)}function Zc(e){var t=Ta(e);if(qb(t))return e}function Is(e,t){if(e==="change")return t}var Fb=!1;Yt&&(Yt?(Rl="oninput"in document,Rl||(Qi=document.createElement("div"),Qi.setAttribute("oninput","return;"),Rl=typeof Qi.oninput=="function"),Dl=Rl):Dl=!1,Fb=Dl&&(!document.documentMode||9<document.documentMode));var Dl,Rl,Qi;function Ps(){Oa&&(Oa.detachEvent("onpropertychange",Wb),Va=Oa=null)}function Wb(e){if(e.propertyName==="value"&&Zc(Va)){var t=[];Jb(t,Va,e,Ou(e)),Gb(Mh,t)}}function Dh(e,t,n){e==="focusin"?(Ps(),Oa=t,Va=n,Oa.attachEvent("onpropertychange",Wb)):e==="focusout"&&Ps()}function Rh(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Zc(Va)}function Bh(e,t){if(e==="click")return Zc(t)}function Uh(e,t){if(e==="input"||e==="change")return Zc(t)}function Hh(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var We=typeof Object.is=="function"?Object.is:Hh;function Ga(e,t){if(We(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var a=n[o];if(!xr.call(t,a)||!We(e[a],t[a]))return!1}return!0}function zr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ef(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function tf(e,t){var n=ef(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ef(n)}}function $b(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?$b(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ib(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=zr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=zr(e.document)}return t}function Mu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var qh=Yt&&"documentMode"in document&&11>=document.documentMode,To=null,Nr=null,Ca=null,Or=!1;function nf(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Or||To==null||To!==zr(o)||(o=To,"selectionStart"in o&&Mu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),Ca&&Ga(Ca,o)||(Ca=o,o=Lc(Nr,"onSelect"),0<o.length&&(t=new Qc("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=To)))}function Bn(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Eo={animationend:Bn("Animation","AnimationEnd"),animationiteration:Bn("Animation","AnimationIteration"),animationstart:Bn("Animation","AnimationStart"),transitionrun:Bn("Transition","TransitionRun"),transitionstart:Bn("Transition","TransitionStart"),transitioncancel:Bn("Transition","TransitionCancel"),transitionend:Bn("Transition","TransitionEnd")},Xi={},Pb={};Yt&&(Pb=document.createElement("div").style,"AnimationEvent"in window||(delete Eo.animationend.animation,delete Eo.animationiteration.animation,delete Eo.animationstart.animation),"TransitionEvent"in window||delete Eo.transitionend.transition);function oo(e){if(Xi[e])return Xi[e];if(!Eo[e])return e;var t=Eo[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Pb)return Xi[e]=t[n];return e}var ep=oo("animationend"),tp=oo("animationiteration"),np=oo("animationstart"),Lh=oo("transitionrun"),Yh=oo("transitionstart"),jh=oo("transitioncancel"),op=oo("transitionend"),ap=new Map,Cr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Cr.push("scrollEnd");function pt(e,t){ap.set(e,t),no(t,[e])}var Vh=0;function jt(e,t){if(e.name!=null&&e.name!=="auto")return e.name;if(t.autoName!==null)return t.autoName;e=bt.identifierPrefix;var n=Vh++;return e="_"+e+"t_"+n.toString(32)+"_",t.autoName=e}function of(e){if(e==null||typeof e=="string")return e;var t=null,n=Yo;if(n!==null)for(var o=0;o<n.length;o++){var a=e[n[o]];if(a!=null){if(a==="none")return"none";t=t==null?a:t+(" "+a)}}return t??e.default}function Kt(e,t){return e=of(e),t=of(t),t==null?e==="auto"?null:e:t==="auto"?null:t}var hc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},tt=[],zo=0,Du=0;function Kc(){for(var e=zo,t=Du=zo=0;t<e;){var n=tt[t];tt[t++]=null;var o=tt[t];tt[t++]=null;var a=tt[t];tt[t++]=null;var l=tt[t];if(tt[t++]=null,o!==null&&a!==null){var c=o.pending;c===null?a.next=a:(a.next=c.next,c.next=a),o.pending=a}l!==0&&lp(n,a,l)}}function Jc(e,t,n,o){tt[zo++]=e,tt[zo++]=t,tt[zo++]=n,tt[zo++]=o,Du|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function Ru(e,t,n,o){return Jc(e,t,n,o),yc(e)}function ao(e,t){return Jc(e,null,null,t),yc(e)}function lp(e,t,n){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n);for(var a=!1,l=e.return;l!==null;)l.childLanes|=n,o=l.alternate,o!==null&&(o.childLanes|=n),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(a=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,a&&t!==null&&(a=31-Je(n),e=l.hiddenUpdates,o=e[a],o===null?e[a]=[t]:o.push(t),t.lane=n|536870912),l):null}function yc(e){if(50<La)throw La=0,ic=null,Error(h(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var No={};function Gh(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ue(e,t,n,o){return new Gh(e,t,n,o)}function Bu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function qt(e,t){var n=e.alternate;return n===null?(n=Ue(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function cp(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Il(e,t,n,o,a,l){var c=0;if(o=e,typeof o=="function")Bu(o)&&(c=1);else if(typeof o=="string")c=vy(e,n,zt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(o){case gr:return e=Ue(31,n,t,a),e.elementType=gr,e.lanes=l,e;case ko:return Gn(n.children,a,l,t);case wb:c=8,a|=24;break;case br:return e=Ue(12,n,t,a|2),e.elementType=br,e.lanes=l,e;case pr:return e=Ue(13,n,t,a),e.elementType=pr,e.lanes=l,e;case vr:return e=Ue(19,n,t,a),e.elementType=vr,e.lanes=l,e;case Am:case mr:return e=a|32,e=Ue(30,n,t,e),e.elementType=mr,e.lanes=l,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case St:c=10;break e;case Tb:c=9;break e;case Su:c=11;break e;case wu:c=14;break e;case an:c=16,o=null;break e}c=29,n=Error(h(130,e===null?"null":typeof e,"")),o=null}return t=Ue(c,n,t,a),t.elementType=e,t.type=o,t.lanes=l,t}function Gn(e,t,n,o){return e=Ue(7,e,o,t),e.lanes=n,e}function Zi(e,t,n){return e=Ue(6,e,null,t),e.lanes=n,e}function ip(e){var t=Ue(18,null,null,0);return t.stateNode=e,t}function Ki(e,t,n){return t=Ue(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var af=new WeakMap;function lt(e,t){if(typeof e=="object"&&e!==null){var n=af.get(e);return n!==void 0?n:(t={value:e,source:t,stack:Us(t)},af.set(e,t),t)}return{value:e,source:t,stack:Us(t)}}var Oo=[],Co=0,kc=null,Qa=0,nt=[],ot=0,Tn=null,Tt=1,Et="";function Ut(e,t){Oo[Co++]=Qa,Oo[Co++]=kc,kc=e,Qa=t}function rp(e,t,n){nt[ot++]=Tt,nt[ot++]=Et,nt[ot++]=Tn,Tn=e;var o=Tt;e=Et;var a=32-Je(o)-1;o&=~(1<<a),n+=1;var l=32-Je(t)+a;if(30<l){var c=a-a%5;l=(o&(1<<c)-1).toString(32),o>>=c,a-=c,Tt=1<<32-Je(t)+a|n<<a|o,Et=l+e}else Tt=1<<l|n<<a|o,Et=e}function Fc(e){e.return!==null&&(Ut(e,1),rp(e,1,0))}function Uu(e){for(;e===kc;)kc=Oo[--Co],Oo[Co]=null,Qa=Oo[--Co],Oo[Co]=null;for(;e===Tn;)Tn=nt[--ot],nt[ot]=null,Et=nt[--ot],nt[ot]=null,Tt=nt[--ot],nt[ot]=null}function up(e,t){nt[ot++]=Tt,nt[ot++]=Et,nt[ot++]=Tn,Tt=t.id,Et=t.overflow,Tn=e}var me=null,I=null,A=!1,vn=null,ct=!1,Ar=Error(h(519));function En(e){var t=Error(h(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Xa(lt(t,e)),Ar}function lf(e){var t=e.stateNode,n=e.type,o=e.memoizedProps;switch(t[ye]=e,t[Le]=o,n){case"dialog":M("cancel",t),M("close",t);break;case"iframe":case"object":case"embed":M("load",t);break;case"video":case"audio":for(n=0;n<Fa.length;n++)M(Fa[n],t);break;case"source":M("error",t);break;case"img":case"image":case"link":M("error",t),M("load",t);break;case"details":M("toggle",t);break;case"input":M("invalid",t),Lb(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":M("invalid",t);break;case"textarea":M("invalid",t),jb(t,o.value,o.defaultValue,o.children)}n=o.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||o.suppressHydrationWarning===!0||Xv(t.textContent,n)?(o.popover!=null&&(M("beforetoggle",t),M("toggle",t)),o.onScroll!=null&&M("scroll",t),o.onScrollEnd!=null&&M("scrollend",t),o.onClick!=null&&(t.onclick=wt),t=!0):t=!1,t||En(e,!0)}function xc(e){for(me=e.return;me;)switch(me.tag){case 5:case 31:case 13:ct=!1;return;case 27:case 3:ct=!0;return;default:me=me.return}}function po(e){if(e!==me)return!1;if(!A)return xc(e),A=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||pu(e.type,e.memoizedProps)),n=!n),n&&I&&En(e),xc(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));I=nb(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));I=nb(e)}else t===27?(t=I,An(e.type)?(e=hu,hu=null,I=e):I=t):I=me?it(e.stateNode.nextSibling):null;return!0}function Kn(){I=me=null,A=!1}function Ji(){var e=vn;return e!==null&&(Re===null?Re=e:Re.push.apply(Re,e),vn=null),e}function Xa(e){vn===null?vn=[e]:vn.push(e)}var _r=Ct(null),lo=null,Ht=null;function dn(e,t,n){P(_r,t._currentValue),t._currentValue=n}function Lt(e){e._currentValue=_r.current,xe(_r)}function Pl(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Mr(e,t,n,o){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var l=a.dependencies;if(l!==null){var c=a.child;l=l.firstContext;e:for(;l!==null;){var i=l;l=a;for(var r=0;r<t.length;r++)if(i.context===t[r]){l.lanes|=n,i=l.alternate,i!==null&&(i.lanes|=n),Pl(l.return,n,e),o||(c=null);break e}l=i.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(h(341));c.lanes|=n,l=c.alternate,l!==null&&(l.lanes|=n),Pl(c,n,e),c=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),Pl(a.return,n,e),c=a.child,c=c!==null?c.sibling:null):c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function Jn(e,t,n,o){e=null;for(var a=t,l=!1;a!==null;){if(!l){if((a.flags&524288)!==0)l=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(h(387));if(c=c.memoizedProps,c!==null){var i=a.type;We(a.pendingProps.value,c.value)||(e!==null?e.push(i):e=[i])}}else if(a===bc.current){if(c=a.alternate,c===null)throw Error(h(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push($o):e=[$o])}a=a.return}return e!==null&&Mr(t,e,n,o),t.flags|=262144,e!==null}function Sc(e){for(e=e.firstContext;e!==null;){if(!We(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Fn(e){lo=e,Ht=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ke(e){return dp(lo,e)}function Bl(e,t){return lo===null&&Fn(e),dp(e,t)}function dp(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Ht===null){if(e===null)throw Error(h(308));Ht=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Ht=Ht.next=t;return n}var Qh=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},Xh=be.unstable_scheduleCallback,Zh=be.unstable_NormalPriority,re={$$typeof:St,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Hu(){return{controller:new Qh,data:new Map,refCount:0}}function rl(e){e.refCount--,e.refCount===0&&Xh(Zh,function(){e.controller.abort()})}function cf(e,t){if((e.pendingLanes&4194048)!==0){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var o=t[e];n.indexOf(o)===-1&&n.push(o)}}}var Ea=null;function Kh(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var Aa=null,Dr=0,Wn=0,Ro=null;function Jh(e,t){if(Aa===null){var n=Aa=[];Dr=0,Wn=sd(),Ro={status:"pending",value:void 0,then:function(o){n.push(o)}}}return Dr++,t.then(rf,rf),t}function rf(){if(--Dr===0&&(Ea=null,Aa!==null)){Ro!==null&&(Ro.status="fulfilled");var e=Aa;Aa=null,Wn=0,Ro=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Fh(e,t){var n=[],o={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(o.status="rejected",o.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),o}var uf=N.S;N.S=function(e,t){if(Ov=Ze(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Jh(e,t),Ea!==null)for(var n=Jo;n!==null;)cf(n,Ea),n=n.next;if(n=e.types,n!==null){for(var o=Jo;o!==null;)cf(o,n),o=o.next;if(Wn!==0){o=Ea,o===null&&(o=Ea=[]);for(var a=0;a<n.length;a++){var l=n[a];o.indexOf(l)===-1&&o.push(l)}}}uf!==null&&uf(e,t)};var Qn=Ct(null);function qu(){var e=Qn.current;return e!==null?e:J.pooledCache}function ec(e,t){t===null?P(Qn,Qn.current):P(Qn,t.pool)}function sp(){var e=qu();return e===null?null:{parent:re._currentValue,pool:e}}var na=Error(h(460)),Lu=Error(h(474)),Wc=Error(h(542)),wc={then:function(){}};function df(e){return e=e.status,e==="fulfilled"||e==="rejected"}function fp(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(wt,wt),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,ff(e),e===void 0&&!("reason"in t)?Error(h(600)):e;default:if(typeof t.status=="string")t.then(wt,wt);else{if(e=J,e!==null&&100<e.shellSuspendCounter)throw Error(h(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=o}},function(o){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,ff(e),e}throw Xn=t,na}}function qn(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Xn=n,na):n}}var Xn=null;function sf(){if(Xn===null)throw Error(h(459));var e=Xn;return Xn=null,e}function ff(e){if(e===na||e===Wc)throw Error(h(483))}var Bo=null,Za=0;function Ul(e){var t=Za;return Za+=1,Bo===null&&(Bo=[]),fp(Bo,e,t)}function tn(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Hl(e,t){throw t.$$typeof===Cm?Error(h(525)):(e=Object.prototype.toString.call(t),Error(h(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function bp(e){function t(v,s){if(e){var b=v.deletions;b===null?(v.deletions=[s],v.flags|=16):b.push(s)}}function n(v,s){if(!e)return null;for(;s!==null;)t(v,s),s=s.sibling;return null}function o(v){for(var s=new Map;v!==null;)v.key===null?s.set(v.index,v):s.set(v.key,v),v=v.sibling;return s}function a(v,s){return v=qt(v,s),v.index=0,v.sibling=null,v}function l(v,s,b){return v.index=b,e?(b=v.alternate,b!==null?(b=b.index,b<s?(v.flags|=2,s):b):(v.flags|=134217730,s)):(v.flags|=1048576,s)}function c(v){return e&&v.alternate===null&&(v.flags|=134217730),v}function i(v,s,b,m){return s===null||s.tag!==6?(s=Zi(b,v.mode,m),s.return=v,s):(s=a(s,b),s.return=v,s)}function r(v,s,b,m){var k=b.type;return k===ko?(v=f(v,s,b.props.children,m,b.key),tn(v,b),v):s!==null&&(s.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===an&&qn(k)===s.type)?(s=a(s,b.props),tn(s,b),s.return=v,s):(s=Il(b.type,b.key,b.props,null,v.mode,m),tn(s,b),s.return=v,s)}function u(v,s,b,m){return s===null||s.tag!==4||s.stateNode.containerInfo!==b.containerInfo||s.stateNode.implementation!==b.implementation?(s=Ki(b,v.mode,m),s.return=v,s):(s=a(s,b.children||[]),s.return=v,s)}function f(v,s,b,m,k){return s===null||s.tag!==7?(s=Gn(b,v.mode,m,k),s.return=v,s):(s=a(s,b),s.return=v,s)}function g(v,s,b){if(typeof s=="string"&&s!==""||typeof s=="number"||typeof s=="bigint")return s=Zi(""+s,v.mode,b),s.return=v,s;if(typeof s=="object"&&s!==null){switch(s.$$typeof){case Nl:return b=Il(s.type,s.key,s.props,null,v.mode,b),tn(b,s),b.return=v,b;case Sa:return s=Ki(s,v.mode,b),s.return=v,s;case an:return s=qn(s),g(v,s,b)}if(wa(s)||ga(s))return s=Gn(s,v.mode,b,null),s.return=v,s;if(typeof s.then=="function")return g(v,Ul(s),b);if(s.$$typeof===St)return g(v,Bl(v,s),b);Hl(v,s)}return null}function d(v,s,b,m){var k=s!==null?s.key:null;if(typeof b=="string"&&b!==""||typeof b=="number"||typeof b=="bigint")return k!==null?null:i(v,s,""+b,m);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case Nl:return b.key===k?r(v,s,b,m):null;case Sa:return b.key===k?u(v,s,b,m):null;case an:return b=qn(b),d(v,s,b,m)}if(wa(b)||ga(b))return k!==null?null:f(v,s,b,m,null);if(typeof b.then=="function")return d(v,s,Ul(b),m);if(b.$$typeof===St)return d(v,s,Bl(v,b),m);Hl(v,b)}return null}function p(v,s,b,m,k){if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return v=v.get(b)||null,i(s,v,""+m,k);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Nl:return v=v.get(m.key===null?b:m.key)||null,r(s,v,m,k);case Sa:return v=v.get(m.key===null?b:m.key)||null,u(s,v,m,k);case an:return m=qn(m),p(v,s,b,m,k)}if(wa(m)||ga(m))return v=v.get(b)||null,f(s,v,m,k,null);if(typeof m.then=="function")return p(v,s,b,Ul(m),k);if(m.$$typeof===St)return p(v,s,b,Bl(s,m),k);Hl(s,m)}return null}function y(v,s,b,m){for(var k=null,T=null,x=s,E=s=0,K=null;x!==null&&E<b.length;E++){x.index>E?(K=x,x=null):K=x.sibling;var B=d(v,x,b[E],m);if(B===null){x===null&&(x=K);break}e&&x&&B.alternate===null&&t(v,x),s=l(B,s,E),T===null?k=B:T.sibling=B,T=B,x=K}if(E===b.length)return n(v,x),A&&Ut(v,E),k;if(x===null){for(;E<b.length;E++)x=g(v,b[E],m),x!==null&&(s=l(x,s,E),T===null?k=x:T.sibling=x,T=x);return A&&Ut(v,E),k}for(x=o(x);E<b.length;E++)K=p(x,v,E,b[E],m),K!==null&&(e&&(B=K.alternate,B!==null&&x.delete(B.key===null?E:B.key)),s=l(K,s,E),T===null?k=K:T.sibling=K,T=K);return e&&x.forEach(function(Ft){return t(v,Ft)}),A&&Ut(v,E),k}function S(v,s,b,m){if(b==null)throw Error(h(151));for(var k=null,T=null,x=s,E=s=0,K=null,B=b.next();x!==null&&!B.done;E++,B=b.next()){x.index>E?(K=x,x=null):K=x.sibling;var Ft=d(v,x,B.value,m);if(Ft===null){x===null&&(x=K);break}e&&x&&Ft.alternate===null&&t(v,x),s=l(Ft,s,E),T===null?k=Ft:T.sibling=Ft,T=Ft,x=K}if(B.done)return n(v,x),A&&Ut(v,E),k;if(x===null){for(;!B.done;E++,B=b.next())B=g(v,B.value,m),B!==null&&(s=l(B,s,E),T===null?k=B:T.sibling=B,T=B);return A&&Ut(v,E),k}for(x=o(x);!B.done;E++,B=b.next())B=p(x,v,E,B.value,m),B!==null&&(e&&(K=B.alternate,K!==null&&x.delete(K.key===null?E:K.key)),s=l(B,s,E),T===null?k=B:T.sibling=B,T=B);return e&&x.forEach(function(qg){return t(v,qg)}),A&&Ut(v,E),k}function z(v,s,b,m){if(typeof b=="object"&&b!==null&&b.type===ko&&b.key===null&&b.props.ref===void 0&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case Nl:e:{for(var k=b.key;s!==null;){if(s.key===k){if(k=b.type,k===ko){if(s.tag===7){n(v,s.sibling),m=a(s,b.props.children),tn(m,b),m.return=v,v=m;break e}}else if(s.elementType===k||typeof k=="object"&&k!==null&&k.$$typeof===an&&qn(k)===s.type){n(v,s.sibling),m=a(s,b.props),tn(m,b),m.return=v,v=m;break e}n(v,s);break}else t(v,s);s=s.sibling}b.type===ko?(m=Gn(b.props.children,v.mode,m,b.key),tn(m,b),m.return=v,v=m):(m=Il(b.type,b.key,b.props,null,v.mode,m),tn(m,b),m.return=v,v=m)}return c(v);case Sa:e:{for(k=b.key;s!==null;){if(s.key===k)if(s.tag===4&&s.stateNode.containerInfo===b.containerInfo&&s.stateNode.implementation===b.implementation){n(v,s.sibling),m=a(s,b.children||[]),m.return=v,v=m;break e}else{n(v,s);break}else t(v,s);s=s.sibling}m=Ki(b,v.mode,m),m.return=v,v=m}return c(v);case an:return b=qn(b),z(v,s,b,m)}if(wa(b))return y(v,s,b,m);if(ga(b)){if(k=ga(b),typeof k!="function")throw Error(h(150));return b=k.call(b),S(v,s,b,m)}if(typeof b.then=="function")return z(v,s,Ul(b),m);if(b.$$typeof===St)return z(v,s,Bl(v,b),m);Hl(v,b)}return typeof b=="string"&&b!==""||typeof b=="number"||typeof b=="bigint"?(b=""+b,s!==null&&s.tag===6?(n(v,s.sibling),m=a(s,b),m.return=v,v=m):(n(v,s),m=Zi(b,v.mode,m),m.return=v,v=m),c(v)):n(v,s)}return function(v,s,b,m){try{Za=0;var k=z(v,s,b,m);return Bo=null,k}catch(x){if(x===na||x===Wc)throw x;var T=Ue(29,x,null,v.mode);return T.lanes=m,T.return=v,T}}}var $n=bp(!0),pp=bp(!1),ln=!1;function Yu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Rr(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function gn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function mn(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Y&2)!==0){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,t=yc(e),lp(e,null,n),t}return Jc(e,o,t,n),yc(e)}function _a(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,_b(e,n)}}function Fi(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var a=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};l===null?a=l=c:l=l.next=c,n=n.next}while(n!==null);l===null?a=l=t:l=l.next=t}else a=l=t;n={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:l,shared:o.shared,callbacks:o.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Br=!1;function Ma(){if(Br){var e=Ro;if(e!==null)throw e}}function Da(e,t,n,o){Br=!1;var a=e.updateQueue;ln=!1;var l=a.firstBaseUpdate,c=a.lastBaseUpdate,i=a.shared.pending;if(i!==null){a.shared.pending=null;var r=i,u=r.next;r.next=null,c===null?l=u:c.next=u,c=r;var f=e.alternate;f!==null&&(f=f.updateQueue,i=f.lastBaseUpdate,i!==c&&(i===null?f.firstBaseUpdate=u:i.next=u,f.lastBaseUpdate=r))}if(l!==null){var g=a.baseState;c=0,f=u=r=null,i=l;do{var d=i.lane&-536870913,p=d!==i.lane;if(p?(R&d)===d:(o&d)===d){d!==0&&d===Wn&&(Br=!0),f!==null&&(f=f.next={lane:0,tag:i.tag,payload:i.payload,callback:null,next:null});e:{var y=e,S=i;d=t;var z=n;switch(S.tag){case 1:if(y=S.payload,typeof y=="function"){g=y.call(z,g,d);break e}g=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=S.payload,d=typeof y=="function"?y.call(z,g,d):y,d==null)break e;g=F({},g,d);break e;case 2:ln=!0}}d=i.callback,d!==null&&(e.flags|=64,p&&(e.flags|=8192),p=a.callbacks,p===null?a.callbacks=[d]:p.push(d))}else p={lane:d,tag:i.tag,payload:i.payload,callback:i.callback,next:null},f===null?(u=f=p,r=g):f=f.next=p,c|=d;if(i=i.next,i===null){if(i=a.shared.pending,i===null)break;p=i,i=p.next,p.next=null,a.lastBaseUpdate=p,a.shared.pending=null}}while(!0);f===null&&(r=g),a.baseState=r,a.firstBaseUpdate=u,a.lastBaseUpdate=f,l===null&&(a.shared.lanes=0),On|=c,e.lanes=c,e.memoizedState=g}}function vp(e,t){if(typeof e!="function")throw Error(h(191,e));e.call(t)}function gp(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)vp(n[e],t)}var zn=Ct(null),Tc=Ct(0);function bf(e,t){e=Xt,P(Tc,e),P(zn,t),Xt=e|t.baseLanes}function Ur(){P(Tc,Xt),P(zn,zn.current)}function ju(){Xt=Tc.current,xe(zn),xe(Tc)}var Te=Ct(null),Ne=null;function hn(e){var t=e.alternate;P(Se,Se.current&1),P(Te,e),Ne===null&&(t===null||zn.current!==null||t.memoizedState!==null)&&(Ne=e)}function Hr(e){P(Se,Se.current),P(Te,e),Ne===null&&(Ne=e)}function mp(e){e.tag===22?(P(Se,Se.current),P(Te,e),Ne===null&&(Ne=e)):yn()}function yn(){P(Se,Se.current),P(Te,Te.current)}function Ge(e){xe(Te),Ne===e&&(Ne=null),xe(Se)}var Se=Ct(0);function Ka(e,t){P(Te,Te.current),P(Se,t)}function Vu(e){xe(Se),xe(Te),Ne===e&&(Ne=null)}function Ec(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||mu(n)||vd(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!=="independent"){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Vt=0,C=null,Z=null,ie=null,zc=!1,Uo=!1,In=!1,Nc=0,Ja=0,Ho=null,Wh=0;function ae(){throw Error(h(321))}function Gu(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!We(e[n],t[n]))return!1;return!0}function Qu(e,t,n,o,a,l){return Vt=l,C=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?Jp:Fp,In=!1,l=n(o,a),In=!1,Uo&&(l=yp(t,n,o,a)),hp(e),l}function hp(e){N.H=Oc;var t=Z!==null&&Z.next!==null;if(Vt=0,ie=Z=C=null,zc=!1,Ja=0,Ho=null,t)throw Error(h(300));e===null||ue||(e=e.dependencies,e!==null&&Sc(e)&&(ue=!0))}function yp(e,t,n,o){C=e;var a=0;do{if(Uo&&(Ho=null),Ja=0,Uo=!1,25<=a)throw Error(h(301));if(a+=1,ie=Z=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}N.H=a0,l=t(n,o)}while(Uo);return l}function $h(){var e=N.H,t=e.useState()[0];return t=typeof t.then=="function"?ul(t):t,e=e.useState()[0],(Z!==null?Z.memoizedState:null)!==e&&(C.flags|=1024),t}function Xu(){var e=Nc!==0;return Nc=0,e}function Zu(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Ku(e){if(zc){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}zc=!1}Vt=0,ie=Z=C=null,Uo=!1,Ja=Nc=0,Ho=null}function _e(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ie===null?C.memoizedState=ie=e:ie=ie.next=e,ie}function ce(){if(Z===null){var e=C.alternate;e=e!==null?e.memoizedState:null}else e=Z.next;var t=ie===null?C.memoizedState:ie.next;if(t!==null)ie=t,Z=e;else{if(e===null)throw C.alternate===null?Error(h(467)):Error(h(310));Z=e,e={memoizedState:Z.memoizedState,baseState:Z.baseState,baseQueue:Z.baseQueue,queue:Z.queue,next:null},ie===null?C.memoizedState=ie=e:ie=ie.next=e}return ie}function $c(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ul(e){var t=Ja;return Ja+=1,Ho===null&&(Ho=[]),e=fp(Ho,e,t),t=C,(ie===null?t.memoizedState:ie.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?Jp:Fp),e}function Ic(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return ul(e);if(e.$$typeof===Mm)return;if(e.$$typeof===St)return ke(e)}throw Error(h(438,String(e)))}function Ju(e){var t=null,n=C.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var o=C.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=$c(),C.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),o=0;o<e;o++)n[o]=_m;return t.index++,n}function Gt(e,t){return typeof t=="function"?t(e):t}function tc(e){var t=ce();return Fu(t,Z,e)}function Fu(e,t,n){var o=e.queue;if(o===null)throw Error(h(311));o.lastRenderedReducer=n;var a=e.baseQueue,l=o.pending;if(l!==null){if(a!==null){var c=a.next;a.next=l.next,l.next=c}t.baseQueue=a=l,o.pending=null}if(l=e.baseState,a===null)e.memoizedState=l;else{t=a.next;var i=c=null,r=null,u=t,f=!1;do{var g=u.lane&-536870913;if(g!==u.lane?(R&g)===g:(Vt&g)===g){var d=u.revertLane;if(d===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),g===Wn&&(f=!0);else if((Vt&d)===d){u=u.next,d===Wn&&(f=!0);continue}else g={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},r===null?(i=r=g,c=l):r=r.next=g,C.lanes|=d,On|=d;g=u.action,In&&n(l,g),l=u.hasEagerState?u.eagerState:n(l,g)}else d={lane:g,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},r===null?(i=r=d,c=l):r=r.next=d,C.lanes|=g,On|=g;u=u.next}while(u!==null&&u!==t);if(r===null?c=l:r.next=i,!We(l,e.memoizedState)&&(ue=!0,f&&(n=Ro,n!==null)))throw n;e.memoizedState=l,e.baseState=c,e.baseQueue=r,o.lastRenderedState=l}return a===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function Wi(e){var t=ce(),n=t.queue;if(n===null)throw Error(h(311));n.lastRenderedReducer=e;var o=n.dispatch,a=n.pending,l=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do l=e(l,c.action),c=c.next;while(c!==a);We(l,t.memoizedState)||(ue=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,o]}function kp(e,t,n){var o=C,a=ce(),l=A;if(l){if(n===void 0)throw Error(h(407));n=n()}else n=t();var c=!We((Z||a).memoizedState,n);if(c&&(a.memoizedState=n,ue=!0),a=a.queue,Wu(wp.bind(null,o,a,e),[e]),e=a.getSnapshot!==t||c||ie!==null&&(ie.memoizedState.tag&1)!==0,Qo(e?9:8,{destroy:void 0},Sp.bind(null,o,a,n,t),null),e){if(o.flags|=2048,J===null)throw Error(h(349));l||(Vt&127)!==0||xp(o,t,n)}return n}function xp(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=C.updateQueue,t===null?(t=$c(),C.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Sp(e,t,n,o){t.value=n,t.getSnapshot=o,Tp(t)&&Ep(e)}function wp(e,t,n){return n(function(){Tp(t)&&Ep(e)})}function Tp(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!We(e,n)}catch{return!0}}function Ep(e){var t=ao(e,2);t!==null&&He(t,e,2)}function qr(e){var t=_e();if(typeof e=="function"){var n=e;if(e=n(),In){rn(!0);try{n()}finally{rn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Gt,lastRenderedState:e},t}function zp(e,t,n,o){return e.baseState=n,Fu(e,Z,typeof o=="function"?o:Gt)}function Ih(e,t,n,o,a){if(ei(e))throw Error(h(485));if(e=t.action,e!==null){var l={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){l.listeners.push(c)}};N.T!==null?n(!0):l.isTransition=!1,o(l),n=t.pending,n===null?(l.next=t.pending=l,Np(t,l)):(l.next=n.next,t.pending=n.next=l)}}function Np(e,t){var n=t.action,o=t.payload,a=e.state;if(t.isTransition){var l=N.T,c={};c.types=l!==null?l.types:null,N.T=c;try{var i=n(a,o),r=N.S;r!==null&&r(c,i),pf(e,t,i)}catch(u){Lr(e,t,u)}finally{l!==null&&c.types!==null&&(l.types=c.types),N.T=l}}else try{l=n(a,o),pf(e,t,l)}catch(u){Lr(e,t,u)}}function pf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(o){vf(e,t,o)},function(o){return Lr(e,t,o)}):vf(e,t,n)}function vf(e,t,n){t.status="fulfilled",t.value=n,Op(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Np(e,n)))}function Lr(e,t,n){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=n,Op(t),t=t.next;while(t!==o)}e.action=null}function Op(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Cp(e,t){return t}function gf(e,t){if(A){var n=J.formState;if(n!==null){e:{var o=C;if(A){if(I){t:{for(var a=I,l=ct;a.nodeType!==8;){if(!l){a=null;break t}if(a=it(a.nextSibling),a===null){a=null;break t}}l=a.data,a=l==="F!"||l==="F"?a:null}if(a){I=it(a.nextSibling),o=a.data==="F!";break e}}En(o)}o=!1}o&&(t=n[0])}}return n=_e(),n.memoizedState=n.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Cp,lastRenderedState:t},n.queue=o,n=Xp.bind(null,C,o),o.dispatch=n,o=qr(!1),l=ed.bind(null,C,!1,o.queue),o=_e(),a={state:t,dispatch:null,action:e,pending:null},o.queue=a,n=Ih.bind(null,C,a,l,n),a.dispatch=n,o.memoizedState=e,[t,n,!1]}function mf(e){var t=ce();return Ap(t,Z,e)}function Ap(e,t,n){if(t=Fu(e,t,Cp)[0],e=tc(Gt)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=ul(t)}catch(c){throw c===na?Wc:c}else o=t;t=ce();var a=t.queue,l=a.dispatch;return n!==t.memoizedState&&(C.flags|=2048,Qo(9,{destroy:void 0},Ph.bind(null,a,n),null)),[o,l,e]}function Ph(e,t){e.action=t}function hf(e){var t=ce(),n=Z;if(n!==null)return Ap(t,n,e);ce(),t=t.memoizedState,n=ce();var o=n.queue.dispatch;return n.memoizedState=e,[t,o,!1]}function Qo(e,t,n,o){return e={tag:e,create:n,deps:o,inst:t,next:null},t=C.updateQueue,t===null&&(t=$c(),C.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e),e}function _p(){return ce().memoizedState}function nc(e,t,n,o){var a=_e();C.flags|=e,a.memoizedState=Qo(1|t,{destroy:void 0},n,o===void 0?null:o)}function Pc(e,t,n,o){var a=ce();o=o===void 0?null:o;var l=a.memoizedState.inst;Z!==null&&o!==null&&Gu(o,Z.memoizedState.deps)?a.memoizedState=Qo(t,l,n,o):(C.flags|=e,a.memoizedState=Qo(1|t,l,n,o))}function yf(e,t){nc(8390656,8,e,t)}function Wu(e,t){Pc(2048,8,e,t)}function e0(e){C.flags|=4;var t=C.updateQueue;if(t===null)t=$c(),C.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Mp(e){var t=ce().memoizedState;return e0({ref:t,nextImpl:e}),function(){if((Y&2)!==0)throw Error(h(440));return t.impl.apply(void 0,arguments)}}function Dp(e,t){return Pc(4,2,e,t)}function Rp(e,t){return Pc(4,4,e,t)}function Bp(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Up(e,t,n){n=n!=null?n.concat([e]):null,Pc(4,4,Bp.bind(null,t,e),n)}function $u(){}function Hp(e,t){var n=ce();t=t===void 0?null:t;var o=n.memoizedState;return t!==null&&Gu(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function qp(e,t){var n=ce();t=t===void 0?null:t;var o=n.memoizedState;if(t!==null&&Gu(t,o[1]))return o[0];if(o=e(),In){rn(!0);try{e()}finally{rn(!1)}}return n.memoizedState=[o,t],o}function Iu(e,t,n){return n===void 0||(Vt&1073741824)!==0&&(R&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Av(),C.lanes|=e,On|=e,n)}function Lp(e,t,n,o){return We(n,t)?n:zn.current!==null?(e=Iu(e,n,o),We(e,t)||(ue=!0),e):(Vt&106)===0||(Vt&1073741824)!==0&&(R&261930)===0?(ue=!0,e.memoizedState=n):(e=Av(),C.lanes|=e,On|=e,t)}function Yp(e,t,n,o,a){var l=j.p;j.p=l!==0&&8>l?l:8;var c=N.T,i={};i.types=c!==null?c.types:null,N.T=i,ed(e,!1,t,n);try{var r=a(),u=N.S;if(u!==null&&u(i,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var f=Fh(r,o);Ra(e,t,f,Fe(e))}else Ra(e,t,o,Fe(e))}catch(g){Ra(e,t,{then:function(){},status:"rejected",reason:g},Fe())}finally{j.p=l,c!==null&&i.types!==null&&(c.types=i.types),N.T=c}}function t0(){}function Yr(e,t,n,o){if(e.tag!==5)throw Error(h(476));var a=jp(e).queue;Yp(e,a,t,Vn,n===null?t0:function(){return Vp(e),n(o)})}function jp(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Vn,baseState:Vn,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Gt,lastRenderedState:Vn},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Gt,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Vp(e){var t=jp(e);t.next===null&&(t=e.alternate.memoizedState),Ra(e,t.next.queue,{},Fe())}function Pu(){return ke($o)}function Gp(){return ce().memoizedState}function Qp(){return ce().memoizedState}function n0(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Fe();e=gn(n);var o=mn(t,e,n);o!==null&&(He(o,t,n),_a(o,t,n)),t={cache:Hu()},e.payload=t;return}t=t.return}}function o0(e,t,n){var o=Fe();n={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},ei(e)?Zp(t,n):(n=Ru(e,t,n,o),n!==null&&(He(n,e,o),Kp(n,t,o)))}function Xp(e,t,n){var o=Fe();Ra(e,t,n,o)}function Ra(e,t,n,o){var a={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(ei(e))Zp(t,a);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var c=t.lastRenderedState,i=l(c,n);if(a.hasEagerState=!0,a.eagerState=i,We(i,c))return Jc(e,t,a,0),J===null&&Kc(),!1}catch{}if(n=Ru(e,t,a,o),n!==null)return He(n,e,o),Kp(n,t,o),!0}return!1}function ed(e,t,n,o){if(o={lane:2,revertLane:sd(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},ei(e)){if(t)throw Error(h(479))}else t=Ru(e,n,o,2),t!==null&&He(t,e,2)}function ei(e){var t=e.alternate;return e===C||t!==null&&t===C}function Zp(e,t){Uo=zc=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Kp(e,t,n){if((n&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,_b(e,n)}}var Oc={readContext:ke,use:Ic,useCallback:ae,useContext:ae,useEffect:ae,useImperativeHandle:ae,useLayoutEffect:ae,useInsertionEffect:ae,useMemo:ae,useReducer:ae,useRef:ae,useState:ae,useDebugValue:ae,useDeferredValue:ae,useTransition:ae,useSyncExternalStore:ae,useId:ae,useHostTransitionStatus:ae,useFormState:ae,useActionState:ae,useOptimistic:ae,useMemoCache:ae,useCacheRefresh:ae,useEffectEvent:ae},Jp={readContext:ke,use:Ic,useCallback:function(e,t){return _e().memoizedState=[e,t===void 0?null:t],e},useContext:ke,useEffect:yf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,nc(4194308,4,Bp.bind(null,t,e),n)},useLayoutEffect:function(e,t){return nc(4194308,4,e,t)},useInsertionEffect:function(e,t){nc(4,2,e,t)},useMemo:function(e,t){var n=_e();t=t===void 0?null:t;var o=e();if(In){rn(!0);try{e()}finally{rn(!1)}}return n.memoizedState=[o,t],o},useReducer:function(e,t,n){var o=_e();if(n!==void 0){var a=n(t);if(In){rn(!0);try{n(t)}finally{rn(!1)}}}else a=t;return o.memoizedState=o.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},o.queue=e,e=e.dispatch=o0.bind(null,C,e),[o.memoizedState,e]},useRef:function(e){var t=_e();return e={current:e},t.memoizedState=e},useState:function(e){e=qr(e);var t=e.queue,n=Xp.bind(null,C,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:$u,useDeferredValue:function(e,t){var n=_e();return Iu(n,e,t)},useTransition:function(){var e=qr(!1);return e=Yp.bind(null,C,e.queue,!0,!1),_e().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var o=C,a=_e();if(A){if(n===void 0)throw Error(h(407));n=n()}else{if(n=t(),J===null)throw Error(h(349));(R&127)!==0||xp(o,t,n)}a.memoizedState=n;var l={value:n,getSnapshot:t};return a.queue=l,yf(wp.bind(null,o,l,e),[e]),o.flags|=2048,Qo(9,{destroy:void 0},Sp.bind(null,o,l,n,t),null),n},useId:function(){var e=_e(),t=J.identifierPrefix;if(A){var n=Et,o=Tt;n=(o&~(1<<32-Je(o)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Nc++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=Wh++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Pu,useFormState:gf,useActionState:gf,useOptimistic:function(e){var t=_e();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=ed.bind(null,C,!0,n),n.dispatch=t,[e,t]},useMemoCache:Ju,useCacheRefresh:function(){return _e().memoizedState=n0.bind(null,C)},useEffectEvent:function(e){var t=_e(),n={impl:e};return t.memoizedState=n,function(){if((Y&2)!==0)throw Error(h(440));return n.impl.apply(void 0,arguments)}}},Fp={readContext:ke,use:Ic,useCallback:Hp,useContext:ke,useEffect:Wu,useImperativeHandle:Up,useInsertionEffect:Dp,useLayoutEffect:Rp,useMemo:qp,useReducer:tc,useRef:_p,useState:function(){return tc(Gt)},useDebugValue:$u,useDeferredValue:function(e,t){var n=ce();return Lp(n,Z.memoizedState,e,t)},useTransition:function(){var e=tc(Gt)[0],t=ce().memoizedState;return[typeof e=="boolean"?e:ul(e),t]},useSyncExternalStore:kp,useId:Gp,useHostTransitionStatus:Pu,useFormState:mf,useActionState:mf,useOptimistic:function(e,t){var n=ce();return zp(n,Z,e,t)},useMemoCache:Ju,useCacheRefresh:Qp,useEffectEvent:Mp},a0={readContext:ke,use:Ic,useCallback:Hp,useContext:ke,useEffect:Wu,useImperativeHandle:Up,useInsertionEffect:Dp,useLayoutEffect:Rp,useMemo:qp,useReducer:Wi,useRef:_p,useState:function(){return Wi(Gt)},useDebugValue:$u,useDeferredValue:function(e,t){var n=ce();return Z===null?Iu(n,e,t):Lp(n,Z.memoizedState,e,t)},useTransition:function(){var e=Wi(Gt)[0],t=ce().memoizedState;return[typeof e=="boolean"?e:ul(e),t]},useSyncExternalStore:kp,useId:Gp,useHostTransitionStatus:Pu,useFormState:hf,useActionState:hf,useOptimistic:function(e,t){var n=ce();return Z!==null?zp(n,Z,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Ju,useCacheRefresh:Qp,useEffectEvent:Mp};function $i(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:F({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var jr={enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Fe(),a=gn(o);a.payload=t,n!=null&&(a.callback=n),t=mn(e,a,o),t!==null&&(He(t,e,o),_a(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Fe(),a=gn(o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=mn(e,a,o),t!==null&&(He(t,e,o),_a(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Fe(),o=gn(n);o.tag=2,t!=null&&(o.callback=t),t=mn(e,o,n),t!==null&&(He(t,e,n),_a(t,e,n))}};function kf(e,t,n,o,a,l,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,c):t.prototype&&t.prototype.isPureReactComponent?!Ga(n,o)||!Ga(a,l):!0}function xf(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&jr.enqueueReplaceState(t,t.state,null)}function Pn(e,t){var n=t;if("ref"in t){n={};for(var o in t)o!=="ref"&&(n[o]=t[o])}if(e=e.defaultProps){n===t&&(n=F({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function Wp(e){hc(e)}function $p(e){console.error(e)}function Ip(e){hc(e)}function Cc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function Sf(e,t,n){try{var o=e.onCaughtError;o(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function Vr(e,t,n){return n=gn(n),n.tag=3,n.payload={element:null},n.callback=function(){Cc(e,t)},n}function Pp(e){return e=gn(e),e.tag=3,e}function ev(e,t,n,o){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var l=o.value;e.payload=function(){return a(l)},e.callback=function(){Sf(t,n,o)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){Sf(t,n,o),typeof a!="function"&&(kn===null?kn=new Set([this]):kn.add(this));var i=o.stack;this.componentDidCatch(o.value,{componentStack:i!==null?i:""})})}function l0(e,t,n,o,a){if(n.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=n.alternate,t!==null&&Jn(t,n,a,!0),n=Te.current,n!==null){switch(n.tag){case 31:case 13:case 19:return Ne===null?Hc():n.alternate===null&&le===0&&(le=3),n.flags&=-257,n.flags|=65536,n.lanes=a,o===wc?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([o]):t.add(o),ar(e,o,a)),!1;case 22:return n.flags|=65536,o===wc?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([o]):n.add(o)),ar(e,o,a)),!1}throw Error(h(435,n.tag))}return ar(e,o,a),Hc(),!1}if(A)return t=Te.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,o!==Ar&&(e=Error(h(422),{cause:o}),Xa(lt(e,n)))):(o!==Ar&&(t=Error(h(423),{cause:o}),Xa(lt(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,o=lt(o,n),a=Vr(e.stateNode,o,a),Fi(e,a),le!==4&&(le=2)),!1;var l=Error(h(520),{cause:o});if(l=lt(l,n),qa===null?qa=[l]:qa.push(l),le!==4&&(le=2),t===null)return!0;o=lt(o,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Vr(n.stateNode,o,e),Fi(n,e),!1;case 1:if(t=n.type,l=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(kn===null||!kn.has(l))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Pp(a),ev(a,e,n,o),Fi(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var td=Error(h(461)),ue=!1;function se(e,t,n,o){t.child=e===null?pp(t,null,n,o):$n(t,e.child,n,o)}function wf(e,t,n,o,a){n=n.render;var l=t.ref;if("ref"in o){var c={};for(var i in o)i!=="ref"&&(c[i]=o[i])}else c=o;return Fn(t),o=Qu(e,t,n,c,l,a),i=Xu(),e!==null&&!ue?(Zu(e,t,a),Qt(e,t,a)):(A&&i&&Fc(t),t.flags|=1,se(e,t,o,a),t.child)}function Tf(e,t,n,o,a){if(e===null){var l=n.type;return typeof l=="function"&&!Bu(l)&&l.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=l,tv(e,t,l,o,a)):(e=Il(n.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!od(e,a)){var c=l.memoizedProps;if(n=n.compare,n=n!==null?n:Ga,n(c,o)&&e.ref===t.ref)return Qt(e,t,a)}return t.flags|=1,e=qt(l,o),e.ref=t.ref,e.return=t,t.child=e}function tv(e,t,n,o,a){if(e!==null){var l=e.memoizedProps;if(Ga(l,o)&&e.ref===t.ref)if(ue=!1,t.pendingProps=o=l,od(e,a))(e.flags&131072)!==0&&(ue=!0);else return t.lanes=e.lanes,Qt(e,t,a)}return Gr(e,t,n,o,a)}function nv(e,t,n,o){var a=o.children,l=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(l=l!==null?l.baseLanes|n:n,e!==null){for(o=t.child=e.child,a=0;o!==null;)a=a|o.lanes|o.childLanes,o=o.sibling;o=a&~l}else o=0,t.child=null;return Ef(e,t,l,n,o)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&ec(t,l!==null?l.cachePool:null),l!==null?bf(t,l):Ur(),mp(t);else return o=t.lanes=536870912,Ef(e,t,l!==null?l.baseLanes|n:n,n,o)}else l!==null?(ec(t,l.cachePool),bf(t,l),yn(),t.memoizedState=null):(e!==null&&ec(t,null),Ur(),yn());return se(e,t,a,n),t.child}function Ba(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Ef(e,t,n,o,a){var l=qu();return l=l===null?null:{parent:re._currentValue,pool:l},t.memoizedState={baseLanes:n,cachePool:l},e!==null&&ec(t,null),Ur(),mp(t),e!==null&&Jn(e,t,o,!0),t.childLanes=a,null}function oc(e,t){return t=ti({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function zf(e,t,n){return $n(t,e.child,null,n),e=oc(t,t.pendingProps),e.flags|=2,Ge(t),t.memoizedState=null,e}function c0(e,t,n){var o=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(A){if(o.mode==="hidden")return e=oc(t,o),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Ba(null,e);if(Hr(t),(e=I)?(e=ng(e,ct),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Tn!==null?{id:Tt,overflow:Et}:null,retryLane:536870912,hydrationErrors:null},n=ip(e),n.return=t,t.child=n,me=t,I=null)):e=null,e===null)throw En(t);return t.lanes=536870912,null}return oc(t,o)}var l=e.memoizedState;if(l!==null){var c=l.dehydrated;if(Hr(t),a)if(t.flags&256)t.flags&=-257,t=zf(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(h(558));else if(ue||Jn(e,t,n,!1),a=(n&e.childLanes)!==0,ue||a){if(zn.current===null){if(o=J,o!==null&&(c=Mb(o,n),c!==0&&c!==l.retryLane))throw l.retryLane=c,ao(e,c),He(o,e,c),td;Hc()}t=zf(e,t,n)}else e=l.treeContext,I=it(c.nextSibling),me=t,A=!0,vn=null,ct=!1,e!==null&&up(t,e),t=oc(t,o),t.flags|=134221824;return t}return e=qt(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function go(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(h(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Gr(e,t,n,o,a){return Fn(t),n=Qu(e,t,n,o,void 0,a),o=Xu(),e!==null&&!ue?(Zu(e,t,a),Qt(e,t,a)):(A&&o&&Fc(t),t.flags|=1,se(e,t,n,a),t.child)}function Nf(e,t,n,o,a,l){return Fn(t),t.updateQueue=null,n=yp(t,o,n,a),hp(e),o=Xu(),e!==null&&!ue?(Zu(e,t,l),Qt(e,t,l)):(A&&o&&Fc(t),t.flags|=1,se(e,t,n,l),t.child)}function Of(e,t,n,o,a){if(Fn(t),t.stateNode===null){var l=No,c=n.contextType;typeof c=="object"&&c!==null&&(l=ke(c)),l=new n(o,l),t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=jr,t.stateNode=l,l._reactInternals=t,l=t.stateNode,l.props=o,l.state=t.memoizedState,l.refs={},Yu(t),c=n.contextType,l.context=typeof c=="object"&&c!==null?ke(c):No,l.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&($i(t,n,c,o),l.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(c=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),c!==l.state&&jr.enqueueReplaceState(l,l.state,null),Da(t,o,l,a),Ma(),l.state=t.memoizedState),typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){l=t.stateNode;var i=t.memoizedProps,r=Pn(n,i);l.props=r;var u=l.context,f=n.contextType;c=No,typeof f=="object"&&f!==null&&(c=ke(f));var g=n.getDerivedStateFromProps;f=typeof g=="function"||typeof l.getSnapshotBeforeUpdate=="function",i=t.pendingProps!==i,f||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i||u!==c)&&xf(t,l,o,c),ln=!1;var d=t.memoizedState;l.state=d,Da(t,o,l,a),Ma(),u=t.memoizedState,i||d!==u||ln?(typeof g=="function"&&($i(t,n,g,o),u=t.memoizedState),(r=ln||kf(t,n,r,o,d,u,c))?(f||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=u),l.props=o,l.state=u,l.context=c,o=r):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{l=t.stateNode,Rr(e,t),c=t.memoizedProps,f=Pn(n,c),l.props=f,g=t.pendingProps,d=l.context,u=n.contextType,r=No,typeof u=="object"&&u!==null&&(r=ke(u)),i=n.getDerivedStateFromProps,(u=typeof i=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(c!==g||d!==r)&&xf(t,l,o,r),ln=!1,d=t.memoizedState,l.state=d,Da(t,o,l,a),Ma();var p=t.memoizedState;c!==g||d!==p||ln||e!==null&&e.dependencies!==null&&Sc(e.dependencies)?(typeof i=="function"&&($i(t,n,i,o),p=t.memoizedState),(f=ln||kf(t,n,f,o,d,p,r)||e!==null&&e.dependencies!==null&&Sc(e.dependencies))?(u||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(o,p,r),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(o,p,r)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&d===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&d===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=p),l.props=o,l.state=p,l.context=r,o=f):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&d===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&d===e.memoizedState||(t.flags|=1024),o=!1)}return l=o,go(e,t),o=(t.flags&128)!==0,l||o?(l=t.stateNode,n=o&&typeof n.getDerivedStateFromError!="function"?null:l.render(),t.flags|=1,e!==null&&o?(t.child=$n(t,e.child,null,a),t.child=$n(t,null,n,a)):se(e,t,n,a),t.memoizedState=l.state,e=t.child):e=Qt(e,t,a),e}function Cf(e,t,n,o){return Kn(),t.flags|=256,se(e,t,n,o),t.child}var Qr={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Xr(e){return{baseLanes:e,cachePool:sp()}}function Zr(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Xe),e}function ov(e,t,n){var o=t.pendingProps,a=!1,l=(t.flags&128)!==0,c;if((c=l)||(c=e!==null&&e.memoizedState===null?!1:(Se.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(A){if(a?hn(t):yn(),(e=I)?(e=ng(e,ct),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Tn!==null?{id:Tt,overflow:Et}:null,retryLane:536870912,hydrationErrors:null},n=ip(e),n.return=t,t.child=n,me=t,I=null)):e=null,e===null)throw En(t);return vd(e)?t.lanes=32:t.lanes=536870912,null}return l=o.children,o=o.fallback,a?(yn(),a=t.mode,l=ti({mode:"hidden",children:l},a),o=Gn(o,a,n,null),l.return=t,o.return=t,l.sibling=o,t.child=l,o=t.child,o.memoizedState=Xr(n),o.childLanes=Zr(e,c,n),t.memoizedState=Qr,Ba(null,o)):(hn(t),nd(t,l))}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(r!==null)return i0(e,t,l,c,o,r,i,n)}return a?(yn(),a=o.fallback,l=t.mode,i=e.child,r=i.sibling,o=qt(i,{mode:"hidden",children:o.children}),o.subtreeFlags=i.subtreeFlags&1206910976,r!==null?a=qt(r,a):(a=Gn(a,l,n,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,Ba(null,o),o=t.child,a=e.child.memoizedState,a===null?a=Xr(n):(l=a.cachePool,l!==null?(i=re._currentValue,l=l.parent!==i?{parent:i,pool:i}:l):l=sp(),a={baseLanes:a.baseLanes|n,cachePool:l}),o.memoizedState=a,o.childLanes=Zr(e,c,n),t.memoizedState=Qr,Ba(e.child,o)):(hn(t),n=e.child,e=n.sibling,n=qt(n,{mode:"visible",children:o.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function nd(e,t){return t=ti({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function ti(e,t){return e=Ue(22,e,null,t),e.lanes=0,e}function ql(e,t,n){return $n(t,e.child,null,n),e=nd(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function i0(e,t,n,o,a,l,c,i){if(n)return t.flags&256?(hn(t),t.flags&=-257,ql(e,t,i)):t.memoizedState!==null?(yn(),t.child=e.child,t.flags|=128,null):(yn(),l=a.fallback,c=t.mode,a=ti({mode:"visible",children:a.children},c),l=Gn(l,c,i,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,$n(t,e.child,null,i),a=t.child,a.memoizedState=Xr(i),a.childLanes=Zr(e,o,i),t.memoizedState=Qr,Ba(null,a));if(hn(t),vd(l)){if(o=l.nextSibling&&l.nextSibling.dataset,o)var r=o.dgst;return o=r,o!==""&&(a=Error(h(419)),a.stack="",a.digest=o,Xa({value:a,source:null,stack:null})),ql(e,t,i)}if(ue||Jn(e,t,i,!1),o=(i&e.childLanes)!==0,ue||o){if(zn.current!==null)return ql(e,t,i);if(o=J,o!==null&&(a=Mb(o,i),a!==0&&a!==c.retryLane))throw c.retryLane=a,ao(e,a),He(o,e,a),td;return mu(l)||Hc(),ql(e,t,i)}return mu(l)?(t.flags|=192,t.child=e.child,null):(e=c.treeContext,I=it(l.nextSibling),me=t,A=!0,vn=null,ct=!1,e!==null&&up(t,e),t=nd(t,a.children),t.flags|=134221824,t)}function Af(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),Pl(e.return,t,n)}function _f(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Ec(n)===null&&(t=e),e=e.sibling}return t}function Ll(e,t,n,o,a,l){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:a,treeForkCount:l}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=n,c.tailMode=a,c.treeForkCount=l)}function Ii(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function Kr(e,t,n){var o=t.pendingProps,a=o.revealOrder,l=o.tail;o=o.children;var c=Se.current;if(t.flags&128)return Ka(t,c),null;var i=(c&2)!==0;if(i?(c=c&1|2,t.flags|=128):c&=1,Ka(t,c),a==="backwards"&&e!==null?(Ii(e),se(e,t,o,n),Ii(e)):se(e,t,o,n),o=A?Qa:0,!i&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Af(e,n,t);else if(e.tag===19)Af(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"backwards":n=_f(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null,Ii(t)),Ll(t,!0,a,null,l,o);break;case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&Ec(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Ll(t,!0,n,null,l,o);break;case"together":Ll(t,!1,null,null,void 0,o);break;case"independent":t.memoizedState=null;break;default:n=_f(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Ll(t,!1,a,n,l,o)}return t.child}function Mf(e,t,n){var o=t.pendingProps;return dn(t,t.type,o.value),se(e,t,o.children,n),t.child}function Qt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),On|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Jn(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(h(153));if(t.child!==null){for(e=t.child,n=qt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=qt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function od(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Sc(e)))}function r0(e,t,n){switch(t.tag){case 3:pc(t,t.stateNode.containerInfo),dn(t,re,e.memoizedState.cache),Kn();break;case 27:case 5:kr(t);break;case 4:pc(t,t.stateNode.containerInfo);break;case 10:dn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Hr(t),null;break;case 13:var o=t.memoizedState;if(o!==null){if(o.dehydrated!==null)return hn(t),t.flags|=128,null;o=Jn(e,t,n,!1);var a=t.child.childLanes;return o||(n&a)!==0?ov(e,t,n):(hn(t),e=Qt(e,t,n),e!==null?e.sibling:null)}hn(t);break;case 19:if(t.flags&128)return Kr(e,t,n);if(a=(e.flags&128)!==0,o=(n&t.childLanes)!==0,o||(Jn(e,t,n,!1),o=(n&t.childLanes)!==0),a){if(o)return Kr(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),Ka(t,Se.current),o)break;return null;case 22:return t.lanes=0,nv(e,t,n,t.pendingProps);case 24:dn(t,re,e.memoizedState.cache)}return Qt(e,t,n)}function av(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)ue=!0;else{if(!od(e,n)&&(t.flags&128)===0)return ue=!1,r0(e,t,n);ue=(e.flags&131072)!==0}else ue=!1,A&&(t.flags&1048576)!==0&&rp(t,Qa,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=qn(t.elementType),t.type=e,typeof e=="function")Bu(e)?(o=Pn(e,o),t.tag=1,t=Of(null,t,e,o,n)):(t.tag=0,t=Gr(null,t,e,o,n));else{if(e!=null){var a=e.$$typeof;if(a===Su){t.tag=11,t=wf(null,t,e,o,n);break e}else if(a===wu){t.tag=14,t=Tf(null,t,e,o,n);break e}else if(a===St){t.tag=10,t.type=e,t=Mf(null,t,n);break e}}throw t=hr(e)||e,Error(h(306,t,""))}}return t;case 0:return Gr(e,t,t.type,t.pendingProps,n);case 1:return o=t.type,a=Pn(o,t.pendingProps),Of(e,t,o,a,n);case 3:e:{if(pc(t,t.stateNode.containerInfo),e===null)throw Error(h(387));o=t.pendingProps;var l=t.memoizedState;a=l.element,Rr(e,t),Da(t,o,null,n);var c=t.memoizedState;if(o=c.cache,dn(t,re,o),o!==l.cache&&Mr(t,[re],n,!0),Ma(),o=c.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){t=Cf(e,t,o,n);break e}else if(o!==a){a=lt(Error(h(424)),t),Xa(a),t=Cf(e,t,o,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,I=it(e.firstChild),me=t,A=!0,vn=null,ct=!0,n=pp(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling;else{if(Kn(),o===a){t=Qt(e,t,n);break e}se(e,t,o,n)}t=t.child}return t;case 26:return go(e,t),e===null?(n=lb(t.type,null,t.pendingProps,null))?t.memoizedState=n:A||(t.stateNode=Kv(t.type,t.pendingProps,pn.current,t)):t.memoizedState=lb(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return kr(t),e===null&&A&&(o=t.stateNode=og(t.type,t.pendingProps,pn.current),me=t,ct=!0,a=I,An(t.type)?(hu=a,I=it(o.firstChild)):I=a),se(e,t,t.pendingProps.children,n),go(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&A&&((a=o=I)&&(o=ey(o,t.type,t.pendingProps,ct),o!==null?(t.stateNode=o,me=t,I=it(o.firstChild),ct=!1,a=!0):a=!1),a||En(t)),kr(t),a=t.type,l=t.pendingProps,c=e!==null?e.memoizedProps:null,o=l.children,pu(a,l)?o=null:c!==null&&pu(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=Qu(e,t,$h,null,null,n),$o._currentValue=a),go(e,t),se(e,t,o,n),t.child;case 6:return e===null&&A&&((e=n=I)&&(n=ty(n,t.pendingProps,ct),n!==null?(t.stateNode=n,me=t,I=null,e=!0):e=!1),e||En(t)),null;case 13:return ov(e,t,n);case 4:return pc(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=$n(t,null,o,n):se(e,t,o,n),t.child;case 11:return wf(e,t,t.type,t.pendingProps,n);case 7:return o=t.pendingProps,go(e,t),se(e,t,o,n),t.child;case 8:return se(e,t,t.pendingProps.children,n),t.child;case 12:return se(e,t,t.pendingProps.children,n),t.child;case 10:return Mf(e,t,n);case 9:return a=t.type._context,o=t.pendingProps.children,Fn(t),a=ke(a),o=o(a),t.flags|=1,se(e,t,o,n),t.child;case 14:return Tf(e,t,t.type,t.pendingProps,n);case 15:return tv(e,t,t.type,t.pendingProps,n);case 19:return Kr(e,t,n);case 31:return c0(e,t,n);case 22:return nv(e,t,n,t.pendingProps);case 24:return Fn(t),o=ke(re),e===null?(a=qu(),a===null&&(a=J,l=Hu(),a.pooledCache=l,l.refCount++,l!==null&&(a.pooledCacheLanes|=n),a=l),t.memoizedState={parent:o,cache:a},Yu(t),dn(t,re,a)):((e.lanes&n)!==0&&(Rr(e,t),Da(t,null,null,n),Ma()),a=e.memoizedState,l=t.memoizedState,a.parent!==o?(a={parent:o,cache:o},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),dn(t,re,o)):(o=l.cache,dn(t,re,o),o!==a.cache&&Mr(t,[re],n,!0))),se(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=t.pendingProps,o.name!=null&&o.name!=="auto"?t.flags|=e===null?18882560:18874368:A&&Fc(t),e!==null&&e.memoizedProps.name!==o.name?t.flags|=4194816:go(e,t),se(e,t,o.children,n),t.child;case 29:throw t.pendingProps}throw Error(h(156,t.tag))}function Bt(e){e.flags|=4}function Pi(e,t,n,o,a){var l;if((l=(e.mode&32)!==0)&&(l=n===null?rb(t,o):rb(t,o)&&(o.src!==n.src||o.srcSet!==n.srcSet)),l){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(Dv())e.flags|=8192;else throw Xn=wc,Lu}else e.flags&=-16777217}function Df(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!ig(t))if(Dv())e.flags|=8192;else throw Xn=wc,Lu}function Yl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Cb():536870912,e.lanes|=t,Xo|=t)}function ha(e,t){if(!A)switch(e.tailMode){case"visible":break;case"collapsed":for(var n=e.tail,o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function $(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags&1206910976,o|=a.flags&1206910976,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function u0(e,t,n){var o=t.pendingProps;switch(Uu(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $(t),null;case 1:return $(t),null;case 3:return n=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),Lt(re),jo(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(po(t)?Bt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ji())),$(t),null;case 26:var a=t.type,l=t.memoizedState;return e===null?(Bt(t),l!==null?($(t),Df(t,l)):($(t),Pi(t,a,null,o,n))):l?l!==e.memoizedState?(Bt(t),$(t),Df(t,l)):($(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&Bt(t),$(t),Pi(t,a,e,o,n)),null;case 27:if(vc(t),n=pn.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Bt(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return $(t),t.subtreeFlags&=-33554433,null}e=zt.current,po(t)?lf(t,e):(e=og(a,o,n),t.stateNode=e,Bt(t))}return $(t),t.subtreeFlags&=-33554433,null;case 5:if(vc(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Bt(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return $(t),t.subtreeFlags&=-33554433,null}if(l=zt.current,po(t))lf(t,l);else{var c=$a(pn.current);switch(l){case 1:l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":l=c.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof o.is=="string"?c.createElement("select",{is:o.is}):c.createElement("select"),o.multiple?l.multiple=!0:o.size&&(l.size=o.size);break;default:l=typeof o.is=="string"?c.createElement(a,{is:o.is}):c.createElement(a)}}l[ye]=t,l[Le]=o;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)l.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=l;e:switch(we(l,a,o),a){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&Bt(t)}}return $(t),t.subtreeFlags&=-33554433,Pi(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&Bt(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(h(166));if(e=pn.current,po(t)){if(e=t.stateNode,n=t.memoizedProps,o=null,a=me,a!==null)switch(a.tag){case 27:case 5:o=a.memoizedProps}e[ye]=t,e=!!(e.nodeValue===n||o!==null&&o.suppressHydrationWarning===!0||Xv(e.nodeValue,n)),e||En(t,!0)}else e=$a(e).createTextNode(o),e[ye]=t,t.stateNode=e}return $(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(o=po(t),n!==null){if(e===null){if(!o)throw Error(h(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(557));e[ye]=t}else Kn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),e=!1}else n=Ji(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Ge(t),t):(Ge(t),null);if((t.flags&128)!==0)throw Error(h(558))}return $(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=po(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(h(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(h(317));a[ye]=t}else Kn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),a=!1}else a=Ji(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Ge(t),t):(Ge(t),null)}return Ge(t),(t.flags&128)!==0?(t.lanes=n,t):(n=o!==null,e=e!==null&&e.memoizedState!==null,n&&(o=t.child,a=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(a=o.alternate.memoizedState.cachePool.pool),l=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(l=o.memoizedState.cachePool.pool),l!==a&&(o.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Yl(t,t.updateQueue),$(t),null);case 4:return jo(),e===null&&fd(t.stateNode.containerInfo),t.flags|=67108864,$(t),null;case 10:return Lt(t.type),$(t),null;case 19:if(Vu(t),o=t.memoizedState,o===null)return $(t),null;if(a=(t.flags&128)!==0,l=o.rendering,l===null)if(a)ha(o,!1);else{if(le!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=Ec(e),l!==null){for(t.flags|=128,ha(o,!1),e=l.updateQueue,t.updateQueue=e,Yl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)cp(n,e),n=n.sibling;return Ka(t,Se.current&1|2),A&&Ut(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&Ze()>Bc&&(t.flags|=128,a=!0,ha(o,!1),t.lanes=4194304)}else{if(!a)if(e=Ec(l),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Yl(t,e),ha(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!l.alternate&&!A)return $(t),null}else 2*Ze()-o.renderingStartTime>Bc&&n!==536870912&&(t.flags|=128,a=!0,ha(o,!1),t.lanes=4194304);o.isBackwards?(l.sibling=t.child,t.child=l):(e=o.last,e!==null?e.sibling=l:t.child=l,o.last=l)}if(o.tail!==null){e=o.tail;e:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break e}n=n.sibling}n=!0}return o.rendering=e,o.tail=e.sibling,o.renderingStartTime=Ze(),e.sibling=null,l=Se.current,l=a?l&1|2:l&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!n||A?Ka(t,l):(n=l,P(Te,t),P(Se,n),Ne===null&&(Ne=t)),A&&Ut(t,o.treeForkCount),e}return $(t),null;case 22:case 23:return Ge(t),ju(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(n&536870912)!==0&&(t.flags&128)===0&&($(t),t.subtreeFlags&6&&(t.flags|=8192)):$(t),n=t.updateQueue,n!==null&&Yl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==n&&(t.flags|=2048),e!==null&&xe(Qn),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Lt(re),$(t),null;case 25:return null;case 30:return t.flags|=33554432,$(t),null}throw Error(h(156,t.tag))}function d0(e,t){switch(Uu(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Lt(re),jo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return vc(t),null;case 31:if(t.memoizedState!==null){if(Ge(t),t.alternate===null)throw Error(h(340));Kn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Ge(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(h(340));Kn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Vu(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return jo(),null;case 10:return Lt(t.type),null;case 22:case 23:return Ge(t),ju(),e!==null&&xe(Qn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Lt(re),null;case 25:return null;default:return null}}function lv(e,t){switch(Uu(t),t.tag){case 3:Lt(re),jo();break;case 26:case 27:case 5:vc(t);break;case 4:jo();break;case 31:t.memoizedState!==null&&Ge(t);break;case 13:Ge(t);break;case 19:Vu(t);break;case 10:Lt(t.type);break;case 22:case 23:Ge(t),ju(),e!==null&&xe(Qn);break;case 24:Lt(re)}}function dl(e,t){try{var n=t.updateQueue,o=n!==null?n.lastEffect:null;if(o!==null){var a=o.next;n=a;do{if((n.tag&e)===e){o=void 0;var l=n.create,c=n.inst;o=l(),c.destroy=o}n=n.next}while(n!==a)}}catch(i){X(t,t.return,i)}}function Nn(e,t,n){try{var o=t.updateQueue,a=o!==null?o.lastEffect:null;if(a!==null){var l=a.next;o=l;do{if((o.tag&e)===e){var c=o.inst,i=c.destroy;if(i!==void 0){c.destroy=void 0,a=t;var r=n,u=i;try{u()}catch(f){X(a,r,f)}}}o=o.next}while(o!==l)}}catch(f){X(t,t.return,f)}}function cv(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{gp(t,n)}catch(o){X(e,e.return,o)}}}function iv(e,t,n){n.props=Pn(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(o){X(e,t,o)}}function kt(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:var a=e.stateNode,l=jt(e.memoizedProps,a);(a.ref===null||a.ref.name!==l)&&(a.ref=$v(l)),o=a.ref;break;case 7:if(e.stateNode===null){var c=new $e(e);qe(e.child,!1,I0,c,void 0,void 0),e.stateNode=c}o=e.stateNode;break;default:o=e.stateNode}typeof n=="function"?e.refCleanup=n(o):n.current=o}}catch(i){X(e,t,i)}}function he(e,t){var n=e.ref,o=e.refCleanup;if(n!==null)if(typeof o=="function")try{o()}catch(a){X(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){X(e,t,a)}else n.current=null}function Ac(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)tg(e.stateNode,t[n])}function Rf(e){for(var t=e.return;t!==null&&(ld(t)&&tg(e.stateNode,t.stateNode),!ad(t));)t=t.return}function Ua(e){for(var t=e.return;t!==null&&(ld(t)&&P0(e.stateNode,t.stateNode),!ad(t));)t=t.return}function ad(e){return e.tag===5||e.tag===3||e.tag===27}function ld(e){return e&&e.tag===7&&e.stateNode!==null}function Jr(e){var t=e.type,n=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&o.focus();break e;case"img":n.src?o.src=n.src:n.srcSet&&(o.srcset=n.srcSet)}}catch(a){X(e,e.return,a)}}function er(e,t,n){try{var o=e.stateNode;R0(o,e.type,n,t),o[Le]=t}catch(a){X(e,e.return,a)}}function rv(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&An(e.type)||e.tag===4}function tr(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||rv(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&An(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Fr(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=wt)),Ac(e,o),q=!0;else if(a!==4&&(a===27&&(Ac(e,o),o=null,An(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Fr(e,t,n,o),e=e.sibling;e!==null;)Fr(e,t,n,o),e=e.sibling}function _c(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?n.insertBefore(a,t):n.appendChild(a),Ac(e,o),q=!0;else if(a!==4&&(a===27&&(Ac(e,o),o=null,An(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(_c(e,t,n,o),e=e.sibling;e!==null;)_c(e,t,n,o),e=e.sibling}function uv(e){var t=e.stateNode,n=e.memoizedProps;try{for(var o=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);we(t,o,n),t[ye]=e,t[Le]=n}catch(l){X(e,e.return,l)}}var Mc=!1,Qe=null;function Bf(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Mc=!0)}var xt=null;function Uf(){var e=xt;return xt=null,e}var Be=0;function oa(e,t,n,o,a){return Be=0,dv(e.child,t,n,o,a)}function dv(e,t,n,o,a){for(var l=!1;e!==null;){if(e.tag===5){var c=e.stateNode;if(o!==null){var i=vu(c);o.push(i),i.view&&(l=!0)}else l||vu(c).view&&(l=!0);Mc=!0,Jv(c,Be===0?t:t+"_"+Be,n),Be++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&a||dv(e.child,t,n,o,a)&&(l=!0));e=e.sibling}return l}function Ot(e,t){for(;e!==null;)e.tag===5?Fv(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||Ot(e.child,t)),e=e.sibling}function ac(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(ac(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name==="auto")throw Error(h(544));var n=t.name;t=Kt(t.default,t.share),t!=="none"&&(oa(e,n,t,null,!1)||Ot(e.child,!1))}e=e.sibling}}function Wr(e,t){if(e.tag===30){var n=e.stateNode,o=e.memoizedProps,a=jt(o,n),l=Kt(o.default,n.paired?o.share:o.enter);l!=="none"?oa(e,a,l,null,!1)?(ac(e),n.paired||t||Zo(e,o.onEnter)):Ot(e.child,!1):ac(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Wr(e,t),e=e.sibling;else ac(e)}function $r(e){if(Qe!==null&&Qe.size!==0){var t=Qe;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.memoizedProps,o=n.name;if(o!=null&&o!=="auto"){var a=t.get(o);if(a!==void 0){var l=Kt(n.default,n.share);if(l!=="none"&&(oa(e,o,l,null,!1)?(l=e.stateNode,a.paired=l,l.paired=a,Zo(e,n.onShare)):Ot(e.child,!1)),t.delete(o),t.size===0)break}}}$r(e)}e=e.sibling}}}function Ir(e){if(e.tag===30){var t=e.memoizedProps,n=jt(t,e.stateNode),o=Qe!==null?Qe.get(n):void 0,a=Kt(t.default,o!==void 0?t.share:t.exit);a!=="none"&&(oa(e,n,a,null,!1)?o!==void 0?(a=e.stateNode,o.paired=a,a.paired=o,Qe.delete(n),Zo(e,t.onShare)):Zo(e,t.onExit):Ot(e.child,!1)),Qe!==null&&$r(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ir(e),e=e.sibling;else Qe!==null&&$r(e)}function sv(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=jt(t,e.stateNode);t=Kt(t.default,t.update),e.flags&=-5,t!=="none"&&oa(e,n,t,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&sv(e);e=e.sibling}}function Pr(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.stateNode;t.paired!==null&&(t.paired=null,Ot(e.child,!1))}Pr(e)}e=e.sibling}}function lc(e){if(e.tag===30)e.stateNode.paired=null,Ot(e.child,!1),Pr(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)lc(e),e=e.sibling;else Pr(e)}function fv(e){for(e=e.child;e!==null;)e.tag===30?Ot(e.child,!1):(e.subtreeFlags&33554432)!==0&&fv(e),e=e.sibling}function cd(e,t,n,o,a,l,c){for(var i=!1;t!==null;){if(t.tag===5){var r=t.stateNode;if(l!==null&&Be<l.length){var u=l[Be],f=vu(r);(u.view||f.view)&&(i=!0);var g;if(g=(e.flags&4)===0)if(f.clip)g=!0;else{g=u.rect;var d=f.rect;g=g.y!==d.y||g.x!==d.x||g.height!==d.height||g.width!==d.width}g&&(e.flags|=4),f.abs?f=!u.abs:(u=u.rect,f=f.rect,f=u.height!==f.height||u.width!==f.width),f&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&Jv(r,Be===0?n:n+"_"+Be,a),i&&(e.flags&4)!==0||(xt===null&&(xt=[]),xt.push(r,Be===0?o:o+"_"+Be,t.memoizedProps)),Be++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c?e.flags|=t.flags&32:cd(e,t.child,n,o,a,l,c)&&(i=!0));t=t.sibling}return i}function bv(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,o=e.stateNode,a=jt(n,o),l=Kt(n.default,n.update);if(t){o=o.clones;var c=o===null?null:o.map(Y0)}else c=e.memoizedState,e.memoizedState=null;o=e;var i=e.child;Be=0,a=cd(o,i,a,a,l,c,!1),(e.flags&4)!==0&&a&&(t||Zo(e,n.onUpdate))}else(e.subtreeFlags&33554432)!==0&&bv(e,t);e=e.sibling}}var pe=!1,V=!1,mt=!1,nr=!1,Hf=typeof WeakSet=="function"?WeakSet:Set,ve=null,ht=!1,za=!1,Dc=!1,eu=!1;function s0(e,t,n){if(e=e.containerInfo,fu=Io,e=Ib(e),Mu(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var a=o.getSelection&&o.getSelection();if(a&&a.rangeCount!==0){o=a.anchorNode;var l=a.anchorOffset,c=a.focusNode;a=a.focusOffset;try{o.nodeType,c.nodeType}catch{o=null;break e}var i=0,r=-1,u=-1,f=0,g=0,d=e,p=null;t:for(;;){for(var y;d!==o||l!==0&&d.nodeType!==3||(r=i+l),d!==c||a!==0&&d.nodeType!==3||(u=i+a),d.nodeType===3&&(i+=d.nodeValue.length),(y=d.firstChild)!==null;)p=d,d=y;for(;;){if(d===e)break t;if(p===o&&++f===l&&(r=i),p===c&&++g===a&&(u=i),(y=d.nextSibling)!==null)break;d=p,p=d.parentNode}d=y}o=r===-1||u===-1?null:{start:r,end:u}}else o=null}o=o||{start:0,end:0}}else o=null;for(bu={focusedElem:e,selectionRange:o},Io=!1,n=(n&335544064)===n,ve=t,t=n?9270:1024;ve!==null;){if(e=ve,n&&(o=e.deletions,o!==null))for(l=0;l<o.length;l++)n&&Ir(o[l]);if(e.alternate===null&&(e.flags&2)!==0)n&&Bf(e),jl(n);else{if(e.tag===22){if(o=e.alternate,e.memoizedState!==null){o!==null&&o.memoizedState===null&&n&&Ir(o),jl(n);continue}else if(o!==null&&o.memoizedState!==null){n&&Bf(e),jl(n);continue}}o=e.child,(e.subtreeFlags&t)!==0&&o!==null?(o.return=e,ve=o):(n&&sv(e),jl(n))}}Qe=null}function jl(e){for(;ve!==null;){var t=ve,n=e,o=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if((a&1024)!==0&&o!==null){n=void 0,a=o.memoizedProps,o=o.memoizedState;var l=t.stateNode;try{var c=Pn(t.type,a);n=l.getSnapshotBeforeUpdate(c,o),l.__reactInternalSnapshotBeforeUpdate=n}catch(i){X(t,t.return,i)}}break;case 3:if((a&1024)!==0){if(o=t.stateNode.containerInfo,n=o.nodeType,n===9)gu(o);else if(n===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":gu(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&o!==null&&(n=jt(o.memoizedProps,o.stateNode),a=t.memoizedProps,a=Kt(a.default,a.update),a!=="none"&&oa(o,n,a,o.memoizedState=[],!0));break;default:if((a&1024)!==0)throw Error(h(163))}if(o=t.sibling,o!==null){o.return=t.return,ve=o;break}ve=t.return}}function pv(e,t,n){var o=n.flags;switch(n.tag){case 0:case 11:case 15:yt(e,n),o&4&&dl(5,n);break;case 1:if(yt(e,n),o&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){X(n,n.return,c)}else{var a=Pn(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){X(n,n.return,c)}}o&64&&cv(n),o&512&&kt(n,n.return);break;case 3:if(yt(e,n),o&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{gp(e,t)}catch(c){X(n,n.return,c)}}break;case 27:t===null&&o&4&&uv(n);case 26:case 5:yt(e,n),t===null&&o&4&&Jr(n),o&512&&kt(n,n.return);break;case 12:yt(e,n);break;case 31:yt(e,n),o&4&&hv(e,n);break;case 13:yt(e,n),o&4&&yv(e,n),o&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=w0.bind(null,n),ny(e,n))));break;case 22:if(o=n.memoizedState!==null||pe,!o){var l=t!==null&&t.memoizedState!==null||V;t=pe,a=V,pe=o,(V=l)&&!a?(o=2,(n.subtreeFlags&8772)!==0&&(o|=1),dt(e,n,o)):yt(e,n),pe=t,V=a}break;case 30:yt(e,n),o&512&&kt(n,n.return);break;case 7:o&512&&kt(n,n.return);default:yt(e,n)}}function tu(e,t){for(e=e.child;e!==null;)vv(e,t),e=e.sibling}function vv(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var o=n.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var a=e.stateNode,l=e.memoizedProps.style,c=l!=null&&l.hasOwnProperty("display")?l.display:null;a.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(r){X(e,e.return,r)}nu(e,t);break;case 6:try{e.stateNode.nodeValue=t?"":e.memoizedProps,q=!0}catch(r){X(e,e.return,r)}break;case 18:try{var i=e.stateNode;t?Pf(i,!0):Pf(e.stateNode,!1)}catch(r){X(e,e.return,r)}break;case 22:case 23:e.memoizedState===null&&tu(e,t);break;default:tu(e,t)}}function nu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var n=e,o=t;switch(n.tag){case 4:vv(n,o);break e;case 22:n.memoizedState===null&&nu(n,o);break e;default:nu(n,o)}}e=e.sibling}}function gv(e){var t=e.alternate;t!==null&&(e.alternate=null,gv(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Gc(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ne=null,De=!1;function ut(e,t,n){for(n=n.child;n!==null;)mv(e,t,n),n=n.sibling}function mv(e,t,n){if(Ke&&typeof Ke.onCommitFiberUnmount=="function")try{Ke.onCommitFiberUnmount(ol,n)}catch{}switch(n.tag){case 26:V||he(n,t),ut(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!V&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:V||he(n,t),Ua(n);var o=ne,a=De;An(n.type)&&(ne=n.stateNode,De=!1),ut(e,t,n),ag(n.stateNode,n.type,n.memoizedProps),ne=o,De=a;break;case 5:V||he(n,t),Ua(n);case 6:if(n.tag===6&&Ua(n),o=ne,a=De,ne=null,ut(e,t,n),ne=o,De=a,ne!==null)if(De)try{(ne.nodeType===9?ne.body:ne.nodeName==="HTML"?ne.ownerDocument.body:ne).removeChild(n.stateNode),q=!0}catch(l){X(n,t,l)}else try{ne.removeChild(n.stateNode),q=!0}catch(l){X(n,t,l)}break;case 18:ne!==null&&(De?(e=ne,If(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Po(e)):If(ne,n.stateNode));break;case 4:o=ne,a=De,ne=n.stateNode.containerInfo,De=!0,ut(e,t,n),ne=o,De=a;break;case 0:case 11:case 14:case 15:Nn(2,n,t),V||Nn(4,n,t),ut(e,t,n);break;case 1:V||(he(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"&&iv(n,t,o)),ut(e,t,n);break;case 21:ut(e,t,n);break;case 22:V=(o=V)||n.memoizedState!==null,ut(e,t,n),V=o;break;case 30:he(n,t),ut(e,t,n);break;case 7:V||he(n,t),ut(e,t,n);break;default:ut(e,t,n)}}function hv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Po(e)}catch(n){X(t,t.return,n)}}}function yv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Po(e)}catch(n){X(t,t.return,n)}}function f0(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Hf),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Hf),t;default:throw Error(h(435,e.tag))}}function Vl(e,t){var n=f0(e);t.forEach(function(o){if(!n.has(o)){n.add(o);var a=T0.bind(null,e,o);o.then(a,a)}})}function Ce(e,t,n){var o=t.deletions;if(o!==null)for(var a=0;a<o.length;a++){var l=o[a],c=e,i=t,r=i;e:for(;r!==null;){switch(r.tag){case 27:if(An(r.type)){ne=r.stateNode,De=!1;break e}break;case 5:ne=r.stateNode,De=!1;break e;case 3:case 4:ne=r.stateNode.containerInfo,De=!0;break e}r=r.return}if(ne===null)throw Error(h(160));mv(c,i,l),ne=null,De=!1,c=l.alternate,c!==null&&(c.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)kv(t,e,n),t=t.sibling}var st=null;function kv(e,t,n){var o=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(o=e.updateQueue,o=o!==null?o.events:null,o!==null))for(var l=0;l<o.length;l++){var c=o[l];c.ref.impl=c.nextImpl}Ce(t,e,n),Ae(e),a&4&&(Nn(3,e,e.return),dl(3,e),Nn(5,e,e.return));break;case 1:Ce(t,e,n),Ae(e),a&512&&(V||o===null||he(o,o.return)),a&64&&pe&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(l=st,Ce(t,e,n),Ae(e),a&512&&(V||o===null||he(o,o.return)),a&4)if(a=o!==null?o.memoizedState:null,n=e.memoizedState,o===null)if(n===null)if(e.stateNode===null)if(pe)e.stateNode=Kv(e.type,e.memoizedProps,t.containerInfo,e);else{e:{t=e.type,n=e.memoizedProps,a=l.ownerDocument||l;t:switch(t){case"title":o=a.getElementsByTagName("title")[0],(!o||o[cl]||o[ye]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(t),a.head.insertBefore(o,a.querySelector("head > title"))),we(o,t,n),o[ye]=e,ge(o),t=o;break e;case"link":if(l=ib("link","href",a).get(t+(n.href||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){l.splice(c,1);break t}}o=a.createElement(t),we(o,t,n),a.head.appendChild(o);break;case"meta":if(l=ib("meta","content",a).get(t+(n.content||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){l.splice(c,1);break t}}o=a.createElement(t),we(o,t,n),a.head.appendChild(o);break;default:throw Error(h(468,t))}o[ye]=e,ge(o),t=o}e.stateNode=t}else pe||yu(l,e.type,e.stateNode);else e.stateNode=cb(l,n,e.memoizedProps);else a!==n?(a===null?(t=o.stateNode,t===null||V||t.parentNode.removeChild(t)):a.count--,n===null?pe||yu(l,e.type,e.stateNode):cb(l,n,e.memoizedProps)):n===null&&e.stateNode!==null&&er(e,e.memoizedProps,o.memoizedProps);break;case 27:Ce(t,e,n),Ae(e),a&512&&(V||o===null||he(o,o.return)),o!==null&&a&4&&er(e,e.memoizedProps,o.memoizedProps);break;case 5:if(l=mt,mt=!1,Ce(t,e,n),mt=l,Ae(e),a&512&&(V||o===null||he(o,o.return)),e.flags&32){t=e.stateNode;try{Go(t,""),q=!0}catch(f){X(e,e.return,f)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,er(e,t,o!==null?o.memoizedProps:t)),a&1024&&(nr=!0);break;case 6:if(Ce(t,e,n),Ae(e),a&4){if(e.stateNode===null)throw Error(h(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,q=!0}catch(f){X(e,e.return,f)}}break;case 3:if(q=!1,uc=null,l=st,st=Ia(t.containerInfo),Ce(t,e,n),st=l,Ae(e),a&4&&o!==null&&o.memoizedState.isDehydrated)try{Po(t.containerInfo)}catch(f){X(e,e.return,f)}nr&&(nr=!1,xv(e)),q=!1;break;case 4:a=mt,mt=pe,o=Vs(),l=st,st=Ia(e.stateNode.containerInfo),Ce(t,e,n),Ae(e),st=l,q&&za&&(Dc=!0),q=o,mt=a;break;case 12:Ce(t,e,n),Ae(e);break;case 31:Ce(t,e,n),Ae(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Vl(e,t)));break;case 13:Ce(t,e,n),Ae(e),e.child.flags&8192&&e.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(ni=Ze()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Vl(e,t)));break;case 22:l=e.memoizedState!==null,c=o!==null&&o.memoizedState!==null;var i=pe,r=V,u=mt;pe=i||l,mt=u||l,V=r||c,Ce(t,e,n),V=r,mt=u,pe=i,Ae(e),a&8192&&(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,!l||o===null||c||pe||V||(t=c||V,n=pe,o=V,pe=l||pe,V=t,on(e,2),pe=n,V=o),!l&&mt||tu(e,l)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Vl(e,n))));break;case 19:Ce(t,e,n),Ae(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Vl(e,t)));break;case 30:a&512&&(V||o===null||he(o,o.return)),a=Vs(),l=za,c=(n&335544064)===n,i=e.memoizedProps,za=c&&Kt(i.default,i.update)!=="none",Ce(t,e,n),Ae(e),c&&o!==null&&q&&(e.flags|=4),za=l,q=a;break;case 21:break;case 7:a&512&&(V||o===null||he(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=e);default:Ce(t,e,n),Ae(e)}}function Ae(e){var t=e.flags;if(t&2){try{for(var n,o=e.return;o!==null;){if(rv(o)){n=o;break}o=o.return}o=null;for(var a=e.return;a!==null;){if(ld(a)){var l=a.stateNode;o===null?o=[l]:o.push(l)}if(ad(a))break;a=a.return}var c=o;if(n==null)throw Error(h(160));switch(n.tag){case 27:var i=n.stateNode,r=tr(e);_c(e,r,i,c);break;case 5:var u=n.stateNode;n.flags&32&&(Go(u,""),n.flags&=-33);var f=tr(e);_c(e,f,u,c);break;case 3:case 4:var g=n.stateNode.containerInfo,d=tr(e);Fr(e,d,g,c);break;default:throw Error(h(161))}}catch(p){X(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function xv(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;xv(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,Io=!0,t.reset(),Io=!1),e=e.sibling}}function vo(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Sv(t,e),t=t.sibling;else bv(t,!1)}function Sv(e,t){var n=e.alternate;if(n===null)Wr(e,!1);else switch(e.tag){case 3:if(eu=ht=!1,Uf(),vo(t,e),!ht&&!Dc){if(e=xt,e!==null)for(var o=0;o<e.length;o+=3){n=e[o];var a=e[o+1];Fv(n,e[o+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+a+")"})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),eu=!0}xt=null;break;case 5:vo(t,e);break;case 4:o=ht,ht=!1,vo(t,e),ht&&(Dc=!0),ht=o;break;case 22:e.memoizedState===null&&(n.memoizedState!==null?Wr(e,!1):vo(t,e));break;case 30:o=ht,a=Uf(),ht=!1,vo(t,e),ht&&(e.flags|=4);var l=e.memoizedProps,c=e.stateNode;t=jt(l,c),c=jt(n.memoizedProps,c);var i=Kt(l.default,l.update);i==="none"?t=!1:(l=n.memoizedState,n.memoizedState=null,n=e.child,Be=0,t=cd(e,n,t,c,i,l,!0),Be!==(l===null?0:l.length)&&(e.flags|=32)),(e.flags&4)!==0&&t?(Zo(e,e.memoizedProps.onUpdate),xt=a):a!==null&&(a.push.apply(a,xt),xt=a),ht=(e.flags&32)!==0?!0:o;break;default:vo(t,e)}}function yt(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)pv(e,t.alternate,t),t=t.sibling}function on(e,t){for(e=e.child;e!==null;){var n=e,o=t;switch(n.tag){case 0:case 11:case 14:case 15:Nn(4,n,n.return),on(n,o);break;case 1:he(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&iv(n,n.return,a),on(n,o);break;case 27:(o&2)!==0&&ag(n.stateNode,n.type,n.memoizedProps);case 5:he(n,n.return),n.tag!==5&&n.tag!==27||Ua(n),on(n,o);break;case 6:Ua(n);break;case 26:he(n,n.return),a=n.stateNode,n.memoizedState!==null||a===null||V||a.parentNode.removeChild(a),on(n,o);break;case 22:n.memoizedState===null&&on(n,o);break;case 30:he(n,n.return),on(n,o);break;case 7:he(n,n.return);default:on(n,o)}e=e.sibling}}function dt(e,t,n){for(n=(t.subtreeFlags&8772)!==0?n:n&-2,t=t.child;t!==null;){var o=t.alternate,a=e,l=t,c=l.flags,i=(n&1)!==0;switch(l.tag){case 0:case 11:case 15:dt(a,l,n),dl(4,l);break;case 1:if(dt(a,l,n),o=l,a=o.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(f){X(o,o.return,f)}if(o=l,a=o.updateQueue,a!==null){var r=o.stateNode;try{var u=a.shared.hiddenCallbacks;if(u!==null)for(a.shared.hiddenCallbacks=null,a=0;a<u.length;a++)vp(u[a],r)}catch(f){X(o,o.return,f)}}i&&c&64&&cv(l),kt(l,l.return);break;case 27:(n&2)!==0&&uv(l);case 5:l.tag!==5&&l.tag!==27||Rf(l),dt(a,l,n),i&&o===null&&c&4&&Jr(l),kt(l,l.return);break;case 6:Rf(l);break;case 26:r=l.stateNode,l.memoizedState!==null||r===null||pe||yu(Ia(r.ownerDocument),l.type,r),dt(a,l,n),i&&o===null&&c&4&&Jr(l),kt(l,l.return);break;case 12:dt(a,l,n);break;case 31:dt(a,l,n),i&&c&4&&hv(a,l);break;case 13:dt(a,l,n),i&&c&4&&yv(a,l);break;case 22:l.memoizedState===null&&dt(a,l,n),kt(l,l.return);break;case 30:dt(a,l,n),kt(l,l.return);break;case 7:kt(l,l.return);default:dt(a,l,n)}t=t.sibling}}function id(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&rl(n))}function rd(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&rl(e))}function et(e,t,n,o){var a=(n&335544064)===n;if(t.subtreeFlags&(a?10262:10256))for(t=t.child;t!==null;)wv(e,t,n,o),t=t.sibling;else a&&fv(t)}function wv(e,t,n,o){var a=(n&335544064)===n;a&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&lc(t);var l=t.flags;switch(t.tag){case 0:case 11:case 15:et(e,t,n,o),l&2048&&dl(9,t);break;case 1:et(e,t,n,o);break;case 3:et(e,t,n,o),a&&eu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),l&2048&&(l=null,t.alternate!==null&&(l=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==l&&(t.refCount++,l!=null&&rl(l)));break;case 12:if(l&2048){et(e,t,n,o),l=t.stateNode;try{var c=t.memoizedProps,i=c.id,r=c.onPostCommit;typeof r=="function"&&r(i,t.alternate===null?"mount":"update",l.passiveEffectDuration,-0)}catch(u){X(t,t.return,u)}}else et(e,t,n,o);break;case 31:et(e,t,n,o);break;case 13:et(e,t,n,o);break;case 23:break;case 22:c=t.stateNode,i=t.alternate,t.memoizedState!==null?(a&&i!==null&&i.memoizedState===null&&lc(i),c._visibility&2?et(e,t,n,o):Ha(e,t)):(a&&i!==null&&i.memoizedState!==null&&lc(t),c._visibility&2?et(e,t,n,o):(c._visibility|=2,mo(e,t,n,o,(t.subtreeFlags&10256)!==0||!1))),l&2048&&id(i,t);break;case 24:et(e,t,n,o),l&2048&&rd(t.alternate,t);break;case 30:a&&(l=t.alternate,l!==null&&(Ot(l.child,!0),Ot(t.child,!0))),et(e,t,n,o);break;default:et(e,t,n,o)}}function mo(e,t,n,o,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var l=e,c=t,i=n,r=o,u=c.flags;switch(c.tag){case 0:case 11:case 15:mo(l,c,i,r,a),dl(8,c);break;case 23:break;case 22:var f=c.stateNode;c.memoizedState!==null?f._visibility&2?mo(l,c,i,r,a):Ha(l,c):(f._visibility|=2,mo(l,c,i,r,a)),a&&u&2048&&id(c.alternate,c);break;case 24:mo(l,c,i,r,a),a&&u&2048&&rd(c.alternate,c);break;default:mo(l,c,i,r,a)}t=t.sibling}}function Ha(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,o=t,a=o.flags;switch(o.tag){case 22:Ha(n,o),a&2048&&id(o.alternate,o);break;case 24:Ha(n,o),a&2048&&rd(o.alternate,o);break;default:Ha(n,o)}t=t.sibling}}var Ln=8192;function Un(e,t,n){if(e.subtreeFlags&Ln)for(e=e.child;e!==null;)Tv(e,t,n),e=e.sibling}function Tv(e,t,n){switch(e.tag){case 26:Un(e,t,n),e.flags&Ln&&(e.memoizedState!==null?gy(n,st,e.memoizedState,e.memoizedProps):(e=e.stateNode,(t&335544128)===t&&ub(n,e)));break;case 5:Un(e,t,n),e.flags&Ln&&(e=e.stateNode,(t&335544128)===t&&ub(n,e));break;case 3:case 4:var o=st;st=Ia(e.stateNode.containerInfo),Un(e,t,n),st=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=Ln,Ln=16777216,Un(e,t,n),Ln=o):Un(e,t,n));break;case 30:if((e.flags&Ln)!==0&&(o=e.memoizedProps.name,o!=null&&o!=="auto")){var a=e.stateNode;a.paired=null,Qe===null&&(Qe=new Map),Qe.set(o,a)}Un(e,t,n);break;default:Un(e,t,n)}}function Ev(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function ya(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];ve=o,Nv(o,e)}Ev(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)zv(e),e=e.sibling}function zv(e){switch(e.tag){case 0:case 11:case 15:ya(e),e.flags&2048&&Nn(9,e,e.return);break;case 3:ya(e);break;case 12:ya(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,cc(e)):ya(e);break;default:ya(e)}}function cc(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];ve=o,Nv(o,e)}Ev(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Nn(8,t,t.return),cc(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,cc(t));break;default:cc(t)}e=e.sibling}}function Nv(e,t){for(;ve!==null;){var n=ve;switch(n.tag){case 0:case 11:case 15:Nn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var o=n.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:rl(n.memoizedState.cache)}if(o=n.child,o!==null)o.return=n,ve=o;else e:for(n=e;ve!==null;){o=ve;var a=o.sibling,l=o.return;if(gv(o),o===n){ve=null;break e}if(a!==null){a.return=l,ve=a;break e}ve=l}}}var b0={getCacheForType:function(e){var t=ke(re),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return ke(re).controller.signal}},p0=typeof WeakMap=="function"?WeakMap:Map,Y=0,J=null,D=null,R=0,G=0,je=null,sn=!1,aa=!1,ud=!1,Xt=0,le=0,On=0,Zn=0,Rc=0,Xe=0,Xo=0,qa=null,Re=null,ou=!1,ni=0,Ov=0,Bc=1/0,Uc=null,kn=null,oe=0,bt=null,eo=null,Nt=0,au=0,lu=null,Cv=null,qo=null,Lo=null,Yo=null,La=0,ic=null;function Fe(){return(Y&2)!==0&&R!==0?R&-R:N.T!==null?sd():Db()}function Av(){if(Xe===0)if((R&536870912)===0||A){var e=Cl;Cl<<=1,(Cl&3932160)===0&&(Cl=262144),Xe=e}else Xe=536870912;return e=Te.current,e!==null&&(e.flags|=32),Xe}function Zo(e,t){if(t!=null){var n=e.stateNode,o=n.ref;o===null&&(o=n.ref=$v(jt(e.memoizedProps,n))),Lo===null&&(Lo=[]),Lo.push(t.bind(null,o))}}function He(e,t,n){(e===J&&(G===2||G===9)||e.cancelPendingCommit!==null)&&(Ko(e,0),fn(e,R,Xe,!1)),ll(e,n),((Y&2)===0||e!==J)&&(e===J&&((Y&2)===0&&(Zn|=n),le===4&&fn(e,R,Xe,!1)),At(e))}function _v(e,t,n){if((Y&6)!==0)throw Error(h(327));var o=!n&&(t&127)===0&&(t&e.expiredLanes)===0||al(e,t),a=o?m0(e,t):or(e,t,!0),l=o;do{if(a===0){aa&&!o&&fn(e,t,0,!1);break}else{if(n=e.current.alternate,l&&!v0(n)){a=or(e,t,!1),l=!1;continue}if(a===2){if(l=t,e.errorRecoveryDisabledLanes&l)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var i=e;a=qa;var r=i.current.memoizedState.isDehydrated;if(r&&(Ko(i,c).flags|=256),c=or(i,c,!1),c!==2&&c!==6){if(ud&&!r){i.errorRecoveryDisabledLanes|=l,Zn|=l,a=4;break e}l=Re,Re=a,l!==null&&(Re===null?Re=l:Re.push.apply(Re,l))}a=c}if(l=!1,a!==2)continue}}if(a===1){Ko(e,0),fn(e,t,0,!0);break}e:{switch(o=e,l=a,l){case 0:case 1:throw Error(h(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:fn(o,t,Xe,!sn);break e;case 2:Re=null;break;case 3:case 5:break;default:throw Error(h(329))}if((t&62914560)===t&&(a=ni+300-Ze(),10<a)){if(fn(o,t,Xe,!sn),Vc(o,0,!0)!==0)break e;Nt=t,o.timeoutHandle=bd(qf.bind(null,o,n,Re,Uc,ou,t,Xe,Zn,Xo,sn,l,"Throttled",-0,0),a);break e}qf(o,n,Re,Uc,ou,t,Xe,Zn,Xo,sn,l,null,-0,0)}}break}while(!0);At(e)}function qf(e,t,n,o,a,l,c,i,r,u,f,g,d,p){e.timeoutHandle=-1;var y=t.subtreeFlags,S=(l&335544064)===l;if(g=null,(S||y&8192||(y&16785408)===16785408)&&(g={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:wt},Qe=null,Tv(t,l,g),S&&(y=g,S=e.containerInfo,S=(S.nodeType===9?S:S.ownerDocument).__reactViewTransition,S!=null&&(y.count++,y.waitingForViewTransition=!0,y=Pa.bind(y),S.finished.then(y,y))),y=(l&62914560)===l?ni-Ze():(l&4194048)===l?Ov-Ze():0,y=my(g,y),y!==null)){Nt=l,e.cancelPendingCommit=y(Yf.bind(null,e,t,l,n,o,a,c,i,r,u,f,g,null,d,p)),fn(e,l,c,!u);return}Yf(e,t,l,n,o,a,c,i,r,u,f,g)}function v0(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var o=0;o<n.length;o++){var a=n[o],l=a.getSnapshot;a=a.value;try{if(!We(l(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function fn(e,t,n,o){t=Ob(e,t),t&=~Rc,t&=~Zn,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var a=t;0<a;){var l=31-Je(a),c=1<<l;o[l]=-1,a&=~c}n!==0&&Ab(e,n,t)}function oi(){return(Y&6)===0?(sl(0,!1),!1):!0}function dd(){if(D!==null){if(G===0)var e=D.return;else e=D,Ht=lo=null,Ku(e),Bo=null,Za=0,e=D;for(;e!==null;)lv(e.alternate,e),e=e.return;D=null}}function Ko(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,H0(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Nt=0,dd(),J=e,D=n=qt(e.current,null),R=t,G=0,je=null,sn=!1,aa=al(e,t),ud=!1,Xo=Xe=Rc=Zn=On=le=0,Re=qa=null,ou=!1,Xt=Ob(e,t),Kc(),n}function Mv(e,t){C=null,N.H=Oc,t===na||t===Wc?(t=sf(),G=3):t===Lu?(t=sf(),G=4):G=t===td?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,je=t,D===null&&(le=1,Cc(e,lt(t,e.current)))}function Dv(){var e=Te.current;return e===null?!0:(R&4194048)===R?Ne===null:(R&62914560)===R||(R&536870912)!==0?e===Ne:!1}function Rv(){var e=N.H;return N.H=Oc,e===null?Oc:e}function Bv(){var e=N.A;return N.A=b0,e}function Hc(){le=4,sn||(R&4194048)!==R&&Te.current!==null||(aa=!0),(On&134217727)===0&&(Zn&134217727)===0||J===null||fn(J,R,Xe,!1)}function or(e,t,n){var o=Y;Y|=2;var a=Rv(),l=Bv();(J!==e||R!==t)&&(Uc=null,Ko(e,t)),t=!1;var c=le;e:do try{if(G!==0&&D!==null){var i=D,r=je;switch(G){case 8:dd(),c=6;break e;case 3:case 2:case 9:case 6:Te.current===null&&(t=!0);var u=G;if(G=0,je=null,Ao(e,i,r,u),n&&aa){c=0;break e}break;default:u=G,G=0,je=null,Ao(e,i,r,u)}}g0(),c=le;break}catch(f){Mv(e,f)}while(!0);return t&&e.shellSuspendCounter++,Ht=lo=null,Y=o,N.H=a,N.A=l,D===null&&(J=null,R=0,Kc()),c}function g0(){for(;D!==null;)Uv(D)}function m0(e,t){var n=Y;Y|=2;var o=Rv(),a=Bv();J!==e||R!==t?(Uc=null,Bc=Ze()+500,Ko(e,t)):aa=al(e,t);e:do try{if(G!==0&&D!==null){t=D;var l=je;t:switch(G){case 1:G=0,je=null,Ao(e,t,l,1);break;case 2:case 9:if(df(l)){G=0,je=null,Lf(t);break}t=function(){G!==2&&G!==9||J!==e||(G=7),At(e)},l.then(t,t);break e;case 3:G=7;break e;case 4:G=5;break e;case 7:df(l)?(G=0,je=null,Lf(t)):(G=0,je=null,Ao(e,t,l,7));break;case 5:var c=null;switch(D.tag){case 26:c=D.memoizedState;case 5:case 27:var i=D;if(c?ig(c):i.stateNode.complete){G=0,je=null;var r=i.sibling;if(r!==null)D=r;else{var u=i.return;u!==null?(D=u,ai(u)):D=null}break t}}G=0,je=null,Ao(e,t,l,5);break;case 6:G=0,je=null,Ao(e,t,l,6);break;case 8:dd(),le=6;break e;default:throw Error(h(462))}}h0();break}catch(f){Mv(e,f)}while(!0);return Ht=lo=null,N.H=o,N.A=a,Y=n,D!==null?0:(J=null,R=0,Kc(),le)}function h0(){for(;D!==null&&!Bm();)Uv(D)}function Uv(e){var t=av(e.alternate,e,Xt);e.memoizedProps=e.pendingProps,t===null?ai(e):D=t}function Lf(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Nf(n,t,t.pendingProps,t.type,void 0,R);break;case 11:t=Nf(n,t,t.pendingProps,t.type.render,t.ref,R);break;case 5:Ku(t);var o=t;o===me&&(A?(xc(o),o.tag===5&&o.stateNode!=null&&(I=o.stateNode)):(xc(o),A=!0));default:lv(n,t),t=D=cp(t,Xt),t=av(n,t,Xt)}e.memoizedProps=e.pendingProps,t===null?ai(e):D=t}function Ao(e,t,n,o){Ht=lo=null,Ku(t),Bo=null,Za=0;var a=t.return;try{if(l0(e,a,t,n,R)){le=1,Cc(e,lt(n,e.current)),D=null;return}}catch(l){if(a!==null)throw D=a,l;le=1,Cc(e,lt(n,e.current)),D=null;return}t.flags&32768?(A||o===1?e=!0:aa||(R&536870912)!==0?e=!1:(sn=e=!0,(o===2||o===9||o===3||o===6)&&(o=Te.current,o!==null&&o.tag===13&&(o.flags|=16384))),Hv(t,e)):ai(t)}function ai(e){var t=e;do{if((t.flags&32768)!==0){Hv(t,sn);return}e=t.return;var n=u0(t.alternate,t,Xt);if(n!==null){D=n;return}if(t=t.sibling,t!==null){D=t;return}D=t=e}while(t!==null);le===0&&(le=5)}function Hv(e,t){do{var n=d0(e.alternate,e);if(n!==null){n.flags&=32767,D=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){D=e;return}D=e=n}while(e!==null);le=6,D=null}function Yf(e,t,n,o,a,l,c,i,r,u,f,g){e.cancelPendingCommit=null;do li();while(oe!==0);if((Y&6)!==0)throw Error(h(327));if(t!==null){if(t===e.current)throw Error(h(177));e===J&&(D=J=null,R=0),eo=t,bt=e,Nt=n,lu=a,Cv=o,y0(e,t,n,c,i,r,g)}}function y0(e,t,n,o,a,l,c){var i=t.lanes|t.childLanes;if(au=i,i|=Du,Xm(e,n,i,o,a,l),Lo=null,(n&335544064)===n?(Yo=Kh(e),o=10262):(Yo=null,o=10256),(t.subtreeFlags&o)!==0||(t.flags&o)!==0?(e.callbackNode=null,e.callbackPriority=0,E0(gc,function(){return uu(),null})):(e.callbackNode=null,e.callbackPriority=0),Mc=!1,o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=N.T,N.T=null,a=j.p,j.p=2,l=Y,Y|=4;try{s0(e,t,n)}finally{Y=l,j.p=a,N.T=o}}oe=1,Mc?qo=G0(c,e.containerInfo,Yo,cu,iu,x0,ru,uu,k0,null,null):(cu(),iu(),ru())}function k0(e){if(oe!==0){var t=bt.onRecoverableError;t(e,{componentStack:null})}}function x0(){oe===3&&(oe=0,Sv(eo,bt),oe=4)}function cu(){if(oe===1){oe=0;var e=bt,t=eo,n=Nt,o=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||o){o=N.T,N.T=null;var a=j.p;j.p=2;var l=Y;Y|=4;try{za=Dc=!1,kv(t,e,n),n=bu;var c=Ib(e.containerInfo),i=n.focusedElem,r=n.selectionRange;if(c!==i&&i&&i.ownerDocument&&$b(i.ownerDocument.documentElement,i)){if(r!==null&&Mu(i)){var u=r.start,f=r.end;if(f===void 0&&(f=u),"selectionStart"in i)i.selectionStart=u,i.selectionEnd=Math.min(f,i.value.length);else{var g=i.ownerDocument||document,d=g&&g.defaultView||window;if(d.getSelection){var p=d.getSelection(),y=i.textContent.length,S=Math.min(r.start,y),z=r.end===void 0?S:Math.min(r.end,y);!p.extend&&S>z&&(c=z,z=S,S=c);var v=tf(i,S),s=tf(i,z);if(v&&s&&(p.rangeCount!==1||p.anchorNode!==v.node||p.anchorOffset!==v.offset||p.focusNode!==s.node||p.focusOffset!==s.offset)){var b=g.createRange();b.setStart(v.node,v.offset),p.removeAllRanges(),S>z?(p.addRange(b),p.extend(s.node,s.offset)):(b.setEnd(s.node,s.offset),p.addRange(b))}}}}for(g=[],p=i;p=p.parentNode;)p.nodeType===1&&g.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof i.focus=="function"&&i.focus(),i=0;i<g.length;i++){var m=g[i];m.element.scrollLeft=m.left,m.element.scrollTop=m.top}}Io=!!fu,bu=fu=null}finally{Y=l,j.p=a,N.T=o}}e.current=t,oe=2}}function iu(){if(oe===2){oe=0;var e=bt,t=eo,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=N.T,N.T=null;var o=j.p;j.p=2;var a=Y;Y|=4;try{pv(e,t.alternate,t)}finally{Y=a,j.p=o,N.T=n}}oe=3}}function ru(){if(oe===4||oe===3){oe=0;var e=qo;qo=null,Um();var t=bt,n=eo,o=Nt,a=Cv,l=(o&335544064)===o?10262:10256;if((n.subtreeFlags&l)!==0||(n.flags&l)!==0?oe=5:(oe=0,eo=bt=null,qv(t,t.pendingLanes)),l=t.pendingLanes,l===0&&(kn=null),zu(o),n=n.stateNode,Ke&&typeof Ke.onCommitFiberRoot=="function")try{Ke.onCommitFiberRoot(ol,n,void 0,(n.current.flags&128)===128)}catch{}if(a!==null){n=N.T,l=j.p,j.p=2,N.T=null;try{for(var c=t.onRecoverableError,i=0;i<a.length;i++){var r=a[i];c(r.value,{componentStack:r.stack})}}finally{N.T=n,j.p=l}}if(a=Lo,c=Yo,Yo=null,a!==null&&(Lo=null,c===null&&(c=[]),e!==null))for(r=0;r<a.length;r++)n=(0,a[r])(c),n!==void 0&&e.finished.finally(n);(Nt&3)!==0&&li(),At(t),l=t.pendingLanes,(o&261930)!==0&&(l&42)!==0?t===ic?La++:(La=0,ic=t):(La=0,ic=null),sl(0,!1)}}function qv(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,rl(t)))}function li(){return qo!==null&&(qo.skipTransition(),qo=null),cu(),iu(),ru(),uu()}function uu(){if(oe!==5)return!1;var e=bt,t=au;au=0;var n=zu(Nt),o=N.T,a=j.p;try{j.p=32>n?32:n,N.T=null,n=lu,lu=null;var l=bt,c=Nt;if(oe=0,eo=bt=null,Nt=0,(Y&6)!==0)throw Error(h(331));var i=Y;if(Y|=4,zv(l.current),wv(l,l.current,c,n),Y=i,sl(0,!1),Ke&&typeof Ke.onPostCommitFiberRoot=="function")try{Ke.onPostCommitFiberRoot(ol,l)}catch{}return!0}finally{j.p=a,N.T=o,qv(e,t)}}function jf(e,t,n){t=lt(n,t),t=Vr(e.stateNode,t,2),e=mn(e,t,2),e!==null&&(ll(e,2),At(e))}function X(e,t,n){if(e.tag===3)jf(e,e,n);else for(;t!==null;){if(t.tag===3){jf(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(kn===null||!kn.has(o))){e=lt(n,e),n=Pp(2),o=mn(t,n,2),o!==null&&(ev(n,o,t,e),ll(o,2),At(o));break}}t=t.return}}function ar(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new p0;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(n)||(ud=!0,a.add(n),e=S0.bind(null,e,t,n),t.then(e,e))}function S0(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,J===e&&(R&n)===n&&((le===4||le===3&&(R&62914560)===R&&300>Ze()-ni)&&(Y&2)===0?Ko(e,0):Rc|=n,Xo===R&&(Xo=0)),At(e)}function Lv(e,t){t===0&&(t=Cb()),e=ao(e,t),e!==null&&(ll(e,t),At(e))}function w0(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Lv(e,n)}function T0(e,t){var n=0;switch(e.tag){case 31:case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(h(314))}o!==null&&o.delete(t),Lv(e,n)}function E0(e,t){return Tu(e,t)}var Jo=null,ho=null,du=!1,qc=!1,lr=!1,bn=0;function At(e){e!==ho&&e.next===null&&(ho===null?Jo=ho=e:ho=ho.next=e),qc=!0,du||(du=!0,N0())}function sl(e,t){if(!lr&&qc){lr=!0;do for(var n=!1,o=Jo;o!==null;){if(!t)if(e!==0){var a=o.pendingLanes;if(a===0)var l=0;else{var c=o.suspendedLanes,i=o.pingedLanes;l=(1<<31-Je(42|e)+1)-1,l&=a&~(c&~i),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(n=!0,Vf(o,l))}else l=R,l=Vc(o,o===J?l:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(l&3)===0||al(o,l)||(n=!0,Vf(o,l));o=o.next}while(n);lr=!1}}function z0(){Yv()}function Yv(){qc=du=!1;var e=0;bn!==0&&U0()&&(e=bn);for(var t=Ze(),n=null,o=Jo;o!==null;){var a=o.next,l=jv(o,t);l===0?(o.next=null,n===null?Jo=a:n.next=a,a===null&&(ho=n)):(n=o,(e!==0||(l&3)!==0)&&(qc=!0)),o=a}oe!==0&&oe!==5||sl(e,!1),bn!==0&&(bn=0)}function jv(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var c=31-Je(l),i=1<<c,r=a[c];r===-1?((i&n)===0||(i&o)!==0)&&(a[c]=Qm(i,t)):r<=t&&(e.expiredLanes|=i),l&=~i}if(t=J,n=R,n=Vc(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,n===0||e===t&&(G===2||G===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&Hi(o),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||al(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(o!==null&&Hi(o),zu(n)){case 2:case 8:n=zb;break;case 32:n=gc;break;case 268435456:n=Nb;break;default:n=gc}return o=Vv.bind(null,e),n=Tu(n,o),e.callbackPriority=t,e.callbackNode=n,t}return o!==null&&o!==null&&Hi(o),e.callbackPriority=2,e.callbackNode=null,2}function Vv(e,t){if(oe!==0&&oe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(li()&&e.callbackNode!==n)return null;var o=R;return o=Vc(e,e===J?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(_v(e,o,t),jv(e,Ze()),e.callbackNode!=null&&e.callbackNode===n?Vv.bind(null,e):null)}function Vf(e,t){if(li())return null;_v(e,t,!0)}function N0(){q0(function(){(Y&6)!==0?Tu(Eb,z0):Yv()})}function sd(){if(bn===0){var e=Wn;e===0&&(e=Ol,Ol<<=1,(Ol&261888)===0&&(Ol=256)),bn=e}return bn}function Gf(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Fl(e)}function O0(e,t,n,o,a){if(t==="submit"&&n&&n.stateNode===a){var l=Gf((a[Le]||null).action),c=o.submitter;c&&(t=(t=c[Le]||null)?Gf(t.formAction):c.getAttribute("formAction"),t!==null&&(l=t,c=null));var i=new Qc("action","action",null,o,a);e.push({event:i,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(bn!==0){var r=new FormData(a,c);Yr(n,{pending:!0,data:r,method:a.method,action:l},null,r)}}else typeof l=="function"&&(i.preventDefault(),r=new FormData(a,c),Yr(n,{pending:!0,data:r,method:a.method,action:l},l,r))},currentTarget:a}]})}}for(Gl=0;Gl<Cr.length;Gl++)Ql=Cr[Gl],Qf=Ql.toLowerCase(),Xf=Ql[0].toUpperCase()+Ql.slice(1),pt(Qf,"on"+Xf);var Ql,Qf,Xf,Gl;pt(ep,"onAnimationEnd");pt(tp,"onAnimationIteration");pt(np,"onAnimationStart");pt("dblclick","onDoubleClick");pt("focusin","onFocus");pt("focusout","onBlur");pt(Lh,"onTransitionRun");pt(Yh,"onTransitionStart");pt(jh,"onTransitionCancel");pt(op,"onTransitionEnd");Vo("onMouseEnter",["mouseout","mouseover"]);Vo("onMouseLeave",["mouseout","mouseover"]);Vo("onPointerEnter",["pointerout","pointerover"]);Vo("onPointerLeave",["pointerout","pointerover"]);no("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));no("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));no("onBeforeInput",["compositionend","keypress","textInput","paste"]);no("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));no("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));no("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Fa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),C0=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Fa));function Gv(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],a=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var c=o.length-1;0<=c;c--){var i=o[c],r=i.instance,u=i.currentTarget;if(i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=u;try{l(a)}catch(f){hc(f)}a.currentTarget=null,l=r}else for(c=0;c<o.length;c++){if(i=o[c],r=i.instance,u=i.currentTarget,i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=u;try{l(a)}catch(f){hc(f)}a.currentTarget=null,l=r}}}}function M(e,t){var n=t[qs];n===void 0&&(n=t[qs]=new Set);var o=e+"__bubble";n.has(o)||(Qv(t,e,2,!1),n.add(o))}function cr(e,t,n){var o=0;t&&(o|=4),Qv(n,e,o,t)}var Xl="_reactListening"+Math.random().toString(36).slice(2);function fd(e){if(!e[Xl]){e[Xl]=!0,Bb.forEach(function(n){n!=="selectionchange"&&(C0.has(n)||cr(n,!1,e),cr(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Xl]||(t[Xl]=!0,cr("selectionchange",!1,t))}}function Qv(e,t,n,o){switch(pg(t)){case 2:var a=xy;break;case 8:a=Sy;break;default:a=yd}n=a.bind(null,t,n,e),a=void 0,!Er||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function ir(e,t,n,o,a){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var i=o.stateNode.containerInfo;if(i===a)break;if(c===4)for(c=o.return;c!==null;){var r=c.tag;if((r===3||r===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;i!==null;){if(c=Yn(i),c===null)return;if(r=c.tag,r===5||r===6||r===26||r===27){o=l=c;continue e}i=i.parentNode}}o=o.return}Gb(function(){var u=l,f=Ou(n),g=[];e:{var d=ap.get(e);if(d!==void 0){var p=Qc,y=e;switch(e){case"keypress":if($l(n)===0)break e;case"keydown":case"keyup":p=vh;break;case"focusin":y="focus",p=Gi;break;case"focusout":y="blur",p=Gi;break;case"beforeblur":case"afterblur":p=Gi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Zs;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=oh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=kh;break;case ep:case tp:case np:p=ch;break;case op:p=Sh;break;case"scroll":case"scrollend":p=th;break;case"wheel":p=Th;break;case"copy":case"cut":case"paste":p=rh;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Js;break;case"submit":p=hh;break;case"toggle":case"beforetoggle":p=zh}var S=(t&4)!==0,z=!S&&(e==="scroll"||e==="scrollend"),v=S?d!==null?d+"Capture":null:d;S=[];for(var s=u,b;s!==null;){var m=s;if(b=m.stateNode,m=m.tag,m!==5&&m!==26&&m!==27||b===null||v===null||(m=ja(s,v),m!=null&&S.push(Wa(s,m,b))),z)break;s=s.return}0<S.length&&(d=new p(d,y,null,n,f),g.push({event:d,listeners:S}))}}if((t&7)===0){e:{if(p=e==="mouseover"||e==="pointerover",d=e==="mouseout"||e==="pointerout",p&&n!==Tr&&(y=n.relatedTarget||n.fromElement)&&(Yn(y)||y[ea]))break e;(d||p)&&(y=f.window===f?f:(p=f.ownerDocument)?p.defaultView||p.parentWindow:window,d?(p=n.relatedTarget||n.toElement,d=u,p=p?Yn(p):null,p!==null&&(z=nl(p),S=p.tag,p!==z||S!==5&&S!==27&&S!==6)&&(p=null)):(d=null,p=u),d!==p&&(S=Zs,m="onMouseLeave",v="onMouseEnter",s="mouse",(e==="pointerout"||e==="pointerover")&&(S=Js,m="onPointerLeave",v="onPointerEnter",s="pointer"),z=d==null?y:Ta(d),b=p==null?y:Ta(p),y=new S(m,s+"leave",d,n,f),y.target=z,y.relatedTarget=b,m=null,Yn(f)===u&&(S=new S(v,s+"enter",p,n,f),S.target=b,S.relatedTarget=z,m=S),z=m,S=d&&p?fr(d,p,A0):null,d!==null&&Zf(g,y,d,S,!1),p!==null&&z!==null&&Zf(g,z,p,S,!0)))}e:{if(d=u?Ta(u):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var k=Is;else if($s(d))if(Fb)k=Uh;else{k=Rh;var T=Dh}else p=d.nodeName,!p||p.toLowerCase()!=="input"||d.type!=="checkbox"&&d.type!=="radio"?u&&Nu(u.elementType)&&(k=Is):k=Bh;if(k&&(k=k(e,u))){Jb(g,k,n,f);break e}T&&T(e,d,u)}switch(T=u?Ta(u):window,e){case"focusin":($s(T)||T.contentEditable==="true")&&(To=T,Nr=u,Ca=null);break;case"focusout":Ca=Nr=To=null;break;case"mousedown":Or=!0;break;case"contextmenu":case"mouseup":case"dragend":Or=!1,nf(g,n,f);break;case"selectionchange":if(qh)break;case"keydown":case"keyup":nf(g,n,f)}var x;if(_u)e:{switch(e){case"compositionstart":var E="onCompositionStart";break e;case"compositionend":E="onCompositionEnd";break e;case"compositionupdate":E="onCompositionUpdate";break e}E=void 0}else wo?Zb(e,n)&&(E="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(E="onCompositionStart");E&&(Xb&&n.locale!=="ko"&&(wo||E!=="onCompositionStart"?E==="onCompositionEnd"&&wo&&(x=Qb()):(un=f,Cu="value"in un?un.value:un.textContent,wo=!0)),T=Lc(u,E),0<T.length&&(E=new Ks(E,e,null,n,f),g.push({event:E,listeners:T}),x?E.data=x:(x=Kb(n),x!==null&&(E.data=x)))),(x=Oh?Ch(e,n):Ah(e,n))&&(E=Lc(u,"onBeforeInput"),0<E.length&&(T=new Ks("onBeforeInput","beforeinput",null,n,f),g.push({event:T,listeners:E}),T.data=x)),O0(g,e,u,n,f)}Gv(g,t)})}function Wa(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Lc(e,t){for(var n=t+"Capture",o=[];e!==null;){var a=e,l=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||l===null||(a=ja(e,n),a!=null&&o.unshift(Wa(e,a,l)),a=ja(e,t),a!=null&&o.push(Wa(e,a,l))),e.tag===3)return o;e=e.return}return[]}function A0(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Zf(e,t,n,o,a){for(var l=t._reactName,c=[];n!==null&&n!==o;){var i=n,r=i.alternate,u=i.stateNode;if(i=i.tag,r!==null&&r===o)break;i!==5&&i!==26&&i!==27||u===null||(r=u,a?(u=ja(n,l),u!=null&&c.unshift(Wa(n,u,r))):a||(u=ja(n,l),u!=null&&c.push(Wa(n,u,r)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var _0=/\r\n?/g,M0=/\u0000|\uFFFD/g;function Kf(e){return(typeof e=="string"?e:""+e).replace(_0,`
`).replace(M0,"")}function Xv(e,t){return t=Kf(t),Kf(e)===t}function Q(e,t,n,o,a,l){switch(n){case"children":if(typeof o=="string")t==="body"||t==="textarea"&&o===""||Go(e,o);else if(typeof o=="number"||typeof o=="bigint")t!=="body"&&Go(e,""+o);else return;break;case"className":_l(e,"class",o);break;case"tabIndex":_l(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":_l(e,n,o);break;case"style":Vb(e,o,l);return;case"data":if(t!=="object"){_l(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Fl(o),e.setAttribute(n,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(n==="formAction"?(t!=="input"&&Q(e,t,"name",a.name,a,null),Q(e,t,"formEncType",a.formEncType,a,null),Q(e,t,"formMethod",a.formMethod,a,null),Q(e,t,"formTarget",a.formTarget,a,null)):(Q(e,t,"encType",a.encType,a,null),Q(e,t,"method",a.method,a,null),Q(e,t,"target",a.target,a,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Fl(o),e.setAttribute(n,o);break;case"onClick":o!=null&&(e.onclick=wt);return;case"onScroll":o!=null&&M("scroll",e);return;case"onScrollEnd":o!=null&&M("scrollend",e);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}n=Fl(o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":o===!0?e.setAttribute(n,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(n,o):e.removeAttribute(n);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(n):e.setAttribute(n,o);break;case"popover":M("beforetoggle",e),M("toggle",e),Jl(e,"popover",o);break;case"xlinkActuate":Rt(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Rt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Rt(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Rt(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Rt(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Rt(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Rt(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Rt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Rt(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":Jl(e,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")n=Pm.get(n)||n,Jl(e,n,o);else return}q=!0}function su(e,t,n,o,a,l){switch(n){case"style":Vb(e,o,l);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"children":if(typeof o=="string")Go(e,o);else if(typeof o=="number"||typeof o=="bigint")Go(e,""+o);else return;break;case"onScroll":o!=null&&M("scroll",e);return;case"onScrollEnd":o!=null&&M("scrollend",e);return;case"onClick":o!=null&&(e.onclick=wt);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Ub.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),l=n.slice(2,a?n.length-7:void 0),t=e[Le]||null,t=t!=null?t[n]:null,typeof t=="function"&&e.removeEventListener(l,t,a),typeof o=="function")){typeof t!="function"&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(l,o,a);break e}q=!0,n in e?e[n]=o:o===!0?e.setAttribute(n,""):Jl(e,n,o)}return}q=!0}function we(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":M("error",e),M("load",e);var o=!1,a=!1,l;for(l in n)if(n.hasOwnProperty(l)){var c=n[l];if(c!=null)switch(l){case"src":o=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:Q(e,t,l,c,n,null)}}a&&Q(e,t,"srcSet",n.srcSet,n,null),o&&Q(e,t,"src",n.src,n,null);return;case"input":M("invalid",e);var i=l=c=a=null,r=null,u=null;for(o in n)if(n.hasOwnProperty(o)){var f=n[o];if(f!=null)switch(o){case"name":a=f;break;case"type":c=f;break;case"checked":r=f;break;case"defaultChecked":u=f;break;case"value":l=f;break;case"defaultValue":i=f;break;case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(h(137,t));break;default:Q(e,t,o,f,n,null)}}Lb(e,l,i,r,u,c,a,!1);return;case"select":M("invalid",e),o=c=l=null;for(a in n)if(n.hasOwnProperty(a)&&(i=n[a],i!=null))switch(a){case"value":l=i;break;case"defaultValue":c=i;break;case"multiple":o=i;default:Q(e,t,a,i,n,null)}t=l,n=c,e.multiple=!!o,t!=null?Mo(e,!!o,t,!1):n!=null&&Mo(e,!!o,n,!0);return;case"textarea":M("invalid",e),l=a=o=null;for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"value":o=i;break;case"defaultValue":a=i;break;case"children":l=i;break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(h(91));break;default:Q(e,t,c,i,n,null)}jb(e,o,a,l);return;case"option":for(r in n)n.hasOwnProperty(r)&&(o=n[r],o!=null)&&(r==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":Q(e,t,r,o,n,null));return;case"dialog":M("beforetoggle",e),M("toggle",e),M("cancel",e),M("close",e);break;case"iframe":case"object":M("load",e);break;case"video":case"audio":for(o=0;o<Fa.length;o++)M(Fa[o],e);break;case"image":M("error",e),M("load",e);break;case"details":M("toggle",e);break;case"embed":case"source":case"link":M("error",e),M("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(u in n)if(n.hasOwnProperty(u)&&(o=n[u],o!=null))switch(u){case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:Q(e,t,u,o,n,null)}return;default:if(Nu(t)){for(f in n)n.hasOwnProperty(f)&&(o=n[f],o!==void 0&&su(e,t,f,o,n,void 0));return}}for(i in n)n.hasOwnProperty(i)&&(o=n[i],o!=null&&Q(e,t,i,o,n,null))}var D0={};function R0(e,t,n,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,l=null,c=null,i=null,r=null,u=null,f=null;for(p in n){var g=n[p];if(n.hasOwnProperty(p)&&g!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":r=g;default:o.hasOwnProperty(p)||Q(e,t,p,null,o,g)}}for(var d in o){var p=o[d];if(g=n[d],o.hasOwnProperty(d)&&(p!=null||g!=null))switch(d){case"type":p!==g&&(q=!0),l=p;break;case"name":p!==g&&(q=!0),a=p;break;case"checked":p!==g&&(q=!0),u=p;break;case"defaultChecked":p!==g&&(q=!0),f=p;break;case"value":p!==g&&(q=!0),c=p;break;case"defaultValue":p!==g&&(q=!0),i=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(h(137,t));break;default:p!==g&&Q(e,t,d,p,o,g)}}wr(e,c,i,r,u,f,l,a);return;case"select":p=c=i=d=null;for(l in n)if(r=n[l],n.hasOwnProperty(l)&&r!=null)switch(l){case"value":break;case"multiple":p=r;default:o.hasOwnProperty(l)||Q(e,t,l,null,o,r)}for(a in o)if(l=o[a],r=n[a],o.hasOwnProperty(a)&&(l!=null||r!=null))switch(a){case"value":l!==r&&(q=!0),d=l;break;case"defaultValue":l!==r&&(q=!0),i=l;break;case"multiple":l!==r&&(q=!0),c=l;default:l!==r&&Q(e,t,a,l,o,r)}t=i,n=c,o=p,d!=null?Mo(e,!!n,d,!1):!!o!=!!n&&(t!=null?Mo(e,!!n,t,!0):Mo(e,!!n,n?[]:"",!1));return;case"textarea":p=d=null;for(i in n)if(a=n[i],n.hasOwnProperty(i)&&a!=null&&!o.hasOwnProperty(i))switch(i){case"value":break;case"children":break;default:Q(e,t,i,null,o,a)}for(c in o)if(a=o[c],l=n[c],o.hasOwnProperty(c)&&(a!=null||l!=null))switch(c){case"value":a!==l&&(q=!0),d=a;break;case"defaultValue":a!==l&&(q=!0),p=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(h(91));break;default:a!==l&&Q(e,t,c,a,o,l)}Yb(e,d,p);return;case"option":for(var y in n)d=n[y],n.hasOwnProperty(y)&&d!=null&&!o.hasOwnProperty(y)&&(y==="selected"?e.selected=!1:Q(e,t,y,null,o,d));for(r in o)d=o[r],p=n[r],o.hasOwnProperty(r)&&d!==p&&(d!=null||p!=null)&&(r==="selected"?(d!==p&&(q=!0),e.selected=d&&typeof d!="function"&&typeof d!="symbol"):Q(e,t,r,d,o,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var S in n)d=n[S],n.hasOwnProperty(S)&&d!=null&&!o.hasOwnProperty(S)&&Q(e,t,S,null,o,d);for(u in o)if(d=o[u],p=n[u],o.hasOwnProperty(u)&&d!==p&&(d!=null||p!=null))switch(u){case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error(h(137,t));break;default:Q(e,t,u,d,o,p)}return;default:if(Nu(t)){for(var z in n)d=n[z],n.hasOwnProperty(z)&&d!==void 0&&!o.hasOwnProperty(z)&&su(e,t,z,void 0,o,d);for(f in o)d=o[f],p=n[f],!o.hasOwnProperty(f)||d===p||d===void 0&&p===void 0||su(e,t,f,d,o,p);return}}for(var v in n)d=n[v],n.hasOwnProperty(v)&&d!=null&&!o.hasOwnProperty(v)&&Q(e,t,v,null,o,d);for(g in o)d=o[g],p=n[g],!o.hasOwnProperty(g)||d===p||d==null&&p==null||Q(e,t,g,d,o,p)}function Jf(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function B0(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),o=0;o<n.length;o++){var a=n[o],l=a.transferSize,c=a.initiatorType,i=a.duration;if(l&&i&&Jf(c)){for(c=0,i=a.responseEnd,o+=1;o<n.length;o++){var r=n[o],u=r.startTime;if(u>i)break;var f=r.transferSize,g=r.initiatorType;f&&Jf(g)&&(r=r.responseEnd,c+=f*(r<i?1:(i-u)/(r-u)))}if(--o,t+=8*(l+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var fu=null,bu=null;function $a(e){return e.nodeType===9?e:e.ownerDocument}function Ff(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Zv(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Kv(e,t,n,o){return n=$a(n).createElement(e),n[ye]=o,n[Le]=t,we(n,e,t),ge(n),n}function pu(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var rr=null;function U0(){var e=window.event;return e&&e.type==="popstate"?e===rr?!1:(rr=e,!0):(rr=null,!1)}var bd=typeof setTimeout=="function"?setTimeout:void 0,H0=typeof clearTimeout=="function"?clearTimeout:void 0,Wf=typeof Promise=="function"?Promise:void 0,$f=typeof requestAnimationFrame=="function"?requestAnimationFrame:bd,q0=typeof queueMicrotask=="function"?queueMicrotask:typeof Wf<"u"?function(e){return Wf.resolve(null).then(e).catch(L0)}:bd;function L0(e){setTimeout(function(){throw e})}function An(e){return e==="head"}function If(e,t){var n=t,o=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(o===0){e.removeChild(a),Po(t);return}o--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")o++;else if(n==="html")dr(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,dr(n);for(var l=n.firstChild;l;){var c=l.nextSibling,i=l.nodeName;l[cl]||i==="SCRIPT"||i==="STYLE"||i==="LINK"&&l.rel.toLowerCase()==="stylesheet"||n.removeChild(l),l=c}}else n==="body"&&dr(e.ownerDocument.body);n=a}while(n);Po(t)}function Pf(e,t){var n=e;e=0;do{var o=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=o}while(n)}function Jv(e,t,n){if(t=CSS.escape(t)!==t?"r-"+btoa(t).replace(/=/g,""):t,e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display==="inline"){if(t=e.getClientRects(),t.length===1)var o=1;else for(var a=o=0;a<t.length;a++){var l=t[a];0<l.width&&0<l.height&&o++}o===1&&(e=e.style,e.display=t.length===1?"inline-block":"block",e.marginTop="-"+n.paddingTop,e.marginBottom="-"+n.paddingBottom)}}function Fv(e,t){e=e.style,t=t.style;var n=t!=null?t.hasOwnProperty("viewTransitionName")?t.viewTransitionName:t.hasOwnProperty("view-transition-name")?t["view-transition-name"]:null:null;e.viewTransitionName=n==null||typeof n=="boolean"?"":(""+n).trim(),n=t!=null?t.hasOwnProperty("viewTransitionClass")?t.viewTransitionClass:t.hasOwnProperty("view-transition-class")?t["view-transition-class"]:null:null,e.viewTransitionClass=n==null||typeof n=="boolean"?"":(""+n).trim(),e.display==="inline-block"&&(t==null?e.display=e.margin="":(n=t.display,e.display=n==null||typeof n=="boolean"?"":n,n=t.margin,n!=null?e.margin=n:(n=t.hasOwnProperty("marginTop")?t.marginTop:t["margin-top"],e.marginTop=n==null||typeof n=="boolean"?"":n,t=t.hasOwnProperty("marginBottom")?t.marginBottom:t["margin-bottom"],e.marginBottom=t==null||typeof t=="boolean"?"":t)))}function Wv(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position==="absolute"||t.position==="fixed",clip:t.clipPath!=="none"||t.overflow!=="visible"||t.filter!=="none"||t.mask!=="none"||t.mask!=="none"||t.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function vu(e){var t=e.getBoundingClientRect(),n=getComputedStyle(e);return Wv(t,n,e)}function Y0(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return Wv(t,n,e)}function j0(e){return e.documentElement.clientHeight}function V0(e){this.addEventListener("load",e),this.addEventListener("error",e)}function G0(e,t,n,o,a,l,c,i,r){var u=t.nodeType===9?t:t.ownerDocument;try{var f=u.startViewTransition({update:function(){var d=u.defaultView,p=d.navigation&&d.navigation.transition,y=u.fonts.status;o();var S=[];if(y==="loaded"&&(j0(u),u.fonts.status==="loading"&&S.push(u.fonts.ready)),y=S.length,e!==null)for(var z=e.suspenseyImages,v=0,s=0;s<z.length;s++){var b=z[s];if(!b.complete){var m=b.getBoundingClientRect();if(0<m.bottom&&0<m.right&&m.top<d.innerHeight&&m.left<d.innerWidth){if(v+=rg(b),v>dc){S.length=y;break}b=new Promise(V0.bind(b)),S.push(b)}}}if(0<S.length)return d=Promise.race([Promise.all(S),new Promise(function(k){return setTimeout(k,500)})]).then(a,a),(p?Promise.allSettled([p.finished,d]):d).then(l,l);if(a(),p)return p.finished.then(l,l);l()},types:n});u.__reactViewTransition=f;var g=[];return f.ready.then(function(){for(var d=u.documentElement.getAnimations({subtree:!0}),p=0;p<d.length;p++){var y=d[p],S=y.effect,z=S.pseudoElement;if(z!=null&&z.startsWith("::view-transition")){g.push(y),y=S.getKeyframes();for(var v=z=void 0,s=!0,b=0;b<y.length;b++){var m=y[b],k=m.width;if(z===void 0)z=k;else if(z!==k){s=!1;break}if(k=m.height,v===void 0)v=k;else if(v!==k){s=!1;break}delete m.width,delete m.height,m.transform==="none"&&delete m.transform}s&&z!==void 0&&v!==void 0&&(S.setKeyframes(y),s=getComputedStyle(S.target,S.pseudoElement),s.width!==z||s.height!==v)&&(s=y[0],s.width=z,s.height=v,s=y[y.length-1],s.width=z,s.height=v,S.setKeyframes(y))}}c()},function(d){u.__reactViewTransition===f&&(u.__reactViewTransition=null);try{typeof d=="object"&&d!==null&&d.name==="InvalidStateError"&&(d.message==="View transition was skipped because document visibility state is hidden."||d.message==="Skipping view transition because document visibility state has become hidden."||d.message==="Skipping view transition because viewport size changed."||d.message==="Transition was aborted because of invalid state")&&(d=null),d!==null&&r(d)}finally{o(),a(),c()}}),f.finished.finally(function(){for(var d=0;d<g.length;d++)g[d].cancel();u.__reactViewTransition===f&&(u.__reactViewTransition=null),i()}),f}catch{return o(),a(),c(),null}}function jn(e,t){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+t+")"}jn.prototype.animate=function(e,t){return t=typeof t=="number"?{duration:t}:F({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)};jn.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),o=[],a=0;a<n.length;a++){var l=n[a].effect;l!==null&&l.target===e&&l.pseudoElement===t&&o.push(n[a])}return o};jn.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function $v(e){return{name:e,group:new jn("group",e),imagePair:new jn("image-pair",e),old:new jn("old",e),new:new jn("new",e)}}function $e(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}$e.prototype.addEventListener=function(e,t,n){var o=null,a=null;if(!(n!=null&&typeof n!="boolean"&&(o=n.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var l=this._eventListeners;if(Iv(l,e,t,n)===-1){var c=this,i=t;n!=null&&typeof n!="boolean"&&n.once===!0&&(i=function(r){c.removeEventListener(e,t,n),typeof t=="function"?t.call(this,r):t.handleEvent(r)}),o!==null&&(a=c.removeEventListener.bind(c,e,t,n),o.addEventListener("abort",a,{once:!0}),a=o.removeEventListener.bind(o,"abort",a)),o=Fo(n),l.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:i,cleanup:a}),qe(this._fragmentFiber.child,!1,Q0,e,i,o)}this._eventListeners=l}};function Q0(e,t,n,o){return fe(e).addEventListener(t,n,o),!1}$e.prototype.removeEventListener=function(e,t,n){var o=this._eventListeners;if(o!==null&&(t=Iv(o,e,t,n),t!==-1)){var a=o[t];n=a.attachedListener;var l=a.cleanup;a=Fo(a.optionsOrUseCapture),qe(this._fragmentFiber.child,!1,X0,e,n,a),o.splice(t,1),l!==null&&l()}};function X0(e,t,n,o){return fe(e).removeEventListener(t,n,o),!1}function Fo(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function eb(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function Iv(e,t,n,o){if(e.length===0)return-1;o=eb(o);for(var a=0;a<e.length;a++){var l=e[a];if(l.type===t&&l.listener===n&&eb(l.optionsOrUseCapture)===o)return a}return-1}$e.prototype.dispatchEvent=function(e){var t=to(this._fragmentFiber);if(t===null)return!0;t=fe(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var o=t.nodeType===9?t.createComment(""):document.createTextNode("");if(n)for(var a=0;a<n.length;a++){var l=n[a];o.addEventListener(l.type,l.attachedListener,Fo(l.optionsOrUseCapture))}if(t.appendChild(o),e=o.dispatchEvent(e),n)for(a=0;a<n.length;a++)l=n[a],o.removeEventListener(l.type,l.attachedListener,Fo(l.optionsOrUseCapture));return t.removeChild(o),e}return t.dispatchEvent(e)};$e.prototype.focus=function(e){qe(this._fragmentFiber.child,!0,Pv,e,void 0,void 0)};function Pv(e,t){return e.tag===6?!1:(e=fe(e),oy(e,t))}$e.prototype.focusLast=function(e){var t=[];qe(this._fragmentFiber.child,!0,pd,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Pv(t[n],e);n--);};function pd(e,t){return t.push(e),!1}$e.prototype.blur=function(){var e=to(this._fragmentFiber);e!==null&&(e=fe(e),e=$a(e).activeElement,e!==null&&qe(this._fragmentFiber.child,!1,Z0,e,void 0,void 0))};function Z0(e,t){return e.tag===6?!1:(e=fe(e),e===t||e.contains(t)?(t.blur(),!0):!1)}$e.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),qe(this._fragmentFiber.child,!1,K0,e,void 0,void 0)};function K0(e,t){return e.tag===6||(e=fe(e),t.observe(e)),!1}$e.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),qe(this._fragmentFiber.child,!1,J0,e,void 0,void 0);for(var n=t=0;n<ft.length;n++){var o=ft[n];o.fragmentInstance===this&&o.observer===e?e.unobserve(o.instance):ft[t++]=o}ft.length=t}};function J0(e,t){return e.tag===6||(e=fe(e),t.unobserve(e)),!1}var ft=[],ur=!1;function F0(e,t,n){ft.push({fragmentInstance:e,observer:t,instance:n}),ur||(ur=!0,ay(function(){ur=!1;var o=ft;ft=[];for(var a=0;a<o.length;a++){var l=o[a];l.observer.unobserve(l.instance)}}))}$e.prototype.getClientRects=function(){var e=[];return qe(this._fragmentFiber.child,!1,W0,e,void 0,void 0),e};function W0(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=fe(e),t.push.apply(t,e.getClientRects());return!1}$e.prototype.getRootNode=function(e){var t=to(this._fragmentFiber);return t===null?this:fe(t).getRootNode(e)};$e.prototype.compareDocumentPosition=function(e){var t=to(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];qe(this._fragmentFiber.child,!1,pd,n,void 0,void 0);var o=fe(t);if(n.length===0){if(n=o,Ms(this._fragmentFiber)){e:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break e}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var a=o=n.compareDocumentPosition(e);return n===e?a=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=xb(t)[1],n===null?a=Node.DOCUMENT_POSITION_PRECEDING:(e=fe(n).compareDocumentPosition(e),a=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),a|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=fe(n[0]),a=fe(n[n.length-1]);var l=Ms(this._fragmentFiber)?t.parentElement:o;if(l==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=l.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,l=l.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_CONTAINED_BY;var c=t.compareDocumentPosition(e),i=a.compareDocumentPosition(e),r=c&Node.DOCUMENT_POSITION_CONTAINED_BY||i&Node.DOCUMENT_POSITION_CONTAINED_BY;return i=o&&l&&c&Node.DOCUMENT_POSITION_FOLLOWING&&i&Node.DOCUMENT_POSITION_PRECEDING,t=o&&t===e||l&&a===e||r||i?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&t===e||!l&&a===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:c,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||$0(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function $0(e,t,n,o,a){var l=Yn(a);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!l)e:{for(;l!==null;){if(l.tag===7&&(l===t||l.alternate===t)){n=!0;break e}l=l.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(l===null)return l=a.ownerDocument,a===l||a===l.documentElement||a===l.body;e:{for(l=t,t=to(t);l!==null;){if(!(l.tag!==5&&l.tag!==3&&l.tag!==27||l!==t&&l.alternate!==t)){l=!0;break e}l=l.return}l=!1}return l}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!l)&&!(t=l===n)&&(t=fr(n,l,Ds),t===null?t=!1:(qe(t,!0,Nm,l,n),l=yo,yo=null,t=l!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!l)&&!(t=l===o)&&(t=fr(o,l,Ds),t===null?t=!1:(qe(t,!0,Om,l,o),l=yo,sr=yo=null,t=l!==null)),t):!1}function tb(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}$e.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(h(566));var t=[];qe(this._fragmentFiber.child,!1,pd,t,void 0,void 0);var n=e!==!1;if(t.length===0){var o=xb(this._fragmentFiber);if(o=n?o[1]||o[0]||to(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){e=fe(o),tb(e,n);return}if(o=fe(o),o.nodeType!==9){if(o.nodeType===11){n="host"in o?o.host:null,n!==null&&n.scrollIntoView(e);return}o.scrollIntoView(e)}}for(o=n?t.length-1:0;o!==(n?-1:t.length);){var a=t[o];a.tag===6?(a=fe(a),tb(a,n)):fe(a).scrollIntoView(e),o+=n?-1:1}};function I0(e,t){return e=fe(e),eg(e,t),!1}function eg(e,t){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(t)}function tg(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.addEventListener(a.type,a.attachedListener,Fo(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){for(var c=0,i=0;i<ft.length;i++){var r=ft[i];(r.fragmentInstance!==t||r.observer!==l||r.instance!==e)&&(ft[c++]=r)}ft.length=c,l.observe(e)}),eg(e,t))}function P0(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.removeEventListener(a.type,a.attachedListener,Fo(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){typeof l.rootMargin=="string"?F0(t,l,e):l.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function gu(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":gu(n),Gc(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function ey(e,t,n,o){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[cl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var l=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=it(e.nextSibling),e===null)break}return null}function ty(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=it(e.nextSibling),e===null))return null;return e}function ng(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=it(e.nextSibling),e===null))return null;return e}function mu(e){return e.data==="$?"||e.data==="$~"}function vd(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function ny(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var o=function(){t(),n.removeEventListener("DOMContentLoaded",o)};n.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function it(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var hu=null;function nb(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return it(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function ob(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function oy(e,t){function n(){o=!0}if(e.ownerDocument.activeElement===e)return!0;var o=!1;try{e.ownerDocument.addEventListener("focus",n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener("focus",n,!0)}return o}function ay(e){$f(function(){$f(function(t){return e(t)})})}function og(e,t,n){switch(t=$a(n),e){case"html":if(e=t.documentElement,!e)throw Error(h(452));return e;case"head":if(e=t.head,!e)throw Error(h(453));return e;case"body":if(e=t.body,!e)throw Error(h(454));return e;default:throw Error(h(451))}}function ag(e,t,n){for(var o in n){var a=n[o];n.hasOwnProperty(o)&&a!=null&&Q(e,t,o,null,D0,a)}n.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===wt&&(e.onclick=null),Gc(e)}function dr(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Gc(e)}var rt=new Map,ab=new Set;function Ia(e){if(typeof e.getRootNode=="function"){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var Jt=j.d;j.d={f:ly,r:cy,D:iy,C:ry,L:uy,m:dy,X:fy,S:sy,M:by};function ly(){var e=Jt.f(),t=oi();return e||t}function cy(e){var t=ta(e);t!==null&&t.tag===5&&t.type==="form"?Vp(t):Jt.r(e)}var la=typeof document>"u"?null:document;function lg(e,t,n){var o=la;if(o&&typeof t=="string"&&t){var a=at(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),ab.has(a)||(ab.add(a),e={rel:e,crossOrigin:n,href:t},o.querySelector(a)===null&&(t=o.createElement("link"),we(t,"link",e),ge(t),o.head.appendChild(t)))}}function iy(e){Jt.D(e),lg("dns-prefetch",e,null)}function ry(e,t){Jt.C(e,t),lg("preconnect",e,t)}function uy(e,t,n){Jt.L(e,t,n);var o=la;if(o&&e&&t){var a='link[rel="preload"][as="'+at(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+at(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+at(n.imageSizes)+'"]')):a+='[href="'+at(e)+'"]';var l=a;switch(t){case"style":l=Wo(e);break;case"script":l=ca(e)}if(!(rt.has(l)||(e=F({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),rt.set(l,e),o.querySelector(a)!==null||t==="style"&&o.querySelector(fl(l))||t==="script"&&o.querySelector(bl(l))))){var c=o.createElement("link");we(c,"link",e),t==="style"&&(c[mc]=!0,c.onload=c.onerror=function(){Rb(c)}),ge(c),o.head.appendChild(c)}}}function dy(e,t){Jt.m(e,t);var n=la;if(n&&e){var o=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+at(o)+'"][href="'+at(e)+'"]',l=a;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=ca(e)}if(!rt.has(l)&&(e=F({rel:"modulepreload",href:e},t),rt.set(l,e),n.querySelector(a)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(bl(l)))return}o=n.createElement("link"),we(o,"link",e),ge(o),n.head.appendChild(o)}}}function sy(e,t,n){Jt.S(e,t,n);var o=la;if(o&&e){var a=_o(o).hoistableStyles,l=Wo(e);t=t||"default";var c=a.get(l);if(!c){var i={loading:0,preload:null};if(c=o.querySelector(fl(l)))i.loading=5;else{e=F({rel:"stylesheet",href:e,"data-precedence":t},n),(n=rt.get(l))&&gd(e,n);var r=c=o.createElement("link");ge(r),we(r,"link",e),r._p=new Promise(function(u,f){r.onload=u,r.onerror=f}),r.addEventListener("load",function(){i.loading|=1}),r.addEventListener("error",function(){i.loading|=2}),i.loading|=4,rc(c,t,o)}c={type:"stylesheet",instance:c,count:1,state:i},a.set(l,c)}}}function fy(e,t){Jt.X(e,t);var n=la;if(n&&e){var o=_o(n).hoistableScripts,a=ca(e),l=o.get(a);l||(l=n.querySelector(bl(a)),l||(e=F({src:e,async:!0},t),(t=rt.get(a))&&md(e,t),l=n.createElement("script"),ge(l),we(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function by(e,t){Jt.M(e,t);var n=la;if(n&&e){var o=_o(n).hoistableScripts,a=ca(e),l=o.get(a);l||(l=n.querySelector(bl(a)),l||(e=F({src:e,async:!0,type:"module"},t),(t=rt.get(a))&&md(e,t),l=n.createElement("script"),ge(l),we(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function lb(e,t,n,o){var a=(a=pn.current)?Ia(a):null;if(!a)throw Error(h(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(n=Wo(n.href),t=_o(a).hoistableStyles,o=t.get(n),o||(o={type:"style",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Wo(n.href);var l=_o(a).hoistableStyles,c=l.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,c),(l=a.querySelector(fl(e)))?l._p||(c.instance=l,c.state.loading=5):(l=rt.get(e),l||(l={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},rt.set(e,l)),py(a,e,l,c.state))),t&&o===null)throw Error(h(528,""));return c}if(t&&o!==null)throw Error(h(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(n=ca(n),t=_o(a).hoistableScripts,o=t.get(n),o||(o={type:"script",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(h(444,e))}}function Wo(e){return'href="'+at(e)+'"'}function fl(e){return'link[rel="stylesheet"]['+e+"]"}function cg(e){return F({},e,{"data-precedence":e.precedence,precedence:null})}function py(e,t,n,o){if(t=e.querySelector('link[rel="preload"][as="style"]['+t+"]")){if(t[mc]!==!0){o.loading=1;return}}else t=e.createElement("link"),t[mc]=!0,t.onload=t.onerror=Rb.bind(null,t),we(t,"link",n),ge(t),e.head.appendChild(t);o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2})}function ca(e){return'[src="'+at(e)+'"]'}function bl(e){return"script[async]"+e}function cb(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+at(n.href)+'"]');if(o)return t.instance=o,ge(o),o;var a=F({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),ge(o),we(o,"style",a),rc(o,n.precedence,e),t.instance=o;case"stylesheet":a=Wo(n.href);var l=e.querySelector(fl(a));if(l)return t.state.loading|=4,t.instance=l,ge(l),l;o=cg(n),(a=rt.get(a))&&gd(o,a),l=(e.ownerDocument||e).createElement("link"),ge(l);var c=l;return c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),we(l,"link",o),t.state.loading|=4,rc(l,n.precedence,e),t.instance=l;case"script":return l=ca(n.src),(a=e.querySelector(bl(l)))?(t.instance=a,ge(a),a):(o=n,(a=rt.get(l))&&(o=F({},n),md(o,a)),e=e.ownerDocument||e,a=e.createElement("script"),ge(a),we(a,"link",o),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(h(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,rc(o,n.precedence,e));return t.instance}function rc(e,t,n){for(var o=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=o.length?o[o.length-1]:null,l=a,c=0;c<o.length;c++){var i=o[c];if(i.dataset.precedence===t)l=i;else if(l!==a)break}l?l.parentNode.insertBefore(e,l.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function gd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function md(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var uc=null;function ib(e,t,n){if(uc===null){var o=new Map,a=uc=new Map;a.set(n,o)}else a=uc,o=a.get(n),o||(o=new Map,a.set(n,o));if(o.has(e))return o;for(o.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var l=n[a];if(!(l[cl]||l[ye]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var c=l.getAttribute(t)||"";c=e+c;var i=o.get(c);i?i.push(l):o.set(c,[l])}}return o}function yu(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function vy(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function rb(e,t){return e==="img"&&t.src!=null&&t.src!==""&&t.onLoad==null&&t.loading!=="lazy"}function ig(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function rg(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function ub(e,t){typeof t.decode=="function"&&(e.imgCount++,t.complete||(e.imgBytes+=rg(t),e.suspenseyImages.push(t)),e=hy.bind(e),t.decode().then(e,e))}function gy(e,t,n,o){if(n.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=Wo(o.href),l=t.querySelector(fl(a));if(l){t=l._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Pa.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=l,ge(l);return}l=t.ownerDocument||t,o=cg(o),(a=rt.get(a))&&gd(o,a),l=l.createElement("link"),ge(l);var c=l;c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),we(l,"link",o),n.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Pa.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var dc=0;function my(e,t){return e.stylesheets&&e.count===0&&sc(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var o=setTimeout(function(){if(e.stylesheets&&sc(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+t);0<e.imgBytes&&dc===0&&(dc=62500*B0());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&sc(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>dc?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(a)}}:null}function ug(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)sc(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function Pa(){this.count--,ug(this)}function hy(){this.imgCount--,ug(this)}var Yc=null;function sc(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yc=new Map,t.forEach(yy,e),Yc=null,Pa.call(e))}function yy(e,t){if(!(t.state.loading&4)){var n=Yc.get(e);if(n)var o=n.get(null);else{n=new Map,Yc.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<a.length;l++){var c=a[l];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),o=c)}o&&n.set(null,o)}a=t.instance,c=a.getAttribute("data-precedence"),l=n.get(c)||o,l===o&&n.set(null,a),n.set(c,a),this.count++,o=Pa.bind(this),a.addEventListener("load",o),a.addEventListener("error",o),l?l.parentNode.insertBefore(a,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var $o={$$typeof:St,Provider:null,Consumer:null,_currentValue:Vn,_currentValue2:Vn,_threadCount:0};function ky(e,t,n,o,a,l,c,i,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=qi(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=qi(0),this.hiddenUpdates=qi(null),this.identifierPrefix=o,this.onUncaughtError=a,this.onCaughtError=l,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.transitionTypes=null,this.incompleteTransitions=new Map}function dg(e,t,n,o,a,l,c,i,r,u,f,g){return e=new ky(e,t,n,c,r,u,f,g,i),t=1,l===!0&&(t|=24),l=Ue(3,null,null,t),e.current=l,l.stateNode=e,t=Hu(),t.refCount++,e.pooledCache=t,t.refCount++,l.memoizedState={element:o,isDehydrated:n,cache:t},Yu(l),e}function sg(e){return e?(e=No,e):No}function fg(e,t,n,o,a,l){a=sg(a),o.context===null?o.context=a:o.pendingContext=a,o=gn(t),o.payload={element:n},l=l===void 0?null:l,l!==null&&(o.callback=l),n=mn(e,o,t),n!==null&&(He(n,e,t),_a(n,e,t))}function db(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function hd(e,t){db(e,t),(e=e.alternate)&&db(e,t)}function bg(e){if(e.tag===13||e.tag===31){var t=ao(e,67108864);t!==null&&He(t,e,67108864),hd(e,67108864)}}function sb(e){if(e.tag===13||e.tag===31){var t=Fe();t=Eu(t);var n=ao(e,t);n!==null&&He(n,e,t),hd(e,t)}}var Io=!0;function xy(e,t,n,o){var a=N.T;N.T=null;var l=j.p;try{j.p=2,yd(e,t,n,o)}finally{j.p=l,N.T=a}}function Sy(e,t,n,o){var a=N.T;N.T=null;var l=j.p;try{j.p=8,yd(e,t,n,o)}finally{j.p=l,N.T=a}}function yd(e,t,n,o){if(Io){var a=ku(o);if(a===null)ir(e,t,o,jc,n),fb(e,o);else if(Ty(a,e,t,n,o))o.stopPropagation();else if(fb(e,o),t&4&&-1<wy.indexOf(e)){for(;a!==null;){var l=ta(a);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var c=Hn(l.pendingLanes);if(c!==0){var i=l;for(i.pendingLanes|=2,i.entangledLanes|=2;c;){var r=1<<31-Je(c);i.entanglements[1]|=r,c&=~r}At(l),(Y&6)===0&&(Bc=Ze()+500,sl(0,!1))}}break;case 31:case 13:i=ao(l,2),i!==null&&He(i,l,2),oi(),hd(l,2)}if(l=ku(o),l===null&&ir(e,t,o,jc,n),l===a)break;a=l}a!==null&&o.stopPropagation()}else ir(e,t,o,null,n)}}function ku(e){return e=Ou(e),kd(e)}var jc=null;function kd(e){if(jc=null,e=Yn(e),e!==null){var t=nl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=hb(t),e!==null)return e;e=null}else if(n===31){if(e=yb(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return jc=e,null}function pg(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Hm()){case Eb:return 2;case zb:return 8;case gc:case qm:return 32;case Nb:return 268435456;default:return 32}default:return 32}}var xu=!1,xn=null,Sn=null,wn=null,el=new Map,tl=new Map,cn=[],wy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function fb(e,t){switch(e){case"focusin":case"focusout":xn=null;break;case"dragenter":case"dragleave":Sn=null;break;case"mouseover":case"mouseout":wn=null;break;case"pointerover":case"pointerout":el.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":tl.delete(t.pointerId)}}function ka(e,t,n,o,a,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:l,targetContainers:[a]},t!==null&&(t=ta(t),t!==null&&bg(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function Ty(e,t,n,o,a){switch(t){case"focusin":return xn=ka(xn,e,t,n,o,a),!0;case"dragenter":return Sn=ka(Sn,e,t,n,o,a),!0;case"mouseover":return wn=ka(wn,e,t,n,o,a),!0;case"pointerover":var l=a.pointerId;return el.set(l,ka(el.get(l)||null,e,t,n,o,a)),!0;case"gotpointercapture":return l=a.pointerId,tl.set(l,ka(tl.get(l)||null,e,t,n,o,a)),!0}return!1}function vg(e){var t=Yn(e.target);if(t!==null){var n=nl(t);if(n!==null){if(t=n.tag,t===13){if(t=hb(n),t!==null){e.blockedOn=t,Hs(e.priority,function(){sb(n)});return}}else if(t===31){if(t=yb(n),t!==null){e.blockedOn=t,Hs(e.priority,function(){sb(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function fc(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ku(e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);Tr=o,n.target.dispatchEvent(o),Tr=null}else return t=ta(n),t!==null&&bg(t),e.blockedOn=n,!1;t.shift()}return!0}function bb(e,t,n){fc(e)&&n.delete(t)}function Ey(){xu=!1,xn!==null&&fc(xn)&&(xn=null),Sn!==null&&fc(Sn)&&(Sn=null),wn!==null&&fc(wn)&&(wn=null),el.forEach(bb),tl.forEach(bb)}function Zl(e,t){e.blockedOn===t&&(e.blockedOn=null,xu||(xu=!0,be.unstable_scheduleCallback(be.unstable_NormalPriority,Ey)))}var Kl=null;function pb(e){Kl!==e&&(Kl=e,be.unstable_scheduleCallback(be.unstable_NormalPriority,function(){Kl===e&&(Kl=null);for(var t=0;t<e.length;t+=3){var n=e[t],o=e[t+1],a=e[t+2];if(typeof o!="function"){if(kd(o||n)===null)continue;break}var l=ta(n);l!==null&&(e.splice(t,3),t-=3,Yr(l,{pending:!0,data:a,method:n.method,action:o},o,a))}}))}function Po(e){function t(r){return Zl(r,e)}xn!==null&&Zl(xn,e),Sn!==null&&Zl(Sn,e),wn!==null&&Zl(wn,e),el.forEach(t),tl.forEach(t);for(var n=0;n<cn.length;n++){var o=cn[n];o.blockedOn===e&&(o.blockedOn=null)}for(;0<cn.length&&(n=cn[0],n.blockedOn===null);)vg(n),n.blockedOn===null&&cn.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(o=0;o<n.length;o+=3){var a=n[o],l=n[o+1],c=a[Le]||null;if(typeof l=="function")c||pb(n);else if(c){var i=null;if(l&&l.hasAttribute("formAction")){if(a=l,c=l[Le]||null)i=c.formAction;else if(kd(a)!==null)continue}else i=c.action;typeof i=="function"?n[o+1]=i:(n.splice(o,3),o-=3),pb(n)}}}function gg(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),o||setTimeout(n,20)}function n(){if(!o&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function xd(e){this._internalRoot=e}ci.prototype.render=xd.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(h(409));var n=t.current,o=Fe();fg(n,o,e,t,null,null)};ci.prototype.unmount=xd.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;fg(e.current,2,null,e,null,null),oi(),t[ea]=null}};function ci(e){this._internalRoot=e}ci.prototype.unstable_scheduleHydration=function(e){if(e){var t=Db();e={blockedOn:null,target:e,priority:t};for(var n=0;n<cn.length&&t!==0&&t<cn[n].priority;n++);cn.splice(n,0,e),n===0&&vg(e)}};var vb=gb.version;if(vb!=="19.3.0")throw Error(h(527,vb,"19.3.0"));j.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(h(188)):(e=Object.keys(e).join(","),Error(h(268,e)));return e=zm(t),e=e!==null?kb(e):null,e=e===null?null:e.stateNode,e};var zy={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(xa=__REACT_DEVTOOLS_GLOBAL_HOOK__,!xa.isDisabled&&xa.supportsFiber))try{ol=xa.inject(zy),Ke=xa}catch{}var xa;ii.createRoot=function(e,t){if(!mb(e))throw Error(h(299));var n=!1,o="",a=Wp,l=$p,c=Ip;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(l=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=dg(e,1,!1,null,null,n,o,null,a,l,c,gg),e[ea]=t.current,fd(e),new xd(t)};ii.hydrateRoot=function(e,t,n){if(!mb(e))throw Error(h(299));var o=!1,a="",l=Wp,c=$p,i=Ip,r=null;return n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(l=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(i=n.onRecoverableError),n.formState!==void 0&&(r=n.formState)),t=dg(e,1,!0,t,n??null,o,a,r,l,c,i,gg),t.context=sg(null),n=t.current,o=Fe(),o=Eu(o),a=gn(o),a.callback=null,mn(n,a,o),n=o,t.current.lanes=n,ll(t,n),At(t),e[ea]=t.current,fd(e),new ci(t)};ii.version="19.3.0"});var kg=vt((h1,yg)=>{"use strict";function hg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(hg)}catch(e){console.error(e)}}hg(),yg.exports=mg()});var Td=`/*---------------------------------------------------------------------------------------------
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
`;var Ed=`/* VS Code theme variables for hosts outside VS Code (the browser extension's pages): a dark and
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
`;var zd=`/* The Inkspect design system: tokens and the shared components (buttons, fields, selects,
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
`;var ua={global:"Browser",inspect:"Element picker",draw:"Drawing",screenshot:"Screenshot",devtools:"Console and network",device:"Device",measure:"Measure",eyedropper:"Eyedropper",overlay:"Design overlay",tweak:"CSS tweak",record:"Record",a11y:"Accessibility check",send:"Send dialog"},H=e=>`vscodeBrowser.${e}`,Wt=[{id:"tab.new",label:"New tab",scope:"global",keys:["ctrl+t"],command:H("newTab")},{id:"tab.close",label:"Close tab",scope:"global",keys:["ctrl+w","ctrl+f4"],command:H("closeTab")},{id:"tab.reopen",label:"Reopen closed tab",scope:"global",keys:["ctrl+shift+t"],command:H("reopenClosedTab")},{id:"tab.next",label:"Next tab",scope:"global",keys:["ctrl+tab","ctrl+pagedown"],mac:["ctrl+tab","cmd+alt+right"],command:H("nextTab")},{id:"tab.previous",label:"Previous tab",scope:"global",keys:["ctrl+shift+tab","ctrl+pageup"],mac:["ctrl+shift+tab","cmd+alt+left"],command:H("previousTab")},{id:"tab.duplicate",label:"Duplicate tab",scope:"global",keys:[],command:H("duplicateTab")},{id:"tab.private",label:"New private tab",scope:"global",keys:["ctrl+shift+n"],command:H("newPrivateTab")},{id:"window.new",label:"New window",scope:"global",keys:["ctrl+n"],command:H("newWindow")},{id:"nav.address",label:"Focus the address bar",scope:"global",keys:["ctrl+l","alt+d"],mac:["cmd+l","alt+d"],command:H("focusAddressBar")},{id:"nav.back",label:"Back",scope:"global",keys:["alt+left"],mac:["cmd+["],command:H("goBack")},{id:"nav.forward",label:"Forward",scope:"global",keys:["alt+right"],mac:["cmd+]"],command:H("goForward")},{id:"nav.reload",label:"Reload",scope:"global",keys:["ctrl+r","f5"],mac:["cmd+r"],command:H("reload")},{id:"nav.hardReload",label:"Hard reload",scope:"global",keys:["ctrl+shift+r","ctrl+f5"],mac:["cmd+shift+r"],command:H("hardReload")},{id:"nav.stop",label:"Stop loading",scope:"global",keys:[],command:H("stop")},{id:"nav.home",label:"Home page",scope:"global",keys:["alt+home"],mac:["cmd+shift+h"],command:H("goHome")},{id:"page.find",label:"Find in page",scope:"global",keys:["ctrl+f"],command:H("find")},{id:"page.zoomIn",label:"Zoom in",scope:"global",keys:["ctrl+=","ctrl+shift+="],command:H("zoomIn")},{id:"page.zoomOut",label:"Zoom out",scope:"global",keys:["ctrl+-"],command:H("zoomOut")},{id:"page.zoomReset",label:"Reset zoom",scope:"global",keys:["ctrl+0"],command:H("zoomReset")},{id:"page.bookmark",label:"Bookmark this page",scope:"global",keys:["ctrl+d"],command:H("bookmarkPage")},{id:"page.source",label:"View page source",scope:"global",keys:["ctrl+u"],mac:["cmd+alt+u"],command:H("viewSource")},{id:"page.pdf",label:"Save page as PDF",scope:"global",keys:[],command:H("savePdf")},{id:"page.copyUrl",label:"Copy page address",scope:"global",keys:["ctrl+shift+l"],command:H("copyUrl")},{id:"page.external",label:"Open in system browser",scope:"global",keys:[],command:H("openInSystemBrowser")},{id:"page.devtools",label:"Open DevTools",scope:"global",keys:["f12"],command:H("openDevTools")},{id:"page.contextToAgent",label:"Send page context to agent",scope:"global",keys:["ctrl+alt+enter"],command:H("sendPageContextToChat")},{id:"agent.showContext",label:"Show agent context",scope:"global",keys:["ctrl+shift+alt+a"],command:H("showAgentContext"),everywhere:!0},{id:"agent.sendLatest",label:"Send the latest capture to the agent",scope:"global",keys:["ctrl+shift+alt+v"],command:H("sendLatestContext"),everywhere:!0},{id:"open.history",label:"History",scope:"global",keys:["ctrl+h"],mac:["cmd+y"],command:H("showHistory")},{id:"open.downloads",label:"Downloads",scope:"global",keys:["shift+alt+l"],command:H("showDownloads")},{id:"open.bookmarks",label:"Bookmark manager",scope:"global",keys:["ctrl+alt+b"],command:H("showBookmarks")},{id:"open.bookmarksBar",label:"Show or hide the bookmarks bar",scope:"global",keys:["ctrl+shift+b"]},{id:"open.quickActions",label:"Quick actions",scope:"global",keys:["ctrl+shift+k"]},{id:"open.shortcuts",label:"Change keyboard shortcuts",scope:"global",keys:["ctrl+alt+k"],command:H("editShortcuts")},{id:"open.cheatSheet",label:"Keyboard shortcuts of this mode",scope:"global",keys:["ctrl+shift+/"],mac:["cmd+alt+/"]},{id:"mode.inspect",label:"Element picker",scope:"global",keys:["shift+alt+e"]},{id:"mode.draw",label:"Draw on the page",scope:"global",keys:["shift+alt+w"]},{id:"mode.screenshot",label:"Screenshot",scope:"global",keys:["shift+alt+g"]},{id:"mode.devtools",label:"Console and network",scope:"global",keys:["shift+alt+j"]},{id:"mode.device",label:"Device toolbar",scope:"global",keys:["shift+alt+m"]},{id:"mode.measure",label:"Measure",scope:"global",keys:["shift+alt+u"]},{id:"mode.eyedropper",label:"Eyedropper",scope:"global",keys:["shift+alt+y"]},{id:"mode.overlay",label:"Design overlay",scope:"global",keys:["shift+alt+o"]},{id:"mode.tweak",label:"CSS tweak",scope:"global",keys:["shift+alt+v"]},{id:"mode.record",label:"Record the page",scope:"global",keys:["ctrl+alt+r"]},{id:"mode.a11y",label:"Accessibility check",scope:"global",keys:["shift+alt+h"]},{id:"inspect.parent",label:"Select the parent element",scope:"inspect",keys:["up"]},{id:"inspect.child",label:"Select the first child element",scope:"inspect",keys:["down"]},{id:"inspect.copy",label:"Copy the selected elements",scope:"inspect",keys:["enter","c"]},{id:"inspect.screenshot",label:"Screenshot the element",scope:"inspect",keys:["s"]},{id:"inspect.agent",label:"Send the element to the agent",scope:"inspect",keys:["a"]},{id:"inspect.help",label:"Show these shortcuts",scope:"inspect",keys:["shift+/"]},{id:"inspect.exit",label:"Exit",scope:"inspect",keys:["escape"]},{id:"draw.select",label:"Select and move",scope:"draw",keys:["v"]},{id:"draw.pen",label:"Pen",scope:"draw",keys:["p"]},{id:"draw.pencil",label:"Pencil",scope:"draw",keys:["i"]},{id:"draw.marker",label:"Marker",scope:"draw",keys:["m"]},{id:"draw.brush",label:"Brush",scope:"draw",keys:["u"]},{id:"draw.highlighter",label:"Highlighter",scope:"draw",keys:["h"]},{id:"draw.neon",label:"Neon",scope:"draw",keys:["g"]},{id:"draw.line",label:"Line",scope:"draw",keys:["l"]},{id:"draw.arrow",label:"Arrow",scope:"draw",keys:["a"]},{id:"draw.doubleArrow",label:"Double arrow",scope:"draw",keys:["d"]},{id:"draw.rect",label:"Rectangle",scope:"draw",keys:["r"]},{id:"draw.ellipse",label:"Ellipse",scope:"draw",keys:["o"]},{id:"draw.text",label:"Text",scope:"draw",keys:["t"]},{id:"draw.callout",label:"Numbered callout",scope:"draw",keys:["n"]},{id:"draw.blur",label:"Redact (pixelate)",scope:"draw",keys:["b"]},{id:"draw.eraser",label:"Eraser",scope:"draw",keys:["e"]},...[1,2,3,4,5,6,7,8,9].map(e=>({id:`draw.color${e}`,label:`Color ${e}`,scope:"draw",keys:[String(e)]})),{id:"draw.thinner",label:"Thinner stroke",scope:"draw",keys:["["]},{id:"draw.thicker",label:"Thicker stroke",scope:"draw",keys:["]"]},{id:"draw.fill",label:"Fill shapes on or off",scope:"draw",keys:["f"]},{id:"draw.undo",label:"Undo",scope:"draw",keys:["ctrl+z"]},{id:"draw.redo",label:"Redo",scope:"draw",keys:["ctrl+y","ctrl+shift+z"]},{id:"draw.clear",label:"Clear all drawings",scope:"draw",keys:["shift+backspace"]},{id:"draw.visible",label:"Hide or show drawings",scope:"draw",keys:["w"]},{id:"draw.capture",label:"Screenshot the drawing area",scope:"draw",keys:["enter"]},{id:"draw.captureAgent",label:"Screenshot the drawing area and send it to the agent",scope:"draw",keys:["shift+enter"]},{id:"draw.captureMenu",label:"Screenshot menu",scope:"draw",keys:["s"]},{id:"draw.captureGroups",label:"Screenshot each drawing separately",scope:"draw",keys:["alt+g"]},{id:"draw.captureClean",label:"Screenshot the drawing area without drawings",scope:"draw",keys:["alt+c"]},{id:"draw.captureViewport",label:"Screenshot the visible area with drawings",scope:"draw",keys:["alt+v"]},{id:"draw.captureFullPage",label:"Screenshot the full page with drawings",scope:"draw",keys:["alt+f"]},{id:"draw.help",label:"Show these shortcuts",scope:"draw",keys:["shift+/"]},{id:"draw.exit",label:"Stop drawing",scope:"draw",keys:["escape"]},{id:"shot.viewport",label:"Visible area",scope:"screenshot",keys:["v"]},{id:"shot.fullPage",label:"Full page",scope:"screenshot",keys:["f"]},{id:"shot.region",label:"Region",scope:"screenshot",keys:["r"]},{id:"shot.element",label:"Element",scope:"screenshot",keys:["e"]},{id:"shot.drawing",label:"Drawing area",scope:"screenshot",keys:["d"]},{id:"shot.lastToAgent",label:"Send the last screenshot to the agent",scope:"screenshot",keys:["a"],command:H("screenshot.sendToTerminal")},{id:"send.default",label:"Send to the default agent",scope:"send",keys:["enter"]},{id:"send.newThread",label:"New agentmux thread",scope:"send",keys:["n"]},{id:"send.prompt",label:"Write a prompt",scope:"send",keys:["i"]},{id:"send.project",label:"Change project",scope:"send",keys:["p"]},{id:"send.copy",label:"Copy",scope:"send",keys:["c"]},{id:"send.download",label:"Download",scope:"send",keys:["d"]},{id:"send.close",label:"Close (keep it saved)",scope:"send",keys:["escape"]},{id:"dev.console",label:"Console",scope:"devtools",keys:["alt+1"]},{id:"dev.network",label:"Network",scope:"devtools",keys:["alt+2"]},{id:"dev.filter",label:"Filter",scope:"devtools",keys:["alt+f"]},{id:"dev.copyErrors",label:"Copy console errors",scope:"devtools",keys:["alt+e"]},{id:"dev.copyFailed",label:"Copy failed requests",scope:"devtools",keys:["alt+q"]},{id:"dev.copyContext",label:"Copy page context",scope:"devtools",keys:["alt+p"]},{id:"dev.contextAgent",label:"Send page context to the agent",scope:"devtools",keys:["alt+shift+p"]},{id:"dev.clear",label:"Clear",scope:"devtools",keys:["alt+k"]},{id:"dev.close",label:"Close",scope:"devtools",keys:["alt+w"]},{id:"device.previous",label:"Previous device",scope:"device",keys:["alt+["]},{id:"device.next",label:"Next device",scope:"device",keys:["alt+]"]},{id:"device.rotate",label:"Rotate",scope:"device",keys:["alt+r"]},{id:"device.touch",label:"Touch and mobile on or off",scope:"device",keys:["alt+t"]},{id:"device.fit",label:"Fit to window",scope:"device",keys:["alt+0"]},{id:"device.zoomIn",label:"Zoom in",scope:"device",keys:["alt+="]},{id:"device.zoomOut",label:"Zoom out",scope:"device",keys:["alt+-"]},{id:"device.network",label:"Next network speed",scope:"device",keys:["alt+n"]},{id:"device.theme",label:"Next color scheme",scope:"device",keys:["alt+l"]},{id:"device.close",label:"Close the device toolbar",scope:"device",keys:[]},{id:"measure.grid",label:"Rulers and grid on or off",scope:"measure",keys:["g"]},{id:"measure.copy",label:"Copy the measurements",scope:"measure",keys:["c"]},{id:"measure.clear",label:"Clear the pinned element",scope:"measure",keys:["backspace"]},{id:"measure.help",label:"Show these shortcuts",scope:"measure",keys:["shift+/"]},{id:"measure.exit",label:"Exit",scope:"measure",keys:["escape"]},{id:"eyedropper.hex",label:"Copy colors as hex",scope:"eyedropper",keys:["h"]},{id:"eyedropper.rgb",label:"Copy colors as rgb()",scope:"eyedropper",keys:["r"]},{id:"eyedropper.hsl",label:"Copy colors as hsl()",scope:"eyedropper",keys:["l"]},{id:"eyedropper.help",label:"Show these shortcuts",scope:"eyedropper",keys:["shift+/"]},{id:"eyedropper.exit",label:"Exit",scope:"eyedropper",keys:["escape"]},{id:"overlay.open",label:"Open an image",scope:"overlay",keys:["alt+o"]},{id:"overlay.fainter",label:"Less opaque",scope:"overlay",keys:["alt+,"]},{id:"overlay.stronger",label:"More opaque",scope:"overlay",keys:["alt+."]},{id:"overlay.left",label:"Nudge left",scope:"overlay",keys:["alt+left"]},{id:"overlay.right",label:"Nudge right",scope:"overlay",keys:["alt+right"]},{id:"overlay.up",label:"Nudge up",scope:"overlay",keys:["alt+up"]},{id:"overlay.down",label:"Nudge down",scope:"overlay",keys:["alt+down"]},{id:"overlay.difference",label:"Difference blend on or off",scope:"overlay",keys:["alt+x"]},{id:"overlay.hide",label:"Hide or show the overlay",scope:"overlay",keys:["alt+h"]},{id:"overlay.exit",label:"Close the overlay",scope:"overlay",keys:["alt+z"]},{id:"tweak.agent",label:"Send the CSS changes to the agent",scope:"tweak",keys:["ctrl+enter"]},{id:"tweak.copy",label:"Copy the CSS changes",scope:"tweak",keys:["ctrl+shift+c"]},{id:"tweak.undo",label:"Undo the last change",scope:"tweak",keys:["ctrl+z"]},{id:"tweak.exit",label:"Exit and revert",scope:"tweak",keys:["escape"]},{id:"record.stop",label:"Stop and save",scope:"record",keys:["alt+s"]},{id:"record.pause",label:"Pause or resume",scope:"record",keys:["alt+y"]},{id:"record.cancel",label:"Cancel",scope:"record",keys:["alt+backspace"]},{id:"a11y.next",label:"Next issue",scope:"a11y",keys:["n","down"]},{id:"a11y.previous",label:"Previous issue",scope:"a11y",keys:["p","up"]},{id:"a11y.tabOrder",label:"Tab order on or off",scope:"a11y",keys:["t"]},{id:"a11y.copy",label:"Copy the report",scope:"a11y",keys:["c"]},{id:"a11y.agent",label:"Send the report to the agent",scope:"a11y",keys:["a"]},{id:"a11y.help",label:"Show these shortcuts",scope:"a11y",keys:["shift+/"]},{id:"a11y.exit",label:"Exit",scope:"a11y",keys:["escape"]}];function da(e,t){return t?[...e.mac??e.keys.map(n=>n.replace(/\bctrl\+/,"cmd+"))]:[...e.keys]}function vl(e){let t=pi(e.trim());return t.key?[t.ctrl&&"ctrl",t.shift&&"shift",t.alt&&"alt",t.meta&&"cmd",t.key].filter(Boolean).join("+"):""}function gl(e,t){let n={};for(let o of Wt){let a=e[o.id],l=(a===void 0?da(o,t):typeof a=="string"?[a]:[...a]).map(vl);n[o.id]=[...new Set(l.filter(Boolean))]}return n}function Dd(e){if(!e||typeof e!="object"||Array.isArray(e))return{};let t=new Set(Wt.map(o=>o.id)),n={};for(let[o,a]of Object.entries(e))t.has(o)&&(typeof a=="string"||Array.isArray(a)&&a.every(l=>typeof l=="string"))&&(n[o]=a);return n}var Nd=new Set(["devtools","device","overlay","record"]);function Rd(e){let t=new Map(Wt.map(a=>[a.id,a.scope])),n=new Map;for(let[a,l]of Object.entries(e))for(let c of l)n.set(c,[...n.get(c)??[],a]);let o=[];for(let[a,l]of n)for(let c=0;c<l.length;c++)for(let i=c+1;i<l.length;i++){let[r,u]=[t.get(l[c]),t.get(l[i])];(r===u||Nd.has(r)&&Nd.has(u))&&o.push({key:a,ids:[l[c],l[i]]})}return o}function fi(e){return[e.ctrl&&"ctrl",e.shift&&"shift",e.alt&&"alt",e.meta&&"cmd",e.key].filter(Boolean).join("+")}var bi=new Set(["mode.inspect","mode.draw","mode.screenshot","mode.device","mode.devtools","page.bookmark","open.shortcuts","inspect.parent","inspect.child","inspect.copy","inspect.exit",...["select","pen","pencil","marker","brush","highlighter","neon","line","arrow","doubleArrow","rect","ellipse","text","callout","blur","eraser"].map(e=>`draw.${e}`),...Array.from({length:9},(e,t)=>`draw.color${t+1}`),"draw.thinner","draw.thicker","draw.fill","draw.undo","draw.redo","draw.clear","draw.visible","draw.capture","draw.captureMenu","draw.captureGroups","draw.captureClean","draw.captureViewport","draw.captureFullPage","draw.exit","shot.viewport","shot.fullPage","shot.region","shot.element","shot.drawing","send.default","send.newThread","send.prompt","send.project","send.copy","send.download","send.close"]),Jg=new Set([]),Od={id:"vs",label:"VS",title:"Works in VS Code Browser"},Cd={id:"br",label:"BR",title:"Works in the Inkspect toolbar in your browser (Chrome, Edge, Firefox...)"};function Bd(e){return Jg.has(e.scope)?[Cd]:bi.has(e.id)?[Od,Cd]:[Od]}var Fg={control:"ctrl",ctl:"ctrl","\u2303":"ctrl",option:"alt",opt:"alt","\u2325":"alt",command:"cmd",meta:"cmd",win:"cmd",super:"cmd","\u2318":"cmd","\u21E7":"shift",esc:"escape",return:"enter","\u21A9":"enter",del:"delete","\u2191":"up","\u2193":"down","\u2190":"left","\u2192":"right",pgup:"pageup",pgdn:"pagedown","+":"="},Ad=new Set(["ctrl","shift","alt","cmd"]);function ml(e,t){let n=t.toLowerCase().replace(/([⌃⌥⇧⌘↩↑↓←→])/g," $1 ").split(/\s+|[+-](?=.)/).filter(Boolean).map(r=>Fg[r]??r);if(!n.length)return!1;let o=n.filter(r=>Ad.has(r)),a=n.filter(r=>!Ad.has(r));if(a.length>1)return!1;let l=pi(vl(e)),c={ctrl:l.ctrl,shift:l.shift,alt:l.alt,cmd:l.meta};if(!o.every(r=>c[r]))return!1;let[i]=a;return i===void 0||l.key.startsWith(i)}function Ud(e){if(!e.key)return;let t=/^f([1-9]|1\d|2[0-4])$/.test(e.key);return e.ctrl||e.alt||e.meta||t?fi(e):void 0}function Hd(e,t){let n=_t(e,t);return t?[...[...n.matchAll(/[⌃⌥⇧⌘]/g)].map(a=>a[0]),n.replace(/[⌃⌥⇧⌘]/g,"")]:n.split(/\+(?=.)/)}var qd={global:"browser",inspect:"inspect",draw:"edit",screenshot:"device-camera",devtools:"debug-console",device:"device-mobile",measure:"symbol-ruler",eyedropper:"symbol-color",overlay:"layers",tweak:"symbol-property",record:"record",a11y:"accessibility",send:"send"};function _t(e,t){let n=pi(e),o={escape:"Esc",enter:t?"\u21A9":"Enter",backspace:t?"\u232B":"Backspace",delete:t?"\u2326":"Delete",up:"\u2191",down:"\u2193",left:"\u2190",right:"\u2192",pageup:"PgUp",pagedown:"PgDn",tab:t?"\u21E5":"Tab",space:"Space","/":n.shift?"?":"/"},a=!(n.key==="/"&&n.shift),l=o[n.key]??(n.key.length===1?n.key.toUpperCase():n.key[0].toUpperCase()+n.key.slice(1));return t?`${n.ctrl?"\u2303":""}${n.alt?"\u2325":""}${n.shift&&a?"\u21E7":""}${n.meta?"\u2318":""}${l}`:[n.ctrl&&"Ctrl",n.alt&&"Alt",n.shift&&a&&"Shift",l].filter(Boolean).join("+")}function pi(e){let t=e.toLowerCase().split("+"),n=t.pop()??"";return{ctrl:t.includes("ctrl"),shift:t.includes("shift"),alt:t.includes("alt"),meta:t.includes("cmd")||t.includes("meta")||t.includes("win"),key:n}}var Wg={arrowleft:"left",arrowright:"right",arrowup:"up",arrowdown:"down",esc:"escape"," ":"space","+":"="},_d={Equal:"=",Minus:"-",BracketLeft:"[",BracketRight:"]",Slash:"/",Backslash:"\\",Comma:",",Period:".",Semicolon:";",Quote:"'",Backquote:"`",NumpadAdd:"=",NumpadSubtract:"-"},hl=new Set(["Control","Shift","Alt","Meta","AltGraph","OS"]),Md={"?":"/","<":",",">":".",":":";",'"':"'","{":"[","}":"]","|":"\\","~":"`",_:"-","+":"=","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0"};function yl(e){let t={ctrl:e.ctrlKey,shift:e.shiftKey,alt:e.altKey,meta:e.metaKey};if(e.getModifierState?.("AltGraph"))return{...t,key:""};let n=e.key,o;return/^[a-z0-9]$/i.test(n)?o=n.toLowerCase():e.shiftKey&&Md[n]!==void 0?o=Md[n]:/^[-=[\]\\/,.;'`+]$/.test(n)?o=n:/^Key[A-Z]$/.test(e.code)?o=e.code.slice(3).toLowerCase():/^Digit\d$/.test(e.code)?o=e.code.slice(5):_d[e.code]?o=_d[e.code]:o=n.toLowerCase(),{...t,key:Wg[o]??o}}var es=U(Ie(),1);var Pd,pm=e=>{let t=e.composedPath()[0];if(e.button!==0){Pd=void 0;return}t instanceof Element&&(Pd={element:t.closest('button, [role="button"], a')??t,at:performance.now()})};typeof window<"u"&&window.addEventListener("pointerdown",pm,!0);function Ye(...e){return e.filter(Boolean).join(" ")}var ro=U(ee(),1);function $t({variant:e="secondary",size:t="md",icon:n,iconEnd:o,loading:a,className:l,children:c,disabled:i,type:r="button",...u}){let f=a?"loading":n;return(0,ro.jsxs)("button",{type:r,className:Ye("button",e,t==="sm"&&"small",l),disabled:i||a,"aria-busy":a||void 0,...u,children:[f&&(0,ro.jsx)("span",{className:Ye("codicon",`codicon-${f}`,a&&"codicon-modifier-spin"),"aria-hidden":"true"}),c!==void 0&&(0,ro.jsx)("span",{className:"button-label",children:c}),o&&(0,ro.jsx)("span",{className:`codicon codicon-${o}`,"aria-hidden":"true"})]})}var Sl=U(Ie(),1);var as=U(ee(),1);function Si({children:e,confirmLabel:t,onConfirm:n,icon:o,variant:a="ghost",size:l="sm",disabled:c,title:i,className:r}){let[u,f]=(0,Sl.useState)(!1);return(0,Sl.useEffect)(()=>{if(!u)return;let g=setTimeout(()=>f(!1),4e3);return()=>clearTimeout(g)},[u]),(0,as.jsx)($t,{size:l,variant:u?"danger":a,icon:u?"warning":o,disabled:c,title:i,className:r,"aria-live":"polite",onClick:()=>{if(!u){f(!0);return}f(!1),n()},onBlur:()=>f(!1),children:u?t:e})}var wi=U(ee(),1),mm=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function sa({binding:e,size:t="md"}){let n=Hd(e,mm);return(0,wi.jsx)("span",{className:`keycaps size-${t}`,"aria-label":n.join("+"),children:n.map((o,a)=>(0,wi.jsx)("kbd",{className:"keycap",children:o},a))})}var ls=U(Ie(),1);var Mn=U(ee(),1);function cs({value:e,options:t,onChange:n,label:o,iconOnly:a,size:l="md",className:c}){let i=(0,ls.useRef)(null),r=u=>{let f={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[u.key];if(!f)return;u.preventDefault();let g=t.findIndex(p=>p.value===e),d=t[(g+f+t.length)%t.length];n(d.value),i.current?.querySelector(`[data-value="${CSS.escape(d.value)}"]`)?.focus()};return(0,Mn.jsx)("div",{ref:i,className:Ye("segmented",`size-${l}`,c),role:"radiogroup","aria-label":o,onKeyDown:r,children:t.map(u=>{let f=u.value===e;return(0,Mn.jsxs)("button",{type:"button",role:"radio","aria-checked":f,"aria-label":a?u.label:void 0,title:a||u.icon?u.label:void 0,"data-value":u.value,tabIndex:f?0:-1,className:Ye("segment",f&&"checked"),onClick:()=>n(u.value),children:[u.icon&&(0,Mn.jsx)("span",{className:`codicon codicon-${u.icon}`,"aria-hidden":"true"}),!a&&(0,Mn.jsx)("span",{className:"segment-label",children:u.label}),u.count!==void 0&&(0,Mn.jsx)("span",{className:Ye("segment-count",u.tone),children:u.count})]},u.value)})})}var It=U(Ie(),1);var Ti=U(ee(),1);function Ei({icon:e,label:t,onClick:n,onContextMenu:o,disabled:a,active:l,spin:c,className:i}){return(0,Ti.jsx)("button",{type:"button",className:["icon-button",l&&"active",i].filter(Boolean).join(" "),title:t,"aria-label":t,"aria-pressed":l,disabled:a,onClick:n,onContextMenu:o,children:(0,Ti.jsx)("span",{className:`codicon codicon-${e}${c?" codicon-modifier-spin":""}`,"aria-hidden":"true"})})}var _=U(ee(),1),uo=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function rs({actions:e,scopes:t,map:n,overrides:o,query:a="",labelOf:l=u=>u.label,scopeLabel:c=u=>ua[u],onSetKeys:i,onReset:r}){let[u,f]=(0,It.useState)(new Set),[g,d]=(0,It.useState)(null),p=(0,It.useMemo)(()=>new Set(e.map(b=>b.id)),[e]),y=(0,It.useMemo)(()=>Rd(n).filter(b=>b.ids.every(m=>p.has(m))),[n,p]),S=b=>y.filter(m=>m.ids.includes(b)).map(m=>({key:m.key,other:m.ids.find(k=>k!==b)}));(0,It.useEffect)(()=>{if(!g)return;let b=k=>{if(k.preventDefault(),k.stopImmediatePropagation(),hl.has(k.key))return;let T=yl(k);if(!T.key)return;let x=!T.ctrl&&!T.alt&&!T.meta&&!T.shift,E=[...n[g.id]??[]];if(x&&T.key==="escape"){d(null);return}if(x&&T.key==="backspace"&&g.index!==void 0)E.splice(g.index,1);else{let K=fi(T);g.index===void 0?E.push(K):E[g.index]=K}i(g.id,[...new Set(E)]),d(null)},m=k=>{k.composedPath().some(x=>x instanceof HTMLElement&&x.classList.contains("key-recording"))||d(null)};return window.addEventListener("keydown",b,!0),window.addEventListener("pointerdown",m,!0),()=>{window.removeEventListener("keydown",b,!0),window.removeEventListener("pointerdown",m,!0)}},[g,n,i]);let z=a.trim().toLowerCase(),v=b=>!z||l(b).toLowerCase().includes(z)||b.id.toLowerCase().includes(z)||c(b.scope).toLowerCase().includes(z)||(n[b.id]??[]).some(m=>_t(m,uo).toLowerCase().includes(z)||ml(m,z)),s=b=>{let m=e.find(k=>k.id===b);return m?l(m):b};return(0,_.jsxs)("div",{className:"shortcut-list",children:[y.length>0&&(0,_.jsxs)("p",{className:"shortcuts-warning",role:"alert",children:[(0,_.jsx)("span",{className:"codicon codicon-warning","aria-hidden":"true"}),y.length===1?"1 key is":`${y.length} keys are`," used twice."]}),t.map(b=>{let m=e.filter(T=>T.scope===b&&v(T));if(!m.length)return null;let k=z!==""||!u.has(b);return(0,_.jsxs)("section",{className:"shortcut-group",children:[(0,_.jsxs)("button",{type:"button",className:"group-header","aria-expanded":k,onClick:()=>f(T=>{let x=new Set(T);return x.has(b)?x.delete(b):x.add(b),x}),children:[(0,_.jsx)("span",{className:`codicon codicon-chevron-${k?"down":"right"}`,"aria-hidden":"true"}),(0,_.jsx)("span",{className:`codicon codicon-${qd[b]} group-icon`,"aria-hidden":"true"}),(0,_.jsx)("span",{className:"group-title",children:c(b)}),(0,_.jsx)("span",{className:"group-count",children:m.length})]}),k&&m.map(T=>(0,_.jsx)(hm,{action:T,label:l(T),keys:n[T.id]??[],changed:T.id in o,conflicts:S(T.id).map(x=>({...x,otherLabel:s(x.other)})),recording:g?.id===T.id?g:null,onRecord:x=>d({id:T.id,index:x}),onCancel:()=>d(null),onRemove:x=>i(T.id,(n[T.id]??[]).filter((E,K)=>K!==x)),onReset:()=>r(T.id),onResolve:(x,E)=>i(x,(n[x]??[]).filter(K=>K!==E))},T.id))]},b)})]})}function hm({action:e,label:t,keys:n,changed:o,conflicts:a,recording:l,onRecord:c,onCancel:i,onRemove:r,onReset:u,onResolve:f}){let g=da(e,uo).map(p=>_t(p,uo)).join(", ")||"none",d=l!==null&&l.index===void 0;return(0,_.jsxs)("div",{className:`shortcut-item${o?" changed":""}${a.length?" conflict":""}`,children:[(0,_.jsxs)("div",{className:"shortcut-main",children:[(0,_.jsx)("span",{className:"shortcut-label",title:e.id,children:t}),(0,_.jsx)("span",{className:"shortcut-places",children:Bd(e).map(p=>(0,_.jsx)("span",{className:`shortcut-tag ${p.id}`,title:p.title,children:p.label},p.id))}),(0,_.jsxs)("span",{className:"shortcut-actions",children:[o&&(0,_.jsx)(Ei,{icon:"discard",label:`Reset to default (${g})`,className:"small",onClick:u}),n.length>0&&!d&&(0,_.jsx)(Ei,{icon:"add",label:"Add another key",className:"small add-key",onClick:()=>c()})]}),(0,_.jsxs)("span",{className:"shortcut-keys-column",children:[n.map((p,y)=>l?.index===y?(0,_.jsx)(is,{onCancel:i},p):(0,_.jsxs)("span",{className:"key-button-wrap",children:[(0,_.jsx)("button",{type:"button",className:"key-button",title:"Change: click, then press the new keys","aria-label":`${_t(p,uo)}: change`,onClick:()=>c(y),children:(0,_.jsx)(sa,{binding:p,size:"sm"})}),(0,_.jsx)("button",{type:"button",className:"key-remove","aria-label":`Remove ${_t(p,uo)}`,title:"Remove this key",onClick:()=>r(y),children:(0,_.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]},p)),d&&(0,_.jsx)(is,{onCancel:i}),!n.length&&!d&&(0,_.jsxs)("button",{type:"button",className:"key-empty",title:"Add a key: click, then press the keys",onClick:()=>c(),children:[(0,_.jsx)("span",{className:"codicon codicon-add","aria-hidden":"true"}),"Add key"]})]})]}),a.map(({key:p,other:y,otherLabel:S})=>(0,_.jsxs)("div",{className:"shortcut-conflict",children:[(0,_.jsx)("span",{className:"codicon codicon-warning","aria-hidden":"true"}),(0,_.jsxs)("span",{children:[_t(p,uo)," is also \u201C",S,"\u201D"]}),(0,_.jsx)("button",{type:"button",className:"link-button",onClick:()=>f(y,p),children:"Remove it there"})]},`${p}-${y}`))]})}function is({onCancel:e}){return(0,_.jsxs)("span",{className:"key-recording",role:"status",children:[(0,_.jsx)("span",{className:"recording-dot","aria-hidden":"true"}),"Press keys\u2026",(0,_.jsx)("button",{type:"button",className:"key-recording-cancel","aria-label":"Cancel",onClick:e,children:(0,_.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]})}var Rn=U(Ie(),1);var Dn=U(ee(),1);function us({icon:e,trailing:t,size:n="md",onClear:o,invalid:a,className:l,disabled:c,...i}){let r=i.value!==void 0&&String(i.value)!=="";return(0,Dn.jsxs)("div",{className:Ye("text-field",`size-${n}`,a&&"invalid",c&&"disabled",l),children:[e&&(0,Dn.jsx)("span",{className:`codicon codicon-${e} text-field-icon`,"aria-hidden":"true"}),(0,Dn.jsx)("input",{spellCheck:!1,...i,disabled:c,"aria-invalid":a||void 0}),o&&r&&(0,Dn.jsx)("button",{type:"button",className:"text-field-clear","aria-label":"Clear",title:"Clear",tabIndex:-1,onClick:o,children:(0,Dn.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})}),t]})}var fs=U(ee(),1),ym=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),Mt=null;function ds(e){return Mt?(Mt(e),!0):!1}typeof window<"u"&&window.addEventListener("keydown",e=>{if(!Mt||hl.has(e.key))return;e.stopImmediatePropagation();let t=Ud(yl(e));t&&(e.preventDefault(),Mt(t))},!0);function ss({value:e,onChange:t,size:n}){let o=(0,Rn.useRef)(t);(0,Rn.useEffect)(()=>{o.current=t});let[a]=(0,Rn.useState)(()=>l=>o.current(_t(l,ym)));return(0,Rn.useEffect)(()=>()=>{Mt===a&&(Mt=null)},[a]),(0,fs.jsx)(us,{size:n,icon:"search",placeholder:"Search actions or keys, or press a shortcut","aria-label":"Search shortcuts: type, or press a shortcut",value:e,onChange:l=>t(l.target.value),onClear:()=>t(""),onFocus:()=>{Mt=a},onBlur:()=>{Mt===a&&(Mt=null)}})}var _n=U(Ie()),Ug=U(kg());var ri="inkspectShortcuts",ui=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),k1=Wt.filter(e=>bi.has(e.id)),Ny={"mode.device":"Responsive view","mode.screenshot":"Screenshot menu","open.shortcuts":"Keyboard shortcuts"},Sg=e=>Ny[e.id]??e.label,wg=e=>e==="global"?"General":ua[e],xg=["global","inspect","draw","screenshot"],Tg=[...xg,...Object.keys(ua).filter(e=>!xg.includes(e))];async function Eg(){let e=(await chrome.storage.sync.get(ri))[ri];return{overrides:Dd(e?.shortcuts??{}),updated:typeof e?.updated=="number"?e.updated:0}}async function zg(e){let{updated:t}=await Eg();await chrome.storage.sync.set({[ri]:{shortcuts:e,updated:Math.max(Date.now(),t+1)}})}function Ng(e){let t=()=>{Eg().then(o=>e(gl(o.overrides,ui),o))},n=(o,a)=>{a==="sync"&&o[ri]&&t()};return chrome.storage.onChanged.addListener(n),t(),()=>chrome.storage.onChanged.removeListener(n)}async function Sd(e,t,n){let o={...e},a=Wt.find(i=>i.id===t),l=a?da(a,ui).map(vl):[],c=n!==void 0&&n.length===l.length&&n.every(i=>l.includes(i));n===void 0||c?delete o[t]:o[t]=n,await zg(o)}async function Og(){await zg({})}var di=U(Ie()),de=U(ee()),Oy=e=>/^VS Code \((.*)\)$/.exec(e??"")?.[1];function Cy(e){let[t,n]=(0,di.useState)([]);return(0,di.useEffect)(()=>{if(!e)return;let o=!0,a=()=>{chrome.runtime.sendMessage({type:"hub",request:{type:"projects.get",req:crypto.randomUUID()}}).then(c=>{!o||c?.type!=="projects"||n([...new Set(c.projects.filter(i=>i.vscode).map(i=>i.name))])}).catch(()=>{})};a();let l=setInterval(a,4e3);return()=>{o=!1,clearInterval(l)}},[e]),e?t:[]}function Cg({status:e,limit:t=1/0,size:n="lg"}){let o=e.state==="connected",a=Cy(o),l=e.via==="hub"?"Browser helper":"Linked",c=Oy(e.peer),i=[];if(o){for(let g of a)i.push({id:g,name:`VS Code (${g})`,lastUsed:g===c,tag:l});i.some(g=>g.lastUsed)||i.unshift({id:"peer",name:e.peer??"VS Code",lastUsed:!0,tag:l})}let r=i.slice(0,t),u=i.length-r.length,f=r.findIndex(g=>g.lastUsed);return(0,de.jsxs)("div",{className:`link-graph size-${n} state-${e.state}`,"aria-hidden":"true",children:[(0,de.jsx)("span",{className:"graph-node source",children:(0,de.jsx)("span",{className:"codicon codicon-globe"})}),(0,de.jsx)("ul",{className:"graph-targets",children:o?(0,de.jsxs)(de.Fragment,{children:[r.map((g,d)=>(0,de.jsxs)("li",{className:`graph-target${g.lastUsed?" lit":d<f?" on-path":""}`,children:[(0,de.jsx)("span",{className:"graph-node",children:(0,de.jsx)("span",{className:"codicon codicon-vscode"})}),(0,de.jsx)("span",{className:"graph-name",children:g.name}),g.lastUsed&&(0,de.jsx)("span",{className:"graph-tag",children:g.tag})]},g.id)),u>0&&(0,de.jsx)("li",{className:"graph-target more",children:(0,de.jsxs)("span",{className:"graph-name",children:["and ",u," more"]})})]}):(0,de.jsxs)("li",{className:"graph-target pending",children:[(0,de.jsx)("span",{className:"graph-node",children:(0,de.jsx)("span",{className:"codicon codicon-vscode"})}),(0,de.jsx)("span",{className:"graph-name",children:"VS Code"})]})})]})}var Ag=`/* LinkGraph: the browser, and a branch to each VS Code window (a tree connector drawn in CSS).
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
`;var _g=`/* PairCard: linking this browser (one click in VS Code; the code is the fallback), on the full
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
`;var pl=U(Ie());var si=U(Ie()),ia=U(ee());function Mg({value:e,onChange:t,onComplete:n,length:o=6,disabled:a}){let l=(0,si.useRef)([]),c=Array.from({length:o},(u,f)=>e[f]??""),i=u=>l.current[Math.max(0,Math.min(o-1,u))]?.focus(),r=(u,f)=>{let g=f.replace(/\D/g,"");if(!g)return;let d=(e.slice(0,u)+g).slice(0,o);t(d),i(d.length),d.length===o&&n?.(d)};return(0,ia.jsx)("div",{className:"code-input",role:"group","aria-label":"Pairing code",children:c.map((u,f)=>(0,ia.jsxs)(si.Fragment,{children:[f===o/2&&(0,ia.jsx)("span",{className:"code-sep","aria-hidden":"true"}),(0,ia.jsx)("input",{ref:g=>{l.current[f]=g},className:"code-box",inputMode:"numeric",autoComplete:"one-time-code","aria-label":`Digit ${f+1}`,maxLength:o,disabled:a,value:u,onFocus:g=>g.currentTarget.select(),onChange:g=>r(Math.min(f,e.length),g.target.value),onPaste:g=>{g.preventDefault(),r(0,g.clipboardData.getData("text"))},onKeyDown:g=>{if(g.key==="Backspace"){g.preventDefault();let d=u?f:f-1;d>=0&&t(e.slice(0,d)),i(d)}else g.key==="ArrowLeft"?(g.preventDefault(),i(f-1)):g.key==="ArrowRight"&&(g.preventDefault(),i(f+1))}})]},f))})}var L=U(ee());function Dg({status:e,pair:t,compact:n,startWithCode:o}){let[a,l]=(0,pl.useState)(""),[c,i]=(0,pl.useState)(""),[r,u]=(0,pl.useState)(!1),[f,g]=(0,pl.useState)(!!o);if(e.state==="connected")return null;let d=async(y=a)=>{if(y.length!==6||r)return;u(!0),i("");let S=await t(y).catch(()=>{});if(u(!1),!S){i("The extension did not answer. Reload it and try again.");return}i(S.error??""),S.state==="connected"&&l("")},p=(0,L.jsxs)("p",{className:"card-foot",children:[(0,L.jsx)("span",{className:"codicon codicon-lock","aria-hidden":"true"}),"The link only talks to VS Code on this computer, and only after pairing (or through the browser helper VS Code installs)."]});return e.via==="hub"?(0,L.jsx)("div",{className:Ye("card","pair-card",n&&"compact"),children:(0,L.jsxs)("p",{className:"pair-lead",children:[(0,L.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,L.jsx)("span",{children:"Linked through the browser helper: no pairing needed. VS Code isn't running, so sends to its terminals and chat wait for it; captures still save into your projects, and agentmux agents still get them."})]})}):e.state!=="unpaired"?(0,L.jsxs)("div",{className:Ye("card","pair-card",n&&"compact"),children:[(0,L.jsxs)("p",{className:"pair-lead",children:[(0,L.jsx)("span",{className:"codicon codicon-loading codicon-modifier-spin","aria-hidden":"true"}),(0,L.jsxs)("span",{children:["Open VS Code with the VS Code Browser extension. Then click"," ",(0,L.jsx)("b",{children:"Pair Browser Extension"})," in its ",(0,L.jsx)("b",{children:"Browser"})," side panel."]})]}),!n&&p]}):(0,L.jsxs)("form",{className:Ye("card","pair-card",n&&"compact"),onSubmit:y=>{y.preventDefault(),d()},children:[(0,L.jsxs)("p",{className:"pair-lead",children:[(0,L.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,L.jsxs)("span",{children:["In VS Code, click ",(0,L.jsx)("b",{children:"Pair Browser Extension"})," in the ",(0,L.jsx)("b",{children:"Browser"})," side panel (or"," ",(0,L.jsx)("b",{children:"Pair"})," on its notification). No code needed: this updates by itself."]})]}),f?(0,L.jsxs)(L.Fragment,{children:[(0,L.jsxs)("p",{className:"muted",children:["Run ",(0,L.jsx)("kbd",{children:"Browser: Pair Browser Extension with a Code"})," in VS Code, then type the code it shows."]}),(0,L.jsxs)("div",{className:"pair-row",children:[(0,L.jsx)(Mg,{value:a,onChange:l,disabled:r,onComplete:y=>{d(y)}}),(0,L.jsx)($t,{type:"submit",variant:"primary",icon:"link",className:"pair-button",loading:r,disabled:a.length!==6,children:"Pair"})]})]}):(0,L.jsx)($t,{size:"sm",variant:"ghost",icon:"key",className:"use-code",onClick:()=>g(!0),children:"Use a code instead"}),c&&(0,L.jsxs)("p",{className:"pair-message",role:"alert",children:[(0,L.jsx)("span",{className:"codicon codicon-error","aria-hidden":"true"}),c]}),!n&&p]})}var Rg=`/* The full page. Components and tokens come from @inkspect/shared/ui (ui.css, theme.css); the
   link graph from ../ui/link-graph.css. */

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100vh;
  background: var(--vscode-editor-background);
  color: var(--vscode-foreground);
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
  line-height: 1.5;
}

.muted {
  color: var(--ink-muted);
}

/* Top bar: brand, sections, state ------------------------------------------------------------ */

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--ink-border-subtle);
  background: color-mix(in srgb, var(--vscode-editor-background) 78%, transparent);
  backdrop-filter: blur(14px) saturate(1.4);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--ink-font-lg);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.brand img {
  width: 28px;
  height: 28px;
  border-radius: 8px;
}

/* The sections, as pills. */
.page-nav.segmented {
  height: 36px;
  padding: 3px;
  border-radius: var(--ink-radius-pill);
  background: color-mix(in srgb, var(--vscode-foreground) 6%, transparent);
}

.page-nav .segment {
  gap: 7px;
  padding: 0 16px;
  border-radius: var(--ink-radius-pill);
  font-weight: 500;
}

.page-nav .segment.checked {
  background: var(--vscode-editorWidget-background);
  color: var(--vscode-foreground);
  box-shadow: var(--ink-shadow-sm);
}

.status-chip {
  --tone: var(--ink-muted);
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--tone) 35%, transparent);
  border-radius: var(--ink-radius-pill);
  background: color-mix(in srgb, var(--tone) 10%, transparent);
  font-size: var(--ink-font-sm);
  font-weight: 600;
}

.status-chip.tone-ok {
  --tone: var(--ink-green);
}

.status-chip.tone-warn {
  --tone: var(--ink-yellow);
}

.status-chip.tone-busy {
  --tone: var(--ink-blue);
}

.status-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tone);
}

/* Content ------------------------------------------------------------------------------------ */

.main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(880px, 100% - 48px);
  margin: 0 auto;
  padding: 40px 0 64px;
}

/* The hero: the section's headline, and for VS Code the link, drawn. */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 32px;
  padding: 8px 0 12px;
}

.hero.compact {
  grid-template-columns: 1fr;
  padding-bottom: 0;
}

.hero h1 {
  margin: 0 0 10px;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.hero p {
  max-width: 52ch;
  margin: 0;
  color: var(--ink-muted);
  font-size: 14px;
  line-height: 1.6;
}

/* A canvas with a dot grid: where the link is drawn. */
.canvas {
  display: flex;
  align-items: center;
  min-height: 220px;
  padding: 28px 32px;
  border: 1px solid var(--ink-border-subtle);
  border-radius: 16px;
  background:
    radial-gradient(
        circle at 1px 1px,
        color-mix(in srgb, var(--vscode-foreground) 16%, transparent) 1px,
        transparent 0
      )
      0 0 / 18px 18px,
    var(--vscode-editorWidget-background);
  box-shadow: var(--ink-shadow);
}

.card {
  border: 1px solid var(--ink-border-subtle);
  border-radius: 16px;
  background: var(--vscode-editorWidget-background);
  box-shadow: var(--ink-shadow-sm);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--ink-blue) 14%, transparent);
  color: var(--ink-blue);
}

.card-icon .codicon {
  font-size: 18px !important;
}

.info-card h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.info-card p {
  margin: 0;
  color: var(--ink-muted);
}

.card-bottom {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
}

.card-value {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Shortcuts ------------------------------------------------------------------------------------- */

/* Group headers pin just below the sticky top bar. */
.shortcuts-card .shortcut-list {
  --shortcut-sticky-top: 61px;
}

.shortcuts-card .group-header {
  background: var(--vscode-editorWidget-background);
}

.shortcuts-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 16px 18px;
}

.shortcuts-bar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.shortcuts-bar .text-field {
  flex: 1;
}

/* The browser's own key (opens the toolbar), above the synced list. */
.browser-key {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius);
}

.browser-key > .codicon {
  color: var(--ink-blue);
}

.browser-key-label {
  flex: 1;
}

@media (max-width: 760px) {
  .topbar {
    grid-template-columns: 1fr auto;
    padding: 10px 16px;
  }

  .page-nav.segmented {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-self: stretch;
  }

  .page-nav .segment {
    flex: 1;
  }

  .main {
    width: calc(100% - 32px);
    padding-top: 24px;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .pair-row,
  .pair-message {
    padding-left: 0;
    margin-left: 0;
  }
}
`;var w=U(ee()),Dy=["vscode","shortcuts","about"],Bg=()=>{let e=location.hash.slice(1);return Dy.includes(e)?e:"vscode"},Ry={connected:{label:"Linked",tone:"ok"},connecting:{label:"Connecting",tone:"busy"},unpaired:{label:"Not paired",tone:"warn"},offline:{label:"VS Code not running",tone:"off"}};function By(){let[e,t]=(0,_n.useState)({state:"connecting"}),[n,o]=(0,_n.useState)(Bg),[a,l]=(0,_n.useState)(()=>({map:gl({},ui),overrides:{}})),[c,i]=(0,_n.useState)();(0,_n.useEffect)(()=>{let f=()=>{chrome.runtime.sendMessage({type:"status"}).then(y=>y&&t(y))};f();let g=setInterval(f,2e3),d=()=>o(Bg());addEventListener("hashchange",d);let p=Ng((y,S)=>l({map:y,overrides:S.overrides}));return chrome.commands.getAll().then(y=>i(y.find(S=>S.name==="toggle-toolbar")?.shortcut)),()=>{clearInterval(g),removeEventListener("hashchange",d),p()}},[]);let r=f=>{o(f),history.replaceState(null,"",`#${f}`)},u=Ry[e.state];return(0,w.jsxs)("div",{className:"page",children:[(0,w.jsxs)("header",{className:"topbar",children:[(0,w.jsxs)("div",{className:"brand",children:[(0,w.jsx)("img",{src:"icons/48.png",alt:""}),(0,w.jsx)("span",{children:"Inkspect"})]}),(0,w.jsx)(cs,{label:"Sections",className:"page-nav",value:n,onChange:r,options:[{value:"vscode",label:"VS Code",icon:"vscode"},{value:"shortcuts",label:"Shortcuts",icon:"keyboard"},{value:"about",label:"About",icon:"info"}]}),(0,w.jsxs)("span",{className:`status-chip tone-${u.tone}`,role:"status",children:[(0,w.jsx)("span",{className:"status-dot","aria-hidden":"true"}),u.label]})]}),(0,w.jsxs)("main",{className:"main",children:[n==="vscode"&&(0,w.jsx)(Uy,{status:e,setStatus:t}),n==="shortcuts"&&(0,w.jsx)(Hy,{map:a.map,overrides:a.overrides,linked:e.state==="connected",toolbarKey:c}),n==="about"&&(0,w.jsx)(qy,{status:e,toolbarKey:c,stateLabel:u.label})]})]})}function Uy({status:e,setStatus:t}){let n=e.state==="connected",o=async a=>{let l=await chrome.runtime.sendMessage({type:"pair",code:a}).catch(()=>{});return l&&t(l),l};return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsxs)("section",{className:"hero",children:[(0,w.jsxs)("div",{className:"hero-text",children:[(0,w.jsx)("h1",{children:n?`Linked with ${e.peer??"VS Code"}`:e.state==="unpaired"?"Pair with VS Code":e.state==="connecting"?"Looking for VS Code":"Waiting for VS Code"}),(0,w.jsx)("p",{children:n?"Every capture from the toolbar is saved into its project and offered to send to that project\u2019s agents. Bookmarks sync both ways.":e.state==="unpaired"?"VS Code is running. Pair once to save captures into your projects and keep bookmarks in sync.":"Start VS Code with the VS Code Browser extension. This page finds it by itself."})]}),(0,w.jsx)("div",{className:"canvas","aria-label":"The link",children:(0,w.jsx)(Cg,{status:e})})]}),n?(0,w.jsxs)("div",{className:"cards",children:[(0,w.jsx)(ra,{icon:"debug-disconnect",title:"This browser",text:"Unlinking stops sends and bookmark sync until you pair again.",children:(0,w.jsx)(Si,{variant:"danger",icon:"debug-disconnect",confirmLabel:"Click again to unlink",onConfirm:()=>{chrome.runtime.sendMessage({type:"unpair"}).then(a=>a&&t(a))},children:"Unlink"})}),(0,w.jsx)(ra,{icon:"lock",title:"Private by design",text:"The link only talks to VS Code on this computer (127.0.0.1), and only after pairing."})]}):(0,w.jsx)(Dg,{status:e,pair:o,startWithCode:location.hash==="#vscode-code"})]})}function Hy({map:e,overrides:t,linked:n,toolbarKey:o}){let[a,l]=(0,_n.useState)(""),c=a.trim().toLowerCase(),i=!c||c.split(/\s+/).every(r=>"open the toolbar browser".includes(r))||!!o&&(o.toLowerCase().includes(c)||ml(o,c));return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("section",{className:"hero compact",children:(0,w.jsxs)("div",{className:"hero-text",children:[(0,w.jsx)("h1",{children:"Shortcuts"}),(0,w.jsxs)("p",{children:["Every shortcut of the toolbar and VS Code Browser, one key map:"," ",n?"a change here applies in VS Code too, and the other way round.":"they sync with VS Code once it is linked, and follow your browser account."," ","Click a key, then press the new one."]})]})}),(0,w.jsxs)("div",{className:"card shortcuts-card",children:[(0,w.jsxs)("div",{className:"shortcuts-bar",children:[(0,w.jsx)(ss,{value:a,onChange:l}),(0,w.jsx)(Si,{icon:"discard",confirmLabel:"Click again to reset",title:"Reset all shortcuts (here and in VS Code)",disabled:!Object.keys(t).length,onConfirm:()=>{Og()},children:"Reset all"})]}),i&&(0,w.jsxs)("div",{className:"browser-key",children:[(0,w.jsx)("span",{className:"codicon codicon-inspect","aria-hidden":"true"}),(0,w.jsx)("span",{className:"browser-key-label",children:"Open the toolbar"}),(0,w.jsx)("span",{className:"shortcut-tag br",title:"Works in your browser. Set by the browser itself, so it does not sync with VS Code",children:"BR"}),o?(0,w.jsx)(sa,{binding:o.toLowerCase(),size:"sm"}):(0,w.jsx)("span",{className:"muted",children:"No key"}),(0,w.jsx)($t,{size:"sm",variant:"ghost",onClick:()=>{chrome.tabs.create({url:"chrome://extensions/shortcuts"})},children:"Change"})]}),(0,w.jsx)(rs,{actions:Wt,scopes:Tg,map:e,overrides:t,query:a,labelOf:Sg,scopeLabel:wg,onSetKeys:(r,u)=>{Sd(t,r,u)},onReset:r=>{Sd(t,r,void 0)}}),(0,w.jsxs)("p",{className:"card-foot",children:[(0,w.jsx)("span",{className:"codicon codicon-info","aria-hidden":"true"}),"VS: works in VS Code Browser. BR: works in this browser's toolbar. It is one key map: changing a key here changes it in VS Code too."]})]})]})}function qy({status:e,toolbarKey:t,stateLabel:n}){let o=e.state==="connected";return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)("section",{className:"hero compact",children:(0,w.jsxs)("div",{className:"hero-text",children:[(0,w.jsx)("h1",{children:"About"}),(0,w.jsxs)("p",{children:["Inkspect ",chrome.runtime.getManifest().version,": a toolbar for working with AI agents on any page, linked with VS Code."]})]})}),(0,w.jsxs)("div",{className:"cards",children:[(0,w.jsx)(ra,{icon:"keyboard",title:"Open the toolbar",text:"On any page. The toolbar button opens the popup, which can open it too.",children:(0,w.jsxs)("span",{className:"card-value",children:[t?(0,w.jsx)(sa,{binding:t.toLowerCase(),size:"sm"}):(0,w.jsx)("span",{className:"muted",children:"No key"}),(0,w.jsx)($t,{size:"sm",variant:"ghost",onClick:()=>{chrome.tabs.create({url:"chrome://extensions/shortcuts"})},children:"Change"})]})}),(0,w.jsx)(ra,{icon:"vscode",title:"VS Code",text:o?`Linked with ${e.peer??"VS Code"}.`:"Not linked yet.",children:(0,w.jsx)("span",{className:"card-value muted",children:n})}),(0,w.jsx)(ra,{icon:"bookmark",title:"Bookmarks",text:"Synced with VS Code both ways, live, while it is linked.",children:(0,w.jsx)("span",{className:"card-value muted",children:o?"Syncing":"Paused"})}),(0,w.jsx)(ra,{icon:"shield",title:"Access",text:"Only the tab you open the toolbar on, while it is open. Nothing leaves this computer except to VS Code on 127.0.0.1."})]})]})}function ra({icon:e,title:t,text:n,children:o}){return(0,w.jsxs)("section",{className:"card info-card",children:[(0,w.jsx)("span",{className:"card-icon","aria-hidden":"true",children:(0,w.jsx)("span",{className:`codicon codicon-${e}`})}),(0,w.jsx)("h2",{children:t}),(0,w.jsx)("p",{children:n}),o&&(0,w.jsx)("div",{className:"card-bottom",children:o})]})}chrome.runtime.onMessage.addListener(e=>{e?.type==="shortcutPressed"&&typeof e.key=="string"&&ds(e.key)});var Hg=document.createElement("style");Hg.textContent=[Td,Ed,zd,Ag,_g,Rg].join(`
`);document.head.append(Hg);document.documentElement.classList.add("ink-theme");(0,Ug.createRoot)(document.getElementById("root")).render((0,w.jsx)(By,{}));})();
