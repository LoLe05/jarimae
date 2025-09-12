# Jarimae Backend API Implementation

## Overview
Complete backend API implementation for the Jarimae restaurant reservation platform built with Next.js 14 App Router, Prisma ORM, and PostgreSQL.

## Architecture Components

### Database Layer
- **ORM**: Prisma with PostgreSQL
- **Schema**: Complete data model with 15+ entities
- **Location**: `prisma/schema.prisma`
- **Generated Client**: TypeScript-safe database client

### Authentication System
- **Strategy**: JWT-based authentication with access/refresh tokens
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Stateless JWT tokens
- **Location**: `lib/auth.ts`

### API Middleware Stack
1. **Authentication** (`lib/middleware/auth.ts`)
   - JWT token verification
   - User context injection
   - Protected route handling

2. **Authorization** (`lib/middleware/rbac.ts`)
   - Role-based access control
   - Permission validation
   - User type restrictions

3. **Validation** (`lib/middleware/validation.ts`)
   - Zod schema validation
   - Request payload sanitization
   - Type-safe data handling

4. **Error Handling** (`lib/middleware/error.ts`)
   - Centralized error management
   - Standardized error responses
   - Logging and monitoring

### Validation Schemas
- **Authentication**: `lib/schemas/auth.ts`
- **Store Management**: `lib/schemas/store.ts`
- **Reservations**: `lib/schemas/reservation.ts`

## API Endpoints

### Authentication APIs

#### User Registration
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Features**:
  - Email/phone uniqueness validation
  - Password strength requirements
  - User type support (CUSTOMER/OWNER)
  - Business number validation for owners
  - Automatic user preferences creation
  - Authentication logging

#### User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Features**:
  - Credential validation
  - Account status checking
  - Token generation
  - Last login tracking
  - Failed attempt logging
  - User preferences inclusion

#### Token Refresh
- **Endpoint**: `POST /api/auth/refresh`
- **Access**: Public
- **Features**:
  - Refresh token validation
  - New access token generation
  - User status verification

#### User Logout
- **Endpoint**: `POST /api/auth/logout`
- **Access**: Authenticated
- **Features**:
  - Session termination
  - Logout event logging

#### SMS Verification
- **Endpoint**: `POST /api/auth/verify-sms`
- **Access**: Authenticated
- **Features**:
  - Verification code generation
  - Phone number validation
  - Rate limiting (5 attempts)
  - Expiration handling (5 minutes)

#### Email Verification
- **Endpoint**: `POST /api/auth/verify-email`
- **Access**: Authenticated
- **Features**:
  - Email verification codes
  - Duplicate email checking
  - Rate limiting and expiration

#### User Profile Management
- **Endpoint**: `GET/PUT /api/users/profile`
- **Access**: Authenticated
- **Features**:
  - Complete profile retrieval
  - Profile updates with validation
  - Preference management
  - User statistics
  - Notification counts

### Store Management APIs

#### Store Listing
- **Endpoint**: `GET /api/stores`
- **Access**: Public
- **Features**:
  - Advanced search and filtering
  - Cuisine type filtering
  - Location-based search with radius
  - Price range filtering
  - Amenity filtering
  - Pagination support
  - Distance calculation
  - Multiple sorting options

#### Store Creation
- **Endpoint**: `POST /api/stores`
- **Access**: OWNER role only
- **Features**:
  - Comprehensive store information
  - Business hours management
  - Amenity specifications
  - Image upload support
  - Admin approval workflow
  - Owner verification

#### Individual Store Management
- **Endpoint**: `GET/PUT/DELETE/PATCH /api/stores/[id]`
- **Access**: Role-based (OWNER for own stores, ADMIN for all)
- **Features**:
  - Detailed store information
  - Monthly statistics
  - Recent reviews
  - Store updates with validation
  - Status management (ADMIN only)
  - Soft deletion with safety checks

### Reservation System APIs

#### Reservation Listing
- **Endpoint**: `GET /api/reservations`
- **Access**: Authenticated (role-based filtering)
- **Features**:
  - User-specific reservation filtering
  - Owner can see store reservations
  - Admin can see all reservations
  - Advanced search and filtering
  - Status-based filtering
  - Date range filtering
  - Pagination support

#### Availability Checking
- **Endpoint**: `GET/POST /api/reservations/availability`
- **Access**: Public
- **Features**:
  - Real-time availability calculation
  - Business hours validation
  - Capacity management
  - Time slot generation
  - Overlap detection
  - Preferred time checking

#### Reservation Creation
- **Endpoint**: `POST /api/reservations`
- **Access**: CUSTOMER role only
- **Features**:
  - Store validation and availability
  - Business hours checking
  - Capacity validation
  - Conflict prevention
  - Automatic duration estimation
  - Owner notifications

