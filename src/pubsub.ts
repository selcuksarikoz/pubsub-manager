export class PubSub {

    private _listeners = {} as { [K in keyof IPubSubModel]: any[] };

    public subscribe<T extends keyof IPubSubModel>(
        event: T,
        cb: (body: IPubSubModel[T]) => void,
    ) {
        if (this._listeners[event]) {
            this._listeners[event].push(cb);
        } else {
            this._listeners[event] = [cb] as any;
        }

        return {
            unSubscribe: () => {
                const funcs = this._listeners[event] as object[];
                const idx = funcs.indexOf(cb);
                if (idx > -1) {
                    funcs.splice(idx, 1);
                }
            },
        };
    }

    public publish<T extends keyof IPubSubModel>(
        event: T,
        body: IPubSubModel[T],
    ) {
        const funcs = this._listeners[event];
        if (!funcs?.length) return;
        funcs.forEach((fn) => fn(body));
    }
}
