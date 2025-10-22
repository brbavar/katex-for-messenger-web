// const storage =
//   globalThis.browser?.storage.sync || globalThis.chrome?.storage.sync;
const storage = globalThis.browser?.storage || globalThis.chrome?.storage;
console.log(`storage = ${storage}`);

// Saves options to storage API
const saveOptions = () => {
  const format = document.getElementById('long-formula-format').value;
  if (
    storage !== undefined &&
    storage !== null &&
    storage.sync !== undefined &&
    storage.sync !== null
  ) {
    try {
      storage.sync.set({ longFormulaFormat: format }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      });
    } catch (error) {
      console.error('Caught ' + error);
    }
  }
};

// Restores select box and checkbox state using the preferences
// stored in storage API.
const restoreOptions = () => {
  if (
    storage !== undefined &&
    storage !== null &&
    storage.sync !== undefined &&
    storage.sync !== null
  ) {
    try {
      storage.sync.get({ longFormulaFormat: 'Add scroll bar' }, (items) => {
        document.getElementById('long-formula-format').value =
          items.longFormulaFormat;
      });
    } catch (error) {
      console.error('Caught ' + error);
    }
  }
};

document.addEventListener('DOMContentLoaded', saveOptions);
document.getElementById('save').addEventListener('click', saveOptions);
