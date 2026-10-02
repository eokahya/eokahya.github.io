const canvas = document.querySelector<HTMLCanvasElement>('#science-canvas');
const figure = document.querySelector<HTMLElement>('.scientific-scene');
if(canvas && figure){
  const context=canvas.getContext('2d');
  const pauseButton=document.querySelector<HTMLButtonElement>('#motion-toggle');
  const pathButton=document.querySelector<HTMLButtonElement>('#path-toggle');
  const stages=Array.from(document.querySelectorAll<HTMLElement>('[data-scene-stage]'));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches, highlighted=false, frame=0, phase=0, last=0, width=600,height=600, dirty=true;
  const clamp=(n:number)=>Math.max(0,Math.min(1,n));
  const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
  const smooth=(v:number)=>v*v*(3-2*v);
  if(context){
    figure.dataset.ready='true';
    if(pauseButton){pauseButton.hidden=false;pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.textContent=paused?'Resume animations':'Pause animations';}
    if(pathButton)pathButton.hidden=false;
    function size(){const rect=canvas!.getBoundingClientRect();width=rect.width;height=rect.height;const ratio=Math.min(devicePixelRatio,2);canvas!.width=Math.round(width*ratio);canvas!.height=Math.round(height*ratio);context!.setTransform(ratio,0,0,ratio,0,0);dirty=true;}
    function progress(){if(stages.length<3)return 0;const center=innerHeight*.5;const a=stages[0]!.getBoundingClientRect(),b=stages[1]!.getBoundingClientRect(),c=stages[2]!.getBoundingClientRect();const ac=a.top+a.height/2,bc=b.top+b.height/2,cc=c.top+c.height/2;return center<bc?clamp((center-ac)/(bc-ac)):1+clamp((center-bc)/(cc-bc));}
    function point(index:number, stage:number){const mobile=width<450;const cols=mobile?17:25,rows=mobile?13:19;const row=Math.floor(index/cols),col=index%cols,u=col/(cols-1),v=row/(rows-1);const x=(u-.5)*1.78,y=(v-.5)*1.8;
      if(stage===0){const well=Math.exp(-(x*x+y*y)*4);return [width*(.5+x*.43),height*(.53+y*.25-well*.21+Math.sin(x*6+phase)*.009*(1-well))];}
      if(stage===1){const cluster=col%3;const angle=u*5.2+v*2.5,rad=.08+v*.15;return [width*(.25+cluster*.25+Math.cos(angle)*rad),height*(.49+Math.sin(angle)*rad*1.4+(cluster-1)*.06)];}
      const layer=col%5,node=row%7;return [width*(.13+layer*.185),height*(.21+node*.095)];
    }
    function draw(){const ctx=context!;ctx.clearRect(0,0,width,height);const p=progress();figure!.dataset.stage=String(Math.round(p));const motion=paused||reduced.matches?Math.round(p):p;const stage=Math.floor(Math.min(motion,1.999)),t=smooth(motion-stage);const light=document.documentElement.dataset.theme==='light';const color=light?'32,107,99':'111,195,179',copper=light?'144,77,41':'225,172,123';const cols=width<450?17:25,rows=width<450?13:19;const points=Array.from({length:cols*rows},(_,i)=>{const a=point(i,stage),b=point(i,stage+1);return [mix(a[0]!,b[0]!,t),mix(a[1]!,b[1]!,t)];});
      const line=(i:number,j:number,alpha:number,active=false)=>{const a=points[i]!,b=points[j]!;ctx.strokeStyle=`rgba(${active?copper:color},${alpha})`;ctx.lineWidth=active?2:0.65;ctx.beginPath();ctx.moveTo(a[0]!,a[1]!);ctx.lineTo(b[0]!,b[1]!);ctx.stroke();};
      const meshAlpha=clamp(1-motion),learningAlpha=clamp(1-Math.abs(motion-1));for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c;if(c<cols-1&&meshAlpha>0)line(i,i+1,.67*meshAlpha);if(r<rows-1&&meshAlpha>0)line(i,i+cols,.46*meshAlpha);if(c<cols-3&&learningAlpha>0)line(i,i+3,.32*learningAlpha);if(r<rows-1&&c%4===0&&learningAlpha>0)line(i,i+cols,.18*learningAlpha);}
      if(motion>1){const alpha=clamp(motion-1);for(let layer=0;layer<4;layer++)for(let n=0;n<7;n++){const i=n*cols+layer;for(let k=0;k<7;k++){if((n+k+layer)%3===0)line(i,k*cols+layer+1,.14*alpha);}}if(highlighted){[2,3,3,4].forEach((n,layer)=>line(n*cols+layer,(layer<2?3:4)*cols+layer+1,.95*alpha,true));}}
      const unique=new Set<string>();points.forEach((pt,i)=>{if(motion>1.98){const key=pt.map(n=>Math.round(n)).join(',');if(unique.has(key))return;unique.add(key);}ctx.fillStyle=`rgba(${i%11===0?copper:color},${motion>1.8?.85:.45})`;ctx.beginPath();ctx.arc(pt[0]!,pt[1]!,motion>1.8?3.5:1.4,0,Math.PI*2);ctx.fill();});
      const labels=['SPACETIME / FIELDS','LEARNING / REPRESENTATIONS','MECHANISMS / INTERPRETATION'];const labelIndex=Math.round(p);const num=document.querySelector('#scene-number'),name=document.querySelector('#scene-name');if(num)num.textContent=`0${labelIndex+1}`;if(name)name.textContent=labels[labelIndex]!;
    }
    function tick(now:number){frame=0;if(document.hidden)return;const rect=figure!.getBoundingClientRect();const visible=rect.bottom>0&&rect.top<innerHeight;if(visible&&(dirty||(!paused&&!reduced.matches))){if(last&&now-last<32&&!dirty){frame=requestAnimationFrame(tick);return;}phase+=.012;draw();dirty=false;last=now;}if(visible&&!paused&&!reduced.matches)frame=requestAnimationFrame(tick);}
    function request(){dirty=true;if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);}
    pauseButton?.addEventListener('click',()=>{paused=!paused;pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.textContent=paused?'Resume animations':'Pause animations';request();});
    pathButton?.addEventListener('click',()=>{highlighted=!highlighted;pathButton.setAttribute('aria-pressed',String(highlighted));pathButton.textContent=highlighted?'Clear pathway':'Highlight a pathway';stages[2]?.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});request();});
    reduced.addEventListener('change',()=>{paused=reduced.matches;if(pauseButton){pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.textContent=paused?'Resume animations':'Pause animations';}request();});
    addEventListener('scroll',request,{passive:true});addEventListener('resize',()=>{size();request();});addEventListener('themechange',request);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();});new ResizeObserver(()=>{size();request();}).observe(canvas);size();request();
  }
}
