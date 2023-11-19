import{i as Fe,n as ne,t as ge,b as Ve,d as fr,g as lr,c as dr,_ as pr}from"./lodash.c5f1a86c.js";import{r as z,Q as hr,l as ze,z as ee,h as ye,f as Be,o as Je,c as Me,a as mr,E as gr,_ as yr}from"./entry.bac27b46.js";function ae(x){var O;const y=ge(x);return(O=y==null?void 0:y.$el)!=null?O:y}const oe=Fe?window:void 0,vr=Fe?window.document:void 0;function me(...x){let O,y,S,o;if(typeof x[0]=="string"||Array.isArray(x[0])?([y,S,o]=x,O=oe):[O,y,S,o]=x,!O)return ne;Array.isArray(y)||(y=[y]),Array.isArray(S)||(S=[S]);const I=[],E=()=>{I.forEach(P=>P()),I.length=0},_=(P,v,j,d)=>(P.addEventListener(v,j,d),()=>P.removeEventListener(v,j,d)),V=ee(()=>[ae(O),ge(o)],([P,v])=>{E(),P&&I.push(...y.flatMap(j=>S.map(d=>_(P,j,d,v))))},{immediate:!0,flush:"post"}),C=()=>{V(),E()};return Ve(C),C}function br(){const x=z(!1);return hr()&&ze(()=>{x.value=!0}),x}function wr(x){const O=br();return ye(()=>(O.value,!!x()))}function qr({document:x=vr}={}){if(!x)return z("visible");const O=z(x.visibilityState);return me(x,"visibilitychange",()=>{O.value=x.visibilityState}),O}function Pr(x,O,y={}){const{root:S,rootMargin:o="0px",threshold:I=.1,window:E=oe,immediate:_=!0}=y,V=wr(()=>E&&"IntersectionObserver"in E),C=ye(()=>{const F=ge(x);return(Array.isArray(F)?F:[F]).map(ae).filter(fr)});let P=ne;const v=z(_),j=V.value?ee(()=>[C.value,ae(S),v.value],([F,W])=>{if(P(),!v.value||!F.length)return;const m=new IntersectionObserver(O,{root:ae(W),rootMargin:o,threshold:I});F.forEach(B=>B&&m.observe(B)),P=()=>{m.disconnect(),P=ne}},{immediate:_,flush:"post"}):ne,d=()=>{P(),j(),v.value=!1};return Ve(d),{isSupported:V,isActive:v,pause(){P(),v.value=!1},resume(){v.value=!0},stop:d}}function We(x,{window:O=oe,scrollTarget:y}={}){const S=z(!1);return Pr(x,([{isIntersecting:o}])=>{S.value=o},{root:y,window:O}),S}function kr({window:x=oe}={}){if(!x)return z(!1);const O=z(x.document.hasFocus());return me(x,"blur",()=>{O.value=!1}),me(x,"focus",()=>{O.value=!0}),O}var Le={exports:{}};/*! algoliasearch.umd.js | 4.19.1 | © Algolia, inc. | https://github.com/algolia/algoliasearch-client-javascript */(function(x,O){(function(y,S){x.exports=S()})(dr,function(){function y(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function S(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?S(Object(r),!0).forEach(function(n){y(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):S(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function I(e,t){if(e==null)return{};var r,n,a=function(c,i){if(c==null)return{};var s,l,f={},h=Object.keys(c);for(l=0;l<h.length;l++)s=h[l],i.indexOf(s)>=0||(f[s]=c[s]);return f}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}function E(e,t){return function(r){if(Array.isArray(r))return r}(e)||function(r,n){if(Symbol.iterator in Object(r)||Object.prototype.toString.call(r)==="[object Arguments]"){var a=[],u=!0,c=!1,i=void 0;try{for(var s,l=r[Symbol.iterator]();!(u=(s=l.next()).done)&&(a.push(s.value),!n||a.length!==n);u=!0);}catch(f){c=!0,i=f}finally{try{u||l.return==null||l.return()}finally{if(c)throw i}}return a}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function _(e){return function(t){if(Array.isArray(t)){for(var r=0,n=new Array(t.length);r<t.length;r++)n[r]=t[r];return n}}(e)||function(t){if(Symbol.iterator in Object(t)||Object.prototype.toString.call(t)==="[object Arguments]")return Array.from(t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function V(e){var t,r="algoliasearch-client-js-".concat(e.key),n=function(){return t===void 0&&(t=e.localStorage||window.localStorage),t},a=function(){return JSON.parse(n().getItem(r)||"{}")},u=function(i){n().setItem(r,JSON.stringify(i))},c=function(){var i=e.timeToLive?1e3*e.timeToLive:null,s=a(),l=Object.fromEntries(Object.entries(s).filter(function(h){return E(h,2)[1].timestamp!==void 0}));if(u(l),i){var f=Object.fromEntries(Object.entries(l).filter(function(h){var p=E(h,2)[1],b=new Date().getTime();return!(p.timestamp+i<b)}));u(f)}};return{get:function(i,s){var l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}};return Promise.resolve().then(function(){c();var f=JSON.stringify(i);return a()[f]}).then(function(f){return Promise.all([f?f.value:s(),f!==void 0])}).then(function(f){var h=E(f,2),p=h[0],b=h[1];return Promise.all([p,b||l.miss(p)])}).then(function(f){return E(f,1)[0]})},set:function(i,s){return Promise.resolve().then(function(){var l=a();return l[JSON.stringify(i)]={timestamp:new Date().getTime(),value:s},n().setItem(r,JSON.stringify(l)),s})},delete:function(i){return Promise.resolve().then(function(){var s=a();delete s[JSON.stringify(i)],n().setItem(r,JSON.stringify(s))})},clear:function(){return Promise.resolve().then(function(){n().removeItem(r)})}}}function C(e){var t=_(e.caches),r=t.shift();return r===void 0?{get:function(n,a){var u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}},c=a();return c.then(function(i){return Promise.all([i,u.miss(i)])}).then(function(i){return E(i,1)[0]})},set:function(n,a){return Promise.resolve(a)},delete:function(n){return Promise.resolve()},clear:function(){return Promise.resolve()}}:{get:function(n,a){var u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}};return r.get(n,a,u).catch(function(){return C({caches:t}).get(n,a,u)})},set:function(n,a){return r.set(n,a).catch(function(){return C({caches:t}).set(n,a)})},delete:function(n){return r.delete(n).catch(function(){return C({caches:t}).delete(n)})},clear:function(){return r.clear().catch(function(){return C({caches:t}).clear()})}}}function P(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{serializable:!0},t={};return{get:function(r,n){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}},u=JSON.stringify(r);if(u in t)return Promise.resolve(e.serializable?JSON.parse(t[u]):t[u]);var c=n(),i=a&&a.miss||function(){return Promise.resolve()};return c.then(function(s){return i(s)}).then(function(){return c})},set:function(r,n){return t[JSON.stringify(r)]=e.serializable?JSON.stringify(n):n,Promise.resolve(n)},delete:function(r){return delete t[JSON.stringify(r)],Promise.resolve()},clear:function(){return t={},Promise.resolve()}}}function v(e,t,r){var n={"x-algolia-api-key":r,"x-algolia-application-id":t};return{headers:function(){return e===B.WithinHeaders?n:{}},queryParameters:function(){return e===B.WithinQueryParameters?n:{}}}}function j(e){var t=0;return e(function r(){return t++,new Promise(function(n){setTimeout(function(){n(e(r))},Math.min(100*t,1e3))})})}function d(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:function(r,n){return Promise.resolve()};return Object.assign(e,{wait:function(r){return d(e.then(function(n){return Promise.all([t(n,r),n])}).then(function(n){return n[1]}))}})}function F(e){for(var t=e.length-1;t>0;t--){var r=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[r],e[r]=n}return e}function W(e,t){return t&&Object.keys(t).forEach(function(r){e[r]=t[r](e)}),e}function m(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];var a=0;return e.replace(/%s/g,function(){return encodeURIComponent(r[a++])})}var B={WithinQueryParameters:0,WithinHeaders:1};function U(e,t){var r=e||{},n=r.data||{};return Object.keys(r).forEach(function(a){["timeout","headers","queryParameters","data","cacheable"].indexOf(a)===-1&&(n[a]=r[a])}),{data:Object.entries(n).length>0?n:void 0,timeout:r.timeout||t,headers:r.headers||{},queryParameters:r.queryParameters||{},cacheable:r.cacheable}}var L={Read:1,Write:2,Any:3},ve=1,He=2,be=3;function we(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:ve;return o(o({},e),{},{status:t,lastUpdate:Date.now()})}function Pe(e){return typeof e=="string"?{protocol:"https",url:e,accept:L.Any}:{protocol:e.protocol||"https",url:e.url,accept:e.accept||L.Any}}var H="DELETE",k="GET",w="POST",ie="PUT";function Ke(e,t){return Promise.all(t.map(function(r){return e.get(r,function(){return Promise.resolve(we(r))})})).then(function(r){var n=r.filter(function(c){return function(i){return i.status===ve||Date.now()-i.lastUpdate>12e4}(c)}),a=r.filter(function(c){return function(i){return i.status===be&&Date.now()-i.lastUpdate<=12e4}(c)}),u=[].concat(_(n),_(a));return{getTimeout:function(c,i){return(a.length===0&&c===0?1:a.length+3+c)*i},statelessHosts:u.length>0?u.map(function(c){return Pe(c)}):t}})}function xe(e,t,r,n){var a=[],u=function(p,b){if(!(p.method===k||p.data===void 0&&b.data===void 0)){var g=Array.isArray(p.data)?p.data:o(o({},p.data),b.data);return JSON.stringify(g)}}(r,n),c=function(p,b){var g=o(o({},p.headers),b.headers),D={};return Object.keys(g).forEach(function(q){var A=g[q];D[q.toLowerCase()]=A}),D}(e,n),i=r.method,s=r.method!==k?{}:o(o({},r.data),n.data),l=o(o(o({"x-algolia-agent":e.userAgent.value},e.queryParameters),s),n.queryParameters),f=0,h=function p(b,g){var D=b.pop();if(D===void 0)throw{name:"RetryError",message:"Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.",transporterStackTrace:Ie(a)};var q={data:u,headers:c,method:i,url:Ge(D,r.path,l),connectTimeout:g(f,e.timeouts.connect),responseTimeout:g(f,n.timeout)},A=function(R){var N={request:q,response:R,host:D,triesLeft:b.length};return a.push(N),N},Y={onSuccess:function(R){return function(N){try{return JSON.parse(N.content)}catch(M){throw function(J,G){return{name:"DeserializationError",message:J,response:G}}(M.message,N)}}(R)},onRetry:function(R){var N=A(R);return R.isTimedOut&&f++,Promise.all([e.logger.info("Retryable failure",je(N)),e.hostsCache.set(D,we(D,R.isTimedOut?be:He))]).then(function(){return p(b,g)})},onFail:function(R){throw A(R),function(N,M){var J=N.content,G=N.status,Z=J;try{Z=JSON.parse(J).message}catch{}return function(re,he,cr){return{name:"ApiError",message:re,status:he,transporterStackTrace:cr}}(Z,G,M)}(R,Ie(a))}};return e.requester.send(q).then(function(R){return function(N,M){return function(J){var G=J.status;return J.isTimedOut||function(Z){var re=Z.isTimedOut,he=Z.status;return!re&&~~he==0}(J)||~~(G/100)!=2&&~~(G/100)!=4}(N)?M.onRetry(N):~~(N.status/100)==2?M.onSuccess(N):M.onFail(N)}(R,Y)})};return Ke(e.hostsCache,t).then(function(p){return h(_(p.statelessHosts).reverse(),p.getTimeout)})}function ue(e){var t=e.hostsCache,r=e.logger,n=e.requester,a=e.requestsCache,u=e.responsesCache,c=e.timeouts,i=e.userAgent,s=e.hosts,l=e.queryParameters,f={hostsCache:t,logger:r,requester:n,requestsCache:a,responsesCache:u,timeouts:c,userAgent:i,headers:e.headers,queryParameters:l,hosts:s.map(function(h){return Pe(h)}),read:function(h,p){var b=U(p,f.timeouts.read),g=function(){return xe(f,f.hosts.filter(function(q){return(q.accept&L.Read)!=0}),h,b)};if((b.cacheable!==void 0?b.cacheable:h.cacheable)!==!0)return g();var D={request:h,mappedRequestOptions:b,transporter:{queryParameters:f.queryParameters,headers:f.headers}};return f.responsesCache.get(D,function(){return f.requestsCache.get(D,function(){return f.requestsCache.set(D,g()).then(function(q){return Promise.all([f.requestsCache.delete(D),q])},function(q){return Promise.all([f.requestsCache.delete(D),Promise.reject(q)])}).then(function(q){var A=E(q,2);return A[0],A[1]})})},{miss:function(q){return f.responsesCache.set(D,q)}})},write:function(h,p){return xe(f,f.hosts.filter(function(b){return(b.accept&L.Write)!=0}),h,U(p,f.timeouts.write))}};return f}function Qe(e){var t={value:"Algolia for JavaScript (".concat(e,")"),add:function(r){var n="; ".concat(r.segment).concat(r.version!==void 0?" (".concat(r.version,")"):"");return t.value.indexOf(n)===-1&&(t.value="".concat(t.value).concat(n)),t}};return t}function Ge(e,t,r){var n=Oe(r),a="".concat(e.protocol,"://").concat(e.url,"/").concat(t.charAt(0)==="/"?t.substr(1):t);return n.length&&(a+="?".concat(n)),a}function Oe(e){return Object.keys(e).map(function(t){return m("%s=%s",t,(r=e[t],Object.prototype.toString.call(r)==="[object Object]"||Object.prototype.toString.call(r)==="[object Array]"?JSON.stringify(e[t]):e[t]));var r}).join("&")}function Ie(e){return e.map(function(t){return je(t)})}function je(e){var t=e.request.headers["x-algolia-api-key"]?{"x-algolia-api-key":"*****"}:{};return o(o({},e),{},{request:o(o({},e.request),{},{headers:o(o({},e.request.headers),t)})})}var Xe=function(e){return function(t,r){return e.transporter.write({method:w,path:"2/abtests",data:t},r)}},$e=function(e){return function(t,r){return e.transporter.write({method:H,path:m("2/abtests/%s",t)},r)}},Ye=function(e){return function(t,r){return e.transporter.read({method:k,path:m("2/abtests/%s",t)},r)}},Ze=function(e){return function(t){return e.transporter.read({method:k,path:"2/abtests"},t)}},et=function(e){return function(t,r){return e.transporter.write({method:w,path:m("2/abtests/%s/stop",t)},r)}},tt=function(e){return function(t){return e.transporter.read({method:k,path:"1/strategies/personalization"},t)}},rt=function(e){return function(t,r){return e.transporter.write({method:w,path:"1/strategies/personalization",data:t},r)}};function se(e){return function t(r){return e.request(r).then(function(n){if(e.batch!==void 0&&e.batch(n.hits),!e.shouldStop(n))return n.cursor?t({cursor:n.cursor}):t({page:(r.page||0)+1})})}({})}var nt=function(e){return function(t,r){var n=r||{},a=n.queryParameters,u=I(n,["queryParameters"]),c=o({acl:t},a!==void 0?{queryParameters:a}:{});return d(e.transporter.write({method:w,path:"1/keys",data:c},u),function(i,s){return j(function(l){return X(e)(i.key,s).catch(function(f){if(f.status!==404)throw f;return l()})})})}},at=function(e){return function(t,r,n){var a=U(n);return a.queryParameters["X-Algolia-User-ID"]=t,e.transporter.write({method:w,path:"1/clusters/mapping",data:{cluster:r}},a)}},ot=function(e){return function(t,r,n){return e.transporter.write({method:w,path:"1/clusters/mapping/batch",data:{users:t,cluster:r}},n)}},it=function(e){return function(t,r){return d(e.transporter.write({method:w,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!0,requests:{action:"addEntry",body:[]}}},r),function(n,a){return K(e)(n.taskID,a)})}},te=function(e){return function(t,r,n){return d(e.transporter.write({method:w,path:m("1/indexes/%s/operation",t),data:{operation:"copy",destination:r}},n),function(a,u){return $(e)(t,{methods:{waitTask:T}}).waitTask(a.taskID,u)})}},ut=function(e){return function(t,r,n){return te(e)(t,r,o(o({},n),{},{scope:[pe.Rules]}))}},st=function(e){return function(t,r,n){return te(e)(t,r,o(o({},n),{},{scope:[pe.Settings]}))}},ct=function(e){return function(t,r,n){return te(e)(t,r,o(o({},n),{},{scope:[pe.Synonyms]}))}},ft=function(e){return function(t,r){return t.method===k?e.transporter.read(t,r):e.transporter.write(t,r)}},lt=function(e){return function(t,r){return d(e.transporter.write({method:H,path:m("1/keys/%s",t)},r),function(n,a){return j(function(u){return X(e)(t,a).then(u).catch(function(c){if(c.status!==404)throw c})})})}},dt=function(e){return function(t,r,n){var a=r.map(function(u){return{action:"deleteEntry",body:{objectID:u}}});return d(e.transporter.write({method:w,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!1,requests:a}},n),function(u,c){return K(e)(u.taskID,c)})}},X=function(e){return function(t,r){return e.transporter.read({method:k,path:m("1/keys/%s",t)},r)}},De=function(e){return function(t,r){return e.transporter.read({method:k,path:m("1/task/%s",t.toString())},r)}},pt=function(e){return function(t){return e.transporter.read({method:k,path:"/1/dictionaries/*/settings"},t)}},ht=function(e){return function(t){return e.transporter.read({method:k,path:"1/logs"},t)}},mt=function(e){return function(t){return e.transporter.read({method:k,path:"1/clusters/mapping/top"},t)}},gt=function(e){return function(t,r){return e.transporter.read({method:k,path:m("1/clusters/mapping/%s",t)},r)}},yt=function(e){return function(t){var r=t||{},n=r.retrieveMappings,a=I(r,["retrieveMappings"]);return n===!0&&(a.getClusters=!0),e.transporter.read({method:k,path:"1/clusters/mapping/pending"},a)}},$=function(e){return function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n={transporter:e.transporter,appId:e.appId,indexName:t};return W(n,r.methods)}},vt=function(e){return function(t){return e.transporter.read({method:k,path:"1/keys"},t)}},bt=function(e){return function(t){return e.transporter.read({method:k,path:"1/clusters"},t)}},wt=function(e){return function(t){return e.transporter.read({method:k,path:"1/indexes"},t)}},Pt=function(e){return function(t){return e.transporter.read({method:k,path:"1/clusters/mapping"},t)}},xt=function(e){return function(t,r,n){return d(e.transporter.write({method:w,path:m("1/indexes/%s/operation",t),data:{operation:"move",destination:r}},n),function(a,u){return $(e)(t,{methods:{waitTask:T}}).waitTask(a.taskID,u)})}},Ot=function(e){return function(t,r){return d(e.transporter.write({method:w,path:"1/indexes/*/batch",data:{requests:t}},r),function(n,a){return Promise.all(Object.keys(n.taskID).map(function(u){return $(e)(u,{methods:{waitTask:T}}).waitTask(n.taskID[u],a)}))})}},It=function(e){return function(t,r){return e.transporter.read({method:w,path:"1/indexes/*/objects",data:{requests:t}},r)}},Se=function(e){return function(t,r){var n=t.map(function(a){return o(o({},a),{},{params:Oe(a.params||{})})});return e.transporter.read({method:w,path:"1/indexes/*/queries",data:{requests:n},cacheable:!0},r)}},qe=function(e){return function(t,r){return Promise.all(t.map(function(n){var a=n.params,u=a.facetName,c=a.facetQuery,i=I(a,["facetName","facetQuery"]);return $(e)(n.indexName,{methods:{searchForFacetValues:Re}}).searchForFacetValues(u,c,o(o({},r),i))}))}},jt=function(e){return function(t,r){var n=U(r);return n.queryParameters["X-Algolia-User-ID"]=t,e.transporter.write({method:H,path:"1/clusters/mapping"},n)}},Dt=function(e){return function(t,r,n){var a=r.map(function(u){return{action:"addEntry",body:u}});return d(e.transporter.write({method:w,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!0,requests:a}},n),function(u,c){return K(e)(u.taskID,c)})}},St=function(e){return function(t,r){return d(e.transporter.write({method:w,path:m("1/keys/%s/restore",t)},r),function(n,a){return j(function(u){return X(e)(t,a).catch(function(c){if(c.status!==404)throw c;return u()})})})}},qt=function(e){return function(t,r,n){var a=r.map(function(u){return{action:"addEntry",body:u}});return d(e.transporter.write({method:w,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!1,requests:a}},n),function(u,c){return K(e)(u.taskID,c)})}},kt=function(e){return function(t,r,n){return e.transporter.read({method:w,path:m("/1/dictionaries/%s/search",t),data:{query:r},cacheable:!0},n)}},Tt=function(e){return function(t,r){return e.transporter.read({method:w,path:"1/clusters/mapping/search",data:{query:t}},r)}},Et=function(e){return function(t,r){return d(e.transporter.write({method:ie,path:"/1/dictionaries/*/settings",data:t},r),function(n,a){return K(e)(n.taskID,a)})}},Nt=function(e){return function(t,r){var n=Object.assign({},r),a=r||{},u=a.queryParameters,c=I(a,["queryParameters"]),i=u?{queryParameters:u}:{},s=["acl","indexes","referers","restrictSources","queryParameters","description","maxQueriesPerIPPerHour","maxHitsPerQuery"];return d(e.transporter.write({method:ie,path:m("1/keys/%s",t),data:i},c),function(l,f){return j(function(h){return X(e)(t,f).then(function(p){return function(b){return Object.keys(n).filter(function(g){return s.indexOf(g)!==-1}).every(function(g){if(Array.isArray(b[g])&&Array.isArray(n[g])){var D=b[g];return D.length===n[g].length&&D.every(function(q,A){return q===n[g][A]})}return b[g]===n[g]})}(p)?Promise.resolve():h()})})})}},K=function(e){return function(t,r){return j(function(n){return De(e)(t,r).then(function(a){return a.status!=="published"?n():void 0})})}},ke=function(e){return function(t,r){return d(e.transporter.write({method:w,path:m("1/indexes/%s/batch",e.indexName),data:{requests:t}},r),function(n,a){return T(e)(n.taskID,a)})}},At=function(e){return function(t){return se(o(o({shouldStop:function(r){return r.cursor===void 0}},t),{},{request:function(r){return e.transporter.read({method:w,path:m("1/indexes/%s/browse",e.indexName),data:r},t)}}))}},Rt=function(e){return function(t){var r=o({hitsPerPage:1e3},t);return se(o(o({shouldStop:function(n){return n.hits.length<r.hitsPerPage}},r),{},{request:function(n){return _e(e)("",o(o({},r),n)).then(function(a){return o(o({},a),{},{hits:a.hits.map(function(u){return delete u._highlightResult,u})})})}}))}},_t=function(e){return function(t){var r=o({hitsPerPage:1e3},t);return se(o(o({shouldStop:function(n){return n.hits.length<r.hitsPerPage}},r),{},{request:function(n){return Ce(e)("",o(o({},r),n)).then(function(a){return o(o({},a),{},{hits:a.hits.map(function(u){return delete u._highlightResult,u})})})}}))}},ce=function(e){return function(t,r,n){var a=n||{},u=a.batchSize,c=I(a,["batchSize"]),i={taskIDs:[],objectIDs:[]};return d(function s(){var l,f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,h=[];for(l=f;l<t.length&&(h.push(t[l]),h.length!==(u||1e3));l++);return h.length===0?Promise.resolve(i):ke(e)(h.map(function(p){return{action:r,body:p}}),c).then(function(p){return i.objectIDs=i.objectIDs.concat(p.objectIDs),i.taskIDs.push(p.taskID),l++,s(l)})}(),function(s,l){return Promise.all(s.taskIDs.map(function(f){return T(e)(f,l)}))})}},Ct=function(e){return function(t){return d(e.transporter.write({method:w,path:m("1/indexes/%s/clear",e.indexName)},t),function(r,n){return T(e)(r.taskID,n)})}},Ut=function(e){return function(t){var r=t||{},n=r.forwardToReplicas,a=U(I(r,["forwardToReplicas"]));return n&&(a.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:w,path:m("1/indexes/%s/rules/clear",e.indexName)},a),function(u,c){return T(e)(u.taskID,c)})}},Ft=function(e){return function(t){var r=t||{},n=r.forwardToReplicas,a=U(I(r,["forwardToReplicas"]));return n&&(a.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:w,path:m("1/indexes/%s/synonyms/clear",e.indexName)},a),function(u,c){return T(e)(u.taskID,c)})}},Vt=function(e){return function(t,r){return d(e.transporter.write({method:w,path:m("1/indexes/%s/deleteByQuery",e.indexName),data:t},r),function(n,a){return T(e)(n.taskID,a)})}},zt=function(e){return function(t){return d(e.transporter.write({method:H,path:m("1/indexes/%s",e.indexName)},t),function(r,n){return T(e)(r.taskID,n)})}},Bt=function(e){return function(t,r){return d(Te(e)([t],r).then(function(n){return{taskID:n.taskIDs[0]}}),function(n,a){return T(e)(n.taskID,a)})}},Te=function(e){return function(t,r){var n=t.map(function(a){return{objectID:a}});return ce(e)(n,Q.DeleteObject,r)}},Jt=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=U(I(n,["forwardToReplicas"]));return a&&(u.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:H,path:m("1/indexes/%s/rules/%s",e.indexName,t)},u),function(c,i){return T(e)(c.taskID,i)})}},Mt=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=U(I(n,["forwardToReplicas"]));return a&&(u.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:H,path:m("1/indexes/%s/synonyms/%s",e.indexName,t)},u),function(c,i){return T(e)(c.taskID,i)})}},Wt=function(e){return function(t){return Ee(e)(t).then(function(){return!0}).catch(function(r){if(r.status!==404)throw r;return!1})}},Lt=function(e){return function(t,r,n){return e.transporter.read({method:w,path:m("1/answers/%s/prediction",e.indexName),data:{query:t,queryLanguages:r},cacheable:!0},n)}},Ht=function(e){return function(t,r){var n=r||{},a=n.query,u=n.paginate,c=I(n,["query","paginate"]),i=0;return function s(){return Ae(e)(a||"",o(o({},c),{},{page:i})).then(function(l){for(var f=0,h=Object.entries(l.hits);f<h.length;f++){var p=E(h[f],2),b=p[0],g=p[1];if(t(g))return{object:g,position:parseInt(b,10),page:i}}if(i++,u===!1||i>=l.nbPages)throw{name:"ObjectNotFoundError",message:"Object not found."};return s()})}()}},Kt=function(e){return function(t,r){return e.transporter.read({method:k,path:m("1/indexes/%s/%s",e.indexName,t)},r)}},Qt=function(){return function(e,t){for(var r=0,n=Object.entries(e.hits);r<n.length;r++){var a=E(n[r],2),u=a[0];if(a[1].objectID===t)return parseInt(u,10)}return-1}},Gt=function(e){return function(t,r){var n=r||{},a=n.attributesToRetrieve,u=I(n,["attributesToRetrieve"]),c=t.map(function(i){return o({indexName:e.indexName,objectID:i},a?{attributesToRetrieve:a}:{})});return e.transporter.read({method:w,path:"1/indexes/*/objects",data:{requests:c}},u)}},Xt=function(e){return function(t,r){return e.transporter.read({method:k,path:m("1/indexes/%s/rules/%s",e.indexName,t)},r)}},Ee=function(e){return function(t){return e.transporter.read({method:k,path:m("1/indexes/%s/settings",e.indexName),data:{getVersion:2}},t)}},$t=function(e){return function(t,r){return e.transporter.read({method:k,path:m("1/indexes/%s/synonyms/%s",e.indexName,t)},r)}},Yt=function(e){return function(t,r){return d(Ne(e)([t],r).then(function(n){return{objectID:n.objectIDs[0],taskID:n.taskIDs[0]}}),function(n,a){return T(e)(n.taskID,a)})}},Ne=function(e){return function(t,r){var n=r||{},a=n.createIfNotExists,u=I(n,["createIfNotExists"]),c=a?Q.PartialUpdateObject:Q.PartialUpdateObjectNoCreate;return ce(e)(t,c,u)}},Zt=function(e){return function(t,r){var n=r||{},a=n.safe,u=n.autoGenerateObjectIDIfNotExist,c=n.batchSize,i=I(n,["safe","autoGenerateObjectIDIfNotExist","batchSize"]),s=function(g,D,q,A){return d(e.transporter.write({method:w,path:m("1/indexes/%s/operation",g),data:{operation:q,destination:D}},A),function(Y,R){return T(e)(Y.taskID,R)})},l=Math.random().toString(36).substring(7),f="".concat(e.indexName,"_tmp_").concat(l),h=fe({appId:e.appId,transporter:e.transporter,indexName:f}),p=[],b=s(e.indexName,f,"copy",o(o({},i),{},{scope:["settings","synonyms","rules"]}));return p.push(b),d((a?b.wait(i):b).then(function(){var g=h(t,o(o({},i),{},{autoGenerateObjectIDIfNotExist:u,batchSize:c}));return p.push(g),a?g.wait(i):g}).then(function(){var g=s(f,e.indexName,"move",i);return p.push(g),a?g.wait(i):g}).then(function(){return Promise.all(p)}).then(function(g){var D=E(g,3),q=D[0],A=D[1],Y=D[2];return{objectIDs:A.objectIDs,taskIDs:[q.taskID].concat(_(A.taskIDs),[Y.taskID])}}),function(g,D){return Promise.all(p.map(function(q){return q.wait(D)}))})}},er=function(e){return function(t,r){return le(e)(t,o(o({},r),{},{clearExistingRules:!0}))}},tr=function(e){return function(t,r){return de(e)(t,o(o({},r),{},{clearExistingSynonyms:!0}))}},rr=function(e){return function(t,r){return d(fe(e)([t],r).then(function(n){return{objectID:n.objectIDs[0],taskID:n.taskIDs[0]}}),function(n,a){return T(e)(n.taskID,a)})}},fe=function(e){return function(t,r){var n=r||{},a=n.autoGenerateObjectIDIfNotExist,u=I(n,["autoGenerateObjectIDIfNotExist"]),c=a?Q.AddObject:Q.UpdateObject;if(c===Q.UpdateObject){var i=!0,s=!1,l=void 0;try{for(var f,h=t[Symbol.iterator]();!(i=(f=h.next()).done);i=!0)if(f.value.objectID===void 0)return d(Promise.reject({name:"MissingObjectIDError",message:"All objects must have an unique objectID (like a primary key) to be valid. Algolia is also able to generate objectIDs automatically but *it's not recommended*. To do it, use the `{'autoGenerateObjectIDIfNotExist': true}` option."}))}catch(p){s=!0,l=p}finally{try{i||h.return==null||h.return()}finally{if(s)throw l}}}return ce(e)(t,c,u)}},nr=function(e){return function(t,r){return le(e)([t],r)}},le=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=n.clearExistingRules,c=U(I(n,["forwardToReplicas","clearExistingRules"]));return a&&(c.queryParameters.forwardToReplicas=1),u&&(c.queryParameters.clearExistingRules=1),d(e.transporter.write({method:w,path:m("1/indexes/%s/rules/batch",e.indexName),data:t},c),function(i,s){return T(e)(i.taskID,s)})}},ar=function(e){return function(t,r){return de(e)([t],r)}},de=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=n.clearExistingSynonyms,c=n.replaceExistingSynonyms,i=U(I(n,["forwardToReplicas","clearExistingSynonyms","replaceExistingSynonyms"]));return a&&(i.queryParameters.forwardToReplicas=1),(c||u)&&(i.queryParameters.replaceExistingSynonyms=1),d(e.transporter.write({method:w,path:m("1/indexes/%s/synonyms/batch",e.indexName),data:t},i),function(s,l){return T(e)(s.taskID,l)})}},Ae=function(e){return function(t,r){return e.transporter.read({method:w,path:m("1/indexes/%s/query",e.indexName),data:{query:t},cacheable:!0},r)}},Re=function(e){return function(t,r,n){return e.transporter.read({method:w,path:m("1/indexes/%s/facets/%s/query",e.indexName,t),data:{facetQuery:r},cacheable:!0},n)}},_e=function(e){return function(t,r){return e.transporter.read({method:w,path:m("1/indexes/%s/rules/search",e.indexName),data:{query:t}},r)}},Ce=function(e){return function(t,r){return e.transporter.read({method:w,path:m("1/indexes/%s/synonyms/search",e.indexName),data:{query:t}},r)}},or=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=U(I(n,["forwardToReplicas"]));return a&&(u.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:ie,path:m("1/indexes/%s/settings",e.indexName),data:t},u),function(c,i){return T(e)(c.taskID,i)})}},T=function(e){return function(t,r){return j(function(n){return function(a){return function(u,c){return a.transporter.read({method:k,path:m("1/indexes/%s/task/%s",a.indexName,u.toString())},c)}}(e)(t,r).then(function(a){return a.status!=="published"?n():void 0})})}},Q={AddObject:"addObject",UpdateObject:"updateObject",PartialUpdateObject:"partialUpdateObject",PartialUpdateObjectNoCreate:"partialUpdateObjectNoCreate",DeleteObject:"deleteObject",DeleteIndex:"delete",ClearIndex:"clear"},pe={Settings:"settings",Synonyms:"synonyms",Rules:"rules"},ir=1,ur=2,sr=3;function Ue(e,t,r){var n,a={appId:e,apiKey:t,timeouts:{connect:1,read:2,write:30},requester:{send:function(i){return new Promise(function(s){var l=new XMLHttpRequest;l.open(i.method,i.url,!0),Object.keys(i.headers).forEach(function(b){return l.setRequestHeader(b,i.headers[b])});var f,h=function(b,g){return setTimeout(function(){l.abort(),s({status:0,content:g,isTimedOut:!0})},1e3*b)},p=h(i.connectTimeout,"Connection timeout");l.onreadystatechange=function(){l.readyState>l.OPENED&&f===void 0&&(clearTimeout(p),f=h(i.responseTimeout,"Socket timeout"))},l.onerror=function(){l.status===0&&(clearTimeout(p),clearTimeout(f),s({content:l.responseText||"Network request failed",status:l.status,isTimedOut:!1}))},l.onload=function(){clearTimeout(p),clearTimeout(f),s({content:l.responseText,status:l.status,isTimedOut:!1})},l.send(i.data)})}},logger:(n=sr,{debug:function(i,s){return ir>=n&&console.debug(i,s),Promise.resolve()},info:function(i,s){return ur>=n&&console.info(i,s),Promise.resolve()},error:function(i,s){return console.error(i,s),Promise.resolve()}}),responsesCache:P(),requestsCache:P({serializable:!1}),hostsCache:C({caches:[V({key:"".concat("4.19.1","-").concat(e)}),P()]}),userAgent:Qe("4.19.1").add({segment:"Browser"})},u=o(o({},a),r),c=function(){return function(i){return function(s){var l=s.region||"us",f=v(B.WithinHeaders,s.appId,s.apiKey),h=ue(o(o({hosts:[{url:"personalization.".concat(l,".algolia.com")}]},s),{},{headers:o(o(o({},f.headers()),{"content-type":"application/json"}),s.headers),queryParameters:o(o({},f.queryParameters()),s.queryParameters)}));return W({appId:s.appId,transporter:h},s.methods)}(o(o(o({},a),i),{},{methods:{getPersonalizationStrategy:tt,setPersonalizationStrategy:rt}}))}};return function(i){var s=i.appId,l=v(i.authMode!==void 0?i.authMode:B.WithinHeaders,s,i.apiKey),f=ue(o(o({hosts:[{url:"".concat(s,"-dsn.algolia.net"),accept:L.Read},{url:"".concat(s,".algolia.net"),accept:L.Write}].concat(F([{url:"".concat(s,"-1.algolianet.com")},{url:"".concat(s,"-2.algolianet.com")},{url:"".concat(s,"-3.algolianet.com")}]))},i),{},{headers:o(o(o({},l.headers()),{"content-type":"application/x-www-form-urlencoded"}),i.headers),queryParameters:o(o({},l.queryParameters()),i.queryParameters)}));return W({transporter:f,appId:s,addAlgoliaAgent:function(h,p){f.userAgent.add({segment:h,version:p})},clearCache:function(){return Promise.all([f.requestsCache.clear(),f.responsesCache.clear()]).then(function(){})}},i.methods)}(o(o({},u),{},{methods:{search:Se,searchForFacetValues:qe,multipleBatch:Ot,multipleGetObjects:It,multipleQueries:Se,copyIndex:te,copySettings:st,copySynonyms:ct,copyRules:ut,moveIndex:xt,listIndices:wt,getLogs:ht,listClusters:bt,multipleSearchForFacetValues:qe,getApiKey:X,addApiKey:nt,listApiKeys:vt,updateApiKey:Nt,deleteApiKey:lt,restoreApiKey:St,assignUserID:at,assignUserIDs:ot,getUserID:gt,searchUserIDs:Tt,listUserIDs:Pt,getTopUserIDs:mt,removeUserID:jt,hasPendingMappings:yt,clearDictionaryEntries:it,deleteDictionaryEntries:dt,getDictionarySettings:pt,getAppTask:De,replaceDictionaryEntries:Dt,saveDictionaryEntries:qt,searchDictionaryEntries:kt,setDictionarySettings:Et,waitAppTask:K,customRequest:ft,initIndex:function(i){return function(s){return $(i)(s,{methods:{batch:ke,delete:zt,findAnswers:Lt,getObject:Kt,getObjects:Gt,saveObject:rr,saveObjects:fe,search:Ae,searchForFacetValues:Re,waitTask:T,setSettings:or,getSettings:Ee,partialUpdateObject:Yt,partialUpdateObjects:Ne,deleteObject:Bt,deleteObjects:Te,deleteBy:Vt,clearObjects:Ct,browseObjects:At,getObjectPosition:Qt,findObject:Ht,exists:Wt,saveSynonym:ar,saveSynonyms:de,getSynonym:$t,searchSynonyms:Ce,browseSynonyms:_t,deleteSynonym:Mt,clearSynonyms:Ft,replaceAllObjects:Zt,replaceAllSynonyms:tr,searchRules:_e,getRule:Xt,deleteRule:Jt,saveRule:nr,saveRules:le,replaceAllRules:er,browseRules:Rt,clearRules:Ut}})}},initAnalytics:function(){return function(i){return function(s){var l=s.region||"us",f=v(B.WithinHeaders,s.appId,s.apiKey),h=ue(o(o({hosts:[{url:"analytics.".concat(l,".algolia.com")}]},s),{},{headers:o(o(o({},f.headers()),{"content-type":"application/json"}),s.headers),queryParameters:o(o({},f.queryParameters()),s.queryParameters)}));return W({appId:s.appId,transporter:h},s.methods)}(o(o(o({},a),i),{},{methods:{addABTest:Xe,getABTest:Ye,getABTests:Ze,stopABTest:et,deleteABTest:$e}}))}},initPersonalization:c,initRecommendation:function(){return function(i){return u.logger.info("The `initRecommendation` method is deprecated. Use `initPersonalization` instead."),c()(i)}}}}))}return Ue.version="4.19.1",Ue})})(Le);var xr=Le.exports;const Tr=lr(xr),Or=mr("i",{class:"fa-solid fa-book fa-beat-fade fa-xl"},null,-1),Ir=[Or],Er=Be({__name:"EmptyPage",emits:["visible"],setup(x,{emit:O}){const y=z(null),S=We(y);return ee(S,o=>{o&&O("visible",!0)}),(o,I)=>(Je(),Me("div",{class:"emptyPage flex items-center justify-center ba b--light-gray center",ref_key:"page",ref:y},Ir,512))}}),jr=Be({__name:"SinglePdfPage",props:{document:{type:Object,required:!0},page:{type:Number,required:!0},pageAnchor:{type:Number,default:0},highlight:{type:String,default:""},noScroll:{type:Boolean,default:!0},scale:{type:Number,default:.95}},emits:["loaded","visible"],setup(x,{emit:O}){const y=x,S=z(null),o=gr(null),I=We(S);ee(I,P=>{P&&O("visible")});const E=ye(()=>y.document?pr.get(window,"pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS",1):1);function _(P,v=0){if(o.value){const j=o.value.container.parentElement;v=y.pageAnchor||v||j.scrollTop,o.value.currentPageNumber=P,v&&(j.scrollTo({top:v}),setTimeout(()=>{j.scrollTo({top:v})},400))}}function V(P,v=0){if(o.value){const j=o.value.container.parentElement;v=y.pageAnchor||v||j.scrollTop,o.value.currentScale=P/E.value,v&&j.scrollTo({top:v})}}function C(){const P=window.pdfjsViewer;if(!S.value)return;const v=new P.EventBus,j={container:S.value.parentElement,viewer:S.value,eventBus:v,linkService:new P.PDFLinkService({eventBus:v}),findController:null,removePageBorders:!0};y.highlight&&(j.findController=new P.PDFFindController({eventBus:v,linkService:j.linkService}));const d=new P.PDFSinglePageViewer(j);j.linkService.setViewer(d),v.on("pagesinit",()=>{V(y.scale),y.highlight?v.dispatch("find",{type:"",query:y.highlight,phraseSearch:!0,highlightAll:!0}):_(y.page),O("loaded")}),v.on("updatefindcontrolstate",({source:F})=>{F._offset.pageIdx!==y.page-1&&setTimeout(()=>{_(y.page)})}),v.on("updatetextlayermatches",()=>{d.currentPageNumber!==y.page&&d._setCurrentPageNumber(y.page)}),d.setDocument(y.document),j.linkService.setDocument(y.document,null),o.value=d}return ze(C),ee(()=>y.scale,P=>{o.value&&V(P)}),(P,v)=>(Je(),Me("div",{class:"sip pdfViewer",ref_key:"pageEle",ref:S},null,512))}});const Nr=yr(jr,[["__scopeId","data-v-2b2a6407"]]);export{Er as _,Tr as a,Nr as b,qr as c,kr as d,br as u};
