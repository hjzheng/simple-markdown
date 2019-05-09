import { observable, action } from 'mobx'
const getBodyRect = () => document.body.getBoundingClientRect()

class ContextMenuController {
  @observable left = 0
  @observable top = 0
  @observable visible = false
  @observable actions = []

  @action
  show({
    actions,
    left,
    top
  }) {
    this.actions = actions
    this.visible = true
    this.setPosition(left, top)
  }

  @action
  hide() {
    this.visible = false
  }

  setPosition(left, top) {
    // 当用户点击桌面最右侧或最底部的时候，需要做修正，使得菜单可以显示全
    this.left = Math.min(left, getBodyRect().width - 120)
    this.top = Math.min(top, getBodyRect().height - this.actions.length * 30 - 2)
  }
}

export default new ContextMenuController()
