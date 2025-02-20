import { getPlugins } from '../handlers/pluginHandler.js';
import { inlineCode } from '../helper/formatted.js';
import { readFileSync } from 'fs'; // Import the required module to read files

export default {
  name: 'أمر القائمة',
  command: ['توضيح'],
  category: 'إدارة',
  description: 'يعرض الأوامر المتاحة',
  args: [],
  execution: ({ sock, m, args, prefix, sleep }) => {
    const plugins = getPlugins();
    let menu = `_*Sakamoto Days*_
\n\n❉❉\n\n`;

    const categories = {};

    plugins.forEach((plugin) => {
      if (plugin.hidden) return;

      if (!categories[plugin.category]) {
        categories[plugin.category] = [];
      }

      // تحقق من وجود plugin.args
      const commandList = plugin.command
        .map((cmd) => {
          // إذا كانت plugin.args موجودة و هي مصفوفة، نستخدم join، وإذا لم تكن موجودة نعرض الأمر بدون args
          if (plugin.args && Array.isArray(plugin.args)) {
            return `${inlineCode(cmd)} ${plugin.args.join('/')}`;
          } else {
            return inlineCode(cmd); // إذا لم تكن plugin.args موجودة، نعرض الأمر فقط
          }
        })
        .join('\n');

      categories[plugin.category].push(commandList);
    });

    Object.keys(categories).forEach((category) => {
      menu += `
*༺❯════⊰👑⊱════❮༻*
❀﹞⊰┋${category}┋
${categories[category].join('\n')}

`;
    });

    menu += `
*༺❯════⊰👑⊱════❮༻*

_*SAKAMOTO*_`;

    // Read the image file
    const imageBuffer = readFileSync('./1.png');

    // Send the image with the menu text
    sock.sendMessage(m.key.remoteJid, {
      image: imageBuffer,
      caption: menu,
    });
  },
  hidden: false,
};