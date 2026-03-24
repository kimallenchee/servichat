import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ═══════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════
const CATEGORIES = [
  { id: "garden", label: "Landscaping", icon: "🌴", color: "#2D6A4F" },
  { id: "ac", label: "AC & Cooling", icon: "❄️", color: "#0077B6" },
  { id: "plumbing", label: "Plumbing", icon: "🔧", color: "#E76F51" },
  { id: "electric", label: "Electrical", icon: "⚡", color: "#D4A017" },
  { id: "cleaning", label: "Cleaning", icon: "✨", color: "#8338EC" },
  { id: "construction", label: "Construction", icon: "🏗️", color: "#6B4226" },
];

const AVATARS = ["👨‍🔧","👩‍🔧","👷","👷‍♀️","🧑‍🔧","👨‍🌾","👩‍🌾","🧔","👩","🧑","👨‍🎨","👩‍🎨","🧑‍💼","👨‍💼","👩‍💼","🧑‍🏭"];

const DISTRICTS = [
  { name: "Belize", capital: "Belize City" },
  { name: "Cayo", capital: "San Ignacio" },
  { name: "Orange Walk", capital: "Orange Walk Town" },
  { name: "Corozal", capital: "Corozal Town" },
  { name: "Stann Creek", capital: "Dangriga" },
  { name: "Toledo", capital: "Punta Gorda" },
];

const LOCATIONS = [
  "Belize City","Ladyville","Hattieville","Burrell Boom","Crooked Tree","Bermudian Landing",
  "San Pedro (Ambergris Caye)","Caye Caulker",
  "Belmopan","San Ignacio","Santa Elena","Benque Viejo del Carmen","Spanish Lookout","Bullet Tree Falls","Georgeville","San Antonio (Cayo)","Valley of Peace","Roaring Creek",
  "Orange Walk Town","San Estevan","Trial Farm","Guinea Grass","Yo Creek","August Pine Ridge","Shipyard","Tower Hill","Indian Church",
  "Corozal Town","Consejo","Sarteneja","Chunox","Copper Bank","Progresso","Ranchito",
  "Dangriga","Placencia","Hopkins","Independence","Sittee River","Maya Beach","Seine Bight","Red Bank","Pomona","Mullins River",
  "Punta Gorda","Big Falls","San Pedro Columbia","San Antonio (Toledo)","Blue Creek (Toledo)","Barranco","Monkey River Town",
];

const LC = {
  "Belize City":{lat:17.4989,lng:-88.1886,d:"Belize"},"Ladyville":{lat:17.5356,lng:-88.2286,d:"Belize"},"Hattieville":{lat:17.4667,lng:-88.3833,d:"Belize"},"Burrell Boom":{lat:17.5558,lng:-88.3817,d:"Belize"},"Crooked Tree":{lat:17.7833,lng:-88.5333,d:"Belize"},"Bermudian Landing":{lat:17.5500,lng:-88.4167,d:"Belize"},
  "San Pedro (Ambergris Caye)":{lat:17.9214,lng:-87.9611,d:"Belize"},"Caye Caulker":{lat:17.7467,lng:-88.0250,d:"Belize"},
  "Belmopan":{lat:17.2514,lng:-88.7590,d:"Cayo"},"San Ignacio":{lat:17.1592,lng:-89.0694,d:"Cayo"},"Santa Elena":{lat:17.1600,lng:-89.0600,d:"Cayo"},"Benque Viejo del Carmen":{lat:17.0750,lng:-89.1378,d:"Cayo"},"Spanish Lookout":{lat:17.2167,lng:-88.8833,d:"Cayo"},"Bullet Tree Falls":{lat:17.1833,lng:-89.0833,d:"Cayo"},"Georgeville":{lat:17.1467,lng:-88.9733,d:"Cayo"},"San Antonio (Cayo)":{lat:17.0500,lng:-88.9833,d:"Cayo"},"Valley of Peace":{lat:17.3000,lng:-88.6833,d:"Cayo"},"Roaring Creek":{lat:17.2500,lng:-88.6667,d:"Cayo"},
  "Orange Walk Town":{lat:18.0908,lng:-88.5539,d:"Orange Walk"},"San Estevan":{lat:18.0167,lng:-88.5333,d:"Orange Walk"},"Trial Farm":{lat:18.1333,lng:-88.5500,d:"Orange Walk"},"Guinea Grass":{lat:18.0000,lng:-88.4833,d:"Orange Walk"},"Yo Creek":{lat:18.1333,lng:-88.6000,d:"Orange Walk"},"August Pine Ridge":{lat:18.0667,lng:-88.6500,d:"Orange Walk"},"Shipyard":{lat:17.9500,lng:-88.7333,d:"Orange Walk"},"Tower Hill":{lat:18.0167,lng:-88.5667,d:"Orange Walk"},"Indian Church":{lat:17.7667,lng:-88.6500,d:"Orange Walk"},
  "Corozal Town":{lat:18.3917,lng:-88.3944,d:"Corozal"},"Consejo":{lat:18.4667,lng:-88.3833,d:"Corozal"},"Sarteneja":{lat:18.3667,lng:-88.1500,d:"Corozal"},"Chunox":{lat:18.2333,lng:-88.3333,d:"Corozal"},"Copper Bank":{lat:18.2667,lng:-88.2333,d:"Corozal"},"Progresso":{lat:18.3500,lng:-88.4167,d:"Corozal"},"Ranchito":{lat:18.3833,lng:-88.4167,d:"Corozal"},
  "Dangriga":{lat:16.9686,lng:-88.2269,d:"Stann Creek"},"Placencia":{lat:16.5147,lng:-88.3653,d:"Stann Creek"},"Hopkins":{lat:16.8167,lng:-88.2500,d:"Stann Creek"},"Independence":{lat:16.5333,lng:-88.4000,d:"Stann Creek"},"Sittee River":{lat:16.8000,lng:-88.2667,d:"Stann Creek"},"Maya Beach":{lat:16.5500,lng:-88.3667,d:"Stann Creek"},"Seine Bight":{lat:16.5333,lng:-88.3500,d:"Stann Creek"},"Red Bank":{lat:16.6333,lng:-88.5500,d:"Stann Creek"},"Pomona":{lat:17.0333,lng:-88.4833,d:"Stann Creek"},"Mullins River":{lat:17.1167,lng:-88.3167,d:"Stann Creek"},
  "Punta Gorda":{lat:16.0986,lng:-88.8097,d:"Toledo"},"Big Falls":{lat:16.1667,lng:-88.8167,d:"Toledo"},"San Pedro Columbia":{lat:16.2500,lng:-88.8000,d:"Toledo"},"San Antonio (Toledo)":{lat:16.2500,lng:-89.0167,d:"Toledo"},"Blue Creek (Toledo)":{lat:16.2000,lng:-89.0833,d:"Toledo"},"Barranco":{lat:15.9833,lng:-88.8833,d:"Toledo"},"Monkey River Town":{lat:16.3667,lng:-88.4833,d:"Toledo"},
};

const STATUSES = {
  pending: { label: "Pending", color: "#F59E0B", icon: "⏳" },
  accepted: { label: "Accepted", color: "#3B82F6", icon: "👍" },
  in_progress: { label: "In Progress", color: "#8B5CF6", icon: "🔨" },
  completed: { label: "Completed", color: "#10B981", icon: "✅" },
  declined: { label: "Declined", color: "#EF4444", icon: "✗" },
  cancelled: { label: "Cancelled", color: "#6B7280", icon: "⊘" },
};

