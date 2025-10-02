import { DomInfo } from './DomInfo.js';
import { injectCss } from './aesthetex.js';

const startUp = () => {
  const domInfo = oneTimeInit();

  if (window.location.href.startsWith('https://www.facebook.com/messages')) {
    setUpMessengerView(domInfo);
  } else {
    domInfo.setChatBoxContainerContainer();

    let lengthOfWait = 0;
    const waitToObserveChatBoxContainerContainer = () => {
      if (domInfo.getChatBoxContainerContainer() === null) {
        setTimeout(() => {
          if ((lengthOfWait += 100) < 5000) {
            domInfo.setChatBoxContainerContainer();
            waitToObserveChatBoxContainerContainer();
          }
        }, 100);
      } else {
        domInfo.observeChatBoxContainerContainer();
      }
    };
    waitToObserveChatBoxContainerContainer();

    domInfo.setChatBoxContainer();

    lengthOfWait = 0;
    const waitToHandleChatBoxContainer = () => {
      if (domInfo.getChatBoxContainer() === null) {
        setTimeout(() => {
          if ((lengthOfWait += 100) < 5000) {
            domInfo.setChatBoxContainer();
            waitToHandleChatBoxContainer();
          }
        }, 100);
      } else {
        handleChatBoxContainer(domInfo);
      }
    };
    waitToHandleChatBoxContainer();
  }
};

const initMessengerChat = (domInfo) => {
  domInfo.setResizeObservee();
  domInfo.setChatWidth();
  domInfo.observeChatWidth();

  domInfo.setChatContainer();
  domInfo.observeChatContainer();

  domInfo.setChat();
};

const handleChat = (domInfo) => {
  const chat = domInfo.getChat();
  if (domInfo.getChat() !== null && 'querySelector' in domInfo.getChat()) {
    const waitToHandleMessages = () => {
      if (domInfo.getMessageGrid() === null) {
        setTimeout(() => {
          domInfo.setChat(chat);
          domInfo.setMessageGrid();
          waitToHandleMessages();
        }, 100);
      } else {
        const label = domInfo.getChatBoxToLabel().get(chat);
        if (label === null || !domInfo.getLabelToBubbleObserver().has(label)) {
          domInfo.handleChatBubbles();
          domInfo.observeChatBubbles();
        }
      }
    };
    waitToHandleMessages();
  }
};

const handleChatBoxContainer = (domInfo) => {
  let lengthOfWait = 0;
  const waitToHandleChatBoxes = () => {
    if (domInfo.getChatBoxContainer().children.length === 0) {
      setTimeout(() => {
        if ((lengthOfWait += 100) < 5000) {
          waitToHandleChatBoxes();
        }
      }, 100);
    } else {
      const waitForGridsToBeLabeled = () => {
        if (!domInfo.messageGridsLabeled()) {
          setTimeout(waitForGridsToBeLabeled, 100);
        } else {
          domInfo.setChatBoxToLabel();
          domInfo.observeChatBoxes();
          const chatBoxes = domInfo.getChatBoxContainer().children;
          for (const chat of chatBoxes) {
            domInfo.markMostRecentMessage(chat);

            domInfo.setChat(chat);
            handleChat(domInfo);
          }
        }
      };
      waitForGridsToBeLabeled();
    }
  };
  waitToHandleChatBoxes();

  domInfo.observeChatBoxContainer();
};

const oneTimeInit = () => {
  injectCss();

  const domInfo = new DomInfo();

  domInfo.setMount();
  const waitForMount = () => {
    if (domInfo.getMount() === null) {
      setTimeout(() => {
        domInfo.setMount();
        waitForMount();
      }, 100);
    } else {
      domInfo.preventBlackPage();
    }
  };
  waitForMount();

  domInfo.setAccountControlsAndSettings();
  const waitForAccountControlsAndSettings = () => {
    if (domInfo.getAccountControlsAndSettings() === null) {
      setTimeout(() => {
        domInfo.setAccountControlsAndSettings();
        waitForAccountControlsAndSettings();
      }, 100);
    } else {
      domInfo.observeAccountControlsAndSettings();
    }
  };
  waitForAccountControlsAndSettings();

  return domInfo;
};

const setUpMessengerView = (domInfo) => {
  initMessengerChat(domInfo);

  const waitToHandleChat = () => {
    if (domInfo.getChat() === null) {
      domInfo.ignoreChatWidth();
      domInfo.ignoreChatContainer();
      setTimeout(() => {
        initMessengerChat(domInfo);
        waitToHandleChat();
      }, 100);
    } else {
      domInfo.markMostRecentMessage();

      handleChat(domInfo);

      // domInfo.setEditorContainers();
      // domInfo.observeEditorContainers();
    }
  };

  if (domInfo.getChat() === null) {
    waitToHandleChat();
  } else {
    domInfo.markMostRecentMessage();

    domInfo.setMessageGrid();
    domInfo.handleChatBubbles();
    domInfo.observeChatBubbles();

    // domInfo.setEditorContainers();
    // domInfo.observeEditorContainers();
  }
};

const setUpChatBoxView = (domInfo) => {
  domInfo.setChatBoxContainerContainer();
  domInfo.observeChatBoxContainerContainer();

  domInfo.setChatBoxContainer();
  const waitForGridsToBeLabeled = () => {
    if (!domInfo.messageGridsLabeled()) {
      setTimeout(waitForGridsToBeLabeled, 100);
    } else {
      domInfo.setChatBoxToLabel();
      domInfo.observeChatBoxes();

      const chatBoxes = domInfo.getChatBoxContainer().children;
      for (const chat of chatBoxes) {
        domInfo.setChat(chat);
        domInfo.setMessageGrid();
        const waitToHandleMessages = () => {
          if (domInfo.getMessageGrid() === null) {
            setTimeout(() => {
              domInfo.setMessageGrid();
              waitToHandleMessages();
            }, 100);
          } else {
            domInfo.markMostRecentMessage(chat);

            domInfo.handleChatBubbles();
            domInfo.observeChatBubbles();
          }
        };
        waitToHandleMessages();
      }

      domInfo.observeChatBoxContainer();
    }
  };
  waitForGridsToBeLabeled();
};

export { startUp, setUpMessengerView, setUpChatBoxView };
