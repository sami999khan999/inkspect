"use strict";(()=>{var lw=Object.create;var km=Object.defineProperty;var cw=Object.getOwnPropertyDescriptor;var sw=Object.getOwnPropertyNames;var uw=Object.getPrototypeOf,dw=Object.prototype.hasOwnProperty;var Cn=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var fw=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of sw(t))!dw.call(e,a)&&a!==n&&km(e,a,{get:()=>t[a],enumerable:!(o=cw(t,a))||o.enumerable});return e};var L=(e,t,n)=>(n=e!=null?lw(uw(e)):{},fw(t||!e||!e.__esModule?km(n,"default",{value:e,enumerable:!0}):n,e));var Hm=Cn(Oe=>{"use strict";function su(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,a=e[o];if(0<Ol(a,t))e[o]=t,e[n]=a,n=o;else break e}}function Nn(e){return e.length===0?null:e[0]}function Dl(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,a=e.length,i=a>>>1;o<i;){var r=2*(o+1)-1,l=e[r],c=r+1,s=e[c];if(0>Ol(l,n))c<a&&0>Ol(s,l)?(e[o]=s,e[c]=n,o=c):(e[o]=l,e[r]=n,o=r);else if(c<a&&0>Ol(s,n))e[o]=s,e[c]=n,o=c;else break e}}return t}function Ol(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}Oe.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Cm=performance,Oe.unstable_now=function(){return Cm.now()}):(ru=Date,Nm=ru.now(),Oe.unstable_now=function(){return ru.now()-Nm});var Cm,ru,Nm,$n=[],vo=[],hw=1,en=null,yt=3,uu=!1,rr=!1,lr=!1,du=!1,zm=typeof setTimeout=="function"?setTimeout:null,Om=typeof clearTimeout=="function"?clearTimeout:null,Mm=typeof setImmediate<"u"?setImmediate:null;function Rl(e){for(var t=Nn(vo);t!==null;){if(t.callback===null)Dl(vo);else if(t.startTime<=e)Dl(vo),t.sortIndex=t.expirationTime,su($n,t);else break;t=Nn(vo)}}function fu(e){if(lr=!1,Rl(e),!rr)if(Nn($n)!==null)rr=!0,Ga||(Ga=!0,Xa());else{var t=Nn(vo);t!==null&&pu(fu,t.startTime-e)}}var Ga=!1,cr=-1,Rm=5,Dm=-1;function _m(){return du?!0:!(Oe.unstable_now()-Dm<Rm)}function lu(){if(du=!1,Ga){var e=Oe.unstable_now();Dm=e;var t=!0;try{e:{rr=!1,lr&&(lr=!1,Om(cr),cr=-1),uu=!0;var n=yt;try{t:{for(Rl(e),en=Nn($n);en!==null&&!(en.expirationTime>e&&_m());){var o=en.callback;if(typeof o=="function"){en.callback=null,yt=en.priorityLevel;var a=o(en.expirationTime<=e);if(e=Oe.unstable_now(),typeof a=="function"){en.callback=a,Rl(e),t=!0;break t}en===Nn($n)&&Dl($n),Rl(e)}else Dl($n);en=Nn($n)}if(en!==null)t=!0;else{var i=Nn(vo);i!==null&&pu(fu,i.startTime-e),t=!1}}break e}finally{en=null,yt=n,uu=!1}t=void 0}}finally{t?Xa():Ga=!1}}}var Xa;typeof Mm=="function"?Xa=function(){Mm(lu)}:typeof MessageChannel<"u"?(cu=new MessageChannel,Am=cu.port2,cu.port1.onmessage=lu,Xa=function(){Am.postMessage(null)}):Xa=function(){zm(lu,0)};var cu,Am;function pu(e,t){cr=zm(function(){e(Oe.unstable_now())},t)}Oe.unstable_IdlePriority=5;Oe.unstable_ImmediatePriority=1;Oe.unstable_LowPriority=4;Oe.unstable_NormalPriority=3;Oe.unstable_Profiling=null;Oe.unstable_UserBlockingPriority=2;Oe.unstable_cancelCallback=function(e){e.callback=null};Oe.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Rm=0<e?Math.floor(1e3/e):5};Oe.unstable_getCurrentPriorityLevel=function(){return yt};Oe.unstable_next=function(e){switch(yt){case 1:case 2:case 3:var t=3;break;default:t=yt}var n=yt;yt=t;try{return e()}finally{yt=n}};Oe.unstable_requestPaint=function(){du=!0};Oe.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=yt;yt=e;try{return t()}finally{yt=n}};Oe.unstable_scheduleCallback=function(e,t,n){var o=Oe.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=n+a,e={id:hw++,callback:t,priorityLevel:e,startTime:n,expirationTime:a,sortIndex:-1},n>o?(e.sortIndex=n,su(vo,e),Nn($n)===null&&e===Nn(vo)&&(lr?(Om(cr),cr=-1):lr=!0,pu(fu,n-o))):(e.sortIndex=a,su($n,e),rr||uu||(rr=!0,Ga||(Ga=!0,Xa()))),e};Oe.unstable_shouldYield=_m;Oe.unstable_wrapCallback=function(e){var t=yt;return function(){var n=yt;yt=t;try{return e.apply(this,arguments)}finally{yt=n}}}});var Bm=Cn((MT,Lm)=>{"use strict";Lm.exports=Hm()});var Jm=Cn(P=>{"use strict";var hu=Symbol.for("react.transitional.element"),bw=Symbol.for("react.portal"),vw=Symbol.for("react.fragment"),yw=Symbol.for("react.strict_mode"),xw=Symbol.for("react.profiler"),ww=Symbol.for("react.consumer"),kw=Symbol.for("react.context"),Sw=Symbol.for("react.forward_ref"),Ew=Symbol.for("react.suspense"),Tw=Symbol.for("react.memo"),Vm=Symbol.for("react.lazy"),Cw=Symbol.for("react.activity"),Nw=Symbol.for("react.view_transition"),Um=Symbol.iterator;function Mw(e){return e===null||typeof e!="object"?null:(e=Um&&e[Um]||e["@@iterator"],typeof e=="function"?e:null)}var Km={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Xm=Object.assign,Gm={};function Za(e,t,n){this.props=e,this.context=t,this.refs=Gm,this.updater=n||Km}Za.prototype.isReactComponent={};Za.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Za.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Qm(){}Qm.prototype=Za.prototype;function bu(e,t,n){this.props=e,this.context=t,this.refs=Gm,this.updater=n||Km}var vu=bu.prototype=new Qm;vu.constructor=bu;Xm(vu,Za.prototype);vu.isPureReactComponent=!0;var jm=Array.isArray;function gu(){}var Ee={H:null,A:null,T:null,S:null},Zm=Object.prototype.hasOwnProperty;function yu(e,t,n){var o=n.ref;return{$$typeof:hu,type:e,key:t,ref:o!==void 0?o:null,props:n}}function Aw(e,t){return yu(e.type,t,e.props)}function xu(e){return typeof e=="object"&&e!==null&&e.$$typeof===hu}function zw(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var qm=/\/+/g;function mu(e,t){return typeof e=="object"&&e!==null&&e.key!=null?zw(""+e.key):t.toString(36)}function Ow(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(gu,gu):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function Qa(e,t,n,o,a){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var r=!1;if(e===null)r=!0;else switch(i){case"bigint":case"string":case"number":r=!0;break;case"object":switch(e.$$typeof){case hu:case bw:r=!0;break;case Vm:return r=e._init,Qa(r(e._payload),t,n,o,a)}}if(r)return a=a(e),r=o===""?"."+mu(e,0):o,jm(a)?(n="",r!=null&&(n=r.replace(qm,"$&/")+"/"),Qa(a,t,n,"",function(s){return s})):a!=null&&(xu(a)&&(a=Aw(a,n+(a.key==null||e&&e.key===a.key?"":(""+a.key).replace(qm,"$&/")+"/")+r)),t.push(a)),1;r=0;var l=o===""?".":o+":";if(jm(e))for(var c=0;c<e.length;c++)o=e[c],i=l+mu(o,c),r+=Qa(o,t,n,i,a);else if(c=Mw(e),typeof c=="function")for(e=c.call(e),c=0;!(o=e.next()).done;)o=o.value,i=l+mu(o,c++),r+=Qa(o,t,n,i,a);else if(i==="object"){if(typeof e.then=="function")return Qa(Ow(e),t,n,o,a);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return r}function _l(e,t,n){if(e==null)return e;var o=[],a=0;return Qa(e,o,"","",function(i){return t.call(n,i,a++)}),o}function Rw(e){if(e._status===-1){var t=e._result,n=t();n.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,n.status===void 0&&(n.status="fulfilled",n.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,n.status===void 0&&(n.status="rejected",n.reason=o))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var Ym=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function Pm(e){var t=Ee.T,n={};n.types=t!==null?t.types:null,Ee.T=n;try{var o=e(),a=Ee.S;a!==null&&a(n,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(gu,Ym)}catch(i){Ym(i)}finally{t!==null&&n.types!==null&&(t.types=n.types),Ee.T=t}}function $m(e){var t=Ee.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else Pm($m.bind(null,e))}var Dw={map:_l,forEach:function(e,t,n){_l(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return _l(e,function(){t++}),t},toArray:function(e){return _l(e,function(t){return t})||[]},only:function(e){if(!xu(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};P.Activity=Cw;P.Children=Dw;P.Component=Za;P.Fragment=vw;P.Profiler=xw;P.PureComponent=bu;P.StrictMode=yw;P.Suspense=Ew;P.ViewTransition=Nw;P.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Ee;P.__COMPILER_RUNTIME={__proto__:null,c:function(e){return Ee.H.useMemoCache(e)}};P.addTransitionType=$m;P.cache=function(e){return function(){return e.apply(null,arguments)}};P.cacheSignal=function(){return null};P.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=Xm({},e.props),a=e.key;if(t!=null)for(i in t.key!==void 0&&(a=""+t.key),t)!Zm.call(t,i)||i==="key"||i==="__self"||i==="__source"||i==="ref"&&t.ref===void 0||(o[i]=t[i]);var i=arguments.length-2;if(i===1)o.children=n;else if(1<i){for(var r=Array(i),l=0;l<i;l++)r[l]=arguments[l+2];o.children=r}return yu(e.type,a,o)};P.createContext=function(e){return e={$$typeof:kw,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:ww,_context:e},e};P.createElement=function(e,t,n){var o,a={},i=null;if(t!=null)for(o in t.key!==void 0&&(i=""+t.key),t)Zm.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(a[o]=t[o]);var r=arguments.length-2;if(r===1)a.children=n;else if(1<r){for(var l=Array(r),c=0;c<r;c++)l[c]=arguments[c+2];a.children=l}if(e&&e.defaultProps)for(o in r=e.defaultProps,r)a[o]===void 0&&(a[o]=r[o]);return yu(e,i,a)};P.createRef=function(){return{current:null}};P.forwardRef=function(e){return{$$typeof:Sw,render:e}};P.isValidElement=xu;P.lazy=function(e){return{$$typeof:Vm,_payload:{_status:-1,_result:e},_init:Rw}};P.memo=function(e,t){return{$$typeof:Tw,type:e,compare:t===void 0?null:t}};P.startTransition=Pm;P.unstable_useCacheRefresh=function(){return Ee.H.useCacheRefresh()};P.use=function(e){return Ee.H.use(e)};P.useActionState=function(e,t,n){return Ee.H.useActionState(e,t,n)};P.useCallback=function(e,t){return Ee.H.useCallback(e,t)};P.useContext=function(e){return Ee.H.useContext(e)};P.useDebugValue=function(){};P.useDeferredValue=function(e,t){return Ee.H.useDeferredValue(e,t)};P.useEffect=function(e,t){return Ee.H.useEffect(e,t)};P.useEffectEvent=function(e){return Ee.H.useEffectEvent(e)};P.useId=function(){return Ee.H.useId()};P.useImperativeHandle=function(e,t,n){return Ee.H.useImperativeHandle(e,t,n)};P.useInsertionEffect=function(e,t){return Ee.H.useInsertionEffect(e,t)};P.useLayoutEffect=function(e,t){return Ee.H.useLayoutEffect(e,t)};P.useMemo=function(e,t){return Ee.H.useMemo(e,t)};P.useOptimistic=function(e,t){return Ee.H.useOptimistic(e,t)};P.useReducer=function(e,t,n){return Ee.H.useReducer(e,t,n)};P.useRef=function(e){return Ee.H.useRef(e)};P.useState=function(e){return Ee.H.useState(e)};P.useSyncExternalStore=function(e,t,n){return Ee.H.useSyncExternalStore(e,t,n)};P.useTransition=function(){return Ee.H.useTransition()};P.version="19.3.0"});var je=Cn((zT,Im)=>{"use strict";Im.exports=Jm()});var eg=Cn(xt=>{"use strict";var _w=je();function Wm(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function yo(){}var Tt={d:{f:yo,r:function(){throw Error(Wm(522))},D:yo,C:yo,L:yo,m:yo,X:yo,S:yo,M:yo},p:0,findDOMNode:null},Hw=Symbol.for("react.portal"),Lw=Symbol.for("react.recoverable"),Fm=Symbol.for("react.optimistic_key");function Bw(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Hw,key:o==null?null:o===Fm?Fm:""+o,children:e,containerInfo:t,implementation:n}}var sr=_w.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Hl(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}xt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Tt;xt.browser=function(e){return{$$typeof:Lw,_reason:e}};xt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(Wm(299));return Bw(e,t,null,n)};xt.flushSync=function(e){var t=sr.T,n=Tt.p;try{if(sr.T=null,Tt.p=2,e)return e()}finally{sr.T=t,Tt.p=n,Tt.d.f()}};xt.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Tt.d.C(e,t))};xt.prefetchDNS=function(e){typeof e=="string"&&Tt.d.D(e)};xt.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,o=Hl(n,t.crossOrigin),a=typeof t.integrity=="string"?t.integrity:void 0,i=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Tt.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:o,integrity:a,fetchPriority:i}):n==="script"&&Tt.d.X(e,{crossOrigin:o,integrity:a,fetchPriority:i,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};xt.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=Hl(t.as,t.crossOrigin);Tt.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}}else t==null&&Tt.d.M(e)};xt.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,o=Hl(n,t.crossOrigin);Tt.d.L(e,n,{crossOrigin:o,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};xt.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=Hl(t.as,t.crossOrigin);Tt.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0})}else Tt.d.m(e)};xt.requestFormReset=function(e){Tt.d.r(e)};xt.unstable_batchedUpdates=function(e,t){return e(t)};xt.useFormState=function(e,t,n){return sr.H.useFormState(e,t,n)};xt.useFormStatus=function(){return sr.H.useHostTransitionStatus()};xt.version="19.3.0"});var Ll=Cn((RT,ng)=>{"use strict";function tg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(tg)}catch(e){console.error(e)}}tg(),ng.exports=eg()});var V0=Cn(bs=>{"use strict";var We=Bm(),Yh=je(),Uw=Ll();function N(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Vh(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Jr(e){for(var t=e,n=t;n&&!n.alternate;)t=n,(t.flags&4098)!==0&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function Kh(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Xh(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function og(e){if(Jr(e)!==e)throw Error(N(188))}function jw(e){var t=e.alternate;if(!t){if(t=Jr(e),t===null)throw Error(N(188));return t!==e?null:e}for(var n=e,o=t;;){var a=n.return;if(a===null)break;var i=a.alternate;if(i===null){if(o=a.return,o!==null){n=o;continue}break}if(a.child===i.child){for(i=a.child;i;){if(i===n)return og(a),e;if(i===o)return og(a),t;i=i.sibling}throw Error(N(188))}if(n.return!==o.return)n=a,o=i;else{for(var r=!1,l=a.child;l;){if(l===n){r=!0,n=a,o=i;break}if(l===o){r=!0,o=a,n=i;break}l=l.sibling}if(!r){for(l=i.child;l;){if(l===n){r=!0,n=i,o=a;break}if(l===o){r=!0,o=i,n=a;break}l=l.sibling}if(!r)throw Error(N(189))}}if(n.alternate!==o)throw Error(N(190))}if(n.tag!==3)throw Error(N(188));return n.stateNode.current===n?e:t}function Gh(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Gh(e),t!==null)return t;e=e.sibling}return null}function Bt(e,t,n,o,a,i){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,o,a,i)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&Bt(e.child,t,n,o,a,i))return!0;e=e.sibling}return!1}function Ta(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function ag(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return t}function Qh(e){var t=[null,null],n=Ta(e);return n===null||Zh(t,e,n.child,{foundSelf:!1}),t}function Zh(e,t,n,o){for(;n!==null;){if(n===t)o.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(o.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&Zh(e,t,n.child,o))return!0;n=n.sibling}return!1}function Fe(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(N(559))}}var ei=null,Fu=null;function qw(e,t,n){return e===n?!0:e===t?(ei=e,!0):!1}function Yw(e,t,n){return e===n?(Fu=e,!1):e===t?(Fu!==null&&(ei=e),!0):!1}function ig(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function Wu(e,t,n){for(var o=0,a=e;a;a=n(a))o++;a=0;for(var i=t;i;i=n(i))a++;for(;0<o-a;)e=n(e),o--;for(;0<a-o;)t=n(t),a--;for(;o--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var ke=Object.assign,Vw=Symbol.for("react.element"),Bl=Symbol.for("react.transitional.element"),hr=Symbol.for("react.portal"),ti=Symbol.for("react.fragment"),Ph=Symbol.for("react.strict_mode"),ed=Symbol.for("react.profiler"),$h=Symbol.for("react.consumer"),Dn=Symbol.for("react.context"),uf=Symbol.for("react.forward_ref"),td=Symbol.for("react.suspense"),nd=Symbol.for("react.suspense_list"),df=Symbol.for("react.memo"),So=Symbol.for("react.lazy"),od=Symbol.for("react.activity"),Kw=Symbol.for("react.legacy_hidden"),Xw=Symbol.for("react.memo_cache_sentinel"),ad=Symbol.for("react.view_transition"),Gw=Symbol.for("react.recoverable"),rg=Symbol.iterator;function ur(e){return e===null||typeof e!="object"?null:(e=rg&&e[rg]||e["@@iterator"],typeof e=="function"?e:null)}var Qw=Symbol.for("react.client.reference");function id(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Qw?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ti:return"Fragment";case ed:return"Profiler";case Ph:return"StrictMode";case td:return"Suspense";case nd:return"SuspenseList";case od:return"Activity";case ad:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case hr:return"Portal";case Dn:return e.displayName||"Context";case $h:return(e._context.displayName||"Context")+".Consumer";case uf:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case df:return t=e.displayName||null,t!==null?t:id(e.type)||"Memo";case So:t=e._payload,e=e._init;try{return id(e(t))}catch{}}return null}var br=Array.isArray,Q=Yh.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ge=Uw.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,fa={pending:!1,data:null,method:null,action:null},rd=[],ni=-1;function qn(e){return{current:e}}function ft(e){0>ni||(e.current=rd[ni],rd[ni]=null,ni--)}function Ne(e,t){ni++,rd[ni]=e.current,e.current=t}var Bn=qn(null),_r=qn(null),Ro=qn(null),Sc=qn(null);function Ec(e,t){switch(Ne(Ro,t),Ne(_r,e),Ne(Bn,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?xh(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=xh(t),e=b0(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}ft(Bn),Ne(Bn,e)}function ki(){ft(Bn),ft(_r),ft(Ro)}function ld(e){var t=e.memoizedState;t!==null&&(Ri._currentValue=t.memoizedState,Ne(Sc,e)),t=Bn.current;var n=b0(t,e.type);t!==n&&(Ne(_r,e),Ne(Bn,n))}function Tc(e){_r.current===e&&(ft(Bn),ft(_r)),Sc.current===e&&(ft(Sc),Ri._currentValue=fa)}var wu,lg;function wo(e){if(wu===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);wu=t&&t[1]||"",lg=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+wu+e+lg}var ku=!1;function Su(e,t){if(!e||ku)return"";ku=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(t){var h=function(){throw Error()};if(Object.defineProperty(h.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(h,[])}catch(x){var f=x}Reflect.construct(e,[],h)}else{try{h.call()}catch(x){f=x}h=!1;try{var p=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),h=!0,new e}finally{h&&(p!==void 0?Object.defineProperty(e.prototype,"props",p):delete e.prototype.props)}}}else{try{throw Error()}catch(x){f=x}(h=e())&&typeof h.catch=="function"&&h.catch(function(){})}}catch(x){if(x&&f&&typeof x.stack=="string")return[x.stack,f.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var i=o.DetermineComponentFrameRoot(),r=i[0],l=i[1];if(r&&l){var c=r.split(`
`),s=l.split(`
`);for(a=o=0;o<c.length&&!c[o].includes("DetermineComponentFrameRoot");)o++;for(;a<s.length&&!s[a].includes("DetermineComponentFrameRoot");)a++;if(o===c.length||a===s.length)for(o=c.length-1,a=s.length-1;1<=o&&0<=a&&c[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(c[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||c[o]!==s[a]){var g=`
`+c[o].replace(" at new "," at ");return e.displayName&&g.includes("<anonymous>")&&(g=g.replace("<anonymous>",e.displayName)),g}while(1<=o&&0<=a);break}}}finally{ku=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?wo(n):""}function Zw(e,t){switch(e.tag){case 26:case 27:case 5:return wo(e.type);case 16:return wo("Lazy");case 13:return e.child!==t&&t!==null?wo("Suspense Fallback"):wo("Suspense");case 19:return wo("SuspenseList");case 0:case 15:return Su(e.type,!1);case 11:return Su(e.type.render,!1);case 1:return Su(e.type,!0);case 31:return wo("Activity");case 30:return wo("ViewTransition");default:return""}}function cg(e){try{var t="",n=null;do t+=Zw(e,n),n=e,e=e.return;while(e);return t}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var cd=Object.prototype.hasOwnProperty,ff=We.unstable_scheduleCallback,Eu=We.unstable_cancelCallback,Pw=We.unstable_shouldYield,$w=We.unstable_requestPaint,Qt=We.unstable_now,Jw=We.unstable_getCurrentPriorityLevel,Jh=We.unstable_ImmediatePriority,Ih=We.unstable_UserBlockingPriority,Cc=We.unstable_NormalPriority,Iw=We.unstable_LowPriority,Fh=We.unstable_IdlePriority,Fw=We.log,Ww=We.unstable_setDisableYieldValue,Ir=null,Zt=null;function Co(e){if(typeof Fw=="function"&&Ww(e),Zt&&typeof Zt.setStrictMode=="function")try{Zt.setStrictMode(Ir,e)}catch{}}var Pt=Math.clz32?Math.clz32:nk,ek=Math.log,tk=Math.LN2;function nk(e){return e>>>=0,e===0?32:31-(ek(e)/tk|0)|0}var Ul=256,jl=262144,ql=4194304;function la(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Fc(e,t,n){var o=e.pendingLanes;if(o===0)return 0;var a=0,i=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var l=o&134217727;return l!==0?(o=l&~i,o!==0?a=la(o):(r&=l,r!==0?a=la(r):n||(n=l&~e,n!==0&&(a=la(n))))):(l=o&~i,l!==0?a=la(l):r!==0?a=la(r):n||(n=o&~e,n!==0&&(a=la(n)))),a===0?0:t!==0&&t!==a&&(t&i)===0&&(i=a&-a,n=t&-t,i>=n||i===32&&(n&4194048)!==0)?t:a}function Fr(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Wh(e,t){(t&8)!==0&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var o=31-Pt(n),a=1<<o;t|=e[o],n&=~a}return t}function ok(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function eb(){var e=ql;return ql<<=1,(ql&62914560)===0&&(ql=4194304),e}function Tu(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Wr(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ak(e,t,n,o,a,i){var r=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var l=e.entanglements,c=e.expirationTimes,s=e.hiddenUpdates;for(n=r&~n;0<n;){var g=31-Pt(n),h=1<<g;l[g]=0,c[g]=-1;var f=s[g];if(f!==null)for(s[g]=null,g=0;g<f.length;g++){var p=f[g];p!==null&&(p.lane&=-536870913)}n&=~h}o!==0&&tb(e,o,0),i!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=i&~(r&~t))}function tb(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var o=31-Pt(t);e.entangledLanes|=t,e.entanglements[o]=e.entanglements[o]|1073741824|n&261930}function nb(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-Pt(n),a=1<<o;a&t|e[o]&t&&(e[o]|=t),n&=~a}}function ob(e,t){var n=t&-t;return n=(n&42)!==0?1:pf(n),(n&(e.suspendedLanes|t))!==0?0:n}function pf(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function mf(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function ab(){var e=ge.p;return e!==0?e:(e=window.event,e===void 0?32:j0(e.type))}function sg(e,t){var n=ge.p;try{return ge.p=e,t()}finally{ge.p=n}}var co=Math.random().toString(36).slice(2),ut="__reactFiber$"+co,Ut="__reactProps$"+co,Hi="__reactContainer$"+co,ug="__reactEvents$"+co,ik="__reactListeners$"+co,rk="__reactHandles$"+co,dg="__reactResources$"+co,el="__reactMarker$"+co,Nc="__reactLoad$"+co;function Wc(e){delete e[ut],delete e[Ut],delete e[ik],delete e[rk]}function ua(e){var t;if(t=e[ut])return t;for(var n=e.parentNode;n;){if(t=n[Hi]||n[ut]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Mh(e);e!==null;){if(n=e[ut])return n;e=Mh(e)}return t}e=n,n=e.parentNode}return null}function Li(e){if(e=e[ut]||e[Hi]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function vr(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(N(33))}function fi(e){var t=e[dg];return t||(t=e[dg]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function at(e){e[el]=!0}function ib(e){e[Nc]=void 0}var rb=new Set,lb={};function Ca(e,t){Si(e,t),Si(e+"Capture",t)}function Si(e,t){for(lb[e]=t,e=0;e<t.length;e++)rb.add(t[e])}var lk=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),fg={},pg={};function ck(e){return cd.call(pg,e)?!0:cd.call(fg,e)?!1:lk.test(e)?pg[e]=!0:(fg[e]=!0,!1)}var fe=!1;function mg(){var e=fe;return fe=!1,e}function ac(e,t,n){if(ck(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var o=t.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,n)}}function Yl(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,n)}}function Jn(e,t,n,o){if(o===null)e.removeAttribute(n);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,o)}}function Vt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function cb(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function sk(e,t,n){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var a=o.get,i=o.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(r){n=""+r,i.call(this,r)}}),Object.defineProperty(e,t,{enumerable:o.enumerable}),{getValue:function(){return n},setValue:function(r){n=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function sd(e){if(!e._valueTracker){var t=cb(e)?"checked":"value";e._valueTracker=sk(e,t,""+e[t])}}function sb(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=cb(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}var uk=/[\n"\\]/g;function rn(e){return e.replace(uk,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function ud(e,t,n,o,a,i,r,l){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Vt(t)):e.value!==""+Vt(t)&&(e.value=""+Vt(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?r==="number"&&e.value==t?Cu(e,Vt(e.value)):Cu(e,Vt(t)):n!=null?Cu(e,Vt(n)):o!=null&&e.removeAttribute("value"),a==null&&i!=null&&(e.defaultChecked=!!i),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"?e.name=""+Vt(l):e.removeAttribute("name")}function ub(e,t,n,o,a,i,r,l){if(i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"&&(e.type=i),t!=null||n!=null){if(!(i!=="submit"&&i!=="reset"||t!=null)){sd(e);return}n=n!=null?""+Vt(n):"",t=t!=null?""+Vt(t):n,l||t===e.value||(e.value=t),e.defaultValue=t}o=o??a,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=l?e.checked:!!o,e.defaultChecked=!!o,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),sd(e)}function Cu(e,t){e.defaultValue!==""+t&&(e.defaultValue=""+t)}function pi(e,t,n,o){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&o&&(e[n].defaultSelected=!0)}else{for(n=""+Vt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function db(e,t,n){if(t!=null&&(t=""+Vt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Vt(n):""}function fb(e,t,n,o){if(t==null){if(o!=null){if(n!=null)throw Error(N(92));if(br(o)){if(1<o.length)throw Error(N(93));o=o[0]}n=o}n==null&&(n=""),t=n}n=Vt(t),e.defaultValue=n,o=e.textContent,o===n&&o!==""&&o!==null&&(e.value=o),sd(e)}function Ei(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var dk=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function gg(e,t,n){var o=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?o?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":o?e.setProperty(t,n):typeof n!="number"||n===0||dk.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function pb(e,t,n){if(t!=null&&typeof t!="object")throw Error(N(62));if(e=e.style,n!=null){for(var o in n)!n.hasOwnProperty(o)||t!=null&&t.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="",fe=!0);for(var a in t)o=t[a],t.hasOwnProperty(a)&&n[a]!==o&&(gg(e,a,o),fe=!0)}else for(var i in t)t.hasOwnProperty(i)&&gg(e,i,t[i])}function gf(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var fk=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),pk=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ic(e){return pk.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function _n(){}var dd=null;function hf(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var oi=null,mi=null;function hg(e){var t=Li(e);if(t&&(e=t.stateNode)){var n=e[Ut]||null;e:switch(e=t.stateNode,t.type){case"input":if(ud(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+rn(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=o[Ut]||null;if(!a)throw Error(N(90));ud(o,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)o=n[t],o.form===e.form&&sb(o)}break e;case"textarea":db(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&pi(e,!!n.multiple,t,!1)}}}var Nu=!1;function mb(e,t,n){if(Nu)return e(t,n);Nu=!0;try{var o=e(t);return o}finally{if(Nu=!1,(oi!==null||mi!==null)&&(ps(),oi&&(t=oi,e=mi,mi=oi=null,hg(t),e)))for(t=0;t<e.length;t++)hg(e[t])}}function Hr(e,t){var n=e.stateNode;if(n===null)return null;var o=n[Ut]||null;if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(N(231,t,typeof n));return n}var no=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),fd=!1;if(no)try{Pa={},Object.defineProperty(Pa,"passive",{get:function(){fd=!0}}),window.addEventListener("test",Pa,Pa),window.removeEventListener("test",Pa,Pa)}catch{fd=!1}var Pa,No=null,bf=null,rc=null;function gb(){if(rc)return rc;var e,t=bf,n=t.length,o,a="value"in No?No.value:No.textContent,i=a.length;for(e=0;e<n&&t[e]===a[e];e++);var r=n-e;for(o=1;o<=r&&t[n-o]===a[i-o];o++);return rc=a.slice(e,1<o?1-o:void 0)}function lc(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Vl(){return!0}function bg(){return!1}function At(e){function t(n,o,a,i,r){this._reactName=n,this._targetInst=a,this.type=o,this.nativeEvent=i,this.target=r,this.currentTarget=null;for(var l in e)e.hasOwnProperty(l)&&(n=e[l],this[l]=n?n(i):i[l]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?Vl:bg,this.isPropagationStopped=bg,this}return ke(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Vl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Vl)},persist:function(){},isPersistent:Vl}),t}var Zo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},es=At(Zo),tl=ke({},Zo,{view:0,detail:0}),mk=At(tl),Mu,Au,dr,ts=ke({},tl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:vf,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==dr&&(dr&&e.type==="mousemove"?(Mu=e.screenX-dr.screenX,Au=e.screenY-dr.screenY):Au=Mu=0,dr=e),Mu)},movementY:function(e){return"movementY"in e?e.movementY:Au}}),vg=At(ts),gk=ke({},ts,{dataTransfer:0}),hk=At(gk),bk=ke({},tl,{relatedTarget:0}),zu=At(bk),vk=ke({},Zo,{animationName:0,elapsedTime:0,pseudoElement:0}),yk=At(vk),xk=ke({},Zo,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),wk=At(xk),kk=ke({},Zo,{data:0}),yg=At(kk),Sk={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ek={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Tk={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ck(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Tk[e])?!!t[e]:!1}function vf(){return Ck}var Nk=ke({},tl,{key:function(e){if(e.key){var t=Sk[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=lc(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ek[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:vf,charCode:function(e){return e.type==="keypress"?lc(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?lc(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Mk=At(Nk),Ak=ke({},ts,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),xg=At(Ak),zk=ke({},Zo,{submitter:0}),Ok=At(zk),Rk=ke({},tl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:vf}),Dk=At(Rk),_k=ke({},Zo,{propertyName:0,elapsedTime:0,pseudoElement:0}),Hk=At(_k),Lk=ke({},ts,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Bk=At(Lk),Uk=ke({},Zo,{newState:0,oldState:0,source:0}),jk=At(Uk),qk=[9,13,27,32],yf=no&&"CompositionEvent"in window,wr=null;no&&"documentMode"in document&&(wr=document.documentMode);var Yk=no&&"TextEvent"in window&&!wr,hb=no&&(!yf||wr&&8<wr&&11>=wr),wg=" ",kg=!1;function bb(e,t){switch(e){case"keyup":return qk.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function vb(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var ai=!1;function Vk(e,t){switch(e){case"compositionend":return vb(t);case"keypress":return t.which!==32?null:(kg=!0,wg);case"textInput":return e=t.data,e===wg&&kg?null:e;default:return null}}function Kk(e,t){if(ai)return e==="compositionend"||!yf&&bb(e,t)?(e=gb(),rc=bf=No=null,ai=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return hb&&t.locale!=="ko"?null:t.data;default:return null}}var Xk={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Sg(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Xk[e.type]:t==="textarea"}function yb(e,t,n,o){oi?mi?mi.push(o):mi=[o]:oi=o,t=$c(t,"onChange"),0<t.length&&(n=new es("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var kr=null,Lr=null;function Gk(e){m0(e,0)}function ns(e){var t=vr(e);if(sb(t))return e}function Eg(e,t){if(e==="change")return t}var xb=!1;no&&(no?(Xl="oninput"in document,Xl||(Ou=document.createElement("div"),Ou.setAttribute("oninput","return;"),Xl=typeof Ou.oninput=="function"),Kl=Xl):Kl=!1,xb=Kl&&(!document.documentMode||9<document.documentMode));var Kl,Xl,Ou;function Tg(){kr&&(kr.detachEvent("onpropertychange",wb),Lr=kr=null)}function wb(e){if(e.propertyName==="value"&&ns(Lr)){var t=[];yb(t,Lr,e,hf(e)),mb(Gk,t)}}function Qk(e,t,n){e==="focusin"?(Tg(),kr=t,Lr=n,kr.attachEvent("onpropertychange",wb)):e==="focusout"&&Tg()}function Zk(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ns(Lr)}function Pk(e,t){if(e==="click")return ns(t)}function $k(e,t){if(e==="input"||e==="change")return ns(t)}function Jk(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Jt=typeof Object.is=="function"?Object.is:Jk;function Br(e,t){if(Jt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var a=n[o];if(!cd.call(t,a)||!Jt(e[a],t[a]))return!1}return!0}function pd(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Cg(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ng(e,t){var n=Cg(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Cg(n)}}function kb(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?kb(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Sb(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=pd(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=pd(e.document)}return t}function xf(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Ik=no&&"documentMode"in document&&11>=document.documentMode,ii=null,md=null,Sr=null,gd=!1;function Mg(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;gd||ii==null||ii!==pd(o)||(o=ii,"selectionStart"in o&&xf(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),Sr&&Br(Sr,o)||(Sr=o,o=$c(md,"onSelect"),0<o.length&&(t=new es("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=ii)))}function ia(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var ri={animationend:ia("Animation","AnimationEnd"),animationiteration:ia("Animation","AnimationIteration"),animationstart:ia("Animation","AnimationStart"),transitionrun:ia("Transition","TransitionRun"),transitionstart:ia("Transition","TransitionStart"),transitioncancel:ia("Transition","TransitionCancel"),transitionend:ia("Transition","TransitionEnd")},Ru={},Eb={};no&&(Eb=document.createElement("div").style,"AnimationEvent"in window||(delete ri.animationend.animation,delete ri.animationiteration.animation,delete ri.animationstart.animation),"TransitionEvent"in window||delete ri.transitionend.transition);function Na(e){if(Ru[e])return Ru[e];if(!ri[e])return e;var t=ri[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Eb)return Ru[e]=t[n];return e}var Tb=Na("animationend"),Cb=Na("animationiteration"),Nb=Na("animationstart"),Fk=Na("transitionrun"),Wk=Na("transitionstart"),eS=Na("transitioncancel"),Mb=Na("transitionend"),Ab=new Map,hd="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");hd.push("scrollEnd");function wn(e,t){Ab.set(e,t),Ca(t,[e])}var tS=0;function oo(e,t){if(e.name!=null&&e.name!=="auto")return e.name;if(t.autoName!==null)return t.autoName;e=xn.identifierPrefix;var n=tS++;return e="_"+e+"t_"+n.toString(32)+"_",t.autoName=e}function Ag(e){if(e==null||typeof e=="string")return e;var t=null,n=wi;if(n!==null)for(var o=0;o<n.length;o++){var a=e[n[o]];if(a!=null){if(a==="none")return"none";t=t==null?a:t+(" "+a)}}return t??e.default}function so(e,t){return e=Ag(e),t=Ag(t),t==null?e==="auto"?null:e:t==="auto"?null:t}var Mc=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},nn=[],li=0,wf=0;function os(){for(var e=li,t=wf=li=0;t<e;){var n=nn[t];nn[t++]=null;var o=nn[t];nn[t++]=null;var a=nn[t];nn[t++]=null;var i=nn[t];if(nn[t++]=null,o!==null&&a!==null){var r=o.pending;r===null?a.next=a:(a.next=r.next,r.next=a),o.pending=a}i!==0&&zb(n,a,i)}}function as(e,t,n,o){nn[li++]=e,nn[li++]=t,nn[li++]=n,nn[li++]=o,wf|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function kf(e,t,n,o){return as(e,t,n,o),Ac(e)}function Ma(e,t){return as(e,null,null,t),Ac(e)}function zb(e,t,n){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n);for(var a=!1,i=e.return;i!==null;)i.childLanes|=n,o=i.alternate,o!==null&&(o.childLanes|=n),i.tag===22&&(e=i.stateNode,e===null||e._visibility&1||(a=!0)),e=i,i=i.return;return e.tag===3?(i=e.stateNode,a&&t!==null&&(a=31-Pt(n),e=i.hiddenUpdates,o=e[a],o===null?e[a]=[t]:o.push(t),t.lane=n|536870912),i):null}function Ac(e){if(50<Dr)throw Dr=0,bc=null,Error(N(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ci={};function nS(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ht(e,t,n,o){return new nS(e,t,n,o)}function Sf(e){return e=e.prototype,!(!e||!e.isReactComponent)}function eo(e,t){var n=e.alternate;return n===null?(n=Ht(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Ob(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function cc(e,t,n,o,a,i){var r=0;if(o=e,typeof o=="function")Sf(o)&&(r=1);else if(typeof o=="string")r=ME(e,n,Bn.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(o){case od:return e=Ht(31,n,t,a),e.elementType=od,e.lanes=i,e;case ti:return pa(n.children,a,i,t);case Ph:r=8,a|=24;break;case ed:return e=Ht(12,n,t,a|2),e.elementType=ed,e.lanes=i,e;case td:return e=Ht(13,n,t,a),e.elementType=td,e.lanes=i,e;case nd:return e=Ht(19,n,t,a),e.elementType=nd,e.lanes=i,e;case Kw:case ad:return e=a|32,e=Ht(30,n,t,e),e.elementType=ad,e.lanes=i,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case Dn:r=10;break e;case $h:r=9;break e;case uf:r=11;break e;case df:r=14;break e;case So:r=16,o=null;break e}r=29,n=Error(N(130,e===null?"null":typeof e,"")),o=null}return t=Ht(r,n,t,a),t.elementType=e,t.type=o,t.lanes=i,t}function pa(e,t,n,o){return e=Ht(7,e,o,t),e.lanes=n,e}function Du(e,t,n){return e=Ht(6,e,null,t),e.lanes=n,e}function Rb(e){var t=Ht(18,null,null,0);return t.stateNode=e,t}function _u(e,t,n){return t=Ht(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var zg=new WeakMap;function ln(e,t){if(typeof e=="object"&&e!==null){var n=zg.get(e);return n!==void 0?n:(t={value:e,source:t,stack:cg(t)},zg.set(e,t),t)}return{value:e,source:t,stack:cg(t)}}var si=[],ui=0,zc=null,Ur=0,on=[],an=0,Vo=null,Hn=1,Ln="";function Fn(e,t){si[ui++]=Ur,si[ui++]=zc,zc=e,Ur=t}function Db(e,t,n){on[an++]=Hn,on[an++]=Ln,on[an++]=Vo,Vo=e;var o=Hn;e=Ln;var a=32-Pt(o)-1;o&=~(1<<a),n+=1;var i=32-Pt(t)+a;if(30<i){var r=a-a%5;i=(o&(1<<r)-1).toString(32),o>>=r,a-=r,Hn=1<<32-Pt(t)+a|n<<a|o,Ln=i+e}else Hn=1<<i|n<<a|o,Ln=e}function is(e){e.return!==null&&(Fn(e,1),Db(e,1,0))}function Ef(e){for(;e===zc;)zc=si[--ui],si[ui]=null,Ur=si[--ui],si[ui]=null;for(;e===Vo;)Vo=on[--an],on[an]=null,Ln=on[--an],on[an]=null,Hn=on[--an],on[an]=null}function _b(e,t){on[an++]=Hn,on[an++]=Ln,on[an++]=Vo,Hn=t.id,Ln=t.overflow,Vo=e}var it=null,Ce=null,W=!1,Do=null,cn=!1,bd=Error(N(519));function Ko(e){var t=Error(N(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw jr(ln(t,e)),bd}function Og(e){var t=e.stateNode,n=e.type,o=e.memoizedProps;switch(t[ut]=e,t[Ut]=o,n){case"dialog":ae("cancel",t),ae("close",t);break;case"iframe":case"object":case"embed":ae("load",t);break;case"video":case"audio":for(n=0;n<Kr.length;n++)ae(Kr[n],t);break;case"source":ae("error",t);break;case"img":case"image":case"link":ae("error",t),ae("load",t);break;case"details":ae("toggle",t);break;case"input":ae("invalid",t),ub(t,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":ae("invalid",t);break;case"textarea":ae("invalid",t),fb(t,o.value,o.defaultValue,o.children)}n=o.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||o.suppressHydrationWarning===!0||h0(t.textContent,n)?(o.popover!=null&&(ae("beforetoggle",t),ae("toggle",t)),o.onScroll!=null&&ae("scroll",t),o.onScrollEnd!=null&&ae("scrollend",t),o.onClick!=null&&(t.onclick=_n),t=!0):t=!1,t||Ko(e,!0)}function Oc(e){for(it=e.return;it;)switch(it.tag){case 5:case 31:case 13:cn=!1;return;case 27:case 3:cn=!0;return;default:it=it.return}}function $a(e){if(e!==it)return!1;if(!W)return Oc(e),W=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||tf(e.type,e.memoizedProps)),n=!n),n&&Ce&&Ko(e),Oc(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(N(317));Ce=Nh(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(N(317));Ce=Nh(e)}else t===27?(t=Ce,Po(e.type)?(e=rf,rf=null,Ce=e):Ce=t):Ce=it?sn(e.stateNode.nextSibling):null;return!0}function ba(){Ce=it=null,W=!1}function Hu(){var e=Do;return e!==null&&(Dt===null?Dt=e:Dt.push.apply(Dt,e),Do=null),e}function jr(e){Do===null?Do=[e]:Do.push(e)}var vd=qn(null),Aa=null,Wn=null;function Mo(e,t,n){Ne(vd,t._currentValue),t._currentValue=n}function to(e){e._currentValue=vd.current,ft(vd)}function sc(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function yd(e,t,n,o){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var i=a.dependencies;if(i!==null){var r=a.child;i=i.firstContext;e:for(;i!==null;){var l=i;i=a;for(var c=0;c<t.length;c++)if(l.context===t[c]){i.lanes|=n,l=i.alternate,l!==null&&(l.lanes|=n),sc(i.return,n,e),o||(r=null);break e}i=l.next}}else if(a.tag===18){if(r=a.return,r===null)throw Error(N(341));r.lanes|=n,i=r.alternate,i!==null&&(i.lanes|=n),sc(r,n,e),r=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,r=a.alternate,r!==null&&(r.lanes|=n),sc(a.return,n,e),r=a.child,r=r!==null?r.sibling:null):r=a.child;if(r!==null)r.return=a;else for(r=a;r!==null;){if(r===e){r=null;break}if(a=r.sibling,a!==null){a.return=r.return,r=a;break}r=r.return}a=r}}function va(e,t,n,o){e=null;for(var a=t,i=!1;a!==null;){if(!i){if((a.flags&524288)!==0)i=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var r=a.alternate;if(r===null)throw Error(N(387));if(r=r.memoizedProps,r!==null){var l=a.type;Jt(a.pendingProps.value,r.value)||(e!==null?e.push(l):e=[l])}}else if(a===Sc.current){if(r=a.alternate,r===null)throw Error(N(387));r.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(Ri):e=[Ri])}a=a.return}return e!==null&&yd(t,e,n,o),t.flags|=262144,e!==null}function Rc(e){for(e=e.firstContext;e!==null;){if(!Jt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ya(e){Aa=e,Wn=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function dt(e){return Hb(Aa,e)}function Gl(e,t){return Aa===null&&ya(e),Hb(e,t)}function Hb(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Wn===null){if(e===null)throw Error(N(308));Wn=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Wn=Wn.next=t;return n}var oS=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,o){e.push(o)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},aS=We.unstable_scheduleCallback,iS=We.unstable_NormalPriority,Ze={$$typeof:Dn,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Tf(){return{controller:new oS,data:new Map,refCount:0}}function nl(e){e.refCount--,e.refCount===0&&aS(iS,function(){e.controller.abort()})}function Rg(e,t){if((e.pendingLanes&4194048)!==0){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var o=t[e];n.indexOf(o)===-1&&n.push(o)}}}var yr=null;function rS(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var Er=null,xd=0,xa=0,gi=null;function lS(e,t){if(Er===null){var n=Er=[];xd=0,xa=Wf(),gi={status:"pending",value:void 0,then:function(o){n.push(o)}}}return xd++,t.then(Dg,Dg),t}function Dg(){if(--xd===0&&(yr=null,Er!==null)){gi!==null&&(gi.status="fulfilled");var e=Er;Er=null,xa=0,gi=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function cS(e,t){var n=[],o={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){o.status="fulfilled",o.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(o.status="rejected",o.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),o}var _g=Q.S;Q.S=function(e,t){if(Wv=Qt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&lS(e,t),yr!==null)for(var n=Ai;n!==null;)Rg(n,yr),n=n.next;if(n=e.types,n!==null){for(var o=Ai;o!==null;)Rg(o,n),o=o.next;if(xa!==0){o=yr,o===null&&(o=yr=[]);for(var a=0;a<n.length;a++){var i=n[a];o.indexOf(i)===-1&&o.push(i)}}}_g!==null&&_g(e,t)};var ma=qn(null);function Cf(){var e=ma.current;return e!==null?e:we.pooledCache}function uc(e,t){t===null?Ne(ma,ma.current):Ne(ma,t.pool)}function Lb(){var e=Cf();return e===null?null:{parent:Ze._currentValue,pool:e}}var Bi=Error(N(460)),Nf=Error(N(474)),rs=Error(N(542)),Dc={then:function(){}};function Hg(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Bb(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(_n,_n),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Bg(e),e===void 0&&!("reason"in t)?Error(N(600)):e;default:if(typeof t.status=="string")t.then(_n,_n);else{if(e=we,e!==null&&100<e.shellSuspendCounter)throw Error(N(482));e=t,e.status="pending",e.then(function(o){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=o}},function(o){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=o}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Bg(e),e}throw ga=t,Bi}}function ca(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(ga=n,Bi):n}}var ga=null;function Lg(){if(ga===null)throw Error(N(459));var e=ga;return ga=null,e}function Bg(e){if(e===Bi||e===rs)throw Error(N(483))}var hi=null,qr=0;function Ql(e){var t=qr;return qr+=1,hi===null&&(hi=[]),Bb(hi,e,t)}function xo(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Zl(e,t){throw t.$$typeof===Vw?Error(N(525)):(e=Object.prototype.toString.call(t),Error(N(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Ub(e){function t(m,u){if(e){var d=m.deletions;d===null?(m.deletions=[u],m.flags|=16):d.push(u)}}function n(m,u){if(!e)return null;for(;u!==null;)t(m,u),u=u.sibling;return null}function o(m){for(var u=new Map;m!==null;)m.key===null?u.set(m.index,m):u.set(m.key,m),m=m.sibling;return u}function a(m,u){return m=eo(m,u),m.index=0,m.sibling=null,m}function i(m,u,d){return m.index=d,e?(d=m.alternate,d!==null?(d=d.index,d<u?(m.flags|=2,u):d):(m.flags|=134217730,u)):(m.flags|=1048576,u)}function r(m){return e&&m.alternate===null&&(m.flags|=134217730),m}function l(m,u,d,b){return u===null||u.tag!==6?(u=Du(d,m.mode,b),u.return=m,u):(u=a(u,d),u.return=m,u)}function c(m,u,d,b){var v=d.type;return v===ti?(m=g(m,u,d.props.children,b,d.key),xo(m,d),m):u!==null&&(u.elementType===v||typeof v=="object"&&v!==null&&v.$$typeof===So&&ca(v)===u.type)?(u=a(u,d.props),xo(u,d),u.return=m,u):(u=cc(d.type,d.key,d.props,null,m.mode,b),xo(u,d),u.return=m,u)}function s(m,u,d,b){return u===null||u.tag!==4||u.stateNode.containerInfo!==d.containerInfo||u.stateNode.implementation!==d.implementation?(u=_u(d,m.mode,b),u.return=m,u):(u=a(u,d.children||[]),u.return=m,u)}function g(m,u,d,b,v){return u===null||u.tag!==7?(u=pa(d,m.mode,b,v),u.return=m,u):(u=a(u,d),u.return=m,u)}function h(m,u,d){if(typeof u=="string"&&u!==""||typeof u=="number"||typeof u=="bigint")return u=Du(""+u,m.mode,d),u.return=m,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Bl:return d=cc(u.type,u.key,u.props,null,m.mode,d),xo(d,u),d.return=m,d;case hr:return u=_u(u,m.mode,d),u.return=m,u;case So:return u=ca(u),h(m,u,d)}if(br(u)||ur(u))return u=pa(u,m.mode,d,null),u.return=m,u;if(typeof u.then=="function")return h(m,Ql(u),d);if(u.$$typeof===Dn)return h(m,Gl(m,u),d);Zl(m,u)}return null}function f(m,u,d,b){var v=u!==null?u.key:null;if(typeof d=="string"&&d!==""||typeof d=="number"||typeof d=="bigint")return v!==null?null:l(m,u,""+d,b);if(typeof d=="object"&&d!==null){switch(d.$$typeof){case Bl:return d.key===v?c(m,u,d,b):null;case hr:return d.key===v?s(m,u,d,b):null;case So:return d=ca(d),f(m,u,d,b)}if(br(d)||ur(d))return v!==null?null:g(m,u,d,b,null);if(typeof d.then=="function")return f(m,u,Ql(d),b);if(d.$$typeof===Dn)return f(m,u,Gl(m,d),b);Zl(m,d)}return null}function p(m,u,d,b,v){if(typeof b=="string"&&b!==""||typeof b=="number"||typeof b=="bigint")return m=m.get(d)||null,l(u,m,""+b,v);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case Bl:return m=m.get(b.key===null?d:b.key)||null,c(u,m,b,v);case hr:return m=m.get(b.key===null?d:b.key)||null,s(u,m,b,v);case So:return b=ca(b),p(m,u,d,b,v)}if(br(b)||ur(b))return m=m.get(d)||null,g(u,m,b,v,null);if(typeof b.then=="function")return p(m,u,d,Ql(b),v);if(b.$$typeof===Dn)return p(m,u,d,Gl(u,b),v);Zl(u,b)}return null}function x(m,u,d,b){for(var v=null,E=null,k=u,S=u=0,M=null;k!==null&&S<d.length;S++){k.index>S?(M=k,k=null):M=k.sibling;var A=f(m,k,d[S],b);if(A===null){k===null&&(k=M);break}e&&k&&A.alternate===null&&t(m,k),u=i(A,u,S),E===null?v=A:E.sibling=A,E=A,k=M}if(S===d.length)return n(m,k),W&&Fn(m,S),v;if(k===null){for(;S<d.length;S++)k=h(m,d[S],b),k!==null&&(u=i(k,u,S),E===null?v=k:E.sibling=k,E=k);return W&&Fn(m,S),v}for(k=o(k);S<d.length;S++)M=p(k,m,S,d[S],b),M!==null&&(e&&(A=M.alternate,A!==null&&k.delete(A.key===null?S:A.key)),u=i(M,u,S),E===null?v=M:E.sibling=M,E=M);return e&&k.forEach(function(D){return t(m,D)}),W&&Fn(m,S),v}function w(m,u,d,b){if(d==null)throw Error(N(151));for(var v=null,E=null,k=u,S=u=0,M=null,A=d.next();k!==null&&!A.done;S++,A=d.next()){k.index>S?(M=k,k=null):M=k.sibling;var D=f(m,k,A.value,b);if(D===null){k===null&&(k=M);break}e&&k&&D.alternate===null&&t(m,k),u=i(D,u,S),E===null?v=D:E.sibling=D,E=D,k=M}if(A.done)return n(m,k),W&&Fn(m,S),v;if(k===null){for(;!A.done;S++,A=d.next())A=h(m,A.value,b),A!==null&&(u=i(A,u,S),E===null?v=A:E.sibling=A,E=A);return W&&Fn(m,S),v}for(k=o(k);!A.done;S++,A=d.next())A=p(k,m,S,A.value,b),A!==null&&(e&&(M=A.alternate,M!==null&&k.delete(M.key===null?S:M.key)),u=i(A,u,S),E===null?v=A:E.sibling=A,E=A);return e&&k.forEach(function(H){return t(m,H)}),W&&Fn(m,S),v}function T(m,u,d,b){if(typeof d=="object"&&d!==null&&d.type===ti&&d.key===null&&d.props.ref===void 0&&(d=d.props.children),typeof d=="object"&&d!==null){switch(d.$$typeof){case Bl:e:{for(var v=d.key;u!==null;){if(u.key===v){if(v=d.type,v===ti){if(u.tag===7){n(m,u.sibling),b=a(u,d.props.children),xo(b,d),b.return=m,m=b;break e}}else if(u.elementType===v||typeof v=="object"&&v!==null&&v.$$typeof===So&&ca(v)===u.type){n(m,u.sibling),b=a(u,d.props),xo(b,d),b.return=m,m=b;break e}n(m,u);break}else t(m,u);u=u.sibling}d.type===ti?(b=pa(d.props.children,m.mode,b,d.key),xo(b,d),b.return=m,m=b):(b=cc(d.type,d.key,d.props,null,m.mode,b),xo(b,d),b.return=m,m=b)}return r(m);case hr:e:{for(v=d.key;u!==null;){if(u.key===v)if(u.tag===4&&u.stateNode.containerInfo===d.containerInfo&&u.stateNode.implementation===d.implementation){n(m,u.sibling),b=a(u,d.children||[]),b.return=m,m=b;break e}else{n(m,u);break}else t(m,u);u=u.sibling}b=_u(d,m.mode,b),b.return=m,m=b}return r(m);case So:return d=ca(d),T(m,u,d,b)}if(br(d))return x(m,u,d,b);if(ur(d)){if(v=ur(d),typeof v!="function")throw Error(N(150));return d=v.call(d),w(m,u,d,b)}if(typeof d.then=="function")return T(m,u,Ql(d),b);if(d.$$typeof===Dn)return T(m,u,Gl(m,d),b);Zl(m,d)}return typeof d=="string"&&d!==""||typeof d=="number"||typeof d=="bigint"?(d=""+d,u!==null&&u.tag===6?(n(m,u.sibling),b=a(u,d),b.return=m,m=b):(n(m,u),b=Du(d,m.mode,b),b.return=m,m=b),r(m)):n(m,u)}return function(m,u,d,b){try{qr=0;var v=T(m,u,d,b);return hi=null,v}catch(k){if(k===Bi||k===rs)throw k;var E=Ht(29,k,null,m.mode);return E.lanes=b,E.return=m,E}}}var wa=Ub(!0),jb=Ub(!1),Eo=!1;function Mf(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function wd(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function _o(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ho(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(me&2)!==0){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,t=Ac(e),zb(e,null,n),t}return as(e,o,t,n),Ac(e)}function Tr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,nb(e,n)}}function Lu(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var a=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var r={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};i===null?a=i=r:i=i.next=r,n=n.next}while(n!==null);i===null?a=i=t:i=i.next=t}else a=i=t;n={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:i,shared:o.shared,callbacks:o.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var kd=!1;function Cr(){if(kd){var e=gi;if(e!==null)throw e}}function Nr(e,t,n,o){kd=!1;var a=e.updateQueue;Eo=!1;var i=a.firstBaseUpdate,r=a.lastBaseUpdate,l=a.shared.pending;if(l!==null){a.shared.pending=null;var c=l,s=c.next;c.next=null,r===null?i=s:r.next=s,r=c;var g=e.alternate;g!==null&&(g=g.updateQueue,l=g.lastBaseUpdate,l!==r&&(l===null?g.firstBaseUpdate=s:l.next=s,g.lastBaseUpdate=c))}if(i!==null){var h=a.baseState;r=0,g=s=c=null,l=i;do{var f=l.lane&-536870913,p=f!==l.lane;if(p?(le&f)===f:(o&f)===f){f!==0&&f===xa&&(kd=!0),g!==null&&(g=g.next={lane:0,tag:l.tag,payload:l.payload,callback:null,next:null});e:{var x=e,w=l;f=t;var T=n;switch(w.tag){case 1:if(x=w.payload,typeof x=="function"){h=x.call(T,h,f);break e}h=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=w.payload,f=typeof x=="function"?x.call(T,h,f):x,f==null)break e;h=ke({},h,f);break e;case 2:Eo=!0}}f=l.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=a.callbacks,p===null?a.callbacks=[f]:p.push(f))}else p={lane:f,tag:l.tag,payload:l.payload,callback:l.callback,next:null},g===null?(s=g=p,c=h):g=g.next=p,r|=f;if(l=l.next,l===null){if(l=a.shared.pending,l===null)break;p=l,l=p.next,p.next=null,a.lastBaseUpdate=p,a.shared.pending=null}}while(!0);g===null&&(c=h),a.baseState=c,a.firstBaseUpdate=s,a.lastBaseUpdate=g,i===null&&(a.shared.lanes=0),Qo|=r,e.lanes=r,e.memoizedState=h}}function qb(e,t){if(typeof e!="function")throw Error(N(191,e));e.call(t)}function Yb(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)qb(n[e],t)}var Xo=qn(null),_c=qn(0);function Ug(e,t){e=lo,Ne(_c,e),Ne(Xo,t),lo=e|t.baseLanes}function Sd(){Ne(_c,lo),Ne(Xo,Xo.current)}function Af(){lo=_c.current,ft(Xo),ft(_c)}var gt=qn(null),wt=null;function Lo(e){var t=e.alternate;Ne(pt,pt.current&1),Ne(gt,e),wt===null&&(t===null||Xo.current!==null||t.memoizedState!==null)&&(wt=e)}function Ed(e){Ne(pt,pt.current),Ne(gt,e),wt===null&&(wt=e)}function Vb(e){e.tag===22?(Ne(pt,pt.current),Ne(gt,e),wt===null&&(wt=e)):Bo()}function Bo(){Ne(pt,pt.current),Ne(gt,gt.current)}function Kt(e){ft(gt),wt===e&&(wt=null),ft(pt)}var pt=qn(0);function Yr(e,t){Ne(gt,gt.current),Ne(pt,t)}function zf(e){ft(pt),ft(gt),wt===e&&(wt=null)}function Hc(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||op(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!=="independent"){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ao=0,J=null,xe=null,Qe=null,Lc=!1,bi=!1,ka=!1,Bc=0,Vr=0,vi=null,sS=0;function qe(){throw Error(N(321))}function Of(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Jt(e[n],t[n]))return!1;return!0}function Rf(e,t,n,o,a,i){return ao=i,J=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Q.H=e===null||e.memoizedState===null?yv:xv,ka=!1,i=n(o,a),ka=!1,bi&&(i=Xb(t,n,o,a)),Kb(e),i}function Kb(e){Q.H=Uc;var t=xe!==null&&xe.next!==null;if(ao=0,Qe=xe=J=null,Lc=!1,Vr=0,vi=null,t)throw Error(N(300));e===null||Pe||(e=e.dependencies,e!==null&&Rc(e)&&(Pe=!0))}function Xb(e,t,n,o){J=e;var a=0;do{if(bi&&(vi=null),Vr=0,bi=!1,25<=a)throw Error(N(301));if(a+=1,Qe=xe=null,e.updateQueue!=null){var i=e.updateQueue;i.lastEffect=null,i.events=null,i.stores=null,i.memoCache!=null&&(i.memoCache.index=0)}Q.H=bS,i=t(n,o)}while(bi);return i}function uS(){var e=Q.H,t=e.useState()[0];return t=typeof t.then=="function"?ol(t):t,e=e.useState()[0],(xe!==null?xe.memoizedState:null)!==e&&(J.flags|=1024),t}function Df(){var e=Bc!==0;return Bc=0,e}function _f(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Hf(e){if(Lc){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Lc=!1}ao=0,Qe=xe=J=null,bi=!1,Vr=Bc=0,vi=null}function Mt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qe===null?J.memoizedState=Qe=e:Qe=Qe.next=e,Qe}function Ke(){if(xe===null){var e=J.alternate;e=e!==null?e.memoizedState:null}else e=xe.next;var t=Qe===null?J.memoizedState:Qe.next;if(t!==null)Qe=t,xe=e;else{if(e===null)throw J.alternate===null?Error(N(467)):Error(N(310));xe=e,e={memoizedState:xe.memoizedState,baseState:xe.baseState,baseQueue:xe.baseQueue,queue:xe.queue,next:null},Qe===null?J.memoizedState=Qe=e:Qe=Qe.next=e}return Qe}function ls(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ol(e){var t=Vr;return Vr+=1,vi===null&&(vi=[]),e=Bb(vi,e,t),t=J,(Qe===null?t.memoizedState:Qe.next)===null&&(t=t.alternate,Q.H=t===null||t.memoizedState===null?yv:xv),e}function cs(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return ol(e);if(e.$$typeof===Gw)return;if(e.$$typeof===Dn)return dt(e)}throw Error(N(438,String(e)))}function Lf(e){var t=null,n=J.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var o=J.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(t={data:o.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=ls(),J.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),o=0;o<e;o++)n[o]=Xw;return t.index++,n}function io(e,t){return typeof t=="function"?t(e):t}function dc(e){var t=Ke();return Bf(t,xe,e)}function Bf(e,t,n){var o=e.queue;if(o===null)throw Error(N(311));o.lastRenderedReducer=n;var a=e.baseQueue,i=o.pending;if(i!==null){if(a!==null){var r=a.next;a.next=i.next,i.next=r}t.baseQueue=a=i,o.pending=null}if(i=e.baseState,a===null)e.memoizedState=i;else{t=a.next;var l=r=null,c=null,s=t,g=!1;do{var h=s.lane&-536870913;if(h!==s.lane?(le&h)===h:(ao&h)===h){var f=s.revertLane;if(f===0)c!==null&&(c=c.next={lane:0,revertLane:0,gesture:null,action:s.action,hasEagerState:s.hasEagerState,eagerState:s.eagerState,next:null}),h===xa&&(g=!0);else if((ao&f)===f){s=s.next,f===xa&&(g=!0);continue}else h={lane:0,revertLane:s.revertLane,gesture:null,action:s.action,hasEagerState:s.hasEagerState,eagerState:s.eagerState,next:null},c===null?(l=c=h,r=i):c=c.next=h,J.lanes|=f,Qo|=f;h=s.action,ka&&n(i,h),i=s.hasEagerState?s.eagerState:n(i,h)}else f={lane:h,revertLane:s.revertLane,gesture:s.gesture,action:s.action,hasEagerState:s.hasEagerState,eagerState:s.eagerState,next:null},c===null?(l=c=f,r=i):c=c.next=f,J.lanes|=h,Qo|=h;s=s.next}while(s!==null&&s!==t);if(c===null?r=i:c.next=l,!Jt(i,e.memoizedState)&&(Pe=!0,g&&(n=gi,n!==null)))throw n;e.memoizedState=i,e.baseState=r,e.baseQueue=c,o.lastRenderedState=i}return a===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function Bu(e){var t=Ke(),n=t.queue;if(n===null)throw Error(N(311));n.lastRenderedReducer=e;var o=n.dispatch,a=n.pending,i=t.memoizedState;if(a!==null){n.pending=null;var r=a=a.next;do i=e(i,r.action),r=r.next;while(r!==a);Jt(i,t.memoizedState)||(Pe=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,o]}function Gb(e,t,n){var o=J,a=Ke(),i=W;if(i){if(n===void 0)throw Error(N(407));n=n()}else n=t();var r=!Jt((xe||a).memoizedState,n);if(r&&(a.memoizedState=n,Pe=!0),a=a.queue,Uf(Pb.bind(null,o,a,e),[e]),e=a.getSnapshot!==t||r||Qe!==null&&(Qe.memoizedState.tag&1)!==0,Ti(e?9:8,{destroy:void 0},Zb.bind(null,o,a,n,t),null),e){if(o.flags|=2048,we===null)throw Error(N(349));i||(ao&127)!==0||Qb(o,t,n)}return n}function Qb(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=J.updateQueue,t===null?(t=ls(),J.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Zb(e,t,n,o){t.value=n,t.getSnapshot=o,$b(t)&&Jb(e)}function Pb(e,t,n){return n(function(){$b(t)&&Jb(e)})}function $b(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Jt(e,n)}catch{return!0}}function Jb(e){var t=Ma(e,2);t!==null&&Lt(t,e,2)}function Td(e){var t=Mt();if(typeof e=="function"){var n=e;if(e=n(),ka){Co(!0);try{n()}finally{Co(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:io,lastRenderedState:e},t}function Ib(e,t,n,o){return e.baseState=n,Bf(e,xe,typeof o=="function"?o:io)}function dS(e,t,n,o,a){if(us(e))throw Error(N(485));if(e=t.action,e!==null){var i={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){i.listeners.push(r)}};Q.T!==null?n(!0):i.isTransition=!1,o(i),n=t.pending,n===null?(i.next=t.pending=i,Fb(t,i)):(i.next=n.next,t.pending=n.next=i)}}function Fb(e,t){var n=t.action,o=t.payload,a=e.state;if(t.isTransition){var i=Q.T,r={};r.types=i!==null?i.types:null,Q.T=r;try{var l=n(a,o),c=Q.S;c!==null&&c(r,l),jg(e,t,l)}catch(s){Cd(e,t,s)}finally{i!==null&&r.types!==null&&(i.types=r.types),Q.T=i}}else try{i=n(a,o),jg(e,t,i)}catch(s){Cd(e,t,s)}}function jg(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(o){qg(e,t,o)},function(o){return Cd(e,t,o)}):qg(e,t,n)}function qg(e,t,n){t.status="fulfilled",t.value=n,Wb(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Fb(e,n)))}function Cd(e,t,n){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do t.status="rejected",t.reason=n,Wb(t),t=t.next;while(t!==o)}e.action=null}function Wb(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function ev(e,t){return t}function Yg(e,t){if(W){var n=we.formState;if(n!==null){e:{var o=J;if(W){if(Ce){t:{for(var a=Ce,i=cn;a.nodeType!==8;){if(!i){a=null;break t}if(a=sn(a.nextSibling),a===null){a=null;break t}}i=a.data,a=i==="F!"||i==="F"?a:null}if(a){Ce=sn(a.nextSibling),o=a.data==="F!";break e}}Ko(o)}o=!1}o&&(t=n[0])}}return n=Mt(),n.memoizedState=n.baseState=t,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ev,lastRenderedState:t},n.queue=o,n=hv.bind(null,J,o),o.dispatch=n,o=Td(!1),i=Vf.bind(null,J,!1,o.queue),o=Mt(),a={state:t,dispatch:null,action:e,pending:null},o.queue=a,n=dS.bind(null,J,a,i,n),a.dispatch=n,o.memoizedState=e,[t,n,!1]}function Vg(e){var t=Ke();return tv(t,xe,e)}function tv(e,t,n){if(t=Bf(e,t,ev)[0],e=dc(io)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var o=ol(t)}catch(r){throw r===Bi?rs:r}else o=t;t=Ke();var a=t.queue,i=a.dispatch;return n!==t.memoizedState&&(J.flags|=2048,Ti(9,{destroy:void 0},fS.bind(null,a,n),null)),[o,i,e]}function fS(e,t){e.action=t}function Kg(e){var t=Ke(),n=xe;if(n!==null)return tv(t,n,e);Ke(),t=t.memoizedState,n=Ke();var o=n.queue.dispatch;return n.memoizedState=e,[t,o,!1]}function Ti(e,t,n,o){return e={tag:e,create:n,deps:o,inst:t,next:null},t=J.updateQueue,t===null&&(t=ls(),J.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e),e}function nv(){return Ke().memoizedState}function fc(e,t,n,o){var a=Mt();J.flags|=e,a.memoizedState=Ti(1|t,{destroy:void 0},n,o===void 0?null:o)}function ss(e,t,n,o){var a=Ke();o=o===void 0?null:o;var i=a.memoizedState.inst;xe!==null&&o!==null&&Of(o,xe.memoizedState.deps)?a.memoizedState=Ti(t,i,n,o):(J.flags|=e,a.memoizedState=Ti(1|t,i,n,o))}function Xg(e,t){fc(8390656,8,e,t)}function Uf(e,t){ss(2048,8,e,t)}function pS(e){J.flags|=4;var t=J.updateQueue;if(t===null)t=ls(),J.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function ov(e){var t=Ke().memoizedState;return pS({ref:t,nextImpl:e}),function(){if((me&2)!==0)throw Error(N(440));return t.impl.apply(void 0,arguments)}}function av(e,t){return ss(4,2,e,t)}function iv(e,t){return ss(4,4,e,t)}function rv(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function lv(e,t,n){n=n!=null?n.concat([e]):null,ss(4,4,rv.bind(null,t,e),n)}function jf(){}function cv(e,t){var n=Ke();t=t===void 0?null:t;var o=n.memoizedState;return t!==null&&Of(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function sv(e,t){var n=Ke();t=t===void 0?null:t;var o=n.memoizedState;if(t!==null&&Of(t,o[1]))return o[0];if(o=e(),ka){Co(!0);try{e()}finally{Co(!1)}}return n.memoizedState=[o,t],o}function qf(e,t,n){return n===void 0||(ao&1073741824)!==0&&(le&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=t0(),J.lanes|=e,Qo|=e,n)}function uv(e,t,n,o){return Jt(n,t)?n:Xo.current!==null?(e=qf(e,n,o),Jt(e,t)||(Pe=!0),e):(ao&106)===0||(ao&1073741824)!==0&&(le&261930)===0?(Pe=!0,e.memoizedState=n):(e=t0(),J.lanes|=e,Qo|=e,t)}function dv(e,t,n,o,a){var i=ge.p;ge.p=i!==0&&8>i?i:8;var r=Q.T,l={};l.types=r!==null?r.types:null,Q.T=l,Vf(e,!1,t,n);try{var c=a(),s=Q.S;if(s!==null&&s(l,c),c!==null&&typeof c=="object"&&typeof c.then=="function"){var g=cS(c,o);Mr(e,t,g,$t(e))}else Mr(e,t,o,$t(e))}catch(h){Mr(e,t,{then:function(){},status:"rejected",reason:h},$t())}finally{ge.p=i,r!==null&&l.types!==null&&(r.types=l.types),Q.T=r}}function mS(){}function Nd(e,t,n,o){if(e.tag!==5)throw Error(N(476));var a=fv(e).queue;dv(e,a,t,fa,n===null?mS:function(){return pv(e),n(o)})}function fv(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:fa,baseState:fa,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:io,lastRenderedState:fa},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:io,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function pv(e){var t=fv(e);t.next===null&&(t=e.alternate.memoizedState),Mr(e,t.next.queue,{},$t())}function Yf(){return dt(Ri)}function mv(){return Ke().memoizedState}function gv(){return Ke().memoizedState}function gS(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=$t();e=_o(n);var o=Ho(t,e,n);o!==null&&(Lt(o,t,n),Tr(o,t,n)),t={cache:Tf()},e.payload=t;return}t=t.return}}function hS(e,t,n){var o=$t();n={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},us(e)?bv(t,n):(n=kf(e,t,n,o),n!==null&&(Lt(n,e,o),vv(n,t,o)))}function hv(e,t,n){var o=$t();Mr(e,t,n,o)}function Mr(e,t,n,o){var a={lane:o,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(us(e))bv(t,a);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var r=t.lastRenderedState,l=i(r,n);if(a.hasEagerState=!0,a.eagerState=l,Jt(l,r))return as(e,t,a,0),we===null&&os(),!1}catch{}if(n=kf(e,t,a,o),n!==null)return Lt(n,e,o),vv(n,t,o),!0}return!1}function Vf(e,t,n,o){if(o={lane:2,revertLane:Wf(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},us(e)){if(t)throw Error(N(479))}else t=kf(e,n,o,2),t!==null&&Lt(t,e,2)}function us(e){var t=e.alternate;return e===J||t!==null&&t===J}function bv(e,t){bi=Lc=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function vv(e,t,n){if((n&4194048)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,nb(e,n)}}var Uc={readContext:dt,use:cs,useCallback:qe,useContext:qe,useEffect:qe,useImperativeHandle:qe,useLayoutEffect:qe,useInsertionEffect:qe,useMemo:qe,useReducer:qe,useRef:qe,useState:qe,useDebugValue:qe,useDeferredValue:qe,useTransition:qe,useSyncExternalStore:qe,useId:qe,useHostTransitionStatus:qe,useFormState:qe,useActionState:qe,useOptimistic:qe,useMemoCache:qe,useCacheRefresh:qe,useEffectEvent:qe},yv={readContext:dt,use:cs,useCallback:function(e,t){return Mt().memoizedState=[e,t===void 0?null:t],e},useContext:dt,useEffect:Xg,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,fc(4194308,4,rv.bind(null,t,e),n)},useLayoutEffect:function(e,t){return fc(4194308,4,e,t)},useInsertionEffect:function(e,t){fc(4,2,e,t)},useMemo:function(e,t){var n=Mt();t=t===void 0?null:t;var o=e();if(ka){Co(!0);try{e()}finally{Co(!1)}}return n.memoizedState=[o,t],o},useReducer:function(e,t,n){var o=Mt();if(n!==void 0){var a=n(t);if(ka){Co(!0);try{n(t)}finally{Co(!1)}}}else a=t;return o.memoizedState=o.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},o.queue=e,e=e.dispatch=hS.bind(null,J,e),[o.memoizedState,e]},useRef:function(e){var t=Mt();return e={current:e},t.memoizedState=e},useState:function(e){e=Td(e);var t=e.queue,n=hv.bind(null,J,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:jf,useDeferredValue:function(e,t){var n=Mt();return qf(n,e,t)},useTransition:function(){var e=Td(!1);return e=dv.bind(null,J,e.queue,!0,!1),Mt().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var o=J,a=Mt();if(W){if(n===void 0)throw Error(N(407));n=n()}else{if(n=t(),we===null)throw Error(N(349));(le&127)!==0||Qb(o,t,n)}a.memoizedState=n;var i={value:n,getSnapshot:t};return a.queue=i,Xg(Pb.bind(null,o,i,e),[e]),o.flags|=2048,Ti(9,{destroy:void 0},Zb.bind(null,o,i,n,t),null),n},useId:function(){var e=Mt(),t=we.identifierPrefix;if(W){var n=Ln,o=Hn;n=(o&~(1<<32-Pt(o)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Bc++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=sS++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Yf,useFormState:Yg,useActionState:Yg,useOptimistic:function(e){var t=Mt();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Vf.bind(null,J,!0,n),n.dispatch=t,[e,t]},useMemoCache:Lf,useCacheRefresh:function(){return Mt().memoizedState=gS.bind(null,J)},useEffectEvent:function(e){var t=Mt(),n={impl:e};return t.memoizedState=n,function(){if((me&2)!==0)throw Error(N(440));return n.impl.apply(void 0,arguments)}}},xv={readContext:dt,use:cs,useCallback:cv,useContext:dt,useEffect:Uf,useImperativeHandle:lv,useInsertionEffect:av,useLayoutEffect:iv,useMemo:sv,useReducer:dc,useRef:nv,useState:function(){return dc(io)},useDebugValue:jf,useDeferredValue:function(e,t){var n=Ke();return uv(n,xe.memoizedState,e,t)},useTransition:function(){var e=dc(io)[0],t=Ke().memoizedState;return[typeof e=="boolean"?e:ol(e),t]},useSyncExternalStore:Gb,useId:mv,useHostTransitionStatus:Yf,useFormState:Vg,useActionState:Vg,useOptimistic:function(e,t){var n=Ke();return Ib(n,xe,e,t)},useMemoCache:Lf,useCacheRefresh:gv,useEffectEvent:ov},bS={readContext:dt,use:cs,useCallback:cv,useContext:dt,useEffect:Uf,useImperativeHandle:lv,useInsertionEffect:av,useLayoutEffect:iv,useMemo:sv,useReducer:Bu,useRef:nv,useState:function(){return Bu(io)},useDebugValue:jf,useDeferredValue:function(e,t){var n=Ke();return xe===null?qf(n,e,t):uv(n,xe.memoizedState,e,t)},useTransition:function(){var e=Bu(io)[0],t=Ke().memoizedState;return[typeof e=="boolean"?e:ol(e),t]},useSyncExternalStore:Gb,useId:mv,useHostTransitionStatus:Yf,useFormState:Kg,useActionState:Kg,useOptimistic:function(e,t){var n=Ke();return xe!==null?Ib(n,xe,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Lf,useCacheRefresh:gv,useEffectEvent:ov};function Uu(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:ke({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Md={enqueueSetState:function(e,t,n){e=e._reactInternals;var o=$t(),a=_o(o);a.payload=t,n!=null&&(a.callback=n),t=Ho(e,a,o),t!==null&&(Lt(t,e,o),Tr(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=$t(),a=_o(o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Ho(e,a,o),t!==null&&(Lt(t,e,o),Tr(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=$t(),o=_o(n);o.tag=2,t!=null&&(o.callback=t),t=Ho(e,o,n),t!==null&&(Lt(t,e,n),Tr(t,e,n))}};function Gg(e,t,n,o,a,i,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,i,r):t.prototype&&t.prototype.isPureReactComponent?!Br(n,o)||!Br(a,i):!0}function Qg(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&Md.enqueueReplaceState(t,t.state,null)}function Sa(e,t){var n=t;if("ref"in t){n={};for(var o in t)o!=="ref"&&(n[o]=t[o])}if(e=e.defaultProps){n===t&&(n=ke({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function wv(e){Mc(e)}function kv(e){console.error(e)}function Sv(e){Mc(e)}function jc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(o){setTimeout(function(){throw o})}}function Zg(e,t,n){try{var o=e.onCaughtError;o(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function Ad(e,t,n){return n=_o(n),n.tag=3,n.payload={element:null},n.callback=function(){jc(e,t)},n}function Ev(e){return e=_o(e),e.tag=3,e}function Tv(e,t,n,o){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var i=o.value;e.payload=function(){return a(i)},e.callback=function(){Zg(t,n,o)}}var r=n.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){Zg(t,n,o),typeof a!="function"&&(Uo===null?Uo=new Set([this]):Uo.add(this));var l=o.stack;this.componentDidCatch(o.value,{componentStack:l!==null?l:""})})}function vS(e,t,n,o,a){if(n.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(t=n.alternate,t!==null&&va(t,n,a,!0),n=gt.current,n!==null){switch(n.tag){case 31:case 13:case 19:return wt===null?Zc():n.alternate===null&&Ye===0&&(Ye=3),n.flags&=-257,n.flags|=65536,n.lanes=a,o===Dc?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([o]):t.add(o),Gu(e,o,a)),!1;case 22:return n.flags|=65536,o===Dc?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([o])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([o]):n.add(o)),Gu(e,o,a)),!1}throw Error(N(435,n.tag))}return Gu(e,o,a),Zc(),!1}if(W)return t=gt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,o!==bd&&(e=Error(N(422),{cause:o}),jr(ln(e,n)))):(o!==bd&&(t=Error(N(423),{cause:o}),jr(ln(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,o=ln(o,n),a=Ad(e.stateNode,o,a),Lu(e,a),Ye!==4&&(Ye=2)),!1;var i=Error(N(520),{cause:o});if(i=ln(i,n),Rr===null?Rr=[i]:Rr.push(i),Ye!==4&&(Ye=2),t===null)return!0;o=ln(o,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Ad(n.stateNode,o,e),Lu(n,e),!1;case 1:if(t=n.type,i=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||i!==null&&typeof i.componentDidCatch=="function"&&(Uo===null||!Uo.has(i))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Ev(a),Tv(a,e,n,o),Lu(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var Kf=Error(N(461)),Pe=!1;function Ie(e,t,n,o){t.child=e===null?jb(t,null,n,o):wa(t,e.child,n,o)}function Pg(e,t,n,o,a){n=n.render;var i=t.ref;if("ref"in o){var r={};for(var l in o)l!=="ref"&&(r[l]=o[l])}else r=o;return ya(t),o=Rf(e,t,n,r,i,a),l=Df(),e!==null&&!Pe?(_f(e,t,a),ro(e,t,a)):(W&&l&&is(t),t.flags|=1,Ie(e,t,o,a),t.child)}function $g(e,t,n,o,a){if(e===null){var i=n.type;return typeof i=="function"&&!Sf(i)&&i.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=i,Cv(e,t,i,o,a)):(e=cc(n.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!Gf(e,a)){var r=i.memoizedProps;if(n=n.compare,n=n!==null?n:Br,n(r,o)&&e.ref===t.ref)return ro(e,t,a)}return t.flags|=1,e=eo(i,o),e.ref=t.ref,e.return=t,t.child=e}function Cv(e,t,n,o,a){if(e!==null){var i=e.memoizedProps;if(Br(i,o)&&e.ref===t.ref)if(Pe=!1,t.pendingProps=o=i,Gf(e,a))(e.flags&131072)!==0&&(Pe=!0);else return t.lanes=e.lanes,ro(e,t,a)}return zd(e,t,n,o,a)}function Nv(e,t,n,o){var a=o.children,i=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((t.flags&128)!==0){if(i=i!==null?i.baseLanes|n:n,e!==null){for(o=t.child=e.child,a=0;o!==null;)a=a|o.lanes|o.childLanes,o=o.sibling;o=a&~i}else o=0,t.child=null;return Jg(e,t,i,n,o)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&uc(t,i!==null?i.cachePool:null),i!==null?Ug(t,i):Sd(),Vb(t);else return o=t.lanes=536870912,Jg(e,t,i!==null?i.baseLanes|n:n,n,o)}else i!==null?(uc(t,i.cachePool),Ug(t,i),Bo(),t.memoizedState=null):(e!==null&&uc(t,null),Sd(),Bo());return Ie(e,t,a,n),t.child}function Ar(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Jg(e,t,n,o,a){var i=Cf();return i=i===null?null:{parent:Ze._currentValue,pool:i},t.memoizedState={baseLanes:n,cachePool:i},e!==null&&uc(t,null),Sd(),Vb(t),e!==null&&va(e,t,o,!0),t.childLanes=a,null}function pc(e,t){return t=ds({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ig(e,t,n){return wa(t,e.child,null,n),e=pc(t,t.pendingProps),e.flags|=2,Kt(t),t.memoizedState=null,e}function yS(e,t,n){var o=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(W){if(o.mode==="hidden")return e=pc(t,o),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Ar(null,e);if(Ed(t),(e=Ce)?(e=N0(e,cn),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Vo!==null?{id:Hn,overflow:Ln}:null,retryLane:536870912,hydrationErrors:null},n=Rb(e),n.return=t,t.child=n,it=t,Ce=null)):e=null,e===null)throw Ko(t);return t.lanes=536870912,null}return pc(t,o)}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(Ed(t),a)if(t.flags&256)t.flags&=-257,t=Ig(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(N(558));else if(Pe||va(e,t,n,!1),a=(n&e.childLanes)!==0,Pe||a){if(Xo.current===null){if(o=we,o!==null&&(r=ob(o,n),r!==0&&r!==i.retryLane))throw i.retryLane=r,Ma(e,r),Lt(o,e,r),Kf;Zc()}t=Ig(e,t,n)}else e=i.treeContext,Ce=sn(r.nextSibling),it=t,W=!0,Do=null,cn=!1,e!==null&&_b(t,e),t=pc(t,o),t.flags|=134221824;return t}return e=eo(e.child,{mode:o.mode,children:o.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Ia(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(N(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function zd(e,t,n,o,a){return ya(t),n=Rf(e,t,n,o,void 0,a),o=Df(),e!==null&&!Pe?(_f(e,t,a),ro(e,t,a)):(W&&o&&is(t),t.flags|=1,Ie(e,t,n,a),t.child)}function Fg(e,t,n,o,a,i){return ya(t),t.updateQueue=null,n=Xb(t,o,n,a),Kb(e),o=Df(),e!==null&&!Pe?(_f(e,t,i),ro(e,t,i)):(W&&o&&is(t),t.flags|=1,Ie(e,t,n,i),t.child)}function Wg(e,t,n,o,a){if(ya(t),t.stateNode===null){var i=ci,r=n.contextType;typeof r=="object"&&r!==null&&(i=dt(r)),i=new n(o,i),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Md,t.stateNode=i,i._reactInternals=t,i=t.stateNode,i.props=o,i.state=t.memoizedState,i.refs={},Mf(t),r=n.contextType,i.context=typeof r=="object"&&r!==null?dt(r):ci,i.state=t.memoizedState,r=n.getDerivedStateFromProps,typeof r=="function"&&(Uu(t,n,r,o),i.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(r=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),r!==i.state&&Md.enqueueReplaceState(i,i.state,null),Nr(t,o,i,a),Cr(),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308),o=!0}else if(e===null){i=t.stateNode;var l=t.memoizedProps,c=Sa(n,l);i.props=c;var s=i.context,g=n.contextType;r=ci,typeof g=="object"&&g!==null&&(r=dt(g));var h=n.getDerivedStateFromProps;g=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function",l=t.pendingProps!==l,g||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(l||s!==r)&&Qg(t,i,o,r),Eo=!1;var f=t.memoizedState;i.state=f,Nr(t,o,i,a),Cr(),s=t.memoizedState,l||f!==s||Eo?(typeof h=="function"&&(Uu(t,n,h,o),s=t.memoizedState),(c=Eo||Gg(t,n,c,o,f,s,r))?(g||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=s),i.props=o,i.state=s,i.context=r,o=c):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{i=t.stateNode,wd(e,t),r=t.memoizedProps,g=Sa(n,r),i.props=g,h=t.pendingProps,f=i.context,s=n.contextType,c=ci,typeof s=="object"&&s!==null&&(c=dt(s)),l=n.getDerivedStateFromProps,(s=typeof l=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(r!==h||f!==c)&&Qg(t,i,o,c),Eo=!1,f=t.memoizedState,i.state=f,Nr(t,o,i,a),Cr();var p=t.memoizedState;r!==h||f!==p||Eo||e!==null&&e.dependencies!==null&&Rc(e.dependencies)?(typeof l=="function"&&(Uu(t,n,l,o),p=t.memoizedState),(g=Eo||Gg(t,n,g,o,f,p,c)||e!==null&&e.dependencies!==null&&Rc(e.dependencies))?(s||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(o,p,c),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(o,p,c)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=p),i.props=o,i.state=p,i.context=c,o=g):(typeof i.componentDidUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),o=!1)}return i=o,Ia(e,t),o=(t.flags&128)!==0,i||o?(i=t.stateNode,n=o&&typeof n.getDerivedStateFromError!="function"?null:i.render(),t.flags|=1,e!==null&&o?(t.child=wa(t,e.child,null,a),t.child=wa(t,null,n,a)):Ie(e,t,n,a),t.memoizedState=i.state,e=t.child):e=ro(e,t,a),e}function eh(e,t,n,o){return ba(),t.flags|=256,Ie(e,t,n,o),t.child}var Od={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Rd(e){return{baseLanes:e,cachePool:Lb()}}function Dd(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Gt),e}function Mv(e,t,n){var o=t.pendingProps,a=!1,i=(t.flags&128)!==0,r;if((r=i)||(r=e!==null&&e.memoizedState===null?!1:(pt.current&2)!==0),r&&(a=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if(W){if(a?Lo(t):Bo(),(e=Ce)?(e=N0(e,cn),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Vo!==null?{id:Hn,overflow:Ln}:null,retryLane:536870912,hydrationErrors:null},n=Rb(e),n.return=t,t.child=n,it=t,Ce=null)):e=null,e===null)throw Ko(t);return op(e)?t.lanes=32:t.lanes=536870912,null}return i=o.children,o=o.fallback,a?(Bo(),a=t.mode,i=ds({mode:"hidden",children:i},a),o=pa(o,a,n,null),i.return=t,o.return=t,i.sibling=o,t.child=i,o=t.child,o.memoizedState=Rd(n),o.childLanes=Dd(e,r,n),t.memoizedState=Od,Ar(null,o)):(Lo(t),Xf(t,i))}var l=e.memoizedState;if(l!==null){var c=l.dehydrated;if(c!==null)return xS(e,t,i,r,o,c,l,n)}return a?(Bo(),a=o.fallback,i=t.mode,l=e.child,c=l.sibling,o=eo(l,{mode:"hidden",children:o.children}),o.subtreeFlags=l.subtreeFlags&1206910976,c!==null?a=eo(c,a):(a=pa(a,i,n,null),a.flags|=2),a.return=t,o.return=t,o.sibling=a,t.child=o,Ar(null,o),o=t.child,a=e.child.memoizedState,a===null?a=Rd(n):(i=a.cachePool,i!==null?(l=Ze._currentValue,i=i.parent!==l?{parent:l,pool:l}:i):i=Lb(),a={baseLanes:a.baseLanes|n,cachePool:i}),o.memoizedState=a,o.childLanes=Dd(e,r,n),t.memoizedState=Od,Ar(e.child,o)):(Lo(t),n=e.child,e=n.sibling,n=eo(n,{mode:"visible",children:o.children}),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n)}function Xf(e,t){return t=ds({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function ds(e,t){return e=Ht(22,e,null,t),e.lanes=0,e}function Pl(e,t,n){return wa(t,e.child,null,n),e=Xf(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function xS(e,t,n,o,a,i,r,l){if(n)return t.flags&256?(Lo(t),t.flags&=-257,Pl(e,t,l)):t.memoizedState!==null?(Bo(),t.child=e.child,t.flags|=128,null):(Bo(),i=a.fallback,r=t.mode,a=ds({mode:"visible",children:a.children},r),i=pa(i,r,l,null),i.flags|=2,a.return=t,i.return=t,a.sibling=i,t.child=a,wa(t,e.child,null,l),a=t.child,a.memoizedState=Rd(l),a.childLanes=Dd(e,o,l),t.memoizedState=Od,Ar(null,a));if(Lo(t),op(i)){if(o=i.nextSibling&&i.nextSibling.dataset,o)var c=o.dgst;return o=c,o!==""&&(a=Error(N(419)),a.stack="",a.digest=o,jr({value:a,source:null,stack:null})),Pl(e,t,l)}if(Pe||va(e,t,l,!1),o=(l&e.childLanes)!==0,Pe||o){if(Xo.current!==null)return Pl(e,t,l);if(o=we,o!==null&&(a=ob(o,l),a!==0&&a!==r.retryLane))throw r.retryLane=a,Ma(e,a),Lt(o,e,a),Kf;return af(i)||Zc(),Pl(e,t,l)}return af(i)?(t.flags|=192,t.child=e.child,null):(e=r.treeContext,Ce=sn(i.nextSibling),it=t,W=!0,Do=null,cn=!1,e!==null&&_b(t,e),t=Xf(t,a.children),t.flags|=134221824,t)}function th(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),sc(e.return,t,n)}function nh(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Hc(n)===null&&(t=e),e=e.sibling}return t}function $l(e,t,n,o,a,i){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:a,treeForkCount:i}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=o,r.tail=n,r.tailMode=a,r.treeForkCount=i)}function ju(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function _d(e,t,n){var o=t.pendingProps,a=o.revealOrder,i=o.tail;o=o.children;var r=pt.current;if(t.flags&128)return Yr(t,r),null;var l=(r&2)!==0;if(l?(r=r&1|2,t.flags|=128):r&=1,Yr(t,r),a==="backwards"&&e!==null?(ju(e),Ie(e,t,o,n),ju(e)):Ie(e,t,o,n),o=W?Ur:0,!l&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&th(e,n,t);else if(e.tag===19)th(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"backwards":n=nh(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null,ju(t)),$l(t,!0,a,null,i,o);break;case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&Hc(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}$l(t,!0,n,null,i,o);break;case"together":$l(t,!1,null,null,void 0,o);break;case"independent":t.memoizedState=null;break;default:n=nh(t.child),n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),$l(t,!1,a,n,i,o)}return t.child}function oh(e,t,n){var o=t.pendingProps;return Mo(t,t.type,o.value),Ie(e,t,o.children,n),t.child}function ro(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Qo|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(va(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(N(153));if(t.child!==null){for(e=t.child,n=eo(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=eo(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Gf(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Rc(e)))}function wS(e,t,n){switch(t.tag){case 3:Ec(t,t.stateNode.containerInfo),Mo(t,Ze,e.memoizedState.cache),ba();break;case 27:case 5:ld(t);break;case 4:Ec(t,t.stateNode.containerInfo);break;case 10:Mo(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ed(t),null;break;case 13:var o=t.memoizedState;if(o!==null){if(o.dehydrated!==null)return Lo(t),t.flags|=128,null;o=va(e,t,n,!1);var a=t.child.childLanes;return o||(n&a)!==0?Mv(e,t,n):(Lo(t),e=ro(e,t,n),e!==null?e.sibling:null)}Lo(t);break;case 19:if(t.flags&128)return _d(e,t,n);if(a=(e.flags&128)!==0,o=(n&t.childLanes)!==0,o||(va(e,t,n,!1),o=(n&t.childLanes)!==0),a){if(o)return _d(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),Yr(t,pt.current),o)break;return null;case 22:return t.lanes=0,Nv(e,t,n,t.pendingProps);case 24:Mo(t,Ze,e.memoizedState.cache)}return ro(e,t,n)}function Av(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Pe=!0;else{if(!Gf(e,n)&&(t.flags&128)===0)return Pe=!1,wS(e,t,n);Pe=(e.flags&131072)!==0}else Pe=!1,W&&(t.flags&1048576)!==0&&Db(t,Ur,t.index);switch(t.lanes=0,t.tag){case 16:e:{var o=t.pendingProps;if(e=ca(t.elementType),t.type=e,typeof e=="function")Sf(e)?(o=Sa(e,o),t.tag=1,t=Wg(null,t,e,o,n)):(t.tag=0,t=zd(null,t,e,o,n));else{if(e!=null){var a=e.$$typeof;if(a===uf){t.tag=11,t=Pg(null,t,e,o,n);break e}else if(a===df){t.tag=14,t=$g(null,t,e,o,n);break e}else if(a===Dn){t.tag=10,t.type=e,t=oh(null,t,n);break e}}throw t=id(e)||e,Error(N(306,t,""))}}return t;case 0:return zd(e,t,t.type,t.pendingProps,n);case 1:return o=t.type,a=Sa(o,t.pendingProps),Wg(e,t,o,a,n);case 3:e:{if(Ec(t,t.stateNode.containerInfo),e===null)throw Error(N(387));o=t.pendingProps;var i=t.memoizedState;a=i.element,wd(e,t),Nr(t,o,null,n);var r=t.memoizedState;if(o=r.cache,Mo(t,Ze,o),o!==i.cache&&yd(t,[Ze],n,!0),Cr(),o=r.element,i.isDehydrated)if(i={element:o,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){t=eh(e,t,o,n);break e}else if(o!==a){a=ln(Error(N(424)),t),jr(a),t=eh(e,t,o,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ce=sn(e.firstChild),it=t,W=!0,Do=null,cn=!0,n=jb(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling;else{if(ba(),o===a){t=ro(e,t,n);break e}Ie(e,t,o,n)}t=t.child}return t;case 26:return Ia(e,t),e===null?(n=zh(t.type,null,t.pendingProps,null))?t.memoizedState=n:W||(t.stateNode=v0(t.type,t.pendingProps,Ro.current,t)):t.memoizedState=zh(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ld(t),e===null&&W&&(o=t.stateNode=M0(t.type,t.pendingProps,Ro.current),it=t,cn=!0,a=Ce,Po(t.type)?(rf=a,Ce=sn(o.firstChild)):Ce=a),Ie(e,t,t.pendingProps.children,n),Ia(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&W&&((a=o=Ce)&&(o=pE(o,t.type,t.pendingProps,cn),o!==null?(t.stateNode=o,it=t,Ce=sn(o.firstChild),cn=!1,a=!0):a=!1),a||Ko(t)),ld(t),a=t.type,i=t.pendingProps,r=e!==null?e.memoizedProps:null,o=i.children,tf(a,i)?o=null:r!==null&&tf(a,r)&&(t.flags|=32),t.memoizedState!==null&&(a=Rf(e,t,uS,null,null,n),Ri._currentValue=a),Ia(e,t),Ie(e,t,o,n),t.child;case 6:return e===null&&W&&((e=n=Ce)&&(n=mE(n,t.pendingProps,cn),n!==null?(t.stateNode=n,it=t,Ce=null,e=!0):e=!1),e||Ko(t)),null;case 13:return Mv(e,t,n);case 4:return Ec(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=wa(t,null,o,n):Ie(e,t,o,n),t.child;case 11:return Pg(e,t,t.type,t.pendingProps,n);case 7:return o=t.pendingProps,Ia(e,t),Ie(e,t,o,n),t.child;case 8:return Ie(e,t,t.pendingProps.children,n),t.child;case 12:return Ie(e,t,t.pendingProps.children,n),t.child;case 10:return oh(e,t,n);case 9:return a=t.type._context,o=t.pendingProps.children,ya(t),a=dt(a),o=o(a),t.flags|=1,Ie(e,t,o,n),t.child;case 14:return $g(e,t,t.type,t.pendingProps,n);case 15:return Cv(e,t,t.type,t.pendingProps,n);case 19:return _d(e,t,n);case 31:return yS(e,t,n);case 22:return Nv(e,t,n,t.pendingProps);case 24:return ya(t),o=dt(Ze),e===null?(a=Cf(),a===null&&(a=we,i=Tf(),a.pooledCache=i,i.refCount++,i!==null&&(a.pooledCacheLanes|=n),a=i),t.memoizedState={parent:o,cache:a},Mf(t),Mo(t,Ze,a)):((e.lanes&n)!==0&&(wd(e,t),Nr(t,null,null,n),Cr()),a=e.memoizedState,i=t.memoizedState,a.parent!==o?(a={parent:o,cache:o},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Mo(t,Ze,o)):(o=i.cache,Mo(t,Ze,o),o!==a.cache&&yd(t,[Ze],n,!0))),Ie(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),o=t.pendingProps,o.name!=null&&o.name!=="auto"?t.flags|=e===null?18882560:18874368:W&&is(t),e!==null&&e.memoizedProps.name!==o.name?t.flags|=4194816:Ia(e,t),Ie(e,t,o.children,n),t.child;case 29:throw t.pendingProps}throw Error(N(156,t.tag))}function In(e){e.flags|=4}function qu(e,t,n,o,a){var i;if((i=(e.mode&32)!==0)&&(i=n===null?Dh(t,o):Dh(t,o)&&(o.src!==n.src||o.srcSet!==n.srcSet)),i){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(a0())e.flags|=8192;else throw ga=Dc,Nf}else e.flags&=-16777217}function ah(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!R0(t))if(a0())e.flags|=8192;else throw ga=Dc,Nf}function Jl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?eb():536870912,e.lanes|=t,Ci|=t)}function fr(e,t){if(!W)switch(e.tailMode){case"visible":break;case"collapsed":for(var n=e.tail,o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function Te(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags&1206910976,o|=a.flags&1206910976,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function kS(e,t,n){var o=t.pendingProps;switch(Ef(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Te(t),null;case 1:return Te(t),null;case 3:return n=t.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),t.memoizedState.cache!==o&&(t.flags|=2048),to(Ze),ki(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&($a(t)?In(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Hu())),Te(t),null;case 26:var a=t.type,i=t.memoizedState;return e===null?(In(t),i!==null?(Te(t),ah(t,i)):(Te(t),qu(t,a,null,o,n))):i?i!==e.memoizedState?(In(t),Te(t),ah(t,i)):(Te(t),t.flags&=-16777217):(e=e.memoizedProps,e!==o&&In(t),Te(t),qu(t,a,e,o,n)),null;case 27:if(Tc(t),n=Ro.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&In(t);else{if(!o){if(t.stateNode===null)throw Error(N(166));return Te(t),t.subtreeFlags&=-33554433,null}e=Bn.current,$a(t)?Og(t,e):(e=M0(a,o,n),t.stateNode=e,In(t))}return Te(t),t.subtreeFlags&=-33554433,null;case 5:if(Tc(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==o&&In(t);else{if(!o){if(t.stateNode===null)throw Error(N(166));return Te(t),t.subtreeFlags&=-33554433,null}if(i=Bn.current,$a(t))Og(t,i);else{var r=Gr(Ro.current);switch(i){case 1:i=r.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:i=r.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":i=r.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":i=r.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":i=r.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild);break;case"select":i=typeof o.is=="string"?r.createElement("select",{is:o.is}):r.createElement("select"),o.multiple?i.multiple=!0:o.size&&(i.size=o.size);break;default:i=typeof o.is=="string"?r.createElement(a,{is:o.is}):r.createElement(a)}}i[ut]=t,i[Ut]=o;e:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)i.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break e;for(;r.sibling===null;){if(r.return===null||r.return===t)break e;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=i;e:switch(mt(i,a,o),a){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&In(t)}}return Te(t),t.subtreeFlags&=-33554433,qu(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==o&&In(t);else{if(typeof o!="string"&&t.stateNode===null)throw Error(N(166));if(e=Ro.current,$a(t)){if(e=t.stateNode,n=t.memoizedProps,o=null,a=it,a!==null)switch(a.tag){case 27:case 5:o=a.memoizedProps}e[ut]=t,e=!!(e.nodeValue===n||o!==null&&o.suppressHydrationWarning===!0||h0(e.nodeValue,n)),e||Ko(t,!0)}else e=Gr(e).createTextNode(o),e[ut]=t,t.stateNode=e}return Te(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(o=$a(t),n!==null){if(e===null){if(!o)throw Error(N(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(N(557));e[ut]=t}else ba(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Te(t),e=!1}else n=Hu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Kt(t),t):(Kt(t),null);if((t.flags&128)!==0)throw Error(N(558))}return Te(t),null;case 13:if(o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=$a(t),o!==null&&o.dehydrated!==null){if(e===null){if(!a)throw Error(N(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(N(317));a[ut]=t}else ba(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Te(t),a=!1}else a=Hu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Kt(t),t):(Kt(t),null)}return Kt(t),(t.flags&128)!==0?(t.lanes=n,t):(n=o!==null,e=e!==null&&e.memoizedState!==null,n&&(o=t.child,a=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(a=o.alternate.memoizedState.cachePool.pool),i=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(i=o.memoizedState.cachePool.pool),i!==a&&(o.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Jl(t,t.updateQueue),Te(t),null);case 4:return ki(),e===null&&ep(t.stateNode.containerInfo),t.flags|=67108864,Te(t),null;case 10:return to(t.type),Te(t),null;case 19:if(zf(t),o=t.memoizedState,o===null)return Te(t),null;if(a=(t.flags&128)!==0,i=o.rendering,i===null)if(a)fr(o,!1);else{if(Ye!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=Hc(e),i!==null){for(t.flags|=128,fr(o,!1),e=i.updateQueue,t.updateQueue=e,Jl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Ob(n,e),n=n.sibling;return Yr(t,pt.current&1|2),W&&Fn(t,o.treeForkCount),t.child}e=e.sibling}o.tail!==null&&Qt()>Gc&&(t.flags|=128,a=!0,fr(o,!1),t.lanes=4194304)}else{if(!a)if(e=Hc(i),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Jl(t,e),fr(o,!0),o.tail===null&&o.tailMode!=="collapsed"&&o.tailMode!=="visible"&&!i.alternate&&!W)return Te(t),null}else 2*Qt()-o.renderingStartTime>Gc&&n!==536870912&&(t.flags|=128,a=!0,fr(o,!1),t.lanes=4194304);o.isBackwards?(i.sibling=t.child,t.child=i):(e=o.last,e!==null?e.sibling=i:t.child=i,o.last=i)}if(o.tail!==null){e=o.tail;e:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break e}n=n.sibling}n=!0}return o.rendering=e,o.tail=e.sibling,o.renderingStartTime=Qt(),e.sibling=null,i=pt.current,i=a?i&1|2:i&1,o.tailMode==="visible"||o.tailMode==="collapsed"||!n||W?Yr(t,i):(n=i,Ne(gt,t),Ne(pt,n),wt===null&&(wt=t)),W&&Fn(t,o.treeForkCount),e}return Te(t),null;case 22:case 23:return Kt(t),Af(),o=t.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(t.flags|=8192):o&&(t.flags|=8192),o?(n&536870912)!==0&&(t.flags&128)===0&&(Te(t),t.subtreeFlags&6&&(t.flags|=8192)):Te(t),n=t.updateQueue,n!==null&&Jl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),o=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(o=t.memoizedState.cachePool.pool),o!==n&&(t.flags|=2048),e!==null&&ft(ma),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),to(Ze),Te(t),null;case 25:return null;case 30:return t.flags|=33554432,Te(t),null}throw Error(N(156,t.tag))}function SS(e,t){switch(Ef(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return to(Ze),ki(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Tc(t),null;case 31:if(t.memoizedState!==null){if(Kt(t),t.alternate===null)throw Error(N(340));ba()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Kt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(N(340));ba()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return zf(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return ki(),null;case 10:return to(t.type),null;case 22:case 23:return Kt(t),Af(),e!==null&&ft(ma),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return to(Ze),null;case 25:return null;default:return null}}function zv(e,t){switch(Ef(t),t.tag){case 3:to(Ze),ki();break;case 26:case 27:case 5:Tc(t);break;case 4:ki();break;case 31:t.memoizedState!==null&&Kt(t);break;case 13:Kt(t);break;case 19:zf(t);break;case 10:to(t.type);break;case 22:case 23:Kt(t),Af(),e!==null&&ft(ma);break;case 24:to(Ze)}}function al(e,t){try{var n=t.updateQueue,o=n!==null?n.lastEffect:null;if(o!==null){var a=o.next;n=a;do{if((n.tag&e)===e){o=void 0;var i=n.create,r=n.inst;o=i(),r.destroy=o}n=n.next}while(n!==a)}}catch(l){ye(t,t.return,l)}}function Go(e,t,n){try{var o=t.updateQueue,a=o!==null?o.lastEffect:null;if(a!==null){var i=a.next;o=i;do{if((o.tag&e)===e){var r=o.inst,l=r.destroy;if(l!==void 0){r.destroy=void 0,a=t;var c=n,s=l;try{s()}catch(g){ye(a,c,g)}}}o=o.next}while(o!==i)}}catch(g){ye(t,t.return,g)}}function Ov(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Yb(t,n)}catch(o){ye(e,e.return,o)}}}function Rv(e,t,n){n.props=Sa(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(o){ye(e,t,o)}}function On(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:var a=e.stateNode,i=oo(e.memoizedProps,a);(a.ref===null||a.ref.name!==i)&&(a.ref=k0(i)),o=a.ref;break;case 7:if(e.stateNode===null){var r=new It(e);Bt(e.child,!1,dE,r,void 0,void 0),e.stateNode=r}o=e.stateNode;break;default:o=e.stateNode}typeof n=="function"?e.refCleanup=n(o):n.current=o}}catch(l){ye(e,t,l)}}function st(e,t){var n=e.ref,o=e.refCleanup;if(n!==null)if(typeof o=="function")try{o()}catch(a){ye(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){ye(e,t,a)}else n.current=null}function qc(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)C0(e.stateNode,t[n])}function ih(e){for(var t=e.return;t!==null&&(Zf(t)&&C0(e.stateNode,t.stateNode),!Qf(t));)t=t.return}function zr(e){for(var t=e.return;t!==null&&(Zf(t)&&fE(e.stateNode,t.stateNode),!Qf(t));)t=t.return}function Qf(e){return e.tag===5||e.tag===3||e.tag===27}function Zf(e){return e&&e.tag===7&&e.stateNode!==null}function Hd(e){var t=e.type,n=e.memoizedProps,o=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&o.focus();break e;case"img":n.src?o.src=n.src:n.srcSet&&(o.srcset=n.srcSet)}}catch(a){ye(e,e.return,a)}}function Yu(e,t,n){try{var o=e.stateNode;ZS(o,e.type,n,t),o[Ut]=t}catch(a){ye(e,e.return,a)}}function Dv(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Po(e.type)||e.tag===4}function Vu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Dv(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Po(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ld(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(a,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(a),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=_n)),qc(e,o),fe=!0;else if(a!==4&&(a===27&&(qc(e,o),o=null,Po(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Ld(e,t,n,o),e=e.sibling;e!==null;)Ld(e,t,n,o),e=e.sibling}function Yc(e,t,n,o){var a=e.tag;if(a===5||a===6)a=e.stateNode,t?n.insertBefore(a,t):n.appendChild(a),qc(e,o),fe=!0;else if(a!==4&&(a===27&&(qc(e,o),o=null,Po(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Yc(e,t,n,o),e=e.sibling;e!==null;)Yc(e,t,n,o),e=e.sibling}function _v(e){var t=e.stateNode,n=e.memoizedProps;try{for(var o=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);mt(t,o,n),t[ut]=e,t[Ut]=n}catch(i){ye(e,e.return,i)}}var Vc=!1,Xt=null;function rh(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(Vc=!0)}var Rn=null;function lh(){var e=Rn;return Rn=null,e}var _t=0;function Ui(e,t,n,o,a){return _t=0,Hv(e.child,t,n,o,a)}function Hv(e,t,n,o,a){for(var i=!1;e!==null;){if(e.tag===5){var r=e.stateNode;if(o!==null){var l=nf(r);o.push(l),l.view&&(i=!0)}else i||nf(r).view&&(i=!0);Vc=!0,y0(r,_t===0?t:t+"_"+_t,n),_t++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&a||Hv(e.child,t,n,o,a)&&(i=!0));e=e.sibling}return i}function jn(e,t){for(;e!==null;)e.tag===5?x0(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||jn(e.child,t)),e=e.sibling}function mc(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(mc(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name==="auto")throw Error(N(544));var n=t.name;t=so(t.default,t.share),t!=="none"&&(Ui(e,n,t,null,!1)||jn(e.child,!1))}e=e.sibling}}function Bd(e,t){if(e.tag===30){var n=e.stateNode,o=e.memoizedProps,a=oo(o,n),i=so(o.default,n.paired?o.share:o.enter);i!=="none"?Ui(e,a,i,null,!1)?(mc(e),n.paired||t||Ni(e,o.onEnter)):jn(e.child,!1):mc(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Bd(e,t),e=e.sibling;else mc(e)}function Ud(e){if(Xt!==null&&Xt.size!==0){var t=Xt;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.memoizedProps,o=n.name;if(o!=null&&o!=="auto"){var a=t.get(o);if(a!==void 0){var i=so(n.default,n.share);if(i!=="none"&&(Ui(e,o,i,null,!1)?(i=e.stateNode,a.paired=i,i.paired=a,Ni(e,n.onShare)):jn(e.child,!1)),t.delete(o),t.size===0)break}}}Ud(e)}e=e.sibling}}}function jd(e){if(e.tag===30){var t=e.memoizedProps,n=oo(t,e.stateNode),o=Xt!==null?Xt.get(n):void 0,a=so(t.default,o!==void 0?t.share:t.exit);a!=="none"&&(Ui(e,n,a,null,!1)?o!==void 0?(a=e.stateNode,o.paired=a,a.paired=o,Xt.delete(n),Ni(e,t.onShare)):Ni(e,t.onExit):jn(e.child,!1)),Xt!==null&&Ud(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)jd(e),e=e.sibling;else Xt!==null&&Ud(e)}function Lv(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=oo(t,e.stateNode);t=so(t.default,t.update),e.flags&=-5,t!=="none"&&Ui(e,n,t,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&Lv(e);e=e.sibling}}function qd(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.stateNode;t.paired!==null&&(t.paired=null,jn(e.child,!1))}qd(e)}e=e.sibling}}function gc(e){if(e.tag===30)e.stateNode.paired=null,jn(e.child,!1),qd(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)gc(e),e=e.sibling;else qd(e)}function Bv(e){for(e=e.child;e!==null;)e.tag===30?jn(e.child,!1):(e.subtreeFlags&33554432)!==0&&Bv(e),e=e.sibling}function Pf(e,t,n,o,a,i,r){for(var l=!1;t!==null;){if(t.tag===5){var c=t.stateNode;if(i!==null&&_t<i.length){var s=i[_t],g=nf(c);(s.view||g.view)&&(l=!0);var h;if(h=(e.flags&4)===0)if(g.clip)h=!0;else{h=s.rect;var f=g.rect;h=h.y!==f.y||h.x!==f.x||h.height!==f.height||h.width!==f.width}h&&(e.flags|=4),g.abs?g=!s.abs:(s=s.rect,g=g.rect,g=s.height!==g.height||s.width!==g.width),g&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&y0(c,_t===0?n:n+"_"+_t,a),l&&(e.flags&4)!==0||(Rn===null&&(Rn=[]),Rn.push(c,_t===0?o:o+"_"+_t,t.memoizedProps)),_t++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&r?e.flags|=t.flags&32:Pf(e,t.child,n,o,a,i,r)&&(l=!0));t=t.sibling}return l}function Uv(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,o=e.stateNode,a=oo(n,o),i=so(n.default,n.update);if(t){o=o.clones;var r=o===null?null:o.map(WS)}else r=e.memoizedState,e.memoizedState=null;o=e;var l=e.child;_t=0,a=Pf(o,l,a,a,i,r,!1),(e.flags&4)!==0&&a&&(t||Ni(e,n.onUpdate))}else(e.subtreeFlags&33554432)!==0&&Uv(e,t);e=e.sibling}}var nt=!1,he=!1,Mn=!1,Ku=!1,ch=typeof WeakSet=="function"?WeakSet:Set,ot=null,An=!1,xr=!1,Kc=!1,Yd=!1;function ES(e,t,n){if(e=e.containerInfo,Wd=Di,e=Sb(e),xf(e)){if("selectionStart"in e)var o={start:e.selectionStart,end:e.selectionEnd};else e:{o=(o=e.ownerDocument)&&o.defaultView||window;var a=o.getSelection&&o.getSelection();if(a&&a.rangeCount!==0){o=a.anchorNode;var i=a.anchorOffset,r=a.focusNode;a=a.focusOffset;try{o.nodeType,r.nodeType}catch{o=null;break e}var l=0,c=-1,s=-1,g=0,h=0,f=e,p=null;t:for(;;){for(var x;f!==o||i!==0&&f.nodeType!==3||(c=l+i),f!==r||a!==0&&f.nodeType!==3||(s=l+a),f.nodeType===3&&(l+=f.nodeValue.length),(x=f.firstChild)!==null;)p=f,f=x;for(;;){if(f===e)break t;if(p===o&&++g===i&&(c=l),p===r&&++h===a&&(s=l),(x=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=x}o=c===-1||s===-1?null:{start:c,end:s}}else o=null}o=o||{start:0,end:0}}else o=null;for(ef={focusedElem:e,selectionRange:o},Di=!1,n=(n&335544064)===n,ot=t,t=n?9270:1024;ot!==null;){if(e=ot,n&&(o=e.deletions,o!==null))for(i=0;i<o.length;i++)n&&jd(o[i]);if(e.alternate===null&&(e.flags&2)!==0)n&&rh(e),Il(n);else{if(e.tag===22){if(o=e.alternate,e.memoizedState!==null){o!==null&&o.memoizedState===null&&n&&jd(o),Il(n);continue}else if(o!==null&&o.memoizedState!==null){n&&rh(e),Il(n);continue}}o=e.child,(e.subtreeFlags&t)!==0&&o!==null?(o.return=e,ot=o):(n&&Lv(e),Il(n))}}Xt=null}function Il(e){for(;ot!==null;){var t=ot,n=e,o=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if((a&1024)!==0&&o!==null){n=void 0,a=o.memoizedProps,o=o.memoizedState;var i=t.stateNode;try{var r=Sa(t.type,a);n=i.getSnapshotBeforeUpdate(r,o),i.__reactInternalSnapshotBeforeUpdate=n}catch(l){ye(t,t.return,l)}}break;case 3:if((a&1024)!==0){if(o=t.stateNode.containerInfo,n=o.nodeType,n===9)of(o);else if(n===1)switch(o.nodeName){case"HEAD":case"HTML":case"BODY":of(o);break;default:o.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&o!==null&&(n=oo(o.memoizedProps,o.stateNode),a=t.memoizedProps,a=so(a.default,a.update),a!=="none"&&Ui(o,n,a,o.memoizedState=[],!0));break;default:if((a&1024)!==0)throw Error(N(163))}if(o=t.sibling,o!==null){o.return=t.return,ot=o;break}ot=t.return}}function jv(e,t,n){var o=n.flags;switch(n.tag){case 0:case 11:case 15:zn(e,n),o&4&&al(5,n);break;case 1:if(zn(e,n),o&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(r){ye(n,n.return,r)}else{var a=Sa(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){ye(n,n.return,r)}}o&64&&Ov(n),o&512&&On(n,n.return);break;case 3:if(zn(e,n),o&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Yb(e,t)}catch(r){ye(n,n.return,r)}}break;case 27:t===null&&o&4&&_v(n);case 26:case 5:zn(e,n),t===null&&o&4&&Hd(n),o&512&&On(n,n.return);break;case 12:zn(e,n);break;case 31:zn(e,n),o&4&&Kv(e,n);break;case 13:zn(e,n),o&4&&Xv(e,n),o&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=LS.bind(null,n),gE(e,n))));break;case 22:if(o=n.memoizedState!==null||nt,!o){var i=t!==null&&t.memoizedState!==null||he;t=nt,a=he,nt=o,(he=i)&&!a?(o=2,(n.subtreeFlags&8772)!==0&&(o|=1),bn(e,n,o)):zn(e,n),nt=t,he=a}break;case 30:zn(e,n),o&512&&On(n,n.return);break;case 7:o&512&&On(n,n.return);default:zn(e,n)}}function Vd(e,t){for(e=e.child;e!==null;)qv(e,t),e=e.sibling}function qv(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var o=n.style;typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"}else{var a=e.stateNode,i=e.memoizedProps.style,r=i!=null&&i.hasOwnProperty("display")?i.display:null;a.style.display=r==null||typeof r=="boolean"?"":(""+r).trim()}}catch(c){ye(e,e.return,c)}Kd(e,t);break;case 6:try{e.stateNode.nodeValue=t?"":e.memoizedProps,fe=!0}catch(c){ye(e,e.return,c)}break;case 18:try{var l=e.stateNode;t?Eh(l,!0):Eh(e.stateNode,!1)}catch(c){ye(e,e.return,c)}break;case 22:case 23:e.memoizedState===null&&Vd(e,t);break;default:Vd(e,t)}}function Kd(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var n=e,o=t;switch(n.tag){case 4:qv(n,o);break e;case 22:n.memoizedState===null&&Kd(n,o);break e;default:Kd(n,o)}}e=e.sibling}}function Yv(e){var t=e.alternate;t!==null&&(e.alternate=null,Yv(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Wc(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Re=null,Rt=!1;function hn(e,t,n){for(n=n.child;n!==null;)Vv(e,t,n),n=n.sibling}function Vv(e,t,n){if(Zt&&typeof Zt.onCommitFiberUnmount=="function")try{Zt.onCommitFiberUnmount(Ir,n)}catch{}switch(n.tag){case 26:he||st(n,t),hn(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!he&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:he||st(n,t),zr(n);var o=Re,a=Rt;Po(n.type)&&(Re=n.stateNode,Rt=!1),hn(e,t,n),A0(n.stateNode,n.type,n.memoizedProps),Re=o,Rt=a;break;case 5:he||st(n,t),zr(n);case 6:if(n.tag===6&&zr(n),o=Re,a=Rt,Re=null,hn(e,t,n),Re=o,Rt=a,Re!==null)if(Rt)try{(Re.nodeType===9?Re.body:Re.nodeName==="HTML"?Re.ownerDocument.body:Re).removeChild(n.stateNode),fe=!0}catch(i){ye(n,t,i)}else try{Re.removeChild(n.stateNode),fe=!0}catch(i){ye(n,t,i)}break;case 18:Re!==null&&(Rt?(e=Re,Sh(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),_i(e)):Sh(Re,n.stateNode));break;case 4:o=Re,a=Rt,Re=n.stateNode.containerInfo,Rt=!0,hn(e,t,n),Re=o,Rt=a;break;case 0:case 11:case 14:case 15:Go(2,n,t),he||Go(4,n,t),hn(e,t,n);break;case 1:he||(st(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"&&Rv(n,t,o)),hn(e,t,n);break;case 21:hn(e,t,n);break;case 22:he=(o=he)||n.memoizedState!==null,hn(e,t,n),he=o;break;case 30:st(n,t),hn(e,t,n);break;case 7:he||st(n,t),hn(e,t,n);break;default:hn(e,t,n)}}function Kv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{_i(e)}catch(n){ye(t,t.return,n)}}}function Xv(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{_i(e)}catch(n){ye(t,t.return,n)}}function TS(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ch),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ch),t;default:throw Error(N(435,e.tag))}}function Fl(e,t){var n=TS(e);t.forEach(function(o){if(!n.has(o)){n.add(o);var a=BS.bind(null,e,o);o.then(a,a)}})}function Ct(e,t,n){var o=t.deletions;if(o!==null)for(var a=0;a<o.length;a++){var i=o[a],r=e,l=t,c=l;e:for(;c!==null;){switch(c.tag){case 27:if(Po(c.type)){Re=c.stateNode,Rt=!1;break e}break;case 5:Re=c.stateNode,Rt=!1;break e;case 3:case 4:Re=c.stateNode.containerInfo,Rt=!0;break e}c=c.return}if(Re===null)throw Error(N(160));Vv(r,l,i),Re=null,Rt=!1,r=i.alternate,r!==null&&(r.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Gv(t,e,n),t=t.sibling}var vn=null;function Gv(e,t,n){var o=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(o=e.updateQueue,o=o!==null?o.events:null,o!==null))for(var i=0;i<o.length;i++){var r=o[i];r.ref.impl=r.nextImpl}Ct(t,e,n),Nt(e),a&4&&(Go(3,e,e.return),al(3,e),Go(5,e,e.return));break;case 1:Ct(t,e,n),Nt(e),a&512&&(he||o===null||st(o,o.return)),a&64&&nt&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(i=vn,Ct(t,e,n),Nt(e),a&512&&(he||o===null||st(o,o.return)),a&4)if(a=o!==null?o.memoizedState:null,n=e.memoizedState,o===null)if(n===null)if(e.stateNode===null)if(nt)e.stateNode=v0(e.type,e.memoizedProps,t.containerInfo,e);else{e:{t=e.type,n=e.memoizedProps,a=i.ownerDocument||i;t:switch(t){case"title":o=a.getElementsByTagName("title")[0],(!o||o[el]||o[ut]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(t),a.head.insertBefore(o,a.querySelector("head > title"))),mt(o,t,n),o[ut]=e,at(o),t=o;break e;case"link":if(i=Rh("link","href",a).get(t+(n.href||""))){for(r=0;r<i.length;r++)if(o=i[r],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){i.splice(r,1);break t}}o=a.createElement(t),mt(o,t,n),a.head.appendChild(o);break;case"meta":if(i=Rh("meta","content",a).get(t+(n.content||""))){for(r=0;r<i.length;r++)if(o=i[r],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){i.splice(r,1);break t}}o=a.createElement(t),mt(o,t,n),a.head.appendChild(o);break;default:throw Error(N(468,t))}o[ut]=e,at(o),t=o}e.stateNode=t}else nt||lf(i,e.type,e.stateNode);else e.stateNode=Oh(i,n,e.memoizedProps);else a!==n?(a===null?(t=o.stateNode,t===null||he||t.parentNode.removeChild(t)):a.count--,n===null?nt||lf(i,e.type,e.stateNode):Oh(i,n,e.memoizedProps)):n===null&&e.stateNode!==null&&Yu(e,e.memoizedProps,o.memoizedProps);break;case 27:Ct(t,e,n),Nt(e),a&512&&(he||o===null||st(o,o.return)),o!==null&&a&4&&Yu(e,e.memoizedProps,o.memoizedProps);break;case 5:if(i=Mn,Mn=!1,Ct(t,e,n),Mn=i,Nt(e),a&512&&(he||o===null||st(o,o.return)),e.flags&32){t=e.stateNode;try{Ei(t,""),fe=!0}catch(g){ye(e,e.return,g)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Yu(e,t,o!==null?o.memoizedProps:t)),a&1024&&(Ku=!0);break;case 6:if(Ct(t,e,n),Nt(e),a&4){if(e.stateNode===null)throw Error(N(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,fe=!0}catch(g){ye(e,e.return,g)}}break;case 3:if(fe=!1,yc=null,i=vn,vn=Qr(t.containerInfo),Ct(t,e,n),vn=i,Nt(e),a&4&&o!==null&&o.memoizedState.isDehydrated)try{_i(t.containerInfo)}catch(g){ye(e,e.return,g)}Ku&&(Ku=!1,Qv(e)),fe=!1;break;case 4:a=Mn,Mn=nt,o=mg(),i=vn,vn=Qr(e.stateNode.containerInfo),Ct(t,e,n),Nt(e),vn=i,fe&&xr&&(Kc=!0),fe=o,Mn=a;break;case 12:Ct(t,e,n),Nt(e);break;case 31:Ct(t,e,n),Nt(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Fl(e,t)));break;case 13:Ct(t,e,n),Nt(e),e.child.flags&8192&&e.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(fs=Qt()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Fl(e,t)));break;case 22:i=e.memoizedState!==null,r=o!==null&&o.memoizedState!==null;var l=nt,c=he,s=Mn;nt=l||i,Mn=s||i,he=c||r,Ct(t,e,n),he=c,Mn=s,nt=l,Nt(e),a&8192&&(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,!i||o===null||r||nt||he||(t=r||he,n=nt,o=he,nt=i||nt,he=t,ko(e,2),nt=n,he=o),!i&&Mn||Vd(e,i)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Fl(e,n))));break;case 19:Ct(t,e,n),Nt(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Fl(e,t)));break;case 30:a&512&&(he||o===null||st(o,o.return)),a=mg(),i=xr,r=(n&335544064)===n,l=e.memoizedProps,xr=r&&so(l.default,l.update)!=="none",Ct(t,e,n),Nt(e),r&&o!==null&&fe&&(e.flags|=4),xr=i,fe=a;break;case 21:break;case 7:a&512&&(he||o===null||st(o,o.return)),o&&o.stateNode!==null&&(o.stateNode._fragmentFiber=e);default:Ct(t,e,n),Nt(e)}}function Nt(e){var t=e.flags;if(t&2){try{for(var n,o=e.return;o!==null;){if(Dv(o)){n=o;break}o=o.return}o=null;for(var a=e.return;a!==null;){if(Zf(a)){var i=a.stateNode;o===null?o=[i]:o.push(i)}if(Qf(a))break;a=a.return}var r=o;if(n==null)throw Error(N(160));switch(n.tag){case 27:var l=n.stateNode,c=Vu(e);Yc(e,c,l,r);break;case 5:var s=n.stateNode;n.flags&32&&(Ei(s,""),n.flags&=-33);var g=Vu(e);Yc(e,g,s,r);break;case 3:case 4:var h=n.stateNode.containerInfo,f=Vu(e);Ld(e,f,h,r);break;default:throw Error(N(161))}}catch(p){ye(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Qv(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Qv(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,Di=!0,t.reset(),Di=!1),e=e.sibling}}function Ja(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Zv(t,e),t=t.sibling;else Uv(t,!1)}function Zv(e,t){var n=e.alternate;if(n===null)Bd(e,!1);else switch(e.tag){case 3:if(Yd=An=!1,lh(),Ja(t,e),!An&&!Kc){if(e=Rn,e!==null)for(var o=0;o<e.length;o+=3){n=e[o];var a=e[o+1];x0(n,e[o+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+a+")"})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Yd=!0}Rn=null;break;case 5:Ja(t,e);break;case 4:o=An,An=!1,Ja(t,e),An&&(Kc=!0),An=o;break;case 22:e.memoizedState===null&&(n.memoizedState!==null?Bd(e,!1):Ja(t,e));break;case 30:o=An,a=lh(),An=!1,Ja(t,e),An&&(e.flags|=4);var i=e.memoizedProps,r=e.stateNode;t=oo(i,r),r=oo(n.memoizedProps,r);var l=so(i.default,i.update);l==="none"?t=!1:(i=n.memoizedState,n.memoizedState=null,n=e.child,_t=0,t=Pf(e,n,t,r,l,i,!0),_t!==(i===null?0:i.length)&&(e.flags|=32)),(e.flags&4)!==0&&t?(Ni(e,e.memoizedProps.onUpdate),Rn=a):a!==null&&(a.push.apply(a,Rn),Rn=a),An=(e.flags&32)!==0?!0:o;break;default:Ja(t,e)}}function zn(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)jv(e,t.alternate,t),t=t.sibling}function ko(e,t){for(e=e.child;e!==null;){var n=e,o=t;switch(n.tag){case 0:case 11:case 14:case 15:Go(4,n,n.return),ko(n,o);break;case 1:st(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Rv(n,n.return,a),ko(n,o);break;case 27:(o&2)!==0&&A0(n.stateNode,n.type,n.memoizedProps);case 5:st(n,n.return),n.tag!==5&&n.tag!==27||zr(n),ko(n,o);break;case 6:zr(n);break;case 26:st(n,n.return),a=n.stateNode,n.memoizedState!==null||a===null||he||a.parentNode.removeChild(a),ko(n,o);break;case 22:n.memoizedState===null&&ko(n,o);break;case 30:st(n,n.return),ko(n,o);break;case 7:st(n,n.return);default:ko(n,o)}e=e.sibling}}function bn(e,t,n){for(n=(t.subtreeFlags&8772)!==0?n:n&-2,t=t.child;t!==null;){var o=t.alternate,a=e,i=t,r=i.flags,l=(n&1)!==0;switch(i.tag){case 0:case 11:case 15:bn(a,i,n),al(4,i);break;case 1:if(bn(a,i,n),o=i,a=o.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(g){ye(o,o.return,g)}if(o=i,a=o.updateQueue,a!==null){var c=o.stateNode;try{var s=a.shared.hiddenCallbacks;if(s!==null)for(a.shared.hiddenCallbacks=null,a=0;a<s.length;a++)qb(s[a],c)}catch(g){ye(o,o.return,g)}}l&&r&64&&Ov(i),On(i,i.return);break;case 27:(n&2)!==0&&_v(i);case 5:i.tag!==5&&i.tag!==27||ih(i),bn(a,i,n),l&&o===null&&r&4&&Hd(i),On(i,i.return);break;case 6:ih(i);break;case 26:c=i.stateNode,i.memoizedState!==null||c===null||nt||lf(Qr(c.ownerDocument),i.type,c),bn(a,i,n),l&&o===null&&r&4&&Hd(i),On(i,i.return);break;case 12:bn(a,i,n);break;case 31:bn(a,i,n),l&&r&4&&Kv(a,i);break;case 13:bn(a,i,n),l&&r&4&&Xv(a,i);break;case 22:i.memoizedState===null&&bn(a,i,n),On(i,i.return);break;case 30:bn(a,i,n),On(i,i.return);break;case 7:On(i,i.return);default:bn(a,i,n)}t=t.sibling}}function $f(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&nl(n))}function Jf(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&nl(e))}function tn(e,t,n,o){var a=(n&335544064)===n;if(t.subtreeFlags&(a?10262:10256))for(t=t.child;t!==null;)Pv(e,t,n,o),t=t.sibling;else a&&Bv(t)}function Pv(e,t,n,o){var a=(n&335544064)===n;a&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&gc(t);var i=t.flags;switch(t.tag){case 0:case 11:case 15:tn(e,t,n,o),i&2048&&al(9,t);break;case 1:tn(e,t,n,o);break;case 3:tn(e,t,n,o),a&&Yd&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),i&2048&&(i=null,t.alternate!==null&&(i=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==i&&(t.refCount++,i!=null&&nl(i)));break;case 12:if(i&2048){tn(e,t,n,o),i=t.stateNode;try{var r=t.memoizedProps,l=r.id,c=r.onPostCommit;typeof c=="function"&&c(l,t.alternate===null?"mount":"update",i.passiveEffectDuration,-0)}catch(s){ye(t,t.return,s)}}else tn(e,t,n,o);break;case 31:tn(e,t,n,o);break;case 13:tn(e,t,n,o);break;case 23:break;case 22:r=t.stateNode,l=t.alternate,t.memoizedState!==null?(a&&l!==null&&l.memoizedState===null&&gc(l),r._visibility&2?tn(e,t,n,o):Or(e,t)):(a&&l!==null&&l.memoizedState!==null&&gc(t),r._visibility&2?tn(e,t,n,o):(r._visibility|=2,Fa(e,t,n,o,(t.subtreeFlags&10256)!==0||!1))),i&2048&&$f(l,t);break;case 24:tn(e,t,n,o),i&2048&&Jf(t.alternate,t);break;case 30:a&&(i=t.alternate,i!==null&&(jn(i.child,!0),jn(t.child,!0))),tn(e,t,n,o);break;default:tn(e,t,n,o)}}function Fa(e,t,n,o,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var i=e,r=t,l=n,c=o,s=r.flags;switch(r.tag){case 0:case 11:case 15:Fa(i,r,l,c,a),al(8,r);break;case 23:break;case 22:var g=r.stateNode;r.memoizedState!==null?g._visibility&2?Fa(i,r,l,c,a):Or(i,r):(g._visibility|=2,Fa(i,r,l,c,a)),a&&s&2048&&$f(r.alternate,r);break;case 24:Fa(i,r,l,c,a),a&&s&2048&&Jf(r.alternate,r);break;default:Fa(i,r,l,c,a)}t=t.sibling}}function Or(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,o=t,a=o.flags;switch(o.tag){case 22:Or(n,o),a&2048&&$f(o.alternate,o);break;case 24:Or(n,o),a&2048&&Jf(o.alternate,o);break;default:Or(n,o)}t=t.sibling}}var sa=8192;function ra(e,t,n){if(e.subtreeFlags&sa)for(e=e.child;e!==null;)$v(e,t,n),e=e.sibling}function $v(e,t,n){switch(e.tag){case 26:ra(e,t,n),e.flags&sa&&(e.memoizedState!==null?AE(n,vn,e.memoizedState,e.memoizedProps):(e=e.stateNode,(t&335544128)===t&&_h(n,e)));break;case 5:ra(e,t,n),e.flags&sa&&(e=e.stateNode,(t&335544128)===t&&_h(n,e));break;case 3:case 4:var o=vn;vn=Qr(e.stateNode.containerInfo),ra(e,t,n),vn=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=sa,sa=16777216,ra(e,t,n),sa=o):ra(e,t,n));break;case 30:if((e.flags&sa)!==0&&(o=e.memoizedProps.name,o!=null&&o!=="auto")){var a=e.stateNode;a.paired=null,Xt===null&&(Xt=new Map),Xt.set(o,a)}ra(e,t,n);break;default:ra(e,t,n)}}function Jv(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function pr(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];ot=o,Fv(o,e)}Jv(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Iv(e),e=e.sibling}function Iv(e){switch(e.tag){case 0:case 11:case 15:pr(e),e.flags&2048&&Go(9,e,e.return);break;case 3:pr(e);break;case 12:pr(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,hc(e)):pr(e);break;default:pr(e)}}function hc(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var o=t[n];ot=o,Fv(o,e)}Jv(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Go(8,t,t.return),hc(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,hc(t));break;default:hc(t)}e=e.sibling}}function Fv(e,t){for(;ot!==null;){var n=ot;switch(n.tag){case 0:case 11:case 15:Go(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var o=n.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:nl(n.memoizedState.cache)}if(o=n.child,o!==null)o.return=n,ot=o;else e:for(n=e;ot!==null;){o=ot;var a=o.sibling,i=o.return;if(Yv(o),o===n){ot=null;break e}if(a!==null){a.return=i,ot=a;break e}ot=i}}}var CS={getCacheForType:function(e){var t=dt(Ze),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return dt(Ze).controller.signal}},NS=typeof WeakMap=="function"?WeakMap:Map,me=0,we=null,ie=null,le=0,be=0,Yt=null,Ao=!1,ji=!1,If=!1,lo=0,Ye=0,Qo=0,ha=0,Xc=0,Gt=0,Ci=0,Rr=null,Dt=null,Xd=!1,fs=0,Wv=0,Gc=1/0,Qc=null,Uo=null,He=0,xn=null,Ea=null,Un=0,Gd=0,Qd=null,e0=null,yi=null,xi=null,wi=null,Dr=0,bc=null;function $t(){return(me&2)!==0&&le!==0?le&-le:Q.T!==null?Wf():ab()}function t0(){if(Gt===0)if((le&536870912)===0||W){var e=jl;jl<<=1,(jl&3932160)===0&&(jl=262144),Gt=e}else Gt=536870912;return e=gt.current,e!==null&&(e.flags|=32),Gt}function Ni(e,t){if(t!=null){var n=e.stateNode,o=n.ref;o===null&&(o=n.ref=k0(oo(e.memoizedProps,n))),xi===null&&(xi=[]),xi.push(t.bind(null,o))}}function Lt(e,t,n){(e===we&&(be===2||be===9)||e.cancelPendingCommit!==null)&&(Mi(e,0),zo(e,le,Gt,!1)),Wr(e,n),((me&2)===0||e!==we)&&(e===we&&((me&2)===0&&(ha|=n),Ye===4&&zo(e,le,Gt,!1)),Yn(e))}function n0(e,t,n){if((me&6)!==0)throw Error(N(327));var o=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Fr(e,t),a=o?zS(e,t):Xu(e,t,!0),i=o;do{if(a===0){ji&&!o&&zo(e,t,0,!1);break}else{if(n=e.current.alternate,i&&!MS(n)){a=Xu(e,t,!1),i=!1;continue}if(a===2){if(i=t,e.errorRecoveryDisabledLanes&i)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;e:{var l=e;a=Rr;var c=l.current.memoizedState.isDehydrated;if(c&&(Mi(l,r).flags|=256),r=Xu(l,r,!1),r!==2&&r!==6){if(If&&!c){l.errorRecoveryDisabledLanes|=i,ha|=i,a=4;break e}i=Dt,Dt=a,i!==null&&(Dt===null?Dt=i:Dt.push.apply(Dt,i))}a=r}if(i=!1,a!==2)continue}}if(a===1){Mi(e,0),zo(e,t,0,!0);break}e:{switch(o=e,i=a,i){case 0:case 1:throw Error(N(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:zo(o,t,Gt,!Ao);break e;case 2:Dt=null;break;case 3:case 5:break;default:throw Error(N(329))}if((t&62914560)===t&&(a=fs+300-Qt(),10<a)){if(zo(o,t,Gt,!Ao),Fc(o,0,!0)!==0)break e;Un=t,o.timeoutHandle=tp(sh.bind(null,o,n,Dt,Qc,Xd,t,Gt,ha,Ci,Ao,i,"Throttled",-0,0),a);break e}sh(o,n,Dt,Qc,Xd,t,Gt,ha,Ci,Ao,i,null,-0,0)}}break}while(!0);Yn(e)}function sh(e,t,n,o,a,i,r,l,c,s,g,h,f,p){e.timeoutHandle=-1;var x=t.subtreeFlags,w=(i&335544064)===i;if(h=null,(w||x&8192||(x&16785408)===16785408)&&(h={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:_n},Xt=null,$v(t,i,h),w&&(x=h,w=e.containerInfo,w=(w.nodeType===9?w:w.ownerDocument).__reactViewTransition,w!=null&&(x.count++,x.waitingForViewTransition=!0,x=Zr.bind(x),w.finished.then(x,x))),x=(i&62914560)===i?fs-Qt():(i&4194048)===i?Wv-Qt():0,x=zE(h,x),x!==null)){Un=i,e.cancelPendingCommit=x(dh.bind(null,e,t,i,n,o,a,r,l,c,s,g,h,null,f,p)),zo(e,i,r,!s);return}dh(e,t,i,n,o,a,r,l,c,s,g,h)}function MS(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var o=0;o<n.length;o++){var a=n[o],i=a.getSnapshot;a=a.value;try{if(!Jt(i(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function zo(e,t,n,o){t=Wh(e,t),t&=~Xc,t&=~ha,e.suspendedLanes|=t,e.pingedLanes&=~t,o&&(e.warmLanes|=t),o=e.expirationTimes;for(var a=t;0<a;){var i=31-Pt(a),r=1<<i;o[i]=-1,a&=~r}n!==0&&tb(e,n,t)}function ps(){return(me&6)===0?(il(0,!1),!1):!0}function Ff(){if(ie!==null){if(be===0)var e=ie.return;else e=ie,Wn=Aa=null,Hf(e),hi=null,qr=0,e=ie;for(;e!==null;)zv(e.alternate,e),e=e.return;ie=null}}function Mi(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,JS(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Un=0,Ff(),we=e,ie=n=eo(e.current,null),le=t,be=0,Yt=null,Ao=!1,ji=Fr(e,t),If=!1,Ci=Gt=Xc=ha=Qo=Ye=0,Dt=Rr=null,Xd=!1,lo=Wh(e,t),os(),n}function o0(e,t){J=null,Q.H=Uc,t===Bi||t===rs?(t=Lg(),be=3):t===Nf?(t=Lg(),be=4):be=t===Kf?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Yt=t,ie===null&&(Ye=1,jc(e,ln(t,e.current)))}function a0(){var e=gt.current;return e===null?!0:(le&4194048)===le?wt===null:(le&62914560)===le||(le&536870912)!==0?e===wt:!1}function i0(){var e=Q.H;return Q.H=Uc,e===null?Uc:e}function r0(){var e=Q.A;return Q.A=CS,e}function Zc(){Ye=4,Ao||(le&4194048)!==le&&gt.current!==null||(ji=!0),(Qo&134217727)===0&&(ha&134217727)===0||we===null||zo(we,le,Gt,!1)}function Xu(e,t,n){var o=me;me|=2;var a=i0(),i=r0();(we!==e||le!==t)&&(Qc=null,Mi(e,t)),t=!1;var r=Ye;e:do try{if(be!==0&&ie!==null){var l=ie,c=Yt;switch(be){case 8:Ff(),r=6;break e;case 3:case 2:case 9:case 6:gt.current===null&&(t=!0);var s=be;if(be=0,Yt=null,di(e,l,c,s),n&&ji){r=0;break e}break;default:s=be,be=0,Yt=null,di(e,l,c,s)}}AS(),r=Ye;break}catch(g){o0(e,g)}while(!0);return t&&e.shellSuspendCounter++,Wn=Aa=null,me=o,Q.H=a,Q.A=i,ie===null&&(we=null,le=0,os()),r}function AS(){for(;ie!==null;)l0(ie)}function zS(e,t){var n=me;me|=2;var o=i0(),a=r0();we!==e||le!==t?(Qc=null,Gc=Qt()+500,Mi(e,t)):ji=Fr(e,t);e:do try{if(be!==0&&ie!==null){t=ie;var i=Yt;t:switch(be){case 1:be=0,Yt=null,di(e,t,i,1);break;case 2:case 9:if(Hg(i)){be=0,Yt=null,uh(t);break}t=function(){be!==2&&be!==9||we!==e||(be=7),Yn(e)},i.then(t,t);break e;case 3:be=7;break e;case 4:be=5;break e;case 7:Hg(i)?(be=0,Yt=null,uh(t)):(be=0,Yt=null,di(e,t,i,7));break;case 5:var r=null;switch(ie.tag){case 26:r=ie.memoizedState;case 5:case 27:var l=ie;if(r?R0(r):l.stateNode.complete){be=0,Yt=null;var c=l.sibling;if(c!==null)ie=c;else{var s=l.return;s!==null?(ie=s,ms(s)):ie=null}break t}}be=0,Yt=null,di(e,t,i,5);break;case 6:be=0,Yt=null,di(e,t,i,6);break;case 8:Ff(),Ye=6;break e;default:throw Error(N(462))}}OS();break}catch(g){o0(e,g)}while(!0);return Wn=Aa=null,Q.H=o,Q.A=a,me=n,ie!==null?0:(we=null,le=0,os(),Ye)}function OS(){for(;ie!==null&&!Pw();)l0(ie)}function l0(e){var t=Av(e.alternate,e,lo);e.memoizedProps=e.pendingProps,t===null?ms(e):ie=t}function uh(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Fg(n,t,t.pendingProps,t.type,void 0,le);break;case 11:t=Fg(n,t,t.pendingProps,t.type.render,t.ref,le);break;case 5:Hf(t);var o=t;o===it&&(W?(Oc(o),o.tag===5&&o.stateNode!=null&&(Ce=o.stateNode)):(Oc(o),W=!0));default:zv(n,t),t=ie=Ob(t,lo),t=Av(n,t,lo)}e.memoizedProps=e.pendingProps,t===null?ms(e):ie=t}function di(e,t,n,o){Wn=Aa=null,Hf(t),hi=null,qr=0;var a=t.return;try{if(vS(e,a,t,n,le)){Ye=1,jc(e,ln(n,e.current)),ie=null;return}}catch(i){if(a!==null)throw ie=a,i;Ye=1,jc(e,ln(n,e.current)),ie=null;return}t.flags&32768?(W||o===1?e=!0:ji||(le&536870912)!==0?e=!1:(Ao=e=!0,(o===2||o===9||o===3||o===6)&&(o=gt.current,o!==null&&o.tag===13&&(o.flags|=16384))),c0(t,e)):ms(t)}function ms(e){var t=e;do{if((t.flags&32768)!==0){c0(t,Ao);return}e=t.return;var n=kS(t.alternate,t,lo);if(n!==null){ie=n;return}if(t=t.sibling,t!==null){ie=t;return}ie=t=e}while(t!==null);Ye===0&&(Ye=5)}function c0(e,t){do{var n=SS(e.alternate,e);if(n!==null){n.flags&=32767,ie=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){ie=e;return}ie=e=n}while(e!==null);Ye=6,ie=null}function dh(e,t,n,o,a,i,r,l,c,s,g,h){e.cancelPendingCommit=null;do gs();while(He!==0);if((me&6)!==0)throw Error(N(327));if(t!==null){if(t===e.current)throw Error(N(177));e===we&&(ie=we=null,le=0),Ea=t,xn=e,Un=n,Qd=a,e0=o,RS(e,t,n,r,l,c,h)}}function RS(e,t,n,o,a,i,r){var l=t.lanes|t.childLanes;if(Gd=l,l|=wf,ak(e,n,l,o,a,i),xi=null,(n&335544064)===n?(wi=rS(e),o=10262):(wi=null,o=10256),(t.subtreeFlags&o)!==0||(t.flags&o)!==0?(e.callbackNode=null,e.callbackPriority=0,US(Cc,function(){return Jd(),null})):(e.callbackNode=null,e.callbackPriority=0),Vc=!1,o=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||o){o=Q.T,Q.T=null,a=ge.p,ge.p=2,i=me,me|=4;try{ES(e,t,n)}finally{me=i,ge.p=a,Q.T=o}}He=1,Vc?yi=nE(r,e.containerInfo,wi,Zd,Pd,_S,$d,Jd,DS,null,null):(Zd(),Pd(),$d())}function DS(e){if(He!==0){var t=xn.onRecoverableError;t(e,{componentStack:null})}}function _S(){He===3&&(He=0,Zv(Ea,xn),He=4)}function Zd(){if(He===1){He=0;var e=xn,t=Ea,n=Un,o=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||o){o=Q.T,Q.T=null;var a=ge.p;ge.p=2;var i=me;me|=4;try{xr=Kc=!1,Gv(t,e,n),n=ef;var r=Sb(e.containerInfo),l=n.focusedElem,c=n.selectionRange;if(r!==l&&l&&l.ownerDocument&&kb(l.ownerDocument.documentElement,l)){if(c!==null&&xf(l)){var s=c.start,g=c.end;if(g===void 0&&(g=s),"selectionStart"in l)l.selectionStart=s,l.selectionEnd=Math.min(g,l.value.length);else{var h=l.ownerDocument||document,f=h&&h.defaultView||window;if(f.getSelection){var p=f.getSelection(),x=l.textContent.length,w=Math.min(c.start,x),T=c.end===void 0?w:Math.min(c.end,x);!p.extend&&w>T&&(r=T,T=w,w=r);var m=Ng(l,w),u=Ng(l,T);if(m&&u&&(p.rangeCount!==1||p.anchorNode!==m.node||p.anchorOffset!==m.offset||p.focusNode!==u.node||p.focusOffset!==u.offset)){var d=h.createRange();d.setStart(m.node,m.offset),p.removeAllRanges(),w>T?(p.addRange(d),p.extend(u.node,u.offset)):(d.setEnd(u.node,u.offset),p.addRange(d))}}}}for(h=[],p=l;p=p.parentNode;)p.nodeType===1&&h.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof l.focus=="function"&&l.focus(),l=0;l<h.length;l++){var b=h[l];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}Di=!!Wd,ef=Wd=null}finally{me=i,ge.p=a,Q.T=o}}e.current=t,He=2}}function Pd(){if(He===2){He=0;var e=xn,t=Ea,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=Q.T,Q.T=null;var o=ge.p;ge.p=2;var a=me;me|=4;try{jv(e,t.alternate,t)}finally{me=a,ge.p=o,Q.T=n}}He=3}}function $d(){if(He===4||He===3){He=0;var e=yi;yi=null,$w();var t=xn,n=Ea,o=Un,a=e0,i=(o&335544064)===o?10262:10256;if((n.subtreeFlags&i)!==0||(n.flags&i)!==0?He=5:(He=0,Ea=xn=null,s0(t,t.pendingLanes)),i=t.pendingLanes,i===0&&(Uo=null),mf(o),n=n.stateNode,Zt&&typeof Zt.onCommitFiberRoot=="function")try{Zt.onCommitFiberRoot(Ir,n,void 0,(n.current.flags&128)===128)}catch{}if(a!==null){n=Q.T,i=ge.p,ge.p=2,Q.T=null;try{for(var r=t.onRecoverableError,l=0;l<a.length;l++){var c=a[l];r(c.value,{componentStack:c.stack})}}finally{Q.T=n,ge.p=i}}if(a=xi,r=wi,wi=null,a!==null&&(xi=null,r===null&&(r=[]),e!==null))for(c=0;c<a.length;c++)n=(0,a[c])(r),n!==void 0&&e.finished.finally(n);(Un&3)!==0&&gs(),Yn(t),i=t.pendingLanes,(o&261930)!==0&&(i&42)!==0?t===bc?Dr++:(Dr=0,bc=t):(Dr=0,bc=null),il(0,!1)}}function s0(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,nl(t)))}function gs(){return yi!==null&&(yi.skipTransition(),yi=null),Zd(),Pd(),$d(),Jd()}function Jd(){if(He!==5)return!1;var e=xn,t=Gd;Gd=0;var n=mf(Un),o=Q.T,a=ge.p;try{ge.p=32>n?32:n,Q.T=null,n=Qd,Qd=null;var i=xn,r=Un;if(He=0,Ea=xn=null,Un=0,(me&6)!==0)throw Error(N(331));var l=me;if(me|=4,Iv(i.current),Pv(i,i.current,r,n),me=l,il(0,!1),Zt&&typeof Zt.onPostCommitFiberRoot=="function")try{Zt.onPostCommitFiberRoot(Ir,i)}catch{}return!0}finally{ge.p=a,Q.T=o,s0(e,t)}}function fh(e,t,n){t=ln(n,t),t=Ad(e.stateNode,t,2),e=Ho(e,t,2),e!==null&&(Wr(e,2),Yn(e))}function ye(e,t,n){if(e.tag===3)fh(e,e,n);else for(;t!==null;){if(t.tag===3){fh(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Uo===null||!Uo.has(o))){e=ln(n,e),n=Ev(2),o=Ho(t,n,2),o!==null&&(Tv(n,o,t,e),Wr(o,2),Yn(o));break}}t=t.return}}function Gu(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new NS;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(n)||(If=!0,a.add(n),e=HS.bind(null,e,t,n),t.then(e,e))}function HS(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,we===e&&(le&n)===n&&((Ye===4||Ye===3&&(le&62914560)===le&&300>Qt()-fs)&&(me&2)===0?Mi(e,0):Xc|=n,Ci===le&&(Ci=0)),Yn(e)}function u0(e,t){t===0&&(t=eb()),e=Ma(e,t),e!==null&&(Wr(e,t),Yn(e))}function LS(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),u0(e,n)}function BS(e,t){var n=0;switch(e.tag){case 31:case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(N(314))}o!==null&&o.delete(t),u0(e,n)}function US(e,t){return ff(e,t)}var Ai=null,Wa=null,Id=!1,Pc=!1,Qu=!1,Oo=0;function Yn(e){e!==Wa&&e.next===null&&(Wa===null?Ai=Wa=e:Wa=Wa.next=e),Pc=!0,Id||(Id=!0,qS())}function il(e,t){if(!Qu&&Pc){Qu=!0;do for(var n=!1,o=Ai;o!==null;){if(!t)if(e!==0){var a=o.pendingLanes;if(a===0)var i=0;else{var r=o.suspendedLanes,l=o.pingedLanes;i=(1<<31-Pt(42|e)+1)-1,i&=a&~(r&~l),i=i&201326741?i&201326741|1:i?i|2:0}i!==0&&(n=!0,ph(o,i))}else i=le,i=Fc(o,o===we?i:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(i&3)===0||Fr(o,i)||(n=!0,ph(o,i));o=o.next}while(n);Qu=!1}}function jS(){d0()}function d0(){Pc=Id=!1;var e=0;Oo!==0&&$S()&&(e=Oo);for(var t=Qt(),n=null,o=Ai;o!==null;){var a=o.next,i=f0(o,t);i===0?(o.next=null,n===null?Ai=a:n.next=a,a===null&&(Wa=n)):(n=o,(e!==0||(i&3)!==0)&&(Pc=!0)),o=a}He!==0&&He!==5||il(e,!1),Oo!==0&&(Oo=0)}function f0(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,i=e.pendingLanes&-62914561;0<i;){var r=31-Pt(i),l=1<<r,c=a[r];c===-1?((l&n)===0||(l&o)!==0)&&(a[r]=ok(l,t)):c<=t&&(e.expiredLanes|=l),i&=~l}if(t=we,n=le,n=Fc(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,n===0||e===t&&(be===2||be===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&Eu(o),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Fr(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(o!==null&&Eu(o),mf(n)){case 2:case 8:n=Ih;break;case 32:n=Cc;break;case 268435456:n=Fh;break;default:n=Cc}return o=p0.bind(null,e),n=ff(n,o),e.callbackPriority=t,e.callbackNode=n,t}return o!==null&&o!==null&&Eu(o),e.callbackPriority=2,e.callbackNode=null,2}function p0(e,t){if(He!==0&&He!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(gs()&&e.callbackNode!==n)return null;var o=le;return o=Fc(e,e===we?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(n0(e,o,t),f0(e,Qt()),e.callbackNode!=null&&e.callbackNode===n?p0.bind(null,e):null)}function ph(e,t){if(gs())return null;n0(e,t,!0)}function qS(){IS(function(){(me&6)!==0?ff(Jh,jS):d0()})}function Wf(){if(Oo===0){var e=xa;e===0&&(e=Ul,Ul<<=1,(Ul&261888)===0&&(Ul=256)),Oo=e}return Oo}function mh(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:ic(e)}function YS(e,t,n,o,a){if(t==="submit"&&n&&n.stateNode===a){var i=mh((a[Ut]||null).action),r=o.submitter;r&&(t=(t=r[Ut]||null)?mh(t.formAction):r.getAttribute("formAction"),t!==null&&(i=t,r=null));var l=new es("action","action",null,o,a);e.push({event:l,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(Oo!==0){var c=new FormData(a,r);Nd(n,{pending:!0,data:c,method:a.method,action:i},null,c)}}else typeof i=="function"&&(l.preventDefault(),c=new FormData(a,r),Nd(n,{pending:!0,data:c,method:a.method,action:i},i,c))},currentTarget:a}]})}}for(Wl=0;Wl<hd.length;Wl++)ec=hd[Wl],gh=ec.toLowerCase(),hh=ec[0].toUpperCase()+ec.slice(1),wn(gh,"on"+hh);var ec,gh,hh,Wl;wn(Tb,"onAnimationEnd");wn(Cb,"onAnimationIteration");wn(Nb,"onAnimationStart");wn("dblclick","onDoubleClick");wn("focusin","onFocus");wn("focusout","onBlur");wn(Fk,"onTransitionRun");wn(Wk,"onTransitionStart");wn(eS,"onTransitionCancel");wn(Mb,"onTransitionEnd");Si("onMouseEnter",["mouseout","mouseover"]);Si("onMouseLeave",["mouseout","mouseover"]);Si("onPointerEnter",["pointerout","pointerover"]);Si("onPointerLeave",["pointerout","pointerover"]);Ca("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ca("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ca("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ca("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ca("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ca("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Kr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),VS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Kr));function m0(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],a=o.event;o=o.listeners;e:{var i=void 0;if(t)for(var r=o.length-1;0<=r;r--){var l=o[r],c=l.instance,s=l.currentTarget;if(l=l.listener,c!==i&&a.isPropagationStopped())break e;i=l,a.currentTarget=s;try{i(a)}catch(g){Mc(g)}a.currentTarget=null,i=c}else for(r=0;r<o.length;r++){if(l=o[r],c=l.instance,s=l.currentTarget,l=l.listener,c!==i&&a.isPropagationStopped())break e;i=l,a.currentTarget=s;try{i(a)}catch(g){Mc(g)}a.currentTarget=null,i=c}}}}function ae(e,t){var n=t[ug];n===void 0&&(n=t[ug]=new Set);var o=e+"__bubble";n.has(o)||(g0(t,e,2,!1),n.add(o))}function Zu(e,t,n){var o=0;t&&(o|=4),g0(n,e,o,t)}var tc="_reactListening"+Math.random().toString(36).slice(2);function ep(e){if(!e[tc]){e[tc]=!0,rb.forEach(function(n){n!=="selectionchange"&&(VS.has(n)||Zu(n,!1,e),Zu(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[tc]||(t[tc]=!0,Zu("selectionchange",!1,t))}}function g0(e,t,n,o){switch(j0(t)){case 2:var a=_E;break;case 8:a=HE;break;default:a=lp}n=a.bind(null,t,n,e),a=void 0,!fd||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function Pu(e,t,n,o,a){var i=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var r=o.tag;if(r===3||r===4){var l=o.stateNode.containerInfo;if(l===a)break;if(r===4)for(r=o.return;r!==null;){var c=r.tag;if((c===3||c===4)&&r.stateNode.containerInfo===a)return;r=r.return}for(;l!==null;){if(r=ua(l),r===null)return;if(c=r.tag,c===5||c===6||c===26||c===27){o=i=r;continue e}l=l.parentNode}}o=o.return}mb(function(){var s=i,g=hf(n),h=[];e:{var f=Ab.get(e);if(f!==void 0){var p=es,x=e;switch(e){case"keypress":if(lc(n)===0)break e;case"keydown":case"keyup":p=Mk;break;case"focusin":x="focus",p=zu;break;case"focusout":x="blur",p=zu;break;case"beforeblur":case"afterblur":p=zu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=vg;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=hk;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Dk;break;case Tb:case Cb:case Nb:p=yk;break;case Mb:p=Hk;break;case"scroll":case"scrollend":p=mk;break;case"wheel":p=Bk;break;case"copy":case"cut":case"paste":p=wk;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=xg;break;case"submit":p=Ok;break;case"toggle":case"beforetoggle":p=jk}var w=(t&4)!==0,T=!w&&(e==="scroll"||e==="scrollend"),m=w?f!==null?f+"Capture":null:f;w=[];for(var u=s,d;u!==null;){var b=u;if(d=b.stateNode,b=b.tag,b!==5&&b!==26&&b!==27||d===null||m===null||(b=Hr(u,m),b!=null&&w.push(Xr(u,b,d))),T)break;u=u.return}0<w.length&&(f=new p(f,x,null,n,g),h.push({event:f,listeners:w}))}}if((t&7)===0){e:{if(p=e==="mouseover"||e==="pointerover",f=e==="mouseout"||e==="pointerout",p&&n!==dd&&(x=n.relatedTarget||n.fromElement)&&(ua(x)||x[Hi]))break e;(f||p)&&(x=g.window===g?g:(p=g.ownerDocument)?p.defaultView||p.parentWindow:window,f?(p=n.relatedTarget||n.toElement,f=s,p=p?ua(p):null,p!==null&&(T=Jr(p),w=p.tag,p!==T||w!==5&&w!==27&&w!==6)&&(p=null)):(f=null,p=s),f!==p&&(w=vg,b="onMouseLeave",m="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(w=xg,b="onPointerLeave",m="onPointerEnter",u="pointer"),T=f==null?x:vr(f),d=p==null?x:vr(p),x=new w(b,u+"leave",f,n,g),x.target=T,x.relatedTarget=d,b=null,ua(g)===s&&(w=new w(m,u+"enter",p,n,g),w.target=d,w.relatedTarget=T,b=w),T=b,w=f&&p?Wu(f,p,KS):null,f!==null&&bh(h,x,f,w,!1),p!==null&&T!==null&&bh(h,T,p,w,!0)))}e:{if(f=s?vr(s):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var v=Eg;else if(Sg(f))if(xb)v=$k;else{v=Zk;var E=Qk}else p=f.nodeName,!p||p.toLowerCase()!=="input"||f.type!=="checkbox"&&f.type!=="radio"?s&&gf(s.elementType)&&(v=Eg):v=Pk;if(v&&(v=v(e,s))){yb(h,v,n,g);break e}E&&E(e,f,s)}switch(E=s?vr(s):window,e){case"focusin":(Sg(E)||E.contentEditable==="true")&&(ii=E,md=s,Sr=null);break;case"focusout":Sr=md=ii=null;break;case"mousedown":gd=!0;break;case"contextmenu":case"mouseup":case"dragend":gd=!1,Mg(h,n,g);break;case"selectionchange":if(Ik)break;case"keydown":case"keyup":Mg(h,n,g)}var k;if(yf)e:{switch(e){case"compositionstart":var S="onCompositionStart";break e;case"compositionend":S="onCompositionEnd";break e;case"compositionupdate":S="onCompositionUpdate";break e}S=void 0}else ai?bb(e,n)&&(S="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(S="onCompositionStart");S&&(hb&&n.locale!=="ko"&&(ai||S!=="onCompositionStart"?S==="onCompositionEnd"&&ai&&(k=gb()):(No=g,bf="value"in No?No.value:No.textContent,ai=!0)),E=$c(s,S),0<E.length&&(S=new yg(S,e,null,n,g),h.push({event:S,listeners:E}),k?S.data=k:(k=vb(n),k!==null&&(S.data=k)))),(k=Yk?Vk(e,n):Kk(e,n))&&(S=$c(s,"onBeforeInput"),0<S.length&&(E=new yg("onBeforeInput","beforeinput",null,n,g),h.push({event:E,listeners:S}),E.data=k)),YS(h,e,s,n,g)}m0(h,t)})}function Xr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function $c(e,t){for(var n=t+"Capture",o=[];e!==null;){var a=e,i=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||i===null||(a=Hr(e,n),a!=null&&o.unshift(Xr(e,a,i)),a=Hr(e,t),a!=null&&o.push(Xr(e,a,i))),e.tag===3)return o;e=e.return}return[]}function KS(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function bh(e,t,n,o,a){for(var i=t._reactName,r=[];n!==null&&n!==o;){var l=n,c=l.alternate,s=l.stateNode;if(l=l.tag,c!==null&&c===o)break;l!==5&&l!==26&&l!==27||s===null||(c=s,a?(s=Hr(n,i),s!=null&&r.unshift(Xr(n,s,c))):a||(s=Hr(n,i),s!=null&&r.push(Xr(n,s,c)))),n=n.return}r.length!==0&&e.push({event:t,listeners:r})}var XS=/\r\n?/g,GS=/\u0000|\uFFFD/g;function vh(e){return(typeof e=="string"?e:""+e).replace(XS,`
`).replace(GS,"")}function h0(e,t){return t=vh(t),vh(e)===t}function ve(e,t,n,o,a,i){switch(n){case"children":if(typeof o=="string")t==="body"||t==="textarea"&&o===""||Ei(e,o);else if(typeof o=="number"||typeof o=="bigint")t!=="body"&&Ei(e,""+o);else return;break;case"className":Yl(e,"class",o);break;case"tabIndex":Yl(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":Yl(e,n,o);break;case"style":pb(e,o,i);return;case"data":if(t!=="object"){Yl(e,"data",o);break}case"src":case"href":if(o===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=ic(o),e.setAttribute(n,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof i=="function"&&(n==="formAction"?(t!=="input"&&ve(e,t,"name",a.name,a,null),ve(e,t,"formEncType",a.formEncType,a,null),ve(e,t,"formMethod",a.formMethod,a,null),ve(e,t,"formTarget",a.formTarget,a,null)):(ve(e,t,"encType",a.encType,a,null),ve(e,t,"method",a.method,a,null),ve(e,t,"target",a.target,a,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(n);break}o=ic(o),e.setAttribute(n,o);break;case"onClick":o!=null&&(e.onclick=_n);return;case"onScroll":o!=null&&ae("scroll",e);return;case"onScrollEnd":o!=null&&ae("scrollend",e);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(N(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(N(60));i?.__html!==n&&(e.innerHTML=n)}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}n=ic(o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":o===!0?e.setAttribute(n,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(n,o):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(n,o):e.removeAttribute(n);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(n):e.setAttribute(n,o);break;case"popover":ae("beforetoggle",e),ae("toggle",e),ac(e,"popover",o);break;case"xlinkActuate":Jn(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":Jn(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":Jn(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":Jn(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":Jn(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":Jn(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":Jn(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":Jn(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":Jn(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":ac(e,"is",o);break;case"innerText":case"textContent":return;default:if(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")n=fk.get(n)||n,ac(e,n,o);else return}fe=!0}function Fd(e,t,n,o,a,i){switch(n){case"style":pb(e,o,i);return;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(N(61));if(n=o.__html,n!=null){if(a.children!=null)throw Error(N(60));i?.__html!==n&&(e.innerHTML=n)}}break;case"children":if(typeof o=="string")Ei(e,o);else if(typeof o=="number"||typeof o=="bigint")Ei(e,""+o);else return;break;case"onScroll":o!=null&&ae("scroll",e);return;case"onScrollEnd":o!=null&&ae("scrollend",e);return;case"onClick":o!=null&&(e.onclick=_n);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!lb.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),i=n.slice(2,a?n.length-7:void 0),t=e[Ut]||null,t=t!=null?t[n]:null,typeof t=="function"&&e.removeEventListener(i,t,a),typeof o=="function")){typeof t!="function"&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(i,o,a);break e}fe=!0,n in e?e[n]=o:o===!0?e.setAttribute(n,""):ac(e,n,o)}return}fe=!0}function mt(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":ae("error",e),ae("load",e);var o=!1,a=!1,i;for(i in n)if(n.hasOwnProperty(i)){var r=n[i];if(r!=null)switch(i){case"src":o=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(N(137,t));default:ve(e,t,i,r,n,null)}}a&&ve(e,t,"srcSet",n.srcSet,n,null),o&&ve(e,t,"src",n.src,n,null);return;case"input":ae("invalid",e);var l=i=r=a=null,c=null,s=null;for(o in n)if(n.hasOwnProperty(o)){var g=n[o];if(g!=null)switch(o){case"name":a=g;break;case"type":r=g;break;case"checked":c=g;break;case"defaultChecked":s=g;break;case"value":i=g;break;case"defaultValue":l=g;break;case"children":case"dangerouslySetInnerHTML":if(g!=null)throw Error(N(137,t));break;default:ve(e,t,o,g,n,null)}}ub(e,i,l,c,s,r,a,!1);return;case"select":ae("invalid",e),o=r=i=null;for(a in n)if(n.hasOwnProperty(a)&&(l=n[a],l!=null))switch(a){case"value":i=l;break;case"defaultValue":r=l;break;case"multiple":o=l;default:ve(e,t,a,l,n,null)}t=i,n=r,e.multiple=!!o,t!=null?pi(e,!!o,t,!1):n!=null&&pi(e,!!o,n,!0);return;case"textarea":ae("invalid",e),i=a=o=null;for(r in n)if(n.hasOwnProperty(r)&&(l=n[r],l!=null))switch(r){case"value":o=l;break;case"defaultValue":a=l;break;case"children":i=l;break;case"dangerouslySetInnerHTML":if(l!=null)throw Error(N(91));break;default:ve(e,t,r,l,n,null)}fb(e,o,a,i);return;case"option":for(c in n)n.hasOwnProperty(c)&&(o=n[c],o!=null)&&(c==="selected"?e.selected=o&&typeof o!="function"&&typeof o!="symbol":ve(e,t,c,o,n,null));return;case"dialog":ae("beforetoggle",e),ae("toggle",e),ae("cancel",e),ae("close",e);break;case"iframe":case"object":ae("load",e);break;case"video":case"audio":for(o=0;o<Kr.length;o++)ae(Kr[o],e);break;case"image":ae("error",e),ae("load",e);break;case"details":ae("toggle",e);break;case"embed":case"source":case"link":ae("error",e),ae("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(s in n)if(n.hasOwnProperty(s)&&(o=n[s],o!=null))switch(s){case"children":case"dangerouslySetInnerHTML":throw Error(N(137,t));default:ve(e,t,s,o,n,null)}return;default:if(gf(t)){for(g in n)n.hasOwnProperty(g)&&(o=n[g],o!==void 0&&Fd(e,t,g,o,n,void 0));return}}for(l in n)n.hasOwnProperty(l)&&(o=n[l],o!=null&&ve(e,t,l,o,n,null))}var QS={};function ZS(e,t,n,o){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,i=null,r=null,l=null,c=null,s=null,g=null;for(p in n){var h=n[p];if(n.hasOwnProperty(p)&&h!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":c=h;default:o.hasOwnProperty(p)||ve(e,t,p,null,o,h)}}for(var f in o){var p=o[f];if(h=n[f],o.hasOwnProperty(f)&&(p!=null||h!=null))switch(f){case"type":p!==h&&(fe=!0),i=p;break;case"name":p!==h&&(fe=!0),a=p;break;case"checked":p!==h&&(fe=!0),s=p;break;case"defaultChecked":p!==h&&(fe=!0),g=p;break;case"value":p!==h&&(fe=!0),r=p;break;case"defaultValue":p!==h&&(fe=!0),l=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(N(137,t));break;default:p!==h&&ve(e,t,f,p,o,h)}}ud(e,r,l,c,s,g,i,a);return;case"select":p=r=l=f=null;for(i in n)if(c=n[i],n.hasOwnProperty(i)&&c!=null)switch(i){case"value":break;case"multiple":p=c;default:o.hasOwnProperty(i)||ve(e,t,i,null,o,c)}for(a in o)if(i=o[a],c=n[a],o.hasOwnProperty(a)&&(i!=null||c!=null))switch(a){case"value":i!==c&&(fe=!0),f=i;break;case"defaultValue":i!==c&&(fe=!0),l=i;break;case"multiple":i!==c&&(fe=!0),r=i;default:i!==c&&ve(e,t,a,i,o,c)}t=l,n=r,o=p,f!=null?pi(e,!!n,f,!1):!!o!=!!n&&(t!=null?pi(e,!!n,t,!0):pi(e,!!n,n?[]:"",!1));return;case"textarea":p=f=null;for(l in n)if(a=n[l],n.hasOwnProperty(l)&&a!=null&&!o.hasOwnProperty(l))switch(l){case"value":break;case"children":break;default:ve(e,t,l,null,o,a)}for(r in o)if(a=o[r],i=n[r],o.hasOwnProperty(r)&&(a!=null||i!=null))switch(r){case"value":a!==i&&(fe=!0),f=a;break;case"defaultValue":a!==i&&(fe=!0),p=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(N(91));break;default:a!==i&&ve(e,t,r,a,o,i)}db(e,f,p);return;case"option":for(var x in n)f=n[x],n.hasOwnProperty(x)&&f!=null&&!o.hasOwnProperty(x)&&(x==="selected"?e.selected=!1:ve(e,t,x,null,o,f));for(c in o)f=o[c],p=n[c],o.hasOwnProperty(c)&&f!==p&&(f!=null||p!=null)&&(c==="selected"?(f!==p&&(fe=!0),e.selected=f&&typeof f!="function"&&typeof f!="symbol"):ve(e,t,c,f,o,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var w in n)f=n[w],n.hasOwnProperty(w)&&f!=null&&!o.hasOwnProperty(w)&&ve(e,t,w,null,o,f);for(s in o)if(f=o[s],p=n[s],o.hasOwnProperty(s)&&f!==p&&(f!=null||p!=null))switch(s){case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(N(137,t));break;default:ve(e,t,s,f,o,p)}return;default:if(gf(t)){for(var T in n)f=n[T],n.hasOwnProperty(T)&&f!==void 0&&!o.hasOwnProperty(T)&&Fd(e,t,T,void 0,o,f);for(g in o)f=o[g],p=n[g],!o.hasOwnProperty(g)||f===p||f===void 0&&p===void 0||Fd(e,t,g,f,o,p);return}}for(var m in n)f=n[m],n.hasOwnProperty(m)&&f!=null&&!o.hasOwnProperty(m)&&ve(e,t,m,null,o,f);for(h in o)f=o[h],p=n[h],!o.hasOwnProperty(h)||f===p||f==null&&p==null||ve(e,t,h,f,o,p)}function yh(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function PS(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),o=0;o<n.length;o++){var a=n[o],i=a.transferSize,r=a.initiatorType,l=a.duration;if(i&&l&&yh(r)){for(r=0,l=a.responseEnd,o+=1;o<n.length;o++){var c=n[o],s=c.startTime;if(s>l)break;var g=c.transferSize,h=c.initiatorType;g&&yh(h)&&(c=c.responseEnd,r+=g*(c<l?1:(l-s)/(c-s)))}if(--o,t+=8*(i+r)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Wd=null,ef=null;function Gr(e){return e.nodeType===9?e:e.ownerDocument}function xh(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function b0(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function v0(e,t,n,o){return n=Gr(n).createElement(e),n[ut]=o,n[Ut]=t,mt(n,e,t),at(n),n}function tf(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var $u=null;function $S(){var e=window.event;return e&&e.type==="popstate"?e===$u?!1:($u=e,!0):($u=null,!1)}var tp=typeof setTimeout=="function"?setTimeout:void 0,JS=typeof clearTimeout=="function"?clearTimeout:void 0,wh=typeof Promise=="function"?Promise:void 0,kh=typeof requestAnimationFrame=="function"?requestAnimationFrame:tp,IS=typeof queueMicrotask=="function"?queueMicrotask:typeof wh<"u"?function(e){return wh.resolve(null).then(e).catch(FS)}:tp;function FS(e){setTimeout(function(){throw e})}function Po(e){return e==="head"}function Sh(e,t){var n=t,o=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(o===0){e.removeChild(a),_i(t);return}o--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")o++;else if(n==="html")Iu(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Iu(n);for(var i=n.firstChild;i;){var r=i.nextSibling,l=i.nodeName;i[el]||l==="SCRIPT"||l==="STYLE"||l==="LINK"&&i.rel.toLowerCase()==="stylesheet"||n.removeChild(i),i=r}}else n==="body"&&Iu(e.ownerDocument.body);n=a}while(n);_i(t)}function Eh(e,t){var n=e;e=0;do{var o=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=o}while(n)}function y0(e,t,n){if(t=CSS.escape(t)!==t?"r-"+btoa(t).replace(/=/g,""):t,e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display==="inline"){if(t=e.getClientRects(),t.length===1)var o=1;else for(var a=o=0;a<t.length;a++){var i=t[a];0<i.width&&0<i.height&&o++}o===1&&(e=e.style,e.display=t.length===1?"inline-block":"block",e.marginTop="-"+n.paddingTop,e.marginBottom="-"+n.paddingBottom)}}function x0(e,t){e=e.style,t=t.style;var n=t!=null?t.hasOwnProperty("viewTransitionName")?t.viewTransitionName:t.hasOwnProperty("view-transition-name")?t["view-transition-name"]:null:null;e.viewTransitionName=n==null||typeof n=="boolean"?"":(""+n).trim(),n=t!=null?t.hasOwnProperty("viewTransitionClass")?t.viewTransitionClass:t.hasOwnProperty("view-transition-class")?t["view-transition-class"]:null:null,e.viewTransitionClass=n==null||typeof n=="boolean"?"":(""+n).trim(),e.display==="inline-block"&&(t==null?e.display=e.margin="":(n=t.display,e.display=n==null||typeof n=="boolean"?"":n,n=t.margin,n!=null?e.margin=n:(n=t.hasOwnProperty("marginTop")?t.marginTop:t["margin-top"],e.marginTop=n==null||typeof n=="boolean"?"":n,t=t.hasOwnProperty("marginBottom")?t.marginBottom:t["margin-bottom"],e.marginBottom=t==null||typeof t=="boolean"?"":t)))}function w0(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position==="absolute"||t.position==="fixed",clip:t.clipPath!=="none"||t.overflow!=="visible"||t.filter!=="none"||t.mask!=="none"||t.mask!=="none"||t.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function nf(e){var t=e.getBoundingClientRect(),n=getComputedStyle(e);return w0(t,n,e)}function WS(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return w0(t,n,e)}function eE(e){return e.documentElement.clientHeight}function tE(e){this.addEventListener("load",e),this.addEventListener("error",e)}function nE(e,t,n,o,a,i,r,l,c){var s=t.nodeType===9?t:t.ownerDocument;try{var g=s.startViewTransition({update:function(){var f=s.defaultView,p=f.navigation&&f.navigation.transition,x=s.fonts.status;o();var w=[];if(x==="loaded"&&(eE(s),s.fonts.status==="loading"&&w.push(s.fonts.ready)),x=w.length,e!==null)for(var T=e.suspenseyImages,m=0,u=0;u<T.length;u++){var d=T[u];if(!d.complete){var b=d.getBoundingClientRect();if(0<b.bottom&&0<b.right&&b.top<f.innerHeight&&b.left<f.innerWidth){if(m+=D0(d),m>xc){w.length=x;break}d=new Promise(tE.bind(d)),w.push(d)}}}if(0<w.length)return f=Promise.race([Promise.all(w),new Promise(function(v){return setTimeout(v,500)})]).then(a,a),(p?Promise.allSettled([p.finished,f]):f).then(i,i);if(a(),p)return p.finished.then(i,i);i()},types:n});s.__reactViewTransition=g;var h=[];return g.ready.then(function(){for(var f=s.documentElement.getAnimations({subtree:!0}),p=0;p<f.length;p++){var x=f[p],w=x.effect,T=w.pseudoElement;if(T!=null&&T.startsWith("::view-transition")){h.push(x),x=w.getKeyframes();for(var m=T=void 0,u=!0,d=0;d<x.length;d++){var b=x[d],v=b.width;if(T===void 0)T=v;else if(T!==v){u=!1;break}if(v=b.height,m===void 0)m=v;else if(m!==v){u=!1;break}delete b.width,delete b.height,b.transform==="none"&&delete b.transform}u&&T!==void 0&&m!==void 0&&(w.setKeyframes(x),u=getComputedStyle(w.target,w.pseudoElement),u.width!==T||u.height!==m)&&(u=x[0],u.width=T,u.height=m,u=x[x.length-1],u.width=T,u.height=m,w.setKeyframes(x))}}r()},function(f){s.__reactViewTransition===g&&(s.__reactViewTransition=null);try{typeof f=="object"&&f!==null&&f.name==="InvalidStateError"&&(f.message==="View transition was skipped because document visibility state is hidden."||f.message==="Skipping view transition because document visibility state has become hidden."||f.message==="Skipping view transition because viewport size changed."||f.message==="Transition was aborted because of invalid state")&&(f=null),f!==null&&c(f)}finally{o(),a(),r()}}),g.finished.finally(function(){for(var f=0;f<h.length;f++)h[f].cancel();s.__reactViewTransition===g&&(s.__reactViewTransition=null),l()}),g}catch{return o(),a(),r(),null}}function da(e,t){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+t+")"}da.prototype.animate=function(e,t){return t=typeof t=="number"?{duration:t}:ke({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)};da.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),o=[],a=0;a<n.length;a++){var i=n[a].effect;i!==null&&i.target===e&&i.pseudoElement===t&&o.push(n[a])}return o};da.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function k0(e){return{name:e,group:new da("group",e),imagePair:new da("image-pair",e),old:new da("old",e),new:new da("new",e)}}function It(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}It.prototype.addEventListener=function(e,t,n){var o=null,a=null;if(!(n!=null&&typeof n!="boolean"&&(o=n.signal||null,o!==null&&o.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var i=this._eventListeners;if(S0(i,e,t,n)===-1){var r=this,l=t;n!=null&&typeof n!="boolean"&&n.once===!0&&(l=function(c){r.removeEventListener(e,t,n),typeof t=="function"?t.call(this,c):t.handleEvent(c)}),o!==null&&(a=r.removeEventListener.bind(r,e,t,n),o.addEventListener("abort",a,{once:!0}),a=o.removeEventListener.bind(o,"abort",a)),o=zi(n),i.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:l,cleanup:a}),Bt(this._fragmentFiber.child,!1,oE,e,l,o)}this._eventListeners=i}};function oE(e,t,n,o){return Fe(e).addEventListener(t,n,o),!1}It.prototype.removeEventListener=function(e,t,n){var o=this._eventListeners;if(o!==null&&(t=S0(o,e,t,n),t!==-1)){var a=o[t];n=a.attachedListener;var i=a.cleanup;a=zi(a.optionsOrUseCapture),Bt(this._fragmentFiber.child,!1,aE,e,n,a),o.splice(t,1),i!==null&&i()}};function aE(e,t,n,o){return Fe(e).removeEventListener(t,n,o),!1}function zi(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function Th(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function S0(e,t,n,o){if(e.length===0)return-1;o=Th(o);for(var a=0;a<e.length;a++){var i=e[a];if(i.type===t&&i.listener===n&&Th(i.optionsOrUseCapture)===o)return a}return-1}It.prototype.dispatchEvent=function(e){var t=Ta(this._fragmentFiber);if(t===null)return!0;t=Fe(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var o=t.nodeType===9?t.createComment(""):document.createTextNode("");if(n)for(var a=0;a<n.length;a++){var i=n[a];o.addEventListener(i.type,i.attachedListener,zi(i.optionsOrUseCapture))}if(t.appendChild(o),e=o.dispatchEvent(e),n)for(a=0;a<n.length;a++)i=n[a],o.removeEventListener(i.type,i.attachedListener,zi(i.optionsOrUseCapture));return t.removeChild(o),e}return t.dispatchEvent(e)};It.prototype.focus=function(e){Bt(this._fragmentFiber.child,!0,E0,e,void 0,void 0)};function E0(e,t){return e.tag===6?!1:(e=Fe(e),hE(e,t))}It.prototype.focusLast=function(e){var t=[];Bt(this._fragmentFiber.child,!0,np,t,void 0,void 0);for(var n=t.length-1;0<=n&&!E0(t[n],e);n--);};function np(e,t){return t.push(e),!1}It.prototype.blur=function(){var e=Ta(this._fragmentFiber);e!==null&&(e=Fe(e),e=Gr(e).activeElement,e!==null&&Bt(this._fragmentFiber.child,!1,iE,e,void 0,void 0))};function iE(e,t){return e.tag===6?!1:(e=Fe(e),e===t||e.contains(t)?(t.blur(),!0):!1)}It.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),Bt(this._fragmentFiber.child,!1,rE,e,void 0,void 0)};function rE(e,t){return e.tag===6||(e=Fe(e),t.observe(e)),!1}It.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),Bt(this._fragmentFiber.child,!1,lE,e,void 0,void 0);for(var n=t=0;n<yn.length;n++){var o=yn[n];o.fragmentInstance===this&&o.observer===e?e.unobserve(o.instance):yn[t++]=o}yn.length=t}};function lE(e,t){return e.tag===6||(e=Fe(e),t.unobserve(e)),!1}var yn=[],Ju=!1;function cE(e,t,n){yn.push({fragmentInstance:e,observer:t,instance:n}),Ju||(Ju=!0,bE(function(){Ju=!1;var o=yn;yn=[];for(var a=0;a<o.length;a++){var i=o[a];i.observer.unobserve(i.instance)}}))}It.prototype.getClientRects=function(){var e=[];return Bt(this._fragmentFiber.child,!1,sE,e,void 0,void 0),e};function sE(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=Fe(e),t.push.apply(t,e.getClientRects());return!1}It.prototype.getRootNode=function(e){var t=Ta(this._fragmentFiber);return t===null?this:Fe(t).getRootNode(e)};It.prototype.compareDocumentPosition=function(e){var t=Ta(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];Bt(this._fragmentFiber.child,!1,np,n,void 0,void 0);var o=Fe(t);if(n.length===0){if(n=o,ag(this._fragmentFiber)){e:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break e}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var a=o=n.compareDocumentPosition(e);return n===e?a=Node.DOCUMENT_POSITION_CONTAINS:o&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=Qh(t)[1],n===null?a=Node.DOCUMENT_POSITION_PRECEDING:(e=Fe(n).compareDocumentPosition(e),a=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),a|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=Fe(n[0]),a=Fe(n[n.length-1]);var i=ag(this._fragmentFiber)?t.parentElement:o;if(i==null)return Node.DOCUMENT_POSITION_DISCONNECTED;o=i.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,i=i.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_CONTAINED_BY;var r=t.compareDocumentPosition(e),l=a.compareDocumentPosition(e),c=r&Node.DOCUMENT_POSITION_CONTAINED_BY||l&Node.DOCUMENT_POSITION_CONTAINED_BY;return l=o&&i&&r&Node.DOCUMENT_POSITION_FOLLOWING&&l&Node.DOCUMENT_POSITION_PRECEDING,t=o&&t===e||i&&a===e||c||l?Node.DOCUMENT_POSITION_CONTAINED_BY:!o&&t===e||!i&&a===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:r,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||uE(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function uE(e,t,n,o,a){var i=ua(a);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!i)e:{for(;i!==null;){if(i.tag===7&&(i===t||i.alternate===t)){n=!0;break e}i=i.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(i===null)return i=a.ownerDocument,a===i||a===i.documentElement||a===i.body;e:{for(i=t,t=Ta(t);i!==null;){if(!(i.tag!==5&&i.tag!==3&&i.tag!==27||i!==t&&i.alternate!==t)){i=!0;break e}i=i.return}i=!1}return i}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!i)&&!(t=i===n)&&(t=Wu(n,i,ig),t===null?t=!1:(Bt(t,!0,qw,i,n),i=ei,ei=null,t=i!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!i)&&!(t=i===o)&&(t=Wu(o,i,ig),t===null?t=!1:(Bt(t,!0,Yw,i,o),i=ei,Fu=ei=null,t=i!==null)),t):!1}function Ch(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}It.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(N(566));var t=[];Bt(this._fragmentFiber.child,!1,np,t,void 0,void 0);var n=e!==!1;if(t.length===0){var o=Qh(this._fragmentFiber);if(o=n?o[1]||o[0]||Ta(this._fragmentFiber):o[0]||o[1],o===null)return;if(o.tag===6){e=Fe(o),Ch(e,n);return}if(o=Fe(o),o.nodeType!==9){if(o.nodeType===11){n="host"in o?o.host:null,n!==null&&n.scrollIntoView(e);return}o.scrollIntoView(e)}}for(o=n?t.length-1:0;o!==(n?-1:t.length);){var a=t[o];a.tag===6?(a=Fe(a),Ch(a,n)):Fe(a).scrollIntoView(e),o+=n?-1:1}};function dE(e,t){return e=Fe(e),T0(e,t),!1}function T0(e,t){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(t)}function C0(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.addEventListener(a.type,a.attachedListener,zi(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(i){for(var r=0,l=0;l<yn.length;l++){var c=yn[l];(c.fragmentInstance!==t||c.observer!==i||c.instance!==e)&&(yn[r++]=c)}yn.length=r,i.observe(e)}),T0(e,t))}function fE(e,t){var n=t._eventListeners;if(n!==null)for(var o=0;o<n.length;o++){var a=n[o];e.removeEventListener(a.type,a.attachedListener,zi(a.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(i){typeof i.rootMargin=="string"?cE(t,i,e):i.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function of(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":of(n),Wc(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function pE(e,t,n,o){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[el])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(i=e.getAttribute("rel"),i==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(i!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(i=e.getAttribute("src"),(i!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&i&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var i=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===i)return e}else return e;if(e=sn(e.nextSibling),e===null)break}return null}function mE(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=sn(e.nextSibling),e===null))return null;return e}function N0(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=sn(e.nextSibling),e===null))return null;return e}function af(e){return e.data==="$?"||e.data==="$~"}function op(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function gE(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var o=function(){t(),n.removeEventListener("DOMContentLoaded",o)};n.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function sn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var rf=null;function Nh(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return sn(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Mh(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function hE(e,t){function n(){o=!0}if(e.ownerDocument.activeElement===e)return!0;var o=!1;try{e.ownerDocument.addEventListener("focus",n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener("focus",n,!0)}return o}function bE(e){kh(function(){kh(function(t){return e(t)})})}function M0(e,t,n){switch(t=Gr(n),e){case"html":if(e=t.documentElement,!e)throw Error(N(452));return e;case"head":if(e=t.head,!e)throw Error(N(453));return e;case"body":if(e=t.body,!e)throw Error(N(454));return e;default:throw Error(N(451))}}function A0(e,t,n){for(var o in n){var a=n[o];n.hasOwnProperty(o)&&a!=null&&ve(e,t,o,null,QS,a)}n.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===_n&&(e.onclick=null),Wc(e)}function Iu(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Wc(e)}var un=new Map,Ah=new Set;function Qr(e){if(typeof e.getRootNode=="function"){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var uo=ge.d;ge.d={f:vE,r:yE,D:xE,C:wE,L:kE,m:SE,X:TE,S:EE,M:CE};function vE(){var e=uo.f(),t=ps();return e||t}function yE(e){var t=Li(e);t!==null&&t.tag===5&&t.type==="form"?pv(t):uo.r(e)}var qi=typeof document>"u"?null:document;function z0(e,t,n){var o=qi;if(o&&typeof t=="string"&&t){var a=rn(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),Ah.has(a)||(Ah.add(a),e={rel:e,crossOrigin:n,href:t},o.querySelector(a)===null&&(t=o.createElement("link"),mt(t,"link",e),at(t),o.head.appendChild(t)))}}function xE(e){uo.D(e),z0("dns-prefetch",e,null)}function wE(e,t){uo.C(e,t),z0("preconnect",e,t)}function kE(e,t,n){uo.L(e,t,n);var o=qi;if(o&&e&&t){var a='link[rel="preload"][as="'+rn(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+rn(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+rn(n.imageSizes)+'"]')):a+='[href="'+rn(e)+'"]';var i=a;switch(t){case"style":i=Oi(e);break;case"script":i=Yi(e)}if(!(un.has(i)||(e=ke({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),un.set(i,e),o.querySelector(a)!==null||t==="style"&&o.querySelector(rl(i))||t==="script"&&o.querySelector(ll(i))))){var r=o.createElement("link");mt(r,"link",e),t==="style"&&(r[Nc]=!0,r.onload=r.onerror=function(){ib(r)}),at(r),o.head.appendChild(r)}}}function SE(e,t){uo.m(e,t);var n=qi;if(n&&e){var o=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+rn(o)+'"][href="'+rn(e)+'"]',i=a;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":i=Yi(e)}if(!un.has(i)&&(e=ke({rel:"modulepreload",href:e},t),un.set(i,e),n.querySelector(a)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(ll(i)))return}o=n.createElement("link"),mt(o,"link",e),at(o),n.head.appendChild(o)}}}function EE(e,t,n){uo.S(e,t,n);var o=qi;if(o&&e){var a=fi(o).hoistableStyles,i=Oi(e);t=t||"default";var r=a.get(i);if(!r){var l={loading:0,preload:null};if(r=o.querySelector(rl(i)))l.loading=5;else{e=ke({rel:"stylesheet",href:e,"data-precedence":t},n),(n=un.get(i))&&ap(e,n);var c=r=o.createElement("link");at(c),mt(c,"link",e),c._p=new Promise(function(s,g){c.onload=s,c.onerror=g}),c.addEventListener("load",function(){l.loading|=1}),c.addEventListener("error",function(){l.loading|=2}),l.loading|=4,vc(r,t,o)}r={type:"stylesheet",instance:r,count:1,state:l},a.set(i,r)}}}function TE(e,t){uo.X(e,t);var n=qi;if(n&&e){var o=fi(n).hoistableScripts,a=Yi(e),i=o.get(a);i||(i=n.querySelector(ll(a)),i||(e=ke({src:e,async:!0},t),(t=un.get(a))&&ip(e,t),i=n.createElement("script"),at(i),mt(i,"link",e),n.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},o.set(a,i))}}function CE(e,t){uo.M(e,t);var n=qi;if(n&&e){var o=fi(n).hoistableScripts,a=Yi(e),i=o.get(a);i||(i=n.querySelector(ll(a)),i||(e=ke({src:e,async:!0,type:"module"},t),(t=un.get(a))&&ip(e,t),i=n.createElement("script"),at(i),mt(i,"link",e),n.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},o.set(a,i))}}function zh(e,t,n,o){var a=(a=Ro.current)?Qr(a):null;if(!a)throw Error(N(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(n=Oi(n.href),t=fi(a).hoistableStyles,o=t.get(n),o||(o={type:"style",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Oi(n.href);var i=fi(a).hoistableStyles,r=i.get(e);if(r||(a=a.ownerDocument||a,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},i.set(e,r),(i=a.querySelector(rl(e)))?i._p||(r.instance=i,r.state.loading=5):(i=un.get(e),i||(i={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},un.set(e,i)),NE(a,e,i,r.state))),t&&o===null)throw Error(N(528,""));return r}if(t&&o!==null)throw Error(N(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(n=Yi(n),t=fi(a).hoistableScripts,o=t.get(n),o||(o={type:"script",instance:null,count:0,state:null},t.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(N(444,e))}}function Oi(e){return'href="'+rn(e)+'"'}function rl(e){return'link[rel="stylesheet"]['+e+"]"}function O0(e){return ke({},e,{"data-precedence":e.precedence,precedence:null})}function NE(e,t,n,o){if(t=e.querySelector('link[rel="preload"][as="style"]['+t+"]")){if(t[Nc]!==!0){o.loading=1;return}}else t=e.createElement("link"),t[Nc]=!0,t.onload=t.onerror=ib.bind(null,t),mt(t,"link",n),at(t),e.head.appendChild(t);o.preload=t,t.addEventListener("load",function(){return o.loading|=1}),t.addEventListener("error",function(){return o.loading|=2})}function Yi(e){return'[src="'+rn(e)+'"]'}function ll(e){return"script[async]"+e}function Oh(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var o=e.querySelector('style[data-href~="'+rn(n.href)+'"]');if(o)return t.instance=o,at(o),o;var a=ke({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),at(o),mt(o,"style",a),vc(o,n.precedence,e),t.instance=o;case"stylesheet":a=Oi(n.href);var i=e.querySelector(rl(a));if(i)return t.state.loading|=4,t.instance=i,at(i),i;o=O0(n),(a=un.get(a))&&ap(o,a),i=(e.ownerDocument||e).createElement("link"),at(i);var r=i;return r._p=new Promise(function(l,c){r.onload=l,r.onerror=c}),mt(i,"link",o),t.state.loading|=4,vc(i,n.precedence,e),t.instance=i;case"script":return i=Yi(n.src),(a=e.querySelector(ll(i)))?(t.instance=a,at(a),a):(o=n,(a=un.get(i))&&(o=ke({},n),ip(o,a)),e=e.ownerDocument||e,a=e.createElement("script"),at(a),mt(a,"link",o),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(N(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(o=t.instance,t.state.loading|=4,vc(o,n.precedence,e));return t.instance}function vc(e,t,n){for(var o=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=o.length?o[o.length-1]:null,i=a,r=0;r<o.length;r++){var l=o[r];if(l.dataset.precedence===t)i=l;else if(i!==a)break}i?i.parentNode.insertBefore(e,i.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function ap(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function ip(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var yc=null;function Rh(e,t,n){if(yc===null){var o=new Map,a=yc=new Map;a.set(n,o)}else a=yc,o=a.get(n),o||(o=new Map,a.set(n,o));if(o.has(e))return o;for(o.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var i=n[a];if(!(i[el]||i[ut]||e==="link"&&i.getAttribute("rel")==="stylesheet")&&i.namespaceURI!=="http://www.w3.org/2000/svg"){var r=i.getAttribute(t)||"";r=e+r;var l=o.get(r);l?l.push(i):o.set(r,[i])}}return o}function lf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function ME(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Dh(e,t){return e==="img"&&t.src!=null&&t.src!==""&&t.onLoad==null&&t.loading!=="lazy"}function R0(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function D0(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function _h(e,t){typeof t.decode=="function"&&(e.imgCount++,t.complete||(e.imgBytes+=D0(t),e.suspenseyImages.push(t)),e=OE.bind(e),t.decode().then(e,e))}function AE(e,t,n,o){if(n.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=Oi(o.href),i=t.querySelector(rl(a));if(i){t=i._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Zr.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=i,at(i);return}i=t.ownerDocument||t,o=O0(o),(a=un.get(a))&&ap(o,a),i=i.createElement("link"),at(i);var r=i;r._p=new Promise(function(l,c){r.onload=l,r.onerror=c}),mt(i,"link",o),n.instance=i}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Zr.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var xc=0;function zE(e,t){return e.stylesheets&&e.count===0&&wc(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var o=setTimeout(function(){if(e.stylesheets&&wc(e,e.stylesheets),e.unsuspend){var i=e.unsuspend;e.unsuspend=null,i()}},6e4+t);0<e.imgBytes&&xc===0&&(xc=62500*PS());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&wc(e,e.stylesheets),e.unsuspend)){var i=e.unsuspend;e.unsuspend=null,i()}},(e.imgBytes>xc?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(a)}}:null}function _0(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)wc(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function Zr(){this.count--,_0(this)}function OE(){this.imgCount--,_0(this)}var Jc=null;function wc(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Jc=new Map,t.forEach(RE,e),Jc=null,Zr.call(e))}function RE(e,t){if(!(t.state.loading&4)){var n=Jc.get(e);if(n)var o=n.get(null);else{n=new Map,Jc.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),i=0;i<a.length;i++){var r=a[i];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(n.set(r.dataset.precedence,r),o=r)}o&&n.set(null,o)}a=t.instance,r=a.getAttribute("data-precedence"),i=n.get(r)||o,i===o&&n.set(null,a),n.set(r,a),this.count++,o=Zr.bind(this),a.addEventListener("load",o),a.addEventListener("error",o),i?i.parentNode.insertBefore(a,i.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var Ri={$$typeof:Dn,Provider:null,Consumer:null,_currentValue:fa,_currentValue2:fa,_threadCount:0};function DE(e,t,n,o,a,i,r,l,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Tu(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Tu(0),this.hiddenUpdates=Tu(null),this.identifierPrefix=o,this.onUncaughtError=a,this.onCaughtError=i,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map}function H0(e,t,n,o,a,i,r,l,c,s,g,h){return e=new DE(e,t,n,r,c,s,g,h,l),t=1,i===!0&&(t|=24),i=Ht(3,null,null,t),e.current=i,i.stateNode=e,t=Tf(),t.refCount++,e.pooledCache=t,t.refCount++,i.memoizedState={element:o,isDehydrated:n,cache:t},Mf(i),e}function L0(e){return e?(e=ci,e):ci}function B0(e,t,n,o,a,i){a=L0(a),o.context===null?o.context=a:o.pendingContext=a,o=_o(t),o.payload={element:n},i=i===void 0?null:i,i!==null&&(o.callback=i),n=Ho(e,o,t),n!==null&&(Lt(n,e,t),Tr(n,e,t))}function Hh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function rp(e,t){Hh(e,t),(e=e.alternate)&&Hh(e,t)}function U0(e){if(e.tag===13||e.tag===31){var t=Ma(e,67108864);t!==null&&Lt(t,e,67108864),rp(e,67108864)}}function Lh(e){if(e.tag===13||e.tag===31){var t=$t();t=pf(t);var n=Ma(e,t);n!==null&&Lt(n,e,t),rp(e,t)}}var Di=!0;function _E(e,t,n,o){var a=Q.T;Q.T=null;var i=ge.p;try{ge.p=2,lp(e,t,n,o)}finally{ge.p=i,Q.T=a}}function HE(e,t,n,o){var a=Q.T;Q.T=null;var i=ge.p;try{ge.p=8,lp(e,t,n,o)}finally{ge.p=i,Q.T=a}}function lp(e,t,n,o){if(Di){var a=cf(o);if(a===null)Pu(e,t,o,Ic,n),Bh(e,o);else if(BE(a,e,t,n,o))o.stopPropagation();else if(Bh(e,o),t&4&&-1<LE.indexOf(e)){for(;a!==null;){var i=Li(a);if(i!==null)switch(i.tag){case 3:if(i=i.stateNode,i.current.memoizedState.isDehydrated){var r=la(i.pendingLanes);if(r!==0){var l=i;for(l.pendingLanes|=2,l.entangledLanes|=2;r;){var c=1<<31-Pt(r);l.entanglements[1]|=c,r&=~c}Yn(i),(me&6)===0&&(Gc=Qt()+500,il(0,!1))}}break;case 31:case 13:l=Ma(i,2),l!==null&&Lt(l,i,2),ps(),rp(i,2)}if(i=cf(o),i===null&&Pu(e,t,o,Ic,n),i===a)break;a=i}a!==null&&o.stopPropagation()}else Pu(e,t,o,null,n)}}function cf(e){return e=hf(e),cp(e)}var Ic=null;function cp(e){if(Ic=null,e=ua(e),e!==null){var t=Jr(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=Kh(t),e!==null)return e;e=null}else if(n===31){if(e=Xh(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Ic=e,null}function j0(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Jw()){case Jh:return 2;case Ih:return 8;case Cc:case Iw:return 32;case Fh:return 268435456;default:return 32}default:return 32}}var sf=!1,jo=null,qo=null,Yo=null,Pr=new Map,$r=new Map,To=[],LE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Bh(e,t){switch(e){case"focusin":case"focusout":jo=null;break;case"dragenter":case"dragleave":qo=null;break;case"mouseover":case"mouseout":Yo=null;break;case"pointerover":case"pointerout":Pr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":$r.delete(t.pointerId)}}function mr(e,t,n,o,a,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:i,targetContainers:[a]},t!==null&&(t=Li(t),t!==null&&U0(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function BE(e,t,n,o,a){switch(t){case"focusin":return jo=mr(jo,e,t,n,o,a),!0;case"dragenter":return qo=mr(qo,e,t,n,o,a),!0;case"mouseover":return Yo=mr(Yo,e,t,n,o,a),!0;case"pointerover":var i=a.pointerId;return Pr.set(i,mr(Pr.get(i)||null,e,t,n,o,a)),!0;case"gotpointercapture":return i=a.pointerId,$r.set(i,mr($r.get(i)||null,e,t,n,o,a)),!0}return!1}function q0(e){var t=ua(e.target);if(t!==null){var n=Jr(t);if(n!==null){if(t=n.tag,t===13){if(t=Kh(n),t!==null){e.blockedOn=t,sg(e.priority,function(){Lh(n)});return}}else if(t===31){if(t=Xh(n),t!==null){e.blockedOn=t,sg(e.priority,function(){Lh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function kc(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=cf(e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);dd=o,n.target.dispatchEvent(o),dd=null}else return t=Li(n),t!==null&&U0(t),e.blockedOn=n,!1;t.shift()}return!0}function Uh(e,t,n){kc(e)&&n.delete(t)}function UE(){sf=!1,jo!==null&&kc(jo)&&(jo=null),qo!==null&&kc(qo)&&(qo=null),Yo!==null&&kc(Yo)&&(Yo=null),Pr.forEach(Uh),$r.forEach(Uh)}function nc(e,t){e.blockedOn===t&&(e.blockedOn=null,sf||(sf=!0,We.unstable_scheduleCallback(We.unstable_NormalPriority,UE)))}var oc=null;function jh(e){oc!==e&&(oc=e,We.unstable_scheduleCallback(We.unstable_NormalPriority,function(){oc===e&&(oc=null);for(var t=0;t<e.length;t+=3){var n=e[t],o=e[t+1],a=e[t+2];if(typeof o!="function"){if(cp(o||n)===null)continue;break}var i=Li(n);i!==null&&(e.splice(t,3),t-=3,Nd(i,{pending:!0,data:a,method:n.method,action:o},o,a))}}))}function _i(e){function t(c){return nc(c,e)}jo!==null&&nc(jo,e),qo!==null&&nc(qo,e),Yo!==null&&nc(Yo,e),Pr.forEach(t),$r.forEach(t);for(var n=0;n<To.length;n++){var o=To[n];o.blockedOn===e&&(o.blockedOn=null)}for(;0<To.length&&(n=To[0],n.blockedOn===null);)q0(n),n.blockedOn===null&&To.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(o=0;o<n.length;o+=3){var a=n[o],i=n[o+1],r=a[Ut]||null;if(typeof i=="function")r||jh(n);else if(r){var l=null;if(i&&i.hasAttribute("formAction")){if(a=i,r=i[Ut]||null)l=r.formAction;else if(cp(a)!==null)continue}else l=r.action;typeof l=="function"?n[o+1]=l:(n.splice(o,3),o-=3),jh(n)}}}function Y0(){function e(i){i.canIntercept&&i.info==="react-transition"&&i.intercept({handler:function(){return new Promise(function(r){return a=r})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),o||setTimeout(n,20)}function n(){if(!o&&!navigation.transition){var i=navigation.currentEntry;i&&i.url!=null&&navigation.navigate(i.url,{state:i.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function sp(e){this._internalRoot=e}hs.prototype.render=sp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(N(409));var n=t.current,o=$t();B0(n,o,e,t,null,null)};hs.prototype.unmount=sp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;B0(e.current,2,null,e,null,null),ps(),t[Hi]=null}};function hs(e){this._internalRoot=e}hs.prototype.unstable_scheduleHydration=function(e){if(e){var t=ab();e={blockedOn:null,target:e,priority:t};for(var n=0;n<To.length&&t!==0&&t<To[n].priority;n++);To.splice(n,0,e),n===0&&q0(e)}};var qh=Yh.version;if(qh!=="19.3.0")throw Error(N(527,qh,"19.3.0"));ge.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(N(188)):(e=Object.keys(e).join(","),Error(N(268,e)));return e=jw(t),e=e!==null?Gh(e):null,e=e===null?null:e.stateNode,e};var jE={bundleType:0,version:"19.3.0",rendererPackageName:"react-dom",currentDispatcherRef:Q,reconcilerVersion:"19.3.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(gr=__REACT_DEVTOOLS_GLOBAL_HOOK__,!gr.isDisabled&&gr.supportsFiber))try{Ir=gr.inject(jE),Zt=gr}catch{}var gr;bs.createRoot=function(e,t){if(!Vh(e))throw Error(N(299));var n=!1,o="",a=wv,i=kv,r=Sv;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(i=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=H0(e,1,!1,null,null,n,o,null,a,i,r,Y0),e[Hi]=t.current,ep(e),new sp(t)};bs.hydrateRoot=function(e,t,n){if(!Vh(e))throw Error(N(299));var o=!1,a="",i=wv,r=kv,l=Sv,c=null;return n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(i=n.onUncaughtError),n.onCaughtError!==void 0&&(r=n.onCaughtError),n.onRecoverableError!==void 0&&(l=n.onRecoverableError),n.formState!==void 0&&(c=n.formState)),t=H0(e,1,!0,t,n??null,o,a,c,i,r,l,Y0),t.context=L0(null),n=t.current,o=$t(),o=pf(o),a=_o(o),a.callback=null,Ho(n,a,o),n=o,t.current.lanes=n,Wr(t,n),Yn(t),e[Hi]=t.current,ep(e),new hs(t)};bs.version="19.3.0"});var G0=Cn((_T,X0)=>{"use strict";function K0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(K0)}catch(e){console.error(e)}}K0(),X0.exports=V0()});var cy=Cn(Ms=>{"use strict";var GE=Symbol.for("react.transitional.element"),QE=Symbol.for("react.fragment");function ly(e,t,n){var o=null;if(n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),"key"in t){n={};for(var a in t)a!=="key"&&(n[a]=t[a])}else n=t;return t=n.ref,{$$typeof:GE,type:e,key:o,ref:t!==void 0?t:null,props:n}}Ms.Fragment=QE;Ms.jsx=ly;Ms.jsxs=ly});var q=Cn((UT,sy)=>{"use strict";sy.exports=cy()});var Sm=`/*---------------------------------------------------------------------------------------------
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
`;var mw='[data-glass-scroll="off"]',iu=(e,t,n)=>Math.min(n,Math.max(t,e));function Em(e){let t=e instanceof Document?e:e.ownerDocument,n=t.createElement("div");n.className="ink-scroll-layer",n.setAttribute("aria-hidden","true"),(e instanceof Document?t.body??t.documentElement:e).append(n);let o=new Map,a=new Set,i=0,r=u=>u===t.scrollingElement?{left:0,top:0}:(({left:d,top:b})=>({left:d+u.clientLeft,top:b+u.clientTop}))(u.getBoundingClientRect()),l=(u,d)=>{let{left:b,top:v}=r(u);for(let E of["y","x"]){let k=d.thumbs[E],S=E==="y"?u.clientHeight:u.clientWidth,M=E==="y"?u.scrollHeight:u.scrollWidth,A=E==="y"?u.scrollTop:u.scrollLeft,D=M-S;if(D<1||S<=0){k.hidden=!0;continue}let H=S-6,Y=iu(S/M*H,Math.min(32,H),H),ne=3+iu(A,0,D)/D*(H-Y);k.hidden=!1,E==="y"?(k.style.left=`${b+u.clientWidth-3}px`,k.style.top=`${v+ne}px`,k.style.height=`${Y}px`):(k.style.left=`${b+ne}px`,k.style.top=`${v+u.clientHeight-3}px`,k.style.width=`${Y}px`)}},c=u=>{let d=o.get(u);if(d){clearTimeout(d.timer),o.delete(u);for(let b of Object.values(d.thumbs))b.classList.remove("visible"),setTimeout(()=>b.remove(),300)}},s=(u,d)=>{clearTimeout(d.timer),d.timer=setTimeout(()=>{d.held||c(u)},1100)},g=u=>{let d={thumbs:{y:h(u,"y"),x:h(u,"x")},held:!1};for(let b of Object.values(d.thumbs))n.append(b),b.addEventListener("pointerenter",()=>{d.held=!0,clearTimeout(d.timer)}),b.addEventListener("pointerleave",()=>{b.classList.contains("dragging")||(d.held=!1,s(u,d))});return o.set(u,d),d};function h(u,d){let b=t.createElement("div");return b.className=`ink-scroll-thumb ${d}`,b.addEventListener("pointerdown",v=>{if(v.button!==0)return;v.preventDefault(),v.stopPropagation(),b.setPointerCapture(v.pointerId),b.classList.add("dragging");let E=d==="y"?v.clientY:v.clientX,k=d==="y"?u.scrollTop:u.scrollLeft,S=d==="y"?u.clientHeight:u.clientWidth,M=(d==="y"?u.scrollHeight:u.scrollWidth)-S,A=S-6-(d==="y"?b.offsetHeight:b.offsetWidth),D=Y=>{if(A<=0)return;let ne=(d==="y"?Y.clientY:Y.clientX)-E,z=iu(k+ne/A*M,0,M);d==="y"?u.scrollTop=z:u.scrollLeft=z},H=()=>{b.classList.remove("dragging"),b.removeEventListener("pointermove",D),b.removeEventListener("pointerup",H),b.removeEventListener("pointercancel",H);let Y=o.get(u);Y&&!b.matches(":hover")&&(Y.held=!1,s(u,Y))};b.addEventListener("pointermove",D),b.addEventListener("pointerup",H),b.addEventListener("pointercancel",H)}),b}let f=u=>{if(u.closest(mw))return;let d=o.get(u)??g(u);s(u,d),a.add(u),i||=requestAnimationFrame(()=>{i=0;for(let b of a){let v=o.get(b);if(v){if(!b.isConnected){c(b);continue}l(b,v);for(let E of Object.values(v.thumbs))E.classList.add("visible")}}a.clear()})},p=u=>{let d=u.target;d===t?f(t.scrollingElement):d instanceof HTMLElement&&d!==n&&f(d)},x=({path:u,x:d,y:b})=>{for(let v of u){if(v===e||!(v instanceof HTMLElement))break;if(v.parentNode===n)return;let E=v.scrollHeight-v.clientHeight>=1,k=v.scrollWidth-v.clientWidth>=1;if(!E&&!k)continue;let S=getComputedStyle(v),M=E&&/auto|scroll/.test(S.overflowY),A=k&&/auto|scroll/.test(S.overflowX);if(!M&&!A)continue;let{left:D,top:H}=r(v);(M&&d>=D+v.clientWidth-14||A&&b>=H+v.clientHeight-14)&&f(v);return}},w,T=0,m=u=>{u.buttons||(w={path:u.composedPath(),x:u.clientX,y:u.clientY},T||=requestAnimationFrame(()=>{T=0,w&&x(w)}))};return e.addEventListener("scroll",p,{capture:!0,passive:!0}),e.addEventListener("pointermove",m,{capture:!0,passive:!0}),()=>{e.removeEventListener("scroll",p,{capture:!0}),e.removeEventListener("pointermove",m,{capture:!0}),cancelAnimationFrame(i),cancelAnimationFrame(T);for(let u of[...o.keys()])c(u);n.remove()}}var Tm=`/* The Inkspect design system: tokens and the shared components (buttons, fields, selects,
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
`;var Ox=L(G0());var vs=L(je(),1);function ys(e,t,n,o={}){let{align:a="start",gap:i=4,matchWidth:r=!1}=o;(0,vs.useLayoutEffect)(()=>{if(!n)return;let l=()=>{e.current&&t.current&&qE(e.current,t.current,{align:a,gap:i,matchWidth:r})};l();let c=new ResizeObserver(l);return t.current&&c.observe(t.current),()=>c.disconnect()},[e,t,n,a,i,r])}function dp(){let e=document.documentElement;return{width:e.clientWidth||innerWidth,height:e.clientHeight||innerHeight}}function qE(e,t,{align:n,gap:o,matchWidth:a}){let i=e.getBoundingClientRect();a&&(t.style.minWidth=`${i.width}px`);let r=dp(),l=4;t.style.maxWidth=`${r.width-2*l}px`;let c=t.getBoundingClientRect(),s=i.bottom+o,g=s+c.height<=r.height-l,h=i.top-o-c.height,f=g||h<l?s:h,p=n==="end"?i.right-c.width:i.left;t.style.top=`${Math.max(l,Math.min(f,r.height-c.height-l))}px`,t.style.left=`${Math.max(l,Math.min(p,r.width-c.width-l))}px`,t.dataset.side=f===s?"bottom":"top"}function up(e,t,n){let o=e().find(Boolean)?.getRootNode(),a=o instanceof ShadowRoot?o:void 0,i=c=>e().some(s=>s&&c.composedPath().includes(s)),r=c=>{a&&c.composedPath().includes(a.host)||i(c)||n(c)},l=c=>{i(c)||n(c)};return window.addEventListener(t,r,!0),a?.addEventListener(t,l,!0),()=>{window.removeEventListener(t,r,!0),a?.removeEventListener(t,l,!0)}}var cl,Q0=e=>{let t=e.composedPath()[0];if(e.button!==0){cl=void 0;return}t instanceof Element&&(cl={element:t.closest('button, [role="button"], a')??t,at:performance.now()})};typeof window<"u"&&window.addEventListener("pointerdown",Q0,!0);function Z0(e){e.addEventListener("pointerdown",Q0,!0)}function xs(){return cl&&performance.now()-cl.at<1e3?cl.element:void 0}function YE(e){let t=e.getRootNode(),n=[window];t instanceof ShadowRoot&&n.push(t);let o=r=>{r.composedPath().includes(e)&&(r.stopPropagation(),r.preventDefault(),a())},a=()=>{clearTimeout(i);for(let r of n)r.removeEventListener("click",o,!0)},i=setTimeout(a,1e3);for(let r of n)r.addEventListener("click",o,!0)}function ws(e,t,n,o){return up(e,"pointerdown",a=>{o?.(a)||(t&&a.composedPath().includes(t)&&YE(t),n(a))})}function ks(e,t,n){(0,vs.useEffect)(()=>{if(!t)return;let o=()=>e.map(c=>c.current),a=up(o,"pointerdown",()=>n("outside")),i=up(o,"scroll",()=>n("window")),r=c=>{c.key==="Escape"&&(c.preventDefault(),c.stopPropagation(),n("escape"))},l=()=>n("window");return window.addEventListener("keydown",r,!0),window.addEventListener("blur",l),window.addEventListener("resize",l),()=>{a(),i(),window.removeEventListener("keydown",r,!0),window.removeEventListener("blur",l),window.removeEventListener("resize",l)}},[t,n])}function re(...e){return e.filter(Boolean).join(" ")}function Ss(e){let t=e?.getRootNode();return t instanceof ShadowRoot?t:document.body}function P0(e){return e.composedPath().some(t=>t instanceof HTMLElement&&t.dataset.inkPopup!==void 0)}var Oa=L(je(),1);var sl={global:"Browser",inspect:"Element picker",draw:"Drawing",screenshot:"Screenshot",devtools:"Console and network",device:"Device",measure:"Measure",eyedropper:"Eyedropper",overlay:"Design overlay",tweak:"CSS tweak",record:"Record",a11y:"Accessibility check",send:"Send dialog"},ue=e=>`vscodeBrowser.${e}`,kn=[{id:"tab.new",label:"New tab",scope:"global",keys:["ctrl+t"],command:ue("newTab")},{id:"tab.close",label:"Close tab",scope:"global",keys:["ctrl+w","ctrl+f4"],command:ue("closeTab")},{id:"tab.reopen",label:"Reopen closed tab",scope:"global",keys:["ctrl+shift+t"],command:ue("reopenClosedTab")},{id:"tab.next",label:"Next tab",scope:"global",keys:["ctrl+tab","ctrl+pagedown"],mac:["ctrl+tab","cmd+alt+right"],command:ue("nextTab")},{id:"tab.previous",label:"Previous tab",scope:"global",keys:["ctrl+shift+tab","ctrl+pageup"],mac:["ctrl+shift+tab","cmd+alt+left"],command:ue("previousTab")},{id:"tab.duplicate",label:"Duplicate tab",scope:"global",keys:[],command:ue("duplicateTab")},{id:"tab.private",label:"New private tab",scope:"global",keys:["ctrl+shift+n"],command:ue("newPrivateTab")},{id:"window.new",label:"New window",scope:"global",keys:["ctrl+n"],command:ue("newWindow")},{id:"nav.address",label:"Focus the address bar",scope:"global",keys:["ctrl+l","alt+d"],mac:["cmd+l","alt+d"],command:ue("focusAddressBar")},{id:"nav.back",label:"Back",scope:"global",keys:["alt+left"],mac:["cmd+["],command:ue("goBack")},{id:"nav.forward",label:"Forward",scope:"global",keys:["alt+right"],mac:["cmd+]"],command:ue("goForward")},{id:"nav.reload",label:"Reload",scope:"global",keys:["ctrl+r","f5"],mac:["cmd+r"],command:ue("reload")},{id:"nav.hardReload",label:"Hard reload",scope:"global",keys:["ctrl+shift+r","ctrl+f5"],mac:["cmd+shift+r"],command:ue("hardReload")},{id:"nav.stop",label:"Stop loading",scope:"global",keys:[],command:ue("stop")},{id:"nav.home",label:"Home page",scope:"global",keys:["alt+home"],mac:["cmd+shift+h"],command:ue("goHome")},{id:"page.find",label:"Find in page",scope:"global",keys:["ctrl+f"],command:ue("find")},{id:"page.zoomIn",label:"Zoom in",scope:"global",keys:["ctrl+=","ctrl+shift+="],command:ue("zoomIn")},{id:"page.zoomOut",label:"Zoom out",scope:"global",keys:["ctrl+-"],command:ue("zoomOut")},{id:"page.zoomReset",label:"Reset zoom",scope:"global",keys:["ctrl+0"],command:ue("zoomReset")},{id:"page.bookmark",label:"Bookmark this page",scope:"global",keys:["ctrl+d"],command:ue("bookmarkPage")},{id:"page.source",label:"View page source",scope:"global",keys:["ctrl+u"],mac:["cmd+alt+u"],command:ue("viewSource")},{id:"page.pdf",label:"Save page as PDF",scope:"global",keys:[],command:ue("savePdf")},{id:"page.copyUrl",label:"Copy page address",scope:"global",keys:["ctrl+shift+l"],command:ue("copyUrl")},{id:"page.external",label:"Open in system browser",scope:"global",keys:[],command:ue("openInSystemBrowser")},{id:"page.devtools",label:"Open DevTools",scope:"global",keys:["f12"],command:ue("openDevTools")},{id:"page.contextToAgent",label:"Send page context to agent",scope:"global",keys:["ctrl+alt+enter"],command:ue("sendPageContextToChat")},{id:"agent.showContext",label:"Show agent context",scope:"global",keys:["ctrl+shift+alt+a"],command:ue("showAgentContext"),everywhere:!0},{id:"agent.sendLatest",label:"Send the latest capture to the agent",scope:"global",keys:["ctrl+shift+alt+v"],command:ue("sendLatestContext"),everywhere:!0},{id:"open.history",label:"History",scope:"global",keys:["ctrl+h"],mac:["cmd+y"],command:ue("showHistory")},{id:"open.downloads",label:"Downloads",scope:"global",keys:["shift+alt+l"],command:ue("showDownloads")},{id:"open.bookmarks",label:"Bookmark manager",scope:"global",keys:["ctrl+alt+b"],command:ue("showBookmarks")},{id:"open.bookmarksBar",label:"Show or hide the bookmarks bar",scope:"global",keys:["ctrl+shift+b"]},{id:"open.quickActions",label:"Quick actions",scope:"global",keys:["ctrl+shift+k"]},{id:"open.shortcuts",label:"Change keyboard shortcuts",scope:"global",keys:["ctrl+alt+k"],command:ue("editShortcuts")},{id:"open.cheatSheet",label:"Keyboard shortcuts of this mode",scope:"global",keys:["ctrl+shift+/"],mac:["cmd+alt+/"]},{id:"mode.inspect",label:"Element picker",scope:"global",keys:["shift+alt+e"]},{id:"mode.draw",label:"Draw on the page",scope:"global",keys:["shift+alt+w"]},{id:"mode.screenshot",label:"Screenshot",scope:"global",keys:["shift+alt+g"]},{id:"mode.devtools",label:"Console and network",scope:"global",keys:["shift+alt+j"]},{id:"mode.device",label:"Device toolbar",scope:"global",keys:["shift+alt+m"]},{id:"mode.measure",label:"Measure",scope:"global",keys:["shift+alt+u"]},{id:"mode.eyedropper",label:"Eyedropper",scope:"global",keys:["shift+alt+y"]},{id:"mode.overlay",label:"Design overlay",scope:"global",keys:["shift+alt+o"]},{id:"mode.tweak",label:"CSS tweak",scope:"global",keys:["shift+alt+v"]},{id:"mode.record",label:"Record the page",scope:"global",keys:["ctrl+alt+r"]},{id:"mode.a11y",label:"Accessibility check",scope:"global",keys:["shift+alt+h"]},{id:"inspect.parent",label:"Select the parent element",scope:"inspect",keys:["up"]},{id:"inspect.child",label:"Select the first child element",scope:"inspect",keys:["down"]},{id:"inspect.copy",label:"Copy the selected elements",scope:"inspect",keys:["enter","c"]},{id:"inspect.screenshot",label:"Screenshot the element",scope:"inspect",keys:["s"]},{id:"inspect.agent",label:"Send the element to the agent",scope:"inspect",keys:["a"]},{id:"inspect.help",label:"Show these shortcuts",scope:"inspect",keys:["shift+/"]},{id:"inspect.exit",label:"Exit",scope:"inspect",keys:["escape"]},{id:"draw.select",label:"Select and move",scope:"draw",keys:["v"]},{id:"draw.pen",label:"Pen",scope:"draw",keys:["p"]},{id:"draw.pencil",label:"Pencil",scope:"draw",keys:["i"]},{id:"draw.marker",label:"Marker",scope:"draw",keys:["m"]},{id:"draw.brush",label:"Brush",scope:"draw",keys:["u"]},{id:"draw.highlighter",label:"Highlighter",scope:"draw",keys:["h"]},{id:"draw.neon",label:"Neon",scope:"draw",keys:["g"]},{id:"draw.line",label:"Line",scope:"draw",keys:["l"]},{id:"draw.arrow",label:"Arrow",scope:"draw",keys:["a"]},{id:"draw.doubleArrow",label:"Double arrow",scope:"draw",keys:["d"]},{id:"draw.rect",label:"Rectangle",scope:"draw",keys:["r"]},{id:"draw.ellipse",label:"Ellipse",scope:"draw",keys:["o"]},{id:"draw.text",label:"Text",scope:"draw",keys:["t"]},{id:"draw.callout",label:"Numbered callout",scope:"draw",keys:["n"]},{id:"draw.blur",label:"Redact (pixelate)",scope:"draw",keys:["b"]},{id:"draw.eraser",label:"Eraser",scope:"draw",keys:["e"]},...[1,2,3,4,5,6,7,8,9].map(e=>({id:`draw.color${e}`,label:`Color ${e}`,scope:"draw",keys:[String(e)]})),{id:"draw.thinner",label:"Thinner stroke",scope:"draw",keys:["["]},{id:"draw.thicker",label:"Thicker stroke",scope:"draw",keys:["]"]},{id:"draw.fill",label:"Fill shapes on or off",scope:"draw",keys:["f"]},{id:"draw.undo",label:"Undo",scope:"draw",keys:["ctrl+z"]},{id:"draw.redo",label:"Redo",scope:"draw",keys:["ctrl+y","ctrl+shift+z"]},{id:"draw.clear",label:"Clear all drawings",scope:"draw",keys:["shift+backspace"]},{id:"draw.visible",label:"Hide or show drawings",scope:"draw",keys:["w"]},{id:"draw.capture",label:"Screenshot the drawing area",scope:"draw",keys:["enter"]},{id:"draw.captureAgent",label:"Screenshot the drawing area and send it to the agent",scope:"draw",keys:["shift+enter"]},{id:"draw.captureMenu",label:"Screenshot menu",scope:"draw",keys:["s"]},{id:"draw.captureGroups",label:"Screenshot each drawing separately",scope:"draw",keys:["alt+g"]},{id:"draw.captureClean",label:"Screenshot the drawing area without drawings",scope:"draw",keys:["alt+c"]},{id:"draw.captureViewport",label:"Screenshot the visible area with drawings",scope:"draw",keys:["alt+v"]},{id:"draw.captureFullPage",label:"Screenshot the full page with drawings",scope:"draw",keys:["alt+f"]},{id:"draw.captureRegion",label:"Screenshot an area you drag, with drawings",scope:"draw",keys:["alt+r"]},{id:"draw.help",label:"Show these shortcuts",scope:"draw",keys:["shift+/"]},{id:"draw.exit",label:"Stop drawing",scope:"draw",keys:["escape"]},{id:"shot.viewport",label:"Visible area",scope:"screenshot",keys:["v"]},{id:"shot.fullPage",label:"Full page",scope:"screenshot",keys:["f"]},{id:"shot.region",label:"Region",scope:"screenshot",keys:["r"]},{id:"shot.element",label:"Element",scope:"screenshot",keys:["e"]},{id:"shot.drawing",label:"Drawing area",scope:"screenshot",keys:["d"]},{id:"shot.lastToAgent",label:"Send the last screenshot to the agent",scope:"screenshot",keys:["a"],command:ue("screenshot.sendToTerminal")},{id:"send.default",label:"Send to the default agent",scope:"send",keys:["enter"]},{id:"send.newThread",label:"New agentmux thread",scope:"send",keys:["n"]},{id:"send.prompt",label:"Write a prompt",scope:"send",keys:["i"]},{id:"send.project",label:"Change project",scope:"send",keys:["p"]},{id:"send.copy",label:"Copy",scope:"send",keys:["c"]},{id:"send.download",label:"Download",scope:"send",keys:["d"]},{id:"send.close",label:"Close (keep it saved)",scope:"send",keys:["escape"]},{id:"dev.console",label:"Console",scope:"devtools",keys:["alt+1"]},{id:"dev.network",label:"Network",scope:"devtools",keys:["alt+2"]},{id:"dev.filter",label:"Filter",scope:"devtools",keys:["alt+f"]},{id:"dev.copyErrors",label:"Copy console errors",scope:"devtools",keys:["alt+e"]},{id:"dev.copyFailed",label:"Copy failed requests",scope:"devtools",keys:["alt+q"]},{id:"dev.copyContext",label:"Copy page context",scope:"devtools",keys:["alt+p"]},{id:"dev.contextAgent",label:"Send page context to the agent",scope:"devtools",keys:["alt+shift+p"]},{id:"dev.clear",label:"Clear",scope:"devtools",keys:["alt+k"]},{id:"dev.close",label:"Close",scope:"devtools",keys:["alt+w"]},{id:"device.previous",label:"Previous device",scope:"device",keys:["alt+["]},{id:"device.next",label:"Next device",scope:"device",keys:["alt+]"]},{id:"device.rotate",label:"Rotate",scope:"device",keys:["alt+r"]},{id:"device.touch",label:"Touch and mobile on or off",scope:"device",keys:["alt+t"]},{id:"device.fit",label:"Fit to window",scope:"device",keys:["alt+0"]},{id:"device.zoomIn",label:"Zoom in",scope:"device",keys:["alt+="]},{id:"device.zoomOut",label:"Zoom out",scope:"device",keys:["alt+-"]},{id:"device.network",label:"Next network speed",scope:"device",keys:["alt+n"]},{id:"device.theme",label:"Next color scheme",scope:"device",keys:["alt+l"]},{id:"device.close",label:"Close the device toolbar",scope:"device",keys:[]},{id:"measure.grid",label:"Rulers and grid on or off",scope:"measure",keys:["g"]},{id:"measure.copy",label:"Copy the measurements",scope:"measure",keys:["c"]},{id:"measure.clear",label:"Clear the pinned element",scope:"measure",keys:["backspace"]},{id:"measure.help",label:"Show these shortcuts",scope:"measure",keys:["shift+/"]},{id:"measure.exit",label:"Exit",scope:"measure",keys:["escape"]},{id:"eyedropper.hex",label:"Copy colors as hex",scope:"eyedropper",keys:["h"]},{id:"eyedropper.rgb",label:"Copy colors as rgb()",scope:"eyedropper",keys:["r"]},{id:"eyedropper.hsl",label:"Copy colors as hsl()",scope:"eyedropper",keys:["l"]},{id:"eyedropper.help",label:"Show these shortcuts",scope:"eyedropper",keys:["shift+/"]},{id:"eyedropper.exit",label:"Exit",scope:"eyedropper",keys:["escape"]},{id:"overlay.open",label:"Open an image",scope:"overlay",keys:["alt+o"]},{id:"overlay.fainter",label:"Less opaque",scope:"overlay",keys:["alt+,"]},{id:"overlay.stronger",label:"More opaque",scope:"overlay",keys:["alt+."]},{id:"overlay.left",label:"Nudge left",scope:"overlay",keys:["alt+left"]},{id:"overlay.right",label:"Nudge right",scope:"overlay",keys:["alt+right"]},{id:"overlay.up",label:"Nudge up",scope:"overlay",keys:["alt+up"]},{id:"overlay.down",label:"Nudge down",scope:"overlay",keys:["alt+down"]},{id:"overlay.difference",label:"Difference blend on or off",scope:"overlay",keys:["alt+x"]},{id:"overlay.hide",label:"Hide or show the overlay",scope:"overlay",keys:["alt+h"]},{id:"overlay.exit",label:"Close the overlay",scope:"overlay",keys:["alt+z"]},{id:"tweak.agent",label:"Send the CSS changes to the agent",scope:"tweak",keys:["ctrl+enter"]},{id:"tweak.copy",label:"Copy the CSS changes",scope:"tweak",keys:["ctrl+shift+c"]},{id:"tweak.undo",label:"Undo the last change",scope:"tweak",keys:["ctrl+z"]},{id:"tweak.exit",label:"Exit and revert",scope:"tweak",keys:["escape"]},{id:"record.stop",label:"Stop and save",scope:"record",keys:["alt+s"]},{id:"record.pause",label:"Pause or resume",scope:"record",keys:["alt+y"]},{id:"record.cancel",label:"Cancel",scope:"record",keys:["alt+backspace"]},{id:"a11y.next",label:"Next issue",scope:"a11y",keys:["n","down"]},{id:"a11y.previous",label:"Previous issue",scope:"a11y",keys:["p","up"]},{id:"a11y.tabOrder",label:"Tab order on or off",scope:"a11y",keys:["t"]},{id:"a11y.copy",label:"Copy the report",scope:"a11y",keys:["c"]},{id:"a11y.agent",label:"Send the report to the agent",scope:"a11y",keys:["a"]},{id:"a11y.help",label:"Show these shortcuts",scope:"a11y",keys:["shift+/"]},{id:"a11y.exit",label:"Exit",scope:"a11y",keys:["escape"]}];function ul(e,t){return t?[...e.mac??e.keys.map(n=>n.replace(/\bctrl\+/,"cmd+"))]:[...e.keys]}function Es(e){let t=pp(e.trim());return t.key?[t.ctrl&&"ctrl",t.shift&&"shift",t.alt&&"alt",t.meta&&"cmd",t.key].filter(Boolean).join("+"):""}function Ts(e,t){let n={};for(let o of kn){let a=e[o.id],i=(a===void 0?ul(o,t):typeof a=="string"?[a]:[...a]).map(Es);n[o.id]=[...new Set(i.filter(Boolean))]}return n}function ty(e){if(!e||typeof e!="object"||Array.isArray(e))return{};let t=new Set(kn.map(o=>o.id)),n={};for(let[o,a]of Object.entries(e))t.has(o)&&(typeof a=="string"||Array.isArray(a)&&a.every(i=>typeof i=="string"))&&(n[o]=a);return n}var $0=new Set(["devtools","device","overlay","record"]);function ny(e){let t=new Map(kn.map(a=>[a.id,a.scope])),n=new Map;for(let[a,i]of Object.entries(e))for(let r of i)n.set(r,[...n.get(r)??[],a]);let o=[];for(let[a,i]of n)for(let r=0;r<i.length;r++)for(let l=r+1;l<i.length;l++){let[c,s]=[t.get(i[r]),t.get(i[l])];(c===s||$0.has(c)&&$0.has(s))&&o.push({key:a,ids:[i[r],i[l]]})}return o}function dl(e,t,n){let o=Cs(n);for(let a of t){let i=kn.find(r=>r.scope===a&&(e[r.id]??[]).includes(o));if(i)return i}}function Cs(e){return[e.ctrl&&"ctrl",e.shift&&"shift",e.alt&&"alt",e.meta&&"cmd",e.key].filter(Boolean).join("+")}var fp=new Set(["mode.inspect","mode.draw","mode.screenshot","mode.device","mode.devtools","page.bookmark","open.shortcuts","inspect.parent","inspect.child","inspect.copy","inspect.exit",...["select","pen","pencil","marker","brush","highlighter","neon","line","arrow","doubleArrow","rect","ellipse","text","callout","blur","eraser"].map(e=>`draw.${e}`),...Array.from({length:9},(e,t)=>`draw.color${t+1}`),"draw.thinner","draw.thicker","draw.fill","draw.undo","draw.redo","draw.clear","draw.visible","draw.capture","draw.captureMenu","draw.captureGroups","draw.captureClean","draw.captureViewport","draw.captureFullPage","draw.captureRegion","draw.exit","shot.viewport","shot.fullPage","shot.region","shot.element","shot.drawing","send.default","send.newThread","send.prompt","send.project","send.copy","send.download","send.close"]),VE=new Set([]),J0={id:"vs",label:"VS",title:"Works in VS Code Browser"},I0={id:"br",label:"BR",title:"Works in the Inkspect toolbar in your browser (Chrome, Edge, Firefox...)"};function oy(e){return VE.has(e.scope)?[I0]:fp.has(e.id)?[J0,I0]:[J0]}var KE={control:"ctrl",ctl:"ctrl","\u2303":"ctrl",option:"alt",opt:"alt","\u2325":"alt",command:"cmd",meta:"cmd",win:"cmd",super:"cmd","\u2318":"cmd","\u21E7":"shift",esc:"escape",return:"enter","\u21A9":"enter",del:"delete","\u2191":"up","\u2193":"down","\u2190":"left","\u2192":"right",pgup:"pageup",pgdn:"pagedown","+":"="},F0=new Set(["ctrl","shift","alt","cmd"]);function ay(e,t){let n=t.toLowerCase().replace(/([⌃⌥⇧⌘↩↑↓←→])/g," $1 ").split(/\s+|[+-](?=.)/).filter(Boolean).map(c=>KE[c]??c);if(!n.length)return!1;let o=n.filter(c=>F0.has(c)),a=n.filter(c=>!F0.has(c));if(a.length>1)return!1;let i=pp(Es(e)),r={ctrl:i.ctrl,shift:i.shift,alt:i.alt,cmd:i.meta};if(!o.every(c=>r[c]))return!1;let[l]=a;return l===void 0||i.key.startsWith(l)}function iy(e){if(!e.key)return;let t=/^f([1-9]|1\d|2[0-4])$/.test(e.key);return e.ctrl||e.alt||e.meta||t?Cs(e):void 0}function Vi(e,t){let n=Ft(e,t);return t?[...[...n.matchAll(/[⌃⌥⇧⌘]/g)].map(a=>a[0]),n.replace(/[⌃⌥⇧⌘]/g,"")]:n.split(/\+(?=.)/)}var ry={global:"browser",inspect:"inspect",draw:"edit",screenshot:"device-camera",devtools:"debug-console",device:"device-mobile",measure:"symbol-ruler",eyedropper:"symbol-color",overlay:"layers",tweak:"symbol-property",record:"record",a11y:"accessibility",send:"send"};function Ft(e,t){let n=pp(e),o={escape:"Esc",enter:t?"\u21A9":"Enter",backspace:t?"\u232B":"Backspace",delete:t?"\u2326":"Delete",up:"\u2191",down:"\u2193",left:"\u2190",right:"\u2192",pageup:"PgUp",pagedown:"PgDn",tab:t?"\u21E5":"Tab",space:"Space","/":n.shift?"?":"/"},a=!(n.key==="/"&&n.shift),i=o[n.key]??(n.key.length===1?n.key.toUpperCase():n.key[0].toUpperCase()+n.key.slice(1));return t?`${n.ctrl?"\u2303":""}${n.alt?"\u2325":""}${n.shift&&a?"\u21E7":""}${n.meta?"\u2318":""}${i}`:[n.ctrl&&"Ctrl",n.alt&&"Alt",n.shift&&a&&"Shift",i].filter(Boolean).join("+")}function pp(e){let t=e.toLowerCase().split("+"),n=t.pop()??"";return{ctrl:t.includes("ctrl"),shift:t.includes("shift"),alt:t.includes("alt"),meta:t.includes("cmd")||t.includes("meta")||t.includes("win"),key:n}}var XE={arrowleft:"left",arrowright:"right",arrowup:"up",arrowdown:"down",esc:"escape"," ":"space","+":"="},W0={Equal:"=",Minus:"-",BracketLeft:"[",BracketRight:"]",Slash:"/",Backslash:"\\",Comma:",",Period:".",Semicolon:";",Quote:"'",Backquote:"`",NumpadAdd:"=",NumpadSubtract:"-"},Ns=new Set(["Control","Shift","Alt","Meta","AltGraph","OS"]),ey={"?":"/","<":",",">":".",":":";",'"':"'","{":"[","}":"]","|":"\\","~":"`",_:"-","+":"=","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0"};function fo(e){let t={ctrl:e.ctrlKey,shift:e.shiftKey,alt:e.altKey,meta:e.metaKey};if(e.getModifierState?.("AltGraph"))return{...t,key:""};let n=e.key,o;return/^[a-z0-9]$/i.test(n)?o=n.toLowerCase():e.shiftKey&&ey[n]!==void 0?o=ey[n]:/^[-=[\]\\/,.;'`+]$/.test(n)?o=n:/^Key[A-Z]$/.test(e.code)?o=e.code.slice(3).toLowerCase():/^Digit\d$/.test(e.code)?o=e.code.slice(5):W0[e.code]?o=W0[e.code]:o=n.toLowerCase(),{...t,key:XE[o]??o}}var za=L(q(),1);function As({icon:e,trailing:t,size:n="md",onClear:o,invalid:a,className:i,disabled:r,...l}){let c=l.value!==void 0&&String(l.value)!=="";return(0,za.jsxs)("div",{className:re("text-field",`size-${n}`,a&&"invalid",r&&"disabled",i),children:[e&&(0,za.jsx)("span",{className:`codicon codicon-${e} text-field-icon`,"aria-hidden":"true"}),(0,za.jsx)("input",{spellCheck:!1,...l,disabled:r,"aria-invalid":a||void 0}),o&&c&&(0,za.jsx)("button",{type:"button",className:"text-field-clear","aria-label":"Clear",title:"Clear",tabIndex:-1,onClick:o,children:(0,za.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})}),t]})}var fy=L(q(),1),ZE=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),po=null;function uy(e){return po?(po(e),!0):!1}typeof window<"u"&&window.addEventListener("keydown",e=>{if(!po||Ns.has(e.key))return;e.stopImmediatePropagation();let t=iy(fo(e));t&&(e.preventDefault(),po(t))},!0);function dy({value:e,onChange:t,size:n}){let o=(0,Oa.useRef)(t);(0,Oa.useEffect)(()=>{o.current=t});let[a]=(0,Oa.useState)(()=>i=>o.current(Ft(i,ZE)));return(0,Oa.useEffect)(()=>()=>{po===a&&(po=null)},[a]),(0,fy.jsx)(As,{size:n,icon:"search",placeholder:"Search actions or keys, or press a shortcut","aria-label":"Search shortcuts: type, or press a shortcut",value:e,onChange:i=>t(i.target.value),onClear:()=>t(""),onFocus:()=>{po=a},onBlur:()=>{po===a&&(po=null)}})}var B=L(je());var my=["pen","pencil","marker","brush","highlighter","neon"],mp=["line","arrow","doubleArrow","rect","ellipse","blur"];function Os(e,t){if(!t)return e;let n=[];for(let o of e){if(!o.anchor){n.push(o);continue}let a=t[o.anchor];a&&n.push(Rs(o,-a.x,-a.y))}return n}function gy(e){try{let t=new URL(e);return/^#!?\//.test(t.hash)||(t.hash=""),t.href}catch{return e}}function hy(e,t){let n=Math.max(e.x,t.x),o=Math.max(e.y,t.y),a=Math.min(e.x+e.width,t.x+t.width),i=Math.min(e.y+e.height,t.y+t.height);return a>n&&i>o?{x:n,y:o,width:a-n,height:i-o}:void 0}var Ki=["#ff3b30","#ff9500","#ffcc00","#34c759","#00c7be","#007aff","#af52de","#ffffff","#000000"],Ra={color:"#ff3b30",width:4,opacity:1,dash:"solid",fill:!1};function gp(e){return 12+e.width*2}function hp(e){return 10+e.width}function fl(e){let t=e.style.width/2+(e.kind==="stroke"&&e.tool==="neon"?8:0),n;switch(e.kind){case"stroke":n=e.points.map(([o,a])=>[o,a]);break;case"text":{let o=gp(e.style),a=e.text.split(`
`),i=Math.max(...a.map(r=>r.length))*o*.6;n=[e.at,[e.at[0]+i,e.at[1]+a.length*o*1.25]];break}case"callout":{let o=hp(e.style);n=[[e.at[0]-o,e.at[1]-o],[e.at[0]+o,e.at[1]+o]];break}default:{let o=e.kind==="arrow"||e.kind==="doubleArrow"?bp(e.style):0;return n=[e.start,e.end],zs(py(n),t+o)}}return zs(py(n),t)}function bp(e){return 8+e.width*2.5}function py(e){let t=e.map(i=>i[0]),n=e.map(i=>i[1]),o=Math.min(...t),a=Math.min(...n);return{x:o,y:a,width:Math.max(...t)-o,height:Math.max(...n)-a}}function zs(e,t){return{x:e.x-t,y:e.y-t,width:e.width+t*2,height:e.height+t*2}}function by(e){if(!e.length)return;let t=Math.min(...e.map(i=>i.x)),n=Math.min(...e.map(i=>i.y)),o=Math.max(...e.map(i=>i.x+i.width)),a=Math.max(...e.map(i=>i.y+i.height));return{x:t,y:n,width:o-t,height:a-n}}function PE(e,t){let n=Math.max(0,e.x),o=Math.max(0,e.y),a=t?Math.min(t.width,e.x+e.width):e.x+e.width,i=t?Math.min(t.height,e.y+e.height):e.y+e.height;return{x:n,y:o,width:Math.max(1,a-n),height:Math.max(1,i-o)}}function vy(e,t){let n=by(e.map(fl));return n&&PE(zs(n,t))}function $E(e,t,n){return e.x-n<=t.x+t.width&&t.x-n<=e.x+e.width&&e.y-n<=t.y+t.height&&t.y-n<=e.y+e.height}function yy(e,t){let n=[];for(let o of e){let a=fl(o),i=n.filter(l=>$E(l.bounds,a,t)),r={shapes:[...i.flatMap(l=>l.shapes),o],bounds:by([a,...i.map(l=>l.bounds)])};for(let l of i)n.splice(n.indexOf(l),1);n.push(r)}return n.sort((o,a)=>o.bounds.y-a.bounds.y).map(o=>o.shapes)}function xy(e,t,n){let o=zs(fl(e),n);if(!(t[0]>=o.x&&t[0]<=o.x+o.width&&t[1]>=o.y&&t[1]<=o.y+o.height))return!1;if(e.kind==="stroke"){let i=n+e.style.width/2;return e.points.some(([r,l])=>Math.hypot(r-t[0],l-t[1])<=i+4)}return e.kind==="line"||e.kind==="arrow"||e.kind==="doubleArrow"?JE(t,e.start,e.end)<=n+e.style.width/2:!0}function JE(e,t,n){let o=n[0]-t[0],a=n[1]-t[1],i=o*o+a*a,r=i?Math.max(0,Math.min(1,((e[0]-t[0])*o+(e[1]-t[1])*a)/i)):0;return Math.hypot(e[0]-(t[0]+r*o),e[1]-(t[1]+r*a))}function Rs(e,t,n){let o=([a,i])=>[a+t,i+n];switch(e.kind){case"stroke":return{...e,points:e.points.map(([a,i,r])=>[a+t,i+n,r])};case"text":case"callout":return{...e,at:o(e.at)};default:return{...e,start:o(e.start),end:o(e.end)}}}function wy(e,t,n){let o=n[0]-t[0],a=n[1]-t[1];if(e==="rect"||e==="ellipse"||e==="blur"){let l=Math.max(Math.abs(o),Math.abs(a));return[t[0]+Math.sign(o||1)*l,t[1]+Math.sign(a||1)*l]}let i=Math.round(Math.atan2(a,o)/(Math.PI/4))*(Math.PI/4),r=Math.hypot(o,a);return[t[0]+Math.cos(i)*r,t[1]+Math.sin(i)*r]}function ky(e){if(!Array.isArray(e))return[];let t=n=>Array.isArray(n)&&n.length>=2&&n.every(o=>typeof o=="number"&&Number.isFinite(o));return e.filter(n=>{if(typeof n!="object"||n===null)return!1;let o=n,a=o.style;if(typeof o.id!="string"||o.anchor!==void 0&&(typeof o.anchor!="string"||o.anchor.length>1e3)||typeof a?.color!="string"||typeof a.width!="number")return!1;switch(o.kind){case"stroke":return Array.isArray(o.points)&&o.points.length>0&&o.points.length<2e4&&o.points.every(t);case"text":return t(o.at)&&typeof o.text=="string"&&o.text.length<5e3;case"callout":return t(o.at)&&typeof o.number=="number";default:return mp.includes(o.kind)&&t(o.start)&&t(o.end)}}).slice(0,2e3)}function Sy(e,t,n){let o=["data-testid","data-test","data-cy","data-qa","aria-label","name"],a=h=>/^(css|sc|jsx|emotion|svelte)-|__[a-z0-9]{5,}$|[_-][a-f0-9]{6,}$|\d{3,}|[:[\]/()]/i.test(h),i=h=>{try{return t(h)===1}catch{return!1}},r=h=>{let f=h.tagName.toLowerCase(),p=[];h.id&&!a(h.id)&&p.push(`#${n(h.id)}`);for(let w of o){let T=h.getAttribute(w);T&&T.length<80&&p.push(`${f}[${w}="${T.replace(/"/g,'\\"')}"]`)}let x=Array.from(h.classList).filter(w=>!a(w)).slice(0,3).map(w=>`.${n(w)}`);return x.length&&p.push(f+x.join("")),p.push(f),p},l=h=>{let f=h.tagName.toLowerCase(),p=h.parentElement;if(!p)return f;let x=Array.from(p.children).filter(w=>w.tagName===h.tagName);return x.length>1?`${f}:nth-of-type(${x.indexOf(h)+1})`:f};for(let h of r(e))if(i(h))return h;let c=r(e).find(h=>h!==e.tagName.toLowerCase())??l(e);i(c)||(c=l(e));let s=e.parentElement;for(;s&&!i(c);){let h=r(s).find(f=>i(f));if(h)return c=`${h} > ${c}`,i(c)?c:`${h} > ${g(e,s,l)}`;c=`${l(s)} > ${c}`,s=s.parentElement}return c;function g(h,f,p){let x=[];for(let w=h;w&&w!==f;w=w.parentElement)x.unshift(p(w));return x.join(" > ")}}function Ey(e){let t=[];for(let n=e;n;n=n.parentElement){let o=n.tagName.toLowerCase(),a=n.parentElement,i=a?Array.from(a.children).filter(r=>r.tagName===n.tagName):[];t.unshift(i.length>1?`${o}[${i.indexOf(n)+1}]`:o)}return`/${t.join("/")}`}var vp=["page","selector","xpath","role","component","box","text","styles","attributes","html"];function pl(e){return`${e.tag}${e.id?`#${e.id}`:""}${e.classes.slice(0,3).map(t=>`.${t}`).join("")}`}function IE(e){let t=e.file?` (${e.file}${e.line?`:${e.line}`:""})`:"";return`\`<${e.name}>\`${t} [${e.framework}]`}function yp(e,t,n=vp){switch(t){case"selector":return e.map(o=>o.selector).join(`
`);case"html":return e.map(o=>o.html).join(`

`);case"json":{let o=a=>{let i={element:pl(a)};return n.includes("page")&&(i.page={url:a.pageUrl,title:a.pageTitle,viewport:a.viewport,frameUrl:a.frameUrl}),n.includes("selector")&&(i.selector=a.selector),n.includes("xpath")&&(i.xpath=a.xpath),n.includes("role")&&(i.role=a.role?{role:a.role,name:a.name}:void 0),n.includes("component")&&(i.component=a.component),n.includes("box")&&(i.box=a.rect),n.includes("text")&&(i.text=a.text),n.includes("styles")&&(i.styles=a.styles),n.includes("attributes")&&(i.attributes=a.attributes),n.includes("html")&&(i.html=a.html),a.screenshot&&(i.screenshot=a.screenshot),i};return JSON.stringify(e.length===1?o(e[0]):e.map(o),null,2)}case"markdown":return e.map((o,a)=>{let i=[`### ${e.length>1?`${a+1}. `:""}Element: \`${pl(o)}\``];if(n.includes("page")&&(i.push(`- Page: ${o.pageUrl} (${o.viewport.width}\xD7${o.viewport.height})`),o.frameUrl&&i.push(`- Frame: ${o.frameUrl}`)),n.includes("selector")&&i.push(`- Selector: \`${o.selector}\``),n.includes("xpath")&&i.push(`- XPath: \`${o.xpath}\``),n.includes("role")&&o.role&&i.push(`- Role/name: ${o.role}${o.name?` "${o.name}"`:""}`),n.includes("component")&&o.component&&i.push(`- Component: ${IE(o.component)}`),n.includes("box")){let r=o.rect;i.push(`- Box: ${Math.round(r.width)}\xD7${Math.round(r.height)} at (${Math.round(r.x)}, ${Math.round(r.y)})`)}if(n.includes("text")&&o.text&&i.push(`- Text: "${o.text}"`),n.includes("styles")){let r=Object.entries(o.styles).map(([l,c])=>`${l}:${c}`).join("; ");r&&i.push(`- Styles: ${r}`)}if(n.includes("attributes")){let r=Object.entries(o.attributes).filter(([l])=>l!=="class"&&l!=="id"&&l!=="style").map(([l,c])=>`${l}="${c}"`).join(" ");r&&i.push(`- Attributes: ${r}`)}return o.screenshot&&i.push(`- Screenshot: ${o.screenshot}`),n.includes("html")&&i.push("```html",o.html,"```"),i.join(`
`)}).join(`

`)}}var FE=["display","position","width","height","margin","padding","color","background-color","font-family","font-size","font-weight","line-height","border","border-radius","z-index","flex-direction","justify-content","align-items","gap","grid-template-columns","opacity","overflow"];function Ty(e,t,n){let o=e.ownerDocument,a=o.defaultView||window,i=e.getRootNode(),r="querySelectorAll"in i?i:o,l=d=>a.CSS&&a.CSS.escape?a.CSS.escape(d):d,c=n.buildSelector(e,d=>r.querySelectorAll(d).length,l);if(r!==o&&"host"in r&&r.host){let d=r.host.getRootNode();c=n.buildSelector(r.host,v=>("querySelectorAll"in d?d:o).querySelectorAll(v).length,l)+" >>> "+c}let s=e.getBoundingClientRect(),g={};for(let d of Array.from(e.attributes||[]))g[d.name]=d.value.slice(0,300);let f=(e.innerText||e.textContent||"").replace(/\s+/g," ").trim().slice(0,200)||void 0,p=e.outerHTML||"";if(p.length>t){let d=e.cloneNode(!1);e.children.length?d.innerHTML="\u2026":d.textContent=(e.textContent||"").slice(0,80)+"\u2026",p=d.outerHTML.slice(0,t)}let x=a.getComputedStyle(e),w={};for(let d of n.styleProperties){let b=x.getPropertyValue(d);!b||/^(none|normal|auto|0px|static|visible|1|rgba\(0, 0, 0, 0\)|0px none .*)$/.test(b)||(w[d]=b.length>80?b.slice(0,80)+"\u2026":b)}let T=(()=>{try{let d=e,b=Object.keys(d).find(k=>k.startsWith("__reactFiber$")||k.startsWith("__reactInternalInstance$"));if(b)for(let k=d[b];k;k=k.return){let S=k.type;if(!S||typeof S=="string")continue;let M=S.displayName||S.name||S.render&&(S.render.displayName||S.render.name);if(!M)continue;let A=k._debugSource&&k._debugSource.fileName,D=k._debugSource&&k._debugSource.lineNumber,H=k._debugStack&&k._debugStack.stack;if(!A&&typeof H=="string"){let Y=H.split(`
`).slice(1).find(z=>!/node_modules|react-dom|react-stack|jsx-dev-runtime|chunk-/.test(z))||"",ne=/\(?((?:https?|file|webpack[\w-]*):\/\/[^\s)]+?):(\d+):\d+\)?\s*$/.exec(Y);ne&&(A=ne[1],D=Number(ne[2]))}return{framework:"react",name:M,file:A,line:D}}let v=d.__vueParentComponent;if(v){let k=v.type||{},S=k.__file;return{framework:"vue",name:k.name||k.__name||(S?String(S).split("/").pop().replace(/\.vue$/,""):"Anonymous"),file:S}}if(d.__vue__){let k=d.__vue__.$options||{};return{framework:"vue",name:k.name||k._componentTag||"Anonymous",file:k.__file}}for(let k=d;k;k=k.parentElement)if(k.__svelte_meta){let S=k.__svelte_meta.loc||{};return{framework:"svelte",name:S.file?String(S.file).split("/").pop().replace(/\.svelte$/,""):"Component",file:S.file,line:typeof S.line=="number"?S.line+1:void 0}}let E=a.ng;if(E&&E.getOwningComponent){let k=E.getComponent(e)||E.getOwningComponent(e);if(k)return{framework:"angular",name:k.constructor.name}}}catch{}})(),m=a.location.href,u=o.title;try{m=a.top.location.href,u=a.top.document.title}catch{}return{tag:e.tagName.toLowerCase(),id:e.id||void 0,classes:Array.from(e.classList||[]),selector:c,xpath:n.buildXPath(e),text:f,html:p,attributes:g,rect:{x:s.x,y:s.y,width:s.width,height:s.height},styles:w,component:T,pageUrl:m,pageTitle:u,viewport:{width:a.innerWidth,height:a.innerHeight},frameUrl:a!==a.top?a.location.href:void 0,scroll:{x:a.scrollX,y:a.scrollY}}}var Cy={buildSelector:Sy,buildXPath:Ey,styleProperties:FE};var WE={a:"link",article:"article",aside:"complementary",button:"button",dialog:"dialog",footer:"contentinfo",form:"form",h1:"heading",h2:"heading",h3:"heading",h4:"heading",h5:"heading",h6:"heading",header:"banner",hr:"separator",img:"img",li:"listitem",main:"main",nav:"navigation",ol:"list",option:"option",progress:"progressbar",section:"region",select:"combobox",table:"table",textarea:"textbox",ul:"list"},e2={button:"button",checkbox:"checkbox",email:"textbox",image:"button",number:"spinbutton",radio:"radio",range:"slider",reset:"button",search:"searchbox",submit:"button",tel:"textbox",text:"textbox",url:"textbox"},t2=new Set(["button","link","heading","listitem","option","tab","menuitem","cell"]);function Ds(e){let t=e.tagName.toLowerCase(),n=e.getAttribute("role")?.split(/\s+/)[0]||void 0;n||(t==="input"?n=e2[(e.getAttribute("type")||"text").toLowerCase()]:t==="a"?n=e.hasAttribute("href")?"link":void 0:t==="section"?n=e.hasAttribute("aria-label")?"region":void 0:n=WE[t]);let o=r=>(r||"").replace(/\s+/g," ").trim().slice(0,200)||void 0,a=e.getAttribute("aria-labelledby"),i;if(a&&(i=o(a.split(/\s+/).map(r=>e.ownerDocument.getElementById(r)?.textContent||"").join(" "))),i??=o(e.getAttribute("aria-label")),!i&&(t==="img"||t==="area")&&(i=o(e.getAttribute("alt"))),!i&&"labels"in e){let r=e.labels;r?.length&&(i=o(Array.from(r,l=>l.textContent).join(" ")))}if(!i&&t==="input"){let r=e;["button","submit","reset"].includes(r.type)&&(i=o(r.value)),i??=o(r.placeholder)}return!i&&n&&t2.has(n)&&(i=o(e.innerText||e.textContent)),i??=o(e.getAttribute("title")),{role:n||"generic",name:i}}function Ny(e){let t=e.parentElement||(e.getRootNode().host??null);return t&&t.tagName!=="HTML"?t:null}function My(e){return e.firstElementChild||e.shadowRoot?.firstElementChild||null}var ml=(e,t,n,o,a,i)=>({id:e,name:t,group:"Phones",width:n,height:o,dpr:a,mobile:!0,touch:!0,userAgent:i}),xp=(e,t,n,o,a,i)=>({id:e,name:t,group:"Tablets",width:n,height:o,dpr:a,mobile:!0,touch:!0,userAgent:i}),Xi=(e,t,n)=>({id:`desktop-${e}x${t}`,name:`${n} ${e}\xD7${t}`,group:"Desktops",width:e,height:t,dpr:1,mobile:!1,touch:!1,userAgent:"desktop"}),Gi=[ml("iphone-se","iPhone SE",375,667,2,"iphone"),ml("iphone-16-pro","iPhone 16 Pro",402,874,3,"iphone"),ml("iphone-16-pro-max","iPhone 16 Pro Max",440,956,3,"iphone"),ml("pixel-8","Pixel 8",412,915,2.625,"android"),ml("galaxy-s24","Galaxy S24",360,780,3,"android"),xp("ipad-mini","iPad Mini",768,1024,2,"ipad"),xp("ipad-pro",'iPad Pro 12.9"',1024,1366,2,"ipad"),xp("surface-pro","Surface Pro 7",912,1368,2,"desktop"),Xi(1280,800,"Laptop"),Xi(1366,768,"Laptop"),Xi(1440,900,"Laptop"),Xi(1920,1080,"Full HD"),Xi(2560,1440,"QHD"),Xi(3840,2160,"4K")],Ay={none:{label:"No throttling",offline:!1,latency:0,download:-1,upload:-1},offline:{label:"Offline",offline:!0,latency:0,download:0,upload:0},slow3g:{label:"Slow 3G",offline:!1,latency:2e3,download:5e4,upload:5e4},fast3g:{label:"Fast 3G",offline:!1,latency:562.5,download:18e4,upload:84375},fast4g:{label:"Fast 4G",offline:!1,latency:165,download:1012500,upload:168750}},zy=[1,4,6];var wp=50,kp=7680;function _s(e){return{presetId:e.id,width:e.width,height:e.height,dpr:e.dpr,mobile:e.mobile,touch:e.touch,userAgent:e.userAgent}}function Oy(e){return{...e,width:e.height,height:e.width}}function Ry(e,t,n){return e!=="fit"?e:!n.width||!n.height?1:Math.min(1,n.width/t.width,n.height/t.height)}function Hs(e){return!!e.error||e.status!==void 0&&e.status>=400}function Dy(e){if(!e.url)return"";let t=e.line!==void 0?`:${e.line+1}`:"",n=e.line!==void 0&&e.column!==void 0?`:${e.column+1}`:"";return`${e.url}${t}${n}`}function _y(e,t,n=!1){let o=e.filter(i=>i.level==="error"||n&&i.level==="warning");if(!o.length)return`### Console errors: ${t}
No errors.`;let a=[`### Console errors: ${t} (${o.length})`];return o.forEach((i,r)=>{let[l,...c]=i.text.split(`
`);a.push(`${r+1}. ${i.level==="warning"?"[warning] ":""}${l}`);for(let g of c.slice(0,8))a.push(`   ${g.trim()}`);let s=Dy(i);s&&!i.text.includes(s)&&a.push(`   at ${s}`)}),a.join(`
`)}function Hy(e){let t=e.error?e.canceled?"canceled":e.error:`${e.status}${e.mimeType?` ${e.mimeType}`:""}`,n=e.duration!==void 0?`, ${Math.round(e.duration)} ms`:"";return`- ${e.method} ${e.url} \u2192 ${t} (${e.type}${n})`}function Ly(e,t){let n=e.filter(Hs);return n.length?[`### Failed network requests: ${t} (${n.length})`,...n.map(Hy)].join(`
`):`### Failed network requests: ${t}
No failed requests.`}function By(e){let t=["### Page context",`- URL: ${e.url}`,`- Title: ${e.title}`,`- Viewport: ${e.viewport.width}\xD7${e.viewport.height}${e.device?` (emulating ${e.device})`:""}`];e.selection&&t.push(`- Selected text: "${e.selection.slice(0,500)}"`);let n=e.console.filter(a=>a.level==="error").slice(-5);if(n.length){t.push("",`Recent console errors (${n.length}):`);for(let a of n){let i=Dy(a);t.push(`- ${a.text.split(`
`)[0]}${i?` (${i})`:""}`)}}let o=e.network.filter(Hs).slice(-5);return o.length&&t.push("",`Failed requests (${o.length}):`,...o.map(Hy)),t.join(`
`)}var{PI:n2}=Math,gl=n2+1e-4,Uy=.5,jy=[1,1];function qy(e,t,n,o=a=>a){return e*o(.5-t*(.5-n))}var{min:Sp}=Math;function $y(e,t,n){let o=Sp(1,t/n);return Sp(1,e+(Sp(1,1-o)-e)*(o*.275))}function o2(e){return[-e[0],-e[1]]}function Vn(e,t){return[e[0]+t[0],e[1]+t[1]]}function Yy(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e}function Fo(e,t){return[e[0]-t[0],e[1]-t[1]]}function Cp(e,t,n){return e[0]=t[0]-n[0],e[1]=t[1]-n[1],e}function Io(e,t){return[e[0]*t,e[1]*t]}function Ep(e,t,n){return e[0]=t[0]*n,e[1]=t[1]*n,e}function a2(e,t){return[e[0]/t,e[1]/t]}function Jy(e){return[e[1],-e[0]]}function Tp(e,t){let n=t[0];return e[0]=t[1],e[1]=-n,e}function Vy(e,t){return e[0]*t[0]+e[1]*t[1]}function i2(e,t){return e[0]===t[0]&&e[1]===t[1]}function r2(e){return Math.hypot(e[0],e[1])}function Ky(e,t){let n=e[0]-t[0],o=e[1]-t[1];return n*n+o*o}function Iy(e){return a2(e,r2(e))}function l2(e,t){return Math.hypot(e[1]-t[1],e[0]-t[0])}function Np(e,t,n){let o=Math.sin(n),a=Math.cos(n),i=e[0]-t[0],r=e[1]-t[1],l=i*a-r*o,c=i*o+r*a;return[l+t[0],c+t[1]]}function Xy(e,t,n,o){let a=Math.sin(o),i=Math.cos(o),r=t[0]-n[0],l=t[1]-n[1],c=r*i-l*a,s=r*a+l*i;return e[0]=c+n[0],e[1]=s+n[1],e}function Gy(e,t,n){return Vn(e,Io(Fo(t,e),n))}function c2(e,t,n,o){let a=n[0]-t[0],i=n[1]-t[1];return e[0]=t[0]+a*o,e[1]=t[1]+i*o,e}function Fy(e,t,n){return Vn(e,Io(t,n))}var ht=[0,0],$o=[0,0],Jo=[0,0];function s2(e,t){let n=Fy(e,Iy(Jy(Fo(e,Vn(e,[1,1])))),-t),o=[],a=1/13;for(let i=a;i<=1;i+=a)o.push(Np(n,e,gl*2*i));return o}function u2(e,t,n){let o=[],a=1/n;for(let i=a;i<=1;i+=a)o.push(Np(t,e,gl*i));return o}function d2(e,t,n){let o=Fo(t,n),a=Io(o,.5),i=Io(o,.51);return[Fo(e,a),Fo(e,i),Vn(e,i),Vn(e,a)]}function f2(e,t,n,o){let a=[],i=Fy(e,t,n),r=1/o;for(let l=r;l<1;l+=r)a.push(Np(i,e,gl*3*l));return a}function p2(e,t,n){return[Vn(e,Io(t,n)),Vn(e,Io(t,n*.99)),Fo(e,Io(t,n*.99)),Fo(e,Io(t,n))]}function Qy(e,t,n){return e===!1||e===void 0?0:e===!0?Math.max(t,n):e}function m2(e,t,n){return e.slice(0,10).reduce((o,a)=>{let i=a.pressure;return t&&(i=$y(o,a.distance,n)),(o+i)/2},e[0].pressure)}function g2(e,t={}){let{size:n=16,smoothing:o=.5,thinning:a=.5,simulatePressure:i=!0,easing:r=O=>O,start:l={},end:c={},last:s=!1}=t,{cap:g=!0,easing:h=O=>O*(2-O)}=l,{cap:f=!0,easing:p=O=>--O*O*O+1}=c;if(e.length===0||n<=0)return[];let x=e[e.length-1].runningLength,w=Qy(l.taper,n,x),T=Qy(c.taper,n,x),m=(n*o)**2,u=[],d=[],b=m2(e,i,n),v=qy(n,a,e[e.length-1].pressure,r),E,k=e[0].vector,S=e[0].point,M=S,A=S,D=M,H=!1;for(let O=0;O<e.length;O++){let{pressure:oe}=e[O],{point:ee,vector:se,distance:Be,runningLength:_e}=e[O],Ve=O===e.length-1;if(!Ve&&x-_e<3)continue;a?(i&&(oe=$y(b,Be,n)),v=qy(n,a,oe,r)):v=n/2,E===void 0&&(E=v);let _=_e<w?h(_e/w):1,j=x-_e<T?p((x-_e)/T):1;v=Math.max(.01,v*Math.min(_,j));let K=(Ve?e[O]:e[O+1]).vector,de=Ve?1:Vy(se,K),ce=Vy(se,k)<0&&!H,Ue=de!==null&&de<0;if(ce||Ue){Tp(ht,k),Ep(ht,ht,v);for(let Et=0;Et<=1;Et+=.07692307692307693)Cp($o,ee,ht),Xy($o,$o,ee,gl*Et),A=[$o[0],$o[1]],u.push(A),Yy(Jo,ee,ht),Xy(Jo,Jo,ee,gl*-Et),D=[Jo[0],Jo[1]],d.push(D);S=A,M=D,Ue&&(H=!0);continue}if(H=!1,Ve){Tp(ht,se),Ep(ht,ht,v),u.push(Fo(ee,ht)),d.push(Vn(ee,ht));continue}c2(ht,K,se,de),Tp(ht,ht),Ep(ht,ht,v),Cp($o,ee,ht),A=[$o[0],$o[1]],(O<=1||Ky(S,A)>m)&&(u.push(A),S=A),Yy(Jo,ee,ht),D=[Jo[0],Jo[1]],(O<=1||Ky(M,D)>m)&&(d.push(D),M=D),b=oe,k=se}let Y=[e[0].point[0],e[0].point[1]],ne=e.length>1?[e[e.length-1].point[0],e[e.length-1].point[1]]:Vn(e[0].point,[1,1]),z=[],F=[];if(e.length===1){if(!(w||T)||s)return s2(Y,E||v)}else{w||T&&e.length===1||(g?z.push(...u2(Y,d[0],13)):z.push(...d2(Y,u[0],d[0])));let O=Jy(o2(e[e.length-1].vector));T||w&&e.length===1?F.push(ne):f?F.push(...f2(ne,O,v,29)):F.push(...p2(ne,O,v))}return u.concat(F,d.reverse(),z)}var Zy=[0,0];function Py(e){return e!=null&&e>=0}function h2(e,t={}){let{streamline:n=.5,size:o=16,last:a=!1}=t;if(e.length===0)return[];let i=.15+(1-n)*.85,r=Array.isArray(e[0])?e:e.map(({x:f,y:p,pressure:x=Uy})=>[f,p,x]);if(r.length===2){let f=r[1];r=r.slice(0,-1);for(let p=1;p<5;p++)r.push(Gy(r[0],f,p/4))}r.length===1&&(r=[...r,[...Vn(r[0],jy),...r[0].slice(2)]]);let l=[{point:[r[0][0],r[0][1]],pressure:Py(r[0][2])?r[0][2]:.25,vector:[...jy],distance:0,runningLength:0}],c=!1,s=0,g=l[0],h=r.length-1;for(let f=1;f<r.length;f++){let p=a&&f===h?[r[f][0],r[f][1]]:Gy(g.point,r[f],i);if(i2(g.point,p))continue;let x=l2(p,g.point);if(s+=x,f<h&&!c){if(s<o)continue;c=!0}Cp(Zy,g.point,p),g={point:p,pressure:Py(r[f][2])?r[f][2]:Uy,vector:Iy(Zy),distance:x,runningLength:s},l.push(g)}return l[0].vector=l[1]?.vector||[0,0],l}function Wy(e,t={}){return g2(h2(e,t),t)}var b2={pen:{size:1.4,thinning:.5},pencil:{size:.7,thinning:.25},marker:{size:2.5,thinning:0},brush:{size:2.2,thinning:.75,taper:!0},highlighter:{size:4,thinning:0,opacity:.35},neon:{size:1.4,thinning:.3}};function Ls(e,t,n,o={}){let{anchors:a}=o;if(!a||!t.some(l=>l.anchor)){Mp(e,t,n,o);return}let i=new Map,r=[];for(let l of t)l.anchor?i.set(l.anchor,[...i.get(l.anchor)??[],l]):r.push(l);Mp(e,r,n,o);for(let[l,c]of i){let s=a[l];if(!s)continue;let{clip:g}=s;e.save(),e.beginPath(),e.rect((g.x-n.offsetX)*n.scale,(g.y-n.offsetY)*n.scale,g.width*n.scale,g.height*n.scale),e.clip(),Mp(e,c,{scale:n.scale,offsetX:n.offsetX+s.x,offsetY:n.offsetY+s.y},o),e.restore()}}function Mp(e,t,n,o){let a=([i,r])=>[(i-n.offsetX)*n.scale,(r-n.offsetY)*n.scale];for(let i of t)i.kind==="blur"&&!o.skipRedactions&&x2(e,i,a,o.pixelSource);for(let i of t)if(i.kind!=="blur"){switch(e.save(),v2(e,i.style,n.scale),i.kind){case"stroke":y2(e,i.tool,i.points,i.style,n.scale,a);break;case"line":case"arrow":case"doubleArrow":{let[r,l]=[a(i.start),a(i.end)];e.beginPath(),e.moveTo(r[0],r[1]),e.lineTo(l[0],l[1]),e.stroke(),e.setLineDash([]);let c=bp(i.style)*n.scale;i.kind!=="line"&&e1(e,r,l,c),i.kind==="doubleArrow"&&e1(e,l,r,c);break}case"rect":{let[r,l]=[a(i.start),a(i.end)],[c,s,g,h]=[Math.min(r[0],l[0]),Math.min(r[1],l[1]),Math.abs(l[0]-r[0]),Math.abs(l[1]-r[1])];i.style.fill&&t1(e,()=>e.fillRect(c,s,g,h)),e.strokeRect(c,s,g,h);break}case"ellipse":{let[r,l]=[a(i.start),a(i.end)];e.beginPath(),e.ellipse((r[0]+l[0])/2,(r[1]+l[1])/2,Math.abs(l[0]-r[0])/2,Math.abs(l[1]-r[1])/2,0,0,Math.PI*2),i.style.fill&&t1(e,()=>e.fill()),e.stroke();break}case"text":{let r=gp(i.style)*n.scale,[l,c]=a(i.at);e.font=`600 ${r}px system-ui, sans-serif`,e.textBaseline="top",e.setLineDash([]),e.lineWidth=Math.max(2,r/6),e.strokeStyle=n1(i.style.color)?"rgba(0,0,0,0.75)":"rgba(255,255,255,0.85)",i.text.split(`
`).forEach((s,g)=>{e.strokeText(s,l,c+g*r*1.25),e.fillText(s,l,c+g*r*1.25)});break}case"callout":{let r=hp(i.style)*n.scale,[l,c]=a(i.at);e.setLineDash([]),e.beginPath(),e.arc(l,c,r,0,Math.PI*2),e.fill(),e.lineWidth=Math.max(1.5,r/8),e.strokeStyle="rgba(255,255,255,0.9)",e.stroke(),e.fillStyle=n1(i.style.color)?"#000":"#fff",e.font=`700 ${r*1.1}px system-ui, sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(String(i.number),l,c+r*.05);break}}e.restore(),i.id===o.selectedId&&w2(e,i,n)}}function v2(e,t,n){e.globalAlpha=t.opacity,e.strokeStyle=t.color,e.fillStyle=t.color,e.lineWidth=t.width*n,e.lineCap="round",e.lineJoin="round";let o=t.width*n;e.setLineDash(t.dash==="dashed"?[o*3,o*2]:t.dash==="dotted"?[.1,o*2]:[])}function y2(e,t,n,o,a,i){let r=b2[t];r.opacity!==void 0&&(e.globalAlpha=o.opacity*r.opacity,e.globalCompositeOperation="multiply"),t==="neon"&&(e.shadowColor=o.color,e.shadowBlur=12*a);let l=n.map(s=>[...i(s),s[2]]);if(o.dash!=="solid"||l.length<2){e.lineWidth=o.width*a*r.size,e.beginPath(),l.forEach(([s,g],h)=>h?e.lineTo(s,g):e.moveTo(s,g)),l.length===1&&e.lineTo(l[0][0]+.1,l[0][1]),e.stroke();return}let c=Wy(l,{size:o.width*a*r.size,thinning:r.thinning,smoothing:.5,streamline:.4,simulatePressure:l.every(([,,s])=>s===.5),start:{taper:r.taper?o.width*a*6:0,cap:!0},end:{taper:r.taper?o.width*a*6:0,cap:!0}});if(c.length){e.beginPath(),e.moveTo(c[0][0],c[0][1]);for(let s=1;s<c.length;s++){let[g,h]=c[s-1],[f,p]=c[s];e.quadraticCurveTo(g,h,(g+f)/2,(h+p)/2)}e.closePath(),e.fill(),t==="neon"&&(e.shadowBlur=0,e.globalAlpha=.8,e.lineWidth=Math.max(1,o.width*a*.3),e.strokeStyle="rgba(255,255,255,0.8)",e.beginPath(),l.forEach(([s,g],h)=>h?e.lineTo(s,g):e.moveTo(s,g)),e.stroke())}}function e1(e,t,n,o){let a=Math.atan2(n[1]-t[1],n[0]-t[0]);e.beginPath(),e.moveTo(n[0],n[1]),e.lineTo(n[0]-o*Math.cos(a-Math.PI/7),n[1]-o*Math.sin(a-Math.PI/7)),e.lineTo(n[0]-o*Math.cos(a+Math.PI/7),n[1]-o*Math.sin(a+Math.PI/7)),e.closePath(),e.fill()}function t1(e,t){let n=e.globalAlpha;e.globalAlpha=n*.25,t(),e.globalAlpha=n}function x2(e,t,n,o){let[a,i]=[n(t.start),n(t.end)],r=Math.round(Math.min(a[0],i[0])),l=Math.round(Math.min(a[1],i[1])),c=Math.round(Math.abs(i[0]-a[0])),s=Math.round(Math.abs(i[1]-a[1]));if(!(c<2||s<2)){if(e.save(),o){let g=Math.max(10,Math.round(Math.min(c,s)/5)),h=new OffscreenCanvas(Math.max(1,Math.ceil(c/g)),Math.max(1,Math.ceil(s/g)));h.getContext("2d").drawImage(o,r,l,c,s,0,0,h.width,h.height),e.imageSmoothingEnabled=!1,e.drawImage(h,0,0,h.width,h.height,r,l,c,s)}else e.fillStyle="rgba(128,128,128,0.9)",e.fillRect(r,l,c,s);e.restore()}}function w2(e,t,n){let o=fl(t);e.save(),e.setLineDash([4,4]),e.lineWidth=1,e.strokeStyle="#0a84ff",e.strokeRect((o.x-n.offsetX)*n.scale-3,(o.y-n.offsetY)*n.scale-3,o.width*n.scale+6,o.height*n.scale+6),e.restore()}function n1(e){let t=e.replace("#","");if(t.length!==6)return!1;let[n,o,a]=[0,2,4].map(i=>parseInt(t.slice(i,i+2),16));return n*.299+o*.587+a*.114>170}async function Ap(e,t,n,o,a){let i=await createImageBitmap(new Blob([e],{type:t})),r=new OffscreenCanvas(i.width,i.height),l=r.getContext("2d");l.drawImage(i,0,0),i.close(),o.length&&Ls(l,o,{scale:r.width/n.width,offsetX:n.x,offsetY:n.y},{pixelSource:r,anchors:a});let c=await r.convertToBlob({type:"image/png"});return k2(new Uint8Array(await c.arrayBuffer()))}function k2(e){let t="";for(let n=0;n<e.length;n+=32768)t+=String.fromCharCode(...e.subarray(n,n+32768));return btoa(t)}var rt=L(je(),1);var Qi=L(q(),1),S2=1,E2=()=>`s${Date.now().toString(36)}${(S2++).toString(36)}`;function o1({mapper:e,shapes:t,visible:n,interactive:o,tool:a,style:i,onChange:r,liveRedactions:l,pixelSource:c,anchors:s,anchorAt:g}){let h=l&&!c,f=(0,rt.useRef)(null),[p,x]=(0,rt.useState)(null),w=(0,rt.useRef)(null),T=_=>{w.current=_,x(_)},[m,u]=(0,rt.useState)(),[d,b]=(0,rt.useState)(null),v=(0,rt.useRef)(null),E=(0,rt.useRef)(!1),{bounds:k,scale:S,scroll:M}=e,[A,D]=(0,rt.useState)(null),H=(0,rt.useRef)(t);(0,rt.useEffect)(()=>{H.current=t},[t]);let Y=(0,rt.useMemo)(()=>s&&A&&!(A.id in s)?{...s,[A.id]:A.at}:s,[s,A]);(0,rt.useLayoutEffect)(()=>{let _=f.current;if(!_)return;let j=window.devicePixelRatio||1,K=Math.round(k.width*j),de=Math.round(k.height*j);(_.width!==K||_.height!==de)&&(_.width=K,_.height=de);let ce=_.getContext("2d");if(ce.clearRect(0,0,K,de),!n)return;let Ue=_.closest(".viewport")?.querySelector(".viewport-canvas");Ls(ce,p?[...t,p]:t,{scale:S*j,offsetX:M.x,offsetY:M.y},{pixelSource:c??Ue??void 0,skipRedactions:h,selectedId:o?m:void 0,anchors:Y})},[Y,h,c,t,p,n,o,m,k.width,k.height,S,M.x,M.y]),(0,rt.useEffect)(()=>{if(!m)return;let _=j=>{(j.key==="Delete"||j.key==="Backspace")&&!T2(j)&&(j.preventDefault(),j.stopPropagation(),r(t.filter(K=>K.id!==m),!0),u(void 0))};return window.addEventListener("keydown",_,!0),()=>window.removeEventListener("keydown",_,!0)},[m,t,r]);let ne=_=>{let j=_.currentTarget.getBoundingClientRect();return[(_.clientX-j.left)/S+M.x,(_.clientY-j.top)/S+M.y]},z=(_,j)=>{let K=j?Y?.[j]:void 0;return K?[_[0]+K.x,_[1]+K.y]:_},F=(_,j)=>(!_.anchor||!Y||!!Y[_.anchor])&&xy(_,z(j,_.anchor),6/S),O=_=>{let j=t.filter(K=>!F(K,_));j.length!==t.length&&r(j,!1)},oe=()=>{d?.value.trim()&&r([...t,{id:d.id,kind:"text",at:d.at,text:d.value,style:i,anchor:d.anchor}],!0),b(null)},ee=(_,j)=>{D(j);let K=ce=>ce.id===_&&!ce.anchor?{...Rs(ce,j.at.x,j.at.y),anchor:j.id}:ce,de=w.current;de?.id===_&&T(K(de)),b(ce=>ce?.id===_&&!ce.anchor?{...ce,at:[ce.at[0]+j.at.x,ce.at[1]+j.at.y],anchor:j.id}:ce),H.current.some(ce=>ce.id===_&&!ce.anchor)&&r(H.current.map(K),!1)},se=_=>{if(_.button!==0||!n)return;_.preventDefault();let j=ne(_),K=E2(),de=a==="eraser"||a==="select"?void 0:g?.(j),ce=de instanceof Promise?void 0:de;de instanceof Promise&&de.then(qt=>qt&&ee(K,qt));let Ue=ce?.id;ce&&D(ce);let Et=ce?[j[0]+ce.at.x,j[1]+ce.at.y]:j;if(d&&oe(),a==="text"){let qt=_.currentTarget.getBoundingClientRect();b({id:K,at:Et,anchor:Ue,local:[_.clientX-qt.left,_.clientY-qt.top],value:""});return}if(a==="callout"){let qt=Math.max(0,...t.map(Gn=>Gn.kind==="callout"?Gn.number:0))+1;r([...t,{id:K,kind:"callout",at:Et,number:qt,style:i,anchor:Ue}],!0);return}if(_.currentTarget.setPointerCapture(_.pointerId),a==="eraser"){E.current=!0,r(t,!0),O(j);return}if(a==="select"){let qt=[...t].reverse().find(Gn=>F(Gn,j));u(qt?.id),qt&&(v.current={start:j,original:qt},r(t,!0));return}let eu=_.pressure||.5;my.includes(a)?T({id:K,kind:"stroke",tool:a,points:[[...Et,eu]],style:i,anchor:Ue}):mp.includes(a)&&T({id:K,kind:a,start:Et,end:Et,style:i,anchor:Ue})},Be=_=>{let j=ne(_);if(E.current){O(j);return}if(v.current){let{start:de,original:ce}=v.current,Ue=Rs(ce,j[0]-de[0],j[1]-de[1]);r(t.map(Et=>Et.id===ce.id?Ue:Et),!1);return}let K=w.current;K&&(j=z(j,K.anchor),K.kind==="stroke"?T({...K,points:[...K.points,[...j,_.pressure||.5]]}):K.kind!=="text"&&K.kind!=="callout"&&T({...K,end:_.shiftKey?wy(K.kind,K.start,j):j}))},_e=()=>{E.current=!1,v.current=null;let _=w.current;if(!_)return;_.kind!=="stroke"&&_.kind!=="text"&&_.kind!=="callout"&&Math.hypot(_.end[0]-_.start[0],_.end[1]-_.start[1])*S<3||r([...t,_],!0),T(null)},Ve=a==="select"?"default":a==="text"?"text":a==="eraser"?"cell":"crosshair";return(0,Qi.jsxs)("div",{className:"drawing-layer",style:{...k,pointerEvents:n&&o?"auto":"none"},children:[h&&n&&Os(p?[...t,p]:t,Y).map(_=>{if(_.kind!=="blur")return null;let[j,K]=[_.start,_.end],de={x:Math.min(j[0],K[0]),y:Math.min(j[1],K[1]),width:Math.abs(K[0]-j[0]),height:Math.abs(K[1]-j[1])},ce=_.anchor&&Y?.[_.anchor]?.clip,Ue=ce?hy(de,ce):de;return Ue?(0,Qi.jsx)("div",{className:"drawing-redaction",style:{left:(Ue.x-M.x)*S,top:(Ue.y-M.y)*S,width:Ue.width*S,height:Ue.height*S}},_.id):null}),(0,Qi.jsx)("canvas",{ref:f,style:{width:k.width,height:k.height,cursor:Ve},onPointerDown:se,onPointerMove:Be,onPointerUp:_e,onContextMenu:_=>_.preventDefault()}),d&&(0,Qi.jsx)("textarea",{className:"drawing-text-input",autoFocus:!0,value:d.value,placeholder:"Type, then Enter",style:{left:d.local[0],top:d.local[1],color:i.color,fontSize:(12+i.width*2)*S},onChange:_=>b({...d,value:_.target.value}),onBlur:oe,onKeyDown:_=>{_.stopPropagation(),_.key==="Enter"&&!_.shiftKey?(_.preventDefault(),oe()):_.key==="Escape"&&b(null)}})]})}function T2(e){let t=e.target;return!!t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)}var Zi=L(q(),1);function $e({variant:e="secondary",size:t="md",icon:n,iconEnd:o,loading:a,className:i,children:r,disabled:l,type:c="button",...s}){let g=a?"loading":n;return(0,Zi.jsxs)("button",{type:c,className:re("button",e,t==="sm"&&"small",i),disabled:l||a,"aria-busy":a||void 0,...s,children:[g&&(0,Zi.jsx)("span",{className:re("codicon",`codicon-${g}`,a&&"codicon-modifier-spin"),"aria-hidden":"true"}),r!==void 0&&(0,Zi.jsx)("span",{className:"button-label",children:r}),o&&(0,Zi.jsx)("span",{className:`codicon codicon-${o}`,"aria-hidden":"true"})]})}var Kn=L(je(),1),s1=L(Ll(),1);function Da(e){let t=e.trim().toLowerCase(),n=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(t);if(n){let a=n[4]===void 0?1:n[4].endsWith("%")?parseFloat(n[4])/100:Number(n[4]);return{r:Number(n[1]),g:Number(n[2]),b:Number(n[3]),a}}let o=/^#([\da-f]{3}|[\da-f]{6})$/.exec(t);if(o){let a=o[1].length===3?[...o[1]].map(i=>i+i).join(""):o[1];return{r:parseInt(a.slice(0,2),16),g:parseInt(a.slice(2,4),16),b:parseInt(a.slice(4,6),16),a:1}}if(t==="transparent")return{r:0,g:0,b:0,a:0}}function Pi({r:e,g:t,b:n,a:o}){let a=i=>Math.round(i).toString(16).padStart(2,"0").toUpperCase();return`#${a(e)}${a(t)}${a(n)}${o<1?a(o*255):""}`}function C2(e,t){let n=e.a+t.a*(1-e.a);if(n===0)return{r:0,g:0,b:0,a:0};let o=(a,i)=>(a*e.a+i*t.a*(1-e.a))/n;return{r:o(e.r,t.r),g:o(e.g,t.g),b:o(e.b,t.b),a:n}}function a1({r:e,g:t,b:n}){let o=a=>{let i=a/255;return i<=.03928?i/12.92:((i+.055)/1.055)**2.4};return .2126*o(e)+.7152*o(t)+.0722*o(n)}function i1(e,t){let n=a1(C2(e,t)),o=a1(t),[a,i]=n>o?[n,o]:[o,n];return(a+.05)/(i+.05)}function r1(e,t,n){let o=t>=24||t>=18.66&&n>=700;return e>=(o?3:4.5)}function l1({r:e,g:t,b:n}){let[o,a,i]=[e/255,t/255,n/255],r=Math.max(o,a,i),l=r-Math.min(o,a,i),c=0;return l&&(r===o?c=(a-i)/l%6:r===a?c=(i-o)/l+2:c=(o-a)/l+4),{h:(c*60+360)%360,s:r?l/r:0,v:r}}function c1({h:e,s:t,v:n}){let o=a=>{let i=(a+e/60)%6;return(n-n*t*Math.max(0,Math.min(i,4-i,1)))*255};return{r:o(5),g:o(3),b:o(1),a:1}}function zp(e){let t=e.trim().replace(/^#?/,"#"),n=Da(t);return n?Pi(n).toLowerCase():void 0}var kt=L(q(),1),N2=e=>Pi(c1(e)).toLowerCase(),hl=e=>l1(Da(e)??{r:0,g:0,b:0,a:1});function u1({value:e,onChange:t,label:n,presets:o=[],className:a}){let[i,r]=(0,Kn.useState)(!1),[l,c]=(0,Kn.useState)(null),[s,g]=(0,Kn.useState)(()=>hl(e)),[h,f]=(0,Kn.useState)(null),p=(0,Kn.useRef)(null),x=(0,Kn.useRef)(null),w=(0,Kn.useCallback)(v=>{r(!1),v==="escape"&&p.current?.focus()},[]);ks([p,x],i,w),ys(p,x,i);let T=v=>{g(v),f(null),t(N2(v))},m=(v,E,k,S)=>{let M=v.getBoundingClientRect(),A=Math.min(1,Math.max(0,(E-M.left)/M.width)),D=Math.min(1,Math.max(0,(k-M.top)/M.height));T(S==="area"?{...s,s:A,v:1-D}:{...s,h:A*359.9})},u=v=>({onPointerDown:E=>{E.currentTarget.setPointerCapture(E.pointerId),E.currentTarget.focus(),m(E.currentTarget,E.clientX,E.clientY,v)},onPointerMove:E=>{E.currentTarget.hasPointerCapture(E.pointerId)&&m(E.currentTarget,E.clientX,E.clientY,v)}}),d=v=>E=>{let k=E.shiftKey?.1:.01,S={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[E.key];if(!S)return;E.preventDefault();let M=A=>Math.min(1,Math.max(0,A));T(v==="area"?{...s,s:M(s.s+S[0]*k),v:M(s.v+S[1]*k)}:{...s,h:Math.min(359.9,Math.max(0,s.h+(S[0]||S[1])*k*360))})},b=`hsl(${s.h} 100% 50%)`;return(0,kt.jsxs)(kt.Fragment,{children:[(0,kt.jsx)("button",{ref:p,type:"button",className:re("swatch","color-picker-trigger",i&&"active",a),"aria-label":n,title:n,"aria-haspopup":"dialog","aria-expanded":i,onClick:()=>{if(i)return w();g(hl(e)),f(null),c(Ss(p.current)),r(!0)}}),i&&l&&(0,s1.createPortal)((0,kt.jsxs)("div",{ref:x,className:"color-picker","data-ink-popup":"",role:"dialog","aria-label":n,children:[(0,kt.jsx)("div",{className:"color-area",style:{background:b},role:"slider",tabIndex:0,"aria-label":"Saturation and brightness","aria-valuetext":`Saturation ${Math.round(s.s*100)}%, brightness ${Math.round(s.v*100)}%`,onKeyDown:d("area"),...u("area"),children:(0,kt.jsx)("span",{className:"color-handle",style:{left:`${s.s*100}%`,top:`${(1-s.v)*100}%`,background:e}})}),(0,kt.jsx)("div",{className:"color-hue",role:"slider",tabIndex:0,"aria-label":"Hue","aria-valuemin":0,"aria-valuemax":360,"aria-valuenow":Math.round(s.h),onKeyDown:d("hue"),...u("hue"),children:(0,kt.jsx)("span",{className:"color-handle",style:{left:`${s.h/360*100}%`,background:b}})}),(0,kt.jsxs)("div",{className:"color-row",children:[(0,kt.jsx)("span",{className:"color-preview",style:{background:e},"aria-hidden":"true"}),(0,kt.jsx)("input",{className:"color-hex","aria-label":"Hex color",spellCheck:!1,maxLength:7,value:h??e,onChange:v=>{f(v.target.value);let E=zp(v.target.value);E&&v.target.value.replace("#","").length===6&&(g(hl(E)),t(E))},onBlur:()=>f(null),onKeyDown:v=>{if(v.key!=="Enter")return;let E=zp(v.currentTarget.value);E&&(g(hl(E)),t(E),w("escape"))}})]}),o.length>0&&(0,kt.jsx)("div",{className:"color-presets",role:"group","aria-label":"Presets",children:o.map(v=>(0,kt.jsx)("button",{type:"button",className:re("swatch","small",v===e&&"active"),style:{background:v},"aria-label":v,title:v,onClick:()=>{g(hl(v)),t(v)}},v))})]}),l)]})}var jt=L(je(),1),d1=L(Ll(),1);var bt=L(q(),1);function Xn({value:e,options:t,onChange:n,label:o,title:a,placeholder:i="Select\u2026",icon:r,renderValue:l,size:c="md",appearance:s="field",disabled:g,className:h,align:f="start"}){let[p,x]=(0,jt.useState)(!1),[w,T]=(0,jt.useState)(-1),[m,u]=(0,jt.useState)(null),d=(0,jt.useRef)(null),b=(0,jt.useRef)(null),v=(0,jt.useRef)({text:"",at:0}),E=(0,jt.useId)(),k=t.findIndex(O=>O.value===e),S=t[k],M=(0,jt.useCallback)(O=>{x(!1),(O==="escape"||O==="chosen")&&d.current?.focus()},[]);ks([d,b],p,M),ys(d,b,p,{align:f,matchWidth:!0});let A=O=>O>=0&&!t[O]?.disabled,D=(O,oe)=>{for(let ee=1;ee<=t.length;ee++){let se=(O+oe*ee+t.length*2)%t.length;if(A(se))return se}return O},H=(O=k)=>{T(A(O)?O:D(-1,1)),u(Ss(d.current)),x(!0)},Y=O=>{let oe=t[O];!oe||oe.disabled||(M("chosen"),oe.value!==e&&n(oe.value))};(0,jt.useLayoutEffect)(()=>{p&&(b.current?.querySelector(`[data-index="${w}"]`)?.scrollIntoView({block:"nearest"}),b.current?.focus({preventScroll:!0}))},[p,w]);let ne=O=>{let oe=Date.now(),ee=(oe-v.current.at<700?v.current.text:"")+O.toLowerCase();v.current={text:ee,at:oe};let se=p?w:k,_e=[...t.keys()].map(Ve=>(se+(ee.length>1?0:1)+Ve)%t.length).find(Ve=>A(Ve)&&t[Ve].label.toLowerCase().startsWith(ee));_e!==void 0&&(p?T(_e):t[_e].value!==e&&n(t[_e].value))},z=O=>{["ArrowDown","ArrowUp","Enter"," "].includes(O.key)?(O.preventDefault(),H()):O.key.length===1&&!O.ctrlKey&&!O.metaKey&&!O.altKey&&ne(O.key)},F=O=>{let ee={ArrowDown:()=>T(se=>D(se,1)),ArrowUp:()=>T(se=>D(se,-1)),Home:()=>T(D(-1,1)),End:()=>T(D(t.length,-1)),PageDown:()=>T(se=>Math.min(D(se,1)+7,D(t.length,-1))),PageUp:()=>T(se=>Math.max(D(se,-1)-7,D(-1,1))),Enter:()=>Y(w)," ":()=>v.current.text&&Date.now()-v.current.at<700?ne(" "):Y(w),Tab:()=>M()}[O.key];ee?(O.key!=="Tab"&&O.preventDefault(),ee()):O.key.length===1&&!O.ctrlKey&&!O.metaKey&&!O.altKey&&ne(O.key)};return(0,bt.jsxs)(bt.Fragment,{children:[(0,bt.jsxs)("button",{ref:d,type:"button",className:re("select",`size-${c}`,s==="quiet"&&"quiet",p&&"open",h),role:"combobox","aria-haspopup":"listbox","aria-expanded":p,"aria-controls":p?`${E}-list`:void 0,"aria-label":o,title:a??o,disabled:g,onClick:()=>p?M():H(),onKeyDown:z,children:[r&&(0,bt.jsx)("span",{className:`codicon codicon-${r}`,"aria-hidden":"true"}),!r&&S?.icon&&(0,bt.jsx)("span",{className:`codicon codicon-${S.icon}`,"aria-hidden":"true"}),(0,bt.jsx)("span",{className:re("select-value",!S&&"placeholder"),children:S?l?l(S):S.label:i}),(0,bt.jsx)("span",{className:"codicon codicon-chevron-down select-chevron","aria-hidden":"true"})]}),p&&m&&(0,d1.createPortal)((0,bt.jsx)("div",{ref:b,id:`${E}-list`,className:"select-list","data-ink-popup":"",role:"listbox","aria-label":o,tabIndex:-1,"aria-activedescendant":w>=0?`${E}-${w}`:void 0,onKeyDown:F,children:t.map((O,oe)=>[O.group&&O.group!==t[oe-1]?.group?(0,bt.jsx)("div",{className:"select-group",role:"presentation",children:O.group},`g-${O.group}`):null,(0,bt.jsxs)("div",{id:`${E}-${oe}`,"data-index":oe,role:"option","aria-selected":oe===k,"aria-disabled":O.disabled||void 0,className:re("select-option",oe===w&&"active",oe===k&&"selected",O.disabled&&"disabled"),style:O.indent?{paddingLeft:4+O.indent*14}:void 0,onPointerMove:()=>!O.disabled&&T(oe),onClick:()=>Y(oe),children:[(0,bt.jsx)("span",{className:`codicon codicon-${oe===k?"check":"blank"} select-check`,"aria-hidden":"true"}),O.icon&&(0,bt.jsx)("span",{className:`codicon codicon-${O.icon}`,"aria-hidden":"true"}),(0,bt.jsx)("span",{className:"select-option-label",children:O.label}),O.detail&&(0,bt.jsx)("span",{className:"select-option-detail",children:O.detail})]},O.value)])}),m)]})}var f1=L(je(),1);var Wo=L(q(),1);function Op({value:e,min:t,max:n,step:o=1,onChange:a,label:i,format:r=String,icon:l,showValue:c,className:s,disabled:g}){let h=(0,f1.useRef)(null),f=m=>Math.min(n,Math.max(t,Math.round(m/o)*o)),p=m=>{let u=f(m);u!==e&&a(u)},x=m=>{let u=h.current?.getBoundingClientRect();u?.width&&p(t+(m-u.left)/u.width*(n-t))},w=n>t?(e-t)/(n-t):0,T=m=>{let u=Math.max(o,(n-t)/10),d={ArrowRight:e+o,ArrowUp:e+o,ArrowLeft:e-o,ArrowDown:e-o,PageUp:e+u,PageDown:e-u,Home:t,End:n};m.key in d&&(m.preventDefault(),p(d[m.key]))};return(0,Wo.jsxs)("div",{className:re("slider",g&&"disabled",s),title:`${i}: ${r(e)}`,children:[l&&(0,Wo.jsx)("span",{className:`codicon codicon-${l}`,"aria-hidden":"true"}),(0,Wo.jsxs)("div",{ref:h,className:"slider-track",role:"slider",tabIndex:g?-1:0,"aria-label":i,"aria-valuemin":t,"aria-valuemax":n,"aria-valuenow":e,"aria-valuetext":r(e),"aria-disabled":g||void 0,onKeyDown:g?void 0:T,onPointerDown:m=>{g||m.button!==0||(m.currentTarget.setPointerCapture(m.pointerId),m.currentTarget.focus(),x(m.clientX))},onPointerMove:m=>{m.currentTarget.hasPointerCapture(m.pointerId)&&x(m.clientX)},children:[(0,Wo.jsx)("span",{className:"slider-fill",style:{width:`${w*100}%`}}),(0,Wo.jsx)("span",{className:"slider-thumb",style:{left:`${w*100}%`}})]}),c&&(0,Wo.jsx)("span",{className:"slider-value",children:r(e)})]})}var Rp=L(q(),1),M2={select:"M3 2l9 5-4 1-2 4z",pen:"M11 2l3 3-8 8H3v-3zM9.5 3.5l3 3",pencil:"M11.5 2.5l2 2L6 12l-3 1 1-3zM10 4l2 2",marker:"M10 2l4 4-6 6H4v-4zM4 12l-2 2h4",brush:"M13.5 2.5c-2 1-5 4-6.5 6l1 1c2-1.5 5-4.5 6-6.5zM6.5 9.5c-2 0-3 1.5-3 3 0 .8-.5 1.2-1.5 1.5 3 .5 5.5-1 5.5-3.5",highlighter:"M9 2l5 5-5 5-5-5zM4 7l-2 5 3-1M2 14h12",neon:"M2 12c2-6 4 2 6-4s4 2 6-4M8 1v2M3 3l1.5 1.5M13 3l-1.5 1.5",line:"M3 13L13 3",arrow:"M3 13L13 3M7 3h6v6",doubleArrow:"M3 13L13 3M7 3h6v6M9 13H3V7",rect:"M2.5 3.5h11v9h-11z",ellipse:"M8 3c3.3 0 6 2.2 6 5s-2.7 5-6 5-6-2.2-6-5 2.7-5 6-5z",blur:"M2 2h4v4H2zM6 6h4v4H6zM10 2h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z",text:"M3 3h10M8 3v10M6 13h4",callout:"M8 2a5 5 0 110 10 5 5 0 010-10zM7 5.5l1.5-1v5M7 9.5h3",eraser:"M9 2l5 5-6 6H4l-2-2zM6 5l5 5M4 13h10"};function p1({tool:e}){return(0,Rp.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,Rp.jsx)("path",{d:M2[e]})})}var Se=L(q(),1),m1=[[{tool:"select",label:"Select and move"}],[{tool:"pen",label:"Pen"},{tool:"pencil",label:"Pencil"},{tool:"marker",label:"Marker"},{tool:"brush",label:"Brush"},{tool:"highlighter",label:"Highlighter"},{tool:"neon",label:"Neon"}],[{tool:"line",label:"Line"},{tool:"arrow",label:"Arrow"},{tool:"doubleArrow",label:"Double arrow"},{tool:"rect",label:"Rectangle"},{tool:"ellipse",label:"Ellipse"}],[{tool:"text",label:"Text"},{tool:"callout",label:"Numbered callout"},{tool:"blur",label:"Redact (pixelate)"},{tool:"eraser",label:"Eraser"}]],A2=[{value:"solid",label:"Solid"},{value:"dashed",label:"Dashed"},{value:"dotted",label:"Dotted"}],g1=m1.flat().map(e=>e.tool);function h1(e){let{tool:t,style:n}=e,o=(i,r,l)=>{let c=kn.find(g=>g.id===r),s=e.keyOf?e.keyOf(r):c?.keys[0]?Ft(c.keys[0],!1):l;return s?`${i} (${s})`:i},a=[...Ki,...e.recentColors.filter(i=>!Ki.includes(i))];return(0,Se.jsxs)("div",{className:"draw-toolbar",role:"toolbar","aria-label":"Drawing tools",children:[m1.map((i,r)=>(0,Se.jsx)("div",{className:"draw-group",children:i.map(({tool:l,label:c})=>(0,Se.jsx)("button",{type:"button",className:`icon-button${t===l?" active":""}`,title:o(c,`draw.${l}`),"aria-label":c,"aria-pressed":t===l,onClick:()=>e.onTool(l),children:(0,Se.jsx)(p1,{tool:l})},l))},r)),(0,Se.jsxs)("div",{className:"draw-group colors",role:"radiogroup","aria-label":"Colour",children:[a.slice(0,13).map(i=>(0,Se.jsx)("button",{type:"button",role:"radio","aria-checked":n.color===i,"aria-label":i,title:i,className:`swatch${n.color===i?" active":""}`,style:{background:i},onClick:()=>e.onStyle({color:i})},i)),(0,Se.jsx)(u1,{value:n.color,label:"Custom colour",presets:Ki,onChange:i=>e.onStyle({color:i})})]}),(0,Se.jsxs)("div",{className:"draw-group",children:[(0,Se.jsx)(Op,{icon:"circle-small-filled",label:"Width",min:1,max:24,value:n.width,format:i=>`${i}px`,onChange:i=>e.onStyle({width:i})}),(0,Se.jsx)(Op,{icon:"color-mode",label:"Opacity",min:10,max:100,step:5,value:Math.round(n.opacity*100),format:i=>`${i}%`,onChange:i=>e.onStyle({opacity:i/100})}),(0,Se.jsx)(Xn,{size:"sm",appearance:"quiet",label:"Line style",value:n.dash,options:A2,onChange:i=>e.onStyle({dash:i})}),(0,Se.jsx)("button",{type:"button",className:`icon-button${n.fill?" active":""}`,title:o("Fill shapes","draw.fill"),"aria-label":"Fill shapes","aria-pressed":n.fill,onClick:()=>e.onStyle({fill:!n.fill}),children:(0,Se.jsx)("span",{className:"codicon codicon-circle-filled","aria-hidden":"true"})})]}),(0,Se.jsxs)("div",{className:"draw-group",children:[(0,Se.jsx)("button",{type:"button",className:"icon-button",title:o("Undo","draw.undo","Ctrl+Z"),"aria-label":"Undo",disabled:!e.canUndo,onClick:e.onUndo,children:(0,Se.jsx)("span",{className:"codicon codicon-discard","aria-hidden":"true"})}),(0,Se.jsx)("button",{type:"button",className:"icon-button",title:o("Redo","draw.redo","Ctrl+Y"),"aria-label":"Redo",disabled:!e.canRedo,onClick:e.onRedo,children:(0,Se.jsx)("span",{className:"codicon codicon-redo","aria-hidden":"true"})}),(0,Se.jsx)("button",{type:"button",className:"icon-button",title:o("Clear all drawings","draw.clear"),"aria-label":"Clear all drawings",disabled:!e.hasShapes,onClick:e.onClear,children:(0,Se.jsx)("span",{className:"codicon codicon-clear-all","aria-hidden":"true"})}),(0,Se.jsx)("button",{type:"button",className:`icon-button${e.visible?"":" active"}`,title:o(e.visible?"Hide drawings":"Show drawings","draw.visible"),"aria-label":e.visible?"Hide drawings":"Show drawings",onClick:e.onToggleVisible,children:(0,Se.jsx)("span",{className:`codicon codicon-${e.visible?"eye":"eye-closed"}`,"aria-hidden":"true"})})]}),(0,Se.jsx)($e,{variant:"primary",size:"sm",icon:"device-camera",iconEnd:"chevron-down",className:"draw-capture",disabled:!e.hasShapes,title:o("Screenshot menu","draw.captureMenu"),onClick:i=>{let r=i.currentTarget.getBoundingClientRect();e.onCapture(r.left,r.bottom+2)},children:"Screenshot"}),(0,Se.jsx)("button",{type:"button",className:"icon-button draw-close",title:o("Stop drawing","draw.exit","Esc"),"aria-label":"Stop drawing",onClick:e.onClose,children:(0,Se.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]})}var z2={area:"draw.capture",groups:"draw.captureGroups",clean:"draw.captureClean",viewport:"draw.captureViewport",fullPage:"draw.captureFullPage",region:"draw.captureRegion"};function b1(e,t){let n=(o,a,i)=>({label:a,icon:i,shortcut:t?.(z2[o]),onSelect:()=>e(o)});return[n("area","Drawing area","device-camera"),n("groups","Each drawing separately","layers"),n("clean","Drawing area without drawings","eye-closed"),{separator:!0},n("viewport","Visible area with drawings","screen-normal"),n("fullPage","Full page with drawings","file-media"),n("region","Drag to select an area...","screen-full")]}var Dp=L(q(),1);function v1({label:e,dragging:t,className:n,...o}){return(0,Dp.jsx)("button",{type:"button",className:["drag-handle",t&&"dragging",n].filter(Boolean).join(" "),title:e,"aria-label":e,...o,children:(0,Dp.jsx)("span",{className:"codicon codicon-gripper","aria-hidden":"true"})})}var _p=L(q(),1);function Me({icon:e,label:t,onClick:n,onContextMenu:o,disabled:a,active:i,spin:r,className:l}){return(0,_p.jsx)("button",{type:"button",className:["icon-button",i&&"active",l].filter(Boolean).join(" "),title:t,"aria-label":t,"aria-pressed":i,disabled:a,onClick:n,onContextMenu:o,children:(0,_p.jsx)("span",{className:`codicon codicon-${e}${r?" codicon-modifier-spin":""}`,"aria-hidden":"true"})})}var dn=L(je(),1);var vt=L(q(),1);function Bs({menu:e,onClose:t}){let n=(0,dn.useRef)(null),[o]=(0,dn.useState)(xs);return(0,dn.useEffect)(()=>{let a=ws(()=>[n.current],o,()=>t()),i=r=>{r.key==="Escape"&&(r.preventDefault(),r.stopPropagation(),t())};return window.addEventListener("keydown",i,!0),window.addEventListener("blur",t),window.addEventListener("resize",t),()=>{a(),window.removeEventListener("keydown",i,!0),window.removeEventListener("blur",t),window.removeEventListener("resize",t)}},[t,o]),(0,vt.jsx)("div",{ref:n,className:"menu-root",onContextMenu:a=>a.preventDefault(),children:(0,vt.jsx)(y1,{items:e.items,x:e.x,y:e.y,above:e.anchor?.top,onClose:t,focusFirst:!0})})}function y1({items:e,x:t,y:n,onClose:o,focusFirst:a,parent:i,onBack:r,above:l}){let c=(0,dn.useRef)(null),[s,g]=(0,dn.useState)(null),h=(0,dn.useRef)(void 0);(0,dn.useLayoutEffect)(()=>{let m=c.current;if(!m)return;let u=dp();m.style.maxWidth=`${u.width-8}px`;let d=m.getBoundingClientRect(),b=t;i&&t+d.width>u.width-4&&(b=i.left-d.width+2);let v=n;l!==void 0&&n+d.height>u.height-4&&l-d.height-2>=4&&(v=l-d.height-2),m.style.left=`${Math.max(4,Math.min(b,u.width-d.width-4))}px`,m.style.top=`${Math.max(4,Math.min(v,u.height-d.height-4))}px`,a&&m.querySelector(":scope > button:not(:disabled)")?.focus({preventScroll:!0})},[t,n,i,a,l]),(0,dn.useEffect)(()=>()=>clearTimeout(h.current),[]);let f=()=>[...c.current?.querySelectorAll(":scope > button:not(:disabled)")??[]],p=(m,u,d)=>{clearTimeout(h.current),g({index:m,rect:u.getBoundingClientRect()}),d&&setTimeout(()=>c.current?.querySelector(":scope > .menu button:not(:disabled)")?.focus({preventScroll:!0}))},x=m=>{if(m.target instanceof HTMLElement&&m.target.closest(".menu")!==c.current)return;let u=f(),d=u.indexOf(document.activeElement);if(m.key==="ArrowDown"||m.key==="ArrowUp")m.preventDefault(),u[(d+(m.key==="ArrowDown"?1:-1)+u.length)%u.length]?.focus();else if(m.key==="ArrowLeft"&&r)m.preventDefault(),m.stopPropagation(),r();else if(m.key==="ArrowRight"){let b=u[d],v=b&&e[Number(b.dataset.index)];v&&"submenu"in v&&v.submenu&&(m.preventDefault(),p(Number(b.dataset.index),b,!0))}},w=s?e[s.index]:void 0,T=w&&"submenu"in w?w.submenu?.():void 0;return(0,vt.jsxs)("div",{ref:c,className:"menu",role:"menu",style:{left:t,top:n},onKeyDown:x,children:[e.map((m,u)=>"separator"in m?(0,vt.jsx)("div",{className:"menu-separator",role:"separator"},u):"heading"in m?(0,vt.jsxs)("div",{className:"menu-heading",role:"presentation",children:[m.icon&&(0,vt.jsx)("span",{className:`codicon codicon-${m.icon}`,"aria-hidden":"true"}),(0,vt.jsx)("span",{className:"menu-heading-label",children:m.heading}),m.detail&&(0,vt.jsx)("span",{className:"menu-heading-detail",children:m.detail})]},u):(0,vt.jsxs)("button",{type:"button",role:"menuitem","data-index":u,"aria-haspopup":m.submenu?"menu":void 0,"aria-expanded":m.submenu?s?.index===u:void 0,className:`menu-item${s?.index===u?" expanded":""}${m.indent?" indented":""}`,"aria-label":m.ariaLabel,disabled:m.disabled,onPointerEnter:d=>{clearTimeout(h.current);let b=d.currentTarget;m.disabled||b.focus({preventScroll:!0}),h.current=setTimeout(()=>m.submenu?p(u,b,!1):g(null),m.submenu?120:250)},onClick:d=>{if(m.submenu){p(u,d.currentTarget,d.detail===0);return}o(),m.onSelect()},children:[m.image?(0,vt.jsx)("img",{className:"menu-image",src:m.image,alt:"",referrerPolicy:"no-referrer"}):(0,vt.jsx)("span",{className:`codicon codicon-${m.icon??"blank"}`,"aria-hidden":"true"}),(0,vt.jsx)("span",{className:"menu-label",children:m.label}),m.shortcut&&(0,vt.jsx)("span",{className:"menu-shortcut",children:m.shortcut}),m.submenu&&(0,vt.jsx)("span",{className:"codicon codicon-chevron-right menu-arrow","aria-hidden":"true"})]},u)),s&&T&&(0,vt.jsx)(y1,{items:T.length?T:[{label:"(empty)",disabled:!0,onSelect:()=>{}}],x:s.rect.right-2,y:s.rect.top-5,parent:s.rect,onClose:o,onBack:()=>{g(null),c.current?.querySelector(`:scope > button[data-index="${s.index}"]`)?.focus()}},s.index)]})}var mo=L(q(),1),O2=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),R2=[{action:"copy",label:"Capture",icon:"inspect"},{action:"screenshot",label:"Screenshot",icon:"device-camera"}];function x1({count:e,map:t,onAction:n,className:o,style:a}){let i=t["inspect.copy"]?.[0];return(0,mo.jsxs)("div",{className:re("selection-bar",o),style:a,role:"toolbar","aria-label":"Selected elements",onPointerDown:r=>r.stopPropagation(),children:[(0,mo.jsxs)("span",{className:"selection-bar-count",children:[(0,mo.jsx)("span",{className:"selection-bar-badge",children:e}),"selected"]}),R2.map(({action:r,label:l,icon:c})=>(0,mo.jsxs)($e,{size:"sm",variant:r==="copy"?"primary":"ghost",icon:c,onClick:()=>n(r),children:[l,r==="copy"&&i&&(0,mo.jsx)("span",{className:"keycaps size-sm",children:Vi(i,O2).map(s=>(0,mo.jsx)("kbd",{className:"keycap",children:s},s))})]},r)),(0,mo.jsx)(Me,{icon:"close",label:"Clear the selection",className:"small selection-bar-clear",onClick:()=>n("clear")})]})}var D2=/^[\w.-]{1,64}$/,_2=/^%\d{1,9}$/,Us=["claude","codex","opencode","agy"],w1=/^(terminal:\d{1,9}|chat)$/,H2=/^[\w.-]{1,64}$/;function k1(e){if(e==="default")return{kind:"default"};if(w1.test(e))return{kind:"local",target:e};let t=/^tmux:([^:]+):(%\d+)$/.exec(e);if(t&&D2.test(t[1])&&_2.test(t[2]))return{kind:"tmux",socket:t[1],pane:t[2]};let n=/^vscode:([^:]+):(.+)$/.exec(e);if(n&&H2.test(n[1])&&w1.test(n[2]))return{kind:"vscode",window:n[1],target:n[2]};let o=/^agentmux:new:(\w+)$/.exec(e);if(o&&Us.includes(o[1]))return{kind:"agentmux-new",harness:o[1]}}var S1=e=>`agentmux:new:${e}`,bl={claude:"Claude Code",codex:"Codex",opencode:"opencode",agy:"Antigravity"};var $i=e=>typeof e=="number"&&Number.isFinite(e),et=e=>typeof e=="boolean",$=e=>t=>typeof t=="string"&&t.length<=e,Sn=e=>t=>typeof t=="string"&&e.test(t),X=e=>t=>t===void 0||e(t),go=(...e)=>t=>typeof t=="string"&&e.includes(t),L2=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),_a=e=>t=>L2(t)&&Object.entries(e).every(([n,o])=>o(t[n])),fn=(e,t=1e5)=>n=>Array.isArray(n)&&n.length<=t&&n.every(e);var U3=512*1024,B2=["text/plain","image/png","image/jpeg"],Lp=8e3;var j3=1024*1024,U2=64*1024*1024,j2=["element","screenshot","recording","errors","network","page","report","css","measure","color","text"],js=/^\d{8}-\d{6}-[0-9a-f]{6}$/,Hp=/^[\w-]{1,40}\.[a-z0-9]{1,5}$/;function E1(e){return e.vscode||e.agentmux}var ea=Sn(/^[\w.-]{1,64}$/),Ys=$(U2),q2=$(4096),q3={auth:{token:$(128),role:go("browser","vscode"),origin:X($(256))}},Le=Sn(/^[\w-]{1,64}$/),St=$(4096),T1=go(...j2),qs=Sn(/^[A-Za-z0-9+/]*={0,2}$/),Y2=_a({kind:T1,title:$(300),detail:X($(1e3)),text:X($(5e6)),group:X(ea),groupIndex:X($i),image:X(qs),thumb:X(e=>typeof e=="string"&&e.length<=4e5&&qs(e))}),C1=_a({id:$(200),kind:go("tmux","terminal","chat"),label:$(100),detail:$(300),closed:X(et)}),N1=X($(Lp)),Ha=fn(Sn(js),60),Y3={link:{data:Ys},ping:{},"projects.get":{req:Le,url:X($(4096))},"capture.save":{req:Le,project:St,url:X($(4096)),browser:X($(100)),captures:fn(Y2,60),send:X($(200))},"item.send":{req:Le,project:St,ids:Ha,target:X($(200)),open:X(et),prompt:N1},"items.move":{req:Le,project:St,ids:Ha,to:St},"items.get":{req:Le,project:St},"item.thumb":{req:Le,project:St,id:Sn(js)},"item.remove":{req:Le,project:St,ids:Ha},"item.restore":{req:Le,project:St,ids:Ha},"item.content":{req:Le,project:St,id:Sn(js),offset:e=>Number.isSafeInteger(e)&&e>=0},"agentmux.start":{req:Le,project:St,harness:go(...Us)},"items.group":{req:Le,project:St,ids:Ha},"items.ungroup":{req:Le,project:St,group:ea},"project.pin":{req:Le,project:St,pinned:et}},V2=_a({path:St,name:$(300),vscode:et,agentmux:et,saved:et,pinned:et,targets:X(fn(C1,50)),defaultTarget:X($(200)),harnesses:X(fn(go(...Us),10)),inbox:X(et)}),K2=_a({v:e=>e===1,id:Sn(js),kind:T1,title:$(300),detail:X($(1e3)),url:X($(4096)),time:$i,group:X(ea),groupIndex:X($i),key:X($(200)),source:go("browser","vscode"),browser:X($(100)),preview:X($(1e3)),files:_a({file:X(Sn(Hp)),text:X(Sn(Hp)),thumb:X(Sn(Hp))}),sentTo:fn($(200),50)}),V3={link:{data:Ys},status:{vscode:et,peer:X($(200)),features:X(fn($(40),50))},relink:{},pong:{},projects:{req:Le,projects:fn(V2,500),suggested:X(St)},"capture.saved":{req:Le,ok:et,ids:X(Ha),error:X($(1e3)),sentTo:X($(200))},"item.sent":{req:Le,ok:et,sentTo:X($(200)),error:X($(1e3))},items:{req:Le,ok:et,items:fn(K2,500),error:X($(1e3))},started:{req:Le,ok:et,target:X($(200)),error:X($(1e3))},content:{req:Le,ok:et,mimeType:X(go(...B2)),size:X($i),data:X(qs),error:X($(1e3))},thumb:{req:Le,data:X(qs),mimeType:X(go("image/jpeg","image/png"))},done:{req:Le,ok:et,error:X($(1e3))}},K3={window:{id:ea,name:$(200),folders:fn(q2,50),focusedAt:$i,targets:X(fn(C1,50))},link:{browser:ea,data:Ys},shutdown:{},ping:{},"run.sent":{req:Le,ok:et,sentTo:X($(200)),error:X($(1e3))}},X2=_a({id:ea,name:$(100),origin:$(256)}),X3={welcome:{build:$(100),leader:et},leader:{leader:et},browsers:{browsers:fn(X2,50)},link:{browser:ea,data:Ys},gone:{browser:ea},pong:{},"run.send":{req:Le,project:St,ids:Ha,target:$(200),prompt:N1}};function M1(e){return e.inbox?"captures without a project":[e.vscode&&"VS Code",e.agentmux&&"agentmux",!E1(e)&&e.saved&&"saved",e.pinned&&"pinned"].filter(Boolean).join(" \xB7 ")}var Wt=L(je(),1);function A1(e,t){let n=e.find(a=>a.id===t),o=e.filter(a=>a!==n);return[...n?[n]:[],...o.filter(a=>!a.closed),...o.filter(a=>a.closed)]}function z1(e){return e.closed?`${e.detail} \xB7 agentmux is closed`:e.detail}function O1(e,t){return e?.closed?`agentmux was closed: opened it and sent to ${t}`:`Sent to ${t}`}function R1(e,t){if(/^[1-9]$/.test(e))return t[Number(e)-1]}function D1(e){return e.kind==="chat"?"comment-discussion":e.kind==="tmux"?"terminal-tmux":"terminal"}var Bp=L(q(),1),G2=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function La({binding:e,size:t="md"}){let n=Vi(e,G2);return(0,Bp.jsx)("span",{className:`keycaps size-${t}`,"aria-label":n.join("+"),children:n.map((o,a)=>(0,Bp.jsx)("kbd",{className:"keycap",children:o},a))})}var Up=L(q(),1);function _1({className:e,disabled:t,rows:n=2,...o}){return(0,Up.jsx)("div",{className:re("text-field","multiline",t&&"disabled",e),children:(0,Up.jsx)("textarea",{spellCheck:!1,rows:n,...o,disabled:t})})}var Z=L(q(),1),H1='button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])';function L1(e){let{targets:t,defaultTarget:n,harnesses:o=[],onClose:a,map:i,canPrompt:r=!0}=e,l=(0,Wt.useRef)(null),c=(0,Wt.useRef)(null),[s,g]=(0,Wt.useState)(""),[h,f]=(0,Wt.useState)(),p=(z,F)=>{f(z);let O=s.trim();e.onSend(z,O?{...F,prompt:O}:F)},x=(0,Wt.useRef)(null),w=(0,Wt.useRef)(null),[T,m]=(0,Wt.useState)(null),u=A1(t,n),[d,b]=(0,Wt.useState)(),v=u.some(z=>z.id===d)?d:u[0]?.id,E=e.status?.tone==="busy",k=u.some(z=>z.kind==="tmux"),S=u.length>0&&u.every(z=>z.closed),M=h?k1(h):void 0,A=E&&M?.kind==="agentmux-new"?`Starting a new ${bl[M.harness]} thread in agentmux\u2026`:e.status?.text,D=z=>i[z]?.[0];(0,Wt.useEffect)(()=>{let z=l.current?.getRootNode()?.activeElement;return l.current?.focus(),()=>z?.focus?.()},[]),(0,Wt.useEffect)(()=>{let z=l.current,F=z?.parentElement;if(!z||!F)return;let O=z.getRootNode(),oe=O instanceof ShadowRoot?O.host:void 0,ee=z.ownerDocument,se=ee.documentElement,Be={htmlOverflow:se.style.overflow,bodyOverflow:ee.body.style.overflow,paddingRight:se.style.paddingRight},_e=ee.defaultView?ee.defaultView.innerWidth-se.clientWidth:0;se.style.overflow="hidden",ee.body.style.overflow="hidden",_e>0&&(se.style.paddingRight=`${_e}px`);let Ve=j=>{(!z.contains(j.target)||z.scrollHeight<=z.clientHeight)&&j.preventDefault()};F.addEventListener("wheel",Ve,{passive:!1}),F.addEventListener("touchmove",Ve,{passive:!1});let _=j=>{let K=j.target;!K||K===oe||z.contains(K)||K.closest?.("[data-ink-popup]")||(z.querySelector(H1)??z).focus()};return ee.addEventListener("focusin",_,!0),()=>{se.style.overflow=Be.htmlOverflow,ee.body.style.overflow=Be.bodyOverflow,se.style.paddingRight=Be.paddingRight,F.removeEventListener("wheel",Ve),F.removeEventListener("touchmove",Ve),ee.removeEventListener("focusin",_,!0)}},[]);let H=z=>{if(!u.length)return;let F=u.findIndex(oe=>oe.id===v),O=u[(F+z+u.length)%u.length];b(O.id),l.current?.querySelector(`[data-target="${CSS.escape(O.id)}"]`)?.focus()},Y=()=>{let z=x.current?.getBoundingClientRect();z&&m({x:z.left,y:z.bottom+4,anchor:z,items:o.map(F=>({label:bl[F],icon:"terminal-tmux",onSelect:()=>{if(!e.onNewThread)return p(S1(F),{open:!1});b(void 0),e.onNewThread(F)}}))})},ne=z=>{if(z.defaultPrevented)return;if(z.key==="Tab"){let _=[...l.current?.querySelectorAll(H1)??[]];if(!_.length)return;let j=l.current.getRootNode(),K=_.indexOf(j.activeElement),de=z.shiftKey?K<=0?_.length-1:K-1:(K+1)%_.length;_[de].focus(),z.preventDefault();return}if(E){if(z.key!=="Escape")return;z.preventDefault(),z.stopPropagation(),a();return}let F=z.nativeEvent;if(z.target===c.current){z.key==="Enter"&&!z.shiftKey&&!F.isComposing?(z.preventDefault(),v&&p(v,{open:!1})):z.key==="Escape"&&(z.preventDefault(),a()),z.stopPropagation();return}let O=z.target.closest('[role="menu"], [role="listbox"], input');if((z.key==="ArrowDown"||z.key==="ArrowUp")&&!O&&u.length){z.preventDefault(),z.stopPropagation(),H(z.key==="ArrowDown"?1:-1);return}let oe=/^Digit([1-9])$/.exec(F.code)?.[1],ee=oe&&!z.ctrlKey&&!z.altKey&&!z.metaKey?R1(oe,u):void 0;if(ee){z.preventDefault(),z.stopPropagation(),p(ee.id,{open:z.shiftKey&&ee.kind==="tmux"});return}if(z.target.closest("button")&&z.key==="Enter")return;let Be=dl(i,["send"],fo(F))?.id,_e={"send.default":v?()=>p(v,{open:!1}):void 0,"send.newThread":o.length?Y:void 0,"send.prompt":r?()=>c.current?.focus():void 0,"send.project":e.onProject?()=>w.current?.querySelector("button")?.click():void 0,"send.copy":e.onCopy,"send.download":e.onDownload,"send.close":a},Ve=Be?_e[Be]:z.key==="Escape"?a:void 0;Ve&&(z.preventDefault(),z.stopPropagation(),Ve())};return(0,Z.jsx)("div",{className:"ink-modal-backdrop",onMouseDown:z=>{z.target===z.currentTarget&&!E&&a()},children:(0,Z.jsxs)("div",{ref:l,className:"ink-modal",role:"dialog","aria-modal":"true","aria-label":e.title,tabIndex:-1,onKeyDown:ne,children:[(0,Z.jsxs)("div",{className:"ink-modal-head",children:[(0,Z.jsxs)("div",{className:"ink-modal-heading",children:[(0,Z.jsxs)("div",{className:"ink-modal-title",children:[(0,Z.jsx)("span",{className:"codicon codicon-pass-filled","aria-hidden":"true"}),(0,Z.jsx)("span",{className:"ink-modal-title-text",title:e.title,children:e.title})]}),e.project&&(0,Z.jsxs)("div",{className:"ink-modal-project",ref:w,children:[(0,Z.jsx)("span",{className:"ink-muted",children:"Saved in"}),e.projects&&e.projects.length>1&&e.onProject?(0,Z.jsx)(Xn,{size:"sm",appearance:"quiet",label:"Project",icon:"folder",value:e.project.path,onChange:e.onProject,options:e.projects.map(z=>({value:z.path,label:z.name,detail:z.detail,icon:"folder"}))}):(0,Z.jsx)("span",{className:"ink-modal-project-name",children:e.project.name})]}),e.detail&&(0,Z.jsx)("div",{className:"ink-modal-detail",children:e.detail})]}),(0,Z.jsx)(Me,{icon:"close",label:"Close (it stays saved)",onClick:a})]}),!!e.images?.length&&(0,Z.jsx)("div",{className:"ink-modal-thumbs","aria-hidden":"true",children:e.images.slice(0,4).map((z,F,O)=>(0,Z.jsxs)("span",{className:"ink-modal-thumb",children:[(0,Z.jsx)("img",{src:z,alt:""}),F===O.length-1&&e.images.length>O.length&&(0,Z.jsxs)("span",{className:"ink-modal-more",children:["+",e.images.length-O.length]})]},F))}),r&&(0,Z.jsx)(_1,{ref:c,className:"ink-modal-prompt","aria-label":"Prompt for the agent",placeholder:"Add a prompt (optional). Enter sends, Shift+Enter adds a line.",value:s,maxLength:Lp,disabled:E,onChange:z=>g(z.target.value)}),(0,Z.jsxs)("div",{className:"ink-modal-label",children:["Send to",u.length>0&&(0,Z.jsx)("span",{className:"ink-modal-count",children:u.length})]}),u.length?(0,Z.jsx)("ul",{className:"ink-modal-targets",role:"list",children:u.map((z,F)=>(0,Z.jsxs)("li",{className:re("ink-modal-target",z.id===v&&"default",z.closed&&"closed"),children:[(0,Z.jsxs)("button",{type:"button",className:"ink-modal-send","data-target":z.id,"aria-current":z.id===v?"true":void 0,disabled:E,onClick:()=>p(z.id,{open:!1}),"aria-keyshortcuts":F<9?String(F+1):void 0,children:[(0,Z.jsx)("span",{className:"ink-modal-icon","aria-hidden":"true",children:(0,Z.jsx)("span",{className:`codicon codicon-${D1(z)}`})}),(0,Z.jsxs)("span",{className:"ink-modal-text",children:[(0,Z.jsx)("span",{className:"ink-modal-agent",children:z.label}),(0,Z.jsx)("span",{className:"ink-modal-where",children:z1(z)})]}),(0,Z.jsxs)("span",{className:"ink-modal-keys",children:[F<9&&(0,Z.jsx)("span",{className:"ink-modal-number",children:F+1}),z.id===v&&D("send.default")&&(0,Z.jsx)(La,{binding:D("send.default"),size:"sm"})]})]}),z.kind==="tmux"?(0,Z.jsx)(Me,{icon:"link-external",label:`Send and open ${z.detail} in agentmux`,disabled:E,onClick:()=>p(z.id,{open:!0})}):k&&(0,Z.jsx)("span",{className:"ink-modal-open-space","aria-hidden":"true"})]},z.id))}):(0,Z.jsx)("div",{className:"ink-modal-empty",children:e.emptyText??"No agent is running for this project."}),S&&(0,Z.jsx)("div",{className:"ink-modal-note",children:"agentmux is closed and no VS Code agent is open. Sending opens agentmux first."}),o.length>0&&(0,Z.jsxs)($e,{ref:x,size:"sm",variant:"ghost",icon:"add",iconEnd:"chevron-down",className:"ink-modal-thread",disabled:E,onClick:Y,children:["New agentmux thread",D("send.newThread")&&(0,Z.jsx)(La,{binding:D("send.newThread"),size:"sm"})]}),(0,Z.jsxs)("div",{className:"ink-modal-foot",children:[(0,Z.jsx)("span",{className:re("ink-modal-status",e.status&&`tone-${e.status.tone}`),role:"status",children:A??"Esc keeps it saved."}),e.onCopy&&(0,Z.jsxs)($e,{size:"sm",variant:"ghost",icon:"copy",disabled:E,onClick:e.onCopy,children:["Copy",D("send.copy")&&(0,Z.jsx)(La,{binding:D("send.copy"),size:"sm"})]}),e.onDownload&&(0,Z.jsxs)($e,{size:"sm",variant:"ghost",icon:"desktop-download",disabled:E,onClick:e.onDownload,children:[e.downloadLabel??"Download",D("send.download")&&(0,Z.jsx)(La,{binding:D("send.download"),size:"sm"})]})]}),T&&(0,Z.jsx)(Bs,{menu:T,onClose:()=>m(null)})]})})}var B1="inkspect:request",Vs="inkspect:response",jp="data-inkspect-target";async function De(e){try{return await chrome.runtime.sendMessage(e)??{ok:!1,error:"No reply from the extension"}}catch(t){return{ok:!1,error:t instanceof Error?t.message:String(t)}}}var Ks="inkspectShortcuts",vl=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh"),j1=kn.filter(e=>fp.has(e.id)),Q2={"mode.device":"Responsive view","mode.screenshot":"Screenshot menu","open.shortcuts":"Keyboard shortcuts"},q1=e=>Q2[e.id]??e.label,Y1=e=>e==="global"?"General":sl[e],U1=["global","inspect","draw","screenshot"],V1=[...U1,...Object.keys(sl).filter(e=>!U1.includes(e))];async function K1(){let e=(await chrome.storage.sync.get(Ks))[Ks];return{overrides:ty(e?.shortcuts??{}),updated:typeof e?.updated=="number"?e.updated:0}}async function X1(e){let{updated:t}=await K1();await chrome.storage.sync.set({[Ks]:{shortcuts:e,updated:Math.max(Date.now(),t+1)}})}function G1(e){let t=()=>{K1().then(o=>e(Ts(o.overrides,vl),o))},n=(o,a)=>{a==="sync"&&o[Ks]&&t()};return chrome.storage.onChanged.addListener(n),t(),()=>chrome.storage.onChanged.removeListener(n)}async function qp(e,t,n){let o={...e},a=kn.find(l=>l.id===t),i=a?ul(a,vl).map(Es):[],r=n!==void 0&&n.length===i.length&&n.every(l=>i.includes(l));n===void 0||r?delete o[t]:o[t]=n,await X1(o)}async function Q1(){await X1({})}var Z1=(e=2)=>new Promise(t=>{let n=o=>o?requestAnimationFrame(()=>n(o-1)):setTimeout(t,30);n(e)});async function Z2(e){let t=new Image;return t.src=e,await t.decode(),t}async function yl(e){let t=e();await Z1();try{let n=await De({type:"capture"});if(!n.ok||!n.dataUrl)throw new Error(n.ok?"No image":n.error);return await Z2(n.dataUrl)}finally{t()}}function P2(){let e=[];for(let t of document.querySelectorAll("body *")){let n=getComputedStyle(t).position;(n==="fixed"||n==="sticky")&&(e.push([t,t.style.getPropertyValue("visibility")]),t.style.setProperty("visibility","hidden","important"))}return()=>{for(let[t,n]of e)n?t.style.setProperty("visibility",n):t.style.removeProperty("visibility")}}function $2(e,t){return Math.min(1,32e3/t,32e3/e,Math.sqrt(25e7/(e*t)))}async function Yp(e,t){let n=document.documentElement,o=Math.max(n.scrollWidth,innerWidth),a=Math.max(n.scrollHeight,innerHeight),i=Math.max(0,Math.floor(e.x)),r=Math.max(0,Math.floor(e.y)),l={x:i,y:r,width:Math.max(1,Math.min(Math.ceil(e.width+e.x-i),o-i)),height:Math.max(1,Math.min(Math.ceil(e.height+e.y-r),a-r))},c={x:scrollX,y:scrollY},s=l.x>=scrollX&&l.y>=scrollY&&l.x+l.width<=scrollX+n.clientWidth&&l.y+l.height<=scrollY+n.clientHeight,g=devicePixelRatio,h=$2(l.width*g,l.height*g),f=document.createElement("canvas");f.width=Math.round(l.width*g*h),f.height=Math.round(l.height*g*h);let p=f.getContext("2d"),x=(T,m,u)=>{let d=T.width/innerWidth,b=(l.x-m)*d,v=Math.max(0,l.y-u)*d,E=Math.max(0,u-l.y),k=Math.min(l.height-E,n.clientHeight-Math.max(0,l.y-u));k<=0||p.drawImage(T,b,v,l.width*d,k*d,0,E*g*h,f.width,k*g*h)};if(s)return x(await yl(t),scrollX,scrollY),{dataUrl:f.toDataURL("image/png"),area:l};let w;try{let T=Math.min(l.x,Math.max(0,o-n.clientWidth));for(let m=l.y;m<l.y+l.height;){scrollTo(T,m),await Z1(),x(await yl(t),scrollX,scrollY);let u=scrollY+n.clientHeight;if(u>=l.y+l.height||u>=a)break;m=u,w??=P2()}}finally{w?.(),scrollTo(c.x,c.y)}return{dataUrl:f.toDataURL("image/png"),area:l}}function Vp(){let e=document.documentElement;return{x:scrollX,y:scrollY,width:e.clientWidth,height:e.clientHeight}}function Kp(){let e=document.documentElement;return{x:0,y:0,width:e.clientWidth,height:Math.max(e.scrollHeight,innerHeight)}}async function P1(e){let t=e.getBoundingClientRect(),n=await yl(()=>()=>{}),o=n.width/innerWidth,a=document.createElement("canvas");return a.width=Math.round(t.width*o),a.height=Math.round(t.height*o),a.getContext("2d").drawImage(n,t.x*o,t.y*o,t.width*o,t.height*o,0,0,a.width,a.height),a.toDataURL("image/png")}async function $1(e,t=480){try{let n=e.replace(/^data:image\/\w+;base64,/,""),o=Uint8Array.from(atob(n),g=>g.charCodeAt(0)),a=await createImageBitmap(new Blob([o],{type:"image/png"})),i=Math.min(1,t/Math.max(a.width,a.height)),r=new OffscreenCanvas(Math.max(1,Math.round(a.width*i)),Math.max(1,Math.round(a.height*i)));r.getContext("2d").drawImage(a,0,0,r.width,r.height),a.close();let l=await r.convertToBlob({type:"image/jpeg",quality:.75}),c=new Uint8Array(await l.arrayBuffer()),s="";for(let g=0;g<c.length;g+=32768)s+=String.fromCharCode(...c.subarray(g,g+32768));return btoa(s)}catch{return}}function J1(e,t,n){let o=l=>{if(l===document.scrollingElement||l===document.body||l===document.documentElement)return!1;let c=getComputedStyle(l),s=g=>/auto|scroll|overlay/.test(g);return s(c.overflowY)&&l.scrollHeight>l.clientHeight+1||s(c.overflowX)&&l.scrollWidth>l.clientWidth+1},i=document.elementsFromPoint(e,t).find(l=>!n||l!==n&&!n.contains(l))??null;for(;i&&!o(i);)i=i.parentElement;if(!i)return null;let r=[];for(let l=i;l&&l!==document.documentElement;l=l.parentElement){if(l.id&&document.querySelectorAll(`#${CSS.escape(l.id)}`).length===1){r.unshift(`#${CSS.escape(l.id)}`);break}let c=l.localName,s=l.parentElement?[...l.parentElement.children].filter(g=>g.localName===c).indexOf(l)+1:1;r.unshift(`${CSS.escape(c)}:nth-of-type(${s})`)}return r.join(" > ")}function Xp(e){let t=o=>{if(o===document.scrollingElement||o===document.body||o===document.documentElement)return!1;let a=getComputedStyle(o),i=r=>/auto|scroll|overlay/.test(r);return i(a.overflowY)&&o.scrollHeight>o.clientHeight+1||i(a.overflowX)&&o.scrollWidth>o.clientWidth+1},n={};for(let o of e){let a=null;try{a=document.querySelector(o)}catch{}if(!a)continue;let i=0,r=0,l=-1/0,c=-1/0,s=1/0,g=1/0;for(let h=a;h;h=h.parentElement){if(h!==a&&!t(h))continue;if(h===document.body||h===document.documentElement)break;i+=h.scrollLeft,r+=h.scrollTop;let f=h.getBoundingClientRect();l=Math.max(l,f.left+h.clientLeft+scrollX),c=Math.max(c,f.top+h.clientTop+scrollY),s=Math.min(s,f.left+h.clientLeft+h.clientWidth+scrollX),g=Math.min(g,f.top+h.clientTop+h.clientHeight+scrollY)}n[o]={x:i,y:r,clip:{x:l,y:c,width:Math.max(0,s-l),height:Math.max(0,g-c)}}}return n}function I1(e,t,n){let o=J1(e,t,n),a=o?Xp([o])[o]:void 0;return o&&a?{id:o,at:a}:void 0}function Xs(e){let t=[...new Set(e.flatMap(n=>n.anchor?[n.anchor]:[]))];return t.length?Xp(t):{}}function J2(e){if(e===document.scrollingElement||e===document.body||e===document.documentElement)return!1;let t=getComputedStyle(e),n=o=>/auto|scroll|overlay/.test(o);return n(t.overflowY)&&e.scrollHeight>e.clientHeight+1||n(t.overflowX)&&e.scrollWidth>e.clientWidth+1}function F1(e,t){let n=e.deltaMode===WheelEvent.DOM_DELTA_LINE?16:e.deltaMode===WheelEvent.DOM_DELTA_PAGE?innerHeight:1,o=e.deltaX*n,a=e.deltaY*n;e.shiftKey&&!o&&([o,a]=[a,0]);let i=document.elementsFromPoint(e.clientX,e.clientY).find(r=>r!==t&&!t.contains(r))??null;for(;i;i=i.parentElement){if(!J2(i))continue;if(a>0&&i.scrollTop+i.clientHeight<i.scrollHeight-1||a<0&&i.scrollTop>0||o>0&&i.scrollLeft+i.clientWidth<i.scrollWidth-1||o<0&&i.scrollLeft>0){i.scrollBy({left:o,top:a,behavior:"instant"});return}}window.scrollBy({left:o,top:a,behavior:"instant"})}var ho=L(je());var lt=L(q(),1),Gp=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function W1({purpose:e,map:t,helpKey:n,className:o,style:a}){let i=r=>{let l=t[r]?.[0];return l?Vi(l,Gp):[]};return e==="screenshot"?(0,lt.jsxs)("div",{className:re("picker-hint",o),style:a,role:"status",children:[(0,lt.jsx)("span",{className:"picker-hint-lead",children:"Click an element to screenshot it"}),(0,lt.jsx)(xl,{caps:i("inspect.exit"),label:"cancel"})]}):(0,lt.jsxs)("div",{className:re("picker-hint",o),style:a,role:"status",children:[(0,lt.jsxs)("span",{className:"picker-hint-item",children:[(0,lt.jsx)("span",{className:"picker-hint-lead",children:"Click"}),(0,lt.jsx)("span",{className:"picker-hint-label",children:"to capture"})]}),(0,lt.jsx)(xl,{caps:[Gp?"\u2325":"Alt"],click:!0,label:"screenshot"}),(0,lt.jsx)(xl,{caps:[Gp?"\u21E7":"Shift"],click:!0,label:"to add"}),(0,lt.jsx)(xl,{caps:i("inspect.exit"),label:"stop"}),n&&(0,lt.jsx)(xl,{caps:i("inspect.help"),label:"keys"})]})}function xl({caps:e,click:t,label:n}){return e.length?(0,lt.jsxs)("span",{className:"picker-hint-item",children:[(0,lt.jsx)("span",{className:"keycaps size-sm",children:e.map((o,a)=>(0,lt.jsx)("kbd",{className:"keycap",children:o},a))}),t&&(0,lt.jsx)("span",{className:"picker-hint-click",children:"+ click"}),(0,lt.jsx)("span",{className:"picker-hint-label",children:n})]}):null}var I=L(q()),I2={Escape:"inspect.exit",ArrowUp:"inspect.parent",ArrowDown:"inspect.child",Enter:"inspect.copy"},tt=e=>parseFloat(e)||0;function F2(e){let t=e.getBoundingClientRect(),n=getComputedStyle(e),o={x:t.x,y:t.y,width:t.width,height:t.height},a={x:o.x-tt(n.marginLeft),y:o.y-tt(n.marginTop),width:o.width+tt(n.marginLeft)+tt(n.marginRight),height:o.height+tt(n.marginTop)+tt(n.marginBottom)},i={x:o.x+tt(n.borderLeftWidth),y:o.y+tt(n.borderTopWidth),width:o.width-tt(n.borderLeftWidth)-tt(n.borderRightWidth),height:o.height-tt(n.borderTopWidth)-tt(n.borderBottomWidth)},r={x:i.x+tt(n.paddingLeft),y:i.y+tt(n.paddingTop),width:i.width-tt(n.paddingLeft)-tt(n.paddingRight),height:i.height-tt(n.paddingTop)-tt(n.paddingBottom)};return{margin:a,border:o,padding:i,content:r}}function W2(e){let t={r:255,g:255,b:255,a:1},n=[];for(let o=e;o;o=o.parentElement){let a=Da(getComputedStyle(o).backgroundColor);if(a&&a.a>0&&(n.push(a),a.a>=1))break}for(let o of n.reverse())t={r:o.r*o.a+t.r*(1-o.a),g:o.g*o.a+t.g*(1-o.a),b:o.b*o.a+t.b*(1-o.a),a:1};return t}function eT(e){let t=e;return t.disabled?!1:t.tabIndex>=0}var ex=(e,t)=>{let n=["Top","Right","Bottom","Left"].map(o=>e.getPropertyValue(`${t}-${o.toLowerCase()}`));return n.every(o=>o===n[0])?n[0]:n[0]===n[2]&&n[1]===n[3]?`${n[0]} ${n[1]}`:n.join(" ")};function tT(e){let t=getComputedStyle(e),n=e.getBoundingClientRect(),o=Da(t.color),a=Da(t.backgroundColor),i=W2(e),r=!!e.innerText?.trim(),l=o&&r?i1(o,i):void 0,{role:c,name:s}=Ds(e),g=ex(t,"margin"),h=ex(t,"padding");return{tag:e.tagName.toLowerCase(),id:e.id,classes:Array.from(e.classList).slice(0,4),size:`${Math.round(n.width*100)/100} \xD7 ${Math.round(n.height*100)/100}`,color:r&&o?Pi(o):void 0,font:r?`${t.fontSize} ${t.fontFamily.split(",")[0].replace(/["']/g,"")}`:void 0,background:a&&a.a>0?Pi(a):void 0,margin:g!=="0px"?g:void 0,padding:h!=="0px"?h:void 0,ratio:l,ratioPasses:l!==void 0?r1(l,tt(t.fontSize),Number(t.fontWeight)||400):void 0,role:c,name:s,focusable:eT(e),rect:n}}function tx({host:e,purpose:t,selection:n,onPick:o,onCommit:a,onExit:i,actionOf:r,map:l}){let[c,s]=(0,ho.useState)(null),[,g]=(0,ho.useState)(0),h=(0,ho.useRef)(null),f=(0,ho.useRef)({onPick:o,onCommit:a,onExit:i,actionOf:r});(0,ho.useEffect)(()=>{f.current={onPick:o,onCommit:a,onExit:i,actionOf:r}}),(0,ho.useEffect)(()=>{let d=H=>H.composedPath().includes(e),b=(H,Y)=>document.elementsFromPoint(H,Y).find(ne=>ne!==e&&!e.contains(ne))??null,v=H=>{h.current=H,s(H)},E=H=>{if(d(H))return;let Y=b(H.clientX,H.clientY);Y!==h.current&&v(Y)},k=H=>{d(H)||(H.preventDefault(),H.stopImmediatePropagation())},S=H=>{if(d(H))return;k(H);let Y=b(H.clientX,H.clientY)??h.current;Y&&f.current.onPick(Y,{add:H.shiftKey,screenshot:H.altKey})},M=H=>{let Y=f.current.actionOf?f.current.actionOf(H):I2[H.key];if(d(H)&&Y!=="inspect.exit")return;let ne=h.current;if(Y==="inspect.exit")f.current.onExit();else if(Y==="inspect.parent"&&ne)v(Ny(ne)??ne);else if(Y==="inspect.child"&&ne)v(My(ne)??ne);else if(Y==="inspect.copy")f.current.onCommit(ne);else return;H.preventDefault(),H.stopImmediatePropagation()},A=()=>g(H=>H+1),D=["mousedown","mouseup","pointerdown","pointerup","dblclick","auxclick","contextmenu"];window.addEventListener("mousemove",E,!0),window.addEventListener("click",S,!0),window.addEventListener("keydown",M,!0),window.addEventListener("scroll",A,!0),window.addEventListener("resize",A);for(let H of D)window.addEventListener(H,k,!0);return()=>{window.removeEventListener("mousemove",E,!0),window.removeEventListener("click",S,!0),window.removeEventListener("keydown",M,!0),window.removeEventListener("scroll",A,!0),window.removeEventListener("resize",A);for(let H of D)window.removeEventListener(H,k,!0)}},[e]);let p=c?.isConnected?tT(c):void 0,x=c?.isConnected?F2(c):void 0,w=d=>({left:d.x,top:d.y,width:Math.max(0,d.width),height:Math.max(0,d.height)}),T=250,m=p?p.rect.bottom+8+220<innerHeight?p.rect.bottom+8:Math.max(4,p.rect.top-8-220):0,u=p?Math.max(4,Math.min(p.rect.left,innerWidth-T-8)):0;return(0,I.jsxs)("div",{className:"inspector",children:[(0,I.jsx)(W1,{className:"inspect-hint",purpose:t,map:l}),x&&(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("div",{className:"hl hl-margin",style:w(x.margin)}),(0,I.jsx)("div",{className:"hl hl-border",style:w(x.border)}),(0,I.jsx)("div",{className:"hl hl-padding",style:w(x.padding)}),(0,I.jsx)("div",{className:"hl hl-content",style:w(x.content)}),(0,I.jsx)("div",{className:"hl hl-outline",style:w(x.border)})]}),n.map((d,b)=>{let v=d.getBoundingClientRect();return(0,I.jsx)("div",{className:"selection-box",style:w(v),children:(0,I.jsx)("span",{className:"selection-badge",children:b+1})},b)}),p&&(0,I.jsxs)("div",{className:"tip",style:{left:u,top:m,width:T},children:[(0,I.jsxs)("div",{className:"tip-head",children:[(0,I.jsxs)("span",{children:[(0,I.jsx)("span",{className:"tip-tag",children:p.tag}),p.id&&(0,I.jsxs)("span",{className:"tip-id",children:["#",p.id]}),p.classes.map(d=>(0,I.jsxs)("span",{className:"tip-class",children:[".",d]},d))]}),(0,I.jsx)("span",{className:"tip-size",children:p.size})]}),p.color&&(0,I.jsx)(Ba,{label:"Color",value:p.color,swatch:p.color}),p.font&&(0,I.jsx)(Ba,{label:"Font",value:p.font}),p.background&&(0,I.jsx)(Ba,{label:"Background",value:p.background,swatch:p.background}),p.margin&&(0,I.jsx)(Ba,{label:"Margin",value:p.margin}),p.padding&&(0,I.jsx)(Ba,{label:"Padding",value:p.padding}),(0,I.jsx)("div",{className:"tip-section",children:"Accessibility"}),p.ratio!==void 0&&(0,I.jsxs)("div",{className:"tip-row",children:[(0,I.jsx)("span",{children:"Contrast"}),(0,I.jsxs)("span",{children:[(0,I.jsx)("span",{className:"tip-aa",style:{color:p.color,background:p.background},children:"Aa"})," ",p.ratio.toFixed(2)," ",(0,I.jsx)("span",{className:p.ratioPasses?"ok":"bad",children:p.ratioPasses?"\u2713":"!"})]})]}),(0,I.jsx)(Ba,{label:"Name",value:p.name??""}),(0,I.jsx)(Ba,{label:"Role",value:p.role??"generic"}),(0,I.jsxs)("div",{className:"tip-row",children:[(0,I.jsx)("span",{children:"Keyboard-focusable"}),(0,I.jsx)("span",{className:p.focusable?"ok":"muted",children:p.focusable?"\u2713":"\u2298"})]})]})]})}function Ba({label:e,value:t,swatch:n}){return(0,I.jsxs)("div",{className:"tip-row",children:[(0,I.jsx)("span",{children:e}),(0,I.jsxs)("span",{className:"tip-value",children:[n&&(0,I.jsx)("span",{className:"tip-swatch",style:{background:n}}),t]})]})}var er=L(je());var Gs=L(je(),1);var ox=L(q(),1);function nx({children:e,confirmLabel:t,onConfirm:n,icon:o,variant:a="ghost",size:i="sm",disabled:r,title:l,className:c}){let[s,g]=(0,Gs.useState)(!1);return(0,Gs.useEffect)(()=>{if(!s)return;let h=setTimeout(()=>g(!1),4e3);return()=>clearTimeout(h)},[s]),(0,ox.jsx)($e,{size:i,variant:s?"danger":a,icon:s?"warning":o,disabled:r,title:l,className:c,"aria-live":"polite",onClick:()=>{if(!s){g(!0);return}g(!1),n()},onBlur:()=>g(!1),children:s?t:e})}var Ji=L(q(),1);function Qs({label:e,hint:t,error:n,inline:o,className:a,children:i}){return(0,Ji.jsxs)("label",{className:re("field",o&&"inline",a),children:[(0,Ji.jsx)("span",{className:"field-label",children:e}),(0,Ji.jsx)("span",{className:"field-control",children:i}),(n||t)&&(0,Ji.jsx)("span",{className:re("field-hint",n&&"error"),role:n?"alert":void 0,children:n??t})]})}var ta=L(je(),1);var te=L(q(),1),Ii=typeof navigator<"u"&&navigator.userAgent.includes("Macintosh");function ix({actions:e,scopes:t,map:n,overrides:o,query:a="",labelOf:i=s=>s.label,scopeLabel:r=s=>sl[s],onSetKeys:l,onReset:c}){let[s,g]=(0,ta.useState)(new Set),[h,f]=(0,ta.useState)(null),p=(0,ta.useMemo)(()=>new Set(e.map(d=>d.id)),[e]),x=(0,ta.useMemo)(()=>ny(n).filter(d=>d.ids.every(b=>p.has(b))),[n,p]),w=d=>x.filter(b=>b.ids.includes(d)).map(b=>({key:b.key,other:b.ids.find(v=>v!==d)}));(0,ta.useEffect)(()=>{if(!h)return;let d=v=>{if(v.preventDefault(),v.stopImmediatePropagation(),Ns.has(v.key))return;let E=fo(v);if(!E.key)return;let k=!E.ctrl&&!E.alt&&!E.meta&&!E.shift,S=[...n[h.id]??[]];if(k&&E.key==="escape"){f(null);return}if(k&&E.key==="backspace"&&h.index!==void 0)S.splice(h.index,1);else{let M=Cs(E);h.index===void 0?S.push(M):S[h.index]=M}l(h.id,[...new Set(S)]),f(null)},b=v=>{v.composedPath().some(k=>k instanceof HTMLElement&&k.classList.contains("key-recording"))||f(null)};return window.addEventListener("keydown",d,!0),window.addEventListener("pointerdown",b,!0),()=>{window.removeEventListener("keydown",d,!0),window.removeEventListener("pointerdown",b,!0)}},[h,n,l]);let T=a.trim().toLowerCase(),m=d=>!T||i(d).toLowerCase().includes(T)||d.id.toLowerCase().includes(T)||r(d.scope).toLowerCase().includes(T)||(n[d.id]??[]).some(b=>Ft(b,Ii).toLowerCase().includes(T)||ay(b,T)),u=d=>{let b=e.find(v=>v.id===d);return b?i(b):d};return(0,te.jsxs)("div",{className:"shortcut-list",children:[x.length>0&&(0,te.jsxs)("p",{className:"shortcuts-warning",role:"alert",children:[(0,te.jsx)("span",{className:"codicon codicon-warning","aria-hidden":"true"}),x.length===1?"1 key is":`${x.length} keys are`," used twice."]}),t.map(d=>{let b=e.filter(E=>E.scope===d&&m(E));if(!b.length)return null;let v=T!==""||!s.has(d);return(0,te.jsxs)("section",{className:"shortcut-group",children:[(0,te.jsxs)("button",{type:"button",className:"group-header","aria-expanded":v,onClick:()=>g(E=>{let k=new Set(E);return k.has(d)?k.delete(d):k.add(d),k}),children:[(0,te.jsx)("span",{className:`codicon codicon-chevron-${v?"down":"right"}`,"aria-hidden":"true"}),(0,te.jsx)("span",{className:`codicon codicon-${ry[d]} group-icon`,"aria-hidden":"true"}),(0,te.jsx)("span",{className:"group-title",children:r(d)}),(0,te.jsx)("span",{className:"group-count",children:b.length})]}),v&&b.map(E=>(0,te.jsx)(nT,{action:E,label:i(E),keys:n[E.id]??[],changed:E.id in o,conflicts:w(E.id).map(k=>({...k,otherLabel:u(k.other)})),recording:h?.id===E.id?h:null,onRecord:k=>f({id:E.id,index:k}),onCancel:()=>f(null),onRemove:k=>l(E.id,(n[E.id]??[]).filter((S,M)=>M!==k)),onReset:()=>c(E.id),onResolve:(k,S)=>l(k,(n[k]??[]).filter(M=>M!==S))},E.id))]},d)})]})}function nT({action:e,label:t,keys:n,changed:o,conflicts:a,recording:i,onRecord:r,onCancel:l,onRemove:c,onReset:s,onResolve:g}){let h=ul(e,Ii).map(p=>Ft(p,Ii)).join(", ")||"none",f=i!==null&&i.index===void 0;return(0,te.jsxs)("div",{className:`shortcut-item${o?" changed":""}${a.length?" conflict":""}`,children:[(0,te.jsxs)("div",{className:"shortcut-main",children:[(0,te.jsx)("span",{className:"shortcut-label",title:e.id,children:t}),(0,te.jsx)("span",{className:"shortcut-places",children:oy(e).map(p=>(0,te.jsx)("span",{className:`shortcut-tag ${p.id}`,title:p.title,children:p.label},p.id))}),(0,te.jsxs)("span",{className:"shortcut-actions",children:[o&&(0,te.jsx)(Me,{icon:"discard",label:`Reset to default (${h})`,className:"small",onClick:s}),n.length>0&&!f&&(0,te.jsx)(Me,{icon:"add",label:"Add another key",className:"small add-key",onClick:()=>r()})]}),(0,te.jsxs)("span",{className:"shortcut-keys-column",children:[n.map((p,x)=>i?.index===x?(0,te.jsx)(ax,{onCancel:l},p):(0,te.jsxs)("span",{className:"key-button-wrap",children:[(0,te.jsx)("button",{type:"button",className:"key-button",title:"Change: click, then press the new keys","aria-label":`${Ft(p,Ii)}: change`,onClick:()=>r(x),children:(0,te.jsx)(La,{binding:p,size:"sm"})}),(0,te.jsx)("button",{type:"button",className:"key-remove","aria-label":`Remove ${Ft(p,Ii)}`,title:"Remove this key",onClick:()=>c(x),children:(0,te.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]},p)),f&&(0,te.jsx)(ax,{onCancel:l}),!n.length&&!f&&(0,te.jsxs)("button",{type:"button",className:"key-empty",title:"Add a key: click, then press the keys",onClick:()=>r(),children:[(0,te.jsx)("span",{className:"codicon codicon-add","aria-hidden":"true"}),"Add key"]})]})]}),a.map(({key:p,other:x,otherLabel:w})=>(0,te.jsxs)("div",{className:"shortcut-conflict",children:[(0,te.jsx)("span",{className:"codicon codicon-warning","aria-hidden":"true"}),(0,te.jsxs)("span",{children:[Ft(p,Ii)," is also \u201C",w,"\u201D"]}),(0,te.jsx)("button",{type:"button",className:"link-button",onClick:()=>g(x,p),children:"Remove it there"})]},`${p}-${x}`))]})}function ax({onCancel:e}){return(0,te.jsxs)("span",{className:"key-recording",role:"status",children:[(0,te.jsx)("span",{className:"recording-dot","aria-hidden":"true"}),"Press keys\u2026",(0,te.jsx)("button",{type:"button",className:"key-recording-cancel","aria-label":"Cancel",onClick:e,children:(0,te.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]})}var rx=L(je(),1);var Ua=L(q(),1);function Qp({value:e,options:t,onChange:n,label:o,iconOnly:a,size:i="md",className:r}){let l=(0,rx.useRef)(null),c=s=>{let g={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[s.key];if(!g)return;s.preventDefault();let h=t.findIndex(p=>p.value===e),f=t[(h+g+t.length)%t.length];n(f.value),l.current?.querySelector(`[data-value="${CSS.escape(f.value)}"]`)?.focus()};return(0,Ua.jsx)("div",{ref:l,className:re("segmented",`size-${i}`,r),role:"radiogroup","aria-label":o,onKeyDown:c,children:t.map(s=>{let g=s.value===e;return(0,Ua.jsxs)("button",{type:"button",role:"radio","aria-checked":g,"aria-label":a?s.label:void 0,title:a||s.icon?s.label:void 0,"data-value":s.value,tabIndex:g?0:-1,className:re("segment",g&&"checked"),onClick:()=>n(s.value),children:[s.icon&&(0,Ua.jsx)("span",{className:`codicon codicon-${s.icon}`,"aria-hidden":"true"}),!a&&(0,Ua.jsx)("span",{className:"segment-label",children:s.label}),s.count!==void 0&&(0,Ua.jsx)("span",{className:re("segment-count",s.tone),children:s.count})]},s.value)})})}var Fi=L(q(),1);function Zs({checked:e,onChange:t,children:n,label:o,disabled:a,className:i,title:r}){return(0,Fi.jsxs)("button",{type:"button",role:"switch","aria-checked":e,"aria-label":n?void 0:o,title:r,disabled:a,className:re("switch",e&&"on",i),onClick:()=>t(!e),children:[(0,Fi.jsx)("span",{className:"switch-track","aria-hidden":"true",children:(0,Fi.jsx)("span",{className:"switch-thumb"})}),n&&(0,Fi.jsx)("span",{className:"toggle-label",children:n})]})}var wl=L(je());var Ps=L(je()),Wi=L(q());function lx({value:e,onChange:t,onComplete:n,length:o=6,disabled:a}){let i=(0,Ps.useRef)([]),r=Array.from({length:o},(s,g)=>e[g]??""),l=s=>i.current[Math.max(0,Math.min(o-1,s))]?.focus(),c=(s,g)=>{let h=g.replace(/\D/g,"");if(!h)return;let f=(e.slice(0,s)+h).slice(0,o);t(f),l(f.length),f.length===o&&n?.(f)};return(0,Wi.jsx)("div",{className:"code-input",role:"group","aria-label":"Pairing code",children:r.map((s,g)=>(0,Wi.jsxs)(Ps.Fragment,{children:[g===o/2&&(0,Wi.jsx)("span",{className:"code-sep","aria-hidden":"true"}),(0,Wi.jsx)("input",{ref:h=>{i.current[g]=h},className:"code-box",inputMode:"numeric",autoComplete:"one-time-code","aria-label":`Digit ${g+1}`,maxLength:o,disabled:a,value:s,onFocus:h=>h.currentTarget.select(),onChange:h=>c(Math.min(g,e.length),h.target.value),onPaste:h=>{h.preventDefault(),c(0,h.clipboardData.getData("text"))},onKeyDown:h=>{if(h.key==="Backspace"){h.preventDefault();let f=s?g:g-1;f>=0&&t(e.slice(0,f)),l(f)}else h.key==="ArrowLeft"?(h.preventDefault(),l(g-1)):h.key==="ArrowRight"&&(h.preventDefault(),l(g+1))}})]},g))})}var pe=L(q());function cx({status:e,pair:t,compact:n,startWithCode:o}){let[a,i]=(0,wl.useState)(""),[r,l]=(0,wl.useState)(""),[c,s]=(0,wl.useState)(!1),[g,h]=(0,wl.useState)(!!o);if(e.state==="connected")return null;let f=async(x=a)=>{if(x.length!==6||c)return;s(!0),l("");let w=await t(x).catch(()=>{});if(s(!1),!w){l("The extension did not answer. Reload it and try again.");return}l(w.error??""),w.state==="connected"&&i("")},p=(0,pe.jsxs)("p",{className:"card-foot",children:[(0,pe.jsx)("span",{className:"codicon codicon-lock","aria-hidden":"true"}),"The link only talks to VS Code on this computer, and only after pairing (or through the browser helper VS Code installs)."]});return e.via==="hub"?(0,pe.jsx)("div",{className:re("card","pair-card",n&&"compact"),children:(0,pe.jsxs)("p",{className:"pair-lead",children:[(0,pe.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,pe.jsx)("span",{children:"Linked through the browser helper: no pairing needed. VS Code isn't running, so sends to its terminals and chat wait for it; captures still save into your projects, and agentmux agents still get them."})]})}):e.state!=="unpaired"?(0,pe.jsxs)("div",{className:re("card","pair-card",n&&"compact"),children:[(0,pe.jsxs)("p",{className:"pair-lead",children:[(0,pe.jsx)("span",{className:"codicon codicon-loading codicon-modifier-spin","aria-hidden":"true"}),(0,pe.jsxs)("span",{children:["Open VS Code with the VS Code Browser extension. Then click"," ",(0,pe.jsx)("b",{children:"Pair Browser Extension"})," in its ",(0,pe.jsx)("b",{children:"Browser"})," side panel."]})]}),!n&&p]}):(0,pe.jsxs)("form",{className:re("card","pair-card",n&&"compact"),onSubmit:x=>{x.preventDefault(),f()},children:[(0,pe.jsxs)("p",{className:"pair-lead",children:[(0,pe.jsx)("span",{className:"codicon codicon-plug","aria-hidden":"true"}),(0,pe.jsxs)("span",{children:["In VS Code, click ",(0,pe.jsx)("b",{children:"Pair Browser Extension"})," in the ",(0,pe.jsx)("b",{children:"Browser"})," side panel (or"," ",(0,pe.jsx)("b",{children:"Pair"})," on its notification). No code needed: this updates by itself."]})]}),g?(0,pe.jsxs)(pe.Fragment,{children:[(0,pe.jsxs)("p",{className:"muted",children:["Run ",(0,pe.jsx)("kbd",{children:"Browser: Pair Browser Extension with a Code"})," in VS Code, then type the code it shows."]}),(0,pe.jsxs)("div",{className:"pair-row",children:[(0,pe.jsx)(lx,{value:a,onChange:i,disabled:c,onComplete:x=>{f(x)}}),(0,pe.jsx)($e,{type:"submit",variant:"primary",icon:"link",className:"pair-button",loading:c,disabled:a.length!==6,children:"Pair"})]})]}):(0,pe.jsx)($e,{size:"sm",variant:"ghost",icon:"key",className:"use-code",onClick:()=>h(!0),children:"Use a code instead"}),r&&(0,pe.jsxs)("p",{className:"pair-message",role:"alert",children:[(0,pe.jsx)("span",{className:"codicon codicon-error","aria-hidden":"true"}),r]}),!n&&p]})}function ja(e,t=2e3){let n=crypto.randomUUID();return new Promise(o=>{let a=r=>{let l;try{l=JSON.parse(r.detail)}catch{return}l.id===n&&(window.removeEventListener(Vs,a),clearTimeout(i),o(l.result))},i=setTimeout(()=>{window.removeEventListener(Vs,a),o(void 0)},t);window.addEventListener(Vs,a),window.dispatchEvent(new CustomEvent(B1,{detail:JSON.stringify({id:n,request:e})}))})}async function kl(e){try{return await navigator.clipboard.writeText(e),!0}catch{let t=document.createElement("textarea");t.value=e,t.style.cssText="position:fixed;left:-9999px;top:0;opacity:0",document.documentElement.appendChild(t),t.select();let n=document.execCommand("copy");return t.remove(),n}}async function $s(e){try{let t=await(await fetch(e)).blob();return await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),!0}catch{return!1}}var oT={copyFormat:"markdown",fields:[...vp],maxHtml:2e3,annotationPadding:40};async function Zp(){let e=await chrome.storage.sync.get("settings").catch(()=>({}));return{...oT,...e.settings}}function Pp(e=new Date){let t=a=>String(a).padStart(2,"0"),n=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}_${t(e.getHours())}-${t(e.getMinutes())}-${t(e.getSeconds())}`,o=(location.hostname||"page").replace(/[^a-z0-9.-]+/gi,"-").slice(0,40);return`screenshot-${n}-${o}.png`}var V=L(q());function Js({title:e,onClose:t,children:n}){return(0,V.jsxs)("div",{className:"panel",role:"dialog","aria-label":e,children:[(0,V.jsxs)("div",{className:"panel-head",children:[(0,V.jsx)("span",{children:e}),(0,V.jsx)("button",{type:"button",className:"icon-button","aria-label":"Close",title:"Close",onClick:t,children:(0,V.jsx)("span",{className:"codicon codicon-close","aria-hidden":"true"})})]}),(0,V.jsx)("div",{className:"panel-body",children:n})]})}var sx={network:"none",cpu:1,colorScheme:"default",print:!1,agent:!0,touch:!1};function ux({onClose:e,value:t,onChange:n}){let a=i=>n({...t,...i});return(0,V.jsxs)(Js,{title:"Emulation",onClose:e,children:[!1,(0,V.jsx)(Zs,{checked:t.agent,disabled:!1,onChange:i=>a({agent:i}),children:"Device user agent"}),(0,V.jsx)(Zs,{checked:t.touch,disabled:!1,onChange:i=>a({touch:i}),children:"Touch input"}),(0,V.jsxs)("div",{className:"row",children:[(0,V.jsx)(Qs,{label:"Network",children:(0,V.jsx)(Xn,{size:"sm",label:"Network",disabled:!1,value:t.network,onChange:i=>a({network:i}),options:Object.entries(Ay).map(([i,r])=>({value:i,label:r.label}))})}),(0,V.jsx)(Qs,{label:"CPU",children:(0,V.jsx)(Xn,{size:"sm",label:"CPU",disabled:!1,value:String(t.cpu),onChange:i=>a({cpu:Number(i)}),options:zy.map(i=>({value:String(i),label:i===1?"Normal":`${i}\xD7 slower`}))})})]}),(0,V.jsx)(Qs,{label:"Color scheme",children:(0,V.jsx)(Qp,{size:"sm",label:"Color scheme",value:t.colorScheme,onChange:i=>a({colorScheme:i}),options:[{value:"default",label:"Page default"},{value:"light",label:"Light",icon:"color-mode"},{value:"dark",label:"Dark",icon:"color-mode"}]})}),(0,V.jsx)(Zs,{checked:t.print,disabled:!1,onChange:i=>a({print:i}),children:"Print media"}),(0,V.jsx)("p",{className:"note",children:"Chrome shows a \u201Cstarted debugging this browser\u201D bar while touch, network, CPU, color scheme or print media is on. The user agent doesn't need it."})]})}var aT={error:"error",warning:"warning",info:"info",debug:"debug",log:"circle-small"};function dx({onClose:e,copy:t,pageContext:n}){let[o,a]=(0,er.useState)({console:[],network:[]}),[i,r]=(0,er.useState)("console");(0,er.useEffect)(()=>{let f=!0,p=async()=>{let w=await ja({kind:"logs"});f&&w&&a(w)};p();let x=setInterval(()=>{p()},1e3);return()=>{f=!1,clearInterval(x)}},[]);let l=async()=>await ja({kind:"logs"})??o,c=o.console.filter(f=>f.level==="error"),s=o.network.filter(Hs),g=i==="console"?o.console.slice(-200).reverse():[],h=i==="console"?!g.length:!s.length;return(0,V.jsxs)(Js,{title:"Console and network",onClose:e,children:[(0,V.jsxs)("div",{className:"console-tabs",children:[(0,V.jsx)(Qp,{size:"sm",label:"Show",className:"console-view",value:i,onChange:r,options:[{value:"console",label:"Console",icon:"terminal",count:c.length||void 0,tone:c.length?"error":void 0},{value:"network",label:"Failed requests",icon:"globe",count:s.length||void 0,tone:s.length?"error":void 0}]}),(0,V.jsx)(Me,{icon:"clear-all",label:"Clear",onClick:()=>{ja({kind:"clearLogs"}).then(()=>a({console:[],network:[]}))}})]}),(0,V.jsxs)("div",{className:"log",children:[i==="console"?g.map(f=>(0,V.jsxs)("div",{className:`log-row level-${f.level}`,children:[(0,V.jsx)("span",{className:`log-icon codicon codicon-${aT[f.level]??"circle-small"}`,"aria-hidden":"true"}),(0,V.jsx)("span",{className:"log-text",children:f.text}),f.url&&(0,V.jsxs)("span",{className:"log-source",title:f.url,children:[iT(f.url),f.line!==void 0?`:${f.line+1}`:""]})]},f.id)):s.map(f=>(0,V.jsxs)("div",{className:"log-row level-error",title:f.url,children:[(0,V.jsx)("span",{className:"log-icon codicon codicon-error","aria-hidden":"true"}),(0,V.jsxs)("span",{className:"log-text",children:[f.method," ",f.url]}),(0,V.jsx)("span",{className:"log-source",children:f.error??f.status})]},f.id)),h&&(0,V.jsxs)("div",{className:"log-empty",children:[(0,V.jsx)("span",{className:"codicon codicon-check-all","aria-hidden":"true"}),(0,V.jsx)("strong",{children:i==="console"?"No console messages yet":"No failed requests"}),(0,V.jsx)("span",{children:"They are recorded while the toolbar is open on this page."})]})]}),(0,V.jsxs)("div",{className:"panel-group",children:[(0,V.jsx)("span",{className:"panel-group-title",children:"Copy for AI"}),(0,V.jsxs)("div",{className:"button-row wrap",children:[(0,V.jsx)($e,{size:"sm",icon:"copy",title:"Copy console errors for AI","aria-label":"Copy console errors for AI",onClick:()=>{l().then(f=>t(_y(f.console,location.href),"Console errors","errors"))},children:"Console errors"}),(0,V.jsx)($e,{size:"sm",icon:"copy",title:"Copy failed requests for AI","aria-label":"Copy failed requests for AI",onClick:()=>{l().then(f=>t(Ly(f.network,location.href),"Failed requests","network"))},children:"Failed requests"}),(0,V.jsx)($e,{size:"sm",icon:"copy",title:"Copy page context for AI","aria-label":"Copy page context for AI",onClick:()=>{n().then(f=>t(f,"Page context","page"))},children:"Page context"})]})]})]})}function fx({onClose:e,status:t}){return(0,V.jsxs)(Js,{title:"VS Code link",onClose:e,children:[t.state==="connected"?(0,V.jsxs)("p",{className:"status status-connected",children:["Linked with ",t.peer??"VS Code",t.via==="hub"?" through the browser helper":"",". Captures are saved into your projects and offered to send; bookmarks sync both ways."]}):(0,V.jsx)(cx,{compact:!0,status:t,pair:n=>De({type:"pair",code:n}).then(o=>o.ok?o.status:{...t,error:o.error})}),(0,V.jsx)("div",{className:"button-row",children:(0,V.jsx)($e,{size:"sm",variant:"secondary",onClick:()=>{De({type:"openOptions"})},children:"Settings"})})]})}function px({onClose:e,map:t,overrides:n,linked:o}){let[a,i]=(0,er.useState)(""),r=Object.keys(n).length;return(0,V.jsxs)(Js,{title:"Keyboard shortcuts",onClose:e,children:[(0,V.jsxs)("div",{className:"shortcuts-bar",children:[(0,V.jsx)(dy,{size:"sm",value:a,onChange:i}),(0,V.jsx)(nx,{icon:"discard",confirmLabel:"Click again to reset",title:"Reset all shortcuts (here and in VS Code)",disabled:!r,onConfirm:()=>{Q1()},children:"Reset all"})]}),(0,V.jsxs)("p",{className:"note shortcuts-sync",children:[(0,V.jsx)("span",{className:`codicon codicon-${o?"sync":"cloud"}`,"aria-hidden":"true"}),o?"Shared with VS Code: changes here apply there too, and the other way round.":"Saved to your browser account. They sync with VS Code once it is linked."]}),(0,V.jsx)(ix,{actions:kn,scopes:V1,map:t,overrides:n,query:a,labelOf:q1,scopeLabel:Y1,onSetKeys:(l,c)=>{qp(n,l,c)},onReset:l=>{qp(n,l,void 0)}})]})}function iT(e){let t=e.split(/[?#]/)[0].split("/").pop()||e;try{return decodeURIComponent(t)}catch{return t}}var En=L(je());var Xe=L(q()),rT=[{value:"fit",label:"Fit"},...[.5,.75,1,1.25].map(e=>({value:String(e),label:`${e*100}%`}))],lT=[{value:"custom",label:"Custom size",icon:"screen-full"},...Gi.map(e=>({value:e.id,label:e.name,detail:`${e.width}\xD7${e.height}`,group:e.group,icon:e.group==="Desktops"?"vm":"device-mobile"}))],mx=32,cT=36;function hx({top:e,device:t,onDevice:n,zoom:o,onZoom:a,src:i,frameRef:r,emulationActive:l,onEmulation:c,onClose:s}){let g=(0,En.useRef)(null),h=(0,En.useRef)(null),[f,p]=(0,En.useState)({width:0,height:0});(0,En.useLayoutEffect)(()=>{let v=g.current,E=()=>p({width:v.clientWidth,height:v.clientHeight}),k=new ResizeObserver(E);return k.observe(v),E(),()=>k.disconnect()},[]);let[x,w]=(0,En.useState)(null),T=x??Ry(o,t,{width:f.width-mx*2,height:f.height-mx*2-cT}),m=(0,En.useRef)(null),u=(v,E)=>(0,Xe.jsx)("div",{className:`rv-handle rv-handle-${v}`,role:"separator","aria-label":E,title:E,onPointerDown:k=>{k.preventDefault(),k.currentTarget.setPointerCapture(k.pointerId),m.current={x:k.clientX,y:k.clientY,width:t.width,height:t.height},w(T)},onPointerMove:k=>{let S=m.current;if(!S)return;let M=(A,D)=>Math.round(Math.min(kp,Math.max(wp,A+2*D/T)));n({...t,presetId:void 0,width:v==="y"?t.width:M(S.width,k.clientX-S.x),height:v==="x"?t.height:M(S.height,k.clientY-S.y)})},onPointerUp:()=>{m.current=null,w(null)},onPointerCancel:()=>{m.current=null,w(null)}}),d=(v,E)=>{let k=Math.round(Number(E));!Number.isFinite(k)||k<wp||n({...t,presetId:void 0,[v]:Math.min(kp,k)})},b=Gi.find(v=>v.id===t.presetId);return(0,Xe.jsxs)("div",{className:`rv${x!==null?" dragging":""}`,style:{top:e},children:[(0,Xe.jsxs)("div",{className:"rv-controls",role:"toolbar","aria-label":"Responsive view",children:[(0,Xe.jsx)(Xn,{size:"sm",label:"Device",className:"rv-device",value:b?b.id:"custom",options:lT,onChange:v=>{let E=Gi.find(k=>k.id===v);E?n(_s(E)):(n({...t,presetId:void 0}),requestAnimationFrame(()=>h.current?.focus()))}}),(0,Xe.jsx)(gx,{label:"Width",value:t.width,onCommit:v=>d("width",v),inputRef:h}),(0,Xe.jsx)("span",{className:"rv-times","aria-hidden":"true",children:"\xD7"}),(0,Xe.jsx)(gx,{label:"Height",value:t.height,onCommit:v=>d("height",v)}),(0,Xe.jsx)(Me,{icon:"sync",label:"Rotate",onClick:()=>n(Oy(t))}),(0,Xe.jsx)("span",{className:"rv-divider","aria-hidden":"true"}),(0,Xe.jsx)(Xn,{size:"sm",label:"Zoom",className:"rv-zoom",value:String(o),options:rT,onChange:v=>a(v==="fit"?"fit":Number(v))}),(0,Xe.jsx)(Me,{icon:"settings",label:"Network, CPU, color scheme and user agent",active:l,onClick:c}),(0,Xe.jsx)(Me,{icon:"close",label:"Close the responsive view",onClick:s})]}),(0,Xe.jsx)("div",{className:"rv-area",ref:g,children:(0,Xe.jsxs)("div",{className:"rv-stage",children:[(0,Xe.jsxs)("div",{className:"rv-frame",children:[(0,Xe.jsx)("div",{className:"rv-screen",style:{width:t.width*T,height:t.height*T},children:i&&(0,Xe.jsx)("iframe",{ref:r,title:`${b?.name??"Custom size"} preview`,src:i,sandbox:"allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-top-navigation-by-user-activation",style:{width:t.width,height:t.height,transform:`scale(${T})`}})}),u("x","Drag to change the width"),u("y","Drag to change the height"),u("xy","Drag to change the size")]}),(0,Xe.jsxs)("div",{className:"rv-caption",children:[b?.name??"Custom size"," \xB7 ",t.width," \xD7 ",t.height,T!==1&&` \xB7 ${Math.round(T*100)}%`]})]})})]})}function gx({label:e,value:t,onCommit:n,inputRef:o}){let[a,i]=(0,En.useState)(null),r=(0,En.useRef)(!1),l=()=>{a!==null&&n(a),i(null)};return(0,Xe.jsx)(As,{size:"sm",className:"rv-size",ref:o,"aria-label":e,inputMode:"numeric",value:a??String(t),onChange:c=>i(c.target.value.replace(/\D/g,"")),onFocus:c=>{c.currentTarget.select(),r.current=!0},onMouseUp:c=>{r.current&&c.preventDefault(),r.current=!1},onBlur:l,onKeyDown:c=>{c.key==="Enter"?l():c.key==="Escape"&&i(null)}})}var $p="inkspectDrawings",sT=30,Ip=gy;async function bx(){let t=(await chrome.storage.local.get($p).catch(()=>({})))[$p];return t&&typeof t=="object"?t:{}}var Jp=Promise.resolve(),pn;async function vx(e){return pn?.page===e?pn.shapes:(await Jp,ky((await bx())[e]?.shapes))}function uT(e,t){Jp=Jp.then(async()=>{let n=await bx();t.length?n[e]={shapes:t,at:Date.now()}:delete n[e];let o=Object.entries(n).sort(([,a],[,i])=>i.at-a.at).slice(0,sT);await chrome.storage.local.set({[$p]:Object.fromEntries(o)})}).catch(()=>{})}function Sl(){pn&&(clearTimeout(pn.timer),uT(pn.page,pn.shapes),pn=void 0)}function yx(e,t){pn&&pn.page!==e&&Sl(),pn&&clearTimeout(pn.timer),pn={page:e,shapes:t,timer:setTimeout(Sl,400)}}var Ge=L(je()),Is="toolbarPosition",tr=8,xx=12,dT={k:700,c:40},fT={k:320,c:20},wx=24,pT=()=>matchMedia("(prefers-reduced-motion: reduce)").matches,Fs=e=>({width:e?.offsetWidth??0,height:e?.offsetHeight??0}),Fp=e=>({width:e?.parentElement?.clientWidth||innerWidth,height:e?.parentElement?.clientHeight||innerHeight}),kx=e=>Math.round(e*devicePixelRatio)/devicePixelRatio,El=(e,t)=>{e&&(e.style.transform=`translate(${kx(t.x)}px, ${kx(t.y)}px)`)};function Sx(e,t,n=!1){let o=(0,Ge.useRef)(null),[a,i]=(0,Ge.useState)(null),[r,l]=(0,Ge.useState)(!1),c=(0,Ge.useRef)({x:0,y:0}),s=(0,Ge.useRef)({x:0,y:0}),g=(0,Ge.useRef)({x:0,y:0}),h=(0,Ge.useRef)(null),f=(0,Ge.useRef)(!1),p=(0,Ge.useRef)(0),x=(0,Ge.useRef)(0),w=(0,Ge.useCallback)(S=>{let{width:M,height:A}=Fs(t.current),D=Fp(o.current),H=Math.max(tr,D.width-M-tr),Y=Math.max(tr,D.height-A-tr);return{x:Math.min(H,Math.max(tr,S.x)),y:Math.min(Y,Math.max(tr,S.y))}},[t]),T=(0,Ge.useCallback)(()=>{let{width:S,height:M}=Fs(t.current);i({...c.current,width:S,height:M})},[t]),m=(0,Ge.useCallback)(S=>{let M=Math.min(.032,(S-x.current)/1e3||.016);x.current=S;let{k:A,c:D}=h.current?dT:fT,H=!1;for(let Y of["x","y"]){let ne=g.current[Y]-c.current[Y];s.current[Y]+=(A*ne-D*s.current[Y])*M,c.current[Y]+=s.current[Y]*M,(Math.abs(ne)>.3||Math.abs(s.current[Y])>4)&&(H=!0)}if(!H&&!h.current){c.current={...g.current},s.current={x:0,y:0},El(o.current,c.current),p.current=0,T();return}El(o.current,c.current),p.current=requestAnimationFrame(m)},[T]),u=(0,Ge.useCallback)(S=>{if(g.current=S,pT()){c.current={...S},s.current={x:0,y:0},El(o.current,c.current),h.current||T();return}p.current||(x.current=performance.now(),p.current=requestAnimationFrame(m))},[T,m]),d=S=>{chrome.storage.local.set({[Is]:S}).catch(()=>{})};(0,Ge.useLayoutEffect)(()=>{if(!e)return;if(n){c.current={x:0,y:0},g.current={x:0,y:0},El(o.current,c.current),T();return}let S=!0,M=A=>{if(!S)return;let D=A;f.current=typeof D?.x=="number"&&typeof D.y=="number";let H=D&&f.current?{x:D.x,y:D.y}:{x:(Fp(o.current).width-Fs(t.current).width)/2,y:xx};c.current=w(H),g.current={...c.current},s.current={x:0,y:0},El(o.current,c.current),T()};return M(void 0),chrome.storage.local.get(Is).then(A=>A[Is]&&M(A[Is])).catch(()=>{}),()=>{S=!1,cancelAnimationFrame(p.current),p.current=0,h.current=null}},[e,n,w,T,t]),(0,Ge.useEffect)(()=>{if(!e)return;let S=()=>{if(n)return T();if(h.current)return;let A={x:(Fp(o.current).width-Fs(t.current).width)/2,y:xx};u(w(f.current?g.current:A))},M=new ResizeObserver(S);return t.current&&M.observe(t.current),o.current?.parentElement&&M.observe(o.current.parentElement),addEventListener("resize",S),()=>{M.disconnect(),removeEventListener("resize",S)}},[e,n,w,u,T,t]);let b=S=>{S.button!==0||n||(S.preventDefault(),S.currentTarget.setPointerCapture(S.pointerId),f.current=!0,h.current={id:S.pointerId,x:S.clientX-c.current.x,y:S.clientY-c.current.y},l(!0))},v=S=>{let M=h.current;if(!M||M.id!==S.pointerId)return;let A={x:S.clientX-M.x,y:S.clientY-M.y},D=w(A);u({x:D.x+(A.x-D.x)*.25,y:D.y+(A.y-D.y)*.25})},E=S=>{let M=h.current;if(!M||M.id!==S.pointerId)return;h.current=null,l(!1);let A=w(g.current);u(A),d(A)};return{ref:o,rest:a,dragging:r,handle:{onPointerDown:b,onPointerMove:v,onPointerUp:E,onPointerCancel:E,onKeyDown:S=>{if(n)return;let M=S.shiftKey?wx*4:wx,D={ArrowLeft:{x:-M,y:0},ArrowRight:{x:M,y:0},ArrowUp:{x:0,y:-M},ArrowDown:{x:0,y:M}}[S.key];if(!D)return;S.preventDefault(),S.stopPropagation(),f.current=!0;let H=w({x:g.current.x+D.x,y:g.current.y+D.y});u(H),d(H)}}}}var zt=L(je());var mT=e=>e.replace(/^data:image\/\w+;base64,/,"");function Ex(e,t){return{path:t,name:e?.name??t.split("/").pop()??t}}function Tx(e){let[t,n]=(0,zt.useState)(null),o=(0,zt.useRef)(null),a=(0,zt.useRef)(0),i=(0,zt.useCallback)(x=>{o.current=x,n(x)},[]),r=(0,zt.useCallback)(x=>{o.current&&i({...o.current,...x})},[i]),l=(0,zt.useCallback)(async(x,w,T)=>{if(!x.length)return;let m=x.flatMap(v=>v.image?[v.image]:[]),u={title:w,detail:T,taken:x,images:m,projects:[],targets:[],harnesses:[]},d=++a.current,b=()=>a.current!==d||!o.current;if(e.projects){i({...u,status:{tone:"busy",text:"Saving\u2026"}});let v=await De({type:"projects",url:location.href}),E=v.ok?v.projects??[]:[],k=v.ok?v.suggested??E[0]?.path:void 0;if(!k){if(b())return;i({...u,projects:E,status:{tone:"error",text:v.ok?"Not saved: no project. Open one in VS Code, or start an agent in agentmux.":v.error}});return}let S=await Promise.all(x.map(D=>D.image?$1(D.image):void 0)),M=await De({type:"saveCapture",project:k,url:location.href,captures:x.map((D,H)=>({kind:D.kind,title:D.title,text:D.text,group:D.group,groupIndex:D.groupIndex,image:D.image?mT(D.image):void 0,thumb:S[H]}))});if(b())return;let A=E.find(D=>D.path===k);i({...u,project:Ex(A,k),ids:M.ok?M.ids:void 0,projects:E,targets:A?.targets??[],defaultTarget:A?.defaultTarget,harnesses:A?.harnesses??[],status:M.ok?void 0:{tone:"error",text:M.error}});return}i({...u,empty:"Not linked: install the browser helper or link VS Code to send it to an agent."})},[e.projects,i]),c=(0,zt.useCallback)(async(x,w,T)=>{let m=o.current;if(!m)return;let u=a.current;r({status:{tone:"busy",text:"Sending\u2026"}});let d=m.ids&&m.project?await De({type:"sendSaved",project:m.project.path,ids:m.ids,target:x,open:w,prompt:T}):{ok:!1,error:"Not saved, so nothing can be sent."};if(a.current!==u||!o.current)return;if(!d.ok){r({status:{tone:"error",text:d.error}});return}let b=m.targets.find(v=>v.id===x);r({status:{tone:"ok",text:O1(b,d.sentTo??"the agent")}}),setTimeout(()=>{a.current===u&&o.current?.status?.tone==="ok"&&i(null)},900)},[i,r]),s=(0,zt.useCallback)(async x=>{let w=o.current;if(!w?.ids||!w.project||x===w.project.path)return;let T=a.current,m=await De({type:"moveSaved",project:w.project.path,to:x,ids:w.ids});if(a.current!==T)return;if(!m.ok){r({status:{tone:"error",text:m.error}});return}let u=await De({type:"projects",url:location.href});if(a.current!==T)return;let d=u.ok?u.projects??w.projects:w.projects,b=d.find(v=>v.path===x);r({project:Ex(b,x),projects:d,targets:b?.targets??[],defaultTarget:b?.defaultTarget,harnesses:b?.harnesses??[],status:void 0})},[r]),g=(0,zt.useCallback)(async x=>{let w=o.current;if(!w?.project)return;let T=a.current,m=bl[x];r({status:{tone:"busy",text:`Starting a new ${m} thread in agentmux\u2026`}});let u=await De({type:"startThread",project:w.project.path,harness:x});if(a.current!==T||!o.current)return;if(!u.ok){r({status:{tone:"error",text:u.error}});return}let d=await De({type:"projects",url:location.href});if(a.current!==T||!o.current)return;let b=d.ok?d.projects??w.projects:w.projects,v=b.find(E=>E.path===w.project?.path);r({projects:b,targets:v?.targets??w.targets,defaultTarget:u.target??v?.defaultTarget,harnesses:v?.harnesses??w.harnesses,status:{tone:"ok",text:`${m} started in agentmux. Enter sends to it.`}})},[r]),h=(0,zt.useCallback)(async()=>{let x=o.current;if(!x)return;let w=x.images[0]?await $s(x.images[0]):await kl(x.taken.map(T=>T.text??"").join(`

`));r({status:w?{tone:"ok",text:"Copied"}:{tone:"error",text:"Could not copy"}})},[r]),f=(0,zt.useCallback)(()=>{let x=o.current;if(x){if(x.images.length)for(let w of x.images)De({type:"download",dataUrl:w,filename:`Inkspect/${Pp()}`});else{let w=x.taken.map(m=>m.text??"").join(`

`),T=`data:text/markdown;base64,${btoa(unescape(encodeURIComponent(w)))}`;De({type:"download",dataUrl:T,filename:`Inkspect/${Pp().replace(/\.png$/,".md")}`})}r({status:{tone:"ok",text:"Downloading"}})}},[r]),p=(0,zt.useCallback)(()=>{a.current++,i(null)},[i]);return{offer:t,capture:l,sendTo:c,moveTo:s,newThread:g,copyAgain:h,download:f,close:p}}var G=L(q()),gT=new Set(j1.map(e=>e.id)),Ws=" (not available in the responsive view yet)",hT=/\b(failed|could not|can't|cannot|did not|didn't|nothing was|not linked|not running)\b/i,bT={highlighter:{...Ra,color:"#ffd60a",width:16,opacity:.4},marker:{...Ra,width:8},pencil:{...Ra,width:2}},vT={area:"Drawing screenshot",groups:"Drawing screenshot",clean:"Drawing area",viewport:"Annotated viewport",fullPage:"Annotated full page",region:"Annotated area"};function Nx({host:e,hideHost:t,toggleSignal:n}){let[o,a]=(0,B.useState)(!1),[i,r]=(0,B.useState)(null),[l,c]=(0,B.useState)(null),[s,g]=(0,B.useState)(null),[h,f]=(0,B.useState)(null),[p,x]=(0,B.useState)([]),[w,T]=(0,B.useState)({state:"offline"}),[m,u]=(0,B.useState)(!1),[d,b]=(0,B.useState)(()=>({map:Ts({},vl),overrides:{}})),[v,E]=(0,B.useState)(null),[k,S]=(0,B.useState)(!1),M=(0,B.useRef)(null),A=(0,B.useRef)(null),[D,H]=(0,B.useState)(null),[Y,ne]=(0,B.useState)("fit"),[z,F]=(0,B.useState)(null),[O,oe]=(0,B.useState)(sx),ee=(0,B.useRef)(null),se=(0,B.useRef)(null),[Be,_e]=(0,B.useState)([]),[Ve,_]=(0,B.useState)([]),[j,K]=(0,B.useState)([]),[de,ce]=(0,B.useState)("pen"),[Ue,Et]=(0,B.useState)(bT),[eu,qt]=(0,B.useState)([]),[Gn,Wp]=(0,B.useState)(!0),[nr,Dx]=(0,B.useState)({x:scrollX,y:scrollY}),[na,_x]=(0,B.useState)({width:innerWidth,height:innerHeight}),Qn=(0,B.useRef)(Be),[qa,Hx]=(0,B.useState)(null),[Lx,em]=(0,B.useState)(!1),[Ya,Bx]=(0,B.useState)(()=>Ip(location.href)),[Tl,Ux]=(0,B.useState)(Ya),[tm,jx]=(0,B.useState)(null);Tl!==Ya&&(Ux(Ya),_e([]),_([]),K([]));let[,qx]=(0,B.useState)(0),nm=(0,B.useRef)(null);(0,B.useEffect)(()=>{Qn.current=Be},[Be]),(0,B.useEffect)(()=>{let y=!1;return vx(Ya).then(C=>{y||(_e(R=>[...C,...R]),jx(Ya))}),()=>{y=!0}},[Ya]),(0,B.useEffect)(()=>{tm===Tl&&yx(Tl,Be)},[Be,Tl,tm]),(0,B.useEffect)(()=>{let y=()=>Bx(Ip(location.href)),C=setInterval(y,500);window.addEventListener("popstate",y),window.addEventListener("hashchange",y),window.addEventListener("pagehide",Sl);let R=0,U=ze=>{ze.target===document||!Qn.current.some(Ot=>Ot.anchor)||(cancelAnimationFrame(R),R=requestAnimationFrame(()=>qx(Ot=>Ot+1)))};return document.addEventListener("scroll",U,{capture:!0,passive:!0}),()=>{clearInterval(C),cancelAnimationFrame(R),window.removeEventListener("popstate",y),window.removeEventListener("hashchange",y),window.removeEventListener("pagehide",Sl),document.removeEventListener("scroll",U,{capture:!0})}},[]);let om=(0,B.useRef)(0);(0,B.useEffect)(()=>{n!==om.current&&(om.current=n,a(y=>(y&&(r(null),c(null),g(null),H(null),F(null)),!y)))},[n]),(0,B.useEffect)(()=>{De({type:"toolbarOpen",open:o})},[o]);let{ref:Yx,rest:mn,dragging:am,handle:Vx}=Sx(o,M,D!==null),Ae=D!==null;(0,B.useEffect)(()=>{if(!Ae)return;let y=document.documentElement,C=y.style.getPropertyValue("overflow"),R=y.style.getPropertyPriority("overflow");return y.style.setProperty("overflow","hidden","important"),()=>{C?y.style.setProperty("overflow",C,R):y.style.removeProperty("overflow")}},[Ae]),(0,B.useEffect)(()=>G1((y,C)=>b({map:y,overrides:C.overrides})),[]),(0,B.useEffect)(()=>{if(!o)return;let y="",C=(ze=!1)=>{!ze&&location.href===y||(y=location.href,De({type:"isBookmarked",url:y}).then(Ot=>Ot.ok&&S(!!Ot.bookmarked)))};C(!0);let R=setInterval(()=>C(),1e3),U=()=>C(!0);return addEventListener("focus",U),()=>{clearInterval(R),removeEventListener("focus",U)}},[o]);let oa=(0,B.useCallback)(y=>{let C=d.map[y]?.[0];return C?Ft(C,vl):void 0},[d.map]),aa=(y,C)=>{let R=oa(C);return R?`${y} (${R})`:y};(0,B.useEffect)(()=>{Zp().then(U=>se.current=U),De({type:"bridgeStatus"}).then(U=>U.ok&&U.status&&T(U.status));let y=U=>{U.type==="bridgeStatus"&&U.status&&T(U.status)};chrome.runtime.onMessage.addListener(y);let C=()=>Dx({x:scrollX,y:scrollY}),R=()=>_x({width:innerWidth,height:innerHeight});return window.addEventListener("scroll",C,{passive:!0}),window.addEventListener("resize",R),()=>{chrome.runtime.onMessage.removeListener(y),window.removeEventListener("scroll",C),window.removeEventListener("resize",R)}},[]);let Je=(0,B.useCallback)((y,C={})=>{let R=C.tone??(hT.test(y)?"error":"info");f({id:Date.now(),message:y,...C,tone:R})},[]),im=D?.userAgent,rm=D?.touch??!1;(0,B.useEffect)(()=>{let y=Ae&&(O.agent||O.touch)?{userAgent:O.agent?im:void 0,touch:O.touch&&rm}:void 0,C=Ae?{agent:y,network:O.network,cpu:O.cpu,colorScheme:O.colorScheme,print:O.print}:{network:"none",cpu:1,colorScheme:"default",print:!1};De({type:"emulate",request:C}).then(R=>{R.ok||Je(R.error)})},[Ae,im,rm,O,Je]);let lm=(0,B.useCallback)(async()=>{r(null),c(R=>R==="console"?null:R),H(R=>R??_s(Gi[0]));let y=location.href,C=await De({type:"allowFraming",url:y});C.ok||Je(`The page may not load in the frame: ${C.error}`),F(y)},[Je]),Cl=(0,B.useCallback)(()=>{H(null),F(null),c(y=>y==="emulation"?null:y),De({type:"endFraming"})},[]);(0,B.useEffect)(()=>{if(!h||h.held)return;let y=setTimeout(()=>f(C=>C?.id===h.id?null:C),h.tone==="error"?8e3:3500);return()=>clearTimeout(y)},[h]);let Nl=(0,B.useCallback)(()=>{let y=t();return u(!0),()=>{y(),u(!1)}},[t]),or=(0,B.useCallback)(async y=>{let C=await Yp(y,Nl),R=Gn?Qn.current:[];if(!R.length)return C.dataUrl;let U=new Uint8Array(await(await fetch(C.dataUrl)).arrayBuffer());return`data:image/png;base64,${await Ap(U,"image/png",C.area,R,Xs(R))}`},[Gn,Nl]),Ml=w.state==="connected",{offer:ct,capture:Va,sendTo:Kx,moveTo:Xx,newThread:Gx,copyAgain:Qx,download:Zx,close:Px}=Tx(w),cm=(0,B.useCallback)(async(y,C,R="text")=>{let U=await kl(y);await Va([{kind:R,title:C,text:y}],C,U?"Copied to the clipboard.":void 0)},[Va]),Zn=(0,B.useCallback)(async(y,C)=>{let R=typeof y=="string"?[y]:y;if(!R.length)return;let U=R.length>1,ze=await $s(R[0]),Ot=U?crypto.randomUUID():void 0;await Va(R.map((Tn,gn)=>({kind:"screenshot",title:U?`${C} ${gn+1} of ${R.length}`:C,image:Tn,group:Ot,groupIndex:U?gn:void 0})),U?`${R.length} ${C.toLowerCase()}`:C,ze?U?"The first is copied to the clipboard.":"Copied to the clipboard.":void 0)},[Va]),bo=(0,B.useCallback)(async y=>{if(y==="region")return r({kind:"region"});if(y==="element")return r({kind:"inspect",purpose:"screenshot"});try{let C=y==="viewport"?Vp():Kp();await Zn(await or(C),y==="viewport"?"Screenshot":"Full-page screenshot")}catch(C){Je(`Screenshot failed: ${C instanceof Error?C.message:String(C)}`)}},[Zn,or,Je]),sm=(0,B.useCallback)(async y=>{let C=se.current?.maxHtml??2e3;y.setAttribute(jp,"");try{let R=await ja({kind:"collect",maxHtml:C},1500);if(R&&!R.error&&R.tag)return R}finally{y.removeAttribute(jp)}return{...Ty(y,C,Cy),...Ds(y)}},[]),tu=(0,B.useCallback)(async y=>{let C=y.getBoundingClientRect();return or({x:C.x+scrollX,y:C.y+scrollY,width:C.width,height:C.height})},[or]),$x=async y=>{let C=p;if(x([]),y!=="clear"){if(y==="copy")return Al(C);try{let R=[];for(let U of C)R.push(await tu(U));await Zn(R,C.length===1?"Element screenshot":"Element screenshots")}catch(R){Je(`Screenshot failed: ${R instanceof Error?R.message:String(R)}`)}}},Al=(0,B.useCallback)(async y=>{let C=se.current??await Zp(),R=await Promise.all(y.map(sm)),U=R.length===1,ze=await kl(yp(R,C.copyFormat,C.fields)),Ot=U?void 0:crypto.randomUUID();await Va(R.map((Tn,gn)=>({kind:"element",title:`Element ${pl(Tn)}`,text:yp([Tn],"markdown",C.fields),group:Ot,groupIndex:U?void 0:gn})),U?`Element ${pl(R[0])}`:`${R.length} elements`,ze?"Its details are copied to the clipboard.":void 0)},[sm,Va]),Jx=(0,B.useCallback)(async(y,C)=>{let R=i?.kind==="inspect"&&i.purpose==="screenshot";if(R&&r(null),C.add&&!R){x(U=>U.includes(y)?U.filter(ze=>ze!==y):[...U,y]);return}if(R||C.screenshot){try{await Zn(await tu(y),"Element screenshot")}catch(U){Je(`Screenshot failed: ${U instanceof Error?U.message:String(U)}`)}return}await Al([y])},[tu,Al,Zn,Je,i]),um=(0,B.useCallback)(async()=>{let y=await ja({kind:"logs"});return By({url:location.href,title:document.title,viewport:{width:innerWidth,height:innerHeight},selection:getSelection()?.toString()||void 0,console:y?.console??[],network:y?.network??[]})},[]),nu=(0,B.useCallback)((y,C)=>{C&&(_(R=>[...R.slice(-99),Qn.current]),K([])),_e(y)},[]),dm=(0,B.useCallback)(()=>{_(y=>{let C=y.at(-1);return C?(K(R=>[...R,Qn.current]),_e(C),y.slice(0,-1)):y})},[]),fm=(0,B.useCallback)(()=>{K(y=>{let C=y.at(-1);return C?(_(R=>[...R,Qn.current]),_e(C),y.slice(0,-1)):y})},[]),Pn=(0,B.useCallback)(async(y,C)=>{if(y==="region"&&!C)return r({kind:"region",drawing:!0});let R=Xs(Qn.current),U=Os(Qn.current,R);if(!U.length&&(y==="area"||y==="groups"||y==="clean")){Je("Draw something first.");return}let ze=se.current?.annotationPadding??40,Ot=new Map(Qn.current.map(ir=>[ir.id,ir])),Tn=y==="groups"?yy(U,80):[U],gn=[];for(let ir of Tn){let wm=y==="viewport"?Vp():y==="fullPage"?Kp():y==="region"?C:vy(ir,ze);if(wm)try{let Ka=await Yp(wm,Nl),aw=new Uint8Array(await(await fetch(Ka.dataUrl)).arrayBuffer()),iw=await Ap(aw,"image/png",Ka.area,y==="clean"?[]:ir.map(rw=>Ot.get(rw.id)),R);gn.push(`data:image/png;base64,${iw}`)}catch(Ka){Je(`Screenshot failed: ${Ka instanceof Error?Ka.message:String(Ka)}`);return}}await Zn(gn,gn.length>1?"Drawings":vT[y])},[Zn,Nl,Je]),pm=Be.some(y=>y.kind==="blur")||i?.kind==="draw"&&de==="blur",ou=qa&&qa.x===nr.x&&qa.y===nr.y&&qa.width===na.width&&qa.height===na.height?qa.canvas:void 0;(0,B.useEffect)(()=>{if(!o||!pm||ou)return;let y=!1,C=setTimeout(()=>{let R={x:scrollX,y:scrollY,width:innerWidth,height:innerHeight};yl(()=>(em(!0),()=>em(!1))).then(U=>{if(y)return;let ze=document.createElement("canvas");ze.width=Math.round(R.width*devicePixelRatio),ze.height=Math.round(R.height*devicePixelRatio),ze.getContext("2d").drawImage(U,0,0,ze.width,ze.height),Hx({canvas:ze,...R})}).catch(()=>{})},250);return()=>{y=!0,clearTimeout(C)}},[o,pm,ou,nr.x,nr.y,na.width,na.height]);let mm=i?.kind==="draw";(0,B.useEffect)(()=>{let y=nm.current;if(!mm||!y)return;let C=R=>{R.ctrlKey||(R.preventDefault(),F1(R,e))};return y.addEventListener("wheel",C,{passive:!1}),()=>y.removeEventListener("wheel",C)},[mm,e]);let zl=y=>r(C=>C?.kind===y.kind?null:y),Ix=(y,C,R)=>{let U=y.currentTarget.getBoundingClientRect();g({x:U.left,y:U.bottom+4,items:C}),E(R??null)},gm=(y,C,R)=>{let U=M.current?.querySelector(y);if(!U)return;let ze=U.getBoundingClientRect();g({x:ze.left,y:ze.bottom+4,items:C}),E(R)},au=()=>{g(null),E(null)},ar=y=>{let C=Ue[de]??Ra;Et(R=>({...R,[de]:{...C,...y}})),y.color&&qt(R=>[y.color,...R.filter(U=>U!==y.color)].slice(0,6))},Fx=()=>{De({type:"openSaved"}).then(y=>{y.ok||Je(y.error,{tone:"error"})})},hm=()=>{De(k?{type:"unbookmarkPage",url:location.href}:{type:"bookmarkPage",url:location.href,title:document.title}).then(y=>{if(!y.ok)return Je(y.error,{tone:"error"});S(!!y.bookmarked),Je(y.bookmarked?"Bookmarked":"Bookmark removed",y.bookmarked?{tone:"success",detail:Ml?"It syncs to VS Code.":void 0}:{})})},bm=()=>[{label:"Visible area",icon:"device-camera",shortcut:oa("shot.viewport"),onSelect:()=>{bo("viewport")}},{label:"Full page",icon:"file-media",shortcut:oa("shot.fullPage"),onSelect:()=>{bo("fullPage")}},{label:"Select region...",icon:"screen-full",shortcut:oa("shot.region"),onSelect:()=>{bo("region")}},{label:"Select element...",icon:"inspect",shortcut:oa("shot.element"),onSelect:()=>{bo("element")}}],vm=()=>b1(y=>{Pn(y)},oa),ym=(0,B.useRef)({});if((0,B.useEffect)(()=>{let y=Object.fromEntries(g1.map(U=>[`draw.${U}`,()=>ce(U)])),C=Object.fromEntries(Ki.slice(0,9).map((U,ze)=>[`draw.color${ze+1}`,()=>ar({color:U})])),R=Ue[de]?.width??Ra.width;ym.current={"mode.inspect":()=>!Ae&&zl({kind:"inspect",purpose:"copy"}),"mode.draw":()=>!Ae&&zl({kind:"draw"}),"mode.screenshot":()=>Ae?void 0:gm(".shot-button",bm(),"screenshot"),"mode.device":()=>Ae?Cl():void lm(),"mode.devtools":()=>!Ae&&c(U=>U==="console"?null:"console"),"page.bookmark":hm,"open.shortcuts":()=>c(U=>U==="shortcuts"?null:"shortcuts"),...y,...C,"draw.thinner":()=>ar({width:Math.max(1,R-(R>6?2:1))}),"draw.thicker":()=>ar({width:Math.min(24,R+(R>=6?2:1))}),"draw.fill":()=>ar({fill:!(Ue[de]?.fill??!1)}),"draw.undo":dm,"draw.redo":fm,"draw.clear":()=>nu([],!0),"draw.visible":()=>Wp(U=>!U),"draw.capture":()=>{Pn("area")},"draw.captureGroups":()=>{Pn("groups")},"draw.captureClean":()=>{Pn("clean")},"draw.captureViewport":()=>{Pn("viewport")},"draw.captureFullPage":()=>{Pn("fullPage")},"draw.captureRegion":()=>{Pn("region")},"draw.captureMenu":()=>gm(".draw-capture",vm(),"draw"),"draw.exit":()=>r(null),"shot.viewport":()=>{bo("viewport")},"shot.fullPage":()=>{bo("fullPage")},"shot.region":()=>{bo("region")},"shot.element":()=>{bo("element")},"shot.drawing":()=>{Pn("area")}}}),(0,B.useEffect)(()=>{if(l)return ws(()=>[A.current],xs(),()=>c(null),y=>!M.current||!y.composedPath().includes(M.current)||P0(y))},[l]),(0,B.useEffect)(()=>{if(!o)return;let y=C=>{if(l==="shortcuts"||ct)return;let R=M.current?.getRootNode(),U=C.composedPath().includes(e)&&R instanceof ShadowRoot?R.activeElement:C.composedPath()[0];if(U instanceof HTMLElement&&(U.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(U.tagName))||i?.kind==="inspect"||i?.kind==="region")return;if(C.key==="Escape"&&(s||l&&i?.kind!=="draw")){s?au():c(null),C.preventDefault(),C.stopImmediatePropagation();return}let Ot=s?v?[v]:[]:i?.kind==="draw"?["draw","global"]:["global"],Tn=dl(d.map,Ot,fo(C)),gn=Tn&&gT.has(Tn.id)&&ym.current[Tn.id];gn&&(C.preventDefault(),C.stopImmediatePropagation(),s&&au(),gn())};return window.addEventListener("keydown",y,!0),()=>window.removeEventListener("keydown",y,!0)},[o,i,l,s,v,d.map,e,ct]),!o)return null;let Wx=!!mn&&mn.x+mn.width/2>na.width/2,ew=!!mn&&mn.y+mn.height/2>na.height/2,tw=mn?Ae?mn.height:mn.y<64?mn.y+mn.height+8:0:0,nw={scale:1,scroll:nr,bounds:{left:0,top:0,...na}},ow=Xs(Be),xm=Ue[de]??Ra;return(0,G.jsxs)("div",{className:`inkspect${m?" capturing":""}${Lx?" sampling":""}`,children:[(Be.length>0||i?.kind==="draw")&&(0,G.jsx)("div",{className:"draw-host",ref:nm,children:(0,G.jsx)(o1,{mapper:nw,shapes:Be,visible:Gn,interactive:i?.kind==="draw",tool:de,style:xm,onChange:nu,liveRedactions:!0,pixelSource:ou,anchors:ow,anchorAt:y=>I1(y[0]-scrollX,y[1]-scrollY,e)})}),i?.kind==="inspect"&&!ct&&(0,G.jsx)(tx,{host:e,map:d.map,purpose:i.purpose,selection:p,onPick:(y,C)=>{Jx(y,C)},onCommit:y=>{let C=p.length?p:y?[y]:[];C.length&&Al(C),x([])},onExit:()=>{r(null),x([])},actionOf:y=>dl(d.map,["inspect"],fo(y))?.id}),i?.kind==="inspect"&&!ct&&p.length>0&&(0,G.jsx)(x1,{className:"toolbar-selection-bar",count:p.length,map:d.map,onAction:y=>{$x(y)}}),i?.kind==="region"&&i.drawing&&(0,G.jsx)(Cx,{onCancel:()=>r({kind:"draw"}),onDone:y=>{r({kind:"draw"}),Pn("region",{...y,x:y.x+scrollX,y:y.y+scrollY})}}),i?.kind==="region"&&!i.drawing&&(0,G.jsx)(Cx,{onCancel:()=>r(null),onDone:y=>{r(null),or({...y,x:y.x+scrollX,y:y.y+scrollY}).then(C=>Zn(C,"Region screenshot")).catch(C=>Je(`Screenshot failed: ${String(C)}`))}}),D&&(0,G.jsx)(hx,{top:tw,device:D,onDevice:H,zoom:Y,onZoom:ne,src:z,frameRef:ee,emulationActive:l==="emulation",onEmulation:()=>c(y=>y==="emulation"?null:"emulation"),onClose:Cl}),(0,G.jsxs)("div",{ref:Yx,className:["float",Ae&&"docked",Wx&&"align-right",ew&&"above",am&&"dragging"].filter(Boolean).join(" "),children:[(0,G.jsxs)("div",{className:"bar",ref:M,role:"toolbar","aria-label":"Inkspect",children:[(0,G.jsxs)("div",{className:"bar-row",children:[(0,G.jsxs)("span",{className:"bar-brand",children:[(0,G.jsx)("img",{src:chrome.runtime.getURL("icons/32.png"),alt:""}),"Inkspect"]}),(0,G.jsx)("span",{className:"separator"}),(0,G.jsx)(Me,{icon:"inspect",label:`${aa("Select an element to copy its details for AI","mode.inspect")}${Ae?Ws:""}`,disabled:Ae,active:i?.kind==="inspect",onClick:()=>zl({kind:"inspect",purpose:"copy"})}),(0,G.jsx)(Me,{icon:"edit",label:`${aa("Draw on the page","mode.draw")}${Ae?Ws:""}`,disabled:Ae,active:i?.kind==="draw",onClick:()=>zl({kind:"draw"})}),(0,G.jsx)(Me,{icon:"device-camera",label:aa("Screenshot","mode.screenshot"),className:"shot-button",onClick:y=>Ix(y,Ae?[{label:"Device screen",icon:"device-mobile",onSelect:()=>{let C=ee.current?.parentElement;C&&P1(C).then(R=>Zn(R,"Device screenshot")).catch(R=>Je(`Screenshot failed: ${String(R)}`))}}]:bm(),Ae?void 0:"screenshot")}),(0,G.jsx)(Me,{icon:"device-mobile",label:aa("Responsive view","mode.device"),active:Ae,onClick:()=>Ae?Cl():void lm()}),(0,G.jsx)(Me,{icon:"debug-console",label:`${aa("Console and network (copy errors for AI)","mode.devtools")}${Ae?Ws:""}`,disabled:Ae,active:l==="console",onClick:()=>c(y=>y==="console"?null:"console")}),(0,G.jsx)(Me,{icon:"copy",label:`Copy page context for AI${Ae?Ws:""}`,disabled:Ae,onClick:()=>{um().then(y=>cm(y,"Page context","page"))}}),(0,G.jsx)(Me,{icon:k?"star-full":"star-empty",label:aa(k?"Remove bookmark":"Bookmark this page","page.bookmark"),className:k?"bookmarked":void 0,onClick:hm}),(0,G.jsx)("span",{className:"separator"}),(0,G.jsx)($e,{size:"sm",variant:"ghost",icon:"layout-sidebar-right",className:"saved-button",title:"Saved captures of this page's project, in the side panel",onClick:Fx,children:"Saved"}),(0,G.jsx)("span",{className:"separator"}),(0,G.jsx)(Me,{icon:"keyboard",label:aa("Keyboard shortcuts (shared with VS Code)","open.shortcuts"),active:l==="shortcuts",onClick:()=>c(y=>y==="shortcuts"?null:"shortcuts")}),(0,G.jsx)(Me,{icon:Ml?"plug":"debug-disconnect",label:Ml?`Linked with ${w.peer??"VS Code"}`:"Link with VS Code",active:l==="link",className:`link-${w.state}`,onClick:()=>c(y=>y==="link"?null:"link")}),(0,G.jsx)(Me,{icon:"close",label:"Close toolbar",onClick:()=>{Cl(),r(null),c(null),a(!1)}}),!Ae&&(0,G.jsx)(v1,{label:"Move the toolbar (drag, or use the arrow keys)",dragging:am,...Vx})]}),i?.kind==="draw"&&(0,G.jsx)(h1,{tool:de,style:xm,recentColors:eu,canUndo:Ve.length>0,canRedo:j.length>0,hasShapes:Be.length>0,visible:Gn,onTool:ce,onStyle:ar,keyOf:oa,onUndo:dm,onRedo:fm,onClear:()=>nu([],!0),onToggleVisible:()=>Wp(y=>!y),onCapture:(y,C)=>{g({x:y,y:C,items:vm()}),E("draw")},onClose:()=>r(null)})]}),l&&(0,G.jsxs)("div",{className:"panel-dock",ref:A,children:[l==="emulation"&&(0,G.jsx)(ux,{onClose:()=>c(null),value:O,onChange:oe}),l==="console"&&(0,G.jsx)(dx,{onClose:()=>c(null),toast:Je,copy:(y,C,R)=>{cm(y,C,R)},pageContext:um}),l==="shortcuts"&&(0,G.jsx)(px,{onClose:()=>c(null),map:d.map,overrides:d.overrides,linked:Ml}),l==="link"&&(0,G.jsx)(fx,{onClose:()=>c(null),toast:Je,status:w})]})]}),s&&(0,G.jsx)(Bs,{menu:s,onClose:au}),h&&(0,G.jsx)("div",{className:`toast tone-${h.tone??"info"}`,role:h.tone==="error"?"alert":"status",onPointerEnter:()=>f(y=>y?.id===h.id?{...y,held:!0}:y),onPointerLeave:()=>f(y=>y?.id===h.id?{...y,held:!1}:y),children:(0,G.jsxs)("div",{className:"toast-top",children:[h.tone!=="info"&&(0,G.jsx)("span",{className:`toast-icon codicon codicon-${h.tone==="error"?"error":"pass-filled"}`,"aria-hidden":"true"}),(0,G.jsxs)("div",{className:"toast-body",children:[(0,G.jsx)("div",{className:"toast-title",children:h.message}),h.detail&&(0,G.jsx)("div",{className:"toast-detail",children:h.detail})]}),(0,G.jsx)(Me,{icon:"close",label:"Dismiss",className:"toast-close",onClick:()=>f(null)})]})},h.id),ct&&(0,G.jsx)(L1,{title:ct.title,detail:ct.detail,images:ct.images,project:ct.project,projects:ct.projects.map(y=>({path:y.path,name:y.name,detail:M1(y)})),onProject:ct.ids&&w.features?.includes("items.move")?y=>{Xx(y)}:void 0,targets:ct.targets,defaultTarget:ct.defaultTarget,harnesses:ct.harnesses,onNewThread:ct.project&&w.features?.includes("agentmux.start")?y=>{Gx(y)}:void 0,emptyText:ct.empty,onSend:(y,{open:C,prompt:R})=>{Kx(y,C,R)},canPrompt:!!w.features?.includes("send.prompt"),onCopy:()=>{Qx()},onDownload:Zx,onClose:Px,status:ct.status,map:d.map})]})}function Cx({onDone:e,onCancel:t}){let[n,o]=(0,B.useState)(null),a=(0,B.useRef)(null);return(0,B.useEffect)(()=>{let i=r=>{r.key==="Escape"&&t()};return window.addEventListener("keydown",i,!0),()=>window.removeEventListener("keydown",i,!0)},[t]),(0,G.jsxs)("div",{className:"region",onPointerDown:i=>{i.currentTarget.setPointerCapture(i.pointerId),a.current={x:i.clientX,y:i.clientY},o({x:i.clientX,y:i.clientY,width:0,height:0})},onPointerMove:i=>{let r=a.current;r&&o({x:Math.min(r.x,i.clientX),y:Math.min(r.y,i.clientY),width:Math.abs(i.clientX-r.x),height:Math.abs(i.clientY-r.y)})},onPointerUp:()=>{a.current=null,n&&n.width>4&&n.height>4&&e(n)},children:[(0,G.jsx)("div",{className:"inspect-hint",children:"Drag to select a region \xB7 Esc to cancel"}),n&&(0,G.jsx)("div",{className:"region-box",style:{left:n.x,top:n.y,width:n.width,height:n.height},children:(0,G.jsxs)("span",{className:"region-size",children:[Math.round(n.width)," \xD7 ",Math.round(n.height)]})})]})}var Mx=`/* PairCard: linking this browser (one click in VS Code; the code is the fallback), on the full
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
`;var Ax=`/* The Inkspect toolbar. The shared components use VS Code theme variables, defined here in a
   dark and a light variant that follow the system theme. */

:host,
.inkspect {
  --vscode-font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --vscode-font-size: 13px;
  --vscode-editor-font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  --vscode-foreground: #cccccc;
  --vscode-descriptionForeground: #9d9d9d;
  --vscode-editor-background: #1f1f1f;
  --vscode-editorWidget-background: #202020;
  --vscode-widget-border: #3c3c3c;
  --vscode-widget-shadow: rgba(0, 0, 0, 0.45);
  --vscode-focusBorder: #0078d4;
  --vscode-button-background: #0078d4;
  --vscode-button-foreground: #ffffff;
  --vscode-button-hoverBackground: #026ec1;
  --vscode-button-secondaryBackground: #313131;
  --vscode-button-secondaryForeground: #cccccc;
  --vscode-button-secondaryHoverBackground: #3c3c3c;
  --vscode-toolbar-hoverBackground: rgba(90, 93, 94, 0.31);
  --vscode-toolbar-activeBackground: rgba(99, 102, 103, 0.31);
  --vscode-inputOption-activeBackground: rgba(36, 137, 219, 0.51);
  --vscode-inputOption-activeBorder: #2488db;
  --vscode-input-background: #313131;
  --vscode-input-foreground: #cccccc;
  --vscode-input-border: #3c3c3c;
  --vscode-menu-background: #1f1f1f;
  --vscode-menu-foreground: #cccccc;
  --vscode-menu-selectionBackground: #0078d4;
  --vscode-menu-selectionForeground: #ffffff;
  --vscode-menu-separatorBackground: #454545;
  --vscode-menu-border: #454545;
  --vscode-notifications-background: #1f1f1f;
  --vscode-notifications-foreground: #cccccc;
  --vscode-errorForeground: #f85149;
  --vscode-testing-iconPassed: #73c991;
  --vscode-badge-background: #616161;
  --vscode-badge-foreground: #f8f8f8;
  color-scheme: dark;
}

@media (prefers-color-scheme: light) {
  :host,
  .inkspect {
    --vscode-foreground: #3b3b3b;
    --vscode-descriptionForeground: #6f6f6f;
    --vscode-editor-background: #ffffff;
    --vscode-editorWidget-background: #f8f8f8;
    --vscode-widget-border: #d4d4d4;
    --vscode-widget-shadow: rgba(0, 0, 0, 0.16);
    --vscode-focusBorder: #005fb8;
    --vscode-button-background: #005fb8;
    --vscode-button-hoverBackground: #0258a8;
    --vscode-button-secondaryBackground: #e5e5e5;
    --vscode-button-secondaryForeground: #3b3b3b;
    --vscode-button-secondaryHoverBackground: #cccccc;
    --vscode-toolbar-hoverBackground: rgba(184, 184, 184, 0.31);
    --vscode-toolbar-activeBackground: rgba(166, 166, 166, 0.31);
    --vscode-inputOption-activeBackground: rgba(190, 195, 201, 0.51);
    --vscode-input-background: #ffffff;
    --vscode-input-foreground: #3b3b3b;
    --vscode-input-border: #cecece;
    --vscode-menu-background: #ffffff;
    --vscode-menu-foreground: #3b3b3b;
    --vscode-menu-selectionBackground: #005fb8;
    --vscode-menu-separatorBackground: #d4d4d4;
    --vscode-menu-border: #cecece;
    --vscode-notifications-background: #ffffff;
    --vscode-notifications-foreground: #3b3b3b;
    --vscode-errorForeground: #b3261e;
    --vscode-testing-iconPassed: #2e7d32;
    color-scheme: light;
  }
}

.inkspect {
  position: fixed;
  inset: 0;
  /* Sizes in cqw/cqh are of the window less the page's scrollbars (100vw counts them). */
  container-type: size;
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
  color: var(--vscode-foreground);
  pointer-events: none;
}

.inkspect *,
.inkspect *::before,
.inkspect *::after {
  box-sizing: border-box;
}

/* Everything interactive takes the pointer; the rest of the layer lets the page through. */
.bar,
.rv,
.panel-dock,
.toast,
.menu,
.ink-modal-backdrop,
/* Popups (select lists, color pickers) are portaled to the shadow root, outside .inkspect. */
[data-ink-popup],
.select-list,
.region,
.draw-host .drawing-layer {
  pointer-events: auto;
}

.inkspect.capturing * {
  visibility: hidden !important;
}

/* Capturing the page for redactions to pixelate: everything over the page steps aside for a
   moment, except the bar (there is only more of the bar under it). Transparent rather than
   hidden, so a drag that starts meanwhile still reaches the drawing layer. */
.inkspect.sampling .draw-host,
.inkspect.sampling .panel-dock,
.inkspect.sampling .toast,
.inkspect.sampling .ink-modal-backdrop,
.inkspect.sampling .menu {
  opacity: 0 !important;
}

/* The toolbar floats over the page (the page isn't moved), as wide as its buttons. Its handle
   drags it (useFloating.ts writes the position into the transform); panels hang off its side with
   more room. While drawing, the drawing tools add a second row. */
.float {
  position: fixed;
  top: 0;
  left: 0;
}

.bar {
  width: max-content;
  max-width: calc(100cqw - 16px);
  border: 1px solid var(--ink-border-strong);
  border-radius: var(--ink-radius-lg);
  background: var(--vscode-editorWidget-background);
  box-shadow: var(--ink-shadow-lg);
  user-select: none;
  animation: bar-in var(--ink-normal) var(--ink-ease);
  transition:
    box-shadow var(--ink-fast) var(--ink-ease),
    scale var(--ink-fast) var(--ink-ease);
}

/* Lifted while dragged. */
/* Docked across the top while the responsive view is open (it can't be moved then). */
.float.docked {
  right: 0;
}

.float.docked .bar {
  width: auto;
  max-width: none;
  border-width: 0 0 1px;
  border-radius: 0;
  box-shadow: none;
  animation: none;
}

.float.docked .bar-row {
  justify-content: center;
}

.float.dragging .bar {
  scale: 1.02;
  box-shadow:
    var(--ink-shadow-lg),
    0 16px 40px color-mix(in srgb, #000 30%, transparent);
}

.bar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 40px;
  padding: 4px 4px 4px 8px;
}

.bar-brand {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  font-weight: 600;
}

.bar-brand img {
  width: 18px;
  height: 18px;
  border-radius: 4px;
}

.saved-button {
  flex-shrink: 0;
}

/* The drawing tools: the bar's second row, wrapped into centered lines in a narrow window. */
.bar .draw-toolbar {
  justify-content: center;
  row-gap: 4px;
  border-top: 1px solid var(--ink-border-subtle);
  border-bottom: none;
  border-radius: 0 0 var(--ink-radius-lg) var(--ink-radius-lg);
  background: transparent;
}

/* In a very narrow window, a group wraps too. */
.bar .draw-group {
  flex-wrap: wrap;
  justify-content: center;
}

/* Wrapped, Stop drawing stays beside Screenshot rather than alone at the far edge. */
.bar .draw-close {
  margin-left: 0;
}

@keyframes bar-in {
  from {
    opacity: 0;
    scale: 0.96;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    animation: none;
    transition: none;
  }
}

.separator {
  width: 1px;
  height: 18px;
  margin: 0 4px;
  background: var(--vscode-widget-border);
}

.bookmarked .codicon {
  color: var(--ink-blue);
}

.link-connected .codicon {
  color: var(--vscode-testing-iconPassed);
}

.link-offline .codicon,
.link-unpaired .codicon {
  color: var(--vscode-descriptionForeground);
}

.draw-host {
  position: fixed;
  inset: 0;
}

.menu {
  position: fixed;
}

/* Toast ------------------------------------------------------------------------------------ */

.inkspect .toast {
  position: fixed;
  top: auto;
  right: 16px;
  bottom: 16px;
  left: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  width: min(460px, calc(100cqw - 32px));
  max-width: none;
  padding: 0;
  overflow: hidden;
  transform: none;
  border: 1px solid var(--ink-border-strong);
  border-radius: var(--ink-radius-lg);
  background: var(--vscode-editorWidget-background);
  color: var(--vscode-foreground);
  box-shadow: var(--ink-shadow-lg);
  animation: toast-in var(--ink-normal) var(--ink-ease);
}

.inkspect .toast.tone-error {
  border-color: color-mix(in srgb, var(--ink-danger) 45%, var(--ink-border-strong));
}

.toast-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 10px 14px 14px;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 18px !important;
}

.tone-success .toast-icon {
  color: var(--vscode-testing-iconPassed);
}

.tone-error .toast-icon {
  color: var(--ink-danger);
}

.toast-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding-top: 2px;
}

.toast-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: var(--ink-font-lg);
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.toast-detail {
  color: var(--ink-muted);
  overflow-wrap: anywhere;
}

.toast-close {
  flex-shrink: 0;
  margin-top: -2px;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

/* Panels ------------------------------------------------------------------------------------ */

.panel-dock {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 370px;
  max-width: calc(100cqw - 16px);
}

.float.align-right .panel-dock {
  right: 0;
  left: auto;
}

.float.above .panel-dock {
  top: auto;
  bottom: calc(100% + 8px);
}

.panel {
  border: 1px solid var(--vscode-widget-border);
  border-radius: 8px;
  background: var(--vscode-editorWidget-background);
  box-shadow: 0 8px 24px var(--vscode-widget-shadow);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 6px 6px 12px;
  border-bottom: 1px solid var(--vscode-widget-border);
  font-weight: 600;
}

.panel-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: min(70vh, 560px);
  padding: 12px;
  overflow: auto;
}

.row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
}

.field select,
.field input {
  height: 26px;
  padding: 0 6px;
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font: inherit;
  font-size: 13px;
}

.check {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 26px;
}

.note {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
}

.note.error,
.status-offline {
  color: var(--vscode-errorForeground);
}

.status {
  margin: 0;
}

.status-connected {
  color: var(--vscode-testing-iconPassed);
}

.button-row.wrap {
  flex-wrap: wrap;
}

/* A labelled group of actions in a panel ("Copy for AI", "Send ... to VS Code"). */
.panel-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--ink-border-subtle);
}

.panel-group-title {
  color: var(--ink-muted);
  font-size: var(--ink-font-sm);
  font-weight: 600;
}

/* Console and network. */
.console-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
}

.console-view {
  flex: 1;
}

.console-view .segment {
  flex: 1;
}

.log {
  min-height: 120px;
  max-height: 280px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid var(--ink-border-subtle);
  border-radius: var(--ink-radius);
  background: var(--vscode-editor-background);
  font-family: var(--vscode-editor-font-family);
  font-size: var(--ink-font-sm);
}

.log-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 5px 8px;
  border-bottom: 1px solid var(--ink-border-subtle);
}

.log-row:last-child {
  border-bottom: none;
}

.log-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--ink-muted);
  font-size: 12px !important;
}

.log-row.level-error {
  background: color-mix(in srgb, var(--ink-danger) 8%, transparent);
  color: var(--ink-danger);
}

.log-row.level-error .log-icon {
  color: var(--ink-danger);
}

.log-row.level-warning {
  background: color-mix(in srgb, var(--ink-yellow) 8%, transparent);
  color: var(--ink-yellow);
}

.log-row.level-warning .log-icon {
  color: var(--ink-yellow);
}

.log-text {
  flex: 1;
  min-width: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.log-source {
  /* Long file names are cut, never the message. */
  max-width: 35%;
  overflow: hidden;
  color: var(--ink-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.log-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 118px;
  padding: 16px;
  color: var(--ink-muted);
  font-family: var(--vscode-font-family);
  text-align: center;
}

.log-empty .codicon {
  margin-bottom: 4px;
  color: var(--ink-green);
  font-size: 20px !important;
}

.log-empty strong {
  color: var(--vscode-foreground);
  font-weight: 600;
}

/* Element inspector (DevTools colors) ------------------------------------------------------- */

/* The picker's hint (PickerHint, styled in @inkspect/shared/ui): centered at the bottom. */
.inspect-hint {
  position: fixed;
  left: 50%;
  bottom: 16px;
  max-width: calc(100cqw - 32px);
  transform: translateX(-50%);
}

.hl {
  position: fixed;
  pointer-events: none;
}

/* DevTools' box-model colors, lighter so the element's text stays readable, plus an outline. */
.hl-margin {
  background: rgba(246, 178, 107, 0.4);
}

.hl-border {
  background: rgba(255, 229, 153, 0.5);
}

.hl-padding {
  background: rgba(147, 196, 125, 0.4);
}

.hl-content {
  background: rgba(111, 168, 220, 0.4);
}

.hl-outline {
  box-shadow:
    0 0 0 2px #0a84ff,
    0 0 0 3px rgba(255, 255, 255, 0.85);
}

.selection-box {
  position: fixed;
  border: 2px solid #0078d4;
  pointer-events: none;
}

.selection-badge {
  position: absolute;
  top: -10px;
  left: -10px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background: #0078d4;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

/* Chrome's inspect tooltip: always light, like in DevTools. */
.tip {
  position: fixed;
  padding: 8px 10px;
  border-radius: 4px;
  background: #fff;
  color: #303942;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font:
    12px system-ui,
    sans-serif;
  pointer-events: none;
}

.tip-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  font-weight: 600;
}

.tip-tag {
  color: #881280;
}

.tip-id,
.tip-class {
  color: #1a1aa6;
}

.tip-size {
  flex-shrink: 0;
  color: #5f6368;
  font-weight: 400;
}

.tip-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 1px 0;
  color: #5f6368;
}

.tip-row > span:last-child {
  color: #303942;
  text-align: right;
  overflow-wrap: anywhere;
}

.tip-value {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tip-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #ccc;
}

.tip-section {
  margin: 6px 0 2px;
  padding-top: 6px;
  border-top: 1px solid #e0e0e0;
  color: #5f6368;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.tip-aa {
  padding: 0 3px;
  border: 1px solid #ccc;
}

.ok {
  color: #188038 !important;
}

.bad {
  color: #d93025 !important;
}

/* Region selection --------------------------------------------------------------------------- */

.region {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  cursor: crosshair;
}

.region-box {
  position: fixed;
  border: 1px dashed #fff;
  outline: 1px dashed rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
}

.region-size {
  position: absolute;
  top: -22px;
  left: 0;
  padding: 1px 6px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 11px;
}

/* Responsive view --------------------------------------------------------------------------- */

/* Covers the page below the bar; the page shows in a device-sized frame, centered. */
.rv {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background: color-mix(in srgb, var(--vscode-foreground) 6%, var(--vscode-editor-background));
}

.rv-controls {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--ink-border-subtle);
  background: var(--vscode-editorWidget-background);
}

.rv-device {
  width: 200px;
}

.rv-size {
  width: 64px;
}

.rv-size input {
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.rv-zoom {
  width: 84px;
}

.rv-times {
  color: var(--ink-muted);
}

.rv-divider {
  width: 1px;
  height: 18px;
  margin: 0 4px;
  background: var(--ink-border-subtle);
}

.rv-area {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

/* Centered while it fits; scrolls from its top-left corner when zoomed in beyond the area. */
.rv-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  min-width: 100%;
  min-height: 100%;
  width: max-content;
  padding: 24px 32px;
}

.rv-screen {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
  background: #fff;
  box-shadow:
    0 0 0 1px var(--ink-border-strong),
    var(--ink-shadow-lg);
}

.rv-screen iframe {
  display: block;
  border: 0;
  transform-origin: 0 0;
  background: #fff;
}

/* The screen and its resize handles (right edge, bottom edge, corner), like DevTools'. */
.rv-frame {
  position: relative;
  flex-shrink: 0;
}

.rv-handle {
  position: absolute;
  z-index: 1;
  border-radius: var(--ink-radius-pill);
  background: color-mix(in srgb, var(--vscode-foreground) 28%, transparent);
  touch-action: none;
  transition: background-color var(--ink-fast) var(--ink-ease);
}

.rv-handle:hover,
.rv.dragging .rv-handle {
  background: var(--ink-blue);
}

.rv-handle-x {
  top: 50%;
  right: -14px;
  width: 6px;
  height: 44px;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.rv-handle-y {
  bottom: -14px;
  left: 50%;
  width: 44px;
  height: 6px;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.rv-handle-xy {
  right: -14px;
  bottom: -14px;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  cursor: nwse-resize;
}

/* The frame would take the pointer from the handle mid-drag. */
.rv.dragging iframe {
  pointer-events: none;
}

.rv.dragging {
  user-select: none;
}

.rv-caption {
  height: 14px;
  color: var(--ink-muted);
  font-size: var(--ink-font-xs);
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .bar,
  .inkspect .toast {
    animation: none;
  }
}

/* The shortcuts panel. */
.shortcuts-bar {
  display: flex;
  align-items: center;
  gap: 6px;
}

.shortcuts-bar .text-field {
  flex: 1;
}

/* Group headers pin to the panel's top edge (sticky stops at the padding otherwise, leaving a
   strip where rows show through). */
.panel-body .shortcut-list {
  --shortcut-sticky-top: -12px;
}

.panel-body .group-header {
  background: var(--vscode-editorWidget-background);
}

.shortcuts-sync {
  display: flex;
  gap: 6px;
}

.shortcuts-sync .codicon {
  flex-shrink: 0;
  margin-top: 1px;
}

/* The bar over a Shift+click selection (SelectionBar), just above the picker's hint. */
.toolbar-selection-bar {
  position: fixed;
  left: 50%;
  bottom: 92px;
  transform: translateX(-50%);
}
`;var Rx=L(q());async function wT(){try{let e=await(await fetch(chrome.runtime.getURL("codicon.ttf"))).arrayBuffer(),t=new FontFace("codicon",e);await t.load(),document.fonts.add(t)}catch{}}function kT(){let e=document.createElement("inkspect-toolbar");e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; display: block;";let t=e.attachShadow({mode:"closed"});Z0(t);let n=document.createElement("style");n.textContent=[Sm.replace(/@font-face\s*{[^}]*}/g,""),Tm,Mx,Ax].join(`
`);let o=document.createElement("div");t.append(n,o),Em(t),document.documentElement.appendChild(e),wT();let a=(0,Ox.createRoot)(o),i=()=>(e.style.visibility="hidden",()=>{e.style.visibility=""});return r=>{e.isConnected||document.documentElement.appendChild(e),a.render((0,Rx.jsx)(Nx,{host:e,hideHost:i,toggleSignal:r}))}}var zx=window;if(!zx.__inkspect){zx.__inkspect=!0;let e,t=0;chrome.runtime.onMessage.addListener(n=>{n.type==="toggle"&&(n.key&&uy(n.key)||(e??=kT(),e(++t)))})}})();
