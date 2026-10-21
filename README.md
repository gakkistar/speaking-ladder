# 口语阶梯

英语口语练习工具：选一集故事，生成提示词贴到 ChatGPT 里用语音练，练完把复习卡存下来，下次 AI 会先考你。

单个网页，可以在电脑浏览器里用，也可以在 iPad、iPhone 上添加到主屏幕，当成 App 用，没有网络也能打开。

## 在 iPad / iPhone 上添加到主屏幕

1. 用 **Safari** 打开网址（其他浏览器不行）。
2. 点「分享」按钮（方框加向上箭头）：iPad 在右上角地址栏旁边，iPhone 在底部。
3. 在列表里找到「添加到主屏幕」，点「添加」。
4. 以后从主屏幕的「口语阶梯」图标打开。

第一次打开要联网。打开过一次以后，没网也能用。

## 复习卡存在哪里：云同步

复习卡和练习设置默认只存在当前这台设备的浏览器里。主屏幕上的 App 和 Safari 里打开的网页也各存一份。

想在 iPad、Mac、手机之间共用同一份复习卡，就打开**云同步**：复习卡会存进你 GitHub 账号下的一个私密 Gist，每台设备打开页面、切回页面、存卡或删卡后都会自动同步，练到第几集也会跟着走。

第一次设置：

1. 在 Mac 上打开本页 →「复习本」→「云同步」→「怎么拿到令牌」，点里面的链接（已经预先勾好 gist 权限）。
2. Expiration 选 No expiration 或一年，拉到底点 Generate token，复制 `ghp_` 开头的令牌。**这个令牌只显示一次，存到备忘录或密码管理里。**
3. 贴到「云同步」的输入框里，点「连接」。
4. 在 iPad、手机上（主屏幕 App 里）也各贴一次同一个令牌。

要知道的：

- 私密 Gist 没有加密，拿到链接的人能看到里面的英语句子，但链接猜不到，也搜不到。
- 令牌只存在各台设备的浏览器里，不会写进 Gist，也不会出现在「导出」里。不要发给别人；万一泄露，到 GitHub 的 Settings → Developer settings → Personal access tokens 里删掉它，再建一个新的。
- 不想用了就点「断开」，这台设备上的卡还在。
- 云端的 Gist 名字是「口语阶梯复习卡」，里面的 `speaking-ladder.json` 不要手动改。

「复习本」里的「导出」「导入」照样能用，可以当作备份：隔一段时间导出一次，自己留一份。

## 以后改内容

所有内容都在 `index.html` 里：

| 想改的东西 | 在 `index.html` 里找 |
| --- | --- |
| 11 个级别（说明、语法单元、句式、话题） | `const LEVELS` |
| 33 集故事 | `const EPISODES` |
| 每级复习的场景 | `const REVIEWS` |
| 重演时的变化 | `const TWISTS` |
| 自由聊的话题 | `const TOPICS` |
| 提示词末尾的 Murphy 单元表 | `const UNIT_MAP` |
| 提示词的拼法 | `buildPrompt` 及上面的 `storyNew`、`storyReplay`、`storyReview`、`freePrompt`、`talkRules`、`tail` |
| 页面上的文字和样式 | `<body>` 里的 HTML、`<head>` 里的 `<style>` |

**改完之后，一定要把 `sw.js` 第一行附近的 `VERSION` 改大一点**（比如 `v4` 改成 `v5`）。这个页面会被缓存起来供离线使用，不改版本号的话，手机上会一直显示旧内容。

推送到 GitHub 以后，等一两分钟让 Pages 更新。手机上把 App 完全关掉再打开，一般要这样打开两次才会看到新内容。

## 文件

- `index.html`：整个页面，包括数据、逻辑和样式
- `manifest.webmanifest`：添加到主屏幕时用的名称、图标和颜色
- `sw.js`：离线缓存
- `icons/`：App 图标

本地预览：

```bash
python3 -m http.server 8000
```

然后打开 <http://localhost:8000>。
