# Melvin & Joy Wedding — GitHub Pages

This is a static website that works with GitHub Pages. Keep `index.html` at the repository root.

## Publish
1. Create a **public** GitHub repository (e.g. `melvin-joy-wedding`).
2. Upload **the contents of this folder** to the repository root, including `index.html`, `style.css`, `script.js`, and the `.jpg` photos.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`, and Save.
4. Wait for the Pages deployment, then open the URL GitHub provides (typically `https://USERNAME.github.io/REPOSITORY/`).

## RSVP email — important
GitHub Pages does NOT process forms or send email itself. This website uses FormSubmit (`https://formsubmit.co/angelalylucio01@gmail.com,christinejoydecastro31@gmail.com,mirsummon22@gmail.com,alm.lucio04@gmail.com`).

**Before relying on RSVPs:** submit a test RSVP from the published website. FormSubmit will send a verification/activation email to `angelalylucio01@gmail.com`. Open that email and activate the form. Then submit a **second** test RSVP and confirm it arrives in Gmail (including Spam). Until activation, email delivery is not operational.

The RSVP form asks for guest name, Yes/No attendance, and optional message. It does not ask for guest count.

FormSubmit may show its own confirmation page; the included `thank-you.html` is an optional standalone page and is not the form's submission destination. No Netlify Forms configuration is needed.

Do not upload the ZIP as one file to GitHub: extract it and upload its individual contents.

## Thank-you redirect fix
The form now includes FormSubmit's `_next` field with the FULL published GitHub Pages URL. After a successful FormSubmit submission, guests should be redirected to `https://nxlj0415.github.io/Melvin-and-Joy-Wedding-2027/thank-you.html`. This requires FormSubmit email activation first.

To update your existing GitHub repository, use **Add file → Upload files** and upload the modified `index.html` (and `thank-you.html` if missing), commit, and wait for Pages deployment. Check the thank-you URL directly before submitting a test RSVP.


## Multiple RSVP recipients
The form is configured to request delivery to angelalylucio01@gmail.com, christinejoydecastro31@gmail.com, and mirsummon22@gmail.com using a comma-separated FormSubmit recipient list. Each recipient may need to confirm activation. Test from the published site and verify delivery to all three inboxes (including Spam). Delivery depends on FormSubmit accepting the multi-recipient configuration and activation; it is not guaranteed by editing HTML alone.
