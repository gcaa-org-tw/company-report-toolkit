import{a as f}from"./PdfViewer.0b8f01f2.js";import{g as b,h as k,r as c,o as i,c as d,a as e,F as P,z as x,t as l,j as t,G as w,l as B}from"./entry.ea36a394.js";import{d as C}from"./report-list.e521733a.js";import"./_commonjsHelpers.0709a8ab.js";const V={class:"editor"},F={class:"editor__control pa3 br b--moon-gray"},I=e("div",{class:"f4 mb3"},"跳到以下頁次",-1),N={class:"flex flex-wrap"},j={class:"mr3 mb3"},z=["onClick"],D={class:"mv3"},E=e("div",{class:"f4 mb3"},"最後瀏覽頁次",-1),G={class:"ba b--moon-gray pv2 ph4"},L={class:"editor__viewer"},J=b({__name:"[companyId]",setup(O){const{params:{year:m,companyId:p}}=k(),r=C[0].reports.find(o=>o.id===p),a={year:m,company:r},s=c({page:1,highlight:""}),h=c([]),g=[10,30,70,88,89,90,100];function u(o){o=o-(r.pageOffset||0),s.value={page:o,highlight:""}}const _=c(0);function v(o){_.value=o}return(o,R)=>{const y=f;return i(),d("div",V,[e("div",F,[I,e("div",N,[e("div",j,[(i(),d(P,null,x(g,n=>e("button",{class:"pv2 ph4 ba b--moon-gray br2 mr3 mb3 black dim",key:n,onClick:S=>u(n)},l(n),9,z)),64))])]),e("div",D,[E,e("div",G,l(t(_)),1)])]),e("div",L,[a&&t(s)?(i(),w(y,{key:0,year:a.year,company:a.company,page:t(s).page,highlight:t(s).highlight,"matched-pages":t(h),onViewPage:v},null,8,["year","company","page","highlight","matched-pages"])):B("",!0)])])}}});export{J as default};
