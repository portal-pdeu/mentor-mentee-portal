# Modular Project Architecture Guide

## Project Structure Philosophy

This project follows a **modular architecture** with **comprehensive error handling** to ensure:

1. **Easy Debugging**: Each component/service has its own file with clear error boundaries
2. **Maintainability**: Functionality is separated by concerns
3. **Scalability**: New features can be added without affecting existing code
4. **Error Tracking**: Every error shows exactly where to look for debugging

## Directory Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── login/                    # Login functionality
│   ├── profile/                  # Profile page (main page file only)
│   ├── mentor-dashboard/         # Mentor dashboard
│   ├── my-mentor/               # Student landing page - mentor details
│   ├── documents/               # Document management for students
│   └── mentee-dashboard/         # Mentee dashboard (deprecated)
├── components/                   # Reusable UI components
│   ├── ui/                      # Generic UI components
│   │   ├── ErrorBoundary.tsx    # Error boundary wrapper
│   │   ├── LoadingSpinner.tsx   # Loading states
│   │   └── ...
│   ├── profile/                 # Profile-specific components
│   │   ├── ProfileHeader.tsx    # Profile header section
│   │   ├── AcademicInformation.tsx
│   │   ├── ContactInformation.tsx
│   │   ├── AvailableHours.tsx   # Time slots with dropdown
│   │   ├── OfficeLocation.tsx
│   │   └── QuickActions.tsx
│   └── [feature]/               # Feature-specific components
├── services/                    # Business logic and API calls
│   ├── profileService.ts        # Profile data management
│   ├── authService.ts           # Authentication logic
│   └── [feature]Service.ts      # Feature-specific services
├── utils/                       # Utility functions
│   ├── errorHandler.ts          # Centralized error handling
│   ├── validation.ts            # Form validations
│   └── helpers.ts               # General helper functions
├── hooks/                       # Custom React hooks
│   ├── use-session-validation.ts
│   └── use-[feature].ts
├── types/                       # TypeScript type definitions
│   └── index.ts
└── GlobalRedux/                 # State management
    ├── authSlice.ts
    └── [feature]Slice.ts
```

## Component Architecture Rules

### 1. Single Responsibility Principle
- **One component = One responsibility**
- ✅ `ProfileHeader.tsx` - Only handles profile header display
- ✅ `AvailableHours.tsx` - Only handles time slots with dropdown
- ❌ Don't put multiple unrelated features in one component

### 2. Error Boundary Pattern
```typescript
// Every component should be wrapped in error boundaries
<ErrorBoundary>
    <YourComponent />
</ErrorBoundary>

// Every component should have internal error handling
try {
    // Component logic
    return <JSX />
} catch (error) {
    const componentError = {
        name: 'ComponentNameError',
        message: `Failed to render: ${error.message}`,
        component: 'ComponentName'
    };
    console.error('[ComponentName] Render Error:', componentError);
    
    // Return fallback UI
    return <ErrorFallback />;
}
```

### 3. Service Layer Pattern
```typescript
// Don't put API calls directly in components
❌ const data = await fetch('/api/profile')

// Use service layer instead
✅ const data = await profileService.fetchFacultyData(docId)
```

## Error Handling Standards

### 1. Error Naming Convention
```typescript
interface ComponentNameError extends Error {
    component: 'ComponentName';
    action?: string;
}
```

### 2. Error Logging Pattern
```typescript
const error: ComponentNameError = {
    name: 'ComponentNameError',
    message: `Description: ${originalError.message}`,
    component: 'ComponentName',
    action: 'functionName' // Optional
};
console.error('[ComponentName] Action Error:', error);
```

### 3. Fallback UI Pattern
```typescript
// Always provide fallback UI for errors
return (
    <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-600">Component Error</p>
        <p className="text-sm text-red-500">
            Component: ComponentName | Check console for details
        </p>
    </div>
);
```

## File Organization Rules

### 1. Feature-Based Organization
- Group related files by feature, not by file type
- ✅ `components/profile/ProfileHeader.tsx`
- ✅ `services/profileService.ts`
- ❌ `components/headers/ProfileHeader.tsx`

### 2. Import Organization
```typescript
// External imports first
import React from 'react';
import { useRouter } from 'next/navigation';

// Internal imports second
import { Faculty } from '@/types';
import profileService from '@/services/profileService';

// Component imports last
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ProfileHeader from '@/components/profile/ProfileHeader';
```

### 3. Export Standards
```typescript
// Default export for main component
export default ComponentName;

// Named exports for utilities and types
export { utilityFunction, ComponentProps };
```

## Debugging Guidelines

### 1. Finding Bugs by Error Message
Every error shows:
- **Component**: Which component failed
- **Action**: Which function/operation failed
- **Service**: Which service was involved (if any)

Example: `[ProfileHeader] getUserInitials Error:` → Look in `ProfileHeader.tsx`

### 2. Console Log Standards
```typescript
// Info logs for successful operations
console.log('[ComponentName] Operation completed:', data);

// Warning logs for recoverable issues
console.warn('[ComponentName] Warning:', warningMessage);

// Error logs for failures
console.error('[ComponentName] Error:', errorObject);
```

### 3. Development vs Production
- Development: Detailed error information and stack traces
- Production: User-friendly messages, detailed logs sent to service

## Best Practices Moving Forward

### 1. Before Adding New Features
1. Identify which components/services will be affected
2. Create separate files for new functionality
3. Add proper error boundaries
4. Implement fallback UIs

### 2. When Debugging
1. Check console for component-specific error logs
2. Look for the error in the specific component file mentioned
3. Use the action name to find the exact function
4. Check the service file if it's a data-related issue

### 3. Code Review Checklist
- [ ] Each component has a single responsibility
- [ ] Error boundaries are implemented
- [ ] Proper error logging with component names
- [ ] Fallback UIs are provided
- [ ] Services handle business logic, not components
- [ ] Types are properly defined

This architecture ensures that any bug can be quickly traced to its exact location, making debugging efficient and maintenance straightforward.
