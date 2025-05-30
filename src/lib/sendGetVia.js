const typeNames = new Map(Object.entries({
    link: {name: 'a', link: 'href'},
    image: {name: 'img', link: 'src'},
    audio: {name: 'audio', link: 'src'},
    video: {name: 'video', link: 'src'}
}));

const sendGetVia = (mediaType, url) => {
    console.log('params:', {mediaType, url});
    const {name, link} = typeNames.get(mediaType);
    console.log('found typeName', {name, link});
    const element = document.createElement(name);
    element[link] = url;
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export default sendGetVia;