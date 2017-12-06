/**
 * Created by Yu Zhang on 2017/10/9.
 */
/*eslint-disable*/
export function Transfrom(value) {
  var data = value;
  data.oldEndTime = value.endTime;
  data.oldStartTime = value.startTime;
  data.endTime = formDate(value.endTime);
  data.createTime = value.startTime;
  data.startTime = formDate(value.startTime);
  data.oldStatus = value.status;
  data.oldStatus2 = "未开启";
  switch (data.status) {
    case "doing": {
      data.status = true;
      data.oldStatus2 = "开启";
      break;
    }
    case "done": {
      data.status = false;
      data.oldStatus2 = "关闭";
      break;
    }
    default : {
      data.status = false;
      data.oldStatus2 = "未开启";
      break;
    }
  }
  data.endStory = 0;
  data.storyIssue = 0;
  data.workload = 0;
  data.storyPoint = 0;
  data.bug = 0;
  data.endBug = 0;
  data.issueLength = value.issue.length;
  if (value.issue)
    for (let j = 0; j < value.issue.length; j += 1) {
      data.issue[j].issueId = "#" + value.issue[j].issueId;
      data.issue[j].startTime = formDate(value.issue[j].startTime);
      data.issue[j].deadline = formDate(value.issue[j].deadline);
      data.storyPoint += data.issue[j].storyPoint;
      data.workload += data.issue[j].workload;
      if (value.issue[j].issueType == "story") {
        data.storyIssue++;
        if (value.issue[j].status == "done")
          data.endStory += 1;
      }
      if (value.issue[j].bugType) {
        data.bug += 1;
        if (value.issue[j].status == "done")
          data.endBug += 1;
      }


    }
  data.issue = ListToTree(data.issue);
  return data;
}

function formDate(data) {
  let temp = new Date(data);
  return temp.getFullYear() + "-" + (temp.getMonth() + 1) + "-" + temp.getDate();
}


export function ListToTree(data) {
  let value = [];
  if (data)
    for (let i = 0; i < data.length; i++) {

      for (let j = 0; j < data.length; j++) {
        if (data[j].parentId == data[i].id) {
          if (!data[i].children)
            data[i].children = [];
          data[i].children.push(data[j]);
        }

      }
      if (data[i].issueType == "UserStory")
        value.push(data[i]);
    }

  return value;

}
