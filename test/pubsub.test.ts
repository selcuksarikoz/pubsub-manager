import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PubSub } from "../src/pubsub";

interface IPubSubModel {
    'user:created': { id: number; name: string };
    'article:published': { title: string; content: string };
    'notification:new': string;
}

describe('PubSub', () => {
    let pubsub: PubSub;

    beforeEach(() => {
        pubsub = new PubSub();
    });

    it('should allow subscribing to an event and receiving published data', () => {
        const callback = vi.fn();
        pubsub.subscribe('user:created', callback);

        const userData = {id: 1, name: 'John Doe'};
        pubsub.publish('user:created', userData);

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(userData);
    });

    it('should allow multiple subscribers to the same event and all receive published data', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        pubsub.subscribe('article:published', callback1);
        pubsub.subscribe('article:published', callback2);

        const articleData = {title: 'My Article', content: '...'};
        pubsub.publish('article:published', articleData);

        expect(callback1).toHaveBeenCalledOnce();
        expect(callback1).toHaveBeenCalledWith(articleData);
        expect(callback2).toHaveBeenCalledOnce();
        expect(callback2).toHaveBeenCalledWith(articleData);
    });

    it('should not call subscribers of a different event', () => {
        const userCallback = vi.fn();
        const articleCallback = vi.fn();
        pubsub.subscribe('user:created', userCallback);
        pubsub.subscribe('article:published', articleCallback);

        const articleData = {title: 'Another Article', content: '...'};
        pubsub.publish('article:published', articleData);

        expect(userCallback).not.toHaveBeenCalled();
        expect(articleCallback).toHaveBeenCalledOnce();
        expect(articleCallback).toHaveBeenCalledWith(articleData);
    });

    it('should allow unsubscribing from an event and not receive subsequent publications', () => {
        const callback = vi.fn();
        const subscription = pubsub.subscribe('notification:new', callback);

        pubsub.publish('notification:new', 'First notification');
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('First notification');

        subscription.unSubscribe();
        pubsub.publish('notification:new', 'Second notification');
        expect(callback).toHaveBeenCalledOnce();
    });

    it('should not throw an error if trying to unsubscribe an already unsubscribed callback', () => {
        const callback = vi.fn();
        const subscription = pubsub.subscribe('user:created', callback);
        subscription.unSubscribe();
        expect(() => subscription.unSubscribe()).not.toThrow();
    });

    it('should not call any functions if there are no subscribers for an event', () => {
        const callback = vi.fn();
        pubsub.publish('article:published', {title: 'Test', content: '...'});
        expect(callback).not.toHaveBeenCalled();
    });
});