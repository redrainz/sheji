var traversefolder = require('./traverseFolder');
var fs = require('fs');
const { URL } = require('url');
const path = require('path');
var dirPath = path.resolve(__dirname, './src/kanbanfront');
console.log(dirPath);
var KANBANFRONTIndex = dirPath + '/containers/KANBANFRONTIndex.js';
//先替换KANBANFRONTIndex文件
fs.readFile(
  path.resolve(__dirname, './KANBANFRONTIndex.js'),
  'utf8',
  (err, data) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(KANBANFRONTIndex, data, err => {
        if (err) {
          console.log(err);
        } else {
          console.log('替换KANBANFRONTIndex文件');
        }
      });
    }
  },
);
//遍历文件夹，替换所有改变路径
traversefolder(dirPath)
  .then(files => {
    files = files.filter(one => /(.*?)\.js$/i.test(one));
    // console.log(files);
    files.forEach(one => {
      fs.readFile(one, 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          data = data.replace(/'(.*?)\/axios'/g, match => {
            console.log('替换', match, '为', "'Axios'");
            return "'Axios'";
          });
          data = data.replace(/'(.*?)\/store'/g, match => {
            console.log('替换', match, '为', "'Store'");
            return "'Store'";
          });
          data = data.replace(/'(.*?)\/asyncRouter'/g, match => {
            console.log('替换', match, '为', "'asyncRouter'");
            return "'asyncRouter'";
          });
          // console.log(data);
          fs.writeFile(one, data, err => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });    
  })
  .catch(e => console.error(e));
