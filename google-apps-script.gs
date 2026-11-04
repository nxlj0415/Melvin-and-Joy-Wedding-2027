/** Melvin & Joy RSVP — paste into a Google Sheet > Extensions > Apps Script.
 * Deploy as Web app: Execute as Me; Who has access: Anyone.
 * Uses the active spreadsheet and emails the three recipients.
 */
const RECIPIENTS = 'alm.lucio04@gmail.com,vhinjoy13@gmail.com,christinejoydecastro31@gmail.com';
function doPost(e) {
  const p = (e && e.parameter) || {};
  const nonce = String(p.nonce || '').slice(0, 120);
  try {
    const name = String(p.guestName || '').trim().slice(0,100);
    const attendance = String(p.attendance || '');
    const message = String(p.message || '').trim().slice(0,1000);
    if (!name || !['Yes, I will attend!', 'Sorry, I cannot attend.'].includes(attendance)) throw new Error('Please enter your name and attendance.');
    if (p['bot-field'] || p._honey) throw new Error('Submission rejected.');
    let newlySaved = false;
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const ss = SpreadsheetApp.openById('1E00yfmksAzRZF7nlrc4ygiCWcqWxOTi5_1FfrHoTYwY');
      if (!ss) throw new Error('Cannot access the RSVP spreadsheet. Check the spreadsheet ID and permissions.');
      const sheet = ss.getSheetByName('RSVP Responses') || ss.insertSheet('RSVP Responses');
      if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp','Guest Name','Attendance','Message','Submission ID']);
      // Prevent double submissions if a browser retries the same request.
      const ids = sheet.getLastRow() > 1 ? sheet.getRange(2,5,sheet.getLastRow()-1,1).getValues().flat() : [];
      if (!nonce || !ids.includes(nonce)) {
        sheet.appendRow([new Date(), safeCell(name), safeCell(attendance), safeCell(message), nonce]);
        newlySaved = true;
      }
    } finally { lock.releaseLock(); }
    if (newlySaved) try {
      MailApp.sendEmail({to: RECIPIENTS, subject: 'New RSVP for Melvin & Joy Wedding',
        body: 'Guest: ' + name + '\nAttendance: ' + attendance + '\nMessage: ' + (message || '(none)')});
    } catch (mailError) { console.error('RSVP saved, but email notification failed: ' + mailError); }
    return reply(true, nonce, '');
  } catch (error) { return reply(false, nonce, String(error.message || error)); }
}
function safeCell(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }
function reply(ok, nonce, error) {
  const data = JSON.stringify({type:'melvin-joy-rsvp',ok:ok,nonce:nonce,error:error}).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.top.postMessage(' + data + ',"*");window.parent.postMessage(' + data + ',"*");<\/script></body></html>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// JSONP confirmation endpoint. Deploy a NEW VERSION after replacing this file.
// The response is executable JavaScript, so it can be read from GitHub Pages
// without cross-origin fetch permissions or HtmlService iframe restrictions.
function doGet(e) {
  const p = (e && e.parameter) || {};
  const nonce = String(p.nonce || '').slice(0, 120);
  const callback = String(p.callback || '');
  if (p.action !== 'status' || !nonce || (callback && !/^[A-Za-z_$][\w$]{0,100}$/.test(callback))) {
    return ContentService.createTextOutput('Invalid status request')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  let saved = false;
  try {
    const ss = SpreadsheetApp.openById('1E00yfmksAzRZF7nlrc4ygiCWcqWxOTi5_1FfrHoTYwY');
    const sheet = ss.getSheetByName('RSVP Responses');
    if (sheet && sheet.getLastRow() > 1) {
      saved = !!sheet.getRange(2, 5, sheet.getLastRow() - 1, 1)
        .createTextFinder(nonce).matchEntireCell(true).findNext();
    }
  } catch (err) { console.error('RSVP status lookup failed: ' + err); }
  const payload = JSON.stringify({type:'melvin-joy-rsvp-status', nonce:nonce, saved:saved});
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + payload + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  // A frame-based status check works even if JSONP is blocked by the browser.
  const html = '<!doctype html><html><body><script>' +
    'window.parent.postMessage(' + payload + ',"*");' +
    'window.top.postMessage(' + payload + ',"*");' +
    '<\/script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
