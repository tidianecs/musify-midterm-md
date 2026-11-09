# Mobile Development (DAUST, Fall 2026): course reference

Summary of Lectures 1–5 (React Native with Expo). Use these conventions for every lab in this course.
The course's own choices beat older tutorials: always follow the patterns below.

## How to help me
- I'm a 3rd-year computer engineering student. I know React for the web.
- Labs: go one step at a time. For each step, explain **why** it exists and **which lecture notion** it uses, then give the code.
- When I ask for code, give the **full cumulative file** (merged with the previous step), not just a snippet.
- No comments inside the code.
- Keep code at student level: only use concepts from the lectures below.
- I may write in French or English. Answer in the language I use.

---

## Lecture 1 — From React on the Web to React Native
- **Three approaches:** native (Kotlin/Swift, one codebase per platform), hybrid (web content in a WebView), cross-platform (React Native, Flutter). Hybrid ≠ cross-platform.
- **React Native is not a website in a phone.** React components → React Native → native platform implementation → Android/iOS app.
- **What transfers from web React:** components, props, state, hooks, JSX, conditional rendering, lists, events, composition.
- **What doesn't:** no DOM, no HTML, no CSS files.

| Web | React Native |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<span>`, `<h1>` | `<Text>` |
| `<img>` | `<Image>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<Pressable>` |
| `onClick` | `onPress` |
| CSS / `className` | style objects / `StyleSheet` |
| React Router | Expo Router |

- **Architecture (recognition level):**

| Term | Remember it as |
|---|---|
| Hermes | JavaScript engine (default) |
| JSI | JS ↔ native interface |
| Fabric | rendering system |
| TurboModules | native module system (camera, GPS, storage…) |

- The old asynchronous "bridge" is historical: New Architecture default since RN 0.76, the only one since 0.82.
- **Expo** is tooling on top of React Native. **Expo Go** = prebuilt playground for learning. **Development build** = your own native app, for custom native modules and real projects. Snack (snack.expo.dev) = React Native in the browser.
- Cross-platform reduces duplicated code but does **not** erase platform differences. Performance must still be measured.

## Lecture 2 — Core Components, StyleSheet, Flexbox
- **`View`**: container for grouping, styling and layout. It **cannot contain raw text**.
- **`Text`**: all text goes inside it. Nested `Text` **inherits** the parent's text styles; this is the only inheritance in RN. Props: `numberOfLines`, `onPress`.
- **Images: use `expo-image`** (`npx expo install expo-image`).
  - Local: `source={require("…")}`, size is read automatically.
  - Network: `source="https://…"` **must have `width` and `height`**, otherwise it renders at 0×0.
  - `contentFit`: `cover` (fill, crop), `contain` (fit, letterbox), `fill` (stretch).
- **`ScrollView`**: opt-in scrolling. Content styles go in `contentContainerStyle`. It renders **everything at once**, so it's fine for a screen of content but wrong for long lists.
- **Safe areas**: `SafeAreaView` from **`react-native-safe-area-context`** (RN's own one is deprecated).
- **`StyleSheet.create`** is the course convention: named, reusable styles.
- **Units**: plain numbers (density-independent pixels), and percentages as strings (`"50%"`). No `px`, `em`, `vh`.
- **Style arrays**: `style={[styles.a, cond && styles.b]}`. Later entries override earlier ones, and `false` is ignored.
- **No cascade, no inheritance (except Text in Text), no selectors.** Every style is local. Share styles by sharing components.
- **Daily properties**: padding/margin (+ Horizontal/Vertical), backgroundColor, borderRadius/Width/Color, fontSize, fontWeight, color, textAlign, lineHeight, width/height. Use **`boxShadow`** (the modern way) rather than `shadow*` + `elevation`.
- **Flexbox**: every `View` is a flex container, and the **default `flexDirection` is `column`**.
  - `justifyContent` = main axis; `alignItems` = cross axis.
  - `flex: 1` = take the leftover space. `flex: 2` vs `flex: 1` = 2:1 proportions.
  - **`gap`** on the parent spaces the children. Use `padding` for space inside a box, and `margin` only as a last resort.

## Lecture 3 — FlatList, SectionList, the Keyboard
- **Virtualisation**: `FlatList` renders only a **window** around the visible area. `ScrollView` + `.map()` renders everything.
- **FlatList core props**: `data`, `renderItem`, `keyExtractor`.
  - `renderItem` receives an object, so destructure it: `({ item }) => …`. Writing `(item) =>` is the common bug.
- **Keys = identity**: `keyExtractor={(item) => item.id}`. **Never the index**, because positions change but identities don't. Every item carries a stable `id`.
- **Complete list props**: `ListHeaderComponent`, `ItemSeparatorComponent` (only between items), `ListFooterComponent`, `ListEmptyComponent`. Every list is empty at least once.
- **`extraData={selectedId}`** when the rows' look depends on state outside `data`.
- **`SectionList`**: grouped data via `sections=[{ title, data: [...] }]` plus `renderSectionHeader`.
- **Shapes**: `horizontal`, `numColumns={2}` (grid).
- **Changing data (recognition)**: `refreshing` + `onRefresh` (pull to refresh), `onEndReached` (load more).
- **Search**: a controlled `TextInput` plus a filtered array derived from the query.
- **Keyboard tools:**

| Question | Tool |
|---|---|
| Should a tap still reach the list? | `keyboardShouldPersistTaps="handled"` |
| Should dragging dismiss the keyboard? | `keyboardDismissMode="on-drag"` |
| Does the keyboard cover content? | `KeyboardAvoidingView` with `behavior={Platform.OS === "ios" ? "padding" : "height"}` |

- **Performance**: measure first (real device, performance monitor). Recognition only: `getItemLayout`, `React.memo`, `FlashList`.

## Lecture 4 — Navigation with Expo Router
- **The `app/` folder is the router**: one file = one screen/route. No route table.
  - `app/index.tsx` → `/`
  - `app/settings/profile.tsx` → `/settings/profile`
- **Special names:**
  - `index.tsx` = the folder's own route.
  - `[id].tsx` = dynamic route.
  - `_layout.tsx` = the frame or navigator for that folder (not a screen).
- **`Stack`** (in `_layout.tsx`): push and pop, header, back button, transitions. The list stays underneath the detail screen.
- **`Link`**: declarative navigation, `<Link href="/contacts">`. Add **`asChild`** to pass the press behaviour to a custom `Pressable`.
- **`useRouter()`** (inside components) for navigation after a decision:
  - `navigate(href)`: the usual choice.
  - `push`: always adds a screen.
  - `back()`: return to the previous screen.
  - `replace(href)`: no history; use it after a login.
- **Parameters**: read with `const { id } = useLocalSearchParams<{ id: string }>();`. Always handle **not found**.
  - Navigate with `{ pathname: "/contacts/[id]", params: { id } }`.
  - **Pass only the identifier; look the data up.** Never pass whole objects, because URLs are visible, editable and can be stale.
- **Header options**: `title`, `headerShown: false`, `presentation: "modal"`. Set them in the layout (`<Stack.Screen name=… options=… />`) or from inside the screen (`<Stack.Screen options={{ title }} />`).
- **Route groups `(name)/`** organise files without changing the URL: `(tabs)/index.tsx` is `/`.
- **Tabs**: `<Tabs>` in a layout. Navigators nest: root Stack → `(tabs)` with Tabs → a Stack inside a tab.
- **Modal** = an ordinary route with `presentation: "modal"`. Everything is a route.
- **A doubled header** means two navigators both draw one. Fix it with `headerShown: false` on one of them.
- **Structure**: only screens go in `app/`. Put `components/`, `data/` and `context/` beside it (a helper file inside `app/` becomes an unwanted route). The `@/` alias points to the project root (or `src/`).
- `export const unstable_settings = { initialRouteName: "index" };` makes a nested stack always start from its list.

## Lecture 5 — State Beyond One Screen
- **Where state lives:**

| Who reads it | Where | How |
|---|---|---|
| One component | the component | `useState` |
| Siblings in one screen | nearest common parent | lift state up: data ↓ props, events ↑ callbacks |
| Several screens / distant components | a shared tree | Context |
| Constant data | nowhere | just import it |

- Route screens are created by the router, so they don't pass props to each other. Route params are strings and one-directional, so they're not a solution either.
- **Context = 3 pieces**: `createContext` → Provider → `useContext`.
  - **Context distributes state; it doesn't store it.** The state is `useState` (or `useReducer`) inside the Provider.
- **Pattern** (one file in `context/`):
  1. A `type …Value` = the public interface.
  2. `const Ctx = createContext<Value | null>(null)`, kept private.
  3. A Provider holding the state, exposing `value={{ … }}`.
  4. A custom hook `useX()` that throws `"useX must be used inside XProvider"` when the value is `null`.
- **Provider placement**: above every reader, in the **narrowest layout** that covers them all.
- **Context to reach the screen, props below it**: row components stay context-free.
- **Immutability**: return new arrays/objects (`filter`, spread). Use the function form of the setter: `setX((current) => …)`.
- **Rules of Hooks**: all hooks at the top of the component, before any early `return`.
- **`useReducer`**: `const [state, dispatch] = useReducer(reducer, initial)`.
  - **Action** = what happened, e.g. `{ type: "add", id }`. Type actions as a discriminated union.
  - **Reducer** = a pure function `(state, action) => nextState` (no side effects, no mutation), written outside the component.
  - Use it when several named operations change the same state. Start with `useState` by default.
- **Context + reducer**: Context = who can access; reducer = how it changes; component = display + dispatch.
- **Don't**:
  - one giant `AppContext` (prefer one context per concern);
  - local values in Context.
- **Context is memory, not storage**: it is lost on reload. Persistence (AsyncStorage) and server data (TanStack Query) are separate concerns.
- Recognition only: Zustand, Redux Toolkit, TanStack Query, `useMemo` for context values, `React.memo`.
- **Decision questions**: Who reads it? Who changes it? What's the narrowest place that covers both?
