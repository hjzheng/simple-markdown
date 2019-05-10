import nanoid from 'nanoid';
import { observable, action } from 'mobx';

import Tree from './Tree';

import BaseFile from './BaseFile';

export default class BaseDirectory extends Tree {
    isFile = false
    @observable originId = ''
    @observable name = ''
    @observable path = ''
    @observable type = 'FOLDER'
    @observable size
    @observable parent = null
    @observable childrenMap = new Map()
    @observable modifiedTime = ''

    constructor(props = {}) {
        super();
        this.update(props);
    }
}