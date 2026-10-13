"use strict";(()=>{var Jm=Object.create;var Yd=Object.defineProperty;var $m=Object.getOwnPropertyDescriptor;var Fm=Object.getOwnPropertyNames;var Wm=Object.getPrototypeOf,Im=Object.prototype.hasOwnProperty;var Dt=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var Pm=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Fm(t))!Im.call(e,a)&&a!==n&&Yd(e,a,{get:()=>t[a],enumerable:!(o=$m(t,a))||o.enumerable});return e};var I=(e,t,n)=>(n=e!=null?Jm(Wm(e)):{},Pm(t||!e||!e.__esModule?Yd(n,"default",{value:e,enumerable:!0}):n,e));var ns=Dt(ql=>{"use strict";var gp=Symbol.for("react.transitional.element"),vp=Symbol.for("react.fragment");function ts(e,t,n){var o=null;if(n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:gp,type:e,key:o,ref:t!==void 0?t:null,props:n}}ql.Fragment=vp;ql.jsx=ts;ql.jsxs=ts});var ye=Dt((S1,os)=>{"use strict";os.exports=ns()});var ms=Dt(D=>{"use strict";var Bi=Symbol.for("react.transitional.element"),mp=Symbol.for("react.portal"),pp=Symbol.for("react.fragment"),hp=Symbol.for("react.strict_mode"),yp=Symbol.for("react.profiler"),xp=Symbol.for("react.consumer"),kp=Symbol.for("react.context"),Sp=Symbol.for("react.forward_ref"),Tp=Symbol.for("react.suspense"),wp=Symbol.for("react.memo"),rs=Symbol.for("react.lazy"),Ep=Symbol.for("react.activity"),zp=Symbol.for("react.view_transition"),as=Symbol.iterator;function Np(e){return e===null||typeof e!="object"?null:(e=as&&e[as]||e["@@iterator"],typeof e=="function"?e:null)}var us={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ds=Object.assign,ss={};function Ao(e,t,n){this.props=e,this.context=t,this.refs=ss,this.updater=n||us}Ao.prototype.isReactComponent={};Ao.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Ao.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function fs(){}fs.prototype=Ao.prototype;function qi(e,t,n){this.props=e,this.context=t,this.refs=ss,this.updater=n||us}var ji=qi.prototype=new fs;ji.constructor=qi;ds(ji,Ao.prototype);ji.isPureReactComponent=!0;var ls=Array.isArray;function Ui(){}var P={H:null,A:null,T:null,S:null},bs=Object.prototype.hasOwnProperty;function Li(e,t,n){var o=n.ref;return{$$typeof:Bi,type:e,key:t,ref:o!==void 0?o:null,props:n}}function Op(e,t){return Li(e.type,t,e.props)}function Yi(e){return typeof e=="object"&&e!==null&&e.$$typeof===Bi}function Ap(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var cs=/\/+/g;function Ri(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Ap(""+e.key):t.toString(36)}function _p(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Ui,Ui):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function Oo(e,t,n,o,a){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var c=!1;if(e===null)c=!0;else switch(l){case"bigint":case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case Bi:case mp:c=!0;break;case rs:return c=e._init,Oo(c(e._payload),t,n,o,a)}}if(c)return a=a(e),c=o===""?"."+Ri(e,0):o,ls(a)?(n="",c!=null&&(n=c.replace(cs,"$&/")+"/"),Oo(a,t,n,"",function(d){return d})):a!=null&&(Yi(a)&&(a=Op(a,n+(a.key==null||e&&e.key===a.key?"":(""+a.key).replace(cs,"$&/")+"/")+c)),t.push(a)),1;c=0;var i=o===""?".":o+":";if(ls(e))for(var r=0;r<e.length;r++)o=e[r],l=i+Ri(o,r),c+=Oo(o,t,n,l,a);else if(r=Np(e),typeof r=="function")for(e=r.call(e),r=0;!(o=e.next()).done;)o=o.value,l=i+Ri(o,r++),c+=Oo(o,t,n,l,a);else if(l==="object"){if(typeof e.then=="function")return Oo(_p(e),t,n,o,a);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return c}function jl(e,t,n){if(e==null)return e;var o=[],a=0;return Oo(e,o,"","",function(l){return t.call(n,l,a++)}),o}function Mp(e){if(e._status===-1){var t=e._result,n=t();n.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,n.status===void 0&&(n.status="fulfilled",n.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,n.status===void 0&&(n.status="rejected",n.reason=o))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var is=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function gs(e){var t=P.T,n={};n.types=t!==null?t.types:null,P.T=n;try{var o=e(),a=P.S;a!==null&&a(n,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(Ui,is)}catch(l){is(l)}finally{t!==null&&n.types!==null&&(t.types=n.types),P.T=t}}function vs(e){var t=P.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else gs(vs.bind(null,e))}var Cp={map:jl,forEach:function(e,t,n){jl(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return jl(e,function(){t++}),t},toArray:function(e){return jl(e,function(t){return t})||[]},only:function(e){if(!Yi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};D.Activity=Ep;D.Children=Cp;D.Component=Ao;D.Fragment=pp;D.Profiler=yp;D.PureComponent=qi;D.StrictMode=hp;D.Suspense=Tp;D.ViewTransition=zp;D.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=P;D.__COMPILER_RUNTIME={__proto__:null,c:function(e){return P.H.useMemoCache(e)}};D.addTransitionType=vs;D.cache=function(e){return function(){return e.apply(null,arguments)}};D.cacheSignal=function(){return null};D.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=ds({},e.props),a=e.key;if(t!=null)for(l in t.key!==void 0&&(a=""+t.key),t)!bs.call(t,l)||l==="key"||l==="__self"||l==="__source"||l==="ref"&&t.ref===void 0||(o[l]=t[l]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var c=Array(l),i=0;i<l;i++)c[i]=arguments[i+2];o.children=c}return Li(e.type,a,o)};D.createContext=function(e){return e={$$typeof:kp,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:xp,_context:e},e};D.createElement=function(e,t,n){var o,a={},l=null;if(t!=null)for(o in t.key!==void 0&&(l=""+t.key),t)bs.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(a[o]=t[o]);var c=arguments.length-2;if(c===1)a.children=n;else if(1<c){for(var i=Array(c),r=0;r<c;r++)i[r]=arguments[r+2];a.children=i}if(e&&e.defaultProps)for(o in c=e.defaultProps,c)a[o]===void 0&&(a[o]=c[o]);return Li(e,l,a)};D.createRef=function(){return{current:null}};D.forwardRef=function(e){return{$$typeof:Sp,render:e}};D.isValidElement=Yi;D.lazy=function(e){return{$$typeof:rs,_payload:{_status:-1,_result:e},_init:Mp}};D.memo=function(e,t){return{$$typeof:wp,type:e,compare:t===void 0?null:t}};D.startTransition=gs;D.unstable_useCacheRefresh=function(){return P.H.useCacheRefresh()};D.use=function(e){return P.H.use(e)};D.useActionState=function(e,t,n){return P.H.useActionState(e,t,n)};D.useCallback=function(e,t){return P.H.useCallback(e,t)};D.useContext=function(e){return P.H.useContext(e)};D.useDebugValue=function(){};D.useDeferredValue=function(e,t){return P.H.useDeferredValue(e,t)};D.useEffect=function(e,t){return P.H.useEffect(e,t)};D.useEffectEvent=function(e){return P.H.useEffectEvent(e)};D.useId=function(){return P.H.useId()};D.useImperativeHandle=function(e,t,n){return P.H.useImperativeHandle(e,t,n)};D.useInsertionEffect=function(e,t){return P.H.useInsertionEffect(e,t)};D.useLayoutEffect=function(e,t){return P.H.useLayoutEffect(e,t)};D.useMemo=function(e,t){return P.H.useMemo(e,t)};D.useOptimistic=function(e,t){return P.H.useOptimistic(e,t)};D.useReducer=function(e,t,n){return P.H.useReducer(e,t,n)};D.useRef=function(e){return P.H.useRef(e)};D.useState=function(e){return P.H.useState(e)};D.useSyncExternalStore=function(e,t,n){return P.H.useSyncExternalStore(e,t,n)};D.useTransition=function(){return P.H.useTransition()};D.version="19.3.0"});var Wt=Dt((E1,ps)=>{"use strict";ps.exports=ms()});var Bs=Dt(qe=>{"use strict";var qp=Wt();function Us(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function hn(){}var Ye={d:{f:hn,r:function(){throw Error(Us(522))},D:hn,C:hn,L:hn,m:hn,X:hn,S:hn,M:hn},p:0,findDOMNode:null},jp=Symbol.for("react.portal"),Lp=Symbol.for("react.recoverable"),Rs=Symbol.for("react.optimistic_key");function Yp(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:jp,key:o==null?null:o===Rs?Rs:""+o,children:e,containerInfo:t,implementation:n}}var Ma=qp.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Yl(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}qe.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Ye;qe.browser=function(e){return{$$typeof:Lp,_reason:e}};qe.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(Us(299));return Yp(e,t,null,n)};qe.flushSync=function(e){var t=Ma.T,n=Ye.p;try{if(Ma.T=null,Ye.p=2,e)return e()}finally{Ma.T=t,Ye.p=n,Ye.d.f()}};qe.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Ye.d.C(e,t))};qe.prefetchDNS=function(e){typeof e=="string"&&Ye.d.D(e)};qe.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,o=Yl(n,t.crossOrigin),a=typeof t.integrity=="string"?t.integrity:void 0,l=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Ye.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:o,integrity:a,fetchPriority:l}):n==="script"&&Ye.d.X(e,{crossOrigin:o,integrity:a,fetchPriority:l,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};qe.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=Yl(t.as,t.crossOrigin);Ye.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}}else t==null&&Ye.d.M(e)};qe.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,o=Yl(n,t.crossOrigin);Ye.d.L(e,n,{crossOrigin:o,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};qe.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=Yl(t.as,t.crossOrigin);Ye.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}else Ye.d.m(e)};qe.requestFormReset=function(e){Ye.d.r(e)};qe.unstable_batchedUpdates=function(e,t){return e(t)};qe.useFormState=function(e,t,n){return Ma.H.useFormState(e,t,n)};qe.useFormStatus=function(){return Ma.H.useHostTransitionStatus()};qe.version="19.3.0"});var Xi=Dt(($1,js)=>{"use strict";function qs(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(qs)}catch(e){console.error(e)}}qs(),js.exports=Bs()});var Ws=Dt(ae=>{"use strict";function Ji(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,a=e[o];if(0<Gl(a,t))e[o]=t,e[n]=a,n=o;else break e}}function Rt(e){return e.length===0?null:e[0]}function Xl(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,a=e.length,l=a>>>1;o<l;){var c=2*(o+1)-1,i=e[c],r=c+1,d=e[r];if(0>Gl(i,n))r<a&&0>Gl(d,i)?(e[o]=d,e[r]=n,o=r):(e[o]=i,e[c]=n,o=c);else if(r<a&&0>Gl(d,n))e[o]=d,e[r]=n,o=r;else break e}}return t}function Gl(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}ae.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Gs=performance,ae.unstable_now=function(){return Gs.now()}):(Qi=Date,Vs=Qi.now(),ae.unstable_now=function(){return Qi.now()-Vs});var Gs,Qi,Vs,It=[],yn=[],Gp=1,mt=null,je=3,$i=!1,Ca=!1,Ha=!1,Fi=!1,Zs=typeof setTimeout=="function"?setTimeout:null,Ks=typeof clearTimeout=="function"?clearTimeout:null,Xs=typeof setImmediate<"u"?setImmediate:null;function Vl(e){for(var t=Rt(yn);t!==null;){if(t.callback===null)Xl(yn);else if(t.startTime<=e)Xl(yn),t.sortIndex=t.expirationTime,Ji(It,t);else break;t=Rt(yn)}}function Wi(e){if(Ha=!1,Vl(e),!Ca)if(Rt(It)!==null)Ca=!0,Do||(Do=!0,Ho());else{var t=Rt(yn);t!==null&&Ii(Wi,t.startTime-e)}}var Do=!1,Da=-1,Js=5,$s=-1;function Fs(){return Fi?!0:!(ae.unstable_now()-$s<Js)}function Zi(){if(Fi=!1,Do){var e=ae.unstable_now();$s=e;var t=!0;try{e:{Ca=!1,Ha&&(Ha=!1,Ks(Da),Da=-1),$i=!0;var n=je;try{t:{for(Vl(e),mt=Rt(It);mt!==null&&!(mt.expirationTime>e&&Fs());){var o=mt.callback;if(typeof o=="function"){mt.callback=null,je=mt.priorityLevel;var a=o(mt.expirationTime<=e);if(e=ae.unstable_now(),typeof a=="function"){mt.callback=a,Vl(e),t=!0;break t}mt===Rt(It)&&Xl(It),Vl(e)}else Xl(It);mt=Rt(It)}if(mt!==null)t=!0;else{var l=Rt(yn);l!==null&&Ii(Wi,l.startTime-e),t=!1}}break e}finally{mt=null,je=n,$i=!1}t=void 0}}finally{t?Ho():Do=!1}}}var Ho;typeof Xs=="function"?Ho=function(){Xs(Zi)}:typeof MessageChannel<"u"?(Ki=new MessageChannel,Qs=Ki.port2,Ki.port1.onmessage=Zi,Ho=function(){Qs.postMessage(null)}):Ho=function(){Zs(Zi,0)};var Ki,Qs;function Ii(e,t){Da=Zs(function(){e(ae.unstable_now())},t)}ae.unstable_IdlePriority=5;ae.unstable_ImmediatePriority=1;ae.unstable_LowPriority=4;ae.unstable_NormalPriority=3;ae.unstable_Profiling=null;ae.unstable_UserBlockingPriority=2;ae.unstable_cancelCallback=function(e){e.callback=null};ae.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Js=0<e?Math.floor(1e3/e):5};ae.unstable_getCurrentPriorityLevel=function(){return je};ae.unstable_next=function(e){switch(je){case 1:case 2:case 3:var t=3;break;default:t=je}var n=je;je=t;try{return e()}finally{je=n}};ae.unstable_requestPaint=function(){Fi=!0};ae.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=je;je=e;try{return t()}finally{je=n}};ae.unstable_scheduleCallback=function(e,t,n){var o=ae.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=n+a,e={id:Gp++,callback:t,priorityLevel:e,startTime:n,expirationTime:a,sortIndex:-1},n>o?(e.sortIndex=n,Ji(yn,e),Rt(It)===null&&e===Rt(yn)&&(Ha?(Ks(Da),Da=-1):Ha=!0,Ii(Wi,n-o))):(e.sortIndex=a,Ji(It,e),Ca||$i||(Ca=!0,Do||(Do=!0,Ho()))),e};ae.unstable_shouldYield=Fs;ae.unstable_wrapCallback=function(e){var t=je;return function(){var n=je;je=t;try{return e.apply(this,arguments)}finally{je=n}}}});var Ps=Dt((P1,Is)=>{"use strict";Is.exports=Ws()});var Lm=Dt(Ei=>{"use strict";var Se=Ps(),jb=Wt(),Vp=Xi();function y(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Lb(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function kl(e){for(var t=e,n=t;n&&!n.alternate;)t=n,(t.flags&4098)!==0&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function Yb(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Gb(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ef(e){if(kl(e)!==e)throw Error(y(188))}function Xp(e){var t=e.alternate;if(!t){if(t=kl(e),t===null)throw Error(y(188));return t!==e?null:e}for(var n=e,o=t;;){var a=n.return;if(a===null)break;var l=a.alternate;if(l===null){if(o=a.return,o!==null){n=o;continue}break}if(a.child===l.child){for(l=a.child;l;){if(l===n)return ef(a),e;if(l===o)return ef(a),t;l=l.sibling}throw Error(y(188))}if(n.return!==o.return)n=a,o=l;else{for(var c=!1,i=a.child;i;){if(i===n){c=!0,n=a,o=l;break}if(i===o){c=!0,o=a,n=l;break}i=i.sibling}if(!c){for(i=l.child;i;){if(i===n){c=!0,n=l,o=a;break}if(i===o){c=!0,o=l,n=a;break}i=i.sibling}if(!c)throw Error(y(189))}}if(n.alternate!==o)throw Error(y(190))}if(n.tag!==3)throw Error(y(188));return n.stateNode.current===n?e:t}function Vb(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Vb(e),t!==null)return t;e=e.sibling}return null}function Ie(e,t,n,o,a,l){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,o,a,l)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&Ie(e.child,t,n,o,a,l))return!0;e=e.sibling}return!1}function xo(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function tf(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return t}function Xb(e){var t=[null,null],n=xo(e);return n===null||Qb(t,e,n.child,{foundSelf:!1}),t}function Qb(e,t,n,o){for(;n!==null;){if(n===t)o.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(o.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&Qb(e,t,n.child,o))return!0;n=n.sibling}return!1}function ke(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(y(559))}}var Yo=null,_r=null;function Qp(e,t,n){return e===n?!0:e===t?(Yo=e,!0):!1}function Zp(e,t,n){return e===n?(_r=e,!1):e===t?(_r!==null&&(Yo=e),!0):!1}function nf(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function Mr(e,t,n){for(var o=0,a=e;a;a=n(a))o++;a=0;for(var l=t;l;l=n(l))a++;for(;0<o-a;)e=n(e),o--;for(;0<a-o;)t=n(t),a--;for(;o--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var W=Object.assign,Kp=Symbol.for("react.element"),Ql=Symbol.for("react.transitional.element"),Ya=Symbol.for("react.portal"),Go=Symbol.for("react.fragment"),Zb=Symbol.for("react.strict_mode"),Cr=Symbol.for("react.profiler"),Kb=Symbol.for("react.consumer"),Yt=Symbol.for("react.context"),Yu=Symbol.for("react.forward_ref"),Hr=Symbol.for("react.suspense"),Dr=Symbol.for("react.suspense_list"),Gu=Symbol.for("react.memo"),Tn=Symbol.for("react.lazy"),Rr=Symbol.for("react.activity"),Jp=Symbol.for("react.legacy_hidden"),$p=Symbol.for("react.memo_cache_sentinel"),Ur=Symbol.for("react.view_transition"),Fp=Symbol.for("react.recoverable"),of=Symbol.iterator;function Ra(e){return e===null||typeof e!="object"?null:(e=of&&e[of]||e["@@iterator"],typeof e=="function"?e:null)}var Wp=Symbol.for("react.client.reference");function Br(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Wp?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Go:return"Fragment";case Cr:return"Profiler";case Zb:return"StrictMode";case Hr:return"Suspense";case Dr:return"SuspenseList";case Rr:return"Activity";case Ur:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case Ya:return"Portal";case Yt:return e.displayName||"Context";case Kb:return(e._context.displayName||"Context")+".Consumer";case Yu:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Gu:return t=e.displayName||null,t!==null?t:Br(e.type)||"Memo";case Tn:t=e._payload,e=e._init;try{return Br(e(t))}catch{}}return null}var Ga=Array.isArray,M=jb.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,V=Vp.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,co={pending:!1,data:null,method:null,action:null},qr=[],Vo=-1;function Jt(e){return{current:e}}function Ce(e){0>Vo||(e.current=qr[Vo],qr[Vo]=null,Vo--)}function ne(e,t){Vo++,qr[Vo]=e.current,e.current=t}var Qt=Jt(null),ll=Jt(null),Cn=Jt(null),Mc=Jt(null);function Cc(e,t){switch(ne(Cn,t),ne(ll,e),ne(Qt,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?hb(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=hb(t),e=vm(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Ce(Qt),ne(Qt,e)}function ua(){Ce(Qt),Ce(ll),Ce(Cn)}function jr(e){var t=e.memoizedState;t!==null&&(ya._currentValue=t.memoizedState,ne(Mc,e)),t=Qt.current;var n=vm(t,e.type);t!==n&&(ne(ll,e),ne(Qt,n))}function Hc(e){ll.current===e&&(Ce(Qt),Ce(ll)),Mc.current===e&&(Ce(Mc),ya._currentValue=co)}var Pi,af;function kn(e){if(Pi===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Pi=t&&t[1]||"",af=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Pi+e+af}var er=!1;function tr(e,t){if(!e||er)return"";er=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var p=function(){throw Error()};if(Object.defineProperty(p.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(p,[])}catch(x){var b=x}Reflect.construct(e,[],p)}else{try{p.call()}catch(x){b=x}p=!1;try{var g=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),p=!0,new e}finally{p&&(g!==void 0?Object.defineProperty(e.prototype,"props",g):delete e.prototype.props)}}}else{try{throw Error()}catch(x){b=x}(p=e())&&typeof p.catch=="function"&&p.catch(function(){})}}catch(x){if(x&&b&&typeof x.stack=="string")return[x.stack,b.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=o.DetermineComponentFrameRoot(),c=l[0],i=l[1];if(c&&i){var r=c.split(`
`),d=i.split(`
`);for(a=o=0;o<r.length&&!r[o].includes("DetermineComponentFrameRoot");)o++;for(;a<d.length&&!d[a].includes("DetermineComponentFrameRoot");)a++;if(o===r.length||a===d.length)for(o=r.length-1,a=d.length-1;1<=o&&0<=a&&r[o]!==d[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==d[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==d[a]){var v=`
`+r[o].replace(" at new "," at ");return e.displayName&&v.includes("<anonymous>")&&(v=v.replace("<anonymous>",e.displayName)),v}while(1<=o&&0<=a);break}}}finally{er=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?kn(n):""}function Ip(e,t){switch(e.tag){case 26:case 27:case 5:return kn(e.type);case 16:return kn("Lazy");case 13:return e.child!==t&&t!==null?kn("Suspense Fallback"):kn("Suspense");case 19:return kn("SuspenseList");case 0:case 15:return tr(e.type,!1);case 11:return tr(e.type.render,!1);case 1:return tr(e.type,!0);case 31:return kn("Activity");case 30:return kn("ViewTransition");default:return""}}function lf(e){try{var t="",n=null;do t+=Ip(e,n),n=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var Lr=Object.prototype.hasOwnProperty,Vu=Se.unstable_scheduleCallback,nr=Se.unstable_cancelCallback,Pp=Se.unstable_shouldYield,eh=Se.unstable_requestPaint,ct=Se.unstable_now,th=Se.unstable_getCurrentPriorityLevel,Jb=Se.unstable_ImmediatePriority,$b=Se.unstable_UserBlockingPriority,Dc=Se.unstable_NormalPriority,nh=Se.unstable_LowPriority,Fb=Se.unstable_IdlePriority,oh=Se.log,ah=Se.unstable_setDisableYieldValue,Sl=null,it=null;function zn(e){if(typeof oh=="function"&&ah(e),it&&typeof it.setStrictMode=="function")try{it.setStrictMode(Sl,e)}catch{}}var rt=Math.clz32?Math.clz32:ih,lh=Math.log,ch=Math.LN2;function ih(e){return e>>>=0,e===0?32:31-(lh(e)/ch|0)|0}var Zl=256,Kl=262144,Jl=4194304;function to(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function ci(e,t,n){var o=e.pendingLanes;if(o===0)return 0;var a=0,l=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var i=o&134217727;return i!==0?(o=i&~l,o!==0?a=to(o):(c&=i,c!==0?a=to(c):n||(n=i&~e,n!==0&&(a=to(n))))):(i=o&~l,i!==0?a=to(i):c!==0?a=to(c):n||(n=o&~e,n!==0&&(a=to(n)))),a===0?0:t!==0&&t!==a&&(t&l)===0&&(l=a&-a,n=t&-t,l>=n||l===32&&(n&4194048)!==0)?t:a}function Tl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Wb(e,t){(t&8)!==0&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var o=31-rt(n),a=1<<o;t|=e[o],n&=~a}return t}function rh(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ib(){var e=Jl;return Jl<<=1,(Jl&62914560)===0&&(Jl=4194304),e}function or(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function wl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function uh(e,t,n,o,a,l){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var i=e.entanglements,r=e.expirationTimes,d=e.hiddenUpdates;for(n=c&~n;0<n;){var v=31-rt(n),p=1<<v;i[v]=0,r[v]=-1;var b=d[v];if(b!==null)for(d[v]=null,v=0;v<b.length;v++){var g=b[v];g!==null&&(g.lane&=-536870913)}n&=~p}o!==0&&Pb(e,o,0),l!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=l&~(c&~t))}function Pb(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-rt(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|n&261930}function eg(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-rt(n),a=1<<o;a&t|e[o]&t&&(e[o]|=t),n&=~a}}function tg(e,t){var n=t&-t;return n=(n&42)!==0?1:Xu(n),(n&(e.suspendedLanes|t))!==0?0:n}function Xu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Qu(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function ng(){var e=V.p;return e!==0?e:(e=window.event,e===void 0?32:Bm(e.type))}function cf(e,t){var n=V.p;try{return V.p=e,t()}finally{V.p=n}}var fn=Math.random().toString(36).slice(2),_e="__reactFiber$"+fn,Pe="__reactProps$"+fn,Sa="__reactContainer$"+fn,rf="__reactEvents$"+fn,dh="__reactListeners$"+fn,sh="__reactHandles$"+fn,uf="__reactResources$"+fn,El="__reactMarker$"+fn,Rc="__reactLoad$"+fn;function ii(e){delete e[_e],delete e[Pe],delete e[dh],delete e[sh]}function ao(e){var t;if(t=e[_e])return t;for(var n=e.parentNode;n;){if(t=n[Sa]||n[_e]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=zb(e);e!==null;){if(n=e[_e])return n;e=zb(e)}return t}e=n,n=e.parentNode}return null}function Ta(e){if(e=e[_e]||e[Sa]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Va(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(y(33))}function Po(e){var t=e[uf];return t||(t=e[uf]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Ee(e){e[El]=!0}function og(e){e[Rc]=void 0}var ag=new Set,lg={};function ko(e,t){da(e,t),da(e+"Capture",t)}function da(e,t){for(lg[e]=t,e=0;e<t.length;e++)ag.add(t[e])}var fh=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),df={},sf={};function bh(e){return Lr.call(sf,e)?!0:Lr.call(df,e)?!1:fh.test(e)?sf[e]=!0:(df[e]=!0,!1)}var L=!1;function ff(){var e=L;return L=!1,e}function fc(e,t,n){if(bh(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,n)}}function $l(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,n)}}function Pt(e,t,n,o){if(o===null)e.removeAttribute(n);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,o)}}function nt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function cg(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function gh(e,t,n){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var a=o.get,l=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,l.call(this,c)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Yr(e){if(!e._valueTracker){var t=cg(e)?"checked":"value";e._valueTracker=gh(e,t,""+e[t])}}function ig(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=cg(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}var vh=/[\n"\\]/g;function kt(e){return e.replace(vh,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Gr(e,t,n,o,a,l,c,i){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+nt(t)):e.value!==""+nt(t)&&(e.value=""+nt(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?c==="number"&&e.value==t?ar(e,nt(e.value)):ar(e,nt(t)):n!=null?ar(e,nt(n)):o!=null&&e.removeAttribute("value"),a==null&&l!=null&&(e.defaultChecked=!!l),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"?e.name=""+nt(i):e.removeAttribute("name")}function rg(e,t,n,o,a,l,c,i){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),t!=null||n!=null){if(!(l!=="submit"&&l!=="reset"||t!=null)){Yr(e);return}n=n!=null?""+nt(n):"",t=t!=null?""+nt(t):n,i||t===e.value||(e.value=t),e.defaultValue=t}o=o??a,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=i?e.checked:!!o,e.defaultChecked=!!o,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),Yr(e)}function ar(e,t){e.defaultValue!==""+t&&(e.defaultValue=""+t)}function ea(e,t,n,o){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&o&&(e[n].defaultSelected=!0)}else{for(n=""+nt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function ug(e,t,n){if(t!=null&&(t=""+nt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+nt(n):""}function dg(e,t,n,o){if(t==null){if(o!=null){if(n!=null)throw Error(y(92));if(Ga(o)){if(1<o.length)throw Error(y(93));o=o[0]}n=o}n==null&&(n=""),t=n}n=nt(t),e.defaultValue=n,o=e.textContent,o===n&&o!==""&&o!==null&&(e.value=o),Yr(e)}function sa(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var mh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function bf(e,t,n){var o=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,n):typeof n!="number"||n===0||mh.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function sg(e,t,n){if(t!=null&&typeof t!="object")throw Error(y(62));if(e=e.style,n!=null){for(var o in n)!n.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="",L=!0);for(var a in t)o=t[a],t.hasOwnProperty(a)&&n[a]!==o&&(bf(e,a,o),L=!0)}else for(var l in t)t.hasOwnProperty(l)&&bf(e,l,t[l])}function Zu(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ph=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),hh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function bc(e){return hh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Gt(){}var Vr=null;function Ku(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Xo=null,ta=null;function gf(e){var t=Ta(e);if(t&&(e=t.stateNode)){var n=e[Pe]||null;e:switch(e=t.stateNode,t.type){case"input":if(Gr(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+kt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=o[Pe]||null;if(!a)throw Error(y(90));Gr(o,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)o=n[t],o.form===e.form&&ig(o)}break e;case"textarea":ug(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&ea(e,!!n.multiple,t,!1)}}}var lr=!1;function fg(e,t,n){if(lr)return e(t,n);lr=!0;try{var o=e(t);return o}finally{if(lr=!1,(Xo!==null||ta!==null)&&(ki(),Xo&&(t=Xo,e=ta,ta=Xo=null,gf(t),e)))for(t=0;t<e.length;t++)gf(e[t])}}function cl(e,t){var n=e.stateNode;if(n===null)return null;var o=n[Pe]||null;if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(y(231,t,typeof n));return n}var ln=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Xr=!1;if(ln)try{Ro={},Object.defineProperty(Ro,"passive",{get:function(){Xr=!0}}),window.addEventListener("test",Ro,Ro),window.removeEventListener("test",Ro,Ro)}catch{Xr=!1}var Ro,Nn=null,Ju=null,gc=null;function bg(){if(gc)return gc;var e,t=Ju,n=t.length,o,a="value"in Nn?Nn.value:Nn.textContent,l=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===a[l-o];o++);return gc=a.slice(e,1<o?1-o:void 0)}function vc(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Fl(){return!0}function vf(){return!1}function Qe(e){function t(n,o,a,l,c){this._reactName=n,this._targetInst=a,this.type=o,this.nativeEvent=l,this.target=c,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Fl:vf,this.isPropagationStopped=vf,this}return W(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Fl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Fl)},persist:function(){},isPersistent:Fl}),t}var Kn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ri=Qe(Kn),zl=W({},Kn,{view:0,detail:0}),yh=Qe(zl),cr,ir,Ua,ui=W({},zl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:$u,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ua&&(Ua&&e.type==="mousemove"?(cr=e.screenX-Ua.screenX,ir=e.screenY-Ua.screenY):ir=cr=0,Ua=e),cr)},movementY:function(e){return"movementY"in e?e.movementY:ir}}),mf=Qe(ui),xh=W({},ui,{dataTransfer:0}),kh=Qe(xh),Sh=W({},zl,{relatedTarget:0}),rr=Qe(Sh),Th=W({},Kn,{animationName:0,elapsedTime:0,pseudoElement:0}),wh=Qe(Th),Eh=W({},Kn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),zh=Qe(Eh),Nh=W({},Kn,{data:0}),pf=Qe(Nh),Oh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ah={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},_h={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Mh(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=_h[e])?!!t[e]:!1}function $u(){return Mh}var Ch=W({},zl,{key:function(e){if(e.key){var t=Oh[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=vc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ah[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:$u,charCode:function(e){return e.type==="keypress"?vc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?vc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Hh=Qe(Ch),Dh=W({},ui,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hf=Qe(Dh),Rh=W({},Kn,{submitter:0}),Uh=Qe(Rh),Bh=W({},zl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:$u}),qh=Qe(Bh),jh=W({},Kn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Lh=Qe(jh),Yh=W({},ui,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Gh=Qe(Yh),Vh=W({},Kn,{newState:0,oldState:0,source:0}),Xh=Qe(Vh),Qh=[9,13,27,32],Fu=ln&&"CompositionEvent"in window,Za=null;ln&&"documentMode"in document&&(Za=document.documentMode);var Zh=ln&&"TextEvent"in window&&!Za,gg=ln&&(!Fu||Za&&8<Za&&11>=Za),yf=" ",xf=!1;function vg(e,t){switch(e){case"keyup":return Qh.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function mg(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Qo=!1;function Kh(e,t){switch(e){case"compositionend":return mg(t);case"keypress":return t.which!==32?null:(xf=!0,yf);case"textInput":return e=t.data,e===yf&&xf?null:e;default:return null}}function Jh(e,t){if(Qo)return e==="compositionend"||!Fu&&vg(e,t)?(e=bg(),gc=Ju=Nn=null,Qo=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return gg&&t.locale!=="ko"?null:t.data;default:return null}}var $h={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function kf(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!$h[e.type]:t==="textarea"}function pg(e,t,n,o){Xo?ta?ta.push(o):ta=[o]:Xo=o,t=oi(t,"onChange"),0<t.length&&(n=new ri("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var Ka=null,il=null;function Fh(e){fm(e,0)}function di(e){var t=Va(e);if(ig(t))return e}function Sf(e,t){if(e==="change")return t}var hg=!1;ln&&(ln?(Il="oninput"in document,Il||(ur=document.createElement("div"),ur.setAttribute("oninput","return;"),Il=typeof ur.oninput=="function"),Wl=Il):Wl=!1,hg=Wl&&(!document.documentMode||9<document.documentMode));var Wl,Il,ur;function Tf(){Ka&&(Ka.detachEvent("onpropertychange",yg),il=Ka=null)}function yg(e){if(e.propertyName==="value"&&di(il)){var t=[];pg(t,il,e,Ku(e)),fg(Fh,t)}}function Wh(e,t,n){e==="focusin"?(Tf(),Ka=t,il=n,Ka.attachEvent("onpropertychange",yg)):e==="focusout"&&Tf()}function Ih(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return di(il)}function Ph(e,t){if(e==="click")return di(t)}function e0(e,t){if(e==="input"||e==="change")return di(t)}function t0(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var dt=typeof Object.is=="function"?Object.is:t0;function rl(e,t){if(dt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var a=n[o];if(!Lr.call(t,a)||!dt(e[a],t[a]))return!1}return!0}function Qr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function wf(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ef(e,t){var n=wf(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=wf(n)}}function xg(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?xg(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function kg(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Qr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Qr(e.document)}return t}function Wu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var n0=ln&&"documentMode"in document&&11>=document.documentMode,Zo=null,Zr=null,Ja=null,Kr=!1;function zf(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Kr||Zo==null||Zo!==Qr(o)||(o=Zo,"selectionStart"in o&&Wu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),Ja&&rl(Ja,o)||(Ja=o,o=oi(Zr,"onSelect"),0<o.length&&(t=new ri("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=Zo)))}function Pn(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ko={animationend:Pn("Animation","AnimationEnd"),animationiteration:Pn("Animation","AnimationIteration"),animationstart:Pn("Animation","AnimationStart"),transitionrun:Pn("Transition","TransitionRun"),transitionstart:Pn("Transition","TransitionStart"),transitioncancel:Pn("Transition","TransitionCancel"),transitionend:Pn("Transition","TransitionEnd")},dr={},Sg={};ln&&(Sg=document.createElement("div").style,"AnimationEvent"in window||(delete Ko.animationend.animation,delete Ko.animationiteration.animation,delete Ko.animationstart.animation),"TransitionEvent"in window||delete Ko.transitionend.transition);function So(e){if(dr[e])return dr[e];if(!Ko[e])return e;var t=Ko[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Sg)return dr[e]=t[n];return e}var Tg=So("animationend"),wg=So("animationiteration"),Eg=So("animationstart"),o0=So("transitionrun"),a0=So("transitionstart"),l0=So("transitioncancel"),zg=So("transitionend"),Ng=new Map,Jr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Jr.push("scrollEnd");function Ht(e,t){Ng.set(e,t),ko(t,[e])}var c0=0;function cn(e,t){if(e.name!=null&&e.name!=="auto")return e.name;if(t.autoName!==null)return t.autoName;e=Ct.identifierPrefix;var n=c0++;return e="_"+e+"t_"+n.toString(32)+"_",t.autoName=e}function Nf(e){if(e==null||typeof e=="string")return e;var t=null,n=ra;if(n!==null)for(var o=0;o<n.length;o++){var a=e[n[o]];if(a!=null){if(a==="none")return"none";t=t==null?a:t+(" "+a)}}return t??e.default}function bn(e,t){return e=Nf(e),t=Nf(t),t==null?e==="auto"?null:e:t==="auto"?null:t}var Uc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ht=[],Jo=0,Iu=0;function si(){for(var e=Jo,t=Iu=Jo=0;t<e;){var n=ht[t];ht[t++]=null;var o=ht[t];ht[t++]=null;var a=ht[t];ht[t++]=null;var l=ht[t];if(ht[t++]=null,o!==null&&a!==null){var c=o.pending;c===null?a.next=a:(a.next=c.next,c.next=a),o.pending=a}l!==0&&Og(n,a,l)}}function fi(e,t,n,o){ht[Jo++]=e,ht[Jo++]=t,ht[Jo++]=n,ht[Jo++]=o,Iu|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function Pu(e,t,n,o){return fi(e,t,n,o),Bc(e)}function To(e,t){return fi(e,null,null,t),Bc(e)}function Og(e,t,n){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n);for(var a=!1,l=e.return;l!==null;)l.childLanes|=n,o=l.alternate,o!==null&&(o.childLanes|=n),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(a=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,a&&t!==null&&(a=31-rt(n),e=l.hiddenUpdates,o=e[a],o===null?e[a]=[t]:o.push(t),t.lane=n|536870912),l):null}function Bc(e){if(50<al)throw al=0,Ec=null,Error(y(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var $o={};function i0(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Fe(e,t,n,o){return new i0(e,t,n,o)}function ed(e){return e=e.prototype,!(!e||!e.isReactComponent)}function on(e,t){var n=e.alternate;return n===null?(n=Fe(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Ag(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function mc(e,t,n,o,a,l){var c=0;if(o=e,typeof o=="function")ed(o)&&(c=1);else if(typeof o=="string")c=Hy(e,n,Qt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(o){case Rr:return e=Fe(31,n,t,a),e.elementType=Rr,e.lanes=l,e;case Go:return io(n.children,a,l,t);case Zb:c=8,a|=24;break;case Cr:return e=Fe(12,n,t,a|2),e.elementType=Cr,e.lanes=l,e;case Hr:return e=Fe(13,n,t,a),e.elementType=Hr,e.lanes=l,e;case Dr:return e=Fe(19,n,t,a),e.elementType=Dr,e.lanes=l,e;case Jp:case Ur:return e=a|32,e=Fe(30,n,t,e),e.elementType=Ur,e.lanes=l,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case Yt:c=10;break e;case Kb:c=9;break e;case Yu:c=11;break e;case Gu:c=14;break e;case Tn:c=16,o=null;break e}c=29,n=Error(y(130,e===null?"null":typeof e,"")),o=null}return t=Fe(c,n,t,a),t.elementType=e,t.type=o,t.lanes=l,t}function io(e,t,n,o){return e=Fe(7,e,o,t),e.lanes=n,e}function sr(e,t,n){return e=Fe(6,e,null,t),e.lanes=n,e}function _g(e){var t=Fe(18,null,null,0);return t.stateNode=e,t}function fr(e,t,n){return t=Fe(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Of=new WeakMap;function St(e,t){if(typeof e=="object"&&e!==null){var n=Of.get(e);return n!==void 0?n:(t={value:e,source:t,stack:lf(t)},Of.set(e,t),t)}return{value:e,source:t,stack:lf(t)}}var Fo=[],Wo=0,qc=null,ul=0,yt=[],xt=0,Gn=null,Vt=1,Xt="";function tn(e,t){Fo[Wo++]=ul,Fo[Wo++]=qc,qc=e,ul=t}function Mg(e,t,n){yt[xt++]=Vt,yt[xt++]=Xt,yt[xt++]=Gn,Gn=e;var o=Vt;e=Xt;var a=32-rt(o)-1;o&=~(1<<a),n+=1;var l=32-rt(t)+a;if(30<l){var c=a-a%5;l=(o&(1<<c)-1).toString(32),o>>=c,a-=c,Vt=1<<32-rt(t)+a|n<<a|o,Xt=l+e}else Vt=1<<l|n<<a|o,Xt=e}function bi(e){e.return!==null&&(tn(e,1),Mg(e,1,0))}function td(e){for(;e===qc;)qc=Fo[--Wo],Fo[Wo]=null,ul=Fo[--Wo],Fo[Wo]=null;for(;e===Gn;)Gn=yt[--xt],yt[xt]=null,Xt=yt[--xt],yt[xt]=null,Vt=yt[--xt],yt[xt]=null}function Cg(e,t){yt[xt++]=Vt,yt[xt++]=Xt,yt[xt++]=Gn,Vt=t.id,Xt=t.overflow,Gn=e}var ze=null,te=null,U=!1,Hn=null,Tt=!1,$r=Error(y(519));function Vn(e){var t=Error(y(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw dl(St(t,e)),$r}function Af(e){var t=e.stateNode,n=e.type,o=e.memoizedProps;switch(t[_e]=e,t[Pe]=o,n){case"dialog":B("cancel",t),B("close",t);break;case"iframe":case"object":case"embed":B("load",t);break;case"video":case"audio":for(n=0;n<gl.length;n++)B(gl[n],t);break;case"source":B("error",t);break;case"img":case"image":case"link":B("error",t),B("load",t);break;case"details":B("toggle",t);break;case"input":B("invalid",t),rg(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":B("invalid",t);break;case"textarea":B("invalid",t),dg(t,o.value,o.defaultValue,o.children)}n=o.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||o.suppressHydrationWarning===!0||gm(t.textContent,n)?(o.popover!=null&&(B("beforetoggle",t),B("toggle",t)),o.onScroll!=null&&B("scroll",t),o.onScrollEnd!=null&&B("scrollend",t),o.onClick!=null&&(t.onclick=Gt),t=!0):t=!1,t||Vn(e,!0)}function jc(e){for(ze=e.return;ze;)switch(ze.tag){case 5:case 31:case 13:Tt=!1;return;case 27:case 3:Tt=!0;return;default:ze=ze.return}}function Uo(e){if(e!==ze)return!1;if(!U)return jc(e),U=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Hu(e.type,e.memoizedProps)),n=!n),n&&te&&Vn(e),jc(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));te=Eb(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));te=Eb(e)}else t===27?(t=te,Jn(e.type)?(e=Bu,Bu=null,te=e):te=t):te=ze?wt(e.stateNode.nextSibling):null;return!0}function fo(){te=ze=null,U=!1}function br(){var e=Hn;return e!==null&&(Je===null?Je=e:Je.push.apply(Je,e),Hn=null),e}function dl(e){Hn===null?Hn=[e]:Hn.push(e)}var Fr=Jt(null),wo=null,nn=null;function On(e,t,n){ne(Fr,t._currentValue),t._currentValue=n}function an(e){e._currentValue=Fr.current,Ce(Fr)}function pc(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Wr(e,t,n,o){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var l=a.dependencies;if(l!==null){var c=a.child;l=l.firstContext;e:for(;l!==null;){var i=l;l=a;for(var r=0;r<t.length;r++)if(i.context===t[r]){l.lanes|=n,i=l.alternate,i!==null&&(i.lanes|=n),pc(l.return,n,e),o||(c=null);break e}l=i.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(y(341));c.lanes|=n,l=c.alternate,l!==null&&(l.lanes|=n),pc(c,n,e),c=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),pc(a.return,n,e),c=a.child,c=c!==null?c.sibling:null):c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function bo(e,t,n,o){e=null;for(var a=t,l=!1;a!==null;){if(!l){if((a.flags&524288)!==0)l=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(y(387));if(c=c.memoizedProps,c!==null){var i=a.type;dt(a.pendingProps.value,c.value)||(e!==null?e.push(i):e=[i])}}else if(a===Mc.current){if(c=a.alternate,c===null)throw Error(y(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(ya):e=[ya])}a=a.return}return e!==null&&Wr(t,e,n,o),t.flags|=262144,e!==null}function Lc(e){for(e=e.firstContext;e!==null;){if(!dt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function go(e){wo=e,nn=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Me(e){return Hg(wo,e)}function Pl(e,t){return wo===null&&go(e),Hg(e,t)}function Hg(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},nn===null){if(e===null)throw Error(y(308));nn=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else nn=nn.next=t;return n}var r0=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},u0=Se.unstable_scheduleCallback,d0=Se.unstable_NormalPriority,ve={$$typeof:Yt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function nd(){return{controller:new r0,data:new Map,refCount:0}}function Nl(e){e.refCount--,e.refCount===0&&u0(d0,function(){e.controller.abort()})}function _f(e,t){if((e.pendingLanes&4194048)!==0){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var o=t[e];n.indexOf(o)===-1&&n.push(o)}}}var Xa=null;function s0(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var $a=null,Ir=0,vo=0,na=null;function f0(e,t){if($a===null){var n=$a=[];Ir=0,vo=_d(),na={status:"pending",value:void 0,then:function(o){n.push(o)}}}return Ir++,t.then(Mf,Mf),t}function Mf(){if(--Ir===0&&(Xa=null,$a!==null)){na!==null&&(na.status="fulfilled");var e=$a;$a=null,vo=0,na=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function b0(e,t){var n=[],o={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(o.status="rejected",o.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),o}var Cf=M.S;M.S=function(e,t){if(Wv=ct(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&f0(e,t),Xa!==null)for(var n=ma;n!==null;)_f(n,Xa),n=n.next;if(n=e.types,n!==null){for(var o=ma;o!==null;)_f(o,n),o=o.next;if(vo!==0){o=Xa,o===null&&(o=Xa=[]);for(var a=0;a<n.length;a++){var l=n[a];o.indexOf(l)===-1&&o.push(l)}}}Cf!==null&&Cf(e,t)};var ro=Jt(null);function od(){var e=ro.current;return e!==null?e:F.pooledCache}function hc(e,t){t===null?ne(ro,ro.current):ne(ro,t.pool)}function Dg(){var e=od();return e===null?null:{parent:ve._currentValue,pool:e}}var wa=Error(y(460)),ad=Error(y(474)),gi=Error(y(542)),Yc={then:function(){}};function Hf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Rg(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Gt,Gt),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Rf(e),e===void 0&&!("reason"in t)?Error(y(600)):e;default:if(typeof t.status=="string")t.then(Gt,Gt);else{if(e=F,e!==null&&100<e.shellSuspendCounter)throw Error(y(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=o}},function(o){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Rf(e),e}throw uo=t,wa}}function no(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(uo=n,wa):n}}var uo=null;function Df(){if(uo===null)throw Error(y(459));var e=uo;return uo=null,e}function Rf(e){if(e===wa||e===gi)throw Error(y(483))}var oa=null,sl=0;function ec(e){var t=sl;return sl+=1,oa===null&&(oa=[]),Rg(oa,e,t)}function xn(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function tc(e,t){throw t.$$typeof===Kp?Error(y(525)):(e=Object.prototype.toString.call(t),Error(y(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Ug(e){function t(s,u){if(e){var f=s.deletions;f===null?(s.deletions=[u],s.flags|=16):f.push(u)}}function n(s,u){if(!e)return null;for(;u!==null;)t(s,u),u=u.sibling;return null}function o(s){for(var u=new Map;s!==null;)s.key===null?u.set(s.index,s):u.set(s.key,s),s=s.sibling;return u}function a(s,u){return s=on(s,u),s.index=0,s.sibling=null,s}function l(s,u,f){return s.index=f,e?(f=s.alternate,f!==null?(f=f.index,f<u?(s.flags|=2,u):f):(s.flags|=134217730,u)):(s.flags|=1048576,u)}function c(s){return e&&s.alternate===null&&(s.flags|=134217730),s}function i(s,u,f,m){return u===null||u.tag!==6?(u=sr(f,s.mode,m),u.return=s,u):(u=a(u,f),u.return=s,u)}function r(s,u,f,m){var h=f.type;return h===Go?(s=v(s,u,f.props.children,m,f.key),xn(s,f),s):u!==null&&(u.elementType===h||typeof h=="object"&&h!==null&&h.$$typeof===Tn&&no(h)===u.type)?(u=a(u,f.props),xn(u,f),u.return=s,u):(u=mc(f.type,f.key,f.props,null,s.mode,m),xn(u,f),u.return=s,u)}function d(s,u,f,m){return u===null||u.tag!==4||u.stateNode.containerInfo!==f.containerInfo||u.stateNode.implementation!==f.implementation?(u=fr(f,s.mode,m),u.return=s,u):(u=a(u,f.children||[]),u.return=s,u)}function v(s,u,f,m,h){return u===null||u.tag!==7?(u=io(f,s.mode,m,h),u.return=s,u):(u=a(u,f),u.return=s,u)}function p(s,u,f){if(typeof u=="string"&&u!==""||typeof u=="number"||typeof u=="bigint")return u=sr(""+u,s.mode,f),u.return=s,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Ql:return f=mc(u.type,u.key,u.props,null,s.mode,f),xn(f,u),f.return=s,f;case Ya:return u=fr(u,s.mode,f),u.return=s,u;case Tn:return u=no(u),p(s,u,f)}if(Ga(u)||Ra(u))return u=io(u,s.mode,f,null),u.return=s,u;if(typeof u.then=="function")return p(s,ec(u),f);if(u.$$typeof===Yt)return p(s,Pl(s,u),f);tc(s,u)}return null}function b(s,u,f,m){var h=u!==null?u.key:null;if(typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint")return h!==null?null:i(s,u,""+f,m);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Ql:return f.key===h?r(s,u,f,m):null;case Ya:return f.key===h?d(s,u,f,m):null;case Tn:return f=no(f),b(s,u,f,m)}if(Ga(f)||Ra(f))return h!==null?null:v(s,u,f,m,null);if(typeof f.then=="function")return b(s,u,ec(f),m);if(f.$$typeof===Yt)return b(s,u,Pl(s,f),m);tc(s,f)}return null}function g(s,u,f,m,h){if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return s=s.get(f)||null,i(u,s,""+m,h);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Ql:return s=s.get(m.key===null?f:m.key)||null,r(u,s,m,h);case Ya:return s=s.get(m.key===null?f:m.key)||null,d(u,s,m,h);case Tn:return m=no(m),g(s,u,f,m,h)}if(Ga(m)||Ra(m))return s=s.get(f)||null,v(u,s,m,h,null);if(typeof m.then=="function")return g(s,u,f,ec(m),h);if(m.$$typeof===Yt)return g(s,u,f,Pl(u,m),h);tc(u,m)}return null}function x(s,u,f,m){for(var h=null,w=null,T=u,E=u=0,C=null;T!==null&&E<f.length;E++){T.index>E?(C=T,T=null):C=T.sibling;var _=b(s,T,f[E],m);if(_===null){T===null&&(T=C);break}e&&T&&_.alternate===null&&t(s,T),u=l(_,u,E),w===null?h=_:w.sibling=_,w=_,T=C}if(E===f.length)return n(s,T),U&&tn(s,E),h;if(T===null){for(;E<f.length;E++)T=p(s,f[E],m),T!==null&&(u=l(T,u,E),w===null?h=T:w.sibling=T,w=T);return U&&tn(s,E),h}for(T=o(T);E<f.length;E++)C=g(T,s,E,f[E],m),C!==null&&(e&&(_=C.alternate,_!==null&&T.delete(_.key===null?E:_.key)),u=l(C,u,E),w===null?h=C:w.sibling=C,w=C);return e&&T.forEach(function(Y){return t(s,Y)}),U&&tn(s,E),h}function k(s,u,f,m){if(f==null)throw Error(y(151));for(var h=null,w=null,T=u,E=u=0,C=null,_=f.next();T!==null&&!_.done;E++,_=f.next()){T.index>E?(C=T,T=null):C=T.sibling;var Y=b(s,T,_.value,m);if(Y===null){T===null&&(T=C);break}e&&T&&Y.alternate===null&&t(s,T),u=l(Y,u,E),w===null?h=Y:w.sibling=Y,w=Y,T=C}if(_.done)return n(s,T),U&&tn(s,E),h;if(T===null){for(;!_.done;E++,_=f.next())_=p(s,_.value,m),_!==null&&(u=l(_,u,E),w===null?h=_:w.sibling=_,w=_);return U&&tn(s,E),h}for(T=o(T);!_.done;E++,_=f.next())_=g(T,s,E,_.value,m),_!==null&&(e&&(C=_.alternate,C!==null&&T.delete(C.key===null?E:C.key)),u=l(_,u,E),w===null?h=_:w.sibling=_,w=_);return e&&T.forEach(function(pe){return t(s,pe)}),U&&tn(s,E),h}function z(s,u,f,m){if(typeof f=="object"&&f!==null&&f.type===Go&&f.key===null&&f.props.ref===void 0&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case Ql:e:{for(var h=f.key;u!==null;){if(u.key===h){if(h=f.type,h===Go){if(u.tag===7){n(s,u.sibling),m=a(u,f.props.children),xn(m,f),m.return=s,s=m;break e}}else if(u.elementType===h||typeof h=="object"&&h!==null&&h.$$typeof===Tn&&no(h)===u.type){n(s,u.sibling),m=a(u,f.props),xn(m,f),m.return=s,s=m;break e}n(s,u);break}else t(s,u);u=u.sibling}f.type===Go?(m=io(f.props.children,s.mode,m,f.key),xn(m,f),m.return=s,s=m):(m=mc(f.type,f.key,f.props,null,s.mode,m),xn(m,f),m.return=s,s=m)}return c(s);case Ya:e:{for(h=f.key;u!==null;){if(u.key===h)if(u.tag===4&&u.stateNode.containerInfo===f.containerInfo&&u.stateNode.implementation===f.implementation){n(s,u.sibling),m=a(u,f.children||[]),m.return=s,s=m;break e}else{n(s,u);break}else t(s,u);u=u.sibling}m=fr(f,s.mode,m),m.return=s,s=m}return c(s);case Tn:return f=no(f),z(s,u,f,m)}if(Ga(f))return x(s,u,f,m);if(Ra(f)){if(h=Ra(f),typeof h!="function")throw Error(y(150));return f=h.call(f),k(s,u,f,m)}if(typeof f.then=="function")return z(s,u,ec(f),m);if(f.$$typeof===Yt)return z(s,u,Pl(s,f),m);tc(s,f)}return typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint"?(f=""+f,u!==null&&u.tag===6?(n(s,u.sibling),m=a(u,f),m.return=s,s=m):(n(s,u),m=sr(f,s.mode,m),m.return=s,s=m),c(s)):n(s,u)}return function(s,u,f,m){try{sl=0;var h=z(s,u,f,m);return oa=null,h}catch(T){if(T===wa||T===gi)throw T;var w=Fe(29,T,null,s.mode);return w.lanes=m,w.return=s,w}}}var mo=Ug(!0),Bg=Ug(!1),wn=!1;function ld(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Pr(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Dn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Rn(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(G&2)!==0){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,t=Bc(e),Og(e,null,n),t}return fi(e,o,t,n),Bc(e)}function Fa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,eg(e,n)}}function gr(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var a=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};l===null?a=l=c:l=l.next=c,n=n.next}while(n!==null);l===null?a=l=t:l=l.next=t}else a=l=t;n={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:l,shared:o.shared,callbacks:o.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var eu=!1;function Wa(){if(eu){var e=na;if(e!==null)throw e}}function Ia(e,t,n,o){eu=!1;var a=e.updateQueue;wn=!1;var l=a.firstBaseUpdate,c=a.lastBaseUpdate,i=a.shared.pending;if(i!==null){a.shared.pending=null;var r=i,d=r.next;r.next=null,c===null?l=d:c.next=d,c=r;var v=e.alternate;v!==null&&(v=v.updateQueue,i=v.lastBaseUpdate,i!==c&&(i===null?v.firstBaseUpdate=d:i.next=d,v.lastBaseUpdate=r))}if(l!==null){var p=a.baseState;c=0,v=d=r=null,i=l;do{var b=i.lane&-536870913,g=b!==i.lane;if(g?(j&b)===b:(o&b)===b){b!==0&&b===vo&&(eu=!0),v!==null&&(v=v.next={lane:0,tag:i.tag,payload:i.payload,callback:null,next:null});e:{var x=e,k=i;b=t;var z=n;switch(k.tag){case 1:if(x=k.payload,typeof x=="function"){p=x.call(z,p,b);break e}p=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=k.payload,b=typeof x=="function"?x.call(z,p,b):x,b==null)break e;p=W({},p,b);break e;case 2:wn=!0}}b=i.callback,b!==null&&(e.flags|=64,g&&(e.flags|=8192),g=a.callbacks,g===null?a.callbacks=[b]:g.push(b))}else g={lane:b,tag:i.tag,payload:i.payload,callback:i.callback,next:null},v===null?(d=v=g,r=p):v=v.next=g,c|=b;if(i=i.next,i===null){if(i=a.shared.pending,i===null)break;g=i,i=g.next,g.next=null,a.lastBaseUpdate=g,a.shared.pending=null}}while(!0);v===null&&(r=p),a.baseState=r,a.firstBaseUpdate=d,a.lastBaseUpdate=v,l===null&&(a.shared.lanes=0),Zn|=c,e.lanes=c,e.memoizedState=p}}function qg(e,t){if(typeof e!="function")throw Error(y(191,e));e.call(t)}function jg(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)qg(n[e],t)}var Xn=Jt(null),Gc=Jt(0);function Uf(e,t){e=sn,ne(Gc,e),ne(Xn,t),sn=e|t.baseLanes}function tu(){ne(Gc,sn),ne(Xn,Xn.current)}function cd(){sn=Gc.current,Ce(Xn),Ce(Gc)}var Re=Jt(null),Le=null;function Un(e){var t=e.alternate;ne(He,He.current&1),ne(Re,e),Le===null&&(t===null||Xn.current!==null||t.memoizedState!==null)&&(Le=e)}function nu(e){ne(He,He.current),ne(Re,e),Le===null&&(Le=e)}function Lg(e){e.tag===22?(ne(He,He.current),ne(Re,e),Le===null&&(Le=e)):Bn()}function Bn(){ne(He,He.current),ne(Re,Re.current)}function ot(e){Ce(Re),Le===e&&(Le=null),Ce(He)}var He=Jt(0);function fl(e,t){ne(Re,Re.current),ne(He,t)}function id(e){Ce(He),Ce(Re),Le===e&&(Le=null)}function Vc(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Uu(n)||Dd(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!=="independent"){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var rn=0,R=null,$=null,ge=null,Xc=!1,aa=!1,po=!1,Qc=0,bl=0,la=null,g0=0;function de(){throw Error(y(321))}function rd(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!dt(e[n],t[n]))return!1;return!0}function ud(e,t,n,o,a,l){return rn=l,R=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,M.H=e===null||e.memoizedState===null?pv:hv,po=!1,l=n(o,a),po=!1,aa&&(l=Gg(t,n,o,a)),Yg(e),l}function Yg(e){M.H=Zc;var t=$!==null&&$.next!==null;if(rn=0,ge=$=R=null,Xc=!1,bl=0,la=null,t)throw Error(y(300));e===null||me||(e=e.dependencies,e!==null&&Lc(e)&&(me=!0))}function Gg(e,t,n,o){R=e;var a=0;do{if(aa&&(la=null),bl=0,aa=!1,25<=a)throw Error(y(301));if(a+=1,ge=$=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}M.H=S0,l=t(n,o)}while(aa);return l}function v0(){var e=M.H,t=e.useState()[0];return t=typeof t.then=="function"?Ol(t):t,e=e.useState()[0],($!==null?$.memoizedState:null)!==e&&(R.flags|=1024),t}function dd(){var e=Qc!==0;return Qc=0,e}function sd(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function fd(e){if(Xc){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Xc=!1}rn=0,ge=$=R=null,aa=!1,bl=Qc=0,la=null}function Xe(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ge===null?R.memoizedState=ge=e:ge=ge.next=e,ge}function fe(){if($===null){var e=R.alternate;e=e!==null?e.memoizedState:null}else e=$.next;var t=ge===null?R.memoizedState:ge.next;if(t!==null)ge=t,$=e;else{if(e===null)throw R.alternate===null?Error(y(467)):Error(y(310));$=e,e={memoizedState:$.memoizedState,baseState:$.baseState,baseQueue:$.baseQueue,queue:$.queue,next:null},ge===null?R.memoizedState=ge=e:ge=ge.next=e}return ge}function vi(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ol(e){var t=bl;return bl+=1,la===null&&(la=[]),e=Rg(la,e,t),t=R,(ge===null?t.memoizedState:ge.next)===null&&(t=t.alternate,M.H=t===null||t.memoizedState===null?pv:hv),e}function mi(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ol(e);if(e.$$typeof===Fp)return;if(e.$$typeof===Yt)return Me(e)}throw Error(y(438,String(e)))}function bd(e){var t=null,n=R.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var o=R.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=vi(),R.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),o=0;o<e;o++)n[o]=$p;return t.index++,n}function un(e,t){return typeof t=="function"?t(e):t}function yc(e){var t=fe();return gd(t,$,e)}function gd(e,t,n){var o=e.queue;if(o===null)throw Error(y(311));o.lastRenderedReducer=n;var a=e.baseQueue,l=o.pending;if(l!==null){if(a!==null){var c=a.next;a.next=l.next,l.next=c}t.baseQueue=a=l,o.pending=null}if(l=e.baseState,a===null)e.memoizedState=l;else{t=a.next;var i=c=null,r=null,d=t,v=!1;do{var p=d.lane&-536870913;if(p!==d.lane?(j&p)===p:(rn&p)===p){var b=d.revertLane;if(b===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),p===vo&&(v=!0);else if((rn&b)===b){d=d.next,b===vo&&(v=!0);continue}else p={lane:0,revertLane:d.revertLane,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=p,c=l):r=r.next=p,R.lanes|=b,Zn|=b;p=d.action,po&&n(l,p),l=d.hasEagerState?d.eagerState:n(l,p)}else b={lane:p,revertLane:d.revertLane,gesture:d.gesture,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=b,c=l):r=r.next=b,R.lanes|=p,Zn|=p;d=d.next}while(d!==null&&d!==t);if(r===null?c=l:r.next=i,!dt(l,e.memoizedState)&&(me=!0,v&&(n=na,n!==null)))throw n;e.memoizedState=l,e.baseState=c,e.baseQueue=r,o.lastRenderedState=l}return a===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function vr(e){var t=fe(),n=t.queue;if(n===null)throw Error(y(311));n.lastRenderedReducer=e;var o=n.dispatch,a=n.pending,l=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do l=e(l,c.action),c=c.next;while(c!==a);dt(l,t.memoizedState)||(me=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,o]}function Vg(e,t,n){var o=R,a=fe(),l=U;if(l){if(n===void 0)throw Error(y(407));n=n()}else n=t();var c=!dt(($||a).memoizedState,n);if(c&&(a.memoizedState=n,me=!0),a=a.queue,vd(Zg.bind(null,o,a,e),[e]),e=a.getSnapshot!==t||c||ge!==null&&(ge.memoizedState.tag&1)!==0,fa(e?9:8,{destroy:void 0},Qg.bind(null,o,a,n,t),null),e){if(o.flags|=2048,F===null)throw Error(y(349));l||(rn&127)!==0||Xg(o,t,n)}return n}function Xg(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=R.updateQueue,t===null?(t=vi(),R.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Qg(e,t,n,o){t.value=n,t.getSnapshot=o,Kg(t)&&Jg(e)}function Zg(e,t,n){return n(function(){Kg(t)&&Jg(e)})}function Kg(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!dt(e,n)}catch{return!0}}function Jg(e){var t=To(e,2);t!==null&&We(t,e,2)}function ou(e){var t=Xe();if(typeof e=="function"){var n=e;if(e=n(),po){zn(!0);try{n()}finally{zn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:un,lastRenderedState:e},t}function $g(e,t,n,o){return e.baseState=n,gd(e,$,typeof o=="function"?o:un)}function m0(e,t,n,o,a){if(hi(e))throw Error(y(485));if(e=t.action,e!==null){var l={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){l.listeners.push(c)}};M.T!==null?n(!0):l.isTransition=!1,o(l),n=t.pending,n===null?(l.next=t.pending=l,Fg(t,l)):(l.next=n.next,t.pending=n.next=l)}}function Fg(e,t){var n=t.action,o=t.payload,a=e.state;if(t.isTransition){var l=M.T,c={};c.types=l!==null?l.types:null,M.T=c;try{var i=n(a,o),r=M.S;r!==null&&r(c,i),Bf(e,t,i)}catch(d){au(e,t,d)}finally{l!==null&&c.types!==null&&(l.types=c.types),M.T=l}}else try{l=n(a,o),Bf(e,t,l)}catch(d){au(e,t,d)}}function Bf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(o){qf(e,t,o)},function(o){return au(e,t,o)}):qf(e,t,n)}function qf(e,t,n){t.status="fulfilled",t.value=n,Wg(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Fg(e,n)))}function au(e,t,n){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=n,Wg(t),t=t.next;while(t!==o)}e.action=null}function Wg(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Ig(e,t){return t}function jf(e,t){if(U){var n=F.formState;if(n!==null){e:{var o=R;if(U){if(te){t:{for(var a=te,l=Tt;a.nodeType!==8;){if(!l){a=null;break t}if(a=wt(a.nextSibling),a===null){a=null;break t}}l=a.data,a=l==="F!"||l==="F"?a:null}if(a){te=wt(a.nextSibling),o=a.data==="F!";break e}}Vn(o)}o=!1}o&&(t=n[0])}}return n=Xe(),n.memoizedState=n.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ig,lastRenderedState:t},n.queue=o,n=gv.bind(null,R,o),o.dispatch=n,o=ou(!1),l=yd.bind(null,R,!1,o.queue),o=Xe(),a={state:t,dispatch:null,action:e,pending:null},o.queue=a,n=m0.bind(null,R,a,l,n),a.dispatch=n,o.memoizedState=e,[t,n,!1]}function Lf(e){var t=fe();return Pg(t,$,e)}function Pg(e,t,n){if(t=gd(e,t,Ig)[0],e=yc(un)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=Ol(t)}catch(c){throw c===wa?gi:c}else o=t;t=fe();var a=t.queue,l=a.dispatch;return n!==t.memoizedState&&(R.flags|=2048,fa(9,{destroy:void 0},p0.bind(null,a,n),null)),[o,l,e]}function p0(e,t){e.action=t}function Yf(e){var t=fe(),n=$;if(n!==null)return Pg(t,n,e);fe(),t=t.memoizedState,n=fe();var o=n.queue.dispatch;return n.memoizedState=e,[t,o,!1]}function fa(e,t,n,o){return e={tag:e,create:n,deps:o,inst:t,next:null},t=R.updateQueue,t===null&&(t=vi(),R.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e),e}function ev(){return fe().memoizedState}function xc(e,t,n,o){var a=Xe();R.flags|=e,a.memoizedState=fa(1|t,{destroy:void 0},n,o===void 0?null:o)}function pi(e,t,n,o){var a=fe();o=o===void 0?null:o;var l=a.memoizedState.inst;$!==null&&o!==null&&rd(o,$.memoizedState.deps)?a.memoizedState=fa(t,l,n,o):(R.flags|=e,a.memoizedState=fa(1|t,l,n,o))}function Gf(e,t){xc(8390656,8,e,t)}function vd(e,t){pi(2048,8,e,t)}function h0(e){R.flags|=4;var t=R.updateQueue;if(t===null)t=vi(),R.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function tv(e){var t=fe().memoizedState;return h0({ref:t,nextImpl:e}),function(){if((G&2)!==0)throw Error(y(440));return t.impl.apply(void 0,arguments)}}function nv(e,t){return pi(4,2,e,t)}function ov(e,t){return pi(4,4,e,t)}function av(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function lv(e,t,n){n=n!=null?n.concat([e]):null,pi(4,4,av.bind(null,t,e),n)}function md(){}function cv(e,t){var n=fe();t=t===void 0?null:t;var o=n.memoizedState;return t!==null&&rd(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function iv(e,t){var n=fe();t=t===void 0?null:t;var o=n.memoizedState;if(t!==null&&rd(t,o[1]))return o[0];if(o=e(),po){zn(!0);try{e()}finally{zn(!1)}}return n.memoizedState=[o,t],o}function pd(e,t,n){return n===void 0||(rn&1073741824)!==0&&(j&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Pv(),R.lanes|=e,Zn|=e,n)}function rv(e,t,n,o){return dt(n,t)?n:Xn.current!==null?(e=pd(e,n,o),dt(e,t)||(me=!0),e):(rn&106)===0||(rn&1073741824)!==0&&(j&261930)===0?(me=!0,e.memoizedState=n):(e=Pv(),R.lanes|=e,Zn|=e,t)}function uv(e,t,n,o,a){var l=V.p;V.p=l!==0&&8>l?l:8;var c=M.T,i={};i.types=c!==null?c.types:null,M.T=i,yd(e,!1,t,n);try{var r=a(),d=M.S;if(d!==null&&d(i,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var v=b0(r,o);Pa(e,t,v,ut(e))}else Pa(e,t,o,ut(e))}catch(p){Pa(e,t,{then:function(){},status:"rejected",reason:p},ut())}finally{V.p=l,c!==null&&i.types!==null&&(c.types=i.types),M.T=c}}function y0(){}function lu(e,t,n,o){if(e.tag!==5)throw Error(y(476));var a=dv(e).queue;uv(e,a,t,co,n===null?y0:function(){return sv(e),n(o)})}function dv(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:co,baseState:co,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:un,lastRenderedState:co},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:un,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function sv(e){var t=dv(e);t.next===null&&(t=e.alternate.memoizedState),Pa(e,t.next.queue,{},ut())}function hd(){return Me(ya)}function fv(){return fe().memoizedState}function bv(){return fe().memoizedState}function x0(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=ut();e=Dn(n);var o=Rn(t,e,n);o!==null&&(We(o,t,n),Fa(o,t,n)),t={cache:nd()},e.payload=t;return}t=t.return}}function k0(e,t,n){var o=ut();n={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},hi(e)?vv(t,n):(n=Pu(e,t,n,o),n!==null&&(We(n,e,o),mv(n,t,o)))}function gv(e,t,n){var o=ut();Pa(e,t,n,o)}function Pa(e,t,n,o){var a={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(hi(e))vv(t,a);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var c=t.lastRenderedState,i=l(c,n);if(a.hasEagerState=!0,a.eagerState=i,dt(i,c))return fi(e,t,a,0),F===null&&si(),!1}catch{}if(n=Pu(e,t,a,o),n!==null)return We(n,e,o),mv(n,t,o),!0}return!1}function yd(e,t,n,o){if(o={lane:2,revertLane:_d(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},hi(e)){if(t)throw Error(y(479))}else t=Pu(e,n,o,2),t!==null&&We(t,e,2)}function hi(e){var t=e.alternate;return e===R||t!==null&&t===R}function vv(e,t){aa=Xc=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function mv(e,t,n){if((n&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,eg(e,n)}}var Zc={readContext:Me,use:mi,useCallback:de,useContext:de,useEffect:de,useImperativeHandle:de,useLayoutEffect:de,useInsertionEffect:de,useMemo:de,useReducer:de,useRef:de,useState:de,useDebugValue:de,useDeferredValue:de,useTransition:de,useSyncExternalStore:de,useId:de,useHostTransitionStatus:de,useFormState:de,useActionState:de,useOptimistic:de,useMemoCache:de,useCacheRefresh:de,useEffectEvent:de},pv={readContext:Me,use:mi,useCallback:function(e,t){return Xe().memoizedState=[e,t===void 0?null:t],e},useContext:Me,useEffect:Gf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,xc(4194308,4,av.bind(null,t,e),n)},useLayoutEffect:function(e,t){return xc(4194308,4,e,t)},useInsertionEffect:function(e,t){xc(4,2,e,t)},useMemo:function(e,t){var n=Xe();t=t===void 0?null:t;var o=e();if(po){zn(!0);try{e()}finally{zn(!1)}}return n.memoizedState=[o,t],o},useReducer:function(e,t,n){var o=Xe();if(n!==void 0){var a=n(t);if(po){zn(!0);try{n(t)}finally{zn(!1)}}}else a=t;return o.memoizedState=o.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},o.queue=e,e=e.dispatch=k0.bind(null,R,e),[o.memoizedState,e]},useRef:function(e){var t=Xe();return e={current:e},t.memoizedState=e},useState:function(e){e=ou(e);var t=e.queue,n=gv.bind(null,R,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:md,useDeferredValue:function(e,t){var n=Xe();return pd(n,e,t)},useTransition:function(){var e=ou(!1);return e=uv.bind(null,R,e.queue,!0,!1),Xe().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var o=R,a=Xe();if(U){if(n===void 0)throw Error(y(407));n=n()}else{if(n=t(),F===null)throw Error(y(349));(j&127)!==0||Xg(o,t,n)}a.memoizedState=n;var l={value:n,getSnapshot:t};return a.queue=l,Gf(Zg.bind(null,o,l,e),[e]),o.flags|=2048,fa(9,{destroy:void 0},Qg.bind(null,o,l,n,t),null),n},useId:function(){var e=Xe(),t=F.identifierPrefix;if(U){var n=Xt,o=Vt;n=(o&~(1<<32-rt(o)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Qc++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=g0++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:hd,useFormState:jf,useActionState:jf,useOptimistic:function(e){var t=Xe();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=yd.bind(null,R,!0,n),n.dispatch=t,[e,t]},useMemoCache:bd,useCacheRefresh:function(){return Xe().memoizedState=x0.bind(null,R)},useEffectEvent:function(e){var t=Xe(),n={impl:e};return t.memoizedState=n,function(){if((G&2)!==0)throw Error(y(440));return n.impl.apply(void 0,arguments)}}},hv={readContext:Me,use:mi,useCallback:cv,useContext:Me,useEffect:vd,useImperativeHandle:lv,useInsertionEffect:nv,useLayoutEffect:ov,useMemo:iv,useReducer:yc,useRef:ev,useState:function(){return yc(un)},useDebugValue:md,useDeferredValue:function(e,t){var n=fe();return rv(n,$.memoizedState,e,t)},useTransition:function(){var e=yc(un)[0],t=fe().memoizedState;return[typeof e=="boolean"?e:Ol(e),t]},useSyncExternalStore:Vg,useId:fv,useHostTransitionStatus:hd,useFormState:Lf,useActionState:Lf,useOptimistic:function(e,t){var n=fe();return $g(n,$,e,t)},useMemoCache:bd,useCacheRefresh:bv,useEffectEvent:tv},S0={readContext:Me,use:mi,useCallback:cv,useContext:Me,useEffect:vd,useImperativeHandle:lv,useInsertionEffect:nv,useLayoutEffect:ov,useMemo:iv,useReducer:vr,useRef:ev,useState:function(){return vr(un)},useDebugValue:md,useDeferredValue:function(e,t){var n=fe();return $===null?pd(n,e,t):rv(n,$.memoizedState,e,t)},useTransition:function(){var e=vr(un)[0],t=fe().memoizedState;return[typeof e=="boolean"?e:Ol(e),t]},useSyncExternalStore:Vg,useId:fv,useHostTransitionStatus:hd,useFormState:Yf,useActionState:Yf,useOptimistic:function(e,t){var n=fe();return $!==null?$g(n,$,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:bd,useCacheRefresh:bv,useEffectEvent:tv};function mr(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:W({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var cu={enqueueSetState:function(e,t,n){e=e._reactInternals;var o=ut(),a=Dn(o);a.payload=t,n!=null&&(a.callback=n),t=Rn(e,a,o),t!==null&&(We(t,e,o),Fa(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=ut(),a=Dn(o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Rn(e,a,o),t!==null&&(We(t,e,o),Fa(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ut(),o=Dn(n);o.tag=2,t!=null&&(o.callback=t),t=Rn(e,o,n),t!==null&&(We(t,e,n),Fa(t,e,n))}};function Vf(e,t,n,o,a,l,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,c):t.prototype&&t.prototype.isPureReactComponent?!rl(n,o)||!rl(a,l):!0}function Xf(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&cu.enqueueReplaceState(t,t.state,null)}function ho(e,t){var n=t;if("ref"in t){n={};for(var o in t)o!=="ref"&&(n[o]=t[o])}if(e=e.defaultProps){n===t&&(n=W({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function yv(e){Uc(e)}function xv(e){console.error(e)}function kv(e){Uc(e)}function Kc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function Qf(e,t,n){try{var o=e.onCaughtError;o(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function iu(e,t,n){return n=Dn(n),n.tag=3,n.payload={element:null},n.callback=function(){Kc(e,t)},n}function Sv(e){return e=Dn(e),e.tag=3,e}function Tv(e,t,n,o){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var l=o.value;e.payload=function(){return a(l)},e.callback=function(){Qf(t,n,o)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){Qf(t,n,o),typeof a!="function"&&(qn===null?qn=new Set([this]):qn.add(this));var i=o.stack;this.componentDidCatch(o.value,{componentStack:i!==null?i:""})})}function T0(e,t,n,o,a){if(n.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=n.alternate,t!==null&&bo(t,n,a,!0),n=Re.current,n!==null){switch(n.tag){case 31:case 13:case 19:return Le===null?ti():n.alternate===null&&se===0&&(se=3),n.flags&=-257,n.flags|=65536,n.lanes=a,o===Yc?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([o]):t.add(o),Tr(e,o,a)),!1;case 22:return n.flags|=65536,o===Yc?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([o]):n.add(o)),Tr(e,o,a)),!1}throw Error(y(435,n.tag))}return Tr(e,o,a),ti(),!1}if(U)return t=Re.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,o!==$r&&(e=Error(y(422),{cause:o}),dl(St(e,n)))):(o!==$r&&(t=Error(y(423),{cause:o}),dl(St(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,o=St(o,n),a=iu(e.stateNode,o,a),gr(e,a),se!==4&&(se=2)),!1;var l=Error(y(520),{cause:o});if(l=St(l,n),ol===null?ol=[l]:ol.push(l),se!==4&&(se=2),t===null)return!0;o=St(o,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=iu(n.stateNode,o,e),gr(n,e),!1;case 1:if(t=n.type,l=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(qn===null||!qn.has(l))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Sv(a),Tv(a,e,n,o),gr(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var xd=Error(y(461)),me=!1;function xe(e,t,n,o){t.child=e===null?Bg(t,null,n,o):mo(t,e.child,n,o)}function Zf(e,t,n,o,a){n=n.render;var l=t.ref;if("ref"in o){var c={};for(var i in o)i!=="ref"&&(c[i]=o[i])}else c=o;return go(t),o=ud(e,t,n,c,l,a),i=dd(),e!==null&&!me?(sd(e,t,a),dn(e,t,a)):(U&&i&&bi(t),t.flags|=1,xe(e,t,o,a),t.child)}function Kf(e,t,n,o,a){if(e===null){var l=n.type;return typeof l=="function"&&!ed(l)&&l.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=l,wv(e,t,l,o,a)):(e=mc(n.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!Sd(e,a)){var c=l.memoizedProps;if(n=n.compare,n=n!==null?n:rl,n(c,o)&&e.ref===t.ref)return dn(e,t,a)}return t.flags|=1,e=on(l,o),e.ref=t.ref,e.return=t,t.child=e}function wv(e,t,n,o,a){if(e!==null){var l=e.memoizedProps;if(rl(l,o)&&e.ref===t.ref)if(me=!1,t.pendingProps=o=l,Sd(e,a))(e.flags&131072)!==0&&(me=!0);else return t.lanes=e.lanes,dn(e,t,a)}return ru(e,t,n,o,a)}function Ev(e,t,n,o){var a=o.children,l=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(l=l!==null?l.baseLanes|n:n,e!==null){for(o=t.child=e.child,a=0;o!==null;)a=a|o.lanes|o.childLanes,o=o.sibling;o=a&~l}else o=0,t.child=null;return Jf(e,t,l,n,o)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&hc(t,l!==null?l.cachePool:null),l!==null?Uf(t,l):tu(),Lg(t);else return o=t.lanes=536870912,Jf(e,t,l!==null?l.baseLanes|n:n,n,o)}else l!==null?(hc(t,l.cachePool),Uf(t,l),Bn(),t.memoizedState=null):(e!==null&&hc(t,null),tu(),Bn());return xe(e,t,a,n),t.child}function el(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Jf(e,t,n,o,a){var l=od();return l=l===null?null:{parent:ve._currentValue,pool:l},t.memoizedState={baseLanes:n,cachePool:l},e!==null&&hc(t,null),tu(),Lg(t),e!==null&&bo(e,t,o,!0),t.childLanes=a,null}function kc(e,t){return t=yi({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function $f(e,t,n){return mo(t,e.child,null,n),e=kc(t,t.pendingProps),e.flags|=2,ot(t),t.memoizedState=null,e}function w0(e,t,n){var o=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(U){if(o.mode==="hidden")return e=kc(t,o),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},el(null,e);if(nu(t),(e=te)?(e=Em(e,Tt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Gn!==null?{id:Vt,overflow:Xt}:null,retryLane:536870912,hydrationErrors:null},n=_g(e),n.return=t,t.child=n,ze=t,te=null)):e=null,e===null)throw Vn(t);return t.lanes=536870912,null}return kc(t,o)}var l=e.memoizedState;if(l!==null){var c=l.dehydrated;if(nu(t),a)if(t.flags&256)t.flags&=-257,t=$f(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(y(558));else if(me||bo(e,t,n,!1),a=(n&e.childLanes)!==0,me||a){if(Xn.current===null){if(o=F,o!==null&&(c=tg(o,n),c!==0&&c!==l.retryLane))throw l.retryLane=c,To(e,c),We(o,e,c),xd;ti()}t=$f(e,t,n)}else e=l.treeContext,te=wt(c.nextSibling),ze=t,U=!0,Hn=null,Tt=!1,e!==null&&Cg(t,e),t=kc(t,o),t.flags|=134221824;return t}return e=on(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function qo(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(y(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function ru(e,t,n,o,a){return go(t),n=ud(e,t,n,o,void 0,a),o=dd(),e!==null&&!me?(sd(e,t,a),dn(e,t,a)):(U&&o&&bi(t),t.flags|=1,xe(e,t,n,a),t.child)}function Ff(e,t,n,o,a,l){return go(t),t.updateQueue=null,n=Gg(t,o,n,a),Yg(e),o=dd(),e!==null&&!me?(sd(e,t,l),dn(e,t,l)):(U&&o&&bi(t),t.flags|=1,xe(e,t,n,l),t.child)}function Wf(e,t,n,o,a){if(go(t),t.stateNode===null){var l=$o,c=n.contextType;typeof c=="object"&&c!==null&&(l=Me(c)),l=new n(o,l),t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=cu,t.stateNode=l,l._reactInternals=t,l=t.stateNode,l.props=o,l.state=t.memoizedState,l.refs={},ld(t),c=n.contextType,l.context=typeof c=="object"&&c!==null?Me(c):$o,l.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(mr(t,n,c,o),l.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(c=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),c!==l.state&&cu.enqueueReplaceState(l,l.state,null),Ia(t,o,l,a),Wa(),l.state=t.memoizedState),typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){l=t.stateNode;var i=t.memoizedProps,r=ho(n,i);l.props=r;var d=l.context,v=n.contextType;c=$o,typeof v=="object"&&v!==null&&(c=Me(v));var p=n.getDerivedStateFromProps;v=typeof p=="function"||typeof l.getSnapshotBeforeUpdate=="function",i=t.pendingProps!==i,v||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i||d!==c)&&Xf(t,l,o,c),wn=!1;var b=t.memoizedState;l.state=b,Ia(t,o,l,a),Wa(),d=t.memoizedState,i||b!==d||wn?(typeof p=="function"&&(mr(t,n,p,o),d=t.memoizedState),(r=wn||Vf(t,n,r,o,b,d,c))?(v||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=d),l.props=o,l.state=d,l.context=c,o=r):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{l=t.stateNode,Pr(e,t),c=t.memoizedProps,v=ho(n,c),l.props=v,p=t.pendingProps,b=l.context,d=n.contextType,r=$o,typeof d=="object"&&d!==null&&(r=Me(d)),i=n.getDerivedStateFromProps,(d=typeof i=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(c!==p||b!==r)&&Xf(t,l,o,r),wn=!1,b=t.memoizedState,l.state=b,Ia(t,o,l,a),Wa();var g=t.memoizedState;c!==p||b!==g||wn||e!==null&&e.dependencies!==null&&Lc(e.dependencies)?(typeof i=="function"&&(mr(t,n,i,o),g=t.memoizedState),(v=wn||Vf(t,n,v,o,b,g,r)||e!==null&&e.dependencies!==null&&Lc(e.dependencies))?(d||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(o,g,r),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(o,g,r)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&b===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&b===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=g),l.props=o,l.state=g,l.context=r,o=v):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&b===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&b===e.memoizedState||(t.flags|=1024),o=!1)}return l=o,qo(e,t),o=(t.flags&128)!==0,l||o?(l=t.stateNode,n=o&&typeof n.getDerivedStateFromError!="function"?null:l.render(),t.flags|=1,e!==null&&o?(t.child=mo(t,e.child,null,a),t.child=mo(t,null,n,a)):xe(e,t,n,a),t.memoizedState=l.state,e=t.child):e=dn(e,t,a),e}function If(e,t,n,o){return fo(),t.flags|=256,xe(e,t,n,o),t.child}var uu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function du(e){return{baseLanes:e,cachePool:Dg()}}function su(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=lt),e}function zv(e,t,n){var o=t.pendingProps,a=!1,l=(t.flags&128)!==0,c;if((c=l)||(c=e!==null&&e.memoizedState===null?!1:(He.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(U){if(a?Un(t):Bn(),(e=te)?(e=Em(e,Tt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Gn!==null?{id:Vt,overflow:Xt}:null,retryLane:536870912,hydrationErrors:null},n=_g(e),n.return=t,t.child=n,ze=t,te=null)):e=null,e===null)throw Vn(t);return Dd(e)?t.lanes=32:t.lanes=536870912,null}return l=o.children,o=o.fallback,a?(Bn(),a=t.mode,l=yi({mode:"hidden",children:l},a),o=io(o,a,n,null),l.return=t,o.return=t,l.sibling=o,t.child=l,o=t.child,o.memoizedState=du(n),o.childLanes=su(e,c,n),t.memoizedState=uu,el(null,o)):(Un(t),kd(t,l))}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(r!==null)return E0(e,t,l,c,o,r,i,n)}return a?(Bn(),a=o.fallback,l=t.mode,i=e.child,r=i.sibling,o=on(i,{mode:"hidden",children:o.children}),o.subtreeFlags=i.subtreeFlags&1206910976,r!==null?a=on(r,a):(a=io(a,l,n,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,el(null,o),o=t.child,a=e.child.memoizedState,a===null?a=du(n):(l=a.cachePool,l!==null?(i=ve._currentValue,l=l.parent!==i?{parent:i,pool:i}:l):l=Dg(),a={baseLanes:a.baseLanes|n,cachePool:l}),o.memoizedState=a,o.childLanes=su(e,c,n),t.memoizedState=uu,el(e.child,o)):(Un(t),n=e.child,e=n.sibling,n=on(n,{mode:"visible",children:o.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function kd(e,t){return t=yi({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function yi(e,t){return e=Fe(22,e,null,t),e.lanes=0,e}function nc(e,t,n){return mo(t,e.child,null,n),e=kd(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function E0(e,t,n,o,a,l,c,i){if(n)return t.flags&256?(Un(t),t.flags&=-257,nc(e,t,i)):t.memoizedState!==null?(Bn(),t.child=e.child,t.flags|=128,null):(Bn(),l=a.fallback,c=t.mode,a=yi({mode:"visible",children:a.children},c),l=io(l,c,i,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,mo(t,e.child,null,i),a=t.child,a.memoizedState=du(i),a.childLanes=su(e,o,i),t.memoizedState=uu,el(null,a));if(Un(t),Dd(l)){if(o=l.nextSibling&&l.nextSibling.dataset,o)var r=o.dgst;return o=r,o!==""&&(a=Error(y(419)),a.stack="",a.digest=o,dl({value:a,source:null,stack:null})),nc(e,t,i)}if(me||bo(e,t,i,!1),o=(i&e.childLanes)!==0,me||o){if(Xn.current!==null)return nc(e,t,i);if(o=F,o!==null&&(a=tg(o,i),a!==0&&a!==c.retryLane))throw c.retryLane=a,To(e,a),We(o,e,a),xd;return Uu(l)||ti(),nc(e,t,i)}return Uu(l)?(t.flags|=192,t.child=e.child,null):(e=c.treeContext,te=wt(l.nextSibling),ze=t,U=!0,Hn=null,Tt=!1,e!==null&&Cg(t,e),t=kd(t,a.children),t.flags|=134221824,t)}function Pf(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),pc(e.return,t,n)}function eb(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Vc(n)===null&&(t=e),e=e.sibling}return t}function oc(e,t,n,o,a,l){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:a,treeForkCount:l}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=n,c.tailMode=a,c.treeForkCount=l)}function pr(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function fu(e,t,n){var o=t.pendingProps,a=o.revealOrder,l=o.tail;o=o.children;var c=He.current;if(t.flags&128)return fl(t,c),null;var i=(c&2)!==0;if(i?(c=c&1|2,t.flags|=128):c&=1,fl(t,c),a==="backwards"&&e!==null?(pr(e),xe(e,t,o,n),pr(e)):xe(e,t,o,n),o=U?ul:0,!i&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Pf(e,n,t);else if(e.tag===19)Pf(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"backwards":n=eb(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null,pr(t)),oc(t,!0,a,null,l,o);break;case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&Vc(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}oc(t,!0,n,null,l,o);break;case"together":oc(t,!1,null,null,void 0,o);break;case"independent":t.memoizedState=null;break;default:n=eb(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),oc(t,!1,a,n,l,o)}return t.child}function tb(e,t,n){var o=t.pendingProps;return On(t,t.type,o.value),xe(e,t,o.children,n),t.child}function dn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Zn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(bo(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(y(153));if(t.child!==null){for(e=t.child,n=on(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=on(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Sd(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Lc(e)))}function z0(e,t,n){switch(t.tag){case 3:Cc(t,t.stateNode.containerInfo),On(t,ve,e.memoizedState.cache),fo();break;case 27:case 5:jr(t);break;case 4:Cc(t,t.stateNode.containerInfo);break;case 10:On(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,nu(t),null;break;case 13:var o=t.memoizedState;if(o!==null){if(o.dehydrated!==null)return Un(t),t.flags|=128,null;o=bo(e,t,n,!1);var a=t.child.childLanes;return o||(n&a)!==0?zv(e,t,n):(Un(t),e=dn(e,t,n),e!==null?e.sibling:null)}Un(t);break;case 19:if(t.flags&128)return fu(e,t,n);if(a=(e.flags&128)!==0,o=(n&t.childLanes)!==0,o||(bo(e,t,n,!1),o=(n&t.childLanes)!==0),a){if(o)return fu(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),fl(t,He.current),o)break;return null;case 22:return t.lanes=0,Ev(e,t,n,t.pendingProps);case 24:On(t,ve,e.memoizedState.cache)}return dn(e,t,n)}function Nv(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)me=!0;else{if(!Sd(e,n)&&(t.flags&128)===0)return me=!1,z0(e,t,n);me=(e.flags&131072)!==0}else me=!1,U&&(t.flags&1048576)!==0&&Mg(t,ul,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=no(t.elementType),t.type=e,typeof e=="function")ed(e)?(o=ho(e,o),t.tag=1,t=Wf(null,t,e,o,n)):(t.tag=0,t=ru(null,t,e,o,n));else{if(e!=null){var a=e.$$typeof;if(a===Yu){t.tag=11,t=Zf(null,t,e,o,n);break e}else if(a===Gu){t.tag=14,t=Kf(null,t,e,o,n);break e}else if(a===Yt){t.tag=10,t.type=e,t=tb(null,t,n);break e}}throw t=Br(e)||e,Error(y(306,t,""))}}return t;case 0:return ru(e,t,t.type,t.pendingProps,n);case 1:return o=t.type,a=ho(o,t.pendingProps),Wf(e,t,o,a,n);case 3:e:{if(Cc(t,t.stateNode.containerInfo),e===null)throw Error(y(387));o=t.pendingProps;var l=t.memoizedState;a=l.element,Pr(e,t),Ia(t,o,null,n);var c=t.memoizedState;if(o=c.cache,On(t,ve,o),o!==l.cache&&Wr(t,[ve],n,!0),Wa(),o=c.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){t=If(e,t,o,n);break e}else if(o!==a){a=St(Error(y(424)),t),dl(a),t=If(e,t,o,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,te=wt(e.firstChild),ze=t,U=!0,Hn=null,Tt=!0,n=Bg(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling;else{if(fo(),o===a){t=dn(e,t,n);break e}xe(e,t,o,n)}t=t.child}return t;case 26:return qo(e,t),e===null?(n=Ob(t.type,null,t.pendingProps,null))?t.memoizedState=n:U||(t.stateNode=mm(t.type,t.pendingProps,Cn.current,t)):t.memoizedState=Ob(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return jr(t),e===null&&U&&(o=t.stateNode=zm(t.type,t.pendingProps,Cn.current),ze=t,Tt=!0,a=te,Jn(t.type)?(Bu=a,te=wt(o.firstChild)):te=a),xe(e,t,t.pendingProps.children,n),qo(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&U&&((a=o=te)&&(o=hy(o,t.type,t.pendingProps,Tt),o!==null?(t.stateNode=o,ze=t,te=wt(o.firstChild),Tt=!1,a=!0):a=!1),a||Vn(t)),jr(t),a=t.type,l=t.pendingProps,c=e!==null?e.memoizedProps:null,o=l.children,Hu(a,l)?o=null:c!==null&&Hu(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=ud(e,t,v0,null,null,n),ya._currentValue=a),qo(e,t),xe(e,t,o,n),t.child;case 6:return e===null&&U&&((e=n=te)&&(n=yy(n,t.pendingProps,Tt),n!==null?(t.stateNode=n,ze=t,te=null,e=!0):e=!1),e||Vn(t)),null;case 13:return zv(e,t,n);case 4:return Cc(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=mo(t,null,o,n):xe(e,t,o,n),t.child;case 11:return Zf(e,t,t.type,t.pendingProps,n);case 7:return o=t.pendingProps,qo(e,t),xe(e,t,o,n),t.child;case 8:return xe(e,t,t.pendingProps.children,n),t.child;case 12:return xe(e,t,t.pendingProps.children,n),t.child;case 10:return tb(e,t,n);case 9:return a=t.type._context,o=t.pendingProps.children,go(t),a=Me(a),o=o(a),t.flags|=1,xe(e,t,o,n),t.child;case 14:return Kf(e,t,t.type,t.pendingProps,n);case 15:return wv(e,t,t.type,t.pendingProps,n);case 19:return fu(e,t,n);case 31:return w0(e,t,n);case 22:return Ev(e,t,n,t.pendingProps);case 24:return go(t),o=Me(ve),e===null?(a=od(),a===null&&(a=F,l=nd(),a.pooledCache=l,l.refCount++,l!==null&&(a.pooledCacheLanes|=n),a=l),t.memoizedState={parent:o,cache:a},ld(t),On(t,ve,a)):((e.lanes&n)!==0&&(Pr(e,t),Ia(t,null,null,n),Wa()),a=e.memoizedState,l=t.memoizedState,a.parent!==o?(a={parent:o,cache:o},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),On(t,ve,o)):(o=l.cache,On(t,ve,o),o!==a.cache&&Wr(t,[ve],n,!0))),xe(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=t.pendingProps,o.name!=null&&o.name!=="auto"?t.flags|=e===null?18882560:18874368:U&&bi(t),e!==null&&e.memoizedProps.name!==o.name?t.flags|=4194816:qo(e,t),xe(e,t,o.children,n),t.child;case 29:throw t.pendingProps}throw Error(y(156,t.tag))}function en(e){e.flags|=4}function hr(e,t,n,o,a){var l;if((l=(e.mode&32)!==0)&&(l=n===null?Mb(t,o):Mb(t,o)&&(o.src!==n.src||o.srcSet!==n.srcSet)),l){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(nm())e.flags|=8192;else throw uo=Yc,ad}else e.flags&=-16777217}function nb(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!_m(t))if(nm())e.flags|=8192;else throw uo=Yc,ad}function ac(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Ib():536870912,e.lanes|=t,ba|=t)}function Ba(e,t){if(!U)switch(e.tailMode){case"visible":break;case"collapsed":for(var n=e.tail,o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function ee(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags&1206910976,o|=a.flags&1206910976,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function N0(e,t,n){var o=t.pendingProps;switch(td(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ee(t),null;case 1:return ee(t),null;case 3:return n=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),an(ve),ua(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Uo(t)?en(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,br())),ee(t),null;case 26:var a=t.type,l=t.memoizedState;return e===null?(en(t),l!==null?(ee(t),nb(t,l)):(ee(t),hr(t,a,null,o,n))):l?l!==e.memoizedState?(en(t),ee(t),nb(t,l)):(ee(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&en(t),ee(t),hr(t,a,e,o,n)),null;case 27:if(Hc(t),n=Cn.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&en(t);else{if(!o){if(t.stateNode===null)throw Error(y(166));return ee(t),t.subtreeFlags&=-33554433,null}e=Qt.current,Uo(t)?Af(t,e):(e=zm(a,o,n),t.stateNode=e,en(t))}return ee(t),t.subtreeFlags&=-33554433,null;case 5:if(Hc(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&en(t);else{if(!o){if(t.stateNode===null)throw Error(y(166));return ee(t),t.subtreeFlags&=-33554433,null}if(l=Qt.current,Uo(t))Af(t,l);else{var c=ml(Cn.current);switch(l){case 1:l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":l=c.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof o.is=="string"?c.createElement("select",{is:o.is}):c.createElement("select"),o.multiple?l.multiple=!0:o.size&&(l.size=o.size);break;default:l=typeof o.is=="string"?c.createElement(a,{is:o.is}):c.createElement(a)}}l[_e]=t,l[Pe]=o;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)l.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=l;e:switch(De(l,a,o),a){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&en(t)}}return ee(t),t.subtreeFlags&=-33554433,hr(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&en(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(y(166));if(e=Cn.current,Uo(t)){if(e=t.stateNode,n=t.memoizedProps,o=null,a=ze,a!==null)switch(a.tag){case 27:case 5:o=a.memoizedProps}e[_e]=t,e=!!(e.nodeValue===n||o!==null&&o.suppressHydrationWarning===!0||gm(e.nodeValue,n)),e||Vn(t,!0)}else e=ml(e).createTextNode(o),e[_e]=t,t.stateNode=e}return ee(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(o=Uo(t),n!==null){if(e===null){if(!o)throw Error(y(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(557));e[_e]=t}else fo(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ee(t),e=!1}else n=br(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(ot(t),t):(ot(t),null);if((t.flags&128)!==0)throw Error(y(558))}return ee(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Uo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(y(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(y(317));a[_e]=t}else fo(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ee(t),a=!1}else a=br(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(ot(t),t):(ot(t),null)}return ot(t),(t.flags&128)!==0?(t.lanes=n,t):(n=o!==null,e=e!==null&&e.memoizedState!==null,n&&(o=t.child,a=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(a=o.alternate.memoizedState.cachePool.pool),l=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(l=o.memoizedState.cachePool.pool),l!==a&&(o.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),ac(t,t.updateQueue),ee(t),null);case 4:return ua(),e===null&&Md(t.stateNode.containerInfo),t.flags|=67108864,ee(t),null;case 10:return an(t.type),ee(t),null;case 19:if(id(t),o=t.memoizedState,o===null)return ee(t),null;if(a=(t.flags&128)!==0,l=o.rendering,l===null)if(a)Ba(o,!1);else{if(se!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=Vc(e),l!==null){for(t.flags|=128,Ba(o,!1),e=l.updateQueue,t.updateQueue=e,ac(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Ag(n,e),n=n.sibling;return fl(t,He.current&1|2),U&&tn(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&ct()>Pc&&(t.flags|=128,a=!0,Ba(o,!1),t.lanes=4194304)}else{if(!a)if(e=Vc(l),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,ac(t,e),Ba(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!l.alternate&&!U)return ee(t),null}else 2*ct()-o.renderingStartTime>Pc&&n!==536870912&&(t.flags|=128,a=!0,Ba(o,!1),t.lanes=4194304);o.isBackwards?(l.sibling=t.child,t.child=l):(e=o.last,e!==null?e.sibling=l:t.child=l,o.last=l)}if(o.tail!==null){e=o.tail;e:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break e}n=n.sibling}n=!0}return o.rendering=e,o.tail=e.sibling,o.renderingStartTime=ct(),e.sibling=null,l=He.current,l=a?l&1|2:l&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!n||U?fl(t,l):(n=l,ne(Re,t),ne(He,n),Le===null&&(Le=t)),U&&tn(t,o.treeForkCount),e}return ee(t),null;case 22:case 23:return ot(t),cd(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(n&536870912)!==0&&(t.flags&128)===0&&(ee(t),t.subtreeFlags&6&&(t.flags|=8192)):ee(t),n=t.updateQueue,n!==null&&ac(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==n&&(t.flags|=2048),e!==null&&Ce(ro),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),an(ve),ee(t),null;case 25:return null;case 30:return t.flags|=33554432,ee(t),null}throw Error(y(156,t.tag))}function O0(e,t){switch(td(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return an(ve),ua(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Hc(t),null;case 31:if(t.memoizedState!==null){if(ot(t),t.alternate===null)throw Error(y(340));fo()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(ot(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(y(340));fo()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return id(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return ua(),null;case 10:return an(t.type),null;case 22:case 23:return ot(t),cd(),e!==null&&Ce(ro),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return an(ve),null;case 25:return null;default:return null}}function Ov(e,t){switch(td(t),t.tag){case 3:an(ve),ua();break;case 26:case 27:case 5:Hc(t);break;case 4:ua();break;case 31:t.memoizedState!==null&&ot(t);break;case 13:ot(t);break;case 19:id(t);break;case 10:an(t.type);break;case 22:case 23:ot(t),cd(),e!==null&&Ce(ro);break;case 24:an(ve)}}function Al(e,t){try{var n=t.updateQueue,o=n!==null?n.lastEffect:null;if(o!==null){var a=o.next;n=a;do{if((n.tag&e)===e){o=void 0;var l=n.create,c=n.inst;o=l(),c.destroy=o}n=n.next}while(n!==a)}}catch(i){J(t,t.return,i)}}function Qn(e,t,n){try{var o=t.updateQueue,a=o!==null?o.lastEffect:null;if(a!==null){var l=a.next;o=l;do{if((o.tag&e)===e){var c=o.inst,i=c.destroy;if(i!==void 0){c.destroy=void 0,a=t;var r=n,d=i;try{d()}catch(v){J(a,r,v)}}}o=o.next}while(o!==l)}}catch(v){J(t,t.return,v)}}function Av(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{jg(t,n)}catch(o){J(e,e.return,o)}}}function _v(e,t,n){n.props=ho(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(o){J(e,t,o)}}function jt(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:var a=e.stateNode,l=cn(e.memoizedProps,a);(a.ref===null||a.ref.name!==l)&&(a.ref=xm(l)),o=a.ref;break;case 7:if(e.stateNode===null){var c=new st(e);Ie(e.child,!1,my,c,void 0,void 0),e.stateNode=c}o=e.stateNode;break;default:o=e.stateNode}typeof n=="function"?e.refCleanup=n(o):n.current=o}}catch(i){J(e,t,i)}}function Ae(e,t){var n=e.ref,o=e.refCleanup;if(n!==null)if(typeof o=="function")try{o()}catch(a){J(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){J(e,t,a)}else n.current=null}function Jc(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)wm(e.stateNode,t[n])}function ob(e){for(var t=e.return;t!==null&&(wd(t)&&wm(e.stateNode,t.stateNode),!Td(t));)t=t.return}function tl(e){for(var t=e.return;t!==null&&(wd(t)&&py(e.stateNode,t.stateNode),!Td(t));)t=t.return}function Td(e){return e.tag===5||e.tag===3||e.tag===27}function wd(e){return e&&e.tag===7&&e.stateNode!==null}function bu(e){var t=e.type,n=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&o.focus();break e;case"img":n.src?o.src=n.src:n.srcSet&&(o.srcset=n.srcSet)}}catch(a){J(e,e.return,a)}}function yr(e,t,n){try{var o=e.stateNode;I0(o,e.type,n,t),o[Pe]=t}catch(a){J(e,e.return,a)}}function Mv(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Jn(e.type)||e.tag===4}function xr(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Mv(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Jn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function gu(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Gt)),Jc(e,o),L=!0;else if(a!==4&&(a===27&&(Jc(e,o),o=null,Jn(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(gu(e,t,n,o),e=e.sibling;e!==null;)gu(e,t,n,o),e=e.sibling}function $c(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?n.insertBefore(a,t):n.appendChild(a),Jc(e,o),L=!0;else if(a!==4&&(a===27&&(Jc(e,o),o=null,Jn(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for($c(e,t,n,o),e=e.sibling;e!==null;)$c(e,t,n,o),e=e.sibling}function Cv(e){var t=e.stateNode,n=e.memoizedProps;try{for(var o=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);De(t,o,n),t[_e]=e,t[Pe]=n}catch(l){J(e,e.return,l)}}var Fc=!1,at=null;function ab(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Fc=!0)}var Lt=null;function lb(){var e=Lt;return Lt=null,e}var $e=0;function Ea(e,t,n,o,a){return $e=0,Hv(e.child,t,n,o,a)}function Hv(e,t,n,o,a){for(var l=!1;e!==null;){if(e.tag===5){var c=e.stateNode;if(o!==null){var i=Du(c);o.push(i),i.view&&(l=!0)}else l||Du(c).view&&(l=!0);Fc=!0,pm(c,$e===0?t:t+"_"+$e,n),$e++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&a||Hv(e.child,t,n,o,a)&&(l=!0));e=e.sibling}return l}function Kt(e,t){for(;e!==null;)e.tag===5?hm(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||Kt(e.child,t)),e=e.sibling}function Sc(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Sc(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name==="auto")throw Error(y(544));var n=t.name;t=bn(t.default,t.share),t!=="none"&&(Ea(e,n,t,null,!1)||Kt(e.child,!1))}e=e.sibling}}function vu(e,t){if(e.tag===30){var n=e.stateNode,o=e.memoizedProps,a=cn(o,n),l=bn(o.default,n.paired?o.share:o.enter);l!=="none"?Ea(e,a,l,null,!1)?(Sc(e),n.paired||t||ga(e,o.onEnter)):Kt(e.child,!1):Sc(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)vu(e,t),e=e.sibling;else Sc(e)}function mu(e){if(at!==null&&at.size!==0){var t=at;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.memoizedProps,o=n.name;if(o!=null&&o!=="auto"){var a=t.get(o);if(a!==void 0){var l=bn(n.default,n.share);if(l!=="none"&&(Ea(e,o,l,null,!1)?(l=e.stateNode,a.paired=l,l.paired=a,ga(e,n.onShare)):Kt(e.child,!1)),t.delete(o),t.size===0)break}}}mu(e)}e=e.sibling}}}function pu(e){if(e.tag===30){var t=e.memoizedProps,n=cn(t,e.stateNode),o=at!==null?at.get(n):void 0,a=bn(t.default,o!==void 0?t.share:t.exit);a!=="none"&&(Ea(e,n,a,null,!1)?o!==void 0?(a=e.stateNode,o.paired=a,a.paired=o,at.delete(n),ga(e,t.onShare)):ga(e,t.onExit):Kt(e.child,!1)),at!==null&&mu(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)pu(e),e=e.sibling;else at!==null&&mu(e)}function Dv(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=cn(t,e.stateNode);t=bn(t.default,t.update),e.flags&=-5,t!=="none"&&Ea(e,n,t,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&Dv(e);e=e.sibling}}function hu(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.stateNode;t.paired!==null&&(t.paired=null,Kt(e.child,!1))}hu(e)}e=e.sibling}}function Tc(e){if(e.tag===30)e.stateNode.paired=null,Kt(e.child,!1),hu(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Tc(e),e=e.sibling;else hu(e)}function Rv(e){for(e=e.child;e!==null;)e.tag===30?Kt(e.child,!1):(e.subtreeFlags&33554432)!==0&&Rv(e),e=e.sibling}function Ed(e,t,n,o,a,l,c){for(var i=!1;t!==null;){if(t.tag===5){var r=t.stateNode;if(l!==null&&$e<l.length){var d=l[$e],v=Du(r);(d.view||v.view)&&(i=!0);var p;if(p=(e.flags&4)===0)if(v.clip)p=!0;else{p=d.rect;var b=v.rect;p=p.y!==b.y||p.x!==b.x||p.height!==b.height||p.width!==b.width}p&&(e.flags|=4),v.abs?v=!d.abs:(d=d.rect,v=v.rect,v=d.height!==v.height||d.width!==v.width),v&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&pm(r,$e===0?n:n+"_"+$e,a),i&&(e.flags&4)!==0||(Lt===null&&(Lt=[]),Lt.push(r,$e===0?o:o+"_"+$e,t.memoizedProps)),$e++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c?e.flags|=t.flags&32:Ed(e,t.child,n,o,a,l,c)&&(i=!0));t=t.sibling}return i}function Uv(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,o=e.stateNode,a=cn(n,o),l=bn(n.default,n.update);if(t){o=o.clones;var c=o===null?null:o.map(ay)}else c=e.memoizedState,e.memoizedState=null;o=e;var i=e.child;$e=0,a=Ed(o,i,a,a,l,c,!1),(e.flags&4)!==0&&a&&(t||ga(e,n.onUpdate))}else(e.subtreeFlags&33554432)!==0&&Uv(e,t);e=e.sibling}}var Te=!1,X=!1,Ut=!1,kr=!1,cb=typeof WeakSet=="function"?WeakSet:Set,we=null,Bt=!1,Qa=!1,Wc=!1,yu=!1;function A0(e,t,n){if(e=e.containerInfo,Mu=xa,e=kg(e),Wu(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var a=o.getSelection&&o.getSelection();if(a&&a.rangeCount!==0){o=a.anchorNode;var l=a.anchorOffset,c=a.focusNode;a=a.focusOffset;try{o.nodeType,c.nodeType}catch{o=null;break e}var i=0,r=-1,d=-1,v=0,p=0,b=e,g=null;t:for(;;){for(var x;b!==o||l!==0&&b.nodeType!==3||(r=i+l),b!==c||a!==0&&b.nodeType!==3||(d=i+a),b.nodeType===3&&(i+=b.nodeValue.length),(x=b.firstChild)!==null;)g=b,b=x;for(;;){if(b===e)break t;if(g===o&&++v===l&&(r=i),g===c&&++p===a&&(d=i),(x=b.nextSibling)!==null)break;b=g,g=b.parentNode}b=x}o=r===-1||d===-1?null:{start:r,end:d}}else o=null}o=o||{start:0,end:0}}else o=null;for(Cu={focusedElem:e,selectionRange:o},xa=!1,n=(n&335544064)===n,we=t,t=n?9270:1024;we!==null;){if(e=we,n&&(o=e.deletions,o!==null))for(l=0;l<o.length;l++)n&&pu(o[l]);if(e.alternate===null&&(e.flags&2)!==0)n&&ab(e),lc(n);else{if(e.tag===22){if(o=e.alternate,e.memoizedState!==null){o!==null&&o.memoizedState===null&&n&&pu(o),lc(n);continue}else if(o!==null&&o.memoizedState!==null){n&&ab(e),lc(n);continue}}o=e.child,(e.subtreeFlags&t)!==0&&o!==null?(o.return=e,we=o):(n&&Dv(e),lc(n))}}at=null}function lc(e){for(;we!==null;){var t=we,n=e,o=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if((a&1024)!==0&&o!==null){n=void 0,a=o.memoizedProps,o=o.memoizedState;var l=t.stateNode;try{var c=ho(t.type,a);n=l.getSnapshotBeforeUpdate(c,o),l.__reactInternalSnapshotBeforeUpdate=n}catch(i){J(t,t.return,i)}}break;case 3:if((a&1024)!==0){if(o=t.stateNode.containerInfo,n=o.nodeType,n===9)Ru(o);else if(n===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":Ru(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&o!==null&&(n=cn(o.memoizedProps,o.stateNode),a=t.memoizedProps,a=bn(a.default,a.update),a!=="none"&&Ea(o,n,a,o.memoizedState=[],!0));break;default:if((a&1024)!==0)throw Error(y(163))}if(o=t.sibling,o!==null){o.return=t.return,we=o;break}we=t.return}}function Bv(e,t,n){var o=n.flags;switch(n.tag){case 0:case 11:case 15:qt(e,n),o&4&&Al(5,n);break;case 1:if(qt(e,n),o&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){J(n,n.return,c)}else{var a=ho(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){J(n,n.return,c)}}o&64&&Av(n),o&512&&jt(n,n.return);break;case 3:if(qt(e,n),o&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{jg(e,t)}catch(c){J(n,n.return,c)}}break;case 27:t===null&&o&4&&Cv(n);case 26:case 5:qt(e,n),t===null&&o&4&&bu(n),o&512&&jt(n,n.return);break;case 12:qt(e,n);break;case 31:qt(e,n),o&4&&Yv(e,n);break;case 13:qt(e,n),o&4&&Gv(e,n),o&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Y0.bind(null,n),xy(e,n))));break;case 22:if(o=n.memoizedState!==null||Te,!o){var l=t!==null&&t.memoizedState!==null||X;t=Te,a=X,Te=o,(X=l)&&!a?(o=2,(n.subtreeFlags&8772)!==0&&(o|=1),At(e,n,o)):qt(e,n),Te=t,X=a}break;case 30:qt(e,n),o&512&&jt(n,n.return);break;case 7:o&512&&jt(n,n.return);default:qt(e,n)}}function xu(e,t){for(e=e.child;e!==null;)qv(e,t),e=e.sibling}function qv(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var o=n.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var a=e.stateNode,l=e.memoizedProps.style,c=l!=null&&l.hasOwnProperty("display")?l.display:null;a.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(r){J(e,e.return,r)}ku(e,t);break;case 6:try{e.stateNode.nodeValue=t?"":e.memoizedProps,L=!0}catch(r){J(e,e.return,r)}break;case 18:try{var i=e.stateNode;t?Sb(i,!0):Sb(e.stateNode,!1)}catch(r){J(e,e.return,r)}break;case 22:case 23:e.memoizedState===null&&xu(e,t);break;default:xu(e,t)}}function ku(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var n=e,o=t;switch(n.tag){case 4:qv(n,o);break e;case 22:n.memoizedState===null&&ku(n,o);break e;default:ku(n,o)}}e=e.sibling}}function jv(e){var t=e.alternate;t!==null&&(e.alternate=null,jv(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&ii(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var le=null,Ke=!1;function Ot(e,t,n){for(n=n.child;n!==null;)Lv(e,t,n),n=n.sibling}function Lv(e,t,n){if(it&&typeof it.onCommitFiberUnmount=="function")try{it.onCommitFiberUnmount(Sl,n)}catch{}switch(n.tag){case 26:X||Ae(n,t),Ot(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!X&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:X||Ae(n,t),tl(n);var o=le,a=Ke;Jn(n.type)&&(le=n.stateNode,Ke=!1),Ot(e,t,n),Nm(n.stateNode,n.type,n.memoizedProps),le=o,Ke=a;break;case 5:X||Ae(n,t),tl(n);case 6:if(n.tag===6&&tl(n),o=le,a=Ke,le=null,Ot(e,t,n),le=o,Ke=a,le!==null)if(Ke)try{(le.nodeType===9?le.body:le.nodeName==="HTML"?le.ownerDocument.body:le).removeChild(n.stateNode),L=!0}catch(l){J(n,t,l)}else try{le.removeChild(n.stateNode),L=!0}catch(l){J(n,t,l)}break;case 18:le!==null&&(Ke?(e=le,kb(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),ka(e)):kb(le,n.stateNode));break;case 4:o=le,a=Ke,le=n.stateNode.containerInfo,Ke=!0,Ot(e,t,n),le=o,Ke=a;break;case 0:case 11:case 14:case 15:Qn(2,n,t),X||Qn(4,n,t),Ot(e,t,n);break;case 1:X||(Ae(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"&&_v(n,t,o)),Ot(e,t,n);break;case 21:Ot(e,t,n);break;case 22:X=(o=X)||n.memoizedState!==null,Ot(e,t,n),X=o;break;case 30:Ae(n,t),Ot(e,t,n);break;case 7:X||Ae(n,t),Ot(e,t,n);break;default:Ot(e,t,n)}}function Yv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ka(e)}catch(n){J(t,t.return,n)}}}function Gv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ka(e)}catch(n){J(t,t.return,n)}}function _0(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new cb),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new cb),t;default:throw Error(y(435,e.tag))}}function cc(e,t){var n=_0(e);t.forEach(function(o){if(!n.has(o)){n.add(o);var a=G0.bind(null,e,o);o.then(a,a)}})}function Ge(e,t,n){var o=t.deletions;if(o!==null)for(var a=0;a<o.length;a++){var l=o[a],c=e,i=t,r=i;e:for(;r!==null;){switch(r.tag){case 27:if(Jn(r.type)){le=r.stateNode,Ke=!1;break e}break;case 5:le=r.stateNode,Ke=!1;break e;case 3:case 4:le=r.stateNode.containerInfo,Ke=!0;break e}r=r.return}if(le===null)throw Error(y(160));Lv(c,i,l),le=null,Ke=!1,c=l.alternate,c!==null&&(c.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Vv(t,e,n),t=t.sibling}var _t=null;function Vv(e,t,n){var o=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(o=e.updateQueue,o=o!==null?o.events:null,o!==null))for(var l=0;l<o.length;l++){var c=o[l];c.ref.impl=c.nextImpl}Ge(t,e,n),Ve(e),a&4&&(Qn(3,e,e.return),Al(3,e),Qn(5,e,e.return));break;case 1:Ge(t,e,n),Ve(e),a&512&&(X||o===null||Ae(o,o.return)),a&64&&Te&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(l=_t,Ge(t,e,n),Ve(e),a&512&&(X||o===null||Ae(o,o.return)),a&4)if(a=o!==null?o.memoizedState:null,n=e.memoizedState,o===null)if(n===null)if(e.stateNode===null)if(Te)e.stateNode=mm(e.type,e.memoizedProps,t.containerInfo,e);else{e:{t=e.type,n=e.memoizedProps,a=l.ownerDocument||l;t:switch(t){case"title":o=a.getElementsByTagName("title")[0],(!o||o[El]||o[_e]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(t),a.head.insertBefore(o,a.querySelector("head > title"))),De(o,t,n),o[_e]=e,Ee(o),t=o;break e;case"link":if(l=_b("link","href",a).get(t+(n.href||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){l.splice(c,1);break t}}o=a.createElement(t),De(o,t,n),a.head.appendChild(o);break;case"meta":if(l=_b("meta","content",a).get(t+(n.content||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){l.splice(c,1);break t}}o=a.createElement(t),De(o,t,n),a.head.appendChild(o);break;default:throw Error(y(468,t))}o[_e]=e,Ee(o),t=o}e.stateNode=t}else Te||qu(l,e.type,e.stateNode);else e.stateNode=Ab(l,n,e.memoizedProps);else a!==n?(a===null?(t=o.stateNode,t===null||X||t.parentNode.removeChild(t)):a.count--,n===null?Te||qu(l,e.type,e.stateNode):Ab(l,n,e.memoizedProps)):n===null&&e.stateNode!==null&&yr(e,e.memoizedProps,o.memoizedProps);break;case 27:Ge(t,e,n),Ve(e),a&512&&(X||o===null||Ae(o,o.return)),o!==null&&a&4&&yr(e,e.memoizedProps,o.memoizedProps);break;case 5:if(l=Ut,Ut=!1,Ge(t,e,n),Ut=l,Ve(e),a&512&&(X||o===null||Ae(o,o.return)),e.flags&32){t=e.stateNode;try{sa(t,""),L=!0}catch(v){J(e,e.return,v)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,yr(e,t,o!==null?o.memoizedProps:t)),a&1024&&(kr=!0);break;case 6:if(Ge(t,e,n),Ve(e),a&4){if(e.stateNode===null)throw Error(y(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,L=!0}catch(v){J(e,e.return,v)}}break;case 3:if(L=!1,Nc=null,l=_t,_t=pl(t.containerInfo),Ge(t,e,n),_t=l,Ve(e),a&4&&o!==null&&o.memoizedState.isDehydrated)try{ka(t.containerInfo)}catch(v){J(e,e.return,v)}kr&&(kr=!1,Xv(e)),L=!1;break;case 4:a=Ut,Ut=Te,o=ff(),l=_t,_t=pl(e.stateNode.containerInfo),Ge(t,e,n),Ve(e),_t=l,L&&Qa&&(Wc=!0),L=o,Ut=a;break;case 12:Ge(t,e,n),Ve(e);break;case 31:Ge(t,e,n),Ve(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,cc(e,t)));break;case 13:Ge(t,e,n),Ve(e),e.child.flags&8192&&e.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(xi=ct()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,cc(e,t)));break;case 22:l=e.memoizedState!==null,c=o!==null&&o.memoizedState!==null;var i=Te,r=X,d=Ut;Te=i||l,Ut=d||l,X=r||c,Ge(t,e,n),X=r,Ut=d,Te=i,Ve(e),a&8192&&(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,!l||o===null||c||Te||X||(t=c||X,n=Te,o=X,Te=l||Te,X=t,Sn(e,2),Te=n,X=o),!l&&Ut||xu(e,l)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,cc(e,n))));break;case 19:Ge(t,e,n),Ve(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,cc(e,t)));break;case 30:a&512&&(X||o===null||Ae(o,o.return)),a=ff(),l=Qa,c=(n&335544064)===n,i=e.memoizedProps,Qa=c&&bn(i.default,i.update)!=="none",Ge(t,e,n),Ve(e),c&&o!==null&&L&&(e.flags|=4),Qa=l,L=a;break;case 21:break;case 7:a&512&&(X||o===null||Ae(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=e);default:Ge(t,e,n),Ve(e)}}function Ve(e){var t=e.flags;if(t&2){try{for(var n,o=e.return;o!==null;){if(Mv(o)){n=o;break}o=o.return}o=null;for(var a=e.return;a!==null;){if(wd(a)){var l=a.stateNode;o===null?o=[l]:o.push(l)}if(Td(a))break;a=a.return}var c=o;if(n==null)throw Error(y(160));switch(n.tag){case 27:var i=n.stateNode,r=xr(e);$c(e,r,i,c);break;case 5:var d=n.stateNode;n.flags&32&&(sa(d,""),n.flags&=-33);var v=xr(e);$c(e,v,d,c);break;case 3:case 4:var p=n.stateNode.containerInfo,b=xr(e);gu(e,b,p,c);break;default:throw Error(y(161))}}catch(g){J(e,e.return,g)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Xv(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Xv(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,xa=!0,t.reset(),xa=!1),e=e.sibling}}function Bo(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Qv(t,e),t=t.sibling;else Uv(t,!1)}function Qv(e,t){var n=e.alternate;if(n===null)vu(e,!1);else switch(e.tag){case 3:if(yu=Bt=!1,lb(),Bo(t,e),!Bt&&!Wc){if(e=Lt,e!==null)for(var o=0;o<e.length;o+=3){n=e[o];var a=e[o+1];hm(n,e[o+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+a+")"})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),yu=!0}Lt=null;break;case 5:Bo(t,e);break;case 4:o=Bt,Bt=!1,Bo(t,e),Bt&&(Wc=!0),Bt=o;break;case 22:e.memoizedState===null&&(n.memoizedState!==null?vu(e,!1):Bo(t,e));break;case 30:o=Bt,a=lb(),Bt=!1,Bo(t,e),Bt&&(e.flags|=4);var l=e.memoizedProps,c=e.stateNode;t=cn(l,c),c=cn(n.memoizedProps,c);var i=bn(l.default,l.update);i==="none"?t=!1:(l=n.memoizedState,n.memoizedState=null,n=e.child,$e=0,t=Ed(e,n,t,c,i,l,!0),$e!==(l===null?0:l.length)&&(e.flags|=32)),(e.flags&4)!==0&&t?(ga(e,e.memoizedProps.onUpdate),Lt=a):a!==null&&(a.push.apply(a,Lt),Lt=a),Bt=(e.flags&32)!==0?!0:o;break;default:Bo(t,e)}}function qt(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Bv(e,t.alternate,t),t=t.sibling}function Sn(e,t){for(e=e.child;e!==null;){var n=e,o=t;switch(n.tag){case 0:case 11:case 14:case 15:Qn(4,n,n.return),Sn(n,o);break;case 1:Ae(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&_v(n,n.return,a),Sn(n,o);break;case 27:(o&2)!==0&&Nm(n.stateNode,n.type,n.memoizedProps);case 5:Ae(n,n.return),n.tag!==5&&n.tag!==27||tl(n),Sn(n,o);break;case 6:tl(n);break;case 26:Ae(n,n.return),a=n.stateNode,n.memoizedState!==null||a===null||X||a.parentNode.removeChild(a),Sn(n,o);break;case 22:n.memoizedState===null&&Sn(n,o);break;case 30:Ae(n,n.return),Sn(n,o);break;case 7:Ae(n,n.return);default:Sn(n,o)}e=e.sibling}}function At(e,t,n){for(n=(t.subtreeFlags&8772)!==0?n:n&-2,t=t.child;t!==null;){var o=t.alternate,a=e,l=t,c=l.flags,i=(n&1)!==0;switch(l.tag){case 0:case 11:case 15:At(a,l,n),Al(4,l);break;case 1:if(At(a,l,n),o=l,a=o.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(v){J(o,o.return,v)}if(o=l,a=o.updateQueue,a!==null){var r=o.stateNode;try{var d=a.shared.hiddenCallbacks;if(d!==null)for(a.shared.hiddenCallbacks=null,a=0;a<d.length;a++)qg(d[a],r)}catch(v){J(o,o.return,v)}}i&&c&64&&Av(l),jt(l,l.return);break;case 27:(n&2)!==0&&Cv(l);case 5:l.tag!==5&&l.tag!==27||ob(l),At(a,l,n),i&&o===null&&c&4&&bu(l),jt(l,l.return);break;case 6:ob(l);break;case 26:r=l.stateNode,l.memoizedState!==null||r===null||Te||qu(pl(r.ownerDocument),l.type,r),At(a,l,n),i&&o===null&&c&4&&bu(l),jt(l,l.return);break;case 12:At(a,l,n);break;case 31:At(a,l,n),i&&c&4&&Yv(a,l);break;case 13:At(a,l,n),i&&c&4&&Gv(a,l);break;case 22:l.memoizedState===null&&At(a,l,n),jt(l,l.return);break;case 30:At(a,l,n),jt(l,l.return);break;case 7:jt(l,l.return);default:At(a,l,n)}t=t.sibling}}function zd(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Nl(n))}function Nd(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Nl(e))}function pt(e,t,n,o){var a=(n&335544064)===n;if(t.subtreeFlags&(a?10262:10256))for(t=t.child;t!==null;)Zv(e,t,n,o),t=t.sibling;else a&&Rv(t)}function Zv(e,t,n,o){var a=(n&335544064)===n;a&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&Tc(t);var l=t.flags;switch(t.tag){case 0:case 11:case 15:pt(e,t,n,o),l&2048&&Al(9,t);break;case 1:pt(e,t,n,o);break;case 3:pt(e,t,n,o),a&&yu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),l&2048&&(l=null,t.alternate!==null&&(l=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==l&&(t.refCount++,l!=null&&Nl(l)));break;case 12:if(l&2048){pt(e,t,n,o),l=t.stateNode;try{var c=t.memoizedProps,i=c.id,r=c.onPostCommit;typeof r=="function"&&r(i,t.alternate===null?"mount":"update",l.passiveEffectDuration,-0)}catch(d){J(t,t.return,d)}}else pt(e,t,n,o);break;case 31:pt(e,t,n,o);break;case 13:pt(e,t,n,o);break;case 23:break;case 22:c=t.stateNode,i=t.alternate,t.memoizedState!==null?(a&&i!==null&&i.memoizedState===null&&Tc(i),c._visibility&2?pt(e,t,n,o):nl(e,t)):(a&&i!==null&&i.memoizedState!==null&&Tc(t),c._visibility&2?pt(e,t,n,o):(c._visibility|=2,jo(e,t,n,o,(t.subtreeFlags&10256)!==0||!1))),l&2048&&zd(i,t);break;case 24:pt(e,t,n,o),l&2048&&Nd(t.alternate,t);break;case 30:a&&(l=t.alternate,l!==null&&(Kt(l.child,!0),Kt(t.child,!0))),pt(e,t,n,o);break;default:pt(e,t,n,o)}}function jo(e,t,n,o,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var l=e,c=t,i=n,r=o,d=c.flags;switch(c.tag){case 0:case 11:case 15:jo(l,c,i,r,a),Al(8,c);break;case 23:break;case 22:var v=c.stateNode;c.memoizedState!==null?v._visibility&2?jo(l,c,i,r,a):nl(l,c):(v._visibility|=2,jo(l,c,i,r,a)),a&&d&2048&&zd(c.alternate,c);break;case 24:jo(l,c,i,r,a),a&&d&2048&&Nd(c.alternate,c);break;default:jo(l,c,i,r,a)}t=t.sibling}}function nl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,o=t,a=o.flags;switch(o.tag){case 22:nl(n,o),a&2048&&zd(o.alternate,o);break;case 24:nl(n,o),a&2048&&Nd(o.alternate,o);break;default:nl(n,o)}t=t.sibling}}var oo=8192;function eo(e,t,n){if(e.subtreeFlags&oo)for(e=e.child;e!==null;)Kv(e,t,n),e=e.sibling}function Kv(e,t,n){switch(e.tag){case 26:eo(e,t,n),e.flags&oo&&(e.memoizedState!==null?Dy(n,_t,e.memoizedState,e.memoizedProps):(e=e.stateNode,(t&335544128)===t&&Cb(n,e)));break;case 5:eo(e,t,n),e.flags&oo&&(e=e.stateNode,(t&335544128)===t&&Cb(n,e));break;case 3:case 4:var o=_t;_t=pl(e.stateNode.containerInfo),eo(e,t,n),_t=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=oo,oo=16777216,eo(e,t,n),oo=o):eo(e,t,n));break;case 30:if((e.flags&oo)!==0&&(o=e.memoizedProps.name,o!=null&&o!=="auto")){var a=e.stateNode;a.paired=null,at===null&&(at=new Map),at.set(o,a)}eo(e,t,n);break;default:eo(e,t,n)}}function Jv(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function qa(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];we=o,Fv(o,e)}Jv(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)$v(e),e=e.sibling}function $v(e){switch(e.tag){case 0:case 11:case 15:qa(e),e.flags&2048&&Qn(9,e,e.return);break;case 3:qa(e);break;case 12:qa(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,wc(e)):qa(e);break;default:qa(e)}}function wc(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];we=o,Fv(o,e)}Jv(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Qn(8,t,t.return),wc(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,wc(t));break;default:wc(t)}e=e.sibling}}function Fv(e,t){for(;we!==null;){var n=we;switch(n.tag){case 0:case 11:case 15:Qn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var o=n.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:Nl(n.memoizedState.cache)}if(o=n.child,o!==null)o.return=n,we=o;else e:for(n=e;we!==null;){o=we;var a=o.sibling,l=o.return;if(jv(o),o===n){we=null;break e}if(a!==null){a.return=l,we=a;break e}we=l}}}var M0={getCacheForType:function(e){var t=Me(ve),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Me(ve).controller.signal}},C0=typeof WeakMap=="function"?WeakMap:Map,G=0,F=null,q=null,j=0,Z=0,tt=null,An=!1,za=!1,Od=!1,sn=0,se=0,Zn=0,so=0,Ic=0,lt=0,ba=0,ol=null,Je=null,Su=!1,xi=0,Wv=0,Pc=1/0,ei=null,qn=null,re=0,Ct=null,yo=null,Zt=0,Tu=0,wu=null,Iv=null,ca=null,ia=null,ra=null,al=0,Ec=null;function ut(){return(G&2)!==0&&j!==0?j&-j:M.T!==null?_d():ng()}function Pv(){if(lt===0)if((j&536870912)===0||U){var e=Kl;Kl<<=1,(Kl&3932160)===0&&(Kl=262144),lt=e}else lt=536870912;return e=Re.current,e!==null&&(e.flags|=32),lt}function ga(e,t){if(t!=null){var n=e.stateNode,o=n.ref;o===null&&(o=n.ref=xm(cn(e.memoizedProps,n))),ia===null&&(ia=[]),ia.push(t.bind(null,o))}}function We(e,t,n){(e===F&&(Z===2||Z===9)||e.cancelPendingCommit!==null)&&(va(e,0),_n(e,j,lt,!1)),wl(e,n),((G&2)===0||e!==F)&&(e===F&&((G&2)===0&&(so|=n),se===4&&_n(e,j,lt,!1)),$t(e))}function em(e,t,n){if((G&6)!==0)throw Error(y(327));var o=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Tl(e,t),a=o?R0(e,t):Sr(e,t,!0),l=o;do{if(a===0){za&&!o&&_n(e,t,0,!1);break}else{if(n=e.current.alternate,l&&!H0(n)){a=Sr(e,t,!1),l=!1;continue}if(a===2){if(l=t,e.errorRecoveryDisabledLanes&l)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var i=e;a=ol;var r=i.current.memoizedState.isDehydrated;if(r&&(va(i,c).flags|=256),c=Sr(i,c,!1),c!==2&&c!==6){if(Od&&!r){i.errorRecoveryDisabledLanes|=l,so|=l,a=4;break e}l=Je,Je=a,l!==null&&(Je===null?Je=l:Je.push.apply(Je,l))}a=c}if(l=!1,a!==2)continue}}if(a===1){va(e,0),_n(e,t,0,!0);break}e:{switch(o=e,l=a,l){case 0:case 1:throw Error(y(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:_n(o,t,lt,!An);break e;case 2:Je=null;break;case 3:case 5:break;default:throw Error(y(329))}if((t&62914560)===t&&(a=xi+300-ct(),10<a)){if(_n(o,t,lt,!An),ci(o,0,!0)!==0)break e;Zt=t,o.timeoutHandle=Cd(ib.bind(null,o,n,Je,ei,Su,t,lt,so,ba,An,l,"Throttled",-0,0),a);break e}ib(o,n,Je,ei,Su,t,lt,so,ba,An,l,null,-0,0)}}break}while(!0);$t(e)}function ib(e,t,n,o,a,l,c,i,r,d,v,p,b,g){e.timeoutHandle=-1;var x=t.subtreeFlags,k=(l&335544064)===l;if(p=null,(k||x&8192||(x&16785408)===16785408)&&(p={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Gt},at=null,Kv(t,l,p),k&&(x=p,k=e.containerInfo,k=(k.nodeType===9?k:k.ownerDocument).__reactViewTransition,k!=null&&(x.count++,x.waitingForViewTransition=!0,x=hl.bind(x),k.finished.then(x,x))),x=(l&62914560)===l?xi-ct():(l&4194048)===l?Wv-ct():0,x=Ry(p,x),x!==null)){Zt=l,e.cancelPendingCommit=x(ub.bind(null,e,t,l,n,o,a,c,i,r,d,v,p,null,b,g)),_n(e,l,c,!d);return}ub(e,t,l,n,o,a,c,i,r,d,v,p)}function H0(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var o=0;o<n.length;o++){var a=n[o],l=a.getSnapshot;a=a.value;try{if(!dt(l(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function _n(e,t,n,o){t=Wb(e,t),t&=~Ic,t&=~so,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var a=t;0<a;){var l=31-rt(a),c=1<<l;o[l]=-1,a&=~c}n!==0&&Pb(e,n,t)}function ki(){return(G&6)===0?(_l(0,!1),!1):!0}function Ad(){if(q!==null){if(Z===0)var e=q.return;else e=q,nn=wo=null,fd(e),oa=null,sl=0,e=q;for(;e!==null;)Ov(e.alternate,e),e=e.return;q=null}}function va(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,ty(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Zt=0,Ad(),F=e,q=n=on(e.current,null),j=t,Z=0,tt=null,An=!1,za=Tl(e,t),Od=!1,ba=lt=Ic=so=Zn=se=0,Je=ol=null,Su=!1,sn=Wb(e,t),si(),n}function tm(e,t){R=null,M.H=Zc,t===wa||t===gi?(t=Df(),Z=3):t===ad?(t=Df(),Z=4):Z=t===xd?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,tt=t,q===null&&(se=1,Kc(e,St(t,e.current)))}function nm(){var e=Re.current;return e===null?!0:(j&4194048)===j?Le===null:(j&62914560)===j||(j&536870912)!==0?e===Le:!1}function om(){var e=M.H;return M.H=Zc,e===null?Zc:e}function am(){var e=M.A;return M.A=M0,e}function ti(){se=4,An||(j&4194048)!==j&&Re.current!==null||(za=!0),(Zn&134217727)===0&&(so&134217727)===0||F===null||_n(F,j,lt,!1)}function Sr(e,t,n){var o=G;G|=2;var a=om(),l=am();(F!==e||j!==t)&&(ei=null,va(e,t)),t=!1;var c=se;e:do try{if(Z!==0&&q!==null){var i=q,r=tt;switch(Z){case 8:Ad(),c=6;break e;case 3:case 2:case 9:case 6:Re.current===null&&(t=!0);var d=Z;if(Z=0,tt=null,Io(e,i,r,d),n&&za){c=0;break e}break;default:d=Z,Z=0,tt=null,Io(e,i,r,d)}}D0(),c=se;break}catch(v){tm(e,v)}while(!0);return t&&e.shellSuspendCounter++,nn=wo=null,G=o,M.H=a,M.A=l,q===null&&(F=null,j=0,si()),c}function D0(){for(;q!==null;)lm(q)}function R0(e,t){var n=G;G|=2;var o=om(),a=am();F!==e||j!==t?(ei=null,Pc=ct()+500,va(e,t)):za=Tl(e,t);e:do try{if(Z!==0&&q!==null){t=q;var l=tt;t:switch(Z){case 1:Z=0,tt=null,Io(e,t,l,1);break;case 2:case 9:if(Hf(l)){Z=0,tt=null,rb(t);break}t=function(){Z!==2&&Z!==9||F!==e||(Z=7),$t(e)},l.then(t,t);break e;case 3:Z=7;break e;case 4:Z=5;break e;case 7:Hf(l)?(Z=0,tt=null,rb(t)):(Z=0,tt=null,Io(e,t,l,7));break;case 5:var c=null;switch(q.tag){case 26:c=q.memoizedState;case 5:case 27:var i=q;if(c?_m(c):i.stateNode.complete){Z=0,tt=null;var r=i.sibling;if(r!==null)q=r;else{var d=i.return;d!==null?(q=d,Si(d)):q=null}break t}}Z=0,tt=null,Io(e,t,l,5);break;case 6:Z=0,tt=null,Io(e,t,l,6);break;case 8:Ad(),se=6;break e;default:throw Error(y(462))}}U0();break}catch(v){tm(e,v)}while(!0);return nn=wo=null,M.H=o,M.A=a,G=n,q!==null?0:(F=null,j=0,si(),se)}function U0(){for(;q!==null&&!Pp();)lm(q)}function lm(e){var t=Nv(e.alternate,e,sn);e.memoizedProps=e.pendingProps,t===null?Si(e):q=t}function rb(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Ff(n,t,t.pendingProps,t.type,void 0,j);break;case 11:t=Ff(n,t,t.pendingProps,t.type.render,t.ref,j);break;case 5:fd(t);var o=t;o===ze&&(U?(jc(o),o.tag===5&&o.stateNode!=null&&(te=o.stateNode)):(jc(o),U=!0));default:Ov(n,t),t=q=Ag(t,sn),t=Nv(n,t,sn)}e.memoizedProps=e.pendingProps,t===null?Si(e):q=t}function Io(e,t,n,o){nn=wo=null,fd(t),oa=null,sl=0;var a=t.return;try{if(T0(e,a,t,n,j)){se=1,Kc(e,St(n,e.current)),q=null;return}}catch(l){if(a!==null)throw q=a,l;se=1,Kc(e,St(n,e.current)),q=null;return}t.flags&32768?(U||o===1?e=!0:za||(j&536870912)!==0?e=!1:(An=e=!0,(o===2||o===9||o===3||o===6)&&(o=Re.current,o!==null&&o.tag===13&&(o.flags|=16384))),cm(t,e)):Si(t)}function Si(e){var t=e;do{if((t.flags&32768)!==0){cm(t,An);return}e=t.return;var n=N0(t.alternate,t,sn);if(n!==null){q=n;return}if(t=t.sibling,t!==null){q=t;return}q=t=e}while(t!==null);se===0&&(se=5)}function cm(e,t){do{var n=O0(e.alternate,e);if(n!==null){n.flags&=32767,q=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){q=e;return}q=e=n}while(e!==null);se=6,q=null}function ub(e,t,n,o,a,l,c,i,r,d,v,p){e.cancelPendingCommit=null;do Ti();while(re!==0);if((G&6)!==0)throw Error(y(327));if(t!==null){if(t===e.current)throw Error(y(177));e===F&&(q=F=null,j=0),yo=t,Ct=e,Zt=n,wu=a,Iv=o,B0(e,t,n,c,i,r,p)}}function B0(e,t,n,o,a,l,c){var i=t.lanes|t.childLanes;if(Tu=i,i|=Iu,uh(e,n,i,o,a,l),ia=null,(n&335544064)===n?(ra=s0(e),o=10262):(ra=null,o=10256),(t.subtreeFlags&o)!==0||(t.flags&o)!==0?(e.callbackNode=null,e.callbackPriority=0,V0(Dc,function(){return Ou(),null})):(e.callbackNode=null,e.callbackPriority=0),Fc=!1,o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=M.T,M.T=null,a=V.p,V.p=2,l=G,G|=4;try{A0(e,t,n)}finally{G=l,V.p=a,M.T=o}}re=1,Fc?ca=iy(c,e.containerInfo,ra,Eu,zu,j0,Nu,Ou,q0,null,null):(Eu(),zu(),Nu())}function q0(e){if(re!==0){var t=Ct.onRecoverableError;t(e,{componentStack:null})}}function j0(){re===3&&(re=0,Qv(yo,Ct),re=4)}function Eu(){if(re===1){re=0;var e=Ct,t=yo,n=Zt,o=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||o){o=M.T,M.T=null;var a=V.p;V.p=2;var l=G;G|=4;try{Qa=Wc=!1,Vv(t,e,n),n=Cu;var c=kg(e.containerInfo),i=n.focusedElem,r=n.selectionRange;if(c!==i&&i&&i.ownerDocument&&xg(i.ownerDocument.documentElement,i)){if(r!==null&&Wu(i)){var d=r.start,v=r.end;if(v===void 0&&(v=d),"selectionStart"in i)i.selectionStart=d,i.selectionEnd=Math.min(v,i.value.length);else{var p=i.ownerDocument||document,b=p&&p.defaultView||window;if(b.getSelection){var g=b.getSelection(),x=i.textContent.length,k=Math.min(r.start,x),z=r.end===void 0?k:Math.min(r.end,x);!g.extend&&k>z&&(c=z,z=k,k=c);var s=Ef(i,k),u=Ef(i,z);if(s&&u&&(g.rangeCount!==1||g.anchorNode!==s.node||g.anchorOffset!==s.offset||g.focusNode!==u.node||g.focusOffset!==u.offset)){var f=p.createRange();f.setStart(s.node,s.offset),g.removeAllRanges(),k>z?(g.addRange(f),g.extend(u.node,u.offset)):(f.setEnd(u.node,u.offset),g.addRange(f))}}}}for(p=[],g=i;g=g.parentNode;)g.nodeType===1&&p.push({element:g,left:g.scrollLeft,top:g.scrollTop});for(typeof i.focus=="function"&&i.focus(),i=0;i<p.length;i++){var m=p[i];m.element.scrollLeft=m.left,m.element.scrollTop=m.top}}xa=!!Mu,Cu=Mu=null}finally{G=l,V.p=a,M.T=o}}e.current=t,re=2}}function zu(){if(re===2){re=0;var e=Ct,t=yo,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=M.T,M.T=null;var o=V.p;V.p=2;var a=G;G|=4;try{Bv(e,t.alternate,t)}finally{G=a,V.p=o,M.T=n}}re=3}}function Nu(){if(re===4||re===3){re=0;var e=ca;ca=null,eh();var t=Ct,n=yo,o=Zt,a=Iv,l=(o&335544064)===o?10262:10256;if((n.subtreeFlags&l)!==0||(n.flags&l)!==0?re=5:(re=0,yo=Ct=null,im(t,t.pendingLanes)),l=t.pendingLanes,l===0&&(qn=null),Qu(o),n=n.stateNode,it&&typeof it.onCommitFiberRoot=="function")try{it.onCommitFiberRoot(Sl,n,void 0,(n.current.flags&128)===128)}catch{}if(a!==null){n=M.T,l=V.p,V.p=2,M.T=null;try{for(var c=t.onRecoverableError,i=0;i<a.length;i++){var r=a[i];c(r.value,{componentStack:r.stack})}}finally{M.T=n,V.p=l}}if(a=ia,c=ra,ra=null,a!==null&&(ia=null,c===null&&(c=[]),e!==null))for(r=0;r<a.length;r++)n=(0,a[r])(c),n!==void 0&&e.finished.finally(n);(Zt&3)!==0&&Ti(),$t(t),l=t.pendingLanes,(o&261930)!==0&&(l&42)!==0?t===Ec?al++:(al=0,Ec=t):(al=0,Ec=null),_l(0,!1)}}function im(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Nl(t)))}function Ti(){return ca!==null&&(ca.skipTransition(),ca=null),Eu(),zu(),Nu(),Ou()}function Ou(){if(re!==5)return!1;var e=Ct,t=Tu;Tu=0;var n=Qu(Zt),o=M.T,a=V.p;try{V.p=32>n?32:n,M.T=null,n=wu,wu=null;var l=Ct,c=Zt;if(re=0,yo=Ct=null,Zt=0,(G&6)!==0)throw Error(y(331));var i=G;if(G|=4,$v(l.current),Zv(l,l.current,c,n),G=i,_l(0,!1),it&&typeof it.onPostCommitFiberRoot=="function")try{it.onPostCommitFiberRoot(Sl,l)}catch{}return!0}finally{V.p=a,M.T=o,im(e,t)}}function db(e,t,n){t=St(n,t),t=iu(e.stateNode,t,2),e=Rn(e,t,2),e!==null&&(wl(e,2),$t(e))}function J(e,t,n){if(e.tag===3)db(e,e,n);else for(;t!==null;){if(t.tag===3){db(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(qn===null||!qn.has(o))){e=St(n,e),n=Sv(2),o=Rn(t,n,2),o!==null&&(Tv(n,o,t,e),wl(o,2),$t(o));break}}t=t.return}}function Tr(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new C0;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(n)||(Od=!0,a.add(n),e=L0.bind(null,e,t,n),t.then(e,e))}function L0(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,F===e&&(j&n)===n&&((se===4||se===3&&(j&62914560)===j&&300>ct()-xi)&&(G&2)===0?va(e,0):Ic|=n,ba===j&&(ba=0)),$t(e)}function rm(e,t){t===0&&(t=Ib()),e=To(e,t),e!==null&&(wl(e,t),$t(e))}function Y0(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),rm(e,n)}function G0(e,t){var n=0;switch(e.tag){case 31:case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(y(314))}o!==null&&o.delete(t),rm(e,n)}function V0(e,t){return Vu(e,t)}var ma=null,Lo=null,Au=!1,ni=!1,wr=!1,Mn=0;function $t(e){e!==Lo&&e.next===null&&(Lo===null?ma=Lo=e:Lo=Lo.next=e),ni=!0,Au||(Au=!0,Q0())}function _l(e,t){if(!wr&&ni){wr=!0;do for(var n=!1,o=ma;o!==null;){if(!t)if(e!==0){var a=o.pendingLanes;if(a===0)var l=0;else{var c=o.suspendedLanes,i=o.pingedLanes;l=(1<<31-rt(42|e)+1)-1,l&=a&~(c&~i),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(n=!0,sb(o,l))}else l=j,l=ci(o,o===F?l:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(l&3)===0||Tl(o,l)||(n=!0,sb(o,l));o=o.next}while(n);wr=!1}}function X0(){um()}function um(){ni=Au=!1;var e=0;Mn!==0&&ey()&&(e=Mn);for(var t=ct(),n=null,o=ma;o!==null;){var a=o.next,l=dm(o,t);l===0?(o.next=null,n===null?ma=a:n.next=a,a===null&&(Lo=n)):(n=o,(e!==0||(l&3)!==0)&&(ni=!0)),o=a}re!==0&&re!==5||_l(e,!1),Mn!==0&&(Mn=0)}function dm(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var c=31-rt(l),i=1<<c,r=a[c];r===-1?((i&n)===0||(i&o)!==0)&&(a[c]=rh(i,t)):r<=t&&(e.expiredLanes|=i),l&=~i}if(t=F,n=j,n=ci(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,n===0||e===t&&(Z===2||Z===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&nr(o),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Tl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(o!==null&&nr(o),Qu(n)){case 2:case 8:n=$b;break;case 32:n=Dc;break;case 268435456:n=Fb;break;default:n=Dc}return o=sm.bind(null,e),n=Vu(n,o),e.callbackPriority=t,e.callbackNode=n,t}return o!==null&&o!==null&&nr(o),e.callbackPriority=2,e.callbackNode=null,2}function sm(e,t){if(re!==0&&re!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Ti()&&e.callbackNode!==n)return null;var o=j;return o=ci(e,e===F?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(em(e,o,t),dm(e,ct()),e.callbackNode!=null&&e.callbackNode===n?sm.bind(null,e):null)}function sb(e,t){if(Ti())return null;em(e,t,!0)}function Q0(){ny(function(){(G&6)!==0?Vu(Jb,X0):um()})}function _d(){if(Mn===0){var e=vo;e===0&&(e=Zl,Zl<<=1,(Zl&261888)===0&&(Zl=256)),Mn=e}return Mn}function fb(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:bc(e)}function Z0(e,t,n,o,a){if(t==="submit"&&n&&n.stateNode===a){var l=fb((a[Pe]||null).action),c=o.submitter;c&&(t=(t=c[Pe]||null)?fb(t.formAction):c.getAttribute("formAction"),t!==null&&(l=t,c=null));var i=new ri("action","action",null,o,a);e.push({event:i,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(Mn!==0){var r=new FormData(a,c);lu(n,{pending:!0,data:r,method:a.method,action:l},null,r)}}else typeof l=="function"&&(i.preventDefault(),r=new FormData(a,c),lu(n,{pending:!0,data:r,method:a.method,action:l},l,r))},currentTarget:a}]})}}for(ic=0;ic<Jr.length;ic++)rc=Jr[ic],bb=rc.toLowerCase(),gb=rc[0].toUpperCase()+rc.slice(1),Ht(bb,"on"+gb);var rc,bb,gb,ic;Ht(Tg,"onAnimationEnd");Ht(wg,"onAnimationIteration");Ht(Eg,"onAnimationStart");Ht("dblclick","onDoubleClick");Ht("focusin","onFocus");Ht("focusout","onBlur");Ht(o0,"onTransitionRun");Ht(a0,"onTransitionStart");Ht(l0,"onTransitionCancel");Ht(zg,"onTransitionEnd");da("onMouseEnter",["mouseout","mouseover"]);da("onMouseLeave",["mouseout","mouseover"]);da("onPointerEnter",["pointerout","pointerover"]);da("onPointerLeave",["pointerout","pointerover"]);ko("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));ko("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));ko("onBeforeInput",["compositionend","keypress","textInput","paste"]);ko("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));ko("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));ko("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var gl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),K0=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(gl));function fm(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],a=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var c=o.length-1;0<=c;c--){var i=o[c],r=i.instance,d=i.currentTarget;if(i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(v){Uc(v)}a.currentTarget=null,l=r}else for(c=0;c<o.length;c++){if(i=o[c],r=i.instance,d=i.currentTarget,i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(v){Uc(v)}a.currentTarget=null,l=r}}}}function B(e,t){var n=t[rf];n===void 0&&(n=t[rf]=new Set);var o=e+"__bubble";n.has(o)||(bm(t,e,2,!1),n.add(o))}function Er(e,t,n){var o=0;t&&(o|=4),bm(n,e,o,t)}var uc="_reactListening"+Math.random().toString(36).slice(2);function Md(e){if(!e[uc]){e[uc]=!0,ag.forEach(function(n){n!=="selectionchange"&&(K0.has(n)||Er(n,!1,e),Er(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[uc]||(t[uc]=!0,Er("selectionchange",!1,t))}}function bm(e,t,n,o){switch(Bm(t)){case 2:var a=jy;break;case 8:a=Ly;break;default:a=qd}n=a.bind(null,t,n,e),a=void 0,!Xr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function zr(e,t,n,o,a){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var i=o.stateNode.containerInfo;if(i===a)break;if(c===4)for(c=o.return;c!==null;){var r=c.tag;if((r===3||r===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;i!==null;){if(c=ao(i),c===null)return;if(r=c.tag,r===5||r===6||r===26||r===27){o=l=c;continue e}i=i.parentNode}}o=o.return}fg(function(){var d=l,v=Ku(n),p=[];e:{var b=Ng.get(e);if(b!==void 0){var g=ri,x=e;switch(e){case"keypress":if(vc(n)===0)break e;case"keydown":case"keyup":g=Hh;break;case"focusin":x="focus",g=rr;break;case"focusout":x="blur",g=rr;break;case"beforeblur":case"afterblur":g=rr;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":g=mf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":g=kh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":g=qh;break;case Tg:case wg:case Eg:g=wh;break;case zg:g=Lh;break;case"scroll":case"scrollend":g=yh;break;case"wheel":g=Gh;break;case"copy":case"cut":case"paste":g=zh;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":g=hf;break;case"submit":g=Uh;break;case"toggle":case"beforetoggle":g=Xh}var k=(t&4)!==0,z=!k&&(e==="scroll"||e==="scrollend"),s=k?b!==null?b+"Capture":null:b;k=[];for(var u=d,f;u!==null;){var m=u;if(f=m.stateNode,m=m.tag,m!==5&&m!==26&&m!==27||f===null||s===null||(m=cl(u,s),m!=null&&k.push(vl(u,m,f))),z)break;u=u.return}0<k.length&&(b=new g(b,x,null,n,v),p.push({event:b,listeners:k}))}}if((t&7)===0){e:{if(g=e==="mouseover"||e==="pointerover",b=e==="mouseout"||e==="pointerout",g&&n!==Vr&&(x=n.relatedTarget||n.fromElement)&&(ao(x)||x[Sa]))break e;(b||g)&&(x=v.window===v?v:(g=v.ownerDocument)?g.defaultView||g.parentWindow:window,b?(g=n.relatedTarget||n.toElement,b=d,g=g?ao(g):null,g!==null&&(z=kl(g),k=g.tag,g!==z||k!==5&&k!==27&&k!==6)&&(g=null)):(b=null,g=d),b!==g&&(k=mf,m="onMouseLeave",s="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(k=hf,m="onPointerLeave",s="onPointerEnter",u="pointer"),z=b==null?x:Va(b),f=g==null?x:Va(g),x=new k(m,u+"leave",b,n,v),x.target=z,x.relatedTarget=f,m=null,ao(v)===d&&(k=new k(s,u+"enter",g,n,v),k.target=f,k.relatedTarget=z,m=k),z=m,k=b&&g?Mr(b,g,J0):null,b!==null&&vb(p,x,b,k,!1),g!==null&&z!==null&&vb(p,z,g,k,!0)))}e:{if(b=d?Va(d):window,g=b.nodeName&&b.nodeName.toLowerCase(),g==="select"||g==="input"&&b.type==="file")var h=Sf;else if(kf(b))if(hg)h=e0;else{h=Ih;var w=Wh}else g=b.nodeName,!g||g.toLowerCase()!=="input"||b.type!=="checkbox"&&b.type!=="radio"?d&&Zu(d.elementType)&&(h=Sf):h=Ph;if(h&&(h=h(e,d))){pg(p,h,n,v);break e}w&&w(e,b,d)}switch(w=d?Va(d):window,e){case"focusin":(kf(w)||w.contentEditable==="true")&&(Zo=w,Zr=d,Ja=null);break;case"focusout":Ja=Zr=Zo=null;break;case"mousedown":Kr=!0;break;case"contextmenu":case"mouseup":case"dragend":Kr=!1,zf(p,n,v);break;case"selectionchange":if(n0)break;case"keydown":case"keyup":zf(p,n,v)}var T;if(Fu)e:{switch(e){case"compositionstart":var E="onCompositionStart";break e;case"compositionend":E="onCompositionEnd";break e;case"compositionupdate":E="onCompositionUpdate";break e}E=void 0}else Qo?vg(e,n)&&(E="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(E="onCompositionStart");E&&(gg&&n.locale!=="ko"&&(Qo||E!=="onCompositionStart"?E==="onCompositionEnd"&&Qo&&(T=bg()):(Nn=v,Ju="value"in Nn?Nn.value:Nn.textContent,Qo=!0)),w=oi(d,E),0<w.length&&(E=new pf(E,e,null,n,v),p.push({event:E,listeners:w}),T?E.data=T:(T=mg(n),T!==null&&(E.data=T)))),(T=Zh?Kh(e,n):Jh(e,n))&&(E=oi(d,"onBeforeInput"),0<E.length&&(w=new pf("onBeforeInput","beforeinput",null,n,v),p.push({event:w,listeners:E}),w.data=T)),Z0(p,e,d,n,v)}fm(p,t)})}function vl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function oi(e,t){for(var n=t+"Capture",o=[];e!==null;){var a=e,l=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||l===null||(a=cl(e,n),a!=null&&o.unshift(vl(e,a,l)),a=cl(e,t),a!=null&&o.push(vl(e,a,l))),e.tag===3)return o;e=e.return}return[]}function J0(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function vb(e,t,n,o,a){for(var l=t._reactName,c=[];n!==null&&n!==o;){var i=n,r=i.alternate,d=i.stateNode;if(i=i.tag,r!==null&&r===o)break;i!==5&&i!==26&&i!==27||d===null||(r=d,a?(d=cl(n,l),d!=null&&c.unshift(vl(n,d,r))):a||(d=cl(n,l),d!=null&&c.push(vl(n,d,r)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var $0=/\r\n?/g,F0=/\u0000|\uFFFD/g;function mb(e){return(typeof e=="string"?e:""+e).replace($0,`
`).replace(F0,"")}function gm(e,t){return t=mb(t),mb(e)===t}function K(e,t,n,o,a,l){switch(n){case"children":if(typeof o=="string")t==="body"||t==="textarea"&&o===""||sa(e,o);else if(typeof o=="number"||typeof o=="bigint")t!=="body"&&sa(e,""+o);else return;break;case"className":$l(e,"class",o);break;case"tabIndex":$l(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":$l(e,n,o);break;case"style":sg(e,o,l);return;case"data":if(t!=="object"){$l(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=bc(o),e.setAttribute(n,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(n==="formAction"?(t!=="input"&&K(e,t,"name",a.name,a,null),K(e,t,"formEncType",a.formEncType,a,null),K(e,t,"formMethod",a.formMethod,a,null),K(e,t,"formTarget",a.formTarget,a,null)):(K(e,t,"encType",a.encType,a,null),K(e,t,"method",a.method,a,null),K(e,t,"target",a.target,a,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=bc(o),e.setAttribute(n,o);break;case"onClick":o!=null&&(e.onclick=Gt);return;case"onScroll":o!=null&&B("scroll",e);return;case"onScrollEnd":o!=null&&B("scrollend",e);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(y(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(y(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}n=bc(o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":o===!0?e.setAttribute(n,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(n,o):e.removeAttribute(n);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(n):e.setAttribute(n,o);break;case"popover":B("beforetoggle",e),B("toggle",e),fc(e,"popover",o);break;case"xlinkActuate":Pt(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Pt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Pt(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Pt(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Pt(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Pt(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Pt(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Pt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Pt(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":fc(e,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")n=ph.get(n)||n,fc(e,n,o);else return}L=!0}function _u(e,t,n,o,a,l){switch(n){case"style":sg(e,o,l);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(y(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(y(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"children":if(typeof o=="string")sa(e,o);else if(typeof o=="number"||typeof o=="bigint")sa(e,""+o);else return;break;case"onScroll":o!=null&&B("scroll",e);return;case"onScrollEnd":o!=null&&B("scrollend",e);return;case"onClick":o!=null&&(e.onclick=Gt);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!lg.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),l=n.slice(2,a?n.length-7:void 0),t=e[Pe]||null,t=t!=null?t[n]:null,typeof t=="function"&&e.removeEventListener(l,t,a),typeof o=="function")){typeof t!="function"&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(l,o,a);break e}L=!0,n in e?e[n]=o:o===!0?e.setAttribute(n,""):fc(e,n,o)}return}L=!0}function De(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":B("error",e),B("load",e);var o=!1,a=!1,l;for(l in n)if(n.hasOwnProperty(l)){var c=n[l];if(c!=null)switch(l){case"src":o=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(y(137,t));default:K(e,t,l,c,n,null)}}a&&K(e,t,"srcSet",n.srcSet,n,null),o&&K(e,t,"src",n.src,n,null);return;case"input":B("invalid",e);var i=l=c=a=null,r=null,d=null;for(o in n)if(n.hasOwnProperty(o)){var v=n[o];if(v!=null)switch(o){case"name":a=v;break;case"type":c=v;break;case"checked":r=v;break;case"defaultChecked":d=v;break;case"value":l=v;break;case"defaultValue":i=v;break;case"children":case"dangerouslySetInnerHTML":if(v!=null)throw Error(y(137,t));break;default:K(e,t,o,v,n,null)}}rg(e,l,i,r,d,c,a,!1);return;case"select":B("invalid",e),o=c=l=null;for(a in n)if(n.hasOwnProperty(a)&&(i=n[a],i!=null))switch(a){case"value":l=i;break;case"defaultValue":c=i;break;case"multiple":o=i;default:K(e,t,a,i,n,null)}t=l,n=c,e.multiple=!!o,t!=null?ea(e,!!o,t,!1):n!=null&&ea(e,!!o,n,!0);return;case"textarea":B("invalid",e),l=a=o=null;for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"value":o=i;break;case"defaultValue":a=i;break;case"children":l=i;break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(y(91));break;default:K(e,t,c,i,n,null)}dg(e,o,a,l);return;case"option":for(r in n)n.hasOwnProperty(r)&&(o=n[r],o!=null)&&(r==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":K(e,t,r,o,n,null));return;case"dialog":B("beforetoggle",e),B("toggle",e),B("cancel",e),B("close",e);break;case"iframe":case"object":B("load",e);break;case"video":case"audio":for(o=0;o<gl.length;o++)B(gl[o],e);break;case"image":B("error",e),B("load",e);break;case"details":B("toggle",e);break;case"embed":case"source":case"link":B("error",e),B("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(d in n)if(n.hasOwnProperty(d)&&(o=n[d],o!=null))switch(d){case"children":case"dangerouslySetInnerHTML":throw Error(y(137,t));default:K(e,t,d,o,n,null)}return;default:if(Zu(t)){for(v in n)n.hasOwnProperty(v)&&(o=n[v],o!==void 0&&_u(e,t,v,o,n,void 0));return}}for(i in n)n.hasOwnProperty(i)&&(o=n[i],o!=null&&K(e,t,i,o,n,null))}var W0={};function I0(e,t,n,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,l=null,c=null,i=null,r=null,d=null,v=null;for(g in n){var p=n[g];if(n.hasOwnProperty(g)&&p!=null)switch(g){case"checked":break;case"value":break;case"defaultValue":r=p;default:o.hasOwnProperty(g)||K(e,t,g,null,o,p)}}for(var b in o){var g=o[b];if(p=n[b],o.hasOwnProperty(b)&&(g!=null||p!=null))switch(b){case"type":g!==p&&(L=!0),l=g;break;case"name":g!==p&&(L=!0),a=g;break;case"checked":g!==p&&(L=!0),d=g;break;case"defaultChecked":g!==p&&(L=!0),v=g;break;case"value":g!==p&&(L=!0),c=g;break;case"defaultValue":g!==p&&(L=!0),i=g;break;case"children":case"dangerouslySetInnerHTML":if(g!=null)throw Error(y(137,t));break;default:g!==p&&K(e,t,b,g,o,p)}}Gr(e,c,i,r,d,v,l,a);return;case"select":g=c=i=b=null;for(l in n)if(r=n[l],n.hasOwnProperty(l)&&r!=null)switch(l){case"value":break;case"multiple":g=r;default:o.hasOwnProperty(l)||K(e,t,l,null,o,r)}for(a in o)if(l=o[a],r=n[a],o.hasOwnProperty(a)&&(l!=null||r!=null))switch(a){case"value":l!==r&&(L=!0),b=l;break;case"defaultValue":l!==r&&(L=!0),i=l;break;case"multiple":l!==r&&(L=!0),c=l;default:l!==r&&K(e,t,a,l,o,r)}t=i,n=c,o=g,b!=null?ea(e,!!n,b,!1):!!o!=!!n&&(t!=null?ea(e,!!n,t,!0):ea(e,!!n,n?[]:"",!1));return;case"textarea":g=b=null;for(i in n)if(a=n[i],n.hasOwnProperty(i)&&a!=null&&!o.hasOwnProperty(i))switch(i){case"value":break;case"children":break;default:K(e,t,i,null,o,a)}for(c in o)if(a=o[c],l=n[c],o.hasOwnProperty(c)&&(a!=null||l!=null))switch(c){case"value":a!==l&&(L=!0),b=a;break;case"defaultValue":a!==l&&(L=!0),g=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(y(91));break;default:a!==l&&K(e,t,c,a,o,l)}ug(e,b,g);return;case"option":for(var x in n)b=n[x],n.hasOwnProperty(x)&&b!=null&&!o.hasOwnProperty(x)&&(x==="selected"?e.selected=!1:K(e,t,x,null,o,b));for(r in o)b=o[r],g=n[r],o.hasOwnProperty(r)&&b!==g&&(b!=null||g!=null)&&(r==="selected"?(b!==g&&(L=!0),e.selected=b&&typeof b!="function"&&typeof b!="symbol"):K(e,t,r,b,o,g));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var k in n)b=n[k],n.hasOwnProperty(k)&&b!=null&&!o.hasOwnProperty(k)&&K(e,t,k,null,o,b);for(d in o)if(b=o[d],g=n[d],o.hasOwnProperty(d)&&b!==g&&(b!=null||g!=null))switch(d){case"children":case"dangerouslySetInnerHTML":if(b!=null)throw Error(y(137,t));break;default:K(e,t,d,b,o,g)}return;default:if(Zu(t)){for(var z in n)b=n[z],n.hasOwnProperty(z)&&b!==void 0&&!o.hasOwnProperty(z)&&_u(e,t,z,void 0,o,b);for(v in o)b=o[v],g=n[v],!o.hasOwnProperty(v)||b===g||b===void 0&&g===void 0||_u(e,t,v,b,o,g);return}}for(var s in n)b=n[s],n.hasOwnProperty(s)&&b!=null&&!o.hasOwnProperty(s)&&K(e,t,s,null,o,b);for(p in o)b=o[p],g=n[p],!o.hasOwnProperty(p)||b===g||b==null&&g==null||K(e,t,p,b,o,g)}function pb(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function P0(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),o=0;o<n.length;o++){var a=n[o],l=a.transferSize,c=a.initiatorType,i=a.duration;if(l&&i&&pb(c)){for(c=0,i=a.responseEnd,o+=1;o<n.length;o++){var r=n[o],d=r.startTime;if(d>i)break;var v=r.transferSize,p=r.initiatorType;v&&pb(p)&&(r=r.responseEnd,c+=v*(r<i?1:(i-d)/(r-d)))}if(--o,t+=8*(l+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Mu=null,Cu=null;function ml(e){return e.nodeType===9?e:e.ownerDocument}function hb(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function vm(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function mm(e,t,n,o){return n=ml(n).createElement(e),n[_e]=o,n[Pe]=t,De(n,e,t),Ee(n),n}function Hu(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Nr=null;function ey(){var e=window.event;return e&&e.type==="popstate"?e===Nr?!1:(Nr=e,!0):(Nr=null,!1)}var Cd=typeof setTimeout=="function"?setTimeout:void 0,ty=typeof clearTimeout=="function"?clearTimeout:void 0,yb=typeof Promise=="function"?Promise:void 0,xb=typeof requestAnimationFrame=="function"?requestAnimationFrame:Cd,ny=typeof queueMicrotask=="function"?queueMicrotask:typeof yb<"u"?function(e){return yb.resolve(null).then(e).catch(oy)}:Cd;function oy(e){setTimeout(function(){throw e})}function Jn(e){return e==="head"}function kb(e,t){var n=t,o=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(o===0){e.removeChild(a),ka(t);return}o--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")o++;else if(n==="html")Ar(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Ar(n);for(var l=n.firstChild;l;){var c=l.nextSibling,i=l.nodeName;l[El]||i==="SCRIPT"||i==="STYLE"||i==="LINK"&&l.rel.toLowerCase()==="stylesheet"||n.removeChild(l),l=c}}else n==="body"&&Ar(e.ownerDocument.body);n=a}while(n);ka(t)}function Sb(e,t){var n=e;e=0;do{var o=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=o}while(n)}function pm(e,t,n){if(t=CSS.escape(t)!==t?"r-"+btoa(t).replace(/=/g,""):t,e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display==="inline"){if(t=e.getClientRects(),t.length===1)var o=1;else for(var a=o=0;a<t.length;a++){var l=t[a];0<l.width&&0<l.height&&o++}o===1&&(e=e.style,e.display=t.length===1?"inline-block":"block",e.marginTop="-"+n.paddingTop,e.marginBottom="-"+n.paddingBottom)}}function hm(e,t){e=e.style,t=t.style;var n=t!=null?t.hasOwnProperty("viewTransitionName")?t.viewTransitionName:t.hasOwnProperty("view-transition-name")?t["view-transition-name"]:null:null;e.viewTransitionName=n==null||typeof n=="boolean"?"":(""+n).trim(),n=t!=null?t.hasOwnProperty("viewTransitionClass")?t.viewTransitionClass:t.hasOwnProperty("view-transition-class")?t["view-transition-class"]:null:null,e.viewTransitionClass=n==null||typeof n=="boolean"?"":(""+n).trim(),e.display==="inline-block"&&(t==null?e.display=e.margin="":(n=t.display,e.display=n==null||typeof n=="boolean"?"":n,n=t.margin,n!=null?e.margin=n:(n=t.hasOwnProperty("marginTop")?t.marginTop:t["margin-top"],e.marginTop=n==null||typeof n=="boolean"?"":n,t=t.hasOwnProperty("marginBottom")?t.marginBottom:t["margin-bottom"],e.marginBottom=t==null||typeof t=="boolean"?"":t)))}function ym(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position==="absolute"||t.position==="fixed",clip:t.clipPath!=="none"||t.overflow!=="visible"||t.filter!=="none"||t.mask!=="none"||t.mask!=="none"||t.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Du(e){var t=e.getBoundingClientRect(),n=getComputedStyle(e);return ym(t,n,e)}function ay(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return ym(t,n,e)}function ly(e){return e.documentElement.clientHeight}function cy(e){this.addEventListener("load",e),this.addEventListener("error",e)}function iy(e,t,n,o,a,l,c,i,r){var d=t.nodeType===9?t:t.ownerDocument;try{var v=d.startViewTransition({update:function(){var b=d.defaultView,g=b.navigation&&b.navigation.transition,x=d.fonts.status;o();var k=[];if(x==="loaded"&&(ly(d),d.fonts.status==="loading"&&k.push(d.fonts.ready)),x=k.length,e!==null)for(var z=e.suspenseyImages,s=0,u=0;u<z.length;u++){var f=z[u];if(!f.complete){var m=f.getBoundingClientRect();if(0<m.bottom&&0<m.right&&m.top<b.innerHeight&&m.left<b.innerWidth){if(s+=Mm(f),s>Oc){k.length=x;break}f=new Promise(cy.bind(f)),k.push(f)}}}if(0<k.length)return b=Promise.race([Promise.all(k),new Promise(function(h){return setTimeout(h,500)})]).then(a,a),(g?Promise.allSettled([g.finished,b]):b).then(l,l);if(a(),g)return g.finished.then(l,l);l()},types:n});d.__reactViewTransition=v;var p=[];return v.ready.then(function(){for(var b=d.documentElement.getAnimations({subtree:!0}),g=0;g<b.length;g++){var x=b[g],k=x.effect,z=k.pseudoElement;if(z!=null&&z.startsWith("::view-transition")){p.push(x),x=k.getKeyframes();for(var s=z=void 0,u=!0,f=0;f<x.length;f++){var m=x[f],h=m.width;if(z===void 0)z=h;else if(z!==h){u=!1;break}if(h=m.height,s===void 0)s=h;else if(s!==h){u=!1;break}delete m.width,delete m.height,m.transform==="none"&&delete m.transform}u&&z!==void 0&&s!==void 0&&(k.setKeyframes(x),u=getComputedStyle(k.target,k.pseudoElement),u.width!==z||u.height!==s)&&(u=x[0],u.width=z,u.height=s,u=x[x.length-1],u.width=z,u.height=s,k.setKeyframes(x))}}c()},function(b){d.__reactViewTransition===v&&(d.__reactViewTransition=null);try{typeof b=="object"&&b!==null&&b.name==="InvalidStateError"&&(b.message==="View transition was skipped because document visibility state is hidden."||b.message==="Skipping view transition because document visibility state has become hidden."||b.message==="Skipping view transition because viewport size changed."||b.message==="Transition was aborted because of invalid state")&&(b=null),b!==null&&r(b)}finally{o(),a(),c()}}),v.finished.finally(function(){for(var b=0;b<p.length;b++)p[b].cancel();d.__reactViewTransition===v&&(d.__reactViewTransition=null),i()}),v}catch{return o(),a(),c(),null}}function lo(e,t){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+t+")"}lo.prototype.animate=function(e,t){return t=typeof t=="number"?{duration:t}:W({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)};lo.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),o=[],a=0;a<n.length;a++){var l=n[a].effect;l!==null&&l.target===e&&l.pseudoElement===t&&o.push(n[a])}return o};lo.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function xm(e){return{name:e,group:new lo("group",e),imagePair:new lo("image-pair",e),old:new lo("old",e),new:new lo("new",e)}}function st(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}st.prototype.addEventListener=function(e,t,n){var o=null,a=null;if(!(n!=null&&typeof n!="boolean"&&(o=n.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var l=this._eventListeners;if(km(l,e,t,n)===-1){var c=this,i=t;n!=null&&typeof n!="boolean"&&n.once===!0&&(i=function(r){c.removeEventListener(e,t,n),typeof t=="function"?t.call(this,r):t.handleEvent(r)}),o!==null&&(a=c.removeEventListener.bind(c,e,t,n),o.addEventListener("abort",a,{once:!0}),a=o.removeEventListener.bind(o,"abort",a)),o=pa(n),l.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:i,cleanup:a}),Ie(this._fragmentFiber.child,!1,ry,e,i,o)}this._eventListeners=l}};function ry(e,t,n,o){return ke(e).addEventListener(t,n,o),!1}st.prototype.removeEventListener=function(e,t,n){var o=this._eventListeners;if(o!==null&&(t=km(o,e,t,n),t!==-1)){var a=o[t];n=a.attachedListener;var l=a.cleanup;a=pa(a.optionsOrUseCapture),Ie(this._fragmentFiber.child,!1,uy,e,n,a),o.splice(t,1),l!==null&&l()}};function uy(e,t,n,o){return ke(e).removeEventListener(t,n,o),!1}function pa(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function Tb(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function km(e,t,n,o){if(e.length===0)return-1;o=Tb(o);for(var a=0;a<e.length;a++){var l=e[a];if(l.type===t&&l.listener===n&&Tb(l.optionsOrUseCapture)===o)return a}return-1}st.prototype.dispatchEvent=function(e){var t=xo(this._fragmentFiber);if(t===null)return!0;t=ke(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var o=t.nodeType===9?t.createComment(""):document.createTextNode("");if(n)for(var a=0;a<n.length;a++){var l=n[a];o.addEventListener(l.type,l.attachedListener,pa(l.optionsOrUseCapture))}if(t.appendChild(o),e=o.dispatchEvent(e),n)for(a=0;a<n.length;a++)l=n[a],o.removeEventListener(l.type,l.attachedListener,pa(l.optionsOrUseCapture));return t.removeChild(o),e}return t.dispatchEvent(e)};st.prototype.focus=function(e){Ie(this._fragmentFiber.child,!0,Sm,e,void 0,void 0)};function Sm(e,t){return e.tag===6?!1:(e=ke(e),ky(e,t))}st.prototype.focusLast=function(e){var t=[];Ie(this._fragmentFiber.child,!0,Hd,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Sm(t[n],e);n--);};function Hd(e,t){return t.push(e),!1}st.prototype.blur=function(){var e=xo(this._fragmentFiber);e!==null&&(e=ke(e),e=ml(e).activeElement,e!==null&&Ie(this._fragmentFiber.child,!1,dy,e,void 0,void 0))};function dy(e,t){return e.tag===6?!1:(e=ke(e),e===t||e.contains(t)?(t.blur(),!0):!1)}st.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),Ie(this._fragmentFiber.child,!1,sy,e,void 0,void 0)};function sy(e,t){return e.tag===6||(e=ke(e),t.observe(e)),!1}st.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),Ie(this._fragmentFiber.child,!1,fy,e,void 0,void 0);for(var n=t=0;n<Mt.length;n++){var o=Mt[n];o.fragmentInstance===this&&o.observer===e?e.unobserve(o.instance):Mt[t++]=o}Mt.length=t}};function fy(e,t){return e.tag===6||(e=ke(e),t.unobserve(e)),!1}var Mt=[],Or=!1;function by(e,t,n){Mt.push({fragmentInstance:e,observer:t,instance:n}),Or||(Or=!0,Sy(function(){Or=!1;var o=Mt;Mt=[];for(var a=0;a<o.length;a++){var l=o[a];l.observer.unobserve(l.instance)}}))}st.prototype.getClientRects=function(){var e=[];return Ie(this._fragmentFiber.child,!1,gy,e,void 0,void 0),e};function gy(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=ke(e),t.push.apply(t,e.getClientRects());return!1}st.prototype.getRootNode=function(e){var t=xo(this._fragmentFiber);return t===null?this:ke(t).getRootNode(e)};st.prototype.compareDocumentPosition=function(e){var t=xo(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];Ie(this._fragmentFiber.child,!1,Hd,n,void 0,void 0);var o=ke(t);if(n.length===0){if(n=o,tf(this._fragmentFiber)){e:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break e}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var a=o=n.compareDocumentPosition(e);return n===e?a=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=Xb(t)[1],n===null?a=Node.DOCUMENT_POSITION_PRECEDING:(e=ke(n).compareDocumentPosition(e),a=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),a|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=ke(n[0]),a=ke(n[n.length-1]);var l=tf(this._fragmentFiber)?t.parentElement:o;if(l==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=l.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,l=l.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_CONTAINED_BY;var c=t.compareDocumentPosition(e),i=a.compareDocumentPosition(e),r=c&Node.DOCUMENT_POSITION_CONTAINED_BY||i&Node.DOCUMENT_POSITION_CONTAINED_BY;return i=o&&l&&c&Node.DOCUMENT_POSITION_FOLLOWING&&i&Node.DOCUMENT_POSITION_PRECEDING,t=o&&t===e||l&&a===e||r||i?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&t===e||!l&&a===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:c,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||vy(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function vy(e,t,n,o,a){var l=ao(a);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!l)e:{for(;l!==null;){if(l.tag===7&&(l===t||l.alternate===t)){n=!0;break e}l=l.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(l===null)return l=a.ownerDocument,a===l||a===l.documentElement||a===l.body;e:{for(l=t,t=xo(t);l!==null;){if(!(l.tag!==5&&l.tag!==3&&l.tag!==27||l!==t&&l.alternate!==t)){l=!0;break e}l=l.return}l=!1}return l}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!l)&&!(t=l===n)&&(t=Mr(n,l,nf),t===null?t=!1:(Ie(t,!0,Qp,l,n),l=Yo,Yo=null,t=l!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!l)&&!(t=l===o)&&(t=Mr(o,l,nf),t===null?t=!1:(Ie(t,!0,Zp,l,o),l=Yo,_r=Yo=null,t=l!==null)),t):!1}function wb(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}st.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(y(566));var t=[];Ie(this._fragmentFiber.child,!1,Hd,t,void 0,void 0);var n=e!==!1;if(t.length===0){var o=Xb(this._fragmentFiber);if(o=n?o[1]||o[0]||xo(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){e=ke(o),wb(e,n);return}if(o=ke(o),o.nodeType!==9){if(o.nodeType===11){n="host"in o?o.host:null,n!==null&&n.scrollIntoView(e);return}o.scrollIntoView(e)}}for(o=n?t.length-1:0;o!==(n?-1:t.length);){var a=t[o];a.tag===6?(a=ke(a),wb(a,n)):ke(a).scrollIntoView(e),o+=n?-1:1}};function my(e,t){return e=ke(e),Tm(e,t),!1}function Tm(e,t){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(t)}function wm(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.addEventListener(a.type,a.attachedListener,pa(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){for(var c=0,i=0;i<Mt.length;i++){var r=Mt[i];(r.fragmentInstance!==t||r.observer!==l||r.instance!==e)&&(Mt[c++]=r)}Mt.length=c,l.observe(e)}),Tm(e,t))}function py(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.removeEventListener(a.type,a.attachedListener,pa(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){typeof l.rootMargin=="string"?by(t,l,e):l.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function Ru(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Ru(n),ii(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function hy(e,t,n,o){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[El])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var l=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=wt(e.nextSibling),e===null)break}return null}function yy(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=wt(e.nextSibling),e===null))return null;return e}function Em(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=wt(e.nextSibling),e===null))return null;return e}function Uu(e){return e.data==="$?"||e.data==="$~"}function Dd(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function xy(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var o=function(){t(),n.removeEventListener("DOMContentLoaded",o)};n.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function wt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Bu=null;function Eb(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return wt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function zb(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function ky(e,t){function n(){o=!0}if(e.ownerDocument.activeElement===e)return!0;var o=!1;try{e.ownerDocument.addEventListener("focus",n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener("focus",n,!0)}return o}function Sy(e){xb(function(){xb(function(t){return e(t)})})}function zm(e,t,n){switch(t=ml(n),e){case"html":if(e=t.documentElement,!e)throw Error(y(452));return e;case"head":if(e=t.head,!e)throw Error(y(453));return e;case"body":if(e=t.body,!e)throw Error(y(454));return e;default:throw Error(y(451))}}function Nm(e,t,n){for(var o in n){var a=n[o];n.hasOwnProperty(o)&&a!=null&&K(e,t,o,null,W0,a)}n.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===Gt&&(e.onclick=null),ii(e)}function Ar(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);ii(e)}var Et=new Map,Nb=new Set;function pl(e){if(typeof e.getRootNode=="function"){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var gn=V.d;V.d={f:Ty,r:wy,D:Ey,C:zy,L:Ny,m:Oy,X:_y,S:Ay,M:My};function Ty(){var e=gn.f(),t=ki();return e||t}function wy(e){var t=Ta(e);t!==null&&t.tag===5&&t.type==="form"?sv(t):gn.r(e)}var Na=typeof document>"u"?null:document;function Om(e,t,n){var o=Na;if(o&&typeof t=="string"&&t){var a=kt(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),Nb.has(a)||(Nb.add(a),e={rel:e,crossOrigin:n,href:t},o.querySelector(a)===null&&(t=o.createElement("link"),De(t,"link",e),Ee(t),o.head.appendChild(t)))}}function Ey(e){gn.D(e),Om("dns-prefetch",e,null)}function zy(e,t){gn.C(e,t),Om("preconnect",e,t)}function Ny(e,t,n){gn.L(e,t,n);var o=Na;if(o&&e&&t){var a='link[rel="preload"][as="'+kt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+kt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+kt(n.imageSizes)+'"]')):a+='[href="'+kt(e)+'"]';var l=a;switch(t){case"style":l=ha(e);break;case"script":l=Oa(e)}if(!(Et.has(l)||(e=W({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Et.set(l,e),o.querySelector(a)!==null||t==="style"&&o.querySelector(Ml(l))||t==="script"&&o.querySelector(Cl(l))))){var c=o.createElement("link");De(c,"link",e),t==="style"&&(c[Rc]=!0,c.onload=c.onerror=function(){og(c)}),Ee(c),o.head.appendChild(c)}}}function Oy(e,t){gn.m(e,t);var n=Na;if(n&&e){var o=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+kt(o)+'"][href="'+kt(e)+'"]',l=a;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=Oa(e)}if(!Et.has(l)&&(e=W({rel:"modulepreload",href:e},t),Et.set(l,e),n.querySelector(a)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Cl(l)))return}o=n.createElement("link"),De(o,"link",e),Ee(o),n.head.appendChild(o)}}}function Ay(e,t,n){gn.S(e,t,n);var o=Na;if(o&&e){var a=Po(o).hoistableStyles,l=ha(e);t=t||"default";var c=a.get(l);if(!c){var i={loading:0,preload:null};if(c=o.querySelector(Ml(l)))i.loading=5;else{e=W({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Et.get(l))&&Rd(e,n);var r=c=o.createElement("link");Ee(r),De(r,"link",e),r._p=new Promise(function(d,v){r.onload=d,r.onerror=v}),r.addEventListener("load",function(){i.loading|=1}),r.addEventListener("error",function(){i.loading|=2}),i.loading|=4,zc(c,t,o)}c={type:"stylesheet",instance:c,count:1,state:i},a.set(l,c)}}}function _y(e,t){gn.X(e,t);var n=Na;if(n&&e){var o=Po(n).hoistableScripts,a=Oa(e),l=o.get(a);l||(l=n.querySelector(Cl(a)),l||(e=W({src:e,async:!0},t),(t=Et.get(a))&&Ud(e,t),l=n.createElement("script"),Ee(l),De(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function My(e,t){gn.M(e,t);var n=Na;if(n&&e){var o=Po(n).hoistableScripts,a=Oa(e),l=o.get(a);l||(l=n.querySelector(Cl(a)),l||(e=W({src:e,async:!0,type:"module"},t),(t=Et.get(a))&&Ud(e,t),l=n.createElement("script"),Ee(l),De(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function Ob(e,t,n,o){var a=(a=Cn.current)?pl(a):null;if(!a)throw Error(y(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(n=ha(n.href),t=Po(a).hoistableStyles,o=t.get(n),o||(o={type:"style",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=ha(n.href);var l=Po(a).hoistableStyles,c=l.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,c),(l=a.querySelector(Ml(e)))?l._p||(c.instance=l,c.state.loading=5):(l=Et.get(e),l||(l={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Et.set(e,l)),Cy(a,e,l,c.state))),t&&o===null)throw Error(y(528,""));return c}if(t&&o!==null)throw Error(y(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(n=Oa(n),t=Po(a).hoistableScripts,o=t.get(n),o||(o={type:"script",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(y(444,e))}}function ha(e){return'href="'+kt(e)+'"'}function Ml(e){return'link[rel="stylesheet"]['+e+"]"}function Am(e){return W({},e,{"data-precedence":e.precedence,precedence:null})}function Cy(e,t,n,o){if(t=e.querySelector('link[rel="preload"][as="style"]['+t+"]")){if(t[Rc]!==!0){o.loading=1;return}}else t=e.createElement("link"),t[Rc]=!0,t.onload=t.onerror=og.bind(null,t),De(t,"link",n),Ee(t),e.head.appendChild(t);o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2})}function Oa(e){return'[src="'+kt(e)+'"]'}function Cl(e){return"script[async]"+e}function Ab(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+kt(n.href)+'"]');if(o)return t.instance=o,Ee(o),o;var a=W({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),Ee(o),De(o,"style",a),zc(o,n.precedence,e),t.instance=o;case"stylesheet":a=ha(n.href);var l=e.querySelector(Ml(a));if(l)return t.state.loading|=4,t.instance=l,Ee(l),l;o=Am(n),(a=Et.get(a))&&Rd(o,a),l=(e.ownerDocument||e).createElement("link"),Ee(l);var c=l;return c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),De(l,"link",o),t.state.loading|=4,zc(l,n.precedence,e),t.instance=l;case"script":return l=Oa(n.src),(a=e.querySelector(Cl(l)))?(t.instance=a,Ee(a),a):(o=n,(a=Et.get(l))&&(o=W({},n),Ud(o,a)),e=e.ownerDocument||e,a=e.createElement("script"),Ee(a),De(a,"link",o),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(y(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,zc(o,n.precedence,e));return t.instance}function zc(e,t,n){for(var o=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=o.length?o[o.length-1]:null,l=a,c=0;c<o.length;c++){var i=o[c];if(i.dataset.precedence===t)l=i;else if(l!==a)break}l?l.parentNode.insertBefore(e,l.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Ud(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Nc=null;function _b(e,t,n){if(Nc===null){var o=new Map,a=Nc=new Map;a.set(n,o)}else a=Nc,o=a.get(n),o||(o=new Map,a.set(n,o));if(o.has(e))return o;for(o.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var l=n[a];if(!(l[El]||l[_e]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var c=l.getAttribute(t)||"";c=e+c;var i=o.get(c);i?i.push(l):o.set(c,[l])}}return o}function qu(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function Hy(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Mb(e,t){return e==="img"&&t.src!=null&&t.src!==""&&t.onLoad==null&&t.loading!=="lazy"}function _m(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Mm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function Cb(e,t){typeof t.decode=="function"&&(e.imgCount++,t.complete||(e.imgBytes+=Mm(t),e.suspenseyImages.push(t)),e=Uy.bind(e),t.decode().then(e,e))}function Dy(e,t,n,o){if(n.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=ha(o.href),l=t.querySelector(Ml(a));if(l){t=l._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=hl.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=l,Ee(l);return}l=t.ownerDocument||t,o=Am(o),(a=Et.get(a))&&Rd(o,a),l=l.createElement("link"),Ee(l);var c=l;c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),De(l,"link",o),n.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=hl.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Oc=0;function Ry(e,t){return e.stylesheets&&e.count===0&&Ac(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var o=setTimeout(function(){if(e.stylesheets&&Ac(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+t);0<e.imgBytes&&Oc===0&&(Oc=62500*P0());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Ac(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>Oc?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(a)}}:null}function Cm(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)Ac(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function hl(){this.count--,Cm(this)}function Uy(){this.imgCount--,Cm(this)}var ai=null;function Ac(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ai=new Map,t.forEach(By,e),ai=null,hl.call(e))}function By(e,t){if(!(t.state.loading&4)){var n=ai.get(e);if(n)var o=n.get(null);else{n=new Map,ai.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<a.length;l++){var c=a[l];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),o=c)}o&&n.set(null,o)}a=t.instance,c=a.getAttribute("data-precedence"),l=n.get(c)||o,l===o&&n.set(null,a),n.set(c,a),this.count++,o=hl.bind(this),a.addEventListener("load",o),a.addEventListener("error",o),l?l.parentNode.insertBefore(a,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var ya={$$typeof:Yt,Provider:null,Consumer:null,_currentValue:co,_currentValue2:co,_threadCount:0};function qy(e,t,n,o,a,l,c,i,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=or(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=or(0),this.hiddenUpdates=or(null),this.identifierPrefix=o,this.onUncaughtError=a,this.onCaughtError=l,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.transitionTypes=null,this.incompleteTransitions=new Map}function Hm(e,t,n,o,a,l,c,i,r,d,v,p){return e=new qy(e,t,n,c,r,d,v,p,i),t=1,l===!0&&(t|=24),l=Fe(3,null,null,t),e.current=l,l.stateNode=e,t=nd(),t.refCount++,e.pooledCache=t,t.refCount++,l.memoizedState={element:o,isDehydrated:n,cache:t},ld(l),e}function Dm(e){return e?(e=$o,e):$o}function Rm(e,t,n,o,a,l){a=Dm(a),o.context===null?o.context=a:o.pendingContext=a,o=Dn(t),o.payload={element:n},l=l===void 0?null:l,l!==null&&(o.callback=l),n=Rn(e,o,t),n!==null&&(We(n,e,t),Fa(n,e,t))}function Hb(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Bd(e,t){Hb(e,t),(e=e.alternate)&&Hb(e,t)}function Um(e){if(e.tag===13||e.tag===31){var t=To(e,67108864);t!==null&&We(t,e,67108864),Bd(e,67108864)}}function Db(e){if(e.tag===13||e.tag===31){var t=ut();t=Xu(t);var n=To(e,t);n!==null&&We(n,e,t),Bd(e,t)}}var xa=!0;function jy(e,t,n,o){var a=M.T;M.T=null;var l=V.p;try{V.p=2,qd(e,t,n,o)}finally{V.p=l,M.T=a}}function Ly(e,t,n,o){var a=M.T;M.T=null;var l=V.p;try{V.p=8,qd(e,t,n,o)}finally{V.p=l,M.T=a}}function qd(e,t,n,o){if(xa){var a=ju(o);if(a===null)zr(e,t,o,li,n),Rb(e,o);else if(Gy(a,e,t,n,o))o.stopPropagation();else if(Rb(e,o),t&4&&-1<Yy.indexOf(e)){for(;a!==null;){var l=Ta(a);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var c=to(l.pendingLanes);if(c!==0){var i=l;for(i.pendingLanes|=2,i.entangledLanes|=2;c;){var r=1<<31-rt(c);i.entanglements[1]|=r,c&=~r}$t(l),(G&6)===0&&(Pc=ct()+500,_l(0,!1))}}break;case 31:case 13:i=To(l,2),i!==null&&We(i,l,2),ki(),Bd(l,2)}if(l=ju(o),l===null&&zr(e,t,o,li,n),l===a)break;a=l}a!==null&&o.stopPropagation()}else zr(e,t,o,null,n)}}function ju(e){return e=Ku(e),jd(e)}var li=null;function jd(e){if(li=null,e=ao(e),e!==null){var t=kl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=Yb(t),e!==null)return e;e=null}else if(n===31){if(e=Gb(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return li=e,null}function Bm(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(th()){case Jb:return 2;case $b:return 8;case Dc:case nh:return 32;case Fb:return 268435456;default:return 32}default:return 32}}var Lu=!1,jn=null,Ln=null,Yn=null,yl=new Map,xl=new Map,En=[],Yy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Rb(e,t){switch(e){case"focusin":case"focusout":jn=null;break;case"dragenter":case"dragleave":Ln=null;break;case"mouseover":case"mouseout":Yn=null;break;case"pointerover":case"pointerout":yl.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":xl.delete(t.pointerId)}}function ja(e,t,n,o,a,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:l,targetContainers:[a]},t!==null&&(t=Ta(t),t!==null&&Um(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function Gy(e,t,n,o,a){switch(t){case"focusin":return jn=ja(jn,e,t,n,o,a),!0;case"dragenter":return Ln=ja(Ln,e,t,n,o,a),!0;case"mouseover":return Yn=ja(Yn,e,t,n,o,a),!0;case"pointerover":var l=a.pointerId;return yl.set(l,ja(yl.get(l)||null,e,t,n,o,a)),!0;case"gotpointercapture":return l=a.pointerId,xl.set(l,ja(xl.get(l)||null,e,t,n,o,a)),!0}return!1}function qm(e){var t=ao(e.target);if(t!==null){var n=kl(t);if(n!==null){if(t=n.tag,t===13){if(t=Yb(n),t!==null){e.blockedOn=t,cf(e.priority,function(){Db(n)});return}}else if(t===31){if(t=Gb(n),t!==null){e.blockedOn=t,cf(e.priority,function(){Db(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function _c(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ju(e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);Vr=o,n.target.dispatchEvent(o),Vr=null}else return t=Ta(n),t!==null&&Um(t),e.blockedOn=n,!1;t.shift()}return!0}function Ub(e,t,n){_c(e)&&n.delete(t)}function Vy(){Lu=!1,jn!==null&&_c(jn)&&(jn=null),Ln!==null&&_c(Ln)&&(Ln=null),Yn!==null&&_c(Yn)&&(Yn=null),yl.forEach(Ub),xl.forEach(Ub)}function dc(e,t){e.blockedOn===t&&(e.blockedOn=null,Lu||(Lu=!0,Se.unstable_scheduleCallback(Se.unstable_NormalPriority,Vy)))}var sc=null;function Bb(e){sc!==e&&(sc=e,Se.unstable_scheduleCallback(Se.unstable_NormalPriority,function(){sc===e&&(sc=null);for(var t=0;t<e.length;t+=3){var n=e[t],o=e[t+1],a=e[t+2];if(typeof o!="function"){if(jd(o||n)===null)continue;break}var l=Ta(n);l!==null&&(e.splice(t,3),t-=3,lu(l,{pending:!0,data:a,method:n.method,action:o},o,a))}}))}function ka(e){function t(r){return dc(r,e)}jn!==null&&dc(jn,e),Ln!==null&&dc(Ln,e),Yn!==null&&dc(Yn,e),yl.forEach(t),xl.forEach(t);for(var n=0;n<En.length;n++){var o=En[n];o.blockedOn===e&&(o.blockedOn=null)}for(;0<En.length&&(n=En[0],n.blockedOn===null);)qm(n),n.blockedOn===null&&En.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(o=0;o<n.length;o+=3){var a=n[o],l=n[o+1],c=a[Pe]||null;if(typeof l=="function")c||Bb(n);else if(c){var i=null;if(l&&l.hasAttribute("formAction")){if(a=l,c=l[Pe]||null)i=c.formAction;else if(jd(a)!==null)continue}else i=c.action;typeof i=="function"?n[o+1]=i:(n.splice(o,3),o-=3),Bb(n)}}}function jm(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),o||setTimeout(n,20)}function n(){if(!o&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Ld(e){this._internalRoot=e}wi.prototype.render=Ld.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(y(409));var n=t.current,o=ut();Rm(n,o,e,t,null,null)};wi.prototype.unmount=Ld.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Rm(e.current,2,null,e,null,null),ki(),t[Sa]=null}};function wi(e){this._internalRoot=e}wi.prototype.unstable_scheduleHydration=function(e){if(e){var t=ng();e={blockedOn:null,target:e,priority:t};for(var n=0;n<En.length&&t!==0&&t<En[n].priority;n++);En.splice(n,0,e),n===0&&qm(e)}};var qb=jb.version;if(qb!=="19.3.0")throw Error(y(527,qb,"19.3.0"));V.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(y(188)):(e=Object.keys(e).join(","),Error(y(268,e)));return e=Xp(t),e=e!==null?Vb(e):null,e=e===null?null:e.stateNode,e};var Xy={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:M,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(La=__REACT_DEVTOOLS_GLOBAL_HOOK__,!La.isDisabled&&La.supportsFiber))try{Sl=La.inject(Xy),it=La}catch{}var La;Ei.createRoot=function(e,t){if(!Lb(e))throw Error(y(299));var n=!1,o="",a=yv,l=xv,c=kv;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(l=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=Hm(e,1,!1,null,null,n,o,null,a,l,c,jm),e[Sa]=t.current,Md(e),new Ld(t)};Ei.hydrateRoot=function(e,t,n){if(!Lb(e))throw Error(y(299));var o=!1,a="",l=yv,c=xv,i=kv,r=null;return n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(l=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(i=n.onRecoverableError),n.formState!==void 0&&(r=n.formState)),t=Hm(e,1,!0,t,n??null,o,a,r,l,c,i,jm),t.context=Dm(null),n=t.current,o=ut(),o=Xu(o),a=Dn(o),a.callback=null,Rn(n,a,o),n=o,t.current.lanes=n,wl(t,n),$t(t),e[Sa]=t.current,Md(e),new wi(t)};Ei.version="19.3.0"});var Vm=Dt((tx,Gm)=>{"use strict";function Ym(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ym)}catch(e){console.error(e)}}Ym(),Gm.exports=Lm()});var Gd=`/*---------------------------------------------------------------------------------------------
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
`;var zi=["claude","codex","opencode","agy"];var zo=e=>typeof e=="number"&&Number.isFinite(e),he=e=>typeof e=="boolean",H=e=>t=>typeof t=="string"&&t.length<=e,Nt=e=>t=>typeof t=="string"&&e.test(t),A=e=>t=>t===void 0||e(t),Ft=(...e)=>t=>typeof t=="string"&&e.includes(t),tp=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),$n=e=>t=>tp(t)&&Object.entries(e).every(([n,o])=>o(t[n])),bt=(e,t=1e5)=>n=>Array.isArray(n)&&n.length<=t&&n.every(e);var i1=512*1024,np=["text/plain","image/png","image/jpeg"],op=8e3;var r1=1024*1024,ap=64*1024*1024,lp=["element","screenshot","recording","errors","network","page","report","css","measure","color","text"],Rl=/^\d{8}-\d{6}-[0-9a-f]{6}$/,Ni=/^[\w-]{1,40}\.[a-z0-9]{1,5}$/;function No(e){return e.vscode||e.agentmux}var mn=Nt(/^[\w.-]{1,64}$/),Bl=H(ap),cp=H(4096),u1={auth:{token:H(128),role:Ft("browser","vscode"),origin:A(H(256))}},ce=Nt(/^[\w-]{1,64}$/),Be=H(4096),Vd=Ft(...lp),Ul=Nt(/^[A-Za-z0-9+/]*={0,2}$/),ip=$n({kind:Vd,title:H(300),detail:A(H(1e3)),text:A(H(5e6)),group:A(mn),groupIndex:A(zo),image:A(Ul),thumb:A(e=>typeof e=="string"&&e.length<=4e5&&Ul(e))}),Xd=$n({id:H(200),kind:Ft("tmux","terminal","chat"),label:H(100),detail:H(300),closed:A(he)}),Qd=A(H(op)),Fn=bt(Nt(Rl),60),d1={link:{data:Bl},ping:{},"projects.get":{req:ce,url:A(H(4096))},"capture.save":{req:ce,project:Be,url:A(H(4096)),browser:A(H(100)),captures:bt(ip,60),send:A(H(200))},"item.send":{req:ce,project:Be,ids:Fn,target:A(H(200)),open:A(he),prompt:Qd},"items.move":{req:ce,project:Be,ids:Fn,to:Be},"items.get":{req:ce,project:Be},"item.thumb":{req:ce,project:Be,id:Nt(Rl)},"item.remove":{req:ce,project:Be,ids:Fn},"item.restore":{req:ce,project:Be,ids:Fn},"item.content":{req:ce,project:Be,id:Nt(Rl),offset:e=>Number.isSafeInteger(e)&&e>=0},"agentmux.start":{req:ce,project:Be,harness:Ft(...zi)},"items.group":{req:ce,project:Be,ids:Fn},"items.ungroup":{req:ce,project:Be,group:mn},"project.pin":{req:ce,project:Be,pinned:he}},rp=$n({path:Be,name:H(300),vscode:he,agentmux:he,saved:he,pinned:he,targets:A(bt(Xd,50)),defaultTarget:A(H(200)),harnesses:A(bt(Ft(...zi),10)),inbox:A(he)}),up=$n({v:e=>e===1,id:Nt(Rl),kind:Vd,title:H(300),detail:A(H(1e3)),url:A(H(4096)),time:zo,group:A(mn),groupIndex:A(zo),key:A(H(200)),source:Ft("browser","vscode"),browser:A(H(100)),preview:A(H(1e3)),files:$n({file:A(Nt(Ni)),text:A(Nt(Ni)),thumb:A(Nt(Ni))}),sentTo:bt(H(200),50)}),s1={link:{data:Bl},status:{vscode:he,peer:A(H(200)),features:A(bt(H(40),50))},relink:{},pong:{},projects:{req:ce,projects:bt(rp,500),suggested:A(Be)},"capture.saved":{req:ce,ok:he,ids:A(Fn),error:A(H(1e3)),sentTo:A(H(200))},"item.sent":{req:ce,ok:he,sentTo:A(H(200)),error:A(H(1e3))},items:{req:ce,ok:he,items:bt(up,500),error:A(H(1e3))},started:{req:ce,ok:he,target:A(H(200)),error:A(H(1e3))},content:{req:ce,ok:he,mimeType:A(Ft(...np)),size:A(zo),data:A(Ul),error:A(H(1e3))},thumb:{req:ce,data:A(Ul),mimeType:A(Ft("image/jpeg","image/png"))},done:{req:ce,ok:he,error:A(H(1e3))}},f1={window:{id:mn,name:H(200),folders:bt(cp,50),focusedAt:zo,targets:A(bt(Xd,50))},link:{browser:mn,data:Bl},shutdown:{},ping:{},"run.sent":{req:ce,ok:he,sentTo:A(H(200)),error:A(H(1e3))}},dp=$n({id:mn,name:H(100),origin:H(256)}),b1={welcome:{build:H(100),leader:he},leader:{leader:he},browsers:{browsers:bt(dp,50)},link:{browser:mn,data:Bl},gone:{browser:mn},pong:{},"run.send":{req:ce,project:Be,ids:Fn,target:H(200),prompt:Qd}};var Oi={element:"inspect",screenshot:"device-camera",recording:"record",errors:"error",network:"globe",page:"browser",report:"checklist",css:"symbol-color",measure:"symbol-ruler",color:"symbol-color",text:"note"},Ai={element:"Element",screenshot:"Screenshot",recording:"Recording",errors:"Console errors",network:"Failed requests",page:"Page context",report:"Report",css:"CSS changes",measure:"Measurements",color:"Color",text:"Text"};function _i(e,t=Date.now()){let n=Math.max(0,Math.round((t-e)/1e3));if(n<45)return"just now";let o=Math.round(n/60);if(o<60)return`${o} min ago`;let a=Math.round(o/60);return a<24?`${a} h ago`:new Date(e).toLocaleDateString()}function Zd(e){let t=[],n=new Set;for(let o of e){if(!o.group){t.push({kind:"item",key:o.id,item:o});continue}if(n.has(o.group))continue;n.add(o.group);let a=e.filter(l=>l.group===o.group).sort((l,c)=>(l.groupIndex??0)-(c.groupIndex??0)||l.time-c.time);t.push(a.length>1?{kind:"group",key:`group:${o.group}`,group:o.group,items:a}:{kind:"item",key:o.id,item:o})}return t}var Mi=e=>e.kind==="item"?[e.item.id]:e.items.map(t=>t.id);function Kd(e){if(e.every(o=>o.kind==="element"))return"Elements";let t=new Set(e.map(o=>o.title.replace(/\s+\d+\s+of\s+\d+$/,""))),[n]=t;return t.size===1&&n?n:"Screenshots"}function Jd(e){return{id:e.id,kind:e.kind,title:e.title,detail:e.detail,preview:e.preview,image:!!(e.files.thumb||e.files.file&&e.kind!=="recording"),url:e.url,time:e.time,sentTo:e.sentTo,group:e.group,groupIndex:e.groupIndex,source:e.source==="browser"?e.browser??"Browser":"VS Code"}}function $d(e){return e.inbox?"captures without a project":[e.vscode&&"VS Code",e.agentmux&&"agentmux",!No(e)&&e.saved&&"saved",e.pinned&&"pinned"].filter(Boolean).join(" \xB7 ")}function Fd(e,t){let n=e.find(a=>a.id===t),o=e.filter(a=>a!==n);return[...n?[n]:[],...o.filter(a=>!a.closed),...o.filter(a=>a.closed)]}function Aa(e){return e.closed?`${e.detail} \xB7 agentmux is closed`:e.detail}function Wd(e,t){return e?.closed?`agentmux was closed: opened it and sent to ${t}`:`Sent to ${t}`}function Ci(e){return e.kind==="chat"?"comment-discussion":e.kind==="tmux"?"terminal-tmux":"terminal"}var Id=`/* VS Code theme variables for hosts outside VS Code (the browser extension's pages): a dark and
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
`;var fp='[data-glass-scroll="off"]',Hi=(e,t,n)=>Math.min(n,Math.max(t,e));function Pd(e){let t=e instanceof Document?e:e.ownerDocument,n=t.createElement("div");n.className="ink-scroll-layer",n.setAttribute("aria-hidden","true"),(e instanceof Document?t.body??t.documentElement:e).append(n);let o=new Map,a=new Set,l=0,c=u=>u===t.scrollingElement?{left:0,top:0}:(({left:f,top:m})=>({left:f+u.clientLeft,top:m+u.clientTop}))(u.getBoundingClientRect()),i=(u,f)=>{let{left:m,top:h}=c(u);for(let w of["y","x"]){let T=f.thumbs[w],E=w==="y"?u.clientHeight:u.clientWidth,C=w==="y"?u.scrollHeight:u.scrollWidth,_=w==="y"?u.scrollTop:u.scrollLeft,Y=C-E;if(Y<1||E<=0){T.hidden=!0;continue}let pe=E-6,N=Hi(E/C*pe,Math.min(32,pe),pe),Q=3+Hi(_,0,Y)/Y*(pe-N);T.hidden=!1,w==="y"?(T.style.left=`${m+u.clientWidth-3}px`,T.style.top=`${h+Q}px`,T.style.height=`${N}px`):(T.style.left=`${m+Q}px`,T.style.top=`${h+u.clientHeight-3}px`,T.style.width=`${N}px`)}},r=u=>{let f=o.get(u);if(f){clearTimeout(f.timer),o.delete(u);for(let m of Object.values(f.thumbs))m.classList.remove("visible"),setTimeout(()=>m.remove(),300)}},d=(u,f)=>{clearTimeout(f.timer),f.timer=setTimeout(()=>{f.held||r(u)},1100)},v=u=>{let f={thumbs:{y:p(u,"y"),x:p(u,"x")},held:!1};for(let m of Object.values(f.thumbs))n.append(m),m.addEventListener("pointerenter",()=>{f.held=!0,clearTimeout(f.timer)}),m.addEventListener("pointerleave",()=>{m.classList.contains("dragging")||(f.held=!1,d(u,f))});return o.set(u,f),f};function p(u,f){let m=t.createElement("div");return m.className=`ink-scroll-thumb ${f}`,m.addEventListener("pointerdown",h=>{if(h.button!==0)return;h.preventDefault(),h.stopPropagation(),m.setPointerCapture(h.pointerId),m.classList.add("dragging");let w=f==="y"?h.clientY:h.clientX,T=f==="y"?u.scrollTop:u.scrollLeft,E=f==="y"?u.clientHeight:u.clientWidth,C=(f==="y"?u.scrollHeight:u.scrollWidth)-E,_=E-6-(f==="y"?m.offsetHeight:m.offsetWidth),Y=N=>{if(_<=0)return;let Q=(f==="y"?N.clientY:N.clientX)-w,ue=Hi(T+Q/_*C,0,C);f==="y"?u.scrollTop=ue:u.scrollLeft=ue},pe=()=>{m.classList.remove("dragging"),m.removeEventListener("pointermove",Y),m.removeEventListener("pointerup",pe),m.removeEventListener("pointercancel",pe);let N=o.get(u);N&&!m.matches(":hover")&&(N.held=!1,d(u,N))};m.addEventListener("pointermove",Y),m.addEventListener("pointerup",pe),m.addEventListener("pointercancel",pe)}),m}let b=u=>{if(u.closest(fp))return;let f=o.get(u)??v(u);d(u,f),a.add(u),l||=requestAnimationFrame(()=>{l=0;for(let m of a){let h=o.get(m);if(h){if(!m.isConnected){r(m);continue}i(m,h);for(let w of Object.values(h.thumbs))w.classList.add("visible")}}a.clear()})},g=u=>{let f=u.target;f===t?b(t.scrollingElement):f instanceof HTMLElement&&f!==n&&b(f)},x=({path:u,x:f,y:m})=>{for(let h of u){if(h===e||!(h instanceof HTMLElement))break;if(h.parentNode===n)return;let w=h.scrollHeight-h.clientHeight>=1,T=h.scrollWidth-h.clientWidth>=1;if(!w&&!T)continue;let E=getComputedStyle(h),C=w&&/auto|scroll/.test(E.overflowY),_=T&&/auto|scroll/.test(E.overflowX);if(!C&&!_)continue;let{left:Y,top:pe}=c(h);(C&&f>=Y+h.clientWidth-14||_&&m>=pe+h.clientHeight-14)&&b(h);return}},k,z=0,s=u=>{u.buttons||(k={path:u.composedPath(),x:u.clientX,y:u.clientY},z||=requestAnimationFrame(()=>{z=0,k&&x(k)}))};return e.addEventListener("scroll",g,{capture:!0,passive:!0}),e.addEventListener("pointermove",s,{capture:!0,passive:!0}),()=>{e.removeEventListener("scroll",g,{capture:!0}),e.removeEventListener("pointermove",s,{capture:!0}),cancelAnimationFrame(l),cancelAnimationFrame(z);for(let u of[...o.keys()])r(u);n.remove()}}var es=`/* The Inkspect design system: tokens and the shared components (buttons, fields, selects,
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
`;var Di=I(ye(),1);function gt({icon:e,label:t,onClick:n,onContextMenu:o,disabled:a,active:l,spin:c,className:i}){return(0,Di.jsx)("button",{type:"button",className:["icon-button",l&&"active",i].filter(Boolean).join(" "),title:t,"aria-label":t,"aria-pressed":l,disabled:a,onClick:n,onContextMenu:o,children:(0,Di.jsx)("span",{className:`codicon codicon-${e}${c?" codicon-modifier-spin":""}`,"aria-hidden":"true"})})}var et=I(Wt(),1);var Ll=I(Wt(),1);function hs(e,t,n,o={}){let{align:a="start",gap:l=4,matchWidth:c=!1}=o;(0,Ll.useLayoutEffect)(()=>{if(!n)return;let i=()=>{e.current&&t.current&&Hp(e.current,t.current,{align:a,gap:l,matchWidth:c})};i();let r=new ResizeObserver(i);return t.current&&r.observe(t.current),()=>r.disconnect()},[e,t,n,a,l,c])}function Vi(){let e=document.documentElement;return{width:e.clientWidth||innerWidth,height:e.clientHeight||innerHeight}}function Hp(e,t,{align:n,gap:o,matchWidth:a}){let l=e.getBoundingClientRect();a&&(t.style.minWidth=`${l.width}px`);let c=Vi(),i=4;t.style.maxWidth=`${c.width-2*i}px`;let r=t.getBoundingClientRect(),d=l.bottom+o,v=d+r.height<=c.height-i,p=l.top-o-r.height,b=v||p<i?d:p,g=n==="end"?l.right-r.width:l.left;t.style.top=`${Math.max(i,Math.min(b,c.height-r.height-i))}px`,t.style.left=`${Math.max(i,Math.min(g,c.width-r.width-i))}px`,t.dataset.side=b===d?"bottom":"top"}function Gi(e,t,n){let o=e().find(Boolean)?.getRootNode(),a=o instanceof ShadowRoot?o:void 0,l=r=>e().some(d=>d&&r.composedPath().includes(d)),c=r=>{a&&r.composedPath().includes(a.host)||l(r)||n(r)},i=r=>{l(r)||n(r)};return window.addEventListener(t,c,!0),a?.addEventListener(t,i,!0),()=>{window.removeEventListener(t,c,!0),a?.removeEventListener(t,i,!0)}}var _a,Dp=e=>{let t=e.composedPath()[0];if(e.button!==0){_a=void 0;return}t instanceof Element&&(_a={element:t.closest('button, [role="button"], a')??t,at:performance.now()})};typeof window<"u"&&window.addEventListener("pointerdown",Dp,!0);function ys(){return _a&&performance.now()-_a.at<1e3?_a.element:void 0}function Rp(e){let t=e.getRootNode(),n=[window];t instanceof ShadowRoot&&n.push(t);let o=c=>{c.composedPath().includes(e)&&(c.stopPropagation(),c.preventDefault(),a())},a=()=>{clearTimeout(l);for(let c of n)c.removeEventListener("click",o,!0)},l=setTimeout(a,1e3);for(let c of n)c.addEventListener("click",o,!0)}function xs(e,t,n,o){return Gi(e,"pointerdown",a=>{o?.(a)||(t&&a.composedPath().includes(t)&&Rp(t),n(a))})}function ks(e,t,n){(0,Ll.useEffect)(()=>{if(!t)return;let o=()=>e.map(r=>r.current),a=Gi(o,"pointerdown",()=>n("outside")),l=Gi(o,"scroll",()=>n("window")),c=r=>{r.key==="Escape"&&(r.preventDefault(),r.stopPropagation(),n("escape"))},i=()=>n("window");return window.addEventListener("keydown",c,!0),window.addEventListener("blur",i),window.addEventListener("resize",i),()=>{a(),l(),window.removeEventListener("keydown",c,!0),window.removeEventListener("blur",i),window.removeEventListener("resize",i)}},[t,n])}function ie(...e){return e.filter(Boolean).join(" ")}function Ss(e){let t=e?.getRootNode();return t instanceof ShadowRoot?t:document.body}var _o=I(ye(),1);function Wn({variant:e="secondary",size:t="md",icon:n,iconEnd:o,loading:a,className:l,children:c,disabled:i,type:r="button",...d}){let v=a?"loading":n;return(0,_o.jsxs)("button",{type:r,className:ie("button",e,t==="sm"&&"small",l),disabled:i||a,"aria-busy":a||void 0,...d,children:[v&&(0,_o.jsx)("span",{className:ie("codicon",`codicon-${v}`,a&&"codicon-modifier-spin"),"aria-hidden":"true"}),c!==void 0&&(0,_o.jsx)("span",{className:"button-label",children:c}),o&&(0,_o.jsx)("span",{className:`codicon codicon-${o}`,"aria-hidden":"true"})]})}var vt=I(Wt(),1);var Ne=I(ye(),1);function Ts({menu:e,onClose:t}){let n=(0,vt.useRef)(null),[o]=(0,vt.useState)(ys);return(0,vt.useEffect)(()=>{let a=xs(()=>[n.current],o,()=>t()),l=c=>{c.key==="Escape"&&(c.preventDefault(),c.stopPropagation(),t())};return window.addEventListener("keydown",l,!0),window.addEventListener("blur",t),window.addEventListener("resize",t),()=>{a(),window.removeEventListener("keydown",l,!0),window.removeEventListener("blur",t),window.removeEventListener("resize",t)}},[t,o]),(0,Ne.jsx)("div",{ref:n,className:"menu-root",onContextMenu:a=>a.preventDefault(),children:(0,Ne.jsx)(ws,{items:e.items,x:e.x,y:e.y,above:e.anchor?.top,onClose:t,focusFirst:!0})})}function ws({items:e,x:t,y:n,onClose:o,focusFirst:a,parent:l,onBack:c,above:i}){let r=(0,vt.useRef)(null),[d,v]=(0,vt.useState)(null),p=(0,vt.useRef)(void 0);(0,vt.useLayoutEffect)(()=>{let s=r.current;if(!s)return;let u=Vi();s.style.maxWidth=`${u.width-8}px`;let f=s.getBoundingClientRect(),m=t;l&&t+f.width>u.width-4&&(m=l.left-f.width+2);let h=n;i!==void 0&&n+f.height>u.height-4&&i-f.height-2>=4&&(h=i-f.height-2),s.style.left=`${Math.max(4,Math.min(m,u.width-f.width-4))}px`,s.style.top=`${Math.max(4,Math.min(h,u.height-f.height-4))}px`,a&&s.querySelector(":scope > button:not(:disabled)")?.focus({preventScroll:!0})},[t,n,l,a,i]),(0,vt.useEffect)(()=>()=>clearTimeout(p.current),[]);let b=()=>[...r.current?.querySelectorAll(":scope > button:not(:disabled)")??[]],g=(s,u,f)=>{clearTimeout(p.current),v({index:s,rect:u.getBoundingClientRect()}),f&&setTimeout(()=>r.current?.querySelector(":scope > .menu button:not(:disabled)")?.focus({preventScroll:!0}))},x=s=>{if(s.target instanceof HTMLElement&&s.target.closest(".menu")!==r.current)return;let u=b(),f=u.indexOf(document.activeElement);if(s.key==="ArrowDown"||s.key==="ArrowUp")s.preventDefault(),u[(f+(s.key==="ArrowDown"?1:-1)+u.length)%u.length]?.focus();else if(s.key==="ArrowLeft"&&c)s.preventDefault(),s.stopPropagation(),c();else if(s.key==="ArrowRight"){let m=u[f],h=m&&e[Number(m.dataset.index)];h&&"submenu"in h&&h.submenu&&(s.preventDefault(),g(Number(m.dataset.index),m,!0))}},k=d?e[d.index]:void 0,z=k&&"submenu"in k?k.submenu?.():void 0;return(0,Ne.jsxs)("div",{ref:r,className:"menu",role:"menu",style:{left:t,top:n},onKeyDown:x,children:[e.map((s,u)=>"separator"in s?(0,Ne.jsx)("div",{className:"menu-separator",role:"separator"},u):"heading"in s?(0,Ne.jsxs)("div",{className:"menu-heading",role:"presentation",children:[s.icon&&(0,Ne.jsx)("span",{className:`codicon codicon-${s.icon}`,"aria-hidden":"true"}),(0,Ne.jsx)("span",{className:"menu-heading-label",children:s.heading}),s.detail&&(0,Ne.jsx)("span",{className:"menu-heading-detail",children:s.detail})]},u):(0,Ne.jsxs)("button",{type:"button",role:"menuitem","data-index":u,"aria-haspopup":s.submenu?"menu":void 0,"aria-expanded":s.submenu?d?.index===u:void 0,className:`menu-item${d?.index===u?" expanded":""}${s.indent?" indented":""}`,"aria-label":s.ariaLabel,disabled:s.disabled,onPointerEnter:f=>{clearTimeout(p.current);let m=f.currentTarget;s.disabled||m.focus({preventScroll:!0}),p.current=setTimeout(()=>s.submenu?g(u,m,!1):v(null),s.submenu?120:250)},onClick:f=>{if(s.submenu){g(u,f.currentTarget,f.detail===0);return}o(),s.onSelect()},children:[s.image?(0,Ne.jsx)("img",{className:"menu-image",src:s.image,alt:"",referrerPolicy:"no-referrer"}):(0,Ne.jsx)("span",{className:`codicon codicon-${s.icon??"blank"}`,"aria-hidden":"true"}),(0,Ne.jsx)("span",{className:"menu-label",children:s.label}),s.shortcut&&(0,Ne.jsx)("span",{className:"menu-shortcut",children:s.shortcut}),s.submenu&&(0,Ne.jsx)("span",{className:"codicon codicon-chevron-right menu-arrow","aria-hidden":"true"})]},u)),d&&z&&(0,Ne.jsx)(ws,{items:z.length?z:[{label:"(empty)",disabled:!0,onSelect:()=>{}}],x:d.rect.right-2,y:d.rect.top-5,parent:d.rect,onClose:o,onBack:()=>{v(null),r.current?.querySelector(`:scope > button[data-index="${d.index}"]`)?.focus()}},d.index)]})}function Es(e){let t=[];for(let o of e){let a="separator"in o,l=t.at(-1);a&&(!l||"separator"in l)||t.push(o)}let n=t.at(-1);return n&&"separator"in n&&t.pop(),t}var zs=I(Wt(),1);var In=I(ye(),1);function Ns({value:e,options:t,onChange:n,label:o,iconOnly:a,size:l="md",className:c}){let i=(0,zs.useRef)(null),r=d=>{let v={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[d.key];if(!v)return;d.preventDefault();let p=t.findIndex(g=>g.value===e),b=t[(p+v+t.length)%t.length];n(b.value),i.current?.querySelector(`[data-value="${CSS.escape(b.value)}"]`)?.focus()};return(0,In.jsx)("div",{ref:i,className:ie("segmented",`size-${l}`,c),role:"radiogroup","aria-label":o,onKeyDown:r,children:t.map(d=>{let v=d.value===e;return(0,In.jsxs)("button",{type:"button",role:"radio","aria-checked":v,"aria-label":a?d.label:void 0,title:a||d.icon?d.label:void 0,"data-value":d.value,tabIndex:v?0:-1,className:ie("segment",v&&"checked"),onClick:()=>n(d.value),children:[d.icon&&(0,In.jsx)("span",{className:`codicon codicon-${d.icon}`,"aria-hidden":"true"}),!a&&(0,In.jsx)("span",{className:"segment-label",children:d.label}),d.count!==void 0&&(0,In.jsx)("span",{className:ie("segment-count",d.tone),children:d.count})]},d.value)})})}var Mo=I(ye(),1);function Co({checked:e,onChange:t,children:n,label:o,disabled:a,className:l,title:c}){return(0,Mo.jsxs)("button",{type:"button",role:"checkbox","aria-checked":e,"aria-label":n?void 0:o,title:c,disabled:a,className:ie("checkbox",e&&"on",l),onClick:()=>t(!e),children:[(0,Mo.jsx)("span",{className:"checkbox-box","aria-hidden":"true",children:e&&(0,Mo.jsx)("span",{className:"codicon codicon-check"})}),n&&(0,Mo.jsx)("span",{className:"toggle-label",children:n})]})}var pn=I(ye(),1);function Os({items:e,checked:t,onToggle:n,onOpen:o,className:a}){return(0,pn.jsx)("ul",{className:ie("thumb-picker",a),"aria-label":"Screenshots",children:e.map(l=>{let c=t.has(l.id);return(0,pn.jsxs)("li",{className:ie("thumb-picker-item",c&&"on"),title:l.label,children:[(0,pn.jsx)("button",{type:"button",className:"thumb-picker-image","aria-label":o?`Open ${l.label}`:`Include ${l.label}`,"aria-pressed":o?void 0:c,onClick:()=>o?o(l.id):n(l.id),children:l.src?(0,pn.jsx)("img",{src:l.src,alt:""}):(0,pn.jsx)("span",{className:"codicon codicon-file-media","aria-hidden":"true"})}),(0,pn.jsx)(Co,{className:"thumb-picker-check",checked:c,label:`Include ${l.label}`,onChange:()=>n(l.id)})]},l.id)})})}var S=I(ye(),1),As={elements:["element"],images:["screenshot","recording"],errors:["errors","network"],other:["page","report","css","measure","color","text"]};function Ms(e){let{items:t,targets:n,defaultTarget:o,canSend:a=!0}=e,[l,c]=(0,et.useState)("all"),[i,r]=(0,et.useState)(null),[d,v]=(0,et.useState)(new Set),[p,b]=(0,et.useState)(new Set),g=(0,et.useMemo)(()=>{let N={all:t.length,elements:0,images:0,errors:0,other:0};for(let Q of t)for(let[ue,Eo]of Object.entries(As))Eo.includes(Q.kind)&&N[ue]++;return N},[t]),x=l==="all"?t:t.filter(N=>As[l].includes(N.kind)),k=(0,et.useMemo)(()=>Zd(x),[x]),z=(0,et.useMemo)(()=>t.reduce((N,Q)=>!N||Q.time>N.time?Q:N,void 0)?.id,[t]),s=Fd(n,o),u=n.find(N=>N.id===o),f=s.filter(N=>N.kind==="tmux"),m=a&&n.length>0,h=k.filter(N=>d.has(N.key)),w=h.flatMap(Mi).filter(N=>!p.has(N)),T=N=>{let Q=new Set(p);Q.has(N)?Q.delete(N):Q.add(N),b(Q)},E=N=>{let Q=new Set(d);Q.has(N)?Q.delete(N):Q.add(N),v(Q)},C=()=>v(new Set),_=(N,Q)=>{let ue=N.getBoundingClientRect();r({x:ue.left,y:ue.bottom+2,anchor:ue,items:Q})},Y=e.onOpenInAgentmux,pe={target:u,canChoose:m&&(n.length>1||!!Y&&f.length>0),sending:m,send:N=>e.onSend(N),choose:(N,Q)=>_(Q,Es(s.flatMap(ue=>{let Eo=()=>e.onSend(N,ue.id),O=ue.kind==="chat"?ue.label:`${ue.label} (${Aa(ue)})`;return!Y||ue.kind!=="tmux"?[{label:O,icon:Ci(ue),onSelect:Eo}]:[{separator:!0},{heading:ue.label,detail:Aa(ue),icon:Ci(ue)},{label:"Send",icon:"send",indent:!0,ariaLabel:`Send to ${O}`,onSelect:Eo},{label:"Send and open in agentmux",icon:"link-external",indent:!0,ariaLabel:`Send to ${O} and open it in agentmux`,onSelect:()=>Y(N,ue.id)},{separator:!0}]}))),copy:e.onCopy,open:e.onOpen,remove:e.onRemove,ungroup:e.onUngroup};return(0,S.jsxs)("div",{className:ie("saved",h.length>0&&"selecting",e.className),children:[(e.header||e.filters&&t.length>0)&&(0,S.jsxs)("header",{className:"saved-header",children:[e.header,e.filters&&t.length>0&&(0,S.jsx)(Ns,{size:"sm",label:"Show",value:l,onChange:c,className:"saved-filter",options:[{value:"all",label:"All",icon:"list-flat",count:g.all},{value:"elements",label:"Elements",icon:"inspect",count:g.elements||void 0},{value:"images",label:"Images",icon:"file-media",count:g.images||void 0},{value:"errors",label:"Errors",icon:"error",count:g.errors||void 0,tone:g.errors?"error":void 0},{value:"other",label:"Other",icon:"ellipsis",count:g.other||void 0}]})]}),t.length===0?e.empty:k.length===0?(0,S.jsx)("p",{className:"saved-none",children:"Nothing here yet."}):(0,S.jsx)("ul",{className:"saved-list","aria-label":"Saved captures",children:k.map(N=>N.kind==="item"?(0,S.jsx)(Up,{item:N.item,latest:N.item.id===z,thumbnail:e.thumbnails[N.item.id],actions:pe,selected:d.has(N.key),onSelect:()=>E(N.key)},N.key):(0,S.jsx)(Bp,{group:N.group,items:N.items,latest:N.items.some(Q=>Q.id===z),thumbnails:e.thumbnails,actions:pe,selected:d.has(N.key),onSelect:()=>E(N.key),unchecked:p,onToggle:T},N.key))}),h.length>0?(0,S.jsxs)("footer",{className:"saved-footer saved-selection",role:"toolbar","aria-label":"Selection",children:[(0,S.jsxs)("span",{className:"saved-selection-count",children:[(0,S.jsx)("span",{className:"saved-selection-badge",children:w.length}),"selected"]}),m&&(0,S.jsx)(Wn,{size:"sm",variant:"accent",icon:"send",disabled:!w.length,title:u?`Send to ${u.label}`:"Send to an agent",onClick:()=>{e.onSend(w),C()},children:"Send"}),e.onGroup&&h.length>1&&(0,S.jsx)(Wn,{size:"sm",variant:"ghost",icon:"layers",disabled:w.length<2,title:"Show them as one group, sent together",onClick:()=>{e.onGroup?.(w),C()},children:"Group"}),(0,S.jsx)(gt,{icon:"trash",label:"Remove them",onClick:()=>{e.onRemove(h.flatMap(Mi)),C()}}),(0,S.jsx)(gt,{icon:"close",label:"Clear the selection",onClick:C})]}):e.undo?(0,S.jsxs)("footer",{className:"saved-footer saved-undo",role:"status",children:[(0,S.jsxs)("span",{className:"saved-undo-text",children:[(0,S.jsx)("span",{className:"codicon codicon-trash","aria-hidden":"true"}),e.undo.label]}),(0,S.jsx)(Wn,{size:"sm",variant:"secondary",icon:"discard",onClick:e.undo.onUndo,children:"Undo"})]}):t.length>0&&(e.hint||e.onClear)&&(0,S.jsxs)("footer",{className:"saved-footer",children:[e.hint&&(0,S.jsx)("span",{className:"saved-hint",children:e.hint}),e.onClear&&(0,S.jsx)(Wn,{variant:"ghost",size:"sm",icon:"clear-all",onClick:e.onClear,children:"Clear all"})]}),i&&(0,S.jsx)(Ts,{menu:i,onClose:()=>r(null)})]})}function Cs(e){return{onClick:t=>{(t.ctrlKey||t.metaKey||t.shiftKey)&&t.target.closest("button")===null&&(t.preventDefault(),e())}}}function Hs({ids:e,label:t,sent:n,disabled:o,actions:a}){let l=(0,et.useRef)(null);return a.sending?(0,S.jsx)("span",{className:"saved-send-group",children:(0,S.jsxs)("span",{className:"saved-send",children:[(0,S.jsx)(Wn,{size:"sm",variant:n?"secondary":"accent",icon:n?"check":"send",disabled:o,onClick:()=>a.send(e),title:a.target?`Send to ${a.target.label}`:"Send to an agent",children:t}),a.canChoose&&(0,S.jsx)(Wn,{ref:l,size:"sm",variant:n?"secondary":"accent",icon:"chevron-down",className:"saved-send-more",disabled:o,"aria-label":"Send to\u2026",title:"Send to another agent",onClick:()=>l.current&&a.choose(e,l.current)})]})}):null}function Up({item:e,latest:t,thumbnail:n,actions:o,selected:a,onSelect:l}){let[c,i]=(0,et.useState)(!1),[r,d]=(0,et.useState)(!1),v=e.sentTo.length>0,p=n&&!c?n:void 0,b=o.open;return(0,S.jsxs)("li",{className:ie("saved-card",`kind-${e.kind}`,t&&"latest",a&&"selected"),tabIndex:0,"aria-label":`${Ai[e.kind]}: ${e.title}`,"aria-selected":a,onDoubleClick:b&&(()=>b(e.id)),...Cs(l),onKeyDown:g=>{g.target===g.currentTarget&&(g.key==="Enter"&&o.sending?o.send([e.id]):g.key===" "?(g.preventDefault(),l()):g.key==="Delete"||g.key==="Backspace"?o.remove([e.id]):g.key==="c"&&(g.ctrlKey||g.metaKey)&&o.copy?.(e.id))},children:[(0,S.jsx)(Co,{className:"saved-card-select",checked:a,label:`Select ${e.title}`,onChange:l}),p&&(b?(0,S.jsx)("button",{type:"button",className:ie("saved-thumb",r&&"tall"),"aria-label":`Open ${e.title}`,onClick:()=>b(e.id),children:(0,S.jsx)(_s,{src:p,onBroken:()=>i(!0),onTall:d})}):(0,S.jsx)("div",{className:ie("saved-thumb","still",r&&"tall"),children:(0,S.jsx)(_s,{src:p,onBroken:()=>i(!0),onTall:d})})),(0,S.jsxs)("div",{className:"saved-card-head",children:[!p&&(0,S.jsx)("span",{className:"saved-card-icon","aria-hidden":"true",children:(0,S.jsx)("span",{className:`codicon codicon-${Oi[e.kind]}`})}),(0,S.jsxs)("div",{className:"saved-card-heading",children:[(0,S.jsxs)("div",{className:"saved-card-title-row",children:[(0,S.jsx)("span",{className:"saved-card-title",title:e.title,children:e.title}),t&&(0,S.jsx)("span",{className:"saved-card-badge",children:"Latest"})]}),(0,S.jsxs)("div",{className:"saved-card-meta",children:[(0,S.jsx)("span",{children:Ai[e.kind]}),e.detail&&(0,S.jsx)("span",{title:e.url,children:e.detail}),(0,S.jsx)("span",{children:_i(e.time)}),e.source&&(0,S.jsx)("span",{children:e.source})]})]})]}),e.preview&&!p&&(0,S.jsx)("p",{className:"saved-card-preview",children:(0,S.jsx)("span",{children:e.preview})}),(0,S.jsxs)("div",{className:"saved-card-actions",children:[(0,S.jsx)(Hs,{ids:[e.id],label:v?"Send again":"Send",sent:v,actions:o}),(0,S.jsxs)("span",{className:"saved-card-tools",children:[o.copy&&(0,S.jsx)(gt,{icon:"copy",label:"Copy",onClick:()=>o.copy?.(e.id)}),b&&(0,S.jsx)(gt,{icon:"go-to-file",label:"Open",onClick:()=>b(e.id)}),(0,S.jsx)(gt,{icon:"trash",label:"Remove",onClick:()=>o.remove([e.id])})]})]}),v&&(0,S.jsx)(Ds,{agents:e.sentTo})]})}function _s({src:e,onBroken:t,onTall:n}){return(0,S.jsx)("img",{src:e,alt:"",onError:t,onLoad:o=>{let{naturalWidth:a,naturalHeight:l}=o.currentTarget;n(a>0&&l/a>1.1)}})}function Bp({group:e,items:t,latest:n,thumbnails:o,actions:a,selected:l,onSelect:c,unchecked:i,onToggle:r}){let d=t.filter(u=>!i.has(u.id)).map(u=>u.id),v=d.length===t.length,p=[...new Set(t.flatMap(u=>u.sentTo))],b=d.length>0&&d.every(u=>t.find(f=>f.id===u).sentTo.length),g=Kd(t),x=Math.max(...t.map(u=>u.time)),k=new Set(t.map(u=>u.kind)),z=k.size===1&&k.has("screenshot")?"screenshots":k.size===1&&k.has("element")?"elements":"items",s=a.open;return(0,S.jsxs)("li",{className:ie("saved-card","saved-group",n&&"latest",l&&"selected"),tabIndex:0,"aria-label":`${t.length} ${z}: ${g}`,"aria-selected":l,...Cs(c),onKeyDown:u=>{u.target===u.currentTarget&&(u.key==="Enter"&&a.sending&&d.length?a.send(d):u.key===" "?(u.preventDefault(),c()):(u.key==="Delete"||u.key==="Backspace")&&a.remove(t.map(f=>f.id)))},children:[(0,S.jsx)(Co,{className:"saved-card-select",checked:l,label:`Select ${g}`,onChange:c}),(0,S.jsxs)("div",{className:"saved-card-head",children:[(0,S.jsx)("span",{className:"saved-card-icon","aria-hidden":"true",children:(0,S.jsx)("span",{className:"codicon codicon-layers"})}),(0,S.jsxs)("div",{className:"saved-card-heading",children:[(0,S.jsxs)("div",{className:"saved-card-title-row",children:[(0,S.jsx)("span",{className:"saved-card-title",title:g,children:g}),(0,S.jsx)("span",{className:"saved-card-count",children:t.length}),n&&(0,S.jsx)("span",{className:"saved-card-badge",children:"Latest"})]}),(0,S.jsxs)("div",{className:"saved-card-meta",children:[(0,S.jsx)("span",{children:v?`${t.length} ${z}`:`${d.length} of ${t.length} checked`}),t[0].detail&&(0,S.jsx)("span",{title:t[0].url,children:t[0].detail}),(0,S.jsx)("span",{children:_i(x)}),t[0].source&&(0,S.jsx)("span",{children:t[0].source})]})]})]}),t.some(u=>u.image)?(0,S.jsx)(Os,{className:"saved-group-thumbs",items:t.map(u=>({id:u.id,src:o[u.id],label:u.title})),checked:new Set(d),onToggle:r,onOpen:s}):(0,S.jsx)("ul",{className:"saved-group-list","aria-label":g,children:t.map(u=>(0,S.jsxs)("li",{className:ie("saved-group-row",!i.has(u.id)&&"on"),onDoubleClick:s&&(()=>s(u.id)),children:[(0,S.jsx)(Co,{checked:!i.has(u.id),label:`Include ${u.title}`,onChange:()=>r(u.id)}),(0,S.jsx)("span",{className:`codicon codicon-${Oi[u.kind]} saved-group-row-icon`,"aria-hidden":"true"}),(0,S.jsxs)("span",{className:"saved-group-row-text",children:[(0,S.jsx)("span",{className:"saved-group-row-title",title:u.title,children:u.title}),u.detail&&u.detail!==t[0].detail&&(0,S.jsx)("span",{className:"saved-group-row-detail",children:u.detail})]}),s&&(0,S.jsx)(gt,{icon:"go-to-file",label:`Open ${u.title}`,className:"small saved-group-row-open",onClick:()=>s(u.id)})]},u.id))}),(0,S.jsxs)("div",{className:"saved-card-actions",children:[(0,S.jsx)(Hs,{ids:d,label:v?`${b?"Send all again":"Send all"} ${t.length}`:`Send ${d.length} of ${t.length}`,sent:b,disabled:!d.length,actions:a}),(0,S.jsxs)("span",{className:"saved-card-tools",children:[a.ungroup&&(0,S.jsx)(gt,{icon:"list-flat",label:"Ungroup (show them one by one)",onClick:()=>a.ungroup?.(e)}),(0,S.jsx)(gt,{icon:"trash",label:"Remove the group",onClick:()=>a.remove(t.map(u=>u.id))})]})]}),p.length>0&&(0,S.jsx)(Ds,{agents:p})]})}function Ds({agents:e}){return(0,S.jsxs)("div",{className:"saved-card-sent",title:`Sent to ${e.join(", ")}`,children:[(0,S.jsx)("span",{className:"codicon codicon-pass-filled","aria-hidden":"true"}),(0,S.jsxs)("span",{children:["Sent to ",e.join(", ")]})]})}var Ze=I(Wt(),1),Ls=I(Xi(),1);var Oe=I(ye(),1);function Ys({value:e,options:t,onChange:n,label:o,title:a,placeholder:l="Select\u2026",icon:c,renderValue:i,size:r="md",appearance:d="field",disabled:v,className:p,align:b="start"}){let[g,x]=(0,Ze.useState)(!1),[k,z]=(0,Ze.useState)(-1),[s,u]=(0,Ze.useState)(null),f=(0,Ze.useRef)(null),m=(0,Ze.useRef)(null),h=(0,Ze.useRef)({text:"",at:0}),w=(0,Ze.useId)(),T=t.findIndex(O=>O.value===e),E=t[T],C=(0,Ze.useCallback)(O=>{x(!1),(O==="escape"||O==="chosen")&&f.current?.focus()},[]);ks([f,m],g,C),hs(f,m,g,{align:b,matchWidth:!0});let _=O=>O>=0&&!t[O]?.disabled,Y=(O,be)=>{for(let zt=1;zt<=t.length;zt++){let ft=(O+be*zt+t.length*2)%t.length;if(_(ft))return ft}return O},pe=(O=T)=>{z(_(O)?O:Y(-1,1)),u(Ss(f.current)),x(!0)},N=O=>{let be=t[O];!be||be.disabled||(C("chosen"),be.value!==e&&n(be.value))};(0,Ze.useLayoutEffect)(()=>{g&&(m.current?.querySelector(`[data-index="${k}"]`)?.scrollIntoView({block:"nearest"}),m.current?.focus({preventScroll:!0}))},[g,k]);let Q=O=>{let be=Date.now(),zt=(be-h.current.at<700?h.current.text:"")+O.toLowerCase();h.current={text:zt,at:be};let ft=g?k:T,Hl=[...t.keys()].map(Dl=>(ft+(zt.length>1?0:1)+Dl)%t.length).find(Dl=>_(Dl)&&t[Dl].label.toLowerCase().startsWith(zt));Hl!==void 0&&(g?z(Hl):t[Hl].value!==e&&n(t[Hl].value))},ue=O=>{["ArrowDown","ArrowUp","Enter"," "].includes(O.key)?(O.preventDefault(),pe()):O.key.length===1&&!O.ctrlKey&&!O.metaKey&&!O.altKey&&Q(O.key)},Eo=O=>{let zt={ArrowDown:()=>z(ft=>Y(ft,1)),ArrowUp:()=>z(ft=>Y(ft,-1)),Home:()=>z(Y(-1,1)),End:()=>z(Y(t.length,-1)),PageDown:()=>z(ft=>Math.min(Y(ft,1)+7,Y(t.length,-1))),PageUp:()=>z(ft=>Math.max(Y(ft,-1)-7,Y(-1,1))),Enter:()=>N(k)," ":()=>h.current.text&&Date.now()-h.current.at<700?Q(" "):N(k),Tab:()=>C()}[O.key];zt?(O.key!=="Tab"&&O.preventDefault(),zt()):O.key.length===1&&!O.ctrlKey&&!O.metaKey&&!O.altKey&&Q(O.key)};return(0,Oe.jsxs)(Oe.Fragment,{children:[(0,Oe.jsxs)("button",{ref:f,type:"button",className:ie("select",`size-${r}`,d==="quiet"&&"quiet",g&&"open",p),role:"combobox","aria-haspopup":"listbox","aria-expanded":g,"aria-controls":g?`${w}-list`:void 0,"aria-label":o,title:a??o,disabled:v,onClick:()=>g?C():pe(),onKeyDown:ue,children:[c&&(0,Oe.jsx)("span",{className:`codicon codicon-${c}`,"aria-hidden":"true"}),!c&&E?.icon&&(0,Oe.jsx)("span",{className:`codicon codicon-${E.icon}`,"aria-hidden":"true"}),(0,Oe.jsx)("span",{className:ie("select-value",!E&&"placeholder"),children:E?i?i(E):E.label:l}),(0,Oe.jsx)("span",{className:"codicon codicon-chevron-down select-chevron","aria-hidden":"true"})]}),g&&s&&(0,Ls.createPortal)((0,Oe.jsx)("div",{ref:m,id:`${w}-list`,className:"select-list","data-ink-popup":"",role:"listbox","aria-label":o,tabIndex:-1,"aria-activedescendant":k>=0?`${w}-${k}`:void 0,onKeyDown:Eo,children:t.map((O,be)=>[O.group&&O.group!==t[be-1]?.group?(0,Oe.jsx)("div",{className:"select-group",role:"presentation",children:O.group},`g-${O.group}`):null,(0,Oe.jsxs)("div",{id:`${w}-${be}`,"data-index":be,role:"option","aria-selected":be===T,"aria-disabled":O.disabled||void 0,className:ie("select-option",be===k&&"active",be===T&&"selected",O.disabled&&"disabled"),style:O.indent?{paddingLeft:4+O.indent*14}:void 0,onPointerMove:()=>!O.disabled&&z(be),onClick:()=>N(be),children:[(0,Oe.jsx)("span",{className:`codicon codicon-${be===T?"check":"blank"} select-check`,"aria-hidden":"true"}),O.icon&&(0,Oe.jsx)("span",{className:`codicon codicon-${O.icon}`,"aria-hidden":"true"}),(0,Oe.jsx)("span",{className:"select-option-label",children:O.label}),O.detail&&(0,Oe.jsx)("span",{className:"select-option-detail",children:O.detail})]},O.value)])}),s)]})}var Ue=I(Wt()),Zm=I(Vm());var Xm=`/* The side panel. The Saved list (SavedList), components and tokens come from @inkspect/shared/ui. */

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  background: var(--vscode-sideBar-background, var(--vscode-editor-background));
  color: var(--vscode-foreground);
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
  line-height: 1.45;
}

.sp {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ink-space-2) var(--ink-space-3) 0;
}

.sp-title {
  font-size: var(--ink-font-lg);
  font-weight: 600;
}

.sp-empty,
.sp-target {
  color: var(--ink-muted);
}

.sp-empty {
  padding: var(--ink-space-2) var(--ink-space-3);
}

/* The project shown (the page's own, or one picked), and its pin. */
.sp-project {
  display: flex;
  align-items: center;
  gap: var(--ink-space-2);
  padding: var(--ink-space-2) var(--ink-space-3) 0;
}

.sp-project-select {
  flex: 1;
  min-width: 0;
}

.sp-dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: var(--ink-radius-pill);
  background: var(--ink-border-strong);
}

.sp-dot.on {
  background: var(--ink-success);
}

.sp-target,
.sp-note {
  padding: var(--ink-space-1) var(--ink-space-3) 0;
  font-size: var(--ink-font-sm);
}

.sp-note.ok {
  color: var(--ink-success);
}

.sp-note.error {
  color: var(--ink-danger);
}

/* The list fills the rest of the panel (its footer sticks to the bottom). */
.sp .saved {
  flex: 1;
}

@media (forced-colors: active) {
  .sp-dot.on {
    background: Highlight;
  }
}
`;var oe=I(ye());async function vn(e){return await chrome.runtime.sendMessage({type:"hub",request:{...e,req:crypto.randomUUID()}})??void 0}async function Zy(){let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return vn({type:"projects.get",url:e?.url?.slice(0,4096)})}var Qm=e=>vn({type:"items.get",project:e}).then(t=>t?.ok?t.items:void 0);async function Ky(e,t){let n=new Uint8Array(0),o="text/plain";for(let a=0;;){let l=await vn({type:"item.content",project:e,id:t,offset:a});if(!l?.ok||l.size===void 0||!l.data)throw new Error(l?.error??"The browser helper did not answer.");a===0&&(n=new Uint8Array(l.size)),o=l.mimeType??o;let c=Uint8Array.from(atob(l.data),i=>i.charCodeAt(0));if(!c.length&&a<l.size)throw new Error("The copy came back short.");if(n.set(c,a),a+=c.length,a>=l.size)return{bytes:n,mimeType:o}}}async function Jy(e,t){let{bytes:n,mimeType:o}=await Ky(e,t);if(o==="text/plain"){await navigator.clipboard.writeText(new TextDecoder().decode(n));return}let a=new Blob([n],{type:o});if(o!=="image/png"){let l=await createImageBitmap(a),c=new OffscreenCanvas(l.width,l.height);c.getContext("2d")?.drawImage(l,0,0),a=await c.convertToBlob({type:"image/png"})}await navigator.clipboard.write([new ClipboardItem({"image/png":a})])}var $y=2e3,Fy=15e3;function Wy({project:e,canUndo:t,canGroup:n,canCopy:o}){let[a,l]=(0,Ue.useState)(),[c,i]=(0,Ue.useState)({}),[r,d]=(0,Ue.useState)(),[v,p]=(0,Ue.useState)(),b=No(e),g=e.targets??[],x=g.find(h=>h.id===e.defaultTarget);(0,Ue.useEffect)(()=>{let h=!0,w=()=>{document.visibilityState==="visible"&&Qm(e.path).then(E=>{h&&E&&l(E)})};w();let T=setInterval(w,$y);return document.addEventListener("visibilitychange",w),window.addEventListener("focus",w),()=>{h=!1,clearInterval(T),document.removeEventListener("visibilitychange",w),window.removeEventListener("focus",w)}},[e.path]),(0,Ue.useEffect)(()=>{if(!v)return;let h=setTimeout(()=>p(void 0),Fy);return()=>clearTimeout(h)},[v]),(0,Ue.useEffect)(()=>{let h=!0;for(let w of a??[])c[w.id]||!(w.files.thumb||w.files.file)||w.kind!=="recording"&&vn({type:"item.thumb",project:e.path,id:w.id}).then(T=>{if(!h||!T?.data)return;let E=`data:${T.mimeType??"image/jpeg"};base64,${T.data}`;i(C=>({...C,[w.id]:E}))});return()=>{h=!1}},[a,c,e.path]);let k=()=>{Qm(e.path).then(h=>{h&&l(h)})},z=async(h,w,T=!1)=>{d(void 0);let E=g.find(_=>_.id===(w??e.defaultTarget)),C=await vn({type:"item.send",project:e.path,ids:h,target:w,open:T});d(C?.ok?{text:`${Wd(E,C.sentTo??"the agent")}.`,tone:"ok"}:{text:C?.error??"The browser helper did not answer.",tone:"error"}),k()},s=async h=>{await vn({type:"item.remove",project:e.path,ids:h}),t&&p(h),k()},u=h=>{d(void 0),Jy(e.path,h).then(()=>d({text:"Copied.",tone:"ok"}),w=>d({text:`Could not copy: ${w.message}`,tone:"error"}))},f=h=>{vn({...h,project:e.path}).then(k)},m=(0,Ue.useMemo)(()=>(a??[]).map(Jd),[a]);return a?(0,oe.jsxs)(oe.Fragment,{children:[(0,oe.jsx)("div",{className:"sp-target",title:e.path,children:b?x?`Send goes to ${x.label} \xB7 ${Aa(x)}`:"No agent is running here.":"Nothing is open here: captures are kept, sending is off."}),r&&(0,oe.jsx)("div",{className:`sp-note ${r.tone}`,role:"status",children:r.text}),(0,oe.jsx)(Ms,{items:m,thumbnails:c,targets:g,defaultTarget:e.defaultTarget,canSend:b,onSend:(h,w)=>{z(h,w)},onOpenInAgentmux:(h,w)=>{z(h,w,!0)},onRemove:h=>{s(h)},onCopy:o?u:void 0,onGroup:n?h=>f({type:"items.group",ids:h}):void 0,onUngroup:n?h=>f({type:"items.ungroup",group:h}):void 0,undo:v&&{label:v.length===1?"Removed 1 item":`Removed ${v.length} items`,onUndo:()=>{p(void 0),vn({type:"item.restore",project:e.path,ids:v}).then(k)}},empty:(0,oe.jsxs)("div",{className:"sp-empty",children:["Nothing saved in ",e.name," yet. Capture something with the toolbar: it is saved here at once."]})})]}):(0,oe.jsx)("div",{className:"sp-empty",children:"Loading\u2026"})}function Iy(){let[e,t]=(0,Ue.useState)({state:"connecting"}),[n,o]=(0,Ue.useState)(),[a,l]=(0,Ue.useState)(),c=(0,Ue.useCallback)(()=>{Zy().then(o)},[]);(0,Ue.useEffect)(()=>{let v=()=>{chrome.runtime.sendMessage({type:"status"}).then(x=>x&&t(x)),c()};v();let p=setInterval(v,5e3),b=()=>{l(void 0),c()},g=(x,k)=>{(k.url||k.status==="complete")&&c()};return chrome.tabs.onActivated.addListener(b),chrome.tabs.onUpdated.addListener(g),()=>{clearInterval(p),chrome.tabs.onActivated.removeListener(b),chrome.tabs.onUpdated.removeListener(g)}},[c]);let i=n?.projects??[],r=i.find(v=>v.path===a)??i.find(v=>v.path===n?.suggested)??i[0],d=!!e.projects;return(0,oe.jsxs)("main",{className:"sp",children:[(0,oe.jsxs)("header",{className:"sp-head",children:[(0,oe.jsx)("span",{className:"sp-title",children:"Saved"}),(0,oe.jsx)(gt,{icon:"refresh",label:"Refresh",onClick:c})]}),d?n?r?(0,oe.jsxs)(oe.Fragment,{children:[(0,oe.jsxs)("div",{className:"sp-project",children:[(0,oe.jsx)("span",{className:`sp-dot ${No(r)?"on":""}`,"aria-hidden":"true"}),(0,oe.jsx)(Ys,{size:"sm",label:"Project",icon:r.inbox?"inbox":"folder",className:"sp-project-select",value:r.path,onChange:l,options:i.map(v=>({value:v.path,label:v.name,detail:$d(v),icon:v.inbox?"inbox":v.pinned?"pinned":v.vscode?"vscode":"folder",group:v.inbox?"Inbox":No(v)?"Open":"Saved"}))}),!r.inbox&&(0,oe.jsx)(gt,{icon:r.pinned?"pinned":"pin",label:r.pinned?`Unpin ${r.name}`:`Pin ${r.name}`,active:r.pinned,onClick:()=>{vn({type:"project.pin",project:r.path,pinned:!r.pinned}).then(c)}})]}),(0,oe.jsx)(Wy,{project:r,canUndo:!!e.features?.includes("item.restore"),canGroup:!!e.features?.includes("items.group"),canCopy:!!e.features?.includes("item.content")},r.path)]}):(0,oe.jsx)("div",{className:"sp-empty",children:"No projects yet: open a folder in VS Code, or start an agent in agentmux."}):(0,oe.jsx)("div",{className:"sp-empty",children:"Loading\u2026"}):(0,oe.jsx)("div",{className:"sp-empty",children:"Not linked with VS Code. Open VS Code with VS Code Browser: on Linux its browser helper links this browser by itself (restart the browser once); elsewhere, pair it from the Inkspect button."})]})}var Km=document.createElement("style");Km.textContent=[Gd,Id,es,Xm].join(`
`);document.head.append(Km);document.documentElement.classList.add("ink-theme");Pd(document);(0,Zm.createRoot)(document.getElementById("root")).render((0,oe.jsx)(Iy,{}));})();
