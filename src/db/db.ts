export interface DB<T> {
    list: () => Promise<Record<string, T>>;
    insert: (val: T) => Promise<string>;
    delete: (id: string) => Promise<void>;
    update: (id: string, val: T) => Promise<void>;
    get: (id: string) => Promise<T | undefined>;
}
