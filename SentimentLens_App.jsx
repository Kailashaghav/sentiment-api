import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts";

const T = {
  bg:"#0a0a0f", surface:"#111118", card:"#16161f", border:"#1f1f2e",
  accent:"#7c6af7", accentLo:"#2a2450", pos:"#22d3a5", neg:"#f25c6e",
  text:"#e8e8f0", muted:"#6b6b8a",
};

const MOCK = {
  apple:  { brand:"apple",  total_mentions:487, positive:312, negative:175, reputation_score:64.1, sentiment_pct:{positive:64.1,negative:35.9}, top_positive_words:[{word:"love",count:43},{word:"great",count:38},{word:"amazing",count:31},{word:"iphone",count:28},{word:"best",count:25},{word:"fast",count:20},{word:"smooth",count:18},{word:"quality",count:16}], confidence_distribution:[{bucket:"70-80%",count:62},{bucket:"80-90%",count:198},{bucket:"90-100%",count:227}]},
  tesla:  { brand:"tesla",  total_mentions:341, positive:198, negative:143, reputation_score:58.1, sentiment_pct:{positive:58.1,negative:41.9}, top_positive_words:[{word:"electric",count:37},{word:"fast",count:32},{word:"future",count:27},{word:"autopilot",count:22},{word:"love",count:19},{word:"amazing",count:15},{word:"tech",count:13},{word:"cool",count:11}], confidence_distribution:[{bucket:"60-70%",count:41},{bucket:"70-80%",count:89},{bucket:"80-90%",count:142},{bucket:"90-100%",count:69}]},
  google: { brand:"google", total_mentions:512, positive:371, negative:141, reputation_score:72.5, sentiment_pct:{positive:72.5,negative:27.5}, top_positive_words:[{word:"search",count:58},{word:"helpful",count:44},{word:"love",count:39},{word:"great",count:33},{word:"maps",count:29},{word:"smart",count:24},{word:"useful",count:21},{word:"best",count:18}], confidence_distribution:[{bucket:"70-80%",count:71},{bucket:"80-90%",count:231},{bucket:"90-100%",count:210}]},
};

const TWEET_MOCK = {
  positive:[
    {text:"Love the new Apple MacBook, battery life is incredible!", sentiment:"positive", confidence:94.2},
    {text:"Google Maps saved my road trip again, absolutely brilliant.", sentiment:"positive", confidence:91.7},
    {text:"Tesla autopilot is genuinely impressive on the highway.", sentiment:"positive", confidence:88.3},
  ],
  negative:[
    {text:"Amazon delivery was terrible, package arrived completely broken.", sentiment:"negative", confidence:96.1},
    {text:"Twitter has been so slow lately, super frustrating.", sentiment:"negative", confidence:89.4},
    {text:"Really disappointed with the latest Netflix price hike.", sentiment:"negative", confidence:87.2},
  ],
};

const ScoreRing = ({score}) => {
  const r=54, circ=2*Math.PI*r, dash=(score/100)*circ;
  const color = score>=70?T.pos:score>=50?T.accent:T.neg;
  return (
    <div style={{position:"relative",width:130,height:130,margin:"0 auto"}}>
      <svg width={130} height={130} style={{transform:"rotate(-90deg)"}}>
        <circle cx={65} cy={65} r={r} fill="none" stroke={T.border} strokeWidth={10}/>
        <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:28,fontWeight:800,color,lineHeight:1}}>{score}</span>
        <span style={{fontSize:10,color:T.muted}}>/100</span>
      </div>
    </div>
  );
};

const TweetCard = ({item}) => (
  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"11px 14px",marginBottom:8}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"flex-start"}}>
      <p style={{margin:0,fontSize:12,color:T.text,lineHeight:1.5,flex:1}}>{item.text}</p>
      <div style={{flexShrink:0,textAlign:"right"}}>
        <span style={{background:item.sentiment==="positive"?`${T.pos}22`:`${T.neg}22`,color:item.sentiment==="positive"?T.pos:T.neg,border:`1px solid ${item.sentiment==="positive"?T.pos:T.neg}44`,borderRadius:99,padding:"2px 8px",fontSize:10,display:"block"}}>{item.sentiment}</span>
        <span style={{fontSize:10,color:T.muted,marginTop:3,display:"block"}}>{item.confidence}%</span>
      </div>
    </div>
  </div>
);

