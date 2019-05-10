import nanoid from 'nanoid';
import { observable, action } from 'mobx';

export default class Tree {
    id = nanoid()
    isTree = true
    @observable parent = null
    @observable childrenMap = new Map()

    get children() {
        return [...this.childrenMap.values()];
    }

    set children(children) {
        this.childrenMap = new Map(
            children.map(child => {
                child.parent = this;
                return [child.id, child];
            })
        )
    }

    @action
    clear() {
        this.childrenMap.clear();
    }

    @action
    add(treeNode) {
        treeNode.parent = this;
        this.childrenMap.add(treeNode.id, treeNode);
    }

    filterFisrtNode(filter, {depthFirst = true, self = true}) {
        return this.tapFistNodes(filter, () => {}, {depthFirst, self});
    }

    filterNodes(filter, {depthFirst = true, self = true}) {
        return this.tapNodes(filter, () => {}, {depthFirst, self});
    }

    @action 
    removeFirstNode(filter, {depthFirst = true, self = true}) {
        this.tapFirstNode(filter, (node) => {
            if (node.parent) {
                const { childrenMap } = node.parent;
                childrenMap.delete(node.id);
            }
        }, {depthFirst, self})
    }

    @action 
    removeNodes(filter, {depthFirst = true, self = true}) {
        this.tapNodes(filter, (node) => {
            if (node.parent) {
                const { childrenMap } = node.parent;
                childrenMap.delete(node.id);
            }
        }, {depthFirst, self})
    }



    @action
    tapFirstNode(filter, operate, {depthFirst = true, self = true}) {
        let tappedNode = null;
        if (self) {
            if (filter(this)) {
                operate(this)
                return this;
            }
        }

        if (depthFirst) {
            this.children.every(node => {
                const flag = filter(node);
                if (flag) {
                    operate(node)
                    tappedNode = node;
                    return false;
                } else if (node.isTree) {
                    tappedNode = node.tapFirstNode(filter, operate, { self: false});
                    if (tappedNode) {
                        return false;
                    }
                }

                // go on
                return true;
            })
        } else {
            let queue = this.children;
            while (queue.length > 0) {
                const node = queue.pop();
                const flag = filter(node);
                if (flag) {
                    operate(node);
                    tappedNode = node;
                    break;
                } else if (node.isTree) {
                    queue = queue.concat(node.children);
                }
            }
        }
    }

    /**
     * @method tapNodes
     * @param {function} filter 判断 
     * @param {*} operate 操作
     * @param {*} options { depthFirst = true, self = true }
     */

    @action
    tapNodes(filter, operate, {depthFirst = true, self = true}) {

        let tappedNodes = [];
        if (self) {
            if(filter(this)) {
                tappedNodes.push(this)
                operate(this);
            }
        }

        if (depthFirst) {
            for (let treeNode of this.children) {
                const flag = filter(treeNode);
                if (flag) {
                    tappedNodes.push(treeNode)
                    operate(treeNode)
                }

                if (treeNode.isTree) {
                    tappedNodes = [
                        ...tappedNodes,
                        ...treeNode.tapNodes(filter, operate, {self: false})
                    ]
                }
            }
        } else {
            let queue = this.children;
            while (queue.length > 0) {
                const node = queue.pop();
                if (filter(node)) {
                    tappedNodes.push(node);
                    if (operate(node)) {
                        break;
                    }
                }
                if (node.isTree) {
                    queue = queue.concat(node.children);
                }
            }
        }

        return tappedNodes;
    }
}