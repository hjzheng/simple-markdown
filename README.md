## DND Example

### learn DND

#### API

```js
<DragDropContext /> 
<Droppable /> 
<Draggable /> 
```

#### ```<DragDropContext />```

四个方法:
```
onBeforeDragStart?: OnBeforeDragStartResponder,
onDragStart?: OnDragStartResponder,
onDragUpdate?: OnDragUpdateResponder,
// required
onDragEnd: OnDragEndResponder,
```

方法中参数的含义: App.js 中的注释

#### ```<Droppable />```

[详解](https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/droppable.md)

可以参考 Column.js

#### ```<Draggable />```

[详解](https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/draggable.md)

可以参考 Task.js
