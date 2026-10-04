# Florea Client - AI Agent Guidelines

## 🚀 Project Overview
Florea Client is a Next.js (React & TypeScript) frontend application providing a UI for the Florea real estate platform.

## 🏗️ Tech Stack & Conventions
- **Framework**: Next.js (Pages Router)
- **State Management**: Apollo Client (Reactive Variables: `userVar`, `socketVar`)
- **Styling**: SCSS (PC & Mobile layouts) & Material-UI (MUI)
- **Real-time**: Custom `LoggingWebSocket` link in `apollo/client.ts`

## 📜 Coding Standards
1. **Components**: Place reusable UI components in `libs/components/`.
2. **GraphQL Queries/Mutations**: Define in `apollo/user/` and `apollo/admin/`.
3. **Types**: Shared TypeScript interfaces belong in `libs/types/`.
