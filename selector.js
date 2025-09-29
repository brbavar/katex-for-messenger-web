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
  '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm';

const katex = `${chatBubble} span:where(:not(.katex-display) > .katex, .katex-display)`;

const gridcellContainer =
  'div.x1qjc9v5.x9f619.xdl72j9.x2lwn1j.xeuugli.x1n2onr6.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.x6ikm8r.x10wlt62.x1ja2u2z > div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x1odjw0f.xish69e.x16o0dkt > div.x78zum5.xdt5ytf.x1iyjqo2.x2lah0s.xl56j7k.x121v3j4';

// const moreActionsMenuContainer =
//   'div.x9f619.x1n2onr6.x1ja2u2z > div.x78zum5.xdt5ytf.x1n2onr6.x1ja2u2z > div.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad > div:not(.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4) > div, div.x1ey2m1c.xtijo5x.xixxii4.xamhafn.x1vjfegm > div:not(.xuk3077.x78zum5.xc8icb0) > div';

// const moreActionsMenu = 'div[aria-label="More actions"][role="menu"]';

// const editorContainer =
//   'div[aria-label="Thread composer"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8, div:has(> .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.xt5xv9l.x6wvzqs.xpqajaz.x78zum5.xdt5ytf.x1c4vz4f.xs83m0k.x13qp9f6), div:has(> div[aria-label="Thread composer"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8)';

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
  katex,
  gridcellContainer,
};
