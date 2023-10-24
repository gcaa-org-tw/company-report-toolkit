import{_ as ot,m as ct}from"./industryStats.4ceb6e34.js";import{_ as dt}from"./nuxt-link.1f8d63d9.js";import{g as lt,h as ft,r as Q,k as K,C as ht,j as F,o as N,c as z,a as p,t as W,b as X,F as tt,z as et,l as _t,f as mt,D as $t,G as vt,w as yt}from"./entry.69f41c1d.js";import{u as pt}from"./useProfessionApi.a87dff30.js";import{c as gt,g as Mt}from"./_commonjsHelpers.04ba399b.js";var nt={exports:{}};(function(w,rt){(function(Y,g){w.exports=g()})(gt,function(){var Y=1e3,g=6e4,S=36e5,M="millisecond",k="second",D="minute",b="hour",y="day",I="week",o="month",C="quarter",_="year",O="date",m="Invalid Date",q=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,it=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,at={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(r){var n=["th","st","nd","rd"],t=r%100;return"["+r+(n[(t-20)%10]||n[t]||n[0])+"]"}},J=function(r,n,t){var s=String(r);return!s||s.length>=n?r:""+Array(n+1-s.length).join(t)+r},ut={s:J,z:function(r){var n=-r.utcOffset(),t=Math.abs(n),s=Math.floor(t/60),e=t%60;return(n<=0?"+":"-")+J(s,2,"0")+":"+J(e,2,"0")},m:function r(n,t){if(n.date()<t.date())return-r(t,n);var s=12*(t.year()-n.year())+(t.month()-n.month()),e=n.clone().add(s,o),i=t-e<0,a=n.clone().add(s+(i?-1:1),o);return+(-(s+(t-e)/(i?e-a:a-e))||0)},a:function(r){return r<0?Math.ceil(r)||0:Math.floor(r)},p:function(r){return{M:o,y:_,w:I,d:y,D:O,h:b,m:D,s:k,ms:M,Q:C}[r]||String(r||"").toLowerCase().replace(/s$/,"")},u:function(r){return r===void 0}},V="en",H={};H[V]=at;var G="$isDayjsObject",Z=function(r){return r instanceof R||!(!r||!r[G])},B=function r(n,t,s){var e;if(!n)return V;if(typeof n=="string"){var i=n.toLowerCase();H[i]&&(e=i),t&&(H[i]=t,e=i);var a=n.split("-");if(!e&&a.length>1)return r(a[0])}else{var c=n.name;H[c]=n,e=c}return!s&&e&&(V=e),e||!s&&V},l=function(r,n){if(Z(r))return r.clone();var t=typeof n=="object"?n:{};return t.date=r,t.args=arguments,new R(t)},u=ut;u.l=B,u.i=Z,u.w=function(r,n){return l(r,{locale:n.$L,utc:n.$u,x:n.$x,$offset:n.$offset})};var R=function(){function r(t){this.$L=B(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[G]=!0}var n=r.prototype;return n.parse=function(t){this.$d=function(s){var e=s.date,i=s.utc;if(e===null)return new Date(NaN);if(u.u(e))return new Date;if(e instanceof Date)return new Date(e);if(typeof e=="string"&&!/Z$/i.test(e)){var a=e.match(q);if(a){var c=a[2]-1||0,d=(a[7]||"0").substring(0,3);return i?new Date(Date.UTC(a[1],c,a[3]||1,a[4]||0,a[5]||0,a[6]||0,d)):new Date(a[1],c,a[3]||1,a[4]||0,a[5]||0,a[6]||0,d)}}return new Date(e)}(t),this.init()},n.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},n.$utils=function(){return u},n.isValid=function(){return this.$d.toString()!==m},n.isSame=function(t,s){var e=l(t);return this.startOf(s)<=e&&e<=this.endOf(s)},n.isAfter=function(t,s){return l(t)<this.startOf(s)},n.isBefore=function(t,s){return this.endOf(s)<l(t)},n.$g=function(t,s,e){return u.u(t)?this[s]:this.set(e,t)},n.unix=function(){return Math.floor(this.valueOf()/1e3)},n.valueOf=function(){return this.$d.getTime()},n.startOf=function(t,s){var e=this,i=!!u.u(s)||s,a=u.p(t),c=function(L,$){var x=u.w(e.$u?Date.UTC(e.$y,$,L):new Date(e.$y,$,L),e);return i?x:x.endOf(y)},d=function(L,$){return u.w(e.toDate()[L].apply(e.toDate("s"),(i?[0,0,0,0]:[23,59,59,999]).slice($)),e)},f=this.$W,h=this.$M,v=this.$D,A="set"+(this.$u?"UTC":"");switch(a){case _:return i?c(1,0):c(31,11);case o:return i?c(1,h):c(0,h+1);case I:var j=this.$locale().weekStart||0,E=(f<j?f+7:f)-j;return c(i?v-E:v+(6-E),h);case y:case O:return d(A+"Hours",0);case b:return d(A+"Minutes",1);case D:return d(A+"Seconds",2);case k:return d(A+"Milliseconds",3);default:return this.clone()}},n.endOf=function(t){return this.startOf(t,!1)},n.$set=function(t,s){var e,i=u.p(t),a="set"+(this.$u?"UTC":""),c=(e={},e[y]=a+"Date",e[O]=a+"Date",e[o]=a+"Month",e[_]=a+"FullYear",e[b]=a+"Hours",e[D]=a+"Minutes",e[k]=a+"Seconds",e[M]=a+"Milliseconds",e)[i],d=i===y?this.$D+(s-this.$W):s;if(i===o||i===_){var f=this.clone().set(O,1);f.$d[c](d),f.init(),this.$d=f.set(O,Math.min(this.$D,f.daysInMonth())).$d}else c&&this.$d[c](d);return this.init(),this},n.set=function(t,s){return this.clone().$set(t,s)},n.get=function(t){return this[u.p(t)]()},n.add=function(t,s){var e,i=this;t=Number(t);var a=u.p(s),c=function(h){var v=l(i);return u.w(v.date(v.date()+Math.round(h*t)),i)};if(a===o)return this.set(o,this.$M+t);if(a===_)return this.set(_,this.$y+t);if(a===y)return c(1);if(a===I)return c(7);var d=(e={},e[D]=g,e[b]=S,e[k]=Y,e)[a]||1,f=this.$d.getTime()+t*d;return u.w(f,this)},n.subtract=function(t,s){return this.add(-1*t,s)},n.format=function(t){var s=this,e=this.$locale();if(!this.isValid())return e.invalidDate||m;var i=t||"YYYY-MM-DDTHH:mm:ssZ",a=u.z(this),c=this.$H,d=this.$m,f=this.$M,h=e.weekdays,v=e.months,A=e.meridiem,j=function($,x,T,U){return $&&($[x]||$(s,i))||T[x].slice(0,U)},E=function($){return u.s(c%12||12,$,"0")},L=A||function($,x,T){var U=$<12?"AM":"PM";return T?U.toLowerCase():U};return i.replace(it,function($,x){return x||function(T){switch(T){case"YY":return String(s.$y).slice(-2);case"YYYY":return u.s(s.$y,4,"0");case"M":return f+1;case"MM":return u.s(f+1,2,"0");case"MMM":return j(e.monthsShort,f,v,3);case"MMMM":return j(v,f);case"D":return s.$D;case"DD":return u.s(s.$D,2,"0");case"d":return String(s.$W);case"dd":return j(e.weekdaysMin,s.$W,h,2);case"ddd":return j(e.weekdaysShort,s.$W,h,3);case"dddd":return h[s.$W];case"H":return String(c);case"HH":return u.s(c,2,"0");case"h":return E(1);case"hh":return E(2);case"a":return L(c,d,!0);case"A":return L(c,d,!1);case"m":return String(d);case"mm":return u.s(d,2,"0");case"s":return String(s.$s);case"ss":return u.s(s.$s,2,"0");case"SSS":return u.s(s.$ms,3,"0");case"Z":return a}return null}($)||a.replace(":","")})},n.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},n.diff=function(t,s,e){var i,a=this,c=u.p(s),d=l(t),f=(d.utcOffset()-this.utcOffset())*g,h=this-d,v=function(){return u.m(a,d)};switch(c){case _:i=v()/12;break;case o:i=v();break;case C:i=v()/3;break;case I:i=(h-f)/6048e5;break;case y:i=(h-f)/864e5;break;case b:i=h/S;break;case D:i=h/g;break;case k:i=h/Y;break;default:i=h}return e?i:u.a(i)},n.daysInMonth=function(){return this.endOf(o).$D},n.$locale=function(){return H[this.$L]},n.locale=function(t,s){if(!t)return this.$L;var e=this.clone(),i=B(t,s,!0);return i&&(e.$L=i),e},n.clone=function(){return u.w(this.$d,this)},n.toDate=function(){return new Date(this.valueOf())},n.toJSON=function(){return this.isValid()?this.toISOString():null},n.toISOString=function(){return this.$d.toISOString()},n.toString=function(){return this.$d.toUTCString()},r}(),P=R.prototype;return l.prototype=P,[["$ms",M],["$s",k],["$m",D],["$H",b],["$W",y],["$M",o],["$y",_],["$D",O]].forEach(function(r){P[r[1]]=function(n){return this.$g(n,r[0],r[1])}}),l.extend=function(r,n){return r.$i||(r(n,R,l),r.$i=!0),l},l.locale=B,l.isDayjs=Z,l.unix=function(r){return l(1e3*r)},l.en=H[V],l.Ls=H,l.p={},l})})(nt);var Dt=nt.exports;const bt=Mt(Dt),wt={key:0,class:"industry pa4 lh-copy"},St={class:"pb3"},kt={class:"tc f2 fw6 mb2"},Ot={class:"tc f3 mv2"},xt={class:"w5 center"},Yt={class:"pv3 mb4 bt bb b--moon-gray flex justify-center"},Ct=["onClick"],Ht={class:"pa4"},jt=mt('<div class="industry__report"><div class="industry__cell">公司名稱</div><div class="industry__cell">年份</div><div class="industry__cell">進度</div><div class="industry__cell">更新時間</div></div>',1),Lt={class:"industry__cell"},Ft={class:"industry__cell"},It={class:"industry__cell"},At={class:"industry__cell"},Nt={key:1,class:"pa2 tc"};var st=(w=>(w.all="全部",w.verified="已驗證",w.isAnswered="判讀完成",w.pending="待判讀",w))(st||{});const Bt=lt({__name:"[industry]",setup(w){const Y=ft().params.industry,{feathers:g}=pt(),S=Q([]),M=Q("全部");function k(o){M.value=o}const D=K(()=>M.value==="全部"?S.value:S.value.filter(o=>M.value==="已驗證"?o.isVerified:M.value==="判讀完成"?o.answeredFields===o.totalFields:o.answeredFields<o.totalFields)),b=K(()=>{const o={};return S.value.forEach(C=>{ct(o,C)}),o[Y]});async function y(){const C=(await g.app.service("company").find({query:{industry:Y,$select:["id"],$limit:500}})).data.map(_=>_.id);g.app.service("report").find({query:{companyId:{$in:C},$limit:500}}).then(_=>{S.value=_.data})}function I(o){return bt(o).format("YYYY/MM/DD HH:mm")}return ht(()=>{g.isReady.value&&y()}),(o,C)=>{const _=ot,O=dt;return F(S).length?(N(),z("div",wt,[p("div",St,[p("h1",kt,W(F(Y))+"產業",1),p("p",Ot,W(F(b).total)+" 本",1),p("div",xt,[X(_,{progress:F(b)},null,8,["progress"])])]),p("div",Yt,[(N(!0),z(tt,null,et(Object.values(st),m=>(N(),z("button",{class:$t(["industry__filter bg-white pv2 ph3 ba b--light-gray br2 dim pointer",{"bg-green":F(M)===m}]),key:m,onClick:q=>k(m)},W(m),11,Ct))),128))]),p("div",Ht,[jt,F(D).length?(N(!0),z(tt,{key:0},et(F(D),m=>(N(),vt(O,{class:"industry__report black dim no-underline",key:m.id,to:`/profession/editor/${m.id}`},{default:yt(()=>[p("div",Lt,W(m.company.name),1),p("div",Ft,W(m.year),1),p("div",It,[X(_,{progress:m,"is-industry":!1},null,8,["progress"])]),p("div",At,W(I(m.updatedAt)),1)]),_:2},1032,["to"]))),128)):(N(),z("div",Nt,"此分類無 資料"))])])):_t("",!0)}}});export{Bt as default};
