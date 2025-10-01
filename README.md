<img width="200" height="200" alt="icon" src="https://github.com/user-attachments/assets/43eb6de2-4f7b-4548-9e40-563b33f51f90" />

# LaTeX for Messenger

Once upon a time we had Chrome extensions ([1](https://github.com/MALLER-LAGOON/latex-for-facebook), 
[2](https://github.com/dshynkev/messenger-latex)) that made TeX math rendering possible on Facebook/in Messenger. 
Facebook then [added native support](https://thenextweb.com/news/facebook-messenger-lets-you-write-basic-mathematical-formulae-in-latex)
for LaTeX to Messenger, making the second of the listed extensions obsolete, if not the first. Sadly, Messenger no longer supports LaTeX. Both of the extensions listed above are now defunct as they were not maintained after LaTeX support was implemented natively in Messenger.

Rather than trying to salvage those old extensions whose development I had no part in and whose inner workings were a mystery to me, I wrote an extension of my own: LaTeX for Messenger. As this repository's name suggests, LaTeX for Messenger uses KaTeX for rendering, which, when I began development, was a better-documented library than the latest version (3) of MathJax (whose docs were still under construction).

## Installation

If you use Chrome, Firefox, or Edge, the easiest option is to install via the [Chrome Web Store](https://chromewebstore.google.com/detail/latex-for-messenger/jjfbdmhcinjhlnhcajhdeiaaofkdconk), [Firefox Add-ons](https://addons.mozilla.org/addon/latex-for-messenger/), or [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/latex-for-messenger/fgbbmlmmanaeinndjkfkplniaclajcgk). Alternatively, you can [click here](https://github.com/brbavar/katex-for-messenger-web/archive/refs/heads/main.zip) to download the ZIP from GitHub, if you know what to do with it. This latter approach guarantees you get the latest version of the extension, even if that version has yet to be published in the aforementioned stores.

## Usage

While composing a message on Facebook, write your TeX code between `$$` and `$$`, or `\[` and `\]`, to display mathematical notation centered on its own line. Enclose your code in `$ ... $` or `\( ... \)` if you want your mathematical notation on the same line as ordinary text or a separate mathematical expression. The math is rendered only after you hit send (no live preview).

Bear in mind that your math will only be rendered on the screens of those using this extension. Send a message containing TeX code to anyone else, and all they'll see is the code.

Here are a couple examples of what the extension can do:
<br><br>
<img width="406" alt="Screenshot 2025-05-09 at 11 04 05 AM" src="https://github.com/user-attachments/assets/fb4f73f3-ae23-4db6-964e-f446dec84898" />
<br><br>
<img width="700" alt="Screenshot 2025-05-09 at 10 58 52 AM" src="https://github.com/user-attachments/assets/e48fc90d-3bea-4c88-bc1a-1ff3721811fe" />

## Limitations

- If a message is edited in one of your chats while you're using this extension, you'll have to refresh to view the latest version of the message.
- Typesetting only occurs in chat bubbles.
- You must place environments between math delimiters to render them.
- Though KaTeX officially supports the `subarray` environment, this extension can't seem to render it properly. You'll have to use `substack` instead, which I have confirmed works perfectly.
