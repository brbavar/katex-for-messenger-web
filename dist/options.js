console.log(`running options.js`);
// const storage = browser !== undefined ? browser.storage : chrome.storage;
// console.log(`browser = ${browser}, chrome = ${chrome}`);
const storage =
  globalThis.browser?.storage.sync || globalThis.chrome?.storage.sync;

// Saves options to storage API
const saveOptions = () => {
  const format = document.getElementById('long-formula-format').value;
  //   //   const likesColor = document.getElementById('like').checked;

  //   //   const storage =
  //   //     browser.storage !== undefined ? browser.storage : chrome.storage;
  //   const storage =
  //     globalThis.browser?.storage.sync || globalThis.chrome?.storage.sync;
  //   //   chrome.storage.sync.set(
  storage.set(
    { longFormulaFormat: format /*, likesColor: likesColor*/ },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in storage API.
const restoreOptions = () => {
  //   const storage =
  //     browser.storage !== undefined ? browser.storage : chrome.storage;
  //   const storage =
  //     globalThis.browser?.storage.sync || globalThis.chrome?.storage.sync;
  //   chrome.storage.sync.get(
  storage.get(
    { longFormulaFormat: 'Add scroll bar' /*, likesColor: true*/ },
    (items) => {
      document.getElementById('long-formula-format').value =
        items.longFormulaFormat;
      //   document.getElementById('like').checked = items.likesColor;
    }
  );
};

document.addEventListener(
  'DOMContentLoaded',
  saveOptions /*() => {
  console.log(`running options.js`);
  const storage = browser !== undefined ? browser.storage : chrome.storage;
  console.log(`browser = ${browser}, chrome = ${chrome}`);
  restoreOptions(storage);
  document.getElementById('save').addEventListener('click', () => {
    saveOptions(storage);
  });
}*/
);
document.getElementById('save').addEventListener('click', saveOptions);
