import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // Prevents relative parent imports (../) but allows path aliases (~/)
      "no-restricted-imports": [
        "error",
        {
          "patterns": [{
            "group": ["../*", "../**"],
            "message": "Relative parent imports are not allowed. Use path aliases like '~/' instead."
          }]
        }
      ],

      // Enforces clean relative paths and prevents unnecessary segments
      "import/no-useless-path-segments": ["error", {
        noUselessIndex: true,
      }],
    },
  },
];

export default eslintConfig;