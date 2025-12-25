# RTK Query Usage Guide

## Overview

This project uses **RTK Query** (built into Redux Toolkit) for efficient API data fetching, caching, and state management.

## Configuration

### Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### Authentication

The API automatically includes the `Authorization` header with a Bearer token from `localStorage`:

```typescript
localStorage.setItem("accessToken", "your-token-here");
```

## Using RTK Query Hooks

### 1. Query Data (GET)

```typescript
import { useGetConclusionRecommendationsQuery } from "@/redux/services/healthApi";

function MyComponent() {
  const { data, isLoading, isError, error } =
    useGetConclusionRecommendationsQuery("1.1");

  if (isLoading) return <Spin />;
  if (isError) return <Alert message={error.message} type="error" />;

  return (
    <div>
      {data?.data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### 2. Mutations (POST, PATCH, DELETE)

```typescript
import {
  useCreateConclusionRecommendationMutation,
  useUpdateConclusionRecommendationMutation,
  useDeleteConclusionRecommendationMutation,
} from "@/redux/services/healthApi";

function MyComponent() {
  const [createItem, { isLoading: isCreating }] =
    useCreateConclusionRecommendationMutation();
  const [updateItem, { isLoading: isUpdating }] =
    useUpdateConclusionRecommendationMutation();
  const [deleteItem, { isLoading: isDeleting }] =
    useDeleteConclusionRecommendationMutation();

  const handleCreate = async () => {
    try {
      const result = await createItem({
        key: "1.1",
        title: "Huyết áp bình thường",
        minValue: 90,
        maxValue: 120,
        conclusion: "Bình thường",
        recommendation: "Duy trì lối sống lành mạnh",
        level: "NORMAL",
      }).unwrap();

      message.success("Tạo thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleUpdate = async (id: number) => {
    await updateItem({
      id,
      data: { title: "Updated title" },
    }).unwrap();
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id).unwrap();
  };

  return (
    <Button onClick={handleCreate} loading={isCreating}>
      Create
    </Button>
  );
}
```

### 3. Automatic Refetching

RTK Query automatically refetches data when:

- Component mounts
- Window regains focus
- Network reconnects
- Cache is invalidated by mutations

### 4. Manual Refetch

```typescript
const { data, refetch } = useGetConclusionRecommendationsQuery('1.1')

<Button onClick={() => refetch()}>Refresh</Button>
```

## Adding New API Endpoints

### 1. Define Types

Add to `src/types/api.types.ts`:

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
}
```

### 2. Create API Service

Create `src/redux/services/userApi.ts`:

```typescript
import { baseApi } from "../baseApi";
import type { User, ApiResponse } from "@/types/api.types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => "/users",
      providesTags: ["User"],
    }),

    createUser: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = userApi;
```

### 3. Add Tag Type

Update `src/redux/baseApi.ts`:

```typescript
tagTypes: [
  'ConclusionRecommendation',
  'User', // Add new tag
  'Health',
],
```

## Cache Invalidation

RTK Query uses **tags** for cache invalidation:

- `providesTags`: Marks data with tags
- `invalidatesTags`: Invalidates tagged data when mutation succeeds

Example:

```typescript
// Query provides tag
getUsers: builder.query({
  query: () => '/users',
  providesTags: ['User'], // This data is tagged as 'User'
}),

// Mutation invalidates tag
createUser: builder.mutation({
  query: (body) => ({ url: '/users', method: 'POST', body }),
  invalidatesTags: ['User'], // Refetch all 'User' queries
}),
```

## Error Handling

```typescript
const { data, isError, error } = useGetConclusionRecommendationsQuery("1.1");

if (isError) {
  // error has type FetchBaseQueryError
  if ("status" in error) {
    const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
    return <Alert message={errMsg} type="error" />;
  }
}
```

## Best Practices

1. **Use hooks in components**: Don't call API functions directly
2. **Handle loading states**: Show spinners/skeletons while loading
3. **Handle errors**: Always check `isError` and display user-friendly messages
4. **Optimize refetching**: Use `skip` option to conditionally fetch data
5. **Use TypeScript**: Leverage full type safety with generics

## Example: Complete Component

```typescript
import { useState } from "react";
import { Button, Table, Modal, Form, Input, message } from "antd";
import {
  useGetConclusionRecommendationsQuery,
  useCreateConclusionRecommendationMutation,
  useDeleteConclusionRecommendationMutation,
} from "@/redux/services/healthApi";

export default function ConclusionList() {
  const [selectedKey, setSelectedKey] = useState("1.1");
  const { data, isLoading } = useGetConclusionRecommendationsQuery(selectedKey);
  const [createItem] = useCreateConclusionRecommendationMutation();
  const [deleteItem] = useDeleteConclusionRecommendationMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id).unwrap();
      message.success("Xóa thành công!");
    } catch {
      message.error("Có lỗi xảy ra!");
    }
  };

  return (
    <Table
      dataSource={data?.data}
      loading={isLoading}
      columns={[
        { title: "Title", dataIndex: "title" },
        {
          title: "Actions",
          render: (_, record) => (
            <Button danger onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          ),
        },
      ]}
    />
  );
}
```

## DevTools

Install the **Redux DevTools** browser extension to:

- Inspect API state
- View cached data
- Monitor API calls
- Debug cache invalidation

---

For more information, see the [RTK Query documentation](https://redux-toolkit.js.org/rtk-query/overview).
