# Melvin & Joy Wedding — GitHub Pages

This is a static website that works with GitHub Pages. Keep `index.html` at the repository root.

## Publish
1. Create a **public** GitHub repository (e.g. `melvin-joy-wedding`).
2. Upload **the contents of this folder** to the repository root, including `index.html`, `style.css`, `script.js`, and the `.jpg` photos.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`, and Save.
4. Wait for the Pages deployment, then open the URL GitHub provides (typically `https://USERNAME.github.io/REPOSITORY/`).

## RSVP delivery to four addresses
The form uses the **official FormSubmit CC feature**. The primary form action is `https://formsubmit.co/angelalylucio01@gmail.com`; its hidden `_cc` field sends copies to `christinejoydecastro31@gmail.com`, `mirsummon22@gmail.com`, and `alm.lucio04@gmail.com`.

**Activation required:** After publishing, submit a test RSVP and open the FormSubmit activation email sent to the primary address. Click the activation link. Submit a second RSVP and verify delivery to all four inboxes (including spam). If any CC recipient does not receive a copy, check spam and contact FormSubmit support. We cannot test external email delivery from this ZIP.

The RSVP form asks for guest name, Yes/No attendance, and optional message. It does not ask for guest count.

FormSubmit may show its own confirmation page; the included `thank-you.html` is an optional standalone page and is not the form's submission destination. No Netlify Forms configuration is needed.

Do not upload the ZIP as one file to GitHub: extract it and upload its individual contents.

## Thank-you redirect fix
The form now includes FormSubmit's `_next` field with the FULL published GitHub Pages URL. After a successful FormSubmit submission, guests should be redirected to `https://nxlj0415.github.io/Melvin-and-Joy-Wedding-2027/thank-you.html`. This requires FormSubmit email activation first.

To update your existing GitHub repository, use **Add file → Upload files** and upload the modified `index.html` (and `thank-you.html` if missing), commit, and wait for Pages deployment. Check the thank-you URL directly before submitting a test RSVP.


## Multiple RSVP recipients
The form uses one primary recipient and three CC recipients as documented by FormSubmit. Test delivery to all four inboxes after activating the primary form.


## Updated RSVP recipients
Primary: alm.lucio04@gmail.com
CC: vhinjoy13@gmail.com, christinejoydecastro31@gmail.com

FormSubmit activation may be required for the primary recipient. Test a live RSVP and check all three inboxes.
