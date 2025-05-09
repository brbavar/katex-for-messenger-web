# KaTeX for Messenger

Disclaimer: DOESN'T WORK AS INTENDED YET.

Once upon a time we had Chrome extensions ([1](https://github.com/MALLER-LAGOON/latex-for-facebook), 
[2](https://github.com/dshynkev/messenger-latex)) that made TeX math rendering possible on Facebook/in Messenger. 
Facebook then [added native support](https://thenextweb.com/news/facebook-messenger-lets-you-write-basic-mathematical-formulae-in-latex)
for LaTeX to Messenger, making the second of the listed extensions obsolete, if not the first. Sadly, Messenger no longer supports LaTeX. Both of the extensions listed above are now defunct as they were not maintained after LaTeX support was implemented natively in Messenger.

Rather than trying to salvage those old extensions whose development I had no part in 
and whose inner workings were a mystery to me, I wrote a Chrome extension of my own: KaTeX for Messenger. As the name suggests, 
it uses KaTeX for rendering, which is currently a better-documented library than the latest version of MathJax (whose docs 
are [under construction](https://docs.mathjax.org/en/latest/api/index.html)).

## Installation

[Click here](https://github.com/brbavar/katex-for-messenger-web/archive/refs/heads/main.zip) to download the ZIP. Once you've extracted the files, open Google Chrome, type `chrome://extensions` into the search bar, and press Enter. Click the button labeled "Load unpacked".
<br><br>
<img width="967" alt="Screenshot 2025-05-09 at 5 10 21 AM" src="https://github.com/user-attachments/assets/4707376b-c824-4cdc-9a03-941ca0906350" />
<br><br>
This brings up Finder or File Explorer. Once that window opens, select the unpacked ZIP file, which should be a folder named `katex-for-messenger-web-main`, in order to load that entire folder into your collection of extensions.
<br><br>
<img width="714" alt="Screenshot 2025-05-09 at 5 14 41 AM" src="https://github.com/user-attachments/assets/bfa4864e-ef4a-4c7c-9f80-1effbe2cdd00" />
<br><br>
The extension is automatically activated and ready to go!
<br><br>
<img width="402" alt="Screenshot 2025-05-09 at 5 19 08 AM" src="https://github.com/user-attachments/assets/f314a3f1-68d9-47d4-bdc1-20397c1c4878" />
<br><br>

## Usage

While composing a message on Facebook, write your TeX code between `$$` and `$$` if you want to display mathematical notation centered on its own line. Enclose your code in `\(` and `\)` if you want your mathematical notation on the same line as other mathematical expressions or ordinary text. The math is rendered only after you hit send (no live preview).

Bear in mind that your math will only be rendered on the screens of those using this extension. Send a message containing TeX code to anyone else, and all they'll see is the code.

Here are a couple examples of what the extension can do:
<br><br>
<img width="406" alt="Screenshot 2025-05-09 at 11 04 05 AM" src="https://github.com/user-attachments/assets/fb4f73f3-ae23-4db6-964e-f446dec84898" />
<br><br>
<img width="868" alt="Screenshot 2025-05-09 at 10 58 52 AM" src="https://github.com/user-attachments/assets/e48fc90d-3bea-4c88-bc1a-1ff3721811fe" />
