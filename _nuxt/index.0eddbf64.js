import{_ as y}from"./FieldProgress.6a579c12.js";import{f as u,o,c,a as s,t as d,b as p,r as h,h as v,B as b,F as g,y as x,i as C,I as S,w as $}from"./entry.bac27b46.js";import{_ as k}from"./nuxt-link.bbd17edd.js";import{u as w}from"./useProfessionApi.c3aebad1.js";import{m as B}from"./industryStats.5556f7dc.js";import"./lodash.c5f1a86c.js";const L={class:"industryCard br2 ba b--moon-gray pa3 flex flex-column items-center justify-center"},j={class:"industryCard__title f4 fw6 tc mb3"},E={class:"industryCard__total f2 tc mb3"},I=u({__name:"IndustryCard",props:{industryStats:{}},setup(l){return(t,r)=>{const a=y;return o(),c("div",L,[s("div",j,d(t.industryStats.name),1),s("div",E,d(t.industryStats.total)+" 本",1),p(a,{progress:t.industryStats},null,8,["progress"])])}}});const R={class:"profession pa4 lh-copy"},F=s("div",{class:"profession__header mb5 pb3 bb b--moon-gray tc"},[s("h1",{class:"f2 fw6"},"企業永續報告書列表"),s("p",{class:"f4"},"快速查找近兩年產業報告書，個別報告書驗證進度")],-1),N={class:"profession__industryList justify-center"},P=u({__name:"index",setup(l){const{feathers:t}=w(),r=h([]),a=v(()=>{const e={};return r.value.forEach(n=>{B(e,n)}),Object.values(e).sort((n,i)=>i.total-n.total)});function f(){t.app.service("report").find({query:{$limit:500}}).then(e=>{r.value=e.data})}return b(()=>{t.isReady.value&&f()}),(e,n)=>{const i=I,m=k;return o(),c("div",R,[F,s("div",N,[(o(!0),c(g,null,x(C(a),_=>(o(),S(m,{class:"no-underline dim",key:_.name,to:`/profession/industry/${_.name}`},{default:$(()=>[p(i,{"industry-stats":_},null,8,["industry-stats"])]),_:2},1032,["to"]))),128))])])}}});export{P as default};
