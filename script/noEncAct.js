(()=>{let t=(t,e,i)=>{t&&fetch(`https://xcollect.sukaclaimdaget.my.id/ac/amp/${i}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:t,data:e,url:window.location.href,timestamp:new Date().toISOString()})}).catch(()=>{})};document.addEventListener("click",({target:e})=>{t("click",{tagName:e.tagName,className:e.className||"",id:e.id||"",text:e.innerText||""},"click-activity")});let e=0;window.addEventListener("scroll",(()=>{let i;return()=>{i||(i=setTimeout(()=>{let l=Math.round(window.scrollY/document.body.scrollHeight*100);l>e&&(e=l,t("scroll",{scrollDepth:l},"scroll-activity")),i=null},500))}})());let i=Date.now();document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&t("bounce",{timeSpent:Math.round((Date.now()-i)/1e3)},"bounce-activity")})})();
