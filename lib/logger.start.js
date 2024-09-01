import chalk from "chalk"

const art = `
                         ⢀⡠⢔⣦⣶⣿⣿⣿⣿⡷⠖⠒        ⣀ ⠉⠁⠂  ⢀ 
        ⣰⠶⣦⡤⣄      ⣠⠖⢩⣶⣿⣿⣿⣿⣿⠟⢉⣠⠔⠊⠁   ⣀⣄  ⠉⠑⢦⣠⣤⣤⡀  
        ⠘⢷⣌⡧⡾    ⡠⠊⢁⣴⣿⣿⣿⣿⣿⢟⣠⡾⠟⠁ ⣀⣤⣶⠞⣫⠟⠁ ⢀⠄ ⢀⠙⢿⣿⣿⣷⣄
    ⢠     ⠉⠉⠁  ⣠⣾⣶⣶⣿⣿⣿⣿⣿⣿⣷⡿⠋⣀⣤⣶⣿⣿⣋⣴⡞⠁  ⣠⠊  ⢸⡄⢨⣿⣿⣿⣿
     ⢃        ⣼⣿⣿⣿⠿⠿⢻⣿⣿⣿⣿⣿⣿⠿⠛⢉⣴⣿⢿⣿⠏   ⡴⠃⣰⢀ ⢸⣿⣤⣏⢻⣿⣿
     ⠘⡆     ⢀⣾⡿⣿⡿⠁ ⢀⣾⣿⣿⣿⡿⠋⠁ ⣠⣿⠟⢡⣿⡟ ⢀⣤⣾⠁⣼⣿⢸⡇⢸⣿⣿⣿⡈⣿⣿
      ⡇    ⢀⣾⠋⣼⣿⠁⢀ ⣼⣿⣿⠟⠁   ⣰⡿⠋⢠⣿⡿⠁⢠⣾⣿⡏⢀⣿⣿⣾⣿⢸⣿⣿⣿⡇⢹⣿
   ⢰⡶⣤⣤⣄   ⡼⠁⣼⣿⣿⣾⣿⣰⣿⠟⠁    ⢠⡿⠁ ⣾⣿⠃⢠⣿⢿⡿⠁⠸⢿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿
   ⠘⣧⣈⣷⡟  ⣰⠁⡼⢻⣿⣿⣿⣿⡿⠋  ⠂⠒⠒⠒⣾⠋ ⢠⣿⡏⢠⣿⢃⡿⠁  ⢸⣿⣿⣿⣿⣿⣿⣿⣿ ⣿
    ⠈⠉⠁  ⢠⠇⣰⠁⠸⣹⣿⣿⠟       ⠐⡇  ⢸⣿⢃⣿⠋⣿⡀   ⠈⣿⣿⣿⣿⣿⣿⣿⣿ ⡇
         ⠘⣰⠃⡀⢀⣿⣿⡏⢘⣶⣶⣶⣷⣒⣄     ⠸⣿⣾⠃⠰⠁⠙⢦⡀  ⢹⣿⣿⣿⣿⣿⣿⣿⢠⡇
         ⡔⢁⠞⢁⣾⣿⣿⣷⠟⠁⣠⣾⣿⣿⣧      ⣿⡏     ⠙⢦⡀ ⢿⣿⣿⣿⣿⣿⣿⣸⠃
       ⣠⣾⡖⠁⣠⣾⣿⣿⣿⡏ ⢰⠿⢿⣿⣯⣼⠁     ⠹        ⠈⠢⢬⣿⣿⡘⣿⣿⣏⣿ 
     ⣠⣾⢟⠋⣠⣾⣿⡿⠋⢿⣿  ⢼  ⢀⣿⣿           ⣙⣷⣴⣆⡀  ⠈⢿⣧⠸⣿⣿⣿⣿
  ⢀⡤⠞⢋⣴⣯⣾⡿⠟⠋  ⢸⣿⡆ ⠸⡀⠉⢉⡼⠃          ⣰⣿⣿⣿⣿⣿⣶⣆ ⠈⢿⣧⠹⣿⣿⣿
   ⣸⣶⣿⣿⠟⠋    ⣴⡎⠈⠻⡀⠈⠛⠋⠉           ⢰⠿⠛⠛⠻⣿⣬⡏⠻⣷⡀⠈⢻⣿⣿⣿⣿
⢂⣠⣴⣿⡿⢋⣼⣿⣿⣿⣿⣿⠋⢹                   ⠺⡄  ⢀⡾⣿⠁ ⢹⡇ ⢠⣿⣿⣿⣿
⣿⣿⣽⣯⣴⣿⣿⠿⡿⠟⠛⢻⡤⠚⠢⡀                 ⠸⡇⠈⠉⢉⡴⠃  ⢸⠇⢠⣿⣿⣿⣿⣿
⣿⡇⣿⠿⣯⡀  ⠈⣦⡴⠋  ⢀⠨⠓⠤⡀              ⠈⠻⠷⠒⠋    ⠃⣴⣿⠿⣡⣿⠏ 
⠁ ⠃ ⠈⠳⣤⠴⡻⠋ ⢀⡠⠊⠁  ⢀⡽⢄ ⠘⡄                 ⢀⣴⣾⣿⠏⣺⠟⠁  
     ⡰⠋⢰⠁     ⣀⠤⠊⠁  ⢱⡀⠘⢆⡀⣀            ⠠⠖⠛⠛⢉⣤⠞⠁    
    ⡜⠁ ⠈⢢⡀    ⠁   ⣀⠔⠋⢱                  ⣠⡞⠉   ⣀  ⠈
   ⡜    ⢰⠑⢄      ⠊ ⢀⣀⢀⠇ ⡠⠒⠒⢶⠈⠉⠑⡖⠈⠓⢢⠤⢄⣀⣴⣾⣏⠉⠛⠋⠉⠉   ⢠
        ⢸  ⠑⣄⡀      ⣹⡿⢤⣼⠃  ⢸   ⡇  ⢸  ⠈⣿⣿⣿⣦⣀⣀⣀⣀⣀⣶⢶⣿
     ⣠⠔⠒⢻   ⠃⠉⠒⠤⣀⡀⠤⠚⠁⣇⡰⠿          ⠌  ⣰⠟⠋⠁    ⠈⠉⠛⠦⡻
     ⠁              ⣼⡏              ⢠⠃           ⠈
        ⠑          ⢀⠃⠹⣄            ⢠⠃             
                   ⠚  ⠈⠓⠤⣀⡀     ⢀⣠⠔⠁              
                         ⢀⠈⠉⠉⠉⠉⠉⡁
`;

const colors = [
    chalk.red,
    chalk.green,
    chalk.yellow,
    chalk.blue,
    chalk.magenta,
    chalk.cyan,
    chalk.white,
];

const artLines = art.split('\n');
const coloredArt = artLines.map((line, index) => {
    const color = colors[index % colors.length];
    return color(line);
}).join('\n');


export default coloredArt