import{f as p,l as m,r as f,j as h,m as v,o as r,c as i,i as t,a as s,t as c,d as g,k as b,n as w}from"./entry.44c92013.js";import{s as k,a as y,D as C}from"./useProfessionApi.31e73c87.js";import"./_commonjsHelpers.0a3149b2.js";const x={class:"mw6 center ba b--moon-gray pa4 f4 lh-copy mt4 mt6-ns"},E={key:0},L={class:"f3 f2-ns"},B=s("p",null,"你應該是新來的朋友？ 請先點選下面的按鈕，登錄系統，就可以開始標記囉！",-1),D={class:"mt4 flex"},N={class:"w-50 pr2"},T={class:"w-50 pl2"},U=["href"],V=s("button",{class:"pointer pv2 w-100"},"登錄系統",-1),R=[V],K=p({__name:"register",setup(S){const o=m(),e=f(void 0),l=w(),u=h(()=>`${l.public.apiEndpoint||C}oauth/auth0`);v(async()=>{o&&(await k(),e.value=o.user)});const n=y();return(_,a)=>(r(),i("div",x,[t(e)?(r(),i("div",E,[s("h1",L,"哈囉 "+c(t(e).value.name)+"！",1),B,s("p",null,[g("你現在使用的信箱是： "),s("strong",null,c(t(e).value.email),1)]),s("div",D,[s("div",N,[s("button",{class:"pv2 w-100 pointer",onClick:a[0]||(a[0]=(...d)=>t(n)&&t(n)(...d))},"換一個信箱")]),s("div",T,[s("a",{href:t(u),rel:"noopener noreferrer"},R,8,U)])])])):b("",!0)]))}});export{K as default};
