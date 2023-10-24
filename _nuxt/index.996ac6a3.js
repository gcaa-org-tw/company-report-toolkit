import{g,k as y,o as a,c as l,a as o,F as u,z as p,K as m,t as _,j as f,D as v,_ as b,b as w,r as x,C as $,G as V}from"./entry.d7749dfa.js";import{u as k}from"./useProfessionApi.11bbe39a.js";import"./_commonjsHelpers.221eaa43.js";const C={class:"fieldProgress w-100"},P={class:"flex mb1"},F={class:"f6 gray"},B={class:"fieldProgress__bar br-pill overflow-hidden flex"},L={class:"f6 white"},j=g({__name:"FieldProgress",props:{progress:{},showVerified:{type:Boolean,default:!0}},setup(n){const e=n,d=y(()=>{const r=[],t=e.progress.total||1,s=e.showVerified&&e.progress.isVerified||0,i=(e.progress.answered||0)-s,c=t-i-s;return s&&r.push({title:"驗",value:s,width:`${s/t*100}%`,bg:"bg-green"}),i&&r.push({title:"判",value:i,width:`${i/t*100}%`,bg:"bg-gold"}),c&&r.push({title:"待",value:c,width:`${c/t*100}%`,bg:"bg-moon-gray"}),r});return(r,t)=>(a(),l("div",C,[o("div",P,[(a(!0),l(u,null,p(f(d),s=>(a(),l("div",{class:"filedProgress__cell",key:s.title,style:m({width:s.width})},[o("div",F,_(s.title),1)],4))),128))]),o("div",B,[(a(!0),l(u,null,p(f(d),s=>(a(),l("div",{class:v(["filedProgress__cell flex items-center",[s.bg]]),key:s.title,style:m({width:s.width})},[o("div",L,_(s.value),1)],6))),128))])]))}});const z=b(j,[["__scopeId","data-v-2e63dd88"]]),A={class:"industryCard br2 ba b--moon-gray pa3 flex flex-column items-center justify-center"},E={class:"industryCard__title f4 fw6 tc mb3"},I={class:"industryCard__total f2 tc mb3"},R=g({__name:"IndustryCard",props:{industryStats:{}},setup(n){return(e,d)=>{const r=z;return a(),l("div",A,[o("div",E,_(e.industryStats.name),1),o("div",I,_(e.industryStats.total)+" 本",1),w(r,{progress:e.industryStats},null,8,["progress"])])}}});function S(n,e){const d=e.totalFields===e.answeredFields,r=e.isVerified,t=e.company.industry;n[t]||(n[t]={total:0,answered:0,isVerified:0,name:t}),n[t].total+=1,n[t].answered+=d?1:0,n[t].isVerified+=r?1:0}const D={class:"profession pa4 lh-copy"},N=o("div",{class:"profession__header mb5 pb3 bb b--moon-gray tc"},[o("h1",{class:"f2 fw6"},"企業永續報告書列表"),o("p",null,"快速查找近兩年產業報告書，個別報告書驗證進度")],-1),q={class:"profession__industryList justify-center"},O=g({__name:"index",setup(n){const{feathers:e}=k(),d=x([]),r=y(()=>{const s={};return d.value.forEach(i=>{S(s,i)}),Object.values(s).sort((i,c)=>c.total-i.total)});function t(){e.app.service("report").find({query:{$limit:500}}).then(s=>{d.value=s.data})}return $(()=>{e.isReady.value&&t()}),(s,i)=>{const c=R;return a(),l("div",D,[N,o("div",q,[(a(!0),l(u,null,p(f(r),h=>(a(),V(c,{key:h.name,"industry-stats":h},null,8,["industry-stats"]))),128))])])}}});export{O as default};
