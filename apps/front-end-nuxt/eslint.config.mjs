// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    overrides: [
      {
        files: ["layouts/**", "pages/**"],
        rules: {
          "vue/multi-word-component-names": "off",
        },
      },
    ],
  },
);
