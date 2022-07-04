export interface DB<T> {
    list: () => Promise<Record<string, T>>;
    insert: (val: T) => Promise<string>;
    delete: (id: string) => Promise<void>;
}
