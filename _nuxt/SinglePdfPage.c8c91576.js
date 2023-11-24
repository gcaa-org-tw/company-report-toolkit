import{g as tr,c as rr,_ as nr}from"./lodash.512a68f9.js";import{a as Ne}from"./index.8089a7a1.js";import{f as Ee,r as Ae,z as fe,o as Re,c as _e,a as ar,E as or,h as ir,l as ur,_ as sr}from"./entry.0f2fa65d.js";var Ce={exports:{}};/*! algoliasearch.umd.js | 4.19.1 | © Algolia, inc. | https://github.com/algolia/algoliasearch-client-javascript */(function(Q,M){(function(O,N){Q.exports=N()})(rr,function(){function O(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function N(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?N(Object(r),!0).forEach(function(n){O(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):N(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function j(e,t){if(e==null)return{};var r,n,a=function(c,o){if(c==null)return{};var s,l,f={},p=Object.keys(c);for(l=0;l<p.length;l++)s=p[l],o.indexOf(s)>=0||(f[s]=c[s]);return f}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}function E(e,t){return function(r){if(Array.isArray(r))return r}(e)||function(r,n){if(Symbol.iterator in Object(r)||Object.prototype.toString.call(r)==="[object Arguments]"){var a=[],u=!0,c=!1,o=void 0;try{for(var s,l=r[Symbol.iterator]();!(u=(s=l.next()).done)&&(a.push(s.value),!n||a.length!==n);u=!0);}catch(f){c=!0,o=f}finally{try{u||l.return==null||l.return()}finally{if(c)throw o}}return a}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function R(e){return function(t){if(Array.isArray(t)){for(var r=0,n=new Array(t.length);r<t.length;r++)n[r]=t[r];return n}}(e)||function(t){if(Symbol.iterator in Object(t)||Object.prototype.toString.call(t)==="[object Arguments]")return Array.from(t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function X(e){var t,r="algoliasearch-client-js-".concat(e.key),n=function(){return t===void 0&&(t=e.localStorage||window.localStorage),t},a=function(){return JSON.parse(n().getItem(r)||"{}")},u=function(o){n().setItem(r,JSON.stringify(o))},c=function(){var o=e.timeToLive?1e3*e.timeToLive:null,s=a(),l=Object.fromEntries(Object.entries(s).filter(function(p){return E(p,2)[1].timestamp!==void 0}));if(u(l),o){var f=Object.fromEntries(Object.entries(l).filter(function(p){var d=E(p,2)[1],y=new Date().getTime();return!(d.timestamp+o<y)}));u(f)}};return{get:function(o,s){var l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}};return Promise.resolve().then(function(){c();var f=JSON.stringify(o);return a()[f]}).then(function(f){return Promise.all([f?f.value:s(),f!==void 0])}).then(function(f){var p=E(f,2),d=p[0],y=p[1];return Promise.all([d,y||l.miss(d)])}).then(function(f){return E(f,1)[0]})},set:function(o,s){return Promise.resolve().then(function(){var l=a();return l[JSON.stringify(o)]={timestamp:new Date().getTime(),value:s},n().setItem(r,JSON.stringify(l)),s})},delete:function(o){return Promise.resolve().then(function(){var s=a();delete s[JSON.stringify(o)],n().setItem(r,JSON.stringify(s))})},clear:function(){return Promise.resolve().then(function(){n().removeItem(r)})}}}function C(e){var t=R(e.caches),r=t.shift();return r===void 0?{get:function(n,a){var u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}},c=a();return c.then(function(o){return Promise.all([o,u.miss(o)])}).then(function(o){return E(o,1)[0]})},set:function(n,a){return Promise.resolve(a)},delete:function(n){return Promise.resolve()},clear:function(){return Promise.resolve()}}:{get:function(n,a){var u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}};return r.get(n,a,u).catch(function(){return C({caches:t}).get(n,a,u)})},set:function(n,a){return r.set(n,a).catch(function(){return C({caches:t}).set(n,a)})},delete:function(n){return r.delete(n).catch(function(){return C({caches:t}).delete(n)})},clear:function(){return r.clear().catch(function(){return C({caches:t}).clear()})}}}function S(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{serializable:!0},t={};return{get:function(r,n){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{miss:function(){return Promise.resolve()}},u=JSON.stringify(r);if(u in t)return Promise.resolve(e.serializable?JSON.parse(t[u]):t[u]);var c=n(),o=a&&a.miss||function(){return Promise.resolve()};return c.then(function(s){return o(s)}).then(function(){return c})},set:function(r,n){return t[JSON.stringify(r)]=e.serializable?JSON.stringify(n):n,Promise.resolve(n)},delete:function(r){return delete t[JSON.stringify(r)],Promise.resolve()},clear:function(){return t={},Promise.resolve()}}}function P(e,t,r){var n={"x-algolia-api-key":r,"x-algolia-application-id":t};return{headers:function(){return e===H.WithinHeaders?n:{}},queryParameters:function(){return e===H.WithinQueryParameters?n:{}}}}function D(e){var t=0;return e(function r(){return t++,new Promise(function(n){setTimeout(function(){n(e(r))},Math.min(100*t,1e3))})})}function g(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:function(r,n){return Promise.resolve()};return Object.assign(e,{wait:function(r){return g(e.then(function(n){return Promise.all([t(n,r),n])}).then(function(n){return n[1]}))}})}function ee(e){for(var t=e.length-1;t>0;t--){var r=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[r],e[r]=n}return e}function $(e,t){return t&&Object.keys(t).forEach(function(r){e[r]=t[r](e)}),e}function m(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];var a=0;return e.replace(/%s/g,function(){return encodeURIComponent(r[a++])})}var H={WithinQueryParameters:0,WithinHeaders:1};function A(e,t){var r=e||{},n=r.data||{};return Object.keys(r).forEach(function(a){["timeout","headers","queryParameters","data","cacheable"].indexOf(a)===-1&&(n[a]=r[a])}),{data:Object.entries(n).length>0?n:void 0,timeout:r.timeout||t,headers:r.headers||{},queryParameters:r.queryParameters||{},cacheable:r.cacheable}}var F={Read:1,Write:2,Any:3},le=1,Ue=2,de=3;function pe(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:le;return i(i({},e),{},{status:t,lastUpdate:Date.now()})}function me(e){return typeof e=="string"?{protocol:"https",url:e,accept:F.Any}:{protocol:e.protocol||"https",url:e.url,accept:e.accept||F.Any}}var z="DELETE",x="GET",v="POST",te="PUT";function Fe(e,t){return Promise.all(t.map(function(r){return e.get(r,function(){return Promise.resolve(pe(r))})})).then(function(r){var n=r.filter(function(c){return function(o){return o.status===le||Date.now()-o.lastUpdate>12e4}(c)}),a=r.filter(function(c){return function(o){return o.status===de&&Date.now()-o.lastUpdate<=12e4}(c)}),u=[].concat(R(n),R(a));return{getTimeout:function(c,o){return(a.length===0&&c===0?1:a.length+3+c)*o},statelessHosts:u.length>0?u.map(function(c){return me(c)}):t}})}function he(e,t,r,n){var a=[],u=function(d,y){if(!(d.method===x||d.data===void 0&&y.data===void 0)){var h=Array.isArray(d.data)?d.data:i(i({},d.data),y.data);return JSON.stringify(h)}}(r,n),c=function(d,y){var h=i(i({},d.headers),y.headers),b={};return Object.keys(h).forEach(function(w){var k=h[w];b[w.toLowerCase()]=k}),b}(e,n),o=r.method,s=r.method!==x?{}:i(i({},r.data),n.data),l=i(i(i({"x-algolia-agent":e.userAgent.value},e.queryParameters),s),n.queryParameters),f=0,p=function d(y,h){var b=y.pop();if(b===void 0)throw{name:"RetryError",message:"Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.",transporterStackTrace:ye(a)};var w={data:u,headers:c,method:o,url:Je(b,r.path,l),connectTimeout:h(f,e.timeouts.connect),responseTimeout:h(f,n.timeout)},k=function(T){var q={request:w,response:T,host:b,triesLeft:y.length};return a.push(q),q},W={onSuccess:function(T){return function(q){try{return JSON.parse(q.content)}catch(U){throw function(_,B){return{name:"DeserializationError",message:_,response:B}}(U.message,q)}}(T)},onRetry:function(T){var q=k(T);return T.isTimedOut&&f++,Promise.all([e.logger.info("Retryable failure",ve(q)),e.hostsCache.set(b,pe(b,T.isTimedOut?de:Ue))]).then(function(){return d(y,h)})},onFail:function(T){throw k(T),function(q,U){var _=q.content,B=q.status,G=_;try{G=JSON.parse(_).message}catch{}return function(Z,ce,er){return{name:"ApiError",message:Z,status:ce,transporterStackTrace:er}}(G,B,U)}(T,ye(a))}};return e.requester.send(w).then(function(T){return function(q,U){return function(_){var B=_.status;return _.isTimedOut||function(G){var Z=G.isTimedOut,ce=G.status;return!Z&&~~ce==0}(_)||~~(B/100)!=2&&~~(B/100)!=4}(q)?U.onRetry(q):~~(q.status/100)==2?U.onSuccess(q):U.onFail(q)}(T,W)})};return Fe(e.hostsCache,t).then(function(d){return p(R(d.statelessHosts).reverse(),d.getTimeout)})}function re(e){var t=e.hostsCache,r=e.logger,n=e.requester,a=e.requestsCache,u=e.responsesCache,c=e.timeouts,o=e.userAgent,s=e.hosts,l=e.queryParameters,f={hostsCache:t,logger:r,requester:n,requestsCache:a,responsesCache:u,timeouts:c,userAgent:o,headers:e.headers,queryParameters:l,hosts:s.map(function(p){return me(p)}),read:function(p,d){var y=A(d,f.timeouts.read),h=function(){return he(f,f.hosts.filter(function(w){return(w.accept&F.Read)!=0}),p,y)};if((y.cacheable!==void 0?y.cacheable:p.cacheable)!==!0)return h();var b={request:p,mappedRequestOptions:y,transporter:{queryParameters:f.queryParameters,headers:f.headers}};return f.responsesCache.get(b,function(){return f.requestsCache.get(b,function(){return f.requestsCache.set(b,h()).then(function(w){return Promise.all([f.requestsCache.delete(b),w])},function(w){return Promise.all([f.requestsCache.delete(b),Promise.reject(w)])}).then(function(w){var k=E(w,2);return k[0],k[1]})})},{miss:function(w){return f.responsesCache.set(b,w)}})},write:function(p,d){return he(f,f.hosts.filter(function(y){return(y.accept&F.Write)!=0}),p,A(d,f.timeouts.write))}};return f}function ze(e){var t={value:"Algolia for JavaScript (".concat(e,")"),add:function(r){var n="; ".concat(r.segment).concat(r.version!==void 0?" (".concat(r.version,")"):"");return t.value.indexOf(n)===-1&&(t.value="".concat(t.value).concat(n)),t}};return t}function Je(e,t,r){var n=ge(r),a="".concat(e.protocol,"://").concat(e.url,"/").concat(t.charAt(0)==="/"?t.substr(1):t);return n.length&&(a+="?".concat(n)),a}function ge(e){return Object.keys(e).map(function(t){return m("%s=%s",t,(r=e[t],Object.prototype.toString.call(r)==="[object Object]"||Object.prototype.toString.call(r)==="[object Array]"?JSON.stringify(e[t]):e[t]));var r}).join("&")}function ye(e){return e.map(function(t){return ve(t)})}function ve(e){var t=e.request.headers["x-algolia-api-key"]?{"x-algolia-api-key":"*****"}:{};return i(i({},e),{},{request:i(i({},e.request),{},{headers:i(i({},e.request.headers),t)})})}var Ve=function(e){return function(t,r){return e.transporter.write({method:v,path:"2/abtests",data:t},r)}},Be=function(e){return function(t,r){return e.transporter.write({method:z,path:m("2/abtests/%s",t)},r)}},Me=function(e){return function(t,r){return e.transporter.read({method:x,path:m("2/abtests/%s",t)},r)}},He=function(e){return function(t){return e.transporter.read({method:x,path:"2/abtests"},t)}},Ke=function(e){return function(t,r){return e.transporter.write({method:v,path:m("2/abtests/%s/stop",t)},r)}},Le=function(e){return function(t){return e.transporter.read({method:x,path:"1/strategies/personalization"},t)}},We=function(e){return function(t,r){return e.transporter.write({method:v,path:"1/strategies/personalization",data:t},r)}};function ne(e){return function t(r){return e.request(r).then(function(n){if(e.batch!==void 0&&e.batch(n.hits),!e.shouldStop(n))return n.cursor?t({cursor:n.cursor}):t({page:(r.page||0)+1})})}({})}var Ge=function(e){return function(t,r){var n=r||{},a=n.queryParameters,u=j(n,["queryParameters"]),c=i({acl:t},a!==void 0?{queryParameters:a}:{});return g(e.transporter.write({method:v,path:"1/keys",data:c},u),function(o,s){return D(function(l){return K(e)(o.key,s).catch(function(f){if(f.status!==404)throw f;return l()})})})}},Qe=function(e){return function(t,r,n){var a=A(n);return a.queryParameters["X-Algolia-User-ID"]=t,e.transporter.write({method:v,path:"1/clusters/mapping",data:{cluster:r}},a)}},Xe=function(e){return function(t,r,n){return e.transporter.write({method:v,path:"1/clusters/mapping/batch",data:{users:t,cluster:r}},n)}},$e=function(e){return function(t,r){return g(e.transporter.write({method:v,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!0,requests:{action:"addEntry",body:[]}}},r),function(n,a){return J(e)(n.taskID,a)})}},Y=function(e){return function(t,r,n){return g(e.transporter.write({method:v,path:m("1/indexes/%s/operation",t),data:{operation:"copy",destination:r}},n),function(a,u){return L(e)(t,{methods:{waitTask:I}}).waitTask(a.taskID,u)})}},Ye=function(e){return function(t,r,n){return Y(e)(t,r,i(i({},n),{},{scope:[se.Rules]}))}},Ze=function(e){return function(t,r,n){return Y(e)(t,r,i(i({},n),{},{scope:[se.Settings]}))}},et=function(e){return function(t,r,n){return Y(e)(t,r,i(i({},n),{},{scope:[se.Synonyms]}))}},tt=function(e){return function(t,r){return t.method===x?e.transporter.read(t,r):e.transporter.write(t,r)}},rt=function(e){return function(t,r){return g(e.transporter.write({method:z,path:m("1/keys/%s",t)},r),function(n,a){return D(function(u){return K(e)(t,a).then(u).catch(function(c){if(c.status!==404)throw c})})})}},nt=function(e){return function(t,r,n){var a=r.map(function(u){return{action:"deleteEntry",body:{objectID:u}}});return g(e.transporter.write({method:v,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!1,requests:a}},n),function(u,c){return J(e)(u.taskID,c)})}},K=function(e){return function(t,r){return e.transporter.read({method:x,path:m("1/keys/%s",t)},r)}},be=function(e){return function(t,r){return e.transporter.read({method:x,path:m("1/task/%s",t.toString())},r)}},at=function(e){return function(t){return e.transporter.read({method:x,path:"/1/dictionaries/*/settings"},t)}},ot=function(e){return function(t){return e.transporter.read({method:x,path:"1/logs"},t)}},it=function(e){return function(t){return e.transporter.read({method:x,path:"1/clusters/mapping/top"},t)}},ut=function(e){return function(t,r){return e.transporter.read({method:x,path:m("1/clusters/mapping/%s",t)},r)}},st=function(e){return function(t){var r=t||{},n=r.retrieveMappings,a=j(r,["retrieveMappings"]);return n===!0&&(a.getClusters=!0),e.transporter.read({method:x,path:"1/clusters/mapping/pending"},a)}},L=function(e){return function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n={transporter:e.transporter,appId:e.appId,indexName:t};return $(n,r.methods)}},ct=function(e){return function(t){return e.transporter.read({method:x,path:"1/keys"},t)}},ft=function(e){return function(t){return e.transporter.read({method:x,path:"1/clusters"},t)}},lt=function(e){return function(t){return e.transporter.read({method:x,path:"1/indexes"},t)}},dt=function(e){return function(t){return e.transporter.read({method:x,path:"1/clusters/mapping"},t)}},pt=function(e){return function(t,r,n){return g(e.transporter.write({method:v,path:m("1/indexes/%s/operation",t),data:{operation:"move",destination:r}},n),function(a,u){return L(e)(t,{methods:{waitTask:I}}).waitTask(a.taskID,u)})}},mt=function(e){return function(t,r){return g(e.transporter.write({method:v,path:"1/indexes/*/batch",data:{requests:t}},r),function(n,a){return Promise.all(Object.keys(n.taskID).map(function(u){return L(e)(u,{methods:{waitTask:I}}).waitTask(n.taskID[u],a)}))})}},ht=function(e){return function(t,r){return e.transporter.read({method:v,path:"1/indexes/*/objects",data:{requests:t}},r)}},Pe=function(e){return function(t,r){var n=t.map(function(a){return i(i({},a),{},{params:ge(a.params||{})})});return e.transporter.read({method:v,path:"1/indexes/*/queries",data:{requests:n},cacheable:!0},r)}},we=function(e){return function(t,r){return Promise.all(t.map(function(n){var a=n.params,u=a.facetName,c=a.facetQuery,o=j(a,["facetName","facetQuery"]);return L(e)(n.indexName,{methods:{searchForFacetValues:Se}}).searchForFacetValues(u,c,i(i({},r),o))}))}},gt=function(e){return function(t,r){var n=A(r);return n.queryParameters["X-Algolia-User-ID"]=t,e.transporter.write({method:z,path:"1/clusters/mapping"},n)}},yt=function(e){return function(t,r,n){var a=r.map(function(u){return{action:"addEntry",body:u}});return g(e.transporter.write({method:v,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!0,requests:a}},n),function(u,c){return J(e)(u.taskID,c)})}},vt=function(e){return function(t,r){return g(e.transporter.write({method:v,path:m("1/keys/%s/restore",t)},r),function(n,a){return D(function(u){return K(e)(t,a).catch(function(c){if(c.status!==404)throw c;return u()})})})}},bt=function(e){return function(t,r,n){var a=r.map(function(u){return{action:"addEntry",body:u}});return g(e.transporter.write({method:v,path:m("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!1,requests:a}},n),function(u,c){return J(e)(u.taskID,c)})}},Pt=function(e){return function(t,r,n){return e.transporter.read({method:v,path:m("/1/dictionaries/%s/search",t),data:{query:r},cacheable:!0},n)}},wt=function(e){return function(t,r){return e.transporter.read({method:v,path:"1/clusters/mapping/search",data:{query:t}},r)}},xt=function(e){return function(t,r){return g(e.transporter.write({method:te,path:"/1/dictionaries/*/settings",data:t},r),function(n,a){return J(e)(n.taskID,a)})}},Ot=function(e){return function(t,r){var n=Object.assign({},r),a=r||{},u=a.queryParameters,c=j(a,["queryParameters"]),o=u?{queryParameters:u}:{},s=["acl","indexes","referers","restrictSources","queryParameters","description","maxQueriesPerIPPerHour","maxHitsPerQuery"];return g(e.transporter.write({method:te,path:m("1/keys/%s",t),data:o},c),function(l,f){return D(function(p){return K(e)(t,f).then(function(d){return function(y){return Object.keys(n).filter(function(h){return s.indexOf(h)!==-1}).every(function(h){if(Array.isArray(y[h])&&Array.isArray(n[h])){var b=y[h];return b.length===n[h].length&&b.every(function(w,k){return w===n[h][k]})}return y[h]===n[h]})}(d)?Promise.resolve():p()})})})}},J=function(e){return function(t,r){return D(function(n){return be(e)(t,r).then(function(a){return a.status!=="published"?n():void 0})})}},xe=function(e){return function(t,r){return g(e.transporter.write({method:v,path:m("1/indexes/%s/batch",e.indexName),data:{requests:t}},r),function(n,a){return I(e)(n.taskID,a)})}},jt=function(e){return function(t){return ne(i(i({shouldStop:function(r){return r.cursor===void 0}},t),{},{request:function(r){return e.transporter.read({method:v,path:m("1/indexes/%s/browse",e.indexName),data:r},t)}}))}},It=function(e){return function(t){var r=i({hitsPerPage:1e3},t);return ne(i(i({shouldStop:function(n){return n.hits.length<r.hitsPerPage}},r),{},{request:function(n){return qe(e)("",i(i({},r),n)).then(function(a){return i(i({},a),{},{hits:a.hits.map(function(u){return delete u._highlightResult,u})})})}}))}},Dt=function(e){return function(t){var r=i({hitsPerPage:1e3},t);return ne(i(i({shouldStop:function(n){return n.hits.length<r.hitsPerPage}},r),{},{request:function(n){return ke(e)("",i(i({},r),n)).then(function(a){return i(i({},a),{},{hits:a.hits.map(function(u){return delete u._highlightResult,u})})})}}))}},ae=function(e){return function(t,r,n){var a=n||{},u=a.batchSize,c=j(a,["batchSize"]),o={taskIDs:[],objectIDs:[]};return g(function s(){var l,f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,p=[];for(l=f;l<t.length&&(p.push(t[l]),p.length!==(u||1e3));l++);return p.length===0?Promise.resolve(o):xe(e)(p.map(function(d){return{action:r,body:d}}),c).then(function(d){return o.objectIDs=o.objectIDs.concat(d.objectIDs),o.taskIDs.push(d.taskID),l++,s(l)})}(),function(s,l){return Promise.all(s.taskIDs.map(function(f){return I(e)(f,l)}))})}},St=function(e){return function(t){return g(e.transporter.write({method:v,path:m("1/indexes/%s/clear",e.indexName)},t),function(r,n){return I(e)(r.taskID,n)})}},qt=function(e){return function(t){var r=t||{},n=r.forwardToReplicas,a=A(j(r,["forwardToReplicas"]));return n&&(a.queryParameters.forwardToReplicas=1),g(e.transporter.write({method:v,path:m("1/indexes/%s/rules/clear",e.indexName)},a),function(u,c){return I(e)(u.taskID,c)})}},kt=function(e){return function(t){var r=t||{},n=r.forwardToReplicas,a=A(j(r,["forwardToReplicas"]));return n&&(a.queryParameters.forwardToReplicas=1),g(e.transporter.write({method:v,path:m("1/indexes/%s/synonyms/clear",e.indexName)},a),function(u,c){return I(e)(u.taskID,c)})}},Tt=function(e){return function(t,r){return g(e.transporter.write({method:v,path:m("1/indexes/%s/deleteByQuery",e.indexName),data:t},r),function(n,a){return I(e)(n.taskID,a)})}},Nt=function(e){return function(t){return g(e.transporter.write({method:z,path:m("1/indexes/%s",e.indexName)},t),function(r,n){return I(e)(r.taskID,n)})}},Et=function(e){return function(t,r){return g(Oe(e)([t],r).then(function(n){return{taskID:n.taskIDs[0]}}),function(n,a){return I(e)(n.taskID,a)})}},Oe=function(e){return function(t,r){var n=t.map(function(a){return{objectID:a}});return ae(e)(n,V.DeleteObject,r)}},At=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=A(j(n,["forwardToReplicas"]));return a&&(u.queryParameters.forwardToReplicas=1),g(e.transporter.write({method:z,path:m("1/indexes/%s/rules/%s",e.indexName,t)},u),function(c,o){return I(e)(c.taskID,o)})}},Rt=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=A(j(n,["forwardToReplicas"]));return a&&(u.queryParameters.forwardToReplicas=1),g(e.transporter.write({method:z,path:m("1/indexes/%s/synonyms/%s",e.indexName,t)},u),function(c,o){return I(e)(c.taskID,o)})}},_t=function(e){return function(t){return je(e)(t).then(function(){return!0}).catch(function(r){if(r.status!==404)throw r;return!1})}},Ct=function(e){return function(t,r,n){return e.transporter.read({method:v,path:m("1/answers/%s/prediction",e.indexName),data:{query:t,queryLanguages:r},cacheable:!0},n)}},Ut=function(e){return function(t,r){var n=r||{},a=n.query,u=n.paginate,c=j(n,["query","paginate"]),o=0;return function s(){return De(e)(a||"",i(i({},c),{},{page:o})).then(function(l){for(var f=0,p=Object.entries(l.hits);f<p.length;f++){var d=E(p[f],2),y=d[0],h=d[1];if(t(h))return{object:h,position:parseInt(y,10),page:o}}if(o++,u===!1||o>=l.nbPages)throw{name:"ObjectNotFoundError",message:"Object not found."};return s()})}()}},Ft=function(e){return function(t,r){return e.transporter.read({method:x,path:m("1/indexes/%s/%s",e.indexName,t)},r)}},zt=function(){return function(e,t){for(var r=0,n=Object.entries(e.hits);r<n.length;r++){var a=E(n[r],2),u=a[0];if(a[1].objectID===t)return parseInt(u,10)}return-1}},Jt=function(e){return function(t,r){var n=r||{},a=n.attributesToRetrieve,u=j(n,["attributesToRetrieve"]),c=t.map(function(o){return i({indexName:e.indexName,objectID:o},a?{attributesToRetrieve:a}:{})});return e.transporter.read({method:v,path:"1/indexes/*/objects",data:{requests:c}},u)}},Vt=function(e){return function(t,r){return e.transporter.read({method:x,path:m("1/indexes/%s/rules/%s",e.indexName,t)},r)}},je=function(e){return function(t){return e.transporter.read({method:x,path:m("1/indexes/%s/settings",e.indexName),data:{getVersion:2}},t)}},Bt=function(e){return function(t,r){return e.transporter.read({method:x,path:m("1/indexes/%s/synonyms/%s",e.indexName,t)},r)}},Mt=function(e){return function(t,r){return g(Ie(e)([t],r).then(function(n){return{objectID:n.objectIDs[0],taskID:n.taskIDs[0]}}),function(n,a){return I(e)(n.taskID,a)})}},Ie=function(e){return function(t,r){var n=r||{},a=n.createIfNotExists,u=j(n,["createIfNotExists"]),c=a?V.PartialUpdateObject:V.PartialUpdateObjectNoCreate;return ae(e)(t,c,u)}},Ht=function(e){return function(t,r){var n=r||{},a=n.safe,u=n.autoGenerateObjectIDIfNotExist,c=n.batchSize,o=j(n,["safe","autoGenerateObjectIDIfNotExist","batchSize"]),s=function(h,b,w,k){return g(e.transporter.write({method:v,path:m("1/indexes/%s/operation",h),data:{operation:w,destination:b}},k),function(W,T){return I(e)(W.taskID,T)})},l=Math.random().toString(36).substring(7),f="".concat(e.indexName,"_tmp_").concat(l),p=oe({appId:e.appId,transporter:e.transporter,indexName:f}),d=[],y=s(e.indexName,f,"copy",i(i({},o),{},{scope:["settings","synonyms","rules"]}));return d.push(y),g((a?y.wait(o):y).then(function(){var h=p(t,i(i({},o),{},{autoGenerateObjectIDIfNotExist:u,batchSize:c}));return d.push(h),a?h.wait(o):h}).then(function(){var h=s(f,e.indexName,"move",o);return d.push(h),a?h.wait(o):h}).then(function(){return Promise.all(d)}).then(function(h){var b=E(h,3),w=b[0],k=b[1],W=b[2];return{objectIDs:k.objectIDs,taskIDs:[w.taskID].concat(R(k.taskIDs),[W.taskID])}}),function(h,b){return Promise.all(d.map(function(w){return w.wait(b)}))})}},Kt=function(e){return function(t,r){return ie(e)(t,i(i({},r),{},{clearExistingRules:!0}))}},Lt=function(e){return function(t,r){return ue(e)(t,i(i({},r),{},{clearExistingSynonyms:!0}))}},Wt=function(e){return function(t,r){return g(oe(e)([t],r).then(function(n){return{objectID:n.objectIDs[0],taskID:n.taskIDs[0]}}),function(n,a){return I(e)(n.taskID,a)})}},oe=function(e){return function(t,r){var n=r||{},a=n.autoGenerateObjectIDIfNotExist,u=j(n,["autoGenerateObjectIDIfNotExist"]),c=a?V.AddObject:V.UpdateObject;if(c===V.UpdateObject){var o=!0,s=!1,l=void 0;try{for(var f,p=t[Symbol.iterator]();!(o=(f=p.next()).done);o=!0)if(f.value.objectID===void 0)return g(Promise.reject({name:"MissingObjectIDError",message:"All objects must have an unique objectID (like a primary key) to be valid. Algolia is also able to generate objectIDs automatically but *it's not recommended*. To do it, use the `{'autoGenerateObjectIDIfNotExist': true}` option."}))}catch(d){s=!0,l=d}finally{try{o||p.return==null||p.return()}finally{if(s)throw l}}}return ae(e)(t,c,u)}},Gt=function(e){return function(t,r){return ie(e)([t],r)}},ie=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=n.clearExistingRules,c=A(j(n,["forwardToReplicas","clearExistingRules"]));return a&&(c.queryParameters.forwardToReplicas=1),u&&(c.queryParameters.clearExistingRules=1),g(e.transporter.write({method:v,path:m("1/indexes/%s/rules/batch",e.indexName),data:t},c),function(o,s){return I(e)(o.taskID,s)})}},Qt=function(e){return function(t,r){return ue(e)([t],r)}},ue=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=n.clearExistingSynonyms,c=n.replaceExistingSynonyms,o=A(j(n,["forwardToReplicas","clearExistingSynonyms","replaceExistingSynonyms"]));return a&&(o.queryParameters.forwardToReplicas=1),(c||u)&&(o.queryParameters.replaceExistingSynonyms=1),g(e.transporter.write({method:v,path:m("1/indexes/%s/synonyms/batch",e.indexName),data:t},o),function(s,l){return I(e)(s.taskID,l)})}},De=function(e){return function(t,r){return e.transporter.read({method:v,path:m("1/indexes/%s/query",e.indexName),data:{query:t},cacheable:!0},r)}},Se=function(e){return function(t,r,n){return e.transporter.read({method:v,path:m("1/indexes/%s/facets/%s/query",e.indexName,t),data:{facetQuery:r},cacheable:!0},n)}},qe=function(e){return function(t,r){return e.transporter.read({method:v,path:m("1/indexes/%s/rules/search",e.indexName),data:{query:t}},r)}},ke=function(e){return function(t,r){return e.transporter.read({method:v,path:m("1/indexes/%s/synonyms/search",e.indexName),data:{query:t}},r)}},Xt=function(e){return function(t,r){var n=r||{},a=n.forwardToReplicas,u=A(j(n,["forwardToReplicas"]));return a&&(u.queryParameters.forwardToReplicas=1),g(e.transporter.write({method:te,path:m("1/indexes/%s/settings",e.indexName),data:t},u),function(c,o){return I(e)(c.taskID,o)})}},I=function(e){return function(t,r){return D(function(n){return function(a){return function(u,c){return a.transporter.read({method:x,path:m("1/indexes/%s/task/%s",a.indexName,u.toString())},c)}}(e)(t,r).then(function(a){return a.status!=="published"?n():void 0})})}},V={AddObject:"addObject",UpdateObject:"updateObject",PartialUpdateObject:"partialUpdateObject",PartialUpdateObjectNoCreate:"partialUpdateObjectNoCreate",DeleteObject:"deleteObject",DeleteIndex:"delete",ClearIndex:"clear"},se={Settings:"settings",Synonyms:"synonyms",Rules:"rules"},$t=1,Yt=2,Zt=3;function Te(e,t,r){var n,a={appId:e,apiKey:t,timeouts:{connect:1,read:2,write:30},requester:{send:function(o){return new Promise(function(s){var l=new XMLHttpRequest;l.open(o.method,o.url,!0),Object.keys(o.headers).forEach(function(y){return l.setRequestHeader(y,o.headers[y])});var f,p=function(y,h){return setTimeout(function(){l.abort(),s({status:0,content:h,isTimedOut:!0})},1e3*y)},d=p(o.connectTimeout,"Connection timeout");l.onreadystatechange=function(){l.readyState>l.OPENED&&f===void 0&&(clearTimeout(d),f=p(o.responseTimeout,"Socket timeout"))},l.onerror=function(){l.status===0&&(clearTimeout(d),clearTimeout(f),s({content:l.responseText||"Network request failed",status:l.status,isTimedOut:!1}))},l.onload=function(){clearTimeout(d),clearTimeout(f),s({content:l.responseText,status:l.status,isTimedOut:!1})},l.send(o.data)})}},logger:(n=Zt,{debug:function(o,s){return $t>=n&&console.debug(o,s),Promise.resolve()},info:function(o,s){return Yt>=n&&console.info(o,s),Promise.resolve()},error:function(o,s){return console.error(o,s),Promise.resolve()}}),responsesCache:S(),requestsCache:S({serializable:!1}),hostsCache:C({caches:[X({key:"".concat("4.19.1","-").concat(e)}),S()]}),userAgent:ze("4.19.1").add({segment:"Browser"})},u=i(i({},a),r),c=function(){return function(o){return function(s){var l=s.region||"us",f=P(H.WithinHeaders,s.appId,s.apiKey),p=re(i(i({hosts:[{url:"personalization.".concat(l,".algolia.com")}]},s),{},{headers:i(i(i({},f.headers()),{"content-type":"application/json"}),s.headers),queryParameters:i(i({},f.queryParameters()),s.queryParameters)}));return $({appId:s.appId,transporter:p},s.methods)}(i(i(i({},a),o),{},{methods:{getPersonalizationStrategy:Le,setPersonalizationStrategy:We}}))}};return function(o){var s=o.appId,l=P(o.authMode!==void 0?o.authMode:H.WithinHeaders,s,o.apiKey),f=re(i(i({hosts:[{url:"".concat(s,"-dsn.algolia.net"),accept:F.Read},{url:"".concat(s,".algolia.net"),accept:F.Write}].concat(ee([{url:"".concat(s,"-1.algolianet.com")},{url:"".concat(s,"-2.algolianet.com")},{url:"".concat(s,"-3.algolianet.com")}]))},o),{},{headers:i(i(i({},l.headers()),{"content-type":"application/x-www-form-urlencoded"}),o.headers),queryParameters:i(i({},l.queryParameters()),o.queryParameters)}));return $({transporter:f,appId:s,addAlgoliaAgent:function(p,d){f.userAgent.add({segment:p,version:d})},clearCache:function(){return Promise.all([f.requestsCache.clear(),f.responsesCache.clear()]).then(function(){})}},o.methods)}(i(i({},u),{},{methods:{search:Pe,searchForFacetValues:we,multipleBatch:mt,multipleGetObjects:ht,multipleQueries:Pe,copyIndex:Y,copySettings:Ze,copySynonyms:et,copyRules:Ye,moveIndex:pt,listIndices:lt,getLogs:ot,listClusters:ft,multipleSearchForFacetValues:we,getApiKey:K,addApiKey:Ge,listApiKeys:ct,updateApiKey:Ot,deleteApiKey:rt,restoreApiKey:vt,assignUserID:Qe,assignUserIDs:Xe,getUserID:ut,searchUserIDs:wt,listUserIDs:dt,getTopUserIDs:it,removeUserID:gt,hasPendingMappings:st,clearDictionaryEntries:$e,deleteDictionaryEntries:nt,getDictionarySettings:at,getAppTask:be,replaceDictionaryEntries:yt,saveDictionaryEntries:bt,searchDictionaryEntries:Pt,setDictionarySettings:xt,waitAppTask:J,customRequest:tt,initIndex:function(o){return function(s){return L(o)(s,{methods:{batch:xe,delete:Nt,findAnswers:Ct,getObject:Ft,getObjects:Jt,saveObject:Wt,saveObjects:oe,search:De,searchForFacetValues:Se,waitTask:I,setSettings:Xt,getSettings:je,partialUpdateObject:Mt,partialUpdateObjects:Ie,deleteObject:Et,deleteObjects:Oe,deleteBy:Tt,clearObjects:St,browseObjects:jt,getObjectPosition:zt,findObject:Ut,exists:_t,saveSynonym:Qt,saveSynonyms:ue,getSynonym:Bt,searchSynonyms:ke,browseSynonyms:Dt,deleteSynonym:Rt,clearSynonyms:kt,replaceAllObjects:Ht,replaceAllSynonyms:Lt,searchRules:qe,getRule:Vt,deleteRule:At,saveRule:Gt,saveRules:ie,replaceAllRules:Kt,browseRules:It,clearRules:qt}})}},initAnalytics:function(){return function(o){return function(s){var l=s.region||"us",f=P(H.WithinHeaders,s.appId,s.apiKey),p=re(i(i({hosts:[{url:"analytics.".concat(l,".algolia.com")}]},s),{},{headers:i(i(i({},f.headers()),{"content-type":"application/json"}),s.headers),queryParameters:i(i({},f.queryParameters()),s.queryParameters)}));return $({appId:s.appId,transporter:p},s.methods)}(i(i(i({},a),o),{},{methods:{addABTest:Ve,getABTest:Me,getABTests:He,stopABTest:Ke,deleteABTest:Be}}))}},initPersonalization:c,initRecommendation:function(){return function(o){return u.logger.info("The `initRecommendation` method is deprecated. Use `initPersonalization` instead."),c()(o)}}}}))}return Te.version="4.19.1",Te})})(Ce);var cr=Ce.exports;const gr=tr(cr),fr=ar("i",{class:"fa-solid fa-book fa-beat-fade fa-xl"},null,-1),lr=[fr],yr=Ee({__name:"EmptyPage",emits:["visible"],setup(Q,{emit:M}){const O=Ae(null),N=Ne(O);return fe(N,i=>{i&&M("visible",!0)}),(i,j)=>(Re(),_e("div",{class:"emptyPage flex items-center justify-center ba b--light-gray center",ref_key:"page",ref:O},lr,512))}}),dr=Ee({__name:"SinglePdfPage",props:{document:{type:Object,required:!0},page:{type:Number,required:!0},pageAnchor:{type:Number,default:0},highlight:{type:String,default:""},noScroll:{type:Boolean,default:!0},scale:{type:Number,default:.95}},emits:["loaded","visible"],setup(Q,{emit:M}){const O=Q,N=Ae(null),i=or(null),j=Ne(N);fe(j,S=>{S&&M("visible")});const E=ir(()=>O.document?nr.get(window,"pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS",1):1);function R(S,P=0){if(i.value){const D=i.value.container.parentElement;P=O.pageAnchor||P||D.scrollTop,i.value.currentPageNumber=S,P&&(D.scrollTo({top:P}),setTimeout(()=>{D.scrollTo({top:P})},400))}}function X(S,P=0){if(i.value){const D=i.value.container.parentElement;P=O.pageAnchor||P||D.scrollTop,i.value.currentScale=S/E.value,P&&D.scrollTo({top:P})}}function C(){const S=window.pdfjsViewer;if(!N.value)return;const P=new S.EventBus,D={container:N.value.parentElement,viewer:N.value,eventBus:P,linkService:new S.PDFLinkService({eventBus:P}),findController:null,removePageBorders:!0};O.highlight&&(D.findController=new S.PDFFindController({eventBus:P,linkService:D.linkService}));const g=new S.PDFSinglePageViewer(D);D.linkService.setViewer(g),P.on("pagesinit",()=>{X(O.scale),O.highlight?P.dispatch("find",{type:"",query:O.highlight,phraseSearch:!0,highlightAll:!0}):R(O.page),M("loaded")}),P.on("updatefindcontrolstate",({source:ee})=>{ee._offset.pageIdx!==O.page-1&&setTimeout(()=>{R(O.page)})}),P.on("updatetextlayermatches",()=>{g.currentPageNumber!==O.page&&g._setCurrentPageNumber(O.page)}),g.setDocument(O.document),D.linkService.setDocument(O.document,null),i.value=g}return ur(C),fe(()=>O.scale,S=>{i.value&&X(S)}),(S,P)=>(Re(),_e("div",{class:"sip pdfViewer",ref_key:"pageEle",ref:N},null,512))}});const vr=sr(dr,[["__scopeId","data-v-2b2a6407"]]);export{yr as _,gr as a,vr as b};
