import{_ as K,a as $,r as I,h as u,o as a,w as t,d as o,b as s,c as p,i as g,F as V,e as r,j as y,g as f,t as b,E as G,k as te,l as oe,m as A,n as ae,p as se,q as ne,s as ue,v as re,x as de,y as ie,u as pe,z as me,A as ce}from"./index-D4YcMouI.js";const ve={class:"step-content"},fe={key:0,class:"survey-form"},be={key:1,class:"module-selection"},_e={key:2,class:"template-config"},ge={key:3,class:"worklist"},Ve={key:4,class:"unified-view"},ye={class:"dialog-footer"},we={__name:"SetupWizard",props:{visible:{type:Boolean,default:!1}},emits:["update:visible","finish"],setup(R,{emit:D}){const F=D,c=$(0),i=I({companySize:"",industry:"",travelFrequency:"",expenseTypes:[],approvalLevels:""}),n=I({basic:!0,budget:!1,ledger:!1,order:!1}),d=I({roles:[],documents:[],approvalFlow:"",reimbursementFlow:""}),m=I({basic:{organization:!1,users:!1,roles:!1,documents:!1,workflow:!1,standards:!1,riskControl:!1},budget:{rules:!1},ledger:{accounting:!1,voucher:!1},order:{serviceProvider:!1}}),w={companySizes:["50人以下","50-200人","200-500人","500-1000人","1000人以上"],industries:["互联网","制造业","金融业","教育","医疗","其他"],travelFrequencies:["频繁","一般","较少"],expenseTypesList:["差旅费","招待费","办公用品","培训费","其他"],approvalLevelsList:["一级审批","两级审批","三级审批","四级审批"]},k={roles:["员工","部门主管","财务人员","部门总经理","财务主管","项目经理","行政人员","商旅系统管理员"],documents:["出差申请/报销单","借款单","招待费报销单","费用报销单","合同付款单"],approvalFlows:[{label:"一录一审（员工-部门主管）",value:"flow1-1"},{label:"一录两审（员工-部门主管-部门总经理）",value:"flow1-2"},{label:"一录三审（员工-项目经理-部门主管-部门总经理）",value:"flow1-3"},{label:"一录四审（员工-项目经理-部门主管-部门总经理-行政人员）",value:"flow1-4"}],reimbursementFlows:[{label:"一录一审（员工-财务人员）",value:"flow2-1"},{label:"一录两审（员工-部门主管-财务人员）",value:"flow2-2"},{label:"一录三审（员工-部门主管-部门总经理-财务人员）",value:"flow2-3"},{label:"一录四审（员工-项目经理-部门主管-部门总经理-财务人员）",value:"flow2-4"}]},L=[{title:"问卷调查",description:"了解企业偏好"},{title:"配置模块",description:"选择所需功能模块"},{title:"配置模板",description:"设置模块参数"},{title:"准备工作清单",description:"完成必要配置"},{title:"统一视图",description:"确认配置信息"}],W=x=>{switch(x){case 0:return!0;case 1:return n.basic;case 2:return d.roles.length>0&&d.documents.length>0;case 3:return N();case 4:return!0;default:return!1}},N=()=>!(!Object.values(m.basic).every(l=>l)||n.budget&&!m.budget.rules||n.ledger&&!Object.values(m.ledger).every(l=>l)||n.order&&!m.order.serviceProvider),O=()=>{W(c.value)?c.value<L.length-1?c.value++:H():G.warning("请完成当前步骤的必要配置")},_=()=>{c.value>0&&c.value--},H=()=>{const x={survey:i,modules:n,template:d,worklist:m};localStorage.setItem("setupConfig",JSON.stringify(x)),localStorage.setItem("setupCompleted","true"),F("finish",x),F("update:visible",!1),G.success("配置向导完成")},Q=()=>{F("update:visible",!1)};return(x,l)=>{const X=r("el-step"),Y=r("el-steps"),B=r("el-option"),h=r("el-select"),C=r("el-form-item"),S=r("el-checkbox"),P=r("el-checkbox-group"),Z=r("el-radio"),ee=r("el-radio-group"),M=r("el-form"),q=r("el-card"),j=r("el-switch"),U=r("el-descriptions-item"),T=r("el-descriptions"),E=r("el-tag"),J=r("el-button"),le=r("el-dialog");return a(),u(le,{"model-value":R.visible,"onUpdate:modelValue":l[15]||(l[15]=e=>x.$emit("update:visible",e)),onClose:Q,title:"企业费控系统配置向导",width:"70%","close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!0},{footer:t(()=>[s("div",ye,[o(J,{onClick:_,disabled:c.value===0},{default:t(()=>l[32]||(l[32]=[f("上一步")])),_:1},8,["disabled"]),o(J,{type:"primary",onClick:O},{default:t(()=>[f(b(c.value===L.length-1?"完成":"下一步"),1)]),_:1})])]),default:t(()=>[o(Y,{active:c.value,"finish-status":"success","align-center":""},{default:t(()=>[(a(),p(V,null,g(L,(e,v)=>o(X,{key:v,title:e.title,description:e.description},null,8,["title","description"])),64))]),_:1},8,["active"]),s("div",ve,[c.value===0?(a(),p("div",fe,[o(M,{model:i,"label-width":"120px"},{default:t(()=>[o(C,{label:"企业规模"},{default:t(()=>[o(h,{modelValue:i.companySize,"onUpdate:modelValue":l[0]||(l[0]=e=>i.companySize=e),placeholder:"请选择企业规模"},{default:t(()=>[(a(!0),p(V,null,g(w.companySizes,e=>(a(),u(B,{key:e,label:e,value:e},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(C,{label:"所属行业"},{default:t(()=>[o(h,{modelValue:i.industry,"onUpdate:modelValue":l[1]||(l[1]=e=>i.industry=e),placeholder:"请选择所属行业"},{default:t(()=>[(a(!0),p(V,null,g(w.industries,e=>(a(),u(B,{key:e,label:e,value:e},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(C,{label:"差旅频率"},{default:t(()=>[o(h,{modelValue:i.travelFrequency,"onUpdate:modelValue":l[2]||(l[2]=e=>i.travelFrequency=e),placeholder:"请选择差旅频率"},{default:t(()=>[(a(!0),p(V,null,g(w.travelFrequencies,e=>(a(),u(B,{key:e,label:e,value:e},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(C,{label:"常用费用类型"},{default:t(()=>[o(P,{modelValue:i.expenseTypes,"onUpdate:modelValue":l[3]||(l[3]=e=>i.expenseTypes=e)},{default:t(()=>[(a(!0),p(V,null,g(w.expenseTypesList,e=>(a(),u(S,{key:e,label:e},null,8,["label"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(C,{label:"期望审批层级"},{default:t(()=>[o(ee,{modelValue:i.approvalLevels,"onUpdate:modelValue":l[4]||(l[4]=e=>i.approvalLevels=e)},{default:t(()=>[(a(!0),p(V,null,g(w.approvalLevelsList,e=>(a(),u(Z,{key:e,label:e},null,8,["label"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])])):y("",!0),c.value===1?(a(),p("div",be,[o(q,null,{header:t(()=>l[16]||(l[16]=[s("div",{class:"card-header"},[s("span",null,"请选择需要的功能模块")],-1)])),default:t(()=>[o(S,{modelValue:n.basic,"onUpdate:modelValue":l[5]||(l[5]=e=>n.basic=e),disabled:""},{default:t(()=>l[17]||(l[17]=[f("基础模块（必选）")])),_:1},8,["modelValue"]),o(S,{modelValue:n.budget,"onUpdate:modelValue":l[6]||(l[6]=e=>n.budget=e)},{default:t(()=>l[18]||(l[18]=[f("预算模块")])),_:1},8,["modelValue"]),o(S,{modelValue:n.ledger,"onUpdate:modelValue":l[7]||(l[7]=e=>n.ledger=e)},{default:t(()=>l[19]||(l[19]=[f("总账模块")])),_:1},8,["modelValue"]),o(S,{modelValue:n.order,"onUpdate:modelValue":l[8]||(l[8]=e=>n.order=e)},{default:t(()=>l[20]||(l[20]=[f("订单模块")])),_:1},8,["modelValue"])]),_:1})])):y("",!0),c.value===2?(a(),p("div",_e,[o(M,{model:d,"label-width":"120px"},{default:t(()=>[o(C,{label:"角色选择",required:""},{default:t(()=>[o(P,{modelValue:d.roles,"onUpdate:modelValue":l[9]||(l[9]=e=>d.roles=e)},{default:t(()=>[(a(!0),p(V,null,g(k.roles,e=>(a(),u(S,{key:e,label:e},null,8,["label"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(C,{label:"单据模板",required:""},{default:t(()=>[o(P,{modelValue:d.documents,"onUpdate:modelValue":l[10]||(l[10]=e=>d.documents=e)},{default:t(()=>[(a(!0),p(V,null,g(k.documents,e=>(a(),u(S,{key:e,label:e},null,8,["label"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(C,{label:"申请单审批流程"},{default:t(()=>[o(h,{modelValue:d.approvalFlow,"onUpdate:modelValue":l[11]||(l[11]=e=>d.approvalFlow=e),placeholder:"请选择审批流程"},{default:t(()=>[(a(!0),p(V,null,g(k.approvalFlows,e=>(a(),u(B,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(C,{label:"报销单审批流程"},{default:t(()=>[o(h,{modelValue:d.reimbursementFlow,"onUpdate:modelValue":l[12]||(l[12]=e=>d.reimbursementFlow=e),placeholder:"请选择审批流程"},{default:t(()=>[(a(!0),p(V,null,g(k.reimbursementFlows,e=>(a(),u(B,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])])):y("",!0),c.value===3?(a(),p("div",ge,[o(q,{class:"mb-4"},{header:t(()=>l[21]||(l[21]=[s("div",{class:"card-header"},[s("span",null,"基础模块配置")],-1)])),default:t(()=>[o(T,{column:1,border:""},{default:t(()=>[(a(!0),p(V,null,g(m.basic,(e,v)=>(a(),u(U,{key:v},{label:t(()=>[f(b({organization:"设置企业组织架构",users:"维护开薪易用户信息",roles:"企业商旅角色设置与导入",documents:"设置出差申请单和报销单据模板",workflow:"设置单据审批流程",standards:"设置费用标准管控流程",riskControl:"设置单据提交时检查事项"}[v]),1)]),default:t(()=>[o(j,{modelValue:m.basic[v],"onUpdate:modelValue":z=>m.basic[v]=z},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024))),128))]),_:1})]),_:1}),n.budget?(a(),u(q,{key:0,class:"mb-4"},{header:t(()=>l[22]||(l[22]=[s("div",{class:"card-header"},[s("span",null,"预算模块配置")],-1)])),default:t(()=>[o(T,{column:1,border:""},{default:t(()=>[o(U,null,{label:t(()=>l[23]||(l[23]=[f("设置预算初始化规则")])),default:t(()=>[o(j,{modelValue:m.budget.rules,"onUpdate:modelValue":l[13]||(l[13]=e=>m.budget.rules=e)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):y("",!0),n.ledger?(a(),u(q,{key:1,class:"mb-4"},{header:t(()=>l[24]||(l[24]=[s("div",{class:"card-header"},[s("span",null,"总账模块配置")],-1)])),default:t(()=>[o(T,{column:1,border:""},{default:t(()=>[(a(!0),p(V,null,g(m.ledger,(e,v)=>(a(),u(U,{key:v},{label:t(()=>[f(b({accounting:"引导企业跳转开薪易财务记账首页",voucher:"内置凭证模板配置"}[v]),1)]),default:t(()=>[o(j,{modelValue:m.ledger[v],"onUpdate:modelValue":z=>m.ledger[v]=z},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024))),128))]),_:1})]),_:1})):y("",!0),n.order?(a(),u(q,{key:2,class:"mb-4"},{header:t(()=>l[25]||(l[25]=[s("div",{class:"card-header"},[s("span",null,"订单模块配置")],-1)])),default:t(()=>[o(T,{column:1,border:""},{default:t(()=>[o(U,null,{label:t(()=>l[26]||(l[26]=[f("签约企业服务商")])),default:t(()=>[o(j,{modelValue:m.order.serviceProvider,"onUpdate:modelValue":l[14]||(l[14]=e=>m.order.serviceProvider=e)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})):y("",!0)])):y("",!0),c.value===4?(a(),p("div",Ve,[o(q,null,{header:t(()=>l[27]||(l[27]=[s("div",{class:"card-header"},[s("span",null,"配置信息总览")],-1)])),default:t(()=>[o(T,{column:1,border:""},{default:t(()=>[o(U,{label:"问卷调查信息"},{default:t(()=>[s("div",null,"企业规模："+b(i.companySize||"未填写"),1),s("div",null,"所属行业："+b(i.industry||"未填写"),1),s("div",null,"差旅频率："+b(i.travelFrequency||"未填写"),1),s("div",null,"常用费用类型："+b(i.expenseTypes.join("、")||"未选择"),1),s("div",null,"期望审批层级："+b(i.approvalLevels||"未选择"),1)]),_:1}),o(U,{label:"已选择模块"},{default:t(()=>[n.basic?(a(),u(E,{key:0,class:"mr-2"},{default:t(()=>l[28]||(l[28]=[f("基础模块")])),_:1})):y("",!0),n.budget?(a(),u(E,{key:1,type:"success",class:"mr-2"},{default:t(()=>l[29]||(l[29]=[f("预算模块")])),_:1})):y("",!0),n.ledger?(a(),u(E,{key:2,type:"warning",class:"mr-2"},{default:t(()=>l[30]||(l[30]=[f("总账模块")])),_:1})):y("",!0),n.order?(a(),u(E,{key:3,type:"danger"},{default:t(()=>l[31]||(l[31]=[f("订单模块")])),_:1})):y("",!0)]),_:1}),o(U,{label:"模板配置"},{default:t(()=>{var e,v;return[s("div",null,"已选角色："+b(d.roles.join("、")||"未选择"),1),s("div",null,"已选单据："+b(d.documents.join("、")||"未选择"),1),s("div",null,"申请单审批流程："+b(d.approvalFlow?(e=k.approvalFlows.find(z=>z.value===d.approvalFlow))==null?void 0:e.label:"未选择"),1),s("div",null,"报销单审批流程："+b(d.reimbursementFlow?(v=k.reimbursementFlows.find(z=>z.value===d.reimbursementFlow))==null?void 0:v.label:"未选择"),1)]}),_:1})]),_:1})]),_:1})])):y("",!0)])]),_:1},8,["model-value"])}}},ke=K(we,[["__scopeId","data-v-b492547b"]]),Fe={class:"home-container"},Ce={class:"card-content"},xe={class:"card-text"},Se={__name:"Home",setup(R){const D=pe(),F=$(!1),c=$(!1);te(()=>{localStorage.getItem("setupCompleted")||(c.value=!0,F.value=!0),window.addEventListener("open-setup-wizard",()=>{F.value=!0})});const i=w=>{console.log("配置完成:",w)},d=$([{title:"配置向导",desc:"系统功能配置与初始化",icon:oe,path:"",color:"#9C27B0",onClick:()=>{F.value=!0}},{title:"费用申请",desc:"创建新的费用申请单",icon:A,path:"/expense-application",color:"#409EFF"},{title:"费用审批",desc:"审批待处理的费用申请",icon:ae,path:"/expense-approval",color:"#67C23A"},{title:"报销管理",desc:"管理报销单据和流程",icon:se,path:"/reimbursement",color:"#E6A23C"},{title:"预算管理",desc:"设置和监控部门预算",icon:ne,path:"/budget-management",color:"#F56C6C"},{title:"费用统计",desc:"查看费用统计报表",icon:ue,path:"/expense-statistics",color:"#909399"},{title:"单据管理",desc:"管理系统单据模板",icon:A,path:"/document-management",color:"#3F51B5"},{title:"流程管理",desc:"配置审批流程和节点",icon:re,path:"/workflow-management",color:"#00BCD4"},{title:"差标管理",desc:"管理差旅标准和补贴",icon:de,path:"/difference-standard-management",color:"#795548"},{title:"风险控制",desc:"管理风险控制规则",icon:ie,path:"/risk-control-management",color:"#FF9800"},{title:"合同付款",desc:"管理合同付款计划",icon:A,path:"/contract-payment",color:"#607D8B"}]),m=w=>{D.push(w)};return(w,k)=>{const L=r("el-col"),W=r("el-row"),N=r("el-icon"),O=r("el-card");return a(),p("div",Fe,[o(W,{class:"mb-4"},{default:t(()=>[o(L,{span:24,class:"header-actions"},{default:t(()=>k[1]||(k[1]=[s("h1",{class:"welcome-title"},"欢迎使用企业费控系统",-1),s("p",{class:"welcome-subtitle"},"高效管理企业费用，助力业务发展",-1)])),_:1})]),_:1}),o(W,{gutter:20},{default:t(()=>[(a(!0),p(V,null,g(d.value,_=>(a(),u(L,{key:_.path||_.title,xs:24,sm:12,md:8,lg:8,xl:8},{default:t(()=>[o(O,{class:"menu-card",shadow:"hover",onClick:H=>_.onClick?_.onClick():m(_.path)},{default:t(()=>[s("div",Ce,[o(N,{style:me({color:_.color}),size:40},{default:t(()=>[(a(),u(ce(_.icon)))]),_:2},1032,["style"]),s("div",xe,[s("h3",null,b(_.title),1),s("p",null,b(_.desc),1)])])]),_:2},1032,["onClick"])]),_:2},1024))),128))]),_:1}),o(ke,{visible:F.value,"onUpdate:visible":k[0]||(k[0]=_=>F.value=_),onFinish:i},null,8,["visible"])])}}},ze=K(Se,[["__scopeId","data-v-80729ea1"]]);export{ze as default};
