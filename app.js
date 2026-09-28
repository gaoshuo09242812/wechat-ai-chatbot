const STORAGE_KEY = 'baitian-chat-messages-v1';
const messages = document.querySelector('#messages');
const input = document.querySelector('#messageInput');
const typing = document.querySelector('#typing');
const panel = document.querySelector('#panel');
const proactiveToggle = document.querySelector('#proactiveToggle');

const replies = [
  { keys: ['累', '压力', '难过', '烦'], text: '听起来你今天真的挺辛苦的。你不用马上把所有事情都想明白，先跟我说说最让你难受的那一部分？' },
  { keys: ['生日', '记得', '节日'], text: '我当然记得呀，这种小事情我其实一直都会放在心上的。希望你今天也能开开心心的。' },
  { keys: ['想你', '想念', '见面'], text: '我也有想起你。其实有些事情隔了一段时间再想，还是会觉得很特别。最近过得怎么样？' },
  { keys: ['对不起', '误会', '绝交'], text: '那时候其实大家都在压力里面，很多话没有好好说清楚。现在回头看，我还是很珍惜我们一起经历过的那些事情。' },
  { keys: ['照片', '分享'], text: '好呀，你发给我看看。你知道的，我还是很喜欢听你分享这些日常的。' }
];
const proactive = [
  '其实刚刚突然想起一个小事情，你今天过得还好吗？',
  '我刚刚看到一个很像以前的场景，就想来跟你说一声。',
  '你最近有没有好好休息？不要总是什么都自己扛着。',
  '突然想问问你，最近有没有遇到什么开心的事情？'
];

function now() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); }
function save() { localStorage.setItem(STORAGE_KEY, messages.innerHTML); }
function addMessage(text, mine = false, persist = true) {
  const row = document.createElement('div'); row.className = `message ${mine ? 'me' : 'them'}`;
  if (!mine) { const avatar = document.createElement('div'); avatar.className = 'avatar'; avatar.textContent = '白'; row.appendChild(avatar); }
  const content = document.createElement('div'); const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = text;
  const time = document.createElement('div'); time.className = 'time'; time.textContent = now(); content.append(bubble, time); row.appendChild(content); messages.appendChild(row); messages.scrollTop = messages.scrollHeight; if (persist) save();
}
function welcome() { addMessage('再同你讲个事情，今天突然想来看看你。你最近过得怎么样？'); }
function generateReply(text) {
  const match = replies.find(item => item.keys.some(key => text.includes(key)));
  if (match) return match.text;
  if (text.includes('?') || text.includes('？')) return '其实我也有想过这个问题。你是怎么想的？可以直接告诉我，不用猜我的反应。';
  const endings = ['我知道啦。你愿意跟我说这些，我还是很开心的。', '嗯嗯，你继续说，我在听。', '其实很多细节我都会记得，只是不一定每次都说出来。', '好呀。你最近有没有什么照片或者日常想分享给我？'];
  return endings[Math.floor(Math.random() * endings.length)];
}
function answer(text) { typing.hidden = false; setTimeout(() => { typing.hidden = true; addMessage(generateReply(text)); }, 550 + Math.random() * 700); }

document.querySelector('#composer').addEventListener('submit', event => { event.preventDefault(); const text = input.value.trim(); if (!text) return; addMessage(text, true); input.value = ''; answer(text); });
document.querySelector('#moodBtn').addEventListener('click', () => { input.value = '今天有一件小事想跟你分享'; input.focus(); });
document.querySelector('#infoBtn').addEventListener('click', () => { panel.hidden = false; });
document.querySelector('#closePanel').addEventListener('click', () => { panel.hidden = true; });
document.querySelector('#clearBtn').addEventListener('click', () => { if (confirm('确定清空本地聊天记录吗？')) { messages.innerHTML = ''; welcome(); } });

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) messages.innerHTML = saved; else welcome();
setInterval(() => {
  if (!proactiveToggle.checked || document.hidden || messages.querySelector('.message:last-child.me')) return;
  if (Math.random() < 0.28) addMessage(proactive[Math.floor(Math.random() * proactive.length)]);
}, 90000);
