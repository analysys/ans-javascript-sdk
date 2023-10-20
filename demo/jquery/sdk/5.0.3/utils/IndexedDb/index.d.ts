declare class IndexedDb {
    constructor();
    db: IDBDatabase;
    isOpen: boolean;
    open(): void;
    onConnectSuccess: Function;
    onConnectError: Function;
    getObjectStore(): IDBObjectStore;
    get(successFn?: Function, errorFn?: Function): void;
    add(data: object, successFn?: Function, errorFn?: Function): void;
    delete(): void;
    put(data: object, successFn?: Function, errorFn?: Function): void;
}
export default IndexedDb;
//# sourceMappingURL=index.d.ts.map