const myColor = ['bg-cyan-500', 'bg-green-600', 'bg-pink-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-fuchsia-500', 'bg-indigo-500', 'bg-lime-600', 'bg-slate-600'];
const randomColor = () => {
    const colorIndex = Math.floor(Math.random() * myColor.length);
    return myColor[colorIndex]
};

module.exports = randomColor