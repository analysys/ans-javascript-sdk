
const dataBase = 'ANALYSYS_AGENT'
const tableName = 'FZ_STORAGE'

class IndexedDb {
  constructor () {
    this.open()
  };

  db: IDBDatabase;

  isOpen: boolean = false;

  // 打开数据库
  open() {
    const request = window.indexedDB.open(dataBase)
    request.onsuccess = (event) => {
      this.db = request.result;
      this.onConnectSuccess && this.onConnectSuccess(this.db)
      this.isOpen = true
    };
    request.onerror = (event) => {
      this.onConnectError && this.onConnectError(event)
    }
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { keyPath: 'id' });
      }
    }
  };

  // 数据库连接成功
  onConnectSuccess: Function;

  // 数据库连接失败
  onConnectError: Function;

  getObjectStore () {
    return this.db.transaction(tableName, 'readwrite').objectStore(tableName)
  };

  // 读取数据
  get (successFn?: Function, errorFn?: Function) {
    const objectStore = this.db.transaction(tableName).objectStore(tableName)
    const request = objectStore.get(1)

    request.onsuccess = (event: any) => {
      successFn && successFn(request.result)
    }

    request.onerror = (event) => {
      errorFn && errorFn(event)
    };
  };

  // 添加数据
  add (data: object, successFn?: Function, errorFn?: Function) {
    const request = this.getObjectStore().add(data)
    request.onsuccess = function (event) {
      successFn && successFn(event)
    };
  
    request.onerror = function (event) {
      errorFn && errorFn(event)
    }
  };

  // 删除数据
  delete () {
    const request = this.getObjectStore().delete(1);
    request.onsuccess = function (event) {
    };
  };

  // 更新数据
  put (data: object, successFn?: Function, errorFn?: Function) {
    const request = this.getObjectStore().put(data);

    request.onsuccess = function (event) {
      successFn && successFn()
    };
  
    request.onerror = function (event) {
      errorFn && errorFn()
    }
  };
}

export default IndexedDb