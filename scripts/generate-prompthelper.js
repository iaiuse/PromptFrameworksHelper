const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const frameworksDir = './frameworks';
const outputFile = './prompthelper.js';
const frameworks = [];

// Read each file in the frameworks directory
fs.readdirSync(frameworksDir).forEach(file => {
  if (path.extname(file) === '.yml') {
    const yamlContent = fs.readFileSync(path.join(frameworksDir, file), 'utf8');
    // 解析YAML内容
    const parsedYaml = yaml.load(yamlContent);

    // 转换fields数组中每个项的处理
    const fieldsTransformed = parsedYaml.fields.map(field => {
        const key = Object.keys(field)[0]; // 比如 "Role"
        const value = field[key]; // 包含 text, default, type 等
    
        // 创建一个新对象，将原始值直接赋值
        const newField = {
            [key]: {
                ...value, // 直接展开原对象
            }
        };
    
        // 如果原始text是数组，直接保留为数组，如果是文本，也直接保留
        if (value.text) newField[key].text = value.text;
        // 类似地处理default和type
        if (value.default) newField[key].default = value.default;
        if (value.type) newField[key].type = value.type;
        if (value.info) newField[key].info = value.info;
    
        return newField;
    });

    
    // 转换YAML内容到期望的JSON结构
    const jsonStructure = {
      [parsedYaml.name]: {
        "name": `${parsedYaml.name}框架`,
        "author": parsedYaml.author,
        "description": parsedYaml.description,
        "fields": fieldsTransformed
      }
    };
    // 准备要插入到JS文件中的字符串
    const jsonString = JSON.stringify(jsonStructure, null, 2);
    frameworks.push(JSON.parse(jsonString));
  }
});

// Load the existing prompthelper.js content
let outputContent = fs.readFileSync(outputFile, 'utf8');

// Replace the content between the special markers
const startMarker = '// START FRAMEWORKS';
const endMarker = '// END FRAMEWORKS';
const startIndex = outputContent.indexOf(startMarker) + startMarker.length;
const endIndex = outputContent.indexOf(endMarker);

if (startIndex > -1 && endIndex > -1) {
  outputContent = outputContent.substring(0, startIndex) +
    `\nvar frameworks = ${JSON.stringify(frameworks, null, 2)};\n` +
    outputContent.substring(endIndex);
}

// Write back to prompthelper.js
fs.writeFileSync(outputFile, outputContent);
