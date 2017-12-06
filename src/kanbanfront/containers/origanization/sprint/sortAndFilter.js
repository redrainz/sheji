/**
 * Created by Yu Zhang on 2017/10/9.
 */
/*eslint-disable*/

//ascending 升序
//descending 降序
export function quickSort(array,key,sortRule) {
    var temp;
    for(var i=0;i<array.length;i++){
        for(var j=1;j<array.length;j++){
          if(sortRule=="ascending"){
            if (compare(array[j],array[j-1],key)) {
              temp=array[j];
              array[j]=array[j-1]; 
              array[j-1]=temp;
            }
          }
          else {
            if (compare(array[j-1],array[j],key)) {
              temp=array[j];
              array[j]=array[j-1];
              array[j-1]=temp;
            }
          }
    }
    }
    return array;
}

function compare(x,y, key) {
    switch(key){
        case "createTime": 
            if(x.createTime<y.createTime)
                return true;
            else return false;
        case "releasePlaneId":
            if(x.releasePlanId<y.releasePlanId)
                return true;
            else return false;
        case "status":
            switch(x.oldStatus){
                case "todo":x.statusInt=1;break;
                case "doing":x.statusInt=2;break;
                case "done":x.statusInt=3;break;
                default:x.statusInt=1;break;
            };
            switch(y.oldStatus){
                case "todo":y.statusInt=1;break;
                case "doing":y.statusInt=2;break;
                case "done":y.statusInt=3;break;
                default:y.statusInt=1;break;
            }
            if(x.statusInt<y.statusInt)
                return true;
            else return false;
    }
}

export function filter(array,status,releasePlaneName,name,startTime,endTime){
  var value=[];
  for(var i=0;i<array.length;i++){
    if(status==null || array[i].oldStatus==status)
      if(releasePlaneName==null || array[i].releasePlaneName==releasePlaneName)
        if(name==null || array[i].name==name)
          if(startTime==null || array[i].oldStartTime>=startTime)
            if(endTime==null || array[i].oldEndTime<=endTime){
              value.push(array[i]);
            }
  }
  return value;
}
