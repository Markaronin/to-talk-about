export function notNull<T>(val: T | null): T {
    if (val === null) {
        throw `We expected val not to be null, but it was`;
    }
    return val;
}
