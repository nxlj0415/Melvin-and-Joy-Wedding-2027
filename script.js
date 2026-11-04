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


// Paste your deployed Google Apps Script Web App URL here (ending in /exec).
const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz2nBZr4cAsg9dAF7ke_F_qSI9pqtnyNR9ClMtPm7g6ZlaACCv5aeFkpaVTkPvaZCWn/exec';
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
let rsvpPending = false;
let rsvpTimeout;
window.addEventListener('message', (event) => {
  if (!rsvpPending || !event.data || event.data.type !== 'melvin-joy-rsvp') return;
  // The response contains a per-submission nonce to reject unrelated messages.
  if (event.data.nonce !== rsvpForm.querySelector('[name="nonce"]').value) return;
  clearTimeout(rsvpTimeout);
  rsvpPending = false;
  const button = rsvpForm.querySelector('button[type="submit"]');
  button.disabled = false; button.textContent = 'SEND MY RSVP';
  if (event.data.ok) window.location.href = 'thank-you.html';
  else rsvpStatus.textContent = 'Unable to save your RSVP: ' + (event.data.error || 'Please try again.');
});
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (rsvpPending) return;
  if (!RSVP_SCRIPT_URL.startsWith('https://script.google.com/macros/s/') || !RSVP_SCRIPT_URL.endsWith('/exec')) {
    rsvpStatus.textContent = 'RSVP setup is incomplete. The website owner must add the Google Apps Script deployment URL.';
    return;
  }
  let nonce = rsvpForm.querySelector('[name="nonce"]');
  if (!nonce) { nonce = document.createElement('input'); nonce.type = 'hidden'; nonce.name = 'nonce'; rsvpForm.appendChild(nonce); }
  nonce.value = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
  rsvpForm.action = RSVP_SCRIPT_URL;
  rsvpPending = true;
  rsvpStatus.textContent = 'Sending your RSVP. Please wait...';
  const button = rsvpForm.querySelector('button[type="submit"]');
  button.disabled = true; button.textContent = 'SENDING...';
  rsvpForm.submit();
  rsvpTimeout = setTimeout(() => {
    rsvpPending = false; button.disabled = false; button.textContent = 'SEND MY RSVP';
    rsvpStatus.textContent = 'No confirmation received. Check with the couple before trying again to avoid a duplicate RSVP.';
  }, 30000);
});
