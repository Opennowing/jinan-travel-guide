const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/social-BtvQIZg-.js","assets/social-IJRaxWbQ.css"])))=>i.map(i=>d[i]);
import{i as st,_ as at,a as it,b as nt,c as ot,s as rt}from"./social-BtvQIZg-.js";import{F as dt,A as ct,O as lt,W as ht}from"./interactive-Nl2I4oKJ.js";import{i as mt}from"./shopify-animations-C_FKrdXc.js";st();at(()=>import("./social-BtvQIZg-.js").then(e=>e.e),__vite__mapDeps([0,1])).then(e=>{e.initPageTransition(),e.initStaggerReveal()});mt();it();nt();ot();const pt=new dt;pt._updateBadge();const V=new ct,Q=document.createElement("div");Q.innerHTML=V.renderToolbar();document.body.appendChild(Q);V.bindToolbar();const ut=new lt;ut.cacheEssentials();const vt=document.querySelector(".top-nav");window.addEventListener("scroll",()=>{vt.classList.toggle("scrolled",window.scrollY>10)},{passive:!0});let B={spots:[],foods:[]};function M(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}const k={spots:null,foods:null};async function z(){if(k.spots)return k.spots;const e=await fetch("/jinan-travel-guide/data/spots.json");return k.spots=await e.json(),k.spots}async function D(){if(k.foods)return k.foods;const t=await(await fetch("/jinan-travel-guide/data/food.json")).json();return k.foods=t.foods||t,k.foods}async function gt(){try{const[e,t]=await Promise.all([z(),D()]);B.spots=e,B.foods=t}catch(e){console.error("搜索数据加载失败:",e)}}gt();const I=document.getElementById("searchDropdown"),T=document.getElementById("heroSearch"),C=document.getElementById("searchOverlay"),_=document.getElementById("navSearchBtn"),O=document.getElementById("searchClose");_==null||_.addEventListener("click",()=>{C.classList.add("open"),T.focus()});O==null||O.addEventListener("click",()=>{C.classList.remove("open")});C==null||C.addEventListener("click",e=>{e.target===C&&C.classList.remove("open")});document.addEventListener("keydown",e=>{e.key==="Escape"&&C.classList.contains("open")&&C.classList.remove("open")});function J(e){if(!e){I.classList.remove("show");return}const t=e.toLowerCase(),n=B.spots.filter(s=>s.name.toLowerCase().includes(t)||s.desc.toLowerCase().includes(t)).slice(0,5),i=B.foods.filter(s=>s.name.toLowerCase().includes(t)||s.desc.toLowerCase().includes(t)||s.tag&&s.tag.toLowerCase().includes(t)).slice(0,5);if(!n.length&&!i.length){I.innerHTML='<div class="search-empty">没有找到相关结果 😢</div>',I.classList.add("show");return}let a="";n.length&&(a+='<div class="search-dropdown-section"><div class="search-dropdown-label">🏛️ 景点</div>',a+=n.map(s=>`
          <a href="spots.html?id=${encodeURIComponent(s.id)}" class="search-dropdown-item" data-type="spot">
            <span class="item-icon">⛲</span>
            <div style="flex:1;min-width:0">
              <div class="item-name">${M(s.name)}</div>
              <div class="item-desc">${M(s.desc.slice(0,40))}…</div>
            </div>
            <span class="item-type">${s.price===0?"免费":"¥"+s.price}</span>
          </a>`).join(""),a+="</div>"),i.length&&(a+='<div class="search-dropdown-section"><div class="search-dropdown-label">🍜 美食</div>',a+=i.map(s=>`
          <a href="food.html?id=${encodeURIComponent(s.id)}" class="search-dropdown-item" data-type="food">
            <span class="item-icon">🍜</span>
            <div style="flex:1;min-width:0">
              <div class="item-name">${M(s.name)}</div>
              <div class="item-desc">${M(s.desc.slice(0,40))}…</div>
            </div>
            <span class="item-type">${s.tag||s.cat}</span>
          </a>`).join(""),a+="</div>"),I.innerHTML=a,I.classList.add("show")}let N;T.addEventListener("input",e=>{clearTimeout(N),N=setTimeout(()=>J(e.target.value.trim()),150)});T.addEventListener("focus",()=>{T.value.trim()&&J(T.value.trim())});document.addEventListener("click",e=>{e.target.closest(".hero-search")||I.classList.remove("show")});function K(){const e=T.value.trim();e&&(location.href=`spots.html?q=${encodeURIComponent(e)}`)}document.getElementById("searchBtn").addEventListener("click",K);T.addEventListener("keydown",e=>{e.key==="Enter"&&(I.classList.remove("show"),K()),e.key==="Escape"&&I.classList.remove("show")});const w=document.getElementById("heroInlineSearch"),x=document.getElementById("heroInlineDropdown"),X=document.getElementById("heroInlineSearchBtn");function Z(e){if(!e){x.classList.remove("show");return}const t=e.toLowerCase(),n=B.spots.filter(s=>s.name.toLowerCase().includes(t)||s.desc.toLowerCase().includes(t)).slice(0,5),i=B.foods.filter(s=>s.name.toLowerCase().includes(t)||s.desc.toLowerCase().includes(t)||s.tag&&s.tag.toLowerCase().includes(t)).slice(0,5);if(!n.length&&!i.length){x.innerHTML='<div class="search-empty">没有找到相关结果 😢</div>',x.classList.add("show");return}let a="";n.length&&(a+='<div class="search-dropdown-section"><div class="search-dropdown-label">🏛️ 景点</div>',a+=n.map(s=>`
          <a href="spots.html?id=${encodeURIComponent(s.id)}" class="search-dropdown-item" data-type="spot">
            <span class="item-icon">⛲</span>
            <div style="flex:1;min-width:0">
              <div class="item-name">${M(s.name)}</div>
              <div class="item-desc">${M(s.desc.slice(0,40))}…</div>
            </div>
            <span class="item-type">${s.price===0?"免费":"¥"+s.price}</span>
          </a>`).join(""),a+="</div>"),i.length&&(a+='<div class="search-dropdown-section"><div class="search-dropdown-label">🍜 美食</div>',a+=i.map(s=>`
          <a href="food.html?id=${encodeURIComponent(s.id)}" class="search-dropdown-item" data-type="food">
            <span class="item-icon">🍜</span>
            <div style="flex:1;min-width:0">
              <div class="item-name">${M(s.name)}</div>
              <div class="item-desc">${M(s.desc.slice(0,40))}…</div>
            </div>
            <span class="item-type">${s.tag||s.cat}</span>
          </a>`).join(""),a+="</div>"),x.innerHTML=a,x.classList.add("show")}let U;w==null||w.addEventListener("input",e=>{clearTimeout(U),U=setTimeout(()=>Z(e.target.value.trim()),150)});w==null||w.addEventListener("focus",()=>{w.value.trim()&&Z(w.value.trim())});document.addEventListener("click",e=>{e.target.closest(".hero-search-v2")||x==null||x.classList.remove("show")});function tt(){const e=w.value.trim();e&&(location.href=`spots.html?q=${encodeURIComponent(e)}`)}X==null||X.addEventListener("click",tt);w==null||w.addEventListener("keydown",e=>{e.key==="Enter"&&(x.classList.remove("show"),tt()),e.key==="Escape"&&x.classList.remove("show")});const ft=new Date().getMonth()+1,G=[{months:[3,4,5],icon:"🌸",title:"春季 · 泉水最旺",desc:"百花盛开，泉水涌动最壮观。4月五龙潭樱花超美，大明湖荷花初开。气温15-25°C，薄外套即可。",tags:["赏花","泉水旺","气温宜人"],route:"泉水赏花线"},{months:[6,7,8],icon:"☀️",title:"夏季 · 荷花满湖",desc:"大明湖荷花盛开，护城河夜游超舒服。白天酷热建议早出晚归，中午逛博物馆。",tags:["荷花","夜游","博物馆"],route:"避暑夜游线"},{months:[9,10,11],icon:"🍂",title:"秋季 · 红叶漫山",desc:"秋高气爽，千佛山红叶、灵岩寺银杏。10月中-11月中红叶谷漫山红遍。",tags:["红叶","登山","银杏"],route:"红叶登山线"},{months:[12,1,2],icon:"❄️",title:"冬季 · 泉水仙境",desc:"趵突泉水雾氤氲如仙境，游客少拍照不用排队。1-2月有庙会年味。",tags:["雾气仙境","人少","年味"],route:"仙境雾气线"}],F=G.find(e=>e.months.includes(ft))||G[0];document.getElementById("seasonBanner").innerHTML=`
      <div class="season-banner rv">
        <span class="icon">${F.icon}</span>
        <div style="flex:1;min-width:200px">
          <h3>${F.title}</h3>
          <p>${F.desc}</p>
          <div class="tags">${F.tags.map(e=>`<span class="tag">${e}</span>`).join("")}</div>
        </div>
        <a href="itinerary.html" class="btn btn-primary">🗺️ 查看${F.route}</a>
      </div>`;window.imgFallback=function(e){const t=[["#c9a96e","#e8dcc8"],["#2a9d8f","#d4f1ed"],["#e76f51","#fce4de"],["#8b5cf6","#ede9fe"],["#3b82f6","#dbeafe"],["#f59e0b","#fef3c7"]],n=Math.abs([...e].reduce((m,p)=>m+p.charCodeAt(0),0))%t.length,[i,a]=t[n],s={spring:"⛲",nature:"🌿",history:"🏛️",culture:"📚",food:"🍜",family:"👨‍👩‍👧"}[e]||"🏔️";return`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="${i}" width="600" height="400" rx="12"/><text x="300" y="170" text-anchor="middle" font-size="60">${s}</text><text x="300" y="240" text-anchor="middle" fill="${a}" font-size="24" font-family="sans-serif" font-weight="bold">${e}</text><text x="300" y="280" text-anchor="middle" fill="${a}" font-size="14" font-family="sans-serif" opacity="0.7">济南旅游攻略</text></svg>`)}`};function R(e){q&&e.querySelectorAll(".rv:not(.revealed)").forEach(t=>q.observe(t))}async function yt(){try{const e=await z(),t=e.filter(i=>["must","hot"].includes(i.badge)).slice(0,4);if(t.length<4){const i=e.filter(a=>!t.includes(a)).slice(0,4-t.length);t.push(...i)}const n=document.getElementById("spots-grid");n.innerHTML=t.map(i=>`
          <div class="card rv" data-href="spots.html?id=${i.id}">
            <div class="card-img">
              <img src="${i.img}" alt="${i.name}" loading="lazy" onerror="this.onerror=null;this.src=imgFallback(this.alt);this.parentElement.classList.add('img-loaded')">
              <div class="card-img-gradient"></div>
              <span class="spot-badge badge ${i.badge}">${i.badge==="must"?"必去":i.badge==="hot"?"🔥 热门":i.badge==="free"?"免费":"推荐"}</span>
              <button class="card-fav-btn" data-id="${i.id}" data-type="spot" aria-label="收藏" aria-pressed="false">♡</button>
            </div>
            <div class="card-body">
              <h3>${i.name}</h3>
              <p class="desc">${i.desc}</p>
              <div class="card-meta"><span>${rt(i.rating)} ${i.rating}</span><span>· ${i.reviews} 条评价</span></div>
              <div class="card-price">${i.price===0?'<span class="free">免费</span>':"¥"+i.price}</div>
            </div>
          </div>
        `).join(""),R(n)}catch(e){console.error("加载景点失败:",e)}}async function wt(){try{const e=await D(),t=e.filter(i=>i.must).slice(0,4);if(t.length<4){const i=e.filter(a=>!t.includes(a)).slice(0,4-t.length);t.push(...i)}const n=document.getElementById("food-grid");n.innerHTML=t.map(i=>{var a;return`
          <div class="card rv" data-href="food.html?id=${i.id}">
            <div class="card-img">
              <img src="${i.img}" alt="${i.name}" loading="lazy" onerror="this.onerror=null;this.src=imgFallback(this.alt);this.parentElement.classList.add('img-loaded')">
              <div class="card-img-gradient"></div>
              ${i.must?'<span class="food-badge badge hot">🔥 必吃</span>':""}
              <button class="card-fav-btn" data-id="${i.id}" data-type="food" aria-label="收藏" aria-pressed="false">♡</button>
            </div>
            <div class="card-body">
              <h3>${i.name}</h3>
              <div class="card-tags"><span class="tag">${i.tag}</span></div>
              <p class="desc">${i.desc}</p>
              <div class="card-meta"><span>${i.cat}</span>${(a=i.shops)!=null&&a.length?`<span>· 人均 ${i.shops[0].avg}</span>`:""}</div>
            </div>
          </div>
        `}).join(""),R(n)}catch(e){console.error("加载美食失败:",e)}}async function $t(){const e=new ht,t=await e.fetchWeather();if(t){const n=e.getWeatherIcon(t.code);document.getElementById("heroWeather").textContent=`${n} 济南 ${t.temp}°C ${t.desc}`}else document.getElementById("heroWeather").textContent="🌤️ 济南 四季分明，春秋宜人"}let q=new IntersectionObserver(e=>{let t=0;e.forEach(n=>{n.isIntersecting&&(setTimeout(()=>{n.target.classList.add("revealed")},t),t+=80,q.unobserve(n.target))})},{threshold:.1});document.querySelectorAll(".rv").forEach(e=>q.observe(e));(function(){const t=document.getElementById("fountainCanvas");if(!t)return;const n=t.getContext("2d",{alpha:!0,antialias:!0});n.imageSmoothingEnabled=!0,n.imageSmoothingQuality="high";const i=document.getElementById("rippleContainer");let a,s,m;const p=[],f=[],g=[];let h=-1,y=-1,b=0,$=!0,S=0;const v={particleRate:8,rippleInterval:2500,maxParticles:60,mouseInfluenceRadius:200,mousePushStrength:.3,scrollFadeStart:.3,scrollFadeEnd:.8,springPositions:[.3,.5,.7]};function H(){a=t.width=t.offsetWidth,s=t.height=t.offsetHeight,m=s*.85}H(),window.addEventListener("resize",H);class d{constructor(o){this.xFrac=o,this.x=a*o,this.intensity=.5+Math.random()*.5,this.phase=Math.random()*Math.PI*2}update(){if(this.x=a*this.xFrac,this.intensity=.4+.3*Math.sin(S*.01+this.phase),h>0){const o=h-this.x,r=Math.abs(o);r<v.mouseInfluenceRadius&&(this.intensity+=(1-r/v.mouseInfluenceRadius)*.3)}}}class u{constructor(o){this.spring=o,this.reset()}reset(){const o=a*.08;this.x=this.spring.x+(Math.random()-.5)*o,this.baseY=m,this.height=0,this.maxHeight=s*(.15+Math.random()*.25)*this.spring.intensity,this.speed=1.2+Math.random()*1.5,this.life=0,this.maxLife=80+Math.random()*40,this.width=1.5+Math.random()*2.5,this.drift=(Math.random()-.5)*.6,this.depth=.5+Math.random()*.5}update(){if(this.life++,this.maxHeight=s*(.15+Math.random()*.25)*this.spring.intensity,this.life<this.maxLife*.35?this.height=Math.min(this.height+this.speed*this.depth,this.maxHeight):this.height*=.97,h>0){const o=h-this.x,r=Math.abs(o);if(r<v.mouseInfluenceRadius){const l=(1-r/v.mouseInfluenceRadius)*v.mousePushStrength;this.drift+=(o>0?l:-l)*.1}}this.drift*=.98,this.life>this.maxLife&&this.reset()}draw(){const o=this.life/this.maxLife,r=o<.35?o/.35:1-(o-.35)/.65,l=Math.max(0,Math.min(1,r))*.6*this.depth,E=this.x+this.drift*this.height*.15,A=n.createLinearGradient(this.x,this.baseY,E,this.baseY-this.height);A.addColorStop(0,`rgba(42,157,143,${l})`),A.addColorStop(.4,`rgba(100,200,190,${l*.6})`),A.addColorStop(1,`rgba(200,240,235,${l*.2})`),n.beginPath(),n.moveTo(this.x-this.width/2,this.baseY),n.quadraticCurveTo(this.x+this.drift*3,this.baseY-this.height*.6,E,this.baseY-this.height),n.quadraticCurveTo(this.x+this.drift*3,this.baseY-this.height*.6,this.x+this.width/2,this.baseY),n.fillStyle=A,n.fill()}}class P{constructor(o,r,l){this.x=o,this.y=r,this.vx=(Math.random()-.5)*3*l,this.vy=-(1.5+Math.random()*4*l),this.gravity=.06,this.life=0,this.maxLife=50+Math.random()*30,this.size=1+Math.random()*3,this.depth=.5+Math.random()*.5}update(){if(this.x+=this.vx*this.depth,this.y+=this.vy,this.vy+=this.gravity,this.vx*=.99,h>0){const o=this.x-h,r=this.y-y,l=Math.sqrt(o*o+r*r);if(l<80){const E=(80-l)/80*.5;this.vx+=o/l*E,this.vy+=r/l*E}}this.life++}draw(){const o=(1-this.life/this.maxLife)*.8;n.beginPath(),n.arc(this.x,this.y,this.size*3,0,Math.PI*2),n.fillStyle=`rgba(42,157,143,${o*.1})`,n.fill(),n.beginPath(),n.arc(this.x,this.y,this.size,0,Math.PI*2),n.fillStyle=`rgba(220,250,245,${o})`,n.fill()}get dead(){return this.life>this.maxLife}}v.springPositions.forEach(c=>{const o=new d(c);g.push(o);const r=1+Math.floor(Math.random()*2);for(let l=0;l<r;l++){const E=new u(o);E.life=Math.floor(Math.random()*E.maxLife),f.push(E)}});let j;function Y(){if(!$||!i)return;const c=document.createElement("div");c.className="water-ripple";const o=g[Math.floor(Math.random()*g.length)],r=15+Math.random()*25,l=o.x+(Math.random()-.5)*60;c.style.cssText=`width:${r}px;height:${r}px;left:${l-r/2}px;top:${m-r/2}px;animation-duration:${4+Math.random()*4}s`,i.appendChild(c),c.addEventListener("animationend",()=>c.remove())}j=setInterval(Y,v.rippleInterval),Y();function et(){const c=document.querySelector(".hero");if(!c)return;const o=c.getBoundingClientRect(),r=c.offsetHeight;b=Math.max(0,Math.min(1,-o.top/r))}const L=document.querySelector(".hero");L&&(L.addEventListener("mousemove",c=>{const o=L.getBoundingClientRect();h=c.clientX,y=c.clientY-o.top}),L.addEventListener("mouseleave",()=>{h=-1,y=-1})),L&&(L.addEventListener("touchmove",c=>{const o=L.getBoundingClientRect(),r=c.touches[0];h=r.clientX,y=r.clientY-o.top},{passive:!0}),L.addEventListener("touchend",()=>{h=-1,y=-1})),new IntersectionObserver(c=>{c.forEach(o=>{$=o.isIntersecting,$?(t.classList.add("ready"),t.classList.remove("hidden")):(t.classList.remove("ready"),t.classList.add("hidden"))})},{threshold:.05}).observe(L||t);function W(){if(!$){requestAnimationFrame(W);return}et(),n.clearRect(0,0,a,s),S++;let c=1;b>v.scrollFadeStart&&(c=1-(b-v.scrollFadeStart)/(v.scrollFadeEnd-v.scrollFadeStart),c=Math.max(0,c)),t.style.opacity=c*.35,g.forEach(o=>o.update()),S%v.particleRate===0&&p.length<v.maxParticles&&f.forEach(o=>{if(o.height>15&&o.life<o.maxLife*.5){const r=o.baseY-o.height,l=o.x+o.drift*o.height*.15;p.push(new P(l+(Math.random()-.5)*6,r,o.spring.intensity))}}),g.forEach(o=>{const r=n.createRadialGradient(o.x,m,0,o.x,m,120*o.intensity);r.addColorStop(0,`rgba(42,157,143,${.1*o.intensity})`),r.addColorStop(.5,`rgba(42,157,143,${.03*o.intensity})`),r.addColorStop(1,"transparent"),n.fillStyle=r,n.fillRect(o.x-200,m-50,400,100)}),f.sort((o,r)=>o.depth-r.depth),f.forEach(o=>{o.update(),o.draw()});for(let o=p.length-1;o>=0;o--)p[o].update(),p[o].draw(),p[o].dead&&p.splice(o,1);if(h>0&&y>0){const o=n.createRadialGradient(h,y,0,h,y,100);o.addColorStop(0,"rgba(201,169,110,0.06)"),o.addColorStop(1,"transparent"),n.fillStyle=o,n.fillRect(h-100,y-100,200,200)}requestAnimationFrame(W)}W(),document.addEventListener("visibilitychange",()=>{document.hidden?clearInterval(j):j=setInterval(Y,v.rippleInterval)})})();(function(){const t=document.querySelectorAll(".hero-slide"),n=document.getElementById("heroPrev"),i=document.getElementById("heroNext");if(!t.length)return;let a=0,s=null;const m=5e3;function p(h){t[a].classList.remove("active"),a=(h+t.length)%t.length,t[a].classList.add("active")}function f(){g(),s=setInterval(()=>p(a+1),m)}function g(){s&&(clearInterval(s),s=null)}n.addEventListener("click",()=>{p(a-1),f()}),i.addEventListener("click",()=>{p(a+1),f()}),f()})();(function(){const t=document.querySelectorAll('img[loading="lazy"]');if(!t.length)return;const n=new IntersectionObserver(i=>{i.forEach(a=>{if(!a.isIntersecting)return;const s=a.target;s.parentElement.classList.add("img-loading"),s.addEventListener("load",()=>{s.parentElement.classList.remove("img-loading"),s.classList.add("img-loaded")},{once:!0}),s.addEventListener("error",()=>{s.parentElement.classList.remove("img-loading"),s.src="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect fill="#e8dcc8" width="400" height="250"/><text x="200" y="120" text-anchor="middle" fill="#c9a96e" font-size="40">🏔️</text><text x="200" y="160" text-anchor="middle" fill="#999" font-size="14" font-family="sans-serif">图片加载中...</text></svg>')},{once:!0}),n.unobserve(s)})},{rootMargin:"200px"});t.forEach(i=>n.observe(i))})();document.addEventListener("click",e=>{const t=e.target.closest(".card, .highlight-card, .route-card, .tool-card");if(!t)return;const n=document.createElement("span");n.className="ripple";const i=t.getBoundingClientRect(),a=Math.max(i.width,i.height)*2;n.style.cssText=`width:${a}px;height:${a}px;left:${e.clientX-i.left-a/2}px;top:${e.clientY-i.top-a/2}px`,t.appendChild(n),n.addEventListener("animationend",()=>n.remove())});yt();wt();$t();(async function(){const t=document.getElementById("recommendTrack"),n=document.getElementById("recDots"),i=document.getElementById("recPrev"),a=document.getElementById("recNext");if(!t)return;let s=[];try{s=await z()}catch(d){console.error("推荐数据加载失败:",d);return}const m=s.sort((d,u)=>u.rating-d.rating).slice(0,5);if(!m.length)return;const p=["今日必去","人气最高","编辑推荐","口碑之选","游客最爱"],f=["#c9a96e","#e76f51","#2a9d8f","#8b5cf6","#3b82f6"];t.innerHTML=m.map((d,u)=>{const P=d.price===0?"免费":"¥"+d.price;return`
          <div class="recommend-slide" onclick="location.href='spots.html?id=${d.id}'">
            <img src="${d.img}" alt="${d.name}" loading="${u===0?"eager":"lazy"}">
            <div class="slide-overlay">
              <span class="slide-badge" style="background:${f[u]||f[0]}">${p[u]||"推荐"}</span>
              <div class="slide-stars">${"★".repeat(Math.floor(d.rating))}${d.rating%1>=.3?"★":""} ${d.rating}</div>
              <div class="slide-name">${d.name}</div>
              <div class="slide-desc">${d.desc}</div>
              <div class="slide-meta">
                <span>🎫 ${P}</span>
                <span>⏱ ${d.dur}</span>
                <span>💬 ${d.reviews} 条评价</span>
              </div>
              <button class="slide-btn" onclick="event.stopPropagation();location.href='spots.html?id=${d.id}'" aria-label="查看详情 →">查看详情 →</button>
            </div>
          </div>`}).join(""),n.innerHTML=m.map((d,u)=>`<span class="recommend-dot${u===0?" active":""}" data-idx="${u}"></span>`).join("");let g=0;const h=m.length;let y=null;function b(d){g=(d%h+h)%h,t.style.transform=`translateX(-${g*100}%)`,n.querySelectorAll(".recommend-dot").forEach((u,P)=>{u.classList.toggle("active",P===g)})}function $(){S(),y=setInterval(()=>b(g+1),5e3)}function S(){y&&(clearInterval(y),y=null)}i.addEventListener("click",()=>{b(g-1),$()}),a.addEventListener("click",()=>{b(g+1),$()}),n.addEventListener("click",d=>{const u=d.target.closest(".recommend-dot");u&&(b(+u.dataset.idx),$())});let v=0;t.addEventListener("touchstart",d=>{v=d.touches[0].clientX,S()},{passive:!0}),t.addEventListener("touchend",d=>{const u=v-d.changedTouches[0].clientX;Math.abs(u)>50&&b(u>0?g+1:g-1),$()},{passive:!0});const H=document.getElementById("recommendCarousel");H.addEventListener("mouseenter",S),H.addEventListener("mouseleave",$),$(),R(t.parentElement)})();(async function(){const t=document.getElementById("hotSpotsScroll");if(t)try{const i=(await z()).sort((a,s)=>s.rating-a.rating).slice(0,6);t.innerHTML=i.map(a=>{const s=a.price===0?"免费":"¥"+a.price,m={must:"必去",hot:"🔥 热门",free:"免费",hidden:"小众",kid:"亲子"},p={must:"#c9a96e",hot:"#e76f51",free:"#2a9d8f",hidden:"#8b5cf6",kid:"#f59e0b"};return`
            <div class="preview-card rv" onclick="location.href='spots.html?id=${a.id}'">
              <div class="preview-img">
                <img src="${a.img}" alt="${a.name}" loading="lazy" onerror="this.onerror=null;this.src=imgFallback(this.alt)">
                <span class="preview-badge" style="background:${p[a.badge]||"#c9a96e"}">${m[a.badge]||"推荐"}</span>
                <span class="preview-rating">★ ${a.rating}</span>
              </div>
              <div class="preview-body">
                <h3>${a.name}</h3>
                <p class="preview-desc">${a.desc}</p>
                <div class="preview-meta">
                  <span>⏱ ${a.dur}</span>
                  <span class="preview-price">${s}</span>
                </div>
              </div>
            </div>`}).join(""),R(t)}catch(n){console.error("热门景点加载失败:",n)}})();(async function(){const t=document.getElementById("foodPreviewScroll");if(t)try{const n=await D(),i=n.filter(a=>a.must).slice(0,6);if(i.length<6){const a=n.filter(s=>!i.includes(s)).slice(0,6-i.length);i.push(...a)}t.innerHTML=i.map(a=>{var f;const s=(f=a.shops)==null?void 0:f[0],m=s?s.name:"",p=s?s.avg:a.price||"";return`
            <div class="preview-card rv" onclick="location.href='food.html?id=${a.id}'">
              <div class="preview-img">
                <img src="${a.img}" alt="${a.name}" loading="lazy" onerror="this.onerror=null;this.src=imgFallback(this.alt)">
                ${a.must?'<span class="preview-badge" style="background:#e76f51">🔥 必吃</span>':""}
                <span class="preview-rating">★ 4.5</span>
              </div>
              <div class="preview-body">
                <h3>${a.name}</h3>
                <p class="preview-desc">${a.desc}</p>
                <div class="preview-meta">
                  <span>${m}</span>
                  <span class="preview-price">${p}</span>
                </div>
              </div>
            </div>`}).join(""),R(t)}catch(n){console.error("美食预览加载失败:",n)}})();function xt(){const e=new Date().getMonth()+1,t={spring:{items:[{name:"五龙潭樱花",desc:"3月底-4月中旬，200余株樱花盛开，免费观赏",img:"https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop",link:"spots.html?id=wulongtan"},{name:"大明湖荷花",desc:"4月起荷花初开，湖畔散步超惬意",img:"https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400&h=300&fit=crop",link:"spots.html?id=daminghu"},{name:"千佛山踏青",desc:"山花烂漫，登高望远，气温宜人",img:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",link:"spots.html?id=qianfo"}]},summer:{items:[{name:"护城河夜游",desc:"夏夜乘船，凉风习习，灯光璀璨",img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",link:"guide.html"},{name:"泉水浴场",desc:"天然泉水泳池，恒温18°C的清凉",img:"https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=300&fit=crop",link:"spots.html?id=quanshui"},{name:"省博物馆",desc:"空调充足，文化底蕴深厚",img:"https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop",link:"spots.html?id=museum"}]},autumn:{items:[{name:"红叶谷",desc:"10月中-11月中，漫山红遍，层林尽染",img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",link:"spots.html?id=hongye"},{name:"千佛山红叶",desc:"市区赏红叶最方便的地方",img:"https://images.unsplash.com/photo-1541789094913-f3809a8f3ba5?w=400&h=300&fit=crop",link:"spots.html?id=qianfo"},{name:"灵岩寺银杏",desc:"千年银杏金黄，古刹秋色",img:"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=300&fit=crop",link:"spots.html?id=lingyan"}]},winter:{items:[{name:"趵突泉雾气",desc:"冬日清晨，泉水雾气氤氲如仙境",img:"https://images.unsplash.com/photo-1517587662384-26d954922c19?w=400&h=300&fit=crop",link:"spots.html?id=baotu"},{name:"大明湖雪景",desc:"雪后大明湖，银装素裹",img:"https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&h=300&fit=crop",link:"spots.html?id=daminghu"},{name:"温泉体验",desc:"冬日泡温泉，暖身又养生",img:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",link:"guide.html"}]}},n=e>=3&&e<=5?"spring":e>=6&&e<=8?"summer":e>=9&&e<=11?"autumn":"winter",i=t[n],a=document.getElementById("seasonalContent");a&&(a.innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
          ${i.items.map(s=>`
            <div class="card rv" onclick="location.href='${s.link}'" style="cursor:pointer">
              <div class="card-img">
                <img src="${s.img}" alt="${s.name}" loading="lazy">
                <span class="badge" style="position:absolute;top:12px;left:12px;z-index:2;background:rgba(201,169,110,.9);color:#fff">🌸 季节限定</span>
              </div>
              <div class="card-body">
                <h3>${s.name}</h3>
                <p class="desc">${s.desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `,R(a))}xt();const bt=[{name:"北京小王",avatar:"京",avatarClass:"avatar-coral",date:"2026-04-20",stars:5,text:'趵突泉真的太震撼了！三股水涌出来的那一刻，理解了什么叫"泉城"。冬天去的，水雾氤氲如仙境，照片都不用修。',spot:"趵突泉",helpful:42},{name:"上海旅行家",avatar:"沪",avatarClass:"avatar-teal",date:"2026-04-15",stars:5,text:"大明湖免费区域就逛了半天，超然楼亮灯瞬间太美了！建议5点半就去南岸占位。芙蓉街的小吃也很棒，油旋和甜沫绝配。",spot:"大明湖",helpful:38},{name:"广州美食控",avatar:"粤",avatarClass:"avatar-purple",date:"2026-04-10",stars:4,text:"为了鲁菜来的济南，没失望！糖醋鲤鱼、九转大肠、把子肉，每一道都让人回味。老商埠区的咖啡馆也很有调性。",spot:"美食之旅",helpful:27},{name:"成都背包客",avatar:"蓉",avatarClass:"avatar-blue",date:"2026-03-28",stars:5,text:"千佛山登顶俯瞰全城的感觉太棒了，秋天红叶漫山。灵岩寺的宋代彩塑罗汉栩栩如生，不愧四大名刹之首。济南人很热情，问路都特别耐心。",spot:"千佛山",helpful:35},{name:"杭州小陈",avatar:"杭",avatarClass:"avatar-pink",date:"2026-04-05",stars:5,text:"带父母来的，老人家特别喜欢趵突泉和大明湖。节奏不快，两天刚好。把子肉和甜沫是爸妈的最爱，说比杭州菜有味道。",spot:"家庭游",helpful:31},{name:"深圳程序员",avatar:"深",avatarClass:"",date:"2026-03-20",stars:4,text:"周末两天特种兵式打卡，趵突泉→五龙潭→大明湖→芙蓉街→黑虎泉→宽厚里，步行就够了。唯一遗憾是没约上省博物馆。",spot:"周末游",helpful:24},{name:"南京文青",avatar:"宁",avatarClass:"avatar-teal",date:"2026-04-18",stars:5,text:'李清照纪念堂太美了，"常记溪亭日暮"的意境在这里都能找到。护城河夜游强烈推荐，灯光映在水面上，很有诗意。',spot:"文化之旅",helpful:33},{name:"重庆辣妹",avatar:"渝",avatarClass:"avatar-coral",date:"2026-04-01",stars:4,text:"本以为济南菜会很清淡，结果把子肉和烧烤都很对味！济南人说话太有意思了，问路大爷给我讲了半小时泉水故事。超爱这座城市。",spot:"美食探店",helpful:22}];function Lt(){const e=document.getElementById("homeReviews");e&&(e.innerHTML=bt.map(t=>`
        <div class="review-card rv">
          <div class="head">
            <div class="avatar ${t.avatarClass||""}">${t.avatar}</div>
            <div><div class="name">${t.name}</div><div class="date">${t.date} · ${t.spot}</div></div>
          </div>
          <div class="stars">${"★".repeat(t.stars)}${"☆".repeat(5-t.stars)}</div>
          <div class="text">${t.text}</div>
          <button aria-label="标记为有用" class="helpful-btn" data-count="${t.helpful}">👍 有用 (${t.helpful})</button>
        </div>
      `).join(""),e.querySelectorAll(".helpful-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const i=parseInt(t.dataset.count);t.classList.contains("active")?(t.classList.remove("active"),t.dataset.count=i-1,t.textContent=`👍 有用 (${i-1})`):(t.classList.add("active"),t.dataset.count=i+1,t.textContent=`👍 有用 (${i+1})`)})}),R(e))}Lt();
