// ==UserScript==
// @name         ChatGPT 框架助手
// @namespace    http://tampermonkey.net/
// @version      0.1
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
    `);

    // 创建侧边栏元素
    const frameHelper = document.createElement('div');
    frameHelper.id = 'frameHelper';
    frameHelper.className = 'bg-gray-100 text-gray-800 p-4 rounded-lg shadow transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-200';
    document.body.appendChild(frameHelper);

    // 创建顶部容器，用于放置select和图标
    const fixedContentDiv = document.createElement('div');
    fixedContentDiv.className =  'frame-content flex justify-between items-center mb-4'; //'frame-content flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow';
    frameHelper.appendChild(fixedContentDiv);

    // 创建select元素
    const selectElement = document.createElement('select');
    selectElement.className = 'block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline';
    // 添加选项到select...
    selectElement.addEventListener('change', function() {
        if('-请选择-' == this.value )
            return;
        loadFrameworkData(this.value);
    });
    fixedContentDiv.appendChild(selectElement);

    // 创建缩放图标
    // 使用Font Awesome图标
    const shrinkIcon = document.createElement('i');
    shrinkIcon.className = 'fas fa-compress-arrows-alt cursor-pointer';
    shrinkIcon.style.fontSize = '20px'; // 调整图标大小
    shrinkIcon.addEventListener('click', function() {
        // 切换侧边栏大小的逻辑
        const frameHelper = document.getElementById('frameHelper');
        frameHelper.classList.toggle('expanded');
    });

    fixedContentDiv.appendChild(shrinkIcon);

    // 动态内容区域
    const dynamicContentDiv = document.createElement('div');
    dynamicContentDiv.className = 'dynamic-content p-4';
    frameHelper.appendChild(dynamicContentDiv);

    // 加载框架数据
    function loadFrameworkData(frameworkName) {
        const url = `https://raw.githubusercontent.com/iaiuse/PromptFrameworksHelper/main/frameworks/${frameworkName}.json?ver=`+Math.random();

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                updateDynamicContent(data);
            }
        });
    }

    // 更新动态内容区域
    function updateDynamicContent(frameworkData) {
        dynamicContentDiv.innerHTML = ''; // 清除现有内容
        // 根据框架数据创建新的UI元素（例如，输入框和标签）
        const description = document.createElement('p');
        description.textContent = frameworkData.description;
        dynamicContentDiv.appendChild(description);

        // 遍历fields创建输入框
        Object.entries(frameworkData.fields).forEach(([fieldName, field]) => {
            const fieldLabel = document.createElement('label');
            fieldLabel.className = 'block text-gray-700 text-sm font-bold mb-2';

            fieldLabel.textContent = fieldName + ": ";
            const textarea = document.createElement('textarea');
            textarea.className = 'w-full p-2 border border-gray-300 rounded-md'; // Tailwind类
            textarea.setAttribute('placeholder', field.text);
            textarea.setAttribute('name', fieldName);

            dynamicContentDiv.appendChild(fieldLabel);
            //dynamicContentDiv.appendChild(document.createElement('br'));
            dynamicContentDiv.appendChild(textarea);
            dynamicContentDiv.appendChild(document.createElement('br'));
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
        const frameworks = ['-请选择-','BROKE', 'ICIO']; // 示例：框架列表
        frameworks.forEach(framework => {
            const option = document.createElement('option');
            option.value = framework;
            option.textContent = framework;
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
