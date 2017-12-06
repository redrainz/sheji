/*eslint-disable*/
import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { observer } from 'mobx-react';
import Card from './Card';
import AddCard from './AddCard';
import WhiteCard from './WhiteCard';
const styles = {
  line: {
    display: 'flex',
    background: 'rgba(230,230,230,0.25)',
  },
};
@observer
export default class Line extends Component {
  // constructor(props) {
  //   super(props);
  //   // console.log(this.props.fatureLength);
  // }
  render() {
    const { data, type, index, column, taskindex, parentId } = this.props;
    if (data) {
      // console.log(data.length);
    }
    return (
      <div
        style={{
          ...styles.line,
          ...{
            borderTop:
              this.props.type === 'user' ? 'none' : '1px dashed #bebdbd',
            paddingBottom: this.props.type === 'task' ? '10px' : 'none',
          },
        }}
      >
        {data.map(
          (one, i) =>
            one.description != null ? (
              <Card
                type={type}
                storynum={one.storynum}
                parentId={parentId}
                id={one.id}
                preId={one.preId}
                nextId={one.nextId}
                key={one.id}
                index={index}
                column={column}
                taskindex={taskindex}
                description={one.description}
                style={this.props.cardStyle}
              />
            ) : (
              <AddCard
                type={type}
                description={`增加${type}`}
                parentId={parentId}
                index={index}
                column={column}
                taskindex={taskindex}
              />
            ),
        )}
      </div>
    );
  }
}
