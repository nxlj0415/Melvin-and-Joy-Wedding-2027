// January 23, 2027, 2:00 PM in Philippine Standard Time.
// Ceremony time supplied in the event-rules image.
const weddingDate = new Date('2027-01-23T14:00:00+08:00').getTime();
const ids = ['days','hours','minutes','seconds'];
function updateCountdown(){
 const distance = weddingDate-Date.now();
 if(distance<=0){ids.forEach(id=>document.getElementById(id).textContent='00');document.getElementById('countdown-note').textContent='Our special day is here!';return;}
 const values=[Math.floor(distance/86400000),Math.floor(distance/3600000)%24,Math.floor(distance/60000)%60,Math.floor(distance/1000)%60];
 ids.forEach((id,i)=>document.getElementById(id).textContent=String(values[i]).padStart(2,'0'));
}
updateCountdown();setInterval(updateCountdown,1000);