#### Individual Reservation Management
- **Endpoint**: `GET/PUT/PATCH /api/reservations/[id]`
- **Access**: Role-based permissions
- **Features**:
  - Detailed reservation information
  - Permission-based data filtering
  - Reservation modifications
  - Status transitions
  - Cancellation handling
  - Revenue tracking

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token generation with expiration
- **Password Security**: bcrypt hashing with configurable rounds
- **Refresh Token Rotation**: Secure session management
- **Rate Limiting**: Protection against brute force attacks

### Authorization Security
- **Role-Based Access Control**: Granular permission system
- **Resource Ownership**: Users can only access their own data
- **Admin Overrides**: Administrative access for management

### Data Security
- **Input Validation**: Comprehensive Zod schema validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Prevention**: Input sanitization and output encoding
- **CORS Configuration**: Proper cross-origin resource sharing

## Error Handling

### Standardized Responses
```typescript
{
  success: boolean,
  data?: any,
  error?: {
    code: string,
    message: string,
    field?: string
  },
  message?: string
}
```

### Error Categories
- **Authentication Errors**: 401 Unauthorized
- **Authorization Errors**: 403 Forbidden
- **Validation Errors**: 400 Bad Request
- **Not Found Errors**: 404 Not Found
- **Server Errors**: 500 Internal Server Error

## Performance Optimizations

### Database Optimizations
- **Efficient Queries**: Optimized Prisma queries with proper includes
- **Pagination**: Limit-based pagination for large datasets
- **Indexing**: Strategic database indexing for search performance
- **Transaction Management**: Atomic operations where needed

### Caching Strategy
- **In-Memory Caching**: Verification codes stored in memory
- **Code Cleanup**: Automatic cleanup of expired verification codes
- **Future Redis Integration**: Ready for Redis implementation

## Data Models

### Core Entities
- **Users**: Customer and owner accounts
- **Stores**: Restaurant information and settings
- **Reservations**: Booking system with status tracking
- **Reviews**: Rating and feedback system
- **Business Hours**: Operating schedule management
- **User Preferences**: Notification and privacy settings

### Relationship Mapping
- One-to-many: User → Reservations, Store → Reservations
- One-to-one: User → UserPreferences, Reservation → Review
- Many-to-many: Store ← → Tags (via special_features array)

## Korean Localization

### Business Rules
- **Korean Phone Format**: 010-0000-0000 validation
- **Korean Business Numbers**: 000-00-00000 format
- **Korean Names**: Hangul character support
- **Korean Addresses**: Full address format support

### Error Messages
- All error messages in Korean
- User-friendly validation messages
- Cultural context consideration

## Development Features

### Development Tools
- **Mock Data**: Comprehensive seed data for testing
- **Test Phones**: Special handling for development testing
- **Console Logging**: Detailed logging for development
- **Type Safety**: Full TypeScript coverage

### API Testing Support
- **OPTIONS Handlers**: CORS preflight request support
- **Flexible Input**: Multiple content-type support
- **Error Simulation**: Easy error testing scenarios

## Deployment Readiness

### Production Considerations
- **Environment Variables**: Configurable settings
- **Database Migrations**: Prisma migration system
- **Health Checks**: Basic endpoint monitoring
- **Scaling Ready**: Stateless architecture for horizontal scaling

### Integration Points
- **SMS Service Integration**: Ready for SMS provider
- **Email Service Integration**: Ready for email provider
- **Image Storage**: Ready for cloud storage integration
- **Payment Processing**: Structure ready for payment gateway

## Next Steps for Integration

### Frontend Connection
1. Update frontend API calls to use new endpoints
2. Implement authentication context with JWT tokens
3. Add error handling for API responses
4. Integrate real-time availability checking

### Production Setup
1. Configure production database (PostgreSQL/Supabase)
2. Set up environment variables
3. Run database migrations
4. Deploy to production environment

### Additional Features
1. Implement review and rating system
2. Add notification system
3. Create admin dashboard
4. Implement analytics and reporting

## API Usage Examples

### Authentication Flow
```typescript
// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "김철수",
  "phone": "010-1234-5678",
  "user_type": "CUSTOMER"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

// Use Bearer token in subsequent requests
Authorization: Bearer <access_token>
```

### Store Search
```typescript
GET /api/stores?cuisine_type=KOREAN&latitude=37.5665&longitude=126.9780&radius=5&sort_by=distance
```

### Reservation Flow
```typescript
// Check availability
POST /api/reservations/availability
{
  "store_id": "store_123",
  "reservation_date": "2024-01-15",
  "party_size": 4,
  "preferred_time": "18:00"
}

// Create reservation
POST /api/reservations
{
  "store_id": "store_123",
  "reservation_date": "2024-01-15",
  "reservation_time": "18:00",
  "party_size": 4,
  "contact_phone": "010-1234-5678",
  "contact_name": "김철수"
}
```

This comprehensive backend system provides a solid foundation for the Jarimae restaurant reservation platform with full CRUD operations, security, validation, and Korean business requirements support.