const SEED_PROVIDERS = [
  { id:"seed-1",name:"Erwin Gutierrez",category:"garden",avatar:"👨‍🌾",rating:4.8,reviews:87,verified:true,location:"Belize City",districts:["Belize"],bio:"20 years in tropical landscaping across the Belize District. Lawn care, palm trimming, yard cleanup and full garden design.",services:[{name:"Yard Cleanup",price:"$75 BZD",duration:"2 hrs"},{name:"Lawn Maintenance",price:"$100 BZD",duration:"2-3 hrs"},{name:"Palm & Tree Trimming",price:"$200 BZD",duration:"Half day"},{name:"Full Garden Design",price:"$600 BZD",duration:"2 days"}],availability:"Mon–Sat, 6AM–4PM",whatsapp:"5016000001",ratings:[] },
  { id:"seed-2",name:"Desiree Flores",category:"cleaning",avatar:"👩",rating:4.9,reviews:143,verified:true,location:"San Pedro (Ambergris Caye)",districts:["Belize"],bio:"Deep cleaning specialist for vacation rentals, condos and homes on the island. Eco-friendly products. Team of 3.",services:[{name:"Condo Turnover Clean",price:"$150 BZD",duration:"2-3 hrs"},{name:"Deep Clean (House)",price:"$300 BZD",duration:"4-5 hrs"},{name:"Weekly Service",price:"$120 BZD/week",duration:"2 hrs"}],availability:"Mon–Sun, 7AM–5PM",whatsapp:"5016000002",ratings:[] },
  { id:"seed-3",name:"Marcus Hyde",category:"ac",avatar:"🧔",rating:4.7,reviews:112,verified:true,location:"Belmopan",districts:["Cayo","Belize"],bio:"Certified AC tech covering Cayo and Belize Districts. Carrier, LG, Samsung — all brands. Emergency same-day service.",services:[{name:"AC Diagnostic",price:"$80 BZD",duration:"1 hr"},{name:"Full Service & Clean",price:"$150 BZD",duration:"2 hrs"},{name:"Mini-Split Installation",price:"$800 BZD",duration:"Half day"},{name:"Emergency Repair",price:"$250+ BZD",duration:"Varies"}],availability:"Mon–Sat, 7AM–6PM",whatsapp:"5016000003",ratings:[] },
  { id:"seed-4",name:"Sofia Martinez",category:"electric",avatar:"👩‍🔧",rating:4.6,reviews:78,verified:true,location:"Orange Walk Town",districts:["Orange Walk","Corozal"],bio:"Licensed electrician. Residential wiring, panel upgrades, generator installs. Serving Orange Walk and Corozal.",services:[{name:"Electrical Inspection",price:"$100 BZD",duration:"1.5 hrs"},{name:"Outlet/Switch Install",price:"$40 BZD/unit",duration:"30 min"},{name:"Panel Upgrade",price:"$1,200 BZD",duration:"Full day"},{name:"Generator Install",price:"$2,000 BZD",duration:"1-2 days"}],availability:"Mon–Fri, 7AM–5PM",whatsapp:"5016000004",ratings:[] },
  { id:"seed-5",name:"Michael Palacio",category:"plumbing",avatar:"👷",rating:4.5,reviews:65,verified:false,location:"Dangriga",districts:["Stann Creek"],bio:"Reliable plumber covering Stann Creek. Leak repairs, drain clearing, water heater installs, bathroom plumbing.",services:[{name:"Leak Repair",price:"$80 BZD",duration:"1-2 hrs"},{name:"Drain Unclog",price:"$60 BZD",duration:"1 hr"},{name:"Water Heater Install",price:"$500 BZD",duration:"Half day"}],availability:"Mon–Fri, 8AM–5PM",whatsapp:"5016000005",ratings:[] },
  { id:"seed-6",name:"Roberto Cal",category:"construction",avatar:"🧑‍🔧",rating:4.8,reviews:92,verified:true,location:"San Ignacio",districts:["Cayo"],bio:"General contractor — home builds, additions, renovations, concrete work. 12 years building across western Belize.",services:[{name:"Concrete Slab",price:"$2,500+ BZD",duration:"3-5 days"},{name:"Room Addition",price:"$8,000+ BZD",duration:"2-4 weeks"},{name:"Kitchen Reno",price:"$5,000+ BZD",duration:"1-2 weeks"},{name:"Fencing / Walls",price:"$1,500+ BZD",duration:"2-3 days"}],availability:"Mon–Sat, 6AM–4PM",whatsapp:"5016000006",ratings:[] },
  { id:"seed-7",name:"Janet Usher",category:"cleaning",avatar:"👩‍💼",rating:4.4,reviews:34,verified:false,location:"Placencia",districts:["Stann Creek"],bio:"Vacation rental cleaning and property management on the peninsula. Turnover service for Airbnb hosts.",services:[{name:"Turnover Clean",price:"$120 BZD",duration:"2 hrs"},{name:"Deep Clean",price:"$250 BZD",duration:"4 hrs"},{name:"Laundry Service",price:"$50 BZD",duration:"Same day"}],availability:"Mon–Sun, 6AM–6PM",whatsapp:"5016000007",ratings:[] },
  { id:"seed-8",name:"Felix Canto",category:"ac",avatar:"🧑",rating:4.3,reviews:41,verified:false,location:"Corozal Town",districts:["Corozal","Orange Walk"],bio:"Budget-friendly AC service in the north. Residential units only. Honest pricing, no hidden charges.",services:[{name:"Basic Service",price:"$70 BZD",duration:"1.5 hrs"},{name:"Gas Recharge",price:"$200 BZD",duration:"1 hr"},{name:"Filter Replacement",price:"$50 BZD",duration:"30 min"}],availability:"Tue–Sat, 8AM–4PM",whatsapp:"5016000008",ratings:[] },
  { id:"seed-9",name:"Carmen Rhaburn",category:"garden",avatar:"👩‍🌾",rating:4.7,reviews:56,verified:true,location:"Hopkins",districts:["Stann Creek","Toledo"],bio:"Coconut farm maintenance, beachfront landscaping, tropical garden specialist. Born and raised in Stann Creek.",services:[{name:"Beach Property Cleanup",price:"$120 BZD",duration:"3 hrs"},{name:"Coconut Tree Service",price:"$80 BZD/tree",duration:"1 hr"},{name:"Garden Design",price:"$400 BZD",duration:"Full day"}],availability:"Mon–Sat, 6AM–3PM",whatsapp:"5016000009",ratings:[] },
  { id:"seed-10",name:"David Chun",category:"electric",avatar:"👨‍🔧",rating:4.9,reviews:128,verified:true,location:"Belize City",districts:["Belize","Cayo"],bio:"Master electrician. Commercial and residential. Solar panel installs, smart wiring, full house rewiring.",services:[{name:"House Rewiring",price:"$3,000+ BZD",duration:"3-5 days"},{name:"Solar Panel Install",price:"$5,000+ BZD",duration:"2-3 days"},{name:"Smart Home Wiring",price:"$1,500 BZD",duration:"Full day"},{name:"Emergency Call",price:"$150 BZD",duration:"1-2 hrs"}],availability:"Mon–Fri, 7AM–6PM",whatsapp:"5016000010",ratings:[] },
];