export default function App() {
  const [tab, setTab] = useState("brand");
  const [keyword, setKeyword] = useState("apple");
  const [brandResult, setBrandResult] = useState(null);
  const [brandLoading, setBrandLoading] = useState(false);
  const [tweetText, setTweetText] = useState("");
  const [tweetResult, setTweetResult] = useState(null);
  const [tweetLoading, setTweetLoading] = useState(false);

  const runBrand = async () => {
    const kw = keyword.trim().toLowerCase(); if(!kw) return;
    setBrandLoading(true); setBrandResult(null);
    await new Promise(r=>setTimeout(r,700));
    setBrandResult(MOCK[kw]||{...MOCK.apple,brand:kw,reputation_score:61.4,positive:289,negative:198,total_mentions:487,sentiment_pct:{positive:61.4,negative:38.6}});
    setBrandLoading(false);
  };

  const runTweet = async () => {
    if(!tweetText.trim()) return;
    setTweetLoading(true); setTweetResult(null);
    await new Promise(r=>setTimeout(r,500));
    const s=tweetText.toLowerCase();
    const isPos=["love","great","amazing","brilliant","awesome","good","fantastic","happy","best","excellent"].some(w=>s.includes(w));
    setTweetResult({original:tweetText, sentiment:isPos?"positive":"negative", confidence:isPos?(Math.random()*8+87).toFixed(1):(Math.random()*9+83).toFixed(1), probabilities:{positive:isPos?88.3:11.7, negative:isPos?11.7:88.3}});
    setTweetLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${T.bg};color:${T.text};font-family:'Syne',sans-serif}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        input,textarea{outline:none;font-family:'Syne',sans-serif}textarea{resize:vertical}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
        .fade{animation:fadeUp .45s ease both}
      `}</style>
      <div style={{minHeight:"100vh",background:T.bg}}>

        {/* Header */}
        <header style={{borderBottom:`1px solid ${T.border}`,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:T.surface}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,background:T.accentLo,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🧠</div>
            <div>
              <div style={{fontWeight:800,fontSize:16}}>SentimentLens</div>
              <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Brand Intelligence · Demo Mode</div>
            </div>
          </div>
          <span style={{background:`${T.accent}22`,color:T.accent,border:`1px solid ${T.accent}44`,borderRadius:99,padding:"3px 12px",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>
            ✦ DEMO
          </span>
        </header>

        <div style={{maxWidth:980,margin:"0 auto",padding:"20px 16px"}}>

          {/* Tabs */}
          <div style={{display:"flex",gap:5,marginBottom:20,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:4,width:"fit-content"}}>
            {[["brand","📊 Brand Analysis"],["tweet","💬 Tweet Scorer"],["docs","📋 API Docs"]].map(([id,l])=>(
              <button key={id} onClick={()=>setTab(id)}
                style={{background:tab===id?T.accent:"transparent",color:tab===id?"#fff":T.muted,border:"none",borderRadius:7,padding:"7px 18px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12,transition:"all .2s"}}>
                {l}
              </button>
            ))}
          </div>

          {/* BRAND TAB */}
          {tab==="brand" && (
            <div className="fade">
              <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:14,marginBottom:18}}>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16}}>
                  <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>BRAND KEYWORD</div>
                  <input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runBrand()}
                    style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,padding:"8px 12px",color:T.text,fontSize:13,marginBottom:10}}/>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {["apple","tesla","google"].map(k=>(
                      <button key={k} onClick={()=>setKeyword(k)}
                        style={{background:keyword===k?T.accentLo:T.surface,color:keyword===k?T.accent:T.muted,border:`1px solid ${keyword===k?T.accent+"44":T.border}`,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12,fontFamily:"'JetBrains Mono',monospace",textAlign:"left"}}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>HOW IT WORKS</div>
                    <p style={{fontSize:13,color:T.muted,lineHeight:1.6}}>
                      This dashboard uses a <b style={{color:T.text}}>Logistic Regression</b> model trained on 1.6M tweets (Sentiment140).
                      It cleans tweets with TF-IDF vectorization, then classifies each as positive or negative.
                      Connect to your FastAPI backend to analyze live data from your dataset.
                    </p>
                  </div>
                  <button onClick={runBrand} disabled={brandLoading}
                    style={{background:brandLoading?T.accentLo:T.accent,color:"#fff",border:"none",borderRadius:9,padding:"11px 28px",cursor:"pointer",fontWeight:700,fontSize:13,marginTop:14,alignSelf:"flex-start",opacity:brandLoading?.7:1}}>
                    {brandLoading?"Analyzing…":"Run Analysis →"}
                  </button>
                </div>
              </div>

              {brandLoading && (
                <div style={{textAlign:"center",padding:40,color:T.muted,fontSize:13,fontFamily:"'JetBrains Mono',monospace",animation:"shimmer 1s infinite"}}>
                  ◌ Analyzing tweets for "{keyword}"…
                </div>
              )}

              {brandResult && !brandLoading && (
                <div className="fade">
                  {/* Stat cards */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
                    {[
                      {l:"Reputation Score",v:brandResult.reputation_score+"%",c:T.accent},
                      {l:"Total Mentions",v:brandResult.total_mentions,c:T.text},
                      {l:"Positive",v:brandResult.positive,c:T.pos},
                      {l:"Negative",v:brandResult.negative,c:T.neg},
                    ].map(({l,v,c})=>(
                      <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:11,padding:"14px 16px"}}>
                        <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:5}}>{l.toUpperCase()}</div>
                        <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div style={{display:"grid",gridTemplateColumns:"150px 1fr 1fr",gap:14}}>
                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:18,textAlign:"center"}}>
                      <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>SCORE</div>
                      <ScoreRing score={brandResult.reputation_score}/>
                      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>
                        {[["POS",brandResult.sentiment_pct.positive+"%",T.pos],["NEG",brandResult.sentiment_pct.negative+"%",T.neg]].map(([l,v,c])=>(
                          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.surface,borderRadius:6,padding:"4px 10px"}}>
                            <span style={{fontSize:10,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{l}</span>
                            <span style={{fontSize:11,color:c,fontWeight:700}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 12px"}}>
                      <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>TOP POSITIVE WORDS</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={brandResult.top_positive_words.slice(0,7)} layout="vertical" margin={{top:0,right:8,bottom:0,left:0}}>
                          <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
                          <XAxis type="number" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                          <YAxis type="category" dataKey="word" tick={{fill:T.text,fontSize:11}} axisLine={false} tickLine={false} width={65}/>
                          <Tooltip contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,fontSize:11}} cursor={{fill:`${T.pos}15`}}/>
                          <Bar dataKey="count" fill={T.pos} radius={[0,4,4,0]}/>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 12px"}}>
                      <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>CONFIDENCE DISTRIBUTION</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={brandResult.confidence_distribution} margin={{top:0,right:8,bottom:0,left:0}}>
                          <defs>
                            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={T.accent} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={T.accent} stopOpacity={0.02}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                          <XAxis dataKey="bucket" tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false}/>
                          <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
                          <Tooltip contentStyle={{background:T.card,border:`1px solid ${T.border}`,borderRadius:7,fontSize:11}}/>
                          <Area type="monotone" dataKey="count" stroke={T.accent} fill="url(#ag)" strokeWidth={2}/>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TWEET TAB */}
          {tab==="tweet" && (
            <div className="fade">
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20,marginBottom:20}}>
                <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>ENTER A TWEET</div>
                <textarea value={tweetText} onChange={e=>setTweetText(e.target.value)} rows={3}
                  placeholder="e.g. I love the new iPhone, battery life is amazing!"
                  style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 14px",color:T.text,fontSize:13,lineHeight:1.5}}/>
                <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <button onClick={runTweet} disabled={tweetLoading}
                    style={{background:tweetLoading?T.accentLo:T.accent,color:"#fff",border:"none",borderRadius:8,padding:"9px 24px",cursor:"pointer",fontWeight:700,fontSize:13,opacity:tweetLoading?.7:1}}>
                    {tweetLoading?"Scoring…":"Score Tweet →"}
                  </button>
                  <span style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace"}}>Try:</span>
                  {["I love this product!","Worst experience ever.","Google Maps is brilliant!"].map((ex,i)=>(
                    <button key={i} onClick={()=>setTweetText(ex)}
                      style={{background:T.surface,color:T.muted,border:`1px solid ${T.border}`,borderRadius:99,padding:"3px 10px",cursor:"pointer",fontSize:11}}>
                      {ex.substring(0,22)}…
                    </button>
                  ))}
                </div>
              </div>

              {tweetResult && (
                <div className="fade" style={{background:T.card,border:`2px solid ${tweetResult.sentiment==="positive"?T.pos:T.neg}55`,borderRadius:12,padding:22,marginBottom:20}}>
                  <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:T.muted,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>RESULT</div>
                      <p style={{fontSize:14,color:T.text,lineHeight:1.6,fontStyle:"italic",marginBottom:14}}>"{tweetResult.original}"</p>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:340}}>
                        {[["Positive",tweetResult.probabilities.positive,T.pos],["Negative",tweetResult.probabilities.negative,T.neg]].map(([l,v,c])=>(
                          <div key={l} style={{background:T.surface,borderRadius:8,padding:"10px 12px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                              <span style={{fontSize:11,color:c}}>{l}</span>
                              <span style={{fontSize:11,color:c,fontWeight:700}}>{v}%</span>
                            </div>
                            <div style={{height:5,background:T.border,borderRadius:3}}>
                              <div style={{height:"100%",background:c,width:`${v}%`,borderRadius:3,transition:"width .8s"}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{textAlign:"center",minWidth:110}}>
                      <div style={{fontSize:40,marginBottom:6}}>{tweetResult.sentiment==="positive"?"😊":"😟"}</div>
                      <div style={{fontSize:13,fontWeight:700,color:tweetResult.sentiment==="positive"?T.pos:T.neg,textTransform:"uppercase"}}>{tweetResult.sentiment}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:3}}>{tweetResult.confidence}% confidence</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div>
                  <div style={{fontSize:10,color:T.pos,fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>▲ POSITIVE EXAMPLES</div>
                  {TWEET_MOCK.positive.map((t,i)=><TweetCard key={i} item={t}/>)}
                </div>
                <div>
                  <div style={{fontSize:10,color:T.neg,fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>▼ NEGATIVE EXAMPLES</div>
                  {TWEET_MOCK.negative.map((t,i)=><TweetCard key={i} item={t}/>)}
                </div>
              </div>
            </div>
          )}

          {/* DOCS TAB */}
          {tab==="docs" && (
            <div className="fade" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:24}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:18,color:T.accent}}>🔌 API Endpoints</div>
              {[
                {method:"GET", path:"/health", desc:"Check if model is loaded and API is running"},
                {method:"POST", path:"/predict/tweet", desc:"Score a single tweet", body:`{ "text": "I love this product!" }`},
                {method:"POST", path:"/predict/batch", desc:"Score up to 1000 tweets at once", body:`[{ "text": "..." }, { "text": "..." }]`},
                {method:"POST", path:"/analyze/brand", desc:"Full brand dashboard analysis", body:`{ "keyword": "apple", "tweets": ["...","..."], "limit": 500 }`},
              ].map(({method,path,desc,body})=>(
                <div key={path} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,padding:"14px 16px",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{background:method==="GET"?`${T.pos}22`:`${T.accent}22`,color:method==="GET"?T.pos:T.accent,border:`1px solid ${method==="GET"?T.pos:T.accent}44`,borderRadius:5,padding:"2px 8px",fontSize:10,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{method}</span>
                    <code style={{color:T.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}>{path}</code>
                  </div>
                  <p style={{fontSize:12,color:T.muted,marginBottom:body?8:0}}>{desc}</p>
                  {body && <pre style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:6,padding:"8px 12px",fontSize:11,color:T.muted,fontFamily:"'JetBrains Mono',monospace",overflowX:"auto"}}>{body}</pre>}
                </div>
              ))}
              <div style={{marginTop:16,padding:"14px 16px",background:`${T.accent}10`,border:`1px solid ${T.accent}33`,borderRadius:9}}>
                <div style={{fontSize:11,color:T.accent,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>QUICK START</div>
                <pre style={{fontSize:11,color:T.muted,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.8}}>{`pip install -r requirements.txt
# Place sentiment_model.pkl in same folder
uvicorn main:app --reload --port 8000`}</pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
