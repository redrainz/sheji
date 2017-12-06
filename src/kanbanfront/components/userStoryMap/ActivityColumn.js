/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Line from './Line';
import List from './List';
import StoryLine from './StoryLine';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import UserStoryStore from '../../stores/origanization/userStory/UserStoryStore';
import TaskColumn from './TaskColumn';
const styles = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    // borderRight: '1px dashed #bebdbd',
    // borderLeft: '2px dashed #bebdbd',
    // margin: '0 -1px 0 -1px',
    // borderImage: `${banner} 30 30 round`,
  },
  activity: {
    backgroundColor: '#F6ED8A',
  },
};
@observer
export default class ActivityColumn extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.config);
    this.flag = 0;
  }
  render() {
    const { data, index, column, type, parentId } = this.props;
    // console.log(activitydata);
    // const data = UserStoryStore.getUserStoryData;
    // let empty = [];
    // if (data.ReleasePlan) {
    //   empty = Array(data.ReleasePlan.length).fill([]);
    // }

    // const a = parentId;
    if (data) {
      console.log(data.subIssue.length);
      let isempty = data.subIssue.length === 0;
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
            type="activity"
            key="activity"
            index={this.props.index}
            parentId={parentId}
            cardStyle={styles.activity}
            column={column}
            data={[data]}
          />
          <div style={{ display: 'flex' }}>
            {isempty ? (
              <TaskColumn
                type="task"
                key={Math.random()}
                index={this.props.index}
                column={column}
                taskindex={0}
                isfirst={this.props.isfirst}
                islast={true}
                cardStyle={styles.feature}
                parentId={data.id}
                data={{
                  id: null,
                  description: null,
                  story: [],
                }}
              />
            ) : (
              data.subIssue.map((one, i) => (
                <TaskColumn
                  type="task"
                  key={Math.random()}
                  index={this.props.index}
                  column={column}
                  taskindex={i}
                  isfirst={this.props.isfirst && i === 0}
                  islast={i === data.subIssue.length - 1}
                  cardStyle={styles.feature}
                  parentId={data.id}
                  data={one}
                />
              ))
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