// ═══════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════
function getDist(lat1,lng1,lat2,lng2){const R=6371,dLat=((lat2-lat1)*Math.PI)/180,dLng=((lng2-lng1)*Math.PI)/180,a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function pC(p){return LC[p.location]||LC["Belize City"];}
function dOf(loc){return LC[loc]?.d||"Unknown";}
function gid(){return"p-"+Date.now()+"-"+Math.random().toString(36).slice(2,8);}
function waLink(num,msg){return`https://wa.me/${num.replace(/[^0-9]/g,"")}${msg?`?text=${encodeURIComponent(msg)}`:""}`;}
function fmtDate(d){try{return new Date(d).toLocaleDateString("en-BZ",{month:"short",day:"numeric",year:"numeric"});}catch{return d;}}

if(!window._ms)window._ms={};
function useMS(key,init){
  const [val,setVal]=useState(()=>window._ms[key]!==undefined?window._ms[key]:init);
  const set=useCallback(v=>{setVal(prev=>{const next=typeof v==="function"?v(prev):v;window._ms[key]=next;return next;});},[key]);
  return[val,set];
}

// ═══════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════
const T="#00695C";

function Stars({rating,size=13}){const r=typeof rating==="number"?rating:0;return (<span style={{color:"#F59E0B",letterSpacing:-1,fontSize:size}}>{"★".repeat(Math.floor(r))}{r%1>=0.5?"½":""}<span style={{color:"#D1D5DB"}}>{"★".repeat(5-Math.ceil(r))}</span><span style={{color:"#6B7280",marginLeft:4,fontSize:size-1,letterSpacing:0}}>{r.toFixed(1)}</span></span>);}

function Btn({children,bg=T,color="#fff",onClick,disabled,full,style:sx,...r}){return (<button onClick={onClick} disabled={disabled} style={{background:disabled?"#D1D5DB":bg,color,border:"none",borderRadius:12,padding:"12px 18px",fontSize:14,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",width:full?"100%":undefined,transition:"all .15s",opacity:disabled?.6:1,...(sx||{})}} {...r}>{children}</button>);}

function Inp({label,...p}){return (<label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block"}}>{label}<input {...p} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"2px solid #E5E7EB",fontSize:14,marginTop:6,fontFamily:"inherit",boxSizing:"border-box",outline:"none",...(p.style||{})}} onFocus={e=>e.target.style.borderColor=T} onBlur={e=>e.target.style.borderColor="#E5E7EB"}/></label>);}

function Sel({label,children,...p}){return (<label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block"}}>{label}<select {...p} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"2px solid #E5E7EB",fontSize:14,marginTop:6,fontFamily:"inherit",boxSizing:"border-box",background:"#fff",appearance:"auto",outline:"none",...(p.style||{})}}>{children}</select></label>);}

function Empty({icon,title,sub}){return (<div style={{textAlign:"center",padding:40,color:"#9CA3AF"}}><div style={{fontSize:48,marginBottom:12}}>{icon}</div><div style={{fontWeight:600,color:"#6B7280"}}>{title}</div>{sub&&<div style={{fontSize:13,marginTop:4}}>{sub}</div>}</div>);}

function Pill({label,active,color=T,onClick}){return (<button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,border:active?`2px solid ${color}`:"2px solid #E5E7EB",background:active?color+"15":"#fff",color:active?color:"#6B7280",fontWeight:active?700:500,fontSize:12,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap",fontFamily:"inherit"}}>{label}</button>);}

function CatPill({cat,active,onClick}){const a=active===cat.id;return (<button onClick={()=>onClick(cat.id)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:24,border:a?`2px solid ${cat.color}`:"2px solid #E5E7EB",background:a?cat.color+"18":"#fff",color:a?cat.color:"#374151",fontWeight:a?700:500,fontSize:13,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap",fontFamily:"inherit"}}><span style={{fontSize:16}}>{cat.icon}</span>{cat.label}</button>);}

function Back({onClick,label="Back"}){return (<button onClick={onClick} style={{background:"none",border:"none",color:"#6B7280",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:12,fontFamily:"inherit"}}>← {label}</button>);}

// ═══════════════════════════════════════
//  STAR RATING INPUT
// ═══════════════════════════════════════
function StarInput({value,onChange}){
  return(
    <div style={{display:"flex",gap:4}}>
      {[1,2,3,4,5].map(i=>(
        <button key={i} onClick={()=>onChange(i)} style={{background:"none",border:"none",fontSize:28,cursor:"pointer",color:i<=value?"#F59E0B":"#D1D5DB",transition:"color .15s"}}>★</button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
//  PROVIDER CARD
// ═══════════════════════════════════════
function ProviderCard({provider,distance,onSelect,onChat,onRequest,providerCounts}){
  const cat=CATEGORIES.find(c=>c.id===provider.category);
  const cc=cat?.color||"#6B7280";
  const dist=dOf(provider.location);
  return(
    <div onClick={()=>onSelect(provider)} style={{background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)",display:"flex",flexDirection:"column",gap:12,border:"1px solid #F3F4F6",transition:"box-shadow .2s,transform .15s",cursor:"pointer"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.10)";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)";e.currentTarget.style.transform="none";}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:48,height:48,borderRadius:14,background:cc+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{provider.avatar}</div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontWeight:700,fontSize:15,color:"#111827"}}>{provider.name}</span>
              {provider.verified&&<span style={{background:"#10B981",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6}}>✓</span>}
            </div>
            <div style={{fontSize:12,color:"#6B7280",marginTop:2}}>{provider.location} · {dist} · {distance.toFixed(1)} km</div>
            {provider.districts?.length>1&&<div style={{fontSize:11,color:"#9CA3AF",marginTop:1}}>Serves: {provider.districts.join(", ")}</div>}
          </div>
        </div>
        <div style={{background:cc+"15",color:cc,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:8,whiteSpace:"nowrap"}}>{cat?.icon} {cat?.label}</div>
      </div>
      <p style={{fontSize:13,color:"#4B5563",lineHeight:1.5,margin:0}}>{provider.bio}</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><Stars rating={provider.rating}/><span style={{color:"#9CA3AF",fontSize:11,marginLeft:4}}>({provider.reviews})</span></div>
        <div style={{display:"flex",gap:8}}>
          <Btn bg="#25D366" onClick={e=>{e.stopPropagation();onChat(provider);}} style={{padding:"8px 14px",fontSize:12,borderRadius:10}}>💬 Chat</Btn>
          <Btn bg={cc} onClick={e=>{e.stopPropagation();onRequest(provider);}} style={{padding:"8px 14px",fontSize:12,borderRadius:10}}>📋 Request</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  PROVIDER PROFILE (shareable view)
// ═══════════════════════════════════════
function ProviderProfile({provider,onBack,onChat,onRequest}){
  const cat=CATEGORIES.find(c=>c.id===provider.category);
  const cc=cat?.color||"#6B7280";
  const coords=pC(provider);
  const userCoords=LC["Belize City"];
  const dist=getDist(userCoords.lat,userCoords.lng,coords.lat,coords.lng);
  const [copied,setCopied]=useState(false);

  const shareLink=`servichat.bz/p/${provider.id}`;
  const copyLink=()=>{navigator.clipboard?.writeText("https://"+shareLink).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);};

  return(
    <div style={{animation:"slideIn .25s ease"}}>
      <Back onClick={onBack}/>
      {/* Share bar */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={copyLink} style={{flex:1,background:"#F3F4F6",border:"1px solid #E5E7EB",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#374151",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
          {copied?"✅ Link Copied!":"🔗 Copy Profile Link"}
        </button>
        <a href={waLink(provider.whatsapp,`Check out ${provider.name} on ServiChat: https://${shareLink}`)} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>📤 Share</a>
      </div>

      <div style={{background:`linear-gradient(135deg,${cc}18,${cc}08)`,borderRadius:20,padding:24,marginBottom:16,border:`1px solid ${cc}22`}}>
        <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
          <div style={{width:64,height:64,borderRadius:18,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:"0 2px 8px rgba(0,0,0,.08)"}}>{provider.avatar}</div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontWeight:800,fontSize:20,color:"#111827"}}>{provider.name}</span>
              {provider.verified&&<span style={{background:"#10B981",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6}}>VERIFIED</span>}
            </div>
            <div style={{color:"#6B7280",fontSize:13,marginTop:2}}>{provider.location} · {dOf(provider.location)} · {dist.toFixed(1)} km</div>
            <div style={{color:"#9CA3AF",fontSize:12,marginTop:2}}>{provider.availability}</div>
            {provider.districts?.length>0&&<div style={{fontSize:12,color:"#9CA3AF",marginTop:2}}>📍 Serves: {provider.districts.join(", ")}</div>}
            <Stars rating={provider.rating}/><span style={{color:"#9CA3AF",fontSize:11,marginLeft:4}}>({provider.reviews} reviews)</span>
          </div>
        </div>
        <p style={{fontSize:14,color:"#374151",lineHeight:1.6,margin:0}}>{provider.bio}</p>
      </div>

      <h3 style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:12}}>Services Portfolio</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {provider.services.map((s,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:12,padding:"14px 16px",border:"1px solid #F3F4F6"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><div style={{fontWeight:600,fontSize:14,color:"#111827"}}>{s.name}</div><div style={{fontSize:12,color:"#9CA3AF"}}>{s.duration}</div></div>
              <div style={{fontWeight:700,fontSize:15,color:cc}}>{s.price}</div>
            </div>
            {s.desc&&<div style={{fontSize:12,color:"#6B7280",marginTop:8,lineHeight:1.4,borderTop:"1px solid #F3F4F6",paddingTop:8}}>{s.desc}</div>}
          </div>
        ))}
      </div>

      {/* Reviews */}
      {provider.ratings?.length>0&&(
        <>
          <h3 style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:10}}>Reviews</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {provider.ratings.map((rv,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:12,padding:14,border:"1px solid #F3F4F6"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <Stars rating={rv.score} size={12}/>
                  <span style={{fontSize:11,color:"#9CA3AF"}}>{fmtDate(rv.date)}</span>
                </div>
                {rv.comment&&<p style={{fontSize:13,color:"#4B5563",margin:0,lineHeight:1.4}}>{rv.comment}</p>}
                <div style={{fontSize:12,color:"#9CA3AF",marginTop:4}}>— {rv.reviewer}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{display:"flex",gap:10}}>
        <a href={waLink(provider.whatsapp,`Hi ${provider.name}, I found you on ServiChat and I'm interested in your services.`)} target="_blank" rel="noreferrer" style={{flex:1,background:"#25D366",color:"#fff",borderRadius:14,padding:14,fontSize:14,fontWeight:700,textDecoration:"none",textAlign:"center",display:"block"}}>💬 WhatsApp</a>
        <Btn bg={cc} onClick={()=>onRequest(provider)} full style={{borderRadius:14,padding:14}}>📋 Request Service</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  CHAT VIEW
// ═══════════════════════════════════════
function ChatView({provider,onBack,onRequest}){
  const [messages,setMessages]=useState([{from:"system",text:`Chatting with ${provider.name} · ${provider.location}`},{from:"provider",text:"Hey! 👋 How can I help yuh today?"}]);
  const [input,setInput]=useState("");
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const send=()=>{if(!input.trim())return;setMessages(m=>[...m,{from:"user",text:input}]);setInput("");setTimeout(()=>{const r=["Sure! When works for you?","Let me check my schedule.","I'm free this week — morning or afternoon?","I'll send a quote after I see the place.","My rate is "+provider.services[0]?.price+". Want me to come check it out?"];setMessages(m=>[...m,{from:"provider",text:r[Math.floor(Math.random()*r.length)]}]);},1200);};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",animation:"slideIn .25s ease"}}>
      <div style={{background:"#075E54",color:"#fff",padding:"12px 16px",borderRadius:"16px 16px 0 0",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:18,fontFamily:"inherit"}}>←</button>
        <div style={{width:36,height:36,borderRadius:18,background:"#25D36640",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{provider.avatar}</div>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{provider.name}</div><div style={{fontSize:11,opacity:.7}}>Online · {provider.location}</div></div>
        <a href={waLink(provider.whatsapp,"")} target="_blank" rel="noreferrer" style={{background:"#25D36680",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#fff",textDecoration:"none",fontWeight:600}}>Open WA ↗</a>
      </div>
      <div style={{flex:1,background:"#ECE5DD",padding:16,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:260}}>
        {messages.map((m,i)=><div key={i} style={{alignSelf:m.from==="user"?"flex-end":m.from==="system"?"center":"flex-start",maxWidth:m.from==="system"?"90%":"75%",background:m.from==="user"?"#DCF8C6":m.from==="system"?"#FFF9C4":"#fff",padding:"8px 12px",borderRadius:12,fontSize:13,lineHeight:1.5,color:m.from==="system"?"#6B7280":"#111827",fontStyle:m.from==="system"?"italic":"normal",boxShadow:"0 1px 2px rgba(0,0,0,.06)"}}>{m.text}</div>)}
        <div ref={endRef}/>
      </div>
      <div style={{background:"#ECE5DD",padding:"4px 16px 8px",display:"flex",gap:6,flexWrap:"wrap"}}>
        {["📋 Request Service","💰 Get Quote","📅 Availability"].map(q=><button key={q} onClick={()=>{if(q.includes("Request")){onRequest(provider);return;}setMessages(m=>[...m,{from:"user",text:q}]);setTimeout(()=>{setMessages(m=>[...m,{from:"provider",text:q.includes("Quote")?`Most jobs between ${provider.services[0]?.price} and ${provider.services[provider.services.length-1]?.price}.`:"I'm free Thursday and Friday! 📅"}]);},1000);}} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:20,padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",color:"#374151",fontWeight:500}}>{q}</button>)}
      </div>
      <div style={{background:"#F0F0F0",padding:"10px 12px",borderRadius:"0 0 16px 16px",display:"flex",gap:8,alignItems:"center"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..." style={{flex:1,border:"none",background:"#fff",borderRadius:24,padding:"10px 16px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={send} style={{background:"#25D366",border:"none",borderRadius:"50%",width:38,height:38,color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>➤</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  SERVICE REQUEST FORM
// ═══════════════════════════════════════
function RequestForm({provider,onBack,onSubmit,saveRequest,user}){
  const cat=CATEGORIES.find(c=>c.id===provider.category);
  const cc=cat?.color||"#6B7280";
  const [form,setForm]=useState({service:"",date:"",time:"",address:"",notes:""});
  const [submitted,setSubmitted]=useState(false);
  const handleSubmit=()=>{
    const req={id:"req-"+Date.now(),providerId:provider.id,providerName:provider.name,providerAvatar:provider.avatar,providerWa:provider.whatsapp,category:provider.category,service:form.service,date:form.date,time:form.time,address:form.address,notes:form.notes,status:"pending",customerName:user?.name||"Customer",customerWa:user?.whatsapp||"",createdAt:new Date().toISOString()};
    saveRequest(req);
    setSubmitted(true);
    setTimeout(()=>onSubmit(),2200);
  };
  if(submitted) return (<div style={{textAlign:"center",padding:40,animation:"slideIn .3s ease"}}><div style={{fontSize:64,marginBottom:16}}>✅</div><h3 style={{color:"#111827",fontWeight:800,fontSize:20,margin:"0 0 8px"}}>Request Sent!</h3><p style={{color:"#6B7280",fontSize:14,lineHeight:1.5}}>Sent to {provider.name} via WhatsApp.<br/>They'll confirm shortly.</p><a href={waLink(provider.whatsapp,`Hi ${provider.name}! I just submitted a request for ${form.service} on ServiChat.`)} target="_blank" rel="noreferrer" style={{display:"inline-block",marginTop:12,background:"#25D366",color:"#fff",borderRadius:12,padding:"10px 20px",fontSize:13,fontWeight:700,textDecoration:"none"}}>Open WhatsApp ↗</a></div>);
  return(
    <div style={{animation:"slideIn .25s ease"}}>
      <Back onClick={onBack}/>
      <div style={{background:`linear-gradient(135deg,${cc},${cc}CC)`,borderRadius:16,padding:20,color:"#fff",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:600,opacity:.8,textTransform:"uppercase",letterSpacing:1}}>New Service Request</div>
        <div style={{fontSize:20,fontWeight:800,marginTop:4}}>{provider.name}</div>
        <div style={{fontSize:13,opacity:.8,marginTop:2}}>{cat?.icon} {cat?.label} · {provider.location}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Sel label="Service Needed" value={form.service} onChange={e=>setForm({...form,service:e.target.value})}><option value="">Select a service...</option>{provider.services.map((s,i)=><option key={i} value={s.name}>{s.name} — {s.price}</option>)}</Sel>
        <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Inp label="Preferred Date" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div><div style={{flex:1}}><Inp label="Preferred Time" type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div></div>
        <Inp label="Address / Location" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="e.g. Mile 3, Northern Highway"/>
        <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block"}}>Notes<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Describe what you need..." rows={3} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"2px solid #E5E7EB",fontSize:14,marginTop:6,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",outline:"none"}}/></label>
        <Btn bg="#25D366" onClick={handleSubmit} disabled={!form.service||!form.date} full style={{marginTop:8,borderRadius:14,padding:16,fontSize:15}}>Send Request via WhatsApp 💬</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  CUSTOMER ONBOARDING
// ═══════════════════════════════════════
function CustomerOnboarding({onComplete,existing}){
  const [p,setP]=useState(existing||{name:"",location:LOCATIONS[0],whatsapp:""});
  const locsByD=useMemo(()=>{const m={};LOCATIONS.forEach(l=>{const d=LC[l]?.d||"Other";if(!m[d])m[d]=[];m[d].push(l);});return m;},[]);
  return(
    <div style={{animation:"slideIn .25s ease",display:"flex",flexDirection:"column",gap:16}}>
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{fontSize:48,marginBottom:8}}>🇧🇿</div>
        <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#111827"}}>Welcome to ServiChat</h2>
        <p style={{color:"#6B7280",fontSize:14,margin:"6px 0 0"}}>Quick setup so providers can reach you</p>
      </div>
      <Inp label="Your Name" value={p.name} onChange={e=>setP(x=>({...x,name:e.target.value}))} placeholder="e.g. Maria Santos"/>
      <Sel label="Your Location" value={p.location} onChange={e=>setP(x=>({...x,location:e.target.value}))}>
        {DISTRICTS.map(d=><optgroup key={d.name} label={`── ${d.name} District ──`}>{(locsByD[d.name]||[]).map(l=><option key={l} value={l}>{l}</option>)}</optgroup>)}
      </Sel>
      <Inp label="WhatsApp Number" value={p.whatsapp} onChange={e=>setP(x=>({...x,whatsapp:e.target.value}))} placeholder="+501 600-1234"/>
      <Btn bg={T} onClick={()=>onComplete(p)} disabled={!p.name} full>Get Started →</Btn>
    </div>
  );
}

// ═══════════════════════════════════════
//  MY REQUESTS (Customer)
// ═══════════════════════════════════════
function MyRequests({requests,updateReq,providers,addReview}){
  const [reviewingId,setReviewingId]=useState(null);
  const [score,setScore]=useState(5);
  const [comment,setComment]=useState("");

  if(!requests.length)return (<Empty icon="📋" title="No requests yet" sub="Browse providers and request a service"/>);

  const submitReview=(req)=>{
    addReview(req.providerId,{score,comment,reviewer:req.customerName||"Customer",date:new Date().toISOString()});
    setReviewingId(null);setScore(5);setComment("");
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10,animation:"slideIn .25s ease"}}>
      <h3 style={{fontSize:16,fontWeight:800,color:"#111827",margin:"0 0 4px"}}>My Requests</h3>
      {requests.map(r=>{
        const cat=CATEGORIES.find(c=>c.id===r.category);
        const st=STATUSES[r.status]||STATUSES.pending;
        const canCancel=r.status==="pending"||r.status==="accepted";
        const canReview=r.status==="completed";
        return(
          <div key={r.id} style={{background:"#fff",borderRadius:14,padding:16,border:"1px solid #F3F4F6",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{r.providerAvatar}</span>
                <div><div style={{fontWeight:700,fontSize:14,color:"#111827"}}>{r.providerName}</div><div style={{fontSize:12,color:"#6B7280"}}>{cat?.icon} {r.service}</div></div>
              </div>
              <span style={{background:st.color+"20",color:st.color,fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8,textTransform:"uppercase"}}>{st.icon} {st.label}</span>
            </div>
            <div style={{display:"flex",gap:12,fontSize:12,color:"#6B7280",flexWrap:"wrap"}}><span>📅 {r.date}</span>{r.time&&<span>🕐 {r.time}</span>}{r.address&&<span>📍 {r.address}</span>}</div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              {r.providerWa&&<a href={waLink(r.providerWa,`Hi ${r.providerName}, following up on my ${r.service} request.`)} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,textDecoration:"none"}}>💬 WhatsApp</a>}
              {canCancel&&<button onClick={()=>updateReq(r.id,"cancelled")} style={{background:"#FEE2E2",color:"#EF4444",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>}
              {canReview&&reviewingId!==r.id&&<button onClick={()=>setReviewingId(r.id)} style={{background:"#FEF3C7",color:"#D97706",border:"none",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⭐ Leave Review</button>}
            </div>
            {reviewingId===r.id&&(
              <div style={{marginTop:12,background:"#FFFBEB",borderRadius:12,padding:14,border:"1px solid #FDE68A"}}>
                <div style={{fontSize:13,fontWeight:600,color:"#92400E",marginBottom:8}}>Rate {r.providerName}</div>
                <StarInput value={score} onChange={setScore}/>
                <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="How was the service?" rows={2} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #FDE68A",fontSize:13,marginTop:8,fontFamily:"inherit",boxSizing:"border-box",outline:"none",resize:"none"}}/>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <Btn bg="#D97706" onClick={()=>submitReview(r)} style={{padding:"8px 16px",fontSize:12,borderRadius:8}}>Submit Review</Btn>
                  <button onClick={()=>setReviewingId(null)} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
//  PROVIDER ONBOARDING
// ═══════════════════════════════════════
function ProviderOnboarding({onComplete,existingProfile}){
  const [step,setStep]=useState(0);
  const defaults={name:"",avatar:AVATARS[0],category:"",location:LOCATIONS[0],districts:[],bio:"",whatsapp:"",availability:"Mon–Fri, 8AM–5PM",services:[]};
  const [profile,setProfile]=useState(existingProfile?{...defaults,...existingProfile,districts:existingProfile.districts||[]}:defaults);
  const [ns,setNs]=useState({name:"",price:"",duration:"",desc:""});
  const addSvc=()=>{if(!ns.name||!ns.price)return;setProfile(p=>({...p,services:[...p.services,{...ns}]}));setNs({name:"",price:"",duration:"",desc:""});};
  const rmSvc=idx=>setProfile(p=>({...p,services:p.services.filter((_,i)=>i!==idx)}));
  const toggleDist=d=>setProfile(p=>{const dists=p.districts||[];return{...p,districts:dists.includes(d)?dists.filter(x=>x!==d):[...dists,d]};});
  const cat=CATEGORIES.find(c=>c.id===profile.category);
  const cc=cat?.color||T;
  const locsByD=useMemo(()=>{const m={};LOCATIONS.forEach(l=>{const d=LC[l]?.d||"Other";if(!m[d])m[d]=[];m[d].push(l);});return m;},[]);

  const pages=[
    <div key={0} style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{fontSize:48,marginBottom:8}}>🇧🇿</div>
        <h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#111827"}}>Become a Provider</h2>
        <p style={{color:"#6B7280",fontSize:14,margin:"6px 0 0"}}>3 steps to start getting clients</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#374151",marginBottom:4}}>Choose avatar</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
          {AVATARS.map(a=><button key={a} onClick={()=>setProfile(p=>({...p,avatar:a}))} style={{width:42,height:42,borderRadius:12,border:profile.avatar===a?"3px solid "+T:"2px solid #E5E7EB",background:profile.avatar===a?T+"15":"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{a}</button>)}
        </div>
      </div>
      <Inp label="Full Name" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} placeholder="e.g. Marcus Hyde"/>
      <Sel label="Category" value={profile.category} onChange={e=>setProfile(p=>({...p,category:e.target.value}))}>
        <option value="">Select your trade...</option>
        {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
      </Sel>
      <Sel label="Home Location" value={profile.location} onChange={e=>setProfile(p=>({...p,location:e.target.value}))}>
        {DISTRICTS.map(d=><optgroup key={d.name} label={`── ${d.name} ──`}>{(locsByD[d.name]||[]).map(l=><option key={l} value={l}>{l}</option>)}</optgroup>)}
      </Sel>
      <div>
        <div style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:8}}>Districts You Serve</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {DISTRICTS.map(d=><Pill key={d.name} label={d.name} active={(profile.districts||[]).includes(d.name)} onClick={()=>toggleDist(d.name)}/>)}
        </div>
      </div>
      <Btn bg={T} onClick={()=>setStep(1)} disabled={!profile.name||!profile.category||!profile.districts.length} full>Continue →</Btn>
    </div>,
    <div key={1} style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{textAlign:"center",marginBottom:4}}><div style={{fontSize:40,marginBottom:4}}>{profile.avatar}</div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#111827"}}>About You</h2></div>
      <label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block"}}>Bio<textarea value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} placeholder="Your experience, specialties, service area..." rows={4} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"2px solid #E5E7EB",fontSize:14,marginTop:6,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",outline:"none"}}/></label>
      <Inp label="WhatsApp Number" value={profile.whatsapp} onChange={e=>setProfile(p=>({...p,whatsapp:e.target.value}))} placeholder="+501 600-1234"/>
      <Inp label="Availability" value={profile.availability} onChange={e=>setProfile(p=>({...p,availability:e.target.value}))} placeholder="e.g. Mon–Sat, 7AM–5PM"/>
      <div style={{display:"flex",gap:10}}><Btn bg="#F3F4F6" color="#374151" onClick={()=>setStep(0)} style={{flex:1}}>← Back</Btn><Btn bg={T} onClick={()=>setStep(2)} disabled={!profile.bio||!profile.whatsapp} style={{flex:2}}>Continue →</Btn></div>
    </div>,
    <div key={2} style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{textAlign:"center"}}><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#111827"}}>Services & Pricing (BZD)</h2></div>
      {profile.services.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{profile.services.map((s,i)=><div key={i} style={{background:"#fff",borderRadius:12,padding:"12px 16px",border:"1px solid #F3F4F6"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontWeight:600,fontSize:14,color:"#111827"}}>{s.name}</div><div style={{fontSize:12,color:"#9CA3AF"}}>{s.duration||"—"}</div></div><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontWeight:700,fontSize:15,color:cc}}>{s.price}</span><button onClick={()=>rmSvc(i)} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",fontSize:16}}>×</button></div></div>{s.desc&&<div style={{fontSize:12,color:"#6B7280",marginTop:6,lineHeight:1.4,borderTop:"1px solid #F3F4F6",paddingTop:6}}>{s.desc}</div>}</div>)}</div>}
      <div style={{background:"#F9FAFB",borderRadius:14,padding:16,border:"1px dashed #D1D5DB"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Add Service</div>
        <Inp label="Service Name" value={ns.name} onChange={e=>setNs(s=>({...s,name:e.target.value}))} placeholder="e.g. AC Full Service"/>
        <div style={{display:"flex",gap:10,marginTop:10}}><div style={{flex:1}}><Inp label="Price (BZD)" value={ns.price} onChange={e=>setNs(s=>({...s,price:e.target.value}))} placeholder="$150 BZD"/></div><div style={{flex:1}}><Inp label="Duration" value={ns.duration} onChange={e=>setNs(s=>({...s,duration:e.target.value}))} placeholder="2 hrs"/></div></div>
        <div style={{marginTop:10}}><label style={{fontSize:13,fontWeight:600,color:"#374151",display:"block"}}>Description<textarea value={ns.desc||""} onChange={e=>setNs(s=>({...s,desc:e.target.value}))} placeholder="What's included? e.g. Full deep clean of indoor/outdoor unit, filter wash, gas check..." rows={2} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:"2px solid #E5E7EB",fontSize:13,marginTop:6,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",outline:"none"}}/></label></div>
        <div style={{marginTop:10}}><Btn bg={cc} onClick={addSvc} disabled={!ns.name||!ns.price} full style={{borderRadius:10,padding:10,fontSize:13}}>+ Add</Btn></div>
      </div>
      <div style={{display:"flex",gap:10}}><Btn bg="#F3F4F6" color="#374151" onClick={()=>setStep(1)} style={{flex:1}}>← Back</Btn><Btn bg="#25D366" onClick={()=>onComplete({...profile,id:existingProfile?.id||gid(),rating:existingProfile?.rating||(4+Math.random()*.9),reviews:existingProfile?.reviews||0,verified:existingProfile?.verified||false,ratings:existingProfile?.ratings||[]})} disabled={profile.services.length===0} style={{flex:2}}>{existingProfile?"💾 Save":"🚀 Go Live!"}</Btn></div>
    </div>,
  ];
  return (<div style={{animation:"slideIn .25s ease"}}><div style={{display:"flex",gap:6,marginBottom:20}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:4,borderRadius:4,background:i<=step?cc:"#E5E7EB",transition:"background .3s"}}/>)}</div>{pages[step]}</div>);
}

// ═══════════════════════════════════════
//  PROVIDER DASHBOARD
// ═══════════════════════════════════════
function Dashboard({profile,onEdit,requests,updateReq}){
  const cat=CATEGORIES.find(c=>c.id===profile.category);
  const cc=cat?.color||T;
  const mine=requests.filter(r=>r.providerId===profile.id);
  const pending=mine.filter(r=>r.status==="pending").length;
  const active=mine.filter(r=>r.status==="accepted"||r.status==="in_progress").length;
  const done=mine.filter(r=>r.status==="completed").length;

  return(
    <div style={{animation:"slideIn .25s ease"}}>
      <div style={{background:`linear-gradient(135deg,${cc},${cc}CC)`,borderRadius:18,padding:24,color:"#fff",marginBottom:20}}>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div style={{width:60,height:60,borderRadius:16,background:"#ffffff30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{profile.avatar}</div>
          <div><div style={{fontWeight:800,fontSize:20}}>{profile.name}</div><div style={{fontSize:13,opacity:.8}}>{cat?.icon} {cat?.label} · {profile.location}</div><div style={{fontSize:12,opacity:.7,marginTop:2}}>⭐ {(profile.rating||0).toFixed(1)} · {profile.reviews||0} reviews · Serves: {profile.districts?.join(", ")}</div></div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
        {[{n:pending,l:"Pending",c:"#F59E0B"},{n:active,l:"Active",c:"#3B82F6"},{n:done,l:"Done",c:"#10B981"}].map(x=>(
          <div key={x.l} style={{background:"#fff",borderRadius:12,padding:14,textAlign:"center",border:"1px solid #F3F4F6"}}><div style={{fontSize:24,fontWeight:800,color:x.c}}>{x.n}</div><div style={{fontSize:11,color:"#6B7280",fontWeight:600}}>{x.l}</div></div>
        ))}
      </div>

      <Btn bg="#F3F4F6" color="#374151" onClick={onEdit} full style={{borderRadius:12,marginBottom:20}}>✏️ Edit Profile & Services</Btn>

      {mine.length>0&&(
        <>
          <h3 style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:10}}>Job Requests</h3>
          {mine.map(r=>{
            const st=STATUSES[r.status]||STATUSES.pending;
            const actions=[];
            if(r.status==="pending"){actions.push({label:"Accept",color:"#10B981",next:"accepted"});actions.push({label:"Decline",color:"#EF4444",next:"declined"});}
            if(r.status==="accepted")actions.push({label:"Start Job",color:"#8B5CF6",next:"in_progress"});
            if(r.status==="in_progress")actions.push({label:"Complete",color:"#10B981",next:"completed"});
            return(
              <div key={r.id} style={{background:"#fff",borderRadius:12,padding:14,border:"1px solid #F3F4F6",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontWeight:600,fontSize:14,color:"#111827"}}>{r.service}</div>
                  <span style={{background:st.color+"20",color:st.color,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,textTransform:"uppercase"}}>{st.icon} {st.label}</span>
                </div>
                <div style={{fontSize:12,color:"#6B7280"}}>📅 {r.date}{r.time&&` · 🕐 ${r.time}`}</div>
                {r.address&&<div style={{fontSize:12,color:"#6B7280"}}>📍 {r.address}</div>}
                <div style={{fontSize:12,color:"#6B7280"}}>👤 {r.customerName}</div>
                {r.notes&&<div style={{fontSize:12,color:"#9CA3AF",marginTop:4,fontStyle:"italic"}}>"{r.notes}"</div>}
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                  {r.customerWa&&<a href={waLink(r.customerWa,`Hi ${r.customerName}, this is ${profile.name} regarding your ${r.service} request.`)} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:600,textDecoration:"none"}}>💬 WhatsApp</a>}
                  {actions.map(a=><button key={a.label} onClick={()=>updateReq(r.id,a.next)} style={{background:a.color+"15",color:a.color,border:`1px solid ${a.color}40`,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{a.label}</button>)}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════
export default function App(){
  const [providers,setProviders]=useMS("providers",SEED_PROVIDERS);
  const [requests,setRequests]=useMS("requests",[]);
  const [myProfile,setMyProfile]=useMS("myProfile",null);
  const [user,setUser]=useMS("user",null); // customer profile
  const [role,setRole]=useMS("role",null); // "customer"|"provider"|null

  const [tab,setTab]=useState("browse");
  const [activeCat,setActiveCat]=useState(null);
  const [activeDist,setActiveDist]=useState(null);
  const [sort,setSort]=useState("closest");
  const [search,setSearch]=useState("");
  const [view,setView]=useState("list");
  const [selProv,setSelProv]=useState(null);

  const userCoords=user&&LC[user.location]?LC[user.location]:LC["Belize City"];

  const filtered=useMemo(()=>{
    let list=providers.map(p=>{const c=pC(p);return{...p,distance:getDist(userCoords.lat,userCoords.lng,c.lat,c.lng)};});
    if(activeCat)list=list.filter(p=>p.category===activeCat);
    if(activeDist)list=list.filter(p=>(p.districts||[dOf(p.location)]).includes(activeDist));
    if(search){const q=search.toLowerCase();list=list.filter(p=>p.name.toLowerCase().includes(q)||p.bio.toLowerCase().includes(q)||p.location.toLowerCase().includes(q)||p.services.some(s=>s.name.toLowerCase().includes(q)));}
    list.sort((a,b)=>sort==="closest"?a.distance-b.distance:b.distance-a.distance);
    return list;
  },[providers,activeCat,activeDist,sort,search,userCoords]);

  const districtCounts=useMemo(()=>{const m={};providers.forEach(p=>{(p.districts||[dOf(p.location)]).forEach(d=>{m[d]=(m[d]||0)+1;});});return m;},[providers]);

  const saveRequest=r=>setRequests(prev=>[r,...prev]);
  const updateReq=(id,status)=>setRequests(prev=>prev.map(r=>r.id===id?{...r,status}:r));

  const addReview=(providerId,review)=>{
    setProviders(prev=>prev.map(p=>{
      if(p.id!==providerId)return p;
      const rats=[...(p.ratings||[]),review];
      const avg=rats.reduce((s,r)=>s+r.score,0)/rats.length;
      return{...p,ratings:rats,rating:avg,reviews:(p.reviews||0)+1};
    }));
  };

  const saveProvider=p=>{
    setMyProfile(p);setRole("provider");
    setProviders(prev=>{const idx=prev.findIndex(x=>x.id===p.id);if(idx>=0){const n=[...prev];n[idx]=p;return n;}return[...prev,p];});
    setView("list");setTab("provider");
  };

  // No role chosen yet
  if(!role){
    return(
      <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#F5F7F3",minHeight:"100vh",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",justifyContent:"center",padding:24}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');@keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}*{box-sizing:border-box}`}</style>
        <div style={{textAlign:"center",marginBottom:32,animation:"slideIn .4s ease"}}>
          <div style={{fontSize:64,marginBottom:12}}>🇧🇿</div>
          <h1 style={{fontSize:28,fontWeight:800,color:"#111827",margin:"0 0 6px"}}>ServiChat</h1>
          <p style={{color:"#6B7280",fontSize:15,margin:0}}>Local services marketplace for Belize</p>
          <p style={{color:"#9CA3AF",fontSize:13,margin:"8px 0 0"}}>Connect with verified providers via WhatsApp</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,animation:"slideIn .5s ease .1s both"}}>
          <button onClick={()=>setRole("customer")} style={{background:"#fff",border:"2px solid #E5E7EB",borderRadius:16,padding:24,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T;e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#E5E7EB";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:32,marginBottom:8}}>🔍</div>
            <div style={{fontWeight:700,fontSize:17,color:"#111827"}}>I Need a Service</div>
            <div style={{fontSize:13,color:"#6B7280",marginTop:4}}>Find landscapers, AC techs, plumbers, electricians and more near you</div>
          </button>
          <button onClick={()=>setRole("provider")} style={{background:"#fff",border:"2px solid #E5E7EB",borderRadius:16,padding:24,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#25D366";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#E5E7EB";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:32,marginBottom:8}}>🛠️</div>
            <div style={{fontWeight:700,fontSize:17,color:"#111827"}}>I Offer Services</div>
            <div style={{fontSize:13,color:"#6B7280",marginTop:4}}>Create your portfolio, set your prices, and start getting clients via WhatsApp</div>
          </button>
        </div>
      </div>
    );
  }

  // Customer needs onboarding
  if(role==="customer"&&!user){
    return(
      <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#F5F7F3",minHeight:"100vh",maxWidth:480,margin:"0 auto",padding:24}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');@keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:#B0B0B0}`}</style>
        <CustomerOnboarding onComplete={u=>setUser(u)}/>
      </div>
    );
  }

  // Provider needs onboarding
  if(role==="provider"&&!myProfile){
    return(
      <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#F5F7F3",minHeight:"100vh",maxWidth:480,margin:"0 auto",padding:24}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');@keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:#B0B0B0}`}</style>
        <ProviderOnboarding onComplete={saveProvider}/>
      </div>
    );
  }

  const isProvider=role==="provider";
  const navItems=isProvider?[
    {id:"browse",icon:"🔍",label:"Browse"},
    {id:"provider",icon:"📊",label:"Dashboard",badge:requests.filter(r=>r.providerId===myProfile?.id&&r.status==="pending").length},
  ]:[
    {id:"browse",icon:"🔍",label:"Browse"},
    {id:"requests",icon:"📋",label:"Requests",badge:requests.filter(r=>r.status==="accepted"||r.status==="in_progress").length},
  ];

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#F5F7F3",minHeight:"100vh",maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:4px}
        input::placeholder,textarea::placeholder{color:#B0B0B0}
      `}</style>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#00695C,#00897B)",padding:"14px 20px 18px",color:"#fff",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:tab==="browse"?12:0}}>
          <div>
            <div style={{fontSize:10,fontWeight:600,opacity:.6,textTransform:"uppercase",letterSpacing:1.5}}>{isProvider?"Provider Mode":"Local Services"}</div>
            <h1 style={{fontSize:22,fontWeight:800,margin:"2px 0 0",letterSpacing:-.5}}>ServiChat 🇧🇿</h1>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:"#ffffff20",borderRadius:10,padding:"5px 10px",fontSize:11,fontWeight:600}}>📍 {user?.location||myProfile?.location||"Belize City"}</div>
            <button onClick={()=>{setRole(null);setTab("browse");setView("list");}} style={{background:"#ffffff15",border:"none",borderRadius:10,padding:"5px 10px",fontSize:11,fontWeight:600,color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>Switch ↗</button>
          </div>
        </div>
        {tab==="browse"&&(
          <div style={{position:"relative",marginTop:2}}>
            <input value={search} onChange={e=>{setSearch(e.target.value);setView("list");}} placeholder="Search services, providers, locations..." style={{width:"100%",padding:"12px 16px 12px 40px",borderRadius:14,border:"none",fontSize:14,background:"#ffffff25",color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,opacity:.7}}>🔍</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:"0 20px 90px"}}>
        {tab==="browse"&&(
          <>
            <div style={{padding:"12px 0 6px",display:"flex",gap:8,overflowX:"auto",marginLeft:-20,marginRight:-20,paddingLeft:20,paddingRight:20}}>
              {CATEGORIES.map(c=><CatPill key={c.id} cat={c} active={activeCat} onClick={id=>{setActiveCat(p=>p===id?null:id);setView("list");}}/>)}
            </div>
            <div style={{padding:"4px 0 8px",display:"flex",gap:6,overflowX:"auto",marginLeft:-20,marginRight:-20,paddingLeft:20,paddingRight:20}}>
              {DISTRICTS.map(d=>{const a=activeDist===d.name;return (<button key={d.name} onClick={()=>{setActiveDist(p=>p===d.name?null:d.name);setView("list");}} style={{padding:"5px 12px",borderRadius:18,border:a?"2px solid "+T:"2px solid #E5E7EB",background:a?T+"12":"#fff",color:a?T:"#6B7280",fontSize:12,fontWeight:a?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .2s"}}>{d.name} <span style={{opacity:.6}}>({districtCounts[d.name]||0})</span></button>);})}
            </div>
            {view==="list"&&(
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"4px 0 12px"}}>
                  <span style={{fontSize:13,color:"#6B7280",fontWeight:500}}>{filtered.length} provider{filtered.length!==1?"s":""}</span>
                  <button onClick={()=>setSort(s=>s==="closest"?"furthest":"closest")} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer",color:"#374151",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                    {sort==="closest"?"📍 Closest":"📍 Furthest"} ⇅
                  </button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {filtered.map(p=><ProviderCard key={p.id} provider={p} distance={p.distance} onSelect={x=>{setSelProv(x);setView("profile");}} onChat={x=>{setSelProv(x);setView("chat");}} onRequest={x=>{setSelProv(x);setView("request");}}/>)}
                  {!filtered.length&&<Empty icon="🔍" title="No providers found" sub="Try a different filter or search"/>}
                </div>
              </>
            )}
            {view==="profile"&&selProv&&<ProviderProfile provider={selProv} onBack={()=>setView("list")} onChat={p=>{setSelProv(p);setView("chat");}} onRequest={p=>{setSelProv(p);setView("request");}}/>}
            {view==="chat"&&selProv&&<ChatView provider={selProv} onBack={()=>setView("list")} onRequest={p=>{setSelProv(p);setView("request");}}/>}
            {view==="request"&&selProv&&<RequestForm provider={selProv} onBack={()=>setView("list")} onSubmit={()=>setView("list")} saveRequest={saveRequest} user={user}/>}
          </>
        )}
        {tab==="requests"&&<div style={{paddingTop:16}}><MyRequests requests={requests} updateReq={updateReq} providers={providers} addReview={addReview}/></div>}
        {tab==="provider"&&<div style={{paddingTop:16}}>{view==="editProfile"&&myProfile?<ProviderOnboarding existingProfile={myProfile} onComplete={saveProvider}/>:<Dashboard profile={myProfile} onEdit={()=>setView("editProfile")} requests={requests} updateReq={updateReq}/>}</div>}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderTop:"1px solid #E5E7EB",display:"flex",justifyContent:"space-around",padding:"8px 0 14px",boxShadow:"0 -2px 12px rgba(0,0,0,.06)",zIndex:100}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{setTab(n.id);setView("list");}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:tab===n.id?T:"#9CA3AF",transition:"color .15s",padding:"4px 12px",position:"relative"}}>
            <span style={{fontSize:22}}>{n.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===n.id?700:500}}>{n.label}</span>
            {n.badge>0&&<span style={{position:"absolute",top:0,right:4,background:"#EF4444",color:"#fff",fontSize:9,fontWeight:700,width:16,height:16,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>{n.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
