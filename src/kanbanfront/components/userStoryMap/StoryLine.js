/*eslint-disable*/
import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { observer } from 'mobx-react';
import List from './List';
import Card from './Card';
import AddCard from './AddCard';
import WhiteCard from './WhiteCard';
import StoryCard from './StoryCard';
const styles = {
  line: {
    display: 'flex',
    flexDirection: 'column',
  },
  story: {
    backgroundColor: '#fff9b2',
  },
};
@observer
export default class StoryLine extends Component {
  // constructor(props) {
  //   super(props);
  //   // console.log(this.props.fatureLength);
  // }
  render() {
    const {
      data,
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      parentId,
    } = this.props;
    let { height } = this.props;
    // console.log(data.length, height);
    height -= data.length;
    var whites = [
      <Draggable draggableId={Math.random()} type="MMA">
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              style={provided.draggableStyle}
              {...provided.dragHandleProps}
            >
              <AddCard
                type="story"
                description="添加story"
                index={index}
                column={column}
                taskindex={taskindex}
                storyindex={storyindex}
                storygroup={storygroup}
                parentId={parentId}
              />
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>,
    ];
    while (height > 1) {
      whites.push(<WhiteCard />);
      height -= 1;
    }
    return (
      <Droppable
        droppableId={JSON.stringify({
          index: index,
          column: column,
          taskindex: taskindex,
          storyindex: storyindex,
          storygroup: storygroup,
          parentId: parentId,
        })}
        type="MMA"
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={{
              ...styles.line,
              ...{
                borderBottom: this.props.islast ? 'none' : '1px dashed #bebdbd',
              },
            }}
          >
            {data.map((one, i) => (
              <Draggable draggableId={one.id} type="MMA">
                {(provided, snapshot) => (
                  <div>
                    <div
                      ref={provided.innerRef}
                      style={{
                        ...provided.draggableStyle,
                        ...{ outline: 'none' },
                      }}
                      {...provided.dragHandleProps}
                    >
                      <StoryCard
                        type="story"
                        description={one.description}
                        index={index}
                        column={column}
                        taskindex={taskindex}
                        storyindex={storyindex}
                        storygroup={storygroup}
                        position={i}
                        status={one.status}
                        parentId={parentId}
                        sprintId={one.sprintId}
                        key={one.id}
                        id={one.id}
                        data={one}
                        style={styles.story}
                      />
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {whites}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
