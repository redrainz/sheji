/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Line from './Line';
import List from './List';
import StoryLine from './StoryLine';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
// import UserColumn from '../../../components/userStoryMap/UserColumn';

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    // borderRight: '2px dashed #bebdbd',
    // borderLeft: '2px dashed #bebdbd',
    // margin: '0 -1px 0 -1px',
    // borderImage: `${banner} 30 30 round`,
  },
  epic: {
    backgroundColor: '#f27788',
  },
  feature: {
    backgroundColor: '#ff9e4a',
  },
  story: {
    backgroundColor: '#fff9b2',
  },
};
@observer
export default class Item extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.config);
    this.flag = 0;
  }
  render() {
    const { userdata, activitydata, taskdata, index, parentId } = this.props;
    console.log(activitydata);
    const data = UserStoryStore.getUserStoryData;
    let empty = [];
    if (data.ReleasePlan) {
      empty = Array(data.ReleasePlan.length).fill([]);
    }

    const a = parentId;
    if (activitydata) {
      console.log(activitydata.length);
      return (
        <div style={styles.item}>
          <Line
            type="user"
            key="user"
            index={this.props.index}
            cardStyle={styles.epic}
            data={[userdata]}
          />
          <Line
            type="activity"
            key="activity"
            index={this.props.index}
            cardStyle={styles.epic}
            data={activitydata}
          />
          <Line
            type="task"
            key="task"
            index={this.props.index}
            cardStyle={styles.feature}
            parentId={this.props.parentId}
            data={taskdata}
          />
{/* 
          <div style={{ display: 'flex' }}>
            {activitydata == undefined ||
            activitydata[0] == undefined ||
            activitydata[0].id == undefined
              ? [{ issues: empty }].map((one, i) => (
                  <List
                    type="story"
                    index={index}
                    // key={Math.random()}
                    data={one.issues}
                    isChoosing={this.props.isChoosing}
                  />
                ))
              : activitydata.map((one, i) => (
                  <List
                    type="story"
                    index={index}
                    column={i}
                    parentId={one.id}
                    // key={Math.random()}
                    data={one.issues}
                    isChoosing={this.props.isChoosing}
                  />
                ))}
          </div> */}
        </div>
      );
    } else {
      return null;
    }
  }
}
