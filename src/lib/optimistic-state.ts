export class OptimisticStateContainer<T> {
  private state: T;
  private pendingUpdates: Array<(current: T) => T> = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  public get(): T {
    let result = this.state;
    for (const update of this.pendingUpdates) {
      result = update(result);
    }
    return result;
  }

  public applyOptimistic(update: (current: T) => T): () => void {
    this.pendingUpdates.push(update);
    return () => {
      const idx = this.pendingUpdates.indexOf(update);
      if (idx !== -1) this.pendingUpdates.splice(idx, 1);
    };
  }

  public commit(newState: T): void {
    this.state = newState;
    this.pendingUpdates = [];
  }
}
