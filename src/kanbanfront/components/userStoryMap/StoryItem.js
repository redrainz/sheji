/*eslint-disable*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Line from './Line';
import List from './List';
import StoryLine from './StoryLine';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '2px dashed #bebdbd',
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
export default class StoryItem extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.config);
    this.flag = 0;
  }
  render() {
    const { StoryData, index } = this.props;
    // console.log(FeatureData);
    return (
      <div style={styles.item}>
        {FeatureData.map(one => {
          return one.issues
            ? one.issues.map(two => (
                <StoryLine
                  type="story"
                  index={index}
                  key={Math.random()}
                  data={two}
                  isChoosing={this.props.isChoosing}
                />
              ))
            : null;
        })}
      </div>
    );
  }
}
