import{f as w,h as y,o as n,c as a,a as l,F as p,y as u,J as h,t as f,i as b,C as x,_ as F}from"./entry.c1edeb24.js";const I={class:"fieldProgress w-100"},P={class:"flex mb1"},k=["title"],B={class:"f6 gray"},C={class:"fieldProgress__bar br-pill overflow-hidden flex"},M={class:"f6 white"},V=.08,W=w({__name:"FieldProgress",props:{progress:{},isIndustry:{type:Boolean,default:!0}},setup(v){const t=v,d=y(()=>{const o=[],s=t.progress.total||t.progress.totalFields||1,e=Math.ceil(s*V),r=t.isIndustry&&t.progress.isVerified||0,i=(t.progress.answered||t.progress.answeredFields||0)-r,c=s-i-r,_=r?Math.max(r,e):0,g=i?Math.max(i,e):0,m=s-_-g;return r&&o.push({abbr:"驗",title:"已驗證",value:r,width:`${_/s*100}%`,bg:"bg-green"}),i&&o.push({abbr:"判",title:"判讀完成",value:i,width:`${g/s*100}%`,bg:"bg-gold"}),c&&o.push({abbr:"待",title:"待判讀",value:c,width:`${m/s*100}%`,bg:"bg-moon-gray"}),o});return(o,s)=>(n(),a("div",I,[l("div",P,[(n(!0),a(p,null,u(b(d),e=>(n(),a("div",{class:"filedProgress__cell",key:e.title,style:h({width:e.width}),title:e.title},[l("div",B,f(e.abbr),1)],12,k))),128))]),l("div",C,[(n(!0),a(p,null,u(b(d),e=>(n(),a("div",{class:x(["filedProgress__cell flex items-center",[e.bg]]),key:e.title,style:h({width:e.width})},[l("div",M,f(e.value),1)],6))),128))])]))}});const z=F(W,[["__scopeId","data-v-8c73e004"]]);export{z as _};
