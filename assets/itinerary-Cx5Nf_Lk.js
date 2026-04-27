const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/social-BtvQIZg-.js","assets/social-IJRaxWbQ.css"])))=>i.map(i=>d[i]);
import{a as U,i as Y,_ as V,b as W,d as g,o as G}from"./social-BtvQIZg-.js";import{A as X,O as Z,F as tt,T as et}from"./interactive-Nl2I4oKJ.js";import{i as at}from"./shopify-animations-C_FKrdXc.js";U();Y();V(()=>import("./social-BtvQIZg-.js").then(e=>e.e),__vite__mapDeps([0,1])).then(e=>{e.initPageTransition(),e.initStaggerReveal()});at();W();const E={};document.querySelectorAll(".itinerary-quiz .quiz-opt").forEach(e=>{e.addEventListener("click",()=>{const t=e.closest(".quiz-step");t.querySelectorAll(".quiz-opt").forEach(n=>n.classList.remove("selected")),e.classList.add("selected"),E[t.dataset.step]=e.dataset.val,setTimeout(()=>{t.classList.remove("active");const n=t.nextElementSibling;n&&n.classList.contains("quiz-step")?n.classList.add("active"):st()},300)})});function st(){const e=parseInt(E[1])||2,t=E[2]||"solo",n=E[3]||"culture",c={"1-culture":{name:"一日文化速览",steps:["趵突泉","大明湖","芙蓉街午餐","千佛山","宽厚里晚餐"]},"1-food":{name:"一日美食暴走",steps:["甜沫油旋早餐","趵突泉","草包包子午餐","大明湖","把子肉晚餐"]},"1-nature":{name:"一日自然之旅",steps:["趵突泉","五龙潭","大明湖","护城河步道","千佛山日落"]},"1-relax":{name:"一日休闲漫步",steps:["曲水亭街","百花洲","大明湖泛舟","芙蓉街下午茶","宽厚里夜游"]},"2-culture":{name:"两日深度文化",day1:["趵突泉","五龙潭","大明湖"],day2:["千佛山","省博物馆","老商埠"]},"2-food":{name:"两日美食之旅",day1:["糖醋鲤鱼","把子肉","油旋甜沫"],day2:["九转大肠","草包包子","烧烤夜宵"]},"2-nature":{name:"两日山水行",day1:["趵突泉","护城河游船","大明湖"],day2:["千佛山","红叶谷","灵岩寺"]},"2-relax":{name:"两日慢生活",day1:["曲水亭街","百花洲","泉水茶馆"],day2:["省博物馆","老商埠咖啡","护城河夜游"]},"3-culture":{name:"三日全览",day1:["泉水线"],day2:["文化线"],day3:["灵岩寺/红叶谷"]},"3-food":{name:"三日美食全览",day1:["早餐甜沫油旋","午餐草包包子","晚餐宽厚里"],day2:["早餐把子肉","午餐聚丰德","晚餐泉水宴"],day3:["早餐糁汤","午餐农家菜","晚餐烧烤"]},"3-nature":{name:"三日山水全览",day1:["趵突泉","护城河","大明湖"],day2:["千佛山","红叶谷"],day3:["灵岩寺","百脉泉"]},"3-relax":{name:"三日悠享",day1:["曲水亭街漫步","百花洲","泉水茶馆"],day2:["省博物馆","洪家楼教堂","老商埠"],day3:["大明湖泛舟","宽厚里下午茶","护城河夜游"]}},m=`${e}-${n}`,p=c[m]||c["2-culture"];document.getElementById("itineraryQuiz").style.display="none";const o=document.getElementById("quizResult");o.style.display="block";const i=t==="couple"?"情侣":t==="family"?"亲子":t==="friends"?"朋友":"独自",d=n==="food"?"美食":n==="nature"?"自然":n==="relax"?"休闲":"文化";let a="";p.day1?(a+='<div style="font-weight:700;margin:12px 0 8px;color:var(--accent)">Day 1</div>',a+=p.day1.map((s,r)=>`<div class="route-step"><span class="step-num">${r+1}</span><div><div class="step-name">${s}</div></div></div>`).join(""),p.day2&&(a+='<div style="font-weight:700;margin:12px 0 8px;color:var(--accent)">Day 2</div>',a+=p.day2.map((s,r)=>`<div class="route-step"><span class="step-num">${r+1}</span><div><div class="step-name">${s}</div></div></div>`).join("")),p.day3&&(a+='<div style="font-weight:700;margin:12px 0 8px;color:var(--accent)">Day 3</div>',a+=p.day3.map((s,r)=>`<div class="route-step"><span class="step-num">${r+1}</span><div><div class="step-name">${s}</div></div></div>`).join(""))):a=p.steps.map((s,r)=>`<div class="route-step"><span class="step-num">${r+1}</span><div><div class="step-name">${s}</div></div></div>`).join(""),o.innerHTML=`
        <div class="quiz-result-card">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <span style="font-size:2rem">🎯</span>
            <div>
              <h3 style="margin:0">${p.name}</h3>
              <div style="font-size:.85rem;color:var(--text2)">${e}天 · ${i} · ${d}</div>
            </div>
          </div>
          <div class="route">${a}</div>
          <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="document.getElementById('smartPlanner').scrollIntoView({behavior:'smooth'})" aria-label="查看完整行程 →">查看完整行程 →</button>
            <button class="btn btn-outline" onclick="resetQuiz()" aria-label="重新选择">重新选择</button>
          </div>
        </div>
      `}window.resetQuiz=function(){document.getElementById("itineraryQuiz").style.display="block",document.getElementById("quizResult").style.display="none",document.querySelectorAll(".itinerary-quiz .quiz-step").forEach((e,t)=>{e.classList.toggle("active",t===0),e.querySelectorAll(".quiz-opt").forEach(n=>n.classList.remove("selected"))})};const P=new X,R=document.createElement("div");R.innerHTML=P.renderToolbar();document.body.appendChild(R);P.bindToolbar();const nt=new Z;nt.cacheEssentials();let y=[],L=[];async function it(){const[e,t]=await Promise.all([fetch("/jinan-travel-guide/data/spots.json"),fetch("/jinan-travel-guide/data/food.json")]);y=await e.json();const n=await t.json();L=n.foods||n,new et(y,L),F("1day"),_("spring"),f()}const I={"1day":{title:"⏰ 1日精华游",difficulty:"easy",duration:"8-9h",cost:"¥150-250",distance:"约 8km",bestFor:"时间紧张的首次游客",desc:"一天打卡济南三大名胜，泉水+湖泊+老街，不走回头路",days:[{header:"Day 1 · 泉水精华线",items:[{time:"08:00-10:00",name:"趵突泉",icon:"⛲",details:"天下第一泉，三窟并发",cost:"¥40",transport:"地铁2号线趵突泉站B口",tips:"建议8点前入园避开人流"},{time:"10:00-10:20",name:"步行 → 五龙潭",icon:"🚶",details:"步行约15分钟",cost:"—",transport:"步行",tips:"趵突泉北门出，沿共青团路向北"},{time:"10:20-11:20",name:"五龙潭公园",icon:"🌊",details:"比趵突泉人少，秦琼故宅",cost:"¥5",transport:"步行可达",tips:"4月樱花季超美"},{time:"11:30-12:30",name:"午餐：草包包子铺",icon:"🍜",details:"百年老字号，皮薄馅大",cost:"¥35",transport:"步行10分钟到泉城路",tips:"荷叶包子必点"},{time:"13:00-14:30",name:"大明湖（免费区）",icon:"🏞️",details:"四面荷花三面柳，湖心岛散步",cost:"免费",transport:"步行15分钟",tips:"沿湖散步，拍照超出片"},{time:"14:30-15:30",name:"超然楼",icon:"🏯",details:"大明湖标志性建筑，登楼俯瞰",cost:"¥40",transport:"湖内步行",tips:"下午光线好适合拍照"},{time:"16:00-17:00",name:"芙蓉街·曲水亭街",icon:"🏮",details:"青石板路，泉水人家，边逛边吃",cost:"人均¥30",transport:"步行10分钟",tips:"油旋、甜沫尝一下"},{time:"17:30-18:30",name:"黑虎泉",icon:"🐯",details:"护城河畔散步，看本地人打水",cost:"免费",transport:"步行15分钟",tips:"傍晚光线最美"},{time:"18:30-19:30",name:"晚餐：宽厚里",icon:"🍖",details:"护城河畔美食街，烧烤+小吃",cost:"人均¥60",transport:"步行5分钟",tips:"夜景绝佳"}]}]},"2day":{title:"📅 2日深度游",difficulty:"medium",duration:"2天",cost:"¥400-600",distance:"约 15km",bestFor:"想深度体验济南的游客",desc:"Day1 泉水线 + Day2 文化线，覆盖主要景点和美食",days:[{header:"Day 1 · 泉水寻踪",items:[{time:"07:30-08:30",name:"早餐：甜沫+油旋",icon:"🌅",details:"济南灵魂早餐",cost:"¥10",transport:"—",tips:"超意兴或春江饭店"},{time:"09:00-11:00",name:"趵突泉",icon:"⛲",details:"天下第一泉，李清照纪念堂",cost:"¥40",transport:"地铁2号线",tips:"早上人少，慢慢逛"},{time:"11:15-12:00",name:"五龙潭公园",icon:"🌊",details:"小众秘境，清澈见底",cost:"¥5",transport:"步行15分钟",tips:"比趵突泉清净"},{time:"12:15-13:30",name:"午餐：聚丰德",icon:"🍲",details:"糖醋鲤鱼+九转大肠",cost:"人均¥85",transport:"步行10分钟",tips:"经典鲁菜体验"},{time:"14:00-16:00",name:"大明湖+超然楼",icon:"🏞️",details:"湖心岛+登楼俯瞰",cost:"¥40",transport:"步行15分钟",tips:"下午光线好"},{time:"16:30-18:00",name:"黑虎泉+护城河步道",icon:"🐯",details:"沿护城河散步，看打水",cost:"免费",transport:"步行",tips:"泉水可直饮"},{time:"18:30-20:00",name:"芙蓉街+宽厚里",icon:"🏮",details:"逛吃一条龙，夜景绝佳",cost:"人均¥60",transport:"步行",tips:"工作日人少"}]},{header:"Day 2 · 文化探索",items:[{time:"08:00-08:30",name:"早餐：把子肉",icon:"🍖",details:"超意兴，济南灵魂快餐",cost:"¥15",transport:"—",tips:"浇汤汁配米饭"},{time:"09:00-11:30",name:"千佛山",icon:"⛰️",details:"登顶俯瞰全城，佛像石刻",cost:"¥30",transport:"公交K51路",tips:"索道上山步行下山最省力"},{time:"12:00-13:30",name:"午餐：闫府私房菜",icon:"🍲",details:"爆炒腰花+奶汤蒲菜",cost:"人均¥95",transport:"打车15分钟",tips:"环境好适合拍照"},{time:"14:00-16:30",name:"山东省博物馆",icon:"🏛️",details:"镇馆之宝：蛋壳黑陶杯",cost:"免费(预约)",transport:"公交K51路",tips:"租讲解器¥20"},{time:"17:00-18:00",name:"老商埠区",icon:"🏘️",details:"百年近代建筑，Citywalk",cost:"免费",transport:"公交",tips:"爱心红绿灯打卡"},{time:"18:30-19:30",name:"晚餐：泉水宴",icon:"🍵",details:"趵突泉水烹制系列菜肴",cost:"人均¥120",transport:"打车",tips:"泉水豆腐必点"}]}]},"3day":{title:"🗓️ 3日全览游",difficulty:"hard",duration:"3天",cost:"¥800-1200",distance:"约 30km",bestFor:"时间充裕、想深度探索",desc:"覆盖市区所有精华 + 周边灵岩寺/红叶谷",days:[{header:"Day 1 · 泉水精华（同1日游）",items:[{time:"08:00-10:00",name:"趵突泉",icon:"⛲",details:"天下第一泉",cost:"¥40",transport:"地铁2号线",tips:"8点前入园"},{time:"10:15-11:15",name:"五龙潭",icon:"🌊",details:"小众秘境",cost:"¥5",transport:"步行",tips:"樱花季最美"},{time:"11:30-13:00",name:"午餐+芙蓉街",icon:"🍜",details:"草包包子+油旋",cost:"¥40",transport:"步行",tips:"边走边吃"},{time:"13:30-16:00",name:"大明湖+超然楼",icon:"🏞️",details:"湖心岛+登楼",cost:"¥40",transport:"步行",tips:"等亮灯"},{time:"16:30-18:00",name:"黑虎泉+护城河",icon:"🐯",details:"散步+打水",cost:"免费",transport:"步行",tips:"傍晚最美"},{time:"18:30-20:00",name:"宽厚里晚餐+夜景",icon:"🌙",details:"烧烤+酒吧街",cost:"¥80",transport:"步行",tips:"夜景绝佳"}]},{header:"Day 2 · 文化深度",items:[{time:"08:00-08:30",name:"把子肉早餐",icon:"🍖",details:"超意兴",cost:"¥15",transport:"—",tips:"浇汤汁"},{time:"09:00-12:00",name:"千佛山",icon:"⛰️",details:"登顶+佛像+兴国禅寺",cost:"¥30",transport:"K51路",tips:"索道上步行下"},{time:"12:30-14:00",name:"午餐：燕喜堂",icon:"🍲",details:"奶汤蒲菜+糖醋鲤鱼",cost:"¥90",transport:"打车",tips:"老字号"},{time:"14:30-17:00",name:"山东省博物馆",icon:"🏛️",details:"3小时深度游",cost:"免费",transport:"K51路",tips:"租讲解器"},{time:"17:30-18:30",name:"洪家楼教堂",icon:"⛪",details:"华北最大天主教堂",cost:"免费",transport:"K55路",tips:"拍照出片"},{time:"19:00-20:00",name:"晚餐：聚丰德",icon:"🍲",details:"九转大肠",cost:"¥85",transport:"打车",tips:"经典鲁菜"}]},{header:"Day 3 · 周边探索",items:[{time:"07:00-09:00",name:"出发 → 灵岩寺",icon:"🚗",details:"长途汽车站班车",cost:"车票¥30",transport:"长途汽车1.5h",tips:"早出发"},{time:"09:30-12:00",name:"灵岩寺",icon:"🏛️",details:"千年古刹，彩塑罗汉",cost:"¥40",transport:"—",tips:"秋季银杏最美"},{time:"12:00-13:00",name:"寺内素斋/自带午餐",icon:"🍱",details:"简单午餐",cost:"¥20",transport:"—",tips:"自带干粮也行"},{time:"13:30-15:00",name:"墓塔林+辟支塔",icon:"🕌",details:"中国第二大塔林",cost:"含在门票",transport:"步行",tips:"拍照绝佳"},{time:"15:30-17:30",name:"返回济南市区",icon:"🚗",details:"班车返回",cost:"¥30",transport:"长途汽车1.5h",tips:"注意末班时间"},{time:"18:00-19:30",name:"告别晚餐：老商埠区",icon:"🍷",details:"文艺餐厅+咖啡",cost:"¥100",transport:"打车",tips:"完美收官"}]}]},family:{title:"👨‍👩‍👧 亲子专线",difficulty:"easy",duration:"2天",cost:"¥500-800",distance:"约 10km",bestFor:"带 3-12 岁孩子的家庭",desc:"节奏轻松，互动体验多，孩子不无聊",days:[{header:"Day 1 · 泉水+动物",items:[{time:"09:00-11:00",name:"趵突泉",icon:"⛲",details:"看锦鲤喂鱼，孩子最爱",cost:"¥40(1.4m以下免费)",transport:"地铁",tips:"买鱼食¥5"},{time:"11:15-12:15",name:"午餐：草包包子铺",icon:"🥟",details:"孩子爱吃包子",cost:"¥35",transport:"步行",tips:"荷叶包子"},{time:"13:30-16:00",name:"大明湖游船",icon:"🚣",details:"坐船游湖，孩子超开心",cost:"¥40/人",transport:"步行",tips:"电动船更安全"},{time:"16:30-17:30",name:"芙蓉街小吃",icon:"🍡",details:"糖画、棉花糖、冰淇淋",cost:"¥30",transport:"步行",tips:"控制零食量"},{time:"18:00-19:00",name:"晚餐：超意兴",icon:"🍖",details:"把子肉+米饭，简单实惠",cost:"¥15/人",transport:"步行",tips:"孩子也能吃"}]},{header:"Day 2 · 博物馆+公园",items:[{time:"09:00-11:30",name:"山东省博物馆",icon:"🏛️",details:"恐龙化石+互动展区",cost:"免费",transport:"K51路",tips:"有儿童导览"},{time:"12:00-13:00",name:"午餐",icon:"🍕",details:"博物馆附近餐厅",cost:"¥50",transport:"—",tips:"—"},{time:"14:00-16:00",name:"千佛山（索道上山）",icon:"🚡",details:"坐索道上山，孩子兴奋",cost:"¥30+索道¥30",transport:"K51路",tips:"索道省力"},{time:"16:30-17:30",name:"五龙潭公园",icon:"🌸",details:"樱花季超美，草坪野餐",cost:"¥5",transport:"打车",tips:"带野餐垫"}]}]},art:{title:"🎨 文艺专线",difficulty:"easy",duration:"1.5天",cost:"¥300-500",distance:"约 12km",bestFor:"文艺青年、拍照爱好者",desc:"Citywalk+老建筑+咖啡+书店，出片率拉满",days:[{header:"Day 1 · 老建筑+咖啡",items:[{time:"09:00-10:30",name:"老商埠区(经三路)",icon:"🏘️",details:"德式建筑群，爱心红绿灯",cost:"免费",transport:"K51路",tips:"上午光线最好"},{time:"10:30-12:00",name:"洪家楼教堂",icon:"⛪",details:"哥特式双塔，彩色玻璃",cost:"免费",transport:"K55路",tips:"周日弥撒氛围最佳"},{time:"12:00-13:30",name:"咖啡+轻食",icon:"☕",details:"老商埠区独立咖啡馆",cost:"¥50",transport:"步行",tips:"拿铁+蛋糕"},{time:"14:00-16:00",name:"曲水亭街+百花洲",icon:"🏮",details:"泉水人家，青石板路",cost:"免费",transport:"步行",tips:"拍照圣地"},{time:"16:30-18:00",name:"山东省博物馆",icon:"🏛️",details:"蛋壳黑陶杯，极简美学",cost:"免费",transport:"K51路",tips:"拍文物细节"},{time:"18:30-20:00",name:"宽厚里夜景",icon:"🌙",details:"护城河灯光+酒吧街",cost:"¥80",transport:"打车",tips:"夜景模式拍"}]},{header:"Day 2 上午 · 泉水+书店",items:[{time:"08:00-09:30",name:"黑虎泉晨拍",icon:"🐯",details:"清晨打水的老济南",cost:"免费",transport:"步行",tips:"6-7点最有生活气"},{time:"10:00-11:30",name:"趵突泉",icon:"⛲",details:"观澜亭+万竹园",cost:"¥40",transport:"步行",tips:"万竹园人少"},{time:"11:30-12:30",name:"芙蓉街收尾",icon:"🛍️",details:"买伴手礼+最后的小吃",cost:"¥30",transport:"步行",tips:"油旋带走"}]}]}};let J="1day";function F(e){J=e;const t=I[e];if(!t)return;const n={easy:"轻松",medium:"适中",hard:"挑战"};let c=`
        <div class="route-header">
          <div>
            <h2>${t.title}</h2>
            <p style="color:var(--text2);margin-top:4px">${t.desc}</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <span class="route-badge ${t.difficulty}">${n[t.difficulty]}</span>
            <span class="route-meta"><span>⏱ ${t.duration}</span><span>💰 ${t.cost}</span><span>🚶 ${t.distance}</span><span>👥 ${t.bestFor}</span></span>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
          <button class="btn btn-sm btn-outline copy-route-btn" data-route="${e}" aria-label="📋 复制路线" role="tab" aria-selected="false">📋 复制路线</button>
          <button class="btn btn-sm btn-outline add-route-btn" data-route="${e}" aria-label="📌 一键加入行程" role="tab" aria-selected="false">📌 一键加入行程</button>
          <a href="guide.html#panel-tools" class="btn btn-sm btn-outline" style="text-decoration:none">💰 详细预算</a>
        </div>
        <div class="timeline">`;t.days.forEach(s=>{c+=`<div class="timeline-day"><div class="timeline-day-header">${s.header}</div>`;let r=0;s.items.forEach(l=>{const v=parseInt(l.cost.replace(/[^0-9]/g,""))||0;r+=v,c+=`
            <div class="timeline-item">
              <div class="ti-top">
                <span class="ti-time">${l.time}</span>
                <span class="ti-name">${l.icon} ${l.name}</span>
              </div>
              <div class="ti-details">
                <span>${l.details}</span>
              </div>
              <div class="ti-details" style="margin-top:6px">
                <span class="ti-cost">💰 ${l.cost}</span>
                <span class="ti-transport">🚌 ${l.transport}</span>
                ${l.tips?`<span>💡 ${l.tips}</span>`:""}
              </div>
            </div>`}),c+=`<div class="day-total">当日预算约 <strong>¥${r}</strong></div></div>`}),c+="</div>";let m=0,p=0,o=0,i=0;const d=["🍜","🍲","🍖","🍕","🥟","☕","🍵","🍱","🍡","🍷","🌙","🛍️","🌅"],a=["🚶","🚗"];t.days.forEach(s=>{s.items.forEach(r=>{const l=parseInt(r.cost.replace(/[^0-9]/g,""))||0;i+=l,d.includes(r.icon)||r.name.includes("餐")||r.name.includes("咖啡")||r.details.includes("老字号")||r.details.includes("美食")?p+=l:a.includes(r.icon)||r.name.includes("步行")||r.name.includes("出发")||r.name.includes("返回")?o+=l:m+=l})}),c+=`
        <div class="cost-summary reveal">
          <div class="cost-card"><div class="label">🎫 门票</div><div class="amount">¥${m}</div><div class="note">景点门票合计</div></div>
          <div class="cost-card"><div class="label">🍜 餐饮</div><div class="amount">¥${p}</div><div class="note">餐饮合计</div></div>
          <div class="cost-card"><div class="label">🚌 交通</div><div class="amount">¥${o}</div><div class="note">交通合计</div></div>
          <div class="cost-card"><div class="label">💰 总计</div><div class="amount">¥${i}</div><div class="note">所有费用</div></div>
        </div>`,document.getElementById("routeContent").innerHTML=c}const rt={spring:{title:"🌸 春季 (3-5月)",icon:"🌸",desc:"泉水最旺，百花盛开，是济南最美的季节",tips:["3月底趵突泉水位最高，水涌最壮观","4月五龙潭樱花超美","4-5月大明湖荷花初开","气温15-25°C，薄外套即可"],route:"泉水赏花线：趵突泉→五龙潭(樱花)→大明湖→护城河步道",foods:["奶汤蒲菜(时令)","香椿芽炒蛋","荠菜水饺"]},summer:{title:"☀️ 夏季 (6-8月)",icon:"☀️",desc:"荷花满湖，夜游绝佳，但白天酷热",tips:["6-8月大明湖荷花盛开","建议早出晚归，中午室内避暑","护城河夜游超舒服","7-8月多雨，带伞"],route:"避暑线：省博物馆(空调)→趵突泉(泉水凉爽)→宽厚里(夜游)",foods:["荷叶粥","酸梅汤","冰粉","绿豆糕"]},autumn:{title:"🍂 秋季 (9-11月)",icon:"🍂",desc:"秋高气爽，红叶漫山，最佳登山季",tips:["10月中-11月中红叶谷红叶最盛","10月千佛山秋色最美","11月灵岩寺银杏金黄","气温10-22°C，早晚凉"],route:"红叶登山线：千佛山→红叶谷→灵岩寺(银杏)",foods:["糖炒栗子","烤地瓜","大闸蟹"]},winter:{title:"❄️ 冬季 (12-2月)",icon:"❄️",desc:"泉水雾气如仙境，人少清净，年味浓",tips:["12-1月趵突泉水雾氤氲如仙境","游客少，拍照不用排队","1-2月有庙会和年味活动","气温-5~5°C，注意保暖"],route:"仙境线：趵突泉(雾气)→大明湖(雪景)→宽厚里(年味)",foods:["羊肉汤","把子肉(暖胃)","甜沫","火锅"]}};function _(e){const t=rt[e];document.getElementById("seasonContent").innerHTML=`
        <div class="season-panel active">
          <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px">
            <h3 style="font:700 1.2rem/1.4 var(--serif);margin-bottom:12px">${t.title}</h3>
            <p style="color:var(--text2);margin-bottom:16px">${t.desc}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px">
              <div>
                <h4 style="font-size:.85rem;font-weight:700;color:var(--accent);margin-bottom:8px">📝 出行建议</h4>
                <ul style="list-style:none">${t.tips.map(n=>`<li style="font-size:.85rem;color:var(--text2);padding:3px 0;padding-left:16px;position:relative"><span style="position:absolute;left:0;color:var(--accent)">•</span>${n}</li>`).join("")}</ul>
              </div>
              <div>
                <h4 style="font-size:.85rem;font-weight:700;color:var(--accent);margin-bottom:8px">🗺️ 推荐路线</h4>
                <p style="font-size:.85rem;color:var(--text2);line-height:1.6">${t.route}</p>
              </div>
              <div>
                <h4 style="font-size:.85rem;font-weight:700;color:var(--accent);margin-bottom:8px">🍜 当季美食</h4>
                <div style="display:flex;gap:6px;flex-wrap:wrap">${t.foods.map(n=>`<span style="font-size:.7rem;padding:3px 10px;border-radius:100px;background:var(--accent2);color:var(--accent);font-weight:500">${n}</span>`).join("")}</div>
              </div>
            </div>
          </div>
        </div>`}let h=-1;function K(e){if(!e)return 60;if(e.includes("min")){const c=parseInt(e);return isNaN(c)?60:c}const t=e.match(/([\d.]+)\s*-?\s*[\d.]*\s*h/);if(t)return Math.round(parseFloat(t[1])*60);const n=parseInt(e);return isNaN(n)?60:n*60}function f(){const e=JSON.parse(localStorage.getItem("jinan-itinerary")||"[]"),t=document.getElementById("myTripList"),n=document.getElementById("myTripTimeline");if(!e.length){t.innerHTML='<div class="my-trip-empty">📌 还没有添加景点<br><small>去 <a href="spots.html" style="color:var(--accent)">景点页面</a> 点击「加入行程」</small></div>',n.style.display="none";return}t.innerHTML=e.map((o,i)=>{const d=y.find(a=>a.id===o);return d?`<div class="my-trip-item" draggable="true" data-index="${i}" data-id="${d.id}">
          <span class="drag-handle">⠿</span>
          <div class="trip-info">
            <div class="trip-name">${d.name}</div>
            <div class="trip-meta">⏱ ${d.dur} · 🎫 ${d.price===0?"免费":"¥"+d.price}</div>
          </div>
          <button class="remove-btn" data-id="${d.id}" aria-label="从行程中移除">✕</button>
        </div>`:""}).join(""),ot(e),t.querySelectorAll(".remove-btn").forEach(o=>{o.addEventListener("click",()=>{const i=e.filter(d=>d!==o.dataset.id);localStorage.setItem("jinan-itinerary",JSON.stringify(i)),f()})}),t.querySelectorAll(".my-trip-item").forEach(o=>{o.addEventListener("dragstart",i=>{h=parseInt(o.dataset.index),o.classList.add("dragging"),i.dataTransfer.effectAllowed="move"}),o.addEventListener("dragend",()=>{o.classList.remove("dragging"),t.querySelectorAll(".my-trip-item").forEach(i=>i.classList.remove("drag-over")),h=-1}),o.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move",o.classList.add("drag-over")}),o.addEventListener("dragleave",()=>{o.classList.remove("drag-over")}),o.addEventListener("drop",i=>{i.preventDefault(),o.classList.remove("drag-over");const d=parseInt(o.dataset.index);if(h===d||h<0)return;const a=JSON.parse(localStorage.getItem("jinan-itinerary")||"[]"),[s]=a.splice(h,1);a.splice(d,0,s),localStorage.setItem("jinan-itinerary",JSON.stringify(a)),f()})});let c=0,m=null,p=-1;t.querySelectorAll(".my-trip-item").forEach(o=>{o.addEventListener("touchstart",i=>{c=i.touches[0].clientY,m=o,p=parseInt(o.dataset.index)},{passive:!0}),o.addEventListener("touchend",i=>{const a=i.changedTouches[0].clientY-c;if(Math.abs(a)<30||!m)return;const s=JSON.parse(localStorage.getItem("jinan-itinerary")||"[]"),r=a>0?1:-1,l=p+r;l<0||l>=s.length||([s[p],s[l]]=[s[l],s[p]],localStorage.setItem("jinan-itinerary",JSON.stringify(s)),f())},{passive:!0})})}function ot(e){const t=document.getElementById("myTripTimeline");if(!e.length){t.style.display="none";return}t.style.display="block";let n=480;t.innerHTML=e.map((c,m)=>{const p=y.find(s=>s.id===c);if(!p)return"";const o=Math.floor(n/60),i=n%60,d=`${String(o).padStart(2,"0")}:${String(i).padStart(2,"0")}`,a=K(p.dur);return n+=a+30,`<div class="my-trip-timeline-item">
          <span class="tl-time">${d}</span> · <span class="tl-name">${p.name}</span>
          <span style="color:var(--text3);font-size:.8rem"> (${p.dur})</span>
        </div>`}).join("")}function Q(){const e=JSON.parse(localStorage.getItem("jinan-itinerary")||"[]");if(!e.length)return"行程为空";let t=`🏙️ 济南行程安排
`;t+="═".repeat(30)+`

`;let n=0,c=0,m=480;return e.forEach((p,o)=>{const i=y.find(v=>v.id===p);if(!i)return;const d=Math.floor(m/60),a=m%60,s=`${String(d).padStart(2,"0")}:${String(a).padStart(2,"0")}`,r=i.price||0;n+=r;const l=K(i.dur);c+=l,t+=`${s}  ${o+1}. ${i.name}
`,t+=`   📍 ${i.desc.slice(0,50)}
`,t+=`   ⏱ ${i.dur} · 🎫 ${i.price===0?"免费":"¥"+i.price}
`,t+=`   🚌 ${i.transport||"—"}

`,m+=l+30}),t+="═".repeat(30)+`
`,t+=`💰 预估总费用: ¥${n}
`,t+=`⏱ 预估总时长: ${Math.round(c/60)}h
`,t+=`📅 生成时间: ${new Date().toLocaleString("zh-CN")}
`,t}var D;(D=document.getElementById("copyTrip"))==null||D.addEventListener("click",()=>{var t;const e=Q();(t=navigator.clipboard)==null||t.writeText(e),g("✓ 行程已复制到剪贴板")});var q;(q=document.getElementById("exportTrip"))==null||q.addEventListener("click",()=>{const e=document.getElementById("exportPanel"),t=Q();document.getElementById("exportText").value=t,e.classList.toggle("show")});var A;(A=document.getElementById("copyExport"))==null||A.addEventListener("click",()=>{var t;const e=document.getElementById("exportText").value;(t=navigator.clipboard)==null||t.writeText(e),g("✓ 已复制")});var C;(C=document.getElementById("downloadExport"))==null||C.addEventListener("click",()=>{const e=document.getElementById("exportText").value,t=new Blob([e],{type:"text/plain;charset=utf-8"}),n=URL.createObjectURL(t),c=document.createElement("a");c.href=n,c.download="济南行程.txt",c.click(),URL.revokeObjectURL(n),g("✓ 文件已下载")});var N;(N=document.getElementById("closeExport"))==null||N.addEventListener("click",()=>{document.getElementById("exportPanel").classList.remove("show")});var H;(H=document.getElementById("clearTrip"))==null||H.addEventListener("click",()=>{localStorage.setItem("jinan-itinerary","[]"),f()});document.getElementById("routeTabs").addEventListener("click",e=>{const t=e.target.closest(".route-tab");t&&(document.querySelectorAll(".route-tab").forEach(n=>n.classList.remove("active")),t.classList.add("active"),F(t.dataset.route))});document.getElementById("seasonTabs").addEventListener("click",e=>{const t=e.target.closest(".season-tab");t&&(document.querySelectorAll(".season-tab").forEach(n=>n.classList.remove("active")),t.classList.add("active"),_(t.dataset.season))});document.getElementById("routeContent").addEventListener("click",e=>{var m,p,o;const t=e.target.closest(".copy-route-btn");if(t){const i=t.dataset.route,d=I[i];if(!d)return;let a=`${d.title}
${d.desc}

`;d.days.forEach(s=>{a+=`${s.header}
`,s.items.forEach(r=>{a+=`  ${r.time} ${r.icon} ${r.name} — ${r.details} (${r.cost})
`,r.tips&&(a+=`    💡 ${r.tips}
`)}),a+=`
`}),(m=navigator.clipboard)==null||m.writeText(a),g("✓ 路线已复制到剪贴板")}const n=e.target.closest(".add-route-btn");if(n){const i=n.dataset.route,d=I[i];if(!d)return;let a=0;const s=JSON.parse(localStorage.getItem("jinan-itinerary")||"[]");d.days.forEach(r=>{r.items.forEach(l=>{const v=y.find(u=>u.name===l.name)||y.find(u=>l.name.includes(u.name)&&u.name.length>=2);v&&!s.includes(v.id)&&(s.push(v.id),a++)})}),localStorage.setItem("jinan-itinerary",JSON.stringify(s)),f(),g(a>0?`✓ 已加入 ${a} 个景点到行程`:"该路线景点已在行程中")}const c=e.target.closest(".timeline-item");if(c&&!e.target.closest(".copy-route-btn")&&!e.target.closest(".add-route-btn")){const i=I[J];if(!i)return;const d=((o=(p=c.querySelector(".ti-name"))==null?void 0:p.textContent)==null?void 0:o.trim())||"";let a=null;if(i.days.forEach(r=>{r.items.forEach(l=>{d.includes(l.name)&&(a=l)})}),!a)return;const s=`
          <div style="padding:32px">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
              <span style="font-size:2.5rem">${a.icon}</span>
              <div>
                <h2 style="margin:0;font:700 1.4rem/1.3 var(--serif)">${a.name}</h2>
                <div style="font-size:.9rem;color:var(--text2);margin-top:4px">${a.time}</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px">
              <div style="background:var(--bg2);border-radius:12px;padding:16px;text-align:center">
                <div style="font-size:.75rem;color:var(--text3);margin-bottom:4px">💰 费用</div>
                <div style="font-weight:700;font-size:1.1rem;color:var(--accent)">${a.cost}</div>
              </div>
              <div style="background:var(--bg2);border-radius:12px;padding:16px;text-align:center">
                <div style="font-size:.75rem;color:var(--text3);margin-bottom:4px">🚌 交通</div>
                <div style="font-weight:600;font-size:.9rem">${a.transport}</div>
              </div>
            </div>
            <div style="background:var(--bg2);border-radius:12px;padding:16px;margin-bottom:16px">
              <div style="font-weight:700;margin-bottom:8px;font-size:.95rem">📝 详情</div>
              <p style="color:var(--text2);font-size:.9rem;line-height:1.6;margin:0">${a.details}</p>
            </div>
            ${a.tips?`
            <div style="background:linear-gradient(135deg,rgba(42,157,143,.08),rgba(201,169,110,.08));border-radius:12px;padding:16px;border-left:3px solid var(--accent)">
              <div style="font-weight:700;margin-bottom:8px;font-size:.95rem">💡 小贴士</div>
              <p style="color:var(--text2);font-size:.9rem;line-height:1.6;margin:0">${a.tips}</p>
            </div>`:""}
          </div>
        `;G(s)}});it().then(()=>{const e=new tt,t=document.getElementById("myFavList");t&&(t.innerHTML=e.renderPanel(y,L),t.querySelectorAll(".fav-remove-btn").forEach(n=>{n.addEventListener("click",()=>{e.toggle(n.dataset.id),t.innerHTML=e.renderPanel(y,L)})}))});const j={culture:["culture","history"],food:["food"],nature:["nature","spring"],family:["family"]};function dt(e,t,n){let c=0;const m=[e.cat,...e.audience||[]];t.forEach(o=>{j[o]&&j[o].some(i=>m.includes(i))&&(c+=3)});const p=e.price||0;return n==="economy"&&p<=40||n==="comfort"&&p<=80?c+=2:n==="quality"&&(c+=1),c+=(e.rating||0)*.5,e.badge==="must"&&(c+=2),c}function ct(e){if(!e)return 60;if(e.includes("min"))return parseInt(e)||60;const t=e.match(/([\d.]+)/);return t?Math.round(parseFloat(t[1])*60):60}var O;(O=document.getElementById("generatePlan"))==null||O.addEventListener("click",()=>{const e=Math.min(5,Math.max(1,parseInt(document.getElementById("planDays").value)||2)),t=Math.min(10,Math.max(1,parseInt(document.getElementById("planPeople").value)||2)),n=document.getElementById("planBudget").value,c=Array.from(document.querySelectorAll("#planPrefs input:checked")).map(s=>s.value);if(!c.length){g("请至少选择一个偏好");return}const m=y.map(s=>({...s,_score:dt(s,c,n)})).filter(s=>s._score>0).sort((s,r)=>r._score-s._score),p=Math.min(6,Math.max(3,Math.ceil(m.length/e))),o=m.slice(0,p*e),i=["第一天","第二天","第三天","第四天","第五天"];let d="",a=0;for(let s=0;s<e;s++){const r=o.slice(s*p,(s+1)*p);if(!r.length)break;let l=0,v=480;d+=`<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:16px">
          <h3 style="font:700 1.1rem/1.4 var(--serif);color:var(--accent);margin-bottom:16px">📅 ${i[s]}</h3>
          <div class="timeline" style="padding-left:28px">`,r.forEach((u,k)=>{var M,B;const w=ct(u.dur),T=Math.floor(v/60),b=v%60,$=`${String(T).padStart(2,"0")}:${String(b).padStart(2,"0")}`,x=u.price||0;l+=x,v+=w+30,d+=`<div class="timeline-item" style="margin-left:0">
            <div class="ti-top">
              <span class="ti-time">${$}</span>
              <span class="ti-name">${u.name}</span>
            </div>
            <div class="ti-details">
              <span>${((M=u.desc)==null?void 0:M.slice(0,40))||""}</span>
            </div>
            <div class="ti-details" style="margin-top:6px">
              <span class="ti-cost">💰 ${x===0?"免费":"¥"+x}</span>
              <span>⏱ ${u.dur}</span>
              <span class="ti-transport">🚌 ${((B=u.transport)==null?void 0:B.slice(0,20))||"—"}</span>
            </div>
          </div>`}),d+=`</div>
          <div class="day-total">当日预估 <strong>¥${l}</strong> / ${t}人 ≈ ¥${l*t}</div>
        </div>`,a+=l}d=`<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;margin-bottom:16px;display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px">
        <div style="text-align:center"><div style="font-size:.75rem;color:var(--text2)">🎫 门票总计</div><div style="font:700 1.2rem var(--serif);color:var(--accent)">¥${a}</div></div>
        <div style="text-align:center"><div style="font-size:.75rem;color:var(--text2)">👥 ${t}人总计</div><div style="font:700 1.2rem var(--serif);color:var(--accent)">¥${a*t}</div></div>
        <div style="text-align:center"><div style="font-size:.75rem;color:var(--text2)">📅 共 ${e} 天</div><div style="font:700 1.2rem var(--serif);color:var(--accent)">${o.length} 个景点</div></div>
      </div>`+d,document.getElementById("planResult").innerHTML=d,document.getElementById("planResult").scrollIntoView({behavior:"smooth",block:"start"})});function S(){const e=JSON.parse(localStorage.getItem("jinan-itinerary")||"[]"),t=JSON.parse(localStorage.getItem("jinan-expenses")||"{}"),n=document.getElementById("expenseList"),c=document.getElementById("expenseSummary");if(!e.length){n.innerHTML='<div class="my-trip-empty">💰 添加景点到行程后，这里可以追踪花费<br><small>先去上方添加景点吧</small></div>',c.innerHTML="";return}let m=0,p=0;n.innerHTML='<div style="display:grid;gap:8px">'+e.map(a=>{const s=y.find(v=>v.id===a);if(!s)return"";const r=s.price||0,l=t[a]!==void 0?t[a]:r;return m+=r,p+=l,`<div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius)">
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:.9rem">${s.name}</div>
            <div style="font-size:.75rem;color:var(--text2)">预估: ${r===0?"免费":"¥"+r}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:.8rem;color:var(--text2)">实际 ¥</span>
            <input type="number" min="0" value="${l}" data-spot-id="${a}"
              style="width:80px;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);font-size:.85rem;color:var(--text);text-align:right;outline:none">
          </div>
        </div>`}).join("")+"</div>";const o=p-m,i=o>0?"var(--coral)":o<0?"var(--teal)":"var(--text2)",d=o>0?`超支 ¥${o}`:o<0?`节省 ¥${Math.abs(o)}`:"持平";c.innerHTML=`<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;display:flex;justify-content:space-around;flex-wrap:wrap;gap:16px">
        <div style="text-align:center"><div style="font-size:.75rem;color:var(--text2)">预估花费</div><div style="font:700 1.2rem var(--serif);color:var(--accent)">¥${m}</div></div>
        <div style="text-align:center"><div style="font-size:.75rem;color:var(--text2)">实际花费</div><div style="font:700 1.2rem var(--serif);color:var(--accent)">¥${p}</div></div>
        <div style="text-align:center"><div style="font-size:.75rem;color:var(--text2)">差额</div><div style="font:700 1.2rem var(--serif);color:${i}">${d}</div></div>
      </div>`,n.querySelectorAll("input[data-spot-id]").forEach(a=>{a.addEventListener("change",()=>{const s=JSON.parse(localStorage.getItem("jinan-expenses")||"{}");s[a.dataset.spotId]=parseInt(a.value)||0,localStorage.setItem("jinan-expenses",JSON.stringify(s)),S()})})}const z=document.getElementById("clearTrip");z==null||z.addEventListener("click",()=>{localStorage.removeItem("jinan-expenses"),setTimeout(S,50)});window.addEventListener("storage",e=>{e.key==="jinan-itinerary"&&S()});const lt=setInterval(()=>{y.length>0&&(clearInterval(lt),S())},200);async function pt(){var t;const e=document.getElementById("weatherCards");try{let o=function(i,d){const a=(i+d)/2;return a>=30?"👕 短袖短裤，注意防晒补水":a>=25?"👕 薄T恤/短袖，带件薄外套":a>=20?"👔 长袖/薄外套，早晚凉":a>=15?"🧥 外套/卫衣，温差较大":a>=10?"🧥 厚外套/风衣，注意保暖":a>=5?"🧣 棉衣/羽绒服，围巾手套":"🧤 羽绒服+厚裤，全副武装"};const m=((t=(await(await fetch("https://wttr.in/Jinan?format=j1",{headers:{"User-Agent":"curl/8.0"}})).json()).weather)==null?void 0:t.slice(0,3))||[],p={113:"☀️",116:"⛅",119:"☁️",122:"☁️",143:"🌫️",176:"🌦️",179:"🌨️",182:"🌧️",185:"🌧️",200:"⛈️",227:"🌨️",230:"❄️",248:"🌫️",260:"🌫️",263:"🌦️",266:"🌧️",281:"🌧️",284:"🌧️",293:"🌦️",296:"🌧️",299:"🌧️",302:"🌧️",305:"🌧️",308:"🌧️",311:"🌧️",314:"🌧️",317:"🌧️",320:"🌨️",323:"🌨️",326:"🌨️",329:"❄️",332:"❄️",335:"❄️",338:"❄️",350:"🌧️",353:"🌦️",356:"🌧️",359:"🌧️",362:"🌧️",365:"🌧️",368:"🌨️",371:"❄️",374:"🌧️",377:"🌧️",386:"⛈️",389:"⛈️",392:"⛈️",395:"❄️"};e.innerHTML=m.map(i=>{var b,$;const d=i.date,a=parseInt(i.maxtempC),s=parseInt(i.mintempC),r=i.hourly||[],l=r.find(x=>x.time==="1200")||r[4]||r[0]||{},v=(($=(b=l.weatherDesc)==null?void 0:b[0])==null?void 0:$.value)||"未知",u=l.weatherCode||"116",k=p[u]||"⛅",w=l.humidity||"--",T=o(a,s);return`<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;text-align:center">
            <div style="font-size:.8rem;color:var(--text2);margin-bottom:8px">${d}</div>
            <div style="font-size:3rem;margin-bottom:8px">${k}</div>
            <div style="font-weight:600;font-size:1rem;margin-bottom:4px">${v}</div>
            <div style="font:700 1.4rem/1 var(--serif);color:var(--accent);margin-bottom:4px">${s}° ~ ${a}°</div>
            <div style="font-size:.75rem;color:var(--text3);margin-bottom:12px">💧 湿度 ${w}%</div>
            <div style="font-size:.8rem;color:var(--text2);background:var(--bg2);padding:8px 12px;border-radius:8px">${T}</div>
          </div>`}).join("")}catch{e.innerHTML='<div style="text-align:center;color:var(--text3);padding:20px;grid-column:1/-1">🌤️ 天气数据暂时无法获取，请稍后再试</div>'}}pt();
