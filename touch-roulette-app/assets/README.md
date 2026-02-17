# App Assets

Place your logo here for Capacitor asset generation.

Easy mode (recommended):

- `logo.png` or `logo.svg` (single logo)
- Optional dark-mode logo: `logo-dark.png` or `logo-dark.svg`

Custom mode (full control):

- `icon-only.png` (≥ 1024×1024)
- `icon-foreground.png` (≥ 1024×1024)
- `icon-background.png` (≥ 1024×1024)
- `splash.png` (≥ 2732×2732)
- `splash-dark.png` (≥ 2732×2732)

Once added, run (Android only):

```
npx @capacitor/assets generate --android
```

You can also set background colors, e.g.:

```
npx @capacitor/assets generate --android \
  --iconBackgroundColor '#eeeeee' \
  --iconBackgroundColorDark '#222222' \
  --splashBackgroundColor '#eeeeee' \
  --splashBackgroundColorDark '#111111'
```
