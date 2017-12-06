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
    marginTop: '10px',
  },
  story: {
    backgroundColor: '#C2E1F5',
  },
};
@observer
export default class StoryList extends Component {
  // constructor(props) {
  //   super(props);
  //   // console.log(this.props.fatureLength);
  // }
  render() {
    const {
      data,
      height,
      type,
      index,
      column,
      taskindex,
      storyindex,
      storygroup,
      parentId,
    } = this.props;
    // let { height } = this.props;
    // console.log(height);
    // height -= data.length;
    //当不存在分组时显示一行用于添加story
    let real = isNaN(height) ? 1 : height;
    let whites = [];
    for (let i = 0; i < real; i++) {
      whites.push(
        <AddCard
          type="story"
          description="添加story"
          index={index}
          column={column}
          taskindex={taskindex}
          storyindex={storyindex}
          storygroup={storygroup}
          position={i}
          parentId={parentId}
        />,
      );
    }
    data.forEach((one, i) => {
      whites[one.storyMapSequence] = (
        <StoryCard
          type="story"
          description={one.description}
          index={index}
          column={column}
          taskindex={taskindex}
          storyindex={storyindex}
          storygroup={storygroup}
          position={one.storyMapSequence}
          status={one.status}
          parentId={parentId}
          sprintId={one.sprintId}
          key={one.id}
          id={one.id}
          data={one}
          style={styles.story}
        />
      );
    });
    // while (height > 1) {
    //   whites.push(<WhiteCard />);
    //   height -= 1;
    // }
    return this.props.num > 1 && data.length === 0 ? null : (
      <div style={styles.line}>{whites}</div>
    );
  }
}
