export function notNull<T>(val: T | null): T {
    if (val === null) {
        throw `We expected val not to be null, but it was`;
    }
    return val;
}

export function notUndefined<T>(val: T | undefined): T {
    if (val === undefined) {
        throw `We expected val not to be undefined, but it was`;
    }
    return val;
}
