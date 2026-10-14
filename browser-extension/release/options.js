"use strict";(()=>{var Xm=Object.create;var Od=Object.defineProperty;var Qm=Object.getOwnPropertyDescriptor;var Zm=Object.getOwnPropertyNames;var Km=Object.getPrototypeOf,Jm=Object.prototype.hasOwnProperty;var ht=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var Fm=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Zm(t))!Jm.call(e,a)&&a!==n&&Od(e,a,{get:()=>t[a],enumerable:!(o=Qm(t,a))||o.enumerable});return e};var H=(e,t,n)=>(n=e!=null?Xm(Km(e)):{},Fm(t||!e||!e.__esModule?Od(n,"default",{value:e,enumerable:!0}):n,e));var os=ht(O=>{"use strict";var xi=Symbol.for("react.transitional.element"),og=Symbol.for("react.portal"),ag=Symbol.for("react.fragment"),lg=Symbol.for("react.strict_mode"),cg=Symbol.for("react.profiler"),ig=Symbol.for("react.consumer"),rg=Symbol.for("react.context"),ug=Symbol.for("react.forward_ref"),dg=Symbol.for("react.suspense"),sg=Symbol.for("react.memo"),Fd=Symbol.for("react.lazy"),fg=Symbol.for("react.activity"),bg=Symbol.for("react.view_transition"),Qd=Symbol.iterator;function pg(e){return e===null||typeof e!="object"?null:(e=Qd&&e[Qd]||e["@@iterator"],typeof e=="function"?e:null)}var Wd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},$d=Object.assign,Id={};function uo(e,t,n){this.props=e,this.context=t,this.refs=Id,this.updater=n||Wd}uo.prototype.isReactComponent={};uo.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};uo.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Pd(){}Pd.prototype=uo.prototype;function Si(e,t,n){this.props=e,this.context=t,this.refs=Id,this.updater=n||Wd}var wi=Si.prototype=new Pd;wi.constructor=Si;$d(wi,uo.prototype);wi.isPureReactComponent=!0;var Zd=Array.isArray;function ki(){}var W={H:null,A:null,T:null,S:null},es=Object.prototype.hasOwnProperty;function Ti(e,t,n){var o=n.ref;return{$$typeof:xi,type:e,key:t,ref:o!==void 0?o:null,props:n}}function vg(e,t){return Ti(e.type,t,e.props)}function Ei(e){return typeof e=="object"&&e!==null&&e.$$typeof===xi}function mg(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Kd=/\/+/g;function yi(e,t){return typeof e=="object"&&e!==null&&e.key!=null?mg(""+e.key):t.toString(36)}function gg(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(ki,ki):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function ro(e,t,n,o,a){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var c=!1;if(e===null)c=!0;else switch(l){case"bigint":case"string":case"number":c=!0;break;case"object":switch(e.$$typeof){case xi:case og:c=!0;break;case Fd:return c=e._init,ro(c(e._payload),t,n,o,a)}}if(c)return a=a(e),c=o===""?"."+yi(e,0):o,Zd(a)?(n="",c!=null&&(n=c.replace(Kd,"$&/")+"/"),ro(a,t,n,"",function(d){return d})):a!=null&&(Ei(a)&&(a=vg(a,n+(a.key==null||e&&e.key===a.key?"":(""+a.key).replace(Kd,"$&/")+"/")+c)),t.push(a)),1;c=0;var i=o===""?".":o+":";if(Zd(e))for(var r=0;r<e.length;r++)o=e[r],l=i+yi(o,r),c+=ro(o,t,n,l,a);else if(r=pg(e),typeof r=="function")for(e=r.call(e),r=0;!(o=e.next()).done;)o=o.value,l=i+yi(o,r++),c+=ro(o,t,n,l,a);else if(l==="object"){if(typeof e.then=="function")return ro(gg(e),t,n,o,a);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return c}function wl(e,t,n){if(e==null)return e;var o=[],a=0;return ro(e,o,"","",function(l){return t.call(n,l,a++)}),o}function hg(e){if(e._status===-1){var t=e._result,n=t();n.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,n.status===void 0&&(n.status="fulfilled",n.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,n.status===void 0&&(n.status="rejected",n.reason=o))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var Jd=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function ts(e){var t=W.T,n={};n.types=t!==null?t.types:null,W.T=n;try{var o=e(),a=W.S;a!==null&&a(n,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(ki,Jd)}catch(l){Jd(l)}finally{t!==null&&n.types!==null&&(t.types=n.types),W.T=t}}function ns(e){var t=W.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else ts(ns.bind(null,e))}var yg={map:wl,forEach:function(e,t,n){wl(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return wl(e,function(){t++}),t},toArray:function(e){return wl(e,function(t){return t})||[]},only:function(e){if(!Ei(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};O.Activity=fg;O.Children=yg;O.Component=uo;O.Fragment=ag;O.Profiler=cg;O.PureComponent=Si;O.StrictMode=lg;O.Suspense=dg;O.ViewTransition=bg;O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=W;O.__COMPILER_RUNTIME={__proto__:null,c:function(e){return W.H.useMemoCache(e)}};O.addTransitionType=ns;O.cache=function(e){return function(){return e.apply(null,arguments)}};O.cacheSignal=function(){return null};O.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=$d({},e.props),a=e.key;if(t!=null)for(l in t.key!==void 0&&(a=""+t.key),t)!es.call(t,l)||l==="key"||l==="__self"||l==="__source"||l==="ref"&&t.ref===void 0||(o[l]=t[l]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var c=Array(l),i=0;i<l;i++)c[i]=arguments[i+2];o.children=c}return Ti(e.type,a,o)};O.createContext=function(e){return e={$$typeof:rg,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:ig,_context:e},e};O.createElement=function(e,t,n){var o,a={},l=null;if(t!=null)for(o in t.key!==void 0&&(l=""+t.key),t)es.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(a[o]=t[o]);var c=arguments.length-2;if(c===1)a.children=n;else if(1<c){for(var i=Array(c),r=0;r<c;r++)i[r]=arguments[r+2];a.children=i}if(e&&e.defaultProps)for(o in c=e.defaultProps,c)a[o]===void 0&&(a[o]=c[o]);return Ti(e,l,a)};O.createRef=function(){return{current:null}};O.forwardRef=function(e){return{$$typeof:ug,render:e}};O.isValidElement=Ei;O.lazy=function(e){return{$$typeof:Fd,_payload:{_status:-1,_result:e},_init:hg}};O.memo=function(e,t){return{$$typeof:sg,type:e,compare:t===void 0?null:t}};O.startTransition=ts;O.unstable_useCacheRefresh=function(){return W.H.useCacheRefresh()};O.use=function(e){return W.H.use(e)};O.useActionState=function(e,t,n){return W.H.useActionState(e,t,n)};O.useCallback=function(e,t){return W.H.useCallback(e,t)};O.useContext=function(e){return W.H.useContext(e)};O.useDebugValue=function(){};O.useDeferredValue=function(e,t){return W.H.useDeferredValue(e,t)};O.useEffect=function(e,t){return W.H.useEffect(e,t)};O.useEffectEvent=function(e){return W.H.useEffectEvent(e)};O.useId=function(){return W.H.useId()};O.useImperativeHandle=function(e,t,n){return W.H.useImperativeHandle(e,t,n)};O.useInsertionEffect=function(e,t){return W.H.useInsertionEffect(e,t)};O.useLayoutEffect=function(e,t){return W.H.useLayoutEffect(e,t)};O.useMemo=function(e,t){return W.H.useMemo(e,t)};O.useOptimistic=function(e,t){return W.H.useOptimistic(e,t)};O.useReducer=function(e,t,n){return W.H.useReducer(e,t,n)};O.useRef=function(e){return W.H.useRef(e)};O.useState=function(e){return W.H.useState(e)};O.useSyncExternalStore=function(e,t,n){return W.H.useSyncExternalStore(e,t,n)};O.useTransition=function(){return W.H.useTransition()};O.version="19.3.0"});var et=ht((Iy,as)=>{"use strict";as.exports=os()});var rs=ht(Tl=>{"use strict";var xg=Symbol.for("react.transitional.element"),Sg=Symbol.for("react.fragment");function is(e,t,n){var o=null;if(n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:xg,type:e,key:o,ref:t!==void 0?t:null,props:n}}Tl.Fragment=Sg;Tl.jsx=is;Tl.jsxs=is});var ee=ht((t1,us)=>{"use strict";us.exports=rs()});var Os=ht(te=>{"use strict";function Di(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,a=e[o];if(0<zl(a,t))e[o]=t,e[n]=a,n=o;else break e}}function yt(e){return e.length===0?null:e[0]}function Ol(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,a=e.length,l=a>>>1;o<l;){var c=2*(o+1)-1,i=e[c],r=c+1,d=e[r];if(0>zl(i,n))r<a&&0>zl(d,i)?(e[o]=d,e[r]=n,o=r):(e[o]=i,e[c]=n,o=c);else if(r<a&&0>zl(d,n))e[o]=d,e[r]=n,o=r;else break e}}return t}function zl(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}te.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(ys=performance,te.unstable_now=function(){return ys.now()}):(Ai=Date,ks=Ai.now(),te.unstable_now=function(){return Ai.now()-ks});var ys,Ai,ks,Ut=[],tn=[],zg=1,tt=null,ze=3,Ri=!1,pa=!1,va=!1,Bi=!1,ws=typeof setTimeout=="function"?setTimeout:null,Ts=typeof clearTimeout=="function"?clearTimeout:null,xs=typeof setImmediate<"u"?setImmediate:null;function Nl(e){for(var t=yt(tn);t!==null;){if(t.callback===null)Ol(tn);else if(t.startTime<=e)Ol(tn),t.sortIndex=t.expirationTime,Di(Ut,t);else break;t=yt(tn)}}function Ui(e){if(va=!1,Nl(e),!pa)if(yt(Ut)!==null)pa=!0,po||(po=!0,bo());else{var t=yt(tn);t!==null&&Hi(Ui,t.startTime-e)}}var po=!1,ma=-1,Es=5,zs=-1;function Ns(){return Bi?!0:!(te.unstable_now()-zs<Es)}function _i(){if(Bi=!1,po){var e=te.unstable_now();zs=e;var t=!0;try{e:{pa=!1,va&&(va=!1,Ts(ma),ma=-1),Ri=!0;var n=ze;try{t:{for(Nl(e),tt=yt(Ut);tt!==null&&!(tt.expirationTime>e&&Ns());){var o=tt.callback;if(typeof o=="function"){tt.callback=null,ze=tt.priorityLevel;var a=o(tt.expirationTime<=e);if(e=te.unstable_now(),typeof a=="function"){tt.callback=a,Nl(e),t=!0;break t}tt===yt(Ut)&&Ol(Ut),Nl(e)}else Ol(Ut);tt=yt(Ut)}if(tt!==null)t=!0;else{var l=yt(tn);l!==null&&Hi(Ui,l.startTime-e),t=!1}}break e}finally{tt=null,ze=n,Ri=!1}t=void 0}}finally{t?bo():po=!1}}}var bo;typeof xs=="function"?bo=function(){xs(_i)}:typeof MessageChannel<"u"?(Mi=new MessageChannel,Ss=Mi.port2,Mi.port1.onmessage=_i,bo=function(){Ss.postMessage(null)}):bo=function(){ws(_i,0)};var Mi,Ss;function Hi(e,t){ma=ws(function(){e(te.unstable_now())},t)}te.unstable_IdlePriority=5;te.unstable_ImmediatePriority=1;te.unstable_LowPriority=4;te.unstable_NormalPriority=3;te.unstable_Profiling=null;te.unstable_UserBlockingPriority=2;te.unstable_cancelCallback=function(e){e.callback=null};te.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Es=0<e?Math.floor(1e3/e):5};te.unstable_getCurrentPriorityLevel=function(){return ze};te.unstable_next=function(e){switch(ze){case 1:case 2:case 3:var t=3;break;default:t=ze}var n=ze;ze=t;try{return e()}finally{ze=n}};te.unstable_requestPaint=function(){Bi=!0};te.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=ze;ze=e;try{return t()}finally{ze=n}};te.unstable_scheduleCallback=function(e,t,n){var o=te.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=n+a,e={id:zg++,callback:t,priorityLevel:e,startTime:n,expirationTime:a,sortIndex:-1},n>o?(e.sortIndex=n,Di(tn,e),yt(Ut)===null&&e===yt(tn)&&(va?(Ts(ma),ma=-1):va=!0,Hi(Ui,n-o))):(e.sortIndex=a,Di(Ut,e),pa||Ri||(pa=!0,po||(po=!0,bo()))),e};te.unstable_shouldYield=Ns;te.unstable_wrapCallback=function(e){var t=ze;return function(){var n=ze;ze=t;try{return e.apply(this,arguments)}finally{ze=n}}}});var As=ht((x1,Cs)=>{"use strict";Cs.exports=Os()});var Ds=ht(Ne=>{"use strict";var Ng=et();function Ms(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function nn(){}var Ce={d:{f:nn,r:function(){throw Error(Ms(522))},D:nn,C:nn,L:nn,m:nn,X:nn,S:nn,M:nn},p:0,findDOMNode:null},Og=Symbol.for("react.portal"),Cg=Symbol.for("react.recoverable"),_s=Symbol.for("react.optimistic_key");function Ag(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Og,key:o==null?null:o===_s?_s:""+o,children:e,containerInfo:t,implementation:n}}var ga=Ng.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Cl(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Ne.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Ce;Ne.browser=function(e){return{$$typeof:Cg,_reason:e}};Ne.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(Ms(299));return Ag(e,t,null,n)};Ne.flushSync=function(e){var t=ga.T,n=Ce.p;try{if(ga.T=null,Ce.p=2,e)return e()}finally{ga.T=t,Ce.p=n,Ce.d.f()}};Ne.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Ce.d.C(e,t))};Ne.prefetchDNS=function(e){typeof e=="string"&&Ce.d.D(e)};Ne.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,o=Cl(n,t.crossOrigin),a=typeof t.integrity=="string"?t.integrity:void 0,l=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Ce.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:o,integrity:a,fetchPriority:l}):n==="script"&&Ce.d.X(e,{crossOrigin:o,integrity:a,fetchPriority:l,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Ne.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=Cl(t.as,t.crossOrigin);Ce.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}}else t==null&&Ce.d.M(e)};Ne.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,o=Cl(n,t.crossOrigin);Ce.d.L(e,n,{crossOrigin:o,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Ne.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=Cl(t.as,t.crossOrigin);Ce.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}else Ce.d.m(e)};Ne.requestFormReset=function(e){Ce.d.r(e)};Ne.unstable_batchedUpdates=function(e,t){return e(t)};Ne.useFormState=function(e,t,n){return ga.H.useFormState(e,t,n)};Ne.useFormStatus=function(){return ga.H.useHostTransitionStatus()};Ne.version="19.3.0"});var Us=ht((w1,Bs)=>{"use strict";function Rs(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Rs)}catch(e){console.error(e)}}Rs(),Bs.exports=Ds()});var wm=ht(di=>{"use strict";var be=As(),Sb=et(),_g=Us();function h(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function wb(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function al(e){for(var t=e,n=t;n&&!n.alternate;)t=n,(t.flags&4098)!==0&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function Tb(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Eb(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Hs(e){if(al(e)!==e)throw Error(h(188))}function Mg(e){var t=e.alternate;if(!t){if(t=al(e),t===null)throw Error(h(188));return t!==e?null:e}for(var n=e,o=t;;){var a=n.return;if(a===null)break;var l=a.alternate;if(l===null){if(o=a.return,o!==null){n=o;continue}break}if(a.child===l.child){for(l=a.child;l;){if(l===n)return Hs(a),e;if(l===o)return Hs(a),t;l=l.sibling}throw Error(h(188))}if(n.return!==o.return)n=a,o=l;else{for(var c=!1,i=a.child;i;){if(i===n){c=!0,n=a,o=l;break}if(i===o){c=!0,o=a,n=l;break}i=i.sibling}if(!c){for(i=l.child;i;){if(i===n){c=!0,n=l,o=a;break}if(i===o){c=!0,o=l,n=a;break}i=i.sibling}if(!c)throw Error(h(189))}}if(n.alternate!==o)throw Error(h(190))}if(n.tag!==3)throw Error(h(188));return n.stateNode.current===n?e:t}function zb(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=zb(e),t!==null)return t;e=e.sibling}return null}function qe(e,t,n,o,a,l){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,o,a,l)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&qe(e.child,t,n,o,a,l))return!0;e=e.sibling}return!1}function oo(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function Ls(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return t}function Nb(e){var t=[null,null],n=oo(e);return n===null||Ob(t,e,n.child,{foundSelf:!1}),t}function Ob(e,t,n,o){for(;n!==null;){if(n===t)o.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(o.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&Ob(e,t,n.child,o))return!0;n=n.sibling}return!1}function fe(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(h(559))}}var xo=null,vr=null;function Dg(e,t,n){return e===n?!0:e===t?(xo=e,!0):!1}function Rg(e,t,n){return e===n?(vr=e,!1):e===t?(vr!==null&&(xo=e),!0):!1}function qs(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function mr(e,t,n){for(var o=0,a=e;a;a=n(a))o++;a=0;for(var l=t;l;l=n(l))a++;for(;0<o-a;)e=n(e),o--;for(;0<a-o;)t=n(t),a--;for(;o--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var F=Object.assign,Bg=Symbol.for("react.element"),Al=Symbol.for("react.transitional.element"),Ta=Symbol.for("react.portal"),So=Symbol.for("react.fragment"),Cb=Symbol.for("react.strict_mode"),gr=Symbol.for("react.profiler"),Ab=Symbol.for("react.consumer"),Et=Symbol.for("react.context"),zu=Symbol.for("react.forward_ref"),hr=Symbol.for("react.suspense"),yr=Symbol.for("react.suspense_list"),Nu=Symbol.for("react.memo"),cn=Symbol.for("react.lazy"),kr=Symbol.for("react.activity"),Ug=Symbol.for("react.legacy_hidden"),Hg=Symbol.for("react.memo_cache_sentinel"),xr=Symbol.for("react.view_transition"),Lg=Symbol.for("react.recoverable"),Ys=Symbol.iterator;function ha(e){return e===null||typeof e!="object"?null:(e=Ys&&e[Ys]||e["@@iterator"],typeof e=="function"?e:null)}var qg=Symbol.for("react.client.reference");function Sr(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===qg?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case So:return"Fragment";case gr:return"Profiler";case Cb:return"StrictMode";case hr:return"Suspense";case yr:return"SuspenseList";case kr:return"Activity";case xr:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case Ta:return"Portal";case Et:return e.displayName||"Context";case Ab:return(e._context.displayName||"Context")+".Consumer";case zu:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Nu:return t=e.displayName||null,t!==null?t:Sr(e.type)||"Memo";case cn:t=e._payload,e=e._init;try{return Sr(e(t))}catch{}}return null}var Ea=Array.isArray,N=Sb.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,V=_g.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Xn={pending:!1,data:null,method:null,action:null},wr=[],wo=-1;function Mt(e){return{current:e}}function Se(e){0>wo||(e.current=wr[wo],wr[wo]=null,wo--)}function P(e,t){wo++,wr[wo]=e.current,e.current=t}var Ct=Mt(null),Va=Mt(null),mn=Mt(null),mc=Mt(null);function gc(e,t){switch(P(mn,t),P(Va,e),P(Ct,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?tb(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=tb(t),e=Iv(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Se(Ct),P(Ct,e)}function Go(){Se(Ct),Se(Va),Se(mn)}function Tr(e){var t=e.memoizedState;t!==null&&(Po._currentValue=t.memoizedState,P(mc,e)),t=Ct.current;var n=Iv(t,e.type);t!==n&&(P(Va,e),P(Ct,n))}function hc(e){Va.current===e&&(Se(Ct),Se(Va)),mc.current===e&&(Se(mc),Po._currentValue=Xn)}var Li,js;function an(e){if(Li===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Li=t&&t[1]||"",js=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Li+e+js}var qi=!1;function Yi(e,t){if(!e||qi)return"";qi=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var m=function(){throw Error()};if(Object.defineProperty(m.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(m,[])}catch(k){var f=k}Reflect.construct(e,[],m)}else{try{m.call()}catch(k){f=k}m=!1;try{var p=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),m=!0,new e}finally{m&&(p!==void 0?Object.defineProperty(e.prototype,"props",p):delete e.prototype.props)}}}else{try{throw Error()}catch(k){f=k}(m=e())&&typeof m.catch=="function"&&m.catch(function(){})}}catch(k){if(k&&f&&typeof k.stack=="string")return[k.stack,f.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=o.DetermineComponentFrameRoot(),c=l[0],i=l[1];if(c&&i){var r=c.split(`
`),d=i.split(`
`);for(a=o=0;o<r.length&&!r[o].includes("DetermineComponentFrameRoot");)o++;for(;a<d.length&&!d[a].includes("DetermineComponentFrameRoot");)a++;if(o===r.length||a===d.length)for(o=r.length-1,a=d.length-1;1<=o&&0<=a&&r[o]!==d[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==d[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==d[a]){var b=`
`+r[o].replace(" at new "," at ");return e.displayName&&b.includes("<anonymous>")&&(b=b.replace("<anonymous>",e.displayName)),b}while(1<=o&&0<=a);break}}}finally{qi=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?an(n):""}function Yg(e,t){switch(e.tag){case 26:case 27:case 5:return an(e.type);case 16:return an("Lazy");case 13:return e.child!==t&&t!==null?an("Suspense Fallback"):an("Suspense");case 19:return an("SuspenseList");case 0:case 15:return Yi(e.type,!1);case 11:return Yi(e.type.render,!1);case 1:return Yi(e.type,!0);case 31:return an("Activity");case 30:return an("ViewTransition");default:return""}}function Vs(e){try{var t="",n=null;do t+=Yg(e,n),n=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var Er=Object.prototype.hasOwnProperty,Ou=be.unstable_scheduleCallback,ji=be.unstable_cancelCallback,jg=be.unstable_shouldYield,Vg=be.unstable_requestPaint,Je=be.unstable_now,Gg=be.unstable_getCurrentPriorityLevel,_b=be.unstable_ImmediatePriority,Mb=be.unstable_UserBlockingPriority,yc=be.unstable_NormalPriority,Xg=be.unstable_LowPriority,Db=be.unstable_IdlePriority,Qg=be.log,Zg=be.unstable_setDisableYieldValue,ll=null,Fe=null;function dn(e){if(typeof Qg=="function"&&Zg(e),Fe&&typeof Fe.setStrictMode=="function")try{Fe.setStrictMode(ll,e)}catch{}}var We=Math.clz32?Math.clz32:Fg,Kg=Math.log,Jg=Math.LN2;function Fg(e){return e>>>=0,e===0?32:31-(Kg(e)/Jg|0)|0}var _l=256,Ml=262144,Dl=4194304;function qn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Qc(e,t,n){var o=e.pendingLanes;if(o===0)return 0;var a=0,l=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var i=o&134217727;return i!==0?(o=i&~l,o!==0?a=qn(o):(c&=i,c!==0?a=qn(c):n||(n=i&~e,n!==0&&(a=qn(n))))):(i=o&~l,i!==0?a=qn(i):c!==0?a=qn(c):n||(n=o&~e,n!==0&&(a=qn(n)))),a===0?0:t!==0&&t!==a&&(t&l)===0&&(l=a&-a,n=t&-t,l>=n||l===32&&(n&4194048)!==0)?t:a}function cl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Rb(e,t){(t&8)!==0&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var o=31-We(n),a=1<<o;t|=e[o],n&=~a}return t}function Wg(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Bb(){var e=Dl;return Dl<<=1,(Dl&62914560)===0&&(Dl=4194304),e}function Vi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function il(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function $g(e,t,n,o,a,l){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var i=e.entanglements,r=e.expirationTimes,d=e.hiddenUpdates;for(n=c&~n;0<n;){var b=31-We(n),m=1<<b;i[b]=0,r[b]=-1;var f=d[b];if(f!==null)for(d[b]=null,b=0;b<f.length;b++){var p=f[b];p!==null&&(p.lane&=-536870913)}n&=~m}o!==0&&Ub(e,o,0),l!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=l&~(c&~t))}function Ub(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-We(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|n&261930}function Hb(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-We(n),a=1<<o;a&t|e[o]&t&&(e[o]|=t),n&=~a}}function Lb(e,t){var n=t&-t;return n=(n&42)!==0?1:Cu(n),(n&(e.suspendedLanes|t))!==0?0:n}function Cu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Au(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function qb(){var e=V.p;return e!==0?e:(e=window.event,e===void 0?32:km(e.type))}function Gs(e,t){var n=V.p;try{return V.p=e,t()}finally{V.p=n}}var Ft=Math.random().toString(36).slice(2),ke="__reactFiber$"+Ft,Ye="__reactProps$"+Ft,na="__reactContainer$"+Ft,Xs="__reactEvents$"+Ft,Ig="__reactListeners$"+Ft,Pg="__reactHandles$"+Ft,Qs="__reactResources$"+Ft,rl="__reactMarker$"+Ft,kc="__reactLoad$"+Ft;function Zc(e){delete e[ke],delete e[Ye],delete e[Ig],delete e[Pg]}function Vn(e){var t;if(t=e[ke])return t;for(var n=e.parentNode;n;){if(t=n[na]||n[ke]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ub(e);e!==null;){if(n=e[ke])return n;e=ub(e)}return t}e=n,n=e.parentNode}return null}function oa(e){if(e=e[ke]||e[na]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function za(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(h(33))}function Do(e){var t=e[Qs];return t||(t=e[Qs]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function me(e){e[rl]=!0}function Yb(e){e[kc]=void 0}var jb=new Set,Vb={};function ao(e,t){Xo(e,t),Xo(e+"Capture",t)}function Xo(e,t){for(Vb[e]=t,e=0;e<t.length;e++)jb.add(t[e])}var eh=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Zs={},Ks={};function th(e){return Er.call(Ks,e)?!0:Er.call(Zs,e)?!1:eh.test(e)?Ks[e]=!0:(Zs[e]=!0,!1)}var q=!1;function Js(){var e=q;return q=!1,e}function $l(e,t,n){if(th(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,n)}}function Rl(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,n)}}function Ht(e,t,n,o){if(o===null)e.removeAttribute(n);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,o)}}function Xe(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Gb(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function nh(e,t,n){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var a=o.get,l=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,l.call(this,c)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function zr(e){if(!e._valueTracker){var t=Gb(e)?"checked":"value";e._valueTracker=nh(e,t,""+e[t])}}function Xb(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Gb(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}var oh=/[\n"\\]/g;function ct(e){return e.replace(oh,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Nr(e,t,n,o,a,l,c,i){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Xe(t)):e.value!==""+Xe(t)&&(e.value=""+Xe(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?c==="number"&&e.value==t?Gi(e,Xe(e.value)):Gi(e,Xe(t)):n!=null?Gi(e,Xe(n)):o!=null&&e.removeAttribute("value"),a==null&&l!=null&&(e.defaultChecked=!!l),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"?e.name=""+Xe(i):e.removeAttribute("name")}function Qb(e,t,n,o,a,l,c,i){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),t!=null||n!=null){if(!(l!=="submit"&&l!=="reset"||t!=null)){zr(e);return}n=n!=null?""+Xe(n):"",t=t!=null?""+Xe(t):n,i||t===e.value||(e.value=t),e.defaultValue=t}o=o??a,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=i?e.checked:!!o,e.defaultChecked=!!o,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),zr(e)}function Gi(e,t){e.defaultValue!==""+t&&(e.defaultValue=""+t)}function Ro(e,t,n,o){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Xe(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function Zb(e,t,n){if(t!=null&&(t=""+Xe(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Xe(n):""}function Kb(e,t,n,o){if(t==null){if(o!=null){if(n!=null)throw Error(h(92));if(Ea(o)){if(1<o.length)throw Error(h(93));o=o[0]}n=o}n==null&&(n=""),t=n}n=Xe(t),e.defaultValue=n,o=e.textContent,o===n&&o!==""&&o!==null&&(e.value=o),zr(e)}function Qo(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var ah=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Fs(e,t,n){var o=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,n):typeof n!="number"||n===0||ah.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Jb(e,t,n){if(t!=null&&typeof t!="object")throw Error(h(62));if(e=e.style,n!=null){for(var o in n)!n.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="",q=!0);for(var a in t)o=t[a],t.hasOwnProperty(a)&&n[a]!==o&&(Fs(e,a,o),q=!0)}else for(var l in t)t.hasOwnProperty(l)&&Fs(e,l,t[l])}function _u(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var lh=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),ch=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Il(e){return ch.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function zt(){}var Or=null;function Mu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var To=null,Bo=null;function Ws(e){var t=oa(e);if(t&&(e=t.stateNode)){var n=e[Ye]||null;e:switch(e=t.stateNode,t.type){case"input":if(Nr(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+ct(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=o[Ye]||null;if(!a)throw Error(h(90));Nr(o,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)o=n[t],o.form===e.form&&Xb(o)}break e;case"textarea":Zb(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Ro(e,!!n.multiple,t,!1)}}}var Xi=!1;function Fb(e,t,n){if(Xi)return e(t,n);Xi=!0;try{var o=e(t);return o}finally{if(Xi=!1,(To!==null||Bo!==null)&&(ci(),To&&(t=To,e=Bo,Bo=To=null,Ws(t),e)))for(t=0;t<e.length;t++)Ws(e[t])}}function Ga(e,t){var n=e.stateNode;if(n===null)return null;var o=n[Ye]||null;if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(h(231,t,typeof n));return n}var Gt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Cr=!1;if(Gt)try{vo={},Object.defineProperty(vo,"passive",{get:function(){Cr=!0}}),window.addEventListener("test",vo,vo),window.removeEventListener("test",vo,vo)}catch{Cr=!1}var vo,sn=null,Du=null,Pl=null;function Wb(){if(Pl)return Pl;var e,t=Du,n=t.length,o,a="value"in sn?sn.value:sn.textContent,l=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(o=1;o<=c&&t[n-o]===a[l-o];o++);return Pl=a.slice(e,1<o?1-o:void 0)}function ec(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Bl(){return!0}function $s(){return!1}function De(e){function t(n,o,a,l,c){this._reactName=n,this._targetInst=a,this.type=o,this.nativeEvent=l,this.target=c,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Bl:$s,this.isPropagationStopped=$s,this}return F(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Bl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Bl)},persist:function(){},isPersistent:Bl}),t}var _n={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Kc=De(_n),ul=F({},_n,{view:0,detail:0}),ih=De(ul),Qi,Zi,ya,Jc=F({},ul,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ru,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ya&&(ya&&e.type==="mousemove"?(Qi=e.screenX-ya.screenX,Zi=e.screenY-ya.screenY):Zi=Qi=0,ya=e),Qi)},movementY:function(e){return"movementY"in e?e.movementY:Zi}}),Is=De(Jc),rh=F({},Jc,{dataTransfer:0}),uh=De(rh),dh=F({},ul,{relatedTarget:0}),Ki=De(dh),sh=F({},_n,{animationName:0,elapsedTime:0,pseudoElement:0}),fh=De(sh),bh=F({},_n,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ph=De(bh),vh=F({},_n,{data:0}),Ps=De(vh),mh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},gh={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},hh={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function yh(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=hh[e])?!!t[e]:!1}function Ru(){return yh}var kh=F({},ul,{key:function(e){if(e.key){var t=mh[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ec(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?gh[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ru,charCode:function(e){return e.type==="keypress"?ec(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ec(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),xh=De(kh),Sh=F({},Jc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ef=De(Sh),wh=F({},_n,{submitter:0}),Th=De(wh),Eh=F({},ul,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ru}),zh=De(Eh),Nh=F({},_n,{propertyName:0,elapsedTime:0,pseudoElement:0}),Oh=De(Nh),Ch=F({},Jc,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Ah=De(Ch),_h=F({},_n,{newState:0,oldState:0,source:0}),Mh=De(_h),Dh=[9,13,27,32],Bu=Gt&&"CompositionEvent"in window,Ca=null;Gt&&"documentMode"in document&&(Ca=document.documentMode);var Rh=Gt&&"TextEvent"in window&&!Ca,$b=Gt&&(!Bu||Ca&&8<Ca&&11>=Ca),tf=" ",nf=!1;function Ib(e,t){switch(e){case"keyup":return Dh.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Pb(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Eo=!1;function Bh(e,t){switch(e){case"compositionend":return Pb(t);case"keypress":return t.which!==32?null:(nf=!0,tf);case"textInput":return e=t.data,e===tf&&nf?null:e;default:return null}}function Uh(e,t){if(Eo)return e==="compositionend"||!Bu&&Ib(e,t)?(e=Wb(),Pl=Du=sn=null,Eo=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return $b&&t.locale!=="ko"?null:t.data;default:return null}}var Hh={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function of(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Hh[e.type]:t==="textarea"}function ep(e,t,n,o){To?Bo?Bo.push(o):Bo=[o]:To=o,t=Vc(t,"onChange"),0<t.length&&(n=new Kc("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var Aa=null,Xa=null;function Lh(e){Fv(e,0)}function Fc(e){var t=za(e);if(Xb(t))return e}function af(e,t){if(e==="change")return t}var tp=!1;Gt&&(Gt?(Hl="oninput"in document,Hl||(Ji=document.createElement("div"),Ji.setAttribute("oninput","return;"),Hl=typeof Ji.oninput=="function"),Ul=Hl):Ul=!1,tp=Ul&&(!document.documentMode||9<document.documentMode));var Ul,Hl,Ji;function lf(){Aa&&(Aa.detachEvent("onpropertychange",np),Xa=Aa=null)}function np(e){if(e.propertyName==="value"&&Fc(Xa)){var t=[];ep(t,Xa,e,Mu(e)),Fb(Lh,t)}}function qh(e,t,n){e==="focusin"?(lf(),Aa=t,Xa=n,Aa.attachEvent("onpropertychange",np)):e==="focusout"&&lf()}function Yh(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Fc(Xa)}function jh(e,t){if(e==="click")return Fc(t)}function Vh(e,t){if(e==="input"||e==="change")return Fc(t)}function Gh(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ie=typeof Object.is=="function"?Object.is:Gh;function Qa(e,t){if(Ie(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var a=n[o];if(!Er.call(t,a)||!Ie(e[a],t[a]))return!1}return!0}function Ar(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function cf(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function rf(e,t){var n=cf(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=cf(n)}}function op(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?op(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function ap(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Ar(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ar(e.document)}return t}function Uu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Xh=Gt&&"documentMode"in document&&11>=document.documentMode,zo=null,_r=null,_a=null,Mr=!1;function uf(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Mr||zo==null||zo!==Ar(o)||(o=zo,"selectionStart"in o&&Uu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),_a&&Qa(_a,o)||(_a=o,o=Vc(_r,"onSelect"),0<o.length&&(t=new Kc("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=zo)))}function Hn(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var No={animationend:Hn("Animation","AnimationEnd"),animationiteration:Hn("Animation","AnimationIteration"),animationstart:Hn("Animation","AnimationStart"),transitionrun:Hn("Transition","TransitionRun"),transitionstart:Hn("Transition","TransitionStart"),transitioncancel:Hn("Transition","TransitionCancel"),transitionend:Hn("Transition","TransitionEnd")},Fi={},lp={};Gt&&(lp=document.createElement("div").style,"AnimationEvent"in window||(delete No.animationend.animation,delete No.animationiteration.animation,delete No.animationstart.animation),"TransitionEvent"in window||delete No.transitionend.transition);function lo(e){if(Fi[e])return Fi[e];if(!No[e])return e;var t=No[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in lp)return Fi[e]=t[n];return e}var cp=lo("animationend"),ip=lo("animationiteration"),rp=lo("animationstart"),Qh=lo("transitionrun"),Zh=lo("transitionstart"),Kh=lo("transitioncancel"),up=lo("transitionend"),dp=new Map,Dr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Dr.push("scrollEnd");function mt(e,t){dp.set(e,t),ao(t,[e])}var Jh=0;function Xt(e,t){if(e.name!=null&&e.name!=="auto")return e.name;if(t.autoName!==null)return t.autoName;e=vt.identifierPrefix;var n=Jh++;return e="_"+e+"t_"+n.toString(32)+"_",t.autoName=e}function df(e){if(e==null||typeof e=="string")return e;var t=null,n=Vo;if(n!==null)for(var o=0;o<n.length;o++){var a=e[n[o]];if(a!=null){if(a==="none")return"none";t=t==null?a:t+(" "+a)}}return t??e.default}function Wt(e,t){return e=df(e),t=df(t),t==null?e==="auto"?null:e:t==="auto"?null:t}var xc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ot=[],Oo=0,Hu=0;function Wc(){for(var e=Oo,t=Hu=Oo=0;t<e;){var n=ot[t];ot[t++]=null;var o=ot[t];ot[t++]=null;var a=ot[t];ot[t++]=null;var l=ot[t];if(ot[t++]=null,o!==null&&a!==null){var c=o.pending;c===null?a.next=a:(a.next=c.next,c.next=a),o.pending=a}l!==0&&sp(n,a,l)}}function $c(e,t,n,o){ot[Oo++]=e,ot[Oo++]=t,ot[Oo++]=n,ot[Oo++]=o,Hu|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function Lu(e,t,n,o){return $c(e,t,n,o),Sc(e)}function co(e,t){return $c(e,null,null,t),Sc(e)}function sp(e,t,n){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n);for(var a=!1,l=e.return;l!==null;)l.childLanes|=n,o=l.alternate,o!==null&&(o.childLanes|=n),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(a=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,a&&t!==null&&(a=31-We(n),e=l.hiddenUpdates,o=e[a],o===null?e[a]=[t]:o.push(t),t.lane=n|536870912),l):null}function Sc(e){if(50<ja)throw ja=0,dc=null,Error(h(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Co={};function Fh(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function He(e,t,n,o){return new Fh(e,t,n,o)}function qu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function jt(e,t){var n=e.alternate;return n===null?(n=He(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function fp(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function tc(e,t,n,o,a,l){var c=0;if(o=e,typeof o=="function")qu(o)&&(c=1);else if(typeof o=="string")c=xy(e,n,Ct.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(o){case kr:return e=He(31,n,t,a),e.elementType=kr,e.lanes=l,e;case So:return Qn(n.children,a,l,t);case Cb:c=8,a|=24;break;case gr:return e=He(12,n,t,a|2),e.elementType=gr,e.lanes=l,e;case hr:return e=He(13,n,t,a),e.elementType=hr,e.lanes=l,e;case yr:return e=He(19,n,t,a),e.elementType=yr,e.lanes=l,e;case Ug:case xr:return e=a|32,e=He(30,n,t,e),e.elementType=xr,e.lanes=l,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case Et:c=10;break e;case Ab:c=9;break e;case zu:c=11;break e;case Nu:c=14;break e;case cn:c=16,o=null;break e}c=29,n=Error(h(130,e===null?"null":typeof e,"")),o=null}return t=He(c,n,t,a),t.elementType=e,t.type=o,t.lanes=l,t}function Qn(e,t,n,o){return e=He(7,e,o,t),e.lanes=n,e}function Wi(e,t,n){return e=He(6,e,null,t),e.lanes=n,e}function bp(e){var t=He(18,null,null,0);return t.stateNode=e,t}function $i(e,t,n){return t=He(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var sf=new WeakMap;function it(e,t){if(typeof e=="object"&&e!==null){var n=sf.get(e);return n!==void 0?n:(t={value:e,source:t,stack:Vs(t)},sf.set(e,t),t)}return{value:e,source:t,stack:Vs(t)}}var Ao=[],_o=0,wc=null,Za=0,at=[],lt=0,zn=null,Nt=1,Ot="";function qt(e,t){Ao[_o++]=Za,Ao[_o++]=wc,wc=e,Za=t}function pp(e,t,n){at[lt++]=Nt,at[lt++]=Ot,at[lt++]=zn,zn=e;var o=Nt;e=Ot;var a=32-We(o)-1;o&=~(1<<a),n+=1;var l=32-We(t)+a;if(30<l){var c=a-a%5;l=(o&(1<<c)-1).toString(32),o>>=c,a-=c,Nt=1<<32-We(t)+a|n<<a|o,Ot=l+e}else Nt=1<<l|n<<a|o,Ot=e}function Ic(e){e.return!==null&&(qt(e,1),pp(e,1,0))}function Yu(e){for(;e===wc;)wc=Ao[--_o],Ao[_o]=null,Za=Ao[--_o],Ao[_o]=null;for(;e===zn;)zn=at[--lt],at[lt]=null,Ot=at[--lt],at[lt]=null,Nt=at[--lt],at[lt]=null}function vp(e,t){at[lt++]=Nt,at[lt++]=Ot,at[lt++]=zn,Nt=t.id,Ot=t.overflow,zn=e}var ge=null,I=null,_=!1,gn=null,rt=!1,Rr=Error(h(519));function Nn(e){var t=Error(h(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ka(it(t,e)),Rr}function ff(e){var t=e.stateNode,n=e.type,o=e.memoizedProps;switch(t[ke]=e,t[Ye]=o,n){case"dialog":D("cancel",t),D("close",t);break;case"iframe":case"object":case"embed":D("load",t);break;case"video":case"audio":for(n=0;n<$a.length;n++)D($a[n],t);break;case"source":D("error",t);break;case"img":case"image":case"link":D("error",t),D("load",t);break;case"details":D("toggle",t);break;case"input":D("invalid",t),Qb(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":D("invalid",t);break;case"textarea":D("invalid",t),Kb(t,o.value,o.defaultValue,o.children)}n=o.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||o.suppressHydrationWarning===!0||$v(t.textContent,n)?(o.popover!=null&&(D("beforetoggle",t),D("toggle",t)),o.onScroll!=null&&D("scroll",t),o.onScrollEnd!=null&&D("scrollend",t),o.onClick!=null&&(t.onclick=zt),t=!0):t=!1,t||Nn(e,!0)}function Tc(e){for(ge=e.return;ge;)switch(ge.tag){case 5:case 31:case 13:rt=!1;return;case 27:case 3:rt=!0;return;default:ge=ge.return}}function mo(e){if(e!==ge)return!1;if(!_)return Tc(e),_=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||hu(e.type,e.memoizedProps)),n=!n),n&&I&&Nn(e),Tc(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));I=rb(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(317));I=rb(e)}else t===27?(t=I,Mn(e.type)?(e=Su,Su=null,I=e):I=t):I=ge?ut(e.stateNode.nextSibling):null;return!0}function Fn(){I=ge=null,_=!1}function Ii(){var e=gn;return e!==null&&(Be===null?Be=e:Be.push.apply(Be,e),gn=null),e}function Ka(e){gn===null?gn=[e]:gn.push(e)}var Br=Mt(null),io=null,Yt=null;function fn(e,t,n){P(Br,t._currentValue),t._currentValue=n}function Vt(e){e._currentValue=Br.current,Se(Br)}function nc(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function Ur(e,t,n,o){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var l=a.dependencies;if(l!==null){var c=a.child;l=l.firstContext;e:for(;l!==null;){var i=l;l=a;for(var r=0;r<t.length;r++)if(i.context===t[r]){l.lanes|=n,i=l.alternate,i!==null&&(i.lanes|=n),nc(l.return,n,e),o||(c=null);break e}l=i.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(h(341));c.lanes|=n,l=c.alternate,l!==null&&(l.lanes|=n),nc(c,n,e),c=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),nc(a.return,n,e),c=a.child,c=c!==null?c.sibling:null):c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function Wn(e,t,n,o){e=null;for(var a=t,l=!1;a!==null;){if(!l){if((a.flags&524288)!==0)l=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(h(387));if(c=c.memoizedProps,c!==null){var i=a.type;Ie(a.pendingProps.value,c.value)||(e!==null?e.push(i):e=[i])}}else if(a===mc.current){if(c=a.alternate,c===null)throw Error(h(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(Po):e=[Po])}a=a.return}return e!==null&&Ur(t,e,n,o),t.flags|=262144,e!==null}function Ec(e){for(e=e.firstContext;e!==null;){if(!Ie(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function $n(e){io=e,Yt=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function xe(e){return mp(io,e)}function Ll(e,t){return io===null&&$n(e),mp(e,t)}function mp(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Yt===null){if(e===null)throw Error(h(308));Yt=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Yt=Yt.next=t;return n}var Wh=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},$h=be.unstable_scheduleCallback,Ih=be.unstable_NormalPriority,re={$$typeof:Et,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function ju(){return{controller:new Wh,data:new Map,refCount:0}}function dl(e){e.refCount--,e.refCount===0&&$h(Ih,function(){e.controller.abort()})}function bf(e,t){if((e.pendingLanes&4194048)!==0){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var o=t[e];n.indexOf(o)===-1&&n.push(o)}}}var Na=null;function Ph(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var Ma=null,Hr=0,In=0,Uo=null;function e0(e,t){if(Ma===null){var n=Ma=[];Hr=0,In=vd(),Uo={status:"pending",value:void 0,then:function(o){n.push(o)}}}return Hr++,t.then(pf,pf),t}function pf(){if(--Hr===0&&(Na=null,Ma!==null)){Uo!==null&&(Uo.status="fulfilled");var e=Ma;Ma=null,In=0,Uo=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function t0(e,t){var n=[],o={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(o.status="rejected",o.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),o}var vf=N.S;N.S=function(e,t){if(Rv=Je(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&e0(e,t),Na!==null)for(var n=Wo;n!==null;)bf(n,Na),n=n.next;if(n=e.types,n!==null){for(var o=Wo;o!==null;)bf(o,n),o=o.next;if(In!==0){o=Na,o===null&&(o=Na=[]);for(var a=0;a<n.length;a++){var l=n[a];o.indexOf(l)===-1&&o.push(l)}}}vf!==null&&vf(e,t)};var Zn=Mt(null);function Vu(){var e=Zn.current;return e!==null?e:J.pooledCache}function oc(e,t){t===null?P(Zn,Zn.current):P(Zn,t.pool)}function gp(){var e=Vu();return e===null?null:{parent:re._currentValue,pool:e}}var aa=Error(h(460)),Gu=Error(h(474)),Pc=Error(h(542)),zc={then:function(){}};function mf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function hp(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(zt,zt),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,hf(e),e===void 0&&!("reason"in t)?Error(h(600)):e;default:if(typeof t.status=="string")t.then(zt,zt);else{if(e=J,e!==null&&100<e.shellSuspendCounter)throw Error(h(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=o}},function(o){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,hf(e),e}throw Kn=t,aa}}function Yn(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Kn=n,aa):n}}var Kn=null;function gf(){if(Kn===null)throw Error(h(459));var e=Kn;return Kn=null,e}function hf(e){if(e===aa||e===Pc)throw Error(h(483))}var Ho=null,Ja=0;function ql(e){var t=Ja;return Ja+=1,Ho===null&&(Ho=[]),hp(Ho,e,t)}function on(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Yl(e,t){throw t.$$typeof===Bg?Error(h(525)):(e=Object.prototype.toString.call(t),Error(h(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function yp(e){function t(v,u){if(e){var s=v.deletions;s===null?(v.deletions=[u],v.flags|=16):s.push(u)}}function n(v,u){if(!e)return null;for(;u!==null;)t(v,u),u=u.sibling;return null}function o(v){for(var u=new Map;v!==null;)v.key===null?u.set(v.index,v):u.set(v.key,v),v=v.sibling;return u}function a(v,u){return v=jt(v,u),v.index=0,v.sibling=null,v}function l(v,u,s){return v.index=s,e?(s=v.alternate,s!==null?(s=s.index,s<u?(v.flags|=2,u):s):(v.flags|=134217730,u)):(v.flags|=1048576,u)}function c(v){return e&&v.alternate===null&&(v.flags|=134217730),v}function i(v,u,s,g){return u===null||u.tag!==6?(u=Wi(s,v.mode,g),u.return=v,u):(u=a(u,s),u.return=v,u)}function r(v,u,s,g){var y=s.type;return y===So?(v=b(v,u,s.props.children,g,s.key),on(v,s),v):u!==null&&(u.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===cn&&Yn(y)===u.type)?(u=a(u,s.props),on(u,s),u.return=v,u):(u=tc(s.type,s.key,s.props,null,v.mode,g),on(u,s),u.return=v,u)}function d(v,u,s,g){return u===null||u.tag!==4||u.stateNode.containerInfo!==s.containerInfo||u.stateNode.implementation!==s.implementation?(u=$i(s,v.mode,g),u.return=v,u):(u=a(u,s.children||[]),u.return=v,u)}function b(v,u,s,g,y){return u===null||u.tag!==7?(u=Qn(s,v.mode,g,y),u.return=v,u):(u=a(u,s),u.return=v,u)}function m(v,u,s){if(typeof u=="string"&&u!==""||typeof u=="number"||typeof u=="bigint")return u=Wi(""+u,v.mode,s),u.return=v,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Al:return s=tc(u.type,u.key,u.props,null,v.mode,s),on(s,u),s.return=v,s;case Ta:return u=$i(u,v.mode,s),u.return=v,u;case cn:return u=Yn(u),m(v,u,s)}if(Ea(u)||ha(u))return u=Qn(u,v.mode,s,null),u.return=v,u;if(typeof u.then=="function")return m(v,ql(u),s);if(u.$$typeof===Et)return m(v,Ll(v,u),s);Yl(v,u)}return null}function f(v,u,s,g){var y=u!==null?u.key:null;if(typeof s=="string"&&s!==""||typeof s=="number"||typeof s=="bigint")return y!==null?null:i(v,u,""+s,g);if(typeof s=="object"&&s!==null){switch(s.$$typeof){case Al:return s.key===y?r(v,u,s,g):null;case Ta:return s.key===y?d(v,u,s,g):null;case cn:return s=Yn(s),f(v,u,s,g)}if(Ea(s)||ha(s))return y!==null?null:b(v,u,s,g,null);if(typeof s.then=="function")return f(v,u,ql(s),g);if(s.$$typeof===Et)return f(v,u,Ll(v,s),g);Yl(v,s)}return null}function p(v,u,s,g,y){if(typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint")return v=v.get(s)||null,i(u,v,""+g,y);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Al:return v=v.get(g.key===null?s:g.key)||null,r(u,v,g,y);case Ta:return v=v.get(g.key===null?s:g.key)||null,d(u,v,g,y);case cn:return g=Yn(g),p(v,u,s,g,y)}if(Ea(g)||ha(g))return v=v.get(s)||null,b(u,v,g,y,null);if(typeof g.then=="function")return p(v,u,s,ql(g),y);if(g.$$typeof===Et)return p(v,u,s,Ll(u,g),y);Yl(u,g)}return null}function k(v,u,s,g){for(var y=null,w=null,x=u,E=u=0,B=null;x!==null&&E<s.length;E++){x.index>E?(B=x,x=null):B=x.sibling;var C=f(v,x,s[E],g);if(C===null){x===null&&(x=B);break}e&&x&&C.alternate===null&&t(v,x),u=l(C,u,E),w===null?y=C:w.sibling=C,w=C,x=B}if(E===s.length)return n(v,x),_&&qt(v,E),y;if(x===null){for(;E<s.length;E++)x=m(v,s[E],g),x!==null&&(u=l(x,u,E),w===null?y=x:w.sibling=x,w=x);return _&&qt(v,E),y}for(x=o(x);E<s.length;E++)B=p(x,v,E,s[E],g),B!==null&&(e&&(C=B.alternate,C!==null&&x.delete(C.key===null?E:C.key)),u=l(B,u,E),w===null?y=B:w.sibling=B,w=B);return e&&x.forEach(function(he){return t(v,he)}),_&&qt(v,E),y}function S(v,u,s,g){if(s==null)throw Error(h(151));for(var y=null,w=null,x=u,E=u=0,B=null,C=s.next();x!==null&&!C.done;E++,C=s.next()){x.index>E?(B=x,x=null):B=x.sibling;var he=f(v,x,C.value,g);if(he===null){x===null&&(x=B);break}e&&x&&he.alternate===null&&t(v,x),u=l(he,u,E),w===null?y=he:w.sibling=he,w=he,x=B}if(C.done)return n(v,x),_&&qt(v,E),y;if(x===null){for(;!C.done;E++,C=s.next())C=m(v,C.value,g),C!==null&&(u=l(C,u,E),w===null?y=C:w.sibling=C,w=C);return _&&qt(v,E),y}for(x=o(x);!C.done;E++,C=s.next())C=p(x,v,E,C.value,g),C!==null&&(e&&(B=C.alternate,B!==null&&x.delete(B.key===null?E:B.key)),u=l(C,u,E),w===null?y=C:w.sibling=C,w=C);return e&&x.forEach(function(je){return t(v,je)}),_&&qt(v,E),y}function z(v,u,s,g){if(typeof s=="object"&&s!==null&&s.type===So&&s.key===null&&s.props.ref===void 0&&(s=s.props.children),typeof s=="object"&&s!==null){switch(s.$$typeof){case Al:e:{for(var y=s.key;u!==null;){if(u.key===y){if(y=s.type,y===So){if(u.tag===7){n(v,u.sibling),g=a(u,s.props.children),on(g,s),g.return=v,v=g;break e}}else if(u.elementType===y||typeof y=="object"&&y!==null&&y.$$typeof===cn&&Yn(y)===u.type){n(v,u.sibling),g=a(u,s.props),on(g,s),g.return=v,v=g;break e}n(v,u);break}else t(v,u);u=u.sibling}s.type===So?(g=Qn(s.props.children,v.mode,g,s.key),on(g,s),g.return=v,v=g):(g=tc(s.type,s.key,s.props,null,v.mode,g),on(g,s),g.return=v,v=g)}return c(v);case Ta:e:{for(y=s.key;u!==null;){if(u.key===y)if(u.tag===4&&u.stateNode.containerInfo===s.containerInfo&&u.stateNode.implementation===s.implementation){n(v,u.sibling),g=a(u,s.children||[]),g.return=v,v=g;break e}else{n(v,u);break}else t(v,u);u=u.sibling}g=$i(s,v.mode,g),g.return=v,v=g}return c(v);case cn:return s=Yn(s),z(v,u,s,g)}if(Ea(s))return k(v,u,s,g);if(ha(s)){if(y=ha(s),typeof y!="function")throw Error(h(150));return s=y.call(s),S(v,u,s,g)}if(typeof s.then=="function")return z(v,u,ql(s),g);if(s.$$typeof===Et)return z(v,u,Ll(v,s),g);Yl(v,s)}return typeof s=="string"&&s!==""||typeof s=="number"||typeof s=="bigint"?(s=""+s,u!==null&&u.tag===6?(n(v,u.sibling),g=a(u,s),g.return=v,v=g):(n(v,u),g=Wi(s,v.mode,g),g.return=v,v=g),c(v)):n(v,u)}return function(v,u,s,g){try{Ja=0;var y=z(v,u,s,g);return Ho=null,y}catch(x){if(x===aa||x===Pc)throw x;var w=He(29,x,null,v.mode);return w.lanes=g,w.return=v,w}}}var Pn=yp(!0),kp=yp(!1),rn=!1;function Xu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Lr(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function hn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function yn(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(j&2)!==0){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,t=Sc(e),sp(e,null,n),t}return $c(e,o,t,n),Sc(e)}function Da(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Hb(e,n)}}function Pi(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var a=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};l===null?a=l=c:l=l.next=c,n=n.next}while(n!==null);l===null?a=l=t:l=l.next=t}else a=l=t;n={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:l,shared:o.shared,callbacks:o.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var qr=!1;function Ra(){if(qr){var e=Uo;if(e!==null)throw e}}function Ba(e,t,n,o){qr=!1;var a=e.updateQueue;rn=!1;var l=a.firstBaseUpdate,c=a.lastBaseUpdate,i=a.shared.pending;if(i!==null){a.shared.pending=null;var r=i,d=r.next;r.next=null,c===null?l=d:c.next=d,c=r;var b=e.alternate;b!==null&&(b=b.updateQueue,i=b.lastBaseUpdate,i!==c&&(i===null?b.firstBaseUpdate=d:i.next=d,b.lastBaseUpdate=r))}if(l!==null){var m=a.baseState;c=0,b=d=r=null,i=l;do{var f=i.lane&-536870913,p=f!==i.lane;if(p?(U&f)===f:(o&f)===f){f!==0&&f===In&&(qr=!0),b!==null&&(b=b.next={lane:0,tag:i.tag,payload:i.payload,callback:null,next:null});e:{var k=e,S=i;f=t;var z=n;switch(S.tag){case 1:if(k=S.payload,typeof k=="function"){m=k.call(z,m,f);break e}m=k;break e;case 3:k.flags=k.flags&-65537|128;case 0:if(k=S.payload,f=typeof k=="function"?k.call(z,m,f):k,f==null)break e;m=F({},m,f);break e;case 2:rn=!0}}f=i.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=a.callbacks,p===null?a.callbacks=[f]:p.push(f))}else p={lane:f,tag:i.tag,payload:i.payload,callback:i.callback,next:null},b===null?(d=b=p,r=m):b=b.next=p,c|=f;if(i=i.next,i===null){if(i=a.shared.pending,i===null)break;p=i,i=p.next,p.next=null,a.lastBaseUpdate=p,a.shared.pending=null}}while(!0);b===null&&(r=m),a.baseState=r,a.firstBaseUpdate=d,a.lastBaseUpdate=b,l===null&&(a.shared.lanes=0),An|=c,e.lanes=c,e.memoizedState=m}}function xp(e,t){if(typeof e!="function")throw Error(h(191,e));e.call(t)}function Sp(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)xp(n[e],t)}var On=Mt(null),Nc=Mt(0);function yf(e,t){e=Jt,P(Nc,e),P(On,t),Jt=e|t.baseLanes}function Yr(){P(Nc,Jt),P(On,On.current)}function Qu(){Jt=Nc.current,Se(On),Se(Nc)}var Ee=Mt(null),Oe=null;function kn(e){var t=e.alternate;P(we,we.current&1),P(Ee,e),Oe===null&&(t===null||On.current!==null||t.memoizedState!==null)&&(Oe=e)}function jr(e){P(we,we.current),P(Ee,e),Oe===null&&(Oe=e)}function wp(e){e.tag===22?(P(we,we.current),P(Ee,e),Oe===null&&(Oe=e)):xn()}function xn(){P(we,we.current),P(Ee,Ee.current)}function Qe(e){Se(Ee),Oe===e&&(Oe=null),Se(we)}var we=Mt(0);function Fa(e,t){P(Ee,Ee.current),P(we,t)}function Zu(e){Se(we),Se(Ee),Oe===e&&(Oe=null)}function Oc(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||xu(n)||yd(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!=="independent"){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Qt=0,A=null,K=null,ie=null,Cc=!1,Lo=!1,eo=!1,Ac=0,Wa=0,qo=null,n0=0;function ae(){throw Error(h(321))}function Ku(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ie(e[n],t[n]))return!1;return!0}function Ju(e,t,n,o,a,l){return Qt=l,A=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?ev:tv,eo=!1,l=n(o,a),eo=!1,Lo&&(l=Ep(t,n,o,a)),Tp(e),l}function Tp(e){N.H=_c;var t=K!==null&&K.next!==null;if(Qt=0,ie=K=A=null,Cc=!1,Wa=0,qo=null,t)throw Error(h(300));e===null||ue||(e=e.dependencies,e!==null&&Ec(e)&&(ue=!0))}function Ep(e,t,n,o){A=e;var a=0;do{if(Lo&&(qo=null),Wa=0,Lo=!1,25<=a)throw Error(h(301));if(a+=1,ie=K=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}N.H=d0,l=t(n,o)}while(Lo);return l}function o0(){var e=N.H,t=e.useState()[0];return t=typeof t.then=="function"?sl(t):t,e=e.useState()[0],(K!==null?K.memoizedState:null)!==e&&(A.flags|=1024),t}function Fu(){var e=Ac!==0;return Ac=0,e}function Wu(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function $u(e){if(Cc){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Cc=!1}Qt=0,ie=K=A=null,Lo=!1,Wa=Ac=0,qo=null}function Me(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ie===null?A.memoizedState=ie=e:ie=ie.next=e,ie}function ce(){if(K===null){var e=A.alternate;e=e!==null?e.memoizedState:null}else e=K.next;var t=ie===null?A.memoizedState:ie.next;if(t!==null)ie=t,K=e;else{if(e===null)throw A.alternate===null?Error(h(467)):Error(h(310));K=e,e={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},ie===null?A.memoizedState=ie=e:ie=ie.next=e}return ie}function ei(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function sl(e){var t=Wa;return Wa+=1,qo===null&&(qo=[]),e=hp(qo,e,t),t=A,(ie===null?t.memoizedState:ie.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?ev:tv),e}function ti(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return sl(e);if(e.$$typeof===Lg)return;if(e.$$typeof===Et)return xe(e)}throw Error(h(438,String(e)))}function Iu(e){var t=null,n=A.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var o=A.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=ei(),A.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),o=0;o<e;o++)n[o]=Hg;return t.index++,n}function Zt(e,t){return typeof t=="function"?t(e):t}function ac(e){var t=ce();return Pu(t,K,e)}function Pu(e,t,n){var o=e.queue;if(o===null)throw Error(h(311));o.lastRenderedReducer=n;var a=e.baseQueue,l=o.pending;if(l!==null){if(a!==null){var c=a.next;a.next=l.next,l.next=c}t.baseQueue=a=l,o.pending=null}if(l=e.baseState,a===null)e.memoizedState=l;else{t=a.next;var i=c=null,r=null,d=t,b=!1;do{var m=d.lane&-536870913;if(m!==d.lane?(U&m)===m:(Qt&m)===m){var f=d.revertLane;if(f===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),m===In&&(b=!0);else if((Qt&f)===f){d=d.next,f===In&&(b=!0);continue}else m={lane:0,revertLane:d.revertLane,gesture:null,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=m,c=l):r=r.next=m,A.lanes|=f,An|=f;m=d.action,eo&&n(l,m),l=d.hasEagerState?d.eagerState:n(l,m)}else f={lane:m,revertLane:d.revertLane,gesture:d.gesture,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null},r===null?(i=r=f,c=l):r=r.next=f,A.lanes|=m,An|=m;d=d.next}while(d!==null&&d!==t);if(r===null?c=l:r.next=i,!Ie(l,e.memoizedState)&&(ue=!0,b&&(n=Uo,n!==null)))throw n;e.memoizedState=l,e.baseState=c,e.baseQueue=r,o.lastRenderedState=l}return a===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function er(e){var t=ce(),n=t.queue;if(n===null)throw Error(h(311));n.lastRenderedReducer=e;var o=n.dispatch,a=n.pending,l=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do l=e(l,c.action),c=c.next;while(c!==a);Ie(l,t.memoizedState)||(ue=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,o]}function zp(e,t,n){var o=A,a=ce(),l=_;if(l){if(n===void 0)throw Error(h(407));n=n()}else n=t();var c=!Ie((K||a).memoizedState,n);if(c&&(a.memoizedState=n,ue=!0),a=a.queue,ed(Cp.bind(null,o,a,e),[e]),e=a.getSnapshot!==t||c||ie!==null&&(ie.memoizedState.tag&1)!==0,Zo(e?9:8,{destroy:void 0},Op.bind(null,o,a,n,t),null),e){if(o.flags|=2048,J===null)throw Error(h(349));l||(Qt&127)!==0||Np(o,t,n)}return n}function Np(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=A.updateQueue,t===null?(t=ei(),A.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Op(e,t,n,o){t.value=n,t.getSnapshot=o,Ap(t)&&_p(e)}function Cp(e,t,n){return n(function(){Ap(t)&&_p(e)})}function Ap(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ie(e,n)}catch{return!0}}function _p(e){var t=co(e,2);t!==null&&Le(t,e,2)}function Vr(e){var t=Me();if(typeof e=="function"){var n=e;if(e=n(),eo){dn(!0);try{n()}finally{dn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Zt,lastRenderedState:e},t}function Mp(e,t,n,o){return e.baseState=n,Pu(e,K,typeof o=="function"?o:Zt)}function a0(e,t,n,o,a){if(oi(e))throw Error(h(485));if(e=t.action,e!==null){var l={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){l.listeners.push(c)}};N.T!==null?n(!0):l.isTransition=!1,o(l),n=t.pending,n===null?(l.next=t.pending=l,Dp(t,l)):(l.next=n.next,t.pending=n.next=l)}}function Dp(e,t){var n=t.action,o=t.payload,a=e.state;if(t.isTransition){var l=N.T,c={};c.types=l!==null?l.types:null,N.T=c;try{var i=n(a,o),r=N.S;r!==null&&r(c,i),kf(e,t,i)}catch(d){Gr(e,t,d)}finally{l!==null&&c.types!==null&&(l.types=c.types),N.T=l}}else try{l=n(a,o),kf(e,t,l)}catch(d){Gr(e,t,d)}}function kf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(o){xf(e,t,o)},function(o){return Gr(e,t,o)}):xf(e,t,n)}function xf(e,t,n){t.status="fulfilled",t.value=n,Rp(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Dp(e,n)))}function Gr(e,t,n){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=n,Rp(t),t=t.next;while(t!==o)}e.action=null}function Rp(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Bp(e,t){return t}function Sf(e,t){if(_){var n=J.formState;if(n!==null){e:{var o=A;if(_){if(I){t:{for(var a=I,l=rt;a.nodeType!==8;){if(!l){a=null;break t}if(a=ut(a.nextSibling),a===null){a=null;break t}}l=a.data,a=l==="F!"||l==="F"?a:null}if(a){I=ut(a.nextSibling),o=a.data==="F!";break e}}Nn(o)}o=!1}o&&(t=n[0])}}return n=Me(),n.memoizedState=n.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bp,lastRenderedState:t},n.queue=o,n=$p.bind(null,A,o),o.dispatch=n,o=Vr(!1),l=ad.bind(null,A,!1,o.queue),o=Me(),a={state:t,dispatch:null,action:e,pending:null},o.queue=a,n=a0.bind(null,A,a,l,n),a.dispatch=n,o.memoizedState=e,[t,n,!1]}function wf(e){var t=ce();return Up(t,K,e)}function Up(e,t,n){if(t=Pu(e,t,Bp)[0],e=ac(Zt)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=sl(t)}catch(c){throw c===aa?Pc:c}else o=t;t=ce();var a=t.queue,l=a.dispatch;return n!==t.memoizedState&&(A.flags|=2048,Zo(9,{destroy:void 0},l0.bind(null,a,n),null)),[o,l,e]}function l0(e,t){e.action=t}function Tf(e){var t=ce(),n=K;if(n!==null)return Up(t,n,e);ce(),t=t.memoizedState,n=ce();var o=n.queue.dispatch;return n.memoizedState=e,[t,o,!1]}function Zo(e,t,n,o){return e={tag:e,create:n,deps:o,inst:t,next:null},t=A.updateQueue,t===null&&(t=ei(),A.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e),e}function Hp(){return ce().memoizedState}function lc(e,t,n,o){var a=Me();A.flags|=e,a.memoizedState=Zo(1|t,{destroy:void 0},n,o===void 0?null:o)}function ni(e,t,n,o){var a=ce();o=o===void 0?null:o;var l=a.memoizedState.inst;K!==null&&o!==null&&Ku(o,K.memoizedState.deps)?a.memoizedState=Zo(t,l,n,o):(A.flags|=e,a.memoizedState=Zo(1|t,l,n,o))}function Ef(e,t){lc(8390656,8,e,t)}function ed(e,t){ni(2048,8,e,t)}function c0(e){A.flags|=4;var t=A.updateQueue;if(t===null)t=ei(),A.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Lp(e){var t=ce().memoizedState;return c0({ref:t,nextImpl:e}),function(){if((j&2)!==0)throw Error(h(440));return t.impl.apply(void 0,arguments)}}function qp(e,t){return ni(4,2,e,t)}function Yp(e,t){return ni(4,4,e,t)}function jp(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Vp(e,t,n){n=n!=null?n.concat([e]):null,ni(4,4,jp.bind(null,t,e),n)}function td(){}function Gp(e,t){var n=ce();t=t===void 0?null:t;var o=n.memoizedState;return t!==null&&Ku(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function Xp(e,t){var n=ce();t=t===void 0?null:t;var o=n.memoizedState;if(t!==null&&Ku(t,o[1]))return o[0];if(o=e(),eo){dn(!0);try{e()}finally{dn(!1)}}return n.memoizedState=[o,t],o}function nd(e,t,n){return n===void 0||(Qt&1073741824)!==0&&(U&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Uv(),A.lanes|=e,An|=e,n)}function Qp(e,t,n,o){return Ie(n,t)?n:On.current!==null?(e=nd(e,n,o),Ie(e,t)||(ue=!0),e):(Qt&106)===0||(Qt&1073741824)!==0&&(U&261930)===0?(ue=!0,e.memoizedState=n):(e=Uv(),A.lanes|=e,An|=e,t)}function Zp(e,t,n,o,a){var l=V.p;V.p=l!==0&&8>l?l:8;var c=N.T,i={};i.types=c!==null?c.types:null,N.T=i,ad(e,!1,t,n);try{var r=a(),d=N.S;if(d!==null&&d(i,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var b=t0(r,o);Ua(e,t,b,$e(e))}else Ua(e,t,o,$e(e))}catch(m){Ua(e,t,{then:function(){},status:"rejected",reason:m},$e())}finally{V.p=l,c!==null&&i.types!==null&&(c.types=i.types),N.T=c}}function i0(){}function Xr(e,t,n,o){if(e.tag!==5)throw Error(h(476));var a=Kp(e).queue;Zp(e,a,t,Xn,n===null?i0:function(){return Jp(e),n(o)})}function Kp(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Xn,baseState:Xn,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Zt,lastRenderedState:Xn},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Zt,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Jp(e){var t=Kp(e);t.next===null&&(t=e.alternate.memoizedState),Ua(e,t.next.queue,{},$e())}function od(){return xe(Po)}function Fp(){return ce().memoizedState}function Wp(){return ce().memoizedState}function r0(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=$e();e=hn(n);var o=yn(t,e,n);o!==null&&(Le(o,t,n),Da(o,t,n)),t={cache:ju()},e.payload=t;return}t=t.return}}function u0(e,t,n){var o=$e();n={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},oi(e)?Ip(t,n):(n=Lu(e,t,n,o),n!==null&&(Le(n,e,o),Pp(n,t,o)))}function $p(e,t,n){var o=$e();Ua(e,t,n,o)}function Ua(e,t,n,o){var a={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(oi(e))Ip(t,a);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var c=t.lastRenderedState,i=l(c,n);if(a.hasEagerState=!0,a.eagerState=i,Ie(i,c))return $c(e,t,a,0),J===null&&Wc(),!1}catch{}if(n=Lu(e,t,a,o),n!==null)return Le(n,e,o),Pp(n,t,o),!0}return!1}function ad(e,t,n,o){if(o={lane:2,revertLane:vd(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},oi(e)){if(t)throw Error(h(479))}else t=Lu(e,n,o,2),t!==null&&Le(t,e,2)}function oi(e){var t=e.alternate;return e===A||t!==null&&t===A}function Ip(e,t){Lo=Cc=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Pp(e,t,n){if((n&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Hb(e,n)}}var _c={readContext:xe,use:ti,useCallback:ae,useContext:ae,useEffect:ae,useImperativeHandle:ae,useLayoutEffect:ae,useInsertionEffect:ae,useMemo:ae,useReducer:ae,useRef:ae,useState:ae,useDebugValue:ae,useDeferredValue:ae,useTransition:ae,useSyncExternalStore:ae,useId:ae,useHostTransitionStatus:ae,useFormState:ae,useActionState:ae,useOptimistic:ae,useMemoCache:ae,useCacheRefresh:ae,useEffectEvent:ae},ev={readContext:xe,use:ti,useCallback:function(e,t){return Me().memoizedState=[e,t===void 0?null:t],e},useContext:xe,useEffect:Ef,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,lc(4194308,4,jp.bind(null,t,e),n)},useLayoutEffect:function(e,t){return lc(4194308,4,e,t)},useInsertionEffect:function(e,t){lc(4,2,e,t)},useMemo:function(e,t){var n=Me();t=t===void 0?null:t;var o=e();if(eo){dn(!0);try{e()}finally{dn(!1)}}return n.memoizedState=[o,t],o},useReducer:function(e,t,n){var o=Me();if(n!==void 0){var a=n(t);if(eo){dn(!0);try{n(t)}finally{dn(!1)}}}else a=t;return o.memoizedState=o.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},o.queue=e,e=e.dispatch=u0.bind(null,A,e),[o.memoizedState,e]},useRef:function(e){var t=Me();return e={current:e},t.memoizedState=e},useState:function(e){e=Vr(e);var t=e.queue,n=$p.bind(null,A,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:td,useDeferredValue:function(e,t){var n=Me();return nd(n,e,t)},useTransition:function(){var e=Vr(!1);return e=Zp.bind(null,A,e.queue,!0,!1),Me().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var o=A,a=Me();if(_){if(n===void 0)throw Error(h(407));n=n()}else{if(n=t(),J===null)throw Error(h(349));(U&127)!==0||Np(o,t,n)}a.memoizedState=n;var l={value:n,getSnapshot:t};return a.queue=l,Ef(Cp.bind(null,o,l,e),[e]),o.flags|=2048,Zo(9,{destroy:void 0},Op.bind(null,o,l,n,t),null),n},useId:function(){var e=Me(),t=J.identifierPrefix;if(_){var n=Ot,o=Nt;n=(o&~(1<<32-We(o)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Ac++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=n0++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:od,useFormState:Sf,useActionState:Sf,useOptimistic:function(e){var t=Me();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=ad.bind(null,A,!0,n),n.dispatch=t,[e,t]},useMemoCache:Iu,useCacheRefresh:function(){return Me().memoizedState=r0.bind(null,A)},useEffectEvent:function(e){var t=Me(),n={impl:e};return t.memoizedState=n,function(){if((j&2)!==0)throw Error(h(440));return n.impl.apply(void 0,arguments)}}},tv={readContext:xe,use:ti,useCallback:Gp,useContext:xe,useEffect:ed,useImperativeHandle:Vp,useInsertionEffect:qp,useLayoutEffect:Yp,useMemo:Xp,useReducer:ac,useRef:Hp,useState:function(){return ac(Zt)},useDebugValue:td,useDeferredValue:function(e,t){var n=ce();return Qp(n,K.memoizedState,e,t)},useTransition:function(){var e=ac(Zt)[0],t=ce().memoizedState;return[typeof e=="boolean"?e:sl(e),t]},useSyncExternalStore:zp,useId:Fp,useHostTransitionStatus:od,useFormState:wf,useActionState:wf,useOptimistic:function(e,t){var n=ce();return Mp(n,K,e,t)},useMemoCache:Iu,useCacheRefresh:Wp,useEffectEvent:Lp},d0={readContext:xe,use:ti,useCallback:Gp,useContext:xe,useEffect:ed,useImperativeHandle:Vp,useInsertionEffect:qp,useLayoutEffect:Yp,useMemo:Xp,useReducer:er,useRef:Hp,useState:function(){return er(Zt)},useDebugValue:td,useDeferredValue:function(e,t){var n=ce();return K===null?nd(n,e,t):Qp(n,K.memoizedState,e,t)},useTransition:function(){var e=er(Zt)[0],t=ce().memoizedState;return[typeof e=="boolean"?e:sl(e),t]},useSyncExternalStore:zp,useId:Fp,useHostTransitionStatus:od,useFormState:Tf,useActionState:Tf,useOptimistic:function(e,t){var n=ce();return K!==null?Mp(n,K,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Iu,useCacheRefresh:Wp,useEffectEvent:Lp};function tr(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:F({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Qr={enqueueSetState:function(e,t,n){e=e._reactInternals;var o=$e(),a=hn(o);a.payload=t,n!=null&&(a.callback=n),t=yn(e,a,o),t!==null&&(Le(t,e,o),Da(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=$e(),a=hn(o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=yn(e,a,o),t!==null&&(Le(t,e,o),Da(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=$e(),o=hn(n);o.tag=2,t!=null&&(o.callback=t),t=yn(e,o,n),t!==null&&(Le(t,e,n),Da(t,e,n))}};function zf(e,t,n,o,a,l,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,c):t.prototype&&t.prototype.isPureReactComponent?!Qa(n,o)||!Qa(a,l):!0}function Nf(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&Qr.enqueueReplaceState(t,t.state,null)}function to(e,t){var n=t;if("ref"in t){n={};for(var o in t)o!=="ref"&&(n[o]=t[o])}if(e=e.defaultProps){n===t&&(n=F({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function nv(e){xc(e)}function ov(e){console.error(e)}function av(e){xc(e)}function Mc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function Of(e,t,n){try{var o=e.onCaughtError;o(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function Zr(e,t,n){return n=hn(n),n.tag=3,n.payload={element:null},n.callback=function(){Mc(e,t)},n}function lv(e){return e=hn(e),e.tag=3,e}function cv(e,t,n,o){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var l=o.value;e.payload=function(){return a(l)},e.callback=function(){Of(t,n,o)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){Of(t,n,o),typeof a!="function"&&(Sn===null?Sn=new Set([this]):Sn.add(this));var i=o.stack;this.componentDidCatch(o.value,{componentStack:i!==null?i:""})})}function s0(e,t,n,o,a){if(n.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=n.alternate,t!==null&&Wn(t,n,a,!0),n=Ee.current,n!==null){switch(n.tag){case 31:case 13:case 19:return Oe===null?Yc():n.alternate===null&&le===0&&(le=3),n.flags&=-257,n.flags|=65536,n.lanes=a,o===zc?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([o]):t.add(o),rr(e,o,a)),!1;case 22:return n.flags|=65536,o===zc?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([o]):n.add(o)),rr(e,o,a)),!1}throw Error(h(435,n.tag))}return rr(e,o,a),Yc(),!1}if(_)return t=Ee.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,o!==Rr&&(e=Error(h(422),{cause:o}),Ka(it(e,n)))):(o!==Rr&&(t=Error(h(423),{cause:o}),Ka(it(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,o=it(o,n),a=Zr(e.stateNode,o,a),Pi(e,a),le!==4&&(le=2)),!1;var l=Error(h(520),{cause:o});if(l=it(l,n),Ya===null?Ya=[l]:Ya.push(l),le!==4&&(le=2),t===null)return!0;o=it(o,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Zr(n.stateNode,o,e),Pi(n,e),!1;case 1:if(t=n.type,l=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(Sn===null||!Sn.has(l))))return n.flags|=65536,a&=-a,n.lanes|=a,a=lv(a),cv(a,e,n,o),Pi(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var ld=Error(h(461)),ue=!1;function se(e,t,n,o){t.child=e===null?kp(t,null,n,o):Pn(t,e.child,n,o)}function Cf(e,t,n,o,a){n=n.render;var l=t.ref;if("ref"in o){var c={};for(var i in o)i!=="ref"&&(c[i]=o[i])}else c=o;return $n(t),o=Ju(e,t,n,c,l,a),i=Fu(),e!==null&&!ue?(Wu(e,t,a),Kt(e,t,a)):(_&&i&&Ic(t),t.flags|=1,se(e,t,o,a),t.child)}function Af(e,t,n,o,a){if(e===null){var l=n.type;return typeof l=="function"&&!qu(l)&&l.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=l,iv(e,t,l,o,a)):(e=tc(n.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!id(e,a)){var c=l.memoizedProps;if(n=n.compare,n=n!==null?n:Qa,n(c,o)&&e.ref===t.ref)return Kt(e,t,a)}return t.flags|=1,e=jt(l,o),e.ref=t.ref,e.return=t,t.child=e}function iv(e,t,n,o,a){if(e!==null){var l=e.memoizedProps;if(Qa(l,o)&&e.ref===t.ref)if(ue=!1,t.pendingProps=o=l,id(e,a))(e.flags&131072)!==0&&(ue=!0);else return t.lanes=e.lanes,Kt(e,t,a)}return Kr(e,t,n,o,a)}function rv(e,t,n,o){var a=o.children,l=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(l=l!==null?l.baseLanes|n:n,e!==null){for(o=t.child=e.child,a=0;o!==null;)a=a|o.lanes|o.childLanes,o=o.sibling;o=a&~l}else o=0,t.child=null;return _f(e,t,l,n,o)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&oc(t,l!==null?l.cachePool:null),l!==null?yf(t,l):Yr(),wp(t);else return o=t.lanes=536870912,_f(e,t,l!==null?l.baseLanes|n:n,n,o)}else l!==null?(oc(t,l.cachePool),yf(t,l),xn(),t.memoizedState=null):(e!==null&&oc(t,null),Yr(),xn());return se(e,t,a,n),t.child}function Ha(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function _f(e,t,n,o,a){var l=Vu();return l=l===null?null:{parent:re._currentValue,pool:l},t.memoizedState={baseLanes:n,cachePool:l},e!==null&&oc(t,null),Yr(),wp(t),e!==null&&Wn(e,t,o,!0),t.childLanes=a,null}function cc(e,t){return t=ai({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Mf(e,t,n){return Pn(t,e.child,null,n),e=cc(t,t.pendingProps),e.flags|=2,Qe(t),t.memoizedState=null,e}function f0(e,t,n){var o=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(_){if(o.mode==="hidden")return e=cc(t,o),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Ha(null,e);if(jr(t),(e=I)?(e=rm(e,rt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:zn!==null?{id:Nt,overflow:Ot}:null,retryLane:536870912,hydrationErrors:null},n=bp(e),n.return=t,t.child=n,ge=t,I=null)):e=null,e===null)throw Nn(t);return t.lanes=536870912,null}return cc(t,o)}var l=e.memoizedState;if(l!==null){var c=l.dehydrated;if(jr(t),a)if(t.flags&256)t.flags&=-257,t=Mf(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(h(558));else if(ue||Wn(e,t,n,!1),a=(n&e.childLanes)!==0,ue||a){if(On.current===null){if(o=J,o!==null&&(c=Lb(o,n),c!==0&&c!==l.retryLane))throw l.retryLane=c,co(e,c),Le(o,e,c),ld;Yc()}t=Mf(e,t,n)}else e=l.treeContext,I=ut(c.nextSibling),ge=t,_=!0,gn=null,rt=!1,e!==null&&vp(t,e),t=cc(t,o),t.flags|=134221824;return t}return e=jt(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function ho(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(h(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Kr(e,t,n,o,a){return $n(t),n=Ju(e,t,n,o,void 0,a),o=Fu(),e!==null&&!ue?(Wu(e,t,a),Kt(e,t,a)):(_&&o&&Ic(t),t.flags|=1,se(e,t,n,a),t.child)}function Df(e,t,n,o,a,l){return $n(t),t.updateQueue=null,n=Ep(t,o,n,a),Tp(e),o=Fu(),e!==null&&!ue?(Wu(e,t,l),Kt(e,t,l)):(_&&o&&Ic(t),t.flags|=1,se(e,t,n,l),t.child)}function Rf(e,t,n,o,a){if($n(t),t.stateNode===null){var l=Co,c=n.contextType;typeof c=="object"&&c!==null&&(l=xe(c)),l=new n(o,l),t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=Qr,t.stateNode=l,l._reactInternals=t,l=t.stateNode,l.props=o,l.state=t.memoizedState,l.refs={},Xu(t),c=n.contextType,l.context=typeof c=="object"&&c!==null?xe(c):Co,l.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(tr(t,n,c,o),l.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(c=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),c!==l.state&&Qr.enqueueReplaceState(l,l.state,null),Ba(t,o,l,a),Ra(),l.state=t.memoizedState),typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){l=t.stateNode;var i=t.memoizedProps,r=to(n,i);l.props=r;var d=l.context,b=n.contextType;c=Co,typeof b=="object"&&b!==null&&(c=xe(b));var m=n.getDerivedStateFromProps;b=typeof m=="function"||typeof l.getSnapshotBeforeUpdate=="function",i=t.pendingProps!==i,b||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(i||d!==c)&&Nf(t,l,o,c),rn=!1;var f=t.memoizedState;l.state=f,Ba(t,o,l,a),Ra(),d=t.memoizedState,i||f!==d||rn?(typeof m=="function"&&(tr(t,n,m,o),d=t.memoizedState),(r=rn||zf(t,n,r,o,f,d,c))?(b||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=d),l.props=o,l.state=d,l.context=c,o=r):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{l=t.stateNode,Lr(e,t),c=t.memoizedProps,b=to(n,c),l.props=b,m=t.pendingProps,f=l.context,d=n.contextType,r=Co,typeof d=="object"&&d!==null&&(r=xe(d)),i=n.getDerivedStateFromProps,(d=typeof i=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(c!==m||f!==r)&&Nf(t,l,o,r),rn=!1,f=t.memoizedState,l.state=f,Ba(t,o,l,a),Ra();var p=t.memoizedState;c!==m||f!==p||rn||e!==null&&e.dependencies!==null&&Ec(e.dependencies)?(typeof i=="function"&&(tr(t,n,i,o),p=t.memoizedState),(b=rn||zf(t,n,b,o,f,p,r)||e!==null&&e.dependencies!==null&&Ec(e.dependencies))?(d||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(o,p,r),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(o,p,r)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=p),l.props=o,l.state=p,l.context=r,o=b):(typeof l.componentDidUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),o=!1)}return l=o,ho(e,t),o=(t.flags&128)!==0,l||o?(l=t.stateNode,n=o&&typeof n.getDerivedStateFromError!="function"?null:l.render(),t.flags|=1,e!==null&&o?(t.child=Pn(t,e.child,null,a),t.child=Pn(t,null,n,a)):se(e,t,n,a),t.memoizedState=l.state,e=t.child):e=Kt(e,t,a),e}function Bf(e,t,n,o){return Fn(),t.flags|=256,se(e,t,n,o),t.child}var Jr={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Fr(e){return{baseLanes:e,cachePool:gp()}}function Wr(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Ke),e}function uv(e,t,n){var o=t.pendingProps,a=!1,l=(t.flags&128)!==0,c;if((c=l)||(c=e!==null&&e.memoizedState===null?!1:(we.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(_){if(a?kn(t):xn(),(e=I)?(e=rm(e,rt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:zn!==null?{id:Nt,overflow:Ot}:null,retryLane:536870912,hydrationErrors:null},n=bp(e),n.return=t,t.child=n,ge=t,I=null)):e=null,e===null)throw Nn(t);return yd(e)?t.lanes=32:t.lanes=536870912,null}return l=o.children,o=o.fallback,a?(xn(),a=t.mode,l=ai({mode:"hidden",children:l},a),o=Qn(o,a,n,null),l.return=t,o.return=t,l.sibling=o,t.child=l,o=t.child,o.memoizedState=Fr(n),o.childLanes=Wr(e,c,n),t.memoizedState=Jr,Ha(null,o)):(kn(t),cd(t,l))}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(r!==null)return b0(e,t,l,c,o,r,i,n)}return a?(xn(),a=o.fallback,l=t.mode,i=e.child,r=i.sibling,o=jt(i,{mode:"hidden",children:o.children}),o.subtreeFlags=i.subtreeFlags&1206910976,r!==null?a=jt(r,a):(a=Qn(a,l,n,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,Ha(null,o),o=t.child,a=e.child.memoizedState,a===null?a=Fr(n):(l=a.cachePool,l!==null?(i=re._currentValue,l=l.parent!==i?{parent:i,pool:i}:l):l=gp(),a={baseLanes:a.baseLanes|n,cachePool:l}),o.memoizedState=a,o.childLanes=Wr(e,c,n),t.memoizedState=Jr,Ha(e.child,o)):(kn(t),n=e.child,e=n.sibling,n=jt(n,{mode:"visible",children:o.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function cd(e,t){return t=ai({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function ai(e,t){return e=He(22,e,null,t),e.lanes=0,e}function jl(e,t,n){return Pn(t,e.child,null,n),e=cd(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function b0(e,t,n,o,a,l,c,i){if(n)return t.flags&256?(kn(t),t.flags&=-257,jl(e,t,i)):t.memoizedState!==null?(xn(),t.child=e.child,t.flags|=128,null):(xn(),l=a.fallback,c=t.mode,a=ai({mode:"visible",children:a.children},c),l=Qn(l,c,i,null),l.flags|=2,a.return=t,l.return=t,a.sibling=l,t.child=a,Pn(t,e.child,null,i),a=t.child,a.memoizedState=Fr(i),a.childLanes=Wr(e,o,i),t.memoizedState=Jr,Ha(null,a));if(kn(t),yd(l)){if(o=l.nextSibling&&l.nextSibling.dataset,o)var r=o.dgst;return o=r,o!==""&&(a=Error(h(419)),a.stack="",a.digest=o,Ka({value:a,source:null,stack:null})),jl(e,t,i)}if(ue||Wn(e,t,i,!1),o=(i&e.childLanes)!==0,ue||o){if(On.current!==null)return jl(e,t,i);if(o=J,o!==null&&(a=Lb(o,i),a!==0&&a!==c.retryLane))throw c.retryLane=a,co(e,a),Le(o,e,a),ld;return xu(l)||Yc(),jl(e,t,i)}return xu(l)?(t.flags|=192,t.child=e.child,null):(e=c.treeContext,I=ut(l.nextSibling),ge=t,_=!0,gn=null,rt=!1,e!==null&&vp(t,e),t=cd(t,a.children),t.flags|=134221824,t)}function Uf(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),nc(e.return,t,n)}function Hf(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Oc(n)===null&&(t=e),e=e.sibling}return t}function Vl(e,t,n,o,a,l){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:a,treeForkCount:l}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=o,c.tail=n,c.tailMode=a,c.treeForkCount=l)}function nr(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function $r(e,t,n){var o=t.pendingProps,a=o.revealOrder,l=o.tail;o=o.children;var c=we.current;if(t.flags&128)return Fa(t,c),null;var i=(c&2)!==0;if(i?(c=c&1|2,t.flags|=128):c&=1,Fa(t,c),a==="backwards"&&e!==null?(nr(e),se(e,t,o,n),nr(e)):se(e,t,o,n),o=_?Za:0,!i&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Uf(e,n,t);else if(e.tag===19)Uf(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"backwards":n=Hf(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null,nr(t)),Vl(t,!0,a,null,l,o);break;case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&Oc(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Vl(t,!0,n,null,l,o);break;case"together":Vl(t,!1,null,null,void 0,o);break;case"independent":t.memoizedState=null;break;default:n=Hf(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Vl(t,!1,a,n,l,o)}return t.child}function Lf(e,t,n){var o=t.pendingProps;return fn(t,t.type,o.value),se(e,t,o.children,n),t.child}function Kt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),An|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Wn(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(h(153));if(t.child!==null){for(e=t.child,n=jt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=jt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function id(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Ec(e)))}function p0(e,t,n){switch(t.tag){case 3:gc(t,t.stateNode.containerInfo),fn(t,re,e.memoizedState.cache),Fn();break;case 27:case 5:Tr(t);break;case 4:gc(t,t.stateNode.containerInfo);break;case 10:fn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,jr(t),null;break;case 13:var o=t.memoizedState;if(o!==null){if(o.dehydrated!==null)return kn(t),t.flags|=128,null;o=Wn(e,t,n,!1);var a=t.child.childLanes;return o||(n&a)!==0?uv(e,t,n):(kn(t),e=Kt(e,t,n),e!==null?e.sibling:null)}kn(t);break;case 19:if(t.flags&128)return $r(e,t,n);if(a=(e.flags&128)!==0,o=(n&t.childLanes)!==0,o||(Wn(e,t,n,!1),o=(n&t.childLanes)!==0),a){if(o)return $r(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),Fa(t,we.current),o)break;return null;case 22:return t.lanes=0,rv(e,t,n,t.pendingProps);case 24:fn(t,re,e.memoizedState.cache)}return Kt(e,t,n)}function dv(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)ue=!0;else{if(!id(e,n)&&(t.flags&128)===0)return ue=!1,p0(e,t,n);ue=(e.flags&131072)!==0}else ue=!1,_&&(t.flags&1048576)!==0&&pp(t,Za,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=Yn(t.elementType),t.type=e,typeof e=="function")qu(e)?(o=to(e,o),t.tag=1,t=Rf(null,t,e,o,n)):(t.tag=0,t=Kr(null,t,e,o,n));else{if(e!=null){var a=e.$$typeof;if(a===zu){t.tag=11,t=Cf(null,t,e,o,n);break e}else if(a===Nu){t.tag=14,t=Af(null,t,e,o,n);break e}else if(a===Et){t.tag=10,t.type=e,t=Lf(null,t,n);break e}}throw t=Sr(e)||e,Error(h(306,t,""))}}return t;case 0:return Kr(e,t,t.type,t.pendingProps,n);case 1:return o=t.type,a=to(o,t.pendingProps),Rf(e,t,o,a,n);case 3:e:{if(gc(t,t.stateNode.containerInfo),e===null)throw Error(h(387));o=t.pendingProps;var l=t.memoizedState;a=l.element,Lr(e,t),Ba(t,o,null,n);var c=t.memoizedState;if(o=c.cache,fn(t,re,o),o!==l.cache&&Ur(t,[re],n,!0),Ra(),o=c.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){t=Bf(e,t,o,n);break e}else if(o!==a){a=it(Error(h(424)),t),Ka(a),t=Bf(e,t,o,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,I=ut(e.firstChild),ge=t,_=!0,gn=null,rt=!0,n=kp(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling;else{if(Fn(),o===a){t=Kt(e,t,n);break e}se(e,t,o,n)}t=t.child}return t;case 26:return ho(e,t),e===null?(n=sb(t.type,null,t.pendingProps,null))?t.memoizedState=n:_||(t.stateNode=Pv(t.type,t.pendingProps,mn.current,t)):t.memoizedState=sb(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Tr(t),e===null&&_&&(o=t.stateNode=um(t.type,t.pendingProps,mn.current),ge=t,rt=!0,a=I,Mn(t.type)?(Su=a,I=ut(o.firstChild)):I=a),se(e,t,t.pendingProps.children,n),ho(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&_&&((a=o=I)&&(o=cy(o,t.type,t.pendingProps,rt),o!==null?(t.stateNode=o,ge=t,I=ut(o.firstChild),rt=!1,a=!0):a=!1),a||Nn(t)),Tr(t),a=t.type,l=t.pendingProps,c=e!==null?e.memoizedProps:null,o=l.children,hu(a,l)?o=null:c!==null&&hu(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=Ju(e,t,o0,null,null,n),Po._currentValue=a),ho(e,t),se(e,t,o,n),t.child;case 6:return e===null&&_&&((e=n=I)&&(n=iy(n,t.pendingProps,rt),n!==null?(t.stateNode=n,ge=t,I=null,e=!0):e=!1),e||Nn(t)),null;case 13:return uv(e,t,n);case 4:return gc(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Pn(t,null,o,n):se(e,t,o,n),t.child;case 11:return Cf(e,t,t.type,t.pendingProps,n);case 7:return o=t.pendingProps,ho(e,t),se(e,t,o,n),t.child;case 8:return se(e,t,t.pendingProps.children,n),t.child;case 12:return se(e,t,t.pendingProps.children,n),t.child;case 10:return Lf(e,t,n);case 9:return a=t.type._context,o=t.pendingProps.children,$n(t),a=xe(a),o=o(a),t.flags|=1,se(e,t,o,n),t.child;case 14:return Af(e,t,t.type,t.pendingProps,n);case 15:return iv(e,t,t.type,t.pendingProps,n);case 19:return $r(e,t,n);case 31:return f0(e,t,n);case 22:return rv(e,t,n,t.pendingProps);case 24:return $n(t),o=xe(re),e===null?(a=Vu(),a===null&&(a=J,l=ju(),a.pooledCache=l,l.refCount++,l!==null&&(a.pooledCacheLanes|=n),a=l),t.memoizedState={parent:o,cache:a},Xu(t),fn(t,re,a)):((e.lanes&n)!==0&&(Lr(e,t),Ba(t,null,null,n),Ra()),a=e.memoizedState,l=t.memoizedState,a.parent!==o?(a={parent:o,cache:o},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),fn(t,re,o)):(o=l.cache,fn(t,re,o),o!==a.cache&&Ur(t,[re],n,!0))),se(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=t.pendingProps,o.name!=null&&o.name!=="auto"?t.flags|=e===null?18882560:18874368:_&&Ic(t),e!==null&&e.memoizedProps.name!==o.name?t.flags|=4194816:ho(e,t),se(e,t,o.children,n),t.child;case 29:throw t.pendingProps}throw Error(h(156,t.tag))}function Lt(e){e.flags|=4}function or(e,t,n,o,a){var l;if((l=(e.mode&32)!==0)&&(l=n===null?pb(t,o):pb(t,o)&&(o.src!==n.src||o.srcSet!==n.srcSet)),l){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(qv())e.flags|=8192;else throw Kn=zc,Gu}else e.flags&=-16777217}function qf(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!bm(t))if(qv())e.flags|=8192;else throw Kn=zc,Gu}function Gl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Bb():536870912,e.lanes|=t,Ko|=t)}function ka(e,t){if(!_)switch(e.tailMode){case"visible":break;case"collapsed":for(var n=e.tail,o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function $(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags&1206910976,o|=a.flags&1206910976,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function v0(e,t,n){var o=t.pendingProps;switch(Yu(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $(t),null;case 1:return $(t),null;case 3:return n=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),Vt(re),Go(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(mo(t)?Lt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ii())),$(t),null;case 26:var a=t.type,l=t.memoizedState;return e===null?(Lt(t),l!==null?($(t),qf(t,l)):($(t),or(t,a,null,o,n))):l?l!==e.memoizedState?(Lt(t),$(t),qf(t,l)):($(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&Lt(t),$(t),or(t,a,e,o,n)),null;case 27:if(hc(t),n=mn.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Lt(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return $(t),t.subtreeFlags&=-33554433,null}e=Ct.current,mo(t)?ff(t,e):(e=um(a,o,n),t.stateNode=e,Lt(t))}return $(t),t.subtreeFlags&=-33554433,null;case 5:if(hc(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&Lt(t);else{if(!o){if(t.stateNode===null)throw Error(h(166));return $(t),t.subtreeFlags&=-33554433,null}if(l=Ct.current,mo(t))ff(t,l);else{var c=Pa(mn.current);switch(l){case 1:l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":l=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":l=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":l=c.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof o.is=="string"?c.createElement("select",{is:o.is}):c.createElement("select"),o.multiple?l.multiple=!0:o.size&&(l.size=o.size);break;default:l=typeof o.is=="string"?c.createElement(a,{is:o.is}):c.createElement(a)}}l[ke]=t,l[Ye]=o;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)l.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=l;e:switch(Te(l,a,o),a){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&Lt(t)}}return $(t),t.subtreeFlags&=-33554433,or(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&Lt(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(h(166));if(e=mn.current,mo(t)){if(e=t.stateNode,n=t.memoizedProps,o=null,a=ge,a!==null)switch(a.tag){case 27:case 5:o=a.memoizedProps}e[ke]=t,e=!!(e.nodeValue===n||o!==null&&o.suppressHydrationWarning===!0||$v(e.nodeValue,n)),e||Nn(t,!0)}else e=Pa(e).createTextNode(o),e[ke]=t,t.stateNode=e}return $(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(o=mo(t),n!==null){if(e===null){if(!o)throw Error(h(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(h(557));e[ke]=t}else Fn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),e=!1}else n=Ii(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Qe(t),t):(Qe(t),null);if((t.flags&128)!==0)throw Error(h(558))}return $(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=mo(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(h(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(h(317));a[ke]=t}else Fn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),a=!1}else a=Ii(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Qe(t),t):(Qe(t),null)}return Qe(t),(t.flags&128)!==0?(t.lanes=n,t):(n=o!==null,e=e!==null&&e.memoizedState!==null,n&&(o=t.child,a=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(a=o.alternate.memoizedState.cachePool.pool),l=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(l=o.memoizedState.cachePool.pool),l!==a&&(o.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Gl(t,t.updateQueue),$(t),null);case 4:return Go(),e===null&&md(t.stateNode.containerInfo),t.flags|=67108864,$(t),null;case 10:return Vt(t.type),$(t),null;case 19:if(Zu(t),o=t.memoizedState,o===null)return $(t),null;if(a=(t.flags&128)!==0,l=o.rendering,l===null)if(a)ka(o,!1);else{if(le!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=Oc(e),l!==null){for(t.flags|=128,ka(o,!1),e=l.updateQueue,t.updateQueue=e,Gl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)fp(n,e),n=n.sibling;return Fa(t,we.current&1|2),_&&qt(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&Je()>Lc&&(t.flags|=128,a=!0,ka(o,!1),t.lanes=4194304)}else{if(!a)if(e=Oc(l),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Gl(t,e),ka(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!l.alternate&&!_)return $(t),null}else 2*Je()-o.renderingStartTime>Lc&&n!==536870912&&(t.flags|=128,a=!0,ka(o,!1),t.lanes=4194304);o.isBackwards?(l.sibling=t.child,t.child=l):(e=o.last,e!==null?e.sibling=l:t.child=l,o.last=l)}if(o.tail!==null){e=o.tail;e:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break e}n=n.sibling}n=!0}return o.rendering=e,o.tail=e.sibling,o.renderingStartTime=Je(),e.sibling=null,l=we.current,l=a?l&1|2:l&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!n||_?Fa(t,l):(n=l,P(Ee,t),P(we,n),Oe===null&&(Oe=t)),_&&qt(t,o.treeForkCount),e}return $(t),null;case 22:case 23:return Qe(t),Qu(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(n&536870912)!==0&&(t.flags&128)===0&&($(t),t.subtreeFlags&6&&(t.flags|=8192)):$(t),n=t.updateQueue,n!==null&&Gl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==n&&(t.flags|=2048),e!==null&&Se(Zn),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Vt(re),$(t),null;case 25:return null;case 30:return t.flags|=33554432,$(t),null}throw Error(h(156,t.tag))}function m0(e,t){switch(Yu(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Vt(re),Go(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return hc(t),null;case 31:if(t.memoizedState!==null){if(Qe(t),t.alternate===null)throw Error(h(340));Fn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Qe(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(h(340));Fn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Zu(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return Go(),null;case 10:return Vt(t.type),null;case 22:case 23:return Qe(t),Qu(),e!==null&&Se(Zn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Vt(re),null;case 25:return null;default:return null}}function sv(e,t){switch(Yu(t),t.tag){case 3:Vt(re),Go();break;case 26:case 27:case 5:hc(t);break;case 4:Go();break;case 31:t.memoizedState!==null&&Qe(t);break;case 13:Qe(t);break;case 19:Zu(t);break;case 10:Vt(t.type);break;case 22:case 23:Qe(t),Qu(),e!==null&&Se(Zn);break;case 24:Vt(re)}}function fl(e,t){try{var n=t.updateQueue,o=n!==null?n.lastEffect:null;if(o!==null){var a=o.next;n=a;do{if((n.tag&e)===e){o=void 0;var l=n.create,c=n.inst;o=l(),c.destroy=o}n=n.next}while(n!==a)}}catch(i){Z(t,t.return,i)}}function Cn(e,t,n){try{var o=t.updateQueue,a=o!==null?o.lastEffect:null;if(a!==null){var l=a.next;o=l;do{if((o.tag&e)===e){var c=o.inst,i=c.destroy;if(i!==void 0){c.destroy=void 0,a=t;var r=n,d=i;try{d()}catch(b){Z(a,r,b)}}}o=o.next}while(o!==l)}}catch(b){Z(t,t.return,b)}}function fv(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Sp(t,n)}catch(o){Z(e,e.return,o)}}}function bv(e,t,n){n.props=to(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(o){Z(e,t,o)}}function wt(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:var a=e.stateNode,l=Xt(e.memoizedProps,a);(a.ref===null||a.ref.name!==l)&&(a.ref=om(l)),o=a.ref;break;case 7:if(e.stateNode===null){var c=new Pe(e);qe(e.child,!1,ay,c,void 0,void 0),e.stateNode=c}o=e.stateNode;break;default:o=e.stateNode}typeof n=="function"?e.refCleanup=n(o):n.current=o}}catch(i){Z(e,t,i)}}function ye(e,t){var n=e.ref,o=e.refCleanup;if(n!==null)if(typeof o=="function")try{o()}catch(a){Z(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){Z(e,t,a)}else n.current=null}function Dc(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)im(e.stateNode,t[n])}function Yf(e){for(var t=e.return;t!==null&&(ud(t)&&im(e.stateNode,t.stateNode),!rd(t));)t=t.return}function La(e){for(var t=e.return;t!==null&&(ud(t)&&ly(e.stateNode,t.stateNode),!rd(t));)t=t.return}function rd(e){return e.tag===5||e.tag===3||e.tag===27}function ud(e){return e&&e.tag===7&&e.stateNode!==null}function Ir(e){var t=e.type,n=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&o.focus();break e;case"img":n.src?o.src=n.src:n.srcSet&&(o.srcset=n.srcSet)}}catch(a){Z(e,e.return,a)}}function ar(e,t,n){try{var o=e.stateNode;Y0(o,e.type,n,t),o[Ye]=t}catch(a){Z(e,e.return,a)}}function pv(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Mn(e.type)||e.tag===4}function lr(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||pv(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Mn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Pr(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=zt)),Dc(e,o),q=!0;else if(a!==4&&(a===27&&(Dc(e,o),o=null,Mn(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Pr(e,t,n,o),e=e.sibling;e!==null;)Pr(e,t,n,o),e=e.sibling}function Rc(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?n.insertBefore(a,t):n.appendChild(a),Dc(e,o),q=!0;else if(a!==4&&(a===27&&(Dc(e,o),o=null,Mn(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Rc(e,t,n,o),e=e.sibling;e!==null;)Rc(e,t,n,o),e=e.sibling}function vv(e){var t=e.stateNode,n=e.memoizedProps;try{for(var o=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);Te(t,o,n),t[ke]=e,t[Ye]=n}catch(l){Z(e,e.return,l)}}var Bc=!1,Ze=null;function jf(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Bc=!0)}var Tt=null;function Vf(){var e=Tt;return Tt=null,e}var Ue=0;function la(e,t,n,o,a){return Ue=0,mv(e.child,t,n,o,a)}function mv(e,t,n,o,a){for(var l=!1;e!==null;){if(e.tag===5){var c=e.stateNode;if(o!==null){var i=yu(c);o.push(i),i.view&&(l=!0)}else l||yu(c).view&&(l=!0);Bc=!0,em(c,Ue===0?t:t+"_"+Ue,n),Ue++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&a||mv(e.child,t,n,o,a)&&(l=!0));e=e.sibling}return l}function _t(e,t){for(;e!==null;)e.tag===5?tm(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||_t(e.child,t)),e=e.sibling}function ic(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(ic(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name==="auto")throw Error(h(544));var n=t.name;t=Wt(t.default,t.share),t!=="none"&&(la(e,n,t,null,!1)||_t(e.child,!1))}e=e.sibling}}function eu(e,t){if(e.tag===30){var n=e.stateNode,o=e.memoizedProps,a=Xt(o,n),l=Wt(o.default,n.paired?o.share:o.enter);l!=="none"?la(e,a,l,null,!1)?(ic(e),n.paired||t||Jo(e,o.onEnter)):_t(e.child,!1):ic(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)eu(e,t),e=e.sibling;else ic(e)}function tu(e){if(Ze!==null&&Ze.size!==0){var t=Ze;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.memoizedProps,o=n.name;if(o!=null&&o!=="auto"){var a=t.get(o);if(a!==void 0){var l=Wt(n.default,n.share);if(l!=="none"&&(la(e,o,l,null,!1)?(l=e.stateNode,a.paired=l,l.paired=a,Jo(e,n.onShare)):_t(e.child,!1)),t.delete(o),t.size===0)break}}}tu(e)}e=e.sibling}}}function nu(e){if(e.tag===30){var t=e.memoizedProps,n=Xt(t,e.stateNode),o=Ze!==null?Ze.get(n):void 0,a=Wt(t.default,o!==void 0?t.share:t.exit);a!=="none"&&(la(e,n,a,null,!1)?o!==void 0?(a=e.stateNode,o.paired=a,a.paired=o,Ze.delete(n),Jo(e,t.onShare)):Jo(e,t.onExit):_t(e.child,!1)),Ze!==null&&tu(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)nu(e),e=e.sibling;else Ze!==null&&tu(e)}function gv(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=Xt(t,e.stateNode);t=Wt(t.default,t.update),e.flags&=-5,t!=="none"&&la(e,n,t,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&gv(e);e=e.sibling}}function ou(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.stateNode;t.paired!==null&&(t.paired=null,_t(e.child,!1))}ou(e)}e=e.sibling}}function rc(e){if(e.tag===30)e.stateNode.paired=null,_t(e.child,!1),ou(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)rc(e),e=e.sibling;else ou(e)}function hv(e){for(e=e.child;e!==null;)e.tag===30?_t(e.child,!1):(e.subtreeFlags&33554432)!==0&&hv(e),e=e.sibling}function dd(e,t,n,o,a,l,c){for(var i=!1;t!==null;){if(t.tag===5){var r=t.stateNode;if(l!==null&&Ue<l.length){var d=l[Ue],b=yu(r);(d.view||b.view)&&(i=!0);var m;if(m=(e.flags&4)===0)if(b.clip)m=!0;else{m=d.rect;var f=b.rect;m=m.y!==f.y||m.x!==f.x||m.height!==f.height||m.width!==f.width}m&&(e.flags|=4),b.abs?b=!d.abs:(d=d.rect,b=b.rect,b=d.height!==b.height||d.width!==b.width),b&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&em(r,Ue===0?n:n+"_"+Ue,a),i&&(e.flags&4)!==0||(Tt===null&&(Tt=[]),Tt.push(r,Ue===0?o:o+"_"+Ue,t.memoizedProps)),Ue++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c?e.flags|=t.flags&32:dd(e,t.child,n,o,a,l,c)&&(i=!0));t=t.sibling}return i}function yv(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,o=e.stateNode,a=Xt(n,o),l=Wt(n.default,n.update);if(t){o=o.clones;var c=o===null?null:o.map(Z0)}else c=e.memoizedState,e.memoizedState=null;o=e;var i=e.child;Ue=0,a=dd(o,i,a,a,l,c,!1),(e.flags&4)!==0&&a&&(t||Jo(e,n.onUpdate))}else(e.subtreeFlags&33554432)!==0&&yv(e,t);e=e.sibling}}var pe=!1,G=!1,kt=!1,cr=!1,Gf=typeof WeakSet=="function"?WeakSet:Set,ve=null,xt=!1,Oa=!1,Uc=!1,au=!1;function g0(e,t,n){if(e=e.containerInfo,mu=ea,e=ap(e),Uu(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var a=o.getSelection&&o.getSelection();if(a&&a.rangeCount!==0){o=a.anchorNode;var l=a.anchorOffset,c=a.focusNode;a=a.focusOffset;try{o.nodeType,c.nodeType}catch{o=null;break e}var i=0,r=-1,d=-1,b=0,m=0,f=e,p=null;t:for(;;){for(var k;f!==o||l!==0&&f.nodeType!==3||(r=i+l),f!==c||a!==0&&f.nodeType!==3||(d=i+a),f.nodeType===3&&(i+=f.nodeValue.length),(k=f.firstChild)!==null;)p=f,f=k;for(;;){if(f===e)break t;if(p===o&&++b===l&&(r=i),p===c&&++m===a&&(d=i),(k=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=k}o=r===-1||d===-1?null:{start:r,end:d}}else o=null}o=o||{start:0,end:0}}else o=null;for(gu={focusedElem:e,selectionRange:o},ea=!1,n=(n&335544064)===n,ve=t,t=n?9270:1024;ve!==null;){if(e=ve,n&&(o=e.deletions,o!==null))for(l=0;l<o.length;l++)n&&nu(o[l]);if(e.alternate===null&&(e.flags&2)!==0)n&&jf(e),Xl(n);else{if(e.tag===22){if(o=e.alternate,e.memoizedState!==null){o!==null&&o.memoizedState===null&&n&&nu(o),Xl(n);continue}else if(o!==null&&o.memoizedState!==null){n&&jf(e),Xl(n);continue}}o=e.child,(e.subtreeFlags&t)!==0&&o!==null?(o.return=e,ve=o):(n&&gv(e),Xl(n))}}Ze=null}function Xl(e){for(;ve!==null;){var t=ve,n=e,o=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if((a&1024)!==0&&o!==null){n=void 0,a=o.memoizedProps,o=o.memoizedState;var l=t.stateNode;try{var c=to(t.type,a);n=l.getSnapshotBeforeUpdate(c,o),l.__reactInternalSnapshotBeforeUpdate=n}catch(i){Z(t,t.return,i)}}break;case 3:if((a&1024)!==0){if(o=t.stateNode.containerInfo,n=o.nodeType,n===9)ku(o);else if(n===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":ku(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&o!==null&&(n=Xt(o.memoizedProps,o.stateNode),a=t.memoizedProps,a=Wt(a.default,a.update),a!=="none"&&la(o,n,a,o.memoizedState=[],!0));break;default:if((a&1024)!==0)throw Error(h(163))}if(o=t.sibling,o!==null){o.return=t.return,ve=o;break}ve=t.return}}function kv(e,t,n){var o=n.flags;switch(n.tag){case 0:case 11:case 15:St(e,n),o&4&&fl(5,n);break;case 1:if(St(e,n),o&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){Z(n,n.return,c)}else{var a=to(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){Z(n,n.return,c)}}o&64&&fv(n),o&512&&wt(n,n.return);break;case 3:if(St(e,n),o&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Sp(e,t)}catch(c){Z(n,n.return,c)}}break;case 27:t===null&&o&4&&vv(n);case 26:case 5:St(e,n),t===null&&o&4&&Ir(n),o&512&&wt(n,n.return);break;case 12:St(e,n);break;case 31:St(e,n),o&4&&Tv(e,n);break;case 13:St(e,n),o&4&&Ev(e,n),o&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=C0.bind(null,n),ry(e,n))));break;case 22:if(o=n.memoizedState!==null||pe,!o){var l=t!==null&&t.memoizedState!==null||G;t=pe,a=G,pe=o,(G=l)&&!a?(o=2,(n.subtreeFlags&8772)!==0&&(o|=1),ft(e,n,o)):St(e,n),pe=t,G=a}break;case 30:St(e,n),o&512&&wt(n,n.return);break;case 7:o&512&&wt(n,n.return);default:St(e,n)}}function lu(e,t){for(e=e.child;e!==null;)xv(e,t),e=e.sibling}function xv(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var o=n.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var a=e.stateNode,l=e.memoizedProps.style,c=l!=null&&l.hasOwnProperty("display")?l.display:null;a.style.display=c==null||typeof c=="boolean"?"":(""+c).trim()}}catch(r){Z(e,e.return,r)}cu(e,t);break;case 6:try{e.stateNode.nodeValue=t?"":e.memoizedProps,q=!0}catch(r){Z(e,e.return,r)}break;case 18:try{var i=e.stateNode;t?lb(i,!0):lb(e.stateNode,!1)}catch(r){Z(e,e.return,r)}break;case 22:case 23:e.memoizedState===null&&lu(e,t);break;default:lu(e,t)}}function cu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var n=e,o=t;switch(n.tag){case 4:xv(n,o);break e;case 22:n.memoizedState===null&&cu(n,o);break e;default:cu(n,o)}}e=e.sibling}}function Sv(e){var t=e.alternate;t!==null&&(e.alternate=null,Sv(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Zc(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ne=null,Re=!1;function st(e,t,n){for(n=n.child;n!==null;)wv(e,t,n),n=n.sibling}function wv(e,t,n){if(Fe&&typeof Fe.onCommitFiberUnmount=="function")try{Fe.onCommitFiberUnmount(ll,n)}catch{}switch(n.tag){case 26:G||ye(n,t),st(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!G&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:G||ye(n,t),La(n);var o=ne,a=Re;Mn(n.type)&&(ne=n.stateNode,Re=!1),st(e,t,n),dm(n.stateNode,n.type,n.memoizedProps),ne=o,Re=a;break;case 5:G||ye(n,t),La(n);case 6:if(n.tag===6&&La(n),o=ne,a=Re,ne=null,st(e,t,n),ne=o,Re=a,ne!==null)if(Re)try{(ne.nodeType===9?ne.body:ne.nodeName==="HTML"?ne.ownerDocument.body:ne).removeChild(n.stateNode),q=!0}catch(l){Z(n,t,l)}else try{ne.removeChild(n.stateNode),q=!0}catch(l){Z(n,t,l)}break;case 18:ne!==null&&(Re?(e=ne,ab(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),ta(e)):ab(ne,n.stateNode));break;case 4:o=ne,a=Re,ne=n.stateNode.containerInfo,Re=!0,st(e,t,n),ne=o,Re=a;break;case 0:case 11:case 14:case 15:Cn(2,n,t),G||Cn(4,n,t),st(e,t,n);break;case 1:G||(ye(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"&&bv(n,t,o)),st(e,t,n);break;case 21:st(e,t,n);break;case 22:G=(o=G)||n.memoizedState!==null,st(e,t,n),G=o;break;case 30:ye(n,t),st(e,t,n);break;case 7:G||ye(n,t),st(e,t,n);break;default:st(e,t,n)}}function Tv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ta(e)}catch(n){Z(t,t.return,n)}}}function Ev(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ta(e)}catch(n){Z(t,t.return,n)}}function h0(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Gf),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Gf),t;default:throw Error(h(435,e.tag))}}function Ql(e,t){var n=h0(e);t.forEach(function(o){if(!n.has(o)){n.add(o);var a=A0.bind(null,e,o);o.then(a,a)}})}function Ae(e,t,n){var o=t.deletions;if(o!==null)for(var a=0;a<o.length;a++){var l=o[a],c=e,i=t,r=i;e:for(;r!==null;){switch(r.tag){case 27:if(Mn(r.type)){ne=r.stateNode,Re=!1;break e}break;case 5:ne=r.stateNode,Re=!1;break e;case 3:case 4:ne=r.stateNode.containerInfo,Re=!0;break e}r=r.return}if(ne===null)throw Error(h(160));wv(c,i,l),ne=null,Re=!1,c=l.alternate,c!==null&&(c.return=null),l.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)zv(t,e,n),t=t.sibling}var bt=null;function zv(e,t,n){var o=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(o=e.updateQueue,o=o!==null?o.events:null,o!==null))for(var l=0;l<o.length;l++){var c=o[l];c.ref.impl=c.nextImpl}Ae(t,e,n),_e(e),a&4&&(Cn(3,e,e.return),fl(3,e),Cn(5,e,e.return));break;case 1:Ae(t,e,n),_e(e),a&512&&(G||o===null||ye(o,o.return)),a&64&&pe&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(l=bt,Ae(t,e,n),_e(e),a&512&&(G||o===null||ye(o,o.return)),a&4)if(a=o!==null?o.memoizedState:null,n=e.memoizedState,o===null)if(n===null)if(e.stateNode===null)if(pe)e.stateNode=Pv(e.type,e.memoizedProps,t.containerInfo,e);else{e:{t=e.type,n=e.memoizedProps,a=l.ownerDocument||l;t:switch(t){case"title":o=a.getElementsByTagName("title")[0],(!o||o[rl]||o[ke]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(t),a.head.insertBefore(o,a.querySelector("head > title"))),Te(o,t,n),o[ke]=e,me(o),t=o;break e;case"link":if(l=bb("link","href",a).get(t+(n.href||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){l.splice(c,1);break t}}o=a.createElement(t),Te(o,t,n),a.head.appendChild(o);break;case"meta":if(l=bb("meta","content",a).get(t+(n.content||""))){for(c=0;c<l.length;c++)if(o=l[c],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){l.splice(c,1);break t}}o=a.createElement(t),Te(o,t,n),a.head.appendChild(o);break;default:throw Error(h(468,t))}o[ke]=e,me(o),t=o}e.stateNode=t}else pe||wu(l,e.type,e.stateNode);else e.stateNode=fb(l,n,e.memoizedProps);else a!==n?(a===null?(t=o.stateNode,t===null||G||t.parentNode.removeChild(t)):a.count--,n===null?pe||wu(l,e.type,e.stateNode):fb(l,n,e.memoizedProps)):n===null&&e.stateNode!==null&&ar(e,e.memoizedProps,o.memoizedProps);break;case 27:Ae(t,e,n),_e(e),a&512&&(G||o===null||ye(o,o.return)),o!==null&&a&4&&ar(e,e.memoizedProps,o.memoizedProps);break;case 5:if(l=kt,kt=!1,Ae(t,e,n),kt=l,_e(e),a&512&&(G||o===null||ye(o,o.return)),e.flags&32){t=e.stateNode;try{Qo(t,""),q=!0}catch(b){Z(e,e.return,b)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,ar(e,t,o!==null?o.memoizedProps:t)),a&1024&&(cr=!0);break;case 6:if(Ae(t,e,n),_e(e),a&4){if(e.stateNode===null)throw Error(h(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,q=!0}catch(b){Z(e,e.return,b)}}break;case 3:if(q=!1,fc=null,l=bt,bt=el(t.containerInfo),Ae(t,e,n),bt=l,_e(e),a&4&&o!==null&&o.memoizedState.isDehydrated)try{ta(t.containerInfo)}catch(b){Z(e,e.return,b)}cr&&(cr=!1,Nv(e)),q=!1;break;case 4:a=kt,kt=pe,o=Js(),l=bt,bt=el(e.stateNode.containerInfo),Ae(t,e,n),_e(e),bt=l,q&&Oa&&(Uc=!0),q=o,kt=a;break;case 12:Ae(t,e,n),_e(e);break;case 31:Ae(t,e,n),_e(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Ql(e,t)));break;case 13:Ae(t,e,n),_e(e),e.child.flags&8192&&e.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(li=Je()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Ql(e,t)));break;case 22:l=e.memoizedState!==null,c=o!==null&&o.memoizedState!==null;var i=pe,r=G,d=kt;pe=i||l,kt=d||l,G=r||c,Ae(t,e,n),G=r,kt=d,pe=i,_e(e),a&8192&&(t=e.stateNode,t._visibility=l?t._visibility&-2:t._visibility|1,!l||o===null||c||pe||G||(t=c||G,n=pe,o=G,pe=l||pe,G=t,ln(e,2),pe=n,G=o),!l&&kt||lu(e,l)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Ql(e,n))));break;case 19:Ae(t,e,n),_e(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Ql(e,t)));break;case 30:a&512&&(G||o===null||ye(o,o.return)),a=Js(),l=Oa,c=(n&335544064)===n,i=e.memoizedProps,Oa=c&&Wt(i.default,i.update)!=="none",Ae(t,e,n),_e(e),c&&o!==null&&q&&(e.flags|=4),Oa=l,q=a;break;case 21:break;case 7:a&512&&(G||o===null||ye(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=e);default:Ae(t,e,n),_e(e)}}function _e(e){var t=e.flags;if(t&2){try{for(var n,o=e.return;o!==null;){if(pv(o)){n=o;break}o=o.return}o=null;for(var a=e.return;a!==null;){if(ud(a)){var l=a.stateNode;o===null?o=[l]:o.push(l)}if(rd(a))break;a=a.return}var c=o;if(n==null)throw Error(h(160));switch(n.tag){case 27:var i=n.stateNode,r=lr(e);Rc(e,r,i,c);break;case 5:var d=n.stateNode;n.flags&32&&(Qo(d,""),n.flags&=-33);var b=lr(e);Rc(e,b,d,c);break;case 3:case 4:var m=n.stateNode.containerInfo,f=lr(e);Pr(e,f,m,c);break;default:throw Error(h(161))}}catch(p){Z(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Nv(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Nv(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,ea=!0,t.reset(),ea=!1),e=e.sibling}}function go(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Ov(t,e),t=t.sibling;else yv(t,!1)}function Ov(e,t){var n=e.alternate;if(n===null)eu(e,!1);else switch(e.tag){case 3:if(au=xt=!1,Vf(),go(t,e),!xt&&!Uc){if(e=Tt,e!==null)for(var o=0;o<e.length;o+=3){n=e[o];var a=e[o+1];tm(n,e[o+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+a+")"})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),au=!0}Tt=null;break;case 5:go(t,e);break;case 4:o=xt,xt=!1,go(t,e),xt&&(Uc=!0),xt=o;break;case 22:e.memoizedState===null&&(n.memoizedState!==null?eu(e,!1):go(t,e));break;case 30:o=xt,a=Vf(),xt=!1,go(t,e),xt&&(e.flags|=4);var l=e.memoizedProps,c=e.stateNode;t=Xt(l,c),c=Xt(n.memoizedProps,c);var i=Wt(l.default,l.update);i==="none"?t=!1:(l=n.memoizedState,n.memoizedState=null,n=e.child,Ue=0,t=dd(e,n,t,c,i,l,!0),Ue!==(l===null?0:l.length)&&(e.flags|=32)),(e.flags&4)!==0&&t?(Jo(e,e.memoizedProps.onUpdate),Tt=a):a!==null&&(a.push.apply(a,Tt),Tt=a),xt=(e.flags&32)!==0?!0:o;break;default:go(t,e)}}function St(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)kv(e,t.alternate,t),t=t.sibling}function ln(e,t){for(e=e.child;e!==null;){var n=e,o=t;switch(n.tag){case 0:case 11:case 14:case 15:Cn(4,n,n.return),ln(n,o);break;case 1:ye(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&bv(n,n.return,a),ln(n,o);break;case 27:(o&2)!==0&&dm(n.stateNode,n.type,n.memoizedProps);case 5:ye(n,n.return),n.tag!==5&&n.tag!==27||La(n),ln(n,o);break;case 6:La(n);break;case 26:ye(n,n.return),a=n.stateNode,n.memoizedState!==null||a===null||G||a.parentNode.removeChild(a),ln(n,o);break;case 22:n.memoizedState===null&&ln(n,o);break;case 30:ye(n,n.return),ln(n,o);break;case 7:ye(n,n.return);default:ln(n,o)}e=e.sibling}}function ft(e,t,n){for(n=(t.subtreeFlags&8772)!==0?n:n&-2,t=t.child;t!==null;){var o=t.alternate,a=e,l=t,c=l.flags,i=(n&1)!==0;switch(l.tag){case 0:case 11:case 15:ft(a,l,n),fl(4,l);break;case 1:if(ft(a,l,n),o=l,a=o.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(b){Z(o,o.return,b)}if(o=l,a=o.updateQueue,a!==null){var r=o.stateNode;try{var d=a.shared.hiddenCallbacks;if(d!==null)for(a.shared.hiddenCallbacks=null,a=0;a<d.length;a++)xp(d[a],r)}catch(b){Z(o,o.return,b)}}i&&c&64&&fv(l),wt(l,l.return);break;case 27:(n&2)!==0&&vv(l);case 5:l.tag!==5&&l.tag!==27||Yf(l),ft(a,l,n),i&&o===null&&c&4&&Ir(l),wt(l,l.return);break;case 6:Yf(l);break;case 26:r=l.stateNode,l.memoizedState!==null||r===null||pe||wu(el(r.ownerDocument),l.type,r),ft(a,l,n),i&&o===null&&c&4&&Ir(l),wt(l,l.return);break;case 12:ft(a,l,n);break;case 31:ft(a,l,n),i&&c&4&&Tv(a,l);break;case 13:ft(a,l,n),i&&c&4&&Ev(a,l);break;case 22:l.memoizedState===null&&ft(a,l,n),wt(l,l.return);break;case 30:ft(a,l,n),wt(l,l.return);break;case 7:wt(l,l.return);default:ft(a,l,n)}t=t.sibling}}function sd(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&dl(n))}function fd(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&dl(e))}function nt(e,t,n,o){var a=(n&335544064)===n;if(t.subtreeFlags&(a?10262:10256))for(t=t.child;t!==null;)Cv(e,t,n,o),t=t.sibling;else a&&hv(t)}function Cv(e,t,n,o){var a=(n&335544064)===n;a&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&rc(t);var l=t.flags;switch(t.tag){case 0:case 11:case 15:nt(e,t,n,o),l&2048&&fl(9,t);break;case 1:nt(e,t,n,o);break;case 3:nt(e,t,n,o),a&&au&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),l&2048&&(l=null,t.alternate!==null&&(l=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==l&&(t.refCount++,l!=null&&dl(l)));break;case 12:if(l&2048){nt(e,t,n,o),l=t.stateNode;try{var c=t.memoizedProps,i=c.id,r=c.onPostCommit;typeof r=="function"&&r(i,t.alternate===null?"mount":"update",l.passiveEffectDuration,-0)}catch(d){Z(t,t.return,d)}}else nt(e,t,n,o);break;case 31:nt(e,t,n,o);break;case 13:nt(e,t,n,o);break;case 23:break;case 22:c=t.stateNode,i=t.alternate,t.memoizedState!==null?(a&&i!==null&&i.memoizedState===null&&rc(i),c._visibility&2?nt(e,t,n,o):qa(e,t)):(a&&i!==null&&i.memoizedState!==null&&rc(t),c._visibility&2?nt(e,t,n,o):(c._visibility|=2,yo(e,t,n,o,(t.subtreeFlags&10256)!==0||!1))),l&2048&&sd(i,t);break;case 24:nt(e,t,n,o),l&2048&&fd(t.alternate,t);break;case 30:a&&(l=t.alternate,l!==null&&(_t(l.child,!0),_t(t.child,!0))),nt(e,t,n,o);break;default:nt(e,t,n,o)}}function yo(e,t,n,o,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var l=e,c=t,i=n,r=o,d=c.flags;switch(c.tag){case 0:case 11:case 15:yo(l,c,i,r,a),fl(8,c);break;case 23:break;case 22:var b=c.stateNode;c.memoizedState!==null?b._visibility&2?yo(l,c,i,r,a):qa(l,c):(b._visibility|=2,yo(l,c,i,r,a)),a&&d&2048&&sd(c.alternate,c);break;case 24:yo(l,c,i,r,a),a&&d&2048&&fd(c.alternate,c);break;default:yo(l,c,i,r,a)}t=t.sibling}}function qa(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,o=t,a=o.flags;switch(o.tag){case 22:qa(n,o),a&2048&&sd(o.alternate,o);break;case 24:qa(n,o),a&2048&&fd(o.alternate,o);break;default:qa(n,o)}t=t.sibling}}var jn=8192;function Ln(e,t,n){if(e.subtreeFlags&jn)for(e=e.child;e!==null;)Av(e,t,n),e=e.sibling}function Av(e,t,n){switch(e.tag){case 26:Ln(e,t,n),e.flags&jn&&(e.memoizedState!==null?Sy(n,bt,e.memoizedState,e.memoizedProps):(e=e.stateNode,(t&335544128)===t&&vb(n,e)));break;case 5:Ln(e,t,n),e.flags&jn&&(e=e.stateNode,(t&335544128)===t&&vb(n,e));break;case 3:case 4:var o=bt;bt=el(e.stateNode.containerInfo),Ln(e,t,n),bt=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=jn,jn=16777216,Ln(e,t,n),jn=o):Ln(e,t,n));break;case 30:if((e.flags&jn)!==0&&(o=e.memoizedProps.name,o!=null&&o!=="auto")){var a=e.stateNode;a.paired=null,Ze===null&&(Ze=new Map),Ze.set(o,a)}Ln(e,t,n);break;default:Ln(e,t,n)}}function _v(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function xa(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];ve=o,Dv(o,e)}_v(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Mv(e),e=e.sibling}function Mv(e){switch(e.tag){case 0:case 11:case 15:xa(e),e.flags&2048&&Cn(9,e,e.return);break;case 3:xa(e);break;case 12:xa(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,uc(e)):xa(e);break;default:xa(e)}}function uc(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];ve=o,Dv(o,e)}_v(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Cn(8,t,t.return),uc(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,uc(t));break;default:uc(t)}e=e.sibling}}function Dv(e,t){for(;ve!==null;){var n=ve;switch(n.tag){case 0:case 11:case 15:Cn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var o=n.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:dl(n.memoizedState.cache)}if(o=n.child,o!==null)o.return=n,ve=o;else e:for(n=e;ve!==null;){o=ve;var a=o.sibling,l=o.return;if(Sv(o),o===n){ve=null;break e}if(a!==null){a.return=l,ve=a;break e}ve=l}}}var y0={getCacheForType:function(e){var t=xe(re),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return xe(re).controller.signal}},k0=typeof WeakMap=="function"?WeakMap:Map,j=0,J=null,R=null,U=0,X=0,Ge=null,bn=!1,ca=!1,bd=!1,Jt=0,le=0,An=0,Jn=0,Hc=0,Ke=0,Ko=0,Ya=null,Be=null,iu=!1,li=0,Rv=0,Lc=1/0,qc=null,Sn=null,oe=0,vt=null,no=null,At=0,ru=0,uu=null,Bv=null,Yo=null,jo=null,Vo=null,ja=0,dc=null;function $e(){return(j&2)!==0&&U!==0?U&-U:N.T!==null?vd():qb()}function Uv(){if(Ke===0)if((U&536870912)===0||_){var e=Ml;Ml<<=1,(Ml&3932160)===0&&(Ml=262144),Ke=e}else Ke=536870912;return e=Ee.current,e!==null&&(e.flags|=32),Ke}function Jo(e,t){if(t!=null){var n=e.stateNode,o=n.ref;o===null&&(o=n.ref=om(Xt(e.memoizedProps,n))),jo===null&&(jo=[]),jo.push(t.bind(null,o))}}function Le(e,t,n){(e===J&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(Fo(e,0),pn(e,U,Ke,!1)),il(e,n),((j&2)===0||e!==J)&&(e===J&&((j&2)===0&&(Jn|=n),le===4&&pn(e,U,Ke,!1)),Dt(e))}function Hv(e,t,n){if((j&6)!==0)throw Error(h(327));var o=!n&&(t&127)===0&&(t&e.expiredLanes)===0||cl(e,t),a=o?w0(e,t):ir(e,t,!0),l=o;do{if(a===0){ca&&!o&&pn(e,t,0,!1);break}else{if(n=e.current.alternate,l&&!x0(n)){a=ir(e,t,!1),l=!1;continue}if(a===2){if(l=t,e.errorRecoveryDisabledLanes&l)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var i=e;a=Ya;var r=i.current.memoizedState.isDehydrated;if(r&&(Fo(i,c).flags|=256),c=ir(i,c,!1),c!==2&&c!==6){if(bd&&!r){i.errorRecoveryDisabledLanes|=l,Jn|=l,a=4;break e}l=Be,Be=a,l!==null&&(Be===null?Be=l:Be.push.apply(Be,l))}a=c}if(l=!1,a!==2)continue}}if(a===1){Fo(e,0),pn(e,t,0,!0);break}e:{switch(o=e,l=a,l){case 0:case 1:throw Error(h(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:pn(o,t,Ke,!bn);break e;case 2:Be=null;break;case 3:case 5:break;default:throw Error(h(329))}if((t&62914560)===t&&(a=li+300-Je(),10<a)){if(pn(o,t,Ke,!bn),Qc(o,0,!0)!==0)break e;At=t,o.timeoutHandle=gd(Xf.bind(null,o,n,Be,qc,iu,t,Ke,Jn,Ko,bn,l,"Throttled",-0,0),a);break e}Xf(o,n,Be,qc,iu,t,Ke,Jn,Ko,bn,l,null,-0,0)}}break}while(!0);Dt(e)}function Xf(e,t,n,o,a,l,c,i,r,d,b,m,f,p){e.timeoutHandle=-1;var k=t.subtreeFlags,S=(l&335544064)===l;if(m=null,(S||k&8192||(k&16785408)===16785408)&&(m={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:zt},Ze=null,Av(t,l,m),S&&(k=m,S=e.containerInfo,S=(S.nodeType===9?S:S.ownerDocument).__reactViewTransition,S!=null&&(k.count++,k.waitingForViewTransition=!0,k=tl.bind(k),S.finished.then(k,k))),k=(l&62914560)===l?li-Je():(l&4194048)===l?Rv-Je():0,k=wy(m,k),k!==null)){At=l,e.cancelPendingCommit=k(Zf.bind(null,e,t,l,n,o,a,c,i,r,d,b,m,null,f,p)),pn(e,l,c,!d);return}Zf(e,t,l,n,o,a,c,i,r,d,b,m)}function x0(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var o=0;o<n.length;o++){var a=n[o],l=a.getSnapshot;a=a.value;try{if(!Ie(l(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function pn(e,t,n,o){t=Rb(e,t),t&=~Hc,t&=~Jn,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var a=t;0<a;){var l=31-We(a),c=1<<l;o[l]=-1,a&=~c}n!==0&&Ub(e,n,t)}function ci(){return(j&6)===0?(bl(0,!1),!1):!0}function pd(){if(R!==null){if(X===0)var e=R.return;else e=R,Yt=io=null,$u(e),Ho=null,Ja=0,e=R;for(;e!==null;)sv(e.alternate,e),e=e.return;R=null}}function Fo(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,G0(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),At=0,pd(),J=e,R=n=jt(e.current,null),U=t,X=0,Ge=null,bn=!1,ca=cl(e,t),bd=!1,Ko=Ke=Hc=Jn=An=le=0,Be=Ya=null,iu=!1,Jt=Rb(e,t),Wc(),n}function Lv(e,t){A=null,N.H=_c,t===aa||t===Pc?(t=gf(),X=3):t===Gu?(t=gf(),X=4):X=t===ld?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Ge=t,R===null&&(le=1,Mc(e,it(t,e.current)))}function qv(){var e=Ee.current;return e===null?!0:(U&4194048)===U?Oe===null:(U&62914560)===U||(U&536870912)!==0?e===Oe:!1}function Yv(){var e=N.H;return N.H=_c,e===null?_c:e}function jv(){var e=N.A;return N.A=y0,e}function Yc(){le=4,bn||(U&4194048)!==U&&Ee.current!==null||(ca=!0),(An&134217727)===0&&(Jn&134217727)===0||J===null||pn(J,U,Ke,!1)}function ir(e,t,n){var o=j;j|=2;var a=Yv(),l=jv();(J!==e||U!==t)&&(qc=null,Fo(e,t)),t=!1;var c=le;e:do try{if(X!==0&&R!==null){var i=R,r=Ge;switch(X){case 8:pd(),c=6;break e;case 3:case 2:case 9:case 6:Ee.current===null&&(t=!0);var d=X;if(X=0,Ge=null,Mo(e,i,r,d),n&&ca){c=0;break e}break;default:d=X,X=0,Ge=null,Mo(e,i,r,d)}}S0(),c=le;break}catch(b){Lv(e,b)}while(!0);return t&&e.shellSuspendCounter++,Yt=io=null,j=o,N.H=a,N.A=l,R===null&&(J=null,U=0,Wc()),c}function S0(){for(;R!==null;)Vv(R)}function w0(e,t){var n=j;j|=2;var o=Yv(),a=jv();J!==e||U!==t?(qc=null,Lc=Je()+500,Fo(e,t)):ca=cl(e,t);e:do try{if(X!==0&&R!==null){t=R;var l=Ge;t:switch(X){case 1:X=0,Ge=null,Mo(e,t,l,1);break;case 2:case 9:if(mf(l)){X=0,Ge=null,Qf(t);break}t=function(){X!==2&&X!==9||J!==e||(X=7),Dt(e)},l.then(t,t);break e;case 3:X=7;break e;case 4:X=5;break e;case 7:mf(l)?(X=0,Ge=null,Qf(t)):(X=0,Ge=null,Mo(e,t,l,7));break;case 5:var c=null;switch(R.tag){case 26:c=R.memoizedState;case 5:case 27:var i=R;if(c?bm(c):i.stateNode.complete){X=0,Ge=null;var r=i.sibling;if(r!==null)R=r;else{var d=i.return;d!==null?(R=d,ii(d)):R=null}break t}}X=0,Ge=null,Mo(e,t,l,5);break;case 6:X=0,Ge=null,Mo(e,t,l,6);break;case 8:pd(),le=6;break e;default:throw Error(h(462))}}T0();break}catch(b){Lv(e,b)}while(!0);return Yt=io=null,N.H=o,N.A=a,j=n,R!==null?0:(J=null,U=0,Wc(),le)}function T0(){for(;R!==null&&!jg();)Vv(R)}function Vv(e){var t=dv(e.alternate,e,Jt);e.memoizedProps=e.pendingProps,t===null?ii(e):R=t}function Qf(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Df(n,t,t.pendingProps,t.type,void 0,U);break;case 11:t=Df(n,t,t.pendingProps,t.type.render,t.ref,U);break;case 5:$u(t);var o=t;o===ge&&(_?(Tc(o),o.tag===5&&o.stateNode!=null&&(I=o.stateNode)):(Tc(o),_=!0));default:sv(n,t),t=R=fp(t,Jt),t=dv(n,t,Jt)}e.memoizedProps=e.pendingProps,t===null?ii(e):R=t}function Mo(e,t,n,o){Yt=io=null,$u(t),Ho=null,Ja=0;var a=t.return;try{if(s0(e,a,t,n,U)){le=1,Mc(e,it(n,e.current)),R=null;return}}catch(l){if(a!==null)throw R=a,l;le=1,Mc(e,it(n,e.current)),R=null;return}t.flags&32768?(_||o===1?e=!0:ca||(U&536870912)!==0?e=!1:(bn=e=!0,(o===2||o===9||o===3||o===6)&&(o=Ee.current,o!==null&&o.tag===13&&(o.flags|=16384))),Gv(t,e)):ii(t)}function ii(e){var t=e;do{if((t.flags&32768)!==0){Gv(t,bn);return}e=t.return;var n=v0(t.alternate,t,Jt);if(n!==null){R=n;return}if(t=t.sibling,t!==null){R=t;return}R=t=e}while(t!==null);le===0&&(le=5)}function Gv(e,t){do{var n=m0(e.alternate,e);if(n!==null){n.flags&=32767,R=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){R=e;return}R=e=n}while(e!==null);le=6,R=null}function Zf(e,t,n,o,a,l,c,i,r,d,b,m){e.cancelPendingCommit=null;do ri();while(oe!==0);if((j&6)!==0)throw Error(h(327));if(t!==null){if(t===e.current)throw Error(h(177));e===J&&(R=J=null,U=0),no=t,vt=e,At=n,uu=a,Bv=o,E0(e,t,n,c,i,r,m)}}function E0(e,t,n,o,a,l,c){var i=t.lanes|t.childLanes;if(ru=i,i|=Hu,$g(e,n,i,o,a,l),jo=null,(n&335544064)===n?(Vo=Ph(e),o=10262):(Vo=null,o=10256),(t.subtreeFlags&o)!==0||(t.flags&o)!==0?(e.callbackNode=null,e.callbackPriority=0,_0(yc,function(){return bu(),null})):(e.callbackNode=null,e.callbackPriority=0),Bc=!1,o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=N.T,N.T=null,a=V.p,V.p=2,l=j,j|=4;try{g0(e,t,n)}finally{j=l,V.p=a,N.T=o}}oe=1,Bc?Yo=F0(c,e.containerInfo,Vo,du,su,N0,fu,bu,z0,null,null):(du(),su(),fu())}function z0(e){if(oe!==0){var t=vt.onRecoverableError;t(e,{componentStack:null})}}function N0(){oe===3&&(oe=0,Ov(no,vt),oe=4)}function du(){if(oe===1){oe=0;var e=vt,t=no,n=At,o=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||o){o=N.T,N.T=null;var a=V.p;V.p=2;var l=j;j|=4;try{Oa=Uc=!1,zv(t,e,n),n=gu;var c=ap(e.containerInfo),i=n.focusedElem,r=n.selectionRange;if(c!==i&&i&&i.ownerDocument&&op(i.ownerDocument.documentElement,i)){if(r!==null&&Uu(i)){var d=r.start,b=r.end;if(b===void 0&&(b=d),"selectionStart"in i)i.selectionStart=d,i.selectionEnd=Math.min(b,i.value.length);else{var m=i.ownerDocument||document,f=m&&m.defaultView||window;if(f.getSelection){var p=f.getSelection(),k=i.textContent.length,S=Math.min(r.start,k),z=r.end===void 0?S:Math.min(r.end,k);!p.extend&&S>z&&(c=z,z=S,S=c);var v=rf(i,S),u=rf(i,z);if(v&&u&&(p.rangeCount!==1||p.anchorNode!==v.node||p.anchorOffset!==v.offset||p.focusNode!==u.node||p.focusOffset!==u.offset)){var s=m.createRange();s.setStart(v.node,v.offset),p.removeAllRanges(),S>z?(p.addRange(s),p.extend(u.node,u.offset)):(s.setEnd(u.node,u.offset),p.addRange(s))}}}}for(m=[],p=i;p=p.parentNode;)p.nodeType===1&&m.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof i.focus=="function"&&i.focus(),i=0;i<m.length;i++){var g=m[i];g.element.scrollLeft=g.left,g.element.scrollTop=g.top}}ea=!!mu,gu=mu=null}finally{j=l,V.p=a,N.T=o}}e.current=t,oe=2}}function su(){if(oe===2){oe=0;var e=vt,t=no,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=N.T,N.T=null;var o=V.p;V.p=2;var a=j;j|=4;try{kv(e,t.alternate,t)}finally{j=a,V.p=o,N.T=n}}oe=3}}function fu(){if(oe===4||oe===3){oe=0;var e=Yo;Yo=null,Vg();var t=vt,n=no,o=At,a=Bv,l=(o&335544064)===o?10262:10256;if((n.subtreeFlags&l)!==0||(n.flags&l)!==0?oe=5:(oe=0,no=vt=null,Xv(t,t.pendingLanes)),l=t.pendingLanes,l===0&&(Sn=null),Au(o),n=n.stateNode,Fe&&typeof Fe.onCommitFiberRoot=="function")try{Fe.onCommitFiberRoot(ll,n,void 0,(n.current.flags&128)===128)}catch{}if(a!==null){n=N.T,l=V.p,V.p=2,N.T=null;try{for(var c=t.onRecoverableError,i=0;i<a.length;i++){var r=a[i];c(r.value,{componentStack:r.stack})}}finally{N.T=n,V.p=l}}if(a=jo,c=Vo,Vo=null,a!==null&&(jo=null,c===null&&(c=[]),e!==null))for(r=0;r<a.length;r++)n=(0,a[r])(c),n!==void 0&&e.finished.finally(n);(At&3)!==0&&ri(),Dt(t),l=t.pendingLanes,(o&261930)!==0&&(l&42)!==0?t===dc?ja++:(ja=0,dc=t):(ja=0,dc=null),bl(0,!1)}}function Xv(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,dl(t)))}function ri(){return Yo!==null&&(Yo.skipTransition(),Yo=null),du(),su(),fu(),bu()}function bu(){if(oe!==5)return!1;var e=vt,t=ru;ru=0;var n=Au(At),o=N.T,a=V.p;try{V.p=32>n?32:n,N.T=null,n=uu,uu=null;var l=vt,c=At;if(oe=0,no=vt=null,At=0,(j&6)!==0)throw Error(h(331));var i=j;if(j|=4,Mv(l.current),Cv(l,l.current,c,n),j=i,bl(0,!1),Fe&&typeof Fe.onPostCommitFiberRoot=="function")try{Fe.onPostCommitFiberRoot(ll,l)}catch{}return!0}finally{V.p=a,N.T=o,Xv(e,t)}}function Kf(e,t,n){t=it(n,t),t=Zr(e.stateNode,t,2),e=yn(e,t,2),e!==null&&(il(e,2),Dt(e))}function Z(e,t,n){if(e.tag===3)Kf(e,e,n);else for(;t!==null;){if(t.tag===3){Kf(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Sn===null||!Sn.has(o))){e=it(n,e),n=lv(2),o=yn(t,n,2),o!==null&&(cv(n,o,t,e),il(o,2),Dt(o));break}}t=t.return}}function rr(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new k0;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(n)||(bd=!0,a.add(n),e=O0.bind(null,e,t,n),t.then(e,e))}function O0(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,J===e&&(U&n)===n&&((le===4||le===3&&(U&62914560)===U&&300>Je()-li)&&(j&2)===0?Fo(e,0):Hc|=n,Ko===U&&(Ko=0)),Dt(e)}function Qv(e,t){t===0&&(t=Bb()),e=co(e,t),e!==null&&(il(e,t),Dt(e))}function C0(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Qv(e,n)}function A0(e,t){var n=0;switch(e.tag){case 31:case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(h(314))}o!==null&&o.delete(t),Qv(e,n)}function _0(e,t){return Ou(e,t)}var Wo=null,ko=null,pu=!1,jc=!1,ur=!1,vn=0;function Dt(e){e!==ko&&e.next===null&&(ko===null?Wo=ko=e:ko=ko.next=e),jc=!0,pu||(pu=!0,D0())}function bl(e,t){if(!ur&&jc){ur=!0;do for(var n=!1,o=Wo;o!==null;){if(!t)if(e!==0){var a=o.pendingLanes;if(a===0)var l=0;else{var c=o.suspendedLanes,i=o.pingedLanes;l=(1<<31-We(42|e)+1)-1,l&=a&~(c&~i),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(n=!0,Jf(o,l))}else l=U,l=Qc(o,o===J?l:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(l&3)===0||cl(o,l)||(n=!0,Jf(o,l));o=o.next}while(n);ur=!1}}function M0(){Zv()}function Zv(){jc=pu=!1;var e=0;vn!==0&&V0()&&(e=vn);for(var t=Je(),n=null,o=Wo;o!==null;){var a=o.next,l=Kv(o,t);l===0?(o.next=null,n===null?Wo=a:n.next=a,a===null&&(ko=n)):(n=o,(e!==0||(l&3)!==0)&&(jc=!0)),o=a}oe!==0&&oe!==5||bl(e,!1),vn!==0&&(vn=0)}function Kv(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var c=31-We(l),i=1<<c,r=a[c];r===-1?((i&n)===0||(i&o)!==0)&&(a[c]=Wg(i,t)):r<=t&&(e.expiredLanes|=i),l&=~i}if(t=J,n=U,n=Qc(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&ji(o),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||cl(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(o!==null&&ji(o),Au(n)){case 2:case 8:n=Mb;break;case 32:n=yc;break;case 268435456:n=Db;break;default:n=yc}return o=Jv.bind(null,e),n=Ou(n,o),e.callbackPriority=t,e.callbackNode=n,t}return o!==null&&o!==null&&ji(o),e.callbackPriority=2,e.callbackNode=null,2}function Jv(e,t){if(oe!==0&&oe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(ri()&&e.callbackNode!==n)return null;var o=U;return o=Qc(e,e===J?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(Hv(e,o,t),Kv(e,Je()),e.callbackNode!=null&&e.callbackNode===n?Jv.bind(null,e):null)}function Jf(e,t){if(ri())return null;Hv(e,t,!0)}function D0(){X0(function(){(j&6)!==0?Ou(_b,M0):Zv()})}function vd(){if(vn===0){var e=In;e===0&&(e=_l,_l<<=1,(_l&261888)===0&&(_l=256)),vn=e}return vn}function Ff(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Il(e)}function R0(e,t,n,o,a){if(t==="submit"&&n&&n.stateNode===a){var l=Ff((a[Ye]||null).action),c=o.submitter;c&&(t=(t=c[Ye]||null)?Ff(t.formAction):c.getAttribute("formAction"),t!==null&&(l=t,c=null));var i=new Kc("action","action",null,o,a);e.push({event:i,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(vn!==0){var r=new FormData(a,c);Xr(n,{pending:!0,data:r,method:a.method,action:l},null,r)}}else typeof l=="function"&&(i.preventDefault(),r=new FormData(a,c),Xr(n,{pending:!0,data:r,method:a.method,action:l},l,r))},currentTarget:a}]})}}for(Zl=0;Zl<Dr.length;Zl++)Kl=Dr[Zl],Wf=Kl.toLowerCase(),$f=Kl[0].toUpperCase()+Kl.slice(1),mt(Wf,"on"+$f);var Kl,Wf,$f,Zl;mt(cp,"onAnimationEnd");mt(ip,"onAnimationIteration");mt(rp,"onAnimationStart");mt("dblclick","onDoubleClick");mt("focusin","onFocus");mt("focusout","onBlur");mt(Qh,"onTransitionRun");mt(Zh,"onTransitionStart");mt(Kh,"onTransitionCancel");mt(up,"onTransitionEnd");Xo("onMouseEnter",["mouseout","mouseover"]);Xo("onMouseLeave",["mouseout","mouseover"]);Xo("onPointerEnter",["pointerout","pointerover"]);Xo("onPointerLeave",["pointerout","pointerover"]);ao("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));ao("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));ao("onBeforeInput",["compositionend","keypress","textInput","paste"]);ao("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));ao("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));ao("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var $a="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),B0=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat($a));function Fv(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],a=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var c=o.length-1;0<=c;c--){var i=o[c],r=i.instance,d=i.currentTarget;if(i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(b){xc(b)}a.currentTarget=null,l=r}else for(c=0;c<o.length;c++){if(i=o[c],r=i.instance,d=i.currentTarget,i=i.listener,r!==l&&a.isPropagationStopped())break e;l=i,a.currentTarget=d;try{l(a)}catch(b){xc(b)}a.currentTarget=null,l=r}}}}function D(e,t){var n=t[Xs];n===void 0&&(n=t[Xs]=new Set);var o=e+"__bubble";n.has(o)||(Wv(t,e,2,!1),n.add(o))}function dr(e,t,n){var o=0;t&&(o|=4),Wv(n,e,o,t)}var Jl="_reactListening"+Math.random().toString(36).slice(2);function md(e){if(!e[Jl]){e[Jl]=!0,jb.forEach(function(n){n!=="selectionchange"&&(B0.has(n)||dr(n,!1,e),dr(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Jl]||(t[Jl]=!0,dr("selectionchange",!1,t))}}function Wv(e,t,n,o){switch(km(t)){case 2:var a=Ny;break;case 8:a=Oy;break;default:a=wd}n=a.bind(null,t,n,e),a=void 0,!Cr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function sr(e,t,n,o,a){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var c=o.tag;if(c===3||c===4){var i=o.stateNode.containerInfo;if(i===a)break;if(c===4)for(c=o.return;c!==null;){var r=c.tag;if((r===3||r===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;i!==null;){if(c=Vn(i),c===null)return;if(r=c.tag,r===5||r===6||r===26||r===27){o=l=c;continue e}i=i.parentNode}}o=o.return}Fb(function(){var d=l,b=Mu(n),m=[];e:{var f=dp.get(e);if(f!==void 0){var p=Kc,k=e;switch(e){case"keypress":if(ec(n)===0)break e;case"keydown":case"keyup":p=xh;break;case"focusin":k="focus",p=Ki;break;case"focusout":k="blur",p=Ki;break;case"beforeblur":case"afterblur":p=Ki;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Is;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=uh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=zh;break;case cp:case ip:case rp:p=fh;break;case up:p=Oh;break;case"scroll":case"scrollend":p=ih;break;case"wheel":p=Ah;break;case"copy":case"cut":case"paste":p=ph;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=ef;break;case"submit":p=Th;break;case"toggle":case"beforetoggle":p=Mh}var S=(t&4)!==0,z=!S&&(e==="scroll"||e==="scrollend"),v=S?f!==null?f+"Capture":null:f;S=[];for(var u=d,s;u!==null;){var g=u;if(s=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||s===null||v===null||(g=Ga(u,v),g!=null&&S.push(Ia(u,g,s))),z)break;u=u.return}0<S.length&&(f=new p(f,k,null,n,b),m.push({event:f,listeners:S}))}}if((t&7)===0){e:{if(p=e==="mouseover"||e==="pointerover",f=e==="mouseout"||e==="pointerout",p&&n!==Or&&(k=n.relatedTarget||n.fromElement)&&(Vn(k)||k[na]))break e;(f||p)&&(k=b.window===b?b:(p=b.ownerDocument)?p.defaultView||p.parentWindow:window,f?(p=n.relatedTarget||n.toElement,f=d,p=p?Vn(p):null,p!==null&&(z=al(p),S=p.tag,p!==z||S!==5&&S!==27&&S!==6)&&(p=null)):(f=null,p=d),f!==p&&(S=Is,g="onMouseLeave",v="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(S=ef,g="onPointerLeave",v="onPointerEnter",u="pointer"),z=f==null?k:za(f),s=p==null?k:za(p),k=new S(g,u+"leave",f,n,b),k.target=z,k.relatedTarget=s,g=null,Vn(b)===d&&(S=new S(v,u+"enter",p,n,b),S.target=s,S.relatedTarget=z,g=S),z=g,S=f&&p?mr(f,p,U0):null,f!==null&&If(m,k,f,S,!1),p!==null&&z!==null&&If(m,z,p,S,!0)))}e:{if(f=d?za(d):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var y=af;else if(of(f))if(tp)y=Vh;else{y=Yh;var w=qh}else p=f.nodeName,!p||p.toLowerCase()!=="input"||f.type!=="checkbox"&&f.type!=="radio"?d&&_u(d.elementType)&&(y=af):y=jh;if(y&&(y=y(e,d))){ep(m,y,n,b);break e}w&&w(e,f,d)}switch(w=d?za(d):window,e){case"focusin":(of(w)||w.contentEditable==="true")&&(zo=w,_r=d,_a=null);break;case"focusout":_a=_r=zo=null;break;case"mousedown":Mr=!0;break;case"contextmenu":case"mouseup":case"dragend":Mr=!1,uf(m,n,b);break;case"selectionchange":if(Xh)break;case"keydown":case"keyup":uf(m,n,b)}var x;if(Bu)e:{switch(e){case"compositionstart":var E="onCompositionStart";break e;case"compositionend":E="onCompositionEnd";break e;case"compositionupdate":E="onCompositionUpdate";break e}E=void 0}else Eo?Ib(e,n)&&(E="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(E="onCompositionStart");E&&($b&&n.locale!=="ko"&&(Eo||E!=="onCompositionStart"?E==="onCompositionEnd"&&Eo&&(x=Wb()):(sn=b,Du="value"in sn?sn.value:sn.textContent,Eo=!0)),w=Vc(d,E),0<w.length&&(E=new Ps(E,e,null,n,b),m.push({event:E,listeners:w}),x?E.data=x:(x=Pb(n),x!==null&&(E.data=x)))),(x=Rh?Bh(e,n):Uh(e,n))&&(E=Vc(d,"onBeforeInput"),0<E.length&&(w=new Ps("onBeforeInput","beforeinput",null,n,b),m.push({event:w,listeners:E}),w.data=x)),R0(m,e,d,n,b)}Fv(m,t)})}function Ia(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Vc(e,t){for(var n=t+"Capture",o=[];e!==null;){var a=e,l=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||l===null||(a=Ga(e,n),a!=null&&o.unshift(Ia(e,a,l)),a=Ga(e,t),a!=null&&o.push(Ia(e,a,l))),e.tag===3)return o;e=e.return}return[]}function U0(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function If(e,t,n,o,a){for(var l=t._reactName,c=[];n!==null&&n!==o;){var i=n,r=i.alternate,d=i.stateNode;if(i=i.tag,r!==null&&r===o)break;i!==5&&i!==26&&i!==27||d===null||(r=d,a?(d=Ga(n,l),d!=null&&c.unshift(Ia(n,d,r))):a||(d=Ga(n,l),d!=null&&c.push(Ia(n,d,r)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var H0=/\r\n?/g,L0=/\u0000|\uFFFD/g;function Pf(e){return(typeof e=="string"?e:""+e).replace(H0,`
`).replace(L0,"")}function $v(e,t){return t=Pf(t),Pf(e)===t}function Q(e,t,n,o,a,l){switch(n){case"children":if(typeof o=="string")t==="body"||t==="textarea"&&o===""||Qo(e,o);else if(typeof o=="number"||typeof o=="bigint")t!=="body"&&Qo(e,""+o);else return;break;case"className":Rl(e,"class",o);break;case"tabIndex":Rl(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":Rl(e,n,o);break;case"style":Jb(e,o,l);return;case"data":if(t!=="object"){Rl(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Il(o),e.setAttribute(n,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(n==="formAction"?(t!=="input"&&Q(e,t,"name",a.name,a,null),Q(e,t,"formEncType",a.formEncType,a,null),Q(e,t,"formMethod",a.formMethod,a,null),Q(e,t,"formTarget",a.formTarget,a,null)):(Q(e,t,"encType",a.encType,a,null),Q(e,t,"method",a.method,a,null),Q(e,t,"target",a.target,a,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=Il(o),e.setAttribute(n,o);break;case"onClick":o!=null&&(e.onclick=zt);return;case"onScroll":o!=null&&D("scroll",e);return;case"onScrollEnd":o!=null&&D("scrollend",e);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}n=Il(o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":o===!0?e.setAttribute(n,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(n,o):e.removeAttribute(n);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(n):e.setAttribute(n,o);break;case"popover":D("beforetoggle",e),D("toggle",e),$l(e,"popover",o);break;case"xlinkActuate":Ht(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Ht(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Ht(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Ht(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Ht(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Ht(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Ht(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Ht(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Ht(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":$l(e,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")n=lh.get(n)||n,$l(e,n,o);else return}q=!0}function vu(e,t,n,o,a,l){switch(n){case"style":Jb(e,o,l);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(h(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(h(60));l?.__html!==n&&(e.innerHTML=n)}}break;case"children":if(typeof o=="string")Qo(e,o);else if(typeof o=="number"||typeof o=="bigint")Qo(e,""+o);else return;break;case"onScroll":o!=null&&D("scroll",e);return;case"onScrollEnd":o!=null&&D("scrollend",e);return;case"onClick":o!=null&&(e.onclick=zt);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Vb.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),l=n.slice(2,a?n.length-7:void 0),t=e[Ye]||null,t=t!=null?t[n]:null,typeof t=="function"&&e.removeEventListener(l,t,a),typeof o=="function")){typeof t!="function"&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(l,o,a);break e}q=!0,n in e?e[n]=o:o===!0?e.setAttribute(n,""):$l(e,n,o)}return}q=!0}function Te(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":D("error",e),D("load",e);var o=!1,a=!1,l;for(l in n)if(n.hasOwnProperty(l)){var c=n[l];if(c!=null)switch(l){case"src":o=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:Q(e,t,l,c,n,null)}}a&&Q(e,t,"srcSet",n.srcSet,n,null),o&&Q(e,t,"src",n.src,n,null);return;case"input":D("invalid",e);var i=l=c=a=null,r=null,d=null;for(o in n)if(n.hasOwnProperty(o)){var b=n[o];if(b!=null)switch(o){case"name":a=b;break;case"type":c=b;break;case"checked":r=b;break;case"defaultChecked":d=b;break;case"value":l=b;break;case"defaultValue":i=b;break;case"children":case"dangerouslySetInnerHTML":if(b!=null)throw Error(h(137,t));break;default:Q(e,t,o,b,n,null)}}Qb(e,l,i,r,d,c,a,!1);return;case"select":D("invalid",e),o=c=l=null;for(a in n)if(n.hasOwnProperty(a)&&(i=n[a],i!=null))switch(a){case"value":l=i;break;case"defaultValue":c=i;break;case"multiple":o=i;default:Q(e,t,a,i,n,null)}t=l,n=c,e.multiple=!!o,t!=null?Ro(e,!!o,t,!1):n!=null&&Ro(e,!!o,n,!0);return;case"textarea":D("invalid",e),l=a=o=null;for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"value":o=i;break;case"defaultValue":a=i;break;case"children":l=i;break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(h(91));break;default:Q(e,t,c,i,n,null)}Kb(e,o,a,l);return;case"option":for(r in n)n.hasOwnProperty(r)&&(o=n[r],o!=null)&&(r==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":Q(e,t,r,o,n,null));return;case"dialog":D("beforetoggle",e),D("toggle",e),D("cancel",e),D("close",e);break;case"iframe":case"object":D("load",e);break;case"video":case"audio":for(o=0;o<$a.length;o++)D($a[o],e);break;case"image":D("error",e),D("load",e);break;case"details":D("toggle",e);break;case"embed":case"source":case"link":D("error",e),D("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(d in n)if(n.hasOwnProperty(d)&&(o=n[d],o!=null))switch(d){case"children":case"dangerouslySetInnerHTML":throw Error(h(137,t));default:Q(e,t,d,o,n,null)}return;default:if(_u(t)){for(b in n)n.hasOwnProperty(b)&&(o=n[b],o!==void 0&&vu(e,t,b,o,n,void 0));return}}for(i in n)n.hasOwnProperty(i)&&(o=n[i],o!=null&&Q(e,t,i,o,n,null))}var q0={};function Y0(e,t,n,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,l=null,c=null,i=null,r=null,d=null,b=null;for(p in n){var m=n[p];if(n.hasOwnProperty(p)&&m!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":r=m;default:o.hasOwnProperty(p)||Q(e,t,p,null,o,m)}}for(var f in o){var p=o[f];if(m=n[f],o.hasOwnProperty(f)&&(p!=null||m!=null))switch(f){case"type":p!==m&&(q=!0),l=p;break;case"name":p!==m&&(q=!0),a=p;break;case"checked":p!==m&&(q=!0),d=p;break;case"defaultChecked":p!==m&&(q=!0),b=p;break;case"value":p!==m&&(q=!0),c=p;break;case"defaultValue":p!==m&&(q=!0),i=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(h(137,t));break;default:p!==m&&Q(e,t,f,p,o,m)}}Nr(e,c,i,r,d,b,l,a);return;case"select":p=c=i=f=null;for(l in n)if(r=n[l],n.hasOwnProperty(l)&&r!=null)switch(l){case"value":break;case"multiple":p=r;default:o.hasOwnProperty(l)||Q(e,t,l,null,o,r)}for(a in o)if(l=o[a],r=n[a],o.hasOwnProperty(a)&&(l!=null||r!=null))switch(a){case"value":l!==r&&(q=!0),f=l;break;case"defaultValue":l!==r&&(q=!0),i=l;break;case"multiple":l!==r&&(q=!0),c=l;default:l!==r&&Q(e,t,a,l,o,r)}t=i,n=c,o=p,f!=null?Ro(e,!!n,f,!1):!!o!=!!n&&(t!=null?Ro(e,!!n,t,!0):Ro(e,!!n,n?[]:"",!1));return;case"textarea":p=f=null;for(i in n)if(a=n[i],n.hasOwnProperty(i)&&a!=null&&!o.hasOwnProperty(i))switch(i){case"value":break;case"children":break;default:Q(e,t,i,null,o,a)}for(c in o)if(a=o[c],l=n[c],o.hasOwnProperty(c)&&(a!=null||l!=null))switch(c){case"value":a!==l&&(q=!0),f=a;break;case"defaultValue":a!==l&&(q=!0),p=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(h(91));break;default:a!==l&&Q(e,t,c,a,o,l)}Zb(e,f,p);return;case"option":for(var k in n)f=n[k],n.hasOwnProperty(k)&&f!=null&&!o.hasOwnProperty(k)&&(k==="selected"?e.selected=!1:Q(e,t,k,null,o,f));for(r in o)f=o[r],p=n[r],o.hasOwnProperty(r)&&f!==p&&(f!=null||p!=null)&&(r==="selected"?(f!==p&&(q=!0),e.selected=f&&typeof f!="function"&&typeof f!="symbol"):Q(e,t,r,f,o,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var S in n)f=n[S],n.hasOwnProperty(S)&&f!=null&&!o.hasOwnProperty(S)&&Q(e,t,S,null,o,f);for(d in o)if(f=o[d],p=n[d],o.hasOwnProperty(d)&&f!==p&&(f!=null||p!=null))switch(d){case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(h(137,t));break;default:Q(e,t,d,f,o,p)}return;default:if(_u(t)){for(var z in n)f=n[z],n.hasOwnProperty(z)&&f!==void 0&&!o.hasOwnProperty(z)&&vu(e,t,z,void 0,o,f);for(b in o)f=o[b],p=n[b],!o.hasOwnProperty(b)||f===p||f===void 0&&p===void 0||vu(e,t,b,f,o,p);return}}for(var v in n)f=n[v],n.hasOwnProperty(v)&&f!=null&&!o.hasOwnProperty(v)&&Q(e,t,v,null,o,f);for(m in o)f=o[m],p=n[m],!o.hasOwnProperty(m)||f===p||f==null&&p==null||Q(e,t,m,f,o,p)}function eb(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function j0(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),o=0;o<n.length;o++){var a=n[o],l=a.transferSize,c=a.initiatorType,i=a.duration;if(l&&i&&eb(c)){for(c=0,i=a.responseEnd,o+=1;o<n.length;o++){var r=n[o],d=r.startTime;if(d>i)break;var b=r.transferSize,m=r.initiatorType;b&&eb(m)&&(r=r.responseEnd,c+=b*(r<i?1:(i-d)/(r-d)))}if(--o,t+=8*(l+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var mu=null,gu=null;function Pa(e){return e.nodeType===9?e:e.ownerDocument}function tb(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Iv(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Pv(e,t,n,o){return n=Pa(n).createElement(e),n[ke]=o,n[Ye]=t,Te(n,e,t),me(n),n}function hu(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var fr=null;function V0(){var e=window.event;return e&&e.type==="popstate"?e===fr?!1:(fr=e,!0):(fr=null,!1)}var gd=typeof setTimeout=="function"?setTimeout:void 0,G0=typeof clearTimeout=="function"?clearTimeout:void 0,nb=typeof Promise=="function"?Promise:void 0,ob=typeof requestAnimationFrame=="function"?requestAnimationFrame:gd,X0=typeof queueMicrotask=="function"?queueMicrotask:typeof nb<"u"?function(e){return nb.resolve(null).then(e).catch(Q0)}:gd;function Q0(e){setTimeout(function(){throw e})}function Mn(e){return e==="head"}function ab(e,t){var n=t,o=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(o===0){e.removeChild(a),ta(t);return}o--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")o++;else if(n==="html")pr(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,pr(n);for(var l=n.firstChild;l;){var c=l.nextSibling,i=l.nodeName;l[rl]||i==="SCRIPT"||i==="STYLE"||i==="LINK"&&l.rel.toLowerCase()==="stylesheet"||n.removeChild(l),l=c}}else n==="body"&&pr(e.ownerDocument.body);n=a}while(n);ta(t)}function lb(e,t){var n=e;e=0;do{var o=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=o}while(n)}function em(e,t,n){if(t=CSS.escape(t)!==t?"r-"+btoa(t).replace(/=/g,""):t,e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display==="inline"){if(t=e.getClientRects(),t.length===1)var o=1;else for(var a=o=0;a<t.length;a++){var l=t[a];0<l.width&&0<l.height&&o++}o===1&&(e=e.style,e.display=t.length===1?"inline-block":"block",e.marginTop="-"+n.paddingTop,e.marginBottom="-"+n.paddingBottom)}}function tm(e,t){e=e.style,t=t.style;var n=t!=null?t.hasOwnProperty("viewTransitionName")?t.viewTransitionName:t.hasOwnProperty("view-transition-name")?t["view-transition-name"]:null:null;e.viewTransitionName=n==null||typeof n=="boolean"?"":(""+n).trim(),n=t!=null?t.hasOwnProperty("viewTransitionClass")?t.viewTransitionClass:t.hasOwnProperty("view-transition-class")?t["view-transition-class"]:null:null,e.viewTransitionClass=n==null||typeof n=="boolean"?"":(""+n).trim(),e.display==="inline-block"&&(t==null?e.display=e.margin="":(n=t.display,e.display=n==null||typeof n=="boolean"?"":n,n=t.margin,n!=null?e.margin=n:(n=t.hasOwnProperty("marginTop")?t.marginTop:t["margin-top"],e.marginTop=n==null||typeof n=="boolean"?"":n,t=t.hasOwnProperty("marginBottom")?t.marginBottom:t["margin-bottom"],e.marginBottom=t==null||typeof t=="boolean"?"":t)))}function nm(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position==="absolute"||t.position==="fixed",clip:t.clipPath!=="none"||t.overflow!=="visible"||t.filter!=="none"||t.mask!=="none"||t.mask!=="none"||t.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function yu(e){var t=e.getBoundingClientRect(),n=getComputedStyle(e);return nm(t,n,e)}function Z0(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return nm(t,n,e)}function K0(e){return e.documentElement.clientHeight}function J0(e){this.addEventListener("load",e),this.addEventListener("error",e)}function F0(e,t,n,o,a,l,c,i,r){var d=t.nodeType===9?t:t.ownerDocument;try{var b=d.startViewTransition({update:function(){var f=d.defaultView,p=f.navigation&&f.navigation.transition,k=d.fonts.status;o();var S=[];if(k==="loaded"&&(K0(d),d.fonts.status==="loading"&&S.push(d.fonts.ready)),k=S.length,e!==null)for(var z=e.suspenseyImages,v=0,u=0;u<z.length;u++){var s=z[u];if(!s.complete){var g=s.getBoundingClientRect();if(0<g.bottom&&0<g.right&&g.top<f.innerHeight&&g.left<f.innerWidth){if(v+=pm(s),v>bc){S.length=k;break}s=new Promise(J0.bind(s)),S.push(s)}}}if(0<S.length)return f=Promise.race([Promise.all(S),new Promise(function(y){return setTimeout(y,500)})]).then(a,a),(p?Promise.allSettled([p.finished,f]):f).then(l,l);if(a(),p)return p.finished.then(l,l);l()},types:n});d.__reactViewTransition=b;var m=[];return b.ready.then(function(){for(var f=d.documentElement.getAnimations({subtree:!0}),p=0;p<f.length;p++){var k=f[p],S=k.effect,z=S.pseudoElement;if(z!=null&&z.startsWith("::view-transition")){m.push(k),k=S.getKeyframes();for(var v=z=void 0,u=!0,s=0;s<k.length;s++){var g=k[s],y=g.width;if(z===void 0)z=y;else if(z!==y){u=!1;break}if(y=g.height,v===void 0)v=y;else if(v!==y){u=!1;break}delete g.width,delete g.height,g.transform==="none"&&delete g.transform}u&&z!==void 0&&v!==void 0&&(S.setKeyframes(k),u=getComputedStyle(S.target,S.pseudoElement),u.width!==z||u.height!==v)&&(u=k[0],u.width=z,u.height=v,u=k[k.length-1],u.width=z,u.height=v,S.setKeyframes(k))}}c()},function(f){d.__reactViewTransition===b&&(d.__reactViewTransition=null);try{typeof f=="object"&&f!==null&&f.name==="InvalidStateError"&&(f.message==="View transition was skipped because document visibility state is hidden."||f.message==="Skipping view transition because document visibility state has become hidden."||f.message==="Skipping view transition because viewport size changed."||f.message==="Transition was aborted because of invalid state")&&(f=null),f!==null&&r(f)}finally{o(),a(),c()}}),b.finished.finally(function(){for(var f=0;f<m.length;f++)m[f].cancel();d.__reactViewTransition===b&&(d.__reactViewTransition=null),i()}),b}catch{return o(),a(),c(),null}}function Gn(e,t){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+t+")"}Gn.prototype.animate=function(e,t){return t=typeof t=="number"?{duration:t}:F({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)};Gn.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),o=[],a=0;a<n.length;a++){var l=n[a].effect;l!==null&&l.target===e&&l.pseudoElement===t&&o.push(n[a])}return o};Gn.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function om(e){return{name:e,group:new Gn("group",e),imagePair:new Gn("image-pair",e),old:new Gn("old",e),new:new Gn("new",e)}}function Pe(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Pe.prototype.addEventListener=function(e,t,n){var o=null,a=null;if(!(n!=null&&typeof n!="boolean"&&(o=n.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var l=this._eventListeners;if(am(l,e,t,n)===-1){var c=this,i=t;n!=null&&typeof n!="boolean"&&n.once===!0&&(i=function(r){c.removeEventListener(e,t,n),typeof t=="function"?t.call(this,r):t.handleEvent(r)}),o!==null&&(a=c.removeEventListener.bind(c,e,t,n),o.addEventListener("abort",a,{once:!0}),a=o.removeEventListener.bind(o,"abort",a)),o=$o(n),l.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:i,cleanup:a}),qe(this._fragmentFiber.child,!1,W0,e,i,o)}this._eventListeners=l}};function W0(e,t,n,o){return fe(e).addEventListener(t,n,o),!1}Pe.prototype.removeEventListener=function(e,t,n){var o=this._eventListeners;if(o!==null&&(t=am(o,e,t,n),t!==-1)){var a=o[t];n=a.attachedListener;var l=a.cleanup;a=$o(a.optionsOrUseCapture),qe(this._fragmentFiber.child,!1,$0,e,n,a),o.splice(t,1),l!==null&&l()}};function $0(e,t,n,o){return fe(e).removeEventListener(t,n,o),!1}function $o(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function cb(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function am(e,t,n,o){if(e.length===0)return-1;o=cb(o);for(var a=0;a<e.length;a++){var l=e[a];if(l.type===t&&l.listener===n&&cb(l.optionsOrUseCapture)===o)return a}return-1}Pe.prototype.dispatchEvent=function(e){var t=oo(this._fragmentFiber);if(t===null)return!0;t=fe(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var o=t.nodeType===9?t.createComment(""):document.createTextNode("");if(n)for(var a=0;a<n.length;a++){var l=n[a];o.addEventListener(l.type,l.attachedListener,$o(l.optionsOrUseCapture))}if(t.appendChild(o),e=o.dispatchEvent(e),n)for(a=0;a<n.length;a++)l=n[a],o.removeEventListener(l.type,l.attachedListener,$o(l.optionsOrUseCapture));return t.removeChild(o),e}return t.dispatchEvent(e)};Pe.prototype.focus=function(e){qe(this._fragmentFiber.child,!0,lm,e,void 0,void 0)};function lm(e,t){return e.tag===6?!1:(e=fe(e),uy(e,t))}Pe.prototype.focusLast=function(e){var t=[];qe(this._fragmentFiber.child,!0,hd,t,void 0,void 0);for(var n=t.length-1;0<=n&&!lm(t[n],e);n--);};function hd(e,t){return t.push(e),!1}Pe.prototype.blur=function(){var e=oo(this._fragmentFiber);e!==null&&(e=fe(e),e=Pa(e).activeElement,e!==null&&qe(this._fragmentFiber.child,!1,I0,e,void 0,void 0))};function I0(e,t){return e.tag===6?!1:(e=fe(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Pe.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),qe(this._fragmentFiber.child,!1,P0,e,void 0,void 0)};function P0(e,t){return e.tag===6||(e=fe(e),t.observe(e)),!1}Pe.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),qe(this._fragmentFiber.child,!1,ey,e,void 0,void 0);for(var n=t=0;n<pt.length;n++){var o=pt[n];o.fragmentInstance===this&&o.observer===e?e.unobserve(o.instance):pt[t++]=o}pt.length=t}};function ey(e,t){return e.tag===6||(e=fe(e),t.unobserve(e)),!1}var pt=[],br=!1;function ty(e,t,n){pt.push({fragmentInstance:e,observer:t,instance:n}),br||(br=!0,dy(function(){br=!1;var o=pt;pt=[];for(var a=0;a<o.length;a++){var l=o[a];l.observer.unobserve(l.instance)}}))}Pe.prototype.getClientRects=function(){var e=[];return qe(this._fragmentFiber.child,!1,ny,e,void 0,void 0),e};function ny(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=fe(e),t.push.apply(t,e.getClientRects());return!1}Pe.prototype.getRootNode=function(e){var t=oo(this._fragmentFiber);return t===null?this:fe(t).getRootNode(e)};Pe.prototype.compareDocumentPosition=function(e){var t=oo(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];qe(this._fragmentFiber.child,!1,hd,n,void 0,void 0);var o=fe(t);if(n.length===0){if(n=o,Ls(this._fragmentFiber)){e:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break e}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var a=o=n.compareDocumentPosition(e);return n===e?a=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=Nb(t)[1],n===null?a=Node.DOCUMENT_POSITION_PRECEDING:(e=fe(n).compareDocumentPosition(e),a=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),a|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=fe(n[0]),a=fe(n[n.length-1]);var l=Ls(this._fragmentFiber)?t.parentElement:o;if(l==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=l.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,l=l.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_CONTAINED_BY;var c=t.compareDocumentPosition(e),i=a.compareDocumentPosition(e),r=c&Node.DOCUMENT_POSITION_CONTAINED_BY||i&Node.DOCUMENT_POSITION_CONTAINED_BY;return i=o&&l&&c&Node.DOCUMENT_POSITION_FOLLOWING&&i&Node.DOCUMENT_POSITION_PRECEDING,t=o&&t===e||l&&a===e||r||i?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&t===e||!l&&a===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:c,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||oy(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function oy(e,t,n,o,a){var l=Vn(a);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!l)e:{for(;l!==null;){if(l.tag===7&&(l===t||l.alternate===t)){n=!0;break e}l=l.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(l===null)return l=a.ownerDocument,a===l||a===l.documentElement||a===l.body;e:{for(l=t,t=oo(t);l!==null;){if(!(l.tag!==5&&l.tag!==3&&l.tag!==27||l!==t&&l.alternate!==t)){l=!0;break e}l=l.return}l=!1}return l}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!l)&&!(t=l===n)&&(t=mr(n,l,qs),t===null?t=!1:(qe(t,!0,Dg,l,n),l=xo,xo=null,t=l!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!l)&&!(t=l===o)&&(t=mr(o,l,qs),t===null?t=!1:(qe(t,!0,Rg,l,o),l=xo,vr=xo=null,t=l!==null)),t):!1}function ib(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Pe.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(h(566));var t=[];qe(this._fragmentFiber.child,!1,hd,t,void 0,void 0);var n=e!==!1;if(t.length===0){var o=Nb(this._fragmentFiber);if(o=n?o[1]||o[0]||oo(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){e=fe(o),ib(e,n);return}if(o=fe(o),o.nodeType!==9){if(o.nodeType===11){n="host"in o?o.host:null,n!==null&&n.scrollIntoView(e);return}o.scrollIntoView(e)}}for(o=n?t.length-1:0;o!==(n?-1:t.length);){var a=t[o];a.tag===6?(a=fe(a),ib(a,n)):fe(a).scrollIntoView(e),o+=n?-1:1}};function ay(e,t){return e=fe(e),cm(e,t),!1}function cm(e,t){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(t)}function im(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.addEventListener(a.type,a.attachedListener,$o(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){for(var c=0,i=0;i<pt.length;i++){var r=pt[i];(r.fragmentInstance!==t||r.observer!==l||r.instance!==e)&&(pt[c++]=r)}pt.length=c,l.observe(e)}),cm(e,t))}function ly(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.removeEventListener(a.type,a.attachedListener,$o(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(l){typeof l.rootMargin=="string"?ty(t,l,e):l.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function ku(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":ku(n),Zc(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function cy(e,t,n,o){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[rl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var l=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=ut(e.nextSibling),e===null)break}return null}function iy(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=ut(e.nextSibling),e===null))return null;return e}function rm(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=ut(e.nextSibling),e===null))return null;return e}function xu(e){return e.data==="$?"||e.data==="$~"}function yd(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function ry(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var o=function(){t(),n.removeEventListener("DOMContentLoaded",o)};n.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function ut(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Su=null;function rb(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return ut(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function ub(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function uy(e,t){function n(){o=!0}if(e.ownerDocument.activeElement===e)return!0;var o=!1;try{e.ownerDocument.addEventListener("focus",n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener("focus",n,!0)}return o}function dy(e){ob(function(){ob(function(t){return e(t)})})}function um(e,t,n){switch(t=Pa(n),e){case"html":if(e=t.documentElement,!e)throw Error(h(452));return e;case"head":if(e=t.head,!e)throw Error(h(453));return e;case"body":if(e=t.body,!e)throw Error(h(454));return e;default:throw Error(h(451))}}function dm(e,t,n){for(var o in n){var a=n[o];n.hasOwnProperty(o)&&a!=null&&Q(e,t,o,null,q0,a)}n.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===zt&&(e.onclick=null),Zc(e)}function pr(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Zc(e)}var dt=new Map,db=new Set;function el(e){if(typeof e.getRootNode=="function"){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var $t=V.d;V.d={f:sy,r:fy,D:by,C:py,L:vy,m:my,X:hy,S:gy,M:yy};function sy(){var e=$t.f(),t=ci();return e||t}function fy(e){var t=oa(e);t!==null&&t.tag===5&&t.type==="form"?Jp(t):$t.r(e)}var ia=typeof document>"u"?null:document;function sm(e,t,n){var o=ia;if(o&&typeof t=="string"&&t){var a=ct(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),db.has(a)||(db.add(a),e={rel:e,crossOrigin:n,href:t},o.querySelector(a)===null&&(t=o.createElement("link"),Te(t,"link",e),me(t),o.head.appendChild(t)))}}function by(e){$t.D(e),sm("dns-prefetch",e,null)}function py(e,t){$t.C(e,t),sm("preconnect",e,t)}function vy(e,t,n){$t.L(e,t,n);var o=ia;if(o&&e&&t){var a='link[rel="preload"][as="'+ct(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+ct(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+ct(n.imageSizes)+'"]')):a+='[href="'+ct(e)+'"]';var l=a;switch(t){case"style":l=Io(e);break;case"script":l=ra(e)}if(!(dt.has(l)||(e=F({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),dt.set(l,e),o.querySelector(a)!==null||t==="style"&&o.querySelector(pl(l))||t==="script"&&o.querySelector(vl(l))))){var c=o.createElement("link");Te(c,"link",e),t==="style"&&(c[kc]=!0,c.onload=c.onerror=function(){Yb(c)}),me(c),o.head.appendChild(c)}}}function my(e,t){$t.m(e,t);var n=ia;if(n&&e){var o=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+ct(o)+'"][href="'+ct(e)+'"]',l=a;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=ra(e)}if(!dt.has(l)&&(e=F({rel:"modulepreload",href:e},t),dt.set(l,e),n.querySelector(a)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(vl(l)))return}o=n.createElement("link"),Te(o,"link",e),me(o),n.head.appendChild(o)}}}function gy(e,t,n){$t.S(e,t,n);var o=ia;if(o&&e){var a=Do(o).hoistableStyles,l=Io(e);t=t||"default";var c=a.get(l);if(!c){var i={loading:0,preload:null};if(c=o.querySelector(pl(l)))i.loading=5;else{e=F({rel:"stylesheet",href:e,"data-precedence":t},n),(n=dt.get(l))&&kd(e,n);var r=c=o.createElement("link");me(r),Te(r,"link",e),r._p=new Promise(function(d,b){r.onload=d,r.onerror=b}),r.addEventListener("load",function(){i.loading|=1}),r.addEventListener("error",function(){i.loading|=2}),i.loading|=4,sc(c,t,o)}c={type:"stylesheet",instance:c,count:1,state:i},a.set(l,c)}}}function hy(e,t){$t.X(e,t);var n=ia;if(n&&e){var o=Do(n).hoistableScripts,a=ra(e),l=o.get(a);l||(l=n.querySelector(vl(a)),l||(e=F({src:e,async:!0},t),(t=dt.get(a))&&xd(e,t),l=n.createElement("script"),me(l),Te(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function yy(e,t){$t.M(e,t);var n=ia;if(n&&e){var o=Do(n).hoistableScripts,a=ra(e),l=o.get(a);l||(l=n.querySelector(vl(a)),l||(e=F({src:e,async:!0,type:"module"},t),(t=dt.get(a))&&xd(e,t),l=n.createElement("script"),me(l),Te(l,"link",e),n.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},o.set(a,l))}}function sb(e,t,n,o){var a=(a=mn.current)?el(a):null;if(!a)throw Error(h(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(n=Io(n.href),t=Do(a).hoistableStyles,o=t.get(n),o||(o={type:"style",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Io(n.href);var l=Do(a).hoistableStyles,c=l.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,c),(l=a.querySelector(pl(e)))?l._p||(c.instance=l,c.state.loading=5):(l=dt.get(e),l||(l={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},dt.set(e,l)),ky(a,e,l,c.state))),t&&o===null)throw Error(h(528,""));return c}if(t&&o!==null)throw Error(h(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(n=ra(n),t=Do(a).hoistableScripts,o=t.get(n),o||(o={type:"script",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(h(444,e))}}function Io(e){return'href="'+ct(e)+'"'}function pl(e){return'link[rel="stylesheet"]['+e+"]"}function fm(e){return F({},e,{"data-precedence":e.precedence,precedence:null})}function ky(e,t,n,o){if(t=e.querySelector('link[rel="preload"][as="style"]['+t+"]")){if(t[kc]!==!0){o.loading=1;return}}else t=e.createElement("link"),t[kc]=!0,t.onload=t.onerror=Yb.bind(null,t),Te(t,"link",n),me(t),e.head.appendChild(t);o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2})}function ra(e){return'[src="'+ct(e)+'"]'}function vl(e){return"script[async]"+e}function fb(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+ct(n.href)+'"]');if(o)return t.instance=o,me(o),o;var a=F({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),me(o),Te(o,"style",a),sc(o,n.precedence,e),t.instance=o;case"stylesheet":a=Io(n.href);var l=e.querySelector(pl(a));if(l)return t.state.loading|=4,t.instance=l,me(l),l;o=fm(n),(a=dt.get(a))&&kd(o,a),l=(e.ownerDocument||e).createElement("link"),me(l);var c=l;return c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),Te(l,"link",o),t.state.loading|=4,sc(l,n.precedence,e),t.instance=l;case"script":return l=ra(n.src),(a=e.querySelector(vl(l)))?(t.instance=a,me(a),a):(o=n,(a=dt.get(l))&&(o=F({},n),xd(o,a)),e=e.ownerDocument||e,a=e.createElement("script"),me(a),Te(a,"link",o),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(h(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,sc(o,n.precedence,e));return t.instance}function sc(e,t,n){for(var o=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=o.length?o[o.length-1]:null,l=a,c=0;c<o.length;c++){var i=o[c];if(i.dataset.precedence===t)l=i;else if(l!==a)break}l?l.parentNode.insertBefore(e,l.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function kd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function xd(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var fc=null;function bb(e,t,n){if(fc===null){var o=new Map,a=fc=new Map;a.set(n,o)}else a=fc,o=a.get(n),o||(o=new Map,a.set(n,o));if(o.has(e))return o;for(o.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var l=n[a];if(!(l[rl]||l[ke]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var c=l.getAttribute(t)||"";c=e+c;var i=o.get(c);i?i.push(l):o.set(c,[l])}}return o}function wu(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function xy(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function pb(e,t){return e==="img"&&t.src!=null&&t.src!==""&&t.onLoad==null&&t.loading!=="lazy"}function bm(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function pm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function vb(e,t){typeof t.decode=="function"&&(e.imgCount++,t.complete||(e.imgBytes+=pm(t),e.suspenseyImages.push(t)),e=Ty.bind(e),t.decode().then(e,e))}function Sy(e,t,n,o){if(n.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=Io(o.href),l=t.querySelector(pl(a));if(l){t=l._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=tl.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=l,me(l);return}l=t.ownerDocument||t,o=fm(o),(a=dt.get(a))&&kd(o,a),l=l.createElement("link"),me(l);var c=l;c._p=new Promise(function(i,r){c.onload=i,c.onerror=r}),Te(l,"link",o),n.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=tl.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var bc=0;function wy(e,t){return e.stylesheets&&e.count===0&&pc(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var o=setTimeout(function(){if(e.stylesheets&&pc(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+t);0<e.imgBytes&&bc===0&&(bc=62500*j0());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&pc(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>bc?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(a)}}:null}function vm(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)pc(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function tl(){this.count--,vm(this)}function Ty(){this.imgCount--,vm(this)}var Gc=null;function pc(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Gc=new Map,t.forEach(Ey,e),Gc=null,tl.call(e))}function Ey(e,t){if(!(t.state.loading&4)){var n=Gc.get(e);if(n)var o=n.get(null);else{n=new Map,Gc.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<a.length;l++){var c=a[l];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),o=c)}o&&n.set(null,o)}a=t.instance,c=a.getAttribute("data-precedence"),l=n.get(c)||o,l===o&&n.set(null,a),n.set(c,a),this.count++,o=tl.bind(this),a.addEventListener("load",o),a.addEventListener("error",o),l?l.parentNode.insertBefore(a,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var Po={$$typeof:Et,Provider:null,Consumer:null,_currentValue:Xn,_currentValue2:Xn,_threadCount:0};function zy(e,t,n,o,a,l,c,i,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Vi(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Vi(0),this.hiddenUpdates=Vi(null),this.identifierPrefix=o,this.onUncaughtError=a,this.onCaughtError=l,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.transitionTypes=null,this.incompleteTransitions=new Map}function mm(e,t,n,o,a,l,c,i,r,d,b,m){return e=new zy(e,t,n,c,r,d,b,m,i),t=1,l===!0&&(t|=24),l=He(3,null,null,t),e.current=l,l.stateNode=e,t=ju(),t.refCount++,e.pooledCache=t,t.refCount++,l.memoizedState={element:o,isDehydrated:n,cache:t},Xu(l),e}function gm(e){return e?(e=Co,e):Co}function hm(e,t,n,o,a,l){a=gm(a),o.context===null?o.context=a:o.pendingContext=a,o=hn(t),o.payload={element:n},l=l===void 0?null:l,l!==null&&(o.callback=l),n=yn(e,o,t),n!==null&&(Le(n,e,t),Da(n,e,t))}function mb(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Sd(e,t){mb(e,t),(e=e.alternate)&&mb(e,t)}function ym(e){if(e.tag===13||e.tag===31){var t=co(e,67108864);t!==null&&Le(t,e,67108864),Sd(e,67108864)}}function gb(e){if(e.tag===13||e.tag===31){var t=$e();t=Cu(t);var n=co(e,t);n!==null&&Le(n,e,t),Sd(e,t)}}var ea=!0;function Ny(e,t,n,o){var a=N.T;N.T=null;var l=V.p;try{V.p=2,wd(e,t,n,o)}finally{V.p=l,N.T=a}}function Oy(e,t,n,o){var a=N.T;N.T=null;var l=V.p;try{V.p=8,wd(e,t,n,o)}finally{V.p=l,N.T=a}}function wd(e,t,n,o){if(ea){var a=Tu(o);if(a===null)sr(e,t,o,Xc,n),hb(e,o);else if(Ay(a,e,t,n,o))o.stopPropagation();else if(hb(e,o),t&4&&-1<Cy.indexOf(e)){for(;a!==null;){var l=oa(a);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var c=qn(l.pendingLanes);if(c!==0){var i=l;for(i.pendingLanes|=2,i.entangledLanes|=2;c;){var r=1<<31-We(c);i.entanglements[1]|=r,c&=~r}Dt(l),(j&6)===0&&(Lc=Je()+500,bl(0,!1))}}break;case 31:case 13:i=co(l,2),i!==null&&Le(i,l,2),ci(),Sd(l,2)}if(l=Tu(o),l===null&&sr(e,t,o,Xc,n),l===a)break;a=l}a!==null&&o.stopPropagation()}else sr(e,t,o,null,n)}}function Tu(e){return e=Mu(e),Td(e)}var Xc=null;function Td(e){if(Xc=null,e=Vn(e),e!==null){var t=al(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=Tb(t),e!==null)return e;e=null}else if(n===31){if(e=Eb(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Xc=e,null}function km(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Gg()){case _b:return 2;case Mb:return 8;case yc:case Xg:return 32;case Db:return 268435456;default:return 32}default:return 32}}var Eu=!1,wn=null,Tn=null,En=null,nl=new Map,ol=new Map,un=[],Cy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function hb(e,t){switch(e){case"focusin":case"focusout":wn=null;break;case"dragenter":case"dragleave":Tn=null;break;case"mouseover":case"mouseout":En=null;break;case"pointerover":case"pointerout":nl.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ol.delete(t.pointerId)}}function Sa(e,t,n,o,a,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:l,targetContainers:[a]},t!==null&&(t=oa(t),t!==null&&ym(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function Ay(e,t,n,o,a){switch(t){case"focusin":return wn=Sa(wn,e,t,n,o,a),!0;case"dragenter":return Tn=Sa(Tn,e,t,n,o,a),!0;case"mouseover":return En=Sa(En,e,t,n,o,a),!0;case"pointerover":var l=a.pointerId;return nl.set(l,Sa(nl.get(l)||null,e,t,n,o,a)),!0;case"gotpointercapture":return l=a.pointerId,ol.set(l,Sa(ol.get(l)||null,e,t,n,o,a)),!0}return!1}function xm(e){var t=Vn(e.target);if(t!==null){var n=al(t);if(n!==null){if(t=n.tag,t===13){if(t=Tb(n),t!==null){e.blockedOn=t,Gs(e.priority,function(){gb(n)});return}}else if(t===31){if(t=Eb(n),t!==null){e.blockedOn=t,Gs(e.priority,function(){gb(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function vc(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Tu(e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);Or=o,n.target.dispatchEvent(o),Or=null}else return t=oa(n),t!==null&&ym(t),e.blockedOn=n,!1;t.shift()}return!0}function yb(e,t,n){vc(e)&&n.delete(t)}function _y(){Eu=!1,wn!==null&&vc(wn)&&(wn=null),Tn!==null&&vc(Tn)&&(Tn=null),En!==null&&vc(En)&&(En=null),nl.forEach(yb),ol.forEach(yb)}function Fl(e,t){e.blockedOn===t&&(e.blockedOn=null,Eu||(Eu=!0,be.unstable_scheduleCallback(be.unstable_NormalPriority,_y)))}var Wl=null;function kb(e){Wl!==e&&(Wl=e,be.unstable_scheduleCallback(be.unstable_NormalPriority,function(){Wl===e&&(Wl=null);for(var t=0;t<e.length;t+=3){var n=e[t],o=e[t+1],a=e[t+2];if(typeof o!="function"){if(Td(o||n)===null)continue;break}var l=oa(n);l!==null&&(e.splice(t,3),t-=3,Xr(l,{pending:!0,data:a,method:n.method,action:o},o,a))}}))}function ta(e){function t(r){return Fl(r,e)}wn!==null&&Fl(wn,e),Tn!==null&&Fl(Tn,e),En!==null&&Fl(En,e),nl.forEach(t),ol.forEach(t);for(var n=0;n<un.length;n++){var o=un[n];o.blockedOn===e&&(o.blockedOn=null)}for(;0<un.length&&(n=un[0],n.blockedOn===null);)xm(n),n.blockedOn===null&&un.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(o=0;o<n.length;o+=3){var a=n[o],l=n[o+1],c=a[Ye]||null;if(typeof l=="function")c||kb(n);else if(c){var i=null;if(l&&l.hasAttribute("formAction")){if(a=l,c=l[Ye]||null)i=c.formAction;else if(Td(a)!==null)continue}else i=c.action;typeof i=="function"?n[o+1]=i:(n.splice(o,3),o-=3),kb(n)}}}function Sm(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),o||setTimeout(n,20)}function n(){if(!o&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Ed(e){this._internalRoot=e}ui.prototype.render=Ed.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(h(409));var n=t.current,o=$e();hm(n,o,e,t,null,null)};ui.prototype.unmount=Ed.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;hm(e.current,2,null,e,null,null),ci(),t[na]=null}};function ui(e){this._internalRoot=e}ui.prototype.unstable_scheduleHydration=function(e){if(e){var t=qb();e={blockedOn:null,target:e,priority:t};for(var n=0;n<un.length&&t!==0&&t<un[n].priority;n++);un.splice(n,0,e),n===0&&xm(e)}};var xb=Sb.version;if(xb!=="19.3.0")throw Error(h(527,xb,"19.3.0"));V.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(h(188)):(e=Object.keys(e).join(","),Error(h(268,e)));return e=Mg(t),e=e!==null?zb(e):null,e=e===null?null:e.stateNode,e};var My={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(wa=__REACT_DEVTOOLS_GLOBAL_HOOK__,!wa.isDisabled&&wa.supportsFiber))try{ll=wa.inject(My),Fe=wa}catch{}var wa;di.createRoot=function(e,t){if(!wb(e))throw Error(h(299));var n=!1,o="",a=nv,l=ov,c=av;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(l=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=mm(e,1,!1,null,null,n,o,null,a,l,c,Sm),e[na]=t.current,md(e),new Ed(t)};di.hydrateRoot=function(e,t,n){if(!wb(e))throw Error(h(299));var o=!1,a="",l=nv,c=ov,i=av,r=null;return n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(l=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(i=n.onRecoverableError),n.formState!==void 0&&(r=n.formState)),t=mm(e,1,!0,t,n??null,o,a,r,l,c,i,Sm),t.context=gm(null),n=t.current,o=$e(),o=Cu(o),a=hn(o),a.callback=null,yn(n,a,o),n=o,t.current.lanes=n,il(t,n),Dt(t),e[na]=t.current,md(e),new ui(t)};di.version="19.3.0"});var zm=ht((E1,Em)=>{"use strict";function Tm(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Tm)}catch(e){console.error(e)}}Tm(),Em.exports=wm()});var Cd=`/*---------------------------------------------------------------------------------------------
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
`;var Ad=`/* VS Code theme variables for hosts outside VS Code (the browser extension's pages): a dark and
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
`;var Im='[data-glass-scroll="off"]',vi=(e,t,n)=>Math.min(n,Math.max(t,e));function _d(e){let t=e instanceof Document?e:e.ownerDocument,n=t.createElement("div");n.className="ink-scroll-layer",n.setAttribute("aria-hidden","true"),(e instanceof Document?t.body??t.documentElement:e).append(n);let o=new Map,a=new Set,l=0,c=u=>u===t.scrollingElement?{left:0,top:0}:(({left:s,top:g})=>({left:s+u.clientLeft,top:g+u.clientTop}))(u.getBoundingClientRect()),i=(u,s)=>{let{left:g,top:y}=c(u);for(let w of["y","x"]){let x=s.thumbs[w],E=w==="y"?u.clientHeight:u.clientWidth,B=w==="y"?u.scrollHeight:u.scrollWidth,C=w==="y"?u.scrollTop:u.scrollLeft,he=B-E;if(he<1||E<=0){x.hidden=!0;continue}let je=E-6,gt=vi(E/B*je,Math.min(32,je),je),gl=3+vi(C,0,he)/he*(je-gt);x.hidden=!1,w==="y"?(x.style.left=`${g+u.clientWidth-3}px`,x.style.top=`${y+gl}px`,x.style.height=`${gt}px`):(x.style.left=`${g+gl}px`,x.style.top=`${y+u.clientHeight-3}px`,x.style.width=`${gt}px`)}},r=u=>{let s=o.get(u);if(s){clearTimeout(s.timer),o.delete(u);for(let g of Object.values(s.thumbs))g.classList.remove("visible"),setTimeout(()=>g.remove(),300)}},d=(u,s)=>{clearTimeout(s.timer),s.timer=setTimeout(()=>{s.held||r(u)},1100)},b=u=>{let s={thumbs:{y:m(u,"y"),x:m(u,"x")},held:!1};for(let g of Object.values(s.thumbs))n.append(g),g.addEventListener("pointerenter",()=>{s.held=!0,clearTimeout(s.timer)}),g.addEventListener("pointerleave",()=>{g.classList.contains("dragging")||(s.held=!1,d(u,s))});return o.set(u,s),s};function m(u,s){let g=t.createElement("div");return g.className=`ink-scroll-thumb ${s}`,g.addEventListener("pointerdown",y=>{if(y.button!==0)return;y.preventDefault(),y.stopPropagation(),g.setPointerCapture(y.pointerId),g.classList.add("dragging");let w=s==="y"?y.clientY:y.clientX,x=s==="y"?u.scrollTop:u.scrollLeft,E=s==="y"?u.clientHeight:u.clientWidth,B=(s==="y"?u.scrollHeight:u.scrollWidth)-E,C=E-6-(s==="y"?g.offsetHeight:g.offsetWidth),he=gt=>{if(C<=0)return;let gl=(s==="y"?gt.clientY:gt.clientX)-w,Nd=vi(x+gl/C*B,0,B);s==="y"?u.scrollTop=Nd:u.scrollLeft=Nd},je=()=>{g.classList.remove("dragging"),g.removeEventListener("pointermove",he),g.removeEventListener("pointerup",je),g.removeEventListener("pointercancel",je);let gt=o.get(u);gt&&!g.matches(":hover")&&(gt.held=!1,d(u,gt))};g.addEventListener("pointermove",he),g.addEventListener("pointerup",je),g.addEventListener("pointercancel",je)}),g}let f=u=>{if(u.closest(Im))return;let s=o.get(u)??b(u);d(u,s),a.add(u),l||=requestAnimationFrame(()=>{l=0;for(let g of a){let y=o.get(g);if(y){if(!g.isConnected){r(g);continue}i(g,y);for(let w of Object.values(y.thumbs))w.classList.add("visible")}}a.clear()})},p=u=>{let s=u.target;s===t?f(t.scrollingElement):s instanceof HTMLElement&&s!==n&&f(s)},k=({path:u,x:s,y:g})=>{for(let y of u){if(y===e||!(y instanceof HTMLElement))break;if(y.parentNode===n)return;let w=y.scrollHeight-y.clientHeight>=1,x=y.scrollWidth-y.clientWidth>=1;if(!w&&!x)continue;let E=getComputedStyle(y),B=w&&/auto|scroll/.test(E.overflowY),C=x&&/auto|scroll/.test(E.overflowX);if(!B&&!C)continue;let{left:he,top:je}=c(y);(B&&s>=he+y.clientWidth-14||C&&g>=je+y.clientHeight-14)&&f(y);return}},S,z=0,v=u=>{u.buttons||(S={path:u.composedPath(),x:u.clientX,y:u.clientY},z||=requestAnimationFrame(()=>{z=0,S&&k(S)}))};return e.addEventListener("scroll",p,{capture:!0,passive:!0}),e.addEventListener("pointermove",v,{capture:!0,passive:!0}),()=>{e.removeEventListener("scroll",p,{capture:!0}),e.removeEventListener("pointermove",v,{capture:!0}),cancelAnimationFrame(l),cancelAnimationFrame(z);for(let u of[...o.keys()])r(u);n.remove()}}var Md=`/* The Inkspect design system: tokens and the shared components (buttons, fields, selects,
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
`;var sa={global:"Browser",inspect:"Element picker",draw:"Drawing",screenshot:"Screenshot",devtools:"Console and network",device:"Device",measure:"Measure",eyedropper:"Eyedropper",overlay:"Design overlay",tweak:"CSS tweak",record:"Record",a11y:"Accessibility check",send:"Send dialog"},L=e=>`vscodeBrowser.${e}`,It=[{id:"tab.new",label:"New tab",scope:"global",keys:["ctrl+t"],command:L("newTab")},{id:"tab.close",label:"Close tab",scope:"global",keys:["ctrl+w","ctrl+f4"],command:L("closeTab")},{id:"tab.reopen",label:"Reopen closed tab",scope:"global",keys:["ctrl+shift+t"],command:L("reopenClosedTab")},{id:"tab.next",label:"Next tab",scope:"global",keys:["ctrl+tab","ctrl+pagedown"],mac:["ctrl+tab","cmd+alt+right"],command:L("nextTab")},{id:"tab.previous",label:"Previous tab",scope:"global",keys:["ctrl+shift+tab","ctrl+pageup"],mac:["ctrl+shift+tab","cmd+alt+left"],command:L("previousTab")},{id:"tab.duplicate",label:"Duplicate tab",scope:"global",keys:[],command:L("duplicateTab")},{id:"tab.private",label:"New private tab",scope:"global",keys:["ctrl+shift+n"],command:L("newPrivateTab")},{id:"window.new",label:"New window",scope:"global",keys:["ctrl+n"],command:L("newWindow")},{id:"nav.address",label:"Focus the address bar",scope:"global",keys:["ctrl+l","alt+d"],mac:["cmd+l","alt+d"],command:L("focusAddressBar")},{id:"nav.back",label:"Back",scope:"global",keys:["alt+left"],mac:["cmd+["],command:L("goBack")},{id:"nav.forward",label:"Forward",scope:"global",keys:["alt+right"],mac:["cmd+]"],command:L("goForward")},{id:"nav.reload",label:"Reload",scope:"global",keys:["ctrl+r","f5"],mac:["cmd+r"],command:L("reload")},{id:"nav.hardReload",label:"Hard reload",scope:"global",keys:["ctrl+shift+r","ctrl+f5"],mac:["cmd+shift+r"],command:L("hardReload")},{id:"nav.stop",label:"Stop loading",scope:"global",keys:[],command:L("stop")},{id:"nav.home",label:"Home page",scope:"global",keys:["alt+home"],mac:["cmd+shift+h"],command:L("goHome")},{id:"page.find",label:"Find in page",scope:"global",keys:["ctrl+f"],command:L("find")},{id:"page.zoomIn",label:"Zoom in",scope:"global",keys:["ctrl+=","ctrl+shift+="],command:L("zoomIn")},{id:"page.zoomOut",label:"Zoom out",scope:"global",keys:["ctrl+-"],command:L("zoomOut")},{id:"page.zoomReset",label:"Reset zoom",scope:"global",keys:["ctrl+0"],command:L("zoomReset")},{id:"page.bookmark",label:"Bookmark this page",scope:"global",keys:["ctrl+d"],command:L("bookmarkPage")},{id:"page.source",label:"View page source",scope:"global",keys:["ctrl+u"],mac:["cmd+alt+u"],command:L("viewSource")},{id:"page.pdf",label:"Save page as PDF",scope:"global",keys:[],command:L("savePdf")},{id:"page.copyUrl",label:"Copy page address",scope:"global",keys:["ctrl+shift+l"],command:L("copyUrl")},{id:"page.external",label:"Open in system browser",scope:"global",keys:[],command:L("openInSystemBrowser")},{id:"page.devtools",label:"Open DevTools",scope:"global",keys:["f12"],command:L("openDevTools")},{id:"page.contextToAgent",label:"Send page context to agent",scope:"global",keys:["ctrl+alt+enter"],command:L("sendPageContextToChat")},{id:"agent.showContext",label:"Show agent context",scope:"global",keys:["ctrl+shift+alt+a"],command:L("showAgentContext"),everywhere:!0},{id:"agent.sendLatest",label:"Send the latest capture to the agent",scope:"global",keys:["ctrl+shift+alt+v"],command:L("sendLatestContext"),everywhere:!0},{id:"open.history",label:"History",scope:"global",keys:["ctrl+h"],mac:["cmd+y"],command:L("showHistory")},{id:"open.downloads",label:"Downloads",scope:"global",keys:["shift+alt+l"],command:L("showDownloads")},{id:"open.bookmarks",label:"Bookmark manager",scope:"global",keys:["ctrl+alt+b"],command:L("showBookmarks")},{id:"open.bookmarksBar",label:"Show or hide the bookmarks bar",scope:"global",keys:["ctrl+shift+b"]},{id:"open.quickActions",label:"Quick actions",scope:"global",keys:["ctrl+shift+k"]},{id:"open.shortcuts",label:"Change keyboard shortcuts",scope:"global",keys:["ctrl+alt+k"],command:L("editShortcuts")},{id:"open.cheatSheet",label:"Keyboard shortcuts of this mode",scope:"global",keys:["ctrl+shift+/"],mac:["cmd+alt+/"]},{id:"mode.inspect",label:"Element picker",scope:"global",keys:["shift+alt+e"]},{id:"mode.draw",label:"Draw on the page",scope:"global",keys:["shift+alt+w"]},{id:"mode.screenshot",label:"Screenshot",scope:"global",keys:["shift+alt+g"]},{id:"mode.devtools",label:"Console and network",scope:"global",keys:["shift+alt+j"]},{id:"mode.device",label:"Device toolbar",scope:"global",keys:["shift+alt+m"]},{id:"mode.measure",label:"Measure",scope:"global",keys:["shift+alt+u"]},{id:"mode.eyedropper",label:"Eyedropper",scope:"global",keys:["shift+alt+y"]},{id:"mode.overlay",label:"Design overlay",scope:"global",keys:["shift+alt+o"]},{id:"mode.tweak",label:"CSS tweak",scope:"global",keys:["shift+alt+v"]},{id:"mode.record",label:"Record the page",scope:"global",keys:["ctrl+alt+r"]},{id:"mode.a11y",label:"Accessibility check",scope:"global",keys:["shift+alt+h"]},{id:"inspect.parent",label:"Select the parent element",scope:"inspect",keys:["up"]},{id:"inspect.child",label:"Select the first child element",scope:"inspect",keys:["down"]},{id:"inspect.copy",label:"Copy the selected elements",scope:"inspect",keys:["enter","c"]},{id:"inspect.screenshot",label:"Screenshot the element",scope:"inspect",keys:["s"]},{id:"inspect.agent",label:"Send the element to the agent",scope:"inspect",keys:["a"]},{id:"inspect.help",label:"Show these shortcuts",scope:"inspect",keys:["shift+/"]},{id:"inspect.exit",label:"Exit",scope:"inspect",keys:["escape"]},{id:"draw.select",label:"Select and move",scope:"draw",keys:["v"]},{id:"draw.pen",label:"Pen",scope:"draw",keys:["p"]},{id:"draw.pencil",label:"Pencil",scope:"draw",keys:["i"]},{id:"draw.marker",label:"Marker",scope:"draw",keys:["m"]},{id:"draw.brush",label:"Brush",scope:"draw",keys:["u"]},{id:"draw.highlighter",label:"Highlighter",scope:"draw",keys:["h"]},{id:"draw.neon",label:"Neon",scope:"draw",keys:["g"]},{id:"draw.line",label:"Line",scope:"draw",keys:["l"]},{id:"draw.arrow",label:"Arrow",scope:"draw",keys:["a"]},{id:"draw.doubleArrow",label:"Double arrow",scope:"draw",keys:["d"]},{id:"draw.rect",label:"Rectangle",scope:"draw",keys:["r"]},{id:"draw.ellipse",label:"Ellipse",scope:"draw",keys:["o"]},{id:"draw.text",label:"Text",scope:"draw",keys:["t"]},{id:"draw.callout",label:"Numbered callout",scope:"draw",keys:["n"]},{id:"draw.blur",label:"Redact (pixelate)",scope:"draw",keys:["b"]},{id:"draw.eraser",label:"Eraser",scope:"draw",keys:["e"]},...[1,2,3,4,5,6,7,8,9].map(e=>({id:`draw.color${e}`,label:`Color ${e}`,scope:"draw",keys:[String(e)]})),{id:"draw.thinner",label:"Thinner stroke",scope:"draw",keys:["["]},{id:"draw.thicker",label:"Thicker stroke",scope:"draw",keys:["]"]},{id:"draw.fill",label:"Fill shapes on or off",scope:"draw",keys:["f"]},{id:"draw.undo",label:"Undo",scope:"draw",keys:["ctrl+z"]},{id:"draw.redo",label:"Redo",scope:"draw",keys:["ctrl+y","ctrl+shift+z"]},{id:"draw.clear",label:"Clear all drawings",scope:"draw",keys:["shift+backspace"]},{id:"draw.visible",label:"Hide or show drawings",scope:"draw",keys:["w"]},{id:"draw.capture",label:"Screenshot the drawing area",scope:"draw",keys:["enter"]},{id:"draw.captureAgent",label:"Screenshot the drawing area and send it to the agent",scope:"draw",keys:["shift+enter"]},{id:"draw.captureMenu",label:"Screenshot menu",scope:"draw",keys:["s"]},{id:"draw.captureGroups",label:"Screenshot each drawing separately",scope:"draw",keys:["alt+g"]},{id:"draw.captureClean",label:"Screenshot the drawing area without drawings",scope:"draw",keys:["alt+c"]},{id:"draw.captureViewport",label:"Screenshot the visible area with drawings",scope:"draw",keys:["alt+v"]},{id:"draw.captureFullPage",label:"Screenshot the full page with drawings",scope:"draw",keys:["alt+f"]},{id:"draw.captureRegion",label:"Screenshot an area you drag, with drawings",scope:"draw",keys:["alt+r"]},{id:"draw.help",label:"Show these shortcuts",scope:"draw",keys:["shift+/"]},{id:"draw.exit",label:"Stop drawing",scope:"draw",keys:["escape"]},{id:"shot.viewport",label:"Visible area",scope:"screenshot",keys:["v"]},{id:"shot.fullPage",label:"Full page",scope:"screenshot",keys:["f"]},{id:"shot.region",label:"Region",scope:"screenshot",keys:["r"]},{id:"shot.element",label:"Element",scope:"screenshot",keys:["e"]},{id:"shot.drawing",label:"Drawing area",scope:"screenshot",keys:["d"]},{id:"shot.lastToAgent",label:"Send the last screenshot to the agent",scope:"screenshot",keys:["a"],command:L("screenshot.sendToTerminal")},{id:"send.default",label:"Send to the default agent",scope:"send",keys:["enter"]},{id:"send.newThread",label:"New agentmux thread",scope:"send",keys:["n"]},{id:"send.prompt",label:"Write a prompt",scope:"send",keys:["i"]},{id:"send.project",label:"Change project",scope:"send",keys:["p"]},{id:"send.copy",label:"Copy",scope:"send",keys:["c"]},{id:"send.download",label:"Download",scope:"send",keys:["d"]},{id:"send.close",label:"Close (keep it saved)",scope:"send",keys:["escape"]},{id:"dev.console",label:"Console",scope:"devtools",keys:["alt+1"]},{id:"dev.network",label:"Network",scope:"devtools",keys:["alt+2"]},{id:"dev.filter",label:"Filter",scope:"devtools",keys:["alt+f"]},{id:"dev.copyErrors",label:"Copy console errors",scope:"devtools",keys:["alt+e"]},{id:"dev.copyFailed",label:"Copy failed requests",scope:"devtools",keys:["alt+q"]},{id:"dev.copyContext",label:"Copy page context",scope:"devtools",keys:["alt+p"]},{id:"dev.contextAgent",label:"Send page context to the agent",scope:"devtools",keys:["alt+shift+p"]},{id:"dev.clear",label:"Clear",scope:"devtools",keys:["alt+k"]},{id:"dev.close",label:"Close",scope:"devtools",keys:["alt+w"]},{id:"device.previous",label:"Previous device",scope:"device",keys:["alt+["]},{id:"device.next",label:"Next device",scope:"device",keys:["alt+]"]},{id:"device.rotate",label:"Rotate",scope:"device",keys:["alt+r"]},{id:"device.touch",label:"Touch and mobile on or off",scope:"device",keys:["alt+t"]},{id:"device.fit",label:"Fit to window",scope:"device",keys:["alt+0"]},{id:"device.zoomIn",label:"Zoom in",scope:"device",keys:["alt+="]},{id:"device.zoomOut",label:"Zoom out",scope:"device",keys:["alt+-"]},{id:"device.network",label:"Next network speed",scope:"device",keys:["alt+n"]},{id:"device.theme",label:"Next color scheme",scope:"device",keys:["alt+l"]},{id:"device.close",label:"Close the device toolbar",scope:"device",keys:[]},{id:"measure.grid",label:"Rulers and grid on or off",scope:"measure",keys:["g"]},{id:"measure.copy",label:"Copy the measurements",scope:"measure",keys:["c"]},{id:"measure.clear",label:"Clear the pinned element",scope:"measure",keys:["backspace"]},{id:"measure.help",label:"Show these shortcuts",scope:"measure",keys:["shift+/"]},{id:"measure.exit",label:"Exit",scope:"measure",keys:["escape"]},{id:"eyedropper.hex",label:"Copy colors as hex",scope:"eyedropper",keys:["h"]},{id:"eyedropper.rgb",label:"Copy colors as rgb()",scope:"eyedropper",keys:["r"]},{id:"eyedropper.hsl",label:"Copy colors as hsl()",scope:"eyedropper",keys:["l"]},{id:"eyedropper.help",label:"Show these shortcuts",scope:"eyedropper",keys:["shift+/"]},{id:"eyedropper.exit",label:"Exit",scope:"eyedropper",keys:["escape"]},{id:"overlay.open",label:"Open an image",scope:"overlay",keys:["alt+o"]},{id:"overlay.fainter",label:"Less opaque",scope:"overlay",keys:["alt+,"]},{id:"overlay.stronger",label:"More opaque",scope:"overlay",keys:["alt+."]},{id:"overlay.left",label:"Nudge left",scope:"overlay",keys:["alt+left"]},{id:"overlay.right",label:"Nudge right",scope:"overlay",keys:["alt+right"]},{id:"overlay.up",label:"Nudge up",scope:"overlay",keys:["alt+up"]},{id:"overlay.down",label:"Nudge down",scope:"overlay",keys:["alt+down"]},{id:"overlay.difference",label:"Difference blend on or off",scope:"overlay",keys:["alt+x"]},{id:"overlay.hide",label:"Hide or show the overlay",scope:"overlay",keys:["alt+h"]},{id:"overlay.exit",label:"Close the overlay",scope:"overlay",keys:["alt+z"]},{id:"tweak.agent",label:"Send the CSS changes to the agent",scope:"tweak",keys:["ctrl+enter"]},{id:"tweak.copy",label:"Copy the CSS changes",scope:"tweak",keys:["ctrl+shift+c"]},{id:"tweak.undo",label:"Undo the last change",scope:"tweak",keys:["ctrl+z"]},{id:"tweak.exit",label:"Exit and revert",scope:"tweak",keys:["escape"]},{id:"record.stop",label:"Stop and save",scope:"record",keys:["alt+s"]},{id:"record.pause",label:"Pause or resume",scope:"record",keys:["alt+y"]},{id:"record.cancel",label:"Cancel",scope:"record",keys:["alt+backspace"]},{id:"a11y.next",label:"Next issue",scope:"a11y",keys:["n","down"]},{id:"a11y.previous",label:"Previous issue",scope:"a11y",keys:["p","up"]},{id:"a11y.tabOrder",label:"Tab order on or off",scope:"a11y",keys:["t"]},{id:"a11y.copy",label:"Copy the report",scope:"a11y",keys:["c"]},{id:"a11y.agent",label:"Send the report to the agent",scope:"a11y",keys:["a"]},{id:"a11y.help",label:"Show these shortcuts",scope:"a11y",keys:["shift+/"]},{id:"a11y.exit",label:"Exit",scope:"a11y",keys:["escape"]}];function fa(e,t){return t?[...e.mac??e.keys.map(n=>n.replace(/\bctrl\+/,"cmd+"))]:[...e.keys]}function hl(e){let t=hi(e.trim());return t.key?[t.ctrl&&"ctrl",t.shift&&"shift",t.alt&&"alt",t.meta&&"cmd",t.key].filter(Boolean).join("+"):""}function yl(e,t){let n={};for(let o of It){let a=e[o.id],l=(a===void 0?fa(o,t):typeof a=="string"?[a]:[...a]).map(hl);n[o.id]=[...new Set(l.filter(Boolean))]}return n}function qd(e){if(!e||typeof e!="object"||Array.isArray(e))return{};let t=new Set(It.map(o=>o.id)),n={};for(let[o,a]of Object.entries(e))t.has(o)&&(typeof a=="string"||Array.isArray(a)&&a.every(l=>typeof l=="string"))&&(n[o]=a);return n}var Dd=new Set(["devtools","device","overlay","record"]);function Yd(e){let t=new Map(It.map(a=>[a.id,a.scope])),n=new Map;for(let[a,l]of Object.entries(e))for(let c of l)n.set(c,[...n.get(c)??[],a]);let o=[];for(let[a,l]of n)for(let c=0;c<l.length;c++)for(let i=c+1;i<l.length;i++){let[r,d]=[t.get(l[c]),t.get(l[i])];(r===d||Dd.has(r)&&Dd.has(d))&&o.push({key:a,ids:[l[c],l[i]]})}return o}function mi(e){return[e.ctrl&&"ctrl",e.shift&&"shift",e.alt&&"alt",e.meta&&"cmd",e.key].filter(Boolean).join("+")}var gi=new Set(["mode.inspect","mode.draw","mode.screenshot","mode.device","mode.devtools","page.bookmark","open.shortcuts","inspect.parent","inspect.child","inspect.copy","inspect.exit",...["select","pen","pencil","marker","brush","highlighter","neon","line","arrow","doubleArrow","rect","ellipse","text","callout","blur","eraser"].map(e=>`draw.${e}`),...Array.from({length:9},(e,t)=>`draw.color${t+1}`),"draw.thinner","draw.thicker","draw.fill","draw.undo","draw.redo","draw.clear","draw.visible","draw.capture","draw.captureMenu","draw.captureGroups","draw.captureClean","draw.captureViewport","draw.captureFullPage","draw.captureRegion","draw.exit","shot.viewport","shot.fullPage","shot.region","shot.element","shot.drawing","send.default","send.newThread","send.prompt","send.project","send.copy","send.download","send.close"]),eg=new Set([]),Rd={id:"vs",label:"VS",title:"Works in VS Code Browser"},Bd={id:"br",label:"BR",title:"Works in the Inkspect toolbar in your browser (Chrome, Edge, Firefox...)"};function jd(e){return eg.has(e.scope)?[Bd]:gi.has(e.id)?[Rd,Bd]:[Rd]}var tg={control:"ctrl",ctl:"ctrl","\u2303":"ctrl",option:"alt",opt:"alt","\u2325":"alt",command:"cmd",meta:"cmd",win:"cmd",super:"cmd","\u2318":"cmd","\u21E7":"shift",esc:"escape",return:"enter","\u21A9":"enter",del:"delete","\u2191":"up","\u2193":"down","\u2190":"left","\u2192":"right",pgup:"pageup",pgdn:"pagedown","+":"="},Ud=new Set(["ctrl","shift","alt","cmd"]);function kl(e,t){let n=t.toLowerCase().replace(/([⌃⌥⇧⌘↩↑↓←→])/g," $1 ").split(/\s+|[+-](?=.)/).filter(Boolean).map(r=>tg[r]??r);if(!n.length)return!1;let o=n.filter(r=>Ud.has(r)),a=n.filter(r=>!Ud.has(r));if(a.length>1)return!1;let l=hi(hl(e)),c={ctrl:l.ctrl,shift:l.shift,alt:l.alt,cmd:l.meta};if(!o.every(r=>c[r]))return!1;let[i]=a;return i===void 0||l.key.startsWith(i)}function Vd(e){if(!e.key)return;let t=/^f([1-9]|1\d|2[0-4])$/.test(e.key);return e.ctrl||e.alt||e.meta||t?mi(e):void 0}function Gd(e,t){let n=Rt(e,t);return t?[...[...n.matchAll(/[⌃⌥⇧⌘]/g)].map(a=>a[0]),n.replace(/[⌃⌥⇧⌘]/g,"")]:n.split(/\+(?=.)/)}var Xd={global:"browser",inspect:"inspect",draw:"edit",screenshot:"device-camera",devtools:"debug-console",device:"device-mobile",measure:"symbol-ruler",eyedropper:"symbol-color",overlay:"layers",tweak:"symbol-property",record:"record",a11y:"accessibility",send:"send"};function Rt(e,t){let n=hi(e),o={escape:"Esc",enter:t?"\u21A9":"Enter",backspace:t?"\u232B":"Backspace",delete:t?"\u2326":"Delete",up:"\u2191",down:"\u2193",left:"\u2190",right:"\u2192",pageup:"PgUp",pagedown:"PgDn",tab:t?"\u21E5":"Tab",space:"Space","/":n.shift?"?":"/"},a=!(n.key==="/"&&n.shift),l=o[n.key]??(n.key.length===1?n.key.toUpperCase():n.key[0].toUpperCase()+n.key.slice(1));return t?`${n.ctrl?"\u2303":""}${n.alt?"\u2325":""}${n.shift&&a?"\u21E7":""}${n.meta?"\u2318":""}${l}`:[n.ctrl&&"Ctrl",n.alt&&"Alt",n.shift&&a&&"Shift",l].filter(Boolean).join("+")}function hi(e){let t=e.toLowerCase().split("+"),n=t.pop()??"";return{ctrl:t.includes("ctrl"),shift:t.includes("shift"),alt:t.includes("alt"),meta:t.includes("cmd")||t.includes("meta")||t.includes("win"),key:n}}var ng={arrowleft:"left",arrowright:"right",arrowup:"up",arrowdown:"down",esc:"escape"," ":"space","+":"="},Hd={Equal:"=",Minus:"-",BracketLeft:"[",BracketRight:"]",Slash:"/",Backslash:"\\",Comma:",",Period:".",Semicolon:";",Quote:"'",Backquote:"`",NumpadAdd:"=",NumpadSubtract:"-"},xl=new Set(["Control","Shift","Alt","Meta","AltGraph","OS"]),Ld={"?":"/","<":",",">":".",":":";",'"':"'","{":"[","}":"]","|":"\\","~":"`",_:"-","+":"=","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0"};function Sl(e){let t={ctrl:e.ctrlKey,shift:e.shiftKey,alt:e.altKey,meta:e.metaKey};if(e.getModifierState?.("AltGraph"))return{...t,key:""};let n=e.key,o;return/^[a-z0-9]$/i.test(n)?o=n.toLowerCase():e.shiftKey&&Ld[n]!==void 0?o=Ld[n]:/^[-=[\]\\/,.;'`+]$/.test(n)?o=n:/^Key[A-Z]$/.test(e.code)?o=e.code.slice(3).toLowerCase():/^Digit\d$/.test(e.code)?o=e.code.slice(5):Hd[e.code]?o=Hd[e.code]:o=n.toLowerCase(),{...t,key:ng[o]??o}}var cs=H(et(),1);var ls,kg=e=>{let t=e.composedPath()[0];if(e.button!==0){ls=void 0;return}t instanceof Element&&(ls={element:t.closest('button, [role="button"], a')??t,at:performance.now()})};typeof window<"u"&&window.addEventListener("pointerdown",kg,!0);function Ve(...e){return e.filter(Boolean).join(" ")}var so=H(ee(),1);function Pt({variant:e="secondary",size:t="md",icon:n,iconEnd:o,loading:a,className:l,children:c,disabled:i,type:r="button",...d}){let b=a?"loading":n;return(0,so.jsxs)("button",{type:r,className:Ve("button",e,t==="sm"&&"small",l),disabled:i||a,"aria-busy":a||void 0,...d,children:[b&&(0,so.jsx)("span",{className:Ve("codicon",`codicon-${b}`,a&&"codicon-modifier-spin"),"aria-hidden":"true"}),c!==void 0&&(0,so.jsx)("span",{className:"button-label",children:c}),o&&(0,so.jsx)("span",{className:`codicon codicon-${o}`,"aria-hidden":"true"})]})}var El=H(et(),1);var ds=H(ee(),1);function zi({children:e,confirmLabel:t,onConfirm:n,icon:o,variant:a="ghost",size:l="sm",disabled:c,title:i,className:r}){let[d,b]=(0,El.useState)(!1);return(0,El.useEffect)(()=>{if(!d)return;let m=setTimeout(()=>b(!1),4e3);return()=>clearTimeout(m)},[d]),(0,ds.jsx)(Pt,{size:l,variant:d?"danger":a,icon:d?"warning":o,disabled:c,title:i,className:r,"aria-live":"polite",onClick:()=>{if(!d){b(!0);return}b(!1),n()},onBlur:()=>b(!1),children:d?t:e})}var Ni=H(ee(),1),wg=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function ba({binding:e,size:t="md"}){let n=Gd(e,wg);return(0,Ni.jsx)("span",{className:`keycaps size-${t}`,"aria-label":n.join("+"),children:n.map((o,a)=>(0,Ni.jsx)("kbd",{className:"keycap",children:o},a))})}var ss=H(et(),1);var Rn=H(ee(),1);function fs({value:e,options:t,onChange:n,label:o,iconOnly:a,size:l="md",className:c}){let i=(0,ss.useRef)(null),r=d=>{let b={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[d.key];if(!b)return;d.preventDefault();let m=t.findIndex(p=>p.value===e),f=t[(m+b+t.length)%t.length];n(f.value),i.current?.querySelector(`[data-value="${CSS.escape(f.value)}"]`)?.focus()};return(0,Rn.jsx)("div",{ref:i,className:Ve("segmented",`size-${l}`,c),role:"radiogroup","aria-label":o,onKeyDown:r,children:t.map(d=>{let b=d.value===e;return(0,Rn.jsxs)("button",{type:"button",role:"radio","aria-checked":b,"aria-label":a?d.label:void 0,title:a||d.icon?d.label:void 0,"data-value":d.value,tabIndex:b?0:-1,className:Ve("segment",b&&"checked"),onClick:()=>n(d.value),children:[d.icon&&(0,Rn.jsx)("span",{className:`codicon codicon-${d.icon}`,"aria-hidden":"true"}),!a&&(0,Rn.jsx)("span",{className:"segment-label",children:d.label}),d.count!==void 0&&(0,Rn.jsx)("span",{className:Ve("segment-count",d.tone),children:d.count})]},d.value)})})}var en=H(et(),1);var Oi=H(ee(),1);function Ci({icon:e,label:t,onClick:n,onContextMenu:o,disabled:a,active:l,spin:c,className:i}){return(0,Oi.jsx)("button",{type:"button",className:["icon-button",l&&"active",i].filter(Boolean).join(" "),title:t,"aria-label":t,"aria-pressed":l,disabled:a,onClick:n,onContextMenu:o,children:(0,Oi.jsx)("span",{className:`codicon codicon-${e}${c?" codicon-modifier-spin":""}`,"aria-hidden":"true"})})}var M=H(ee(),1),fo=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function ps({actions:e,scopes:t,map:n,overrides:o,query:a="",labelOf:l=d=>d.label,scopeLabel:c=d=>sa[d],onSetKeys:i,onReset:r}){let[d,b]=(0,en.useState)(new Set),[m,f]=(0,en.useState)(null),p=(0,en.useMemo)(()=>new Set(e.map(s=>s.id)),[e]),k=(0,en.useMemo)(()=>Yd(n).filter(s=>s.ids.every(g=>p.has(g))),[n,p]),S=s=>k.filter(g=>g.ids.includes(s)).map(g=>({key:g.key,other:g.ids.find(y=>y!==s)}));(0,en.useEffect)(()=>{if(!m)return;let s=y=>{if(y.preventDefault(),y.stopImmediatePropagation(),xl.has(y.key))return;let w=Sl(y);if(!w.key)return;let x=!w.ctrl&&!w.alt&&!w.meta&&!w.shift,E=[...n[m.id]??[]];if(x&&w.key==="escape"){f(null);return}if(x&&w.key==="backspace"&&m.index!==void 0)E.splice(m.index,1);else{let B=mi(w);m.index===void 0?E.push(B):E[m.index]=B}i(m.id,[...new Set(E)]),f(null)},g=y=>{y.composedPath().some(x=>x instanceof HTMLElement&&x.classList.contains("key-recording"))||f(null)};return window.addEventListener("keydown",s,!0),window.addEventListener("pointerdown",g,!0),()=>{window.removeEventListener("keydown",s,!0),window.removeEventListener("pointerdown",g,!0)}},[m,n,i]);let z=a.trim().toLowerCase(),v=s=>!z||l(s).toLowerCase().includes(z)||s.id.toLowerCase().includes(z)||c(s.scope).toLowerCase().includes(z)||(n[s.id]??[]).some(g=>Rt(g,fo).toLowerCase().includes(z)||kl(g,z)),u=s=>{let g=e.find(y=>y.id===s);return g?l(g):s};return(0,M.jsxs)("div",{className:"shortcut-list",children:[k.length>0&&(0,M.jsxs)("p",{className:"shortcuts-warning",role:"alert",children:[(0,M.jsx)("span",{className:"codicon codicon-warning","aria-hidden":"true"}),k.length===1?"1 key is":`${k.length} keys are`," used twice."]}),t.map(s=>{let g=e.filter(w=>w.scope===s&&v(w));if(!g.length)return null;let y=z!==""||!d.has(s);return(0,M.jsxs)("section",{className:"shortcut-group",children:[(0,M.jsxs)("button",{type:"button",className:"group-header","aria-expanded":y,onClick:()=>b(w=>{let x=new Set(w);return x.has(s)?x.delete(s):x.add(s),x}),children:[(0,M.jsx)("span",{className:`codicon codicon-chevron-${y?"down":"right"}`,"aria-hidden":"true"}),(0,M.jsx)("span",{className:`codicon codicon-${Xd[s]} group-icon`,"aria-hidden":"true"}),(0,M.jsx)("span",{className:"group-title",children:c(s)}),(0,M.jsx)("span",{className:"group-count",children:g.length})]}),y&&g.map(w=>(0,M.jsx)(Tg,{action:w,label:l(w),keys:n[w.id]??[],changed:w.id in o,conflicts:S(w.id).map(x=>({...x,otherLabel:u(x.other)})),recording:m?.id===w.id?m:null,onRecord:x=>f({id:w.id,index:x}),onCancel:()=>f(null),onRemove:x=>i(w.id,(n[w.id]??[]).filter((E,B)=>B!==x)),onReset:()=>r(w.id),onResolve:(x,E)=>i(x,(n[x]??[]).filter(B=>B!==E))},w.id))]},s)})]})}function Tg({action:e,label:t,keys:n,changed:o,conflicts:a,recording:l,onRecord:c,onCancel:i,onRemove:r,onReset:d,onResolve:b}){let m=fa(e,fo).map(p=>Rt(p,fo)).join(", ")||"none",f=l!==null&&l.index===void 0;return(0,M.jsxs)("div",{className:`shortcut-item${o?" changed":""}${a.length?" conflict":""}`,children:[(0,M.jsxs)("div",{className:"shortcut-main",children:[(0,M.jsx)("span",{className:"shortcut-label",title:e.id,children:t}),(0,M.jsx)("span",{className:"shortcut-places",children:jd(e).map(p=>(0,M.jsx)("span",{className:`shortcut-tag ${p.id}`,title:p.title,children:p.label},p.id))}),(0,M.jsxs)("span",{className:"shortcut-actions",children:[o&&(0,M.jsx)(Ci,{icon:"discard",label:`Reset to default (${m})`,className:"small",onClick:d}),n.length>0&&!f&&(0,M.jsx)(Ci,{icon:"add",label:"Add another key",className:"small add-key",onClick:()=>c()})]}),(0,M.jsxs)("span",{className:"shortcut-keys-column",children:[n.map((p,k)=>l?.index===k?(0,M.jsx)(bs,{onCancel:i},p):(0,M.jsxs)("span",{className:"key-button-wrap",children:[(0,M.jsx)("button",{type:"button",className:"key-button",title:"Change: click, then press the new keys","aria-label":`${Rt(p,fo)}: change`,onClick:()=>c(k),children:(0,M.jsx)(ba,{binding:p,size:"sm"})}),(0,M.jsx)("button",{type:"button",className:"key-remove","aria-label":`Remove ${Rt(p,fo)}`,title:"Remove this key",onClick:()=>r(k),children:(0,M.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]},p)),f&&(0,M.jsx)(bs,{onCancel:i}),!n.length&&!f&&(0,M.jsxs)("button",{type:"button",className:"key-empty",title:"Add a key: click, then press the keys",onClick:()=>c(),children:[(0,M.jsx)("span",{className:"codicon codicon-add","aria-hidden":"true"}),"Add key"]})]})]}),a.map(({key:p,other:k,otherLabel:S})=>(0,M.jsxs)("div",{className:"shortcut-conflict",children:[(0,M.jsx)("span",{className:"codicon codicon-warning","aria-hidden":"true"}),(0,M.jsxs)("span",{children:[Rt(p,fo)," is also \u201C",S,"\u201D"]}),(0,M.jsx)("button",{type:"button",className:"link-button",onClick:()=>b(k,p),children:"Remove it there"})]},`${p}-${k}`))]})}function bs({onCancel:e}){return(0,M.jsxs)("span",{className:"key-recording",role:"status",children:[(0,M.jsx)("span",{className:"recording-dot","aria-hidden":"true"}),"Press keys\u2026",(0,M.jsx)("button",{type:"button",className:"key-recording-cancel","aria-label":"Cancel",onClick:e,children:(0,M.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]})}var Un=H(et(),1);var Bn=H(ee(),1);function vs({icon:e,trailing:t,size:n="md",onClear:o,invalid:a,className:l,disabled:c,...i}){let r=i.value!==void 0&&String(i.value)!=="";return(0,Bn.jsxs)("div",{className:Ve("text-field",`size-${n}`,a&&"invalid",c&&"disabled",l),children:[e&&(0,Bn.jsx)("span",{className:`codicon codicon-${e} text-field-icon`,"aria-hidden":"true"}),(0,Bn.jsx)("input",{spellCheck:!1,...i,disabled:c,"aria-invalid":a||void 0}),o&&r&&(0,Bn.jsx)("button",{type:"button",className:"text-field-clear","aria-label":"Clear",title:"Clear",tabIndex:-1,onClick:o,children:(0,Bn.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})}),t]})}var hs=H(ee(),1),Eg=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),Bt=null;function ms(e){return Bt?(Bt(e),!0):!1}typeof window<"u"&&window.addEventListener("keydown",e=>{if(!Bt||xl.has(e.key))return;e.stopImmediatePropagation();let t=Vd(Sl(e));t&&(e.preventDefault(),Bt(t))},!0);function gs({value:e,onChange:t,size:n}){let o=(0,Un.useRef)(t);(0,Un.useEffect)(()=>{o.current=t});let[a]=(0,Un.useState)(()=>l=>o.current(Rt(l,Eg)));return(0,Un.useEffect)(()=>()=>{Bt===a&&(Bt=null)},[a]),(0,hs.jsx)(vs,{size:n,icon:"search",placeholder:"Search actions or keys, or press a shortcut","aria-label":"Search shortcuts: type, or press a shortcut",value:e,onChange:l=>t(l.target.value),onClear:()=>t(""),onFocus:()=>{Bt=a},onBlur:()=>{Bt===a&&(Bt=null)}})}var Dn=H(et()),Vm=H(zm());var si="inkspectShortcuts",fi=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),N1=It.filter(e=>gi.has(e.id)),Dy={"mode.device":"Responsive view","mode.screenshot":"Screenshot menu","open.shortcuts":"Keyboard shortcuts"},Om=e=>Dy[e.id]??e.label,Cm=e=>e==="global"?"General":sa[e],Nm=["global","inspect","draw","screenshot"],Am=[...Nm,...Object.keys(sa).filter(e=>!Nm.includes(e))];async function _m(){let e=(await chrome.storage.sync.get(si))[si];return{overrides:qd(e?.shortcuts??{}),updated:typeof e?.updated=="number"?e.updated:0}}async function Mm(e){let{updated:t}=await _m();await chrome.storage.sync.set({[si]:{shortcuts:e,updated:Math.max(Date.now(),t+1)}})}function Dm(e){let t=()=>{_m().then(o=>e(yl(o.overrides,fi),o))},n=(o,a)=>{a==="sync"&&o[si]&&t()};return chrome.storage.onChanged.addListener(n),t(),()=>chrome.storage.onChanged.removeListener(n)}async function zd(e,t,n){let o={...e},a=It.find(i=>i.id===t),l=a?fa(a,fi).map(hl):[],c=n!==void 0&&n.length===l.length&&n.every(i=>l.includes(i));n===void 0||c?delete o[t]:o[t]=n,await Mm(o)}async function Rm(){await Mm({})}var bi=H(et()),de=H(ee()),Ry=e=>/^VS Code \((.*)\)$/.exec(e??"")?.[1];function By(e){let[t,n]=(0,bi.useState)([]);return(0,bi.useEffect)(()=>{if(!e)return;let o=!0,a=()=>{chrome.runtime.sendMessage({type:"hub",request:{type:"projects.get",req:crypto.randomUUID()}}).then(c=>{!o||c?.type!=="projects"||n([...new Set(c.projects.filter(i=>i.vscode).map(i=>i.name))])}).catch(()=>{})};a();let l=setInterval(a,4e3);return()=>{o=!1,clearInterval(l)}},[e]),e?t:[]}function Bm({status:e,limit:t=1/0,size:n="lg"}){let o=e.state==="connected",a=By(o),l=e.via==="hub"?"Browser helper":"Linked",c=Ry(e.peer),i=[];if(o){for(let m of a)i.push({id:m,name:`VS Code (${m})`,lastUsed:m===c,tag:l});i.some(m=>m.lastUsed)||i.unshift({id:"peer",name:e.peer??"VS Code",lastUsed:!0,tag:l})}let r=i.slice(0,t),d=i.length-r.length,b=r.findIndex(m=>m.lastUsed);return(0,de.jsxs)("div",{className:`link-graph size-${n} state-${e.state}`,"aria-hidden":"true",children:[(0,de.jsx)("span",{className:"graph-node source",children:(0,de.jsx)("span",{className:"codicon codicon-globe"})}),(0,de.jsx)("ul",{className:"graph-targets",children:o?(0,de.jsxs)(de.Fragment,{children:[r.map((m,f)=>(0,de.jsxs)("li",{className:`graph-target${m.lastUsed?" lit":f<b?" on-path":""}`,children:[(0,de.jsx)("span",{className:"graph-node",children:(0,de.jsx)("span",{className:"codicon codicon-vscode"})}),(0,de.jsx)("span",{className:"graph-name",children:m.name}),m.lastUsed&&(0,de.jsx)("span",{className:"graph-tag",children:m.tag})]},m.id)),d>0&&(0,de.jsx)("li",{className:"graph-target more",children:(0,de.jsxs)("span",{className:"graph-name",children:["and ",d," more"]})})]}):(0,de.jsxs)("li",{className:"graph-target pending",children:[(0,de.jsx)("span",{className:"graph-node",children:(0,de.jsx)("span",{className:"codicon codicon-vscode"})}),(0,de.jsx)("span",{className:"graph-name",children:"VS Code"})]})})]})}var Um=`/* LinkGraph: the browser, and a branch to each VS Code window (a tree connector drawn in CSS).
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
`;var Hm=`/* PairCard: linking this browser (one click in VS Code; the code is the fallback), on the full
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
`;var ml=H(et());var pi=H(et()),ua=H(ee());function Lm({value:e,onChange:t,onComplete:n,length:o=6,disabled:a}){let l=(0,pi.useRef)([]),c=Array.from({length:o},(d,b)=>e[b]??""),i=d=>l.current[Math.max(0,Math.min(o-1,d))]?.focus(),r=(d,b)=>{let m=b.replace(/\D/g,"");if(!m)return;let f=(e.slice(0,d)+m).slice(0,o);t(f),i(f.length),f.length===o&&n?.(f)};return(0,ua.jsx)("div",{className:"code-input",role:"group","aria-label":"Pairing code",children:c.map((d,b)=>(0,ua.jsxs)(pi.Fragment,{children:[b===o/2&&(0,ua.jsx)("span",{className:"code-sep","aria-hidden":"true"}),(0,ua.jsx)("input",{ref:m=>{l.current[b]=m},className:"code-box",inputMode:"numeric",autoComplete:"one-time-code","aria-label":`Digit ${b+1}`,maxLength:o,disabled:a,value:d,onFocus:m=>m.currentTarget.select(),onChange:m=>r(Math.min(b,e.length),m.target.value),onPaste:m=>{m.preventDefault(),r(0,m.clipboardData.getData("text"))},onKeyDown:m=>{if(m.key==="Backspace"){m.preventDefault();let f=d?b:b-1;f>=0&&t(e.slice(0,f)),i(f)}else m.key==="ArrowLeft"?(m.preventDefault(),i(b-1)):m.key==="ArrowRight"&&(m.preventDefault(),i(b+1))}})]},b))})}var Y=H(ee());function qm({status:e,pair:t,compact:n,startWithCode:o}){let[a,l]=(0,ml.useState)(""),[c,i]=(0,ml.useState)(""),[r,d]=(0,ml.useState)(!1),[b,m]=(0,ml.useState)(!!o);if(e.state==="connected")return null;let f=async(k=a)=>{if(k.length!==6||r)return;d(!0),i("");let S=await t(k).catch(()=>{});if(d(!1),!S){i("The extension did not answer. Reload it and try again.");return}i(S.error??""),S.state==="connected"&&l("")},p=(0,Y.jsxs)("p",{className:"card-foot",children:[(0,Y.jsx)("span",{className:"codicon codicon-lock","aria-hidden":"true"}),"The link only talks to VS Code on this computer, and only after pairing (or through the browser helper VS Code installs)."]});return e.via==="hub"?(0,Y.jsx)("div",{className:Ve("card","pair-card",n&&"compact"),children:(0,Y.jsxs)("p",{className:"pair-lead",children:[(0,Y.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,Y.jsx)("span",{children:"Linked through the browser helper: no pairing needed. VS Code isn't running, so sends to its terminals and chat wait for it; captures still save into your projects, and agentmux agents still get them."})]})}):e.state!=="unpaired"?(0,Y.jsxs)("div",{className:Ve("card","pair-card",n&&"compact"),children:[(0,Y.jsxs)("p",{className:"pair-lead",children:[(0,Y.jsx)("span",{className:"codicon codicon-loading codicon-modifier-spin","aria-hidden":"true"}),(0,Y.jsxs)("span",{children:["Open VS Code with the VS Code Browser extension. Then click"," ",(0,Y.jsx)("b",{children:"Pair Browser Extension"})," in its ",(0,Y.jsx)("b",{children:"Browser"})," side panel."]})]}),!n&&p]}):(0,Y.jsxs)("form",{className:Ve("card","pair-card",n&&"compact"),onSubmit:k=>{k.preventDefault(),f()},children:[(0,Y.jsxs)("p",{className:"pair-lead",children:[(0,Y.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,Y.jsxs)("span",{children:["In VS Code, click ",(0,Y.jsx)("b",{children:"Pair Browser Extension"})," in the ",(0,Y.jsx)("b",{children:"Browser"})," side panel (or"," ",(0,Y.jsx)("b",{children:"Pair"})," on its notification). No code needed: this updates by itself."]})]}),b?(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsxs)("p",{className:"muted",children:["Run ",(0,Y.jsx)("kbd",{children:"Browser: Pair Browser Extension with a Code"})," in VS Code, then type the code it shows."]}),(0,Y.jsxs)("div",{className:"pair-row",children:[(0,Y.jsx)(Lm,{value:a,onChange:l,disabled:r,onComplete:k=>{f(k)}}),(0,Y.jsx)(Pt,{type:"submit",variant:"primary",icon:"link",className:"pair-button",loading:r,disabled:a.length!==6,children:"Pair"})]})]}):(0,Y.jsx)(Pt,{size:"sm",variant:"ghost",icon:"key",className:"use-code",onClick:()=>m(!0),children:"Use a code instead"}),c&&(0,Y.jsxs)("p",{className:"pair-message",role:"alert",children:[(0,Y.jsx)("span",{className:"codicon codicon-error","aria-hidden":"true"}),c]}),!n&&p]})}var Ym=`/* The full page. Components and tokens come from @inkspect/shared/ui (ui.css, theme.css); the
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
`;var T=H(ee()),qy=["vscode","shortcuts","about"],jm=()=>{let e=location.hash.slice(1);return qy.includes(e)?e:"vscode"},Yy={connected:{label:"Linked",tone:"ok"},connecting:{label:"Connecting",tone:"busy"},unpaired:{label:"Not paired",tone:"warn"},offline:{label:"VS Code not running",tone:"off"}};function jy(){let[e,t]=(0,Dn.useState)({state:"connecting"}),[n,o]=(0,Dn.useState)(jm),[a,l]=(0,Dn.useState)(()=>({map:yl({},fi),overrides:{}})),[c,i]=(0,Dn.useState)();(0,Dn.useEffect)(()=>{let b=()=>{chrome.runtime.sendMessage({type:"status"}).then(k=>k&&t(k))};b();let m=setInterval(b,2e3),f=()=>o(jm());addEventListener("hashchange",f);let p=Dm((k,S)=>l({map:k,overrides:S.overrides}));return chrome.commands.getAll().then(k=>i(k.find(S=>S.name==="toggle-toolbar")?.shortcut)),()=>{clearInterval(m),removeEventListener("hashchange",f),p()}},[]);let r=b=>{o(b),history.replaceState(null,"",`#${b}`)},d=Yy[e.state];return(0,T.jsxs)("div",{className:"page",children:[(0,T.jsxs)("header",{className:"topbar",children:[(0,T.jsxs)("div",{className:"brand",children:[(0,T.jsx)("img",{src:"icons/48.png",alt:""}),(0,T.jsx)("span",{children:"Inkspect"})]}),(0,T.jsx)(fs,{label:"Sections",className:"page-nav",value:n,onChange:r,options:[{value:"vscode",label:"VS Code",icon:"vscode"},{value:"shortcuts",label:"Shortcuts",icon:"keyboard"},{value:"about",label:"About",icon:"info"}]}),(0,T.jsxs)("span",{className:`status-chip tone-${d.tone}`,role:"status",children:[(0,T.jsx)("span",{className:"status-dot","aria-hidden":"true"}),d.label]})]}),(0,T.jsxs)("main",{className:"main",children:[n==="vscode"&&(0,T.jsx)(Vy,{status:e,setStatus:t}),n==="shortcuts"&&(0,T.jsx)(Gy,{map:a.map,overrides:a.overrides,linked:e.state==="connected",toolbarKey:c}),n==="about"&&(0,T.jsx)(Xy,{status:e,toolbarKey:c,stateLabel:d.label})]})]})}function Vy({status:e,setStatus:t}){let n=e.state==="connected",o=async a=>{let l=await chrome.runtime.sendMessage({type:"pair",code:a}).catch(()=>{});return l&&t(l),l};return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("section",{className:"hero",children:[(0,T.jsxs)("div",{className:"hero-text",children:[(0,T.jsx)("h1",{children:n?`Linked with ${e.peer??"VS Code"}`:e.state==="unpaired"?"Pair with VS Code":e.state==="connecting"?"Looking for VS Code":"Waiting for VS Code"}),(0,T.jsx)("p",{children:n?"Every capture from the toolbar is saved into its project and offered to send to that project\u2019s agents. Bookmarks sync both ways.":e.state==="unpaired"?"VS Code is running. Pair once to save captures into your projects and keep bookmarks in sync.":"Start VS Code with the VS Code Browser extension. This page finds it by itself."})]}),(0,T.jsx)("div",{className:"canvas","aria-label":"The link",children:(0,T.jsx)(Bm,{status:e})})]}),n?(0,T.jsxs)("div",{className:"cards",children:[(0,T.jsx)(da,{icon:"debug-disconnect",title:"This browser",text:"Unlinking stops sends and bookmark sync until you pair again.",children:(0,T.jsx)(zi,{variant:"danger",icon:"debug-disconnect",confirmLabel:"Click again to unlink",onConfirm:()=>{chrome.runtime.sendMessage({type:"unpair"}).then(a=>a&&t(a))},children:"Unlink"})}),(0,T.jsx)(da,{icon:"lock",title:"Private by design",text:"The link only talks to VS Code on this computer (127.0.0.1), and only after pairing."})]}):(0,T.jsx)(qm,{status:e,pair:o,startWithCode:location.hash==="#vscode-code"})]})}function Gy({map:e,overrides:t,linked:n,toolbarKey:o}){let[a,l]=(0,Dn.useState)(""),c=a.trim().toLowerCase(),i=!c||c.split(/\s+/).every(r=>"open the toolbar browser".includes(r))||!!o&&(o.toLowerCase().includes(c)||kl(o,c));return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("section",{className:"hero compact",children:(0,T.jsxs)("div",{className:"hero-text",children:[(0,T.jsx)("h1",{children:"Shortcuts"}),(0,T.jsxs)("p",{children:["Every shortcut of the toolbar and VS Code Browser, one key map:"," ",n?"a change here applies in VS Code too, and the other way round.":"they sync with VS Code once it is linked, and follow your browser account."," ","Click a key, then press the new one."]})]})}),(0,T.jsxs)("div",{className:"card shortcuts-card",children:[(0,T.jsxs)("div",{className:"shortcuts-bar",children:[(0,T.jsx)(gs,{value:a,onChange:l}),(0,T.jsx)(zi,{icon:"discard",confirmLabel:"Click again to reset",title:"Reset all shortcuts (here and in VS Code)",disabled:!Object.keys(t).length,onConfirm:()=>{Rm()},children:"Reset all"})]}),i&&(0,T.jsxs)("div",{className:"browser-key",children:[(0,T.jsx)("span",{className:"codicon codicon-inspect","aria-hidden":"true"}),(0,T.jsx)("span",{className:"browser-key-label",children:"Open the toolbar"}),(0,T.jsx)("span",{className:"shortcut-tag br",title:"Works in your browser. Set by the browser itself, so it does not sync with VS Code",children:"BR"}),o?(0,T.jsx)(ba,{binding:o.toLowerCase(),size:"sm"}):(0,T.jsx)("span",{className:"muted",children:"No key"}),(0,T.jsx)(Pt,{size:"sm",variant:"ghost",onClick:()=>{chrome.tabs.create({url:"chrome://extensions/shortcuts"})},children:"Change"})]}),(0,T.jsx)(ps,{actions:It,scopes:Am,map:e,overrides:t,query:a,labelOf:Om,scopeLabel:Cm,onSetKeys:(r,d)=>{zd(t,r,d)},onReset:r=>{zd(t,r,void 0)}}),(0,T.jsxs)("p",{className:"card-foot",children:[(0,T.jsx)("span",{className:"codicon codicon-info","aria-hidden":"true"}),"VS: works in VS Code Browser. BR: works in this browser's toolbar. It is one key map: changing a key here changes it in VS Code too."]})]})]})}function Xy({status:e,toolbarKey:t,stateLabel:n}){let o=e.state==="connected";return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("section",{className:"hero compact",children:(0,T.jsxs)("div",{className:"hero-text",children:[(0,T.jsx)("h1",{children:"About"}),(0,T.jsxs)("p",{children:["Inkspect ",chrome.runtime.getManifest().version,": a toolbar for working with AI agents on any page, linked with VS Code."]})]})}),(0,T.jsxs)("div",{className:"cards",children:[(0,T.jsx)(da,{icon:"keyboard",title:"Open the toolbar",text:"On any page. The toolbar button opens the popup, which can open it too.",children:(0,T.jsxs)("span",{className:"card-value",children:[t?(0,T.jsx)(ba,{binding:t.toLowerCase(),size:"sm"}):(0,T.jsx)("span",{className:"muted",children:"No key"}),(0,T.jsx)(Pt,{size:"sm",variant:"ghost",onClick:()=>{chrome.tabs.create({url:"chrome://extensions/shortcuts"})},children:"Change"})]})}),(0,T.jsx)(da,{icon:"vscode",title:"VS Code",text:o?`Linked with ${e.peer??"VS Code"}.`:"Not linked yet.",children:(0,T.jsx)("span",{className:"card-value muted",children:n})}),(0,T.jsx)(da,{icon:"bookmark",title:"Bookmarks",text:"Synced with VS Code both ways, live, while it is linked.",children:(0,T.jsx)("span",{className:"card-value muted",children:o?"Syncing":"Paused"})}),(0,T.jsx)(da,{icon:"shield",title:"Access",text:"Only the tab you open the toolbar on, while it is open. Nothing leaves this computer except to VS Code on 127.0.0.1."})]})]})}function da({icon:e,title:t,text:n,children:o}){return(0,T.jsxs)("section",{className:"card info-card",children:[(0,T.jsx)("span",{className:"card-icon","aria-hidden":"true",children:(0,T.jsx)("span",{className:`codicon codicon-${e}`})}),(0,T.jsx)("h2",{children:t}),(0,T.jsx)("p",{children:n}),o&&(0,T.jsx)("div",{className:"card-bottom",children:o})]})}chrome.runtime.onMessage.addListener(e=>{e?.type==="shortcutPressed"&&typeof e.key=="string"&&ms(e.key)});var Gm=document.createElement("style");Gm.textContent=[Cd,Ad,Md,Um,Hm,Ym].join(`
`);document.head.append(Gm);document.documentElement.classList.add("ink-theme");_d(document);(0,Vm.createRoot)(document.getElementById("root")).render((0,T.jsx)(jy,{}));})();
