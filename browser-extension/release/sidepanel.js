"use strict";(()=>{var Zm=Object.create;var Yd=Object.defineProperty;var Km=Object.getOwnPropertyDescriptor;var Jm=Object.getOwnPropertyNames;var $m=Object.getPrototypeOf,Fm=Object.prototype.hasOwnProperty;var Dt=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var Wm=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Jm(t))!Fm.call(e,a)&&a!==n&&Yd(e,a,{get:()=>t[a],enumerable:!(o=Km(t,a))||o.enumerable});return e};var F=(e,t,n)=>(n=e!=null?Zm($m(e)):{},Wm(t||!e||!e.__esModule?Yd(n,"default",{value:e,enumerable:!0}):n,e));var ef=Dt(ql=>{"use strict";var fp=Symbol.for("react.transitional.element"),sp=Symbol.for("react.fragment");function Pd(e,t,n){var o=null;if(n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:fp,type:e,key:o,ref:t!==void 0?t:null,props:n}}ql.Fragment=sp;ql.jsx=Pd;ql.jsxs=Pd});var he=Dt((h1,tf)=>{"use strict";tf.exports=ef()});var vf=Dt(C=>{"use strict";var Ui=Symbol.for("react.transitional.element"),bp=Symbol.for("react.portal"),gp=Symbol.for("react.fragment"),vp=Symbol.for("react.strict_mode"),mp=Symbol.for("react.profiler"),pp=Symbol.for("react.consumer"),hp=Symbol.for("react.context"),yp=Symbol.for("react.forward_ref"),xp=Symbol.for("react.suspense"),kp=Symbol.for("react.memo"),cf=Symbol.for("react.lazy"),Sp=Symbol.for("react.activity"),Tp=Symbol.for("react.view_transition"),nf=Symbol.iterator;function wp(e){return e===null||typeof e!="object"?null:(e=nf&&e[nf]||e["@@iterator"],typeof e=="function"?e:null)}var rf={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},uf=Object.assign,df={};function Ao(e,t,n){this.props=e,this.context=t,this.refs=df,this.updater=n||rf}Ao.prototype.isReactComponent={};Ao.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Ao.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function ff(){}ff.prototype=Ao.prototype;function Bi(e,t,n){this.props=e,this.context=t,this.refs=df,this.updater=n||rf}var qi=Bi.prototype=new ff;qi.constructor=Bi;uf(qi,Ao.prototype);qi.isPureReactComponent=!0;var of=Array.isArray;function Ri(){}var W={H:null,A:null,T:null,S:null},sf=Object.prototype.hasOwnProperty;function ji(e,t,n){var o=n.ref;return{$$typeof:Ui,type:e,key:t,ref:o!==void 0?o:null,props:n}}function Ep(e,t){return ji(e.type,t,e.props)}function Yi(e){return typeof e=="object"&&e!==null&&e.$$typeof===Ui}function zp(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var af=/\/+/g;function Hi(e,t){return typeof e=="object"&&e!==null&&e.key!=null?zp(""+e.key):t.toString(36)}function Np(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Ri,Ri):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function Oo(e,t,n,o,a){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var c=!1;if(e===null)c=!0;else switch(l){case"bigint":case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case Ui:case bp:c=!0;break;case cf:return c=e._init,Oo(c(e._payload),t,n,o,a)}}if(c)return a=a(e),c=o===""?"."+Hi(e,0):o,of(a)?(n="",c!=null&&(n=c.replace(af,"$&/")+"/"),Oo(a,t,n,"",function(d){return d})):a!=null&&(Yi(a)&&(a=Ep(a,n+(a.key==null||e&&e.key===a.key?"":(""+a.key).replace(af,"$&/")+"/")+c)),t.push(a)),1;c=0;var i=o===""?".":o+":";if(of(e))for(var r=0;r<e.length;r++)o=e[r],l=i+Hi(o,r),c+=Oo(o,t,n,l,a);else if(r=wp(e),typeof r=="function")for(e=r.call(e),r=0;!(o=e.next()).done;)o=o.value,l=i+Hi(o,r++),c+=Oo(o,t,n,l,a);else if(l==="object"){if(typeof e.then=="function")return Oo(Np(e),t,n,o,a);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return c}function jl(e,t,n){if(e==null)return e;var o=[],a=0;return Oo(e,o,"","",function(l){return t.call(n,l,a++)}),o}function Op(e){if(e._status===-1){var t=e._result,n=t();n.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,n.status===void 0&&(n.status="fulfilled",n.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,n.status===void 0&&(n.status="rejected",n.reason=o))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var lf=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function bf(e){var t=W.T,n={};n.types=t!==null?t.types:null,W.T=n;try{var o=e(),a=W.S;a!==null&&a(n,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(Ri,lf)}catch(l){lf(l)}finally{t!==null&&n.types!==null&&(t.types=n.types),W.T=t}}function gf(e){var t=W.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else bf(gf.bind(null,e))}var Ap={map:jl,forEach:function(e,t,n){jl(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return jl(e,function(){t++}),t},toArray:function(e){return jl(e,function(t){return t})||[]},only:function(e){if(!Yi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};C.Activity=Sp;C.Children=Ap;C.Component=Ao;C.Fragment=gp;C.Profiler=mp;C.PureComponent=Bi;C.StrictMode=vp;C.Suspense=xp;C.ViewTransition=Tp;C.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=W;C.__COMPILER_RUNTIME={__proto__:null,c:function(e){return W.H.useMemoCache(e)}};C.addTransitionType=gf;C.cache=function(e){return function(){return e.apply(null,arguments)}};C.cacheSignal=function(){return null};C.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=uf({},e.props),a=e.key;if(t!=null)for(l in t.key!==void 0&&(a=""+t.key),t)!sf.call(t,l)||l==="key"||l==="__self"||l==="__source"||l==="ref"&&t.ref===void 0||(o[l]=t[l]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var c=Array(l),i=0;i<l;i++)c[i]=arguments[i+2];o.children=c}return ji(e.type,a,o)};C.createContext=function(e){return e={$$typeof:hp,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:pp,_context:e},e};C.createElement=function(e,t,n){var o,a={},l=null;if(t!=null)for(o in t.key!==void 0&&(l=""+t.key),t)sf.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(a[o]=t[o]);var c=arguments.length-2;if(c===1)a.children=n;else if(1<c){for(var i=Array(c),r=0;r<c;r++)i[r]=arguments[r+2];a.children=i}if(e&&e.defaultProps)for(o in c=e.defaultProps,c)a[o]===void 0&&(a[o]=c[o]);return ji(e,l,a)};C.createRef=function(){return{current:null}};C.forwardRef=function(e){return{$$typeof:yp,render:e}};C.isValidElement=Yi;C.lazy=function(e){return{$$typeof:cf,_payload:{_status:-1,_result:e},_init:Op}};C.memo=function(e,t){return{$$typeof:kp,type:e,compare:t===void 0?null:t}};C.startTransition=bf;C.unstable_useCacheRefresh=function(){return W.H.useCacheRefresh()};C.use=function(e){return W.H.use(e)};C.useActionState=function(e,t,n){return W.H.useActionState(e,t,n)};C.useCallback=function(e,t){return W.H.useCallback(e,t)};C.useContext=function(e){return W.H.useContext(e)};C.useDebugValue=function(){};C.useDeferredValue=function(e,t){return W.H.useDeferredValue(e,t)};C.useEffect=function(e,t){return W.H.useEffect(e,t)};C.useEffectEvent=function(e){return W.H.useEffectEvent(e)};C.useId=function(){return W.H.useId()};C.useImperativeHandle=function(e,t,n){return W.H.useImperativeHandle(e,t,n)};C.useInsertionEffect=function(e,t){return W.H.useInsertionEffect(e,t)};C.useLayoutEffect=function(e,t){return W.H.useLayoutEffect(e,t)};C.useMemo=function(e,t){return W.H.useMemo(e,t)};C.useOptimistic=function(e,t){return W.H.useOptimistic(e,t)};C.useReducer=function(e,t,n){return W.H.useReducer(e,t,n)};C.useRef=function(e){return W.H.useRef(e)};C.useState=function(e){return W.H.useState(e)};C.useSyncExternalStore=function(e,t,n){return W.H.useSyncExternalStore(e,t,n)};C.useTransition=function(){return W.H.useTransition()};C.version="19.3.0"});var Ft=Dt((k1,mf)=>{"use strict";mf.exports=vf()});var Uf=Dt(Be=>{"use strict";var Rp=Ft();function Rf(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function pn(){}var Ye={d:{f:pn,r:function(){throw Error(Rf(522))},D:pn,C:pn,L:pn,m:pn,X:pn,S:pn,M:pn},p:0,findDOMNode:null},Up=Symbol.for("react.portal"),Bp=Symbol.for("react.recoverable"),Hf=Symbol.for("react.optimistic_key");function qp(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Up,key:o==null?null:o===Hf?Hf:""+o,children:e,containerInfo:t,implementation:n}}var Ma=Rp.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Ll(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Be.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Ye;Be.browser=function(e){return{$$typeof:Bp,_reason:e}};Be.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(Rf(299));return qp(e,t,null,n)};Be.flushSync=function(e){var t=Ma.T,n=Ye.p;try{if(Ma.T=null,Ye.p=2,e)return e()}finally{Ma.T=t,Ye.p=n,Ye.d.f()}};Be.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Ye.d.C(e,t))};Be.prefetchDNS=function(e){typeof e=="string"&&Ye.d.D(e)};Be.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,o=Ll(n,t.crossOrigin),a=typeof t.integrity=="string"?t.integrity:void 0,l=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Ye.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:o,integrity:a,fetchPriority:l}):n==="script"&&Ye.d.X(e,{crossOrigin:o,integrity:a,fetchPriority:l,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Be.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=Ll(t.as,t.crossOrigin);Ye.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}}else t==null&&Ye.d.M(e)};Be.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,o=Ll(n,t.crossOrigin);Ye.d.L(e,n,{crossOrigin:o,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Be.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=Ll(t.as,t.crossOrigin);Ye.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}else Ye.d.m(e)};Be.requestFormReset=function(e){Ye.d.r(e)};Be.unstable_batchedUpdates=function(e,t){return e(t)};Be.useFormState=function(e,t,n){return Ma.H.useFormState(e,t,n)};Be.useFormStatus=function(){return Ma.H.useHostTransitionStatus()};Be.version="19.3.0"});var Gi=Dt((Q1,qf)=>{"use strict";function Bf(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Bf)}catch(e){console.error(e)}}Bf(),qf.exports=Uf()});var Ff=Dt(oe=>{"use strict";function Ki(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,a=e[o];if(0<Vl(a,t))e[o]=t,e[n]=a,n=o;else break e}}function Ht(e){return e.length===0?null:e[0]}function Xl(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,a=e.length,l=a>>>1;o<l;){var c=2*(o+1)-1,i=e[c],r=c+1,d=e[r];if(0>Vl(i,n))r<a&&0>Vl(d,i)?(e[o]=d,e[r]=n,o=r):(e[o]=i,e[c]=n,o=c);else if(r<a&&0>Vl(d,n))e[o]=d,e[r]=n,o=r;else break e}}return t}function Vl(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}oe.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Lf=performance,oe.unstable_now=function(){return Lf.now()}):(Xi=Date,Vf=Xi.now(),oe.unstable_now=function(){return Xi.now()-Vf});var Lf,Xi,Vf,Wt=[],hn=[],jp=1,vt=null,qe=3,Ji=!1,Ca=!1,Da=!1,$i=!1,Qf=typeof setTimeout=="function"?setTimeout:null,Zf=typeof clearTimeout=="function"?clearTimeout:null,Gf=typeof setImmediate<"u"?setImmediate:null;function Gl(e){for(var t=Ht(hn);t!==null;){if(t.callback===null)Xl(hn);else if(t.startTime<=e)Xl(hn),t.sortIndex=t.expirationTime,Ki(Wt,t);else break;t=Ht(hn)}}function Fi(e){if(Da=!1,Gl(e),!Ca)if(Ht(Wt)!==null)Ca=!0,Ho||(Ho=!0,Do());else{var t=Ht(hn);t!==null&&Wi(Fi,t.startTime-e)}}var Ho=!1,Ha=-1,Kf=5,Jf=-1;function $f(){return $i?!0:!(oe.unstable_now()-Jf<Kf)}function Qi(){if($i=!1,Ho){var e=oe.unstable_now();Jf=e;var t=!0;try{e:{Ca=!1,Da&&(Da=!1,Zf(Ha),Ha=-1),Ji=!0;var n=qe;try{t:{for(Gl(e),vt=Ht(Wt);vt!==null&&!(vt.expirationTime>e&&$f());){var o=vt.callback;if(typeof o=="function"){vt.callback=null,qe=vt.priorityLevel;var a=o(vt.expirationTime<=e);if(e=oe.unstable_now(),typeof a=="function"){vt.callback=a,Gl(e),t=!0;break t}vt===Ht(Wt)&&Xl(Wt),Gl(e)}else Xl(Wt);vt=Ht(Wt)}if(vt!==null)t=!0;else{var l=Ht(hn);l!==null&&Wi(Fi,l.startTime-e),t=!1}}break e}finally{vt=null,qe=n,Ji=!1}t=void 0}}finally{t?Do():Ho=!1}}}var Do;typeof Gf=="function"?Do=function(){Gf(Qi)}:typeof MessageChannel<"u"?(Zi=new MessageChannel,Xf=Zi.port2,Zi.port1.onmessage=Qi,Do=function(){Xf.postMessage(null)}):Do=function(){Qf(Qi,0)};var Zi,Xf;function Wi(e,t){Ha=Qf(function(){e(oe.unstable_now())},t)}oe.unstable_IdlePriority=5;oe.unstable_ImmediatePriority=1;oe.unstable_LowPriority=4;oe.unstable_NormalPriority=3;oe.unstable_Profiling=null;oe.unstable_UserBlockingPriority=2;oe.unstable_cancelCallback=function(e){e.callback=null};oe.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Kf=0<e?Math.floor(1e3/e):5};oe.unstable_getCurrentPriorityLevel=function(){return qe};oe.unstable_next=function(e){switch(qe){case 1:case 2:case 3:var t=3;break;default:t=qe}var n=qe;qe=t;try{return e()}finally{qe=n}};oe.unstable_requestPaint=function(){$i=!0};oe.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=qe;qe=e;try{return t()}finally{qe=n}};oe.unstable_scheduleCallback=function(e,t,n){var o=oe.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=n+a,e={id:jp++,callback:t,priorityLevel:e,startTime:n,expirationTime:a,sortIndex:-1},n>o?(e.sortIndex=n,Ki(hn,e),Ht(Wt)===null&&e===Ht(hn)&&(Da?(Zf(Ha),Ha=-1):Da=!0,Wi(Fi,n-o))):(e.sortIndex=a,Ki(Wt,e),Ca||Ji||(Ca=!0,Ho||(Ho=!0,Do()))),e};oe.unstable_shouldYield=$f;oe.unstable_wrapCallback=function(e){var t=qe;return function(){var n=qe;qe=t;try{return e.apply(this,arguments)}finally{qe=n}}}});var If=Dt(($1,Wf)=>{"use strict";Wf.exports=Ff()});var qm=Dt(Ei=>{"use strict";var ke=If(),Bb=Ft(),Yp=Gi();function y(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function qb(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function kl(e){for(var t=e,n=t;n&&!n.alternate;)t=n,(t.flags&4098)!==0&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function jb(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Yb(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Pf(e){if(kl(e)!==e)throw Error(y(188))}function Lp(e){var t=e.alternate;if(!t){if(t=kl(e),t===null)throw Error(y(188));return t!==e?null:e}for(var n=e,o=t;;){var a=n.return;if(a===null)break;var l=a.alternate;if(l===null){if(o=a.return,o!==null){n=o;continue}break}if(a.child===l.child){for(l=a.child;l;){if(l===n)return Pf(a),e;if(l===o)return Pf(a),t;l=l.sibling}throw Error(y(188))}if(n.return!==o.return)n=a,o=l;else{for(var c=!1,i=a.child;i;){if(i===n){c=!0,n=a,o=l;break}if(i===o){c=!0,o=a,n=l;break}i=i.sibling}if(!c){for(i=l.child;i;){if(i===n){c=!0,n=l,o=a;break}if(i===o){c=!0,o=l,n=a;break}i=i.sibling}if(!c)throw Error(y(189))}}if(n.alternate!==o)throw Error(y(190))}if(n.tag!==3)throw Error(y(188));return n.stateNode.current===n?e:t}function Lb(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Lb(e),t!==null)return t;e=e.sibling}return null}function We(e,t,n,o,a,l){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,o,a,l)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&We(e.child,t,n,o,a,l))return!0;e=e.sibling}return!1}function xo(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function es(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return t}function Vb(e){var t=[null,null],n=xo(e);return n===null||Gb(t,e,n.child,{foundSelf:!1}),t}function Gb(e,t,n,o){for(;n!==null;){if(n===t)o.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(o.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&Gb(e,t,n.child,o))return!0;n=n.sibling}return!1}function xe(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(y(559))}}var Lo=null,Ar=null;function Vp(e,t,n){return e===n?!0:e===t?(Lo=e,!0):!1}function Gp(e,t,n){return e===n?(Ar=e,!1):e===t?(Ar!==null&&(Lo=e),!0):!1}function ts(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function _r(e,t,n){for(var o=0,a=e;a;a=n(a))o++;a=0;for(var l=t;l;l=n(l))a++;for(;0<o-a;)e=n(e),o--;for(;0<a-o;)t=n(t),a--;for(;o--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var $=Object.assign,Xp=Symbol.for("react.element"),Ql=Symbol.for("react.transitional.element"),La=Symbol.for("react.portal"),Vo=Symbol.for("react.fragment"),Xb=Symbol.for("react.strict_mode"),Mr=Symbol.for("react.profiler"),Qb=Symbol.for("react.consumer"),Yt=Symbol.for("react.context"),Yu=Symbol.for("react.forward_ref"),Cr=Symbol.for("react.suspense"),Dr=Symbol.for("react.suspense_list"),Lu=Symbol.for("react.memo"),Sn=Symbol.for("react.lazy"),Hr=Symbol.for("react.activity"),Qp=Symbol.for("react.legacy_hidden"),Zp=Symbol.for("react.memo_cache_sentinel"),Rr=Symbol.for("react.view_transition"),Kp=Symbol.for("react.recoverable"),ns=Symbol.iterator;function Ra(e){return e===null||typeof e!="object"?null:(e=ns&&e[ns]||e["@@iterator"],typeof e=="function"?e:null)}var Jp=Symbol.for("react.client.reference");function Ur(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Jp?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Vo:return"Fragment";case Mr:return"Profiler";case Xb:return"StrictMode";case Cr:return"Suspense";case Dr:return"SuspenseList";case Hr:return"Activity";case Rr:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case La:return"Portal";case Yt:return e.displayName||"Context";case Qb:return(e._context.displayName||"Context")+".Consumer";case Yu:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Lu:return t=e.displayName||null,t!==null?t:Ur(e.type)||"Memo";case Sn:t=e._payload,e=e._init;try{return Ur(e(t))}catch{}}return null}var Va=Array.isArray,_=Bb.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,V=Yp.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,co={pending:!1,data:null,method:null,action:null},Br=[],Go=-1;function Kt(e){return{current:e}}function Me(e){0>Go||(e.current=Br[Go],Br[Go]=null,Go--)}function ee(e,t){Go++,Br[Go]=e.current,e.current=t}var Xt=Kt(null),ll=Kt(null),Mn=Kt(null),Mc=Kt(null);function Cc(e,t){switch(ee(Mn,t),ee(ll,e),ee(Xt,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?mb(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=mb(t),e=bm(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Me(Xt),ee(Xt,e)}function ua(){Me(Xt),Me(ll),Me(Mn)}function qr(e){var t=e.memoizedState;t!==null&&(ya._currentValue=t.memoizedState,ee(Mc,e)),t=Xt.current;var n=bm(t,e.type);t!==n&&(ee(ll,e),ee(Xt,n))}function Dc(e){ll.current===e&&(Me(Xt),Me(ll)),Mc.current===e&&(Me(Mc),ya._currentValue=co)}var Ii,os;function xn(e){if(Ii===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ii=t&&t[1]||"",os=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ii+e+os}var Pi=!1;function er(e,t){if(!e||Pi)return"";Pi=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var m=function(){throw Error()};if(Object.defineProperty(m.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(m,[])}catch(x){var s=x}Reflect.construct(e,[],m)}else{try{m.call()}catch(x){s=x}m=!1;try{var b=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),m=!0,new e}finally{m&&(b!==void 0?Object.defineProperty(e.prototype,"props",b):delete e.prototype.props)}}}else{try{throw Error()}catch(x){s=x}(m=e())&&typeof m.catch=="function"&&m.catch(function(){})}}catch(x){if(x&&s&&typeof x.stack=="string")return[x.stack,s.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=o.DetermineComponentFrameRoot(),c=l[0],i=l[1];if(c&&i){var r=c.split(`
`),d=i.split(`
`);for(a=o=0;o<r.length&&!r[o].includes("DetermineComponentFrameRoot");)o++;for(;a<d.length&&!d[a].includes("DetermineComponentFrameRoot");)a++;if(o===r.length||a===d.length)for(o=r.length-1,a=d.length-1;1<=o&&0<=a&&r[o]!==d[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==d[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==d[a]){var g=`
`+r[o].replace(" at new "," at ");return e.displayName&&g.includes("<anonymous>")&&(g=g.replace("<anonymous>",e.displayName)),g}while(1<=o&&0<=a);break}}}finally{Pi=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?xn(n):""}function $p(e,t){switch(e.tag){case 26:case 27:case 5:return xn(e.type);case 16:return xn("Lazy");case 13:return e.child!==t&&t!==null?xn("Suspense Fallback"):xn("Suspense");case 19:return xn("SuspenseList");case 0:case 15:return er(e.type,!1);case 11:return er(e.type.render,!1);case 1:return er(e.type,!0);case 31:return xn("Activity");case 30:return xn("ViewTransition");default:return""}}function as(e){try{var t="",n=null;do t+=$p(e,n),n=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var jr=Object.prototype.hasOwnProperty,Vu=ke.unstable_scheduleCallback,tr=ke.unstable_cancelCallback,Fp=ke.unstable_shouldYield,Wp=ke.unstable_requestPaint,lt=ke.unstable_now,Ip=ke.unstable_getCurrentPriorityLevel,Zb=ke.unstable_ImmediatePriority,Kb=ke.unstable_UserBlockingPriority,Hc=ke.unstable_NormalPriority,Pp=ke.unstable_LowPriority,Jb=ke.unstable_IdlePriority,eh=ke.log,th=ke.unstable_setDisableYieldValue,Sl=null,ct=null;function En(e){if(typeof eh=="function"&&th(e),ct&&typeof ct.setStrictMode=="function")try{ct.setStrictMode(Sl,e)}catch{}}var it=Math.clz32?Math.clz32:ah,nh=Math.log,oh=Math.LN2;function ah(e){return e>>>=0,e===0?32:31-(nh(e)/oh|0)|0}var Zl=256,Kl=262144,Jl=4194304;function to(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function ci(e,t,n){var o=e.pendingLanes;if(o===0)return 0;var a=0,l=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var i=o&134217727;return i!==0?(o=i&~l,o!==0?a=to(o):(c&=i,c!==0?a=to(c):n||(n=i&~e,n!==0&&(a=to(n))))):(i=o&~l,i!==0?a=to(i):c!==0?a=to(c):n||(n=o&~e,n!==0&&(a=to(n)))),a===0?0:t!==0&&t!==a&&(t&l)===0&&(l=a&-a,n=t&-t,l>=n||l===32&&(n&4194048)!==0)?t:a}function Tl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function $b(e,t){(t&8)!==0&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var o=31-it(n),a=1<<o;t|=e[o],n&=~a}return t}function lh(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Fb(){var e=Jl;return Jl<<=1,(Jl&62914560)===0&&(Jl=4194304),e}function nr(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function wl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ch(e,t,n,o,a,l){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var i=e.entanglements,r=e.expirationTimes,d=e.hiddenUpdates;for(n=c&~n;0<n;){var g=31-it(n),m=1<<g;i[g]=0,r[g]=-1;var s=d[g];if(s!==null)for(d[g]=null,g=0;g<s.length;g++){var b=s[g];b!==null&&(b.lane&=-536870913)}n&=~m}o!==0&&Wb(e,o,0),l!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=l&~(c&~t))}function Wb(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-it(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|n&261930}function Ib(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-it(n),a=1<<o;a&t|e[o]&t&&(e[o]|=t),n&=~a}}function Pb(e,t){var n=t&-t;return n=(n&42)!==0?1:Gu(n),(n&(e.suspendedLanes|t))!==0?0:n}function Gu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Xu(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function eg(){var e=V.p;return e!==0?e:(e=window.event,e===void 0?32:Rm(e.type))}function ls(e,t){var n=V.p;try{return V.p=e,t()}finally{V.p=n}}var fn=Math.random().toString(36).slice(2),Ae="__reactFiber$"+fn,Ie="__reactProps$"+fn,Sa="__reactContainer$"+fn,cs="__reactEvents$"+fn,ih="__reactListeners$"+fn,rh="__reactHandles$"+fn,is="__reactResources$"+fn,El="__reactMarker$"+fn,Rc="__reactLoad$"+fn;function ii(e){delete e[Ae],delete e[Ie],delete e[ih],delete e[rh]}function ao(e){var t;if(t=e[Ae])return t;for(var n=e.parentNode;n;){if(t=n[Sa]||n[Ae]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=wb(e);e!==null;){if(n=e[Ae])return n;e=wb(e)}return t}e=n,n=e.parentNode}return null}function Ta(e){if(e=e[Ae]||e[Sa]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Ga(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(y(33))}function Po(e){var t=e[is];return t||(t=e[is]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function we(e){e[El]=!0}function tg(e){e[Rc]=void 0}var ng=new Set,og={};function ko(e,t){da(e,t),da(e+"Capture",t)}function da(e,t){for(og[e]=t,e=0;e<t.length;e++)ng.add(t[e])}var uh=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),rs={},us={};function dh(e){return jr.call(us,e)?!0:jr.call(rs,e)?!1:uh.test(e)?us[e]=!0:(rs[e]=!0,!1)}var Y=!1;function ds(){var e=Y;return Y=!1,e}function sc(e,t,n){if(dh(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,n)}}function $l(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,n)}}function It(e,t,n,o){if(o===null)e.removeAttribute(n);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,o)}}function tt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ag(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function fh(e,t,n){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var a=o.get,l=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,l.call(this,c)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Yr(e){if(!e._valueTracker){var t=ag(e)?"checked":"value";e._valueTracker=fh(e,t,""+e[t])}}function lg(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=ag(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}var sh=/[\n"\\]/g;function xt(e){return e.replace(sh,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Lr(e,t,n,o,a,l,c,i){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+tt(t)):e.value!==""+tt(t)&&(e.value=""+tt(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?c==="number"&&e.value==t?or(e,tt(e.value)):or(e,tt(t)):n!=null?or(e,tt(n)):o!=null&&e.removeAttribute("value"),a==null&&l!=null&&(e.defaultChecked=!!l),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"?e.name=""+tt(i):e.removeAttribute("name")}function cg(e,t,n,o,a,l,c,i){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),t!=null||n!=null){if(!(l!=="submit"&&l!=="reset"||t!=null)){Yr(e);return}n=n!=null?""+tt(n):"",t=t!=null?""+tt(t):n,i||t===e.value||(e.value=t),e.defaultValue=t}o=o??a,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=i?e.checked:!!o,e.defaultChecked=!!o,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),Yr(e)}function or(e,t){e.defaultValue!==""+t&&(e.defaultValue=""+t)}function ea(e,t,n,o){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&o&&(e[n].defaultSelected=!0)}else{for(n=""+tt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function ig(e,t,n){if(t!=null&&(t=""+tt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+tt(n):""}function rg(e,t,n,o){if(t==null){if(o!=null){if(n!=null)throw Error(y(92));if(Va(o)){if(1<o.length)throw Error(y(93));o=o[0]}n=o}n==null&&(n=""),t=n}n=tt(t),e.defaultValue=n,o=e.textContent,o===n&&o!==""&&o!==null&&(e.value=o),Yr(e)}function fa(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var bh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function fs(e,t,n){var o=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,n):typeof n!="number"||n===0||bh.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function ug(e,t,n){if(t!=null&&typeof t!="object")throw Error(y(62));if(e=e.style,n!=null){for(var o in n)!n.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="",Y=!0);for(var a in t)o=t[a],t.hasOwnProperty(a)&&n[a]!==o&&(fs(e,a,o),Y=!0)}else for(var l in t)t.hasOwnProperty(l)&&fs(e,l,t[l])}function Qu(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var gh=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),vh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function bc(e){return vh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Lt(){}var Vr=null;function Zu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Xo=null,ta=null;function ss(e){var t=Ta(e);if(t&&(e=t.stateNode)){var n=e[Ie]||null;e:switch(e=t.stateNode,t.type){case"input":if(Lr(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+xt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=o[Ie]||null;if(!a)throw Error(y(90));Lr(o,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)o=n[t],o.form===e.form&&lg(o)}break e;case"textarea":ig(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&ea(e,!!n.multiple,t,!1)}}}var ar=!1;function dg(e,t,n){if(ar)return e(t,n);ar=!0;try{var o=e(t);return o}finally{if(ar=!1,(Xo!==null||ta!==null)&&(ki(),Xo&&(t=Xo,e=ta,ta=Xo=null,ss(t),e)))for(t=0;t<e.length;t++)ss(e[t])}}function cl(e,t){var n=e.stateNode;if(n===null)return null;var o=n[Ie]||null;if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(y(231,t,typeof n));return n}var an=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Gr=!1;if(an)try{Ro={},Object.defineProperty(Ro,"passive",{get:function(){Gr=!0}}),window.addEventListener("test",Ro,Ro),window.removeEventListener("test",Ro,Ro)}catch{Gr=!1}var Ro,zn=null,Ku=null,gc=null;function fg(){if(gc)return gc;var e,t=Ku,n=t.length,o,a="value"in zn?zn.value:zn.textContent,l=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===a[l-o];o++);return gc=a.slice(e,1<o?1-o:void 0)}function vc(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Fl(){return!0}function bs(){return!1}function Xe(e){function t(n,o,a,l,c){this._reactName=n,this._targetInst=a,this.type=o,this.nativeEvent=l,this.target=c,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Fl:bs,this.isPropagationStopped=bs,this}return $(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Fl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Fl)},persist:function(){},isPersistent:Fl}),t}var Zn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ri=Xe(Zn),zl=$({},Zn,{view:0,detail:0}),mh=Xe(zl),lr,cr,Ua,ui=$({},zl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ju,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ua&&(Ua&&e.type==="mousemove"?(lr=e.screenX-Ua.screenX,cr=e.screenY-Ua.screenY):cr=lr=0,Ua=e),lr)},movementY:function(e){return"movementY"in e?e.movementY:cr}}),gs=Xe(ui),ph=$({},ui,{dataTransfer:0}),hh=Xe(ph),yh=$({},zl,{relatedTarget:0}),ir=Xe(yh),xh=$({},Zn,{animationName:0,elapsedTime:0,pseudoElement:0}),kh=Xe(xh),Sh=$({},Zn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Th=Xe(Sh),wh=$({},Zn,{data:0}),vs=Xe(wh),Eh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},zh={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Nh={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Oh(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Nh[e])?!!t[e]:!1}function Ju(){return Oh}var Ah=$({},zl,{key:function(e){if(e.key){var t=Eh[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=vc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?zh[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ju,charCode:function(e){return e.type==="keypress"?vc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?vc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),_h=Xe(Ah),Mh=$({},ui,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ms=Xe(Mh),Ch=$({},Zn,{submitter:0}),Dh=Xe(Ch),Hh=$({},zl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ju}),Rh=Xe(Hh),Uh=$({},Zn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Bh=Xe(Uh),qh=$({},ui,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),jh=Xe(qh),Yh=$({},Zn,{newState:0,oldState:0,source:0}),Lh=Xe(Yh),Vh=[9,13,27,32],$u=an&&"CompositionEvent"in window,Za=null;an&&"documentMode"in document&&(Za=document.documentMode);var Gh=an&&"TextEvent"in window&&!Za,sg=an&&(!$u||Za&&8<Za&&11>=Za),ps=" ",hs=!1;function bg(e,t){switch(e){case"keyup":return Vh.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function gg(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Qo=!1;function Xh(e,t){switch(e){case"compositionend":return gg(t);case"keypress":return t.which!==32?null:(hs=!0,ps);case"textInput":return e=t.data,e===ps&&hs?null:e;default:return null}}function Qh(e,t){if(Qo)return e==="compositionend"||!$u&&bg(e,t)?(e=fg(),gc=Ku=zn=null,Qo=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return sg&&t.locale!=="ko"?null:t.data;default:return null}}var Zh={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ys(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Zh[e.type]:t==="textarea"}function vg(e,t,n,o){Xo?ta?ta.push(o):ta=[o]:Xo=o,t=oi(t,"onChange"),0<t.length&&(n=new ri("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var Ka=null,il=null;function Kh(e){dm(e,0)}function di(e){var t=Ga(e);if(lg(t))return e}function xs(e,t){if(e==="change")return t}var mg=!1;an&&(an?(Il="oninput"in document,Il||(rr=document.createElement("div"),rr.setAttribute("oninput","return;"),Il=typeof rr.oninput=="function"),Wl=Il):Wl=!1,mg=Wl&&(!document.documentMode||9<document.documentMode));var Wl,Il,rr;function ks(){Ka&&(Ka.detachEvent("onpropertychange",pg),il=Ka=null)}function pg(e){if(e.propertyName==="value"&&di(il)){var t=[];vg(t,il,e,Zu(e)),dg(Kh,t)}}function Jh(e,t,n){e==="focusin"?(ks(),Ka=t,il=n,Ka.attachEvent("onpropertychange",pg)):e==="focusout"&&ks()}function $h(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return di(il)}function Fh(e,t){if(e==="click")return di(t)}function Wh(e,t){if(e==="input"||e==="change")return di(t)}function Ih(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ut=typeof Object.is=="function"?Object.is:Ih;function rl(e,t){if(ut(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var a=n[o];if(!jr.call(t,a)||!ut(e[a],t[a]))return!1}return!0}function Xr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ss(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ts(e,t){var n=Ss(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ss(n)}}function hg(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?hg(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function yg(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Xr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Xr(e.document)}return t}function Fu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Ph=an&&"documentMode"in document&&11>=document.documentMode,Zo=null,Qr=null,Ja=null,Zr=!1;function ws(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zr||Zo==null||Zo!==Xr(o)||(o=Zo,"selectionStart"in o&&Fu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),Ja&&rl(Ja,o)||(Ja=o,o=oi(Qr,"onSelect"),0<o.length&&(t=new ri("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=Zo)))}function Pn(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ko={animationend:Pn("Animation","AnimationEnd"),animationiteration:Pn("Animation","AnimationIteration"),animationstart:Pn("Animation","AnimationStart"),transitionrun:Pn("Transition","TransitionRun"),transitionstart:Pn("Transition","TransitionStart"),transitioncancel:Pn("Transition","TransitionCancel"),transitionend:Pn("Transition","TransitionEnd")},ur={},xg={};an&&(xg=document.createElement("div").style,"AnimationEvent"in window||(delete Ko.animationend.animation,delete Ko.animationiteration.animation,delete Ko.animationstart.animation),"TransitionEvent"in window||delete Ko.transitionend.transition);function So(e){if(ur[e])return ur[e];if(!Ko[e])return e;var t=Ko[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in xg)return ur[e]=t[n];return e}var kg=So("animationend"),Sg=So("animationiteration"),Tg=So("animationstart"),e0=So("transitionrun"),t0=So("transitionstart"),n0=So("transitioncancel"),wg=So("transitionend"),Eg=new Map,Kr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Kr.push("scrollEnd");function Ct(e,t){Eg.set(e,t),ko(t,[e])}var o0=0;function ln(e,t){if(e.name!=null&&e.name!=="auto")return e.name;if(t.autoName!==null)return t.autoName;e=Mt.identifierPrefix;var n=o0++;return e="_"+e+"t_"+n.toString(32)+"_",t.autoName=e}function Es(e){if(e==null||typeof e=="string")return e;var t=null,n=ra;if(n!==null)for(var o=0;o<n.length;o++){var a=e[n[o]];if(a!=null){if(a==="none")return"none";t=t==null?a:t+(" "+a)}}return t??e.default}function sn(e,t){return e=Es(e),t=Es(t),t==null?e==="auto"?null:e:t==="auto"?null:t}var Uc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},pt=[],Jo=0,Wu=0;function fi(){for(var e=Jo,t=Wu=Jo=0;t<e;){var n=pt[t];pt[t++]=null;var o=pt[t];pt[t++]=null;var a=pt[t];pt[t++]=null;var l=pt[t];if(pt[t++]=null,o!==null&&a!==null){var c=o.pending;c===null?a.next=a:(a.next=c.next,c.next=a),o.pending=a}l!==0&&zg(n,a,l)}}function si(e,t,n,o){pt[Jo++]=e,pt[Jo++]=t,pt[Jo++]=n,pt[Jo++]=o,Wu|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function Iu(e,t,n,o){return si(e,t,n,o),Bc(e)}function To(e,t){return si(e,null,null,t),Bc(e)}function zg(e,t,n){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n);for(var a=!1,l=e.return;l!==null;)l.childLanes|=n,o=l.alternate,o!==null&&(o.childLanes|=n),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(a=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,a&&t!==null&&(a=31-it(n),e=l.hiddenUpdates,o=e[a],o===null?e[a]=[t]:o.push(t),t.lane=n|536870912),l):null}function Bc(e){if(50<al)throw al=0,Ec=null,Error(y(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var $o={};function a0(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function $e(e,t,n,o){return new a0(e,t,n,o)}function Pu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function nn(e,t){var n=e.alternate;return n===null?(n=$e(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Ng(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function mc(e,t,n,o,a,l){var c=0;if(o=e,typeof o=="function")Pu(o)&&(c=1);else if(typeof o=="string")c=_y(e,n,Xt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(o){case Hr:return e=$e(31,n,t,a),e.elementType=Hr,e.lanes=l,e;case Vo:return io(n.children,a,l,t);case Xb:c=8,a|=24;break;case Mr:return e=$e(12,n,t,a|2),e.elementType=Mr,e.lanes=l,e;case Cr:return e=$e(13,n,t,a),e.elementType=Cr,e.lanes=l,e;case Dr:return e=$e(19,n,t,a),e.elementType=Dr,e.lanes=l,e;case Qp:case Rr:return e=a|32,e=$e(30,n,t,e),e.elementType=Rr,e.lanes=l,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case Yt:c=10;break e;case Qb:c=9;break e;case Yu:c=11;break e;case Lu:c=14;break e;case Sn:c=16,o=null;break e}c=29,n=Error(y(130,e===null?"null":typeof e,"")),o=null}return t=$e(c,n,t,a),t.elementType=e,t.type=o,t.lanes=l,t}function io(e,t,n,o){return e=$e(7,e,o,t),e.lanes=n,e}function dr(e,t,n){return e=$e(6,e,null,t),e.lanes=n,e}function Og(e){var t=$e(18,null,null,0);return t.stateNode=e,t}function fr(e,t,n){return t=$e(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var zs=new WeakMap;function kt(e,t){if(typeof e=="object"&&e!==null){var n=zs.get(e);return n!==void 0?n:(t={value:e,source:t,stack:as(t)},zs.set(e,t),t)}return{value:e,source:t,stack:as(t)}}var Fo=[],Wo=0,qc=null,ul=0,ht=[],yt=0,Ln=null,Vt=1,Gt="";function en(e,t){Fo[Wo++]=ul,Fo[Wo++]=qc,qc=e,ul=t}function Ag(e,t,n){ht[yt++]=Vt,ht[yt++]=Gt,ht[yt++]=Ln,Ln=e;var o=Vt;e=Gt;var a=32-it(o)-1;o&=~(1<<a),n+=1;var l=32-it(t)+a;if(30<l){var c=a-a%5;l=(o&(1<<c)-1).toString(32),o>>=c,a-=c,Vt=1<<32-it(t)+a|n<<a|o,Gt=l+e}else Vt=1<<l|n<<a|o,Gt=e}function bi(e){e.return!==null&&(en(e,1),Ag(e,1,0))}function ed(e){for(;e===qc;)qc=Fo[--Wo],Fo[Wo]=null,ul=Fo[--Wo],Fo[Wo]=null;for(;e===Ln;)Ln=ht[--yt],ht[yt]=null,Gt=ht[--yt],ht[yt]=null,Vt=ht[--yt],ht[yt]=null}function _g(e,t){ht[yt++]=Vt,ht[yt++]=Gt,ht[yt++]=Ln,Vt=t.id,Gt=t.overflow,Ln=e}var Ee=null,P=null,R=!1,Cn=null,St=!1,Jr=Error(y(519));function Vn(e){var t=Error(y(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw dl(kt(t,e)),Jr}function Ns(e){var t=e.stateNode,n=e.type,o=e.memoizedProps;switch(t[Ae]=e,t[Ie]=o,n){case"dialog":U("cancel",t),U("close",t);break;case"iframe":case"object":case"embed":U("load",t);break;case"video":case"audio":for(n=0;n<gl.length;n++)U(gl[n],t);break;case"source":U("error",t);break;case"img":case"image":case"link":U("error",t),U("load",t);break;case"details":U("toggle",t);break;case"input":U("invalid",t),cg(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":U("invalid",t);break;case"textarea":U("invalid",t),rg(t,o.value,o.defaultValue,o.children)}n=o.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||o.suppressHydrationWarning===!0||sm(t.textContent,n)?(o.popover!=null&&(U("beforetoggle",t),U("toggle",t)),o.onScroll!=null&&U("scroll",t),o.onScrollEnd!=null&&U("scrollend",t),o.onClick!=null&&(t.onclick=Lt),t=!0):t=!1,t||Vn(e,!0)}function jc(e){for(Ee=e.return;Ee;)switch(Ee.tag){case 5:case 31:case 13:St=!1;return;case 27:case 3:St=!0;return;default:Ee=Ee.return}}function Uo(e){if(e!==Ee)return!1;if(!R)return jc(e),R=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Cu(e.type,e.memoizedProps)),n=!n),n&&P&&Vn(e),jc(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));P=Tb(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));P=Tb(e)}else t===27?(t=P,Kn(e.type)?(e=Uu,Uu=null,P=e):P=t):P=Ee?Tt(e.stateNode.nextSibling):null;return!0}function so(){P=Ee=null,R=!1}function sr(){var e=Cn;return e!==null&&(Ke===null?Ke=e:Ke.push.apply(Ke,e),Cn=null),e}function dl(e){Cn===null?Cn=[e]:Cn.push(e)}var $r=Kt(null),wo=null,tn=null;function Nn(e,t,n){ee($r,t._currentValue),t._currentValue=n}function on(e){e._currentValue=$r.current,Me($r)}function pc(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Fr(e,t,n,o){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var l=a.dependencies;if(l!==null){var c=a.child;l=l.firstContext;e:for(;l!==null;){var i=l;l=a;for(var r=0;r<t.length;r++)if(i.context===t[r]){l.lanes|=n,i=l.alternate,i!==null&&(i.lanes|=n),pc(l.return,n,e),o||(c=null);break e}l=i.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(y(341));c.lanes|=n,l=c.alternate,l!==null&&(l.lanes|=n),pc(c,n,e),c=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),pc(a.return,n,e),c=a.child,c=c!==null?c.sibling:null):c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function bo(e,t,n,o){e=null;for(var a=t,l=!1;a!==null;){if(!l){if((a.flags&524288)!==0)l=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(y(387));if(c=c.memoizedProps,c!==null){var i=a.type;ut(a.pendingProps.value,c.value)||(e!==null?e.push(i):e=[i])}}else if(a===Mc.current){if(c=a.alternate,c===null)throw Error(y(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(ya):e=[ya])}a=a.return}return e!==null&&Fr(t,e,n,o),t.flags|=262144,e!==null}function Yc(e){for(e=e.firstContext;e!==null;){if(!ut(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function go(e){wo=e,tn=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function _e(e){return Mg(wo,e)}function Pl(e,t){return wo===null&&go(e),Mg(e,t)}function Mg(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},tn===null){if(e===null)throw Error(y(308));tn=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else tn=tn.next=t;return n}var l0=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},c0=ke.unstable_scheduleCallback,i0=ke.unstable_NormalPriority,ge={$$typeof:Yt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function td(){return{controller:new l0,data:new Map,refCount:0}}function Nl(e){e.refCount--,e.refCount===0&&c0(i0,function(){e.controller.abort()})}function Os(e,t){if((e.pendingLanes&4194048)!==0){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var o=t[e];n.indexOf(o)===-1&&n.push(o)}}}var Xa=null;function r0(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var $a=null,Wr=0,vo=0,na=null;function u0(e,t){if($a===null){var n=$a=[];Wr=0,vo=Ad(),na={status:"pending",value:void 0,then:function(o){n.push(o)}}}return Wr++,t.then(As,As),t}function As(){if(--Wr===0&&(Xa=null,$a!==null)){na!==null&&(na.status="fulfilled");var e=$a;$a=null,vo=0,na=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function d0(e,t){var n=[],o={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(o.status="rejected",o.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),o}var _s=_.S;_.S=function(e,t){if($v=lt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&u0(e,t),Xa!==null)for(var n=ma;n!==null;)Os(n,Xa),n=n.next;if(n=e.types,n!==null){for(var o=ma;o!==null;)Os(o,n),o=o.next;if(vo!==0){o=Xa,o===null&&(o=Xa=[]);for(var a=0;a<n.length;a++){var l=n[a];o.indexOf(l)===-1&&o.push(l)}}}_s!==null&&_s(e,t)};var ro=Kt(null);function nd(){var e=ro.current;return e!==null?e:J.pooledCache}function hc(e,t){t===null?ee(ro,ro.current):ee(ro,t.pool)}function Cg(){var e=nd();return e===null?null:{parent:ge._currentValue,pool:e}}var wa=Error(y(460)),od=Error(y(474)),gi=Error(y(542)),Lc={then:function(){}};function Ms(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Dg(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Lt,Lt),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Ds(e),e===void 0&&!("reason"in t)?Error(y(600)):e;default:if(typeof t.status=="string")t.then(Lt,Lt);else{if(e=J,e!==null&&100<e.shellSuspendCounter)throw Error(y(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=o}},function(o){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Ds(e),e}throw uo=t,wa}}function no(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(uo=n,wa):n}}var uo=null;function Cs(){if(uo===null)throw Error(y(459));var e=uo;return uo=null,e}function Ds(e){if(e===wa||e===gi)throw Error(y(483))}var oa=null,fl=0;function ec(e){var t=fl;return fl+=1,oa===null&&(oa=[]),Dg(oa,e,t)}function yn(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function tc(e,t){throw t.$$typeof===Xp?Error(y(525)):(e=Object.prototype.toString.call(t),Error(y(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Hg(e){function t(f,u){if(e){var v=f.deletions;v===null?(f.deletions=[u],f.flags|=16):v.push(u)}}function n(f,u){if(!e)return null;for(;u!==null;)t(f,u),u=u.sibling;return null}function o(f){for(var u=new Map;f!==null;)f.key===null?u.set(f.index,f):u.set(f.key,f),f=f.sibling;return u}function a(f,u){return f=nn(f,u),f.index=0,f.sibling=null,f}function l(f,u,v){return f.index=v,e?(v=f.alternate,v!==null?(v=v.index,v<u?(f.flags|=2,u):v):(f.flags|=134217730,u)):(f.flags|=1048576,u)}function c(f){return e&&f.alternate===null&&(f.flags|=134217730),f}function i(f,u,v,p){return u===null||u.tag!==6?(u=dr(v,f.mode,p),u.return=f,u):(u=a(u,v),u.return=f,u)}function r(f,u,v,p){var h=v.type;return h===Vo?(f=g(f,u,v.props.children,p,v.key),yn(f,v),f):u!==null&&(u.elementType===h||typeof h=="object"&&h!==null&&h.$$typeof===Sn&&no(h)===u.type)?(u=a(u,v.props),yn(u,v),u.return=f,u):(u=mc(v.type,v.key,v.props,null,f.mode,p),yn(u,v),u.return=f,u)}function d(f,u,v,p){return u===null||u.tag!==4||u.stateNode.containerInfo!==v.containerInfo||u.stateNode.implementation!==v.implementation?(u=fr(v,f.mode,p),u.return=f,u):(u=a(u,v.children||[]),u.return=f,u)}function g(f,u,v,p,h){return u===null||u.tag!==7?(u=io(v,f.mode,p,h),u.return=f,u):(u=a(u,v),u.return=f,u)}function m(f,u,v){if(typeof u=="string"&&u!==""||typeof u=="number"||typeof u=="bigint")return u=dr(""+u,f.mode,v),u.return=f,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Ql:return v=mc(u.type,u.key,u.props,null,f.mode,v),yn(v,u),v.return=f,v;case La:return u=fr(u,f.mode,v),u.return=f,u;case Sn:return u=no(u),m(f,u,v)}if(Va(u)||Ra(u))return u=io(u,f.mode,v,null),u.return=f,u;if(typeof u.then=="function")return m(f,ec(u),v);if(u.$$typeof===Yt)return m(f,Pl(f,u),v);tc(f,u)}return null}function s(f,u,v,p){var h=u!==null?u.key:null;if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return h!==null?null:i(f,u,""+v,p);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Ql:return v.key===h?r(f,u,v,p):null;case La:return v.key===h?d(f,u,v,p):null;case Sn:return v=no(v),s(f,u,v,p)}if(Va(v)||Ra(v))return h!==null?null:g(f,u,v,p,null);if(typeof v.then=="function")return s(f,u,ec(v),p);if(v.$$typeof===Yt)return s(f,u,Pl(f,v),p);tc(f,v)}return null}function b(f,u,v,p,h){if(typeof p=="string"&&p!==""||typeof p=="number"||typeof p=="bigint")return f=f.get(v)||null,i(u,f,""+p,h);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case Ql:return f=f.get(p.key===null?v:p.key)||null,r(u,f,p,h);case La:return f=f.get(p.key===null?v:p.key)||null,d(u,f,p,h);case Sn:return p=no(p),b(f,u,v,p,h)}if(Va(p)||Ra(p))return f=f.get(v)||null,g(u,f,p,h,null);if(typeof p.then=="function")return b(f,u,v,ec(p),h);if(p.$$typeof===Yt)return b(f,u,v,Pl(u,p),h);tc(u,p)}return null}function x(f,u,v,p){for(var h=null,w=null,T=u,E=u=0,q=null;T!==null&&E<v.length;E++){T.index>E?(q=T,T=null):q=T.sibling;var D=s(f,T,v[E],p);if(D===null){T===null&&(T=q);break}e&&T&&D.alternate===null&&t(f,T),u=l(D,u,E),w===null?h=D:w.sibling=D,w=D,T=q}if(E===v.length)return n(f,T),R&&en(f,E),h;if(T===null){for(;E<v.length;E++)T=m(f,v[E],p),T!==null&&(u=l(T,u,E),w===null?h=T:w.sibling=T,w=T);return R&&en(f,E),h}for(T=o(T);E<v.length;E++)q=b(T,f,E,v[E],p),q!==null&&(e&&(D=q.alternate,D!==null&&T.delete(D.key===null?E:D.key)),u=l(q,u,E),w===null?h=q:w.sibling=q,w=q);return e&&T.forEach(function(re){return t(f,re)}),R&&en(f,E),h}function k(f,u,v,p){if(v==null)throw Error(y(151));for(var h=null,w=null,T=u,E=u=0,q=null,D=v.next();T!==null&&!D.done;E++,D=v.next()){T.index>E?(q=T,T=null):q=T.sibling;var re=s(f,T,D.value,p);if(re===null){T===null&&(T=q);break}e&&T&&re.alternate===null&&t(f,T),u=l(re,u,E),w===null?h=re:w.sibling=re,w=re,T=q}if(D.done)return n(f,T),R&&en(f,E),h;if(T===null){for(;!D.done;E++,D=v.next())D=m(f,D.value,p),D!==null&&(u=l(D,u,E),w===null?h=D:w.sibling=D,w=D);return R&&en(f,E),h}for(T=o(T);!D.done;E++,D=v.next())D=b(T,f,E,D.value,p),D!==null&&(e&&(q=D.alternate,q!==null&&T.delete(q.key===null?E:q.key)),u=l(D,u,E),w===null?h=D:w.sibling=D,w=D);return e&&T.forEach(function(Jn){return t(f,Jn)}),R&&en(f,E),h}function z(f,u,v,p){if(typeof v=="object"&&v!==null&&v.type===Vo&&v.key===null&&v.props.ref===void 0&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case Ql:e:{for(var h=v.key;u!==null;){if(u.key===h){if(h=v.type,h===Vo){if(u.tag===7){n(f,u.sibling),p=a(u,v.props.children),yn(p,v),p.return=f,f=p;break e}}else if(u.elementType===h||typeof h=="object"&&h!==null&&h.$$typeof===Sn&&no(h)===u.type){n(f,u.sibling),p=a(u,v.props),yn(p,v),p.return=f,f=p;break e}n(f,u);break}else t(f,u);u=u.sibling}v.type===Vo?(p=io(v.props.children,f.mode,p,v.key),yn(p,v),p.return=f,f=p):(p=mc(v.type,v.key,v.props,null,f.mode,p),yn(p,v),p.return=f,f=p)}return c(f);case La:e:{for(h=v.key;u!==null;){if(u.key===h)if(u.tag===4&&u.stateNode.containerInfo===v.containerInfo&&u.stateNode.implementation===v.implementation){n(f,u.sibling),p=a(u,v.children||[]),p.return=f,f=p;break e}else{n(f,u);break}else t(f,u);u=u.sibling}p=fr(v,f.mode,p),p.return=f,f=p}return c(f);case Sn:return v=no(v),z(f,u,v,p)}if(Va(v))return x(f,u,v,p);if(Ra(v)){if(h=Ra(v),typeof h!="function")throw Error(y(150));return v=h.call(v),k(f,u,v,p)}if(typeof v.then=="function")return z(f,u,ec(v),p);if(v.$$typeof===Yt)return z(f,u,Pl(f,v),p);tc(f,v)}return typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint"?(v=""+v,u!==null&&u.tag===6?(n(f,u.sibling),p=a(u,v),p.return=f,f=p):(n(f,u),p=dr(v,f.mode,p),p.return=f,f=p),c(f)):n(f,u)}return function(f,u,v,p){try{fl=0;var h=z(f,u,v,p);return oa=null,h}catch(T){if(T===wa||T===gi)throw T;var w=$e(29,T,null,f.mode);return w.lanes=p,w.return=f,w}}}var mo=Hg(!0),Rg=Hg(!1),Tn=!1;function ad(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ir(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Dn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Hn(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(L&2)!==0){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,t=Bc(e),zg(e,null,n),t}return si(e,o,t,n),Bc(e)}function Fa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Ib(e,n)}}function br(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var a=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};l===null?a=l=c:l=l.next=c,n=n.next}while(n!==null);l===null?a=l=t:l=l.next=t}else a=l=t;n={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:l,shared:o.shared,callbacks:o.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Pr=!1;function Wa(){if(Pr){var e=na;if(e!==null)throw e}}function Ia(e,t,n,o){Pr=!1;var a=e.updateQueue;Tn=!1;var l=a.firstBaseUpdate,c=a.lastBaseUpdate,i=a.shared.pending;if(i!==null){a.shared.pending=null;var r=i,d=r.next;r.next=null,c===null?l=d:c.next=d,c=r;var g=e.alternate;g!==null&&(g=g.updateQueue,i=g.lastBaseUpdate,i!==c&&(i===null?g.firstBaseUpdate=d:i.next=d,g.lastBaseUpdate=r))}if(l!==null){var m=a.baseState;c=0,g=d=r=null,i=l;do{var s=i.lane&-536870913,b=s!==i.lane;if(b?(j&s)===s:(o&s)===s){s!==0&&s===vo&&(Pr=!0),g!==null&&(g=g.next={lane:0,tag:i.tag,payload:i.payload,callback:null,next:null});e:{var x=e,k=i;s=t;var z=n;switch(k.tag){case 1:if(x=k.payload,typeof x=="function"){m=x.call(z,m,s);break e}m=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=k.payload,s=typeof x=="function"?x.call(z,m,s):x,s==null)break e;m=$({},m,s);break e;case 2:Tn=!0}}s=i.callback,s!==null&&(e.flags|=64,b&&(e.flags|=8192),b=a.callbacks,b===null?a.callbacks=[s]:b.push(s))}else b={lane:s,tag:i.tag,payload:i.payload,callback:i.callback,next:null},g===null?(d=g=b,r=m):g=g.next=b,c|=s;if(i=i.next,i===null){if(i=a.shared.pending,i===null)break;b=i,i=b.next,b.next=null,a.lastBaseUpdate=b,a.shared.pending=null}}while(!0);g===null&&(r=m),a.baseState=r,a.firstBaseUpdate=d,a.lastBaseUpdate=g,l===null&&(a.shared.lanes=0),Qn|=c,e.lanes=c,e.memoizedState=m}}function Ug(e,t){if(typeof e!="function")throw Error(y(191,e));e.call(t)}function Bg(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Ug(n[e],t)}var Gn=Kt(null),Vc=Kt(0);function Hs(e,t){e=dn,ee(Vc,e),ee(Gn,t),dn=e|t.baseLanes}function eu(){ee(Vc,dn),ee(Gn,Gn.current)}function ld(){dn=Vc.current,Me(Gn),Me(Vc)}var He=Kt(null),je=null;function Rn(e){var t=e.alternate;ee(Ce,Ce.current&1),ee(He,e),je===null&&(t===null||Gn.current!==null||t.memoizedState!==null)&&(je=e)}function tu(e){ee(Ce,Ce.current),ee(He,e),je===null&&(je=e)}function qg(e){e.tag===22?(ee(Ce,Ce.current),ee(He,e),je===null&&(je=e)):Un()}function Un(){ee(Ce,Ce.current),ee(He,He.current)}function nt(e){Me(He),je===e&&(je=null),Me(Ce)}var Ce=Kt(0);function sl(e,t){ee(He,He.current),ee(Ce,t)}function cd(e){Me(Ce),Me(He),je===e&&(je=null)}function Gc(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Ru(n)||Dd(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!=="independent"){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var cn=0,H=null,K=null,be=null,Xc=!1,aa=!1,po=!1,Qc=0,bl=0,la=null,f0=0;function ue(){throw Error(y(321))}function id(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ut(e[n],t[n]))return!1;return!0}function rd(e,t,n,o,a,l){return cn=l,H=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,_.H=e===null||e.memoizedState===null?vv:mv,po=!1,l=n(o,a),po=!1,aa&&(l=Yg(t,n,o,a)),jg(e),l}function jg(e){_.H=Zc;var t=K!==null&&K.next!==null;if(cn=0,be=K=H=null,Xc=!1,bl=0,la=null,t)throw Error(y(300));e===null||ve||(e=e.dependencies,e!==null&&Yc(e)&&(ve=!0))}function Yg(e,t,n,o){H=e;var a=0;do{if(aa&&(la=null),bl=0,aa=!1,25<=a)throw Error(y(301));if(a+=1,be=K=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}_.H=y0,l=t(n,o)}while(aa);return l}function s0(){var e=_.H,t=e.useState()[0];return t=typeof t.then=="function"?Ol(t):t,e=e.useState()[0],(K!==null?K.memoizedState:null)!==e&&(H.flags|=1024),t}function ud(){var e=Qc!==0;return Qc=0,e}function dd(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function fd(e){if(Xc){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Xc=!1}cn=0,be=K=H=null,aa=!1,bl=Qc=0,la=null}function Ge(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return be===null?H.memoizedState=be=e:be=be.next=e,be}function fe(){if(K===null){var e=H.alternate;e=e!==null?e.memoizedState:null}else e=K.next;var t=be===null?H.memoizedState:be.next;if(t!==null)be=t,K=e;else{if(e===null)throw H.alternate===null?Error(y(467)):Error(y(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},be===null?H.memoizedState=be=e:be=be.next=e}return be}function vi(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ol(e){var t=bl;return bl+=1,la===null&&(la=[]),e=Dg(la,e,t),t=H,(be===null?t.memoizedState:be.next)===null&&(t=t.alternate,_.H=t===null||t.memoizedState===null?vv:mv),e}function mi(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ol(e);if(e.$$typeof===Kp)return;if(e.$$typeof===Yt)return _e(e)}throw Error(y(438,String(e)))}function sd(e){var t=null,n=H.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var o=H.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=vi(),H.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),o=0;o<e;o++)n[o]=Zp;return t.index++,n}function rn(e,t){return typeof t=="function"?t(e):t}function yc(e){var t=fe();return bd(t,K,e)}function bd(e,t,n){var o=e.queue;if(o===null)throw Error(y(311));o.lastRenderedReducer=n;var a=e.baseQueue,l=o.pending;if(l!==null){if(a!==null){var c=a.next;a.next=l.next,l.next=c}t.baseQueue=a=l,o.pending=null}if(l=e.baseState,a===null)e.memoizedState=l;else{t=a.next;var i=c=null,r=null,d=t,g=!1;do{var m=d.lane&-536870913;if(m!==d.lane?(j&m)===m:(cn&m)===m){var s=d.revertLane;if(s===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),m===vo&&(g=!0);else if((cn&s)===s){d=d.next,s===vo&&(g=!0);continue}else m={lane:0,revertLane:d.revertLane,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=m,c=l):r=r.next=m,H.lanes|=s,Qn|=s;m=d.action,po&&n(l,m),l=d.hasEagerState?d.eagerState:n(l,m)}else s={lane:m,revertLane:d.revertLane,gesture:d.gesture,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=s,c=l):r=r.next=s,H.lanes|=m,Qn|=m;d=d.next}while(d!==null&&d!==t);if(r===null?c=l:r.next=i,!ut(l,e.memoizedState)&&(ve=!0,g&&(n=na,n!==null)))throw n;e.memoizedState=l,e.baseState=c,e.baseQueue=r,o.lastRenderedState=l}return a===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function gr(e){var t=fe(),n=t.queue;if(n===null)throw Error(y(311));n.lastRenderedReducer=e;var o=n.dispatch,a=n.pending,l=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do l=e(l,c.action),c=c.next;while(c!==a);ut(l,t.memoizedState)||(ve=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,o]}function Lg(e,t,n){var o=H,a=fe(),l=R;if(l){if(n===void 0)throw Error(y(407));n=n()}else n=t();var c=!ut((K||a).memoizedState,n);if(c&&(a.memoizedState=n,ve=!0),a=a.queue,gd(Xg.bind(null,o,a,e),[e]),e=a.getSnapshot!==t||c||be!==null&&(be.memoizedState.tag&1)!==0,sa(e?9:8,{destroy:void 0},Gg.bind(null,o,a,n,t),null),e){if(o.flags|=2048,J===null)throw Error(y(349));l||(cn&127)!==0||Vg(o,t,n)}return n}function Vg(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=H.updateQueue,t===null?(t=vi(),H.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Gg(e,t,n,o){t.value=n,t.getSnapshot=o,Qg(t)&&Zg(e)}function Xg(e,t,n){return n(function(){Qg(t)&&Zg(e)})}function Qg(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ut(e,n)}catch{return!0}}function Zg(e){var t=To(e,2);t!==null&&Fe(t,e,2)}function nu(e){var t=Ge();if(typeof e=="function"){var n=e;if(e=n(),po){En(!0);try{n()}finally{En(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:rn,lastRenderedState:e},t}function Kg(e,t,n,o){return e.baseState=n,bd(e,K,typeof o=="function"?o:rn)}function b0(e,t,n,o,a){if(hi(e))throw Error(y(485));if(e=t.action,e!==null){var l={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){l.listeners.push(c)}};_.T!==null?n(!0):l.isTransition=!1,o(l),n=t.pending,n===null?(l.next=t.pending=l,Jg(t,l)):(l.next=n.next,t.pending=n.next=l)}}function Jg(e,t){var n=t.action,o=t.payload,a=e.state;if(t.isTransition){var l=_.T,c={};c.types=l!==null?l.types:null,_.T=c;try{var i=n(a,o),r=_.S;r!==null&&r(c,i),Rs(e,t,i)}catch(d){ou(e,t,d)}finally{l!==null&&c.types!==null&&(l.types=c.types),_.T=l}}else try{l=n(a,o),Rs(e,t,l)}catch(d){ou(e,t,d)}}function Rs(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(o){Us(e,t,o)},function(o){return ou(e,t,o)}):Us(e,t,n)}function Us(e,t,n){t.status="fulfilled",t.value=n,$g(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Jg(e,n)))}function ou(e,t,n){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=n,$g(t),t=t.next;while(t!==o)}e.action=null}function $g(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Fg(e,t){return t}function Bs(e,t){if(R){var n=J.formState;if(n!==null){e:{var o=H;if(R){if(P){t:{for(var a=P,l=St;a.nodeType!==8;){if(!l){a=null;break t}if(a=Tt(a.nextSibling),a===null){a=null;break t}}l=a.data,a=l==="F!"||l==="F"?a:null}if(a){P=Tt(a.nextSibling),o=a.data==="F!";break e}}Vn(o)}o=!1}o&&(t=n[0])}}return n=Ge(),n.memoizedState=n.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Fg,lastRenderedState:t},n.queue=o,n=sv.bind(null,H,o),o.dispatch=n,o=nu(!1),l=hd.bind(null,H,!1,o.queue),o=Ge(),a={state:t,dispatch:null,action:e,pending:null},o.queue=a,n=b0.bind(null,H,a,l,n),a.dispatch=n,o.memoizedState=e,[t,n,!1]}function qs(e){var t=fe();return Wg(t,K,e)}function Wg(e,t,n){if(t=bd(e,t,Fg)[0],e=yc(rn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=Ol(t)}catch(c){throw c===wa?gi:c}else o=t;t=fe();var a=t.queue,l=a.dispatch;return n!==t.memoizedState&&(H.flags|=2048,sa(9,{destroy:void 0},g0.bind(null,a,n),null)),[o,l,e]}function g0(e,t){e.action=t}function js(e){var t=fe(),n=K;if(n!==null)return Wg(t,n,e);fe(),t=t.memoizedState,n=fe();var o=n.queue.dispatch;return n.memoizedState=e,[t,o,!1]}function sa(e,t,n,o){return e={tag:e,create:n,deps:o,inst:t,next:null},t=H.updateQueue,t===null&&(t=vi(),H.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e),e}function Ig(){return fe().memoizedState}function xc(e,t,n,o){var a=Ge();H.flags|=e,a.memoizedState=sa(1|t,{destroy:void 0},n,o===void 0?null:o)}function pi(e,t,n,o){var a=fe();o=o===void 0?null:o;var l=a.memoizedState.inst;K!==null&&o!==null&&id(o,K.memoizedState.deps)?a.memoizedState=sa(t,l,n,o):(H.flags|=e,a.memoizedState=sa(1|t,l,n,o))}function Ys(e,t){xc(8390656,8,e,t)}function gd(e,t){pi(2048,8,e,t)}function v0(e){H.flags|=4;var t=H.updateQueue;if(t===null)t=vi(),H.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Pg(e){var t=fe().memoizedState;return v0({ref:t,nextImpl:e}),function(){if((L&2)!==0)throw Error(y(440));return t.impl.apply(void 0,arguments)}}function ev(e,t){return pi(4,2,e,t)}function tv(e,t){return pi(4,4,e,t)}function nv(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ov(e,t,n){n=n!=null?n.concat([e]):null,pi(4,4,nv.bind(null,t,e),n)}function vd(){}function av(e,t){var n=fe();t=t===void 0?null:t;var o=n.memoizedState;return t!==null&&id(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function lv(e,t){var n=fe();t=t===void 0?null:t;var o=n.memoizedState;if(t!==null&&id(t,o[1]))return o[0];if(o=e(),po){En(!0);try{e()}finally{En(!1)}}return n.memoizedState=[o,t],o}function md(e,t,n){return n===void 0||(cn&1073741824)!==0&&(j&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Wv(),H.lanes|=e,Qn|=e,n)}function cv(e,t,n,o){return ut(n,t)?n:Gn.current!==null?(e=md(e,n,o),ut(e,t)||(ve=!0),e):(cn&106)===0||(cn&1073741824)!==0&&(j&261930)===0?(ve=!0,e.memoizedState=n):(e=Wv(),H.lanes|=e,Qn|=e,t)}function iv(e,t,n,o,a){var l=V.p;V.p=l!==0&&8>l?l:8;var c=_.T,i={};i.types=c!==null?c.types:null,_.T=i,hd(e,!1,t,n);try{var r=a(),d=_.S;if(d!==null&&d(i,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var g=d0(r,o);Pa(e,t,g,rt(e))}else Pa(e,t,o,rt(e))}catch(m){Pa(e,t,{then:function(){},status:"rejected",reason:m},rt())}finally{V.p=l,c!==null&&i.types!==null&&(c.types=i.types),_.T=c}}function m0(){}function au(e,t,n,o){if(e.tag!==5)throw Error(y(476));var a=rv(e).queue;iv(e,a,t,co,n===null?m0:function(){return uv(e),n(o)})}function rv(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:co,baseState:co,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:rn,lastRenderedState:co},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:rn,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function uv(e){var t=rv(e);t.next===null&&(t=e.alternate.memoizedState),Pa(e,t.next.queue,{},rt())}function pd(){return _e(ya)}function dv(){return fe().memoizedState}function fv(){return fe().memoizedState}function p0(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=rt();e=Dn(n);var o=Hn(t,e,n);o!==null&&(Fe(o,t,n),Fa(o,t,n)),t={cache:td()},e.payload=t;return}t=t.return}}function h0(e,t,n){var o=rt();n={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},hi(e)?bv(t,n):(n=Iu(e,t,n,o),n!==null&&(Fe(n,e,o),gv(n,t,o)))}function sv(e,t,n){var o=rt();Pa(e,t,n,o)}function Pa(e,t,n,o){var a={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(hi(e))bv(t,a);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var c=t.lastRenderedState,i=l(c,n);if(a.hasEagerState=!0,a.eagerState=i,ut(i,c))return si(e,t,a,0),J===null&&fi(),!1}catch{}if(n=Iu(e,t,a,o),n!==null)return Fe(n,e,o),gv(n,t,o),!0}return!1}function hd(e,t,n,o){if(o={lane:2,revertLane:Ad(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},hi(e)){if(t)throw Error(y(479))}else t=Iu(e,n,o,2),t!==null&&Fe(t,e,2)}function hi(e){var t=e.alternate;return e===H||t!==null&&t===H}function bv(e,t){aa=Xc=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function gv(e,t,n){if((n&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Ib(e,n)}}var Zc={readContext:_e,use:mi,useCallback:ue,useContext:ue,useEffect:ue,useImperativeHandle:ue,useLayoutEffect:ue,useInsertionEffect:ue,useMemo:ue,useReducer:ue,useRef:ue,useState:ue,useDebugValue:ue,useDeferredValue:ue,useTransition:ue,useSyncExternalStore:ue,useId:ue,useHostTransitionStatus:ue,useFormState:ue,useActionState:ue,useOptimistic:ue,useMemoCache:ue,useCacheRefresh:ue,useEffectEvent:ue},vv={readContext:_e,use:mi,useCallback:function(e,t){return Ge().memoizedState=[e,t===void 0?null:t],e},useContext:_e,useEffect:Ys,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,xc(4194308,4,nv.bind(null,t,e),n)},useLayoutEffect:function(e,t){return xc(4194308,4,e,t)},useInsertionEffect:function(e,t){xc(4,2,e,t)},useMemo:function(e,t){var n=Ge();t=t===void 0?null:t;var o=e();if(po){En(!0);try{e()}finally{En(!1)}}return n.memoizedState=[o,t],o},useReducer:function(e,t,n){var o=Ge();if(n!==void 0){var a=n(t);if(po){En(!0);try{n(t)}finally{En(!1)}}}else a=t;return o.memoizedState=o.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},o.queue=e,e=e.dispatch=h0.bind(null,H,e),[o.memoizedState,e]},useRef:function(e){var t=Ge();return e={current:e},t.memoizedState=e},useState:function(e){e=nu(e);var t=e.queue,n=sv.bind(null,H,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:vd,useDeferredValue:function(e,t){var n=Ge();return md(n,e,t)},useTransition:function(){var e=nu(!1);return e=iv.bind(null,H,e.queue,!0,!1),Ge().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var o=H,a=Ge();if(R){if(n===void 0)throw Error(y(407));n=n()}else{if(n=t(),J===null)throw Error(y(349));(j&127)!==0||Vg(o,t,n)}a.memoizedState=n;var l={value:n,getSnapshot:t};return a.queue=l,Ys(Xg.bind(null,o,l,e),[e]),o.flags|=2048,sa(9,{destroy:void 0},Gg.bind(null,o,l,n,t),null),n},useId:function(){var e=Ge(),t=J.identifierPrefix;if(R){var n=Gt,o=Vt;n=(o&~(1<<32-it(o)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Qc++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=f0++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:pd,useFormState:Bs,useActionState:Bs,useOptimistic:function(e){var t=Ge();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=hd.bind(null,H,!0,n),n.dispatch=t,[e,t]},useMemoCache:sd,useCacheRefresh:function(){return Ge().memoizedState=p0.bind(null,H)},useEffectEvent:function(e){var t=Ge(),n={impl:e};return t.memoizedState=n,function(){if((L&2)!==0)throw Error(y(440));return n.impl.apply(void 0,arguments)}}},mv={readContext:_e,use:mi,useCallback:av,useContext:_e,useEffect:gd,useImperativeHandle:ov,useInsertionEffect:ev,useLayoutEffect:tv,useMemo:lv,useReducer:yc,useRef:Ig,useState:function(){return yc(rn)},useDebugValue:vd,useDeferredValue:function(e,t){var n=fe();return cv(n,K.memoizedState,e,t)},useTransition:function(){var e=yc(rn)[0],t=fe().memoizedState;return[typeof e=="boolean"?e:Ol(e),t]},useSyncExternalStore:Lg,useId:dv,useHostTransitionStatus:pd,useFormState:qs,useActionState:qs,useOptimistic:function(e,t){var n=fe();return Kg(n,K,e,t)},useMemoCache:sd,useCacheRefresh:fv,useEffectEvent:Pg},y0={readContext:_e,use:mi,useCallback:av,useContext:_e,useEffect:gd,useImperativeHandle:ov,useInsertionEffect:ev,useLayoutEffect:tv,useMemo:lv,useReducer:gr,useRef:Ig,useState:function(){return gr(rn)},useDebugValue:vd,useDeferredValue:function(e,t){var n=fe();return K===null?md(n,e,t):cv(n,K.memoizedState,e,t)},useTransition:function(){var e=gr(rn)[0],t=fe().memoizedState;return[typeof e=="boolean"?e:Ol(e),t]},useSyncExternalStore:Lg,useId:dv,useHostTransitionStatus:pd,useFormState:js,useActionState:js,useOptimistic:function(e,t){var n=fe();return K!==null?Kg(n,K,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:sd,useCacheRefresh:fv,useEffectEvent:Pg};function vr(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:$({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var lu={enqueueSetState:function(e,t,n){e=e._reactInternals;var o=rt(),a=Dn(o);a.payload=t,n!=null&&(a.callback=n),t=Hn(e,a,o),t!==null&&(Fe(t,e,o),Fa(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=rt(),a=Dn(o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Hn(e,a,o),t!==null&&(Fe(t,e,o),Fa(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=rt(),o=Dn(n);o.tag=2,t!=null&&(o.callback=t),t=Hn(e,o,n),t!==null&&(Fe(t,e,n),Fa(t,e,n))}};function Ls(e,t,n,o,a,l,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,c):t.prototype&&t.prototype.isPureReactComponent?!rl(n,o)||!rl(a,l):!0}function Vs(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&lu.enqueueReplaceState(t,t.state,null)}function ho(e,t){var n=t;if("ref"in t){n={};for(var o in t)o!=="ref"&&(n[o]=t[o])}if(e=e.defaultProps){n===t&&(n=$({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function pv(e){Uc(e)}function hv(e){console.error(e)}function yv(e){Uc(e)}function Kc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function Gs(e,t,n){try{var o=e.onCaughtError;o(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function cu(e,t,n){return n=Dn(n),n.tag=3,n.payload={element:null},n.callback=function(){Kc(e,t)},n}function xv(e){return e=Dn(e),e.tag=3,e}function kv(e,t,n,o){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var l=o.value;e.payload=function(){return a(l)},e.callback=function(){Gs(t,n,o)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){Gs(t,n,o),typeof a!="function"&&(Bn===null?Bn=new Set([this]):Bn.add(this));var i=o.stack;this.componentDidCatch(o.value,{componentStack:i!==null?i:""})})}function x0(e,t,n,o,a){if(n.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=n.alternate,t!==null&&bo(t,n,a,!0),n=He.current,n!==null){switch(n.tag){case 31:case 13:case 19:return je===null?ti():n.alternate===null&&de===0&&(de=3),n.flags&=-257,n.flags|=65536,n.lanes=a,o===Lc?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([o]):t.add(o),Sr(e,o,a)),!1;case 22:return n.flags|=65536,o===Lc?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([o]):n.add(o)),Sr(e,o,a)),!1}throw Error(y(435,n.tag))}return Sr(e,o,a),ti(),!1}if(R)return t=He.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,o!==Jr&&(e=Error(y(422),{cause:o}),dl(kt(e,n)))):(o!==Jr&&(t=Error(y(423),{cause:o}),dl(kt(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,o=kt(o,n),a=cu(e.stateNode,o,a),br(e,a),de!==4&&(de=2)),!1;var l=Error(y(520),{cause:o});if(l=kt(l,n),ol===null?ol=[l]:ol.push(l),de!==4&&(de=2),t===null)return!0;o=kt(o,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=cu(n.stateNode,o,e),br(n,e),!1;case 1:if(t=n.type,l=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(Bn===null||!Bn.has(l))))return n.flags|=65536,a&=-a,n.lanes|=a,a=xv(a),kv(a,e,n,o),br(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var yd=Error(y(461)),ve=!1;function ye(e,t,n,o){t.child=e===null?Rg(t,null,n,o):mo(t,e.child,n,o)}function Xs(e,t,n,o,a){n=n.render;var l=t.ref;if("ref"in o){var c={};for(var i in o)i!=="ref"&&(c[i]=o[i])}else c=o;return go(t),o=rd(e,t,n,c,l,a),i=ud(),e!==null&&!ve?(dd(e,t,a),un(e,t,a)):(R&&i&&bi(t),t.flags|=1,ye(e,t,o,a),t.child)}function Qs(e,t,n,o,a){if(e===null){var l=n.type;return typeof l=="function"&&!Pu(l)&&l.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=l,Sv(e,t,l,o,a)):(e=mc(n.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!kd(e,a)){var c=l.memoizedProps;if(n=n.compare,n=n!==null?n:rl,n(c,o)&&e.ref===t.ref)return un(e,t,a)}return t.flags|=1,e=nn(l,o),e.ref=t.ref,e.return=t,t.child=e}function Sv(e,t,n,o,a){if(e!==null){var l=e.memoizedProps;if(rl(l,o)&&e.ref===t.ref)if(ve=!1,t.pendingProps=o=l,kd(e,a))(e.flags&131072)!==0&&(ve=!0);else return t.lanes=e.lanes,un(e,t,a)}return iu(e,t,n,o,a)}function Tv(e,t,n,o){var a=o.children,l=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(l=l!==null?l.baseLanes|n:n,e!==null){for(o=t.child=e.child,a=0;o!==null;)a=a|o.lanes|o.childLanes,o=o.sibling;o=a&~l}else o=0,t.child=null;return Zs(e,t,l,n,o)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&hc(t,l!==null?l.cachePool:null),l!==null?Hs(t,l):eu(),qg(t);else return o=t.lanes=536870912,Zs(e,t,l!==null?l.baseLanes|n:n,n,o)}else l!==null?(hc(t,l.cachePool),Hs(t,l),Un(),t.memoizedState=null):(e!==null&&hc(t,null),eu(),Un());return ye(e,t,a,n),t.child}function el(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Zs(e,t,n,o,a){var l=nd();return l=l===null?null:{parent:ge._currentValue,pool:l},t.memoizedState={baseLanes:n,cachePool:l},e!==null&&hc(t,null),eu(),qg(t),e!==null&&bo(e,t,o,!0),t.childLanes=a,null}function kc(e,t){return t=yi({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ks(e,t,n){return mo(t,e.child,null,n),e=kc(t,t.pendingProps),e.flags|=2,nt(t),t.memoizedState=null,e}function k0(e,t,n){var o=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(R){if(o.mode==="hidden")return e=kc(t,o),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},el(null,e);if(tu(t),(e=P)?(e=Tm(e,St),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ln!==null?{id:Vt,overflow:Gt}:null,retryLane:536870912,hydrationErrors:null},n=Og(e),n.return=t,t.child=n,Ee=t,P=null)):e=null,e===null)throw Vn(t);return t.lanes=536870912,null}return kc(t,o)}var l=e.memoizedState;if(l!==null){var c=l.dehydrated;if(tu(t),a)if(t.flags&256)t.flags&=-257,t=Ks(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(y(558));else if(ve||bo(e,t,n,!1),a=(n&e.childLanes)!==0,ve||a){if(Gn.current===null){if(o=J,o!==null&&(c=Pb(o,n),c!==0&&c!==l.retryLane))throw l.retryLane=c,To(e,c),Fe(o,e,c),yd;ti()}t=Ks(e,t,n)}else e=l.treeContext,P=Tt(c.nextSibling),Ee=t,R=!0,Cn=null,St=!1,e!==null&&_g(t,e),t=kc(t,o),t.flags|=134221824;return t}return e=nn(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function qo(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(y(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function iu(e,t,n,o,a){return go(t),n=rd(e,t,n,o,void 0,a),o=ud(),e!==null&&!ve?(dd(e,t,a),un(e,t,a)):(R&&o&&bi(t),t.flags|=1,ye(e,t,n,a),t.child)}function Js(e,t,n,o,a,l){return go(t),t.updateQueue=null,n=Yg(t,o,n,a),jg(e),o=ud(),e!==null&&!ve?(dd(e,t,l),un(e,t,l)):(R&&o&&bi(t),t.flags|=1,ye(e,t,n,l),t.child)}function $s(e,t,n,o,a){if(go(t),t.stateNode===null){var l=$o,c=n.contextType;typeof c=="object"&&c!==null&&(l=_e(c)),l=new n(o,l),t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=lu,t.stateNode=l,l._reactInternals=t,l=t.stateNode,l.props=o,l.state=t.memoizedState,l.refs={},ad(t),c=n.contextType,l.context=typeof c=="object"&&c!==null?_e(c):$o,l.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(vr(t,n,c,o),l.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(c=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),c!==l.state&&lu.enqueueReplaceState(l,l.state,null),Ia(t,o,l,a),Wa(),l.state=t.memoizedState),typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){l=t.stateNode;var i=t.memoizedProps,r=ho(n,i);l.props=r;var d=l.context,g=n.contextType;c=$o,typeof g=="object"&&g!==null&&(c=_e(g));var m=n.getDerivedStateFromProps;g=typeof m=="function"||typeof l.getSnapshotBeforeUpdate=="function",i=t.pendingProps!==i,g||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i||d!==c)&&Vs(t,l,o,c),Tn=!1;var s=t.memoizedState;l.state=s,Ia(t,o,l,a),Wa(),d=t.memoizedState,i||s!==d||Tn?(typeof m=="function"&&(vr(t,n,m,o),d=t.memoizedState),(r=Tn||Ls(t,n,r,o,s,d,c))?(g||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=d),l.props=o,l.state=d,l.context=c,o=r):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{l=t.stateNode,Ir(e,t),c=t.memoizedProps,g=ho(n,c),l.props=g,m=t.pendingProps,s=l.context,d=n.contextType,r=$o,typeof d=="object"&&d!==null&&(r=_e(d)),i=n.getDerivedStateFromProps,(d=typeof i=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(c!==m||s!==r)&&Vs(t,l,o,r),Tn=!1,s=t.memoizedState,l.state=s,Ia(t,o,l,a),Wa();var b=t.memoizedState;c!==m||s!==b||Tn||e!==null&&e.dependencies!==null&&Yc(e.dependencies)?(typeof i=="function"&&(vr(t,n,i,o),b=t.memoizedState),(g=Tn||Ls(t,n,g,o,s,b,r)||e!==null&&e.dependencies!==null&&Yc(e.dependencies))?(d||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(o,b,r),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(o,b,r)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=b),l.props=o,l.state=b,l.context=r,o=g):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&s===e.memoizedState||(t.flags|=1024),o=!1)}return l=o,qo(e,t),o=(t.flags&128)!==0,l||o?(l=t.stateNode,n=o&&typeof n.getDerivedStateFromError!="function"?null:l.render(),t.flags|=1,e!==null&&o?(t.child=mo(t,e.child,null,a),t.child=mo(t,null,n,a)):ye(e,t,n,a),t.memoizedState=l.state,e=t.child):e=un(e,t,a),e}function Fs(e,t,n,o){return so(),t.flags|=256,ye(e,t,n,o),t.child}var ru={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function uu(e){return{baseLanes:e,cachePool:Cg()}}function du(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=at),e}function wv(e,t,n){var o=t.pendingProps,a=!1,l=(t.flags&128)!==0,c;if((c=l)||(c=e!==null&&e.memoizedState===null?!1:(Ce.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(R){if(a?Rn(t):Un(),(e=P)?(e=Tm(e,St),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ln!==null?{id:Vt,overflow:Gt}:null,retryLane:536870912,hydrationErrors:null},n=Og(e),n.return=t,t.child=n,Ee=t,P=null)):e=null,e===null)throw Vn(t);return Dd(e)?t.lanes=32:t.lanes=536870912,null}return l=o.children,o=o.fallback,a?(Un(),a=t.mode,l=yi({mode:"hidden",children:l},a),o=io(o,a,n,null),l.return=t,o.return=t,l.sibling=o,t.child=l,o=t.child,o.memoizedState=uu(n),o.childLanes=du(e,c,n),t.memoizedState=ru,el(null,o)):(Rn(t),xd(t,l))}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(r!==null)return S0(e,t,l,c,o,r,i,n)}return a?(Un(),a=o.fallback,l=t.mode,i=e.child,r=i.sibling,o=nn(i,{mode:"hidden",children:o.children}),o.subtreeFlags=i.subtreeFlags&1206910976,r!==null?a=nn(r,a):(a=io(a,l,n,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,el(null,o),o=t.child,a=e.child.memoizedState,a===null?a=uu(n):(l=a.cachePool,l!==null?(i=ge._currentValue,l=l.parent!==i?{parent:i,pool:i}:l):l=Cg(),a={baseLanes:a.baseLanes|n,cachePool:l}),o.memoizedState=a,o.childLanes=du(e,c,n),t.memoizedState=ru,el(e.child,o)):(Rn(t),n=e.child,e=n.sibling,n=nn(n,{mode:"visible",children:o.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function xd(e,t){return t=yi({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function yi(e,t){return e=$e(22,e,null,t),e.lanes=0,e}function nc(e,t,n){return mo(t,e.child,null,n),e=xd(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function S0(e,t,n,o,a,l,c,i){if(n)return t.flags&256?(Rn(t),t.flags&=-257,nc(e,t,i)):t.memoizedState!==null?(Un(),t.child=e.child,t.flags|=128,null):(Un(),l=a.fallback,c=t.mode,a=yi({mode:"visible",children:a.children},c),l=io(l,c,i,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,mo(t,e.child,null,i),a=t.child,a.memoizedState=uu(i),a.childLanes=du(e,o,i),t.memoizedState=ru,el(null,a));if(Rn(t),Dd(l)){if(o=l.nextSibling&&l.nextSibling.dataset,o)var r=o.dgst;return o=r,o!==""&&(a=Error(y(419)),a.stack="",a.digest=o,dl({value:a,source:null,stack:null})),nc(e,t,i)}if(ve||bo(e,t,i,!1),o=(i&e.childLanes)!==0,ve||o){if(Gn.current!==null)return nc(e,t,i);if(o=J,o!==null&&(a=Pb(o,i),a!==0&&a!==c.retryLane))throw c.retryLane=a,To(e,a),Fe(o,e,a),yd;return Ru(l)||ti(),nc(e,t,i)}return Ru(l)?(t.flags|=192,t.child=e.child,null):(e=c.treeContext,P=Tt(l.nextSibling),Ee=t,R=!0,Cn=null,St=!1,e!==null&&_g(t,e),t=xd(t,a.children),t.flags|=134221824,t)}function Ws(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),pc(e.return,t,n)}function Is(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Gc(n)===null&&(t=e),e=e.sibling}return t}function oc(e,t,n,o,a,l){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:a,treeForkCount:l}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=n,c.tailMode=a,c.treeForkCount=l)}function mr(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function fu(e,t,n){var o=t.pendingProps,a=o.revealOrder,l=o.tail;o=o.children;var c=Ce.current;if(t.flags&128)return sl(t,c),null;var i=(c&2)!==0;if(i?(c=c&1|2,t.flags|=128):c&=1,sl(t,c),a==="backwards"&&e!==null?(mr(e),ye(e,t,o,n),mr(e)):ye(e,t,o,n),o=R?ul:0,!i&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ws(e,n,t);else if(e.tag===19)Ws(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"backwards":n=Is(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null,mr(t)),oc(t,!0,a,null,l,o);break;case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&Gc(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}oc(t,!0,n,null,l,o);break;case"together":oc(t,!1,null,null,void 0,o);break;case"independent":t.memoizedState=null;break;default:n=Is(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),oc(t,!1,a,n,l,o)}return t.child}function Ps(e,t,n){var o=t.pendingProps;return Nn(t,t.type,o.value),ye(e,t,o.children,n),t.child}function un(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Qn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(bo(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(y(153));if(t.child!==null){for(e=t.child,n=nn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=nn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function kd(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Yc(e)))}function T0(e,t,n){switch(t.tag){case 3:Cc(t,t.stateNode.containerInfo),Nn(t,ge,e.memoizedState.cache),so();break;case 27:case 5:qr(t);break;case 4:Cc(t,t.stateNode.containerInfo);break;case 10:Nn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,tu(t),null;break;case 13:var o=t.memoizedState;if(o!==null){if(o.dehydrated!==null)return Rn(t),t.flags|=128,null;o=bo(e,t,n,!1);var a=t.child.childLanes;return o||(n&a)!==0?wv(e,t,n):(Rn(t),e=un(e,t,n),e!==null?e.sibling:null)}Rn(t);break;case 19:if(t.flags&128)return fu(e,t,n);if(a=(e.flags&128)!==0,o=(n&t.childLanes)!==0,o||(bo(e,t,n,!1),o=(n&t.childLanes)!==0),a){if(o)return fu(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),sl(t,Ce.current),o)break;return null;case 22:return t.lanes=0,Tv(e,t,n,t.pendingProps);case 24:Nn(t,ge,e.memoizedState.cache)}return un(e,t,n)}function Ev(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)ve=!0;else{if(!kd(e,n)&&(t.flags&128)===0)return ve=!1,T0(e,t,n);ve=(e.flags&131072)!==0}else ve=!1,R&&(t.flags&1048576)!==0&&Ag(t,ul,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=no(t.elementType),t.type=e,typeof e=="function")Pu(e)?(o=ho(e,o),t.tag=1,t=$s(null,t,e,o,n)):(t.tag=0,t=iu(null,t,e,o,n));else{if(e!=null){var a=e.$$typeof;if(a===Yu){t.tag=11,t=Xs(null,t,e,o,n);break e}else if(a===Lu){t.tag=14,t=Qs(null,t,e,o,n);break e}else if(a===Yt){t.tag=10,t.type=e,t=Ps(null,t,n);break e}}throw t=Ur(e)||e,Error(y(306,t,""))}}return t;case 0:return iu(e,t,t.type,t.pendingProps,n);case 1:return o=t.type,a=ho(o,t.pendingProps),$s(e,t,o,a,n);case 3:e:{if(Cc(t,t.stateNode.containerInfo),e===null)throw Error(y(387));o=t.pendingProps;var l=t.memoizedState;a=l.element,Ir(e,t),Ia(t,o,null,n);var c=t.memoizedState;if(o=c.cache,Nn(t,ge,o),o!==l.cache&&Fr(t,[ge],n,!0),Wa(),o=c.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){t=Fs(e,t,o,n);break e}else if(o!==a){a=kt(Error(y(424)),t),dl(a),t=Fs(e,t,o,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,P=Tt(e.firstChild),Ee=t,R=!0,Cn=null,St=!0,n=Rg(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling;else{if(so(),o===a){t=un(e,t,n);break e}ye(e,t,o,n)}t=t.child}return t;case 26:return qo(e,t),e===null?(n=zb(t.type,null,t.pendingProps,null))?t.memoizedState=n:R||(t.stateNode=gm(t.type,t.pendingProps,Mn.current,t)):t.memoizedState=zb(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return qr(t),e===null&&R&&(o=t.stateNode=wm(t.type,t.pendingProps,Mn.current),Ee=t,St=!0,a=P,Kn(t.type)?(Uu=a,P=Tt(o.firstChild)):P=a),ye(e,t,t.pendingProps.children,n),qo(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&R&&((a=o=P)&&(o=vy(o,t.type,t.pendingProps,St),o!==null?(t.stateNode=o,Ee=t,P=Tt(o.firstChild),St=!1,a=!0):a=!1),a||Vn(t)),qr(t),a=t.type,l=t.pendingProps,c=e!==null?e.memoizedProps:null,o=l.children,Cu(a,l)?o=null:c!==null&&Cu(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=rd(e,t,s0,null,null,n),ya._currentValue=a),qo(e,t),ye(e,t,o,n),t.child;case 6:return e===null&&R&&((e=n=P)&&(n=my(n,t.pendingProps,St),n!==null?(t.stateNode=n,Ee=t,P=null,e=!0):e=!1),e||Vn(t)),null;case 13:return wv(e,t,n);case 4:return Cc(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=mo(t,null,o,n):ye(e,t,o,n),t.child;case 11:return Xs(e,t,t.type,t.pendingProps,n);case 7:return o=t.pendingProps,qo(e,t),ye(e,t,o,n),t.child;case 8:return ye(e,t,t.pendingProps.children,n),t.child;case 12:return ye(e,t,t.pendingProps.children,n),t.child;case 10:return Ps(e,t,n);case 9:return a=t.type._context,o=t.pendingProps.children,go(t),a=_e(a),o=o(a),t.flags|=1,ye(e,t,o,n),t.child;case 14:return Qs(e,t,t.type,t.pendingProps,n);case 15:return Sv(e,t,t.type,t.pendingProps,n);case 19:return fu(e,t,n);case 31:return k0(e,t,n);case 22:return Tv(e,t,n,t.pendingProps);case 24:return go(t),o=_e(ge),e===null?(a=nd(),a===null&&(a=J,l=td(),a.pooledCache=l,l.refCount++,l!==null&&(a.pooledCacheLanes|=n),a=l),t.memoizedState={parent:o,cache:a},ad(t),Nn(t,ge,a)):((e.lanes&n)!==0&&(Ir(e,t),Ia(t,null,null,n),Wa()),a=e.memoizedState,l=t.memoizedState,a.parent!==o?(a={parent:o,cache:o},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Nn(t,ge,o)):(o=l.cache,Nn(t,ge,o),o!==a.cache&&Fr(t,[ge],n,!0))),ye(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=t.pendingProps,o.name!=null&&o.name!=="auto"?t.flags|=e===null?18882560:18874368:R&&bi(t),e!==null&&e.memoizedProps.name!==o.name?t.flags|=4194816:qo(e,t),ye(e,t,o.children,n),t.child;case 29:throw t.pendingProps}throw Error(y(156,t.tag))}function Pt(e){e.flags|=4}function pr(e,t,n,o,a){var l;if((l=(e.mode&32)!==0)&&(l=n===null?Ab(t,o):Ab(t,o)&&(o.src!==n.src||o.srcSet!==n.srcSet)),l){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(em())e.flags|=8192;else throw uo=Lc,od}else e.flags&=-16777217}function eb(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Om(t))if(em())e.flags|=8192;else throw uo=Lc,od}function ac(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Fb():536870912,e.lanes|=t,ba|=t)}function Ba(e,t){if(!R)switch(e.tailMode){case"visible":break;case"collapsed":for(var n=e.tail,o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function I(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags&1206910976,o|=a.flags&1206910976,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function w0(e,t,n){var o=t.pendingProps;switch(ed(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return I(t),null;case 1:return I(t),null;case 3:return n=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),on(ge),ua(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Uo(t)?Pt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,sr())),I(t),null;case 26:var a=t.type,l=t.memoizedState;return e===null?(Pt(t),l!==null?(I(t),eb(t,l)):(I(t),pr(t,a,null,o,n))):l?l!==e.memoizedState?(Pt(t),I(t),eb(t,l)):(I(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&Pt(t),I(t),pr(t,a,e,o,n)),null;case 27:if(Dc(t),n=Mn.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Pt(t);else{if(!o){if(t.stateNode===null)throw Error(y(166));return I(t),t.subtreeFlags&=-33554433,null}e=Xt.current,Uo(t)?Ns(t,e):(e=wm(a,o,n),t.stateNode=e,Pt(t))}return I(t),t.subtreeFlags&=-33554433,null;case 5:if(Dc(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Pt(t);else{if(!o){if(t.stateNode===null)throw Error(y(166));return I(t),t.subtreeFlags&=-33554433,null}if(l=Xt.current,Uo(t))Ns(t,l);else{var c=ml(Mn.current);switch(l){case 1:l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":l=c.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof o.is=="string"?c.createElement("select",{is:o.is}):c.createElement("select"),o.multiple?l.multiple=!0:o.size&&(l.size=o.size);break;default:l=typeof o.is=="string"?c.createElement(a,{is:o.is}):c.createElement(a)}}l[Ae]=t,l[Ie]=o;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)l.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=l;e:switch(De(l,a,o),a){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&Pt(t)}}return I(t),t.subtreeFlags&=-33554433,pr(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&Pt(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(y(166));if(e=Mn.current,Uo(t)){if(e=t.stateNode,n=t.memoizedProps,o=null,a=Ee,a!==null)switch(a.tag){case 27:case 5:o=a.memoizedProps}e[Ae]=t,e=!!(e.nodeValue===n||o!==null&&o.suppressHydrationWarning===!0||sm(e.nodeValue,n)),e||Vn(t,!0)}else e=ml(e).createTextNode(o),e[Ae]=t,t.stateNode=e}return I(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(o=Uo(t),n!==null){if(e===null){if(!o)throw Error(y(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(557));e[Ae]=t}else so(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;I(t),e=!1}else n=sr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(nt(t),t):(nt(t),null);if((t.flags&128)!==0)throw Error(y(558))}return I(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Uo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(y(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(y(317));a[Ae]=t}else so(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;I(t),a=!1}else a=sr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(nt(t),t):(nt(t),null)}return nt(t),(t.flags&128)!==0?(t.lanes=n,t):(n=o!==null,e=e!==null&&e.memoizedState!==null,n&&(o=t.child,a=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(a=o.alternate.memoizedState.cachePool.pool),l=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(l=o.memoizedState.cachePool.pool),l!==a&&(o.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),ac(t,t.updateQueue),I(t),null);case 4:return ua(),e===null&&_d(t.stateNode.containerInfo),t.flags|=67108864,I(t),null;case 10:return on(t.type),I(t),null;case 19:if(cd(t),o=t.memoizedState,o===null)return I(t),null;if(a=(t.flags&128)!==0,l=o.rendering,l===null)if(a)Ba(o,!1);else{if(de!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=Gc(e),l!==null){for(t.flags|=128,Ba(o,!1),e=l.updateQueue,t.updateQueue=e,ac(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Ng(n,e),n=n.sibling;return sl(t,Ce.current&1|2),R&&en(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&lt()>Pc&&(t.flags|=128,a=!0,Ba(o,!1),t.lanes=4194304)}else{if(!a)if(e=Gc(l),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,ac(t,e),Ba(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!l.alternate&&!R)return I(t),null}else 2*lt()-o.renderingStartTime>Pc&&n!==536870912&&(t.flags|=128,a=!0,Ba(o,!1),t.lanes=4194304);o.isBackwards?(l.sibling=t.child,t.child=l):(e=o.last,e!==null?e.sibling=l:t.child=l,o.last=l)}if(o.tail!==null){e=o.tail;e:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break e}n=n.sibling}n=!0}return o.rendering=e,o.tail=e.sibling,o.renderingStartTime=lt(),e.sibling=null,l=Ce.current,l=a?l&1|2:l&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!n||R?sl(t,l):(n=l,ee(He,t),ee(Ce,n),je===null&&(je=t)),R&&en(t,o.treeForkCount),e}return I(t),null;case 22:case 23:return nt(t),ld(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(n&536870912)!==0&&(t.flags&128)===0&&(I(t),t.subtreeFlags&6&&(t.flags|=8192)):I(t),n=t.updateQueue,n!==null&&ac(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==n&&(t.flags|=2048),e!==null&&Me(ro),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),on(ge),I(t),null;case 25:return null;case 30:return t.flags|=33554432,I(t),null}throw Error(y(156,t.tag))}function E0(e,t){switch(ed(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return on(ge),ua(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Dc(t),null;case 31:if(t.memoizedState!==null){if(nt(t),t.alternate===null)throw Error(y(340));so()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(nt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(y(340));so()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return cd(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return ua(),null;case 10:return on(t.type),null;case 22:case 23:return nt(t),ld(),e!==null&&Me(ro),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return on(ge),null;case 25:return null;default:return null}}function zv(e,t){switch(ed(t),t.tag){case 3:on(ge),ua();break;case 26:case 27:case 5:Dc(t);break;case 4:ua();break;case 31:t.memoizedState!==null&&nt(t);break;case 13:nt(t);break;case 19:cd(t);break;case 10:on(t.type);break;case 22:case 23:nt(t),ld(),e!==null&&Me(ro);break;case 24:on(ge)}}function Al(e,t){try{var n=t.updateQueue,o=n!==null?n.lastEffect:null;if(o!==null){var a=o.next;n=a;do{if((n.tag&e)===e){o=void 0;var l=n.create,c=n.inst;o=l(),c.destroy=o}n=n.next}while(n!==a)}}catch(i){Z(t,t.return,i)}}function Xn(e,t,n){try{var o=t.updateQueue,a=o!==null?o.lastEffect:null;if(a!==null){var l=a.next;o=l;do{if((o.tag&e)===e){var c=o.inst,i=c.destroy;if(i!==void 0){c.destroy=void 0,a=t;var r=n,d=i;try{d()}catch(g){Z(a,r,g)}}}o=o.next}while(o!==l)}}catch(g){Z(t,t.return,g)}}function Nv(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Bg(t,n)}catch(o){Z(e,e.return,o)}}}function Ov(e,t,n){n.props=ho(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(o){Z(e,t,o)}}function qt(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:var a=e.stateNode,l=ln(e.memoizedProps,a);(a.ref===null||a.ref.name!==l)&&(a.ref=hm(l)),o=a.ref;break;case 7:if(e.stateNode===null){var c=new dt(e);We(e.child,!1,by,c,void 0,void 0),e.stateNode=c}o=e.stateNode;break;default:o=e.stateNode}typeof n=="function"?e.refCleanup=n(o):n.current=o}}catch(i){Z(e,t,i)}}function Oe(e,t){var n=e.ref,o=e.refCleanup;if(n!==null)if(typeof o=="function")try{o()}catch(a){Z(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){Z(e,t,a)}else n.current=null}function Jc(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)Sm(e.stateNode,t[n])}function tb(e){for(var t=e.return;t!==null&&(Td(t)&&Sm(e.stateNode,t.stateNode),!Sd(t));)t=t.return}function tl(e){for(var t=e.return;t!==null&&(Td(t)&&gy(e.stateNode,t.stateNode),!Sd(t));)t=t.return}function Sd(e){return e.tag===5||e.tag===3||e.tag===27}function Td(e){return e&&e.tag===7&&e.stateNode!==null}function su(e){var t=e.type,n=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&o.focus();break e;case"img":n.src?o.src=n.src:n.srcSet&&(o.srcset=n.srcSet)}}catch(a){Z(e,e.return,a)}}function hr(e,t,n){try{var o=e.stateNode;$0(o,e.type,n,t),o[Ie]=t}catch(a){Z(e,e.return,a)}}function Av(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Kn(e.type)||e.tag===4}function yr(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Av(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Kn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function bu(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Lt)),Jc(e,o),Y=!0;else if(a!==4&&(a===27&&(Jc(e,o),o=null,Kn(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(bu(e,t,n,o),e=e.sibling;e!==null;)bu(e,t,n,o),e=e.sibling}function $c(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?n.insertBefore(a,t):n.appendChild(a),Jc(e,o),Y=!0;else if(a!==4&&(a===27&&(Jc(e,o),o=null,Kn(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for($c(e,t,n,o),e=e.sibling;e!==null;)$c(e,t,n,o),e=e.sibling}function _v(e){var t=e.stateNode,n=e.memoizedProps;try{for(var o=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);De(t,o,n),t[Ae]=e,t[Ie]=n}catch(l){Z(e,e.return,l)}}var Fc=!1,ot=null;function nb(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Fc=!0)}var jt=null;function ob(){var e=jt;return jt=null,e}var Je=0;function Ea(e,t,n,o,a){return Je=0,Mv(e.child,t,n,o,a)}function Mv(e,t,n,o,a){for(var l=!1;e!==null;){if(e.tag===5){var c=e.stateNode;if(o!==null){var i=Du(c);o.push(i),i.view&&(l=!0)}else l||Du(c).view&&(l=!0);Fc=!0,vm(c,Je===0?t:t+"_"+Je,n),Je++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&a||Mv(e.child,t,n,o,a)&&(l=!0));e=e.sibling}return l}function Zt(e,t){for(;e!==null;)e.tag===5?mm(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||Zt(e.child,t)),e=e.sibling}function Sc(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Sc(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name==="auto")throw Error(y(544));var n=t.name;t=sn(t.default,t.share),t!=="none"&&(Ea(e,n,t,null,!1)||Zt(e.child,!1))}e=e.sibling}}function gu(e,t){if(e.tag===30){var n=e.stateNode,o=e.memoizedProps,a=ln(o,n),l=sn(o.default,n.paired?o.share:o.enter);l!=="none"?Ea(e,a,l,null,!1)?(Sc(e),n.paired||t||ga(e,o.onEnter)):Zt(e.child,!1):Sc(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)gu(e,t),e=e.sibling;else Sc(e)}function vu(e){if(ot!==null&&ot.size!==0){var t=ot;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.memoizedProps,o=n.name;if(o!=null&&o!=="auto"){var a=t.get(o);if(a!==void 0){var l=sn(n.default,n.share);if(l!=="none"&&(Ea(e,o,l,null,!1)?(l=e.stateNode,a.paired=l,l.paired=a,ga(e,n.onShare)):Zt(e.child,!1)),t.delete(o),t.size===0)break}}}vu(e)}e=e.sibling}}}function mu(e){if(e.tag===30){var t=e.memoizedProps,n=ln(t,e.stateNode),o=ot!==null?ot.get(n):void 0,a=sn(t.default,o!==void 0?t.share:t.exit);a!=="none"&&(Ea(e,n,a,null,!1)?o!==void 0?(a=e.stateNode,o.paired=a,a.paired=o,ot.delete(n),ga(e,t.onShare)):ga(e,t.onExit):Zt(e.child,!1)),ot!==null&&vu(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)mu(e),e=e.sibling;else ot!==null&&vu(e)}function Cv(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=ln(t,e.stateNode);t=sn(t.default,t.update),e.flags&=-5,t!=="none"&&Ea(e,n,t,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&Cv(e);e=e.sibling}}function pu(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.stateNode;t.paired!==null&&(t.paired=null,Zt(e.child,!1))}pu(e)}e=e.sibling}}function Tc(e){if(e.tag===30)e.stateNode.paired=null,Zt(e.child,!1),pu(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Tc(e),e=e.sibling;else pu(e)}function Dv(e){for(e=e.child;e!==null;)e.tag===30?Zt(e.child,!1):(e.subtreeFlags&33554432)!==0&&Dv(e),e=e.sibling}function wd(e,t,n,o,a,l,c){for(var i=!1;t!==null;){if(t.tag===5){var r=t.stateNode;if(l!==null&&Je<l.length){var d=l[Je],g=Du(r);(d.view||g.view)&&(i=!0);var m;if(m=(e.flags&4)===0)if(g.clip)m=!0;else{m=d.rect;var s=g.rect;m=m.y!==s.y||m.x!==s.x||m.height!==s.height||m.width!==s.width}m&&(e.flags|=4),g.abs?g=!d.abs:(d=d.rect,g=g.rect,g=d.height!==g.height||d.width!==g.width),g&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&vm(r,Je===0?n:n+"_"+Je,a),i&&(e.flags&4)!==0||(jt===null&&(jt=[]),jt.push(r,Je===0?o:o+"_"+Je,t.memoizedProps)),Je++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c?e.flags|=t.flags&32:wd(e,t.child,n,o,a,l,c)&&(i=!0));t=t.sibling}return i}function Hv(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,o=e.stateNode,a=ln(n,o),l=sn(n.default,n.update);if(t){o=o.clones;var c=o===null?null:o.map(ty)}else c=e.memoizedState,e.memoizedState=null;o=e;var i=e.child;Je=0,a=wd(o,i,a,a,l,c,!1),(e.flags&4)!==0&&a&&(t||ga(e,n.onUpdate))}else(e.subtreeFlags&33554432)!==0&&Hv(e,t);e=e.sibling}}var Se=!1,G=!1,Rt=!1,xr=!1,ab=typeof WeakSet=="function"?WeakSet:Set,Te=null,Ut=!1,Qa=!1,Wc=!1,hu=!1;function z0(e,t,n){if(e=e.containerInfo,_u=xa,e=yg(e),Fu(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var a=o.getSelection&&o.getSelection();if(a&&a.rangeCount!==0){o=a.anchorNode;var l=a.anchorOffset,c=a.focusNode;a=a.focusOffset;try{o.nodeType,c.nodeType}catch{o=null;break e}var i=0,r=-1,d=-1,g=0,m=0,s=e,b=null;t:for(;;){for(var x;s!==o||l!==0&&s.nodeType!==3||(r=i+l),s!==c||a!==0&&s.nodeType!==3||(d=i+a),s.nodeType===3&&(i+=s.nodeValue.length),(x=s.firstChild)!==null;)b=s,s=x;for(;;){if(s===e)break t;if(b===o&&++g===l&&(r=i),b===c&&++m===a&&(d=i),(x=s.nextSibling)!==null)break;s=b,b=s.parentNode}s=x}o=r===-1||d===-1?null:{start:r,end:d}}else o=null}o=o||{start:0,end:0}}else o=null;for(Mu={focusedElem:e,selectionRange:o},xa=!1,n=(n&335544064)===n,Te=t,t=n?9270:1024;Te!==null;){if(e=Te,n&&(o=e.deletions,o!==null))for(l=0;l<o.length;l++)n&&mu(o[l]);if(e.alternate===null&&(e.flags&2)!==0)n&&nb(e),lc(n);else{if(e.tag===22){if(o=e.alternate,e.memoizedState!==null){o!==null&&o.memoizedState===null&&n&&mu(o),lc(n);continue}else if(o!==null&&o.memoizedState!==null){n&&nb(e),lc(n);continue}}o=e.child,(e.subtreeFlags&t)!==0&&o!==null?(o.return=e,Te=o):(n&&Cv(e),lc(n))}}ot=null}function lc(e){for(;Te!==null;){var t=Te,n=e,o=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if((a&1024)!==0&&o!==null){n=void 0,a=o.memoizedProps,o=o.memoizedState;var l=t.stateNode;try{var c=ho(t.type,a);n=l.getSnapshotBeforeUpdate(c,o),l.__reactInternalSnapshotBeforeUpdate=n}catch(i){Z(t,t.return,i)}}break;case 3:if((a&1024)!==0){if(o=t.stateNode.containerInfo,n=o.nodeType,n===9)Hu(o);else if(n===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":Hu(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&o!==null&&(n=ln(o.memoizedProps,o.stateNode),a=t.memoizedProps,a=sn(a.default,a.update),a!=="none"&&Ea(o,n,a,o.memoizedState=[],!0));break;default:if((a&1024)!==0)throw Error(y(163))}if(o=t.sibling,o!==null){o.return=t.return,Te=o;break}Te=t.return}}function Rv(e,t,n){var o=n.flags;switch(n.tag){case 0:case 11:case 15:Bt(e,n),o&4&&Al(5,n);break;case 1:if(Bt(e,n),o&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){Z(n,n.return,c)}else{var a=ho(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){Z(n,n.return,c)}}o&64&&Nv(n),o&512&&qt(n,n.return);break;case 3:if(Bt(e,n),o&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Bg(e,t)}catch(c){Z(n,n.return,c)}}break;case 27:t===null&&o&4&&_v(n);case 26:case 5:Bt(e,n),t===null&&o&4&&su(n),o&512&&qt(n,n.return);break;case 12:Bt(e,n);break;case 31:Bt(e,n),o&4&&jv(e,n);break;case 13:Bt(e,n),o&4&&Yv(e,n),o&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=q0.bind(null,n),py(e,n))));break;case 22:if(o=n.memoizedState!==null||Se,!o){var l=t!==null&&t.memoizedState!==null||G;t=Se,a=G,Se=o,(G=l)&&!a?(o=2,(n.subtreeFlags&8772)!==0&&(o|=1),Ot(e,n,o)):Bt(e,n),Se=t,G=a}break;case 30:Bt(e,n),o&512&&qt(n,n.return);break;case 7:o&512&&qt(n,n.return);default:Bt(e,n)}}function yu(e,t){for(e=e.child;e!==null;)Uv(e,t),e=e.sibling}function Uv(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var o=n.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var a=e.stateNode,l=e.memoizedProps.style,c=l!=null&&l.hasOwnProperty("display")?l.display:null;a.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(r){Z(e,e.return,r)}xu(e,t);break;case 6:try{e.stateNode.nodeValue=t?"":e.memoizedProps,Y=!0}catch(r){Z(e,e.return,r)}break;case 18:try{var i=e.stateNode;t?xb(i,!0):xb(e.stateNode,!1)}catch(r){Z(e,e.return,r)}break;case 22:case 23:e.memoizedState===null&&yu(e,t);break;default:yu(e,t)}}function xu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var n=e,o=t;switch(n.tag){case 4:Uv(n,o);break e;case 22:n.memoizedState===null&&xu(n,o);break e;default:xu(n,o)}}e=e.sibling}}function Bv(e){var t=e.alternate;t!==null&&(e.alternate=null,Bv(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&ii(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ae=null,Ze=!1;function Nt(e,t,n){for(n=n.child;n!==null;)qv(e,t,n),n=n.sibling}function qv(e,t,n){if(ct&&typeof ct.onCommitFiberUnmount=="function")try{ct.onCommitFiberUnmount(Sl,n)}catch{}switch(n.tag){case 26:G||Oe(n,t),Nt(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!G&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:G||Oe(n,t),tl(n);var o=ae,a=Ze;Kn(n.type)&&(ae=n.stateNode,Ze=!1),Nt(e,t,n),Em(n.stateNode,n.type,n.memoizedProps),ae=o,Ze=a;break;case 5:G||Oe(n,t),tl(n);case 6:if(n.tag===6&&tl(n),o=ae,a=Ze,ae=null,Nt(e,t,n),ae=o,Ze=a,ae!==null)if(Ze)try{(ae.nodeType===9?ae.body:ae.nodeName==="HTML"?ae.ownerDocument.body:ae).removeChild(n.stateNode),Y=!0}catch(l){Z(n,t,l)}else try{ae.removeChild(n.stateNode),Y=!0}catch(l){Z(n,t,l)}break;case 18:ae!==null&&(Ze?(e=ae,yb(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),ka(e)):yb(ae,n.stateNode));break;case 4:o=ae,a=Ze,ae=n.stateNode.containerInfo,Ze=!0,Nt(e,t,n),ae=o,Ze=a;break;case 0:case 11:case 14:case 15:Xn(2,n,t),G||Xn(4,n,t),Nt(e,t,n);break;case 1:G||(Oe(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"&&Ov(n,t,o)),Nt(e,t,n);break;case 21:Nt(e,t,n);break;case 22:G=(o=G)||n.memoizedState!==null,Nt(e,t,n),G=o;break;case 30:Oe(n,t),Nt(e,t,n);break;case 7:G||Oe(n,t),Nt(e,t,n);break;default:Nt(e,t,n)}}function jv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ka(e)}catch(n){Z(t,t.return,n)}}}function Yv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ka(e)}catch(n){Z(t,t.return,n)}}function N0(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ab),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ab),t;default:throw Error(y(435,e.tag))}}function cc(e,t){var n=N0(e);t.forEach(function(o){if(!n.has(o)){n.add(o);var a=j0.bind(null,e,o);o.then(a,a)}})}function Le(e,t,n){var o=t.deletions;if(o!==null)for(var a=0;a<o.length;a++){var l=o[a],c=e,i=t,r=i;e:for(;r!==null;){switch(r.tag){case 27:if(Kn(r.type)){ae=r.stateNode,Ze=!1;break e}break;case 5:ae=r.stateNode,Ze=!1;break e;case 3:case 4:ae=r.stateNode.containerInfo,Ze=!0;break e}r=r.return}if(ae===null)throw Error(y(160));qv(c,i,l),ae=null,Ze=!1,c=l.alternate,c!==null&&(c.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Lv(t,e,n),t=t.sibling}var At=null;function Lv(e,t,n){var o=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(o=e.updateQueue,o=o!==null?o.events:null,o!==null))for(var l=0;l<o.length;l++){var c=o[l];c.ref.impl=c.nextImpl}Le(t,e,n),Ve(e),a&4&&(Xn(3,e,e.return),Al(3,e),Xn(5,e,e.return));break;case 1:Le(t,e,n),Ve(e),a&512&&(G||o===null||Oe(o,o.return)),a&64&&Se&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(l=At,Le(t,e,n),Ve(e),a&512&&(G||o===null||Oe(o,o.return)),a&4)if(a=o!==null?o.memoizedState:null,n=e.memoizedState,o===null)if(n===null)if(e.stateNode===null)if(Se)e.stateNode=gm(e.type,e.memoizedProps,t.containerInfo,e);else{e:{t=e.type,n=e.memoizedProps,a=l.ownerDocument||l;t:switch(t){case"title":o=a.getElementsByTagName("title")[0],(!o||o[El]||o[Ae]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(t),a.head.insertBefore(o,a.querySelector("head > title"))),De(o,t,n),o[Ae]=e,we(o),t=o;break e;case"link":if(l=Ob("link","href",a).get(t+(n.href||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){l.splice(c,1);break t}}o=a.createElement(t),De(o,t,n),a.head.appendChild(o);break;case"meta":if(l=Ob("meta","content",a).get(t+(n.content||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){l.splice(c,1);break t}}o=a.createElement(t),De(o,t,n),a.head.appendChild(o);break;default:throw Error(y(468,t))}o[Ae]=e,we(o),t=o}e.stateNode=t}else Se||Bu(l,e.type,e.stateNode);else e.stateNode=Nb(l,n,e.memoizedProps);else a!==n?(a===null?(t=o.stateNode,t===null||G||t.parentNode.removeChild(t)):a.count--,n===null?Se||Bu(l,e.type,e.stateNode):Nb(l,n,e.memoizedProps)):n===null&&e.stateNode!==null&&hr(e,e.memoizedProps,o.memoizedProps);break;case 27:Le(t,e,n),Ve(e),a&512&&(G||o===null||Oe(o,o.return)),o!==null&&a&4&&hr(e,e.memoizedProps,o.memoizedProps);break;case 5:if(l=Rt,Rt=!1,Le(t,e,n),Rt=l,Ve(e),a&512&&(G||o===null||Oe(o,o.return)),e.flags&32){t=e.stateNode;try{fa(t,""),Y=!0}catch(g){Z(e,e.return,g)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,hr(e,t,o!==null?o.memoizedProps:t)),a&1024&&(xr=!0);break;case 6:if(Le(t,e,n),Ve(e),a&4){if(e.stateNode===null)throw Error(y(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,Y=!0}catch(g){Z(e,e.return,g)}}break;case 3:if(Y=!1,Nc=null,l=At,At=pl(t.containerInfo),Le(t,e,n),At=l,Ve(e),a&4&&o!==null&&o.memoizedState.isDehydrated)try{ka(t.containerInfo)}catch(g){Z(e,e.return,g)}xr&&(xr=!1,Vv(e)),Y=!1;break;case 4:a=Rt,Rt=Se,o=ds(),l=At,At=pl(e.stateNode.containerInfo),Le(t,e,n),Ve(e),At=l,Y&&Qa&&(Wc=!0),Y=o,Rt=a;break;case 12:Le(t,e,n),Ve(e);break;case 31:Le(t,e,n),Ve(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,cc(e,t)));break;case 13:Le(t,e,n),Ve(e),e.child.flags&8192&&e.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(xi=lt()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,cc(e,t)));break;case 22:l=e.memoizedState!==null,c=o!==null&&o.memoizedState!==null;var i=Se,r=G,d=Rt;Se=i||l,Rt=d||l,G=r||c,Le(t,e,n),G=r,Rt=d,Se=i,Ve(e),a&8192&&(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,!l||o===null||c||Se||G||(t=c||G,n=Se,o=G,Se=l||Se,G=t,kn(e,2),Se=n,G=o),!l&&Rt||yu(e,l)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,cc(e,n))));break;case 19:Le(t,e,n),Ve(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,cc(e,t)));break;case 30:a&512&&(G||o===null||Oe(o,o.return)),a=ds(),l=Qa,c=(n&335544064)===n,i=e.memoizedProps,Qa=c&&sn(i.default,i.update)!=="none",Le(t,e,n),Ve(e),c&&o!==null&&Y&&(e.flags|=4),Qa=l,Y=a;break;case 21:break;case 7:a&512&&(G||o===null||Oe(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=e);default:Le(t,e,n),Ve(e)}}function Ve(e){var t=e.flags;if(t&2){try{for(var n,o=e.return;o!==null;){if(Av(o)){n=o;break}o=o.return}o=null;for(var a=e.return;a!==null;){if(Td(a)){var l=a.stateNode;o===null?o=[l]:o.push(l)}if(Sd(a))break;a=a.return}var c=o;if(n==null)throw Error(y(160));switch(n.tag){case 27:var i=n.stateNode,r=yr(e);$c(e,r,i,c);break;case 5:var d=n.stateNode;n.flags&32&&(fa(d,""),n.flags&=-33);var g=yr(e);$c(e,g,d,c);break;case 3:case 4:var m=n.stateNode.containerInfo,s=yr(e);bu(e,s,m,c);break;default:throw Error(y(161))}}catch(b){Z(e,e.return,b)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Vv(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Vv(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,xa=!0,t.reset(),xa=!1),e=e.sibling}}function Bo(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Gv(t,e),t=t.sibling;else Hv(t,!1)}function Gv(e,t){var n=e.alternate;if(n===null)gu(e,!1);else switch(e.tag){case 3:if(hu=Ut=!1,ob(),Bo(t,e),!Ut&&!Wc){if(e=jt,e!==null)for(var o=0;o<e.length;o+=3){n=e[o];var a=e[o+1];mm(n,e[o+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+a+")"})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),hu=!0}jt=null;break;case 5:Bo(t,e);break;case 4:o=Ut,Ut=!1,Bo(t,e),Ut&&(Wc=!0),Ut=o;break;case 22:e.memoizedState===null&&(n.memoizedState!==null?gu(e,!1):Bo(t,e));break;case 30:o=Ut,a=ob(),Ut=!1,Bo(t,e),Ut&&(e.flags|=4);var l=e.memoizedProps,c=e.stateNode;t=ln(l,c),c=ln(n.memoizedProps,c);var i=sn(l.default,l.update);i==="none"?t=!1:(l=n.memoizedState,n.memoizedState=null,n=e.child,Je=0,t=wd(e,n,t,c,i,l,!0),Je!==(l===null?0:l.length)&&(e.flags|=32)),(e.flags&4)!==0&&t?(ga(e,e.memoizedProps.onUpdate),jt=a):a!==null&&(a.push.apply(a,jt),jt=a),Ut=(e.flags&32)!==0?!0:o;break;default:Bo(t,e)}}function Bt(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Rv(e,t.alternate,t),t=t.sibling}function kn(e,t){for(e=e.child;e!==null;){var n=e,o=t;switch(n.tag){case 0:case 11:case 14:case 15:Xn(4,n,n.return),kn(n,o);break;case 1:Oe(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Ov(n,n.return,a),kn(n,o);break;case 27:(o&2)!==0&&Em(n.stateNode,n.type,n.memoizedProps);case 5:Oe(n,n.return),n.tag!==5&&n.tag!==27||tl(n),kn(n,o);break;case 6:tl(n);break;case 26:Oe(n,n.return),a=n.stateNode,n.memoizedState!==null||a===null||G||a.parentNode.removeChild(a),kn(n,o);break;case 22:n.memoizedState===null&&kn(n,o);break;case 30:Oe(n,n.return),kn(n,o);break;case 7:Oe(n,n.return);default:kn(n,o)}e=e.sibling}}function Ot(e,t,n){for(n=(t.subtreeFlags&8772)!==0?n:n&-2,t=t.child;t!==null;){var o=t.alternate,a=e,l=t,c=l.flags,i=(n&1)!==0;switch(l.tag){case 0:case 11:case 15:Ot(a,l,n),Al(4,l);break;case 1:if(Ot(a,l,n),o=l,a=o.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(g){Z(o,o.return,g)}if(o=l,a=o.updateQueue,a!==null){var r=o.stateNode;try{var d=a.shared.hiddenCallbacks;if(d!==null)for(a.shared.hiddenCallbacks=null,a=0;a<d.length;a++)Ug(d[a],r)}catch(g){Z(o,o.return,g)}}i&&c&64&&Nv(l),qt(l,l.return);break;case 27:(n&2)!==0&&_v(l);case 5:l.tag!==5&&l.tag!==27||tb(l),Ot(a,l,n),i&&o===null&&c&4&&su(l),qt(l,l.return);break;case 6:tb(l);break;case 26:r=l.stateNode,l.memoizedState!==null||r===null||Se||Bu(pl(r.ownerDocument),l.type,r),Ot(a,l,n),i&&o===null&&c&4&&su(l),qt(l,l.return);break;case 12:Ot(a,l,n);break;case 31:Ot(a,l,n),i&&c&4&&jv(a,l);break;case 13:Ot(a,l,n),i&&c&4&&Yv(a,l);break;case 22:l.memoizedState===null&&Ot(a,l,n),qt(l,l.return);break;case 30:Ot(a,l,n),qt(l,l.return);break;case 7:qt(l,l.return);default:Ot(a,l,n)}t=t.sibling}}function Ed(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Nl(n))}function zd(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Nl(e))}function mt(e,t,n,o){var a=(n&335544064)===n;if(t.subtreeFlags&(a?10262:10256))for(t=t.child;t!==null;)Xv(e,t,n,o),t=t.sibling;else a&&Dv(t)}function Xv(e,t,n,o){var a=(n&335544064)===n;a&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&Tc(t);var l=t.flags;switch(t.tag){case 0:case 11:case 15:mt(e,t,n,o),l&2048&&Al(9,t);break;case 1:mt(e,t,n,o);break;case 3:mt(e,t,n,o),a&&hu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),l&2048&&(l=null,t.alternate!==null&&(l=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==l&&(t.refCount++,l!=null&&Nl(l)));break;case 12:if(l&2048){mt(e,t,n,o),l=t.stateNode;try{var c=t.memoizedProps,i=c.id,r=c.onPostCommit;typeof r=="function"&&r(i,t.alternate===null?"mount":"update",l.passiveEffectDuration,-0)}catch(d){Z(t,t.return,d)}}else mt(e,t,n,o);break;case 31:mt(e,t,n,o);break;case 13:mt(e,t,n,o);break;case 23:break;case 22:c=t.stateNode,i=t.alternate,t.memoizedState!==null?(a&&i!==null&&i.memoizedState===null&&Tc(i),c._visibility&2?mt(e,t,n,o):nl(e,t)):(a&&i!==null&&i.memoizedState!==null&&Tc(t),c._visibility&2?mt(e,t,n,o):(c._visibility|=2,jo(e,t,n,o,(t.subtreeFlags&10256)!==0||!1))),l&2048&&Ed(i,t);break;case 24:mt(e,t,n,o),l&2048&&zd(t.alternate,t);break;case 30:a&&(l=t.alternate,l!==null&&(Zt(l.child,!0),Zt(t.child,!0))),mt(e,t,n,o);break;default:mt(e,t,n,o)}}function jo(e,t,n,o,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var l=e,c=t,i=n,r=o,d=c.flags;switch(c.tag){case 0:case 11:case 15:jo(l,c,i,r,a),Al(8,c);break;case 23:break;case 22:var g=c.stateNode;c.memoizedState!==null?g._visibility&2?jo(l,c,i,r,a):nl(l,c):(g._visibility|=2,jo(l,c,i,r,a)),a&&d&2048&&Ed(c.alternate,c);break;case 24:jo(l,c,i,r,a),a&&d&2048&&zd(c.alternate,c);break;default:jo(l,c,i,r,a)}t=t.sibling}}function nl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,o=t,a=o.flags;switch(o.tag){case 22:nl(n,o),a&2048&&Ed(o.alternate,o);break;case 24:nl(n,o),a&2048&&zd(o.alternate,o);break;default:nl(n,o)}t=t.sibling}}var oo=8192;function eo(e,t,n){if(e.subtreeFlags&oo)for(e=e.child;e!==null;)Qv(e,t,n),e=e.sibling}function Qv(e,t,n){switch(e.tag){case 26:eo(e,t,n),e.flags&oo&&(e.memoizedState!==null?My(n,At,e.memoizedState,e.memoizedProps):(e=e.stateNode,(t&335544128)===t&&_b(n,e)));break;case 5:eo(e,t,n),e.flags&oo&&(e=e.stateNode,(t&335544128)===t&&_b(n,e));break;case 3:case 4:var o=At;At=pl(e.stateNode.containerInfo),eo(e,t,n),At=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=oo,oo=16777216,eo(e,t,n),oo=o):eo(e,t,n));break;case 30:if((e.flags&oo)!==0&&(o=e.memoizedProps.name,o!=null&&o!=="auto")){var a=e.stateNode;a.paired=null,ot===null&&(ot=new Map),ot.set(o,a)}eo(e,t,n);break;default:eo(e,t,n)}}function Zv(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function qa(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];Te=o,Jv(o,e)}Zv(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Kv(e),e=e.sibling}function Kv(e){switch(e.tag){case 0:case 11:case 15:qa(e),e.flags&2048&&Xn(9,e,e.return);break;case 3:qa(e);break;case 12:qa(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,wc(e)):qa(e);break;default:qa(e)}}function wc(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];Te=o,Jv(o,e)}Zv(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Xn(8,t,t.return),wc(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,wc(t));break;default:wc(t)}e=e.sibling}}function Jv(e,t){for(;Te!==null;){var n=Te;switch(n.tag){case 0:case 11:case 15:Xn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var o=n.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:Nl(n.memoizedState.cache)}if(o=n.child,o!==null)o.return=n,Te=o;else e:for(n=e;Te!==null;){o=Te;var a=o.sibling,l=o.return;if(Bv(o),o===n){Te=null;break e}if(a!==null){a.return=l,Te=a;break e}Te=l}}}var O0={getCacheForType:function(e){var t=_e(ge),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return _e(ge).controller.signal}},A0=typeof WeakMap=="function"?WeakMap:Map,L=0,J=null,B=null,j=0,X=0,et=null,On=!1,za=!1,Nd=!1,dn=0,de=0,Qn=0,fo=0,Ic=0,at=0,ba=0,ol=null,Ke=null,ku=!1,xi=0,$v=0,Pc=1/0,ei=null,Bn=null,ie=0,Mt=null,yo=null,Qt=0,Su=0,Tu=null,Fv=null,ca=null,ia=null,ra=null,al=0,Ec=null;function rt(){return(L&2)!==0&&j!==0?j&-j:_.T!==null?Ad():eg()}function Wv(){if(at===0)if((j&536870912)===0||R){var e=Kl;Kl<<=1,(Kl&3932160)===0&&(Kl=262144),at=e}else at=536870912;return e=He.current,e!==null&&(e.flags|=32),at}function ga(e,t){if(t!=null){var n=e.stateNode,o=n.ref;o===null&&(o=n.ref=hm(ln(e.memoizedProps,n))),ia===null&&(ia=[]),ia.push(t.bind(null,o))}}function Fe(e,t,n){(e===J&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(va(e,0),An(e,j,at,!1)),wl(e,n),((L&2)===0||e!==J)&&(e===J&&((L&2)===0&&(fo|=n),de===4&&An(e,j,at,!1)),Jt(e))}function Iv(e,t,n){if((L&6)!==0)throw Error(y(327));var o=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Tl(e,t),a=o?C0(e,t):kr(e,t,!0),l=o;do{if(a===0){za&&!o&&An(e,t,0,!1);break}else{if(n=e.current.alternate,l&&!_0(n)){a=kr(e,t,!1),l=!1;continue}if(a===2){if(l=t,e.errorRecoveryDisabledLanes&l)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var i=e;a=ol;var r=i.current.memoizedState.isDehydrated;if(r&&(va(i,c).flags|=256),c=kr(i,c,!1),c!==2&&c!==6){if(Nd&&!r){i.errorRecoveryDisabledLanes|=l,fo|=l,a=4;break e}l=Ke,Ke=a,l!==null&&(Ke===null?Ke=l:Ke.push.apply(Ke,l))}a=c}if(l=!1,a!==2)continue}}if(a===1){va(e,0),An(e,t,0,!0);break}e:{switch(o=e,l=a,l){case 0:case 1:throw Error(y(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:An(o,t,at,!On);break e;case 2:Ke=null;break;case 3:case 5:break;default:throw Error(y(329))}if((t&62914560)===t&&(a=xi+300-lt(),10<a)){if(An(o,t,at,!On),ci(o,0,!0)!==0)break e;Qt=t,o.timeoutHandle=Md(lb.bind(null,o,n,Ke,ei,ku,t,at,fo,ba,On,l,"Throttled",-0,0),a);break e}lb(o,n,Ke,ei,ku,t,at,fo,ba,On,l,null,-0,0)}}break}while(!0);Jt(e)}function lb(e,t,n,o,a,l,c,i,r,d,g,m,s,b){e.timeoutHandle=-1;var x=t.subtreeFlags,k=(l&335544064)===l;if(m=null,(k||x&8192||(x&16785408)===16785408)&&(m={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Lt},ot=null,Qv(t,l,m),k&&(x=m,k=e.containerInfo,k=(k.nodeType===9?k:k.ownerDocument).__reactViewTransition,k!=null&&(x.count++,x.waitingForViewTransition=!0,x=hl.bind(x),k.finished.then(x,x))),x=(l&62914560)===l?xi-lt():(l&4194048)===l?$v-lt():0,x=Cy(m,x),x!==null)){Qt=l,e.cancelPendingCommit=x(ib.bind(null,e,t,l,n,o,a,c,i,r,d,g,m,null,s,b)),An(e,l,c,!d);return}ib(e,t,l,n,o,a,c,i,r,d,g,m)}function _0(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var o=0;o<n.length;o++){var a=n[o],l=a.getSnapshot;a=a.value;try{if(!ut(l(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function An(e,t,n,o){t=$b(e,t),t&=~Ic,t&=~fo,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var a=t;0<a;){var l=31-it(a),c=1<<l;o[l]=-1,a&=~c}n!==0&&Wb(e,n,t)}function ki(){return(L&6)===0?(_l(0,!1),!1):!0}function Od(){if(B!==null){if(X===0)var e=B.return;else e=B,tn=wo=null,fd(e),oa=null,fl=0,e=B;for(;e!==null;)zv(e.alternate,e),e=e.return;B=null}}function va(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,I0(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Qt=0,Od(),J=e,B=n=nn(e.current,null),j=t,X=0,et=null,On=!1,za=Tl(e,t),Nd=!1,ba=at=Ic=fo=Qn=de=0,Ke=ol=null,ku=!1,dn=$b(e,t),fi(),n}function Pv(e,t){H=null,_.H=Zc,t===wa||t===gi?(t=Cs(),X=3):t===od?(t=Cs(),X=4):X=t===yd?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,et=t,B===null&&(de=1,Kc(e,kt(t,e.current)))}function em(){var e=He.current;return e===null?!0:(j&4194048)===j?je===null:(j&62914560)===j||(j&536870912)!==0?e===je:!1}function tm(){var e=_.H;return _.H=Zc,e===null?Zc:e}function nm(){var e=_.A;return _.A=O0,e}function ti(){de=4,On||(j&4194048)!==j&&He.current!==null||(za=!0),(Qn&134217727)===0&&(fo&134217727)===0||J===null||An(J,j,at,!1)}function kr(e,t,n){var o=L;L|=2;var a=tm(),l=nm();(J!==e||j!==t)&&(ei=null,va(e,t)),t=!1;var c=de;e:do try{if(X!==0&&B!==null){var i=B,r=et;switch(X){case 8:Od(),c=6;break e;case 3:case 2:case 9:case 6:He.current===null&&(t=!0);var d=X;if(X=0,et=null,Io(e,i,r,d),n&&za){c=0;break e}break;default:d=X,X=0,et=null,Io(e,i,r,d)}}M0(),c=de;break}catch(g){Pv(e,g)}while(!0);return t&&e.shellSuspendCounter++,tn=wo=null,L=o,_.H=a,_.A=l,B===null&&(J=null,j=0,fi()),c}function M0(){for(;B!==null;)om(B)}function C0(e,t){var n=L;L|=2;var o=tm(),a=nm();J!==e||j!==t?(ei=null,Pc=lt()+500,va(e,t)):za=Tl(e,t);e:do try{if(X!==0&&B!==null){t=B;var l=et;t:switch(X){case 1:X=0,et=null,Io(e,t,l,1);break;case 2:case 9:if(Ms(l)){X=0,et=null,cb(t);break}t=function(){X!==2&&X!==9||J!==e||(X=7),Jt(e)},l.then(t,t);break e;case 3:X=7;break e;case 4:X=5;break e;case 7:Ms(l)?(X=0,et=null,cb(t)):(X=0,et=null,Io(e,t,l,7));break;case 5:var c=null;switch(B.tag){case 26:c=B.memoizedState;case 5:case 27:var i=B;if(c?Om(c):i.stateNode.complete){X=0,et=null;var r=i.sibling;if(r!==null)B=r;else{var d=i.return;d!==null?(B=d,Si(d)):B=null}break t}}X=0,et=null,Io(e,t,l,5);break;case 6:X=0,et=null,Io(e,t,l,6);break;case 8:Od(),de=6;break e;default:throw Error(y(462))}}D0();break}catch(g){Pv(e,g)}while(!0);return tn=wo=null,_.H=o,_.A=a,L=n,B!==null?0:(J=null,j=0,fi(),de)}function D0(){for(;B!==null&&!Fp();)om(B)}function om(e){var t=Ev(e.alternate,e,dn);e.memoizedProps=e.pendingProps,t===null?Si(e):B=t}function cb(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Js(n,t,t.pendingProps,t.type,void 0,j);break;case 11:t=Js(n,t,t.pendingProps,t.type.render,t.ref,j);break;case 5:fd(t);var o=t;o===Ee&&(R?(jc(o),o.tag===5&&o.stateNode!=null&&(P=o.stateNode)):(jc(o),R=!0));default:zv(n,t),t=B=Ng(t,dn),t=Ev(n,t,dn)}e.memoizedProps=e.pendingProps,t===null?Si(e):B=t}function Io(e,t,n,o){tn=wo=null,fd(t),oa=null,fl=0;var a=t.return;try{if(x0(e,a,t,n,j)){de=1,Kc(e,kt(n,e.current)),B=null;return}}catch(l){if(a!==null)throw B=a,l;de=1,Kc(e,kt(n,e.current)),B=null;return}t.flags&32768?(R||o===1?e=!0:za||(j&536870912)!==0?e=!1:(On=e=!0,(o===2||o===9||o===3||o===6)&&(o=He.current,o!==null&&o.tag===13&&(o.flags|=16384))),am(t,e)):Si(t)}function Si(e){var t=e;do{if((t.flags&32768)!==0){am(t,On);return}e=t.return;var n=w0(t.alternate,t,dn);if(n!==null){B=n;return}if(t=t.sibling,t!==null){B=t;return}B=t=e}while(t!==null);de===0&&(de=5)}function am(e,t){do{var n=E0(e.alternate,e);if(n!==null){n.flags&=32767,B=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){B=e;return}B=e=n}while(e!==null);de=6,B=null}function ib(e,t,n,o,a,l,c,i,r,d,g,m){e.cancelPendingCommit=null;do Ti();while(ie!==0);if((L&6)!==0)throw Error(y(327));if(t!==null){if(t===e.current)throw Error(y(177));e===J&&(B=J=null,j=0),yo=t,Mt=e,Qt=n,Tu=a,Fv=o,H0(e,t,n,c,i,r,m)}}function H0(e,t,n,o,a,l,c){var i=t.lanes|t.childLanes;if(Su=i,i|=Wu,ch(e,n,i,o,a,l),ia=null,(n&335544064)===n?(ra=r0(e),o=10262):(ra=null,o=10256),(t.subtreeFlags&o)!==0||(t.flags&o)!==0?(e.callbackNode=null,e.callbackPriority=0,Y0(Hc,function(){return Nu(),null})):(e.callbackNode=null,e.callbackPriority=0),Fc=!1,o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=_.T,_.T=null,a=V.p,V.p=2,l=L,L|=4;try{z0(e,t,n)}finally{L=l,V.p=a,_.T=o}}ie=1,Fc?ca=ay(c,e.containerInfo,ra,wu,Eu,U0,zu,Nu,R0,null,null):(wu(),Eu(),zu())}function R0(e){if(ie!==0){var t=Mt.onRecoverableError;t(e,{componentStack:null})}}function U0(){ie===3&&(ie=0,Gv(yo,Mt),ie=4)}function wu(){if(ie===1){ie=0;var e=Mt,t=yo,n=Qt,o=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||o){o=_.T,_.T=null;var a=V.p;V.p=2;var l=L;L|=4;try{Qa=Wc=!1,Lv(t,e,n),n=Mu;var c=yg(e.containerInfo),i=n.focusedElem,r=n.selectionRange;if(c!==i&&i&&i.ownerDocument&&hg(i.ownerDocument.documentElement,i)){if(r!==null&&Fu(i)){var d=r.start,g=r.end;if(g===void 0&&(g=d),"selectionStart"in i)i.selectionStart=d,i.selectionEnd=Math.min(g,i.value.length);else{var m=i.ownerDocument||document,s=m&&m.defaultView||window;if(s.getSelection){var b=s.getSelection(),x=i.textContent.length,k=Math.min(r.start,x),z=r.end===void 0?k:Math.min(r.end,x);!b.extend&&k>z&&(c=z,z=k,k=c);var f=Ts(i,k),u=Ts(i,z);if(f&&u&&(b.rangeCount!==1||b.anchorNode!==f.node||b.anchorOffset!==f.offset||b.focusNode!==u.node||b.focusOffset!==u.offset)){var v=m.createRange();v.setStart(f.node,f.offset),b.removeAllRanges(),k>z?(b.addRange(v),b.extend(u.node,u.offset)):(v.setEnd(u.node,u.offset),b.addRange(v))}}}}for(m=[],b=i;b=b.parentNode;)b.nodeType===1&&m.push({element:b,left:b.scrollLeft,top:b.scrollTop});for(typeof i.focus=="function"&&i.focus(),i=0;i<m.length;i++){var p=m[i];p.element.scrollLeft=p.left,p.element.scrollTop=p.top}}xa=!!_u,Mu=_u=null}finally{L=l,V.p=a,_.T=o}}e.current=t,ie=2}}function Eu(){if(ie===2){ie=0;var e=Mt,t=yo,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=_.T,_.T=null;var o=V.p;V.p=2;var a=L;L|=4;try{Rv(e,t.alternate,t)}finally{L=a,V.p=o,_.T=n}}ie=3}}function zu(){if(ie===4||ie===3){ie=0;var e=ca;ca=null,Wp();var t=Mt,n=yo,o=Qt,a=Fv,l=(o&335544064)===o?10262:10256;if((n.subtreeFlags&l)!==0||(n.flags&l)!==0?ie=5:(ie=0,yo=Mt=null,lm(t,t.pendingLanes)),l=t.pendingLanes,l===0&&(Bn=null),Xu(o),n=n.stateNode,ct&&typeof ct.onCommitFiberRoot=="function")try{ct.onCommitFiberRoot(Sl,n,void 0,(n.current.flags&128)===128)}catch{}if(a!==null){n=_.T,l=V.p,V.p=2,_.T=null;try{for(var c=t.onRecoverableError,i=0;i<a.length;i++){var r=a[i];c(r.value,{componentStack:r.stack})}}finally{_.T=n,V.p=l}}if(a=ia,c=ra,ra=null,a!==null&&(ia=null,c===null&&(c=[]),e!==null))for(r=0;r<a.length;r++)n=(0,a[r])(c),n!==void 0&&e.finished.finally(n);(Qt&3)!==0&&Ti(),Jt(t),l=t.pendingLanes,(o&261930)!==0&&(l&42)!==0?t===Ec?al++:(al=0,Ec=t):(al=0,Ec=null),_l(0,!1)}}function lm(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Nl(t)))}function Ti(){return ca!==null&&(ca.skipTransition(),ca=null),wu(),Eu(),zu(),Nu()}function Nu(){if(ie!==5)return!1;var e=Mt,t=Su;Su=0;var n=Xu(Qt),o=_.T,a=V.p;try{V.p=32>n?32:n,_.T=null,n=Tu,Tu=null;var l=Mt,c=Qt;if(ie=0,yo=Mt=null,Qt=0,(L&6)!==0)throw Error(y(331));var i=L;if(L|=4,Kv(l.current),Xv(l,l.current,c,n),L=i,_l(0,!1),ct&&typeof ct.onPostCommitFiberRoot=="function")try{ct.onPostCommitFiberRoot(Sl,l)}catch{}return!0}finally{V.p=a,_.T=o,lm(e,t)}}function rb(e,t,n){t=kt(n,t),t=cu(e.stateNode,t,2),e=Hn(e,t,2),e!==null&&(wl(e,2),Jt(e))}function Z(e,t,n){if(e.tag===3)rb(e,e,n);else for(;t!==null;){if(t.tag===3){rb(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Bn===null||!Bn.has(o))){e=kt(n,e),n=xv(2),o=Hn(t,n,2),o!==null&&(kv(n,o,t,e),wl(o,2),Jt(o));break}}t=t.return}}function Sr(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new A0;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(n)||(Nd=!0,a.add(n),e=B0.bind(null,e,t,n),t.then(e,e))}function B0(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,J===e&&(j&n)===n&&((de===4||de===3&&(j&62914560)===j&&300>lt()-xi)&&(L&2)===0?va(e,0):Ic|=n,ba===j&&(ba=0)),Jt(e)}function cm(e,t){t===0&&(t=Fb()),e=To(e,t),e!==null&&(wl(e,t),Jt(e))}function q0(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),cm(e,n)}function j0(e,t){var n=0;switch(e.tag){case 31:case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(y(314))}o!==null&&o.delete(t),cm(e,n)}function Y0(e,t){return Vu(e,t)}var ma=null,Yo=null,Ou=!1,ni=!1,Tr=!1,_n=0;function Jt(e){e!==Yo&&e.next===null&&(Yo===null?ma=Yo=e:Yo=Yo.next=e),ni=!0,Ou||(Ou=!0,V0())}function _l(e,t){if(!Tr&&ni){Tr=!0;do for(var n=!1,o=ma;o!==null;){if(!t)if(e!==0){var a=o.pendingLanes;if(a===0)var l=0;else{var c=o.suspendedLanes,i=o.pingedLanes;l=(1<<31-it(42|e)+1)-1,l&=a&~(c&~i),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(n=!0,ub(o,l))}else l=j,l=ci(o,o===J?l:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(l&3)===0||Tl(o,l)||(n=!0,ub(o,l));o=o.next}while(n);Tr=!1}}function L0(){im()}function im(){ni=Ou=!1;var e=0;_n!==0&&W0()&&(e=_n);for(var t=lt(),n=null,o=ma;o!==null;){var a=o.next,l=rm(o,t);l===0?(o.next=null,n===null?ma=a:n.next=a,a===null&&(Yo=n)):(n=o,(e!==0||(l&3)!==0)&&(ni=!0)),o=a}ie!==0&&ie!==5||_l(e,!1),_n!==0&&(_n=0)}function rm(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var c=31-it(l),i=1<<c,r=a[c];r===-1?((i&n)===0||(i&o)!==0)&&(a[c]=lh(i,t)):r<=t&&(e.expiredLanes|=i),l&=~i}if(t=J,n=j,n=ci(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&tr(o),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Tl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(o!==null&&tr(o),Xu(n)){case 2:case 8:n=Kb;break;case 32:n=Hc;break;case 268435456:n=Jb;break;default:n=Hc}return o=um.bind(null,e),n=Vu(n,o),e.callbackPriority=t,e.callbackNode=n,t}return o!==null&&o!==null&&tr(o),e.callbackPriority=2,e.callbackNode=null,2}function um(e,t){if(ie!==0&&ie!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Ti()&&e.callbackNode!==n)return null;var o=j;return o=ci(e,e===J?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(Iv(e,o,t),rm(e,lt()),e.callbackNode!=null&&e.callbackNode===n?um.bind(null,e):null)}function ub(e,t){if(Ti())return null;Iv(e,t,!0)}function V0(){P0(function(){(L&6)!==0?Vu(Zb,L0):im()})}function Ad(){if(_n===0){var e=vo;e===0&&(e=Zl,Zl<<=1,(Zl&261888)===0&&(Zl=256)),_n=e}return _n}function db(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:bc(e)}function G0(e,t,n,o,a){if(t==="submit"&&n&&n.stateNode===a){var l=db((a[Ie]||null).action),c=o.submitter;c&&(t=(t=c[Ie]||null)?db(t.formAction):c.getAttribute("formAction"),t!==null&&(l=t,c=null));var i=new ri("action","action",null,o,a);e.push({event:i,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(_n!==0){var r=new FormData(a,c);au(n,{pending:!0,data:r,method:a.method,action:l},null,r)}}else typeof l=="function"&&(i.preventDefault(),r=new FormData(a,c),au(n,{pending:!0,data:r,method:a.method,action:l},l,r))},currentTarget:a}]})}}for(ic=0;ic<Kr.length;ic++)rc=Kr[ic],fb=rc.toLowerCase(),sb=rc[0].toUpperCase()+rc.slice(1),Ct(fb,"on"+sb);var rc,fb,sb,ic;Ct(kg,"onAnimationEnd");Ct(Sg,"onAnimationIteration");Ct(Tg,"onAnimationStart");Ct("dblclick","onDoubleClick");Ct("focusin","onFocus");Ct("focusout","onBlur");Ct(e0,"onTransitionRun");Ct(t0,"onTransitionStart");Ct(n0,"onTransitionCancel");Ct(wg,"onTransitionEnd");da("onMouseEnter",["mouseout","mouseover"]);da("onMouseLeave",["mouseout","mouseover"]);da("onPointerEnter",["pointerout","pointerover"]);da("onPointerLeave",["pointerout","pointerover"]);ko("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));ko("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));ko("onBeforeInput",["compositionend","keypress","textInput","paste"]);ko("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));ko("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));ko("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var gl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),X0=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(gl));function dm(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],a=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var c=o.length-1;0<=c;c--){var i=o[c],r=i.instance,d=i.currentTarget;if(i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(g){Uc(g)}a.currentTarget=null,l=r}else for(c=0;c<o.length;c++){if(i=o[c],r=i.instance,d=i.currentTarget,i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(g){Uc(g)}a.currentTarget=null,l=r}}}}function U(e,t){var n=t[cs];n===void 0&&(n=t[cs]=new Set);var o=e+"__bubble";n.has(o)||(fm(t,e,2,!1),n.add(o))}function wr(e,t,n){var o=0;t&&(o|=4),fm(n,e,o,t)}var uc="_reactListening"+Math.random().toString(36).slice(2);function _d(e){if(!e[uc]){e[uc]=!0,ng.forEach(function(n){n!=="selectionchange"&&(X0.has(n)||wr(n,!1,e),wr(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[uc]||(t[uc]=!0,wr("selectionchange",!1,t))}}function fm(e,t,n,o){switch(Rm(t)){case 2:var a=Uy;break;case 8:a=By;break;default:a=Bd}n=a.bind(null,t,n,e),a=void 0,!Gr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function Er(e,t,n,o,a){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var i=o.stateNode.containerInfo;if(i===a)break;if(c===4)for(c=o.return;c!==null;){var r=c.tag;if((r===3||r===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;i!==null;){if(c=ao(i),c===null)return;if(r=c.tag,r===5||r===6||r===26||r===27){o=l=c;continue e}i=i.parentNode}}o=o.return}dg(function(){var d=l,g=Zu(n),m=[];e:{var s=Eg.get(e);if(s!==void 0){var b=ri,x=e;switch(e){case"keypress":if(vc(n)===0)break e;case"keydown":case"keyup":b=_h;break;case"focusin":x="focus",b=ir;break;case"focusout":x="blur",b=ir;break;case"beforeblur":case"afterblur":b=ir;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":b=gs;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":b=hh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":b=Rh;break;case kg:case Sg:case Tg:b=kh;break;case wg:b=Bh;break;case"scroll":case"scrollend":b=mh;break;case"wheel":b=jh;break;case"copy":case"cut":case"paste":b=Th;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":b=ms;break;case"submit":b=Dh;break;case"toggle":case"beforetoggle":b=Lh}var k=(t&4)!==0,z=!k&&(e==="scroll"||e==="scrollend"),f=k?s!==null?s+"Capture":null:s;k=[];for(var u=d,v;u!==null;){var p=u;if(v=p.stateNode,p=p.tag,p!==5&&p!==26&&p!==27||v===null||f===null||(p=cl(u,f),p!=null&&k.push(vl(u,p,v))),z)break;u=u.return}0<k.length&&(s=new b(s,x,null,n,g),m.push({event:s,listeners:k}))}}if((t&7)===0){e:{if(b=e==="mouseover"||e==="pointerover",s=e==="mouseout"||e==="pointerout",b&&n!==Vr&&(x=n.relatedTarget||n.fromElement)&&(ao(x)||x[Sa]))break e;(s||b)&&(x=g.window===g?g:(b=g.ownerDocument)?b.defaultView||b.parentWindow:window,s?(b=n.relatedTarget||n.toElement,s=d,b=b?ao(b):null,b!==null&&(z=kl(b),k=b.tag,b!==z||k!==5&&k!==27&&k!==6)&&(b=null)):(s=null,b=d),s!==b&&(k=gs,p="onMouseLeave",f="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(k=ms,p="onPointerLeave",f="onPointerEnter",u="pointer"),z=s==null?x:Ga(s),v=b==null?x:Ga(b),x=new k(p,u+"leave",s,n,g),x.target=z,x.relatedTarget=v,p=null,ao(g)===d&&(k=new k(f,u+"enter",b,n,g),k.target=v,k.relatedTarget=z,p=k),z=p,k=s&&b?_r(s,b,Q0):null,s!==null&&bb(m,x,s,k,!1),b!==null&&z!==null&&bb(m,z,b,k,!0)))}e:{if(s=d?Ga(d):window,b=s.nodeName&&s.nodeName.toLowerCase(),b==="select"||b==="input"&&s.type==="file")var h=xs;else if(ys(s))if(mg)h=Wh;else{h=$h;var w=Jh}else b=s.nodeName,!b||b.toLowerCase()!=="input"||s.type!=="checkbox"&&s.type!=="radio"?d&&Qu(d.elementType)&&(h=xs):h=Fh;if(h&&(h=h(e,d))){vg(m,h,n,g);break e}w&&w(e,s,d)}switch(w=d?Ga(d):window,e){case"focusin":(ys(w)||w.contentEditable==="true")&&(Zo=w,Qr=d,Ja=null);break;case"focusout":Ja=Qr=Zo=null;break;case"mousedown":Zr=!0;break;case"contextmenu":case"mouseup":case"dragend":Zr=!1,ws(m,n,g);break;case"selectionchange":if(Ph)break;case"keydown":case"keyup":ws(m,n,g)}var T;if($u)e:{switch(e){case"compositionstart":var E="onCompositionStart";break e;case"compositionend":E="onCompositionEnd";break e;case"compositionupdate":E="onCompositionUpdate";break e}E=void 0}else Qo?bg(e,n)&&(E="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(E="onCompositionStart");E&&(sg&&n.locale!=="ko"&&(Qo||E!=="onCompositionStart"?E==="onCompositionEnd"&&Qo&&(T=fg()):(zn=g,Ku="value"in zn?zn.value:zn.textContent,Qo=!0)),w=oi(d,E),0<w.length&&(E=new vs(E,e,null,n,g),m.push({event:E,listeners:w}),T?E.data=T:(T=gg(n),T!==null&&(E.data=T)))),(T=Gh?Xh(e,n):Qh(e,n))&&(E=oi(d,"onBeforeInput"),0<E.length&&(w=new vs("onBeforeInput","beforeinput",null,n,g),m.push({event:w,listeners:E}),w.data=T)),G0(m,e,d,n,g)}dm(m,t)})}function vl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function oi(e,t){for(var n=t+"Capture",o=[];e!==null;){var a=e,l=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||l===null||(a=cl(e,n),a!=null&&o.unshift(vl(e,a,l)),a=cl(e,t),a!=null&&o.push(vl(e,a,l))),e.tag===3)return o;e=e.return}return[]}function Q0(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function bb(e,t,n,o,a){for(var l=t._reactName,c=[];n!==null&&n!==o;){var i=n,r=i.alternate,d=i.stateNode;if(i=i.tag,r!==null&&r===o)break;i!==5&&i!==26&&i!==27||d===null||(r=d,a?(d=cl(n,l),d!=null&&c.unshift(vl(n,d,r))):a||(d=cl(n,l),d!=null&&c.push(vl(n,d,r)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var Z0=/\r\n?/g,K0=/\u0000|\uFFFD/g;function gb(e){return(typeof e=="string"?e:""+e).replace(Z0,`
`).replace(K0,"")}function sm(e,t){return t=gb(t),gb(e)===t}function Q(e,t,n,o,a,l){switch(n){case"children":if(typeof o=="string")t==="body"||t==="textarea"&&o===""||fa(e,o);else if(typeof o=="number"||typeof o=="bigint")t!=="body"&&fa(e,""+o);else return;break;case"className":$l(e,"class",o);break;case"tabIndex":$l(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":$l(e,n,o);break;case"style":ug(e,o,l);return;case"data":if(t!=="object"){$l(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=bc(o),e.setAttribute(n,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(n==="formAction"?(t!=="input"&&Q(e,t,"name",a.name,a,null),Q(e,t,"formEncType",a.formEncType,a,null),Q(e,t,"formMethod",a.formMethod,a,null),Q(e,t,"formTarget",a.formTarget,a,null)):(Q(e,t,"encType",a.encType,a,null),Q(e,t,"method",a.method,a,null),Q(e,t,"target",a.target,a,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=bc(o),e.setAttribute(n,o);break;case"onClick":o!=null&&(e.onclick=Lt);return;case"onScroll":o!=null&&U("scroll",e);return;case"onScrollEnd":o!=null&&U("scrollend",e);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(y(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(y(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}n=bc(o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":o===!0?e.setAttribute(n,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(n,o):e.removeAttribute(n);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(n):e.setAttribute(n,o);break;case"popover":U("beforetoggle",e),U("toggle",e),sc(e,"popover",o);break;case"xlinkActuate":It(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":It(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":It(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":It(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":It(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":It(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":It(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":It(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":It(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":sc(e,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")n=gh.get(n)||n,sc(e,n,o);else return}Y=!0}function Au(e,t,n,o,a,l){switch(n){case"style":ug(e,o,l);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(y(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(y(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"children":if(typeof o=="string")fa(e,o);else if(typeof o=="number"||typeof o=="bigint")fa(e,""+o);else return;break;case"onScroll":o!=null&&U("scroll",e);return;case"onScrollEnd":o!=null&&U("scrollend",e);return;case"onClick":o!=null&&(e.onclick=Lt);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!og.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),l=n.slice(2,a?n.length-7:void 0),t=e[Ie]||null,t=t!=null?t[n]:null,typeof t=="function"&&e.removeEventListener(l,t,a),typeof o=="function")){typeof t!="function"&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(l,o,a);break e}Y=!0,n in e?e[n]=o:o===!0?e.setAttribute(n,""):sc(e,n,o)}return}Y=!0}function De(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":U("error",e),U("load",e);var o=!1,a=!1,l;for(l in n)if(n.hasOwnProperty(l)){var c=n[l];if(c!=null)switch(l){case"src":o=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(y(137,t));default:Q(e,t,l,c,n,null)}}a&&Q(e,t,"srcSet",n.srcSet,n,null),o&&Q(e,t,"src",n.src,n,null);return;case"input":U("invalid",e);var i=l=c=a=null,r=null,d=null;for(o in n)if(n.hasOwnProperty(o)){var g=n[o];if(g!=null)switch(o){case"name":a=g;break;case"type":c=g;break;case"checked":r=g;break;case"defaultChecked":d=g;break;case"value":l=g;break;case"defaultValue":i=g;break;case"children":case"dangerouslySetInnerHTML":if(g!=null)throw Error(y(137,t));break;default:Q(e,t,o,g,n,null)}}cg(e,l,i,r,d,c,a,!1);return;case"select":U("invalid",e),o=c=l=null;for(a in n)if(n.hasOwnProperty(a)&&(i=n[a],i!=null))switch(a){case"value":l=i;break;case"defaultValue":c=i;break;case"multiple":o=i;default:Q(e,t,a,i,n,null)}t=l,n=c,e.multiple=!!o,t!=null?ea(e,!!o,t,!1):n!=null&&ea(e,!!o,n,!0);return;case"textarea":U("invalid",e),l=a=o=null;for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"value":o=i;break;case"defaultValue":a=i;break;case"children":l=i;break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(y(91));break;default:Q(e,t,c,i,n,null)}rg(e,o,a,l);return;case"option":for(r in n)n.hasOwnProperty(r)&&(o=n[r],o!=null)&&(r==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":Q(e,t,r,o,n,null));return;case"dialog":U("beforetoggle",e),U("toggle",e),U("cancel",e),U("close",e);break;case"iframe":case"object":U("load",e);break;case"video":case"audio":for(o=0;o<gl.length;o++)U(gl[o],e);break;case"image":U("error",e),U("load",e);break;case"details":U("toggle",e);break;case"embed":case"source":case"link":U("error",e),U("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(d in n)if(n.hasOwnProperty(d)&&(o=n[d],o!=null))switch(d){case"children":case"dangerouslySetInnerHTML":throw Error(y(137,t));default:Q(e,t,d,o,n,null)}return;default:if(Qu(t)){for(g in n)n.hasOwnProperty(g)&&(o=n[g],o!==void 0&&Au(e,t,g,o,n,void 0));return}}for(i in n)n.hasOwnProperty(i)&&(o=n[i],o!=null&&Q(e,t,i,o,n,null))}var J0={};function $0(e,t,n,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,l=null,c=null,i=null,r=null,d=null,g=null;for(b in n){var m=n[b];if(n.hasOwnProperty(b)&&m!=null)switch(b){case"checked":break;case"value":break;case"defaultValue":r=m;default:o.hasOwnProperty(b)||Q(e,t,b,null,o,m)}}for(var s in o){var b=o[s];if(m=n[s],o.hasOwnProperty(s)&&(b!=null||m!=null))switch(s){case"type":b!==m&&(Y=!0),l=b;break;case"name":b!==m&&(Y=!0),a=b;break;case"checked":b!==m&&(Y=!0),d=b;break;case"defaultChecked":b!==m&&(Y=!0),g=b;break;case"value":b!==m&&(Y=!0),c=b;break;case"defaultValue":b!==m&&(Y=!0),i=b;break;case"children":case"dangerouslySetInnerHTML":if(b!=null)throw Error(y(137,t));break;default:b!==m&&Q(e,t,s,b,o,m)}}Lr(e,c,i,r,d,g,l,a);return;case"select":b=c=i=s=null;for(l in n)if(r=n[l],n.hasOwnProperty(l)&&r!=null)switch(l){case"value":break;case"multiple":b=r;default:o.hasOwnProperty(l)||Q(e,t,l,null,o,r)}for(a in o)if(l=o[a],r=n[a],o.hasOwnProperty(a)&&(l!=null||r!=null))switch(a){case"value":l!==r&&(Y=!0),s=l;break;case"defaultValue":l!==r&&(Y=!0),i=l;break;case"multiple":l!==r&&(Y=!0),c=l;default:l!==r&&Q(e,t,a,l,o,r)}t=i,n=c,o=b,s!=null?ea(e,!!n,s,!1):!!o!=!!n&&(t!=null?ea(e,!!n,t,!0):ea(e,!!n,n?[]:"",!1));return;case"textarea":b=s=null;for(i in n)if(a=n[i],n.hasOwnProperty(i)&&a!=null&&!o.hasOwnProperty(i))switch(i){case"value":break;case"children":break;default:Q(e,t,i,null,o,a)}for(c in o)if(a=o[c],l=n[c],o.hasOwnProperty(c)&&(a!=null||l!=null))switch(c){case"value":a!==l&&(Y=!0),s=a;break;case"defaultValue":a!==l&&(Y=!0),b=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(y(91));break;default:a!==l&&Q(e,t,c,a,o,l)}ig(e,s,b);return;case"option":for(var x in n)s=n[x],n.hasOwnProperty(x)&&s!=null&&!o.hasOwnProperty(x)&&(x==="selected"?e.selected=!1:Q(e,t,x,null,o,s));for(r in o)s=o[r],b=n[r],o.hasOwnProperty(r)&&s!==b&&(s!=null||b!=null)&&(r==="selected"?(s!==b&&(Y=!0),e.selected=s&&typeof s!="function"&&typeof s!="symbol"):Q(e,t,r,s,o,b));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var k in n)s=n[k],n.hasOwnProperty(k)&&s!=null&&!o.hasOwnProperty(k)&&Q(e,t,k,null,o,s);for(d in o)if(s=o[d],b=n[d],o.hasOwnProperty(d)&&s!==b&&(s!=null||b!=null))switch(d){case"children":case"dangerouslySetInnerHTML":if(s!=null)throw Error(y(137,t));break;default:Q(e,t,d,s,o,b)}return;default:if(Qu(t)){for(var z in n)s=n[z],n.hasOwnProperty(z)&&s!==void 0&&!o.hasOwnProperty(z)&&Au(e,t,z,void 0,o,s);for(g in o)s=o[g],b=n[g],!o.hasOwnProperty(g)||s===b||s===void 0&&b===void 0||Au(e,t,g,s,o,b);return}}for(var f in n)s=n[f],n.hasOwnProperty(f)&&s!=null&&!o.hasOwnProperty(f)&&Q(e,t,f,null,o,s);for(m in o)s=o[m],b=n[m],!o.hasOwnProperty(m)||s===b||s==null&&b==null||Q(e,t,m,s,o,b)}function vb(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function F0(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),o=0;o<n.length;o++){var a=n[o],l=a.transferSize,c=a.initiatorType,i=a.duration;if(l&&i&&vb(c)){for(c=0,i=a.responseEnd,o+=1;o<n.length;o++){var r=n[o],d=r.startTime;if(d>i)break;var g=r.transferSize,m=r.initiatorType;g&&vb(m)&&(r=r.responseEnd,c+=g*(r<i?1:(i-d)/(r-d)))}if(--o,t+=8*(l+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var _u=null,Mu=null;function ml(e){return e.nodeType===9?e:e.ownerDocument}function mb(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function bm(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function gm(e,t,n,o){return n=ml(n).createElement(e),n[Ae]=o,n[Ie]=t,De(n,e,t),we(n),n}function Cu(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var zr=null;function W0(){var e=window.event;return e&&e.type==="popstate"?e===zr?!1:(zr=e,!0):(zr=null,!1)}var Md=typeof setTimeout=="function"?setTimeout:void 0,I0=typeof clearTimeout=="function"?clearTimeout:void 0,pb=typeof Promise=="function"?Promise:void 0,hb=typeof requestAnimationFrame=="function"?requestAnimationFrame:Md,P0=typeof queueMicrotask=="function"?queueMicrotask:typeof pb<"u"?function(e){return pb.resolve(null).then(e).catch(ey)}:Md;function ey(e){setTimeout(function(){throw e})}function Kn(e){return e==="head"}function yb(e,t){var n=t,o=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(o===0){e.removeChild(a),ka(t);return}o--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")o++;else if(n==="html")Or(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Or(n);for(var l=n.firstChild;l;){var c=l.nextSibling,i=l.nodeName;l[El]||i==="SCRIPT"||i==="STYLE"||i==="LINK"&&l.rel.toLowerCase()==="stylesheet"||n.removeChild(l),l=c}}else n==="body"&&Or(e.ownerDocument.body);n=a}while(n);ka(t)}function xb(e,t){var n=e;e=0;do{var o=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=o}while(n)}function vm(e,t,n){if(t=CSS.escape(t)!==t?"r-"+btoa(t).replace(/=/g,""):t,e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display==="inline"){if(t=e.getClientRects(),t.length===1)var o=1;else for(var a=o=0;a<t.length;a++){var l=t[a];0<l.width&&0<l.height&&o++}o===1&&(e=e.style,e.display=t.length===1?"inline-block":"block",e.marginTop="-"+n.paddingTop,e.marginBottom="-"+n.paddingBottom)}}function mm(e,t){e=e.style,t=t.style;var n=t!=null?t.hasOwnProperty("viewTransitionName")?t.viewTransitionName:t.hasOwnProperty("view-transition-name")?t["view-transition-name"]:null:null;e.viewTransitionName=n==null||typeof n=="boolean"?"":(""+n).trim(),n=t!=null?t.hasOwnProperty("viewTransitionClass")?t.viewTransitionClass:t.hasOwnProperty("view-transition-class")?t["view-transition-class"]:null:null,e.viewTransitionClass=n==null||typeof n=="boolean"?"":(""+n).trim(),e.display==="inline-block"&&(t==null?e.display=e.margin="":(n=t.display,e.display=n==null||typeof n=="boolean"?"":n,n=t.margin,n!=null?e.margin=n:(n=t.hasOwnProperty("marginTop")?t.marginTop:t["margin-top"],e.marginTop=n==null||typeof n=="boolean"?"":n,t=t.hasOwnProperty("marginBottom")?t.marginBottom:t["margin-bottom"],e.marginBottom=t==null||typeof t=="boolean"?"":t)))}function pm(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position==="absolute"||t.position==="fixed",clip:t.clipPath!=="none"||t.overflow!=="visible"||t.filter!=="none"||t.mask!=="none"||t.mask!=="none"||t.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Du(e){var t=e.getBoundingClientRect(),n=getComputedStyle(e);return pm(t,n,e)}function ty(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return pm(t,n,e)}function ny(e){return e.documentElement.clientHeight}function oy(e){this.addEventListener("load",e),this.addEventListener("error",e)}function ay(e,t,n,o,a,l,c,i,r){var d=t.nodeType===9?t:t.ownerDocument;try{var g=d.startViewTransition({update:function(){var s=d.defaultView,b=s.navigation&&s.navigation.transition,x=d.fonts.status;o();var k=[];if(x==="loaded"&&(ny(d),d.fonts.status==="loading"&&k.push(d.fonts.ready)),x=k.length,e!==null)for(var z=e.suspenseyImages,f=0,u=0;u<z.length;u++){var v=z[u];if(!v.complete){var p=v.getBoundingClientRect();if(0<p.bottom&&0<p.right&&p.top<s.innerHeight&&p.left<s.innerWidth){if(f+=Am(v),f>Oc){k.length=x;break}v=new Promise(oy.bind(v)),k.push(v)}}}if(0<k.length)return s=Promise.race([Promise.all(k),new Promise(function(h){return setTimeout(h,500)})]).then(a,a),(b?Promise.allSettled([b.finished,s]):s).then(l,l);if(a(),b)return b.finished.then(l,l);l()},types:n});d.__reactViewTransition=g;var m=[];return g.ready.then(function(){for(var s=d.documentElement.getAnimations({subtree:!0}),b=0;b<s.length;b++){var x=s[b],k=x.effect,z=k.pseudoElement;if(z!=null&&z.startsWith("::view-transition")){m.push(x),x=k.getKeyframes();for(var f=z=void 0,u=!0,v=0;v<x.length;v++){var p=x[v],h=p.width;if(z===void 0)z=h;else if(z!==h){u=!1;break}if(h=p.height,f===void 0)f=h;else if(f!==h){u=!1;break}delete p.width,delete p.height,p.transform==="none"&&delete p.transform}u&&z!==void 0&&f!==void 0&&(k.setKeyframes(x),u=getComputedStyle(k.target,k.pseudoElement),u.width!==z||u.height!==f)&&(u=x[0],u.width=z,u.height=f,u=x[x.length-1],u.width=z,u.height=f,k.setKeyframes(x))}}c()},function(s){d.__reactViewTransition===g&&(d.__reactViewTransition=null);try{typeof s=="object"&&s!==null&&s.name==="InvalidStateError"&&(s.message==="View transition was skipped because document visibility state is hidden."||s.message==="Skipping view transition because document visibility state has become hidden."||s.message==="Skipping view transition because viewport size changed."||s.message==="Transition was aborted because of invalid state")&&(s=null),s!==null&&r(s)}finally{o(),a(),c()}}),g.finished.finally(function(){for(var s=0;s<m.length;s++)m[s].cancel();d.__reactViewTransition===g&&(d.__reactViewTransition=null),i()}),g}catch{return o(),a(),c(),null}}function lo(e,t){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+t+")"}lo.prototype.animate=function(e,t){return t=typeof t=="number"?{duration:t}:$({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)};lo.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),o=[],a=0;a<n.length;a++){var l=n[a].effect;l!==null&&l.target===e&&l.pseudoElement===t&&o.push(n[a])}return o};lo.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function hm(e){return{name:e,group:new lo("group",e),imagePair:new lo("image-pair",e),old:new lo("old",e),new:new lo("new",e)}}function dt(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}dt.prototype.addEventListener=function(e,t,n){var o=null,a=null;if(!(n!=null&&typeof n!="boolean"&&(o=n.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var l=this._eventListeners;if(ym(l,e,t,n)===-1){var c=this,i=t;n!=null&&typeof n!="boolean"&&n.once===!0&&(i=function(r){c.removeEventListener(e,t,n),typeof t=="function"?t.call(this,r):t.handleEvent(r)}),o!==null&&(a=c.removeEventListener.bind(c,e,t,n),o.addEventListener("abort",a,{once:!0}),a=o.removeEventListener.bind(o,"abort",a)),o=pa(n),l.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:i,cleanup:a}),We(this._fragmentFiber.child,!1,ly,e,i,o)}this._eventListeners=l}};function ly(e,t,n,o){return xe(e).addEventListener(t,n,o),!1}dt.prototype.removeEventListener=function(e,t,n){var o=this._eventListeners;if(o!==null&&(t=ym(o,e,t,n),t!==-1)){var a=o[t];n=a.attachedListener;var l=a.cleanup;a=pa(a.optionsOrUseCapture),We(this._fragmentFiber.child,!1,cy,e,n,a),o.splice(t,1),l!==null&&l()}};function cy(e,t,n,o){return xe(e).removeEventListener(t,n,o),!1}function pa(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function kb(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function ym(e,t,n,o){if(e.length===0)return-1;o=kb(o);for(var a=0;a<e.length;a++){var l=e[a];if(l.type===t&&l.listener===n&&kb(l.optionsOrUseCapture)===o)return a}return-1}dt.prototype.dispatchEvent=function(e){var t=xo(this._fragmentFiber);if(t===null)return!0;t=xe(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var o=t.nodeType===9?t.createComment(""):document.createTextNode("");if(n)for(var a=0;a<n.length;a++){var l=n[a];o.addEventListener(l.type,l.attachedListener,pa(l.optionsOrUseCapture))}if(t.appendChild(o),e=o.dispatchEvent(e),n)for(a=0;a<n.length;a++)l=n[a],o.removeEventListener(l.type,l.attachedListener,pa(l.optionsOrUseCapture));return t.removeChild(o),e}return t.dispatchEvent(e)};dt.prototype.focus=function(e){We(this._fragmentFiber.child,!0,xm,e,void 0,void 0)};function xm(e,t){return e.tag===6?!1:(e=xe(e),hy(e,t))}dt.prototype.focusLast=function(e){var t=[];We(this._fragmentFiber.child,!0,Cd,t,void 0,void 0);for(var n=t.length-1;0<=n&&!xm(t[n],e);n--);};function Cd(e,t){return t.push(e),!1}dt.prototype.blur=function(){var e=xo(this._fragmentFiber);e!==null&&(e=xe(e),e=ml(e).activeElement,e!==null&&We(this._fragmentFiber.child,!1,iy,e,void 0,void 0))};function iy(e,t){return e.tag===6?!1:(e=xe(e),e===t||e.contains(t)?(t.blur(),!0):!1)}dt.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),We(this._fragmentFiber.child,!1,ry,e,void 0,void 0)};function ry(e,t){return e.tag===6||(e=xe(e),t.observe(e)),!1}dt.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),We(this._fragmentFiber.child,!1,uy,e,void 0,void 0);for(var n=t=0;n<_t.length;n++){var o=_t[n];o.fragmentInstance===this&&o.observer===e?e.unobserve(o.instance):_t[t++]=o}_t.length=t}};function uy(e,t){return e.tag===6||(e=xe(e),t.unobserve(e)),!1}var _t=[],Nr=!1;function dy(e,t,n){_t.push({fragmentInstance:e,observer:t,instance:n}),Nr||(Nr=!0,yy(function(){Nr=!1;var o=_t;_t=[];for(var a=0;a<o.length;a++){var l=o[a];l.observer.unobserve(l.instance)}}))}dt.prototype.getClientRects=function(){var e=[];return We(this._fragmentFiber.child,!1,fy,e,void 0,void 0),e};function fy(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=xe(e),t.push.apply(t,e.getClientRects());return!1}dt.prototype.getRootNode=function(e){var t=xo(this._fragmentFiber);return t===null?this:xe(t).getRootNode(e)};dt.prototype.compareDocumentPosition=function(e){var t=xo(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];We(this._fragmentFiber.child,!1,Cd,n,void 0,void 0);var o=xe(t);if(n.length===0){if(n=o,es(this._fragmentFiber)){e:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break e}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var a=o=n.compareDocumentPosition(e);return n===e?a=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=Vb(t)[1],n===null?a=Node.DOCUMENT_POSITION_PRECEDING:(e=xe(n).compareDocumentPosition(e),a=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),a|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=xe(n[0]),a=xe(n[n.length-1]);var l=es(this._fragmentFiber)?t.parentElement:o;if(l==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=l.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,l=l.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_CONTAINED_BY;var c=t.compareDocumentPosition(e),i=a.compareDocumentPosition(e),r=c&Node.DOCUMENT_POSITION_CONTAINED_BY||i&Node.DOCUMENT_POSITION_CONTAINED_BY;return i=o&&l&&c&Node.DOCUMENT_POSITION_FOLLOWING&&i&Node.DOCUMENT_POSITION_PRECEDING,t=o&&t===e||l&&a===e||r||i?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&t===e||!l&&a===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:c,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||sy(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function sy(e,t,n,o,a){var l=ao(a);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!l)e:{for(;l!==null;){if(l.tag===7&&(l===t||l.alternate===t)){n=!0;break e}l=l.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(l===null)return l=a.ownerDocument,a===l||a===l.documentElement||a===l.body;e:{for(l=t,t=xo(t);l!==null;){if(!(l.tag!==5&&l.tag!==3&&l.tag!==27||l!==t&&l.alternate!==t)){l=!0;break e}l=l.return}l=!1}return l}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!l)&&!(t=l===n)&&(t=_r(n,l,ts),t===null?t=!1:(We(t,!0,Vp,l,n),l=Lo,Lo=null,t=l!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!l)&&!(t=l===o)&&(t=_r(o,l,ts),t===null?t=!1:(We(t,!0,Gp,l,o),l=Lo,Ar=Lo=null,t=l!==null)),t):!1}function Sb(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}dt.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(y(566));var t=[];We(this._fragmentFiber.child,!1,Cd,t,void 0,void 0);var n=e!==!1;if(t.length===0){var o=Vb(this._fragmentFiber);if(o=n?o[1]||o[0]||xo(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){e=xe(o),Sb(e,n);return}if(o=xe(o),o.nodeType!==9){if(o.nodeType===11){n="host"in o?o.host:null,n!==null&&n.scrollIntoView(e);return}o.scrollIntoView(e)}}for(o=n?t.length-1:0;o!==(n?-1:t.length);){var a=t[o];a.tag===6?(a=xe(a),Sb(a,n)):xe(a).scrollIntoView(e),o+=n?-1:1}};function by(e,t){return e=xe(e),km(e,t),!1}function km(e,t){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(t)}function Sm(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.addEventListener(a.type,a.attachedListener,pa(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){for(var c=0,i=0;i<_t.length;i++){var r=_t[i];(r.fragmentInstance!==t||r.observer!==l||r.instance!==e)&&(_t[c++]=r)}_t.length=c,l.observe(e)}),km(e,t))}function gy(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.removeEventListener(a.type,a.attachedListener,pa(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){typeof l.rootMargin=="string"?dy(t,l,e):l.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function Hu(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Hu(n),ii(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function vy(e,t,n,o){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[El])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var l=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=Tt(e.nextSibling),e===null)break}return null}function my(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Tt(e.nextSibling),e===null))return null;return e}function Tm(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Tt(e.nextSibling),e===null))return null;return e}function Ru(e){return e.data==="$?"||e.data==="$~"}function Dd(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function py(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var o=function(){t(),n.removeEventListener("DOMContentLoaded",o)};n.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function Tt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Uu=null;function Tb(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Tt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function wb(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function hy(e,t){function n(){o=!0}if(e.ownerDocument.activeElement===e)return!0;var o=!1;try{e.ownerDocument.addEventListener("focus",n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener("focus",n,!0)}return o}function yy(e){hb(function(){hb(function(t){return e(t)})})}function wm(e,t,n){switch(t=ml(n),e){case"html":if(e=t.documentElement,!e)throw Error(y(452));return e;case"head":if(e=t.head,!e)throw Error(y(453));return e;case"body":if(e=t.body,!e)throw Error(y(454));return e;default:throw Error(y(451))}}function Em(e,t,n){for(var o in n){var a=n[o];n.hasOwnProperty(o)&&a!=null&&Q(e,t,o,null,J0,a)}n.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===Lt&&(e.onclick=null),ii(e)}function Or(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);ii(e)}var wt=new Map,Eb=new Set;function pl(e){if(typeof e.getRootNode=="function"){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var bn=V.d;V.d={f:xy,r:ky,D:Sy,C:Ty,L:wy,m:Ey,X:Ny,S:zy,M:Oy};function xy(){var e=bn.f(),t=ki();return e||t}function ky(e){var t=Ta(e);t!==null&&t.tag===5&&t.type==="form"?uv(t):bn.r(e)}var Na=typeof document>"u"?null:document;function zm(e,t,n){var o=Na;if(o&&typeof t=="string"&&t){var a=xt(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),Eb.has(a)||(Eb.add(a),e={rel:e,crossOrigin:n,href:t},o.querySelector(a)===null&&(t=o.createElement("link"),De(t,"link",e),we(t),o.head.appendChild(t)))}}function Sy(e){bn.D(e),zm("dns-prefetch",e,null)}function Ty(e,t){bn.C(e,t),zm("preconnect",e,t)}function wy(e,t,n){bn.L(e,t,n);var o=Na;if(o&&e&&t){var a='link[rel="preload"][as="'+xt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+xt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+xt(n.imageSizes)+'"]')):a+='[href="'+xt(e)+'"]';var l=a;switch(t){case"style":l=ha(e);break;case"script":l=Oa(e)}if(!(wt.has(l)||(e=$({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),wt.set(l,e),o.querySelector(a)!==null||t==="style"&&o.querySelector(Ml(l))||t==="script"&&o.querySelector(Cl(l))))){var c=o.createElement("link");De(c,"link",e),t==="style"&&(c[Rc]=!0,c.onload=c.onerror=function(){tg(c)}),we(c),o.head.appendChild(c)}}}function Ey(e,t){bn.m(e,t);var n=Na;if(n&&e){var o=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+xt(o)+'"][href="'+xt(e)+'"]',l=a;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=Oa(e)}if(!wt.has(l)&&(e=$({rel:"modulepreload",href:e},t),wt.set(l,e),n.querySelector(a)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Cl(l)))return}o=n.createElement("link"),De(o,"link",e),we(o),n.head.appendChild(o)}}}function zy(e,t,n){bn.S(e,t,n);var o=Na;if(o&&e){var a=Po(o).hoistableStyles,l=ha(e);t=t||"default";var c=a.get(l);if(!c){var i={loading:0,preload:null};if(c=o.querySelector(Ml(l)))i.loading=5;else{e=$({rel:"stylesheet",href:e,"data-precedence":t},n),(n=wt.get(l))&&Hd(e,n);var r=c=o.createElement("link");we(r),De(r,"link",e),r._p=new Promise(function(d,g){r.onload=d,r.onerror=g}),r.addEventListener("load",function(){i.loading|=1}),r.addEventListener("error",function(){i.loading|=2}),i.loading|=4,zc(c,t,o)}c={type:"stylesheet",instance:c,count:1,state:i},a.set(l,c)}}}function Ny(e,t){bn.X(e,t);var n=Na;if(n&&e){var o=Po(n).hoistableScripts,a=Oa(e),l=o.get(a);l||(l=n.querySelector(Cl(a)),l||(e=$({src:e,async:!0},t),(t=wt.get(a))&&Rd(e,t),l=n.createElement("script"),we(l),De(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function Oy(e,t){bn.M(e,t);var n=Na;if(n&&e){var o=Po(n).hoistableScripts,a=Oa(e),l=o.get(a);l||(l=n.querySelector(Cl(a)),l||(e=$({src:e,async:!0,type:"module"},t),(t=wt.get(a))&&Rd(e,t),l=n.createElement("script"),we(l),De(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function zb(e,t,n,o){var a=(a=Mn.current)?pl(a):null;if(!a)throw Error(y(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(n=ha(n.href),t=Po(a).hoistableStyles,o=t.get(n),o||(o={type:"style",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=ha(n.href);var l=Po(a).hoistableStyles,c=l.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,c),(l=a.querySelector(Ml(e)))?l._p||(c.instance=l,c.state.loading=5):(l=wt.get(e),l||(l={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},wt.set(e,l)),Ay(a,e,l,c.state))),t&&o===null)throw Error(y(528,""));return c}if(t&&o!==null)throw Error(y(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(n=Oa(n),t=Po(a).hoistableScripts,o=t.get(n),o||(o={type:"script",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(y(444,e))}}function ha(e){return'href="'+xt(e)+'"'}function Ml(e){return'link[rel="stylesheet"]['+e+"]"}function Nm(e){return $({},e,{"data-precedence":e.precedence,precedence:null})}function Ay(e,t,n,o){if(t=e.querySelector('link[rel="preload"][as="style"]['+t+"]")){if(t[Rc]!==!0){o.loading=1;return}}else t=e.createElement("link"),t[Rc]=!0,t.onload=t.onerror=tg.bind(null,t),De(t,"link",n),we(t),e.head.appendChild(t);o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2})}function Oa(e){return'[src="'+xt(e)+'"]'}function Cl(e){return"script[async]"+e}function Nb(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+xt(n.href)+'"]');if(o)return t.instance=o,we(o),o;var a=$({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),we(o),De(o,"style",a),zc(o,n.precedence,e),t.instance=o;case"stylesheet":a=ha(n.href);var l=e.querySelector(Ml(a));if(l)return t.state.loading|=4,t.instance=l,we(l),l;o=Nm(n),(a=wt.get(a))&&Hd(o,a),l=(e.ownerDocument||e).createElement("link"),we(l);var c=l;return c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),De(l,"link",o),t.state.loading|=4,zc(l,n.precedence,e),t.instance=l;case"script":return l=Oa(n.src),(a=e.querySelector(Cl(l)))?(t.instance=a,we(a),a):(o=n,(a=wt.get(l))&&(o=$({},n),Rd(o,a)),e=e.ownerDocument||e,a=e.createElement("script"),we(a),De(a,"link",o),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(y(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,zc(o,n.precedence,e));return t.instance}function zc(e,t,n){for(var o=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=o.length?o[o.length-1]:null,l=a,c=0;c<o.length;c++){var i=o[c];if(i.dataset.precedence===t)l=i;else if(l!==a)break}l?l.parentNode.insertBefore(e,l.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Hd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Rd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Nc=null;function Ob(e,t,n){if(Nc===null){var o=new Map,a=Nc=new Map;a.set(n,o)}else a=Nc,o=a.get(n),o||(o=new Map,a.set(n,o));if(o.has(e))return o;for(o.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var l=n[a];if(!(l[El]||l[Ae]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var c=l.getAttribute(t)||"";c=e+c;var i=o.get(c);i?i.push(l):o.set(c,[l])}}return o}function Bu(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function _y(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Ab(e,t){return e==="img"&&t.src!=null&&t.src!==""&&t.onLoad==null&&t.loading!=="lazy"}function Om(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Am(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function _b(e,t){typeof t.decode=="function"&&(e.imgCount++,t.complete||(e.imgBytes+=Am(t),e.suspenseyImages.push(t)),e=Dy.bind(e),t.decode().then(e,e))}function My(e,t,n,o){if(n.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=ha(o.href),l=t.querySelector(Ml(a));if(l){t=l._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=hl.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=l,we(l);return}l=t.ownerDocument||t,o=Nm(o),(a=wt.get(a))&&Hd(o,a),l=l.createElement("link"),we(l);var c=l;c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),De(l,"link",o),n.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=hl.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Oc=0;function Cy(e,t){return e.stylesheets&&e.count===0&&Ac(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var o=setTimeout(function(){if(e.stylesheets&&Ac(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+t);0<e.imgBytes&&Oc===0&&(Oc=62500*F0());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Ac(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>Oc?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(a)}}:null}function _m(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)Ac(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function hl(){this.count--,_m(this)}function Dy(){this.imgCount--,_m(this)}var ai=null;function Ac(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ai=new Map,t.forEach(Hy,e),ai=null,hl.call(e))}function Hy(e,t){if(!(t.state.loading&4)){var n=ai.get(e);if(n)var o=n.get(null);else{n=new Map,ai.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<a.length;l++){var c=a[l];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),o=c)}o&&n.set(null,o)}a=t.instance,c=a.getAttribute("data-precedence"),l=n.get(c)||o,l===o&&n.set(null,a),n.set(c,a),this.count++,o=hl.bind(this),a.addEventListener("load",o),a.addEventListener("error",o),l?l.parentNode.insertBefore(a,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var ya={$$typeof:Yt,Provider:null,Consumer:null,_currentValue:co,_currentValue2:co,_threadCount:0};function Ry(e,t,n,o,a,l,c,i,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=nr(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=nr(0),this.hiddenUpdates=nr(null),this.identifierPrefix=o,this.onUncaughtError=a,this.onCaughtError=l,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.transitionTypes=null,this.incompleteTransitions=new Map}function Mm(e,t,n,o,a,l,c,i,r,d,g,m){return e=new Ry(e,t,n,c,r,d,g,m,i),t=1,l===!0&&(t|=24),l=$e(3,null,null,t),e.current=l,l.stateNode=e,t=td(),t.refCount++,e.pooledCache=t,t.refCount++,l.memoizedState={element:o,isDehydrated:n,cache:t},ad(l),e}function Cm(e){return e?(e=$o,e):$o}function Dm(e,t,n,o,a,l){a=Cm(a),o.context===null?o.context=a:o.pendingContext=a,o=Dn(t),o.payload={element:n},l=l===void 0?null:l,l!==null&&(o.callback=l),n=Hn(e,o,t),n!==null&&(Fe(n,e,t),Fa(n,e,t))}function Mb(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ud(e,t){Mb(e,t),(e=e.alternate)&&Mb(e,t)}function Hm(e){if(e.tag===13||e.tag===31){var t=To(e,67108864);t!==null&&Fe(t,e,67108864),Ud(e,67108864)}}function Cb(e){if(e.tag===13||e.tag===31){var t=rt();t=Gu(t);var n=To(e,t);n!==null&&Fe(n,e,t),Ud(e,t)}}var xa=!0;function Uy(e,t,n,o){var a=_.T;_.T=null;var l=V.p;try{V.p=2,Bd(e,t,n,o)}finally{V.p=l,_.T=a}}function By(e,t,n,o){var a=_.T;_.T=null;var l=V.p;try{V.p=8,Bd(e,t,n,o)}finally{V.p=l,_.T=a}}function Bd(e,t,n,o){if(xa){var a=qu(o);if(a===null)Er(e,t,o,li,n),Db(e,o);else if(jy(a,e,t,n,o))o.stopPropagation();else if(Db(e,o),t&4&&-1<qy.indexOf(e)){for(;a!==null;){var l=Ta(a);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var c=to(l.pendingLanes);if(c!==0){var i=l;for(i.pendingLanes|=2,i.entangledLanes|=2;c;){var r=1<<31-it(c);i.entanglements[1]|=r,c&=~r}Jt(l),(L&6)===0&&(Pc=lt()+500,_l(0,!1))}}break;case 31:case 13:i=To(l,2),i!==null&&Fe(i,l,2),ki(),Ud(l,2)}if(l=qu(o),l===null&&Er(e,t,o,li,n),l===a)break;a=l}a!==null&&o.stopPropagation()}else Er(e,t,o,null,n)}}function qu(e){return e=Zu(e),qd(e)}var li=null;function qd(e){if(li=null,e=ao(e),e!==null){var t=kl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=jb(t),e!==null)return e;e=null}else if(n===31){if(e=Yb(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return li=e,null}function Rm(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Ip()){case Zb:return 2;case Kb:return 8;case Hc:case Pp:return 32;case Jb:return 268435456;default:return 32}default:return 32}}var ju=!1,qn=null,jn=null,Yn=null,yl=new Map,xl=new Map,wn=[],qy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Db(e,t){switch(e){case"focusin":case"focusout":qn=null;break;case"dragenter":case"dragleave":jn=null;break;case"mouseover":case"mouseout":Yn=null;break;case"pointerover":case"pointerout":yl.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":xl.delete(t.pointerId)}}function ja(e,t,n,o,a,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:l,targetContainers:[a]},t!==null&&(t=Ta(t),t!==null&&Hm(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function jy(e,t,n,o,a){switch(t){case"focusin":return qn=ja(qn,e,t,n,o,a),!0;case"dragenter":return jn=ja(jn,e,t,n,o,a),!0;case"mouseover":return Yn=ja(Yn,e,t,n,o,a),!0;case"pointerover":var l=a.pointerId;return yl.set(l,ja(yl.get(l)||null,e,t,n,o,a)),!0;case"gotpointercapture":return l=a.pointerId,xl.set(l,ja(xl.get(l)||null,e,t,n,o,a)),!0}return!1}function Um(e){var t=ao(e.target);if(t!==null){var n=kl(t);if(n!==null){if(t=n.tag,t===13){if(t=jb(n),t!==null){e.blockedOn=t,ls(e.priority,function(){Cb(n)});return}}else if(t===31){if(t=Yb(n),t!==null){e.blockedOn=t,ls(e.priority,function(){Cb(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function _c(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=qu(e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);Vr=o,n.target.dispatchEvent(o),Vr=null}else return t=Ta(n),t!==null&&Hm(t),e.blockedOn=n,!1;t.shift()}return!0}function Hb(e,t,n){_c(e)&&n.delete(t)}function Yy(){ju=!1,qn!==null&&_c(qn)&&(qn=null),jn!==null&&_c(jn)&&(jn=null),Yn!==null&&_c(Yn)&&(Yn=null),yl.forEach(Hb),xl.forEach(Hb)}function dc(e,t){e.blockedOn===t&&(e.blockedOn=null,ju||(ju=!0,ke.unstable_scheduleCallback(ke.unstable_NormalPriority,Yy)))}var fc=null;function Rb(e){fc!==e&&(fc=e,ke.unstable_scheduleCallback(ke.unstable_NormalPriority,function(){fc===e&&(fc=null);for(var t=0;t<e.length;t+=3){var n=e[t],o=e[t+1],a=e[t+2];if(typeof o!="function"){if(qd(o||n)===null)continue;break}var l=Ta(n);l!==null&&(e.splice(t,3),t-=3,au(l,{pending:!0,data:a,method:n.method,action:o},o,a))}}))}function ka(e){function t(r){return dc(r,e)}qn!==null&&dc(qn,e),jn!==null&&dc(jn,e),Yn!==null&&dc(Yn,e),yl.forEach(t),xl.forEach(t);for(var n=0;n<wn.length;n++){var o=wn[n];o.blockedOn===e&&(o.blockedOn=null)}for(;0<wn.length&&(n=wn[0],n.blockedOn===null);)Um(n),n.blockedOn===null&&wn.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(o=0;o<n.length;o+=3){var a=n[o],l=n[o+1],c=a[Ie]||null;if(typeof l=="function")c||Rb(n);else if(c){var i=null;if(l&&l.hasAttribute("formAction")){if(a=l,c=l[Ie]||null)i=c.formAction;else if(qd(a)!==null)continue}else i=c.action;typeof i=="function"?n[o+1]=i:(n.splice(o,3),o-=3),Rb(n)}}}function Bm(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),o||setTimeout(n,20)}function n(){if(!o&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function jd(e){this._internalRoot=e}wi.prototype.render=jd.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(y(409));var n=t.current,o=rt();Dm(n,o,e,t,null,null)};wi.prototype.unmount=jd.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Dm(e.current,2,null,e,null,null),ki(),t[Sa]=null}};function wi(e){this._internalRoot=e}wi.prototype.unstable_scheduleHydration=function(e){if(e){var t=eg();e={blockedOn:null,target:e,priority:t};for(var n=0;n<wn.length&&t!==0&&t<wn[n].priority;n++);wn.splice(n,0,e),n===0&&Um(e)}};var Ub=Bb.version;if(Ub!=="19.3.0")throw Error(y(527,Ub,"19.3.0"));V.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(y(188)):(e=Object.keys(e).join(","),Error(y(268,e)));return e=Lp(t),e=e!==null?Lb(e):null,e=e===null?null:e.stateNode,e};var Ly={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:_,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Ya=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Ya.isDisabled&&Ya.supportsFiber))try{Sl=Ya.inject(Ly),ct=Ya}catch{}var Ya;Ei.createRoot=function(e,t){if(!qb(e))throw Error(y(299));var n=!1,o="",a=pv,l=hv,c=yv;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(l=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=Mm(e,1,!1,null,null,n,o,null,a,l,c,Bm),e[Sa]=t.current,_d(e),new jd(t)};Ei.hydrateRoot=function(e,t,n){if(!qb(e))throw Error(y(299));var o=!1,a="",l=pv,c=hv,i=yv,r=null;return n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(l=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(i=n.onRecoverableError),n.formState!==void 0&&(r=n.formState)),t=Mm(e,1,!0,t,n??null,o,a,r,l,c,i,Bm),t.context=Cm(null),n=t.current,o=rt(),o=Gu(o),a=Dn(o),a.callback=null,Hn(n,a,o),n=o,t.current.lanes=n,wl(t,n),Jt(t),e[Sa]=t.current,_d(e),new wi(t)};Ei.version="19.3.0"});var Lm=Dt((W1,Ym)=>{"use strict";function jm(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(jm)}catch(e){console.error(e)}}jm(),Ym.exports=qm()});var Ld=`/*---------------------------------------------------------------------------------------------
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
`;var zi=["claude","codex","opencode","agy"];var zo=e=>typeof e=="number"&&Number.isFinite(e),pe=e=>typeof e=="boolean",M=e=>t=>typeof t=="string"&&t.length<=e,zt=e=>t=>typeof t=="string"&&e.test(t),O=e=>t=>t===void 0||e(t),$t=(...e)=>t=>typeof t=="string"&&e.includes(t),Pm=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),$n=e=>t=>Pm(t)&&Object.entries(e).every(([n,o])=>o(t[n])),st=(e,t=1e5)=>n=>Array.isArray(n)&&n.length<=t&&n.every(e);var a1=512*1024,ep=["text/plain","image/png","image/jpeg"],tp=8e3;var l1=1024*1024,np=64*1024*1024,op=["element","screenshot","recording","errors","network","page","report","css","measure","color","text"],Rl=/^\d{8}-\d{6}-[0-9a-f]{6}$/,Ni=/^[\w-]{1,40}\.[a-z0-9]{1,5}$/;function No(e){return e.vscode||e.agentmux}var vn=zt(/^[\w.-]{1,64}$/),Bl=M(np),ap=M(4096),c1={auth:{token:M(128),role:$t("browser","vscode"),origin:O(M(256))}},le=zt(/^[\w-]{1,64}$/),Ue=M(4096),Vd=$t(...op),Ul=zt(/^[A-Za-z0-9+/]*={0,2}$/),lp=$n({kind:Vd,title:M(300),detail:O(M(1e3)),text:O(M(5e6)),group:O(vn),groupIndex:O(zo),image:O(Ul),thumb:O(e=>typeof e=="string"&&e.length<=4e5&&Ul(e))}),Gd=$n({id:M(200),kind:$t("tmux","terminal","chat"),label:M(100),detail:M(300),closed:O(pe)}),Xd=O(M(tp)),Fn=st(zt(Rl),60),i1={link:{data:Bl},ping:{},"projects.get":{req:le,url:O(M(4096))},"capture.save":{req:le,project:Ue,url:O(M(4096)),browser:O(M(100)),captures:st(lp,60),send:O(M(200))},"item.send":{req:le,project:Ue,ids:Fn,target:O(M(200)),open:O(pe),prompt:Xd},"items.move":{req:le,project:Ue,ids:Fn,to:Ue},"items.get":{req:le,project:Ue},"item.thumb":{req:le,project:Ue,id:zt(Rl)},"item.remove":{req:le,project:Ue,ids:Fn},"item.restore":{req:le,project:Ue,ids:Fn},"item.content":{req:le,project:Ue,id:zt(Rl),offset:e=>Number.isSafeInteger(e)&&e>=0},"agentmux.start":{req:le,project:Ue,harness:$t(...zi)},"items.group":{req:le,project:Ue,ids:Fn},"items.ungroup":{req:le,project:Ue,group:vn},"project.pin":{req:le,project:Ue,pinned:pe}},cp=$n({path:Ue,name:M(300),vscode:pe,agentmux:pe,saved:pe,pinned:pe,targets:O(st(Gd,50)),defaultTarget:O(M(200)),harnesses:O(st($t(...zi),10)),inbox:O(pe)}),ip=$n({v:e=>e===1,id:zt(Rl),kind:Vd,title:M(300),detail:O(M(1e3)),url:O(M(4096)),time:zo,group:O(vn),groupIndex:O(zo),key:O(M(200)),source:$t("browser","vscode"),browser:O(M(100)),preview:O(M(1e3)),files:$n({file:O(zt(Ni)),text:O(zt(Ni)),thumb:O(zt(Ni))}),sentTo:st(M(200),50)}),r1={link:{data:Bl},status:{vscode:pe,peer:O(M(200)),features:O(st(M(40),50))},relink:{},pong:{},projects:{req:le,projects:st(cp,500),suggested:O(Ue)},"capture.saved":{req:le,ok:pe,ids:O(Fn),error:O(M(1e3)),sentTo:O(M(200))},"item.sent":{req:le,ok:pe,sentTo:O(M(200)),error:O(M(1e3))},items:{req:le,ok:pe,items:st(ip,500),error:O(M(1e3))},started:{req:le,ok:pe,target:O(M(200)),error:O(M(1e3))},content:{req:le,ok:pe,mimeType:O($t(...ep)),size:O(zo),data:O(Ul),error:O(M(1e3))},thumb:{req:le,data:O(Ul),mimeType:O($t("image/jpeg","image/png"))},done:{req:le,ok:pe,error:O(M(1e3))}},u1={window:{id:vn,name:M(200),folders:st(ap,50),focusedAt:zo,targets:O(st(Gd,50))},link:{browser:vn,data:Bl},shutdown:{},ping:{},"run.sent":{req:le,ok:pe,sentTo:O(M(200)),error:O(M(1e3))}},rp=$n({id:vn,name:M(100),origin:M(256)}),d1={welcome:{build:M(100),leader:pe},leader:{leader:pe},browsers:{browsers:st(rp,50)},link:{browser:vn,data:Bl},gone:{browser:vn},pong:{},"run.send":{req:le,project:Ue,ids:Fn,target:M(200),prompt:Xd}};var Oi={element:"inspect",screenshot:"device-camera",recording:"record",errors:"error",network:"globe",page:"browser",report:"checklist",css:"symbol-color",measure:"symbol-ruler",color:"symbol-color",text:"note"},Ai={element:"Element",screenshot:"Screenshot",recording:"Recording",errors:"Console errors",network:"Failed requests",page:"Page context",report:"Report",css:"CSS changes",measure:"Measurements",color:"Color",text:"Text"};function _i(e,t=Date.now()){let n=Math.max(0,Math.round((t-e)/1e3));if(n<45)return"just now";let o=Math.round(n/60);if(o<60)return`${o} min ago`;let a=Math.round(o/60);return a<24?`${a} h ago`:new Date(e).toLocaleDateString()}function Qd(e){let t=[],n=new Set;for(let o of e){if(!o.group){t.push({kind:"item",key:o.id,item:o});continue}if(n.has(o.group))continue;n.add(o.group);let a=e.filter(l=>l.group===o.group).sort((l,c)=>(l.groupIndex??0)-(c.groupIndex??0)||l.time-c.time);t.push(a.length>1?{kind:"group",key:`group:${o.group}`,group:o.group,items:a}:{kind:"item",key:o.id,item:o})}return t}var Mi=e=>e.kind==="item"?[e.item.id]:e.items.map(t=>t.id);function Zd(e){if(e.every(o=>o.kind==="element"))return"Elements";let t=new Set(e.map(o=>o.title.replace(/\s+\d+\s+of\s+\d+$/,""))),[n]=t;return t.size===1&&n?n:"Screenshots"}function Kd(e){return{id:e.id,kind:e.kind,title:e.title,detail:e.detail,preview:e.preview,image:!!(e.files.thumb||e.files.file&&e.kind!=="recording"),url:e.url,time:e.time,sentTo:e.sentTo,group:e.group,groupIndex:e.groupIndex,source:e.source==="browser"?e.browser??"Browser":"VS Code"}}function Jd(e){return e.inbox?"captures without a project":[e.vscode&&"VS Code",e.agentmux&&"agentmux",!No(e)&&e.saved&&"saved",e.pinned&&"pinned"].filter(Boolean).join(" \xB7 ")}function $d(e,t){let n=e.find(a=>a.id===t),o=e.filter(a=>a!==n);return[...n?[n]:[],...o.filter(a=>!a.closed),...o.filter(a=>a.closed)]}function Aa(e){return e.closed?`${e.detail} \xB7 agentmux is closed`:e.detail}function Fd(e,t){return e?.closed?`agentmux was closed: opened it and sent to ${t}`:`Sent to ${t}`}function Ci(e){return e.kind==="chat"?"comment-discussion":e.kind==="tmux"?"terminal-tmux":"terminal"}var Wd=`/* VS Code theme variables for hosts outside VS Code (the browser extension's pages): a dark and
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
`;var Id=`/* The Inkspect design system: tokens and the shared components (buttons, fields, selects,
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
`;var Di=F(he(),1);function bt({icon:e,label:t,onClick:n,onContextMenu:o,disabled:a,active:l,spin:c,className:i}){return(0,Di.jsx)("button",{type:"button",className:["icon-button",l&&"active",i].filter(Boolean).join(" "),title:t,"aria-label":t,"aria-pressed":l,disabled:a,onClick:n,onContextMenu:o,children:(0,Di.jsx)("span",{className:`codicon codicon-${e}${c?" codicon-modifier-spin":""}`,"aria-hidden":"true"})})}var Pe=F(Ft(),1);var Yl=F(Ft(),1);function pf(e,t,n,o={}){let{align:a="start",gap:l=4,matchWidth:c=!1}=o;(0,Yl.useLayoutEffect)(()=>{if(!n)return;let i=()=>{e.current&&t.current&&_p(e.current,t.current,{align:a,gap:l,matchWidth:c})};i();let r=new ResizeObserver(i);return t.current&&r.observe(t.current),()=>r.disconnect()},[e,t,n,a,l,c])}function Vi(){let e=document.documentElement;return{width:e.clientWidth||innerWidth,height:e.clientHeight||innerHeight}}function _p(e,t,{align:n,gap:o,matchWidth:a}){let l=e.getBoundingClientRect();a&&(t.style.minWidth=`${l.width}px`);let c=Vi(),i=4;t.style.maxWidth=`${c.width-2*i}px`;let r=t.getBoundingClientRect(),d=l.bottom+o,g=d+r.height<=c.height-i,m=l.top-o-r.height,s=g||m<i?d:m,b=n==="end"?l.right-r.width:l.left;t.style.top=`${Math.max(i,Math.min(s,c.height-r.height-i))}px`,t.style.left=`${Math.max(i,Math.min(b,c.width-r.width-i))}px`,t.dataset.side=s===d?"bottom":"top"}function Li(e,t,n){let o=e().find(Boolean)?.getRootNode(),a=o instanceof ShadowRoot?o:void 0,l=r=>e().some(d=>d&&r.composedPath().includes(d)),c=r=>{a&&r.composedPath().includes(a.host)||l(r)||n(r)},i=r=>{l(r)||n(r)};return window.addEventListener(t,c,!0),a?.addEventListener(t,i,!0),()=>{window.removeEventListener(t,c,!0),a?.removeEventListener(t,i,!0)}}var _a,Mp=e=>{let t=e.composedPath()[0];if(e.button!==0){_a=void 0;return}t instanceof Element&&(_a={element:t.closest('button, [role="button"], a')??t,at:performance.now()})};typeof window<"u"&&window.addEventListener("pointerdown",Mp,!0);function hf(){return _a&&performance.now()-_a.at<1e3?_a.element:void 0}function Cp(e){let t=e.getRootNode(),n=[window];t instanceof ShadowRoot&&n.push(t);let o=c=>{c.composedPath().includes(e)&&(c.stopPropagation(),c.preventDefault(),a())},a=()=>{clearTimeout(l);for(let c of n)c.removeEventListener("click",o,!0)},l=setTimeout(a,1e3);for(let c of n)c.addEventListener("click",o,!0)}function yf(e,t,n,o){return Li(e,"pointerdown",a=>{o?.(a)||(t&&a.composedPath().includes(t)&&Cp(t),n(a))})}function xf(e,t,n){(0,Yl.useEffect)(()=>{if(!t)return;let o=()=>e.map(r=>r.current),a=Li(o,"pointerdown",()=>n("outside")),l=Li(o,"scroll",()=>n("window")),c=r=>{r.key==="Escape"&&(r.preventDefault(),r.stopPropagation(),n("escape"))},i=()=>n("window");return window.addEventListener("keydown",c,!0),window.addEventListener("blur",i),window.addEventListener("resize",i),()=>{a(),l(),window.removeEventListener("keydown",c,!0),window.removeEventListener("blur",i),window.removeEventListener("resize",i)}},[t,n])}function ce(...e){return e.filter(Boolean).join(" ")}function kf(e){let t=e?.getRootNode();return t instanceof ShadowRoot?t:document.body}var _o=F(he(),1);function Wn({variant:e="secondary",size:t="md",icon:n,iconEnd:o,loading:a,className:l,children:c,disabled:i,type:r="button",...d}){let g=a?"loading":n;return(0,_o.jsxs)("button",{type:r,className:ce("button",e,t==="sm"&&"small",l),disabled:i||a,"aria-busy":a||void 0,...d,children:[g&&(0,_o.jsx)("span",{className:ce("codicon",`codicon-${g}`,a&&"codicon-modifier-spin"),"aria-hidden":"true"}),c!==void 0&&(0,_o.jsx)("span",{className:"button-label",children:c}),o&&(0,_o.jsx)("span",{className:`codicon codicon-${o}`,"aria-hidden":"true"})]})}var gt=F(Ft(),1);var ze=F(he(),1);function Sf({menu:e,onClose:t}){let n=(0,gt.useRef)(null),[o]=(0,gt.useState)(hf);return(0,gt.useEffect)(()=>{let a=yf(()=>[n.current],o,()=>t()),l=c=>{c.key==="Escape"&&(c.preventDefault(),c.stopPropagation(),t())};return window.addEventListener("keydown",l,!0),window.addEventListener("blur",t),window.addEventListener("resize",t),()=>{a(),window.removeEventListener("keydown",l,!0),window.removeEventListener("blur",t),window.removeEventListener("resize",t)}},[t,o]),(0,ze.jsx)("div",{ref:n,className:"menu-root",onContextMenu:a=>a.preventDefault(),children:(0,ze.jsx)(Tf,{items:e.items,x:e.x,y:e.y,above:e.anchor?.top,onClose:t,focusFirst:!0})})}function Tf({items:e,x:t,y:n,onClose:o,focusFirst:a,parent:l,onBack:c,above:i}){let r=(0,gt.useRef)(null),[d,g]=(0,gt.useState)(null),m=(0,gt.useRef)(void 0);(0,gt.useLayoutEffect)(()=>{let f=r.current;if(!f)return;let u=Vi();f.style.maxWidth=`${u.width-8}px`;let v=f.getBoundingClientRect(),p=t;l&&t+v.width>u.width-4&&(p=l.left-v.width+2);let h=n;i!==void 0&&n+v.height>u.height-4&&i-v.height-2>=4&&(h=i-v.height-2),f.style.left=`${Math.max(4,Math.min(p,u.width-v.width-4))}px`,f.style.top=`${Math.max(4,Math.min(h,u.height-v.height-4))}px`,a&&f.querySelector(":scope > button:not(:disabled)")?.focus({preventScroll:!0})},[t,n,l,a,i]),(0,gt.useEffect)(()=>()=>clearTimeout(m.current),[]);let s=()=>[...r.current?.querySelectorAll(":scope > button:not(:disabled)")??[]],b=(f,u,v)=>{clearTimeout(m.current),g({index:f,rect:u.getBoundingClientRect()}),v&&setTimeout(()=>r.current?.querySelector(":scope > .menu button:not(:disabled)")?.focus({preventScroll:!0}))},x=f=>{if(f.target instanceof HTMLElement&&f.target.closest(".menu")!==r.current)return;let u=s(),v=u.indexOf(document.activeElement);if(f.key==="ArrowDown"||f.key==="ArrowUp")f.preventDefault(),u[(v+(f.key==="ArrowDown"?1:-1)+u.length)%u.length]?.focus();else if(f.key==="ArrowLeft"&&c)f.preventDefault(),f.stopPropagation(),c();else if(f.key==="ArrowRight"){let p=u[v],h=p&&e[Number(p.dataset.index)];h&&"submenu"in h&&h.submenu&&(f.preventDefault(),b(Number(p.dataset.index),p,!0))}},k=d?e[d.index]:void 0,z=k&&"submenu"in k?k.submenu?.():void 0;return(0,ze.jsxs)("div",{ref:r,className:"menu",role:"menu",style:{left:t,top:n},onKeyDown:x,children:[e.map((f,u)=>"separator"in f?(0,ze.jsx)("div",{className:"menu-separator",role:"separator"},u):"heading"in f?(0,ze.jsxs)("div",{className:"menu-heading",role:"presentation",children:[f.icon&&(0,ze.jsx)("span",{className:`codicon codicon-${f.icon}`,"aria-hidden":"true"}),(0,ze.jsx)("span",{className:"menu-heading-label",children:f.heading}),f.detail&&(0,ze.jsx)("span",{className:"menu-heading-detail",children:f.detail})]},u):(0,ze.jsxs)("button",{type:"button",role:"menuitem","data-index":u,"aria-haspopup":f.submenu?"menu":void 0,"aria-expanded":f.submenu?d?.index===u:void 0,className:`menu-item${d?.index===u?" expanded":""}${f.indent?" indented":""}`,"aria-label":f.ariaLabel,disabled:f.disabled,onPointerEnter:v=>{clearTimeout(m.current);let p=v.currentTarget;f.disabled||p.focus({preventScroll:!0}),m.current=setTimeout(()=>f.submenu?b(u,p,!1):g(null),f.submenu?120:250)},onClick:v=>{if(f.submenu){b(u,v.currentTarget,v.detail===0);return}o(),f.onSelect()},children:[f.image?(0,ze.jsx)("img",{className:"menu-image",src:f.image,alt:"",referrerPolicy:"no-referrer"}):(0,ze.jsx)("span",{className:`codicon codicon-${f.icon??"blank"}`,"aria-hidden":"true"}),(0,ze.jsx)("span",{className:"menu-label",children:f.label}),f.shortcut&&(0,ze.jsx)("span",{className:"menu-shortcut",children:f.shortcut}),f.submenu&&(0,ze.jsx)("span",{className:"codicon codicon-chevron-right menu-arrow","aria-hidden":"true"})]},u)),d&&z&&(0,ze.jsx)(Tf,{items:z.length?z:[{label:"(empty)",disabled:!0,onSelect:()=>{}}],x:d.rect.right-2,y:d.rect.top-5,parent:d.rect,onClose:o,onBack:()=>{g(null),r.current?.querySelector(`:scope > button[data-index="${d.index}"]`)?.focus()}},d.index)]})}function wf(e){let t=[];for(let o of e){let a="separator"in o,l=t.at(-1);a&&(!l||"separator"in l)||t.push(o)}let n=t.at(-1);return n&&"separator"in n&&t.pop(),t}var Ef=F(Ft(),1);var In=F(he(),1);function zf({value:e,options:t,onChange:n,label:o,iconOnly:a,size:l="md",className:c}){let i=(0,Ef.useRef)(null),r=d=>{let g={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[d.key];if(!g)return;d.preventDefault();let m=t.findIndex(b=>b.value===e),s=t[(m+g+t.length)%t.length];n(s.value),i.current?.querySelector(`[data-value="${CSS.escape(s.value)}"]`)?.focus()};return(0,In.jsx)("div",{ref:i,className:ce("segmented",`size-${l}`,c),role:"radiogroup","aria-label":o,onKeyDown:r,children:t.map(d=>{let g=d.value===e;return(0,In.jsxs)("button",{type:"button",role:"radio","aria-checked":g,"aria-label":a?d.label:void 0,title:a||d.icon?d.label:void 0,"data-value":d.value,tabIndex:g?0:-1,className:ce("segment",g&&"checked"),onClick:()=>n(d.value),children:[d.icon&&(0,In.jsx)("span",{className:`codicon codicon-${d.icon}`,"aria-hidden":"true"}),!a&&(0,In.jsx)("span",{className:"segment-label",children:d.label}),d.count!==void 0&&(0,In.jsx)("span",{className:ce("segment-count",d.tone),children:d.count})]},d.value)})})}var Mo=F(he(),1);function Co({checked:e,onChange:t,children:n,label:o,disabled:a,className:l,title:c}){return(0,Mo.jsxs)("button",{type:"button",role:"checkbox","aria-checked":e,"aria-label":n?void 0:o,title:c,disabled:a,className:ce("checkbox",e&&"on",l),onClick:()=>t(!e),children:[(0,Mo.jsx)("span",{className:"checkbox-box","aria-hidden":"true",children:e&&(0,Mo.jsx)("span",{className:"codicon codicon-check"})}),n&&(0,Mo.jsx)("span",{className:"toggle-label",children:n})]})}var mn=F(he(),1);function Nf({items:e,checked:t,onToggle:n,onOpen:o,className:a}){return(0,mn.jsx)("ul",{className:ce("thumb-picker",a),"aria-label":"Screenshots",children:e.map(l=>{let c=t.has(l.id);return(0,mn.jsxs)("li",{className:ce("thumb-picker-item",c&&"on"),title:l.label,children:[(0,mn.jsx)("button",{type:"button",className:"thumb-picker-image","aria-label":o?`Open ${l.label}`:`Include ${l.label}`,"aria-pressed":o?void 0:c,onClick:()=>o?o(l.id):n(l.id),children:l.src?(0,mn.jsx)("img",{src:l.src,alt:""}):(0,mn.jsx)("span",{className:"codicon codicon-file-media","aria-hidden":"true"})}),(0,mn.jsx)(Co,{className:"thumb-picker-check",checked:c,label:`Include ${l.label}`,onChange:()=>n(l.id)})]},l.id)})})}var S=F(he(),1),Of={elements:["element"],images:["screenshot","recording"],errors:["errors","network"],other:["page","report","css","measure","color","text"]};function _f(e){let{items:t,targets:n,defaultTarget:o,canSend:a=!0}=e,[l,c]=(0,Pe.useState)("all"),[i,r]=(0,Pe.useState)(null),[d,g]=(0,Pe.useState)(new Set),[m,s]=(0,Pe.useState)(new Set),b=(0,Pe.useMemo)(()=>{let A={all:t.length,elements:0,images:0,errors:0,other:0};for(let ne of t)for(let[me,Eo]of Object.entries(Of))Eo.includes(ne.kind)&&A[me]++;return A},[t]),x=l==="all"?t:t.filter(A=>Of[l].includes(A.kind)),k=(0,Pe.useMemo)(()=>Qd(x),[x]),z=(0,Pe.useMemo)(()=>t.reduce((A,ne)=>!A||ne.time>A.time?ne:A,void 0)?.id,[t]),f=$d(n,o),u=n.find(A=>A.id===o),v=f.filter(A=>A.kind==="tmux"),p=a&&n.length>0,h=k.filter(A=>d.has(A.key)),w=h.flatMap(Mi).filter(A=>!m.has(A)),T=A=>{let ne=new Set(m);ne.has(A)?ne.delete(A):ne.add(A),s(ne)},E=A=>{let ne=new Set(d);ne.has(A)?ne.delete(A):ne.add(A),g(ne)},q=()=>g(new Set),D=(A,ne)=>{let me=A.getBoundingClientRect();r({x:me.left,y:me.bottom+2,anchor:me,items:ne})},re=e.onOpenInAgentmux,Jn={target:u,canChoose:p&&(n.length>1||!!re&&v.length>0),sending:p,send:A=>e.onSend(A),choose:(A,ne)=>D(ne,wf(f.flatMap(me=>{let Eo=()=>e.onSend(A,me.id),N=me.kind==="chat"?me.label:`${me.label} (${Aa(me)})`;return!re||me.kind!=="tmux"?[{label:N,icon:Ci(me),onSelect:Eo}]:[{separator:!0},{heading:me.label,detail:Aa(me),icon:Ci(me)},{label:"Send",icon:"send",indent:!0,ariaLabel:`Send to ${N}`,onSelect:Eo},{label:"Send and open in agentmux",icon:"link-external",indent:!0,ariaLabel:`Send to ${N} and open it in agentmux`,onSelect:()=>re(A,me.id)},{separator:!0}]}))),copy:e.onCopy,open:e.onOpen,remove:e.onRemove,ungroup:e.onUngroup};return(0,S.jsxs)("div",{className:ce("saved",h.length>0&&"selecting",e.className),children:[(e.header||e.filters&&t.length>0)&&(0,S.jsxs)("header",{className:"saved-header",children:[e.header,e.filters&&t.length>0&&(0,S.jsx)(zf,{size:"sm",label:"Show",value:l,onChange:c,className:"saved-filter",options:[{value:"all",label:"All",icon:"list-flat",count:b.all},{value:"elements",label:"Elements",icon:"inspect",count:b.elements||void 0},{value:"images",label:"Images",icon:"file-media",count:b.images||void 0},{value:"errors",label:"Errors",icon:"error",count:b.errors||void 0,tone:b.errors?"error":void 0},{value:"other",label:"Other",icon:"ellipsis",count:b.other||void 0}]})]}),t.length===0?e.empty:k.length===0?(0,S.jsx)("p",{className:"saved-none",children:"Nothing here yet."}):(0,S.jsx)("ul",{className:"saved-list","aria-label":"Saved captures",children:k.map(A=>A.kind==="item"?(0,S.jsx)(Dp,{item:A.item,latest:A.item.id===z,thumbnail:e.thumbnails[A.item.id],actions:Jn,selected:d.has(A.key),onSelect:()=>E(A.key)},A.key):(0,S.jsx)(Hp,{group:A.group,items:A.items,latest:A.items.some(ne=>ne.id===z),thumbnails:e.thumbnails,actions:Jn,selected:d.has(A.key),onSelect:()=>E(A.key),unchecked:m,onToggle:T},A.key))}),h.length>0?(0,S.jsxs)("footer",{className:"saved-footer saved-selection",role:"toolbar","aria-label":"Selection",children:[(0,S.jsxs)("span",{className:"saved-selection-count",children:[(0,S.jsx)("span",{className:"saved-selection-badge",children:w.length}),"selected"]}),p&&(0,S.jsx)(Wn,{size:"sm",variant:"accent",icon:"send",disabled:!w.length,title:u?`Send to ${u.label}`:"Send to an agent",onClick:()=>{e.onSend(w),q()},children:"Send"}),e.onGroup&&h.length>1&&(0,S.jsx)(Wn,{size:"sm",variant:"ghost",icon:"layers",disabled:w.length<2,title:"Show them as one group, sent together",onClick:()=>{e.onGroup?.(w),q()},children:"Group"}),(0,S.jsx)(bt,{icon:"trash",label:"Remove them",onClick:()=>{e.onRemove(h.flatMap(Mi)),q()}}),(0,S.jsx)(bt,{icon:"close",label:"Clear the selection",onClick:q})]}):e.undo?(0,S.jsxs)("footer",{className:"saved-footer saved-undo",role:"status",children:[(0,S.jsxs)("span",{className:"saved-undo-text",children:[(0,S.jsx)("span",{className:"codicon codicon-trash","aria-hidden":"true"}),e.undo.label]}),(0,S.jsx)(Wn,{size:"sm",variant:"secondary",icon:"discard",onClick:e.undo.onUndo,children:"Undo"})]}):t.length>0&&(e.hint||e.onClear)&&(0,S.jsxs)("footer",{className:"saved-footer",children:[e.hint&&(0,S.jsx)("span",{className:"saved-hint",children:e.hint}),e.onClear&&(0,S.jsx)(Wn,{variant:"ghost",size:"sm",icon:"clear-all",onClick:e.onClear,children:"Clear all"})]}),i&&(0,S.jsx)(Sf,{menu:i,onClose:()=>r(null)})]})}function Mf(e){return{onClick:t=>{(t.ctrlKey||t.metaKey||t.shiftKey)&&t.target.closest("button")===null&&(t.preventDefault(),e())}}}function Cf({ids:e,label:t,sent:n,disabled:o,actions:a}){let l=(0,Pe.useRef)(null);return a.sending?(0,S.jsx)("span",{className:"saved-send-group",children:(0,S.jsxs)("span",{className:"saved-send",children:[(0,S.jsx)(Wn,{size:"sm",variant:n?"secondary":"accent",icon:n?"check":"send",disabled:o,onClick:()=>a.send(e),title:a.target?`Send to ${a.target.label}`:"Send to an agent",children:t}),a.canChoose&&(0,S.jsx)(Wn,{ref:l,size:"sm",variant:n?"secondary":"accent",icon:"chevron-down",className:"saved-send-more",disabled:o,"aria-label":"Send to\u2026",title:"Send to another agent",onClick:()=>l.current&&a.choose(e,l.current)})]})}):null}function Dp({item:e,latest:t,thumbnail:n,actions:o,selected:a,onSelect:l}){let[c,i]=(0,Pe.useState)(!1),[r,d]=(0,Pe.useState)(!1),g=e.sentTo.length>0,m=n&&!c?n:void 0,s=o.open;return(0,S.jsxs)("li",{className:ce("saved-card",`kind-${e.kind}`,t&&"latest",a&&"selected"),tabIndex:0,"aria-label":`${Ai[e.kind]}: ${e.title}`,"aria-selected":a,onDoubleClick:s&&(()=>s(e.id)),...Mf(l),onKeyDown:b=>{b.target===b.currentTarget&&(b.key==="Enter"&&o.sending?o.send([e.id]):b.key===" "?(b.preventDefault(),l()):b.key==="Delete"||b.key==="Backspace"?o.remove([e.id]):b.key==="c"&&(b.ctrlKey||b.metaKey)&&o.copy?.(e.id))},children:[(0,S.jsx)(Co,{className:"saved-card-select",checked:a,label:`Select ${e.title}`,onChange:l}),m&&(s?(0,S.jsx)("button",{type:"button",className:ce("saved-thumb",r&&"tall"),"aria-label":`Open ${e.title}`,onClick:()=>s(e.id),children:(0,S.jsx)(Af,{src:m,onBroken:()=>i(!0),onTall:d})}):(0,S.jsx)("div",{className:ce("saved-thumb","still",r&&"tall"),children:(0,S.jsx)(Af,{src:m,onBroken:()=>i(!0),onTall:d})})),(0,S.jsxs)("div",{className:"saved-card-head",children:[!m&&(0,S.jsx)("span",{className:"saved-card-icon","aria-hidden":"true",children:(0,S.jsx)("span",{className:`codicon codicon-${Oi[e.kind]}`})}),(0,S.jsxs)("div",{className:"saved-card-heading",children:[(0,S.jsxs)("div",{className:"saved-card-title-row",children:[(0,S.jsx)("span",{className:"saved-card-title",title:e.title,children:e.title}),t&&(0,S.jsx)("span",{className:"saved-card-badge",children:"Latest"})]}),(0,S.jsxs)("div",{className:"saved-card-meta",children:[(0,S.jsx)("span",{children:Ai[e.kind]}),e.detail&&(0,S.jsx)("span",{title:e.url,children:e.detail}),(0,S.jsx)("span",{children:_i(e.time)}),e.source&&(0,S.jsx)("span",{children:e.source})]})]})]}),e.preview&&!m&&(0,S.jsx)("p",{className:"saved-card-preview",children:(0,S.jsx)("span",{children:e.preview})}),(0,S.jsxs)("div",{className:"saved-card-actions",children:[(0,S.jsx)(Cf,{ids:[e.id],label:g?"Send again":"Send",sent:g,actions:o}),(0,S.jsxs)("span",{className:"saved-card-tools",children:[o.copy&&(0,S.jsx)(bt,{icon:"copy",label:"Copy",onClick:()=>o.copy?.(e.id)}),s&&(0,S.jsx)(bt,{icon:"go-to-file",label:"Open",onClick:()=>s(e.id)}),(0,S.jsx)(bt,{icon:"trash",label:"Remove",onClick:()=>o.remove([e.id])})]})]}),g&&(0,S.jsx)(Df,{agents:e.sentTo})]})}function Af({src:e,onBroken:t,onTall:n}){return(0,S.jsx)("img",{src:e,alt:"",onError:t,onLoad:o=>{let{naturalWidth:a,naturalHeight:l}=o.currentTarget;n(a>0&&l/a>1.1)}})}function Hp({group:e,items:t,latest:n,thumbnails:o,actions:a,selected:l,onSelect:c,unchecked:i,onToggle:r}){let d=t.filter(u=>!i.has(u.id)).map(u=>u.id),g=d.length===t.length,m=[...new Set(t.flatMap(u=>u.sentTo))],s=d.length>0&&d.every(u=>t.find(v=>v.id===u).sentTo.length),b=Zd(t),x=Math.max(...t.map(u=>u.time)),k=new Set(t.map(u=>u.kind)),z=k.size===1&&k.has("screenshot")?"screenshots":k.size===1&&k.has("element")?"elements":"items",f=a.open;return(0,S.jsxs)("li",{className:ce("saved-card","saved-group",n&&"latest",l&&"selected"),tabIndex:0,"aria-label":`${t.length} ${z}: ${b}`,"aria-selected":l,...Mf(c),onKeyDown:u=>{u.target===u.currentTarget&&(u.key==="Enter"&&a.sending&&d.length?a.send(d):u.key===" "?(u.preventDefault(),c()):(u.key==="Delete"||u.key==="Backspace")&&a.remove(t.map(v=>v.id)))},children:[(0,S.jsx)(Co,{className:"saved-card-select",checked:l,label:`Select ${b}`,onChange:c}),(0,S.jsxs)("div",{className:"saved-card-head",children:[(0,S.jsx)("span",{className:"saved-card-icon","aria-hidden":"true",children:(0,S.jsx)("span",{className:"codicon codicon-layers"})}),(0,S.jsxs)("div",{className:"saved-card-heading",children:[(0,S.jsxs)("div",{className:"saved-card-title-row",children:[(0,S.jsx)("span",{className:"saved-card-title",title:b,children:b}),(0,S.jsx)("span",{className:"saved-card-count",children:t.length}),n&&(0,S.jsx)("span",{className:"saved-card-badge",children:"Latest"})]}),(0,S.jsxs)("div",{className:"saved-card-meta",children:[(0,S.jsx)("span",{children:g?`${t.length} ${z}`:`${d.length} of ${t.length} checked`}),t[0].detail&&(0,S.jsx)("span",{title:t[0].url,children:t[0].detail}),(0,S.jsx)("span",{children:_i(x)}),t[0].source&&(0,S.jsx)("span",{children:t[0].source})]})]})]}),t.some(u=>u.image)?(0,S.jsx)(Nf,{className:"saved-group-thumbs",items:t.map(u=>({id:u.id,src:o[u.id],label:u.title})),checked:new Set(d),onToggle:r,onOpen:f}):(0,S.jsx)("ul",{className:"saved-group-list","aria-label":b,children:t.map(u=>(0,S.jsxs)("li",{className:ce("saved-group-row",!i.has(u.id)&&"on"),onDoubleClick:f&&(()=>f(u.id)),children:[(0,S.jsx)(Co,{checked:!i.has(u.id),label:`Include ${u.title}`,onChange:()=>r(u.id)}),(0,S.jsx)("span",{className:`codicon codicon-${Oi[u.kind]} saved-group-row-icon`,"aria-hidden":"true"}),(0,S.jsxs)("span",{className:"saved-group-row-text",children:[(0,S.jsx)("span",{className:"saved-group-row-title",title:u.title,children:u.title}),u.detail&&u.detail!==t[0].detail&&(0,S.jsx)("span",{className:"saved-group-row-detail",children:u.detail})]}),f&&(0,S.jsx)(bt,{icon:"go-to-file",label:`Open ${u.title}`,className:"small saved-group-row-open",onClick:()=>f(u.id)})]},u.id))}),(0,S.jsxs)("div",{className:"saved-card-actions",children:[(0,S.jsx)(Cf,{ids:d,label:g?`${s?"Send all again":"Send all"} ${t.length}`:`Send ${d.length} of ${t.length}`,sent:s,disabled:!d.length,actions:a}),(0,S.jsxs)("span",{className:"saved-card-tools",children:[a.ungroup&&(0,S.jsx)(bt,{icon:"list-flat",label:"Ungroup (show them one by one)",onClick:()=>a.ungroup?.(e)}),(0,S.jsx)(bt,{icon:"trash",label:"Remove the group",onClick:()=>a.remove(t.map(u=>u.id))})]})]}),m.length>0&&(0,S.jsx)(Df,{agents:m})]})}function Df({agents:e}){return(0,S.jsxs)("div",{className:"saved-card-sent",title:`Sent to ${e.join(", ")}`,children:[(0,S.jsx)("span",{className:"codicon codicon-pass-filled","aria-hidden":"true"}),(0,S.jsxs)("span",{children:["Sent to ",e.join(", ")]})]})}var Qe=F(Ft(),1),jf=F(Gi(),1);var Ne=F(he(),1);function Yf({value:e,options:t,onChange:n,label:o,title:a,placeholder:l="Select\u2026",icon:c,renderValue:i,size:r="md",appearance:d="field",disabled:g,className:m,align:s="start"}){let[b,x]=(0,Qe.useState)(!1),[k,z]=(0,Qe.useState)(-1),[f,u]=(0,Qe.useState)(null),v=(0,Qe.useRef)(null),p=(0,Qe.useRef)(null),h=(0,Qe.useRef)({text:"",at:0}),w=(0,Qe.useId)(),T=t.findIndex(N=>N.value===e),E=t[T],q=(0,Qe.useCallback)(N=>{x(!1),(N==="escape"||N==="chosen")&&v.current?.focus()},[]);xf([v,p],b,q),pf(v,p,b,{align:s,matchWidth:!0});let D=N=>N>=0&&!t[N]?.disabled,re=(N,se)=>{for(let Et=1;Et<=t.length;Et++){let ft=(N+se*Et+t.length*2)%t.length;if(D(ft))return ft}return N},Jn=(N=T)=>{z(D(N)?N:re(-1,1)),u(kf(v.current)),x(!0)},A=N=>{let se=t[N];!se||se.disabled||(q("chosen"),se.value!==e&&n(se.value))};(0,Qe.useLayoutEffect)(()=>{b&&(p.current?.querySelector(`[data-index="${k}"]`)?.scrollIntoView({block:"nearest"}),p.current?.focus({preventScroll:!0}))},[b,k]);let ne=N=>{let se=Date.now(),Et=(se-h.current.at<700?h.current.text:"")+N.toLowerCase();h.current={text:Et,at:se};let ft=b?k:T,Dl=[...t.keys()].map(Hl=>(ft+(Et.length>1?0:1)+Hl)%t.length).find(Hl=>D(Hl)&&t[Hl].label.toLowerCase().startsWith(Et));Dl!==void 0&&(b?z(Dl):t[Dl].value!==e&&n(t[Dl].value))},me=N=>{["ArrowDown","ArrowUp","Enter"," "].includes(N.key)?(N.preventDefault(),Jn()):N.key.length===1&&!N.ctrlKey&&!N.metaKey&&!N.altKey&&ne(N.key)},Eo=N=>{let Et={ArrowDown:()=>z(ft=>re(ft,1)),ArrowUp:()=>z(ft=>re(ft,-1)),Home:()=>z(re(-1,1)),End:()=>z(re(t.length,-1)),PageDown:()=>z(ft=>Math.min(re(ft,1)+7,re(t.length,-1))),PageUp:()=>z(ft=>Math.max(re(ft,-1)-7,re(-1,1))),Enter:()=>A(k)," ":()=>h.current.text&&Date.now()-h.current.at<700?ne(" "):A(k),Tab:()=>q()}[N.key];Et?(N.key!=="Tab"&&N.preventDefault(),Et()):N.key.length===1&&!N.ctrlKey&&!N.metaKey&&!N.altKey&&ne(N.key)};return(0,Ne.jsxs)(Ne.Fragment,{children:[(0,Ne.jsxs)("button",{ref:v,type:"button",className:ce("select",`size-${r}`,d==="quiet"&&"quiet",b&&"open",m),role:"combobox","aria-haspopup":"listbox","aria-expanded":b,"aria-controls":b?`${w}-list`:void 0,"aria-label":o,title:a??o,disabled:g,onClick:()=>b?q():Jn(),onKeyDown:me,children:[c&&(0,Ne.jsx)("span",{className:`codicon codicon-${c}`,"aria-hidden":"true"}),!c&&E?.icon&&(0,Ne.jsx)("span",{className:`codicon codicon-${E.icon}`,"aria-hidden":"true"}),(0,Ne.jsx)("span",{className:ce("select-value",!E&&"placeholder"),children:E?i?i(E):E.label:l}),(0,Ne.jsx)("span",{className:"codicon codicon-chevron-down select-chevron","aria-hidden":"true"})]}),b&&f&&(0,jf.createPortal)((0,Ne.jsx)("div",{ref:p,id:`${w}-list`,className:"select-list","data-ink-popup":"",role:"listbox","aria-label":o,tabIndex:-1,"aria-activedescendant":k>=0?`${w}-${k}`:void 0,onKeyDown:Eo,children:t.map((N,se)=>[N.group&&N.group!==t[se-1]?.group?(0,Ne.jsx)("div",{className:"select-group",role:"presentation",children:N.group},`g-${N.group}`):null,(0,Ne.jsxs)("div",{id:`${w}-${se}`,"data-index":se,role:"option","aria-selected":se===T,"aria-disabled":N.disabled||void 0,className:ce("select-option",se===k&&"active",se===T&&"selected",N.disabled&&"disabled"),style:N.indent?{paddingLeft:4+N.indent*14}:void 0,onPointerMove:()=>!N.disabled&&z(se),onClick:()=>A(se),children:[(0,Ne.jsx)("span",{className:`codicon codicon-${se===T?"check":"blank"} select-check`,"aria-hidden":"true"}),N.icon&&(0,Ne.jsx)("span",{className:`codicon codicon-${N.icon}`,"aria-hidden":"true"}),(0,Ne.jsx)("span",{className:"select-option-label",children:N.label}),N.detail&&(0,Ne.jsx)("span",{className:"select-option-detail",children:N.detail})]},N.value)])}),f)]})}var Re=F(Ft()),Xm=F(Lm());var Vm=`/* The side panel. The Saved list (SavedList), components and tokens come from @inkspect/shared/ui. */

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
`;var te=F(he());async function gn(e){return await chrome.runtime.sendMessage({type:"hub",request:{...e,req:crypto.randomUUID()}})??void 0}async function Gy(){let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return gn({type:"projects.get",url:e?.url?.slice(0,4096)})}var Gm=e=>gn({type:"items.get",project:e}).then(t=>t?.ok?t.items:void 0);async function Xy(e,t){let n=new Uint8Array(0),o="text/plain";for(let a=0;;){let l=await gn({type:"item.content",project:e,id:t,offset:a});if(!l?.ok||l.size===void 0||!l.data)throw new Error(l?.error??"The browser helper did not answer.");a===0&&(n=new Uint8Array(l.size)),o=l.mimeType??o;let c=Uint8Array.from(atob(l.data),i=>i.charCodeAt(0));if(!c.length&&a<l.size)throw new Error("The copy came back short.");if(n.set(c,a),a+=c.length,a>=l.size)return{bytes:n,mimeType:o}}}async function Qy(e,t){let{bytes:n,mimeType:o}=await Xy(e,t);if(o==="text/plain"){await navigator.clipboard.writeText(new TextDecoder().decode(n));return}let a=new Blob([n],{type:o});if(o!=="image/png"){let l=await createImageBitmap(a),c=new OffscreenCanvas(l.width,l.height);c.getContext("2d")?.drawImage(l,0,0),a=await c.convertToBlob({type:"image/png"})}await navigator.clipboard.write([new ClipboardItem({"image/png":a})])}var Zy=2e3,Ky=15e3;function Jy({project:e,canUndo:t,canGroup:n,canCopy:o}){let[a,l]=(0,Re.useState)(),[c,i]=(0,Re.useState)({}),[r,d]=(0,Re.useState)(),[g,m]=(0,Re.useState)(),s=No(e),b=e.targets??[],x=b.find(h=>h.id===e.defaultTarget);(0,Re.useEffect)(()=>{let h=!0,w=()=>{document.visibilityState==="visible"&&Gm(e.path).then(E=>{h&&E&&l(E)})};w();let T=setInterval(w,Zy);return document.addEventListener("visibilitychange",w),window.addEventListener("focus",w),()=>{h=!1,clearInterval(T),document.removeEventListener("visibilitychange",w),window.removeEventListener("focus",w)}},[e.path]),(0,Re.useEffect)(()=>{if(!g)return;let h=setTimeout(()=>m(void 0),Ky);return()=>clearTimeout(h)},[g]),(0,Re.useEffect)(()=>{let h=!0;for(let w of a??[])c[w.id]||!(w.files.thumb||w.files.file)||w.kind!=="recording"&&gn({type:"item.thumb",project:e.path,id:w.id}).then(T=>{if(!h||!T?.data)return;let E=`data:${T.mimeType??"image/jpeg"};base64,${T.data}`;i(q=>({...q,[w.id]:E}))});return()=>{h=!1}},[a,c,e.path]);let k=()=>{Gm(e.path).then(h=>{h&&l(h)})},z=async(h,w,T=!1)=>{d(void 0);let E=b.find(D=>D.id===(w??e.defaultTarget)),q=await gn({type:"item.send",project:e.path,ids:h,target:w,open:T});d(q?.ok?{text:`${Fd(E,q.sentTo??"the agent")}.`,tone:"ok"}:{text:q?.error??"The browser helper did not answer.",tone:"error"}),k()},f=async h=>{await gn({type:"item.remove",project:e.path,ids:h}),t&&m(h),k()},u=h=>{d(void 0),Qy(e.path,h).then(()=>d({text:"Copied.",tone:"ok"}),w=>d({text:`Could not copy: ${w.message}`,tone:"error"}))},v=h=>{gn({...h,project:e.path}).then(k)},p=(0,Re.useMemo)(()=>(a??[]).map(Kd),[a]);return a?(0,te.jsxs)(te.Fragment,{children:[(0,te.jsx)("div",{className:"sp-target",title:e.path,children:s?x?`Send goes to ${x.label} \xB7 ${Aa(x)}`:"No agent is running here.":"Nothing is open here: captures are kept, sending is off."}),r&&(0,te.jsx)("div",{className:`sp-note ${r.tone}`,role:"status",children:r.text}),(0,te.jsx)(_f,{items:p,thumbnails:c,targets:b,defaultTarget:e.defaultTarget,canSend:s,onSend:(h,w)=>{z(h,w)},onOpenInAgentmux:(h,w)=>{z(h,w,!0)},onRemove:h=>{f(h)},onCopy:o?u:void 0,onGroup:n?h=>v({type:"items.group",ids:h}):void 0,onUngroup:n?h=>v({type:"items.ungroup",group:h}):void 0,undo:g&&{label:g.length===1?"Removed 1 item":`Removed ${g.length} items`,onUndo:()=>{m(void 0),gn({type:"item.restore",project:e.path,ids:g}).then(k)}},empty:(0,te.jsxs)("div",{className:"sp-empty",children:["Nothing saved in ",e.name," yet. Capture something with the toolbar: it is saved here at once."]})})]}):(0,te.jsx)("div",{className:"sp-empty",children:"Loading\u2026"})}function $y(){let[e,t]=(0,Re.useState)({state:"connecting"}),[n,o]=(0,Re.useState)(),[a,l]=(0,Re.useState)(),c=(0,Re.useCallback)(()=>{Gy().then(o)},[]);(0,Re.useEffect)(()=>{let g=()=>{chrome.runtime.sendMessage({type:"status"}).then(x=>x&&t(x)),c()};g();let m=setInterval(g,5e3),s=()=>{l(void 0),c()},b=(x,k)=>{(k.url||k.status==="complete")&&c()};return chrome.tabs.onActivated.addListener(s),chrome.tabs.onUpdated.addListener(b),()=>{clearInterval(m),chrome.tabs.onActivated.removeListener(s),chrome.tabs.onUpdated.removeListener(b)}},[c]);let i=n?.projects??[],r=i.find(g=>g.path===a)??i.find(g=>g.path===n?.suggested)??i[0],d=!!e.projects;return(0,te.jsxs)("main",{className:"sp",children:[(0,te.jsxs)("header",{className:"sp-head",children:[(0,te.jsx)("span",{className:"sp-title",children:"Saved"}),(0,te.jsx)(bt,{icon:"refresh",label:"Refresh",onClick:c})]}),d?n?r?(0,te.jsxs)(te.Fragment,{children:[(0,te.jsxs)("div",{className:"sp-project",children:[(0,te.jsx)("span",{className:`sp-dot ${No(r)?"on":""}`,"aria-hidden":"true"}),(0,te.jsx)(Yf,{size:"sm",label:"Project",icon:r.inbox?"inbox":"folder",className:"sp-project-select",value:r.path,onChange:l,options:i.map(g=>({value:g.path,label:g.name,detail:Jd(g),icon:g.inbox?"inbox":g.pinned?"pinned":g.vscode?"vscode":"folder",group:g.inbox?"Inbox":No(g)?"Open":"Saved"}))}),!r.inbox&&(0,te.jsx)(bt,{icon:r.pinned?"pinned":"pin",label:r.pinned?`Unpin ${r.name}`:`Pin ${r.name}`,active:r.pinned,onClick:()=>{gn({type:"project.pin",project:r.path,pinned:!r.pinned}).then(c)}})]}),(0,te.jsx)(Jy,{project:r,canUndo:!!e.features?.includes("item.restore"),canGroup:!!e.features?.includes("items.group"),canCopy:!!e.features?.includes("item.content")},r.path)]}):(0,te.jsx)("div",{className:"sp-empty",children:"No projects yet: open a folder in VS Code, or start an agent in agentmux."}):(0,te.jsx)("div",{className:"sp-empty",children:"Loading\u2026"}):(0,te.jsx)("div",{className:"sp-empty",children:"Not linked with VS Code. Open VS Code with VS Code Browser: on Linux its browser helper links this browser by itself (restart the browser once); elsewhere, pair it from the Inkspect button."})]})}var Qm=document.createElement("style");Qm.textContent=[Ld,Wd,Id,Vm].join(`
`);document.head.append(Qm);document.documentElement.classList.add("ink-theme");(0,Xm.createRoot)(document.getElementById("root")).render((0,te.jsx)($y,{}));})();
