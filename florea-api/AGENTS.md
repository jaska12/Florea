# Florea API - AI Agent Guidelines

## 🚀 Project Overview
Florea API is a NestJS monorepo backend application powering Florea, an online gift & flower marketplace and community platform. It utilizes MongoDB (Mongoose), GraphQL (Apollo), and WebSockets for real-time features.

## 🏗️ Architecture & Structure
- **Framework**: NestJS (Monorepo architecture)
- **Database**: MongoDB Atlas with Mongoose Schemas (`src/schemas/`)
- **API**: GraphQL (Apollo GraphQL Server) & WebSockets (`@nestjs/websockets`)
- **Authentication**: JWT token-based auth (`AuthService`, `@nestjs/jwt`)

## 📜 Key Coding Standards & Conventions
1. **Component Organization**: Modules are located inside `apps/florea-api/src/components/` (e.g., `member`, `property`, `board-article`, `comment`, `like`, `follow`, `view`).
2. **GraphQL DTOs**: Input types, args, and update DTOs belong in `src/libs/dto/`.
3. **Mongoose Schemas**: Define schemas with `@Schema()` and `@Prop()` in `src/schemas/`.
4. **WebSocket Integration**: Manage real-time chat and online tracking in `src/socket/socket.gateway.ts`.
5. **Environment Configuration**: Always use environment variables defined in `.env` (`PORT_API`, `PORT_BATCH`, `MONGO_DEV`, `MONGO_PROD`, `SECRET_TOKEN`).

## 🛠️ Testing & Verification
- Ensure compilation with `npm run start:dev` or `npm run build`.
- Maintain strict TypeScript type checks without using unnecessary `any` types.
