import { cloneDeep } from 'es-toolkit'

/**
 * 列表转树形
 * @param list
 */
export function listToTree<T extends Record<string, any>>(list: T[]) {
  const map = new Map()
  const tree: Array<T & { children?: T[] }> = []
  const cloneList = cloneDeep(list)

  cloneList.forEach((item) => {
    map.set(item.id, item)
  })

  cloneList.forEach((item) => {
    const parent = map.get(item.parentId)
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    }
    else {
      tree.push(item)
    }
  })

  return tree
}

/**
 * 树形转列表
 * @param tree
 */
export function treeToList<T extends Record<string, any>>(tree: T[]) {
  const list: T[] = []
  const stack = [...tree]

  while (stack.length) {
    const node = stack.shift()
    if (node.children) {
      stack.unshift(...node.children)
      delete node.children
    }
    list.push(node)
  }

  return list
}
