# PromptFrameworksHelper

# 20240305更新
为了方便区分输入框提示信息和示例，增加了info，text可以是数组了
![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/2cb8cc3d-7645-43ac-b0df-6a9d32e180f4)
```
name: "GCSWA"
author: "小七姐"
description: 通过全局思维，整体框架来理解要解决的问题
fields:
  - Role:
      info: 角色，如学术阅读
      text: 学术阅读
  - Profile:
      info: 版本号，作者等信息
      text: 
        - "author: Arthur"
        - "version: 0.2"
        - "language: 中文"
        - "description: 使用 Unicode 符号和 Emoji 表情符号来优化排版已有信息, 提供更好的阅读体验"
  - Goals:
      info: 目标，如- 深入理解论文的主旨、关键思路和待解决问题。
      text:
        - 为用户提供更好的阅读体验，让信息更易于理解
        - 增强信息可读性，提高用户专注度
  - Constrains:
      info: 限制性条件，如 - 遵循「二八原则」进行论文总结。- 输出阅读的总结文字。
      text:
        - 不会更改原始信息，只能使用 Unicode 符号和 Emoji 表情符号进行排版
        - 排版方式不应该影响信息的本质和准确性
        - 使用 Unicode 符号和 Emoji 表情时比较克制, 每行不超过两个
  - Skills:
      info: 技能，指前面Constrains限制下的技能
      text: 
        - 熟悉各种 Unicode 符号和 Emoji 表情符号的使用方法
        - 熟练掌握排版技巧，能够根据情境使用不同的符号进行排版
        - 有非常高超的审美和文艺能力
        - 擅长使用横线分隔符优化信息展示 "━━━━━━━━━━━━━━━━━━"
  - Workflows:
      info: 工作流程
      text: 
        - 作为文字排版大师，将会在用户输入信息之后，使用 Unicode 符号和 Emoji 表情符号进行排版，提供更好的阅读体验。
        - 1. 整体信息的第一行为标题行, 对其进行线框包围, 提升阅读体验
        - 2. 信息 item 前面添加序号 Emoji, 方便用户了解信息编号
        - 3. 信息 item 前面添加一个 Emoji, 对应该信息的核心观点
        - 4. 末尾如果有链接, 则将其用线框分隔


```


# 20240229更新
为了方便添加框架，也方便使用，把框架的格式改成yaml格式，另外通过github action把yaml的内容转成json，最终合并到主代码中，创建release
```
name: "BROKE"
author: "陈财猫"
description: 通过全局思维，整体框架来理解要解决的问题
fields:
  - Background:
      text: 说明背景，为 ChatGPT 提供充足信息
  - Role:
      text: 我希望ChatGPT扮演的角色
  - Objectives:
      text: 我们希望实现什么
  - KeyResult:
      text: 我要什么具体效果试验并调整
  - Evolve:
      text: 试验并改进
```
好处是，加一个框架，它自动合并进去了

![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/b3b63371-7cab-4ef0-a25b-cd1011791e86)

更新后的安装部署方法，直接下载release里面的js文件，直接覆盖就可以了

# 缘起
用了很长一段时间gpt，学了一些框架确实有效果，但是每次写框架结构很头大。于是就想找用浏览器插件来实现。

问了一圈发现有人做了，要不要重复弄了轮子还是纠结了一下，想想要不然试试吧。

主打就是一个"简陋"。所谓`简单可依赖`

# 安装使用
## 前提是安装了 [tampermonkey](https://chromewebstore.google.com/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN)
![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/340e0097-f882-4b2a-bfe1-4515b27b6669)

## 新建空白脚本
然后随便新建一个空白的脚本
![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/4cd431de-0e46-413d-aa6e-eb52e1a86b58)

改下版本号，弄低一点，我就用0.1了，保存
![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/931c972d-e628-4897-a9c4-1b35051c3eb7)


## 修改更新源
到设置页面找更新
![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/f2842dab-68dc-4763-9dcb-edb62dfd8deb)
这里更新的逻辑是看文件里面的版本号，如果GitHub上的新，它就会更新github的

# 使用界面
右边有个浮动的小窗口，点击它就会出来，下拉框里面选择框架，最后会弄到输入框里面去
![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/2c2ce9f7-3b39-4ec1-8a82-c769fbffb6ae)


比如切换一下
![image](https://github.com/iaiuse/PromptFrameworksHelper/assets/160843322/f8b33f9e-4079-47ca-a071-a21bf82b138c)

# 如何添加框架
现在暂时采用的办法是在一个文件夹里面放了框架的结构，也就是下面这样的结构，跟着改就行了。详细的框架列表可以参考这篇文章

[Prompt提示词没那么玄乎也就是个沟通方式——慢慢学AI004](https://www.iaiuse.com/posts/aa328ac0.html)

```
{
  "name": "ICIO框架",
  "author": "Elavis Saravia",
  "description": "非常适用于根据特定指令和相关背景信息生成输出的领域",
  "fields":{
    "Instruction": {
      "text": "即你希望 AI 执行的具体任务"
    },
    "Context":{
      "text": "给AI更多的背景信息引导模型做出更贴合需求的回复"
    },
    "InputData":{
      "text": "告知模型需要处理的数据"
    },
    "OutputIndicator":{
      "text": "告知模型我们要输出的类型或风格"
    }
  }
}
```
后面空了再慢慢加吧

# 优化想法
这算是一个简单的提效工具，未必要用这些框架，比如说写小红书文案等等，涉及固定结构化的，都可以fork本库自己加就好了。

那个下拉框最好也是动态的，这样的话，这个脚本本身不太需要动，只改git上的配置文件就可以了

界面实在不擅长，只能先弄这么样
