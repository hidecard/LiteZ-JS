### `LiteZ` Features

#### 1. Component Management
- **What is it?**: Allows you to create reusable UI components, either programmatically or from `.zjs` files that combine templates, scripts, and styles.
- **Why is it useful?**: You can build things like buttons or cards once and reuse them anywhere in your app.
- **Example**:
  ```html
  <!-- app.zjs -->
  <template>
    <button>{{ text }}</button>
  </template>
  <script>
  () => ({
    data: () => ({ text: "Click Me" })
  })
  </script>
  ```
  ```javascript
  LiteZ.createComponentFromFile('app.zjs', 'MyButton');
  LiteZ.vRender('MyButton', {}, '#app');
  ```
  - **Result**: A `<button>Click Me</button>` appears in the browser.

#### 2. State Management
- **What is it?**: Manages data and automatically updates the UI when the data changes.
- **Why is it useful?**: For example, if a counter increases, the display updates instantly.
- **Example**:
  ```javascript
  const state = LiteZ.createState({ count: 0 });
  state.subscribe((data) => {
    document.getElementById('app').innerHTML = `Count: ${data.count}`;
  });
  state.set({ count: 1 });
  ```
  - **Result**: "Count: 0" changes to "Count: 1" on the screen.

#### 3. Reactive Refs
- **What is it?**: Simplifies managing a single reactive value.
- **Why is it useful?**: Easily update something simple like a name.
- **Example**:
  ```javascript
  const name = LiteZ.createRef('Mg Mg');
  name.subscribe((data) => {
    document.getElementById('app').innerHTML = `Hello, ${data.value}`;
  });
  name.value = 'Aung Aung';
  ```
  - **Result**: "Hello, Mg Mg" updates to "Hello, Aung Aung".

#### 4. Hooks (useEffect)
- **What is it?**: Runs actions automatically when specific data changes.
- **Why is it useful?**: For example, you can log a message every time data changes.
- **Example**:
  ```javascript
  const state = LiteZ.createState({ count: 0 });
  LiteZ.useEffect(() => {
    console.log('Count is now:', state.get('count'));
  }, () => [state.get('count')]);
  state.set({ count: 1 });
  ```
  - **Result**: Console shows "Count is now: 0" then "Count is now: 1".

#### 5. Global Store
- **What is it?**: Stores app-wide data in one central place.
- **Why is it useful?**: For example, track shopping cart items across the app.
- **Example**:
  ```javascript
  const store = LiteZ.createStore({
    state: { items: 0 },
    mutations: {
      add(state) { state.set({ items: state.get('items') + 1 }); }
    }
  });
  store.commit('add');
  console.log(store.state.get('items')); // 1
  ```

#### 6. Routing
- **What is it?**: Manages page navigation with routes.
- **Why is it useful?**: Separate pages like `/home` and `/about`.
- **Example**:
  ```javascript
  LiteZ.createComponent('Home', { template: () => '<h1>Home</h1>' });
  LiteZ.router({ '/': { component: 'Home' } });
  ```
  - **Result**: Visiting `/` shows "Home" in the browser.

#### 7. Virtual DOM Rendering
- **What is it?**: Updates the UI efficiently using a virtual DOM.
- **Why is it useful?**: Only changes what’s needed, making it fast.
- **Example**:
  ```javascript
  LiteZ.createComponent('Counter', {
    template: (props) => `<div>${props.state.get('count')}</div>`,
    setup: () => ({ state: LiteZ.createState({ count: 0 }) })
  });
  const state = LiteZ.vRender('Counter', {}, '#app');
  state.set({ count: 1 });
  ```
  - **Result**: "0" updates to "1" on the screen.

#### 8. Event Bus
- **What is it?**: Lets components communicate through events.
- **Why is it useful?**: For example, notify another part when a button is clicked.
- **Example**:
  ```javascript
  LiteZ.on('click', () => console.log('Button clicked!'));
  LiteZ.emit('click');
  ```
  - **Result**: Console logs "Button clicked!".

#### 9. Internationalization (i18n)
- **What is it?**: Supports multiple languages.
- **Why is it useful?**: Switch between languages like English and Myanmar.
- **Example**:
  ```javascript
  LiteZ.initI18n({
    locale: 'my',
    translations: { my: { hello: 'မင်္ဂလာပါ' }, en: { hello: 'Hello' } }
  });
  console.log(LiteZ.t('hello')); // မင်္ဂလာပါ
  ```

#### 10. Themes
- **What is it?**: Changes the app’s appearance (e.g., themes).
- **Why is it useful?**: Switch between light and dark modes.
- **Example**:
  ```javascript
  LiteZ.initTheme({
    defaultTheme: 'dark',
    styles: { dark: { '--bg': '#333' } }
  });
  LiteZ.setTheme('dark');
  ```
  - **Result**: Background turns dark.

#### 11. Forms
- **What is it?**: Easily create and validate forms.
- **Why is it useful?**: Build login forms with validation quickly.
- **Example**:
  ```javascript
  const form = LiteZ.createForm({ name: '' }, { name: { required: true } });
  form.submit((values) => console.log(values));
  ```

#### 12. Animations
- **What is it?**: Adds motion to elements.
- **Why is it useful?**: Make buttons fade in smoothly.
- **Example**:
  ```javascript
  LiteZ.animate('#button', [{ opacity: 0 }, { opacity: 1 }], { duration: 1000 });
  ```

#### 13. Database Integration
- **What is it?**: Stores data in IndexedDB, localStorage, Firebase, etc.
- **Why is it useful?**: Save user data locally or online.
- **Example**:
  ```javascript
  LiteZ.initNoSQL();
  LiteZ.noSQLAction('users', 'add', { key: '1', value: 'Mg Mg' });
  ```

#### 14. Plugins & Middleware
- **What is it?**: Adds custom functionality.
- **Why is it useful?**: For example, block pages if not logged in.
- **Example**:
  ```javascript
  LiteZ.useMiddleware((ctx) => console.log('Navigating to:', ctx.path));
  ```

#### 15. Pre-built Modules
- **What is it?**: Ready-to-use features like Cart, Social, Dashboard, Auth.
- **Why is it useful?**: Quickly add a shopping cart.
- **Example**:
  ```javascript
  const cart = LiteZ.createCart();
  cart.addItem({ id: 1, price: 100 });
  console.log(cart.getCart().total); // 100
  ```

#### 16. Computed Properties
- **What is it?**: Automatically calculates values from data.
- **Why is it useful?**: Get a cart total instantly.
- **Example**:
  ```javascript
  const state = LiteZ.createState({ price: 100 });
  const total = LiteZ.createComputed(state, () => state.get('price') * 2);
  console.log(total.get()); // 200
  ```

#### 17. Directives
- **What is it?**: Controls UI with custom HTML attributes.
- **Why is it useful?**: Show or hide elements easily.
- **Example**:
  ```html
  <div data-z-show="state.get('show')">Hello</div>
  ```

---

## Installation
```bash
npm install litez
npx litez init my-app
cd my-app
npx litez build
npx serve dist
```

## License
MIT
```

---

### Notes
- **Clarity**: Each feature is explained simply with a practical example.
- **Conciseness**: Only key features are highlighted to keep it short (full list available in the code).
- **Usability**: Includes installation steps to get started quickly.
