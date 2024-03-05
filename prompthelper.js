// ==UserScript==
// @name         ChatGPT 框架助手
// @namespace    http://tampermonkey.net/
// @version      1.0.202402232156
// @description  在ChatGPT页面侧边显示框架助手
// @author       iaiuse.com
// @match        https://chat.openai.com/*
// @icon         https://www.iaiuse.com/img/avatar.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function() {  
    'use strict';
    // 动态添加Tailwind CSS
    const tailwindLink = document.createElement('link');
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    document.head.appendChild(tailwindLink);
    // 动态添加Font Awesome
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(faLink);
    //const tailwind_css = GM_getResourceText('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    //GM_addStyle(tailwind_css);

    // 添加侧边栏样式
    GM_addStyle(`
        #frameHelper {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background-color: #f9f9f9;
            width: 50px; /* Initial width */
            height: auto;
            transition: width 0.5s;
            overflow: hidden;
            z-index: 1000;
            padding: 10px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
            border-radius: 5px 0 0 5px;
            cursor: pointer;
        }

        #frameHelper.expanded {
            width: 600px; /* Expanded width */
        }

        .frame-content, .dynamic-content {
            display: none;
        }

        #frameHelper.expanded .frame-content,
        #frameHelper.expanded .dynamic-content {
            display: block;
        }
        .top-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .select-container, .icon-container {
            padding: 5px;
        }

        .icon-container i {
            cursor: pointer;
        }
        .arrow{
              position: relative;
              display: inline-block;
              padding-left: 20px;
            }

            .arrow::before{
              content: '';
              width: 6px;
              height: 6px;
              border: 0px;
              border-top: solid 2px #5bc0de;
              border-right: solid 2px #5bc0de;
              -ms-transform: rotate(45deg);
              -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
              position: absolute;
              top: 50%;
              left: 0;
              margin-top: -4px;
            }
    `);

    // 创建侧边栏元素
    const frameHelper = document.createElement('div');
    frameHelper.id = 'frameHelper';
    frameHelper.className = 'bg-gray-100 text-gray-800 p-1 rounded-lg shadow transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-200';
    document.body.appendChild(frameHelper);

    // 创建顶部容器，用于放置select和图标
    const topContainer = document.createElement('div');
    topContainer.className = 'top-container flex justify-between items-center mb-1'; //'frame-content flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow';
    frameHelper.appendChild(topContainer);

    // 创建并配置select容器
    const selectContainer = document.createElement('div');
    selectContainer.className = 'select-container';
    // 创建select元素
    const selectElement = document.createElement('select');
    selectElement.className = 'flex-grow';
    // 添加选项到select...
    selectElement.addEventListener('change', function() {
        if('-请选择-' == this.value )
            return false;
        loadFrameworkData(this.value);
    });
    selectContainer.appendChild(selectElement);

    // 创建并配置图标容器
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container flex-shrink-0 ml-1 arrow';
    iconContainer.addEventListener('click', function() {
        // 切换侧边栏大小的逻辑
        const frameHelper = document.getElementById('frameHelper');
        frameHelper.classList.toggle('expanded');
    });
    // 创建缩放图标
    // 使用Font Awesome图标
    const shrinkIcon = document.createElement('i');
    shrinkIcon.className = 'fas fa-angle-double-right text-gray-600 hover:text-gray-800 cursor-pointer';
    shrinkIcon.style.fontSize = '1.25rem';
    shrinkIcon.style.fontSize = '20px'; // 调整图标大小

    iconContainer.appendChild(shrinkIcon);

    // START FRAMEWORKS
    // END FRAMEWORKS

    // 组装顶部容器
    topContainer.appendChild(selectContainer);
    topContainer.appendChild(iconContainer);

    // 动态内容区域
    const dynamicContentDiv = document.createElement('div');
    dynamicContentDiv.className = 'dynamic-content p-1';
    frameHelper.appendChild(dynamicContentDiv);

    // 加载框架数据
    function loadFrameworkData(frameworkName) {
        // 假设frameworks变量已经定义并包含所有框架数据
        const data = frameworks.find(framework => Object.keys(framework)[0] === frameworkName);
        
        if (data) {
            const frameworkData = data[frameworkName];
            updateDynamicContent(frameworkData);
        } else {
            console.error('Framework data not found for:', frameworkName);
        }
    }

    // 更新动态内容区域
    function updateDynamicContent(frameworkData) {
        dynamicContentDiv.innerHTML = ''; // 清除现有内容
        // 根据框架数据创建新的UI元素（例如，输入框和标签）
        const description = document.createElement('p');
        description.textContent = frameworkData.description;
        dynamicContentDiv.appendChild(description);

        // 遍历fields创建输入框和标签
        frameworkData.fields.forEach(fieldObj => {
            // 直接使用Object.entries获取键值对
            Object.entries(fieldObj).forEach(([fieldName, field]) => {
                const fieldLabel = document.createElement('label');
                fieldLabel.className = 'block text-gray-700 text-sm font-bold mb-1';
                fieldLabel.textContent = fieldName + ": ";
                if (field.info) {
                    // 添加info文本，用灰色文字表示
                    const infoText = document.createElement('span');
                    infoText.textContent = ` (${field.info})`;
                    infoText.style.color = 'grey';
                    fieldLabel.appendChild(infoText);
                }
                const textarea = document.createElement('textarea');
                textarea.className = 'w-full p-1 border border-gray-300 rounded-md'; // Tailwind类

                // 处理text，可能是数组也可能是字符串
                let textContent = '';
                if (Array.isArray(field.text)) {
                    textContent = field.text.map(textItem => {
                        if (typeof textItem === 'string') {
                            return textItem;
                        } else if (typeof textItem === 'object') {
                            return Object.values(textItem).join('\n');
                        }
                    }).join('\n');
                } else {
                    textContent = field.text;
                }

                textarea.setAttribute('placeholder', textContent);
                textarea.setAttribute('name', fieldName);

                dynamicContentDiv.appendChild(fieldLabel);
                //dynamicContentDiv.appendChild(document.createElement('br'));
                dynamicContentDiv.appendChild(textarea);
                dynamicContentDiv.appendChild(document.createElement('br'));
            });
        });

        // 提交按钮
        const submitButton = document.createElement('button');
        submitButton.textContent = '发送';
        submitButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
        submitButton.onclick = () => submitForm(frameworkData.fields);

        dynamicContentDiv.appendChild(submitButton);
    }

    // 初始化下拉框选项
    function initSelectOptions() {
        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-请选择-';
        selectElement.appendChild(defaultOption);
    
        // 遍历frameworks数组创建选项
        frameworks.forEach(framework => {
            // 获取框架的键名和值
            const key = Object.keys(framework)[0]; // 框架的键名（如"BROKE"）
            const value = framework[key]; // 框架的值，包含name, author等
    
            // 创建选项
            const option = document.createElement('option');
            option.value = key; // 选项的value是框架的键名
            option.textContent = `${value.name}-${value.description}`; // 选项的文本是框架的名称和描述
            selectElement.appendChild(option);
        });
    }
    
    // 提交表单的逻辑
    function submitForm(fields) {
        let prompt = "";
        Object.keys(fields).forEach(fieldName => {
            const input = document.querySelector(`textarea[name="${fieldName}"]`);
            prompt += `${fieldName}:\n${input.value}\n\n`;
        });
        $('#prompt-textarea').val(prompt);

        // 这里应该将prompt发送给ChatGPT的输入框
        console.log(prompt); // 示例：打印到控制台
    }

    initSelectOptions(); // 调用函数来填充下拉框

    // 鼠标悬停和移开事件
    frameHelper.addEventListener('mouseenter', function() {
        this.classList.add('expanded');
    });

    frameHelper.addEventListener('mouseleave', function() {
        //this.classList.remove('expanded');
        //this.innerText = '框架助手';
    });
})();

