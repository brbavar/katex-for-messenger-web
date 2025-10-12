const mount = 'div[id^="mount"]';

const accountControlsAndSettings =
  'div[aria-label="Account Controls and Settings"][role="navigation"].x6s0dn4.x78zum5.x1s65kcs.x1n2onr6.x1ja2u2z';

const messengerControl = '[aria-label="Messenger"]';

const resizableChat =
  'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq';

const resizeObservee =
  '.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.xs83m0k.xjhlixk.xgyuaek';

const chatContainer = `${resizeObservee} div.x78zum5.xdt5ytf.x1iyjqo2.x1t2pt76.xeuugli.x1n2onr6.x1ja2u2z.x1vhhd5d:has(${resizableChat})`;

const chatBoxContainer = 'div.x1ey2m1c.x78zum5.xixxii4.x1vjfegm';

const chatBoxContainerContainer = `${mount} > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div[data-visualcompletion="ignore"]`;

const labeledMessageGrid = '[aria-label^="Messages in conversation"]';

const messageGrid = `${labeledMessageGrid}, div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62`;

const chatBubble =
  '.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.x14ctfv.x13sv91t.x6ikm8r.x10wlt62.xerhiuh.x1pn3fxy.x10zy8in.xm9bcq3.x1n2onr6.x1vjfegm.x1k4qllp.x1mzt3pk.x13faqbe.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.xaymx6s.xofb2d2';

const chatBubbleText =
  '.html-div.x14z9mp.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x12nagc.x1gslohp.xyk4ms5';

const katex = `${chatBubble} span:where(:not(.katex-display) > .katex, .katex-display)`;

const gridChunkContainer =
  'div.x1qjc9v5.x9f619.xdl72j9.x2lwn1j.xeuugli.x1n2onr6.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.x6ikm8r.x10wlt62.x1ja2u2z > div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x1odjw0f.xish69e.x16o0dkt > div.x78zum5.xdt5ytf.x1iyjqo2.x2lah0s.xl56j7k.x121v3j4';

// // const moreActionsMenuContainer =
// //   'div.x9f619.x1n2onr6.x1ja2u2z > div.x78zum5.xdt5ytf.x1n2onr6.x1ja2u2z > div.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad > div:not(.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4) > div, div.x1ey2m1c.xtijo5x.xixxii4.xamhafn.x1vjfegm > div:not(.xuk3077.x78zum5.xc8icb0) > div';

// // const moreActionsMenu = 'div[aria-label="More actions"][role="menu"]';

// const composer =
//   'div[aria-label="Thread composer"][role="group"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8';

// const textbox =
//   'div[role="textbox"][contenteditable="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw';

// const editSubmitButton =
//   'div[aria-label="Edit"][role="button"].x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.xc9qbxq.x14qfxbe.xjbqb8w:where(.x1h6gzvc, .x1ypdohk)';

// const editor = `.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.xt5xv9l.x6wvzqs.xpqajaz.x78zum5.xdt5ytf.x1c4vz4f.xs83m0k.x13qp9f6 > .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xpqajaz.x9f619.x78zum5.x1iyjqo2.xs83m0k.x1n2onr6.xh8yej3.xz9dl7a.xsag5q8.x135b78x.x11lfxj5 > .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.xpqajaz.x9f619.x78zum5.x1iyjqo2.xs83m0k.x1n2onr6.xh8yej3 > .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1c4vz4f.x2lah0s.x1el4u5y > .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.x1jfb8zj.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j > div.x9f619.x1n2onr6.x1ja2u2z > ${editSubmitButton}`;

// // const editorContainer =
// //   'div[aria-label="Thread composer"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8, div:has(> .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.xt5xv9l.x6wvzqs.xpqajaz.x78zum5.xdt5ytf.x1c4vz4f.xs83m0k.x13qp9f6), div:has(> div[aria-label="Thread composer"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8)';
// const editorContainer = `div:has(> ${editor}, > ${composer})`;

const editStatusContainer =
  '.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.x18d9i69.x1h91t0o.xkh2ocl.x78zum5.xdt5ytf.x13a6bvl.x193iq5w.x1c4vz4f.x1eb86dx.x1o5r3ls.x15r0g6m';

// const newMessageLink =
//   'a[aria-label="New message"][role="link"].x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.xc9qbxq.x14qfxbe.x1qhmfi1';

// const closeChatBoxButton =
//   'div[aria-label="Close chat"][role="button"].x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.x3ct3a4.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.x1iwo8zk.x1033uif.x179ill4.x1b60jn0.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x78zum5.xl56j7k.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1n2onr6.x1fgtraw.xgd8bvy.xjbqb8w';

export {
  mount,
  accountControlsAndSettings,
  messengerControl,
  resizableChat,
  chatContainer,
  resizeObservee,
  chatBoxContainer,
  chatBoxContainerContainer,
  labeledMessageGrid,
  messageGrid,
  chatBubble,
  chatBubbleText,
  katex,
  gridChunkContainer,
  // textbox,
  // editSubmitButton,
  // editorContainer,
  // newMessageLink,
  // closeChatBoxButton,
};
