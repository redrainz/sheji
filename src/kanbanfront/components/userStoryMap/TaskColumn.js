/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Line from './Line';
import List from './List';
import StoryLine from './StoryLine';
import StoryGroup from './StoryGroup';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
const styles = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    // borderRight: '1px dashed #bebdbd',
    // borderLeft: '2px dashed #bebdbd',
    // margin: '0 0 0 -2px',
    // borderImage: `${banner} 30 30 round`,
  },

  task: {
    backgroundColor: '#FFC1C1',
  },
};
@observer
export default class TaskColumn extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.config);
    this.flag = 0;
  }
  render() {
    let { data, index, column, taskindex, type, parentId } = this.props;
    const heights = UserStoryStore.getHeights;
    console.log(heights);
    // console.log(activitydata);
    // const data = UserStoryStore.getUserStoryData;
    // let empty = [];
    // if (data.ReleasePlan) {
    //   empty = Array(data.ReleasePlan.length).fill([]);
    // }

    // const a = parentId;
    if (data) {
      let empty = Array(heights.length - data.story.length).fill([]);
      empty = data.story.concat(empty);
      // console.log(empty);
      // if (heights.length === 0) {
      //   console.log('空story');
      //   empty = Array(1).fill([]);
      //   console.log(empty);
      // }

      
      //当task没有story时，保证story空位渲染
      // data.storys = data.storys.length === 0 ? empty : data.storys;
      // console.log(data);
      return (
        <div
          style={{
            ...styles.item,
            ...{
              borderRight: this.props.islast ? 'none' : '1px dashed #bebdbd',
            },
          }}
        >
          <Line
            type="task"
            key="task"
            index={this.props.index}
            column={column}
            taskindex={taskindex}
            parentId={parentId}
            cardStyle={styles.task}
            data={[data]}
          />
          {empty.map((one, i) => (
            <StoryGroup
              type="story"
              height={heights[i]}
              key={Math.random()}
              index={this.props.index}
              column={column}
              taskindex={taskindex}
              storygroup={i}
              isfirst={this.props.isfirst}
              islast={i === empty.length - 1}
              parentId={data.id}
              data={one}
            />
          ))}
        </div>
      );
    } else {
      return null;
    }
  }
}
