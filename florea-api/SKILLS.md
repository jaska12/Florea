# Florea API - AI Agent Skills & Capabilities

## 🛠️ Core Capabilities

### 1. NestJS Architecture & Module Creation
- Create and organize NestJS modules, services, resolvers, and controllers.
- Implement dependency injection using `@Injectable()` and constructor injection.

### 2. GraphQL Integration (Apollo)
- Write GraphQL resolvers (`@Resolver()`), queries (`@Query()`), and mutations (`@Mutation()`).
- Define input types with `@InputType()` and `@Field()` decorators.

### 3. MongoDB & Mongoose Modeling
- Design database models using `@Schema()` and `@Prop()`.
- Implement aggregation pipelines, indexes, and document queries.

### 4. WebSocket Real-time Communication
- Manage client connections, disconnections, and event subscriptions via `@WebSocketGateway()`.
- Broadcast messages (`emitMessage`, `broadcastMessage`) and maintain online client states.

### 5. Automated Background Tasks (Batch Server)
- Schedule cron jobs using NestJS Schedule (`@Cron()`).
- Execute background rank calculations and database rollbacks in `apps/nestar-batch`.
