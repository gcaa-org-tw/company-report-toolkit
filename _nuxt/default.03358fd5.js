import{_ as y}from"./nuxt-link.c0d3bb45.js";import{T as w,o as c,I as b,U as N,y as S,w as u,V as k,W as p,X as f,i as a,Y as $,k as B,h as v,f as V,g as A,c as m,a as r,b as h,d as g}from"./entry.d330e4e7.js";const C={__name:"NuxtSnackbar",setup(t){var s;const n=((s=w())==null?void 0:s.$snackbarOptions)||{};return(o,i)=>(c(),b(a($),p(f(a(n))),N({_:2},[S(o.$slots,(l,e)=>({name:e,fn:u(_=>[k(o.$slots,e,p(f(_)))])}))]),1040))}};function L(){const t=B();return{user:v(()=>{if(t&&t.isAuthenticated.value)return t.user.value}),auth0:t}}const O={class:"gcaa"},P={class:"gcaa__header flex justify-between items-center ph2 pv3 bb b--moon-gray"},R={key:0,class:"flex items-center"},T=["src","title"],z=V({__name:"default",setup(t){const n=A(),{user:s,auth0:o}=L(),i=v(()=>{var e;return n.name==="index"?"/":(e=n.name)!=null&&e.toString().startsWith("profession")?"/profession":"/crowd"});function l(){o.logout()}return(e,_)=>{const d=y,x=C;return c(),m("div",O,[r("div",P,[h(d,{to:a(i),class:"black fw5 no-underline"},{default:u(()=>[g(" 工人智慧補完計畫 | 透明足跡 ")]),_:1},8,["to"]),a(s)?(c(),m("div",R,[r("button",{class:"pa0 bw0 bg-white pointer dim",onClick:l}," 登出 "),r("img",{class:"gcaa__avatar br-pill ml2",src:a(s).picture,title:a(s).nickname},null,8,T)])):(c(),b(d,{key:1,to:"/call-for-g0ver",class:"gray no-underline"},{default:u(()=>[g(" 登入後台 ")]),_:1}))]),r("main",null,[k(e.$slots,"default"),h(x)])])}}});export{z as default};
