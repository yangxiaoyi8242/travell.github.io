import{_ as ge,r as N,a as V,k as fe,c as f,o as r,d as l,w as t,e as u,B as ve,F as B,i as $,g as c,D as S,m as be,b as j,C as _e,n as we,N as ke,h as T,t as D,j as z,I as Ve,x as Te,H as Ce,E as v,J as q}from"./index-D4YcMouI.js";const he={class:"risk-control-management"},xe={class:"table-operations"},Se={class:"left-operations"},ze={class:"pagination-container"},Ue={key:1},Be={class:"dialog-footer"},$e={__name:"RiskControlManagement",setup(je){const L=[{value:"all",label:"全部"},{value:"enabled",label:"启用"},{value:"disabled",label:"停用"}],M=[{value:"all",label:"全部"},{value:"reimbursement",label:"报销规范性"},{value:"payment",label:"付款合理性"},{value:"invoice",label:"票据合规性"},{value:"document",label:"单据合规性"}],J=[{value:"reject",label:"拒绝提交"},{value:"warn",label:"警告提示"}],d=N({name:"",status:"all",category:"all"}),y=V([{id:1,name:"支付日期与发票日期不超X天",category:"reimbursement",status:"enabled",description:"支付日期早于发票日期合规性校验",controlType:"warn",params:{days:30}},{id:2,name:"报销总金额不超过预算审批金额",category:"reimbursement",status:"enabled",description:"报销总金额不超过预算审批金额",controlType:"reject",params:{}},{id:3,name:"支付凭证金额与发票金额一致",category:"reimbursement",status:"enabled",description:"支付凭证总金额是否与发票总金额一致",controlType:"warn",params:{}},{id:4,name:"未触发一日多餐",category:"reimbursement",status:"enabled",description:"一日多餐高风险提醒",controlType:"warn",params:{}},{id:5,name:"发票金额与行程单总金额一致性校验（车辆交通）",category:"reimbursement",status:"enabled",description:"发票金额与订单金额校验",controlType:"warn",params:{tolerance:5}},{id:6,name:"支付结算信息与税局登记账户信息校验",category:"payment",status:"enabled",description:"发票信息真伪",controlType:"reject",params:{}},{id:7,name:"发票日期与提单日期未超过60天",category:"invoice",status:"enabled",description:"发票日期取得后，提单日期过晚",controlType:"warn",params:{days:60}},{id:8,name:"发票敏感词汇校验",category:"invoice",status:"enabled",description:"发票敏感词汇校验",controlType:"reject",params:{keywords:["夜总会","酒吧","游戏厅","棋牌室"]}},{id:9,name:"借款未核销",category:"reimbursement",status:"enabled",description:"提交报销时，检查是否还有未核销借款",controlType:"warn",params:{}},{id:10,name:"单据未占用任何预算",category:"document",status:"enabled",description:"提交单据时，检查是否没有占用任何预算方案",controlType:"warn",params:{}},{id:11,name:"发票抬头范围校验",category:"invoice",status:"enabled",description:"录入发票时，检查员工是否拥有此抬头发票权限",controlType:"reject",params:{}}]),O=V(!1),g=V([]),m=N({currentPage:1,pageSize:10,total:y.value.length}),b=V(!1),C=V(""),P=V(""),F=V(null),o=N({id:"",name:"",category:"",status:"enabled",description:"",controlType:"warn",params:{}}),_=N({keywords:[]}),A={name:[{required:!0,message:"请输入规则名称",trigger:"blur"}],category:[{required:!0,message:"请选择规则分类",trigger:"change"}],controlType:[{required:!0,message:"请选择控制方式",trigger:"change"}]},G=n=>({reimbursement:"",payment:"success",invoice:"warning",document:"info"})[n]||"",Q=n=>{const e=M.find(s=>s.value===n);return e?e.label:""},W=n=>{const e=J.find(s=>s.value===n);return e?e.label:""},U=()=>{O.value=!0,setTimeout(()=>{const n=y.value.filter(e=>{const s=d.name?e.name.includes(d.name):!0,i=d.status==="all"?!0:e.status===d.status,h=d.category==="all"?!0:e.category===d.category;return s&&i&&h});m.total=n.length,O.value=!1},300)},Y=()=>{Object.assign(d,{name:"",status:"all",category:"all"}),U()},Z=n=>{g.value=n},ee=n=>{m.pageSize=n,U()},ae=n=>{m.currentPage=n,U()},le=n=>{F.value=n,C.value="edit",P.value="编辑风险控制规则",b.value=!0,Object.assign(o,{id:n.id,name:n.name,category:n.category,status:n.status,description:n.description,controlType:n.controlType,params:JSON.parse(JSON.stringify(n.params||{}))})},te=n=>{if(n.name!=="发票敏感词汇校验"){v.warning("只有发票敏感词汇校验规则可以编辑敏感词");return}F.value=n,C.value="keywords",P.value="编辑敏感词",b.value=!0,_.keywords=[...n.params.keywords||[]]},ne=n=>{const e=n.status==="enabled"?"disabled":"enabled",s=e==="enabled"?"启用":"停用";q.confirm(`确定要${s}规则「${n.name}」吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{setTimeout(()=>{n.status=e,v.success(`已${s}规则「${n.name}」`)},300)}).catch(()=>{})},oe=()=>{if(g.value.length===0){v.warning("请至少选择一条规则");return}q.confirm(`确定要启用选中的 ${g.value.length} 条规则吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{setTimeout(()=>{g.value.forEach(n=>{const e=y.value.find(s=>s.id===n.id);e&&(e.status="enabled")}),v.success(`已启用 ${g.value.length} 条规则`)},300)}).catch(()=>{})},se=()=>{if(g.value.length===0){v.warning("请至少选择一条规则");return}q.confirm(`确定要停用选中的 ${g.value.length} 条规则吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{setTimeout(()=>{g.value.forEach(n=>{const e=y.value.find(s=>s.id===n.id);e&&(e.status="disabled")}),v.success(`已停用 ${g.value.length} 条规则`)},300)}).catch(()=>{})},re=()=>{C.value==="edit"?setTimeout(()=>{const n=y.value.findIndex(e=>e.id===o.id);n!==-1&&(y.value[n]={...y.value[n],...o}),b.value=!1,v.success("规则已更新")},300):C.value==="keywords"&&setTimeout(()=>{const n=y.value.findIndex(e=>e.id===F.value.id);n!==-1&&(y.value[n].params.keywords=[..._.keywords]),b.value=!1,v.success("敏感词已更新")},300)},ue=()=>{_.keywords.push("")},de=n=>{_.keywords.splice(n,1)};return fe(()=>{U()}),(n,e)=>{const s=u("el-input"),i=u("el-form-item"),h=u("el-option"),E=u("el-select"),x=u("el-icon"),p=u("el-button"),K=u("el-form"),X=u("el-card"),w=u("el-table-column"),I=u("el-tag"),ie=u("el-table"),ce=u("el-pagination"),me=u("el-switch"),R=u("el-input-number"),pe=u("el-dialog"),ye=ve("loading");return r(),f("div",he,[l(X,{class:"search-card"},{default:t(()=>[l(K,{inline:!0,model:d},{default:t(()=>[l(i,{label:"规则名称"},{default:t(()=>[l(s,{modelValue:d.name,"onUpdate:modelValue":e[0]||(e[0]=a=>d.name=a),placeholder:"请输入规则名称",clearable:""},null,8,["modelValue"])]),_:1}),l(i,{label:"规则状态"},{default:t(()=>[l(E,{modelValue:d.status,"onUpdate:modelValue":e[1]||(e[1]=a=>d.status=a),placeholder:"请选择规则状态",clearable:""},{default:t(()=>[(r(),f(B,null,$(L,a=>l(h,{key:a.value,label:a.label,value:a.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),l(i,{label:"规则分类"},{default:t(()=>[l(E,{modelValue:d.category,"onUpdate:modelValue":e[2]||(e[2]=a=>d.category=a),placeholder:"请选择规则分类",clearable:""},{default:t(()=>[(r(),f(B,null,$(M,a=>l(h,{key:a.value,label:a.label,value:a.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),l(i,null,{default:t(()=>[l(p,{type:"primary",onClick:U},{default:t(()=>[l(x,null,{default:t(()=>[l(S(be))]),_:1}),e[15]||(e[15]=c(" 查询 "))]),_:1}),l(p,{onClick:Y},{default:t(()=>e[16]||(e[16]=[c(" 重置 ")])),_:1})]),_:1})]),_:1},8,["model"])]),_:1}),l(X,{class:"table-card"},{default:t(()=>[j("div",xe,[j("div",Se,[l(p,{type:"primary",onClick:oe},{default:t(()=>[l(x,null,{default:t(()=>[l(S(we))]),_:1}),e[17]||(e[17]=c(" 批量启用 "))]),_:1}),l(p,{type:"danger",onClick:se},{default:t(()=>[l(x,null,{default:t(()=>[l(S(ke))]),_:1}),e[18]||(e[18]=c(" 批量停用 "))]),_:1})])]),_e((r(),T(ie,{data:y.value.slice((m.currentPage-1)*m.pageSize,m.currentPage*m.pageSize),border:"",style:{width:"100%"},onSelectionChange:Z},{default:t(()=>[l(w,{type:"selection",width:"55"}),l(w,{prop:"name",label:"规则名称","min-width":"200","show-overflow-tooltip":""}),l(w,{label:"规则分类",width:"120"},{default:t(a=>[l(I,{type:G(a.row.category)},{default:t(()=>[c(D(Q(a.row.category)),1)]),_:2},1032,["type"])]),_:1}),l(w,{label:"规则状态",width:"100"},{default:t(a=>[l(I,{type:a.row.status==="enabled"?"success":"info"},{default:t(()=>[c(D(a.row.status==="enabled"?"启用":"停用"),1)]),_:2},1032,["type"])]),_:1}),l(w,{label:"控制方式",width:"100"},{default:t(a=>[l(I,{type:a.row.controlType==="reject"?"danger":"warning"},{default:t(()=>[c(D(W(a.row.controlType)),1)]),_:2},1032,["type"])]),_:1}),l(w,{prop:"description",label:"规则说明","min-width":"200","show-overflow-tooltip":""}),l(w,{label:"操作",width:"180"},{default:t(a=>[l(p,{type:"primary",size:"small",onClick:k=>le(a.row)},{default:t(()=>[l(x,null,{default:t(()=>[l(S(Ve))]),_:1}),e[19]||(e[19]=c(" 编辑 "))]),_:2},1032,["onClick"]),a.row.name==="发票敏感词汇校验"?(r(),T(p,{key:0,type:"warning",size:"small",onClick:k=>te(a.row)},{default:t(()=>[l(x,null,{default:t(()=>[l(S(Te))]),_:1}),e[20]||(e[20]=c(" 敏感词 "))]),_:2},1032,["onClick"])):z("",!0),l(p,{type:a.row.status==="enabled"?"danger":"success",size:"small",onClick:k=>ne(a.row)},{default:t(()=>[c(D(a.row.status==="enabled"?"停用":"启用"),1)]),_:2},1032,["type","onClick"])]),_:1})]),_:1},8,["data"])),[[ye,O.value]]),j("div",ze,[l(ce,{"current-page":m.currentPage,"onUpdate:currentPage":e[3]||(e[3]=a=>m.currentPage=a),"page-size":m.pageSize,"onUpdate:pageSize":e[4]||(e[4]=a=>m.pageSize=a),"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next, jumper",total:m.total,onSizeChange:ee,onCurrentChange:ae},null,8,["current-page","page-size","total"])])]),_:1}),l(pe,{modelValue:b.value,"onUpdate:modelValue":e[14]||(e[14]=a=>b.value=a),title:P.value,width:"50%","destroy-on-close":""},{footer:t(()=>[j("span",Be,[l(p,{onClick:e[13]||(e[13]=a=>b.value=!1)},{default:t(()=>e[23]||(e[23]=[c("取消")])),_:1}),l(p,{type:"primary",onClick:re},{default:t(()=>e[24]||(e[24]=[c("确定")])),_:1})])]),default:t(()=>[C.value==="edit"?(r(),T(K,{key:0,ref:"formRef",model:o,rules:A,"label-width":"100px"},{default:t(()=>[l(i,{label:"规则名称",prop:"name"},{default:t(()=>[l(s,{modelValue:o.name,"onUpdate:modelValue":e[5]||(e[5]=a=>o.name=a),placeholder:"请输入规则名称",disabled:!0},null,8,["modelValue"])]),_:1}),l(i,{label:"规则分类",prop:"category"},{default:t(()=>[l(E,{modelValue:o.category,"onUpdate:modelValue":e[6]||(e[6]=a=>o.category=a),placeholder:"请选择规则分类",disabled:!0},{default:t(()=>[(r(!0),f(B,null,$(M.filter(a=>a.value!=="all"),a=>(r(),T(h,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),l(i,{label:"控制方式",prop:"controlType"},{default:t(()=>[l(E,{modelValue:o.controlType,"onUpdate:modelValue":e[7]||(e[7]=a=>o.controlType=a),placeholder:"请选择控制方式"},{default:t(()=>[(r(),f(B,null,$(J,a=>l(h,{key:a.value,label:a.label,value:a.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),l(i,{label:"规则状态"},{default:t(()=>[l(me,{modelValue:o.status,"onUpdate:modelValue":e[8]||(e[8]=a=>o.status=a),"active-value":"enabled","inactive-value":"disabled","active-text":"启用","inactive-text":"停用"},null,8,["modelValue"])]),_:1}),l(i,{label:"规则说明"},{default:t(()=>[l(s,{modelValue:o.description,"onUpdate:modelValue":e[9]||(e[9]=a=>o.description=a),type:"textarea",rows:"3",placeholder:"请输入规则说明"},null,8,["modelValue"])]),_:1}),o.name==="支付日期与发票日期不超X天"?(r(),T(i,{key:0,label:"天数"},{default:t(()=>[l(R,{modelValue:o.params.days,"onUpdate:modelValue":e[10]||(e[10]=a=>o.params.days=a),min:1,max:365},null,8,["modelValue"])]),_:1})):z("",!0),o.name==="发票日期与提单日期未超过60天"?(r(),T(i,{key:1,label:"天数"},{default:t(()=>[l(R,{modelValue:o.params.days,"onUpdate:modelValue":e[11]||(e[11]=a=>o.params.days=a),min:1,max:365},null,8,["modelValue"])]),_:1})):z("",!0),o.name==="发票金额与行程单总金额一致性校验（车辆交通）"?(r(),T(i,{key:2,label:"误差容忍度(%)"},{default:t(()=>[l(R,{modelValue:o.params.tolerance,"onUpdate:modelValue":e[12]||(e[12]=a=>o.params.tolerance=a),min:0,max:20,step:.5},null,8,["modelValue"])]),_:1})):z("",!0)]),_:1},8,["model"])):z("",!0),C.value==="keywords"?(r(),f("div",Ue,[e[22]||(e[22]=j("p",{class:"keywords-tip"},"请添加或编辑敏感词，发票内容包含这些词汇将被拦截",-1)),(r(!0),f(B,null,$(_.keywords,(a,k)=>(r(),f("div",{key:k,class:"keyword-item"},[l(s,{modelValue:_.keywords[k],"onUpdate:modelValue":H=>_.keywords[k]=H,placeholder:"请输入敏感词"},null,8,["modelValue","onUpdate:modelValue"]),l(p,{type:"danger",onClick:H=>de(k)},{default:t(()=>[l(x,null,{default:t(()=>[l(S(Ce))]),_:1})]),_:2},1032,["onClick"])]))),128)),l(p,{type:"primary",onClick:ue,class:"add-keyword-btn"},{default:t(()=>e[21]||(e[21]=[c(" 添加敏感词 ")])),_:1})])):z("",!0)]),_:1},8,["modelValue","title"])])}}},Ne=ge($e,[["__scopeId","data-v-d10983a1"]]);export{Ne as default};
