# Cipher (Frontend)

**Next.js** frontend for the **Cipher** project.

## 📁 Structure

```
frontend/
├── app/               # Pages
│   ├── page.tsx       # Home
│   ├── encrypt/       # Encryption page
│   ├── decrypt/       # Decryption page
│   ├── attack/        # Frequency analysis attack page
│   ├── report/        # Report generation page
│   └── layout.tsx     # Root layout
├── components/        # React components
│   ├── ui/            # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/               # Utilities
│   └── cn.ts          # Tailwind class merge helper
├── hooks/             # Custom hooks
└── public/            # Static assets
```

## 🚀 Getting Started

```bash
cd frontend
```

```bash
cp .env.example .env
pnpm install
```

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
