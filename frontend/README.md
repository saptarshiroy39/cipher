<h1 align="center">
  <b>🌐</b>
  <br>
  <b>Cipher (Frontend)</b>
</h1>

<p align="center">
  <b>Next.js</b> frontend for the <b>Cipher</b> project.
</p>

## 📁 _Structure_

```
frontend/
├── app/                # Pages
│   ├── page.tsx        # Home
│   ├── encrypt/        # Encryption page
│   ├── decrypt/        # Decryption page
│   ├── attack/         # Frequency analysis attack page
│   ├── report/         # Report generation page
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                # Utilities
│   └── cn.ts           # Tailwind class merge helper
├── hooks/              # Custom hooks
└── public/             # Static assets
```

## 🚀 _Getting Started_

```bash
cd frontend
```

```bash
pnpm install
```

```bash
pnpm dev
```

- 🌐 [**_`Frontend App`_**](http://localhost:3000) - Open frontend app at [`localhost:3000`](http://localhost:3000)
