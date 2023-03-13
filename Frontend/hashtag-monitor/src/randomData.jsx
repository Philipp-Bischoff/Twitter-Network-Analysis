export function genRandomTree (N = 300, reverse = false) {
  return {
    nodes: [...Array.from(N)].map(i => ({ id: i })),
    links: [...Array.from(N)]
      .filter(id => id)
      .map(id => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
      }))
  }
}
