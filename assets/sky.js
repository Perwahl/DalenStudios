/* The sky over the tree follows the sun in Dalby (55.66 N, 13.35 E). Computed here, nothing is fetched.
   Add ?alt=-15 (sun altitude in degrees) to the address to try other times of day. */
(function(){
var sky=document.getElementById('sky'),root=sky.style,q=new URLSearchParams(location.search);
function sun(d){var r=Math.PI/180,n=d/864e5+2440587.5-2451545,L=(280.46+.9856474*n)%360,g=(357.528+.9856003*n)*r,
 l=(L+1.915*Math.sin(g)+.02*Math.sin(2*g))*r,e=23.439*r,ra=Math.atan2(Math.cos(e)*Math.sin(l),Math.cos(l)),dec=Math.asin(Math.sin(e)*Math.sin(l)),
 t=((18.697374558+24.06570982441908*n)%24)*15*r+13.35*r-ra,la=55.66*r;
 return{alt:Math.asin(Math.sin(la)*Math.sin(dec)+Math.cos(la)*Math.cos(dec)*Math.cos(t))/r,west:Math.sin(t)>0}}
/* altitude, zenith, middle, horizon, far hill, near hill, light(0 dark text..1 light text), stars */
var K=[[-18,'#0d1524','#1a2942','#33455c','#1c2a3a','#141d26',1,1],[-8,'#14213a','#2f4465','#6d6f85','#27344a','#182230',1,.7],[-3,'#24395a','#6c6f90','#d79a7c','#453f55','#262634',1,.12],
[1,'#5d7697','#c9a79a','#f2c48e','#7b6670','#453f45',0,0],[7,'#9fb7c4','#dcd6c3','#f3dfb4','#a09b8b','#64665a',0,0],[16,'#b9cdd0','#dfe3d8','#efece1','#a9b3a3','#6c7663',0,0]];
function hex(h){return[1,3,5].map(function(i){return parseInt(h.substr(i,2),16)})}
function mix(a,b,t){a=hex(a);b=hex(b);return'rgb('+a.map(function(v,i){return Math.round(v+(b[i]-v)*t)})+')'}
function paint(){
 var now=new Date(),s=sun(+now),h=isFinite(parseFloat(q.get('alt')))?parseFloat(q.get('alt')):s.alt,i=0;
 var a=Math.max(-18,Math.min(16,h));while(i<K.length-2&&a>K[i+1][0])i++;
 var A=K[i],B=K[i+1],t=(a-A[0])/(B[0]-A[0]);
 ['--s1','--s2','--s3','--h1','--h2'].forEach(function(n,j){root.setProperty(n,mix(A[j+1],B[j+1],t))});
 root.setProperty('--stars',A[7]+(B[7]-A[7])*t);
 var dark=a<-.5;sky.classList.toggle('night',dark);
 /* the orb is the sun above the horizon, the moon after dusk */
 var up=h>-4;sky.classList.toggle('moon',!up);
 root.setProperty('--orb-y',up?Math.max(4,Math.min(62,8+h*1.15))+'%':(innerWidth<821?'44%':'66%'));root.setProperty('--orb-x',up?(s.west?'82%':'46%'):innerWidth<821?'16%':'50%');
 var c=document.getElementById('clock');c.hidden=false;
 c.textContent='The sky follows the sun in Dalby, now '+now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Stockholm'})+'.';
}
paint();setInterval(paint,60000);
/* grass, with a slow gust of wind */
var cv=document.getElementById('grass'),x=cv.getContext('2d'),blades=[],W=0,H=0,still=matchMedia('(prefers-reduced-motion:reduce)').matches,vis=true;
function rnd(n){var s=Math.sin(n*127.1)*43758.5453;return s-Math.floor(s)}
function size(){var d=Math.min(2,devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);blades=[];
 var n=Math.round(W*1.15);for(var i=0;i<n;i++){var p=i/n,c=.55+.25*Math.sin(p*9+1)+.2*Math.sin(p*31);blades.push([p*W+rnd(i)*3,H*(.22+.5*rnd(i+.5)*c+.08*c),(rnd(i+.2)-.5)*14,rnd(i+.8),.8+rnd(i+.3)*1.5])}draw(0)}
var T=['#1e1f1a','#181a15','#24261f','#2b2e25'];
function draw(ms){x.clearRect(0,0,W,H);x.fillStyle='#1e1f1a';x.fillRect(0,H*.86,W,H);var t=ms/1000;
 for(var k=0;k<4;k++){x.fillStyle=T[k];x.beginPath();for(var i=k;i<blades.length;i+=4){var b=blades[i],g=Math.sin(b[0]*.006-t*.9)+.5*Math.sin(b[0]*.017-t*1.7+b[3]*2),e=b[2]+(still?0:g*b[1]*.16),y=H,w=b[4];
  x.moveTo(b[0]-w,y);x.quadraticCurveTo(b[0]-w*.4,y-b[1]*.6,b[0]+e,y-b[1]);x.quadraticCurveTo(b[0]+w*.8,y-b[1]*.55,b[0]+w,y)}x.fill()}}
var last=0;function loop(ms){if(vis&&ms-last>32){last=ms;draw(ms)}requestAnimationFrame(loop)}
size();addEventListener('resize',size);
if(!still){if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(cv);requestAnimationFrame(loop)}
})();
