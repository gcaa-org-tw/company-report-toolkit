import{_ as Ue}from"./nuxt-link.FIwMBYHw.js";import{f as Q,r as p,g as b,A as ve,y as le,o as i,c as f,a as t,F as T,x as ie,B as ce,h as o,t as z,n as X,v as ye,q as ke,C as Pe,l as qe,z as $e,_ as ee,b as J,w as Ye,d as M,i as j,p as Se,e as Ce,K as Ie,D as se,k as Je,E as Xe,G as Ze,H as ue,I as me,J as Qe,u as et,L as tt}from"./entry.RWTigU-R.js";import{_ as Z,a as ot}from"./lodash.6kCWRynI.js";import{a as at,_ as st,b as nt}from"./SinglePdfPage.MZC9OIce.js";import{t as xe,_ as rt,a as lt}from"./AnswerPanel.vue.BQXSIThm.js";import{u as Le}from"./useProfessionApi.5KDxtYtk.js";import{u as it}from"./vue.f36acd1f.hTpnobD6.js";import{u as ct}from"./index.Fo1tbW2T.js";import{u as ut}from"./useReport.ArVRaY3y.js";const dt={class:"searchPanel"},pt={class:"flex mt2"},ft={class:"flex flex-wrap"},_t=["onClick"],ht={class:"f6 dark-gray mv1"},gt=["onClick"],vt={class:"flex-none dark-gray"},mt=["innerHTML"],Y=15,wt=Q({__name:"SearchPanel",props:{report:{},fieldMeta:{}},emits:["matched-pages","page"],setup(k,{emit:A}){const y=k,V=A,c=qe(),u=at(c.public.algoliaAppId,c.public.algoliaSearchApiKey).initIndex(c.public.algoliaIndexName),C=p(""),h=p(""),v=p([]),I=p(null),P=b(()=>h.value||C.value||"");ve(()=>{y.fieldMeta.keywords.length&&(C.value=y.fieldMeta.keywords[0])}),le([C,h],([a,_],[r,m])=>{a!==r&&a?h.value="":_!==m&&_&&(C.value="")});function E(a){C.value=a}ve(()=>{P.value&&s()});async function s(){if(!P.value){v.value=[],I.value=null;return}const{hits:a}=await u.search(P.value,{facetFilters:[`company:${y.report.company.id}`,`year:${y.report.year}`],hitsPerPage:100});v.value=a.filter(_=>_.page<=y.report.totalPages),I.value=null}le(v,a=>{const _=a.map(r=>r.page);V("matched-pages",_)});function x(a){a=a.replace(/\n/g,"");const _=`${P.value||""}`,r=a.indexOf(_),m=_.length+Y;if(r<0)return a.slice(0,m*2);const B=_.length;let D=a.slice(0,r);const H=`${a.slice(r+B,r+B+Y)}...`;if(r>Y)D=`...${a.slice(r-Y,r)}`;else return a.slice(0,m*2)+"...";return`${Z.escape(D)}<b class="underline">${_}</b>${Z.escape(H)}`}async function N(a){I.value===a?V("page",{highlight:"",page:1}):I.value=a,await $e(),V("page",{highlight:P.value,page:a.page})}function O(a){return xe(a,y.report)}return(a,_)=>(i(),f("div",dt,[t("div",pt,[t("div",ft,[(i(!0),f(T,null,ie(a.fieldMeta.keywords,r=>(i(),f("button",{class:ce(["searchPanel__keyword pointer ba b--moon-gray br1",{"searchPanel__keyword--active":r===o(P)}]),key:r,onClick:m=>E(r)},z(r),11,_t))),128)),X(t("input",{class:"mt1 f6 w-100 searchPanel__input","onUpdate:modelValue":_[0]||(_[0]=r=>ke(h)?h.value=r:null),placeholder:"自訂關鍵字"},null,512),[[ye,o(h),void 0,{trim:!0}]])])]),X(t("div",ht,[(i(!0),f(T,null,ie(o(v),r=>(i(),f("div",{class:ce(["flex mv2 dim pointer",{b:r===o(I)}]),key:r.page,onClick:m=>N(r)},[t("div",vt,"頁"+z(O(r.page)),1),t("div",{class:"pl2",innerHTML:x(r.content)},null,8,mt)],10,gt))),128))],512),[[Pe,o(v).length]])]))}}),bt=ee(wt,[["__scopeId","data-v-f86955e2"]]),yt=ee(rt,[["__scopeId","data-v-879df1be"]]),W=k=>(Se("data-v-aaa39382"),k=k(),Ce(),k),kt={class:"editorControl"},Pt={class:"ph3"},$t=W(()=>t("i",{class:"fa-solid fa-arrow-left mr1"},null,-1)),St={class:"editorControl__keepTop mt2 pv2 ph3 mb2 bb b--moon-gray"},Ct={class:"fw6 f4 mv0 black"},It={class:"ph3"},xt={class:"gray f6 mt0 pb2 mb3 bb b--moon-gray lh-copy"},Lt={class:"editorControl__keywordSection pb2 mb3"},Mt=W(()=>t("div",{class:"editorControl__keepMiddle fw5 mb1"},"相關關鍵字",-1)),Vt=W(()=>t("div",{class:"f6 gray"},"點選以下關鍵字，或是自行輸入，就能搜出相關頁面",-1)),Et={key:0,class:"editorControl__keepBottom pv2 ph3 bt ba b--moon-gray shadow-1 br2"},Ft={class:"flex justify-end"},Tt=W(()=>t("i",{class:"fa-solid fa-eye ml2 f7"},null,-1)),Nt=W(()=>t("i",{class:"fa-solid fa-eye-slash ml2 f7"},null,-1)),Ot={class:"mt2"},At=Q({__name:"EditorControl",props:{report:{},reportField:{},fieldMeta:{},focusedPage:{}},emits:["page","matched-pages","next","prev","report-field"],setup(k,{emit:A}){const{isCollaborator:y}=Le(),V=k,c=A,R=b(()=>({name:"profession-report-reportId",params:{reportId:V.report.id}}));function u(s){c("matched-pages",s)}function C(s){c("page",s)}const h=p(!1);function v(){h.value=!h.value}function I(s){c("report-field",s),P()}function P(){c("next")}function E(){c("prev")}return(s,x)=>{const N=Ue,O=bt,a=yt;return i(),f("div",kt,[t("div",Pt,[J(N,{class:"flex f6 gray items-center no-underline dim pt3",to:o(R)},{default:Ye(()=>[$t,M(z(s.report.company.abbreviation)+" "+z(s.report.year)+" 報告書",1)]),_:1},8,["to"])]),t("div",St,[t("h1",Ct,z(s.fieldMeta.name),1)]),t("div",It,[t("p",xt,z(s.fieldMeta.description),1),t("div",{class:"flex justify-between items-center mb3 mt2 pb3 bb b--moon-gray"},[t("button",{class:"editorControl__nav",onClick:E},"往上個欄位"),t("button",{class:"editorControl__nav",onClick:P},"往下個欄位")]),t("div",Lt,[Mt,Vt,J(O,{report:s.report,"field-meta":s.fieldMeta,onMatchedPages:u,onPage:C},null,8,["report","field-meta"])])]),o(y)?(i(),f("div",Et,[t("div",Ft,[t("button",{class:"pv2 ph3 ba bg-dark-gray white br2 pointer f6 flex items-baseline",onClick:v},[o(h)?(i(),f(T,{key:0},[M("展開填答 x 驗證區"),Tt],64)):(i(),f(T,{key:1},[M("收合填答 x 驗證區"),Nt],64))])]),X(t("div",Ot,[J(a,{report:s.report,"report-field":s.reportField,"field-meta":s.fieldMeta,"focused-page":s.focusedPage,onNext:I},null,8,["report","report-field","field-meta","focused-page"])],512),[[Pe,!o(h)]])])):j("",!0)])}}}),Rt=ee(At,[["__scopeId","data-v-aaa39382"]]),te=k=>(Se("data-v-e680f307"),k=k(),Ce(),k),zt={class:"reportViewer"},jt={class:"reportViewer__control pr2"},Bt={class:"bb b--moon-gray flex items-center justify-between pv2"},Dt={class:"flex items-center pl3"},Ht=te(()=>t("i",{class:"fa-solid fa-plus"},null,-1)),Kt=te(()=>t("i",{class:"fa-solid fa-minus"},null,-1)),Gt=te(()=>t("i",{class:"fa-solid fa-arrows-left-right"},null,-1)),Wt=te(()=>t("i",{class:"fa-solid fa-arrows-up-down"},null,-1)),Ut={key:0,class:"reportViewer__content w-100"},qt={class:"flex flex-column items-center justify-center h-100 f3 fw6 flex-auto"},Yt=["onClick"],Jt={key:0,class:"flex flex-column items-center justify-center h-100 f3 fw6 flex-auto"},Xt=["onClick"],ne="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179",Zt="https://gcaa-static.s3.ap-northeast-3.amazonaws.com/company-report-toolkit",re=10,Qt=100,eo=60,we=.1,to=100,oo=Q({__name:"PdfViewer",props:{page:{default:1},year:{default:2019},report:{},highlight:{default:""},matchedPages:{default(){return[]}}},emits:["view-page","page","reload"],setup(k,{emit:A}){const y=Ie(),{feathers:V,isCollaborator:c}=Le();it({link:[{rel:"stylesheet",href:`${ne}/web/pdf_viewer.css`}]});const R=A,u=k,C=p(!1),h=p(void 0),v=p([]),I=p(0),P=p([]),E=se({}),s=p([null]),x=p(!1);function N(){x.value=!x.value}const O=p(1),a=p(1),_=b({get(){return xe(a.value,u.report)},set(e){const n=lt(Number.parseInt(e,10),u.report);je(n)}}),r=b(()=>{let e=u.report.pageOffset||0,n=u.report.totalPages;return u.report.is2Pages&&(n=n*2-1),e&&(n+=e,e=Math.abs(e)),`${n} + ${Math.abs(e)}`}),m=p(!1);function B(){u.report.hasSetPageOffset||!c.value?m.value=!1:(m.value=!0,y.add({type:"warning",text:"歡迎光臨，我們先校正報告書的第一頁吧 🍥",duration:5e3}))}const D=()=>{m.value=!m.value},H=b(()=>m.value?"取消設定報告第一頁":"頁次對不上？點此調整");async function l(e,n){x.value&&e>1&&(e=(e-1)*2+(n?0:1));const w=1-e;try{await V.app.service("report").patch(u.report.id,{pageOffset:w,is2Pages:x.value}),R("reload"),m.value=!1}catch(S){throw S.message&&y.add({type:"error",text:S.message}),S}}const $=p("fit-width"),d=p({pdfSize:{width:0,height:0},widthScale:0,heightScale:0,customScale:0}),F=b(()=>{if(!d.value.widthScale||!_e.value)return null;let e=1;switch($.value){case"custom":e=d.value.customScale;break;case"fit-height":e=d.value.heightScale;break;case"fit-width":default:e=d.value.widthScale}return e=e||1,{scale:e,width:d.value.pdfSize.width*e,height:d.value.pdfSize.height*e}});Je(()=>{pe(),window.addEventListener("keydown",ge)}),Xe(()=>{clearTimeout(h.value),window.removeEventListener("keydown",ge)});const Me=b(()=>s.value[0]&&F.value),de=b(()=>`${Zt}/${u.year}/${u.report.company.id}`),Ve=b(()=>u.highlight+"");function Ee(){return!!window&&!!window.pdfjsLib&&!!window.pdfjsViewer}function pe(){h.value=setTimeout(async()=>{const e=Ee();e?(window.pdfjsLib.GlobalWorkerOptions.workerSrc=`${ne}/build/pdf.worker.js`,await $e()):pe(),C.value=e},Qt)}async function fe(e){const n=window.pdfjsLib,w=`${ne}/cmaps/`,S=e%re||re,g=Ae(e);E.value[g]||(E.value[g]=n.getDocument({url:`${de.value}/${g}.pdf`,cMapUrl:w,cMapPacked:!0,enableXfa:!0}));const L=await E.value[g].promise;return Fe(L),{document:L,page:S}}async function Fe(e){if(d.value.widthScale)return;const n=await e.getPage(1),{width:w,height:S}=n.getViewport({scale:1});d.value.pdfSize={width:w,height:S};const g=q.value,L=g.clientWidth,G=g.clientHeight,Ge=Number.parseInt(getComputedStyle(g).paddingLeft),We=L-Ge*2;d.value.widthScale=We/w,d.value.heightScale=G/S}const U=b(()=>{var e,n;return F.value?{width:`${(e=F.value)==null?void 0:e.width}px`,height:`${(n=F.value)==null?void 0:n.height}px`}:{}}),Te=b(()=>U.value.height?{...U.value,marginTop:`-${U.value.height}`}:{});async function Ne(){const e=await fe(1);s.value[0]={pdf:se(e)}}function Oe(){E.value={},s.value=Array(u.report.totalPages).fill(null),$.value="fit-width",d.value.widthScale=0}function Ae(e){return`${Math.ceil(e/re)}`.padStart(3,"0")}async function K(e,{forceLoad:n=!1,anchor:w=0}={}){if(!n&&v.value.length){v.value.includes(e)||v.value.unshift(e);return}const S=e-1;if(S>=s.value.length)throw new Error(`Invalid page number: ${e}`);if(n||(v.value.push(e),w&&(I.value=w)),!s.value[S]){const g=await fe(e);s.value[S]={pdf:se(g),highlight:u.matchedPages.includes(e)?Ve.value:""}}v.value.pop(),v.value.length?K(v.value[0],{forceLoad:!0}):setTimeout(()=>{I.value=0},to)}const Re=Z.debounce(e=>{K(e)},100),_e=ct(),q=p(null);ot(()=>de.value&&!C.value&&!_e.value,()=>{Oe(),Ne(),B()});function ze(e){const w=q.value.querySelectorAll(".reportViewer__page")[e-1];return w==null?void 0:w.offsetTop}function je(e){e<1||e>u.report.totalPages||Number.isNaN(e)||(he(e),R("page",e))}async function he(e){e=Math.floor(e);const n=ze(e),w=K(e,{anchor:n});e>1&&K(e-1),e<u.report.totalPages&&K(e+1),n&&q.value.scrollTo({top:n}),await w,a.value=e}le(()=>u.page,async()=>{await he(u.page)});function oe(){var e;d.value.customScale=(((e=F.value)==null?void 0:e.scale)||1)*(1+we),$.value="custom"}function ae(){var e;d.value.customScale=(((e=F.value)==null?void 0:e.scale)||1)*(1-we),$.value="custom"}function Be(){$.value="fit-width"}function De(){$.value="fit-height"}function ge(e){e.key==="+"?oe():e.key==="-"&&ae()}function He(e){if(e.buttons!==1)return;e.preventDefault();const n=[e.clientX,e.clientY];P.value=n,e.deltaY<0?oe():ae()}const Ke=Z.debounce(e=>{e!==O.value&&(a.value=O.value,O.value=e,R("view-page",a.value))},eo);return(e,n)=>{const w=st,S=nt;return i(),f("div",zt,[t("div",jt,[t("div",Bt,[t("div",Dt,[X(t("input",{class:"reportViewer__pageInput b--moon-gray ba ph1 mr1","onUpdate:modelValue":n[0]||(n[0]=g=>ke(_)?_.value=g:null),onKeyup:n[1]||(n[1]=Ze(g=>g.target.blur(),["enter"]))},null,544),[[ye,o(_),void 0,{lazy:!0}]]),M("頁 / 共 "+z(o(r))+" 頁",1),o(c)?(i(),f("button",{key:0,class:"reportViewer__button ml2 gray",onClick:D},z(o(H)),1)):j("",!0)]),t("div",{class:"flex items-center"},[t("button",{class:"reportViewer__button",onClick:oe},[Ht,M("放大")]),t("button",{class:"reportViewer__button",onClick:ae},[Kt,M("縮小")]),t("button",{class:"reportViewer__button",onClick:Be},[Gt,M("滿頁寬")]),t("button",{class:"reportViewer__button",onClick:De},[Wt,M("滿頁高")])])])]),t("div",{class:"reportViewer__scrollContainer relative",ref_key:"scrollerEle",ref:q},[o(Me)?(i(),f("div",Ut,[(i(!0),f(T,null,ie(o(s),(g,L)=>(i(),f(T,{key:L},[g?(i(),ue(S,Qe({key:1,class:"reportViewer__page"},g.pdf,{class:[`thePage--${L+1}`],highlight:g.highlight,"page-anchor":o(I),"click-anchor":o(P),scale:o(F).scale,onVisible:G=>o(Ke)(L+1),onWheel:He}),null,16,["class","highlight","page-anchor","click-anchor","scale","onVisible"])):(i(),ue(w,{key:0,class:ce(["reportViewer__page",[`theEmpty--${L+1}`]]),style:me(o(U)),"page-number":L+1,onVisible:G=>o(Re)(L+1)},null,8,["style","class","page-number","onVisible"])),o(m)?(i(),f("div",{key:2,class:"reportViewer__page reportViewer__page--mask center pointer flex",style:me(o(Te))},[t("div",qt,[t("div",{class:"reportViewer__maskLabel pv3 ph4 br2 mb3",onClick:N},[o(x)?(i(),f(T,{key:0},[M("切換為單頁模式")],64)):(i(),f(T,{key:1},[M("切換為雙頁模式")],64))]),t("div",{class:"reportViewer__maskLabel pv3 ph4 br2",onClick:G=>l(L+1,!0)},"設定為第一頁",8,Yt)]),o(x)?(i(),f("div",Jt,[t("div",{class:"reportViewer__maskLabel pv3 ph4 br2 mb3",onClick:N},[o(x)?(i(),f(T,{key:0},[M("切換為單頁模式")],64)):(i(),f(T,{key:1},[M("切換為雙頁模式")],64))]),t("div",{class:"reportViewer__maskLabel pv3 ph4 br2",onClick:G=>l(L+1,!1)},"設定為第一頁",8,Xt)])):j("",!0)],4)):j("",!0)],64))),128))])):j("",!0)],512)])}}}),ao=ee(oo,[["__scopeId","data-v-e680f307"]]),so={key:0,class:"editor"},no={class:"editor__viewer"},be="看完收工！ 🎉 找找頁面左上角，就能回上一層",ro=5,vo=Q({__name:"[reportId]",setup(k){const A=et(),y=b(()=>Number.parseInt(A.params.reportId)),{report:V,reportFieldList:c,isDataReady:R,meta:u}=ut(y.value),C=b(()=>Number.parseInt(A.query.fieldId)),h=b(()=>c.value.find($=>$.id===C.value)||c.value[0]),v=Ie();function I(l){Object.keys(l).forEach(d=>{h.value[d]=l[d]});const $=E.value===be?8e3:4e3;v.add({type:"success",duration:$,text:E.value})}const P=b(()=>u(h.value)),E=b(()=>{const l=c.value.filter(F=>!!F.value).length,$=c.value.length,d=$-l;return d?d<=ro?`最後 ${d} 個欄位！ 🧙`:`已完成 ${l} / ${$} 個欄位 🤖`:be}),s=p({page:1,highlight:""}),x=p([]),N=p(0);function O(l){N.value=l}function a(l){s.value=l}function _(l){x.value=l}const r=tt(),m=b(()=>c.value.findIndex(l=>l.id===C.value));function B(){let l=m.value+1;l===c.value.length&&(l=0),r.push({name:"profession-editor-reportId",params:{reportId:y.value},query:{fieldId:c.value[l].id}})}function D(){let l=m.value-1;l<0&&(l=c.value.length-1),r.push({name:"profession-editor-reportId",params:{reportId:y.value},query:{fieldId:c.value[l].id}})}function H(){window.location.reload()}return(l,$)=>{const d=Rt,F=ao;return o(R)?(i(),f("div",so,[J(d,{class:"editor__control br b--moon-gray",report:o(V),"report-field":o(h),"field-meta":o(P),"focused-page":o(N),onPage:a,onMatchedPages:_,onNext:B,onPrev:D,onReportField:I},null,8,["report","report-field","field-meta","focused-page"]),t("div",no,[o(s)?(i(),ue(F,{key:0,year:o(V).year,report:o(V),page:o(s).page,highlight:o(s).highlight,"matched-pages":o(x),onViewPage:O,onReload:H},null,8,["year","report","page","highlight","matched-pages"])):j("",!0)])])):j("",!0)}}});export{vo as default};
