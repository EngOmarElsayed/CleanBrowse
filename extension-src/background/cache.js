export class VerdictCache {
  #map = new Map();
  #maxSize;

  constructor(maxSize = 5000) {
    this.#maxSize = maxSize;
  }

  get(url) {
    if (!this.#map.has(url)) return undefined;
    const score = this.#map.get(url);
    this.#map.delete(url);
    this.#map.set(url, score);
    return score;
  }

  set(url, score) {
    this.#map.delete(url);
    this.#map.set(url, score);
    if (this.#map.size > this.#maxSize) {
      this.#map.delete(this.#map.keys().next().value);
    }
  }
}
