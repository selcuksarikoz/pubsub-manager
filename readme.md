# Publish - Subscribe for Javascript/Typescript

[![NPM Version](https://img.shields.io/npm/v/@kozmonot/pubsub-manager)](https://www.npmjs.com/package/@kozmonot/pubsub-manager)

A simple and lightweight Publish/Subscribe (PubSub) utility for decoupled communication in JavaScript and TypeScript applications. Ideal for managing events between modules without direct dependencies.

## Demo
https://pubsub-manager.vercel.app/

## Overview

The `PubSub` class provides the following functionalities:

-   **`subscribe(event, cb)`:** Subscribes a callback function to a specific event. The callback will be executed whenever the event is published. Returns an object with an `unSubscribe` method to remove the subscription.
-   **`publish(event, body)`:** Publishes an event with an optional body. All subscribed callbacks for that event will be executed with the provided body.

## Usage

### 1. Installation

```bash
npm install @kozmonot/pubsub-manager
# or
yarn add @kozmonot/pubsub-manager
```

### 2. Importing

```typescript
import { pubSub } from '@kozmonot/pubsub-manager';
```

or in JavaScript:

```javascript
import { pubSub } from '@kozmonot/pubsub-manager';
```

## Integration with React

### Subscribing in React Components

You can subscribe to events within your React components, typically in the `useEffect` hook to manage the subscription lifecycle.

```jsx
import React, { useEffect } from 'react';
import { pubSub } from '@kozmonot/pubsub-manager';

interface MyData {
    message: string;
}

interface IPubSubModel {
    'data-updated': MyData;
    'user-logged-in': { userId: string };
    // Add other event types and their corresponding body types here
}

function MyComponent() {
    useEffect(() => {
        const subscription = pubSub.subscribe<'data-updated'>('data-updated', (data) => {
            console.log('Data updated:', data.message);
            // Update your component state here
        });

        // Don't forget to unsubscribe when the component unmounts!
        return () => {
            subscription.unSubscribe();
            console.log('Unsubscribed from data-updated');
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    return (
        <div>
            {/* Your component's JSX */}
        </div>
    );
}

export default MyComponent;
```

**Important: Unsubscribing on Unmount**

It is **crucial** to call the `unSubscribe()` method in the cleanup function of your `useEffect` hook. This prevents memory leaks and unexpected behavior by ensuring that the callback is no longer executed after the component has been unmounted.

### Publishing Events from React Components

You can publish events from anywhere within your React components:

```jsx
import React from 'react';
import { pubSub } from '@kozmonot/pubsub-manager';

function MyButton() {
    const handleClick = () => {
        pubSub.publish<'data-updated'>('data-updated', { message: 'New data available!' });
    };

    return (
        <button onClick={handleClick}>Publish Update</button>
    );
}

export default MyButton;
```

## Integration with Vanilla JavaScript

### Subscribing in Vanilla JavaScript

You can subscribe to events in your Vanilla JavaScript code:

```javascript
import { pubSub } from '@kozmonot/pubsub-manager';

pubSub.subscribe('user-logged-in', (userData) => {
    console.log('User logged in:', userData.userId);
    // Perform actions based on user login
});

// Store the unsubscribe function if you need to unsubscribe later
const dataSubscription = pubSub.subscribe('data-updated', (data) => {
    console.log('Vanilla JS: Data updated:', data.message);
});

// To unsubscribe later:
// dataSubscription.unSubscribe();
```

### Publishing Events from Vanilla JavaScript

Publishing events from Vanilla JavaScript is straightforward:

```javascript
import { pubSub } from '@kozmonot/pubsub-manager';

// Simulate an event occurring
setTimeout(() => {
    pubSub.publish('user-logged-in', { userId: '123' });
}, 2000);

// Publish another event
pubSub.publish('data-updated', { message: 'Initial data loaded.' });
```

## `IPubSubModel` Interface

The `IPubSubModel` interface (as defined in your TypeScript code) is essential for type safety when using TypeScript. It defines the available event names and the expected structure of the data (body) associated with each event.

```typescript
interface IPubSubModel {
    'data-updated': { message: string };
    'user-logged-in': { userId: string };
    // Add all your event types and their corresponding body types here
}
```

Make sure to keep this interface updated with all the events you intend to use in your application.

## Benefits of using PubSub

-   **Decoupling:** Components or modules can communicate without having direct dependencies on each other.
-   **Scalability:** Easier to add or modify features without affecting other parts of the application.
-   **Maintainability:** Code becomes more organized and easier to understand.

## Considerations

-   **Global State:** While PubSub can help manage communication, for complex state management in React, consider dedicated state management libraries like Redux, Zustand, or Recoil.
-   **Over-publishing:** Be mindful of publishing too many events, which can potentially lead to performance issues if many listeners are involved.

This `README.md` provides a good starting point for understanding and using the `@kozmonot/pubsub-manager` package in both React and Vanilla JavaScript environments. Remember to adjust the event types according to your specific application needs.
```