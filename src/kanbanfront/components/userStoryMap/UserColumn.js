/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Line from './Line';
import List from './List';
import StoryLine from './StoryLine';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import ActivityColumn from './ActivityColumn';

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '2px dashed #D3D3D3',
  },
  user: {
    backgroundColor: '#C0BDEC',
  },
};
@observer
export default class UserColumn extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.config);
    this.flag = 0;
  }
  render() {
    const { userdata, index, parentId } = this.props;
    // console.log(activitydata);
    const activitydata = userdata.subIssue || [];
    const data = UserStoryStore.getUserStoryData;
    let empty = [];
    // if (data.ReleasePlan) {
    //   empty = Array(data.ReleasePlan.length).fill([]);
    // }

    // const a = parentId;
    console.log(activitydata.length);
    let isempty = activitydata.length === 0;
    return (
      <div style={styles.item}>
        <Line
          type="user"
          key="user"
          index={this.props.index}
          cardStyle={styles.user}
          data={[userdata]}
        />
        <div style={{ display: 'flex' }}>
          {isempty ? (
            <ActivityColumn
              type="activity"
              key={Math.random()}
              islast={true}
              isfirst={this.props.isfirst}
              index={this.props.index}
              column={0}
              parentId={parentId}
              cardStyle={styles.user}
              data={{ id: null, subIssue: [], description: null }}
            />
          ) : (
            activitydata.map((one, i) => (
              <ActivityColumn
                type="activity"
                key={Math.random()}
                islast={i === activitydata.length - 1}
                isfirst={this.props.isfirst && i === 0}
                index={this.props.index}
                column={i}
                parentId={parentId}
                cardStyle={styles.user}
                data={one}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}
