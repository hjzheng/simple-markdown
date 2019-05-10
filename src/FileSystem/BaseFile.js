import nanoid from 'nanoid';
import { observable, action } from 'mobx';

export default class BaseFile {
    isFile = true
    id = ''
    @observable originId = ''
    @observable type = ''
    @observable name = ''
    @observable path = ''
    @observable size = ''
    @observable parent = ''
    @observable modifiedTime = ''

    constructor(props = {}) {
        this.update(props)
        this.id = nanoid();
    }

    @action
    update = (props = {}) => {
        this.originId = props.id;
        delete props.id
        Object.assign(this, props);
    } 

    getContent() {
        throw new Error('abstract function getContent should be overridden');
    }
}