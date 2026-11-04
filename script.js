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


// Deployed RSVP endpoint. Confirm saved submissions by querying their unique ID.
const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz2nBZr4cAsg9dAF7ke_F_qSI9pqtnyNR9ClMtPm7g6ZlaACCv5aeFkpaVTkPvaZCWn/exec';
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
let rsvpPending = false;
let rsvpNonce = '';
let rsvpTimer = null;
let rsvpPoll = null;
let rsvpCheckNumber = 0;
let rsvpStatusFrame = null;
let rsvpVerifyInProgress = false;

function checkRsvpSaved(nonce) {
  // JSONP status endpoint: unlike an Apps Script iframe, this callback runs
  // in the wedding website's own page and works across Google's redirects.
  return new Promise((resolve) => {
    const callbackName = 'melvinJoyCheck_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.remove();
      delete window[callbackName];
      resolve(value);
    };
    window[callbackName] = (result) => {
      if (result && result.nonce === nonce) finish(result);
    };
    script.onerror = () => finish(null);
    const timer = setTimeout(() => finish(null), 9000);
    script.src = RSVP_SCRIPT_URL + '?action=status&nonce=' + encodeURIComponent(nonce)
      + '&callback=' + encodeURIComponent(callbackName) + '&_=' + Date.now();
    document.head.appendChild(script);
  });
}

function completeRsvp() {
  if (!rsvpPending) return;
  rsvpPending = false;
  clearInterval(rsvpPoll);
  clearTimeout(rsvpTimer);
  if (rsvpStatusFrame) { rsvpStatusFrame.remove(); rsvpStatusFrame = null; }
  sessionStorage.setItem('melvinJoyRsvpConfirmed', rsvpNonce);
  window.location.assign('thank-you.html');
}

window.addEventListener('message', (event) => {
  // Accept only messages associated with the current form submission.
  if (!rsvpPending || !event.data || event.data.type !== 'melvin-joy-rsvp' || event.data.nonce !== rsvpNonce) return;
  if (event.data.ok) completeRsvp();
  // Errors are checked against the saved record before showing failure.
});

// Fallback verification via a hidden status iframe. Apps Script's HTML
// response can postMessage even when its ContentService JSONP is blocked.
function checkRsvpSavedInFrame(nonce) {
  if (!rsvpPending) return;
  if (rsvpStatusFrame) rsvpStatusFrame.remove();
  const frame = document.createElement('iframe');
  frame.title = 'RSVP confirmation status';
  frame.style.display = 'none';
  frame.src = RSVP_SCRIPT_URL + '?action=status&nonce=' +
    encodeURIComponent(nonce) + '&_=' + Date.now();
  rsvpStatusFrame = frame;
  document.body.appendChild(frame);
}

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!rsvpPending || !data || data.type !== 'melvin-joy-rsvp-status' ||
      data.nonce !== rsvpNonce) return;
  if (data.saved === true) completeRsvp();
});

rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (rsvpPending) return;
  if (!RSVP_SCRIPT_URL.startsWith('https://script.google.com/macros/s/') || !RSVP_SCRIPT_URL.endsWith('/exec')) {
    rsvpStatus.textContent = 'RSVP configuration is incomplete. Please contact the couple.';
    return;
  }
  let nonce = rsvpForm.querySelector('[name="nonce"]');
  if (!nonce) {
    nonce = document.createElement('input');
    nonce.type = 'hidden'; nonce.name = 'nonce';
    rsvpForm.appendChild(nonce);
  }
  nonce.value = rsvpForm.dataset.retryNonce || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
  rsvpNonce = nonce.value;
  rsvpForm.action = RSVP_SCRIPT_URL;
  rsvpPending = true;
  rsvpStatus.textContent = 'Sending your RSVP and checking confirmation...';
  const button = rsvpForm.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'SENDING...';
  rsvpForm.submit();
  let checking = false;
  const verify = async () => {
    if (!rsvpPending || checking) return;
    checking = true;
    try {
      const result = await checkRsvpSaved(rsvpNonce);
      if (result && result.saved) completeRsvp();
      else if (rsvpPending) checkRsvpSavedInFrame(rsvpNonce);
    } finally { checking = false; }
  };
  rsvpPoll = setInterval(verify, 3500);
  rsvpTimer = setTimeout(() => {
    if (!rsvpPending) return;
    clearInterval(rsvpPoll);
    if (rsvpStatusFrame) { rsvpStatusFrame.remove(); rsvpStatusFrame = null; }
    rsvpPending = false;
    button.disabled = false;
    button.textContent = 'CHECK / RESEND RSVP';
    rsvpStatus.textContent = 'Confirmation could not be verified. Check the RSVP Responses sheet before resubmitting to avoid duplicates.';
    // Keep the same nonce if resubmitted: the server uses it to deduplicate.
    rsvpForm.dataset.retryNonce = rsvpNonce;
  }, 45000);
  setTimeout(verify, 1500);
});
