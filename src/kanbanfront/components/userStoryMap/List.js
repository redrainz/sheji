/*eslint-disable*/
import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { observer } from 'mobx-react';
import Card from './Card';
import AddCard from './AddCard';
import StoryLine from './StoryLine';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
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
export default class List extends Component {
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
      parentId,
    } = this.props;
    // console.log(data.length);
    let heights = UserStoryStore.getHeights;
    const len = heights.length;
    let cards = [];
    // while()
    return (
      <div style={styles.line}>
        {data.length > 0
          ? data.map((one, i) => (
              <StoryLine
                type={type}
                height={heights.length > 0 ? heights[i] : 0}
                data={one}
                key={one.id}
                parentId={parentId}
                index={index}
                column={column}
                taskindex={taskindex}
                storyindex={storyindex}
                storygroup={i}
                islast={i === data.length - 1}
                description={one.description}
                style={styles.story}
              />
            ))
          : null}
      </div>
    );
  }
}
