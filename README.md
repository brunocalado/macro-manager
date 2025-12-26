# Macro Manager

**Streamline your workflow.** Macro Manager empowers Game Masters and Developers to create beautiful, searchable, and persistent macro interfaces with a single line of code.

<p align="center"><img width="300" src="docs/preview.webp"></p>

Forget cluttered hotbars and complex configurations. Macro Manager provides a clean, API-driven solution to organize your world and compendium macros effortlessly.

## ✨ Features

-   **🔍 Searchable Interface:** Instantly find the macro you need with a built-in search bar.
-   **📚 Compendium Support:** Run macros directly from Compendiums without cluttering your world.
-   **🎨 Beautiful UI:** A modern, responsive interface that looks great on any system.
-   **🛠️ API-First:** Designed for power users. Control everything via `MacroManager.Open()`.
-   **📌 Persistent Windows:** Keep your tools open as long as you need them.

## 📖 Usage & Documentation

Detailed instructions, code examples, and API references are available on our Wiki:

👉 **[View the Wiki](https://github.com/brunocalado/macro-manager/wiki)**

### ⚡ Quick Start

Open a custom window with your favorite macros instantly:

```javascript
MacroManager.Open({
    title: "Combat Toolkit",
    macroList: "Attack; Defend; ## Utility; Heal; Torch",
    persistent: true
});
```

## 🤝 Community & Support

-   **Issues:** Found a bug? [Report it here](https://github.com/brunocalado/macro-manager/issues).
-   **Wiki:** Check the [Wiki](https://github.com/brunocalado/macro-manager/wiki) for advanced usage.
-   **Change Log:** See what's new in [CHANGELOG.md](CHANGELOG.md).

---

*Made with ❤️ for Foundry VTT.*